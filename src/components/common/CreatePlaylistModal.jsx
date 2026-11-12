import React, { useState } from 'react';
import { FolderPlus, Image, Sparkles, Check } from 'lucide-react';
import { usePlayer, PRESET_PLAYLIST_COVERS } from '../../context/PlayerContext';
import { Button } from './Button';
import { Modal } from './Modal';

export function CreatePlaylistModal({ isOpen, onClose }) {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [selectedCover, setSelectedCover] = useState(PRESET_PLAYLIST_COVERS[0].url);
  const [customCoverUrl, setCustomCoverUrl] = useState('');
  const [useCustomUrl, setUseCustomUrl] = useState(false);

  const { createPlaylist } = usePlayer();

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!title.trim()) return;

    const cover = useCustomUrl && customCoverUrl.trim() ? customCoverUrl.trim() : selectedCover;
    createPlaylist(title, description, cover);
    setTitle('');
    setDescription('');
    setCustomCoverUrl('');
    setUseCustomUrl(false);
    onClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Create New Playlist"
      subtitle="Add details and choose artwork for your mix"
      icon={FolderPlus}
      maxWidth="max-w-lg"
    >
      <form onSubmit={handleSubmit} className="mt-4 space-y-4">
        <div>
          <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
            Playlist Name <span className="text-brand-pink">*</span>
          </label>
          <input
            type="text"
            required
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="e.g. Late Night Beats, Summer Hits"
            className="w-full bg-slate-50 dark:bg-surface-card border border-purple-200/80 dark:border-surface-border rounded-xl px-4 py-2.5 text-xs sm:text-sm text-slate-900 dark:text-slate-100 placeholder-slate-400 focus:outline-none focus:border-brand-500 focus:ring-1 focus:ring-brand-500"
            autoFocus
          />
        </div>

        <div>
          <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
            Description (Optional)
          </label>
          <textarea
            rows="2"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Give your playlist a personal vibe..."
            className="w-full bg-slate-50 dark:bg-surface-card border border-purple-200/80 dark:border-surface-border rounded-xl px-4 py-2 text-xs sm:text-sm text-slate-900 dark:text-slate-100 placeholder-slate-400 focus:outline-none focus:border-brand-500 focus:ring-1 focus:ring-brand-500 resize-none"
          />
        </div>

        {/* Artwork Selector */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300">
              Choose Artwork Cover
            </label>
            <button
              type="button"
              onClick={() => setUseCustomUrl(!useCustomUrl)}
              className="text-[11px] text-brand-pink hover:underline font-semibold"
            >
              {useCustomUrl ? 'Use Curated Presets' : 'Custom Image URL'}
            </button>
          </div>

          {useCustomUrl ? (
            <div>
              <input
                type="url"
                value={customCoverUrl}
                onChange={(e) => setCustomCoverUrl(e.target.value)}
                placeholder="https://images.unsplash.com/... (Image URL)"
                className="w-full bg-slate-50 dark:bg-surface-card border border-purple-200/80 dark:border-surface-border rounded-xl px-4 py-2 text-xs text-slate-900 dark:text-slate-100 placeholder-slate-400 focus:outline-none focus:border-brand-500"
              />
              {customCoverUrl && (
                <div className="mt-2 w-20 h-20 rounded-xl overflow-hidden border border-purple-200 dark:border-surface-border">
                  <img
                    src={customCoverUrl}
                    alt="Preview"
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      e.target.style.display = 'none';
                    }}
                  />
                </div>
              )}
            </div>
          ) : (
            <div className="grid grid-cols-3 sm:grid-cols-6 gap-2 pt-1">
              {PRESET_PLAYLIST_COVERS.map((cov) => {
                const isSelected = selectedCover === cov.url;
                return (
                  <div
                    key={cov.id}
                    onClick={() => setSelectedCover(cov.url)}
                    className={`relative aspect-square rounded-xl overflow-hidden cursor-pointer transition-all border ${
                      isSelected
                        ? 'ring-2 ring-brand-500 border-white/20 scale-105 shadow-glow-purple'
                        : 'border-slate-200 dark:border-surface-border hover:brightness-105 opacity-80 hover:opacity-100'
                    }`}
                  >
                    <img
                      src={cov.url}
                      alt={cov.name}
                      className="w-full h-full object-cover"
                    />
                    {isSelected && (
                      <div className="absolute inset-0 bg-brand-600/40 flex items-center justify-center">
                        <Check className="w-5 h-5 text-white" />
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </div>

        <div className="flex items-center justify-end gap-3 pt-3 border-t border-purple-100 dark:border-surface-border">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-white/5 transition-colors"
          >
            Cancel
          </button>
          <Button
            type="submit"
            variant="primary"
            size="sm"
            disabled={!title.trim()}
            className="rounded-xl px-6 bg-gradient-to-r from-brand-600 via-brand-500 to-brand-pink shadow-glow-purple text-white-force font-bold"
          >
            Create Playlist
          </Button>
        </div>
      </form>
    </Modal>
  );
}
