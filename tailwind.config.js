// tailwind.config.js

const colors = require("tailwindcss/colors");

module.exports = {
  mode: "jit",
  purge: ["{pages,app}/**/*.{js,ts,jsx,tsx}"],
  darkMode: false, // or 'media' or 'class'
  theme: {
    colors: {
      transparent: "transparent",
      current: "currentColor",
      black: "#131313",
      white: colors.white,
      gray: colors.trueGray,
      indigo: colors.indigo,
      red: colors.rose,
      yellow: colors.amber,
      blue: colors.blue,
    },
    scale: {
      flip: "-1",
    },
  },
  variants: {
    extend: {
      borderColor: ["target"],
      borderWidth: ["target"],
    },
  },
  corePlugins: {
    scale: true,
  },
};
