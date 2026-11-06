import React, { useState } from 'react';
import { Play, Pause, Heart, Clock } from 'lucide-react';
import { usePlayer } from '../../hooks/usePlayer';
import { Card } from '../common/Card';
import { SongActionsDropdown } from './SongActionsDropdown';
import { formatTime } from '../../utils/formatters';

export function SongCard({ song, playlist = null }) {
  const { currentSong, isPlaying, playSong, togglePlay, isFavorite, toggleFavorite } = usePlayer();
  const [imageLoaded, setImageLoaded] = useState(false);
  const isCurrent = currentSong?.id === song.id;
  const isSongPlaying = isCurrent && isPlaying;
  const favorited = isFavorite(song.id);

  const handlePlayClick = (e) => {
    e.stopPropagation();
    if (isCurrent) {
      togglePlay();
    } else {
      playSong(song, playlist);
    }
  };

  return (
    <Card
      onClick={handlePlayClick}
      className={`group cursor-pointer flex flex-col p-3 sm:p-3.5 rounded-3xl transition-all duration-300 border focus-visible:ring-2 focus-visible:ring-brand-500 focus-visible:outline-none ${
        isCurrent
          ? 'bg-brand-500/10 border-brand-500/40 shadow-glow-purple -translate-y-1'
          : 'bg-surface-card hover:bg-surface-hover border-surface-border hover:border-brand-500/30 hover:-translate-y-1.5 hover:shadow-2xl'
      }`}
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === 'Enter') handlePlayClick(e);
      }}
    >
      <div className="relative aspect-square w-full rounded-2xl overflow-hidden mb-3 bg-surface-panel shadow-md">
        {!imageLoaded && (
          <div className="absolute inset-0 bg-white/5 animate-pulse rounded-2xl" />
        )}
        <img
          src={song.coverArt}
          alt={song.title}
          onLoad={() => setImageLoaded(true)}
          className={`w-full h-full object-cover transition-transform duration-500 ease-out group-hover:scale-105 ${
            imageLoaded ? 'opacity-100' : 'opacity-0'
          }`}
          loading="lazy"
        />

        {/* Play overlay button with smooth translate & scale */}
        <div
          className={`absolute inset-0 bg-black/40 backdrop-blur-[2px] flex items-center justify-center transition-all duration-300 ${
            isSongPlaying
              ? 'opacity-100'
              : 'opacity-0 group-hover:opacity-100'
          }`}
        >
          <button
            type="button"
            onClick={handlePlayClick}
            className={`w-12 h-12 rounded-full bg-gradient-to-tr from-brand-600 via-brand-500 to-brand-pink text-white flex items-center justify-center shadow-glow-purple transform transition-all duration-300 hover:scale-110 active:scale-95 focus-visible:ring-2 focus-visible:ring-white focus-visible:outline-none ${
              isSongPlaying ? 'scale-100 translate-y-0' : 'translate-y-2 group-hover:translate-y-0'
            }`}
            aria-label={isSongPlaying ? 'Pause song' : 'Play song'}
            title={isSongPlaying ? `Pause ${song.title}` : `Play ${song.title}`}
          >
            {isSongPlaying ? (
              <Pause className="w-5 h-5 fill-current" />
            ) : (
              <Play className="w-5 h-5 fill-current ml-0.5" />
            )}
          </button>
        </div>

        {/* Favorite Icon */}
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            toggleFavorite(song.id);
          }}
          className={`absolute top-2.5 right-2.5 p-2 rounded-full bg-black/60 backdrop-blur-md transition-all duration-200 hover:scale-110 active:scale-90 ${
            favorited
              ? 'opacity-100 text-brand-pink'
              : 'opacity-0 group-hover:opacity-100 text-white hover:text-brand-pink'
          }`}
          aria-label={favorited ? 'Remove favourite' : 'Add to favourites'}
          title={favorited ? 'Remove from favorites' : 'Add to favorites'}
        >
          <Heart className={`w-3.5 h-3.5 ${favorited ? 'fill-brand-pink text-brand-pink' : ''}`} />
        </button>

        {/* Duration badge on image bottom-right */}
        <div className="absolute bottom-2 right-2 px-2 py-0.5 rounded-lg bg-black/70 backdrop-blur-md text-[10px] font-mono font-bold text-white/90 shadow-sm pointer-events-none">
          {formatTime(song.duration)}
        </div>
      </div>

      {/* Song details */}
      <div className="flex items-start justify-between gap-1">
        <div className="min-w-0 flex-1">
          <h3
            className={`font-bold text-sm truncate transition-colors ${
              isCurrent ? 'text-brand-300' : 'text-slate-100 group-hover:text-white'
            }`}
          >
            {song.title}
          </h3>
          <p className="text-xs text-slate-400 truncate mt-0.5 group-hover:text-slate-300">
            {song.artist}
          </p>
          <div className="flex items-center justify-between text-[11px] text-slate-500 font-medium mt-1">
            <span className="text-brand-pink/80 truncate">{song.genre}</span>
            <span className="font-mono text-slate-400">{formatTime(song.duration)}</span>
          </div>
        </div>
        <div onClick={(e) => e.stopPropagation()} className="pt-0.5">
          <SongActionsDropdown song={song} />
        </div>
      </div>
    </Card>
  );
}
