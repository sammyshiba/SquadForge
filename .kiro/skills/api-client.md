---
inclusion: manual
---

# API Client Pattern

Frontend API calls live in `packages/frontend/src/api/`.

## Base Client

Use a shared fetch wrapper (`client.ts`) that handles:
- Base URL configuration
- JSON headers
- Error response parsing
- Type-safe return values

## Adding a New API Call

1. Add function to appropriate file in `src/api/`
2. Type the request and response
3. Use the shared fetch wrapper
4. Handle errors at the call site or let them propagate to error boundary

## Template

```ts
import type { Candidate } from '@/types';

const BASE_URL = import.meta.env.VITE_API_URL ?? 'http://localhost:3001';

interface ApiResponse<T> {
  data: T;
}

interface ApiError {
  error: { code: string; message: string };
}

export const fetchCandidates = async (demandId: string): Promise<Candidate[]> => {
  const res = await fetch(`${BASE_URL}/api/workspace/${demandId}/candidates`);

  if (!res.ok) {
    const body: ApiError = await res.json();
    throw new Error(body.error.message);
  }

  const body: ApiResponse<Candidate[]> = await res.json();
  return body.data;
};
```

## Rules

- All functions must have explicit return types
- Named exports only
- Type both request params and response shape
- Never swallow errors — throw or propagate
- Use `import type` for type-only imports
