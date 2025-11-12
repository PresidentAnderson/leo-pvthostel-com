import React from 'react';

interface TextProps {
  as?: 'p' | 'span' | 'div';
  size?: 'xs' | 'sm' | 'base' | 'lg' | 'xl';
  weight?: 'light' | 'normal' | 'medium' | 'semibold' | 'bold';
  color?: 'primary' | 'secondary' | 'inverse';
  children: React.ReactNode;
  className?: string;
}

/**
 * PVT Text Component
 * Semantic text with consistent typography
 */
export const Text = ({
  as: Component = 'p',
  size = 'base',
  weight = 'normal',
  color = 'primary',
  children,
  className = '',
}: TextProps) => {
  const sizes = {
    xs: 'text-xs',
    sm: 'text-sm',
    base: 'text-base',
    lg: 'text-lg',
    xl: 'text-xl',
  };

  const weights = {
    light: 'font-light',
    normal: 'font-normal',
    medium: 'font-medium',
    semibold: 'font-semibold',
    bold: 'font-bold',
  };

  const colors = {
    primary: 'text-text-primary',
    secondary: 'text-text-secondary',
    inverse: 'text-text-inverse',
  };

  return (
    <Component
      className={`
        font-body
        ${sizes[size]}
        ${weights[weight]}
        ${colors[color]}
        ${className}
      `}
    >
      {children}
    </Component>
  );
};
