import postgres from "postgres";
import { drizzle } from "drizzle-orm/postgres-js";
import { users } from "../db/schema.js";
import { eq } from "drizzle-orm";
import * as dotenv from "dotenv";
import { hashPassword } from "../auth.js";

dotenv.config();

async function main() {
  const args = process.argv.slice(2);
  const emailFlag = args.indexOf("--email");
  const passwordFlag = args.indexOf("--password");

  if (emailFlag === -1 || passwordFlag === -1) {
    console.error("Usage: node dist/db/seed.js --email <email> --password <password>");
    process.exit(1);
  }

  const email = args[emailFlag + 1]?.toLowerCase().trim();
  const password = args[passwordFlag + 1];

  if (!email || !password) {
    console.error("Both --email and --password are required.");
    process.exit(1);
  }

  const databaseUrl = process.env.DATABASE_URL;
  if (!databaseUrl) {
    console.error("DATABASE_URL environment variable is required.");
    process.exit(1);
  }

  const client = postgres(databaseUrl, { max: 1 });
  const db = drizzle(client);

  const existing = await db
    .select()
    .from(users)
    .where(eq(users.email, email))
    .limit(1);

  if (existing.length > 0) {
    console.log(`User ${email} already exists.`);
    await client.end();
    return;
  }

  const passwordHash = await hashPassword(password);
  await db.insert(users).values({
    email,
    passwordHash,
    role: "super_user",
    maxNotes: 999_999,
    maxStorageBytes: 1_073_741_824, // 1 GB
  });

  console.log(`Super user ${email} created successfully.`);
  await client.end();
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
