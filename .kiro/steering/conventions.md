# CODING CONVENTIONS — MANDATORY RULES

> **SCOPE:** These rules apply to ALL code you generate in this workspace. Violations are not acceptable. When in doubt, follow the rule literally.

---

## RULE 1: TYPESCRIPT STRICT MODE

- ALWAYS use `.ts` or `.tsx` file extensions. NEVER generate `.js` or `.jsx` files.
- `"strict": true` is enforced in tsconfig. Code MUST compile under strict mode.
- PREFER `const`. Use `let` only when reassignment is required. NEVER use `var`.
- ALWAYS add explicit return types to exported functions.
- Use `interface` for object shapes. Use `type` for unions and intersections.
- NEVER use `any`. Use `unknown` and narrow with type guards. If `any` is unavoidable, add `// eslint-disable-next-line @typescript-eslint/no-explicit-any` with a justification comment.
- Use `as const` for immutable literal objects.

CORRECT:
```ts
export const getCandidate = async (id: string): Promise<Candidate | null> => {
  return prisma.candidate.findUnique({ where: { id } });
};
```

INCORRECT:
```ts
export async function getCandidate(id: any) {
  return prisma.candidate.findUnique({ where: { id } });
}
```

---

## RULE 2: REACT COMPONENTS

- ONLY functional components. NEVER class components.
- ONE component per file. Filename MUST match component name in PascalCase.
- ALWAYS use named exports. NEVER use default exports.
- Define props with `interface {Component}Props`.
- Destructure props in the function parameter.
- Maximum 150 lines per component. If longer, extract sub-components.
- Custom hooks go in a `use{Feature}.ts` file adjacent to the component.

CORRECT:
```tsx
// CandidateCard.tsx
interface CandidateCardProps {
  candidate: Candidate;
  onAssign: (id: string) => void;
}

export const CandidateCard = ({ candidate, onAssign }: CandidateCardProps) => {
  return (
    <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-4">
      {/* content */}
    </div>
  );
};
```

INCORRECT:
```tsx
// Bad: default export, no typed props, class component
export default class CandidateCard extends React.Component { ... }
```

---

## RULE 3: TAILWIND CSS — NO EXCEPTIONS

- ONLY use Tailwind utility classes for styling.
- NEVER use: CSS modules, styled-components, emotion, CSS-in-JS, or inline `style={}` (exception: dynamically computed values like progress bar widths).
- Class order: layout → sizing → spacing → typography → colours → effects.
- For conditional classes, use `clsx` or a `cn` helper.
- For repeated class combinations, extract to a `const`.
- Extend `tailwind.config.js` for project tokens (reference `docs/ui-spec.md` Design Tokens section).

CORRECT:
```tsx
<button className="flex items-center justify-center w-full h-12 px-4 text-sm font-semibold text-white bg-blue-800 hover:bg-blue-700 rounded-lg">
  Generate Recommendations
</button>
```

INCORRECT:
```tsx
<button style={{ backgroundColor: '#1e40af', color: 'white', borderRadius: '8px' }}>
  Generate Recommendations
</button>
```

CONDITIONAL CLASSES PATTERN:
```tsx
import { clsx } from 'clsx';

const scoreColor = clsx({
  'text-green-600': score >= 80,
  'text-amber-600': score >= 60 && score < 80,
  'text-red-600': score < 60,
});
```

---

## RULE 4: EXPRESS API HANDLERS

- ALL route handlers MUST be `async`.
- ALWAYS use typed Request/Response generics from Express.
- ALWAYS validate request bodies with Zod schemas.
- Success response shape: `{ data: T }`
- Error response shape: `{ error: { code: string, message: string } }`
- One router file per resource (e.g. `recommendations.ts`, `squads.ts`).
- Middleware in `src/middleware/`. Routes in `src/routes/`.

