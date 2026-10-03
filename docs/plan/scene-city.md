# Central buildings and mountains

Part of the Milestone 2 plan (index: [README.md](README.md)). Old section 4, item 5, stop 6, parts 1–3f (dimmer towers, mountains, landmarks, window lights, painted facades, glow, boats in the water).


   - **Stop 6: Central buildings and mountains (user choices, 2026-10-02).**
     The user found the Central towers too bright next to IFC and asked to
     rework the buildings and mountains next, in three parts with a review
     after each: dim the buildings, then the mountains (shading from a dark
     foot to a lighter ridge with an edge glow near the moon, rougher ridges
     with a Peak outline, a scatter of slope lights, a mist band where the
     skyline meets the mountain, a faint third range), then building shapes
     (varied tops plus a few landmarks built in code, such as Bank of China
     and Central Plaza).
     - **Part 1: dimmer Central buildings (built 2026-10-02).** Every skyline
       building had 30% of its windows lit, varied per building from 10% to
       50%, so the busiest matched IFC's 50%; in 05 the tower right of IFC
       was almost as bright (mean 44 against IFC's 47, bright pixels 13.7%
       against 14.6%). Now 20% lit, capped at 30% per building (new
       `maxLit` option in `cityWindows.js`), and windows at strength 0.7
       (was 0.9). IFC, its podium and Kowloon are unchanged. Measured: the
       skyline beside IFC in 01 drops from 47 to 38 (IFC 57), the tower in
       05 from 44 to 29 with half the bright pixels (IFC 47), mobile 01 from
       51 to 39 (IFC 80). Strobe at scroll speed: the 01 skyline changes
       6.2% of pixels (6.7% before); the Clock Tower is unchanged. On
       mobile the distant skyline still reads as flat slabs; the depth haze
       (not chosen for now) or the mist band in part 2 could fix that.
     - **Part 1b: quieter towers in 05 (user choices, 2026-10-02).** The user
       still found the towers around IFC too bright in 05. Each was about half
       as bright as IFC, but together they had 1.5× its bright pixels; at
       ~500 m every window is drawn crisp at the same peak as IFC's, and warm
       dots on near-black walls sparkle more than IFC's on blue-grey glass.
       Two changes, IFC untouched:
       - **05 only:** the skyline windows fade to 60% across the move into
         05 and back on the way out (`city` in each chapter's visibility,
         omitted = 1; `island.setCityLevel`).
       - **Close-ups:** windows drawn large (bays over ~10 px) peak at 70%
         (new `close` option in `cityWindows.js`), which only touches
         04–06; in 01 the bays are ~3 px and unchanged.
       - Measured in 05: the towers' bright pixels fall from 14,200 to 4,900
         (IFC 9,100; much of the rest is the wheel and moon glow), the
         towers right of IFC from 5,100 to 560. 01 unchanged; 1 cm camera
         steps in 05 6,529 px (6,607 before).
     - **Part 2: mountains (built 2026-10-02).** The two flat one-colour
       cut-outs are rebuilt in `src/scene/createMountains.js`:
       - **Shape:** each range is an upright strip under a ridge line sampled
         every 10 / 20 / 30 m (near / far / third), with jagged detail from
         four octaves of ridged noise (±15 m) on top of the old swells. The
         near ridge follows the Peak seen from Kowloon: the High West knob,
         the summit (~560 m) left of IFC with a shoulder that still hides the
         moon's lower edge in 01, the dip of Victoria Gap, then Mount
         Cameron's mass (`WORLD.mountains.ranges`).
       - **Sloping ends (user request, 2026-10-02: "too vertical … like a
         cliff").** Each range used to stop at full height in a straight
         drop, seen at the near range's east end in desktop 02 (and the
         move from 01) and the near and second ranges' west ends in desktop
         04; the new lighter ridges made the cut stand out. Now every ridge
         eases down to the water over its last 1.2 / 1.5 / 1.8 km (near /
         second / third), like a headland, its jagged detail shrinking with
         it, and the mist fades out along the same slope. Widening the
         ranges instead would only move the cut to the camera's 5 km limit.
         01, 05 and 06 are unchanged; 1 cm camera steps in 02 and 04 as
         before (16,695 / 13,007 px).
       - **Shading:** darker at the foot (×0.6) to lighter at the ridge
         (×1.9), so the slopes have volume through the fog. A thin moonlit
         edge (5 m, never under 2 px) lights the ridges within about 13° of
         the moon, drawn after the fog so it shows at any distance.
       - **Third range:** at 3.7 km, behind the moon (the moon draws over
         it), almost fog-coloured; it peeks over the others where they dip.
       - **Mist band:** a 340 m band of city-lit haze between the skyline
         and the near range (z −1650), fading upward, in soft patches that
         drift slowly in continuous mode and hold still in reduced motion.
       - **Slope lights (redrawn 2026-10-03, user request: the scattered
         dots read as floating specks).** Now built like the real
         Mid-Levels at night (`WORLD.mountains.lights`, `LIGHTS` in
         `createMountains.js`):
         - 210 residential towers on the near range's lower slopes, each a
           grid of lit windows (14–36 m wide, 45–140 m tall, 35–75% lit,
           warm with 30% cool), gathered low and thinning out up to 72% of
           the ridge height;
         - 55 more towers west of the Clock Tower in the hero (Sheung
           Wan to Kennedy Town), thinning out and staying lower over
           500 m so High West's top stays dark behind the tower (user
           choice, 2026-10-03: the lights stopped in a hard edge behind
           the tower);
         - five strings of orange road lamps crossing the slopes, one
           climbing to the Peak, one low in the west, with gaps;
         - a small brighter cluster at the Peak (the Peak Tower and
           Galleria), behind IFC in 01.
         Fixed-size dots (1.7 px), so they don't twinkle as the camera
         moves. Where a tower's dots would crowd closer than their own size
         (on phones and far away) they dim, so the windows never merge into
         bright bars. Still well below the skyline windows; one draw call.
       - **Slope texture (2026-10-03, user request):** the slopes' shading
         varies by ±28% in tall soft patches, like gullies and vegetation,
         so the body no longer reads as one flat tone (`TEXTURE`).
       - **Order:** the moon now draws first of the see-through layers, then
         the slope lights, then the mist, so nothing nearer is painted over.
       - **Checks:** the composition probe shows only the four older misses;
         1 cm camera steps as before (holds 1–5: 19,099 / 16,700 / 14,782 /
         13,032 / 6,607 px); the 01 skyline strobe at scroll speed 6.2%, as
         in part 1; three more draw calls in every hold (desktop 01 173).
         In 05 the shoulder hides more of the moon behind the towers (a
         sliver shows left of IFC).
     - **Part 3: building shapes and four landmarks (user choices,
       2026-10-02; built the same day).** All four landmarks the user picked,
       built in code at about real height in their order seen from Kowloon,
       plus varied tops on the plain skyline boxes. All are lit well below
       IFC and fade with the `city` level in 05 like the skyline.
       - **Bank of China Tower** (`WORLD.landmarks.boc`, left of IFC under
         the moon): four triangular shafts round a 52 m square, stopping at
         3, 4, 6 and 5 facade modules (156–312 m), each roof cut at 45° so
         each face ends on a diagonal. White X braces and corner lines on
         dark glass (a mip-mapped texture, so the lines fade with distance
         instead of shimmering), twin masts to 367 m.
       - **Cheung Kong Center** (just right of BOC, 283 m): a plain square
         box whose whole skin glows an even cool white (every window lit,
         dim), with a pale crown band 1.5 m proud of the glass.
       - **Central Plaza** (374 m): a chamfered triangle, one face to the
         harbour, with four colour bars near the top that drift slowly
         through the colours (90 s per cycle), a glass pyramid and a mast.
         It stands well right of its true place in Wan Chai, where the Clock
         Tower would hide it in 01; it shows between the tower and the ferry
         in 01 and at the left edge of 05 and 06.
       - **The Center** (right of IFC, 346 m): a chamfered square shaft with
         three crown steps and a spire, neon lines every 12 m, the whole
         tower slowly changing colour (60 s per cycle).
       - **Varied tops** on the skyline boxes, from their own random
         sequence so the towers don't move: a narrower upper section on 35%
         of those over 90 m, a dim warm or cool lit roof band on 25% of
         those over 100 m, a pyramid roof on 10%, and dark masts on 30% of
         those over 140 m. Skyline towers step aside from the landmark
         footprints.
       - **LED colour (2026-10-03, user request: the storyboard's towers
         glow magenta, cyan and red; ours were dark with sparse windows).**
         Half the lit roof bands are now a restrained LED colour (magenta,
         cyan, coral red, violet or amber) and 6 m deep; a fifth of the
         towers over 120 m get vertical LED strips up their two
         harbour-facing corners, from 30–60% of their height to the roof.
         All stay dimmer than IFC's lit glass, so IFC still leads. They
         share the roof bands' draw call and fade with the `city` level
         (`LED` in `createIsland.js`). Muted to 0.6, and Central Plaza's
         and The Center's colour cycles desaturated and dimmed, so the
         frame keeps one warm accent (user choice, 2026-10-04; atmospheric
         depth Priority E).
       - **Waterfront lamps (2026-10-03, user request: the storyboard has
         a bright line where the city meets the water).** Warm lamps along
         Central's harbour front in small clusters, not a row (user
         request, 2026-10-04: an even line of dots read as fake, and there
         were too many): 1–4 lamps 3–6 m apart, then 25–70 m dark; each
         cluster at street level (4–8 m) or, three in ten, higher on a
         podium front (9–16 m), set back 1–8 m; 15% cool white, glow
         0.45–0.8. About 110 lamps (was about 225 in an even row). Fixed
         3 px dots, fogged like the skyline, hidden behind the piers and
         podium, following the `city` level (`WATERFRONT` in
         `createIsland.js`). One draw call.
       - **Masts and warning lights:** masts are dark and low-contrast (one
         or two pixels wide; on phones, without antialiasing, a bright one
         would crawl). Each carries a red light, a fixed 2.6 px dot that
         nearer towers hide, pulsing slowly in continuous mode and holding
         still in reduced motion, as do the colour cycles.
       - **Checks:** the composition probe shows only the four older misses;
         moon, IFC and copy uncovered in every frame. 1 cm camera steps
         holds 1–5: 19,124 / 16,726 / 14,871 / 13,026 / 6,806 px (5: +4%,
         the BOC braces); strobe at scroll speed 6.3% for the 01 skyline and
         unchanged for the Clock Tower. Twelve more draw calls (desktop 01
         185, 05 60; mobile 01 129).
     - **Part 3b: fewer lit windows on the other towers (user request,
       2026-10-02: "still too many window lights … stealing too much
       attention from the main buildings").** Measured on the screenshots,
       the other towers still had about as many bright pixels as IFC and the
       four landmarks together in 05 (20,700 against 25,400 above luma 60),
       because every tower had some lit windows and the whole skyline
       sparkled evenly. Now 40% of the skyline towers are left almost dark
       (a tenth of their windows; new `dark` option in `cityWindows.js`)
       and the rest have fewer lit: 13% on average, at most 20% per tower
       (was 20%, at most 30%). IFC and the landmarks are untouched. Their
       light: 05 from 20,700 to 10,600 bright pixels (main buildings 22,800),
       01 from 2,160 to 820 (main buildings 8,900). 1 cm camera steps hold 1
       19,099 px, hold 5 6,972; strobe unchanged.
     - **Part 3c: lights spread evenly, and window lights on far towers
       (user choices, 2026-10-02).** The user saw lights crowded on some
       towers beside unlit ones, and the 02 background (the low east end of
       Central, 1.6–2.1 km away) as unlit grey slabs while nearer towers had
       lights.
       - **Spread:** neighbours ranged from 0.5% lit (the dark 40%) to 20%.
         Now every tower is 5–12% lit and only 10% are almost dark (new
         `vary` option in `cityWindows.js`: the spread between buildings),
         about the same total light as part 3b.
       - **Far towers:** the window grid fades to a faint average glow once
         its floors shrink below a few pixels, which happens at about 1.5 km
         on desktop and sooner on phones. Far towers now get their lit
         windows as soft dots of a fixed 3.2 px size (new
         `src/scene/cityDots.js`, the slope lights' technique), on window
         positions on every wall, 1.5 m proud of it, as many as each tower's
         lit share. Each dot fades in only where its tower's floors have
         shrunk that far (worked out per pixel, so phones get them sooner),
         fades into the fog, and follows the `city` level. Close-ups (04–06)
         get no doubles. One draw call.
       - **Checks:** the composition probe shows only the four older misses.
         1 cm camera steps as before (holds 1, 2 and 5: 19,127 / 16,597 /
         6,599 px); at the 01 hold, small side steps give the same result
         with and without the dots (0.34% of pixels pop). At scroll speed the
         01 skyline pops 7.4% of pixels (6.3% without the dots): more detail
         moving past, not shimmer. Background light against the main
         buildings: 05 10,700 against 23,500 (unchanged), 01 1,440 against
         9,100. Draw calls desktop 01 186, 05 61; mobile 01 130.
     - **Part 3d: no IFC flicker while scrolling, and fewer background
       lights (user request, 2026-10-02).** The user saw IFC flicker while
       scrolling on a phone, and still too many lights on the other towers
       in 01–03, 05 and 06.
       - **IFC flicker, second try (user choice, 2026-10-02):** the first
         try softened every window grid while scrolling, toward its strips
         and glow. The user then saw IFC still flicker on phones and turn
         into a grey slab on desktop mid-scroll, with the other towers'
         lights gone: the softening pushed walls into their flat glow, and
         each flick switched IFC between three looks. It is removed;
         windows keep one look whether or not the camera moves. Instead:
         - Antialiasing is on for phones too (`src/main.js`; the brief
           allowed it if 30 fps holds, and the low-frame-rate fallback
           still lowers the resolution). IFC's piers, face slots, bronze
           bands and crown fins are 1–2 px wide on a phone and crawled
           without it.
         - On phones, single windows over about 6 px get edges 1.5 times
           softer (`citySoft` in `cityWindows.js`). Smaller windows and
           floor strips are left alone, as softening them dimmed IFC in 01;
           it never moves a wall to its strips or glow.
         - Checks: IFC holds exactly as locked on phones (01 and 05 side
           by side) and desktop mid-scroll keeps every lit window. On the
           mobile scroll path, holds and slow moves are steady; a fast
           05 → 06 move still scores high frame to frame because the window
           grid slides about one floor per frame, and the windows keep
           their pattern. If that still reads as flicker on the phone, the
           next steps are 2× phone resolution, then a short blur along the
           scroll direction that keeps each window's brightness.
     - **Part 3e: IFC painted facade (user choice, 2026-10-02).** The user
       still saw IFC flicker on phones, and asked why IFC and Bank of China
       look less real than the Clock Tower, ferry and junk. The hand-built
       objects have painted, mip-mapped textures, several materials and real
       light falloff; the towers had flat colours, a salt-and-pepper of
       punched windows from one shared shader, no glass and no lighting
       gradient. The shader's pixel-by-pixel windows were also why IFC
       flickered: textures are filtered by mipmaps as they move, as on the
       Clock Tower. The user chose all four fixes, in steps, with a review
       after each: (1) a painted IFC facade, (2) painted skins for the four
       landmarks, (3) a lighting and material pass (glass reflection
       gradient, warm street glow at Central's foot, crown uplight, Bank of
       China facets), (4) curtain-wall bands and floor-clustered lights in
       the background towers' shader, (5) a soft glow around bright lights,
       tuned down on phones. This unlocks the IFC window look.
       - **Step 1, IFC (done):** new `src/scene/facades.js` paints a glass
         curtain wall in code: floors of glass bands behind thin pale
         mullions, lit tenant by tenant (whole floors, part-let floors and
         dark floors with the odd late office), mostly cool and neutral
         office white with some warm, brightest under the ceiling and soft
         at the band edges, the odd room dark or with blinds down. The shaft
         tile covers its full height and a whole face (32 bays × 64 floors),
         the upper tiers have a brighter one (75% lit), and each face starts
         the pattern at its own offset. Wall UVs are in metres from IFC's
         foot (`facadeUVs`), so floors run on across tiers. On phones the
         facades sample half a mipmap level blurrier (`facadeBias`, set in
         `src/main.js`).
       - **Checks:** a new flicker test renders each frame at the phone's
         resolution and at four times that, filtered down, and counts
         frame-to-frame jitter beyond the ideal image's. On 05 → 06 that
         excess fell from 9–12% (window shader) to 0%; total jitter from
         151% to 123%, below the ideal's 152%. IFC still leads: bright
         pixels in 05 28,800 (22,500 before), other towers unchanged.
         Composition probe: only the four older misses; draw calls
         unchanged.
       - **Step 2, four landmarks (done):** each gets its own painted skin
         from `facades.js` in place of the window shader, and the same
         metre UVs (angled walls follow the wall's direction).
         - *Bank of China Tower:* dark glass facets in four slightly
           different tones per module, thin floor lines and a few lit
           office runs seen through the glass; the X braces are painted
           pale aluminium with a soft glowing halo (`braceWall`).
         - *Cheung Kong Center:* an evenly lit silver grid, no dark
           floors, as at night.
         - *Central Plaza:* bronze-gold glass and mullions with warm
           office bands, 40% lit; the pyramid crown and gold band are
           unchanged.
         - *The Center:* dark glass with a few offices, and a neon line
           every second floor in the tower's cycling colour (a small line
           mask on top of the painted skin).
       - **Checks:** IFC still leads. Bright pixels (luma over 60), main
         buildings / other towers: 01 10,400 / 720, 03 17,900 / 1,880,
         05 29,300 / 6,730, 06 8,500 / 2,190 (other 1,730 before, the
         brighter landmarks at the frame edge). Composition probe: only the
         four older misses; draw calls unchanged.
       - **Step 3, lighting and materials (done):** new
         `src/scene/cityLight.js`, shared by the painted facades and the
         window shader.
         - *Sky in the glass:* the painted towers' glass mirrors the dusk
           sky (horizon purple to a muted blue higher up), strongest where
           a wall is seen edge-on and toward the tops; lit offices keep
           their colour. Each IFC face and each Bank of China facet now
           catches a different amount, so the glass reads as glass.
         - *Street glow:* warm light from the streets washes the lowest
           floors of every tower, fading over about 16 m.
         - *IFC crown uplight:* the crown fins are brightest at their feet
           and fade to 15% at the tips.
         - **Checks:** IFC still leads. Bright pixels (luma over 60), main
           buildings / other towers: 01 11,000 / 720, 03 19,200 / 2,150,
           05 33,000 / 7,700, 06 9,200 / 2,230; the other towers' share is
           unchanged (03 11%, 05 23%). No new meshes: draw calls and
           framing unchanged.
       - **Step 4, background towers (done):** the window shader in
         `src/scene/cityWindows.js`, used by the skyline and Kowloon
         towers, now lights offices rather than scattered single windows.
         - *Floor-clustered lights:* each floor is divided into offices of
           3–6 bays; a lit office has three in four of its windows on, in
           one colour and brightness, and groups of three floors are
           busier or quieter. A quarter of the light is lone late windows.
           Each building keeps the same average lit share (3–6%), and the
           mid-distance floor strips light the same offices, so nothing
           changes pattern as the camera pulls back. The far-tower dots
           (`cityDots.js`) come in runs of 1–3 on one floor too.
         - *Curtain-wall bands:* 45% of the Central towers (20% in
           Kowloon) are ribbon-glazed: continuous glass bands between
           floor slabs, the mullions fading before they get thinner than
           a pixel, the glass catching a little dusk sky (the step 3 sky
           at 80%). Their lit offices read as long bars, dimmed so each
           tower gives off no more light than the punched-window ones.
         - **Checks:** IFC still leads. Bright pixels (luma over 60), main
           buildings / other towers: 01 11,000 / 725 (724 before), 03
           19,200 / 2,210 (2,150), 05 33,000 / 8,740 (7,690), 06 9,160 /
           2,230 (2,230). In 05 the wider office bars add mid-bright pixels
           while the brightest (luma over 90) fall from 3,760 to 2,480;
           the share is 26%, under the one-third limit. Phone flicker on
           the Central towers at 04 → 05, 05 → 06 and 01 → 02: 0–3.8%
           excess, the same with ribbon towers on or off. Composition
           probe: only the four older misses; draw calls unchanged.
       - **Step 5, glow round bright lights (done):** new
         `src/scene/bloom.js`. The scene still renders to the screen as
         before; that frame is copied, its brightest parts (over 0.72 of
         full brightness, softly) are halved down a chain of five smaller
         images (four on phones) and added back up, and only the glow is
         added onto the screen, summed in linear light, so the rest of
         the frame is untouched. The first halving averages bright pixels
         down, so lone sub-pixel lights can't sparkle. What glows: the
         moon, the Clock Tower's floodlit foot, the promenade lamps, the
         wheel and the boats' lights. IFC's offices sit below the
         threshold and stay crisp glass (glowing them would haze the
         frame and triple the Clock Tower's glow). Strength 0.6 on
         desktop, 0.35 on phones. The 香港 wordmark and the near petals
         are drawn after the glow (a second pass on their own layer), so
         they stay crisp; the copy is page text and untouched. If a
         phone falls below the frame-rate target the glow switches off
         before the resolution drops. `?bloom=0` turns it off and
         `?bloom=2` doubles it, for side-by-side checks. A first try
         rendered the scene into an off-screen image instead; transparent
         layers blend differently there and the moon's faint halo showed
         as a hard disc, so the frame copy replaced it.
         - **Checks:** bright pixels in the skyline band within 1% of
           glow off in every frame (IFC still leads, other towers'
           share unchanged). Phone jitter with the glow on is the same or
           slightly lower on 01 → 02, 04 → 05 and 05 → 06 (14.4 / 17.5 /
           40.0% against 14.9 / 18.0 / 40.5%). 香港 edges identical in the
           hero. Composition probe: only the four older misses; draw
           calls of the scene unchanged (the glow adds about ten small
           full-screen passes).
       - **Film grade (user choice, 2026-10-03; README "Open" 6):** the
         glow's last pass now grades the whole frame with its glow
         before writing it back to the screen, so it costs no extra
         pass. Three's own tone mapping would skip every custom shader
         (clouds, beams, fireworks, mountains, lamps and more), so the
         grade is one pass over the finished frame instead. The grade:
         contrast round the night's mid-tones (darks a little deeper,
         lights a little brighter, with a soft shoulder so white stays
         white), indigo added to the shadows, warmth to the highlights,
         and a little more colour where colour is weak. In every
         chapter the sky reads a deeper indigo-violet, the Clock
         Tower, moon, sails and lamps warmer and richer, the towers
         slightly darker so IFC and the lights lead, and the fireworks
         more saturated. Tried against ACES (crushed the skyline to
         silhouettes; brighter, it bleached the highlights: cyan burst
         to white, pale moon) and AgX (a grey haze, salmon sails). The
         grade stays on when the frame-rate guard turns the glow off,
         so the look doesn't change; phones without float targets get
         neither. 香港 and the near petals are drawn after it, ungraded,
         as with the glow. `?grade=0` turns it off for side-by-side
         checks.
         - **Checks:** desktop 00, 01, 03–06 and phone 01, 04, 06
           against the grade off; `?grade=0` matches the old frame
           exactly. No shaders built mid-scroll. JS 210.4 KB gzip.
       - **IFC Mall podium (user request, 2026-10-02):** the user saw the
         base of IFC still flickering on phones; it still used the window
         shader. It now has a painted skin too: four 5.5 m retail floors of
         glass behind mullions, mostly warm and neutral, 60% lit and a
         little dimmer than the tower. **Checks:** the podium flicker test
         at fast scroll fell from 11.8% excess to 7.3%; a plain unpainted
         podium measures 8%, so what is left is its outline and the lit
         pier pavilions in front, not the skin.
       - **Central Ferry Pier halls (user request, 2026-10-02):** the user
         still saw shimmer at the base: each hall's colonnade was 12
         modelled posts 0.8 m wide, thinner than a pixel on phones, so they
         crawled against the lit hall. The colonnade is now painted on the
         hall (`pierHall` in `facades.js`): warm lit bays between pale
         columns under a fascia, on every side, mip-mapped like the towers;
         the posts are gone (one draw call fewer). **Checks:** consecutive
         phone frames at 05 → 06 show hard one-pixel post stripes before
         and soft, steady columns after; same warmth on desktop.
       - **Pier halls dimmed and varied (user request, 2026-10-04):** the
         five halls read as identical lightboxes, as bright as the
         landmarks. The hall tile now holds all five halls side by side and
         each hall's harbour face uses its own section (the halls are one
         merged mesh, still one draw call): per hall 3–4 of 12 bays dark
         (glow 0.03–0.09 and a darker interior), 1–2 bright (0.6–0.7), the
         rest lit at 0.32–0.48 (was 0.5–0.62 throughout), dark bays in runs
         of 1–3 so the lit ones cluster, and each hall scaled 0.85–1.1.
         Seeded, painted once, so it never flickers. Material glow 0.7
         (was 1). Order of brightness: IFC crown, wheel, the brighter pier
         clusters, the waterfront lamps (`PIER_BAYS` in `facades.js`).
       - **Fewer background lights:** every skyline tower is now 3–6% lit
         (was 5–12%), still spread evenly with 10% almost dark; 06 dims the
         skyline to 60% like 05 (`city: 0.6` in `src/data/chapters.js`).
       - **Far-tower dots sized in metres:** a dot now covers about 6 m of
         wall (clamped to 1.5–3.2 px), so phones, where towers are smaller
         on screen, get smaller, calmer dots instead of the desktop size.
       - **Checks:** bright background pixels (luma over 60) against the
         main buildings: 01 1,440 → 720 (main 8,600), 02 1,950 → 1,070, 03
         3,790 → 1,870 (main 16,200), 05 10,670 → 6,720 (main 22,500), 06
         3,040 → 1,730 (main 7,900). Composition probe: only the four older
         misses. Draw calls unchanged. Strobe at the 01 hold unchanged
         (still 0.18%, side steps 0.36%); at scroll speed the 01 skyline
         pops 6.8% of pixels (7.4% before).
     - **Part 3f: boats sit in the water (user choice, 2026-10-02).** The
       user saw white light under the ferry and felt both boats floated
       above the water. The light was the foam skirt: unlit, pale vertical
       streaks all round the hull. The floating came from the water
       reflecting only lights, not the hulls (so the boats sat on an
       unbroken glitter, or on black with a gap down to the sail
       reflections), from nothing showing the boats under way, and from
       the glints being laid out round the camera, so the boats slide over
       them as it moves. The user chose three fixes, before the lighting
       pass:
       - **White water on the surface** (new `src/scene/wakes.js`): the
         foam skirt is gone. Each boat trails a flat wake, a child of the
         boat held level on the water against its bob and roll: a bow
         wave, a thin wash hugging the hull, a churned trail behind the
         stern and the two arms of the V. A fixed mask shapes it while
         streaky foam streams through it from bow to stern (ferry 3 m/s,
         junk 1.8 m/s, frozen in reduced motion), so the boats read as
         sailing even when the scroll stops; lit by the scene, so the
         cabin lights warm it near the hull. The junk's salmon waterline
         stripe darkens toward the water, so its lowest line isn't its
         brightest.
       - **Hull reflections** (`waterReflections.js`, `createWater.js`):
         each hull lays a dark, dimly coloured mirror image on the water
         from its waterline down by its height (ferry 3 m, green; junk
         3.6 m, brown), in four pieces along the hull so it follows the
         boat in perspective, rippled like the glints and breaking up
         away from the hull. It hides the city and moon glints behind it;
         the boats' own window and sail reflections show through.
       - **Checks:** composition probe: only the four older misses; draw
         calls unchanged (the wake replaces the foam skirt). In 01 both
         boats sit on their own dark reflections; in 03 and 04 the wakes
         trail behind the sterns. At wave height the flat wake reads thin;
         a bow spray card was tried and removed as too forceful, so the
         wake stays the only white water (see "No bow spray" in
         [atmosphere.md](atmosphere.md), user choice, 2026-10-03).
       - **Churned water behind the stern (user request, 2026-10-03:
         "restrained white highlights and disturbed water").** The mask
         now has two parts. The white water adds a propeller wash, broken
         patches of foam over the first 22 m behind the stern (half the
         trail on short wakes). Round the whole wake, wider than the white
         and with soft sides, lies disturbed water: there the surface goes
         a little darker and bluer and the glints dim and break up, so the
         trail reads as water stirred by the hull, not paint on the
         surface. A second foam layer at a different scale streams at a
         different pace through the first, so the foam keeps changing
         shape instead of sliding as one pattern. The white stays
         restrained: the same brightness as before, lit only by the scene.
         Still a single plane per boat; draw calls unchanged.
       - **Stronger ferry wake (user choices, 2026-10-03: in 02 and 03 it
         barely showed):** the ferry's trail runs 90 m (was 45) with a
         wider V (spread 0.45, was 0.34), so in 03 the bow wave's near
         arm runs toward the camera on the right and foam trails off the
         stern on the left; the white glows faintly (`glow`) so it reads
         at night. The junk's runs 45 m with a dimmer glow (04 polish,
         user request, 2026-10-03).
       - **Broken foam, not painted lines (user request, 2026-10-03).**
         The mask is now painted from soft, seeded foam patches (radial
         gradients with feathered edges), so nothing reads as a solid
         line, triangle or rectangle. Each V arm is a run of foam clusters
         of random length, offset, width and opacity with seeded gaps
         (never more than three clusters in a row), each bound by a faint
         wider film: dense and bright at the bow, sparser, wider and
         fainter aft. The trail and propeller wash are overlapping
         patches, densest at the stern, widening and fading behind it
         (trail patches scale with trail length, so the short junk wake
         isn't packed brighter). The disturbed water is soft patches too.
         The hull wash and bow wave, the streaming foam, the second churn
         layer and reduced motion are unchanged; all deterministic from
         the seed, so nothing flickers. With the foam broken up the white
         is eased a touch: ferry 1.45× (was 1.6) with glow 0x464e60 (was
         0x5a6274); junk 1.15× (was 1.3) with glow 0x3a4252 (was
         0x4a5262). Still one plane per boat; draw calls unchanged; about
         400 gradient patches per wake, painted once at load.

- **03 calmer skyline (user choice, 2026-10-03).** The storyboard keeps
  the ferry, IFC and the wheel as the only strong hierarchy; Bank of
  China, Central Plaza and the LED strips competed. 03 sets `city` to
  40% (towers, crowns, LED strips, landmarks; IFC and the wheel are
  separate and stay full), easing across the moves in and out.
  04 keeps the same 40% (user request, 2026-10-03), so the towers
  between the junk's sails stay behind the red and the full city
  arrives in 05. `src/data/chapters.js`.

- **05 polish (user choices, 2026-10-03).**
  - **Wheel as co-star:** the PNG draws the wheel about 3.5 times its
    true size against IFC. The wheel stays true scale; the 05 camera
    moves to about 140 m from it and 270 m from IFC, low (16 m desktop,
    47 m phones) with a wide lens (82° and 80°), so perspective does the
    work. The shift lens keeps IFC's sides upright. Desktop: IFC from 3%
    to 90% of the height with the whole crown, the wheel about 20% (was
    15%; PNG 38–45%). Phones: IFC about 70% (was 47%), the wheel about
    17% (was 8%; the user chose 22–25%, but any closer and IFC's crown
    leaves the frame). Trade-off: the desktop water band is now about 5%
    of the height. The moves from 04 and to 06 were checked frame by
    frame; camera clearance passes at the four mouse corners.
  - **Quieter neighbours:** a new `accents` level (default 1) dims only
    the LED crowns and strips and the four landmarks on top of `city`;
    05 and 06 set it to 0.25, so Bank of China and the magenta and amber
    strips beside IFC drop back while the windows stay at 60%
    (`setAccentLevel` in `createIsland.js`). At 0.5 the change did not
    show.
  - **Longer reflections:** a new `reflections` level (default 1)
    scales the power and tail of the fixed lights' water columns (IFC,
    wheel, Clock Tower, moon; the boats keep theirs); 05 sets 2
    (`setBoost` in `createWater.js`). Most visible on phones; the glints
    still read as broken dashes.
  - Files: `src/data/chapters.js`, `src/main.js`,
    `src/scene/createIsland.js`, `src/scene/createWater.js`.

- **02 far shore and quieter phone background (user choices,
  2026-10-03).**
  - **Far shore:** sparse low-rise lights continue the skyline east over
    a low dark strip of land on the island's east side, three rows with
    gaps, mostly warm with a fifth cool white, fogged at 60% of the usual
    rate. They stop where the ridge comes down to the water in desktop
    02, so none stand on the open sea behind the ferry (user request,
    2026-10-03; a longer run and a Kowloon East run across the water were
    removed). Thinned to about half (every 12 m with 62% gaps, was 8 m
    and 50%; user request, 2026-10-04: too many spots right of Central).
    They follow the `city` level. Code: `FAR_SHORE` in
    `createIsland.js`.
  - **Mobile 02:** Central Plaza, BOC and the Mid-Levels lights crowded
    the sky behind the tower, so the phone 02 frame dims the city to
    35% (`city`) and the slope lights to 50% (new `slopeLights` gate,
    default 1), easing across the moves in and out. Desktop unchanged.
    Code: `src/data/chapters.js`, `createMountains.js`
    (`setLightLevel`), `createIsland.js`, `main.js`.
