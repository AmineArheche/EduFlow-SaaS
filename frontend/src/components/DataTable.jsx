import React, { useState, useMemo } from 'react';

export default function DataTable({
  data = [],
  title,
  roleType,
  onAddNew,
  onEdit,
  onDelete,
}) {
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 6;

  // Filtered & Searched data
  const filteredData = useMemo(() => {
    return data.filter((item) => {
      const matchesSearch =
        item.name.toLowerCase().includes(search.toLowerCase()) ||
        item.email.toLowerCase().includes(search.toLowerCase());

      const matchesStatus =
        statusFilter === 'all' || item.status === statusFilter;

      return matchesSearch && matchesStatus;
    });
  }, [data, search, statusFilter]);

  // Pagination calculation
  const totalPages = Math.ceil(filteredData.length / itemsPerPage) || 1;
  const paginatedData = useMemo(() => {
    const start = (currentPage - 1) * itemsPerPage;
    return filteredData.slice(start, start + itemsPerPage);
  }, [filteredData, currentPage]);

  const handleSearchChange = (e) => {
    setSearch(e.target.value);
    setCurrentPage(1);
  };

  const handleStatusFilterChange = (e) => {
    setStatusFilter(e.target.value);
    setCurrentPage(1);
  };

  return (
    <div className="bg-slate-900/80 border border-slate-800 rounded-2xl overflow-hidden shadow-xl">
      {/* Table Header Controls */}
      <div className="p-5 border-b border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h3 className="text-base font-bold text-white flex items-center gap-2">
            <span>{title}</span>
            <span className="text-xs px-2 py-0.5 rounded-full bg-slate-800 text-slate-400 font-mono">
              {filteredData.length} records
            </span>
          </h3>
          <p className="text-xs text-slate-400 mt-0.5">
            Strictly isolated to your active school tenant database
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          {/* Search Box */}
          <div className="relative">
            <input
              type="text"
              value={search}
              onChange={handleSearchChange}
              placeholder="Search by name or email..."
              className="px-3.5 py-1.5 pl-8 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/40 focus:border-indigo-500 w-48 sm:w-60 transition"
            />
            <span className="absolute left-2.5 top-2 text-slate-500 text-xs">🔍</span>
            {search && (
              <button
                onClick={() => setSearch('')}
                className="absolute right-2.5 top-2 text-slate-500 hover:text-white text-xs"
              >
                &times;
              </button>
            )}
          </div>

          {/* Status Dropdown */}
          <select
            value={statusFilter}
            onChange={handleStatusFilterChange}
            className="px-3 py-1.5 rounded-xl bg-slate-950 border border-slate-800 text-xs text-slate-300 focus:outline-none focus:ring-2 focus:ring-indigo-500/40"
          >
            <option value="all">All Statuses</option>
            <option value="active">Active Only</option>
            <option value="inactive">Inactive</option>
            <option value="suspended">Suspended</option>
          </select>

          {/* Add New Button */}
          <button
            onClick={onAddNew}
            className="px-4 py-1.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-xs font-bold text-white shadow-md shadow-indigo-600/30 transition flex items-center gap-1.5"
          >
            <span>+</span>
            <span>Add {roleType === 'professor' ? 'Professor' : 'Student'}</span>
          </button>
        </div>
      </div>

      {/* Responsive Table */}
      <div className="overflow-x-auto">
        <table className="w-full text-left text-xs">
          <thead className="bg-slate-950/60 text-slate-400 font-semibold uppercase tracking-wider border-b border-slate-800/80">
            <tr>
              <th className="py-3 px-5">User</th>
              <th className="py-3 px-5">Role &amp; Details</th>
              <th className="py-3 px-5">Status</th>
              <th className="py-3 px-5">Created At</th>
              <th className="py-3 px-5 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800/60">
            {paginatedData.length === 0 ? (
              <tr>
                <td colSpan="5" className="py-12 text-center text-slate-500">
                  <div className="text-2xl mb-2">📂</div>
                  <p className="font-semibold text-slate-400">No records found matching criteria</p>
                  <p className="text-[11px] text-slate-600 mt-1">Try resetting search query or filters.</p>
                </td>
              </tr>
            ) : (
              paginatedData.map((item) => (
                <tr key={item.id} className="hover:bg-slate-800/30 transition">
                  {/* Name & Avatar */}
                  <td className="py-3.5 px-5">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-indigo-500/20 to-purple-500/20 border border-indigo-500/30 flex items-center justify-center font-bold text-indigo-300 text-xs">
                        {item.name.charAt(0)}
                      </div>
                      <div>
                        <div className="font-bold text-white">{item.name}</div>
                        <div className="text-[11px] text-slate-400 font-mono">{item.email}</div>
                      </div>
                    </div>
                  </td>

                  {/* Details / Specialization */}
                  <td className="py-3.5 px-5">
                    <div className="text-slate-300">
                      {roleType === 'professor' ? (
                        <span>{item.specialization || item.department || 'General Faculty'}</span>
                      ) : (
                        <span className="text-slate-400">{item.cohort || 'Enrolled Student'}</span>
                      )}
                    </div>
                    {item.taught_subjects_count !== undefined && (
                      <span className="text-[10px] text-indigo-400">
                        {item.taught_subjects_count} subjects assigned
                      </span>
                    )}
                  </td>

                  {/* Status Badge */}
                  <td className="py-3.5 px-5">
                    <span
                      className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10px] font-semibold capitalize border ${
                        item.status === 'active'
                          ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20'
                          : item.status === 'suspended'
                          ? 'bg-rose-500/10 text-rose-400 border-rose-500/20'
                          : 'bg-slate-800 text-slate-400 border-slate-700'
                      }`}
                    >
                      <span
                        className={`w-1.5 h-1.5 rounded-full ${
                          item.status === 'active'
                            ? 'bg-emerald-400'
                            : item.status === 'suspended'
                            ? 'bg-rose-400'
                            : 'bg-slate-400'
                        }`}
                      ></span>
                      {item.status || 'active'}
                    </span>
                  </td>

                  {/* Date */}
                  <td className="py-3.5 px-5 text-slate-400 font-mono text-[11px]">
                    {item.created_at ? new Date(item.created_at).toLocaleDateString() : '2026-09-30'}
                  </td>

                  {/* Actions */}
                  <td className="py-3.5 px-5 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <button
                        onClick={() => onEdit(item)}
                        className="px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition text-xs border border-slate-700"
                        title="Edit User"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => onDelete(item)}
                        className="px-2.5 py-1 rounded-lg bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 hover:text-rose-300 transition text-xs border border-rose-500/30"
                        title="Delete User"
                      >
                        Delete
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination Footer */}
      <div className="p-4 border-t border-slate-800 bg-slate-950/40 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs text-slate-400">
        <div>
          Showing{' '}
          <strong className="text-white">
            {filteredData.length === 0 ? 0 : (currentPage - 1) * itemsPerPage + 1}
          </strong>{' '}
          to{' '}
          <strong className="text-white">
            {Math.min(currentPage * itemsPerPage, filteredData.length)}
          </strong>{' '}
          of <strong className="text-white">{filteredData.length}</strong> total
        </div>

        <div className="flex items-center gap-1.5 self-end sm:self-auto">
          <button
            onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
            disabled={currentPage === 1}
            className="px-3 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 disabled:opacity-40 disabled:pointer-events-none text-slate-300 transition"
          >
            Previous
          </button>

          {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
            <button
              key={page}
              onClick={() => setCurrentPage(page)}
              className={`w-7 h-7 rounded-lg text-xs font-semibold transition ${
                currentPage === page
                  ? 'bg-indigo-600 text-white'
                  : 'bg-slate-800 text-slate-400 hover:text-white'
              }`}
            >
              {page}
            </button>
          ))}

          <button
            onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
            disabled={currentPage === totalPages}
            className="px-3 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 disabled:opacity-40 disabled:pointer-events-none text-slate-300 transition"
          >
            Next
          </button>
        </div>
      </div>
    </div>
  );
}
