import { adminUserUpdateSchema } from '@/lib/validations';
import { notFound, parseBody, route } from '@/server/http';
import { User } from '@/server/models/user';
import { requireAdmin } from '@/server/session';
import { isValidObjectId } from 'mongoose';

/** Revokes a user's shop access; they must enter the shop password again. */
export const PATCH = route<{ id: string }>(async (req, { params }) => {
  await requireAdmin();
  const { id } = await params;
  await parseBody(req, adminUserUpdateSchema);
  if (!isValidObjectId(id)) throw notFound('Không tìm thấy người dùng');
  const result = await User.updateOne({ _id: id }, { $set: { shopAccessAt: null } });
  if (result.matchedCount === 0) throw notFound('Không tìm thấy người dùng');
  return { success: true };
});
