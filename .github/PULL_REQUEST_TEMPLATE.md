## 📋 Description of Changes
Please include a concise summary of the change and which issue it resolves or feature it introduces.

- [ ] Backend API / Migration
- [ ] RBAC Security & Authorization
- [ ] Frontend UI Component
- [ ] Documentation / CI/CD

---

## 🔒 Security & Tenant Isolation Checklist
- [ ] Queries are strictly scoped to the authenticated user's `tenant_id`.
- [ ] Route groups are protected by appropriate `role:<role_name>` middleware.
- [ ] Email addresses are validated as unique per tenant (`Rule::unique()->where('tenant_id', ...)`).
- [ ] All user passwords are encrypted using `Hash::make()`.
- [ ] No sensitive credentials or `.env` files are included in this PR.

---

## 🧪 Testing Verification
- [ ] Automated tests pass (`php artisan test`).
- [ ] Frontend builds without errors (`npm run build`).
- [ ] Manual verification in browser executed on both Student and Professor views.

---

## 📸 Screenshots / Proof of Execution (if applicable)
Add screenshots or API JSON response snippets here.
