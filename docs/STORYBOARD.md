# Storyboard

Create one desktop frame at 1440 × 900 and one mobile frame at 390 × 844 for every chapter.

## Current storyboard progress

| Frame | Desktop | Desktop approval | Mobile | Mobile approval | Files |
|---|---|---|---|---|---|
| 01 Harbour at Dusk — Arrival | Complete | Approved | Complete | Approved | `storyboards/frame-01-harbour-at-dusk-rough.png`; `storyboards/frame-01-harbour-at-dusk-mobile-rough.png` |
| 02 The Kowloon Edge — Clock Tower | Complete | Approved | Complete | Approved | `storyboards/frame-02-kowloon-edge-rough.png`; `storyboards/frame-02-kowloon-edge-mobile-rough.png` |
| 03 Across the Water — Star Ferry | Complete | Approved | Complete | Approved | `storyboards/frame-03-across-the-water-rough.png`; `storyboards/frame-03-across-the-water-mobile-rough.png` |
| 04 Red Sails — The Junk | Complete | Approved | Complete | Approved | `storyboards/frame-04-red-sails-rough.png`; `storyboards/frame-04-red-sails-mobile-rough.png` |
| 05 City of Light — IFC | Complete | Approved | Complete | Approved | `storyboards/frame-05-city-of-light-rough.png`; `storyboards/frame-05-city-of-light-mobile-rough.png` |
| 06 Afterglow — Departure | Complete | Approved | Complete | Approved | `storyboards/frame-06-afterglow-departure-rough.png`; `storyboards/frame-06-afterglow-departure-mobile-rough.png` |

The camera path tells one compressed but geographically coherent journey from
the Kowloon waterfront, across the water, toward Hong Kong Island, and finally
upward into a firework-lit afterglow. Exact coordinates will be authored only
after the grey-box world scale is established.

| Chapter | Story beat | Desktop camera and composition | Mobile camera and composition | Foreground and motion | HTML copy zone |
|---|---|---|---|---|---|
| 01 **Harbour at Dusk — Arrival** | Orient the viewer and invite the crossing. The harbour itself is the protagonist. | Wide establishing view from the Kowloon side. Horizon near the upper third; Clock Tower low-left, junk near centre, IFC right of centre. Very slow forward dolly. | Narrower landmark triangle: tower at lower-left edge, junk below centre, IFC high-right. Raise horizon slightly and reduce lateral parallax. | Low promenade silhouette; subtle water movement and one restrained searchlight sweep. | Upper-left on desktop; upper-centre on mobile, above the skyline. |
| 02 **The Kowloon Edge — Clock Tower** | Move from panorama to a human-scale departure point and establish heritage. | Advance and drift left. Clock Tower fills the left third; the harbour opens to the right. Preserve visible water beyond the tower so the next move feels motivated. | Centre the Clock Tower in a modest low-angle portrait. Keep its crown visible, use the pier and palms as framing, and reduce the harbour to a narrow lower strip. Hold an open right-side lane for the ferry reveal. | Railing and palm framing; no visible vessel in the mobile composition, only a possible far-right wake/reflection cue. | Right-centre on desktop; upper-right/centre-right mobile sky and dark architectural negative space. |
| 03 **Across the Water — Star Ferry** | Leave the shore. The viewpoint drops close enough to feel spray and movement. | Lower toward water and track slightly right. Ferry occupies the lower-right third and points into open water. Kowloon recedes behind it. | Use a more frontal three-quarter ferry angle so the vessel reads in portrait. Keep the bow below the middle and open sky above. | Pier edge or ferry-bow fragment; ferry translation, modest wake, water reflections. | Upper-left on both; use a compact measure on mobile. |
| 04 **Red Sails — The Junk** | Reach the visual and emotional crest: an intimate side-by-side passage with the red-sailed junk. | Travel parallel to the boat. Hull spans the lower middle; the largest sail rises through the right third. IFC appears distant to seed the next beat. | Pull slightly farther back so the full main sail reads. Shift boat low-left and reserve upper-left or upper-centre sky for copy. | A close rope or sail edge used sparingly; slow hull rock and minimal sail response. | Left-centre on desktop; upper-left on mobile. Copy must not overlap the red sail. |
| 05 **City of Light — IFC** | The island draws near and the scale changes from vessel to vertical city. | Rise and push toward Hong Kong Island. IFC anchors the right third, with shorter skyline masses stepping left. | Use a lower camera and stronger upward view. IFC stays on the right edge but retains breathing room around its crown. | Haze rather than a hard foreground cutout; building lights, tiny traffic traces, and a restrained searchlight fan. | Left-centre on both; mobile copy sits over the darkest mountain/water band. |
| 06 **Afterglow — Departure** | Release the forward motion by looking upward from the city into the final fading fireworks. | Continue the Frame 5 approach, then tilt sharply upward. Sky fills roughly four-fifths of the frame; IFC's crown and a thin skyline band anchor the bottom while separated fireworks occupy the upper-right. | Use an even stronger upward crop: IFC's illuminated crown and one or two fading bursts are enough. Preserve a broad dark sky field rather than fitting the harbour panorama into portrait. | Fireworks decay into smoke and sparse falling embers; city movement drops away before the footer appears. | Upper-left to left-centre over the darkest uninterrupted sky, with the final action below the short closing line. |

**Precedence note.** This table was written before the frames were approved.
Where it differs from the approved images, the images and
`CURSOR-GREYBOX-BRIEF.md` take precedence. The main differences are:

- **Frame 01:** the desktop frame shows a full-height Clock Tower at the left
  edge, the Star Ferry centre-left, and the junk right of centre; mobile has no
  ferry.
- **Frame 02:** on mobile, the tower sits lower than in the image, so the copy
  can use a full-width top band (approved 2026-10-01).
- **Frame 03:** the ferry fills the lower-left half, side-on with the bow
  pointing right, with no Kowloon visible and IFC large in the right
  background, on both viewports.
- **Frame 05:** IFC is right of centre with the Observation Wheel as a large
  lower-left co-star, and copy sits upper-left on both viewports.
- **Frame 06:** the camera pulls back while tilting up, rather than
  continuing the approach (approved 2026-10-01).
- **Searchlights** are polish and are not part of the grey-box.

## Transition rules

- No cut may feel like teleportation; each outgoing frame must visually seed the
  next chapter's subject.
- Keep camera roll at zero and use restrained easing to avoid motion sickness.
- A chapter's primary subject reaches its clearest composition near the middle
  of that chapter, not exactly at the scroll boundary.
- Foreground layers fade before they cross the copy or obscure the next hero.
- Mobile is a re-authored portrait composition, not a cropped desktop shot.
- Reduced motion uses six stepped compositions with short crossfades and no
  continuous camera travel.

## Storyboard approval test

Before 3D implementation, each frame should be understandable in grayscale with
plain labels standing in for assets. A reviewer should be able to identify the
subject, copy region, direction of travel, and next visual target without
animation.

**Status:** All six desktop and portrait-mobile storyboard frames approved.
The grey-box implementation brief (`CURSOR-GREYBOX-BRIEF.md`) is approved. The
next deliverable is the grey-box scaffold, step 1 of that brief's build order.
The asset provenance check happens before any Phase B asset is created.
