import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { Play, Disc, Clock, Music2 } from 'lucide-react';
import { albums, songs, artists } from '../data/musicData';
import { usePlayer } from '../hooks/usePlayer';
import { SongRow } from '../components/music/SongRow';
import { Button } from '../components/common/Button';
import { BackButton } from '../components/common/BackButton';

export function AlbumPage() {
  const { id } = useParams();
  const { playSong, allSongs } = usePlayer();

  const album = albums.find((a) => a.id === id) || albums[0];
  const catalog = allSongs || songs;
  const albumSongs = catalog.filter((s) => album.songIds.includes(s.id));
  const artist = artists.find((art) => art.id === album.artistId);

  return (
    <div className="space-y-6 sm:space-y-8 max-w-7xl mx-auto pb-12 select-none animate-page-enter">
      {/* Back button */}
      <BackButton />

      {/* Album Header */}
      <div className="relative overflow-hidden flex flex-col md:flex-row items-center md:items-end gap-5 sm:gap-6 bg-gradient-to-r from-white via-purple-50/70 to-pink-50/50 dark:from-surface-charcoal dark:via-brand-950/40 dark:to-surface-card p-4 sm:p-8 md:p-10 rounded-3xl border border-purple-200/80 dark:border-brand-500/20 shadow-xl shadow-purple-500/5 dark:shadow-2xl">
        <div className="absolute top-0 right-0 w-80 h-80 bg-brand-pink/10 rounded-full blur-3xl pointer-events-none" />

        <img
          src={album.coverArt}
          alt={album.title}
          className="w-36 h-36 sm:w-48 sm:h-48 md:w-56 md:h-56 rounded-3xl object-cover shadow-2xl shrink-0 ring-2 ring-brand-400/30 dark:ring-white/10"
        />

        <div className="space-y-2.5 sm:space-y-3 flex-1 text-center md:text-left relative z-10 w-full min-w-0">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-brand-100/90 dark:bg-brand-500/20 text-brand-700 dark:text-brand-300 border border-brand-200/80 dark:border-brand-500/30 text-xs font-bold uppercase tracking-wider">
            <Disc className="w-3.5 h-3.5 text-brand-pink" />
            Studio Album
          </span>

          <h1 className="text-2xl sm:text-4xl md:text-5xl font-black text-slate-900 dark:text-white tracking-tight truncate">
            {album.title}
          </h1>

          <p className="text-sm sm:text-base text-slate-700 dark:text-slate-300 font-medium">
            By{' '}
            {artist ? (
              <Link
                to={`/artist/${artist.id}`}
                className="text-brand-600 dark:text-brand-300 font-bold hover:underline"
              >
                {album.artist}
              </Link>
            ) : (
              <span className="text-slate-900 dark:text-white font-bold">{album.artist}</span>
            )}
            {' '}• {album.year}
          </p>

          <p className="text-xs text-slate-500 dark:text-slate-400 font-mono font-medium">
            {albumSongs.length} track{albumSongs.length === 1 ? '' : 's'} • 24-Bit Lossless Master
          </p>

          <div className="pt-2">
            {albumSongs.length > 0 && (
              <Button
                onClick={() => playSong(albumSongs[0], albumSongs)}
                icon={Play}
                size="md"
                className="rounded-full px-8 bg-gradient-to-r from-brand-600 via-brand-500 to-brand-pink shadow-glow-purple text-white-force"
              >
                Play Album
              </Button>
            )}
          </div>
        </div>
      </div>

      {/* Tracklist */}
      <section className="space-y-4">
        <h2 className="text-xl font-bold text-slate-900 dark:text-white tracking-tight">
          Tracklist
        </h2>
        <div className="bg-white dark:bg-surface-card rounded-3xl border border-slate-200 dark:border-surface-border p-2 sm:p-3 space-y-1 shadow-sm">
          {albumSongs.map((song, idx) => (
            <SongRow key={song.id} song={song} index={idx} playlist={albumSongs} />
          ))}
          {albumSongs.length === 0 && (
            <div className="p-12 text-center text-slate-400 text-sm">
              No tracks found in this album.
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
