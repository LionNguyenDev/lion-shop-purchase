import type { BadgeTone } from '@/components/ui/badge';
import type { OrderStatus } from './validations';

export const ORDER_STATUS_META: Record<OrderStatus, { label: string; tone: BadgeTone }> = {
  pending: { label: 'Chờ xác nhận', tone: 'accent' },
  confirmed: { label: 'Đã xác nhận', tone: 'info' },
  shipping: { label: 'Đang giao', tone: 'violet' },
  completed: { label: 'Hoàn thành', tone: 'primary' },
  cancelled: { label: 'Đã huỷ', tone: 'danger' },
};

/** Allowed status changes. Enforced by the server and used by the UI to show only valid actions. */
export const NEXT_ORDER_STATUSES: Record<OrderStatus, OrderStatus[]> = {
  pending: ['confirmed', 'cancelled'],
  confirmed: ['shipping', 'cancelled'],
  shipping: ['completed', 'cancelled'],
  completed: [],
  cancelled: [],
};
