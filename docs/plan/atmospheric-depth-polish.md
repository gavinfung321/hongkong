# High-Impact Depth and Atmosphere Plan

**Status:** simplified 2026-10-04. Work on one visible improvement at a time.

## Goal

Make the harbour feel deeper, calmer and more mysterious through a few changes
that are obvious in the normal experience. Do not add effects merely because
they are technically possible.

The important visual hierarchy is:

1. one clear landmark or vessel;
2. a supporting middle layer;
3. a restrained foreground or atmospheric layer;
4. enough darkness for the lights and silhouettes to breathe.

## Working rules

- A change must be clearly noticeable at normal size within a few seconds.
- Make one visual change per pass. Keep it, revise it or remove it before
  starting another.
- Do not change approved cameras, copy positions or vessel routes as part of
  atmosphere work.
- Prefer editing existing lights, geometry and layers over adding new particle
  systems or full-screen effects.
- Preserve reduced-motion behaviour and deterministic animation.
- If the improvement is ambiguous, do not ship it.

## Minimal review

Do not create full chapter matrices, contact sheets or repeated recordings.

For each pass, use only:

- one desktop before image and one desktop after image of the most affected
  scene;
- one mobile after image only when the mobile composition is affected;
- one short transition check only when the change moves or fades;
- one production build and a quick browser-console check.

Additional captures or performance measurements are required only when a real
problem is found. Do not capture every chapter for a local change.

## Keep as the current baseline

- The approved vignette stays. Do not add grain, paper texture or halftone.
- Existing cloud masses, harbour mist and depth haze stay at their current
  settings. Do not add more haze layers.
- Existing wakes, water reflections, searchlights and fireworks stay unless a
  specific scene review identifies a clear problem.
- The Star Ferry must not regain forward drift in chapter 03.
- The large bow-spray artwork remains removed.

## Priority 1 — Restore lighting hierarchy

This is the next implementation task and the highest-value refinement.

### Kowloon, scenes 01 and 02

- Reduce railing lanterns from every post to every second post.
- Preserve the two close lanterns that frame scene 01.
- Keep the three tall promenade lamps.
- Reduce lantern halo strength only if the reduced count is still too bright.
- Keep the Clock Tower floodlight dominant.
- Do not globally darken the scene or remove wet-paving reflections.

### Central, scenes 03 and 05

- Break up the five identical bright ferry-pier halls with deterministic dark
  and dim window bays.
- Reduce pier-hall glow by about 25–30% while retaining a few bright clusters.
- Increase spacing and dark gaps in the waterfront lamp line.
- Keep IFC brightest, the wheel second and the piers supporting.
- Do not change global exposure, IFC, the wheel, searchlights or the chapter
  reflection multiplier in this pass.

### Success condition

The waterfronts have visible dark gaps. Lights form a deliberate rhythm rather
than continuous dotted lines, and the principal landmarks lead immediately.

## Priority 2 — Add one physical foreground cue to chapter 05

Only begin this after the lighting pass is approved.

- Test one dark harbour-edge object in a lower corner: preferably a bollard and
  short chain, or a cropped pier structure.
- It must be visibly attached to the bottom or side of the frame and move with
  stronger parallax than the skyline.
- Keep it away from the copy, IFC and observation wheel.
- Use one object only. Do not combine several foreground decorations.
- Omit or simplify it on mobile if it crowds the composition.

### Success condition

Chapter 05 feels like arrival at a real harbour edge instead of a distant city
view. The foreground supports the scene without becoming a second subject.

If the first prototype looks pasted on or the improvement is not obvious,
remove it and stop this task.

## Priority 3 — Final chapter balance

Only after priorities 1 and 2:

- Review the settled 01–06 sequence once at desktop size and once on mobile.
- Correct only obvious hierarchy problems: an over-bright supporting light, a
  foreground obstruction or an atmosphere layer hiding the subject.
- Prefer reducing or removing elements over adding new ones.
- Stop when every chapter has one clear subject and the transitions feel calm.

## Do not pursue

These ideas are removed from the active plan because their likely visual gain
is too small for their implementation and review cost:

- additional mist or haze bands;
- near-lens moisture or spray particles;
- chapter 04 rope or rigging overlays;
- harbour drizzle or rain;
- animated grain, halftone or flicker overlays;
- additional full-screen texture treatments;
- separate reflection-breathing systems;
- more searchlights, particles or decorative foreground cards.

The existing light-breathing experiment is not a priority. Do not spend more
time tuning it. If it is not clearly beneficial in a normal five-second view,
disable or remove it rather than expanding it.

## Short checklist

- [ ] Priority 1: simplify Kowloon and Central waterfront lighting
- [ ] Approve or remove the existing light-breathing experiment
- [ ] Priority 2: test one chapter 05 foreground object
- [ ] Priority 3: one desktop and one mobile sequence review
- [ ] Update the changelog with only the final kept decisions

## Immediate next action

Implement **Priority 1 only: Restore lighting hierarchy**. Review the small set
of affected frames, then stop for a visual decision before adding anything
else.
