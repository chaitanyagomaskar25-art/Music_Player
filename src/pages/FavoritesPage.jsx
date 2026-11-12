import React, { useState, useMemo } from 'react';
import { useOutletContext } from 'react-router-dom';
import {
  Heart,
  Play,
  Shuffle,
  Search,
  Sparkles,
  Clock,
  X,
  ShieldCheck,
  ArrowUpDown,
  SlidersHorizontal,
} from 'lucide-react';
import { usePlayer } from '../hooks/usePlayer';
import { SongRow } from '../components/music/SongRow';
import { Button } from '../components/common/Button';
import { BackButton } from '../components/common/BackButton';
import { EmptyState } from '../components/common/EmptyState';

export function FavoritesPage() {
  const { favorites, playSong, isShuffle, toggleShuffle, allSongs } = usePlayer();
  const [search, setSearch] = useState('');
  const [selectedGenre, setSelectedGenre] = useState('all');
  const [sortBy, setSortBy] = useState('recent');
  const { searchQuery: globalSearch = '' } = useOutletContext() || {};

  // Get favorite songs from combined catalog (including imported local tracks)
  const favoriteSongs = useMemo(() => {
    const catalog = allSongs || [];
    return catalog.filter((song) => favorites.includes(song.id));
  }, [allSongs, favorites]);

  // Extract available genres among liked songs
  const availableGenres = useMemo(() => {
    const set = new Set();
    favoriteSongs.forEach((s) => {
      if (s.genre) set.add(s.genre);
    });
    const list = Array.from(set);
    if (list.length === 0) {
      return ['all', 'Pop', 'Hip-Hop', 'Rock', 'Electronic', 'Jazz', 'Lo-Fi'];
    }
    return ['all', ...list];
  }, [favoriteSongs]);

  // Filter & sort favorite songs
  const filteredFavoriteSongs = useMemo(() => {
    const query = search.trim() || globalSearch.trim();
    let list = favoriteSongs.filter((s) => {
      const matchesSearch =
        !query ||
        s.title.toLowerCase().includes(query.toLowerCase()) ||
        s.artist.toLowerCase().includes(query.toLowerCase()) ||
        s.album.toLowerCase().includes(query.toLowerCase()) ||
        s.genre.toLowerCase().includes(query.toLowerCase());

      const matchesGenre =
        selectedGenre === 'all' ||
        s.genre.toLowerCase() === selectedGenre.toLowerCase();

      return matchesSearch && matchesGenre;
    });

    if (sortBy === 'title') {
      return [...list].sort((a, b) => a.title.localeCompare(b.title));
    }
    if (sortBy === 'artist') {
      return [...list].sort((a, b) => a.artist.localeCompare(b.artist));
    }
    if (sortBy === 'duration') {
      return [...list].sort((a, b) => (b.duration || 0) - (a.duration || 0));
    }
    return list;
  }, [favoriteSongs, search, globalSearch, selectedGenre, sortBy]);

  // Calculate total duration
  const totalSeconds = favoriteSongs.reduce((acc, s) => acc + (s.duration || 0), 0);
  const hours = Math.floor(totalSeconds / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const durationLabel = hours > 0 ? `${hours}h ${minutes}m` : `${minutes} min`;

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
    <div className="space-y-4 sm:space-y-6 max-w-7xl mx-auto pb-12 select-none animate-page-enter w-full min-w-0 overflow-x-hidden">
      {/* 1. Back Navigation Button */}
      <BackButton />

      {/* 2. Responsive Hero Header (Scales gracefully: stacks cleanly on mobile & tablet) */}
      <section className="relative overflow-hidden flex flex-col lg:flex-row items-center lg:items-end gap-4 sm:gap-6 bg-gradient-to-r from-white via-purple-50/70 to-pink-50/50 dark:from-surface-charcoal dark:via-brand-950/40 dark:to-surface-card p-4 sm:p-6 lg:p-8 rounded-2xl sm:rounded-3xl border border-purple-200/80 dark:border-brand-500/20 shadow-lg shadow-purple-500/5 dark:shadow-2xl transition-all duration-300 w-full min-w-0">
        <div className="absolute top-0 right-10 w-72 h-72 bg-brand-pink/10 dark:bg-brand-pink/15 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-10 left-1/3 w-64 h-64 bg-brand-500/10 rounded-full blur-3xl pointer-events-none" />

        {/* Compact Liked Songs Cover Artwork */}
        <div className="shrink-0 relative group/art mx-auto lg:mx-0">
          <div className="w-28 h-28 sm:w-36 sm:h-36 lg:w-44 lg:h-44 rounded-2xl sm:rounded-3xl overflow-hidden shadow-xl ring-2 ring-pink-400/30 dark:ring-pink-500/30 group-hover/art:scale-105 group-hover/art:ring-pink-500/60 transition-all duration-500 relative bg-gradient-to-br from-brand-600 via-brand-500 to-brand-pink flex items-center justify-center p-3 sm:p-4">
            <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent pointer-events-none" />

            <div className="relative z-10 flex flex-col items-center justify-center text-center">
              <div className="w-11 h-11 sm:w-14 sm:h-14 lg:w-16 lg:h-16 rounded-xl sm:rounded-2xl bg-white/20 backdrop-blur-md border border-white/30 flex items-center justify-center shadow-md transform group-hover/art:scale-110 transition-transform duration-300">
                <Heart className="w-6 h-6 sm:w-8 sm:h-8 lg:w-9 lg:h-9 text-white fill-white drop-shadow-md" />
              </div>
              <p className="mt-1.5 sm:mt-2 text-white font-black text-[11px] sm:text-xs tracking-wider uppercase font-mono drop-shadow">
                Liked Mix
              </p>
            </div>

            <div className="absolute bottom-2 left-2 right-2 flex items-center justify-between text-[10px] text-white-force font-medium">
              <span className="px-1.5 py-0.5 rounded-md bg-black/50 backdrop-blur-md text-white-force font-bold flex items-center gap-1">
                <Sparkles className="w-2.5 h-2.5 text-brand-pink" />
                Loved
              </span>
              <span className="font-mono text-white-force opacity-90">
                {favoriteSongs.length} Tracks
              </span>
            </div>
          </div>
        </div>

        {/* Hero Details Column (Clean responsive stack) */}
        <div className="space-y-2 sm:space-y-3 text-center lg:text-left flex-1 relative z-10 w-full min-w-0">
          <div className="flex items-center justify-center lg:justify-start gap-2">
            <span className="px-2.5 py-0.5 sm:px-3 sm:py-1 rounded-full bg-pink-100/90 text-pink-700 border border-pink-200/80 dark:bg-brand-500/20 dark:text-brand-300 dark:border-brand-500/30 text-[10px] sm:text-xs font-bold uppercase tracking-wider flex items-center gap-1.5">
              <Heart className="w-3 h-3 text-brand-pink fill-brand-pink" />
              Playlist • Private Collection
            </span>
          </div>

          <div className="space-y-1">
            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-black text-slate-900 dark:text-white tracking-tight leading-tight">
              Liked Songs
            </h1>
            <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 font-medium max-w-xl mx-auto lg:mx-0">
              Your handpicked favorites saved with instant local storage sync and spatial audio.
            </p>
          </div>

          <div className="flex flex-wrap items-center justify-center lg:justify-start gap-2 text-xs text-slate-600 dark:text-slate-300 font-medium">
            <span className="text-slate-900 dark:text-white font-bold">Alex</span>
            <span>•</span>
            <span>{favoriteSongs.length} track{favoriteSongs.length === 1 ? '' : 's'}</span>
            <span>•</span>
            <span>{durationLabel}</span>
            <span>•</span>
            <span className="inline-flex items-center gap-1 text-emerald-600 dark:text-emerald-400 font-semibold">
              <ShieldCheck className="w-3.5 h-3.5" /> Synced Locally
            </span>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-wrap items-center justify-center lg:justify-start gap-2.5 pt-1">
            {favoriteSongs.length > 0 ? (
              <>
                <Button
                  onClick={handlePlayAll}
                  icon={Play}
                  size="md"
                  className="rounded-full px-6 sm:px-7 bg-gradient-to-r from-brand-600 via-brand-500 to-brand-pink shadow-glow-purple hover:scale-105 active:scale-95 transition-all text-white-force font-bold text-xs sm:text-sm"
                >
                  Play All
                </Button>
                <button
                  type="button"
                  onClick={handleShufflePlay}
                  className={`px-4 sm:px-5 py-2 rounded-full text-xs font-bold transition-all flex items-center gap-1.5 border shadow-xs ${
                    isShuffle
                      ? 'bg-slate-950 text-white border-slate-950 dark:bg-brand-500 dark:border-brand-500 dark:text-white shadow-glow-purple'
                      : 'bg-white hover:bg-slate-100 dark:bg-surface-card dark:hover:bg-surface-hover border-purple-200/80 dark:border-surface-border text-slate-800 dark:text-slate-200'
                  }`}
                >
                  <Shuffle className="w-3.5 h-3.5 text-brand-pink" />
                  <span>Shuffle</span>
                </button>
              </>
            ) : (
              <Button
                onClick={() => navigate('/explore')}
                icon={Sparkles}
                size="md"
                className="rounded-full px-6 sm:px-7 bg-gradient-to-r from-brand-600 via-brand-500 to-brand-pink shadow-glow-purple hover:scale-105 active:scale-95 transition-all text-white-force font-bold text-xs sm:text-sm"
              >
                Discover Music
              </Button>
            )}
          </div>
        </div>
      </section>

      {/* 3. Fully Responsive Quick-Metrics (Stacks below each other on mobile, 2 cols on small tablet, 4 cols on desktop) */}
      <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2.5 sm:gap-3 w-full min-w-0">
        {/* Metric 1: Likes */}
        <div className="p-3 sm:p-3.5 rounded-xl sm:rounded-2xl bg-white dark:bg-surface-card border border-purple-200/80 dark:border-surface-border shadow-xs hover:border-brand-400 dark:hover:border-brand-500/40 transition-all flex items-center justify-between sm:justify-start gap-3 min-w-0">
          <div className="flex items-center gap-3 min-w-0">
            <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-xl bg-pink-100 text-pink-600 dark:bg-brand-pink/20 dark:text-brand-pink border border-pink-200/80 dark:border-brand-pink/30 flex items-center justify-center shrink-0">
              <Heart className="w-4 h-4 fill-current" />
            </div>
            <div className="min-w-0">
              <p className="text-[10px] font-mono font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                Favorites
              </p>
              <p className="text-sm sm:text-base font-black text-slate-900 dark:text-white leading-tight">
                {favoriteSongs.length} Liked Songs
              </p>
            </div>
          </div>
          <span className="text-[10px] font-mono font-bold uppercase px-2 py-0.5 rounded-full bg-pink-50 text-pink-700 dark:bg-brand-pink/10 dark:text-brand-pink sm:hidden shrink-0">
            Saved
          </span>
        </div>

        {/* Metric 2: Minutes */}
        <div className="p-3 sm:p-3.5 rounded-xl sm:rounded-2xl bg-white dark:bg-surface-card border border-purple-200/80 dark:border-surface-border shadow-xs hover:border-brand-400 dark:hover:border-brand-500/40 transition-all flex items-center justify-between sm:justify-start gap-3 min-w-0">
          <div className="flex items-center gap-3 min-w-0">
            <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-xl bg-purple-100 text-purple-600 dark:bg-brand-500/20 dark:text-brand-400 border border-purple-200/80 dark:border-brand-500/30 flex items-center justify-center shrink-0">
              <Clock className="w-4 h-4" />
            </div>
            <div className="min-w-0">
              <p className="text-[10px] font-mono font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                Minutes
              </p>
              <p className="text-sm sm:text-base font-black text-slate-900 dark:text-white leading-tight">
                {durationLabel} Playtime
              </p>
            </div>
          </div>
          <span className="text-[10px] font-mono font-bold uppercase px-2 py-0.5 rounded-full bg-purple-50 text-purple-700 dark:bg-brand-500/10 dark:text-brand-400 sm:hidden shrink-0">
            Duration
          </span>
        </div>

        {/* Metric 3: Curated */}
        <div className="p-3 sm:p-3.5 rounded-xl sm:rounded-2xl bg-white dark:bg-surface-card border border-purple-200/80 dark:border-surface-border shadow-xs hover:border-brand-400 dark:hover:border-brand-500/40 transition-all flex items-center justify-between sm:justify-start gap-3 min-w-0">
          <div className="flex items-center gap-3 min-w-0">
            <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-xl bg-cyan-100 text-cyan-600 dark:bg-cyan-500/20 dark:text-cyan-400 border border-cyan-200/80 dark:border-cyan-500/30 flex items-center justify-center shrink-0">
              <Sparkles className="w-4 h-4" />
            </div>
            <div className="min-w-0">
              <p className="text-[10px] font-mono font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                Curated
              </p>
              <p className="text-sm sm:text-base font-black text-slate-900 dark:text-white leading-tight">
                100% Handpicked
              </p>
            </div>
          </div>
          <span className="text-[10px] font-mono font-bold uppercase px-2 py-0.5 rounded-full bg-cyan-50 text-cyan-700 dark:bg-cyan-500/10 dark:text-cyan-400 sm:hidden shrink-0">
            Mix
          </span>
        </div>

        {/* Metric 4: Synced */}
        <div className="p-3 sm:p-3.5 rounded-xl sm:rounded-2xl bg-white dark:bg-surface-card border border-purple-200/80 dark:border-surface-border shadow-xs hover:border-brand-400 dark:hover:border-brand-500/40 transition-all flex items-center justify-between sm:justify-start gap-3 min-w-0">
          <div className="flex items-center gap-3 min-w-0">
            <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-xl bg-emerald-100 text-emerald-600 dark:bg-emerald-500/20 dark:text-emerald-400 border border-emerald-200/80 dark:border-emerald-500/30 flex items-center justify-center shrink-0">
              <ShieldCheck className="w-4 h-4" />
            </div>
            <div className="min-w-0">
              <p className="text-[10px] font-mono font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                Synced
              </p>
              <p className="text-sm sm:text-base font-black text-emerald-600 dark:text-emerald-400 leading-tight">
                Active Local Storage
              </p>
            </div>
          </div>
          <span className="text-[10px] font-mono font-bold uppercase px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 dark:bg-emerald-500/10 dark:text-emerald-400 sm:hidden shrink-0">
            Offline
          </span>
        </div>
      </section>

      {/* 4. Streamlined Filter & Search Toolbar (Stacks neatly on mobile) */}
      <section className="bg-white dark:bg-surface-card rounded-2xl sm:rounded-3xl border border-purple-200/80 dark:border-surface-border p-3 sm:p-4 shadow-xs space-y-2.5 sm:space-y-3 w-full min-w-0">
        {/* Search Input + Sort Dropdown (Stack below each other on mobile) */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-2.5 sm:gap-3 w-full min-w-0">
          <div className="relative flex-1 min-w-0">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search liked songs, artists, albums..."
              className="w-full bg-slate-50 hover:bg-slate-100/80 focus:bg-white dark:bg-surface-panel dark:hover:bg-surface-panel/90 border border-slate-300 dark:border-surface-border rounded-xl pl-9 pr-8 py-2 text-xs text-slate-900 dark:text-slate-100 placeholder-slate-500 dark:placeholder-slate-400 focus:outline-none focus:border-brand-500 focus:ring-1 focus:ring-brand-500 transition-all"
            />
            {search && (
              <button
                type="button"
                onClick={() => setSearch('')}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 p-1 text-slate-400 hover:text-slate-900 dark:hover:text-white"
                title="Clear search"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

          <div className="flex items-center justify-between sm:justify-end gap-2 shrink-0">
            <div className="flex items-center gap-1.5 text-xs text-slate-600 dark:text-slate-300">
              <ArrowUpDown className="w-3.5 h-3.5 text-brand-pink shrink-0" />
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="bg-slate-50 dark:bg-surface-panel border border-slate-300 dark:border-surface-border text-slate-800 dark:text-slate-200 text-xs font-bold rounded-xl px-2.5 py-1.5 focus:outline-none focus:border-brand-500 cursor-pointer shadow-2xs"
              >
                <option value="recent">Recently Added</option>
                <option value="title">Title: A to Z</option>
                <option value="artist">Artist: A to Z</option>
                <option value="duration">Longest Duration</option>
              </select>
            </div>

            <span className="text-xs font-mono text-slate-500 dark:text-slate-400 px-2.5 py-1 rounded-xl bg-slate-100 dark:bg-white/5 border border-slate-200 dark:border-white/5">
              {filteredFavoriteSongs.length} / {favoriteSongs.length}
            </span>
          </div>
        </div>

        {/* Genre Quick Filter Chips (Horizontal swipe on all screen sizes) */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none w-full min-w-0 pt-1 border-t border-slate-100 dark:border-surface-border/50">
          <span className="text-[10px] sm:text-[11px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mr-1 shrink-0 flex items-center gap-1">
            <SlidersHorizontal className="w-3 h-3 text-brand-pink" />
            Genre:
          </span>
          {availableGenres.map((genre) => {
            const isSelected = selectedGenre.toLowerCase() === genre.toLowerCase();
            return (
              <button
                key={genre}
                type="button"
                onClick={() => setSelectedGenre(genre)}
                className={`px-2.5 sm:px-3 py-1 rounded-lg sm:rounded-xl text-[11px] sm:text-xs font-bold transition-all whitespace-nowrap shrink-0 border ${
                  isSelected
                    ? 'bg-slate-950 text-white border-slate-950 dark:bg-gradient-to-r dark:from-brand-600 dark:to-brand-pink dark:border-transparent dark:text-white shadow-xs'
                    : 'bg-slate-50 hover:bg-slate-100 text-slate-700 border-slate-200 dark:bg-surface-panel dark:hover:bg-surface-hover dark:text-slate-300 dark:border-surface-border'
                }`}
              >
                {genre === 'all' ? 'All Genres' : genre}
              </button>
            );
          })}
          {selectedGenre !== 'all' && (
            <button
              type="button"
              onClick={() => setSelectedGenre('all')}
              className="text-[11px] text-brand-pink hover:underline font-bold shrink-0 ml-1.5"
            >
              Clear
            </button>
          )}
        </div>
      </section>

      {/* 5. Liked Songs List (Padding & font sizes optimized for mobile/tablet) */}
      <section className="space-y-2 w-full min-w-0">
        <div className="bg-white dark:bg-surface-card rounded-2xl sm:rounded-3xl border border-slate-200 dark:border-surface-border p-1.5 sm:p-3 shadow-sm space-y-1 w-full min-w-0 overflow-hidden">
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
              className="border-none shadow-none bg-transparent py-12"
            />
          )}

          {favoriteSongs.length > 0 && filteredFavoriteSongs.length === 0 && (
            <div className="py-12 text-center space-y-2.5">
              <p className="text-slate-600 dark:text-slate-400 text-xs font-medium">
                No liked songs match "{search || selectedGenre}".
              </p>
              <button
                type="button"
                onClick={() => {
                  setSearch('');
                  setSelectedGenre('all');
                }}
                className="text-xs text-brand-pink font-bold hover:underline"
              >
                Reset filters
              </button>
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
