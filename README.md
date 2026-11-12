# 🎵 Melody — Modern Hi-Fi Web Music Player

> A feature-rich, high-performance, and responsive music streaming web application built with **React 18**, **Tailwind CSS**, **Lucide Icons**, and the **HTML5 & Web Audio APIs**. Designed with a luminous glassmorphic aesthetic across both light and dark themes.

---

## 📸 Overview & Key Highlights

Melody delivers an immersive audio streaming and library management experience right in your browser with zero backend requirements:

- **⚡ Fast & Zero-Latency**: Instant playback powered by standard HTML5 Audio with fallback harmonic visualizers.
- **🎛️ 5-Band Studio Equalizer**: Live audio processing with Web Audio API `BiquadFilterNode` filters and 6 sound presets.
- **📁 Local File Studio**: Drag & drop or select `.mp3`, `.wav`, `.ogg`, `.flac`, `.m4a`, and `.aac` audio files with zero server uploads.
- **🌓 Dual Theme Architecture**: Clean, high-contrast ambient purple/pink glassmorphism in Light Mode and a deep neon charcoal experience in Dark Mode.
- **📱 Fully Responsive**: Tailored layouts across mobile smartphones, tablets, laptops, and ultra-wide desktop monitors.
- **💾 Client-Side Persistence**: Playlists, favorites, listening history, volume, and playback preferences saved securely via `localStorage`.
- **🧪 100% Tested**: Complete 34-point automated test suite validating catalog relationships, utility functions, playback modes, and queue manipulation.

---

## ✨ Features Breakdown

### 🎧 1. Audio Playback Engine
- **HTML5 Audio Integration**: Direct audio streaming that circumvents cross-origin network restrictions.
- **Full Player Controls**: Play, Pause, Next, Previous, Shuffle, and 3-State Repeat cycle (`Off` ➔ `All` ➔ `One`).
- **Interactive Scrubber Bar**: Smooth progress tracking with drag-to-seek, hover time tooltips, and buffered duration.
- **Volume & Playback Speed**: Granular volume slider (with mute/unmute toggle) and playback rate speeds (`0.5x`, `1x`, `1.25x`, `1.5x`, `2x`).
- **Sleep Timer**: Built-in countdown timer (`15 min`, `30 min`, `45 min`, `60 min`, `End of Track`) to automatically fade and pause music.
- **Queue Drawer**: Slide-out playback queue with drag-and-drop reordering, instant removal, and one-click queue clearing.

### 🎚️ 2. Studio Equalizer & Live Visualizer
- **Web Audio API BiquadFilter Engine**:
  - **Bass**: 60 Hz LowShelf filter
  - **Low-Mid**: 250 Hz Peaking filter
  - **Mid**: 1000 Hz Peaking filter
  - **High-Mid**: 4000 Hz Peaking filter
  - **Treble**: 12000 Hz HighShelf filter
- **Sound Presets**: `Flat`, `Bass Boost`, `Rock`, `Pop`, `Classical`, and `Jazz`.
- **Audio Visualizer**: Connected to an `AnalyserNode` with interactive canvas renderers and an automated harmonic wave fallback when streaming remote tracks.

### 📂 3. Local Music Studio (Private & Offline)
- **Zero Server Uploads**: Direct client-side streaming using `URL.createObjectURL()`.
- **Multi-Format Support**: Reads `.mp3`, `.wav`, `.ogg`, `.flac`, `.m4a`, and `.aac` files.
- **Automatic Metadata Extraction**: Automatically parses title, artist name, track length, and bitrate in-memory.
- **Drag & Drop Anywhere**: Global dropzone allows dropping audio files straight into any view.
- **Memory Safety**: Object URLs are tracked and automatically revoked on removal or clear.

### 📑 4. Playlist & Library Curation
- **Personal Playlists**: Create, edit titles, add descriptions, select preset artwork, or supply custom image URLs.
- **In-Card Track Management**: Add songs to playlists via the track actions dropdown menu with intuitive inline submenu navigation.
- **JSON Backup & Restore**: Export any custom playlist to a `.json` backup file and import it anytime.
- **Dedicated Liked Songs (`/favorites`)**: Quick filter by genre, sort by duration/title/artist, and play/shuffle favorites.

### 🎨 5. Responsive Design & Light/Dark Theme
- **Consistent Light & Dark Modes**: Carefully tuned color palette:
  - *Light Mode*: Luminous purple-to-pink gradient backgrounds (`from-white via-purple-50/70 to-pink-50/50`), crisp dark slate typography (`text-slate-900`), and soft purple borders.
  - *Dark Mode*: Deep charcoal panels (`bg-surface-charcoal`), glowing pink/purple accents, and subtle glassmorphic drop-shadows.
- **Adaptive Layout**:
  - Desktop: Fixed sidebar with instant navigation and studio capsule controls.
  - Tablet/Mobile: Slide-out drawer navigation, floating studio control sheet, and a fixed bottom tab bar.
- **Responsive Dropdowns**: The first-column more-options menu automatically calculates available viewport width and clamps positioning to ensure menu items are never clipped by the sidebar.

---

## ⌨️ Global Keyboard Shortcuts

Control playback from anywhere in the application:

| Shortcut | Action |
| :--- | :--- |
| <kbd>Space</kbd> | Play / Pause current track |
| <kbd>→</kbd> | Skip to next track in queue |
| <kbd>←</kbd> | Return to previous track |
| <kbd>↑</kbd> | Increase volume (+5%) |
| <kbd>↓</kbd> | Decrease volume (-5%) |
| <kbd>M</kbd> | Toggle Mute / Unmute |
| <kbd>L</kbd> | Add / Remove current track from Liked Songs |
| <kbd>Ctrl</kbd> + <kbd>K</kbd> | Focus global search bar |
| <kbd>?</kbd> | Toggle Keyboard Shortcuts dialog |

