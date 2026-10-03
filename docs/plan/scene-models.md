# Look test, lit windows and the rebuilt models

Part of the Milestone 2 plan (index: [README.md](README.md)). Old section 4, items 1–3 (halftone, lit windows with the step 2b model rebuilds: ferry, Clock Tower, IFC, wheel, junk; glow).


## 4. Look test (frame 01 only)

Each layer below is added one at a time and screenshotted before and after.
The goal is to judge the finished look on one frame, then decide what goes to
all six.

1. **Halftone overlay and vignette.** A CSS layer between the 3D canvas and
   the text: a fine diagonal-line or dot pattern at low opacity, plus a soft
   darkening at the edges. It sits under the text, so contrast doesn't drop.
   Costs almost nothing to render.
2. **Lit windows (built 2026-10-01, with 2b).** A window grid on every
   skyline building and IFC, drawn in the shader in world metres (3.6 m
   storeys, 3.2 m bays; IFC 4 m × 2.6 m, mostly cool white), so it doesn't
   stretch with each box (`src/scene/cityWindows.js`). Each building gets its
   own share of lit windows (Central 30%, since 2026-10-02 20% capped at 30%,
   step 5 stop 6; Kowloon 22%; IFC 45%, now 50%), warm with a
   quarter cool. Unlit windows are darker glass. Where a window shrinks to a
   couple of pixels, the grid fades to its average glow, so distant towers
   can't shimmer.
   - **Floor strips and a warmer IFC (user choice, 2026-10-02).** IFC read
     as a flat grey-blue slab in 01: at 1.4 km its 2.6 m bays are about
     2.3 px wide, so the grid had faded about three-quarters of the way to
     its average, a dim cool glow on cool glass. Each direction now fades
     on its own: when bays get too narrow but floors are still a few pixels
     tall, each floor becomes a strip of lit and dark runs of four bays, as
     a tower reads from across the harbour; only when floors or runs get too
     small does the wall fade to its average. IFC's windows are warmer
     (cool share 45%, top tiers 60%, was 75% and 85%), lit 50% (was 42%),
     brighter (strength 1.25, top tiers 1.4) and its faded glow stronger
     (`glow` 0.5, was 0.35). The skyline towers in 01 gain floor strips
     too. Checked: 1 cm camera steps as before (holds 1–5: 19,197 /
     16,776 / 14,806 / 12,968 / 6,640 px); at scroll speed (1.5 m per frame)
     the 01 skyline changes 6.7% of pixels (5.6% before), from the extra lit
     detail; the Clock Tower is unchanged. On mobile 01 IFC is too small
     for strips and shows the warmer average glow.
   Still to try: a brighter band of ground-level lights along
   the Central waterfront, as in the storyboard (user reminder, 2026-10-01).
   Partly done with the lit Central Ferry Piers (2b, 2026-10-02).
