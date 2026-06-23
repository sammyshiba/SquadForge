---
inclusion: manual
---

# Debug Guide

Common issues and solutions for this monorepo.

## Prisma Client Not Found

**Symptom:** `Cannot find module '@prisma/client'` or types missing

**Fix:**
```bash
npx prisma generate --schema=packages/backend/prisma/schema.prisma
```

## Workspace Linking Issues

**Symptom:** Module not found for `@squad-forge/shared` or cross-workspace imports

**Fix:**
```bash
# Re-install from root to relink workspaces
npm install
```

Check that `package.json` in the consuming workspace references the dependency:
```json
"dependencies": {
  "@squad-forge/shared": "*"
}
```

## Vite Proxy Not Working

**Symptom:** Frontend API calls return 404 or CORS errors in development

**Fix:** Check `packages/frontend/vite.config.ts` has proxy configured:
```ts
server: {
  proxy: {
    '/api': {
      target: 'http://localhost:3001',
      changeOrigin: true,
    },
  },
}
```

Ensure the backend is running on the expected port.

## SQLite Database Locked

**Symptom:** `SQLITE_BUSY` or database locked errors

**Fix:**
- Ensure only one process is writing to the database
- Stop any running Prisma Studio instances
- Delete the `.db` file and re-run migrations if corrupted:
  ```bash
  rm packages/backend/prisma/dev.db
  npx prisma migrate dev --schema=packages/backend/prisma/schema.prisma
  ```

## Tests Failing After Schema Change

**Symptom:** Tests reference old field names or models

**Fix:**
1. Regenerate Prisma Client
2. Update test fixtures/mocks to match new schema
3. Run tests: `npm run test`

## Port Already in Use

**Symptom:** `EADDRINUSE` when starting dev server

**Fix:**
```bash
# Find process on port 3001 (backend)
lsof -i :3001
kill -9 <PID>

# Or for frontend (port 5173)
lsof -i :5173
kill -9 <PID>
```

## TypeScript Errors After Dependency Update

**Symptom:** Type errors that weren't there before

**Fix:**
```bash
# Clean and rebuild
rm -rf node_modules packages/*/node_modules
npm install
npx tsc --noEmit
```
