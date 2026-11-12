import React from 'react';
import {
  X,
  Trash2,
  Music2,
  BarChart2,
  Play,
  ChevronUp,
  ChevronDown,
  Clock,
  Sparkles,
} from 'lucide-react';
import { usePlayer } from '../../hooks/usePlayer';
import { formatTime } from '../../utils/formatters';

export function QueueDrawer() {
  const {
    isQueueOpen,
    setIsQueueOpen,
    queue,
    queueIndex,
    currentSong,
    isPlaying,
    playSong,
    removeFromQueue,
    clearQueue,
    moveInQueue,
  } = usePlayer();

  if (!isQueueOpen) return null;

  // Calculate total duration of remaining queue
  const totalQueueSeconds = queue.reduce((acc, song) => acc + (song.duration || 0), 0);
  const queueHours = Math.floor(totalQueueSeconds / 3600);
  const queueMinutes = Math.floor((totalQueueSeconds % 3600) / 60);
  const formattedQueueDuration =
    queueHours > 0 ? `${queueHours} hr ${queueMinutes} min` : `${queueMinutes} min`;

  return (
    <div className="fixed inset-0 z-50 flex justify-end select-none">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/70 backdrop-blur-sm transition-opacity"
        onClick={() => setIsQueueOpen(false)}
      />

      {/* Drawer content */}
      <div className="relative w-full max-w-md bg-surface-charcoal border-l border-surface-border h-full flex flex-col z-10 shadow-2xl animate-in slide-in-from-right duration-250">
        {/* Header */}
        <div className="p-4 md:p-6 border-b border-surface-border flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-brand-500/20 text-brand-300">
              <Music2 className="w-5 h-5 text-brand-400" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-base font-bold text-white">Playback Queue</h2>
                <span className="text-[11px] bg-brand-500/20 text-brand-300 font-mono font-bold px-2 py-0.5 rounded-full">
                  {queue.length}
                </span>
              </div>
              <p className="text-[11px] text-slate-400 flex items-center gap-1 mt-0.5">
                <Clock className="w-3 h-3 text-slate-500" />
                <span>Total Duration: {formattedQueueDuration}</span>
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {queue.length > 1 && (
              <button
                type="button"
                onClick={clearQueue}
                className="px-2.5 py-1 text-xs font-semibold text-slate-400 hover:text-rose-400 hover:bg-rose-500/10 rounded-xl transition-colors flex items-center gap-1.5"
                title="Clear upcoming queue"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span>Clear</span>
              </button>
            )}
            <button
              type="button"
              onClick={() => setIsQueueOpen(false)}
              className="p-1.5 rounded-xl text-slate-400 hover:text-white hover:bg-white/10 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Scrollable list */}
        <div className="flex-1 overflow-y-auto p-4 space-y-5">
          {/* Currently Playing Track */}
          {currentSong && (
            <div className="space-y-2">
              <p className="text-xs font-bold uppercase tracking-wider text-brand-pink flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5" />
                Now Playing
              </p>
              <div className="flex items-center gap-3.5 p-3.5 bg-slate-950 text-white border border-slate-900 rounded-2xl shadow-xl text-white-force dark:bg-gradient-to-r dark:from-brand-600/20 dark:to-brand-pink/10 dark:border-brand-500/30 dark:shadow-glow-purple">
                <img
                  src={currentSong.coverArt}
                  alt={currentSong.title}
                  className="w-12 h-12 rounded-xl object-cover ring-2 ring-brand-400 shadow-md shrink-0"
                />
                <div className="flex-1 min-w-0">
                  <h4 className="text-sm font-bold text-white truncate">
                    {currentSong.title}
                  </h4>
                  <p className="text-xs text-slate-300 font-medium truncate mt-0.5">
                    {currentSong.artist}
                  </p>
                </div>
                {isPlaying && (
                  <div className="flex items-end gap-0.5 h-4 shrink-0 px-2">
                    <span className="w-1 h-4 bg-brand-400 dark:bg-brand-pink rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                    <span className="w-1 h-2.5 bg-brand-300 dark:bg-brand-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                    <span className="w-1 h-3.5 bg-brand-200 dark:bg-brand-300 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Up Next List with Reordering */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <p className="text-xs font-bold uppercase tracking-wider text-slate-600 dark:text-slate-400">
                Up Next ({queue.length - 1} tracks)
              </p>
              <span className="text-[10px] text-slate-500">
                Use arrows to reorder
              </span>
            </div>

            <div className="space-y-1">
              {queue.map((song, idx) => {
                const isCurrent = idx === queueIndex;
                return (
                  <div
                    key={`${song.id}-${idx}`}
                    onClick={() => playSong(song)}
                    className={`group flex items-center gap-2.5 p-2 rounded-xl cursor-pointer transition-all ${
                      isCurrent
                        ? 'bg-slate-950 text-white border border-slate-900 shadow-lg text-white-force dark:bg-white/10 dark:text-white dark:border-white/10'
                        : 'hover:bg-slate-100 dark:hover:bg-white/5 text-slate-700 dark:text-slate-300 hover:text-slate-950 dark:hover:text-white border border-transparent'
                    }`}
                  >
                    <span className={`text-[11px] font-mono w-5 text-center shrink-0 ${
                      isCurrent ? 'text-brand-400 dark:text-brand-400 font-bold' : 'text-slate-500'
                    }`}>
                      {idx + 1}
                    </span>

                    <img
                      src={song.coverArt}
                      alt={song.title}
                      className="w-10 h-10 rounded-lg object-cover shrink-0"
                    />

                    <div className="flex-1 min-w-0 pr-1">
                      <h4 className={`text-xs md:text-sm font-semibold truncate ${
                        isCurrent ? 'text-white font-bold dark:text-brand-300' : 'text-slate-800 dark:text-slate-200'
                      }`}>
                        {song.title}
                      </h4>
                      <p className={`text-[11px] truncate mt-0.5 ${
                        isCurrent ? 'text-slate-300 dark:text-slate-400' : 'text-slate-600 dark:text-slate-400'
                      }`}>
                        {song.artist}
                      </p>
                    </div>

                    <span className="text-xs text-slate-500 font-mono shrink-0">
                      {formatTime(song.duration)}
                    </span>

                    {/* Reorder Buttons (Move Up / Move Down) */}
                    <div className="flex items-center gap-0.5 shrink-0" onClick={(e) => e.stopPropagation()}>
                      {idx > 0 && (
                        <button
                          type="button"
                          onClick={() => moveInQueue(idx, idx - 1)}
                          className="p-1 rounded-md text-slate-400 sm:text-slate-500 hover:text-white hover:bg-white/10 transition-colors sm:opacity-0 sm:group-hover:opacity-100 focus:opacity-100"
                          title="Move up"
                        >
                          <ChevronUp className="w-3.5 h-3.5" />
                        </button>
                      )}
                      {idx < queue.length - 1 && (
                        <button
                          type="button"
                          onClick={() => moveInQueue(idx, idx + 1)}
                          className="p-1 rounded-md text-slate-400 sm:text-slate-500 hover:text-white hover:bg-white/10 transition-colors sm:opacity-0 sm:group-hover:opacity-100 focus:opacity-100"
                          title="Move down"
                        >
                          <ChevronDown className="w-3.5 h-3.5" />
                        </button>
                      )}

                      {/* Remove item from queue */}
                      {!isCurrent && (
                        <button
                          type="button"
                          onClick={() => removeFromQueue(idx)}
                          className="p-1 rounded-md text-slate-400 sm:text-slate-500 hover:text-rose-400 hover:bg-rose-500/10 transition-colors sm:opacity-0 sm:group-hover:opacity-100 focus:opacity-100"
                          title="Remove from queue"
                        >
                          <X className="w-3.5 h-3.5" />
                        </button>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
