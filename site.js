/* AB DIGILIFE — site.js : scroll reveal + active-nav + footer year */
(function () {
  var reduce = matchMedia('(prefers-reduced-motion:reduce)').matches;
  // Scroll reveal
  var els = document.querySelectorAll('.reveal');
  if (reduce || !('IntersectionObserver' in window)) {
    els.forEach(function (e) { e.classList.add('in'); });
  } else {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        if (en.isIntersecting) { en.target.classList.add('in'); io.unobserve(en.target); }
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -8% 0px' });
    els.forEach(function (e) { io.observe(e); });
  }
  // Mark current nav link
  var path = location.pathname.replace(/\/$/, '');
  document.querySelectorAll('header.nav nav a').forEach(function (a) {
    var href = a.getAttribute('href') || '';
    var hp = href.replace(/^\//, '').replace(/\.html$/, '');
    if ((hp && path.indexOf(hp) > -1)) a.setAttribute('aria-current', 'page');
  });
  // Footer year
  var y = document.getElementById('yr'); if (y) y.textContent = new Date().getFullYear();
})();
