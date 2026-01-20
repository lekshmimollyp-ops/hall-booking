<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        // 1. Centers
        Schema::create('centers', function (Blueprint $table) {
            $table->id();
            $table->string('name');
            $table->string('logo_url')->nullable();
            $table->string('primary_color')->default('#000000');
            $table->text('address')->nullable();
            $table->string('contact_phone')->nullable();
            $table->enum('status', ['active', 'inactive'])->default('active');
            $table->timestamps();
        });

        // 2. Users
        Schema::create('users', function (Blueprint $table) {
            $table->id();
            $table->string('name');
            $table->string('email')->unique();
            $table->string('phone')->nullable();
            $table->string('password');
            $table->enum('role', ['admin', 'staff']);
            $table->enum('status', ['active', 'inactive'])->default('active');
            $table->timestamps();
        });

        // 3. User Centers
        Schema::create('user_centers', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained('users')->onDelete('cascade');
            $table->foreignId('center_id')->constrained('centers')->onDelete('cascade');
            $table->timestamp('created_at')->useCurrent();
        });

        // 4. Clients
        Schema::create('clients', function (Blueprint $table) {
            $table->id();
            $table->foreignId('center_id')->constrained('centers')->onDelete('cascade');
            $table->string('name');
            $table->string('phone')->nullable();
            $table->text('address')->nullable();
            $table->timestamps();
        });

        // 5. Events
        Schema::create('events', function (Blueprint $table) {
            $table->id();
            $table->foreignId('center_id')->constrained('centers')->onDelete('cascade');
            $table->foreignId('client_id')->constrained('clients')->onDelete('cascade');
            $table->date('event_date');
            $table->time('start_time');
            $table->time('end_time');
            $table->string('event_type');
            $table->enum('status', ['blocked', 'booked', 'completed', 'cancelled'])->default('blocked');
            $table->decimal('advance_amount', 10, 2)->default(0);
            $table->decimal('booked_amount', 10, 2)->default(0);
            $table->foreignId('created_by')->constrained('users');
            $table->timestamps();
        });

        // 6. Incomes
        Schema::create('incomes', function (Blueprint $table) {
            $table->id();
            $table->foreignId('center_id')->constrained('centers')->onDelete('cascade');
            $table->foreignId('event_id')->constrained('events')->onDelete('cascade');
            $table->decimal('amount_received', 10, 2);
            $table->date('received_date');
            $table->enum('payment_mode', ['cash', 'card', 'upi', 'bank_transfer', 'cheque', 'other']);
            $table->foreignId('created_by')->constrained('users');
            $table->timestamp('created_at')->useCurrent();
        });

        // 7. Expense Categories
        Schema::create('expense_categories', function (Blueprint $table) {
            $table->id();
            $table->string('name');
            $table->timestamp('created_at')->useCurrent();
        });

        // 8. Expenses
        Schema::create('expenses', function (Blueprint $table) {
            $table->id();
            $table->foreignId('center_id')->constrained('centers')->onDelete('cascade');
            $table->foreignId('event_id')->nullable()->constrained('events')->onDelete('cascade');
            $table->foreignId('category_id')->constrained('expense_categories')->onDelete('cascade');
            $table->decimal('amount', 10, 2);
            $table->date('expense_date');
            $table->text('description')->nullable();
            $table->foreignId('created_by')->constrained('users');
            $table->timestamp('created_at')->useCurrent();
        });

        // 9. Notifications
        Schema::create('notifications', function (Blueprint $table) {
            $table->id();
            $table->foreignId('center_id')->constrained('centers')->onDelete('cascade');
            $table->foreignId('user_id')->constrained('users')->onDelete('cascade');
            $table->enum('type', ['event', 'expense', 'payment']);
            $table->string('message');
            $table->boolean('is_read')->default(false);
            $table->timestamp('created_at')->useCurrent();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('notifications');
        Schema::dropIfExists('expenses');
        Schema::dropIfExists('expense_categories');
        Schema::dropIfExists('incomes');
        Schema::dropIfExists('events');
        Schema::dropIfExists('clients');
        Schema::dropIfExists('user_centers');
        Schema::dropIfExists('users');
        Schema::dropIfExists('centers');
    }
};
