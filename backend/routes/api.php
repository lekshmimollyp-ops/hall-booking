<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\AuthController;
use App\Http\Controllers\EventController;
use App\Http\Controllers\IncomeController;
use App\Http\Controllers\ExpenseController;
use App\Http\Controllers\ClientController;
use App\Http\Controllers\ReportController;

/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
*/

// Public Routes
Route::post('/login', [AuthController::class, 'login']);
Route::get('/public/calendar/{centerId}', [EventController::class, 'publicCalendar']);

// Protected Routes
Route::middleware(['auth:sanctum', 'center'])->group(function () {
    Route::post('/logout', [AuthController::class, 'logout']);
    Route::get('/user', function (Request $request) {
        return $request->user();
    });

    // Events
    Route::apiResource('events', EventController::class);

    // Finance
    Route::get('/expense-categories', [ExpenseController::class, 'categories']);
    Route::apiResource('incomes', IncomeController::class)->only(['index', 'store']);
    Route::apiResource('expenses', ExpenseController::class);

    // Clients
    Route::get('/clients', [ClientController::class, 'index']);

    // Reports
    Route::get('/dashboard', [ReportController::class, 'dashboard']);
    Route::get('/reports/monthly', [ReportController::class, 'monthlyStats']);
    Route::get('/reports/categories', [ReportController::class, 'categoryStats']);
    Route::get('/reports/events', [ReportController::class, 'eventStats']);

    // User Management (Admin)
    Route::apiResource('users', \App\Http\Controllers\UserController::class);
    Route::patch('/users/{user}/toggle-status', [\App\Http\Controllers\UserController::class, 'toggleStatus']);
    
    // Centers (Admin List for Dropdowns)
    Route::get('/admin/centers', [\App\Http\Controllers\CenterController::class, 'index']);

    // Center Settings (Current Scope)
    Route::get('/settings/center', [\App\Http\Controllers\CenterController::class, 'showCurrent']);
    Route::put('/settings/center', [\App\Http\Controllers\CenterController::class, 'updateCurrent']);

    // Resources (Halls)
    // Resources (Halls)
    Route::apiResource('resources', \App\Http\Controllers\ResourceController::class);

    // Notifications
    Route::get('/notifications', [\App\Http\Controllers\NotificationController::class, 'index']);
    Route::post('/notifications/{id}/read', [\App\Http\Controllers\NotificationController::class, 'markAsRead']);
    Route::post('/notifications/read-all', [\App\Http\Controllers\NotificationController::class, 'markAllRead']);
});
