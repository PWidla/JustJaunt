/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        "light-green": "#606C38",
        "dark-green": "#283618",
        "light-wheat": "#FEFAE0",
        "light-brown": "#DDA15E",
        "dark-brown": "#BC6C25",
      },
      fontFamily: {
        primaryRegular: ["Regular"],
        primaryBold: ["Bold"],
      },
    },
  },
  plugins: [],
};
