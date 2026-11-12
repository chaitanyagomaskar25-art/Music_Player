import React from 'react';
import {
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
import { Modal } from './Modal';

export function SongDetailsModal({ isOpen, onClose, song }) {
  const { playSong, addToQueue, isFavorite, toggleFavorite } = usePlayer() || {};

  if (!song) return null;

  const favorited = isFavorite ? isFavorite(song.id) : false;

  return (
    <Modal
      isOpen={isOpen && !!song}
      onClose={onClose}
      title="Track Information"
      subtitle="Audio metadata and technical specs"
      icon={FileAudio}
      maxWidth="max-w-lg"
      footer={
        <div className="flex items-center gap-2 w-full">
          <Button
            onClick={() => {
              if (playSong) playSong(song);
              onClose();
            }}
            variant="primary"
            size="sm"
            icon={Play}
            className="flex-1 rounded-2xl text-xs font-bold bg-gradient-to-r from-brand-600 to-brand-pink shadow-glow-purple text-white-force"
          >
            Play Now
          </Button>

          <button
            type="button"
            onClick={() => {
              if (addToQueue) addToQueue(song);
              onClose();
            }}
            className="px-4 py-2 rounded-2xl text-xs font-bold bg-white hover:bg-slate-100 dark:bg-surface-card dark:hover:bg-surface-hover border border-purple-200/80 dark:border-surface-border text-slate-800 dark:text-slate-200 flex items-center gap-1.5 transition-colors shadow-xs"
          >
            <ListPlus className="w-4 h-4 text-cyan-600 dark:text-cyan-400" />
            <span>Queue</span>
          </button>

          <button
            type="button"
            onClick={() => toggleFavorite && toggleFavorite(song.id)}
            className="p-2.5 rounded-2xl bg-white hover:bg-slate-100 dark:bg-surface-card dark:hover:bg-surface-hover border border-purple-200/80 dark:border-surface-border text-slate-600 hover:text-slate-900 dark:text-slate-300 dark:hover:text-white transition-colors shadow-xs"
            title={favorited ? 'Liked' : 'Like'}
          >
            <Heart className={`w-4 h-4 ${favorited ? 'fill-brand-pink text-brand-pink' : 'text-slate-400'}`} />
          </button>
        </div>
      }
    >
      <div className="space-y-5 mt-3">
        {/* Artwork & Main Meta */}
        <div className="flex items-center gap-4">
          <img
            src={song.coverArt}
            alt={song.title}
            className="w-24 h-24 rounded-2xl object-cover shadow-2xl ring-2 ring-brand-400/50 dark:ring-brand-500/30 shrink-0"
          />
          <div className="min-w-0 flex-1">
            <span className="inline-block px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold bg-brand-100 text-brand-700 border border-brand-200 dark:bg-brand-500/20 dark:text-brand-300 dark:border-brand-500/30 uppercase tracking-wider mb-1">
              {song.genre || 'General'}
            </span>
            <h2 className="text-lg font-black text-slate-900 dark:text-white truncate">{song.title}</h2>
            <p className="text-sm text-slate-700 dark:text-slate-300 truncate mt-0.5 font-semibold">{song.artist}</p>
            <p className="text-xs text-slate-500 dark:text-slate-400 truncate mt-0.5">{song.album}</p>
          </div>
        </div>

        {/* Detailed Metadata Grid */}
        <div className="grid grid-cols-2 gap-3 bg-slate-50 dark:bg-surface-card p-4 rounded-2xl border border-purple-100 dark:border-surface-border text-xs">
          <div className="space-y-1">
            <span className="text-[10px] uppercase font-mono text-slate-500 dark:text-slate-400 font-bold">Duration</span>
            <p className="font-bold text-slate-800 dark:text-slate-200 flex items-center gap-1.5 font-mono">
              <Clock className="w-3.5 h-3.5 text-cyan-600 dark:text-cyan-400" />
              <span>{formatTime(song.duration)}</span>
            </p>
          </div>

          <div className="space-y-1">
            <span className="text-[10px] uppercase font-mono text-slate-500 dark:text-slate-400 font-bold">Audio Format</span>
            <p className="font-bold text-slate-800 dark:text-slate-200 flex items-center gap-1.5 font-mono">
              <Disc className="w-3.5 h-3.5 text-brand-pink" />
              <span>{song.fileFormat || 'MP3'} • 320 kbps</span>
            </p>
          </div>

          <div className="space-y-1">
            <span className="text-[10px] uppercase font-mono text-slate-500 dark:text-slate-400 font-bold">Source Type</span>
            <p className="font-bold text-slate-800 dark:text-slate-200 flex items-center gap-1.5 truncate">
              {song.isLocal ? (
                <>
                  <HardDrive className="w-3.5 h-3.5 text-cyan-600 dark:text-cyan-400 shrink-0" />
                  <span className="truncate">Local ({song.fileSize || 'In-Memory'})</span>
                </>
              ) : (
                <>
                  <Radio className="w-3.5 h-3.5 text-purple-600 dark:text-purple-400 shrink-0" />
                  <span>Royalty-Free Stream</span>
                </>
              )}
            </p>
          </div>

          <div className="space-y-1">
            <span className="text-[10px] uppercase font-mono text-slate-500 dark:text-slate-400 font-bold">Streams / Popularity</span>
            <p className="font-bold text-slate-800 dark:text-slate-200 flex items-center gap-1.5 font-mono">
              <Sparkles className="w-3.5 h-3.5 text-amber-500 dark:text-amber-400" />
              <span>{song.plays ? `${formatNumber(song.plays)} plays` : 'Device Local'}</span>
            </p>
          </div>
        </div>
      </div>
    </Modal>
  );
}
