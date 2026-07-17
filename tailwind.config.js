// tailwind.config.js
/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class', // Enable manual dark mode control
  theme: {
    extend: {
      fontFamily: {
        sans: ['Jost', 'sans-serif'],
      },
      colors: {
        // Custom colors that work in both modes
        primary: {
          50: '#f0fdfa',
          100: '#ccfbf1',
          500: '#00BABC', // teal-500 energetic accent
          600: '#0d9488', // teal-600
          700: '#0f766e',
          900: '#134e4a',
        }
      },
      transitionProperty: {
        'theme': 'background-color, border-color, color, fill, stroke',
      }
    },
  },
  plugins: [],
}