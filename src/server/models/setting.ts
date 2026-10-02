import { type InferSchemaType, type Model, Schema, model, models } from 'mongoose';

// Single document (key: "shop") holding the shop entry password set by admin.
const settingSchema = new Schema(
  {
    key: { type: String, required: true, unique: true },
    /** Used to check what customers type. */
    shopPasswordHash: { type: String, default: null },
    /** Same password, reversibly encrypted so admins can look it up again. */
    shopPasswordEncrypted: { type: String, default: null },
    shopPasswordUpdatedAt: { type: Date, default: null },
    /** Users who unlocked the shop before this date must enter the password again. */
    shopAccessValidAfter: { type: Date, default: null },
  },
  { timestamps: true }
);

export type SettingDoc = InferSchemaType<typeof settingSchema>;
export const Setting: Model<SettingDoc> = models.Setting || model<SettingDoc>('Setting', settingSchema);
