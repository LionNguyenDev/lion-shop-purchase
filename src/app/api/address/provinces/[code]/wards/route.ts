import { getWards } from '@/server/address';
import { badRequest, route } from '@/server/http';
import { requireUser } from '@/server/session';

export const GET = route<{ code: string }>(async (_req, { params }) => {
  await requireUser();
  const code = Number((await params).code);
  if (!Number.isInteger(code) || code <= 0) throw badRequest('Mã tỉnh/thành phố không hợp lệ');
  const { wards } = await getWards(code);
  return wards;
});
