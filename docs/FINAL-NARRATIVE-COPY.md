# Final Narrative Copy

**Status:** Approved and implemented 2026-10-03 (proposed 2026-10-02). The
chapter, identity, navigation, footer, accessibility and metadata copy is live
in `index.html`. The loading, fallback and social image wording stays here for
their own later briefs.

This document contains the proposed final public-facing copy for **Victoria
Harbour: A Night Crossing**. It follows the approved chapter order, camera
journey, copy-safe regions, World Bible and typography brief.

---

## 1. Voice

The narrator is quiet, observant and close to the water. It notices specific
things such as stone, decks, sails, reflections and smoke without becoming a tour
guide.

Use:

- present tense;
- short concrete sentences;
- one visual idea followed by one movement or emotional idea;
- place names only when they orient the crossing;
- restrained sensory language.

Avoid:

- “breathtaking”, “iconic”, “world-class”, “vibrant” and similar tourism copy;
- generic neon/cyberpunk language;
- invented nostalgia or claims that the harbour is unchanged;
- describing the vessel with red sails as an ancient working junk;
- suggesting that fireworks occur every night;
- repeating what the image already makes obvious.
- all dash punctuation in visitor facing copy, including em dashes, en dashes
  and hyphenated descriptive constructions. Use a full stop, comma, colon or
  natural rephrasing instead.

The site speaks in English, with selected Traditional Chinese identity and
navigation labels. Full parallel Chinese paragraphs are not planned for this
version; adding them later requires a real language switch and separately
authored layouts, not squeezed duplicate copy.

---

## 2. Site identity

| Role | Final copy |
|---|---|
| Browser title | **Victoria Harbour: A Night Crossing** |
| Hidden H1 | **Victoria Harbour: A Night Crossing** |
| Header name | **Hong Kong** |
| Header tagline | **Pearl of the Orient** |
| Hero wordmark | **香港** |
| Vertical title | **東方明珠** |
| Opening instruction | **Scroll to cross** |
| Return action | **Return to the harbour** |

The `Pearl of the Orient` / `東方明珠` pairing is retained as an approved brand
device. It should not be repeated in chapter or footer prose.

---

## 3. Final chapter copy

These lines are short enough for the approved desktop and portrait regions.
Line breaks remain responsive; do not insert manual `<br>` elements unless a
specific screenshot review proves they are necessary.

### 01

**Kicker:** Victoria Harbour  
**Title:** Harbour at Dusk  
**Traditional Chinese label:** 維港  
**Body, 18 words:**

> Night gathers on the water. Across the harbour, windows kindle beneath the
> Peak, and the night crossing begins.

Purpose: open quietly, establish the opposite shore and invite movement without
repeating the on-screen instruction.

### 02

**Kicker:** Clock Tower  
**Title:** The Kowloon Edge  
**Traditional Chinese label:** 鐘樓  
**Body, 20 words:**

> The old railway clock still faces the harbour. It marks the shore where the
> city's railway journeys north once began.

Purpose: acknowledge the tower's railway history without stopping for a history
lesson. “Once began” refers to the former terminus, not the current ferry.

### 03

**Kicker:** Star Ferry  
**Title:** Across the Water  
**Traditional Chinese label:** 天星小輪  
**Body, 21 words:**

> Low over the waves, the Star Ferry carries its warmly lit decks from Kowloon
> toward Central, steady against the restless water.

Purpose: lower the viewpoint, name the direction of travel and make the ferry
feel lived-in rather than monumental.

### 04

**Kicker:** Junk with red sails  
**Title:** Red Sails  
**Traditional Chinese label:** 帆船  
**Body, 20 words:**

> A junk with red sails passes close enough to fill the night, its dark hull
> slipping through the reflected city.

Purpose: make this the most immediate encounter while avoiding a false claim
that the vessel is an untouched historic craft.

### 05

**Kicker:** Two IFC  
**Title:** City of Light  
**Traditional Chinese label:** 國金  
**Body, 20 words:**

> Two IFC rises above Central, its bright crown drawing the crossing toward a
> wall of glass, steel and harbour light.

Purpose: shift from horizontal crossing to vertical city scale. The Observation
Wheel remains visible in the composition, but the narrative does not elevate a
recent entertainment addition to the same level as the crossing's core
subjects.

### 06

**Kicker:** Fireworks (was "Departure"; user request, 2026-10-03)  
**Title:** Afterglow  
**Traditional Chinese label:** 煙花  
**Body, 19 words:**

