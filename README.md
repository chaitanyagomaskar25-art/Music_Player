# 🎵 Melody — Modern Premium Music Player

> A modern, responsive, and feature-complete music streaming web application built with **React**, **JSX**, **Tailwind CSS**, and the **HTML5 & Web Audio APIs**.

---

## ✨ Features Overview

### 🎧 Audio Playback Engine
- **HTML5 Audio API Integration**: Native, zero-dependency streaming with robust state management.
- **Full Player Controls**: Play, Pause, Next, Previous, Shuffle, and 3-State Repeat (`Off`, `All`, `One`).
- **Interactive Scrubber**: Seek to any timestamp or drag-to-scrub with real-time hover timestamp tooltips.
- **Volume & Speed Control**: Smooth volume slider with mute/unmute toggle and speed options (`0.5x`, `1x`, `1.25x`, `1.5x`, `2x`).
- **Error Recovery**: Automatic failure detection with informative toast notifications and graceful track skip.

### 🎚️ 5-Band Web Audio Equalizer & Visualizer
- **Real-Time Audio Processing**: Powered by Web Audio API `BiquadFilterNode` filters:
  - **Bass**: 60 Hz LowShelf
  - **Low-Mid**: 250 Hz Peaking
  - **Mid**: 1000 Hz Peaking
  - **High-Mid**: 4000 Hz Peaking
  - **Treble**: 12000 Hz HighShelf
- **Sound Profiles**: `Bass Boost`, `Classical`, `Pop`, `Rock`, `Jazz`, and `Flat`.
- **Dynamic Visualizer**: Connected to an `AnalyserNode` with 3 harmonic modes: **Bars**, **Waveform**, and **Stereo Mirror**.

### 📁 Local Music Import
- **Browser File API Streaming**: Import your own `.mp3`, `.wav`, `.ogg`, `.flac`, `.m4a`, and `.aac` audio files without uploading to any server.
- **Automatic Metadata Extraction**: Parses filenames, artist tags, file size, and exact duration.
- **Drag & Drop**: Drop audio files anywhere onto the application window to load and play immediately.
- **Memory Safety**: `URL.createObjectURL()` references are automatically revoked on removal or session clear.

### 📑 Playlist & Library Management
- **Custom Playlists**: Create, rename, edit descriptions, choose preset artwork, or supply custom image URLs.
- **Reordering & Track Removal**: Add or remove tracks seamlessly.
- **JSON Export & Import**: Backup any playlist to a `.json` file and restore it anytime.
- **Favorites & History**: Dedicated `/favorites` view and Recently Played tracking with `localStorage` persistence.

### 🎨 Premium Design & Responsiveness
- **Dark & Light Mode**: Persistent theme customization with high-contrast typography and subtle glows.
- **Full-Screen Now Playing**: Ambient cover drop-glow, synchronized lyrics with click-to-seek, and sleep timer.
- **Accessible Design**: Global keyboard shortcuts, full `focus-visible` ring indicators, and screen reader-friendly labels.
- **Fully Responsive**: Desktop fixed sidebar, tablet drawer, and mobile bottom tab navigation with docked mini-player.

---

## ⌨️ Keyboard Shortcuts

| Shortcut | Action |
| :--- | :--- |
| <kbd>Space</kbd> | Play / Pause audio |
| <kbd>→</kbd> | Next track |
| <kbd>←</kbd> | Previous track |
| <kbd>↑</kbd> | Volume Up (+5%) |
| <kbd>↓</kbd> | Volume Down (-5%) |
| <kbd>M</kbd> | Mute / Unmute audio |
| <kbd>L</kbd> | Like / Unlike current track |
| <kbd>Ctrl</kbd> + <kbd>K</kbd> | Focus global search input |
| <kbd>?</kbd> | Open Keyboard Shortcuts cheat sheet |

---

## 📂 Project Structure

```
src/
├── assets/             # Static icons & brand assets
├── components/
│   ├── common/         # Button, Card, ProgressBar, EmptyState, Skeleton, Modals, Toast
│   ├── layout/         # AppLayout, Header, Sidebar, MobileNav
│   ├── music/          # SongCard, SongRow, SongActionsDropdown
│   └── player/         # PlayerBar, FullScreenPlayer, QueueDrawer, AudioVisualizerCanvas
├── context/
│   └── PlayerContext.jsx # Global audio, queue, playlists, & theme state provider
├── data/
│   └── musicData.js    # Demo catalog: 28 tracks across 7 genres, artists, albums, playlists
├── hooks/
│   ├── useAudioPlayer.js # HTML5 Audio + Web Audio EQ & Analyser hook
│   ├── useLocalStorage.js # Persistent state sync
│   └── usePlayer.js    # Context consumer hook
├── pages/
│   ├── HomePage.jsx    # Hero, trending songs, dynamic search, artists, playlists
│   ├── ExplorePage.jsx # Multi-genre discovery, sorting, grid/list view
│   ├── LibraryPage.jsx # Playlists, local music library, album discography, history
│   ├── FavoritesPage.jsx # Dedicated Liked Songs page with play/shuffle
│   ├── ArtistPage.jsx  # Artist profile, follow status, discography
│   ├── AlbumPage.jsx   # Album tracklist & details
│   └── NotFoundPage.jsx # 404 fallback page
├── utils/
│   ├── formatters.js   # Time & number formatting
│   └── storage.js      # LocalStorage helper functions
├── App.jsx             # React Router routing configuration
├── index.css           # Tailwind directives, theme overrides, custom scrollbars
└── main.jsx            # Application entry point
```

---

## 🚀 Getting Started

### 1. Installation
Ensure you have Node.js (v18+) installed. Clone or navigate to the project directory:

```bash
cd /home/pratiksha/Desktop/Music_Player
npm install
```

### 2. Development Server
Start the local Vite development server:

```bash
npm run dev
```

Open [http://localhost:5173/](http://localhost:5173/) in your browser.

### 3. Production Build
Generate an optimized production build:

```bash
npm run build
```

Preview the production build locally:

```bash
npm run preview
```

---

## 🛡️ Privacy & Technical Constraints
- **Zero Backend**: All data (favorites, custom playlists, listening history, theme preference) is stored client-side in the browser via `localStorage`.
- **Zero Server Uploads**: Local audio files stay private on your device; playback uses browser memory `blob:` URLs with automatic garbage collection via `URL.revokeObjectURL()`.
