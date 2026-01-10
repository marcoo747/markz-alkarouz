<?php

namespace App\Http\Controllers;

use App\Models\Osra;
use Illuminate\Http\Request;
use Inertia\Inertia;

class OsraController extends Controller
{
    public function index()
    {
        $osras = Osra::orderBy('updated_at', 'desc')->get();
        return Inertia::render('OsraPage', ['osras' => $osras]);
    }

    public function store(Request $request)
    {
        $request->validate([
            'osra_name' => 'required|string|max:255',
            'osra_place' => 'required|string|max:255',
            'osra_time' => 'required|string|max:255',
            'osra_code' => 'required|string|max:255|unique:osra,osra_code',
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
            'osra_code' => 'required|string|max:255|unique:osra,osra_code',
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