> The skyline falls away. Fireworks open above the harbour, then soften into
> smoke, leaving the city to the dark.

Purpose: release the forward movement and end on disappearance rather than a
tourism-style climax. This describes the authored scene, not a nightly event.

---

## 4. Navigation copy

### Desktop navigation

The brand returns to the hero. The five visible chapter links remain:

| Destination | English | Hover/focus Traditional Chinese |
|---|---|---|
| 02 | Clock Tower | 鐘樓 |
| 03 | Star Ferry | 天星小輪 |
| 04 | Red Sails | 帆船 |
| 05 | City of Light | 國金 |
| 06 | Afterglow | 煙花 |

### Mobile menu

Use the complete six-title sequence:

1. Harbour at Dusk, 維港
2. The Kowloon Edge, 鐘樓
3. Across the Water, 天星小輪
4. Red Sails, 帆船
5. City of Light, 國金
6. Afterglow, 煙花

### Control labels

| Control | Visible copy | Accessible name |
|---|---|---|
| Closed menu button | Menu icon only | **Open chapter menu** |
| Open menu button | Close icon only | **Close chapter menu** |
| Chapter navigation | None | **Chapters** |
| Side pager | Labels on hover | Decorative duplicate; remain hidden from assistive technology |
| Opening counter | Scroll to cross | Decorative duplicate; remain hidden from assistive technology |
| Footer return | Return to the harbour | **Return to the beginning of the harbour crossing** |

Do not use “Explore”, “Discover” or “Learn more”; there is no secondary article
or destination behind these controls.

---

## 5. Footer copy

### Closing statement

> One night, six chapters, one crossing. The journey runs from the old railway
> clock at Tsim Sha Tsui to the lights of Central. The harbour, vessels and
> skyline are built and animated in code.

This replaces the current statement. It remains truthful after the atmosphere
images and local fonts are added: it does not claim that every texture is made
in code.

### Chapters column

- Harbour at Dusk
- The Kowloon Edge
- Across the Water
- Red Sails
- City of Light
- Afterglow

### Landmarks and vessels column

- Clock Tower, completed 1915
- Star Ferry, origins in 1880
- Chinese junk, before the 1950s
- Two IFC, completed 2003

Use commas between subjects and their details. The dates are orientation
details, not claims of unbroken physical or corporate continuity.

### Colophon column

