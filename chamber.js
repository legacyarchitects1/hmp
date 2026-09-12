/* ═══════════════════════════════════════════════════════════════════════════
   PMK — Command Chamber environment
   Built to match the wide interior shot in the reference video: an octagonal
   observation frame, deity console plinths in symmetry, inlaid light-lines
   running across the floor, a central holo table, and a Kemetic-futurist
   skyline of pyramids, spires and moons beyond the glass.

   Three.js r128. Primitives only — no textures, no loaded models, no meshes.
   Drop into 3d.html and call buildChamber(world, opts) from build(i).

   PALETTE LAW (see DESIGN.md):
     gold   #C9A24B  — physical surfaces, structure, identity
     lapis  #1B3A6B  — physical stone/cloth inlay, MATTE, never emissive
     cyan   #3FD8E8  — projected light and live data ONLY
   Gold may be lit by cyan. Gold may never BE cyan.
   ═══════════════════════════════════════════════════════════════════════════ */

var GOLD = 0xC9A24B, GOLD_L = 0xE4C173, LAPIS = 0x1B3A6B,
    CYAN = 0x3FD8E8, CYAN_HOT = 0x1AD4C9, CREAM = 0xECE7DA,
    OBSIDIAN = 0x0A0E16, VOID_C = 0x050810;

/* Physical materials — matte, non-emissive. These are STONE and CLOTH. */
function matStone(c) {
  return new THREE.MeshStandardMaterial({ color: c || 0x11161F, roughness: 0.92, metalness: 0.0 });
}
function matLapis() {
  return new THREE.MeshStandardMaterial({ color: LAPIS, roughness: 0.55, metalness: 0.0 });
}
/* Gold — real metal. High metalness, low roughness, gentle emissive so it
   catches light on a dim phone screen without blowing out. */
function matGold(emis) {
  return new THREE.MeshStandardMaterial({
    color: GOLD, emissive: GOLD, emissiveIntensity: emis === undefined ? 0.35 : emis,
    metalness: 0.95, roughness: 0.08
  });
}
/* Projected light — unlit, additive. Never use for a solid object. */
function matLight(c, op) {
  return new THREE.MeshBasicMaterial({
    color: c, transparent: true, opacity: op === undefined ? 0.85 : op,
    blending: THREE.AdditiveBlending, depthWrite: false, side: THREE.DoubleSide
  });
}

/* ── floor light-inlay ──────────────────────────────────────────────────────
   The signature element of the reference frame: thin luminous channels cut
   into dark stone, running in straight runs with right-angle turns, like
   circuit traces. Built as flat boxes laid just above the floor plane so they
   read as inlay rather than as glowing rods. */
function inlayRun(points, color, w) {
  var g = new THREE.Group(), width = w || 0.09;
  for (var i = 0; i < points.length - 1; i++) {
    var a = points[i], b = points[i + 1];
    var dx = b[0] - a[0], dz = b[1] - a[1];
    var len = Math.sqrt(dx * dx + dz * dz);
    if (len < 0.001) continue;
    var seg = new THREE.Mesh(new THREE.BoxGeometry(len, 0.02, width), matLight(color, 0.9));
    seg.position.set((a[0] + b[0]) / 2, 0.012, (a[1] + b[1]) / 2);
    seg.rotation.y = -Math.atan2(dz, dx);
    g.add(seg);
  }
  return g;
}

/* ── console plinth ────────────────────────────────────────────────────────
   A deity's station. Dark stone body, gold rim, cyan glowing top face. The
   top is LIVE DATA so cyan is correct there; the body is physical so it is
   stone and gold only. */
