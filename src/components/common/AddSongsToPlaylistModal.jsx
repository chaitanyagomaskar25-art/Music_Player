import React, { useState } from 'react';
import { X, Search, Plus, Check, Music } from 'lucide-react';
import { usePlayer } from '../../hooks/usePlayer';
import { formatTime } from '../../utils/formatters';

export function AddSongsToPlaylistModal({ isOpen, onClose, playlist }) {
  const [search, setSearch] = useState('');
  const { addSongToPlaylist, removeSongFromPlaylist, allSongs } = usePlayer();

  if (!isOpen || !playlist) return null;

  const currentSongIds = playlist.songIds || [];
  const songCatalog = allSongs || [];

  const filteredSongs = songCatalog.filter(
    (song) =>
      !search.trim() ||
      song.title.toLowerCase().includes(search.toLowerCase()) ||
      song.artist.toLowerCase().includes(search.toLowerCase()) ||
      song.genre.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 select-none">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/80 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Modal Dialog */}
      <div className="relative w-full max-w-lg bg-surface-charcoal border border-surface-border rounded-3xl p-6 shadow-2xl z-10 animate-in fade-in zoom-in-95 duration-150 flex flex-col max-h-[85vh]">
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-surface-border">
          <div>
            <h3 className="text-base font-bold text-white">
              Add Tracks to "{playlist.title}"
            </h3>
            <p className="text-[11px] text-slate-400">
              {currentSongIds.length} tracks currently in playlist
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-xl text-slate-400 hover:text-white hover:bg-white/10 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Search Filter */}
        <div className="py-3">
          <div className="relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search library songs by title, artist, or genre..."
              className="w-full bg-surface-card border border-surface-border rounded-xl pl-10 pr-4 py-2 text-xs text-slate-100 placeholder-slate-500 focus:outline-none focus:border-brand-500"
            />
          </div>
        </div>

        {/* Songs List */}
        <div className="flex-1 overflow-y-auto space-y-1 pr-1">
          {filteredSongs.map((song) => {
            const isInPlaylist = currentSongIds.includes(song.id);
            return (
              <div
                key={song.id}
                className="flex items-center justify-between p-2 rounded-xl bg-surface-card/60 hover:bg-surface-panel border border-surface-border/40 transition-colors"
              >
                <div className="flex items-center gap-3 min-w-0 flex-1 pr-2">
                  <img
                    src={song.coverArt}
                    alt={song.title}
                    className="w-10 h-10 rounded-lg object-cover shrink-0"
                  />
                  <div className="min-w-0 flex-1">
                    <h4 className="text-xs font-bold text-slate-200 truncate">
                      {song.title}
                    </h4>
                    <p className="text-[11px] text-slate-400 truncate">
                      {song.artist} • <span className="text-brand-pink/80">{song.genre}</span>
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  <span className="text-[11px] font-mono text-slate-500 hidden sm:inline">
                    {formatTime(song.duration)}
                  </span>
                  <button
                    type="button"
                    onClick={() => {
                      if (isInPlaylist) {
                        removeSongFromPlaylist(playlist.id, song.id);
                      } else {
                        addSongToPlaylist(playlist.id, song.id);
                      }
                    }}
                    className={`px-3 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1 transition-all ${
                      isInPlaylist
                        ? 'bg-brand-500/20 text-brand-300 border border-brand-500/40 hover:bg-rose-500/20 hover:text-rose-300 hover:border-rose-500/40'
                        : 'bg-white/10 hover:bg-brand-600 text-white'
                    }`}
                  >
                    {isInPlaylist ? (
                      <>
                        <Check className="w-3.5 h-3.5" />
                        <span>Added</span>
                      </>
                    ) : (
                      <>
                        <Plus className="w-3.5 h-3.5" />
                        <span>Add</span>
                      </>
                    )}
                  </button>
                </div>
              </div>
            );
          })}
        </div>

        {/* Footer */}
        <div className="pt-3 border-t border-surface-border flex justify-end">
          <button
            type="button"
            onClick={onClose}
            className="px-5 py-2 rounded-xl bg-brand-600 hover:bg-brand-500 text-white text-xs font-bold transition-all shadow-glow-purple"
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
}
