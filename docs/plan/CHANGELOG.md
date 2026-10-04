# Changelog

Part of the Milestone 2 plan (index: [README.md](README.md)). Newest first.
One entry per change: what changed, why, and the files. Older history also
lives in the dated notes inside each area file, and in `git log`.

## 2026-10-04

- **03 phone board and ticket** (user request, 2026-10-04). On phones the
  departure card is the full desktop board under the standfirst, and the
  ticket sits just beneath it on the right. It stays off when that would
  cover the ferry. Desktop is unchanged. Files: `src/styles.css`,
  `src/ui/copyLayer.js`; plan: `narrative-spine.md`.
- **03 phone countdown, index off** (user request, 2026-10-04). The route
  panel on its own read as step 3 of a flow that was not on the phone.
  Phones now keep the title, the standfirst, the countdown and the
  ticket. All three panels stay on desktop. Files: `src/styles.css`,
  `src/ui/copyLayer.js`; plan: `narrative-spine.md`.
- **03 quieter on phones** (user request, 2026-10-04). Phones keep the
  title, the standfirst, the route panel and the ticket. Facing Forward,
  A Daily Crossing and the departure board are left off, so the ferry is
  not covered by a column of reading. Desktop keeps all three panels and
  the board. Files: `src/styles.css`, `src/ui/copyLayer.js`; plan:
  `narrative-spine.md`.
- **05 branch fades with the words** (user request, 2026-10-04). The
  corner sprig was on its own clock, slower in and quicker out than the
  sentence. It now uses the sentence's fade, so they arrive and leave
  together. A fast scroll takes the sprig with the words. Files:
  `src/scene/createCornerBranch.js`, `src/ui/copyLayer.js`,
  `src/main.js`; plan: `narrative-spine.md`.
- **04 quote off on phones** (user request, 2026-10-04). The sailing
  quote and the coral line above it are gone on phones, so they do not
  cross the main sail. The cards, captions and foot line stay. Desktop
  keeps the quote. Files: `src/styles.css`; plan: `narrative-spine.md`.
- **02 phone beats the same size** (user request, 2026-10-04). On phones
  both paragraphs are 13 px, so the tower sits higher. Beat 1 stays
  cream. Desktop is unchanged. Files: `src/styles.css`; plan:
  `narrative-spine.md`.
- **02 print off on phones** (user request, 2026-10-04). The terminus
  photograph and the caption above it are gone on phones, and the file
  is not fetched there. The paragraphs, the faint 1915, the steam and
  the timeline stay. Desktop keeps the print. Files: `src/styles.css`,
  `src/ui/memoryPlate.js`, `src/main.js`; plan: `narrative-spine.md`.
- **03 phone ticket lower** (user request, 2026-10-04). On phones the
  ticket sits near the foot of the open water, just above the browser
  toolbar, instead of midway in that gap. It still stays off when the
  gap is too small. Files: `src/styles.css`, `src/ui/copyLayer.js`;
  plan: `narrative-spine.md`.
- **Fallback introduction** (user request, 2026-10-04). The readable story
  opens with the two approved lines. A normal visit does not show them.
  Files: `index.html`, `src/styles.css`; plan: `interface.md`,
  `FINAL-NARRATIVE-COPY.md`.
- **Social preview image** (user request, 2026-10-04). A shared link now
  shows the hero: the opening frame cropped to 1200×630. A page visit
  does not download it. Files: `public/posters/harbour-social.jpg`,
  `index.html`; plan: `interface.md`, `ASSET-LEDGER.md`,
  `FINAL-NARRATIVE-COPY.md`.
- **Fallback poster stills** (user request, 2026-10-04). The greybox
  drawing is replaced by stills of the opening frame: desktop 1016×648
  (59 KB) and phone 390×844 (24 KB), including the in-scene 香港 and no
  interface chrome. A normal visit does not request them; they load on
  fallback, on the 12 s safety timer, or with JavaScript off. Files:
  `public/posters/harbour-poster-desktop.webp`,
  `public/posters/harbour-poster-mobile.webp`, `index.html`,
  `src/ui/fallback.js`, `src/styles.css`; plan: `interface.md`,
  `README.md`, `ASSET-LEDGER.md`.
- **Paper grain passed** (user, 2026-10-04). It stays unbuilt. Next is a
  still of the opening frame for the fallback poster. Plan: `README.md`.
- **iPhone speed and the HKAAA line** (user, 2026-10-04). The phone
  re-measure is closed as fine. "Created by Gavin Fung at HKAAA" stays.
  The paper grain is the remaining offered item. Plan: `README.md`,
  `HANDOFF.md`.
- **Footer wash** (user request, 2026-10-04). The footer background is no
  longer solid: about 80% black under the hairline, darker toward the
  columns, so the fireworks show through. Files: `src/styles.css`; plan:
  `interface.md`.
- **Footer line is the top edge** (user request, 2026-10-04). The dark band
  above the closing hairline is gone; the line is the top of the footer.
  Files: `src/styles.css`; plan: `interface.md`.
- **Footer closing line** (user request, 2026-10-04). A cream hairline runs
  the full width in the dark band above "Return to the harbour", matching
  the rules already in the footer. Files: `src/styles.css`; plan:
  `interface.md`.
- **Working speed** (user request, 2026-10-04). No screenshots and no
  browser checks; the user reviews the page. A file tidy does not speed
  the site: only the bundle, fonts, and images the page requests do.
  Files: `docs/plan/README.md`, `docs/plan/HANDOFF.md`.
- **Darker footer, shorter credits, smaller loading title** (user request,
  2026-10-04). The footer wash goes near black. The colophon drops "Built
  with Three.js and WebGL" and "Designed for desktop and mobile"; the bar
  drops "Three.js · WebGL". The long Red Sails photo paragraph becomes
  one Dukling credit (the photograph is CC BY-SA). The loading 維港夜色
  is 22 px (18 px on phones) with wider tracking. Files: `index.html`,
  `src/styles.css`; plan: `interface.md`, `FINAL-NARRATIVE-COPY.md`,
  `ASSET-LEDGER.md`.
- **05 corner sprig enters from the top-right** (user request, 2026-10-04).
  The depth branch was fixed in the harbour, so it crossed the middle of
  the frame as the camera arrived. It now stays hidden during the move,
  then slides in from off the top-right once 05 has settled, and slips
  back out the same way before the camera leaves. Files:
  `src/scene/createCornerBranch.js`, `src/main.js`; plan:
  `narrative-spine.md`.
- **05 corner sprig back in the scene** (user request, 2026-10-04). The
  flat camera-pinned overlay read worse than the depth branch, so the
  sprig is the 3D one again: placed from the 05 pose, with depth, and
  following most of the mouse parallax. Desktop only. Files:
  `src/scene/createCornerBranch.js`, `src/scene/bauhinia.js`,
  `src/main.js`; plan: `narrative-spine.md`, `ASSET-LEDGER.md`.
- **05 corner sprig pinned to the frame** (user request, 2026-10-04). The
  bauhinia branch was a 3D object placed from the 05 pose, so it read as
  a stick on Two IFC. It is now parented to the live camera, flattened,
  drawn without depth on the overlay layer, and kept in the top-right
  sky. Shorter wood, denser flowers. Desktop only. Files:
  `src/scene/createCornerBranch.js`, `src/scene/bauhinia.js`,
  `src/main.js`; plan: `narrative-spine.md`, `ASSET-LEDGER.md`.
- **05 fair pad left of the wheel; 04 words and photos together** (user
  requests and choices, 2026-10-04). 05's empty water west of the
  Observation Wheel is a small night fair on a new pad: a wave swinger
  and a red-and-white spiral-slide tower, original, with no sponsor
  lettering (the Central carnival is a reference only). 04's header and
  both photo cards come in together, and the sails veil goes to full
  strength as they arrive. Files: `src/scene/createFairground.js`,
  `src/scene/createIsland.js`, `src/scene/waterReflections.js`,
  `src/ui/copyLayer.js`, `src/data/chapters.js`, `src/styles.css`; plan:
  `narrative-spine.md`, `scene-models.md`, `ASSET-LEDGER.md`.
- **02 print with the words; quiet lens discs in 03 and 04** (user
  requests and choices, 2026-10-04). 02's 1915 print, timeline, steam
  and spare dust now fade in with the title and beats (they used to wait
  for half the extra hold). 03 and 04 get about three small, dim
  out-of-focus light discs in front of the camera; 05 still has the
  denser pack. Files: `src/ui/copyLayer.js`, `src/styles.css`,
  `src/data/chapters.js`, `src/scene/createLensBokeh.js`, `src/main.js`,
  `src/scene/createStoryLayers.js`; plan: `narrative-spine.md`,
  `interface.md`.
- **05 wheel hover actually reads** (user request, 2026-10-04). The 4×
  boost was too slow to see, and the hit test used a stale camera
  matrix plus a circle that missed the tall disc. Hover now matches
  the wheel on screen and speeds the turn 16× (~15 s per revolution).
  Files: `src/scene/createIsland.js`, `src/main.js`; plan:
  `scene-models.md`, `narrative-spine.md`.
- **05 City of Light: layers around Two IFC** (user requests and choices,
  2026-10-04). Copy stays one sourced sentence about Two IFC (same
  left-column layout). The height line, the bollard and searchlights that
  followed the cursor are gone. Around the tower: a desktop corner
  bauhinia sprig; more round lens-bokeh discs (about nine on desktop, six
  on phones) that skip IFC's shaft; a lit cloud band; a skyline light
  wave every ~10 s; a small harbour boat; searchlights on their own
  sweep; a denser boarding plaza under the wheel (extra tents, kiosks,
  lamps, string lights); the wheel turns about 16× while the pointer is
  over it. Touch-lit offices stay a small patch. Files: `index.html`,
  `src/ui/cityLights.js`, `src/ui/cityTouch.js`, `src/ui/copyLayer.js`,
  `src/scene/cityLight.js`, `src/scene/cityWindows.js`,
  `src/scene/facades.js`, `src/styles.css`, `src/data/chapters.js`,
  `src/data/atmosphere.js`, `src/main.js`, `src/scroll/cameraRig.js`,
  `src/scene/createIsland.js`, `src/scene/createLensBokeh.js`,
  `src/scene/createCornerBranch.js`, `src/scene/createHarbourBoat.js`,
  `src/scene/createAtmosphere.js`, `src/scene/createSearchlights.js`,
  `src/scene/bauhinia.js`, `src/scene/waterReflections.js`,
  `src/ui/pointerParallax.js`; `src/scene/createBollard.js` deleted; plan:
  `narrative-spine.md`, `scene-models.md`, `atmosphere.md`,
  `interface.md`, `ASSET-LEDGER.md`.
- **04 photo cards: a warm light under the pointer** (user request and
  choices, 2026-10-04). Hovering lifted the cloth but the spot under the
  cursor stayed as bright as flat cloth. Now a warm pool of light follows
  the pointer, about 45% brighter at the centre and fading out over 38%
  of the card's width, shaded by the folds so the ripples show through;
  it eases in and out with the hover. The glow under the card is
  unchanged. Files: `src/ui/paperCard.js`; plan: `narrative-spine.md`.
- **03: the board's countdown runs on a clock** (user choice,
  2026-10-04). It only moved with scroll, so a visitor who stopped to look
  saw 3 MIN forever. It now steps every 1.2 s after a 0.4 s lead, showing
  ARRIVING about 4 s after the board arrives; scrolling the route dot can
  run it ahead, never back, and it restarts on return. The board now waits
  for the entrance cover to lift (on a link straight to 03 it had counted
  down behind the cover). Files:
  `src/ui/departureBoard.js`, `src/ui/copyLayer.js`; plan:
  `narrative-spine.md`.
- **03: 中環 removed from the board's tiles** (user choice, 2026-10-04).
  It repeated the route panel's "Central 中環" and, on phones, added a
  second line that pushed the panels and ticket down. The board now
  reads CENTRAL on desktop and phones; the Chinese stays in the labels
  (天星小輪, 往, 到達). Files: `src/ui/departureBoard.js`,
  `src/styles.css`; plan: `narrative-spine.md`.
