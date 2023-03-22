/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{html,js,tsx}"],
  theme: {
    letterSpacing: {
      tightest: '-.075em',
      tighter: '-.05em',
      normal: '0',
      wider: '.05em',
      widest: '.25em',
    },
    extend: {},
  },
  plugins: [],
}