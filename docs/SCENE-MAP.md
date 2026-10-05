# Scene map

Scenes `01`–`06` are the six harbour chapters. Read this file before a scene-specific edit, then open only the row for that scene.

Shared by every scene:

| Concern | Files |
|---|---|
| Words | `index.html`, the `#chapter-01` … `#chapter-06` section |
| Layout | That chapter's object in `src/data/chapters.js` (camera, copy box, visibility, vessels, fog, dwell). Shared copy placement in `src/styles.css` |
| Animation | `src/scroll/cameraRig.js`, `src/scroll/scrollConductor.js`, `src/ui/copyLayer.js`, `src/scene/gating.js` |

Clouds, mist and haze: the chapter's `visibility` in `src/data/chapters.js`, with the sheets in `src/data/atmosphere.js` and `src/scene/createAtmosphere.js`. Open those only when the change is the air.

| Scene | Content | Layout | Animation | Visual effects |
|---|---|---|---|---|
| 01 Harbour at Dusk | `#chapter-01` in `index.html`; `HERO` in `src/story/scene01/config.js` | `src/story/scene01/config.js`; `#chapter-01` in `src/styles.css` | `src/scene/createWordmark.js` | `src/story/scene01/config.js`; `src/scene/createMoon.js`, `src/scene/createPetals.js`, `src/scene/bauhinia.js`, `src/scene/createForeground.js`, `src/scene/createSearchlights.js` |
| 02 The Kowloon Edge | `#chapter-02` in `index.html` | Chapter `02` in `src/data/chapters.js`; `#chapter-02`, `.chapter__memory`, `.chapter__facts` in `src/styles.css`; `SCENE_02_GHOST` in `src/story/scene02/config.js`; `DUST`, `STEAM` in `src/scene/createStoryLayers.js` | `src/scene/createStoryLayers.js`, `src/ui/memoryPlate.js`, `src/ui/pointerStir.js` | `src/scene/createStoryLayers.js`; afterglow in `src/scene/createScene.js`; `src/scene/createKowloonEdge.js`, `src/scene/people.js` |
| 03 Across the Water | `#chapter-03` in `index.html` | `src/story/scene03/config.js`; `.chapter__panels`, `.chapter__board`, `.chapter__ticket` in `src/styles.css` | `src/story/scene03/config.js`; `src/ui/copyLayer.js`, `src/ui/departureBoard.js`, `src/ui/ticketCard.js`; ferry route in `src/scene/vesselRoutes.js` | `src/story/scene03/config.js`; `src/scene/createBuoy.js`, `src/scene/createLensBokeh.js`, `src/scene/createVessels.js`, `src/scene/wakes.js` |
| 04 Red Sails | `#chapter-04` in `index.html` | Chapter `04` in `src/data/chapters.js`; `.chapter__statement`, `.chapter__photos` in `src/styles.css` | `src/ui/paperCard.js` | Junk in `src/scene/createVessels.js` and `src/scene/surfaces.js`; `src/scene/createLensBokeh.js`, `src/scene/wakes.js` |
| 05 City of Light | `#chapter-05` in `index.html` | Chapter `05` in `src/data/chapters.js`; `.chapter__title--sweep`, `.chapter__lights` in `src/styles.css`; `BRANCH` in `src/scene/createCornerBranch.js`; `CLOUD_BAND` in `src/data/atmosphere.js` | `src/ui/cityLights.js`, `src/ui/cityTouch.js`, `src/scene/createHarbourBoat.js`, `src/scene/createCornerBranch.js` | `src/scene/createSearchlights.js`, `src/scene/createLensBokeh.js`, light wave in `src/scene/createIsland.js`, cloud band in `src/scene/createAtmosphere.js`, `src/scene/createHarbourBoat.js`, `src/scene/createCornerBranch.js` |
| 06 Afterglow | `#chapter-06` in `index.html` | Chapter `06` in `src/data/chapters.js` (`bursts`, `smoke`); `FIREWORKS` in `src/data/atmosphere.js` | `src/scene/createFireworks.js` | `src/scene/createFireworks.js` |
