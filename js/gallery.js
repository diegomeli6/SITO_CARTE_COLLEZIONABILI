// gallery.js — card data, filter logic, and modal open/close

// Complete card catalogue. Each card links to one universe and one technique.
const CARDS = [
  {
    id: 1,
    name: 'Charizard — Base Set',
    universe: 'pokemon',
    technique: 'special-finishes',
    emoji: '🔥',
    image: 'assets/cards/pokemon-charizard.jpg',
    description: 'La carta più iconica del TCG Pokémon, edizione base del 1999. Rara olografica con finitura lenticolare che cambia pattern al variare dell\'angolo di visione.',
  },
  {
    id: 2,
    name: 'Pikachu Illustrator',
    universe: 'pokemon',
    technique: 'making-of',
    emoji: '⚡',
    image: 'assets/cards/pokemon-pikachu-illustrator.jpg',
    description: 'Carta promozionale rilasciata in sole 39 copie per un concorso di illustrazione in Giappone nel 1998. Considerata la carta Pokémon più rara al mondo.',
  },
  {
    id: 3,
    name: 'Blastoise — First Edition',
    universe: 'pokemon',
    technique: 'card-anatomy',
    emoji: '💧',
    image: 'assets/cards/pokemon-blastoise.jpg',
    description: 'Prima edizione della Base Set con il timbro "1st Edition" e il cerchio nero. L\'assenza di ombra ai lati della finestra illustrazione la distingue dalla versione successiva.',
  },
  {
    id: 4,
    name: 'Black Lotus',
    universe: 'magic',
    technique: 'making-of',
    emoji: '🌑',
    image: 'assets/cards/magic-black-lotus.jpg',
    description: 'La carta più preziosa nella storia di Magic: The Gathering. Stampata nella Alpha (1993) in soli 1100 esemplari. Il suo potere è talmente sbilanciante da essere bandita in quasi tutti i formati.',
  },
  {
    id: 5,
    name: 'Mox Sapphire — Alpha',
    universe: 'magic',
    technique: 'card-anatomy',
    emoji: '💎',
    image: 'assets/cards/magic-mox-sapphire.jpg',
    description: 'Parte del "Power Nine", le nove carte più forti di Magic mai stampate. La carta presenta la caratteristica cornice nera alpha con angoli tagliati in modo meno preciso rispetto alle edizioni successive.',
  },
  {
    id: 6,
    name: 'Ragavan — Foil',
    universe: 'magic',
    technique: 'special-finishes',
    emoji: '🐒',
    image: 'assets/cards/magic-ragavan.jpg',
    description: 'Carta Modern Horizons 2 nella variante foil-etched con cornice speciale. La finitura olografica riflette uno spettro di colori cangianti che valorizzano le illustrazioni di azione.',
  },
  {
    id: 7,
    name: 'Drago Bianco Occhi Blu — 1st Ed.',
    universe: 'yugioh',
    technique: 'making-of',
    emoji: '🐉',
    image: 'assets/universes/yugioh/blue-eyes-white-dragon.jpg',
    description: 'Il mostro più iconico del franchise Yūgiōh, prima edizione giapponese 1999. Carta Ultra Rare con finitura argentata sul nome e stella dorata di rarità.',
  },
  {
    id: 8,
    name: 'Dark Magician — Secret Rare',
    universe: 'yugioh',
    technique: 'special-finishes',
    emoji: '🔮',
    image: 'assets/universes/yugioh/dark-magician.jpg',
    description: 'Versione Secret Rare con pattern olografico diagonale su tutta la superficie. La finitura Parallel Rare crea un effetto di profondità che esalta l\'illustrazione del mago oscuro.',
  },
  {
    id: 9,
    name: 'Exodia the Forbidden One',
    universe: 'yugioh',
    technique: 'card-anatomy',
    emoji: '👁',
    image: 'assets/universes/yugioh/exodia.jpg',
    description: 'Il set di cinque carte più leggendario del TCG. Ciascun frammento mostra l\'anatomia classica delle carte Yūgiōh con la caratteristica cornice arancione per i normali.',
  },
  {
    id: 10,
    name: 'Mickey Mantle — 1952 Topps',
    universe: 'sport',
    technique: 'making-of',
    emoji: '⚾',
    description: 'Considerata la carta sportiva più importante del dopoguerra americano. Stampa rotocalco su cartone semi-rigido con colori saturi tipici della produzione tipografica degli anni \'50.',
  },
  {
    id: 11,
    name: 'LeBron James — Rookie Patch Auto',
    universe: 'sport',
    technique: 'card-anatomy',
    emoji: '🏀',
    description: 'Carta rookie autografata con patch di gioco autentica. Numerata 1/1 con certificato di autenticità incorporato nel retro. Combina collezionismo e memorabilia in un unico oggetto.',
  },
  {
    id: 12,
    name: 'Cuphead — Cavatina del Diavolo',
    universe: 'cuphead',
    technique: 'special-finishes',
    emoji: '🎷',
    description: 'Carta da gioco ispirata al videogioco Cuphead con estetica vintage anni \'30. Finitura sepia con bordi invecchiati artificialmente per replicare l\'aspetto dei vecchi cortometraggi animati.',
  },
  {
    id: 13,
    name: 'Cuphead — Boss Card: King Dice',
    universe: 'cuphead',
    technique: 'making-of',
    emoji: '🎲',
    description: 'Carta del mazzo premium con illustrazione a tempera originale digitalizzata. Il processo di produzione emula la stampa litografica a colori piatti degli anni del jazz.',
  },
  {
    id: 14,
    name: 'Mewtwo — Psyco Driver',
    universe: 'pokemon',
    technique: 'card-anatomy',
    emoji: '🌀',
    image: 'assets/cards/pokemon-mewtwo-ex.jpg',
    description: 'Carta EX con struttura anatomica espansa: barra PS potenziata, attacco con costo energetico doppio e bordo viola unico dell\'era EX. Illustrazione a pagina intera caratteristica del formato.',
  },
  {
    id: 15,
    name: 'Ronaldo — Panini Sticker Gold',
    universe: 'sport',
    technique: 'special-finishes',
    emoji: '⚽',
    description: 'Figurina Panini versione oro del 2002 con finitura metallizzata serigrafata. Un ibrido tra la tradizione europea delle figurine calcistiche e le tecniche produttive delle carte americane.',
  },
  {
    id: 16,
    name: 'Ancestor\'s Recall — Foil',
    universe: 'magic',
    technique: 'card-anatomy',
    emoji: '📖',
    image: 'assets/cards/magic-ancestral-recall.jpg',
    description: 'Carta emblematica di Magic nella variante foil borderless. La struttura anatomica della carta — cornice, power/toughness, text box — è rimasta invariata dai tempi di Alpha malgrado i redesign grafici.',
  },
];

