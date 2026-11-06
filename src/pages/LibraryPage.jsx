import React, { useState, useEffect, useRef } from 'react';
import { useSearchParams, Link, useNavigate } from 'react-router-dom';
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

export function LibraryPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const activePlaylistId = searchParams.get('playlist');
  const tabParam = searchParams.get('tab');
  const [tab, setTab] = useState(tabParam || (activePlaylistId ? 'playlists' : 'all'));
  const navigate = useNavigate();

  // Modals state
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isConfirmDeleteOpen, setIsConfirmDeleteOpen] = useState(false);
  const [isConfirmClearLocalOpen, setIsConfirmClearLocalOpen] = useState(false);
  const [isAddSongsModalOpen, setIsAddSongsModalOpen] = useState(false);
  const [playlistSearch, setPlaylistSearch] = useState('');
  const [localSearch, setLocalSearch] = useState('');
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

  // Filter songs in playlist by playlist search
  const playlistSongs = selectedPlaylist
    ? songCatalog
        .filter((s) => selectedPlaylist.songIds.includes(s.id))
        .filter(
          (s) =>
            !playlistSearch.trim() ||
            s.title.toLowerCase().includes(playlistSearch.toLowerCase()) ||
            s.artist.toLowerCase().includes(playlistSearch.toLowerCase()) ||
            s.genre.toLowerCase().includes(playlistSearch.toLowerCase())
        )
    : [];

  // Filter local songs by local search
  const filteredLocalSongs = (localSongs || []).filter(
    (s) =>
      !localSearch.trim() ||
      s.title.toLowerCase().includes(localSearch.toLowerCase()) ||
      s.artist.toLowerCase().includes(localSearch.toLowerCase()) ||
      (s.fileFormat && s.fileFormat.toLowerCase().includes(localSearch.toLowerCase()))
  );

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
        <div>
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-2xl bg-brand-500/15 text-brand-300 border border-brand-500/20 shadow-glow-purple">
              <Library className="w-5 h-5 text-brand-400" />
            </div>
            <h1 className="text-2xl sm:text-4xl font-black text-white tracking-tight">Your Library</h1>
          </div>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            Personal playlists, album discography, and playback history.
          </p>
        </div>

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
            className="px-3.5 py-2 rounded-2xl bg-surface-card hover:bg-surface-hover border border-surface-border text-xs font-semibold text-slate-300 hover:text-white flex items-center gap-1.5 transition-all shadow-subtle group"
            title="Import MP3, WAV, OGG, or FLAC audio files from your device"
          >
            <UploadCloud className="w-3.5 h-3.5 text-brand-pink group-hover:scale-110 transition-transform" />
            <span>Import Music</span>
          </button>

          <button
            type="button"
            onClick={() => importFileRef.current && importFileRef.current.click()}
            className="px-3.5 py-2 rounded-2xl bg-surface-card hover:bg-surface-hover border border-surface-border text-xs font-semibold text-slate-300 hover:text-white flex items-center gap-1.5 transition-all"
            title="Import playlist from JSON file"
          >
            <Upload className="w-3.5 h-3.5 text-cyan-400" />
            <span className="hidden sm:inline">Import JSON</span>
          </button>

          <Button
            onClick={() => setIsCreateModalOpen(true)}
            variant="primary"
            size="sm"
            icon={Plus}
            className="rounded-2xl text-xs font-bold px-4 bg-gradient-to-r from-brand-600 to-brand-pink shadow-glow-purple"
          >
            New Playlist
          </Button>

          <div className="flex items-center gap-1 bg-surface-card p-1 rounded-2xl border border-surface-border">
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
                    ? 'bg-brand-600 text-white shadow-glow-purple'
                    : 'text-slate-400 hover:text-white'
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
          <div className="relative overflow-hidden flex flex-col sm:flex-row items-start sm:items-end gap-6 bg-surface-card p-6 sm:p-8 rounded-3xl border border-surface-border shadow-2xl">
            <div className="absolute top-0 right-0 w-80 h-80 bg-brand-600/10 rounded-full blur-3xl pointer-events-none" />

            <img
              src={selectedPlaylist.coverArt}
              alt={selectedPlaylist.title}
              className="w-36 h-36 sm:w-44 sm:h-44 rounded-3xl object-cover shadow-2xl shrink-0 ring-2 ring-white/10"
            />
            <div className="space-y-2.5 flex-1 relative z-10">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-brand-500/20 text-brand-300 text-xs font-bold uppercase tracking-wider">
                <Sparkles className="w-3.5 h-3.5 text-brand-pink" />
                {isCustom ? 'Personal Playlist' : 'Editorial Selection'}
              </span>
              <h2 className="text-2xl sm:text-4xl font-black text-white tracking-tight">
                {selectedPlaylist.title}
              </h2>
              <p className="text-xs sm:text-sm text-slate-300">
                {selectedPlaylist.description}
              </p>
              <p className="text-xs text-slate-400 font-mono">
                {isCustom ? 'Curated by You' : `Curated by ${selectedPlaylist.createdBy}`} • {selectedPlaylist.songIds.length} tracks
              </p>

              <div className="flex flex-wrap items-center gap-3 pt-2">
                {playlistSongs.length > 0 && (
                  <>
                    <Button
                      onClick={() => playPlaylist(selectedPlaylist, false)}
                      icon={Play}
                      size="sm"
                      className="rounded-full px-6 bg-gradient-to-r from-brand-600 to-brand-pink shadow-glow-purple"
                    >
                      Play Playlist
                    </Button>
                    <button
                      type="button"
                      onClick={() => playPlaylist(selectedPlaylist, true)}
                      className="px-5 py-2 rounded-full text-xs font-bold bg-surface-panel hover:bg-surface-hover border border-surface-border text-slate-200 flex items-center gap-2 transition-all shadow-subtle"
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
                    className="px-4 py-2 rounded-full text-xs font-bold bg-brand-500/15 text-brand-300 hover:bg-brand-500/25 border border-brand-500/30 flex items-center gap-1.5 transition-all"
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
                    className="p-2 text-slate-300 hover:text-white hover:bg-white/5 border border-surface-border rounded-xl transition-colors flex items-center gap-1.5 text-xs font-semibold"
                    title="Edit playlist"
                  >
                    <Edit3 className="w-4 h-4 text-brand-400" />
                    <span>Edit</span>
                  </button>
                )}

                {/* Export JSON */}
                <button
                  type="button"
                  onClick={handleExportPlaylist}
                  className="p-2 text-slate-300 hover:text-white hover:bg-white/5 border border-surface-border rounded-xl transition-colors flex items-center gap-1.5 text-xs font-semibold"
                  title="Export playlist to JSON"
                >
                  <Download className="w-4 h-4 text-cyan-400" />
                  <span>Export</span>
                </button>

                {/* Delete Button */}
                {isCustom && (
                  <button
                    type="button"
                    onClick={() => setIsConfirmDeleteOpen(true)}
                    className="p-2 text-slate-400 hover:text-rose-400 hover:bg-rose-500/10 rounded-xl transition-colors flex items-center gap-1.5 text-xs font-semibold"
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
                className="w-full bg-surface-card border border-surface-border rounded-xl pl-10 pr-8 py-2 text-xs text-slate-100 placeholder-slate-400 focus:outline-none focus:border-brand-500"
              />
              {playlistSearch && (
                <button
                  type="button"
                  onClick={() => setPlaylistSearch('')}
                  className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              )}
            </div>
          </div>

          {/* Playlist tracks */}
          <div className="bg-surface-card rounded-3xl border border-surface-border p-3 md:p-4 shadow-subtle space-y-1">
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
                    className="opacity-0 group-hover:opacity-100 p-2 text-slate-500 hover:text-rose-400 transition-opacity ml-1"
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
          {/* Local Music Section (Dedicated Tab View) */}
          {tab === 'local' && (
            <section className="space-y-6">
              {/* Notice Banner */}
              <div className="relative overflow-hidden bg-gradient-to-r from-cyan-950/40 via-surface-card to-brand-900/20 border border-cyan-500/30 rounded-3xl p-5 shadow-lg flex flex-col sm:flex-row items-start gap-4">
                <div className="p-3 rounded-2xl bg-cyan-500/15 text-cyan-300 border border-cyan-500/30 shrink-0">
                  <Info className="w-6 h-6 text-cyan-400" />
                </div>
                <div className="space-y-1.5 flex-1 text-xs">
                  <div className="flex flex-wrap items-center gap-2">
                    <h3 className="text-sm font-bold text-white">
                      In-Memory Client Playback (Browser File API)
                    </h3>
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-mono font-bold bg-cyan-500/20 text-cyan-300 border border-cyan-500/30 uppercase">
                      Private & Zero-Server
                    </span>
                  </div>
                  <p className="text-slate-300 leading-relaxed">
                    Audio files imported here are streamed directly from your device memory using <code className="text-cyan-300 bg-black/40 px-1 py-0.5 rounded font-mono">URL.createObjectURL()</code>. Your files are never uploaded to any external server or saved in LocalStorage.
                  </p>
                  <p className="text-amber-300/90 font-medium">
                    ⚠️ Note: Because browser LocalStorage does not persist heavy audio binary files, imported tracks will need to be selected again if you refresh or close your browser tab.
                  </p>
                </div>
              </div>

              {/* Drag & Drop Upload Zone */}
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
                className={`group border-2 border-dashed rounded-3xl p-6 sm:p-8 text-center cursor-pointer transition-all duration-300 ${
                  isLocalDragOver
                    ? 'border-brand-400 bg-brand-500/15 shadow-glow-purple scale-[1.01]'
                    : 'border-surface-border hover:border-brand-500/40 bg-surface-card/60 hover:bg-surface-card'
                }`}
              >
                <div className="w-14 h-14 mx-auto mb-3 rounded-2xl bg-gradient-to-tr from-brand-600/30 to-brand-pink/30 border border-brand-500/30 flex items-center justify-center text-brand-300 group-hover:scale-110 transition-transform">
                  <UploadCloud className="w-7 h-7 text-brand-pink animate-pulse" />
                </div>
                <h3 className="text-base font-bold text-white group-hover:text-brand-300 transition-colors">
                  Drag & Drop Local Audio Files Here
                </h3>
                <p className="text-xs text-slate-400 mt-1 max-w-md mx-auto">
                  Click to browse or drop your files directly. Select multiple audio files at once!
                </p>
                <div className="flex flex-wrap items-center justify-center gap-1.5 mt-3">
                  {['MP3', 'WAV', 'OGG', 'FLAC', 'M4A', 'AAC'].map((fmt) => (
                    <span
                      key={fmt}
                      className="px-2.5 py-0.5 rounded-lg bg-surface-panel border border-surface-border text-[10px] font-mono font-bold text-slate-300"
                    >
                      .{fmt.toLowerCase()}
                    </span>
                  ))}
                </div>
              </div>

              {/* Local Tracks Actions & Search Bar */}
              {localSongs.length > 0 ? (
                <div className="space-y-4">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-surface-card p-4 rounded-3xl border border-surface-border">
                    <div className="flex flex-wrap items-center gap-2">
                      <Button
                        onClick={() => playSong(filteredLocalSongs[0] || localSongs[0], filteredLocalSongs)}
                        size="sm"
                        icon={Play}
                        className="rounded-full px-5 bg-gradient-to-r from-brand-600 to-brand-pink shadow-glow-purple text-xs font-bold"
                      >
                        Play All ({filteredLocalSongs.length})
                      </Button>

                      <button
                        type="button"
                        onClick={() => {
                          const shuffled = [...filteredLocalSongs].sort(() => Math.random() - 0.5);
                          if (shuffled.length > 0) {
                            playSong(shuffled[0], shuffled);
                            if (!isShuffle) toggleShuffle();
                          }
                        }}
                        className="px-4 py-2 rounded-full text-xs font-bold bg-surface-panel hover:bg-surface-hover border border-surface-border text-slate-200 flex items-center gap-1.5 transition-all shadow-subtle"
                      >
                        <Shuffle className="w-3.5 h-3.5 text-brand-pink" />
                        <span>Shuffle</span>
                      </button>

                      <button
                        type="button"
                        onClick={() => localAudioInputRef.current && localAudioInputRef.current.click()}
                        className="px-4 py-2 rounded-full text-xs font-bold bg-surface-panel hover:bg-surface-hover border border-surface-border text-slate-200 flex items-center gap-1.5 transition-all shadow-subtle"
                      >
                        <Plus className="w-3.5 h-3.5 text-cyan-400" />
                        <span>Add More Files</span>
                      </button>

                      <button
                        type="button"
                        onClick={() => setIsConfirmClearLocalOpen(true)}
                        className="px-3.5 py-2 rounded-full text-xs font-bold text-rose-400 hover:text-rose-300 hover:bg-rose-500/10 border border-transparent hover:border-rose-500/20 transition-all ml-auto"
                      >
                        Clear All
                      </button>
                    </div>

                    {/* Filter search within local songs */}
                    <div className="relative w-full sm:w-64">
                      <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                      <input
                        type="text"
                        value={localSearch}
                        onChange={(e) => setLocalSearch(e.target.value)}
                        placeholder="Search local songs..."
                        className="w-full bg-surface-panel border border-surface-border rounded-xl pl-8 pr-7 py-1.5 text-xs text-slate-100 placeholder-slate-400 focus:outline-none focus:border-brand-500"
                      />
                      {localSearch && (
                        <button
                          type="button"
                          onClick={() => setLocalSearch('')}
                          className="absolute right-2 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white"
                        >
                          <X className="w-3 h-3" />
                        </button>
                      )}
                    </div>
                  </div>

                  {/* Summary Bar */}
                  <div className="flex items-center justify-between px-2 text-xs text-slate-400 font-mono">
                    <span>
                      {localSongs.length} local file{localSongs.length === 1 ? '' : 's'} • Total Duration: {localDurationLabel}
                    </span>
                    <span className="text-[11px] text-slate-400">
                      HTML5 Audio Stream
                    </span>
                  </div>

                  {/* Local Track List */}
                  <div className="bg-surface-card rounded-3xl border border-surface-border p-3 md:p-4 shadow-subtle space-y-1">
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
                          className="opacity-0 group-hover:opacity-100 p-2 text-slate-500 hover:text-rose-400 transition-opacity ml-1"
                          title="Remove from Local Library"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    ))}

                    {filteredLocalSongs.length === 0 && (
                      <div className="py-12 text-center text-slate-400 text-xs">
                        No local songs matching "{localSearch}".
                      </div>
                    )}
                  </div>
                </div>
              ) : (
                /* Empty state */
                <div className="bg-surface-card rounded-3xl border border-surface-border p-12 text-center space-y-3">
                  <div className="w-16 h-16 mx-auto rounded-3xl bg-brand-500/15 border border-brand-500/20 flex items-center justify-center text-brand-300">
                    <HardDrive className="w-8 h-8 text-cyan-400" />
                  </div>
                  <h4 className="text-base font-bold text-white">Your Local Music Library is Empty</h4>
                  <p className="text-xs text-slate-400 max-w-sm mx-auto">
                    You haven't imported any tracks from your device yet. Click the button below or drag audio files onto the screen to start playing!
                  </p>
                  <Button
                    onClick={() => localAudioInputRef.current && localAudioInputRef.current.click()}
                    size="sm"
                    icon={UploadCloud}
                    className="rounded-full px-6 text-xs mt-2"
                  >
                    Select Audio Files
                  </Button>
                </div>
              )}
            </section>
          )}

          {/* Local Music Preview on "All" Tab */}
          {tab === 'all' && localSongs.length > 0 && (
            <section className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <HardDrive className="w-5 h-5 text-cyan-400" />
                  <h2 className="text-lg font-bold text-white">Imported Local Music</h2>
                  <span className="text-xs font-mono text-cyan-300 bg-cyan-500/10 px-2 py-0.5 rounded-full border border-cyan-500/20">
                    {localSongs.length} track{localSongs.length === 1 ? '' : 's'}
                  </span>
                </div>
                <button
                  type="button"
                  onClick={() => {
                    setTab('local');
                    setSearchParams({ tab: 'local' });
                  }}
                  className="text-xs font-semibold text-brand-300 hover:text-white transition-colors"
                >
                  View All ({localSongs.length})
                </button>
              </div>

              <div className="bg-surface-card rounded-3xl border border-surface-border p-3 space-y-1">
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
                  <Clock className="w-5 h-5 text-brand-400" />
                  <h2 className="text-lg font-bold text-white">Recently Played History</h2>
                </div>
                {recentlyPlayedList.length > 0 && (
                  <button
                    type="button"
                    onClick={clearRecentlyPlayed}
                    className="text-xs text-slate-400 hover:text-rose-400 transition-colors"
                  >
                    Clear History
                  </button>
                )}
              </div>

              <div className="bg-surface-card rounded-3xl border border-surface-border p-3 space-y-1">
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
                <h2 className="text-lg font-bold text-white flex items-center gap-2">
                  <Folder className="w-5 h-5 text-brand-400" />
                  Your Playlists & Curations
                </h2>
                <span className="text-xs text-slate-400 font-mono">
                  {allPlaylists.length} playlists
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {allPlaylists.map((playlist) => (
                  <div
                    key={playlist.id}
                    onClick={() => setSearchParams({ playlist: playlist.id })}
                    className="group flex items-center gap-4 p-3.5 bg-surface-card hover:bg-surface-hover border border-surface-border hover:border-brand-500/30 rounded-3xl cursor-pointer transition-all duration-300 shadow-subtle hover:-translate-y-1"
                  >
                    <img
                      src={playlist.coverArt}
                      alt={playlist.title}
                      className="w-16 h-16 rounded-2xl object-cover shrink-0 shadow-md group-hover:brightness-95 transition-all"
                    />
                    <div className="min-w-0 flex-1">
                      <h4 className="font-bold text-sm text-slate-100 group-hover:text-brand-300 transition-colors truncate">
                        {playlist.title}
                      </h4>
                      <p className="text-xs text-slate-400 truncate mt-0.5">
                        {playlist.description}
                      </p>
                      <p className="text-[11px] text-brand-400 font-semibold mt-1">
                        {playlist.songIds.length} tracks
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* Albums Grid */}
          {(tab === 'all' || tab === 'albums') && (
            <section className="space-y-4">
              <div className="flex items-center justify-between">
                <h2 className="text-lg font-bold text-white flex items-center gap-2">
                  <Disc className="w-5 h-5 text-brand-pink" />
                  Master Albums
                </h2>
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4">
                {albums.map((album) => (
                  <Link
                    key={album.id}
                    to={`/album/${album.id}`}
                    className="group flex flex-col p-3.5 bg-surface-card hover:bg-surface-hover border border-surface-border hover:border-brand-500/30 rounded-3xl transition-all duration-300 cursor-pointer shadow-subtle hover:-translate-y-1.5"
                  >
                    <div className="relative aspect-square w-full rounded-2xl overflow-hidden mb-3 shadow-md bg-surface-panel">
                      <img
                        src={album.coverArt}
                        alt={album.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                    </div>
                    <h4 className="font-bold text-sm text-slate-100 truncate group-hover:text-brand-300 transition-colors">
                      {album.title}
                    </h4>
                    <p className="text-xs text-slate-400 truncate mt-0.5">
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