- Created by Gavin Fung at HKAAA (added 2026-10-03, user choice: HKAAA is
  the author's studio; "HKAAA" links to https://hkaiautomation.com/)
- Original 3D scene and illustrated atmosphere
- Dukling photograph by Ank Kumar, CC BY-SA (shortened 2026-10-04, user
  request: the long Red Sails paragraph was too long; the public-domain
  junk needs no credit)

"Built with Three.js and WebGL" and "Designed for desktop and mobile"
were removed the same day (user request).

Do not retain “Every model and texture made in code”; the approved WebP
atmosphere and font files make that statement inaccurate.

### Bottom bar

| Position | Final copy |
|---|---|
| Left | © 2026 Gavin Fung (was "© 2026 Victoria Harbour: A Night Crossing"; user choice, 2026-10-03) |
| Centre | 維港夜色 |
| Right | Hong Kong (was "Three.js · WebGL · Hong Kong"; user request, 2026-10-04) |

---

## 6. Loading, fallback and error copy

The later loading-screen brief decides timing and layout. These are the final
words available to it.

| State | Copy |
|---|---|
| Normal loading label | **Preparing the harbour** |
| Real progress display | **Preparing the harbour · 42%** (example only; percentage must be real) |
| Ready transition | No message; reveal the scene |
| WebGL fallback, visible introduction | **A night crossing of Victoria Harbour** |
| WebGL fallback, supporting sentence | **The interactive harbour is unavailable here, but the complete journey continues below.** |
| Context-loss recovery | No alarming dialog; switch to the readable fallback story |
| JavaScript disabled | Existing semantic story; no additional warning required |

Never write “Loading experience…”, “Something went wrong” or a technical WebGL
error to the general visitor.

---

## 7. Metadata and sharing copy

### HTML metadata

**Title**  
Victoria Harbour: A Night Crossing

**Meta description, 131 characters**  
A cinematic journey across Victoria Harbour at night, from the Clock Tower and
Star Ferry to Central, Two IFC and fading fireworks.

### Social preview

**Open Graph title**  
Victoria Harbour: A Night Crossing

**Open Graph description**  
Cross Victoria Harbour through six cinematic chapters of water, vessels,
landmarks and light.

**Social image alt text**  
Victoria Harbour at night, with the Clock Tower, a Star Ferry, red sails and
the illuminated skyline of Central.

The image (2026-10-04, user request) is the hero frame, cropped to 1200×630:
`posters/harbour-social.jpg`. It includes those subjects and the in-scene
香港, so this alt text stands.

---

## 8. Accessibility and semantic copy

- Keep the WebGL canvas `aria-hidden="true"`; the narrative is carried by HTML.
- Each section is labelled by its visible chapter title.
- Preserve one hidden H1 and six H2 chapter titles.
- Decorative Chinese labels remain hidden from assistive technology while the
  equivalent English title is present.
- If a later language switch is added, Chinese narrative text becomes real
  content and must not be `aria-hidden`.
- Avoid announcing scroll progress continuously. Chapter changes may update
  document state without using an assertive live region.
- The fallback text uses the same six chapter bodies; do not write a reduced
  synopsis that removes part of the journey.
- Do not place credits, instructions or factual information only inside a
  canvas texture.

---

## 9. Copy-fit rules

Before implementation is approved:

1. Chapter body copy stays between 18 and 21 words as written.
2. Desktop body measure remains no wider than 36 characters; mobile no wider
   than 30 characters.
3. No chapter body exceeds four lines in either approved mobile viewport after
   the final fonts load.
4. Chapter titles use no forced line break by default.
5. Footer statement stays at two lines on the reference desktop where possible
   and no more than four on mobile.
6. Dates and colophon items do not wrap into isolated one-word lines.
7. Copy is tested with Cormorant Garamond, Inter, Noto Serif TC and Noto Sans TC,
   not only the current system-font placeholders.

When copy does not fit, first adjust the copy region or a natural line break.
Do not shrink body text below the typography brief's minimum.

---

## 10. Factual notes and sources

The final prose intentionally carries few dates. The footer facts are based on:

- [Hong Kong Antiquities and Monuments Office](https://www.amo.gov.hk/en/historic-buildings/monuments/kowloon/monuments_43/index.html):
  the former Kowloon Canton Railway Clock Tower was erected in 1915 as part of
  the Tsim Sha Tsui terminus.
- [The Star Ferry's official company history](https://www.starferry.com.hk/en/theCompany):
  its service traces its origins to Dorabjee Naorojee Mithaiwala's harbour
  ferry service in 1880; the present company became public in 1898. “Origins
  in 1880” is more precise than the current footer's “since 1888”.
- [Hong Kong Maritime Museum](https://www.hkmaritimemuseum.org/post/chi-junk-hk?lang=zh):
  traditional wooden sailing junks were dominant fishing vessels in Hong Kong
  before the 1950s. The footer uses a period rather than a specific origin year
  because the illustrated vessel is an original composite, not a named historic
  boat such as Dukling.
- [Council on Tall Buildings and Urban Habitat](https://www.skyscrapercenter.com/building/two-international-finance-centre/205):
  Two International Finance Centre was completed in 2003.

Do not expand these facts into plaques within the chapter overlays. The site is
an atmospheric crossing, not a historical reference guide.

---

## 11. Implementation handoff

When this copy is approved, Cursor should make one contained copy-only pass:

1. Replace the six placeholder body lines and remove every
   `data-copy="placeholder"` attribute.
2. Change chapter 04's kicker from `The Junk` to `Junk with red sails`.
3. Change chapter 05's kicker from `IFC` to `Two IFC`.
4. Rename the footer column to `Landmarks and vessels`, then replace its list and
   the footer statement and colophon.
5. Replace menu button accessible names and the footer return accessible name.
6. Update the page metadata.
7. Add no new animation, layout or asset in the same pass.
8. Capture all 12 chapter holds after the final fonts are present and run the
   copy-overflow and contrast checks.

The loading and social-image strings may be staged in this pass but should not
create new UI until their own briefs are approved.

---

## 12. Approval checklist

- [x] Overall voice feels specific to Victoria Harbour rather than generic
- [x] Chapter 01 opening line approved
- [x] Clock Tower railway reference approved
- [x] Star Ferry direction and wording approved
- [x] `Junk with red sails` terminology approved
- [x] `Two IFC` naming approved
- [x] Fireworks line approved as authored-scene language, not an event claim
- [x] Footer statement and factual dates approved
- [x] English narrative with selected Traditional Chinese labels approved
- [x] Loading and fallback wording approved for their later briefs (not built
  in this pass)

Approved 2026-10-03 and implemented in `index.html`; no chapter text remains
marked as placeholder copy.
