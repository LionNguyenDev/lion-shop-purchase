import mongoose from 'mongoose';
import { serverEnv } from '../env';

const globalForMongoose = globalThis as unknown as { _mongoosePromise?: Promise<typeof mongoose> };

/**
 * Better Auth never deletes expired sessions or OTP records on MongoDB, so a TTL index lets
 * MongoDB purge them. createIndex is a no-op when the index already exists.
 */
async function ensureTtlIndexes(connection: typeof mongoose) {
  const db = connection.connection.db;
  if (!db) return;
  await Promise.all(
    ['session', 'verification'].map((name) =>
      db.collection(name).createIndex({ expiresAt: 1 }, { expireAfterSeconds: 0, name: 'expiresAt_ttl' })
    )
  );
}

export function connectDB() {
  if (!globalForMongoose._mongoosePromise) {
    globalForMongoose._mongoosePromise = mongoose
      .connect(serverEnv.mongoUri, {
        dbName: serverEnv.mongoDbName,
        bufferCommands: false,
        maxPoolSize: serverEnv.mongoPoolSize,
      })
      .then((connection) => {
        ensureTtlIndexes(connection).catch((error) => console.error('[db] failed to create TTL indexes', error));
        return connection;
      })
      .catch((error) => {
        globalForMongoose._mongoosePromise = undefined;
        throw error;
      });
  }
  return globalForMongoose._mongoosePromise;
}
