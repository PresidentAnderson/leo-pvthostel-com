import React from 'react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'gold' | 'black' | 'outline' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  fullWidth?: boolean;
  children: React.ReactNode;
}

/**
 * PVT Button Component
 * Branded button with consistent styling
 */
export const Button = ({
  variant = 'gold',
  size = 'md',
  fullWidth = false,
  children,
  className = '',
  ...props
}: ButtonProps) => {
  const variants = {
    gold: 'bg-pvt-gold hover:bg-state-hover text-pvt-black font-semibold',
    black: 'bg-pvt-black hover:bg-opacity-90 text-pvt-white font-semibold',
    outline: 'border-2 border-pvt-gold text-pvt-gold hover:bg-pvt-gold hover:text-pvt-black font-semibold',
    ghost: 'text-pvt-gold hover:bg-pvt-gold hover:bg-opacity-10 font-medium',
  };

  const sizes = {
    sm: 'px-4 py-2 text-sm',
    md: 'px-6 py-3 text-base',
    lg: 'px-10 py-4 text-lg',
  };

  return (
    <button
      className={`
        rounded-full
        transition-all duration-fast
        focus:ring-2 focus:ring-state-focus focus:ring-offset-2
        disabled:opacity-50 disabled:cursor-not-allowed
        ${variants[variant]}
        ${sizes[size]}
        ${fullWidth ? 'w-full' : ''}
        ${className}
      `}
      {...props}
    >
      {children}
    </button>
  );
};
