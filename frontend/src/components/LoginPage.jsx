import React, { useState } from 'react';

const demoAccounts = [
  {
    role: 'super_admin',
    name: 'Super Administrator',
    email: 'superadmin@eduflow.io',
    password: 'password123',
    icon: '👑',
    color: 'from-rose-500/20 to-red-500/20 border-rose-500/30 text-rose-300',
    desc: 'Platform Owner (Access all schools & subscriptions)',
  },
  {
    role: 'school_admin',
    name: 'Sarah Connor (Principal)',
    email: 'admin@horizon-academy.edu',
    password: 'password123',
    icon: '🏫',
    color: 'from-amber-500/20 to-yellow-500/20 border-amber-500/30 text-amber-300',
    desc: 'School Administrator (Manage students, faculty & classes)',
  },
  {
    role: 'professor',
    name: 'Dr. Alan Turing',
    email: 'alan.turing@horizon-academy.edu',
    password: 'password123',
    icon: '👨‍🏫',
    color: 'from-cyan-500/20 to-blue-500/20 border-cyan-500/30 text-cyan-300',
    desc: 'Faculty Professor (Gradebooks, syllabus & exams)',
  },
  {
    role: 'student',
    name: 'John Doe',
    email: 'student.john@horizon-academy.edu',
    password: 'password123',
    icon: '🎓',
    color: 'from-emerald-500/20 to-teal-500/20 border-emerald-500/30 text-emerald-300',
    desc: 'Enrolled Student (Classes, grades & homework)',
  },
];

