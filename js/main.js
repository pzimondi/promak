/* ============================================
   PROMAK Travel and Tours - JavaScript
   Mobile menu, scroll effects, form handling (mailto + WhatsApp)
   ============================================ */

(function () {
  'use strict';

  // ---------- Contact details ----------
  const PROMAK_EMAIL = 'jarsonemakond@gmail.com';
  const PROMAK_WHATSAPP = '27731296245';

  // ---------- Header scroll state + progress bar ----------
  const header = document.querySelector('.site-header');
  const progressBar = document.querySelector('.scroll-progress-bar');
  let ticking = false;
  const onScroll = () => {
    if (header) {
      if (window.scrollY > 24) header.classList.add('is-scrolled');
      else header.classList.remove('is-scrolled');
    }
    if (progressBar) {
      const docHeight = document.documentElement.scrollHeight - window.innerHeight;
      const pct = docHeight > 0 ? (window.scrollY / docHeight) * 100 : 0;
      progressBar.style.width = pct + '%';
    }
    ticking = false;
  };
  const requestScroll = () => {
    if (!ticking) {
      window.requestAnimationFrame(onScroll);
      ticking = true;
    }
  };
  window.addEventListener('scroll', requestScroll, { passive: true });
  onScroll();

  // ---------- Mobile menu ----------
  const navToggle = document.querySelector('.nav-toggle');
  const mobileMenu = document.querySelector('.mobile-menu');
  const body = document.body;

  if (navToggle && mobileMenu) {
    // Mark current page as active in mobile menu
    const currentPage = (location.pathname.split('/').pop() || 'index.html').toLowerCase();
    mobileMenu.querySelectorAll('nav a').forEach(link => {
      const linkPage = (link.getAttribute('href') || '').split('/').pop().toLowerCase();
      if (linkPage === currentPage) {
        link.setAttribute('aria-current', 'page');
      }
    });

    navToggle.addEventListener('click', () => {
      const isOpen = mobileMenu.classList.toggle('is-open');
      navToggle.classList.toggle('is-active', isOpen);
      navToggle.setAttribute('aria-expanded', String(isOpen));
      body.classList.toggle('menu-open', isOpen);
    });

    mobileMenu.querySelectorAll('a').forEach(link => {
      link.addEventListener('click', () => {
        mobileMenu.classList.remove('is-open');
        navToggle.classList.remove('is-active');
        navToggle.setAttribute('aria-expanded', 'false');
        body.classList.remove('menu-open');
      });
    });

    document.addEventListener('keydown', e => {
      if (e.key === 'Escape' && mobileMenu.classList.contains('is-open')) {
        mobileMenu.classList.remove('is-open');
        navToggle.classList.remove('is-active');
        navToggle.setAttribute('aria-expanded', 'false');
        body.classList.remove('menu-open');
      }
    });
  }

  // ---------- Reveal on scroll ----------
  const reveals = document.querySelectorAll('.reveal, .reveal-stagger');
  if (reveals.length && 'IntersectionObserver' in window) {
    const io = new IntersectionObserver(
      entries => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            entry.target.classList.add('is-visible');
            io.unobserve(entry.target);
          }
        });
      },
      { rootMargin: '0px 0px -10% 0px', threshold: 0.05 }
    );
    reveals.forEach(el => io.observe(el));
  } else {
    reveals.forEach(el => el.classList.add('is-visible'));
  }

  // ---------- Hero slideshow ----------
  const slideshow = document.querySelector('[data-slideshow]');
  if (slideshow) {
    const slides = Array.from(slideshow.querySelectorAll('[data-slide]'));
    const dots = Array.from(slideshow.querySelectorAll('[data-dot]'));
    const progressFill = slideshow.querySelector('[data-progress]');
    const SLIDE_DURATION = 6500; // ms per slide
    let currentIndex = 0;
    let progressStart = performance.now();
    let rafId = null;
    let timeoutId = null;
    let isPaused = false;

    function setActive(idx) {
      slides[currentIndex]?.classList.remove('is-active');
      dots[currentIndex]?.classList.remove('is-active');
      currentIndex = (idx + slides.length) % slides.length;
      slides[currentIndex]?.classList.add('is-active');
      dots[currentIndex]?.classList.add('is-active');
      progressStart = performance.now();
    }

    function tick(now) {
      if (isPaused) { rafId = requestAnimationFrame(tick); return; }
      const elapsed = now - progressStart;
      const pct = Math.min((elapsed / SLIDE_DURATION) * 100, 100);
      if (progressFill) progressFill.style.width = pct + '%';
      rafId = requestAnimationFrame(tick);
    }

    function advance() {
      setActive(currentIndex + 1);
      timeoutId = setTimeout(advance, SLIDE_DURATION);
    }

    // Pause on tab hidden / mouse over
    document.addEventListener('visibilitychange', () => {
      isPaused = document.hidden;
    });
    slideshow.addEventListener('mouseenter', () => { isPaused = true; });
    slideshow.addEventListener('mouseleave', () => { isPaused = false; progressStart = performance.now() - (parseFloat(progressFill.style.width || '0') / 100) * SLIDE_DURATION; });

    // Dot navigation
    dots.forEach((dot, i) => {
      dot.addEventListener('click', () => {
        clearTimeout(timeoutId);
        setActive(i);
        timeoutId = setTimeout(advance, SLIDE_DURATION);
      });
    });

    // Start
    rafId = requestAnimationFrame(tick);
    timeoutId = setTimeout(advance, SLIDE_DURATION);
  }

  // ---------- Magnetic buttons ----------
  const magnets = document.querySelectorAll('[data-magnetic]');
  const isCoarsePointer = window.matchMedia('(pointer: coarse)').matches;
  if (!isCoarsePointer) {
    magnets.forEach(el => {
      const STRENGTH = 0.25;
      el.addEventListener('mousemove', e => {
        const rect = el.getBoundingClientRect();
        const x = e.clientX - rect.left - rect.width / 2;
        const y = e.clientY - rect.top - rect.height / 2;
        el.style.transform = `translate(${x * STRENGTH}px, ${y * STRENGTH}px)`;
      });
      el.addEventListener('mouseleave', () => {
        el.style.transform = '';
      });
    });
  }

  // ---------- Animated counters ----------
  const counters = document.querySelectorAll('[data-counter]');
  if (counters.length && 'IntersectionObserver' in window) {
    const animateCounter = el => {
      const target = parseInt(el.dataset.counter, 10);
      const suffix = el.dataset.suffix || '';
      const duration = 1800;
      const start = performance.now();
      const easeOut = t => 1 - Math.pow(1 - t, 3);
      const step = now => {
        const t = Math.min((now - start) / duration, 1);
        const value = Math.round(target * easeOut(t));
        el.textContent = value + suffix;
        if (t < 1) requestAnimationFrame(step);
      };
      requestAnimationFrame(step);
    };
    const counterIo = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          animateCounter(entry.target);
          counterIo.unobserve(entry.target);
        }
      });
    }, { threshold: 0.5 });
    counters.forEach(c => counterIo.observe(c));
  }

  // ---------- Smooth anchor scrolling ----------
  document.querySelectorAll('a[href^="#"]').forEach(link => {
    link.addEventListener('click', e => {
      const id = link.getAttribute('href');
      if (id === '#' || id.length < 2) return;
      const target = document.querySelector(id);
      if (target) {
        e.preventDefault();
        const headerH = (header?.offsetHeight || 64) + 16;
        const y = target.getBoundingClientRect().top + window.pageYOffset - headerH;
        window.scrollTo({ top: y, behavior: 'smooth' });
      }
    });
  });

  // ---------- Active nav link ----------
  const path = window.location.pathname.split('/').pop() || 'index.html';
  document.querySelectorAll('.nav-menu a, .mobile-menu nav a').forEach(link => {
    const href = link.getAttribute('href');
    if (href === path || (path === '' && href === 'index.html') || (path === 'index.html' && href === 'index.html')) {
      link.classList.add('active');
    }
  });

  // ---------- Booking form: tour pre-select from URL ----------
  const params = new URLSearchParams(window.location.search);
  const tourParam = params.get('tour');
  if (tourParam) {
    const tourRadio = document.querySelector(`input[name="tour"][value="${tourParam}"]`);
    if (tourRadio) {
      tourRadio.checked = true;
      const card = tourRadio.closest('.radio-card');
      if (card) card.classList.add('selected');
    }
  }

  // ---------- Booking form: vehicle pre-select from URL (?vehicle=honda-brv etc.) ----------
  const vehicleParam = params.get('vehicle');
  const VEHICLE_INFO = {
    'honda-brv':       { name: 'Honda BRV',       seats: 4,  desc: 'Up to 4 passengers · Couples & small groups' },
    'hyundai-staria':  { name: 'Hyundai Staria',  seats: 6,  desc: 'Up to 8 passengers · Premium MPV' },
    'toyota-quantum':  { name: 'Toyota Quantum',  seats: 8,  desc: 'Up to 12 passengers · Groups & events' },
    'mercedes-benz':   { name: 'Mercedes-Benz C-Class', seats: 2, desc: 'Up to 4 passengers · Executive sedan' }
  };
  if (vehicleParam && VEHICLE_INFO[vehicleParam]) {
    const v = VEHICLE_INFO[vehicleParam];
    const banner = document.getElementById('vehicle-banner');
    const nameEl = document.getElementById('vehicle-banner-name');
    const hidden = document.getElementById('b-vehicle');
    const passField = document.getElementById('b-passengers');
    if (banner && nameEl && hidden) {
      hidden.value = `${v.name} (${v.desc})`;
      nameEl.innerHTML = `${v.name} <span style="color:rgba(255,255,255,0.7);font-weight:500;font-family:var(--font-sans);font-size:0.875em;margin-left:0.5rem">${v.desc}</span>`;
      banner.hidden = false;
    }
    if (passField) passField.value = v.seats;
  }

  // ---------- Radio card visual selection ----------
  document.querySelectorAll('.radio-card-group').forEach(group => {
    group.addEventListener('change', e => {
      if (e.target.matches('input[type="radio"]')) {
        const name = e.target.name;
        group.querySelectorAll(`input[name="${name}"]`).forEach(input => {
          const card = input.closest('.radio-card');
          if (card) card.classList.toggle('selected', input.checked);
        });
      }
    });
    group.querySelectorAll('input[type="radio"]:checked').forEach(input => {
      const card = input.closest('.radio-card');
      if (card) card.classList.add('selected');
    });
  });

  // ---------- Form helpers ----------
  function validateForm(form) {
    let valid = true;
    let firstError = null;

    form.querySelectorAll('[required]').forEach(field => {
      const group = field.closest('.form-group');
      const isRadio = field.type === 'radio';
      let fieldValid = true;

      if (isRadio) {
        const radios = form.querySelectorAll(`input[name="${field.name}"]`);
        const anyChecked = Array.from(radios).some(r => r.checked);
        if (!anyChecked) fieldValid = false;
      } else if (!field.value.trim()) {
        fieldValid = false;
      } else if (field.type === 'email' && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(field.value)) {
        fieldValid = false;
      }

      if (!fieldValid) {
        field.classList.add('error');
        if (group) group.classList.add('has-error');
        if (!firstError) firstError = field;
        valid = false;
      } else {
        field.classList.remove('error');
        if (group) group.classList.remove('has-error');
      }
    });

    if (firstError) firstError.scrollIntoView({ behavior: 'smooth', block: 'center' });
    return valid;
  }

  const FIELD_LABELS = {
    name: 'Name',
    email: 'Email',
    phone: 'Phone',
    topic: 'Topic',
    subject: 'Subject',
    message: 'Message',
    tour: 'Tour',
    vehicle: 'Vehicle',
    date: 'Preferred date',
    time: 'Preferred time',
    passengers: 'Passengers',
    pickup_address: 'Pickup location',
    notes: 'Special requests'
  };

  function openMailto(form, subject) {
    const body = buildMessageBody(form);
    window.location.href = `mailto:${PROMAK_EMAIL}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
  }

  function openWhatsApp(form, subject) {
    const body = buildMessageBody(form);
    const message = `*${subject}*\n\n${body}`;
    window.open(`https://wa.me/${PROMAK_WHATSAPP}?text=${encodeURIComponent(message)}`, '_blank', 'noopener');
  }

  function showResult(form, type) {
    const successEl = form.querySelector('.form-success');
    if (!successEl) return;
    successEl.classList.remove('error');
    let html = '';
    if (type === 'email') {
      html = '<strong>✓ Your email app should have just opened.</strong><br>All your details are pre-filled — just hit send and we\'ll be in touch within an hour during business hours.';
    } else if (type === 'whatsapp') {
      html = '<strong>✓ WhatsApp opened with your details.</strong><br>Just hit send in the app and we\'ll be in touch within an hour during business hours.';
    }
    successEl.innerHTML = html;
    successEl.classList.add('show');
    setTimeout(() => successEl.scrollIntoView({ behavior: 'smooth', block: 'center' }), 100);
  }

  // ---------- Wire up forms ----------
  document.querySelectorAll('form[data-form]').forEach(form => {
    const subject = form.dataset.subject || 'New website enquiry';

    form.addEventListener('submit', e => {
      e.preventDefault();
      if (!validateForm(form)) return;
      openMailto(form, subject);
      showResult(form, 'email');
    });

    const whatsappBtn = form.querySelector('[data-action="whatsapp"]');
    if (whatsappBtn) {
      whatsappBtn.addEventListener('click', e => {
        e.preventDefault();
        if (!validateForm(form)) return;
        openWhatsApp(form, subject);
        showResult(form, 'whatsapp');
      });
    }

    form.querySelectorAll('.form-control').forEach(field => {
      field.addEventListener('input', () => {
        if (field.classList.contains('error') && field.value.trim()) {
          field.classList.remove('error');
          const group = field.closest('.form-group');
          if (group) group.classList.remove('has-error');
        }
      });
    });
  });

  function buildMessageBody(form) {
    const lines = [];
    const data = new FormData(form);

    // Tour radio - use label not slug
    const checkedTour = form.querySelector('input[name="tour"]:checked');
    if (checkedTour) {
      lines.push(`${FIELD_LABELS.tour}: ${checkedTour.dataset.label || checkedTour.value}`);
    }

    for (const [key, value] of data.entries()) {
      if (key === 'tour') continue;
      const v = String(value).trim();
      if (!v) continue;
      const label = FIELD_LABELS[key] || key.charAt(0).toUpperCase() + key.slice(1);
      lines.push(`${label}: ${v}`);
    }

    return lines.join('\n');
  }


  // ---------- Pickup location: "Use my current location" ----------
  document.querySelectorAll('[data-action="locate"]').forEach(btn => {
    const wrap = btn.closest('.pickup-input-wrap');
    if (!wrap) return;
    const input = wrap.querySelector('input[type="text"]');
    const help = btn.closest('.form-group').querySelector('[data-pickup-help]');
    const originalHelp = help ? help.innerHTML : '';
    const originalBtn = btn.innerHTML;

    function setStatus(msg, isError) {
      if (!help) return;
      help.innerHTML = msg;
      help.style.color = isError ? '#dc2626' : 'var(--primary)';
    }
    function resetStatus() {
      if (!help) return;
      help.innerHTML = originalHelp;
      help.style.color = '';
    }

    btn.addEventListener('click', () => {
      if (!('geolocation' in navigator)) {
        setStatus('Your browser doesn\'t support location detection — please type your address.', true);
        return;
      }
      btn.disabled = true;
      btn.innerHTML = '<svg class="form-spinner" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round"><circle cx="12" cy="12" r="9" stroke-opacity="0.25"/><path d="M21 12a9 9 0 0 0-9-9"/></svg><span>Locating…</span>';
      setStatus('Asking your browser for permission…');

      navigator.geolocation.getCurrentPosition(
        async (pos) => {
          const { latitude, longitude } = pos.coords;
          setStatus('Looking up the address…');
          try {
            // Free OpenStreetMap reverse-geocoding (Nominatim)
            const res = await fetch(`https://nominatim.openstreetmap.org/reverse?lat=${latitude}&lon=${longitude}&format=json&addressdetails=1&zoom=18`, {
              headers: { 'Accept-Language': 'en' }
            });
            const data = await res.json();
            const address = data.display_name || `${latitude.toFixed(5)}, ${longitude.toFixed(5)}`;
            input.value = address;
            input.dispatchEvent(new Event('input', { bubbles: true }));
            setStatus('✓ Got your location. Edit the address above if it isn\'t exactly right.');
          } catch (err) {
            console.error('Reverse-geocode failed:', err);
            input.value = `${latitude.toFixed(5)}, ${longitude.toFixed(5)}`;
            input.dispatchEvent(new Event('input', { bubbles: true }));
            setStatus('Got your coordinates, but couldn\'t fetch the street address. We\'ll work with the coordinates — feel free to edit.', true);
          } finally {
            btn.disabled = false;
            btn.innerHTML = originalBtn;
          }
        },
        (err) => {
          btn.disabled = false;
          btn.innerHTML = originalBtn;
          if (err.code === 1) {
            setStatus('Location permission was denied. You can still type your pickup address above.', true);
          } else if (err.code === 2) {
            setStatus('Couldn\'t determine your location. Please type the address.', true);
          } else if (err.code === 3) {
            setStatus('Location request timed out. Please type the address or try again.', true);
          } else {
            setStatus('Something went wrong getting your location. Please type the address.', true);
          }
          setTimeout(resetStatus, 8000);
        },
        { enableHighAccuracy: true, timeout: 10000, maximumAge: 60000 }
      );
    });
  });

  // ---------- Booking page: live summary ----------
  const bookingForm = document.querySelector('#booking-form');
  if (bookingForm) {
    const summaryFields = {
      tour: document.querySelector('#summary-tour'),
      date: document.querySelector('#summary-date'),
      passengers: document.querySelector('#summary-passengers'),
      pickup: document.querySelector('#summary-pickup')
    };

    const updateSummary = () => {
      if (summaryFields.tour) {
        const tour = bookingForm.querySelector('input[name="tour"]:checked');
        summaryFields.tour.textContent = tour ? tour.dataset.label || tour.value : 'Not selected';
      }
      if (summaryFields.date) {
        const date = bookingForm.querySelector('input[name="date"]');
        summaryFields.date.textContent = date && date.value ? new Date(date.value).toLocaleDateString('en-ZA', { day: 'numeric', month: 'long', year: 'numeric' }) : 'Not selected';
      }
      if (summaryFields.passengers) {
        const pass = bookingForm.querySelector('input[name="passengers"]');
        summaryFields.passengers.textContent = pass && pass.value ? `${pass.value} ${pass.value === '1' ? 'person' : 'people'}` : 'Not specified';
      }
      if (summaryFields.pickup) {
        const pickup = bookingForm.querySelector('input[name="pickup_address"]');
        summaryFields.pickup.textContent = pickup && pickup.value ? pickup.value : 'Not specified';
      }
    };

    bookingForm.addEventListener('input', updateSummary);
    bookingForm.addEventListener('change', updateSummary);
    updateSummary();

    const dateInput = bookingForm.querySelector('input[name="date"]');
    if (dateInput) {
      dateInput.setAttribute('min', new Date().toISOString().split('T')[0]);
    }
  }

  // ---------- Page header decoration parallax ----------
  document.querySelectorAll('.page-header').forEach(headerEl => {
    const decor = headerEl.querySelector('.page-header-decor');
    if (!decor || window.matchMedia('(pointer: coarse)').matches) return;
    // Wait until entrance animations finish before enabling parallax
    setTimeout(() => {
      headerEl.addEventListener('mousemove', e => {
        const rect = headerEl.getBoundingClientRect();
        const x = ((e.clientX - rect.left) / rect.width - 0.5) * 18;
        const y = ((e.clientY - rect.top) / rect.height - 0.5) * 18;
        decor.style.transform = `translate(${x}px, ${y}px)`;
      });
      headerEl.addEventListener('mouseleave', () => {
        decor.style.transform = '';
      });
    }, 1500);
  });

  // ---------- Footer year ----------
  document.querySelectorAll('[data-year]').forEach(el => {
    el.textContent = new Date().getFullYear();
  });

  // ---------- Smooth anchor scrolling ----------
  document.querySelectorAll('a[href^="#"]').forEach(link => {
    link.addEventListener('click', e => {
      const id = link.getAttribute('href');
      if (id === '#' || id.length < 2) return;
      const target = document.querySelector(id);
      if (target) {
        e.preventDefault();
        target.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    });
  });
})();
