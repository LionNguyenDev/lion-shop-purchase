'use client';

import { useAddToCart } from '@/api/shop';
import { ROUTES } from '@/lib/routes';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';

export function useAddToCartWithToast() {
  const router = useRouter();
  const mutation = useAddToCart();

  const add = async (productId: string, quantity = 1) => {
    try {
      await mutation.mutateAsync({ productId, quantity });
      toast.success('Đã thêm vào giỏ hàng', { action: { label: 'Xem giỏ', onClick: () => router.push(ROUTES.CART) } });
      return true;
    } catch (error) {
      toast.error((error as Error).message);
      return false;
    }
  };

  return { add, isPending: mutation.isPending, pendingId: mutation.variables?.productId };
}
