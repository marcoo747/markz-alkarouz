<?php

namespace App\Http\Controllers;

use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\ValidationException;
use Illuminate\Support\Facades\Storage;
use Illuminate\Http\Request;
use Illuminate\Validation\Rule;
use App\Models\User;
use App\Models\Osra;
use Inertia\Inertia;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Auth;

class ProfileController extends Controller
{
public function index()
{
    $user = Auth::user();

    $osra = $user->osra;

    $requests = $user->requests()
        ->latest()
        ->with('osra') // eager load osra relation
        ->get()
        ->map(function ($request) {
            return [
                'request_id'     => $request->request_id,
                'user_id'        => $request->user_id,
                'osra_name'      => $request->osra ? $request->osra->osra_name : null, // ✅ use osra_name
                'start_date'     => $request->start_date,
                'start_time'     => $request->start_time,
                'end_date'       => $request->end_date,
                'end_time'       => $request->end_time,
                'osra_time'      => $request->osra_time,
                'request_status' => $request->request_status,
                'created_at'     => $request->created_at,
                'updated_at'     => $request->updated_at,
            ];
        });

    return Inertia::render('ProfilePage', [
        'user' => [
            'name' => $user->full_name,
            'phone' => $user->mobile,
            'email' => $user->email,
            'profilePhoto' => $user->user_photo
                ? asset('storage/' . $user->user_photo)
                : 'imgs/AlkarouzCom.png',
            'osra' => $osra ? [
                'osra_id' => $osra->osra_id,
                'osra_name' => $osra->osra_name,
                'osra_place' => $osra->osra_place,
                'osra_time' => $osra->osra_time,
                'osra_code' => $osra->osra_code,
            ] : null,
        ],
        'requests' => $requests,
    ]);
}

    public function show_all_users()
    {
        $osras = Osra::all();
        return Inertia::render('UsersPage', [
            'users' => User::select(
                'user_id',
                'full_name',
                'user_type',
                'mobile',
                'email',
                'user_photo'
            )->get()->map(fn ($user) => [
                ...$user->toArray(),
                'user_photo' => $user->user_photo
                    ? asset('storage/' . $user->user_photo)
                    : null,
            ]),
            'osras' => $osras,
        ]);
    }

    public function changePassword(Request $request)
    {
        $user = Auth::user();

        $validated = $request->validate([
            'current_password' => 'required|string',
            'new_password' => 'required|string|min:8|confirmed',
        ]);

        if (!Hash::check($validated['current_password'], $user->password)) {
            throw ValidationException::withMessages([
                'current_password' => 'Current password is incorrect',
            ]);
        }

        $user->password = Hash::make($validated['new_password']);
        $user->save();

        return back()->with('success', 'Password changed successfully!');
    }

    public function update(Request $request, User $user)
    {
        $validated = $request->validate([
            'full_name'    => 'required|string|max:255',
            'mobile'       => 'required|string|max:20',
            'email'        => [
                'required',
                'email',
                Rule::unique('users', 'email')->ignore($user->user_id, 'user_id'),
            ],
            'user_type'    => 'required|string|in:user,admin,manager',
            'osra_code'    => 'nullable|string',
            'profilePhoto' => 'nullable|image|mimes:jpg,png,jpeg,gif,webp|max:2048',
        ]);

        $user->fill([
            'full_name' => $validated['full_name'],
            'mobile'    => $validated['mobile'],
            'email'     => $validated['email'],
            'user_type' => $validated['user_type'],
        ]);

        $osraId = null;
        if (!empty($validated['osra_code'])) {
            $osraId = DB::table('osra')
                ->where('osra_code', $validated['osra_code'])
                ->value('osra_id');

            if (!$osraId) {
                return back()->withErrors([
                    'osra_code' => 'Osra code is invalid.',
                ])->withInput();
            }
        }
        $user->osra_id = $osraId;

        if ($request->hasFile('profilePhoto')) {
            if ($user->user_photo && Storage::disk('public')->exists($user->user_photo)) {
                Storage::disk('public')->delete($user->user_photo);
            }

            $path = $request->file('profilePhoto')->store('user_photos', 'public');
            $user->user_photo = $path;
        }

        $user->save();

        return redirect()->route('users.index')->with('success', 'User updated successfully');
    }

    public function destroy(User $user)
    {
        if ($user->user_photo && Storage::disk('public')->exists($user->user_photo)) {
            Storage::disk('public')->delete($user->user_photo);
        }

        $user->delete();

        return back()->with('success', 'User deleted successfully');
    }

    public function updateProfile(Request $request)
    {
        $validated = $request->validate([
            'full_name'  => ['required', 'string', 'max:255'],
            'email'      => [
                'required',
                'email',
                'max:255',
                'unique:users,email,' . Auth::id() . ',user_id',
            ],
            'mobile'     => ['required', 'digits:11'],
            'user_photo' => ['nullable', 'image', 'mimes:jpg,jpeg,png', 'max:2048'],
            'osra_code'  => ['nullable', 'string'],
        ]);

        $user = Auth::user();

        if ($request->hasFile('user_photo')) {
            if ($user->user_photo && Storage::disk('public')->exists($user->user_photo)) {
                Storage::disk('public')->delete($user->user_photo);
            }

            $path = $request->file('user_photo')->store('profile_photos', 'public');
            $validated['user_photo'] = $path;
        }

        $osraId = null;
        if (!empty($validated['osra_code'])) {
            $osraId = DB::table('osra')
                ->where('osra_code', $validated['osra_code'])
                ->value('osra_id');

            if (!$osraId) {
                return back()->withErrors([
                    'osra_code' => 'Osra code is invalid.',
                ])->withInput();
            }
        }
        $validated['osra_id'] = $osraId;

        $user->update($validated);

        return back()->with('success', 'Profile updated successfully!');
    }
}