import { jwtVerify } from "jose";
import type { NextRequest } from "next/server";

interface UserJwtPayload {
  sub: string;
  email: string;
  role: string;
  iat: number;
  exp: number;
}

export class AuthError extends Error {}

export async function verifyAuth(req: NextRequest) {
  const token = req.cookies.get("token")?.value;

  if (!token) throw new AuthError("Missing user token");

  try {
    const verified = await jwtVerify(
      token,
      new TextEncoder().encode(process.env.JWT_SECRET),
    );
    return verified.payload as unknown as UserJwtPayload;
  } catch (err) {
    throw new AuthError("Your token has expired.");
  }
}
