import type { FastifyPluginAsync } from "fastify";
import type { FastifyRequest, FastifyReply } from "fastify";
import fastifyJwt from "@fastify/jwt";
import { dbClient } from "./db/index.js";
import { hashPassword, verifyPassword } from "./auth.js";

// ── Types ────────────────────────────────────────────────────────

interface AuthUser {
  id: string;
  email: string;
  role: "super_user" | "admin" | "user";
}

interface JwtPayload {
  sub: string;
  email: string;
  role: "super_user" | "admin" | "user";
}

declare module "@fastify/jwt" {
  interface FastifyJWT {
    payload: JwtPayload;
    user: AuthUser;
  }
}

// ── Auth middleware ─────────────────────────────────────────────

async function authMiddleware(request: FastifyRequest, reply: FastifyReply) {
  try {
    await request.jwtVerify();
    const payload = request.user as unknown as JwtPayload;
    const user = await dbClient.getUserById(payload.sub);
    if (!user || !user.isActive) {
      return reply.status(401).send({ error: "User not found or inactive" });
    }
    request.user = { id: user.id, email: user.email, role: user.role };
  } catch (err: any) {
    if (err?.code === "FAST_JWT_EXPIRED") {
      return reply.status(401).send({ error: "Token expired" });
    }
    return reply.status(401).send({ error: "Invalid token" });
  }
}

function requireRole(...roles: string[]) {
  return async (request: FastifyRequest, reply: FastifyReply) => {
    if (!request.user || !roles.includes(request.user.role)) {
      return reply.status(403).send({ error: "Forbidden" });
    }
  };
}

