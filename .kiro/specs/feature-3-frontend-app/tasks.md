# TASKS — Feature 3: Frontend Application

## Task 1: Configure Vite Proxy

- **Status:** not_started
- **Refs:** REQ-3.5
- **Files:** `packages/frontend/vite.config.ts`
- **Description:** Add proxy configuration to forward `/api/*` requests to `http://localhost:3001`. Ensure HMR and dev server work correctly.

## Task 2: Create useHealthCheck Hook

- **Status:** not_started
- **Refs:** REQ-3.1, REQ-3.2, REQ-3.3
- **Files:** `packages/frontend/src/hooks/useHealthCheck.ts`
- **Description:** Custom hook that fetches `/api/health` on mount. Returns `{ status, data, error }` with states: loading, online, error. Handles fetch failures gracefully.

## Task 3: Create HealthStatus Component

- **Status:** not_started
- **Refs:** REQ-3.1, REQ-3.2, REQ-3.3
- **Files:** `packages/frontend/src/components/HealthStatus.tsx`
- **Description:** Displays backend connection status. Loading: spinner/text. Online: green badge + timestamp. Error: red badge + error message. Uses `useHealthCheck` hook.

## Task 4: Create Counter Component

- **Status:** not_started
- **Refs:** REQ-3.4
- **Files:** `packages/frontend/src/components/Counter.tsx`
- **Description:** Simple counter with "Increment" button. Uses `useState`. Display current count. Tailwind styling.

## Task 5: Assemble App Component

- **Status:** not_started
- **Refs:** REQ-3.1, REQ-3.4
- **Files:** `packages/frontend/src/App.tsx`
- **Description:** Root component rendering HealthStatus and Counter. Minimal layout with heading "SquadForge".

## Task 6: Unit Tests

- **Status:** not_started
- **Refs:** REQ-3.1 through REQ-3.5
- **Files:** `packages/frontend/src/components/HealthStatus.test.tsx`, `packages/frontend/src/components/Counter.test.tsx`
- **Description:** Vitest + testing-library tests. HealthStatus: renders loading, renders online, renders error. Counter: renders initial 0, increments on click. Minimum 5 test cases.
