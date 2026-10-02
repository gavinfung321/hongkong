# Sky, clouds, mist, searchlights, bow spray and fireworks

Part of the Milestone 2 plan (index: [README.md](README.md)). Old section 4, item 5, stop 6, part 3g; the fireworks in 06.


- **Part 3g: sky and clouds (user request, 2026-10-02).** Pulled
  forward from Milestone 4, following `ATMOSPHERE-EFFECTS-BRIEF.md`
  §6.1 (stage 3), one stage at a time with a review after each.
  - **Stage 1, coral cloud cards (done; the cards below were replaced
    by the cloud ceiling, next item):** new
    `src/scene/createAtmosphere.js` and `src/data/atmosphere.js`. The
    staged `coral-clouds.webp` (three cloud bands on one sheet: tall,
    thin and low) now ships as `public/atmosphere/coral-clouds.webp`.
    Each card shows one band, its edges feathered so the bands never
    bleed into each other or end in a hard line. A card is placed by
    where it should sit on screen at its chapter's hold (x, y and
    width as a share of the frame), then fixed in the world 3 km out
    and standing upright, so other chapters see it from their own
    angle the way they see the mountains; no fog, drawn after the
    sky and before the moon, so the moon, ridge and towers always
    cover it. Desktop: 01 a tall band between the Clock Tower and the
    moon (20%), a thin band high to the right (14%); 06 a low band
    under the fireworks (15%). The user found the sky empty on the
    right of 02 and the left of 04 and 05 (user choice, 2026-10-02:
    one cloud for each, not stronger clouds overall), so each now has
    its own card: 02 a low band over the right-hand ridge, below the
    copy and above the ferry; 04 a thin band above the low mountains
    on the left; 05 a thin band between the copy and Bank of China's
    mast (after the chapter fade about 14%, 10% and 8%). The 04 band
    was still too faint to fill the left of the frame (user request,
    2026-10-02): it is now 45% before the fade (about 23% after) and
    a little wider. Phones: 01 a
    band above the moon, 06 a band between IFC's crown and the
    fireworks (both 12%); 02–05 on phones already show the 01 band
    and need no cards of their own. Each card
    sways 1.2% of its width over 110–150 s (not in reduced motion).
    The clouds faded per chapter (`clouds` in `src/data/chapters.js`, now removed):
    full in 01 and 06, 80% in 02–03, 50% in 04 (the darkest frame),
    40% in 05. Below the glow threshold, so they never bloom.
  - **Checks:** none crosses 香港, the copy, the moon, IFC or the
    Clock Tower crown at any hold, desktop or phone. Bright pixels in
    the skyline band within 1% of before in every frame (IFC still
    leads). Composition probe: only the four older misses. Draw
    calls: see the stage 2 checks (clouds and mist measured together).
  - **Cloud ceiling (user request, 2026-10-02):** the user found the
    clouds too thin, too few next to the storyboard and static. They
    were: 12–20% opacity smeared the art's volume away; desktop had
    one strip per chapter and phones only two cards (01, 06); the
    1.2% sway over two minutes couldn't be seen. The storyboard (01,
    02, 04) has a heavy violet ceiling over the whole upper sky with
    coral breaks. The user chose (2026-10-02) a storyboard ceiling in
    every chapter on desktop and phones, steady wind you notice within
    5–10 s with the front layer faster, and the same artwork with
    crops and mirrors (no new art). This goes past the brief's §6.1
    opacity caps (12–22%) by the user's request.
    - **Layers:** a big dim `back` layer (3.6 km out, the art darkened
      and cooled by its tint, 30–55%) roofs the sky; a `front` layer
      of lit banks (3 km out, 40–70%) shows the art's dark tops and
      coral undersides. 5–7 cards per chapter on desktop, 3–5 on
      phones (`CLOUDS.cards` in `src/data/atmosphere.js`), each a band
      or a section of one (`u`, reversed to mirror it).
    - **Per chapter:** each card shows only in its own chapter and
      crossfades with the next across the whole move (the old
      `clouds` level in `chapters.js` is gone), so every chapter's sky
      is composed on its own. 05 is dimmer so IFC leads; 06 keeps a
      dim roof behind the bursts and lit banks below them.
    - **Facing:** cards are parallel to their chapter camera's image
      plane (were upright), so in frames that look up (02, 05, 06)
      the corner cards stay level instead of tilting into streaks.
    - **Wind:** the art scrolls through each card's fixed window (the
      band wraps at its clear ends), so clouds drift right steadily
      but never wander over the copy, the moon or IFC. Front 0.3% of
      the frame's width per second (about 40 px in 10 s at 1440 px),
      back half that. Wide side feathers (20%) let clouds drift in
      and out softly. Still in reduced motion.
    - **Checks:** 香港 is drawn over the clouds, so nothing covers it.
      No lit front bank sits behind the copy; the dim back layer
      reaches behind some copy and keeps it legible. IFC still leads
      in 05 (checked by eye). Draw calls per hold: desktop 01 207, 02 165, 03 120, 04
      93, 05 79, 06 65; phones 01 148, 02 101, 03 116, 04 88, 05 71,
      06 59 (3–7 cloud cards each, about 2–4 more than before). Mid-move
      shots (01→02, 04→05, phone 02→03) crossfade gently. JS 208.3 KB
      gzip. On phones the bigger cloud area costs some pixel fill; the
      user is not re-measuring for now: most visitors are expected on
      an iPhone 16 (user choice, 2026-10-03).
    - **Phone 01 as one deck (user choice, 2026-10-03):** its first
      four cards were full-width strips at about 15%, 30% and 45% down
      the frame with even dark gaps, so the sky read as stripes. Now
      three cards: one dim deck (a short section of the tall band, so
      it is deep) from the top down to the moon, a small lit bank
      off-centre left below the copy, and the bright bank just above
      the moon and ridge, lit from the city like the storyboard. 香港
      now sits over the dim deck instead of a coral strip.
    - **Less cloud in phone 06 (user request, 2026-10-03):** the dim
      roof behind the bursts and the band behind IFC's crown are gone;
      one lit bank (40%) stays between the bursts and the crown, so the
      fireworks open on dark sky. Desktop 06 unchanged.
  - **Stage 2, harbour mist (done; user request, 2026-10-02):** the
    staged `harbour-mist.webp` (four soft blue-grey bands) now ships
    as `public/atmosphere/harbour-mist.webp`. Four separate drifts
    (upright cards, 180–480 m wide, 18–32 m tall, the art at its own
    shape) stand on the island's waterfront just behind the ferry
    piers, facing Kowloon (`MIST` in `src/data/atmosphere.js`), with
    gaps between them; the widest gap keeps the wheel and IFC clear.
    They live in the world, so every chapter sees them where they
    are: boats, the Clock Tower and the junk stand in front and stay
    crisp, and they take the distance fog like the skyline behind.
    A tint colours the grey art like haze lit by the city: warm
    amber-rose at the foot, dusky lavender at the top. Strength per
    chapter (`mist` in `src/data/chapters.js`, changing across the
    whole move): 01 0 on desktop and 0.6 on phones, 02 0.5 (02 looks past the island's end, so
    it barely shows), 03 0.8 (behind the ferry), 04 1 (strongest, a
    wisp at the shore behind the junk), 05 0.4 (softening the foot of
    the podiums), 06 0.15 (fading as the camera tilts into the clear
    sky); full is 45% opacity. They sway 0.8% of their width the
    opposite way to the clouds, and hold still in reduced motion.
    *Rework (user choice, 2026-10-02):* the first version, one
    continuous belt on the water in front of the piers in the art's
    own blue-grey, stretched sideways, read as a grey film: it
    washed out the warm street glow at the foot of Central, ran as
    one even ribbon with a straight top, and in 05 (camera about
    270 m away) veiled the water and its glints. The user chose all
    three fixes: warm tint, separate unstretched drifts, and moving
    them off the water with 05 eased.
    *Unjoined on desktop (user choice, 2026-10-02):* from 01, 1.2 km
    away, the 30–70 m gaps between the drifts vanished and their soft
    ends overlapped, so they ran as one thin strip along the far
    waterline at the same height as the open-water wisps, filling
    the dark gaps between them; from 05 (about 270 m away) the drift
    in front of the camera covered the left third of the frame and
    ran off its edge. Now desktop 01 has no shore mist (only the four
    wisps, separate), and that drift is a 180 m section of its band
    (was the whole band, 340 m wide), so in 05 it ends inside the
    frame at both sides (about 3–26% of the frame's width).
  - **Open-water patches (user choice, 2026-10-02):** the user
    expected the mist spread across the sea, not only along the far
    shore. Four low wisps (`SEA_MIST`, 71–102 m wide, 9–16 m tall)
    lie out on the harbour 420–650 m from the 01 camera, facing it:
    left of the Clock Tower, between the tower and the ferry (the
    fullest bank), between the ferry and the junk farther out, and
    right of IFC toward the Central piers; a slightly milder version
    of the drifts' warm tint. Each uses a section of a mist band, so
    a short wisp keeps a natural shape, its cut ends fading over a
    quarter of its width. From the promenade's height they read as
    separate drifts over about half the waterline, with dark water
    between them, behind the boats, in the hero and 01. Their own
    level (`seaMist`: 01 only) uses the default gate, so they are
    gone early in the move to 02; in 03–05 the camera is low among
    the boats, where mist would veil them. A strip along the Kowloon
    shore was considered and left out: it would sit right under the
    01 camera and behind the Clock Tower in 02.
    *Broken up (user choice, 2026-10-02):* the first four patches
    were 260–380 m wide (30–45% of the frame each) and tiled the
    whole 01 waterline into one grey strip; in 02 on phones they and
    the shore drifts made a band right behind the Clock Tower's
    foot. Now 02 has no open-water mist, and the phone's 02 shore
    mist is at 0.2 (desktop 0.5), so the tower's foot is clean.
  - **Checks:** composition probe: only the four older misses. Draw
    calls added by the clouds and mist together, measured by hiding
    them: desktop 01 10, 02 7, 03 10, 04 9, 05 9, 06 8; phones 8,
    4, 5, 5, 4, 4, all within the brief's aim of 12 (desktop 01 was
    14 before its shore mist came out). The skyline band's other
    towers gain a few bright pixels where the mist lifts the dark
    waterfront (luma over 60, before the mist → now: 05 8,770 →
    8,940; 03 2,210 → 2,350; the first belt had 9,000 and 2,650);
    IFC and the landmarks still lead (05 share 27%, under a third).
    In 05 the water in front of the piers stays dark. The Clock
    Tower, ferry, junk sails, IFC crown and copy are untouched.
  - **The left of 04:** only the stronger coral band (stage 1). The
    waterline left of the skyline's end stays dark, with the
    skyline's own dim shimmer below it. No far shore lights (tried
    and removed, see the changelog, 2026-10-02).
  - **The end of the skyline in 02:** stays dark between the last
    towers and the ferry, so the ferry's hull and lit windows stand
    out against the sky (user choice, 2026-10-02).

