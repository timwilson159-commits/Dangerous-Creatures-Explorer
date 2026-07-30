# Creature card art

Drop card images here. The game builds the path from the species `id`, so **the filename
must exactly match the `id`** in the `SPECIES` array in `index.html`:

```
cards/<species-id>.png
```

## Region 1 species

| File | Species |
|------|---------|
| `bluebottle.png` | Bluebottle |
| `blue-ringed-octopus.png` | Blue-ringed Octopus |
| `stonefish.png` | Stonefish |
| `stingray.png` | Stingray |
| `cone-snail.png` | Cone Snail |
| `sea-urchin.png` | Sea Urchin |
| `bristleworm.png` | Bristleworm |
| `port-jackson-shark.png` | Port Jackson Shark |

## Rules

- **Lowercase only, hyphens not spaces or underscores.** GitHub Pages runs on Linux and is
  case-sensitive — `Bluebottle.png` will 404 even though it works when tested on Windows.
- `.png` with transparency preferred.
- Roughly **3:4 portrait** (e.g. 600×800) so cards lay out consistently.
- Keep files small (< 300 KB) — the whole game should load fast on a school connection.

Missing images are not an error: the card falls back to the creature's in-game sprite, so
art can be added a few at a time.
