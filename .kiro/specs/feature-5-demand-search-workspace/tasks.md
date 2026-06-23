# Implementation Plan: Feature 5 — Demand & Search Workspace

## Overview

Implement the Demand & Search Workspace feature end-to-end: shared types, Prisma schema with seed data, backend scoring service and API routes, frontend form with validation, session context, and API client. Tasks are ordered for dependency resolution — shared types first, then backend infrastructure, then frontend, then integration/property tests.

## Tasks

- [ ] 1. Set up shared types and project infrastructure
  - [ ] 1.1 Create shared types package with domain interfaces
    - Create `packages/shared/src/types.ts` with `DemandCriteria`, `Employee`, `ScoredCandidate`, and `DemandFormFields` interfaces
    - Create `packages/shared/package.json` and `packages/shared/tsconfig.json`
    - Register `packages/shared` in root `package.json` workspaces
    - _Requirements: 5.2, 5.3, 5.10_

  - [ ] 1.2 Add Prisma schema models and seed data
    - Add `Employee` and `DeliveryRequest` models to `packages/backend/prisma/schema.prisma`
    - Create `packages/backend/prisma/seed.ts` with 10–15 mock employees covering varied roles, skills, and allocation percentages
    - Run migration to generate database tables
    - _Requirements: 5.10_

- [ ] 2. Implement backend scoring service (pure functions)
  - [ ] 2.1 Implement scoring functions in `packages/backend/src/services/scoring-service.ts`
    - Implement `calculateSkillScore` — average per-skill score (not found → 0, level < 4 → 80, level ≥ 4 → 100)
    - Implement `calculateAvailabilityScore` — 0% → 100, 1–50% → 70, >50% → 20
    - Implement `calculateRoleScore` — exact match → 100, no match → 0
    - Implement `calculateTotalScore` — `(0.50 × sSkill) + (0.30 × sAvail) + (0.20 × sRole)` rounded to 2 decimals
    - Implement `rankCandidates` — scores all employees, sorts descending by sTotal, assigns `availabilityLabel`
    - All functions must be pure, exported, with explicit return types
    - _Requirements: 5.3, 5.4_

  - [ ]* 2.2 Write property test: Total Score is Weighted Sum (Property 1)
    - **Property 1: Total Score is Weighted Sum of Sub-Scores**
    - Use fast-check to generate arbitrary sub-scores in [0, 100] and verify `calculateTotalScore` equals `round((0.5*sSkill + 0.3*sAvail + 0.2*sRole) * 100) / 100`
    - File: `packages/backend/src/services/scoring-service.test.ts`
    - **Validates: Requirements 5.3**

  - [ ]* 2.3 Write property test: Candidate Ranking is Descending (Property 2)
    - **Property 2: Candidate Ranking is Descending by Total Score**
    - Use fast-check to generate arbitrary employee arrays and valid demand criteria, verify `rankCandidates` output is sorted descending by sTotal
    - File: `packages/backend/src/services/scoring-service.test.ts`
    - **Validates: Requirements 5.3, 5.4**

  - [ ]* 2.4 Write property test: All Scores Bounded [0, 100] (Property 5)
    - **Property 5: All Individual Scores are Bounded [0, 100]**
    - Use fast-check to generate arbitrary employees and criteria, verify each sub-score and sTotal are within [0, 100]
    - File: `packages/backend/src/services/scoring-service.test.ts`
    - **Validates: Requirements 5.3**

- [ ] 3. Implement backend validation and API routes
  - [ ] 3.1 Create Zod validation middleware
    - Create `packages/backend/src/middleware/validation.ts` with `DemandRequestSchema` using Zod
    - Export a reusable `validate` middleware factory for Express route handlers
    - Schema must enforce: `squadIntent` non-empty, `projectCode` non-empty, `priorityLevel` enum, `requiredRole` non-empty, `requiredSkills` array min 1, `expectedDurationWeeks` positive, `businessDomain` non-empty
    - _Requirements: 5.6, 5.7, 5.8_

  - [ ]* 3.2 Write property test: Validation Rejects Incomplete Forms (Property 3)
    - **Property 3: Validation Rejects Incomplete Demand Forms**
    - Use fast-check to generate demand objects with at least one required field missing/empty, verify Zod schema rejects them
    - File: `packages/backend/src/middleware/validation.test.ts`
    - **Validates: Requirements 5.6, 5.7, 5.8**

  - [ ] 3.3 Create demand route handlers
    - Create `packages/backend/src/routes/demand.ts` with Express Router
    - Implement `POST /api/workspace/demand` — validate, persist DeliveryRequest via Prisma, trigger scoring, return `{ data: { demandId } }`
    - Implement `GET /api/workspace/:demandId/candidates` — load delivery request, run scoring, return ranked `ScoredCandidate[]`
    - Implement `GET /api/workspace/:demandId/candidates/:id/breakdown` — return score breakdown for single candidate
    - Wire error handling to global error middleware
    - _Requirements: 5.3, 5.4, 5.9_

  - [ ] 3.4 Create error handler middleware
    - Create `packages/backend/src/middleware/errorHandler.ts`
    - Handle Zod validation errors → 400 with `{ error: { code: "VALIDATION_FAILED", message } }`
    - Handle not found errors → 404 with `{ error: { code: "NOT_FOUND", message } }`
    - Handle unexpected errors → 500 with `{ error: { code: "INTERNAL_ERROR", message } }`
    - _Requirements: 5.6, 5.7, 5.8_

  - [ ] 3.5 Register routes in Express server entry point
    - Update `packages/backend/src/index.ts` to mount demand router at `/api/workspace`
    - Add JSON body parsing middleware and error handler middleware
    - _Requirements: 5.3_

