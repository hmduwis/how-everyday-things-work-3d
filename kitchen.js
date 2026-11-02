/* Part 1 · In the Kitchen */
(function () {
  var G = 'Part 1 · In the Kitchen';
  var H = HTW.H, T = window.THREE;
  if (!T) { ['fridge', 'microwave', 'pressure-cooker', 'gas-stove', 'mixer'].forEach(function () {}); }

  // ---------- Refrigerator ----------
  HTW.define({
    id: 'fridge', group: G, name: 'Refrigerator', card: 'Moves heat out of the box',
    lede: 'A fridge does not make cold. It pumps heat out of the box and dumps it into your kitchen. Follow the refrigerant round its loop.',
    cycle: 10,
    steps: [
      { name: 'Compressor', kid: 'Squeeze', text: 'The compressor squeezes the refrigerant gas. Packing the gas tighter makes it hot, even hotter than your kitchen.' },
      { name: 'Condenser', kid: 'Dump heat', text: 'The hot gas flows through the coils on the back. Heat escapes into the kitchen air, and the gas cools until it turns into a liquid.' },
      { name: 'Expansion valve', kid: 'Pressure drop', text: 'The liquid squeezes through a very narrow tube. On the other side the pressure drops suddenly, and the refrigerant turns icy cold.' },
      { name: 'Evaporator', kid: 'Soak up heat', text: 'Inside the fridge the cold liquid boils into gas. Boiling takes heat, so it pulls heat out of the air and your food. Then it returns to the compressor.' }
    ],
    facts: [['Inside the fridge', '≈ 4 °C'], ['Freezer', '≈ −18 °C']],
    parts: [
      { id: 'compressor', name: 'Compressor', text: 'An electric pump at the bottom back. It squeezes the refrigerant gas, which heats it up. Its hum is the sound you hear when the fridge is working.' },
      { id: 'condenser', name: 'Condenser coils', text: 'The black zigzag pipes on the back. They let heat escape into the room, turning the hot gas back into a liquid.' },
      { id: 'valve', name: 'Expansion valve', text: 'A thin tube that the liquid has to squeeze through. The sudden drop in pressure makes it very cold.' },
      { id: 'evaporator', name: 'Evaporator', text: 'Pipes inside the fridge where the cold refrigerant boils and soaks up heat from the food.' },
      { id: 'pipes', name: 'Refrigerant pipes', text: 'A sealed loop. The same refrigerant goes round and round for years and is never used up.' },
      { id: 'cabinet', name: 'Insulated cabinet', text: 'The walls are filled with foam that slows down heat sneaking back in from the room.' },
      { id: 'food', name: 'Food', text: 'The heat in your food is what the fridge carries away, keeping germs slow and food fresh.' },
      {id: "freezer", name: "Freezer compartment", text: "The coldest box in the fridge, wrapped around the evaporator. Ice trays and frozen food go here."},
      {id: "thermostat", name: "Thermostat", text: "A temperature switch. When the inside is cold enough it switches the compressor off, and switches it on again when the fridge warms up."},
      {id: "door", name: "Door and magnetic seal", text: "A rubber seal with a magnet inside holds the door tightly shut, so warm room air cannot leak in."}
    ],
    camera: { pos: [-3.2, 2.2, 4.4], target: [0, 0.4, -0.2] },
    build: function (c) {
      var s = c.scene, tag = c.tag, tagAll = c.tagAll;
      tag(s.add(H.box(1.6, 2.5, 1.3, H.glass(0xc8d6e2, 0.16), 0, 0.35, 0)) && s.children[s.children.length - 1], 'cabinet');
      [0.0, 0.75].forEach(function (y) { s.add(tag(H.box(1.5, 0.03, 1.15, H.glass(0xe6eef5, 0.35), 0, y, 0.02), 'cabinet')); });
      // Food
      s.add(tag(H.box(0.25, 0.42, 0.25, H.matte(0xf4f4f0), -0.4, 0.22, 0.15), 'food'));
      s.add(tag(H.cyl(0.22, 0.16, 0.16, H.matte(0xe0812f), 0.25, 0.09, 0.1), 'food'));
      s.add(tag(H.box(0.5, 0.18, 0.3, H.matte(0x5bb06a), 0.1, 0.85, 0.1), 'food'));
      // Coils
      var cond = H.coil(0.6, -0.3, -0.8, -1.2, 1.7, 9);
      var evap = H.coil(0.55, 1.02, -0.5, -1.1, 0.42, 5);
      var hotLine = [H.v(0.45, -0.48, -0.85), H.v(0.62, -0.42, -0.82), cond[0]];
      var valveLine = [cond[cond.length - 1], H.v(0.68, 1.48, -0.78), H.v(0.66, 1.2, -0.7), H.v(0.62, 1.05, -0.55), evap[0]];
      var suction = [evap[evap.length - 1], H.v(0.68, 1.46, -0.62), H.v(0.82, 0.6, -0.72), H.v(0.8, -0.4, -0.84), H.v(0.6, -0.6, -0.86)];
      s.add(tag(H.tube(cond, 0.03, H.metal(0x2c3138)), 'condenser'));
      s.add(tag(H.tube(evap, 0.035, H.metal(0x9fc7ee)), 'evaporator'));
      s.add(tag(H.tube(hotLine, 0.025, H.metal(0xa36a4a)), 'pipes'));
      s.add(tag(H.tube(suction, 0.025, H.metal(0x7aa3c8)), 'pipes'));
      var vt = H.tube(valveLine, 0.014, H.metal(0xc9b37a)); s.add(tag(vt, 'valve'));
      var comp = H.cyl(0.22, 0.22, 0.38, H.metal(0x22272d), 0.45, -0.72, -0.86); s.add(tag(comp, 'compressor'));
      s.add(tag(H.sph(0.22, H.metal(0x22272d), 0.45, -0.53, -0.86), 'compressor'));
      // Whole loop for the refrigerant beads
      function len(pts) { return H.curve(pts).getLength(); }
      var segs = [hotLine, cond, valveLine, evap, suction], lens = segs.map(len), total = lens.reduce(function (a, b) { return a + b; }, 0);
      var bounds = []; var acc = 0; lens.forEach(function (l) { acc += l / total; bounds.push(acc); });
      var all = [].concat(hotLine, cond.slice(1), valveLine.slice(1), evap.slice(1), suction.slice(1));
      var loop = H.curve(all, true);
      var beads = H.stream(s, 46, 0xffffff, 0.04);
      var hot = new T.Color(0xff4a1a), warm = new T.Color(0xffb26b), cold = new T.Color(0x3d8ef0), cool = new T.Color(0x9cc8ff);
      function beadColor(u, m) {
        var col = m.material.color;
        if (u < bounds[0]) col.copy(hot);
        else if (u < bounds[1]) col.copy(hot).lerp(warm, (u - bounds[0]) / (bounds[1] - bounds[0]));
        else if (u < bounds[2]) col.copy(warm).lerp(cold, (u - bounds[1]) / (bounds[2] - bounds[1]));
        else if (u < bounds[3]) col.copy(cold).lerp(cool, (u - bounds[2]) / (bounds[3] - bounds[2]));
        else col.copy(cool).lerp(hot, H.smooth((u - bounds[3]) / (1 - bounds[3])) * 0.5);
      }
      // Heat leaving the condenser, heat leaving the food
      var heatOut = H.stream(s, 14, 0xff7a33, 0.035), heatIn = H.stream(s, 10, 0xff9a4a, 0.035);
      var inPaths = [H.curve([H.v(-0.4, 0.45, 0.15), H.v(-0.2, 0.9, -0.2), H.v(-0.1, 1.15, -0.48)]), H.curve([H.v(0.25, 0.2, 0.1), H.v(0.3, 0.7, -0.2), H.v(0.2, 1.2, -0.48)])];
      // extras:fridge
      s.add(tag(H.box(1.3, 0.55, 0.95, H.glass(0xbfe6ff, 0.22), 0, 1.24, 0.0), 'freezer'));
      var knob = H.cyl(0.07, 0.07, 0.06, H.matte(0xffffff), 0.74, 0.95, 0.35); knob.rotation.z = Math.PI / 2; s.add(tag(knob, 'thermostat'));
      s.add(tag(H.box(0.02, 0.03, 0.1, H.matte(0x333333), 0.775, 0.97, 0.35), 'thermostat'));
      s.add(tag(H.box(1.6, 2.5, 0.03, H.glass(0xe8f0f6, 0.08), 0, 0.35, 0.68), 'door'));
      [[0, 1.58, 1.56, 0.04], [0, -0.88, 1.56, 0.04], [0.78, 0.35, 0.04, 2.5], [-0.78, 0.35, 0.04, 2.5]].forEach(function (q) { s.add(tag(H.box(q[2], q[3], 0.04, H.matte(0x333a44), q[0], q[1], 0.66), 'door')); });
      c.labels.freezer = H.v(-0.55, 1.45, 0.5); c.labels.thermostat = H.v(0.95, 0.95, 0.4); c.labels.door = H.v(0.6, -0.65, 0.75);

      return {
        update: function (st) {
          H.flow(beads, loop, st.t, { speed: 0.09, color: beadColor });
          comp.position.x = 0.45 + Math.sin(st.t * 60) * 0.004;
          heatOut.forEach(function (m, i) {
            var u = ((st.t * 0.35 + i / heatOut.length) % 1);
            var y = -0.2 + (i % 7) * 0.24;
            m.position.set(-0.5 + (i * 0.37 % 1.0), y + u * 0.3, -0.85 - u * 0.9);
            m.material.opacity = (1 - u) * 0.85;
          });
          heatIn.forEach(function (m, i) {
            var u = ((st.t * 0.3 + i / heatIn.length) % 1);
            m.position.copy(inPaths[i % 2].getPointAt(u));
            m.material.opacity = 0.8 * Math.sin(u * Math.PI);
          });
        },
        labels: {
          compressor: H.v(0.45, -0.25, -0.95), condenser: H.v(-0.6, 0.6, -0.85), valve: H.v(0.75, 1.62, -0.75),
          evaporator: H.v(-0.2, 1.3, -0.45), pipes: H.v(0.85, 0.2, -0.75), cabinet: H.v(-0.85, -0.5, 0.6), food: H.v(-0.4, 0.5, 0.3)
        }
      };
    }
  });

  // ---------- Microwave oven ----------
  HTW.define({
    id: 'microwave', group: G, name: 'Microwave oven', card: 'Makes water molecules wiggle',
    lede: 'Invisible waves bounce around a metal box and make the water in your food twist back and forth. That jostling is heat.',
    cycle: 10,
    steps: [
      { name: 'Magnetron', kid: 'Make waves', text: 'Electricity powers the magnetron, which produces microwaves: invisible waves about 12 cm long.' },
      { name: 'Waveguide and cavity', kid: 'Bounce', text: 'A metal channel guides the waves into the oven. The metal walls reflect them, so they bounce around inside the box.' },
      { name: 'Water molecules', kid: 'Wiggle', text: 'Water molecules in the food twist to line up with the waves, billions of times a second. All that jostling becomes heat.' },
      { name: 'Turntable', kid: 'Spin', text: 'The waves make hot and cool spots. The turntable carries the food through them so it heats more evenly.' }
    ],
    facts: [['Wave frequency', '2.45 GHz'], ['Wavelength', '≈ 12 cm']],
    parts: [
      { id: 'magnetron', name: 'Magnetron', text: 'The heart of the oven. It turns electricity into microwaves using a magnet and a hot metal core.' },
      { id: 'waveguide', name: 'Waveguide', text: 'A hollow metal channel that carries the waves from the magnetron into the cooking space.' },
      { id: 'cavity', name: 'Metal cavity', text: 'The cooking box. Its metal walls reflect the waves so none escape and they keep passing through the food.' },
      { id: 'door', name: 'Door mesh', text: 'The metal mesh has holes smaller than the waves. Light gets out so you can see, but the waves bounce back in.' },
      { id: 'turntable', name: 'Turntable', text: 'A glass plate turned by a small motor, so every part of the food passes through the hot spots.' },
      { id: 'food', name: 'Food', text: 'Mostly water. Its water molecules absorb the waves, so the food heats from its own water while the plate stays cooler.' },
      {id: "transformer", name: "High-voltage transformer", text: "Raises the 230 V from the socket to thousands of volts, which the magnetron needs. This is why you must never open a microwave."},
      {id: "tmotor", name: "Turntable motor", text: "A small, slow motor under the floor that turns the glass plate a few times a minute."},
      {id: "panel", name: "Control panel and timer", text: "Buttons set the power and time. A timer switches the magnetron off when the time is up."},
      {id: "interlock", name: "Door safety switches", text: "Switches in the door latch. The oven stops making microwaves the instant the door opens."}
    ],
    camera: { pos: [1.6, 1.8, 4.6], target: [-0.1, -0.2, 0] },
    build: function (c) {
      var s = c.scene, tag = c.tag;
      s.add(tag(H.box(2.2, 1.3, 1.5, H.glass(0xb8c2cc, 0.16), 0, -0.25, 0), 'cavity'));
      s.add(tag(H.box(0.62, 1.26, 1.46, H.matte(0x2a3038, { transparent: true, opacity: 0.35 }), 0.78, -0.25, 0), 'cavity'));
      // Door mesh with dot pattern
      var tex = H.canvasTex(256, 160, function (g, w, h) {
        g.clearRect(0, 0, w, h); g.fillStyle = 'rgba(30,36,44,0.85)';
        for (var y = 4; y < h; y += 9) for (var x = 4; x < w; x += 9) { g.beginPath(); g.arc(x, y, 2.4, 0, 6.3); g.fill(); }
      });
      var door = new T.Mesh(new T.PlaneGeometry(1.5, 1.2), new T.MeshStandardMaterial({ map: tex, transparent: true, opacity: 0.55, side: T.DoubleSide, depthWrite: false }));
      door.position.set(-0.33, -0.25, 0.76); s.add(tag(door, 'door'));
      var mag = new T.Group();
      mag.add(H.cyl(0.16, 0.16, 0.32, H.metal(0xb87333)));
      for (var i = 0; i < 5; i++) mag.add(H.box(0.42, 0.02, 0.42, H.metal(0xd0d6dc), 0, -0.12 + i * 0.06, 0));
      mag.position.set(0.78, -0.05, 0); s.add(c.tagAll(mag, 'magnetron'));
      s.add(tag(H.box(0.5, 0.14, 0.3, H.metal(0x9aa4ae), 0.5, 0.25, 0), 'waveguide'));
      var table = new T.Group();
      table.add(H.cyl(0.55, 0.55, 0.03, H.glass(0xd9e6ef, 0.5)));
      var bowl = H.cyl(0.3, 0.22, 0.22, H.matte(0xf0ede6, { side: T.DoubleSide }), 0, 0.12, 0, 32, true); table.add(bowl);
      var soup = H.cyl(0.27, 0.27, 0.02, H.matte(0xd9a441), 0, 0.2, 0); table.add(soup);
      table.position.set(-0.33, -0.86, 0); s.add(table);
      tag(table.children[0], 'turntable'); tag(bowl, 'food'); tag(soup, 'food');
      // Water molecules
      var mols = [];
      for (var k = 0; k < 9; k++) {
        var m = new T.Group();
        m.add(H.sph(0.05, H.matte(0xe0453a)));
        m.add(H.sph(0.032, H.matte(0xffffff), 0.055, 0.035, 0));
        m.add(H.sph(0.032, H.matte(0xffffff), -0.055, 0.035, 0));
        var a = k / 9 * Math.PI * 2, r = 0.08 + (k % 3) * 0.07;
        m.position.set(Math.cos(a) * r, 0.33 + (k % 2) * 0.08, Math.sin(a) * r);
        m.userData.ph = k * 1.7; table.add(m); mols.push(m);
      }
      // Wave path: from magnetron, through the guide, bouncing around the cavity
      var wpts = [H.v(0.7, 0.25, 0), H.v(0.42, 0.25, 0), H.v(-1.02, -0.3, 0.45), H.v(-0.1, 0.3, -0.6), H.v(-1.0, -0.75, -0.35), H.v(0.35, -0.55, 0.6), H.v(-0.6, 0.32, 0.5), H.v(0.4, -0.2, -0.65)];
      var segs = []; for (var j = 0; j < wpts.length - 1; j++) segs.push([wpts[j], wpts[j + 1]]);
      var N = 420, pos = new Float32Array(N * 3), geo = new T.BufferGeometry();
      geo.setAttribute('position', new T.BufferAttribute(pos, 3));
      var wave = new T.Line(geo, new T.LineBasicMaterial({ color: 0x8a5cff })); s.add(wave);
      [[0.012, 0], [-0.012, 0], [0, 0.012]].forEach(function (o) { var w2 = new T.Line(geo, new T.LineBasicMaterial({ color: 0x8a5cff })); w2.position.set(o[0], o[1], 0); s.add(w2); });
      var lens = segs.map(function (sg) { return sg[0].distanceTo(sg[1]); }), total = lens.reduce(function (a, b) { return a + b; });
      var tmp = new T.Vector3(), dir = new T.Vector3(), side = new T.Vector3(), upv = new T.Vector3(0, 1, 0);
      var soupCold = new T.Color(0xd9a441), soupHot = new T.Color(0xe8622a);
      // extras:microwave
      var trn = new T.Group(); trn.add(H.box(0.32, 0.26, 0.36, H.metal(0x55606b))); trn.add(H.cyl(0.09, 0.09, 0.3, H.metal(0xc8742e), 0, 0, 0.0));
      trn.position.set(0.78, -0.68, 0.15); s.add(c.tagAll(trn, 'transformer'));
      s.add(tag(H.cyl(0.07, 0.07, 0.22, H.metal(0x2a2f35), 0.92, -0.62, -0.42), 'transformer'));
      s.add(tag(H.cyl(0.08, 0.08, 0.08, H.metal(0x3a4048), -0.33, -0.93, 0), 'tmotor'));
      var dispCanvas = document.createElement('canvas'); dispCanvas.width = 256; dispCanvas.height = 96;
      var dispTex = new T.CanvasTexture(dispCanvas);
      var dispMesh = new T.Mesh(new T.PlaneGeometry(0.42, 0.16), new T.MeshBasicMaterial({ map: dispTex })); dispMesh.position.set(0.78, 0.18, 0.765); s.add(tag(dispMesh, 'panel'));
      s.add(tag(H.box(0.5, 1.0, 0.02, H.matte(0x1d2229), 0.78, -0.25, 0.755), 'panel'));
      for (var bi = 0; bi < 6; bi++) s.add(tag(H.box(0.12, 0.08, 0.02, H.matte(0x6c7a89), 0.7 + (bi % 2) * 0.17, -0.05 - Math.floor(bi / 2) * 0.13, 0.77), 'panel'));
      s.add(tag(H.box(0.05, 0.14, 0.05, H.matte(0x2a2f35), 0.43, 0.15, 0.74), 'interlock'));
      s.add(tag(H.box(0.05, 0.14, 0.05, H.matte(0x2a2f35), 0.43, -0.6, 0.74), 'interlock'));
      var lastSec = -1;
      c.anim(function (st) {
        var secs = Math.max(0, Math.round(90 * (1 - st.p)));
        if (secs === lastSec) return; lastSec = secs;
        var g = dispCanvas.getContext('2d'); g.fillStyle = '#0b1a14'; g.fillRect(0, 0, 256, 96);
        g.fillStyle = '#5dff9a'; g.font = '700 64px monospace'; g.textAlign = 'center'; g.textBaseline = 'middle';
        g.fillText(Math.floor(secs / 60) + ':' + ('0' + (secs % 60)).slice(-2), 128, 50); dispTex.needsUpdate = true;
      });
      c.labels.transformer = H.v(1.2, -0.75, 0.3); c.labels.tmotor = H.v(-0.33, -1.0, 0.45); c.labels.panel = H.v(1.2, 0.2, 0.8); c.labels.interlock = H.v(0.43, 0.42, 0.8);

      return {
        update: function (st) {
          var reveal = st.step === 0 ? st.prog * 0.15 : st.step === 1 ? 0.15 + st.prog * 0.85 : 1;
          var cnt = 0;
          for (var i = 0; i < N; i++) {
            var d = (i / (N - 1)) * total * reveal, acc = 0, sgi = 0;
            while (sgi < segs.length - 1 && acc + lens[sgi] < d) { acc += lens[sgi]; sgi++; }
            var f = Math.min((d - acc) / lens[sgi], 1);
            tmp.lerpVectors(segs[sgi][0], segs[sgi][1], f);
            dir.subVectors(segs[sgi][1], segs[sgi][0]).normalize();
            side.crossVectors(dir, upv); if (side.lengthSq() < 0.01) side.set(0, 0, 1); side.normalize();
            var amp = 0.05 * Math.sin(d * 26 - st.t * 14);
            tmp.addScaledVector(side, amp);
            pos[i * 3] = tmp.x; pos[i * 3 + 1] = tmp.y; pos[i * 3 + 2] = tmp.z; cnt++;
          }
          geo.attributes.position.needsUpdate = true; geo.setDrawRange(0, cnt);
          var wig = st.step >= 2 ? 1 : st.step === 1 ? st.prog * 0.5 : 0.08;
          mols.forEach(function (m) { m.rotation.z = Math.sin(st.t * 22 + m.userData.ph) * 0.9 * wig; m.rotation.x = Math.cos(st.t * 17 + m.userData.ph) * 0.4 * wig; });
          var heat = st.step < 2 ? 0 : st.step === 2 ? st.prog * 0.6 : 0.6 + st.prog * 0.4;
          soup.material.color.copy(soupCold).lerp(soupHot, heat);
          table.rotation.y += st.dt * (st.step === 3 ? 0.9 : 0.35);
        },
        labels: {
          magnetron: H.v(0.95, -0.5, 0.4), waveguide: H.v(0.5, 0.45, 0.2), cavity: H.v(-1.05, 0.35, 0.6),
          door: H.v(-0.33, -0.65, 0.8), turntable: H.v(-0.85, -0.88, 0.35), food: H.v(-0.33, -0.45, 0.35)
        }
      };
    }
  });

  // ---------- Pressure cooker ----------
  HTW.define({
    id: 'pressure-cooker', group: G, name: 'Pressure cooker', card: 'Trapped steam makes hotter water',
    lede: 'Lock the lid and the steam has nowhere to go. The pressure rises, the water gets hotter than 100 °C, and dal cooks in minutes.',
    cycle: 12,
    steps: [
      { name: 'Heat', kid: 'Heat up', text: 'The flame heats the water. In an open pot the water would stop getting hotter at 100 °C and just boil away.' },
      { name: 'Seal', kid: 'Trap the steam', text: 'The rubber gasket seals the lid. Steam cannot escape, so it builds up and presses down hard on the water.' },
      { name: 'Pressure', kid: 'Hotter water', text: 'Higher pressure makes it harder for water to boil, so it can reach about 120 °C. Hotter water cooks food much faster.' },
      { name: 'Whistle', kid: 'Whistle!', text: 'When the pressure is high enough, steam lifts the heavy weight and rushes out with a whistle. The weight drops back and the pressure builds again.' }
    ],
    facts: [['Open pot', '100 °C max'], ['Pressure cooker', '≈ 120 °C']],
    parts: [
      { id: 'body', name: 'Body', text: 'A thick metal pot that is strong enough to hold the high pressure inside safely.' },
      { id: 'lid', name: 'Lid', text: 'Locks under the rim of the pot. The harder the steam pushes, the tighter it holds.' },
      { id: 'gasket', name: 'Gasket', text: 'A rubber ring around the lid that makes an airtight seal.' },
      { id: 'weight', name: 'Weight valve', text: 'A heavy cap on the steam vent. It only lifts when the pressure is high enough, which sets how hot the cooker gets.' },
      { id: 'safety', name: 'Safety valve', text: 'A backup plug. If the vent gets blocked, it pops or melts to let steam out safely.' },
      { id: 'water', name: 'Water and food', text: 'The water turns into the steam that builds the pressure, and cooks the food at about 120 °C.' },
      { id: 'flame', name: 'Flame', text: 'Heat from the burner keeps turning water into steam.' },
      {id: "lugs", name: "Locking lugs", text: "Tabs on the lid that slide under the rim of the pot. The harder the steam pushes up, the tighter they grip."},
      {id: "base", name: "Thick base", text: "A heavy, layered base that spreads the flame’s heat evenly so food does not burn."}
    ],
    camera: { pos: [2.6, 2.0, 3.6], target: [0, -0.05, 0] },
    readout: function (st) {
      var temp = st.step === 0 ? 30 + st.prog * 70 : st.step === 1 ? 100 + st.prog * 10 : st.step === 2 ? 110 + st.prog * 10 : 120;
      return 'Water temperature <strong>' + Math.round(temp) + ' °C</strong>';
    },
    build: function (c) {
      var s = c.scene, tag = c.tag;
      s.add(tag(H.cyl(0.72, 0.72, 1.0, H.glass(0xc9d1d8, 0.32), 0, -0.1, 0, 48, true), 'body'));
      s.add(tag(H.cyl(0.72, 0.72, 0.05, H.metal(0x9aa3ab), 0, -0.6, 0), 'body'));
      s.add(tag(H.box(0.9, 0.08, 0.14, H.matte(0x1f1f1f), 1.15, 0.3, 0), 'body'));
      s.add(tag(H.cyl(0.74, 0.74, 0.07, H.metal(0xc5ccd3), 0, 0.43, 0), 'lid'));
      s.add(tag(H.box(0.8, 0.08, 0.14, H.matte(0x1f1f1f), 1.05, 0.5, 0), 'lid'));
      var gas = H.torus(0.7, 0.025, H.matte(0x222222), 0, 0.39, 0); gas.rotation.x = Math.PI / 2; s.add(tag(gas, 'gasket'));
      s.add(tag(H.cyl(0.04, 0.04, 0.16, H.metal(0x9aa3ab), 0, 0.53, 0), 'weight'));
      var weight = new T.Group();
      weight.add(H.cyl(0.1, 0.12, 0.14, H.metal(0x707a84)));
      weight.add(H.sph(0.05, H.metal(0x707a84), 0, 0.09, 0));
      weight.position.y = 0.66; s.add(c.tagAll(weight, 'weight'));
      s.add(tag(H.cyl(0.05, 0.05, 0.08, H.matte(0xb03a2e), 0.36, 0.5, 0.1), 'safety'));
      var water = H.cyl(0.68, 0.68, 0.5, H.glass(0x4aa3ff, 0.45), 0, -0.33, 0); s.add(tag(water, 'water'));
      for (var i = 0; i < 26; i++) s.add(tag(H.sph(0.04, H.matte(0xf0c53c), Math.cos(i * 2.4) * 0.45 * ((i % 5) / 5 + 0.2), -0.52 + (i % 3) * 0.03, Math.sin(i * 2.4) * 0.45 * ((i % 5) / 5 + 0.2)), 'water'));
      var flames = new T.Group();
      for (var k = 0; k < 14; k++) {
        var a = k / 14 * Math.PI * 2;
        var f = H.mesh(new T.ConeGeometry(0.06, 0.24, 10), H.basic(0x4f8dff, 0.85), Math.cos(a) * 0.4, -0.72, Math.sin(a) * 0.4);
        flames.add(f);
      }
      s.add(c.tagAll(flames, 'flame'));
      s.add(H.torus(0.42, 0.04, H.metal(0x3a3f45), 0, -0.84, 0)).rotation && (s.children[s.children.length - 1].rotation.x = Math.PI / 2);
      var steam = H.stream(s, 40, 0xffffff, 0.05), bubbles = H.stream(s, 18, 0xdff0ff, 0.035), jet = H.stream(s, 18, 0xffffff, 0.06);
      // extras:pressure-cooker
      for (var li = 0; li < 6; li++) { var la = li / 6 * Math.PI * 2, lug = H.box(0.12, 0.04, 0.05, H.metal(0x9aa3ab), Math.cos(la) * 0.66, 0.37, Math.sin(la) * 0.66); lug.rotation.y = -la; s.add(tag(lug, 'lugs')); }
      s.add(tag(H.cyl(0.71, 0.71, 0.07, H.metal(0xb87333), 0, -0.64, 0), 'base'));
      c.labels.lugs = H.v(-0.75, 0.38, -0.35); c.labels.base = H.v(-0.6, -0.72, 0.6);

      return {
        update: function (st) {
          var level = st.step === 0 ? st.prog * 0.3 : st.step === 1 ? 0.3 + st.prog * 0.4 : st.step === 2 ? 0.7 + st.prog * 0.3 : 1;
          steam.forEach(function (m, i) {
            var on = i / steam.length < level; m.visible = on; if (!on) return;
            var u = (st.t * 0.25 + i * 0.137) % 1, a = i * 2.39 + st.t * 0.8;
            var r = 0.15 + ((i * 0.31) % 0.45);
            m.position.set(Math.cos(a) * r, -0.05 + u * 0.4, Math.sin(a) * r);
            m.material.opacity = 0.35 + 0.4 * level;
          });
          bubbles.forEach(function (m, i) {
            var u = (st.t * 0.6 + i / bubbles.length) % 1;
            m.position.set(Math.cos(i * 1.9) * 0.4, -0.55 + u * 0.47, Math.sin(i * 1.9) * 0.4);
            m.visible = level > 0.15;
          });
          flames.children.forEach(function (f, i) { f.scale.y = 0.85 + 0.25 * Math.sin(st.t * 18 + i); });
          var lift = st.step === 3 ? H.pulse((st.prog - 0.15) / 0.7) : 0;
          weight.position.y = 0.66 + lift * 0.06 + (lift > 0.3 ? Math.sin(st.t * 60) * 0.008 : 0);
          jet.forEach(function (m, i) {
            m.visible = lift > 0.25; if (!m.visible) return;
            var u = (st.t * 1.6 + i / jet.length) % 1;
            m.position.set(Math.sin(i * 3.1) * 0.05 * u * 4, 0.62 + u * 1.1, Math.cos(i * 2.3) * 0.05 * u * 4);
            m.material.opacity = (1 - u) * 0.85; m.scale.setScalar(0.6 + u * 1.6);
          });
        },
        labels: {
          body: H.v(-0.85, -0.2, 0.3), lid: H.v(-0.55, 0.52, 0.35), gasket: H.v(0.6, 0.36, 0.55), weight: H.v(0, 0.92, 0),
          safety: H.v(0.5, 0.62, 0.2), water: H.v(0.25, -0.35, 0.75), flame: H.v(0.5, -0.82, 0.4)
        }
      };
    }
  });

  // ---------- Gas stove ----------
  HTW.define({
    id: 'gas-stove', group: G, name: 'Gas stove', card: 'LPG plus air makes a blue flame',
    lede: 'Follow the gas from the red cylinder, through the regulator and hose, into the burner where it mixes with air and burns.',
    cycle: 10,
    steps: [
      { name: 'Cylinder', kid: 'Liquid to gas', text: 'Inside the cylinder, LPG is squeezed so hard that most of it is liquid. Some of it boils off into gas at the top.' },
      { name: 'Regulator', kid: 'Calm the flow', text: 'The regulator lets the gas out at a low, steady pressure, so the flame does not roar or flicker.' },
      { name: 'Burner', kid: 'Mix with air', text: 'Gas rushes into the burner tube and pulls air in through a side opening. Fire needs the oxygen in that air.' },
      { name: 'Flame', kid: 'Light it', text: 'A spark lights the gas-air mix. With enough air it burns completely, giving a clean blue flame.' }
    ],
    facts: [['LPG is mostly', 'propane + butane'], ['Blue flame', 'complete burning']],
    parts: [
      { id: 'cylinder', name: 'LPG cylinder', text: 'A strong steel tank. The gas inside is squeezed into a liquid, so a lot fits in a small space.' },
      { id: 'regulator', name: 'Regulator', text: 'Lowers the high pressure in the cylinder to a gentle, steady flow for the stove.' },
      { id: 'hose', name: 'Rubber hose', text: 'Carries the gas to the stove. It should be checked often for cracks.' },
      { id: 'knob', name: 'Control knob', text: 'Opens a valve to let more or less gas through, which makes the flame bigger or smaller.' },
      { id: 'burner', name: 'Burner', text: 'A brass head with a ring of small holes. The gas-air mix comes out through the holes and burns there.' },
      { id: 'airhole', name: 'Air opening', text: 'A gap in the burner tube where air gets pulled in by the rushing gas.' },
      { id: 'flame', name: 'Flame', text: 'Gas burning with oxygen. Blue means complete burning; yellow means not enough air.' },
      {id: "pansupport", name: "Pan support", text: "A sturdy metal frame that holds the pan just above the flame, so air can reach the fire."},
      {id: "igniter", name: "Spark igniter", text: "Makes a small electric spark that lights the gas. Some stoves have one built in; others use a hand lighter."},
      {id: "valve", name: "Cylinder valve", text: "The cylinder’s own tap. The regulator clicks onto it, and it should be turned off when the stove is not in use."}
    ],
    camera: { pos: [0.6, 2.2, 4.6], target: [-0.35, -0.2, 0] },
    build: function (c) {
      var s = c.scene, tag = c.tag;
      var cx = -1.4;
      s.add(tag(H.cyl(0.38, 0.38, 1.2, H.glass(0xc4302b, 0.42), cx, -0.4, 0, 40, true), 'cylinder'));
      s.add(tag(H.mesh(new T.SphereGeometry(0.38, 32, 16, 0, Math.PI * 2, 0, Math.PI / 2), H.matte(0xc4302b), cx, 0.2, 0), 'cylinder'));
      s.add(tag(H.cyl(0.38, 0.38, 0.04, H.matte(0xc4302b), cx, -1.0, 0), 'cylinder'));
      var liquid = H.cyl(0.35, 0.35, 0.7, H.glass(0xf3e3a0, 0.55), cx, -0.65, 0); s.add(tag(liquid, 'cylinder'));
      var reg = new T.Group();
      reg.add(H.cyl(0.13, 0.13, 0.16, H.metal(0x9aa4ae)));
      reg.add(H.cyl(0.09, 0.09, 0.08, H.matte(0xe07a1f), 0, 0.12, 0));
      reg.position.set(cx, 0.68, 0); s.add(c.tagAll(reg, 'regulator'));
      s.add(tag(H.cyl(0.05, 0.05, 0.14, H.metal(0x9aa4ae), cx, 0.55, 0), 'regulator'));
      var hosePts = [H.v(cx + 0.13, 0.68, 0), H.v(cx + 0.55, 0.6, 0.05), H.v(cx + 0.75, -0.2, 0.1), H.v(-0.35, -0.55, 0.05), H.v(-0.1, -0.5, 0)];
      s.add(tag(H.tube(hosePts, 0.04, H.matte(0xd8722b)), 'hose'));
      s.add(H.box(1.5, 0.22, 1.0, H.matte(0x1c2026), 0.6, -0.65, 0));
      s.add(H.box(1.5, 0.02, 1.0, H.glass(0x0e1116, 0.85), 0.6, -0.53, 0));
      s.add(tag(H.cyl(0.08, 0.08, 0.08, H.metal(0xc0c6cc), 0.6, -0.65, 0.52), 'knob')).rotation;
      s.children[s.children.length - 1].rotation.x = Math.PI / 2;
      var mix = [H.v(-0.1, -0.5, 0), H.v(0.25, -0.5, 0), H.v(0.55, -0.48, 0), H.v(0.6, -0.42, 0)];
      s.add(H.tube(mix, 0.05, H.glass(0xb08d57, 0.4)));
      s.add(tag(H.torus(0.07, 0.02, H.metal(0x3a3f45), 0.15, -0.5, 0.06), 'airhole'));
      s.add(tag(H.cyl(0.24, 0.26, 0.08, H.metal(0xc69b4a), 0.6, -0.48, 0), 'burner'));
      s.add(tag(H.cyl(0.2, 0.22, 0.04, H.metal(0x2d3036), 0.6, -0.42, 0), 'burner'));
      var flame = new T.Group();
      for (var k = 0; k < 18; k++) {
        var a = k / 18 * Math.PI * 2;
        var o = H.mesh(new T.ConeGeometry(0.05, 0.22, 10), H.basic(0x3f7dff, 0.75), 0.6 + Math.cos(a) * 0.24, -0.33, Math.sin(a) * 0.24);
        o.rotation.z = -Math.cos(a) * 0.35; o.rotation.x = Math.sin(a) * 0.35; flame.add(o);
        var inner = H.mesh(new T.ConeGeometry(0.025, 0.1, 8), H.basic(0x9ad0ff, 0.9), 0.6 + Math.cos(a) * 0.24, -0.37, Math.sin(a) * 0.24);
        flame.add(inner);
      }
      s.add(c.tagAll(flame, 'flame'));
      var sparkM = H.sph(0.05, H.basic(0xffffff, 0), 0.92, -0.38, 0.1); s.add(sparkM);
      var hoseCurve = H.curve(hosePts.concat(mix.slice(1))), gasB = H.stream(s, 26, 0xf2d24b, 0.035), airB = H.stream(s, 10, 0xbfe3ff, 0.035);
      var vap = H.stream(s, 10, 0xfff3b0, 0.03);
      var airCurve = H.curve([H.v(0.15, -0.75, 0.45), H.v(0.15, -0.55, 0.12), H.v(0.3, -0.5, 0), H.v(0.58, -0.44, 0)]);
      // extras:gas-stove
      var ps = H.torus(0.42, 0.02, H.metal(0x2a2f35), 0.6, -0.22, 0); ps.rotation.x = Math.PI / 2; s.add(tag(ps, 'pansupport'));
      for (var pi = 0; pi < 4; pi++) { var pa = pi / 4 * Math.PI * 2 + Math.PI / 4; s.add(tag(H.box(0.03, 0.3, 0.03, H.metal(0x2a2f35), 0.6 + Math.cos(pa) * 0.42, -0.37, Math.sin(pa) * 0.42), 'pansupport')); }
      s.add(tag(H.cyl(0.015, 0.015, 0.16, H.matte(0xf0f0f0), 0.92, -0.45, 0.1), 'igniter'));
      s.add(tag(H.cyl(0.07, 0.09, 0.1, H.metal(0xc69b4a), cx, 0.5, 0), 'valve'));
      c.labels.pansupport = H.v(1.1, -0.2, -0.3); c.labels.igniter = H.v(1.15, -0.55, 0.35); c.labels.valve = H.v(cx - 0.45, 0.5, 0);

      return {
        update: function (st) {
          vap.forEach(function (m, i) {
            var u = (st.t * 0.4 + i / vap.length) % 1;
            m.position.set(cx + Math.cos(i * 2.2) * 0.2, -0.3 + u * 0.45, Math.sin(i * 2.2) * 0.2);
            m.material.opacity = 0.8 * (1 - u);
          });
          var range = st.step === 0 ? [0, 0.12] : [0, 1];
          H.flow(gasB, hoseCurve, st.t, { speed: st.step === 0 ? 0.1 : 0.18, range: range, opacity: 0.85 });
          H.flow(airB, airCurve, st.t, { speed: 0.35, visible: st.step >= 2 });
          var on = st.step === 3 ? H.smooth(st.prog / 0.15) : 0;
          flame.visible = on > 0.02;
          flame.children.forEach(function (f, i) { f.scale.set(on, on * (0.85 + 0.2 * Math.sin(st.t * 20 + i)), on); });
          sparkM.material.opacity = st.step === 3 && st.prog < 0.12 ? 1 - st.prog / 0.12 : 0;
        },
        labels: {
          cylinder: H.v(cx - 0.45, -0.3, 0.3), regulator: H.v(cx, 0.95, 0), hose: H.v(-0.6, 0.0, 0.2), knob: H.v(0.6, -0.8, 0.62),
          burner: H.v(1.05, -0.5, 0.2), airhole: H.v(0.1, -0.78, 0.4), flame: H.v(0.6, -0.08, 0)
        }
      };
    }
  });

  // ---------- Mixer grinder ----------
  HTW.define({
    id: 'mixer', group: G, name: 'Mixer grinder', card: 'A motor that slices and tumbles',
    lede: 'A fast electric motor spins sharp blades, and ridges in the jar keep tumbling the food back into them.',
    cycle: 10,
    steps: [
      { name: 'Motor', kid: 'Spin up', text: 'Electricity flows into the motor coils, turning them into magnets that whirl the rotor round thousands of times a minute.' },
      { name: 'Coupler', kid: 'Connect', text: 'Teeth under the jar lock onto the coupler on the motor shaft, so the blades spin with the motor.' },
      { name: 'Blades', kid: 'Slice', text: 'Sharp blades slice through the food again and again, cutting it smaller with every pass.' },
      { name: 'Ridges', kid: 'Tumble', text: 'Ridges on the jar wall break up the swirl, so food flips back down into the blades instead of just spinning round.' }
    ],
    facts: [['Blade speed', 'thousands of rpm'], ['Food path', 'up the walls, down the middle']],
    parts: [
      { id: 'motor', name: 'Electric motor', text: 'Copper coils become magnets when current flows, pushing and pulling the rotor round very fast.' },
      { id: 'coupler', name: 'Coupler', text: 'A toothed joint that connects the motor shaft to the jar, so the jar can be lifted off.' },
      { id: 'jar', name: 'Jar', text: 'Holds the food. Its shape helps send food back down to the blades.' },
      { id: 'blades', name: 'Blades', text: 'Sharp steel blades, some bent up and some down, so they cut at different heights.' },
      { id: 'ridges', name: 'Ridges', text: 'Raised strips inside the jar that stop the food from simply spinning with the blades.' },
      { id: 'lid', name: 'Lid', text: 'Keeps the food in. Its rubber seal stops splashes.' },
      {id: "switch", name: "Speed switch", text: "Chooses how fast the motor spins: slower for batter, faster for fine powder, plus a pulse setting."},
      {id: "overload", name: "Overload protector", text: "If the motor gets too hot, it switches off. Press the red reset button once it has cooled down."},
      {id: "coolfan", name: "Cooling fan", text: "A small fan on the motor shaft blows air through the base, so the motor does not overheat."}
    ],
    camera: { pos: [2.8, 1.6, 3.4], target: [0, 0.0, 0] },
    build: function (c) {
      var s = c.scene, tag = c.tag;
      s.add(H.cyl(0.6, 0.68, 0.75, H.glass(0x1e242b, 0.35), 0, -0.6, 0, 40));
      var stator = new T.Group();
      for (var i = 0; i < 8; i++) {
        var a = i / 8 * Math.PI * 2, coil = H.cyl(0.09, 0.09, 0.28, H.metal(0xc8742e), Math.cos(a) * 0.36, -0.62, Math.sin(a) * 0.36, 16);
        stator.add(coil);
      }
      s.add(c.tagAll(stator, 'motor'));
      var rotor = H.cyl(0.2, 0.2, 0.3, H.metal(0x8f9aa5), 0, -0.62, 0, 12); s.add(tag(rotor, 'motor'));
      var stripe = H.box(0.42, 0.31, 0.04, H.metal(0x5c6670), 0, -0.62, 0); s.add(tag(stripe, 'motor'));
      s.add(tag(H.cyl(0.04, 0.04, 0.5, H.metal(0xb7c0c9), 0, -0.3, 0), 'motor'));
      var coupler = H.cyl(0.12, 0.12, 0.08, H.matte(0x3a3f45), 0, -0.19, 0, 6); s.add(tag(coupler, 'coupler'));
      s.add(tag(H.cyl(0.48, 0.38, 1.05, H.glass(0xd8e3ea, 0.22), 0, 0.35, 0, 40, true), 'jar'));
      s.add(tag(H.cyl(0.38, 0.38, 0.05, H.metal(0xc4ccd3), 0, -0.16, 0), 'jar'));
      for (var r = 0; r < 3; r++) {
        var a2 = r / 3 * Math.PI * 2, rb = H.box(0.06, 0.8, 0.05, H.glass(0xc4d3de, 0.5), Math.cos(a2) * 0.41, 0.35, Math.sin(a2) * 0.41);
        rb.rotation.y = -a2; rb.rotation.z = Math.cos(a2) * 0.09; rb.rotation.x = -Math.sin(a2) * 0.09; s.add(tag(rb, 'ridges'));
      }
      s.add(tag(H.cyl(0.5, 0.5, 0.06, H.matte(0x2f353c), 0, 0.9, 0), 'lid'));
      var blades = new T.Group();
      [[0, 0.25], [Math.PI / 2, -0.25], [Math.PI, 0.25], [Math.PI * 1.5, -0.25]].forEach(function (b) {
        var bl = H.box(0.3, 0.012, 0.06, H.metal(0xdfe5ea), 0.15, 0, 0); bl.rotation.z = b[1];
        var arm = new T.Group(); arm.add(bl); arm.rotation.y = b[0]; blades.add(arm);
      });
      blades.position.y = -0.04; s.add(c.tagAll(blades, 'blades'));
      var food = [], cols = [0xf0c53c, 0x6bbf59, 0xf4f1e6];
      for (var k = 0; k < 40; k++) { var f = H.sph(0.035, H.matte(cols[k % 3]), 0, 0, 0); f.userData.ph = k * 0.157; s.add(f); food.push(f); }
      var ang = 0, spin = 0;
      // extras:mixer
      var sw = H.cyl(0.08, 0.08, 0.06, H.matte(0x2b3138), 0, -0.6, 0.66); sw.rotation.x = Math.PI / 2; s.add(tag(sw, 'switch'));
      s.add(tag(H.box(0.03, 0.1, 0.02, H.matte(0xffffff), 0, -0.6, 0.7), 'switch'));
      var ol = H.cyl(0.04, 0.04, 0.04, H.matte(0xd23b3b), 0.42, -0.78, 0.5); ol.rotation.x = Math.PI / 2; s.add(tag(ol, 'overload'));
      var cf = new T.Group(); for (var fi = 0; fi < 5; fi++) { var fb = H.box(0.26, 0.015, 0.06, H.matte(0x5a6570), 0.13, 0, 0); var fg = new T.Group(); fg.add(fb); fg.rotation.y = fi / 5 * Math.PI * 2; cf.add(fg); }
      cf.position.y = -0.86; s.add(c.tagAll(cf, 'coolfan'));
      var cfa = 0; c.anim(function (st) { cfa += st.dt * 30 * (st.step === 0 ? st.prog : 1); cf.rotation.y = cfa; });
      c.labels.switch = H.v(0, -0.45, 0.8); c.labels.overload = H.v(0.6, -0.95, 0.55); c.labels.coolfan = H.v(-0.6, -0.9, 0.5);

      return {
        update: function (st) {
          var target = st.step === 0 ? st.prog : 1;
          spin = target * 30;
          ang += st.dt * spin;
          rotor.rotation.y = ang; stripe.rotation.y = ang; coupler.rotation.y = st.step >= 1 ? ang : 0;
          blades.rotation.y = st.step >= 1 ? ang : 0;
          var stir = st.step >= 2 ? 1 : st.step === 1 ? 0.3 : 0.05;
          var size = st.step < 2 ? 1 : st.step === 2 ? 1 - st.prog * 0.45 : 0.55 - st.prog * 0.2;
          food.forEach(function (f, i) {
            var ph = (f.userData.ph + st.t * 0.12 * stir) % 1;
            var r, y;
            if (ph < 0.5) { r = 0.34 * Math.sin(ph * Math.PI) + 0.06; y = -0.05 + ph * 1.3; } else { r = 0.1 * Math.sin((ph - 0.5) * Math.PI); y = 0.6 - (ph - 0.5) * 1.3; }
            var a = i * 2.39 + st.t * 3 * stir * (st.step === 3 ? 0.5 : 1);
            f.position.set(Math.cos(a) * r, y * (0.25 + 0.75 * stir), Math.sin(a) * r);
            f.scale.setScalar(size);
          });
        },
        labels: {
          motor: H.v(0.75, -0.6, 0.3), coupler: H.v(-0.35, -0.22, 0.4), jar: H.v(-0.6, 0.55, 0.2), blades: H.v(0.35, 0.05, 0.4),
          ridges: H.v(0.5, 0.65, 0.3), lid: H.v(0, 1.05, 0)
        }
      };
    }
  });
})();