// ── State ──

let activeUniverse  = 'all';
let activeTechnique = 'all';

// ── DOM references ──

const gridEl         = document.getElementById('gallery-grid');
const countEl        = document.getElementById('gallery-count');
const modalBackdrop  = document.getElementById('modal-backdrop');
const modalTitle     = document.getElementById('modal-title');
const modalDesc      = document.getElementById('modal-desc');
const modalEmoji     = document.getElementById('modal-emoji');
const modalLinkUni   = document.getElementById('modal-link-universe');
const modalLinkTech  = document.getElementById('modal-link-technique');

// ── Rendering ──

// Builds a card element and inserts it into the grid.
function buildCardEl(card) {
  const el = document.createElement('div');
  el.className = `gallery-card card-tint--${card.universe}`;
  el.dataset.universe  = card.universe;
  el.dataset.technique = card.technique;
  el.dataset.id        = card.id;
  el.setAttribute('role', 'button');
  el.setAttribute('tabindex', '0');
  el.setAttribute('aria-label', `Apri dettagli: ${card.name}`);

  // Render a real image if available, otherwise fall back to the emoji placeholder.
  const inner = card.image
    ? `<img src="${card.image}" alt="${card.name}" loading="lazy">`
    : `<div class="gallery-card__placeholder">
        <span style="font-size:2.5rem">${card.emoji}</span>
        <span class="gallery-card__name">${card.name}</span>
       </div>`;

  el.innerHTML = `
    ${inner}
    <div class="gallery-card__overlay">
      <span class="gallery-card__overlay-name">${card.name}</span>
    </div>
  `;

  // Open modal on click or Enter/Space keypress for keyboard accessibility.
  el.addEventListener('click', () => openModal(card));
  el.addEventListener('keydown', e => {
    if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); openModal(card); }
  });

  return el;
}

// Populates the grid with all cards on initial load.
function renderAllCards() {
  gridEl.innerHTML = '';
  CARDS.forEach(card => gridEl.appendChild(buildCardEl(card)));
  updateCount(CARDS.length);
}

