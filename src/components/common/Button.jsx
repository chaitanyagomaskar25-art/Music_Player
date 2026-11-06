import React from 'react';

export function Button({
  children,
  variant = 'primary',
  size = 'md',
  type = 'button',
  className = '',
  icon: Icon,
  disabled = false,
  ...props
}) {
  const baseStyles = 'inline-flex items-center justify-center font-medium transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-brand-500 focus:ring-offset-2 focus:ring-offset-surface-base disabled:opacity-50 disabled:cursor-not-allowed select-none';

  const variants = {
    primary: 'bg-brand-600 hover:bg-brand-500 text-white shadow-lg shadow-brand-600/30 active:scale-95',
    secondary: 'bg-surface-panel hover:bg-surface-hover text-slate-200 border border-surface-border active:scale-95',
    ghost: 'text-slate-400 hover:text-white hover:bg-white/5 active:scale-95',
    icon: 'p-2 rounded-full text-slate-300 hover:text-white hover:bg-white/10 active:scale-95',
    danger: 'bg-rose-600/20 text-rose-400 hover:bg-rose-600 hover:text-white border border-rose-500/20',
  };

  const sizes = {
    sm: 'text-xs px-2.5 py-1.5 rounded-lg gap-1.5',
    md: 'text-sm px-4 py-2 rounded-xl gap-2',
    lg: 'text-base px-6 py-3 rounded-2xl gap-2.5',
    iconSm: 'p-1.5 rounded-full',
    iconMd: 'p-2.5 rounded-full',
    iconLg: 'p-3.5 rounded-full',
  };

  const chosenSize = variant === 'icon' ? (sizes[size] || sizes.iconMd) : sizes[size];

  return (
    <button
      type={type}
      disabled={disabled}
      className={`${baseStyles} ${variants[variant] || variants.primary} ${chosenSize} ${className}`}
      {...props}
    >
      {Icon && <Icon className="w-4 h-4 shrink-0" />}
      {children}
    </button>
  );
}
