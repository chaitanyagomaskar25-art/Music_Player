import { useState, useEffect, useRef, useCallback } from 'react';

/**
 * Standard EQ Presets with 5 frequency bands:
 * - bass: 60Hz LowShelf
 * - lowMid: 250Hz Peaking
 * - mid: 1000Hz Peaking
 * - highMid: 4000Hz Peaking
 * - treble: 12000Hz HighShelf
 */
export const EQ_PRESETS = {
  'Flat': {
    name: 'Flat',
    desc: 'Natural balanced studio reference response',
    gains: { bass: 0, lowMid: 0, mid: 0, highMid: 0, treble: 0 },
  },
  'Bass Boost': {
    name: 'Bass Boost',
    desc: 'Deep sub-bass and punchy low-end punch',
    gains: { bass: 8, lowMid: 5, mid: 0, highMid: -1, treble: -2 },
  },
  'Rock': {
    name: 'Rock',
    desc: 'Heavy driving bass, scooped mids, and crisp highs',
    gains: { bass: 6, lowMid: 3, mid: -1, highMid: 4, treble: 6 },
  },
  'Pop': {
    name: 'Pop',
    desc: 'Vocal clarity and punchy bright upper spectrum',
    gains: { bass: 3, lowMid: 1, mid: 5, highMid: 4, treble: 2 },
  },
  'Classical': {
    name: 'Classical',
    desc: 'Smooth acoustic warmth and airy treble',
    gains: { bass: 4, lowMid: 2, mid: 1, highMid: 3, treble: 5 },
  },
  'Jazz': {
    name: 'Jazz',
    desc: 'Warm upright bass and velvety horn harmonics',
    gains: { bass: 4, lowMid: 3, mid: 2, highMid: 2, treble: 3 },
  },
};

/**
 * Reusable custom hook managing HTML5 Audio API playback, Web Audio API processing,
 * BiquadFilter EQ filters, AnalyserNode visualizer data, and state.
 *
 * @param {Object} options
 * @param {Function} options.onEnded - Callback triggered when the active track finishes
 * @param {Function} options.onError - Callback triggered on playback error
 * @returns {Object} Player controls and state
 */
