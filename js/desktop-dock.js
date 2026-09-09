(function () {
  var day = document.getElementById('dday-window');
  var doc = document.getElementById('desktop-document');
  if (!day || !doc) return;
  [day, doc].forEach(function (win) {
    win.dataset.positionLocked = 'true';
    win.querySelector('[class$="__bar"]').style.cursor = 'default';
  });
  function place(win, left, top) {
    win.style.left = left + 'px';
    win.style.top = top + 'px';
    win.style.bottom = 'auto';
    win.style.right = 'auto';
  }
  function layout() {
    var bottomGap = window.innerHeight > 700 ? 100 : 52;
    var docTop = Math.max(8, window.innerHeight - bottomGap - doc.offsetHeight);
    var docLeft = Math.max(8, Math.min(74, window.innerWidth - doc.offsetWidth - 8));
    place(doc, docLeft, docTop);
    place(day, Math.max(8, docLeft - 64), Math.max(8, docTop - day.offsetHeight - 12));
  }
  var observer = new ResizeObserver(layout);
  observer.observe(day);
  observer.observe(doc);
  window.addEventListener('resize', layout);
  layout();
})();
