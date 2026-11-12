import React from 'react';
import { Play } from 'lucide-react';

export function PlaylistCard({
  playlist,
  onClick,
  badge,
  imageClassName = 'w-16 h-16 sm:w-18 sm:h-18',
  className = '',
}) {
  if (!playlist) return null;

  return (
    <div
      onClick={onClick}
      className={`group relative flex items-center gap-4 p-3.5 bg-white hover:bg-purple-50/40 dark:bg-surface-card dark:hover:bg-surface-hover border border-purple-200/80 hover:border-brand-400 dark:border-surface-border dark:hover:border-brand-500/40 rounded-3xl cursor-pointer transition-all duration-300 shadow-xs hover:shadow-md hover:-translate-y-1 select-none ${className}`}
    >
      <div className={`relative ${imageClassName} rounded-2xl overflow-hidden shadow-md shrink-0 bg-slate-100 dark:bg-surface-panel`}>
        <img
          src={playlist.coverArt}
          alt={playlist.title}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
        />
        <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
          <div className="w-8 h-8 rounded-full bg-brand-500 text-white flex items-center justify-center shadow-glow-purple">
            <Play className="w-3.5 h-3.5 fill-current ml-0.5 text-white" />
          </div>
        </div>
      </div>
      <div className="min-w-0 flex-1">
        {badge && (
          <span className="text-[10px] font-bold uppercase text-brand-pink tracking-wider">
            {badge}
          </span>
        )}
        <h4 className="font-bold text-sm text-slate-900 dark:text-slate-100 group-hover:text-brand-600 dark:group-hover:text-brand-300 transition-colors truncate mt-0.5">
          {playlist.title}
        </h4>
        <p className="text-xs text-slate-600 dark:text-slate-400 line-clamp-1 mt-0.5 font-medium">
          {playlist.description}
        </p>
        <p className="text-[11px] text-slate-500 dark:text-slate-400 font-mono mt-1 font-semibold">
          {playlist.songIds ? playlist.songIds.length : 0} tracks
        </p>
      </div>
    </div>
  );
}
