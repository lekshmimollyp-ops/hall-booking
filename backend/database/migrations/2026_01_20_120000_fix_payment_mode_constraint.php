<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Support\Facades\DB;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        // Update existing data to match new constraint
        // Convert 'bank' to 'bank_transfer'
        DB::statement("UPDATE incomes SET payment_mode = 'bank_transfer' WHERE payment_mode = 'bank'");
        
        // Convert 'check' to 'cheque' (if any exist)
        DB::statement("UPDATE incomes SET payment_mode = 'cheque' WHERE payment_mode = 'check'");
        
        // Drop old constraint and create new one with all payment modes
        DB::statement("ALTER TABLE incomes DROP CONSTRAINT IF EXISTS incomes_payment_mode_check");
        DB::statement("ALTER TABLE incomes ADD CONSTRAINT incomes_payment_mode_check CHECK (payment_mode IN ('cash', 'card', 'upi', 'bank_transfer', 'cheque', 'other'))");
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        // Revert data changes
        DB::statement("UPDATE incomes SET payment_mode = 'bank' WHERE payment_mode = 'bank_transfer'");
        DB::statement("UPDATE incomes SET payment_mode = 'other' WHERE payment_mode = 'cheque'");
        
        // Restore old constraint
        DB::statement("ALTER TABLE incomes DROP CONSTRAINT IF EXISTS incomes_payment_mode_check");
        DB::statement("ALTER TABLE incomes ADD CONSTRAINT incomes_payment_mode_check CHECK (payment_mode IN ('cash', 'bank', 'upi', 'other'))");
    }
};
