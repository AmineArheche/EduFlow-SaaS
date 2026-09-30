# Changelog

All notable changes to the **EduFlow-SaaS** project are documented here.

## [1.0.0] - 2026-09-30

### Added
- **Multi-Tenant Database Architecture**:
  - `tenants` table with subscription and slug isolation.
  - Linked `users` table via `tenant_id` foreign key.
  - `classes` and `subjects` tables with professor assignments.
- **RBAC Authentication Engine**:
  - Laravel Sanctum token-based authentication.
  - Custom `CheckRole` middleware for role authorization (`super_admin`, `school_admin`, `professor`, `student`).
  - Four distinct dashboard route groups returning JSON responses for APIs and redirects for web sessions.
- **School Admin Management**:
  - Full CRUD operations for Students and Professors in `SchoolAdminController`.
  - Real-time client-side and server-side email validation per tenant.
- **Frontend SPA (React 19 + Vite + Tailwind CSS v4)**:
  - Role-based switcher supporting School Admin, Professor, and Student dashboards.
  - Interactive data tables with live search, status filtering, and pagination.
  - Modals for adding and editing users with real-time validation.
  - Custom animated Toast notifications.
- **CI/CD & Repository Standards**:
  - GitHub Actions workflows for backend PHPUnit and frontend Vite builds.
  - PR and Issue templates.
