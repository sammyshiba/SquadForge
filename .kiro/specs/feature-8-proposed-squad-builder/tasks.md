# Implementation Plan: Feature 8 — Proposed Squad Builder

## Overview

Implement a full-stack squad builder feature that enables delivery leads to assemble cross-functional squads from ranked candidates. The implementation follows this order: Prisma schema → backend routes → frontend state management → UI components → tests.

## Tasks

- [ ] 1. Database schema and backend setup
  - [ ] 1.1 Add Squad and SquadMember models to Prisma schema
    - Add `Squad` model with fields: `id` (uuid PK), `demandId` (String), `status` (String, default "draft"), `createdAt`, `updatedAt`, and a relation to `SquadMember[]`
    - Add `SquadMember` model with fields: `id` (uuid PK), `squadId`, `candidateId`, `name`, `primaryRole`, `sTotal` (Float), `createdAt`, and relation back to `Squad`
    - Add `@@unique([squadId, candidateId])` constraint on `SquadMember` to enforce duplicate prevention at DB level
    - Run `npx prisma migrate dev` to generate migration
    - _Requirements: 8.1, 8.2_

  - [ ] 1.2 Create Zod validation schemas and squad route file
    - Create `server/src/routes/squads.ts` with Express Router
    - Define `CreateSquadSchema = z.object({ demandId: z.string().min(1) })`
    - Define `AssignMemberSchema = z.object({ candidateId: z.string().min(1) })`
    - Register the router in the main Express app at `/api/squad`
    - _Requirements: 8.1, 8.2_

  - [ ] 1.3 Implement POST /api/squad — create squad
    - Create a new Squad record with `status: "draft"` and the provided `demandId`
    - Return `{ data: { squadId: string } }` with 201 status
    - Validate body with `CreateSquadSchema`, return 400 `VALIDATION_FAILED` on failure
    - _Requirements: 8.1_

  - [ ] 1.4 Implement POST /api/squad/:squadId/members — assign member
    - Validate body with `AssignMemberSchema`
    - Check squad exists (404 `NOT_FOUND` if not)
    - Attempt to create SquadMember; catch Prisma unique constraint error and return 400 `DUPLICATE_MEMBER`
    - Return `{ data: { filledSeats: number } }` with count of squad members
    - _Requirements: 8.1, 8.2_

  - [ ] 1.5 Implement DELETE /api/squad/:squadId/members/:candidateId — remove member
    - Find and delete SquadMember by squadId + candidateId
    - Return 404 `NOT_FOUND` if member not in squad
    - Return `{ data: { filledSeats: number } }` with updated count
    - _Requirements: 8.4_

  - [ ] 1.6 Implement POST /api/squad/:squadId/finalize — finalize squad
    - Check squad exists (404 `NOT_FOUND`)
    - Check squad has at least one member (400 `EMPTY_SQUAD` if empty)
    - Update squad status to "finalized"
    - Return `{ data: { squadId, status: "finalized", squadMembers: [...] } }`
    - _Requirements: 8.7_

  - [ ] 1.7 Implement POST /api/squad/:squadId/reset — reset squad
    - Check squad exists (404 `NOT_FOUND`)
    - Delete all SquadMember records for the squad
    - Update squad status back to "draft"
    - Return `{ data: { filledSeats: 0 } }`
    - _Requirements: 8.8_

  - [ ] 1.8 Implement GET /api/squad/:squadId/export — export squad
    - Check squad exists (404 `NOT_FOUND`)
    - Return `{ data: { projectCode, squadIntent, filledSeats, squadMembers: [...] } }` with member details
    - _Requirements: 8.6_

- [ ] 2. Checkpoint — Backend routes complete
  - Ensure all tests pass, ask the user if questions arise.

- [ ] 3. Frontend state management
  - [ ] 3.1 Create SquadContext with useReducer
    - Create `client/src/context/SquadContext.tsx`
    - Define `SquadState` interface: `{ squadId: string | null, squad: ScoredCandidate[], filledSeats: number, status: 'draft' | 'finalized' }`
    - Define `SquadAction` union type with 6 action types: `SET_SQUAD_ID`, `ASSIGN_CANDIDATE`, `REMOVE_CANDIDATE`, `RESET_SQUAD`, `FINALIZE_SQUAD`, `ROLLBACK_ASSIGN`
    - Implement `squadReducer` function with all action handlers
    - `ASSIGN_CANDIDATE` must check for duplicates via `squad.some(m => m.candidateId === payload.candidateId)` — no-op if duplicate
    - `REMOVE_CANDIDATE` filters out the candidate and updates `filledSeats`
    - `RESET_SQUAD` sets squad to `[]`, filledSeats to `0`, status to `'draft'`
    - `FINALIZE_SQUAD` sets status to `'finalized'`
    - `ROLLBACK_ASSIGN` removes a candidate (undo optimistic update)
    - Export `SquadProvider` component and `useSquad` hook
    - _Requirements: 8.1, 8.2, 8.4, 8.5, 8.8_

  - [ ] 3.2 Create API client functions for squad operations
    - Create/extend `client/src/api/client.ts` with typed functions:
    - `createSquad(demandId: string): Promise<{ squadId: string }>`
    - `assignMember(squadId: string, candidateId: string): Promise<{ filledSeats: number }>`
    - `removeMember(squadId: string, candidateId: string): Promise<{ filledSeats: number }>`
    - `finalizeSquad(squadId: string): Promise<FinalizedSquadResponse>`
    - `resetSquad(squadId: string): Promise<void>`
    - `exportSquad(squadId: string): Promise<SquadExportData>`
    - All functions must have explicit return types and proper error handling
    - _Requirements: 8.1, 8.4, 8.6, 8.7, 8.8_

