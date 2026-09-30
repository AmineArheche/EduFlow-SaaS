<?php

use App\Http\Controllers\DashboardController;
use Illuminate\Support\Facades\Route;

Route::get('/', function () {
    return response()->json([
        'application' => 'EduFlow-SaaS',
        'status' => 'operational',
        'api_version' => 'v1',
        'docs' => '/api/health',
    ]);
});

/*
|--------------------------------------------------------------------------
| Web Route Groups (Web/Session/Redirect RBAC Support)
|--------------------------------------------------------------------------
*/
Route::middleware(['auth', 'role:super_admin'])->prefix('admin')->group(function () {
    Route::get('/dashboard', [DashboardController::class, 'adminDashboard'])->name('admin.dashboard');
});

Route::middleware(['auth', 'role:school_admin'])->prefix('school')->group(function () {
    Route::get('/dashboard', [DashboardController::class, 'schoolDashboard'])->name('school.dashboard');
});

Route::middleware(['auth', 'role:professor'])->prefix('professor')->group(function () {
    Route::get('/dashboard', [DashboardController::class, 'professorDashboard'])->name('professor.dashboard');
});

Route::middleware(['auth', 'role:student'])->prefix('student')->group(function () {
    Route::get('/dashboard', [DashboardController::class, 'studentDashboard'])->name('student.dashboard');
});
