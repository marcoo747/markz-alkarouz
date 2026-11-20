<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\UserRequest;
use App\Models\Missings;
use App\Models\Cart;
use App\Models\Osra;
use App\Services\RequestLifecycleService;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Illuminate\Validation\ValidationException;

class RequestController extends Controller
{
    public function __construct(
        private readonly RequestLifecycleService $lifecycleService
    ) {
    }
    public function index()
    {
        $requests = UserRequest::with([
            'user:user_id,full_name',
            'products:product_id,pr_name',
            'osra:osra_code,osra_name'
        ])
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
        $userRequest = UserRequest::with([
            'user:user_id,full_name',
            'osra:osra_code,osra_name',
            'products.images'
        ])->findOrFail($id);

        $user = Auth::user();
        $isStaff = $user && in_array($user->user_type, ['admin', 'manager'], true);

        if (!$isStaff && (int) $userRequest->user_id !== (int) $user?->user_id) {
            abort(403, 'You do not have permission to view this request.');
        }

        $userRequest->products->each(function ($product) {
            $product->pivot->loadMissing(['color', 'size']);
        });
        $cartItems = [];

        if ($user && $user->cart) {
            $cartItems = $user->cart->products()
                ->pluck('products.product_id')
                ->toArray();
        }

        $cart_items_count = count($cartItems);

        return inertia('RequestShow', [
            'request' => $userRequest,
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
            'start_time' => 'nullable|string',
            'end_time' => 'nullable|string',
            'osra_date' => 'nullable',
            'osra_numeric_time' => 'nullable',
            'expiry_time' => 'nullable',
        ]);

        $userId = Auth::id();

        DB::transaction(function () use ($request, $userId) {
            $cart = Cart::where('user_id', $userId)
                ->with('products')
                ->lockForUpdate()
                ->first();

            if (!$cart || $cart->products->isEmpty()) {
                throw ValidationException::withMessages([
                    'cart' => 'Your cart is empty.',
                ]);
            }

            $request_acceptance_time = 10; // 10 minutes
            $totalPrice = round(
                $cart->products->sum(function ($product) {
                    $unitPrice = (float) ($product->pr_price ?? 0);
                    $quantity = max(0, (int) ($product->pivot->quantity ?? 0));

                    return $unitPrice * $quantity;
                }),
                2
            );

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

            foreach ($cart->products as $product) {
                $quantity = $product->pivot->quantity ?? 0;
                $userRequest->products()->attach($product->pivot->product_id, [
                    'color_id'       => $product->pivot->color_id,
                    'size_id'        => $product->pivot->size_id,
                    'quantity'       => $quantity,
                    'checked_qnty'   => 0,
                    'unchecked_qnty' => $quantity,
                ]);
            }

            $cart->products()->detach();
        });

        return back()->with('success', 'Booking request created successfully!');
    }

    public function accept(UserRequest $request)
    {
        $accepted = $this->lifecycleService->accept($request);

        if (!$accepted) {
            return back();
        }

        return back()->with('success', 'Request accepted successfully!');
    }

    public function done(UserRequest $request, Request $httpRequest)
    {
        $validated = $httpRequest->validate([
            'products' => 'nullable|array',
            'products.*.request_product_id' => 'nullable|integer',
            'products.*.product_id' => 'nullable|integer',
            'products.*.checked_qnty' => 'required_with:products|integer|min:0',
            'products.*.shortfall_reason' => 'nullable|in:missing,damaged',
            'products.*.comment' => 'nullable|string|max:1000',
        ]);

        $productsData = $httpRequest->has('products') ? ($validated['products'] ?? []) : null;
        $completed = $this->lifecycleService->done($request, $productsData);

        if (!$completed) {
            return $productsData !== null
                ? redirect()->route('requests')
                : back();
        }

        if ($productsData !== null) {
            return redirect()->route('requests')->with('success', 'Request has been completed successfully!');
        }

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
        $validated = $request->validate([
            'quantity_to_return' => 'required|integer|min:1',
        ]);

        $this->lifecycleService->returnMissing((int) $missingId, (int) $validated['quantity_to_return']);

        return back()->with('success', 'Products returned successfully!');
    }

    public function reject(UserRequest $request)
    {
        $rejected = $this->lifecycleService->reject($request);

        if (!$rejected) {
            return back();
        }

        return back()->with('success', 'Request rejected successfully!');
    }
}
