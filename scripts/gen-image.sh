#!/usr/bin/env bash
# Генерирует один дубль кадра через Codex.
# Использование: scripts/gen-image.sh <shot-id> [номер-дубля] [доп. референс...]
# Доп. референсы прикладываются после эталона 01-hero; что с ними делать, пишем в описании кадра.
set -euo pipefail

ID="${1:?Укажите id кадра, например 01-hero}"
TAKE="${2:-1}"
shift $(( $# < 2 ? $# : 2 ))
ROOT="$(cd "$(dirname "$0")/.." && pwd)"

BIBLE="$(sed -n '/<!-- bible:start -->/,/<!-- bible:end -->/p' "$ROOT/docs/images/building-bible.md" | sed '1d;$d')"
SCENE="$(awk -v id="## $ID" '$0 == id {f = 1; next} /^## / {f = 0} f' "$ROOT/docs/images/shots.md")"
[ -n "$SCENE" ] || { echo "Нет кадра $ID в docs/images/shots.md" >&2; exit 1; }

OUT_DIR="$ROOT/src/assets/photos/takes"
mkdir -p "$OUT_DIR"
OUT="$OUT_DIR/$ID.take-$TAKE.png"

REF_ARGS=()
REF_NOTE=""
if [ "$ID" != "01-hero" ]; then
  REF="$ROOT/src/assets/photos/01-hero.png"
  [ -f "$REF" ] || { echo "Сначала нужен утверждённый эталон src/assets/photos/01-hero.png" >&2; exit 1; }
  REF_ARGS=(-i "$REF")
  for EXTRA in "$@"; do
    [ -f "$EXTRA" ] || { echo "Нет референса $EXTRA" >&2; exit 1; }
    REF_ARGS+=(-i "$EXTRA")
  done
  REF_NOTE="Use the first attached image as the exact reference for the buildings: same number of buildings, same floor counts (9, 12, 14), same facade materials, colours and window rhythm. Do not invent new buildings."
fi

PROMPT="Generate exactly one photorealistic image with your image generation tool, landscape 1536x1024. Do not write or run code.
$REF_NOTE
BUILDINGS (never change): $BIBLE
SCENE: $SCENE
When the image is ready, save it as a PNG file to: $OUT"

MARK="$(mktemp)"
trap 'rm -f "$MARK"' EXIT

codex exec --skip-git-repo-check -s workspace-write -C "$ROOT" ${REF_ARGS[@]+"${REF_ARGS[@]}"} -- "$PROMPT" < /dev/null

if [ ! -f "$OUT" ]; then
  NEW="$(find "$HOME/.codex/generated_images" -type f -name '*.png' -newer "$MARK" -exec ls -t {} + 2>/dev/null | head -1 || true)"
  [ -n "$NEW" ] || { echo "Codex не вернул картинку" >&2; exit 1; }
  cp "$NEW" "$OUT"
fi
echo "$OUT"