- **03: 中環 above CENTRAL on the board; phone ticket centred in the
  open water** (user requests and choices, 2026-10-04). On phones 中環
  sat between CENTRAL and the countdown and read as part of it; the
  destination is now stacked, Chinese above English as on Hong Kong
  signs, on desktop and phones. The phone ticket was crowding the foot
  of the screen and could slip under a browser toolbar; it is now
  centred between the panels' foot and the foot of the smallest
  viewport, and left out only where that gap is too small (was: under
  760px tall). Files: `src/ui/departureBoard.js`, `src/ui/copyLayer.js`,
  `src/styles.css`; plan: `narrative-spine.md`.
- **03 ticket on phones** (user request and choices, 2026-10-04): over
  the open water at the bottom right, below the panels, left of the
  天星小輪 label and clear of the buoy; it flips in and sways as on
  desktop, and a tap plays the tilt, glint and stub lift for a second.
  Left out on phones under 760px tall. Files: `src/ui/ticketCard.js`,
  `src/ui/copyLayer.js`, `src/styles.css`; plan: `narrative-spine.md`.
- **03 ticket: a rigid card with ticket-like motion; board and ticket
  arrive with the panels** (user requests and choices, 2026-10-04). The
  ticket is back in the darker cream (the white looked worse) and no
  longer uses the cloth renderer: it is a rigid card in two layers (main
  part and stub) that flips in with the panels, sways about a degree
  from its pin, and on hover tilts toward the pointer with a sliding
  glint while the stub lifts at the perforation. The board and ticket
  now come in with the panels instead of part-way through the hold.
  `paperCard.js` is back as it was (stiff-card setting removed). Files:
  `index.html`, `src/ui/ticketCard.js` (new), `src/ui/copyLayer.js`,
  `src/main.js`, `src/styles.css`, `src/ui/paperCard.js`,
  `public/plates/star-ferry-ticket.webp`; plan: `narrative-spine.md`;
  `docs/ASSET-LEDGER.md`.
- **03: no 1888; board moved clear of IFC; the ticket as stiff white
  card** (user requests and choices, 2026-10-04). The outlined 1888 is
  gone. The board moves from the top right, where it sat on IFC's crown,
  to the open sky between the masts and the moon, and loses its dark box
  for a faint backing; it still counts down with the route dot. The
  ticket read as cloth: the photo cards' renderer now has a stiff card
  material (`data-material="card"`) with a slow small sway, twist and
  curl instead of the wave simulation, and the artwork is re-exported
  near-white (brightness 0.8, was 0.56). 04's cloth is unchanged. Files:
  `index.html`, `src/ui/copyLayer.js`, `src/ui/paperCard.js`,
  `src/styles.css`, `public/plates/star-ferry-ticket.webp`; plan:
  `narrative-spine.md`; `docs/ASSET-LEDGER.md`.
- **03: departure board, panel flip, 1888 and a ticket** (user request
  and choices, 2026-10-04). 03 read plain next to 02 and 04. Now the
  panels flip over like the seat backs as they arrive; a faint outlined
  1888 drifts in the sky; a split-flap board top right flips in "To
  Central" and counts down with the route dot to "Arriving"; and our own
  Star Ferry ticket (upper deck, HK$5.0) hangs on the cloth above the
  panels. Phones get the board as one row and no ticket. The Chinese font
  subsets were rebuilt with every character on the site (35, was 21;
  03's panel words had been falling back to system fonts). Files:
  `index.html`, `src/ui/departureBoard.js` (new), `src/ui/copyLayer.js`,
  `src/styles.css`, `public/plates/star-ferry-ticket.webp`,
  `public/fonts/noto-*-subset.woff2`; plan: `narrative-spine.md`;
  `docs/ASSET-LEDGER.md`.
- **03: wind haze along the waterline** (user request and choice,
  2026-10-04). 04's drifting harbour mist now runs in 03 too, coming
  in with the panels at 75% strength: a near band just above the
  panels at the ferry's waterline and a fainter, narrower band farther
  out. The windiest chapter's name sets `data-wind` on the root, so each
  scene places its own bands; the band peak is now a `--peak` variable.
  Files: `src/ui/copyLayer.js`, `src/styles.css`; plan:
  `narrative-spine.md`.
- **04 cards: rounder corners, a light glow beneath, lift on hover** (user
  requests and choice, 2026-10-04). Compared again with Kage's cards:
  their corners are about 6% of the width (ours 3px), and on a dark page
  their shadow pass is drawn in light, so a pale glow shows past the
  lower and right edges. Ours now round at 5% of the width, cast a soft
  cream glow (fainter where the cloth lifts), and have a thin lit hem
  inside the edge; the pointer lifts the cloth instead of pressing it.
  The still photo matches. Files: `src/ui/paperCard.js`,
  `src/styles.css`; plan: `narrative-spine.md`.
- **04 photos darker; the cards rebuilt as real cloth** (user requests,
  2026-10-04). Both photos re-exported with a baked night grade (darker,
  cooler, dark edges, a fade to night ink at the foot). The sheet was a
  flat picture with summed sine waves and a drifting light band, so it
  never read as cloth next to Kage's; it is now our own height-field
  wave simulation (96 × 96, gusty wind, damping), with draw-in at the
  edges so the outline ripples, light from the folds only, an outline
  drawn on the cloth, and a pointer that presses a dent and leaves
  ripples. Desktop cards a little larger (23vw). Files:
  `src/ui/paperCard.js`, `src/styles.css`, `public/plates/`; plan:
  `narrative-spine.md`; `docs/ASSET-LEDGER.md`.
- **04 atmosphere: two-step darkening and wind haze** (user request and
  choices, 2026-10-04). 04 now uses the memory veil like 02 and 03, with
  its own shape: a wide opening on the sails, 45% as the camera settles
  and 65% once the cards hang in. Two thin bands of the harbour mist
  drift left to right across the water with the cards. The veil's shape
  is now chosen by `data-veil` on the root (was `data-veil-crossing`);
  petals thin only for 02 and 03 (`yield` level). The statement's bottom
  wash is eased to 60%. Files: `index.html`, `src/ui/copyLayer.js`,
  `src/main.js`, `src/styles.css`; plan: `narrative-spine.md`.
- **04: bigger cards, a quote, credits to the footer** (user requests
  and choices, 2026-10-04). On desktop the cards grow to 21vw (capped by
  the window's height) and step down the left column, "Now" set right,
  clear of the junk; the copy region now reaches 76% down. A sailing
  saying in Cormorant italic, without a name, sits under the cards
  ("I can't change the direction of the wind, but I can adjust my sails
  to always reach my destination."). The photo credit line left 04 for
  the footer's colophon; editing the CC BY-SA photo would not remove the
  need to credit it. Files: `index.html`, `src/data/chapters.js`,
  `src/styles.css`; plan: `narrative-spine.md`; `docs/ASSET-LEDGER.md`.
- **04 built: statement header and hanging photo cards** (user requests
  and choices, 2026-10-04). A "then and now" pair of junk photos (before
  1945, public domain; the Dukling in 2016, CC BY-SA 4.0, credited)
  hangs top-left as WebGL paper sheets after Kage's photo cards (our own
  code): pinned along the top, gently swaying, light drifting across,
  soft shadow; on hover a dent under the pointer, lifting corners and a
  brighter outline. Still photos on touch and reduced motion. The title
  and beat 2 run along the water as a statement header; beat 1 is
  dropped. The cards hang in partway through a new 60svh dwell. The
  user's own two photos had no reuse rights and stay reference only.
  Files: `index.html`, `src/data/chapters.js`, `src/ui/copyLayer.js`,
  `src/ui/paperCard.js` (new), `src/main.js`, `src/styles.css`,
  `public/plates/`; plan: `narrative-spine.md`; `docs/ASSET-LEDGER.md`.
- **Label rows lose their Chinese name** (user request and choice,
  2026-10-04). 鐘樓 and 天星小輪 at the end of 02's and 03's label rows
  repeated the vertical text at the right edge; removed on desktop and
  phones alike. The hairline becomes a short accent after the kicker
  (56px desktop, 40px phones), still drawing in from the left. Files:
  `index.html`, `src/styles.css`; plan: `narrative-spine.md`.
- **03 panels: shorter text, same on every screen** (user requests and
  choice, 2026-10-04). Phones felt crowded; rather than shrink the 13px
  text, each panel now holds one sentence, used on desktop too: 01 drops
  its opening ("Low over the waves…", which the standfirst covers), 02
  drops "shared each day by strangers". On phones the index shares the
  title's line, the panels get more padding and space under the
  standfirst, and "Crossing since 1888" returns (dropped only below
  620px). Files: `index.html`, `src/styles.css`; plan:
  `narrative-spine.md`.
- **03 arrival darkness eased** (user request, 2026-10-04). Stacked on
  the stronger vignette, 03's own frame made the move from 02 to 03 too
  dark: its edges drop to about 55% (was 70%), the outer ring to 60%
  (was 80%), and it reaches 70% strength (was 85%). Files:
  `src/styles.css`, `src/ui/copyLayer.js`.
- **Stronger vignette everywhere; 03 cards matte, lighter on phones**
  (user requests, 2026-10-04). The screen vignette in every scene is now
  a night indigo at about 48% in the desktop corners and 38% on phones
  (was 24% / 16%; a first 62% / 50% was too strong), starting nearer the
  centre. 03's arrival veil frames harder (edges about 70%, outer ring to
  80%) around a smaller opening on the ferry. 03's desktop cards are a matte near-black at 90% with no
  blur; on phones they drop to 55% so the ferry shows through, with a
  soft text shadow. Files: `src/styles.css`; plan:
  `atmospheric-depth-polish.md`, `narrative-spine.md`.
- **02 and 03: fewer scroll effects on the words** (user request and
  choice, 2026-10-04). 02 now arrives in two steps: the label, title, both
  beats and the 1915 ghost together as the camera settles, then the print
  and timeline together about half a screen later; dwell 80svh (was 130).
  03's title, standfirst and all panels fade in together (the hairlines no
  longer draw); only the route dot moves, across a 60svh dwell (was 110).
  The standfirst is back on phones, balanced over two lines. Files:
  `src/ui/copyLayer.js`, `src/data/chapters.js`, `src/styles.css`; plan:
  `narrative-spine.md`.
- **03 on phones: stacked panels** (user request and choice, 2026-10-04).
  The three panels now stack under the title, sharing hairlines and
  drawing in from top to bottom, covering the ferry during the hold; the
  fill is 88% so the cabin lights don't fight the text. Phones up to
  740px tall tighten and drop "Crossing since 1888"; below 620px panel 02
  takes 01's place as before. Files: `src/styles.css`,
  `src/ui/copyLayer.js`.
- **03 standfirst** (user choice, 2026-10-04). One line under the title,
  "Kowloon to the Island, the slow way, every few minutes.", so the title
  is not left alone and the eye is led to the panels; it fades in just
  after the title. Desktop only: on phones a panel already sits under the
  title, and the line pushed it onto the mast. Files: `index.html`, `src/ui/copyLayer.js`,
  `src/styles.css`.
- **03 hover slide halved** (user request, 2026-10-04). The words slide
  6px on hover (was 12px). Files: `src/styles.css`.
- **03 in ferry green** (user requests, 2026-10-04). The panel hover tint,
  the hovered index and the route line and dot now use the Star Ferry's
  hull green (#2f7a4c, a lighter #6cc293 for lines and text) instead of
  coral and warm amber. Files: `src/styles.css`.
- **03 panel hover, after Kage's lesson rows** (user request,
  2026-10-04). The panel no longer lifts, glows or casts a shadow; on
  hover a warm coral tint fades in from its left edge (gone by the middle),
  its words slide 12px right and the index turns coral. Technique only, no
  Kage code. Reduced motion: tint and colour only. Files: `src/styles.css`.
