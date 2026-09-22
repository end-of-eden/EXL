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
  var logContext = null;

  function showLogBreadcrumb(route) {
    var address = document.querySelector('.main-address');
    var isDetail = route.path.startsWith('Log/');
    var worldKey = archiveRoutes.logWorld(logContext && logContext.world || route.url.searchParams.get('world'));
    var world = archiveRoutes.logWorlds[worldKey];
    var hasWorld = isDetail || route.url.searchParams.has('world');
    address.textContent = '';
    function part(text, href) {
      if (address.childNodes.length) {
        var separator = document.createElement('span');
        separator.className = 'arch-icon'; separator.dataset.icon = 'chevron-right'; separator.setAttribute('aria-hidden', 'true');
        address.appendChild(separator);
      }
      var item = document.createElement(href ? 'a' : 'span');
      item.textContent = text;
      if (href) item.href = new URL(href, base).href;
      address.appendChild(item);
      return item;
    }
    part('This PC', 'main.html');
    part('相互確證破壞', 'main.html');
    var current = part('LOG', hasWorld ? 'log.html' : null);
    if (hasWorld) current = part(world.title, isDetail ? 'log.html?world=' + worldKey : null);
    if (isDetail) {
      current = part(logContext && logContext.title || '기록');
      current.className = 'archive-breadcrumb-title';
    }
    current.setAttribute('aria-current', 'page');
  }
  window.updateLogBreadcrumb = function (source, context) {
    if (!currentFrame || currentFrame.contentWindow !== source) return;
    logContext = context;
    var route = routeFor(currentRoute);
    if (route && (route.path === 'log.html' || route.path.startsWith('Log/'))) showLogBreadcrumb(route);
  };

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
    document.querySelectorAll('.explorer-tree a, .mobile-navigation a').forEach(function (link) {
      var item = routeFor(link.href);
      var menuCategory = category === 'wiki.html' && link.closest('.mobile-navigation') ? 'agents.html' : category;
      var active = item && item.path === menuCategory && (menuCategory !== 'wiki.html' ||
        item.url.searchParams.get('char') === (route.url.searchParams.get('char') || 'eden'));
      link.classList.toggle('active', active);
      if (active) link.setAttribute('aria-current', 'page');
      else link.removeAttribute('aria-current');
    });
    var label = category === 'wiki.html' ? 'AGENTS　›　' + (route.url.searchParams.get('char') || 'eden').toUpperCase() : category.replace('.html', '').toUpperCase();
    document.querySelector('.main-address').textContent = 'This PC　›　相互確證破壞　›　' + label;
    document.querySelector('.main-address').classList.toggle('is-log-breadcrumb', category === 'log.html');
    if (category === 'log.html') showLogBreadcrumb(route);
    if (historyMode !== 'none') {
      var address = new URL(base.href);
      address.hash = archiveRoutes.hash(route.key);
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
      logContext = null;
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
      logContext = next.contentWindow.archiveLogContext || null;
      pendingFrame = null;
      next.className = 'archive-content-frame is-ready';
      if (route.path === 'log.html' && typeof next.contentWindow.startLogEntrance === 'function') {
        next.style.animation = 'none';
        next.contentWindow.startLogEntrance();
      }
      if (route.path === 'wiki.html' && typeof next.contentWindow.startProfileEntrance === 'function') {
        next.style.animation = 'none';
        next.contentWindow.startProfileEntrance();
      }
      slot.removeAttribute('aria-busy');
      selectRoute(route, historyMode);
    });
    var contentUrl = new URL(route.url.href);
    if (route.path === 'agents.html' || route.path === 'wiki.html') contentUrl.searchParams.set('v', '20260922-profile-glass');
    if (route.path === 'gallery.html') contentUrl.searchParams.set('v', '20260922-silver');
    if (route.path === 'log.html' || route.path.startsWith('Log/')) contentUrl.searchParams.set('v', '20260923-ooc-minimal');
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
  function restoreRoute() {
    var route = archiveRoutes.read(window.parent.location.href);
    window.navigateArchive(route, 'none');
  }
  window.parent.addEventListener('popstate', restoreRoute);
  window.parent.addEventListener('hashchange', restoreRoute);
})();
