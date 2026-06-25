<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use App\Http\Requests\Auth\LoginRequest;
use App\Models\Carousel_photos;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;
use Illuminate\Validation\ValidationException;
use Illuminate\Http\JsonResponse;
use Throwable;

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
        try {
            $request->authenticate();

            $request->session()->regenerate();

            return redirect()->intended(route('home', absolute: false));
        } catch (ValidationException $e) {
            $messages = $e->errors();
            $general = $messages['general'][0] ?? ($messages['mobile'][0] ?? null);
            $translated = $general ? trans($general) : trans('auth.failed');

            if ($request->header('X-Inertia')) {
                return redirect()->back()->withErrors(['general' => $translated])->withInput();
            }

            if ($request->expectsJson() || $request->wantsJson()) {
                return response()->json([
                    'errors' => ['general' => $translated],
                ], 422);
            }

            return redirect()->back()->withErrors(['general' => $translated])->withInput();
        } catch (Throwable $e) {
            return response()->json(['message' => 'Server error'], 500);
        }
    }

    public function destroy(Request $request)
    {
        Auth::logout();
        $request->session()->invalidate();
        $request->session()->regenerateToken();

        return redirect()->route('login');
    }
}
