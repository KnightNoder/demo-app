// .eslintrc.js
module.exports = {
  root: true,
  env: {
    browser: true,
    es2021: true,
    node: true,
  },
  extends: [
    "eslint:recommended",
    "plugin:react/recommended",
    "plugin:react-hooks/recommended",
    "plugin:jsx-a11y/recommended",
    "plugin:@typescript-eslint/recommended",
    "plugin:prettier/recommended", // Make sure this is always the last item in the array
  ],
  parser: "@typescript-eslint/parser",
  parserOptions: {
    ecmaFeatures: {
      jsx: true,
    },
    ecmaVersion: "latest",
    sourceType: "module",
  },
  plugins: ["react", "@typescript-eslint", "prettier"],
  rules: {
    "prettier/prettier": "error", // Enables Prettier as an ESLint rule
    "react/react-in-jsx-scope": "off", // Not needed in React 17+
    "@typescript-eslint/no-unused-vars": "warn", // Warns about unused variables
    "react/prop-types": "off", // Disable prop-types (not needed with TypeScript)
  },
  settings: {
    react: {
      version: "detect", // Automatically detect the React version
    },
  },
};
