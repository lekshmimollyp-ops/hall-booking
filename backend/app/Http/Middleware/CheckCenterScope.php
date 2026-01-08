<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class CheckCenterScope
{
    /**
     * Handle an incoming request.
     *
     * @param  \Closure(\Illuminate\Http\Request): (\Symfony\Component\HttpFoundation\Response)  $next
     */
    public function handle(Request $request, Closure $next): Response
    {
        $user = $request->user();

        if (!$user) {
            return response()->json(['message' => 'Unauthenticated'], 401);
        }

        // 1. Check for X-Center-ID header
        $centerId = $request->header('X-Center-ID');

        // 2. If no header, fallback to first center (User Experience decision)
        if (!$centerId) {
             $firstCenter = $user->centers()->first();
             if (!$firstCenter) {
                 return response()->json(['message' => 'No active center assigned to user account.'], 403);
             }
             $centerId = $firstCenter->id;
        }

        // 3. Verify user belongs to this center
        // Note: Even admins are restricted to their assigned centers for strict scoping.
        $hasAccess = $user->centers()->where('user_centers.center_id', $centerId)->exists();

        if (!$hasAccess) {
             return response()->json(['message' => 'Unauthorized access to this center.'], 403);
        }

        // 4. Inject validated center_id into request for Controllers
        $request->merge(['validated_center_id' => $centerId]);

        return $next($request);
    }
}
