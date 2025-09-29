/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx}",       // tất cả file trong pages
    "./src/components/**/*.{js,ts,jsx,tsx}",  // tất cả file trong components
    "./src/layouts/**/*.{js,ts,jsx,tsx}"      // tất cả file trong layouts
  ],
  theme: {
    extend: {
      colors: {
        orange: {
          500: '#F97316',
          600: '#EA580C',
        },
        pink: {
          500: '#EC4899',
          600: '#DB2777',
        },
      },
    },
  },
  plugins: [
    require('@tailwindcss/line-clamp'), // dùng để giới hạn số dòng text
  ],
}
