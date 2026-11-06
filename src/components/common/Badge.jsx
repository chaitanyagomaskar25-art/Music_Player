import React from 'react';

export function Badge({ children, variant = 'default', className = '' }) {
  const variants = {
    default: 'bg-white/10 text-slate-300 border border-white/5',
    brand: 'bg-brand-500/20 text-brand-300 border border-brand-500/30',
    accent: 'bg-brand-accent/20 text-cyan-300 border border-brand-accent/30',
  };

  return (
    <span
      className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium tracking-wide ${variants[variant] || variants.default} ${className}`}
    >
      {children}
    </span>
  );
}
