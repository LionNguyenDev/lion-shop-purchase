import { ORDER_STATUSES } from '@/lib/validations';
import { type InferSchemaType, type Model, Schema, model, models } from 'mongoose';
import { toJSONPlugin } from '../db/to-json';

const orderSchema = new Schema(
  {
    code: { type: String, required: true, unique: true },
    user: { type: Schema.Types.ObjectId, required: true, index: true },
    customer: {
      name: { type: String, required: true },
      phone: { type: String, required: true },
      facebookUrl: { type: String, required: true },
    },
    address: {
      provinceCode: { type: Number, required: true },
      provinceName: { type: String, required: true },
      wardCode: { type: Number, required: true },
      wardName: { type: String, required: true },
      street: { type: String, required: true },
    },
    note: { type: String, default: '' },
    items: [
      {
        _id: false,
        product: { type: Schema.Types.ObjectId, ref: 'Product', required: true },
        name: { type: String, required: true },
        image: { type: String, default: '' },
        price: { type: Number, required: true },
        quantity: { type: Number, required: true, min: 1 },
      },
    ],
    total: { type: Number, required: true },
    status: { type: String, enum: ORDER_STATUSES, default: 'pending', index: true },
  },
  { timestamps: true }
);
orderSchema.index({ createdAt: -1 });
orderSchema.plugin(toJSONPlugin);

export type OrderDoc = InferSchemaType<typeof orderSchema>;
export const Order: Model<OrderDoc> = models.Order || model<OrderDoc>('Order', orderSchema);
