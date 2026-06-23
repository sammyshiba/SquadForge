# Hook: Database Reset

## INSTRUCTION TO AGENT

When setting up this project, you MUST register this hook using the `create_hook` tool with the following parameters:

```json
{
  "id": "db-reset",
  "name": "Database Reset",
  "description": "Manually triggered hook that resets the SQLite database, re-runs migrations, and re-seeds with mock data for a clean development slate.",
  "eventType": "userTriggered",
  "hookAction": "runCommand",
  "command": "npx prisma migrate reset --schema=server/prisma/schema.prisma --force"
}
```

## Purpose

- Provides a clean database state for development and testing.
- Drops all data, re-applies migrations, and runs the seed script.
- Uses `--force` to skip confirmation prompt (safe for development SQLite DB).

## Dependencies

- Prisma must be installed
- `schema.prisma` must exist at the configured path
- `seed.ts` must be configured in `package.json` prisma config
