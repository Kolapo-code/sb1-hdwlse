import globals from "globals";
import pluginJs from "@eslint/js";
import tseslint from "typescript-eslint";
import typescriptEslintPlugin from "@typescript-eslint/eslint-plugin";

/** @type {import('eslint').Linter.Config[]} */
export default [
  // General files matching JavaScript and TypeScript files
  { files: ["**/*.{js,mjs,cjs,ts,tsx}"] },

  // Specific handling for JavaScript files
  { files: ["**/*.js"], languageOptions: { sourceType: "script" } },

  // Global configuration for Node.js
  { languageOptions: { globals: globals.node } },

  // Apply the recommended configurations for JavaScript and TypeScript
  pluginJs.configs.recommended,
  ...tseslint.configs.recommended,

  // TypeScript-specific rules
  {
    files: ["**/*.ts", "**/*.tsx"],
    languageOptions: {
      parser: "@typescript-eslint/parser",
      parserOptions: {
        project: "./tsconfig.json",
      },
      globals: globals.node,  // Ensure Node.js globals are available for TypeScript files too
      "@typescript-eslint": typescriptEslintPlugin,
    },
    rules: {
      // TypeScript-specific rules
      "@typescript-eslint/no-unused-vars": "warn",
      "@typescript-eslint/no-explicit-any": "warn",
    },
  },
];