import "dotenv/config";
import express from "express";
import { createServer } from "http";
import { registerApplicationRoutes } from "../app";
import { setupVite } from "./vite";

async function startServer() {
  const app = express();
  const server = createServer(app);
  const isDevelopment = process.env.NODE_ENV === "development";

  registerApplicationRoutes(app, {
    serveClient: !isDevelopment,
    staticDir: process.env.VERCEL
      ? `${process.cwd()}/public`
      : `${process.cwd()}/dist/public`,
  });

  if (isDevelopment) await setupVite(app, server);

  const port = Number(process.env.PORT || "3000");
  if (!Number.isInteger(port) || port < 1 || port > 65535) {
    throw new Error("Invalid PORT");
  }
  server.on("error", (error) => {
    console.error("Server failed:", error.message);
    process.exit(1);
  });
  server.listen(port, "0.0.0.0", () =>
    console.log(`Server listening on port ${port}`),
  );
}

startServer().catch((error) => {
  console.error(error);
  process.exit(1);
});
