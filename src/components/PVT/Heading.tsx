import React from 'react';

interface HeadingProps {
  level: '1' | '2' | '3' | '4' | '5' | '6';
  children: React.ReactNode;
  className?: string;
  font?: 'display' | 'body';
}

/**
 * PVT Heading Component
 * Semantic heading with consistent typography
 */
export const Heading = ({
  level,
  children,
  className = '',
  font = 'display',
}: HeadingProps) => {
  const Tag = `h${level}` as keyof JSX.IntrinsicElements;

  const sizes = {
    '1': 'text-6xl md:text-7xl font-bold',
    '2': 'text-4xl md:text-5xl font-semibold',
    '3': 'text-3xl md:text-4xl font-semibold',
    '4': 'text-2xl md:text-3xl font-medium',
    '5': 'text-xl md:text-2xl font-medium',
    '6': 'text-lg md:text-xl font-medium',
  };

  const fonts = {
    display: 'font-display',
    body: 'font-body',
  };

  return (
    <Tag
      className={`
        ${sizes[level]}
        ${fonts[font]}
        text-text-primary
        ${className}
      `}
    >
      {children}
    </Tag>
  );
};
