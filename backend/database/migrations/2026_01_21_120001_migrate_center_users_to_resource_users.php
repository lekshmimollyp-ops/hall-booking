<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Support\Facades\DB;

return new class extends Migration
{
    /**
     * Run the migrations.
     * 
     * Migrate existing center-based user assignments to hall-based assignments.
     * Each user will be assigned to ALL halls in their centers to preserve current access.
     */
    public function up(): void
    {
        // Get all users with their centers
        $users = DB::table('center_user')
            ->join('users', 'center_user.user_id', '=', 'users.id')
            ->select('center_user.user_id', 'center_user.center_id')
            ->get();

        foreach ($users as $userCenter) {
            // Get all resources (halls) in this center
            $resources = DB::table('resources')
                ->where('center_id', $userCenter->center_id)
                ->where('status', 'active')
                ->pluck('id');

            // Assign user to all halls in their center
            foreach ($resources as $resourceId) {
                DB::table('resource_user')->insertOrIgnore([
                    'user_id' => $userCenter->user_id,
                    'resource_id' => $resourceId,
                    'created_at' => now(),
                    'updated_at' => now(),
                ]);
            }
        }
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        // Clear all resource_user assignments
        DB::table('resource_user')->truncate();
    }
};