- **03 panels frosted** (user request and choice, 2026-10-04). A darker
  fill alone barely showed, as the veil already darkens the foot of the
  screen; on desktop the panels now blur what is behind them (18px, a
  little desaturated) over a 55% fill, so the water's glints become a
  haze behind the text. Phones keep a plain 72% fill (was 50%) to spare
  the GPU. Files: `src/styles.css`.
- **03 panels: hover lift and a bottom line** (user requests, 2026-10-04).
  On hover a panel lifts 6px, brightens and casts a soft shadow (no lift
  with reduced motion); every panel now has its bottom hairline (phones
  also the right one). Files: `src/styles.css`; plan:
  `narrative-spine.md`.
- **Scene 03: index panels, darker scene, route line** (user requests,
  2026-10-04). The harbour darkens on arrival (veil at 0.85, opening on
  the ferry); the beats move into numbered, outlined panels that draw in
  one after another, with smaller text, after Kage's chapter grid
  (technique only); a route panel runs a warm dot from Tsim Sha Tsui to
  Central with the scroll. A line-by-line wipe tried first was dropped.
  3D untouched. Files: `index.html`, `src/data/chapters.js`,
  `src/ui/copyLayer.js`, `src/styles.css`; plan: `narrative-spine.md`.
- **Scene 02 approved; scene 03 limited to text** (user requests,
  2026-10-04). 02 is kept as built. A first 03 build (animated ferry
  cabin, light trails on the water, route line) was reversed at the user's
  request: 03 changes only the narrative and wording effects, never the 3D
  background. The seat-back claim in 03's copy is now sourced. No code
  change remains. Files: `narrative-spine.md`.
- **More petals** (user request and choice, 2026-10-04). The middle layer,
  where petals read as petals with depth, doubles (40 desktop / 16 phones,
  was 20 / 8) and the far layer grows (100 / 44, was 70 / 32); the near
  layer stays at 6 / 4 so few cross 香港 and the copy. The hero and 01 run
  at 80% (was 50%); 03 and 04 stay sparse at 30%. Files:
  `src/scene/createPetals.js`, `src/data/chapters.js`; plan:
  `scene-promenade.md`.
- **香港 lingers longer on the first scroll** (user request and choice,
  2026-10-04). The word and 01's copy now stay whole for a
  moment, so the camera is seen nearing the word, then fade, gone after
  about 70% of a screen of scrolling (was about half a screen on desktop
  and a third on phones; the phones' early fade was for the old sink
  crossing the moon, which no longer happens). Files:
  `src/data/chapters.js` (`HERO.fadeStart`, `fadeEnd`),
  `src/scene/createWordmark.js`, `src/main.js`; plan: `interface.md`.
- **香港 is a fixed object in the scene; an opening glide** (user choices,
  2026-10-04, after Kage's hero word, technique only). The word no longer
  slides down by script: it stays at one place in the world and the camera
  moves past it, so it grows a little, shifts with the mouse parallax and
  fades as the camera pushes in. To make the camera's moves visible on it,
  it now floats 16 m ahead on desktop (was standing on the water at 47 m)
  and 25 m on phones (was 190 m), sized so the opening frame looks as
  before. On load from the top of the page the camera eases in from 6 m
  further back and 0.6 m higher over 2.4 s (not for deep links or reduced
  motion). Files: `src/scene/createWordmark.js`, `src/data/chapters.js`
  (`HERO`: `depth`, `leaveEnd`, `glide`), `src/scroll/cameraRig.js`,
  `src/main.js`; plan: `interface.md`, `checks.md`, `README.md`.
- **Lighter cursor trail; a middle petal layer** (user request and choice,
  2026-10-04). The cursor trail is cut to about a third: a mote every 3.2%
  of the window height travelled (was 1.2%), lives of 0.9–1.8 s (was
  1.3–2.6), a pool of 60 (was 150), a narrower spread; the faint breath at
  rest stays. The petals gain a middle depth layer (20 desktop / 8 phones,
  about 6–18 m out) between the near and far ones, for volume through
  depth; per-chapter levels unchanged. Files:
  `src/scene/createCursorMotes.js`, `src/scene/createPetals.js`; plan:
  `interface.md`, `scene-promenade.md`.
- **Cursor trail rebuilt; phone photo above the timeline** (user choices,
  2026-10-04). After studying how Kage's cursor wisps work (technique
  only), the cursor motes are now shed along the pointer's path by
  distance travelled, each with a short life, a fraying curl, a little
  rise and a soft fade, plus a faint breath at rest; warm, 150 in the pool.
  On phones the station photo sits just above the timeline at 70% width
  and the beats no longer fade out for it. Files:
  `src/scene/createCursorMotes.js`, `src/ui/copyLayer.js`,
  `src/styles.css`; plan: `interface.md`, `narrative-spine.md`.
- **Cursor motes, and scene 02 on phones** (user choices, 2026-10-04).
  A small swarm of warm motes now follows the desktop mouse on every
  section, trailing behind quick moves and dimming at rest (the stir alone
  was too faint to notice). On phones the 1915 moves right of the tower,
  clear of the palms, and the station photo returns: once both beats have
  been read they fade and the print develops in their place under the
  title. Files: `src/scene/createCursorMotes.js` (new),
  `src/ui/pointerStir.js`, `src/main.js`, `src/scene/createStoryLayers.js`,
  `src/ui/copyLayer.js`, `src/styles.css`; plan: `interface.md`,
  `narrative-spine.md`.
- **Scene 02: fuller floating lights, and a pointer stir** (user choices,
  2026-10-04). The motes grow from about 140 to about 200 (70 to about 100
  on phones) and gather by the light: open air, the tower's floodlit foot,
  each promenade lamp, plus a few large soft out-of-focus motes near the
  lens. Some only join, and all brighten a little, with the 1915 print. On
  desktop the moving mouse pushes the motes, and the petals across the
  whole site, aside and carries them along; they settle when it rests. No
  glow of its own; off on touch and in reduced motion. Files:
  `src/scene/createStoryLayers.js`, `src/scene/createPetals.js`,
  `src/ui/pointerStir.js` (new), `src/main.js`; plan: `narrative-spine.md`,
  `interface.md`.
- **Scene 02: the 1915 ghost stands whole** (user choice, 2026-10-04: split
  into 19 and 15 by the tower it read oddly). The numerals are now one
  upright column reading upward, in the open sky between the tower and the
  copy, rising from behind the ridge on desktop and standing left of the
  tower on phones, with lining figures instead of the face's old-style
  ones. Files: `src/scene/createStoryLayers.js`; plan: `narrative-spine.md`.
- **Scene 02: layered entrance, beat hierarchy, still copy and new layers**
  (user requests and choices, 2026-10-04). Arriving from 01, the harbour
  darkens first (55% of memory mode, with a soft opening that keeps the
  Clock Tower lit), then the label row and its hairline, title, beat 1,
  beat 2, the print and a new timeline row come up one at a time across a
  longer dwell (130 svh, was 90; links land once beat 1 is in). Beat 1 is
  now a larger, brighter lead and no longer dims; phones stack the beats.
  The words, print and timeline only fade (no drift or rise); the scene
  keeps its mouse parallax. New layers: label row with 鐘樓, timeline
  1915 · 1921 · 1975 · 1978, a giant faint 1915 in the sky behind the
  tower, warm dust motes (the petals ease off in memory mode) and railway
  steam cut from the harbour mist art crossing the tower's foot. Memory
  mode now runs on phones too. Techniques only from the Kage reference; all
  content is ours. Files: `index.html`, `src/styles.css`,
  `src/ui/copyLayer.js`, `src/ui/memoryPlate.js`, `src/main.js`,
  `src/data/chapters.js`, `src/scroll/scrollConductor.js`,
  `src/scene/createStoryLayers.js` (new); plan: `narrative-spine.md`;
  `docs/ASSET-LEDGER.md`.
- **Scene 02: real photo print, memory mode and ink backdrop** (user
  choices, 2026-10-04: the text alone read too plain). The AI drawing is
  replaced by a public-domain photo of the newly built Kowloon terminus,
  ca. 1915 (Hong Kong Public Libraries via Wikimedia Commons), baked as a
  duotone print with burnt edges and grain (grain on the print only, an
  exception to the no-grain rule) and shown larger under the beats. While
  it shows, memory mode darkens and cools the harbour and closes the
  vignette in, and a dark ink pool deepens behind the copy. Desktop only;
  phones unchanged. Awaiting the keep, revise or remove decision. Files:
  `index.html`, `src/styles.css`, `src/ui/memoryPlate.js`,
  `src/ui/copyLayer.js`, `src/data/chapters.js`,
  `public/plates/kowloon-terminus-1915.webp` (new; the 1937 drawing
  removed); plan: `narrative-spine.md`, `atmosphere.md`,
  `atmospheric-depth-polish.md`; `docs/ASSET-LEDGER.md`,
  `docs/references/kowloon-terminus-pd/` (sources).
- **Scene 02 narrative prototype** (user request, 2026-10-04): the six
  two-beat drafts are approved and scene 02 is built. Its copy plays two
  beats over 90 svh of extra scroll where the camera holds (other chapters
  unchanged); beat 1 dims as beat 2 rises in on desktop and swaps out on
  phones. A light-line drawing of the Kowloon terminus, ca. 1937, surfaces
  beside the beats with beat 2 (desktop windows about 1230 px and wider),
  its navy ground keyed out in a canvas, with a real-text caption.
  Reduced motion switches the beats with a short fade. Awaiting the keep,
  revise or remove decision. Files: `index.html`, `src/styles.css`,
  `src/data/chapters.js`, `src/scroll/scrollConductor.js`,
  `src/ui/copyLayer.js`, `src/ui/memoryPlate.js` (new), `src/main.js`,
  `public/plates/kowloon-terminus-1937.jpg` (new); plan:
  `narrative-spine.md`; `docs/ASSET-LEDGER.md`.
- **Narrative spine: six two-beat drafts and the scene 02 layout** (user
  request, 2026-10-04): drafted the observation and meaning beats for all
  six chapters (49–58 words each, 02 and 04 facts sourced), and proposed
  scene 02's layers: a feathered line drawing of the 1937 terminus in the
  right-middle sky as a card in the 3D scene with a water reflection,
  surfacing with beat 2. Concepts and the user's reference photos saved.
  Text and plan only; the site is unchanged. Awaiting approval. Photo
  dates and sources confirmed by the user (City in Time, ca. 1937 and
  ca. 1950); the reference folder is git-ignored as the photos' rights are
  not ours. Files: `docs/plan/narrative-spine.md`, `docs/ASSET-LEDGER.md`,
  `.gitignore`, `docs/references/clock-tower/` (local only).
- **05 bollard parallax calmed** (user request, 2026-10-04): it read as
  flying over the water. Its own movement against the skyline is cut to
  about a third (it follows 97.5% of the camera's parallax shift, was
  92%) and its chain drops more steeply out of frame. A stone quay ledge
  under it was tried and removed (user request). Awaiting approval.
  Files: `src/scene/createBollard.js`; plan: `atmospheric-depth-polish.md`.
- **Final chapter balance, atmospheric depth Priority 3** (user choice,
  2026-10-04): after a desktop and phone walkthrough, the moon dims per
  chapter (new `moon` gate: 0.75 in 01, 0.5 in 06, 0.6 in phone 04, with
  its water column), the junk's sail reflection is halved in 01 (new
  `junkGlow` gate), phone 06's two warm bursts move clear of the copy, and
  the bollard and buoy get a faint cool edge light. Awaiting approval.
  Files: `src/scene/createMoon.js`, `waterReflections.js`, `createWater.js`,
  `rimLight.js` (new), `createBollard.js`, `createBuoy.js`, `src/main.js`,
  `src/data/chapters.js`; plan: `atmospheric-depth-polish.md`,
  `atmosphere.md`.
