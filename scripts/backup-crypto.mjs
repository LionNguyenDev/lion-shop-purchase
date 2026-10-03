#!/usr/bin/env node
/**
 * Encrypts / decrypts database backups with a passphrase (AES-256-GCM, key from scrypt).
 * Plain Node so a backup made on the GitHub runner decrypts the same way on macOS or Windows.
 *
 *   BACKUP_PASSPHRASE=... node scripts/backup-crypto.mjs encrypt <input> <output>
 *   BACKUP_PASSPHRASE=... node scripts/backup-crypto.mjs decrypt <input> <output>
 *
 * File layout: MAGIC(6) | salt(16) | iv(12) | ciphertext | authTag(16)
 */
import { createCipheriv, createDecipheriv, randomBytes, scryptSync } from 'node:crypto';
import {
  appendFileSync,
  closeSync,
  createReadStream,
  createWriteStream,
  openSync,
  readSync,
  rmSync,
  statSync,
  writeFileSync,
} from 'node:fs';
import { pipeline } from 'node:stream/promises';

const MAGIC = Buffer.from('LSBAK1');
const SALT_LEN = 16;
const IV_LEN = 12;
const TAG_LEN = 16;
const HEADER_LEN = MAGIC.length + SALT_LEN + IV_LEN;
const SCRYPT = { N: 2 ** 15, r: 8, p: 1, maxmem: 64 * 1024 * 1024 };

function deriveKey(passphrase, salt) {
  return scryptSync(passphrase, salt, 32, SCRYPT);
}

function readBytes(file, position, length) {
  const fd = openSync(file, 'r');
  try {
    const buffer = Buffer.alloc(length);
    readSync(fd, buffer, 0, length, position);
    return buffer;
  } finally {
    closeSync(fd);
  }
}

async function encrypt(input, output, passphrase) {
  const salt = randomBytes(SALT_LEN);
  const iv = randomBytes(IV_LEN);
  const cipher = createCipheriv('aes-256-gcm', deriveKey(passphrase, salt), iv);
  writeFileSync(output, Buffer.concat([MAGIC, salt, iv]));
  await pipeline(createReadStream(input), cipher, createWriteStream(output, { flags: 'a' }));
  appendFileSync(output, cipher.getAuthTag());
}

async function decrypt(input, output, passphrase) {
  const size = statSync(input).size;
  if (size < HEADER_LEN + TAG_LEN) throw new Error('File is too small to be a backup');
  const header = readBytes(input, 0, HEADER_LEN);
  if (!header.subarray(0, MAGIC.length).equals(MAGIC)) throw new Error('Not a Lion Shopping backup file');
  const salt = header.subarray(MAGIC.length, MAGIC.length + SALT_LEN);
  const iv = header.subarray(MAGIC.length + SALT_LEN);
  const tag = readBytes(input, size - TAG_LEN, TAG_LEN);

  const decipher = createDecipheriv('aes-256-gcm', deriveKey(passphrase, salt), iv);
  decipher.setAuthTag(tag);
  try {
    await pipeline(
      createReadStream(input, { start: HEADER_LEN, end: size - TAG_LEN - 1 }),
      decipher,
      createWriteStream(output)
    );
  } catch (error) {
    rmSync(output, { force: true });
    // GCM verifies the whole file at the end: a wrong passphrase or a corrupted file fails here
    throw new Error(`Decryption failed: wrong BACKUP_PASSPHRASE or corrupted file (${error.message})`);
  }
}

const [mode, input, output] = process.argv.slice(2);
const passphrase = process.env.BACKUP_PASSPHRASE;

if (!['encrypt', 'decrypt'].includes(mode) || !input || !output) {
  console.error('Usage: BACKUP_PASSPHRASE=... node scripts/backup-crypto.mjs <encrypt|decrypt> <input> <output>');
  process.exit(2);
}
if (!passphrase || passphrase.length < 16) {
  console.error('BACKUP_PASSPHRASE is missing or shorter than 16 characters');
  process.exit(2);
}

try {
  await (mode === 'encrypt' ? encrypt : decrypt)(input, output, passphrase);
} catch (error) {
  console.error(error.message);
  process.exit(1);
}
