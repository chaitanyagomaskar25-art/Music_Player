import React from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { Play, Disc, ArrowLeft, Clock, Music2 } from 'lucide-react';
import { albums, songs, artists } from '../data/musicData';
import { usePlayer } from '../hooks/usePlayer';
import { SongRow } from '../components/music/SongRow';
import { Button } from '../components/common/Button';

export function AlbumPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { playSong, allSongs } = usePlayer();

  const album = albums.find((a) => a.id === id) || albums[0];
  const catalog = allSongs || songs;
  const albumSongs = catalog.filter((s) => album.songIds.includes(s.id));
  const artist = artists.find((art) => art.id === album.artistId);

  return (
    <div className="space-y-8 max-w-7xl mx-auto pb-12 select-none animate-page-enter">
      {/* Back button */}
      <button
        type="button"
        onClick={() => navigate(-1)}
        className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-400 hover:text-white transition-colors"
      >
        <ArrowLeft className="w-4 h-4" />
        <span>Back</span>
      </button>

      {/* Album Header */}
      <div className="relative overflow-hidden flex flex-col md:flex-row items-center md:items-end gap-6 bg-surface-card p-6 sm:p-10 rounded-3xl border border-surface-border shadow-2xl">
        <div className="absolute top-0 right-0 w-80 h-80 bg-brand-pink/10 rounded-full blur-3xl pointer-events-none" />

        <img
          src={album.coverArt}
          alt={album.title}
          className="w-44 h-44 sm:w-56 sm:h-56 rounded-3xl object-cover shadow-2xl shrink-0 ring-2 ring-white/10"
        />

        <div className="space-y-3 flex-1 text-center md:text-left relative z-10">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-brand-500/20 text-brand-300 text-xs font-bold uppercase tracking-wider">
            <Disc className="w-3.5 h-3.5 text-brand-pink" />
            Studio Album
          </span>

          <h1 className="text-3xl sm:text-5xl font-black text-white tracking-tight">
            {album.title}
          </h1>

          <p className="text-sm sm:text-base text-slate-300">
            By{' '}
            {artist ? (
              <Link
                to={`/artist/${artist.id}`}
                className="text-brand-300 font-bold hover:underline"
              >
                {album.artist}
              </Link>
            ) : (
              <span className="text-white font-bold">{album.artist}</span>
            )}
            {' '}• {album.year}
          </p>

          <p className="text-xs text-slate-400 font-mono">
            {albumSongs.length} track{albumSongs.length === 1 ? '' : 's'} • Lossless Master Audio
          </p>

          <div className="pt-2">
            {albumSongs.length > 0 && (
              <Button
                onClick={() => playSong(albumSongs[0], albumSongs)}
                icon={Play}
                size="md"
                className="rounded-full px-8 bg-gradient-to-r from-brand-600 to-brand-pink shadow-glow-purple"
              >
                Play Album
              </Button>
            )}
          </div>
        </div>
      </div>

      {/* Tracklist */}
      <section className="space-y-4">
        <h2 className="text-xl font-bold text-white tracking-tight">
          Tracklist
        </h2>
        <div className="bg-surface-card rounded-3xl border border-surface-border p-3 space-y-1">
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
