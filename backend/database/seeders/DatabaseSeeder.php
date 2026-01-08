<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    use WithoutModelEvents;

    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        // User::factory(10)->create();

        $user = User::query()->updateOrCreate(
            ['email' => 'admin@booking.com'],
            [
                'name' => 'Admin User',
                'password' => 'admin@booking.com',
                'role' => 'admin',
                'status' => 'active',
            ]
        );

        $center = \App\Models\Center::firstOrCreate(
            ['name' => 'Main Hall'],
            [
                'address' => '123 Main St',
                'status' => 'active',
                'primary_color' => '#3b82f6'
            ]
        );

        if (!$user->centers()->where('center_id', $center->id)->exists()) {
            $user->centers()->attach($center->id);
        }
    }
}
