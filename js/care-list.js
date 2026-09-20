(function () {
  'use strict';
  var win = document.getElementById('care-list-window');
  var frame = document.getElementById('archive-frame');
  var bar = win.querySelector('.banner-window__bar');
  var toggle = win.querySelector('[data-list-toggle]');
  var close = win.querySelector('[data-list-close]');
  var opener = null;
  var bound = new WeakSet();
  function clamp() {
    if (win.hidden) return;
    var rect = win.getBoundingClientRect();
    win.style.left = Math.max(8, Math.min(rect.left, innerWidth - rect.width - 8)) + 'px';
    win.style.top = Math.max(8, Math.min(rect.top, innerHeight - rect.height - 8)) + 'px';
  }
  function collapse(value) {
    win.classList.toggle('is-collapsed', value);
    toggle.setAttribute('aria-expanded', String(!value));
    clamp();
  }
  function hide() {
    win.hidden = true;
    if (opener && opener.isConnected) opener.focus();
  }
  function bind() {
    var doc;
    try { doc = frame.contentDocument; } catch (_) { return; }
    if (!doc || bound.has(doc)) return;
    bound.add(doc);
    doc.addEventListener('click', function (event) {
      var link = event.target.closest('a[href="#care-list"]');
      if (!link) return;
      event.preventDefault();
      opener = link;
      win.hidden = false;
      win.style.zIndex = '20001';
      collapse(false);
      close.focus();
    }, true);
  }
  win.querySelector('[data-list-collapse]').addEventListener('click', function () { collapse(true); });
  toggle.addEventListener('click', function () { collapse(!win.classList.contains('is-collapsed')); });
  close.addEventListener('click', hide);
  win.addEventListener('keydown', function (event) { if (event.key === 'Escape') hide(); });
  var drag = null;
  bar.addEventListener('pointerdown', function (event) {
    if (event.target.closest('button') || event.button !== 0) return;
    var rect = win.getBoundingClientRect();
    drag = { x: event.clientX - rect.left, y: event.clientY - rect.top };
    bar.setPointerCapture(event.pointerId);
    bar.classList.add('dragging');
  });
  bar.addEventListener('pointermove', function (event) {
    if (!drag) return;
    win.style.left = event.clientX - drag.x + 'px';
    win.style.top = event.clientY - drag.y + 'px';
    clamp();
  });
  function stop() { drag = null; bar.classList.remove('dragging'); }
  bar.addEventListener('pointerup', stop);
  bar.addEventListener('pointercancel', stop);
  bar.addEventListener('lostpointercapture', stop);
  window.addEventListener('resize', clamp);
  frame.addEventListener('load', bind);
  bind();
})();
