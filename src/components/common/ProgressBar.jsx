import React, { useRef, useState, useEffect, useCallback } from 'react';
import { formatTime } from '../../utils/formatters';

export function ProgressBar({
  value = 0,
  max = 100,
  onChange,
  className = '',
  barColor = 'bg-brand-500',
  height = 'h-1.5',
  showTooltip = false,
}) {
  const containerRef = useRef(null);
  const [isDragging, setIsDragging] = useState(false);
  const [hoverPosition, setHoverPosition] = useState(null); // { percent, time, x }
  const percentage = max > 0 ? Math.min(100, Math.max(0, (value / max) * 100)) : 0;

  const calculateValueFromEvent = useCallback(
    (clientX) => {
      if (!containerRef.current) return 0;
      const rect = containerRef.current.getBoundingClientRect();
      const clickX = clientX - rect.left;
      const clampedPercent = Math.max(0, Math.min(1, clickX / rect.width));
      return clampedPercent * max;
    },
    [max]
  );

  // Click handler
  const handleClick = (e) => {
    if (!onChange) return;
    const newVal = calculateValueFromEvent(e.clientX);
    onChange(newVal);
  };

  // Dragging support (mousedown / touchstart)
  const handleMouseDown = (e) => {
    setIsDragging(true);
    if (onChange) {
      onChange(calculateValueFromEvent(e.clientX));
    }
  };

  const handleTouchStart = (e) => {
    if (e.touches && e.touches[0]) {
      setIsDragging(true);
      if (onChange) {
        onChange(calculateValueFromEvent(e.touches[0].clientX));
      }
    }
  };

  // Global mousemove/mouseup while dragging
  useEffect(() => {
    if (!isDragging) return;

    const handleMouseMove = (e) => {
      if (onChange) {
        onChange(calculateValueFromEvent(e.clientX));
      }
    };

    const handleTouchMove = (e) => {
      if (e.touches && e.touches[0] && onChange) {
        onChange(calculateValueFromEvent(e.touches[0].clientX));
      }
    };

    const handleMouseUp = () => {
      setIsDragging(false);
    };

    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseup', handleMouseUp);
    window.addEventListener('touchmove', handleTouchMove);
    window.addEventListener('touchend', handleMouseUp);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
      window.removeEventListener('touchmove', handleTouchMove);
      window.removeEventListener('touchend', handleMouseUp);
    };
  }, [isDragging, calculateValueFromEvent, onChange]);

  // Hover preview timestamp
  const handleMouseMoveHover = (e) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const percent = Math.max(0, Math.min(1, x / rect.width));
    setHoverPosition({ percent, time: percent * max, x });
  };

  const handleMouseLeave = () => {
    setHoverPosition(null);
  };

  return (
    <div
      ref={containerRef}
      onClick={handleClick}
      onMouseDown={handleMouseDown}
      onTouchStart={handleTouchStart}
      onMouseMove={handleMouseMoveHover}
      onMouseLeave={handleMouseLeave}
      className={`group relative w-full ${height} bg-white/10 hover:bg-white/20 rounded-full cursor-pointer transition-all flex items-center select-none ${className}`}
      role="slider"
      aria-valuemin={0}
      aria-valuemax={max}
      aria-valuenow={value}
    >
      {/* Active Filled Bar */}
      <div
        className={`${height} ${barColor} rounded-full transition-all group-hover:brightness-110 relative`}
        style={{ width: `${percentage}%` }}
      >
        {/* Scrubber thumb circle */}
        <span
          className={`absolute right-0 top-1/2 -translate-y-1/2 w-3.5 h-3.5 bg-white rounded-full shadow-lg shadow-black/60 transition-transform pointer-events-none ${
            isDragging ? 'scale-125 ring-2 ring-brand-500' : 'scale-0 group-hover:scale-100'
          }`}
        />
      </div>

      {/* Hover preview tooltip */}
      {(showTooltip && hoverPosition) && (
        <div
          className="absolute bottom-full mb-2 -translate-x-1/2 px-2 py-0.5 rounded-md bg-surface-panel text-[10px] font-mono font-bold text-white border border-surface-border pointer-events-none shadow-xl z-30"
          style={{ left: `${hoverPosition.percent * 100}%` }}
        >
          {formatTime(hoverPosition.time)}
        </div>
      )}
    </div>
  );
}
