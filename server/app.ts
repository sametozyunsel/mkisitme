import express, {
  type ErrorRequestHandler,
  type Express,
  type Request,
  type RequestHandler,
  type Response,
} from "express";
import fs from "node:fs";
import path from "node:path";
import { createExpressMiddleware } from "@trpc/server/adapters/express";
import { registerOAuthRoutes } from "./_core/oauth";
import { publicPlatformScript } from "./_core/publicConfig";
import { appRouter } from "./routers";
import { createContext } from "./_core/context";
import { registerAdminRoutes } from "./adminRoutes";
import { getBlogPostBySlug, listBlogPosts } from "./blog";

export interface ApplicationOptions {
  /** Serve the built client after registering the API routes. */
  serveClient?: boolean;
  /** Directory containing the built index.html and assets. */
  staticDir?: string;
}

function asyncRoute(
  handler: (req: Request, res: Response) => Promise<unknown>,
): RequestHandler {
  return (req, res, next) => {
    void Promise.resolve(handler(req, res)).catch(next);
  };
}

export function registerApplicationRoutes(
  app: Express,
  options: ApplicationOptions = {},
): Express {
  app.disable("x-powered-by");
  app.use(express.json({ limit: "50mb" }));
  app.use(express.urlencoded({ limit: "50mb", extended: true }));

  app.get("/api/health", (_req, res) => res.json({ status: "ok" }));
  app.get("/api/platform/config.js", (_req, res) =>
    res
      .set("Cache-Control", "no-store")
      .type("application/javascript")
      .send(publicPlatformScript()),
  );
  registerOAuthRoutes(app);
  registerAdminRoutes(app);

  app.get(
    "/api/blog",
    asyncRoute(async (_req, res) => res.json(await listBlogPosts(false))),
  );
  app.get(
    "/api/blog/:slug",
    asyncRoute(async (req, res) => {
      const post = await getBlogPostBySlug(req.params.slug);
      if (!post) return res.status(404).json({ message: "Yazı bulunamadı." });
      return res.json(post);
    }),
  );
  app.use("/api/trpc", createExpressMiddleware({ router: appRouter, createContext }));

  if (options.serveClient) {
    const staticDir = options.staticDir ?? path.resolve(process.cwd(), "dist/public");
    const indexFile = path.join(staticDir, "index.html");

    if (!fs.existsSync(indexFile)) {
      console.error(`[Static] Frontend entry file is missing: ${indexFile}`);
    }

    app.use(express.static(staticDir, { fallthrough: true }));
    app.get("*", (_req, res, next) => {
      if (!fs.existsSync(indexFile)) {
        return res
          .status(503)
          .type("text/plain")
          .send("Frontend build is missing. Check the Vercel build output.");
      }
      return res.sendFile(indexFile, (error) => {
        if (error) next(error);
      });
    });
  }

  const errorHandler: ErrorRequestHandler = (error, _req, res, next) => {
    console.error("[Express] Request failed:", error);
    if (res.headersSent) return next(error);
    return res.status(500).json({ message: "Internal server error" });
  };
  app.use(errorHandler);

  return app;
}
