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
        truthColor: "var(--truth-color)",
        warnColor: "var(--warning-color)",
        textColor: "var(--text-color)",
        errorTextColor: "var(--error-text-color)",
        logoColor: "var(--logo-color)",
        tableColor: "var(--table-color)",
        hyperlinkColor: "var(--hyperlink-color)",
        breadcrumbColor: "var(--breadcrumb-color)",
      }
  },
  plugins: [],
}
}

