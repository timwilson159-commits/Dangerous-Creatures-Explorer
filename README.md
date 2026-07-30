# Dangerous Marine Creatures — An Upgrade Game

A single-file browser game for junior secondary students (Years 7–9) about staying safe
around dangerous Australian marine life. You play a rookie Marine Ranger patrolling the
coast: spot creatures, make the right call under time pressure, bank Safety Points, and
upgrade your boat and your knowledge so you can patrol further.

**No dependencies, no build step, no server.** Everything lives in `index.html`.

## Playing it

Open `index.html` in any modern browser, or visit the GitHub Pages URL.

- **WASD / arrow keys** — steer the boat
- Sail into a creature to trigger an encounter
- A species you've never identified shows only as a **`?` contact** — no sprite, no name, no danger ring
- **Never seen it before?** Identify it first through a habitat-specific minigame. Fail and it slips away
- **First meeting is free** — no clock and no penalty for a wrong call. That's *why* an unknown carries no danger ring: there's nothing to warn you about yet
- **But a wrong first call means it stays undiscovered** — you only truly learn a species by identifying it *and* handling it correctly. Fail the discovery question and it drops back to a `?` contact, so you re-identify it and get another go, now knowing the answer
- **Already know it?** 10 seconds to make the call, the danger ring is showing, and a mistake costs 30–62% condition
- The coast is **one connected map**: Region 1 at the shore, later regions stacked further along it. A single patrol can sail through every region you've unlocked — how far you reach is limited by **fuel**, so tank/motor upgrades literally buy you range
- **Each region has its own ⚓ marina.** Dock at *any* of them to bank your points — run out of fuel and you get towed in for 60%. The marina you dock at becomes your **berth**: your next patrol launches from there, so progress along the coast sticks
- The **Fast-Travel Pass** (a one-off Safety-Points buy) lets you move your berth to any marina you've reached right from the Station, so you don't have to re-sail the whole coast
- Creatures keep **turning up as you patrol** — clear one and another appears elsewhere, so a longer run means more encounters and better odds of finding the species you're still after
- Spend Safety Points at the Ranger Station on **Equipment** and **Knowledge**. Equipment stays affordable — it's what extends your reach — but **Knowledge ramps steeply**, priced so the powerful upgrades can't be farmed in one region and pull you onward instead

### The identification minigames

An unknown creature has to be identified before you're allowed to act on it. Which game you
get is chosen by **habitat**, deliberately never by temperament — giving aggressors one game
and retaliators another would tell the player the answer before they'd earned it.

| Habitat | Game | Controls | Teaches |
|---|---|---|---|
| Rock pool | **Steady Hands** | Mouse or WASD | Approach still animals slowly |
| Sand flat | **Clear the Silt** | Mouse or WASD | Camouflaged animals are there whether you see them or not |
| Open water | **Sonar Lock** | Space | Detection at distance |

A species' `pace` drives how hard it is to identify: in Steady Hands it wanders faster and
jinks harder, on sonar the contact drifts around the dial, and on a sand flat a restless
animal stirs the silt back up quicker.

Marine Identification widens the tolerances in all three rather than revealing names —
knowledge makes you better at looking, not psychic. Each game freezes on a **Ready?** screen
until you press a key, so reading the instructions never costs you the encounter.

Progress auto-saves to the browser (`localStorage`, key `dmc_save_v1`).

## Building a self-contained file for hosting

`index.html` is the **working source**: it loads sprites from the `sprites/` folder (and, later,
audio from `audio/`). To get a single file you can host on its own, run:

```
node bake.js
```

This inlines every sprite as a data: URI and writes **`dist/index.html`** — one self-contained file
(~26 MB) that needs no other assets. Re-run it whenever the game or the sprites change. The loader
prefers the baked-in `SPRITE_DATA` and falls back to the `sprites/` folder, so both the source and the
baked file work. (Sprite art is the weight — 512-px raster-in-SVG; downscaling the source sprites is
the lever if the file needs to be smaller.)

## Hosting on GitHub Pages

