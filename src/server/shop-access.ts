import { hashPassword, symmetricDecrypt, symmetricEncrypt, verifyPassword } from 'better-auth/crypto';
import { connectDB } from './db/mongoose';
import { serverEnv } from './env';
import { HttpError } from './http';
import { Setting } from './models/setting';
import { User } from './models/user';

const SHOP_KEY = 'shop';
const MAX_ATTEMPTS = 5;
const ATTEMPT_WINDOW_MS = 15 * 60 * 1000;

export async function getShopSettings() {
  await connectDB();
  return Setting.findOne({ key: SHOP_KEY });
}

type ShopSettings = Awaited<ReturnType<typeof getShopSettings>>;

/** Pass `preloaded` settings when checking many users at once. */
export async function hasShopAccess(
  user: { role?: string | null; shopAccessAt?: Date | string | null },
  preloaded?: ShopSettings
) {
  if (user.role === 'admin') return true;
  if (!user.shopAccessAt) return false;
  const settings = preloaded === undefined ? await getShopSettings() : preloaded;
  if (!settings?.shopPasswordHash) return false;
  const validAfter = settings.shopAccessValidAfter;
  return !validAfter || new Date(user.shopAccessAt) >= validAfter;
}

export type UnlockResult = { ok: true } | { ok: false; reason: 'not_configured' | 'wrong_password' | 'rate_limited' };

export async function unlockShop(userId: string, password: string): Promise<UnlockResult> {
  // Attempts live on the user document so the limit holds across serverless instances
  const now = new Date();
  const user = await User.findById(userId, 'shopAttempts shopAttemptsResetAt');
  const windowActive = Boolean(user?.shopAttemptsResetAt && user.shopAttemptsResetAt > now);
  if (windowActive && (user?.shopAttempts ?? 0) >= MAX_ATTEMPTS) return { ok: false, reason: 'rate_limited' };

  const settings = await getShopSettings();
  if (!settings?.shopPasswordHash) return { ok: false, reason: 'not_configured' };

  const valid = await verifyPassword({ hash: settings.shopPasswordHash, password });
  if (!valid) {
    await User.updateOne(
      { _id: userId },
      windowActive
        ? { $inc: { shopAttempts: 1 } }
        : { $set: { shopAttempts: 1, shopAttemptsResetAt: new Date(now.getTime() + ATTEMPT_WINDOW_MS) } }
    );
    return { ok: false, reason: 'wrong_password' };
  }

  await User.updateOne({ _id: userId }, { $set: { shopAccessAt: now, shopAttempts: 0, shopAttemptsResetAt: null } });
  return { ok: true };
}

/** Saves a new shop password. Every customer who unlocked the shop before must enter the new one. */
export async function setShopPassword(password: string) {
  await connectDB();
  const now = new Date();
  const update = {
    shopPasswordHash: await hashPassword(password),
    shopPasswordEncrypted: await symmetricEncrypt({ key: encryptionKey(), data: password }),
    shopPasswordUpdatedAt: now,
    shopAccessValidAfter: now,
  };
  await Setting.updateOne({ key: SHOP_KEY }, { $set: update }, { upsert: true });
}

function encryptionKey() {
  if (!serverEnv.authSecret) throw new HttpError(500, 'Thiếu BETTER_AUTH_SECRET trong .env');
  return serverEnv.authSecret;
}

export type RevealResult =
  | { password: string }
  | { password: null; reason: 'not_configured' | 'legacy' | 'undecryptable' };

/** Decrypts the current shop password for admins. */
export async function revealShopPassword(): Promise<RevealResult> {
  const settings = await getShopSettings();
  if (!settings?.shopPasswordHash) return { password: null, reason: 'not_configured' };
  // Set before encrypted storage existed: only the hash is known
  if (!settings.shopPasswordEncrypted) return { password: null, reason: 'legacy' };
  try {
    return { password: await symmetricDecrypt({ key: encryptionKey(), data: settings.shopPasswordEncrypted }) };
  } catch {
    // BETTER_AUTH_SECRET changed since the password was saved
    return { password: null, reason: 'undecryptable' };
  }
}
