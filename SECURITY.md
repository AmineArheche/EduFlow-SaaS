# Security Policy

## 🛡️ Supported Versions

| Version | Supported          |
| ------- | ------------------ |
| 1.0.x   | :white_check_mark: |

---

## 🔒 Multi-Tenant Security Standards

EduFlow-SaaS adheres to multi-tenant isolation standards:
1. **Tenant Data Segregation**: Every school is isolated by its `tenant_id`. Foreign key constraints cascade appropriately to prevent dangling orphan data.
2. **Role-Based Access Control (RBAC)**: All routes are verified via `auth:sanctum` and `CheckRole` middleware.
3. **Suspended Accounts Guard**: Accounts marked with `status != 'active'` are denied access immediately with an HTTP 403 response.
4. **Token Security**: Sanctum personal access tokens are hashed in storage and scoped with role abilities.

---

## 🚨 Reporting a Vulnerability

If you discover any security issue, please email `aminearheche@gmail.com`. Vulnerabilities are addressed promptly within 48 hours.
