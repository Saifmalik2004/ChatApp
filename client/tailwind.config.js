/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",],
  theme: {
    extend: {
      color:{
        primary:"#5b81a2",
        secondary:"#517491"

      }
    },
  },
  plugins: [],
}

