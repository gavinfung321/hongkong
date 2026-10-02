# Sky, clouds, mist and fireworks

Part of the Milestone 2 plan (index: [README.md](README.md)). Old section 4, item 5, stop 6, part 3g; the fireworks in 06.


- **Part 3g: sky and clouds (user request, 2026-10-02).** Pulled
  forward from Milestone 4, following `ATMOSPHERE-EFFECTS-BRIEF.md`
  §6.1 (stage 3), one stage at a time with a review after each.
  - **Stage 1, coral cloud cards (done):** new
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
    The clouds fade per chapter (`clouds` in `src/data/chapters.js`):
    full in 01 and 06, 80% in 02–03, 50% in 04 (the darkest frame),
    40% in 05. Below the glow threshold, so they never bloom.
  - **Checks:** none crosses 香港, the copy, the moon, IFC or the
    Clock Tower crown at any hold, desktop or phone. Bright pixels in
    the skyline band within 1% of before in every frame (IFC still
    leads). Composition probe: only the four older misses. Draw
    calls: see the stage 2 checks (clouds and mist measured together).
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
    choice, 2026-10-02). Still in every motion mode for now; they
    appear with the `bursts` level, 06 only.
  - **Checks:** the copy, IFC's crown and the moon stay clear on
    desktop and phone. Sky pixels brighter than luma 120, rings → now:
    desktop 14,380 → 39,640, phone 11,910 → 24,810; IFC's crown
    unchanged. Draw calls: one per burst: desktop 06 56, phone 06 51.
  - **Next (user choice, 2026-10-02):** step 2 keeps these cards and
    animates them (a deterministic 7–9 s loop: a rocket rising from
    behind the skyline, a flash, the card opening from about 70% size,
    a slow fade; never all at once; reduced motion holds a composed
    still), with our own three.js particles for the rockets and
    falling sparks. The React "fireworks-show" component the user
    shared is a reference for that technique only: it needs React,
    TypeScript and Tailwind, paints black over the frame for its
    trails, fires at random over the copy and its licence is unknown.
    Step 3: smoke.
