# Architecture & System Design

<!-- Architect owns this document -->

## Overview

[High-level system description and architecture style]

## System Diagram

```
┌─────────┐     ┌─────────┐     ┌──────────┐
│  Client │────▶│  Server │────▶│ Database │
│ (React) │     │(Express)│     │(Postgres)│
└─────────┘     └─────────┘     └──────────┘
```

## Data Model

### Entity: [Name]

| Field      | Type     | Constraints       |
|------------|----------|-------------------|
| id         | UUID     | PK, auto-gen      |
| name       | string   | NOT NULL, max 255  |
| created_at | datetime | NOT NULL, default now |

### Relationships

- [Entity A] 1──▶ N [Entity B]

## Key Design Decisions

| Decision              | Choice       | Rationale                    |
|-----------------------|--------------|------------------------------|
| API style             | REST         | Team familiarity, tooling    |
| Database              | PostgreSQL   | Relational data, ACID needed |
| Auth                  | JWT          | Stateless, scalable          |

## Infrastructure

- **Hosting:** [Cloud provider / platform]
- **CI/CD:** [Pipeline description]
- **Monitoring:** [Observability stack]
