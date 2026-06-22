# UI SPECIFICATION — SQUADFORGE RESOURCE QUEUE

> **DIRECTIVE:** This document is the single source of truth for the Resource Queue screen. You MUST implement every component, layout, interaction, and accessibility requirement exactly as specified. Do NOT deviate, omit, or add elements not described here.

---

## CONSTRAINT: TECH STACK

All implementation MUST use:
- React 18+ functional components (named exports, no class components)
- TypeScript strict mode
- Tailwind CSS utility classes ONLY (no CSS-in-JS, no CSS modules, no inline styles)
- Express + Prisma + SQLite for backend
- Vitest for unit tests, Playwright for E2E
- Project structure: `packages/frontend/` and `packages/backend/`
- Scoring: rules-based weighted arithmetic ONLY — NEVER import AI/ML libraries

Reference: `.kiro/steering/tech.md`, `.kiro/steering/conventions.md`

---

## SCREEN: RESOURCE QUEUE

**Route:** `/resource-queue`

---

## LAYOUT STRUCTURE

```
┌────────────────────────────────────────────────────────────────────┐
│                          TOP NAV BAR (h-16)                         │
├──────────┬─────────────────────────────────────────────────────────┤
│          │  ┌──────────────────┐  ┌──────────────────────────────┐ │
│ SIDEBAR  │  │   LEFT PANEL     │  │   RIGHT PANEL                │ │
│ (w-60)   │  │   (w-2/5)        │  │   (w-3/5)                    │ │
│          │  │   Squad Intent   │  │   Recommendation Queue       │ │
│          │  └──────────────────┘  └──────────────────────────────┘ │
├──────────┴─────────────────────────────────────────────────────────┤
│                    BOTTOM BAR (fixed, h-16)                         │
└────────────────────────────────────────────────────────────────────┘
```

| Region       | Width        | Background       | Position       | Padding  |
|--------------|--------------|------------------|----------------|----------|
| Top Nav      | full         | `bg-white`       | sticky top-0   | `px-6`   |
| Sidebar      | `w-60`       | `bg-slate-800`   | fixed left     | `py-6`   |
| Left Panel   | `w-2/5`      | `bg-white`       | scrollable     | `p-6`    |
| Right Panel  | `w-3/5`      | `bg-slate-50`    | scrollable     | `p-6`    |
| Bottom Bar   | full - sidebar | `bg-slate-800` | fixed bottom   | `px-6`   |

---

## COMPONENT 1: TOP NAV BAR

**File:** `TopNavBar.tsx`

```tsx
<header className="sticky top-0 z-50 flex items-center justify-between h-16 px-6 bg-white border-b border-slate-200">
  <a href="/" className="text-lg font-bold text-slate-900">SquadForge</a>
  <input
    type="search"
    placeholder="Search resources..."
    className="w-64 h-10 px-4 text-sm bg-slate-100 rounded-lg border-none focus:ring-2 focus:ring-blue-500"
  />
  <div className="flex items-center gap-4">
    <button aria-label="Notifications">{/* bell icon */}</button>
    <button aria-label="Settings">{/* gear icon */}</button>
    <button aria-label="User menu">{/* avatar 32x32 circle */}</button>
  </div>
</header>
```

---

## COMPONENT 2: SIDEBAR

**File:** `Sidebar.tsx`

NAVIGATION ITEMS — render in this exact order:

| Order | Label            | Route             | Icon    | Active When              |
|-------|------------------|-------------------|---------|--------------------------|
| 1     | Demand Center    | `/demand-center`  | list    | `pathname === route`     |
| 2     | Resource Queue   | `/resource-queue` | users   | `pathname === route`     |
| 3     | Team Config      | `/team-config`    | cog     | `pathname === route`     |
| 4     | Analytics        | `/analytics`      | chart   | `pathname === route`     |
| —     | separator        | —                 | —       | —                        |
| 5     | Support          | `/support`        | help    | —                        |
| 6     | Documentation    | `/docs`           | file    | —                        |

