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
  ArrowLeft,
} from 'lucide-react';
import { usePlayer } from '../../hooks/usePlayer';

export function SongActionsDropdown({ song, isFirstColumn = false, onOpenChange }) {
  const [isOpen, setIsOpen] = useState(false);
  const [showPlaylistsSubmenu, setShowPlaylistsSubmenu] = useState(false);
  const [firstColStyle, setFirstColStyle] = useState({});
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

  const updateFirstColumnPosition = () => {
    if (isFirstColumn && dropdownRef.current) {
      const buttonRect = dropdownRef.current.getBoundingClientRect();
      const mainEl = dropdownRef.current.closest('main') || document.body;
      const mainRect = mainEl?.getBoundingClientRect?.() || { left: 0 };
      // Keep at least 14px margin from sidebar or viewport boundary so panel never clips
      const safeLeft = (mainRect.left || 0) + 14;
      const menuWidth = 176; // w-44 = 176px
      // Ideal position: right-aligned with button, clamped to safeLeft so it never goes behind sidebar
      const targetLeft = Math.max(safeLeft, buttonRect.right - menuWidth);
      const offset = targetLeft - buttonRect.left;
      setFirstColStyle({ left: `${Math.round(offset)}px` });
    }
  };

  const setOpenState = (state) => {
    if (state && isFirstColumn) {
      updateFirstColumnPosition();
    } else if (!state) {
      setFirstColStyle({});
    }
    setIsOpen(state);
    if (onOpenChange) onOpenChange(state);
    if (!state) setShowPlaylistsSubmenu(false);
  };

  useEffect(() => {
    if (isOpen && isFirstColumn) {
      updateFirstColumnPosition();
      window.addEventListener('resize', updateFirstColumnPosition);
      return () => window.removeEventListener('resize', updateFirstColumnPosition);
    }
  }, [isOpen, isFirstColumn]);

  // Close dropdown on outside click
  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setOpenState(false);
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
    setOpenState(false);
  };

  return (
    <div className="relative inline-block text-left" ref={dropdownRef}>
      <button
        type="button"
        onClick={(e) => {
          e.stopPropagation();
          setOpenState(!isOpen);
        }}
        className="p-1.5 rounded-lg text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-white/10 transition-colors"
        title="More options"
      >
        <MoreVertical className="w-4 h-4" />
      </button>

      {isOpen && (
        <div
          onClick={(e) => e.stopPropagation()}
          style={isFirstColumn ? firstColStyle : undefined}
          className={
            isFirstColumn
              ? "song-actions-menu absolute left-[-60px] bottom-full mb-2 w-44 rounded-2xl bg-white dark:bg-surface-panel backdrop-blur-xl border border-slate-200 dark:border-surface-border shadow-2xl py-1.5 z-50 text-xs text-slate-800 dark:text-slate-200 select-none animate-in fade-in zoom-in-95 duration-150"
              : "song-actions-menu absolute right-0 bottom-full mb-2 w-48 sm:w-52 rounded-2xl bg-white dark:bg-surface-panel backdrop-blur-xl border border-slate-200 dark:border-surface-border shadow-2xl py-1.5 z-50 text-xs text-slate-800 dark:text-slate-200 select-none animate-in fade-in zoom-in-95 duration-150"
          }
        >
          {isFirstColumn && showPlaylistsSubmenu ? (
            /* First column inline submenu so it stays perfectly centered */
            <div className="p-1 space-y-1">
              <div className="flex items-center justify-between px-2.5 py-1 border-b border-slate-200 dark:border-surface-border mb-1">
                <button
                  type="button"
                  onClick={() => setShowPlaylistsSubmenu(false)}
                  className="text-[11px] font-bold text-brand-500 hover:underline flex items-center gap-1"
                >
                  <ArrowLeft className="w-3 h-3" />
                  <span>Back</span>
                </button>
                <span className="text-[10px] text-slate-400 uppercase font-mono font-bold">Playlists</span>
              </div>
              {customPlaylists.length === 0 ? (
                <div className="px-3 py-2 text-[11px] text-slate-500 dark:text-slate-400 font-medium">
                  No playlists yet.
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
                        setOpenState(false);
                      }}
                      className="w-full flex items-center justify-between px-2.5 py-1.5 text-left text-xs hover:bg-slate-100 dark:hover:bg-white/10 text-slate-700 dark:text-slate-200 hover:text-slate-950 dark:hover:text-white rounded-lg truncate"
                    >
                      <span className="truncate">{pl.title}</span>
                      {inPlaylist && <Check className="w-3.5 h-3.5 text-brand-500 dark:text-brand-400 shrink-0" />}
                    </button>
                  );
                })
              )}
            </div>
          ) : (
            /* Standard Action Menu */
            <>
              {/* Play Next */}
              <button
                type="button"
                onClick={() => {
                  playNext(song);
                  setOpenState(false);
                }}
                className="w-full flex items-center gap-2.5 px-3 py-2 text-left hover:bg-slate-100 dark:hover:bg-white/10 text-slate-700 dark:text-slate-200 hover:text-slate-950 dark:hover:text-white transition-colors"
              >
                <PlaySquare className="w-4 h-4 text-brand-500 dark:text-brand-400 shrink-0" />
                <span className="font-medium text-xs">Play Next</span>
              </button>

              {/* Add to Queue */}
              <button
                type="button"
                onClick={() => {
                  addToQueue(song);
                  setOpenState(false);
                }}
                className="w-full flex items-center gap-2.5 px-3 py-2 text-left hover:bg-slate-100 dark:hover:bg-white/10 text-slate-700 dark:text-slate-200 hover:text-slate-950 dark:hover:text-white transition-colors"
              >
                <ListPlus className="w-4 h-4 text-cyan-500 dark:text-cyan-400 shrink-0" />
                <span className="font-medium text-xs">Add to Queue</span>
              </button>

              {/* Add to Playlist */}
              <div className="relative">
                <button
                  type="button"
                  onClick={() => setShowPlaylistsSubmenu((prev) => !prev)}
                  className="w-full flex items-center justify-between px-3 py-2 text-left hover:bg-slate-100 dark:hover:bg-white/10 text-slate-700 dark:text-slate-200 hover:text-slate-950 dark:hover:text-white transition-colors"
                >
                  <div className="flex items-center gap-2.5">
                    <FolderPlus className="w-4 h-4 text-amber-500 dark:text-amber-400 shrink-0" />
                    <span className="font-medium text-xs">Add to Playlist</span>
                  </div>
                  <span className="text-[10px] text-slate-400">▶</span>
                </button>

                {/* Submenu for playlists in non-first-column mode */}
                {!isFirstColumn && showPlaylistsSubmenu && (
                  <div className="absolute right-full mr-1.5 bottom-0 w-48 rounded-xl bg-white dark:bg-surface-card border border-slate-200 dark:border-surface-border shadow-2xl py-1.5 z-50">
                    {customPlaylists.length === 0 ? (
                      <div className="px-3 py-2 text-[11px] text-slate-500 dark:text-slate-400 font-medium">
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
                              setOpenState(false);
                            }}
                            className="w-full flex items-center justify-between px-3 py-1.5 text-left text-xs hover:bg-slate-100 dark:hover:bg-white/10 text-slate-700 dark:text-slate-200 hover:text-slate-950 dark:hover:text-white truncate"
                          >
                            <span className="truncate">{pl.title}</span>
                            {inPlaylist && <Check className="w-3.5 h-3.5 text-brand-500 dark:text-brand-400 shrink-0" />}
                          </button>
                        );
                      })
                    )}
                  </div>
                )}
              </div>

              <div className="h-px bg-slate-200 dark:bg-surface-border my-1" />

              {/* Toggle Favorite */}
              <button
                type="button"
                onClick={() => {
                  toggleFavorite(song.id);
                  setOpenState(false);
                }}
                className="w-full flex items-center gap-2.5 px-3 py-2 text-left hover:bg-slate-100 dark:hover:bg-white/10 text-slate-700 dark:text-slate-200 hover:text-slate-950 dark:hover:text-white transition-colors"
              >
                <Heart className={`w-4 h-4 shrink-0 ${favorited ? 'fill-brand-500 text-brand-500' : 'text-slate-400'}`} />
                <span className="font-medium text-xs">{favorited ? 'Remove from Liked' : 'Save to Liked Songs'}</span>
              </button>

              {/* Remove from Local Library (Only for imported tracks) */}
              {song.isLocal && (
                <button
                  type="button"
                  onClick={() => {
                    removeLocalSong(song.id);
                    setOpenState(false);
                  }}
                  className="w-full flex items-center gap-2.5 px-3 py-2 text-left hover:bg-rose-500/15 text-rose-600 dark:text-rose-300 hover:text-rose-700 dark:hover:text-rose-200 transition-colors"
                >
                  <Trash2 className="w-4 h-4 text-rose-500 dark:text-rose-400 shrink-0" />
                  <span className="font-medium text-xs">Remove from Library</span>
                </button>
              )}

              {/* Track Details / Info */}
              <button
                type="button"
                onClick={() => {
                  if (openSongDetails) openSongDetails(song);
                  setOpenState(false);
                }}
                className="w-full flex items-center gap-2.5 px-3 py-2 text-left hover:bg-slate-100 dark:hover:bg-white/10 text-slate-700 dark:text-slate-200 hover:text-slate-950 dark:hover:text-white transition-colors"
              >
                <Info className="w-4 h-4 text-cyan-500 dark:text-cyan-400 shrink-0" />
                <span className="font-medium text-xs">Track Details</span>
              </button>

              {/* Share / Copy */}
              <button
                type="button"
                onClick={handleShare}
                className="w-full flex items-center gap-2.5 px-3 py-2 text-left hover:bg-slate-100 dark:hover:bg-white/10 text-slate-700 dark:text-slate-200 hover:text-slate-950 dark:hover:text-white transition-colors"
              >
                <Share2 className="w-4 h-4 text-slate-400 shrink-0" />
                <span className="font-medium text-xs">Share Track</span>
              </button>
            </>
          )}
        </div>
      )}
    </div>
  );
}
