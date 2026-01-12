<?php

namespace App\Http\Controllers;

use App\Models\Center;
use Illuminate\Http\Request;

class CenterController extends Controller
{
    /**
     * List all centers (Admin only)
     */
    public function index(Request $request)
    {
        // Simple role check or handled by middleware
        if ($request->user()->role !== 'admin') {
            return response()->json(['message' => 'Unauthorized'], 403);
        }

        $centers = Center::select('id', 'name', 'address')->get();
        return response()->json($centers);
    }
    /**
     * Get current center details (Scoped)
     */
    public function showCurrent(Request $request)
    {
        $center = Center::findOrFail($request->validated_center_id);
        return response()->json($center);
    }

    /**
     * Update current center details (Scoped)
     */
    public function updateCurrent(Request $request)
    {
        $center = Center::findOrFail($request->validated_center_id);

        $request->validate([
            'name' => 'required|string|max:255',
            'logo_url' => 'nullable|string', 
            'primary_color' => 'nullable|string|size:7', 
            'background_color' => 'nullable|string|size:7',
            'font_color' => 'nullable|string|size:7',
            'address' => 'nullable|string',
            'contact_phone' => 'nullable|string',
        ]);

        $center->update($request->only(['name', 'logo_url', 'primary_color', 'background_color', 'font_color', 'address', 'contact_phone']));

        return response()->json($center);
    }
}
