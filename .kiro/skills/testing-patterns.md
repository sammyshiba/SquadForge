---
inclusion: manual
---

# Testing Patterns

## Unit Tests (Vitest)

- Use `describe`, `it`, `expect` from Vitest
- NEVER use Jest syntax (`jest.fn()`, `jest.mock()`)
- File naming: `{source-file}.test.ts` or `{source-file}.spec.ts`
- Run: `npm run test` (uses `--run` flag, not watch mode)

### Template

```ts
import { describe, it, expect } from 'vitest';
import { myFunction } from './my-module';

describe('myFunction', () => {
  it('does the expected thing', () => {
    const result = myFunction(input);
    expect(result).toBe(expected);
  });

  it('handles edge case', () => {
    expect(() => myFunction(badInput)).toThrow();
  });
});
```

### Mocking Prisma

```ts
import { vi } from 'vitest';
import { prisma } from '@/lib/prisma';

vi.mock('@/lib/prisma', () => ({
  prisma: {
    candidate: {
      findMany: vi.fn(),
      findUnique: vi.fn(),
    },
  },
}));
```

### Testing Pure Functions

Pure functions (like scoring) need no mocks — pass data in, assert output.

```ts
import { calculateSkillScore } from './scoring-service';

it('returns 0 when no skills match', () => {
  expect(calculateSkillScore(['GraphQL'], [{ name: 'React', level: 5 }])).toBe(0);
});
```

## E2E Tests (Playwright)

- Located in `packages/frontend/e2e/` or `tests/e2e/`
- File naming: `*.spec.ts`
- Run: `npx playwright test`

### Template

```ts
import { test, expect } from '@playwright/test';

test('full journey: create request and view shortlist', async ({ page }) => {
  await page.goto('/');
  // Interact with UI
  await page.getByRole('button', { name: 'Generate' }).click();
  // Assert results
  await expect(page.getByText('Candidates')).toBeVisible();
});
```

## Rules

- Test files co-located with source OR in `tests/` directory
- Mock external dependencies, test logic directly
- Cover happy path + at least one edge case per function
