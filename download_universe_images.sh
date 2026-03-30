#!/usr/bin/env bash
# download_universe_images.sh
# Downloads high-quality card images for the universe pages.
#
# APIs used:
#   Scryfall       — https://scryfall.com/docs/api         (no key, 100ms courtesy delay)
#   Pokémon TCG    — https://docs.pokemontcg.io            (no key, 1000 req/day free tier)
#   YGOPRODeck     — https://db.ygoprodeck.com/api-blog/   (no key, open CORS API)
#
# Run from the project root:  bash download_universe_images.sh

set -euo pipefail

BASE="$(cd "$(dirname "$0")" && pwd)/assets/universes"
UA="CarteDaCollezione-ExamProject/1.0"
OK=0; FAIL=0

mkdir -p "${BASE}/magic" "${BASE}/pokemon" "${BASE}/yugioh" \
         "${BASE}/sport"  "${BASE}/cuphead"

# ──────────────────────────────────────────────────────────────── Helpers ──────

# Download a single file; print ✓ or ✗ and update counters.
download_file() {
  local url="$1" dest="$2" label="$3"
  if curl -sf -A "$UA" --max-time 30 -o "$dest" "$url"; then
    local size; size=$(du -h "$dest" | cut -f1)
    echo "    ✓ $(basename "$dest")  [${label}]  (${size})"
    OK=$((OK + 1))
  else
    echo "    ✗ $(basename "$dest")  FAILED"
    FAIL=$((FAIL + 1))
    rm -f "$dest"   # remove empty/corrupt file
  fi
}

# Fetch a Magic card image from Scryfall by fuzzy name + set code.
scryfall() {
  local name="$1" set_code="$2" fname="$3"
  local encoded; encoded=$(printf '%s' "$name" | sed 's/ /+/g')
  local api="https://api.scryfall.com/cards/named?fuzzy=${encoded}&set=${set_code}"

  printf '  %-38s' "[Scryfall] ${name}"
  local json img_url
  json=$(curl -sf -A "$UA" --max-time 10 "$api") \
    || { echo "  API error"; FAIL=$((FAIL+1)); sleep 0.15; return; }
  img_url=$(printf '%s' "$json" | jq -r '.image_uris.large // empty')

  if [[ -z "$img_url" ]]; then
    echo "  no image_uris.large"
    FAIL=$((FAIL+1)); sleep 0.15; return
  fi
  download_file "$img_url" "${BASE}/magic/${fname}" "$(echo "$set_code" | tr '[:lower:]' '[:upper:]')"
  sleep 0.15   # Scryfall rate-limit: ≥100ms between requests
}

# Fetch a Pokémon card image from the Pokémon TCG API.
# $1 = pre-URL-encoded query string (field:value pairs)
# $2 = output filename, $3 = human label
pokemon_q() {
  local q="$1" fname="$2" label="$3"
  local api="https://api.pokemontcg.io/v2/cards?q=${q}&pageSize=1&orderBy=-set.releaseDate"

  printf '  %-38s' "[PokémonTCG] ${label}"
  local json img_url
  json=$(curl -sf -A "$UA" --max-time 15 "$api") \
    || { echo "  API error"; FAIL=$((FAIL+1)); sleep 0.15; return; }
  img_url=$(printf '%s' "$json" | jq -r '.data[0].images.large // empty')

  if [[ -z "$img_url" ]]; then
    echo "  not found"
    FAIL=$((FAIL+1)); sleep 0.15; return
  fi
  local card_label; card_label=$(printf '%s' "$json" | jq -r '"\(.data[0].name) — \(.data[0].set.name)"')
  download_file "$img_url" "${BASE}/pokemon/${fname}" "$card_label"
  sleep 0.15
}

# Fetch a card image directly by its Pokémon TCG card ID (e.g. "sv8-238").
pokemon_id() {
  local card_id="$1" fname="$2"
  local api="https://api.pokemontcg.io/v2/cards/${card_id}"

  printf '  %-38s' "[PokémonTCG] id:${card_id}"
  local json img_url name set_name
  json=$(curl -sf -A "$UA" --max-time 15 "$api") \
    || { echo "  API error"; FAIL=$((FAIL+1)); sleep 0.15; return; }
  img_url=$(printf  '%s' "$json" | jq -r '.data.images.large // empty')
  name=$(printf     '%s' "$json" | jq -r '.data.name // "?"')
  set_name=$(printf '%s' "$json" | jq -r '.data.set.name // "?"')

  if [[ -z "$img_url" ]]; then
    echo "  not found"
    FAIL=$((FAIL+1)); sleep 0.15; return
  fi
  download_file "$img_url" "${BASE}/pokemon/${fname}" "${name} — ${set_name}"
  sleep 0.15
}

