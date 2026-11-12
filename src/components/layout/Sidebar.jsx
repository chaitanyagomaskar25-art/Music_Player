import React, { useState } from 'react';
import { Link, NavLink, useNavigate, useLocation, useSearchParams } from 'react-router-dom';
import {
  Home,
  Compass,
  Library,
  Heart,
  Clock,
  Plus,
  Music2,
  Folder,
  Disc3,
  Trash2,
  Sparkles,
  X,
  Upload,
} from 'lucide-react';
import { playlists as editorialPlaylists } from '../../data/musicData';
import { usePlayer } from '../../hooks/usePlayer';
import { CreatePlaylistModal } from '../common/CreatePlaylistModal';
import { ConfirmDialog } from '../common/ConfirmDialog';

export function Sidebar({ isOpen, onClose, onSearchFocus }) {
  const { customPlaylists, deletePlaylist, importLocalAudioFiles, localSongs, favorites } = usePlayer();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [playlistToDelete, setPlaylistToDelete] = useState(null);
  const fileInputRef = React.useRef(null);
  const navigate = useNavigate();
  const location = useLocation();
  const [searchParams] = useSearchParams();

  const isItemActive = (item) => {
    if (item.path === '/') {
      return location.pathname === '/';
    }
    if (item.path === '/explore') {
      return location.pathname === '/explore';
    }
    if (item.path === '/favorites') {
      return location.pathname === '/favorites';
    }
    if (item.path === '/library') {
      const tab = searchParams.get('tab');
      const playlist = searchParams.get('playlist');
      return (
        location.pathname === '/library' &&
        (!tab || tab === 'all' || tab === 'playlists' || tab === 'albums') &&
        !playlist
      );
    }
    if (item.path === '/library?tab=local') {
      return (
        (location.pathname === '/library' && searchParams.get('tab') === 'local') ||
        location.pathname === '/local'
      );
    }
    if (item.path === '/library?tab=recent') {
      return location.pathname === '/library' && searchParams.get('tab') === 'recent';
    }
    return false;
  };

  const isPlaylistActive = (playlistId) => {
    return location.pathname === '/library' && searchParams.get('playlist') === playlistId;
  };

  const mainNav = [
    { label: 'Home', path: '/', icon: Home },
    { label: 'Explore', path: '/explore', icon: Compass },
    { label: 'Your Library', path: '/library', icon: Library },
    { label: 'Favourites', path: '/favorites', icon: Heart, count: favorites.length },
    { label: 'Recently Played', path: '/library?tab=recent', icon: Clock },
  ];

  const handleLinkClick = () => {
    if (onClose) onClose();
  };

  const sidebarContent = (
    <div className="flex flex-col h-full bg-white md:bg-white dark:bg-surface-charcoal border-r border-slate-200 dark:border-surface-border text-slate-900 dark:text-slate-300 select-none">
      {/* Brand Header */}
      <div className="h-20 px-6 flex items-center justify-between border-b border-slate-200 dark:border-surface-border/60">
        <Link
          to="/"
          onClick={handleLinkClick}
          className="flex items-center gap-3.5 group cursor-pointer"
        >
          <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-brand-600 via-brand-500 to-brand-pink flex items-center justify-center shadow-glow-purple group-hover:scale-105 transition-transform duration-300">
            <Music2 className="w-5 h-5 text-white" />
          </div>
          <div className="flex flex-col">
            <span className="font-black text-xl tracking-tight text-slate-950 dark:text-white">
              Melody
            </span>
            <div className="flex items-center gap-1.5 -mt-0.5">
              <span className="w-1.5 h-1.5 rounded-full bg-brand-500 animate-pulse" />
              <span className="text-[10px] uppercase font-bold tracking-widest text-brand-700 dark:text-brand-400">
                Hi-Fi Studio
              </span>
            </div>
          </div>
        </Link>

        {/* Close button for tablet / mobile drawer */}
        {onClose && (
          <button
            type="button"
            onClick={onClose}
            className="md:hidden p-2 rounded-xl text-slate-500 hover:text-slate-950 hover:bg-slate-100 dark:text-slate-400 dark:hover:text-white dark:hover:bg-white/10 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        )}
      </div>

      {/* Main Navigation Links */}
      <div className="px-3 py-5 space-y-1">
        <p className="px-3 text-[11px] font-extrabold text-slate-900 dark:text-slate-400 uppercase tracking-wider mb-2">
          Menu
        </p>
        {mainNav.map((item) => {
          const Icon = item.icon;

          if (item.action) {
            return (
              <button
                key={item.label}
                type="button"
                onClick={item.action}
                className="w-full flex items-center gap-3.5 px-3.5 py-2.5 rounded-xl text-sm font-semibold text-slate-800 hover:text-slate-950 hover:bg-slate-100 dark:text-slate-400 dark:hover:text-white dark:hover:bg-white/5 transition-all duration-200 group text-left"
              >
                <Icon className="w-5 h-5 text-slate-600 group-hover:text-brand-600 dark:text-slate-400 dark:group-hover:text-brand-400 transition-colors shrink-0" />
                <span>{item.label}</span>
              </button>
            );
          }

          const isActive = isItemActive(item);

          return (
            <Link
              key={item.label}
              to={item.path}
              onClick={handleLinkClick}
              className={`flex items-center justify-between px-3.5 py-2.5 rounded-xl text-sm font-semibold transition-all duration-200 group ${
                isActive
                  ? 'bg-slate-900 text-white font-bold shadow-md border-l-4 border-brand-500 text-white-force dark:bg-gradient-to-r dark:from-brand-600/25 dark:to-brand-pink/10 dark:text-white dark:border-brand-500 dark:shadow-inner'
                  : 'text-slate-800 hover:text-slate-950 hover:bg-slate-100 dark:text-slate-400 dark:hover:text-slate-100 dark:hover:bg-white/5'
              }`}
            >
              <div className="flex items-center gap-3.5">
                <Icon className={`w-5 h-5 transition-colors shrink-0 ${
                  isActive
                    ? 'text-white dark:text-brand-400 font-bold'
                    : 'text-slate-600 group-hover:text-slate-950 dark:text-slate-400 dark:group-hover:text-brand-400'
                }`} />
                <span>{item.label}</span>
              </div>
              {item.count !== undefined && item.count > 0 && (
                <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                  isActive
                    ? 'bg-brand-500 text-white font-bold shadow-xs text-white-force'
                    : 'bg-slate-200 text-slate-900 font-bold border border-slate-300 dark:bg-white/10 dark:text-slate-300 dark:border-transparent'
                }`}>
                  {item.count}
                </span>
              )}
            </Link>
          );
        })}
      </div>

      {/* Action Buttons: Create Playlist & Import Music */}
      <div className="px-4 py-2 space-y-2">
        <button
          type="button"
          onClick={() => setIsModalOpen(true)}
          className="w-full flex items-center justify-center gap-2 px-3.5 py-2.5 rounded-2xl bg-gradient-to-r from-brand-600 via-brand-500 to-brand-pink hover:from-brand-500 hover:to-pink-500 text-white font-bold text-xs shadow-md shadow-brand-500/25 hover:scale-[1.02] active:scale-[0.98] transition-all text-white-force"
        >
          <Plus className="w-4 h-4 text-white group-hover:scale-125 transition-transform" />
          <span>Create Playlist</span>
        </button>

        <input
          ref={fileInputRef}
          type="file"
          accept="audio/*,.mp3,.wav,.ogg,.oga,.m4a,.aac,.flac,.opus,.weba,.webm"
          multiple
          className="hidden"
          onChange={(e) => {
            if (e.target.files && e.target.files.length > 0) {
              importLocalAudioFiles(e.target.files);
              e.target.value = '';
            }
          }}
        />

        <button
          type="button"
          onClick={() => fileInputRef.current && fileInputRef.current.click()}
          className="w-full px-3.5 py-2.5 rounded-2xl bg-slate-900 hover:bg-black text-white dark:bg-surface-card dark:hover:bg-surface-hover dark:text-slate-200 border border-slate-800 dark:border-surface-border text-xs font-bold flex items-center justify-center gap-2 transition-all shadow-sm text-white-force group"
          title="Import MP3, WAV, OGG, or FLAC audio files from your device"
        >
          <Upload className="w-3.5 h-3.5 text-brand-400 group-hover:scale-110 transition-transform" />
          <span>Import Music</span>
        </button>
      </div>

      <div className="h-px bg-slate-300 dark:bg-surface-border/50 mx-4 my-2" />

      {/* Playlists Section (Scrollable) */}
      <div className="flex-1 overflow-y-auto px-3 py-2 space-y-4">
        {/* Custom Playlists */}
        <div>
          <div className="flex items-center justify-between px-3 mb-2">
            <p className="text-[11px] font-extrabold text-slate-900 dark:text-slate-400 uppercase tracking-wider">
              My Playlists
            </p>
            <span className="text-[10px] bg-slate-200 border border-slate-300 dark:border-transparent dark:bg-white/5 px-2 py-0.5 rounded-full font-mono font-bold text-slate-900 dark:text-slate-300">
              {customPlaylists.length}
            </span>
          </div>

          <div className="space-y-1">
            {customPlaylists.map((pl) => {
              const isActive = isPlaylistActive(pl.id);
              return (
                <div
                  key={pl.id}
                  className={`group flex items-center justify-between px-2 py-1 rounded-xl text-xs font-medium transition-all ${
                    isActive
                      ? 'bg-slate-900 text-white font-bold shadow-sm text-white-force dark:bg-brand-500/20 dark:text-brand-300'
                      : 'text-slate-800 hover:text-slate-950 hover:bg-slate-100 dark:text-slate-400 dark:hover:text-white dark:hover:bg-white/5'
                  }`}
                >
                  <Link
                    to={`/library?playlist=${pl.id}`}
                    onClick={handleLinkClick}
                    className="flex items-center gap-2.5 min-w-0 flex-1 truncate px-2.5 py-1.5 rounded-lg"
                  >
                    <Folder className={`w-3.5 h-3.5 shrink-0 ${
                      isActive ? 'text-brand-400' : 'text-brand-600 group-hover:text-brand-700 dark:text-brand-400 dark:group-hover:text-brand-300'
                    }`} />
                    <span className="truncate">{pl.title}</span>
                  </Link>
                  <button
                    type="button"
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      setPlaylistToDelete(pl);
                    }}
                    className={`p-1 transition-opacity ${
                      isActive ? 'text-slate-400 hover:text-rose-400' : 'opacity-0 group-hover:opacity-100 text-slate-500 hover:text-rose-600'
                    }`}
                    title="Delete playlist"
                  >
                    <Trash2 className="w-3 h-3" />
                  </button>
                </div>
              );
            })}
          </div>
        </div>

        {/* Curated Editorial Collections */}
        <div>
          <p className="px-3 text-[11px] font-extrabold text-slate-900 dark:text-slate-400 uppercase tracking-wider mb-2">
            Curated Stations
          </p>
          <div className="space-y-1">
            {editorialPlaylists.map((playlist) => {
              const isActive = isPlaylistActive(playlist.id);
              return (
                <Link
                  key={playlist.id}
                  to={`/library?playlist=${playlist.id}`}
                  onClick={handleLinkClick}
                  className={`flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-semibold truncate transition-all group ${
                    isActive
                      ? 'bg-gradient-to-r from-brand-600 to-brand-pink text-white font-bold shadow-md shadow-brand-500/20 text-white-force'
                      : 'text-slate-700 hover:text-slate-950 hover:bg-purple-50/70 dark:text-slate-400 dark:hover:text-white dark:hover:bg-white/5'
                  }`}
                >
                  <Disc3 className={`w-3.5 h-3.5 shrink-0 transition-transform ${
                    isActive ? 'text-white' : 'text-brand-600 group-hover:rotate-45 dark:text-brand-400'
                  }`} />
                  <span className="truncate">{playlist.title}</span>
                </Link>
              );
            })}
          </div>
        </div>
      </div>

      {/* Bottom Profile / Plan Indicator */}
      <div className="p-4 border-t border-slate-300 dark:border-surface-border/60">
        <div className="p-3.5 rounded-2xl bg-slate-950 text-white border border-slate-900 shadow-xl flex items-center gap-3 text-white-force dark:bg-gradient-to-br dark:from-brand-900/40 dark:via-surface-panel dark:to-surface-card dark:border-brand-500/20">
          <div className="w-8 h-8 rounded-xl bg-brand-500/30 border border-brand-400/40 text-brand-300 flex items-center justify-center shrink-0">
            <Sparkles className="w-4 h-4 text-amber-400 animate-pulse" />
          </div>
          <div className="min-w-0 flex-1">
            <p className="text-xs font-black text-white truncate">Melody Studio Pro</p>
            <p className="text-[10px] text-slate-300 font-medium truncate">Spatial Audio • Lossless</p>
          </div>
          <span className="text-[9px] uppercase font-mono px-1.5 py-0.5 rounded-full bg-gradient-to-r from-brand-500 to-brand-pink text-white font-black shadow-xs">
            VIP
          </span>
        </div>
      </div>

      <CreatePlaylistModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      />

      <ConfirmDialog
        isOpen={!!playlistToDelete}
        onClose={() => setPlaylistToDelete(null)}
        onConfirm={() => {
          if (playlistToDelete) {
            deletePlaylist(playlistToDelete.id);
            setPlaylistToDelete(null);
          }
        }}
        title="Delete Playlist"
        message={`Are you sure you want to delete "${playlistToDelete?.title}"? All tracks will be removed from this playlist.`}
        confirmText="Delete Playlist"
        isDanger
      />
    </div>
  );

  return (
    <>
      {/* Desktop Persistent Sidebar */}
      <aside className="w-64 xl:w-72 hidden md:block h-full shrink-0">
        {sidebarContent}
      </aside>

      {/* Tablet & Mobile Slide-out Drawer */}
      {isOpen && (
        <div className="fixed inset-0 z-50 md:hidden flex">
          {/* Backdrop */}
          <div
            className="fixed inset-0 bg-black/80 backdrop-blur-sm transition-opacity"
            onClick={onClose}
          />
          {/* Drawer content */}
          <div className="relative w-72 max-w-[85vw] h-full z-10 shadow-2xl animate-in slide-in-from-left duration-250 bg-white dark:bg-surface-charcoal">
            {sidebarContent}
          </div>
        </div>
      )}
    </>
  );
}
