# Victoria Harbour 3D Website — Handoff

## Purpose of this document

This file transfers the important decisions and research from the original projectless Codex chat into the dedicated local project. A new Codex task opened from this folder should read this file, `README.md`, and all files in `docs/` before proposing or implementing changes.

## Project objective

Create an original cinematic, scroll-controlled 3D website about Victoria Harbour in Hong Kong. The experience should feel like an illustrated editorial journey through one persistent nighttime harbour world—not a conventional collection of stacked webpage sections.

The user is a beginner working in Cursor and needs an incremental, understandable workflow. Avoid attempting the complete polished experience in one prompt or one implementation pass.

## Reference project

Primary technical and visual reference:

- Repository: https://github.com/MengTo/kage
- Live site: https://mengto.github.io/kage/
- Build brief: https://github.com/MengTo/kage/blob/main/PROMPT.md
- Related scroll-world guidance: https://github.com/MengTo/Skills/blob/main/agent-skills/web-design/build-threejs-scroll-worlds/SKILL.md

Important: the Kage repository states that no license is granted for reuse or redistribution of its original code or artwork. Study its architecture, but build an independent implementation. Do not copy its `index.html` or image assets into this project.

## What was learned from Kage

The inspected Kage repository is deliberately compact:

- One `index.html` contains its markup, CSS, procedural scene construction, scroll choreography, and most interaction logic.
- It uses a local Three.js r149 build.
- It has four opaque generated cinematic scene plates.
- It has ten RGBA WebP foreground cutouts.
- It embeds local font subsets.
- It uses no Blender, GLB, or GLTF models. Its temple, stairs, gate, terrain, lanterns, moon, trees, fog, rain, leaves, particles, textures, and post-processing are built at runtime.

Its central architecture is:

```text
One persistent Three.js world
        +
native scroll mapped to camera progress
        +
semantic HTML typography and chapters
        +
generated editorial still images
        +
fixed transparent foreground cutouts
        +
lighting, fog, particles, bloom, grain, and vignette
```

Kage uses six camera waypoints connected with smooth curves. Scroll position becomes continuous chapter progress. Camera position, look target, and field of view interpolate between waypoints. Mobile receives a different camera fit. Pointer movement adds restrained parallax.

Its quality and performance techniques include:

- one renderer and normally one scene;
- procedural canvas textures;
- instancing for falling leaves;
- lightweight shaders for rain, particles, haze, and cutout sway;
- bloom and cinematic color grading;
- adaptive render resolution;
- lower mobile quality;
- reduced-motion behavior;
- semantic HTML and WebGL fallback;
- foreground cutouts that remain opaque while active, then fade and blur during chapter handoff.

## Victoria Harbour creative direction

Working concept:

> A cinematic night crossing of Victoria Harbour that reveals Hong Kong through boats, architecture, light, and water.

Visual language:

- illustrated neo-vintage Hong Kong poster aesthetic;
- navy and aubergine shadows;
- coral-red sails;
- cyan edge lighting;
- warm cream typography;
- restrained halftone texture;
- slow, deliberate camera motion;
- atmospheric depth from fog and haze;
- recognizable silhouettes rather than photorealistic city reconstruction.

## Proposed chapter journey

1. **The Harbour — Arrival**  
   Establish the complete harbour panorama.

2. **The Kowloon Edge — Clock Tower**  
   Approach Tsim Sha Tsui, the Clock Tower, promenade, and Star Ferry pier.

3. **The Crossing — Star Ferry**  
   Move closer to the water while a ferry crosses the frame.

4. **Red Sails — The Junk**  
   Travel alongside a red-sailed Chinese junk as the principal hero object.

5. **City of Light — IFC and Afterglow**  
   Approach Hong Kong Island and IFC, activate searchlights and city lighting, then pull back into a final panorama.

The existing `docs/STORYBOARD.md` includes an additional numbered closing state so the camera journey can finish cleanly at the footer.

## Analysis of the supplied concept images

The user supplied:

- a wide illustrated Victoria Harbour hero;
- a zoom-sequence diagram showing panorama → Clock Tower → junk boat → IFC → panorama;
- a browser-style scrolling concept board;
- screenshots describing the Kage project.

The hero image provides a strong 16:9 composition with three depth bands:

- foreground: promenade, ferry, tram/rail elements;
- midground: junk boat and water;
- background: skyline, IFC, mountains, searchlights.

Treat these images as art-direction and storyboard references, not final production assets. They contain embedded typography, commercial signs, inconsistent generated lettering, and flattened depth. Final website text must remain real HTML. Key elements should be reconstructed as 3D models or separated into transparent depth layers.

