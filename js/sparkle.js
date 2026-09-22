(function () {
  ['copy', 'cut', 'paste', 'contextmenu'].forEach(function (eventName) {
    document.addEventListener(eventName, function (event) {
      if (eventName === 'contextmenu' && event.target.closest('.my-banner-list')) return;
      event.preventDefault();
    });
  });

  document.addEventListener('keydown', function (event) {
    if ((event.ctrlKey || event.metaKey) && ['c', 'v', 'x'].indexOf(event.key.toLowerCase()) !== -1) {
      event.preventDefault();
    }
  });

  // Bubble Cursor adapted from mf2fm web-design (c) 2010-13.
  // Original: http://www.mf2fm.com/rv
  if (window.__archiveBubbleInput) return;
  window.__archiveBubbleInput = true;
  var host = window;
  try { if (window.top.document) host = window.top; } catch (_) {}
  var reduced = host.matchMedia('(prefers-reduced-motion: reduce)');
  var coarse = host.matchMedia('(pointer: coarse)');

  function createBubbles() {
    var doc = host.document;
    var layer = doc.createElement('div');
    layer.className = 'cursor-bubbles';
    layer.setAttribute('aria-hidden', 'true');
    var style = doc.createElement('style');
    style.textContent = '.cursor-bubbles{position:fixed;inset:0;z-index:2147483646;pointer-events:none;overflow:hidden}.cursor-bubble{position:absolute;left:0;top:0;width:3px;height:3px;pointer-events:none;will-change:transform,opacity}.cursor-bubble i{position:absolute;display:block;pointer-events:none}.cursor-bubble i:nth-child(1){inset:1px 0;border-left:1px solid var(--bubble-light);border-right:1px solid var(--bubble-dark)}.cursor-bubble i:nth-child(2){inset:0 1px;border-top:1px solid var(--bubble-light);border-bottom:1px solid var(--bubble-dark)}.cursor-bubble i:nth-child(3){inset:1px;background:var(--bubble-fill);opacity:.45}';
    doc.head.appendChild(style);
    doc.body.appendChild(layer);
    var palettes = [['#b7e9ff','#66b8eb','#bceaff'],['#ffccdf','#ef91b4','#ffd1e3']];
    var particles = [], pointer = null, moved = false, held = false;
    var frame = 0, last = 0, lastSpawn = 0, serial = 0;
    function allowed() { return !reduced.matches && !coarse.matches && !doc.hidden; }
    function clear() {
      held = moved = false;
      pointer = null;
      particles.forEach(function(p) { p.el.remove(); });
      particles = [];
      if (frame) host.cancelAnimationFrame(frame);
      frame = last = 0;
    }
    function spawn(now) {
      if (!pointer || particles.length >= 12) return;
      var el = doc.createElement('span'), colors = palettes[serial++ % palettes.length];
      el.className = 'cursor-bubble';
      el.innerHTML = '<i></i><i></i><i></i>';
      ['--bubble-light','--bubble-dark','--bubble-fill'].forEach(function(key,i) { el.style.setProperty(key,colors[i]); });
      layer.appendChild(el);
      particles.push({el:el,x:pointer.x,y:pointer.y-3,size:3,drift:(serial%5-2)/5,born:now,odd:serial%2});
    }
    function tick(now) {
      frame = 0;
      if (!allowed()) { clear(); return; }
      if (!last || now-last >= 40) {
        last = now;
        if ((moved || held) && now-lastSpawn >= (held ? 280 : 180)) {
          spawn(now); lastSpawn = now; moved = false;
        }
        particles = particles.filter(function(p) {
          p.y -= p.size/2 + p.odd;
          p.x += p.drift;
          var age = now-p.born;
          if (p.y < -10 || p.x < -10 || p.x > host.innerWidth+10 || age > 1800) { p.el.remove(); return false; }
          p.size = Math.min(4,3+Math.floor(age/900));
          p.el.style.width = p.el.style.height = p.size+'px';
          p.el.style.transform = 'translate('+p.x+'px,'+p.y+'px)';
          p.el.style.opacity = String(Math.min(1,(1800-age)/600));
          return true;
        });
      }
      if (particles.length || moved || held) frame = host.requestAnimationFrame(tick);
      else last = 0;
    }
    function wake() { if (!frame && allowed()) frame = host.requestAnimationFrame(tick); }
    var api = {
      move:function(point) { if (!allowed()) return; if (!pointer || Math.abs(point.x-pointer.x)>1 || Math.abs(point.y-pointer.y)>1) moved=true; pointer=point; wake(); },
      down:function(point) { api.move(point); if (!allowed()) return; held=true; moved=true; wake(); },
      up:function() { held=false; },
      clear:clear
    };
    reduced.addEventListener('change',clear);
    coarse.addEventListener('change',clear);
    doc.addEventListener('visibilitychange',clear);
    host.addEventListener('blur',function(){held=false;});
    host.addEventListener('pagehide',clear);
    return api;
  }

  function install() {
    var bubbles = host.__archiveBubbles || (host.__archiveBubbles = createBubbles());
    function point(event) {
      var x=event.clientX,y=event.clientY,win=window;
      while(win!==host) {
        var frame=win.frameElement;
        if(!frame) break;
        var rect=frame.getBoundingClientRect();
        var sx=frame.offsetWidth?rect.width/frame.offsetWidth:1;
        var sy=frame.offsetHeight?rect.height/frame.offsetHeight:1;
        x=rect.left+(x+frame.clientLeft)*sx;
        y=rect.top+(y+frame.clientTop)*sy;
        win=win.parent;
      }
      return {x:x,y:y};
    }
    document.addEventListener('pointermove',function(e){if(e.pointerType==='mouse')bubbles.move(point(e));},{passive:true});
    document.addEventListener('pointerdown',function(e){if(e.pointerType==='mouse'&&e.button===0)bubbles.down(point(e));},{passive:true});
    ['pointerup','pointercancel','pointerleave'].forEach(function(name){document.addEventListener(name,bubbles.up,{passive:true});});
    window.addEventListener('pagehide',bubbles.up);
  }
  if (document.readyState==='loading') document.addEventListener('DOMContentLoaded',install,{once:true});
  else install();
})();
