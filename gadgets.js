/* Part 3 · Gadgets */
(function () {
  var G = 'Part 3 · Gadgets';
  var H = HTW.H, T = window.THREE;

  // ---------- Smartphone ----------
  HTW.define({
    id: 'phone', group: G, name: 'Smartphone', card: 'A tiny computer, layer by layer',
    lede: 'Pull a phone apart, layer by layer. Each layer has one job, and together they make a computer that fits in your pocket.',
    cycle: 12,
    steps: [
      { name: 'Glass and touch layer', kid: 'Feel the finger', text: 'Under the tough cover glass is a see-through touch layer. It feels exactly where your finger is.' },
      { name: 'Display', kid: 'Make pictures', text: 'The screen is millions of tiny dots called pixels. Each has red, green and blue parts that mix to make any colour.' },
      { name: 'Processor and memory', kid: 'Think', text: 'The processor follows billions of instructions every second. Memory chips store your apps, photos and messages.' },
      { name: 'Battery and antennas', kid: 'Power and talk', text: 'A lithium-ion battery powers everything, and antennas hidden in the frame send and receive radio waves.' }
    ],
    facts: [['Instructions per second', 'billions'], ['Pixels on a phone screen', 'millions']],
    parts: [
      { id: 'glass', name: 'Cover glass', text: 'Toughened glass that protects the screen from scratches and knocks.' },
      { id: 'touch', name: 'Touch layer', text: 'A see-through grid of super-thin wires that senses your finger.' },
      { id: 'display', name: 'Display', text: 'Millions of tiny lights called pixels that together make the picture.' },
      { id: 'frame', name: 'Frame and antennas', text: 'The metal edge holds it all together. Parts of it work as antennas for calls, data and Wi-Fi.' },
      { id: 'processor', name: 'Processor', text: 'The brain. It runs your apps by following simple instructions, billions every second.' },
      { id: 'memory', name: 'Memory', text: 'Chips that store apps, photos and messages, even when the phone is off.' },
      { id: 'camera', name: 'Camera', text: 'A tiny lens and light sensor. The sensor has millions of light-catching spots.' },
      { id: 'battery', name: 'Battery', text: 'A flat lithium-ion battery. It is the largest part inside the phone.' },
      { id: 'back', name: 'Back cover', text: 'Protects the inside. Many phones have a charging coil behind it.' },
      {id: "speaker", name: "Speaker and microphone", text: "Turn electrical signals into sound, and your voice into electrical signals."},
      {id: "port", name: "Charging port", text: "The USB-C socket. It brings in electricity to charge the battery and can carry data too."},
      {id: "sim", name: "SIM card", text: "A tiny chip that tells the mobile network which phone number is yours."},
      {id: "vibration", name: "Vibration motor", text: "A tiny motor with an off-centre weight. When it spins, the whole phone buzzes."}
    ],
    camera: { pos: [3.0, 2.6, 3.0], target: [0, 0.4, 0] },
    build: function (c) {
      var s = c.scene, tag = c.tag;
      function layer() { var g = new T.Group(); s.add(g); return g; }
      var L = [layer(), layer(), layer(), layer(), layer(), layer()];
      L[0].add(tag(H.box(0.9, 0.04, 1.8, H.matte(0x2b3138)), 'back'));
      var bat = H.box(0.7, 0.07, 0.9, H.metal(0x3f4a55, { emissive: new T.Color(0x3cc26b), emissiveIntensity: 0 }), 0, 0, 0.35); L[1].add(tag(bat, 'battery'));
      L[1].add(tag(H.box(0.78, 0.02, 0.62, H.matte(0x2e7d4f), 0, 0, -0.5), 'processor'));
      var cpu = H.box(0.2, 0.04, 0.2, H.matte(0x1c1f23, { emissive: new T.Color(0xff6a1a), emissiveIntensity: 0 }), -0.12, 0.03, -0.5); L[1].add(tag(cpu, 'processor'));
      var mem = H.box(0.16, 0.035, 0.12, H.matte(0x2a2f35, { emissive: new T.Color(0x7cf2ff), emissiveIntensity: 0 }), 0.18, 0.03, -0.42); L[1].add(tag(mem, 'memory'));
      var cam = H.cyl(0.07, 0.07, 0.06, H.matte(0x111111), -0.25, 0.04, -0.7, 20); L[1].add(tag(cam, 'camera'));
      var frame = new T.Group();
      [[0.9, 0.05, 0.03, 0, 0.88], [0.9, 0.05, 0.03, 0, -0.88], [0.03, 0.05, 1.8, 0.44, 0], [0.03, 0.05, 1.8, -0.44, 0]].forEach(function (q) { frame.add(H.box(q[0], q[1], q[2], H.metal(0xb9c2cb), q[3], 0, q[4])); });
      [[0.2, 0.88], [-0.25, -0.88]].forEach(function (q) { frame.add(H.box(0.02, 0.055, 0.035, H.basic(0x222222), q[0], 0, q[1])); });
      L[2].add(c.tagAll(frame, 'frame'));
      var dispTex = H.canvasTex(256, 512, function (g, w, h) {
        g.fillStyle = '#0b1a2c'; g.fillRect(0, 0, w, h);
        var cols = ['#ff7a33', '#3cc26b', '#4f7dff', '#f2d24b', '#e0453a', '#7cf2ff', '#b05cff', '#ffffff'];
        for (var r = 0; r < 5; r++) for (var k = 0; k < 4; k++) { g.fillStyle = cols[(r * 4 + k) % cols.length]; g.fillRect(24 + k * 58, 80 + r * 70, 36, 36); }
      });
      var disp = new T.Mesh(new T.BoxGeometry(0.84, 0.02, 1.72), [H.matte(0x111111), H.matte(0x111111), new T.MeshStandardMaterial({ map: dispTex, emissive: new T.Color(0xffffff), emissiveMap: dispTex, emissiveIntensity: 0.25 }), H.matte(0x111111), H.matte(0x111111), H.matte(0x111111)]);
      L[3].add(disp); disp.userData.part = 'display';
      var touchTex = H.canvasTex(256, 512, function (g, w, h) {
        g.clearRect(0, 0, w, h); g.strokeStyle = 'rgba(124,242,255,0.8)'; g.lineWidth = 2;
        for (var x = 16; x < w; x += 24) { g.beginPath(); g.moveTo(x, 0); g.lineTo(x, h); g.stroke(); }
        g.strokeStyle = 'rgba(255,154,74,0.8)';
        for (var y = 16; y < h; y += 24) { g.beginPath(); g.moveTo(0, y); g.lineTo(w, y); g.stroke(); }
      });
      var touch = new T.Mesh(new T.PlaneGeometry(0.84, 1.72), new T.MeshStandardMaterial({ map: touchTex, transparent: true, side: T.DoubleSide, depthWrite: false }));
      touch.rotation.x = -Math.PI / 2; L[4].add(tag(touch, 'touch'));
      L[5].add(tag(H.box(0.9, 0.03, 1.8, H.glass(0xdfeaf2, 0.25)), 'glass'));
      c.tag(disp, 'display');
      var waves = [];
      for (var i = 0; i < 3; i++) { var r = H.torus(0.2, 0.01, H.basic(0xff7a33, 0.6), 0, 0, 0); waves.push(r); s.add(r); }
      var ex = 0;
      // extras:phone
      L[1].add(tag(H.box(0.22, 0.04, 0.06, H.matte(0x30363d), 0.15, 0.02, 0.8), 'speaker'));
      L[1].add(tag(H.box(0.12, 0.03, 0.05, H.metal(0xb9c2cb), -0.12, 0.02, 0.86), 'port'));
      L[1].add(tag(H.box(0.12, 0.01, 0.16, H.matte(0xf2c14e), 0.32, 0.03, -0.15), 'sim'));
      var vm = H.cyl(0.04, 0.04, 0.12, H.metal(0x8f9aa5), -0.3, 0.03, -0.25); vm.rotation.z = Math.PI / 2; L[1].add(tag(vm, 'vibration'));
      c.labels.speaker = function () { return H.v(0.55, L[1].position.y + 0.05, 0.85); }; c.labels.port = function () { return H.v(-0.45, L[1].position.y, 0.95); };
      c.labels.sim = function () { return H.v(0.7, L[1].position.y + 0.05, -0.15); }; c.labels.vibration = function () { return H.v(-0.7, L[1].position.y + 0.05, -0.25); };

      return {
        update: function (st) {
          ex = st.step === 0 ? H.smooth(st.prog / 0.5) : st.step === 3 ? 1 - H.smooth((st.prog - 0.75) / 0.25) : 1;
          L.forEach(function (g, i) { g.position.y = i * 0.05 + ex * i * 0.34; });
          var on = function (k) { return st.step === k ? 0.5 + 0.3 * Math.sin(st.t * 8) : 0; };
          disp.material[2].emissiveIntensity = 0.25 + (st.step === 1 ? 0.6 : 0);
          cpu.material.emissiveIntensity = on(2); mem.material.emissiveIntensity = on(2) * 0.8;
          bat.material.emissiveIntensity = on(3) * 0.6;
          waves.forEach(function (w, i) {
            w.visible = st.step === 3;
            var u = (st.t * 0.6 + i / 3) % 1; w.position.set(0.25, L[2].position.y, 0.95); w.rotation.x = 0;
            w.scale.setScalar(0.3 + u * 4); w.material.opacity = 0.7 * (1 - u);
          });
        },
        labels: {
          glass: function () { return H.v(0.6, L[5].position.y, 0.9); }, touch: function () { return H.v(-0.6, L[4].position.y, 0.6); },
          display: function () { return H.v(0.62, L[3].position.y, -0.6); }, frame: function () { return H.v(-0.62, L[2].position.y, -0.9); },
          processor: function () { return H.v(-0.12, L[1].position.y + 0.12, -0.5); }, memory: function () { return H.v(0.45, L[1].position.y + 0.1, -0.35); },
          camera: function () { return H.v(-0.55, L[1].position.y + 0.1, -0.75); }, battery: function () { return H.v(0.6, L[1].position.y, 0.4); },
          back: function () { return H.v(0, L[0].position.y - 0.12, 1.0); }
        }
      };
    }
  });

  // ---------- Touchscreen ----------
  HTW.define({
    id: 'touchscreen', group: G, name: 'Touchscreen', card: 'A grid that feels your finger',
    lede: 'Under the glass is a grid of invisible wires. Your fingertip pulls away a little charge, and the phone works out exactly where.',
    cycle: 10,
    steps: [
      { name: 'Charged grid', kid: 'Ready', text: 'Under the glass are two layers of see-through wires, in rows and columns, each holding a tiny electric charge.' },
      { name: 'Finger', kid: 'Steal some charge', text: 'Your body conducts electricity a little. A fingertip near the glass pulls some charge away where the wires cross.' },
      { name: 'Scan', kid: 'Check every crossing', text: 'The controller chip checks every crossing of rows and columns, over and over, many times each second.' },
      { name: 'Locate', kid: 'Found it!', text: 'It finds the crossing where the charge dropped and reports the exact position, so the phone knows where you tapped.' }
    ],
    facts: [['Works with', 'fingers, not gloves'], ['Multi-touch', 'many fingers at once']],
    parts: [
      { id: 'glass', name: 'Cover glass', text: 'The smooth top layer you touch. The wires underneath can sense your finger through it.' },
      { id: 'rows', name: 'Row wires', text: 'Transparent wires running across. The controller sends tiny pulses along them.' },
      { id: 'cols', name: 'Column wires', text: 'Transparent wires running the other way. They pick up the pulses where they cross the rows.' },
      { id: 'controller', name: 'Controller chip', text: 'Scans every crossing and spots the change your finger makes.' },
      { id: 'finger', name: 'Fingertip', text: 'Your skin conducts a little electricity, which is why it works and a wooden pencil does not.' },
      {id: "display", name: "Display underneath", text: "Shows the picture. The touch wires are see-through, so the light passes straight through them."}
    ],
    camera: { pos: [0.8, 3.2, 4.4], target: [0, 0.3, 0] },
    readout: function (st) {
      var k = Math.floor(st.t / 10) % 4, cx = [3, 9, 6, 11][k], cz = [2, 5, 7, 3][k];
      return st.step === 3 ? 'Touch at <strong>column ' + cx + ', row ' + cz + '</strong>' : 'Step <strong>' + (st.step + 1) + '</strong> of 4';
    },
    build: function (c) {
      var s = c.scene, tag = c.tag;
      var NX = 14, NZ = 9, W = 2.6, D = 1.7;
      s.add(tag(H.box(W + 0.1, 0.04, D + 0.1, H.glass(0xdfeaf2, 0.22), 0, 0.12, 0), 'glass'));
      var rows = [], cols = [];
      for (var z = 0; z < NZ; z++) { var r = H.box(W, 0.012, 0.03, H.matte(0xff9a4a, { emissive: new T.Color(0xff6a1a), emissiveIntensity: 0, transparent: true, opacity: 0.75 }), 0, 0.0, -D / 2 + (z + 0.5) * D / NZ); s.add(tag(r, 'rows')); rows.push(r); }
      for (var x = 0; x < NX; x++) { var cc = H.box(0.03, 0.012, D, H.matte(0x7cf2ff, { emissive: new T.Color(0x7cf2ff), emissiveIntensity: 0, transparent: true, opacity: 0.75 }), -W / 2 + (x + 0.5) * W / NX, 0.05, 0); s.add(tag(cc, 'cols')); cols.push(cc); }
      s.add(H.box(W + 0.1, 0.03, D + 0.1, H.matte(0x14181d), 0, -0.05, 0));
      s.add(tag(H.box(0.36, 0.06, 0.36, H.matte(0x1c1f23), W / 2 + 0.55, -0.05, 0.3), 'controller'));
      s.add(H.box(0.5, 0.01, 0.2, H.matte(0xd8a441), W / 2 + 0.2, -0.05, 0.3));
      var finger = new T.Group();
      finger.add(H.cyl(0.13, 0.13, 0.9, H.matte(0xe0a882), 0, 0.45, 0)); finger.add(H.sph(0.13, H.matte(0xe0a882), 0, 0, 0));
      finger.add(H.box(0.16, 0.02, 0.12, H.matte(0xf3d9cf), 0, 0.05, -0.08));
      s.add(c.tagAll(finger, 'finger'));
      var ring = H.torus(0.12, 0.012, H.basic(0xff7a33, 0), 0, 0.15, 0); ring.rotation.x = Math.PI / 2; s.add(ring);
      var spots = [[3, 2], [9, 5], [6, 7], [11, 3]];
      // extras:touchscreen
      var dsp = H.box(W, 0.012, D, new T.MeshStandardMaterial({ color: 0x1b3a5c, emissive: new T.Color(0x2b6fb0), emissiveIntensity: 0.6 }), 0, -0.03, 0); s.add(tag(dsp, 'display'));
      c.labels.display = H.v(1.1, -0.06, 1.0);

      return {
        update: function (st) {
          var k = Math.floor(st.t / 10) % 4, sp = spots[k];
          var fx = -W / 2 + (sp[0] - 0.5) * W / NX, fz = -D / 2 + (sp[1] - 0.5) * D / NZ;
          var down = st.step === 0 ? 1 - H.smooth(st.prog) * 0.3 : st.step === 1 ? 0.7 - H.smooth(st.prog / 0.6) * 0.7 : 0;
          finger.position.set(fx, 0.27 + down * 0.9, fz);
          var base = st.step === 0 ? 0.25 + 0.15 * Math.sin(st.t * 5) : 0.15;
          rows.forEach(function (r, i) { r.material.emissiveIntensity = base; });
          cols.forEach(function (cc) { cc.material.emissiveIntensity = base; });
          if (st.step === 2) {
            var sweep = Math.floor((st.t * 18) % NZ);
            rows[sweep].material.emissiveIntensity = 1.2;
          }
          if (st.step >= 1) { rows[sp[1] - 1].material.emissiveIntensity = Math.max(rows[sp[1] - 1].material.emissiveIntensity, st.step === 3 ? 1.2 : 0.05); cols[sp[0] - 1].material.emissiveIntensity = st.step === 3 ? 1.2 : 0.05; }
          ring.position.set(fx, 0.15, fz);
          ring.material.opacity = st.step >= 1 ? (st.step === 3 ? 0.95 : 0.5 * H.smooth(st.prog)) : 0;
          ring.scale.setScalar(1 + 0.2 * Math.sin(st.t * 8));
        },
        labels: {
          glass: H.v(-1.1, 0.25, 0.95), rows: H.v(-1.6, 0.0, -0.55), cols: H.v(0.6, 0.05, -1.05), controller: H.v(W / 2 + 0.3, 0.2, 0.7),
          finger: function () { return H.v(-0.8, 1.2, 0); }
        }
      };
    }
  });

  // ---------- Wi-Fi ----------
  HTW.define({
    id: 'wifi', group: G, name: 'Wi‑Fi', card: 'Data carried on radio waves',
    lede: 'Your router turns the internet into radio waves that pass through the air, and even through walls, to reach your phone.',
    cycle: 10,
    steps: [
      { name: 'Cable', kid: 'Internet arrives', text: 'Data reaches your home through a cable as a fast stream of 1s and 0s.' },
      { name: 'Router', kid: 'Bits to waves', text: 'The router turns the 1s and 0s into radio waves, changing the wave pattern millions of times a second.' },
      { name: 'Spread', kid: 'Spread out', text: 'The waves spread in every direction. Walls, metal and distance weaken them, so far rooms get a weaker signal.' },
      { name: 'Phone', kid: 'Catch them', text: 'The phone’s antenna catches the waves and turns them back into 1s and 0s. Sending a message works the same way in reverse.' }
    ],
    facts: [['Wi‑Fi bands', '2.4 GHz and 5 GHz'], ['Wave speed', 'the speed of light']],
    parts: [
      { id: 'cable', name: 'Internet cable', text: 'Fibre or copper cable that brings the internet into your home.' },
      { id: 'router', name: 'Router', text: 'The box with blinking lights. It changes data into radio waves and back again.' },
      { id: 'antennas', name: 'Antennas', text: 'Send the radio waves out into the room and catch the waves coming back.' },
      { id: 'waves', name: 'Radio waves', text: 'Invisible waves, like light but with much longer wavelengths, so they pass through walls.' },
      { id: 'wall', name: 'Wall', text: 'Brick and concrete soak up some of the waves, which weakens the signal behind them.' },
      { id: 'phone', name: 'Phone', text: 'Its antenna catches the weak waves and decodes the data inside them.' },
      {id: "modem", name: "Modem", text: "Changes the signal from your internet provider (on fibre or copper cable) into data the router can share."}
    ],
    camera: { pos: [-0.5, 2.9, 7.2], target: [-0.6, 0.0, 0] },
    readout: function (st) {
      var bars = st.step === 3 ? 3 : st.step === 2 ? 2 : 0;
      return 'Signal at phone <strong>' + ['○○○○', '●○○○', '●●○○', '●●●○'][bars] + '</strong>';
    },
    build: function (c) {
      var s = c.scene, tag = c.tag;
      var router = H.box(0.8, 0.2, 0.5, H.matte(0xf2f2ee), -1.6, -0.2, 0); s.add(tag(router, 'router'));
      var leds = [];
      for (var i = 0; i < 4; i++) { var l = H.box(0.05, 0.03, 0.02, H.basic(0x3cc26b), -1.85 + i * 0.12, -0.18, 0.26); s.add(l); leds.push(l); }
      [-1.85, -1.6, -1.35].forEach(function (x, i) { var a = H.cyl(0.03, 0.03, 0.7, H.matte(0x2b3138), x, 0.25, -0.15); a.rotation.z = (i - 1) * 0.25; s.add(tag(a, 'antennas')); });
      var cablePts = [H.v(-3.0, -0.95, 0), H.v(-2.3, -0.9, 0), H.v(-2.05, -0.3, 0), H.v(-1.95, -0.2, 0)];
      s.add(tag(H.tube(cablePts, 0.03, H.matte(0x4f5964)), 'cable'));
      s.add(tag(H.box(0.12, 2.4, 2.6, H.glass(0xc9b9a5, 0.45), 0.5, 0.2, 0), 'wall'));
      var phone = H.box(0.3, 0.6, 0.06, H.matte(0x1f2329), 1.9, 0.0, 0.2); s.add(tag(phone, 'phone'));
      var scr = H.box(0.26, 0.52, 0.01, H.basic(0x1b3a5c), 1.9, 0.0, 0.235); s.add(tag(scr, 'phone'));
      var rings = [];
      for (var k = 0; k < 5; k++) { var r = H.torus(1, 0.012, H.basic(0x8a5cff, 0.6), -1.6, 0.4, 0); r.rotation.x = Math.PI / 2; s.add(tag(r, 'waves')); rings.push(r); }
      var vrings = [];
      for (var k2 = 0; k2 < 5; k2++) { var r2 = H.torus(1, 0.01, H.basic(0x8a5cff, 0.4), -1.6, 0.4, 0); s.add(tag(r2, 'waves')); vrings.push(r2); }
      var bitsIn = [], bitsOut = [];
      for (var b = 0; b < 12; b++) { var m = H.box(0.07, 0.07, 0.07, H.basic(b % 3 ? 0xff7a33 : 0x4f7dff)); s.add(m); bitsIn.push(m); }
      for (var b2 = 0; b2 < 10; b2++) { var m2 = H.box(0.06, 0.06, 0.06, H.basic(b2 % 2 ? 0xff7a33 : 0x4f7dff)); s.add(m2); bitsOut.push(m2); }
      var cableC = H.curve(cablePts), rx = new T.Vector3(-1.6, 0.4, 0), wallX = 0.5;
      // extras:wifi
      s.add(tag(H.box(0.4, 0.3, 0.15, H.matte(0x2b3138), -3.0, -0.8, 0), 'modem'));
      c.labels.modem = H.v(-3.0, -0.5, 0.2);

      return {
        update: function (st) {
          H.flow(bitsIn, cableC, st.t, { speed: 0.5, visible: true });
          leds.forEach(function (l, i) { l.visible = Math.sin(st.t * 14 + i * 2) > -0.2; });
          var on = st.step >= 1 ? (st.step === 1 ? H.smooth(st.prog) : 1) : 0;
          var maxR = st.step >= 2 ? 4.2 : st.step === 1 ? 0.6 + st.prog * 1.5 : 0.5;
          rings.concat(vrings).forEach(function (r, i) {
            var u = (st.t * 0.35 + (i % 5) / 5) % 1, rad = 0.2 + u * maxR;
            r.scale.setScalar(rad);
            var past = rx.x + rad > wallX;
            r.material.opacity = on * (1 - u) * (past ? 0.25 : 0.7) * (i >= 5 ? 0.7 : 1);
            r.visible = on > 0.01;
          });
          var recv = st.step === 3 ? 1 : 0;
          scr.material.color.setHex(recv ? 0x3cc26b : (st.step === 2 ? 0x2b5a8a : 0x1b3a5c));
          bitsOut.forEach(function (m, i) {
            m.visible = recv > 0; if (!m.visible) return;
            var u = (st.t * 0.6 + i / bitsOut.length) % 1;
            m.position.set(1.9 + Math.sin(i) * 0.08, -0.25 + u * 0.5, 0.3);
            m.scale.setScalar(0.6);
          });
        },
        labels: {
          cable: H.v(-2.3, -0.55, 0.3), router: H.v(-1.6, -0.5, 0.4), antennas: H.v(-1.2, 0.7, 0), waves: H.v(-0.2, 1.0, 0.6),
          wall: H.v(0.5, 1.5, 0.4), phone: H.v(1.9, 0.5, 0.3)
        }
      };
    }
  });

  // ---------- UPI payment ----------
  HTW.define({
    id: 'upi', group: G, name: 'QR codes and UPI', card: 'Money moves as secure messages',
    lede: 'No coins move when you scan and pay. A chain of secure messages tells two banks to update their records, all in a few seconds.',
    cycle: 12,
    steps: [
      { name: 'Scan', kid: 'Read the code', text: 'Your phone’s camera reads the QR code. Its pattern of squares stores the shop’s payment address.' },
      { name: 'UPI network', kid: 'Send the order', text: 'You type your secret PIN. The app sends a secure, scrambled message to the UPI network run by NPCI.' },
      { name: 'Your bank', kid: 'Money out', text: 'The network asks your bank to check the PIN and your balance. If all is well, your bank takes the money out.' },
      { name: 'Shop’s bank', kid: 'Money in', text: 'The network tells the shop’s bank to add the same amount to the shop’s account.' },
      { name: 'Sound box', kid: 'Paid!', text: 'A confirmation flies back. The shop’s sound box announces the amount, all within a few seconds.' }
    ],
    facts: [['Money moves', 'only inside banks'], ['Never share', 'your UPI PIN']],
    parts: [
      { id: 'qr', name: 'QR code', text: 'A grid of black and white squares that stores information. The three big corner squares help the camera find it.' },
      { id: 'phoneapp', name: 'Phone and UPI app', text: 'Sends your payment order. Your secret PIN proves it is really you.' },
      { id: 'npci', name: 'UPI network (NPCI)', text: 'The messenger between all the banks. It checks and passes on every payment message.' },
      { id: 'yourbank', name: 'Your bank', text: 'Checks your PIN and balance, then takes the money out of your account.' },
      { id: 'shopbank', name: 'Shop’s bank', text: 'Adds the money to the shopkeeper’s account and sends back a success message.' },
      { id: 'soundbox', name: 'Sound box', text: 'A speaker at the shop that reads out each payment as it arrives.' },
      {id: "tower", name: "Mobile tower", text: "Carries your phone’s message onto the internet (Wi-Fi can do this job too)."}
    ],
    camera: { pos: [0.4, 3.4, 6.8], target: [0, 0.2, -0.2] },
    build: function (c) {
      var s = c.scene, tag = c.tag;
      var qrTex = H.canvasTex(256, 256, function (g, w, h) {
        g.fillStyle = '#ffffff'; g.fillRect(0, 0, w, h); var n = 25, cs = w / (n + 4); g.fillStyle = '#111111';
        var seed = 7; function rnd() { seed = (seed * 9301 + 49297) % 233280; return seed / 233280; }
        for (var y = 0; y < n; y++) for (var x = 0; x < n; x++) if (rnd() > 0.52) g.fillRect((x + 2) * cs, (y + 2) * cs, cs, cs);
        [[0, 0], [n - 7, 0], [0, n - 7]].forEach(function (q) {
          var X0 = (q[0] + 2) * cs, Y0 = (q[1] + 2) * cs;
          g.fillStyle = '#111'; g.fillRect(X0, Y0, 7 * cs, 7 * cs); g.fillStyle = '#fff'; g.fillRect(X0 + cs, Y0 + cs, 5 * cs, 5 * cs);
          g.fillStyle = '#111'; g.fillRect(X0 + 2 * cs, Y0 + 2 * cs, 3 * cs, 3 * cs);
        });
      });
      var stand = H.box(0.75, 0.9, 0.05, H.matte(0x1f5fa8), -1.9, -0.45, 0.6); s.add(tag(stand, 'qr'));
      var qr = new T.Mesh(new T.PlaneGeometry(0.6, 0.6), new T.MeshBasicMaterial({ map: qrTex })); qr.position.set(-1.9, -0.4, 0.63); s.add(tag(qr, 'qr'));
      var phone = new T.Group();
      phone.add(H.box(0.32, 0.62, 0.05, H.matte(0x1f2329)));
      var scr = H.box(0.28, 0.54, 0.01, H.basic(0x2b5a8a), 0, 0, 0.03); phone.add(scr);
      phone.position.set(-1.0, -0.35, 1.3); phone.rotation.y = -0.6; s.add(c.tagAll(phone, 'phoneapp'));
      var hub = new T.Group();
      hub.add(H.cyl(0.35, 0.35, 0.3, H.metal(0x2f5aa8)));
      var hring = H.torus(0.55, 0.03, H.basic(0xff7a33, 0.8), 0, 0, 0); hring.rotation.x = Math.PI / 2; hub.add(hring);
      hub.position.set(0, 1.1, -0.6); s.add(c.tagAll(hub, 'npci'));
      function bank(x, color, id, coins) {
        var b = new T.Group();
        b.add(H.box(0.9, 0.12, 0.6, H.matte(0xe8e2d6), 0, -0.85, 0));
        for (var i = 0; i < 4; i++) b.add(H.cyl(0.05, 0.05, 0.55, H.matte(0xf2eee6), -0.32 + i * 0.21, -0.52, 0.2));
        b.add(H.box(0.9, 0.08, 0.6, H.matte(0xe8e2d6), 0, -0.2, 0));
        var roof = H.mesh(new T.ConeGeometry(0.6, 0.3, 4), H.matte(color), 0, 0.0, 0); roof.rotation.y = Math.PI / 4; roof.scale.z = 0.7; b.add(roof);
        b.position.set(x, 0, -0.9); s.add(c.tagAll(b, id));
        var stack = new T.Group(); for (var k = 0; k < 10; k++) stack.add(H.cyl(0.09, 0.09, 0.025, H.metal(0xd8b25a), 0, k * 0.03, 0));
        stack.position.set(x + 0.62, -0.95, -0.6); s.add(stack); stack.userData.n = coins; return stack;
      }
      var yourCoins = bank(-1.4, 0x2f5aa8, 'yourbank', 8), shopCoins = bank(1.4, 0x3c8a4f, 'shopbank', 3);
      var box = new T.Group();
      box.add(H.cyl(0.22, 0.25, 0.4, H.matte(0x1f1f1f)));
      box.add(H.cyl(0.16, 0.16, 0.02, H.matte(0x5a5a5a), 0, 0.21, 0));
      box.position.set(1.8, -0.75, 1.0); s.add(c.tagAll(box, 'soundbox'));
      var waves = []; for (var w = 0; w < 3; w++) { var r = H.torus(0.2, 0.012, H.basic(0xff7a33, 0.7), 1.8, -0.5, 1.0); r.rotation.x = Math.PI / 2; s.add(r); waves.push(r); }
      var beam = H.mesh(new T.ConeGeometry(0.35, 0.95, 24, 1, true), H.basic(0x7cf2ff, 0.25)); s.add(beam);
      var packet = H.sph(0.08, H.basic(0xffd36b)); s.add(packet);
      var coin = H.cyl(0.09, 0.09, 0.025, H.metal(0xd8b25a)); coin.rotation.x = Math.PI / 2; s.add(coin);
      var P = { phone: H.v(-1.0, -0.2, 1.3), hub: H.v(0, 1.1, -0.6), you: H.v(-1.4, 0.15, -0.9), shop: H.v(1.4, 0.15, -0.9), box: H.v(1.8, -0.4, 1.0) };
      function arc(a, b, h) { return H.curve([a, H.v((a.x + b.x) / 2, Math.max(a.y, b.y) + h, (a.z + b.z) / 2), b]); }
      var legs = [null, arc(P.phone, P.hub, 0.6), arc(P.hub, P.you, 0.4), arc(P.you, P.shop, 0.9), arc(P.shop, P.box, 0.5)];
      function setStack(st, n) { st.children.forEach(function (ch, i) { ch.visible = i < n; }); }
      // extras:upi
      var tw = new T.Group(); tw.add(H.mesh(new T.ConeGeometry(0.16, 1.2, 4, 1, true), H.metal(0x8f9aa5, { wireframe: true }), 0, 0, 0));
      tw.add(H.box(0.06, 0.18, 0.06, H.matte(0xeeeeee), 0.08, 0.45, 0)); tw.add(H.box(0.06, 0.18, 0.06, H.matte(0xeeeeee), -0.08, 0.45, 0));
      tw.position.set(-0.75, -0.35, 0.2); s.add(c.tagAll(tw, 'tower'));
      c.labels.tower = H.v(-0.75, 0.45, 0.2);

      return {
        update: function (st) {
          beam.visible = st.step === 0;
          if (beam.visible) {
            var from = P.phone, to = H.v(-1.9, -0.4, 0.63), d = new T.Vector3().subVectors(from, to);
            beam.position.copy(to).addScaledVector(d, 0.5); beam.quaternion.setFromUnitVectors(new T.Vector3(0, -1, 0), d.clone().normalize());
            beam.material.opacity = 0.15 + 0.15 * Math.sin(st.t * 12);
          }
          scr.material.color.setHex(st.step === 0 ? 0x2b5a8a : st.step === 4 ? 0x3cc26b : 0x1b3a5c);
          hring.rotation.z += st.dt * 2;
          packet.visible = st.step === 1 || st.step === 2 || st.step === 4;
          if (packet.visible) packet.position.copy(legs[st.step].getPointAt(H.smooth(st.prog)));
          coin.visible = st.step === 3;
          if (coin.visible) { coin.position.copy(legs[3].getPointAt(H.smooth(st.prog))); coin.rotation.y += st.dt * 6; }
          setStack(yourCoins, st.step >= 3 || (st.step === 2 && st.prog > 0.8) ? 7 : 8);
          setStack(shopCoins, st.step === 4 || (st.step === 3 && st.prog > 0.95) ? 4 : 3);
          waves.forEach(function (r, i) {
            r.visible = st.step === 4 && st.prog > 0.6;
            var u = (st.t * 0.8 + i / 3) % 1; r.scale.setScalar(1 + u * 3); r.material.opacity = 0.7 * (1 - u);
          });
        },
        labels: {
          qr: H.v(-1.9, 0.15, 0.7), phoneapp: H.v(-0.95, 0.15, 1.4), npci: H.v(0, 1.55, -0.6), yourbank: H.v(-1.4, 0.35, -0.9),
          shopbank: H.v(1.4, 0.35, -0.9), soundbox: H.v(1.8, -0.2, 1.15)
        }
      };
    }
  });

  // ---------- GPS ----------
  HTW.define({
    id: 'gps', group: G, name: 'GPS', card: 'Satellites, clocks and distances',
    lede: 'Satellites high above the Earth keep broadcasting the time. Your phone measures how late each signal arrives and works out where you are.',
    cycle: 12, ground: false,
    steps: [
      { name: 'Broadcast', kid: 'Tick, tick', text: 'Each GPS satellite carries an extremely accurate atomic clock and keeps broadcasting its position and the exact time.' },
      { name: 'Travel', kid: 'Race down', text: 'The signals travel at the speed of light, about 300,000 km every second, and take around 0.07 seconds to arrive.' },
      { name: 'Measure', kid: 'How far?', text: 'The phone notes when each signal arrives. The delay tells it how far away each satellite is.' },
      { name: 'Locate', kid: 'Where they meet', text: 'Each distance is a giant sphere around a satellite. With four or more, there is only one spot where they all meet: you.' }
    ],
    facts: [['Orbit height', '≈ 20,200 km'], ['Signal travel time', '≈ 0.07 s']],
    parts: [
      { id: 'sats', name: 'GPS satellites', text: 'About 30 satellites circle the Earth in high orbits, so several are always above you.' },
      { id: 'signal', name: 'Radio signal', text: 'Carries the satellite’s position and the time it was sent.' },
      { id: 'spheres', name: 'Distance spheres', text: 'Every point at the measured distance from a satellite. The spheres from four satellites meet at one point.' },
      { id: 'receiver', name: 'Your phone', text: 'Listens for the signals and does the maths. India also has its own system, called NavIC.' },
      { id: 'earth', name: 'Earth', text: 'The satellites circle about 20,200 km above the surface, more than three times the Earth’s radius.' },
      {id: "control", name: "Ground control station", text: "Big dishes on the ground track every satellite and send up tiny corrections to keep their clocks and positions exact."}
    ],
    camera: { pos: [0.6, 2.6, 8.8], target: [0, 0.4, 0] },
    build: function (c) {
      var s = c.scene, tag = c.tag;
      var tex = H.canvasTex(512, 256, function (g, w, h) {
        g.fillStyle = '#2a6fb5'; g.fillRect(0, 0, w, h); g.fillStyle = '#4c9a52';
        var seed = 11; function r() { seed = (seed * 9301 + 49297) % 233280; return seed / 233280; }
        for (var i = 0; i < 26; i++) { g.beginPath(); g.ellipse(r() * w, 40 + r() * (h - 80), 20 + r() * 50, 12 + r() * 30, r() * 3, 0, 6.3); g.fill(); }
        g.fillStyle = 'rgba(255,255,255,0.8)'; g.fillRect(0, 0, w, 14); g.fillRect(0, h - 14, w, 14);
      });
      var earth = new T.Mesh(new T.SphereGeometry(1, 48, 32), new T.MeshStandardMaterial({ map: tex, roughness: 0.8 }));
      s.add(tag(earth, 'earth'));
      var lat = 13 * Math.PI / 180, lon = 0.4;
      var rcv = H.v(Math.cos(lat) * Math.sin(lon), Math.sin(lat), Math.cos(lat) * Math.cos(lon));
      var dot = H.sph(0.06, H.basic(0xff3b2f), rcv.x, rcv.y, rcv.z); s.add(tag(dot, 'receiver'));
      var sats = [], cols = [0xff7a33, 0x3cc26b, 0x8a5cff, 0xf2d24b];
      var orbits = [[0.3, 0.0], [1.1, 1.4], [-0.9, 2.6], [0.5, 4.2]];
      orbits.forEach(function (o, i) {
        var g = new T.Group();
        g.add(H.box(0.14, 0.14, 0.14, H.metal(0xd8b25a)));
        g.add(H.box(0.36, 0.01, 0.12, H.matte(0x1f3a6b), 0.26, 0, 0)); g.add(H.box(0.36, 0.01, 0.12, H.matte(0x1f3a6b), -0.26, 0, 0));
        var blink = H.sph(0.03, H.basic(cols[i]), 0, 0.1, 0); g.add(blink); g.userData.blink = blink;
        s.add(c.tagAll(g, 'sats')); sats.push(g);
      });
      var spheres = sats.map(function (g, i) { var m = H.mesh(new T.SphereGeometry(1, 40, 24), new T.MeshBasicMaterial({ color: cols[i], transparent: true, opacity: 0.08, depthWrite: false, wireframe: true })); s.add(tag(m, 'spheres')); return m; });
      var pulses = sats.map(function (g, i) { var m = H.sph(0.05, H.basic(cols[i])); s.add(tag(m, 'signal')); return m; });
      var lines = sats.map(function (g, i) { var geo = new T.BufferGeometry().setFromPoints([H.v(0, 0, 0), H.v(0, 0, 0)]); var l = new T.Line(geo, new T.LineDashedMaterial({ color: cols[i], dashSize: 0.08, gapSize: 0.06 })); s.add(l); return l; });
      var R = 2.7;
      // extras:gps
      var glat = -0.35, glon = 1.6, gp = H.v(Math.cos(glat) * Math.sin(glon), Math.sin(glat), Math.cos(glat) * Math.cos(glon));
      var dish = H.mesh(new T.SphereGeometry(0.12, 16, 8, 0, Math.PI * 2, 0, Math.PI / 2), H.matte(0xeeeeee, { side: T.DoubleSide }), 0, 0, 0);
      dish.position.copy(gp.clone().multiplyScalar(1.04)); dish.quaternion.setFromUnitVectors(H.v(0, -1, 0), gp.clone().normalize()); s.add(tag(dish, 'control'));
      c.labels.control = gp.clone().multiplyScalar(1.3);

      return {
        update: function (st) {
          sats.forEach(function (g, i) {
            var o = orbits[i], a = o[1] + st.t * 0.05;
            var p = H.v(Math.cos(a) * R, Math.sin(a) * R * Math.sin(o[0]) + 1.2, Math.sin(a) * R * Math.cos(o[0]) + 0.6);
            p.setLength(R); if (p.dot(rcv) < 0.6) p.add(rcv.clone().multiplyScalar(1.5)).setLength(R);
            g.position.copy(p); g.lookAt(0, 0, 0);
            g.userData.blink.visible = Math.sin(st.t * 6 + i) > 0;
            var geo = lines[i].geometry; geo.setFromPoints([p, rcv]); lines[i].computeLineDistances();
            lines[i].visible = st.step >= 1;
            pulses[i].visible = st.step === 1 || st.step === 2;
            var u = st.step === 1 ? ((st.prog * 1.4 + i * 0.12) % 1) : 1;
            pulses[i].position.lerpVectors(p, rcv, u);
            var d = p.distanceTo(rcv), grow = st.step === 3 ? H.smooth(st.prog / 0.6) : st.step === 2 ? H.smooth(st.prog) * 0.15 : 0;
            spheres[i].visible = grow > 0.01; spheres[i].position.copy(p); spheres[i].scale.setScalar(d * Math.max(grow, 0.02));
            spheres[i].material.opacity = st.step === 3 ? 0.14 : 0.08;
          });
          dot.scale.setScalar(st.step === 3 ? 1 + 0.4 * Math.sin(st.t * 8) : 1);
          earth.rotation.y = 0;
        },
        labels: {
          sats: function () { return sats[0].position.clone().add(H.v(0, 0.35, 0)); }, signal: function () { return sats[3].position.clone().lerp(rcv, 0.5).add(H.v(0, 0.2, 0)); },
          spheres: function () { return sats[2].position.clone().multiplyScalar(0.6); }, receiver: function () { return rcv.clone().multiplyScalar(1.25); },
          earth: H.v(-0.8, -0.9, 0.4)
        }
      };
    }
  });
})();
