/* Part 2 · Around the House */
(function () {
  var G = 'Part 2 · Around the House';
  var H = HTW.H, T = window.THREE;

  // ---------- Ceiling fan ----------
  HTW.define({
    id: 'fan', group: G, name: 'Ceiling fan', card: 'Electromagnets that spin blades',
    lede: 'Inside the round body, copper coils become magnets one after another, and their sweeping pull drags the outer shell and blades round.',
    cycle: 10,
    steps: [
      { name: 'Power in', kid: 'Switch on', text: 'Current flows down the wires inside the rod. The regulator on the wall sets how much power gets through, which sets the speed.' },
      { name: 'Coils', kid: 'Make magnets', text: 'Current in the copper coils turns them into electromagnets. They switch on in turn, so the magnetic pull sweeps round in a circle.' },
      { name: 'Rotor', kid: 'Spin', text: 'The sweeping pull drags the outer shell, the rotor, round with it. The capacitor gives it a nudge so it starts the right way.' },
      { name: 'Blades', kid: 'Push air', text: 'The blades are tilted. As they slice round they shove air downwards, and the breeze helps sweat dry so you feel cooler.' }
    ],
    facts: [['Coils', 'stay still'], ['Outer shell', 'spins']],
    parts: [
      { id: 'canopy', name: 'Canopy and capacitor', text: 'The cover at the ceiling hides the wiring and the capacitor, a small box that gives the motor a push to start it turning.' },
      { id: 'downrod', name: 'Downrod', text: 'A metal pipe that holds the fan below the ceiling. The power wires run down inside it.' },
      { id: 'stator', name: 'Stator coils', text: 'Copper coils wound round iron. They stay still and become electromagnets when current flows.' },
      { id: 'rotor', name: 'Rotor shell', text: 'The outer case of the motor. It is pulled round by the coils and carries the blades with it.' },
      { id: 'blades', name: 'Blades', text: 'Tilted paddles. The tilt is what pushes the air downwards instead of just stirring it.' },
      { id: 'air', name: 'Air flow', text: 'A column of moving air. It does not cool the air itself, but it helps your body lose heat faster.' },
      {id: "regulator", name: "Regulator", text: "The dial on the wall. It controls how much power reaches the motor, and so how fast the fan spins."},
      {id: "bearing", name: "Ball bearings", text: "Rings of tiny steel balls that let the rotor spin smoothly round the still centre with very little friction."}
    ],
    camera: { pos: [3.4, 1.4, 4.6], target: [0, 0.7, 0] },
    build: function (c) {
      var s = c.scene, tag = c.tag;
      s.add(tag(H.cyl(0.3, 0.22, 0.25, H.matte(0xf1f1ee), 0, 2.15, 0), 'canopy'));
      s.add(tag(H.box(0.14, 0.1, 0.08, H.matte(0x2f3a46), 0.12, 2.12, 0.18), 'canopy'));
      s.add(H.box(3.2, 0.04, 3.2, H.glass(0xdde3e8, 0.25), 0, 2.3, 0));
      s.add(tag(H.cyl(0.04, 0.04, 0.95, H.metal(0xc9ced3), 0, 1.6, 0), 'downrod'));
      var coils = [];
      for (var i = 0; i < 12; i++) {
        var a = i / 12 * Math.PI * 2, cl = H.box(0.12, 0.2, 0.08, H.metal(0xc8742e, { emissive: new T.Color(0xff5a1f), emissiveIntensity: 0 }), Math.cos(a) * 0.27, 1.0, Math.sin(a) * 0.27);
        cl.rotation.y = -a; s.add(tag(cl, 'stator')); coils.push(cl);
      }
      s.add(tag(H.cyl(0.17, 0.17, 0.22, H.metal(0x6f7880), 0, 1.0, 0), 'stator'));
      var rotor = new T.Group();
      var shell = H.cyl(0.46, 0.46, 0.3, H.glass(0xc9ced3, 0.35), 0, 0, 0, 40, true); rotor.add(tag(shell, 'rotor'));
      rotor.add(tag(H.cyl(0.46, 0.4, 0.06, H.metal(0xe4e6e8), 0, -0.18, 0), 'rotor'));
      rotor.add(tag(H.box(0.06, 0.28, 0.02, H.metal(0xff7a33), 0.45, 0, 0), 'rotor'));
      for (var b = 0; b < 3; b++) {
        var arm = new T.Group(); arm.rotation.y = b / 3 * Math.PI * 2;
        var blade = H.box(1.45, 0.025, 0.32, H.matte(0x8a6a4a), 1.15, -0.12, 0); blade.rotation.x = 0.22;
        arm.add(tag(blade, 'blades')); arm.add(tag(H.box(0.5, 0.03, 0.08, H.metal(0x9aa3ab), 0.55, -0.12, 0), 'blades'));
        rotor.add(arm);
      }
      rotor.position.y = 1.0; s.add(rotor);
      var air = H.stream(s, 50, 0xbfe3ff, 0.04);
      var spin = 0, ang = 0;
      // extras:fan
      var reg = new T.Group(); reg.add(H.box(0.36, 0.5, 0.06, H.matte(0xf1f1ee))); var rk = H.cyl(0.08, 0.08, 0.06, H.matte(0x3a4654), 0, 0.05, 0.05); rk.rotation.x = Math.PI / 2; reg.add(rk);
      reg.add(H.box(0.02, 0.07, 0.02, H.matte(0xffffff), 0, 0.09, 0.09));
      reg.position.set(-1.9, 1.3, -1.0); s.add(c.tagAll(reg, 'regulator'));
      s.add(H.tube([H.v(-1.9, 1.55, -1.0), H.v(-1.6, 2.25, -0.6), H.v(-0.2, 2.25, 0)], 0.012, H.matte(0x666666)));
      [1.15, 0.85].forEach(function (y) { var b = H.torus(0.07, 0.025, H.metal(0x9aa3ab), 0, y, 0); b.rotation.x = Math.PI / 2; s.add(tag(b, 'bearing')); });
      c.labels.regulator = H.v(-1.9, 1.75, -1.0); c.labels.bearing = H.v(0.35, 1.25, 0.4);

      return {
        update: function (st) {
          var target = st.step < 2 ? (st.step === 1 ? st.prog * 0.1 : 0) : st.step === 2 ? 0.1 + st.prog * 0.6 : 1;
          spin += (target - spin) * Math.min(1, st.dt * 3);
          ang += st.dt * spin * 9; rotor.rotation.y = ang;
          var field = st.step >= 1 ? 1 : st.prog;
          coils.forEach(function (cl, i) {
            var k = Math.max(0, Math.cos(i / 12 * Math.PI * 2 + ang + st.t * 4));
            cl.material.emissiveIntensity = field * k * 0.9;
          });
          var flow = st.step === 3 ? 1 : st.step === 2 ? st.prog * 0.4 : 0;
          air.forEach(function (m, i) {
            m.visible = flow > 0.05 && i / air.length < flow + 0.2; if (!m.visible) return;
            var u = (st.t * 0.45 + i / air.length) % 1, a = i * 2.4 + u * 1.5, r = 0.4 + (i % 5) * 0.25;
            m.position.set(Math.cos(a) * r, 0.85 - u * 1.8, Math.sin(a) * r);
            m.material.opacity = 0.8 * Math.sin(u * Math.PI) * flow;
          });
        },
        labels: {
          canopy: H.v(0.5, 2.15, 0.3), downrod: H.v(-0.3, 1.55, 0), stator: H.v(0, 1.0, 0.75), rotor: H.v(-0.55, 0.75, 0.5),
          blades: H.v(1.4, 0.9, 0.6), air: H.v(-0.9, -0.3, 0.6)
        }
      };
    }
  });

  // ---------- LED bulb ----------
  HTW.define({
    id: 'led', group: G, name: 'LED bulb', card: 'Electrons dropping make light',
    lede: 'Inside the bulb a tiny circuit tames the mains electricity, and chips smaller than a grain of rice turn it into light.',
    cycle: 10,
    steps: [
      { name: 'Power in', kid: 'AC arrives', text: 'Mains electricity is AC: it flips direction 50 times a second. The metal cap connects it to the bulb.' },
      { name: 'Driver', kid: 'Make DC', text: 'A small circuit board called the driver turns the AC into a small, steady one-way current, which is what LEDs need.' },
      { name: 'LED chips', kid: 'Electrons drop', text: 'In each chip, electrons fall from a high-energy level to a lower one. Each drop releases a tiny packet of blue light.' },
      { name: 'Phosphor', kid: 'Make it white', text: 'A yellow coating called phosphor turns some of the blue light into yellow. Blue and yellow together look white to our eyes.' }
    ],
    facts: [['Mains in India', '230 V, 50 Hz'], ['Same light as an old 60 W bulb', '≈ 9 W']],
    parts: [
      { id: 'cap', name: 'Cap', text: 'The metal end that fits the holder. Its two contacts bring in mains electricity.' },
      { id: 'driver', name: 'Driver board', text: 'A tiny circuit that changes high-voltage AC into the low, steady DC the LEDs need.' },
      { id: 'housing', name: 'Heat sink', text: 'The body of the bulb. It carries away the little heat the LEDs make, which helps them last for years.' },
      { id: 'chips', name: 'LED chips', text: 'Tiny semiconductor chips. Electrons dropping inside them give out light.' },
      { id: 'phosphor', name: 'Phosphor', text: 'A yellow coating on each chip that turns some blue light into yellow, so the bulb looks white.' },
      { id: 'dome', name: 'Diffuser dome', text: 'The milky cover that spreads the light out so it does not dazzle your eyes.' },
      {id: "mcpcb", name: "Aluminium LED board", text: "The round metal board the chips sit on. Aluminium carries heat away from the chips quickly."},
      {id: "wires", name: "Connecting wires", text: "Carry the current from the cap to the driver, and from the driver up to the LED board."}
    ],
    camera: { pos: [2.2, 1.0, 3.2], target: [0, 0.1, 0] },
    build: function (c) {
      var s = c.scene, tag = c.tag;
      s.add(tag(H.cyl(0.22, 0.22, 0.3, H.metal(0xb8bec4), 0, -0.72, 0), 'cap'));
      s.add(tag(H.cyl(0.03, 0.03, 0.12, H.metal(0xd8b25a), 0.26, -0.72, 0), 'cap')).children;
      s.children[s.children.length - 1].rotation.z = Math.PI / 2;
      s.add(tag(H.cyl(0.03, 0.03, 0.12, H.metal(0xd8b25a), -0.26, -0.72, 0), 'cap'));
      s.children[s.children.length - 1].rotation.z = Math.PI / 2;
      s.add(tag(H.cyl(0.42, 0.24, 0.5, H.glass(0xf2f2ee, 0.35), 0, -0.32, 0, 40), 'housing'));
      var board = H.box(0.3, 0.42, 0.02, H.matte(0x2e7d4f), 0, -0.36, 0); s.add(tag(board, 'driver'));
      [[0.06, -0.25, 0x222222], [-0.07, -0.4, 0x3a6fb0], [0.05, -0.47, 0x222222]].forEach(function (q) { s.add(tag(H.box(0.08, 0.06, 0.05, H.matte(q[2]), q[0], q[1], 0.03), 'driver')); });
      s.add(tag(H.cyl(0.41, 0.41, 0.04, H.metal(0xd0d4d8), 0, -0.05, 0), 'housing'));
      var chips = [], phos = [];
      for (var i = 0; i < 8; i++) {
        var a = i / 8 * Math.PI * 2, r = i % 2 ? 0.27 : 0.17;
        var ch = H.box(0.07, 0.03, 0.07, H.matte(0xf2f2f2, { emissive: new T.Color(0x4f7dff), emissiveIntensity: 0 }), Math.cos(a) * r, -0.015, Math.sin(a) * r);
        s.add(tag(ch, 'chips')); chips.push(ch);
        var ph = H.box(0.05, 0.012, 0.05, H.matte(0xf3cf3a, { emissive: new T.Color(0xffe680), emissiveIntensity: 0 }), Math.cos(a) * r, 0.005, Math.sin(a) * r);
        s.add(tag(ph, 'phosphor')); phos.push(ph);
      }
      var domeMat = H.glass(0xfafaf6, 0.28); domeMat.emissive = new T.Color(0xfff2c8); domeMat.emissiveIntensity = 0;
      var dome = H.mesh(new T.SphereGeometry(0.55, 40, 24, 0, Math.PI * 2, 0, Math.PI * 0.62), domeMat, 0, 0.33, 0);
      s.add(tag(dome, 'dome'));
      var glow = new T.PointLight(0xfff0c8, 0, 6); glow.position.set(0, 0.3, 0); s.add(glow);
      var acB = H.stream(s, 12, 0x7cf2ff, 0.03), dcB = H.stream(s, 14, 0x7cf2ff, 0.03), ph = H.stream(s, 40, 0x4f7dff, 0.035);
      var dcCurve = H.curve([H.v(0, -0.6, 0.03), H.v(0.05, -0.45, 0.04), H.v(-0.03, -0.25, 0.04), H.v(0.1, -0.05, 0.1), H.v(0.2, -0.01, 0.1)]);
      var blue = new T.Color(0x4f7dff), white = new T.Color(0xfff6dc);
      // extras:led
      s.add(tag(H.cyl(0.36, 0.36, 0.02, H.metal(0xd8dde2), 0, -0.035, 0), 'mcpcb'));
      s.add(tag(H.tube([H.v(0.08, -0.6, 0.02), H.v(0.12, -0.5, 0.03), H.v(0.1, -0.15, 0.03), H.v(0.12, -0.05, 0.04)], 0.008, H.matte(0xd23b3b)), 'wires'));
      s.add(tag(H.tube([H.v(-0.08, -0.6, 0.02), H.v(-0.12, -0.5, 0.03), H.v(-0.1, -0.15, 0.03), H.v(-0.12, -0.05, 0.04)], 0.008, H.matte(0x222222)), 'wires'));
      c.labels.mcpcb = H.v(0.6, -0.08, -0.3); c.labels.wires = H.v(0.5, -0.6, 0.3);

      return {
        update: function (st) {
          acB.forEach(function (m, i) {
            m.visible = st.step === 0 || st.step === 1;
            m.position.set(Math.cos(i) * 0.12, -0.85 + (i / acB.length) * 0.2 + Math.sin(st.t * 12) * 0.05, Math.sin(i) * 0.12);
          });
          H.flow(dcB, dcCurve, st.t, { speed: 0.6, visible: st.step >= 1, range: st.step === 1 ? [0, 0.5 + st.prog * 0.5] : [0, 1] });
          var on = st.step >= 2 ? (st.step === 2 ? H.smooth(st.prog / 0.3) : 1) : 0;
          chips.forEach(function (ch, i) { ch.material.emissiveIntensity = on * (0.8 + 0.2 * Math.sin(st.t * 9 + i)); });
          var w = st.step === 3 ? H.smooth(st.prog / 0.4) : 0;
          phos.forEach(function (p) { p.material.emissiveIntensity = w * 0.9; });
          domeMat.emissiveIntensity = on * (0.15 + 0.55 * w);
          glow.intensity = on * (0.8 + 1.4 * w); glow.color.copy(blue).lerp(white, w);
          ph.forEach(function (m, i) {
            m.visible = on > 0.05; if (!m.visible) return;
            var u = (st.t * 0.6 + i / ph.length) % 1, a = i * 2.39, el = 0.2 + (i % 7) / 7 * 1.2;
            var r = 0.05 + u * 1.3;
            m.position.set(Math.cos(a) * Math.cos(el) * r, 0.02 + Math.sin(el) * r, Math.sin(a) * Math.cos(el) * r);
            m.material.color.copy(blue).lerp(white, r > 0.4 ? w : 0);
            m.material.opacity = (1 - u) * 0.9 * on;
          });
        },
        labels: {
          cap: H.v(0.45, -0.85, 0.2), driver: H.v(-0.55, -0.45, 0.4), housing: H.v(0.6, -0.3, 0.3), chips: H.v(-0.55, 0.0, 0.4),
          phosphor: H.v(0.5, 0.05, 0.45), dome: H.v(0, 0.98, 0)
        }
      };
    }
  });

  // ---------- Air conditioner ----------
  HTW.define({
    id: 'ac', group: G, name: 'Air conditioner', card: 'A fridge for your room',
    lede: 'A split AC uses the same loop as a fridge. The cold coil sits in your room, and the hot coil sits outside the wall.',
    cycle: 12,
    steps: [
      { name: 'Indoor coil', kid: 'Soak up heat', text: 'The indoor fan pulls warm room air over cold coils. The refrigerant inside boils and soaks up the heat, so the air blowing out is cool.' },
      { name: 'Compressor', kid: 'Squeeze', text: 'The refrigerant gas travels outside to the compressor, which squeezes it until it is hot.' },
      { name: 'Outdoor coil', kid: 'Dump heat', text: 'The outdoor fan blows air over the hot coils. The heat goes outside, which is why the air from the outdoor unit feels hot.' },
      { name: 'Drain', kid: 'Dry the air', text: 'Water vapour in the room air condenses on the cold coil, like drops on a cold glass. It drips away through the drain pipe.' }
    ],
    facts: [['Same loop as', 'a fridge'], ['Bonus', 'dries the air']],
    parts: [
      { id: 'indoor', name: 'Indoor unit', text: 'The part on your wall. It holds the cold coil and a long blower fan.' },
      { id: 'evap', name: 'Cold coil', text: 'Thin pipes with metal fins. The refrigerant boils inside them and soaks up heat from the room air.' },
      { id: 'blower', name: 'Blower', text: 'A long drum-shaped fan that pulls air through the coil and pushes it back into the room.' },
      { id: 'compressor', name: 'Compressor', text: 'The pump in the outdoor unit. It squeezes the refrigerant gas and makes it hot.' },
      { id: 'condenser', name: 'Hot coil', text: 'The outdoor coil, where heat from your room is released into the outside air.' },
      { id: 'fan', name: 'Outdoor fan', text: 'Blows outside air across the hot coil to carry the heat away.' },
      { id: 'pipes', name: 'Copper pipes', text: 'Carry the refrigerant through the wall. A tiny expansion valve makes it icy cold before it enters the indoor coil.' },
      { id: 'drain', name: 'Drain pipe', text: 'Carries away the water that condenses on the cold coil.' },
      {id: "filter", name: "Air filter", text: "A fine mesh that catches dust before the air reaches the cold coil. It should be cleaned every few weeks."},
      {id: "louvre", name: "Swing louvre", text: "A flap that swings up and down to spread the cool air around the room."},
      {id: "valve", name: "Expansion valve", text: "A very narrow passage. The refrigerant’s pressure drops as it squeezes through, so it turns icy cold before heading indoors."}
    ],
    camera: { pos: [1.2, 1.9, 7.6], target: [0.1, 0.5, 0] },
    build: function (c) {
      var s = c.scene, tag = c.tag;
      s.add(H.box(0.08, 3.4, 2.4, H.glass(0xc9b9a5, 0.3), 0.45, 0.6, 0));
      s.add(tag(H.box(1.7, 0.55, 0.42, H.glass(0xf3f4f5, 0.25), -0.6, 1.45, 0), 'indoor'));
      var evap = H.coil(-1.35, 1.32, -0.05, 1.5, 0.3, 7).map(function (p) { return H.v(p.x, p.y, p.z); });
      // lay coil rows horizontally: rows along y, sweeping x
      s.add(tag(H.tube(evap, 0.018, H.metal(0x9fc7ee)), 'evap'));
      var blower = H.cyl(0.09, 0.09, 1.4, H.metal(0x7c8690), -0.6, 1.24, 0.08, 12); blower.rotation.z = Math.PI / 2; s.add(tag(blower, 'blower'));
      s.add(tag(H.box(1.2, 0.9, 0.55, H.glass(0xc5ccd3, 0.25), 1.35, -0.5, 0), 'compressor'));
      var comp = H.cyl(0.16, 0.16, 0.42, H.metal(0x22272d), 1.7, -0.7, -0.05); s.add(tag(comp, 'compressor'));
      var cond = H.coil(0.85, -0.85, -0.22, 1.0, 0.7, 7); s.add(tag(H.tube(cond, 0.018, H.metal(0x30353b)), 'condenser'));
      var fan = new T.Group();
      for (var b = 0; b < 3; b++) { var bl = H.box(0.3, 0.1, 0.02, H.matte(0x2a2f35), 0.15, 0, 0); var arm = new T.Group(); arm.add(bl); arm.rotation.z = b / 3 * Math.PI * 2; fan.add(arm); }
      fan.position.set(1.15, -0.45, 0.26); s.add(c.tagAll(fan, 'fan'));
      var liquid = [cond[cond.length - 1], H.v(0.7, -0.05, -0.1), H.v(0.45, 0.6, -0.1), H.v(0.2, 1.3, -0.1), evap[0]];
      var suction = [evap[evap.length - 1], H.v(0.2, 1.4, 0.08), H.v(0.45, 0.7, 0.08), H.v(1.2, -0.3, 0.08), H.v(1.55, -0.55, 0.0), H.v(1.7, -0.5, -0.05)];
      var hot = [H.v(1.7, -0.5, -0.05), H.v(1.6, -0.95, -0.2), cond[0]];
      s.add(tag(H.tube(liquid, 0.022, H.metal(0xb87333)), 'pipes'));
      s.add(tag(H.tube(suction, 0.03, H.metal(0xb87333)), 'pipes'));
      s.add(tag(H.tube(hot, 0.022, H.metal(0xa36a4a)), 'pipes'));
      var drainPts = [H.v(-1.35, 1.2, 0.05), H.v(-1.45, 0.8, 0.05), H.v(-1.4, 0.3, 0.1)];
      s.add(tag(H.tube(drainPts, 0.025, H.matte(0xe8e8e8)), 'drain'));
      var segs = [hot, cond, liquid, evap, suction];
      var lens = segs.map(function (p) { return H.curve(p).getLength(); }), tot = lens.reduce(function (a, b) { return a + b; });
      var bounds = [], acc = 0; lens.forEach(function (l) { acc += l / tot; bounds.push(acc); });
      var loop = H.curve([].concat(hot, cond.slice(1), liquid.slice(1), evap.slice(1), suction.slice(1)), true);
      var beads = H.stream(s, 60, 0xffffff, 0.035);
      var cHot = new T.Color(0xff4a1a), cWarm = new T.Color(0xffb26b), cCold = new T.Color(0x3d8ef0), cCool = new T.Color(0x9cc8ff);
      function col(u, m) {
        var k = m.material.color;
        if (u < bounds[0]) k.copy(cHot); else if (u < bounds[1]) k.copy(cHot).lerp(cWarm, (u - bounds[0]) / (bounds[1] - bounds[0]));
        else if (u < bounds[2]) k.copy(cWarm).lerp(cCold, (u - bounds[1]) / (bounds[2] - bounds[1]));
        else if (u < bounds[3]) k.copy(cCold).lerp(cCool, (u - bounds[2]) / (bounds[3] - bounds[2]));
        else k.copy(cCool).lerp(cHot, (u - bounds[3]) / (1 - bounds[3]) * 0.6);
      }
      var roomIn = H.stream(s, 14, 0xff9a4a, 0.04), roomOut = H.stream(s, 14, 0x6fb4ff, 0.04), hotOut = H.stream(s, 14, 0xff6a2a, 0.04), drops = H.stream(s, 6, 0x4aa3ff, 0.035);
      var fanSpin = 0;
      // extras:ac
      s.add(tag(H.box(1.6, 0.4, 0.01, H.glass(0x9aa3ab, 0.35), -0.6, 1.48, 0.22), 'filter'));
      var lv = H.box(1.5, 0.02, 0.16, H.matte(0xf3f4f5), 0, 0, 0.08); var lvg = new T.Group(); lvg.add(lv); lvg.position.set(-0.6, 1.18, 0.2); s.add(c.tagAll(lvg, 'louvre'));
      s.add(tag(H.cyl(0.05, 0.05, 0.16, H.metal(0xc69b4a), 0.68, -0.1, -0.1), 'valve'));
      c.anim(function (st) { lvg.rotation.x = 0.5 + Math.sin(st.t * 1.2) * 0.35; });
      c.labels.filter = H.v(-1.55, 1.65, 0.3); c.labels.louvre = H.v(-1.5, 1.0, 0.4); c.labels.valve = H.v(0.95, 0.05, -0.1);

      return {
        update: function (st) {
          H.flow(beads, loop, st.t, { speed: 0.07, color: col });
          blower.rotation.x += st.dt * 12; fanSpin += st.dt * 14; fan.rotation.z = fanSpin;
          comp.position.x = 1.7 + Math.sin(st.t * 60) * 0.004;
          roomIn.forEach(function (m, i) { var u = (st.t * 0.4 + i / roomIn.length) % 1; m.position.set(-1.4 + (i % 7) * 0.22, 2.3 - u * 0.65, 0.3 - u * 0.25); m.material.opacity = 0.85 * (1 - u * 0.5); });
          roomOut.forEach(function (m, i) { var u = (st.t * 0.4 + i / roomOut.length) % 1; m.position.set(-1.4 + (i % 7) * 0.22, 1.15 - u * 0.9, 0.3 + u * 1.1); m.material.opacity = 0.85 * (1 - u); });
          hotOut.forEach(function (m, i) { var u = (st.t * 0.45 + i / hotOut.length) % 1; m.position.set(0.95 + (i % 4) * 0.12, -0.75 + (i % 3) * 0.2, 0.3 + u * 1.2); m.material.opacity = 0.85 * (1 - u); });
          drops.forEach(function (m, i) { var u = (st.t * 0.7 + i / drops.length) % 1; m.visible = st.step === 3 || i < 2; m.position.set(-1.4, 0.3 - u * 1.2, 0.1); });
        },
        labels: {
          indoor: H.v(-0.6, 1.9, 0.2), evap: H.v(-1.2, 1.5, 0.3), blower: H.v(-0.1, 1.05, 0.35), compressor: H.v(1.75, -1.05, 0.3),
          condenser: H.v(1.35, -0.1, -0.25), fan: H.v(1.1, -0.85, 0.45), pipes: H.v(0.75, 0.5, 0.2), drain: H.v(-1.7, 0.45, 0.2)
        }
      };
    }
  });

  // ---------- Inverter and battery ----------
  HTW.define({
    id: 'inverter', group: G, name: 'Inverter and battery', card: 'Turns battery DC into home AC',
    lede: 'When the power goes off, the inverter flips the battery’s one-way current back and forth to make the AC your fans and lights need.',
    cycle: 12,
    steps: [
      { name: 'Charging', kid: 'Fill up', text: 'While the mains power is on, the charger pushes energy into the battery, where it is stored as chemical energy.' },
      { name: 'Power cut', kid: 'Switch over', text: 'When the mains fails, a relay clicks over in a fraction of a second, and the battery takes over.' },
      { name: 'Switches', kid: 'Flip, flip, flip', text: 'The battery gives DC, which flows one way only. Electronic switches flip its direction back and forth 50 times a second, making AC.' },
      { name: 'Transformer', kid: 'Step up', text: 'The transformer raises the low battery voltage to 230 V, and the wave is smoothed so your fan and lights can use it.' }
    ],
    facts: [['Battery', '12 V DC'], ['Output', '230 V AC, 50 Hz']],
    parts: [
      { id: 'mains', name: 'Mains supply', text: 'Electricity from the power company. When it is on, it runs the house and charges the battery.' },
      { id: 'battery', name: 'Battery', text: 'Stores energy as chemicals in its cells. It gives out DC: current that flows one way only.' },
      { id: 'charger', name: 'Charger circuit', text: 'Changes mains AC into DC to fill up the battery, and stops when the battery is full.' },
      { id: 'relay', name: 'Relay', text: 'An electric switch that flips the house over to battery power the moment the mains fails.' },
      { id: 'switches', name: 'Electronic switches', text: 'Four fast switches that reverse the direction of the battery current again and again, making AC.' },
      { id: 'transformer', name: 'Transformer', text: 'Two coils of wire on an iron core. It raises the voltage from about 12 V to 230 V.' },
      { id: 'load', name: 'Lights and fans', text: 'The things in your home that keep working during the power cut.' },
      {id: "display", name: "Display", text: "Shows whether the house is on mains or battery power, and how full the battery is."},
      {id: "coolfan", name: "Cooling fan", text: "The switches and transformer get warm, so a small fan blows air through the inverter box."},
      {id: "fuse", name: "Fuse", text: "A thin wire that melts if too much current flows, protecting the wiring and the battery."}
    ],
    camera: { pos: [0.3, 1.6, 5.4], target: [0.2, 0.15, 0] },
    build: function (c) {
      var s = c.scene, tag = c.tag;
      var bat = new T.Group();
      bat.add(H.box(1.0, 0.75, 0.6, H.glass(0x1f2833, 0.55)));
      for (var i = 0; i < 6; i++) bat.add(H.cyl(0.05, 0.05, 0.04, H.matte(0xf2c14e), -0.38 + i * 0.15, 0.39, 0));
      bat.add(H.cyl(0.05, 0.05, 0.1, H.matte(0xd23b3b), 0.42, 0.42, 0.18)); bat.add(H.cyl(0.05, 0.05, 0.1, H.matte(0x222222), -0.42, 0.42, 0.18));
      bat.position.set(-1.5, -0.6, 0); s.add(c.tagAll(bat, 'battery'));
      var level = H.box(0.85, 0.6, 0.02, H.basic(0x3cc26b, 0.75), -1.5, -0.6, 0.31); level.geometry.translate(0, 0.3, 0); level.position.y = -0.9; s.add(level);
      s.add(H.box(1.5, 1.0, 0.7, H.glass(0xc5ccd3, 0.18), 0.25, -0.45, 0));
      s.add(tag(H.box(0.4, 0.25, 0.04, H.matte(0x2e7d4f), -0.2, -0.15, 0), 'charger'));
      var relayLever = H.box(0.16, 0.03, 0.03, H.metal(0xd8b25a), -0.2, -0.5, 0.05); relayLever.geometry.translate(0.08, 0, 0);
      s.add(tag(relayLever, 'relay')); s.add(tag(H.box(0.12, 0.12, 0.12, H.matte(0x2f5aa8), -0.3, -0.5, 0), 'relay'));
      var sw = [];
      [[0.05, -0.2], [0.35, -0.2], [0.05, -0.6], [0.35, -0.6]].forEach(function (q) {
        var m = H.box(0.12, 0.16, 0.06, H.matte(0x1d1f22, { emissive: new T.Color(0xff6a1a), emissiveIntensity: 0 }), q[0], q[1], 0);
        s.add(tag(m, 'switches')); sw.push(m);
      });
      var tr = new T.Group();
      tr.add(H.box(0.3, 0.4, 0.15, H.metal(0x55606b)));
      tr.add(H.cyl(0.1, 0.1, 0.22, H.metal(0xc8742e), -0.1, 0, 0.1)); tr.add(H.cyl(0.1, 0.1, 0.22, H.metal(0xc8742e), 0.1, 0, 0.1));
      tr.position.set(0.72, -0.45, 0); s.add(c.tagAll(tr, 'transformer'));
      var bulbMat = H.glass(0xfff4c8, 0.6); bulbMat.emissive = new T.Color(0xffd36b); bulbMat.emissiveIntensity = 0;
      s.add(tag(H.sph(0.18, bulbMat, 1.75, 0.55, 0), 'load'));
      s.add(tag(H.cyl(0.07, 0.07, 0.12, H.metal(0xb8bec4), 1.75, 0.34, 0), 'load'));
      s.add(tag(H.box(0.5, 0.35, 0.05, H.matte(0xf2f2ee), 1.75, -0.45, 0), 'load'));
      var pole = H.cyl(0.04, 0.04, 1.4, H.matte(0x6c5a48), -1.0, 1.2, -0.3); s.add(tag(pole, 'mains'));
      var mainsWireMat = H.metal(0x333333); var mainsWire = H.tube([H.v(-1.0, 1.85, -0.3), H.v(-0.6, 1.0, -0.2), H.v(-0.2, 0.1, 0)], 0.02, mainsWireMat); s.add(tag(mainsWire, 'mains'));
      s.add(H.tube([H.v(-0.2, -0.15, 0), H.v(-0.7, -0.15, 0.1), H.v(-1.08, -0.18, 0.18)], 0.02, H.metal(0xd23b3b)));
      s.add(H.tube([H.v(0.87, -0.45, 0), H.v(1.3, -0.45, 0.05), H.v(1.5, -0.45, 0)], 0.02, H.metal(0x333333)));
      s.add(H.tube([H.v(1.75, -0.28, 0), H.v(1.75, 0.28, 0)], 0.015, H.metal(0x333333)));
      // Waveform display
      var N = 160, pos = new Float32Array(N * 3), geo = new T.BufferGeometry(); geo.setAttribute('position', new T.BufferAttribute(pos, 3));
      var wave = new T.Line(geo, new T.LineBasicMaterial({ color: 0xff7a33 })); s.add(wave);
      s.add(H.box(1.5, 0.004, 0.004, H.basic(0x7d8a97), 0.25, 0.75, 0));
      var chargeB = H.stream(s, 12, 0x7cf2ff, 0.035), dcB = H.stream(s, 12, 0x7cf2ff, 0.035), acB = H.stream(s, 14, 0xffd36b, 0.035);
      var chargeC = H.curve([H.v(-1.0, 1.85, -0.3), H.v(-0.6, 1.0, -0.2), H.v(-0.2, 0.0, 0), H.v(-0.7, -0.15, 0.1), H.v(-1.08, -0.18, 0.18)]);
      var dcC = H.curve([H.v(-1.08, -0.18, 0.18), H.v(-0.6, -0.4, 0.15), H.v(-0.2, -0.45, 0.05), H.v(0.2, -0.4, 0.05), H.v(0.6, -0.45, 0.1)]);
      var acC = H.curve([H.v(0.87, -0.45, 0.05), H.v(1.3, -0.45, 0.05), H.v(1.75, -0.28, 0), H.v(1.75, 0.3, 0)]);
      var bulbLight = new T.PointLight(0xffd36b, 0, 4); bulbLight.position.set(1.75, 0.6, 0.3); s.add(bulbLight);
      var charge = 0.35;
      // extras:inverter
      var dc = document.createElement('canvas'); dc.width = 256; dc.height = 96; var dt2 = new T.CanvasTexture(dc);
      var dm = new T.Mesh(new T.PlaneGeometry(0.5, 0.19), new T.MeshBasicMaterial({ map: dt2 })); dm.position.set(0.25, 0.0, 0.36); s.add(tag(dm, 'display'));
      var fan2 = new T.Group(); for (var fi = 0; fi < 4; fi++) { var g2 = new T.Group(); g2.add(H.box(0.14, 0.05, 0.01, H.matte(0x3a4048), 0.07, 0, 0)); g2.rotation.z = fi / 4 * Math.PI * 2; fan2.add(g2); }
      fan2.position.set(1.01, -0.45, 0); fan2.rotation.y = Math.PI / 2; s.add(c.tagAll(fan2, 'coolfan'));
      var fz = H.cyl(0.03, 0.03, 0.14, H.glass(0xffffff, 0.6), -0.6, -0.23, 0.22); fz.rotation.z = Math.PI / 2; s.add(tag(fz, 'fuse'));
      var lastMode = '';
      c.anim(function (st) {
        fan2.children.forEach(function () {}); fan2.rotation.x += st.dt * 10;
        var mode = st.step === 0 ? 'ON MAINS' : 'ON BATTERY';
        if (mode === lastMode) return; lastMode = mode;
        var g = dc.getContext('2d'); g.fillStyle = '#0b1a14'; g.fillRect(0, 0, 256, 96); g.fillStyle = st.step === 0 ? '#5dff9a' : '#ffcf5d';
        g.font = '700 34px monospace'; g.textAlign = 'center'; g.textBaseline = 'middle'; g.fillText(mode, 128, 48); dt2.needsUpdate = true;
      });
      c.labels.display = H.v(0.25, 0.22, 0.4); c.labels.coolfan = H.v(1.25, -0.25, 0.1); c.labels.fuse = H.v(-0.85, -0.35, 0.3);

      return {
        update: function (st) {
          var mainsOn = st.step === 0;
          mainsWireMat.color.setHex(mainsOn ? 0x2f5aa8 : 0x666666);
          if (st.step === 0) charge = 0.35 + 0.6 * st.prog; else charge = Math.max(0.3, charge - st.dt * 0.01);
          level.scale.y = charge;
          relayLever.rotation.z = st.step === 0 ? 0.5 : (st.step === 1 ? 0.5 - H.smooth(st.prog / 0.2) * 1.0 : -0.5);
          H.flow(chargeB, chargeC, st.t, { speed: 0.4, visible: mainsOn });
          H.flow(dcB, dcC, st.t, { speed: 0.5, visible: st.step >= 1 && !(st.step === 1 && st.prog < 0.2) });
          var flip = Math.sin(st.t * 12) > 0;
          sw.forEach(function (m, i) { var onPair = (i === 0 || i === 3) ? flip : !flip; m.material.emissiveIntensity = st.step >= 2 && onPair ? 0.8 : 0; });
          var out = st.step === 3 ? H.smooth(st.prog / 0.25) : st.step === 0 ? 1 : 0;
          H.flow(acB, acC, st.t, { speed: 0.5, visible: out > 0.1 });
          bulbMat.emissiveIntensity = out * 0.9; bulbLight.intensity = out * 1.6;
          for (var i = 0; i < N; i++) {
            var x = -0.5 + (i / (N - 1)) * 1.5, ph = i / N * Math.PI * 6 - st.t * 4, y;
            if (st.step === 0 || st.step === 3) y = Math.sin(ph) * 0.18;
            else if (st.step === 2) y = (Math.sin(ph) > 0 ? 1 : -1) * 0.16;
            else y = st.prog < 0.2 ? Math.sin(ph) * 0.18 * (1 - st.prog / 0.2) : 0.12;
            pos[i * 3] = x; pos[i * 3 + 1] = 0.75 + y; pos[i * 3 + 2] = 0;
          }
          geo.attributes.position.needsUpdate = true;
        },
        labels: {
          mains: H.v(-1.2, 1.7, -0.2), battery: H.v(-1.5, -1.1, 0.35), charger: H.v(-0.2, 0.08, 0.3), relay: H.v(-0.5, -0.75, 0.35),
          switches: H.v(0.2, -0.85, 0.4), transformer: H.v(0.72, -0.05, 0.3), load: H.v(1.75, 0.95, 0)
        },
        marks: [{ text: 'Electricity wave', pos: H.v(1.0, 1.05, 0) }]
      };
    }
  });

  // ---------- RO water purifier ----------
  HTW.define({
    id: 'ro', group: G, name: 'Water purifier (RO)', card: 'Four stages of cleaning',
    lede: 'Water is pushed through four cleaning stages. Watch each kind of dirt get caught at a different stop.',
    cycle: 12,
    steps: [
      { name: 'Sediment filter', kid: 'Catch dirt', text: 'A spun filter catches sand, rust and dirt you could see with your eyes.' },
      { name: 'Carbon filter', kid: 'Grab smells', text: 'A block of activated charcoal, full of tiny pores, grabs chlorine and bad smells and tastes.' },
      { name: 'RO membrane', kid: 'Squeeze through', text: 'A pump forces water against a sheet with holes so tiny that mostly only water gets through. Dissolved salts are washed away as reject water.' },
      { name: 'UV lamp', kid: 'Zap germs', text: 'Ultraviolet light damages any germs that slipped through, so they cannot multiply and make you ill.' }
    ],
    facts: [['RO pores', 'about 0.0001 µm'], ['Reject water', 'goes down the drain']],
    parts: [
      { id: 'pump', name: 'Booster pump', text: 'Pushes the water hard enough to force it through the RO membrane.' },
      { id: 'sediment', name: 'Sediment filter', text: 'The first stop: catches sand, rust and visible dirt.' },
      { id: 'carbon', name: 'Carbon filter', text: 'Charcoal with a huge surface area that traps chlorine and smelly chemicals.' },
      { id: 'membrane', name: 'RO membrane', text: 'A rolled-up sheet with incredibly tiny holes. Water squeezes through; salts and most germs do not.' },
      { id: 'uv', name: 'UV lamp', text: 'A glass tube that shines ultraviolet light on the water to harm germs.' },
      { id: 'tank', name: 'Storage tank', text: 'Holds the clean water until you fill your glass.' },
      { id: 'reject', name: 'Reject drain', text: 'Carries the salty leftover water away. It can be collected and reused for mopping or plants.' },
      {id: "faucet", name: "Tap", text: "Lets out clean water from the storage tank when you fill your glass."},
      {id: "restrictor", name: "Flow restrictor", text: "Lets reject water out slowly, which keeps the pressure high on the RO membrane so it works properly."}
    ],
    camera: { pos: [0.7, 1.4, 6.4], target: [0.25, -0.1, 0] },
    build: function (c) {
      var s = c.scene, tag = c.tag;
      var X = { pump: -1.65, sed: -0.95, car: -0.3, ro: 0.35, uv: 1.0, tank: 1.7 };
      s.add(tag(H.box(0.4, 0.3, 0.3, H.metal(0x3a4048), X.pump, -0.65, 0), 'pump'));
      var mats = {};
      function cart(x, color, id, op) { var m = H.glass(color, op); m.emissive = new T.Color(0xff6a1a); m.emissiveIntensity = 0; mats[id] = m; s.add(tag(H.cyl(0.24, 0.24, 1.3, m, x, 0, 0), id)); s.add(tag(H.cyl(0.26, 0.26, 0.08, H.metal(0x9aa4ae), x, 0.68, 0), id)); }
      cart(X.sed, 0xf2f2ec, 'sediment', 0.5); cart(X.car, 0x2a2d31, 'carbon', 0.55); cart(X.ro, 0x6fa8dc, 'membrane', 0.45);
      var uvMat = H.glass(0xd8d0ff, 0.35); uvMat.emissive = new T.Color(0x8a5cff); uvMat.emissiveIntensity = 0.4; mats.uv = uvMat;
      s.add(tag(H.cyl(0.14, 0.14, 1.3, uvMat, X.uv, 0, 0), 'uv'));
      var uvCore = H.cyl(0.04, 0.04, 1.2, H.basic(0xb69cff), X.uv, 0, 0); s.add(tag(uvCore, 'uv'));
      s.add(tag(H.box(0.6, 1.0, 0.5, H.glass(0xbfe0ff, 0.25), X.tank, -0.3, 0), 'tank'));
      var tankWater = H.box(0.55, 0.6, 0.45, H.glass(0x4aa3ff, 0.45), X.tank, -0.5, 0); s.add(tag(tankWater, 'tank'));
      var Y0 = -0.62, Y1 = 0.62;
      var path = [H.v(-2.3, -0.65, 0), H.v(X.pump, -0.65, 0), H.v(X.pump + 0.3, 0.8, 0), H.v(X.sed, Y1, 0), H.v(X.sed, Y0, 0), H.v((X.sed + X.car) / 2, -0.8, 0), H.v(X.car, Y0, 0), H.v(X.car, Y1, 0),
        H.v((X.car + X.ro) / 2, 0.82, 0), H.v(X.ro, Y1, 0), H.v(X.ro, Y0, 0), H.v((X.ro + X.uv) / 2, -0.8, 0), H.v(X.uv, Y0, 0), H.v(X.uv, Y1, 0), H.v((X.uv + X.tank) / 2, 0.85, 0), H.v(X.tank, 0.2, 0)];
      var main = H.curve(path);
      s.add(H.tube([H.v(-2.3, -0.65, 0), H.v(X.pump - 0.2, -0.65, 0)], 0.03, H.matte(0xe8e8e8)));
      [[H.v(X.pump + 0.2, -0.6, 0), H.v(X.pump + 0.3, 0.8, 0), H.v(X.sed - 0.1, 0.75, 0)], [H.v(X.sed + 0.1, -0.7, 0), H.v((X.sed + X.car) / 2, -0.8, 0), H.v(X.car - 0.1, -0.7, 0)],
        [H.v(X.car + 0.1, 0.75, 0), H.v((X.car + X.ro) / 2, 0.82, 0), H.v(X.ro - 0.1, 0.75, 0)], [H.v(X.ro + 0.1, -0.7, 0), H.v((X.ro + X.uv) / 2, -0.8, 0), H.v(X.uv - 0.1, -0.7, 0)],
        [H.v(X.uv + 0.1, 0.72, 0), H.v((X.uv + X.tank) / 2, 0.85, 0), H.v(X.tank, 0.2, 0)]].forEach(function (p) { s.add(H.tube(p, 0.025, H.matte(0xe8e8e8))); });
      var rejPts = [H.v(X.ro, -0.68, 0.1), H.v(X.ro + 0.1, -0.9, 0.35), H.v(X.ro + 0.6, -0.95, 0.55), H.v(X.ro + 1.4, -0.95, 0.7)];
      s.add(tag(H.tube(rejPts, 0.025, H.matte(0x8a8f96)), 'reject'));
      var rejC = H.curve(rejPts);
      function uAt(pt) { var best = 0, bd = 1e9; for (var i = 0; i <= 400; i++) { var d = main.getPointAt(i / 400).distanceTo(pt); if (d < bd) { bd = d; best = i / 400; } } return best; }
      var stopSed = uAt(H.v(X.sed, 0.2, 0)), stopCar = uAt(H.v(X.car, 0.0, 0)), stopRO = uAt(H.v(X.ro, -0.4, 0)), stopUV = uAt(H.v(X.uv, 0.1, 0));
      var water = H.stream(s, 50, 0x4aa3ff, 0.03);
      var dirt = H.stream(s, 8, 0x8a5a2b, 0.05), smell = H.stream(s, 8, 0x5fb85a, 0.04), salt = H.stream(s, 10, 0xffffff, 0.03), germ = H.stream(s, 6, 0xb05cff, 0.04);
      function imp(stream, stop, t, sp, after) {
        stream.forEach(function (m, i) {
          var u = (t * sp + i / stream.length) % 1, end = stop + 0.02;
          var reach = u * (end / 0.75);
          if (reach <= end) { m.position.copy(main.getPointAt(Math.min(reach, 1))); m.material.opacity = 0.95; m.visible = true; }
          else if (after) after(m, (reach - end) / ((1 / 0.75 - 1) * end + 1e-6));
          else { m.position.copy(main.getPointAt(end)); m.position.x += Math.sin(i * 3) * 0.1; m.position.y += Math.cos(i * 2) * 0.25; m.material.opacity = 0.9; }
        });
      }
      // extras:ro
      s.add(tag(H.tube([H.v(X.tank + 0.3, -0.6, 0.0), H.v(X.tank + 0.5, -0.55, 0.15), H.v(X.tank + 0.55, -0.35, 0.25), H.v(X.tank + 0.62, -0.5, 0.3)], 0.03, H.metal(0xc0c6cc)), 'faucet'));
      s.add(tag(H.box(0.14, 0.08, 0.08, H.matte(0x2f5aa8), X.ro + 0.6, -0.95, 0.55), 'restrictor'));
      c.labels.faucet = H.v(X.tank + 0.6, -0.15, 0.3); c.labels.restrictor = H.v(X.ro + 0.75, -0.75, 0.6);

      return {
        update: function (st) {
          H.flow(water, main, st.t, { speed: 0.06 });
          imp(dirt, stopSed, st.t, 0.12);
          imp(smell, stopCar, st.t, 0.1);
          imp(salt, stopRO, st.t, 0.09, function (m, f) { m.position.copy(rejC.getPointAt(H.clamp(f, 0, 1))); m.material.opacity = 0.95; });
          imp(germ, stopUV, st.t, 0.08, function (m, f) { m.position.copy(main.getPointAt(H.clamp(stopUV + 0.02 + f * 0.05, 0, 1))); m.material.opacity = Math.max(0, 0.9 - f * 1.5); m.material.color.setHex(0x6b6b6b); });
          germ.forEach(function (m, i) { if (m.material.opacity > 0.9) m.material.color.setHex(0xb05cff); });
          var active = ['sediment', 'carbon', 'membrane', 'uv'][st.step];
          ['sediment', 'carbon', 'membrane'].forEach(function (k) { mats[k].emissiveIntensity = k === active ? 0.25 + 0.15 * Math.sin(st.t * 6) : 0; });
          uvMat.emissiveIntensity = active === 'uv' ? 0.9 + 0.3 * Math.sin(st.t * 10) : 0.4;
          tankWater.scale.y = 0.6 + 0.4 * ((st.p * 2) % 1); tankWater.position.y = -0.8 + 0.3 * tankWater.scale.y;
        },
        labels: {
          pump: H.v(X.pump, -0.95, 0.3), sediment: H.v(X.sed, 0.95, 0), carbon: H.v(X.car, 1.05, 0), membrane: H.v(X.ro, 1.05, 0),
          uv: H.v(X.uv, 0.95, 0.1), tank: H.v(X.tank, 0.4, 0.3), reject: H.v(X.ro + 1.2, -1.15, 0.7)
        }
      };
    }
  });
})();
