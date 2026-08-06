(function () {
  var style = document.createElement('style');
  style.textContent = `
  .msg-fab {
    position: absolute; z-index: 9998;
    width: 40px; height: 40px; border-radius: 50%;
    background: var(--color-background-secondary, #1a1a22);
    border: 0.5px solid var(--color-border-secondary, rgba(255,255,255,0.16));
    box-shadow: 0 6px 20px rgba(0,0,0,0.45);
    display: flex; align-items: center; justify-content: center;
    cursor: pointer; color: var(--color-text-primary, #f2f2f5); font-size: 17px;
    transition: transform 0.15s, background 0.15s, opacity 0.25s ease;
    opacity: 0; pointer-events: none;
  }
  .msg-fab.ready { opacity: 1; pointer-events: auto; }
  .msg-fab:hover { transform: scale(1.06); background: var(--color-background-tertiary, #22222c); }
  .msg-fab .dot {
    position: absolute; top: 4px; right: 4px; width: 7px; height: 7px; border-radius: 50%;
    background: #fcd1e0; box-shadow: 0 0 0 2px var(--color-background-secondary, #1a1a22);
    animation: msgPulse 2s infinite;
  }
  @keyframes msgPulse { 0%,100% { opacity: 1; } 50% { opacity: 0.35; } }

  .msg-panel {
    position: absolute; z-index: 9999;
    width: min(360px, calc(100vw - 32px));
    height: min(520px, calc(100vh - 140px));
    background: var(--color-background-primary, #0f0f14);
    border: 0.5px solid var(--color-border-tertiary, rgba(255,255,255,0.10));
    border-radius: 14px;
    box-shadow: 0 12px 40px rgba(0,0,0,0.55);
    display: flex; flex-direction: column; overflow: hidden;
    font-family: var(--font-sans, 'Pretendard', sans-serif);
    opacity: 0; transform: translateY(12px) scale(0.98); pointer-events: none;
    transition: opacity 0.18s ease, transform 0.18s ease;
  }
  .msg-panel.open { opacity: 1; transform: translateY(0) scale(1); pointer-events: auto; }

  .msg-header {
    flex-shrink: 0; display: flex; align-items: center; justify-content: space-between;
    padding: 14px 16px; border-bottom: 0.5px solid var(--color-border-tertiary, rgba(255,255,255,0.10));
  }
  .msg-header-title { font-size: 13px; font-weight: 600; letter-spacing: 0.04em; color: var(--color-text-primary, #f2f2f5); }
  .msg-header-sub { font-size: 10px; color: var(--color-text-tertiary, #6f7380); margin-top: 2px; }
  .msg-close {
    width: 26px; height: 26px; border-radius: 8px; border: none; background: transparent;
    color: var(--color-text-tertiary, #6f7380); cursor: pointer; font-size: 15px;
    display: flex; align-items: center; justify-content: center; transition: background 0.15s;
  }
  .msg-close:hover { background: var(--color-background-secondary, #1a1a22); color: var(--color-text-primary, #f2f2f5); }

  .msg-body {
    flex: 1; overflow-y: auto; padding: 16px; display: flex; flex-direction: column; gap: 2px;
  }
  .msg-body::-webkit-scrollbar { width: 3px; }
  .msg-body::-webkit-scrollbar-thumb { background: var(--color-border-secondary, rgba(255,255,255,0.16)); border-radius: 99px; }

  .msg-row { display: flex; gap: 8px; margin-top: 10px; max-width: 84%; }
  .msg-row.right { align-self: flex-end; flex-direction: row-reverse; }
  .msg-row.follow { margin-top: 3px; }

  .msg-avatar { width: 30px; height: 30px; border-radius: 50%; overflow: hidden; flex-shrink: 0; background: var(--color-background-secondary, #1a1a22); border: 0.5px solid var(--color-border-tertiary, rgba(255,255,255,0.10)); }
  .msg-avatar img { width: 100%; height: 100%; object-fit: cover; object-position: top; }
  .msg-avatar.spacer { visibility: hidden; }

  .msg-col { display: flex; flex-direction: column; min-width: 0; }
  .msg-row.right .msg-col { align-items: flex-end; }
  .msg-name { font-size: 10px; font-weight: 600; margin-bottom: 4px; letter-spacing: 0.02em; }
  .msg-bubble-wrap { display: flex; align-items: flex-end; gap: 6px; }
  .msg-row.right .msg-bubble-wrap { flex-direction: row-reverse; }
  .msg-bubble {
    font-size: 13px; line-height: 1.5; padding: 8px 12px; border-radius: 14px;
    color: var(--color-text-primary, #f2f2f5); word-break: break-word;
  }
  .msg-time { font-size: 9px; color: var(--color-text-tertiary, #6f7380); flex-shrink: 0; margin-bottom: 2px; }

  .msg-row.eden .msg-name { color: #87ceeb; }
  .msg-row.eden .msg-bubble { background: rgba(135,206,235,0.13); border: 0.5px solid rgba(135,206,235,0.3); border-bottom-left-radius: 4px; }
  .msg-row.lilith .msg-name { color: #fcd1e0; }
  .msg-row.lilith .msg-bubble { background: rgba(252,209,224,0.14); border: 0.5px solid rgba(252,209,224,0.30); border-bottom-right-radius: 4px; }

  .msg-divider { display: flex; align-items: center; gap: 8px; margin: 14px 0 6px; }
  .msg-divider::before, .msg-divider::after { content: ''; flex: 1; height: 0.5px; background: var(--color-border-tertiary, rgba(255,255,255,0.10)); }
  .msg-divider span { font-size: 10px; color: var(--color-text-tertiary, #6f7380); white-space: nowrap; }

  .msg-footer {
    flex-shrink: 0; display: flex; align-items: center; gap: 8px;
    padding: 10px 12px; border-top: 0.5px solid var(--color-border-tertiary, rgba(255,255,255,0.10));
  }
  .msg-footer-icon {
    width: 26px; height: 26px; border-radius: 50%; border: none; background: transparent;
    color: var(--color-text-tertiary, #6f7380); font-size: 15px; cursor: pointer; flex-shrink: 0;
    display: flex; align-items: center; justify-content: center;
  }
  .msg-input {
    flex: 1; min-width: 0; background: var(--color-background-secondary, #1a1a22);
    border: 0.5px solid var(--color-border-tertiary, rgba(255,255,255,0.10)); border-radius: 999px;
    padding: 7px 14px; font-size: 12px; color: var(--color-text-tertiary, #6f7380);
    font-family: inherit; cursor: default;
  }
  .msg-send {
    width: 30px; height: 30px; border-radius: 50%; border: none; flex-shrink: 0; cursor: pointer;
    background: var(--color-background-secondary, #1a1a22); color: var(--color-text-secondary, #b0b4bd);
    display: flex; align-items: center; justify-content: center; font-size: 13px; transition: background 0.15s;
  }
  .msg-send:hover { background: var(--color-background-tertiary, #22222c); }

  .msg-toast {
    position: absolute; left: 50%; bottom: 66px; transform: translateX(-50%) translateY(6px);
    background: rgba(20,20,26,0.95); border: 0.5px solid var(--color-border-tertiary, rgba(255,255,255,0.10));
    color: var(--color-text-secondary, #b0b4bd); font-size: 11px; padding: 6px 12px; border-radius: 999px;
    opacity: 0; pointer-events: none; transition: opacity 0.2s, transform 0.2s; white-space: nowrap;
  }
  .msg-toast.show { opacity: 1; transform: translateX(-50%) translateY(0); }

  html[data-theme="light"] .msg-fab {
    background: #fff;
    box-shadow: 0 3px 10px rgba(25,30,40,0.1);
  }
  html[data-theme="light"] .msg-fab:hover {
    background: #f7f8fb;
  }
  html[data-theme="light"] .msg-panel {
    box-shadow: 0 5px 16px rgba(25,30,40,0.12);
  }
  `;
  document.head.appendChild(style);

  var AVA = {
    eden: 'https://raw.githubusercontent.com/end-of-eden/EXL/main/img/wiki/Eden_1.jpg',
    lilith: 'https://raw.githubusercontent.com/end-of-eden/EXL/main/img/wiki/Lilith_1.jpg'
  };
  var NAME = { eden: 'Eden', lilith: 'Lilith' };

  var log = [
    { who: 'eden', text: '일어나.', time: '08:12' },
    { who: 'eden', text: '아침 브리핑 9시야. 또 지각하면 저스티스 팀장이 나한테 전화함.', time: '08:13' },
    { who: 'eden', text: '…안 읽씹하면 가서 깨운다. 진심.', time: '08:25' },
    { who: 'lilith', text: '이러나써... 5분만...', time: '08:31' },
    { who: 'eden', text: '5분 지났어. 일어나.', time: '08:31' },
    { who: 'eden', text: '커피 사다 놓을 테니까 복도 자판기 앞으로 와. 아메리카노.', time: '08:32' },
    { who: 'lilith', text: '나... 바닐라 라떼로 해주면 안돼?', time: '08:34' },
    { who: 'eden', text: '…하아.', time: '08:34' },
    { who: 'eden', text: '알았어.', time: '08:35' },
    { divider: '17:22' },
    { who: 'eden', text: '너 매운 거 먹을 수 있어?', time: '17:22' },
    { who: 'lilith', text: '응?? 갑자기?? 먹을 수 있는데 왜??', time: '17:24' },
    { who: 'eden', text: '아니. 됐어.', time: '17:25' },
    { who: 'lilith', text: '에??? 뭐야 왜 물어보고 말아ㅠㅠ 궁금하잖아', time: '17:26' },
    { who: 'eden', text: '신드롬이랑 떡볶이 먹으러 다닌다며.', time: '17:28' },
    { who: 'lilith', text: '?????? 그거 한 달 전인데???? 어떻게 알아???', time: '17:29' },
    { who: 'eden', text: '다 알아.', time: '17:30' }
  ];

  var wrap = document.createElement('div');
  wrap.className = 'arch-messenger-root';

  var fab = document.createElement('button');
  fab.className = 'msg-fab';
  fab.setAttribute('aria-label', '메신저 열기');
  fab.innerHTML = '<i class="ti ti-message-circle-2" aria-hidden="true"></i><span class="dot"></span>';
  wrap.appendChild(fab);

  var panel = document.createElement('div');
  panel.className = 'msg-panel';

  var rowsHtml = '';
  var prevWho = null;
  log.forEach(function (m) {
    if (m.divider) {
      rowsHtml += '<div class="msg-divider"><span>' + m.divider + '</span></div>';
      prevWho = null; // 구분선 다음엔 항상 아바타/이름 다시 표시
      return;
    }
    var follow = m.who === prevWho;
    var alignClass = m.who === 'lilith' ? ' right' : '';
    var avatarHtml = follow
      ? '<div class="msg-avatar spacer"></div>'
      : '<div class="msg-avatar"><img src="' + AVA[m.who] + '" alt=""></div>';
    var nameHtml = follow ? '' : '<div class="msg-name">' + NAME[m.who] + '</div>';
    rowsHtml += '<div class="msg-row ' + m.who + alignClass + (follow ? ' follow' : '') + '">' +
      avatarHtml +
      '<div class="msg-col">' + nameHtml +
      '<div class="msg-bubble-wrap"><div class="msg-bubble">' + m.text + '</div>' +
      '<div class="msg-time">' + m.time + '</div></div></div></div>';
    prevWho = m.who;
  });

  panel.innerHTML =
    '<div class="msg-header">' +
      '<div><div class="msg-header-title">ARCH MESSENGER</div><div class="msg-header-sub">Eden &amp; Lilith · Log</div></div>' +
      '<button class="msg-close" aria-label="닫기"><i class="ti ti-x"></i></button>' +
    '</div>' +
    '<div class="msg-body">' + rowsHtml + '</div>' +
    '<div class="msg-footer">' +
      '<button class="msg-footer-icon" aria-label="사진"><i class="ti ti-photo"></i></button>' +
      '<input class="msg-input" placeholder="메시지 입력" readonly>' +
      '<button class="msg-send" aria-label="전송"><i class="ti ti-send-2"></i></button>' +
    '</div>' +
    '<div class="msg-toast">저장된 대화 로그입니다</div>';

  wrap.appendChild(panel);

  var portalDocument = document;
  if (window.parent !== window) {
    try {
      portalDocument = window.parent.document;
      var previousRoot = portalDocument.querySelector('.arch-messenger-root');
      if (previousRoot) previousRoot.remove();
      if (!portalDocument.getElementById('arch-messenger-style')) {
        var portalStyle = style.cloneNode(true);
        portalStyle.id = 'arch-messenger-style';
        portalDocument.head.appendChild(portalStyle);
      }
    } catch (_) {
      portalDocument = document;
    }
  }
  portalDocument.body.appendChild(wrap);

  var portalVariables = [
    '--color-background-primary', '--color-background-secondary', '--color-background-tertiary',
    '--color-border-secondary', '--color-border-tertiary',
    '--color-text-primary', '--color-text-secondary', '--color-text-tertiary',
    '--font-sans', '--border-radius-md', '--border-radius-lg'
  ];
  function syncPortalTheme() {
    if (portalDocument === document) return;
    var isLight = document.documentElement.dataset.theme === 'light';
    var themeValues = isLight ? {
      '--color-background-primary': '#ffffff',
      '--color-background-secondary': '#f2f3f6',
      '--color-background-tertiary': '#e7e9ee',
      '--color-border-secondary': 'rgba(25,30,40,0.18)',
      '--color-border-tertiary': 'rgba(25,30,40,0.11)',
      '--color-text-primary': '#20232a',
      '--color-text-secondary': '#555b66',
      '--color-text-tertiary': '#858b96'
    } : {
      '--color-background-primary': '#181a22',
      '--color-background-secondary': '#222530',
      '--color-background-tertiary': '#2a2e3a',
      '--color-border-secondary': 'rgba(210,220,240,0.19)',
      '--color-border-tertiary': 'rgba(210,220,240,0.12)',
      '--color-text-primary': '#f4f5f8',
      '--color-text-secondary': '#c0c4ce',
      '--color-text-tertiary': '#8c93a3'
    };
    var sourceStyle = getComputedStyle(document.documentElement);
    portalVariables.forEach(function (name) {
      var value = themeValues[name] || sourceStyle.getPropertyValue(name);
      if (value) wrap.style.setProperty(name, value);
    });
  }
  syncPortalTheme();
  if (portalDocument !== document && window.MutationObserver) {
    new MutationObserver(syncPortalTheme).observe(document.documentElement, {
      attributes: true,
      attributeFilter: ['data-theme']
    });
  }

  var body = panel.querySelector('.msg-body');
  var toast = panel.querySelector('.msg-toast');
  var toastTimer = null;

  function openPanel() {
    panel.classList.add('open');
    body.scrollTop = body.scrollHeight;
  }
  function closePanel() {
    panel.classList.remove('open');
  }

  fab.addEventListener('click', function () {
    panel.classList.contains('open') ? closePanel() : openPanel();
  });
  panel.querySelector('.msg-close').addEventListener('click', closePanel);
  panel.querySelector('.msg-send').addEventListener('click', function () {
    toast.classList.add('show');
    clearTimeout(toastTimer);
    toastTimer = setTimeout(function () { toast.classList.remove('show'); }, 1600);
  });

  var FAB_SIZE = 40, GAP_SIDE = 20, GAP_PANEL = 12;
  function reposition() {
    var host = document.querySelector('.main-wrap, .wiki-wrap, .gallery-wrap, .log-wrap, .detail-wrap, .post-wrap');
    if (!host) return;
    var r = host.getBoundingClientRect();
    var scrollX = window.scrollX || window.pageXOffset;
    var scrollY = window.scrollY || window.pageYOffset;
    var cardRight = r.right + scrollX;
    var cardBottom = r.bottom + scrollY;
    // 카드와 절대 겹치지 않도록 오른쪽으로 GAP_SIDE만큼 띄우고, 높이만 하단 라인에 맞춤
    var fabLeft = cardRight + GAP_SIDE;
    var fabTop = cardBottom - FAB_SIZE;
    fab.style.left = fabLeft + 'px';
    fab.style.top = fabTop + 'px';
    panel.style.left = (fabLeft - panel.offsetWidth + FAB_SIZE) + 'px';
    panel.style.top = (fabTop - GAP_PANEL - panel.offsetHeight) + 'px';
  }
  window.addEventListener('resize', reposition);
  reposition();
  // 카드 크기가 실제로 바뀔 때마다(이미지 로딩 등) 자동으로 재계산 — 타이머 땜빵 대신 정확하게 감지
  var host = document.querySelector('.main-wrap, .wiki-wrap, .gallery-wrap, .log-wrap, .detail-wrap, .post-wrap');
  if (window.ResizeObserver && host) {
    var ro = new ResizeObserver(reposition);
    ro.observe(host);
  }

  // 위치가 확정되기 전까지는 숨겨뒀다가, 모든 이미지 로딩이 끝난 뒤 한 번에 자연스럽게 표시
  var imgs = Array.prototype.slice.call(document.querySelectorAll('img'));
  var pending = imgs.filter(function (img) { return !img.complete; });
  function reveal() {
    reposition();
    requestAnimationFrame(function () { fab.classList.add('ready'); });
  }
  if (pending.length === 0) {
    reveal();
  } else {
    var remaining = pending.length;
    pending.forEach(function (img) {
      img.addEventListener('load', function () {
        remaining--;
        if (remaining <= 0) reveal();
      }, { once: true });
      img.addEventListener('error', function () {
        remaining--;
        if (remaining <= 0) reveal();
      }, { once: true });
    });
    // 혹시 이미지가 끝까지 로드 실패해도 무한정 숨겨져 있지 않도록 최소한의 안전장치
    setTimeout(reveal, 1500);
  }
})();
