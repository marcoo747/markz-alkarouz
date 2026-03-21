<?php

namespace App\Http\Controllers;

use App\Models\Cart;
use App\Models\Osra;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Illuminate\Support\Facades\Auth;

class CartController extends Controller
{
    public function index()
    {
        $user = Auth::user();

        $cart = Cart::where('user_id', Auth::id())
            ->with('products.images')
            ->first();

        $cart->products->each(function ($product) {
            $product->pivot->loadMissing(['color', 'size']);
        });

        $osra = null;
        if ($user->osra_id) {
            $osra = Osra::find($user->osra_id);
        } elseif ($user->osra_code) {
            $osra = Osra::where('osra_code', $user->osra_code)->first();
        }

        return Inertia::render('CartPage', [
            'cart'      => $cart,
            'user'      => $user,
            'osra_time' => $osra?->osra_time,
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

        $cart->products()->syncWithoutDetaching([
            $request->product_id => [
                'color_id'  => $request->color_id,
                'size_id'   => $request->size_id,
                'quantity'  => $request->quantity ?? 1,
            ]
        ]);

        return back()->with('success', 'Product added to cart');
    }

    public function removeProduct(Request $request)
    {
        $cart = Cart::where('user_id', Auth::id())->first();

        $cart->products()->detach($request->product_id);

        return back();
    }
}
