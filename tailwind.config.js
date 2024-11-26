/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'natwest-purple': '#4C0072',
        'natwest-red': '#E31B23',
      },
    },
  },
  plugins: [
    require('@tailwindcss/forms'),
  ],
}