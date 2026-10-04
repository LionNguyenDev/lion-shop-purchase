const isProd = process.env.NODE_ENV === 'production';

export const serverEnv = {
  mongoUri: process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/lion-shopping',
  mongoDbName: process.env.MONGODB_DB || undefined,
  /** Per client per instance. Two clients (Better Auth + Mongoose) run in each serverless instance. */
  mongoPoolSize: Number(process.env.MONGODB_POOL_SIZE || 5),
  /**
   * How long a query waits to reach the cluster before failing. The driver default (30s) can outlast a
   * serverless function, so an unreachable database would show up as a timeout instead of a clear error.
   */
  mongoServerSelectionTimeoutMs: Number(process.env.MONGODB_SERVER_SELECTION_TIMEOUT_MS || 5000),
  authSecret: process.env.BETTER_AUTH_SECRET,
  authUrl: process.env.BETTER_AUTH_URL || process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000',
  smtp: {
    host: process.env.SMTP_HOST,
    port: Number(process.env.SMTP_PORT || 465),
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
    from: process.env.MAIL_FROM || 'Lion Cosmetic <no-reply@example.com>',
  },
  google: {
    clientId: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
  },
  cloudinary: {
    cloudName: process.env.CLOUDINARY_CLOUD_NAME,
    apiKey: process.env.CLOUDINARY_API_KEY,
    apiSecret: process.env.CLOUDINARY_API_SECRET,
    folder: process.env.CLOUDINARY_FOLDER || 'lion-shopping/products',
  },
  addressApiUrl: process.env.ADDRESS_API_URL || 'https://provinces.open-api.vn/api/v2',
  isProd,
};
