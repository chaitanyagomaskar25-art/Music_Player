import React, { useState } from 'react';
import { X, FolderPlus, Image, Sparkles, Check } from 'lucide-react';
import { usePlayer, PRESET_PLAYLIST_COVERS } from '../../context/PlayerContext';
import { Button } from './Button';

export function CreatePlaylistModal({ isOpen, onClose }) {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [selectedCover, setSelectedCover] = useState(PRESET_PLAYLIST_COVERS[0].url);
  const [customCoverUrl, setCustomCoverUrl] = useState('');
  const [useCustomUrl, setUseCustomUrl] = useState(false);

  const { createPlaylist } = usePlayer();

  if (!isOpen) return null;

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
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 select-none">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/80 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Modal Dialog */}
      <div className="relative w-full max-w-lg bg-surface-charcoal border border-surface-border rounded-3xl p-6 shadow-2xl z-10 animate-in fade-in zoom-in-95 duration-150 max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between pb-4 border-b border-surface-border">
          <div className="flex items-center gap-2.5">
            <div className="p-2.5 rounded-2xl bg-brand-500/20 text-brand-300">
              <FolderPlus className="w-5 h-5 text-brand-400" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white">Create New Playlist</h3>
              <p className="text-[11px] text-slate-400">Add details and choose artwork for your mix</p>
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

        <form onSubmit={handleSubmit} className="mt-4 space-y-4">
          <div>
            <label className="block text-xs font-bold text-slate-300 mb-1.5">
              Playlist Name <span className="text-brand-pink">*</span>
            </label>
            <input
              type="text"
              required
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. Late Night Beats, Summer Hits"
              className="w-full bg-surface-card border border-surface-border rounded-xl px-4 py-2.5 text-xs sm:text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:border-brand-500 focus:ring-1 focus:ring-brand-500"
              autoFocus
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-300 mb-1.5">
              Description (Optional)
            </label>
            <textarea
              rows="2"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Give your playlist a personal vibe..."
              className="w-full bg-surface-card border border-surface-border rounded-xl px-4 py-2 text-xs sm:text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:border-brand-500 focus:ring-1 focus:ring-brand-500 resize-none"
            />
          </div>

          {/* Artwork Selector */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <label className="block text-xs font-bold text-slate-300">
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
                  className="w-full bg-surface-card border border-surface-border rounded-xl px-4 py-2 text-xs text-slate-100 placeholder-slate-500 focus:outline-none focus:border-brand-500"
                />
                {customCoverUrl && (
                  <div className="mt-2 w-20 h-20 rounded-xl overflow-hidden border border-surface-border">
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
                          : 'border-surface-border hover:brightness-110 opacity-70 hover:opacity-100'
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

          <div className="flex items-center justify-end gap-3 pt-3 border-t border-surface-border">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-400 hover:text-white hover:bg-white/5 transition-colors"
            >
              Cancel
            </button>
            <Button
              type="submit"
              variant="primary"
              size="sm"
              disabled={!title.trim()}
              className="rounded-xl px-6 bg-gradient-to-r from-brand-600 to-brand-pink shadow-glow-purple"
            >
              Create Playlist
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
