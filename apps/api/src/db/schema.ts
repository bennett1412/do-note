import {
  pgTable,
  pgEnum,
  uuid,
  bigint,
  varchar,
  text,
  boolean,
  integer,
  bigint as pgBigInt,
  timestamp,
  uniqueIndex,
  index,
} from "drizzle-orm/pg-core";

// ── User role enum ──────────────────────────────────────────────
export const userRoleEnum = pgEnum("user_role", [
  "super_user",
  "admin",
  "user",
]);

// ── Users table ─────────────────────────────────────────────────
export const users = pgTable(
  "users",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    email: varchar("email", { length: 255 }).notNull(),
    passwordHash: varchar("password_hash", { length: 255 }).notNull(),
    role: userRoleEnum("role").notNull().default("user"),
    maxNotes: integer("max_notes").notNull().default(5),
    maxStorageBytes: pgBigInt("max_storage_bytes", { mode: "number" })
      .notNull()
      .default(1_048_576), // 1 MB
    isActive: boolean("is_active").notNull().default(true),
    createdAt: timestamp("created_at", { withTimezone: true })
      .defaultNow()
      .notNull(),
    updatedAt: timestamp("updated_at", { withTimezone: true })
      .defaultNow()
      .notNull(),
  },
  (table) => [uniqueIndex("idx_users_email").on(table.email)]
);

// ── Notes table ─────────────────────────────────────────────────
export const notes = pgTable(
  "notes",
  {
    id: bigint("id", { mode: "number" })
      .primaryKey()
      .generatedByDefaultAsIdentity(),
    creator: uuid("creator")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    noteTitle: varchar("note_title", { length: 255 }).notNull(),
    noteContent: text("note_content").default(""),
    color: varchar("color", { length: 7 }).default("#ffffff"),
    isArticle: boolean("is_article").default(false),
    isActive: boolean("is_active").default(true),
    createdAt: timestamp("created_at", { withTimezone: true })
      .defaultNow()
      .notNull(),
    updatedAt: timestamp("updated_at", { withTimezone: true })
      .defaultNow()
      .notNull(),
  },
  (table) => [
    index("idx_notes_creator").on(table.creator),
    index("idx_notes_creator_created").on(
      table.creator,
      table.createdAt.desc()
    ),
  ]
);

// ── Exported types ──────────────────────────────────────────────
export type User = typeof users.$inferSelect;
export type NewUser = typeof users.$inferInsert;
export type Note = typeof notes.$inferSelect;
export type NewNote = typeof notes.$inferInsert;
