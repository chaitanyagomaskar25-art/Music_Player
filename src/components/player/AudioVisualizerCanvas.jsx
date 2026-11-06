import React, { useRef, useEffect } from 'react';
import { usePlayer } from '../../hooks/usePlayer';

export function AudioVisualizerCanvas({ isPlaying, mode = 'bars' }) {
  const canvasRef = useRef(null);
  const { getFrequencyData } = usePlayer() || {};

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    let animationFrameId;
    let phase = 0;

    const numBars = 48;
    const barHeights = new Array(numBars).fill(10);
    const targetHeights = new Array(numBars).fill(10);

    const render = () => {
      const width = canvas.width;
      const height = canvas.height;

      ctx.clearRect(0, 0, width, height);

      phase += 0.05;

      // Check for real Web Audio API frequency spectrum from AnalyserNode
      const realFreqs = getFrequencyData ? getFrequencyData() : null;
      let hasRealData = false;
      if (realFreqs && realFreqs.length > 0 && isPlaying) {
        let sum = 0;
        for (let k = 0; k < Math.min(realFreqs.length, 32); k++) {
          sum += realFreqs[k];
        }
        if (sum > 10) hasRealData = true;
      }

      // Update heights smoothly
      for (let i = 0; i < numBars; i++) {
        if (hasRealData && realFreqs) {
          // Live Web Audio API frequency analysis
          const binIndex = Math.min(
            realFreqs.length - 1,
            Math.floor((i / numBars) * (realFreqs.length * 0.65))
          );
          const raw = realFreqs[binIndex] || 0;
          const energy = raw / 255;
          targetHeights[i] = Math.max(12, energy * (height * 0.85));
        } else if (isPlaying) {
          // Dynamic harmonic synthetic waves (graceful fallback)
          const wave1 = Math.sin(phase + i * 0.25);
          const wave2 = Math.cos(phase * 1.5 + i * 0.15);
          const wave3 = Math.sin(phase * 0.7 - i * 0.3);
          const energy = Math.abs(wave1 * 0.5 + wave2 * 0.35 + wave3 * 0.15);
          targetHeights[i] = Math.max(12, energy * (height * 0.75));
        } else {
          targetHeights[i] = 8;
        }
        barHeights[i] += (targetHeights[i] - barHeights[i]) * 0.22;
      }

      if (mode === 'bars') {
        // Draw Frequency Bars with vibrant gradient
        const barWidth = (width / numBars) * 0.65;
        const gap = (width / numBars) * 0.35;

        for (let i = 0; i < numBars; i++) {
          const x = i * (barWidth + gap) + gap / 2;
          const barH = barHeights[i];
          const y = height - barH;

          // Gradient
          const grad = ctx.createLinearGradient(0, height, 0, y);
          grad.addColorStop(0, '#7c3aed');
          grad.addColorStop(0.5, '#a855f7');
          grad.addColorStop(1, '#ec4899');

          ctx.fillStyle = grad;
          ctx.beginPath();
          ctx.roundRect(x, y, barWidth, barH, [4, 4, 0, 0]);
          ctx.fill();

          // Peak dot
          if (isPlaying && barH > 15) {
            ctx.fillStyle = '#f43f5e';
            ctx.beginPath();
            ctx.arc(x + barWidth / 2, Math.max(4, y - 6), 2, 0, Math.PI * 2);
            ctx.fill();
          }
        }
      } else if (mode === 'wave') {
        // Continuous Waveform Stream
        ctx.beginPath();
        ctx.lineWidth = 3;
        ctx.strokeStyle = '#a855f7';
        ctx.shadowBlur = 12;
        ctx.shadowColor = '#ec4899';

        for (let i = 0; i < numBars; i++) {
          const x = (i / (numBars - 1)) * width;
          const y = height / 2 + (isPlaying ? (barHeights[i] - height * 0.3) * Math.sin(phase + i * 0.4) : 0);

          if (i === 0) {
            ctx.moveTo(x, y);
          } else {
            ctx.lineTo(x, y);
          }
        }
        ctx.stroke();
        ctx.shadowBlur = 0;
      } else {
        // Stereo Mirror Spectrum
        const barWidth = (width / numBars) * 0.7;
        const gap = (width / numBars) * 0.3;

        for (let i = 0; i < numBars; i++) {
          const x = i * (barWidth + gap);
          const h = barHeights[i] * 0.5;
          const y = height / 2 - h / 2;

          const grad = ctx.createLinearGradient(0, y, 0, y + h);
          grad.addColorStop(0, '#06b6d4');
          grad.addColorStop(0.5, '#a855f7');
          grad.addColorStop(1, '#ec4899');

          ctx.fillStyle = grad;
          ctx.beginPath();
          ctx.roundRect(x, y, barWidth, Math.max(4, h), 3);
          ctx.fill();
        }
      }

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      cancelAnimationFrame(animationFrameId);
    };
  }, [isPlaying, mode]);

  return (
    <canvas
      ref={canvasRef}
      width={700}
      height={180}
      className="w-full h-44 rounded-2xl bg-surface-card/40 backdrop-blur-md border border-white/5 shadow-2xl"
    />
  );
}
