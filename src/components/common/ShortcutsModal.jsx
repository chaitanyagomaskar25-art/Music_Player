import React from 'react';
import { X, Keyboard, Command } from 'lucide-react';

export function ShortcutsModal({ isOpen, onClose }) {
  if (!isOpen) return null;

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
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/75 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Modal Dialog */}
      <div className="relative w-full max-w-md bg-surface-card border border-surface-border rounded-3xl p-6 shadow-2xl z-10 select-none animate-in fade-in zoom-in-95 duration-150">
        <div className="flex items-center justify-between pb-4 border-b border-surface-border">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-brand-500/20 text-brand-400">
              <Keyboard className="w-5 h-5" />
            </div>
            <h3 className="text-lg font-bold text-white">Keyboard Shortcuts</h3>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-xl text-slate-400 hover:text-white hover:bg-white/10 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="mt-4 space-y-2.5 max-h-80 overflow-y-auto pr-1">
          {shortcuts.map((item) => (
            <div
              key={item.key}
              className="flex items-center justify-between p-2.5 rounded-xl bg-surface-panel/70 border border-surface-border/60 text-xs"
            >
              <span className="text-slate-300 font-medium">{item.desc}</span>
              <kbd className="px-2.5 py-1 rounded-lg bg-white/10 font-mono font-bold text-brand-300 border border-white/10 shadow-sm">
                {item.key}
              </kbd>
            </div>
          ))}
        </div>

        <div className="mt-5 pt-3 border-t border-surface-border flex justify-end">
          <button
            type="button"
            onClick={onClose}
            className="px-5 py-2 rounded-xl bg-brand-600 hover:bg-brand-500 text-white text-xs font-bold transition-all shadow-glow-purple"
          >
            Got it
          </button>
        </div>
      </div>
    </div>
  );
}
