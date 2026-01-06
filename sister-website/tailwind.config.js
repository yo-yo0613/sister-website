/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // 低飽和度橘色/土黃
        primary: {
          light: '#e9d5c3',
          DEFAULT: '#d4a373', // 類似圖片中的標籤色
          dark: '#bc8a5f',
        },
        // 咖啡色系
        secondary: {
          light: '#a98467',
          DEFAULT: '#6c584c',
          dark: '#582f0e',
        },
        // 灰調
        neutral: {
          50: '#fafaf9',
          100: '#f5f5f4',
          400: '#a8a29e', // 低飽和灰色
          900: '#1c1917',
        }
      },
      fontFamily: {
        // 建議使用更具質感的字體組合
        sans: ['"Noto Sans TC"', 'sans-serif'],
        serif: ['"Noto Serif TC"', 'serif'],
      },
    },
  },
  plugins: [],
}

