# Contributing to EduFlow-SaaS

Thank you for your interest in contributing to **EduFlow-SaaS**! Follow these instructions to keep our multi-tenant architecture clean, secure, and maintainable.

---

## 🌿 Branching Conventions

We follow git-flow style feature branches:
- `feature/<feature-name>`: New capabilities (e.g. `feature/multi-tenant-migrations`)
- `fix/<bug-name>`: Bug fixes
- `docs/<doc-name>`: Documentation updates
- `refactor/<scope>`: Code refactoring without behavior change

---

## 📜 Commit Message Conventions

We strictly follow Conventional Commits:
- `feat(scope): add new capability`
- `fix(scope): resolve issue`
- `docs: update documentation`
- `test(scope): add automated tests`
- `chore(scope): build script or dependency updates`

---

## 🔒 Security Best Practices for Contributions
1. **Tenant Isolation**: Always enforce `where('tenant_id', $user->tenant_id)` in database queries. Never allow a school admin to modify records outside their tenant.
2. **RBAC Protection**: Guard all routes using the `role:<role_name>` middleware.
3. **Data Validation**: Sanitize user inputs and validate emails with per-tenant uniqueness constraints.
4. **Password Security**: Passwords must always be hashed with `Hash::make()` before saving to the database.

---

## 🚀 Local Development Workflow
```bash
# Backend Setup
cd backend
composer install
php artisan migrate:fresh --seed
php artisan serve --port=8000

# Frontend Setup
cd ../frontend
npm install
npm run dev
```