function plinth() {
  var g = new THREE.Group();
  var body = new THREE.Mesh(new THREE.BoxGeometry(1.5, 1.05, 1.0), matStone(0x0E141D));
  body.position.y = 0.52; body.castShadow = true; body.receiveShadow = true; g.add(body);

  /* Lapis inlay panel on the face, banded by two gold fillets — the same
     stone-and-metal treatment the reference uses on the nemes and wesekh.
     Lapis is matte and non-emissive: it is a physical surface, so under the
     palette law it may be LIT by the cyan console above it but never glow. */
  var inlay = new THREE.Mesh(new THREE.BoxGeometry(1.02, 0.46, 0.02), matLapis());
  inlay.position.set(0, 0.6, 0.51); g.add(inlay);
  [0.85, 0.35].forEach(function (y) {
    var fillet = new THREE.Mesh(new THREE.BoxGeometry(1.1, 0.045, 0.03), matGold(0.28));
    fillet.position.set(0, y, 0.515); g.add(fillet);
  });

  /* slanted console top, angled toward the user like a lectern */
  var top = new THREE.Mesh(new THREE.BoxGeometry(1.55, 0.07, 1.05), matStone(0x151C27));
  top.position.set(0, 1.1, -0.06); top.rotation.x = -0.22; g.add(top);

  /* the lit screen surface itself */
  var screen = new THREE.Mesh(new THREE.PlaneGeometry(1.32, 0.84), matLight(CYAN, 0.42));
  screen.position.set(0, 1.15, -0.05); screen.rotation.x = -Math.PI / 2 - 0.22; g.add(screen);

  /* concentric rings on the screen — the "active console" read */
  for (var r = 0; r < 3; r++) {
    var ring = new THREE.Mesh(
      new THREE.RingGeometry(0.10 + r * 0.10, 0.12 + r * 0.10, 28),
      matLight(CYAN_HOT, 0.55 - r * 0.13));
    ring.position.set(0, 1.16, -0.05); ring.rotation.x = -Math.PI / 2 - 0.22;
    ring.userData.spin = (r % 2 ? 1 : -1) * (0.25 + r * 0.1);
    g.add(ring);
  }

  /* gold rim around the base — physical trim */
  var rim = new THREE.Mesh(new THREE.BoxGeometry(1.62, 0.06, 1.12), matGold(0.3));
  rim.position.y = 0.04; g.add(rim);

  /* NO per-plinth PointLight. Eight of them pushed this tier to 19 dynamic
     lights, which is the single most likely cause of frame-rate collapse on a
     phone — well ahead of object count. The console reads as lit anyway: the
     screen plane and its rings are AdditiveBlending MeshBasicMaterial, which
     is unlit by definition and glows without costing a light slot. If a real
     pool of light on the floor is wanted later, add ONE shared light at the
     ring centre, not one per station. */
  return g;
}

/* ── central holo table ────────────────────────────────────────────────────
   The node-graph table from the closing shot: a stone pedestal with a
   projected network of points and connecting lines floating above it. */
function holoTable() {
  var g = new THREE.Group();

  var base = new THREE.Mesh(new THREE.CylinderGeometry(1.15, 1.45, 0.9, 8), matStone(0x0D131C));
  base.position.y = 0.45; base.castShadow = true; g.add(base);

  var lip = new THREE.Mesh(new THREE.CylinderGeometry(1.22, 1.22, 0.07, 8), matGold(0.32));
  lip.position.y = 0.92; g.add(lip);

  /* projected surface */
  var surf = new THREE.Mesh(new THREE.CircleGeometry(1.1, 8), matLight(CYAN, 0.3));
  surf.position.y = 0.96; surf.rotation.x = -Math.PI / 2; g.add(surf);

  /* node graph — points plus the lines between near neighbours */
  var nodes = [], NODE_N = 16;
  for (var i = 0; i < NODE_N; i++) {
    var a = (i / NODE_N) * Math.PI * 2 + Math.random() * 0.3;
    var rad = 0.25 + Math.random() * 0.78;
    nodes.push(new THREE.Vector3(Math.cos(a) * rad, 1.0 + Math.random() * 0.34, Math.sin(a) * rad));
  }
  var linePts = [];
  for (var i = 0; i < nodes.length; i++) {
    for (var j = i + 1; j < nodes.length; j++) {
      if (nodes[i].distanceTo(nodes[j]) < 0.72) { linePts.push(nodes[i].clone(), nodes[j].clone()); }
    }
  }
  var lg = new THREE.BufferGeometry().setFromPoints(linePts);
  var lines = new THREE.LineSegments(lg, new THREE.LineBasicMaterial({
    color: CYAN, transparent: true, opacity: 0.55, blending: THREE.AdditiveBlending, depthWrite: false
  }));
  g.add(lines);

  var pg = new THREE.BufferGeometry().setFromPoints(nodes);
  g.add(new THREE.Points(pg, new THREE.PointsMaterial({
    color: CYAN_HOT, size: 0.075, transparent: true, opacity: 0.95,
    blending: THREE.AdditiveBlending, depthWrite: false, sizeAttenuation: true
  })));

  /* the bright core the reference shows at table centre */
  var core = new THREE.Mesh(new THREE.SphereGeometry(0.1, 14, 10), matLight(CREAM, 0.95));
  core.position.y = 1.05; g.add(core);
  var cl = new THREE.PointLight(CYAN, 2.6, 7); cl.position.y = 1.2; g.add(cl);

  g.userData.spinGroup = lines;
  return g;
}

