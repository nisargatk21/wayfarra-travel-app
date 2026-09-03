/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        charcoal: { DEFAULT: '#1B1B18', soft: '#2A2A25' },
        ivory: { DEFAULT: '#F4EFE6', dim: '#EAE3D6' },
        terracotta: { DEFAULT: '#B5502E', light: '#C97046', dark: '#8F3E22' },
        stone: { DEFAULT: '#8C8578', light: '#B8B2A4' },
        line: '#DBD4C4',
      },
      fontFamily: {
        display: ['"Fraunces"', 'serif'],
        sans: ['"Inter"', 'sans-serif'],
      },
      maxWidth: { content: '1440px' },
      transitionTimingFunction: { editorial: 'cubic-bezier(0.65, 0, 0.35, 1)' },
      keyframes: {
        kenburns: {
          '0%': { transform: 'scale(1.0) translate(0,0)' },
          '100%': { transform: 'scale(1.12) translate(-1%,-1%)' },
        },
        fadeUp: {
          '0%': { opacity: 0, transform: 'translateY(16px)' },
          '100%': { opacity: 1, transform: 'translateY(0)' },
        },
      },
      animation: {
        kenburns: 'kenburns 16s ease-out forwards',
        fadeUp: 'fadeUp 0.8s cubic-bezier(0.65,0,0.35,1) forwards',
      },
    },
  },
  plugins: [],
}
