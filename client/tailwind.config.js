/** @type {import('tailwindcss').Config} */
module.exports = {
  /* This tells Tailwind to look for classes in your project and apply them to React components */
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  darkMode: 'class',
  /* This is where you define your custom colors, fonts, etc... */
  theme: {
    /* Extend the default theme */
    extend: { 
      fontFamily: {
      display: 'Oswald, ui-serif', // Adds a new `font-display` class
    }},
  },
  plugins: [
    require('@tailwindcss/typography'),
    require('@tailwindcss/forms'),
    require('@tailwindcss/aspect-ratio'),
    require('@tailwindcss/container-queries'),
  ],
}

