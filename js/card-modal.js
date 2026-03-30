// card-modal.js — lightbox per i card-slot nelle pagine universo, tecnica e home

(function () {

  // Inietta il markup del viewer nel body
  function injectViewer() {
    document.body.insertAdjacentHTML('beforeend', [
      '<div class="card-viewer" id="card-viewer" role="dialog" aria-modal="true"',
      '     aria-label="Dettaglio carta" aria-hidden="true">',
      '  <button class="card-viewer__close" id="card-viewer-close" aria-label="Chiudi">✕</button>',
      '  <img class="card-viewer__img" id="card-viewer-img" src="" alt="">',
      '</div>'
    ].join(''));
  }

  // Apre il viewer mostrando l'immagine del card-slot cliccato
  function openViewer(src, alt) {
    var viewer = document.getElementById('card-viewer');
    document.getElementById('card-viewer-img').src = src;
    document.getElementById('card-viewer-img').alt = alt;
    viewer.classList.add('card-viewer--open');
    viewer.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';
    document.getElementById('card-viewer-close').focus();
  }

  // Chiude il viewer e ripristina lo scroll
  function closeViewer() {
    var viewer = document.getElementById('card-viewer');
    viewer.classList.remove('card-viewer--open');
    viewer.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
  }

  // Aggiunge il click handler a ogni card-slot che contiene un'immagine reale
  function initCardSlots() {
    document.querySelectorAll('.card-slot img').forEach(function (img) {
      var slot = img.parentElement;
      slot.style.cursor = 'pointer';
      slot.setAttribute('tabindex', '0');
      slot.setAttribute('role', 'button');
      slot.addEventListener('click', function () { openViewer(img.src, img.alt); });
      slot.addEventListener('keydown', function (e) {
        if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); openViewer(img.src, img.alt); }
      });
    });
  }

  document.addEventListener('DOMContentLoaded', function () {
    injectViewer();
    initCardSlots();

    // Chiudi al click sul pulsante
    document.getElementById('card-viewer-close').addEventListener('click', closeViewer);

    // Chiudi al click fuori dall'immagine (sul backdrop)
    document.getElementById('card-viewer').addEventListener('click', function (e) {
      if (e.target === this) closeViewer();
    });

    // Chiudi con Escape
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape') closeViewer();
    });
  });

})();
