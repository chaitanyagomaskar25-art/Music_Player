import React, { useState, useMemo } from 'react';
import { useNavigate, useOutletContext } from 'react-router-dom';
import { Heart, Play, Shuffle, Search, Music, Sparkles, Clock } from 'lucide-react';
import { usePlayer } from '../hooks/usePlayer';
import { SongRow } from '../components/music/SongRow';
import { Button } from '../components/common/Button';
import { EmptyState } from '../components/common/EmptyState';
import { formatTime } from '../utils/formatters';

export function FavoritesPage() {
  const { favorites, playSong, isShuffle, toggleShuffle, allSongs } = usePlayer();
  const [search, setSearch] = useState('');
  const { searchQuery: globalSearch = '' } = useOutletContext() || {};
  const navigate = useNavigate();

  // Get favorite songs from combined catalog (including imported local tracks)
  const favoriteSongs = useMemo(() => {
    const catalog = allSongs || [];
    return catalog.filter((song) => favorites.includes(song.id));
  }, [allSongs, favorites]);

  // Filter by local or global search
  const filteredFavoriteSongs = useMemo(() => {
    const query = search.trim() || globalSearch.trim();
    if (!query) return favoriteSongs;
    const q = query.toLowerCase();
    return favoriteSongs.filter(
      (s) =>
        s.title.toLowerCase().includes(q) ||
        s.artist.toLowerCase().includes(q) ||
        s.album.toLowerCase().includes(q) ||
        s.genre.toLowerCase().includes(q)
    );
  }, [favoriteSongs, search, globalSearch]);

  // Calculate total duration
  const totalSeconds = favoriteSongs.reduce((acc, s) => acc + (s.duration || 0), 0);
  const hours = Math.floor(totalSeconds / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const durationLabel = hours > 0 ? `${hours} hr ${minutes} min` : `${minutes} min`;

  const handlePlayAll = () => {
    if (filteredFavoriteSongs.length > 0) {
      playSong(filteredFavoriteSongs[0], filteredFavoriteSongs);
    }
  };

  const handleShufflePlay = () => {
    if (filteredFavoriteSongs.length > 0) {
      const shuffled = [...filteredFavoriteSongs].sort(() => Math.random() - 0.5);
      playSong(shuffled[0], shuffled);
      if (!isShuffle) toggleShuffle();
    }
  };

  return (
    <div className="space-y-8 max-w-7xl mx-auto pb-12 select-none animate-page-enter">
      {/* Header Banner */}
      <div className="relative overflow-hidden flex flex-col md:flex-row items-start md:items-end gap-6 bg-gradient-to-r from-brand-950/60 via-purple-950/30 to-surface-card p-6 sm:p-10 rounded-3xl border border-brand-500/20 shadow-2xl">
        <div className="absolute top-0 right-0 w-80 h-80 bg-brand-pink/15 rounded-full blur-3xl pointer-events-none" />

        <div className="w-36 h-36 sm:w-44 sm:h-44 rounded-3xl bg-gradient-to-tr from-brand-600 via-brand-500 to-brand-pink flex items-center justify-center shadow-glow-pink shrink-0">
          <Heart className="w-20 h-20 text-white fill-white animate-pulse" />
        </div>

        <div className="space-y-3 relative z-10 flex-1">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-brand-500/20 border border-brand-500/30 text-brand-300 text-xs font-bold uppercase tracking-wider">
            <Sparkles className="w-3.5 h-3.5 text-brand-pink" />
            Playlist • Saved Tracks
          </div>
          <h1 className="text-3xl sm:text-5xl font-black text-white tracking-tight">
            Liked Songs
          </h1>
          <p className="text-xs sm:text-sm text-slate-300">
            {favoriteSongs.length} track{favoriteSongs.length === 1 ? '' : 's'} saved in your private collection • {durationLabel} total listening time
          </p>

          {favoriteSongs.length > 0 && (
            <div className="flex flex-wrap items-center gap-3 pt-2">
              <Button
                onClick={handlePlayAll}
                icon={Play}
                size="md"
                className="rounded-full px-8 bg-gradient-to-r from-brand-600 via-brand-500 to-brand-pink shadow-glow-purple"
              >
                Play Favourites
              </Button>
              <button
                type="button"
                onClick={handleShufflePlay}
                className="px-6 py-2.5 rounded-full text-xs font-bold bg-surface-panel hover:bg-surface-hover border border-surface-border text-slate-200 flex items-center gap-2 transition-all shadow-subtle"
              >
                <Shuffle className="w-4 h-4 text-brand-pink" />
                <span>Shuffle Play</span>
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Search within favourites if items exist */}
      {favoriteSongs.length > 0 && (
        <div className="flex items-center justify-between gap-4 p-4 bg-surface-card rounded-2xl border border-surface-border">
          <div className="relative w-full max-w-sm">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search in liked songs..."
              className="w-full bg-surface-panel border border-surface-border rounded-xl pl-10 pr-4 py-2 text-xs text-slate-100 placeholder-slate-400 focus:outline-none focus:border-brand-500"
            />
          </div>
          <span className="text-xs text-slate-400 font-mono hidden sm:inline">
            {filteredFavoriteSongs.length} of {favoriteSongs.length} shown
          </span>
        </div>
      )}

      {/* Song List */}
      <div className="bg-surface-card rounded-3xl border border-surface-border p-3 md:p-4 shadow-subtle space-y-1">
        {filteredFavoriteSongs.map((song, idx) => (
          <SongRow
            key={song.id}
            song={song}
            index={idx}
            playlist={filteredFavoriteSongs}
          />
        ))}

        {favoriteSongs.length === 0 && (
          <EmptyState
            icon={Heart}
            title="No Liked Songs Yet"
            description="Tap the heart icon on any track while browsing to save it to your favourites."
            actionText="Discover Songs in Explore"
            onAction={() => navigate('/explore')}
            className="border-none shadow-none bg-transparent"
          />
        )}

        {favoriteSongs.length > 0 && filteredFavoriteSongs.length === 0 && (
          <div className="py-12 text-center text-slate-400 text-sm">
            No liked songs match "{search}".
          </div>
        )}
      </div>
    </div>
  );
}
