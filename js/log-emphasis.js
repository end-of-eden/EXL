(function () {
  function decorate(root, phrases, tag, className) {
    if (!Array.isArray(phrases) || !phrases.length) return;
    var alternatives = phrases.filter(function (value) { return typeof value === 'string' && value.length; })
      .sort(function (a, b) { return b.length - a.length; })
      .map(function (value) { return value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'); });
    if (!alternatives.length) return;
    var pattern = new RegExp(alternatives.join('|'), 'g');
    var walker = document.createTreeWalker(root, NodeFilter.SHOW_TEXT), nodes = [], node;
    while ((node = walker.nextNode())) {
      if (!node.parentElement.closest('code,pre,mark,strong')) nodes.push(node);
    }
    nodes.forEach(function (node) {
      var text = node.nodeValue, fragment = document.createDocumentFragment(), last = 0, match;
      pattern.lastIndex = 0;
      while ((match = pattern.exec(text))) {
        fragment.appendChild(document.createTextNode(text.slice(last, match.index)));
        var emphasis = document.createElement(tag);
        emphasis.className = className;
        emphasis.textContent = match[0];
        fragment.appendChild(emphasis);
        last = pattern.lastIndex;
      }
      if (last) {
        fragment.appendChild(document.createTextNode(text.slice(last)));
        node.replaceWith(fragment);
      }
    });
  }
  window.formatLogEmphasis = function (root, log) {
    decorate(root, log.bold, 'strong', 'log-bold');
    decorate(root, log.highlights, 'mark', 'log-keyword');
  };
})();
