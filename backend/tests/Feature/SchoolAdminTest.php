<?php

namespace Tests\Feature;

use App\Models\Tenant;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Laravel\Sanctum\Sanctum;
use Tests\TestCase;

class SchoolAdminTest extends TestCase
{
    use RefreshDatabase;

    protected Tenant $tenantA;
    protected Tenant $tenantB;
    protected User $adminA;
    protected User $adminB;
    protected User $studentA;
    protected User $studentB;

    protected function setUp(): void
    {
        parent::setUp();

        // Create Tenant A and its Admin + Student
        $this->tenantA = Tenant::create([
            'school_name' => 'School Alpha',
            'slug' => 'school-alpha',
            'email' => 'alpha@eduflow.test',
            'subscription_status' => 'active',
        ]);

        $this->adminA = User::create([
            'tenant_id' => $this->tenantA->id,
            'name' => 'Admin Alpha',
            'email' => 'admin@alpha.test',
            'password' => 'secret123',
            'role' => 'school_admin',
            'status' => 'active',
        ]);

        $this->studentA = User::create([
            'tenant_id' => $this->tenantA->id,
            'name' => 'Student Alice',
            'email' => 'alice@alpha.test',
            'password' => 'secret123',
            'role' => 'student',
            'status' => 'active',
        ]);

        // Create Tenant B and its Admin + Student
        $this->tenantB = Tenant::create([
            'school_name' => 'School Beta',
            'slug' => 'school-beta',
            'email' => 'beta@eduflow.test',
            'subscription_status' => 'active',
        ]);

        $this->adminB = User::create([
            'tenant_id' => $this->tenantB->id,
            'name' => 'Admin Beta',
            'email' => 'admin@beta.test',
            'password' => 'secret123',
            'role' => 'school_admin',
            'status' => 'active',
        ]);

        $this->studentB = User::create([
            'tenant_id' => $this->tenantB->id,
            'name' => 'Student Bob',
            'email' => 'bob@beta.test',
            'password' => 'secret123',
            'role' => 'student',
            'status' => 'active',
        ]);
    }

    public function test_school_admin_can_list_only_their_own_students(): void
    {
        Sanctum::actingAs($this->adminA, ['school_admin']);

        $response = $this->getJson('/api/school/students');

        $response->assertStatus(200)
            ->assertJson([
                'success' => true,
                'pagination' => ['total' => 1],
            ]);

        $data = $response->json('data');
        $this->assertCount(1, $data);
        $this->assertEquals('Student Alice', $data[0]['name']);
        $this->assertEquals($this->tenantA->id, $data[0]['tenant_id']);
    }

    public function test_school_admin_can_create_a_student(): void
    {
        Sanctum::actingAs($this->adminA, ['school_admin']);

        $response = $this->postJson('/api/school/students', [
            'name' => 'Charlie Brown',
            'email' => 'charlie@alpha.test',
            'password' => 'password123',
            'status' => 'active',
        ]);

        $response->assertStatus(201)
            ->assertJson([
                'success' => true,
                'message' => 'Student created successfully.',
                'data' => [
                    'name' => 'Charlie Brown',
                    'email' => 'charlie@alpha.test',
                    'role' => 'student',
                    'tenant_id' => $this->tenantA->id,
                ],
            ]);

        $this->assertDatabaseHas('users', [
            'email' => 'charlie@alpha.test',
            'tenant_id' => $this->tenantA->id,
        ]);
    }

    public function test_school_admin_cannot_access_or_modify_other_tenant_student(): void
    {
        Sanctum::actingAs($this->adminA, ['school_admin']);

        // Attempt to update student from Tenant B
        $response = $this->putJson("/api/school/students/{$this->studentB->id}", [
            'name' => 'Hacked Name',
        ]);

        $response->assertStatus(404);

        // Attempt to delete student from Tenant B
        $deleteResponse = $this->deleteJson("/api/school/students/{$this->studentB->id}");
        $deleteResponse->assertStatus(404);

        // Verify Student B remained unchanged
        $this->assertDatabaseHas('users', [
            'id' => $this->studentB->id,
            'name' => 'Student Bob',
        ]);
    }

    public function test_student_role_cannot_access_school_admin_endpoints(): void
    {
        Sanctum::actingAs($this->studentA, ['student']);

        $response = $this->getJson('/api/school/students');

        $response->assertStatus(403)
            ->assertJson([
                'success' => false,
                'message' => 'Unauthorized access. Insufficient role permissions.',
                'current_role' => 'student',
            ]);
    }

    public function test_pagination_is_safely_capped_at_100(): void
    {
        Sanctum::actingAs($this->adminA, ['school_admin']);

        $response = $this->getJson('/api/school/students?per_page=9999');

        $response->assertStatus(200);
        $this->assertEquals(100, $response->json('pagination.per_page'));
    }

    public function test_cross_tenant_directory_isolation_on_v1(): void
    {
        Sanctum::actingAs($this->adminA, ['school_admin']);

        // Admin A tries to access Tenant B directory
        $response = $this->getJson("/api/v1/tenants/{$this->tenantB->slug}");

        $response->assertStatus(403)
            ->assertJson([
                'success' => false,
                'message' => 'Access Denied: Cross-tenant resource access is forbidden.',
            ]);

        // Admin A can access their own Tenant A directory
        $ownResponse = $this->getJson("/api/v1/tenants/{$this->tenantA->slug}");
        $ownResponse->assertStatus(200);
    }
}
