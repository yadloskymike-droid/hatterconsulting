/**
 * Hatter Consulting — script.js
 * Vanilla JS only. Handles:
 *  1. Sticky nav background on scroll
 *  2. Hamburger menu toggle
 *  3. Close mobile menu on nav link click
 *  4. Join form submit handler
 */

(function () {
  'use strict';

  /* ---- DOM references ---- */
  const header     = document.getElementById('site-header');
  const hamburger  = document.getElementById('hamburger');
  const navLinks   = document.getElementById('nav-links');
  const joinForm   = document.getElementById('join-form');

  /* =============================================
     1. STICKY NAV — add .scrolled class after 50px
     ============================================= */
  function handleScroll() {
    if (window.scrollY > 50) {
      header.classList.add('scrolled');
    } else {
      header.classList.remove('scrolled');
    }
  }

  // Run once on load in case page is already scrolled
  handleScroll();

  window.addEventListener('scroll', handleScroll, { passive: true });

  /* =============================================
     2. HAMBURGER TOGGLE
     ============================================= */
  if (hamburger && navLinks) {
    hamburger.addEventListener('click', function () {
      const isOpen = navLinks.classList.toggle('open');
      hamburger.classList.toggle('open', isOpen);
      hamburger.setAttribute('aria-expanded', String(isOpen));

      // Prevent body scroll when mobile menu is open
      document.body.style.overflow = isOpen ? 'hidden' : '';
    });
  }

  /* =============================================
     3. CLOSE MOBILE MENU ON NAV LINK CLICK
     ============================================= */
  if (navLinks) {
    navLinks.querySelectorAll('.nav-link').forEach(function (link) {
      link.addEventListener('click', function () {
        navLinks.classList.remove('open');
        hamburger.classList.remove('open');
        hamburger.setAttribute('aria-expanded', 'false');
        document.body.style.overflow = '';
      });
    });
  }

  /* =============================================
     4. CLOSE MOBILE MENU ON OUTSIDE CLICK
     ============================================= */
  document.addEventListener('click', function (e) {
    if (
      navLinks &&
      navLinks.classList.contains('open') &&
      !navLinks.contains(e.target) &&
      !hamburger.contains(e.target)
    ) {
      navLinks.classList.remove('open');
      hamburger.classList.remove('open');
      hamburger.setAttribute('aria-expanded', 'false');
      document.body.style.overflow = '';
    }
  });

  /* =============================================
     5. JOIN FORM SUBMIT HANDLER
     ============================================= */
  if (joinForm) {
    joinForm.addEventListener('submit', function (e) {
      e.preventDefault();

      // HTML5 constraint validation
      if (!joinForm.checkValidity()) {
        // Trigger native browser validation UI
        joinForm.reportValidity();
        return;
      }

      // Show confirmation
      alert('Thanks for your interest! We\'ll be in touch.');

      // Reset the form
      joinForm.reset();
    });
  }

  /* =============================================
     6. SMOOTH ACTIVE NAV LINK HIGHLIGHT
        (Intersection Observer — highlights the
         nav link whose section is in view)
     ============================================= */
  const sections  = document.querySelectorAll('main section[id]');
  const allLinks  = document.querySelectorAll('.nav-link[href^="#"]');

  if (sections.length && allLinks.length && 'IntersectionObserver' in window) {
    const observerOptions = {
      root: null,
      rootMargin: '-40% 0px -55% 0px',
      threshold: 0
    };

    const observer = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          const id = entry.target.getAttribute('id');
          allLinks.forEach(function (link) {
            const href = link.getAttribute('href');
            if (href === '#' + id) {
              link.setAttribute('data-active', 'true');
              link.style.fontWeight = '700';
            } else {
              link.removeAttribute('data-active');
              // Restore default weight unless it's the CTA
              if (!link.classList.contains('nav-link--cta')) {
                link.style.fontWeight = '';
              }
            }
          });
        }
      });
    }, observerOptions);

    sections.forEach(function (section) {
      observer.observe(section);
    });
  }

}());
