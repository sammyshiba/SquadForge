# DESIGN — Feature 4: Quality & Verification

## Purpose

Ensure code quality and correctness through automated linting, formatting, and end-to-end testing.

---

## Tool Configuration

| Tool        | Config File             | Command                   |
|-------------|-------------------------|---------------------------|
| ESLint      | `eslint.config.mjs`    | `npm run lint`            |
| Prettier    | `.prettierrc.json`     | `npm run format:check`    |
| Playwright  | `playwright.config.ts` | `npx playwright test`     |

---

## ESLint (Flat Config)

```ts
// eslint.config.mjs
import tseslint from 'typescript-eslint';

export default tseslint.config(
  ...tseslint.configs.strict,
  {
    rules: {
      '@typescript-eslint/no-explicit-any': 'error',
      '@typescript-eslint/explicit-function-return-type': 'warn',
      'no-var': 'error',
      'prefer-const': 'error',
    },
  },
  { ignores: ['**/dist/', '**/node_modules/', '**/*.js'] },
);
```

---

## Prettier

```json
{
  "semi": true,
  "singleQuote": true,
  "tabWidth": 2,
  "trailingComma": "all",
  "printWidth": 100
}
```

---

## Playwright

- Config: `packages/frontend/playwright.config.ts`
- Tests: `packages/frontend/e2e/`
- Base URL: `http://localhost:5173` (Vite dev server)
- Must start both frontend and backend before running E2E

---

## Scripts (Root package.json)

```json
{
  "lint": "eslint .",
  "format:check": "prettier --check .",
  "format": "prettier --write .",
  "e2e": "npx playwright test"
}
```

---

## Tech Alignment

- ESLint flat config (not legacy .eslintrc)
- Prettier as formatter, ESLint for logic rules (no formatting rules in ESLint)
- Playwright for E2E (not Cypress, not Selenium)
