import React, { useState } from 'react';
import {
  ChevronDown,
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
  Moon,
  Clock,
  Sparkles,
  ListMusic,
  Activity,
  Sliders,
  Info,
} from 'lucide-react';
import { usePlayer } from '../../hooks/usePlayer';
import { formatTime } from '../../utils/formatters';
import { ProgressBar } from '../common/ProgressBar';
import { AudioVisualizerCanvas } from './AudioVisualizerCanvas';

export function FullScreenPlayer() {
  const {
    isFullScreenOpen,
    setIsFullScreenOpen,
    currentSong,
    isPlaying,
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
    isFavorite,
    toggleFavorite,
    playbackSpeed,
    setPlaybackSpeed,
    setSleepTimer,
    sleepTimerTime,
    sleepTimerRemaining,
    openSongDetails,
    eqGains,
    activeEqPreset,
    applyEqPreset,
    setCustomEqBand,
    EQ_PRESETS,
    setIsQueueOpen,
    addToast,
  } = usePlayer();

  const [activeTab, setActiveTab] = useState('player'); // 'player' | 'lyrics' | 'visualizer'
  const [visualizerMode, setVisualizerMode] = useState('bars'); // 'bars' | 'wave' | 'mirror'
  const [showSpeedMenu, setShowSpeedMenu] = useState(false);
  const [showTimerMenu, setShowTimerMenu] = useState(false);

  if (!isFullScreenOpen || !currentSong) return null;

  const favorited = isFavorite(currentSong.id);

  // Equalizer presets list
  const presetList = [
    { name: 'Flat', label: 'Flat Reference' },
    { name: 'Bass Boost', label: 'Bass Boost' },
    { name: 'Rock', label: 'Rock' },
    { name: 'Pop', label: 'Pop' },
    { name: 'Classical', label: 'Classical' },
    { name: 'Jazz', label: 'Jazz' },
  ];

  // Frequency bands list for parametric EQ sliders
  const freqBands = [
    { id: 'bass', label: '60 Hz', name: 'Bass' },
    { id: 'lowMid', label: '250 Hz', name: 'Low Mid' },
    { id: 'mid', label: '1 kHz', name: 'Mid' },
    { id: 'highMid', label: '4 kHz', name: 'High Mid' },
    { id: 'treble', label: '12 kHz', name: 'Treble' },
  ];

  // Sample dynamic lyrics for demo tracks
  const mockLyrics = [
    { time: 0, text: '♪ Instrumental intro ♪' },
    { time: 15, text: 'Drifting under neon lights' },
    { time: 30, text: 'Echoes of a distant dream' },
    { time: 45, text: 'Shadows dancing through the night' },
    { time: 60, text: 'Nothing is quite what it seems' },
    { time: 75, text: 'Lost inside the synthwave glow' },
    { time: 95, text: 'Where the silent river flows' },
    { time: 120, text: '♪ Ethereal bridge ♪' },
    { time: 150, text: 'Waiting for the dawn to break' },
    { time: 180, text: 'Every breath a melody we make' },
  ];

  return (
    <div className="fixed inset-0 z-50 bg-surface-base flex flex-col overflow-hidden animate-in fade-in zoom-in-95 duration-200 select-none">
      {/* Dynamic blurred ambient glow from song artwork */}
      <div
        className="absolute inset-0 bg-cover bg-center opacity-25 blur-3xl scale-125 pointer-events-none"
        style={{ backgroundImage: `url(${currentSong.coverArt})` }}
      />
      <div className="absolute inset-0 bg-gradient-to-t from-surface-base via-surface-base/80 to-surface-base/90 pointer-events-none" />

      {/* Top Header */}
      <header className="relative z-10 h-20 px-6 md:px-12 flex items-center justify-between border-b border-white/5">
        <button
          type="button"
          onClick={() => setIsFullScreenOpen(false)}
          className="p-2 rounded-full bg-white/5 hover:bg-white/10 text-slate-300 hover:text-white transition-all flex items-center gap-1.5 text-xs font-semibold"
        >
          <ChevronDown className="w-5 h-5" />
          <span className="hidden sm:inline">Minimize</span>
        </button>

        {/* View Switcher Tabs */}
        <div className="flex items-center gap-1 bg-surface-card/60 p-1 rounded-2xl border border-white/10 shadow-lg">
          <button
            type="button"
            onClick={() => setActiveTab('player')}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all ${
              activeTab === 'player'
                ? 'bg-brand-600 text-white shadow-glow-purple'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            Now Playing
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('lyrics')}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all ${
              activeTab === 'lyrics'
                ? 'bg-brand-600 text-white shadow-glow-purple'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            Lyrics
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('visualizer')}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
              activeTab === 'visualizer'
                ? 'bg-brand-600 text-white shadow-glow-purple'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <Activity className="w-3.5 h-3.5 text-brand-pink" />
            <span>Visualizer & EQ</span>
          </button>
        </div>

        {/* Right Quick Controls */}
        <div className="flex items-center gap-2">
          {/* Speed Selector */}
          <div className="relative">
            <button
              type="button"
              onClick={() => {
                setShowSpeedMenu(!showSpeedMenu);
                setShowTimerMenu(false);
              }}
              className="px-2.5 py-1 rounded-lg bg-white/5 hover:bg-white/10 text-xs font-mono font-bold text-slate-300"
              title="Playback Speed"
            >
              {playbackSpeed}x
            </button>
            {showSpeedMenu && (
              <div className="absolute right-0 top-full mt-2 w-28 bg-surface-panel border border-surface-border rounded-xl shadow-2xl py-1 z-30">
                {[0.5, 1, 1.25, 1.5, 2].map((s) => (
                  <button
                    key={s}
                    type="button"
                    onClick={() => {
                      setPlaybackSpeed(s);
                      setShowSpeedMenu(false);
                    }}
                    className={`w-full text-left px-3 py-1.5 text-xs hover:bg-white/10 ${
                      playbackSpeed === s ? 'text-brand-400 font-bold' : 'text-slate-300'
                    }`}
                  >
                    {s}x speed
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Sleep Timer */}
          <div className="relative flex items-center">
            <button
              type="button"
              onClick={() => {
                setShowTimerMenu(!showTimerMenu);
                setShowSpeedMenu(false);
              }}
              className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-full hover:bg-white/10 transition-colors ${
                sleepTimerTime ? 'text-brand-400 bg-brand-500/15 border border-brand-500/30' : 'text-slate-400 hover:text-white'
              }`}
              title="Sleep Timer"
            >
              <Moon className="w-4 h-4" />
              {sleepTimerRemaining && (
                <span className="text-[11px] font-mono font-bold">{sleepTimerRemaining}</span>
              )}
            </button>
            {showTimerMenu && (
              <div className="absolute right-0 top-full mt-2 w-44 bg-surface-panel border border-surface-border rounded-xl shadow-2xl py-1 z-30 text-xs">
                <p className="px-3 py-1 font-bold text-slate-400 border-b border-surface-border">
                  Sleep Timer
                </p>
                {[
                  { label: 'Off', val: 0 },
                  { label: '15 Minutes', val: 15 },
                  { label: '30 Minutes', val: 30 },
                  { label: '45 Minutes', val: 45 },
                  { label: '60 Minutes', val: 60 },
                ].map((item) => (
                  <button
                    key={item.label}
                    type="button"
                    onClick={() => {
                      setSleepTimer(item.val);
                      setShowTimerMenu(false);
                    }}
                    className="w-full text-left px-3 py-1.5 text-slate-300 hover:bg-white/10 hover:text-white"
                  >
                    {item.label}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Song Details Trigger */}
          <button
            type="button"
            onClick={() => openSongDetails && openSongDetails(currentSong)}
            className="p-2 rounded-full hover:bg-white/10 text-slate-400 hover:text-white transition-colors"
            title="Track Details & Metadata"
          >
            <Info className="w-4 h-4" />
          </button>
        </div>
      </header>

      {/* Main Content Area */}
      <div className="relative z-10 flex-1 overflow-y-auto px-6 py-6 md:px-16 max-w-5xl mx-auto w-full flex flex-col justify-center items-center">
        {activeTab === 'player' && (
          <div className="w-full max-w-md flex flex-col items-center text-center space-y-6">
            {/* Large Album Artwork */}
            <div className="relative aspect-square w-64 sm:w-80 md:w-96 rounded-3xl overflow-hidden shadow-2xl shadow-black/80 ring-2 ring-white/10 group">
              <img
                src={currentSong.coverArt}
                alt={currentSong.title}
                className={`w-full h-full object-cover transition-transform duration-700 ${
                  isPlaying ? 'scale-105' : 'scale-100'
                }`}
              />
              {/* Dynamic waveform visualizer bar effect */}
              {isPlaying && (
                <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex items-end gap-1.5 px-4 py-2 bg-black/60 backdrop-blur-md rounded-full shadow-lg">
                  <span className="w-1 h-3 bg-brand-pink rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                  <span className="w-1 h-6 bg-brand-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                  <span className="w-1 h-4 bg-brand-300 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                  <span className="w-1 h-7 bg-brand-pink rounded-full animate-bounce" style={{ animationDelay: '100ms' }} />
                  <span className="w-1 h-5 bg-brand-400 rounded-full animate-bounce" style={{ animationDelay: '250ms' }} />
                </div>
              )}
            </div>

            {/* Song Meta & Favorite */}
            <div className="w-full flex items-center justify-between">
              <div className="text-left min-w-0 flex-1 pr-4">
                <h2 className="text-2xl sm:text-3xl font-black text-white truncate">
                  {currentSong.title}
                </h2>
                <p className="text-base sm:text-lg text-slate-300 truncate mt-1 font-semibold">
                  {currentSong.artist}
                </p>
                <p className="text-xs text-brand-400 mt-0.5">
                  {currentSong.album} • {currentSong.genre}
                </p>
              </div>

              <button
                type="button"
                onClick={() => toggleFavorite(currentSong.id)}
                className="p-3.5 rounded-2xl bg-white/5 hover:bg-white/10 transition-colors"
                title={favorited ? 'Remove from favorites' : 'Add to favorites'}
              >
                <Heart className={`w-6 h-6 ${favorited ? 'fill-brand-pink text-brand-pink' : 'text-slate-400'}`} />
              </button>
            </div>

            {/* Scrubber Progress Bar */}
            <div className="w-full space-y-2">
              <ProgressBar
                value={currentTime}
                max={duration > 0 ? duration : (currentSong.duration || 100)}
                onChange={(val) => seek(val)}
                height="h-2"
                barColor="bg-gradient-to-r from-brand-600 to-brand-pink"
                showTooltip={true}
              />
              <div className="flex justify-between text-xs font-mono text-slate-400">
                <span>{formatTime(currentTime)}</span>
                <span>{formatTime(duration > 0 ? duration : (currentSong.duration || 100))}</span>
              </div>
            </div>

            {/* Playback Controls */}
            <div className="flex items-center justify-center gap-6 sm:gap-8 pt-1">
              <button
                type="button"
                onClick={toggleShuffle}
                className={`p-2 rounded-full transition-colors ${
                  isShuffle ? 'text-brand-pink bg-brand-pink/15 ring-1 ring-brand-pink/30' : 'text-slate-400 hover:text-white'
                }`}
                title="Shuffle"
              >
                <Shuffle className="w-5 h-5" />
              </button>

              <button
                type="button"
                onClick={prevSong}
                className="p-2 text-slate-300 hover:text-white active:scale-95 transition-all"
                title="Previous track"
              >
                <SkipBack className="w-7 h-7 fill-current" />
              </button>

              <button
                type="button"
                onClick={togglePlay}
                className="w-16 h-16 rounded-full bg-gradient-to-tr from-brand-600 via-brand-500 to-brand-pink text-white flex items-center justify-center shadow-glow-purple hover:scale-105 active:scale-95 transition-all"
                title={isPlaying ? 'Pause' : 'Play'}
              >
                {isPlaying ? (
                  <Pause className="w-8 h-8 fill-current" />
                ) : (
                  <Play className="w-8 h-8 fill-current ml-1" />
                )}
              </button>

              <button
                type="button"
                onClick={nextSong}
                className="p-2 text-slate-300 hover:text-white active:scale-95 transition-all"
                title="Next track"
              >
                <SkipForward className="w-7 h-7 fill-current" />
              </button>

              <button
                type="button"
                onClick={toggleRepeat}
                className={`p-2 rounded-full transition-colors ${
                  repeatMode !== 'off' ? 'text-brand-400 bg-brand-500/15 ring-1 ring-brand-500/30' : 'text-slate-400 hover:text-white'
                }`}
                title="Repeat mode"
              >
                {repeatMode === 'one' ? <Repeat1 className="w-5 h-5" /> : <Repeat className="w-5 h-5" />}
              </button>
            </div>

            {/* Bottom Volume & Queue triggers */}
            <div className="w-full flex items-center justify-between pt-3">
              <button
                type="button"
                onClick={() => {
                  setIsFullScreenOpen(false);
                  setIsQueueOpen(true);
                }}
                className="flex items-center gap-2 text-xs font-semibold text-slate-400 hover:text-white transition-colors"
              >
                <ListMusic className="w-4 h-4" />
                <span>View Queue</span>
              </button>

              <div className="flex items-center gap-3 w-40">
                <button
                  type="button"
                  onClick={toggleMute}
                  className="text-slate-400 hover:text-white"
                >
                  {isMuted || volume === 0 ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
                </button>
                <ProgressBar
                  value={isMuted ? 0 : volume * 100}
                  max={100}
                  onChange={(val) => setVolume(val / 100)}
                  height="h-1.5"
                  barColor="bg-slate-200"
                />
              </div>
            </div>
          </div>
        )}

        {/* Lyrics & Vibe View */}
        {activeTab === 'lyrics' && (
          <div className="w-full max-w-xl text-center space-y-6 py-4">
            <h3 className="text-xl font-bold text-white flex items-center justify-center gap-2">
              <Sparkles className="w-5 h-5 text-brand-pink" />
              Synchronized Lyrics
            </h3>

            <div className="space-y-4 py-4 max-h-[60vh] overflow-y-auto pr-2">
              {mockLyrics.map((line, i) => {
                const isCurrentLine =
                  currentTime >= line.time &&
                  (i === mockLyrics.length - 1 || currentTime < mockLyrics[i + 1].time);

                return (
                  <p
                    key={i}
                    onClick={() => seek(line.time)}
                    className={`cursor-pointer transition-all duration-300 py-1 ${
                      isCurrentLine
                        ? 'text-2xl sm:text-3xl font-black bg-gradient-to-r from-brand-300 via-white to-brand-pink bg-clip-text text-transparent scale-105 drop-shadow'
                        : 'text-base sm:text-lg text-slate-500 hover:text-slate-300 font-medium'
                    }`}
                  >
                    {line.text}
                  </p>
                );
              })}
            </div>
          </div>
        )}

        {/* Visualizer & Equalizer View */}
        {activeTab === 'visualizer' && (
          <div className="w-full max-w-2xl text-center space-y-6 py-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-left">
                <Activity className="w-5 h-5 text-brand-pink" />
                <div>
                  <h3 className="text-lg font-bold text-white">Audio Visualizer</h3>
                  <p className="text-xs text-slate-400">Live harmonic frequency spectrum</p>
                </div>
              </div>

              {/* Visualizer mode switcher */}
              <div className="flex items-center gap-1 bg-surface-card p-1 rounded-xl border border-surface-border text-xs font-bold">
                {['bars', 'wave', 'mirror'].map((m) => (
                  <button
                    key={m}
                    type="button"
                    onClick={() => setVisualizerMode(m)}
                    className={`px-3 py-1 rounded-lg capitalize transition-all ${
                      visualizerMode === m
                        ? 'bg-brand-600 text-white shadow-glow-purple'
                        : 'text-slate-400 hover:text-white'
                    }`}
                  >
                    {m}
                  </button>
                ))}
              </div>
            </div>

            {/* Canvas Spectrum Visualizer */}
            <AudioVisualizerCanvas isPlaying={isPlaying} mode={visualizerMode} />

            {/* Web Audio API 5-Band Parametric Equalizer */}
            <div className="space-y-4 pt-2 text-left bg-surface-card p-5 rounded-3xl border border-surface-border">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Sliders className="w-4 h-4 text-brand-400" />
                  <div>
                    <h4 className="text-sm font-bold text-white uppercase tracking-wider">
                      5-Band Web Audio Equalizer
                    </h4>
                    <p className="text-[11px] text-slate-400">
                      Real-time audio processing via BiquadFilterNodes
                    </p>
                  </div>
                </div>
                <span className="text-xs font-mono font-bold px-2.5 py-0.5 rounded-full bg-brand-500/20 text-brand-300 border border-brand-500/30">
                  {activeEqPreset}
                </span>
              </div>

              {/* Sliders */}
              <div className="grid grid-cols-5 gap-2 sm:gap-4 py-2">
                {freqBands.map((band) => {
                  const gain = eqGains ? (eqGains[band.id] || 0) : 0;
                  return (
                    <div key={band.id} className="flex flex-col items-center space-y-2">
                      <span className="text-[10px] font-mono font-bold text-brand-300">
                        {gain > 0 ? `+${gain}` : gain}dB
                      </span>
                      <div className="h-28 flex items-center justify-center">
                        <input
                          type="range"
                          min="-12"
                          max="12"
                          step="1"
                          value={gain}
                          onChange={(e) => setCustomEqBand && setCustomEqBand(band.id, Number(e.target.value))}
                          className="h-24 w-2 -rotate-90 cursor-pointer accent-brand-500"
                          style={{ WebkitAppearance: 'slider-vertical' }}
                        />
                      </div>
                      <div className="text-center">
                        <span className="text-[10px] font-bold text-slate-200 block truncate">
                          {band.name}
                        </span>
                        <span className="text-[9px] font-mono text-slate-500 block">
                          {band.label}
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Presets List */}
              <div className="pt-2 border-t border-surface-border">
                <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-2">
                  Presets
                </p>
                <div className="grid grid-cols-3 sm:grid-cols-6 gap-2">
                  {presetList.map((preset) => {
                    const isSelected = activeEqPreset === preset.name;
                    return (
                      <button
                        key={preset.name}
                        type="button"
                        onClick={() => {
                          if (applyEqPreset) applyEqPreset(preset.name);
                          addToast(`Equalizer: ${preset.name} applied`, 'info');
                        }}
                        className={`py-2 px-2 rounded-xl text-xs font-bold transition-all text-center truncate ${
                          isSelected
                            ? 'bg-gradient-to-r from-brand-600 to-brand-pink text-white shadow-glow-purple'
                            : 'bg-surface-panel hover:bg-surface-hover text-slate-300 border border-surface-border'
                        }`}
                      >
                        {preset.name}
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
