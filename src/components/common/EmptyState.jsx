import React from 'react';
import { Music, AlertCircle, RefreshCw } from 'lucide-react';
import { Button } from './Button';

export function EmptyState({
  icon: Icon = Music,
  title = 'Nothing here yet',
  description = 'Start exploring or import tracks to see content here.',
  actionText,
  onAction,
  actionIcon,
  className = '',
}) {
  return (
    <div
      className={`flex flex-col items-center justify-center p-8 sm:p-14 text-center bg-surface-card/60 backdrop-blur-sm rounded-3xl border border-surface-border/80 shadow-subtle space-y-4 animate-in fade-in zoom-in-95 duration-200 ${className}`}
    >
      <div className="w-16 h-16 rounded-3xl bg-gradient-to-tr from-brand-600/20 via-brand-500/10 to-brand-pink/20 border border-brand-500/30 flex items-center justify-center text-brand-300 shadow-glow-purple">
        <Icon className="w-8 h-8 text-brand-400" />
      </div>

      <div className="space-y-1.5 max-w-md">
        <h3 className="text-base sm:text-lg font-bold text-white tracking-tight">
          {title}
        </h3>
        <p className="text-xs sm:text-sm text-slate-400 leading-relaxed">
          {description}
        </p>
      </div>

      {actionText && onAction && (
        <Button
          onClick={onAction}
          variant="primary"
          size="sm"
          icon={actionIcon}
          className="rounded-full px-6 text-xs font-bold bg-gradient-to-r from-brand-600 to-brand-pink shadow-glow-purple mt-2"
        >
          {actionText}
        </Button>
      )}
    </div>
  );
}

export function ErrorState({
  title = 'Something went wrong',
  description = 'We encountered an error loading this content. Please try again.',
  onRetry,
}) {
  return (
    <div className="flex flex-col items-center justify-center p-10 text-center bg-surface-card rounded-3xl border border-rose-500/30 shadow-subtle space-y-4">
      <div className="w-14 h-14 rounded-2xl bg-rose-500/15 border border-rose-500/30 flex items-center justify-center text-rose-400 shadow-lg">
        <AlertCircle className="w-7 h-7" />
      </div>
      <div className="space-y-1 max-w-md">
        <h3 className="text-base font-bold text-white">{title}</h3>
        <p className="text-xs text-slate-400">{description}</p>
      </div>
      {onRetry && (
        <Button
          onClick={onRetry}
          variant="secondary"
          size="sm"
          icon={RefreshCw}
          className="rounded-full text-xs font-semibold px-5"
        >
          Try Again
        </Button>
      )}
    </div>
  );
}
