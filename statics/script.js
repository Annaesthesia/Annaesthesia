/* =========================================================
   Portfolio interactions (vanilla JavaScript)
   - Theme toggle with saved preference
   - Mobile menu
   - Typed text effect in the hero
   - Scroll reveal and active nav link
   - Project filter
   - Contact form (opens the visitor's email app)
   ========================================================= */

(function () {
  'use strict';

  var root = document.documentElement;
  var prefersReducedMotion =
    window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ---------- Footer year ---------- */
  var yearEl = document.getElementById('year');
  if (yearEl) yearEl.textContent = new Date().getFullYear();

  /* ---------- Theme toggle ---------- */
  var themeBtn = document.getElementById('themeToggle');

  function syncThemeButton() {
    if (!themeBtn) return;
    var isDark = root.getAttribute('data-theme') !== 'light';
    themeBtn.setAttribute('aria-pressed', String(!isDark));
    themeBtn.setAttribute('aria-label', isDark ? 'Switch to light theme' : 'Switch to dark theme');
    var meta = document.querySelector('meta[name="theme-color"]');
    if (meta) meta.setAttribute('content', isDark ? '#070b16' : '#f6f8fc');
  }

  if (themeBtn) {
    themeBtn.addEventListener('click', function () {
      var next = root.getAttribute('data-theme') === 'light' ? 'dark' : 'light';
      root.setAttribute('data-theme', next);
      try { localStorage.setItem('theme', next); } catch (e) { /* storage unavailable */ }
      syncThemeButton();
    });
  }
  syncThemeButton();

  /* ---------- Mobile menu ---------- */
  var menuBtn = document.getElementById('menuToggle');
  var nav = document.getElementById('nav');

  function setMenu(open) {
    if (!menuBtn || !nav) return;
    nav.classList.toggle('is-open', open);
    menuBtn.setAttribute('aria-expanded', String(open));
    menuBtn.setAttribute('aria-label', open ? 'Close menu' : 'Open menu');
  }

  if (menuBtn && nav) {
    menuBtn.addEventListener('click', function () {
      setMenu(menuBtn.getAttribute('aria-expanded') !== 'true');
    });
    nav.addEventListener('click', function (e) {
      if (e.target.closest('a')) setMenu(false);
    });
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape') setMenu(false);
    });
    window.addEventListener('resize', function () {
      if (window.innerWidth > 860) setMenu(false);
    });
  }

  /* ---------- Typed text effect ---------- */
  var typedEl = document.getElementById('typed');
  // Edit these phrases to match how you describe yourself
  var phrases = [
    'Senior Frontend Developer',
    'UI Design Engineer',
    'ITF-AI Level 3 Candidate',
    'Analytical Thinker'
  ];

  if (typedEl && !prefersReducedMotion) {
    var phraseIndex = 0;
    var charIndex = phrases[0].length;
    var deleting = true;

    var tick = function () {
      var current = phrases[phraseIndex];
      if (deleting) {
        charIndex--;
        typedEl.textContent = current.slice(0, charIndex);
        if (charIndex === 0) {
          deleting = false;
          phraseIndex = (phraseIndex + 1) % phrases.length;
          setTimeout(tick, 350);
          return;
        }
        setTimeout(tick, 38);
      } else {
        var target = phrases[phraseIndex];
        charIndex++;
        typedEl.textContent = target.slice(0, charIndex);
        if (charIndex === target.length) {
          deleting = true;
          setTimeout(tick, 1900);
          return;
        }
        setTimeout(tick, 70);
      }
    };
    setTimeout(tick, 2200);
  }

  /* ---------- Scroll reveal ---------- */
  var revealEls = document.querySelectorAll('.reveal');

  if ('IntersectionObserver' in window && !prefersReducedMotion) {
    var revealObserver = new IntersectionObserver(function (entries, obs) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          obs.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });

    revealEls.forEach(function (el, i) {
      // Light stagger for items that sit in the same row
      el.style.transitionDelay = (i % 3) * 70 + 'ms';
      revealObserver.observe(el);
    });
  } else {
    revealEls.forEach(function (el) { el.classList.add('is-visible'); });
  }

  /* ---------- Active nav link on scroll ---------- */
  var navLinks = Array.prototype.slice.call(document.querySelectorAll('.nav a[href^="#"]'));
  var sections = navLinks
    .map(function (link) { return document.querySelector(link.getAttribute('href')); })
    .filter(Boolean);

  if ('IntersectionObserver' in window && sections.length) {
    var spy = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (!entry.isIntersecting) return;
        var id = '#' + entry.target.id;
        navLinks.forEach(function (link) {
          var active = link.getAttribute('href') === id;
          link.classList.toggle('is-active', active);
          if (active) link.setAttribute('aria-current', 'true');
          else link.removeAttribute('aria-current');
        });
      });
    }, { rootMargin: '-45% 0px -50% 0px' });

    sections.forEach(function (section) { spy.observe(section); });
  }

  /* ---------- Project filter ---------- */
  var filterButtons = document.querySelectorAll('.filter');
  var projects = document.querySelectorAll('#projectGrid .project');

  filterButtons.forEach(function (btn) {
    btn.addEventListener('click', function () {
      var category = btn.getAttribute('data-filter');

      filterButtons.forEach(function (b) {
        var active = b === btn;
        b.classList.toggle('is-active', active);
        b.setAttribute('aria-pressed', String(active));
      });

      projects.forEach(function (card) {
        var match = category === 'all' || card.getAttribute('data-category') === category;
        card.hidden = !match;
        if (match) card.classList.add('is-visible');
      });
    });
  });

  /* ---------- Contact form ---------- */
  var form = document.getElementById('contactForm');
  var note = document.getElementById('formNote');

  // Change this to your real email address
  var CONTACT_EMAIL = 'woluchemann@yahoo.com';

  function setNote(message, type) {
    if (!note) return;
    note.textContent = message;
    note.className = 'form-note' + (type ? ' ' + type : '');
  }

  if (form) {
    form.addEventListener('submit', function (e) {
      e.preventDefault();

      var name = form.elements.name;
      var email = form.elements.email;
      var message = form.elements.message;
      var valid = true;

      [name, email, message].forEach(function (field) {
        var ok = field.value.trim() !== '';
        if (field === email && ok) ok = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(field.value.trim());
        field.parentElement.classList.toggle('invalid', !ok);
        field.setAttribute('aria-invalid', String(!ok));
        if (!ok) valid = false;
      });

      if (!valid) {
        setNote('Please fill in every field with a valid email address.', 'error');
        return;
      }

      var subject = 'Portfolio enquiry from ' + name.value.trim();
      var body = message.value.trim() + '\n\n' + name.value.trim() + '\n' + email.value.trim();
      window.location.href =
        'mailto:' + CONTACT_EMAIL +
        '?subject=' + encodeURIComponent(subject) +
        '&body=' + encodeURIComponent(body);

      setNote('Opening your email app. If nothing happens, write to ' + CONTACT_EMAIL + ' directly.', 'ok');
      form.reset();
    });
  }
})();
