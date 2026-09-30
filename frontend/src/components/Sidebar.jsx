import React from 'react';

export default function Sidebar({ currentView, setCurrentView, schoolName, studentsCount, professorsCount }) {
  const menuItems = [
    { id: 'overview', label: 'Dashboard Overview', icon: '📊', badge: null },
    { id: 'students', label: 'Students Directory', icon: '🎓', badge: studentsCount },
    { id: 'professors', label: 'Professors & Faculty', icon: '👨‍🏫', badge: professorsCount },
    { id: 'classes', label: 'Classes & Cohorts', icon: '🏫', badge: '14' },
    { id: 'rbac_sim', label: 'RBAC Access Probe', icon: '🛡️', badge: '4 Roles' },
  ];

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
            <p className="text-[11px] text-indigo-400 font-medium truncate">School Admin Portal</p>
          </div>
        </div>

        {/* Current Tenant Badge */}
        <div className="mt-4 p-2.5 rounded-xl bg-slate-950/70 border border-slate-800/80 flex items-center justify-between">
          <div className="overflow-hidden">
            <span className="text-[10px] text-slate-400 block font-semibold uppercase tracking-wider">Tenant Scope</span>
            <p className="text-xs font-bold text-white truncate">{schoolName || 'Horizon Academy'}</p>
          </div>
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
        </div>
      </div>

      {/* Navigation List */}
      <nav className="flex-1 p-3 space-y-1.5 overflow-y-auto">
        <p className="px-3 text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-2">Management</p>
        {menuItems.map((item) => {
          const isActive = currentView === item.id;
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
      </nav>

      {/* School Admin Profile Footer */}
      <div className="p-4 border-t border-slate-800/80 bg-slate-950/40">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-amber-500 to-indigo-600 flex items-center justify-center font-bold text-white text-xs ring-1 ring-white/20">
            SC
          </div>
          <div className="overflow-hidden flex-1">
            <p className="text-xs font-semibold text-white truncate">Sarah Connor</p>
            <p className="text-[10px] text-slate-400 truncate">role: school_admin</p>
          </div>
          <span className="text-[10px] px-1.5 py-0.5 rounded bg-amber-500/10 text-amber-400 border border-amber-500/20 font-semibold">
            Admin
          </span>
        </div>
      </div>
    </aside>
  );
}
