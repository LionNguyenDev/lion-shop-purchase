import { route } from '@/server/http';
import { requireAdmin } from '@/server/session';
import { revealShopPassword } from '@/server/shop-access';
import { NextResponse } from 'next/server';

/** Returns the plain shop password, only when an admin explicitly asks to see it. */
export const GET = route(async () => {
  await requireAdmin();
  return NextResponse.json(await revealShopPassword(), { headers: { 'Cache-Control': 'no-store' } });
});
