(function () {
  var apiPromise;
  function youtubeAPI() {
    if (window.YT && window.YT.Player) return Promise.resolve(window.YT);
    if (apiPromise) return apiPromise;
    apiPromise = new Promise(function (resolve, reject) {
      var timeout = setTimeout(function () { reject(new Error('YouTube timeout')); }, 15000);
      window.onYouTubeIframeAPIReady = function () { clearTimeout(timeout); resolve(window.YT); };
      var script = document.createElement('script');
      script.src = 'https://www.youtube.com/iframe_api';
      script.onerror = function () { clearTimeout(timeout); reject(new Error('YouTube unavailable')); };
      document.head.appendChild(script);
    }).catch(function (error) { apiPromise = null; throw error; });
    return apiPromise;
  }
  function icon(name) {
    var span = document.createElement('span');
    span.className = 'arch-icon'; span.dataset.icon = name; span.setAttribute('aria-hidden', 'true');
    return span;
  }
  function time(seconds) {
    seconds = Math.max(0, Math.floor(Number(seconds) || 0));
    return String(Math.floor(seconds / 60)).padStart(2, '0') + ':' + String(seconds % 60).padStart(2, '0');
  }
  function pauseBackgroundMusic() {
    try {
      var host = window.top;
      if (host.player && typeof host.player.pauseVideo === 'function') host.player.pauseVideo();
      if (host.rememberInitialPlaybackGesture) {
        host.document.removeEventListener('pointerdown', host.rememberInitialPlaybackGesture, true);
        host.document.removeEventListener('keydown', host.rememberInitialPlaybackGesture, true);
      }
    } catch (_) {}
  }
  function addMusic(container, music) {
    if (!music || !/^[\w-]{11}$/.test(music.videoId)) return;
    var root = document.createElement('section'); root.className = 'log-music'; root.setAttribute('aria-label', music.title || '로그 음악');
    var row = document.createElement('div'); row.className = 'log-music-bar';
    var button = document.createElement('button'); button.type = 'button'; button.className = 'log-music-play';
    button.setAttribute('aria-label', '로그 음악 재생'); button.setAttribute('aria-pressed', 'false');
    var playIcon = icon('play'); button.appendChild(playIcon);
    var elapsed = document.createElement('span'); elapsed.className = 'log-music-time'; elapsed.textContent = '00:00';
    var seek = document.createElement('input'); seek.type = 'range'; seek.min = '0'; seek.max = '0'; seek.value = '0'; seek.step = '1';
    seek.disabled = true; seek.className = 'log-music-seek'; seek.setAttribute('aria-label', '로그 음악 재생 위치');
    var duration = document.createElement('span'); duration.className = 'log-music-time'; duration.textContent = '00:00';
    row.append(button, elapsed, seek, duration);
    var status = document.createElement('p'); status.className = 'log-music-status'; status.setAttribute('role', 'status');
    var fallback = document.createElement('a'); fallback.className = 'log-music-fallback'; fallback.hidden = true;
    fallback.href = 'https://youtu.be/' + music.videoId; fallback.target = '_blank'; fallback.rel = 'noopener noreferrer'; fallback.textContent = 'YouTube에서 듣기';
    root.append(row, status, fallback); container.appendChild(root);
    var player, ready = false, playing = false, loading = false, timer, readyTimeout, disposed = false;
    function setPlaying(value) {
      playing = value; root.dataset.state = value ? 'playing' : 'paused';
      button.setAttribute('aria-pressed', String(value));
      button.setAttribute('aria-label', value ? '로그 음악 일시정지' : '로그 음악 재생');
      playIcon.dataset.icon = value ? 'pause' : 'play';
      clearInterval(timer);
      if (value) timer = setInterval(update, 500);
    }
    function update() {
      if (!ready || disposed) return;
      var length = player.getDuration() || 0, current = player.getCurrentTime() || 0;
      seek.max = String(length); seek.value = String(current); seek.disabled = !length;
      seek.style.setProperty('--progress', (length ? current / length * 100 : 0) + '%');
      seek.setAttribute('aria-valuetext', time(current) + ' / ' + time(length));
      elapsed.textContent = time(current); duration.textContent = time(length);
      try {
        if (playing && window.top.player && window.top.player.getPlayerState() === 1) player.pauseVideo();
      } catch (_) {}
    }
    function fail(error) {
      root.dataset.error = error && (error.data || error.message) || 'Player readiness timeout';
      clearTimeout(readyTimeout); loading = false; button.disabled = false; setPlaying(false);
      status.textContent = '음악을 불러오지 못했어요.'; fallback.hidden = false;
      if (player && player.destroy) player.destroy();
      var engine = root.querySelector('.log-music-engine');
      if (engine) engine.remove();
      player = null; ready = false;
    }
    button.addEventListener('click', function () {
      if (loading) return;
      if (ready) {
        if (playing) player.pauseVideo();
        else { status.textContent = ''; pauseBackgroundMusic(); player.playVideo(); }
        return;
      }
      loading = true; button.disabled = true; fallback.hidden = true; status.textContent = '음악을 불러오는 중…';
      delete root.dataset.error;
      pauseBackgroundMusic();
      youtubeAPI().then(function (YT) {
        if (disposed) return;
        var mount = document.createElement('div');
        var engine = document.createElement('div'); engine.className = 'log-music-engine'; engine.setAttribute('aria-hidden', 'true');
        engine.appendChild(mount); root.appendChild(engine);
        readyTimeout = setTimeout(fail, 15000);
        player = new YT.Player(mount, {
          width: 200, height: 200, videoId: music.videoId,
          playerVars: { autoplay: 0, controls: 0, playsinline: 1, rel: 0, origin: location.origin },
          events: {
            onReady: function (event) {
              clearTimeout(readyTimeout); if (disposed) return;
              ready = true; loading = false; button.disabled = false; status.textContent = '';
              var frame = event.target.getIframe(); frame.tabIndex = -1; frame.title = music.title || '로그 음악';
              event.target.setVolume(35); update(); event.target.playVideo();
            },
            onStateChange: function (event) {
              if (disposed) return;
              if (event.data === YT.PlayerState.PLAYING) { pauseBackgroundMusic(); status.textContent = ''; }
              setPlaying(event.data === YT.PlayerState.PLAYING); update();
            },
            onAutoplayBlocked: function () { status.textContent = '재생 버튼을 한 번 더 눌러 주세요.'; setPlaying(false); },
            onError: fail
          }
        });
      }).catch(function (error) { if (!disposed) fail(error); });
    });
    seek.addEventListener('input', function () {
      if (!ready) return;
      player.seekTo(Number(seek.value), true); update();
    });
    window.addEventListener('pagehide', function () {
      disposed = true; clearInterval(timer); clearTimeout(readyTimeout);
      if (player && player.destroy) player.destroy();
    }, { once: true });
  }
  window.appendLogExtras = function (container, log) {
    if (log.ooc) {
      var disclosure = document.createElement('details'); disclosure.className = 'log-ooc';
      var summary = document.createElement('summary');
      summary.setAttribute('aria-label', 'OOC 전체보기');
      var label = document.createElement('span'); label.textContent = '₊˚⊹⁠♡——— OOC ———♡⊹⁠˚₊';
      label.setAttribute('aria-hidden', 'true');
      summary.append(label);
      var copy = document.createElement('div'); copy.className = 'log-ooc-copy'; copy.textContent = log.ooc;
      disclosure.append(summary, copy); container.appendChild(disclosure);
    }
    addMusic(container, log.music);
  };
})();
