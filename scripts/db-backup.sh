#!/usr/bin/env bash
# Dumps the MongoDB database in MONGODB_URI, encrypts it and writes to <out_dir>:
#   lion-shop-<timestamp>.archive.enc   encrypted mongodump archive (safe to store publicly)
#   lion-shop-<timestamp>.json          metadata: database name, document counts, sha256
#
# Usage: MONGODB_URI=... BACKUP_PASSPHRASE=... scripts/db-backup.sh [out_dir]
set -euo pipefail

: "${MONGODB_URI:?MONGODB_URI is required}"
: "${BACKUP_PASSPHRASE:?BACKUP_PASSPHRASE is required}"
[ "${#BACKUP_PASSPHRASE}" -ge 16 ] || { echo "BACKUP_PASSPHRASE must be at least 16 characters" >&2; exit 1; }
OUT_DIR="${1:-backups}"
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"

command -v mongodump >/dev/null || { echo "mongodump not found, install MongoDB Database Tools" >&2; exit 1; }

DB_NAME="$(node -e '
  const m = process.env.MONGODB_URI.match(/^mongodb(?:\+srv)?:\/\/[^/]+\/([^?]+)/);
  if (!m) { console.error("MONGODB_URI must include the database name, e.g. ...mongodb.net/lion-shop-purchase?..."); process.exit(1); }
  console.log(decodeURIComponent(m[1]));
')"

STAMP="$(date -u +%Y-%m-%dT%H%M%SZ)"
BASE="lion-shop-${STAMP}"
WORK="$(mktemp -d)"
trap 'rm -rf "$WORK"' EXIT
mkdir -p "$OUT_DIR"

echo "Dumping database \"$DB_NAME\"..."
# The plain archive only ever lives in the temp dir, which is removed on exit
mongodump --uri="$MONGODB_URI" --archive="$WORK/dump.archive" --gzip 2>"$WORK/dump.log" || {
  cat "$WORK/dump.log" >&2
  exit 1
}

if [ ! -s "$WORK/dump.archive" ]; then
  echo "Dump is empty, aborting" >&2
  exit 1
fi

echo "Encrypting..."
node "$SCRIPT_DIR/backup-crypto.mjs" encrypt "$WORK/dump.archive" "$OUT_DIR/$BASE.archive.enc"

# Metadata holds only names and counts, never documents
DB_NAME="$DB_NAME" FILE="$OUT_DIR/$BASE.archive.enc" LOG="$WORK/dump.log" OUT="$OUT_DIR/$BASE.json" \
  MONGODUMP_VERSION="$(mongodump --version | head -1)" node -e '
  const fs = require("node:fs");
  const { createHash } = require("node:crypto");
  const { DB_NAME, FILE, LOG, OUT, MONGODUMP_VERSION } = process.env;
  const collections = {};
  for (const [, name, count] of fs.readFileSync(LOG, "utf8").matchAll(/done dumping `?[^.\s`]+\.([^\s`]+)`? \((\d+) documents?\)/g)) {
    collections[name] = Number(count);
  }
  const data = fs.readFileSync(FILE);
  const meta = {
    format: 1,
    createdAt: new Date().toISOString(),
    database: DB_NAME,
    file: require("node:path").basename(FILE),
    bytes: data.length,
    sha256: createHash("sha256").update(data).digest("hex"),
    collections,
    tool: MONGODUMP_VERSION,
  };
  fs.writeFileSync(OUT, JSON.stringify(meta, null, 2) + "\n");
  console.log(`Backup ready: ${meta.file} (${(meta.bytes / 1024).toFixed(1)} KB)`);
  for (const [name, count] of Object.entries(collections)) console.log(`  ${name}: ${count}`);
  if (process.env.GITHUB_STEP_SUMMARY) {
    const rows = Object.entries(collections).map(([n, c]) => `| ${n} | ${c} |`).join("\n");
    fs.appendFileSync(process.env.GITHUB_STEP_SUMMARY,
      `### Database backup \`${meta.file}\`\n\nDatabase: \`${DB_NAME}\` · ${(meta.bytes / 1024).toFixed(1)} KB · sha256 \`${meta.sha256.slice(0, 16)}…\`\n\n| Collection | Documents |\n| --- | --- |\n${rows}\n`);
  }
'
