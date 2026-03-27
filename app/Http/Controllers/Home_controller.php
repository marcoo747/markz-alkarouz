<?php

namespace App\Http\Controllers;

use Inertia\Inertia;
use App\Models\Product;
use Illuminate\Support\Facades\Auth;

class Home_controller extends Controller
{
    public function index()
    {
        $products = Product::with(['images', 'colors', 'sizes'])
            ->latest()
            ->take(8)
            ->get()
            ->map(function ($product) {
                return [
                    'id'          => $product->product_id,
                    'title'       => $product->pr_name,
                    'description' => $product->pr_description,
                    'inventory_quantity' => $product->inventory_quantity,
                    'price'       => $product->pr_price,
                    'image'       => $product->images->first()
                        ? '/markaz_alkarouz/public/storage/' . $product->images->first()->photo
                        : '/markaz_alkarouz/public/imgs/shopping.webp',
                    'color_id'    => optional($product->colors->first())->color_id,
                    'color'       => optional($product->colors->first())->color,
                    'size_id'     => optional($product->sizes->first())->size_id,
                    'size'        => optional($product->sizes->first())->size,
                ];
            });

        $user = Auth::user();
        $cartItems = [];

        if ($user && $user->cart) {
            $cartItems = $user->cart->products()
                ->pluck('products.product_id')
                ->toArray();
        }

        $cart_items_count = count($cartItems);

        return Inertia::render('Home', [
            'products'          => $products,
            'cartItems'         => $cartItems,
            'cart_items_count'  => $cart_items_count,
        ]);
    }
}