<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Jobs\ProcessRequest;
use App\Models\UserRequest;
use App\Models\Missings;
use App\Models\Cart;
use App\Models\Osra;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;

class RequestController extends Controller
{
    public function index()
    {
        $requests = UserRequest::with([
            'user:user_id,full_name',
            'products:product_id,pr_name',
            'osra:osra_code,osra_name'
        ])
        ->where('user_id', Auth::id())
        ->orderBy('created_at', 'desc')
        ->get()
        ->map(function ($req) {
            $req->display_time = $req->display_time;
            return $req;
        });
        $user = Auth::user();
        $cartItems = [];

        if ($user && $user->cart) {
            $cartItems = $user->cart->products()
                ->pluck('products.product_id')
                ->toArray();
        }

        $cart_items_count = count($cartItems);

        return inertia('Requests', [
            'requests' => $requests,
            'cart_items_count' => $cart_items_count,
        ]);
    }

    public function show($id)
    {
        $request = UserRequest::with([
            'user:user_id,full_name',
            'osra:osra_code,osra_name',
            'products.images'
        ])->findOrFail($id);

        $request->products->each(function ($product) {
            $product->pivot->loadMissing(['color', 'size']);
        });
        $user = Auth::user();
        $cartItems = [];

        if ($user && $user->cart) {
            $cartItems = $user->cart->products()
                ->pluck('products.product_id')
                ->toArray();
        }

        $cart_items_count = count($cartItems);

        return inertia('RequestShow', [
            'request' => $request,
            'cart_items_count' => $cart_items_count,
        ]);
    }

    public function createFromCart(Request $request)
    {
        $request->validate([
            'osra_code' => 'nullable|exists:osra,osra_code',
            'osra_time' => 'nullable|string',
            'start_date' => 'nullable|date',
            'end_date' => 'nullable|date|after_or_equal:start_date',
            'start_time' => 'nullable|date_format:H:i',
            'end_time' => 'nullable|date_format:H:i|after:start_time',
            'total_price' => 'nullable|numeric|min:0',
            'osra_date' => 'nullable',
            'osra_numeric_time' => 'nullable',
            'expiry_time' => 'nullable'
        ]);

        $userId = Auth::id();

        $cart = Cart::where('user_id', $userId)->with('products')->first();

        DB::transaction(function () use ($request, $userId, $cart) {
            $request_acceptance_time = 10; // 10 minutes
            $totalPrice = $request->total_price ?? 0;

            $userRequest = UserRequest::create([
                'user_id' => $userId,
                'osra_code' => $request->osra_code ?: null,
                'start_date' => $request->start_date,
                'start_time' => $request->start_time,
                'end_date' => $request->end_date,
                'end_time' => $request->end_time,
                'osra_time' => $request->osra_time,
                'osra_date' => $request->osra_date,
                'osra_numeric_time' => $request->osra_numeric_time,
                'request_status' => 'pending',
                'total_price' => $totalPrice,
            ]);

            $expiry_time = $userRequest->created_at->addMinutes($request_acceptance_time);

            $userRequest->update([
                'expiry_time' => $expiry_time,
            ]);

            $syncData = [];
            foreach ($cart->products as $product) {
                $quantity = $product->pivot->quantity ?? 0;
                $syncData[$product->pivot->product_id] = [
                    'color_id'     => $product->pivot->color_id,
                    'size_id'      => $product->pivot->size_id,
                    'quantity'     => $quantity,
                    'checked_qnty' => 0,
                    'unchecked_qnty' => $quantity,
                ];
            }

            $userRequest->products()->sync($syncData);

            $cart->products()->detach();
        });

        return back()->with('success', 'Booking request created successfully!');
    }

    public function accept(UserRequest $request)
    {
        if ($request->request_status === 'accepted' || $request->request_status === 'done') {
            return back();
        }

        $request->load('products');

        foreach ($request->products as $product) {
            $product->decrement('inventory_quantity', $product->pivot->quantity);
        }

        $request->update([
            'request_status' => 'accepted',
        ]);

        return back()->with('success', 'Request accepted successfully!');
    }

