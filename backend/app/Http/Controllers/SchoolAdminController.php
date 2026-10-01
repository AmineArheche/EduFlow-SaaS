<?php

namespace App\Http\Controllers;

use App\Models\User;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\Rule;

class SchoolAdminController extends Controller
{
    /**
     * Helper to get and verify admin's tenant ID.
     */
    protected function getTenantId(Request $request): int
    {
        $user = $request->user();

        if (!$user->tenant_id) {
            abort(403, 'User is not associated with any school tenant.');
        }

        return (int) $user->tenant_id;
    }

    /*
    |--------------------------------------------------------------------------
    | STUDENTS MANAGEMENT (CRUD)
    |--------------------------------------------------------------------------
    */

    /**
     * List all students belonging strictly to the admin's tenant.
     */
    public function indexStudents(Request $request): JsonResponse
    {
        $tenantId = $this->getTenantId($request);

        $query = User::where('tenant_id', $tenantId)
            ->where('role', 'student');

        // Search by name or email (escape wildcards to avoid SQL regex degradation)
        if ($search = $request->query('search')) {
            $escaped = addcslashes($search, '%_\\');
            $query->where(function ($q) use ($escaped) {
                $q->where('name', 'like', "%{$escaped}%")
                  ->orWhere('email', 'like', "%{$escaped}%");
            });
        }

        // Filter by status
        if ($status = $request->query('status')) {
            $query->where('status', $status);
        }

        // Cap per_page at 100 to prevent DoS via oversized queries
        $perPage = min((int) $request->query('per_page', 10), 100);
        $students = $query->latest()->paginate($perPage);

        return response()->json([
            'success' => true,
            'data' => $students->items(),
            'pagination' => [
                'current_page' => $students->currentPage(),
                'last_page' => $students->lastPage(),
                'per_page' => $students->perPage(),
                'total' => $students->total(),
            ],
        ]);
    }

    /**
     * Store a new student under the admin's tenant.
     */
    public function storeStudent(Request $request): JsonResponse
    {
        $tenantId = $this->getTenantId($request);

        $validated = $request->validate([
            'name' => ['required', 'string', 'max:255'],
            'email' => ['required', 'string', 'email', 'max:255', 'unique:users,email'],
            'password' => ['required', 'string', 'min:8'],
            'status' => ['nullable', 'string', 'in:active,inactive,suspended'],
        ]);

        $student = User::create([
            'tenant_id' => $tenantId,
            'name' => $validated['name'],
            'email' => $validated['email'],
            'password' => Hash::make($validated['password']),
            'role' => 'student',
            'status' => $validated['status'] ?? 'active',
        ]);

        return response()->json([
            'success' => true,
            'message' => 'Student created successfully.',
            'data' => $student,
        ], 201);
    }

    /**
     * Update an existing student belonging to the admin's tenant.
     */
    public function updateStudent(Request $request, int $id): JsonResponse
    {
        $tenantId = $this->getTenantId($request);

        $student = User::where('tenant_id', $tenantId)
            ->where('role', 'student')
            ->findOrFail($id);

        $validated = $request->validate([
            'name' => ['sometimes', 'required', 'string', 'max:255'],
            'email' => [
                'sometimes',
                'required',
                'string',
                'email',
                'max:255',
                Rule::unique('users', 'email')->ignore($student->id),
            ],
            'password' => ['nullable', 'string', 'min:8'],
            'status' => ['sometimes', 'required', 'string', 'in:active,inactive,suspended'],
        ]);

        if (!empty($validated['password'])) {
            $validated['password'] = Hash::make($validated['password']);
        } else {
            unset($validated['password']);
        }

        $student->update($validated);

        return response()->json([
            'success' => true,
            'message' => 'Student updated successfully.',
            'data' => $student,
        ]);
    }

