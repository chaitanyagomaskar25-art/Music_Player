import React, { useState, useRef, useEffect } from 'react';
import {
  MoreVertical,
  PlaySquare,
  ListPlus,
  FolderPlus,
  Heart,
  Share2,
  Check,
  Trash2,
  Info,
} from 'lucide-react';
import { usePlayer } from '../../hooks/usePlayer';

export function SongActionsDropdown({ song }) {
  const [isOpen, setIsOpen] = useState(false);
  const [showPlaylistsSubmenu, setShowPlaylistsSubmenu] = useState(false);
  const dropdownRef = useRef(null);

  const {
    addToQueue,
    playNext,
    customPlaylists,
    addSongToPlaylist,
    isFavorite,
    toggleFavorite,
    removeLocalSong,
    openSongDetails,
    addToast,
  } = usePlayer();

  const favorited = isFavorite(song.id);

  // Close dropdown on outside click
  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
        setShowPlaylistsSubmenu(false);
      }
    }
    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isOpen]);

  const handleShare = () => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(`${song.title} by ${song.artist}`);
      addToast('Track info copied to clipboard!', 'info');
    } else {
      addToast(`Shared: ${song.title}`, 'info');
    }
    setIsOpen(false);
  };

  return (
    <div className="relative inline-block text-left" ref={dropdownRef}>
      <button
        type="button"
        onClick={(e) => {
          e.stopPropagation();
          setIsOpen((prev) => !prev);
          setShowPlaylistsSubmenu(false);
        }}
        className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-white/10 transition-colors"
        title="More options"
      >
        <MoreVertical className="w-4 h-4" />
      </button>

      {isOpen && (
        <div
          onClick={(e) => e.stopPropagation()}
          className="absolute right-0 bottom-full mb-2 w-52 rounded-2xl bg-surface-panel/95 backdrop-blur-xl border border-surface-border shadow-2xl py-1.5 z-40 text-xs text-slate-200 select-none animate-in fade-in zoom-in-95 duration-150"
        >
          {/* Play Next */}
          <button
            type="button"
            onClick={() => {
              playNext(song);
              setIsOpen(false);
            }}
            className="w-full flex items-center gap-2.5 px-3.5 py-2 text-left hover:bg-white/10 transition-colors"
          >
            <PlaySquare className="w-4 h-4 text-brand-400" />
            <span>Play Next</span>
          </button>

          {/* Add to Queue */}
          <button
            type="button"
            onClick={() => {
              addToQueue(song);
              setIsOpen(false);
            }}
            className="w-full flex items-center gap-2.5 px-3.5 py-2 text-left hover:bg-white/10 transition-colors"
          >
            <ListPlus className="w-4 h-4 text-cyan-400" />
            <span>Add to Queue</span>
          </button>

          {/* Add to Playlist */}
          <div className="relative">
            <button
              type="button"
              onClick={() => setShowPlaylistsSubmenu((prev) => !prev)}
              className="w-full flex items-center justify-between px-3.5 py-2 text-left hover:bg-white/10 transition-colors"
            >
              <div className="flex items-center gap-2.5">
                <FolderPlus className="w-4 h-4 text-amber-400" />
                <span>Add to Playlist</span>
              </div>
              <span className="text-[10px] text-slate-400">▶</span>
            </button>

            {/* Submenu for playlists */}
            {showPlaylistsSubmenu && (
              <div className="absolute right-full bottom-0 mr-1 w-48 rounded-xl bg-surface-card border border-surface-border shadow-2xl py-1.5 z-50">
                {customPlaylists.length === 0 ? (
                  <div className="px-3 py-2 text-[11px] text-slate-400">
                    No custom playlists yet.
                  </div>
                ) : (
                  customPlaylists.map((pl) => {
                    const inPlaylist = pl.songIds.includes(song.id);
                    return (
                      <button
                        key={pl.id}
                        type="button"
                        onClick={() => {
                          addSongToPlaylist(pl.id, song.id);
                          setIsOpen(false);
                        }}
                        className="w-full flex items-center justify-between px-3 py-1.5 text-left text-xs hover:bg-white/10 truncate"
                      >
                        <span className="truncate">{pl.title}</span>
                        {inPlaylist && <Check className="w-3 h-3 text-brand-400 shrink-0" />}
                      </button>
                    );
                  })
                )}
              </div>
            )}
          </div>

          <div className="h-px bg-surface-border my-1" />

          {/* Toggle Favorite */}
          <button
            type="button"
            onClick={() => {
              toggleFavorite(song.id);
              setIsOpen(false);
            }}
            className="w-full flex items-center gap-2.5 px-3.5 py-2 text-left hover:bg-white/10 transition-colors"
          >
            <Heart className={`w-4 h-4 ${favorited ? 'fill-brand-500 text-brand-500' : 'text-slate-400'}`} />
            <span>{favorited ? 'Remove from Liked' : 'Save to Liked Songs'}</span>
          </button>

          {/* Remove from Local Library (Only for imported tracks) */}
          {song.isLocal && (
            <button
              type="button"
              onClick={() => {
                removeLocalSong(song.id);
                setIsOpen(false);
              }}
              className="w-full flex items-center gap-2.5 px-3.5 py-2 text-left hover:bg-rose-500/15 text-rose-300 hover:text-rose-200 transition-colors"
            >
              <Trash2 className="w-4 h-4 text-rose-400" />
              <span>Remove from Library</span>
            </button>
          )}

          {/* Track Details / Info */}
          <button
            type="button"
            onClick={() => {
              if (openSongDetails) openSongDetails(song);
              setIsOpen(false);
            }}
            className="w-full flex items-center gap-2.5 px-3.5 py-2 text-left hover:bg-white/10 transition-colors"
          >
            <Info className="w-4 h-4 text-cyan-400" />
            <span>Track Details</span>
          </button>

          {/* Share / Copy */}
          <button
            type="button"
            onClick={handleShare}
            className="w-full flex items-center gap-2.5 px-3.5 py-2 text-left hover:bg-white/10 transition-colors"
          >
            <Share2 className="w-4 h-4 text-slate-400" />
            <span>Share Track</span>
          </button>
        </div>
      )}
    </div>
  );
}
