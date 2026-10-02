import { type NextRequest, NextResponse } from 'next/server';
import { ZodError, type z } from 'zod';
import { connectDB } from './db/mongoose';

export class HttpError extends Error {
  constructor(
    public status: number,
    message: string
  ) {
    super(message);
  }
}

export const badRequest = (message: string) => new HttpError(400, message);
export const unauthorized = (message = 'Vui lòng đăng nhập') => new HttpError(401, message);
export const forbidden = (message = 'Bạn không có quyền thực hiện thao tác này') => new HttpError(403, message);
export const notFound = (message = 'Không tìm thấy dữ liệu') => new HttpError(404, message);
export const conflict = (message: string) => new HttpError(409, message);

type RouteContext<P> = { params: Promise<P> };

/** Wraps a route handler: connects to MongoDB, serializes the result and maps errors to JSON responses. */
export function route<P = Record<string, never>>(fn: (req: NextRequest, ctx: RouteContext<P>) => Promise<unknown>) {
  return async (req: NextRequest, ctx: RouteContext<P>) => {
    try {
      await connectDB();
      const data = await fn(req, ctx);
      if (data instanceof Response) return data;
      return NextResponse.json(data ?? { success: true });
    } catch (error) {
      if (error instanceof HttpError) {
        return NextResponse.json({ message: error.message }, { status: error.status });
      }
      if (error instanceof ZodError) {
        return NextResponse.json(
          { message: error.issues[0]?.message ?? 'Dữ liệu không hợp lệ', issues: error.issues },
          { status: 400 }
        );
      }
      console.error('[api]', req.method, req.nextUrl.pathname, error);
      return NextResponse.json({ message: 'Đã có lỗi xảy ra, vui lòng thử lại' }, { status: 500 });
    }
  };
}

export async function parseBody<S extends z.ZodType>(req: NextRequest, schema: S): Promise<z.output<S>> {
  const body = await req.json().catch(() => {
    throw badRequest('Body không hợp lệ');
  });
  return schema.parse(body);
}

export function parseQuery<S extends z.ZodType>(req: NextRequest, schema: S): z.output<S> {
  const params = Object.fromEntries([...req.nextUrl.searchParams.entries()].filter(([, value]) => value !== ''));
  return schema.parse(params);
}

export function paginate(total: number, page: number, limit: number) {
  return { total, page, limit, totalPages: Math.max(1, Math.ceil(total / limit)) };
}
