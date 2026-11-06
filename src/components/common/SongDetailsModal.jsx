import React from 'react';
import {
  X,
  Music,
  Disc,
  Radio,
  Clock,
  Sparkles,
  Heart,
  Play,
  ListPlus,
  HardDrive,
  FileAudio,
} from 'lucide-react';
import { formatTime, formatNumber } from '../../utils/formatters';
import { usePlayer } from '../../hooks/usePlayer';
import { Button } from './Button';

export function SongDetailsModal({ isOpen, onClose, song }) {
  const { playSong, addToQueue, isFavorite, toggleFavorite } = usePlayer() || {};

  if (!isOpen || !song) return null;

  const favorited = isFavorite ? isFavorite(song.id) : false;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 select-none animate-in fade-in duration-150">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/80 backdrop-blur-md"
        onClick={onClose}
      />

      {/* Modal Card */}
      <div className="relative w-full max-w-lg bg-surface-charcoal border border-surface-border rounded-3xl p-6 shadow-2xl z-10 animate-in zoom-in-95 duration-200 flex flex-col space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-surface-border">
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-xl bg-brand-500/20 text-brand-300">
              <FileAudio className="w-5 h-5 text-brand-400" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white">Track Information</h3>
              <p className="text-[11px] text-slate-400">Audio metadata and technical specs</p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-xl text-slate-400 hover:text-white hover:bg-white/10 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Artwork & Main Meta */}
        <div className="flex items-center gap-4">
          <img
            src={song.coverArt}
            alt={song.title}
            className="w-24 h-24 rounded-2xl object-cover shadow-2xl ring-2 ring-brand-500/30 shrink-0"
          />
          <div className="min-w-0 flex-1">
            <span className="inline-block px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold bg-brand-500/20 text-brand-300 border border-brand-500/30 uppercase tracking-wider mb-1">
              {song.genre || 'General'}
            </span>
            <h2 className="text-lg font-black text-white truncate">{song.title}</h2>
            <p className="text-sm text-slate-300 truncate mt-0.5 font-semibold">{song.artist}</p>
            <p className="text-xs text-slate-400 truncate mt-0.5">{song.album}</p>
          </div>
        </div>

        {/* Detailed Metadata Grid */}
        <div className="grid grid-cols-2 gap-3 bg-surface-card p-4 rounded-2xl border border-surface-border text-xs">
          <div className="space-y-1">
            <span className="text-[10px] uppercase font-mono text-slate-400">Duration</span>
            <p className="font-bold text-slate-200 flex items-center gap-1.5 font-mono">
              <Clock className="w-3.5 h-3.5 text-cyan-400" />
              <span>{formatTime(song.duration)}</span>
            </p>
          </div>

          <div className="space-y-1">
            <span className="text-[10px] uppercase font-mono text-slate-400">Audio Format</span>
            <p className="font-bold text-slate-200 flex items-center gap-1.5 font-mono">
              <Disc className="w-3.5 h-3.5 text-brand-pink" />
              <span>{song.fileFormat || 'MP3'} • 320 kbps</span>
            </p>
          </div>

          <div className="space-y-1">
            <span className="text-[10px] uppercase font-mono text-slate-400">Source Type</span>
            <p className="font-bold text-slate-200 flex items-center gap-1.5 truncate">
              {song.isLocal ? (
                <>
                  <HardDrive className="w-3.5 h-3.5 text-cyan-400 shrink-0" />
                  <span className="truncate">Local ({song.fileSize || 'In-Memory'})</span>
                </>
              ) : (
                <>
                  <Radio className="w-3.5 h-3.5 text-purple-400 shrink-0" />
                  <span>Royalty-Free Stream</span>
                </>
              )}
            </p>
          </div>

          <div className="space-y-1">
            <span className="text-[10px] uppercase font-mono text-slate-400">Streams / Popularity</span>
            <p className="font-bold text-slate-200 flex items-center gap-1.5 font-mono">
              <Sparkles className="w-3.5 h-3.5 text-amber-400" />
              <span>{song.plays ? `${formatNumber(song.plays)} plays` : 'Device Local'}</span>
            </p>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-2 pt-2">
          <Button
            onClick={() => {
              if (playSong) playSong(song);
              onClose();
            }}
            variant="primary"
            size="sm"
            icon={Play}
            className="flex-1 rounded-2xl text-xs font-bold bg-gradient-to-r from-brand-600 to-brand-pink shadow-glow-purple"
          >
            Play Now
          </Button>

          <Button
            onClick={() => {
              if (addToQueue) addToQueue(song);
              onClose();
            }}
            variant="secondary"
            size="sm"
            icon={ListPlus}
            className="rounded-2xl text-xs font-semibold px-4"
          >
            Queue
          </Button>

          <button
            type="button"
            onClick={() => toggleFavorite && toggleFavorite(song.id)}
            className="p-2.5 rounded-2xl bg-surface-card hover:bg-surface-hover border border-surface-border text-slate-300 hover:text-white transition-colors"
            title={favorited ? 'Liked' : 'Like'}
          >
            <Heart className={`w-4 h-4 ${favorited ? 'fill-brand-pink text-brand-pink' : 'text-slate-400'}`} />
          </button>
        </div>
      </div>
    </div>
  );
}
