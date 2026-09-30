import React, { useState } from 'react';
import Sidebar from './components/Sidebar';
import SchoolAdminDashboard from './components/SchoolAdminDashboard';
import Toast from './components/Toast';

const mockTenants = [
  {
    id: 1,
    school_name: 'Horizon International Academy',
    slug: 'horizon-academy',
    subscription_status: 'active',
    studentsCount: 380,
    professorsCount: 26,
  },
  {
    id: 2,
    school_name: 'St. Jude STEM Preparatory',
    slug: 'stjude-stem',
    subscription_status: 'trialing',
    studentsCount: 195,
    professorsCount: 14,
  },
  {
    id: 3,
    school_name: 'Lycée Excellence Descartes',
    slug: 'lycee-descartes',
    subscription_status: 'active',
    studentsCount: 620,
    professorsCount: 42,
  },
];

export default function App() {
  const [currentView, setCurrentView] = useState('overview'); // 'overview' | 'students' | 'professors' | 'classes' | 'rbac_sim'
  const [activeTenant, setActiveTenant] = useState(mockTenants[0]);
  const [toasts, setToasts] = useState([
    {
      id: 1,
      type: 'success',
      title: 'School Admin Connected',
      message: 'Authenticated as Sarah Connor (Principal) at Horizon International Academy.',
    },
  ]);

  const addToast = (toast) => {
    const id = Date.now();
    const newToast = { ...toast, id };
    setToasts((prev) => [...prev, newToast]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 3800);
  };

  const dismissToast = (id) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans selection:bg-indigo-500 selection:text-white">
      {/* Toast Notification Container */}
      <Toast toasts={toasts} onDismiss={dismissToast} />

      <div className="flex-1 flex flex-col md:flex-row min-h-screen">
        {/* Sidebar Navigation */}
        <Sidebar
          currentView={currentView}
          setCurrentView={setCurrentView}
          schoolName={activeTenant.school_name}
          studentsCount="380"
          professorsCount="26"
        />

        {/* Main Content Area */}
        <div className="flex-1 flex flex-col min-w-0 bg-slate-950">
          {/* Top Bar */}
          <header className="h-16 border-b border-slate-800 bg-slate-900/60 backdrop-blur-md px-6 flex items-center justify-between sticky top-0 z-30">
            <div className="flex items-center gap-3">
              <h1 className="text-base font-bold text-white flex items-center gap-2">
                <span>School Admin Dashboard</span>
                <span className="text-[11px] px-2 py-0.5 rounded-full bg-slate-800 text-indigo-300 font-mono">
                  Tenant #{activeTenant.id}
                </span>
              </h1>
            </div>

            <div className="flex items-center gap-4">
              {/* Tenant Switcher simulation */}
              <div className="flex items-center gap-2 text-xs">
                <span className="text-slate-400 hidden sm:inline">Active School:</span>
                <select
                  value={activeTenant.id}
                  onChange={(e) => {
                    const selected = mockTenants.find((t) => t.id === Number(e.target.value));
                    setActiveTenant(selected);
                    addToast({
                      type: 'info',
                      title: 'School Tenant Switched',
                      message: `Data scoped strictly to "${selected.school_name}" (tenant_id: ${selected.id}).`,
                    });
                  }}
                  className="bg-slate-900 text-indigo-300 font-semibold px-3 py-1.5 rounded-xl border border-slate-700 outline-none text-xs"
                >
                  {mockTenants.map((t) => (
                    <option key={t.id} value={t.id}>
                      {t.school_name}
                    </option>
                  ))}
                </select>
              </div>

              <a
                href="http://localhost:8000"
                target="_blank"
                rel="noreferrer"
                className="px-3 py-1.5 text-xs font-semibold rounded-xl bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-300 transition"
              >
                API Docs
              </a>
            </div>
          </header>

          {/* Subheader Banner */}
          <div className="px-6 py-6 border-b border-slate-800/80 bg-gradient-to-r from-slate-900 via-indigo-950/20 to-slate-900">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h2 className="text-xl font-extrabold text-white">
                  {currentView === 'students'
                    ? 'Students Enrollment & Directory'
                    : currentView === 'professors'
                    ? 'Faculty & Professors Staff'
                    : currentView === 'rbac_sim'
                    ? 'Role-Based Access Control Architecture'
                    : `Welcome to ${activeTenant.school_name}`}
                </h2>
                <p className="text-xs text-slate-400 mt-1">
                  Manage academic cohorts, assign courses, and maintain student enrollments with strict tenant isolation.
                </p>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => setCurrentView('students')}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition ${
                    currentView === 'students'
                      ? 'bg-indigo-600 text-white'
                      : 'bg-slate-800 text-slate-400 hover:text-white'
                  }`}
                >
                  Manage Students
                </button>
                <button
                  onClick={() => setCurrentView('professors')}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition ${
                    currentView === 'professors'
                      ? 'bg-indigo-600 text-white'
                      : 'bg-slate-800 text-slate-400 hover:text-white'
                  }`}
                >
                  Manage Professors
                </button>
              </div>
            </div>
          </div>

          {/* Main Body */}
          <main className="p-6 flex-1">
            {currentView === 'rbac_sim' ? (
              <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-6 space-y-4">
                <h3 className="text-base font-bold text-white">RBAC Security Spec</h3>
                <p className="text-xs text-slate-400">
                  School Admin routes are guarded by <code className="text-indigo-300">['auth:sanctum', 'role:school_admin']</code>.
                  Every query to users, students, or professors strictly enforces:
                </p>
                <pre className="p-4 rounded-xl bg-slate-950 border border-slate-800 text-xs font-mono text-emerald-300 overflow-x-auto">
{`$tenantId = $request->user()->tenant_id;
User::where('tenant_id', $tenantId)->where('role', 'student')->paginate();`}
                </pre>
              </div>
            ) : (
              <SchoolAdminDashboard
                currentTab={currentView}
                addToast={addToast}
              />
            )}
          </main>

          {/* Footer */}
          <footer className="border-t border-slate-800/80 bg-slate-950 p-4 text-center text-xs text-slate-500">
            EduFlow-SaaS &copy; 2026. School Admin Management Console &bull; Backend: Laravel 12 &bull; Frontend: React + Tailwind CSS v4.
          </footer>
        </div>
      </div>
    </div>
  );
}
