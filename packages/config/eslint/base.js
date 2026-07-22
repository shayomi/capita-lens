import tseslint from "typescript-eslint";

/** Shared flat ESLint config for all packages and apps. */
export default tseslint.config(
  {
    ignores: ["dist/**", ".next/**", "node_modules/**", "**/*.config.*"],
  },
  ...tseslint.configs.recommended,
  {
    rules: {
      "@typescript-eslint/no-unused-vars": [
        "warn",
        { argsIgnorePattern: "^_", varsIgnorePattern: "^_" },
      ],
      "@typescript-eslint/consistent-type-imports": "warn",
    },
  },
);