- [ ] 4. Checkpoint — Backend complete
  - Ensure all tests pass, ask the user if questions arise.

- [ ] 5. Implement frontend state management and API client
  - [ ] 5.1 Create SquadContext provider
    - Create `packages/frontend/src/context/SquadContext.tsx` with `SquadForgeState` and `useReducer`
    - Implement actions: `SET_DEMAND`, `SET_CANDIDATES`, `SET_LOADING`, `RESET`
    - Export `SquadProvider` component and `useSquadContext` hook
    - _Requirements: 5.9_

  - [ ] 5.2 Create API client functions
    - Create `packages/frontend/src/api/client.ts`
    - Implement `submitDemand(criteria: DemandCriteria): Promise<{ demandId: string }>`
    - Implement `fetchCandidates(demandId: string): Promise<ScoredCandidate[]>`
    - Handle error responses and throw typed errors
    - _Requirements: 5.3, 5.4_

- [ ] 6. Implement frontend demand form
  - [ ] 6.1 Create useDemandForm hook
    - Create `packages/frontend/src/hooks/useDemandForm.ts`
    - Implement `useReducer`-based form state with `DemandFormFields`
    - Implement Zod validation (shared schema) with per-field error messages
    - Expose `fields`, `errors`, `isValid`, `isSubmitting`, `updateField`, `addSkill`, `removeSkill`, `submit`, `reset`
    - Implement debounced recalculation (300ms) on field changes after initial submission
    - _Requirements: 5.2, 5.5, 5.6, 5.7, 5.8_

  - [ ] 6.2 Create DemandCenter page component
    - Create `packages/frontend/src/pages/DemandCenter.tsx`
    - Render form fields: squad intent, project code, priority level (dropdown), required role, required skills (tag input), expected duration, business domain
    - Show inline validation errors below each field
    - "Generate Recommendations" submit button (disabled when form invalid or submitting)
    - On submit: call API via client, store demandId + criteria in SquadContext, display candidate results
    - Use semantic HTML and accessibility attributes (labels, aria-labels)
    - _Requirements: 5.1, 5.2, 5.3, 5.5, 5.6, 5.7, 5.8_

  - [ ]* 6.3 Write unit tests for useDemandForm hook
    - Test field updates, validation error display, skill add/remove, submit flow
    - File: `packages/frontend/src/hooks/useDemandForm.test.ts`
    - _Requirements: 5.2, 5.5, 5.6, 5.7, 5.8_

- [ ] 7. Checkpoint — Frontend complete
  - Ensure all tests pass, ask the user if questions arise.

- [ ] 8. Integration tests and wiring
  - [ ]* 8.1 Write integration tests for demand API routes
    - Test `POST /api/workspace/demand` creates delivery request and returns demandId
    - Test `GET /api/workspace/:id/candidates` returns correctly scored and ranked candidates
    - Test validation errors return 400 with proper error shape
    - Test not-found demand returns 404
    - File: `packages/backend/src/routes/demand.test.ts`
    - _Requirements: 5.3, 5.4, 5.6, 5.7, 5.8, 5.9_

  - [ ]* 8.2 Write property test: Demand Criteria Round-Trip Persistence (Property 4)
    - **Property 4: Demand Criteria Round-Trip Persistence**
    - Use fast-check to generate valid demand criteria, POST to API, then retrieve stored record, verify all fields match
    - File: `packages/backend/src/routes/demand.test.ts`
    - **Validates: Requirements 5.9**

  - [ ] 8.3 Wire frontend routing and app integration
    - Update `packages/frontend/src/App.tsx` to include `SquadProvider` and route to `DemandCenter` page
    - Add React Router route for `/demand` pointing to `DemandCenter`
    - Verify frontend can communicate with backend API
    - _Requirements: 5.1_

- [ ] 9. Final checkpoint — Ensure all tests pass
  - Ensure all tests pass, ask the user if questions arise.

## Notes

- Tasks marked with `*` are optional and can be skipped for faster MVP
- Each task references specific requirements for traceability
- Checkpoints ensure incremental validation
- Property tests validate universal correctness properties from the design document using fast-check
- Unit tests validate specific examples and edge cases
- The scoring service is implemented as pure functions for testability
- All TypeScript code must compile under strict mode with explicit return types on exports
- Use Tailwind CSS exclusively for styling — no CSS-in-JS or inline styles

## Task Dependency Graph

```json
{
  "waves": [
    { "id": 0, "tasks": ["1.1", "1.2"] },
    { "id": 1, "tasks": ["2.1", "3.1", "3.4"] },
    { "id": 2, "tasks": ["2.2", "2.3", "2.4", "3.2", "3.3"] },
    { "id": 3, "tasks": ["3.5", "5.1", "5.2"] },
    { "id": 4, "tasks": ["6.1"] },
    { "id": 5, "tasks": ["6.2", "6.3"] },
    { "id": 6, "tasks": ["8.1", "8.2", "8.3"] }
  ]
}
```
