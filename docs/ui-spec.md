# UI SPECIFICATION — SQUADFORGE

> **DIRECTIVE:** This is the single source of truth for all SquadForge screens. An AI agent MUST implement every component, layout, interaction, and accessibility requirement exactly as specified.

---

## CONSTRAINT: TECH STACK

- React 18+ functional components (named exports, no class components)
- TypeScript strict mode
- Tailwind CSS utility classes ONLY (no CSS-in-JS, no CSS modules, no inline styles except dynamic widths)
- Express + Prisma + SQLite for backend
- Vitest for unit tests, Playwright for E2E
- Project structure: `packages/frontend/` and `packages/backend/`
- Scoring: rules-based weighted arithmetic ONLY — NEVER import AI/ML libraries

Reference: `.kiro/steering/tech.md`, `.kiro/steering/conventions.md`

---

## OVERVIEW

SquadForge is a lightweight internal tool that enables delivery leads to rapidly assemble cross-functional squads by:
- Capturing a delivery need
- Generating ranked candidate recommendations
- Explaining suitability scores
- Building a proposed squad
- Finalizing selection

---

## USER JOURNEY

```
Capture Demand → Generate Recommendations → Review Candidates → View Breakdown → Build Squad → Finalize
```

---

## SCREEN 1: DEMAND CAPTURE (Demand Center)

**Route:** `/demand-center`
**File:** `packages/frontend/src/pages/DemandCenter.tsx`

### Purpose

Capture delivery requirements and trigger candidate matching.

### Layout

Centered form container with header section, form inputs, and action button.

```
┌────────────────────────────────────────┐
│           DEMAND CENTER                │
│    Define your delivery need           │
│                                        │
│  ┌──────────────────────────────────┐  │
│  │  Squad Intent         [textarea] │  │
│  │  Project Code         [input]    │  │
│  │  Priority Level       [dropdown] │  │
│  │  Required Role        [dropdown] │  │
│  │  Required Skills      [multi]    │  │
│  │  Duration (weeks)     [number]   │  │
│  │  Business Domain      [dropdown] │  │
│  └──────────────────────────────────┘  │
│                                        │
│  [    Generate Recommendations    ]    │
└────────────────────────────────────────┘
```

### Components

#### Header

| Element  | Content                       | Classes                                          |
|----------|-------------------------------|--------------------------------------------------|
| Title    | "Demand Center"               | `text-2xl font-bold text-slate-900`              |
| Subtitle | "Define your delivery need"   | `text-sm text-slate-500 mt-1`                    |

#### Form Fields

| Field           | Type         | Required | Options / Format                              |
|-----------------|--------------|:--------:|-----------------------------------------------|
| Squad Intent    | Textarea     | ✅       | Free text, 3 rows min                         |
| Project Code    | Text Input   | ✅       | Format: `ZAF-YYYY-NNN`                       |
| Priority Level  | Dropdown     | ✅       | High, Medium, Low                             |
| Required Role   | Dropdown     | ✅       | From role list                                |
| Required Skills | Multi-select | ✅       | Tag chips with dismiss (×) + "Add Skill"     |
| Duration        | Number Input | ✅       | Weeks, must be > 0                            |
| Business Domain | Dropdown     | ✅       | From domain list                              |

#### Action Button

```tsx
<button
  disabled={!isValid}
  className="w-full h-12 mt-6 text-sm font-semibold text-white bg-blue-600 hover:bg-blue-700 disabled:bg-slate-300 disabled:cursor-not-allowed rounded-lg"
>
  Generate Recommendations
</button>
```

### Validation Rules

| Field           | Rule                       | Error Message                    |
|-----------------|----------------------------|----------------------------------|
| Required Role   | MUST be selected           | "Required role is missing"       |
| Required Skills | At least 1 MUST be selected| "At least one skill is required" |
| Project Code    | MUST not be empty          | "Project code is required"       |
| Duration        | MUST be > 0               | "Duration must be greater than 0"|

### Interactions

