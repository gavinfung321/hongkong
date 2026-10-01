# Grey-box performance (brief section 15)

All numbers come from a production build (`npm run build`, then
`npm run preview`) with the `?fps` overlay, after a slow, steady scroll from
the top of the page to the footer.

## Laptop — measured 2026-10-01

| | |
|---|---|
| Machine | AMD Ryzen AI 7 350, Radeon 860M (integrated), Windows 11 |
| Browser | Cursor's built-in browser (Chromium). Microsoft Edge 154 is installed. |
| Viewport | 1185 × 766 at device pixel ratio 1 (the built-in browser panel). Re-check at 1440 × 900 in Edge or Chrome. |

| Metric | Target | Result |
|---|---|---|
| Average fps, full scroll pass (30 s) | ≥ 50 | **60** (display refresh cap) |
| 1% low fps | ≥ 40 | **59** |
| Worst 1 s average | — | 60 |
| Draw calls, any frame | ≤ 80 | **55** peak (chapter 01–02 area) |
| Triangles, any frame | ≤ 100k | **7.6k** peak |
| Generated textures | ≤ 4, each ≤ 512 px | **1** generated (water normal map, 256 px); `renderer.info` counts 2 |
| Network requests after HTML | CSS + JS only | **1 CSS + 1 JS** |
| JS bundle (gzip) | ≤ 200 KB | **156 KB** |
| First WebGL frame after DOMContentLoaded | ≤ 1.0 s | **50 ms** |
| Long tasks while scrolling | none > 50 ms | **none** |
| Adaptive resolution changes | logged | none needed |

## iPhones — to be measured by you

Both phones use the mobile layout. Pixel ratio is capped at 1.5, and drops by
0.25 (to a floor of 1.0) if the 2 s average falls below 28 fps.

**How to test (Windows laptop and iPhone on the same Wi-Fi):**

1. In the project folder run `npm run build`, then `npm run preview -- --host`.
2. The terminal prints a `Network:` address such as
   `http://192.168.1.23:4173/`. If Windows asks about the firewall, allow
   Node.js on private networks.
3. On the iPhone, open that address in Safari with `?fps` on the end, for
   example `http://192.168.1.23:4173/?fps`.
4. At the top of the page, tap **reset** on the overlay (bottom-right). Then
   scroll slowly through all six chapters to the footer, which takes about
   30 seconds.
5. Note the overlay numbers below. Repeat once with the phone in Low Power Mode
   if you want a worst case.

### iPhone 11

| | |
|---|---|
| iOS version | |
| Safari | (same as iOS) |

| Metric | Target | Result |
|---|---|---|
| Average fps | ≥ 30 | |
| 1% low fps | ≥ 24 | |
| Worst 1 s | — | |
| dpr at the end | — | |
| Toolbar show/hide causes no framing jump (check 18) | yes | |

### iPhone 13

| | |
|---|---|
| iOS version | |
| Safari | (same as iOS) |

| Metric | Target | Result |
|---|---|---|
| Average fps | ≥ 30 | |
| 1% low fps | ≥ 24 | |
| Worst 1 s | — | |
| dpr at the end | — | |
| Toolbar show/hide causes no framing jump (check 18) | yes | |
