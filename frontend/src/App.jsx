import React, { useState, useEffect } from 'react';
import Sidebar from './components/Sidebar';
import LoginPage from './components/LoginPage';
import SuperAdminDashboard from './components/SuperAdminDashboard';
import SchoolAdminDashboard from './components/SchoolAdminDashboard';
import ProfessorDashboard from './components/ProfessorDashboard';
import StudentDashboard from './components/StudentDashboard';
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
  // Authentication state: if null, shows LoginPage
  const [currentUser, setCurrentUser] = useState(null);
  const [currentRole, setCurrentRole] = useState('school_admin'); // 'super_admin' | 'school_admin' | 'professor' | 'student'
  const [currentView, setCurrentView] = useState('overview');
  const [activeTenant, setActiveTenant] = useState(mockTenants[0]);
  const [toasts, setToasts] = useState([
    {
      id: 1,
      type: 'info',
      title: 'EduFlow-SaaS Gateway',
      message: 'Sign in with your role-specific credentials to enter your dedicated portal.',
    },
  ]);

  // Session rehydration on initial mount
  useEffect(() => {
    const token = localStorage.getItem('eduflow_token');
    if (!token) return;

    fetch('/api/auth/me', {
      headers: {
        Authorization: `Bearer ${token}`,
        Accept: 'application/json',
      },
    })
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => {
        if (data && data.success && data.user) {
          setCurrentUser(data.user);
          setCurrentRole(data.user.role);
          addToast({
            type: 'info',
            title: 'Session Restored',
            message: `Welcome back, ${data.user.name}.`,
          });
        } else {
          localStorage.removeItem('eduflow_token');
        }
      })
      .catch(() => {
        // Fallback gracefully on network error
      });
  }, []);

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

  // Login handler: filters by role and redirects to appropriate dashboard
  const handleLoginSuccess = (user, role) => {
    setCurrentUser(user);
    setCurrentRole(role);
    setCurrentView('overview');
  };

  // Logout handler: revokes token server-side and clears client state
  const handleLogout = async () => {
    const token = localStorage.getItem('eduflow_token');
    if (token) {
      try {
        await fetch('/api/auth/logout', {
          method: 'POST',
          headers: {
            Authorization: `Bearer ${token}`,
            Accept: 'application/json',
          },
        });
      } catch {
        // Continue logout even if server is offline
      }
      localStorage.removeItem('eduflow_token');
    }
    setCurrentUser(null);
    addToast({
      type: 'info',
      title: 'Signed Out',
      message: 'You have been signed out. Token revoked.',
    });
  };

  // Role change switcher
  const handleRoleChange = (role) => {
    setCurrentRole(role);
    setCurrentView('overview');
    const roleLabels = {
      super_admin: 'Platform Super Administrator',
      school_admin: 'School Administrator (Sarah Connor)',
      professor: 'Faculty Professor (Dr. Alan Turing)',
      student: 'Enrolled Student (John Doe)',
    };
    addToast({
      type: 'success',
      title: 'Portal View Changed',
      message: `Navigated to ${roleLabels[role]}. Access enforced via RBAC.`,
    });
  };

  // If user is not authenticated, render LoginPage
  if (!currentUser) {
    return (
      <>
        <Toast toasts={toasts} onDismiss={dismissToast} />
        <LoginPage onLoginSuccess={handleLoginSuccess} addToast={addToast} />
      </>
    );
  }

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans selection:bg-indigo-500 selection:text-white">
      {/* Toast Notification Container */}
      <Toast toasts={toasts} onDismiss={dismissToast} />

      <div className="flex-1 flex flex-col md:flex-row min-h-screen">
        {/* Sidebar Navigation */}
        <Sidebar
          currentUser={currentUser}
          currentRole={currentRole}
          setCurrentRole={handleRoleChange}
          currentView={currentView}
          setCurrentView={setCurrentView}
          schoolName={activeTenant.school_name}
          studentsCount="380"
          professorsCount="26"
          onLogout={handleLogout}
        />

        {/* Main Content Area */}
        <div className="flex-1 flex flex-col min-w-0 bg-slate-950">
          {/* Top Bar with Role Filter Switcher & Logout */}
          <header className="h-16 border-b border-slate-800 bg-slate-900/60 backdrop-blur-md px-6 flex items-center justify-between sticky top-0 z-30">
            {/* Left: Role Filter Switcher */}
            <div className="flex items-center gap-3">
              <span className="text-xs text-slate-400 hidden sm:inline">Active Role Filter:</span>
              <div className="flex items-center gap-1.5 bg-slate-950 p-1 rounded-xl border border-slate-800 text-xs">
                <button
                  onClick={() => handleRoleChange('super_admin')}
                  className={`px-2.5 py-1 rounded-lg font-bold transition flex items-center gap-1 ${
                    currentRole === 'super_admin'
                      ? 'bg-rose-600 text-white shadow-md shadow-rose-600/30'
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  <span>👑</span>
                  <span>Super Admin</span>
                </button>
                <button
                  onClick={() => handleRoleChange('school_admin')}
                  className={`px-2.5 py-1 rounded-lg font-bold transition flex items-center gap-1 ${
                    currentRole === 'school_admin'
                      ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/30'
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  <span>🏫</span>
                  <span>School Admin</span>
                </button>
                <button
                  onClick={() => handleRoleChange('professor')}
                  className={`px-2.5 py-1 rounded-lg font-bold transition flex items-center gap-1 ${
                    currentRole === 'professor'
                      ? 'bg-cyan-600 text-white shadow-md shadow-cyan-600/30'
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  <span>👨‍🏫</span>
                  <span>Professor</span>
                </button>
                <button
                  onClick={() => handleRoleChange('student')}
                  className={`px-2.5 py-1 rounded-lg font-bold transition flex items-center gap-1 ${
                    currentRole === 'student'
                      ? 'bg-emerald-600 text-white shadow-md shadow-emerald-600/30'
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  <span>🎓</span>
                  <span>Student</span>
                </button>
              </div>
            </div>

            {/* Right: Tenant info & Sign Out */}
            <div className="flex items-center gap-3">
              {currentRole !== 'super_admin' && (
                <div className="hidden lg:flex items-center gap-2 text-xs">
                  <span className="text-slate-400">School:</span>
                  <select
                    value={activeTenant.id}
                    onChange={(e) => {
                      const selected = mockTenants.find((t) => t.id === Number(e.target.value));
                      setActiveTenant(selected);
                      addToast({
                        type: 'info',
                        title: 'School Tenant Switched',
                        message: `Scoped to "${selected.school_name}" (tenant_id: ${selected.id}).`,
                      });
                    }}
                    className="bg-slate-900 text-indigo-300 font-semibold px-2.5 py-1 rounded-lg border border-slate-700 outline-none text-xs"
                  >
                    {mockTenants.map((t) => (
                      <option key={t.id} value={t.id}>
                        {t.school_name}
                      </option>
                    ))}
                  </select>
                </div>
              )}

              <button
                onClick={handleLogout}
                className="px-3 py-1.5 text-xs font-semibold rounded-xl bg-slate-800 hover:bg-rose-500/10 hover:text-rose-400 border border-slate-700 hover:border-rose-500/30 text-slate-300 transition flex items-center gap-1.5"
              >
                <span>🚪</span>
                <span className="hidden sm:inline">Sign Out</span>
              </button>
            </div>
          </header>

          {/* Subheader Banner */}
          <div className="px-6 py-5 border-b border-slate-800/80 bg-gradient-to-r from-slate-900 via-indigo-950/20 to-slate-900">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h2 className="text-lg font-extrabold text-white flex items-center gap-2">
                  <span>
                    {currentRole === 'super_admin'
                      ? '👑 Platform Super Admin Operations'
                      : currentRole === 'professor'
                      ? '👨‍🏫 Professor Teaching Center & Gradebook'
                      : currentRole === 'student'
                      ? '🎓 Student Academic Space & Homework'
                      : '🏫 School Admin Operations Console'}
                  </span>
                </h2>
                <p className="text-xs text-slate-400 mt-0.5">
                  Logged in as <strong className="text-white">{currentUser.name}</strong> ({currentUser.email}) &bull; Role:{' '}
                  <span className="text-indigo-300 font-mono capitalize">{currentRole.replace('_', ' ')}</span>
                </p>
              </div>

              <div className="flex items-center gap-2 text-xs font-mono">
                <span className="text-slate-500">Guarded API:</span>
                <span className="px-2.5 py-0.5 rounded bg-slate-950 text-indigo-300 border border-slate-800 font-bold">
                  {currentRole === 'super_admin'
                    ? '/api/admin/dashboard'
                    : currentRole === 'professor'
                    ? '/api/professor/dashboard'
                    : currentRole === 'student'
                    ? '/api/student/dashboard'
                    : '/api/school/dashboard'}
                </span>
              </div>
            </div>
          </div>

          {/* Main Dashboard Render based on Role */}
          <main className="p-6 flex-1">
            {currentView === 'rbac_sim' ? (
              <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-6 space-y-4">
                <h3 className="text-base font-bold text-white">RBAC Security Specification</h3>
                <p className="text-xs text-slate-400">
                  Each user is strictly filtered and routed according to their token ability and role.
                </p>
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4 pt-2">
                  <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 text-xs">
                    <strong className="text-rose-400 block mb-1">👑 Super Admin</strong>
                    <code className="text-slate-300 font-mono text-[11px] block">/api/admin/dashboard</code>
                    <p className="text-slate-500 mt-2">Manage all 18 school subscriptions and platform analytics.</p>
                  </div>
                  <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 text-xs">
                    <strong className="text-amber-400 block mb-1">🏫 School Admin</strong>
                    <code className="text-slate-300 font-mono text-[11px] block">/api/school/*</code>
                    <p className="text-slate-500 mt-2">Manage student directory, faculty staff, classes, and cohorts.</p>
                  </div>
                  <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 text-xs">
                    <strong className="text-cyan-400 block mb-1">👨‍🏫 Professor</strong>
                    <code className="text-slate-300 font-mono text-[11px] block">/api/professor/dashboard</code>
                    <p className="text-slate-500 mt-2">Course syllabus, student evaluations, exam schedules.</p>
                  </div>
                  <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 text-xs">
                    <strong className="text-emerald-400 block mb-1">🎓 Student</strong>
                    <code className="text-slate-300 font-mono text-[11px] block">/api/student/dashboard</code>
                    <p className="text-slate-500 mt-2">Enrolled subjects, GPA tracker, homework submissions.</p>
                  </div>
                </div>
              </div>
            ) : currentRole === 'super_admin' ? (
              <SuperAdminDashboard addToast={addToast} />
            ) : currentRole === 'professor' ? (
              <ProfessorDashboard addToast={addToast} />
            ) : currentRole === 'student' ? (
              <StudentDashboard addToast={addToast} />
            ) : (
              <SchoolAdminDashboard currentTab={currentView} addToast={addToast} />
            )}
          </main>

          {/* Footer */}
          <footer className="border-t border-slate-800/80 bg-slate-950 p-4 text-center text-xs text-slate-500">
            EduFlow-SaaS &copy; 2026. Role-Based Educational Architecture &bull; Laravel 12 Backend + React Vite.
          </footer>
        </div>
      </div>
    </div>
  );
}
