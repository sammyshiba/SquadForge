# REQUIREMENTS — Feature 3: Frontend Application

## EARS Format

### REQ-3.1 (Event-driven)

> When the application loads, the client shall request `/api/health` and display the backend status.

### REQ-3.2 (Unwanted behaviour)

> If the health request fails, the client shall show an error state.

### REQ-3.3 (State-driven)

> While the request is pending, the client shall show a loading state.

### REQ-3.4 (Event-driven)

> When the user clicks **Increment**, the client shall increase the counter.

### REQ-3.5 (Ubiquitous)

> The client shall run on Vite and proxy `/api/*` requests.