# Fetch a Yūgiōh card image from YGOPRODeck by exact card name.
yugioh() {
  local name="$1" fname="$2"
  local encoded; encoded=$(printf '%s' "$name" | sed 's/ /%20/g; s/!/%21/g')
  local api="https://db.ygoprodeck.com/api/v7/cardinfo.php?name=${encoded}"

  printf '  %-38s' "[YGOPRODeck] ${name}"
  local json img_url
  json=$(curl -sf -A "$UA" --max-time 10 "$api") \
    || { echo "  API error"; FAIL=$((FAIL+1)); sleep 0.1; return; }
  img_url=$(printf '%s' "$json" | jq -r '.data[0].card_images[0].image_url // empty')

  if [[ -z "$img_url" ]]; then
    echo "  not found"
    FAIL=$((FAIL+1)); sleep 0.1; return
  fi
  download_file "$img_url" "${BASE}/yugioh/${fname}" "YGOPRODeck"
  sleep 0.1
}

# ─────────────────────────────────────────────── Magic: The Gathering ─────────
echo ""
echo "══ Magic: The Gathering  →  assets/universes/magic/ ══"
echo "   Source: Scryfall API (Limited Edition Alpha prints)"

scryfall "Black Lotus"      lea  "black-lotus.jpg"
scryfall "Mox Sapphire"     lea  "mox-sapphire.jpg"
scryfall "Ancestral Recall" lea  "ancestral-recall.jpg"
scryfall "Time Walk"        lea  "time-walk.jpg"
scryfall "Shivan Dragon"    lea  "shivan-dragon.jpg"
scryfall "Serra Angel"      lea  "serra-angel.jpg"

# ─────────────────────────────────────────────────────────── Pokémon ──────────
echo ""
echo "══ Pokémon TCG  →  assets/universes/pokemon/ ══"
echo "   Source: Pokémon TCG API"

# Base Set cards — set.id:base1
# Query encoding: name:"X" → name%3A%22X%22   set.id:Y → set.id%3AY   space → +
pokemon_q  'name%3A%22Charizard%22+set.id%3Abase1'  "charizard.jpg"   "Charizard (Base Set)"
pokemon_q  'name%3A%22Blastoise%22+set.id%3Abase1'  "blastoise.jpg"   "Blastoise (Base Set)"
pokemon_q  'name%3A%22Venusaur%22+set.id%3Abase1'   "venusaur.jpg"    "Venusaur (Base Set)"
pokemon_q  'name%3A%22Mewtwo%22+set.id%3Abase1'     "mewtwo.jpg"      "Mewtwo (Base Set)"
pokemon_q  'name%3A%22Gengar%22+set.id%3Abase3'     "gengar.jpg"      "Gengar (Fossil)"

# Pikachu Illustrator is not in the API — use the Special Illustration Rare
# Pikachu ex from Surging Sparks (sv8-238), the closest high-art equivalent.
pokemon_id "sv8-238" "pikachu-illustrator.jpg"

# ─────────────────────────────────────────────────────────── Yūgiōh ───────────
echo ""
echo "══ Yūgiōh  →  assets/universes/yugioh/ ══"
echo "   Source: YGOPRODeck API"

yugioh "Blue-Eyes White Dragon"   "blue-eyes-white-dragon.jpg"
yugioh "Dark Magician"            "dark-magician.jpg"
yugioh "Exodia the Forbidden One" "exodia.jpg"
yugioh "Slifer the Sky Dragon"    "slifer-the-sky-dragon.jpg"
yugioh "Black Luster Soldier"     "black-luster-soldier.jpg"

# ──────────────────────────────────────── Sport & Cuphead (no public API) ─────
echo ""
echo "══ Sport Cards & Cuphead ══"
echo "   No free public image API available — placeholder folders ready."
echo "   Drop images manually into:"
echo "     assets/universes/sport/    (mickey-mantle.jpg, lebron-james.jpg, ...)"
echo "     assets/universes/cuphead/  (cuphead.jpg, king-dice.jpg, ...)"

# ──────────────────────────────────────────────────────────── Summary ─────────
echo ""
echo "══ Done: ${OK} downloaded, ${FAIL} failed ══"
echo ""
for section in magic pokemon yugioh sport cuphead; do
  dir="${BASE}/${section}"
  count=$(find "$dir" -maxdepth 1 \( -name "*.jpg" -o -name "*.png" \) 2>/dev/null | wc -l | tr -d ' ')
  if [[ "$count" -gt 0 ]]; then
    echo "  assets/universes/${section}/  (${count} image(s)):"
    find "$dir" -maxdepth 1 \( -name "*.jpg" -o -name "*.png" \) | sort | while read -r f; do
      printf "    %-40s %s\n" "$(basename "$f")" "$(du -h "$f" | cut -f1)"
    done
  else
    echo "  assets/universes/${section}/  — empty (placeholder)"
  fi
  echo ""
done