| Trigger                     | Action                                              |
|-----------------------------|-----------------------------------------------------|
| Submit (valid)              | POST `/api/workspace/demand` → navigate to Screen 2 |
| Submit (invalid)            | Show inline error messages below invalid fields     |
| Field change after errors   | Clear error for that field on valid input            |

---

## SCREEN 2: CANDIDATE RECOMMENDATIONS

**Route:** `/workspace/:demandId/candidates`
**File:** `packages/frontend/src/pages/CandidateList.tsx`

### Purpose

Display ranked candidates based on suitability score.

### Layout

```
┌────────────────────────────────────────────────┐
│  [Sort: dropdown]  [Filter: Role] [Filter: Skill] │
├────────────────────────────────────────────────┤
│                                                │
│  ┌─────────────────┐  ┌─────────────────┐     │
│  │ Candidate Card  │  │ Candidate Card  │     │
│  └─────────────────┘  └─────────────────┘     │
│  ┌─────────────────┐  ┌─────────────────┐     │
│  │ Candidate Card  │  │ Candidate Card  │     │
│  └─────────────────┘  └─────────────────┘     │
│                                                │
├────────────────────────────────────────────────┤
│  STICKY FOOTER: Proposed Squad Builder         │
└────────────────────────────────────────────────┘
```

- Top: Filter bar
- Middle: Scrollable candidate grid (`grid grid-cols-1 lg:grid-cols-2 gap-4`)
- Bottom: Sticky squad builder footer (fixed)

### Filter Bar

| Element        | Type     | Options                          |
|----------------|----------|----------------------------------|
| Sort dropdown  | Select   | Score (desc), Availability       |
| Role filter    | Select   | All roles from dataset           |
| Skill filter   | Select   | All skills from dataset          |

### Candidate Card

**File:** `packages/frontend/src/components/CandidateCard.tsx`

**Props:**
```ts
interface CandidateCardProps {
  candidate: {
    id: string;
    name: string;
    primaryRole: string;
    avatarUrl: string;
    availability: 'available_now' | 'partial_capacity' | 'limited_capacity';
    currentAllocationPercentage: number;
    skills: { name: string; level: number }[];
    sTotal: number;
    sSkill: number;
    sAvail: number;
    sRole: number;
  };
  isAssigned: boolean;
  onAssign: (id: string) => void;
  onViewBreakdown: (id: string) => void;
}
```

**Card Structure:**
```tsx
<div className="bg-white rounded-xl shadow-sm border border-slate-200 p-4">
  {/* Row 1: Identity + Score */}
  <div className="flex items-start justify-between">
    <div className="flex items-center gap-3">
      <img src={avatarUrl} alt={name} className="w-12 h-12 rounded-full object-cover" />
      <div>
        <h4 className="text-sm font-bold text-slate-900">{name}</h4>
        <p className="text-xs text-slate-500">{primaryRole}</p>
        <AvailabilityBadge allocation={currentAllocationPercentage} />
      </div>
    </div>
    <SuitabilityScore value={sTotal} />
  </div>

  {/* Row 2: Skills */}
  <div className="flex flex-wrap gap-1 mt-3">
    {skills.map(s => <SkillChip key={s.name} name={s.name} level={s.level} />)}
  </div>

  {/* Row 3: Actions */}
  <div className="flex items-center justify-between mt-4">
    <button onClick={() => onViewBreakdown(id)} className="text-sm text-blue-600 hover:underline">
      View Breakdown
    </button>
    <button
      onClick={() => onAssign(id)}
      disabled={isAssigned}
      className={isAssigned
        ? "px-4 py-2 text-sm bg-slate-300 text-slate-500 cursor-not-allowed rounded-lg"
        : "px-4 py-2 text-sm font-semibold text-white bg-blue-600 hover:bg-blue-700 rounded-lg"
      }
    >
      {isAssigned ? 'Assigned' : 'Assign to Squad'}
    </button>
  </div>
</div>
```

### Availability Badge

**File:** `packages/frontend/src/components/AvailabilityBadge.tsx`