CORRECT:
```ts
import { Router, Request, Response } from 'express';
import { z } from 'zod';

const RecommendationRequestSchema = z.object({
  intent: z.string().min(1),
  priority: z.enum(['urgent-regulatory', 'high', 'medium', 'low']),
  projectCode: z.string().regex(/^[A-Z]{3}-\d{4}-\d{3}$/),
  competencies: z.array(z.string()).min(1),
  weights: z.object({
    skills: z.number(),
    domain: z.number(),
    tenure: z.number(),
  }),
});

const router = Router();

router.post('/', async (req: Request, res: Response) => {
  const parsed = RecommendationRequestSchema.safeParse(req.body);
  if (!parsed.success) {
    return res.status(400).json({
      error: { code: 'INVALID_REQUEST', message: parsed.error.message },
    });
  }
  const candidates = await scoreCandidates(parsed.data);
  return res.json({ data: candidates });
});

export { router as recommendationsRouter };
```

---

## RULE 5: PRISMA & DATABASE

- Database engine is SQLite. NEVER assume PostgreSQL.
- Schema location: `packages/backend/prisma/schema.prisma`
- ALWAYS use Prisma Client for data access. NEVER use raw SQL unless explicitly justified.
- Model names: PascalCase singular (`Candidate`, `Squad`, `Competency`).
- Primary keys: `@id @default(uuid())`
- ALWAYS include `createdAt DateTime @default(now())` and `updatedAt DateTime @updatedAt`.

CORRECT:
```prisma
model Candidate {
  id           String   @id @default(uuid())
  name         String
  role         String
  avatarUrl    String?
  availability String
  createdAt    DateTime @default(now())
  updatedAt    DateTime @updatedAt
}
```

---

## RULE 6: SCORING LOGIC

- ALL suitability scoring MUST be rules-based weighted arithmetic.
- NEVER import or use AI/ML libraries (tensorflow, brain.js, ml5, etc.).
- Formula: `suitability = (skills/maxSkills × wSkills) + (domain/maxDomain × wDomain) + (tenure/maxTenure × wTenure)`
- Default weights: Skills=50, Domain=30, Tenure=20.
- Scoring functions MUST be pure (no side effects) and independently unit-testable.

CORRECT:
```ts
interface CandidateScores {
  skills: { value: number; max: number };
  domain: { value: number; max: number };
  tenure: { value: number; max: number };
}

interface Weights {
  skills: number;
  domain: number;
  tenure: number;
}

export const calculateSuitability = (scores: CandidateScores, weights: Weights): number => {
  const total =
    (scores.skills.value / scores.skills.max) * weights.skills +
    (scores.domain.value / scores.domain.max) * weights.domain +
    (scores.tenure.value / scores.tenure.max) * weights.tenure;
  return Math.round(total);
};
```

---

## RULE 7: TESTING

- Unit tests: Vitest ONLY. NEVER use Jest syntax (`jest.fn()`, `jest.mock()`).
- Use `describe`, `it`, `expect` from Vitest.
- E2E tests: Playwright ONLY.
- Test file naming: `{source-file}.test.ts` or `{source-file}.spec.ts`.
- Run command: `npm run test` (uses `--run` flag, NOT watch mode).
- Unit tests: co-locate with source OR in `tests/` directory.
- E2E tests: in `packages/frontend/e2e/`.
- Mock Prisma Client for service-level tests. Test pure functions directly without mocks.

CORRECT:
```ts
import { describe, it, expect } from 'vitest';
import { calculateSuitability } from './scoring-service';

describe('calculateSuitability', () => {
  it('returns weighted sum as integer percentage', () => {
    const scores = {
      skills: { value: 48, max: 50 },
      domain: { value: 28, max: 30 },
      tenure: { value: 18, max: 20 },
    };
    const weights = { skills: 50, domain: 30, tenure: 20 };
    expect(calculateSuitability(scores, weights)).toBe(94);
  });

  it('returns 0 when all scores are zero', () => {
    const scores = {
      skills: { value: 0, max: 50 },
      domain: { value: 0, max: 30 },
      tenure: { value: 0, max: 20 },
    };
    const weights = { skills: 50, domain: 30, tenure: 20 };
    expect(calculateSuitability(scores, weights)).toBe(0);
  });
});
```