- **Phone versions of the 05 bollard and 03 buoy** (user choice,
  2026-10-04): mobile 05 gets the bollard in its lower right under IFC's
  foot (3 m out, head below eye height); mobile 03 gets a smaller buoy
  (0.45 scale) close in the lower left under the ferry, since IFC's and the
  wheel's water columns cross the lower right. Both now reposition per
  screen size. Approved 2026-10-04. Files: `src/scene/createBollard.js`,
  `src/scene/createBuoy.js`, `src/main.js`, `src/data/chapters.js`; plan:
  `atmospheric-depth-polish.md`.
- **Chapter 03 channel buoy** (user choice, 2026-10-04; the 05 bollard
  kept): one dark red port-hand buoy on the open water 20 m out in the lower
  right of the desktop 03 frame, right of the ferry, rocking slowly with the
  swell (still in reduced motion). Fades in over the second half of the
  move into 03. Desktop only. Bollards are not repeated in other chapters
  (01 and 02 are already framed; 03, 04 and 06 are on the water or in the
  air). Approved 2026-10-04. Files: `src/scene/createBuoy.js` (new),
  `src/main.js`, `src/data/chapters.js`; plan:
  `atmospheric-depth-polish.md`.
- **Chapter 05 harbour-edge bollard, atmospheric depth Priority 2** (user
  choice, 2026-10-04; Priority F approved): one dark cast-iron mooring
  bollard with a short sagging chain in the lower right of the desktop 05
  frame, base cropped by the bottom edge. It follows 92% of the mouse
  parallax, so it moves far more than the skyline, and fades in only as the
  camera settles into 05. Desktop only. Approved 2026-10-04. Files:
  `src/scene/createBollard.js` (new), `src/main.js`,
  `src/scroll/cameraRig.js`, `src/data/chapters.js`; plan:
  `atmospheric-depth-polish.md`.
- **Per-chapter withholding, atmospheric depth Priority F** (user choice,
  2026-10-04; Priority E approved): visibility gates only. 01: petals
  0.5, skyline 0.75; its searchlights stay at 0.6 (briefly removed, put
  back by user request, 2026-10-04: they belong to 01 and 05). 02 desktop:
  skyline 0.6 and Mid-Levels lights 0.7, as on mobile. 03 and 04: petals
  0.3. 05 and 06 unchanged; cameras, vessel routes and copy unchanged.
  Approved 2026-10-04. Files: `src/data/chapters.js`; plan:
  `atmospheric-depth-polish.md`.
- **Quieter sky and palette, atmospheric depth Priority E** (user choice,
  2026-10-04; Priority D approved): near-black navy zenith (0x0a0d1e, was
  0x141833) with the glow in a lower band (0.24, was 0.3); clouds at 0.65
  except near the moon; LED crowns and strips at 0.6; Central Plaza and The
  Center's neon desaturated and dimmed (Center neon 0.5, was 0.8; plaza
  bars 0.7). Landmarks' own colours, IFC, wheel and Clock Tower unchanged.
  Approved 2026-10-04. Files: `src/scene/palette.js`, `createScene.js`,
  `createAtmosphere.js`, `createIsland.js`, `landmarks.js`; plan:
  `atmospheric-depth-polish.md`, `atmosphere.md`, `scene-city.md`.
- **Veiled moon, atmospheric depth Priority D** (user choice, 2026-10-04;
  Priority C approved): the disc is slightly dimmer (0.86) with a softer
  corona (0.22, was 0.26), and a thin, seeded veil of violet-grey cloud
  streaks drifts slowly across it (about a minute per streak; still in
  reduced motion), so the moon is partly concealed. Approved 2026-10-04.
  Files: `src/scene/createMoon.js`, `src/main.js`; plan:
  `atmospheric-depth-polish.md`, `atmosphere.md`.
- **Foreground silhouettes, atmospheric depth Priority C** (user choice,
  2026-10-04; Priority B approved): the nearest layer is now the darkest.
  A new `silhouette()` shader patch keeps only part of the moon and sky
  fill (railing A–D 0.35, bauhinia tree 0.3, bauhinia bush 0.3), while the
  lantern pools stay full and catch the edges warm. Lanterns, promontory
  railings, palms and tall lamps unchanged. Approved 2026-10-04. Files:
  `src/scene/lamps.js`, `src/scene/createForeground.js`; plan:
  `atmospheric-depth-polish.md`, `scene-promenade.md`.
- **Calm water, atmospheric depth Priority B** (user choice, 2026-10-04;
  Priority A approved): the harbour reads as dark depth with a few long,
  narrow columns of light instead of glitter across its width. Skyline
  shimmer 0.045 (was 0.11), sky sheen 0.18 (was 0.28), band contrast 0.9
  (was 1.3), column spread 1.1 (was 1.5), row wobble 0.4 (was 0.6), swell
  sway 0.2 (was 0.3); longer tails under IFC (0.4), the wheel (0.45) and
  the moon (0.3). Boats and the 05 boost unchanged. Approved 2026-10-04.
  Files: `src/scene/createWater.js`, `src/scene/waterReflections.js`;
  plan: `atmospheric-depth-polish.md`, `scene-promenade.md`.
- **Atmosphere diagnosis and aerial perspective** (user request and choice,
  2026-10-04):
  - `atmospheric-depth-polish.md` gains a diagnosis (frames are equally
    bright and detailed front to back, so they lack recession and mystery)
    and six chosen priorities, A–F: aerial perspective, calm water,
    foreground silhouettes, veiled moon, quieter sky and palette,
    per-chapter withholding.
  - Priority A is built: fog takes the sky's colour along each view ray
    instead of one dark colour, so far ridges and towers pale into the
    horizon glow rather than going dark. Water and fog density are
    unchanged; `?off=aerial` compares. Then strengthened so the skyline
    recedes too (user request): a depth fade behind Central's front row,
    0 at 1220 m north to 55% at 1920 m, a third less on tower tops; IFC
    stays crisp. Approved 2026-10-04.
  - Files: `src/scene/aerialFog.js` (new), `src/scene/createScene.js`
    (`SKY_GLOW` exported), `src/main.js`. Evidence:
    `review-shots/aerial/`.
- **Waterfront lamps clustered, far shore thinned, railing A strictly
  alternating** (user request, 2026-10-04):
  - Central's waterfront lamps read as a fake straight line of dots, and
    there were too many. They now stand in clusters of 1–4 with 25–70 m
    dark between, at street or podium height and varied setback: about
    110 lamps, down from about 225.
  - The far-shore lights right of Central are thinned to about half
    (spacing 12 m, gaps 62%).
  - Railing A's extra lit post is gone (`lanternExtra` removed). It now
    strictly alternates from post 1 (`lanternOffset: 1`): the big
    lantern right of 港 and one under 香, with an unlit post between.
  - Files: `src/scene/createIsland.js`, `src/data/world.js`,
    `src/scene/lamps.js`; plan: `scene-city.md`, `scene-promenade.md`.
- **Lighting density, Kowloon and Central waterfronts** (user request,
  2026-10-04): irregular darkness and a clearer hierarchy, not a global
  dim.
  - Railings A and B: a lantern on every second big post (was every
    post). Railing A also lights post 1 (`lanternExtra`, new in
    `railingLayout`), so both lanterns framing desktop 01 stay. The
    puddles' mirror of railing A follows the pattern. Railing lantern
    halos at glow 0.7 (was 0.9); the three tall lamps, their glow, the
    Clock Tower floodlight, `STONE_LAMP` and wet-paving strength are
    unchanged.
  - Central Ferry Pier halls: material glow 0.7 (was 1); per hall 3–4 of
    12 bays dark with a darker interior, 1–2 bright (0.6–0.7), the rest
    0.32–0.48 (was 0.5–0.62), each hall scaled 0.85–1.1. All five halls
    share one tile with a section each and are one merged mesh, still one
    draw call.
  - Central waterfront lamps: spacing 8 m (was 6), gaps 25% (was 12%),
    glow 0.55 / 0.8 (was 0.8 / 1.15), every seventh bright (was fifth).
  - Checked at 1440 px (01, 02, 03, 05, and 01 → 02) and 390 px (01, 02,
    03, 05). Files: `src/data/world.js`, `src/scene/lamps.js`,
    `src/scene/createForeground.js`, `src/scene/facades.js`,
    `src/scene/createIsland.js`; plan: `scene-promenade.md`,
    `scene-city.md`. Evidence: `review-shots/lighting-density/`.

## 2026-10-03

- **Light breathing, atmospheric depth Stage 3** (user request, 2026-10-03):
  the warm practical lights now breathe very slightly during holds: the
  railing lanterns and promenade lamp halos (±3%, each its own period and
  phase), the Clock Tower floodlight (±3%), the ferry cabin light (±4%) and
  the junk sail light (±3%). Slow paired sines, never in step, no random
  flicker; held at base brightness in reduced motion. IFC, windows, LEDs and
  the moon stay stable. `?off=light-motion` turns it off. No draw calls
  added. Awaiting visual approval. Files: `src/scene/lightBreath.js` (new),
  `src/scene/lamps.js`, `src/scene/createKowloonEdge.js`,
  `src/scene/createVessels.js`, `src/main.js`; plan:
  `atmospheric-depth-polish.md`, `atmosphere.md`.
- **Depth haze, atmospheric depth Stage 2** (user request, 2026-10-03):
  four tall, separate mist wisps on the water about 200 m in front of the
  waterfront soften the podiums and the towers' feet in 01–04, so the
  skyline reads in layers. Unfogged, city-lit tint, slow seeded drift,
  still in reduced motion; a gap keeps the wheel and IFC clear and lets
  the camera pass into 05 without crossing a wisp. Levels: 01 0.5, 02 0.8,
  03 1, 04 0.7, 05 and 06 0. `?off=haze` hides it, `?haze=` scales it. A
  second band among the towers was tried and removed (hidden by the front
  rows). Approved. Files: `src/data/atmosphere.js`,
  `src/scene/createAtmosphere.js`, `src/data/chapters.js`, `src/main.js`;
  plan: `atmospheric-depth-polish.md`.
- **Screen vignette, atmospheric depth Stage 1** (user request, 2026-10-03;
  vignette only, no grain, user choice): one fixed CSS layer between the
  3D canvas and the copy darkens the corners by about 24% on desktop and
  16% on phones, open across the centre (first tried at 9% / 6%, which
  read as no change, user request). Static, fades in with the canvas,
  absent in fallback; `?off=texture` removes it for A/B checks. No draw
  calls added. Awaiting visual approval. Files: `index.html`,
  `src/styles.css`, `src/main.js`; plan: `atmospheric-depth-polish.md`.
  Evidence: `review-shots/depth-stage1/`.
- **Wakes as broken foam** (user request, 2026-10-03): the V arms, trail,
  propeller wash and disturbed water in the wake mask are now seeded,
  feathered foam patches with gaps instead of gradient strokes and
  polygons. The foam is strongest at the hull, then fragments, widens and
  fades aft. Streaming, the second churn layer and reduced motion are
  unchanged. With the foam broken up, the white is eased slightly: ferry
  strength 1.45 / glow 0x464e60 (was 1.6 / 0x5a6274), junk 1.15 /
  0x3a4252 (was 1.3 / 0x4a5262). Still one mesh per wake; draw calls
  unchanged. Files: `src/scene/wakes.js`, `src/scene/createVessels.js`;
  plan: `scene-city.md`, `scene-models.md`. Evidence:
  `review-shots/wakes/`.
- **Shorter holds around every keyframe** (user request, 2026-10-03):
  `SCROLL.hold` and `copyFull` 0.2 → 0.14, so the camera starts moving
  sooner after each composition instead of after a long still gap. The
  moves stretch over more scroll, so their top speed drops by about a
  sixth; copy is fully shown for the whole hold and gone before the
  camera has moved 2% of the way; two chapters' copy never show at once
  (checked on a continuous scroll through all six chapters, desktop and
  phones). The 03 ferry still holds still and the camera starts
  overtaking it at p 2.64 (was 2.70). Files: `src/data/chapters.js`;
  plan: `README.md` (Transitions). Evidence: `review-shots/hold-014/`.