export default function LoginPage({ onLoginSuccess, addToast }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const handleQuickLogin = (demo) => {
    setEmail(demo.email);
    setPassword(demo.password);
    setErrorMsg('');
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    if (!email || !password) {
      setErrorMsg('Please enter both email address and password.');
      return;
    }

    setIsLoading(true);
    setErrorMsg('');

    try {
      // 1. Attempt live API login to Laravel backend
      const response = await fetch('http://localhost:8000/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (response.ok && data.success) {
        if (rememberMe && data.token) {
          localStorage.setItem('eduflow_token', data.token);
        }
        addToast({
          type: 'success',
          title: 'Login Successful',
          message: `Authenticated as ${data.user.name}. Redirecting to ${data.user.role.replace('_', ' ')} dashboard...`,
        });
        onLoginSuccess(data.user, data.user.role);
        return;
      } else {
        // If API returned an error (e.g. invalid credentials)
        if (response.status === 403 || response.status === 401 || response.status === 422) {
          setErrorMsg(data.message || 'The provided credentials do not match our records.');
          setIsLoading(false);
          return;
        }
      }
    } catch {
      // 2. Fallback to client-side simulated login if backend is unreachable
      const matchedDemo = demoAccounts.find((d) => d.email.toLowerCase() === email.toLowerCase());

      if (matchedDemo && password === 'password123') {
        const simulatedUser = {
          id: matchedDemo.role === 'super_admin' ? 1 : 2,
          name: matchedDemo.name,
          email: matchedDemo.email,
          role: matchedDemo.role,
          status: 'active',
          tenant: matchedDemo.role !== 'super_admin' ? {
            id: 1,
            school_name: 'Horizon International Academy',
            slug: 'horizon-academy',
          } : null,
        };

        addToast({
          type: 'success',
          title: 'Authenticated Successfully',
          message: `Logged in as ${simulatedUser.name}. Redirecting to ${simulatedUser.role.replace('_', ' ')} dashboard...`,
        });
        onLoginSuccess(simulatedUser, simulatedUser.role);
        return;
      }

      setErrorMsg('Invalid email or password. Use one of the demo accounts below to test.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 flex flex-col justify-center items-center px-4 py-12 relative overflow-hidden font-sans">
      {/* Background glow effects */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-indigo-600/15 rounded-full blur-3xl pointer-events-none"></div>
      <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-cyan-600/10 rounded-full blur-3xl pointer-events-none"></div>

      {/* Main Container */}
      <div className="max-w-md w-full space-y-6 relative z-10 animate-fadeIn">
        {/* Logo and Title */}
        <div className="text-center space-y-2">
          <div className="inline-flex w-14 h-14 rounded-2xl bg-gradient-to-tr from-indigo-600 via-violet-600 to-cyan-400 items-center justify-center shadow-xl shadow-indigo-500/25 ring-2 ring-white/20 mb-2">
            <span className="text-white font-black text-2xl">E</span>
          </div>
          <h1 className="text-2xl font-black bg-gradient-to-r from-white via-slate-100 to-indigo-300 bg-clip-text text-transparent">
            EduFlow-SaaS
          </h1>
          <p className="text-xs text-slate-400">
            Sign in to access your role-protected educational portal
          </p>
        </div>

        {/* Login Card */}
        <div className="bg-slate-900/90 border border-slate-800 rounded-3xl p-6 sm:p-8 shadow-2xl backdrop-blur-xl">
          {errorMsg && (
            <div className="mb-4 p-3 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs flex items-center gap-2">
              <span>⚠</span>
              <span>{errorMsg}</span>
            </div>
          )}

          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="text-xs font-semibold text-slate-300 block mb-1.5">
                School or Platform Email
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="name@school.edu"
                required
                className="w-full px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/40 focus:border-indigo-500 transition"
              />
            </div>

            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="text-xs font-semibold text-slate-300">
                  Password
                </label>
                <span className="text-[11px] text-indigo-400 hover:text-indigo-300 cursor-pointer">
                  Forgot password?
                </span>
              </div>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                required
                className="w-full px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/40 focus:border-indigo-500 transition"
              />
            </div>

            <div className="flex items-center justify-between text-xs text-slate-400 pt-1">
              <label className="flex items-center gap-2 cursor-pointer select-none">
                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  className="rounded bg-slate-950 border-slate-800 text-indigo-600 focus:ring-0"
                />
                <span>Remember this device</span>
              </label>
              <span className="text-[11px] text-slate-500">Sanctum Token Auth</span>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 disabled:opacity-60 text-xs font-bold text-white shadow-lg shadow-indigo-600/30 transition flex items-center justify-center gap-2 mt-2"
            >
              {isLoading ? (
                <>
                  <span className="w-3.5 h-3.5 border-2 border-white/20 border-t-white rounded-full animate-spin"></span>
                  <span>Verifying Credentials...</span>
                </>
              ) : (
                <span>Sign In &amp; Enter Dashboard</span>
              )}
            </button>
          </form>

          {/* Quick Fill Demo Roles */}
          <div className="mt-6 pt-5 border-t border-slate-800/80">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-2.5">
              1-Click Demo Accounts (Filtered by Role)
            </span>
            <div className="grid grid-cols-2 gap-2">
              {demoAccounts.map((account) => (
                <button
                  key={account.role}
                  type="button"
                  onClick={() => handleQuickLogin(account)}
                  className={`p-2.5 rounded-xl border text-left transition hover:scale-[1.02] bg-gradient-to-br ${account.color}`}
                >
                  <div className="flex items-center gap-1.5 font-bold text-xs text-white">
                    <span>{account.icon}</span>
                    <span className="capitalize">{account.role.replace('_', ' ')}</span>
                  </div>
                  <p className="text-[10px] text-slate-400 mt-0.5 truncate">{account.email}</p>
                </button>
              ))}
            </div>
            <p className="text-[10px] text-slate-500 mt-2 text-center">
              Click any role card to automatically populate email and password
            </p>
          </div>
        </div>

        {/* Footer info */}
        <p className="text-center text-xs text-slate-500">
          EduFlow-SaaS &bull; Protected by Laravel Sanctum &amp; CheckRole RBAC Engine
        </p>
      </div>
    </div>
  );
}