---

## 🏗️ Architecture & Component Hierarchy

```
src/
├── assets/                  # Brand assets and styling icons
├── components/
│   ├── common/              # Reusable core design system
│   │   ├── BackButton.jsx   # Consistent back-navigation button
│   │   ├── Badge.jsx        # Status pills and metadata badges
│   │   ├── Button.jsx       # Standard gradient and ghost buttons
│   │   ├── Card.jsx         # Elevated container with hover animations
│   │   ├── ConfirmDialog.jsx# Delete confirmation alert modal
│   │   ├── EmptyState.jsx   # Friendly empty search/library states
│   │   ├── Modal.jsx        # Base accessible dialog with backdrop & ESC listener
│   │   ├── ProgressBar.jsx  # Interactive seek bar with hover tooltip
│   │   ├── ShortcutsModal.jsx # Keyboard shortcut cheat sheet
│   │   ├── Skeleton.jsx     # Loading shimmer skeletons
│   │   ├── SongDetailsModal.jsx # Audio specs & metadata inspector
│   │   └── ToastContainer.jsx   # Animated toast alerts
│   ├── layout/              # App chrome & scaffolding
│   │   ├── AppLayout.jsx    # Master shell (Header, Sidebar, Main, PlayerBar)
│   │   ├── Header.jsx       # Search input, studio capsule, EQ menu, user profile
│   │   ├── MobileNav.jsx    # Mobile bottom navigation bar
│   │   └── Sidebar.jsx      # Primary sidebar navigation & playlist bookmarks
│   ├── music/               # Song presentation components
│   │   ├── PlaylistCard.jsx # Reusable playlist card with play overlay
│   │   ├── SongActionsDropdown.jsx # Responsive 3-dots actions menu
│   │   ├── SongCard.jsx     # Grid presentation card (memoized)
│   │   └── SongRow.jsx      # Compact list row presentation (memoized)
│   └── player/              # Playback UI components
│       ├── AudioVisualizerCanvas.jsx # Multi-mode real-time visualizer canvas
│       ├── FullScreenPlayer.jsx      # Immersive full-screen player with lyrics
│       ├── PlayerBar.jsx             # Persistent bottom audio dock
│       └── QueueDrawer.jsx           # Slide-out queue manager
├── context/
│   └── PlayerContext.jsx    # Global player state, queue, playlists, & theme
├── data/
│   └── musicData.js         # Curated catalog: 28 songs, 7 genres, artists, albums
├── hooks/
│   ├── useAudioPlayer.js    # HTML5 Audio & Web Audio API hook
│   ├── useLocalStorage.js   # LocalStorage sync hook
│   └── usePlayer.js         # Context consumer hook
├── pages/
│   ├── HomePage.jsx         # Trending tracks, quick search, featured artists
│   ├── ExplorePage.jsx      # Genre discovery, search filters, grid/list toggle
│   ├── LibraryPage.jsx      # Playlists, local music studio, discography, history
│   ├── FavoritesPage.jsx    # Liked songs view with filter & shuffle
│   ├── ArtistPage.jsx       # Artist biography, discography, & follow toggle
│   ├── AlbumPage.jsx        # Album tracklist & details
│   └── NotFoundPage.jsx     # 404 fallback page
├── utils/
│   ├── formatters.js        # Timestamp & number formatters
│   └── storage.js           # Safe LocalStorage accessors
├── App.jsx                  # React Router configuration (v7-ready)
├── index.css                # Tailwind base directives & custom scrollbars
└── main.jsx                 # React root entry point
```

---

## ⚡ Performance Optimizations

1. **Component Memoization (`React.memo`)**:
   - `SongRow` and `SongCard` are memoized to eliminate unnecessary re-renders across long lists during playback time ticks.
2. **Reusable Component Architecture**:
   - Consolidated modal backdrops, headers, and keyboard handlers into `Modal.jsx`, saving ~6 KB in production bundle size.
   - Centralized `PlaylistCard.jsx` and `BackButton.jsx` across pages.
3. **Optimized Audio Buffering**:
   - Asynchronous play promise tracking prevents `AbortError` interruptions when skipping tracks quickly.
4. **Hardware-Accelerated CSS**:
   - Smooth transform animations, transitions, and blurred backdrops using Tailwind utility classes without triggering layout recalculations.

---

## 🛠️ Setup & Development Guide

### Prerequisites
- **Node.js**: v18.0.0 or higher
- **npm**: v9.0.0 or higher

### 1. Installation
Clone or navigate to the repository directory and install dependencies:
```bash
git clone <repo-url>
cd Music_Player
npm install
```

### 2. Start Development Server
Run Vite in development mode with Hot Module Replacement (HMR):
```bash
npm run dev
```
Open **[http://localhost:5173/](http://localhost:5173/)** (or the port Vite selects) in your browser.

### 3. Run Automated Tests
Execute the automated test suite verifying all 34 assertions:
```bash
npm test
```

### 4. Build for Production
Compile optimized and minified assets:
```bash
npm run build
```

### 5. Preview Production Build
Preview the generated production build locally:
```bash
npm run preview
```

---

## 🔒 Privacy & Client-First Guarantees

- **No Remote Backend**: User preferences, playlists, and playback state remain stored exclusively in your browser's `localStorage`.
- **Zero Server Telemetry**: No tracking cookies, telemetry, or analytics scripts are embedded.
- **Private File Handling**: Imported local files remain purely in-memory on your device and are never transmitted over the network.

---

## 📄 License

This project is licensed under the **MIT License**. Free to use, modify, and distribute.
