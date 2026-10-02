import type { CartItemInput, CheckoutInput, ProductQuery } from '@/lib/validations';
import { keepPreviousData, useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { client } from './client';
import { queryKeys } from './query-keys';
import type { CartView, CategoryWithCount, Division, Me, Order, Paginated, Product, ProductPage } from './types';

export function useMe() {
  return useQuery({
    queryKey: queryKeys.me,
    queryFn: async () => (await client.get<Me>('/me')).data,
    staleTime: 60 * 1000,
  });
}

export function useUnlockShop() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (password: string) => (await client.post('/shop-access', { password })).data,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: queryKeys.me }),
  });
}

export function useCategories() {
  return useQuery({
    queryKey: queryKeys.categories,
    queryFn: async () => (await client.get<CategoryWithCount[]>('/categories')).data,
    staleTime: 5 * 60 * 1000,
  });
}

export function useProducts(params: ProductQuery) {
  return useQuery({
    queryKey: queryKeys.products(params),
    queryFn: async () => (await client.get<ProductPage>('/products', { params })).data,
    placeholderData: keepPreviousData,
  });
}

export function useProduct(id: string) {
  return useQuery({
    queryKey: queryKeys.product(id),
    queryFn: async () => (await client.get<Product>(`/products/${id}`)).data,
  });
}

export function useCart(enabled = true) {
  return useQuery({
    queryKey: queryKeys.cart,
    queryFn: async () => (await client.get<CartView>('/cart')).data,
    enabled,
  });
}

function useCartMutation<T>(request: (input: T) => Promise<CartView>) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: request,
    onSuccess: (cart) => queryClient.setQueryData(queryKeys.cart, cart),
  });
}

export const useAddToCart = () =>
  useCartMutation(async (input: CartItemInput) => (await client.post<CartView>('/cart', input)).data);

export const useUpdateCartItem = () =>
  useCartMutation(async (input: CartItemInput) => (await client.patch<CartView>('/cart', input)).data);

export const useRemoveCartItem = () =>
  useCartMutation(
    async (productId: string) => (await client.delete<CartView>('/cart', { params: { productId } })).data
  );

export function useCreateOrder() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (input: CheckoutInput) => (await client.post<Order>('/orders', input)).data,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.cart });
      queryClient.invalidateQueries({ queryKey: ['orders'] });
      queryClient.invalidateQueries({ queryKey: ['products'] });
    },
  });
}

export function useMyOrders(page: number) {
  return useQuery({
    queryKey: queryKeys.orders(page),
    queryFn: async () => (await client.get<Paginated<Order>>('/orders', { params: { page, limit: 10 } })).data,
    placeholderData: keepPreviousData,
  });
}

export function useCancelMyOrder() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) => (await client.post<Order>(`/orders/${id}/cancel`)).data,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['orders'] });
      queryClient.invalidateQueries({ queryKey: ['products'] });
    },
  });
}

export function useProvinces() {
  return useQuery({
    queryKey: queryKeys.provinces,
    queryFn: async () => (await client.get<Division[]>('/address/provinces')).data,
    staleTime: Number.POSITIVE_INFINITY,
  });
}

export function useWards(provinceCode: number | undefined) {
  return useQuery({
    queryKey: queryKeys.wards(provinceCode ?? 0),
    queryFn: async () => (await client.get<Division[]>(`/address/provinces/${provinceCode}/wards`)).data,
    enabled: Boolean(provinceCode),
    staleTime: Number.POSITIVE_INFINITY,
  });
}
