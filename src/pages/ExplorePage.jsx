import React, { useState, useMemo } from 'react';
import { useOutletContext, useSearchParams } from 'react-router-dom';
import {
  Compass,
  Search,
  SlidersHorizontal,
  Play,
  Shuffle,
  Grid,
  List,
  Sparkles,
  ArrowUpDown,
  FilterX,
  RotateCcw,
  Music,
  Flame,
  Zap,
  Cpu,
  Coffee,
  Moon,
} from 'lucide-react';
import { genres, songs } from '../data/musicData';
import { SongCard } from '../components/music/SongCard';
import { SongRow } from '../components/music/SongRow';
import { Button } from '../components/common/Button';
import { EmptyState } from '../components/common/EmptyState';
import { usePlayer } from '../hooks/usePlayer';

export function ExplorePage() {
  const { searchQuery: globalSearch = '' } = useOutletContext() || {};
  const [searchParams, setSearchParams] = useSearchParams();
  const urlGenre = searchParams.get('genre');

  const [localSearch, setLocalSearch] = useState('');
  const [selectedGenre, setSelectedGenre] = useState(urlGenre || 'all');
  const [sortBy, setSortBy] = useState('recent'); // 'recent' | 'title-asc' | 'title-desc' | 'artist-asc' | 'popular' | 'duration'
  const [viewMode, setViewMode] = useState('grid'); // 'grid' | 'list'

  const { playSong, isShuffle, toggleShuffle, allSongs } = usePlayer();

  const activeSearch = globalSearch || localSearch;

  // Filter & Sort Logic (including imported local tracks)
  const filteredAndSortedSongs = useMemo(() => {
    let result = [...(allSongs || songs)];

    // Genre filter
    if (selectedGenre && selectedGenre !== 'all') {
      result = result.filter(
        (s) => s.genre.toLowerCase() === selectedGenre.toLowerCase()
      );
    }

    // Search query filter (title, artist, album, genre)
    if (activeSearch.trim()) {
      const q = activeSearch.toLowerCase().trim();
      result = result.filter(
        (s) =>
          s.title.toLowerCase().includes(q) ||
          s.artist.toLowerCase().includes(q) ||
          s.album.toLowerCase().includes(q) ||
          s.genre.toLowerCase().includes(q)
      );
    }

    // Sorting
    switch (sortBy) {
      case 'title-asc':
        result.sort((a, b) => a.title.localeCompare(b.title));
        break;
      case 'title-desc':
        result.sort((a, b) => b.title.localeCompare(a.title));
        break;
      case 'artist-asc':
        result.sort((a, b) => a.artist.localeCompare(b.artist));
        break;
      case 'popular':
        result.sort((a, b) => b.plays - a.plays);
        break;
      case 'duration':
        result.sort((a, b) => a.duration - b.duration);
        break;
      case 'recent':
      default:
        result.sort((a, b) => new Date(b.addedAt || '2024-01-01') - new Date(a.addedAt || '2024-01-01'));
        break;
    }

    return result;
  }, [selectedGenre, activeSearch, sortBy]);

  // Handle genre pill click
  const handleSelectGenre = (genreId) => {
    setSelectedGenre(genreId);
    if (genreId === 'all') {
      searchParams.delete('genre');
      setSearchParams(searchParams);
    } else {
      setSearchParams({ genre: genreId });
    }
  };

  // Play All in current filtered view
  const handlePlayAll = () => {
    if (filteredAndSortedSongs.length > 0) {
      playSong(filteredAndSortedSongs[0], filteredAndSortedSongs);
    }
  };

  // Reset filters
  const handleResetFilters = () => {
    setSelectedGenre('all');
    setLocalSearch('');
    setSortBy('recent');
    setSearchParams({});
  };

  return (
    <div className="space-y-8 max-w-7xl mx-auto pb-12 select-none animate-page-enter">
      {/* 1. Header Banner */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-white via-purple-50/70 to-pink-50/50 dark:from-surface-charcoal dark:via-brand-950/40 dark:to-surface-card p-6 sm:p-10 border border-purple-200/80 dark:border-brand-500/20 shadow-xl shadow-purple-500/5 dark:shadow-2xl transition-all duration-300">
        <div className="absolute top-0 right-1/4 w-96 h-96 bg-brand-500/10 dark:bg-brand-600/15 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 max-w-2xl space-y-3">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-brand-100/90 dark:bg-brand-500/20 border border-brand-200/80 dark:border-brand-500/30 text-brand-700 dark:text-brand-300 text-xs font-bold uppercase tracking-wider">
            <Compass className="w-3.5 h-3.5 text-brand-pink" />
            Music Catalog & Discovery
          </div>
          <h1 className="text-3xl sm:text-5xl font-black text-slate-900 dark:text-white tracking-tight">
            Explore All Sounds
          </h1>
          <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
            Browse our handpicked library of 28 studio-mastered tracks across Pop, Hip-Hop, Rock, Electronic, Classical, Jazz, and Lo-Fi.
          </p>

          <div className="flex flex-wrap items-center gap-3 pt-2">
            <Button
              onClick={handlePlayAll}
              icon={Play}
              size="md"
              disabled={filteredAndSortedSongs.length === 0}
              className="rounded-full px-7 bg-gradient-to-r from-brand-600 via-brand-500 to-brand-pink shadow-glow-purple"
            >
              Play All ({filteredAndSortedSongs.length})
            </Button>
            <button
              type="button"
              onClick={toggleShuffle}
              className={`px-5 py-2.5 rounded-full text-xs font-bold border flex items-center gap-2 transition-all ${
                isShuffle
                  ? 'bg-brand-pink/20 text-brand-pink border-brand-pink/40 shadow-glow-pink'
                  : 'bg-surface-panel hover:bg-surface-hover text-slate-200 border-surface-border'
              }`}
            >
              <Shuffle className="w-3.5 h-3.5" />
              <span>Shuffle</span>
            </button>
          </div>
        </div>
      </div>

      {/* 2. Genre Tabs Filter Strip */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h2 className="text-xs font-bold uppercase tracking-wider text-slate-300 flex items-center gap-2">
            <SlidersHorizontal className="w-4 h-4 text-brand-pink" />
            Filter by Genre
          </h2>
          {selectedGenre !== 'all' && (
            <button
              type="button"
              onClick={() => handleSelectGenre('all')}
              className="text-xs text-brand-pink hover:underline font-bold"
            >
              Show all ({songs.length})
            </button>
          )}
        </div>

        <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
          <button
            type="button"
            onClick={() => handleSelectGenre('all')}
            className={`px-4 py-2 rounded-2xl text-xs font-bold border transition-all shrink-0 ${
              selectedGenre === 'all'
                ? 'bg-gradient-to-r from-brand-600 to-brand-pink text-white border-transparent shadow-glow-purple scale-105'
                : 'bg-surface-card hover:bg-surface-hover text-slate-300 border-surface-border'
            }`}
          >
            All Genres ({songs.length})
          </button>
          {genres.map((g) => {
            const isSelected = selectedGenre.toLowerCase() === g.name.toLowerCase();
            const genreCount = songs.filter((s) => s.genre.toLowerCase() === g.name.toLowerCase()).length;
            return (
              <button
                key={g.id}
                type="button"
                onClick={() => handleSelectGenre(g.name.toLowerCase())}
                className={`px-4 py-2 rounded-2xl text-xs font-bold border transition-all shrink-0 flex items-center gap-2 bg-gradient-to-br ${g.color} ${g.border} ${
                  isSelected
                    ? 'ring-2 ring-white text-white scale-105 shadow-glow-pink font-extrabold'
                    : 'text-slate-200 hover:brightness-125'
                }`}
              >
                <span>{g.name}</span>
                <span className="text-[10px] px-1.5 py-0.2 bg-black/40 rounded-full font-mono">
                  {genreCount}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* 3. Search, Sort, and View Controls Strip */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 p-4 bg-surface-card rounded-2xl border border-surface-border">
        {/* Search input inside Explore */}
        <div className="relative flex-1 max-w-md">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
          <input
            type="text"
            value={localSearch}
            onChange={(e) => setLocalSearch(e.target.value)}
            placeholder="Search by title, artist, album, or genre..."
            className="w-full bg-surface-panel border border-surface-border rounded-xl pl-10 pr-4 py-2 text-xs text-slate-100 placeholder-slate-400 focus:outline-none focus:border-brand-500 focus:ring-1 focus:ring-brand-500 transition-all"
          />
        </div>

        {/* Sort & View options */}
        <div className="flex items-center justify-between sm:justify-end gap-3 shrink-0">
          {/* Sorting Dropdown */}
          <div className="flex items-center gap-2 text-xs text-slate-300">
            <ArrowUpDown className="w-4 h-4 text-brand-400 shrink-0" />
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="bg-surface-panel border border-surface-border text-slate-200 text-xs font-semibold rounded-xl px-3 py-2 focus:outline-none focus:border-brand-500 cursor-pointer"
            >
              <option value="recent">Recently Added</option>
              <option value="popular">Most Popular</option>
              <option value="title-asc">Title: A to Z</option>
              <option value="title-desc">Title: Z to A</option>
              <option value="artist-asc">Artist: A to Z</option>
              <option value="duration">Shortest Duration</option>
            </select>
          </div>

          {/* Grid / List View Toggle */}
          <div className="flex items-center bg-surface-panel p-1 rounded-xl border border-surface-border">
            <button
              type="button"
              onClick={() => setViewMode('grid')}
              className={`p-1.5 rounded-lg transition-colors ${
                viewMode === 'grid' ? 'bg-brand-600 text-white shadow-sm' : 'text-slate-400 hover:text-white'
              }`}
              title="Grid View"
            >
              <Grid className="w-4 h-4" />
            </button>
            <button
              type="button"
              onClick={() => setViewMode('list')}
              className={`p-1.5 rounded-lg transition-colors ${
                viewMode === 'list' ? 'bg-brand-600 text-white shadow-sm' : 'text-slate-400 hover:text-white'
              }`}
              title="List View"
            >
              <List className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* 4. Filter Notice & Results Count */}
      <div className="flex items-center justify-between text-xs text-slate-400">
        <p>
          Showing <span className="font-bold text-white">{filteredAndSortedSongs.length}</span> track{filteredAndSortedSongs.length === 1 ? '' : 's'}
          {selectedGenre !== 'all' && (
            <span> in <span className="text-brand-300 font-bold capitalize">{selectedGenre}</span></span>
          )}
          {activeSearch && (
            <span> matching "<span className="text-white font-bold">{activeSearch}</span>"</span>
          )}
        </p>
      </div>

      {/* 5. Main Songs Grid / List Display */}
      {filteredAndSortedSongs.length > 0 ? (
        viewMode === 'grid' ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-4 xl:grid-cols-5 gap-3 sm:gap-4">
            {filteredAndSortedSongs.map((song, idx) => (
              <SongCard key={song.id} song={song} index={idx} playlist={filteredAndSortedSongs} />
            ))}
          </div>
        ) : (
          <div className="bg-surface-card rounded-3xl border border-surface-border p-3 space-y-1">
            {filteredAndSortedSongs.map((song, idx) => (
              <SongRow key={song.id} song={song} index={idx} playlist={filteredAndSortedSongs} />
            ))}
          </div>
        )
      ) : (
        /* Empty State */
        <EmptyState
          icon={FilterX}
          title="No Songs Found"
          description="We couldn't find any tracks matching your search or filters. Try searching for a different title, artist, or resetting active filters."
          actionText="Reset All Filters"
          onAction={handleResetFilters}
          actionIcon={RotateCcw}
        />
      )}
    </div>
  );
}
