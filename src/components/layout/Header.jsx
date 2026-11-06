import React, { useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  ChevronLeft,
  ChevronRight,
  Search,
  Bell,
  Sparkles,
  Menu,
  SlidersHorizontal,
  Keyboard,
  Sun,
  Moon,
} from 'lucide-react';
import { usePlayer } from '../../hooks/usePlayer';

export function Header({
  searchQuery = '',
  onSearchChange,
  onMenuToggle,
  searchInputRef,
  onOpenShortcuts,
}) {
  const navigate = useNavigate();
  const localInputRef = useRef(null);
  const inputRef = searchInputRef || localInputRef;
  const { theme, toggleTheme } = usePlayer() || {};

  return (
    <header className="h-20 px-4 md:px-8 bg-surface-base/80 backdrop-blur-xl border-b border-surface-border/60 flex items-center justify-between sticky top-0 z-20 gap-4">
      {/* Left: Mobile Menu Trigger + Navigation Controls */}
      <div className="flex items-center gap-2 md:gap-3 shrink-0">
        {/* Mobile/Tablet Menu Button */}
        <button
          type="button"
          onClick={onMenuToggle}
          className="md:hidden p-2 rounded-xl bg-surface-card hover:bg-surface-hover text-slate-300 hover:text-white border border-surface-border transition-colors"
          aria-label="Open sidebar menu"
        >
          <Menu className="w-5 h-5" />
        </button>

        {/* History Nav */}
        <div className="hidden sm:flex items-center gap-1.5">
          <button
            type="button"
            onClick={() => navigate(-1)}
            className="w-9 h-9 rounded-xl bg-surface-card hover:bg-surface-hover border border-surface-border flex items-center justify-center text-slate-300 hover:text-white transition-all shadow-subtle active:scale-95"
            title="Go back"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>
          <button
            type="button"
            onClick={() => navigate(1)}
            className="w-9 h-9 rounded-xl bg-surface-card hover:bg-surface-hover border border-surface-border flex items-center justify-center text-slate-300 hover:text-white transition-all shadow-subtle active:scale-95"
            title="Go forward"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Center: Search Entry Point */}
      <div className="flex-1 max-w-xl mx-2">
        <div className="relative group w-full">
          <Search className="w-4 h-4 text-slate-400 group-focus-within:text-brand-400 absolute left-4 top-1/2 -translate-y-1/2 transition-colors pointer-events-none" />
          <input
            ref={inputRef}
            type="text"
            value={searchQuery}
            onChange={(e) => onSearchChange && onSearchChange(e.target.value)}
            placeholder="Search songs, artists, albums, or genres..."
            className="w-full bg-surface-card/90 hover:bg-surface-panel/90 focus:bg-surface-panel border border-surface-border focus:border-brand-500/80 rounded-2xl pl-11 pr-20 py-2.5 text-xs md:text-sm text-slate-100 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-brand-500/20 transition-all shadow-inner"
          />
          <div className="hidden lg:flex items-center gap-1 absolute right-3.5 top-1/2 -translate-y-1/2 pointer-events-none">
            <span className="text-[10px] uppercase font-mono px-1.5 py-0.5 rounded bg-white/5 border border-white/10 text-slate-300">
              Ctrl + K
            </span>
          </div>
        </div>
      </div>

      {/* Right: User Profile & Quick Actions */}
      <div className="flex items-center gap-3 shrink-0">
        {/* Premium Badge */}
        <div className="hidden lg:flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-gradient-to-r from-brand-600/20 via-brand-pink/20 to-purple-600/20 border border-brand-500/30 text-white text-xs font-bold shadow-glow-purple">
          <Sparkles className="w-3.5 h-3.5 text-brand-pink animate-pulse" />
          <span className="bg-gradient-to-r from-white via-brand-100 to-brand-300 bg-clip-text text-transparent">
            VIP Pass
          </span>
        </div>

        {/* Theme Toggle Button (Dark / Light mode) */}
        <button
          type="button"
          onClick={toggleTheme}
          className="p-2.5 rounded-xl bg-surface-card hover:bg-surface-hover border border-surface-border text-slate-300 hover:text-white transition-all group"
          title={`Switch to ${theme === 'dark' ? 'Light' : 'Dark'} Mode`}
        >
          {theme === 'light' ? (
            <Moon className="w-4 h-4 text-brand-400 group-hover:scale-110 transition-transform" />
          ) : (
            <Sun className="w-4 h-4 text-amber-400 group-hover:scale-110 transition-transform" />
          )}
        </button>

        {/* Keyboard Shortcuts Trigger */}
        <button
          type="button"
          onClick={onOpenShortcuts}
          className="p-2.5 rounded-xl bg-surface-card hover:bg-surface-hover border border-surface-border text-slate-300 hover:text-white transition-all hidden sm:block"
          title="Keyboard Shortcuts (?)"
        >
          <Keyboard className="w-4 h-4" />
        </button>

        {/* Notifications */}
        <button
          type="button"
          className="p-2.5 rounded-xl bg-surface-card hover:bg-surface-hover border border-surface-border text-slate-300 hover:text-white transition-all relative"
          title="Notifications"
        >
          <Bell className="w-4 h-4" />
          <span className="w-2 h-2 rounded-full bg-brand-pink absolute top-2 right-2 ring-2 ring-surface-base" />
        </button>

        {/* User Profile Section */}
        <div className="flex items-center gap-3 pl-1 sm:pl-2">
          <div className="relative group cursor-pointer">
            <div className="w-10 h-10 rounded-2xl p-[1.5px] bg-gradient-to-tr from-brand-600 via-brand-pink to-brand-500 shadow-glow-pink">
              <img
                src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=160&q=80"
                alt="Alex Rivera"
                className="w-full h-full object-cover rounded-[14px]"
              />
            </div>
            {/* Online indicator */}
            <span className="w-3 h-3 rounded-full bg-emerald-500 ring-2 ring-surface-base absolute -bottom-0.5 -right-0.5" />
          </div>

          <div className="hidden xl:flex flex-col text-left">
            <div className="flex items-center gap-1">
              <span className="text-xs font-bold text-white leading-tight">Alex Rivera</span>
            </div>
            <span className="text-[10px] text-brand-400 font-medium">Premium Member</span>
          </div>
        </div>
      </div>
    </header>
  );
}
