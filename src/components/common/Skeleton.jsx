import React from 'react';

/**
 * Reusable animated Skeleton loader primitive
 */
export function Skeleton({ className = '', rounded = 'rounded-2xl', ...props }) {
  return (
    <div
      className={`relative overflow-hidden bg-white/[0.06] dark:bg-white/[0.05] animate-pulse ${rounded} ${className}`}
      {...props}
    >
      <div className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/10 to-transparent animate-[shimmer_2s_infinite]" />
    </div>
  );
}

/**
 * Skeleton for Grid Song Cards
 */
export function SongCardSkeleton() {
  return (
    <div className="flex flex-col p-3 sm:p-3.5 rounded-3xl bg-surface-card border border-surface-border space-y-3">
      <Skeleton className="aspect-square w-full rounded-2xl" />
      <div className="space-y-2 px-1">
        <Skeleton className="h-4 w-3/4 rounded-md" />
        <Skeleton className="h-3 w-1/2 rounded-md" />
        <div className="flex justify-between pt-1">
          <Skeleton className="h-2.5 w-1/4 rounded-md" />
          <Skeleton className="h-2.5 w-1/5 rounded-md" />
        </div>
      </div>
    </div>
  );
}

/**
 * Skeleton for Horizontal Song Rows
 */
export function SongRowSkeleton() {
  return (
    <div className="flex items-center gap-3 md:gap-4 px-3 sm:px-4 py-2.5 rounded-2xl bg-surface-card/50 border border-transparent">
      <Skeleton className="w-6 h-4 rounded-md" />
      <Skeleton className="w-11 h-11 rounded-xl shrink-0" />
      <div className="flex-1 space-y-1.5 min-w-0">
        <Skeleton className="h-3.5 w-1/3 rounded-md" />
        <Skeleton className="h-2.5 w-1/4 rounded-md" />
      </div>
      <Skeleton className="hidden md:block h-3 w-28 rounded-md" />
      <Skeleton className="hidden lg:block h-3 w-20 rounded-md" />
      <Skeleton className="w-8 h-3 rounded-md" />
    </div>
  );
}

/**
 * Skeleton for Album Discography Cards
 */
export function AlbumCardSkeleton() {
  return (
    <div className="flex flex-col p-3.5 bg-surface-card border border-surface-border rounded-3xl space-y-3">
      <Skeleton className="aspect-square w-full rounded-2xl" />
      <div className="space-y-1.5 px-0.5">
        <Skeleton className="h-4 w-4/5 rounded-md" />
        <Skeleton className="h-3 w-1/2 rounded-md" />
      </div>
    </div>
  );
}
