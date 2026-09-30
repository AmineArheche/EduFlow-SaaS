import React from 'react';

export default function Toast({ toasts, onDismiss }) {
  if (!toasts || toasts.length === 0) return null;

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col gap-2.5 max-w-sm w-full pointer-events-none">
      {toasts.map((toast) => {
        const isSuccess = toast.type === 'success';
        const isError = toast.type === 'error';

        return (
          <div
            key={toast.id}
            className={`pointer-events-auto flex items-start gap-3 p-4 rounded-xl shadow-2xl border backdrop-blur-md transition-all duration-300 transform translate-y-0 ${
              isSuccess
                ? 'bg-slate-900/95 border-emerald-500/40 text-emerald-100 shadow-emerald-500/10'
                : isError
                ? 'bg-slate-900/95 border-rose-500/40 text-rose-100 shadow-rose-500/10'
                : 'bg-slate-900/95 border-indigo-500/40 text-indigo-100 shadow-indigo-500/10'
            }`}
          >
            <div
              className={`w-6 h-6 rounded-full flex items-center justify-center shrink-0 text-xs font-bold ${
                isSuccess
                  ? 'bg-emerald-500/20 text-emerald-400'
                  : isError
                  ? 'bg-rose-500/20 text-rose-400'
                  : 'bg-indigo-500/20 text-indigo-400'
              }`}
            >
              {isSuccess ? '✓' : isError ? '✕' : 'ℹ'}
            </div>

            <div className="flex-1">
              <h5 className="text-xs font-bold text-white leading-none mb-1">
                {toast.title || (isSuccess ? 'Success' : isError ? 'Error' : 'Notice')}
              </h5>
              <p className="text-xs text-slate-300 leading-snug">{toast.message}</p>
            </div>

            <button
              onClick={() => onDismiss(toast.id)}
              className="text-slate-400 hover:text-white transition text-sm leading-none shrink-0"
            >
              &times;
            </button>
          </div>
        );
      })}
    </div>
  );
}