ACTIVE STATE CLASSES:
- Active item: `bg-blue-600 text-white rounded-md px-3 py-2 font-semibold`
- Inactive item: `text-slate-300 hover:text-white px-3 py-2`

HEADER TEXT: "SF" (line 1, bold) + "RESOURCE OPTIMIZATION" (line 2, text-xs uppercase tracking-widest)

---

## COMPONENT 3: LEFT PANEL — SQUAD INTENT FORM

**File:** `SquadIntentForm.tsx`

### 3.1 Squad Intent Input

```tsx
<label className="text-xs font-medium uppercase tracking-wide text-slate-500">Squad Intent</label>
<input
  type="text"
  placeholder="e.g. Retail Banking App Refactor"
  className="w-full h-12 px-4 mt-1 text-sm border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
  value={intent}
  onChange={(e) => setIntent(e.target.value)}
/>
```

### 3.2 Priority Level + Project Code (side-by-side)

```tsx
<div className="grid grid-cols-2 gap-4 mt-4">
  <div>
    <label className="text-xs font-medium uppercase tracking-wide text-slate-500">Priority Level</label>
    <select className="w-full h-10 px-3 mt-1 text-sm border border-slate-300 rounded-lg">
      <option value="urgent-regulatory">Urgent - Regulatory</option>
      <option value="high">High</option>
      <option value="medium">Medium</option>
      <option value="low">Low</option>
    </select>
  </div>
  <div>
    <label className="text-xs font-medium uppercase tracking-wide text-slate-500">Project Code</label>
    <input
      type="text"
      value={projectCode}
      className="w-full h-10 px-3 mt-1 text-sm border border-slate-300 rounded-lg"
    />
  </div>
</div>
```

### 3.3 Required Competencies

STATE: `competencies: string[]`

RENDER EACH competency as a dismissible pill tag:
```tsx
<div className="flex flex-wrap gap-2 mt-4">
  {competencies.map((skill) => (
    <span key={skill} className="inline-flex items-center gap-1 px-3 py-1 text-sm bg-slate-200 text-slate-700 rounded-full">
      {skill}
      <button onClick={() => removeSkill(skill)} aria-label={`Remove ${skill}`} className="text-slate-400 hover:text-slate-700">×</button>
    </span>
  ))}
  <button onClick={openSkillDropdown} className="px-3 py-1 text-sm text-blue-600 hover:text-blue-800">+ Add Skill</button>
</div>
```

ON "+ Add Skill" CLICK: Show autocomplete dropdown. On selection, append to `competencies[]`.
ON "×" CLICK: Remove that skill from `competencies[]`.

### 3.4 Weighted Suitability Logic (read-only card)

```tsx
<div className="mt-6 p-4 border border-slate-200 rounded-lg">
  <h3 className="text-sm font-semibold text-slate-700">Weighted Suitability Logic</h3>
  <div className="grid grid-cols-3 gap-4 mt-3 text-center">
    <div><p className="text-xs uppercase tracking-wide text-slate-500">SKILLS</p><p className="text-lg font-bold">50%</p></div>
    <div><p className="text-xs uppercase tracking-wide text-slate-500">DOMAIN</p><p className="text-lg font-bold">30%</p></div>
    <div><p className="text-xs uppercase tracking-wide text-slate-500">TENURE</p><p className="text-lg font-bold">20%</p></div>
  </div>
</div>
```

### 3.5 Generate Recommendations Button

```tsx
<button
  onClick={handleGenerate}
  className="w-full h-12 mt-6 text-sm font-semibold text-white bg-blue-800 hover:bg-blue-700 rounded-lg"
>
  Generate Recommendations
</button>
```

