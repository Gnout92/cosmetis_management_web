import { OAuth2Client } from 'google-auth-library';

// Dùng đúng CLIENT_ID của bạn
const client = new OAuth2Client(process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID);

export async function verifyGoogleToken(idToken) {
  if (!idToken) throw new Error('Missing Google ID token');

  const ticket = await client.verifyIdToken({
    idToken,
    audience: process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID,
  });

  const payload = ticket.getPayload(); // email, name, picture, sub, ...
  if (!payload) throw new Error('Invalid Google token');

  return {
    googleId: payload.sub,
    email: payload.email,
    name: payload.name,
    picture: payload.picture,
    email_verified: payload.email_verified,
  };
}
