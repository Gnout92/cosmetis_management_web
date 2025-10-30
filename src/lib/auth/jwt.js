import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET || "dev_fallback_secret_change_me";
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || "7d";

/**
 * Tạo JWT cho FE
 */
export function signAppToken(userPayload) {
  return jwt.sign(userPayload, JWT_SECRET, {
    expiresIn: JWT_EXPIRES_IN,
  });
}
