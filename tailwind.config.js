/** @type {import('tailwindcss').Config} */
module.exports = {
   theme: {
    extend: {
      keyframes: {
        shine: {
          '0%': { transform: 'translateX(-100%)' },
          '100%': { transform: 'translateX(100%)' },
        },
      },
      animation: {
        shine: 'shine 2.5s linear infinite',
      },
    },
  },
  important: true, // toutes les classes Tailwind auront !important
  content: [
    "./app/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {},
  },
  plugins: [],
};
