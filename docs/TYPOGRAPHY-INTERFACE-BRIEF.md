# Typography and Interface Brief

**Status:** Direction approved 2026-10-02. Planning document only; implementation
waits until the current Cursor build step is complete.

This brief turns the existing page shell into the final bilingual editorial
system for the Victoria Harbour experience. It preserves the interface already
built in Milestone 2 and replaces its temporary system-font treatment with a
distinctive, consistent identity.

---

## 1. Intended feeling

The interface should feel like the title sequence of a contemporary Hong Kong
film: cinematic, elegant, quiet and precise. It is not a travel-advertising
site, a cyberpunk game HUD, or an imitation of antique Chinese calligraphy.

The scene remains the main event. Typography creates rhythm and orientation,
then gets out of the way.

Key qualities:

- editorial rather than corporate;
- contemporary rather than faux-historic;
- recognisably bilingual without making Chinese text ornamental;
- warm and human against the cool harbour;
- legible on an iPhone 11 before it is decorative.

---

## 2. Existing system to retain

The present interface structure is approved as the foundation:

- original red-sail logo and the `HONG KONG` brand lock-up;
- `Pearl of the Orient` tagline and vertical `東方明珠` title;
- six semantic chapter sections and their current copy-safe regions;
- desktop chapter navigation with English-to-Chinese rollover;
- full-screen mobile menu;
- desktop side pager and mobile chapter counter;
- `Scroll to cross` opening hint;
- restrained desktop cursor ring;
- `Return to the harbour` footer action;
- selectable HTML text, keyboard focus, reduced motion and poster fallback.

This is a typography refinement and interface-polish pass, not a redesign of
the information architecture.

---

## 3. Approved type families

| Role | Family | Weights | Use |
|---|---|---:|---|
| English display | **Cormorant Garamond** | 600, 700 | Chapter titles, editorial statements, tagline |
| English text/UI | **Inter** | 400, 500, 600 | Body copy, kickers, navigation, counters, buttons, diagnostics |
| Traditional Chinese display | **Noto Serif TC** | 600, 700 | `香港`, `東方明珠`, prominent Chinese titles |
| Traditional Chinese text/UI | **Noto Sans TC** | 400, 500, 600 | Menu labels, changing chapter label, supporting Chinese text |

All four families use the SIL Open Font License. Store their licence files with
the font assets. Do not obtain or serve them through an unpinned third-party
CDN in production.

### Why this pairing

Cormorant gives the English titles a cinematic editorial voice without looking
like generic luxury branding when used sparingly. Inter stays quiet and highly
legible for the functional layer. Noto Serif TC gives the large Chinese forms
the same contrast and gravity as the English display face, while Noto Sans TC
keeps small Chinese interface labels clear.

The serif families are for moments, not paragraphs. The sans-serif families
carry all reading and interaction.

### Fallback stacks

```css
--font-display-en: "Cormorant Garamond", Georgia, "Times New Roman", serif;
--font-text-en: "Inter", system-ui, -apple-system, "Segoe UI", Arial, sans-serif;
--font-display-zh: "Noto Serif TC", "Songti TC", "PMingLiU", serif;
--font-text-zh: "Noto Sans TC", "PingFang TC", "Microsoft JhengHei", sans-serif;
```

---

## 4. Font delivery and performance

The final fonts must be self-hosted in `public/fonts/` as WOFF2 files.

1. Use only the required upright styles. No italic font file is needed in the
   first pass.
2. Prefer one variable Roman file for Cormorant Garamond and one for Inter when
   their measured total is smaller than equivalent static files.
3. Subset the two Chinese families to the actual characters shipped by the
   site, plus punctuation. Preserve the original OFL files and font metadata.
4. Give Latin and Chinese subsets separate `unicode-range` declarations so the
   browser downloads only what appears on the page.
5. Target **300 KB or less of compressed font transfer on first view** and
   **450 KB or less for the whole experience**.
6. Use `font-display: swap` for body/UI fonts. Display fonts may use
   `font-display: fallback`, but the opening must never stay invisible while a
   font loads.
7. Preload only the files used above the fold: English display, English UI and
   the small Chinese display subset.
8. The canvas `香港` wordmark must wait for `document.fonts.load()` before its
   final texture is painted. If the font arrives after the first frame, repaint
   the texture once. Never leave Windows and iPhone drawing different glyphs.

The system-font version remains the no-font and failure fallback.

---

## 5. Typographic roles

### 5.1 Hero and brand

- The hidden semantic H1 remains `Victoria Harbour — A Night Crossing`.
- The visible 3D `香港` wordmark uses Noto Serif TC 700, not a synthetic bold.
- Keep the wordmark horizontal on both breakpoints and retain its approved
  world placement, gradient and scroll exit.
