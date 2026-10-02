import { MongoClient } from 'mongodb';
import { serverEnv } from '../env';

// Native driver client used by Better Auth. The driver connects lazily on the first operation.
const globalForMongo = globalThis as unknown as { _mongoClient?: MongoClient };

export const mongoClient =
  globalForMongo._mongoClient ?? new MongoClient(serverEnv.mongoUri, { maxPoolSize: serverEnv.mongoPoolSize });

if (!serverEnv.isProd) globalForMongo._mongoClient = mongoClient;

export const mongoDb = mongoClient.db(serverEnv.mongoDbName);
