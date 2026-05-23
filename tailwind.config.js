/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./index.html", "./about.html", "./src/**/*.js"],
  theme: {
    extend: {
      colors: {
        background: "#2D353B",
        surface: "#343F44",
        elevated: "#3D484D",
        primary: "#A7C080",
        aqua: "#83C092",
        yellow: "#DBBC7F",
        orange: "#E69875",
        danger: "#E67E80",
        "text-primary": "#D3C6AA",
        "text-secondary": "#9DA9A0",
        border: "rgba(211,198,170,0.14)",
      },
      fontFamily: {
        sans: ["Inter", "Poppins", "system-ui", "sans-serif"],
        mono: ["JetBrains Mono", "ui-monospace", "SFMono-Regular", "monospace"],
      },
      boxShadow: {
        soft: "0 24px 80px rgba(13,18,21,.28)",
        glow: "0 0 48px rgba(167,192,128,.14)",
      },
    },
  },
  plugins: [],
};
