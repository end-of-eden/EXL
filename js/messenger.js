(function () {
  if (window.name === 'archive-content') return;
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
    background: #0a84ff; box-shadow: 0 0 0 2px var(--color-background-secondary, #1a1a22);
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

  body > .arch-messenger-root {
    position: fixed; right: 18px; bottom: 18px; z-index: 9999; width: 350px;
  }
  body > .arch-messenger-root > .msg-fab { display: none; }
  body > .arch-messenger-root > .msg-panel {
    position: relative; left: 0 !important; top: 0 !important;
    width: 350px; height: 42px; max-height: min(520px, calc(100vh - 36px));
    padding: 5px; border: 2px solid; border-color: #6f7178 #252730 #252730 #6f7178;
    border-radius: 0; background: #3a3d46; box-shadow: inset -1px -1px 0 #252730, 4px 5px 16px rgba(0,0,0,.28);
    opacity: 1; transform: none; pointer-events: auto; transition: height .18s ease;
  }
  body > .arch-messenger-root > .msg-panel.open { height: min(520px, calc(100vh - 36px)); }
  .msg-windowbar { flex: 0 0 30px; height: 30px; padding: 0 5px 0 9px; display: flex; align-items: center; justify-content: space-between; border: 1px solid #c897aa; background: #d9a9bb; color: #4f3e46; box-shadow: inset 0 1px 0 rgba(255,255,255,.48); font: 400 11px/1 "Galmuri11", "Pretendard", sans-serif; cursor: grab; user-select: none; touch-action: none; }
  .msg-windowbar.dragging { cursor: grabbing; }
  .msg-window-controls { display: flex; gap: 4px; }
  .msg-window-button { width: 20px; height: 20px; padding: 0; display: grid; place-items: center; border: 2px solid; border-color: #73757c #272932 #272932 #73757c; border-radius: 0; background: #454851; color: #e7dbe0; font: 12px/1 Arial, sans-serif; }
  .msg-window-toggle { cursor: pointer; }
  body > .arch-messenger-root > .msg-panel:not(.open) > :not(.msg-windowbar) { display: none; }

  .msg-header {
    position: relative; flex-shrink: 0; display: flex; align-items: center; justify-content: center;
    min-height: 94px; padding: 10px 48px 12px;
    border-bottom: 0.5px solid var(--color-border-tertiary, rgba(255,255,255,0.10));
  }
  .msg-contact { display: flex; flex-direction: column; align-items: center; text-align: center; }
  .msg-contact-avatar { width: 50px; height: 50px; margin-bottom: 5px; border-radius: 50%; object-fit: cover; object-position: center 18%; }
  .msg-header-title { font-size: 11px; font-weight: 650; letter-spacing: 0.08em; color: var(--color-text-primary, #f2f2f5); }
  .msg-header-sub { display: flex; align-items: center; gap: 5px; margin-top: 3px; font-size: 9px; letter-spacing: 0.08em; color: var(--color-text-tertiary, #6f7380); }
  .msg-online-dot { width: 6px; height: 6px; border-radius: 50%; background: #34c759; box-shadow: 0 0 7px rgba(52,199,89,0.85); }
  .msg-close {
    position: absolute; top: 12px; right: 12px; width: 26px; height: 26px; border-radius: 50%; border: none; background: transparent;
    color: var(--color-text-tertiary, #6f7380); cursor: pointer; font-size: 15px;
    display: flex; align-items: center; justify-content: center; transition: background 0.15s;
  }
  .msg-close:hover { background: var(--color-background-secondary, #1a1a22); color: var(--color-text-primary, #f2f2f5); }

  .msg-body {
    flex: 1; min-height: 0; overflow-y: auto; padding: 12px 14px; display: flex; flex-direction: column; gap: 2px;
    background: #fff;
  }
  .msg-body::-webkit-scrollbar { width: 5px; }
  .msg-body::-webkit-scrollbar-track { background: #f3eff1; }
  .msg-body::-webkit-scrollbar-thumb { background: #cf9caf; border-radius: 0; }

  .msg-row { display: flex; margin-top: 10px; max-width: 86%; }
  .msg-row.right { align-self: flex-end; }
  .msg-row.follow { margin-top: 3px; }

  .msg-col { display: flex; flex-direction: column; min-width: 0; }
  .msg-row.right .msg-col { align-items: flex-end; }
  .msg-bubble-wrap { display: block; }
  .msg-bubble {
    position: relative; font-size: 13px; line-height: 1.5; padding: 8px 12px; border-radius: 18px;
    color: #25262b; word-break: keep-all; overflow-wrap: anywhere;
  }
  .msg-time { margin-top: 4px; padding: 0 4px; font-size: 9px; color: var(--color-text-tertiary, #6f7380); }
  .msg-row.right .msg-time { text-align: right; }

  .msg-row.eden .msg-bubble { background: #e7e4e6; }
  .msg-row.lilith .msg-bubble { background: #edc8d6; color: #493b41; }
  .msg-row.group-end .msg-bubble::before {
    display: none;
  }
  .msg-row.group-end .msg-bubble::after { display: none; }
  .msg-row.lilith.group-end .msg-bubble::before {
    right: -6px; left: auto; background: transparent;
    border-right: 0; border-left: 7px solid #edc8d6;
  }

  .msg-divider { display: flex; align-items: center; gap: 8px; margin: 14px 0 6px; }
  .msg-divider::before, .msg-divider::after { content: ''; flex: 1; height: 0.5px; background: var(--color-border-tertiary, rgba(255,255,255,0.10)); }
  .msg-divider span { font-size: 10px; color: var(--color-text-tertiary, #6f7380); white-space: nowrap; }

  .msg-footer {
    flex-shrink: 0; display: flex; align-items: center; gap: 8px;
    padding: 10px 12px; border-top: 0.5px solid var(--color-border-tertiary, rgba(255,255,255,0.10));
  }
  .msg-footer-icon {
    width: 26px; height: 26px; border-radius: 50%; border: none; background: transparent;
    color: #c87f9b; font-size: 15px; cursor: pointer; flex-shrink: 0;
    display: flex; align-items: center; justify-content: center;
  }
  .msg-input {
    flex: 1; min-width: 0; background: var(--color-background-secondary, #1a1a22);
    border: 0.5px solid var(--color-border-tertiary, rgba(255,255,255,0.10)); border-radius: 999px;
    padding: 7px 14px; font-size: 12px; color: var(--color-text-tertiary, #6f7380);
    font-family: inherit; cursor: default;
  }
  .msg-send {
    width: 30px; height: 30px; padding: 0; border-radius: 50%; border: none; flex-shrink: 0; cursor: pointer;
    background: #cf8da6; color: #fff;
    display: flex; align-items: center; justify-content: center; font-size: 13px; transition: background 0.15s;
  }
  .msg-send-icon { display: block; width: 16px; height: 16px; }
  .msg-send:hover { background: #bd7893; }

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
  body > .arch-messenger-root .msg-header,
  body > .arch-messenger-root .msg-footer { background: #fff; }
  body > .arch-messenger-root .msg-row.eden .msg-bubble { background: #e7e4e6; color: #25262b; }
  body > .arch-messenger-root .msg-row.lilith .msg-bubble { background: #edc8d6; color: #493b41; }
  body > .arch-messenger-root .msg-row.lilith.group-end .msg-bubble::before { display: none; }
  html[data-theme="light"] body > .arch-messenger-root > .msg-panel { border-color: #fff #777477 #777477 #fff; background: #d4d2d3; box-shadow: inset -1px -1px 0 #aaa7a9, 2px 2px 0 rgba(57,55,58,.12); }
  html[data-theme="light"] .msg-windowbar { border-color: #d4b4bf; background: #edc8d6; color: #65515a; }
  html[data-theme="light"] .msg-window-button { border-color: #fff #817b7e #817b7e #fff; background: #d4d2d3; color: #696368; }
  html[data-theme="light"] .msg-toast {
    background: rgba(255,255,255,0.96);
    border-color: rgba(25,30,40,0.12);
    color: #555b66;
    box-shadow: 0 3px 10px rgba(25,30,40,0.1);
  }
  #sidebar-messenger .arch-messenger-root { position: relative; width: 100%; height: 100%; }
  #sidebar-messenger .msg-fab {
    position: absolute; inset: 0; width: 100%; height: 100%; border: 0; border-radius: 0;
    display: flex; align-items: center; justify-content: center; padding: 8px 36px 9px;
    opacity: 1; pointer-events: auto; box-shadow: none; background: transparent;
  }
  #sidebar-messenger .msg-fab:hover { transform: none; background: rgba(255,255,255,.035); }
  #sidebar-messenger .msg-preview-copy { display: flex; flex-direction: column; align-items: center; text-align: center; }
  #sidebar-messenger .msg-preview-avatar { width: 42px; height: 42px; margin-bottom: 5px; border-radius: 50%; object-fit: cover; object-position: top; }
  #sidebar-messenger .msg-preview-title { color: #f4f5f8; font-size: 11px; font-weight: 650; letter-spacing: .08em; }
  #sidebar-messenger .msg-preview-line { display: flex; align-items: center; gap: 5px; margin-top: 3px; color: #aeb4c2; font-size: 9px; letter-spacing: .08em; }
  #sidebar-messenger .msg-preview-status { width: 6px; height: 6px; border-radius: 50%; background: #34c759; box-shadow: 0 0 7px rgba(52,199,89,.85); }
  #sidebar-messenger .msg-panel {
    position: relative; inset: auto; width: 100%; height: 100%;
    border: 0; border-radius: 0; box-shadow: none;
    opacity: 0; transform: none; pointer-events: none;
    color: #f4f5f8; background: #181a22;
  }
  #sidebar-messenger .msg-panel.open { opacity: 1; transform: none; pointer-events: auto; }
  #sidebar-messenger .msg-header { min-height: 76px; padding: 8px 36px 9px; }
  #sidebar-messenger .msg-contact-avatar { width: 34px; height: 34px; margin-bottom: 3px; }
  #sidebar-messenger .msg-close { display: none; }
  #sidebar-messenger .msg-body { padding: 11px; }
  #sidebar-messenger .msg-row { max-width: 88%; margin-top: 7px; }
  #sidebar-messenger .msg-header-title { color: #f4f5f8; font-size: 12px; }
  #sidebar-messenger .msg-header-sub,
  #sidebar-messenger .msg-time { color: #aeb4c2; }
  #sidebar-messenger .msg-bubble { padding: 7px 10px; color: #f4f5f8; font-size: 12px; line-height: 1.55; }
  #sidebar-messenger .msg-row.eden .msg-bubble { background: #272a35; }
  #sidebar-messenger .msg-row.lilith .msg-bubble { background: #0a84ff; color: #fff; }
  #sidebar-messenger .msg-footer { padding: 8px 9px; gap: 5px; }
  #sidebar-messenger .msg-footer-icon { width: 22px; height: 22px; }
  #sidebar-messenger .msg-input { padding: 6px 10px; font-size: 10px; }
  #sidebar-messenger .msg-send { width: 26px; height: 26px; }
  html[data-theme="light"] #sidebar-messenger .msg-panel { color: #20232a; background: #fff; }
  html[data-theme="light"] #sidebar-messenger .msg-fab:hover { background: rgba(25,30,40,.035); }
  html[data-theme="light"] #sidebar-messenger .msg-preview-title { color: #20232a; }
  html[data-theme="light"] #sidebar-messenger .msg-preview-line { color: #707783; }
  html[data-theme="light"] #sidebar-messenger .msg-header-title { color: #20232a; }
  html[data-theme="light"] #sidebar-messenger .msg-header-sub,
  html[data-theme="light"] #sidebar-messenger .msg-time { color: #707783; }
  html[data-theme="light"] #sidebar-messenger .msg-bubble { color: #20232a; }
  html[data-theme="light"] #sidebar-messenger .msg-row.eden .msg-bubble { background: #edf0f5; }
  html[data-theme="light"] #sidebar-messenger .msg-row.lilith .msg-bubble { background: #edc8d6; color: #493b41; }
  `;
  document.head.appendChild(style);

  var AVA = {
    eden: 'img/wiki/Eden_1.jpg',
    lilith: 'img/wiki/Lilith_1.jpg'
  };
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
  fab.type = 'button';
  fab.className = 'msg-fab';
  fab.setAttribute('aria-label', '메신저 열기');
  fab.innerHTML = '<i class="ti ti-message-circle-2" aria-hidden="true"></i><span class="dot"></span>';
  wrap.appendChild(fab);

  var panel = document.createElement('div');
  panel.className = 'msg-panel';

  var rowsHtml = '';
  var prevWho = null;
  log.forEach(function (m, index) {
    if (m.divider) {
      rowsHtml += '<div class="msg-divider"><span>' + m.divider + '</span></div>';
      prevWho = null; // 구분선 다음엔 항상 아바타/이름 다시 표시
      return;
    }
    var follow = m.who === prevWho;
    var alignClass = m.who === 'lilith' ? ' right' : '';
    var next = log[index + 1];
    var showTime = !next || next.divider || next.who !== m.who;
    rowsHtml += '<div class="msg-row ' + m.who + alignClass + (follow ? ' follow' : '') + (showTime ? ' group-end' : '') + '">' +
      '<div class="msg-col"><div class="msg-bubble-wrap"><div class="msg-bubble">' + m.text + '</div>' +
      (showTime ? '<div class="msg-time">' + m.time + '</div>' : '') + '</div></div></div>';
    prevWho = m.who;
  });

  panel.innerHTML =
    '<div class="msg-windowbar"><span>✉ SNS · AGENT EDEN</span><span class="msg-window-controls"><span class="msg-window-button">−</span><button class="msg-window-button msg-window-toggle" type="button" aria-label="SNS 펼치기" aria-expanded="false">□</button><span class="msg-window-button">×</span></span></div>' +
    '<div class="msg-header">' +
      '<div class="msg-contact"><img class="msg-contact-avatar" src="' + AVA.eden + '" alt="Eden">' +
      '<div class="msg-header-title">AGENT EDEN</div>' +
      '<div class="msg-header-sub"><span class="msg-online-dot"></span>ONLINE</div></div>' +
      '<button class="msg-close" aria-label="닫기"><i class="ti ti-x"></i></button>' +
    '</div>' +
    '<div class="msg-body">' + rowsHtml + '</div>' +
    '<div class="msg-footer">' +
      '<button class="msg-footer-icon" aria-label="사진"><i class="ti ti-photo"></i></button>' +
      '<input class="msg-input" placeholder="메시지 입력" readonly>' +
      '<button class="msg-send" aria-label="전송"><svg class="msg-send-icon" viewBox="0 0 24 24" aria-hidden="true"><path fill="currentColor" d="M12 4l-7 7h4v8h6v-8h4z"/></svg></button>' +
    '</div>' +
    '<div class="msg-toast">저장된 대화 로그입니다</div>';

  wrap.appendChild(panel);

  var embeddedHost = document.getElementById('sidebar-messenger');
  var portalDocument = document;
  if (embeddedHost && window.parent !== window) {
    try {
      var staleRoot = window.parent.document.querySelector('.arch-messenger-root');
      if (staleRoot) staleRoot.remove();
    } catch (_) {}
  }
  if (!embeddedHost && window.parent !== window) {
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
  (embeddedHost || portalDocument.body).appendChild(wrap);
  if (embeddedHost) {
    fab.innerHTML = '<span class="msg-preview-copy"><img class="msg-preview-avatar" src="' + AVA.eden + '" alt="Eden"><span class="msg-preview-title">AGENT EDEN</span><span class="msg-preview-line"><span class="msg-preview-status"></span>ONLINE</span></span>';
  }

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
  var windowToggle = panel.querySelector('.msg-window-toggle');
  var windowBar = panel.querySelector('.msg-windowbar');
  var toast = panel.querySelector('.msg-toast');
  var toastTimer = null;
  var windowDrag = null;
  var dockedToPlayer = portalDocument !== document;

  function dockBelowPlayer() {
    if (!dockedToPlayer) return;
    var playerWindow = portalDocument.querySelector('.playlist-window');
    if (!playerWindow) return;
    var rect = playerWindow.getBoundingClientRect();
    var gap = 12;
    var left = Math.max(6, Math.min(portalDocument.documentElement.clientWidth - wrap.offsetWidth - 6, rect.left));
    var top = Math.min(portalDocument.documentElement.clientHeight - wrap.offsetHeight - 42, rect.bottom + gap);
    wrap.style.left = left + 'px';
    wrap.style.top = Math.max(6, top) + 'px';
    wrap.style.right = 'auto';
    wrap.style.bottom = 'auto';
  }
  dockBelowPlayer();
  if (dockedToPlayer) {
    var playerWindow = portalDocument.querySelector('.playlist-window');
    if (playerWindow && portalDocument.defaultView.MutationObserver) {
      new portalDocument.defaultView.MutationObserver(dockBelowPlayer).observe(playerWindow, { attributes: true, attributeFilter: ['style'] });
    }
    portalDocument.defaultView.addEventListener('resize', dockBelowPlayer);
  }

  windowBar.addEventListener('pointerdown', function (event) {
    if (event.button !== 0 || event.target.closest('button')) return;
    var rect = wrap.getBoundingClientRect();
    windowDrag = { x: event.clientX, y: event.clientY, left: rect.left, top: rect.top };
    wrap.style.left = rect.left + 'px'; wrap.style.top = rect.top + 'px';
    wrap.style.right = 'auto'; wrap.style.bottom = 'auto';
    dockedToPlayer = false;
    windowBar.classList.add('dragging'); windowBar.setPointerCapture(event.pointerId);
  });
  windowBar.addEventListener('pointermove', function (event) {
    if (!windowDrag) return;
    wrap.style.left = Math.max(0, Math.min(window.innerWidth - wrap.offsetWidth, windowDrag.left + event.clientX - windowDrag.x)) + 'px';
    wrap.style.top = Math.max(0, Math.min(window.innerHeight - wrap.offsetHeight, windowDrag.top + event.clientY - windowDrag.y)) + 'px';
  });
  function stopWindowDrag(event) {
    if (!windowDrag) return;
    windowDrag = null; windowBar.classList.remove('dragging');
    if (windowBar.hasPointerCapture(event.pointerId)) windowBar.releasePointerCapture(event.pointerId);
  }
  windowBar.addEventListener('pointerup', stopWindowDrag);
  windowBar.addEventListener('pointercancel', stopWindowDrag);

  function openPanel() {
    if (embeddedHost) embeddedHost.classList.add('expanded');
    panel.classList.add('open');
    windowToggle.setAttribute('aria-expanded', 'true');
    windowToggle.setAttribute('aria-label', 'SNS 접기');
    body.scrollTop = body.scrollHeight;
  }
  function closePanel() {
    panel.classList.remove('open');
    windowToggle.setAttribute('aria-expanded', 'false');
    windowToggle.setAttribute('aria-label', 'SNS 펼치기');
    if (embeddedHost) embeddedHost.classList.remove('expanded');
  }

  fab.addEventListener('click', function () { openPanel(); });
  windowToggle.addEventListener('click', function () { panel.classList.contains('open') ? closePanel() : openPanel(); });
  if (embeddedHost) {
    embeddedHost.addEventListener('click', function (event) {
      if (!embeddedHost.classList.contains('expanded') && !event.target.closest('.msg-panel')) {
        openPanel();
      }
    });
  }
  panel.querySelector('.msg-close').addEventListener('click', closePanel);
  panel.querySelector('.msg-send').addEventListener('click', function () {
    toast.classList.add('show');
    clearTimeout(toastTimer);
    toastTimer = setTimeout(function () { toast.classList.remove('show'); }, 1600);
  });

  var FAB_SIZE = 40, GAP_SIDE = 20, GAP_PANEL = 12;
  function reposition() {
    if (embeddedHost) return;
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
    requestAnimationFrame(function () {
      fab.classList.add('ready');
      if (embeddedHost) openPanel();
    });
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
