export default async function handler(req, res) {
  res.status(200).json({
    ok: true,
    env: {
      node: process.version,
      next: process.env.NEXT_RUNTIME || 'node',
      googleClientId: process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID ? 'present' : 'missing',
      db: process.env.DB_CONNECTION,
      host: process.env.DB_HOST,
      dbName: process.env.DB_DATABASE,
      user: process.env.DB_USERNAME,
      hasPassword: (process.env.DB_PASSWORD || '').length > 0,
    },
  });
}
