<?php

use App\Http\Controllers\AuthController;
use App\Http\Controllers\DashboardController;
use App\Models\Tenant;
use Illuminate\Support\Facades\Route;

/*
|--------------------------------------------------------------------------
| Public Routes
|--------------------------------------------------------------------------
*/
Route::get('/health', function () {
    return response()->json([
        'status' => 'healthy',
        'service' => 'EduFlow SaaS API',
        'timestamp' => now()->toIso8601String(),
    ]);
});

// Authentication endpoints — throttled to prevent brute force attacks
Route::middleware('throttle:10,1')->prefix('auth')->group(function () {
    Route::post('/login', [AuthController::class, 'login']);
    Route::post('/register', [AuthController::class, 'register']);

    Route::middleware('auth:sanctum')->group(function () {
        Route::get('/me', [AuthController::class, 'me']);
        Route::post('/logout', [AuthController::class, 'logout']);
    });
});

/*
|--------------------------------------------------------------------------
| Multi-Tenant Directory Routes (v1)
|--------------------------------------------------------------------------
*/
// Tenant directory — requires authentication and enforces tenant isolation
Route::middleware('auth:sanctum')->prefix('v1')->group(function () {
    Route::get('/tenants', function (\Illuminate\Http\Request $request) {
        $user = $request->user();
        if ($user->role === 'super_admin') {
            return Tenant::withCount(['users', 'classes', 'subjects'])->get();
        }

        return Tenant::where('id', $user->tenant_id)
            ->withCount(['users', 'classes', 'subjects'])
            ->get();
    });

    // Enforce tenant scoping: users can only view their own school tenant unless super_admin
    Route::get('/tenants/{tenant:slug}', function (\Illuminate\Http\Request $request, Tenant $tenant) {
        $user = $request->user();
        if ($user->role !== 'super_admin' && (int) $user->tenant_id !== (int) $tenant->id) {
            return response()->json([
                'success' => false,
                'message' => 'Access Denied: Cross-tenant resource access is forbidden.',
            ], 403);
        }

        return $tenant->load(['classes.subjects.professor:id,name,email,role']);
    });

    Route::get('/tenants/{tenant:slug}/classes', function (\Illuminate\Http\Request $request, Tenant $tenant) {
        $user = $request->user();
        if ($user->role !== 'super_admin' && (int) $user->tenant_id !== (int) $tenant->id) {
            return response()->json([
                'success' => false,
                'message' => 'Access Denied: Cross-tenant resource access is forbidden.',
            ], 403);
        }

        return $tenant->classes()->with('subjects.professor:id,name,email,role')->get();
    });

    Route::get('/tenants/{tenant:slug}/subjects', function (\Illuminate\Http\Request $request, Tenant $tenant) {
        $user = $request->user();
        if ($user->role !== 'super_admin' && (int) $user->tenant_id !== (int) $tenant->id) {
            return response()->json([
                'success' => false,
                'message' => 'Access Denied: Cross-tenant resource access is forbidden.',
            ], 403);
        }

        return $tenant->subjects()->with(['class', 'professor:id,name,email,role'])->get();
    });
});

/*
|--------------------------------------------------------------------------
| RBAC Protected Route Groups
|--------------------------------------------------------------------------
*/

// 1. Super Admin Area
Route::middleware(['auth:sanctum', 'role:super_admin'])->prefix('admin')->group(function () {
    Route::get('/dashboard', [DashboardController::class, 'adminDashboard']);
});

// 2. School Admin Area
Route::middleware(['auth:sanctum', 'role:school_admin'])->prefix('school')->group(function () {
    Route::get('/dashboard', [DashboardController::class, 'schoolDashboard']);

    // Students CRUD
    Route::get('/students', [\App\Http\Controllers\SchoolAdminController::class, 'indexStudents']);
    Route::post('/students', [\App\Http\Controllers\SchoolAdminController::class, 'storeStudent']);
    Route::put('/students/{id}', [\App\Http\Controllers\SchoolAdminController::class, 'updateStudent']);
    Route::delete('/students/{id}', [\App\Http\Controllers\SchoolAdminController::class, 'destroyStudent']);

    // Professors CRUD
    Route::get('/professors', [\App\Http\Controllers\SchoolAdminController::class, 'indexProfessors']);
    Route::post('/professors', [\App\Http\Controllers\SchoolAdminController::class, 'storeProfessor']);
    Route::put('/professors/{id}', [\App\Http\Controllers\SchoolAdminController::class, 'updateProfessor']);
    Route::delete('/professors/{id}', [\App\Http\Controllers\SchoolAdminController::class, 'destroyProfessor']);
});

// 3. Professor Area
Route::middleware(['auth:sanctum', 'role:professor'])->prefix('professor')->group(function () {
    Route::get('/dashboard', [DashboardController::class, 'professorDashboard']);
});

// 4. Student Area
Route::middleware(['auth:sanctum', 'role:student'])->prefix('student')->group(function () {
    Route::get('/dashboard', [DashboardController::class, 'studentDashboard']);
});
