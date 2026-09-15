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
  function update(target) {
    var active = target.closest('.gdock-item');
    items.forEach(function (item) {
      item.style.setProperty('--f', !reduced.matches && item === active ? '1' : '0');
    });
  }
  nav.addEventListener('pointermove', function (event) {
    if (event.pointerType !== 'touch') update(event.target);
  });
  nav.addEventListener('pointerleave', reset);
  nav.addEventListener('focusin', function (event) { update(event.target); });
  nav.addEventListener('focusout', reset);
  reduced.addEventListener('change', reset);
})();
