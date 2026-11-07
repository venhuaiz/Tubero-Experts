(function () {
  document.documentElement.classList.remove('no-js');

  // Mobile drawer
  var btn = document.querySelector('.menu-btn');
  var nav = document.getElementById('nav');
  function setMenu(open) {
    nav.classList.toggle('is-open', open);
    btn.setAttribute('aria-expanded', String(open));
    btn.setAttribute('aria-label', open ? 'Close menu' : 'Open menu');
  }
  btn.addEventListener('click', function () { setMenu(!nav.classList.contains('is-open')); });
  nav.addEventListener('click', function (e) { if (e.target.closest('a')) setMenu(false); });
  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape') { setMenu(false); closeDrops(); closeLightbox(); }
  });

  // Dropdown carets (desktop click/keyboard; hover handled in CSS)
  function closeDrops() {
    document.querySelectorAll('.has-drop.open').forEach(function (li) {
      li.classList.remove('open');
      li.querySelector('.caret').setAttribute('aria-expanded', 'false');
    });
  }
  document.querySelectorAll('.caret').forEach(function (c) {
    c.addEventListener('click', function (e) {
      e.stopPropagation();
      var li = c.closest('.has-drop');
      var open = !li.classList.contains('open');
      closeDrops();
      li.classList.toggle('open', open);
      c.setAttribute('aria-expanded', String(open));
    });
  });
  document.addEventListener('click', closeDrops);

  // Lightbox
  var lb = document.querySelector('.lightbox');
  var lbImg = lb.querySelector('img');
  var lastFocus = null;
  function closeLightbox() {
    if (lb.hidden) return;
    lb.hidden = true;
    if (lastFocus) lastFocus.focus();
  }
  document.querySelectorAll('.gallery__item').forEach(function (item) {
    item.addEventListener('click', function () {
      lastFocus = item;
      var img = item.querySelector('img');
      lbImg.src = item.dataset.full;
      lbImg.alt = img.alt;
      lb.hidden = false;
      lb.querySelector('.lightbox__close').focus();
    });
  });
  lb.addEventListener('click', function (e) { if (e.target !== lbImg) closeLightbox(); });

  // Forms — DEMO MODE: nothing is sent until a real endpoint is wired.
  // To go live, set data-endpoint="https://formspree.io/f/XXXX" on the <form>.
  document.querySelectorAll('form[data-demo]').forEach(function (form) {
    var msg = form.querySelector('.form__msg');
    form.addEventListener('submit', function (e) {
      e.preventDefault();
      var firstBad = null;
      form.querySelectorAll('[required]').forEach(function (f) {
        var bad = !f.value.trim();
        f.setAttribute('aria-invalid', bad ? 'true' : 'false');
        if (bad && !firstBad) firstBad = f;
      });
      if (firstBad) {
        msg.className = 'form__msg is-err';
        msg.textContent = 'Please fill in your name, mobile number and the service you need.';
        firstBad.focus();
        return;
      }
      var endpoint = form.dataset.endpoint;
      if (!endpoint) {
        msg.className = 'form__msg is-ok';
        msg.textContent = 'Thank you! This is a preview, so the form isn’t connected yet. For now, please call or text 0999-117-4009.';
        return;
      }
      fetch(endpoint, { method: 'POST', body: new FormData(form), headers: { Accept: 'application/json' } })
        .then(function (r) {
          if (r.ok) {
            form.reset();
            msg.className = 'form__msg is-ok';
            msg.textContent = 'Thank you — we received your message and will get back to you soon.';
          } else { throw new Error(); }
        })
        .catch(function () {
          msg.className = 'form__msg is-err';
          msg.textContent = 'Sorry, the message didn’t go through. Please call or text 0999-117-4009.';
        });
    });
  });

  var y = document.getElementById('year');
  if (y) y.textContent = new Date().getFullYear();
})();
