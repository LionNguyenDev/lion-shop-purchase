import { getMongoClient } from './server/db/mongo-client';
import { connectDB } from './server/db/mongoose';

/**
 * Open both MongoDB connections at boot (Mongoose for the app, the native client for Better Auth) so the
 * first visitor after a deploy does not wait for the ~1s TLS + auth handshake. Not awaited: a slow or
 * unreachable database never delays startup, and requests still connect on demand.
 */
Promise.all([connectDB(), getMongoClient().connect()]).catch((error) =>
  console.error('[db] warm-up connection failed', error)
);
