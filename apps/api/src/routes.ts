import type { FastifyPluginAsyncZod } from "fastify-type-provider-zod";
import { dbClient } from "./db/index.js";
import {
  hashPassword,
  verifyPassword,
  signToken,
  verifyToken,
  type JwtPayload,
} from "./auth.js";
import { eq, and } from "drizzle-orm";

// ── Auth middleware ─────────────────────────────────────────────
import type { FastifyRequest, FastifyReply } from "fastify";

interface AuthUser {
  id: string;
  email: string;
  role: "super_user" | "admin" | "user";
}

// Extend FastifyRequest to carry user
declare module "fastify" {
  interface FastifyRequest {
    user?: AuthUser;
  }
}

async function authMiddleware(request: FastifyRequest, reply: FastifyReply) {
  const header = request.headers.authorization;
  if (!header?.startsWith("Bearer ")) {
    return reply.status(401).send({ error: "Missing or invalid token" });
  }
  try {
    const payload = verifyToken(header.slice(7));
    const user = await dbClient.getUserById(payload.sub);
    if (!user || !user.isActive) {
      return reply.status(401).send({ error: "User not found or inactive" });
    }
    request.user = { id: user.id, email: user.email, role: user.role };
  } catch {
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
export const routes: FastifyPluginAsyncZod = async (fastify) => {
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

      const token = signToken({
        sub: user.id,
        email: user.email,
        role: user.role,
      });
      return reply.status(201).send({
        user: { id: user.id, email: user.email, role: user.role },
        token,
      });
    }
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

      const token = signToken({
        sub: user.id,
        email: user.email,
        role: user.role,
      });
      return {
        user: { id: user.id, email: user.email, role: user.role },
        token,
      };
    }
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
    }
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
    }
  );

  // -- Create note (with limit checks) --
  fastify.post(
    "/api/notes",
    {
      preHandler: [authMiddleware],
      schema: {
        body: {
          type: "object",
          required: ["noteTitle"],
          properties: {
            noteTitle: { type: "string", minLength: 1, maxLength: 255 },
            noteContent: { type: "string", default: "" },
            color: { type: "string", pattern: "^#[0-9a-fA-F]{6}$" },
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
        noteTitle: body.noteTitle,
        noteContent: body.noteContent ?? "",
        color: body.color ?? "#ffffff",
        isArticle: body.isArticle ?? false,
      });

      return reply.status(201).send(note);
    }
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
    }
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
    }
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
    }
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
    }
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
    }
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