/* ── octagonal observation frame ───────────────────────────────────────────
   The chamber's window onto the skyline. Eight struts forming a ring, with
   a cyan light channel inset along the inner edge. */
function octFrame(radius, depth) {
  var g = new THREE.Group(), N = 8;
  for (var i = 0; i < N; i++) {
    var a = (i / N) * Math.PI * 2 + Math.PI / N;
    var side = 2 * radius * Math.tan(Math.PI / N);

    var strut = new THREE.Mesh(new THREE.BoxGeometry(side, 1.1, depth), matStone(0x0C1119));
    strut.position.set(Math.cos(a) * radius, 0, Math.sin(a) * radius);
    strut.rotation.y = -a + Math.PI / 2;
    g.add(strut);

    var glow = new THREE.Mesh(new THREE.BoxGeometry(side * 0.82, 0.1, 0.06), matLight(CYAN, 0.8));
    glow.position.set(Math.cos(a) * (radius - depth / 2 - 0.04), -0.3, Math.sin(a) * (radius - depth / 2 - 0.04));
    glow.rotation.y = -a + Math.PI / 2;
    g.add(glow);
  }
  return g;
}

/* ── skyline beyond the glass ──────────────────────────────────────────────
   Pyramids and spires, deliberately low-detail: they sit far back in fog and
   exist to give the third depth plane DESIGN.md requires. Cheap by design. */
function skyline(count) {
  var g = new THREE.Group();
  var spireMat = matStone(0x121A26), pyrMat = matStone(0x161E2A);

  for (var i = 0; i < count; i++) {
    var a = Math.random() * Math.PI * 2;
    var d = 46 + Math.random() * 78;
    var x = Math.cos(a) * d, z = Math.sin(a) * d;

    if (Math.random() < 0.26) {
      /* pyramid — 4-sided cone is exactly a pyramid */
      var s = 7 + Math.random() * 16;
      var p = new THREE.Mesh(new THREE.ConeGeometry(s, s * 0.82, 4), pyrMat);
      p.position.set(x, s * 0.41, z); p.rotation.y = Math.PI / 4;
      g.add(p);
    } else {
      /* spire — tapered tower with a lit crown */
      var h = 16 + Math.random() * 52;
      var t = new THREE.Mesh(new THREE.CylinderGeometry(0.7 + Math.random(), 2.2 + Math.random() * 2, h, 6), spireMat);
      t.position.set(x, h / 2, z);
      g.add(t);
      if (Math.random() < 0.55) {
        var crown = new THREE.Mesh(new THREE.SphereGeometry(0.5, 8, 6),
          matLight(Math.random() < 0.5 ? CYAN : GOLD_L, 0.9));
        crown.position.set(x, h + 0.5, z);
        g.add(crown);
      }
    }
  }
  return g;
}

/* ── moons ─────────────────────────────────────────────────────────────────
   Two large bodies low on the horizon, as in the reference. Lit, not emissive
   — they are physical objects catching the same key light as everything else. */
function moons() {
  var g = new THREE.Group();
  var m1 = new THREE.Mesh(new THREE.SphereGeometry(15, 24, 18),
    new THREE.MeshStandardMaterial({ color: 0x8892A6, roughness: 1.0, metalness: 0.0 }));
  m1.position.set(-95, 34, -140); g.add(m1);
  var m2 = new THREE.Mesh(new THREE.SphereGeometry(8, 20, 14),
    new THREE.MeshStandardMaterial({ color: 0x6E7A90, roughness: 1.0, metalness: 0.0 }));
  m2.position.set(84, 22, -155); g.add(m2);
  return g;
}

