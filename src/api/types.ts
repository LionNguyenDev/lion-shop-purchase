import type { OrderStatus } from '@/lib/validations';

export interface Paginated<T> {
  items: T[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export interface ProductPage extends Paginated<Product> {
  /** Min and max price among products matching every filter except price. */
  priceBounds: { min: number; max: number };
}

export interface Me {
  user: {
    id: string;
    name: string;
    email: string;
    image: string | null;
    phone: string;
    facebookUrl: string;
    role: 'user' | 'admin';
  } | null;
  hasShopAccess: boolean;
}

export interface Category {
  id: string;
  name: string;
  slug: string;
  description: string;
}

export interface CategoryWithCount extends Category {
  productCount: number;
}

export type AdminCategory = CategoryWithCount;

export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  stock: number;
  sold: number;
  images: string[];
  isVisible: boolean;
  category: Pick<Category, 'id' | 'name' | 'slug'> | null;
  createdAt: string;
  updatedAt: string;
}

export interface CartLine {
  product: { id: string; name: string; price: number; stock: number; image: string };
  quantity: number;
  isAvailable: boolean;
}

export interface CartView {
  items: CartLine[];
  count: number;
  subtotal: number;
}

export interface Division {
  code: number;
  name: string;
}

export interface Order {
  id: string;
  code: string;
  user: string;
  customer: { name: string; phone: string; facebookUrl: string };
  address: { provinceCode: number; provinceName: string; wardCode: number; wardName: string; street: string };
  note: string;
  items: { product: string; name: string; image: string; price: number; quantity: number }[];
  total: number;
  status: OrderStatus;
  createdAt: string;
  updatedAt: string;
}

export interface AdminUser {
  id: string;
  name: string;
  email: string;
  phone?: string;
  facebookUrl?: string;
  role: 'user' | 'admin';
  hasShopAccess: boolean;
  createdAt: string;
}

export interface AdminStats {
  users: number;
  products: number;
  hiddenProducts: number;
  outOfStock: number;
  orders: Partial<Record<OrderStatus, number>>;
  revenue: number;
}

export interface ShopSettings {
  hasShopPassword: boolean;
  shopPasswordUpdatedAt: string | null;
}

export type RevealedShopPassword =
  | { password: string }
  | { password: null; reason: 'not_configured' | 'legacy' | 'undecryptable' };
