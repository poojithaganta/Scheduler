/** @type {import('tailwindcss').Config} */
export default {
  content: [
    './index.html',
    './src/**/*.{js,ts,jsx,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          50: '#eef6ff',
          100: '#d9eaff',
          200: '#b5d6ff',
          300: '#86baff',
          400: '#5596ff',
          500: '#2f6fff',
          600: '#1e54db',
          700: '#1843ad',
          800: '#173a87',
          900: '#16356e',
        },
      },
      boxShadow: {
        card: '0 8px 24px rgba(0,0,0,0.08)',
      },
    },
  },
  plugins: [],
};

