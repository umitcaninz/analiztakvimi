/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        // Ankara Üniversitesi kurumsal kimliği: lacivert (navy)
        brand: {
          50: '#eef3fb',
          100: '#d4e0f4',
          200: '#aac1e8',
          300: '#769bd7',
          400: '#4773c1',
          500: '#2b54a3',
          600: '#1f3f86',
          700: '#1a356c',
          800: '#182d57',
          900: '#0f1d3a',
        },
        // İkincil vurgu: altın (logodaki arma rengi)
        accent: {
          300: '#e6cd7a',
          400: '#d8b94f',
          500: '#c9a227',
          600: '#a8851c',
        },
      },
    },
  },
  plugins: [],
};
