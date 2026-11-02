/* Part 4 · Getting Around */
(function () {
  var G = 'Part 4 · Getting Around';
  var H = HTW.H, T = window.THREE;

  // ---------- Four-stroke engine ----------
  HTW.define({
    id: 'engine', group: G, name: 'Four-stroke engine', card: 'Suck, squeeze, bang, blow',
    lede: 'This is the engine in most scooters and motorbikes. Watch one full cycle: suck, squeeze, bang, blow.',
    cycle: 8,
    steps: [
      { name: 'Intake', kid: 'Suck', text: 'The piston slides down from the top. The intake valve opens, and the falling piston draws a fresh mix of petrol and air into the cylinder.' },
      { name: 'Compression', kid: 'Squeeze', text: 'Both valves shut. The piston rises and squeezes the mix into a space about one-tenth of its size. Squeezed fuel burns faster and harder.' },
      { name: 'Power', kid: 'Bang', text: 'Just as the piston reaches the top, the spark plug fires. The mix burns in a flash, the hot gas expands, and it shoves the piston down. This is the only stroke that makes power.' },
      { name: 'Exhaust', kid: 'Blow', text: 'The exhaust valve opens. The rising piston pushes the burnt gas out through the exhaust port towards the silencer. Then the cycle starts again.' }
    ],
    facts: [['One cycle', '720° (two crank turns)'], ['Power strokes', '1 in 4']],
    parts: [
      { id: 'piston', name: 'Piston', text: 'A snug metal plug that slides up and down. Burning gas pushes it down. The rings around it stop gas leaking past.' },
      { id: 'cylinder', name: 'Cylinder', text: 'A strong metal tube that the piston slides inside. It is sealed tight so the gas can only push on the piston.' },
      { id: 'chamber', name: 'Combustion chamber', text: 'The space above the piston where the fuel burns. It is smallest when the piston is at the top (TDC).' },
      { id: 'head', name: 'Cylinder head', text: 'The lid on top of the cylinder. It holds the two valves and the spark plug.' },
      { id: 'sparkPlug', name: 'Spark plug', text: 'Makes a tiny lightning bolt at exactly the right moment to light the squeezed mix.' },
      { id: 'intakeValve', name: 'Intake valve', text: 'A mushroom-shaped door that opens to let the fresh petrol-and-air mix in. A spinning cam pushes it open at the right moment.' },
      { id: 'exhaustValve', name: 'Exhaust valve', text: 'The second door. It opens to let the burnt gas out.' },
      { id: 'intakePort', name: 'Intake port', text: 'The passage the fuel-and-air mix flows in through, from the fuel injector or carburettor.' },
      { id: 'exhaustPort', name: 'Exhaust port', text: 'The passage burnt gas leaves by, on its way to the silencer.' },
      { id: 'rod', name: 'Connecting rod', text: 'Links the piston to the crankshaft, the way your leg links to a bicycle pedal.' },
      { id: 'crank', name: 'Crankshaft', text: 'Turns the up-and-down push of the piston into round-and-round turning that drives the wheel.' },
      { id: 'flywheel', name: 'Flywheel', text: 'A heavy wheel that keeps spinning between power strokes, carrying the engine through the other three strokes.' },
      {id: "camshaft", name: "Camshaft", text: "A spinning shaft with egg-shaped bumps called cams. Each bump pushes a valve open at exactly the right moment. It turns once for every two turns of the crankshaft."},
      {id: "springs", name: "Valve springs", text: "Strong springs that snap each valve shut again once the cam has passed."},
      {id: "chain", name: "Timing chain", text: "Links the crankshaft to the camshaft, so the valves always open in step with the piston."},
      {id: "injector", name: "Fuel injector", text: "Sprays a fine mist of petrol into the incoming air. Older bikes use a carburettor instead."},
      {id: "sump", name: "Oil sump", text: "Holds the engine oil, which is pumped and splashed over the moving parts so they slide smoothly and stay cool."}
    ],
    camera: { pos: [5.6, 4.0, 8.2], target: [0, 1.5, 0], min: 3.2, max: 16 }, wireCamera: { pos: [4.9, 3.5, 7.2], target: [-0.1, 1.6, 0] },
    readout: function (st) { return 'Crank angle <strong>' + Math.round(st.p * 720) + '°</strong> of 720°'; },
    build: function (c) {
      var s = c.scene, tag = c.tag;
      var R = 0.6, L = 1.8, HEAD_Y = 2.85, BORE = 0.52, PH = 0.46;
      var wall = H.cyl(0.56, 0.56, HEAD_Y - 0.95, H.glass(0xa9c4dc, 0.2), 0, (HEAD_Y + 0.95) / 2, 0, 48, true); s.add(tag(wall, 'cylinder'));
      [0.95, HEAD_Y].forEach(function (y) { var r = H.torus(0.56, 0.014, H.metal(0x7d8a97), 0, y, 0); r.rotation.x = Math.PI / 2; s.add(tag(r, 'cylinder')); });
      s.add(tag(H.cyl(0.66, 0.66, 0.2, H.glass(0x8fa3b6, 0.38), 0, HEAD_Y + 0.1, 0, 48), 'head'));
      var gasMat = H.glass(0x3d8ef0, 0.3); var gas = H.cyl(BORE, BORE, 1, gasMat, 0, 0, 0, 40); s.add(tag(gas, 'chamber'));
      var piston = new T.Group();
      piston.add(tag(H.cyl(0.5, 0.5, PH, H.metal(0xb9c2cb), 0, 0, 0, 48), 'piston'));
      [0.15, 0.08].forEach(function (y) { var r = H.torus(0.5, 0.013, H.metal(0x3a434c), 0, y, 0); r.rotation.x = Math.PI / 2; piston.add(tag(r, 'piston')); });
      var pin = H.cyl(0.07, 0.07, 0.9, H.metal(0x6f7b87)); pin.rotation.x = Math.PI / 2; piston.add(tag(pin, 'piston'));
      s.add(piston);
      var rod = new T.Group(); var rg = new T.BoxGeometry(0.12, L, 0.1); rg.translate(0, L / 2, 0);
      rod.add(tag(new T.Mesh(rg, H.metal(0x8e99a4)), 'rod'));
      var be = H.cyl(0.15, 0.15, 0.12, H.metal(0x8e99a4)); be.rotation.x = Math.PI / 2; rod.add(tag(be, 'rod')); s.add(rod);
      var crank = new T.Group();
      var j = H.cyl(0.13, 0.13, 1.5, H.metal(0x66727e)); j.rotation.x = Math.PI / 2; crank.add(tag(j, 'crank'));
      [-0.16, 0.16].forEach(function (z) { crank.add(tag(H.box(0.34, R + 0.3, 0.08, H.metal(0x7a8692), 0, (R - 0.3) / 2 + 0.15, z), 'crank')); crank.add(tag(H.box(0.72, 0.3, 0.08, H.metal(0x5d6873), 0, -0.28, z), 'crank')); });
      var cp = H.cyl(0.1, 0.1, 0.42, H.metal(0x66727e), 0, R, 0); cp.rotation.x = Math.PI / 2; crank.add(tag(cp, 'crank'));
      var fly = H.cyl(0.8, 0.8, 0.1, H.metal(0x4f5a65, { metalness: 0.7 }), 0, 0, 0.85, 56); fly.rotation.x = Math.PI / 2; crank.add(tag(fly, 'flywheel'));
      crank.add(tag(H.box(0.08, 0.5, 0.02, H.matte(0xff7a33), 0, 0.45, 0.91), 'flywheel'));
      s.add(crank);
      function valve(side, id, tint) { var g = new T.Group(); g.add(tag(H.cyl(0.13, 0.16, 0.05, H.metal(tint)), id)); g.add(tag(H.cyl(0.028, 0.028, 0.8, H.metal(tint), 0, 0.4, 0, 12), id)); g.position.x = side * 0.27; s.add(g); return g; }
      var inV = valve(-1, 'intakeValve', 0x6f97c9), exV = valve(1, 'exhaustValve', 0xc98d6f);
      var inE = [H.v(-0.27, HEAD_Y + 0.08, 0), H.v(-1.3, HEAD_Y + 0.8, 0)], exE = [H.v(0.27, HEAD_Y + 0.08, 0), H.v(1.3, HEAD_Y + 0.8, 0)];
      s.add(tag(H.between(inE[0], inE[1], 0.13, H.glass(0x5b9cf0, 0.3), true), 'intakePort'));
      s.add(tag(H.between(exE[0], exE[1], 0.13, H.glass(0x9a9fa6, 0.34), true), 'exhaustPort'));
      var plug = new T.Group();
      plug.add(tag(H.cyl(0.075, 0.075, 0.42, H.matte(0xf2f2ee), 0, 0.36, 0, 20), 'sparkPlug'));
      plug.add(tag(H.cyl(0.12, 0.12, 0.1, H.metal(0x9aa4ae), 0, 0.15, 0, 6), 'sparkPlug'));
      plug.add(tag(H.cyl(0.022, 0.022, 0.2, H.metal(0x9aa4ae), 0, 0, 0, 10), 'sparkPlug'));
      plug.position.y = HEAD_Y; s.add(plug);
      var spark = H.sph(0.11, H.basic(0xffd27a, 0), 0, HEAD_Y - 0.12, 0); s.add(spark);
      var sl = new T.PointLight(0xff8a33, 0, 4); sl.position.copy(spark.position); s.add(sl);
      var inS = H.stream(s, 10, 0x4f9bff), exS = H.stream(s, 10, 0x8b9097);
      var tdc = R + L + PH / 2, bdc = L - R + PH / 2, tm = new T.LineBasicMaterial({ color: 0x7d8a97 });
      [tdc, bdc].forEach(function (y) { s.add(new T.Line(new T.BufferGeometry().setFromPoints([H.v(0.6, y, 0), H.v(0.82, y, 0)]), tm)); });
      var cool = new T.Color(0x3d8ef0), hot = new T.Color(0xff6a1a), smoke = new T.Color(0x8a8f96), tmp = new T.Color(), py = 0;
      // extras:engine
      var CAMY = HEAD_Y + 0.98, CZ = -0.55;
      var cam = new T.Group(); var cshaft = H.cyl(0.05, 0.05, 1.3, H.metal(0x6f7b87)); cshaft.rotation.x = Math.PI / 2; cshaft.position.z = -0.1; cam.add(tag(cshaft, 'camshaft'));
      cam.position.set(0, CAMY, 0); s.add(cam);
      function lobe(x) { var g = new T.Group(); var m = H.mesh(new T.SphereGeometry(0.11, 20, 12), H.metal(0x8e99a4), 0, -0.04, 0); m.scale.set(0.75, 1.25, 0.6); g.add(tag(m, 'camshaft')); g.position.set(x, CAMY, 0); s.add(g); return g; }
      var lobeIn = lobe(-0.27), lobeEx = lobe(0.27);
      function spring(x) { var pts = []; for (var i = 0; i <= 120; i++) { var a = i / 120 * Math.PI * 2 * 7; pts.push(H.v(x + Math.cos(a) * 0.065, i / 120, Math.sin(a) * 0.065)); } var m = H.tube(pts, 0.009, H.metal(0x3cc26b)); s.add(tag(m, 'springs')); return m; }
      var sprIn = spring(-0.27), sprEx = spring(0.27);
      var crankSp = H.cyl(0.16, 0.16, 0.05, H.metal(0x4f5a65), 0, 0, CZ); crankSp.rotation.x = Math.PI / 2; s.add(tag(crankSp, 'chain'));
      var camSp = H.cyl(0.3, 0.3, 0.05, H.metal(0x4f5a65), 0, CAMY, CZ); camSp.rotation.x = Math.PI / 2; s.add(tag(camSp, 'chain'));
      var loopPts = [H.v(-0.32, CAMY, CZ), H.v(-0.2, CAMY + 0.24, CZ), H.v(0, CAMY + 0.32, CZ), H.v(0.2, CAMY + 0.24, CZ), H.v(0.32, CAMY, CZ), H.v(0.18, 0, CZ), H.v(0.1, -0.15, CZ), H.v(0, -0.19, CZ), H.v(-0.1, -0.15, CZ), H.v(-0.18, 0, CZ)];
      var chainCurve = H.curve(loopPts, true);
      s.add(tag(H.tube(loopPts, 0.018, H.metal(0x30353b), true), 'chain'));
      var links = H.stream(s, 34, 0xff7a33, 0.02);
      var inj = H.cyl(0.05, 0.05, 0.3, H.metal(0x2f5aa8), -0.9, HEAD_Y + 0.82, 0.18); inj.rotation.z = -0.9; s.add(tag(inj, 'injector'));
      var mist = H.stream(s, 14, 0xf2d24b, 0.025);
      s.add(tag(H.box(1.3, 0.38, 0.9, H.glass(0x9aa3ab, 0.25), 0, -0.78, -0.15), 'sump'));
      s.add(tag(H.box(1.24, 0.14, 0.84, H.glass(0xd9a02b, 0.55), 0, -0.9, -0.15), 'sump'));
      c.anim(function (st) {
        var camA = st.p * Math.PI * 2;
        cam.rotation.z = -camA;
        lobeIn.rotation.z = -(camA - Math.PI * 0.25); lobeEx.rotation.z = -(camA - Math.PI * 1.75);
        camSp.rotation.y = 0; camSp.rotation.z = -camA; crankSp.rotation.z = -camA * 2;
        var il = st.step === 0 ? Math.sin(st.prog * Math.PI) : 0, el = st.step === 3 ? Math.sin(st.prog * Math.PI) : 0;
        [[sprIn, il], [sprEx, el]].forEach(function (q) { var bot = HEAD_Y + 0.2, topY = HEAD_Y + 0.62 - q[1] * 0.17; q[0].position.y = bot; q[0].scale.y = topY - bot; });
        H.flow(links, chainCurve, st.p * 4, { speed: 1 });
        mist.forEach(function (m, i) { m.visible = st.step === 0 && st.prog > 0.1 && st.prog < 0.8; if (!m.visible) return; var u = (st.t * 1.5 + i / mist.length) % 1; m.position.set(-0.8 + u * 0.35, HEAD_Y + 0.72 - u * 0.25, 0.1 + Math.sin(i) * 0.05); });
      });
      c.labels.camshaft = H.v(0.65, CAMY + 0.15, 0.2); c.labels.springs = H.v(-0.75, HEAD_Y + 0.78, 0.2); c.labels.chain = H.v(0.62, 1.6, CZ);
      c.labels.injector = H.v(-1.45, HEAD_Y + 0.55, 0.3); c.labels.sump = H.v(0.8, -0.85, 0.3);

      return {
        update: function (st) {
          var deg = st.p * 720, idx = st.step, prog = st.prog, a = deg * Math.PI / 180;
          var cx = R * Math.sin(a), cy = R * Math.cos(a);
          py = cy + Math.sqrt(L * L - cx * cx);
          piston.position.y = py; crank.rotation.z = -a;
          rod.position.set(cx, cy, 0); rod.rotation.z = Math.atan2(cx, py - cy);
          var il = idx === 0 ? Math.sin(prog * Math.PI) : 0, el = idx === 3 ? Math.sin(prog * Math.PI) : 0;
          inV.position.y = HEAD_Y - 0.03 - il * 0.17; exV.position.y = HEAD_Y - 0.03 - el * 0.17;
          var gb = py + PH / 2, gh = Math.max(HEAD_Y - gb, 0.01); gas.scale.y = gh; gas.position.y = gb + gh / 2;
          if (idx === 0) { gasMat.color.copy(cool); gasMat.opacity = 0.18 + 0.2 * prog; }
          else if (idx === 1) { gasMat.color.copy(cool); gasMat.opacity = 0.38 + 0.3 * prog; }
          else if (idx === 2) { gasMat.color.copy(tmp.copy(hot).lerp(smoke, Math.min(prog * 1.4, 1))); gasMat.opacity = 0.75 - 0.35 * prog; }
          else { gasMat.color.copy(smoke); gasMat.opacity = 0.4 - 0.25 * prog; }
          var k = Math.max(0, 1 - Math.abs(deg - 362) / 12); spark.material.opacity = k; sl.intensity = k * 3.5; spark.scale.setScalar(0.6 + k * 0.8);
          [[inS, inE, il, true], [exS, exE, el, false]].forEach(function (q) {
            q[0].forEach(function (m, i) {
              m.visible = q[2] > 0.12; if (!m.visible) return;
              var u = (st.t * 0.9 + i / q[0].length) % 1;
              m.position.lerpVectors(q[3] ? q[1][1] : q[1][0], q[3] ? q[1][0] : q[1][1], u); m.material.opacity = 0.9 * q[2];
            });
          });
        },
        labels: {
          piston: function () { return H.v(0.62, py, 0.3); }, cylinder: H.v(-0.8, 2.25, 0.2), chamber: function () { return H.v(-0.1, (HEAD_Y + py + PH / 2) / 2 + 0.05, 0.45); },
          head: H.v(0.75, HEAD_Y + 0.12, 0.35), sparkPlug: H.v(0, HEAD_Y + 0.72, 0), intakeValve: H.v(-0.5, HEAD_Y + 0.42, 0.25), exhaustValve: H.v(0.5, HEAD_Y + 0.42, 0.25),
          intakePort: H.v(-1.35, HEAD_Y + 0.98, 0), exhaustPort: H.v(1.35, HEAD_Y + 0.98, 0), rod: function () { return H.v(-0.42, py * 0.5, 0.2); },
          crank: H.v(0.55, -0.45, -0.3), flywheel: H.v(-0.85, -0.35, 0.9)
        },
        marks: [{ text: 'TDC', pos: H.v(0.82, tdc, 0) }, { text: 'BDC', pos: H.v(0.82, bdc, 0) }]
      };
    }
  });

  // ---------- Disc brakes ----------
  HTW.define({
    id: 'brakes', group: G, name: 'Disc brakes', card: 'Friction turns motion into heat',
    lede: 'A gentle squeeze at your hand becomes a powerful grip at the wheel, thanks to a liquid that cannot be squashed.',
    cycle: 10,
    steps: [
      { name: 'Lever', kid: 'Squeeze', text: 'Squeezing the brake lever pushes a small piston inside the master cylinder.' },
      { name: 'Brake fluid', kid: 'Pass the push', text: 'The piston pushes brake fluid along the hose. Liquids cannot be squashed, so the push arrives at the wheel almost instantly.' },
      { name: 'Pads', kid: 'Grip', text: 'The fluid pushes pistons in the caliper, which press the brake pads hard against both sides of the spinning disc.' },
      { name: 'Friction', kid: 'Slow and heat', text: 'Friction between the pads and the disc turns the wheel’s motion into heat. The wheel slows down, and the disc gets hot.' }
    ],
    facts: [['Energy change', 'motion → heat'], ['Hard braking', 'disc can pass 300 °C']],
    parts: [
      { id: 'lever', name: 'Brake lever', text: 'The handle you squeeze. It works as a lever, making your push stronger.' },
      { id: 'master', name: 'Master cylinder', text: 'A small cylinder full of brake fluid with a piston that the lever pushes.' },
      { id: 'hose', name: 'Brake hose', text: 'A strong tube full of fluid that carries the push down to the wheel.' },
      { id: 'caliper', name: 'Caliper', text: 'A clamp that sits over the edge of the disc. Inside are pistons that squeeze the pads.' },
      { id: 'pads', name: 'Brake pads', text: 'Blocks of tough, rough material that grip the disc. They slowly wear away and need replacing.' },
      { id: 'disc', name: 'Disc', text: 'A steel disc bolted to the wheel. The holes help it cool down and shed water.' },
      {id: "cpiston", name: "Caliper pistons", text: "Pushed by the brake fluid, these small pistons press the pads against the disc."},
      {id: "wheel", name: "Wheel and tyre", text: "The disc is bolted to the wheel, so slowing the disc slows the whole wheel."}
    ],
    camera: { pos: [2.6, 2.4, 6.6], target: [-0.5, 0.7, 0] },
    readout: function (st) {
      var v = st.step < 2 ? 40 : st.step === 2 ? 40 - st.prog * 20 : 20 - st.prog * 20;
      return 'Wheel speed <strong>' + Math.round(v) + ' km/h</strong>';
    },
    build: function (c) {
      var s = c.scene, tag = c.tag;
      var discMat = H.metal(0xb8c0c8, { emissive: new T.Color(0xff5a1f), emissiveIntensity: 0 });
      var disc = new T.Group();
      var d = H.cyl(0.95, 0.95, 0.05, discMat, 0, 0, 0, 64); d.rotation.x = Math.PI / 2; disc.add(tag(d, 'disc'));
      for (var i = 0; i < 18; i++) { var a = i / 18 * Math.PI * 2, h = H.cyl(0.04, 0.04, 0.06, H.matte(0x2a2f35), Math.cos(a) * 0.72, Math.sin(a) * 0.72, 0, 10); h.rotation.x = Math.PI / 2; disc.add(tag(h, 'disc')); }
      var hub = H.cyl(0.3, 0.3, 0.12, H.metal(0x4f5a65), 0, 0, 0); hub.rotation.x = Math.PI / 2; disc.add(tag(hub, 'disc'));
      var tyre = H.torus(1.55, 0.2, H.matte(0x1d1f22), 0, 0, -0.15); disc.add(tyre);
      for (var sp = 0; sp < 5; sp++) { var arm = H.box(0.08, 1.3, 0.05, H.metal(0x6f7880), 0, 0.65, -0.15); var g = new T.Group(); g.add(arm); g.rotation.z = sp / 5 * Math.PI * 2; disc.add(g); }
      disc.position.y = 0.2; s.add(disc);
      var cal = new T.Group();
      cal.add(H.box(0.5, 0.35, 0.08, H.metal(0xc4302b), 0, 0, 0.16)); cal.add(H.box(0.5, 0.35, 0.08, H.metal(0xc4302b), 0, 0, -0.16));
      cal.add(H.box(0.5, 0.1, 0.4, H.metal(0xc4302b), 0, 0.2, 0));
      cal.position.set(0, 1.05, 0); s.add(c.tagAll(cal, 'caliper'));
      var padA = H.box(0.4, 0.25, 0.04, H.matte(0x5a4a3a), 0, 1.05, 0.1), padB = H.box(0.4, 0.25, 0.04, H.matte(0x5a4a3a), 0, 1.05, -0.1);
      s.add(tag(padA, 'pads')); s.add(tag(padB, 'pads'));
      var mc = H.cyl(0.08, 0.08, 0.4, H.metal(0x2a2f35), -1.6, 1.8, 0); mc.rotation.z = Math.PI / 2; s.add(tag(mc, 'master'));
      s.add(tag(H.box(0.16, 0.12, 0.12, H.glass(0xf2d24b, 0.6), -1.6, 1.95, 0), 'master'));
      s.add(H.cyl(0.06, 0.06, 0.8, H.matte(0x2a2f35), -2.0, 1.8, 0)).children;
      s.children[s.children.length - 1].rotation.z = Math.PI / 2;
      var lever = new T.Group(); var lb = H.box(0.9, 0.05, 0.05, H.metal(0xd0d6dc), -0.45, 0, 0); lever.add(lb);
      lever.position.set(-1.4, 1.65, 0.05); s.add(c.tagAll(lever, 'lever'));
      var hosePts = [H.v(-1.4, 1.8, 0), H.v(-0.9, 1.9, 0.1), H.v(-0.4, 1.6, 0.1), H.v(0, 1.3, 0)];
      s.add(tag(H.tube(hosePts, 0.03, H.matte(0x22262b)), 'hose'));
      var fluid = H.stream(s, 14, 0xf2d24b, 0.03), heat = H.stream(s, 16, 0xff7a33, 0.04), hc = H.curve(hosePts);
      var ang = 0;
      // extras:brakes
      var cpA = H.cyl(0.09, 0.09, 0.08, H.metal(0xd8dde2), 0, 1.05, 0.2), cpB = H.cyl(0.09, 0.09, 0.08, H.metal(0xd8dde2), 0, 1.05, -0.2);
      cpA.rotation.x = Math.PI / 2; cpB.rotation.x = Math.PI / 2; s.add(tag(cpA, 'cpiston')); s.add(tag(cpB, 'cpiston'));
      tag(tyre, 'wheel');
      c.anim(function () { cpA.position.z = padA.position.z + 0.06; cpB.position.z = padB.position.z - 0.06; });
      c.labels.cpiston = H.v(-0.45, 1.25, 0.3); c.labels.wheel = H.v(1.6, -0.9, 0.2);

      return {
        update: function (st) {
          var v = st.step < 2 ? 1 : st.step === 2 ? 1 - st.prog * 0.5 : 0.5 - st.prog * 0.5;
          ang -= st.dt * v * 6; disc.rotation.z = ang;
          var sq = st.step === 0 ? H.smooth(st.prog) : st.step === 3 && st.prog > 0.85 ? 1 - H.smooth((st.prog - 0.85) / 0.15) : 1;
          lever.rotation.z = -0.35 + sq * 0.3;
          H.flow(fluid, hc, st.t, { speed: 0.6, visible: st.step >= 1, range: st.step === 1 ? [0, H.clamp(st.prog * 1.2, 0.05, 1)] : [0, 1] });
          var grip = st.step >= 2 ? (st.step === 2 ? H.smooth(st.prog / 0.3) : 1) : 0;
          padA.position.z = 0.12 - grip * 0.08; padB.position.z = -0.12 + grip * 0.08;
          var hot = st.step === 3 ? st.prog : st.step === 2 ? st.prog * 0.3 : 0;
          discMat.emissiveIntensity = hot * 0.7;
          heat.forEach(function (m, i) {
            m.visible = hot > 0.1; if (!m.visible) return;
            var u = (st.t * 0.5 + i / heat.length) % 1;
            m.position.set(-0.3 + (i % 5) * 0.15, 1.2 + u * 0.9, (i % 2 ? 0.1 : -0.1)); m.material.opacity = (1 - u) * hot;
          });
        },
        labels: {
          lever: H.v(-2.0, 1.45, 0.2), master: H.v(-1.6, 2.2, 0), hose: H.v(-0.7, 2.05, 0.1), caliper: H.v(0.45, 1.35, 0.2),
          pads: H.v(0.45, 0.9, 0.3), disc: H.v(-0.6, -0.35, 0.2)
        }
      };
    }
  });

  // ---------- Lift ----------
  HTW.define({
    id: 'lift', group: G, name: 'Lift (elevator)', card: 'A seesaw with a counterweight',
    lede: 'The car and a heavy counterweight hang from the same ropes. As one rises the other falls, so the motor only does a little work.',
    cycle: 12, groundY: -1.0,
    steps: [
      { name: 'Motor', kid: 'Turn the pulley', text: 'At the top of the shaft an electric motor turns a grooved wheel called a sheave. The steel ropes run over it.' },
      { name: 'Travel', kid: 'Seesaw', text: 'As the car goes up, the counterweight on the other end goes down. They balance like a seesaw, so the motor does less work.' },
      { name: 'Arrive', kid: 'Slow down', text: 'The controller slows the motor smoothly, so the car stops exactly level with the floor.' },
      { name: 'Doors', kid: 'Open', text: 'Only when the car is level do the doors open. The car doors and the floor doors open together.' }
    ],
    facts: [['Counterweight', '≈ car + half its load'], ['Ropes', 'several, each strong enough alone']],
    parts: [
      { id: 'motor', name: 'Motor and sheave', text: 'The motor turns the grooved sheave. Grip between the grooves and the ropes moves the car.' },
      { id: 'ropes', name: 'Steel ropes', text: 'Several ropes hold the car, and each one alone could hold it.' },
      { id: 'car', name: 'Car', text: 'The box you ride in. It runs up and down between guide rails.' },
      { id: 'counterweight', name: 'Counterweight', text: 'A heavy stack of metal on the other end of the ropes. It balances the car.' },
      { id: 'rails', name: 'Guide rails', text: 'Steel tracks on the shaft walls that keep the car steady.' },
      { id: 'safety', name: 'Safety brakes', text: 'Clamps on the car. If it ever moved down too fast, they would grip the rails and stop it.' },
      { id: 'doors', name: 'Doors', text: 'Sliding doors that stay locked unless the car is level with the floor.' },
      {id: "governor", name: "Speed governor", text: "A separate wheel turned by the car through its own rope. If the car ever goes too fast, it trips and sets off the safety brakes."},
      {id: "buffers", name: "Buffers", text: "Big springs or oil cushions at the bottom of the shaft: the very last line of safety."},
      {id: "buttons", name: "Call buttons", text: "Tell the controller which floor wants the lift. The light shows your call has been heard."},
      {id: "controller", name: "Controller", text: "A computer in the machine room that decides where to go next and controls the motor’s speed."}
    ],
    camera: { pos: [5.6, 2.8, 8.8], target: [0, 1.3, 0] },
    readout: function (st) { return 'Floor <strong>' + (st.step === 3 ? 'arrived' : 'moving') + '</strong>'; },
    build: function (c) {
      var s = c.scene, tag = c.tag;
      [-0.5, 0.5].forEach(function (x) { s.add(tag(H.box(0.05, 4.0, 0.05, H.metal(0x7d8a97), x, 1.0, -0.05), 'rails')); });
      [[-0.6, -0.45], [0.6, -0.45], [-0.6, 0.45], [0.6, 0.45]].forEach(function (q) { s.add(H.box(0.03, 4.0, 0.03, H.matte(0x9aa3ab), q[0], 1.0, q[1])); });
      [-1.0, 1.4].forEach(function (y) { s.add(H.box(2.6, 0.06, 1.2, H.glass(0xc9ced3, 0.35), -1.2, y - 0.03, 0)); });
      var sheave = H.cyl(0.32, 0.32, 0.18, H.metal(0x4f5a65), 0, 3.15, -0.1, 40); sheave.rotation.x = Math.PI / 2; s.add(tag(sheave, 'motor'));
      var mark = H.box(0.06, 0.25, 0.2, H.matte(0xff7a33), 0, 3.3, -0.1); s.add(tag(mark, 'motor'));
      var motor = H.cyl(0.22, 0.22, 0.5, H.metal(0x2f5aa8), 0, 3.15, -0.5); motor.rotation.x = Math.PI / 2; s.add(tag(motor, 'motor'));
      s.add(H.box(1.6, 0.06, 1.2, H.matte(0x6c7680), 0, 2.85, -0.1));
      var car = new T.Group();
      car.add(H.box(0.9, 1.1, 0.8, H.glass(0xe7d9b5, 0.35), 0, 0.55, 0));
      car.add(H.box(0.9, 0.05, 0.8, H.metal(0x8f9aa5), 0, 0, 0)); car.add(H.box(0.9, 0.05, 0.8, H.metal(0x8f9aa5), 0, 1.1, 0));
      c.tagAll(car, 'car');
      var dl = H.box(0.22, 1.0, 0.03, H.metal(0xc0c6cc), -0.11, 0.55, 0.41), dr = H.box(0.22, 1.0, 0.03, H.metal(0xc0c6cc), 0.11, 0.55, 0.41);
      car.add(tag(dl, 'doors')); car.add(tag(dr, 'doors'));
      [-0.47, 0.47].forEach(function (x) { car.add(tag(H.box(0.06, 0.12, 0.12, H.matte(0xd23b3b), x, 0.05, -0.05), 'safety')); });
      s.add(car);
      var cw = H.box(0.5, 0.7, 0.18, H.metal(0x3a4048), 0, 0, -0.38); s.add(tag(cw, 'counterweight'));
      var ropeMat = new T.LineBasicMaterial({ color: 0x2a2f35 });
      var ropes = [-0.05, 0, 0.05].map(function (dz) { var g = new T.BufferGeometry().setFromPoints([H.v(0, 0, 0), H.v(0, 0, 0), H.v(0, 0, 0)]); var l = new T.Line(g, ropeMat); l.userData.dz = dz; s.add(l); return l; });
      var pick = new T.Mesh(new T.BoxGeometry(0.06, 1, 0.06), new T.MeshBasicMaterial({ visible: false })); s.add(tag(pick, 'ropes'));
      var up = true, lastP = 0;
      var A = -0.97, B = 1.43;
      // extras:lift
      var gov = H.cyl(0.18, 0.18, 0.06, H.metal(0xd8b25a), 0.5, 3.0, 0.35); gov.rotation.x = Math.PI / 2; s.add(tag(gov, 'governor'));
      var govB = H.cyl(0.12, 0.12, 0.05, H.metal(0xd8b25a), 0.5, -0.85, 0.35); govB.rotation.x = Math.PI / 2; s.add(tag(govB, 'governor'));
      s.add(tag(H.box(0.01, 3.85, 0.01, H.matte(0x6b5a2a), 0.68, 1.07, 0.35), 'governor')); s.add(tag(H.box(0.01, 3.85, 0.01, H.matte(0x6b5a2a), 0.32, 1.07, 0.35), 'governor'));
      [-0.25, 0.25].forEach(function (x) { s.add(tag(H.cyl(0.07, 0.09, 0.14, H.matte(0xd23b3b), x, -0.93, 0), 'buffers')); });
      var lamps = [];
      [-1.0, 1.4].forEach(function (y) { s.add(tag(H.box(0.12, 0.2, 0.03, H.metal(0xc0c6cc), -0.75, y + 0.65, 0.5), 'buttons')); var l = H.sph(0.035, H.basic(0xffb020), -0.75, y + 0.68, 0.52); s.add(tag(l, 'buttons')); lamps.push(l); });
      s.add(tag(H.box(0.4, 0.5, 0.3, H.matte(0x2f5aa8), -0.55, 3.13, -0.35), 'controller'));
      var lastY = null;
      c.anim(function (st) {
        var y = car.position.y, v = lastY == null ? 0 : (y - lastY); lastY = y;
        gov.rotation.z -= v * 6; govB.rotation.z -= v * 9;
        lamps[0].material.color.setHex(st.step < 3 ? 0x555555 : 0xffb020); lamps[1].material.color.setHex(st.step < 3 ? 0xffb020 : 0x555555);
      });
      c.labels.governor = H.v(0.95, 3.0, 0.35); c.labels.buffers = H.v(-0.6, -0.85, 0.3); c.labels.buttons = H.v(-1.15, 2.2, 0.5); c.labels.controller = H.v(-1.0, 3.45, -0.35);

      return {
        update: function (st) {
          if (st.p < lastP) up = !up; lastP = st.p;
          var f = st.step === 0 ? 0.08 * st.prog * st.prog : st.step === 1 ? 0.08 + 0.8 * st.prog : st.step === 2 ? 0.88 + 0.12 * (1 - Math.pow(1 - st.prog, 2)) : 1;
          var y = up ? H.lerp(A, B, f) : H.lerp(B, A, f);
          car.position.y = y;
          cw.position.y = 2.2 - (y - A) * 1.0 - 0.1;
          var moving = st.step < 3 ? (st.step === 1 ? 1 : 0.5) : 0;
          sheave.rotation.z -= st.dt * moving * 3 * (up ? 1 : -1); mark.position.set(Math.sin(sheave.rotation.z) * -0.2, 3.15 + Math.cos(sheave.rotation.z) * 0.2, -0.1);
          var open = st.step === 3 ? H.pulse(st.prog) : 0;
          dl.position.x = -0.11 - open * 0.2; dr.position.x = 0.11 + open * 0.2;
          ropes.forEach(function (l) {
            var dz = l.userData.dz, pts = [H.v(0, y + 1.1, dz), H.v(0, 3.47, -0.1 + dz), H.v(0, cw.position.y + 0.35, -0.38 + dz)];
            pts[1].x = 0; l.geometry.setFromPoints([H.v(-0.02, y + 1.1, dz), H.v(-0.32, 3.15, dz - 0.1), H.v(0.32, 3.15, dz - 0.1), H.v(0.02, cw.position.y + 0.35, -0.38 + dz)]);
          });
          pick.position.set(0, (y + 1.1 + 3.15) / 2, 0); pick.scale.y = Math.max(3.15 - (y + 1.1), 0.1);
        },
        labels: {
          motor: H.v(0.6, 3.5, -0.3), ropes: function () { return H.v(-0.35, (car.position.y + 4.2) / 2, 0); }, car: function () { return H.v(-0.75, car.position.y + 0.8, 0.4); },
          counterweight: function () { return H.v(0.55, cw.position.y, -0.45); }, rails: H.v(0.5, 2.5, -0.05), safety: function () { return H.v(0.7, car.position.y + 0.05, 0.1); },
          doors: function () { return H.v(0, car.position.y + 0.55, 0.6); }
        }
      };
    }
  });

  // ---------- Traffic signal ----------
  HTW.define({
    id: 'traffic', group: G, name: 'Traffic signal', card: 'Taking turns at a junction',
    lede: 'A controller box runs a timer that gives each road its turn. Watch the cars stop on red and go on green.',
    cycle: 16, groundR: 3.6,
    steps: [
      { name: 'North–south green', kid: 'Go', text: 'The controller gives one road a green light. Its cars cross while the other road waits at red.' },
      { name: 'North–south amber', kid: 'Stop soon', text: 'Amber warns drivers the light is about to turn red. Cars already close keep going; the rest stop at the line.' },
      { name: 'East–west green', kid: 'Your turn', text: 'After a moment of red in every direction, the other road gets its green light.' },
      { name: 'East–west amber', kid: 'Stop soon', text: 'Amber again, then red, and the cycle repeats. Busier roads can be given longer greens.' }
    ],
    facts: [['Red lamp', 'always on top'], ['Lamps', 'bright LEDs']],
    parts: [
      { id: 'controller', name: 'Controller box', text: 'The timer and computer that switch the lights in order. Some use sensors or cameras to give busy roads more time.' },
      { id: 'signal', name: 'Signal head', text: 'The box of three lamps facing each road.' },
      { id: 'red', name: 'Red lamp', text: 'Always in the same place, at the top, so people who find colours hard to tell apart can read it by position.' },
      { id: 'stopline', name: 'Stop line', text: 'The white line where cars must wait when the light is red.' },
      { id: 'cars', name: 'Vehicles', text: 'Each one follows the lamp facing its road.' },
      {id: "timer", name: "Countdown timer", text: "Shows how many seconds are left before the light changes, so drivers know how long to wait."},
      {id: "zebra", name: "Zebra crossing", text: "Painted stripes that mark the safe place for people to cross."},
      {id: "ped", name: "Pedestrian signal", text: "A green walking figure means it is safe to cross; a red standing figure means wait."}
    ],
    camera: { pos: [4.4, 4.6, 5.6], target: [0, -0.6, 0], max: 18 },
    readout: function (st) { return 'Green for <strong>' + (st.step < 2 ? 'north–south' : 'east–west') + '</strong>'; },
    build: function (c) {
      var s = c.scene, tag = c.tag, Y = -0.95;
      s.add(H.box(7, 0.04, 1.4, H.matte(0x30353b), 0, Y, 0)); s.add(H.box(1.4, 0.04, 7, H.matte(0x30353b), 0, Y + 0.001, 0));
      for (var k = -3; k <= 3; k++) { if (Math.abs(k) < 1) continue; s.add(H.box(0.4, 0.045, 0.04, H.matte(0xf2f2ee), k + (k > 0 ? -0.3 : 0.3), Y, 0)); s.add(H.box(0.04, 0.045, 0.4, H.matte(0xf2f2ee), 0, Y, k + (k > 0 ? -0.3 : 0.3))); }
      [[0.35, -1.25, 0.7, 0.05], [-0.35, 1.25, 0.7, 0.05], [-1.25, -0.35, 0.05, 0.7], [1.25, 0.35, 0.05, 0.7]].forEach(function (q) { s.add(tag(H.box(q[2], 0.05, q[3], H.matte(0xffffff), q[0], Y + 0.005, q[1]), 'stopline')); });
      var heads = [];
      // corners: [x, z, facing angle, road]
      [[0.95, -0.95, Math.PI, 'ns'], [-0.95, 0.95, 0, 'ns'], [-0.95, -0.95, -Math.PI / 2, 'ew'], [0.95, 0.95, Math.PI / 2, 'ew']].forEach(function (q) {
        s.add(H.cyl(0.035, 0.035, 1.3, H.metal(0x5c6670), q[0], Y + 0.65, q[1]));
        var g = new T.Group(); g.add(H.box(0.2, 0.55, 0.14, H.matte(0x1d1f22)));
        var lamps = [0xff3b2f, 0xffb020, 0x3cc26b].map(function (col, i) { var m = H.sph(0.06, H.basic(col), 0, 0.17 - i * 0.17, 0.07); g.add(m); return m; });
        g.position.set(q[0], Y + 1.5, q[1]); g.rotation.y = q[2]; s.add(g);
        tag(g.children[0], 'signal'); tag(lamps[0], 'red'); tag(lamps[1], 'signal'); tag(lamps[2], 'signal');
        heads.push({ road: q[3], lamps: lamps });
      });
      s.add(tag(H.box(0.4, 0.6, 0.3, H.matte(0x6b7280), 1.6, Y + 0.3, -1.4), 'controller'));
      var colors = [0x2f5aa8, 0xd23b3b, 0xf2c14e, 0x3c8a4f, 0xeeeeee, 0x8a5cff];
      var cars = [];
      // road, lane offset, direction
      [['ns', 0.35, -1], ['ns', 0.35, -1], ['ns', -0.35, 1], ['ew', 0.35, -1], ['ew', -0.35, 1], ['ew', -0.35, 1]].forEach(function (q, i) {
        var g = new T.Group(); g.add(H.box(0.32, 0.14, 0.55, H.matte(colors[i]))); g.add(H.box(0.28, 0.12, 0.28, H.glass(0x9fc7ee, 0.7), 0, 0.12, -0.02));
        s.add(c.tagAll(g, 'cars'));
        cars.push({ g: g, road: q[0], lane: q[1], dir: q[2], s: -3.2 + (i % 2) * 1.6 + (i % 3) * 0.3, v: 0 });
      });
      var dim = 0.18;
      // extras:traffic
      for (var zi = 0; zi < 7; zi++) { [-0.95, 0.95].forEach(function (zz) { s.add(tag(H.box(0.11, 0.045, 0.38, H.matte(0xffffff), -0.6 + zi * 0.2, Y + 0.004, zz), 'zebra')); }); }
      var tc = document.createElement('canvas'); tc.width = 128; tc.height = 96; var tt = new T.CanvasTexture(tc);
      var tm = new T.Mesh(new T.PlaneGeometry(0.3, 0.22), new T.MeshBasicMaterial({ map: tt, side: T.DoubleSide })); tm.position.set(0.95, Y + 2.0, -0.95); tm.rotation.y = Math.PI; s.add(tag(tm, 'timer'));
      s.add(tag(H.box(0.32, 0.24, 0.04, H.matte(0x1d1f22), 0.95, Y + 2.0, -0.93), 'timer'));
      var pc = document.createElement('canvas'); pc.width = 64; pc.height = 96; var pt2 = new T.CanvasTexture(pc);
      var pm = new T.Mesh(new T.PlaneGeometry(0.14, 0.2), new T.MeshBasicMaterial({ map: pt2, side: T.DoubleSide })); pm.position.set(-0.95, Y + 1.0, -1.04); pm.rotation.y = Math.PI; s.add(tag(pm, 'ped'));
      s.add(tag(H.box(0.16, 0.22, 0.05, H.matte(0x1d1f22), -0.95, Y + 1.0, -1.0), 'ped'));
      var lastT = '', lastP = '';
      c.anim(function (st) {
        var secLeft = st.step < 2 ? Math.ceil((2 - st.step - st.prog) * 4) : Math.ceil((4 - st.step - st.prog) * 4);
        var col = st.step < 2 ? (st.step === 0 ? '#3cc26b' : '#ffb020') : '#ff3b2f';
        var key = secLeft + col;
        if (key !== lastT) { lastT = key; var g = tc.getContext('2d'); g.fillStyle = '#111'; g.fillRect(0, 0, 128, 96); g.fillStyle = col; g.font = '700 70px monospace'; g.textAlign = 'center'; g.textBaseline = 'middle'; g.fillText(('0' + secLeft).slice(-2), 64, 52); tt.needsUpdate = true; }
        var walk = st.step >= 2 ? 'g' : 'r';
        if (walk !== lastP) { lastP = walk; var h = pc.getContext('2d'); h.fillStyle = '#111'; h.fillRect(0, 0, 64, 96); h.fillStyle = walk === 'g' ? '#3cc26b' : '#ff3b2f';
          h.beginPath(); h.arc(32, 22, 9, 0, 6.3); h.fill(); h.fillRect(26, 32, 12, 30);
          if (walk === 'g') { h.save(); h.translate(32, 62); h.rotate(0.4); h.fillRect(-3, 0, 6, 26); h.restore(); h.save(); h.translate(32, 62); h.rotate(-0.4); h.fillRect(-3, 0, 6, 26); h.restore(); }
          else { h.fillRect(26, 62, 5, 26); h.fillRect(33, 62, 5, 26); }
          pt2.needsUpdate = true; }
      });
      c.labels.timer = H.v(0.95, Y + 2.3, -0.95); c.labels.zebra = H.v(-0.95, Y + 0.05, -1.3); c.labels.ped = H.v(-1.3, Y + 1.2, -1.0);

      return {
        update: function (st) {
          var nsState = st.step === 0 ? 'g' : st.step === 1 ? 'a' : 'r', ewState = st.step === 2 ? 'g' : st.step === 3 ? 'a' : 'r';
          if (st.step === 1 && st.prog > 0.85) nsState = 'r'; if (st.step === 3 && st.prog > 0.85) ewState = 'r';
          heads.forEach(function (h) {
            var stt = h.road === 'ns' ? nsState : ewState;
            h.lamps[0].material.opacity = stt === 'r' ? 1 : dim; h.lamps[1].material.opacity = stt === 'a' ? 1 : dim; h.lamps[2].material.opacity = stt === 'g' ? 1 : dim;
            h.lamps.forEach(function (l) { l.material.transparent = true; });
          });
          cars.forEach(function (car, i) {
            var stt = car.road === 'ns' ? nsState : ewState;
            var stop = -1.6, ahead = Infinity;
            cars.forEach(function (o) { if (o !== car && o.road === car.road && o.dir === car.dir && o.s > car.s) ahead = Math.min(ahead, o.s - car.s); });
            var vmax = 1.3, want = vmax;
            if (ahead < 0.75) want = 0;
            if (stt !== 'g' && car.s < stop && car.s > stop - 0.5) want = 0;
            if (stt === 'a' && car.s >= stop - 0.08) want = vmax;
            car.v += (want - car.v) * Math.min(1, st.dt * 5);
            car.s += car.v * st.dt;
            if (car.s > stop - 0.02 && car.s < stop && want === 0) car.s = Math.min(car.s, stop - 0.02);
            if (car.s > 3.3) car.s = -3.3;
            var x, z, rot;
            if (car.road === 'ns') { x = car.lane; z = -car.dir * car.s; rot = car.dir > 0 ? Math.PI : 0; }
            else { z = car.lane; x = car.dir * car.s; rot = car.dir > 0 ? -Math.PI / 2 : Math.PI / 2; }
            car.g.position.set(x, Y + 0.1, z); car.g.rotation.y = rot;
          });
        },
        labels: {
          controller: H.v(1.6, Y + 0.85, -1.4), signal: H.v(-0.95, Y + 1.95, 0.95), red: H.v(0.95, Y + 1.95, -0.95),
          stopline: H.v(0.6, Y + 0.05, -1.5), cars: function () { return cars[3].g.position.clone().add(H.v(0, 0.4, 0)); }
        }
      };
    }
  });
})();

