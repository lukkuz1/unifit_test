import globals from "globals";
import pluginJs from "@eslint/js";
import tsEslintPlugin from "@typescript-eslint/eslint-plugin";
import tsEslintParser from "@typescript-eslint/parser";
import pluginReact from "eslint-plugin-react";
import pluginReactNative from "eslint-plugin-react-native";
import path from 'path';
import { fileURLToPath } from 'url';
import { createRequire } from 'module';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const require = createRequire(import.meta.url);

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
    'custom-rules': {
        rules: {
          'camel-case-function-names': require('./rules/camelCaseFunctionNames.js'),
          'lowercase-variable-start': require('./rules/lowercaseVariables.js'),
          'detect-unused-imports': require('./rules/detectUnusedImports.js')
        }
      }
  },
  
  rules: {

    'custom-rules/camel-case-function-names': 'error',
      'custom-rules/lowercase-variable-start': 'error',
      'custom-rules/detect-unused-imports': 'error',
    // ...pluginJs.configs.recommended.rules,  // ESLint core recommended rules
    // ...tsEslintPlugin.configs.recommended.rules,  // TypeScript recommended rules
    // ...pluginReact.configs.flat.recommended.rules,  // React recommended rules

    // React Native-specific rules
    // "react-native/no-unused-styles": "off",
    // "react-native/split-platform-components": "warn",
    // "react-native/no-inline-styles": "off",
    // "react-native/no-color-literals": "off",
    // "react-native/no-single-element-style-arrays": "warn",

    // Additional React and TypeScript rules for better control
    // "react/prop-types": "off",
    // "@typescript-eslint/explicit-function-return-type": "warn",
    // "@typescript-eslint/no-unused-vars": ["warn", { "argsIgnorePattern": "^_" }],
    // "@typescript-eslint/no-explicit-any": "warn",
    // "react/react-in-jsx-scope": "off",

    // Custom camelcase rule for enforcing camelCase naming convention
    "camelcase": ["error", { "properties": "always" }],

    // Custom rule 1: Enforce consistent indentation (2 spaces)
    "indent": ["error", 2],

    // Custom rule 2: Enforce single quotes for strings
    "quotes": ["error", "single"],

    // Custom rule 3: Enforce semicolons at the end of statements
    "semi": ["error", "always"],

    // Custom rule 4: Restrict maximum line length to 100 characters
    "max-len": ["error", { "code": 100, "ignoreUrls": true }],

    // Custom rule 5: Disallow console.log statements (for production code)
    "no-console": ["warn", { "allow": ["warn", "error"] }],

    // Custom rule 6: Require named function expressions
    "func-names": ["error", "always"],

    // Custom rule 7: Enforce consistent spacing inside curly braces in object literals
    "object-curly-spacing": ["error", "always"],

    // Custom rule 8: Disallow spaces before function parentheses
    "space-before-function-paren": ["error", "never"],

    // Custom rule 9: Disallow multiple empty lines
    "no-multiple-empty-lines": ["error", { "max": 1 }],

    // Custom rule 10: Disallow usage of var (prefer let/const)
    "no-var": "error",

    // Custom rule 11: Enforce a newline before return statements
    "newline-before-return": "error",
  },
  settings: {
    react: {
      version: "detect",
    },
  },
  
};
