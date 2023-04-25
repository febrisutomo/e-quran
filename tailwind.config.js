/** @type {import('tailwindcss').Config} */
const defaultTheme = require('tailwindcss/defaultTheme');
const colors = require('tailwindcss/colors');

module.exports = {
  darkMode: 'class',
  content: [
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',

    // Or if using `src` directory:
    './src/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      fontFamily: {
        lateef: ['Lateef', 'Uthmanic'],
        indopak: ['IndoPak'],
        uthmanic: ['Uthmanic'],
        omar: ['Omar'],
        'al-qalam': ['AlQalam'],
        saleem: ['Saleem'],
        'isep-misbah': ['IsepMisbah'],
      },
      colors: {
        primary: colors.blue,
      },
    },
  },
  plugins: [],
};
