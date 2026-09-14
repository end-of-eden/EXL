/* Measure stationary links, then magnify only their contents. */
(function () {
  var nav = document.querySelector('.explorer-sidebar');
  if (!nav) return;
  var items = Array.from(nav.querySelectorAll('a'));
  var reduced = matchMedia('(prefers-reduced-motion: reduce)');
  items.forEach(function (item) {
    var glyph = document.createElement('span');
    glyph.className = 'gdock-glyph';
    while (item.firstChild) glyph.appendChild(item.firstChild);
    item.appendChild(glyph);
    item.classList.add('gdock-item');
  });
  function reset() {
    items.forEach(function (item) { item.style.setProperty('--f', '0'); });
  }
  function update(y) {
    items.forEach(function (item) {
      var rect = item.getBoundingClientRect();
      var d = Math.min(3, Math.abs(y - rect.top - rect.height / 2) / Math.max(24, rect.height));
      item.style.setProperty('--d', d);
      item.style.setProperty('--f', reduced.matches ? 0 : (1 + Math.cos(Math.PI * d / 3)) / 2);
    });
  }
  nav.addEventListener('pointermove', function (event) {
    if (event.pointerType !== 'touch') update(event.clientY);
  });
  nav.addEventListener('pointerleave', reset);
  nav.addEventListener('focusin', function (event) {
    var item = event.target.closest('.gdock-item');
    if (!item) return;
    var rect = item.getBoundingClientRect();
    update(rect.top + rect.height / 2);
  });
  nav.addEventListener('focusout', reset);
  reduced.addEventListener('change', reset);
})();
