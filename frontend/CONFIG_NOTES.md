# Frontend Config Notes

This file documents JSON files that cannot safely include inline comments.

## angular.json
- `serve.development.proxyConfig` is set to `proxy.conf.json`.
  - Effect: calls to `/api/*` from Angular dev server are forwarded to backend target.
- `build.production.fileReplacements` swaps:
  - `src/environments/environment.ts` -> `src/environments/environment.prod.ts`
  - Effect: production build uses production API base URL values.

## proxy.conf.json
- Defines Angular dev-server proxy behavior.
- `/api` requests are forwarded to `http://localhost:5000`.
- Avoids browser CORS issues in local development while keeping frontend code pointed at `/api`.

## package-lock.json
- Auto-generated lockfile for deterministic installs.
- Commit this file and do not hand-edit it.