ON CLICK:
1. Set `isLoading = true`
2. POST `/api/recommendations` with body: `{ intent, priority, projectCode, competencies, weights: { skills: 50, domain: 30, tenure: 20 } }`
3. On success: set `candidateList = response.data.candidates`, set `isLoading = false`
4. On error: show toast with error message, set `isLoading = false`

### 3.6 Workspace Status Card

```tsx
<div className="mt-6 p-4 border border-slate-200 rounded-lg">
  <div className="flex items-center justify-between">
    <h3 className="text-sm font-semibold text-slate-700">WORKSPACE STATUS</h3>
    <span className="px-2 py-0.5 text-xs font-semibold uppercase bg-green-100 text-green-700 rounded">LIVE SYNC</span>
  </div>
  <p className="mt-2 text-sm text-slate-600">Demand parameters are locked to Financial Cluster A guidelines.</p>
  <p className="text-sm text-slate-600">Candidate pool is filtered by 48-hour availability windows.</p>
</div>
```

---

## COMPONENT 4: RIGHT PANEL — RECOMMENDATION QUEUE

**File:** `RecommendationQueue.tsx`

### 4.1 Header Row

```tsx
<div className="flex items-center justify-between mb-4">
  <h2 className="text-lg font-bold text-slate-900">⭐ Recommendation Queue</h2>
  <div className="flex gap-2">
    <button className="px-3 py-1.5 text-sm border border-slate-300 rounded-lg hover:bg-slate-100">🔽 Filter</button>
    <button className="px-3 py-1.5 text-sm border border-slate-300 rounded-lg hover:bg-slate-100">↕️ Rank</button>
  </div>
</div>
```

FILTER: Opens a panel to filter by availability, minimum suitability score, role type.
RANK: Cycles sort order → suitability desc → skills match → domain fit → tenure boost.

### 4.2 Candidate Card Grid

**Layout:** `grid grid-cols-2 gap-4` (single column below 1024px)

### 4.3 Candidate Card

**File:** `CandidateCard.tsx`

**Props Interface:**
```ts
interface CandidateCardProps {
  candidate: {
    id: string;
    name: string;
    role: string;
    avatarUrl: string;
    availability: 'available_now' | 'next_monday' | 'two_week_notice';
    suitability: number;
    scores: {
      skills: { value: number; max: number };
      domain: { value: number; max: number };
      tenure: { value: number; max: number };
    };
  };
  onAssign: (id: string) => void;
}
```

**STRUCTURE:**
```tsx
<div className="bg-white rounded-xl shadow-sm border border-slate-200 p-4">
  {/* ROW 1: Avatar + Info + Suitability Circle */}
  <div className="flex items-start justify-between">
    <div className="flex items-center gap-3">
      <img src={candidate.avatarUrl} alt={candidate.name} className="w-12 h-12 rounded-full object-cover" />
      <div>
        <h4 className="text-sm font-bold text-slate-900">{candidate.name}</h4>
        <p className="text-xs text-slate-500">{candidate.role}</p>
        <AvailabilityBadge status={candidate.availability} />
      </div>
    </div>
    <SuitabilityCircle score={candidate.suitability} />
  </div>

  {/* ROW 2: Score Breakdown */}
  <div className="mt-4 space-y-2">
    <ScoreRow label="Skills Match (50%)" value={candidate.scores.skills.value} max={candidate.scores.skills.max} />
    <ScoreRow label="Domain Fit (30%)" value={candidate.scores.domain.value} max={candidate.scores.domain.max} />
    <ScoreRow label="Tenure Boost (20%)" value={candidate.scores.tenure.value} max={candidate.scores.tenure.max} />
  </div>

  {/* ROW 3: Actions */}
  <div className="flex items-center justify-between mt-4">
    <a href={`/candidates/${candidate.id}/breakdown`} className="text-sm text-blue-600 hover:underline">
      Expand Breakdown ↗
    </a>
    <button
      onClick={() => onAssign(candidate.id)}
      className="px-4 py-2 text-sm font-semibold text-white bg-blue-800 hover:bg-blue-700 rounded-lg"
    >
      Assign to Squad
    </button>
  </div>
</div>
```

