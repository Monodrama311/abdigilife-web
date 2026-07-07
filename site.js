/* AB DIGILIFE — site.js v2 : kinetic + rhythm engine */
(function () {
  var reduce = matchMedia('(prefers-reduced-motion:reduce)').matches;
  var coarse = matchMedia('(pointer:coarse)').matches;

  /* ---------- reveals (incl. line masks) ---------- */
  var rvs = document.querySelectorAll('.rv,.linemask');
  if (reduce || !('IntersectionObserver' in window)) {
    rvs.forEach(function (e) { e.classList.add('in'); });
  } else {
    var io = new IntersectionObserver(function (en) {
      en.forEach(function (x) { if (x.isIntersecting) { x.target.classList.add('in'); io.unobserve(x.target); } });
    }, { threshold: 0.12, rootMargin: '0px 0px -8% 0px' });
    rvs.forEach(function (e) { io.observe(e); });
  }

  /* ---------- reveal safety net ----------
     Content must NEVER stay hidden/faded. IntersectionObserver, rAF and CSS
     animations can stall (background tabs, slow loads, crawlers). This forces
     every reveal element to its final visible state after a short grace period. */
  function forceReveal(all) {
    document.querySelectorAll('.rv,.linemask,.rev,.reveal').forEach(function (e) {
      var r = e.getBoundingClientRect();
      if (!all && r.top > innerHeight * 1.15) return; // leave below-fold to scroll-reveal
      e.classList.add('in', 'seen', 'is-in');
      e.style.animation = 'none';
      e.style.opacity = '1';
      e.style.transform = 'none';
    });
  }
  setTimeout(function () { forceReveal(false); }, 1400);
  addEventListener('load', function () { setTimeout(function () { forceReveal(false); }, 200); });
  document.addEventListener('visibilitychange', function () { if (!document.hidden) forceReveal(false); });

  /* ---------- seamless marquees (clone once) ---------- */
  document.querySelectorAll('.marquee .track').forEach(function (t) {
    t.innerHTML += t.innerHTML;
  });

  /* ---------- active nav + footer year ---------- */
  var path = location.pathname.replace(/\/$/, '').replace(/\.html$/, '');
  document.querySelectorAll('header.nav a.lnk').forEach(function (a) {
    var h = (a.getAttribute('href') || '').replace(/^\//, '').replace(/\.html$/, '');
    if (h && path.indexOf(h) > -1) a.setAttribute('aria-current', 'page');
  });
  var yr = document.getElementById('yr'); if (yr) yr.textContent = new Date().getFullYear();

  /* iykyk — a quiet mark that knows where it came from */
  var legal = document.querySelector('footer.site .legal');
  if (legal) {
    var x = document.createElement('a');
    x.href = 'https://dmlogic.ca'; x.target = '_blank'; x.rel = 'noopener';
    x.textContent = '◦'; x.setAttribute('aria-label', '◦');
    x.style.cssText = 'margin-left:14px;opacity:.28;color:inherit;text-decoration:none;transition:opacity .35s';
    x.addEventListener('mouseenter', function () { x.style.opacity = '.7'; });
    x.addEventListener('mouseleave', function () { x.style.opacity = '.28'; });
    legal.appendChild(x);
  }

  /* ---------- scroll loop: velocity-skew + ink/bone nav swap ---------- */
  var header = document.querySelector('header.nav');
  var navH = 64;
  var bones = [].slice.call(document.querySelectorAll('.bone'));
  var skews = [].slice.call(document.querySelectorAll('[data-skew]'));
  var lastY = window.pageYOffset, vel = 0, ticking = false;

  function frame() {
    var y = window.pageYOffset;
    var dv = y - lastY; lastY = y;
    vel += (dv - vel) * 0.3;
    var sk = Math.max(-3.4, Math.min(3.4, vel * 0.17));
    if (!reduce) skews.forEach(function (el) { el.style.transform = 'skewY(' + (sk * (el.dataset.skew === '-' ? -1 : 1)) + 'deg)'; });

    // nav swap when a bone section sits under the header line
    if (header) {
      var light = false;
      for (var i = 0; i < bones.length; i++) {
        var r = bones[i].getBoundingClientRect();
        if (r.top <= navH && r.bottom > navH) { light = true; break; }
      }
      header.classList.toggle('on-light', light);
    }
    ticking = false;
  }
  function onScroll() { if (!ticking) { ticking = true; requestAnimationFrame(frame); } }
  window.addEventListener('scroll', onScroll, { passive: true });
  window.addEventListener('resize', frame, { passive: true });
  frame();

  /* custom cursor removed — native cursor + element hover states only */
})();
