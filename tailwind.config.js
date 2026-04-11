/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
        display: ['Manrope', 'sans-serif'],
      },
      colors: {
        background: '#f7f9fb',
        surface: '#f7f9fb',
        'surface-container-lowest': '#ffffff',
        'surface-container-low': '#f2f4f6',
        'surface-container': '#eceef0',
        'surface-container-high': '#e6e8ea',
        'surface-container-highest': '#e0e3e5',
        primary: '#00647e',
        'primary-container': '#227e9a',
        'primary-fixed': '#b9eaff',
        'on-primary': '#ffffff',
        tertiary: '#00685c',
        error: '#ba1a1a',
        'on-surface': '#191c1e',
        outline: '#6e797e',
        'outline-variant': '#bdc8ce',
      },
      boxShadow: {
        'ethereal': '0px 12px 32px rgba(25, 28, 30, 0.04)',
      }
    },
  },
  plugins: [],
}
