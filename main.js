(function() {
  /* ── Scroll reveals ── */
  var reveals = document.querySelectorAll('[data-reveal]');
  var collage = document.querySelector('.collage');
  var io = null;

  if ('IntersectionObserver' in window) {
    io = new IntersectionObserver(function(entries) {
      entries.forEach(function(en) {
        if (en.isIntersecting) {
          en.target.classList.add('in');
          io.unobserve(en.target);
        }
      });
    }, { rootMargin: '0px 0px -10% 0px', threshold: 0.05 });

    reveals.forEach(function(el) { io.observe(el); });

    /* Collage: observe separately to trigger polaroid entry */
    if (collage) {
      var collageIo = new IntersectionObserver(function(entries) {
        entries.forEach(function(en) {
          if (en.isIntersecting) {
            en.target.classList.add('in');
            collageIo.unobserve(en.target);
          }
        });
      }, { rootMargin: '0px 0px -5% 0px', threshold: 0.1 });
      collageIo.observe(collage);
    }
  } else {
    reveals.forEach(function(el) { el.classList.add('in'); });
    if (collage) collage.classList.add('in');
  }

  /* ── Streaming modal ── */
  var smodal      = document.getElementById('streamModal');
  var smodalImg   = document.getElementById('smodalCover');
  var smodalTitleEl = document.getElementById('smodalTitle');
  var smodalCloseBtn = smodal ? smodal.querySelector('.smodal-close') : null;

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

  /* Wire up all triggers with data-modal-cover */
  document.querySelectorAll('[data-modal-cover]').forEach(function(el) {
    el.addEventListener('click', function(e) {
      e.preventDefault();
      openSmodal(
        el.dataset.modalCover,
        el.dataset.modalTitle  || '',
        el.dataset.modalSpotify || '',
        el.dataset.modalApple   || '',
        el.dataset.modalYoutube || ''
      );
    });
  });

  if (smodalCloseBtn) smodalCloseBtn.addEventListener('click', closeSmodal);
  if (smodal) {
    smodal.addEventListener('click', function(e) {
      if (e.target === smodal) closeSmodal();
    });
  }
  document.addEventListener('keydown', function(e) {
    if (e.key === 'Escape') closeSmodal();
  });

  /* ── Hamburger drawer (≤ 950px only) ── */
  var burger  = document.querySelector('.nav-burger');
  var drawer  = document.querySelector('.nav-drawer');
  var overlay = document.querySelector('.nav-overlay');
  var nav     = document.querySelector('.nav');
  var footer  = document.querySelector('.foot');

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
    burger.addEventListener('click', function() {
      burger.classList.contains('is-open') ? drawerClose() : drawerOpen();
    });
  }
  if (overlay) {
    overlay.addEventListener('click', drawerClose);
  }
  /* Close drawer when a link is tapped */
  if (drawer) {
    drawer.querySelectorAll('a').forEach(function(a) {
      a.addEventListener('click', drawerClose);
    });
  }

  /* ── Hide navbar when footer is visible (≤ 950px only) ── */
  if (footer && nav && 'IntersectionObserver' in window) {
    var footerIo = new IntersectionObserver(function(entries) {
      var mq = window.matchMedia('(max-width: 950px)');
      if (!mq.matches) return;
      entries.forEach(function(en) {
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
})();
