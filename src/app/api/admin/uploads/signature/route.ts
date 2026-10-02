import { signImageUpload } from '@/server/cloudinary';
import { route } from '@/server/http';
import { requireAdmin } from '@/server/session';

export const POST = route(async () => {
  await requireAdmin();
  return signImageUpload();
});
