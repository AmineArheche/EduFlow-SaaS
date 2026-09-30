import React, { useState } from 'react';

const mockGlobalData = {
  stats: {
    totalTenants: 18,
    activeSubscriptions: 15,
    trialingSubscriptions: 3,
    totalUsersAcrossSchools: 4890,
    mrr: '$28,450',
    platformUptime: '99.98%',
  },
  tenants: [
    { id: 1, name: 'Horizon International Academy', slug: 'horizon-academy', plan: 'Enterprise Pro', students: 380, faculty: 26, mrr: '$1,850', status: 'active', renewal: 'Nov 14, 2026' },
    { id: 2, name: 'St. Jude STEM Preparatory', slug: 'stjude-stem', plan: 'Growth Tier', students: 195, faculty: 14, mrr: '$950', status: 'trialing', renewal: 'Oct 12, 2026' },
    { id: 3, name: 'Lycée Excellence Descartes', slug: 'lycee-descartes', plan: 'Enterprise Pro', students: 620, faculty: 42, mrr: '$2,400', status: 'active', renewal: 'Jan 02, 2027' },
    { id: 4, name: 'Cambridge Science Institute', slug: 'cambridge-sci', plan: 'Starter School', students: 110, faculty: 9, mrr: '$450', status: 'active', renewal: 'Dec 18, 2026' },
    { id: 5, name: 'Oxford International College', slug: 'oxford-college', plan: 'Enterprise Pro', students: 840, faculty: 65, mrr: '$3,200', status: 'active', renewal: 'Feb 20, 2027' },
  ],
};

