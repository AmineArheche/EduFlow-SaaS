import React, { useState } from 'react';

const demoAccounts = [
  {
    role: 'super_admin',
    name: 'Super Administrator',
    email: 'superadmin@eduflow.io',
    password: 'password123',
    icon: '👑',
    badge: 'Platform Owner',
    color: 'from-rose-500/15 via-slate-900 to-rose-950/30 border-rose-500/30 text-rose-300 hover:border-rose-400',
    desc: 'Access all schools, billing & global SaaS analytics',
  },
  {
    role: 'school_admin',
    name: 'Sarah Connor (Principal)',
    email: 'admin@horizon-academy.edu',
    password: 'password123',
    icon: '🏫',
    badge: 'School Admin',
    color: 'from-amber-500/15 via-slate-900 to-amber-950/30 border-amber-500/30 text-amber-300 hover:border-amber-400',
    desc: 'Manage student directory, professors, and classes',
  },
  {
    role: 'professor',
    name: 'Dr. Alan Turing',
    email: 'alan.turing@horizon-academy.edu',
    password: 'password123',
    icon: '👨‍🏫',
    badge: 'Professor',
    color: 'from-cyan-500/15 via-slate-900 to-cyan-950/30 border-cyan-500/30 text-cyan-300 hover:border-cyan-400',
    desc: 'Gradebooks, course syllabus, and exam schedules',
  },
  {
    role: 'student',
    name: 'John Doe',
    email: 'student.john@horizon-academy.edu',
    password: 'password123',
    icon: '🎓',
    badge: 'Student',
    color: 'from-emerald-500/15 via-slate-900 to-emerald-950/30 border-emerald-500/30 text-emerald-300 hover:border-emerald-400',
    desc: 'Enrolled courses, GPA marks, and homework uploads',
  },
];

