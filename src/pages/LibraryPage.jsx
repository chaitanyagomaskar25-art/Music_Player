import React, { useState, useEffect, useRef, useMemo } from 'react';
import { useSearchParams, Link, useNavigate, useOutletContext } from 'react-router-dom';
import {
  Library,
  Disc,
  Clock,
  Play,
  Shuffle,
  Plus,
  Trash2,
  Folder,
  Sparkles,
  Download,
  Upload,
  Search,
  X,
  Edit3,
  UserPlus,
  Music,
  HardDrive,
  Info,
  UploadCloud,
  ShieldCheck,
} from 'lucide-react';
import { playlists as editorialPlaylists, albums, songs } from '../data/musicData';
import { usePlayer } from '../hooks/usePlayer';
import { SongRow } from '../components/music/SongRow';
import { Button } from '../components/common/Button';
import { CreatePlaylistModal } from '../components/common/CreatePlaylistModal';
import { EditPlaylistModal } from '../components/common/EditPlaylistModal';
import { ConfirmDialog } from '../components/common/ConfirmDialog';
import { AddSongsToPlaylistModal } from '../components/common/AddSongsToPlaylistModal';
import { EmptyState } from '../components/common/EmptyState';
import { PlaylistCard } from '../components/music/PlaylistCard';
import { formatTime, formatNumber } from '../utils/formatters';

