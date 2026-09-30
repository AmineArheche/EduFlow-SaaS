<?php

namespace Database\Seeders;

use App\Models\SchoolClass;
use App\Models\Subject;
use App\Models\Tenant;
use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database with multi-tenant structure.
     */
    public function run(): void
    {
        // 1. Platform Super Admin
        $superAdmin = User::updateOrCreate(
            ['email' => 'superadmin@eduflow.io'],
            [
                'tenant_id' => null,
                'name' => 'Super Administrator',
                'password' => Hash::make('password123'),
                'role' => 'super_admin',
                'status' => 'active',
            ]
        );

        // 2. Demo School Tenant
        $tenant = Tenant::updateOrCreate(
            ['slug' => 'horizon-academy'],
            [
                'school_name' => 'Horizon International Academy',
                'email' => 'contact@horizon-academy.edu',
                'subscription_status' => 'active',
                'stripe_customer_id' => 'cus_mocked_eduflow_101',
            ]
        );

        // 3. School Admin
        $schoolAdmin = User::updateOrCreate(
            ['email' => 'admin@horizon-academy.edu'],
            [
                'tenant_id' => $tenant->id,
                'name' => 'Sarah Connor (Principal)',
                'password' => Hash::make('password123'),
                'role' => 'school_admin',
                'status' => 'active',
            ]
        );

        // 4. Professors
        $professorMath = User::updateOrCreate(
            ['email' => 'alan.turing@horizon-academy.edu'],
            [
                'tenant_id' => $tenant->id,
                'name' => 'Dr. Alan Turing',
                'password' => Hash::make('password123'),
                'role' => 'professor',
                'status' => 'active',
            ]
        );

        $professorPhysics = User::updateOrCreate(
            ['email' => 'marie.curie@horizon-academy.edu'],
            [
                'tenant_id' => $tenant->id,
                'name' => 'Prof. Marie Curie',
                'password' => Hash::make('password123'),
                'role' => 'professor',
                'status' => 'active',
            ]
        );

        // 5. Classes
        $classGrade10 = SchoolClass::updateOrCreate(
            [
                'tenant_id' => $tenant->id,
                'name' => 'Grade 10 - Section A',
            ],
            [
                'grade_level' => 'Grade 10',
                'academic_year' => '2026-2027',
            ]
        );

        $classGrade11 = SchoolClass::updateOrCreate(
            [
                'tenant_id' => $tenant->id,
                'name' => 'Grade 11 - Advanced STEM',
            ],
            [
                'grade_level' => 'Grade 11',
                'academic_year' => '2026-2027',
            ]
        );

        // 6. Subjects
        Subject::updateOrCreate(
            [
                'tenant_id' => $tenant->id,
                'class_id' => $classGrade10->id,
                'name' => 'Algebra & Geometry',
            ],
            [
                'professor_id' => $professorMath->id,
            ]
        );

        Subject::updateOrCreate(
            [
                'tenant_id' => $tenant->id,
                'class_id' => $classGrade10->id,
                'name' => 'Classical Physics',
            ],
            [
                'professor_id' => $professorPhysics->id,
            ]
        );

        // 7. Student
        User::updateOrCreate(
            ['email' => 'student.john@horizon-academy.edu'],
            [
                'tenant_id' => $tenant->id,
                'name' => 'John Doe',
                'password' => Hash::make('password123'),
                'role' => 'student',
                'status' => 'active',
            ]
        );
    }
}
