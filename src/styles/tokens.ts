/**
 * PVT Hostel Leo Design Tokens
 * The single source of truth for all design values
 */

export const tokens = {
  // Colors
  colors: {
    pvt: {
      black: '#0D0D0D',
      gold: '#D3A867',
      white: '#F9F9F9',
      montrealBlue: '#295D8C',
      warmGrey: '#777777',
    },
    // Semantic colors
    text: {
      primary: '#0D0D0D',
      secondary: '#777777',
      inverse: '#F9F9F9',
    },
    background: {
      primary: '#F9F9F9',
      secondary: '#FFFFFF',
      dark: '#0D0D0D',
    },
    border: {
      light: 'rgba(13, 13, 13, 0.08)',
      medium: 'rgba(13, 13, 13, 0.16)',
      heavy: 'rgba(13, 13, 13, 0.32)',
    },
    state: {
      hover: '#c39855', // Darker gold
      focus: '#D3A867',
      disabled: '#CCCCCC',
      error: '#DC2626',
      success: '#059669',
      warning: '#F59E0B',
    },
  },

  // Typography
  typography: {
    fonts: {
      display: '"DM Serif Display", "Playfair Display", Georgia, serif',
      body: '"Inter", "DM Sans", -apple-system, BlinkMacSystemFont, sans-serif',
      mono: '"SF Mono", "Consolas", "Monaco", monospace',
    },
    scale: {
      xs: '0.75rem',      // 12px
      sm: '0.875rem',     // 14px
      base: '1rem',       // 16px
      lg: '1.125rem',     // 18px
      xl: '1.25rem',      // 20px
      '2xl': '1.5rem',    // 24px
      '3xl': '1.875rem',  // 30px
      '4xl': '2.25rem',   // 36px
      '5xl': '3rem',      // 48px
      '6xl': '3.75rem',   // 60px
      '7xl': '4.5rem',    // 72px
    },
    weights: {
      light: 300,
      regular: 400,
      medium: 500,
      semibold: 600,
      bold: 700,
    },
    lineHeights: {
      tight: 1.1,
      snug: 1.2,
      normal: 1.5,
      relaxed: 1.6,
      loose: 1.8,
    },
    letterSpacing: {
      tighter: '-0.05em',
      tight: '-0.025em',
      normal: '0',
      wide: '0.025em',
      wider: '0.05em',
      widest: '0.25em',
    },
  },

  // Spacing Scale
  spacing: {
    0: '0',
    1: '0.25rem',    // 4px
    2: '0.5rem',     // 8px
    3: '0.75rem',    // 12px
    4: '1rem',       // 16px
    6: '1.5rem',     // 24px
    8: '2rem',       // 32px
    12: '3rem',      // 48px
    16: '4rem',      // 64px
    20: '5rem',      // 80px
    24: '6rem',      // 96px
    32: '8rem',      // 128px
  },

  // Shadow System
  shadows: {
    none: 'none',
    soft: '0 2px 8px rgba(13, 13, 13, 0.08)',
    card: '0 4px 16px rgba(13, 13, 13, 0.12)',
    medium: '0 8px 24px rgba(13, 13, 13, 0.16)',
    hard: '0 16px 48px rgba(13, 13, 13, 0.24)',
    modal: '0 24px 64px rgba(13, 13, 13, 0.32)',
    inner: 'inset 0 2px 4px rgba(13, 13, 13, 0.06)',
  },

  // Border Radius
  radius: {
    none: '0',
    sm: '4px',
    md: '8px',
    input: '12px',
    card: '20px',
    lg: '24px',
    xl: '32px',
    full: '9999px',
  },

  // Transitions
  transitions: {
    fast: '150ms',
    base: '200ms',
    slow: '300ms',
    slower: '500ms',
  },

  // Easing
  easing: {
    linear: 'linear',
    in: 'cubic-bezier(0.4, 0, 1, 1)',
    out: 'cubic-bezier(0, 0, 0.2, 1)',
    inOut: 'cubic-bezier(0.4, 0, 0.2, 1)',
    smooth: 'cubic-bezier(0.25, 0.46, 0.45, 0.94)',
  },

  // Z-index
  zIndex: {
    base: 0,
    dropdown: 1000,
    sticky: 1020,
    fixed: 1030,
    modalBackdrop: 1040,
    modal: 1050,
    popover: 1060,
    tooltip: 1070,
  },

  // Breakpoints
  breakpoints: {
    xs: '475px',
    sm: '640px',
    md: '768px',
    lg: '1024px',
    xl: '1280px',
    '2xl': '1536px',
  },
} as const;

// Type exports for TypeScript
export type ColorToken = typeof tokens.colors;
export type TypographyToken = typeof tokens.typography;
export type SpacingToken = typeof tokens.spacing;
export type ShadowToken = typeof tokens.shadows;
export type RadiusToken = typeof tokens.radius;
