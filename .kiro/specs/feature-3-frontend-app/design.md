# DESIGN — Feature 3: Frontend Application

## Purpose

Provide a minimal React SPA that validates backend connectivity and demonstrates client-side state management.

---

## Page: Home (`/`)

### Layout

```
┌──────────────────────────────┐
│        SquadForge             │
├──────────────────────────────┤
│                              │
│   Backend Status: ✅ Online   │
│   (or ❌ Error / ⏳ Loading) │
│                              │
│   Counter: 0                 │
│   [Increment]                │
│                              │
└──────────────────────────────┘
```

### States

| State    | Condition                  | UI Display                          |
|----------|----------------------------|-------------------------------------|
| Loading  | Fetch in progress          | Spinner or "Checking backend..."    |
| Success  | `/api/health` returns 200  | Green "Online" with status details  |
| Error    | Fetch throws or non-200    | Red "Offline" with retry button     |

---

## Vite Proxy Configuration

```ts
// vite.config.ts
export default defineConfig({
  server: {
    proxy: {
      '/api': 'http://localhost:3001',
    },
  },
});
```

---

## Component Structure

```
packages/frontend/src/
├── App.tsx                # Root component
├── components/
│   ├── HealthStatus.tsx   # Backend status display
│   └── Counter.tsx        # Counter with increment button
├── hooks/
│   └── useHealthCheck.ts  # Fetch /api/health on mount
└── main.tsx               # Vite entry point
```

---

## useHealthCheck Hook

```ts
interface HealthState {
  status: 'loading' | 'online' | 'error';
  data: { status: string; timestamp: string; uptime: number } | null;
  error: string | null;
}
```

- Fetch on component mount (`useEffect` with empty deps)
- Set `status = 'loading'` initially
- On success: `status = 'online'`, populate data
- On error: `status = 'error'`, set error message

---

## Tech Alignment

- React 18+ functional components, named exports
- Tailwind CSS for all styling
- No external state library (useState only for counter)
- Vite proxy for API requests
