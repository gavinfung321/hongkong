# Foreground Pass Candidates

These are review candidates for the planned 2.5D foreground choreography pass.
They are not loaded by the website and should not be copied to `public/` until
the user approves an A and B comparison.

The PNG files are full resolution transparent masters. The `webp/` folder
contains smaller review and integration candidates. Every WebP retains alpha.

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

## Asset map

| Asset | Source | Proposed use |
|---|---|---|
| `bauhinia-flower-cluster-night` | Restyled existing candidate | Hero and 01, entering from the right edge |
| `promenade-railing-night` | Restyled existing candidate | Hero and 01, lower left framing |
| `promenade-lamp-night` | Restyled existing candidate | 01 or 02, paired with the railing when composition allows |
| `wet-paving-night` | Restyled existing candidate | 01 and 02, lower corner ground wedge |
| `harbour-spray-near` | Restyled existing candidate | 03 and 04, cropped differently on each side |
| `firework-smoke-near` | Restyled existing candidate | 06, mirrored or cropped into two low smoke banks |
| `palm-fronds-near` | Newly generated | 02, entering from the lower left |
| `ferry-railing-life-ring-near` | Newly generated | 03, lower right detail from the same ferry |
| `junk-rope-rigging-near` | Newly generated | 04, lower left rigging frame |
| `central-pier-canopy-near` | Newly generated | 05, lower left architectural frame |
| `bollard-chain-near` | Newly generated | 05, lower right harbour frame |

## Integration rules

1. Keep the existing three dimensional promenade, ferry, junk and tree.
2. Treat these as close camera framing, not replacement scenery.
3. Load only the active chapter pair.
4. Desktop may show two cards. Mobile starts with one card.
5. Keep chapter copy, landmarks, moon and vertical labels unobstructed.
6. Use scroll linked entrance and exit movement. Reduced motion uses opacity.
7. Run transparent edge checks against both bright fireworks and dark water.
8. Do not use the full resolution PNG files in production.