---

## RULE 8: FILE & FOLDER NAMING

| Type             | Convention    | Example                     |
|------------------|---------------|-----------------------------|
| Components       | PascalCase    | `CandidateCard.tsx`         |
| Hooks            | camelCase     | `useRecommendations.ts`     |
| Utils/services   | kebab-case    | `scoring-service.ts`        |
| Route handlers   | kebab-case    | `recommendations.ts`        |
| Test files       | match source  | `CandidateCard.test.tsx`    |
| Prisma models    | PascalCase    | `Candidate`, `Squad`        |
| Directories      | kebab-case    | `candidate-cards/`          |

---

## RULE 9: IMPORTS — STRICT ORDER

Group imports with a blank line between each group, in this exact order:

1. Node built-ins and external libraries
2. Internal absolute imports (aliases like `@/`)
3. Relative imports (parent → sibling → child)
4. Type-only imports (using `import type`)

CORRECT:
```ts
import { Router } from 'express';
import { z } from 'zod';

import { prisma } from '@/lib/prisma';
import { calculateSuitability } from '@/services/scoring-service';

import { RecommendationCard } from './RecommendationCard';

import type { Candidate } from '@/types';
```

---

## RULE 10: STATE MANAGEMENT

- Use React built-in primitives: `useState`, `useReducer`, `useContext`.
- Lift state to the nearest common ancestor. Do NOT prop-drill beyond 2 levels.
- For cross-component shared state (e.g. squad composition), use React Context + `useReducer`.
- NEVER add external state libraries (Redux, Zustand, MobX, Jotai) unless explicitly approved.

---

## RULE 11: ERROR HANDLING

- NEVER swallow errors. `catch (e) {}` with no handling is FORBIDDEN.
- Backend: let errors propagate to the global error handler middleware.
- Frontend: use React Error Boundaries for component trees. Use toast notifications for user-facing errors.
- ALWAYS log with context: `[functionName] description: error`.

CORRECT:
```ts
try {
  await assignToSquad(candidateId);
} catch (error) {
  console.error('[assignToSquad] Failed to assign candidate:', error);
  throw error;
}
```

FORBIDDEN:
```ts
try { await assignToSquad(candidateId); } catch (e) {}
```

---

## RULE 12: ACCESSIBILITY

- ALL interactive elements MUST be keyboard navigable.
- Use semantic HTML: `<button>`, `<nav>`, `<main>`, `<section>`, `<header>`, `<footer>`.
- Icon-only buttons MUST have `aria-label`.
- Visual indicators (scores, badges) MUST include text — colour alone is NOT sufficient.
- Apply `aria-live="polite"` for dynamic updates (e.g. "Assigned to squad" confirmation).
- Reference `docs/ui-spec.md` Accessibility section for component-specific requirements.

---

## RULE 13: GIT COMMITS

- Format: `type: short description` (lowercase, no period)
- Types: `feat`, `fix`, `chore`, `docs`, `test`, `refactor`
- One logical change per commit.
- Branch naming: `feat/short-description` or `fix/short-description`
- Always branch from `main`. Squash merge back.

---

## PRE-COMMIT VALIDATION CHECKLIST

Before generating or committing code, verify ALL of the following:

- [ ] No `any` types without explicit justification comment
- [ ] No inline `style={}` attributes (except dynamic computed values)
- [ ] No class components
- [ ] No raw SQL — Prisma Client only
- [ ] No AI/ML library imports
- [ ] No CSS-in-JS or CSS modules
- [ ] No default exports
- [ ] All async functions have error handling
- [ ] All request bodies validated with Zod
- [ ] All exports have explicit return types
- [ ] Tests pass: `npm run test`
- [ ] No `var` declarations
- [ ] Imports follow the 4-group ordering rule
