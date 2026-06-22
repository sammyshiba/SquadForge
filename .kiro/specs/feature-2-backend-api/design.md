# DESIGN — Feature 2: Backend API

## Purpose

Provide a lightweight Express API server with health, info, and echo endpoints as a foundation for the SquadForge features.

---

## Endpoints

### GET /health

**Response 200:**
```json
{
  "data": {
    "status": "ok",
    "timestamp": "2024-01-15T10:30:00.000Z"
  }
}
```

### GET /api/health

**Response 200:**
```json
{
  "data": {
    "status": "ok",
    "timestamp": "2024-01-15T10:30:00.000Z",
    "uptime": 12345.67
  }
}
```

### GET /api/info

**Response 200:**
```json
{
  "data": {
    "name": "squadforge-api",
    "version": "1.0.0",
    "environment": "development"
  }
}
```

### POST /api/echo

**Request:**
```json
{ "message": "hello" }
```

**Response 200:**
```json
{
  "data": {
    "echo": { "message": "hello" },
    "timestamp": "2024-01-15T10:30:00.000Z"
  }
}
```

---

## Error Response Shape (All Endpoints)

```json
{
  "error": {
    "code": "INTERNAL_ERROR",
    "message": "Something went wrong"
  }
}
```

---

## Middleware Stack

1. `cors()` — enable cross-origin requests
2. `express.json()` — parse JSON bodies
3. Route handlers
4. Global error handler — catches uncaught errors, returns structured response

---

## Port Configuration

- Default: `3001`
- Override via `process.env.PORT`
- Read from `.env` file using `dotenv` (optional)

---

## File Structure

```
packages/backend/src/
├── index.ts              # App entry point, listen on PORT
├── app.ts                # Express app setup, middleware, route mounting
├── routes/
│   ├── health.ts         # GET /health, GET /api/health
│   ├── info.ts           # GET /api/info
│   └── echo.ts           # POST /api/echo
└── middleware/
    └── error-handler.ts  # Global error handler
```

---

## Tech Alignment

- Express with typed route handlers
- No Zod needed for echo (passthrough) — but MUST NOT crash on invalid JSON
- Structured `{ data }` / `{ error }` envelope on all responses
- TypeScript strict mode