    /**
     * Delete a student belonging to the admin's tenant.
     */
    public function destroyStudent(Request $request, int $id): JsonResponse
    {
        $tenantId = $this->getTenantId($request);

        $student = User::where('tenant_id', $tenantId)
            ->where('role', 'student')
            ->findOrFail($id);

        $student->delete();

        return response()->json([
            'success' => true,
            'message' => 'Student removed successfully.',
        ]);
    }

    /*
    |--------------------------------------------------------------------------
    | PROFESSORS MANAGEMENT (CRUD)
    |--------------------------------------------------------------------------
    */

    /**
     * List all professors belonging strictly to the admin's tenant.
     */
    public function indexProfessors(Request $request): JsonResponse
    {
        $tenantId = $this->getTenantId($request);

        $query = User::where('tenant_id', $tenantId)
            ->where('role', 'professor')
            ->withCount('taughtSubjects');

        // Search by name or email (escape wildcards)
        if ($search = $request->query('search')) {
            $escaped = addcslashes($search, '%_\\');
            $query->where(function ($q) use ($escaped) {
                $q->where('name', 'like', "%{$escaped}%")
                  ->orWhere('email', 'like', "%{$escaped}%");
            });
        }

        // Filter by status
        if ($status = $request->query('status')) {
            $query->where('status', $status);
        }

        // Cap per_page at 100 to prevent DoS via oversized queries
        $perPage = min((int) $request->query('per_page', 10), 100);
        $professors = $query->latest()->paginate($perPage);

        return response()->json([
            'success' => true,
            'data' => $professors->items(),
            'pagination' => [
                'current_page' => $professors->currentPage(),
                'last_page' => $professors->lastPage(),
                'per_page' => $professors->perPage(),
                'total' => $professors->total(),
            ],
        ]);
    }

    /**
     * Store a new professor under the admin's tenant.
     */
    public function storeProfessor(Request $request): JsonResponse
    {
        $tenantId = $this->getTenantId($request);

        $validated = $request->validate([
            'name' => ['required', 'string', 'max:255'],
            'email' => ['required', 'string', 'email', 'max:255', 'unique:users,email'],
            'password' => ['required', 'string', 'min:8'],
            'status' => ['nullable', 'string', 'in:active,inactive,suspended'],
        ]);

        $professor = User::create([
            'tenant_id' => $tenantId,
            'name' => $validated['name'],
            'email' => $validated['email'],
            'password' => Hash::make($validated['password']),
            'role' => 'professor',
            'status' => $validated['status'] ?? 'active',
        ]);

        return response()->json([
            'success' => true,
            'message' => 'Professor created successfully.',
            'data' => $professor,
        ], 201);
    }

    /**
     * Update an existing professor belonging to the admin's tenant.
     */
    public function updateProfessor(Request $request, int $id): JsonResponse
    {
        $tenantId = $this->getTenantId($request);

        $professor = User::where('tenant_id', $tenantId)
            ->where('role', 'professor')
            ->findOrFail($id);

        $validated = $request->validate([
            'name' => ['sometimes', 'required', 'string', 'max:255'],
            'email' => [
                'sometimes',
                'required',
                'string',
                'email',
                'max:255',
                Rule::unique('users', 'email')->ignore($professor->id),
            ],
            'password' => ['nullable', 'string', 'min:8'],
            'status' => ['sometimes', 'required', 'string', 'in:active,inactive,suspended'],
        ]);

        if (!empty($validated['password'])) {
            $validated['password'] = Hash::make($validated['password']);
        } else {
            unset($validated['password']);
        }

        $professor->update($validated);

        return response()->json([
            'success' => true,
            'message' => 'Professor updated successfully.',
            'data' => $professor,
        ]);
    }

    /**
     * Delete a professor belonging to the admin's tenant.
     */
    public function destroyProfessor(Request $request, int $id): JsonResponse
    {
        $tenantId = $this->getTenantId($request);

        $professor = User::where('tenant_id', $tenantId)
            ->where('role', 'professor')
            ->findOrFail($id);

        $professor->delete();

        return response()->json([
            'success' => true,
            'message' => 'Professor removed successfully.',
        ]);
    }
}
