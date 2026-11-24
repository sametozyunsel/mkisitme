import express from "express";
import bundledApp from "./dist/vercel-handler.js";

// Vercel imports this root entry as an Express Function. All project-local
// TypeScript imports are bundled by build:vercel, avoiding Node ESM extension
// resolution failures at runtime.
const app = express();
app.use(bundledApp);

export default app;
