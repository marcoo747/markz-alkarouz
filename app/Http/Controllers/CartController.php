<?php

namespace App\Http\Controllers;

use App\Models\Cart;
use App\Models\Main_Category;
use App\Models\Osra;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Illuminate\Support\Facades\Auth;
use Carbon\Carbon;

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

        $cartItems = [];

        if ($user && $user->cart) {
            $cartItems = $user->cart->products()
                ->pluck('products.product_id')
                ->toArray();
        }

        $cart_items_count = count($cartItems);

        $main_categories = Main_Category::whereIn(
            'category_id',
            $cart->products->pluck('main_category_id')->unique()
        )->get();

        $can_go_outside = 1;
        foreach($main_categories as $main_category){
            if($main_category->can_go_outside == 0){
                $can_go_outside = 0;
            }
        }

        $oldDate = Carbon::parse($osra->example_date);

        // get next same weekday relative to today
        $nextSameDay = now()->next($oldDate->dayOfWeek);

        $next_same_day = $nextSameDay->toDateString();

        return Inertia::render('CartPage', [
            'cart'              => $cart,
            'user'              => $user,
            'cart_items_count'  => $cart_items_count,
            'osra_time'         => $osra?->osra_time,
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
