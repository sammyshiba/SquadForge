---
inclusion: manual
---

# Prisma Migration Workflow

Follow these steps when making database schema changes.

## Steps

1. **Edit the schema** — Update `packages/backend/prisma/schema.prisma`
2. **Generate migration** — Run:
   ```bash
   npx prisma migrate dev --schema=packages/backend/prisma/schema.prisma --name describe-change
   ```
3. **Regenerate Prisma Client** — Run:
   ```bash
   npx prisma generate --schema=packages/backend/prisma/schema.prisma
   ```
4. **Update seed data** if new models were added — Edit `packages/backend/prisma/seed.ts`
5. **Verify** — Run the backend to confirm no runtime errors:
   ```bash
   npm run dev --workspace=packages/backend
   ```

## Schema Rules

- Model names: PascalCase singular (`Candidate`, `Squad`)
- Primary keys: `@id @default(uuid())`
- Always include `createdAt DateTime @default(now())` and `updatedAt DateTime @updatedAt`
- Engine is SQLite — do not use PostgreSQL-specific features
- Use Prisma Client for all data access — no raw SQL unless explicitly justified
