/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,jsx}",
  ],
  theme: {
    extend: {
      colors: {
        // Paleta Driven — premium, fintech, claro
        driven: {
          gold: '#C9A84C',
          'gold-light': '#F0D98A',
          'gold-pale': '#FBF5E0',
          cream: '#FAFAF7',
          surface: '#FFFFFF',
          border: '#E8E4D9',
          'border-light': '#F0EDE4',
          muted: '#8C8470',
          text: '#1A1710',
          'text-secondary': '#5C5845',
          danger: '#D94040',
          'danger-light': '#FDF0F0',
          warning: '#D97B2B',
          'warning-light': '#FEF4EC',
          success: '#2D7D52',
          'success-light': '#EDFAF3',
          info: '#2D5FA6',
          'info-light': '#EEF3FC',
        }
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        display: ['Sora', 'Inter', 'sans-serif'],
      },
      boxShadow: {
        'card': '0 1px 3px rgba(0,0,0,0.06), 0 1px 2px rgba(0,0,0,0.04)',
        'card-hover': '0 4px 12px rgba(0,0,0,0.08), 0 2px 4px rgba(0,0,0,0.04)',
        'sidebar': '2px 0 8px rgba(0,0,0,0.04)',
      },
      borderRadius: {
        'xl': '12px',
        '2xl': '16px',
      }
    },
  },
  plugins: [],
}
