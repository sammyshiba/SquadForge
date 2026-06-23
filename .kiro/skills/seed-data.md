---
inclusion: manual
---

# Seed Data Guide

Mock data lives in `packages/backend/prisma/seed.ts`.

## When to Update

- New Prisma model added
- Need more diverse test scenarios
- Changing scoring logic and need edge-case employees

## Structure

Each employee should have:
- Unique ID (uuid)
- Name, role, avatar URL (optional)
- Skills array with proficiency levels (1–5)
- Availability as allocation percentage (0–100)

## Template

```ts
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main(): Promise<void> {
  await prisma.candidate.createMany({
    data: [
      {
        id: 'uuid-here',
        name: 'Jane Smith',
        role: 'Senior Engineer',
        availability: 'Available',
        // allocation percentage for scoring
      },
    ],
  });

  // Seed skills, competencies, etc.
}

main()
  .then(() => prisma.$disconnect())
  .catch(async (e) => {
    console.error('[seed] Failed:', e);
    await prisma.$disconnect();
    process.exit(1);
  });
```

## Running the Seed

```bash
npx prisma db seed --schema=packages/backend/prisma/schema.prisma
```

## Tips

- Include candidates with varying availability (0%, 30%, 70%, 100%) for scoring tests
- Include candidates with partial skill matches
- Include at least one candidate per role type in the system
- Keep seed data deterministic — no `Math.random()`
