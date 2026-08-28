import { migrate } from "drizzle-orm/postgres-js/migrator";
import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import * as dotenv from "dotenv";
import * as fs from "node:fs";
import * as path from "node:path";
import { fileURLToPath } from "node:url";

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export async function runMigrations() {
  const databaseUrl = process.env.DATABASE_URL;
  if (!databaseUrl) {
    console.error("DATABASE_URL is required for running migrations.");
    process.exit(1);
  }

  // In dev (src/): __dirname = apps/api/src/db, need ../../drizzle
  // In production (dist/): __dirname = apps/api/dist/db, need ../../drizzle
  const migrationsFolder = path.resolve(__dirname, "..", "..", "drizzle");

  if (!fs.existsSync(migrationsFolder)) {
    console.log(
      `Migrations folder not found at ${migrationsFolder}, skipping migrations.`,
    );
    return;
  }

  console.log(`Running migrations from: ${migrationsFolder}`);

  const migrationClient = postgres(databaseUrl, { max: 1 });

  try {
    await migrate(drizzle(migrationClient), {
      migrationsFolder,
    });
    console.log("Migrations completed successfully.");
  } catch (error) {
    console.error("Migration failed:", error);
    process.exit(1);
  } finally {
    await migrationClient.end();
  }
}
