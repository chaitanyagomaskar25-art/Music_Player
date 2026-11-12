import React from 'react';
import { Link } from 'react-router-dom';
import { Music, Home } from 'lucide-react';
import { Button } from '../components/common/Button';

export function NotFoundPage() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] text-center px-4 space-y-4">
      <div className="w-16 h-16 rounded-full bg-brand-500/10 flex items-center justify-center text-brand-500">
        <Music className="w-8 h-8" />
      </div>
      <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white">
        404 - Page Not Found
      </h1>
      <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 max-w-md">
        Looks like the track or page you're looking for doesn't exist or has moved off the stage.
      </p>
      <Link to="/">
        <Button icon={Home} variant="primary" size="md" className="rounded-full px-6">
          Back to Melody Home
        </Button>
      </Link>
    </div>
  );
}
