// src/lib/auth/jwt.js
import jwt from "jsonwebtoken";

export function signAppToken(userPayload) {
  const secret = process.env.JWT_SECRET;
  const expiresIn = process.env.JWT_EXPIRES_IN || "7d";

  // userPayload nên gọn: { id, email, role? }
  return jwt.sign(userPayload, secret, { expiresIn });
}
