# REQUIREMENTS — Feature 2: Backend API

## EARS Format

### REQ-2.1 (Event-driven)

> When a client sends `GET /health`, the server shall return HTTP 200 with status and timestamp.

### REQ-2.2 (Event-driven)

> When a client sends `GET /api/health`, the server shall return health status, timestamp, and uptime.

### REQ-2.3 (Event-driven)

> When a client sends `GET /api/info`, the server shall return API name, version, and environment.

### REQ-2.4 (Event-driven)

> When a client sends `POST /api/echo`, the server shall return the same payload with a timestamp.

### REQ-2.5 (Ubiquitous)

> The server shall support CORS and JSON request parsing.

### REQ-2.6 (Unwanted behaviour)

> If an error occurs, the server shall return structured error responses instead of crashing.

### REQ-2.7 (State-driven)

> While no `PORT` is set, the server shall run on port 3001.

### REQ-2.8 (Optional)

> Where a `PORT` is provided, the server shall use that port.
