import "dotenv/config";
import express from "express";
import path from "node:path";
import { registerApplicationRoutes } from "./server/app";

const app = express();
registerApplicationRoutes(app, {
  serveClient: true,
  // Vercel serves files from the project-level public directory through its CDN.
  staticDir: path.resolve(process.cwd(), "public"),
});

export default app;
