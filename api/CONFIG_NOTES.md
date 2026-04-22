# API Config Notes

This file documents JSON files that cannot safely include inline comments.

## package.json
- Declares backend dependencies (`express`, `mongoose`, `cors`, `dotenv`) and dev dependency (`nodemon`).
- `main` points to `src/server.js`, which is the startup entrypoint.
- Scripts:
  - `npm run dev`: starts API with automatic restart on file changes.
  - `npm start`: runs API without watcher for production-like execution.

## package-lock.json
- Auto-generated lockfile that pins exact package versions for reproducible installs.
- Should be committed so every developer and CI environment installs the same dependency graph.
- This file is generated and maintained by npm; avoid manual editing.
