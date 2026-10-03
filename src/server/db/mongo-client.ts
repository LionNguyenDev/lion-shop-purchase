import { type Db, MongoClient } from 'mongodb';
import { serverEnv } from '../env';

/**
 * Native driver client used by Better Auth.
 *
 * When a MongoClient's first connection fails (e.g. Atlas rejects the IP), the driver closes its topology but
 * keeps it, so every later operation throws "Topology is closed" for the life of the process, even once the
 * network is fine. On a warm serverless instance that means sign-in and sign-up stay broken. So the client is
 * dropped as soon as it closes, and the next operation builds a fresh one.
 */
const globalForMongo = globalThis as unknown as { _mongoClient?: MongoClient };

function createClient() {
  const client = new MongoClient(serverEnv.mongoUri, {
    maxPoolSize: serverEnv.mongoPoolSize,
    serverSelectionTimeoutMS: serverEnv.mongoServerSelectionTimeoutMs,
  });
  client.once('topologyClosed', () => {
    if (globalForMongo._mongoClient === client) globalForMongo._mongoClient = undefined;
  });
  return client;
}

/** The live client, recreated after a failed connection. The driver connects lazily on the first operation */
export function getMongoClient() {
  globalForMongo._mongoClient ??= createClient();
  return globalForMongo._mongoClient;
}

/**
 * Database handle that resolves each collection on the current client. Better Auth's adapter only calls
 * `collection()` (transactions are off), so this is all it needs, and it never holds a dead client.
 */
export const mongoDb = {
  collection: (name: string) => getMongoClient().db(serverEnv.mongoDbName).collection(name),
} as unknown as Db;
