(function () {
  var theme = 'light';
  try {
    var saved = localStorage.getItem('arch-color-theme');
    if (saved === 'light' || saved === 'dark') theme = saved;
  } catch (_) {}
  document.documentElement.dataset.theme = theme;
  document.documentElement.style.colorScheme = theme;
})();
