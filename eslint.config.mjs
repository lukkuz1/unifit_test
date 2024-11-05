import globals from "globals";
import pluginJs from "@eslint/js";
import tsEslintPlugin from "@typescript-eslint/eslint-plugin";
import tsEslintParser from "@typescript-eslint/parser";
import pluginReact from "eslint-plugin-react";

/** @type {import('eslint').Linter.Config[]} */
export default [
  {
    files: ["**/*.{js,mjs,cjs,ts,jsx,tsx}"],
    languageOptions: {
      parserOptions: {
        ecmaVersion: 2020,
        sourceType: "module",
      },
      parser: tsEslintParser, // Specify TypeScript parser
      globals: globals.browser, // Ensure there's no leading or trailing whitespace here
    },
    plugins: {
      "@typescript-eslint": tsEslintPlugin,
      "react": pluginReact,
    },
    rules: {
      ...pluginJs.configs.recommended.rules,  // ESLint core recommended rules
      ...tsEslintPlugin.configs.recommended.rules,  // TypeScript recommended rules
      ...pluginReact.configs.flat.recommended.rules,  // React recommended rules
    },
  },
];
