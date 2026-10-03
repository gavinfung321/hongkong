# Petals, promenade and water reflections

Part of the Milestone 2 plan (index: [README.md](README.md)). Old section 4, items 4–5, stops 1–5 (petals, railing and lamps, wet paving, palms, bauhinia tree, water reflections).


4. **Bauhinia petals (built; user request, 2026-10-01).** Replaces the warm
   specks. Petals of Hong Kong's flower (洋紫荊) drift across every chapter as
   the site's constant effect, instead of Kage's leaves. Rain was considered
   and rejected: it contradicts the clear moon and the fireworks, and Kage's
   "rain" feel mostly comes from the diagonal-line overlay (step 1).
   - **Look (user choice, 2026-10-02):** single loose petals from the user's
     artwork (`public/atmosphere/bauhinia-petal.webp`, 512 × 500, 29 KB):
     vivid fuchsia with pale veins, wavy edges and a curled stalk. Its own
     colour is kept, dimmed for the night in four shades (55–78% of its
     brightness), so the petals sit in the scene and the coral sails still
     lead. Cards match the artwork's proportions (0.92 × 0.9), sized so the
     petal is as long as the old code-drawn one. The artwork loads into a
     clear canvas texture, so the petals stay invisible until it arrives
     and no shader changes. The bauhinia tree's falling petals use the same
     petal (user choice). Replaced the code-drawn petal tinted from deep
     magenta to pale orchid; motion, counts and per-chapter density
     unchanged, as `ATMOSPHERE-EFFECTS-BRIEF.md` §6.3 asks. A/B shots of
     the hero, 01 and 03 on desktop and phone: the coral sails lead, no
     petal sits on the copy; composition probe as before.
   - **Depth:** a near layer of a few large petals (6 desktop / 4 mobile)
     drawn over everything, including 香港; a far layer of small fogged
     petals (70 / 32). Both travel with the camera, so moving still gives
     parallax.
   - **Motion:** slow fall, sideways breeze, sway and flutter; scrolling adds
     a short gust. The breeze blows toward screen left, away from the
     bauhinia tree, whose own falling petals join it (2026-10-02).
   - **Density:** sparse and calm. Full in the hero and 01–04, 0.6 in 05 so
     the city lights lead, 0 in 06 so the fireworks take over (`petals` in
     each chapter's `visibility`). Off in reduced motion.
   - **Cost:** two instanced draw calls, 76 petals updated per frame.
   - Built in `src/scene/createPetals.js`; sizes, counts, colours and wind are
     the constants at the top.
   - **Artwork (done 2026-10-02):** the petal artwork the user planned
     (2026-10-01) arrived as the single petal `bauhinia-petal.webp` rather
     than a sheet; its pale veins and wavy edges replace the old dark-veined
     code petal (see "Look"). The tree is built in code (stop 4).
5. **Promenade pass (user request, 2026-10-02).** The closest layer to the
   camera, done in three stops with a review after each: railing and lamps,
   wet paving, palms. The user ranked it first of the remaining work
   (railing, paving, palms, water, Central buildings and mountains, sky and
   clouds, fireworks) and chose to build from their AI-made designs in 3D,
   with the images as references only (not a flat cutout, which would look
   paper-thin at 01's angle and under parallax).
   - **Stop 1: railing and lamps (built 2026-10-02).** The grey blocks are
     replaced by the user's stone balustrade: a granite plinth with
     pedestals, big square posts (0.44 m, 1.12 m tall) every ~4 m with a
     carved wave panel on each face, a slim post mid-bay, a round top rail
     and two thin rails, and a cast-iron lantern with warm glass and a soft
     glow on every second big post (16 lanterns). Three tall cast-iron lamps
     after the user's lamp design (octagonal pedestal, fluted column, six-sided
     lantern, 4.2 m) stand on the Clock Tower promontory: either side of
     the tower and short of the ferry in desktop 02, left of the tower in
     mobile 02. *Re-spaced (user request, 2026-10-02):* on wide windows
     the hero and 01 show the promontory left of the tower, where the
     three stood almost one behind another (within 2°) and read as one
     cluster. Now they stand evenly apart there (about 2%, 10% and 16% of
     the width at 1536 × 730), keep their places in desktop 02 (15%, 42%,
     54%) and spread evenly left of the tower on phones (9%, 17%, 24%);
     at 16:10 only one shows in the hero, clear of the edge (5%). The
     lamps are not real lights (the scene keeps 3): materials that
     opt in get a warm pool around each lantern and lamp (`lamps.js`), which
     the paving and palms will share. Railing sizes and lantern spacing are
     the constants in `lamps.js` and `createForeground.js`; lamp positions
     are `WORLD.foreground.lamps`.
   - **Railing on every edge near the Clock Tower** (user request,
     2026-10-02: "I need all edges to be filled with railing"). Railing B now
     runs the promontory's whole harbour edge (x = −50, z −60 to 40, was
     z 2–30), and new runs follow its south tip (z = −60, out to x = −110)
     and the three sides of the inlet between the promontory and the arrival
     promenade. Runs meeting at a corner share one post. The promontory runs
     (`edgeRailings`) always show, so mobile 01 now has them too; railing A,
     C and the inlet's north side (`railings`) still fade with the chapters,
     as mobile 01 wants open water at the bottom. The inlet's west run has
     no lanterns: in mobile 02 it points straight at the tower and they sat
     in front of its lit base. The seawall strip is now as deep as the
     plinth (0.5 m), so strips crossing at a corner never show a shared top.
     36 lanterns in all.
   - **Kept:** railing lines A, B (x = −50) and C, seawall strip tops 5 cm
     below the deck, the depth-twin fade for 02 → 03 (the twins are now
     nudged back by a constant depth offset so the railing always passes;
     a slope-scaled offset let the rails show through the slim posts
     mid-fade). Bays meet end to end, never overlap.
   - **Checked:** all 12 frames as before (only the four older misses), all
     mouse corners pass, closest camera approach 1.91 m (was 1.67 m). With
     1 cm camera steps the railing changes on edges and its granite grain
     only (the near railing moves 2–4 px per step), no solid patches.
   - **Stop 2: wet paving (built 2026-10-02, user request).** After the
     user's wet-paving design: the promenade and promontory tops (the
     Kowloon blocks and the arrival deck) are now 0.8 m square granite slabs
     with dark joints, laid in world metres, darker where wet (soft
     patches, 3.5 m across), with a warm reflection of every lantern, tall
     lamp and the Clock Tower floodlight. A reflection is a streak around
     the point where the mirrored light meets the ground, measured in view
     angles so it keeps one size on screen (narrow across, longer down toward
     the viewer than up). An earlier version sized it in metres; the
     tails of all the far lanterns then met under the camera and flooded the
     hero's near deck orange. The joints fade to the slab colour once they
     shrink below a few pixels, so they never shimmer at grazing angles. The
     lantern pools on the paving are weaker than before (wet stone shows
     the lights mostly as reflections). Code: `addWetPaving` in `lamps.js`,
     `promenadePaving` in `surfaces.js`; the ground material in
     `createKowloonEdge.js`. Checked: all 12 frames as before, all mouse
     corners pass (closest approach 1.94 m), 1 cm camera steps change edges
     only (hold 1 20,040 px, hold 2 9,813, as before), draw calls unchanged.
     The shader loops over all 39 lamps and lanterns plus the floodlight per
     deck pixel; to be watched in the iPhone 11 measurement.
   - **Wet paving, middle-ground look (user choice, 2026-10-02).** Compared
     with the user's rough, bright reference, the user chose to keep the
     dark, clean ground and borrow the reference's best parts: each
     reflection breaks into flecks (two noise layers, as on uneven wet
     stone), a faint narrow gold glow around each one, a cool dusk-sky sheen
     on wet stone at grazing angles, a tone and gloss per slab, and a bevel
     inside the joints that catches the lamps. Fine detail shows on the near
     deck only and fades out before it would shimmer; the far paving stays
     smooth. A photo-real rough floor was not used: at 02's distances its
     roughness is below a pixel, it would clash with the illustrated scene
     and pull the eye from the tower and copy. Checked: 1 cm camera steps
     as before (hold 1 20,036 px, hold 2 10,040, hero 27,759).
   - **Stop 3: palms (built 2026-10-02, user request).** The flat palm
     cards are replaced by 3D palms in two shapes: a tall coconut palm
     with a curved, leaning trunk and long drooping fronds, and a straighter
     palm with a rounder crown of shorter fronds over a skirt of brown dead
     ones. Fronds are curved, V-folded ribbons cut into leaflets by a small
     texture drawn in code (one frond plus a bark strip, `palmAtlas`);
     leaflet edges blend over one pixel, and the gaps fill in on distant
     crowns so they never shimmer. They sway slowly (trunk bend plus frond
     flutter, each palm on its own phase) and hold still in reduced motion.
     They take the warm lamp pools like the railing. Nine palms: the four
     around the tower (the one standing over the inlet water moved onto
     land at x −53.5, z 38; it shows on mobile only, as it is outside the
     desktop frame and would only sweep across the tower), plus a row of
     five behind the tower on the promontory's south end (x −70 to −88,
     z −46.5 to −50, 9.5–12 m), left of the tower in both 02 framings.
     No crown crosses the tower at the 02 hold, and none crosses it
     mid-move: the palms fade in late in the 01 → 02 move (62–90% of it,
     after they pass the tower) and out early in 02 → 03 (first 10%), set
     per key in `createGating` (`windows`). One instanced mesh per shape
     plus a depth-only twin for the fade: 4 draw calls. Code: `palms.js`;
     positions and shapes in `WORLD.foreground.palms`. Checked: all 12
     frames as before (only the four older misses), all mouse corners pass,
     draw calls desktop 02 137 (was 133), mobile 02 75 (unchanged). With
     1 cm camera steps hold 2 now changes 13,634 px (was 10,040): the
     near palm's leaflets moving about a pixel per step; with the camera
     still the palms change 7 px, so nothing flickers.
   - **More palms on desktop (user choice, 2026-10-02).** The desktop
     camera looks across the promontory, so it saw only about four palms
     (three of the five in the row fall just off its left edge), against
     seven on mobile. Three desktop-only palms: two make a grove left of
     the tower (a 10 m coconut palm at x −75.4, z −7.4 and a 12.5 m palm
     at x −70.4, z −25.6, both leaning away from the tower, crowns under
     the moon), and a 10.5 m coconut palm at x −52, z 5 pairs with the
     palm between the tower and the ferry, clear of the lamps. On mobile
     they would stand beside the tower, so they are hidden there
     (`only: 'desktop'`; a breakpoint change rewrites the instances).
     Checked: none crosses the tower at the hold (also at 1156 × 766) or
     while visible in the moves in and out of 02; all 12 frames as before;
     draw calls unchanged; with 1 cm camera steps hold 2 changes 16,802 px
     (more near leaflets moving), 8 px with the camera still.
   - **Lighter palms (user choice, 2026-10-02),** after the first iPhone 11
     reading put phone 02 at 34 fps. Each palm was drawn four times: three.js
     splits two-sided transparent surfaces into a back pass and a front
     pass, for the depth twin and the palm alike. The depth twin already
     keeps the nearest frond in front, so both materials now draw in one
     pass (`forceSinglePass`): really 4 draw calls now (it was 8). Two
     palms that stand left of the phone frame throughout 02 (the coconut
     at x −82.4 and the row's last palm at x −88) are desktop-only now, so
     phones show seven palms. Phone 02: palms 34.6k → 13.5k triangles, the
     whole frame 73k → 52k. Checked with still frames: desktop 02 and
     phone 01 identical to the pixel, phone 02 within 12 of 255 levels
     anywhere; composition probe as before.
   - **Stop 4: bauhinia tree (built 2026-10-02, user choice), before the
     water reflections.** One Hong Kong orchid tree built in code (no flat
     cutout: the user's AI images stay references, and a card would look
     paper-thin under parallax). Pulled forward from Milestone 3.
     - **Shape:** a seeded skeleton. A 5 m trunk leans out over the water
       from the arrival promenade (x 1.2, z 100, just right of and behind
       the 01 camera) and forks into five dark arching limbs, three more
       levels of drooping branches and twigs, all as merged tubes.
     - **Foliage:** about 2,700 instanced cards from one atlas drawn in
       code: broad two-lobed leaves, leaf clumps, five-petal magenta
       flowers with pale veins, and buds bunched on the outer twigs. The
       flowers glow faintly so the magenta reads at night; the cards
       flutter gently, as soft as the palms' edges.
     - **Falling petals:** 18 petals leave the flowers, drift left on the
       harbour wind and land on the water, then start again from another
       flower. To match, the site-wide petals now drift toward screen
       left too, away from the tree.
     - **Framing:** in the hero the canopy fills the right edge (from about
       86% of the width, y 8–60%) behind 東方明珠 and the side pager, which
       stay legible. The IFC, moon, junk and 香港 stay uncovered. The 01
       hold pushes the camera 5 m forward, so by the hold the canopy has
       slid out of frame. Keeping it in the corner at the hold too would
       need foliage hanging 15–20 m out over open water.
     - **Breakpoints and chapters:** not on mobile, whose 01 camera stands
       45 m to the left with no corner for a branch; hidden there, so it
       costs nothing. Not in 02, which the palms, lamps, tower and ferry
       already fill (`bauhinia` in each chapter's `visibility`, 1 only in
       desktop 01). A depth-only twin for the leaves and one for the wood
       keep the fade even.
     - **Checks:** all 12 frames as before (only the four older misses);
       all mouse corners pass, nearest clearance 1.91 m; desktop 01 draw
       calls 170 (was 164). With 1 cm camera steps the hero changes
       46,800 px (27,700 without the tree): the leaf cards shifting about
       a pixel. With the camera still it changes 24 px, so nothing
       flickers. Hold 1 is unchanged (20,140 px against 20,040).
     - **Code:** `bauhinia.js`; placement is `WORLD.foreground.bauhinia`.
     - **Realistic foliage (user request, 2026-10-03:** "make the current
       tree more realistic, just like our current flying petal").** The
       code-drawn atlas is replaced by `public/atmosphere/bauhinia-foliage.webp`
       (1024 × 1024, 155 KB), cut from the user's own artwork: a leaf made
       of the cluster artwork's clean leaf lobe and its mirror (two lobes,
       as a bauhinia leaf has), an open flower made of five copies of the
       drifting petals' artwork with pale stamens, the cluster's bud spray,
       and a clump of six of the new leaves. Same four-cell layout, so the
       tree's shape is unchanged. Three changes make it read: flowers turn
       toward the hero / 01 desktop camera (`viewer`; seen edge-on they were
       pink slivers), cards are shaded down toward the bottom and inside of
       the crown, and every card has a little more of its own light (leaves
       0.09, flowers 0.32), so the artwork's veins and colour show at night
       as the petals' do. The atlas loads into a clear canvas texture like
       the petals, so the shaders are the same before and after. Both foliage
       materials now draw in one pass (`forceSinglePass`, as the palms):
       the tree costs 2 fewer draw calls. Recipe: `docs/ASSET-LEDGER.md`.
   - **Stop 4b: bauhinia bush (built 2026-10-03, user request:** "one more
     bauhinia bush on the left bottom corner … a realistic one, similar to
     the existing tree but a bush this time to feel different").**
     - **Shape:** a low, dense mound 7 m long, 2.3 m tall and 2.6 m deep,
       its long side along railing A on the arrival promenade (x −21.1,
       z 87.4, 2.4 m inside the railing). Nine thin stems fan out from a
       tight base under an ellipsoid crown with eleven lumps, so the
       outline is uneven. About 1,900 cards from the same atlas: clumps and
       leaves through the crown's outer half metre, and 260 flowers and 80
       bud sprays on its upper surface (far more flowers than the tree),
       turned toward the camera. Since 2026-10-03 (user request: less even,
       more like a real bush) the flowers gather in 16 clusters instead of
       an even sprinkle, and 6% of the leaves and flowers sit on sprigs
       poking out past the crown. 26 fallen petals (the petals' artwork) lie on the
       paving around it, 3 cm up so they never fight the slabs. The
       lanterns' warm pools light its leaves and stems (`addLampLight`).
     - **Framing:** moved 2 m on along the railing (user request,
       2026-10-03: its crown sat under the foot of 香, and it hid a
       railing lantern). In the hero it now runs from the left edge to
       about 20% of the width (香 starts at 22.5%), 62–82% of the height,
       below the Clock Tower's lit base and the copy, with the railing
       lantern beside it showing. The 01 hold's push brings it into the
       bottom-left corner (to about 9%, its leaf tips to about 20%). Any
       position farther left would leave the hold frame: the push moves it
       about 11% left between the hero and the hold. The bottom-left paving
       below it in the hero stays open.
     - **Chapters and breakpoints:** desktop 01 and the hero only (`bush` in
       each chapter's `visibility`). Not on phones: mobile 01 has no deck.
       The 01 → 02 camera passes over it, so it is gone by 8% of that move
       (`windows` in `main.js`), while the camera is still about 1.8 m clear
       of the crown.
     - **Cost:** 4 draw calls (wood, foliage, its depth twin, fallen petals):
       desktop hero 216, 01 213 (with the tree's 2 saved); phones unchanged.
     - **Code:** `createBauhiniaBush` in `bauhinia.js`; placement and size
       are `WORLD.foreground.bauhiniaBush`.
   - **Stop 5: water reflections (built 2026-10-02, user choice; reworked
     twice the same day, user requests).** The harbour glitters like the
     user's photo of the junks at night: the lights break into many small
     horizontal glints with dark gaps between them, spreading wider than
     each light with ragged edges and soft ends, over a dim shimmer from the
     whole skyline. Drawn by the water shader (not a mirror render, which
     would double the draw calls and flicker under the ripples it needs).
     - **Version 1 (replaced):** solid streaks under every skyline column,
       the IFC, moon, wheel, Clock Tower, lamps and boats, cut into 11 m
       window stripes. 01 read as a barcode of thin vertical rectangles, and
       the boats' streaks were too big ("Just remove all the reflection that
       look like thin vertical reflection in 01").
     - **Version 2 (replaced):** only IFC, the boats and the Clock Tower,
       at true size, as solid columns broken by horizontal bands. Too
       sparse and still rectangles ("the reflection look really bad now.
       Just simply a vertical rectangle … not enough reflection in the
       water and they look not natural at all").
     - **Now (user choices: glitter shader, skyline shimmer, moon glitter
       path, moderate chop):**
       - **Glints:** thin slivers where a wavelet faces the light, about
         2 px tall in the distance and growing toward the viewer up to
         6 px (since 2026-10-03, user request: near the railing they grew
         into flat two-tone blobs), 4× as long as tall. Dense in a light's bright core (but always with
         gaps) and sparse at its edges, they drift and twinkle slowly
         (frozen in reduced motion, where the water does not animate).
       - **Shape:** each glow is Gaussian across, 1.5× the light's width,
         its rows shifted sideways by the wavelets so the edges zigzag; it
         runs the length of the light's mirror image plus a tail toward the
         viewer (0.6 of the image for the junk and Clock Tower, 0.45 for
         the ferry, 0.25 for IFC, 0.15 for the moon), dimming along it.
       - **Lights:** IFC (cool white, lower two thirds of the tower), the
         Clock Tower's floodlit lower part (warm), the ferry's window decks,
         the junk's sails (red) and deckhouse, a soft gold glitter path
         under the moon, and the Observation Wheel (a soft coral-pink
         glow from its rim, 0.7 of its width, since 2026-10-03).
       - **Swell (user request, 2026-10-03: animate the reflections of the
         ferry, wheel and skyline):** slow crests roll down the water
         toward the viewer (one every few seconds). As one passes, each
         wavelet row sways sideways by 0.3 of the glow's half width and
         brightens by up to 15%, so the reflection columns ripple and
         shimmer instead of only twinkling in place. The skyline shimmer
         sways with them. Frozen in reduced motion. (`SWELL` in
         `createWater.js`.)
       - **Skyline shimmer:** the skyline is summarised once as a strip
         along the island front (lit-window colour, brightness and height
         per 9 m, blurred so neighbouring towers merge). Each water pixel
         reads the strip where its line of sight meets the front, so the
         water under the city carries a dim, continuous glitter in the
         buildings' warm and cool colours, with no columns. One texture
         read per pixel.
       - **Sky between the glints (user request, 2026-10-03: the water
         was pure black between them):** the water mirrors a dim
         violet-navy sky, strongest toward the horizon (the Fresnel
         sheen) and faint near the camera, broken into soft wave bands
         that drift with the glints. The dark water now reads as a
         surface (about RGB 10–20, 5–9, 30–40 where it was 2, 0, 14),
         and the glints still stand out. Skyline shimmer 0.11 (was 0.08).
         (`SKY`, `CITY` in `createWater.js`.)
       - **Not reflected:** the promenade lamps and railing lanterns
         (their mirror images fall behind the sea wall).
     - **No glare:** the water ignores the rim light and the boats' point
       lights (they made hot blobs under the ferry in 03 and the junk in
       04); the glints draw all reflections.
     - **Why it cannot strobe:** the glints are laid out in view angles
       around the camera, so moving the camera does not slide wavelets
       past a pixel; azimuth is measured from the island side, so its seam
       is behind every camera. Brightness follows the water's Fresnel
       sheen and is soft-clipped, so glints stay below the subjects and
       copy.
     - **Limits:** at most 9 lights per frame on desktop (desktop 01 sees
       all nine since the wheel joined), 8 on phones. Lights behind the
       camera or off screen are skipped; a faded subject (ferry, junk, IFC,
       wheel) fades its reflection too.
     - **Flicker fix (kept):** the water plane is cut into 64 × 64 squares.
       As two 8 km triangles, the world positions across it were too
       imprecise and the reflections shivered at 1 cm camera steps.
     - **Checks:** draw calls unchanged; one new 256 × 1 data texture (the
       skyline strip); water adds about 8,000 triangles. With 1 cm camera
       steps the holds change 19,092 / 16,774 / 14,891 / 12,920 / 6,791 px
       (holds 1–5), as before. Strobe on the water with the twinkle frozen
       (sideways / forward moves): hold 1 3.3 / 8.8, hold 3 0.8 / 6.1,
       hold 4 0.5 / 6.4, hold 5 0.8 / 15.5, the same as version 2 and below
       version 1. The twinkle itself is slow on purpose.
     - **Code:** `waterReflections.js` (the lights and `cityStrip`),
       `createWater.js` (the glint shader, culling, fades, `setCity`),
       `main.js` (lights, skyline strip, fades, per-frame `water.reflect`).