export default function LoginPage({ onLoginSuccess, addToast }) {
  const [email, setEmail] = useState('admin@horizon-academy.edu');
  const [password, setPassword] = useState('password123');
  const [rememberMe, setRememberMe] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  // 1-Click Instant Login
  const handleInstantLogin = (account) => {
    setEmail(account.email);
    setPassword(account.password);
    authenticateUser(account.email, account.password, account);
  };

  const authenticateUser = async (userEmail, userPassword, fallbackDemo = null) => {
    setIsLoading(true);
    setErrorMsg('');

    const targetDemo = fallbackDemo || demoAccounts.find(
      (d) => d.email.toLowerCase() === userEmail.trim().toLowerCase()
    );

    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 4000);

      // Attempt live API login through Vite proxy
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json',
        },
        body: JSON.stringify({ email: userEmail, password: userPassword }),
        signal: controller.signal,
      });

      clearTimeout(timeoutId);
      const data = await response.json();

      if (response.ok && data.success) {
        if (rememberMe && data.token) {
          localStorage.setItem('eduflow_token', data.token);
        }
        addToast({
          type: 'success',
          title: 'Access Granted',
          message: `Welcome back, ${data.user.name}! Redirecting to ${data.user.role.replace('_', ' ')} portal...`,
        });
        onLoginSuccess(data.user, data.user.role);
        return;
      } else {
        if (data.message) {
          setErrorMsg(data.message);
          setIsLoading(false);
          return;
        }
      }
    } catch {
      // If network/proxy throws, use the verified demo fallback
      if (targetDemo && (userPassword === 'password123' || !userPassword)) {
        const simulatedUser = {
          id: targetDemo.role === 'super_admin' ? 1 : 2,
          name: targetDemo.name,
          email: targetDemo.email,
          role: targetDemo.role,
          status: 'active',
          tenant: targetDemo.role !== 'super_admin' ? {
            id: 1,
            school_name: 'Horizon International Academy',
            slug: 'horizon-academy',
          } : null,
        };

        addToast({
          type: 'success',
          title: 'Access Granted (Demo Session)',
          message: `Welcome, ${simulatedUser.name}! Entering ${simulatedUser.role.replace('_', ' ')} dashboard...`,
        });
        onLoginSuccess(simulatedUser, simulatedUser.role);
        return;
      }

      setErrorMsg('Invalid email or password. Please select one of the 4 demo profiles below.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!email || !password) {
      setErrorMsg('Please provide both email and password.');
      return;
    }
    authenticateUser(email, password);
  };

  return (
    <div className="min-h-screen bg-slate-950 flex flex-col justify-center items-center px-4 py-10 relative overflow-hidden font-sans">
      {/* Background radial glow */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-indigo-600/15 rounded-full blur-3xl pointer-events-none"></div>
      <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-cyan-600/10 rounded-full blur-3xl pointer-events-none"></div>

      {/* Main Container */}
      <div className="max-w-lg w-full space-y-6 relative z-10 animate-fadeIn">
        {/* Logo and Title */}
        <div className="text-center space-y-2">
          <div className="inline-flex w-14 h-14 rounded-2xl bg-gradient-to-tr from-indigo-600 via-violet-600 to-cyan-400 items-center justify-center shadow-xl shadow-indigo-500/25 ring-2 ring-white/20 mb-2">
            <span className="text-white font-black text-2xl">E</span>
          </div>
          <h1 className="text-2xl font-black bg-gradient-to-r from-white via-slate-100 to-indigo-300 bg-clip-text text-transparent">
            EduFlow-SaaS Gateway
          </h1>
          <p className="text-xs text-slate-400">
            Sign in to access your role-protected educational portal
          </p>
        </div>

        {/* 1-Click Instant Role Logins (Top Priority Access) */}
        <div className="bg-slate-900/90 border border-slate-800 rounded-3xl p-5 shadow-2xl backdrop-blur-xl space-y-3">
          <div className="flex items-center justify-between pb-2 border-b border-slate-800">
            <span className="text-xs font-bold text-white flex items-center gap-1.5">
              <span>⚡</span> Instant 1-Click Role Logins
            </span>
            <span className="text-[10px] text-emerald-400 font-semibold bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20">
              Ready to Test
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
            {demoAccounts.map((account) => (
              <button
                key={account.role}
                type="button"
                onClick={() => handleInstantLogin(account)}
                className={`p-3 rounded-2xl border text-left transition hover:scale-[1.02] active:scale-[0.99] bg-gradient-to-br ${account.color} flex flex-col justify-between`}
              >
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-base">{account.icon}</span>
                    <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-slate-950/80 text-slate-200">
                      {account.badge}
                    </span>
                  </div>
                  <h4 className="font-bold text-xs text-white truncate">{account.name}</h4>
                  <p className="text-[10px] text-slate-400 font-mono truncate">{account.email}</p>
                </div>
                <div className="mt-2.5 pt-2 border-t border-slate-800/60 flex items-center justify-between text-[10px]">
                  <span className="text-slate-400">Password: <code className="text-slate-300">password123</code></span>
                  <span className="font-bold text-indigo-400">Enter &rarr;</span>
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Manual Credentials Form */}
        <div className="bg-slate-900/80 border border-slate-800 rounded-3xl p-6 shadow-2xl backdrop-blur-xl">
          <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-4">
            Or Sign In with Specific Credentials
          </h3>

          {errorMsg && (
            <div className="mb-4 p-3 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs flex items-center gap-2">
              <span>⚠</span>
              <span>{errorMsg}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="text-xs font-semibold text-slate-300 block mb-1">
                Email Address
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="name@school.edu"
                required
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/40 focus:border-indigo-500 transition"
              />
            </div>

            <div>
              <label className="text-xs font-semibold text-slate-300 block mb-1">
                Password
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                required
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/40 focus:border-indigo-500 transition"
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
                <span>Remember me</span>
              </label>
              <span className="text-[11px] text-slate-500 font-mono">Sanctum RBAC Auth</span>
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
                <span>Sign In with Credentials</span>
              )}
            </button>
          </form>
        </div>

        {/* Footer info */}
        <p className="text-center text-xs text-slate-500">
          EduFlow-SaaS &bull; Protected by Laravel Sanctum &amp; CheckRole RBAC Engine
        </p>
      </div>
    </div>
  );
}
