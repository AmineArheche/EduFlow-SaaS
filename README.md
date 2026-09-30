# EduFlow-SaaS

Multi-tenant school management SaaS platform built with **Laravel 12** on the backend and **React (Vite + Tailwind CSS v4)** on the frontend.

---

## 📂 Project Structure

```text
EduFlow-SaaS/
├── backend/                  # Laravel 12 API Backend
│   ├── .env                  # MySQL configuration (eduflow_saas)
│   ├── app/Models/           # Eloquent Models (Tenant, User, SchoolClass, Subject)
│   ├── database/migrations/  # Core multi-tenant migrations
│   ├── database/seeders/     # Demo seeder with tenants, roles, classes, subjects
│   └── routes/api.php        # Multi-tenant API endpoints
└── frontend/                 # React 19 + Vite + Tailwind CSS v4 SPA
    ├── src/
    │   ├── App.jsx           # Multi-tenant UI & interactive schema explorer
    │   └── index.css         # Tailwind CSS styling
    ├── package.json
    └── vite.config.js
```

---

## 🗄️ Database Architecture & Migrations

### 1. `tenants`
- `id` (bigIncrements)
- `school_name` (string)
- `slug` (string, unique)
- `email` (string, unique)
- `subscription_status` (string, default: `trialing`)
- `stripe_customer_id` (string, nullable)
- `created_at`, `updated_at`

### 2. `users` (linked to tenants)
- `id` (bigIncrements)
- `tenant_id` (foreign key -> `tenants(id)`, nullable for platform super admins)
- `name` (string)
- `email` (string, unique)
- `password` (string, hashed)
- `role` (enum: `super_admin`, `school_admin`, `professor`, `student`, default: `student`)
- `status` (string, default: `active`)
- `email_verified_at`, `remember_token`, timestamps

### 3. `classes`
- `id` (bigIncrements)
- `tenant_id` (foreign key -> `tenants(id)`, cascade on delete)
- `name` (string) e.g., "Grade 10 - Section A"
- `grade_level` (string) e.g., "Grade 10"
- `academic_year` (string) e.g., "2026-2027"
- `created_at`, `updated_at`

### 4. `subjects`
- `id` (bigIncrements)
- `tenant_id` (foreign key -> `tenants(id)`, cascade on delete)
- `class_id` (foreign key -> `classes(id)`, cascade on delete)
- `professor_id` (foreign key -> `users(id)`, nullable, null on delete)
- `name` (string) e.g., "Algebra & Geometry"
- `created_at`, `updated_at`

---

## 🚀 Step-by-Step Setup Guide

### 1. Create MySQL Database
Ensure MySQL is running (via XAMPP or Windows MySQL Service), then create the database:
```bash
mysql -u root -e "CREATE DATABASE IF NOT EXISTS eduflow_saas CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;"
```

### 2. Run Backend Migrations & Seeders
Navigate to `EduFlow-SaaS/backend`:
```bash
cd backend
php artisan migrate
```
To run migrations and populate sample tenants, admins, professors, and classes:
```bash
php artisan migrate:fresh --seed
```

### 3. Start Backend API
```bash
php artisan serve --port=8000
```

### 4. Start Frontend
In a new terminal:
```bash
cd frontend
npm run dev
```
Open [http://localhost:5173](http://localhost:5173) in your browser.
