import { type InferSchemaType, type Model, Schema, model, models } from 'mongoose';
import { toJSONPlugin } from '../db/to-json';
import './product';

const cartSchema = new Schema(
  {
    user: { type: Schema.Types.ObjectId, required: true, unique: true },
    items: {
      type: [
        {
          _id: false,
          product: { type: Schema.Types.ObjectId, ref: 'Product', required: true },
          quantity: { type: Number, required: true, min: 1 },
        },
      ],
      default: [],
    },
  },
  { timestamps: true }
);
cartSchema.plugin(toJSONPlugin);

export type CartDoc = InferSchemaType<typeof cartSchema>;
export const Cart: Model<CartDoc> = models.Cart || model<CartDoc>('Cart', cartSchema);
