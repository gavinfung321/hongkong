// The single chapter configuration. Every scroll threshold, camera pose, copy
// region, visibility value, fog value, and composition target lives here.
//
// camera:      position / target in world metres, vertical fov in degrees.
//              Optional via: [[x, y, z], ...] waypoints the camera passes on
//              the way to the next chapter (to route around the tower). The
//              camera keeps an even pace by distance through them; the look
//              turns with distance too, or by viaTurn: [f, ...], the share of
//              the turn done at each waypoint.
//              Chapter 01 only: holdDolly, the opening push. It starts half a
//              vector back at the top of the page and passes the authored
//              pose at the keyframe.
//              Desktop only: parallax, a multiplier on the mouse parallax
//              swing for this hold (omitted = 1). At the mouse extremes a
//              subject may drift up to ±6% from its composition target.
//              Desktop only: keepHeight: true keeps the vertical fov on windows
//              narrower than 1.6 (the sides are trimmed instead of the fov
//              widening), so a tall subject keeps its size.
// copy:        copy-safe region as % of the viewport (left / top / right / bottom).
// dwell:       optional extra scroll, in svh, at this chapter's keyframe. The
//              camera stays on the hold pose through it while the chapter's
//              story plays out one layer at a time (copyLayer.js).
// visibility:  1 = shown, 0 = gated (faded out) at this chapter's hold pose.
//              petals is a density (omitted = 1); city is the skyline
//              windows' level (omitted = 1); accents dims the LED crowns,
//              strips and landmarks further (omitted = 1); reflections
//              scales the fixed lights' water columns (omitted = 1).
// vessels:     [x, z, heading] world position of each vessel at this chapter's
//              hold pose, per breakpoint (mobile is re-authored, not cropped).
//              Optional via: { ferry: [[x, z, heading], ...] }, points a vessel
//              passes on the way to the next chapter. Optional drift:
//              { ferry: [before, after] }, the metres it sails along its
//              heading through this hold, up to and on from the keyframe
//              (vesselRoutes.js).
// probes:      composition targets (% of viewport) checked by the debug probe.

const SB = '/docs/storyboards';

export const SCROLL = {
  chapterLength: 150, // svh per chapter
  hold: 0.14, // fraction of a segment held still on each side of a keyframe
  copyFull: 0.14, // copy fully visible within this distance of a keyframe (= hold)
  copyFade: 0.05, // then fades out before the camera has moved far
  damping: 5,
  // A jump of this many chapters or more snaps behind the veil; 0.9 so a jump
  // to the next chapter (exactly 1) does too (transition review, 2026-10-03).
  jumpThreshold: 0.9,
  // Links and reloads land this share into a chapter's dwell, once its title
  // and first beat are in (copyLayer.js STORY).
  dwellLand: 0.24,
};

// The 香港 wordmark in the hero, authored on screen at chapter 01's opening pose.
// x / foot: % of the viewport where the characters' feet are; width: % of the
// viewport width; depth: metres ahead of the camera. It is drawn in front of
// everything, but it is a fixed object in the world: it never moves itself,
// the camera moves past it (chapter 01's holdDolly push, the mouse parallax,
// the opening glide), and it fades from the first scroll by progress leaveEnd
// (the hero is p < 0; chapter 01's hold starts at 0.36). Close, so that the
// camera's moves shift it against the far harbour (after the Kage reference's
// word; user choice, 2026-10-04: it was 47 m out on the water on desktop and
// 190 m on phones, and slid down out of frame by script).
export const HERO = {
  wordmark: {
    text: '香港',
    // Desktop floats over the harbour beyond the railing, raised over the
    // boats (user request, 2026-10-02); its feet must stay below the horizon
    // (57.5% at the opening pose). Mobile floats in the empty sky between the
    // copy and the moon (user request, 2026-10-02).
    // Mobile fadeEnd: a little sooner than desktop, the phone hero being
    // shorter in reading time. Mobile clear: px kept free under 01's
    // copy on short screens, moving the feet down to maxFoot %, then shrinking
    // (user request, 2026-10-03).
    // Short landscape (phones turned sideways, under 500 px tall): the desktop
    // word keeps clear of 01's copy the same way, standing lower and smaller
    // (interface audit IS-03, user request, 2026-10-03).
    desktop: { x: 50, foot: 74, width: 60, depth: 16 },
    desktopShort: { clear: 14, maxFoot: 84 },
    mobile: { x: 50, foot: 42, width: 78, depth: 25, fadeEnd: 0.8, clear: 14, maxFoot: 48 },
  },
  leaveEnd: 0.2,
  // Fractions of the way to leaveEnd: the wordmark and chapter 01's copy stay
  // whole until fadeStart, so the camera is seen nearing the word, then fade
  // by fadeEnd (a breakpoint's own fadeEnd wins; user choice, 2026-10-04,
  // was gone by 0.6, 0.4 on phones).
  fadeStart: 0.15,
  fadeEnd: 0.9,
  // The opening glide (after the Kage reference; user choice, 2026-10-04):
  // as the entrance cover lifts on a visit from the top, the camera eases in
  // from `back` metres behind and `rise` above the opening pose.
  glide: { back: 6, rise: 0.6, duration: 2.4 },
};

