import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        // Primary Colors
        'sand-tan': '#e1b382',
        'sand-tan-shadow': '#c89666',
        'sand-tan-light': '#f0d4b3',
        'sand-tan-dark': '#d4a571',

        // Secondary Colors
        'night-blue': '#2d545e',
        'night-blue-shadow': '#12343b',
        'night-blue-light': '#3d6470',
        'night-blue-dark': '#1d444d',

        // Accent Colors
        'forest-green': '#4a7c59',
        'forest-green-dark': '#3a6249',
        'sunset-orange': '#d97642',
        'mist-gray': '#f5f5f5',
        'cloud-white': '#ffffff',

        // Semantic colors
        success: '#4a7c59',
        error: '#dc2626',
        warning: '#f59e0b',
        info: '#3b82f6',

        // Text colors
        'text-primary': '#1a1a1a',
        'text-secondary': '#4a5568',
        'text-muted': '#718096',
        'text-inverse': '#ffffff',
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        display: ['Playfair Display', 'serif'],
      },
      spacing: {
        '18': '4.5rem',
        '88': '22rem',
        '128': '32rem',
      },
      borderRadius: {
        '4xl': '2rem',
      },
      boxShadow: {
        'premium': '0 10px 40px rgba(45, 84, 94, 0.1)',
        'premium-lg': '0 20px 60px rgba(45, 84, 94, 0.15)',
        'glow-sand': '0 0 20px rgba(225, 179, 130, 0.3)',
      },
      animation: {
        'fade-in': 'fadeIn 0.5s ease-in-out',
        'slide-up': 'slideUp 0.5s ease-out',
        'slide-down': 'slideDown 0.5s ease-out',
        'scale-in': 'scaleIn 0.3s ease-out',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { transform: 'translateY(20px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
        slideDown: {
          '0%': { transform: 'translateY(-20px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
        scaleIn: {
          '0%': { transform: 'scale(0.95)', opacity: '0' },
          '100%': { transform: 'scale(1)', opacity: '1' },
        },
      },
    },
  },
  plugins: [
    require('@tailwindcss/forms'),
    require('@tailwindcss/typography'),
    require('@tailwindcss/aspect-ratio'),
  ],
}

export default config