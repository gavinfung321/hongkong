const params = new URLSearchParams(window.location.search);

if (params.has('fallback')) {
  document.documentElement.classList.add('is-fallback');
}