- [ ] 4. Frontend UI components
  - [ ] 4.1 Create MemberChip component
    - Create `client/src/components/MemberChip.tsx`
    - Render candidate avatar thumbnail, name, and dismiss (×) button
    - Dismiss button must have `aria-label="Remove {name}"`
    - Accept `candidate: ScoredCandidate` and `onRemove: (candidateId: string) => void` props
    - _Requirements: 8.3, 8.4_

  - [ ] 4.2 Create ProposedSquadBar component (sticky footer)
    - Create `client/src/components/ProposedSquadBar.tsx`
    - Layout: `fixed bottom-0 left-0 right-0 h-16 bg-slate-800 px-6`
    - Render MemberChip for each squad member
    - Show "No members selected" text when squad is empty
    - Include Finalize, Reset, and Export buttons
    - Buttons disabled when `squad.length === 0` with `bg-slate-300 text-slate-500 cursor-not-allowed`
    - Add `aria-live="polite"` on the footer for screen reader announcements
    - Accept props: `squad`, `onRemove`, `onReset`, `onFinalize`, `onExport`
    - _Requirements: 8.3, 8.5, 8.6_

  - [ ] 4.3 Integrate isAssigned prop into CandidateCard
    - Modify existing `CandidateCard.tsx` to accept `isAssigned: boolean` and `onAssign: (candidateId: string) => void` props
    - When `isAssigned` is true: disable "Assign to Squad" button, change text to "Assigned", apply `bg-slate-300 text-slate-500 cursor-not-allowed` styling
    - When `isAssigned` is false: show active "Assign to Squad" button that calls `onAssign(candidateId)`
    - _Requirements: 8.1, 8.2_

  - [ ] 4.4 Create SquadSummary page
    - Create `client/src/pages/SquadSummary.tsx`
    - Display project metadata (projectCode, squadIntent)
    - Render squad members table with columns: Name, Primary Role, Suitability Score
    - Include Export and Done action buttons
    - Export button triggers JSON download via export utility
    - _Requirements: 8.7_

  - [ ] 4.5 Create export-squad utility
    - Create `client/src/utils/export-squad.ts`
    - Implement `exportSquadToJson(data: SquadExportData): void` function
    - Generate JSON string from squad data
    - Create Blob URL and trigger file download with filename `squad-export-{date}.json`
    - _Requirements: 8.6_

  - [ ] 4.6 Wire SquadContext into CandidateList page and routing
    - Wrap app with `SquadProvider` in App.tsx or the relevant layout
    - In CandidateList page: compute `isAssigned` for each candidate by checking against `squad` array from context
    - Pass `onAssign` handler that dispatches `ASSIGN_CANDIDATE` optimistically then calls API
    - On API failure, dispatch `ROLLBACK_ASSIGN`
    - Render `ProposedSquadBar` at the bottom of CandidateList page
    - Wire navigation to SquadSummary page after finalization
    - _Requirements: 8.1, 8.2, 8.3, 8.4, 8.5, 8.6, 8.7, 8.8_

- [ ] 5. Checkpoint — Frontend wired end-to-end
  - Ensure all tests pass, ask the user if questions arise.

