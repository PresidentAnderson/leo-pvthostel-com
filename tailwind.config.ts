import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        // PVT Hostel Leo Brand Colors
        brand: {
          black: '#0E0E0E',
          gold: '#D3A867',
          'gold-dark': '#c39855',
          white: '#FFFFFF',
        },
        text: {
          primary: '#111111',
          secondary: '#555555',
        },
        divider: {
          light: 'rgba(0, 0, 0, 0.08)',
        },
        // Premium deep blue and purple gradient palette
        primary: {
          50: '#eef2ff',
          100: '#e0e7ff',
          200: '#c7d2fe',
          300: '#a5b4fc',
          400: '#818cf8',
          500: '#6366f1',
          600: '#5048e5',
          700: '#4338ca',
          800: '#3730a3',
          900: '#312e81',
          950: '#1e1b4b',
        },
        secondary: {
          50: '#faf5ff',
          100: '#f3e8ff',
          200: '#e9d5ff',
          300: '#d8b4fe',
          400: '#c084fc',
          500: '#a855f7',
          600: '#9333ea',
          700: '#7c3aed',
          800: '#6b21a8',
          900: '#581c87',
          950: '#3b0764',
        },
        accent: {
          50: '#fffbeb',
          100: '#fef3c7',
          200: '#fde68a',
          300: '#fcd34d',
          400: '#fbbf24',
          500: '#f59e0b',
          600: '#d97706',
          700: '#b45309',
          800: '#92400e',
          900: '#78350f',
          950: '#451a03',
        },
        // Enhanced grayscale for dark theme
        gray: {
          50: '#f8fafc',
          100: '#f1f5f9',
          200: '#e2e8f0',
          300: '#cbd5e1',
          400: '#94a3b8',
          500: '#64748b',
          600: '#475569',
          700: '#334155',
          800: '#1e293b',
          850: '#0f172a',
          900: '#0b1426',
          950: '#020617',
        },
        // Glass morphism specific colors
        glass: {
          50: 'rgba(255, 255, 255, 0.9)',
          100: 'rgba(255, 255, 255, 0.8)',
          200: 'rgba(255, 255, 255, 0.6)',
          300: 'rgba(255, 255, 255, 0.4)',
          400: 'rgba(255, 255, 255, 0.2)',
          500: 'rgba(255, 255, 255, 0.1)',
          600: 'rgba(255, 255, 255, 0.08)',
          700: 'rgba(255, 255, 255, 0.05)',
          800: 'rgba(255, 255, 255, 0.03)',
          900: 'rgba(255, 255, 255, 0.01)',
        },
      },
      fontFamily: {
        sans: ['var(--font-inter)', 'Inter', 'system-ui', 'sans-serif'],
        heading: ['Playfair Display', 'Georgia', 'serif'],
        body: ['var(--font-inter)', 'Inter', 'system-ui', 'sans-serif'],
      },
      fontSize: {
        '2xs': ['0.625rem', { lineHeight: '0.75rem' }],
        '4xl': ['2.25rem', { lineHeight: '2.5rem' }],
        '5xl': ['3rem', { lineHeight: '3.5rem' }],
        '6xl': ['3.75rem', { lineHeight: '4.25rem' }],
        '7xl': ['4.5rem', { lineHeight: '5rem' }],
        '8xl': ['6rem', { lineHeight: '6.5rem' }],
        '9xl': ['8rem', { lineHeight: '8.5rem' }],
      },
      spacing: {
        '18': '4.5rem',
        '88': '22rem',
        '128': '32rem',
        '144': '36rem',
      },
      animation: {
        // Enhanced premium animations
        'fade-in': 'fadeIn 0.6s cubic-bezier(0.25, 0.46, 0.45, 0.94)',
        'fade-up': 'fadeUpPremium 0.8s cubic-bezier(0.25, 0.46, 0.45, 0.94)',
        'fade-up-delay': 'fadeUpPremium 0.8s cubic-bezier(0.25, 0.46, 0.45, 0.94) 0.2s both',
        'slide-in': 'slideIn 0.8s cubic-bezier(0.25, 0.46, 0.45, 0.94)',
        'slide-in-left': 'slideInFromLeft 0.8s cubic-bezier(0.25, 0.46, 0.45, 0.94)',
        'slide-in-right': 'slideInFromRight 0.8s cubic-bezier(0.25, 0.46, 0.45, 0.94)',
        'scale-in': 'scaleIn 0.6s cubic-bezier(0.25, 0.46, 0.45, 0.94)',
        'rotate-in': 'rotateIn 0.8s cubic-bezier(0.25, 0.46, 0.45, 0.94)',
        'bounce-in': 'bounceIn 0.8s cubic-bezier(0.68, -0.55, 0.265, 1.55)',
        'pulse-slow': 'pulse 4s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'pulse-glow': 'pulse-glow 3s ease-in-out infinite',
        'gradient-shift': 'gradientShift 3s ease-in-out infinite',
        'shimmer': 'shimmerPremium 3s ease-in-out infinite',
        'float': 'float 6s ease-in-out infinite',
        'float-delayed': 'float 6s ease-in-out infinite 2s',
        'spin-slow': 'spin 3s linear infinite',
        'wiggle': 'wiggle 1s ease-in-out infinite',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        fadeUpPremium: {
          '0%': { 
            opacity: '0', 
            transform: 'translateY(40px) scale(0.95)' 
          },
          '100%': { 
            opacity: '1', 
            transform: 'translateY(0) scale(1)' 
          },
        },
        slideIn: {
          '0%': { transform: 'translateX(-100%)' },
          '100%': { transform: 'translateX(0)' },
        },
        slideInFromLeft: {
          '0%': { 
            opacity: '0', 
            transform: 'translateX(-100px)' 
          },
          '100%': { 
            opacity: '1', 
            transform: 'translateX(0)' 
          },
        },
        slideInFromRight: {
          '0%': { 
            opacity: '0', 
            transform: 'translateX(100px)' 
          },
          '100%': { 
            opacity: '1', 
            transform: 'translateX(0)' 
          },
        },
        scaleIn: {
          '0%': { 
            opacity: '0', 
            transform: 'scale(0.8)' 
          },
          '100%': { 
            opacity: '1', 
            transform: 'scale(1)' 
          },
        },
        rotateIn: {
          '0%': { 
            opacity: '0', 
            transform: 'rotate(-180deg) scale(0.5)' 
          },
          '100%': { 
            opacity: '1', 
            transform: 'rotate(0deg) scale(1)' 
          },
        },
        bounceIn: {
          '0%': { 
            transform: 'scale3d(0.3, 0.3, 0.3)', 
            opacity: '0' 
          },
          '20%': { 
            transform: 'scale3d(1.1, 1.1, 1.1)' 
          },
          '40%': { 
            transform: 'scale3d(0.9, 0.9, 0.9)' 
          },
          '60%': { 
            opacity: '1', 
            transform: 'scale3d(1.03, 1.03, 1.03)' 
          },
          '80%': { 
            transform: 'scale3d(0.97, 0.97, 0.97)' 
          },
          '100%': { 
            opacity: '1', 
            transform: 'scale3d(1, 1, 1)' 
          },
        },
        gradientShift: {
          '0%, 100%': { 'background-position': '0% 50%' },
          '50%': { 'background-position': '100% 50%' },
        },
        'pulse-glow': {
          '0%, 100%': { 
            'box-shadow': '0 0 20px rgba(102, 126, 234, 0.3)' 
          },
          '50%': { 
            'box-shadow': '0 0 40px rgba(102, 126, 234, 0.6), 0 0 60px rgba(118, 75, 162, 0.4)' 
          },
        },
        shimmerPremium: {
          '0%': { 'background-position': '-1000px 0' },
          '100%': { 'background-position': '1000px 0' },
        },
        float: {
          '0%, 100%': { 
            transform: 'translateY(0px) rotate(0deg)' 
          },
          '33%': { 
            transform: 'translateY(-20px) rotate(2deg)' 
          },
          '66%': { 
            transform: 'translateY(-10px) rotate(-1deg)' 
          },
        },
        wiggle: {
          '0%, 100%': { transform: 'rotate(-3deg)' },
          '50%': { transform: 'rotate(3deg)' },
        },
      },
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        'gradient-conic': 'conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))',
        'gradient-primary': 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        'gradient-secondary': 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
        'gradient-accent': 'linear-gradient(135deg, #ffecd2 0%, #fcb69f 100%)',
        'gradient-hero': 'linear-gradient(135deg, #1e3c72 0%, #2a5298 50%, #667eea 100%)',
        'gradient-glass': 'linear-gradient(135deg, rgba(255,255,255,0.1) 0%, rgba(255,255,255,0.05) 100%)',
        'hero-pattern': "url('/images/hero-pattern.svg')",
        'mesh-gradient': 'radial-gradient(at 40% 20%, hsla(240,100%,70%,1) 0px, transparent 50%), radial-gradient(at 80% 0%, hsla(280,100%,70%,1) 0px, transparent 50%), radial-gradient(at 0% 50%, hsla(45,100%,60%,1) 0px, transparent 50%)',
      },
      backdropBlur: {
        xs: '2px',
        '4xl': '72px',
      },
      boxShadow: {
        'premium': '0 20px 25px -5px rgba(0, 0, 0, 0.3), 0 10px 10px -5px rgba(0, 0, 0, 0.2)',
        'glow': '0 0 50px rgba(102, 126, 234, 0.5)',
        'glow-secondary': '0 0 50px rgba(240, 147, 251, 0.5)',
        'glow-accent': '0 0 50px rgba(255, 236, 210, 0.5)',
        'luxury': '0 25px 50px -12px rgba(0, 0, 0, 0.7)',
        'glass': '0 8px 32px 0 rgba(31, 38, 135, 0.37)',
        'inner-glow': 'inset 0 1px 0 rgba(255, 255, 255, 0.2)',
        '3d': '0 32px 64px rgba(0, 0, 0, 0.25), 0 16px 32px rgba(0, 0, 0, 0.15)',
      },
      screens: {
        'xs': '475px',
        '3xl': '1920px',
        '4xl': '2560px',
      },
      container: {
        center: true,
        padding: {
          DEFAULT: '1rem',
          sm: '2rem',
          lg: '4rem',
          xl: '5rem',
          '2xl': '6rem',
        },
      },
      zIndex: {
        '60': '60',
        '70': '70',
        '80': '80',
        '90': '90',
        '100': '100',
      },
      transitionTimingFunction: {
        'bounce-in': 'cubic-bezier(0.68, -0.55, 0.265, 1.55)',
        'smooth': 'cubic-bezier(0.25, 0.46, 0.45, 0.94)',
      },
      transitionDuration: {
        '400': '400ms',
        '600': '600ms',
        '800': '800ms',
        '900': '900ms',
        '2000': '2000ms',
      },
    },
  },
  plugins: [],
}

export default config