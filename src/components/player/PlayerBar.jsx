import React, { useState, useRef, useEffect } from 'react';
import {
  Play,
  Pause,
  SkipBack,
  SkipForward,
  Shuffle,
  Repeat,
  Repeat1,
  Volume2,
  VolumeX,
  Volume1,
  Heart,
  ListMusic,
  Maximize2,
  Loader2,
  Gauge,
  Moon,
  Info,
} from 'lucide-react';
import { usePlayer } from '../../hooks/usePlayer';
import { formatTime } from '../../utils/formatters';
import { ProgressBar } from '../common/ProgressBar';

export function PlayerBar() {
  const {
    currentSong,
    isPlaying,
    isLoading,
    currentTime,
    duration,
    togglePlay,
    nextSong,
    prevSong,
    seek,
    volume,
    setVolume,
    isMuted,
    toggleMute,
    isShuffle,
    toggleShuffle,
    repeatMode,
    toggleRepeat,
    playbackSpeed,
    setPlaybackSpeed,
    isFavorite,
    toggleFavorite,
    sleepTimerRemaining,
    openSongDetails,
    setIsQueueOpen,
    setIsFullScreenOpen,
  } = usePlayer();

  const [showSpeedMenu, setShowSpeedMenu] = useState(false);
  const speedMenuRef = useRef(null);

  // Close speed dropdown on outside click
  useEffect(() => {
    function handleClickOutside(event) {
      if (speedMenuRef.current && !speedMenuRef.current.contains(event.target)) {
        setShowSpeedMenu(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  if (!currentSong) return null;

  const favorited = isFavorite(currentSong.id);
  const actualDuration = duration > 0 ? duration : (currentSong.duration || 180);

  const renderVolumeIcon = () => {
    if (isMuted || volume === 0) return <VolumeX className="w-4 h-4 text-rose-500" />;
    if (volume < 0.5) return <Volume1 className="w-4 h-4 text-slate-400" />;
    return <Volume2 className="w-4 h-4 text-slate-400" />;
  };

  const speedOptions = [0.5, 1, 1.25, 1.5, 2];

  return (
    <footer className="relative h-20 bg-white/95 dark:bg-surface-charcoal/95 backdrop-blur-2xl border-t border-purple-200/80 dark:border-surface-border/80 px-3 sm:px-6 flex items-center justify-between z-30 select-none shadow-2xl">
      {/* Mobile Top Edge Progress Bar (< 640px) */}
      <div className="absolute top-0 left-0 right-0 sm:hidden h-1 bg-slate-200 dark:bg-white/10 overflow-hidden cursor-pointer">
        <div
          className="h-full bg-gradient-to-r from-brand-600 via-brand-500 to-brand-pink transition-all duration-150"
          style={{ width: `${Math.min(100, Math.max(0, (currentTime / actualDuration) * 100))}%` }}
        />
      </div>

      {/* MOBILE COMPACT VIEW (< 640px) */}
      <div className="flex sm:hidden items-center justify-between w-full gap-2">
        {/* Left: Artwork + Title + Favorite */}
        <div className="flex items-center gap-2.5 min-w-0 flex-1">
          <div
            onClick={() => setIsFullScreenOpen(true)}
            className="relative shrink-0 cursor-pointer"
            title="Open Fullscreen Player"
          >
            <img
              src={currentSong.coverArt}
              alt={currentSong.title}
              className={`w-11 h-11 rounded-xl object-cover shadow-md transition-all ${
                isPlaying ? 'ring-2 ring-brand-500 scale-105' : ''
              }`}
            />
          </div>

          <div
            onClick={() => setIsFullScreenOpen(true)}
            className="min-w-0 flex-1 cursor-pointer"
          >
            <h4 className="text-xs font-bold text-slate-900 dark:text-white truncate">
              {currentSong.title}
            </h4>
            <p className="text-[10px] text-slate-500 dark:text-slate-400 truncate mt-0.5 font-medium">
              {currentSong.artist}
            </p>
          </div>

          <button
            type="button"
            onClick={() => toggleFavorite(currentSong.id)}
            className="p-1.5 text-slate-400 hover:text-brand-pink shrink-0"
            title={favorited ? 'Remove from favorites' : 'Add to favorites'}
          >
            <Heart
              className={`w-4 h-4 ${
                favorited ? 'fill-brand-pink text-brand-pink' : ''
              }`}
            />
          </button>
        </div>

        {/* Right: Prev + Play/Pause + Next + Fullscreen */}
        <div className="flex items-center gap-1.5 shrink-0">
          <button
            type="button"
            onClick={prevSong}
            className="p-1.5 text-slate-600 dark:text-slate-300 active:scale-95 transition-all"
            title="Previous track"
          >
            <SkipBack className="w-4 h-4 fill-current" />
          </button>

          <button
            type="button"
            onClick={togglePlay}
            disabled={isLoading}
            className="w-9 h-9 rounded-full bg-gradient-to-tr from-brand-600 via-brand-500 to-brand-pink text-white flex items-center justify-center shadow-md active:scale-95 transition-transform"
            title={isPlaying ? 'Pause' : 'Play'}
          >
            {isLoading ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : isPlaying ? (
              <Pause className="w-4 h-4 fill-current" />
            ) : (
              <Play className="w-4 h-4 fill-current ml-0.5" />
            )}
          </button>

          <button
            type="button"
            onClick={nextSong}
            className="p-1.5 text-slate-600 dark:text-slate-300 active:scale-95 transition-all"
            title="Next track"
          >
            <SkipForward className="w-4 h-4 fill-current" />
          </button>

          <button
            type="button"
            onClick={() => setIsFullScreenOpen(true)}
            className="p-1.5 text-slate-400 hover:text-brand-600 dark:hover:text-white"
            title="Expand Fullscreen"
          >
            <Maximize2 className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* TABLET & DESKTOP FULL VIEW (>= 640px) */}
      <div className="hidden sm:flex items-center justify-between w-full">
        {/* 1. Track Info (Left) */}
        <div className="flex items-center gap-3 w-1/4 min-w-[170px] md:min-w-[240px]">
          {/* Cover Art with pulse/glow */}
          <div
            onClick={() => setIsFullScreenOpen(true)}
            className="relative group shrink-0 cursor-pointer"
            title="Open Fullscreen Player"
          >
            <img
              src={currentSong.coverArt}
              alt={currentSong.title}
              className={`w-12 h-12 rounded-2xl object-cover shadow-lg transition-all duration-300 ${
                isPlaying
                  ? 'ring-2 ring-brand-500 shadow-glow-purple scale-105'
                  : 'group-hover:brightness-90'
              }`}
            />
            <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 bg-black/50 rounded-2xl transition-opacity">
              <Maximize2 className="w-4 h-4 text-white" />
            </div>
          </div>

          {/* Title & Artist */}
          <div className="min-w-0 pr-1">
            <h4
              onClick={() => setIsFullScreenOpen(true)}
              className="text-xs sm:text-sm font-bold text-slate-900 dark:text-white truncate hover:text-brand-600 dark:hover:text-brand-300 hover:underline cursor-pointer"
            >
              {currentSong.title}
            </h4>
            <p className="text-[11px] sm:text-xs text-slate-500 dark:text-slate-400 truncate hover:text-slate-800 dark:hover:text-slate-200 cursor-pointer mt-0.5 font-medium">
              {currentSong.artist}
            </p>
          </div>

          {/* Favorite & Info Buttons */}
          <div className="flex items-center gap-0.5 shrink-0">
            <button
              type="button"
              onClick={() => toggleFavorite(currentSong.id)}
              className="p-1.5 rounded-xl text-slate-400 hover:text-brand-pink transition-all hover:scale-110 active:scale-90"
              title={favorited ? 'Remove from favourites' : 'Save to favourites'}
            >
              <Heart
                className={`w-4 h-4 transition-colors ${
                  favorited ? 'fill-brand-pink text-brand-pink' : 'hover:text-slate-900 dark:hover:text-white'
                }`}
              />
            </button>
            <button
              type="button"
              onClick={() => openSongDetails && openSongDetails(currentSong)}
              className="p-1.5 rounded-xl text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-white/5 transition-all hidden md:block"
              title="Track Info"
            >
              <Info className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* 2. Central Playback & Timeline Controls */}
        <div className="flex flex-col items-center justify-center max-w-xl w-full px-2 sm:px-6">
          {/* Playback action buttons */}
          <div className="flex items-center gap-3 sm:gap-6 mb-1">
            {/* Shuffle Button */}
            <button
              type="button"
              onClick={toggleShuffle}
              className={`p-1.5 rounded-xl transition-all ${
                isShuffle
                  ? 'text-brand-pink bg-brand-pink/15 shadow-glow-pink ring-1 ring-brand-pink/30'
                  : 'text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-white/5'
              }`}
              title={isShuffle ? 'Shuffle is ON (Click to disable)' : 'Shuffle is OFF (Click to enable)'}
            >
              <Shuffle className="w-4 h-4" />
            </button>

            {/* Previous Track Button */}
            <button
              type="button"
              onClick={prevSong}
              className="p-1.5 text-slate-700 dark:text-slate-300 hover:text-slate-950 dark:hover:text-white active:scale-95 transition-all"
              title="Previous Track (Left Arrow)"
              aria-label="Previous Track"
            >
              <SkipBack className="w-4 h-4 fill-current" />
            </button>

            {/* Play/Pause Button */}
            <button
              type="button"
              onClick={togglePlay}
              disabled={isLoading}
              className="w-10 h-10 rounded-full bg-gradient-to-tr from-brand-600 via-brand-500 to-brand-pink text-white flex items-center justify-center shadow-glow-purple hover:scale-105 active:scale-95 transition-all focus:outline-none"
              title={isPlaying ? 'Pause (Space)' : 'Play (Space)'}
              aria-label={isPlaying ? 'Pause' : 'Play'}
            >
              {isLoading ? (
                <Loader2 className="w-5 h-5 animate-spin" />
              ) : isPlaying ? (
                <Pause className="w-5 h-5 fill-current" />
              ) : (
                <Play className="w-5 h-5 fill-current ml-0.5" />
              )}
            </button>

            {/* Next Track Button */}
            <button
              type="button"
              onClick={nextSong}
              className="p-1.5 text-slate-700 dark:text-slate-300 hover:text-slate-950 dark:hover:text-white active:scale-95 transition-all"
              title="Next Track (Right Arrow)"
              aria-label="Next Track"
            >
              <SkipForward className="w-4 h-4 fill-current" />
            </button>

            {/* Repeat Mode Button */}
            <button
              type="button"
              onClick={toggleRepeat}
              className={`p-1.5 rounded-xl transition-all ${
                repeatMode !== 'off'
                  ? 'text-brand-pink bg-brand-pink/15 shadow-glow-pink ring-1 ring-brand-pink/30'
                  : 'text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-white/5'
              }`}
              title={
                repeatMode === 'one'
                  ? 'Repeat One Track'
                  : repeatMode === 'all'
                  ? 'Repeat All Tracks'
                  : 'Repeat Off'
              }
            >
              {repeatMode === 'one' ? <Repeat1 className="w-4 h-4" /> : <Repeat className="w-4 h-4" />}
            </button>
          </div>

          {/* Timeline Scrubber Bar */}
          <div className="w-full flex items-center gap-2 sm:gap-3 text-[11px] text-slate-500 dark:text-slate-400 font-mono">
            <span className="w-9 text-right select-none">{formatTime(currentTime)}</span>
            <ProgressBar
              value={currentTime}
              max={actualDuration}
              onChange={(val) => seek(val)}
              height="h-1.5"
              barColor="bg-gradient-to-r from-brand-600 to-brand-pink"
              showTooltip={true}
            />
            <span className="w-9 text-left select-none">{formatTime(actualDuration)}</span>
          </div>
        </div>

        {/* 3. Volume & Extras (Right) */}
        <div className="flex items-center justify-end gap-2 w-1/4 min-w-[170px]">
          {/* Playback Speed Selector */}
          <div className="relative hidden md:block" ref={speedMenuRef}>
            <button
              type="button"
              onClick={() => setShowSpeedMenu(!showSpeedMenu)}
              className={`px-2 py-1 rounded-lg text-xs font-mono font-bold transition-colors ${
                playbackSpeed !== 1
                  ? 'bg-brand-500/20 text-brand-600 dark:text-brand-300 ring-1 ring-brand-500/30'
                  : 'text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-white/5'
              }`}
              title="Playback Speed"
            >
              {playbackSpeed}x
            </button>

            {showSpeedMenu && (
              <div className="absolute right-0 bottom-full mb-2 w-28 rounded-2xl bg-white dark:bg-surface-panel/95 backdrop-blur-xl border border-slate-300 dark:border-surface-border shadow-2xl py-1.5 z-40 text-xs text-slate-800 dark:text-slate-200 select-none animate-in fade-in zoom-in-95 duration-150">
                <p className="px-3 py-1 font-bold text-[10px] uppercase text-slate-500 dark:text-slate-400 border-b border-slate-200 dark:border-surface-border">
                  Speed
                </p>
                {speedOptions.map((speed) => (
                  <button
                    key={speed}
                    type="button"
                    onClick={() => {
                      setPlaybackSpeed(speed);
                      setShowSpeedMenu(false);
                    }}
                    className={`w-full flex items-center justify-between px-3 py-1.5 text-left transition-colors ${
                      playbackSpeed === speed
                        ? 'text-brand-600 dark:text-brand-300 font-bold bg-purple-50 dark:bg-white/10'
                        : 'hover:bg-slate-100 dark:hover:bg-white/5 text-slate-700 dark:text-slate-300 hover:text-slate-950 dark:hover:text-white'
                    }`}
                  >
                    <span>{speed}x</span>
                    {playbackSpeed === speed && <span className="text-[10px] text-brand-500">✓</span>}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Sleep Timer Indicator */}
          {sleepTimerRemaining && (
            <div
              className="hidden lg:flex items-center gap-1 px-2 py-1 rounded-full bg-emerald-500/15 border border-emerald-500/30 text-emerald-600 dark:text-emerald-400 text-xs font-mono font-bold"
              title={`Sleep timer active: ${sleepTimerRemaining} remaining`}
            >
              <Moon className="w-3 h-3 text-emerald-500" />
              <span>{sleepTimerRemaining}</span>
            </div>
          )}

          {/* Volume Control */}
          <div className="hidden lg:flex items-center gap-1.5">
            <button
              type="button"
              onClick={toggleMute}
              className="p-1.5 rounded-xl text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white transition-colors"
              title={isMuted ? 'Unmute (M)' : 'Mute (M)'}
            >
              {renderVolumeIcon()}
            </button>
            <div className="w-20">
              <ProgressBar
                value={isMuted ? 0 : volume}
                max={1}
                step={0.01}
                onChange={(val) => setVolume(val)}
                height="h-1.5"
                barColor="bg-gradient-to-r from-brand-500 to-brand-pink"
                showTooltip={false}
              />
            </div>
          </div>

          {/* Queue Drawer Trigger */}
          <button
            type="button"
            onClick={() => setIsQueueOpen((prev) => !prev)}
            className="p-1.5 rounded-xl text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-white/5 transition-all"
            title="Open Playback Queue"
          >
            <ListMusic className="w-4 h-4" />
          </button>

          {/* Fullscreen Player Modal Button */}
          <button
            type="button"
            onClick={() => setIsFullScreenOpen(true)}
            className="p-1.5 rounded-xl text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-white/5 transition-all"
            title="Fullscreen Visualizer (F)"
          >
            <Maximize2 className="w-4 h-4" />
          </button>
        </div>
      </div>
    </footer>
  );
}