- **Searchlights (user choice, 2026-10-03).** Following
  `ATMOSPHERE-EFFECTS-BRIEF.md` §6.5, a little stronger than its "two
  extremely faint" beams in 01, toward storyboard frame 01's beams.
  New `src/scene/createSearchlights.js`; `SEARCHLIGHTS` in
  `src/data/atmosphere.js`. Procedural, no artwork, no real light.
  - **Beams:** four soft strips from the landmark rooftops: Central
    Plaza, Bank of China, Cheung Kong and The Center (not IFC, so IFC
    leads). Each turns about its own axis to face the camera, widens
    from 6 m at the lamp to 240 m 1.5 km up, and fades from its core
    to its sides and toward its far end; it adds light, so it
    brightens the clouds it crosses, and towers in front hide its
    foot. Pale blue-white, core 16% at full level.
  - **Sweep:** each swings there and back over 13–17 s with its own
    phase, within its own lean range; the ranges follow the beams'
    left-to-right order, so two beams never cross into a bright knot.
    Reduced motion holds one pose at 60%.
  - **Per chapter** (`searchlights` in `src/data/chapters.js`, default
    gate): desktop 01 60%, 05 full; phones 05 70% with two beams (Bank
    of China, The Center), none in phone 01; none in 02–04 or 06, so
    they are gone early in the move to 06, before the fireworks.
  - **Checks:** draw calls one per visible beam (desktop 01 211, 05 83;
    phone 05 73). No shaders built mid-scroll (04 → 05). JS 209.1 KB
    gzip. `?off=beams` hides them.

