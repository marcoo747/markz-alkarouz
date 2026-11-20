<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Storage;
use Inertia\Inertia;
use Illuminate\Support\Facades\DB;

class RegisteredUserController extends Controller
{
    public function show()
    {
        return Inertia::render('Auth/Register');
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'full_name'   => 'required|string|max:255',
            'mobile'      => ['required', 'digits:11', 'unique:users,mobile'],
            'password'    => 'required|string|min:8|confirmed',
            'user_type'   => 'required|string',
            'email'       => 'nullable|email|unique:users,email',
            'user_photo'  => 'nullable|image|mimes:jpg,jpeg,png,webp|max:2048',
            'osra_code'   => 'nullable|string|exists:osra,osra_code',
        ]);

        $osraId = null;
        if (!empty($validated['osra_code'])) {
            $osraId = DB::table('osra')
                ->where('osra_code', $validated['osra_code'])
                ->value('osra_id');
        }

        $storedPhoto = null;
        if ($request->hasFile('user_photo')) {
            $storedPhoto = $request
                ->file('user_photo')
                ->store('user_photos', 'public');
            $validated['user_photo'] = $storedPhoto;
        }

        try {
            User::create([
                'full_name'  => $validated['full_name'],
                'mobile'     => $validated['mobile'],
                'password'   => Hash::make($validated['password']),
                'user_photo' => $validated['user_photo'] ?? null,
                'email'      => $validated['email'],
                'user_type'  => $validated['user_type'],
                'osra_id'    => $osraId,
            ]);
        } catch (\Throwable $e) {
            if ($storedPhoto && Storage::disk('public')->exists($storedPhoto)) {
                Storage::disk('public')->delete($storedPhoto);
            }
            throw $e;
        }

        return redirect()->route('users.index');
    }
    
    public function user_sign_up()
    {
        return Inertia::render('Auth/SignUp');
    }

    public function sign_up(Request $request)
    {
        $validated = $request->validate([
            'full_name'   => 'required|string|max:255',
            'mobile'      => ['required', 'digits:11', 'unique:users,mobile'],
            'password'    => 'required|string|min:8|confirmed',
            'email'       => 'required|email|unique:users,email',
            'user_photo'  => 'nullable|image|mimes:jpg,jpeg,png,webp|max:2048',
            'osra_code'   => 'nullable|string|exists:osra,osra_code',
        ]);

        $osraId = null;
        if (!empty($validated['osra_code'])) {
            $osraId = DB::table('osra')
                ->where('osra_code', $validated['osra_code'])
                ->value('osra_id');
        }

        $storedPhoto = null;
        if ($request->hasFile('user_photo')) {
            $storedPhoto = $request
                ->file('user_photo')
                ->store('user_photos', 'public');
            $validated['user_photo'] = $storedPhoto;
        }

        try {
            $user = User::create([
                'full_name'  => $validated['full_name'],
                'mobile'     => $validated['mobile'],
                'password'   => Hash::make($validated['password']),
                'user_photo' => $validated['user_photo'] ?? null,
                'email'      => $validated['email'],
                'user_type'  => "user",
                'osra_id'    => $osraId,
            ]);
        } catch (\Throwable $e) {
            if ($storedPhoto && Storage::disk('public')->exists($storedPhoto)) {
                Storage::disk('public')->delete($storedPhoto);
            }
            throw $e;
        }

        Auth::login($user);
        $request->session()->regenerate();

        return redirect()->route('home');
    }
}
