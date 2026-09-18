/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        midnight: {
          950: '#040714',
          900: '#070b1e',
          800: '#0d1538',
          700: '#142052',
          600: '#1a2a6c',
        },
        festive: {
          red: '#c61021',
          'red-light': '#e52233',
          'red-dark': '#8a0614',
          gold: '#ffc400',
          'gold-light': '#ffe066',
          'gold-dark': '#d49b00',
          amber: '#f97316',
          yellow: '#ffd000',
        }
      },
      fontFamily: {
        display: ['Poppins', 'Outfit', 'system-ui', 'sans-serif'],
        body: ['Inter', 'system-ui', 'sans-serif']
      },
      animation: {
        'pulse-glow': 'pulseGlow 2s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'flicker': 'diyaFlicker 1.5s ease-in-out infinite alternate',
        'float': 'float 3s ease-in-out infinite',
        'sparkle': 'sparkle 1.8s ease-in-out infinite',
      },
      keyframes: {
        pulseGlow: {
          '0%, 100%': { opacity: '1', transform: 'scale(1)', filter: 'drop-shadow(0 0 15px rgba(255, 196, 0, 0.6))' },
          '50%': { opacity: '0.85', transform: 'scale(1.02)', filter: 'drop-shadow(0 0 25px rgba(255, 196, 0, 0.9))' },
        },
        diyaFlicker: {
          '0%': { filter: 'drop-shadow(0 0 8px rgba(249, 115, 22, 0.8))', transform: 'scale(1)' },
          '100%': { filter: 'drop-shadow(0 0 16px rgba(255, 196, 0, 1))', transform: 'scale(1.05)' },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-6px)' },
        },
        sparkle: {
          '0%, 100%': { opacity: '0.3', transform: 'scale(0.8)' },
          '50%': { opacity: '1', transform: 'scale(1.2)' },
        }
      }
    },
  },
  plugins: [],
}
