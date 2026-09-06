/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        cream: {
          50: '#FBF9F5',
          100: '#F5F0E6',
          200: '#EAE2D2',
          300: '#DFD5C0',
        },
        charcoal: {
          900: '#1C1E1B',
          800: '#2A2E28',
          700: '#3D433A',
          600: '#52594F',
          500: '#6C7469',
          400: '#8E968B',
          300: '#B5BCB3',
        },
        forest: {
          900: '#15291F',
          800: '#244B38',
          700: '#2D5C45',
          600: '#397357',
          500: '#4A8C6D',
          100: '#E4EFEA',
          50: '#F0F6F3',
        },
        sage: {
          50: '#F3F6F4',
          100: '#E5EDE7',
          200: '#C8D9CC',
          300: '#AEC6B4',
          400: '#8FA89B',
          500: '#758F81',
        },
        terracotta: {
          50: '#FAF2EE',
          100: '#F5E4DD',
          200: '#ECC5B6',
          500: '#C86D51',
          600: '#B55A3F',
          700: '#94442D',
        },
        borderLight: '#E7E2D8',
        borderMuted: '#D8D1C4',
      },
      fontFamily: {
        sans: ['Poppins', 'Noto Sans Devanagari', 'system-ui', '-apple-system', 'sans-serif'],
        poppins: ['Poppins', 'Noto Sans Devanagari', 'sans-serif'],
      },
      boxShadow: {
        soft: '0 4px 20px -2px rgba(28, 30, 27, 0.05), 0 2px 6px -1px rgba(28, 30, 27, 0.03)',
        card: '0 10px 30px -4px rgba(28, 30, 27, 0.06), 0 4px 10px -2px rgba(28, 30, 27, 0.04)',
        composer: '0 8px 30px -4px rgba(28, 30, 27, 0.07), 0 2px 8px -1px rgba(28, 30, 27, 0.04)',
        drawer: '-4px 0 24px rgba(28, 30, 27, 0.12)',
      },
    },
  },
  plugins: [],
}
