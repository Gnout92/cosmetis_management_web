export default function handler(req, res) {
  res.status(200).json({
    NODE_ENV: process.env.NODE_ENV,
    NEXT_PUBLIC_GOOGLE_CLIENT_ID: process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID,
    JWT_SECRET_SET: !!process.env.JWT_SECRET,
  });
}
