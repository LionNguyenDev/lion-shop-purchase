import { phoneVariants, registerSchema } from '@/lib/validations';
import { betterAuth } from 'better-auth';
import { mongodbAdapter } from 'better-auth/adapters/mongodb';
import { APIError, createAuthMiddleware } from 'better-auth/api';
import { nextCookies } from 'better-auth/next-js';
import { emailOTP } from 'better-auth/plugins';
import { after } from 'next/server';
import { mongoDb } from './db/mongo-client';
import { serverEnv } from './env';
import { sendPasswordResetOtp } from './mail';

const OTP_EXPIRES_IN_SECONDS = 10 * 60;

export const auth = betterAuth({
  appName: 'Lion Shopping',
  baseURL: serverEnv.authUrl,
  secret: serverEnv.authSecret,
  // Transactions need a replica set; a local standalone mongod does not have one
  database: mongodbAdapter(mongoDb, { transaction: false }),
  emailAndPassword: {
    enabled: true,
    minPasswordLength: 8,
    maxPasswordLength: 128,
    autoSignIn: true,
    revokeSessionsOnPasswordReset: true,
  },
  advanced: {
    // Better Auth hands slow work (OTP mail) to this handler instead of awaiting it, so response
    // time does not reveal whether an email exists. The promise is already running; after() only
    // keeps a Vercel function alive until it settles.
    backgroundTasks: {
      handler: (promise) => {
        try {
          after(promise);
        } catch {
          // Outside a request scope (scripts): the promise still runs on its own
        }
      },
    },
  },
  // Stored in MongoDB: in-memory counters reset on every new serverless instance
  rateLimit: { storage: 'database' },
  session: {
    expiresIn: 60 * 60 * 24 * 30,
    updateAge: 60 * 60 * 24,
  },
  user: {
    additionalFields: {
      // Optional at the schema level so a future Google sign-up works; email sign-up enforces them below
      phone: { type: 'string', required: false },
      facebookUrl: { type: 'string', required: false },
      role: { type: 'string', required: false, defaultValue: 'user', input: false },
      shopAccessAt: { type: 'date', required: false, input: false },
    },
  },
  socialProviders:
    serverEnv.google.clientId && serverEnv.google.clientSecret
      ? { google: { clientId: serverEnv.google.clientId, clientSecret: serverEnv.google.clientSecret } }
      : undefined,
  hooks: {
    before: createAuthMiddleware(async (ctx) => {
      // There is no profile page, and letting /update-user change the phone would bypass the uniqueness check
      if (ctx.path === '/update-user' && ctx.body && 'phone' in ctx.body) {
        throw new APIError('BAD_REQUEST', { message: 'Không thể đổi số điện thoại' });
      }
      if (ctx.path !== '/sign-up/email') return;
      const result = registerSchema.safeParse({ ...ctx.body, confirmPassword: ctx.body?.password });
      if (!result.success) {
        throw new APIError('BAD_REQUEST', { message: result.error.issues[0]?.message ?? 'Dữ liệu không hợp lệ' });
      }
      // Better Auth already rejects a taken email (USER_ALREADY_EXISTS); phones are ours to check.
      // Both spellings are matched in case an older record was saved as +84...
      const taken = await mongoDb
        .collection('user')
        .findOne({ phone: { $in: phoneVariants(result.data.phone) } }, { projection: { _id: 1 } });
      if (taken) {
        throw new APIError('BAD_REQUEST', {
          message: 'Số điện thoại này đã được đăng ký',
          code: 'PHONE_ALREADY_EXISTS',
        });
      }
    }),
  },
  plugins: [
    emailOTP({
      otpLength: 6,
      expiresIn: OTP_EXPIRES_IN_SECONDS,
      allowedAttempts: 5,
      storeOTP: 'hashed',
      async sendVerificationOTP({ email, otp, type }) {
        if (type !== 'forget-password') return;
        await sendPasswordResetOtp(email, otp, OTP_EXPIRES_IN_SECONDS / 60);
      },
    }),
    nextCookies(),
  ],
});

export type AuthSession = typeof auth.$Infer.Session;
