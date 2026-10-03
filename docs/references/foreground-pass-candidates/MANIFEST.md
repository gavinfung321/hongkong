# Foreground Pass Candidates

Generated source artwork for close foreground framing. None of it is loaded
by the website. The files stay here so single pieces can be used later, one
at a time, where a comparison proves they improve a frame. Do not copy them
to `public/` without that comparison and the user's approval.

The PNG files are full resolution transparent masters. The `webp/` folder
contains smaller review candidates. Every WebP retains alpha.

## Shared generation direction

All assets use the same production direction:

1. Painterly 2.5D game environment cutout.
2. Neo vintage Hong Kong night illustration.
3. Navy and aubergine shadows.
4. Cool cyan harbour rim light.
5. Restrained warm amber illumination.
6. Small coral reflections where appropriate.
7. Genuine transparent background.
8. No text, watermark, scenery rectangle or embedded skyline.

## Foreground direction (user choice, 2026-10-03)

The first 2.5D foreground test put two cards in the Hero and 01 (the night
railing and bauhinia cluster below). The user found it "very weird"; it was
removed before it was committed. Foreground elements are now added only
where they improve a specific composition, never as a pair in every
chapter:

| Chapter | Foreground |
|---|---|
| Hero and 01 | Existing 3D foreground only (railing, lanterns, bauhinia tree and bush) |
| 02 | Existing palms, lamps, paving and Clock Tower only |
| 03 | The Star Ferry, its wake and reflections only: no cutouts, spray or camera-facing mist |
| 04 | The junk and its rigging |
| 05 | One optional test, reserved: a Central pier canopy, bollard or chain (not started) |
| 06 | Smoke and illuminated sky haze only |

On phones, no large physical foreground cutouts unless a later comparison
proves they improve the frame.

## Asset status

| Asset | Source | Status |
|---|---|---|
| `bauhinia-flower-cluster-night` | Restyled existing candidate | Tried in the Hero and 01 test; not used |
| `promenade-railing-night` | Restyled existing candidate | Tried in the Hero and 01 test; not used |
| `promenade-lamp-night` | Restyled existing candidate | Not used (02 keeps its 3D lamps) |
| `wet-paving-night` | Restyled existing candidate | Not used (01 and 02 keep their 3D paving) |
| `harbour-spray-near` | Restyled existing candidate | Not used (no spray in 03) |
| `firework-smoke-near` | Restyled existing candidate | Not used (06 keeps its built smoke) |
| `palm-fronds-near` | Newly generated | Not used (02 keeps its 3D palms) |
| `ferry-railing-life-ring-near` | Newly generated | Not used (03 uses the 3D ferry) |
| `junk-rope-rigging-near` | Newly generated | Not used (04 uses the 3D junk's rigging) |
| `central-pier-canopy-near` | Newly generated | Candidate for the optional 05 test |
| `bollard-chain-near` | Newly generated | Candidate for the optional 05 test |

## If a piece is used later

1. Keep the existing three dimensional promenade, ferry, junk and tree.
2. Treat it as close camera framing, not replacement scenery.
3. Keep chapter copy, landmarks, moon and vertical labels unobstructed.
4. Use scroll linked entrance and exit movement. Reduced motion uses opacity.
5. Run transparent edge checks against both bright fireworks and dark water.
6. Do not use the full resolution PNG files in production.
