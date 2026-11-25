/* FundTrustIQ — interaction layer. Lenis (js/vendor/lenis.min.js) is the only dependency. */
(() => {
  const d = document, root = d.documentElement;
  const RM = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const $ = (s, c = d) => c.querySelector(s), $$ = (s, c = d) => [...c.querySelectorAll(s)];
  const clamp = (v, a, b) => Math.min(b, Math.max(a, v));
  const yr = $('[data-year]'); if (yr) yr.textContent = new Date().getFullYear();

  /* Hero time-savings toggle: #hero-h[data-less-time].
     Empty attribute leaves the clause out. "40" renders "in up to 40% less time".
     Only a finite number greater than zero is inserted. See README. */
  const heroH = $('#hero-h');
  if (heroH) {
    const raw = heroH.getAttribute('data-less-time');
    const n = raw == null || String(raw).trim() === '' ? NaN : Number(raw);
    if (Number.isFinite(n) && n > 0) {
      const next = heroH.innerHTML.replace('tracked actions,', `tracked actions in up to ${Math.round(n)}% less time,`);
      if (next !== heroH.innerHTML) { heroH.innerHTML = next; heroH.classList.add('has-metric'); }
    }
  }

  /* ── Split headline into masked words. NBSP stays inside a word so "1940 Act" won't break. ── */
  $$('[data-split]').forEach(el => {
    let i = 0;
    el.innerHTML = el.innerHTML.split(/(<br\s*\/?>)/).map(part =>
      /^<br/.test(part) ? part : part.trim().split(/[ \t\n\r]+/).filter(Boolean).map(w => `<span class="w"><span style="--i:${i++}">${w}</span></span>`).join(' ')
    ).join('');
  });
  const markReady = () => { if (!root.classList.contains('is-ready')) requestAnimationFrame(() => root.classList.add('is-ready')); };
  const fontLoads = (d.fonts && d.fonts.load)
    ? Promise.all([
        d.fonts.load('400 64px "FT Display"'),
        d.fonts.load('500 18px "FT Sans"')
      ]).catch(() => {})
    : Promise.resolve();
  /* Wait for the preloaded faces so the reveal doesn't swap mid-animation, but don't hang. */
  Promise.race([fontLoads, new Promise(r => setTimeout(r, 1800))]).then(markReady);

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
    // Accumulate sub-pixel inertia frames, then apply the same 2px threshold.
    const dy = y - lastY;
    if (dy > 2) {
      if (y > 480 && !menuOpen) nav.classList.add('is-hidden');
      lastY = y;
    } else if (dy < -2) {
      nav.classList.remove('is-hidden');
      lastY = y;
    }
  };

  /* ── Platform dropdown (optional — removed from markup when unused) ── */
  const mBtn = $('[data-menu-btn]'), menu = $('[data-menu]');
  const item = mBtn ? mBtn.closest('.nav__item') : null;
  let mT;
  const setMenu = open => {
    if (!menu || !mBtn) return;
    menu.classList.toggle('is-open', open);
    mBtn.setAttribute('aria-expanded', open);
  };
  if (mBtn && menu && item) {
    mBtn.addEventListener('click', () => setMenu(mBtn.getAttribute('aria-expanded') !== 'true'));
    item.addEventListener('mouseenter', () => { clearTimeout(mT); setMenu(true); });
    item.addEventListener('mouseleave', () => { mT = setTimeout(() => setMenu(false), 160); });
    item.addEventListener('focusout', e => { if (!item.contains(e.relatedTarget)) setMenu(false); });
    $$('a', menu).forEach(a => a.addEventListener('click', () => setMenu(false)));
  }

  /* ── Mobile menu ── */
  const burger = $('[data-burger]'), mm = $('[data-mobile-menu]');
  const toggleMobile = open => {
    if (!burger || !mm) return;
    open = open ?? burger.getAttribute('aria-expanded') !== 'true';
    burger.setAttribute('aria-expanded', open); burger.setAttribute('aria-label', open ? 'Close menu' : 'Open menu');
    mm.hidden = !open; nav.classList.toggle('is-scrolled', open || scrollY > 20);
  };
  if (burger && mm) {
    burger.addEventListener('click', () => toggleMobile());
    $$('a', mm).forEach(a => a.addEventListener('click', () => toggleMobile(false)));
  }
  d.addEventListener('keydown', e => { if (e.key === 'Escape') { setMenu(false); toggleMobile(false); } });

  /* ── Marquee: duplicate for seamless loop ── */
  $$('[data-marquee] .marquee__track').forEach(t => {
    $$('li', t).forEach(li => { const c = li.cloneNode(true); c.setAttribute('aria-hidden', 'true'); t.appendChild(c); });
  });

  /* ── Hero "blades": triangle fan. Blur is baked once into a bitmap.
     Each frame writes transform only. The loop pauses while scrolling,
     offscreen, or in a hidden tab. Pointer parallax is one shared sample. ── */
  const fanLoops = [];
  let scrollHold = false, scrollHoldTimer = 0, lastScrollY = scrollY, pageVisible = !document.hidden;
  let pointerX = 0, pointerY = 0, pointerBound = false;
  const bindPointer = () => {
    if (pointerBound || RM) return;
    pointerBound = true;
    addEventListener('pointermove', e => {
      if (scrollHold || !pageVisible) return;
      pointerX = clamp((e.clientX / innerWidth - .5) * 2, -1, 1);
      pointerY = clamp((e.clientY / innerHeight - .5) * 2, -1, 1);
    }, { passive: true });
  };
  const noteScrollHold = () => {
    const y = scrollY;
    if (y === lastScrollY) return;
    lastScrollY = y;
    if (!scrollHold) { scrollHold = true; fanLoops.forEach(f => f.hold()); }
    clearTimeout(scrollHoldTimer);
    scrollHoldTimer = setTimeout(() => { scrollHold = false; fanLoops.forEach(f => f.release()); }, 180);
  };
  document.addEventListener('visibilitychange', () => {
    pageVisible = !document.hidden;
    fanLoops.forEach(f => f.sync());
  });

  function Fan(host, opts) {
    const blades = opts.blades.map((b, i) => {
      const baked = b.blur > 0.5;
      const el = d.createElement(baked ? 'canvas' : 'div');
      el.className = baked ? 'blade blade--baked' : 'blade';
      if (!baked) { el.style.setProperty('--c', b.c); el.style.setProperty('--th', b.th + 'deg'); }
      el.style.zIndex = String(b.z ?? i);
      host.appendChild(el);
      return { el, baked, ...b, phase: i * 1.37, R: 0, px: 0, py: 0, size: 0 };
    });
    let elapsed = 0, lastNow = 0, lx = 0, ly = 0, vis = false, raf = 0, running = false, resizeT = 0;

    const bake = b => {
      const blur = b.blur, diameter = Math.max(2, 2 * b.R), pad = Math.ceil(blur * 3 + 2), size = diameter + pad * 2;
      const maxEdge = blur >= 12 ? 520 : 860;
      const drawScale = Math.min(1, maxEdge / size);
      const canvas = b.el, bw = Math.max(1, Math.round(size * drawScale));
      if (canvas.width !== bw) { canvas.width = bw; canvas.height = bw; }
      canvas.style.width = size + 'px'; canvas.style.height = size + 'px';
      const ctx = canvas.getContext('2d', { alpha: true });
      ctx.setTransform(drawScale, 0, 0, drawScale, 0, 0);
      ctx.clearRect(0, 0, size, size);
      ctx.save();
      ctx.filter = `blur(${blur}px)`;
      ctx.translate(size / 2, size / 2);
      ctx.beginPath();
      const a0 = -Math.PI / 2 + 0.004, a1 = a0 + Math.max(0.01, b.th * Math.PI / 180) - 0.008;
      ctx.moveTo(0, 0); ctx.arc(0, 0, diameter / 2, a0, a1); ctx.closePath();
      ctx.fillStyle = b.c; ctx.fill();
      ctx.restore();
      b.size = size;
    };
    const apply = () => {
      const intro = RM ? 1 : 1 - Math.pow(1 - clamp(elapsed / 2.6, 0, 1), 4);
      blades.forEach(b => {
        const sway = RM ? 0 : Math.sin(elapsed * b.sp + b.phase) * b.amp;
        const a = opts.start + (b.a - opts.start) * intro + sway + lx * b.par;
        const half = b.baked ? (b.size || 2 * b.R) / 2 : b.R;
        const x = b.px - half + lx * b.par * 5, y = b.py - half + ly * b.par * 5;
        b.el.style.transform = `translate3d(${x.toFixed(1)}px,${y.toFixed(1)}px,0) rotate(${a.toFixed(2)}deg)`;
      });
    };
    const layout = () => {
      const w = host.clientWidth, h = host.clientHeight;
      if (w < 2 || h < 2) return;
      const s = opts.scale ? opts.scale(w, h) : Math.max(w, h * 1.4);
      const px = w * opts.px(w), py = h * opts.py(w);
      blades.forEach(b => {
        const R = s * b.r, changed = Math.abs(R - b.R) > 1.5;
        b.R = R; b.px = px; b.py = py;
        if (!b.baked) b.el.style.setProperty('--d', (2 * R) + 'px');
        else if (changed || !b.el.width) bake(b);
      });
      apply();
    };
    const shouldRun = () => !RM && vis && pageVisible && !scrollHold;
    const schedule = () => { if (running || !shouldRun()) return; running = true; raf = requestAnimationFrame(frame); };
    const frame = now => {
      running = false;
      if (!shouldRun()) return;
      if (!lastNow) { lastNow = now; schedule(); return; }
      const dt = Math.min(.05, (now - lastNow) / 1000);
      lastNow = now; elapsed += dt;
      lx += (pointerX - lx) * .05; ly += (pointerY - ly) * .05;
      if (Math.abs(pointerX - lx) < .001) lx = pointerX;
      if (Math.abs(pointerY - ly) < .001) ly = pointerY;
      apply(); schedule();
    };
    const api = {
      hold() { cancelAnimationFrame(raf); running = false; },
      release() { lastNow = 0; schedule(); },
      sync() { if (shouldRun()) { lastNow = 0; schedule(); } else { cancelAnimationFrame(raf); running = false; } }
    };
    fanLoops.push(api);
    addEventListener('resize', () => { clearTimeout(resizeT); resizeT = setTimeout(layout, 120); }, { passive: true });
    if (RM) { vis = true; layout(); return; }
    bindPointer();
    new IntersectionObserver(([e]) => { vis = e.isIntersecting; if (vis) layout(); api.sync(); }).observe(host);
    const r = host.getBoundingClientRect();
    if (r.bottom > 0 && r.top < innerHeight) { vis = true; layout(); }
    api.sync();
  }
  /* Hero blade palette + geometry restored from the last known-good deploy (#13). */
  const SKY = '#c4e8f8', SKY2 = '#9fd6f2', NAVY = '#14315f', NAVY2 = '#1f396d', ICE = '#f7fbfd', BLUE = '#2a7fba';
  const hero = $('[data-hero-art]');
  // a = start angle (0 = 12 o'clock, clockwise), th = wedge width, r = radius × viewport
  // Classic blade geometry (#13); pivot nudged right so wedges sit beside left copy.
  if (hero) Fan(hero, {
    px: w => w < 700 ? 1.0 : .98, py: w => w < 700 ? .05 : .07, start: 168,
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

  /* ── Solution list: highlight the row nearest viewport centre ── */
  const rows = $$('[data-prow]');
  const onRows = () => {
    const c = innerHeight * .5; let best = null, bd = 1e9;
    rows.forEach(r => { const b = r.getBoundingClientRect(), dd = Math.abs(b.top + b.height / 2 - c); if (dd < bd) { bd = dd; best = r; } });
    rows.forEach(r => r.classList.toggle('is-on', r === best && bd < innerHeight * .45));
  };

  /* ── Meeting parallax ── */
  const px = $('[data-parallax]');
  const onParallax = () => {
    if (px && !RM) { const r = px.parentElement.parentElement.getBoundingClientRect(); px.style.setProperty('--py', ((r.top + r.height / 2 - innerHeight / 2) * -.12) + 'px'); }
  };

  /* ── Platform modules structure UI ── */
  $$('[data-apps]').forEach(root => {
    const tabs = $$('.apps__pills [role=tab]', root);
    const panels = tabs.map(t => d.getElementById(t.getAttribute('aria-controls')));
    const prev = $('[data-apps-prev]', root);
    const next = $('[data-apps-next]', root);
    let index = Math.max(0, tabs.findIndex(t => t.getAttribute('aria-selected') === 'true'));

    const bindAccordion = panel => {
      const side = $('[data-apps-side]', panel);
      if (!side || side.dataset.bound) return;
      side.dataset.bound = '1';
      $$('.apps__acc', side).forEach(acc => {
        const btn = $('.apps__acc-btn', acc);
        const list = $('.apps__checks', acc);
        if (!btn || !list) return;
        btn.addEventListener('click', () => {
          const open = !acc.classList.contains('is-open');
          $$('.apps__acc', side).forEach(other => {
            const on = other === acc && open;
            other.classList.toggle('is-open', on);
            const b = $('.apps__acc-btn', other), l = $('.apps__checks', other);
            if (b) b.setAttribute('aria-expanded', on ? 'true' : 'false');
            if (l) l.hidden = !on;
          });
        });
      });
    };

    const show = i => {
      index = (i + tabs.length) % tabs.length;
      tabs.forEach((t, n) => {
        const on = n === index;
        t.setAttribute('aria-selected', on);
        t.tabIndex = on ? 0 : -1;
        const p = panels[n];
        if (!p) return;
        p.hidden = !on;
        p.classList.toggle('is-active', on);
        if (on) bindAccordion(p);
      });
    };

    tabs.forEach((t, i) => {
      t.addEventListener('click', () => show(i));
      t.addEventListener('keydown', e => {
        const k = { ArrowRight: 1, ArrowLeft: -1, Home: 'home', End: 'end' }[e.key];
        if (k == null) return;
        e.preventDefault();
        if (k === 'home') show(0);
        else if (k === 'end') show(tabs.length - 1);
        else show(i + k);
        tabs[index].focus();
      });
    });
    if (prev) prev.addEventListener('click', () => show(index - 1));
    if (next) next.addEventListener('click', () => show(index + 1));
    show(index);
  });

  /* ── Product demo: 4 steps, loading phases, autoplay only while in view ── */
  let onTimeline = () => {};
  const STEP_MS = 7800;
  const demo = $('[data-demo]');
  if (demo) {
    const tabs = $$('[role="tab"]', demo);
    const panels = tabs.map(t => d.getElementById(t.getAttribute('aria-controls')));
    const autoBtn = $('[data-demo-auto]', demo);
    const autoLabel = $('[data-demo-auto-label]', demo);
    const os = $('[data-os]', demo);
    let index = 0, playing = !RM, inView = false, token = 0, timers = [], autoT = 0;

    const clearTimers = () => { timers.forEach(clearTimeout); timers = []; };
    const clearAuto = () => { clearTimeout(autoT); autoT = 0; };
    const later = (ms, fn) => { timers.push(setTimeout(fn, ms)); };
    const syncAutoBtn = () => {
      if (!autoBtn) return;
      autoBtn.setAttribute('aria-pressed', playing ? 'true' : 'false');
      if (autoLabel) autoLabel.textContent = playing ? 'Autoplay on' : 'Autoplay off';
    };
    const restartBars = () => {
      tabs.forEach(tab => {
        const bar = $('.demo__bar', tab);
        if (!bar) return;
        bar.style.transition = 'none';
        bar.style.transform = 'scaleX(0)';
      });
      if (!playing || RM || !inView) return;
      const bar = $('.demo__bar', tabs[index]);
      if (!bar) return;
      requestAnimationFrame(() => {
        bar.style.transition = `transform ${STEP_MS}ms linear`;
        bar.style.transform = 'scaleX(1)';
      });
    };
    const arm = () => {
      clearAuto();
      if (!playing || !inView || RM || d.hidden) return;
      autoT = setTimeout(() => show((index + 1) % tabs.length, { auto: true }), STEP_MS);
    };
    const userPause = () => {
      if (!playing) return;
      playing = false;
      syncAutoBtn();
      clearAuto();
      restartBars();
    };
    const setPhase = (panel, phase) => {
      panel.dataset.phase = phase;
      panel.setAttribute('aria-busy', phase === 'ready' ? 'false' : 'true');
      const meter = $('[role="progressbar"]', panel);
      const vals = { load: 6, '1': 35, '2': 62, '3': 84, ready: 100 };
      if (meter) meter.setAttribute('aria-valuenow', String(vals[phase] ?? 0));
      if (phase === '2') runStream(panel);
      if (phase === 'ready') {
        const el = $('[data-stream]', panel);
        if (el && el.dataset.full) el.textContent = el.dataset.full;
      }
    };
    const runStream = panel => {
      const el = $('[data-stream]', panel);
      if (!el) return;
      const full = el.dataset.full || (el.dataset.full = el.textContent.replace(/\s+/g, ' ').trim());
      if (RM) { el.textContent = full; return; }
      const words = full.split(' ');
      const my = token;
      el.textContent = '';
      let i = 0;
      const step = () => {
        if (my !== token || panel.dataset.phase === 'ready') { el.textContent = full; return; }
        el.textContent = words.slice(0, ++i).join(' ');
        if (i < words.length) later(36, step);
      };
      step();
    };
    const show = i => {
      index = i;
      token++;
      clearTimers();
      tabs.forEach((tab, n) => {
        const on = n === i;
        tab.setAttribute('aria-selected', on ? 'true' : 'false');
        tab.tabIndex = on ? 0 : -1;
        panels[n].hidden = !on;
      });
      const panel = panels[i];
      const stream = $('[data-stream]', panel);
      if (stream && !stream.dataset.full) stream.dataset.full = stream.textContent.replace(/\s+/g, ' ').trim();
      if (RM) { setPhase(panel, 'ready'); }
      else {
        setPhase(panel, 'load');
        const my = token;
        [[280, '1'], [640, '2'], [980, '3'], [1320, 'ready']].forEach(([ms, phase]) => {
          later(ms, () => { if (my !== token || !inView) return; setPhase(panel, phase); });
        });
      }
      restartBars();
      arm();
    };
    tabs.forEach((tab, i) => {
      tab.addEventListener('click', () => { userPause(); show(i); });
      tab.addEventListener('keydown', e => {
        const dir = { ArrowRight: 1, ArrowDown: 1, ArrowLeft: -1, ArrowUp: -1 }[e.key];
        let n = null;
        if (dir) n = (i + dir + tabs.length) % tabs.length;
        else if (e.key === 'Home') n = 0;
        else if (e.key === 'End') n = tabs.length - 1;
        if (n == null) return;
        e.preventDefault();
        userPause();
        show(n);
        tabs[n].focus();
      });
    });
    if (autoBtn) autoBtn.addEventListener('click', () => {
      playing = !playing;
      syncAutoBtn();
      if (playing) { restartBars(); arm(); }
      else { clearAuto(); restartBars(); }
    });
    if (os) {
      os.addEventListener('pointerdown', () => userPause());
      os.addEventListener('keydown', e => { if (e.key !== 'Tab') userPause(); });
      os.addEventListener('click', e => {
        const cite = e.target.closest('[data-cite]');
        if (cite) {
          const el = d.getElementById(cite.getAttribute('data-cite'));
          if (!el) return;
          el.classList.remove('is-jumped');
          void el.offsetWidth;
          el.classList.add('is-jumped');
          el.focus({ preventScroll: true });
          el.scrollIntoView({ block: 'nearest', behavior: RM ? 'auto' : 'smooth' });
          return;
        }
        const role = e.target.closest('[data-role]');
        if (!role) return;
        const scene = role.closest('.scene');
        $$('[data-role]', scene).forEach(b => b.setAttribute('aria-pressed', b === role ? 'true' : 'false'));
        $$('[data-role-panel]', scene).forEach(p => { p.hidden = p.getAttribute('data-role-panel') !== role.getAttribute('data-role'); });
      });
    }
    syncAutoBtn();
    setPhase(panels[0], RM ? 'ready' : 'load');
    const setLive = on => {
      const was = inView;
      inView = on;
      demo.classList.toggle('is-live', on);
      if (!on) { clearTimers(); clearAuto(); return; }
      if (!was) {
        if (!RM && panels[index].dataset.phase !== 'ready') show(index);
        else arm();
      }
    };
    new IntersectionObserver(([e]) => setLive(e.isIntersecting && e.intersectionRatio >= 0.35), { threshold: [0, 0.35, 0.7] }).observe(os || demo);
    document.addEventListener('visibilitychange', () => {
      if (d.hidden) { clearTimers(); clearAuto(); }
      else if (inView) {
        if (!RM && panels[index].dataset.phase !== 'ready') show(index);
        else arm();
      }
    });
  }

  /* ── Governance ECG timeline. Path from dots; steps walk 01→04 in a loop. ── */
  const timeline = $('[data-timeline]');
  if (timeline) {
    const svg = $('[data-ecg-svg]', timeline);
    const draw = $('[data-ecg]', timeline);
    const base = $('[data-ecg-base]', timeline);
    const beats = $$('[data-beat]', timeline);
    const points = beats.map(b => b.closest('.tpoint'));
    const grad = $('#ecg-grad');
    const STEP_MS = 2400;
    let sig = '', step = 0, timer = null, inView = false;
    const build = (pts, vertical, w, h) => {
      const n = v => v.toFixed(1);
      if (!pts.length) return '';
      if (!vertical) {
        let path = `M 0 ${n(pts[0].y)}`;
        pts.forEach(p => {
          path += ` L ${n(p.x - 42)} ${n(p.y)} L ${n(p.x - 24)} ${n(p.y + 8)} L ${n(p.x - 10)} ${n(p.y - 6)} L ${n(p.x)} ${n(p.y - 38)} L ${n(p.x + 9)} ${n(p.y + 12)} L ${n(p.x + 24)} ${n(p.y)}`;
        });
        return path + ` L ${n(w)} ${n(pts[pts.length - 1].y)}`;
      }
      let path = `M ${n(pts[0].x)} 0`;
      pts.forEach(p => {
        path += ` L ${n(p.x)} ${n(p.y - 32)} L ${n(p.x - 8)} ${n(p.y - 14)} L ${n(p.x + 22)} ${n(p.y)} L ${n(p.x - 9)} ${n(p.y + 11)} L ${n(p.x)} ${n(p.y + 26)}`;
      });
      return path + ` L ${n(pts[pts.length - 1].x)} ${n(h)}`;
    };
    const paintStep = i => {
      if (!points.length) return;
      points.forEach((el, idx) => el.classList.toggle('is-on', idx === i));
      const p = (i + 1) / points.length;
      draw.style.strokeDashoffset = String(1 - p);
    };
    const stopWalk = () => { if (timer) { clearInterval(timer); timer = null; } };
    const startWalk = () => {
      if (RM || timer || !points.length) return;
      paintStep(step);
      timer = setInterval(() => {
        step = (step + 1) % points.length;
        paintStep(step);
      }, STEP_MS);
    };
    const layoutTimeline = () => {
      const w = timeline.clientWidth, h = timeline.clientHeight;
      if (w < 2 || h < 2) return;
      const vertical = matchMedia('(max-width: 991px)').matches;
      const host = timeline.getBoundingClientRect();
      const pts = beats.map(dot => {
        const r = dot.getBoundingClientRect();
        return { x: r.left + r.width / 2 - host.left, y: r.top + r.height / 2 - host.top };
      });
      const next = (vertical ? 'v' : 'h') + ':' + w + 'x' + h + ':' + pts.map(p => p.x.toFixed(0) + ',' + p.y.toFixed(0)).join(';');
      if (next === sig) return;
      sig = next;
      svg.setAttribute('viewBox', `0 0 ${w} ${h}`);
      if (grad) {
        grad.setAttribute('x1', '0'); grad.setAttribute('y1', '0');
        grad.setAttribute('x2', vertical ? '0' : String(w));
        grad.setAttribute('y2', vertical ? String(h) : '0');
      }
      const dAttr = build(pts, vertical, w, h);
      base.setAttribute('d', dAttr);
      draw.setAttribute('d', dAttr);
      if (RM) {
        draw.style.strokeDashoffset = '0';
        points.forEach(p => p.classList.add('is-on'));
      } else paintStep(step);
    };
    onTimeline = () => {};
    layoutTimeline();
    if (window.ResizeObserver) new ResizeObserver(() => layoutTimeline()).observe(timeline);
    else addEventListener('resize', layoutTimeline);
    if (d.fonts && d.fonts.ready) d.fonts.ready.then(layoutTimeline);
    if (RM) points.forEach(p => p.classList.add('is-on'));
    else {
      const tio = new IntersectionObserver(es => es.forEach(e => {
        inView = e.isIntersecting;
        if (inView) startWalk();
        else stopWalk();
      }), { threshold: .28 });
      tio.observe(timeline);
      d.addEventListener('visibilitychange', () => {
        if (d.hidden) stopWalk();
        else if (inView) startWalk();
      });
    }
  }

  /* ── Scroll sync. Lenis emits on the same frame it moves the window. ── */
  const syncScroll = () => { noteScrollHold(); onNav(); onRows(); onParallax(); onTimeline(); };
  let ticking = false;
  const onNativeScroll = () => {
    if (ticking) return;
    ticking = true;
    requestAnimationFrame(() => { syncScroll(); ticking = false; });
  };
  let nativeScrollBound = false;
  const bindNative = () => {
    if (nativeScrollBound) return;
    addEventListener('scroll', onNativeScroll, { passive: true });
    nativeScrollBound = true;
  };
  const unbindNative = () => {
    if (!nativeScrollBound) return;
    removeEventListener('scroll', onNativeScroll);
    nativeScrollBound = false;
  };

  /* ── Inertia smooth scroll. Off for reduced motion and touch (native scroll). ── */
  const motion = matchMedia('(prefers-reduced-motion: reduce)');
  const finePointer = matchMedia('(pointer: fine)');
  let lenis = null;

  const scrollToHash = (hash, immediate) => {
    const id = decodeURIComponent(hash);
    if (id === '#' || (id === '#top' && !$('#top'))) { lenis.scrollTo(0, { immediate }); return; }
    const target = id.startsWith('#') ? d.getElementById(id.slice(1)) : null;
    if (!target) return;
    // Lenis subtracts html scroll-padding-top, which clears the sticky nav.
    lenis.scrollTo(target, { immediate });
  };
  const onAnchorClick = event => {
    if (!lenis || event.defaultPrevented || event.button !== 0) return;
    if (event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
    const link = event.target instanceof Element ? event.target.closest('a[href]') : null;
    if (!link) return;
    let url;
    try { url = new URL(link.href, location.href); } catch { return; }
    if (url.origin !== location.origin || url.pathname !== location.pathname || url.hash.length < 2) return;
    const id = decodeURIComponent(url.hash);
    if (id !== '#top' && !d.getElementById(id.slice(1))) return;
    event.preventDefault();
    if (location.hash !== url.hash) history.pushState(null, '', url.hash);
    scrollToHash(url.hash, false);
  };
  const onPopState = () => { if (lenis) scrollToHash(location.hash || '#', false); };

  const startLenis = () => {
    if (lenis || typeof Lenis !== 'function' || motion.matches || !finePointer.matches) return;
    lenis = new Lenis({
      autoRaf: true,
      lerp: 0.08,          /* inertia glide, in the range of a Greenlock-style wheel */
      smoothWheel: true,
      syncTouch: false,
      allowNestedScroll: true,
      stopInertiaOnNavigate: true
    });
    lenis.on('scroll', syncScroll);
    d.addEventListener('click', onAnchorClick, true);
    addEventListener('popstate', onPopState);
    unbindNative();
  };
  const stopLenis = () => {
    if (!lenis) return;
    lenis.destroy();
    lenis = null;
    d.removeEventListener('click', onAnchorClick, true);
    removeEventListener('popstate', onPopState);
    bindNative();
    syncScroll();
  };

  if (!motion.matches && finePointer.matches) startLenis();
  else bindNative();
  motion.addEventListener('change', () => { if (motion.matches) stopLenis(); else startLenis(); });
  addEventListener('resize', onNativeScroll);
  syncScroll();
})();