export function useAudioPlayer({ onEnded, onError } = {}) {
  const audioRef = useRef(null);

  // Web Audio API refs
  const audioCtxRef = useRef(null);
  const sourceNodeRef = useRef(null);
  const analyserNodeRef = useRef(null);
  const filtersRef = useRef({
    bass: null,
    lowMid: null,
    mid: null,
    highMid: null,
    treble: null,
  });

  // Audio state
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolumeState] = useState(0.8);
  const [isMuted, setIsMuted] = useState(false);
  const [playbackSpeed, setPlaybackSpeedState] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [audioError, setAudioError] = useState(null);

  // Equalizer state
  const [eqGains, setEqGains] = useState(EQ_PRESETS['Flat'].gains);
  const [activeEqPreset, setActiveEqPreset] = useState('Flat');

  // Keep callback refs fresh
  const onEndedRef = useRef(onEnded);
  const onErrorRef = useRef(onError);

  useEffect(() => {
    onEndedRef.current = onEnded;
  }, [onEnded]);

  useEffect(() => {
    onErrorRef.current = onError;
  }, [onError]);

  // Initialize Web Audio API nodes (BiquadFilter EQ & AnalyserNode)
  const initWebAudio = useCallback(() => {
    if (audioCtxRef.current || !audioRef.current) return;
    try {
      const AudioContextClass = window.AudioContext || window.webkitAudioContext;
      if (!AudioContextClass) return;

      const ctx = new AudioContextClass();
      audioCtxRef.current = ctx;

      // 1. LowShelf filter for Bass (60Hz)
      const bass = ctx.createBiquadFilter();
      bass.type = 'lowshelf';
      bass.frequency.value = 60;
      bass.gain.value = eqGains.bass || 0;

      // 2. Peaking filter for Low-Mid (250Hz)
      const lowMid = ctx.createBiquadFilter();
      lowMid.type = 'peaking';
      lowMid.frequency.value = 250;
      lowMid.Q.value = 1;
      lowMid.gain.value = eqGains.lowMid || 0;

      // 3. Peaking filter for Mid (1000Hz)
      const mid = ctx.createBiquadFilter();
      mid.type = 'peaking';
      mid.frequency.value = 1000;
      mid.Q.value = 1;
      mid.gain.value = eqGains.mid || 0;

      // 4. Peaking filter for High-Mid (4000Hz)
      const highMid = ctx.createBiquadFilter();
      highMid.type = 'peaking';
      highMid.frequency.value = 4000;
      highMid.Q.value = 1;
      highMid.gain.value = eqGains.highMid || 0;

      // 5. HighShelf filter for Treble (12000Hz)
      const treble = ctx.createBiquadFilter();
      treble.type = 'highshelf';
      treble.frequency.value = 12000;
      treble.gain.value = eqGains.treble || 0;

      // 6. AnalyserNode for audio waveform / frequency spectrum
      const analyser = ctx.createAnalyser();
      analyser.fftSize = 128;
      analyser.smoothingTimeConstant = 0.8;

      filtersRef.current = { bass, lowMid, mid, highMid, treble };
      analyserNodeRef.current = analyser;

      // Connect HTML5 audio element through Web Audio filter chain
      audioRef.current.crossOrigin = 'anonymous';
      const source = ctx.createMediaElementSource(audioRef.current);
      sourceNodeRef.current = source;

      // Chain: source -> bass -> lowMid -> mid -> highMid -> treble -> analyser -> destination
      source.connect(bass);
      bass.connect(lowMid);
      lowMid.connect(mid);
      mid.connect(highMid);
      highMid.connect(treble);
      treble.connect(analyser);
      analyser.connect(ctx.destination);
    } catch (e) {
      console.warn('Web Audio API Equalizer fallback active:', e);
    }
  }, [eqGains]);

  // Apply Equalizer Preset (modulates real BiquadFilter gains in Web Audio)
  const applyEqPreset = useCallback(
    (presetName) => {
      initWebAudio();
      if (audioCtxRef.current && audioCtxRef.current.state === 'suspended') {
        audioCtxRef.current.resume().catch(() => {});
      }

      const preset = EQ_PRESETS[presetName] || EQ_PRESETS['Flat'];
      const { bass, lowMid, mid, highMid, treble } = preset.gains;

      const f = filtersRef.current;
      if (f.bass) f.bass.gain.value = bass;
      if (f.lowMid) f.lowMid.gain.value = lowMid;
      if (f.mid) f.mid.gain.value = mid;
      if (f.highMid) f.highMid.gain.value = highMid;
      if (f.treble) f.treble.gain.value = treble;

      setEqGains(preset.gains);
      setActiveEqPreset(presetName);
    },
    [initWebAudio]
  );

  // Set Custom Band Gain (-12dB to +12dB)
  const setCustomEqBand = useCallback(
    (band, value) => {
      initWebAudio();
      if (audioCtxRef.current && audioCtxRef.current.state === 'suspended') {
        audioCtxRef.current.resume().catch(() => {});
      }

      const numVal = Number(value);
      const f = filtersRef.current;
      if (f[band]) {
        f[band].gain.value = numVal;
      }

      setEqGains((prev) => ({ ...prev, [band]: numVal }));
      setActiveEqPreset('Custom');
    },
    [initWebAudio]
  );

  // Extract live frequency spectrum data from AnalyserNode
  const getFrequencyData = useCallback(() => {
    if (!analyserNodeRef.current) return null;
    const array = new Uint8Array(analyserNodeRef.current.frequencyBinCount);
    analyserNodeRef.current.getByteFrequencyData(array);
    return array;
  }, []);

  // Initialize Audio element once
  useEffect(() => {
    if (!audioRef.current) {
      const audio = new Audio();
      audio.preload = 'metadata';
      audio.crossOrigin = 'anonymous';
      audioRef.current = audio;
    }

    const audio = audioRef.current;

    const handleTimeUpdate = () => {
      setCurrentTime(audio.currentTime);
    };

    const handleDurationChange = () => {
      if (!isNaN(audio.duration) && audio.duration > 0) {
        setDuration(audio.duration);
      }
    };

    const handleLoadedMetadata = () => {
      if (!isNaN(audio.duration) && audio.duration > 0) {
        setDuration(audio.duration);
      }
      setIsLoading(false);
      setAudioError(null);
    };

    const handlePlay = () => {
      setIsPlaying(true);
      setIsLoading(false);
      // Resume audio context if suspended by browser autoplay policy
      if (audioCtxRef.current && audioCtxRef.current.state === 'suspended') {
        audioCtxRef.current.resume().catch(() => {});
      }
    };

    const handlePause = () => {
      setIsPlaying(false);
    };

    const handleEnded = () => {
      setIsPlaying(false);
      if (onEndedRef.current) {
        onEndedRef.current();
      }
    };

    const handleWaiting = () => {
      setIsLoading(true);
    };

    const handleCanPlay = () => {
      setIsLoading(false);
    };

    const handleVolumeChange = () => {
      setVolumeState(audio.volume);
      setIsMuted(audio.muted);
    };

    const handleRateChange = () => {
      setPlaybackSpeedState(audio.playbackRate);
    };

    const handleError = (e) => {
      const err = audio.error;
      let errorMsg = 'Audio playback error';
      if (err) {
        switch (err.code) {
          case MediaError.MEDIA_ERR_ABORTED:
            errorMsg = 'Audio playback was aborted';
            break;
          case MediaError.MEDIA_ERR_NETWORK:
            errorMsg = 'Network error while loading audio';
            break;
          case MediaError.MEDIA_ERR_DECODE:
            errorMsg = 'Audio decoding error';
            break;
          case MediaError.MEDIA_ERR_SRC_NOT_SUPPORTED:
            errorMsg = 'Audio format or source not supported';
            break;
          default:
            errorMsg = err.message || 'Unknown audio error';
        }
      }
      console.warn('HTML5 Audio Error:', errorMsg, e);
      setIsLoading(false);
      setIsPlaying(false);
      setAudioError(errorMsg);
      if (onErrorRef.current) {
        onErrorRef.current(errorMsg);
      }
    };

    // Attach listeners
    audio.addEventListener('timeupdate', handleTimeUpdate);
    audio.addEventListener('durationchange', handleDurationChange);
    audio.addEventListener('loadedmetadata', handleLoadedMetadata);
    audio.addEventListener('play', handlePlay);
    audio.addEventListener('pause', handlePause);
    audio.addEventListener('ended', handleEnded);
    audio.addEventListener('waiting', handleWaiting);
    audio.addEventListener('canplay', handleCanPlay);
    audio.addEventListener('volumechange', handleVolumeChange);
    audio.addEventListener('ratechange', handleRateChange);
    audio.addEventListener('error', handleError);

    // Cleanup listeners on unmount
    return () => {
      audio.removeEventListener('timeupdate', handleTimeUpdate);
      audio.removeEventListener('durationchange', handleDurationChange);
      audio.removeEventListener('loadedmetadata', handleLoadedMetadata);
      audio.removeEventListener('play', handlePlay);
      audio.removeEventListener('pause', handlePause);
      audio.removeEventListener('ended', handleEnded);
      audio.removeEventListener('waiting', handleWaiting);
      audio.removeEventListener('canplay', handleCanPlay);
      audio.removeEventListener('volumechange', handleVolumeChange);
      audio.removeEventListener('ratechange', handleRateChange);
      audio.removeEventListener('error', handleError);
      audio.pause();

      if (audioCtxRef.current && audioCtxRef.current.state !== 'closed') {
        audioCtxRef.current.close().catch(() => {});
      }
    };
  }, []);

  // Set audio source and play
  const loadAndPlay = useCallback((src, autoPlay = true) => {
    if (!audioRef.current || !src) return;
    const audio = audioRef.current;

    setAudioError(null);
    setIsLoading(true);

    if (audio.src !== src) {
      audio.src = src;
      audio.load();
    }

    if (autoPlay) {
      audio.play().catch((err) => {
        console.warn('Play request interrupted / autoplay prevented:', err);
        setIsPlaying(false);
        setIsLoading(false);
      });
    }
  }, []);

  // Play
  const play = useCallback(() => {
    if (!audioRef.current) return;
    initWebAudio();
    if (audioCtxRef.current && audioCtxRef.current.state === 'suspended') {
      audioCtxRef.current.resume().catch(() => {});
    }
    audioRef.current.play().catch((err) => {
      console.warn('Play failed:', err);
      setIsPlaying(false);
    });
  }, [initWebAudio]);

  // Pause
  const pause = useCallback(() => {
    if (!audioRef.current) return;
    audioRef.current.pause();
  }, []);

  // Toggle Play / Pause
  const togglePlay = useCallback(() => {
    if (!audioRef.current) return;
    if (audioRef.current.paused) {
      play();
    } else {
      pause();
    }
  }, [play, pause]);

  // Seek to position (seconds)
  const seek = useCallback((seconds) => {
    if (!audioRef.current) return;
    const clamped = Math.max(0, Math.min(seconds, audioRef.current.duration || 1000));
    audioRef.current.currentTime = clamped;
    setCurrentTime(clamped);
  }, []);

  // Set volume (0.0 to 1.0)
  const setVolume = useCallback((val) => {
    if (!audioRef.current) return;
    const clamped = Math.max(0, Math.min(1, val));
    audioRef.current.volume = clamped;
    audioRef.current.muted = clamped === 0;
    setVolumeState(clamped);
    setIsMuted(clamped === 0);
  }, []);

  // Toggle mute
  const toggleMute = useCallback(() => {
    if (!audioRef.current) return;
    const newMuted = !audioRef.current.muted;
    audioRef.current.muted = newMuted;
    setIsMuted(newMuted);
  }, []);

  // Set playback speed (0.5x to 2x)
  const setPlaybackSpeed = useCallback((speed) => {
    if (!audioRef.current) return;
    audioRef.current.playbackRate = speed;
    setPlaybackSpeedState(speed);
  }, []);

  return {
    audioRef,
    isPlaying,
    currentTime,
    duration,
    volume,
    isMuted,
    playbackSpeed,
    isLoading,
    audioError,
    eqGains,
    activeEqPreset,
    EQ_PRESETS,
    applyEqPreset,
    setCustomEqBand,
    getFrequencyData,
    loadAndPlay,
    play,
    pause,
    togglePlay,
    seek,
    setVolume,
    toggleMute,
    setPlaybackSpeed,
  };
}
