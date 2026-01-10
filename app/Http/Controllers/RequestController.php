<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\UserRequest;
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
        ->where('request_status', '!=', 'done')
        ->get()
        ->map(function ($req) {
            $req->display_time = $req->display_time;
            return $req;
        });

        return inertia('Requests', [
            'requests' => $requests
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

        return inertia('RequestShow', [
            'request' => $request,
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
        ]);

        $userId = Auth::id();

        $cart = Cart::where('user_id', $userId)->with('products')->first();

        DB::transaction(function () use ($request, $userId, $cart) {
            $totalPrice = !empty($request->osra_code) ? 0 : ($request->total_price ?? 0);

            $userRequest = UserRequest::create([
                'user_id' => $userId,
                'osra_code' => $request->osra_code ?: null,
                'start_date' => $request->start_date,
                'start_time' => $request->start_time,
                'end_date' => $request->end_date,
                'end_time' => $request->end_time,
                'osra_time' => $request->osra_time,
                'request_status' => 'pending',
                'total_price' => $totalPrice,
            ]);

            $syncData = [];
            foreach ($cart->products as $product) {
                $syncData[$product->pivot->product_id] = [
                    'color_id'  => $product->pivot->color_id,
                    'size_id'   => $product->pivot->size_id,
                    'quantity'  => $product->pivot->quantity,
                ];
            }

            $userRequest->products()->sync($syncData);

            $cart->products()->detach();
        });

        return back()->with('success', 'Booking request created successfully!');
    }

    public function accept(UserRequest $request)
    {
        $request->update([
            'request_status' => 'accepted',
        ]);

        return back()->with('success', 'Request accepted successfully!');
    }

    public function done(UserRequest $request)
    {
        $request->update([
            'request_status' => 'done',
        ]);

        return back()->with('success', 'Request has been done successfully!');
    }
}
