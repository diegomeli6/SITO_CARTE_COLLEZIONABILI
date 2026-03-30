// navbar.js — scroll trigger and dropdown behaviour

const navbar = document.getElementById('navbar');
const hero   = document.querySelector('.hero');

// Shows/hides the navbar based on whether the hero is visible.
// On pages with no hero, the navbar is shown immediately.
if (hero) {
  const observer = new IntersectionObserver(
    ([entry]) => navbar.classList.toggle('navbar--visible', !entry.isIntersecting),
    { threshold: 0 }
  );
  observer.observe(hero);
} else {
  navbar.classList.add('navbar--visible');
}

// Toggles the open state of a dropdown on click.
document.querySelectorAll('.navbar__dropdown-trigger').forEach(trigger => {
  trigger.addEventListener('click', () => {
    const dropdown = trigger.closest('.navbar__dropdown');
    const isOpen   = dropdown.classList.contains('navbar__dropdown--open');

    // Close all dropdowns first so only one is open at a time.
    document.querySelectorAll('.navbar__dropdown').forEach(d =>
      d.classList.remove('navbar__dropdown--open')
    );

    if (!isOpen) dropdown.classList.add('navbar__dropdown--open');
  });
});

// Closes all dropdowns when the user clicks outside any dropdown.
document.addEventListener('click', e => {
  if (!e.target.closest('.navbar__dropdown')) {
    document.querySelectorAll('.navbar__dropdown').forEach(d =>
      d.classList.remove('navbar__dropdown--open')
    );
  }
});

// Toggles the mobile menu open/closed on hamburger click.
const hamburger = document.getElementById('navbar-hamburger');
if (hamburger) {
  hamburger.addEventListener('click', () => {
    const isOpen = navbar.classList.toggle('navbar--menu-open');
    hamburger.setAttribute('aria-expanded', String(isOpen));
  });

  // Close mobile menu when any link inside it is clicked.
  document.querySelectorAll('.navbar__mobile-menu a').forEach(link => {
    link.addEventListener('click', () => {
      navbar.classList.remove('navbar--menu-open');
      hamburger.setAttribute('aria-expanded', 'false');
    });
  });
}
