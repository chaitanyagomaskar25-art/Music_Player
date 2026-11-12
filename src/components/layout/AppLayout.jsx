import React, { useState, useRef, useEffect } from 'react';
import { Outlet } from 'react-router-dom';
import { Music, UploadCloud } from 'lucide-react';
import { Sidebar } from './Sidebar';
import { Header } from './Header';
import { MobileNav } from './MobileNav';
import { PlayerBar } from '../player/PlayerBar';
import { QueueDrawer } from '../player/QueueDrawer';
import { FullScreenPlayer } from '../player/FullScreenPlayer';
import { ToastContainer } from '../common/ToastContainer';
import { ShortcutsModal } from '../common/ShortcutsModal';
import { SongDetailsModal } from '../common/SongDetailsModal';
import { usePlayer } from '../../hooks/usePlayer';

export function AppLayout() {
  const [searchQuery, setSearchQuery] = useState('');
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isShortcutsOpen, setIsShortcutsOpen] = useState(false);
  const [isDraggingFile, setIsDraggingFile] = useState(false);
  const searchInputRef = useRef(null);
  const dragCounterRef = useRef(0);

  const {
    importLocalAudioFiles,
    isSongDetailsOpen,
    songDetailsData,
    closeSongDetails,
  } = usePlayer();

  // Focus search input
  const handleSearchFocus = () => {
    if (searchInputRef.current) {
      searchInputRef.current.focus();
    }
  };

  // Keyboard shortcut Ctrl+K and ? handlers
  useEffect(() => {
    const handleKeyDown = (e) => {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        handleSearchFocus();
      }
      if (e.key === '?' && !['INPUT', 'TEXTAREA'].includes(e.target.tagName)) {
        e.preventDefault();
        setIsShortcutsOpen((prev) => !prev);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  // Global Drag & Drop audio files handler
  useEffect(() => {
    const handleDragEnter = (e) => {
      e.preventDefault();
      dragCounterRef.current += 1;
      if (e.dataTransfer && e.dataTransfer.types.includes('Files')) {
        setIsDraggingFile(true);
      }
    };

    const handleDragLeave = (e) => {
      e.preventDefault();
      dragCounterRef.current -= 1;
      if (dragCounterRef.current <= 0) {
        setIsDraggingFile(false);
        dragCounterRef.current = 0;
      }
    };

    const handleDragOver = (e) => {
      e.preventDefault();
    };

    const handleDrop = (e) => {
      e.preventDefault();
      setIsDraggingFile(false);
      dragCounterRef.current = 0;
      if (e.dataTransfer && e.dataTransfer.files && e.dataTransfer.files.length > 0) {
        importLocalAudioFiles(e.dataTransfer.files);
      }
    };

    window.addEventListener('dragenter', handleDragEnter);
    window.addEventListener('dragleave', handleDragLeave);
    window.addEventListener('dragover', handleDragOver);
    window.addEventListener('drop', handleDrop);

    return () => {
      window.removeEventListener('dragenter', handleDragEnter);
      window.removeEventListener('dragleave', handleDragLeave);
      window.removeEventListener('dragover', handleDragOver);
      window.removeEventListener('drop', handleDrop);
    };
  }, [importLocalAudioFiles]);

  return (
    <div className="flex h-screen w-screen overflow-hidden bg-surface-base text-slate-100 font-sans selection:bg-brand-500 selection:text-white">
      {/* Sidebar: Desktop fixed & Tablet/Mobile slide-out drawer */}
      <Sidebar
        isOpen={isSidebarOpen}
        onClose={() => setIsSidebarOpen(false)}
        onSearchFocus={handleSearchFocus}
      />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 h-full overflow-hidden relative">
        <Header
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
          onMenuToggle={() => setIsSidebarOpen(true)}
          searchInputRef={searchInputRef}
          onOpenShortcuts={() => setIsShortcutsOpen(true)}
        />

        {/* Scrollable Viewport */}
        <main className="flex-1 overflow-y-auto px-3 sm:px-6 md:px-10 py-4 sm:py-6 pb-40 md:pb-28">
          <Outlet context={{ searchQuery }} />
        </main>

        {/* Bottom Sticky Player Bar */}
        <div className="fixed bottom-16 md:bottom-0 left-0 right-0 z-30">
          <PlayerBar />
        </div>

        {/* Mobile-Friendly Bottom Navigation Bar */}
        <MobileNav />
      </div>

      {/* Slide-out Queue Drawer */}
      <QueueDrawer />

      {/* Fullscreen / Lyrics Player View */}
      <FullScreenPlayer />

      {/* Keyboard Shortcuts Dialog */}
      <ShortcutsModal
        isOpen={isShortcutsOpen}
        onClose={() => setIsShortcutsOpen(false)}
      />

      {/* Track Details Information Modal */}
      <SongDetailsModal
        isOpen={isSongDetailsOpen}
        onClose={closeSongDetails}
        song={songDetailsData}
      />

      {/* Drag & Drop Audio Files Overlay */}
      {isDraggingFile && (
        <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex flex-col items-center justify-center pointer-events-none select-none border-4 border-dashed border-brand-500/80 animate-in fade-in duration-150">
          <div className="p-6 rounded-full bg-brand-500/20 text-brand-300 mb-4 animate-bounce shadow-glow-purple">
            <UploadCloud className="w-16 h-16" />
          </div>
          <h2 className="text-2xl font-black text-white">Drop Audio Files Here</h2>
          <p className="text-sm text-slate-300 mt-1 max-w-sm text-center">
            Drop any MP3, WAV, FLAC, or OGG tracks to load and play immediately in Melody!
          </p>
        </div>
      )}

      {/* Global Interactive Toast Alerts */}
      <ToastContainer />
    </div>
  );
}
