import React, { useState } from 'react';
import { Search, Plus, Check } from 'lucide-react';
import { usePlayer } from '../../hooks/usePlayer';
import { formatTime } from '../../utils/formatters';
import { Modal } from './Modal';

export function AddSongsToPlaylistModal({ isOpen, onClose, playlist }) {
  const [search, setSearch] = useState('');
  const { addSongToPlaylist, removeSongFromPlaylist, allSongs } = usePlayer();

  if (!playlist) return null;

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
    <Modal
      isOpen={isOpen && !!playlist}
      onClose={onClose}
      title={`Add Tracks to "${playlist.title}"`}
      subtitle={`${currentSongIds.length} tracks currently in playlist`}
      maxWidth="max-w-lg"
      maxHeight="max-h-[85vh]"
      footer={
        <button
          type="button"
          onClick={onClose}
          className="px-5 py-2 rounded-xl bg-gradient-to-r from-brand-600 to-brand-pink hover:opacity-95 text-white text-xs font-bold transition-all shadow-glow-purple text-white-force"
        >
          Done
        </button>
      }
    >
      {/* Search Filter */}
      <div className="py-3">
        <div className="relative">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search library songs by title, artist, or genre..."
            className="w-full bg-slate-50 dark:bg-surface-card border border-purple-200/80 dark:border-surface-border rounded-xl pl-10 pr-4 py-2 text-xs text-slate-900 dark:text-slate-100 placeholder-slate-400 focus:outline-none focus:border-brand-500"
          />
        </div>
      </div>

      {/* Songs List */}
      <div className="flex-1 overflow-y-auto space-y-1 pr-1 max-h-64 sm:max-h-80">
        {filteredSongs.map((song) => {
          const isInPlaylist = currentSongIds.includes(song.id);
          return (
            <div
              key={song.id}
              className="flex items-center justify-between p-2 rounded-xl bg-slate-50/80 hover:bg-purple-50/60 dark:bg-surface-card/60 dark:hover:bg-surface-panel border border-purple-100/70 dark:border-surface-border/40 transition-colors"
            >
              <div className="flex items-center gap-3 min-w-0 flex-1 pr-2">
                <img
                  src={song.coverArt}
                  alt={song.title}
                  className="w-10 h-10 rounded-lg object-cover shrink-0"
                />
                <div className="min-w-0 flex-1">
                  <h4 className="text-xs font-bold text-slate-900 dark:text-slate-200 truncate">
                    {song.title}
                  </h4>
                  <p className="text-[11px] text-slate-600 dark:text-slate-400 truncate">
                    {song.artist} • <span className="text-brand-pink font-semibold">{song.genre}</span>
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2 shrink-0">
                <span className="text-[11px] font-mono text-slate-500 dark:text-slate-400 hidden sm:inline">
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
                      ? 'bg-brand-100 text-brand-700 border border-brand-200 hover:bg-rose-100 hover:text-rose-700 hover:border-rose-200 dark:bg-brand-500/20 dark:text-brand-300 dark:border-brand-500/40 dark:hover:bg-rose-500/20 dark:hover:text-rose-300 dark:hover:border-rose-500/40'
                      : 'bg-slate-200/80 hover:bg-brand-600 hover:text-white text-slate-800 dark:bg-white/10 dark:hover:bg-brand-600 dark:text-white text-white-force-hover'
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
    </Modal>
  );
}
