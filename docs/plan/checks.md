# Performance budget and acceptance checks

Part of the Milestone 2 plan (index: [README.md](README.md)). Old sections 5 and 8.


## 5. Performance budget

Measured with the `?fps` overlay on a production build, as in
`greybox-review/PERFORMANCE.md`.

| Metric | Laptop | iPhone 11 |
|---|---|---|
| Average fps | ≥ 50 | ≥ 30 |
| 1% low fps | ≥ 40 | ≥ 24 |
| Draw calls | **≤ 220** (raised from ≤ 100 at the Milestone 2 review, user choice, 2026-10-03: the laptop holds 60 fps at 213, and the iPhone 11's switch test showed pixel count, not calls, as its cost; merging the ferry's and Clock Tower's meshes stays the fix if a phone falls short). Now (bow spray removed, 2026-10-03): desktop 01 211, 02 165, 03 120, 04 93, 05 83, 06 65; mobile 01 148, 02 101, 03 116, 04 88, 05 73, 06 57. History: was ≤ 80, then ≤ 100, over budget in 01 and 02 (measured per hold, 2026-10-02): desktop 01 158, 02 136, 03 85, 04 58, 05 45, 06 40; mobile 01 108, 02 69. With the edge railings: desktop 01 164, 02 133, mobile 01 114, 02 75. With the 3D palms: desktop 02 137. With the bauhinia tree: desktop 01 170 (desktop only). The water reflections add none. The mountain rebuild adds 3 everywhere (third range, mist, slope lights): desktop 01 173, 02 140, 05 48; mobile 01 117. The landmarks and varied tops add 12 (four skyline-top sets, six landmark meshes, one mast mesh, one set of warning lights): desktop 01 185, 02 149, 03 100, 05 60; mobile 01 129. The far-tower window dots add 1: desktop 01 186, 02 150, 05 61; mobile 01 130. The firework show in 06 takes one call per live burst, one for its rockets and sparks and one per visible smoke wisp: at its busiest desktop 06 56, mobile 06 51 (desktop 05 70, mobile 05 61; 2026-10-02). The cloud ceiling (3–7 cloud cards per hold) gives desktop 01 207, 02 165, 03 120, 04 93, 05 79, 06 65; mobile 01 148 (one deck, 2026-10-03), 02 101, 03 116, 04 88, 05 71, 06 59 (2026-10-02; 58 with one cloud bank, 2026-10-03). The searchlights add one call per visible beam: desktop 01 211, 05 83; mobile 05 73 (2026-10-03). The bow spray added one call per visible boat (desktop 01 213) until it was removed the same day (2026-10-03). Earlier notes gave "85 peak (03)", which missed 01 and 02. Biggest shares in 01: ferry 40, Clock Tower 32, junk 25, IFC 15, wheel 12, stone railing 9 (with its fade twins), promenade lamps 3. The rebuilt vessels and tower are the place to merge meshes | ≤ 220 |
| New generated textures | **≤ 32 small code-drawn textures** (each ≤ 512 px on its short side, the Clock Tower shaft maps 848 px tall), about 6 MB of GPU memory, plus the wordmark and the shipped artwork (raised from ≤ 4 at the Milestone 2 review, user choice, 2026-10-03: they stand in for model files). Now 28 (about 5.5 MB). History: ≤ 4 more, each ≤ 512 px, plus the wordmark (about 1400 × 700 px, so it stays sharp); over budget since 2b (2026-10-01): 18 small code-drawn surface textures (the ferry reshape added four 512 × 64 deck textures and a foam strip; the junk rebuild swapped its two textures for two new ones and added two 512 × 64 deckhouse textures; the ferry rebuild swapped its four deck textures for four 512 × 56 upper-deck textures and added a 512 × 64 cabin texture). The Clock Tower rebuild swapped its three 256 × 1088 shaft maps for two 256 × 848 shaft maps, two 54 × 848 pilaster maps and two 128 × 96 crown maps: 21 textures, about 5.5 MB of GPU memory in all (was 6.6 MB). The wheel adds a 64 × 64 hub glow (22 textures; the IFC rebuild adds none). The stone railing adds a 64 × 64 granite tile and a 64 × 96 post panel (24 textures; the lantern glows are drawn in their shader). The wet paving adds a 240 × 240 slab tile (25 textures). The palms add a 256 × 256 frond and bark atlas (26 textures). The bauhinia tree adds a 512 × 512 leaf and flower atlas (27 textures; its falling petals reuse the petal texture). The water reflections add a 256 × 1 skyline strip (28 textures, 1 KB). The petal texture grew from a 128 × 128 code drawing to the 512 × 500 artwork (same count, about 1.4 MB of GPU memory with mipmaps; 2026-10-02). Budget raised rather than the shaft tiled at a lower resolution (user choice, 2026-10-03) | same |
| Point lights | 3 (Clock Tower flood, ferry, junk sail light) since 2b; the promenade lanterns and lamps are faked in the materials (`lamps.js`). All three stay in the scene in every chapter (a hidden boat's light is at zero), so the count never changes mid-scroll (2026-10-02) | same |
| JS bundle (gzip) | ≤ 230 KB (was ≤ 200 KB) | same |
| Shaders built mid-scroll | 0: all 73 are built in one unseen frame before the loading screen lifts (2026-10-02; was 32 on the way from 01 to 02 on phones) | same |

**Laptop, Milestone 2 review (2026-10-03):** production build in Cursor's
browser (AMD Radeon 860M, 1187 × 952, pixel ratio 1), 36 s scroll from the
top to the footer: 60 fps average (display limit), 1% low 57.7, worst
second 60, no frame over 50 ms (longest 17.6 ms). JS 210.5 KB gzip. See
`docs/milestone-2-review/REVIEW.md`.

**First iPhone 11 reading (user, 2026-10-02, live site, before the
shader fix):** 01 hold 47 fps, 1% low 41, worst second 33, 148 calls,
42k triangles; 02 hold 34 fps, 1% low 28, worst second 32, 103 calls,
73k triangles; pixel ratio at its phone cap of 1.5 (no automatic drop).
Both pass; 02 is close to the line, and the move from 01 to 02 stuttered
(32 shaders built mid-scroll, now fixed). In 02 the palms were 35k of
the 73k triangles: nine palms of 0.7–1.2k triangles, each drawn four
times (a depth pass and a colour pass, each split into back and front
faces). Now each palm draws twice and phones skip two palms left of the
frame: phone 02 52k triangles, 98 calls (user choice, 2026-10-02).
Re-measured (user, 2026-10-02): phone 02 31–36 fps, 1% low 28, worst
second 31, so triangles were not the limit; the cost is per pixel.

**Measurement switches** (live, like `?fps`, user choice 2026-10-02):
`?dpr=1.25` caps the pixel ratio, `?aa=0` turns off edge smoothing,
`?bloom=0` turns off the glow, `?grade=0` the film grade, and
`?off=water,clouds,mist,palms,petals,beams` hides any of those layers
(`beams`: the searchlights, 2026-10-03). The `?fps` box lists the switches in use.

If the iPhone 11 misses its target, layers are switched off on mobile in this
order: bloom (built in part 3e, step 5), particles, glow sprites, lit windows.
**Automatic sharpness (user choice, 2026-10-02):** the iPhone 11 switch
test in 02 (against about 34 fps) gave glow off 32, edge smoothing off 33,
water off 34, clouds, mist, palms and petals off 38, and pixel ratio 1.25
43 (1% low 34): pixel count is the cost. So phones start at pixel ratio
1.5 and, if the 2 s average falls under 40 fps (after 2 s of settling
after load), step once to 1.25, their floor; the glow no longer switches
itself off first. Desktop keeps 45 fps, steps of 0.25, floor 1. Checked
with a slowed browser: phone 1.5 → 1.25 after 4 s and holds; desktop
2 → 1 in steps. On the iPhone 11 the user reports the frame rate fine
now (2026-10-02). iPhone 13 not yet measured. After the cloud ceiling
the user chose not to re-measure for now: most visitors are expected on an
iPhone 16 (user choice, 2026-10-03).

## 8. Acceptance checks

The milestone passes when:

1. All twelve frames still pass the composition probe (±3%) with the nav bar in
   place, and no copy overflows at 1440 × 900, 1156 × 766 and 390 × 844.
   With the mouse at either edge, desktop frames stay within ±6% and the
   parallax is plainly visible (user request, 2026-10-01). On narrow desktop
   windows (down to an aspect of about 1.1) the 02 Clock Tower keeps its full
   height and the ferry stays whole; no palm crosses the tower (user
   request, 2026-10-01), at the hold or while the camera moves in and out
   of 02, and the 3D palms sway gently with no flicker (user request,
   2026-10-02); the desktop hero's right edge is framed by the bauhinia
   canopy, its petals drifting left, with the IFC, moon, junk and 香港
   uncovered and 東方明珠 legible (user choice, 2026-10-02); no promenade lamp crosses the tower or the ferry,
   and a half-faded railing is an even veil with no rails showing through
   its posts (2026-10-02). The promenade reads as dark wet stone slabs with
   narrow, broken lamp reflections, quieter than the tower and copy, with
   no glare patch on the hero's near deck and no shimmering joints or
   flecks (user request, 2026-10-02). The harbour glitters like the user's
   junk photo: IFC, the Clock Tower, the ferry, the junk and the moon break
   into small horizontal glints with dark gaps, ragged edges and soft ends,
   over a dim continuous shimmer from the skyline; no vertical rectangles,
   no glare or hot blobs under the boats, nothing strobing while the camera
   moves (user choices and requests, 2026-10-02). The ferry and junk sit in
   the water: no white light at the ferry's foot, a dark rippled mirror
   image under each hull, and a wake streaming behind each boat even when
   the scroll stops (user choice, 2026-10-02). IFC is the brightest
   tower in 01 and 05; no Central building is lit as much, and in 05 the
   towers around it are clearly quieter, together well under IFC's bright
   pixels (user requests, 2026-10-02). The mountains have rough ridges with the Peak's outline,
   lighter upper slopes, a thin moonlit edge near the moon, a faint third
   range, mist at their foot and quiet slope lights; their ends slope down
   to the water, with no cliff-like cut in any frame or move (user request,
   2026-10-02); the ridge still hides
   the moon's lower edge in 01, and nothing on them twinkles while the
   camera moves (user choices, 2026-10-02). Bank of China Tower, Cheung
   Kong Center, Central Plaza and The Center are recognisable, the skyline
   has varied tops, none of them covers the moon, IFC or copy, IFC stays
   the brightest tower, the other towers together give off well under the
   main buildings' light, spread thinly over every tower rather than
   crowded on a few, and far towers (the 02 background) show lit windows
   too (user requests and choices, 2026-10-02); in 01–03, 05 and 06 the
   other towers give off no more than about a third of the main
   buildings' bright light, and IFC does not twinkle or flicker while
   scrolling on a phone, nor change look mid-scroll on any screen: no grey
   slab, lit windows stay lit (user requests, 2026-10-02); IFC reads as a
   lit glass office tower, floors as bands behind thin mullions rather than
   scattered dots, its mall podium too, and the ferry pier halls in front
   hold still (no twinkling base on phones, user requests, 2026-10-02),
   and the four landmarks have their own glass skins
   (Bank of China glowing braces over dark facets, Cheung Kong silver,
   Central Plaza bronze, The Center neon floor lines) that hold still
   while scrolling; their glass catches the dusk sky, warm street light
   washes the foot of Central and IFC's crown fins are uplit (user choice,
   2026-10-02); the background towers' lights come in offices along their
   floors, some towers banded curtain walls, with no more light than
   before and no new shimmer on phones (user choice, 2026-10-02); the
   brightest lights (moon, Clock Tower foot, lamps, wheel, boat lights)
   have a soft glow, weaker on phones, that adds no shimmer, while 香港,
   the near petals and the copy stay crisp and phones hold 30 fps (the glow
   drops first if they can't; user choice, 2026-10-02); faint coral cloud
   bands hang in the sky of 01 and 06 (fainter elsewhere, faintest in 04
   and 05), behind the moon, ridge and towers and clear of 香港 and the
   copy on desktop and phones (user request, 2026-10-02), and no desktop
   hold has an empty side of sky: 02 has a band on the right, 04 and 05
   on the left (user choice, 2026-10-02); a soft low mist lies along the
   island's waterline, strongest behind the junk in 04, absent from
   desktop 01 and faint in phone 01, gone in 06, and in the hero and 01
   separate low wisps spread across the open water behind the boats,
   with dark water between them, never one unbroken strip and never
   joined by shore mist behind them; in 05 no drift runs off the
   frame's edge as a strip (user choice, 2026-10-02); in 02 no mist band runs behind the Clock Tower's
   foot on phones (user choices, 2026-10-02); the shore mist is
   warm-tinted separate drifts, not a grey film, and leaves the water in
   front of the 05 piers dark (user choice, 2026-10-02), never over the Clock Tower, the boats, the sails, IFC's
   crown or the copy (user request, 2026-10-02); the left of desktop 04
   carries a stronger coral band, never over the junk or the copy, and
   no reflection there is brighter than the skyline's own shimmer; the
   end of the skyline in 02 stays dark beside the ferry (user choices,
   2026-10-02); the three tall promenade lamps stand apart, never
   bunched, in the hero and 01 on wide windows, in desktop 02 and on
   phones (user request, 2026-10-02), and no brace line, mast or warning light shimmers
   while the camera moves; warning lights and colour cycles hold still in
   reduced motion (user choices, 2026-10-02).
2. The wordmark reads in front of the whole scene, shading into dusk toward its
   feet, raised over the boats (user request, 2026-10-02), and sinks and
   fades out with the 01 copy from the first scroll.
   Mobile shows it horizontal and smaller, floating in the sky between the
   copy and the moon with the tower, junk, moon and IFC uncovered (user
   request, 2026-10-02).
3. Nav links, the menu and "Return to the harbour" all land on the right
   hold. The hero's bottom-left shows only "Scroll to cross" on desktop, no
   chapter numbers, and "01 / 06" beneath it on phones (user request,
   2026-10-02). The menu works with the keyboard and a screen reader.
   The vertical label shows the current chapter and never covers a subject.
   The side pager (desktop) marks the current chapter and its dashes land on
  the right hold. "Return to the harbour" is a thin rounded button on one
  line at the top of the footer, not in 06. When the footer arrives, the 06
  copy, vertical label and side pager are gone and the nav bar is not
  forced back; the footer's chapter links land on their holds (user
  requests, 2026-10-02).
4. Reduced-motion mode shows no sinking, no parallax, no particles and no
   cursor ring, the palms and the bauhinia (leaves and its falling petals)
   hold still (user request, 2026-10-02), and the
   Observation Wheel holds still (it turns slowly in
   continuous mode; user request, 2026-10-02), and still tells the whole story. In continuous mode the water
   does not blink or strobe while the mouse moves or during scroll
   transitions.
5. The poster-only fallback still works, with a usable nav. A normal load
   shows only the night sky until the 3D scene fades in: no poster art and
   no plain-layout copy flash first (user choice, 2026-10-02).
6. Frame 01 with the look-test layers is approved by the user against the
   storyboard and the Kage reference.
7. The performance budget in section 5 is met on the laptop and the iPhone 11.
