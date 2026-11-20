<?php

namespace App\Services;

use App\Models\Missings;
use App\Models\Product;
use App\Models\UserRequest;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;
use Illuminate\Validation\ValidationException;

class RequestLifecycleService
{
    public function accept(UserRequest $request): bool
    {
        return DB::transaction(function () use ($request) {
            $locked = UserRequest::whereKey($request->request_id)
                ->lockForUpdate()
                ->firstOrFail();

            if ($locked->request_status === 'accepted') {
                return false;
            }

            if (in_array($locked->request_status, ['done', 'rejected'], true)) {
                throw ValidationException::withMessages([
                    'request_status' => 'Cannot accept a completed or rejected request.',
                ]);
            }

            $pivots = DB::table('request_products')
                ->where('request_id', $locked->request_id)
                ->lockForUpdate()
                ->get();

            $neededByProduct = [];
            foreach ($pivots as $pivot) {
                $productId = (int) $pivot->product_id;
                $neededByProduct[$productId] = ($neededByProduct[$productId] ?? 0) + max(0, (int) $pivot->quantity);
            }

            if (!empty($neededByProduct)) {
                $productIds = array_keys($neededByProduct);
                sort($productIds, SORT_NUMERIC);

                $products = Product::whereIn('product_id', $productIds)
                    ->orderBy('product_id', 'asc')
                    ->lockForUpdate()
                    ->get()
                    ->keyBy('product_id');

                foreach ($neededByProduct as $productId => $neededQty) {
                    $product = $products->get($productId);
                    $available = (int) ($product?->inventory_quantity ?? 0);

                    if (!$product || $available < $neededQty) {
                        $name = $product?->pr_name ?? "Product #{$productId}";
                        throw ValidationException::withMessages([
                            'inventory' => "Insufficient inventory for {$name}. Available: {$available}, needed: {$neededQty}.",
                        ]);
                    }
                }

                foreach ($neededByProduct as $productId => $neededQty) {
                    if ($neededQty > 0) {
                        DB::table('products')
                            ->where('product_id', $productId)
                            ->decrement('inventory_quantity', $neededQty);
                    }
                }
            }

            $locked->update([
                'request_status' => 'accepted',
            ]);

            return true;
        });
    }

    public function processDelayedPendingRequests(): int
    {
        $pendingIds = UserRequest::where('request_status', 'pending')
            ->whereNotNull('expiry_time')
            ->where('expiry_time', '<=', now())
            ->orderBy('request_id', 'asc')
            ->pluck('request_id');

        $acceptedCount = 0;

        foreach ($pendingIds as $requestId) {
            try {
                $request = UserRequest::find($requestId);
                if ($request && $this->accept($request)) {
                    $acceptedCount++;
                }
            } catch (ValidationException $e) {
                Log::warning('Skipping delayed auto-accept due to validation or inventory constraint.', [
                    'request_id' => $requestId,
                    'errors' => $e->errors(),
                ]);
            }
        }

        return $acceptedCount;
    }

    public function done(UserRequest $request, ?array $productsData = null): bool
    {
        return DB::transaction(function () use ($request, $productsData) {
            $locked = UserRequest::whereKey($request->request_id)
                ->lockForUpdate()
                ->firstOrFail();

            if ($locked->request_status === 'done') {
                return false;
            }

            if ($locked->request_status !== 'accepted') {
                throw ValidationException::withMessages([
                    'request_status' => 'Only accepted requests can be completed.',
                ]);
            }

            $pivots = DB::table('request_products')
                ->where('request_id', $locked->request_id)
                ->orderBy('request_product_id', 'asc')
                ->lockForUpdate()
                ->get()
                ->keyBy('request_product_id');

            $productIds = $pivots->pluck('product_id')
                ->filter()
                ->unique()
                ->map(fn ($id) => (int) $id)
                ->sort()
                ->values()
                ->all();

            if (!empty($productIds)) {
                Product::whereIn('product_id', $productIds)
                    ->orderBy('product_id', 'asc')
                    ->lockForUpdate()
                    ->get();
            }

            if ($productsData !== null) {
                $processedPivotIds = [];

                foreach ($productsData as $pData) {
                    $reqProdId = $pData['request_product_id'] ?? null;
                    $productId = $pData['product_id'] ?? null;

                    $pivot = $reqProdId !== null ? $pivots->get((int) $reqProdId) : null;
                    if (!$pivot && $productId !== null) {
                        $pivot = $pivots->first(function ($item) use ($productId, $processedPivotIds) {
                            return (int) $item->product_id === (int) $productId
                                && !isset($processedPivotIds[$item->request_product_id]);
                        });
                    }

                    if (!$pivot) {
                        throw ValidationException::withMessages([
                            'products' => 'Submitted product row does not belong to this request.',
                        ]);
                    }

                    if (isset($processedPivotIds[$pivot->request_product_id])) {
                        continue;
                    }
                    $processedPivotIds[$pivot->request_product_id] = true;

                    $rentedQty = max(0, (int) $pivot->quantity);
                    $checkedQnty = (int) ($pData['checked_qnty'] ?? 0);

                    if ($checkedQnty < 0 || $checkedQnty > $rentedQty) {
                        throw ValidationException::withMessages([
                            'products' => "Returned quantity ({$checkedQnty}) must be between 0 and {$rentedQty}.",
                        ]);
                    }

                    $uncheckedQnty = $rentedQty - $checkedQnty;
                    $comment = $pData['comment'] ?? null;
                    $shortfallReason = $pData['shortfall_reason'] ?? 'missing';

                    DB::table('request_products')
                        ->where('request_product_id', $pivot->request_product_id)
                        ->update([
                            'checked_qnty' => $checkedQnty,
                            'unchecked_qnty' => $uncheckedQnty,
                            'comment' => $comment,
                            'updated_at' => now(),
                        ]);

                    if ($checkedQnty > 0) {
                        DB::table('products')
                            ->where('product_id', $pivot->product_id)
                            ->increment('inventory_quantity', $checkedQnty);
                    }

                    if ($uncheckedQnty > 0 && $shortfallReason === 'missing') {
                        Missings::create([
                            'request_id' => $locked->request_id,
                            'osra_code' => $locked->osra_code,
                            'user_id' => $locked->user_id,
                            'product_id' => $pivot->product_id,
                            'quantity' => $uncheckedQnty,
                            'comment' => $comment,
                        ]);
                    }
                }
            } else {
                foreach ($pivots as $pivot) {
                    $rentedQty = max(0, (int) $pivot->quantity);
                    $checkedQnty = (int) ($pivot->checked_qnty ?? 0);

                    if ($checkedQnty < 0 || $checkedQnty > $rentedQty) {
                        throw ValidationException::withMessages([
                            'products' => "Returned quantity ({$checkedQnty}) must be between 0 and {$rentedQty}.",
                        ]);
                    }

                    $uncheckedQnty = max(0, (int) ($pivot->unchecked_qnty ?? ($rentedQty - $checkedQnty)));

                    if ($checkedQnty > 0) {
                        DB::table('products')
                            ->where('product_id', $pivot->product_id)
                            ->increment('inventory_quantity', $checkedQnty);
                    }

                    if ($uncheckedQnty > 0) {
                        Missings::create([
                            'request_id' => $locked->request_id,
                            'osra_code' => $locked->osra_code,
                            'user_id' => $locked->user_id,
                            'product_id' => $pivot->product_id,
                            'quantity' => $uncheckedQnty,
                            'comment' => $pivot->comment,
                        ]);
                    }
                }
            }

            $locked->update([
                'request_status' => 'done',
            ]);

            return true;
        });
    }

