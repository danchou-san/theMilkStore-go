/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'search-bg': '#F9F7F8',
        'input-outline': '#CE8BA2',
        'order': '#D8D8D8',
        'slider': '#08F909'
      },
      spacing: {
        'card': '330px',
        'filter': '360px'
      },
      screens: {
        'phone': '0px',
        'tablet': '640px',
        'laptop': '1162px',
      }
    },
  },
  plugins: [],
}