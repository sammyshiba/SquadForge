# TASKS — Feature 4: Proposed Squad Builder

## Task 1: Create Proposed Squad Context & State

- **Status:** not_started
- **Refs:** REQ-024, REQ-028
- **Files:** `packages/frontend/src/context/SquadContext.tsx`
- **Description:** Create React Context with `useReducer`. State: `{ members: ScoredCandidate[], totalSeats: 5, projectCode, squadIntent }`. Actions: ADD_MEMBER, REMOVE_MEMBER, RESET, SET_PROJECT_INFO. Export `SquadProvider` and `useSquad` hook.

## Task 2: Implement Assign to Squad Action

- **Status:** not_started
- **Refs:** REQ-024, REQ-025
- **Files:** `packages/frontend/src/context/SquadContext.tsx`, `packages/frontend/src/components/CandidateCard.tsx`
- **Description:** Dispatch ADD_MEMBER on button click. Reducer MUST check for duplicates before appending. If duplicate, no-op. Card button shows "Already Assigned" (disabled) when `members.includes(candidate)`.

## Task 3: Create Sticky Footer Tray Component

- **Status:** not_started
- **Refs:** REQ-026, REQ-028
- **Files:** `packages/frontend/src/components/ProposedSquadBar.tsx`
- **Description:** Fixed footer, `h-16`, `bg-slate-800`, positioned below sidebar. Show avatar stack (max 3 + overflow), filled seats counter text, and action buttons. Use Tailwind only.

## Task 4: Add Remove Candidate Action

- **Status:** not_started
- **Refs:** REQ-027
- **Files:** `packages/frontend/src/components/ProposedSquadBar.tsx`
- **Description:** Each assigned candidate in the tray has a "×" remove button. On click, dispatch REMOVE_MEMBER. Update filled seats counter. Show `aria-live="polite"` toast: "{name} removed from squad".

## Task 5: Add Reset Proposal Action

- **Status:** not_started
- **Refs:** REQ-031
- **Files:** `packages/frontend/src/components/ProposedSquadBar.tsx`
- **Description:** "Reset Proposal" button shows a confirmation dialog. On confirm, dispatch RESET action. Members array becomes empty. All "Assign to Squad" buttons on cards become re-enabled.

## Task 6: Add Finalize Squad with Confirmation Summary

- **Status:** not_started
- **Refs:** REQ-029, REQ-030
- **Files:** `packages/frontend/src/components/FinalizeModal.tsx`
- **Description:** "Finalize Squad" button is DISABLED when members.length === 0. On click, open modal showing project code, intent, member list with scores. "Confirm & Save" POSTs to `/api/squads/finalize`. "Cancel" closes modal.

## Task 7: Add Export Spec Action

- **Status:** not_started
- **Refs:** REQ-029
- **Files:** `packages/frontend/src/utils/export-squad.ts`
- **Description:** "Export Spec" button is DISABLED when members.length === 0. On click, generate JSON summary matching the Proposed Squad Data Shape from design.md. Copy to clipboard or trigger file download.

## Task 8: Unit Tests for Squad Reducer

- **Status:** not_started
- **Refs:** REQ-024, REQ-025, REQ-027, REQ-031
- **Files:** `packages/frontend/src/context/SquadContext.test.ts`
- **Description:** Vitest tests for: add member, prevent duplicate, remove member, reset to empty, filled seats calculation. Minimum 6 test cases.
