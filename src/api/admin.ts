import type { CategoryInput, OrderStatus, ProductInput, ShopPasswordInput } from '@/lib/validations';
import { keepPreviousData, useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { client } from './client';
import { queryKeys } from './query-keys';
import type {
  AdminCategory,
  AdminStats,
  AdminUser,
  Order,
  Paginated,
  Product,
  RevealedShopPassword,
  ShopSettings,
} from './types';

type ListParams = { q?: string; page?: number; limit?: number };

function useAdminMutation<T, R = unknown>(request: (input: T) => Promise<R>) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: request,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.admin.all });
      queryClient.invalidateQueries({ queryKey: ['products'] });
      queryClient.invalidateQueries({ queryKey: queryKeys.categories });
    },
  });
}

export function useAdminStats() {
  return useQuery({
    queryKey: queryKeys.admin.stats,
    queryFn: async () => (await client.get<AdminStats>('/admin/stats')).data,
  });
}

export function useAdminUsers(params: ListParams) {
  return useQuery({
    queryKey: queryKeys.admin.users(params),
    queryFn: async () => (await client.get<Paginated<AdminUser>>('/admin/users', { params })).data,
    placeholderData: keepPreviousData,
  });
}

export const useRevokeShopAccess = () =>
  useAdminMutation(async (id: string) => (await client.patch(`/admin/users/${id}`, { shopAccess: false })).data);

export function useAdminCategories() {
  return useQuery({
    queryKey: queryKeys.admin.categories,
    queryFn: async () => (await client.get<AdminCategory[]>('/admin/categories')).data,
  });
}

export const useSaveCategory = () =>
  useAdminMutation(async ({ id, ...input }: CategoryInput & { id?: string }) =>
    id
      ? (await client.patch(`/admin/categories/${id}`, input)).data
      : (await client.post('/admin/categories', input)).data
  );

export const useDeleteCategory = () =>
  useAdminMutation(async (id: string) => (await client.delete(`/admin/categories/${id}`)).data);

export function useAdminProducts(params: ListParams & { category?: string; visibility?: string }) {
  return useQuery({
    queryKey: queryKeys.admin.products(params),
    queryFn: async () => (await client.get<Paginated<Product>>('/admin/products', { params })).data,
    placeholderData: keepPreviousData,
  });
}

export const useSaveProduct = () =>
  useAdminMutation(async ({ id, ...input }: ProductInput & { id?: string }) =>
    id
      ? (await client.patch<Product>(`/admin/products/${id}`, input)).data
      : (await client.post<Product>('/admin/products', input)).data
  );

export const useSetProductVisibility = () =>
  useAdminMutation(
    async ({ id, isVisible }: { id: string; isVisible: boolean }) =>
      (await client.patch<Product>(`/admin/products/${id}`, { isVisible })).data
  );

export const useDeleteProduct = () =>
  useAdminMutation(async (id: string) => (await client.delete(`/admin/products/${id}`)).data);

export function useAdminOrders(params: ListParams & { status?: OrderStatus }) {
  return useQuery({
    queryKey: queryKeys.admin.orders(params),
    queryFn: async () => (await client.get<Paginated<Order>>('/admin/orders', { params })).data,
    placeholderData: keepPreviousData,
  });
}

export function useAdminOrder(id: string | null) {
  return useQuery({
    queryKey: queryKeys.admin.order(id ?? ''),
    queryFn: async () => (await client.get<Order>(`/admin/orders/${id}`)).data,
    enabled: Boolean(id),
  });
}

export const useUpdateOrderStatus = () =>
  useAdminMutation(
    async ({ id, status }: { id: string; status: OrderStatus }) =>
      (await client.patch<Order>(`/admin/orders/${id}`, { status })).data
  );

export function useShopSettings() {
  return useQuery({
    queryKey: queryKeys.admin.settings,
    queryFn: async () => (await client.get<ShopSettings>('/admin/settings')).data,
  });
}

/** Fetched only while the admin has the password revealed, and never kept in cache. */
export function useRevealShopPassword(enabled: boolean) {
  return useQuery({
    queryKey: queryKeys.admin.shopPassword,
    queryFn: async () => (await client.get<RevealedShopPassword>('/admin/settings/shop-password')).data,
    enabled,
    staleTime: 0,
    gcTime: 0,
  });
}

export const useSaveShopPassword = () =>
  useAdminMutation(async (input: ShopPasswordInput) => (await client.put('/admin/settings', input)).data);
