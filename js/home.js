(function () {
  var NOTICE_BOLD = /(ARCH|FEARLESS|VESTAL)/;
  var NOTICE = 'OPEN · 비이입, CBC\nMAIN - ARCH / EDEN\nSUB - FEARLESS / DIVE, VESTAL / 린쉬한\n탐복 X 알림 OFF / 좁은 탐라에서 깊은 교류\n1T 1D 지향\n배려 리스트는 상호기재로 진행합니다';
  var NG = '앵챗 양지 끌올 비선호\n드림 지우기 / 허공 저격 / 성인물 공계 발언\n겹드 견제 / 모방 동의 없는 불펌\n이별은 블락 (재연결x)\n';
  var NG_LAST = '저에게서 어떤 영향도 받지 말아주세요';
  var TYPE_MS = 28;

  var CARE_NOTE = '소중한 인연이 있어 더이상 모시지 않습니다';
  var CARE_LIST = [
    ['THEMIS', 'David Hart / VEIN / N'],
    ['BASTION', 'VICE'],
    ['PRISM', 'NOVA'],
    ['이리와 내 사랑', 'Dietrich'],
    ['@WOOYA', 'Felix']
  ];
  var OWN_BANNERS = [
    ['img/banner.jpg', 'END OF EDEN 배너 1'],
    ['img/banner2.jpg', 'END OF EDEN 배너 2']
  ];
  var FELLOW_AGENTS = [
    ['https://b2stsummer.vercel.app/', 'img/banners/fellow-agent-002.png', 'RASPBERRY PLACE'],
    ['https://luvlog.me/nova', 'img/banners/fellow-agent-nova.jpg', 'NOVA'],
    ['https://luvlog.me/aiden', 'img/banners/fellow-agent-aiden.jpg', 'AIDEN']
  ];
  var TRACKS = [
    { videoId: 'gj_94e-fxlY', title: 'ザムザ (INST)', artist: 'てにをは', duration: 212 },
    { videoId: 'O43m7A9Qi7Y', title: 'ツギハギスタッカート (INST)', artist: 'REN', duration: 252 },
    { videoId: 'rBa4ZYxI4vM', title: '미안해 널 미워해', artist: '자우림', duration: 236 },
    { videoId: 'CgiPuXwhhfY', title: 'SOS', artist: 'Avicii', duration: 158 },
    { videoId: 'QW87DP4-elQ', title: 'cares', artist: 'The Poles', duration: 275 },
    { videoId: 'ACDf9fhpuqo', title: 'Whiskey and Morphine', artist: 'Alexander Jean', duration: 306 },
    { videoId: 'FtJUS7jW1sY', title: '너를 위해', artist: '임재범', duration: 247 },
    { videoId: '1WXjtu5T6Ms', title: '隣に…', artist: 'Release', duration: 310 },
    { videoId: 'h1QTkwJnX0E', title: 'はぐ', artist: 'MORE MORE JUMP！ × 鏡音レン', duration: 160 },
    { videoId: 'KnTzSpNJ-M8', title: 'after the play is over', artist: 'dosii', duration: 236 },
    { videoId: 'MjQjaB-HedA', title: 'Track 9', artist: '이소라', duration: 232 },
    { videoId: 'MK_Su-gQ7SQ', title: '죽여줘', artist: '보수동쿨러', duration: 243 }
  ];

  var root = document.documentElement;
  var stages = Array.prototype.slice.call(document.querySelectorAll('[data-stage]'));
  var calm = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var mobileQuery = window.matchMedia('(max-width: 760px), (max-aspect-ratio: 4/5)');

  function el(tag, props, children) {
    var node = document.createElement(tag);
    Object.keys(props || {}).forEach(function (key) { node.setAttribute(key, props[key]); });
    (children || []).forEach(function (child) { node.append(child); });
    return node;
  }

  // 화면 크기에 맞춰 무대 축소
  function fit() {
    root.classList.toggle('is-mobile', mobileQuery.matches);
    var w = window.innerWidth, h = window.innerHeight;
    stages.forEach(function (stage) {
      var mobile = stage.classList.contains('stage--mobile');
      var fitScale = Math.min(w / (mobile ? 390 : 1440), h / (mobile ? 844 : 900));
      stage.style.setProperty('--s', mobile ? fitScale : Math.min(1, fitScale));
    });
  }
  window.addEventListener('resize', fit);
  fit();

  // D-day
  var dday = 'D+' + (Math.floor((Date.now() - Date.UTC(2026, 0, 1)) / 86400000) + 1);
  document.querySelectorAll('[data-dday]').forEach(function (node) { node.textContent = dday; });

  // 리스트·배너 내용
  document.querySelectorAll('[data-care-list]').forEach(function (box) {
    box.append(el('p', { class: 'care-note' }, [CARE_NOTE]));
    CARE_LIST.forEach(function (entry) {
      box.append(el('div', { class: 'care-entry' }, [el('b', {}, [entry[0]]), el('span', {}, [entry[1]])]));
    });
  });
  document.querySelectorAll('[data-banner-list]').forEach(function (box) {
    OWN_BANNERS.forEach(function (banner) {
      box.append(el('img', { src: banner[0], alt: banner[1], width: '200', height: '40' }));
    });
    box.append(el('span', { class: 'banner-head' }, ['FELLOW AGENTS']));
    FELLOW_AGENTS.forEach(function (agent) {
      box.append(el('a', { href: agent[0], target: '_blank', rel: 'noopener noreferrer', 'aria-label': agent[2] + ' 새 창에서 열기' }, [
        el('img', { src: agent[1], alt: agent[2], width: '200', height: '40' })
      ]));
    });
  });

  // 컬러 조각 글리치
  function rand(a, b) { return a + Math.random() * (b - a); }
  function sign() { return Math.random() < 0.5 ? -1 : 1; }

  function glitch(apple) {
    var reach = Number(apple.dataset.glitch) || 22;
    var base = apple.querySelector('.apple__glitch');
    var red = base.querySelector('.r');
    var cyan = base.querySelector('.c');
    var slices = [0, 1, 2].map(function () {
      var img = el('img', { class: 'apple__slice', src: 'img/home/apple-color.webp', alt: '', 'aria-hidden': 'true', hidden: '' });
      apple.append(img);
      return img;
    });

    function reset() {
      base.style.transform = red.style.transform = cyan.style.transform = '';
      slices.forEach(function (img) { img.hidden = true; });
    }

    function burst(frames) {
      if (frames <= 0) {
        reset();
        setTimeout(function () { burst(2 + Math.floor(Math.random() * 4)); }, Math.random() < 0.25 ? rand(90, 180) : rand(2600, 8000));
        return;
      }
      var power = rand(0.4, 1);
      var count = Math.floor(Math.random() * 4);
      base.style.transform = Math.random() < 0.4 ? 'translateX(' + (sign() * rand(1, reach > 15 ? 3 : 2)) + 'px)' : '';
      red.style.transform = 'translate(' + (-rand(2, reach > 15 ? 8 : 6) * power) + 'px,' + (sign() * rand(0, 1.5)) + 'px)';
      cyan.style.transform = 'translate(' + (rand(2, reach > 15 ? 8 : 6) * power) + 'px,' + (sign() * rand(0, 1.5)) + 'px)';
      slices.forEach(function (img, i) {
        img.hidden = i >= count;
        if (img.hidden) return;
        var top = rand(12, 50);
        var bottom = Math.max(48, 100 - top - rand(1, 6));
        img.style.clipPath = 'inset(' + top.toFixed(2) + '% 12% ' + bottom.toFixed(2) + '% 50%)';
        img.style.transform = 'translateX(' + (sign() * rand(reach > 15 ? 4 : 3, reach) * power).toFixed(1) + 'px)';
      });
      setTimeout(function () { burst(frames - 1); }, rand(40, 110));
    }

    setTimeout(function () { burst(2 + Math.floor(Math.random() * 4)); }, 1800 + Math.random() * 2500);
  }
  if (!calm) document.querySelectorAll('[data-apple]').forEach(glitch);

  // 앞에서부터 count 글자까지 쓰고, bold에 걸리는 단어는 굵게
  function typeInto(box, text, count, bold) {
    box.textContent = '';
    text.split(bold).forEach(function (part, i) {
      if (count <= 0 || !part) return;
      var shown = part.slice(0, count);
      count -= part.length;
      box.append(i % 2 ? el('b', {}, [shown]) : shown);
    });
  }

  // NOTICE → NG 타자 효과
  function notice(stage) {
    var trigger = stage.querySelector('[data-notice-trigger]');
    var noticeWin = stage.querySelector('[data-notice]');
    var ngWin = stage.querySelector('[data-ng]');
    var scrim = stage.querySelector('[data-notice-close]');
    var t1 = NOTICE.length, tA = NG.length, t2 = tA + NG_LAST.length;
    var n = 0, timer = null, open = false;

    function paint() {
      var n1 = Math.min(n, t1), n2 = Math.max(0, n - t1);
      typeInto(noticeWin.querySelector('[data-typed]'), NOTICE, n1, NOTICE_BOLD);
      noticeWin.querySelector('[data-progress]').textContent = Math.round(n1 / t1 * 100) + '%';
      noticeWin.querySelector('[data-caret]').hidden = n >= t1;
      ngWin.hidden = !open || n < t1;
      ngWin.querySelector('[data-typed]').textContent = NG.slice(0, Math.min(n2, tA));
      ngWin.querySelector('[data-typed-bold]').textContent = NG_LAST.slice(0, Math.max(0, n2 - tA));
      ngWin.querySelector('[data-progress]').textContent = Math.round(n2 / t2 * 100) + '%';
      ngWin.querySelector('[data-caret]').classList.toggle('is-blink', n2 >= t2);
    }

    function start() {
      clearInterval(timer);
      open = true;
      n = calm ? t1 + t2 : 0;
      noticeWin.hidden = false;
      if (scrim) scrim.hidden = false;
      trigger.setAttribute('aria-expanded', 'true');
      paint();
      if (calm) return;
      timer = setInterval(function () {
        if (n >= t1 + t2) { clearInterval(timer); return; }
        n = n < t1 ? Math.min(t1, n + 2) : n + 1;
        paint();
      }, TYPE_MS);
    }

    function stop() {
      clearInterval(timer);
      open = false;
      n = 0;
      noticeWin.hidden = true;
      if (scrim) scrim.hidden = true;
      trigger.setAttribute('aria-expanded', 'false');
      paint();
    }

    if (trigger.dataset.noticeTrigger === 'hover') {
      trigger.addEventListener('mouseenter', start);
      trigger.addEventListener('mouseleave', stop);
      trigger.addEventListener('focus', start);
      trigger.addEventListener('blur', stop);
    } else {
      trigger.addEventListener('click', function () { if (open) stop(); else start(); });
    }
    if (scrim) scrim.addEventListener('click', stop);
    return { close: stop };
  }

  // LIST / BANNER 창
  function boards(stage) {
    var toggles = stage.querySelectorAll('[data-board-toggle]');
    var tabs = stage.querySelectorAll('[data-board-tab]');
    var panels = stage.querySelectorAll('[data-board]');
    var folder = stage.querySelector('[data-folder]');
    var scrim = stage.querySelector('[data-board-close]');
    var current = null;

    function show(name) {
      current = name;
      scrim.hidden = !name;
      if (folder) folder.hidden = !name;
      panels.forEach(function (panel) { panel.hidden = panel.dataset.board !== name; });
      toggles.forEach(function (button) { button.setAttribute('aria-expanded', String(!!name && (folder ? true : button.dataset.boardToggle === name))); });
      tabs.forEach(function (tab) { tab.setAttribute('aria-selected', String(tab.dataset.boardTab === name)); });
    }

    toggles.forEach(function (button) {
      button.addEventListener('click', function () {
        var name = button.dataset.boardToggle;
        show(current && (folder || current === name) ? null : name);
      });
    });
    tabs.forEach(function (tab) {
      tab.addEventListener('click', function () { show(tab.dataset.boardTab); });
    });
    scrim.addEventListener('click', function () { show(null); });
    return { close: function () { show(null); } };
  }

  var closers = [];
  stages.forEach(function (stage) {
    closers.push(notice(stage), boards(stage));
  });
  document.addEventListener('keydown', function (event) {
    if (event.key === 'Escape') closers.forEach(function (item) { item.close(); });
  });

  // 플레이어 (YouTube)
  var template = document.getElementById('player-template');
  var players = Array.prototype.slice.call(document.querySelectorAll('[data-player]'));
  players.forEach(function (box) { box.append(template.content.cloneNode(true)); });

  var yt = null, ready = false, index = 0, playing = false, wantPlay = false;

  function formatTime(seconds) {
    if (!isFinite(seconds) || seconds < 0) seconds = 0;
    return Math.floor(seconds / 60) + ':' + String(Math.floor(seconds % 60)).padStart(2, '0');
  }

  function all(selector, fn) {
    players.forEach(function (box) { box.querySelectorAll(selector).forEach(fn); });
  }

  function paintTrack() {
    var track = TRACKS[index];
    all('[data-track-title]', function (node) { node.textContent = track.title; });
    all('[data-track-artist]', function (node) { node.textContent = track.artist; });
    paintTime(0, track.duration);
  }

  function paintTime(current, total) {
    var ratio = total ? Math.min(1, current / total) : 0;
    all('[data-time-current]', function (node) { node.textContent = formatTime(current); });
    all('[data-time-total]', function (node) { node.textContent = formatTime(total); });
    all('[data-seek-mark]', function (node) { node.style.left = 'calc(' + (ratio * 100) + '% - ' + (ratio * 3) + 'px)'; });
  }

  function paintPlaying() {
    players.forEach(function (box) { box.classList.toggle('is-playing', playing); });
    all('[data-play]', function (node) { node.setAttribute('aria-label', playing ? '일시정지' : '재생'); });
  }

  function load(i, autoplay) {
    index = (i + TRACKS.length) % TRACKS.length;
    paintTrack();
    if (!ready) { wantPlay = autoplay; return; }
    if (autoplay) yt.loadVideoById(TRACKS[index].videoId);
    else yt.cueVideoById(TRACKS[index].videoId);
  }

  function toggle() {
    if (!ready) { wantPlay = !wantPlay; playing = wantPlay; paintPlaying(); return; }
    if (playing) yt.pauseVideo(); else yt.playVideo();
  }

  all('[data-play]', function (node) { node.addEventListener('click', toggle); });
  all('[data-prev]', function (node) {
    node.addEventListener('click', function () {
      if (ready && yt.getCurrentTime() > 3) { yt.seekTo(0, true); return; }
      load(index - 1, true);
    });
  });
  all('[data-next]', function (node) { node.addEventListener('click', function () { load(index + 1, true); }); });
  all('[data-seek]', function (node) {
    node.addEventListener('click', function (event) {
      if (!ready) return;
      var rect = node.getBoundingClientRect();
      var ratio = Math.max(0, Math.min(1, (event.clientX - rect.left) / rect.width));
      var total = yt.getDuration() || TRACKS[index].duration;
      yt.seekTo(total * ratio, true);
      paintTime(total * ratio, total);
    });
  });

  // 첫 클릭·키 입력 때 재생 시작 (플레이어 버튼은 제외)
  function firstGesture(event) {
    if (event.target.closest && event.target.closest('[data-player]')) { stopListening(); return; }
    stopListening();
    if (!playing) { wantPlay = true; if (ready) yt.playVideo(); }
  }
  function stopListening() {
    document.removeEventListener('pointerdown', firstGesture, true);
    document.removeEventListener('keydown', firstGesture, true);
  }
  document.addEventListener('pointerdown', firstGesture, true);
  document.addEventListener('keydown', firstGesture, true);

  window.onYouTubeIframeAPIReady = function () {
    yt = new YT.Player('youtube-player', {
      width: 200,
      height: 200,
      videoId: TRACKS[index].videoId,
      playerVars: { autoplay: 1, playsinline: 1, controls: 0, rel: 0 },
      events: {
        onReady: function () {
          ready = true;
          yt.setVolume(35);
          if (wantPlay) yt.playVideo();
        },
        onStateChange: function (event) {
          if (event.data === YT.PlayerState.ENDED) { load(index + 1, true); return; }
          playing = event.data === YT.PlayerState.PLAYING || event.data === YT.PlayerState.BUFFERING;
          if (playing) stopListening();
          paintPlaying();
        },
        onError: function () { load(index + 1, true); }
      }
    });
  };

  setInterval(function () {
    if (!ready || !playing) return;
    paintTime(yt.getCurrentTime(), yt.getDuration() || TRACKS[index].duration);
  }, 500);

  paintTrack();
  var api = document.createElement('script');
  api.src = 'https://www.youtube.com/iframe_api';
  document.head.appendChild(api);
})();