Push to a repo and enable Pages (Settings → Pages → deploy from branch, root).
Serve either the working `index.html` (with its `sprites/` folder) **or** the self-contained
`dist/index.html`. `.nojekyll` stops Jekyll from processing the files.

Because Pages runs on **Linux, which is case-sensitive**, all filenames in this project are
lowercase-kebab with no spaces. `Cards/Blue-Ring.png` and `cards/blue-ring.png` are different
files there even though Windows treats them as the same.

## Build status

| Stage | Scope | Status |
|-------|-------|--------|
| 1 | Vertical slice — Region 1, 8 species, core loop, shop, auto-save | **done** |
| 1.5 | Playtest pass — identification minigames, known/unknown timers, harsher injuries, drawn boat | **done** |
| 2a | Random events — 7 events shift spawns, danger, detection, fuel, points | **done** |
| 2c | Creature cards — diminishing repeat points, unlock jackpot, badge case + collection screen | **done** |
| 2d | Sprite loader — drop `sprites/<id>.svg`/`.png`, auto-used everywhere, emoji fallback | **done** |
| 2e | Region unlocking — 5 regions, cards+toll gate, station panel + `save.region` | **done** |
| 2f | Upgrade restructure — region-gated tiers (2 gear / 1 knowledge per region), steep costs | **done** |
| 2b | Region 2 (The Shallows, 7 species) + save codes | **done** |
| 2h | Connected coast — stacked regions on one map, per-region marinas, dock-anywhere, Fast-Travel Pass, steep Knowledge economy | **done** |
| 2g | Region 3 (The Reef, 7 species) + berth persistence + steady respawn | **done** |
| 2i | Regions 4 & 5 (Open Ocean, Tropical North) — **all 36 species across 5 regions** | **done** |
| 2j | Open-water map — one winding channel meandering through the region centres | **done** |
| 2k | Playtest pass — guaranteed spawns, points/toll rebalance, HUD points, prominent Fast-Travel | **done** |
| 3 | Full balance + polish pass across all regions | economy balance **done** (R5 toll + Knowledge curve); playtest-feel tuning pending |
| 4 | Challenge system | **dropped** — collecting all species cards (2c) + the Master Ranger exam (Batch 15) already serve as the game's challenge/goal |
| 5 | Polish, humour, sound, accessibility, accuracy pass | to do |

## Random events

Every patrol rolls one event (from `EVENTS` in `index.html`), announced by a banner and a
persistent HUD chip. Events are the main source of run-to-run variety: they bias which
creatures spawn and how many, and shift detection, fuel burn, danger, timers and points.

| Event | What it does |
|---|---|
| ☀️ Calm Seas | Easy breeze, slightly better fuel economy |
| 🔵 Bluebottle Bloom | The water fills with bluebottles |
| 🌀 Storm Front | More damage, less time, thirstier engine, worse visibility — but more points |
| 🌫️ Murky Water | Detection halved and IDs harder, so points are boosted to compensate |
| 🐚 Low Tide | Rock-pool species everywhere |
| 🏖️ Tourist Season | Crowded and chaotic — more encounters and points, less time |
| 🌊 Strong Currents | Fuel drains fast; watch your range |

### Adding an event

Add an object to `EVENTS`. Every system reads modifiers through the `ev()` accessor, so an
event never needs new code — just data:

```js
{ id:'kingtide', name:'King Tide', ico:'🌊', weight:3,
  desc:'One-line description shown in the launch banner.',
  tint:'rgba(30,80,120,0.14)',   // optional screen wash
  particle:'flow',               // optional: 'rain' | 'haze' | 'flow'
  fx:{                           // all keys optional, default to no effect
    densityMul:1.2,              // more/fewer creatures
    speciesBoost:{ bluebottle:7 },  // bias the spawn table by species id
    zoneBoost:{ rockpool:2.6 },     // ...or by habitat
    detectMul:0.55,  fuelMul:1.45,  dmgMul:1.4,
    pointsMul:1.3,   timerMul:0.7,  idPenalty:1
  } }
```

`weight` sets how often it's rolled relative to the others. **Check the `ico` renders** — the
boot-time `auditEmoji()` now covers event icons too and warns in the console.

## Adding a creature

