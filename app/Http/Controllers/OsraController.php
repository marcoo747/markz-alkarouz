<?php

namespace App\Http\Controllers;

use App\Models\Osra;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Illuminate\Support\Facades\Auth;

class OsraController extends Controller
{
    public function index()
    {
        $user = Auth::user();
        $cartItems = [];

        if ($user && $user->cart) {
            $cartItems = $user->cart->products()
                ->pluck('products.product_id')
                ->toArray();
        }

        $cart_items_count = count($cartItems);
        $osras = Osra::orderBy('updated_at', 'desc')->get();
        return Inertia::render('OsraPage', [
            'osras' => $osras,
            'cart_items_count' => $cart_items_count,
        ]);
    }

    public function store(Request $request)
    {
        $request->validate([
            'osra_name' => 'required|string|max:255',
            'osra_place' => 'required|string|max:255',
            'osra_time' => 'required|string|max:255',
            'osra_code' => 'required|string|max:255|unique:osra,osra_code',
            'example_date' => 'required',
        ]);

        Osra::create($request->all());

        return back()->with('success', 'success', 'Osra added successfully!');
    }

    public function update(Request $request, Osra $osra)
    {
        $request->validate([
            'osra_name' => 'required|string|max:255',
            'osra_place' => 'required|string|max:255',
            'osra_time' => 'required|string|max:255',
            'osra_code' => 'required|string|max:255',
            'example_date' => 'required',
        ]);

        $osra->update($request->all());

        return back()->with('success', 'success', 'Osra updated successfully!');
    }

    public function destroy(Osra $osra)
    {
        $osra->delete();
        return back()->with('success', 'success', 'Osra deleted successfully!');
    }
}
