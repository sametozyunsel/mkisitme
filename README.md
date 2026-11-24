# MK İşitme Cihazları

React / Express / tRPC / Drizzle starter, adapted from the Sandbox web-db-user template.

- `pnpm dev`: development server; honors `PORT` (default 3000).
- `pnpm build` / `pnpm start`: build and serve `dist/index.js` and `dist/public/`.
- `pnpm db:migrate`: apply checked-in migrations. `pnpm db:push`: generate and apply new schema changes.
- `pnpm check` / `pnpm test`: types and application tests.

Start with the Webdev skill's default-template guide. Platform login, storage, payments and service contracts live in its shared references; read the relevant capability before extending its helper.

`server/_core/publicConfig.ts` exposes only named public runtime values. Private keys stay server-side. The platform serves managed `/manus-storage/` assets; the application does not register a second proxy.

Platform configuration is readable and editable through `webdev.config`. Default settings are initial values, not enforced constraints. The agent may modify the files, commands and configuration or follow the flexible guide for another stack.

## Vercel deployment

Vercel serves the Express application from the root `index.ts` entry point. The `build:vercel` command bundles all project-local server imports into `dist/vercel-handler.js` before deployment; the root entry imports that generated JavaScript with an explicit `.js` extension. This avoids Node ESM runtime errors caused by extensionless TypeScript imports. The same build command copies the Vite output into root `public/` for Vercel's static asset CDN. Leave Vercel's Output Directory unset/default.

The public site and seeded blog can render without a database. To enable persistent blog administration, configure `DATABASE_URL`, `MK_ADMIN_USERNAME`, `MK_ADMIN_PASSWORD`, and `MANUS_JWT_SECRET` in the Vercel project's Environment Variables. Add Manus OAuth/API variables only if those platform integrations are used. Redeploy after changing environment variables.

The regular `pnpm build` and `pnpm start` commands remain available for Node.js hosting outside Vercel.
