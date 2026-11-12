import React, { useState, useMemo } from 'react';
import { useOutletContext, useNavigate, Link } from 'react-router-dom';
import {
  Play,
  Flame,
  Clock,
  Sparkles,
  Disc,
  Users,
  ChevronRight,
  TrendingUp,
  Headphones,
  Search,
  FilterX,
  CheckCircle2,
  Folder,
} from 'lucide-react';
import { songs, playlists, artists, albums } from '../data/musicData';
import { usePlayer } from '../hooks/usePlayer';
import { SongRow } from '../components/music/SongRow';
import { SongCard } from '../components/music/SongCard';
import { Button } from '../components/common/Button';
import { EmptyState } from '../components/common/EmptyState';
import { PlaylistCard } from '../components/music/PlaylistCard';
import { formatNumber } from '../utils/formatters';

export function HomePage() {
  const { searchQuery = '' } = useOutletContext() || {};
  const { playSong, isPlaying, currentSong, allSongs } = usePlayer();
  const navigate = useNavigate();

  const [searchCategory, setSearchCategory] = useState('all'); // 'all' | 'tracks' | 'artists' | 'albums'

  // Dynamic time-of-day greeting
  const greeting = useMemo(() => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good morning';
    if (hour < 18) return 'Good afternoon';
    return 'Good evening';
  }, []);

  // Filter songs based on search if active (including imported local tracks)
  const songCatalog = allSongs || songs;
  const filteredSongs = useMemo(() => {
    if (!searchQuery.trim()) return songCatalog;
    const q = searchQuery.toLowerCase().trim();
    return songCatalog.filter(
      (s) =>
        s.title.toLowerCase().includes(q) ||
        s.artist.toLowerCase().includes(q) ||
        s.album.toLowerCase().includes(q) ||
        s.genre.toLowerCase().includes(q)
    );
  }, [searchQuery, songCatalog]);

  // Matching artists if searching
  const filteredArtists = useMemo(() => {
    if (!searchQuery.trim()) return artists;
    const q = searchQuery.toLowerCase().trim();
    return artists.filter(
      (a) =>
        a.name.toLowerCase().includes(q) ||
        a.genres.some((g) => g.toLowerCase().includes(q))
    );
  }, [searchQuery]);

  // Matching albums if searching
  const filteredAlbums = useMemo(() => {
    if (!searchQuery.trim()) return albums;
    const q = searchQuery.toLowerCase().trim();
    return albums.filter(
      (alb) =>
        alb.title.toLowerCase().includes(q) ||
        alb.artist.toLowerCase().includes(q) ||
        (alb.genre && alb.genre.toLowerCase().includes(q))
    );
  }, [searchQuery]);

  const hasAnyResults = filteredSongs.length > 0 || filteredArtists.length > 0 || filteredAlbums.length > 0;

  const featuredSong = songs[12] || songs[0]; // Midnight Echoes / Summer Dreams
  const recentlyPlayedSongs = songs.slice(0, 4);
  const trendingSongs = useMemo(() => [...songs].sort((a, b) => b.plays - a.plays).slice(0, 5), []);
  const recommendedPlaylists = playlists;

  return (
    <div className="space-y-10 max-w-7xl mx-auto pb-12 select-none animate-page-enter">
      {/* 1. Welcome Heading & Quick Status */}
      <section className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1.5">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-brand-500/10 border border-brand-500/20 text-brand-600 dark:text-brand-300 text-xs font-semibold">
              <Sparkles className="w-3.5 h-3.5 text-brand-pink" />
              Melody Daily Curations
            </span>
          </div>
          <h1 className="text-2xl sm:text-4xl font-black text-slate-900 dark:text-white tracking-tight">
            {greeting}, <span className="bg-gradient-to-r from-brand-600 via-brand-500 to-brand-pink dark:from-brand-300 dark:via-white dark:to-brand-pink bg-clip-text text-transparent">Alex</span>
          </h1>
          <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 mt-1">
            Pick up where you left off or discover handpicked audio gems across 28 tracks.
          </p>
        </div>

        {/* Quick Audio Vibe Chips */}
        <div className="hidden lg:flex items-center gap-2">
          {['Pop', 'Hip-Hop', 'Rock', 'Electronic', 'Jazz', 'Lo-Fi'].map((genre) => (
            <button
              key={genre}
              type="button"
              onClick={() => navigate(`/explore?genre=${genre.toLowerCase()}`)}
              className="px-3 py-1.5 rounded-xl bg-surface-card hover:bg-surface-hover border border-surface-border text-xs font-medium text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white transition-all shadow-subtle hover:border-brand-500/40"
            >
              {genre}
            </button>
          ))}
        </div>
      </section>

      {/* 2. Featured Music Banner (Only shown if search isn't active) */}
      {!searchQuery && (
        <section className="relative rounded-3xl overflow-hidden bg-gradient-to-r from-white via-purple-50/70 to-pink-50/50 dark:from-surface-charcoal dark:via-brand-950/40 dark:to-surface-card border border-purple-200/80 dark:border-brand-500/20 shadow-xl shadow-purple-500/5 dark:shadow-2xl p-4 sm:p-8 md:p-10 group transition-all duration-300">
          <div className="absolute top-0 right-10 w-96 h-96 bg-brand-500/10 dark:bg-brand-600/15 rounded-full blur-3xl pointer-events-none group-hover:bg-brand-500/20 dark:group-hover:bg-brand-600/25 transition-all duration-700" />
          <div className="absolute -bottom-10 left-1/3 w-80 h-80 bg-brand-pink/10 rounded-full blur-3xl pointer-events-none" />

          <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-6 sm:gap-8">
            <div className="max-w-xl space-y-4">
              <div className="flex items-center gap-2">
                <span className="px-3 py-1 rounded-full bg-brand-100/90 text-brand-700 border border-brand-200/80 dark:bg-brand-500/20 dark:text-brand-300 dark:border-brand-500/30 text-xs font-bold uppercase tracking-wider">
                  Featured Album Spotlight
                </span>
                <span className="text-xs text-brand-pink font-semibold">
                  {featuredSong.genre}
                </span>
              </div>

              <div className="space-y-1.5">
                <h2 className="text-2xl sm:text-4xl md:text-5xl font-black text-slate-900 dark:text-white tracking-tight leading-none drop-shadow-sm dark:drop-shadow-md">
                  {featuredSong.title}
                </h2>
                <p className="text-base sm:text-lg text-slate-600 dark:text-slate-300 font-medium">
                  By <span className="text-slate-900 dark:text-white font-bold">{featuredSong.artist}</span> •{' '}
                  <span className="text-slate-500 dark:text-slate-400">{featuredSong.album}</span>
                </p>
              </div>

              <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 leading-relaxed line-clamp-2 max-w-lg">
                Experience high-fidelity spatial textures, ethereal arpeggios, and resonant beats meticulously mixed in 24-bit studio quality.
              </p>

              <div className="flex flex-wrap items-center gap-3 sm:gap-4 pt-2">
                <Button
                  onClick={() => playSong(featuredSong, songs)}
                  icon={Play}
                  size="lg"
                  className="rounded-full px-7 sm:px-8 bg-gradient-to-r from-brand-600 via-brand-500 to-brand-pink shadow-glow-purple hover:scale-105 active:scale-95 transition-all text-white-force"
                >
                  {currentSong?.id === featuredSong.id && isPlaying ? 'Now Playing' : 'Play Featured'}
                </Button>
                <div className="flex items-center gap-2 text-xs text-slate-600 dark:text-slate-400 font-mono bg-slate-100/80 dark:bg-white/5 px-3 py-2 rounded-xl border border-slate-200/80 dark:border-white/5">
                  <Headphones className="w-3.5 h-3.5 text-brand-500 dark:text-brand-400" />
                  <span>{formatNumber(featuredSong.plays)} streams</span>
                </div>
              </div>
            </div>

            {/* Hero Artwork with Glowing Vinyl Frame */}
            <div className="shrink-0 relative group/art mx-auto md:mx-0">
              <div className="w-48 h-48 sm:w-56 sm:h-56 md:w-64 md:h-64 rounded-3xl overflow-hidden shadow-2xl ring-2 ring-brand-400/30 dark:ring-brand-500/30 group-hover/art:scale-105 group-hover/art:ring-brand-500/60 transition-all duration-500 relative">
                <img
                  src={featuredSong.coverArt}
                  alt={featuredSong.title}
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent pointer-events-none" />
                <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between text-xs text-white-force font-medium">
                  <span className="px-2 py-0.5 rounded-md bg-black/60 backdrop-blur-md text-white-force">
                    24-bit Lossless
                  </span>
                  <span className="font-mono text-[11px] text-white-force opacity-90">
                    2024
                  </span>
                </div>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* 3. Real-Time Dynamic Search Results Section */}
      {searchQuery && (
        <section className="space-y-6 animate-in fade-in duration-150">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-2 border-b border-surface-border">
            <div>
              <h2 className="text-xl sm:text-2xl font-bold text-white flex items-center gap-2">
                <Search className="w-5 h-5 text-brand-400" />
                Results for "<span className="text-brand-pink">{searchQuery}</span>"
              </h2>
              <p className="text-xs text-slate-400 mt-0.5">
                Found {filteredSongs.length} track{filteredSongs.length === 1 ? '' : 's'}, {filteredArtists.length} artist{filteredArtists.length === 1 ? '' : 's'}, {filteredAlbums.length} album{filteredAlbums.length === 1 ? '' : 's'}
              </p>
            </div>

            {/* Category filter tabs */}
            <div className="flex items-center gap-1.5 bg-surface-card p-1 rounded-2xl border border-surface-border self-start sm:self-auto text-xs font-semibold overflow-x-auto max-w-full scrollbar-none">
              {[
                { id: 'all', label: 'All' },
                { id: 'tracks', label: `Tracks (${filteredSongs.length})` },
                { id: 'artists', label: `Artists (${filteredArtists.length})` },
                { id: 'albums', label: `Albums (${filteredAlbums.length})` },
              ].map((tab) => (
                <button
                  key={tab.id}
                  type="button"
                  onClick={() => setSearchCategory(tab.id)}
                  className={`px-3 py-1.5 rounded-xl transition-all ${
                    searchCategory === tab.id
                      ? 'bg-brand-600 text-white shadow-glow-purple font-bold'
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>
          </div>

          {/* If results exist */}
          {hasAnyResults ? (
            <div className="space-y-8">
              {/* Matched Tracks */}
              {(searchCategory === 'all' || searchCategory === 'tracks') && filteredSongs.length > 0 && (
                <div className="space-y-3">
                  <h3 className="text-sm font-bold uppercase tracking-wider text-slate-300">
                    Matching Songs
                  </h3>
                  <div className="bg-surface-card rounded-3xl border border-surface-border p-3 space-y-1">
                    {filteredSongs.slice(0, searchCategory === 'all' ? 6 : 50).map((song, idx) => (
                      <SongRow key={song.id} song={song} index={idx} playlist={filteredSongs} />
                    ))}
                  </div>
                </div>
              )}

              {/* Matched Artists */}
              {(searchCategory === 'all' || searchCategory === 'artists') && filteredArtists.length > 0 && (
                <div className="space-y-3">
                  <h3 className="text-sm font-bold uppercase tracking-wider text-slate-300">
                    Matching Artists
                  </h3>
                  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4">
                    {filteredArtists.map((artist) => (
                      <Link
                        key={artist.id}
                        to={`/artist/${artist.id}`}
                        className="group flex flex-col items-center text-center p-4 bg-surface-card hover:bg-surface-hover border border-surface-border hover:border-brand-500/30 rounded-3xl transition-all shadow-subtle hover:-translate-y-1"
                      >
                        <div className="w-20 h-20 rounded-full overflow-hidden mb-3 ring-2 ring-transparent group-hover:ring-brand-500 transition-all">
                          <img
                            src={artist.image}
                            alt={artist.name}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                          />
                        </div>
                        <h4 className="font-bold text-sm text-slate-100 group-hover:text-brand-300 truncate w-full">
                          {artist.name}
                        </h4>
                        <p className="text-[11px] text-slate-400 mt-0.5">
                          {formatNumber(artist.followers)} followers
                        </p>
                      </Link>
                    ))}
                  </div>
                </div>
              )}

              {/* Matched Albums */}
              {(searchCategory === 'all' || searchCategory === 'albums') && filteredAlbums.length > 0 && (
                <div className="space-y-3">
                  <h3 className="text-sm font-bold uppercase tracking-wider text-slate-300">
                    Matching Albums
                  </h3>
                  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4">
                    {filteredAlbums.map((alb) => (
                      <Link
                        key={alb.id}
                        to={`/album/${alb.id}`}
                        className="group flex flex-col p-3.5 bg-surface-card hover:bg-surface-hover border border-surface-border hover:border-brand-500/30 rounded-3xl transition-all shadow-subtle hover:-translate-y-1"
                      >
                        <div className="relative aspect-square w-full rounded-2xl overflow-hidden mb-3 shadow-md bg-surface-panel">
                          <img
                            src={alb.coverArt}
                            alt={alb.title}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                          />
                        </div>
                        <h4 className="font-bold text-sm text-slate-100 group-hover:text-brand-300 truncate">
                          {alb.title}
                        </h4>
                        <p className="text-xs text-slate-400 mt-0.5">
                          {alb.artist} • {alb.year}
                        </p>
                      </Link>
                    ))}
                  </div>
                </div>
              )}
            </div>
          ) : (
            /* Search Empty State */
            <EmptyState
              icon={FilterX}
              title={`No Results for "${searchQuery}"`}
              description="Please check for spelling errors, try searching by artist name, album, or browse by genre like Pop, Hip-Hop, or Jazz."
              actionText="Browse Explore Catalog"
              onAction={() => navigate('/explore')}
            />
          )}
        </section>
      )}

      {/* 4. Recently Played Section */}
      {!searchQuery && (
        <section className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Clock className="w-5 h-5 text-brand-400" />
              <h2 className="text-lg sm:text-xl font-bold text-white tracking-tight">
                Recently Played
              </h2>
            </div>
            <button
              type="button"
              onClick={() => navigate('/library?tab=recent')}
              className="text-xs font-semibold text-slate-400 hover:text-white flex items-center gap-1 transition-colors"
            >
              <span>See all</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5">
            {recentlyPlayedSongs.map((song) => {
              const isCurrent = currentSong?.id === song.id;
              return (
                <div
                  key={song.id}
                  onClick={() => playSong(song, recentlyPlayedSongs)}
                  className={`group relative flex items-center gap-3.5 p-2.5 rounded-2xl cursor-pointer transition-all duration-200 border ${
                    isCurrent
                      ? 'bg-brand-500/15 border-brand-500/40 shadow-glow-purple'
                      : 'bg-surface-card hover:bg-surface-hover border-surface-border'
                  }`}
                >
                  <img
                    src={song.coverArt}
                    alt={song.title}
                    className="w-14 h-14 rounded-xl object-cover shadow-md shrink-0 group-hover:brightness-90 transition-all"
                  />
                  <div className="min-w-0 flex-1 pr-1">
                    <h4 className={`font-bold text-xs sm:text-sm truncate ${isCurrent ? 'text-brand-300' : 'text-slate-100'}`}>
                      {song.title}
                    </h4>
                    <p className="text-[11px] text-slate-400 truncate mt-0.5">
                      {song.artist}
                    </p>
                  </div>
                  <div className="w-9 h-9 rounded-full bg-brand-500 text-white flex items-center justify-center opacity-0 group-hover:opacity-100 scale-90 group-hover:scale-100 transition-all shadow-md shrink-0">
                    <Play className="w-4 h-4 fill-current ml-0.5" />
                  </div>
                </div>
              );
            })}
          </div>
        </section>
      )}

      {/* 5. Trending Songs Section */}
      {!searchQuery && (
        <section className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Flame className="w-5 h-5 text-orange-400" />
              <h2 className="text-lg sm:text-xl font-bold text-white tracking-tight">
                Trending Worldwide
              </h2>
            </div>
            <button
              type="button"
              onClick={() => navigate('/explore')}
              className="text-xs font-semibold text-slate-400 hover:text-white flex items-center gap-1 transition-colors"
            >
              <span>Explore Top Chart</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="bg-surface-card rounded-3xl border border-surface-border p-2 md:p-3 shadow-subtle space-y-1">
            {trendingSongs.map((song, idx) => (
              <SongRow key={song.id} song={song} index={idx} playlist={trendingSongs} />
            ))}
          </div>
        </section>
      )}

      {/* 6. Popular Artists Section */}
      {!searchQuery && (
        <section className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Users className="w-5 h-5 text-cyan-400" />
              <h2 className="text-lg sm:text-xl font-bold text-white tracking-tight">
                Popular Artists
              </h2>
            </div>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-7 gap-3 sm:gap-3.5">
            {artists.map((artist) => (
              <Link
                key={artist.id}
                to={`/artist/${artist.id}`}
                className="group flex flex-col items-center text-center p-3.5 bg-surface-card hover:bg-surface-hover border border-surface-border hover:border-brand-500/30 rounded-3xl transition-all duration-300 cursor-pointer shadow-subtle hover:-translate-y-1"
              >
                <div className="relative w-20 h-20 sm:w-24 sm:h-24 rounded-full overflow-hidden mb-3 ring-2 ring-transparent group-hover:ring-brand-500 shadow-xl transition-all duration-300">
                  <img
                    src={artist.image}
                    alt={artist.name}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                  />
                </div>
                <div className="flex items-center gap-1 w-full justify-center">
                  <h4 className="font-bold text-xs sm:text-sm text-slate-100 group-hover:text-brand-300 transition-colors truncate">
                    {artist.name}
                  </h4>
                  <CheckCircle2 className="w-3 h-3 text-brand-400 shrink-0" />
                </div>
                <p className="text-[10px] text-slate-400 mt-0.5">
                  {formatNumber(artist.followers)} fans
                </p>
                <span className="text-[9px] text-brand-pink/90 font-bold mt-1">
                  {artist.genres[0]}
                </span>
              </Link>
            ))}
          </div>
        </section>
      )}

      {/* 7. Recommended Playlists Section */}
      {!searchQuery && (
        <section className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Disc className="w-5 h-5 text-brand-pink" />
              <h2 className="text-lg sm:text-xl font-bold text-slate-900 dark:text-white tracking-tight">
                Recommended Playlists
              </h2>
            </div>
            <button
              type="button"
              onClick={() => navigate('/library')}
              className="text-xs font-semibold text-slate-600 dark:text-slate-400 hover:text-slate-950 dark:hover:text-white flex items-center gap-1 transition-colors"
            >
              <span>View all</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {recommendedPlaylists.map((pl) => {
              const plSongs = songs.filter((s) => pl.songIds.includes(s.id));
              return (
                <PlaylistCard
                  key={pl.id}
                  playlist={pl}
                  badge={pl.genre || 'Curated Station'}
                  imageClassName="w-20 h-20"
                  onClick={() => plSongs.length > 0 && playSong(plSongs[0], plSongs)}
                />
              );
            })}
          </div>
        </section>
      )}
    </div>
  );
}
