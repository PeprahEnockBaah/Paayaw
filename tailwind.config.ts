import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          dark: '#5c440c',
          main: '#96700f',
          light: '#d4af37',
          pale: '#fbf5e6',
        },
        // Amber-brown used for headings; `light` is a warm gold accent.
        gold: {
          DEFAULT: '#955a00',
          light: '#e8c35a',
          dark: '#6e4200',
        },
        ink: {
          DEFAULT: '#2b2620',
          muted: '#5c554c',
          soft: '#6f675c',
        },
      },
      fontFamily: {
        heading: ['Inter', 'sans-serif'],
        body: ['Quicksand', 'sans-serif'],
      },
    },
  },
  plugins: [],
}
export default config
