---
inclusion: manual
---

# New API Endpoint Checklist

Follow this checklist when creating a new Express route handler.

## File Setup

- Create file in `packages/backend/src/routes/` using kebab-case naming
- One router file per resource

## Implementation Steps

1. **Define Zod schema** for request body validation
2. **Create async route handler** with typed `Request` and `Response`
3. **Validate input** using `safeParse` — return 400 on failure
4. **Implement business logic** (delegate to services layer)
5. **Return response** using standard shapes:
   - Success: `{ data: T }`
   - Error: `{ error: { code: string, message: string } }`
6. **Register router** in the main server entry point (`src/index.ts`)

## Template

```ts
import { Router, Request, Response } from 'express';
import { z } from 'zod';

const MyRequestSchema = z.object({
  // define fields
});

const router = Router();

router.post('/', async (req: Request, res: Response): Promise<void> => {
  const parsed = MyRequestSchema.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({
      error: { code: 'VALIDATION_FAILED', message: parsed.error.message },
    });
    return;
  }

  // Business logic here
  const result = await someService(parsed.data);
  res.json({ data: result });
});

export { router as myRouter };
```

## Rules

- All handlers MUST be async
- All request bodies validated with Zod
- Named exports only (no default exports)
- Explicit return types on exported functions
- Let errors propagate to global error handler middleware