    public function reject(UserRequest $request): bool
    {
        return DB::transaction(function () use ($request) {
            $locked = UserRequest::whereKey($request->request_id)
                ->lockForUpdate()
                ->firstOrFail();

            if (in_array($locked->request_status, ['rejected', 'done'], true)) {
                return false;
            }

            if ($locked->request_status === 'accepted') {
                $pivots = DB::table('request_products')
                    ->where('request_id', $locked->request_id)
                    ->lockForUpdate()
                    ->get();

                $restoreByProduct = [];
                foreach ($pivots as $pivot) {
                    $productId = (int) $pivot->product_id;
                    $restoreByProduct[$productId] = ($restoreByProduct[$productId] ?? 0) + max(0, (int) $pivot->quantity);
                }

                if (!empty($restoreByProduct)) {
                    $productIds = array_keys($restoreByProduct);
                    sort($productIds, SORT_NUMERIC);

                    Product::whereIn('product_id', $productIds)
                        ->orderBy('product_id', 'asc')
                        ->lockForUpdate()
                        ->get();

                    foreach ($restoreByProduct as $productId => $qty) {
                        if ($qty > 0) {
                            DB::table('products')
                                ->where('product_id', $productId)
                                ->increment('inventory_quantity', $qty);
                        }
                    }
                }
            }

            $locked->update([
                'request_status' => 'rejected',
            ]);

            return true;
        });
    }

    public function returnMissing(int $missingId, int $qtyToReturn): void
    {
        DB::transaction(function () use ($missingId, $qtyToReturn) {
            $missing = Missings::whereKey($missingId)
                ->lockForUpdate()
                ->firstOrFail();

            if ($qtyToReturn < 1 || $qtyToReturn > (int) $missing->quantity) {
                throw ValidationException::withMessages([
                    'quantity_to_return' => 'Cannot return more than the missing quantity.',
                ]);
            }

            $newQty = (int) $missing->quantity - $qtyToReturn;
            if ($newQty <= 0) {
                $missing->delete();
            } else {
                $missing->update(['quantity' => $newQty]);
            }

            if ($missing->product_id) {
                Product::whereKey($missing->product_id)
                    ->lockForUpdate()
                    ->first();

                DB::table('products')
                    ->where('product_id', $missing->product_id)
                    ->increment('inventory_quantity', $qtyToReturn);
            }

            $pivots = DB::table('request_products')
                ->where('request_id', $missing->request_id)
                ->where('product_id', $missing->product_id)
                ->where('unchecked_qnty', '>', 0)
                ->orderBy('request_product_id', 'asc')
                ->lockForUpdate()
                ->get();

            $remainingToReturn = $qtyToReturn;
            foreach ($pivots as $pivot) {
                if ($remainingToReturn <= 0) {
                    break;
                }

                $availableToReduce = (int) $pivot->unchecked_qnty;
                $reduceAmount = min($remainingToReturn, $availableToReduce);

                DB::table('request_products')
                    ->where('request_product_id', $pivot->request_product_id)
                    ->update([
                        'checked_qnty' => (int) $pivot->checked_qnty + $reduceAmount,
                        'unchecked_qnty' => $availableToReduce - $reduceAmount,
                        'updated_at' => now(),
                    ]);

                $remainingToReturn -= $reduceAmount;
            }
        });
    }
}
