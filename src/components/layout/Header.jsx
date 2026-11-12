import React, { useState, useRef, useEffect } from 'react';
import {
  Menu,
  X,
  Sun,
  Moon,
  Keyboard,
  SlidersHorizontal,
  Play,
  Pause,
  Maximize2,
  Timer,
  ListMusic,
  Waves,
  Check,
} from 'lucide-react';
import { usePlayer } from '../../hooks/usePlayer';

export function Header({
  onMenuToggle,
  onOpenShortcuts,
}) {
  const {
    currentSong,
    isPlaying,
    togglePlay,
    queue,
    isQueueOpen,
    setIsQueueOpen,
    setIsFullScreenOpen,
    activeEqPreset,
    applyEqPreset,
    EQ_PRESETS,
    sleepTimerRemaining,
    setSleepTimer,
    theme,
    toggleTheme,
  } = usePlayer() || {};

  // Dropdown states for desktop
  const [isEqOpen, setIsEqOpen] = useState(false);
  const [isSleepOpen, setIsSleepOpen] = useState(false);

  // Studio Hamburger Drawer / Popover for mobile & tablet
  const [isStudioMenuOpen, setIsStudioMenuOpen] = useState(false);

  const eqDropdownRef = useRef(null);
  const sleepDropdownRef = useRef(null);
  const studioMenuRef = useRef(null);

  // Close popovers on click outside or Escape
  useEffect(() => {
    const handleOutsideClick = (e) => {
      if (eqDropdownRef.current && !eqDropdownRef.current.contains(e.target)) {
        setIsEqOpen(false);
      }
      if (sleepDropdownRef.current && !sleepDropdownRef.current.contains(e.target)) {
        setIsSleepOpen(false);
      }
      if (studioMenuRef.current && !studioMenuRef.current.contains(e.target)) {
        setIsStudioMenuOpen(false);
      }
    };

    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        setIsEqOpen(false);
        setIsSleepOpen(false);
        setIsStudioMenuOpen(false);
      }
    };

    document.addEventListener('mousedown', handleOutsideClick);
    document.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('mousedown', handleOutsideClick);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, []);

  const eqPresetList = EQ_PRESETS ? Object.keys(EQ_PRESETS) : [
    'Flat',
    'Bass Boost',
    'Rock',
    'Pop',
    'Classical',
    'Jazz',
  ];

  const sleepTimerOptions = [
    { label: '15m', full: '15 Minutes', mins: 15 },
    { label: '30m', full: '30 Minutes', mins: 30 },
    { label: '45m', full: '45 Minutes', mins: 45 },
    { label: '60m', full: '60 Minutes', mins: 60 },
    { label: 'Off', full: 'Turn Off', mins: 0 },
  ];

  return (
    <header className="h-20 px-2 sm:px-4 md:px-6 lg:px-8 bg-gradient-to-r from-white via-purple-50/70 to-pink-50/50 dark:from-surface-base/95 dark:via-surface-base/95 dark:to-surface-base/95 backdrop-blur-xl border-b border-purple-200/80 dark:border-surface-border/60 flex items-center justify-between sticky top-0 z-30 gap-1.5 sm:gap-3 w-full shadow-xs shadow-purple-500/5 transition-colors">
      {/* 1. Left Section: Sidebar Drawer Hamburger + Studio Quality Badge */}
      <div className="flex items-center gap-1.5 sm:gap-2.5 shrink-0">
        {/* Navigation Sidebar Hamburger Button (Mobile & Tablet) */}
        <button
          type="button"
          onClick={onMenuToggle}
          className="md:hidden p-2 rounded-xl bg-white hover:bg-purple-50 dark:bg-surface-card dark:hover:bg-surface-hover text-slate-800 dark:text-slate-200 hover:text-brand-600 dark:hover:text-white border border-purple-200/80 dark:border-surface-border transition-colors shadow-xs shadow-purple-500/5"
          aria-label="Open navigation sidebar"
          title="Open Menu"
        >
          <Menu className="w-5 h-5" />
        </button>

        {/* Hi-Res Lossless Audio Badge (Desktop) */}
        <div
          onClick={() => setIsFullScreenOpen && setIsFullScreenOpen(true)}
          className="hidden xl:flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/90 dark:bg-surface-card/90 border border-purple-200/80 dark:border-surface-border text-xs font-semibold text-slate-800 dark:text-slate-200 shadow-xs shadow-purple-500/5 cursor-pointer hover:border-brand-500/60 hover:shadow-glow-purple transition-all select-none group"
          title="Studio Master 24-Bit / 96kHz Lossless • Click for Visualizer"
        >
          <div className="relative flex h-2.5 w-2.5">
            <span
              className={`absolute inline-flex h-full w-full rounded-full ${
                isPlaying ? 'bg-emerald-400 animate-ping opacity-75' : 'bg-slate-400'
              }`}
            />
            <span
              className={`relative inline-flex rounded-full h-2.5 w-2.5 ${
                isPlaying ? 'bg-emerald-500' : 'bg-slate-400'
              }`}
            />
          </div>
          <span className="font-mono text-[10px] tracking-wider text-slate-800 dark:text-slate-300 font-extrabold uppercase">
            Hi-Res Master
          </span>
          <span className="w-1 h-1 rounded-full bg-purple-300 dark:bg-slate-500" />
          <span className="text-[11px] text-brand-600 dark:text-brand-300 font-bold">
            24-Bit Lossless
          </span>
        </div>
      </div>

      {/* 2. Center Section: Dynamic Audio Capsule (Styled to match Home Page Spotlight) */}
      <div className="flex-1 min-w-0 max-w-xs sm:max-w-sm md:max-w-md lg:max-w-lg mx-1 flex items-center justify-center">
        {currentSong ? (
          <div className="group relative flex items-center gap-2 sm:gap-3 px-2 sm:px-3.5 py-1.5 rounded-full bg-white/95 dark:bg-surface-card/95 border border-purple-200/90 dark:border-surface-border/80 hover:border-brand-500/60 shadow-md shadow-purple-500/10 hover:shadow-glow-purple transition-all max-w-full overflow-hidden">
            {/* Spinning/Glow Mini Cover Art with Vinyl Ring */}
            <button
              type="button"
              onClick={() => setIsFullScreenOpen && setIsFullScreenOpen(true)}
              className="relative w-7 h-7 sm:w-8 sm:h-8 rounded-full overflow-hidden shrink-0 ring-2 ring-brand-400/40 group-hover:ring-brand-500 transition-all focus:outline-none"
              title="Open Visualizer Player (F)"
              aria-label="Open Visualizer Player"
            >
              <img
                src={currentSong.coverArt}
                alt={currentSong.title}
                className={`w-full h-full object-cover ${
                  isPlaying ? 'animate-[spin_10s_linear_infinite]' : ''
                }`}
              />
              <div className="absolute inset-0 bg-black/10 group-hover:bg-transparent transition-colors" />
            </button>

            {/* Bouncing Equalizer Wave Bars */}
            <div
              onClick={() => setIsFullScreenOpen && setIsFullScreenOpen(true)}
              className="hidden sm:flex items-end gap-0.5 h-3.5 shrink-0 cursor-pointer"
              title="Audio Visualizer Active"
            >
              <span
                className={`w-0.5 rounded-full bg-brand-500 transition-all ${
                  isPlaying ? 'h-3 animate-pulse' : 'h-1.5'
                }`}
              />
              <span
                className={`w-0.5 rounded-full bg-brand-pink transition-all ${
                  isPlaying ? 'h-3.5 animate-[bounce_0.8s_infinite]' : 'h-2'
                }`}
              />
              <span
                className={`w-0.5 rounded-full bg-cyan-500 transition-all ${
                  isPlaying ? 'h-2.5 animate-pulse' : 'h-1'
                }`}
              />
              <span
                className={`w-0.5 rounded-full bg-purple-600 transition-all ${
                  isPlaying ? 'h-3 animate-[bounce_1.1s_infinite]' : 'h-2.5'
                }`}
              />
            </div>

            {/* Song Metadata */}
            <div
              onClick={() => setIsFullScreenOpen && setIsFullScreenOpen(true)}
              className="flex flex-col min-w-0 cursor-pointer text-left pr-0.5"
              title={`${currentSong.title} - ${currentSong.artist} • Click to open Visualizer`}
            >
              <div className="flex items-center gap-1 sm:gap-1.5">
                <span className="text-xs sm:text-sm font-bold text-slate-900 dark:text-white truncate max-w-[80px] xs:max-w-[120px] sm:max-w-[160px] md:max-w-[200px]">
                  {currentSong.title}
                </span>
                <span className="hidden md:inline-block text-[9px] font-mono px-1.5 py-0.2 rounded-full bg-brand-50 text-brand-700 border border-brand-200 dark:bg-brand-500/10 dark:text-brand-300 dark:border-brand-500/20 font-bold uppercase shrink-0">
                  {currentSong.fileFormat || 'FLAC'}
                </span>
              </div>
              <span className="text-[10px] sm:text-[11px] text-slate-600 dark:text-slate-400 font-medium truncate max-w-[80px] xs:max-w-[110px] sm:max-w-[150px]">
                {currentSong.artist}
              </span>
            </div>

            {/* Quick Micro Play/Pause Button (matches Home Page Play button style) */}
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                if (togglePlay) togglePlay();
              }}
              className="w-7 h-7 rounded-full bg-gradient-to-r from-brand-600 via-brand-500 to-brand-pink hover:scale-105 active:scale-95 text-white flex items-center justify-center shrink-0 shadow-glow-purple transition-all ml-auto sm:ml-0"
              title={isPlaying ? 'Pause' : 'Play'}
              aria-label={isPlaying ? 'Pause' : 'Play'}
            >
              {isPlaying ? (
                <Pause className="w-3.5 h-3.5 fill-current" />
              ) : (
                <Play className="w-3.5 h-3.5 fill-current ml-0.5" />
              )}
            </button>

            {/* Quick FullScreen Visualizer Trigger */}
            <button
              type="button"
              onClick={() => setIsFullScreenOpen && setIsFullScreenOpen(true)}
              className="p-1 rounded-full hover:bg-purple-100/60 dark:hover:bg-white/10 text-slate-600 hover:text-brand-600 dark:text-slate-400 dark:hover:text-white transition-colors shrink-0 hidden md:flex"
              title="Open Fullscreen Visualizer (F)"
              aria-label="Open Fullscreen Visualizer"
            >
              <Maximize2 className="w-3.5 h-3.5" />
            </button>
          </div>
        ) : (
          /* Idle Audio Capsule */
          <div className="flex items-center gap-2 px-3 sm:px-4 py-1.5 sm:py-2 rounded-full bg-white/90 dark:bg-surface-card/80 border border-purple-200/80 dark:border-surface-border text-xs text-slate-700 dark:text-slate-300 shadow-xs shadow-purple-500/5">
            <Waves className="w-3.5 h-3.5 text-brand-500 animate-pulse" />
            <span className="font-bold text-slate-900 dark:text-slate-200">Melody Studio</span>
            <span className="hidden sm:inline text-purple-300 dark:text-slate-500">•</span>
            <span className="hidden sm:inline text-slate-600 dark:text-slate-400 font-medium">Ready to Stream</span>
          </div>
        )}
      </div>

      {/* 3. Right Section: Studio Controls (Matching Home Page Palette) */}
      <div className="flex items-center gap-1.5 sm:gap-2 shrink-0">
        {/* DESKTOP ONLY: Equalizer Preset Button & Popover */}
        <div className="relative hidden xl:block" ref={eqDropdownRef}>
          <button
            type="button"
            onClick={() => {
              setIsEqOpen((prev) => !prev);
              setIsSleepOpen(false);
            }}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl border text-xs font-bold transition-all shadow-xs shadow-purple-500/5 ${
              isEqOpen
                ? 'bg-slate-900 text-white border-slate-900 dark:bg-brand-500 dark:border-brand-500'
                : 'bg-white hover:bg-purple-50 text-slate-800 hover:text-brand-600 dark:bg-surface-card dark:hover:bg-surface-hover dark:text-slate-200 border-purple-200/80 hover:border-brand-400 dark:border-surface-border'
            }`}
            title="Audio Equalizer Preset"
          >
            <SlidersHorizontal className="w-3.5 h-3.5 text-brand-500 dark:text-brand-400" />
            <span className="text-[11px]">EQ:</span>
            <span className="text-[11px] truncate max-w-[70px]">{activeEqPreset || 'Flat'}</span>
          </button>

          {/* Desktop EQ Dropdown Popover */}
          {isEqOpen && (
            <div className="absolute right-0 top-full mt-2 w-48 rounded-2xl bg-white dark:bg-surface-card border border-purple-200/90 dark:border-surface-border shadow-2xl shadow-purple-500/10 p-2 z-40 animate-in fade-in zoom-in-95 duration-150">
              <div className="px-2.5 py-1.5 text-[10px] font-mono uppercase tracking-wider text-slate-500 dark:text-slate-400 font-bold border-b border-purple-100 dark:border-surface-border/60 mb-1">
                Studio EQ Presets
              </div>
              <div className="space-y-0.5">
                {eqPresetList.map((preset) => {
                  const isActive = activeEqPreset === preset;
                  return (
                    <button
                      key={preset}
                      type="button"
                      onClick={() => {
                        if (applyEqPreset) applyEqPreset(preset);
                        setIsEqOpen(false);
                      }}
                      className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-bold text-left transition-colors ${
                        isActive
                          ? 'bg-slate-900 text-white dark:bg-brand-500/20 dark:text-brand-300'
                          : 'text-slate-800 dark:text-slate-300 hover:bg-purple-50 hover:text-brand-600 dark:hover:bg-surface-hover'
                      }`}
                    >
                      <span>{preset}</span>
                      {isActive && <Check className="w-3.5 h-3.5 text-brand-400" />}
                    </button>
                  );
                })}
              </div>
            </div>
          )}
        </div>

        {/* DESKTOP ONLY: Sleep Timer Button & Popover */}
        <div className="relative hidden xl:block" ref={sleepDropdownRef}>
          <button
            type="button"
            onClick={() => {
              setIsSleepOpen((prev) => !prev);
              setIsEqOpen(false);
            }}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl border text-xs font-bold transition-all shadow-xs shadow-purple-500/5 ${
              sleepTimerRemaining
                ? 'bg-emerald-50 text-emerald-700 border-emerald-300 dark:bg-emerald-500/10 dark:text-emerald-400 dark:border-emerald-500/40 animate-pulse'
                : 'bg-white hover:bg-purple-50 text-slate-800 hover:text-brand-600 dark:bg-surface-card dark:hover:bg-surface-hover dark:text-slate-200 border-purple-200/80 hover:border-brand-400 dark:border-surface-border'
            }`}
            title="Sleep Timer"
          >
            <Timer className="w-3.5 h-3.5 text-brand-500 dark:text-slate-400" />
            <span className="text-[11px]">
              {sleepTimerRemaining ? `${sleepTimerRemaining}` : 'Timer'}
            </span>
          </button>

          {/* Desktop Sleep Timer Dropdown Popover */}
          {isSleepOpen && (
            <div className="absolute right-0 top-full mt-2 w-48 rounded-2xl bg-white dark:bg-surface-card border border-purple-200/90 dark:border-surface-border shadow-2xl shadow-purple-500/10 p-2 z-40 animate-in fade-in zoom-in-95 duration-150">
              <div className="px-2.5 py-1.5 text-[10px] font-mono uppercase tracking-wider text-slate-500 dark:text-slate-400 font-bold border-b border-purple-100 dark:border-surface-border/60 mb-1">
                Sleep Timer
              </div>
              <div className="space-y-0.5">
                {sleepTimerOptions.map((opt) => (
                  <button
                    key={opt.full}
                    type="button"
                    onClick={() => {
                      if (setSleepTimer) setSleepTimer(opt.mins);
                      setIsSleepOpen(false);
                    }}
                    className="w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-bold text-slate-800 dark:text-slate-300 hover:bg-purple-50 hover:text-brand-600 dark:hover:bg-surface-hover text-left transition-colors"
                  >
                    <span>{opt.full}</span>
                    {opt.mins === 0 && <span className="text-[10px] text-rose-500 font-bold">Reset</span>}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Playback Queue Drawer Button (Always visible on all screens) */}
        <button
          type="button"
          onClick={() => setIsQueueOpen && setIsQueueOpen((prev) => !prev)}
          className={`p-2 sm:p-2.5 rounded-xl border transition-all shadow-xs shadow-purple-500/5 group ${
            isQueueOpen
              ? 'bg-slate-900 text-white border-slate-900 dark:bg-brand-500 dark:border-brand-500'
              : 'bg-white hover:bg-purple-50 dark:bg-surface-card dark:hover:bg-surface-hover border-purple-200/80 hover:border-brand-400 dark:border-surface-border text-slate-800 dark:text-slate-300 hover:text-brand-600 dark:hover:text-white'
          }`}
          title={`Playback Queue (${queue?.length || 0} songs)`}
          aria-label="Toggle Playback Queue"
        >
          <div className="relative">
            <ListMusic className="w-4 h-4" />
            {queue && queue.length > 0 && (
              <span className="absolute -top-1.5 -right-2 min-w-[15px] h-[15px] px-1 rounded-full bg-gradient-to-r from-brand-600 to-brand-pink text-white font-mono text-[9px] font-black flex items-center justify-center shadow-xs">
                {queue.length > 99 ? '99+' : queue.length}
              </span>
            )}
          </div>
        </button>

        {/* Theme Toggle Button (Dark / Light mode - Always visible) */}
        <button
          type="button"
          onClick={toggleTheme}
          className="p-2 sm:p-2.5 rounded-xl bg-white hover:bg-purple-50 dark:bg-surface-card dark:hover:bg-surface-hover border border-purple-200/80 hover:border-brand-400 dark:border-surface-border text-slate-800 dark:text-slate-300 hover:text-brand-600 dark:hover:text-white transition-all group shadow-xs shadow-purple-500/5"
          title={`Switch to ${theme === 'dark' ? 'Light' : 'Dark'} Mode`}
          aria-label={`Switch to ${theme === 'dark' ? 'Light' : 'Dark'} Mode`}
        >
          {theme === 'light' ? (
            <Moon className="w-4 h-4 text-brand-600 group-hover:scale-110 transition-transform" />
          ) : (
            <Sun className="w-4 h-4 text-amber-400 group-hover:scale-110 transition-transform" />
          )}
        </button>

        {/* Desktop Keyboard Shortcuts Trigger */}
        <button
          type="button"
          onClick={onOpenShortcuts}
          className="p-2.5 rounded-xl bg-white hover:bg-purple-50 dark:bg-surface-card dark:hover:bg-surface-hover border border-purple-200/80 hover:border-brand-400 dark:border-surface-border text-slate-800 dark:text-slate-300 hover:text-brand-600 dark:hover:text-white transition-all hidden xl:block shadow-xs shadow-purple-500/5"
          title="Keyboard Shortcuts (?)"
          aria-label="Keyboard Shortcuts"
        >
          <Keyboard className="w-4 h-4" />
        </button>

        {/* MOBILE & TABLET: Studio Controls Hamburger ("humbugler" overflow menu) */}
        <div className="relative xl:hidden" ref={studioMenuRef}>
          <button
            type="button"
            onClick={() => setIsStudioMenuOpen((prev) => !prev)}
            className={`p-2 sm:p-2.5 rounded-xl border transition-all shadow-xs shadow-purple-500/5 relative ${
              isStudioMenuOpen
                ? 'bg-slate-900 text-white dark:bg-white dark:text-slate-900 border-slate-900 dark:border-white'
                : 'bg-white hover:bg-purple-50 dark:bg-surface-card dark:hover:bg-surface-hover border-purple-200/80 hover:border-brand-400 dark:border-surface-border text-slate-800 hover:text-brand-600 dark:text-slate-300'
            }`}
            title="Studio Controls (EQ, Sleep Timer, Visualizer, Shortcuts)"
            aria-label="Studio Controls"
          >
            <SlidersHorizontal className="w-4 h-4" />
            {/* Active feature badge */}
            {(sleepTimerRemaining || (activeEqPreset && activeEqPreset !== 'Flat')) && (
              <span className="w-2 h-2 rounded-full bg-brand-pink absolute -top-0.5 -right-0.5 ring-2 ring-white dark:ring-surface-base animate-pulse" />
            )}
          </button>

          {/* Mobile & Tablet Studio Hamburger Modal Sheet / Dropdown */}
          {isStudioMenuOpen && (
            <div className="fixed sm:absolute right-2 sm:right-0 top-20 sm:top-full mt-2 w-[calc(100vw-1rem)] sm:w-80 max-w-sm rounded-3xl bg-white dark:bg-surface-card border border-purple-200/90 dark:border-surface-border shadow-2xl shadow-purple-500/15 p-4 z-50 animate-in fade-in zoom-in-95 duration-150">
              <div className="flex items-center justify-between pb-3 border-b border-purple-100 dark:border-surface-border/60 mb-3">
                <div className="flex items-center gap-2">
                  <div className="p-1.5 rounded-lg bg-brand-500/10 text-brand-600 dark:text-brand-400">
                    <SlidersHorizontal className="w-4 h-4" />
                  </div>
                  <span className="text-sm font-extrabold text-slate-900 dark:text-white">
                    Studio Audio Hub
                  </span>
                </div>
                <button
                  type="button"
                  onClick={() => setIsStudioMenuOpen(false)}
                  className="p-1.5 rounded-xl hover:bg-purple-50 dark:hover:bg-surface-hover text-slate-500 hover:text-slate-900 dark:hover:text-white transition-colors"
                  aria-label="Close"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              {/* 1. Audio Engine & Fidelity Info */}
              <div className="mb-4 p-3 rounded-2xl bg-gradient-to-r from-purple-50/60 to-pink-50/40 dark:bg-surface-panel/80 border border-purple-200/80 dark:border-surface-border/60">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="relative flex h-2 w-2">
                      <span className={`absolute inline-flex h-full w-full rounded-full ${isPlaying ? 'bg-emerald-400 animate-ping opacity-75' : 'bg-slate-400'}`} />
                      <span className={`relative inline-flex rounded-full h-2 w-2 ${isPlaying ? 'bg-emerald-500' : 'bg-slate-400'}`} />
                    </span>
                    <span className="text-xs font-bold text-slate-800 dark:text-slate-200">
                      Hi-Res Master Lossless
                    </span>
                  </div>
                  <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 font-extrabold uppercase">
                    24-Bit / 96kHz
                  </span>
                </div>
                <button
                  type="button"
                  onClick={() => {
                    setIsStudioMenuOpen(false);
                    if (setIsFullScreenOpen) setIsFullScreenOpen(true);
                  }}
                  className="mt-2.5 w-full flex items-center justify-center gap-2 py-2 px-3 rounded-xl bg-gradient-to-r from-brand-600 via-brand-500 to-brand-pink text-white text-xs font-bold transition-all shadow-glow-purple hover:scale-[1.02] active:scale-[0.98]"
                >
                  <Maximize2 className="w-3.5 h-3.5" />
                  <span>Launch Visualizer Player (F)</span>
                </button>
              </div>

              {/* 2. Equalizer Presets Grid */}
              <div className="mb-4">
                <div className="text-[10px] font-mono uppercase tracking-wider text-slate-500 dark:text-slate-400 font-bold mb-2 flex items-center justify-between">
                  <span>Equalizer Preset</span>
                  <span className="text-brand-600 dark:text-brand-400 font-bold">{activeEqPreset || 'Flat'}</span>
                </div>
                <div className="grid grid-cols-3 gap-1.5">
                  {eqPresetList.map((preset) => {
                    const isActive = activeEqPreset === preset;
                    return (
                      <button
                        key={preset}
                        type="button"
                        onClick={() => {
                          if (applyEqPreset) applyEqPreset(preset);
                        }}
                        className={`py-1.5 px-2 rounded-xl text-xs font-bold text-center transition-all border ${
                          isActive
                            ? 'bg-slate-900 text-white border-slate-900 dark:bg-brand-500 dark:border-brand-500 dark:text-white shadow-xs'
                            : 'bg-white hover:bg-purple-50 text-slate-800 hover:text-brand-600 dark:bg-surface-panel dark:hover:bg-surface-hover dark:text-slate-300 border-purple-200/70 dark:border-surface-border/60 shadow-xs shadow-purple-500/5'
                        }`}
                      >
                        {preset}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* 3. Sleep Timer */}
              <div className="mb-4">
                <div className="text-[10px] font-mono uppercase tracking-wider text-slate-500 dark:text-slate-400 font-bold mb-2 flex items-center justify-between">
                  <span className="flex items-center gap-1">
                    <Timer className="w-3 h-3 text-brand-500" />
                    Sleep Timer
                  </span>
                  {sleepTimerRemaining && (
                    <span className="text-emerald-600 dark:text-emerald-400 font-bold">
                      {sleepTimerRemaining} remaining
                    </span>
                  )}
                </div>
                <div className="grid grid-cols-5 gap-1">
                  {sleepTimerOptions.map((opt) => (
                    <button
                      key={opt.label}
                      type="button"
                      onClick={() => {
                        if (setSleepTimer) setSleepTimer(opt.mins);
                      }}
                      className="py-1.5 px-1 rounded-xl text-xs font-bold text-center bg-white hover:bg-purple-50 dark:bg-surface-panel dark:hover:bg-surface-hover text-slate-800 hover:text-brand-600 dark:text-slate-200 border border-purple-200/70 dark:border-surface-border/60 transition-colors shadow-xs shadow-purple-500/5"
                      title={opt.full}
                    >
                      {opt.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* 4. Keyboard Shortcuts Trigger */}
              <button
                type="button"
                onClick={() => {
                  setIsStudioMenuOpen(false);
                  if (onOpenShortcuts) onOpenShortcuts();
                }}
                className="w-full flex items-center justify-between p-2.5 rounded-2xl bg-purple-50/60 hover:bg-purple-100/60 dark:bg-surface-panel dark:hover:bg-surface-hover text-slate-800 dark:text-slate-200 border border-purple-200/80 dark:border-surface-border/60 transition-colors text-xs font-bold"
              >
                <div className="flex items-center gap-2">
                  <Keyboard className="w-4 h-4 text-brand-600 dark:text-brand-400" />
                  <span>View Keyboard Shortcuts</span>
                </div>
                <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-white dark:bg-white/10 text-slate-700 dark:text-slate-400 font-bold border border-purple-200/80 dark:border-transparent">
                  ?
                </span>
              </button>
            </div>
          )}
        </div>

        {/* User Profile Avatar */}
        <div className="flex items-center gap-2 pl-0.5 sm:pl-1">
          <div className="relative group cursor-pointer" title="Chaitanya • Premium Member">
            <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-2xl p-[1.5px] bg-gradient-to-tr from-brand-600 via-brand-pink to-brand-500 shadow-glow-pink">
              <img
                src="https://images.unsplash.com/photo-1490750967868-88aa4486c946?auto=format&fit=crop&w=160&q=80"
                alt="Chaitanya"
                className="w-full h-full object-cover rounded-[14px]"
              />
            </div>
            {/* Online indicator */}
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 ring-2 ring-white dark:ring-surface-base absolute -bottom-0.5 -right-0.5" />
          </div>

          <div className="hidden lg:flex flex-col text-left">
            <div className="flex items-center gap-1">
              <span className="text-xs font-bold text-slate-900 dark:text-white leading-tight">Chaitanya</span>
            </div>
            <span className="text-[10px] text-brand-600 dark:text-brand-400 font-semibold">Premium Member</span>
          </div>
        </div>
      </div>
    </header>
  );
}
