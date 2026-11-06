import React from 'react';
import { Play, Pause, Heart, BarChart2 } from 'lucide-react';
import { usePlayer } from '../../hooks/usePlayer';
import { formatTime } from '../../utils/formatters';
import { SongActionsDropdown } from './SongActionsDropdown';

export function SongRow({ song, index, playlist = null }) {
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
      className={`group flex items-center gap-3 md:gap-4 px-3 sm:px-4 py-2.5 rounded-2xl cursor-pointer transition-all duration-200 select-none border focus-visible:ring-2 focus-visible:ring-brand-500 focus-visible:outline-none ${
        isCurrent
          ? 'bg-gradient-to-r from-brand-600/15 via-brand-pink/5 to-transparent text-white border-brand-500/30 shadow-subtle'
          : 'hover:bg-white/[0.04] text-slate-300 hover:text-white border-transparent'
      }`}
    >
      {/* Index or Soundwave/Play indicator */}
      <div className="w-7 flex items-center justify-center shrink-0">
        {isSongPlaying ? (
          <div className="flex items-end gap-0.5 h-3.5">
            <span className="w-1 h-3.5 bg-brand-pink rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
            <span className="w-1 h-2 bg-brand-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
            <span className="w-1 h-3 bg-brand-300 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
          </div>
        ) : (
          <>
            <span
              className={`text-xs font-mono font-medium text-slate-500 group-hover:hidden ${
                isCurrent ? 'text-brand-400 font-bold' : ''
              }`}
            >
              {index !== undefined ? String(index + 1).padStart(2, '0') : ''}
            </span>
            <Play className="w-4 h-4 fill-current text-white hidden group-hover:block transition-transform group-hover:scale-110" />
          </>
        )}
      </div>

      {/* Album Artwork */}
      <div className="relative shrink-0">
        <img
          src={song.coverArt}
          alt={song.title}
          className={`w-11 h-11 rounded-xl object-cover shadow-md transition-all ${
            isCurrent ? 'ring-2 ring-brand-500/50' : 'group-hover:brightness-95'
          }`}
          loading="lazy"
        />
      </div>

      {/* Title & Artist */}
      <div className="flex-1 min-w-0 pr-2">
        <div className="flex items-center gap-1.5 min-w-0">
          <h4
            className={`text-sm font-bold truncate transition-colors ${
              isCurrent ? 'text-brand-300' : 'text-slate-100 group-hover:text-white'
            }`}
          >
            {song.title}
          </h4>
          {song.isLocal && (
            <span className="shrink-0 px-1.5 py-0.2 text-[9px] font-bold rounded bg-cyan-500/15 text-cyan-300 border border-cyan-500/30 uppercase tracking-wider">
              {song.fileFormat || 'LOCAL'}
            </span>
          )}
        </div>
        <p className="text-xs text-slate-400 truncate mt-0.5 group-hover:text-slate-300">
          {song.artist}
        </p>
      </div>

      {/* Album Name (Hidden on smaller screens) */}
      <div className="hidden md:block flex-1 min-w-0 text-xs text-slate-400 truncate font-medium">
        {song.album}
      </div>

      {/* Release or Genre Tag */}
      <div className="hidden lg:block w-32 text-xs text-slate-500 truncate">
        {song.genre}
      </div>

      {/* Favorite Button */}
      <button
        type="button"
        onClick={(e) => {
          e.stopPropagation();
          toggleFavorite(song.id);
        }}
        className="p-1.5 rounded-xl text-slate-400 hover:text-brand-pink transition-all hover:scale-110 active:scale-90"
        title={favorited ? 'Remove from favourites' : 'Save to favourites'}
      >
        <Heart
          className={`w-4 h-4 transition-colors ${
            favorited ? 'fill-brand-pink text-brand-pink' : 'group-hover:text-slate-300'
          }`}
        />
      </button>

      {/* Duration */}
      <div className="text-xs text-slate-400 font-mono w-11 text-right shrink-0">
        {formatTime(song.duration)}
      </div>

      {/* Track options dropdown */}
      <div onClick={(e) => e.stopPropagation()}>
        <SongActionsDropdown song={song} />
      </div>
    </div>
  );
}
