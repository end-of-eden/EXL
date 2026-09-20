(function () {
  var day = document.getElementById('dday-window');
  var doc = document.getElementById('desktop-document');
  if (!day) return;
  [doc].filter(Boolean).forEach(function (win) {
    win.dataset.positionLocked = 'true';
    win.querySelector('[class$="__bar"]').style.cursor = 'default';
  });
  day.dataset.positionLocked = 'false';
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
    // Preserve the original D-DAY dock even after NOTICE moved into the main page.
    if (doc) place(doc, docLeft, docTop);
    if (day.dataset.userPositioned === 'true') {
      var rect = day.getBoundingClientRect();
      place(day, Math.max(0, Math.min(rect.left, window.innerWidth - day.offsetWidth)), Math.max(0, Math.min(rect.top, window.innerHeight - day.offsetHeight)));
    } else {
      place(day, Math.max(8, docLeft - 64), Math.max(8, docTop - day.offsetHeight - 12));
    }
  }
  var observer = new ResizeObserver(layout);
  observer.observe(day);
  if (doc) observer.observe(doc);
  window.addEventListener('resize', layout);
  layout();
})();