- [ ] 6. Property-based tests (fast-check)
  - [ ]* 6.1 Write property test for assignment idempotence
    - **Property 1: Assignment Idempotence**
    - Test that assigning a candidate already in the squad produces no state change
    - Test that after any number of assignments of the same candidate, exactly one instance exists
    - Use `arbSquadState()` and `arbScoredCandidate()` generators
    - **Validates: Requirements 8.1, 8.2**

  - [ ]* 6.2 Write property test for removal eliminates candidate
    - **Property 2: Removal Eliminates Candidate**
    - Test that removing a candidate produces a squad without that candidateId
    - Test that squad length decreases by exactly one
    - Use `arbSquadState()` generator with non-empty constraint
    - **Validates: Requirements 8.4**

  - [ ]* 6.3 Write property test for filledSeats invariant
    - **Property 3: FilledSeats Invariant**
    - Test that after any sequence of ASSIGN, REMOVE, RESET actions, `filledSeats === squad.length`
    - Use arbitrary action sequences applied to initial state
    - **Validates: Requirements 8.5**

  - [ ]* 6.4 Write property test for reset clears all state
    - **Property 4: Reset Clears All State**
    - Test that dispatching RESET_SQUAD always produces `squad: [], filledSeats: 0, status: 'draft'`
    - Test across any initial squad state (empty, partial, full)
    - **Validates: Requirements 8.8**

  - [ ]* 6.5 Write property test for finalize returns exact squad members
    - **Property 5: Finalize Returns Exact Squad Members**
    - Test that finalizing produces status 'finalized' and squad remains unchanged
    - Test with various non-empty squad states
    - **Validates: Requirements 8.7**

  - [ ]* 6.6 Write property test for footer renders all assigned members
    - **Property 6: Footer Renders All Assigned Members**
    - Test that ProposedSquadBar renders the name of every candidate in the squad array
    - Use React Testing Library to check rendered output
    - **Validates: Requirements 8.3**

  - [ ]* 6.7 Write property test for action buttons enabled when squad non-empty
    - **Property 7: Action Buttons Enabled When Squad Non-Empty**
    - Test that finalize, reset, and export buttons are enabled iff `squad.length >= 1`
    - Test that all three buttons are disabled when squad is empty
    - **Validates: Requirements 8.6**

- [ ] 7. Integration and unit tests
  - [ ]* 7.1 Write integration tests for backend squad endpoints
    - Create `server/tests/squads.test.ts`
    - Test POST `/api/squad` creates squad and returns squadId
    - Test POST `/api/squad/:id/members` adds member and returns filledSeats
    - Test POST duplicate member returns 400 DUPLICATE_MEMBER
    - Test DELETE `/api/squad/:id/members/:candidateId` removes member
    - Test POST `/api/squad/:id/finalize` sets status to finalized
    - Test POST `/api/squad/:id/finalize` on empty squad returns 400 EMPTY_SQUAD
    - Test POST `/api/squad/:id/reset` clears all members
    - Test GET `/api/squad/:id/export` returns complete JSON
    - _Requirements: 8.1, 8.2, 8.4, 8.6, 8.7, 8.8_

  - [ ]* 7.2 Write unit tests for export-squad utility
    - Create `client/src/utils/export-squad.test.ts`
    - Test JSON structure matches SquadExportData interface
    - Test filename format includes date
    - Test Blob creation with correct MIME type
    - _Requirements: 8.6_

  - [ ]* 7.3 Write unit tests for API client functions
    - Create `client/src/api/client.test.ts`
    - Test each function makes correct HTTP request (method, URL, body)
    - Test error responses are properly thrown
    - Mock fetch for isolated testing
    - _Requirements: 8.1, 8.4, 8.6, 8.7, 8.8_

- [ ] 8. E2E tests
  - [ ]* 8.1 Write Playwright E2E tests for squad builder journey
    - Create `client/e2e/squad-builder.spec.ts`
    - Test: assign candidate → verify chip appears in footer
    - Test: assign same candidate twice → verify button disabled after first
    - Test: click × on chip → verify chip removed, card button re-enabled
    - Test: assign 2 candidates → click Finalize → verify SquadSummary page
    - Test: assign candidates → click Reset → confirm → verify empty footer
    - Test: finalize squad → click Export → verify JSON download triggers
    - _Requirements: 8.1, 8.2, 8.3, 8.4, 8.6, 8.7, 8.8_

- [ ] 9. Final checkpoint — All tests pass
  - Ensure all tests pass, ask the user if questions arise.

## Notes

- Tasks marked with `*` are optional and can be skipped for faster MVP
- Each task references specific requirements for traceability
- Checkpoints ensure incremental validation
- Property tests validate universal correctness properties from the design document using fast-check
- Unit tests validate specific examples and edge cases
- The Prisma `@@unique([squadId, candidateId])` constraint is the ultimate safety net for duplicate prevention
- Optimistic UI updates with rollback ensure responsive UX even on slow networks

## Task Dependency Graph

```json
{
  "waves": [
    { "id": 0, "tasks": ["1.1"] },
    { "id": 1, "tasks": ["1.2"] },
    { "id": 2, "tasks": ["1.3", "1.4", "1.5", "1.6", "1.7", "1.8"] },
    { "id": 3, "tasks": ["3.1", "3.2"] },
    { "id": 4, "tasks": ["4.1", "4.3", "4.5"] },
    { "id": 5, "tasks": ["4.2", "4.4"] },
    { "id": 6, "tasks": ["4.6"] },
    { "id": 7, "tasks": ["6.1", "6.2", "6.3", "6.4", "6.5", "7.1", "7.2", "7.3"] },
    { "id": 8, "tasks": ["6.6", "6.7"] },
    { "id": 9, "tasks": ["8.1"] }
  ]
}
```
