/** @type {import('tailwindcss').Config} */

export default {
  content: [
    "./index.html",
    "./src/**/*.{vue,js,ts,jsx,tsx, css}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Nunito', 'sans-serif'],
      },
      colors: {
        primary: "var(--primary-color)",
        secondary: "var(--secondary-color)",
        tertiary: "var(--tertiary-color)",
        formColor: "var(--form-color)",
        bgColor: "var(--background-color)",
        errColor: "var(--error-color)",
        textColor: "var(--text-color)",
      }
  },
  plugins: [],
}
}

