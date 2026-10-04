// Memory prints (narrative spine, user request, 2026-10-04): an archival
// photograph baked into the site's print look (duotone, burnt edges, grain;
// docs/plan/narrative-spine.md), fetched once the first frame is up. The copy
// layer reveals it; it sits still (user request, 2026-10-04).

export function createMemoryPlates(sections) {
  const figures = sections.map((section) => section.querySelector('.chapter__memory')).filter(Boolean);
  let loaded = false;

  function load() {
    if (loaded) return;
    loaded = true;
    for (const figure of figures) {
      const image = figure.querySelector('img');
      image.addEventListener('load', () => figure.classList.add('is-loaded'), { once: true });
      image.addEventListener('error', () => figure.remove(), { once: true });
      image.src = `${import.meta.env.BASE_URL}${image.dataset.src}`;
    }
  }

  return { load };
}
