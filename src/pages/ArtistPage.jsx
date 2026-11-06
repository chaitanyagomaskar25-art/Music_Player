import React, { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Play, CheckCircle2, Heart, Users, Disc, ArrowLeft, Share2 } from 'lucide-react';
import { artists, songs, albums } from '../data/musicData';
import { usePlayer } from '../hooks/usePlayer';
import { SongRow } from '../components/music/SongRow';
import { Button } from '../components/common/Button';
import { formatNumber } from '../utils/formatters';
import { getStorageItem, setStorageItem } from '../utils/storage';

export function ArtistPage() {
  const { id } = useParams();
  const { playSong, addToast, allSongs } = usePlayer();

  const artist = artists.find((a) => a.id === id) || artists[0];
  const catalog = allSongs || songs;
  const artistSongs = catalog.filter((s) => s.artistId === artist.id || s.artist.toLowerCase() === artist.name.toLowerCase());
  const artistAlbums = albums.filter((alb) => alb.artistId === artist.id);

  const [followedArtists, setFollowedArtists] = useState(() =>
    getStorageItem('melody_followed_artists', ['artist-1'])
  );

  const isFollowing = followedArtists.includes(artist.id);

  const handleFollowToggle = () => {
    setFollowedArtists((prev) => {
      const exists = prev.includes(artist.id);
      let updated;
      if (exists) {
        updated = prev.filter((aId) => aId !== artist.id);
        addToast(`Unfollowed ${artist.name}`, 'info');
      } else {
        updated = [...prev, artist.id];
        addToast(`Following ${artist.name}!`, 'success');
      }
      setStorageItem('melody_followed_artists', updated);
      return updated;
    });
  };

  return (
    <div className="space-y-8 max-w-7xl mx-auto pb-12 select-none animate-page-enter">
      {/* Back button */}
      <Link
        to={-1}
        className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-400 hover:text-white transition-colors"
      >
        <ArrowLeft className="w-4 h-4" />
        <span>Back</span>
      </Link>

      {/* Artist Hero Banner */}
      <div className="relative rounded-3xl overflow-hidden bg-gradient-to-r from-surface-charcoal via-brand-950/40 to-surface-card border border-brand-500/20 p-6 sm:p-10 shadow-2xl flex flex-col md:flex-row items-center gap-8">
        <div className="absolute top-0 right-1/4 w-80 h-80 bg-brand-600/15 rounded-full blur-3xl pointer-events-none" />

        <div className="w-40 h-40 sm:w-52 sm:h-52 rounded-full overflow-hidden shrink-0 shadow-2xl ring-4 ring-brand-500/40">
          <img
            src={artist.image}
            alt={artist.name}
            className="w-full h-full object-cover"
          />
        </div>

        <div className="space-y-3 text-center md:text-left flex-1 relative z-10">
          <div className="flex items-center justify-center md:justify-start gap-2">
            <span className="px-3 py-1 rounded-full bg-brand-500/20 text-brand-300 border border-brand-500/30 text-xs font-bold uppercase tracking-wider flex items-center gap-1.5">
              <CheckCircle2 className="w-3.5 h-3.5 text-brand-400" />
              Verified Artist
            </span>
          </div>

          <h1 className="text-3xl sm:text-5xl font-black text-white tracking-tight">
            {artist.name}
          </h1>

          <p className="text-xs sm:text-sm text-slate-300 max-w-xl leading-relaxed">
            {artist.bio}
          </p>

          <div className="flex flex-wrap items-center justify-center md:justify-start gap-4 text-xs font-mono text-slate-400 pt-1">
            <span className="flex items-center gap-1 text-slate-200 font-bold">
              <Users className="w-4 h-4 text-brand-400" />
              {formatNumber(artist.followers + (isFollowing ? 1 : 0))} Followers
            </span>
            <span>•</span>
            <span>{formatNumber(artist.monthlyListeners)} Monthly Listeners</span>
          </div>

          {/* Action buttons */}
          <div className="flex flex-wrap items-center justify-center md:justify-start gap-3 pt-3">
            {artistSongs.length > 0 && (
              <Button
                onClick={() => playSong(artistSongs[0], artistSongs)}
                icon={Play}
                size="md"
                className="rounded-full px-8 bg-gradient-to-r from-brand-600 to-brand-pink shadow-glow-purple"
              >
                Play Artist
              </Button>
            )}

            <button
              type="button"
              onClick={handleFollowToggle}
              className={`px-6 py-2.5 rounded-full text-xs font-bold border transition-all ${
                isFollowing
                  ? 'bg-white/10 text-brand-300 border-brand-500/50'
                  : 'bg-surface-panel hover:bg-surface-hover text-white border-surface-border'
              }`}
            >
              {isFollowing ? 'Following' : 'Follow'}
            </button>
          </div>
        </div>
      </div>

      {/* Popular Tracks */}
      <section className="space-y-4">
        <h2 className="text-xl font-bold text-white tracking-tight">
          Popular Releases
        </h2>
        <div className="bg-surface-card rounded-3xl border border-surface-border p-3 space-y-1">
          {artistSongs.map((song, idx) => (
            <SongRow key={song.id} song={song} index={idx} playlist={artistSongs} />
          ))}
          {artistSongs.length === 0 && (
            <div className="p-8 text-center text-slate-400 text-sm">
              No tracks cataloged yet for this artist.
            </div>
          )}
        </div>
      </section>

      {/* Albums Discography */}
      {artistAlbums.length > 0 && (
        <section className="space-y-4">
          <h2 className="text-xl font-bold text-white tracking-tight flex items-center gap-2">
            <Disc className="w-5 h-5 text-brand-pink" />
            Albums & Discography
          </h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
            {artistAlbums.map((alb) => (
              <Link
                key={alb.id}
                to={`/album/${alb.id}`}
                className="group flex flex-col p-3.5 bg-surface-card hover:bg-surface-hover border border-surface-border hover:border-brand-500/30 rounded-3xl transition-all shadow-subtle hover:-translate-y-1"
              >
                <div className="relative aspect-square w-full rounded-2xl overflow-hidden mb-3 shadow-md bg-surface-panel">
                  <img
                    src={alb.coverArt}
                    alt={alb.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                </div>
                <h4 className="font-bold text-sm text-slate-100 group-hover:text-brand-300 transition-colors truncate">
                  {alb.title}
                </h4>
                <p className="text-xs text-slate-400 mt-0.5 font-mono">
                  {alb.year} • {alb.songIds.length} tracks
                </p>
              </Link>
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
