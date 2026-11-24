import crypto from "node:crypto";
import type { Express, Request, RequestHandler, Response } from "express";
import { createBlogPost, deleteBlogPost, listBlogPosts, updateBlogPost } from "./blog";

const COOKIE = "mk_admin_session";
const username = () => process.env.MK_ADMIN_USERNAME || "";
const password = () => process.env.MK_ADMIN_PASSWORD || "";
const secret = () => process.env.MANUS_JWT_SECRET || "";

type AsyncHandler = (req: Request, res: Response) => Promise<unknown>;
function asyncHandler(handler: AsyncHandler): RequestHandler {
  return (req, res, next) => {
    void Promise.resolve(handler(req, res)).catch(next);
  };
}

function readCookie(header: string | undefined, name: string) {
  return header?.split(";").map(part => part.trim()).find(part => part.startsWith(`${name}=`))?.slice(name.length + 1);
}

function writeCookie(name: string, value: string, maxAge: number) {
  return `${name}=${encodeURIComponent(value)}; Max-Age=${maxAge}; Path=/; HttpOnly; Secure; SameSite=None`;
}

function sessionToken(user: string) {
  return crypto.createHmac("sha256", secret()).update(`mk-admin:${user}`).digest("hex");
}
function isAdmin(req: Request) {
  if (!username() || !secret()) return false;
  const token = readCookie(req.headers.cookie, COOKIE);
  return Boolean(token && token === sessionToken(username()));
}
function cookieOptions() {
  return writeCookie(COOKIE, sessionToken(username()), 60 * 60 * 24 * 7);
}
function clearCookie() {
  return writeCookie(COOKIE, "", 0);
}
function slugify(value: string) {
  return value.toLocaleLowerCase("tr-TR").replace(/ı/g, "i").replace(/ğ/g, "g").replace(/ü/g, "u").replace(/ş/g, "s").replace(/ö/g, "o").replace(/ç/g, "c").replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
}

export function registerAdminRoutes(app: Express) {
  app.post("/api/admin/login", (req, res) => {
    const { user, pass } = req.body ?? {};
    if (!username() || !password() || !secret()) return res.status(503).json({ message: "Yönetim oturumu yapılandırılmamış." });
    if (user !== username() || pass !== password()) return res.status(401).json({ message: "Kullanıcı adı veya şifre hatalı." });
    res.setHeader("Set-Cookie", cookieOptions());
    res.json({ ok: true });
  });
  app.post("/api/admin/logout", (_req, res) => { res.setHeader("Set-Cookie", clearCookie()); res.json({ ok: true }); });
  app.get("/api/admin/session", (req, res) => res.json({ authenticated: isAdmin(req) }));
  app.get("/api/admin/blog", asyncHandler(async (req, res) => {
    if (!isAdmin(req)) return res.status(401).json({ message: "Yetkisiz." });
    return res.json(await listBlogPosts(true));
  }));
  app.post("/api/admin/blog", asyncHandler(async (req, res) => {
    if (!isAdmin(req)) return res.status(401).json({ message: "Yetkisiz." });
    const { title, excerpt, content, category, imageUrl, published } = req.body ?? {};
    if (!title || !excerpt || !content || !category) return res.status(400).json({ message: "Başlık, özet, içerik ve kategori zorunludur." });
    const slug = `${slugify(title)}-${Date.now().toString(36)}`;
    await createBlogPost({ title, slug, excerpt, content, category, imageUrl: imageUrl || null, published: published ? 1 : 0 });
    return res.status(201).json({ ok: true });
  }));
  app.put("/api/admin/blog/:id", asyncHandler(async (req, res) => {
    if (!isAdmin(req)) return res.status(401).json({ message: "Yetkisiz." });
    await updateBlogPost(Number(req.params.id), { ...req.body, published: req.body.published ? 1 : 0 });
    return res.json({ ok: true });
  }));
  app.delete("/api/admin/blog/:id", asyncHandler(async (req, res) => {
    if (!isAdmin(req)) return res.status(401).json({ message: "Yetkisiz." });
    await deleteBlogPost(Number(req.params.id));
    return res.json({ ok: true });
  }));
}
