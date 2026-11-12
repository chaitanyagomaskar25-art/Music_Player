import React from 'react';
import { Play, Pause, Heart, BarChart2 } from 'lucide-react';
import { usePlayer } from '../../hooks/usePlayer';
import { formatTime } from '../../utils/formatters';
import { SongActionsDropdown } from './SongActionsDropdown';

export const SongRow = React.memo(function SongRow({ song, index, playlist = null }) {
  const { currentSong, isPlaying, playSong, togglePlay, isFavorite, toggleFavorite } = usePlayer();
  const isCurrent = currentSong?.id === song.id;
  const isSongPlaying = isCurrent && isPlaying;
  const favorited = isFavorite(song.id);

  const handleRowClick = () => {
    if (isCurrent) {
      togglePlay();
    } else {
      playSong(song, playlist);
    }
  };

  return (
    <div
      onClick={handleRowClick}
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === 'Enter') handleRowClick();
      }}
      className={`group flex items-center gap-2 sm:gap-3 md:gap-4 px-2 sm:px-4 py-2 sm:py-2.5 rounded-2xl cursor-pointer transition-all duration-200 select-none border focus-visible:ring-2 focus-visible:ring-brand-500 focus-visible:outline-none ${
        isCurrent
          ? 'bg-slate-950 text-white border-slate-900 shadow-xl text-white-force dark:bg-gradient-to-r dark:from-brand-600/25 dark:via-brand-pink/15 dark:to-transparent dark:text-white dark:border-brand-500/40 dark:shadow-subtle'
          : 'hover:bg-slate-100/80 dark:hover:bg-white/[0.04] text-slate-700 dark:text-slate-300 hover:text-slate-950 dark:hover:text-white border-transparent'
      }`}
    >
      {/* Index or Soundwave/Play indicator */}
      <div className="w-6 sm:w-7 flex items-center justify-center shrink-0">
        {isSongPlaying ? (
          <div className="flex items-end gap-0.5 h-3.5">
            <span className="w-0.5 sm:w-1 h-3.5 bg-brand-400 dark:bg-brand-pink rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
            <span className="w-0.5 sm:w-1 h-2 bg-brand-300 dark:bg-brand-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
            <span className="w-0.5 sm:w-1 h-3 bg-brand-200 dark:bg-brand-300 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
          </div>
        ) : (
          <>
            <span
              className={`text-xs font-mono font-bold group-hover:hidden ${
                isCurrent ? 'text-white dark:text-brand-400' : 'text-slate-500'
              }`}
            >
              {index !== undefined ? String(index + 1).padStart(2, '0') : ''}
            </span>
            <Play className={`w-3.5 h-3.5 sm:w-4 sm:h-4 fill-current hidden group-hover:block transition-transform group-hover:scale-110 ${
              isCurrent ? 'text-white' : 'text-slate-900 dark:text-white'
            }`} />
          </>
        )}
      </div>

      {/* Album Artwork */}
      <div className="relative shrink-0">
        <img
          src={song.coverArt}
          alt={song.title}
          className={`w-10 h-10 sm:w-11 sm:h-11 rounded-xl object-cover shadow-md transition-all ${
            isCurrent ? 'ring-2 ring-brand-400 shadow-lg' : 'group-hover:brightness-95'
          }`}
          loading="lazy"
        />
      </div>

      {/* Title & Artist */}
      <div className="flex-1 min-w-0 pr-2">
        <div className="flex items-center gap-1.5 min-w-0">
          <h4
            className={`text-sm font-bold truncate transition-colors ${
              isCurrent
                ? 'text-white font-black tracking-wide'
                : 'text-slate-900 dark:text-slate-100 group-hover:text-brand-600 dark:group-hover:text-white'
            }`}
          >
            {song.title}
          </h4>
          {song.isLocal && (
            <span className={`shrink-0 px-1.5 py-0.2 text-[9px] font-bold rounded uppercase tracking-wider ${
              isCurrent
                ? 'bg-cyan-500/30 text-cyan-200 border border-cyan-400/50'
                : 'bg-cyan-100 text-cyan-800 border border-cyan-300 dark:bg-cyan-500/15 dark:text-cyan-300 dark:border-cyan-500/30'
            }`}>
              {song.fileFormat || 'LOCAL'}
            </span>
          )}
        </div>
        <p className={`text-xs truncate mt-0.5 ${
          isCurrent
            ? 'text-slate-300 dark:text-slate-300 font-medium'
            : 'text-slate-600 dark:text-slate-400 group-hover:text-slate-900 dark:group-hover:text-slate-300'
        }`}>
          {song.artist}
        </p>
      </div>

      {/* Album Name (Hidden on smaller screens) */}
      <div className={`hidden md:block flex-1 min-w-0 text-xs truncate font-medium ${
        isCurrent ? 'text-slate-300 dark:text-slate-300' : 'text-slate-600 dark:text-slate-400'
      }`}>
        {song.album}
      </div>

      {/* Release or Genre Tag */}
      <div className={`hidden lg:block w-32 text-xs truncate ${
        isCurrent ? 'text-slate-300 dark:text-slate-300 font-medium' : 'text-slate-500'
      }`}>
        {song.genre}
      </div>

      {/* Favorite Button */}
      <button
        type="button"
        onClick={(e) => {
          e.stopPropagation();
          toggleFavorite(song.id);
        }}
        className={`p-1.5 rounded-xl transition-all hover:scale-110 active:scale-90 ${
          isCurrent ? 'text-slate-300 hover:text-brand-pink' : 'text-slate-400 hover:text-brand-pink'
        }`}
        title={favorited ? 'Remove from favourites' : 'Save to favourites'}
      >
        <Heart
          className={`w-4 h-4 transition-colors ${
            favorited ? 'fill-brand-pink text-brand-pink' : 'group-hover:text-slate-400'
          }`}
        />
      </button>

      {/* Duration */}
      <div className={`text-xs font-mono w-11 text-right shrink-0 ${
        isCurrent ? 'text-slate-200 dark:text-slate-200 font-bold' : 'text-slate-500 dark:text-slate-400'
      }`}>
        {formatTime(song.duration)}
      </div>

      {/* Track options dropdown */}
      <div onClick={(e) => e.stopPropagation()}>
        <SongActionsDropdown song={song} />
      </div>
    </div>
  );
});
