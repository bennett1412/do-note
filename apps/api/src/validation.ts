import { z } from "zod";

// ── Auth ────────────────────────────────────────────────────────
export const registerSchema = z.object({
  email: z
    .string()
    .email()
    .max(255)
    .transform((e) => e.toLowerCase().trim()),
  password: z.string().min(8).max(128),
});

export const loginSchema = registerSchema;

// ── Notes ───────────────────────────────────────────────────────
export const createNoteSchema = z.object({
  noteTitle: z.string().min(1).max(255),
  noteContent: z.string().max(1_000_000).default(""), // 1 MB per note
  color: z
    .string()
    .regex(/^#[0-9a-fA-F]{6}$/)
    .default("#ffffff"),
  isArticle: z.boolean().default(false),
  isActive: z.boolean().default(true),
});

export const updateNoteSchema = z.object({
  noteTitle: z.string().min(1).max(255).optional(),
  noteContent: z.string().max(1_000_000).optional(),
  color: z
    .string()
    .regex(/^#[0-9a-fA-F]{6}$/)
    .optional(),
  isArticle: z.boolean().optional(),
  isActive: z.boolean().optional(),
});

export const noteIdParamSchema = z.object({
  id: z.coerce.number().int().positive(),
});

// ── Admin ───────────────────────────────────────────────────────
export const updateUserLimitsSchema = z.object({
  maxNotes: z.number().int().min(0).optional(),
  maxStorageBytes: z.number().int().min(0).optional(),
  role: z.enum(["user", "admin"]).optional(),
  isActive: z.boolean().optional(),
});
