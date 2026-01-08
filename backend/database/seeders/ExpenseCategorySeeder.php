<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class ExpenseCategorySeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run()
    {
        $categories = [
            'Food',
            'Decoration',
            'Electricity',
            'Cleaning',
            'Staff',
            'Maintenance',
            'Others'
        ];

        foreach ($categories as $category) {
            \App\Models\ExpenseCategory::firstOrCreate(['name' => $category]);
        }
    }
}