- `HONG KONG` in the header uses Inter 600, uppercase, with `0.16em` tracking.
- `Pearl of the Orient` uses Cormorant Garamond 600. It may be slightly softer
  than the brand name but must remain readable at phone size.

### 5.2 Chapter titles

- Cormorant Garamond 600.
- Sentence/title case exactly as currently written; never all caps.
- Desktop enhanced view: `clamp(2.5rem, 3.6vw, 3.75rem)`.
- Chapter 01 may reach `4.25rem` if its copy-region probe still passes.
- Mobile: `clamp(2.25rem, 10vw, 3rem)`; chapter 01 maximum `3.25rem`.
- Line height `0.95–1.0`; tracking between `-0.02em` and `0`.
- Prefer one line on desktop and at most two lines on mobile.
- Do not reduce below `2rem` merely to avoid an overlap. Move or shorten the
  copy instead.

### 5.3 Kickers and chapter indices

- Inter 600, uppercase English.
- `0.6875–0.75rem`, line height `1.2`, tracking `0.16em`.
- Kicker and index share a baseline and use the current muted lavender/cream
  hierarchy.
- Index uses tabular numerals.

### 5.4 Body copy

- Inter 400.
- Desktop `1rem`, line height `1.6`, maximum width `36ch`.
- Mobile `0.9375rem`, line height `1.58`, maximum width `30ch`.
- Each chapter should ultimately contain one short paragraph, ideally 18–38
  words. The current body copy remains placeholder until the copy milestone.
- No justified text, widows consisting of one short word, or text centred over
  a landmark.

### 5.5 Chinese display and labels

- `香港`: Noto Serif TC 700.
- `東方明珠`: Noto Serif TC 600 with the existing vertical writing mode;
  desktop `1.75rem`, mobile `1.125rem`.
- Chapter labels (`維港`, `鐘樓`, `天星小輪`, `帆船`, `國金`, `煙花`): Noto Sans
  TC 500; desktop `1rem`, mobile `0.8125rem`.
- Use `lang="zh-Hant"`. Do not apply Latin-style artificial letter spacing to
  Chinese body text. The existing deliberate spacing in the large vertical
  title can remain.
- Keep Chinese wording in Traditional Chinese; do not mix simplified glyph
  forms.

### 5.6 Navigation and buttons

- Inter 500 or 600 depending on size.
- Desktop nav: `0.6875rem`, uppercase English, `0.12em` tracking.
- Mobile menu English title: Cormorant Garamond 600, approximately `2rem`;
  index and Chinese label remain Inter/Noto Sans TC.
- Buttons and functional labels use the sans-serif families, never the display
  serif alone.
- The `Return to the harbour` pill retains sentence case and its current thin
  outline.

### 5.7 Footer

- Editorial statement: Cormorant Garamond 600, with a maximum of two lines on
  desktop and four on mobile.
- Column headings: Inter 600 uppercase, small and tracked.
- Links and colophon: Inter 400/500.
- `維港夜色`: Noto Serif TC 600.

---

## 6. Colour and contrast

Retain the current approved palette:

| Token | Value | Primary use |
|---|---|---|
| Ivory | `#FBF8F2` | Chapter titles and strongest text |
| Cream | `#F3E9D2` | Brand, Chinese display, warm interface text |
| Soft body | `#BDB8C8` | Body copy |
| Muted label | `#9B97AB` | Kicker, index, quiet metadata |
| Warm amber | `#F2B36B` | Current chapter and selected state |
| Sail coral | `#E4573D` | Sail mark and rare active accent |
| Focus cyan | `#6FD3E0` | Keyboard focus and accessibility feedback |

Rules:

- Normal copy must reach WCAG AA contrast against the darkest part directly
  behind it.
- Keep the existing restrained text shadow for scene readability. It should
  not read as a glow or stroke.
- Use local dark gradients only when a frame cannot meet contrast without
  them. Avoid visible rectangular text cards in the enhanced experience.
- Coral remains rare. It should not become the default hover colour for every
  control.

---

## 7. Interface behaviour

### Header

- Retain the transparent fixed header and faint protective gradient.
- Hide on downward scrolling and return on upward scrolling or keyboard focus.
- The current chapter uses the warm-amber underline.
- English-to-Chinese rollover remains a vertical roll, not a crossfade.
- Do not animate individual letters.

### Mobile menu

- Retain the full-screen dark panel and six-chapter list.
- Opening it freezes page scrolling, moves focus into the menu and exposes a
  clear close control.
- Escape closes it; focus returns to the menu button.
- The active chapter is identifiable by more than colour alone.

### Chapter copy

- Only one chapter copy block may be visually active at a time.
- Use the existing upward departure and upward arrival-from-below behaviour.
- Display titles and body copy move as one unit.
- Copy motion is disabled in reduced-motion mode; opacity change only.

