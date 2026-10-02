import type { Types } from 'mongoose';
import { conflict, notFound } from '../http';
import { Cart } from '../models/cart';
import { Product } from '../models/product';

interface CartProduct {
  _id: Types.ObjectId;
  name: string;
  price: number;
  stock: number;
  images: string[];
  isVisible: boolean;
}

export async function loadCart(userId: string) {
  return Cart.findOne({ user: userId }).populate<{ items: { product: CartProduct | null; quantity: number }[] }>(
    'items.product',
    'name price stock images isVisible'
  );
}

/** Cart as shown to the user. Deleted or hidden products are left out. */
export async function getCartView(userId: string) {
  const cart = await loadCart(userId);
  const items = (cart?.items ?? [])
    .filter((item) => item.product?.isVisible)
    .map(({ product, quantity }) => {
      const p = product as CartProduct;
      return {
        product: { id: String(p._id), name: p.name, price: p.price, stock: p.stock, image: p.images[0] ?? '' },
        quantity,
        isAvailable: p.stock >= quantity,
      };
    });
  return {
    items,
    count: items.reduce((sum, item) => sum + item.quantity, 0),
    subtotal: items.reduce((sum, item) => sum + item.product.price * item.quantity, 0),
  };
}

async function findSellableProduct(productId: string) {
  const product = await Product.findOne({ _id: productId, isVisible: true });
  if (!product) throw notFound('Sản phẩm không tồn tại hoặc đã ngừng bán');
  return product;
}

function assertStock(name: string, stock: number, quantity: number) {
  if (stock <= 0) throw conflict(`"${name}" đã hết hàng`);
  if (quantity > stock) throw conflict(`"${name}" chỉ còn ${stock} sản phẩm`);
}

export async function addToCart(userId: string, productId: string, quantity: number) {
  const product = await findSellableProduct(productId);
  const cart = await Cart.findOne({ user: userId });
  const current = cart?.items.find((item) => String(item.product) === productId)?.quantity ?? 0;
  assertStock(product.name, product.stock, current + quantity);

  if (current > 0) {
    await Cart.updateOne({ user: userId, 'items.product': productId }, { $inc: { 'items.$.quantity': quantity } });
  } else {
    await Cart.updateOne({ user: userId }, { $push: { items: { product: productId, quantity } } }, { upsert: true });
  }
}

export async function setCartItemQuantity(userId: string, productId: string, quantity: number) {
  const product = await findSellableProduct(productId);
  assertStock(product.name, product.stock, quantity);
  const result = await Cart.updateOne(
    { user: userId, 'items.product': productId },
    { $set: { 'items.$.quantity': quantity } }
  );
  if (result.matchedCount === 0) throw notFound('Sản phẩm không có trong giỏ hàng');
}

export async function removeFromCart(userId: string, productId: string) {
  await Cart.updateOne({ user: userId }, { $pull: { items: { product: productId } } });
}

export async function clearCart(userId: string) {
  await Cart.updateOne({ user: userId }, { $set: { items: [] } });
}
