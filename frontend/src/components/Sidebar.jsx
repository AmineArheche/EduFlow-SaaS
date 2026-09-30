import React from 'react';

export default function Sidebar({
  currentUser,
  currentRole = 'school_admin',
  setCurrentRole,
  currentView,
  setCurrentView,
  schoolName,
  studentsCount,
  professorsCount,
  onLogout,
}) {
  const superAdminMenuItems = [
    { id: 'overview', label: 'Platform SaaS Overview', icon: '🌐', badge: '18 Schools' },
    { id: 'subscriptions', label: 'Tenants & Billing', icon: '💳', badge: 'Active' },
    { id: 'system_health', label: 'System Health', icon: '⚡', badge: '99.9%' },
  ];

  const adminMenuItems = [
    { id: 'overview', label: 'Dashboard Overview', icon: '📊', badge: null },
    { id: 'students', label: 'Students Directory', icon: '🎓', badge: studentsCount },
    { id: 'professors', label: 'Professors & Faculty', icon: '👨‍🏫', badge: professorsCount },
    { id: 'classes', label: 'Classes & Cohorts', icon: '🏫', badge: '14' },
  ];

  const professorMenuItems = [
    { id: 'prof_courses', label: 'My Taught Courses', icon: '📚', badge: '3' },
    { id: 'prof_gradebook', label: 'Evaluations & Grades', icon: '📝', badge: 'Active' },
    { id: 'prof_exams', label: 'Exam Schedules', icon: '📅', badge: '2 Upcoming' },
  ];

  const studentMenuItems = [
    { id: 'student_courses', label: 'Enrolled Classes', icon: '📖', badge: '4' },
    { id: 'student_homework', label: 'Assignments', icon: '📝', badge: '2 Due' },
    { id: 'student_grades', label: 'GPA & Marks', icon: '🏆', badge: '3.85' },
  ];

  const currentMenu =
    currentRole === 'super_admin'
      ? superAdminMenuItems
      : currentRole === 'professor'
      ? professorMenuItems
      : currentRole === 'student'
      ? studentMenuItems
      : adminMenuItems;

  const roleProfiles = {
    super_admin: {
      name: currentUser?.name || 'Super Administrator',
      role: 'role: super_admin',
      badge: 'Platform Owner',
      avatar: '👑',
      badgeColor: 'bg-rose-500/10 text-rose-400 border-rose-500/20',
      gradient: 'from-rose-500 to-indigo-600',
    },
    school_admin: {
      name: currentUser?.name || 'Sarah Connor',
      role: 'role: school_admin',
      badge: 'Principal',
      avatar: 'SC',
      badgeColor: 'bg-amber-500/10 text-amber-400 border-amber-500/20',
      gradient: 'from-amber-500 to-indigo-600',
    },
    professor: {
      name: currentUser?.name || 'Dr. Alan Turing',
      role: 'role: professor',
      badge: 'Faculty',
      avatar: 'AT',
      badgeColor: 'bg-cyan-500/10 text-cyan-400 border-cyan-500/20',
      gradient: 'from-cyan-500 to-blue-600',
    },
    student: {
      name: currentUser?.name || 'John Doe',
      role: 'role: student',
      badge: 'Student',
      avatar: 'JD',
      badgeColor: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20',
      gradient: 'from-emerald-500 to-teal-600',
    },
  };

  const profile = roleProfiles[currentRole] || roleProfiles.school_admin;

  return (
    <aside className="w-64 bg-slate-900/90 border-r border-slate-800 flex flex-col shrink-0 min-h-screen">
      {/* Brand Header */}
      <div className="p-5 border-b border-slate-800/80">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-indigo-600 via-violet-600 to-cyan-400 flex items-center justify-center shadow-lg shadow-indigo-500/25 ring-1 ring-white/20">
            <span className="text-white font-black text-lg">E</span>
          </div>
          <div className="overflow-hidden">
            <h2 className="text-sm font-bold text-white truncate">EduFlow-SaaS</h2>
            <p className="text-[11px] text-indigo-400 font-medium capitalize truncate">
              {currentRole.replace('_', ' ')} Portal
            </p>
          </div>
        </div>

        {/* Current Tenant Badge */}
        <div className="mt-4 p-2.5 rounded-xl bg-slate-950/70 border border-slate-800/80 flex items-center justify-between">
          <div className="overflow-hidden">
            <span className="text-[10px] text-slate-400 block font-semibold uppercase tracking-wider">Tenant Scope</span>
            <p className="text-xs font-bold text-white truncate">
              {currentRole === 'super_admin' ? 'Global Platform Scope' : (schoolName || 'Horizon Academy')}
            </p>
          </div>
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
        </div>
      </div>

      {/* Role Selection Tabs in Sidebar */}
      <div className="p-3 border-b border-slate-800/60">
        <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block mb-1.5 px-1">
          Switch Portal View
        </span>
        <div className="grid grid-cols-4 gap-1 bg-slate-950 p-1 rounded-xl border border-slate-800 text-[10px]">
          <button
            onClick={() => setCurrentRole('super_admin')}
            className={`py-1.5 rounded-lg font-bold transition ${
              currentRole === 'super_admin'
                ? 'bg-rose-600 text-white shadow'
                : 'text-slate-400 hover:text-white'
            }`}
            title="Super Admin Dashboard"
          >
            Owner
          </button>
          <button
            onClick={() => setCurrentRole('school_admin')}
            className={`py-1.5 rounded-lg font-bold transition ${
              currentRole === 'school_admin'
                ? 'bg-indigo-600 text-white shadow'
                : 'text-slate-400 hover:text-white'
            }`}
            title="School Admin Dashboard"
          >
            Admin
          </button>
          <button
            onClick={() => setCurrentRole('professor')}
            className={`py-1.5 rounded-lg font-bold transition ${
              currentRole === 'professor'
                ? 'bg-cyan-600 text-white shadow'
                : 'text-slate-400 hover:text-white'
            }`}
            title="Professor Dashboard"
          >
            Prof
          </button>
          <button
            onClick={() => setCurrentRole('student')}
            className={`py-1.5 rounded-lg font-bold transition ${
              currentRole === 'student'
                ? 'bg-emerald-600 text-white shadow'
                : 'text-slate-400 hover:text-white'
            }`}
            title="Student Dashboard"
          >
            Student
          </button>
        </div>
      </div>

      {/* Navigation List */}
      <nav className="flex-1 p-3 space-y-1.5 overflow-y-auto">
        <p className="px-3 text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-2">Navigation</p>
        {currentMenu.map((item) => {
          const isActive = currentView === item.id || (item.id === 'overview' && currentView === 'overview');
          return (
            <button
              key={item.id}
              onClick={() => setCurrentView(item.id)}
              className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-medium transition ${
                isActive
                  ? 'bg-indigo-600 text-white font-semibold shadow-md shadow-indigo-600/30 ring-1 ring-indigo-400/30'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
              }`}
            >
              <div className="flex items-center gap-2.5">
                <span className="text-sm">{item.icon}</span>
                <span>{item.label}</span>
              </div>
              {item.badge && (
                <span
                  className={`text-[10px] px-2 py-0.5 rounded-full font-semibold ${
                    isActive ? 'bg-indigo-800 text-indigo-100' : 'bg-slate-800 text-slate-400'
                  }`}
                >
                  {item.badge}
                </span>
              )}
            </button>
          );
        })}

        <div className="pt-3 border-t border-slate-800/60 mt-4">
          <button
            onClick={() => setCurrentView('rbac_sim')}
            className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-medium transition ${
              currentView === 'rbac_sim'
                ? 'bg-purple-600 text-white font-semibold shadow-md ring-1 ring-purple-400/30'
                : 'text-purple-300 hover:bg-purple-950/20'
            }`}
          >
            <div className="flex items-center gap-2.5">
              <span>🛡️</span>
              <span>RBAC Security Probe</span>
            </div>
            <span className="text-[10px] px-1.5 py-0.5 rounded bg-purple-900/60 text-purple-200">
              API
            </span>
          </button>
        </div>
      </nav>

      {/* User Profile & Sign Out Footer */}
      <div className="p-4 border-t border-slate-800/80 bg-slate-950/60 space-y-3">
        <div className="flex items-center gap-3">
          <div
            className={`w-8 h-8 rounded-full bg-gradient-to-tr ${profile.gradient} flex items-center justify-center font-bold text-white text-xs ring-1 ring-white/20`}
          >
            {profile.avatar}
          </div>
          <div className="overflow-hidden flex-1">
            <p className="text-xs font-semibold text-white truncate">{profile.name}</p>
            <p className="text-[10px] text-slate-400 truncate font-mono">{profile.role}</p>
          </div>
          <span className={`text-[10px] px-1.5 py-0.5 rounded border font-semibold ${profile.badgeColor}`}>
            {profile.badge}
          </span>
        </div>

        {onLogout && (
          <button
            onClick={onLogout}
            className="w-full py-1.5 px-3 rounded-xl bg-slate-900 hover:bg-rose-500/10 text-slate-400 hover:text-rose-400 border border-slate-800 hover:border-rose-500/30 text-xs font-semibold transition flex items-center justify-center gap-2"
          >
            <span>🚪</span>
            <span>Sign Out / Switch Account</span>
          </button>
        )}
      </div>
    </aside>
  );
}
