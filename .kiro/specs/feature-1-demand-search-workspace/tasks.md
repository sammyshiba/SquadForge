# TASKS — Feature 1: Demand & Search Workspace

## Task 1: Create Demand Center Form Layout

- **Status:** not_started
- **Refs:** REQ-001
- **Files:** `packages/frontend/src/components/DemandCaptureForm.tsx`
- **Description:** Create the form component with all input fields (squad intent, project code, priority level, required role, required skills, expected duration, business domain). Use Tailwind utility classes. All inputs must have labels and proper `aria-label` attributes.

## Task 2: Add Form Validation

- **Status:** not_started
- **Refs:** REQ-005, REQ-006
- **Files:** `packages/frontend/src/hooks/useDemandForm.ts`
- **Description:** Implement Zod-based validation. Required role must be selected. At least one skill must be present. Duration > 0. Project code not empty. Display inline error messages when validation fails.

## Task 3: Add Required Skills Tag Selector

- **Status:** not_started
- **Refs:** REQ-001
- **Files:** `packages/frontend/src/components/SkillTagSelector.tsx`
- **Description:** Create a tag selector component with dismiss (×) and "+ Add Skill" autocomplete dropdown. Store selected skills in parent state.

## Task 4: Store Demand Criteria in Local State

- **Status:** not_started
- **Refs:** REQ-002, REQ-007
- **Files:** `packages/frontend/src/hooks/useDemandForm.ts`
- **Description:** Use `useReducer` to manage form state. Expose `demandCriteria` object matching the data shape in design.md.

## Task 5: Trigger Recommendation Scoring on Submit

- **Status:** not_started
- **Refs:** REQ-002, REQ-003
- **Files:** `packages/frontend/src/pages/ResourceQueue.tsx`
- **Description:** On valid form submission, call the scoring endpoint (or local scoring function). Populate the Recommendation Queue with sorted results. Show loading spinner during calculation.

## Task 6: Recalculate on Criteria Change

- **Status:** not_started
- **Refs:** REQ-004
- **Files:** `packages/frontend/src/hooks/useDemandForm.ts`
- **Description:** After initial recommendations exist, debounce (300ms) any field change and re-trigger scoring + re-sort of the candidate list.

## Task 7: Display Sorted Candidates in Recommendation Queue

- **Status:** not_started
- **Refs:** REQ-003, REQ-007
- **Files:** `packages/frontend/src/components/RecommendationQueue.tsx`
- **Description:** Render candidates in a 2-column grid sorted by total suitability score descending. Use mock data only. Zero external API calls.
