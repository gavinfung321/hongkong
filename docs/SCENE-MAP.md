# Scene map

Scenes `01`–`06` are the six harbour chapters. Read this file before a scene-specific edit, then open only the row for that scene.

Shared by every scene:

| Concern | Files |
|---|---|
| Words | `index.html`, the `#chapter-01` … `#chapter-06` section |
| Layout | That scene's `src/story/sceneNN/config.js`. Shared copy placement is in `src/styles.css` |
| Scroll | `src/data/chapters.js` — `SCROLL`, and the `chapters` list that assembles the six configs. It does not hold a chapter's camera, copy, dwell or visibility |
| Animation | `src/scroll/cameraRig.js`, `src/scroll/scrollConductor.js`, `src/ui/copyLayer.js`, `src/scene/gating.js` |

`chapters.js` re-exports `HERO` from scene 01. Scenes 01 and 02 keep their id, slug, title and storyboard inside their config. Scenes 03–06 add those four fields in `chapters.js` when the list is assembled.

Clouds, mist and haze: the chapter's `visibility` in its scene config, with sheets in `src/data/atmosphere.js` and `src/scene/createAtmosphere.js`. Open those only when the change is the air.

| Scene | Content | Layout | Animation | Visual effects |
|---|---|---|---|---|
| 01 Harbour at Dusk | `#chapter-01` in `index.html`; `HERO` in `src/story/scene01/config.js` | `src/story/scene01/config.js`; `#chapter-01` in `src/styles.css` | `src/scene/createWordmark.js` | `src/story/scene01/config.js`; `src/scene/createMoon.js`, `src/scene/createPetals.js`, `src/scene/bauhinia.js`, `src/scene/createForeground.js`, `src/scene/createSearchlights.js` |
| 02 The Kowloon Edge | `#chapter-02` in `index.html` | `src/story/scene02/config.js`; `#chapter-02`, `.chapter__memory`, `.chapter__facts` in `src/styles.css` | `src/story/scene02/config.js`; `src/scene/createStoryLayers.js`, `src/ui/memoryPlate.js`, `src/ui/pointerStir.js` | `src/story/scene02/config.js`; `src/scene/createStoryLayers.js`; afterglow in `src/scene/createScene.js`; `src/scene/createKowloonEdge.js`, `src/scene/people.js` |
| 03 Across the Water | `#chapter-03` in `index.html` | `src/story/scene03/config.js`; `.chapter__board`, `.chapter__route`, `.chapter__ticket` in `src/styles.css` | `src/story/scene03/config.js`; `src/ui/copyLayer.js`, `src/ui/departureBoard.js`, `src/ui/ticketCard.js`; ferry route in `src/scene/vesselRoutes.js` | `src/story/scene03/config.js`; `src/scene/createBuoy.js`, `src/scene/createLensBokeh.js`, `src/scene/createVessels.js`, `src/scene/wakes.js` |
| 04 Red Sails | `#chapter-04` in `index.html` | `src/story/scene04/config.js`; `.chapter__statement`, `.chapter__photos` in `src/styles.css` | `src/story/scene04/config.js`; `src/ui/copyLayer.js`, `src/ui/paperCard.js` | `src/story/scene04/config.js`; junk in `src/scene/createVessels.js` and `src/scene/surfaces.js`; `src/scene/createLensBokeh.js`, `src/scene/wakes.js` |
| 05 City of Light | `#chapter-05` in `index.html` | `src/story/scene05/config.js`; `.chapter__title--sweep`, `.chapter__lights` in `src/styles.css`; `BRANCH` in `src/scene/createCornerBranch.js`; `CLOUD_BAND` in `src/data/atmosphere.js` | `src/story/scene05/config.js`; `src/ui/copyLayer.js`, `src/ui/cityLights.js`, `src/ui/cityTouch.js`, wheel hover/tap in `src/scene/createIsland.js`, Scene 05 touch gate in `src/main.js`, `src/scene/createHarbourBoat.js`, `src/scene/createCornerBranch.js` | `src/story/scene05/config.js`; `src/scene/createSearchlights.js`, `src/scene/createLensBokeh.js`, light wave and wheel in `src/scene/createIsland.js`, cloud band in `src/scene/createAtmosphere.js`, `src/scene/createHarbourBoat.js`, `src/scene/createCornerBranch.js` |
| 06 Afterglow | `#chapter-06` in `index.html` | `src/story/scene06/config.js`; `.chapter__afterimage` in `src/styles.css`; `FIREWORKS` in `src/data/atmosphere.js` | `src/story/scene06/config.js`; `src/ui/copyLayer.js`; `src/scene/createFireworks.js` | `src/scene/createFireworks.js` |
