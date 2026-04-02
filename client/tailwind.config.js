/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        primary: { DEFAULT: '#7C3AED', light: '#A78BFA', dark: '#5B21B6' },
        accent: { DEFAULT: '#F59E0B', light: '#FCD34D' },
        teal: { DEFAULT: '#06B6D4' },
        dark: { DEFAULT: '#0A0F1E', card: '#111827', border: '#1F2937' },
      },
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
        display: ['"Playfair Display"', 'serif'],
        arabic: ['"Cairo"', 'sans-serif'],
      },
      animation: {
        'float': 'float 6s ease-in-out infinite',
        'glow': 'glow 2s ease-in-out infinite',
        'slide-up': 'slideUp 0.5s ease-out',
        'fade-in': 'fadeIn 0.4s ease-out',
      },
      keyframes: {
        float: { '0%,100%': { transform: 'translateY(0px)' }, '50%': { transform: 'translateY(-20px)' } },
        glow: { '0%,100%': { boxShadow: '0 0 20px rgba(124,58,237,0.3)' }, '50%': { boxShadow: '0 0 40px rgba(124,58,237,0.7)' } },
        slideUp: { '0%': { transform: 'translateY(20px)', opacity: '0' }, '100%': { transform: 'translateY(0)', opacity: '1' } },
        fadeIn: { '0%': { opacity: '0' }, '100%': { opacity: '1' } },
      },
      backgroundImage: {
        'hero-gradient': 'radial-gradient(ellipse at top, #1e0a3c 0%, #0A0F1E 60%)',
        'card-gradient': 'linear-gradient(135deg, #111827 0%, #1a1f35 100%)',
        'purple-gradient': 'linear-gradient(135deg, #7C3AED 0%, #4F46E5 100%)',
      },
    },
  },
  plugins: [],
}