export const chapters = [
  {
    id: '01',
    slug: 'harbour-at-dusk',
    title: 'Harbour at Dusk',
    storyboard: {
      desktop: `${SB}/frame-01-harbour-at-dusk-rough.png`,
      mobile: `${SB}/frame-01-harbour-at-dusk-mobile-rough.png`,
    },
    camera: {
      desktop: {
        position: [-13, 5.9, 99.5],
        target: [-2.4, 30.5, -299.6],
        fov: 41.5,
        holdDolly: [0, 0, -10],
        via: [[-50, 7, 58]],
      },
      mobile: { position: [-43.1, 9, 99], target: [7.6, 121.5, -281.4], fov: 77.7, holdDolly: [1.3, 0, -9.9] },
    },
    copy: {
      desktop: { left: 5, top: 8.5, right: 36, bottom: 34 },
      mobile: { left: 8, top: 9, right: 92, bottom: 39 },
    },
    visibility: {
      // No shore mist on desktop: from here its drifts join the wisps into one band.
      // Withheld (atmospheric depth Priority F, user choice, 2026-10-04):
      // skyline at 75%; petals at 80% (were 50%, raised for a fuller opening,
      // user choice, 2026-10-04). Searchlights stay (01 and 05 only).
      // moon 0.75 and the junk's sail reflection at half, so the Clock Tower
      // leads (Priority 3 balance, user choice, 2026-10-04).
      desktop: { ferry: 1, junk: 1, ifc: 1, wheel: 1, deck: 1, railing: 1, palms: 0, bauhinia: 1, bush: 1, bursts: 0, petals: 0.8, city: 0.75, mist: 0, seaMist: 1, haze: 0.5, searchlights: 0.6, moon: 0.75, junkGlow: 0.5 },
      // No deck: the mobile storyboard has open water right to the bottom edge.
      // Palms at the tower's foot, as in the storyboard (user choice, 2026-10-03).
      mobile: { ferry: 0, junk: 1, ifc: 1, wheel: 1, deck: 0, railing: 0, palms: 1, bauhinia: 0, bush: 0, bursts: 0, petals: 0.8, city: 0.75, mist: 0.6, seaMist: 1, haze: 0.5, searchlights: 0, moon: 0.75, junkGlow: 0.5 },
    },
    fogDensity: 0.00045,
    vessels: {
      desktop: { ferry: [-29.2, -103.6, 0], junk: [26.1, -53.1, 0] },
      mobile: { ferry: [-19.7, -89.9, 0], junk: [-18.1, -23.2, 0] },
    },
    probes: {
      desktop: {
        tower: { left: 9, right: 17, top: 3, bottom: 60 },
        ferry: { left: 33, right: 49, bottom: 64 },
        junk: { left: 61, right: 77, bottom: 64 },
        // IFC sits right of the PNG (70–74) so the junk's sails don't hide it.
        ifc: { left: 79, right: 83, top: 18 },
        wheel: { left: 71.4, right: 74.6, bottom: 56 },
        horizon: 57.5,
      },
      mobile: {
        tower: { left: 5, right: 19, top: 42, bottom: 72 },
        junk: { left: 44, right: 75, bottom: 74 },
        // Right edge 1% wider than the PNG: the rebuilt IFC has the true 57 m width.
        ifc: { left: 81, right: 89, top: 46 },
        wheel: { left: 73, right: 79, bottom: 70 },
        horizon: 70,
      },
    },
  },
  {
    id: '02',
    slug: 'kowloon-edge',
    title: 'The Kowloon Edge',
    storyboard: {
      desktop: `${SB}/frame-02-kowloon-edge-rough.png`,
      mobile: `${SB}/frame-02-kowloon-edge-mobile-rough.png`,
    },
    camera: {
      desktop: {
        position: [-81.6, 6.5, 33],
        target: [196.2, 137.9, -223],
        fov: 61.4,
        keepHeight: true,
        // The first waypoint sits back from the tower and the look turns
        // early, so the tower slides out instead of whipping past
        // (transition review, 2026-10-03; viaTurn: cameraRig.js).
        via: [[-28, 7, 37], [5, 5, -90]],
        viaTurn: [0.4, 0.7],
      },
      mobile: {
        position: [-59.6, 4.8, 108.2],
        target: [-59.1, 82.8, -284.1],
        fov: 36.6,
        via: [[-44, 8, 90], [-24, 6, -35]],
      },
    },
    // Two beats, the lead larger than the second, and on desktop the ca.
    // 1915 memory print under them; the timeline row sits at the foot of the
    // screen (narrative spine prototype, user requests, 2026-10-04). The
    // print's lower edge may pass behind the ferry's masts in memory mode.
    copy: {
      desktop: { left: 50, top: 11, right: 97, bottom: 82 },
      mobile: { left: 8, top: 7.5, right: 92, bottom: 30 },
    },
    // Time to read the header before the print and timeline come up (user
    // request, 2026-10-04).
    dwell: 80,
    visibility: {
      // afterglow: the red-orange sky low on the right (02 only; createScene.js).
      // city, slopeLights: the skyline and Mid-Levels behind the tower dimmed,
      // as on mobile, so the tower and afterglow lead (atmospheric depth
      // Priority F, user choice, 2026-10-04).
      desktop: { ferry: 1, junk: 0, ifc: 1, wheel: 1, deck: 1, railing: 1, palms: 1, bauhinia: 0, bush: 0, bursts: 0, city: 0.6, slopeLights: 0.7, mist: 0.5, seaMist: 0, haze: 0.8, searchlights: 0, afterglow: 1 },
      // Fainter shore mist: the phone looks straight at the tower's foot.
      // city, slopeLights: Central Plaza, BOC and the Mid-Levels lights
      // behind the tower dimmed, so the tower leads (user choice, 2026-10-03).
      mobile: { ferry: 0, junk: 0, ifc: 1, wheel: 1, deck: 1, railing: 1, palms: 1, bauhinia: 0, bush: 0, bursts: 0, city: 0.35, slopeLights: 0.5, mist: 0.2, seaMist: 0, haze: 0.8, searchlights: 0, afterglow: 1 },
    },
    fogDensity: 0.00045,
    vessels: {
      desktop: { ferry: [-1.4, 5.3, -0.2], junk: [120, -80, 0] },
      mobile: { ferry: [20, -120, 0.8], junk: [120, -80, 0] },
    },
    probes: {
      desktop: {
        // keepHeight: on narrow windows the sides are trimmed, so the ferry
        // sits inside 60–84 (it stays whole down to a 1.1 aspect).
        tower: { left: 16, right: 34, top: 3, bottom: 88 },
        ferry: { left: 60, right: 84, top: 71, bottom: 87 },
        ifc: { offscreen: true, behind: 'tower' },
        wheel: { offscreen: true, behind: 'tower' },
        horizon: 80,
      },
      mobile: {
        tower: { left: 33, right: 64, top: 20, bottom: 82 },
        ifc: { offscreen: true, behind: 'tower' },
        wheel: { offscreen: true, behind: 'tower' },
        horizon: 80,
      },
    },
  },
  {
    id: '03',
    slug: 'across-the-water',
    title: 'Across the Water',
    storyboard: {
      desktop: `${SB}/frame-03-across-the-water-rough.png`,
      mobile: `${SB}/frame-03-across-the-water-mobile-rough.png`,
    },
    camera: {
      desktop: { position: [77.6, 2.2, -323], target: [40.2, 50.7, -718.3], fov: 56.9 },
      mobile: { position: [-31.2, 1.8, -218.1], target: [41.8, 112.7, -595.4], fov: 80.1, via: [[60, 3, -300]] },
    },
    // Index panels (narrative spine scene 03, user requests, 2026-10-04):
    // the label and title top-left; on desktop the panels in a row along the
    // foot, on phones the beat panels under the title and the route below.
    copy: {
      desktop: { left: 5, top: 11, right: 42, bottom: 40 },
      mobile: { left: 8, top: 9, right: 92, bottom: 37 },
    },
    // Long enough for the route dot to cross; the camera stays on the hold
    // pose through it.
    dwell: 60,
    visibility: {
      // city: the other towers and their LEDs at 40% so the ferry, IFC and
      // the wheel lead, as the storyboard asks (user choice, 2026-10-03).
      // petals 0.3: few petals out on the open water (atmospheric depth
      // Priority F, user choice, 2026-10-04). buoy: the channel buoy
      // (atmospheric depth Priority 2, user choice, 2026-10-04;
      // createBuoy.js).
      desktop: { ferry: 1, junk: 0, ifc: 1, wheel: 1, deck: 1, railing: 0, palms: 0, bauhinia: 0, bush: 0, bursts: 0, petals: 0.3, city: 0.4, mist: 0.8, seaMist: 0, haze: 1, searchlights: 0, buoy: 1 },
      mobile: { ferry: 1, junk: 0, ifc: 1, wheel: 1, deck: 1, railing: 0, palms: 0, bauhinia: 0, bush: 0, bursts: 0, petals: 0.3, city: 0.4, mist: 0.8, seaMist: 0, haze: 1, searchlights: 0, buoy: 1 },
    },
    fogDensity: 0.00045,
    // The ferry holds its place on the water through the hold (no drift on
    // either side of the keyframe; user request, 2026-10-03), then sails
    // on toward Central slowly enough that the camera overtakes it on the
    // way to 04: its cabin
    // slides out past the left edge (at least 16 m off on desktop, about
    // 27 m on phones) and its bow uncovers the junk, which comes up from
    // beyond it (user request, 2026-10-03: a natural occlusion, no wipe).
    // It waits behind the 04 camera, out of frame. The desktop via point
    // sits a little back along the route, so the camera starts overtaking
    // it as the move begins (user request, 2026-10-03).
    vessels: {
      desktop: { ferry: [69.3, -359.1, 1.26], junk: [59.5, -400.6, 0.46], via: { ferry: [[91.5, -381.5, 1.125]] }, drift: { ferry: [0, 0] } },
      // Mobile: 34 m from the camera (was 53 m), so the ferry fills about a
      // fifth of the frame's height as in the storyboard, its stern off the
      // left edge (user choice, 2026-10-03).
      // The junk (hidden here) waits right of the phone frame, so it comes
      // in already shown rather than fading in on open water (transition
      // review, 2026-10-03).
      mobile: { ferry: [-29, -252.3, 1], junk: [160, -430, 0.5], via: { ferry: [[8, -318, 1]] }, drift: { ferry: [0, 0] } },
    },
    probes: {
      desktop: {
        ferry: { left: 0, right: 60, top: 24, bottom: 78 },
        ifc: { left: 82, right: 87, top: 12 },
        wheel: { left: 74, right: 78 },
        horizon: 62,
      },
      // Deviation: the mobile PNG draws IFC at about half the size the shared
      // world allows from mid-harbour, so IFC is wider here (review note).
      mobile: {
        ferry: { left: 0, right: 66, top: 52, bottom: 72 },
        ifc: { left: 83, right: 94, top: 46 },
        wheel: { left: 76, right: 82 },
        horizon: 66,
      },
    },
  },
  {
    id: '04',
    slug: 'red-sails',
    title: 'Red Sails',
    storyboard: {
      desktop: `${SB}/frame-04-red-sails-rough.png`,
      mobile: `${SB}/frame-04-red-sails-mobile-rough.png`,
    },
    // The junk fills more of the frame (user choice, 2026-10-03): a longer
    // lens, desktop about 1.2 times larger, phones with the main sail just
    // under the copy. The eye stays at 3 m: lower, the move from 03 dips
    // under the 1.5 m clearance.
    // via: the move to 05 swings about 80 m right of the junk instead of
    // running through it (transition review, 2026-10-03).
    camera: {
      desktop: { position: [153.4, 3, -419.8], target: [-21.8, 76.8, -773.4], fov: 66, via: [[233.4, 8, -439.8]] },
      mobile: { position: [153.4, 3, -386.1], target: [212.7, 56.6, -773.9], fov: 60, via: [[233.4, 8, -486.1]] },
    },
    // Statement header and photo cards (narrative spine scene 04, user
    // requests, 2026-10-04): the label and the two cards top-left in the
    // sky; the title and intro along the water at the foot (styles.css).
    // Desktop: the cards and quote fill the left column down to just above
    // the statement's hairline (user request, 2026-10-04).
    copy: {
      desktop: { left: 5, top: 11, right: 34, bottom: 76 },
      mobile: { left: 8, top: 9, right: 92, bottom: 37 },
    },
    // Time for the cards to hang in after the statement.
    dwell: 60,
    // The wheel is gated here: framing alone leaves it peeking past the junk's
    // stern, and it is small and distant while it fades.
    // city: the skyline behind the sails stays at 40%, as in 03, so the
    // sails lead and the full city waits for 05 (user choice, 2026-10-03).
    // petals 0.3, as in 03 (atmospheric depth Priority F, user choice, 2026-10-04).
    // Phones: moon 0.6, as it sits right behind the copy's last line
    // (Priority 3 balance, user choice, 2026-10-04).
    visibility: {
      desktop: { ferry: 1, junk: 1, ifc: 1, wheel: 0, deck: 1, railing: 0, palms: 0, bauhinia: 0, bush: 0, bursts: 0, petals: 0.3, city: 0.4, mist: 1, seaMist: 0, haze: 0.7, searchlights: 0 },
      mobile: { ferry: 1, junk: 1, ifc: 1, wheel: 0, deck: 1, railing: 0, palms: 0, bauhinia: 0, bush: 0, bursts: 0, petals: 0.3, city: 0.4, mist: 1, seaMist: 0, haze: 0.7, searchlights: 0, moon: 0.6 },
    },
    fogDensity: 0.00063,
    vessels: {
      desktop: { ferry: [106, -397, 1.05], junk: [149.5, -444.6, 0.42] },
      mobile: { ferry: [26, -345, 1], junk: [162.9, -430.5, 0.85] },
    },
    probes: {
      desktop: {
        junk: { left: 35, right: 95, top: 6, bottom: 71 },
        ifc: { left: 96 },
        ferry: { offscreen: true },
        horizon: 63,
      },
      mobile: {
        junk: { left: 11, right: 85, top: 28, bottom: 68 },
        // IFC is a right-edge cue cropped by the frame (the PNG's thin far IFC
        // needs a camera ~2 km out in the shared world).
        ifc: { left: 91 },
        ferry: { offscreen: true },
        horizon: 66,
      },
    },
  },
  {
    id: '05',
    slug: 'city-of-light',
    title: 'City of Light',
    storyboard: {
      desktop: `${SB}/frame-05-city-of-light-rough.png`,
      mobile: `${SB}/frame-05-city-of-light-mobile-rough.png`,
    },
    // Close to the wheel (about 140 m, IFC about 270 m) so perspective makes
    // the wheel IFC's co-star at true scale (user choice, 2026-10-03).
    camera: {
      desktop: { position: [383.3, 16, -917.1], target: [426.6, 255, -1244.9], fov: 82, parallax: 1.8 },
      mobile: { position: [264.4, 46.6, -900.2], target: [449.2, 184.8, -1226.9], fov: 80.2 },
    },
    copy: {
      desktop: { left: 5, top: 11, right: 50, bottom: 37 },
      mobile: { left: 6, top: 9, right: 62, bottom: 44 },
    },
    visibility: {
      // city: the towers around IFC at 60%, so IFC leads (user choice, 2026-10-02).
      // accents: LED crowns, strips and the four landmarks down to a quarter
      // of that; reflections: IFC's and the wheel's columns twice as long and
      // bright (user choices, 2026-10-03). bollard: the harbour-edge
      // bollard and chain (atmospheric depth Priority 2, user choice,
      // 2026-10-04; createBollard.js).
      desktop: { ferry: 0, junk: 0, ifc: 1, wheel: 1, deck: 1, railing: 0, palms: 0, bauhinia: 0, bush: 0, bursts: 0, petals: 0.6, city: 0.6, accents: 0.25, reflections: 2, mist: 0.4, seaMist: 0, searchlights: 1, bollard: 1 },
      mobile: { ferry: 0, junk: 0, ifc: 1, wheel: 1, deck: 1, railing: 0, palms: 0, bauhinia: 0, bush: 0, bursts: 0, petals: 0.6, city: 0.6, accents: 0.25, reflections: 2, mist: 0.4, seaMist: 0, searchlights: 0.7, bollard: 1 },
    },
    fogDensity: 0.00045,
    // The ferry and junk are hidden from here on. The ferry keeps behind the
    // cameras; the junk bears away left of the move from 04 and leaves the
    // frame before it fades (transition review, 2026-10-03).
    vessels: {
      desktop: { ferry: [120, -430, 1], junk: [80, -480, 0.24] },
      mobile: { ferry: [40, -370, 1], junk: [80, -480, 0.24] },
    },
    // The PNG draws the wheel about 3.5× its true size relative to IFC; the
    // wheel stays true scale and the near camera makes up most of it: about
    // 20% of the height on desktop (PNG 38–45%), 17% on phones (user choice
    // 22–25%; any closer and IFC's crown leaves the frame).
    probes: {
      desktop: {
        ifc: { left: 56, right: 67, top: 3, bottom: 91 },
        wheel: { left: 28, right: 42, top: 74, bottom: 95 },
      },
      mobile: {
        ifc: { left: 59, right: 90, top: 6, bottom: 80 },
        wheel: { left: 7, right: 44, top: 65, bottom: 84 },
      },
    },
  },
  {
    id: '06',
    slug: 'afterglow',
    title: 'Afterglow',
    storyboard: {
      desktop: `${SB}/frame-06-afterglow-departure-rough.png`,
      mobile: `${SB}/frame-06-afterglow-departure-mobile-rough.png`,
    },
    camera: {
      desktop: { position: [271.8, 32.7, -467.7], target: [299.2, 263.7, -793.2], fov: 54.7, parallax: 1.8 },
      mobile: { position: [447.2, 57.1, -365.3], target: [434.4, 277.9, -698.6], fov: 63 },
    },
    copy: {
      desktop: { left: 5, top: 12, right: 38, bottom: 62 },
      mobile: { left: 6, top: 9, right: 66, bottom: 35 },
    },
    visibility: {
      // city: the towers around IFC stay at 60%, as in 05 (user request, 2026-10-02);
      // accents stay at 05's quarter so IFC's crown leads (user choice, 2026-10-03).
      // moon 0.5, so the fireworks lead (Priority 3 balance, user choice, 2026-10-04).
      desktop: { ferry: 0, junk: 0, ifc: 1, wheel: 1, deck: 1, railing: 0, palms: 0, bauhinia: 0, bush: 0, bursts: 1, petals: 0, city: 0.6, accents: 0.25, mist: 0.15, seaMist: 0, searchlights: 0, moon: 0.5 },
      mobile: { ferry: 0, junk: 0, ifc: 1, wheel: 1, deck: 1, railing: 0, palms: 0, bauhinia: 0, bush: 0, bursts: 1, petals: 0, city: 0.6, accents: 0.25, mist: 0.15, seaMist: 0, searchlights: 0, moon: 0.5 },
    },
    fogDensity: 0.00036,
    vessels: {
      desktop: { ferry: [135, -450, 1], junk: [240, -530, 0.24] },
      mobile: { ferry: [50, -390, 1], junk: [240, -530, 0.24] },
    },
    // Firework bursts (createFireworks.js): x / y, the burst's centre in % of
    // the viewport; size, its spark spread in % of the viewport width;
    // strength, its opacity at full `bursts` level. rotate (degrees), mirror
    // and squash (height share) vary the one shared artwork so no two match;
    // at: when it bursts in the 8 s loop (FIREWORKS in atmosphere.js), its
    // rocket rising just before. Two quick pairs, never all at once; two to
    // four bursts live at any moment (user choice, 2026-10-02).
    // Eight on desktop, six on phones, about 35% bigger than the first four
    // (user request, 2026-10-02), all kept right of and below the copy and
    // above IFC's crown. Phones: two dominant bursts, three supporting, one
    // fading remnant (user choice, 2026-10-02: the remnant at about 35%).
    // Palette as in the storyboard (user choice, 2026-10-03): a warm-white
    // hero in each half of the loop, coral-pink support, one small cyan
    // accent; nothing in the dark left and left-centre kept for the copy.
    bursts: {
      desktop: [
        { x: 84, y: 25, size: 30, color: 'warm', strength: 1, rotate: 0, at: 0 },
        { x: 62, y: 28, size: 22, color: 'coral', strength: 0.9, rotate: 140, mirror: true, at: 1 },
        { x: 76, y: 48, size: 11, color: 'cyan', strength: 0.7, rotate: 250, squash: 0.9, at: 1.25 },
        { x: 92, y: 54, size: 13.5, color: 'coral', strength: 0.75, rotate: 60, mirror: true, squash: 0.92, at: 2.5 },
        { x: 56, y: 14, size: 18, color: 'coral', strength: 0.85, rotate: 200, squash: 0.94, at: 3.6 },
        { x: 72, y: 22, size: 26, color: 'warm', strength: 1, rotate: 110, mirror: true, at: 4.8 },
        { x: 92, y: 12, size: 18, color: 'coral', strength: 0.8, rotate: 315, squash: 0.9, at: 5.05 },
        { x: 60, y: 42, size: 12, color: 'coral', strength: 0.65, rotate: 30, mirror: true, squash: 0.95, at: 6.4 },
        // Left-centre support under the copy, smaller and fainter than the
        // right (user request, 2026-10-03: the left read as empty).
        { x: 22, y: 48, size: 13, color: 'coral', strength: 0.7, rotate: 170, squash: 0.93, at: 2.2 },
        { x: 36, y: 36, size: 10, color: 'warm', strength: 0.65, rotate: 290, mirror: true, at: 5.8 },
      ],
      // Phones: the two warm heroes sit right of the copy's edge (66%), smaller
      // (Priority 3 balance, user choice, 2026-10-04: they ran over its last words).
      mobile: [
        { x: 88, y: 27, size: 38, color: 'warm', strength: 1, rotate: 20, at: 0 },
        { x: 54, y: 42, size: 35, color: 'coral', strength: 1, rotate: 150, mirror: true, at: 1.4 },
        { x: 88, y: 44, size: 16, color: 'cyan', strength: 0.6, rotate: 260, squash: 0.9, at: 2.8 },
        { x: 90, y: 57, size: 24, color: 'coral', strength: 0.35, rotate: 75, mirror: true, squash: 0.92, at: 6 },
        { x: 62, y: 58, size: 24, color: 'coral', strength: 0.85, rotate: 200, squash: 0.94, at: 3.05 },
        { x: 84, y: 30, size: 34, color: 'warm', strength: 1, rotate: 110, mirror: true, at: 4.6 },
        { x: 26, y: 52, size: 22, color: 'coral', strength: 0.7, rotate: 170, squash: 0.93, at: 2 },
      ],
    },
    // Smoke left behind by the biggest bursts (createFireworks.js), drawn
    // behind every burst: burst, the index above; cell, the puff on the
    // smoke sheet; size, its width in % of the viewport width; dx / dy, its
    // centre's offset from the burst in % of the viewport; opacity at its
    // fullest. Three on desktop, two on phones, all clear of the copy
    // (ATMOSPHERE-EFFECTS-BRIEF.md 6.7; user request, 2026-10-02).
    smoke: {
      desktop: [
        { burst: 0, cell: 'coral', size: 30, dx: 3, dy: 11, opacity: 0.105 },
        { burst: 1, cell: 'violet', size: 22, dx: -3, dy: 10, opacity: 0.1 },
        { burst: 3, cell: 'lavender', size: 16, dx: -2, dy: 7, opacity: 0.09 },
        { burst: 8, cell: 'lavender', size: 16, dx: 2, dy: 7, opacity: 0.09 },
      ],
      mobile: [
        { burst: 0, cell: 'coral', size: 46, dx: -2, dy: 8, opacity: 0.105 },
        { burst: 4, cell: 'lavender', size: 34, dx: 2, dy: 8, opacity: 0.1 },
      ],
    },
    probes: {
      desktop: {
        ifc: { left: 61, right: 67, top: 66 },
        wheel: { offscreen: true },
        horizon: { min: 104 },
      },
      mobile: {
        ifc: { left: 62, right: 75, top: 67 },
        wheel: { offscreen: true },
        horizon: { min: 104 },
      },
    },
  },
];