### 4.4 Availability Badge

**File:** `AvailabilityBadge.tsx`

| `status` value     | Display Text     | Icon       | Classes                                     |
|--------------------|------------------|------------|---------------------------------------------|
| `available_now`    | AVAILABLE NOW    | green dot  | `bg-green-100 text-green-700 text-xs px-2 py-0.5 rounded-full` |
| `next_monday`      | NEXT MON         | clock      | `bg-yellow-100 text-yellow-700 text-xs px-2 py-0.5 rounded-full` |
| `two_week_notice`  | 2 WEEK NOTICE    | alert      | `bg-orange-100 text-orange-700 text-xs px-2 py-0.5 rounded-full` |

MUST include text label — colour alone is NOT sufficient (accessibility).

### 4.5 Suitability Circle

**File:** `SuitabilityCircle.tsx`

- SVG circular progress ring, diameter: `56px`, stroke-width: `4px`
- Background track: `stroke-slate-200`
- Progress stroke colour:
  - score >= 80 → `stroke-green-600` (#16a34a)
  - score 60–79 → `stroke-amber-500` (#d97706)
  - score < 60 → `stroke-red-600` (#dc2626)
- Centre text: `{score}%` in `text-xl font-bold font-mono`
- Label above ring: "SUITABILITY" in `text-[10px] uppercase tracking-widest text-slate-500`
- MUST have `role="img" aria-label="Suitability score: {score} percent"`

### 4.6 Score Row

**File:** `ScoreRow.tsx`

```tsx
interface ScoreRowProps {
  label: string;
  value: number;
  max: number;
}

export const ScoreRow = ({ label, value, max }: ScoreRowProps) => (
  <div className="flex items-center justify-between" aria-label={`${label}: ${value} out of ${max}`}>
    <span className="text-sm text-slate-600">{label}</span>
    <span className="text-sm font-semibold text-slate-900">{value}/{max}</span>
  </div>
);
```

---

## COMPONENT 5: BOTTOM BAR — PROPOSED DELIVERY SQUAD

**File:** `ProposedSquadBar.tsx`

**STATE:**
```ts
interface SquadState {
  members: Candidate[];    // assigned candidates
  totalSeats: number;      // default: 5
  velocityScore: number;   // calculated from assigned members
}
```

**STRUCTURE:**
```tsx
<footer className="fixed bottom-0 left-60 right-0 h-16 flex items-center justify-between px-6 bg-slate-800 z-40">
  {/* Left: Title + Seats */}
  <div>
    <span className="text-sm font-semibold text-white">Proposed Delivery Squad</span>
    <span className="ml-2 text-xs text-slate-400">{members.length} of {totalSeats} seats filled ({percentage}%)</span>
  </div>

  {/* Centre: Avatar Stack */}
  <div className="flex -space-x-2">
    {members.slice(0, 3).map((m) => (
      <img key={m.id} src={m.avatarUrl} alt={m.name} className="w-8 h-8 rounded-full border-2 border-slate-800" />
    ))}
    {members.length > 3 && (
      <span className="flex items-center justify-center w-8 h-8 text-xs font-semibold text-white bg-slate-600 rounded-full border-2 border-slate-800">
        +{members.length - 3}
      </span>
    )}
  </div>

  {/* Right: Velocity + Actions */}
  <div className="flex items-center gap-4">
    <div className="text-right">
      <p className="text-xs text-slate-400 uppercase">Squad Velocity Score</p>
      <p className="text-sm font-bold text-white">{velocityScore} <span className="text-green-400">↗</span></p>
    </div>
    <button
      onClick={handleReset}
      className="px-4 py-2 text-sm font-medium text-slate-300 border border-slate-500 rounded-lg hover:bg-slate-700"
    >
      Reset Proposal
    </button>
    <button
      onClick={handleFinalize}
      className="px-4 py-2 text-sm font-semibold text-white bg-green-600 hover:bg-green-500 rounded-lg"
    >
      ✅ Finalize Squad
    </button>
  </div>
</footer>
```

**INTERACTIONS:**

| Action            | Behaviour                                                                 |
|-------------------|---------------------------------------------------------------------------|
| "Assign to Squad" | Append candidate to `members[]`. Recalculate `velocityScore`. Show toast: `aria-live="polite"` → "{name} assigned to squad". |
| "Reset Proposal"  | Show confirmation dialog. On confirm: `members = []`, `velocityScore = 0`. |
| "Finalize Squad"  | IF `members.length < 1` → show validation error. ELSE → POST `/api/squads/finalize` → navigate to confirmation page. |

---

## STATE ARCHITECTURE

```ts
// useResourceQueue.ts — custom hook for this page

interface ResourceQueueState {
  // Form
  intent: string;
  priority: 'urgent-regulatory' | 'high' | 'medium' | 'low';
  projectCode: string;
  competencies: string[];

  // Recommendations
  candidateList: Candidate[];
  isLoading: boolean;

  // Squad
  squad: Candidate[];
  totalSeats: number;         // default: 5
  velocityScore: number;

  // UI
  showSkillDropdown: boolean;
  showFilterPanel: boolean;
  sortOrder: 'suitability' | 'skills' | 'domain' | 'tenure';
}
```

---

## API CONTRACTS

### POST `/api/recommendations`

**Request body (validated with Zod on backend):**
```json
{
  "intent": "Retail Banking App Refactor",
  "priority": "urgent-regulatory",
  "projectCode": "ZAF-2024-081",
  "competencies": ["React.js", "Spring Boot", "Swift"],
  "weights": { "skills": 50, "domain": 30, "tenure": 20 }
}
```

**Scoring formula (MUST be rules-based, NO AI/ML):**
```
suitability = round(
  (skills.value / skills.max × weights.skills) +
  (domain.value / domain.max × weights.domain) +
  (tenure.value / tenure.max × weights.tenure)
)
```

**Success response — `200 OK`:**
```json
{
  "data": {
    "candidates": [
      {
        "id": "uuid-string",
        "name": "Thabo Mokoena",
        "role": "Senior Fullstack Developer",
        "avatarUrl": "/avatars/thabo.jpg",
        "availability": "available_now",
        "suitability": 94,
        "scores": {
          "skills": { "value": 48, "max": 50 },
          "domain": { "value": 28, "max": 30 },
          "tenure": { "value": 18, "max": 20 }
        }
      }
    ]
  }
}
```

**Error response — `400`:**
```json
{
  "error": { "code": "INVALID_REQUEST", "message": "..." }
}
```

### POST `/api/squads/finalize`

**Request:**
```json
{
  "projectCode": "ZAF-2024-081",
  "candidateIds": ["uuid-1", "uuid-2", "uuid-3"],
  "velocityScore": 8.2
}
```

**Success response — `200 OK`:**
```json
{
  "data": {
    "squadId": "uuid",
    "status": "finalized",
    "redirectUrl": "/squads/{squadId}/confirmation"
  }
}
```

---

## RESPONSIVE BREAKPOINTS

| Breakpoint          | Layout Changes                                                        |
|---------------------|-----------------------------------------------------------------------|
| ≥ 1280px (desktop)  | Two-panel side-by-side. Candidate grid: 2 columns. Bottom bar visible. |
| 1024–1279px (laptop) | Two-panel side-by-side. Candidate grid: 1 column.                    |
| 640–1023px (tablet)  | Panels stack vertically. Sidebar collapses to hamburger menu.         |
| < 640px (mobile)     | Full-width stacked. Bottom bar becomes slide-up drawer. Cards full-width. |

TAILWIND IMPLEMENTATION:
- Candidate grid: `grid grid-cols-1 lg:grid-cols-2 gap-4`
- Panels: `flex flex-col lg:flex-row`
- Sidebar: `hidden lg:block` + hamburger toggle for mobile

---

## ACCESSIBILITY — MANDATORY

| Requirement                   | Implementation                                                                    |
|-------------------------------|-----------------------------------------------------------------------------------|
| Skip link                     | `<a href="#main-content" className="sr-only focus:not-sr-only">Skip to content</a>` BEFORE sidebar |
| Keyboard tab order            | search → sidebar items → form fields → generate button → candidate cards → bottom bar buttons |
| Candidate card aria-label     | `aria-label="{name}, {role}, suitability {score} percent, {availability status}"` |
| Suitability circle            | `role="img" aria-label="Suitability score: {score} percent"`                      |
| Score rows                    | `aria-label="{label}: {value} out of {max}"`                                      |
| Assign confirmation           | Toast with `aria-live="polite"`: "{name} assigned to squad"                       |
| Availability badge            | MUST include text label — colour alone is NEVER sufficient                        |
| Focus indicators              | `focus:ring-2 focus:ring-blue-500 focus:ring-offset-2` on ALL interactive elements |
| Contrast ratios               | Body text ≥ 4.5:1. Large text and UI components ≥ 3:1.                           |
| Icon-only buttons             | MUST have `aria-label` (notifications, settings, user menu, × dismiss)            |

---

## SEED DATA FOR DEVELOPMENT

Use this data to render the initial state during development:

```ts
export const SEED_CANDIDATES: Candidate[] = [
  {
    id: '1',
    name: 'Thabo Mokoena',
    role: 'Senior Fullstack Developer',
    avatarUrl: '/avatars/thabo.jpg',
    availability: 'available_now',
    suitability: 94,
    scores: { skills: { value: 48, max: 50 }, domain: { value: 28, max: 30 }, tenure: { value: 18, max: 20 } },
  },
  {
    id: '2',
    name: 'Sarah Jenkins',
    role: 'Product Owner',
    avatarUrl: '/avatars/sarah.jpg',
    availability: 'next_monday',
    suitability: 87,
    scores: { skills: { value: 42, max: 50 }, domain: { value: 25, max: 30 }, tenure: { value: 20, max: 20 } },
  },
  {
    id: '3',
    name: 'Liam Naidoo',
    role: 'UI/UX Lead',
    avatarUrl: '/avatars/liam.jpg',
    availability: 'available_now',
    suitability: 82,
    scores: { skills: { value: 40, max: 50 }, domain: { value: 22, max: 30 }, tenure: { value: 20, max: 20 } },
  },
  {
    id: '4',
    name: 'Sipho Zulu',
    role: 'DevOps Engineer',
    avatarUrl: '/avatars/sipho.jpg',
    availability: 'two_week_notice',
    suitability: 79,
    scores: { skills: { value: 35, max: 50 }, domain: { value: 29, max: 30 }, tenure: { value: 15, max: 20 } },
  },
];
```

---

## FILE MAP — EXPECTED OUTPUT

When implementing this screen, you MUST create these files:

```
packages/frontend/src/
├── pages/
│   └── ResourceQueue.tsx          # Page component (assembles all sections)
├── components/
│   ├── TopNavBar.tsx
│   ├── Sidebar.tsx
│   ├── SquadIntentForm.tsx
│   ├── RecommendationQueue.tsx
│   ├── CandidateCard.tsx
│   ├── AvailabilityBadge.tsx
│   ├── SuitabilityCircle.tsx
│   ├── ScoreRow.tsx
│   └── ProposedSquadBar.tsx
├── hooks/
│   └── useResourceQueue.ts        # State management hook
├── types/
│   └── candidate.ts               # Candidate interface + related types
└── data/
    └── seed-candidates.ts         # SEED_CANDIDATES constant
```
