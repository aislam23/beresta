#!/usr/bin/env bash
# Делает выбранный дубль кадром: scripts/pick-take.sh <shot-id> <номер-дубля>
set -euo pipefail
ROOT="$(cd "$(dirname "$0")/.." && pwd)"
SRC="$ROOT/src/assets/photos/takes/${1:?id}.take-${2:?номер}.png"
[ -f "$SRC" ] || { echo "Нет файла $SRC" >&2; exit 1; }
cp "$SRC" "$ROOT/src/assets/photos/$1.png"
echo "src/assets/photos/$1.png"
