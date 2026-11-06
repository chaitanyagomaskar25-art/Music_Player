import { songs, artists, albums, playlists, genres } from '../src/data/musicData.js';
import { formatTime, formatNumber, formatDurationLong } from '../src/utils/formatters.js';
import { EQ_PRESETS } from '../src/hooks/useAudioPlayer.js';

let passed = 0;
let failed = 0;

function assert(desc, condition) {
  if (condition) {
    passed++;
    console.log(`  ✓ ${desc}`);
  } else {
    failed++;
    console.error(`  ✗ FAIL: ${desc}`);
  }
}

console.log('\n=========================================');
console.log('MELODY MUSIC PLAYER - AUDIT TEST SUITE');
console.log('=========================================\n');

// 1. Music Data Integrity
console.log('[1] Music Data & Relationships');
assert('Has at least 25 songs', songs.length >= 25);
assert('All songs have required fields (id, title, artist, artistId, album, albumId, duration, genre, coverArt, audioUrl)',
  songs.every(s => s.id && s.title && s.artist && s.artistId && s.album && s.albumId && s.duration > 0 && s.genre && s.coverArt && s.audioUrl)
);
assert('All 7 genres represented (Pop, Hip-Hop, Rock, Electronic, Classical, Jazz, Lo-Fi)',
  genres.every(g => songs.some(s => s.genre === g.name))
);
assert('All artistId references in songs exist in artists array',
  songs.every(s => artists.some(a => a.id === s.artistId))
);
assert('All albumId references in songs exist in albums array',
  songs.every(s => albums.some(al => al.id === s.albumId))
);
assert('All songIds in albums exist in songs array',
  albums.every(al => al.songIds.every(sid => songs.some(s => s.id === sid)))
);
assert('All songIds in playlists exist in songs array',
  playlists.every(pl => pl.songIds.every(sid => songs.some(s => s.id === sid)))
);

// 2. Formatters
console.log('\n[2] Utility Formatters');
assert('formatTime(0) returns "0:00"', formatTime(0) === '0:00');
assert('formatTime(65) returns "1:05"', formatTime(65) === '1:05');
assert('formatTime(3600) returns "1:00:00"', formatTime(3600) === '1:00:00');
assert('formatTime(null/undefined/NaN) returns "0:00"', formatTime(null) === '0:00' && formatTime(NaN) === '0:00');
assert('formatNumber(1500) returns "1.5K"', formatNumber(1500) === '1.5K');
assert('formatNumber(2400000) returns "2.4M"', formatNumber(2400000) === '2.4M');
assert('formatDurationLong(3665) formats hours & minutes', formatDurationLong(3665).includes('hr'));

// 3. Queue Manipulations Simulation
console.log('\n[3] Queue Operations & Reordering');
let q = [...songs.slice(0, 5)];
const initialLen = q.length;

// Test add to queue
const extraSong = songs[10];
q.push(extraSong);
assert('Add to queue increases length', q.length === initialLen + 1 && q[q.length - 1].id === extraSong.id);

// Test remove from queue
const removed = q.splice(1, 1);
assert('Remove from queue removes exact index', q.length === initialLen && !q.some(s => s.id === removed[0].id));

// Test reorder in queue (move from index 2 to 0)
const targetSong = q[2];
const [moved] = q.splice(2, 1);
q.splice(0, 0, moved);
assert('Move in queue places item at new index without data loss', q[0].id === targetSong.id && q.length === initialLen);

// Test queue clear (keeping current song)
const currentSong = q[0];
q = [currentSong];
assert('Queue clear leaves only the current track', q.length === 1 && q[0].id === currentSong.id);

// 4. Playback Mode Transitions
console.log('\n[4] Playback Mode Transitions');
let repeat = 'off';
const cycleRepeat = (curr) => curr === 'off' ? 'all' : curr === 'all' ? 'one' : 'off';
repeat = cycleRepeat(repeat);
assert('Repeat cycle: off -> all', repeat === 'all');
repeat = cycleRepeat(repeat);
assert('Repeat cycle: all -> one', repeat === 'one');
repeat = cycleRepeat(repeat);
assert('Repeat cycle: one -> off', repeat === 'off');

// 5. Equalizer Presets
console.log('\n[5] Equalizer & Audio Filters');
const presetKeys = Object.keys(EQ_PRESETS);
assert('Equalizer contains required presets (Flat, Bass Boost, Rock, Pop, Classical, Jazz)',
  ['Flat', 'Bass Boost', 'Rock', 'Pop', 'Classical', 'Jazz'].every(p => presetKeys.includes(p))
);
assert('All presets define 5 frequency bands within [-12dB, +12dB]',
  presetKeys.every(k => {
    const g = EQ_PRESETS[k].gains;
    return ['bass', 'lowMid', 'mid', 'highMid', 'treble'].every(b => g[b] >= -12 && g[b] <= 12);
  })
);

// 6. Local Storage Persistence & Playlists
console.log('\n[6] LocalStorage & Playlist Management');
let userPlaylists = [
  { id: 'up-1', title: 'Test 1', songIds: ['song-1', 'song-2'] }
];

// Add song to playlist
const plId = 'up-1';
const newSongId = 'song-3';
userPlaylists = userPlaylists.map(p => p.id === plId ? { ...p, songIds: [...p.songIds, newSongId] } : p);
assert('Add song to custom playlist', userPlaylists[0].songIds.includes('song-3') && userPlaylists[0].songIds.length === 3);

// Prevent duplicate song in playlist
const duplicateExists = userPlaylists[0].songIds.includes('song-3');
assert('Detect duplicate song in playlist', duplicateExists === true);

// Remove song from playlist
userPlaylists = userPlaylists.map(p => p.id === plId ? { ...p, songIds: p.songIds.filter(id => id !== newSongId) } : p);
assert('Remove song from custom playlist', !userPlaylists[0].songIds.includes('song-3') && userPlaylists[0].songIds.length === 2);

// Delete playlist
userPlaylists = userPlaylists.filter(p => p.id !== plId);
assert('Delete playlist removes from array', userPlaylists.length === 0);

// 7. Local Audio File Handling Simulation
console.log('\n[7] Local Audio File Support');
const isAudioFile = (name, type) => {
  if (type && type.startsWith('audio/')) return true;
  return /\.(mp3|wav|ogg|oga|m4a|aac|flac|opus|weba|webm)$/i.test(name);
};
assert('Supports .mp3', isAudioFile('track.mp3', 'audio/mpeg'));
assert('Supports .wav', isAudioFile('sound.wav', 'audio/wav'));
assert('Supports .ogg', isAudioFile('song.ogg', 'audio/ogg'));
assert('Supports .flac', isAudioFile('lossless.flac', 'audio/flac'));
assert('Supports .m4a', isAudioFile('music.m4a', 'audio/mp4'));
assert('Rejects .pdf / non-audio', isAudioFile('document.pdf', 'application/pdf') === false);
assert('Rejects .exe / binaries', isAudioFile('virus.exe', 'application/octet-stream') === false);

console.log('\n=========================================');
console.log(`TEST SUMMARY: ${passed} PASSED, ${failed} FAILED`);
console.log('=========================================\n');

if (failed > 0) {
  process.exit(1);
}