    public function done(UserRequest $request, Request $httpRequest)
    {
        $productsData = $httpRequest->input('products');

        if (is_array($productsData)) {
            DB::transaction(function () use ($request, $productsData) {
                foreach ($productsData as $pData) {
                    $reqProdId = $pData['request_product_id'] ?? null;
                    $checkedQnty = (int)($pData['checked_qnty'] ?? 0);
                    $comment = $pData['comment'] ?? null;
                    $shortfallReason = $pData['shortfall_reason'] ?? null;

                    $productId = $pData['product_id'] ?? null;

                    $pivot = DB::table('request_products')
                        ->where('request_product_id', $reqProdId)
                        ->first();

                    if (!$pivot && $productId) {
                        $pivot = DB::table('request_products')
                            ->where('request_id', $request->request_id)
                            ->where('product_id', $productId)
                            ->first();
                    }

                    if ($pivot) {
                        $uncheckedQnty = max(0, $pivot->quantity - $checkedQnty);

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
                                'request_id' => $request->request_id,
                                'osra_code' => $request->osra_code,
                                'user_id' => $request->user_id,
                                'product_id' => $pivot->product_id,
                                'quantity' => $uncheckedQnty,
                                'comment' => $comment,
                            ]);
                        }
                    }
                }

                $request->update([
                    'request_status' => 'done',
                ]);
            });

            return redirect()->route('requests')->with('success', 'Request has been completed successfully!');
        }

        // Fallback for legacy calls
        $request->load('products');
        DB::transaction(function () use ($request) {
            foreach ($request->products as $product) {
                $product->increment('inventory_quantity', $product->pivot->checked_qnty);

                if ($product->pivot->unchecked_qnty > 0) {
                    Missings::create([
                        "request_id" => $request->request_id,
                        "osra_code" => $request->osra_code,
                        "user_id" => $request->user_id,
                        "product_id" => $product->pivot->product_id,
                        "quantity" => $product->pivot->unchecked_qnty,
                        "comment" => $product->pivot->comment,
                    ]);
                }
            }

            $request->update([
                'request_status' => 'done',
            ]);
        });

        return back()->with('success', 'Request has been done successfully!');
    }

    public function showDoneRequestForm(UserRequest $request)
    {
        $request->load([
            'user:user_id,full_name',
            'osra:osra_code,osra_name',
            'products.images'
        ]);

        $request->products->each(function ($product) {
            $product->pivot->loadMissing(['color', 'size']);
        });

        $user = Auth::user();
        $cartItems = [];
        if ($user && $user->cart) {
            $cartItems = $user->cart->products()
                ->pluck('products.product_id')
                ->toArray();
        }
        $cart_items_count = count($cartItems);

        return inertia('DoneRequest', [
            'requestDetails' => $request,
            'cart_items_count' => $cart_items_count,
        ]);
    }

    public function missingsIndex()
    {
        $missings = Missings::with([
            'product.images',
            'user:user_id,full_name',
            'osra:osra_code,osra_name',
            'request'
        ])->get();

        $user = Auth::user();
        $cartItems = [];
        if ($user && $user->cart) {
            $cartItems = $user->cart->products()
                ->pluck('products.product_id')
                ->toArray();
        }
        $cart_items_count = count($cartItems);

        return inertia('Missings', [
            'missings' => $missings,
            'cart_items_count' => $cart_items_count,
        ]);
    }

    public function returnMissing(Request $request, $missingId)
    {
        $request->validate([
            'quantity_to_return' => 'required|integer|min:1'
        ]);

        $qtyToReturn = (int) $request->input('quantity_to_return');

        DB::transaction(function () use ($missingId, $qtyToReturn) {
            $missing = Missings::findOrFail($missingId);

            if ($qtyToReturn > $missing->quantity) {
                throw new \Exception("Cannot return more than the missing quantity.");
            }

            // 1. Update/delete Missings record
            $newQty = $missing->quantity - $qtyToReturn;
            if ($newQty <= 0) {
                $missing->delete();
            } else {
                $missing->update(['quantity' => $newQty]);
            }

            // 2. Increment product inventory
            DB::table('products')
                ->where('product_id', $missing->product_id)
                ->increment('inventory_quantity', $qtyToReturn);

            // 3. Update request_products checked_qnty and unchecked_qnty
            $pivots = DB::table('request_products')
                ->where('request_id', $missing->request_id)
                ->where('product_id', $missing->product_id)
                ->where('unchecked_qnty', '>', 0)
                ->orderBy('request_product_id', 'asc')
                ->get();

            $remainingToReturn = $qtyToReturn;
            foreach ($pivots as $pivot) {
                if ($remainingToReturn <= 0) {
                    break;
                }

                $availableToReduce = $pivot->unchecked_qnty;
                $reduceAmount = min($remainingToReturn, $availableToReduce);

                DB::table('request_products')
                    ->where('request_product_id', $pivot->request_product_id)
                    ->update([
                        'checked_qnty' => $pivot->checked_qnty + $reduceAmount,
                        'unchecked_qnty' => $pivot->unchecked_qnty - $reduceAmount,
                        'updated_at' => now(),
                    ]);

                $remainingToReturn -= $reduceAmount;
            }
        });

        return back()->with('success', 'Products returned successfully!');
    }

    public function reject(UserRequest $request)
    {
        if ($request->request_status === 'rejected' || $request->request_status === 'done') {
            return back();
        }

        $request->load('products');

        if ($request->request_status === 'accepted') {
            foreach ($request->products as $product) {
                $product->increment('inventory_quantity', $product->pivot->quantity);
            }
        }

        $request->update([
            'request_status' => 'rejected',
        ]);

        return back()->with('success', 'Request rejected successfully!');
    }
}
