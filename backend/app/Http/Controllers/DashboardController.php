<?php

namespace App\Http\Controllers;

use App\Models\SchoolClass;
use App\Models\Subject;
use App\Models\Tenant;
use App\Models\User;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class DashboardController extends Controller
{
    /**
     * Super Admin Dashboard: Global platform analytics and tenant management.
     * Route: /api/admin/dashboard
     * Allowed Roles: super_admin
     */
    public function adminDashboard(Request $request): JsonResponse
    {
        $totalTenants = Tenant::count();
        $activeTenants = Tenant::where('subscription_status', 'active')->count();
        $trialingTenants = Tenant::where('subscription_status', 'trialing')->count();
        $totalUsers = User::count();

        $tenantsList = Tenant::withCount(['users', 'classes', 'subjects'])
            ->latest()
            ->take(10)
            ->get();

        return response()->json([
            'success' => true,
            'role' => 'super_admin',
            'title' => 'Platform Super Admin Operations Center',
            'analytics' => [
                'total_tenants' => $totalTenants,
                'active_subscriptions' => $activeTenants,
                'trialing_subscriptions' => $trialingTenants,
                'total_users_across_all_schools' => $totalUsers,
            ],
            'recent_tenants' => $tenantsList,
        ]);
    }

    /**
     * School Admin Dashboard: School-specific management.
     * Route: /api/school/dashboard
     * Allowed Roles: school_admin
     */
    public function schoolDashboard(Request $request): JsonResponse
    {
        $user = $request->user();
        $tenant = $user->tenant;

        if (!$tenant) {
            return response()->json([
                'success' => false,
                'message' => 'School Admin is not associated with any school tenant.',
            ], 404);
        }

        $studentsCount = User::where('tenant_id', $tenant->id)->where('role', 'student')->count();
        $professorsCount = User::where('tenant_id', $tenant->id)->where('role', 'professor')->count();
        $classes = SchoolClass::where('tenant_id', $tenant->id)
            ->with(['subjects.professor'])
            ->get();

        return response()->json([
            'success' => true,
            'role' => 'school_admin',
            'school' => [
                'id' => $tenant->id,
                'name' => $tenant->school_name,
                'slug' => $tenant->slug,
                'email' => $tenant->email,
                'subscription_status' => $tenant->subscription_status,
            ],
            'overview' => [
                'total_students' => $studentsCount,
                'total_professors' => $professorsCount,
                'total_classes' => $classes->count(),
            ],
            'classes' => $classes,
        ]);
    }

    /**
     * Professor Dashboard: Teaching schedules, assigned subjects, and classes.
     * Route: /api/professor/dashboard
     * Allowed Roles: professor
     */
    public function professorDashboard(Request $request): JsonResponse
    {
        $user = $request->user();

        // Subjects taught by this professor
        $subjects = Subject::where('professor_id', $user->id)
            ->with(['class', 'tenant'])
            ->get();

        $classesTaught = $subjects->pluck('class')->unique('id')->values();

        return response()->json([
            'success' => true,
            'role' => 'professor',
            'professor' => [
                'id' => $user->id,
                'name' => $user->name,
                'email' => $user->email,
                'school' => $user->tenant?->school_name,
            ],
            'stats' => [
                'subjects_count' => $subjects->count(),
                'classes_count' => $classesTaught->count(),
            ],
            'assigned_subjects' => $subjects,
            'classes' => $classesTaught,
        ]);
    }

    /**
     * Student Dashboard: Student learning schedule, classes, and subjects.
     * Route: /api/student/dashboard
     * Allowed Roles: student
     */
    public function studentDashboard(Request $request): JsonResponse
    {
        $user = $request->user();
        $tenant = $user->tenant;

        // Fetch school subjects & classes
        $availableClasses = $tenant
            ? SchoolClass::where('tenant_id', $tenant->id)->with('subjects.professor')->get()
            : collect([]);

        return response()->json([
            'success' => true,
            'role' => 'student',
            'student' => [
                'id' => $user->id,
                'name' => $user->name,
                'email' => $user->email,
                'school' => $tenant?->school_name,
            ],
            'academic_program' => [
                'classes' => $availableClasses,
            ],
        ]);
    }
}
