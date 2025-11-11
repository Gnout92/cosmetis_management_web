// src/lib/auth/googleVerify.js
import { OAuth2Client } from "google-auth-library";

const client = new OAuth2Client(process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID);

/**
 * Xác thực id_token (credential từ FE / GoogleLogin)
 * và trả thông tin profile cơ bản.
 */
export async function verifyGoogleToken(idToken) {
  if (!idToken) throw new Error("Missing id_token");

  const ticket = await client.verifyIdToken({
    idToken,
    audience: process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID,
  });

  const payload = ticket.getPayload();
  // payload thường có: sub, email, name, picture, given_name, family_name...

  return {
    googleId: payload.sub,
    email: payload.email,
    name: payload.name,
    picture: payload.picture,
    emailVerified: payload.email_verified,
  };
}
