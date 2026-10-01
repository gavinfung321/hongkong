# World Bible

## Purpose

A cinematic night crossing of Victoria Harbour that reveals Hong Kong through boats, architecture, light, and water.

## Audience

### Primary audience

Design-aware international visitors and Hong Kong-curious viewers, roughly
18–45, encountering the experience on desktop or a modern phone. They should
not need prior knowledge of the harbour. The experience should be legible as a
short visual journey in about three to five minutes.

### Secondary audience

Hong Kong residents and diaspora viewers who will recognize the landmarks and
care whether the atmosphere feels specific to Victoria Harbour rather than like
a generic neon city.

### Audience promise

Offer a memorable sense of crossing the harbour at night, then leave the viewer
curious to see the place in person. This is an atmospheric editorial experience,
not a complete history, travel guide, map, or architectural reconstruction.

### Accessibility baseline

- All narrative text remains selectable semantic HTML.
- The story remains understandable without animation or WebGL.
- Copy uses short paragraphs and strong contrast.
- Motion is calm by default and substantially reduced when requested.
- Sound is not required to understand or complete the experience.

**Status:** Recommended for approval.

## Tone

Poetic, cinematic, observant, and place-specific. The voice should feel like a
quiet night crossing: concise enough to leave room for the image, but concrete
enough to name real landmarks and harbour life.

Avoid tourism-advertising superlatives, generic cyberpunk language, faux-historic
nostalgia, and an exoticized “East meets West” framing. Heritage elements such
as the Clock Tower, Star Ferry, and junk silhouette should be treated as living
parts of the harbour rather than decorative shorthand.

**Status:** Recommended for approval.

## Visual language

- Illustrated neo-vintage Hong Kong poster aesthetic
- Navy and aubergine shadows
- Coral-red sails
- Cyan edge lighting
- Warm cream typography
- Restrained halftone texture
- Slow, deliberate camera movement

## World rules

- One persistent Three.js scene
- Real HTML for all readable text and controls
- 3D for close hero landmarks and moving boats
- Simplified geometry for the distant skyline
- Transparent 2D cutouts for near-camera richness
- Mobile camera compositions authored separately
- No copied Kage code or artwork
- Geography may be compressed for composition, but the crossing must retain a
  clear Kowloon-to-Hong-Kong-Island orientation
- Time advances emotionally from dusk-blue arrival to luminous night and a calm
  afterglow; it does not jump between unrelated weather or times of day
- Every chapter needs one dominant subject, one supporting motion, and one clear
  copy-safe region
- Use recognisable silhouettes rather than dense photoreal detail

## Performance targets

- Hero becomes useful quickly on an average mobile connection
- Later chapters load progressively
- Reduced-motion and static-poster fallbacks
- Stable performance on a modern mid-range phone
- Grey-box target: stable 50+ fps on a typical laptop and 30+ fps on the target
  phone, with no obvious hitching between chapters
- Final first-view download budget and device test list will be set after the
  grey-box is profiled
