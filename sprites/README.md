# Creature sprites

Drop a sprite here and that creature uses it automatically — on the sea, in the
encounter/minigame panels, and as its card art placeholder. Missing files fall back to the
current emoji / hand-drawn sprite, so you can add them one at a time.

The game tries **`sprites/<id>.svg` first, then `sprites/<id>.png`**. Use whichever suits your
tool (AI generators produce PNG; vector tools produce SVG).

## File specs

| Parameter | SVG | PNG |
|---|---|---|
| Canvas | `viewBox="0 0 128 128"` **and** explicit `width="128" height="128"` on the root `<svg>` | 512×512 square |
| Background | Transparent (no bg rect) | Transparent (alpha) |
| Framing | Whole animal centered, ~10% margin | Same |
| Orientation | **Side profile, facing right** — keep consistent across all so the set reads as one | Same |
| Style | Bold, flat, high-contrast; exaggerate the identifying feature; readable at ~30 px | Same |
| Self-contained | No external fonts/images; text→paths | n/a |
| Size | < ~30 KB | < ~200 KB |
| Filename | lowercase-kebab, **exactly** the `id` below | same |

⚠️ **Filenames are case-sensitive on GitHub Pages (Linux).** `blue-ringed-octopus.png` works;
`Blue-Ringed-Octopus.png` will 404 even though it's fine on Windows.

⚠️ **SVG needs `width` and `height` on the root tag**, not just `viewBox`, or it won't draw onto
the game canvas.

## Sprite status (36 species across 5 regions)

**Regions 1–3 delivered & installed (22 sprites).** Regions 4–5 still to make (14 sprites).
All installed as raster-in-SVG with `viewBox` + explicit `width`/`height`, transparent bg.

## ✅ Region 1 — Beach & Rock Pools (8/8 done)

| Filename (`id`) | Creature | Key identifying features to include | Habitat · Danger |
|---|---|---|---|
| `port-jackson-shark` | Port Jackson Shark | Blunt, rounded pig-like snout with heavy ridges over the eyes; sandy grey-brown; bold dark-brown **"harness" bands** from the eyes over the head and down the sides; two dorsal fins each with a front spine; small, stocky, docile | Rock pool · 1 |
| `bluebottle` | Bluebottle | Translucent **blue gas-filled float** with a wavy crest on top; one long blue stinging tentacle trailing below; violet-blue. (A floating colony, not a fish) | Open water · 2 |
| `blue-ringed-octopus` | Blue-ringed Octopus | Small (golf-ball) octopus; drab beige/tan body and arms covered in vivid glowing **electric-blue rings** — the rings are the whole point | Rock pool · 5 |
| `stonefish` | Stonefish | Lumpy, warty, mottled brown/grey fish that looks like an **algae-crusted rock**; upturned scowling mouth; 13 venomous spines along the back; master of camouflage | Sand flat · 5 |
| `stingray` | Stingray | Flat **diamond disc** body, sandy brown top, eyes on top; long whip tail with a serrated **barb** near the base | Sand flat · 3 |
| `cone-snail` | Cone Snail | Glossy **cone-shaped shell** with an intricate brown-on-cream net/textile pattern; small siphon, hidden harpoon | Rock pool · 4 |
| `sea-urchin` | Sea Urchin | Dark round body covered in long, straight **black/purple spines** radiating outward | Rock pool · 2 |
| `bristleworm` | Bristleworm | Long **segmented worm**, reddish-orange, each segment fringed with tufts of fine **white bristles** down both sides | Rock pool · 1 |

## ✅ Region 2 — The Shallows (7/7 done)

| Filename (`id`) | Creature | Habitat · Danger |
|---|---|---|
| `estuary-catfish` | Estuary Catfish | Sand flat · 3 |
| `eastern-fortescue` | Eastern Fortescue | Rock pool · 2 |
| `old-wife` | Old Wife | Rock pool · 2 |
| `coffin-ray` | Coffin Ray | Sand flat · 3 |
| `pufferfish` | Pufferfish | Sand flat · 4 |
| `weedy-seadragon` | Weedy Seadragon | Rock pool · 1 |
| `sea-snake` | Sea Snake | Open water · 4 |

## ✅ Region 3 — The Reef (7/7 done)

| Filename (`id`) | Creature | Habitat · Danger |
|---|---|---|
| `lionfish` | Lionfish | Rock pool · 4 |
| `crown-of-thorns` | Crown-of-thorns Starfish | Rock pool · 3 |
| `moray-eel` | Moray Eel | Rock pool · 3 |
| `bluespotted-ray` | Bluespotted Ribbontail Ray | Sand flat · 3 |
| `titan-triggerfish` | Titan Triggerfish | Sand flat · 3 |
| `whitetip-reef-shark` | Whitetip Reef Shark | Open water · 2 |
| `potato-cod` | Potato Cod | Open water · 1 |

## ⬜ Region 4 — The Open Ocean (0/7 — still to make)

| Filename (`id`) | Creature | Habitat · Danger |
|---|---|---|
| `great-white-shark` | Great White Shark | Open water · 5 |
| `black-marlin` | Black Marlin | Open water · 4 |
| `manta-ray` | Manta Ray | Open water · 1 |
| `humpback-whale` | Humpback Whale | Open water · 2 |
| `wobbegong` | Wobbegong | Sand flat · 3 |
| `fur-seal` | Australian Fur Seal | Rock pool · 2 |
| `ocean-sunfish` | Ocean Sunfish | Rock pool · 1 |

## ⬜ Region 5 — The Tropical North (0/7 — still to make)

| Filename (`id`) | Creature | Habitat · Danger |
|---|---|---|
| `box-jellyfish` | Box Jellyfish | Open water · 5 |
| `irukandji` | Irukandji | Open water · 4 |
| `bull-shark` | Bull Shark | Open water · 5 |
| `saltwater-crocodile` | Saltwater Crocodile | Sand flat · 5 |
| `flower-urchin` | Flower Urchin | Rock pool · 4 |
| `dugong` | Dugong | Sand flat · 1 |
| `queensland-groper` | Queensland Groper | Rock pool · 2 |
