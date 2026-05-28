/* ================================================================
   THÉANA RUSSU — Shared: Header · Menu · Modal
   Vanilla JS, no dependencies
================================================================ */
(function () {
  'use strict';

  /* ── Elements ──────────────────────────────────────────────── */
  const header  = document.querySelector('.tr-header');
  const burger  = document.querySelector('.tr-header__burger');
  const menu    = document.querySelector('.tr-menu');
  const modal   = document.querySelector('.tr-modal');
  const form    = document.querySelector('.tr-form');

  /* ================================================================
     HEADER — transparent → frosted on scroll
  ================================================================ */
  if (header) {
    /* Pages that always show solid header (data-solid="true") */
    if (header.dataset.solid === 'true') {
      header.classList.add('is-scrolled');
    } else {
      const onScroll = () => {
        header.classList.toggle('is-scrolled', window.scrollY > 60);
      };
      window.addEventListener('scroll', onScroll, { passive: true });
      onScroll(); /* run once on load */
    }

    /* Active nav link highlight */
    const currentPage = location.pathname.split('/').pop() || 'index.html';
    document.querySelectorAll('.tr-header__nav-link').forEach(link => {
      const href = link.getAttribute('href') || '';
      if (href === currentPage || (currentPage === '' && href === 'index.html')) {
        link.classList.add('is-active');
      }
    });
  }


  /* ================================================================
     BURGER MENU
  ================================================================ */
  if (burger && menu) {
    const openMenu = () => {
      burger.classList.add('is-open');
      burger.setAttribute('aria-expanded', 'true');
      menu.classList.add('is-open');
      document.body.style.overflow = 'hidden';
    };

    const closeMenu = () => {
      burger.classList.remove('is-open');
      burger.setAttribute('aria-expanded', 'false');
      menu.classList.remove('is-open');
      document.body.style.overflow = '';
    };

    burger.addEventListener('click', () => {
      menu.classList.contains('is-open') ? closeMenu() : openMenu();
    });

    /* Close on ESC */
    document.addEventListener('keydown', e => {
      if (e.key === 'Escape') closeMenu();
    });

    /* Close menu when a link inside it is clicked */
    menu.querySelectorAll('a, .tr-menu__cta').forEach(el => {
      el.addEventListener('click', closeMenu);
    });
  }


  /* ================================================================
     CONCIERGE MODAL
  ================================================================ */
  if (modal) {
    const backdrop = modal.querySelector('.tr-modal__backdrop');
    const closeBtn = modal.querySelector('.tr-modal__close');

    const openModal = (modelName) => {
      modal.classList.add('is-open');
      modal.removeAttribute('aria-hidden');
      document.body.style.overflow = 'hidden';

      /* Pre-select model if provided */
      if (modelName) {
        const sel = modal.querySelector('.tr-form select[name="model"]');
        if (sel) {
          const opt = Array.from(sel.options).find(o =>
            o.value.toLowerCase().includes(modelName.toLowerCase())
          );
          if (opt) sel.value = opt.value;
        }
      }
    };

    const closeModal = () => {
      modal.classList.remove('is-open');
      modal.setAttribute('aria-hidden', 'true');
      document.body.style.overflow = '';
    };

    /* Open triggers — any element with class js-open-modal */
    document.querySelectorAll('.js-open-modal').forEach(btn => {
      btn.addEventListener('click', () => {
        /* Try to read model name from data-model attribute */
        openModal(btn.dataset.model || '');
      });
    });

    /* Close triggers */
    if (closeBtn) closeBtn.addEventListener('click', closeModal);
    if (backdrop) backdrop.addEventListener('click', closeModal);

    document.addEventListener('keydown', e => {
      if (e.key === 'Escape' && modal.classList.contains('is-open')) closeModal();
    });
  }


  /* ================================================================
     FORM — validation + submit
  ================================================================ */
  if (form) {
    const required = form.querySelectorAll('[required]');

    const validate = () => {
      let ok = true;
      required.forEach(el => {
        const empty = el.type === 'checkbox' ? !el.checked : !el.value.trim();
        el.classList.toggle('is-error', empty);
        if (empty) ok = false;
      });
      return ok;
    };

    /* Clear error on input */
    required.forEach(el => {
      el.addEventListener('input', () => el.classList.remove('is-error'));
      el.addEventListener('change', () => el.classList.remove('is-error'));
    });

    form.addEventListener('submit', e => {
      e.preventDefault();
      if (!validate()) return;

      const submit = form.querySelector('.tr-form__submit');
      if (submit) {
        submit.disabled = true;
        const origText = submit.innerHTML;
        submit.innerHTML = '<span>Отправляем…</span>';

        /* Simulate send (replace with real fetch/form handler) */
        setTimeout(() => {
          submit.disabled = false;
          submit.innerHTML = origText;
          modal && modal.classList.add('is-success');
          form.reset();
        }, 1200);
      }
    });
  }

})();