The game is data-driven — adding a species means adding one object to the `SPECIES`
array in `index.html`, not writing new code. Everything (spawning, encounters, the
minimap, danger colours, card progress) reads from that object.

```js
{
  id:'kebab-case-id',            // also the card art filename
  name:'Display Name',
  sprite:{kind:'emoji', char:'🐙', size:26},   // or {kind:'draw', fn:'...'}
  zone:'rockpool',               // rockpool | sandflat | open — also picks the ID minigame
  rarity:'common',               // common | uncommon | rare
  danger:5,                      // 1–5, drives points and warning-ring colour
  pace:4,                        // 1–10, how hard it is to track in the ID minigames
  region:1,
  venom:'Venomous',              // Venomous | Poisonous | Neither
  temperament:'Retaliator',      // Aggressor | Retaliator | Harmless
  intro:'The situation the ranger arrives on.',
  actions:[                      // exactly one must have correct:true
    {icon:'🚫', label:'The right call', correct:true, fb:'Why it was right.'},
    {icon:'🤳', label:'A tempting wrong call', dmg:5, fb:'Why it was wrong.'}
  ],
  firstAid:'What to do if someone is hurt.',
  fact:'A hook for the Ranger\'s notebook.'
}
```

### The `pace` scale (1–10)

How fast and erratically the animal moves, which sets identification difficulty. Region 1 is
deliberately slow so there's headroom for later regions — keep the scale honest rather than
re-centring it per region.

| Pace | Meaning | Examples |
|---|---|---|
| 1 | Effectively motionless | Stonefish, cone snail, sea urchin |
| 2–3 | Drifts or wriggles | Bluebottle, bristleworm, stingray |
| 4–5 | Moves deliberately | Blue-ringed octopus, Port Jackson shark |
| 6–7 | Actively swimming | *(reserved: reef sharks, barracuda)* |
| 8–10 | Fast and erratic | *(reserved: mako, bull shark)* |

### ⚠️ Two rules when adding content

**1. Check your emoji.** Windows 10's emoji font is missing several newer glyphs — they
render as an empty box (tofu). School machines are the target platform, so this matters.
Known-broken: 🪼 🪱 🪨 🩴 🛟 🪸 🦭 🪝 🪧 🫧 🪳

`auditEmoji()` runs on boot and logs any unsupported emoji to the console — **check the
console after adding a species.** If a creature has no safe emoji, draw it instead: add a
function to `DRAWERS` and use `sprite:{kind:'draw', fn:'yourFn'}`. The bluebottle,
bristleworm, stonefish, stingray and sea urchin are all drawn this way, and hand-drawn
sprites look more accurate than an approximate emoji anyway.

**2. First aid must be correct.** This is a teaching resource, so advice is written to
match current Australian guidance (Surf Life Saving Australia / Australian Resuscitation
Council). Note the distinctions the game deliberately teaches — hot water for bluebottle,
stonefish, stingray and urchin; vinegar only for tropical stingers; pressure immobilisation
for blue-ringed octopus and cone snail. Don't guess; check before you write.

## The connected coast (regions)

The sea is **one open, winding channel** rather than a straight column or connected boxes. Its
centreline (`centerline(y)`) smoothly follows the region centres down the coast (the centres
zig-zag left/right by `REGION_SPREAD`), and the navigable water is everything within
`CHANNEL_HALF` of that centreline — so the channel meanders, and you weave down it. Region 1 is
at the shore (bottom); depth increases upward. Movement is slide-collision against `inWater(x,y)`
(inside the channel, between the shore and the deep edge of the highest unlocked region — that
edge is the wall). `drawWorld` clips each region's themed water to the channel and strokes a
sandy shoreline. Geometry is built for all five regions up front (`SLAB_H`, `SHORE_H`,
`REGION_SPREAD`, `CHANNEL_HALF`, `regionTop/Bottom/MidY`, `regionCX`, `centerline`,
`channelLeft/Right`, `regionBands`); **unlocking just extends the channel**. See the *World
layout* block in `index.html`. Tuning: `CHANNEL_HALF` (how open), `REGION_SPREAD` (how much it
snakes).

