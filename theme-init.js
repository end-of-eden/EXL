(function () {
  var theme = 'dark';
  try {
    if (localStorage.getItem('arch-color-theme') === 'light') theme = 'light';
  } catch (_) {}
  document.documentElement.dataset.theme = theme;
  document.documentElement.style.colorScheme = theme;
})();
