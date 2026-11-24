import "dotenv/config";
import express from "express";
import path from "node:path";
import { registerApplicationRoutes } from "./app";

const app = express();
registerApplicationRoutes(app, {
  serveClient: true,
  staticDir: path.resolve(process.cwd(), "public"),
});

export default app;
