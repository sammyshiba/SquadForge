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
- One router file per resource (e.g. `demand.ts`, `squads.ts`, `candidates.ts`).
- Middleware in `src/middleware/`. Routes in `src/routes/`.

CORRECT:
```ts
import { Router, Request, Response } from 'express';
import { z } from 'zod';

const DemandRequestSchema = z.object({
  squadIntent: z.string().min(1),
  projectCode: z.string().regex(/^[A-Z]{3}-\d{4}-\d{3}$/),
  priorityLevel: z.enum(['High', 'Medium', 'Low']),
  requiredRole: z.string().min(1),
  requiredSkills: z.array(z.string()).min(1),
  expectedDurationWeeks: z.number().positive(),
  businessDomain: z.string().min(1),
});

const router = Router();

router.post('/', async (req: Request, res: Response) => {
  const parsed = DemandRequestSchema.safeParse(req.body);
  if (!parsed.success) {
    return res.status(400).json({
      error: { code: 'VALIDATION_FAILED', message: parsed.error.message },
    });
  }
  const candidates = await rankCandidates(parsed.data);
  return res.json({ data: { demandId: 'D001', candidates } });
});

export { router as demandRouter };
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
- Formula: `S_Total = (0.50 × S_Skill) + (0.30 × S_Avail) + (0.20 × S_Role)`
- Factors: Skill Match (50%), Availability (30%), Role Alignment (20%).
- Individual scores range 0–100. Total is the weighted sum rounded to 2 decimal places.
- Scoring functions MUST be pure (no side effects) and independently unit-testable.

CORRECT:
```ts
export const calculateSkillScore = (
  requiredSkills: string[],
  candidateSkills: { name: string; level: number }[],
): number => {
  if (requiredSkills.length === 0) return 0;
  const scores = requiredSkills.map((skill) => {
    const found = candidateSkills.find((s) => s.name === skill);
    if (!found) return 0;
    return found.level >= 4 ? 100 : 80;
  });
  return scores.reduce((a, b) => a + b, 0) / scores.length;
};

export const calculateAvailabilityScore = (allocationPercentage: number): number => {
  if (allocationPercentage === 0) return 100;
  if (allocationPercentage <= 50) return 70;
  return 20;
};

export const calculateRoleScore = (requestedRole: string, candidateRole: string): number => {
  return requestedRole === candidateRole ? 100 : 0;
};

export const calculateTotalScore = (sSkill: number, sAvail: number, sRole: number): number => {
  return Math.round(((0.5 * sSkill) + (0.3 * sAvail) + (0.2 * sRole)) * 100) / 100;
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
import { calculateSkillScore, calculateTotalScore } from './scoring-service';

describe('calculateSkillScore', () => {
  it('returns 100 for exact skill with level >= 4', () => {
    const result = calculateSkillScore(['React'], [{ name: 'React', level: 5 }]);
    expect(result).toBe(100);
  });

  it('returns 0 when skill is not found', () => {
    const result = calculateSkillScore(['GraphQL'], [{ name: 'React', level: 5 }]);
    expect(result).toBe(0);
  });
});

describe('calculateTotalScore', () => {
  it('returns correct weighted sum', () => {
    // (0.50 × 93.33) + (0.30 × 70) + (0.20 × 100) = 87.67
    expect(calculateTotalScore(93.33, 70, 100)).toBe(87.67);
  });
});
```

---

## RULE 8: FILE & FOLDER NAMING

| Type             | Convention    | Example                     |
|------------------|---------------|-----------------------------|
| Components       | PascalCase    | `CandidateCard.tsx`         |
| Hooks            | camelCase     | `useDemandForm.ts`          |
| Utils/services   | kebab-case    | `scoring-service.ts`        |
| Route handlers   | kebab-case    | `demand.ts`, `squads.ts`    |
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
