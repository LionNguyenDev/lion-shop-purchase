import { z } from 'zod';

// Shared between client forms and API handlers so both sides apply the same rules.

export const ORDER_STATUSES = ['pending', 'confirmed', 'shipping', 'completed', 'cancelled'] as const;
export type OrderStatus = (typeof ORDER_STATUSES)[number];

export const PRODUCT_SORTS = ['newest', 'price_asc', 'price_desc', 'best_selling'] as const;
export type ProductSort = (typeof PRODUCT_SORTS)[number];

const objectId = z.string().regex(/^[a-f\d]{24}$/i, 'ID không hợp lệ');

export const nameSchema = z.string().trim().min(2, 'Tên tối thiểu 2 ký tự').max(80, 'Tên tối đa 80 ký tự');

export const emailSchema = z.email('Email không hợp lệ').trim().toLowerCase();

export const passwordSchema = z.string().min(8, 'Mật khẩu tối thiểu 8 ký tự').max(128, 'Mật khẩu tối đa 128 ký tự');

/** Both spellings of a Vietnamese mobile number, e.g. ['0912345678', '+84912345678'] */
export const phoneVariants = (phone: string) => {
  const local = phone.startsWith('+84') ? `0${phone.slice(3)}` : phone;
  return [local, `+84${local.slice(1)}`];
};

/** Accepts 0912345678 or +84912345678 and always outputs the 0 form, so duplicates are easy to spot */
export const phoneSchema = z
  .string()
  .trim()
  .regex(/^(0|\+84)(3|5|7|8|9)\d{8}$/, 'Số điện thoại không hợp lệ (VD: 0912345678)')
  .transform((phone) => phoneVariants(phone)[0]);

export const facebookUrlSchema = z
  .string()
  .trim()
  .regex(
    /^https?:\/\/(www\.|m\.|web\.)?(facebook|fb)\.com\/.+/i,
    'Link Facebook không hợp lệ (VD: https://facebook.com/ten.ban)'
  );

export const registerSchema = z
  .object({
    name: nameSchema,
    email: emailSchema,
    password: passwordSchema,
    confirmPassword: z.string(),
    phone: phoneSchema,
    facebookUrl: facebookUrlSchema,
  })
  .refine((data) => data.password === data.confirmPassword, {
    path: ['confirmPassword'],
    message: 'Mật khẩu nhắc lại không khớp',
  });
export type RegisterInput = z.infer<typeof registerSchema>;

export const loginSchema = z.object({
  email: emailSchema,
  password: z.string().min(1, 'Vui lòng nhập mật khẩu'),
});
export type LoginInput = z.infer<typeof loginSchema>;

export const forgotPasswordSchema = z.object({ email: emailSchema });
export type ForgotPasswordInput = z.infer<typeof forgotPasswordSchema>;

export const resetPasswordSchema = z
  .object({
    otp: z
      .string()
      .trim()
      .regex(/^\d{6}$/, 'Mã OTP gồm 6 chữ số'),
    password: passwordSchema,
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    path: ['confirmPassword'],
    message: 'Mật khẩu nhắc lại không khớp',
  });
export type ResetPasswordInput = z.infer<typeof resetPasswordSchema>;

export const shopAccessSchema = z.object({
  password: z.string().min(1, 'Vui lòng nhập mật khẩu cửa hàng'),
});
export type ShopAccessInput = z.infer<typeof shopAccessSchema>;

export const shopPasswordSchema = z.object({
  password: z.string().min(4, 'Mật khẩu tối thiểu 4 ký tự').max(64, 'Mật khẩu tối đa 64 ký tự'),
});
export type ShopPasswordInput = z.infer<typeof shopPasswordSchema>;

const categoryNameSchema = z.string().trim().min(2, 'Tên tối thiểu 2 ký tự').max(60, 'Tên tối đa 60 ký tự');

export const categorySchema = z.object({
  name: categoryNameSchema,
  description: z.string().trim().max(300, 'Mô tả tối đa 300 ký tự').optional().default(''),
});
export type CategoryInput = z.input<typeof categorySchema>;

const nonNegativeInt = (label: string) =>
  z
    .number({ error: `${label} phải là số` })
    .int(`${label} phải là số nguyên`)
    .min(0, `${label} không được âm`);

export const productSchema = z.object({
  name: z.string().trim().min(2, 'Tên tối thiểu 2 ký tự').max(120, 'Tên tối đa 120 ký tự'),
  description: z.string().trim().max(5000, 'Mô tả tối đa 5000 ký tự'),
  price: nonNegativeInt('Giá').max(1_000_000_000, 'Giá quá lớn'),
  stock: nonNegativeInt('Số lượng có thể bán').max(1_000_000, 'Số lượng quá lớn'),
  sold: nonNegativeInt('Số lượng đã bán').max(10_000_000, 'Số lượng quá lớn'),
  /** Name of an existing category, or of a new one created on save */
  categoryName: categoryNameSchema,
  images: z.array(z.url('Link ảnh không hợp lệ')).max(10, 'Tối đa 10 ảnh'),
  isVisible: z.boolean(),
});
export type ProductInput = z.infer<typeof productSchema>;

export const productVisibilitySchema = z.object({ isVisible: z.boolean() });

export const productQuerySchema = z.object({
  q: z.string().trim().max(100).optional(),
  category: objectId.optional(),
  minPrice: z.coerce.number().int().min(0).optional(),
  maxPrice: z.coerce.number().int().min(0).optional(),
  inStock: z
    .enum(['true', 'false'])
    .optional()
    .transform((value) => value === 'true'),
  sort: z.enum(PRODUCT_SORTS).default('newest'),
  page: z.coerce.number().int().min(1).default(1),
  limit: z.coerce.number().int().min(1).max(48).default(12),
});
export type ProductQuery = z.input<typeof productQuerySchema>;

export const cartItemSchema = z.object({
  productId: objectId,
  quantity: z.number().int().min(1, 'Số lượng tối thiểu là 1').max(999, 'Số lượng tối đa là 999'),
});
export type CartItemInput = z.infer<typeof cartItemSchema>;

export const checkoutSchema = z.object({
  name: nameSchema,
  phone: phoneSchema,
  facebookUrl: facebookUrlSchema,
  provinceCode: z.number({ error: 'Vui lòng chọn tỉnh/thành phố' }).int().positive('Vui lòng chọn tỉnh/thành phố'),
  wardCode: z.number({ error: 'Vui lòng chọn phường/xã' }).int().positive('Vui lòng chọn phường/xã'),
  street: z.string().trim().min(3, 'Vui lòng nhập số nhà, tên đường').max(200, 'Địa chỉ tối đa 200 ký tự'),
  note: z.string().trim().max(500, 'Ghi chú tối đa 500 ký tự').optional().default(''),
});
export type CheckoutInput = z.input<typeof checkoutSchema>;

export const orderStatusSchema = z.object({ status: z.enum(ORDER_STATUSES) });

export const listQuerySchema = z.object({
  q: z.string().trim().max(100).optional(),
  page: z.coerce.number().int().min(1).default(1),
  limit: z.coerce.number().int().min(1).max(100).default(20),
});

export const adminProductQuerySchema = listQuerySchema.extend({
  category: objectId.optional(),
  visibility: z.enum(['all', 'visible', 'hidden']).default('all'),
});

export const adminOrderQuerySchema = listQuerySchema.extend({
  status: z.enum(ORDER_STATUSES).optional(),
});

export const adminUserUpdateSchema = z.object({
  shopAccess: z.literal(false),
});
