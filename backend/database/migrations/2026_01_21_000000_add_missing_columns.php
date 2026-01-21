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
        // Add missing columns to centers table
        Schema::table('centers', function (Blueprint $table) {
            if (!Schema::hasColumn('centers', 'background_color')) {
                $table->string('background_color', 7)->default('#ffffff')->after('primary_color');
            }
            if (!Schema::hasColumn('centers', 'font_color')) {
                $table->string('font_color', 7)->default('#000000')->after('background_color');
            }
            if (!Schema::hasColumn('centers', 'contact_email')) {
                $table->string('contact_email')->nullable()->after('contact_phone');
            }
            if (!Schema::hasColumn('centers', 'website')) {
                $table->string('website')->nullable()->after('contact_email');
            }
        });

        // Ensure notifications table has all required columns
        if (Schema::hasTable('notifications')) {
            Schema::table('notifications', function (Blueprint $table) {
                if (!Schema::hasColumn('notifications', 'data')) {
                    $table->text('data')->default('{}');
                }
                if (!Schema::hasColumn('notifications', 'notifiable_type')) {
                    $table->string('notifiable_type')->nullable();
                }
                if (!Schema::hasColumn('notifications', 'notifiable_id')) {
                    $table->bigInteger('notifiable_id')->nullable();
                }
                if (!Schema::hasColumn('notifications', 'read_at')) {
                    $table->timestamp('read_at')->nullable();
                }
            });
        }

        // Ensure sessions table exists
        if (!Schema::hasTable('sessions')) {
            Schema::create('sessions', function (Blueprint $table) {
                $table->string('id')->primary();
                $table->foreignId('user_id')->nullable()->index();
                $table->string('ip_address', 45)->nullable();
                $table->text('user_agent')->nullable();
                $table->text('payload');
                $table->integer('last_activity')->index();
            });
        }
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('centers', function (Blueprint $table) {
            $table->dropColumn(['background_color', 'font_color', 'contact_email', 'website']);
        });
    }
};
