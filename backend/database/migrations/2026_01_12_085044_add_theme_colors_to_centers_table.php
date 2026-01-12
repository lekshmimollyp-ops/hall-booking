<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::table('centers', function (Blueprint $table) {
            $table->string('background_color')->nullable()->default('#ffffff');
            $table->string('font_color')->nullable()->default('#111827');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('centers', function (Blueprint $table) {
            $table->dropColumn(['background_color', 'font_color']);
        });
    }
};
