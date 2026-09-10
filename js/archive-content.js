(function () {
  // Content documents keep their own scripts and CSS inside the persistent shell.
  if (window.name !== 'archive-content') {
    if (window.top === window.self) {
      var base = new URL('../', document.currentScript.src);
      var page = location.pathname.slice(base.pathname.length) + location.search + location.hash;
      location.replace(new URL('playlist-test.html?page=' + encodeURIComponent(page), base).href);
    }
    return;
  }
  document.documentElement.classList.add('archive-content-document');
  var script = document.currentScript;
  var css = document.createElement('link');
  css.rel = 'stylesheet';
  css.href = new URL('../css/archive-content.css', script.src).href;
  document.head.appendChild(css);
  try {
    var host = window.parent;
    function syncTheme() {
      var theme = host.document.documentElement.dataset.theme;
      document.documentElement.dataset.theme = theme;
      document.documentElement.style.colorScheme = theme;
    }
    syncTheme();
    var observer = new MutationObserver(syncTheme);
    observer.observe(host.document.documentElement, { attributes: true, attributeFilter: ['data-theme'] });
    window.addEventListener('pagehide', function () { observer.disconnect(); });
    document.addEventListener('click', function (event) {
      if (event.button !== 0 || event.ctrlKey || event.metaKey || event.shiftKey || event.altKey) return;
      var link = event.target.closest('a[href], [data-href]');
      if (link && link.hasAttribute('data-animated-navigation')) return;
      if (!link || link.target === '_blank' || link.hasAttribute('download')) return;
      var url = new URL(link.getAttribute('href') || link.dataset.href, location.href);
      if (host.navigateArchive && host.navigateArchive(url.href)) {
        event.preventDefault();
        event.stopImmediatePropagation();
      }
    }, true);
  } catch (_) { /* Standalone documents retain their normal navigation. */ }
})();