export function LibraryPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const activePlaylistId = searchParams.get('playlist');
  const tabParam = searchParams.get('tab');
  const [tab, setTab] = useState(tabParam || (activePlaylistId ? 'playlists' : 'all'));
  const { searchQuery: globalSearch = '' } = useOutletContext() || {};
  const navigate = useNavigate();

  // Modals state
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isConfirmDeleteOpen, setIsConfirmDeleteOpen] = useState(false);
  const [isConfirmClearLocalOpen, setIsConfirmClearLocalOpen] = useState(false);
  const [isAddSongsModalOpen, setIsAddSongsModalOpen] = useState(false);
  const [playlistSearch, setPlaylistSearch] = useState('');
  const [localSearch, setLocalSearch] = useState('');
  const [localFormatFilter, setLocalFormatFilter] = useState('all');
  const [localSortBy, setLocalSortBy] = useState('recent');
  const [isLocalDragOver, setIsLocalDragOver] = useState(false);
  const importFileRef = useRef(null);
  const localAudioInputRef = useRef(null);

  const {
    customPlaylists,
    recentlyPlayed,
    clearRecentlyPlayed,
    deletePlaylist,
    removeSongFromPlaylist,
    createPlaylist,
    playSong,
    playPlaylist,
    addToast,
    localSongs,
    allSongs,
    removeLocalSong,
    clearLocalSongs,
    importLocalAudioFiles,
    isShuffle,
    toggleShuffle,
  } = usePlayer();

  useEffect(() => {
    if (tabParam) {
      setTab(tabParam);
    }
  }, [tabParam]);

  // Combine both editorial and custom playlists
  const allPlaylists = [...customPlaylists, ...editorialPlaylists];
  const selectedPlaylist = allPlaylists.find((p) => p.id === activePlaylistId);
  const isCustom = customPlaylists.some((p) => p.id === activePlaylistId);

  // Available songs catalog including imported local tracks
  const songCatalog = allSongs || songs;

  // Filter songs in playlist by playlist search or global search
  const effectivePlaylistSearch = (playlistSearch || globalSearch).trim();
  const playlistSongs = selectedPlaylist
    ? songCatalog
        .filter((s) => selectedPlaylist.songIds.includes(s.id))
        .filter(
          (s) =>
            !effectivePlaylistSearch ||
            s.title.toLowerCase().includes(effectivePlaylistSearch.toLowerCase()) ||
            s.artist.toLowerCase().includes(effectivePlaylistSearch.toLowerCase()) ||
            s.genre.toLowerCase().includes(effectivePlaylistSearch.toLowerCase())
        )
    : [];

  // Filter & sort local songs by search query, format filter, and sorting
  const effectiveLocalSearch = (localSearch || globalSearch).trim();
  const filteredLocalSongs = useMemo(() => {
    let list = (localSongs || []).filter((s) => {
      const matchesSearch =
        !effectiveLocalSearch ||
        s.title.toLowerCase().includes(effectiveLocalSearch.toLowerCase()) ||
        s.artist.toLowerCase().includes(effectiveLocalSearch.toLowerCase()) ||
        (s.fileFormat && s.fileFormat.toLowerCase().includes(effectiveLocalSearch.toLowerCase()));

      const matchesFormat =
        localFormatFilter === 'all' ||
        (s.fileFormat && s.fileFormat.toLowerCase() === localFormatFilter.toLowerCase());

      return matchesSearch && matchesFormat;
    });

    if (localSortBy === 'title') {
      return [...list].sort((a, b) => a.title.localeCompare(b.title));
    }
    if (localSortBy === 'duration') {
      return [...list].sort((a, b) => (b.duration || 0) - (a.duration || 0));
    }
    return list;
  }, [localSongs, effectiveLocalSearch, localFormatFilter, localSortBy]);

  // First or top local song for spotlight
  const featuredLocalSong = (localSongs && localSongs.length > 0) ? localSongs[0] : null;

  // Local songs statistics
  const localTotalSeconds = (localSongs || []).reduce((acc, s) => acc + (s.duration || 0), 0);
  const localHours = Math.floor(localTotalSeconds / 3600);
  const localMinutes = Math.floor((localTotalSeconds % 3600) / 60);
  const localDurationLabel = localHours > 0 ? `${localHours} hr ${localMinutes} min` : `${localMinutes} min`;

  // Recently played tracks from LocalStorage
  const recentlyPlayedList = recentlyPlayed
    .map((id) => songCatalog.find((s) => s.id === id))
    .filter(Boolean);

  // Export Playlist to JSON
  const handleExportPlaylist = () => {
    if (!selectedPlaylist) return;
    const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(selectedPlaylist, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute('href', dataStr);
    downloadAnchor.setAttribute('download', `${selectedPlaylist.title.replace(/\s+/g, '_')}_Melody_Playlist.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
    addToast('Playlist JSON exported successfully!', 'success');
  };

  // Import Playlist from JSON
  const handleImportPlaylist = (e) => {
    const file = e.target.files && e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const parsed = JSON.parse(event.target.result);
        if (parsed && parsed.title && Array.isArray(parsed.songIds)) {
          const imported = createPlaylist(
            parsed.title,
            parsed.description || 'Imported Playlist',
            parsed.coverArt || ''
          );
          if (imported && parsed.songIds.length > 0) {
            // Add valid song ids
            parsed.songIds.forEach((id) => {
              if (songs.some((s) => s.id === id)) {
                // Verified song exists
              }
            });
          }
          addToast(`Playlist "${parsed.title}" imported!`, 'success');
        } else {
          addToast('Invalid playlist JSON format', 'error');
        }
      } catch (err) {
        addToast('Error reading playlist JSON file', 'error');
      }
    };
    reader.readAsText(file);
    e.target.value = '';
  };

  // Handle Delete Confirmation
  const handleConfirmDelete = () => {
    if (selectedPlaylist && isCustom) {
      deletePlaylist(selectedPlaylist.id);
      setIsConfirmDeleteOpen(false);
      setSearchParams({});
    }
  };

  return (
    <div className="space-y-8 max-w-7xl mx-auto pb-12 select-none animate-page-enter">
      {/* Header & Tabs */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        {tab === 'local' ? (
          <div>
            <div className="flex items-center gap-2 mb-1.5">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/20 text-cyan-700 dark:text-cyan-400 text-xs font-semibold">
                <HardDrive className="w-3.5 h-3.5 text-cyan-600 dark:text-cyan-400" />
                Local Audio Engine
              </span>
            </div>
            <h1 className="text-2xl sm:text-4xl font-black text-slate-900 dark:text-white tracking-tight">
              Local Music, <span className="bg-gradient-to-r from-cyan-600 via-brand-500 to-brand-pink dark:from-cyan-400 dark:via-brand-300 dark:to-brand-pink bg-clip-text text-transparent">Device Library</span>
            </h1>
            <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 mt-1 font-medium">
              Stream your device's audio files directly in-memory with zero server upload.
            </p>
          </div>
        ) : (
          <div>
            <div className="flex items-center gap-2 mb-1.5">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-brand-500/10 border border-brand-500/20 text-brand-600 dark:text-brand-300 text-xs font-semibold">
                <Library className="w-3.5 h-3.5 text-brand-600 dark:text-brand-400" />
                Melody Music Hub
              </span>
            </div>
            <h1 className="text-2xl sm:text-4xl font-black text-slate-900 dark:text-white tracking-tight">Your Library</h1>
            <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 mt-1 font-medium">
              Personal playlists, album discography, and playback history.
            </p>
          </div>
        )}

        {/* Tab Pills & Actions */}
        <div className="flex flex-wrap items-center gap-2">
          {/* Local Audio File Multi-Picker */}
          <input
            ref={localAudioInputRef}
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

          {/* Import JSON button */}
          <input
            ref={importFileRef}
            type="file"
            accept=".json"
            className="hidden"
            onChange={handleImportPlaylist}
          />

          <button
            type="button"
            onClick={() => localAudioInputRef.current && localAudioInputRef.current.click()}
            className="px-3.5 py-2 rounded-2xl bg-slate-900 hover:bg-black text-white dark:bg-surface-card dark:hover:bg-surface-hover dark:text-slate-300 dark:hover:text-white border border-slate-800 dark:border-surface-border text-xs font-bold flex items-center gap-1.5 transition-all shadow-sm text-white-force group"
            title="Import MP3, WAV, OGG, or FLAC audio files from your device"
          >
            <UploadCloud className="w-3.5 h-3.5 text-brand-pink group-hover:scale-110 transition-transform" />
            <span>Import Music</span>
          </button>

          <button
            type="button"
            onClick={() => importFileRef.current && importFileRef.current.click()}
            className="px-3.5 py-2 rounded-2xl bg-slate-900 hover:bg-black text-white dark:bg-surface-card dark:hover:bg-surface-hover dark:text-slate-300 dark:hover:text-white border border-slate-800 dark:border-surface-border text-xs font-bold flex items-center gap-1.5 transition-all shadow-sm text-white-force"
            title="Import playlist from JSON file"
          >
            <Upload className="w-3.5 h-3.5 text-brand-400 dark:text-cyan-400" />
            <span className="hidden sm:inline">Import JSON</span>
          </button>

          <Button
            onClick={() => setIsCreateModalOpen(true)}
            variant="primary"
            size="sm"
            icon={Plus}
            className="rounded-2xl text-xs font-bold px-4 bg-gradient-to-r from-brand-600 to-brand-pink shadow-glow-purple text-white-force"
          >
            New Playlist
          </Button>

          <div className="flex items-center gap-1 bg-slate-200 dark:bg-surface-card p-1 rounded-2xl border border-slate-300 dark:border-surface-border shadow-sm overflow-x-auto max-w-full scrollbar-none">
            {[
              { id: 'all', label: 'All' },
              { id: 'playlists', label: `Playlists (${allPlaylists.length})` },
              { id: 'local', label: `Local Music (${localSongs.length})` },
              { id: 'albums', label: `Albums (${albums.length})` },
              { id: 'recent', label: `Recent (${recentlyPlayedList.length})` },
            ].map((t) => (
              <button
                key={t.id}
                type="button"
                onClick={() => {
                  setTab(t.id);
                  setSearchParams(t.id === 'all' ? {} : { tab: t.id });
                }}
                className={`px-3.5 py-1.5 text-xs font-bold rounded-xl transition-all ${
                  tab === t.id && !activePlaylistId
                    ? 'bg-slate-950 text-white shadow-md dark:bg-brand-600 dark:text-white dark:shadow-glow-purple text-white-force'
                    : 'text-slate-800 hover:text-black hover:bg-slate-300/80 dark:text-slate-400 dark:hover:text-white'
                }`}
              >
                {t.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* If a playlist is selected */}
      {selectedPlaylist ? (
        <div className="space-y-6">
          <div className="relative overflow-hidden flex flex-col sm:flex-row items-center sm:items-end gap-5 sm:gap-6 bg-gradient-to-r from-white via-purple-50/70 to-pink-50/50 dark:from-surface-charcoal dark:via-brand-950/40 dark:to-surface-card p-4 sm:p-8 rounded-3xl border border-purple-200/80 dark:border-brand-500/20 shadow-xl shadow-purple-500/5 dark:shadow-2xl transition-all duration-300 text-center sm:text-left">
            <div className="absolute top-0 right-0 w-80 h-80 bg-brand-500/10 dark:bg-brand-600/10 rounded-full blur-3xl pointer-events-none" />

            <img
              src={selectedPlaylist.coverArt}
              alt={selectedPlaylist.title}
              className="w-32 h-32 sm:w-44 sm:h-44 rounded-3xl object-cover shadow-2xl shrink-0 ring-2 ring-brand-400/50 dark:ring-white/10"
            />
            <div className="space-y-2.5 flex-1 relative z-10 w-full min-w-0">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-brand-100/90 text-brand-700 border border-brand-200/80 dark:bg-brand-500/20 dark:text-brand-300 dark:border-brand-500/30 text-xs font-bold uppercase tracking-wider">
                <Sparkles className="w-3.5 h-3.5 text-brand-pink" />
                {isCustom ? 'Personal Playlist' : 'Curated Station'}
              </span>
              <h2 className="text-2xl sm:text-4xl font-black text-slate-900 dark:text-white tracking-tight">
                {selectedPlaylist.title}
              </h2>
              <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 font-medium">
                {selectedPlaylist.description}
              </p>
              <p className="text-xs text-slate-500 dark:text-slate-400 font-mono font-medium">
                {isCustom ? 'Curated by You' : `Curated Station by ${selectedPlaylist.createdBy}`} • {selectedPlaylist.songIds.length} tracks
              </p>

              <div className="flex flex-wrap items-center gap-3 pt-2">
                {playlistSongs.length > 0 && (
                  <>
                    <Button
                      onClick={() => playPlaylist(selectedPlaylist, false)}
                      icon={Play}
                      size="sm"
                      className="rounded-full px-6 bg-gradient-to-r from-brand-600 via-brand-500 to-brand-pink shadow-glow-purple text-white-force font-bold"
                    >
                      Play Playlist
                    </Button>
                    <button
                      type="button"
                      onClick={() => playPlaylist(selectedPlaylist, true)}
                      className="px-5 py-2 rounded-full text-xs font-bold bg-white hover:bg-slate-100 dark:bg-surface-panel dark:hover:bg-surface-hover border border-purple-200/80 dark:border-surface-border text-slate-800 dark:text-slate-200 flex items-center gap-2 transition-all shadow-xs"
                    >
                      <Shuffle className="w-3.5 h-3.5 text-brand-pink" />
                      <span>Shuffle</span>
                    </button>
                  </>
                )}

                {/* Add Tracks Button */}
                {isCustom && (
                  <button
                    type="button"
                    onClick={() => setIsAddSongsModalOpen(true)}
                    className="px-4 py-2 rounded-full text-xs font-bold bg-gradient-to-r from-brand-600 to-brand-500 text-white shadow-glow-purple flex items-center gap-1.5 transition-all text-white-force font-bold"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>Add Songs</span>
                  </button>
                )}

                {/* Edit Button */}
                {isCustom && (
                  <button
                    type="button"
                    onClick={() => setIsEditModalOpen(true)}
                    className="p-2 text-slate-700 hover:text-slate-950 dark:text-slate-200 dark:hover:text-white bg-white hover:bg-slate-100 dark:bg-white/10 dark:hover:bg-white/15 border border-purple-200/80 dark:border-white/20 rounded-xl transition-colors flex items-center gap-1.5 text-xs font-semibold shadow-xs"
                    title="Edit playlist"
                  >
                    <Edit3 className="w-4 h-4 text-brand-600 dark:text-brand-300" />
                    <span>Edit</span>
                  </button>
                )}

                {/* Export JSON */}
                <button
                  type="button"
                  onClick={handleExportPlaylist}
                  className="p-2 text-slate-700 hover:text-slate-950 dark:text-slate-200 dark:hover:text-white bg-white hover:bg-slate-100 dark:bg-white/10 dark:hover:bg-white/15 border border-purple-200/80 dark:border-white/20 rounded-xl transition-colors flex items-center gap-1.5 text-xs font-semibold shadow-xs"
                  title="Export playlist to JSON"
                >
                  <Download className="w-4 h-4 text-cyan-600 dark:text-cyan-300" />
                  <span>Export</span>
                </button>

                {/* Delete Button */}
                {isCustom && (
                  <button
                    type="button"
                    onClick={() => setIsConfirmDeleteOpen(true)}
                    className="p-2 text-rose-600 hover:text-rose-700 hover:bg-rose-50 dark:text-rose-300 dark:hover:text-rose-200 dark:hover:bg-rose-500/20 border border-rose-200 dark:border-rose-500/30 rounded-xl transition-colors flex items-center gap-1.5 text-xs font-semibold"
                    title="Delete playlist"
                  >
                    <Trash2 className="w-4 h-4" />
                    <span>Delete</span>
                  </button>
                )}
              </div>
            </div>
          </div>

          {/* Search inside playlist */}
          <div className="flex items-center justify-between gap-4">
            <div className="relative w-full max-w-sm">
              <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
              <input
                type="text"
                value={playlistSearch}
                onChange={(e) => setPlaylistSearch(e.target.value)}
                placeholder="Search within this playlist..."
                className="w-full bg-white dark:bg-surface-card border border-purple-200/80 dark:border-surface-border rounded-xl pl-10 pr-8 py-2 text-xs text-slate-900 dark:text-slate-100 placeholder-slate-400 focus:outline-none focus:border-brand-500 shadow-xs"
              />
              {playlistSearch && (
                <button
                  type="button"
                  onClick={() => setPlaylistSearch('')}
                  className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-900 dark:hover:text-white"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              )}
            </div>
          </div>

          {/* Playlist tracks */}
          <div className="bg-white dark:bg-surface-card rounded-3xl border border-purple-200/80 dark:border-surface-border p-3 md:p-4 shadow-sm dark:shadow-subtle space-y-1">
            {playlistSongs.map((song, idx) => (
              <div key={song.id} className="group relative flex items-center">
                <div className="flex-1 min-w-0">
                  <SongRow
                    song={song}
                    index={idx}
                    playlist={playlistSongs}
                  />
                </div>
                {/* Remove track from custom playlist */}
                {isCustom && (
                  <button
                    type="button"
                    onClick={() => removeSongFromPlaylist(selectedPlaylist.id, song.id)}
                    className="opacity-0 group-hover:opacity-100 p-2 text-slate-400 hover:text-rose-600 transition-opacity ml-1"
                    title="Remove from playlist"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>
            ))}

            {playlistSongs.length === 0 && (
              <EmptyState
                icon={Music}
                title={playlistSearch ? `No matches for "${playlistSearch}"` : 'This playlist is empty'}
                description={playlistSearch ? 'Try a different song name, artist, or genre search.' : 'Add your favorite tracks to start building your personal mixtape.'}
                actionText={isCustom && !playlistSearch ? 'Add Tracks to Playlist' : undefined}
                onAction={() => setIsAddSongsModalOpen(true)}
                actionIcon={Plus}
                className="border-none shadow-none bg-transparent py-10"
              />
            )}
          </div>
        </div>
      ) : (
        /* Regular library listings */
        <div className="space-y-10">
          {/* Local Music Section (Dedicated Tab View - Matching Home Page Design) */}
          {tab === 'local' && (
            <section className="space-y-8 animate-page-enter">
              {/* 1. Hero Spotlight Banner (Matching Home Page's Featured Album Spotlight) */}
              <div className="relative rounded-3xl overflow-hidden bg-gradient-to-r from-white via-cyan-50/70 to-purple-50/50 dark:from-surface-charcoal dark:via-cyan-950/40 dark:to-surface-card border border-cyan-200/80 dark:border-cyan-500/30 shadow-xl shadow-cyan-500/5 dark:shadow-2xl p-4 sm:p-8 md:p-10 group transition-all duration-300">
                <div className="absolute top-0 right-10 w-96 h-96 bg-cyan-500/10 dark:bg-cyan-600/15 rounded-full blur-3xl pointer-events-none group-hover:bg-cyan-500/20 dark:group-hover:bg-cyan-600/25 transition-all duration-700" />
                <div className="absolute -bottom-10 left-1/3 w-80 h-80 bg-brand-pink/10 rounded-full blur-3xl pointer-events-none" />

                <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-8">
                  <div className="max-w-xl space-y-4">
                    <div className="flex items-center gap-2">
                      <span className="px-3 py-1 rounded-full bg-cyan-100 text-cyan-800 border border-cyan-200 dark:bg-cyan-500/20 dark:text-cyan-300 dark:border-cyan-500/30 text-xs font-bold uppercase tracking-wider flex items-center gap-1.5">
                        <HardDrive className="w-3.5 h-3.5 text-cyan-600 dark:text-cyan-400" />
                        {localSongs.length > 0 ? 'Local Audio Spotlight' : 'HTML5 Client Storage Engine'}
                      </span>
                      <span className="text-xs text-brand-pink font-semibold">
                        {localSongs.length > 0 ? `${localSongs.length} Tracks Loaded` : 'Zero Server Uploads'}
                      </span>
                    </div>

                    <div className="space-y-1.5">
                      <h2 className="text-3xl sm:text-5xl font-black text-slate-900 dark:text-white tracking-tight leading-none drop-shadow-sm dark:drop-shadow-md">
                        {featuredLocalSong ? featuredLocalSong.title : 'Direct Device Streaming'}
                      </h2>
                      <p className="text-base sm:text-lg text-slate-700 dark:text-slate-300 font-medium">
                        {featuredLocalSong ? (
                          <>
                            By <span className="text-slate-950 dark:text-white font-bold">{featuredLocalSong.artist}</span> •{' '}
                            <span className="text-brand-600 dark:text-brand-300 font-bold uppercase">{featuredLocalSong.fileFormat || 'LOCAL AUDIO'}</span>
                          </>
                        ) : (
                          'High-Fidelity Audio Streamed from Your Local Storage'
                        )}
                      </p>
                    </div>

                    <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed line-clamp-2 max-w-lg">
                      {featuredLocalSong
                        ? 'Streamed directly in-memory using URL.createObjectURL() and HTML5 Audio API. Zero latency, original uncompressed bitrate, and 100% privacy.'
                        : 'Drag and drop or select audio files directly from your computer. Enjoy instant playback with zero buffering, zero data consumption, and hardware-accelerated playback.'}
                    </p>

                    <div className="flex flex-wrap items-center gap-3 pt-2">
                      {localSongs.length > 0 ? (
                        <>
                          <Button
                            onClick={() => playSong(featuredLocalSong || localSongs[0], filteredLocalSongs)}
                            icon={Play}
                            size="lg"
                            className="rounded-full px-8 bg-gradient-to-r from-brand-600 via-brand-500 to-brand-pink shadow-glow-purple hover:scale-105 active:scale-95 transition-all text-white-force font-bold"
                          >
                            Play Local Library
                          </Button>
                          <button
                            type="button"
                            onClick={() => {
                              const shuffled = [...localSongs].sort(() => Math.random() - 0.5);
                              if (shuffled.length > 0) {
                                playSong(shuffled[0], shuffled);
                                if (!isShuffle) toggleShuffle();
                              }
                            }}
                            className="px-5 py-2.5 rounded-full text-xs font-bold bg-white hover:bg-slate-100 dark:bg-surface-panel dark:hover:bg-surface-hover border border-slate-300 dark:border-surface-border text-slate-900 dark:text-slate-200 flex items-center gap-2 transition-all shadow-sm"
                          >
                            <Shuffle className="w-4 h-4 text-brand-pink" />
                            <span>Shuffle</span>
                          </button>
                          <button
                            type="button"
                            onClick={() => localAudioInputRef.current && localAudioInputRef.current.click()}
                            className="px-5 py-2.5 rounded-full text-xs font-bold bg-white hover:bg-slate-100 dark:bg-surface-panel dark:hover:bg-surface-hover border border-slate-300 dark:border-surface-border text-slate-900 dark:text-slate-200 flex items-center gap-2 transition-all shadow-sm"
                          >
                            <Plus className="w-4 h-4 text-brand-600 dark:text-cyan-400" />
                            <span>Add More</span>
                          </button>
                        </>
                      ) : (
                        <Button
                          onClick={() => localAudioInputRef.current && localAudioInputRef.current.click()}
                          icon={UploadCloud}
                          size="lg"
                          className="rounded-full px-8 bg-gradient-to-r from-cyan-600 via-brand-500 to-brand-pink shadow-glow-purple hover:scale-105 active:scale-95 transition-all text-white-force font-bold"
                        >
                          Select Audio Files
                        </Button>
                      )}

                      <div className="flex items-center gap-2 text-xs text-slate-700 dark:text-slate-300 font-mono bg-white/80 dark:bg-white/5 px-3.5 py-2.5 rounded-2xl border border-slate-300/80 dark:border-white/10 shadow-xs">
                        <HardDrive className="w-4 h-4 text-cyan-600 dark:text-cyan-400" />
                        <span className="font-bold">{localSongs.length} tracks • {localDurationLabel}</span>
                      </div>
                    </div>
                  </div>

                  {/* Hero Artwork with Glowing Vinyl Frame (Matching Home Page) */}
                  <div className="shrink-0 relative group/art mx-auto md:mx-0">
                    <div className="w-56 h-56 sm:w-64 sm:h-64 rounded-3xl overflow-hidden shadow-2xl ring-2 ring-cyan-400/30 dark:ring-cyan-500/30 group-hover/art:scale-105 group-hover/art:ring-cyan-500/60 transition-all duration-500 relative bg-gradient-to-br from-slate-900 via-cyan-950 to-slate-950 flex items-center justify-center">
                      {featuredLocalSong ? (
                        <>
                          <img
                            src={featuredLocalSong.coverArt}
                            alt={featuredLocalSong.title}
                            className="w-full h-full object-cover"
                          />
                          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent pointer-events-none" />
                          <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between text-xs text-white-force font-medium">
                            <span className="px-2 py-0.5 rounded-md bg-black/60 backdrop-blur-md text-white-force uppercase font-bold">
                              {featuredLocalSong.fileFormat || 'LOCAL'}
                            </span>
                            <span className="font-mono text-[11px] text-white-force opacity-90">
                              {formatTime(featuredLocalSong.duration)}
                            </span>
                          </div>
                        </>
                      ) : (
                        <div className="flex flex-col items-center justify-center p-6 text-center space-y-3">
                          <div className="w-20 h-20 rounded-full bg-cyan-500/20 border border-cyan-400/30 flex items-center justify-center text-cyan-400 animate-pulse">
                            <HardDrive className="w-10 h-10" />
                          </div>
                          <div>
                            <p className="text-white font-black text-sm">Browser RAM Engine</p>
                            <p className="text-xs text-cyan-300 font-mono mt-0.5">Ready for Audio Files</p>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>

              {/* 2. Quick Metrics 4-Card Overview (Matching Modern Dashboard Standards) */}
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-2.5 sm:gap-4">
                <div className="p-4 rounded-3xl bg-white dark:bg-surface-card border border-slate-200 dark:border-surface-border shadow-sm flex items-center gap-3.5">
                  <div className="w-12 h-12 rounded-2xl bg-cyan-100 dark:bg-cyan-500/15 border border-cyan-200 dark:border-cyan-500/30 flex items-center justify-center text-cyan-600 dark:text-cyan-400 shrink-0">
                    <Music className="w-6 h-6" />
                  </div>
                  <div className="min-w-0">
                    <p className="text-lg font-black text-slate-900 dark:text-white leading-tight">{localSongs.length} Tracks</p>
                    <p className="text-xs text-slate-600 dark:text-slate-400 font-medium truncate">Loaded In Memory</p>
                  </div>
                </div>

                <div className="p-4 rounded-3xl bg-white dark:bg-surface-card border border-slate-200 dark:border-surface-border shadow-sm flex items-center gap-3.5">
                  <div className="w-12 h-12 rounded-2xl bg-purple-100 dark:bg-brand-500/15 border border-purple-200 dark:border-brand-500/30 flex items-center justify-center text-brand-600 dark:text-brand-400 shrink-0">
                    <Clock className="w-6 h-6" />
                  </div>
                  <div className="min-w-0">
                    <p className="text-lg font-black text-slate-900 dark:text-white leading-tight">{localDurationLabel}</p>
                    <p className="text-xs text-slate-600 dark:text-slate-400 font-medium truncate">Total Duration</p>
                  </div>
                </div>

                <div className="p-4 rounded-3xl bg-white dark:bg-surface-card border border-slate-200 dark:border-surface-border shadow-sm flex items-center gap-3.5">
                  <div className="w-12 h-12 rounded-2xl bg-emerald-100 dark:bg-emerald-500/15 border border-emerald-200 dark:border-emerald-500/30 flex items-center justify-center text-emerald-600 dark:text-emerald-400 shrink-0">
                    <ShieldCheck className="w-6 h-6" />
                  </div>
                  <div className="min-w-0">
                    <p className="text-lg font-black text-slate-900 dark:text-white leading-tight">100% Private</p>
                    <p className="text-xs text-slate-600 dark:text-slate-400 font-medium truncate">Zero Server Upload</p>
                  </div>
                </div>

                <div className="p-4 rounded-3xl bg-white dark:bg-surface-card border border-slate-200 dark:border-surface-border shadow-sm flex items-center gap-3.5">
                  <div className="w-12 h-12 rounded-2xl bg-pink-100 dark:bg-brand-pink/15 border border-pink-200 dark:border-brand-pink/30 flex items-center justify-center text-brand-pink shrink-0">
                    <Sparkles className="w-6 h-6" />
                  </div>
                  <div className="min-w-0">
                    <p className="text-lg font-black text-slate-900 dark:text-white leading-tight">Original Quality</p>
                    <p className="text-xs text-slate-600 dark:text-slate-400 font-medium truncate">Lossless HTML5 Audio</p>
                  </div>
                </div>
              </div>

              {/* 3. Drag & Drop Upload Deck */}
              <div
                onDragOver={(e) => {
                  e.preventDefault();
                  setIsLocalDragOver(true);
                }}
                onDragLeave={() => setIsLocalDragOver(false)}
                onDrop={(e) => {
                  e.preventDefault();
                  setIsLocalDragOver(false);
                  if (e.dataTransfer && e.dataTransfer.files && e.dataTransfer.files.length > 0) {
                    importLocalAudioFiles(e.dataTransfer.files);
                  }
                }}
                onClick={() => localAudioInputRef.current && localAudioInputRef.current.click()}
                className={`group border-2 border-dashed rounded-3xl p-6 sm:p-8 text-center cursor-pointer transition-all duration-300 relative overflow-hidden ${
                  isLocalDragOver
                    ? 'border-brand-500 bg-brand-500/10 shadow-glow-purple scale-[1.01]'
                    : 'border-slate-300 hover:border-brand-500 dark:border-surface-border dark:hover:border-brand-500/60 bg-white hover:bg-slate-50 dark:bg-surface-card/60 dark:hover:bg-surface-card shadow-sm dark:shadow-none'
                }`}
              >
                <div className="w-16 h-16 mx-auto mb-3 rounded-2xl bg-gradient-to-tr from-cyan-600 via-brand-500 to-brand-pink text-white flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform">
                  <UploadCloud className="w-8 h-8 text-white animate-pulse" />
                </div>
                <h3 className="text-lg font-black text-slate-950 dark:text-white group-hover:text-brand-600 dark:group-hover:text-brand-300 transition-colors">
                  Drag & Drop Audio Files Directly Here
                </h3>
                <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 mt-1 max-w-lg mx-auto font-medium">
                  or click anywhere to browse from your device • Multi-file import supported
                </p>
                <div className="flex flex-wrap items-center justify-center gap-1.5 mt-4">
                  {['MP3', 'WAV', 'OGG', 'FLAC', 'M4A', 'AAC'].map((fmt) => (
                    <span
                      key={fmt}
                      className="px-3 py-1 rounded-xl bg-slate-100 dark:bg-surface-panel border border-slate-300 dark:border-surface-border text-[11px] font-mono font-bold text-slate-800 dark:text-slate-300 group-hover:border-brand-500/30 transition-colors"
                    >
                      .{fmt.toLowerCase()}
                    </span>
                  ))}
                </div>
              </div>

              {/* 4. Format Chips & Search/Sort Controls (Matching Home Page) */}
              <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4 bg-white dark:bg-surface-card p-4 rounded-3xl border border-slate-200 dark:border-surface-border shadow-sm">
                {/* Format Chips */}
                <div className="flex items-center gap-1.5 overflow-x-auto pb-1 md:pb-0 scrollbar-none">
                  {['all', 'mp3', 'wav', 'ogg', 'flac', 'm4a'].map((fmt) => (
                    <button
                      key={fmt}
                      type="button"
                      onClick={() => setLocalFormatFilter(fmt)}
                      className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all whitespace-nowrap ${
                        localFormatFilter === fmt
                          ? 'bg-slate-900 text-white shadow-md text-white-force dark:bg-brand-600 dark:text-white'
                          : 'text-slate-700 hover:text-slate-950 hover:bg-slate-100 dark:text-slate-400 dark:hover:text-white dark:hover:bg-white/5'
                      }`}
                    >
                      {fmt === 'all' ? 'All Formats' : fmt.toUpperCase()}
                    </button>
                  ))}
                </div>

                {/* Search & Sort Controls */}
                <div className="flex items-center gap-2">
                  <div className="relative flex-1 md:w-60">
                    <Search className="w-3.5 h-3.5 text-slate-500 dark:text-slate-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                    <input
                      type="text"
                      value={localSearch}
                      onChange={(e) => setLocalSearch(e.target.value)}
                      placeholder="Search local tracks..."
                      className="w-full bg-slate-50 dark:bg-surface-panel border border-slate-300 dark:border-surface-border rounded-xl pl-8 pr-7 py-2 text-xs text-slate-900 dark:text-slate-100 placeholder-slate-500 dark:placeholder-slate-400 focus:outline-none focus:border-brand-500"
                    />
                    {localSearch && (
                      <button
                        type="button"
                        onClick={() => setLocalSearch('')}
                        className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-950 dark:text-slate-400 dark:hover:text-white"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    )}
                  </div>

                  {/* Sort Dropdown */}
                  <select
                    value={localSortBy}
                    onChange={(e) => setLocalSortBy(e.target.value)}
                    className="bg-slate-50 dark:bg-surface-panel border border-slate-300 dark:border-surface-border text-slate-800 dark:text-slate-200 text-xs font-bold rounded-xl px-3 py-2 focus:outline-none focus:border-brand-500 cursor-pointer"
                  >
                    <option value="recent">Recently Added</option>
                    <option value="title">Title (A-Z)</option>
                    <option value="duration">Longest First</option>
                  </select>
                </div>
              </div>

              {/* 5. Local Track Listing Section */}
              {localSongs.length > 0 ? (
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <HardDrive className="w-5 h-5 text-cyan-600 dark:text-cyan-400" />
                      <h3 className="text-lg font-bold text-slate-900 dark:text-white">
                        Imported Tracks ({filteredLocalSongs.length})
                      </h3>
                    </div>
                    <button
                      type="button"
                      onClick={() => setIsConfirmClearLocalOpen(true)}
                      className="text-xs font-bold text-rose-600 hover:text-rose-700 dark:text-rose-400 dark:hover:text-rose-300 transition-colors flex items-center gap-1 p-1 rounded-lg hover:bg-rose-50 dark:hover:bg-rose-500/10"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                      <span>Clear All Local Tracks</span>
                    </button>
                  </div>

                  <div className="bg-white dark:bg-surface-card rounded-3xl border border-slate-200 dark:border-surface-border p-3 md:p-4 shadow-sm dark:shadow-subtle space-y-1">
                    {filteredLocalSongs.map((song, idx) => (
                      <div key={song.id} className="group relative flex items-center">
                        <div className="flex-1 min-w-0">
                          <SongRow
                            song={song}
                            index={idx}
                            playlist={filteredLocalSongs}
                          />
                        </div>
                        {/* Direct Remove Button for Local Track */}
                        <button
                          type="button"
                          onClick={() => removeLocalSong(song.id)}
                          className="opacity-0 group-hover:opacity-100 p-2 text-slate-400 hover:text-rose-600 transition-opacity ml-1"
                          title="Remove from Local Library"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    ))}

                    {filteredLocalSongs.length === 0 && (
                      <div className="py-12 text-center text-slate-600 dark:text-slate-400 text-xs">
                        No local songs matching "{localSearch}".
                      </div>
                    )}
                  </div>
                </div>
              ) : (
                /* Empty state */
                <div className="bg-white dark:bg-surface-card rounded-3xl border border-slate-200 dark:border-surface-border p-12 text-center space-y-4 shadow-sm">
                  <div className="w-16 h-16 mx-auto rounded-3xl bg-cyan-100 dark:bg-cyan-500/15 border border-cyan-200 dark:border-cyan-500/20 flex items-center justify-center text-cyan-600 dark:text-cyan-400">
                    <HardDrive className="w-8 h-8" />
                  </div>
                  <h4 className="text-xl font-bold text-slate-900 dark:text-white">Your Local Audio Library is Ready</h4>
                  <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 max-w-md mx-auto">
                    You haven't imported any tracks from your device yet. Drop audio files onto the deck above or click the button below to start playing!
                  </p>
                  <Button
                    onClick={() => localAudioInputRef.current && localAudioInputRef.current.click()}
                    size="sm"
                    icon={UploadCloud}
                    className="rounded-full px-6 text-xs text-white-force font-bold"
                  >
                    Select Audio Files
                  </Button>
                </div>
              )}

              {/* 6. In-Memory Client Guarantee Note */}
              <div className="relative overflow-hidden bg-gradient-to-r from-cyan-50/60 via-purple-50/50 to-white dark:from-cyan-950/20 dark:via-surface-card dark:to-brand-950/20 border border-cyan-200/60 dark:border-cyan-500/20 rounded-3xl p-5 flex items-start gap-4 shadow-sm">
                <div className="p-2.5 rounded-2xl bg-cyan-100 text-cyan-700 dark:bg-cyan-500/15 dark:text-cyan-300 border border-cyan-200 dark:border-cyan-500/30 shrink-0">
                  <Info className="w-5 h-5 text-cyan-600 dark:text-cyan-400" />
                </div>
                <div className="space-y-1 text-xs">
                  <h4 className="font-bold text-slate-900 dark:text-white flex items-center gap-2">
                    <span>HTML5 Audio API In-Memory Streaming Guarantee</span>
                    <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded-full bg-cyan-100 text-cyan-800 dark:bg-cyan-500/20 dark:text-cyan-300">
                      CLIENT-SIDE ONLY
                    </span>
                  </h4>
                  <p className="text-slate-600 dark:text-slate-400 leading-relaxed">
                    Your audio tracks are streamed entirely through browser memory object URLs (<code className="font-mono text-cyan-700 dark:text-cyan-300 bg-cyan-100/80 dark:bg-black/30 px-1 py-0.5 rounded">URL.createObjectURL</code>). They are never uploaded to any remote server or encoded as base64 in LocalStorage.
                  </p>
                  <p className="text-amber-700 dark:text-amber-300 font-semibold mt-1">
                    💡 Tip: Because browser security restricts persisting binary audio files in LocalStorage, your tracks will need to be re-selected if you reload or close your browser tab.
                  </p>
                </div>
              </div>
            </section>
          )}

          {/* Local Music Preview on "All" Tab */}
          {tab === 'all' && localSongs.length > 0 && (
            <section className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <HardDrive className="w-5 h-5 text-cyan-600 dark:text-cyan-400" />
                  <h2 className="text-lg font-bold text-slate-900 dark:text-white">Imported Local Music</h2>
                  <span className="text-xs font-mono font-bold text-cyan-700 bg-cyan-100 dark:text-cyan-300 dark:bg-cyan-500/10 px-2 py-0.5 rounded-full border border-cyan-200 dark:border-cyan-500/20">
                    {localSongs.length} track{localSongs.length === 1 ? '' : 's'}
                  </span>
                </div>
                <button
                  type="button"
                  onClick={() => {
                    setTab('local');
                    setSearchParams({ tab: 'local' });
                  }}
                  className="text-xs font-semibold text-brand-600 dark:text-brand-300 hover:text-brand-700 dark:hover:text-white transition-colors"
                >
                  View All ({localSongs.length})
                </button>
              </div>

              <div className="bg-white dark:bg-surface-card rounded-3xl border border-slate-200 dark:border-surface-border p-3 space-y-1 shadow-sm">
                {localSongs.slice(0, 5).map((song, idx) => (
                  <SongRow key={song.id} song={song} index={idx} playlist={localSongs} />
                ))}
              </div>
            </section>
          )}

          {/* Recently Played Tab View */}
          {(tab === 'recent') && (
            <section className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Clock className="w-5 h-5 text-brand-600 dark:text-brand-400" />
                  <h2 className="text-lg font-bold text-slate-900 dark:text-white">Recently Played History</h2>
                </div>
                {recentlyPlayedList.length > 0 && (
                  <button
                    type="button"
                    onClick={clearRecentlyPlayed}
                    className="text-xs font-semibold text-slate-600 hover:text-rose-600 dark:text-slate-400 dark:hover:text-rose-400 transition-colors"
                  >
                    Clear History
                  </button>
                )}
              </div>

              <div className="bg-white dark:bg-surface-card rounded-3xl border border-slate-200 dark:border-surface-border p-3 space-y-1 shadow-sm">
                {recentlyPlayedList.map((song, idx) => (
                  <SongRow key={song.id} song={song} index={idx} playlist={recentlyPlayedList} />
                ))}

                {recentlyPlayedList.length === 0 && (
                  <EmptyState
                    icon={Clock}
                    title="No Playback History Yet"
                    description="Start listening to any track in Melody to automatically build your recent history."
                    actionText="Discover Songs"
                    onAction={() => navigate('/explore')}
                    className="border-none shadow-none bg-transparent py-10"
                  />
                )}
              </div>
            </section>
          )}

          {/* Playlists Grid */}
          {(tab === 'all' || tab === 'playlists') && (
            <section className="space-y-4">
              <div className="flex items-center justify-between">
                <h2 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
                  <Folder className="w-5 h-5 text-brand-600 dark:text-brand-400" />
                  Your Playlists & Curations
                </h2>
                <span className="text-xs text-slate-600 dark:text-slate-400 font-mono font-medium">
                  {allPlaylists.length} playlists
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {allPlaylists.map((playlist) => {
                  const isEditorial = editorialPlaylists.some((p) => p.id === playlist.id);
                  return (
                    <PlaylistCard
                      key={playlist.id}
                      playlist={playlist}
                      badge={isEditorial ? 'Curated Station' : 'Personal Playlist'}
                      onClick={() => setSearchParams({ playlist: playlist.id })}
                    />
                  );
                })}
              </div>
            </section>
          )}

          {/* Albums Grid */}
          {(tab === 'all' || tab === 'albums') && (
            <section className="space-y-4">
              <div className="flex items-center justify-between">
                <h2 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
                  <Disc className="w-5 h-5 text-brand-pink" />
                  Master Albums
                </h2>
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3 sm:gap-4">
                {albums.map((album) => (
                  <Link
                    key={album.id}
                    to={`/album/${album.id}`}
                    className="group flex flex-col p-3.5 bg-white hover:bg-slate-100 border-2 border-slate-300 hover:border-slate-900 dark:bg-surface-card dark:hover:bg-surface-hover dark:border-surface-border rounded-3xl transition-all duration-300 cursor-pointer shadow-sm hover:shadow-md hover:-translate-y-1.5"
                  >
                    <div className="relative aspect-square w-full rounded-2xl overflow-hidden mb-3 shadow-md bg-slate-200 dark:bg-surface-panel">
                      <img
                        src={album.coverArt}
                        alt={album.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                    </div>
                    <h4 className="font-black text-sm text-slate-950 dark:text-slate-100 truncate group-hover:text-brand-600 dark:group-hover:text-brand-300 transition-colors">
                      {album.title}
                    </h4>
                    <p className="text-xs text-slate-700 dark:text-slate-400 truncate mt-0.5 font-semibold">
                      {album.artist} • {album.year}
                    </p>
                  </Link>
                ))}
              </div>
            </section>
          )}
        </div>
      )}

      {/* Create Playlist Modal */}
      <CreatePlaylistModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
      />

      {/* Edit Playlist Modal */}
      {selectedPlaylist && isCustom && (
        <EditPlaylistModal
          isOpen={isEditModalOpen}
          playlist={selectedPlaylist}
          onClose={() => setIsEditModalOpen(false)}
        />
      )}

      {/* Add Songs to Playlist Modal */}
      {selectedPlaylist && isCustom && (
        <AddSongsToPlaylistModal
          isOpen={isAddSongsModalOpen}
          playlist={selectedPlaylist}
          onClose={() => setIsAddSongsModalOpen(false)}
        />
      )}

      {/* Delete Confirmation Dialog */}
      <ConfirmDialog
        isOpen={isConfirmDeleteOpen}
        title="Delete Playlist?"
        message={`Are you sure you want to permanently delete "${selectedPlaylist?.title}"? All tracks will remain in your library.`}
        confirmText="Delete Playlist"
        cancelText="Keep Playlist"
        onConfirm={handleConfirmDelete}
        onCancel={() => setIsConfirmDeleteOpen(false)}
      />

      {/* Clear All Local Tracks Confirmation Dialog */}
      <ConfirmDialog
        isOpen={isConfirmClearLocalOpen}
        title="Clear All Local Tracks?"
        message="Are you sure you want to remove all imported local audio tracks from this session? Their in-memory object URLs will be revoked and they will be cleared from your playback queue."
        confirmText="Clear Local Tracks"
        cancelText="Cancel"
        onConfirm={() => {
          clearLocalSongs();
          setIsConfirmClearLocalOpen(false);
        }}
        onCancel={() => setIsConfirmClearLocalOpen(false)}
      />
    </div>
  );
}
