import React from 'react';
import { CheckCircle2, Info, AlertCircle, AlertTriangle, X } from 'lucide-react';
import { usePlayer } from '../../hooks/usePlayer';

export function ToastContainer() {
  const { toasts, removeToast } = usePlayer();

  if (!toasts || toasts.length === 0) return null;

  return (
    <div className="fixed bottom-20 sm:bottom-24 right-4 sm:right-8 z-50 flex flex-col gap-2 max-w-sm w-full pointer-events-none select-none px-2 sm:px-0">
      {toasts.map((toast) => {
        const isSuccess = toast.type === 'success';
        const isError = toast.type === 'error';
        const isWarning = toast.type === 'warning';

        return (
          <div
            key={toast.id}
            className={`pointer-events-auto flex items-center gap-3 px-4 py-3 rounded-2xl shadow-2xl border text-xs sm:text-sm font-medium backdrop-blur-xl animate-in slide-in-from-bottom-3 fade-in duration-200 ${
              isSuccess
                ? 'bg-brand-950/95 border-brand-500/50 text-brand-100 shadow-glow-purple'
                : isError
                ? 'bg-rose-950/95 border-rose-500/50 text-rose-100 shadow-lg'
                : isWarning
                ? 'bg-amber-950/95 border-amber-500/50 text-amber-100 shadow-lg'
                : 'bg-surface-panel/95 border-surface-border text-slate-100 shadow-2xl'
            }`}
          >
            {isSuccess && <CheckCircle2 className="w-4 h-4 text-brand-400 shrink-0" />}
            {isError && <AlertCircle className="w-4 h-4 text-rose-400 shrink-0" />}
            {isWarning && <AlertTriangle className="w-4 h-4 text-amber-400 shrink-0" />}
            {!isSuccess && !isError && !isWarning && <Info className="w-4 h-4 text-cyan-400 shrink-0" />}

            <span className="flex-1 min-w-0 text-left leading-snug">{toast.message}</span>

            <button
              type="button"
              onClick={() => removeToast(toast.id)}
              className="text-slate-400 hover:text-white p-1 rounded-lg hover:bg-white/10 transition-colors"
              title="Dismiss"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
        );
      })}
    </div>
  );
}