| Allocation    | Label             | Classes                                     |
|---------------|-------------------|---------------------------------------------|
| 0%            | Available Now     | `bg-green-100 text-green-700 text-xs px-2 py-0.5 rounded-full` |
| 1–50%         | Partial Capacity  | `bg-yellow-100 text-yellow-700 text-xs px-2 py-0.5 rounded-full` |
| > 50%         | Limited Capacity  | `bg-orange-100 text-orange-700 text-xs px-2 py-0.5 rounded-full` |

MUST include text label — colour alone is NEVER sufficient.

### Suitability Score

**File:** `packages/frontend/src/components/SuitabilityScore.tsx`

- Large number display: `text-2xl font-bold font-mono`
- Colour: score >= 80 → `text-green-600`, 60–79 → `text-amber-600`, < 60 → `text-red-600`
- MUST have `aria-label="Suitability score: {value} percent"`

---

## SCREEN 3: CANDIDATE BREAKDOWN

**Pattern:** Expandable accordion within the candidate card (not a separate page).
**File:** `packages/frontend/src/components/CandidateBreakdown.tsx`

### Purpose

Provide explainability for candidate ranking.

### Breakdown Content

| Score             | Weight | Display                          |
|-------------------|--------|----------------------------------|
| Skill Match       | 50%    | Progress bar + value out of 100  |
| Availability      | 30%    | Progress bar + value out of 100  |
| Role Alignment    | 20%    | Progress bar + value out of 100  |
| **Total**         | —      | Bold, prominent display          |
| Reason            | —      | Rule-based explanation text      |

### Score Bar Component

**File:** `packages/frontend/src/components/ScoreBar.tsx`

```tsx
interface ScoreBarProps {
  label: string;
  value: number;
  max: number;  // always 100
}

export const ScoreBar = ({ label, value, max }: ScoreBarProps): JSX.Element => (
  <div className="flex items-center gap-3" aria-label={`${label}: ${value} out of ${max}`}>
    <span className="w-32 text-sm text-slate-600">{label}</span>
    <div className="flex-1 h-2 bg-slate-200 rounded-full overflow-hidden">
      <div
        className={clsx('h-full rounded-full', {
          'bg-green-500': value >= 80,
          'bg-amber-500': value >= 60 && value < 80,
          'bg-red-500': value < 60,
        })}
        style={{ width: `${(value / max) * 100}%` }}
      />
    </div>
    <span className="w-8 text-sm font-semibold text-slate-900 text-right">{value}</span>
  </div>
);
```

### Recommendation Reason

Generated from scoring rules (NOT AI):

```ts
export const generateReason = (sSkill: number, sAvail: number, sRole: number, allocation: number): string => {
  const parts: string[] = [];

  if (sSkill >= 80) parts.push('Strong skill alignment');
  else if (sSkill >= 50) parts.push('Moderate skill match');
  else parts.push('Weak skill match');

  if (sAvail === 100) parts.push('fully available');
  else if (sAvail === 70) parts.push(`good availability (${allocation}% allocated)`);
  else parts.push(`limited availability (${allocation}% allocated)`);

  if (sRole === 100) parts.push('exact role match');
  else parts.push('role mismatch');

  return parts.join(', ') + '.';
};
```

### Example Rendering

```
Skill Match     ██████████ (93)
Availability    ███████░░░ (70)
Role Alignment  ██████████ (100)

Total: 87.67%

Reason:
Strong skill alignment, good availability (40% allocated), exact role match.
```

---

## SCREEN 4: PROPOSED SQUAD BUILDER

**Pattern:** Sticky footer panel on the Candidate Recommendations screen.
**File:** `packages/frontend/src/components/ProposedSquadBar.tsx`

### Purpose

Allow users to build a squad from selected candidates.

### Layout

```
┌────────────────────────────────────────────────────────────────┐
│  [👤 Thabo ×] [👤 Sarah ×] [👤 Liam ×]    3 Members Selected   │
│                                         [Reset] [Finalize Squad]│
└────────────────────────────────────────────────────────────────┘
```

- Position: `fixed bottom-0`
- Background: `bg-slate-800`
- Height: `h-16` (expands if many members on mobile)

### Components