export default function SuperAdminDashboard({ addToast }) {
  const [tenants, setTenants] = useState(mockGlobalData.tenants);

  const handleToggleStatus = (tenant) => {
    const nextStatus = tenant.status === 'active' ? 'suspended' : 'active';
    setTenants((prev) =>
      prev.map((t) => (t.id === tenant.id ? { ...t, status: nextStatus } : t))
    );
    addToast({
      type: nextStatus === 'active' ? 'success' : 'warning',
      title: `Tenant ${nextStatus === 'active' ? 'Reactivated' : 'Suspended'}`,
      message: `${tenant.name} status updated to ${nextStatus}.`,
    });
  };

  return (
    <div className="space-y-8 animate-fadeIn">
      {/* Banner */}
      <div className="bg-gradient-to-r from-rose-950/40 via-slate-900 to-indigo-950/30 border border-slate-800 p-6 rounded-2xl shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-rose-500 to-indigo-600 flex items-center justify-center text-white text-2xl font-black shadow-lg shadow-rose-500/20 ring-2 ring-white/10">
            👑
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-xl font-extrabold text-white">SaaS Platform Operations Center</h2>
              <span className="text-xs px-2.5 py-0.5 rounded-full bg-rose-500/10 text-rose-400 border border-rose-500/20 font-semibold">
                Super Admin Access
              </span>
            </div>
            <p className="text-xs text-slate-400 mt-0.5">
              Governing 18 Multi-Tenant School Institutions &bull; <code className="text-rose-300 font-mono">/api/admin/dashboard</code>
            </p>
          </div>
        </div>

        <div className="flex items-center gap-6">
          <div className="text-center">
            <span className="text-2xl font-black text-rose-400">{mockGlobalData.stats.mrr}</span>
            <span className="text-[10px] text-slate-400 uppercase font-semibold block">Total MRR</span>
          </div>
          <div className="text-center">
            <span className="text-2xl font-black text-white">{mockGlobalData.stats.totalTenants}</span>
            <span className="text-[10px] text-slate-400 uppercase font-semibold block">Institutions</span>
          </div>
          <div className="text-center">
            <span className="text-2xl font-black text-emerald-400">{mockGlobalData.stats.platformUptime}</span>
            <span className="text-[10px] text-slate-400 uppercase font-semibold block">Uptime</span>
          </div>
        </div>
      </div>

      {/* Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        <div className="bg-slate-900/80 border border-slate-800 p-5 rounded-2xl shadow-lg">
          <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block">Global Platform Users</span>
          <p className="text-3xl font-extrabold text-white mt-2">{mockGlobalData.stats.totalUsersAcrossSchools}</p>
          <p className="text-[11px] text-slate-500 mt-1">Students, Faculty &amp; Staff</p>
        </div>

        <div className="bg-slate-900/80 border border-slate-800 p-5 rounded-2xl shadow-lg">
          <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block">Active School Subscriptions</span>
          <p className="text-3xl font-extrabold text-emerald-400 mt-2">{mockGlobalData.stats.activeSubscriptions}</p>
          <p className="text-[11px] text-slate-500 mt-1">Stripe Billing Synchronized</p>
        </div>

        <div className="bg-slate-900/80 border border-slate-800 p-5 rounded-2xl shadow-lg">
          <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block">Trialing Schools</span>
          <p className="text-3xl font-extrabold text-amber-400 mt-2">{mockGlobalData.stats.trialingSubscriptions}</p>
          <p className="text-[11px] text-slate-500 mt-1">14-Day Evaluation Phase</p>
        </div>

        <div className="bg-slate-900/80 border border-slate-800 p-5 rounded-2xl shadow-lg">
          <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block">Tenant Isolation Health</span>
          <p className="text-3xl font-extrabold text-indigo-400 mt-2">100%</p>
          <p className="text-[11px] text-slate-500 mt-1">Zero cross-tenant leakage</p>
        </div>
      </div>

      {/* Tenants Table */}
      <div className="bg-slate-900/80 border border-slate-800 rounded-2xl overflow-hidden shadow-xl">
        <div className="p-5 border-b border-slate-800 flex items-center justify-between">
          <div>
            <h3 className="text-base font-bold text-white">Registered School Tenants</h3>
            <p className="text-xs text-slate-400">Master database directory with billing lifecycle control</p>
          </div>
          <span className="text-xs px-2.5 py-1 rounded-lg bg-slate-800 text-slate-300 font-mono">
            {tenants.length} Schools Active
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-950/60 text-slate-400 font-semibold uppercase tracking-wider border-b border-slate-800">
              <tr>
                <th className="py-3 px-5">Institution</th>
                <th className="py-3 px-5">Subdomain Slug</th>
                <th className="py-3 px-5">Subscription Plan</th>
                <th className="py-3 px-5">Enrollment</th>
                <th className="py-3 px-5">Status</th>
                <th className="py-3 px-5 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60">
              {tenants.map((t) => (
                <tr key={t.id} className="hover:bg-slate-800/30 transition">
                  <td className="py-3.5 px-5">
                    <div className="font-bold text-white">{t.name}</div>
                    <div className="text-[11px] text-slate-500">ID: #{t.id} &bull; Next renewal: {t.renewal}</div>
                  </td>
                  <td className="py-3.5 px-5 font-mono text-indigo-300">{t.slug}.eduflow.io</td>
                  <td className="py-3.5 px-5">
                    <span className="font-semibold text-white">{t.plan}</span>
                    <div className="text-[11px] text-emerald-400">{t.mrr}/mo</div>
                  </td>
                  <td className="py-3.5 px-5 text-slate-300">
                    <div>{t.students} Students</div>
                    <div className="text-[10px] text-slate-500">{t.faculty} Faculty</div>
                  </td>
                  <td className="py-3.5 px-5">
                    <span
                      className={`px-2.5 py-0.5 rounded-full text-[10px] font-semibold capitalize border ${
                        t.status === 'active'
                          ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20'
                          : t.status === 'trialing'
                          ? 'bg-amber-500/10 text-amber-400 border-amber-500/20'
                          : 'bg-rose-500/10 text-rose-400 border-rose-500/20'
                      }`}
                    >
                      {t.status}
                    </span>
                  </td>
                  <td className="py-3.5 px-5 text-right">
                    <button
                      onClick={() => handleToggleStatus(t)}
                      className={`px-3 py-1 rounded-lg text-xs font-semibold transition border ${
                        t.status === 'active'
                          ? 'bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 border-rose-500/30'
                          : 'bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-400 border-emerald-500/30'
                      }`}
                    >
                      {t.status === 'active' ? 'Suspend Tenant' : 'Activate'}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
