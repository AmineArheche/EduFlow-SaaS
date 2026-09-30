import React from 'react';

export default function DeleteConfirmModal({ isOpen, onClose, onConfirm, user }) {
  if (!isOpen || !user) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-fadeIn">
      <div className="bg-slate-900 border border-slate-800 rounded-2xl max-w-sm w-full p-6 shadow-2xl relative">
        <div className="w-12 h-12 rounded-2xl bg-rose-500/10 border border-rose-500/20 text-rose-400 flex items-center justify-center text-xl mb-4">
          🗑️
        </div>

        <h3 className="text-base font-bold text-white mb-1">
          Delete {user.role === 'professor' ? 'Professor' : 'Student'}?
        </h3>
        <p className="text-xs text-slate-400 leading-relaxed mb-4">
          Are you sure you want to remove <strong className="text-white">{user.name}</strong> (<code className="text-indigo-300 font-mono">{user.email}</code>) from this school tenant? This action cannot be undone.
        </p>

        <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-800">
          <button
            onClick={onClose}
            className="px-4 py-2 text-xs font-medium rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition"
          >
            Cancel
          </button>
          <button
            onClick={() => onConfirm(user.id)}
            className="px-4 py-2 text-xs font-bold rounded-xl bg-rose-600 hover:bg-rose-500 text-white shadow-lg shadow-rose-600/30 transition"
          >
            Confirm Delete
          </button>
        </div>
      </div>
    </div>
  );
}