/* ── assembly ──────────────────────────────────────────────────────────────
   opts.stations  how many deity plinths in the ring (default 8)
   opts.mobile    true → reduce skyline count and plinth ring detail
   Returns the group, with userData.anim holding everything the frame loop
   needs to animate. Add the returned group to a tier world.            */
function buildChamber(opts) {
  opts = opts || {};
  var stations = opts.stations || 8;
  var mobile = !!opts.mobile;
  var g = new THREE.Group();

  /* floor */
  var floor = new THREE.Mesh(new THREE.CircleGeometry(17, 8), matStone(0x090D14));
  floor.rotation.x = -Math.PI / 2; floor.receiveShadow = true; g.add(floor);

  /* inlay: a spoke from centre to each station, with a right-angle jog, plus
     a gold ring at the perimeter. Cyan spokes are data paths; the gold ring is
     structure. That split is the palette law made literal. */
  for (var i = 0; i < stations; i++) {
    var a = (i / stations) * Math.PI * 2;
    var mx = Math.cos(a) * 5.4, mz = Math.sin(a) * 5.4;
    var ex = Math.cos(a) * 10.6, ez = Math.sin(a) * 10.6;
    var jx = Math.cos(a) * 7.6 + Math.cos(a + Math.PI / 2) * 1.5;
    var jz = Math.sin(a) * 7.6 + Math.sin(a + Math.PI / 2) * 1.5;
    g.add(inlayRun([[Math.cos(a) * 1.6, Math.sin(a) * 1.6], [mx, mz], [jx, jz], [ex, ez]], CYAN, 0.085));
  }
  var goldRing = new THREE.Mesh(new THREE.TorusGeometry(12.4, 0.055, 6, 64), matGold(0.55));
  goldRing.rotation.x = -Math.PI / 2; goldRing.position.y = 0.015; g.add(goldRing);

  /* stations */
  var plinths = [];
  for (var i = 0; i < stations; i++) {
    var a = (i / stations) * Math.PI * 2;
    var p = plinth();
    p.position.set(Math.cos(a) * 8.6, 0, Math.sin(a) * 8.6);
    p.rotation.y = -a + Math.PI / 2;
    plinths.push(p); g.add(p);
  }

  /* centre */
  var table = holoTable(); g.add(table);

  /* frame, skyline, moons */
  var frame = octFrame(15.5, 1.1); frame.position.y = 3.4; g.add(frame);
  g.add(skyline(mobile ? 26 : 58));
  g.add(moons());

  /* lighting — warm gold key raking from high, cool cyan fill opposite.
     This two-source split is the single biggest reason a render reads as
     photographed rather than flat. Ambient stays near-black so blacks crush.

     Light budget: this adds exactly 3 dynamic lights (key, fill, table core).
     An earlier revision added 11 by giving every plinth its own PointLight,
     which on tier 4 — already running 8 — meant 19 live lights plus a new
     shadow caster. Each additional light multiplies per-fragment cost on
     mobile GPUs, so that was the real frame-rate risk, not the object count. */
  var key = new THREE.DirectionalLight(GOLD_L, 0.95);
  key.position.set(14, 26, 10);
  /* Shadow maps are the other expensive thing here. Desktop only. */
  key.castShadow = !mobile;
  g.add(key);
  var fill = new THREE.DirectionalLight(CYAN, 0.4);
  fill.position.set(-16, 9, -12); g.add(fill);

  g.userData.anim = { plinths: plinths, table: table, ring: goldRing };
  return g;
}

/* ── per-frame animation ───────────────────────────────────────────────────
   Call from the existing loop(): animateChamber(chamber, clockSeconds) */
function animateChamber(chamber, t) {
  if (!chamber || !chamber.userData.anim) return;
  var A = chamber.userData.anim;
  for (var i = 0; i < A.plinths.length; i++) {
    var ch = A.plinths[i].children;
    for (var j = 0; j < ch.length; j++) {
      if (ch[j].userData && ch[j].userData.spin) ch[j].rotation.z = t * ch[j].userData.spin;
    }
  }
  if (A.table && A.table.userData.spinGroup) A.table.userData.spinGroup.rotation.y = t * 0.16;
}