2b. **Lighting and surfaces (user request, 2026-10-01: "why Kage's torii and
   temple look so real … everything looks very plain"; "go ahead and try").**
   Kage's models are as simple as ours; its realism comes from darkness,
   warm-and-cold light, textured surfaces and photo-like foreground cutouts.
   This step does the first three in code:
   - **Darker night:** the sky fill light drops from 2.2 to 0.8
     (`createLighting.js`), so local lights carry the frame. The cyan rim
     light is unchanged (it made the moon path on the water). Since the
     water reflections (step 5, stop 5; user choice, 2026-10-02) the water
     ignores the rim light and the boats' point lights: no cyan glare and
     no hot blobs under the boats; drawn glitter reflections take their
     place.
   - **Warm local lights (3 point lights):** a floodlight at the foot of the
     Clock Tower's harbour face (bright brick low, fading up the shaft), the
     ferry's cabin light and the junk's deck lanterns (warm pools on the
     water). They ride on their objects, so they hide when a vessel is gated
     out.
   - **Clock Tower:** red brick with granite bands at each storey, corner
     quoins, arched windows (two lit) and a granite crown, plus lit clock
     dials with hour marks and hands. The brick is ~2 px on screen, so the
     mortar is faint and flat: sharp courses strobed while scrolling.
     (Replaced by the rebuild from photos below.)
   - **Star Ferry, reshaped (user request, 2026-10-01).** Compared with a
     reference photo, the box proxy read as a generic barge. The user chose to
     reshape it in code now, reversing the earlier "no interim reshape"
     decision. (A Meshy model was to replace it later; since the "no GLB"
     decision below, the code-built ferry is the final one.) Built from rounded (stadium)
     plan shapes, so both ends are round like the real double-ended boats:
     - green hull with a dark waterline, under a dark rubbing strip (fender);
     - lower deck painted green and upper deck white, each with big framed
       warm windows (2.4 m bays, brightness varies per window); the walls
       glow faintly, as deck lights would light them, so the paint still
       reads at night;
     - a white band between the decks and a canopy roof that overhangs the
       upper deck;
     - a wheelhouse and mast at each end, a short white funnel with a dark top
       in the middle;
     - a soft broken foam line at the waterline, standing in the water as a
       thin skirt so it can't flicker against the water surface.
     - 40 m long including the fender, roof about 8 m up, matching the old
       proxy so the framings hold (the first version was 1 m shorter and its
       end showed in 03 at the far-left mouse position).
   - **Star Ferry, rebuilt from photos (user request, 2026-10-01).** The
     user shared six daytime photos and asked for "all the details that make
     it look good". Compared with them, the reshape read as a black pontoon
     with a closed lower deck. Rebuilt (still 40 m × 9.5 m, double-ended):
     - **Hull:** shaped from 48 cross-sections, like the junk's: sides flaring
       out above the waterline, ends narrowing to a soft point and raking
       back, sheer rising 0.6 m to both ends. Bright green (was a dark teal
       that read black at night) with a pale line under a dark wooden
       rubbing strip and a dark band at the waterline; a faint glow of its
       own. Black tyre fenders in pairs and a group of three.
     - **Open lower deck:** a waist-high green bulwark with a rail, green
       posts every 2.6 m up to the band, a closed casing amidships, and a lit
       cabin wall 1.1 m behind the posts (strip lights, seat backs, a few
       passengers), so the light shows between real posts as the mouse
       moves. The ceiling under the band glows warm.
     - **Band and upper deck:** the band between the decks is green (was
       white). The upper deck has paired rectangular windows in pale frames
       (were rounded panes), lit warm, and dark bridge glass in the middle
       of each round end; its white glows enough to read white at night.
       48 white life rings hang all round it below the windows. The two
       wheelhouse boxes on the roof are gone (the real boat has none).
     - **Roof:** a slight overhang, twelve white liferaft canisters with red
       bands, a shorter plain white funnel with a black top (no emblem), and
       a tripod mast with a yard at each end, with thin stays to the funnel
       and roof ends and shrouds from the yards.
     - **Navigation lights:** white at each masthead, green to starboard and
       red to port at both ends; small unlit-material lamps, no new lights.
     - **Proportions:** roof 7.1 m above the water (was 8.15 m, about 15% too
       tall against the photos); mast tops 13.3 m. The night window colour
       stays warm amber (recommended; the photos are daytime).
     - **Framing:** the taller masts put the ferry's top at 18% in desktop
       03 against 24%, so the desktop 03 camera was re-solved (eye still
       2.2 m, field of view 56.9°, was 55.1°; ferry moved about 1 m). Mobile
       03 still passes unchanged.
     - **Checked:** all chapters within ±3% except the four older misses
       (open issue below); 03 within its band at all four mouse corners;
       camera clearance as before. With 1 cm camera steps no surface
       flickers: 03 changes on edges only (rings, window frames, posts,
       masts, rigging, petals, moon path), 22,350 changing pixels against
       18,881 after the reshape; 01 9,747.
     - **Rights:** the photos are looked at only, never stored (ledger,
       "Reference material"); no boat names, star emblem or watermark.
   - **Star Ferry in 03: motion, wake and the pass to 04 (user request,
     2026-10-03: "improve depth and motion using the existing Star Ferry
     and harbour", no cutouts, spray or camera-facing mist).**
     - **Sailing through the hold:** the ferry no longer stops while the
       copy holds. It sails 1.5 m up to the keyframe and 6 m on from it
       along its heading toward Central (phones 1.5 m and 5 m), so it
       slides from left toward the right and draws away a little; the
       keyframe framing is unchanged. Little before the keyframe, so its
       mast keeps clear of the copy. The pace blends into the moves, so it
       never stops dead (`drift` in `chapters.js`, `vesselRoutes.js`).
       The movement follows the scroll, so the composition still holds
       wherever the reader pauses; at rest the streaming wake, the bob and
       the moving reflections keep it alive.
     - **Riding the swell:** a bob of up to about 0.2 m from two slow
       waves, a roll of up to about 0.9° and a slight pitch (`SWELL` in
       `createVessels.js`; the junk keeps its gentler first motion).
     - **The pass to 04 (built, desktop and phones):** the ferry now sails
       slowly on toward Central through the move, about 50 m, instead of
       racing 475 m to the piers. The camera overtakes it on its starboard
       side, so its cabin slides out past the left edge while its bow
       first hides and then uncovers the junk, which now comes up from
       beyond it. Desktop: the ferry is never nearer than 16.7 m and covers
       at most about 19% of the frame, and only the left side (it never
       crosses IFC or the wheel); it has left the frame by 70% of the move.
       Phones: the same beat, farther off (about 27 m), gone by 45% of the
       move. No wipe: the frame is never covered. It waits behind the 04
       camera (desktop x 106, z −397), out of frame and too far for its
       cabin light to reach the junk; it stays hidden in 05 and 06.
       Vessel routes can now pass `via` points between chapters, as the
       camera's do (`vessels.*.via` in `chapters.js`).
     - **Haze:** unchanged. The only haze in 03 is the shore mist on the
       island waterfront about 800 m out, behind the ferry and round the
       skyline; none sits near the camera.
     - **Checked:** composition probe and copy overflow at 1440 × 900,
       1156 × 766 and phone: only the four older misses; IFC and the wheel
       stay clear through the hold and the pass. Draw calls: 03 unchanged
       (desktop 120, phone 116), 04 desktop 94 (was 93). Review shots in
       `review-shots/ferry-pass/` (not committed).
   - **Clock Tower, rebuilt from photos and bigger in 02 (user request,
     2026-10-01).** "In 02, make the clock tower bigger … the tree is
     blocking the clock tower." Measured against the user's photos, the old
     tower was too slim (8 m wide) and too tall (crown cornice 37.6 m, top
     54 m). The user's choices: real proportions and a closer camera; keep
     the tower's size on narrow windows; a golden floodlight all the way up;
     move the big palm so its leaves cross the bottom of the moon instead of
     the tower.
     - **Shaft:** 9 m square brick core up to 31.5 m on a 1.8 m granite
       plinth; rusticated granite pilasters at all four corners; three
       stone-framed sash windows up the harbour face (the middle one lit),
       three narrow windows under the cornice and an arched, lit doorway at
       the foot.
     - **Cornice and crown:** a moulding and a deep cornice on a row of small
       brackets at 31.8–32.7 m. Above it a brick stage with an arched
       opening, corner piers and four curved stone scrolls, then a smaller
       stage with columns and small balconies with railings, a drum and a
       dome (top about 44 m) and a lattice mast to 51 m, thin bracing lines.
     - **Clocks:** three lit dials (harbour face and both sides) 3.9 m
       across in stone rings, with Roman numerals ("IIII"), a minute track
       and hands at about twelve past seven (dusk).
     - **Light:** the floodlight stays at the foot of the harbour face (still
       3 point lights). Every brick and granite surface carries its own
       golden glow, brightest at the foot and still warm at the top, so the
       whole tower reads golden at night as in the photos.
     - **Narrow windows (`keepHeight`):** on desktop windows narrower than
       1.6, the camera normally widens its vertical field of view to keep
       the sides, which shrank the tower to about 60% of the screen height
       at 1024 × 850. Chapter 02 desktop now keeps its height and trims the
       sides instead (`keepHeight: true` in `chapters.js`, `poseFov` in
       `cameraRig.js`). The ferry target moved inward (60–84%) so it stays
       whole down to an aspect of about 1.1.
     - **Framing:** 02 desktop re-solved: tower 16–34% wide and 3–88% tall
       (was 18–32, 2–85). The camera is about 7 m closer (57 m from the
       tower), the eye is lower (4 m above the deck, was 5.1 m) and the view
       looks up more (horizon at 80%, was 75%), so the tower towers over the
       viewer; field of view 61.4° (was 60.7°). The camera sits where the
       IFC and the wheel both hide behind the tower at every mouse corner
       (the IFC used to peek out at the far right). Ferry target 60–84% wide,
       71–87% tall; the ferry sits about 10 m farther out. With the lower
       eye, railing B now crosses the bottom of the ferry's hull (clearing
       it would need a ferry about 30% bigger). Mobile 02 and 01 pass
       unchanged.
     - **Palms:** the big palm by the promenade moved 5.5 m left and 5.4 m
       farther from the camera (same 11 m height). Its leaves now cross the
       lower left of the moon and clear the tower at all four mouse
       corners; on a narrow window it is trimmed off. On mobile the small
       palm at the tower's foot moved 5.3 m right, clear of the tower base;
       it now stands just behind the right-hand palm.
     - **Checked:** all chapters within ±3% except the four older misses;
       02 within its band at all four mouse corners; camera clearance at
       least 1.67 m, as before. With 1 cm camera steps no surface flickers:
       02 changes on edges only (17,711 changing pixels), 01 11,088.
     - **Rights:** the user's photos (and stock photos) are looked at only,
       never stored or traced; no signage lettering or logos from the
       buildings behind the tower.
   - **IFC, Observation Wheel and Central Ferry Piers, rebuilt from photos
     (user request, 2026-10-02).** "Now I think we can focus on the IFC and
     wheel." The user shared ten photos (day, dusk and night, two of them from
     Tsim Sha Tsui at our viewing angle). The user's choices, all as
     recommended: cool white crown, red-pink wheel, true-scale wheel, a slow
     turn, and the lit piers in this pass.
     - **IFC:** a 57 m square plan with recessed corners (pale corner piers
       keep each corner square in silhouette, with the recess behind),
       straight to 285 m, then seven shallow setbacks that round the top off
       like the real tower's; a slot down the middle of each upper face. Four
       horizontal bronze refuge-floor bands on the shaft replace the old
       vertical bronze stripes, which the real tower doesn't have. Windows
       at the real storey height (4.6 m), mostly cool white; the upper tiers
       are lit more densely and the top three tiers are floodlit white. The
       crown is a ring of 24 tapering fins around a lit core, tallest at the
       corners and dipping toward each face's slot, about 413 m to the tips
       (412 m in life; the old proxy reached 417 m). Every wall faces x or z,
       which the window grid needs.
     - **IFC Mall podium:** a low lit block at the tower's foot, kept out of
       the IFC group so the probe measures the tower alone.
     - **Observation Wheel:** true scale, 60 m to the top of the rim (was
       66 m). A red-pink lit truss rim (two rings joined by zigzag lacing),
       28 cable spokes from each side of a wide hub, a glowing white hub disc
       with a soft halo, 42 violet lit gondolas hung outside the rim and
       always upright, four white tubular legs in A-frames front and back, and
       a boarding platform with five white tents. It turns once every 4
       minutes in continuous mode; in reduced motion it holds still. No
       sponsor banners or lettering.
     - **Central Ferry Piers:** five pavilions on decks out over the water
       between IFC and the east: a warm lit hall behind a pale colonnade
       under a pitched green roof. They give Central the lit waterfront band
       from the storyboard (the reminder in step 1).
     - **Depth gaps:** without a logarithmic depth buffer, surfaces 1.2 km
       away only separate when about 0.2 m apart, so the bronze bands stand
       0.6 m proud of the glass and the hub disc 0.5 m in front of the hub.
     - **Framing:** no camera changed. All chapters pass except the four
       older misses. Mobile 01's IFC right edge was widened from 88% to 89%
       for the true 57 m width (it measured 91.1). Re-solving mobile 01 and
       desktop 05 was tried and didn't help: the targets ask for a slimmer IFC
       and a wheel about 3.5× too big, so the older misses stay logged. The
       Clock Tower still hides both buildings at every 02 mouse corner.
     - **Checked:** every desktop frame within its band at the four mouse
       corners; camera clearance unchanged (1.67 m). With 1 cm camera steps
       the IFC and piers change on edges only (05: 8,714 changing pixels;
       03: 23,814; 01: 11,109; 06: 261). The wheel shows as changing because
       it turns. Draw calls: 85 in 03; 01 and 02 were already over the 100
       budget (corrected 2026-10-02, see section 5).
     - **Rights:** the photos are looked at only, never stored or traced; no
       watermarks, promo text, bank logos or sponsor banners copied.
   - **No GLB models (user decision, 2026-10-01):** "If Kage didn't use any
     GLB files, I will follow that." Checked in Kage's public repository: it
     has no 3D model files (only images, fonts and three.js) and builds its
     shapes in code. So every 3D object here stays built in code; Meshy
     models are references only (ledger, "Meshy models"). The user keeps a
     local copy at `C:\Users\gavin\OneDrive\Desktop\kage-main` (22 files, no
     models), for studying techniques only: no Kage code, images or copy is
     reused (licence rule).
   - **Junk, rebuilt (user request, 2026-10-01).** Analysed against the
     user's photos and Meshy renders (reference only). Model: a wooden-hull
     harbour junk, with a side-on night photo as the proportion master,
     because the warm hull and lit stern windows stay readable on dark water
     (a black hull vanishes in 04).
     - **Sail size: much bigger (user request, 2026-10-01, replacing the
       first choice of real proportions + 15–20%).** After seeing the build,
       the user asked for sails "much bigger like the attached photos" (a
       close daytime photo, where the sails dwarf the hull). Measured there,
       the main sail is about half the hull length tall and nearly as wide.
       Built on the 28 m hull: main 12 × 15 m (mast top 21.2 m since the pointed tops), fore
       8 × 10 m, mizzen 4.2 × 5.6 m, about 1.45 times the first build. (The
       side-on photo had given a main sail of only ~0.25 × 0.30 of the hull
       length.) The foresail overlaps the main, as in the photo, so it hangs
       0.9 m to one side and the two cloths never meet or flicker. The
       mizzen overhangs the stern, as on the real boats.
     - **Pointed sail tops (built; user request, 2026-10-01).** The tops read
       as a slanted roof, not a point: the front edge stopped at 62% of the
       sail height (photo ~75%), the highest point sat ~5 m behind the mast at
       the back corner, the back edge ran nearly straight down from it, and
       the masts rose ~3 m above the sails. Decision (user): the tip goes as
       in the photo, just behind the mast and just under the mast top. Built:
       front edge to 75%, tip a quarter of the sail width behind the mast,
       back edge widest low down and sweeping in to the tip, the top pole
       ends at the tip, each mast ends 0.6 m above its tip (main mast top
       21.2 m, was 23.5 m); sail sizes unchanged. 04 re-solved again
       (desktop field of view 74.7°, mobile 79.9°, eye 3 m); 01 and 04
       within ±3%, mouse corners and clearance as before, flicker test shows
       edges only (21,121 changing pixels in 04).
     - **Hull:** shaped from 40 cross-sections: narrower bow rising to a
       point, raised stern with a wide square transom, sheer sweeping up at
       both ends; varnished planks bent to follow the sheer, a salmon
       waterline stripe, a gold line under a dark rail cap; a faint glow of
       its own so it reads at night. A rudder mostly under water (no keel
       fins; Meshy invented them).
     - **Deck:** a stern deckhouse with lit windows, a cream canopy over the
       waist on posts, a rail with posts along both sides, tyre fenders.
     - **Sails:** straight leaning front edge, a yard climbing to the peak at
       the back, a fan-shaped back edge scalloped between batten ends, mast
       about a quarter back; 7 battens on the main, 6 on the fore, 5 on the mizzen, in pale bamboo,
       cloth bellying between them; vivid red, uplit from the deck so each
       sail is brightest at the foot and each panel darker under the batten
       above.
     - **04 polish (user request, 2026-10-03).** The sails read as one flat
       colour, so the cloth is now coral red (`#e23c34`) and the vertex
       shading is stronger: the head about a third as bright as the foot,
       each panel darker under its batten and lighter in its belly. The
       hull's own glow is halved (0.09) so it sits darker under the sails.
       The junk's wake is longer and brighter (trail 45 m, strength 1.3,
       a cool grey glow) so a narrow streak shows behind the stern.
     - **Rig:** foremast raked forward, rope fans from the batten ends,
       shrouds and a forestay as thin lines. No pennants: the small gold and
       rose masthead flags were removed (user request, 2026-10-01). String
       lights are left out for now.
     - **Reflections:** the junk's light is now red and sits among the sails
       (was a warm deck lantern), so the glassy water draws a red streak under
       the junk beside the moon path. (Since 2026-10-02 the water ignores the
       point lights; the sails' red reflection is drawn by the water shader,
       step 5, stop 5.) No new flat pieces on the water; still
       3 point lights.
     - **Framing:** the first, smaller rig left 04 with the junk's top at 19%
       against a 10% target, and the big sails then put it at 3%, so the 04
       camera was re-solved each time (again for the pointed tops). Now:
       desktop eye still 3 m, field of view 74.7° (was 79.9°), camera and junk both shifted about 6 m; mobile
       eye 3 m, field of view 79.9°, camera 9 m closer, junk turned 27° more
       toward the camera (a three-quarter view, which reads better in
       portrait). A solve at 2.5 m eye height brought the camera within 1.2 m
       of the water, under the 1.5 m clearance rule, so it was rejected. The
       probe skips the thin rigging, whose bounding box would span the whole
       boat.
     - **Bigger in 04 (user choice, 2026-10-03: "still a bit small, not
       impressive enough").** The junk spanned about 50% of the desktop
       width against the storyboard's 55–65%, and on phones its main sail
       topped out 41% down the screen under a wide empty sky. The model is
       unchanged (scaling it would change 01 and its size beside the
       ferry); the 04 camera uses a longer lens instead. Desktop: field of
       view 66° (was 74.7°), about 1.2 times larger, the junk across
       35–95% of the width with the main sail's tip 6% from the top, its
       bow turned 2° toward the camera. Phones: field of view 60° (was
       79.9°), the camera turned right so IFC stays a cropped sliver at the
       right edge, the junk moved 6.7 m to stay centred and turned 11°
       further away (bow right), so the hull is foreshortened and the sails
       gain height without the hull leaving the frame: hull 11–85% of the
       width, main sail tip 28% down (just under the copy). The eye stays
       at 3 m: a 2.2 m eye looked grander but the move from 03 then dipped
       to 1.0 m above the water, under the 1.5 m clearance. Clearance
       passes at the four mouse corners; the 03→04 and 04→05 moves were
       checked frame by frame. `src/data/chapters.js`.
     - **Checked:** 01 and 04 within ±3% on desktop and mobile; framing at the
       four mouse corners and camera clearance as before. With 1 cm camera
       steps no surface flickers, including where the fore and main sails
       overlap; 04 changes on edges only (sails, battens, rails, masts move as
       the junk bobs): 20,396 changing pixels against 9,025 for the old junk,
       from the many more edges. 01 is up 9%.
     - **Open issue (older, not from the junk):** the full probe run shows
       four misses that were already there before this change: the wheel in
       desktop 05 (left 41 against 29), IFC top in mobile 01 (49 against
       46), and IFC and the wheel in mobile 03 (3–4% off). To fix in a later
       pass.
     - **Rights:** stock and watermarked photos are looked at only, never
       stored, traced or copied (including boat names and flag lettering);
       the user's own photo is in `docs/references/junk/`.
   - All textures are drawn in code (`src/scene/surfaces.js`); no image
     files, all original (ledger, Phase D).
   - **Checked:** 1 cm camera steps show no flicker on the windows (an early
     version made IFC's windows jump: the wall direction is now snapped to
     x / z and measured from each building's centre). Strobe on the skyline
     with mouse-sized moves is 0.6, like the calm water. At scroll speed
     (1.5 m per frame) the skyline pops less than before (5.2% of pixels
     against 8.3%); the tower scores higher than the plain box (15 against 4),
     which is its brick and stone detail moving, for the user to judge while
     scrolling.
   - **Checked (ferry reshape):** framing at the four mouse corners is the
     same as before the reshape (only the old IFC note in 02 remains). With
     1 cm camera steps, 03 changes on edges only (window frames, foam tips,
     petals); no surface flickers. 01 is unchanged (8,966 against 8,744
     changing pixels); 03 is up from 16,154 to 18,881, from the extra window
     edges.
   - **Not yet:** soft shadows, glow (step 3). Foreground cutouts only
     where one improves a specific composition (see "Foreground direction"
     in [README.md](README.md)). Reflections of the lit city in the water are
     built (step 5, stop 5, 2026-10-02). On mobile the skyline windows mostly blend into
     their average glow; the iPhone check is in step 6.
3. **Glow.** Two options, tested side by side:
   - **A (recommended first):** soft glow sprites behind each bright light
     (clock faces, IFC crown, ferry windows). Cheap, art-directable, works on
     phones.
   - **B:** a bloom pass from the three.js add-ons (standard, not a custom
     shader). Richer, but costs speed on phones. Desktop only if used.
     Update (user choice, 2026-10-02): built as part 3e, step 5, on phones
     too but weaker, as a small custom pass (`bloom.js`) rather than the
     add-on, so it costs little and leaves 香港 crisp; it drops first if a
     phone runs slow. The glow sprites stay.
