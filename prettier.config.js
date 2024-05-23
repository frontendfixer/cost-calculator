/** @type {import('prettier').Config & import('prettier-plugin-tailwindcss').PluginOptions} */
const config = {
  tabWidth: 2,
  semi: true,
  singleQuote: true,
  arrowParens: "avoid",
  singleAttributePerLine: false,
  tailwindFunctions: ["cn"],
  plugins: ["prettier-plugin-tailwindcss"],
};

export default config;
