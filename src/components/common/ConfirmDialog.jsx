import React from 'react';
import { AlertTriangle } from 'lucide-react';
import { Modal } from './Modal';

export function ConfirmDialog({
  isOpen,
  title = 'Are you sure?',
  message = 'This action cannot be undone.',
  confirmText = 'Delete',
  cancelText = 'Cancel',
  onConfirm,
  onCancel,
  isDanger = true,
}) {
  return (
    <Modal
      isOpen={isOpen}
      onClose={onCancel}
      title={title}
      icon={AlertTriangle}
      iconBoxClassName={`p-2.5 rounded-2xl ${
        isDanger
          ? 'bg-rose-100 text-rose-700 dark:bg-rose-500/15 dark:text-rose-400'
          : 'bg-brand-100 text-brand-700 dark:bg-brand-500/15 dark:text-brand-400'
      }`}
      iconClassName={`w-5 h-5 ${isDanger ? 'text-rose-600 dark:text-rose-400' : 'text-brand-600 dark:text-brand-400'}`}
      maxWidth="max-w-sm"
      footer={
        <>
          <button
            type="button"
            onClick={onCancel}
            className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-600 hover:text-slate-900 hover:bg-slate-100 dark:text-slate-400 dark:hover:text-white dark:hover:bg-white/5 transition-colors"
          >
            {cancelText}
          </button>
          <button
            type="button"
            onClick={onConfirm}
            className={`px-5 py-2 rounded-xl text-xs font-bold transition-all ${
              isDanger
                ? 'bg-rose-600 hover:bg-rose-500 text-white shadow-lg shadow-rose-950/20 text-white-force'
                : 'bg-brand-600 hover:bg-brand-500 text-white shadow-glow-purple text-white-force'
            }`}
          >
            {confirmText}
          </button>
        </>
      }
    >
      <p className="text-xs text-slate-600 dark:text-slate-300 mt-2 leading-relaxed">
        {message}
      </p>
    </Modal>
  );
}
