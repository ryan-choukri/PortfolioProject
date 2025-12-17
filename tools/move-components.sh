#!/usr/bin/env bash
set -e
ROOT="$(cd "$(dirname "$0")/.." && pwd)"
cd "$ROOT"

# ...existing code...
# Usage:
#   ./tools/move-components.sh --create-root                -> create ./components at repo root
#   ./tools/move-components.sh --create-root <src>         -> create root ./components then move <src> -> app/components
#   ./tools/move-components.sh <src>                       -> move <src> -> app/components
# ...existing code...

# handle optional flag to create components at repo root
if [ "$1" = "--create-root" ]; then
  mkdir -p "$ROOT/components"
  echo "Dossier créé: $ROOT/components"
  # if no further arg, exit successfully
  if [ -z "$2" ]; then
    exit 0
  fi
  # shift so $1 becomes the source path if provided
  shift
fi

SRC_ARG="$1"
if [ -z "$SRC_ARG" ]; then
  echo "Usage: $0 [--create-root] <source-components-path>  (ex: ./components or ./src/components)"
  exit 1
fi

SRC="$SRC_ARG"
DST="app/components"

if [ ! -d "$SRC" ]; then
  echo "Source folder '$SRC' introuvable dans $ROOT"
  exit 1
fi

mkdir -p "$(dirname "$DST")"

if git rev-parse --is-inside-work-tree >/dev/null 2>&1; then
  git mv "$SRC" "$DST" || mv "$SRC" "$DST"
else
  mv "$SRC" "$DST"
fi

echo "Mise à jour des imports dans les fichiers source..."
find . -type f \( -name "*.ts" -o -name "*.tsx" -o -name "*.js" -o -name "*.jsx" \) \
  -not -path "./node_modules/*" -not -path "./.next/*" -not -path "./.git/*" -print0 \
  | while IFS= read -r -d '' file; do
    perl -0777 -pe \
    "s{(['\"])components/}{$1app/components/}g;
     s{(['\"])\\./components/}{$1./app/components/}g;
     s{(['\"])\\../components/}{$1../app/components/}g;
     s{(['\"])@/components/}{$1app/components/}g" \
    -i.bak "$file" && rm -f "$file.bak"
done

echo "Terminé. Exécuter :"
echo "  npx tsc --noEmit"
echo "  npm run dev"