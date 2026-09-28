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
          dark: '#072e24',
          main: '#0e5a45',
          light: '#3f9a7a',
          pale: '#e8f2ee',
          // Accent for text/lines on dark green backgrounds (gold, as on the flyers).
          soft: '#f2d88c',
        },
        // Metallic gold from the ministry's flyers: main buttons, lines, borders, and
        // labels on dark green (`light`). Avoid gold text on white (use `dark` if needed).
        gold: {
          DEFAULT: '#d8b25b',
          light: '#f2d88c',
          dark: '#8a6a1f',
        },
        // Warm off-white for alternating section backgrounds.
        paper: '#faf7ee',
        ink: {
          DEFAULT: '#1c2a25',
          muted: '#4f5d57',
          soft: '#66736d',
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
