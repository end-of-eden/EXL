(function () {
  var storageKey = 'arch-color-theme';
  var root = document.documentElement;

  function savedTheme() {
    try {
      var value = localStorage.getItem(storageKey);
      return value === 'light' || value === 'dark' ? value : 'dark';
    } catch (_) {
      return 'dark';
    }
  }

  function applyTheme(theme) {
    root.dataset.theme = theme;
    root.style.colorScheme = theme;
    var button = document.getElementById('theme-toggle');
    if (!button) return;
    var isLight = theme === 'light';
    button.textContent = isLight ? '☾' : '☀';
    button.setAttribute('aria-label', isLight ? '다크 모드로 전환' : '라이트 모드로 전환');
    button.setAttribute('title', isLight ? 'Dark mode' : 'Light mode');
    button.setAttribute('aria-pressed', String(isLight));
  }

  applyTheme(savedTheme());

  var script = document.currentScript;
  var stylesheet = document.createElement('link');
  stylesheet.rel = 'stylesheet';
  stylesheet.href = new URL('theme.css', script.src).href;
  document.head.appendChild(stylesheet);

  document.addEventListener('DOMContentLoaded', function () {
    var button = document.createElement('button');
    button.type = 'button';
    button.id = 'theme-toggle';
    button.className = 'theme-toggle theme-toggle-fixed';
    document.body.appendChild(button);

    button.addEventListener('click', function () {
      var next = root.dataset.theme === 'light' ? 'dark' : 'light';
      try { localStorage.setItem(storageKey, next); } catch (_) {}
      applyTheme(next);
    });

    applyTheme(root.dataset.theme || 'dark');
  });
})();
