/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      colors: {
        primary: "#F8F9FA",
        secondary: "#F1F3F5",
        accent: "rgb(var(--page-accent-r, 249) var(--page-accent-g, 115) var(--page-accent-b, 22))",
        light: "#1A1A1A",
      },
      fontFamily: {
        title: ["Raleway", "sans-serif"],
        body: ["Work Sans", "sans-serif"],
        sub: ["Work Sans", "sans-serif"],
      },
    },
  },
  plugins: [],
};