- **Bow spray (user choice, 2026-10-03).** Following
  `ATMOSPHERE-EFFECTS-BRIEF.md` §6.4: white water at the ferry's and the
  junk's bows, adding contact and speed to the flat wakes (which stay).
  New `src/scene/spray.js`; `SPRAY` in `src/data/atmosphere.js`; the
  staged `harbour-spray.webp` ships unchanged as
  `public/atmosphere/harbour-spray.webp` (1280 × 428, 182 KB).
  - **Card:** one upright card of the artwork per boat, a child of the
    boat so it rides the bob, turned about the vertical to face the
    camera and set out on the hull's side toward it; its foam edge sits
    on the waterline. Ferry: 24 m wide, centred 9 m forward of
    midships, so it wraps the bow and the front of the hull. Junk:
    15 m, fainter, below the tyre line. Dimmed to a blue-grey for the
    night (under the glow threshold) and fogged like the boats, so it
    is only a hint in the wide 01 view.
  - **Seen at an angle**, a flat card sank behind the hull's near side,
    so only the spray ahead of the bow showed. Its depth alone is
    pulled toward the camera (ferry 14 m, junk 10 m): it clears its own
    hull but stays behind anything nearer, such as the railing and
    palms in 02 or the other boat.
  - **Strength:** calm at a hold (ferry 62%, junk 50%), up to 90% / 75%
    while the boat moves (full at 8 m/s), easing between the two. A
    slow swell in size of under 6%, built from two waves of unrelated
    periods (4.3 s and 2.9 s), so no loop shows. Reduced motion: still,
    at the calm strength. It fades with its boat's gate.
  - **Checks:** desktop and phone 03 and 04, desktop 01 and 02. Draw
    calls one per visible boat (desktop 01 213, 03 121, 04 95; phone 03
    117, 04 90). No shaders built mid-scroll. JS 210.1 KB gzip.
    `?off=spray` hides it.