- **Ferry holds still through the whole 03 hold** (user request,
  2026-10-03): its drift before the keyframe is now 0 too (was 1.5 m,
  desktop and phones), so it no longer edges right as the reader scrolls
  into 03. The bob, wake and reflections still move; the arrival from 02
  and the move to 04 are unchanged. Files: `src/data/chapters.js`; plan:
  `scene-models.md`. Evidence: `review-shots/ferry-overtake/drift00/`.
- **Ferry holds still after the 03 keyframe** (user request, 2026-10-03):
  its drift after the keyframe is now 0 on desktop and phones (was 3 m and
  2.5 m), so it no longer sails on right and away while the reader scrolls
  through the rest of the 03 hold. The bob, wake and reflections still
  move. The move to 04 starts it from rest; the camera overtakes it and it
  slides out left, uncovering the junk. Files: `src/data/chapters.js`;
  plan: `scene-models.md`. Evidence: `review-shots/ferry-overtake/drift0/`.
- **Ferry overtake into 04 starts sooner** (user request, 2026-10-03): late
  in 03 the ferry kept sliding right and shrinking, so scrolling down felt
  like going the wrong way. Its drift after the 03 keyframe is halved
  (desktop 6 → 3 m, phones 5 → 2.5 m) and the desktop via point moved a
  little back along the route (93, −383 → 91.5, −381.5; heading 1.12 →
  1.125). Desktop: the rightward creep through the hold is 2.3% of the
  width (was 4.2%) and turns left about 8% into the move (was 21%);
  phones: 4.3% (was 8.1%), turning left as the move begins. The ferry still sails forward, the junk still comes out from
  behind its bow with no fade or wipe, and the 03 and 04 hold frames are
  unchanged. Files: `src/data/chapters.js`; plan: `scene-models.md`.
  Evidence: `review-shots/ferry-overtake/`.
- **No menu button beside the desktop nav** (user choice, 2026-10-03): from
  960 px wide the nav links, logo and side pager reach every chapter, so
  the menu button is hidden there; the links now end on the page margin.
  Below 960 px and on phones it stays. Files: `src/styles.css`; plan:
  `interface.md` (3.4). Evidence: `review-shots/desktop-menu-button/`.
- **Chapter 06 kicker and phone card menu** (user request, 2026-10-03): 06's
  kicker reads "Fireworks" (was "Departure"); title and 煙花 unchanged. On
  phones (portrait and landscape) the chapter menu is now a floating card
  over the blurred harbour, first reviewed behind `?menu=card` and then
  approved as the default (user choice, 2026-10-03); the switch is gone.
  The desktop menu is unchanged (pixel-identical). Files: `index.html`,
  `src/ui/siteHeader.js`, `src/styles.css`; docs:
  `FINAL-NARRATIVE-COPY.md`; plan: `interface.md` (3.3, 3.4). Evidence:
  `review-shots/mobile-menu-card/`.
- **Interface state fixes IS-01 to IS-13** (user request, 2026-10-03): all
  thirteen findings of the Interface State Polish audit. The header stays
  after long jumps; copy stays below the header; short landscape windows
  get the phone header, smaller copy, the phone vertical title, no side
  pager, a fitting menu and a 香港 clear of the copy; safe-area insets on
  every fixed edge and in the header height; Return focuses the logo; the
  menu's current chapter is underlined; keyboard focus no longer swaps nav
  labels to Chinese; the hero hint is at 75% (was 50%); the fallback's
  vertical title scrolls away; the address hash follows the chapter; hover
  styles only on hover-capable pointers. Desktop and portrait layouts,
  scenes and timings unchanged. Files: `src/styles.css`, `src/main.js`,
  `src/ui/siteHeader.js`, `src/data/chapters.js`; plan: `interface.md`
  (3.3, 3.4, 3.14). Evidence: `review-shots/interface-fixes/`.
- **Entrance and loading sequence** (user request, 2026-10-03; centred
  direction, user choice, 2026-10-03): a near-black title card replaces
  the sky-only loading state. One small centred group in the middle of
  the small viewport: red sail mark, 維港夜色 (Noto Serif TC 600, 32 px;
  27 px on phones), 1 px progress line (240 px; 200 px on phones),
  "Preparing the harbour · N%". The English title is not shown on the
  card; it stays in the page title, metadata and hidden H1. Progress is the weighted share of real start-up tasks
  (fonts, renderer, world, harbour, vessels, foreground, images, shaders,
  first frame), monotonic, 100% only after the first frame. `main.js`
  builds in stages with a yield between them, waits for the hero's images
  and compiles shaders with `compileAsync` before the first frame; the
  bauhinia and petal artwork now load through three's `ImageLoader` so
  they are counted. Minimum 0.8 s from the top, fade 0.8 s; deep links and
  restored positions skip the minimum; fallbacks fade into the poster
  story. Test switches `?entrance=slow|hold|fail`. Favicon added (the
  missing-favicon 404 is gone). Holds pixel-identical, draw calls
  unchanged, JS 218.5 → 219.8 KB gzip. Files: `index.html`,
  `src/styles.css`, `src/ui/loadingScreen.js` (new), `src/main.js`,
  `src/scene/bauhinia.js`, `src/scene/createPetals.js`,
  `public/favicon.svg` (new); docs: `ASSET-LEDGER.md`; plan:
  `interface.md` (3.12). Evidence: `review-shots/entrance-centred/`
  (the first, left-aligned version: `review-shots/entrance/`).
- **Phone 香港 clear of 01's copy** (user request, 2026-10-03): on shorter
  phone screens (414×715, 390×664, 375×667) the copy's body text covered the
  top of 香港, because the word stood at a fixed 42% of the height while the
  copy is sized in pixels. The word now keeps 14 px below the copy, moving
  down to 48% at most, then shrinking; re-placed once fonts load. 390×844
  unchanged. Files: `src/scene/createWordmark.js`, `src/main.js`,
  `src/data/chapters.js` (`HERO.wordmark.mobile`); plan: `interface.md`.
  Evidence: `review-shots/hero-mobile/`.
- **Transition corrections 1 to 6** (user request, 2026-10-03): the six
  fixes approved from the continuous journey review
  (`review-shots/transitions/TRANSITION-REVIEW.md`), each the smallest
  change, holds untouched (keyframes, hold length and chapter length
  unchanged). (1) The camera paces each move by distance along its path,
  not by waypoint count, so it no longer speeds up and slows down at
  waypoints; the look turns with distance too. (2) 04 → 05: a waypoint
  takes the camera round the junk instead of almost through its stern (now
  about 11 m clear), the junk's hidden 05 mark moves out of the path, and
  it fades only after it has left the frame. (3) 02 → 03: the Clock Tower
  slides out steadily instead of holding and then whipping off (desktop
  turn re-timed with `viaTurn`, both waypoints re-routed). (4) Phones: the
  junk's hidden 03 mark is outside the frame, so it no longer appears
  half-faded in 02 → 03 and 03 → 04, and the ferry is shown before it
  enters the frame in 02 → 03. (5) Chapter copy waits for the damped
  camera, so a quick scroll no longer shows the next chapter's text over
  the previous view; a nav jump of one chapter now goes behind the veil
  (`jumpThreshold` 0.9; at 1 a jump of exactly one chapter flew through). (6) Phones: 香港 and 01's copy are gone
  by 40% of the sink (was 60%), before they cross the moon and skyline.
  Files: `src/scroll/cameraRig.js`, `src/data/chapters.js` (camera `via`
  and `viaTurn` for 02 and 04, junk marks in 03 phones and 05,
  `jumpThreshold`, phone wordmark `fadeEnd`), `src/main.js` (junk and
  ferry gate windows, damped copy, phone hero fade),
  `src/ui/copyLayer.js`; plan: `README.md` ("Transitions"). Evidence in
  `review-shots/transitions/fix/`.
- **Global print texture: keep clean** (user choice, 2026-10-03): a
  temporary proof (`?texture=grain|print`, fixed CSS layer over the canvas
  with an original 128 px grain tile, soft vignette and fine halftone) was
  compared at identical frames. At the brief's starting values the grain
  moved pixels by only 1 to 3 levels, the halftone by at most 1, with no sky
  gain, so the site stays clean. The proof code and tile were removed; no
  site files changed.
- **Desktop counter and author credit** (user choices): desktop shows
  "01 / 06" under "Scroll to cross" on the opening screen, as phones do;
  the footer bar reads "© 2026 Gavin Fung", the colophon opens with
  "Created by Gavin Fung at HKAAA" with "HKAAA" linking to
  https://hkaiautomation.com/, and the head gains an author meta tag.
  Files: `index.html`, `src/styles.css`; docs: `FINAL-NARRATIVE-COPY.md`;
  plan: `interface.md`.
- **Typography system** (user request):
  self-hosted Cormorant Garamond 600, Inter variable 400 to 600, Noto Serif
  TC 600 and 700, Noto Sans TC 500 as WOFF2 subsets (101.2 KB total, all on
  first view) with OFL licences; four font tokens and the brief's roles and
  sizes; the canvas 香港 now Noto Serif TC 700 with one repaint when the font
  arrives; footer statement two lines on desktop, four on phones; copy
  regions widened for 03 desktop (bottom 32%), 02 phones (top 7.5%) and 06
  phones (right 66%) so the larger type fits. Layout shift 0 at all four
  reference sizes; JS bundle +0.4 kB. Files: `index.html`,
  `src/styles.css`, `src/scene/createWordmark.js`, `src/main.js`,
  `src/data/chapters.js` (copy regions only), `public/fonts/`; docs:
  `ASSET-LEDGER.md`, `TYPOGRAPHY-INTERFACE-BRIEF.md`; plan: `interface.md`.
- **Final copy** (user request): the approved `FINAL-NARRATIVE-COPY.md`
  is live. Six chapter bodies, kickers 04 ("Junk with red sails") and 05
  ("Two IFC"), page title, hidden H1, meta description and Open Graph
  title and description; placeholder markers removed; menu and footer
  return accessible names; footer landmarks with commas and without the
  Observation Wheel. Copy fit: footer statement three lines on desktop and
  four on phones (mark above it on phones), balanced footer headings.
  Status in `FINAL-NARRATIVE-COPY.md` set to approved. No scene, camera,
  animation or asset files changed. Files: `index.html`, `src/styles.css`,
  `docs/FINAL-NARRATIVE-COPY.md`; plan: `interface.md`.
- **Footer fireworks kept** (user request: too few fireworks behind the
  footer): instead of fading out, the bursts now dim to half strength and
  the smoke to 70% at the footer. Files: `src/scene/createFireworks.js`;
  plan: `interface.md`.
- **Footer polish** (user choices, all three items from the footer review):
  the statement, "Landmarks and vessels" column, colophon and bottom bar
  now use the approved wording (the inaccurate "every model and texture
  made in code" line is gone); the fireworks fade to thin smoke over the
  first 60% of the footer's rise; less empty space above the return
  button on phones (padding 72 → 40 px). Files: `index.html`,
  `src/styles.css`, `src/main.js`, `src/scene/createFireworks.js`; plan:
  `interface.md`.
- **06 left side** (user request: the left half under the copy read as
  empty): two supporting bursts on desktop (coral at 2.2 s with a smoke
  puff, small warm at 5.8 s) and one on phones (coral at 2 s), smaller
  and fainter than the right, all below the copy text; the cloud mass
  gains a dimmer tail sweeping left and a wisp under the left bursts
  (phones one wisp). Files: `src/data/chapters.js`,
  `src/data/atmosphere.js`; plan: README, `atmosphere.md`.
- **06 polish** (user choices, four of five items from the 06 review; the
  moon stays): bursts recoloured and moved to the storyboard's palette
  (warm-white hero twice per loop, coral support, one small cyan, upper
  right and top centre, the left dark); 06's clouds as one mass under the
  bursts; `accents` held at 0.25 through 06; the bursts now light nearby
  clouds in their colour through shared uniforms. Files:
  `src/data/chapters.js`, `src/data/atmosphere.js`, `src/main.js`,
  `src/scene/createAtmosphere.js`, `src/scene/createFireworks.js`; plan:
  README, `atmosphere.md`.
- **05 polish** (user choices, four of six items from the 05 review; the
  moon and searchlights stay): the camera close to the wheel so it reads
  as IFC's co-star at true scale (desktop wheel ~20% of the height, was
  15%; phones IFC ~70%, was 47%, wheel ~17%, was 8%); new `accents` level
  (05: 0.25) dims the LED crowns, strips and landmarks without darkening
  the windows; new `reflections` level (05: 2) lengthens and brightens
  IFC's and the wheel's water columns; 05's clouds as one mass. Files:
  `src/data/chapters.js`, `src/data/atmosphere.js`, `src/main.js`,
  `src/scene/createIsland.js`, `src/scene/createWater.js`; plan: README,
  `scene-city.md`, `atmosphere.md`.
