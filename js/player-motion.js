/* Reveal the queue while keeping artwork and controls fixed. */
(function () {
  var card = document.querySelector('.playlist-window');
  var panel = document.getElementById('player-queue');
  var button = document.getElementById('queue-toggle');
  var reduced = window.matchMedia('(prefers-reduced-motion: reduce)');
  var progress = 0, frame = 0;
  var mix = function (a, b, p) { return a + (b - a) * p; };
  var baseHeight = card.offsetHeight;
  var queueHeight = 0;
  function draw(p) {
    var late = Math.max(0, (p - .6) / .4);
    card.style.height = baseHeight + queueHeight * p + 'px';
    panel.style.opacity = String(late);
    panel.style.transform = 'translateY(' + (1 - late) * 8 + 'px)';
  }
  window.animatePlayerQueue = function (open) {
    cancelAnimationFrame(frame);
    if (progress === 0) {
      card.style.height = '';
      baseHeight = card.offsetHeight;
    }
    panel.hidden = false;
    queueHeight = panel.offsetHeight + parseFloat(getComputedStyle(panel).marginTop);
    button.setAttribute('aria-expanded', String(open));
    panel.inert = !open;
    var start = progress, target = open ? 1 : 0, began = performance.now();
    var duration = reduced.matches ? 0 : 480 * Math.max(.25, Math.abs(target - start));
    function tick(now) {
      var t = duration ? Math.min(1, (now - began) / duration) : 1;
      progress = mix(start, target, 1 - Math.pow(1 - t, 4));
      draw(progress);
      if (t < 1) frame = requestAnimationFrame(tick);
      else {
        panel.hidden = !open;
            card.style.height = '';
      }
    }
    frame = requestAnimationFrame(tick);
  };
  var svg = document.querySelector('#play svg');
  svg.innerHTML = '<path/><path/>';
  var paths = svg.querySelectorAll('path');
  var play = [[6.5,4,13.25,8,13.25,16,6.5,20], [13.25,8,20,12,20,12,13.25,16]];
  var pause = [[6,4,10,4,10,20,6,20], [14,4,18,4,18,20,14,20]];
  var mark = 0, iconFrame = 0;
  function drawIcon(p) {
    paths.forEach(function (path, i) {
      var a = play[i].map(function (v, j) { return mix(v, pause[i][j], p); });
      path.setAttribute('d', 'M' + a[0] + ' ' + a[1] + 'L' + a[2] + ' ' + a[3] + 'L' + a[4] + ' ' + a[5] + 'L' + a[6] + ' ' + a[7] + 'Z');
    });
  }
  window.animatePlayerIcon = function (playing) {
    cancelAnimationFrame(iconFrame);
    var start = mark, target = playing ? 1 : 0, began = performance.now();
    function tick(now) {
      var t = reduced.matches ? 1 : Math.min(1, (now - began) / 160);
      mark = mix(start, target, 1 - Math.pow(1 - t, 4));
      drawIcon(mark);
      if (t < 1) iconFrame = requestAnimationFrame(tick);
    }
    iconFrame = requestAnimationFrame(tick);
  };
  drawIcon(0);
})();
