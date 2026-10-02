import { normalizeText } from '@/lib/text';
import { type InferSchemaType, type Model, Schema, model, models } from 'mongoose';
import { toJSONPlugin } from '../db/to-json';
// Registers the Category model so `populate('category')` works wherever Product is used
import './category';

const productSchema = new Schema(
  {
    name: { type: String, required: true, trim: true },
    description: { type: String, default: '' },
    price: { type: Number, required: true, min: 0 },
    /** Quantity still available to sell. */
    stock: { type: Number, required: true, min: 0, default: 0 },
    /** Quantity already sold. */
    sold: { type: Number, required: true, min: 0, default: 0 },
    category: { type: Schema.Types.ObjectId, ref: 'Category', required: true, index: true },
    images: { type: [String], default: [] },
    isVisible: { type: Boolean, default: true, index: true },
    /** Name without diacritics, used for accent-insensitive search. */
    searchText: { type: String, select: false },
  },
  { timestamps: true }
);

productSchema.index({ isVisible: 1, createdAt: -1 });
productSchema.index({ isVisible: 1, price: 1 });
productSchema.index({ isVisible: 1, sold: -1 });

productSchema.pre('save', function () {
  if (this.isModified('name')) this.searchText = normalizeText(this.name);
});

productSchema.plugin(toJSONPlugin, { hide: ['searchText'] });

export type ProductDoc = InferSchemaType<typeof productSchema>;
export const Product: Model<ProductDoc> = models.Product || model<ProductDoc>('Product', productSchema);
