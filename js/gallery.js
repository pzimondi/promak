/* ============================================
   Gallery lightbox
   ============================================ */
(function () {
  'use strict';

  const lightbox = document.getElementById('lightbox');
  if (!lightbox) return;

  const imgEl = document.getElementById('lightbox-img');
  const captionEl = document.getElementById('lightbox-caption');
  const closeBtn = document.getElementById('lightbox-close');
  const prevBtn = document.getElementById('lightbox-prev');
  const nextBtn = document.getElementById('lightbox-next');

  // Build a flat ordered list of all gallery items in DOM order
  const items = Array.from(document.querySelectorAll('.gallery-item')).map((btn) => {
    const img = btn.querySelector('img');
    const captionEl = btn.querySelector('.gi-caption');
    return {
      src: img ? img.getAttribute('src') : '',
      alt: img ? img.getAttribute('alt') : '',
      caption: captionEl ? captionEl.textContent.trim() : '',
      el: btn,
    };
  });

  let currentIndex = -1;
  let lastFocused = null;

  function open(index) {
    if (index < 0 || index >= items.length) return;
    currentIndex = index;
    const item = items[currentIndex];
    imgEl.src = item.src;
    imgEl.alt = item.alt;
    captionEl.textContent = item.caption;
    lightbox.classList.add('is-open');
    lightbox.setAttribute('aria-hidden', 'false');
    document.body.classList.add('lightbox-open');
    lastFocused = document.activeElement;
    // Focus close button so Esc/Tab works immediately
    setTimeout(() => closeBtn.focus(), 50);
  }

  function close() {
    lightbox.classList.remove('is-open');
    lightbox.setAttribute('aria-hidden', 'true');
    document.body.classList.remove('lightbox-open');
    imgEl.src = '';
    if (lastFocused && typeof lastFocused.focus === 'function') {
      lastFocused.focus();
    }
    currentIndex = -1;
  }

  function show(delta) {
    if (currentIndex < 0) return;
    const next = (currentIndex + delta + items.length) % items.length;
    open(next);
  }

  // Bind triggers
  items.forEach((item, i) => {
    item.el.addEventListener('click', (e) => {
      e.preventDefault();
      open(i);
    });
  });

  closeBtn.addEventListener('click', close);
  prevBtn.addEventListener('click', () => show(-1));
  nextBtn.addEventListener('click', () => show(1));

  // Close on backdrop click (only when clicking the overlay itself)
  lightbox.addEventListener('click', (e) => {
    if (e.target === lightbox) close();
  });

  // Keyboard
  document.addEventListener('keydown', (e) => {
    if (!lightbox.classList.contains('is-open')) return;
    switch (e.key) {
      case 'Escape':
        close();
        break;
      case 'ArrowLeft':
        show(-1);
        break;
      case 'ArrowRight':
        show(1);
        break;
    }
  });

  // Swipe (basic)
  let touchStartX = 0;
  lightbox.addEventListener('touchstart', (e) => {
    touchStartX = e.changedTouches[0].screenX;
  }, { passive: true });
  lightbox.addEventListener('touchend', (e) => {
    const dx = e.changedTouches[0].screenX - touchStartX;
    if (Math.abs(dx) > 60) show(dx > 0 ? -1 : 1);
  }, { passive: true });
})();
