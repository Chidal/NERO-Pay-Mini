/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      colors: {
        primary: '#1E3A8A', // Deep blue for NERO brand
        secondary: '#3B82F6', // Bright blue for accents
        accent: '#10B981', // Green for success states
        neutral: '#F3F4F6', // Light gray for backgrounds
      },
    },
  },
  plugins: [],
};