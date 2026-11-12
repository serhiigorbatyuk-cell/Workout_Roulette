/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
      colors: {
        // Accent palettes driven by CSS variables so the theme can switch at runtime.
        brand: {
          300: 'rgb(var(--brand-300) / <alpha-value>)',
          400: 'rgb(var(--brand-400) / <alpha-value>)',
          500: 'rgb(var(--brand-500) / <alpha-value>)',
          600: 'rgb(var(--brand-600) / <alpha-value>)',
        },
        brand2: {
          400: 'rgb(var(--brand2-400) / <alpha-value>)',
          500: 'rgb(var(--brand2-500) / <alpha-value>)',
          600: 'rgb(var(--brand2-600) / <alpha-value>)',
        },
      },
    },
  },
  plugins: [],
};
