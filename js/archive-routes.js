(function () {
  var pages = {main:'main.html', agents:'agents.html', gallery:'gallery.html', log:'log.html', eden:'wiki.html?char=eden', lilith:'wiki.html?char=lilith'};
  var logWorlds = {
    arch: { title: '磨滅', label: 'ARCH', description: '도망칠 수 없는 겨울의 한가운데였다.', image: 'img/log-worlds/bullet.webp' },
    'parallel-i': { title: '交點', label: 'PARALLEL I', description: '네 앞에서만 더 아무 말도 못 하게 됐어.', image: 'img/log-worlds/apple.webp' },
    'parallel-ii': { title: '未完', label: 'PARALLEL II', description: '', image: 'img/log-worlds/thorn.webp', disabled: true }
  };
  function logWorld(value) { return value === 'parallel-i' ? value : 'arch'; }
  window.archiveRoutes = {
    logWorlds: logWorlds,
    logWorld: logWorld,
    read: function (address) {
      var url = new URL(address);
      var hash = url.hash.slice(1);
      if (pages[hash]) return pages[hash];
      var world = /^log\/world\/(arch|parallel-i)(?:\/([^/]+))?$/.exec(hash);
      if (world) {
        if (!world[2]) return 'log.html?world=' + world[1];
        var worldId;
        try { worldId = decodeURIComponent(world[2]); } catch (_) { return 'log.html'; }
        return 'Log/view.html?id=' + encodeURIComponent(worldId) + '&world=' + world[1];
      }
      var detail = /^log\/([^/]+)$/.exec(hash);
      if (detail) {
        var id;
        try { id = decodeURIComponent(detail[1]); } catch (_) { return 'log.html'; }
        return /^00[1-4]$/.test(id) ? 'Log/' + id + '.html' : 'Log/view.html?id=' + encodeURIComponent(id);
      }
      return url.searchParams.get('page') || (pages[url.searchParams.get('char')] || 'main.html');
    },
    hash: function (route) {
      var url = new URL(route, location.href);
      var file = url.pathname.split('/').pop();
      if (file === 'wiki.html') return '#' + (url.searchParams.get('char') === 'lilith' ? 'lilith' : 'eden');
      if (file === 'view.html') return (logWorld(url.searchParams.get('world')) === 'arch' ? '#log/' : '#log/world/parallel-i/') + encodeURIComponent(url.searchParams.get('id') || '005');
      if (/^00[1-4]\.html$/.test(file)) return '#log/' + file.slice(0,-5);
      if (file === 'log.html' && url.searchParams.has('world')) return '#log/world/' + logWorld(url.searchParams.get('world'));
      return file === 'main.html' ? '' : '#' + file.replace('.html','');
    }
  };
})();
