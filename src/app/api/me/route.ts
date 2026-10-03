import { route } from '@/server/http';
import { getMe } from '@/server/me';

export const GET = route(getMe);
