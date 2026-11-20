<?php

namespace App\Http\Controllers;

use App\Models\Osra;
use App\Models\User;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Illuminate\Support\Facades\Auth;
use Illuminate\Validation\Rule;

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
        $perPage = $this->resolvePerPage(12);
        $osrasPaginated = Osra::orderBy('updated_at', 'desc')->paginate($perPage);
        
        return Inertia::render('OsraPage', [
            'osras' => $osrasPaginated->items(),
            'pagination'    => [
                'current_page'  => $osrasPaginated->currentPage(),
                'last_page'     => $osrasPaginated->lastPage(),
                'per_page'      => $osrasPaginated->perPage(),
                'total'         => $osrasPaginated->total(),
                'path'          => $osrasPaginated->path(),
            ],
            'cart_items_count' => $cart_items_count,
        ]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'osra_name' => 'required|string|max:255',
            'osra_place' => 'required|string|max:255',
            'osra_time' => 'required|string|max:255',
            'osra_code' => 'required|string|max:255|unique:osra,osra_code',
            'example_date' => 'required',
            'example_time' => 'required',
        ]);

        Osra::create($validated);

        return back()->with('success', 'Osra added successfully!');
    }

    public function update(Request $request, Osra $osra)
    {
        $validated = $request->validate([
            'osra_name' => 'required|string|max:255',
            'osra_place' => 'required|string|max:255',
            'osra_time' => 'required|string|max:255',
            'osra_code' => [
                'required',
                'string',
                'max:255',
                Rule::unique('osra', 'osra_code')->ignore($osra->osra_id, 'osra_id'),
            ],
            'example_date' => 'required',
            'example_time' => 'required',
        ]);

        $osra->update($validated);

        return back()->with('success', 'Osra updated successfully!');
    }

    public function destroy(Request $request, Osra $osra)
    {
        $assignedCount = User::where('osra_id', $osra->osra_id)->count();

        if ($assignedCount > 0 && !$request->boolean('force')) {
            if ($request->expectsJson()) {
                return response()->json([
                    'message' => 'Cannot delete this Osra while users are assigned to it.',
                ], 422);
            }

            return back()->withErrors([
                'osra' => 'Cannot delete this Osra while users are assigned to it.',
            ]);
        }

        $osra->delete();

        return back()->with('success', 'Osra deleted successfully!');
    }
}
