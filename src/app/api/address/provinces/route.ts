import { getProvinces } from '@/server/address';
import { route } from '@/server/http';
import { requireUser } from '@/server/session';

export const GET = route(async () => {
  await requireUser();
  return getProvinces();
});
