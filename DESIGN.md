# DESIGN.md — Hannibal Mansa Phalanx / The Legacy Blueprint

House visual law. Any agent generating UI, 3D, or images for this platform reads this
file first and treats it as binding. Values here were read off shipped artifacts
(the 401 curriculum covers, the live Shopify product art, and `3d.html`), not invented.

Operator: Damon Taylor · Philadelphia
Footer line, required on every printed/exported surface:
`HANNIBAL MANSA PHALANX · THE LEGACY BLUEPRINT · 267-633-5716`

---

## 1. Palette

| Token | Hex | Use |
|---|---|---|
| `obsidian` | `#0A0E16` | Primary ground |
| `obsidian-deep` | `#0A1428` | Gradient partner, depth |
| `void` | `#050810` | 3D scene clear color, deepest recess |
| `gold` | `#C9A24B` | Primary identity metal |
| `gold-light` | `#E4C173` | Highlight, headline, rim light |
| `lapis` | `#1B3A6B` | Regalia and stone/cloth inlay. **Matte, never emissive.** |
| `bronze` | `#B8860B` | Redemption-track accent |
| `brass` | `#A67C3D` | Tertiary metal, avatar variety |
| `cream` | `#ECE7DA` | Body text, paper, negative space |
| `teal` | `#29A99E` | Projected light, live data |
| `teal-deep` | `#0F6B63` | Teal in shadow |
| `cyan` | `#3FD8E8` | Accent, holographic edge |
| `cyan-hot` | `#1AD4C9` | Emissive data points, particles |

### Palette law (non-negotiable)

**Gold lives on physical surfaces and identity elements. Cyan/teal lives only on
projected light and live data. Never both on one surface.**

Concretely:
- Carved stone, metal, fabric, printed paper, a seal, a crest, a person's name → **gold**
- A hologram, a readout, a beam, a particle field, a number that updates → **cyan/teal**
- A gold monolith may be *lit by* cyan light. A gold monolith may not *be* cyan.

Known violation, do not copy: the 130 Foundation-track covers use `#00ccff` as the
accent on the cover identity itself. That predates this file and is a bug, not a precedent.

### Track accents
- Foundation → `#00ccff` *(legacy; should migrate to gold under the palette law)*
- Redemption → `#b8860b`
- Ascendant → `#d4a017`

---

## 2. Typography

- **Print / covers:** Arial (or nearest grotesque). Pillar name 72pt bold in gold,
  lesson title 26–36pt cream at 90% opacity, auto-scaled down past 45 and 60 characters.
- **Interface / 3D:** Georgia, serif. Monospace only for numeric readouts (`☥` counts, IDs).
- Letter-spacing 4 on small uppercase tier labels.
- Never center long body copy. Center only single-line labels and badges.

---

## 3. Geometry & motif

The visual system is Kemetic/Nubian, not generic fantasy:
- **Hexagon** — the core badge shape. Nested hex (outer stroke, inner gradient fill,
  center circle with a void pupil) is the canonical cover mark.
- **Flower of life** — lattice fills, floor inlay, interior of solid forms.
- **Ankh (☥)** — currency and ascension glyph. Never decorative filler.
- **Shield row / phalanx rank** — repetition of a unit in a line, used for apparel and
  for anything meaning "formation" or "many as one."
- **War elephant in caparison** — the Legacy Blueprint crest. High-value, sparing use.
- Corner ornaments: small elongated hexagons at all four frame corners, 0.6 opacity.

---

## 4. Render law (3D and generated imagery)

This section exists so generated art stops looking flat and generic.

**Ground:** deep obsidian black. Never mid-grey, never a studio white cyc.

**Light:** one dominant warm gold key at a steep raking angle, plus a cool teal/cyan
rim or bounce from the opposite side. Dramatic falloff. Ambient stays near-black
(`#08101C` at ~0.5) so blacks crush and metal reads as metal. This two-source
warm-key/cool-rim split is the single biggest reason an image reads as photographed
rather than diffused-flat.

**Material:** gold is high-metalness (0.95), low-roughness (0.05–0.32), emissive at
low intensity so it glows without blowing out. Stone is roughness 0.85–0.94, no
metalness. Never plastic. Never chrome.

**Camera:** ACES filmic tone mapping, exposure ~1.32. Vertical framing for covers
(1200×1600). Slight low angle for anything meant to read as monumental.

**Depth:** always three planes — a lit subject, a mid-ground ground plane, and a
fogged/starred recess behind. Exponential fog, density 0.007–0.038 by scene depth.
Flat images are flat because they have one plane.

### Negative constraints (append to every image prompt)
`no text, no lettering, no numbers, no charts, no graphs, no infographic elements,
no watermark, no people facing camera, no studio white background, no flat even
lighting, no plastic or chrome material`

---

## 5. Tone

- **Community-facing** (re-entry, credit, curriculum): dignified, plain English,
  resource-first. "Returning citizen," never stigmatizing language. No promises of
  a job, a release, or a specific outcome. Every public re-entry funnel carries a
  988/211 crisis line.
- **B2B:** confident, proof-backed, specific.
- Never fabricate a statistic, a count, or a figure on anything customer-facing.
  Three offense-stat charts were blocked for exactly this.

---

## 6. Scene vocabulary (the five tiers)

| Tier | Name | Ground | Tint | Feel |
|---|---|---|---|---|
| 0 | Mariana Trench | `#060B14` | `#1AD4C9` | Pressure, dark water, bioluminescence |
| 1 | Global Megaliths | `#0A1119` | `#C9A24B` | Carved stone, dense starfield |
| 2 | Philly Grid | `#0A121C` | `#E4C173` | Street level, sodium light, real |
| 3 | Solar Crown | `#03040C` | `#ECE7DA` | Orbit, thin atmosphere, 1800 stars |
| 4 | Sovereign Apex | `#071620` | `#29A99E` | Ownership, glass, altitude |

---

## 7. How to use this file

**With a coding agent:** keep `DESIGN.md` at project root and name it in the request —
"read DESIGN.md and apply it." Agents do not read it just because it exists.

**With img2threejs:** the palette and material rules above are what keep a rebuilt
object on-brand. Feed it one object, plain background, even light, whole object in
frame. If it returns BLOCKED, the image was insufficient — that is the correct answer,
not a failure to route around.

**With an image model:** compose the prompt as
`[subject] + [section 4 render law] + [section 3 motif] + [negative constraints]`.
Do not hand-write house style per prompt; it drifts.

**What this file does not license:** copying another brand's identity. Structure and
system may be borrowed from reference DESIGN.md files. Colors and marks may not.
