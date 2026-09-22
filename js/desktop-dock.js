(function () {
  var day = document.getElementById('dday-window');
  var doc = document.getElementById('desktop-document');
  if (!day) return;
  [doc, day].filter(Boolean).forEach(function (win) {
    win.dataset.positionLocked = 'true';
    win.querySelector('[class$="__bar"]').style.cursor = 'default';
  });
  var frame = document.getElementById('archive-frame');
  var mainWindow = null;
  function place(win, left, top) {
    win.style.left = left + 'px';
    win.style.top = top + 'px';
    win.style.bottom = 'auto';
    win.style.right = 'auto';
  }
  function layout() {
    var bottomGap = window.innerHeight > 700 ? 100 : 52;
    var docTop = Math.max(8, window.innerHeight - bottomGap - (doc ? doc.offsetHeight : 176));
    var docLeft = Math.max(8, Math.min(74, window.innerWidth - (doc ? doc.offsetWidth : 310) - 8));
    if (doc) place(doc, docLeft, docTop);
    // Match the chosen desktop position relative to the main glass window.
    var left = 37, top = window.innerHeight - day.offsetHeight - 123;
    if (mainWindow && mainWindow.isConnected) {
      var rect = mainWindow.getBoundingClientRect();
      var frameRect = frame.getBoundingClientRect();
      left = frameRect.left + rect.left - 96;
      top = frameRect.top + rect.bottom - day.offsetHeight - 40;
    }
    place(day, Math.max(8, Math.min(left, window.innerWidth - day.offsetWidth - 8)), Math.max(8, Math.min(top, window.innerHeight - day.offsetHeight - 8)));
  }
  var observer = new ResizeObserver(layout);
  observer.observe(day);
  if (doc) observer.observe(doc);
  function attachMainWindow() {
    if (mainWindow) observer.unobserve(mainWindow);
    try { mainWindow = frame.contentDocument.querySelector('.main-wrap'); } catch (_) { mainWindow = null; }
    if (mainWindow) observer.observe(mainWindow);
    layout();
  }
  if (frame) { frame.addEventListener('load', attachMainWindow); attachMainWindow(); }
  window.addEventListener('resize', layout);
  layout();
})();