#### Candidate Chips

```tsx
<span className="inline-flex items-center gap-1 px-3 py-1 text-sm bg-slate-700 text-white rounded-full">
  <img src={avatarUrl} alt={name} className="w-5 h-5 rounded-full" />
  {name}
  <button onClick={() => onRemove(id)} aria-label={`Remove ${name}`} className="text-slate-400 hover:text-white">×</button>
</span>
```

#### Member Count

`{count} Members Selected` — `text-sm text-slate-400`

#### Action Buttons

| Button         | Style      | Condition                    |
|----------------|------------|------------------------------|
| Reset          | Secondary  | Always enabled if count > 0  |
| Finalize Squad | Primary    | Enabled when count ≥ 1       |

### Interaction Rules

| Action                   | Behaviour                                                   |
|--------------------------|-------------------------------------------------------------|
| Assign to Squad (card)   | Append candidate. Duplicate → prevent, show "Assigned" state |
| Remove (× on chip)       | Remove from array. Update count. Re-enable card button.     |
| Reset                    | Confirmation dialog → clear all members                     |
| Finalize Squad           | DISABLED if 0 members. Navigate to Screen 5.                |

---

## SCREEN 5: SQUAD SUMMARY

**Route:** `/squad/:squadId/summary`
**File:** `packages/frontend/src/pages/SquadSummary.tsx`

### Purpose

Confirm and export squad selection.

### Layout

Centered summary card.

```
┌────────────────────────────────────┐
│  Project: ZAF-2024-081             │
│  Intent: Retail Banking Refactor   │
│                                    │
│  SQUAD MEMBERS                     │
│  ┌──────────────────────────────┐  │
│  │ Thabo Mokoena | FE Eng | 87% │  │
│  │ Sarah Jenkins | PO     | 82% │  │
│  │ Liam Naidoo  | UI/UX  | 77% │  │
│  └──────────────────────────────┘  │
│                                    │
│  [Export Summary]      [Done]      │
└────────────────────────────────────┘
```

### Components

#### Project Info

| Field        | Source                |
|--------------|----------------------|
| Project Code | From demand criteria  |
| Squad Intent | From demand criteria  |

#### Squad Members Table

| Column           | Source              |
|------------------|---------------------|
| Name             | candidate.name      |
| Role             | candidate.primaryRole |
| Suitability Score| candidate.sTotal    |

#### Actions

| Button          | Behaviour                                      |
|-----------------|------------------------------------------------|
| Export Summary  | GET `/api/squad/:id/export` → copy/download JSON |
| Done            | Navigate to home or demand center              |

---

## STATE ARCHITECTURE

```ts
// packages/frontend/src/hooks/useSquadForge.ts

interface SquadForgeState {
  // Demand
  demandId: string | null;
  demandCriteria: DemandCriteria | null;

  // Candidates
  candidateList: ScoredCandidate[];
  isLoading: boolean;
  sortOrder: 'suitability' | 'availability';
  expandedBreakdown: string | null;  // candidateId or null

  // Squad
  squad: ScoredCandidate[];
}
```

---

## API ENDPOINTS USED BY UI

| Screen       | Method | Endpoint                                          | Purpose              |
|--------------|--------|---------------------------------------------------|----------------------|
| Screen 1     | POST   | `/api/workspace/demand`                           | Submit demand        |
| Screen 2     | GET    | `/api/workspace/:demandId/candidates`             | Load ranked list     |
| Screen 3     | GET    | `/api/workspace/:demandId/candidates/:id/breakdown` | Score details     |
| Screen 4     | POST   | `/api/squad`                                      | Create squad         |
| Screen 4     | POST   | `/api/squad/:id/members`                          | Assign candidate     |
| Screen 4     | DELETE | `/api/squad/:id/members/:candidateId`             | Remove candidate     |
| Screen 4     | POST   | `/api/squad/:id/reset`                            | Reset squad          |
| Screen 5     | POST   | `/api/squad/:id/finalize`                         | Finalize             |
| Screen 5     | GET    | `/api/squad/:id/export`                           | Export summary       |

