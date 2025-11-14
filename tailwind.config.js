import lineClamp from '@tailwindcss/line-clamp'

/** @type {import('tailwindcss').Config} */
export default {
  content: [
    './index.html',
    './src/**/*.{js,jsx,ts,tsx}',
  ],
  theme: {
    extend: {},
  },
  plugins: [
    lineClamp,  // ✅ Add here
  ],
}


// tailwind.config.js
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}"
  ],
  theme: {
    extend: {
      colors: {
        gold: {
          DEFAULT: '#B58C47',
          500: '#B58C47',
          600: '#8F6D37',
          700: '#6F5028'
        },
        deep: '#100707',
        blackish: '#000000',
        panel: '#0b0605'
      },
      boxShadow: {
        'gold-strong': '0 8px 30px rgba(181,140,71,0.18)'
      }
    },
  },
  plugins: [],
};
