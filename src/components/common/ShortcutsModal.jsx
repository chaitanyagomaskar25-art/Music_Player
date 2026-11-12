import React from 'react';
import { Keyboard } from 'lucide-react';
import { Modal } from './Modal';

export function ShortcutsModal({ isOpen, onClose }) {
  const shortcuts = [
    { key: 'Space', desc: 'Play / Pause audio' },
    { key: '→', desc: 'Next track' },
    { key: '←', desc: 'Previous track' },
    { key: '↑', desc: 'Increase volume (+5%)' },
    { key: '↓', desc: 'Decrease volume (-5%)' },
    { key: 'M', desc: 'Mute / Unmute audio' },
    { key: 'L', desc: 'Add / Remove from Liked Songs' },
    { key: 'Ctrl + K', desc: 'Focus global search input' },
    { key: '?', desc: 'Toggle keyboard shortcuts menu' },
  ];

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Keyboard Shortcuts"
      subtitle="Quick actions for faster playback control"
      icon={Keyboard}
      maxWidth="max-w-md"
      footer={
        <button
          type="button"
          onClick={onClose}
          className="px-5 py-2 rounded-xl bg-gradient-to-r from-brand-600 via-brand-500 to-brand-pink hover:opacity-95 text-white text-xs font-bold transition-all shadow-glow-purple text-white-force"
        >
          Got it
        </button>
      }
    >
      <div className="mt-2 space-y-2 max-h-80 overflow-y-auto pr-1">
        {shortcuts.map((item) => (
          <div
            key={item.key}
            className="flex items-center justify-between p-2.5 rounded-xl bg-slate-50 hover:bg-purple-50/60 dark:bg-surface-panel/70 dark:hover:bg-surface-panel border border-purple-100/80 dark:border-surface-border/60 text-xs transition-colors"
          >
            <span className="text-slate-800 dark:text-slate-200 font-semibold">{item.desc}</span>
            <kbd className="px-2.5 py-1 rounded-lg bg-white dark:bg-white/10 font-mono font-bold text-brand-700 dark:text-brand-300 border border-purple-200/90 dark:border-white/10 shadow-xs shadow-purple-500/10">
              {item.key}
            </kbd>
          </div>
        ))}
      </div>
    </Modal>
  );
}