- **04 junk bigger** (user choice: the camera, not the model): the junk
  read small for the hero reveal. The 04 camera's lens narrows (desktop
  66°, was 74.7°; phones 60°, was 79.9°), so on desktop the junk spans
  about 60% of the width (was 50%) and on phones the main sail rises to
  28% down the screen (was 41%), the junk turned further from the camera
  so the hull stays in frame and IFC a sliver at the right edge. The eye
  stays at 3 m for the 1.5 m camera clearance. Probe targets updated.
  Files: `src/data/chapters.js`; plan: README, `scene-models.md`.
- **04 polish** (user request; fixes made without a stop for approval):
  the junk's sails coral red (`#e23c34`) with stronger shading (darker
  head, glowing foot, a lighter belly in each panel) instead of one flat
  colour; the hull's own glow halved so it sits darker; a longer,
  brighter junk wake so a streak shows behind the stern; the skyline at
  40% in 04 as in 03; 04's clouds regrouped into one mass. Files:
  `src/scene/createVessels.js`, `src/scene/surfaces.js`,
  `src/data/chapters.js`, `src/data/atmosphere.js`; plan: README,
  `scene-models.md`, `scene-city.md`, `atmosphere.md`.
- **03 polish** (user choices, five of six items from the 03 review; the
  moon stays): the ferry's reflection kept under the hull and drawn as
  thin slivers near the camera (they scattered over the foreground as
  flat blobs); a longer, wider, faintly glowing ferry wake; the other
  towers and LEDs at 40% in 03 so IFC and the wheel lead; 03's clouds as
  one mass with the copy's corner calm; on phones the ferry moved closer
  (34 m, was 53 m) to fill about a fifth of the frame, as in the
  storyboard. Files: `src/scene/waterReflections.js`,
  `src/scene/createWater.js`, `src/scene/wakes.js`,
  `src/scene/createVessels.js`, `src/data/chapters.js`,
  `src/data/atmosphere.js`, `docs/plan/README.md`,
  `docs/plan/atmosphere.md`, `docs/plan/scene-city.md`,
  `docs/plan/scene-promenade.md`.
- **02 polish, follow-up** (user requests): the afterglow toned down to
  a soft dusky rose (was a bright red-orange that matched no other
  scene); the far-shore lights cut back to a short sparse run under the
  ridge, none on the open sea; the people stand still, mostly at railing
  B watching the sea, instead of walking. Files:
  `src/scene/createScene.js`, `src/scene/createIsland.js`,
  `src/scene/people.js`, `src/scene/createForeground.js`,
  `src/data/world.js`, `docs/plan/atmosphere.md`,
  `docs/plan/scene-city.md`, `docs/plan/scene-promenade.md`.
- **02 polish** (user choices, all seven items from the 02 review): a
  red-orange afterglow on the sky low on the right (desktop and phones,
  02 only) with the clouds as one overlapping mass instead of three rows;
  the water mirrors the afterglow in drifting bands; the ferry's wake
  longer and whiter; far-shore low-rise lights with dark land strips
  behind the ferry; railing B 1.3× with a lantern on every post; three
  puddles on desktop 02's empty paving, and every puddle now mirrors the
  Clock Tower; six people strolling on the promontory; on phones the
  city (35%) and Mid-Levels lights (50%) dimmed behind the tower. Files:
  `src/scene/createScene.js`, `src/scene/gating.js`, `src/main.js`,
  `src/scene/createWater.js`, `src/scene/createVessels.js`,
  `src/scene/createIsland.js`, `src/scene/createMountains.js`,
  `src/scene/lamps.js`, `src/scene/people.js` (new),
  `src/scene/createForeground.js`, `src/data/world.js`,
  `src/data/chapters.js`, `src/data/atmosphere.js`,
  `docs/plan/README.md`, `docs/plan/atmosphere.md`,
  `docs/plan/scene-city.md`, `docs/plan/scene-promenade.md`.
- **Palms on mobile 01** (user choice): after previewing the lower scene
  on phones, the palms at the Clock Tower's foot now show in the mobile
  hero and 01, as in the mobile storyboard; deck and railing stay hidden
  so the junk's reflection and glints keep the lower third. Files:
  `src/data/chapters.js`, `docs/plan/scene-promenade.md`.
- **Realistic puddles** (user request: too many, and they read as flat
  shapes on the paving): two placed puddles on the hero's deck instead
  of noise-scattered ones; ragged edges, soaked rims; inside, a traced
  mirror image of railing A with its lit lantern, a cloudy sky reflection
  and a slight ripple. Files: `src/scene/lamps.js`,
  `docs/plan/scene-promenade.md`.
- **01 polish, third round** (user choices): slope lights continue west
  of the Clock Tower, thinning and staying low (they stopped in a hard
  edge behind the tower); soft dark gradients behind 01's copy (over the
  tower's top at 16:10) and 東方明珠; the bauhinia tree set 1.5 m lower so
  its crown clears 東方明珠; railing A built 1.3× with a lantern on every
  big post (storyboard foreground; a camera move was left out because it
  would lift the railing behind 香); paving with weathered patches,
  mirror-like puddles and fallen petals. Files: `src/data/world.js`,
  `src/scene/createMountains.js`, `src/scene/createForeground.js`,
  `src/scene/lamps.js`, `src/styles.css`, `docs/plan/README.md`,
  `docs/plan/interface.md`, `docs/plan/scene-city.md`,
  `docs/plan/scene-promenade.md`.
- **01 polish: mountains, skyline colour and railing** (user choices
  after a second review of 01; paving, the big railing and the copy/tree
  notes not chosen for now). Mountains: the scattered slope dots read as
  floating specks; now 210 Mid-Levels towers drawn as lit window grids,
  four road-lamp strings (one up to the Peak), a Peak cluster, dimmed
  where windows would crowd into bars on phones; slopes get soft tonal
  patches. Skyline: half the lit roof bands turn a restrained LED colour,
  a fifth of the tall towers get LED corner strips, and a lamp line runs
  along Central's waterfront; IFC still the brightest. Railing: rails and
  slim posts shaded darker and cooler to match the posts (they read as
  rust-brown pipes), lantern pools reach 4.5 m (was 3.2) onto the rails
  and paving. Probe: only the four older misses. One more draw call in
  every hold (the waterfront lamps): desktop 01 214, mobile 01 149. Files:
  `src/scene/createMountains.js`, `src/scene/createIsland.js`,
  `src/scene/createForeground.js`, `src/scene/lamps.js`,
  `src/data/world.js`, `docs/plan/README.md`, `docs/plan/scene-city.md`,
  `docs/plan/scene-promenade.md`, `docs/plan/checks.md`,
  `docs/ASSET-LEDGER.md`.
- **01 polish: moon, water and bush** (user request): the first three of
  six improvements from a review of the hero and 01; mountains, railing
  and paving wait (listed in README, "01 polish"). Moon: eleven seas laid
  out like the real near side, faint and joined (the two seas above the
  ridge read as eyes), an evenly lit face instead of lit-ball shading, a
  soft corona and wide faint haze ("subtle mist around it"), and clouds
  near the moon catch its light at their edges; the yellow stays. Water:
  a dim violet-navy sky mirrored between the glints with soft drifting
  wave bands (it was pure black), glints capped at 6 px near the camera
  (they grew into flat blobs), skyline shimmer 0.08 → 0.11. Bush: moved
  2 m on along the railing so it ends left of 香 in the hero and the
  railing lantern it hid shows, still framing the 01 hold's corner;
  flowers in 16 clusters, a few sprigs past the crown, eleven lumps.
  Probe: only the four older misses. No new draw calls, textures or
  shaders; JS 211.8 KB gzip. Files: `src/scene/createMoon.js`,
  `src/scene/createAtmosphere.js`, `src/scene/createWater.js`,
  `src/scene/bauhinia.js`, `src/data/world.js`, `docs/plan/README.md`,
  `docs/plan/interface.md`, `docs/plan/atmosphere.md`,
  `docs/plan/scene-promenade.md`.
- **Chapter 03 ferry pass and foreground direction** (user request and
  choice): no foreground cutouts, spray or camera-facing mist in 03;
  depth and motion come from the existing ferry and harbour instead. The
  ferry sails on toward Central through the 03 hold (1.5 m up to the
  keyframe, 6 m on; phones 5 m), bobs, rolls and pitches slightly, and on
  the way to 04 sails slowly (about 50 m instead of 475 m) so the camera
  overtakes it: its cabin slides out past the left edge and its bow
  uncovers the junk, which now comes up from beyond it. A natural
  occlusion, no wipe; built on desktop and phones. The wake gains a
  propeller wash and a band of darker, disturbed water with a second foam
  layer. The water reflections gain the Observation Wheel and a slow swell
  that ripples the columns of the ferry, wheel and skyline (desktop now
  reflects up to 9 lights). Haze unchanged: in 03 it is only the far shore
  mist behind the ferry. Foreground direction recorded: no rule of two
  cards per chapter, a 3D or built foreground per chapter, one optional
  pier canopy, bollard or chain test reserved for 05 (not started), no
  large cutouts on phones. The rejected card test's notes are cleared from
  the area files; its generated artwork is kept, unused, with a status per
  piece. Probe: only the four older misses. Draw calls desktop 04 94 (was
  93), others unchanged; JS 210.9 KB gzip. Files: `src/scene/vesselRoutes.js`
  (new), `src/scene/createVessels.js`, `src/data/chapters.js`,
  `src/scene/wakes.js`, `src/scene/waterReflections.js`,
  `src/scene/createWater.js`, `src/main.js`,
  `docs/references/foreground-pass-candidates/MANIFEST.md`,
  `docs/plan/README.md`, `docs/plan/scene-models.md`,
  `docs/plan/scene-city.md`, `docs/plan/scene-promenade.md`,
  `docs/plan/checks.md`, `docs/ASSET-LEDGER.md`.
- **Bauhinia bush and realistic foliage** (user requests): the 2.5D
  foreground-card test (railing and flower cutouts on planes at the lens,
  Hero and 01) read "very weird" and was removed before it was committed.
  In its place a low bauhinia bush stands on the arrival promenade inside
  railing A, filling the bottom-left of the hero and 01 on desktop, gone
  early in the move to 02. The tree and the bush now share a foliage atlas
  cut from the user's artwork (leaf from the cluster's leaf lobe, flowers
  from the drifting petals' artwork, buds from the cluster), with flowers
  turned toward the camera, crown shading and a little more glow, so they
  read like the petals. Both foliage materials draw in one pass. Draw calls
  desktop hero 216, 01 213 (were 214 and 211); phones unchanged; JS 209.7 KB
  gzip. Files: `src/scene/bauhinia.js`, `src/scene/surfaces.js` (old atlas
  removed), `src/scene/createForeground.js`, `src/data/world.js`,
  `src/data/chapters.js`, `src/main.js`,
  `public/atmosphere/bauhinia-foliage.webp` (new), `docs/plan/scene-promenade.md`,
  `docs/plan/checks.md`, `docs/ASSET-LEDGER.md`.