---

## RESPONSIVE BREAKPOINTS

| Breakpoint          | Changes                                                        |
|---------------------|----------------------------------------------------------------|
| ≥ 1024px (desktop)  | 2-column candidate grid. Side-by-side layout.                  |
| 640–1023px (tablet)  | 1-column candidate grid. Filters collapse to drawer.          |
| < 640px (mobile)     | Full-width cards. Footer becomes slide-up drawer.             |

---

## DESIGN SYSTEM

### Colours

| Usage          | Tailwind Class        |
|----------------|-----------------------|
| Primary        | `bg-blue-600`         |
| Primary hover  | `hover:bg-blue-700`   |
| High score     | `text-green-600`      |
| Medium score   | `text-amber-600`      |
| Low score      | `text-red-600`        |
| Background     | `bg-slate-50`         |
| Card           | `bg-white`            |
| Dark surface   | `bg-slate-800`        |
| Text primary   | `text-slate-900`      |
| Text secondary | `text-slate-500`      |

### Typography

| Element      | Classes                          |
|--------------|----------------------------------|
| Page title   | `text-2xl font-bold`             |
| Card title   | `text-sm font-bold`              |
| Body text    | `text-sm`                        |
| Metadata     | `text-xs text-slate-500`         |
| Scores       | `text-2xl font-bold font-mono`   |

### UI Elements

| Element       | Classes                                                    |
|---------------|------------------------------------------------------------|
| Card          | `bg-white rounded-xl shadow-sm border border-slate-200 p-4` |
| Primary btn   | `bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg px-4 py-2` |
| Secondary btn | `border border-slate-300 text-slate-700 hover:bg-slate-100 rounded-lg px-4 py-2` |
| Chip          | `bg-slate-100 text-slate-700 rounded-full px-3 py-1 text-xs` |
| Score bar     | `h-2 bg-slate-200 rounded-full` (track) + coloured fill   |

---

## ACCESSIBILITY — MANDATORY

| Requirement                   | Implementation                                                      |
|-------------------------------|---------------------------------------------------------------------|
| Form labels                   | ALL form controls MUST have associated `<label>` elements           |
| Keyboard navigation           | Tab through all interactive elements in logical order               |
| Score indicators              | MUST have `aria-label` with numeric value                           |
| Colour independence           | NEVER use colour alone — always pair with text/icon                 |
| Font sizes                    | Minimum 14px body, 12px metadata                                    |
| Focus indicators              | `focus:ring-2 focus:ring-blue-500 focus:ring-offset-2`              |
| Dynamic updates               | Use `aria-live="polite"` for squad member changes                   |
| Contrast                      | Body ≥ 4.5:1, large text ≥ 3:1                                     |

---

## INTERACTION PRINCIPLES

- Fast decision making (target: under 60 seconds from demand to squad)
- Minimal clicks (3–5 clicks from start to finalize)
- Clear visual hierarchy (scores prominent, metadata subtle)
- Transparent scoring (always show why)
- Real-time updates on input changes

---

## FILE MAP — EXPECTED OUTPUT

```
packages/frontend/src/
├── pages/
│   ├── DemandCenter.tsx
│   ├── CandidateList.tsx
│   └── SquadSummary.tsx
├── components/
│   ├── CandidateCard.tsx
│   ├── CandidateBreakdown.tsx
│   ├── AvailabilityBadge.tsx
│   ├── SuitabilityScore.tsx
│   ├── ScoreBar.tsx
│   ├── SkillChip.tsx
│   ├── ProposedSquadBar.tsx
│   └── FilterBar.tsx
├── hooks/
│   ├── useSquadForge.ts
│   └── useDemandForm.ts
├── context/
│   └── SquadContext.tsx
├── utils/
│   ├── generate-reason.ts
│   └── export-squad.ts
└── types/
    └── index.ts
```

---

## FINAL NOTES

- ALL data is mock data — no external integrations
- Scoring is rules-based and transparent (see `docs/api-spec.md` for formula)
- UI MUST prioritize clarity and speed
- Follow `conventions.md` for all code patterns
