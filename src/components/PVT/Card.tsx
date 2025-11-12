import React from 'react';

interface CardProps {
  children: React.ReactNode;
  shadow?: 'soft' | 'card' | 'medium' | 'hard' | 'none';
  padding?: 'none' | 'sm' | 'md' | 'lg' | 'xl';
  className?: string;
  background?: 'light' | 'dark' | 'white';
}

/**
 * PVT Card Component
 * Premium card with consistent shadows and styling
 */
export const Card = ({
  children,
  shadow = 'card',
  padding = 'lg',
  className = '',
  background = 'white'
}: CardProps) => {
  const shadows = {
    none: 'shadow-none',
    soft: 'shadow-soft',
    card: 'shadow-card',
    medium: 'shadow-medium',
    hard: 'shadow-hard',
  };

  const paddings = {
    none: 'p-0',
    sm: 'p-4',
    md: 'p-6',
    lg: 'p-8',
    xl: 'p-12',
  };

  const backgrounds = {
    light: 'bg-background-primary',
    white: 'bg-background-secondary',
    dark: 'bg-background-dark text-text-inverse',
  };

  return (
    <div
      className={`
        rounded-card
        ${shadows[shadow]}
        ${paddings[padding]}
        ${backgrounds[background]}
        ${className}
      `}
    >
      {children}
    </div>
  );
};
