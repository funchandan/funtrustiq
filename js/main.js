/* FundTrustIQ — interaction layer (vanilla, no dependencies) */
(() => {
  const d = document, root = d.documentElement;
  const RM = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const $ = (s, c = d) => c.querySelector(s), $$ = (s, c = d) => [...c.querySelectorAll(s)];
  const clamp = (v, a, b) => Math.min(b, Math.max(a, v));
  const yr = $('[data-year]'); if (yr) yr.textContent = new Date().getFullYear();

  /* ── Split headline into masked words ── */
  $$('[data-split]').forEach(el => {
    let i = 0;
    el.innerHTML = el.innerHTML.split(/(<br\s*\/?>)/).map(part =>
      /^<br/.test(part) ? part : part.trim().split(/\s+/).map(w => `<span class="w"><span style="--i:${i++}">${w}</span></span>`).join(' ')
    ).join('');
  });
  const ready = () => requestAnimationFrame(() => root.classList.add('is-ready'));
  (d.fonts && d.fonts.ready ? d.fonts.ready : Promise.resolve()).then(ready);
  setTimeout(ready, 1200);

  /* ── Scroll reveals ── */
  const io = new IntersectionObserver(es => es.forEach(e => {
    if (e.isIntersecting) { e.target.classList.add('is-in'); io.unobserve(e.target); }
  }), { rootMargin: '0px 0px -8% 0px', threshold: .12 });
  $$('.reveal').forEach(el => io.observe(el));
  const chips = $('[data-chips]');
  if (chips) { $$('li', chips).forEach((li, i) => li.style.setProperty('--i', i)); io.observe(chips); }
  // hero copy reveals immediately
  setTimeout(() => $$('.hero .reveal').forEach(el => el.classList.add('is-in')), 150);

  /* ── Nav: scrolled state, hide on scroll down / show on scroll up ── */
  const nav = $('[data-nav]'); let lastY = scrollY;
  const onNav = () => {
    const y = scrollY;
    nav.classList.toggle('is-scrolled', y > 20);
    const menuOpen = nav.querySelector('.menu.is-open') || !$('[data-mobile-menu]').hidden;
    nav.classList.toggle('is-hidden', y > 480 && y > lastY + 2 && !menuOpen);
    if (y < lastY - 2) nav.classList.remove('is-hidden');
    lastY = y;
  };

  /* ── Platform dropdown ── */
  const mBtn = $('[data-menu-btn]'), menu = $('[data-menu]'), item = mBtn.closest('.nav__item');
  let mT;
  const setMenu = open => { menu.classList.toggle('is-open', open); mBtn.setAttribute('aria-expanded', open); };
  mBtn.addEventListener('click', () => setMenu(mBtn.getAttribute('aria-expanded') !== 'true'));
  item.addEventListener('mouseenter', () => { clearTimeout(mT); setMenu(true); });
  item.addEventListener('mouseleave', () => { mT = setTimeout(() => setMenu(false), 160); });
  item.addEventListener('focusout', e => { if (!item.contains(e.relatedTarget)) setMenu(false); });
  $$('a', menu).forEach(a => a.addEventListener('click', () => setMenu(false)));
  d.addEventListener('keydown', e => { if (e.key === 'Escape') { setMenu(false); toggleMobile(false); } });

  /* ── Mobile menu ── */
  const burger = $('[data-burger]'), mm = $('[data-mobile-menu]');
  const toggleMobile = open => {
    open = open ?? burger.getAttribute('aria-expanded') !== 'true';
    burger.setAttribute('aria-expanded', open); burger.setAttribute('aria-label', open ? 'Close menu' : 'Open menu');
    mm.hidden = !open; nav.classList.toggle('is-scrolled', open || scrollY > 20);
  };
  burger.addEventListener('click', () => toggleMobile());
  $$('a', mm).forEach(a => a.addEventListener('click', () => toggleMobile(false)));

  /* ── Marquee: duplicate for seamless loop ── */
  $$('[data-marquee] .marquee__track').forEach(t => {
    $$('li', t).forEach(li => { const c = li.cloneNode(true); c.setAttribute('aria-hidden', 'true'); t.appendChild(c); });
  });

  /* ── Hero "blades": triangle fan echoing the logo, depth via blur ── */
  function Fan(host, opts) {
    // Each blade is a circular sector (conic wedge) pivoting on one point — the
    // Greenlock "fan" construction, rebuilt with FundTrustIQ's triangle palette.
    const blades = opts.blades.map((b, i) => {
      const el = d.createElement('div'); el.className = 'blade';
      el.style.setProperty('--c', b.c); el.style.setProperty('--b', b.blur + 'px'); el.style.setProperty('--th', b.th + 'deg');
      el.style.zIndex = b.z ?? i; host.appendChild(el);
      return { el, ...b, phase: i * 1.37 };
    });
    let mx = 0, my = 0, tx = 0, ty = 0, t0 = performance.now(), vis = true, raf;
    const layout = () => {
      const w = host.clientWidth, h = host.clientHeight, s = opts.scale ? opts.scale(w, h) : Math.max(w, h * 1.4);
      const px = w * opts.px(w), py = h * opts.py(w);
      blades.forEach(b => { b.R = s * b.r; b.el.style.setProperty('--d', 2 * b.R + 'px'); b.x = px - b.R; b.y = py - b.R; });
    };
    const frame = now => {
      const t = (now - t0) / 1000;
      tx += (mx - tx) * .05; ty += (my - ty) * .05;
      const intro = RM ? 1 : 1 - Math.pow(1 - clamp(t / 2.6, 0, 1), 4);
      blades.forEach(b => {
        const sway = RM ? 0 : Math.sin(t * b.sp + b.phase) * b.amp;
        const a = opts.start + (b.a - opts.start) * intro + sway + tx * b.par;
        b.el.style.transform = `translate3d(${b.x + tx * b.par * 5}px,${b.y + ty * b.par * 5}px,0) rotate(${a}deg)`;
      });
      if (!RM && vis) raf = requestAnimationFrame(frame);
    };
    layout(); addEventListener('resize', layout);
    if (!RM) {
      addEventListener('pointermove', e => { mx = (e.clientX / innerWidth - .5) * 2; my = (e.clientY / innerHeight - .5) * 2; }, { passive: true });
      new IntersectionObserver(([e]) => { vis = e.isIntersecting; if (vis) { cancelAnimationFrame(raf); raf = requestAnimationFrame(frame); } }).observe(host);
    }
    requestAnimationFrame(frame);
  }
  const SKY = '#c4e8f8', SKY2 = '#9fd6f2', NAVY = '#14315f', NAVY2 = '#1f396d', ICE = '#f7fbfd', BLUE = '#2a7fba';
  const hero = $('[data-hero-art]');
  // a = start angle (0 = 12 o'clock, clockwise), th = wedge width, r = radius × viewport
  if (hero) Fan(hero, {
    px: w => w < 700 ? .97 : .93, py: w => w < 700 ? .05 : .07, start: 168,
    scale: (w, h) => w < 700 ? h * .62 : Math.max(w, h * 1.4),
    blades: [
      { a: 178, th: 26, r: .46, c: NAVY, blur: 18, amp: 2, sp: .3, par: .6, z: 1 },
      { a: 208, th: 20, r: .4, c: NAVY2, blur: 14, amp: 2.4, sp: .26, par: .8, z: 1 },
      { a: 166, th: 10, r: .34, c: BLUE, blur: 22, amp: 3, sp: .42, par: .5, z: 2 },
      { a: 172, th: 15, r: .62, c: SKY, blur: 0, amp: 1.8, sp: .38, par: 1.3, z: 4 },
      { a: 197, th: 16, r: .7, c: SKY2, blur: 0, amp: 2.2, sp: .3, par: 1.5, z: 5 },
      { a: 224, th: 14, r: .64, c: ICE, blur: 0, amp: 2.6, sp: .27, par: 1.7, z: 6 },
      { a: 248, th: 13, r: .74, c: SKY, blur: 0, amp: 2.4, sp: .24, par: 1.9, z: 6 },
      { a: 213, th: 5, r: .86, c: '#e3f3fb', blur: 2, amp: 1.6, sp: .2, par: 2.2, z: 7 },
    ]
  });
  const fin = $('[data-final-art]');
  if (fin) Fan(fin, {
    px: w => w < 700 ? 1.05 : .96, py: () => .95, start: 300,
    blades: [
      { a: 282, th: 16, r: .42, c: NAVY2, blur: 14, amp: 2, sp: .3, par: .5, z: 1 },
      { a: 300, th: 10, r: .55, c: SKY, blur: 0, amp: 2, sp: .25, par: 1, z: 3 },
      { a: 316, th: 8, r: .5, c: ICE, blur: 0, amp: 2.5, sp: .3, par: 1.4, z: 4 },
      { a: 330, th: 9, r: .38, c: SKY2, blur: 6, amp: 2, sp: .35, par: 1.2, z: 2 },
    ]
  });

  /* ── Count-up ── */
  const fmt = (n, sep) => sep ? n.toLocaleString('en-US') : String(n);
  const cio = new IntersectionObserver(es => es.forEach(e => {
    if (!e.isIntersecting) return; cio.unobserve(e.target);
    const el = e.target, end = +el.dataset.count, pre = el.dataset.prefix || '', suf = el.dataset.suffix || '', sep = 'sep' in el.dataset;
    if (RM) return; const t0 = performance.now();
    const step = now => { const p = clamp((now - t0) / 1600, 0, 1), v = Math.round(end * (1 - Math.pow(1 - p, 3)));
      el.textContent = pre + fmt(v, sep) + suf; if (p < 1) requestAnimationFrame(step); };
    requestAnimationFrame(step);
  }), { threshold: .6 });
  $$('[data-count]').forEach(el => cio.observe(el));

  /* ── Story (pinned) ── */
  const story = $('[data-story]'), lines = $$('[data-line]'), tags = $$('[data-tag]'), gem = $('[data-gem] svg');
  const onStory = () => {
    if (!story || innerWidth < 992) return;
    const r = story.getBoundingClientRect(), p = clamp(-r.top / (r.height - innerHeight), 0, 1);
    lines.forEach((l, i) => l.classList.toggle('is-on', i === (p < .5 ? 0 : 1)));
    tags.forEach((t, i) => t.classList.toggle('is-on', p > i * .22 + .05));
    gem.style.setProperty('--rot', (p * 120 - 20) + 'deg'); gem.style.setProperty('--sc', .9 + Math.sin(p * Math.PI) * .15);
  };

  /* ── Slider: dots, drag, keyboard ── */
  $$('[data-slider]').forEach(s => {
    const track = $('[data-track]', s), slides = $$('.slide', track), dots = $('[data-dots]', s);
    const btns = slides.map((sl, i) => {
      const b = d.createElement('button'); b.setAttribute('role', 'tab'); b.setAttribute('aria-label', `Problem ${i + 1}`);
      b.addEventListener('click', () => track.scrollTo({ left: sl.offsetLeft - slides[0].offsetLeft, behavior: RM ? 'auto' : 'smooth' }));
      dots.appendChild(b); return b;
    });
    const sync = () => {
      const max = track.scrollWidth - track.clientWidth;
      const idx = max <= 0 ? 0 : Math.round(track.scrollLeft / max * (slides.length - 1));
      btns.forEach((b, i) => b.setAttribute('aria-selected', i === idx));
      dots.style.visibility = max <= 4 ? 'hidden' : 'visible';
    };
    track.addEventListener('scroll', sync, { passive: true }); addEventListener('resize', sync); sync();
    let down = false, sx = 0, sl0 = 0, moved = false;
    track.addEventListener('pointerdown', e => { if (e.pointerType !== 'mouse') return; down = true; moved = false; sx = e.clientX; sl0 = track.scrollLeft; track.classList.add('is-drag'); });
    addEventListener('pointermove', e => { if (!down) return; const dx = e.clientX - sx; if (Math.abs(dx) > 3) moved = true; track.scrollLeft = sl0 - dx; });
    addEventListener('pointerup', () => { if (!down) return; down = false; track.classList.remove('is-drag');
      const w = slides[1] ? slides[1].offsetLeft - slides[0].offsetLeft : 1;
      const i = clamp(Math.round(track.scrollLeft / w), 0, slides.length - 1);
      track.scrollTo({ left: i * w, behavior: RM ? 'auto' : 'smooth' }); });
  });

  /* ── Solution list: highlight the row nearest viewport centre ── */
  const rows = $$('[data-prow]');
  const onRows = () => {
    const c = innerHeight * .5; let best = null, bd = 1e9;
    rows.forEach(r => { const b = r.getBoundingClientRect(), dd = Math.abs(b.top + b.height / 2 - c); if (dd < bd) { bd = dd; best = r; } });
    rows.forEach(r => r.classList.toggle('is-on', r === best && bd < innerHeight * .45));
  };

  /* ── Flow rail progress + meeting parallax ── */
  const flow = $('[data-flow]'), rail = $('[data-rail]'), px = $('[data-parallax]');
  const onFlow = () => {
    if (rail) { const r = flow.getBoundingClientRect(); rail.style.setProperty('--p', clamp((innerHeight * .85 - r.top) / (r.height * .8), 0, 1)); }
    if (px && !RM) { const r = px.parentElement.parentElement.getBoundingClientRect(); px.style.setProperty('--py', ((r.top + r.height / 2 - innerHeight / 2) * -.12) + 'px'); }
  };

  /* ── Tabs (WAI-ARIA) ── */
  $$('[data-tabs]').forEach(t => {
    const tabs = $$('[role=tab]', t);
    const sel = tab => tabs.forEach(x => { const on = x === tab; x.setAttribute('aria-selected', on); x.tabIndex = on ? 0 : -1;
      const p = d.getElementById(x.getAttribute('aria-controls')); p.hidden = !on; p.classList.toggle('is-active', on); });
    tabs.forEach((x, i) => {
      x.addEventListener('click', () => sel(x));
      x.addEventListener('keydown', e => { const k = { ArrowDown: 1, ArrowRight: 1, ArrowUp: -1, ArrowLeft: -1 }[e.key];
        if (k) { e.preventDefault(); const n = tabs[(i + k + tabs.length) % tabs.length]; sel(n); n.focus(); } });
    });
  });

  /* ── Single rAF-throttled scroll loop ── */
  let ticking = false;
  const onScroll = () => { if (ticking) return; ticking = true; requestAnimationFrame(() => { onNav(); onStory(); onRows(); onFlow(); ticking = false; }); };
  addEventListener('scroll', onScroll, { passive: true }); addEventListener('resize', onScroll); onScroll();
})();
