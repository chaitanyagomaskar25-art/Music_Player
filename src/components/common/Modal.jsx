import React, { useEffect } from 'react';
import { X } from 'lucide-react';

export function Modal({
  isOpen,
  onClose,
  title,
  subtitle,
  icon: Icon,
  iconBoxClassName = 'p-2.5 rounded-2xl bg-brand-100/80 text-brand-700 dark:bg-brand-500/20 dark:text-brand-300',
  iconClassName = 'w-5 h-5 text-brand-600 dark:text-brand-400',
  maxWidth = 'max-w-md',
  maxHeight = 'max-h-[90vh]',
  children,
  footer,
  className = '',
}) {
  useEffect(() => {
    if (!isOpen) return;
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 select-none">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/60 dark:bg-black/80 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Modal Dialog Container */}
      <div
        className={`relative w-full ${maxWidth} ${maxHeight} bg-white dark:bg-surface-charcoal border border-purple-200/80 dark:border-surface-border rounded-3xl p-6 shadow-2xl z-10 animate-in fade-in zoom-in-95 duration-150 flex flex-col ${className}`}
      >
        {/* Header */}
        {(title || Icon) && (
          <div className="flex items-center justify-between pb-3.5 border-b border-purple-100 dark:border-surface-border shrink-0">
            <div className="flex items-center gap-2.5 min-w-0">
              {Icon && (
                <div className={iconBoxClassName}>
                  <Icon className={iconClassName} />
                </div>
              )}
              <div className="min-w-0">
                {title && (
                  <h3 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white truncate">
                    {title}
                  </h3>
                )}
                {subtitle && (
                  <p className="text-[11px] text-slate-500 dark:text-slate-400 truncate">
                    {subtitle}
                  </p>
                )}
              </div>
            </div>
            <button
              type="button"
              onClick={onClose}
              className="p-1.5 rounded-xl text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-white/10 transition-colors ml-2 shrink-0"
              title="Close"
              aria-label="Close modal"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        )}

        {/* Modal Body */}
        <div className="flex-1 overflow-y-auto">
          {children}
        </div>

        {/* Footer */}
        {footer && (
          <div className="mt-4 pt-3 border-t border-purple-100 dark:border-surface-border flex items-center justify-end gap-3 shrink-0">
            {footer}
          </div>
        )}
      </div>
    </div>
  );
}
