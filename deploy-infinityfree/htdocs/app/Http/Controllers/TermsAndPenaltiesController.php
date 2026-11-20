<?php

namespace App\Http\Controllers;

use App\Models\TermsAndPenalty;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Validation\Rule;

class TermsAndPenaltiesController extends Controller
{
    public function index()
    {
        $terms = TermsAndPenalty::active()->terms()->get();
        $penalties = TermsAndPenalty::active()->penalties()->get();

        return response()->json([
            'terms' => $terms,
            'penalties' => $penalties,
        ]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'title' => 'required|string|max:255',
            'content' => 'required|string',
            'type' => ['required', Rule::in(['terms', 'penalty'])],
            'amount' => 'nullable|numeric|min:0',
            'is_active' => 'boolean',
        ]);

        $validated['created_by'] = Auth::id();
        $validated['updated_by'] = Auth::id();

        $item = TermsAndPenalty::create($validated);

        return response()->json([
            'message' => 'Terms/Penalty created successfully',
            'item' => $item,
        ], 201);
    }

    public function update(Request $request, TermsAndPenalty $termsAndPenalty)
    {
        $validated = $request->validate([
            'title' => 'required|string|max:255',
            'content' => 'required|string',
            'type' => ['required', Rule::in(['terms', 'penalty'])],
            'amount' => 'nullable|numeric|min:0',
            'is_active' => 'boolean',
        ]);

        $validated['updated_by'] = Auth::id();

        $termsAndPenalty->update($validated);

        return response()->json([
            'message' => 'Terms/Penalty updated successfully',
            'item' => $termsAndPenalty,
        ]);
    }

    public function destroy(TermsAndPenalty $termsAndPenalty)
    {
        $termsAndPenalty->delete();

        return response()->json([
            'message' => 'Terms/Penalty deleted successfully',
        ]);
    }

    public function toggleActive(TermsAndPenalty $termsAndPenalty)
    {
        $termsAndPenalty->update([
            'is_active' => !$termsAndPenalty->is_active,
            'updated_by' => Auth::id(),
        ]);

        return response()->json([
            'message' => 'Status updated successfully',
            'item' => $termsAndPenalty,
        ]);
    }
}