### Counters and pager

- Keep `Scroll to cross` and `01–06` in the opening.
- Desktop side-pager dashes remain quiet until hover/focus.
- Phone display remains compact (`01 / 06`).
- Use tabular numerals so the counter does not shift horizontally.

### Vertical Chinese title

- Keep `東方明珠` synchronized with chapter 01's entrance and exit.
- The changing label remains on the right edge and follows the chapter state.
- Re-test right-edge safe areas on both iPhones after the font replacement;
  serif glyphs will occupy space differently from system sans glyphs.

### Cursor ring

- Keep the ring desktop/mouse only.
- Default diameter 40 px; enlarge over interactive targets as it does now.
- It must not replace the native indication of links or keyboard focus.
- No sparkle trail in this typography/interface pass.

### Footer

- Preserve the current order: return action, editorial statement, three link
  columns, bottom bar.
- The footer should feel like the closing title card, not another chapter.
- Scene overlays leave before footer content becomes dominant.

---

## 8. Responsive and accessibility rules

- Reference checks: 1440 × 900, 1156 × 766, 390 × 844 and 414 × 896.
- Respect safe-area insets on notched phones.
- No functional text below 11 CSS px; body copy stays at least 15 CSS px.
- Interactive targets are at least 44 × 44 CSS px on touch devices.
- Maintain a visible cyan keyboard focus ring with at least 2 px thickness.
- Menus, nav, footer links and chapter jumps remain usable without WebGL.
- The reading order in HTML must match chapters 01–06 regardless of fixed
  visual placement.
- With `prefers-reduced-motion: reduce`, remove rolling text, title movement,
  cursor ring and continuous transitions. Preserve immediate state changes.
- With fonts disabled or failed, the complete interface remains readable with
  the fallback stacks.

---

## 9. Loading behaviour

- The sky-first loading treatment remains minimal.
- Once final fonts exist, the loading label uses Inter 500 and may show one
  real progress value; it must not simulate progress.
- Do not delay first useful content just to wait for every font.
- Resolve the display fonts before revealing the final wordmark where possible;
  otherwise reveal the fallback and replace it only once, without repeated
  layout shifts.
- Aim for cumulative layout shift below `0.05` from all font swaps combined.

---

## 10. Implementation sequence for Cursor

This sequence is deliberately separate from the active build step.

1. Download the approved font files and licences from their official projects.
2. Produce WOFF2 files and the required Chinese character subsets; record file
   sizes and glyph lists.
3. Add `@font-face` declarations and the four family tokens without changing
   component sizes.
4. Switch body/UI, English display, Chinese display and Chinese UI roles one at
   a time. Take before/after screenshots at all four reference sizes.
5. Repaint the canvas `香港` texture after Noto Serif TC is ready.
6. Apply the approved type scale and correct any copy-region overflow by
   adjusting line breaks or region placement—not by shrinking body copy below
   the limits in this brief.
7. Refine the mobile menu and footer typography.
8. Run keyboard, reduced-motion, fallback and failed-font tests.
9. Run the composition probes for all 12 approved frames.
10. Measure font transfer, layout shift and iPhone 11/13 frame rate. Record the
    results before accepting the pass.

---

## 11. Acceptance checks

The typography/interface pass is complete when:

1. Windows and iPhone show the same intended English and Chinese type designs.
2. No chapter title, label or body block leaves its approved copy-safe region.
3. All 12 compositions still pass their landmark and copy-overlap checks.
4. Body copy remains at least 15 px on phones and meets WCAG AA contrast.
5. Font transfer stays within the section 4 budgets and causes less than 0.05
   cumulative layout shift.
6. The `香港` wordmark is drawn in Noto Serif TC 700 after the font is ready,
   with one repaint at most.
7. Navigation, menu, pager, counter and footer work with mouse, touch and
   keyboard.
8. The menu traps and restores focus correctly; active states do not rely on
   colour alone.
9. Reduced-motion mode contains no text rolling or sliding.
10. The page remains complete and readable with WebGL unavailable, JavaScript
    unavailable, or font requests blocked.
11. The iPhone 11 remains at the project's 30 fps target during a complete
    production-build scroll pass.

---

## 12. Sources and licensing record

- Cormorant Garamond: Google Fonts Cormorant project metadata, SIL Open Font
  License.
- Inter: official Inter project, SIL Open Font License 1.1.
- Noto Serif CJK / Noto Serif TC: official Noto CJK project, SIL Open Font
  License 1.1.
- Noto Sans CJK / Noto Sans TC: official Noto CJK project, SIL Open Font
  License 1.1.

Record exact versions, download URLs, checksums, subset commands and final file
sizes in `ASSET-LEDGER.md` when the files are added. Planning approval does not
authorise copying font files from an unrelated website or design reference.
