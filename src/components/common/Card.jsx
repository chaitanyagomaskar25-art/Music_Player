import React from 'react';

export function Card({ children, className = '', hoverEffect = true, ...props }) {
  return (
    <div
      className={`bg-surface-card border border-surface-border rounded-2xl p-4 transition-all duration-300 ${
        hoverEffect ? 'hover:bg-surface-hover hover:border-white/10 hover:shadow-xl hover:shadow-black/40' : ''
      } ${className}`}
      {...props}
    >
      {children}
    </div>
  );
}
