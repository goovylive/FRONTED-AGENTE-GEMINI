/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        'zinc-950': '#0a0a0c',
      },
    },
  },
  plugins: [
    require('@tailwindcss/typography'),
  ],
}
