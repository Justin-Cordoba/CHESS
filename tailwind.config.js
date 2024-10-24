/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      backgroundImage: {
        check:
          "radial-gradient(ellipse at center, rgb(259, 0, 0) 0%, rgb(231, 0, 0) 25%, rgba(169, 0, 0, 0) 89%, rgba(158, 0, 0, 0) 100%)",
      },
      colors: {
        "box-color": "rgba(160, 199, 0, 0.55)",
      },
    },
  },
  plugins: [],
};
