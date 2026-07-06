module.exports = {
  content: ["./src/**/*.html"],
  theme: {
    container: {
      center: true,
    },
    extend: {
      colors: {
        brand: {
          pine: "#002715",
          ink: "#171311",
          bark: "#241a16",
          hide: "#3b2b23",
          brass: "#a66d2c",
          rust: "#7f4d1d",
          bone: "#f1e7d9",
          sand: "#dcc8ae",
          smoke: "#6d6258",
        },
      },
    },
  },
  variants: {},
  plugins: [require("@tailwindcss/typography")],
};