- **Fireworks in 06 (user choice, 2026-10-02).** Pulled forward from
  Milestone 4, following `ATMOSPHERE-EFFECTS-BRIEF.md` §6.7 in three
  steps with a review after each: still bursts, then animation, then
  smoke and embers.
  - **Step 1, still bursts (done):** new `src/scene/createFireworks.js`
    replaces the four ring markers (removed from
    `createForeground.js`). The staged `firework-burst.webp` (gold and
    white sparks) ships unchanged as
    `public/atmosphere/firework-burst.webp`, fetched once the first
    frame is up. Each burst is one flat card of that artwork facing
    the 06 camera, 1.6 km out (past IFC, so IFC and the skyline stand
    in front), placed by screen position and size (`bursts` in
    chapter 06 of `src/data/chapters.js`): the card is shifted so the
    artwork's glowing core sits on the configured point, and `size`
    is the sparks' spread. The four markers' places came first; the
    user found four too few and too weak (user request, 2026-10-02),
    so there are now eight on desktop and six on phones, about 35%
    bigger, filling the sky right of and below the copy and above
    IFC's crown (13.5–30% of the width on desktop, 22–46% on phones;
    one cropped by the top-right corner on desktop). The still shows
    them all at once; the animation will stagger them, so only three
    to five are live at any moment. Each burst is spun,
    some mirrored and squashed, so no two match. The sparks add light
    to the sky (no card edges, overlaps brighten) with a small halo
    at each centre (the lamp-glow formula, `FIREWORKS.halo` in
    `src/data/atmosphere.js`); the bloom adds the rest. Colours (user
    choice, 2026-10-02): warm keeps the artwork's own gold; coral and
    cyan are recoloured by brightness, the hottest spark centres
    staying near white. Desktop: two warm, four coral, two cyan; the
    big warm burst upper right leads, the others at 65–90%. Phones:
    warm and coral dominant, two cyan and a small warm supporting
    (60–75%), the lower-right coral a fading remnant at 35% (user
    choice, 2026-10-02). They appear with the `bursts` level, 06
    only.
  - **Checks:** the copy, IFC's crown and the moon stay clear on
    desktop and phone. Sky pixels brighter than luma 120, rings → now:
    desktop 14,380 → 39,640, phone 11,910 → 24,810; IFC's crown
    unchanged. Draw calls: one per burst: desktop 06 56, phone 06 51.
  - **Step 2, the show (done; user choices, 2026-10-02):** the cards
    are animated in a fixed 8 s loop (`FIREWORKS` in
    `src/data/atmosphere.js`; each burst's `at` in `chapters.js`),
    with two quick pairs and two to four bursts live at a time, never
    all at once. Each burst: a rocket climbs from below the frame,
    behind the skyline, slowing as it rises (0.7–1 s, longer for higher
    bursts), its trail a dense streak that shortens as it slows; the
    card ignites at 70% size with a soft flare of its centre glow,
    opens to full size over a second while its white-hot streaks cool
    (the gold toward amber), then fades over 2 s while sinking a
    little; sparks shed from its tips (40 per burst on desktop, 25 on
    phones) slow outward, fall in drooping arcs and fade over 1.5–3 s,
    each a short streak. Rockets and sparks are one set of points in
    the cards' plane (one draw call), in each burst's spark colour.
    The show clock runs only while 06's fireworks show and restarts at
    a composed moment (1.5 s into the loop: the lead burst open, a pair
    igniting) each time 06 comes into view. Everything is worked out
    from the show time alone, so reduced motion holds one composed
    moment (1.6 s, no rocket mid-climb): desktop the gold, coral and
    cyan bursts with sparks falling, phones the two dominant bursts.
    At most two ignitions a second, in different parts of the sky, with
    no white flash. The React "fireworks-show" component the user
    shared was a technique reference only (it needs React, TypeScript
    and Tailwind, paints black over the frame for its trails, fires at
    random over the copy, and its licence is unknown).
  - **Checks (step 2):** contact sheets of one loop every 0.5 s,
    desktop and phone; the copy, IFC's crown and the moon stay clear
    throughout. Draw calls at the busiest moment: desktop 06 53, phone
    06 49 (only live bursts draw). Working out one frame of the show
    takes 0.09 ms on desktop. Composition probe: only the four older
    misses.
  - **Step 3, smoke (done; user request, 2026-10-02):** soft smoke
    drifts where the biggest bursts were: three wisps on desktop (coral
    after the lead gold burst, violet under the first coral, lavender
    under the lower-right coral) and two on phones (coral under the
    lead burst, lavender under the left cyan burst, added on user
    request, 2026-10-02: it gathers as the coral wisp thins, so the two
    take turns), all clear of the copy (`smoke` in chapter 06 of
    `chapters.js`; timing in `FIREWORKS.smoke`). Each is a feathered
    card cut from `public/atmosphere/firework-smoke.webp`, drawn behind
    every burst and in front of the clouds with normal (not added)
    blending, so it veils the sky rather than glowing. A wisp gathers
    0.6 s after its burst ignites, fades in over 1.2 s, is fullest as
    the burst fades, then grows from 80% to 120% while drifting up and
    to the right and thins away over 5 s, so it lingers after its burst
    has gone. At most 9–10.5% opacity: a first try at about 30% read as
    solid pink and blue clouds that dulled the bursts, and wisps
    centred on their bursts muddied the sparks, so each sits beside and
    below its burst; the shipped 14–16% was still a bit strong, so all
    wisps are a third weaker (user choice, 2026-10-02). The falling spark streaks from step 2 stand in for
    the brief's embers, so `firework-embers.webp` is not used. Reduced
    motion (1.6 s) shows only a hint of the first coral wisp.
  - **Checks (step 3):** frames at 1.6, 2.5, 3.5, 4.5 and 6.5 s plus
    the loop contact sheets, desktop and phone: the copy, IFC's crown
    and the moon stay clear. Draw calls at the busiest moment: desktop
    06 56, phone 06 51 (one per visible wisp). One frame of the show
    takes 0.08 ms on desktop. Composition probe: only the four older
    misses. JS 207 KB gzip.
  - The fireworks are complete (all three steps of §6.7).
