import { drizzle, type PostgresJsDatabase } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import * as schema from "./schema";
import {
  users,
  notes,
  type User,
  type NewUser,
  type Note,
  type NewNote,
} from "./schema";
import { eq, and, count, sql, gte } from "drizzle-orm";
import * as dotenv from "dotenv";

// ── Public user type (without password hash) ────────────────────
export type PublicUser = Omit<User, "passwordHash">;

dotenv.config();

// ── Repository interface ────────────────────────────────────────
export interface IDatabaseRepository {
  // Auth
  getUserByEmail(email: string): Promise<User | null>;
  getUserById(id: string): Promise<User | null>;
  createUser(user: NewUser): Promise<User>;
  updateUser(id: string, fields: Partial<NewUser>): Promise<User | null>;

  // Notes
  getNotes(creatorId: string): Promise<Note[]>;
  getNote(id: number, creatorId: string): Promise<Note | null>;
  createNote(
    note: Omit<NewNote, "id" | "createdAt" | "updatedAt">,
  ): Promise<Note>;
  updateNote(
    id: number,
    creatorId: string,
    fields: Partial<NewNote>,
  ): Promise<Note | null>;
  deleteNote(id: number, creatorId: string): Promise<boolean>;

  // Limits
  getUserNoteCount(creatorId: string): Promise<number>;
  getUserStorageUsed(creatorId: string): Promise<number>;

  // Admin / monitoring
  getDbStats(): Promise<DbStats>;
  getAllUsers(): Promise<PublicUser[]>;

  close(): Promise<void>;
}

export interface DbStats {
  totalUsers: number;
  totalNotes: number;
  activeUsers7d: number;
  estimatedDbSizeBytes: number;
}

// ── Implementation ──────────────────────────────────────────────
class DrizzleRepository implements IDatabaseRepository {
  constructor(
    private db: PostgresJsDatabase<typeof schema>,
    private client: postgres.Sql,
  ) {}

  // -- Auth -------------------------------------------------------

  async getUserByEmail(email: string): Promise<User | null> {
    const result = await this.db
      .select()
      .from(users)
      .where(eq(users.email, email.toLowerCase().trim()))
      .limit(1);
    return result[0] ?? null;
  }

  async getUserById(id: string): Promise<User | null> {
    const result = await this.db
      .select()
      .from(users)
      .where(eq(users.id, id))
      .limit(1);
    return result[0] ?? null;
  }

  async createUser(user: NewUser): Promise<User> {
    const result = await this.db.insert(users).values(user).returning();
    if (!result[0]) throw new Error("Failed to create user");
    return result[0];
  }

  async updateUser(id: string, fields: Partial<NewUser>): Promise<User | null> {
    const result = await this.db
      .update(users)
      .set({ ...fields, updatedAt: new Date() })
      .where(eq(users.id, id))
      .returning();
    return result[0] ?? null;
  }

  // -- Notes ------------------------------------------------------

  async getNotes(creatorId: string): Promise<Note[]> {
    return this.db
      .select()
      .from(notes)
      .where(and(eq(notes.creator, creatorId), eq(notes.isDeleted, false)))
      .orderBy(sql`${notes.updatedAt} DESC`);
  }

  async getNote(id: number, creatorId: string): Promise<Note | null> {
    const result = await this.db
      .select()
      .from(notes)
      .where(and(eq(notes.id, id), eq(notes.creator, creatorId), eq(notes.isDeleted, false)))
      .limit(1);
    return result[0] ?? null;
  }

  async createNote(
    note: Omit<NewNote, "id" | "createdAt" | "updatedAt">,
  ): Promise<Note> {
    const result = await this.db.insert(notes).values(note).returning();
    if (!result[0]) throw new Error("Failed to create note");
    return result[0];
  }

  async updateNote(
    id: number,
    creatorId: string,
    fields: Partial<NewNote>,
  ): Promise<Note | null> {
    const result = await this.db
      .update(notes)
      .set({ ...fields, updatedAt: new Date() })
      .where(and(eq(notes.id, id), eq(notes.creator, creatorId)))
      .returning();
    return result[0] ?? null;
  }

  async deleteNote(id: number, creatorId: string): Promise<boolean> {
    // Soft delete: mark as deleted instead of hard delete
    const result = await this.db
      .update(notes)
      .set({ isDeleted: true, updatedAt: new Date() })
      .where(and(eq(notes.id, id), eq(notes.creator, creatorId)))
      .returning({ id: notes.id });
    return result.length > 0;
  }

  // -- Limits -----------------------------------------------------

  async getUserNoteCount(creatorId: string): Promise<number> {
    const result = await this.db
      .select({ count: count() })
      .from(notes)
      .where(and(eq(notes.creator, creatorId), eq(notes.isDeleted, false)));
    return result[0]?.count ?? 0;
  }

  async getUserStorageUsed(creatorId: string): Promise<number> {
    const result = await this.db
      .select({
        total: sql<number>`COALESCE(SUM(LENGTH(${notes.noteContent})), 0)::int`,
      })
      .from(notes)
      .where(and(eq(notes.creator, creatorId), eq(notes.isDeleted, false)));
    return result[0]?.total ?? 0;
  }

  // -- Monitoring -------------------------------------------------

  async getDbStats(): Promise<DbStats> {
    const sevenDaysAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);

    const [totalUsers, totalNotes, activeUsers7d, dbSize] = await Promise.all([
      this.db.select({ count: count() }).from(users),
      this.db
        .select({ count: count() })
        .from(notes)
        .where(eq(notes.isDeleted, false)),
      this.db
        .select({ count: count() })
        .from(notes)
        .where(gte(notes.updatedAt, sevenDaysAgo)),
      this.db.execute<{ size_bytes: string }>(
        sql`SELECT pg_database_size(current_database()) AS size_bytes`,
      ),
    ]);

    const activeCount = await this.db
      .select({ count: sql<number>`COUNT(DISTINCT ${notes.creator})` })
      .from(notes)
      .where(gte(notes.updatedAt, sevenDaysAgo));

    return {
      totalUsers: totalUsers[0]?.count ?? 0,
      totalNotes: totalNotes[0]?.count ?? 0,
      activeUsers7d: activeCount[0]?.count ?? 0,
      estimatedDbSizeBytes: Number(dbSize[0]?.size_bytes ?? 0),
    };
  }

  async getAllUsers(): Promise<PublicUser[]> {
    return this.db
      .select({
        id: users.id,
        email: users.email,
        role: users.role,
        maxNotes: users.maxNotes,
        maxStorageBytes: users.maxStorageBytes,
        isActive: users.isActive,
        createdAt: users.createdAt,
        updatedAt: users.updatedAt,
      })
      .from(users)
      .orderBy(sql`${users.createdAt} DESC`);
  }

  async close(): Promise<void> {
    console.log("Closing PostgreSQL connection pool...");
    await this.client.end();
    console.log("PostgreSQL connection pool closed.");
  }
}

// ── Bootstrap ───────────────────────────────────────────────────
function createDrizzleConnection() {
  const connectionString = process.env.DATABASE_URL;
  if (!connectionString) {
    throw new Error("DATABASE_URL environment variable is missing.");
  }
  const maxConnections = Number(process.env.DB_MAX_CONNECTIONS) || 10;

  const client = postgres(connectionString, { max: maxConnections });
  const db = drizzle(client, { schema });
  console.log(
    `PostgreSQL connection pool initialized (max: ${maxConnections}).`,
  );
  return { db, client };
}

const { db, client } = createDrizzleConnection();
export const dbClient: IDatabaseRepository = new DrizzleRepository(db, client);