- **Bow spray removed** (user request and choice): the splash on the
  ferry and junk still looked forceful and unrealistic. The artwork is a
  breaking wave throwing droplets, so no size or strength fixes that; a
  bow foam built in code was offered and declined. The wakes stay the
  boats' only white water. Draw calls back to desktop 01 211, phone 01
  148; JS 209.4 KB gzip; `?off=spray` gone. Files: `src/scene/spray.js`
  and `public/atmosphere/harbour-spray.webp` (deleted),
  `src/scene/createVessels.js`, `src/data/atmosphere.js`, `src/main.js`.
- **Milestone 2 review** (build step 6, user request): 14 hold screenshots
  (hero and 01–06, desktop and phone), the composition probe, copy
  overflow at three sizes, parallax corners, navigation, reduced motion,
  fallback, and laptop frame rates on the real GPU (60 fps, 1% low 57.7).
  Checks 1–5 pass with the known misses. The user approved 01 and raised
  the budgets (draw calls ≤ 100 → ≤ 220; generated textures ≤ 4 → ≤ 32
  small code-drawn ones), so **Milestone 2 is closed**; the phone
  re-measure is carried to Milestone 5 (user choices). Files:
  `docs/milestone-2-review/` (new), `docs/plan/README.md`,
  `docs/plan/checks.md`, `docs/plan/HANDOFF.md`.
- **Junk spray as a bow wave** (user request and choice): in desktop 04
  the junk's 15 m spray card along the hull read as a wave crashing into
  its side, too violent for a junk that "slides alongside". Now a small
  bow wave at the stem (5.5 m, the low right-hand part of the art, its
  cut edge feathered, fainter). Phones barely change; the ferry's spray
  is unchanged. Spray cards can now use part of the artwork (`crop`).
  Files: `src/scene/spray.js`, `src/data/atmosphere.js`.
- **Film grade** (user choice; colour pass, README "Open" 6): the whole
  frame is graded in the glow's last pass: contrast round the night's
  mid-tones, indigo shadows, warm highlights, a little more colour where
  it is weak. 01 clearly improved (deeper indigo sky; warmer Clock Tower,
  moon and sails; IFC leads more), so it stays, in every chapter. ACES
  and AgX were tried and rejected (crushed or bleached; grey haze).
  No extra pass; `?grade=0` turns it off. Files: `src/scene/bloom.js`,
  `src/scene/createScene.js`, `src/main.js`.
- **Bow spray** (user choice): white water at the ferry's and junk's
  bows from the staged `harbour-spray.webp` (now in
  `public/atmosphere/`), because the flat wakes read thin at wave
  height. One camera-facing card per boat, dimmed for night and fogged;
  its depth is pulled toward the camera so the hull's near side doesn't
  hide it; calmer at holds, stronger while the boat moves, a slow swell
  under 6%, still in reduced motion. One draw call per visible boat.
  `?off=spray` hides it. Files: `src/scene/spray.js` (new),
  `src/scene/createVessels.js`, `src/data/atmosphere.js`, `src/main.js`,
  `public/atmosphere/harbour-spray.webp`.
- **Searchlights** (user choice): four soft beams from the Central
  landmark rooftops (not IFC) sweep slowly over 13–17 s, each in its own
  range so they never cross; desktop 01 at 60%, 05 full, phones two beams
  in 05 only; gone before the fireworks; held and dimmed in reduced motion.
  `?off=beams` hides them. Files: `src/scene/createSearchlights.js` (new),
  `src/data/atmosphere.js`, `src/data/chapters.js`, `src/main.js`.
- **Less cloud in phone 06** (user request): three cloud cards → one lit
  bank between the bursts and IFC's crown, so the fireworks open on dark
  sky (mobile 06 58 draw calls). Files: `src/data/atmosphere.js`.
- **Phone 01 clouds as one deck** (user choice): three full-width strips
  at even steps read as stripes. Now one dim deck from the top to the moon,
  a small lit bank off-centre left and the bright bank just above the moon
  (four cards → three; mobile 01 148 draw calls). The user is not
  re-measuring phone fps for now (iPhone 16 expected). Files:
  `src/data/atmosphere.js`.

## 2026-10-02

- **Cloud ceiling** (user request; choices: storyboard ceiling, wind,
  same artwork): the clouds were too thin (12–20% opacity), too few (one
  strip per chapter, two cards on phones) and static (a 1.2% sway over two
  minutes). Now every chapter on desktop and phones has a dim back layer
  roofing the sky and a front layer of lit banks (5–7 cards desktop, 3–5
  phones, 30–70%), each card showing only in its own chapter and
  crossfading across the move. The wind scrolls the art through each
  card's fixed window, front 0.3% of the frame per second and back half
  that, so the clouds move but never cross the copy, moon or IFC; still in
  reduced motion. Cards now face their chapter camera's image plane, so
  frames that look up don't tilt them. The `clouds` level in
  `chapters.js` is gone. Draw calls about 2–4 more per hold. Files:
  `src/scene/createAtmosphere.js`, `src/data/atmosphere.js`,
  `src/data/chapters.js`, `src/main.js`.
- **Bauhinia petal artwork** (user choice): the drifting petals and the
  tree's falling petals now use the user's `bauhinia-petal.webp` (29 KB):
  its own fuchsia, pale veins, wavy edges and curled stalk, dimmed for the
  night in four shades. Motion, counts and densities unchanged. Files:
  `src/scene/createPetals.js`, `src/scene/bauhinia.js`,
  `public/atmosphere/bauhinia-petal.webp`.
- **Automatic phone sharpness** (user choice): the iPhone 11 switch test
  showed pixel count is the only cost that matters in 02 (pixel ratio 1.25:
  43 fps against about 34; glow, edge smoothing and water: no gain). Phones
  now start at 1.5 and drop once to 1.25 if they average under 40 fps; the
  glow stays on. Phones that keep up stay sharp. Files: `src/main.js`.
- **Phone measurement switches** (user choice): the lighter palms left
  phone 02 at 31–36 fps, so the cost is per pixel, not triangles. New
  address-bar switches let the user test on the iPhone what costs most:
  `?dpr=`, `?aa=0` and `?off=water,clouds,mist,palms,petals` (with the
  existing `?bloom=0`); the `?fps` box shows which are on. Files:
  `src/main.js`, `src/ui/fpsOverlay.js`.
- **Lighter palms** (user choice): each palm drew four times (back and
  front passes of both its depth twin and its colour); now it draws twice,
  and two palms left of the phone frame are desktop-only. Phone 02 drops
  from 73k to 52k triangles with no visible change. Files:
  `src/scene/palms.js`, `src/data/world.js`.
- **No more shader stutter between chapters** (user request, after the
  first iPhone 11 reading): the move from 01 to 02 stuttered because 32
  shaders were built mid-scroll. Every shader is now built in one unseen
  frame before the loading screen lifts, and the ferry and junk lights stay
  in the scene at zero while their boat is hidden (a change in the number
  of lights had forced new versions of every lit shader). No visible
  change. Files: `src/main.js`, `src/scene/gating.js`.
- **Fireworks smoke lighter, second phone wisp** (user request and
  choices): every wisp is a third weaker (at most 10.5% opacity instead
  of 16%), and phones gain a lavender wisp under the left cyan burst that
  gathers as the coral wisp thins. Files: `src/data/chapters.js`.
- **Fireworks step 3, smoke** (user request): faint violet, coral and
  lavender smoke gathers beside and below the biggest bursts as they fade,
  then grows, drifts and thins over 5 s (three wisps on desktop, one on
  phones, at most 16% opacity, behind the bursts and clear of the copy).
  The falling sparks stand in for the embers. This completes the
  fireworks. Files: `src/scene/createFireworks.js`,
  `src/data/atmosphere.js`, `src/data/chapters.js`,
  `public/atmosphere/firework-smoke.webp` (re-encoded to 1200 × 600,
  285 KB, to meet the 300 KB aim).
- **Fireworks step 2, the show** (user choices): the 06 bursts play in a
  fixed 8 s loop: a rocket climbs from behind the skyline, the burst
  ignites at 70% size with a soft flare, opens, cools and fades, and
  sparks fall from its tips in drooping streaks. Two to four live at a
  time; entering 06 starts at a composed moment; reduced motion holds one.
  Files: `src/scene/createFireworks.js`, `src/data/atmosphere.js`,
  `src/data/chapters.js`, `src/main.js`.
