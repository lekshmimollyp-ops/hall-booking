<?php

namespace App\Http\Controllers;

use App\Models\Resource;
use Illuminate\Http\Request;

class ResourceController extends Controller
{
    /**
     * List all resources for the current center.
     */
    public function index(Request $request)
    {
        $resources = Resource::where('center_id', $request->validated_center_id)
                             ->where('status', 'active')
                             ->get();
        return response()->json($resources);
    }

    /**
     * Create a new resource (Hall).
     */
    public function store(Request $request)
    {
        $request->validate([
            'name' => 'required|string|max:255',
            'capacity' => 'nullable|integer',
        ]);

        $resource = Resource::create([
            'center_id' => $request->validated_center_id,
            'name' => $request->name,
            'capacity' => $request->capacity,
            'description' => $request->description,
            'status' => 'active',
        ]);

        return response()->json($resource, 201);
    }

    /**
     * Update a resource.
     */
    public function update(Request $request, Resource $resource)
    {
        if ($resource->center_id !== (int) $request->validated_center_id) {
            return response()->json(['message' => 'Unauthorized'], 403);
        }

        $request->validate([
            'name' => 'sometimes|string|max:255',
            'capacity' => 'nullable|integer',
        ]);

        $resource->update($request->all());
        return response()->json($resource);
    }

    /**
     * Delete (deactivate) a resource.
     */
    public function destroy(Request $request, Resource $resource)
    {
        if ($resource->center_id !== (int) $request->validated_center_id) {
            return response()->json(['message' => 'Unauthorized'], 403);
        }

        // Instead of hard delete, maybe just deactivate?
        // Let's hard delete if no events, else prevent.
        if ($resource->events()->exists()) {
             return response()->json(['message' => 'Cannot delete hall with existing bookings.'], 409);
        }

        $resource->delete();
        return response()->json(['message' => 'Resource deleted successfully']);
    }
}