/* Part 4 · Getting Around — bicycle */
(function () {
  var H = HTW.H, T = window.THREE;
  HTW.define({
    id: 'bicycle', group: 'Part 4 · Getting Around', name: 'Bicycle gears', card: 'Chains, sprockets and gear ratios',
    lede: 'Your legs turn the pedals, a chain carries the turning to the back wheel, and the gears decide whether riding feels fast or easy.',
    cycle: 12,
    steps: [
      { name: 'Pedals and cranks', kid: 'Push', text: 'Your feet push the pedals round. The crank arms work like levers, turning your push into a turning force.' },
      { name: 'Chainring and chain', kid: 'Pull the chain', text: 'The big toothed chainring grips the chain and pulls it along, link by link.' },
      { name: 'Rear sprocket', kid: 'Spin faster', text: 'The chain turns a small toothed sprocket on the back wheel. Because it is smaller, the wheel turns almost three times for every turn of the pedals.' },
      { name: 'Changing gear', kid: 'Easier uphill', text: 'The derailleur moves the chain onto a bigger sprocket. Pedalling gets easier for hills, but the wheel turns fewer times for each pedal turn.' }
    ],
    facts: [['Gear ratio', 'chainring teeth ÷ sprocket teeth'], ['Example', '44 ÷ 16 = 2.75 turns']],
    parts: [
      { id: 'pedals', name: 'Pedals', text: 'Where your feet push. They spin on their own little bearings so your feet stay level.' },
      { id: 'cranks', name: 'Crank arms', text: 'Levers that join the pedals to the chainring. Longer cranks give more turning force.' },
      { id: 'chainring', name: 'Chainring', text: 'The big toothed wheel at the pedals. This one has 44 teeth.' },
      { id: 'chain', name: 'Chain', text: 'Links of steel that carry the turning from the chainring to the back wheel.' },
      { id: 'sprockets', name: 'Rear sprockets', text: 'A stack of toothed wheels on the back hub, from small (fast) to big (easy). Here 16 to 28 teeth.' },
      { id: 'derailleur', name: 'Derailleur', text: 'A spring-loaded arm that pushes the chain sideways onto a different sprocket when you change gear.' },
      { id: 'freewheel', name: 'Freewheel', text: 'A clever clutch inside the back hub. It lets the wheel keep spinning when you stop pedalling.' },
      { id: 'wheels', name: 'Wheels and tyres', text: 'Thin spokes pull the rim tight from the hub, making the wheel light but strong.' },
      { id: 'frame', name: 'Frame', text: 'Triangles of tube. Triangles cannot be squashed out of shape, so the frame is strong and light.' },
      { id: 'handlebar', name: 'Handlebar and seat', text: 'You steer with the handlebar, which turns the front fork and wheel, and sit on the saddle.' }
    ],
    camera: { pos: [0.6, 1.4, 6.8], target: [0.15, 0.3, 0] },
    readout: function (st) {
      var big = st.step === 3 && st.prog > 0.35;
      return 'Gear <strong>44 ÷ ' + (big ? '28 = 1.57' : '16 = 2.75') + '</strong> wheel turns per pedal turn';
    },
    build: function (c) {
      var s = c.scene, tag = c.tag;
      var RW = H.v(-1.35, 0, 0), FW = H.v(1.6, 0, 0), BB = H.v(0.1, -0.15, 0), ST = H.v(-0.2, 1.15, 0), HT = H.v(1.25, 1.1, 0), HB = H.v(1.32, 0.85, 0);
      function wheel(ctr) {
        var g = new T.Group();
        var tyre = H.torus(0.86, 0.06, H.matte(0x1d1f22)); g.add(tag(tyre, 'wheels'));
        var rim = H.torus(0.79, 0.02, H.metal(0xb9c2cb)); g.add(tag(rim, 'wheels'));
        for (var i = 0; i < 16; i++) { var a = i / 16 * Math.PI * 2; g.add(tag(H.between(H.v(0, 0, 0), H.v(Math.cos(a) * 0.79, Math.sin(a) * 0.79, 0), 0.006, H.metal(0xd8dde2)), 'wheels')); }
        var hub = H.cyl(0.06, 0.06, 0.16, H.metal(0x8f9aa5)); hub.rotation.x = Math.PI / 2; g.add(tag(hub, 'wheels'));
        g.position.copy(ctr); s.add(g); return g;
      }
      var rear = wheel(RW), front = wheel(FW);
      var fm = H.metal(0x2e86de);
      [[BB, ST], [ST, HT], [BB, HT], [BB, RW], [ST, RW], [HT, HB]].forEach(function (q) { s.add(tag(H.between(q[0], q[1], 0.035, fm), 'frame')); });
      s.add(tag(H.between(HB, FW, 0.03, H.metal(0x2e86de)), 'frame'));
      s.add(tag(H.between(HT, H.v(1.2, 1.45, 0), 0.03, H.metal(0x9aa4ae)), 'handlebar'));
      var bar = H.cyl(0.03, 0.03, 0.7, H.metal(0x9aa4ae), 1.2, 1.45, 0); bar.rotation.x = Math.PI / 2; s.add(tag(bar, 'handlebar'));
      s.add(tag(H.between(ST, H.v(-0.25, 1.4, 0), 0.03, H.metal(0x9aa4ae)), 'handlebar'));
      s.add(tag(H.box(0.42, 0.07, 0.16, H.matte(0x2b3138), -0.22, 1.45, 0), 'handlebar'));
      var Z = 0.12, RC = 0.32;
      var ring = new T.Group();
      var ringDisc = H.cyl(RC, RC, 0.02, H.metal(0xc0c6cc)); ringDisc.rotation.x = Math.PI / 2; ring.add(tag(ringDisc, 'chainring'));
      for (var t = 0; t < 22; t++) { var ta = t / 22 * Math.PI * 2, tooth = H.box(0.045, 0.04, 0.02, H.metal(0xc0c6cc), Math.cos(ta) * (RC + 0.015), Math.sin(ta) * (RC + 0.015), 0); tooth.rotation.z = ta; ring.add(tag(tooth, 'chainring')); }
      ring.position.set(BB.x, BB.y, Z); s.add(ring);
      var crank = new T.Group();
      crank.add(tag(H.box(0.05, 0.5, 0.03, H.metal(0x5c6670), 0, -0.25, 0.04), 'cranks'));
      crank.add(tag(H.box(0.05, 0.5, 0.03, H.metal(0x5c6670), 0, 0.25, -0.28), 'cranks'));
      var pedA = H.box(0.2, 0.04, 0.14, H.matte(0x2b3138), 0, -0.5, 0.15), pedB = H.box(0.2, 0.04, 0.14, H.matte(0x2b3138), 0, 0.5, -0.38);
      crank.add(tag(pedA, 'pedals')); crank.add(tag(pedB, 'pedals'));
      crank.position.set(BB.x, BB.y, Z); s.add(crank);
      var cogs = new T.Group(), radii = [0.12, 0.16, 0.2];
      radii.forEach(function (r, i) { var cg = H.cyl(r, r, 0.015, H.metal(0xd8b25a)); cg.rotation.x = Math.PI / 2; cg.position.z = 0.02 * (2 - i); cogs.add(tag(cg, 'sprockets')); });
      cogs.position.set(RW.x, RW.y, Z - 0.02); s.add(cogs);
      var fw = H.cyl(0.07, 0.07, 0.1, H.metal(0x3a4048), RW.x, RW.y, Z - 0.08); fw.rotation.x = Math.PI / 2; s.add(tag(fw, 'freewheel'));
      var der = new T.Group(); der.add(H.box(0.06, 0.28, 0.04, H.metal(0x3a4048), 0, -0.14, 0));
      var jw1 = H.cyl(0.04, 0.04, 0.02, H.metal(0x8f9aa5), 0, -0.08, 0.02), jw2 = H.cyl(0.04, 0.04, 0.02, H.metal(0x8f9aa5), 0, -0.26, 0.02); jw1.rotation.x = jw2.rotation.x = Math.PI / 2; der.add(jw1); der.add(jw2);
      der.position.set(RW.x + 0.02, RW.y - 0.12, Z); s.add(c.tagAll(der, 'derailleur'));
      var chainMat = H.metal(0x30353b);
      var chainMesh = null, chainCurve = null, rsNow = -1;
      function buildChain(rs) {
        if (chainMesh) { s.remove(chainMesh); chainMesh.geometry.dispose(); }
        var pts = [], i;
        for (i = 0; i <= 12; i++) { var a = Math.PI / 2 - i / 12 * Math.PI; pts.push(H.v(BB.x + Math.cos(a) * RC, BB.y + Math.sin(a) * RC, Z)); }
        pts.push(H.v(RW.x + 0.02, RW.y - 0.38, Z));
        for (i = 0; i <= 10; i++) { var b = -Math.PI / 2 - i / 10 * Math.PI; pts.push(H.v(RW.x + Math.cos(b) * rs, RW.y + Math.sin(b) * rs, Z)); }
        chainCurve = H.curve(pts, true);
        chainMesh = new T.Mesh(new T.TubeGeometry(chainCurve, 160, 0.014, 6, true), chainMat);
        s.add(chainMesh); tag(chainMesh, 'chain');
      }
      var links = H.stream(s, 46, 0xff7a33, 0.016);
      var crankA = 0, wheelA = 0, chainPos = 0;
      return {
        update: function (st) {
          var w = st.step === 0 ? 0.6 + st.prog * 1.4 : 2.0;
          var rs = st.step === 3 ? H.lerp(0.12, 0.2, H.smooth((st.prog - 0.2) / 0.3)) : 0.12;
          if (Math.abs(rs - rsNow) > 0.004) { rsNow = rs; buildChain(rs); }
          crankA -= st.dt * w; crank.rotation.z = crankA; ring.rotation.z = crankA;
          pedA.rotation.z = -crankA; pedB.rotation.z = -crankA;
          var v = w * RC; chainPos += st.dt * v;
          wheelA -= st.dt * v / rs; rear.rotation.z = wheelA; cogs.rotation.z = wheelA; front.rotation.z = wheelA;
          der.position.z = Z + (rs - 0.12) * -0.5;
          var len = chainCurve.getLength();
          links.forEach(function (m, i) { var u = (((i / links.length) - chainPos / len) % 1 + 1) % 1; m.position.copy(chainCurve.getPointAt(u)); });
        },
        labels: {
          pedals: H.v(0.1, -0.85, 0.3), cranks: H.v(0.55, -0.45, 0.3), chainring: H.v(0.35, 0.3, 0.2), chain: H.v(-0.6, 0.35, 0.2),
          sprockets: H.v(-1.35, 0.4, 0.25), derailleur: H.v(-1.0, -0.6, 0.25), freewheel: H.v(-1.75, 0.2, 0.1), wheels: H.v(1.95, -1.0, 0),
          frame: H.v(0.55, 1.35, 0), handlebar: H.v(1.55, 1.7, 0)
        }
      };
    }
  });
})();
