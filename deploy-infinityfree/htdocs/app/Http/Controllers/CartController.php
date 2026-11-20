<?php

namespace App\Http\Controllers;

use App\Models\Cart;
use App\Models\Main_Category;
use App\Models\Osra;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Carbon\Carbon;

class CartController extends Controller
{
    public function index()
    {
        $user = Auth::user();

        $cart = Cart::where('user_id', Auth::id())
            ->with('products.images')
            ->first();

        // Guard: if user has no cart yet, load an empty cart object
        if ($cart) {
            $cart->products->each(function ($product) {
                $product->pivot->loadMissing(['color', 'size']);
            });
        }

        $osra = null;
        if ($user->osra_id) {
            $osra = Osra::find($user->osra_id);
        } elseif ($user->osra_code) {
            $osra = Osra::where('osra_code', $user->osra_code)->first();
        }

        $cartItems = [];

        if ($user && $user->cart) {
            $cartItems = $user->cart->products()
                ->pluck('products.product_id')
                ->toArray();
        }

        $cart_items_count = count($cartItems);

        $main_categories = $cart
            ? Main_Category::whereIn(
                'category_id',
                $cart->products->pluck('main_category_id')->unique()
            )->get()
            : collect();

        $can_go_outside = 1;
        foreach($main_categories as $main_category){
            if($main_category->can_go_outside == 0){
                $can_go_outside = 0;
            }
        }

        // Guard: only calculate next delivery day if osra exists and has a valid example_date
        $next_same_day = null;
        if ($osra && $osra->example_date) {
            $oldDate = Carbon::parse($osra->example_date);
            $nextSameDay = now()->next($oldDate->dayOfWeek);
            $next_same_day = $nextSameDay->toDateString();
        }

        return Inertia::render('CartPage', [
            'cart'              => $cart,
            'user'              => $user,
            'cart_items_count'  => $cart_items_count,
            'osra_time'         => $osra?->osra_time,
            'osra_numeric_time' => $osra?->example_time,
            'can_go_outside'    => $can_go_outside,
            'next_same_day'     => $next_same_day,
        ]);
    }
    
    public function add(Request $request)
    {
        $request->validate([
            'product_id' => 'required|exists:products,product_id',
            'color_id'   => 'nullable|exists:colors,color_id',
            'size_id'    => 'nullable|exists:sizes,size_id',
            'quantity'   => 'nullable|integer|min:1',
        ]);

        $cart = Cart::firstOrCreate([
            'user_id' => Auth::id(),
        ]);

        $qtyToAdd = (int) ($request->quantity ?? 1);

        $existingQuery = DB::table('cart_products')
            ->where('cart_id', $cart->cart_id)
            ->where('product_id', $request->product_id);

        if ($request->filled('color_id')) {
            $existingQuery->where('color_id', $request->color_id);
        } else {
            $existingQuery->whereNull('color_id');
        }

        if ($request->filled('size_id')) {
            $existingQuery->where('size_id', $request->size_id);
        } else {
            $existingQuery->whereNull('size_id');
        }

        $existing = $existingQuery->first();

        if ($existing) {
            DB::table('cart_products')
                ->where('cart_product_id', $existing->cart_product_id)
                ->update([
                    'quantity' => ((int) $existing->quantity) + $qtyToAdd,
                    'updated_at' => now(),
                ]);
        } else {
            $cart->products()->attach($request->product_id, [
                'color_id'  => $request->color_id,
                'size_id'   => $request->size_id,
                'quantity'  => $qtyToAdd,
            ]);
        }

        return back()->with('success', 'Product added to cart');
    }

    public function removeProduct(Request $request)
    {
        $cart = Cart::where('user_id', Auth::id())->first();

        if (!$cart) {
            return back();
        }

        if ($request->filled('cart_product_id')) {
            DB::table('cart_products')
                ->where('cart_id', $cart->cart_id)
                ->where('cart_product_id', $request->input('cart_product_id'))
                ->delete();
        } elseif ($request->filled('product_id')) {
            $cart->products()->detach($request->product_id);
        }

        return back();
    }

    public function clearCart()
    {
        $cart = Cart::where('user_id', Auth::id())->first();

        if ($cart) {
            $cart->products()->detach();
        }

        return response()->json(['success' => true]);
    }
}
