import React from 'react';

/**
 * Modern 3-dot bouncing typing indicator shown while waiting for AI responses.
 */
export default function Loader({ text = 'FitBot is thinking...' }) {
  return (
    <div className="flex items-center gap-3 p-4 animate-fade-in glass-light max-w-xs rounded-2xl border border-dark-700/40">
      <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-primary-500 to-accent-500 flex items-center justify-center text-xs shadow-md shrink-0">
        🏋️
      </div>
      <div className="flex items-center gap-1.5">
        <span className="w-2 h-2 bg-primary-400 rounded-full animate-bounce [animation-delay:-0.3s]" />
        <span className="w-2 h-2 bg-primary-500 rounded-full animate-bounce [animation-delay:-0.15s]" />
        <span className="w-2 h-2 bg-accent-400 rounded-full animate-bounce" />
        <span className="text-xs text-gray-400 ml-1.5 font-medium">{text}</span>
      </div>
    </div>
  );
}

/**
 * Skeleton Loader Component for loading states.
 */
export function SkeletonLoader({ type = 'card' }) {
  if (type === 'sidebar') {
    return (
      <div className="space-y-2 p-2 animate-pulse">
        <div className="h-8 bg-dark-800/80 rounded-lg w-full" />
        <div className="h-8 bg-dark-800/60 rounded-lg w-3/4" />
        <div className="h-8 bg-dark-800/60 rounded-lg w-5/6" />
      </div>
    );
  }

  return (
    <div className="glass-card space-y-3 animate-pulse p-6">
      <div className="h-4 bg-dark-700/60 rounded w-1/3" />
      <div className="h-3 bg-dark-800/80 rounded w-full" />
      <div className="h-3 bg-dark-800/80 rounded w-5/6" />
      <div className="h-3 bg-dark-800/80 rounded w-2/3" />
    </div>
  );
}
