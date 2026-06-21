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

  /* ---------- scroll loop: velocity-skew + ink/bone nav swap ---------- */
  var header = document.querySelector('header.nav');
  var navH = 64;
  var bones = [].slice.call(document.querySelectorAll('.bone'));
  var skews = [].slice.call(document.querySelectorAll('[data-skew]'));
  var lastY = window.pageYOffset, vel = 0, ticking = false;

  function frame() {
    var y = window.pageYOffset;
    var dv = y - lastY; lastY = y;
    vel += (dv - vel) * 0.25;
    var sk = Math.max(-7, Math.min(7, vel * 0.35));
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

  /* ---------- custom cursor (desktop only) ---------- */
  if (!coarse && !reduce) {
    var dot = document.createElement('div'); dot.id = 'curs';
    var s = dot.style;
    s.position='fixed';s.top=0;s.left=0;s.width='12px';s.height='12px';s.borderRadius='50%';
    s.background='var(--red)';s.zIndex='10000';s.pointerEvents='none';s.mixBlendMode='difference';
    s.transition='width .25s,height .25s,background .25s';s.transform='translate(-50%,-50%)';s.willChange='transform';
    document.body.appendChild(dot);
    var cx=innerWidth/2, cy=innerHeight/2, tx=cx, ty=cy;
    addEventListener('pointermove', function(e){ tx=e.clientX; ty=e.clientY; }, {passive:true});
    (function loop(){ cx+=(tx-cx)*0.2; cy+=(ty-cy)*0.2; dot.style.transform='translate('+(cx-6)+'px,'+(cy-6)+'px)'; requestAnimationFrame(loop); })();
    document.addEventListener('pointerover', function(e){
      var big = e.target.closest('a,button,[data-cursor],.btn,[role="button"]');
      dot.style.width = big ? '46px' : '12px'; dot.style.height = big ? '46px' : '12px';
      dot.style.background = big ? 'var(--acid)' : 'var(--red)';
    });
  }
})();
