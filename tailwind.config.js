/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        cream: '#F5F2EA',
        navy: '#17285F',
        signal: '#FF5A1F',
        ink: '#111111',
        cool: '#D8D8D8',
      },
      fontFamily: {
        display: ['Bricolage Grotesque', 'Inter', 'sans-serif'],
        sans: ['Inter', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'sans-serif'],
      },
      boxShadow: {
        editorial: '8px 8px 0 rgba(17, 17, 17, 0.12)',
      },
    },
  },
  plugins: [],
};
