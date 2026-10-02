import { type InferSchemaType, type Model, Schema, model, models } from 'mongoose';
import { toJSONPlugin } from '../db/to-json';

// Read/update view over the `user` collection owned by Better Auth. Better Auth creates
// the documents and its indexes, so this model never writes timestamps or builds indexes.
const userSchema = new Schema(
  {
    name: String,
    email: String,
    emailVerified: Boolean,
    image: String,
    phone: String,
    facebookUrl: String,
    role: { type: String, default: 'user' },
    shopAccessAt: { type: Date, default: null },
    /** Wrong shop password attempts within the current window. */
    shopAttempts: { type: Number, default: 0 },
    shopAttemptsResetAt: { type: Date, default: null },
    createdAt: Date,
    updatedAt: Date,
  },
  { collection: 'user', strict: false, autoIndex: false, versionKey: false }
);
userSchema.plugin(toJSONPlugin, { hide: ['shopAttempts', 'shopAttemptsResetAt'] });

export type UserDoc = InferSchemaType<typeof userSchema>;
export const User: Model<UserDoc> = models.User || model<UserDoc>('User', userSchema);
