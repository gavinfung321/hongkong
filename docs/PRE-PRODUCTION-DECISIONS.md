# Pre-production Decisions

This document is the approval checkpoint between exploration and implementation.
All choices below are recommendations until the user approves them. Approval of
this document authorises a grey-box prototype, not final art production.

## 1. Experience definition

**Recommended decision:** Build a three-to-five-minute, self-directed cinematic
scroll journey for design-aware visitors and Hong Kong-curious viewers. It should
feel rewarding to residents too, through geographically coherent landmark
relationships and a restrained, non-generic depiction of the harbour.

**Tone:** Poetic, cinematic, observant, and place-specific. Keep copy short and
concrete. Avoid tourism slogans, cyberpunk clichés, exoticism, and encyclopaedic
explanation.

## 2. Narrative shape

Use six scroll states within one continuous night crossing:

1. **Harbour at Dusk — Arrival:** orient the viewer with the whole harbour.
2. **The Kowloon Edge — Clock Tower:** approach the departure edge and heritage anchor.
3. **Across the Water — Star Ferry:** descend toward the water and begin the crossing.
4. **Red Sails — The Junk:** reach the visual and emotional hero moment.
5. **City of Light — IFC:** rise toward the vertical island skyline.
6. **Afterglow — Departure:** pull back and tilt up from IFC into the
   afterglow sky, then end quietly. (Revised to match the approved Frame 06.)

The chapter names are editorial headings, not navigation labels. A minimal
progress indicator may use `01–06` or short labels if testing shows it is needed.

## 3. Visual hierarchy

- Hero silhouettes, in order: junk, Clock Tower, Star Ferry, IFC.
- Water is the continuous connective surface, not background filler.
- The skyline supports the hero objects and should not compete through excessive
  window detail.
- Coral red is reserved mainly for the junk sails and rare accents.
- Searchlights, halftone, bloom, and particles are polish layers, not structural
  elements.

## 4. Responsive composition

Desktop reference frame: **1440 × 900**. Mobile reference frame: **390 × 844**.
Each chapter receives an independently authored portrait camera pose and copy
zone. Mobile may omit secondary skyline elements and foreground layers to
preserve the subject and readable text.

The detailed shot requirements and transition rules live in `STORYBOARD.md`.

## 5. Smallest useful grey-box

The first implementation milestone contains only:

- one persistent Three.js scene and one renderer;
- primitive water, mountain, skyline, Clock Tower, Star Ferry, junk, and IFC;
- six desktop camera poses and six mobile camera poses;
- native scroll mapped to one continuous camera path;
- six semantic HTML chapter sections with placeholder copy;
- simple subject movement for the ferry and junk;
- placeholder foreground planes to test occlusion;
- a basic reduced-motion mode using stepped views;
- a static poster fallback placeholder;
- a small on-screen diagnostic showing chapter and progress during development.

### Explicitly excluded from the grey-box

- Blender or downloaded production models;
- final scene plates, cutouts, typography, and written copy;
- bloom, film grain, halftone, particles, rain, cloth simulation, and custom shaders
  beyond what is essential to read the water;
- custom cursor, sound, loading spectacle, and complex navigation;
- detailed building windows, traffic, crowds, or historically complete modelling.

## 6. Grey-box acceptance criteria

The milestone is successful when:

1. All six beats read in the intended order without labels attached to 3D objects.
2. Camera movement feels like one crossing and never exposes an empty or broken world.
3. Each hero silhouette and HTML copy region remain clear at 1440 × 900 and 390 × 844.
4. Foreground cards do not visibly pop, intersect the camera, or cover essential copy.
5. The ferry and junk motion support the story without requiring frame-perfect scrolling.
6. Reduced-motion mode preserves the complete narrative with no continuous travel.
7. The fallback preserves the opening message and a usable path through the HTML story.
8. Performance is stable at roughly 50+ fps on the development laptop and 30+ fps
   on the chosen representative phone, before visual polish.

The grey-box should be revised until these pass. Final asset creation begins only
after the camera path and portrait compositions are approved.

## 7. Decisions (resolved 2026-10-01)

- Audience and three-to-five-minute duration: accepted as written.
- Restrained poetic tone and framing to avoid: accepted as written.
- Six chapter names and Kowloon-to-island narrative order: approved.
- Mobile simplification rather than preserving every desktop element: approved.
- Grey-box scope and exclusions: approved, as detailed in
  `CURSOR-GREYBOX-BRIEF.md`, which also adds an Observation Wheel proxy and
  static firework placeholders.
- Target phones for the 30 fps target: iPhone 11 (primary) and iPhone 13
  (secondary), iOS Safari.

## 8. Work immediately after approval

1. Create labeled grayscale desktop and mobile storyboard frames for all six chapters.
2. Record the approved copy-safe zones and landmark scale relationships.
3. Choose legally usable reference sources and record provenance in the asset ledger.
4. Prepare a Cursor implementation brief for the grey-box milestone only.
5. Scaffold the minimal Vite and vanilla Three.js project after that brief is approved.

## Decision status

**Approved 2026-10-01.** The grey-box milestone is authorised as specified in
`CURSOR-GREYBOX-BRIEF.md`. Final asset production is still not authorised.
