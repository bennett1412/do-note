import bcrypt from "bcryptjs";

const BCRYPT_ROUNDS = 10;

export interface JwtPayload {
  sub: string;  // user id
  email: string;
  role: "super_user" | "admin" | "user";
}

export async function hashPassword(password: string): Promise<string> {
  return bcrypt.hash(password, BCRYPT_ROUNDS);
}

export async function verifyPassword(
  password: string,
  hash: string,
): Promise<boolean> {
  return bcrypt.compare(password, hash);
}