- **Fireworks step 1, still bursts** (user choice): the four ring markers
  in 06 are now firework bursts from the shared `firework-burst.webp`,
  spun, mirrored and tinted so no two match (warm keeps the art's gold).
  Four were too few and too weak (user request), so there are eight on
  desktop and six on phones, about 35% bigger, with a stronger centre
  glow; the phone keeps a 35% remnant. Step 2 will animate these cards
  and add our own three.js rockets and sparks (user choice; the shared
  React component is a technique reference only). First of three steps
  in `ATMOSPHERE-EFFECTS-BRIEF.md` §6.7. Files: `src/scene/createFireworks.js` (new),
  `src/scene/createForeground.js`, `src/main.js`, `src/data/atmosphere.js`,
  `src/data/chapters.js`, `public/atmosphere/firework-burst.webp`.
- **Plan split** (user choice): `docs/MILESTONE-2-PLAN.md` became
  `docs/plan/` (this changelog, a short README and one file per area), so
  each update edits one short file. The old file is now a pointer.
  `.cursor/rules/keep-plan-updated.mdc` points here.
- **04 far shore removed** (user choice): the far shore lights added the
  same day read as extra buildings, and their reflections were about twice
  as bright as the skyline's own shimmer (mean luma 10 against 5). Lights
  and reflections are gone; the stronger 04 cloud stays. Files:
  `src/scene/farShore.js` (deleted), `src/scene/createIsland.js`,
  `src/scene/waterReflections.js`, `src/data/world.js`.
- **02 end of the skyline left dark** (user choice): no lights between
  the last towers and the ferry, so the ferry stands out. No code change.
- **Phone "01 / 06" stays on the opening screen only** (user choice). No
  code change.
- **Hero chapter numbers removed on desktop** (user request): only "Scroll
  to cross" remains. Files: `index.html`, `src/styles.css`.
- **Promenade lamps re-spaced** (user request): they bunched beside the
  Clock Tower on wide windows. File: `src/data/world.js`.
- **Stronger 04 cloud** (user choice): 45% before the chapter fade (was
  20%), a little wider. File: `src/data/atmosphere.js`.
- **Desktop mist unjoined** (user choice): no shore mist in desktop 01;
  the 05 left drift is a 180 m section. Files: `src/data/chapters.js`,
  `src/data/atmosphere.js`.

## Files changed in Milestone 2 up to the split

The old section 7, unchanged.

- `index.html`: hero section, header and nav, menu, counter, vertical text.
- `src/styles.css`: shell styles, overlay and vignette, new copy positions.
- `src/data/chapters.js`: copy regions, new `hero` block. (The Chinese labels
  ended up in `index.html`, next to the menu's copies of them.)
- `src/main.js`: wire up the new pieces.
- `src/ui/copyLayer.js`: shares chapter 01's fade with the vertical title.
- New: `src/ui/siteHeader.js` (nav, menu, counter, vertical label, side pager), `src/scene/createWordmark.js`,
  `src/scene/createMoon.js`, `src/ui/cursorRing.js`,
  `src/ui/pointerParallax.js`, `src/scene/createPetals.js`,
  `src/scene/createGlow.js`.
- `src/data/world.js`: the `moon` block.
- `src/data/chapters.js`: `petals` density in chapters 05 and 06; desktop
  `parallax` multipliers in 05 and 06.
- `src/scroll/cameraRig.js`: the parallax orbit (`setParallax`, `PARALLAX`);
  `poseFov` and the per-pose `keepHeight` option (Clock Tower rebuild).
- `src/scene/createWater.js`: glassy water, ripples sampled blurred (`BLUR`).
- New: `src/scene/surfaces.js` (code-drawn surface textures; ferry upper
  deck, cabin and hull redrawn with the ferry rebuild; Clock Tower shaft,
  pilaster and crown textures and Roman-numeral dials redrawn with the tower
  rebuild), `src/scene/cityWindows.js` (lit-window grid shader; floor
  strips and the `glow` option, user choice, 2026-10-02) and
  `src/scene/strut.js` (shared helper for thin rods: ferry masts, tower
  mast).
- `src/scene/createLighting.js`: lower sky fill.
- `src/scene/createKowloonEdge.js`: textured Clock Tower, dials, floodlight;
  Kowloon windows. Then the Clock Tower rebuilt from photos at real
  proportions (pilasters, bracketed cornice, two crown stages with scrolls,
  columns and balconies, dome, lattice mast, three Roman-numeral dials,
  arched lit door, golden glow all the way up; user request, 2026-10-01).
- `src/scene/createIsland.js`: Central and IFC windows. Then IFC rebuilt
  from photos (recessed-corner tiers, face slots, bronze bands, floodlit
  top, crown fins), a lit IFC Mall podium, the Central Ferry Piers, and the
  Observation Wheel rebuilt at true scale (truss rim, cable spokes, glowing
  hub, 42 gondolas, A-frame legs, tents) and turning (user request,
  2026-10-02).
- `src/main.js`: turns the wheel each frame in continuous mode.
- `src/data/world.js`: IFC podium, wheel radius 27.5 m and hub height,
  Central Ferry Piers positions.
- `src/data/chapters.js`: mobile 01 IFC right target 89% for the true width.
- `src/scene/surfaces.js`: the wheel's hub glow.
- `src/scene/createVessels.js`: Star Ferry reshaped, then rebuilt from photos
  (lofted hull, rubbing strip, tyres, open lower deck with lit cabin, green
  band, upper deck with bridge ends and life rings, roof canisters, funnel,
  tripod masts, rigging, navigation lights, foam skirt following the hull
  (replaced by a wake on the water, part 3f);
  shared outline and ribbon helpers); rebuilt junk (lofted
  hull, deckhouse, canopy, rails, tyres, rudder, battened sails, rigging;
  masthead pennants removed, user request, 2026-10-01); vessel lights.
- `src/data/chapters.js`: re-solved chapter 04 camera and junk positions
  for the junk's real proportions; re-solved desktop 03 camera and ferry
  position for the rebuilt ferry's masts; desktop 02 re-solved for the
  bigger Clock Tower (closer, lower, looking up; new tower, ferry and
  horizon targets; `keepHeight`).
- `src/ui/composition.js`: the probe skips parts marked `noProbe` (rigging).
- `src/scene/gating.js`: faded copies keep shader patches; meshes with one
  material per face fade too.
- `src/scene/createForeground.js`: depth-only twins for a clean railing
  fade, seawall strip top 5 cm below the deck.
- `src/data/world.js`: railing B on the promontory's harbour edge; the
  big 02 palm moved left, clear of the tower, and the small palm by the
  tower's foot moved right (user request, 2026-10-01).
- `src/ui/debug.js`: wordmark position in the probe; `clearance()` takes a
  `parallax` option.
- `src/scene/createForeground.js`: the stone railing (instanced bays,
  posts, wave panels, lanterns, glows) and the tall promenade lamps (user
  request, 2026-10-02).
- New: `src/scene/lamps.js`: railing layout, the list of promenade lights,
  `addLampLight` (warm pools faked in a material) and the instanced glow
  material.
- `src/scene/surfaces.js`: railing granite and post panel textures.
- `src/data/world.js`: `foreground.lamps` positions; railing runs on every
  edge near the Clock Tower (`railings` that fade, `edgeRailings` that
  always show; user request, 2026-10-02).
- `src/data/chapters.js`: the 香港 wordmark raised over the boats (`HERO`
  feet at 74% desktop, 73% mobile; user request, 2026-10-02).
- `src/scene/lamps.js`: `addWetPaving` (slabs, wet patches and lamp
  reflections on the promenade tops) and `TOWER_FLOOD`;
  `src/scene/surfaces.js`: `promenadePaving` slab tile;
  `src/scene/createKowloonEdge.js`: the wet-paving ground material, weaker
  lantern pools on it; `src/scene/gating.js`: faded copies keep the program
  cache key (user request, 2026-10-02).
- `src/data/chapters.js` and `src/scene/createWordmark.js`: mobile 香港
  floats in the sky (`depth` placement, feet at 42%, width 78%);
  `index.html`: hint "Scroll to cross", the new footer with the pill
  "Return to the harbour" button at its top (moved out of 06);
  `src/styles.css`: pill button, footer, the chapter layer fading as the
  footer rises (the nav bar is not forced back); new `src/ui/siteFooter.js`
  (`--footer-in`, `is-at-footer`), started from `src/main.js` (user
  requests, 2026-10-02).
- New: `src/scene/palms.js` (two 3D palm shapes, sway and leaflet
  cut-out shader, instanced meshes with fade twins, mobile-only palms);
  `src/scene/surfaces.js`: `palmAtlas`; `src/scene/createForeground.js`:
  the palms replace the flat cards, `update` and `setBreakpoint`;
  `src/data/world.js`: nine palms with shapes, the water palm moved onto
  land; `src/scene/gating.js`: per-key fade windows; `src/main.js`: the
  palms' late fade-in and early fade-out, sway in continuous mode only
  (user request, 2026-10-02). Then three desktop-only palms in
  `src/data/world.js`, and `palms.js` shows palms per breakpoint (user
  choice, 2026-10-02).
- New: `src/scene/bauhinia.js` (the bauhinia tree: skeleton, wood tubes,
  instanced leaf and flower cards with flutter and glow, falling petals,
  fade twins); `src/scene/surfaces.js`: `bauhiniaAtlas`;
  `src/scene/createForeground.js`: the tree as the `bauhinia` group;
  `src/data/world.js`: `foreground.bauhinia`; `src/data/chapters.js`:
  `bauhinia` in every visibility, 1 only in desktop 01; `src/main.js`: the
  `bauhinia` gating target; `src/scene/createPetals.js`: the wind turned
  toward screen left, shared petal texture, colours and wind (user choice,
  2026-10-02).
- New: `src/scene/waterReflections.js` (the lights the water reflects:
  IFC, Clock Tower, moon, ferry, junk; `cityStrip`, the skyline summarised
  along the island front); `src/scene/createWater.js`: the glint shader
  (glows with ragged edges and soft ends, sliver glints, skyline shimmer),
  the rim light's and point lights' glare removed, the plane cut into
  64 × 64 squares, `setSources`, `setFade`, `setCity` and `reflect`
  (per-frame culling); `src/main.js`: the lights, the skyline strip, fades
  tied to the ferry, junk and IFC gating, `water.reflect` before each render
  (user choices, 2026-10-02; reworked twice the same day, user requests).
- Central buildings and mountains (step 5, stop 6; user choices,
  2026-10-02): `src/scene/cityWindows.js` gains a `maxLit` cap;
  `src/scene/createIsland.js` dims the skyline windows (part 1);
  `cityWindows.js` `close` option, `createIsland.js` `setCityLevel`,
  `src/data/chapters.js` `city: 0.6` in 05, `src/main.js` the `city` gate
  over the whole move (part 1b). New
  `src/scene/createMountains.js` (three shaded ranges with jagged ridges
  and a moonlit edge, the mist band, the slope lights), replacing the
  mountain code in `createIsland.js`; `src/data/world.js` (the Peak outline,
  the third range, mist and lights); `src/scene/createMoon.js` (draw order)
  (part 2). New `src/scene/landmarks.js` (Bank of China Tower, Cheung Kong
  Center, Central Plaza, The Center, masts, warning lights) and
  `src/scene/prism.js` (the shared extrusion helper, moved out of
  `createIsland.js`); `createIsland.js` varied skyline tops and landmark
  clearance, `setCityLevel` also dims the landmarks; `src/data/world.js`
  `landmarks` (part 3). `cityWindows.js` `dark` option and fewer lit
  skyline windows in `createIsland.js` (part 3b). `cityWindows.js` `vary`
  option and `cityDensity`, new `src/scene/cityDots.js` (window dots on far
  towers), `createIsland.js` shared `SKYLINE_WINDOWS` settings (part 3c).
  `cityWindows.js` `citySoft` (softer single-window edges on phones),
  `src/main.js` (antialiasing on phones too, sets `citySoft` per
  breakpoint), `src/scene/landmarks.js` (comment only), `createIsland.js`
  3–6% lit skyline, `src/data/chapters.js` `city: 0.6` in 06,
  `cityDots.js` dots sized in metres (part 3d). New `src/scene/facades.js`
  (painted curtain walls, metre UVs, phone mipmap bias); `createIsland.js`
  IFC uses them in place of the window shader; `src/main.js` sets
  `facadeBias` per breakpoint (part 3e, step 1). `facades.js` per-tower
  colours and levels, `braceWall` (Bank of China skin), neon line mask,
  UVs for angled walls; `src/scene/landmarks.js` paints all four
  landmarks with them (part 3e, step 2); `createIsland.js` IFC Mall
  podium painted the same way, and the ferry pier halls' colonnade painted
  with `pierHall` in place of modelled posts (part 3e). New
  `src/scene/wakes.js` (flat wakes that stream past the boats);
  `createVessels.js` wakes in place of the ferry's foam skirt, updated
  each frame; `surfaces.js` foam strip removed, junk waterline darkened;
  `waterReflections.js` hull sources; `createWater.js` hull mirror images
  that hide the glints behind them (part 3f). New `src/scene/cityLight.js`
  (street glow and sky in the glass) used by `facades.js` and
  `cityWindows.js`; `createIsland.js` uplit IFC crown fins (part 3e,
  step 3). `cityWindows.js` lights offices on each floor and gains a
  `ribbon` option (curtain-wall towers), used by `createIsland.js` and
  `createKowloonEdge.js`; `cityDots.js` dots in runs on one floor (part
  3e, step 4). New `src/scene/bloom.js` (glow round bright lights);
  `createScene.js` adds it and draws the overlay layer after it;
  `createWordmark.js` and `createPetals.js` (near petals) on the overlay
  layer; `src/main.js` sets the glow per breakpoint, `?bloom=` and the
  phone frame-rate fallback (part 3e, step 5). New
  `src/scene/createAtmosphere.js` and `src/data/atmosphere.js` (coral
  cloud cards, then the harbour mist belt), `public/atmosphere/coral-clouds.webp`
  and `public/atmosphere/harbour-mist.webp`; `src/main.js` adds, places and
  fades them; `src/data/chapters.js` gains `clouds`, `mist` and `seaMist`
  levels per chapter (part 3g). (`src/scene/farShore.js`, far shore
  lights in 04, was added and removed the same day; see 2026-10-02 above.)
- Chapter counter numbers removed (3.3, user request, 2026-10-02):
  `index.html` and `src/styles.css`; the hint and the phone's "01 / 06"
  stay.
- Promenade lamps re-spaced (2026-10-02): `WORLD.foreground.lamps` in
  `src/data/world.js`.
- Loading screen (3.12; user choice, 2026-10-02): `index.html` (inline
  `is-booting` script and 12 s safety timer), `src/styles.css` (poster art,
  copy and footer hidden while loading and during the fade),
  `src/main.js` and `src/ui/fallback.js` (lift `is-booting`).
- Publishing (user choice, 2026-10-02): `vite.config.js` builds with the
  base `/hongkong/` on GitHub; new `.github/workflows/deploy.yml` builds and
  publishes to GitHub Pages on every push to `main`; `.gitignore` keeps the
  reference images of unknown rights and the AI-made references local.
- `docs/ASSET-LEDGER.md`: entries for the railing art and any font; the
  stone railing and lamps built in code from the user's designs; the wet
  paving; the palms; the bauhinia tree; the skyline reflections.
