<?php

namespace Tests\Feature;

use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Laravel\Sanctum\Sanctum;
use Tests\TestCase;

class RbacAccessTest extends TestCase
{
    use RefreshDatabase;
    public function test_unauthenticated_request_is_rejected_with_401(): void
    {
        $response = $this->getJson('/api/admin/dashboard');

        $response->assertStatus(401);
    }

    public function test_student_cannot_access_super_admin_dashboard(): void
    {
        $student = User::factory()->make([
            'role' => 'student',
            'status' => 'active',
        ]);

        Sanctum::actingAs($student, ['student']);

        $response = $this->getJson('/api/admin/dashboard');

        $response->assertStatus(403)
            ->assertJson([
                'success' => false,
                'message' => 'Unauthorized access. Insufficient role permissions.',
                'current_role' => 'student',
            ]);
    }

    public function test_super_admin_can_access_admin_dashboard(): void
    {
        $superAdmin = User::factory()->make([
            'role' => 'super_admin',
            'status' => 'active',
        ]);

        Sanctum::actingAs($superAdmin, ['super_admin']);

        $response = $this->getJson('/api/admin/dashboard');

        $response->assertStatus(200)
            ->assertJson([
                'success' => true,
                'role' => 'super_admin',
            ]);
    }
}
