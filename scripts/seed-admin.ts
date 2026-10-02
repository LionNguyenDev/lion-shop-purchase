/**
 * Creates the admin account from ADMIN_* env vars, or promotes it to admin if it already exists.
 * Usage: pnpm seed:admin
 */
import { auth } from '@/server/auth';
import { connectDB } from '@/server/db/mongoose';
import { User } from '@/server/models/user';
import mongoose from 'mongoose';

async function main() {
  const name = process.env.ADMIN_NAME || 'Admin';
  const email = process.env.ADMIN_EMAIL?.trim().toLowerCase();
  const password = process.env.ADMIN_PASSWORD;
  if (!email || !password) throw new Error('Set ADMIN_EMAIL and ADMIN_PASSWORD in .env first');

  await connectDB();
  const existing = await User.findOne({ email });
  if (!existing) {
    await auth.api.signUpEmail({
      body: {
        name,
        email,
        password,
        phone: process.env.ADMIN_PHONE || '0900000000',
        facebookUrl: process.env.ADMIN_FACEBOOK_URL || 'https://facebook.com/admin',
      },
    });
    console.info(`Created account ${email}`);
  }
  await User.updateOne({ email }, { $set: { role: 'admin' } });
  console.info(`${email} is now an admin`);
}

main()
  .catch((error) => {
    console.error(error);
    process.exitCode = 1;
  })
  .finally(() => mongoose.disconnect().then(() => process.exit()));
