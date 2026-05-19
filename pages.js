(function () {
  /* ── Scroll reveals ── */
  var reveals = document.querySelectorAll('[data-reveal]');
  if ('IntersectionObserver' in window) {
    var io = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (en) {
          if (en.isIntersecting) {
            en.target.classList.add('in');
            io.unobserve(en.target);
          }
        });
      },
      { rootMargin: '0px 0px -10% 0px', threshold: 0.05 }
    );
    reveals.forEach(function (el) { io.observe(el); });
  } else {
    reveals.forEach(function (el) { el.classList.add('in'); });
  }

  /* ── Hamburger drawer ── */
  var burger  = document.querySelector('.nav-burger');
  var drawer  = document.querySelector('.nav-drawer');
  var overlay = document.querySelector('.nav-overlay');
  var nav     = document.querySelector('.nav');

  function drawerOpen() {
    drawer.classList.add('is-open');
    overlay.classList.add('is-open');
    burger.classList.add('is-open');
    burger.setAttribute('aria-expanded', 'true');
    drawer.setAttribute('aria-hidden', 'false');
  }
  function drawerClose() {
    drawer.classList.remove('is-open');
    overlay.classList.remove('is-open');
    burger.classList.remove('is-open');
    burger.setAttribute('aria-expanded', 'false');
    drawer.setAttribute('aria-hidden', 'true');
  }

  if (burger) {
    burger.addEventListener('click', function () {
      burger.classList.contains('is-open') ? drawerClose() : drawerOpen();
    });
  }
  if (overlay) overlay.addEventListener('click', drawerClose);
  if (drawer) {
    drawer.querySelectorAll('a').forEach(function (a) {
      a.addEventListener('click', drawerClose);
    });
  }

  /* ── Hide navbar when footer is visible (<=950px) ── */
  var footer = document.querySelector('.foot');
  if (footer && nav && 'IntersectionObserver' in window) {
    var footerIo = new IntersectionObserver(function (entries) {
      var mq = window.matchMedia('(max-width: 950px)');
      if (!mq.matches) return;
      entries.forEach(function (en) {
        if (en.isIntersecting) {
          nav.classList.add('nav--hidden');
          drawerClose();
        } else {
          nav.classList.remove('nav--hidden');
        }
      });
    }, { threshold: 0.05 });
    footerIo.observe(footer);
  }

  /* ── Streaming modal (Lançamentos page) ── */
  var smodal         = document.getElementById('streamModal');
  if (smodal) {
    var smodalImg      = document.getElementById('smodalCover');
    var smodalTitleEl  = document.getElementById('smodalTitle');
    var smodalCloseBtn = smodal.querySelector('.smodal-close');

    function openSmodal(cover, title, spotify, apple, youtube) {
      smodalImg.src = cover;
      smodalImg.alt = title;
      smodalTitleEl.textContent = title;
      var btns = smodal.querySelectorAll('.smodal-btns .stream-btn');
      if (btns[0]) { btns[0].href = spotify || '#'; btns[0].style.display = spotify ? '' : 'none'; }
      if (btns[1]) { btns[1].href = apple   || '#'; btns[1].style.display = apple   ? '' : 'none'; }
      if (btns[2]) { btns[2].href = youtube || '#'; btns[2].style.display = youtube ? '' : 'none'; }
      smodal.classList.add('is-open');
      smodal.setAttribute('aria-hidden', 'false');
      document.body.style.overflow = 'hidden';
    }
    function closeSmodal() {
      smodal.classList.remove('is-open');
      smodal.setAttribute('aria-hidden', 'true');
      document.body.style.overflow = '';
    }

    document.querySelectorAll('[data-modal-cover]').forEach(function (el) {
      el.addEventListener('click', function (e) {
        e.preventDefault();
        openSmodal(
          el.dataset.modalCover,
          el.dataset.modalTitle   || '',
          el.dataset.modalSpotify || '',
          el.dataset.modalApple   || '',
          el.dataset.modalYoutube || ''
        );
      });
    });

    if (smodalCloseBtn) smodalCloseBtn.addEventListener('click', closeSmodal);
    smodal.addEventListener('click', function (e) { if (e.target === smodal) closeSmodal(); });
    document.addEventListener('keydown', function (e) { if (e.key === 'Escape') closeSmodal(); });
  }

  /* ── Contact form handled by Formspree Ajax (@formspree/ajax) ── */
})();