// ── Routes ──────────────────────────────────────────────────────
export const routes: FastifyPluginAsync = async (fastify) => {
  // Register JWT plugin
  fastify.register(fastifyJwt, {
    secret: process.env.JWT_SECRET || "dev-secret-change-me-in-production",
    sign: { expiresIn: "7d" },
  });

  // ================================================================
  //  AUTH
  // ================================================================

  // -- Register --
  fastify.post(
    "/api/auth/register",
    {
      schema: {
        body: {
          type: "object",
          required: ["email", "password"],
          properties: {
            email: { type: "string", format: "email" },
            password: { type: "string", minLength: 8 },
          },
        },
      },
    },
    async (request, reply) => {
      const { email, password } = request.body as {
        email: string;
        password: string;
      };
      const normalized = email.toLowerCase().trim();

      const existing = await dbClient.getUserByEmail(normalized);
      if (existing) {
        return reply.status(409).send({ error: "Email already registered" });
      }

      const passwordHash = await hashPassword(password);
      const user = await dbClient.createUser({
        email: normalized,
        passwordHash,
        role: "user",
      });

      const token = fastify.jwt.sign({
        sub: user.id,
        email: user.email,
        role: user.role,
      });
      return reply.status(201).send({
        user: { id: user.id, email: user.email, role: user.role },
        token,
      });
    },
  );

  // -- Login --
  fastify.post(
    "/api/auth/login",
    {
      schema: {
        body: {
          type: "object",
          required: ["email", "password"],
          properties: {
            email: { type: "string", format: "email" },
            password: { type: "string" },
          },
        },
      },
    },
    async (request, reply) => {
      const { email, password } = request.body as {
        email: string;
        password: string;
      };
      const user = await dbClient.getUserByEmail(email.toLowerCase().trim());
      if (!user || !user.isActive) {
        return reply.status(401).send({ error: "Invalid credentials" });
      }

      const valid = await verifyPassword(password, user.passwordHash);
      if (!valid) {
        return reply.status(401).send({ error: "Invalid credentials" });
      }

      const token = fastify.jwt.sign({
        sub: user.id,
        email: user.email,
        role: user.role,
      });
      return {
        user: { id: user.id, email: user.email, role: user.role },
        token,
      };
    },
  );

  // -- Get current user from token --
  fastify.get(
    "/api/auth/me",
    { preHandler: [authMiddleware] },
    async (request, reply) => {
      return {
        id: request.user!.id,
        email: request.user!.email,
        role: request.user!.role,
      };
    },
  );

  // -- Refresh token --
  fastify.post(
    "/api/auth/refresh",
    {
      schema: {
        body: {
          type: "object",
          required: ["token"],
          properties: {
            token: { type: "string" },
          },
        },
      },
    },
    async (request, reply) => {
      const { token } = request.body as { token: string };
      try {
        const payload = fastify.jwt.verify<{ sub: string; email: string; role: AuthUser["role"] }>(token);
        const user = await dbClient.getUserById(payload.sub);
        if (!user || !user.isActive) {
          return reply.status(401).send({ error: "User not found or inactive" });
        }
        // Issue a fresh token
        const newToken = fastify.jwt.sign({
          sub: user.id,
          email: user.email,
          role: user.role,
        });
        return { token: newToken };
      } catch {
        return reply.status(401).send({ error: "Invalid or expired token" });
      }
    },
  );

  // ================================================================
  //  NOTES (protected)
  // ================================================================

  // -- List notes --
  fastify.get(
    "/api/notes",
    { preHandler: [authMiddleware] },
    async (request, reply) => {
      const notesList = await dbClient.getNotes(request.user!.id);
      return notesList;
    },
  );

  // -- Get single note --
  fastify.get(
    "/api/notes/:id",
    {
      preHandler: [authMiddleware],
      schema: {
        params: {
          type: "object",
          required: ["id"],
          properties: { id: { type: "integer" } },
        },
      },
    },
    async (request, reply) => {
      const { id } = request.params as { id: string };
      const note = await dbClient.getNote(Number(id), request.user!.id);
      if (!note) return reply.status(404).send({ error: "Note not found" });
      return note;
    },
  );

  // -- Create note (with limit checks) --
  fastify.post(
    "/api/notes",
    {
      preHandler: [authMiddleware],
      schema: {
        body: {
          type: "object",
          properties: {
            noteTitle: { type: "string", maxLength: 255 },
            noteContent: { type: "string", default: "" },
            color: { type: "string" },
            isArticle: { type: "boolean" },
          },
        },
      },
    },
    async (request, reply) => {
      const userId = request.user!.id;
      const user = await dbClient.getUserById(userId);
      if (!user) return reply.status(401).send({ error: "User not found" });

      const body = request.body as {
        noteTitle: string;
        noteContent?: string;
        color?: string;
        isArticle?: boolean;
      };

      // Limit checks (super_user and admin bypass limits)
      if (user.role === "user") {
        const noteCount = await dbClient.getUserNoteCount(userId);
        if (noteCount >= user.maxNotes) {
          return reply.status(403).send({
            error: `Note limit reached (${user.maxNotes} max). Upgrade your account for more.`,
          });
        }
      }

      const note = await dbClient.createNote({
        creator: userId,
        noteTitle: body.noteTitle ?? "Untitled",
        noteContent: body.noteContent ?? "",
        color: body.color ?? "#ffffff",
        isArticle: body.isArticle ?? false,
      });

      return reply.status(201).send(note);
    },
  );

  // -- Update note --
  fastify.patch(
    "/api/notes/:id",
    {
      preHandler: [authMiddleware],
      schema: {
        params: {
          type: "object",
          required: ["id"],
          properties: { id: { type: "integer" } },
        },
      },
    },
    async (request, reply) => {
      const { id } = request.params as { id: string };
      const userId = request.user!.id;
      const user = await dbClient.getUserById(userId);
      if (!user) return reply.status(401).send({ error: "User not found" });

      const body = request.body as Record<string, unknown>;

      // Storage check for normal users
      if (user.role === "user" && typeof body.noteContent === "string") {
        const currentUsed = await dbClient.getUserStorageUsed(userId);
        const existingNote = await dbClient.getNote(Number(id), userId);
        const existingLength = existingNote?.noteContent?.length ?? 0;
        const delta = body.noteContent.length - existingLength;
        if (delta > 0 && currentUsed + delta > user.maxStorageBytes) {
          return reply.status(403).send({
            error: `Storage limit reached (${(
              user.maxStorageBytes /
              1024 /
              1024
            ).toFixed(1)} MB).`,
          });
        }
      }

      const updated = await dbClient.updateNote(Number(id), userId, body);
      if (!updated) return reply.status(404).send({ error: "Note not found" });
      return updated;
    },
  );

  // -- Delete note (soft delete) --
  fastify.delete(
    "/api/notes/:id",
    {
      preHandler: [authMiddleware],
      schema: {
        params: {
          type: "object",
          required: ["id"],
          properties: { id: { type: "integer" } },
        },
      },
    },
    async (request, reply) => {
      const { id } = request.params as { id: string };
      const deleted = await dbClient.deleteNote(Number(id), request.user!.id);
      if (!deleted) return reply.status(404).send({ error: "Note not found" });
      return reply.status(204).send();
    },
  );

  // ================================================================
  //  ADMIN / MONITORING (requires admin or super_user)
  // ================================================================

  // -- DB stats --
  fastify.get(
    "/api/admin/stats",
    {
      preHandler: [authMiddleware, requireRole("super_user", "admin")],
    },
    async (request, reply) => {
      const stats = await dbClient.getDbStats();
      return stats;
    },
  );

  // -- List all users (passwords stripped) --
  fastify.get(
    "/api/admin/users",
    {
      preHandler: [authMiddleware, requireRole("super_user", "admin")],
    },
    async (request, reply) => {
      const allUsers = await dbClient.getAllUsers();
      return allUsers;
    },
  );

  // -- Update user limits (super_user only) --
  fastify.patch(
    "/api/admin/users/:id",
    {
      preHandler: [authMiddleware, requireRole("super_user")],
      schema: {
        params: {
          type: "object",
          required: ["id"],
          properties: { id: { type: "string", format: "uuid" } },
        },
        body: {
          type: "object",
          properties: {
            maxNotes: { type: "integer", minimum: 0 },
            maxStorageBytes: { type: "integer", minimum: 0 },
            role: { type: "string", enum: ["user", "admin"] },
            isActive: { type: "boolean" },
          },
        },
      },
    },
    async (request, reply) => {
      const { id } = request.params as { id: string };
      const body = request.body as Record<string, unknown>;

      const updated = await dbClient.updateUser(id, body);
      if (!updated) return reply.status(404).send({ error: "User not found" });
      return updated;
    },
  );

  // -- Health / metrics --
  fastify.get("/health", async () => {
    const stats = await dbClient.getDbStats();
    return {
      status: "ok",
      uptime: process.uptime(),
      db: stats,
    };
  });
};