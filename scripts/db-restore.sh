#!/usr/bin/env bash
# Restores an encrypted backup into the database in RESTORE_MONGODB_URI.
# Collections that exist in the backup are DROPPED and replaced in the target database.
#
# Usage: RESTORE_MONGODB_URI=... BACKUP_PASSPHRASE=... scripts/db-restore.sh <backup.archive.enc>
#   The metadata file (<same name>.json) next to the backup tells which database was dumped.
#   Set CONFIRM_RESTORE=RESTORE to skip the interactive confirmation (used by GitHub Actions).
set -euo pipefail

: "${RESTORE_MONGODB_URI:?RESTORE_MONGODB_URI is required (the database to restore into)}"
: "${BACKUP_PASSPHRASE:?BACKUP_PASSPHRASE is required}"
BACKUP="${1:?Usage: scripts/db-restore.sh <backup.archive.enc>}"
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
META="${BACKUP%.archive.enc}.json"

command -v mongorestore >/dev/null || { echo "mongorestore not found, install MongoDB Database Tools" >&2; exit 1; }
[ -f "$BACKUP" ] || { echo "Backup file not found: $BACKUP" >&2; exit 1; }

# Split the target URI into the database name and a URI without it, so the backup's
# namespaces can be renamed into whatever database the new cluster uses
read -r TARGET_DB TARGET_URI < <(node -e '
  const uri = process.env.RESTORE_MONGODB_URI;
  const m = uri.match(/^(mongodb(?:\+srv)?:\/\/[^/]+)\/([^?]+)(\?.*)?$/);
  if (!m) { console.error("RESTORE_MONGODB_URI must include the database name, e.g. ...mongodb.net/lion-shop-purchase?..."); process.exit(1); }
  console.log(decodeURIComponent(m[2]), `${m[1]}/${m[3] ?? ""}`);
')
[ -n "${TARGET_DB:-}" ] || exit 1

if [ -f "$META" ]; then
  SOURCE_DB="$(node -e 'console.log(require(process.argv[1]).database)' "$(cd "$(dirname "$META")" && pwd)/$(basename "$META")")"
  if command -v shasum >/dev/null; then ACTUAL_SHA="$(shasum -a 256 "$BACKUP" | cut -d' ' -f1)"; else ACTUAL_SHA="$(sha256sum "$BACKUP" | cut -d' ' -f1)"; fi
  EXPECTED_SHA="$(node -e 'console.log(require(process.argv[1]).sha256)' "$(cd "$(dirname "$META")" && pwd)/$(basename "$META")")"
  [ "$ACTUAL_SHA" = "$EXPECTED_SHA" ] || { echo "Checksum mismatch: the backup file is corrupted" >&2; exit 1; }
else
  SOURCE_DB="${SOURCE_DB:-lion-shop-purchase}"
  echo "No metadata file found, assuming the backup came from database \"$SOURCE_DB\" (override with SOURCE_DB=...)"
fi

echo "Restore \"$SOURCE_DB\" from $(basename "$BACKUP") into database \"$TARGET_DB\"."
echo "Collections in the backup will be DROPPED and replaced in \"$TARGET_DB\"."
if [ "${CONFIRM_RESTORE:-}" != "RESTORE" ]; then
  read -r -p 'Type RESTORE to continue: ' answer
  [ "$answer" = "RESTORE" ] || { echo "Cancelled"; exit 1; }
fi

WORK="$(mktemp -d)"
trap 'rm -rf "$WORK"' EXIT
node "$SCRIPT_DIR/backup-crypto.mjs" decrypt "$BACKUP" "$WORK/dump.archive"

mongorestore --uri="$TARGET_URI" --archive="$WORK/dump.archive" --gzip --drop \
  --nsInclude="${SOURCE_DB}.*" --nsFrom="${SOURCE_DB}.*" --nsTo="${TARGET_DB}.*"

echo "Restore finished into \"$TARGET_DB\"."
