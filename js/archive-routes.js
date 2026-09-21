(function () {
  var pages = {main:'main.html', agents:'agents.html', gallery:'gallery.html', log:'log.html', eden:'wiki.html?char=eden', lilith:'wiki.html?char=lilith'};
  window.archiveRoutes = {
    read: function (address) {
      var url = new URL(address);
      var hash = url.hash.slice(1);
      if (pages[hash]) return pages[hash];
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
      if (file === 'view.html') return '#log/' + encodeURIComponent(url.searchParams.get('id') || '005');
      if (/^00[1-4]\.html$/.test(file)) return '#log/' + file.slice(0,-5);
      return file === 'main.html' ? '' : '#' + file.replace('.html','');
    }
  };
})();
