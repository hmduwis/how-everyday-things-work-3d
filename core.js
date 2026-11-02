/* How Things Work 3D — shared engine: helpers, routing, UI and render loop. */
(function () {
  var HTW = window.HTW = { machines: [], define: function (d) { this.machines.push(d); } };
  var T = window.THREE;
  var H = HTW.H = {};

  if (T) {
    H.v = function (x, y, z) { return new T.Vector3(x, y, z); };
    H.metal = function (c, o) { var m = new T.MeshStandardMaterial({ color: c, metalness: 0.55, roughness: 0.38 }); if (o) Object.assign(m, o); return m; };
    H.matte = function (c, o) { var m = new T.MeshStandardMaterial({ color: c, metalness: 0.05, roughness: 0.75 }); if (o) Object.assign(m, o); return m; };
    H.glass = function (c, op) {
      return new T.MeshStandardMaterial({ color: c, transparent: true, opacity: op == null ? 0.25 : op, roughness: 0.15, metalness: 0.1, side: T.DoubleSide, depthWrite: false });
    };
    H.basic = function (c, op) { return new T.MeshBasicMaterial({ color: c, transparent: op != null, opacity: op == null ? 1 : op, depthWrite: op == null }); };
    H.mesh = function (g, m, x, y, z) { var o = new T.Mesh(g, m); o.position.set(x || 0, y || 0, z || 0); return o; };
    H.box = function (w, h, d, m, x, y, z) { return H.mesh(new T.BoxGeometry(w, h, d), m, x, y, z); };
    H.cyl = function (rt, rb, h, m, x, y, z, seg, open) { return H.mesh(new T.CylinderGeometry(rt, rb, h, seg || 32, 1, !!open), m, x, y, z); };
    H.sph = function (r, m, x, y, z) { return H.mesh(new T.SphereGeometry(r, 20, 14), m, x, y, z); };
    H.torus = function (r, t, m, x, y, z) { return H.mesh(new T.TorusGeometry(r, t, 10, 48), m, x, y, z); };
    var UP = new T.Vector3(0, 1, 0);
    H.between = function (a, b, r, m, open) {
      var d = new T.Vector3().subVectors(b, a), len = d.length();
      var o = new T.Mesh(new T.CylinderGeometry(r, r, len, 20, 1, !!open), m);
      o.position.copy(a).addScaledVector(d, 0.5);
      o.quaternion.setFromUnitVectors(UP, d.normalize());
      return o;
    };
    H.curve = function (pts, closed) { return new T.CatmullRomCurve3(pts, !!closed, 'catmullrom', 0.15); };
    H.tube = function (pts, r, m, closed) {
      var c = H.curve(pts, closed);
      var o = new T.Mesh(new T.TubeGeometry(c, Math.max(48, pts.length * 16), r, 10, !!closed), m);
      o.userData.curve = c; return o;
    };
    // Zigzag coil points in a vertical plane: x from x0 to x0+w, rows going up from y0
    H.coil = function (x0, y0, z, w, h, rows) {
      var pts = [];
      for (var i = 0; i <= rows; i++) {
        var y = y0 + (h * i) / rows, l = i % 2 === 0;
        pts.push(new T.Vector3(l ? x0 : x0 + w, y, z), new T.Vector3(l ? x0 + w : x0, y, z));
      }
      return pts;
    };
    H.stream = function (parent, n, color, r) {
      var a = [];
      for (var i = 0; i < n; i++) {
        var p = new T.Mesh(new T.SphereGeometry(r || 0.045, 10, 8), new T.MeshBasicMaterial({ color: color, transparent: true, opacity: 0.9 }));
        parent.add(p); a.push(p);
      }
      return a;
    };
    // Move a stream of beads along a curve. opt: { speed, visible, opacity, color(u, mesh) }
    H.flow = function (stream, curve, t, opt) {
      opt = opt || {};
      var n = stream.length, sp = opt.speed == null ? 0.25 : opt.speed;
      stream.forEach(function (m, i) {
        m.visible = opt.visible !== false;
        if (!m.visible) return;
        var u = (((t * sp + i / n) % 1) + 1) % 1;
        if (opt.range) u = opt.range[0] + u * (opt.range[1] - opt.range[0]);
        m.position.copy(curve.getPointAt(u));
        if (opt.opacity != null) m.material.opacity = opt.opacity;
        if (opt.color) opt.color(u, m);
      });
    };
    H.clamp = function (x, a, b) { return Math.max(a, Math.min(b, x)); };
    H.lerp = function (a, b, t) { return a + (b - a) * t; };
    H.smooth = function (x) { x = H.clamp(x, 0, 1); return x * x * (3 - 2 * x); };
    H.pulse = function (x) { return Math.sin(Math.PI * H.clamp(x, 0, 1)); };
    H.canvasTex = function (w, h, draw) {
      var c = document.createElement('canvas'); c.width = w; c.height = h;
      draw(c.getContext('2d'), w, h);
      var t = new T.CanvasTexture(c); t.encoding = T.sRGBEncoding; t.anisotropy = 4; return t;
    };
    H.textPlane = function (text, w, h, opts) {
      opts = opts || {};
      var tex = H.canvasTex(512, Math.round(512 * h / w), function (g, cw, ch) {
        g.fillStyle = opts.bg || 'rgba(0,0,0,0)'; g.fillRect(0, 0, cw, ch);
        g.fillStyle = opts.color || '#ffffff';
        g.font = '700 ' + Math.round(ch * (opts.size || 0.55)) + 'px "Chakra Petch", sans-serif';
        g.textAlign = 'center'; g.textBaseline = 'middle'; g.fillText(text, cw / 2, ch / 2);
      });
      return new T.Mesh(new T.PlaneGeometry(w, h), new T.MeshBasicMaterial({ map: tex, transparent: true, side: T.DoubleSide }));
    };
    H.COLORS = { cold: 0x3d8ef0, hot: 0xff5a1f, warm: 0xffa040, smoke: 0x8a8f96, water: 0x4aa3ff, air: 0xbfe3ff, gas: 0xf2d24b, electron: 0x7cf2ff, light: 0xfff2a8, good: 0x3cc26b, bad: 0x8a5a2b };
  }

  // ----- App -----
  var $ = function (id) { return document.getElementById(id); };
  var app = {};

  HTW.start = function () {
    var reduce = window.matchMedia && matchMedia('(prefers-reduced-motion: reduce)').matches;
    var M = HTW.machines, byId = {};
    M.forEach(function (m) { byId[m.id] = m; });

    // Home catalogue
    var groups = [];
    M.forEach(function (m) { if (groups.indexOf(m.group) < 0) groups.push(m.group); });
    groups.forEach(function (gname) {
      var sec = document.createElement('div'); sec.className = 'group';
      var h = document.createElement('h2'); h.textContent = gname; sec.appendChild(h);
      var cards = document.createElement('div'); cards.className = 'cards';
      M.filter(function (m) { return m.group === gname; }).forEach(function (m) {
        var a = document.createElement('a'); a.className = 'card'; a.href = '#' + m.id;
        a.innerHTML = '<b></b><span></span>';
        a.firstChild.textContent = m.name; a.lastChild.textContent = m.card;
        cards.appendChild(a);
      });
      sec.appendChild(cards); $('home').appendChild(sec);
    });

    var playing = !reduce, speed = 1, mode = 'work';
    var renderer, camera, controls, scene, inst, def, p = 0, sim = 0, last = performance.now(), lastStep = -1;
    var anims = [], partColor = {};
    var partMeshes = {}, pickables = [], labelEls = [], markEls = [], selected = null, prevSel = null;
    var view = $('view'), canvas = $('scene');
    var css = function (n) { return getComputedStyle(document.documentElement).getPropertyValue(n).trim(); };
    var groundMat = null;

    function syncPlay() { $('play').textContent = playing ? 'Pause' : 'Play'; $('play').setAttribute('aria-pressed', playing); }
    $('play').addEventListener('click', function () { playing = !playing; syncPlay(); });
    [['sp-slow', 0.35], ['sp-normal', 1], ['sp-fast', 2.2]].forEach(function (s) {
      $(s[0]).addEventListener('click', function () {
        speed = s[1];
        ['sp-slow', 'sp-normal', 'sp-fast'].forEach(function (id) { $(id).setAttribute('aria-pressed', id === s[0]); });
      });
    });
    $('next').addEventListener('click', function () {
      if (!def) return;
      var n = def.steps.length, st = Math.floor(p * n);
      p = ((st + 1) % n) / n + 0.003;
    });
    $('tab-work').addEventListener('click', function () { setMode('work'); });
    $('tab-anatomy').addEventListener('click', function () { setMode('anatomy'); });
    syncPlay();

    function setMode(m) {
      mode = m;
      $('tab-work').setAttribute('aria-selected', m === 'work');
      $('tab-anatomy').setAttribute('aria-selected', m === 'anatomy');
      $('work').hidden = m !== 'work';
      $('anatomy').hidden = m !== 'anatomy';
      $('banner').hidden = m !== 'work';
      labelEls.forEach(function (l) { l.el.hidden = m !== 'anatomy'; });
      if (m === 'anatomy' && !selected && def) selectPart(def.parts[0].id);
      if (m === 'work') selectPart(null);
    }

    function selectPart(id) {
      selected = id;
      labelEls.forEach(function (l) { l.el.classList.toggle('on', l.id === id); });
      Array.prototype.forEach.call($('parts').children, function (b) { b.classList.toggle('on', b.dataset.id === id); });
      if (id && def) {
        var pdef = def.parts.filter(function (x) { return x.id === id; })[0];
        if (pdef) { $('pName').textContent = pdef.name; $('pText').textContent = pdef.text; }
      }
    }
    function applyHighlight() {
      if (prevSel && prevSel !== selected && partMeshes[prevSel]) {
        partMeshes[prevSel].forEach(function (m) { if (m.material.emissive) { m.material.emissive.setHex(m.userData.em0 || 0); m.material.emissiveIntensity = m.userData.ei0 || 1; } });
      }
      prevSel = selected;
      if (selected && partMeshes[selected]) {
        var k = 0.45 + 0.2 * Math.sin(performance.now() / 260);
        partMeshes[selected].forEach(function (m) { if (m.material.emissive) { m.material.emissive.setHex(0xff6a1a); m.material.emissiveIntensity = k; } });
      }
    }

    function initRenderer() {
      if (renderer) return true;
      if (!T || !T.OrbitControls) {
        var e = document.createElement('div'); e.className = 'err';
        e.textContent = 'The 3D model could not load. Check your internet connection and reload the page.';
        view.appendChild(e); return false;
      }
      renderer = new T.WebGLRenderer({ canvas: canvas, antialias: true, alpha: !!window.HTW_CUTOUT });
      renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
      renderer.outputEncoding = T.sRGBEncoding;
      camera = new T.PerspectiveCamera(36, 1, 0.05, 200);
      controls = new T.OrbitControls(camera, canvas);
      controls.enableDamping = true; controls.enablePan = false;
      new ResizeObserver(resize).observe(view);
      if (window.matchMedia) matchMedia('(prefers-color-scheme: dark)').addEventListener('change', applyTheme);
      new MutationObserver(applyTheme).observe(document.documentElement, { attributes: true, attributeFilter: ['data-theme'] });

      var ray = new T.Raycaster(), down = null;
      canvas.addEventListener('pointerdown', function (e) { down = [e.clientX, e.clientY]; });
      canvas.addEventListener('pointerup', function (e) {
        if (!down || Math.hypot(e.clientX - down[0], e.clientY - down[1]) > 6) return;
        var r = canvas.getBoundingClientRect();
        ray.setFromCamera({ x: ((e.clientX - r.left) / r.width) * 2 - 1, y: -((e.clientY - r.top) / r.height) * 2 + 1 }, camera);
        var hits = ray.intersectObjects(pickables, false).filter(function (h) { return h.object.visible; });
        if (hits.length) { if (mode !== 'anatomy') setMode('anatomy'); selectPart(hits[0].object.userData.part); }
      });
      requestAnimationFrame(frame);
      return true;
    }
    function applyTheme() {
      if (!renderer) return;
      if (window.HTW_CUTOUT) renderer.setClearColor(0x000000, 0); else renderer.setClearColor(new T.Color(css('--scene') || '#DCE3EA'));
      if (groundMat) groundMat.color.set(css('--ground') || '#C3CDD7');
    }
    function resize() {
      if (!renderer) return;
      var w = view.clientWidth, h = view.clientHeight;
      if (!w || !h) return;
      renderer.setSize(w, h, false); camera.aspect = w / h; camera.updateProjectionMatrix();
    }
    function dispose(s) {
      if (!s) return;
      s.traverse(function (o) {
        if (o.geometry) o.geometry.dispose();
        if (o.material) {
          (Array.isArray(o.material) ? o.material : [o.material]).forEach(function (m) { if (m.map) m.map.dispose(); m.dispose(); });
        }
      });
    }

    function tag(mesh, id) {
      mesh.userData.part = id;
      if (mesh.material && mesh.material.emissive) { mesh.userData.em0 = mesh.material.emissive.getHex(); mesh.userData.ei0 = mesh.material.emissiveIntensity; }
      (partMeshes[id] = partMeshes[id] || []).push(mesh); pickables.push(mesh); return mesh;
    }
    // Tag every mesh inside a group
    function tagAll(obj, id) { obj.traverse(function (o) { if (o.isMesh) tag(o, id); }); return obj; }

    function showMachine(d) {
      if (!initRenderer()) return;
      dispose(scene);
      def = d; partMeshes = {}; pickables = []; selected = null; prevSel = null; lastStep = -1;
      scene = new T.Scene();
      scene.add(new T.HemisphereLight(0xffffff, 0x556677, 0.85));
      var key = new T.DirectionalLight(0xffffff, 0.95); key.position.set(4, 7, 5); scene.add(key);
      var rim = new T.DirectionalLight(0x9fbfff, 0.4); rim.position.set(-5, 3, -4); scene.add(rim);
      groundMat = null;
      if (d.ground !== false && !window.HTW_CUTOUT) {
        groundMat = new T.MeshBasicMaterial({ color: 0xc3cdd7, transparent: true, opacity: 0.55, depthWrite: false });
        var g = new T.Mesh(new T.CircleGeometry(d.groundR || 2.6, 64), groundMat);
        g.rotation.x = -Math.PI / 2; g.position.y = d.groundY == null ? -1 : d.groundY; scene.add(g);
      }
      anims = [];
      var ctx = { scene: scene, tag: tag, tagAll: tagAll, H: H, T: T, camera: function () { return camera; }, labels: {}, anim: function (f) { anims.push(f); } };
      inst = d.build(ctx) || {};
      inst.labels = Object.assign({}, ctx.labels, inst.labels || {});
      colorize(d);
      if (window.HTW_WIRE) wireify(scene);
      var c = (window.HTW_WIRE && d.wireCamera) || d.camera || {};
      camera.position.fromArray(c.pos || [3.6, 2.8, 5.4]);
      controls.target.fromArray(c.target || [0, 1, 0]);
      controls.minDistance = c.min || 2.5; controls.maxDistance = c.max || 14;
      controls.update();
      applyTheme();

      // Text
      $('eyebrow').textContent = d.group;
      $('title').textContent = d.name;
      $('lede').textContent = d.lede;
      $('back').hidden = false;
      // Steps
      var stepsEl = $('steps'); stepsEl.innerHTML = '';
      d.steps.forEach(function (s, i) {
        var b = document.createElement('button'); b.className = 'step'; b.id = 'step-' + i;
        b.innerHTML = '<span class="n"></span><span class="k"></span><span></span>';
        b.children[0].textContent = 'Step ' + (i + 1); b.children[1].textContent = s.kid; b.children[2].textContent = s.name;
        b.addEventListener('click', function () { p = i / d.steps.length + 0.003; });
        stepsEl.appendChild(b);
      });
      stepsEl.style.gridTemplateColumns = d.steps.length === 3 ? '1fr 1fr 1fr' : '1fr 1fr';
      var facts = $('facts'); facts.innerHTML = '';
      (d.facts || []).forEach(function (f) {
        var s = document.createElement('span'); s.textContent = f[0] + ' ';
        var st = document.createElement('strong'); st.textContent = f[1]; s.appendChild(st); facts.appendChild(s);
      });
      facts.hidden = !(d.facts && d.facts.length);
      // Parts
      var partsEl = $('parts'); partsEl.innerHTML = '';
      d.parts.forEach(function (pt) {
        var b = document.createElement('button'); b.className = 'part'; b.dataset.id = pt.id;
        var dot = document.createElement('i'); dot.className = 'dot'; dot.style.background = labelHex(pt.id); b.appendChild(dot); b.appendChild(document.createTextNode(pt.name));
        b.addEventListener('click', function () { selectPart(pt.id); });
        partsEl.appendChild(b);
      });
      // Labels
      var lab = $('labels'); lab.innerHTML = '';
      labelEls = d.parts.map(function (pt) {
        var el = document.createElement('button'); el.className = 'label'; el.textContent = pt.name; el.hidden = true; el.style.background = labelHex(pt.id); el.style.borderColor = labelHex(pt.id); el.style.color = '#fff';
        el.addEventListener('click', function () { selectPart(pt.id); });
        lab.appendChild(el);
        return { id: pt.id, el: el, pos: (inst.labels || {})[pt.id] };
      });
      markEls = (inst.marks || []).map(function (m) {
        var el = document.createElement('div'); el.className = 'mark'; el.textContent = m.text; lab.appendChild(el);
        return { el: el, pos: m.pos };
      });
      // Pager
      var i = M.indexOf(d), pv = M[(i - 1 + M.length) % M.length], nx = M[(i + 1) % M.length];
      $('prev-link').href = '#' + pv.id; $('prev-link').textContent = '← ' + pv.name;
      $('next-link').href = '#' + nx.id; $('next-link').textContent = nx.name + ' →';

      p = d.start || 0; sim = 0;
      $('home').hidden = true; $('machine').hidden = false;
      setMode('work');
      resize();
    }

    function showHome() {
      def = null; inst = null;
      $('machine').hidden = true; $('home').hidden = false; $('back').hidden = true;
      $('eyebrow').textContent = 'How Everyday Things Work · 3D companion';
      $('title').textContent = 'See every machine in 3D';
      $('lede').textContent = 'Pick a machine from the book. Watch it run, slow it down, then switch to Anatomy to explore every part.';
    }

    function route() {
      var id = (location.hash || '').replace('#', '');
      if (byId[id]) { showMachine(byId[id]); window.scrollTo(0, 0); } else showHome();
    }
    window.addEventListener('hashchange', route);
    // Give every part its own bright colour, matched by its label
    var PAL = [0xFF6B35, 0x2E86DE, 0x10AC84, 0xF7B731, 0x8E44AD, 0xEE5A6F, 0x00A8C6, 0x6AB04C, 0xE67E22, 0x5F27CD, 0x1ABC9C, 0xD6449B, 0x3B6FD8, 0xC0392B, 0x16A085, 0xB8860B, 0x7D5FFF, 0x2C8C99, 0xE15F41, 0x4834D4];
    var KEEP = { fridge: ['food'], microwave: ['food'], 'pressure-cooker': ['water', 'flame'], 'gas-stove': ['flame', 'cylinder'], led: ['chips', 'phosphor', 'dome'],
      inverter: ['load', 'mains'], ro: ['tank'], phone: ['display', 'touch'], touchscreen: ['rows', 'cols', 'finger', 'display'], wifi: ['waves'], upi: ['qr'],
      gps: ['earth', 'spheres', 'signal', 'receiver'], engine: ['chamber'], traffic: ['red', 'cars', 'stopline', 'signal', 'zebra', 'timer', 'ped'] };
    function labelHex(id) { var c = partColor[id]; return c == null ? '#3A4654' : '#' + ('000000' + c.toString(16)).slice(-6); }
    function colorize(d) {
      var keep = KEEP[d.id] || [], k = 0; partColor = {};
      d.parts.forEach(function (pt) { partColor[pt.id] = keep.indexOf(pt.id) >= 0 ? null : PAL[k++ % PAL.length]; });
      Object.keys(partMeshes).forEach(function (id) {
        var col = partColor[id]; if (col == null) return;
        var target = new T.Color(col), th = {}; target.getHSL(th);
        partMeshes[id].forEach(function (m) {
          (Array.isArray(m.material) ? m.material : [m.material]).forEach(function (mt) {
            if (!mt.isMeshStandardMaterial || mt.map) return;
            var oh = {}; mt.color.getHSL(oh);
            mt.color.setHSL(th.h, Math.max(th.s, 0.6), H.clamp(th.l * 0.75 + (oh.l - 0.5) * 0.35, 0.28, 0.72));
            mt.metalness = Math.min(mt.metalness, 0.2); mt.roughness = Math.max(mt.roughness, 0.45);
          });
        });
      });
    }
    // Print-style line drawing used for the book's 2D images (not used on the live site)
    function wireify(sc) {
      var drop = [];
      sc.children.forEach(function (o) { if (o.isLight) drop.push(o); });
      drop.forEach(function (o) { sc.remove(o); });
      sc.add(new T.AmbientLight(0xffffff, 1.0));
      var meshes = [];
      sc.traverse(function (o) { if (o.isMesh) meshes.push(o); });
      meshes.forEach(function (m) {
        var mats = Array.isArray(m.material) ? m.material : [m.material];
        mats.forEach(function (mt) {
          if (mt.isMeshStandardMaterial) { mt.metalness = 0; mt.roughness = 1; mt.transparent = true; mt.opacity = mt.opacity < 0.3 ? Math.min(mt.opacity * 1.8, 0.3) : Math.min(Math.max(mt.opacity, 0.45), 0.7); mt.depthWrite = false; }
        });
        var g = m.geometry, pr = g.parameters || {};
        if (g.type === 'SphereGeometry' || g.type === 'TorusGeometry') return;
        if (g.type === 'CircleGeometry') return;
        var col = new T.Color(mats[0].color ? mats[0].color.getHex() : 0x333333);
        var hsl = {}; col.getHSL(hsl); col.setHSL(hsl.h, Math.min(1, hsl.s * 1.2), Math.min(hsl.l * 0.45, 0.3));
        var e = new T.LineSegments(new T.EdgesGeometry(g, 22), new T.LineBasicMaterial({ color: col }));
        m.add(e);
      });
    }
    HTW._cam = function (pos, tgt) { camera.position.fromArray(pos); controls.target.fromArray(tgt); controls.update(); };
    HTW._capture = function (v) {
      playing = false; syncPlay(); p = v;
      setMode('anatomy'); selected = null; prevSel = null;
      labelEls.forEach(function (l) { l.el.classList.remove('on'); });
    };
    route();

    var v = new (T ? T.Vector3 : Object)();
    function place(el, pos) {
      if (!pos) { el.style.visibility = 'hidden'; return; }
      var pt = typeof pos === 'function' ? pos() : pos;
      v.copy(pt).project(camera);
      el.style.left = ((v.x + 1) / 2 * view.clientWidth) + 'px';
      el.style.top = ((1 - v.y) / 2 * view.clientHeight) + 'px';
      el.style.visibility = v.z > 1 ? 'hidden' : 'visible';
    }

    function frame(now) {
      var dt = Math.min((now - last) / 1000, 0.05); last = now;
      if (def && inst) {
        var n = def.steps.length;
        if (playing) { p = (p + dt * speed / (def.cycle || 8)) % 1; sim += dt * speed; }
        var step = Math.min(Math.floor(p * n), n - 1), prog = p * n - step;
        var state = { p: p, step: step, prog: prog, t: sim, dt: playing ? dt * speed : 0, playing: playing };
        if (inst.update) inst.update(state);
        anims.forEach(function (f) { f(state); });
        if (step !== lastStep) {
          lastStep = step;
          var s = def.steps[step];
          $('bannerName').textContent = (step + 1) + ' · ' + s.name; $('bannerKid').textContent = s.kid;
          $('sName').textContent = s.name; $('sText').textContent = s.text;
          def.steps.forEach(function (_, i) { var b = $('step-' + i); if (b) b.classList.toggle('on', i === step); });
        }
        $('readout').innerHTML = def.readout ? def.readout(state) : 'Step <strong>' + (step + 1) + '</strong> of ' + n;
        applyHighlight();
        controls.update();
        renderer.render(scene, camera);
        if (mode === 'anatomy') { var narrow = view.clientWidth < 560; labelEls.forEach(function (l) { place(l.el, l.pos); if (narrow && l.id !== selected) l.el.style.visibility = 'hidden'; }); }
        markEls.forEach(function (m) { place(m.el, m.pos); });
      }
      requestAnimationFrame(frame);
    }
  };
})();
