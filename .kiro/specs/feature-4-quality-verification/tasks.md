# TASKS — Feature 4: Quality & Verification

## Task 1: Configure ESLint Flat Config

- **Status:** not_started
- **Refs:** REQ-4.1
- **Files:** `eslint.config.mjs`
- **Description:** Create ESLint flat config using `typescript-eslint`. Enable strict TypeScript rules. Add no-var, prefer-const. Ignore dist/ and node_modules/. Add `lint` script to root package.json.

## Task 2: Configure Prettier

- **Status:** not_started
- **Refs:** REQ-4.2
- **Files:** `.prettierrc.json`, `.prettierignore`
- **Description:** Create Prettier config (semi, singleQuote, tabWidth: 2, trailingComma: all). Add ignore patterns for dist, coverage, node_modules. Add `format:check` and `format` scripts to root package.json.

## Task 3: Configure Playwright

- **Status:** not_started
- **Refs:** REQ-4.3
- **Files:** `packages/frontend/playwright.config.ts`, `packages/frontend/e2e/smoke.spec.ts`
- **Description:** Configure Playwright with base URL pointing to Vite dev server. Create a smoke test that loads the page and verifies the heading and health status are visible. Add `e2e` script to root.

## Task 4: Add CI-Friendly Test Script

- **Status:** not_started
- **Refs:** REQ-4.1, REQ-4.2, REQ-4.3
- **Files:** `package.json`
- **Description:** Add `check` script that runs lint + format:check + test sequentially. Ensure non-zero exit on any failure.
