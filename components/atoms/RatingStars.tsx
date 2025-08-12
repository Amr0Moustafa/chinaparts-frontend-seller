
import React from 'react';

interface RatingStarsProps {
  rating: number; // e.g., 4.7
  max?: number;
  className?: string;
}

const clamp = (v: number, min: number, max: number) => Math.min(Math.max(v, min), max);

export const RatingStars: React.FC<RatingStarsProps> = ({ rating, max = 5, className = '' }) => {
  const fullStars = Math.floor(rating);
  const half = rating - fullStars >= 0.5;
  const emptyStars = max - fullStars - (half ? 1 : 0);
  return (
    <div className={`flex items-center space-x-1 text-sm ${className}`}>
      <div className="flex">
        {Array.from({ length: fullStars }).map((_, i) => (
          <svg key={`full-${i}`} aria-hidden="true" width={14} height={14} viewBox="0 0 20 20" fill="currentColor">
            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.286 3.948a1 1 0 00.95.69h4.15c.969 0 1.371 1.24.588 1.81l-3.36 2.44a1 1 0 00-.364 1.118l1.287 3.947c.3.922-.755 1.688-1.538 1.118l-3.36-2.44a1 1 0 00-1.176 0l-3.36 2.44c-.783.57-1.838-.196-1.538-1.118l1.287-3.947a1 1 0 00-.364-1.118L2.075 9.375c-.783-.57-.38-1.81.588-1.81h4.15a1 1 0 00.95-.69l1.286-3.948z" />
          </svg>
        ))}
        {half && (
          <svg aria-hidden="true" width={14} height={14} viewBox="0 0 20 20" fill="currentColor">
            <defs>
              <linearGradient id="half-grad">
                <stop offset="50%" stopColor="currentColor" />
                <stop offset="50%" stopColor="transparent" stopOpacity="1" />
              </linearGradient>
            </defs>
            <path
              d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.286 3.948a1 1 0 00.95.69h4.15c.969 0 1.371 1.24.588 1.81l-3.36 2.44a1 1 0 00-.364 1.118l1.287 3.947c.3.922-.755 1.688-1.538 1.118l-3.36-2.44a1 1 0 00-1.176 0l-3.36 2.44c-.783.57-1.838-.196-1.538-1.118l1.287-3.947a1 1 0 00-.364-1.118L2.075 9.375c-.783-.57-.38-1.81.588-1.81h4.15a1 1 0 00.95-.69l1.286-3.948z"
              fill="url(#half-grad)"
            />
          </svg>
        )}
        {Array.from({ length: emptyStars }).map((_, i) => (
          <svg key={`empty-${i}`} aria-hidden="true" width={14} height={14} viewBox="0 0 20 20" fill="none" stroke="currentColor">
            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.286 3.948a1 1 0 00.95.69h4.15c.969 0 1.371 1.24.588 1.81l-3.36 2.44a1 1 0 00-.364 1.118l1.287 3.947c.3.922-.755 1.688-1.538 1.118l-3.36-2.44a1 1 0 00-1.176 0l-3.36 2.44c-.783.57-1.838-.196-1.538-1.118l1.287-3.947a1 1 0 00-.364-1.118L2.075 9.375c-.783-.57-.38-1.81.588-1.81h4.15a1 1 0 00.95-.69l1.286-3.948z" />
          </svg>
        ))}
      </div>
      <span className="ml-1 text-slate-500">{rating.toFixed(1)}</span>
    </div>
  );
};