Each region **re-skins the same three habitat bands** (`regionBands(n)` → rockpool / sandflat /
open), so the three ID minigames keep working unchanged — a region just changes the water
colour, the "still-habitat" shelf and the floor tints via its `theme` in the `REGIONS` array:

```js
{ n:2, name:'The Shallows', sub:'…', toll:400,
  theme:{ water:['#06342c','#0d5f4e','#1f9e7a'],  // gradient stops, deep→shoreward
          shelf:'rgba(38,96,62,.40)',              // the seagrass/rock/coral shelf
          rockA:'…', rockB:'…',                    // two floor-clutter tints
          shelfName:'SEAGRASS BEDS' } }
```

**Marinas & fast travel.** `MARINAS` holds one marina per region (at its shoreward edge). A
patrol launches from Region 1's by default and can dock at *any* unlocked marina to bank. The
**Fast-Travel Pass** (`save.up.ferry`, a one-off `FERRY_COST` buy, gated to region 2+) turns
the Station's region panel into a launch-marina picker — `save.patrolRegion` is then the marina
`newRun()` starts you at.

**Points scale by region.** `regionMult(n)` (R1 ×1.0 → R5 ×3.4) multiplies points by the
*creature's* region, so exploring deeper pays more and fast-travel doesn't cheat the bonus.

**Adding a region's content (Stage 2g)** is pure data: give its `REGIONS` entry a `theme`
(already stubbed for 3–5) and add its species with the matching `region:` number. A region
with zero species is skipped by spawning and can't be unlocked past (`nocontent` guard), so
half-built regions can't strand the player. Keep `pace` honest to the shared 1–10 scale —
Region 2 sits at 1–5, with 6–10 reserved for the fast open-ocean animals.

### Upgrade economy

Equipment and Knowledge ramp on **different curves** so they pull in different directions:

- **Equipment** (`REGION_COST_MULT` = 3.4) stays reachable — fuel, motor, sonar and hull are
  the *exploration enablers*, and you're meant to farm a region to afford the gear that reaches
  the next one.
- **Knowledge** (`KNOWLEDGE_COST_MULT` = 5, set per-upgrade via `rmult`) ramps far harder: a
  region-N knowledge level is priced above what farming region N can realistically yield (L2
  ~1,100–1,300), so the powerful upgrades are earned with the fatter points of regions further
  along — but L3 (~5,500–6,500) stays a reachable late-game aspiration rather than more than a
  full playthrough's income. Raise/lower `KNOWLEDGE_COST_MULT` to move that wall.

## Save codes

The Ranger Station has a **🔐 Save Code** panel that exports the whole `save` object as a
portable base64 string (`encodeSave`) and re-imports it (`decodeSave` → `mergeSave`), so
progress can be backed up or carried between machines. Import runs through the same
`mergeSave` as `loadSave`, so an older code still gains any fields added later, and
`patrolRegion` is repaired if it points past the highest unlocked region.

## Creature cards

Handling a species correctly **5 times** (`CFG.cardAt`) earns its trading card, with a
one-off banked jackpot of 150–270 Safety Points shown in a celebration popup mid-run.

- **Diminishing repeats:** each correct handling of a species you already know pays less
  (`CFG.repeatDecay` per prior correct handling), floored at 30% (`CFG.repeatFloor`) so
  repetition still reinforces learning but can't be farmed. Keyed off *correct* handlings,
  so failing never devalues a species.
- **Badge case:** the Ranger Station shows every species as a slot — earned ones lit,
  the rest a dotted outline — so what's left to collect is always visible.
- **Collection screen:** the full binder (Open Collection), with a progress bar and each
  card's `n/5` progress. Carded species open a full card (habitat, danger rating,
  venomous/poisonous, aggressor/retaliator, fact, first aid); locked ones show only their
  progress and leak nothing about the species.

Card art is dropped in later as image files — no code change needed:

```
cards/<species-id>.png      e.g. cards/blue-ringed-octopus.png
```

Until an image exists the game falls back to the in-game sprite (the `<img>` reveals only on
a successful load, so a missing file never shows a broken-image icon). See `cards/README.md`.
