import globals from "globals";
import pluginJs from "@eslint/js";
import tsEslintPlugin from "@typescript-eslint/eslint-plugin";
import tsEslintParser from "@typescript-eslint/parser";
import pluginReact from "eslint-plugin-react";
import pluginReactNative from "eslint-plugin-react-native";

//add custom rules here:
// import camelCaseFunctionNames from "./rules/camelCaseFunctionNames";

/** @type {import('eslint').Linter.Config} */
export default {
  files: ["src/hooks/**/*.{js,jsx,ts,tsx}", "src/components/**/*.{js,jsx,ts,tsx}"],
  languageOptions: {
    parserOptions: {
      ecmaVersion: 2020,
      sourceType: "module",
      ecmaFeatures: {
        jsx: true,
      },
    },
    parser: tsEslintParser, // TypeScript parser
    globals: globals.browser, // Globals setup
  },
  plugins: {
    "@typescript-eslint": tsEslintPlugin,
    "react": pluginReact,
    "react-native": pluginReactNative, // React Native-specific plugin
  },
  rules: {
    ...pluginJs.configs.recommended.rules,  // ESLint core recommended rules
    ...tsEslintPlugin.configs.recommended.rules,  // TypeScript recommended rules
    ...pluginReact.configs.flat.recommended.rules,  // React recommended rules

    // React Native-specific rules
    "react-native/no-unused-styles": "off",
    "react-native/split-platform-components": "warn",
    "react-native/no-inline-styles": "off",
    "react-native/no-color-literals": "off",
    "react-native/no-single-element-style-arrays": "warn",

    // Additional React and TypeScript rules for better control
    "react/prop-types": "off",
    "@typescript-eslint/explicit-function-return-type": "warn",
    "@typescript-eslint/no-unused-vars": ["warn", { "argsIgnorePattern": "^_" }],
    "@typescript-eslint/no-explicit-any": "warn",
    "react/react-in-jsx-scope": "off",

    // Custom rule for camelCase function names
    // "custom/camelCaseFunctionNames": "warn",  // Enable custom rule with warning level
  },
  settings: {
    react: {
      version: "detect",
    },
  },
};
