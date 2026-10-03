import mongoose from 'mongoose';
import { serverEnv } from '../env';

const globalForMongoose = globalThis as unknown as { _mongoosePromise?: Promise<typeof mongoose> };

/**
 * Indexes Better Auth does not create on MongoDB. createIndex is a no-op when the index already exists.
 * - TTL: Better Auth never deletes expired sessions or OTP records, so MongoDB purges them.
 * - Unique email / phone: the sign-up checks run before insert, so two simultaneous sign-ups could both pass;
 *   these indexes make the database the final guard. Each index is created on its own so existing duplicate
 *   data (which blocks one index) does not stop the others.
 */
async function ensureIndexes(connection: typeof mongoose) {
  const db = connection.connection.db;
  if (!db) return;
  const users = db.collection('user');
  const indexes: [string, () => Promise<string>][] = [
    ...['session', 'verification'].map((name): [string, () => Promise<string>] => [
      `${name}.expiresAt_ttl`,
      () => db.collection(name).createIndex({ expiresAt: 1 }, { expireAfterSeconds: 0, name: 'expiresAt_ttl' }),
    ]),
    ['user.email_unique', () => users.createIndex({ email: 1 }, { unique: true, name: 'email_unique' })],
    [
      'user.phone_unique',
      // Partial: accounts without a phone (e.g. a future Google sign-up) are not compared
      () =>
        users.createIndex(
          { phone: 1 },
          { unique: true, name: 'phone_unique', partialFilterExpression: { phone: { $gt: '' } } }
        ),
    ],
  ];
  const results = await Promise.allSettled(indexes.map(([, create]) => create()));
  results.forEach((result, i) => {
    // Log the error code only: duplicate-key messages contain the user's email or phone
    if (result.status === 'rejected') {
      console.error(`[db] index ${indexes[i][0]} not created: ${result.reason?.codeName ?? 'unknown error'}`);
    }
  });
}

export function connectDB() {
  if (!globalForMongoose._mongoosePromise) {
    globalForMongoose._mongoosePromise = mongoose
      .connect(serverEnv.mongoUri, {
        dbName: serverEnv.mongoDbName,
        bufferCommands: false,
        maxPoolSize: serverEnv.mongoPoolSize,
        serverSelectionTimeoutMS: serverEnv.mongoServerSelectionTimeoutMs,
      })
      .then((connection) => {
        ensureIndexes(connection).catch((error) => console.error('[db] failed to create indexes', error));
        return connection;
      })
      .catch((error) => {
        globalForMongoose._mongoosePromise = undefined;
        throw error;
      });
  }
  return globalForMongoose._mongoosePromise;
}
