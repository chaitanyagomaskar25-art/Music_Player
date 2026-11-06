import React, { createContext, useState, useEffect, useCallback, useRef, useContext } from 'react';
import { songs as initialSongs } from '../data/musicData';
import { getStorageItem, setStorageItem } from '../utils/storage';
import { useAudioPlayer } from '../hooks/useAudioPlayer';

export const PlayerContext = createContext(null);

export function usePlayer() {
  const context = useContext(PlayerContext);
  if (!context) {
    throw new Error('usePlayer must be used within a PlayerProvider');
  }
  return context;
}

const STORAGE_KEYS = {
  FAVORITES: 'melody_favorites',
  VOLUME: 'melody_volume',
  MUTED: 'melody_muted',
  LAST_PLAYED: 'melody_last_played',
  USER_PLAYLISTS: 'melody_user_playlists',
  RECENTLY_PLAYED: 'melody_recently_played',
  SHUFFLE: 'melody_shuffle',
  REPEAT: 'melody_repeat',
  SPEED: 'melody_speed',
  THEME: 'melody_theme',
};

export const PRESET_PLAYLIST_COVERS = [
  { id: 'cover-1', name: 'Midnight Neon', url: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=600&q=80' },
  { id: 'cover-2', name: 'Sunset Glow', url: 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?auto=format&fit=crop&w=600&q=80' },
  { id: 'cover-3', name: 'Urban Night', url: 'https://images.unsplash.com/photo-1509198397868-475647b2a1e5?auto=format&fit=crop&w=600&q=80' },
  { id: 'cover-4', name: 'Velvet Vinyl', url: 'https://images.unsplash.com/photo-1534447677768-be436bb09401?auto=format&fit=crop&w=600&q=80' },
  { id: 'cover-5', name: 'Deep Emerald', url: 'https://images.unsplash.com/photo-1448375240586-882707db888b?auto=format&fit=crop&w=600&q=80' },
  { id: 'cover-6', name: 'Cyber Waves', url: 'https://images.unsplash.com/photo-1508700115892-45ecd05ae2ad?auto=format&fit=crop&w=600&q=80' },
];

export function PlayerProvider({ children }) {
  // Local In-Memory Imported Songs (File API / URL.createObjectURL)
  const [localSongs, setLocalSongs] = useState([]);
  const localUrlsMapRef = useRef(new Map()); // songId -> blobUrl

  // Combined Catalog (Local tracks + Built-in demo tracks)
  const allSongs = [...localSongs, ...initialSongs];

  // Revoke all created Object URLs when Provider unmounts
  useEffect(() => {
    return () => {
      localUrlsMapRef.current.forEach((url) => {
        try {
          URL.revokeObjectURL(url);
        } catch (e) {
          // ignore
        }
      });
      localUrlsMapRef.current.clear();
    };
  }, []);

  // Queue & Track state
  const [queue, setQueue] = useState(initialSongs);
  const [currentSong, setCurrentSong] = useState(() => {
    const saved = getStorageItem(STORAGE_KEYS.LAST_PLAYED, null);
    return saved ? initialSongs.find((s) => s.id === saved) || initialSongs[0] : initialSongs[0];
  });
  const [queueIndex, setQueueIndex] = useState(0);

  // Playback modes
  const [isShuffle, setIsShuffle] = useState(() => getStorageItem(STORAGE_KEYS.SHUFFLE, false));
  const [repeatMode, setRepeatMode] = useState(() => getStorageItem(STORAGE_KEYS.REPEAT, 'off')); // 'off' | 'all' | 'one'

  // Modals & Panels
  const [isQueueOpen, setIsQueueOpen] = useState(false);
  const [isFullScreenOpen, setIsFullScreenOpen] = useState(false);
  const [sleepTimerTime, setSleepTimerTime] = useState(null);
  const [sleepTimerRemaining, setSleepTimerRemaining] = useState(null);

  // Theme state ('dark' | 'light')
  const [theme, setTheme] = useState(() => getStorageItem(STORAGE_KEYS.THEME, 'dark'));

  // Song Details Modal state
  const [isSongDetailsOpen, setIsSongDetailsOpen] = useState(false);
  const [songDetailsData, setSongDetailsData] = useState(null);

  // Synchronize theme with DOM
  useEffect(() => {
    if (theme === 'light') {
      document.documentElement.classList.add('light');
      document.documentElement.classList.remove('dark');
    } else {
      document.documentElement.classList.add('dark');
      document.documentElement.classList.remove('light');
    }
    setStorageItem(STORAGE_KEYS.THEME, theme);
  }, [theme]);

  const toggleTheme = useCallback(() => {
    setTheme((prev) => {
      const next = prev === 'dark' ? 'light' : 'dark';
      return next;
    });
  }, []);

  const openSongDetails = useCallback((song) => {
    if (!song) return;
    setSongDetailsData(song);
    setIsSongDetailsOpen(true);
  }, []);

  const closeSongDetails = useCallback(() => {
    setIsSongDetailsOpen(false);
  }, []);

  // User persistent data (Favorites & Custom Playlists & Recently Played)
  const [favorites, setFavorites] = useState(() => getStorageItem(STORAGE_KEYS.FAVORITES, ['song-1', 'song-5', 'song-13']));
  const [recentlyPlayed, setRecentlyPlayed] = useState(() =>
    getStorageItem(STORAGE_KEYS.RECENTLY_PLAYED, ['song-13', 'song-1', 'song-25', 'song-5'])
  );
  const [customPlaylists, setCustomPlaylists] = useState(() =>
    getStorageItem(STORAGE_KEYS.USER_PLAYLISTS, [
      {
        id: 'user-playlist-1',
        title: 'My Daily Chill',
        description: 'Handpicked favorites for everyday focus and vibes.',
        coverArt: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?auto=format&fit=crop&w=600&q=80',
        songIds: ['song-1', 'song-13', 'song-25', 'song-21'],
        createdAt: '2024-04-01',
      },
      {
        id: 'user-playlist-2',
        title: 'Workout Energy',
        description: 'High-octane tracks for intense training sessions.',
        coverArt: 'https://images.unsplash.com/photo-1509198397868-475647b2a1e5?auto=format&fit=crop&w=600&q=80',
        songIds: ['song-5', 'song-9', 'song-15', 'song-16'],
        createdAt: '2024-04-10',
      },
    ])
  );

  // Toast Notifications
  const [toasts, setToasts] = useState([]);
  const addToast = useCallback((message, type = 'info') => {
    const id = Date.now() + Math.random().toString();
    setToasts((prev) => [...prev, { id, message, type }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 3200);
  }, []);

  const removeToast = useCallback((id) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  // Forward ref for nextSong to use in onEnded callback
  const nextSongRef = useRef(null);
  const repeatModeRef = useRef(repeatMode);
  repeatModeRef.current = repeatMode;

  // Track Ended Handler
  const handleTrackEnded = useCallback(() => {
    const mode = repeatModeRef.current;
    if (mode === 'one') {
      audioControls.seek(0);
      audioControls.play();
    } else if (nextSongRef.current) {
      nextSongRef.current(mode === 'all');
    }
  }, []);

  // Track Error Handler
  const handleTrackError = useCallback((errorMsg) => {
    addToast(`Audio playback error: ${errorMsg}. Skipping track...`, 'error');
    setTimeout(() => {
      if (nextSongRef.current) {
        nextSongRef.current(false);
      }
    }, 1500);
  }, [addToast]);

  // Underlying HTML5 Audio Player Hook (single instance preventing overlapping playback)
  const audioControls = useAudioPlayer({
    onEnded: handleTrackEnded,
    onError: handleTrackError,
  });

  // Restore saved volume, mute, speed on initial load
  useEffect(() => {
    const savedVolume = getStorageItem(STORAGE_KEYS.VOLUME, 0.8);
    const savedMuted = getStorageItem(STORAGE_KEYS.MUTED, false);
    const savedSpeed = getStorageItem(STORAGE_KEYS.SPEED, 1);

    audioControls.setVolume(savedMuted ? 0 : savedVolume);
    if (savedSpeed !== 1) {
      audioControls.setPlaybackSpeed(savedSpeed);
    }
  }, []);

  // Sync index when currentSong or queue changes
  useEffect(() => {
    if (!currentSong) return;
    const idx = queue.findIndex((s) => s.id === currentSong.id);
    if (idx !== -1) {
      setQueueIndex(idx);
    }
  }, [currentSong, queue]);

  // Persist volume & muted
  useEffect(() => {
    setStorageItem(STORAGE_KEYS.VOLUME, audioControls.volume);
    setStorageItem(STORAGE_KEYS.MUTED, audioControls.isMuted);
  }, [audioControls.volume, audioControls.isMuted]);

  // Persist playback settings
  useEffect(() => {
    setStorageItem(STORAGE_KEYS.SHUFFLE, isShuffle);
  }, [isShuffle]);

  useEffect(() => {
    setStorageItem(STORAGE_KEYS.REPEAT, repeatMode);
  }, [repeatMode]);

  useEffect(() => {
    setStorageItem(STORAGE_KEYS.SPEED, audioControls.playbackSpeed);
  }, [audioControls.playbackSpeed]);

  // Persist favorites & playlists & recently played
  useEffect(() => {
    setStorageItem(STORAGE_KEYS.FAVORITES, favorites);
  }, [favorites]);

  useEffect(() => {
    setStorageItem(STORAGE_KEYS.USER_PLAYLISTS, customPlaylists);
  }, [customPlaylists]);

  useEffect(() => {
    setStorageItem(STORAGE_KEYS.RECENTLY_PLAYED, recentlyPlayed);
  }, [recentlyPlayed]);

  useEffect(() => {
    if (currentSong?.id) {
      setStorageItem(STORAGE_KEYS.LAST_PLAYED, currentSong.id);
    }
  }, [currentSong]);

  // Play a specific song and optionally replace the queue
  const playSong = useCallback(
    (song, customQueue = null) => {
      if (!song) return;

      if (customQueue && Array.isArray(customQueue)) {
        setQueue(customQueue);
        const idx = customQueue.findIndex((s) => s.id === song.id);
        setQueueIndex(idx !== -1 ? idx : 0);
      }

      setCurrentSong(song);
      audioControls.loadAndPlay(song.audioUrl, true);

      // Record in recently played history
      setRecentlyPlayed((prev) => {
        const withoutCurrent = prev.filter((id) => id !== song.id);
        const updated = [song.id, ...withoutCurrent].slice(0, 50);
        setStorageItem(STORAGE_KEYS.RECENTLY_PLAYED, updated);
        return updated;
      });
    },
    [audioControls]
  );

  // Play an entire playlist (sequential or shuffled)
  const playPlaylist = useCallback(
    (playlist, shuffle = false) => {
      if (!playlist) return;
      const combined = [...localSongs, ...initialSongs];
      const playlistSongs = combined.filter((s) => playlist.songIds.includes(s.id));
      if (playlistSongs.length === 0) {
        addToast('This playlist has no songs to play yet.', 'info');
        return;
      }

      if (shuffle) {
        const shuffledList = [...playlistSongs].sort(() => Math.random() - 0.5);
        playSong(shuffledList[0], shuffledList);
        setIsShuffle(true);
        addToast(`Shuffling "${playlist.title}"`, 'success');
      } else {
        playSong(playlistSongs[0], playlistSongs);
        addToast(`Playing "${playlist.title}"`, 'success');
      }
    },
    [playSong, addToast]
  );

  // Play next track
  const nextSong = useCallback(
    (allowLoop = true) => {
      if (queue.length === 0) return;

      if (isShuffle) {
        let randomIndex = Math.floor(Math.random() * queue.length);
        if (queue.length > 1 && randomIndex === queueIndex) {
          randomIndex = (randomIndex + 1) % queue.length;
        }
        playSong(queue[randomIndex]);
        return;
      }

      if (queueIndex < queue.length - 1) {
        playSong(queue[queueIndex + 1]);
      } else if (allowLoop || repeatMode === 'all') {
        playSong(queue[0]);
      } else {
        audioControls.pause();
      }
    },
    [queue, queueIndex, isShuffle, repeatMode, playSong, audioControls]
  );

  nextSongRef.current = nextSong;

  // Play previous track
  const prevSong = useCallback(() => {
    if (queue.length === 0) return;

    if (audioControls.currentTime > 3) {
      audioControls.seek(0);
      return;
    }

    const prevIdx = queueIndex === 0 ? queue.length - 1 : queueIndex - 1;
    playSong(queue[prevIdx]);
  }, [queue, queueIndex, audioControls, playSong]);

  // Toggle Shuffle
  const toggleShuffle = useCallback(() => {
    setIsShuffle((prev) => {
      const next = !prev;
      addToast(next ? 'Shuffle turned on' : 'Shuffle turned off', 'info');
      return next;
    });
  }, [addToast]);

  // Cycle Repeat: 'off' -> 'all' -> 'one' -> 'off'
  const toggleRepeat = useCallback(() => {
    setRepeatMode((prev) => {
      if (prev === 'off') {
        addToast('Repeat all tracks', 'info');
        return 'all';
      }
      if (prev === 'all') {
        addToast('Repeat current track', 'info');
        return 'one';
      }
      addToast('Repeat off', 'info');
      return 'off';
    });
  }, [addToast]);

  // Set explicit repeat mode
  const setRepeat = useCallback((mode) => {
    if (['off', 'all', 'one'].includes(mode)) {
      setRepeatMode(mode);
    }
  }, []);

  // Favorites toggle
  const toggleFavorite = useCallback(
    (songId) => {
      setFavorites((prev) => {
        const exists = prev.includes(songId);
        if (exists) {
          addToast('Removed from Liked Songs', 'info');
          return prev.filter((id) => id !== songId);
        } else {
          addToast('Added to Liked Songs ❤️', 'success');
          return [...prev, songId];
        }
      });
    },
    [addToast]
  );

  const isFavorite = useCallback(
    (songId) => {
      return favorites.includes(songId);
    },
    [favorites]
  );

  // Clear recently played history
  const clearRecentlyPlayed = useCallback(() => {
    setRecentlyPlayed([]);
    setStorageItem(STORAGE_KEYS.RECENTLY_PLAYED, []);
    addToast('Playback history cleared', 'info');
  }, [addToast]);

  // Queue manipulations
  const addToQueue = useCallback(
    (song) => {
      if (!song) return;
      setQueue((prev) => [...prev, song]);
      addToast(`"${song.title}" added to queue`, 'success');
    },
    [addToast]
  );

  const playNext = useCallback(
    (song) => {
      if (!song) return;
      setQueue((prev) => {
        const nextQueue = [...prev];
        nextQueue.splice(queueIndex + 1, 0, song);
        return nextQueue;
      });
      addToast(`"${song.title}" will play next`, 'success');
    },
    [queueIndex, addToast]
  );

  const removeFromQueue = useCallback((index) => {
    setQueue((prev) => {
      if (index < 0 || index >= prev.length) return prev;
      return prev.filter((_, i) => i !== index);
    });
  }, []);

  const clearQueue = useCallback(() => {
    if (!currentSong) return;
    setQueue([currentSong]);
    setQueueIndex(0);
    addToast('Queue cleared', 'info');
  }, [currentSong, addToast]);

  const moveInQueue = useCallback((fromIndex, toIndex) => {
    setQueue((prev) => {
      if (fromIndex < 0 || fromIndex >= prev.length || toIndex < 0 || toIndex >= prev.length) return prev;
      const next = [...prev];
      const [moved] = next.splice(fromIndex, 1);
      next.splice(toIndex, 0, moved);
      return next;
    });
  }, []);

  // Helper: Extract audio duration asynchronously via HTML5 Audio
  const getAudioDuration = (blobUrl) => {
    return new Promise((resolve) => {
      const tempAudio = new Audio();
      let isDone = false;

      const finish = (durationSec) => {
        if (isDone) return;
        isDone = true;
        tempAudio.removeEventListener('loadedmetadata', onLoaded);
        tempAudio.removeEventListener('error', onError);
        resolve(durationSec || 0);
      };

      const onLoaded = () => {
        const sec = Math.round(tempAudio.duration) || 0;
        finish(sec);
      };

      const onError = () => {
        finish(0);
      };

      tempAudio.addEventListener('loadedmetadata', onLoaded);
      tempAudio.addEventListener('error', onError);

      // 4-second fallback safeguard in case browser metadata read lags
      setTimeout(() => {
        finish(0);
      }, 4000);

      tempAudio.src = blobUrl;
    });
  };

  // Helper: Format file size
  const formatFileSize = (bytes) => {
    if (!bytes) return '';
    if (bytes < 1024 * 1024) {
      return `${(bytes / 1024).toFixed(1)} KB`;
    }
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  };

  // Helper: Check if file is a supported audio format
  const isAudioFile = (file) => {
    if (file.type && file.type.startsWith('audio/')) return true;
    return /\.(mp3|wav|ogg|oga|m4a|aac|flac|opus|weba|webm)$/i.test(file.name);
  };

  // Preset covers for local imported tracks
  const LOCAL_COVERS = [
    'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?auto=format&fit=crop&w=600&q=80',
    'https://images.unsplash.com/photo-1470225620780-dba8ba36b745?auto=format&fit=crop&w=600&q=80',
    'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?auto=format&fit=crop&w=600&q=80',
    'https://images.unsplash.com/photo-1498038432885-c6f3f1b912ee?auto=format&fit=crop&w=600&q=80',
    'https://images.unsplash.com/photo-1508700115892-45ecd05ae2ad?auto=format&fit=crop&w=600&q=80',
  ];

  // Local Audio Files Importer (Drag & Drop or File Input)
  const importLocalAudioFiles = useCallback(
    async (files) => {
      if (!files || files.length === 0) return;

      const fileList = Array.from(files);
      const validFiles = [];
      const rejectedFiles = [];

      fileList.forEach((file) => {
        if (isAudioFile(file)) {
          validFiles.push(file);
        } else {
          rejectedFiles.push(file.name);
        }
      });

      // Show warning/error for rejected unsupported files
      if (rejectedFiles.length > 0) {
        if (validFiles.length === 0) {
          addToast(
            `Unsupported format: ${rejectedFiles.slice(0, 2).join(', ')}${
              rejectedFiles.length > 2 ? ` (+${rejectedFiles.length - 2} more)` : ''
            }. Supported: MP3, WAV, OGG, FLAC, M4A, AAC.`,
            'error'
          );
          return;
        } else {
          addToast(
            `${rejectedFiles.length} non-audio file(s) skipped (unsupported format).`,
            'warning'
          );
        }
      }

      // Extract metadata & duration concurrently for all valid files
      const loadedTracks = await Promise.all(
        validFiles.map(async (file, i) => {
          const blobUrl = URL.createObjectURL(file);
          const extMatch = file.name.match(/\.([^.]+)$/);
          const ext = extMatch ? extMatch[1].toUpperCase() : 'AUDIO';
          const nameWithoutExt = file.name.replace(/\.[^/.]+$/, '');

          let artist = 'Local Artist';
          let songTitle = nameWithoutExt;

          // Parse common "Artist - Title" filename convention
          if (nameWithoutExt.includes(' - ')) {
            const parts = nameWithoutExt.split(' - ');
            if (parts.length >= 2) {
              artist = parts[0].trim();
              songTitle = parts.slice(1).join(' - ').trim();
            }
          }

          const songId = `local-${Date.now()}-${i}-${Math.random().toString(36).substring(2, 6)}`;
          localUrlsMapRef.current.set(songId, blobUrl);

          const duration = await getAudioDuration(blobUrl);

          return {
            id: songId,
            title: songTitle || 'Untitled Track',
            artist: artist || 'Local Artist',
            album: 'Local Import',
            duration: duration > 0 ? duration : 180,
            genre: 'Local Audio',
            coverArt: LOCAL_COVERS[i % LOCAL_COVERS.length],
            audioUrl: blobUrl,
            isLocal: true,
            fileFormat: ext,
            fileSize: formatFileSize(file.size),
            fileName: file.name,
            importedAt: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          };
        })
      );

      // Add to local state and playback queue
      setLocalSongs((prev) => [...loadedTracks, ...prev]);
      setQueue((prev) => [...loadedTracks, ...prev]);

      if (loadedTracks.length > 0) {
        playSong(loadedTracks[0]);
        addToast(
          `Imported ${loadedTracks.length} local audio track${loadedTracks.length === 1 ? '' : 's'}!`,
          'success'
        );
      }
    },
    [playSong, addToast]
  );

  // Remove a single local song and revoke its object URL
  const removeLocalSong = useCallback(
    (songId) => {
      const track = localSongs.find((s) => s.id === songId);
      const blobUrl = localUrlsMapRef.current.get(songId) || track?.audioUrl;

      if (blobUrl) {
        try {
          URL.revokeObjectURL(blobUrl);
        } catch (e) {
          // ignore
        }
        localUrlsMapRef.current.delete(songId);
      }

      setLocalSongs((prev) => prev.filter((s) => s.id !== songId));
      setQueue((prev) => prev.filter((s) => s.id !== songId));

      if (currentSong?.id === songId) {
        nextSong();
      }

      if (track) {
        addToast(`Removed "${track.title}" from local library`, 'info');
      }
    },
    [localSongs, currentSong, nextSong, addToast]
  );

  // Clear all local songs and revoke all object URLs
  const clearLocalSongs = useCallback(() => {
    localUrlsMapRef.current.forEach((url) => {
      try {
        URL.revokeObjectURL(url);
      } catch (e) {
        // ignore
      }
    });
    localUrlsMapRef.current.clear();

    setLocalSongs([]);
    setQueue((prev) => prev.filter((s) => !s.isLocal));

    if (currentSong?.isLocal) {
      nextSong();
    }

    addToast('Cleared all local imported tracks', 'info');
  }, [currentSong, nextSong, addToast]);

  // Custom Playlists Management
  const createPlaylist = useCallback(
    (title, description = '', coverArt = '') => {
      const trimmed = title.trim();
      if (!trimmed) return null;
      const fallbackCover = PRESET_PLAYLIST_COVERS[Math.floor(Math.random() * PRESET_PLAYLIST_COVERS.length)].url;
      const newPlaylist = {
        id: `user-playlist-${Date.now()}`,
        title: trimmed,
        description: description.trim() || 'Custom playlist created on Melody',
        coverArt: coverArt.trim() || fallbackCover,
        songIds: [],
        createdAt: new Date().toISOString().slice(0, 10),
      };
      setCustomPlaylists((prev) => [newPlaylist, ...prev]);
      addToast(`Playlist "${trimmed}" created!`, 'success');
      return newPlaylist;
    },
    [addToast]
  );

  const updatePlaylist = useCallback(
    (playlistId, updates) => {
      setCustomPlaylists((prev) =>
        prev.map((pl) => (pl.id === playlistId ? { ...pl, ...updates } : pl))
      );
      addToast('Playlist updated successfully!', 'success');
    },
    [addToast]
  );

  const deletePlaylist = useCallback(
    (playlistId) => {
      setCustomPlaylists((prev) => prev.filter((p) => p.id !== playlistId));
      addToast('Playlist removed', 'info');
    },
    [addToast]
  );

  const addSongToPlaylist = useCallback(
    (playlistId, songId) => {
      setCustomPlaylists((prev) =>
        prev.map((pl) => {
          if (pl.id !== playlistId) return pl;
          if (pl.songIds.includes(songId)) {
            addToast('Track is already in this playlist', 'info');
            return pl;
          }
          addToast(`Added track to "${pl.title}"`, 'success');
          return { ...pl, songIds: [...pl.songIds, songId] };
        })
      );
    },
    [addToast]
  );

  const removeSongFromPlaylist = useCallback(
    (playlistId, songId) => {
      setCustomPlaylists((prev) =>
        prev.map((pl) => {
          if (pl.id !== playlistId) return pl;
          return { ...pl, songIds: pl.songIds.filter((id) => id !== songId) };
        })
      );
      addToast('Song removed from playlist', 'info');
    },
    [addToast]
  );

  // Sleep Timer countdown & tick
  useEffect(() => {
    if (!sleepTimerTime) {
      setSleepTimerRemaining(null);
      return;
    }

    const updateRemaining = () => {
      const remainingMs = sleepTimerTime - Date.now();
      if (remainingMs <= 0) {
        audioControls.pause();
        setSleepTimerTime(null);
        setSleepTimerRemaining(null);
        addToast('Sleep timer reached. Music paused.', 'info');
      } else {
        const totalSec = Math.ceil(remainingMs / 1000);
        const mins = Math.floor(totalSec / 60);
        const secs = totalSec % 60;
        setSleepTimerRemaining(`${mins}:${secs < 10 ? '0' : ''}${secs}`);
      }
    };

    updateRemaining();
    const interval = setInterval(updateRemaining, 1000);
    return () => clearInterval(interval);
  }, [sleepTimerTime, audioControls, addToast]);

  const setSleepTimer = useCallback(
    (minutes) => {
      if (!minutes || minutes <= 0) {
        setSleepTimerTime(null);
        setSleepTimerRemaining(null);
        addToast('Sleep timer turned off.', 'info');
        return;
      }
      const target = Date.now() + minutes * 60 * 1000;
      setSleepTimerTime(target);
      addToast(`Sleep timer set for ${minutes} minutes.`, 'success');
    },
    [addToast]
  );

  // Global Keyboard Shortcuts
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (['INPUT', 'TEXTAREA'].includes(e.target.tagName)) return;

      switch (e.code) {
        case 'Space':
          e.preventDefault();
          audioControls.togglePlay();
          break;
        case 'ArrowRight':
          e.preventDefault();
          nextSong();
          break;
        case 'ArrowLeft':
          e.preventDefault();
          prevSong();
          break;
        case 'ArrowUp':
          e.preventDefault();
          audioControls.setVolume(Math.min(1, Math.round((audioControls.volume + 0.05) * 100) / 100));
          break;
        case 'ArrowDown':
          e.preventDefault();
          audioControls.setVolume(Math.max(0, Math.round((audioControls.volume - 0.05) * 100) / 100));
          break;
        case 'KeyM':
          audioControls.toggleMute();
          break;
        case 'KeyL':
          if (currentSong) toggleFavorite(currentSong.id);
          break;
        default:
          break;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [audioControls, nextSong, prevSong, currentSong, toggleFavorite]);

  return (
    <PlayerContext.Provider
      value={{
        currentSong,
        isPlaying: audioControls.isPlaying,
        currentTime: audioControls.currentTime,
        duration: audioControls.duration,
        isLoading: audioControls.isLoading,
        audioError: audioControls.audioError,
        volume: audioControls.volume,
        isMuted: audioControls.isMuted,
        playbackSpeed: audioControls.playbackSpeed,
        isShuffle,
        repeatMode,
        queue,
        queueIndex,
        favorites,
        customPlaylists,
        recentlyPlayed,
        localSongs,
        allSongs,
        toasts,
        isQueueOpen,
        isFullScreenOpen,
        sleepTimerTime,
        sleepTimerRemaining,
        theme,
        toggleTheme,
        isSongDetailsOpen,
        songDetailsData,
        openSongDetails,
        closeSongDetails,
        eqGains: audioControls.eqGains,
        activeEqPreset: audioControls.activeEqPreset,
        applyEqPreset: audioControls.applyEqPreset,
        setCustomEqBand: audioControls.setCustomEqBand,
        getFrequencyData: audioControls.getFrequencyData,
        EQ_PRESETS: audioControls.EQ_PRESETS,
        playSong,
        playPlaylist,
        togglePlay: audioControls.togglePlay,
        play: audioControls.play,
        pause: audioControls.pause,
        nextSong,
        prevSong,
        seek: audioControls.seek,
        setVolume: audioControls.setVolume,
        toggleMute: audioControls.toggleMute,
        setPlaybackSpeed: audioControls.setPlaybackSpeed,
        toggleShuffle,
        toggleRepeat,
        setRepeat,
        toggleFavorite,
        isFavorite,
        clearRecentlyPlayed,
        setQueue,
        addToQueue,
        playNext,
        removeFromQueue,
        clearQueue,
        moveInQueue,
        createPlaylist,
        updatePlaylist,
        deletePlaylist,
        addSongToPlaylist,
        removeSongFromPlaylist,
        importLocalAudioFiles,
        removeLocalSong,
        clearLocalSongs,
        addToast,
        removeToast,
        setIsQueueOpen,
        setIsFullScreenOpen,
        setSleepTimer,
      }}
    >
      {children}
    </PlayerContext.Provider>
  );
}
