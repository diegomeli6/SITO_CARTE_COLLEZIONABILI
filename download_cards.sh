#!/usr/bin/env bash
# download_cards.sh
# Downloads card images from Scryfall (Magic) and Pokémon TCG API.
# Run from the project root: bash download_cards.sh
#
# APIs used:
#   Scryfall   — https://scryfall.com/docs/api       (no key needed, 100ms between calls)
#   Pokémon TCG — https://docs.pokemontcg.io/api-reference (no key needed, 1000 req/day)

set -euo pipefail

ASSETS="$(cd "$(dirname "$0")" && pwd)/assets/cards"
mkdir -p "$ASSETS"

UA="CarteDaCollezione-ExamProject/1.0"
OK=0
FAIL=0

# ── Helpers ────────────────────────────────────────────────────────────────────

# scryfall_download <card_name> <set_code> <output_filename>
# Looks up a card by name+set on Scryfall and downloads its large image.
scryfall_download() {
  local name="$1" set_code="$2" fname="$3"
  local encoded_name
  encoded_name=$(python3 -c "import urllib.parse,sys; print(urllib.parse.quote(sys.argv[1]))" "$name" 2>/dev/null \
    || printf '%s' "$name" | sed 's/ /+/g')

  local api_url="https://api.scryfall.com/cards/named?fuzzy=${encoded_name}&set=${set_code}"

  echo "  [Scryfall] ${name} (${set_code})..."
  local json
  json=$(curl -sf -A "$UA" "$api_url") || { echo "    ✗ API error"; ((FAIL++)); sleep 0.15; return; }

  local img_url
  img_url=$(echo "$json" | jq -r '.image_uris.large // empty')
  if [[ -z "$img_url" ]]; then
    echo "    ✗ No image_uris.large in response"
    ((FAIL++)); sleep 0.15; return
  fi

  if curl -sf -A "$UA" -o "${ASSETS}/${fname}" "$img_url"; then
    echo "    ✓ ${fname}"; OK=$((OK+1))
  else
    echo "    ✗ Download failed"; FAIL=$((FAIL+1))
  fi
  sleep 0.15   # Scryfall rate-limit courtesy: ≥100ms between requests
}

# pokemon_download <tcg_api_query> <output_filename>
# Searches the Pokémon TCG API and downloads the large image of the first result.
pokemon_download() {
  local query="$1" fname="$2"
  local encoded_q
  encoded_q=$(python3 -c "import urllib.parse,sys; print(urllib.parse.quote(sys.argv[1]))" "$query" 2>/dev/null \
    || printf '%s' "$query" | sed 's/ /%20/g; s/:/\%3A/g; s/"/%22/g')

  local api_url="https://api.pokemontcg.io/v2/cards?q=${encoded_q}&pageSize=1&orderBy=-set.releaseDate"

  echo "  [Pokémon TCG] ${query}..."
  local json
  json=$(curl -sf -A "$UA" "$api_url") || { echo "    ✗ API error"; ((FAIL++)); sleep 0.15; return; }

  local img_url card_label
  img_url=$(echo "$json"  | jq -r '.data[0].images.large // empty')
  card_label=$(echo "$json" | jq -r '"\(.data[0].name) — \(.data[0].set.name)"')

  if [[ -z "$img_url" ]]; then
    echo "    ✗ No card found for query"
    ((FAIL++)); sleep 0.15; return
  fi

  if curl -sf -A "$UA" -o "${ASSETS}/${fname}" "$img_url"; then
    echo "    ✓ ${fname}  [${card_label}]"; OK=$((OK+1))
  else
    echo "    ✗ Download failed"; FAIL=$((FAIL+1))
  fi
  sleep 0.15
}

# ── Magic: The Gathering — Scryfall ────────────────────────────────────────────
echo ""
echo "══ Magic: The Gathering (Scryfall) ══"

scryfall_download "Black Lotus"                "lea"  "magic-black-lotus.jpg"
scryfall_download "Mox Sapphire"               "lea"  "magic-mox-sapphire.jpg"
scryfall_download "Ragavan, Nimble Pilferer"   "mh2"  "magic-ragavan.jpg"
scryfall_download "Ancestral Recall"           "lea"  "magic-ancestral-recall.jpg"

# ── Pokémon TCG API ────────────────────────────────────────────────────────────
echo ""
echo "══ Pokémon TCG API ══"

# Charizard — Base Set (set id base1, card number 4 = Holo Rare)
pokemon_download 'name:"Charizard" set.id:base1'              "pokemon-charizard.jpg"

# Blastoise — Base Set (card number 2 = Holo Rare)
pokemon_download 'name:"Blastoise" set.id:base1'              "pokemon-blastoise.jpg"

# Pikachu Illustrator — promo from Japanese illustrator contest (set: basep)
# Falls back to the promo without restricting set if not found
pokemon_download 'name:"Pikachu" set.id:basep'                "pokemon-pikachu-illustrator.jpg"

# Mewtwo-EX — Full Art (Rare Ultra) from Next Destinies (bw4), number 98
pokemon_download 'name:"Mewtwo-EX" set.id:bw4 number:98'     "pokemon-mewtwo-ex.jpg"

# ── Summary ────────────────────────────────────────────────────────────────────
echo ""
echo "══ Done: ${OK} downloaded, ${FAIL} failed ══"
echo "   Files saved to: ${ASSETS}/"
echo ""
ls -lh "${ASSETS}"/*.jpg 2>/dev/null || echo "   (no .jpg files)"
