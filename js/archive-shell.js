(function () {
  var home = document.querySelector('.home-content');
  var slot = document.createElement('div');
  slot.className = 'archive-content-slot';
  home.before(slot);
  slot.appendChild(home);
  var currentFrame = null;
  var pendingFrame = null;
  var currentRoute = '';
  var base = new URL('../', document.currentScript.src);

  function routeFor(value) {
    var url;
    try { url = new URL(value, base); } catch (_) { return null; }
    if (url.origin !== base.origin || !url.pathname.startsWith(base.pathname)) return null;
    var path = url.pathname.slice(base.pathname.length);
    if (!/^(main|agents|wiki|gallery|log)\.html$/.test(path) && !/^Log\/(view|00[1-4])\.html$/.test(path)) return null;
    url.searchParams.delete('v');
    return { url: url, path: path, key: path + url.search + url.hash };
  }

  function selectRoute(route, historyMode) {
    currentRoute = route.key;
    var category = route.path.startsWith('Log/') ? 'log.html' : route.path;
    document.querySelectorAll('.explorer-tree a').forEach(function (link) {
      var item = routeFor(link.href);
      var active = item && item.path === category && (category !== 'wiki.html' ||
        item.url.searchParams.get('char') === (route.url.searchParams.get('char') || 'eden'));
      link.classList.toggle('active', active);
      if (active) link.setAttribute('aria-current', 'page');
      else link.removeAttribute('aria-current');
    });
    var label = category === 'wiki.html' ? 'AGENTS　›　' + (route.url.searchParams.get('char') || 'eden').toUpperCase() : category.replace('.html', '').toUpperCase();
    document.querySelector('.main-address').textContent = 'This PC　›　相互確證破壞　›　' + label;
    if (historyMode !== 'none') {
      var address = new URL(window.parent.location.href);
      address.searchParams.delete('char');
      address.searchParams.set('page', route.key);
      window.parent.history[historyMode === 'replace' ? 'replaceState' : 'pushState'](null, '', address.href);
    }
  }

  window.navigateArchive = function (value, historyMode) {
    var route = routeFor(value);
    if (!route) return false;
    if (pendingFrame) { pendingFrame.remove(); pendingFrame = null; }
    slot.removeAttribute('aria-busy');
    if (route.key === currentRoute) return true;
    if (route.path === 'main.html') {
      if (currentFrame) { currentFrame.remove(); currentFrame = null; }
      home.hidden = false;
      selectRoute(route, historyMode);
      return true;
    }
    var next = document.createElement('iframe');
    next.name = 'archive-content';
    next.title = 'Archive content';
    next.className = 'archive-content-frame is-loading';
    pendingFrame = next;
    slot.setAttribute('aria-busy', 'true');
    next.addEventListener('load', function () {
      if (next !== pendingFrame) return;
      if (currentFrame) currentFrame.remove();
      var video = home.querySelector('video');
      if (video) video.pause();
      home.hidden = true;
      currentFrame = next;
      pendingFrame = null;
      next.className = 'archive-content-frame is-ready';
      slot.removeAttribute('aria-busy');
      selectRoute(route, historyMode);
    });
    var contentUrl = new URL(route.url.href);
    if (route.path === 'agents.html' || route.path === 'wiki.html') contentUrl.searchParams.set('v', '20260909-profile-sides');
    if (route.path === 'gallery.html') contentUrl.searchParams.set('v', '20260909-r2-order');
    if (route.path.startsWith('Log/')) contentUrl.searchParams.set('v', '20260909-clear-log');
    next.src = contentUrl.href;
    slot.appendChild(next);
    return true;
  };

  document.addEventListener('click', function (event) {
    if (event.defaultPrevented || event.button !== 0 || event.ctrlKey || event.metaKey || event.shiftKey || event.altKey) return;
    var link = event.target.closest('a[href]');
    if (!link || link.target === '_blank' || link.hasAttribute('download') || link.getAttribute('href').startsWith('#')) return;
    if (window.navigateArchive(link.href)) event.preventDefault();
  });
  var initial = new URLSearchParams(location.search).get('page') || 'main.html';
  if (!window.navigateArchive(initial, 'replace')) window.navigateArchive('main.html', 'replace');
  window.parent.addEventListener('popstate', function () {
    var route = new URLSearchParams(window.parent.location.search).get('page') || 'main.html';
    window.navigateArchive(route, 'none');
  });
})();