## Recommended production method

Use a hybrid rather than modelling the entire city accurately.

### Live 3D hero assets

- Clock Tower
- Star Ferry
- red-sailed Chinese junk
- IFC as a recognizable simplified silhouette
- waterfront or pier
- water surface
- simplified skyline masses
- Hong Kong Island mountain silhouette

### Simplified background geometry

Use low-detail building blocks with controlled window and emissive patterns. At night, silhouette, scale, light, and fog matter more than small architectural detail.

### Transparent 2D foreground layers

- promenade railing
- pier structure
- palm branches
- mooring ropes
- ferry bow or deck fragment
- signs and decorative frames
- water spray
- clouds and haze

### Editorial scene plates

- full harbour panorama
- Clock Tower and promenade
- junk boat close-up
- IFC and Hong Kong Island close-up

Scene plates should have no embedded text, borders, or UI. Leave negative space for HTML copy.

## Recommended toolchain

- Cursor for coding assistance
- Node.js LTS
- Vite
- vanilla Three.js
- Blender for simplified landmark and vehicle models
- Figma for storyboards, typography, and camera composition
- Photoshop, Affinity Photo, or Photopea for transparent cutouts
- Squoosh or equivalent for WebP compression
- Git and GitHub for version control and deployment

Use GLB for web-ready 3D assets. Keep editable Blender masters outside the runtime asset path if they become large.

## Implementation principles

- Use one persistent Three.js scene.
- Keep headings, paragraphs, links, navigation, and controls in semantic HTML.
- Store chapter behavior in one configuration array rather than scattering scroll thresholds throughout the code.
- Give every chapter desktop and portrait-mobile camera values.
- Validate the camera journey using crude geometry before polishing assets.
- Load the first scene quickly and progressively load later chapters.
- Provide a static poster fallback when WebGL is unavailable.
- Respect `prefers-reduced-motion`.
- Test representative chapters at desktop and approximately 390 × 844.
- Add post-processing only after scroll, camera, layout, and basic assets work.

## Suggested source architecture

```text
src/
├─ main.js
├─ styles.css
├─ data/
│  └─ chapters.js
├─ scene/
│  ├─ createScene.js
│  ├─ createWater.js
│  ├─ createLighting.js
│  └─ loadModels.js
├─ scroll/
│  └─ scrollConductor.js
└─ ui/
   └─ chapters.js
```

Do not reproduce Kage's single-file structure. A modular structure will be easier for a beginner to understand and safer for Cursor to edit.

## Asset preparation sequence

1. Finish the world bible and audience definition.
2. Create one desktop and one mobile storyboard frame for every chapter.
3. Mark each visible element as 3D, procedural, transparent 2D, or editorial plate.
4. Collect legally usable visual references from several angles.
5. Build a grey-box Blender scene with skyline blocks, tower, ferry, junk, mountain silhouette, and water plane.
6. Export and test one GLB before creating detailed assets.
7. Approve the complete camera path using placeholder geometry.
8. Refine only the hero silhouettes.
9. Prepare clean, text-free scene plates.
10. Prepare and edge-test transparent WebP foreground layers.
11. Replace placeholders one asset at a time.
12. Add atmosphere, post-processing, responsive behavior, and final performance work.

## Current project status

The local project is located at:

```text
C:\Users\gavin\OneDrive\Desktop\Victoria Harbour 3D Website
```

Git has been initialized on branch `main`, but there are no commits yet.

Existing planning files:

- `README.md`
- `docs/WORLD-BIBLE.md`
- `docs/STORYBOARD.md`
- `docs/ASSET-LEDGER.md`

Existing empty asset/source folders are tracked with `.gitkeep` files.

No Vite application or Three.js implementation has been created yet. No model, image, or font assets have been copied into the project.

## First task for the new project chat

Read this file and the three documents in `docs/`. Inspect the current Git status. Then help the user complete pre-production before coding:

1. confirm the audience and tone;
2. refine the chapter names and story beats;
3. convert each chapter into desktop and mobile camera/composition requirements;
4. finalize the 3D/2D/procedural asset ledger;
5. identify the smallest grey-box prototype that can validate the experience.

Do not scaffold the complete website until the user approves the story and grey-box scope. When implementation begins, start with Vite, vanilla Three.js, semantic chapter sections, placeholder geometry, a configuration-driven scroll conductor, mobile camera overrides, reduced motion, and a poster fallback. Leave bloom, particles, custom cursors, cloth effects, and advanced polish for later milestones.

