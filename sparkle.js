(function () {
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
  if (window.matchMedia('(pointer: coarse)').matches) return;

  var HEART_COLORS = ['#ffb6c1', '#ffd1dc', '#87ceeb', '#b0e0e6'];
  var SPAWN_INTERVAL_MS = 90;
  var HEART_LIFETIME_MS = 900;
  var HEART_SVG = '<svg viewBox="0 0 33 29" xmlns="http://www.w3.org/2000/svg" aria-hidden="true"><path d="M23.6 0c-3.4 0-6.3 2-7.6 4.9C14.7 2 11.8 0 8.4 0 3.8 0 0 3.8 0 8.4c0 9.3 15.3 17.6 15.9 17.9.2.1.4.2.6.2s.4-.1.6-.2c.6-.3 15.9-8.6 15.9-17.9C33 3.8 29.2 0 24.6 0z" fill="currentColor"/></svg>';
  var lastHeartSpawn = 0;

  var style = document.createElement('style');
  style.textContent =
    '.cursor-heart{' +
      'position:fixed;pointer-events:none;width:17px;height:15px;' +
      'z-index:9999;left:0;top:0;transform:translate(-50%,-50%);' +
      'animation:cursor-heart-float 900ms ease-out forwards;' +
      'will-change:transform,opacity' +
    '}' +
    '.cursor-heart svg{width:100%;height:100%;display:block}' +
    '@keyframes cursor-heart-float{' +
      '0%{transform:translate(-50%,-50%) scale(.6);opacity:.9}' +
      '100%{transform:translate(-50%,-160%) scale(1.05);opacity:0}' +
    '}';
  document.head.appendChild(style);

  document.addEventListener('mousemove', function (event) {
    var now = Date.now();
    if (now - lastHeartSpawn < SPAWN_INTERVAL_MS) return;
    lastHeartSpawn = now;

    var heart = document.createElement('span');
    heart.className = 'cursor-heart';
    heart.innerHTML = HEART_SVG;
    heart.style.left = event.clientX + (Math.random() * 10 - 5) + 'px';
    heart.style.top = event.clientY + (Math.random() * 10 - 5) + 'px';
    heart.style.color = HEART_COLORS[Math.floor(Math.random() * HEART_COLORS.length)];
    document.body.appendChild(heart);

    window.setTimeout(function () {
      heart.remove();
    }, HEART_LIFETIME_MS);
  });
})();
