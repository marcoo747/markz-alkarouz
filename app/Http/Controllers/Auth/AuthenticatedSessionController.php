<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use App\Http\Requests\Auth\LoginRequest;
use App\Models\Carousel_photos;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;

class AuthenticatedSessionController extends Controller
{
    public function create()
    {
        $carouselPhotos = Carousel_photos::all()->map(function ($photo) {
            return asset('storage/' . $photo->photo);
        })->values();

        return Inertia::render('Auth/Login', [
            'carouselPhotos' => $carouselPhotos,
        ]);
    }

    public function login(LoginRequest $request)
    {
        $request->authenticate();

        $request->session()->regenerate();

        return redirect()->intended(route('home', absolute: false));
    }

    public function destroy(Request $request)
    {
        Auth::logout();
        $request->session()->invalidate();
        $request->session()->regenerateToken();

        return redirect()->route('login');
    }
}
