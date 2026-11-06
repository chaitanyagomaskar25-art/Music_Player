import React, { useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import {
  Home,
  Compass,
  Search,
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
  HardDrive,
} from 'lucide-react';
import { playlists as editorialPlaylists } from '../../data/musicData';
import { usePlayer } from '../../hooks/usePlayer';
import { CreatePlaylistModal } from '../common/CreatePlaylistModal';

export function Sidebar({ isOpen, onClose, onSearchFocus }) {
  const { customPlaylists, deletePlaylist, importLocalAudioFiles, localSongs, favorites } = usePlayer();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const fileInputRef = React.useRef(null);
  const navigate = useNavigate();

  const mainNav = [
    { label: 'Home', path: '/', icon: Home },
    { label: 'Explore', path: '/explore', icon: Compass },
    {
      label: 'Search',
      icon: Search,
      action: () => {
        if (onSearchFocus) onSearchFocus();
        if (onClose) onClose();
      },
    },
    { label: 'Your Library', path: '/library', icon: Library },
    { label: 'Local Music', path: '/library?tab=local', icon: HardDrive, count: localSongs.length },
    { label: 'Favourites', path: '/favorites', icon: Heart, count: favorites.length },
    { label: 'Recently Played', path: '/library?tab=recent', icon: Clock },
  ];

  const handleLinkClick = () => {
    if (onClose) onClose();
  };

  const sidebarContent = (
    <div className="flex flex-col h-full bg-surface-charcoal/95 md:bg-surface-charcoal border-r border-surface-border text-slate-300 select-none">
      {/* Brand Header */}
      <div className="h-20 px-6 flex items-center justify-between border-b border-surface-border/60">
        <NavLink
          to="/"
          onClick={handleLinkClick}
          className="flex items-center gap-3.5 group cursor-pointer"
        >
          <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-brand-600 via-brand-500 to-brand-pink flex items-center justify-center shadow-glow-purple group-hover:scale-105 transition-transform duration-300">
            <Music2 className="w-5 h-5 text-white" />
          </div>
          <div className="flex flex-col">
            <span className="font-black text-xl tracking-tight bg-gradient-to-r from-white via-slate-100 to-brand-300 bg-clip-text text-transparent">
              Melody
            </span>
            <div className="flex items-center gap-1.5 -mt-0.5">
              <span className="w-1.5 h-1.5 rounded-full bg-brand-500 animate-pulse" />
              <span className="text-[10px] uppercase font-bold tracking-widest text-brand-400">
                Hi-Fi Studio
              </span>
            </div>
          </div>
        </NavLink>

        {/* Close button for tablet / mobile drawer */}
        {onClose && (
          <button
            type="button"
            onClick={onClose}
            className="md:hidden p-2 rounded-xl text-slate-400 hover:text-white hover:bg-white/10 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        )}
      </div>

      {/* Main Navigation Links */}
      <div className="px-3 py-5 space-y-1">
        <p className="px-3 text-[11px] font-bold text-slate-300 uppercase tracking-wider mb-2">
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
                className="w-full flex items-center gap-3.5 px-3 py-2.5 rounded-xl text-sm font-semibold text-slate-400 hover:text-white hover:bg-white/5 transition-all duration-200 group text-left"
              >
                <Icon className="w-5 h-5 text-slate-400 group-hover:text-brand-400 transition-colors shrink-0" />
                <span>{item.label}</span>
              </button>
            );
          }

          return (
            <NavLink
              key={item.path}
              to={item.path}
              onClick={handleLinkClick}
              className={({ isActive }) =>
                `flex items-center justify-between px-3 py-2.5 rounded-xl text-sm font-semibold transition-all duration-200 group ${
                  isActive
                    ? 'bg-gradient-to-r from-brand-600/25 to-brand-pink/10 text-white border-l-4 border-brand-500 font-bold shadow-inner'
                    : 'text-slate-400 hover:text-slate-100 hover:bg-white/5'
                }`
              }
            >
              <div className="flex items-center gap-3.5">
                <Icon className="w-5 h-5 group-hover:text-brand-400 transition-colors shrink-0" />
                <span>{item.label}</span>
              </div>
              {item.count !== undefined && item.count > 0 && (
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-white/10 text-slate-300 group-hover:text-white">
                  {item.count}
                </span>
              )}
            </NavLink>
          );
        })}
      </div>

      {/* Action Buttons: Create Playlist & Import Music */}
      <div className="px-4 py-2 space-y-2">
        <button
          type="button"
          onClick={() => setIsModalOpen(true)}
          className="w-full relative group overflow-hidden rounded-2xl p-[1px] focus:outline-none"
        >
          <div className="absolute inset-0 bg-gradient-to-r from-brand-600 via-brand-500 to-brand-pink rounded-2xl group-hover:opacity-100 opacity-80 transition-opacity" />
          <div className="relative px-3.5 py-2.5 bg-surface-panel rounded-2xl flex items-center justify-center gap-2 text-xs font-bold text-white group-hover:bg-opacity-80 transition-all">
            <Plus className="w-4 h-4 text-brand-300 group-hover:scale-125 transition-transform" />
            <span>Create Playlist</span>
          </div>
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
          className="w-full px-3.5 py-2 rounded-2xl bg-surface-card hover:bg-surface-hover border border-surface-border text-xs font-semibold text-slate-300 hover:text-white flex items-center justify-center gap-2 transition-all shadow-subtle group"
          title="Import MP3, WAV, OGG, or FLAC audio files from your device"
        >
          <Upload className="w-3.5 h-3.5 text-cyan-400 group-hover:scale-110 transition-transform" />
          <span>Import Music</span>
        </button>
      </div>

      <div className="h-px bg-surface-border/50 mx-4 my-2" />

      {/* Playlists Section (Scrollable) */}
      <div className="flex-1 overflow-y-auto px-3 py-2 space-y-4">
        {/* Custom Playlists */}
        <div>
          <div className="flex items-center justify-between px-3 mb-2">
            <p className="text-[11px] font-bold text-slate-300 uppercase tracking-wider">
              My Playlists
            </p>
            <span className="text-[10px] bg-white/5 px-2 py-0.5 rounded-full font-mono text-slate-300">
              {customPlaylists.length}
            </span>
          </div>

          <div className="space-y-1">
            {customPlaylists.map((pl) => (
              <div
                key={pl.id}
                className="group flex items-center justify-between px-3 py-2 rounded-xl text-xs font-medium text-slate-400 hover:text-white hover:bg-white/5 transition-all"
              >
                <NavLink
                  to={`/library?playlist=${pl.id}`}
                  onClick={handleLinkClick}
                  className="flex items-center gap-2.5 min-w-0 flex-1 truncate"
                >
                  <Folder className="w-3.5 h-3.5 shrink-0 text-brand-400 group-hover:text-brand-300" />
                  <span className="truncate">{pl.title}</span>
                </NavLink>
                <button
                  type="button"
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    deletePlaylist(pl.id);
                  }}
                  className="opacity-0 group-hover:opacity-100 p-1 text-slate-500 hover:text-rose-400 transition-opacity"
                  title="Delete playlist"
                >
                  <Trash2 className="w-3 h-3" />
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Curated Editorial Collections */}
        <div>
          <p className="px-3 text-[11px] font-bold text-slate-300 uppercase tracking-wider mb-2">
            Curated Stations
          </p>
          <div className="space-y-1">
            {editorialPlaylists.map((playlist) => (
              <NavLink
                key={playlist.id}
                to={`/library?playlist=${playlist.id}`}
                onClick={handleLinkClick}
                className="flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-medium text-slate-400 hover:text-white hover:bg-white/5 truncate transition-all group"
              >
                <Disc3 className="w-3.5 h-3.5 shrink-0 text-brand-500 group-hover:rotate-45 transition-transform" />
                <span className="truncate">{playlist.title}</span>
              </NavLink>
            ))}
          </div>
        </div>
      </div>

      {/* Bottom Profile / Plan Indicator */}
      <div className="p-4 border-t border-surface-border/60">
        <div className="p-3.5 rounded-2xl bg-gradient-to-br from-brand-900/40 via-surface-panel to-surface-card border border-brand-500/20 shadow-subtle flex items-center gap-3">
          <div className="w-8 h-8 rounded-xl bg-brand-500/20 text-brand-300 flex items-center justify-center shrink-0">
            <Sparkles className="w-4 h-4 text-brand-400" />
          </div>
          <div className="min-w-0 flex-1">
            <p className="text-xs font-bold text-white truncate">Melody Studio Pro</p>
            <p className="text-[10px] text-slate-400 truncate">Spatial Audio • Lossless</p>
          </div>
        </div>
      </div>

      <CreatePlaylistModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
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
          <div className="relative w-72 max-w-[85vw] h-full z-10 shadow-2xl animate-in slide-in-from-left duration-250">
            {sidebarContent}
          </div>
        </div>
      )}
    </>
  );
}