// Updates the visible card count label.
function updateCount(n) {
  if (countEl) countEl.textContent = `${n} ${n === 1 ? 'carta' : 'carte'}`;
}

// ── Filtering ──

// Shows/hides cards based on active universe and technique filters.
function applyFilters() {
  let visible = 0;
  gridEl.querySelectorAll('.gallery-card').forEach(el => {
    const matchUni  = activeUniverse  === 'all' || el.dataset.universe  === activeUniverse;
    const matchTech = activeTechnique === 'all' || el.dataset.technique === activeTechnique;
    const show      = matchUni && matchTech;
    el.classList.toggle('gallery-card--hidden', !show);
    if (show) visible++;
  });

  updateCount(visible);

  // Show an empty state if no cards match.
  const existing = gridEl.querySelector('.gallery-empty');
  if (visible === 0 && !existing) {
    const empty = document.createElement('p');
    empty.className = 'gallery-empty';
    empty.textContent = 'Nessuna carta corrisponde ai filtri selezionati.';
    gridEl.appendChild(empty);
  } else if (visible > 0 && existing) {
    existing.remove();
  }
}

// Sets the active filter pill and triggers a re-render.
function setFilter(group, value, pill) {
  if (group === 'universe')  activeUniverse  = value;
  if (group === 'technique') activeTechnique = value;

  document.querySelectorAll(`[data-filter-group="${group}"]`).forEach(p =>
    p.classList.toggle('filter-pill--active', p === pill)
  );

  applyFilters();
}

// Attaches click handlers to all filter pills.
function initFilters() {
  document.querySelectorAll('.filter-pill').forEach(pill => {
    pill.addEventListener('click', () =>
      setFilter(pill.dataset.filterGroup, pill.dataset.filterValue, pill)
    );
  });
}

// ── Modal ──

// Labels and paths for universe and technique pages.
const UNIVERSE_META = {
  pokemon:  { label: 'Pokémon',              path: 'universes/pokemon.html'  },
  magic:    { label: 'Magic: The Gathering', path: 'universes/magic.html'    },
  yugioh:   { label: 'Yūgiōh',              path: 'universes/yugioh.html'   },
  sport:    { label: 'Sport Cards',          path: 'universes/sport.html'    },
  cuphead:  { label: 'Cuphead',              path: 'universes/cuphead.html'  },
};

const TECHNIQUE_META = {
  'making-of':       { label: 'Making Of',        path: 'technical/making-of.html'       },
  'special-finishes':{ label: 'Finiture Speciali', path: 'technical/special-finishes.html'},
  'card-anatomy':    { label: 'Anatomia della Carta', path: 'technical/card-anatomy.html' },
};

// Opens the modal and populates it with the given card's data.
function openModal(card) {
  const uni  = UNIVERSE_META[card.universe];
  const tech = TECHNIQUE_META[card.technique];

  // Show the real image in the modal panel, or the emoji placeholder if no image exists.
  if (card.image) {
    modalEmoji.innerHTML = `<img src="${card.image}" alt="${card.name}">`;
  } else {
    modalEmoji.textContent = card.emoji;
  }
  modalTitle.textContent       = card.name;
  modalDesc.textContent        = card.description;
  modalLinkUni.textContent     = `Vai a ${uni.label} →`;
  modalLinkUni.href            = uni.path;
  modalLinkTech.textContent    = `Vai a ${tech.label} →`;
  modalLinkTech.href           = tech.path;

  modalBackdrop.classList.add('modal-backdrop--open');
  document.body.style.overflow = 'hidden';

  // Return focus to the close button for keyboard users.
  document.getElementById('modal-close').focus();
}

// Closes the modal and restores scroll.
function closeModal() {
  modalBackdrop.classList.remove('modal-backdrop--open');
  document.body.style.overflow = '';
}

// Initialises modal close triggers.
function initModal() {
  document.getElementById('modal-close').addEventListener('click', closeModal);

  // Close on backdrop click (outside the modal box).
  modalBackdrop.addEventListener('click', e => {
    if (e.target === modalBackdrop) closeModal();
  });

  // Close on Escape key.
  document.addEventListener('keydown', e => {
    if (e.key === 'Escape') closeModal();
  });
}

// ── Init ──

document.addEventListener('DOMContentLoaded', () => {
  renderAllCards();
  initFilters();
  initModal();
});
