import { type InferSchemaType, type Model, Schema, model, models } from 'mongoose';
import { toJSONPlugin } from '../db/to-json';

const categorySchema = new Schema(
  {
    name: { type: String, required: true, trim: true },
    slug: { type: String, required: true, unique: true },
    description: { type: String, default: '' },
  },
  { timestamps: true }
);
categorySchema.plugin(toJSONPlugin);

export type CategoryDoc = InferSchemaType<typeof categorySchema>;
export const Category: Model<CategoryDoc> = models.Category || model<CategoryDoc>('Category', categorySchema);
