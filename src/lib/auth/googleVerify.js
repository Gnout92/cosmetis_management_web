import { OAuth2Client } from "google-auth-library";

const client = new OAuth2Client(process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID);

/**
 * verifyGoogleToken
 * @param {string} idToken - credential từ GoogleLogin (credentialResponse.credential)
 * @returns { email, name, picture, sub } nếu hợp lệ
 * throws Error nếu token không hợp lệ
 */
export async function verifyGoogleToken(idToken) {
  if (!idToken) {
    throw new Error("Missing Google ID token");
  }

  const ticket = await client.verifyIdToken({
    idToken,
    audience: process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID,
  });

  const payload = ticket.getPayload();
  // payload có rất nhiều field, ta lấy cái mình cần
  return {
    email: payload.email,
    name: payload.name,
    picture: payload.picture,
    sub: payload.sub, // Google user id
    email_verified: payload.email_verified,
  };
}
