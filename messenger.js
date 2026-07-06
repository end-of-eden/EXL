(function () {
  var style = document.createElement('style');
  style.textContent = `
  .msg-fab {
    position: fixed; bottom: 24px; right: 24px; z-index: 9998;
    width: 52px; height: 52px; border-radius: 50%;
    background: var(--color-background-secondary, #1a1a22);
    border: 0.5px solid var(--color-border-secondary, rgba(255,255,255,0.16));
    box-shadow: 0 6px 20px rgba(0,0,0,0.45);
    display: flex; align-items: center; justify-content: center;
    cursor: pointer; color: var(--color-text-primary, #f2f2f5); font-size: 22px;
    transition: transform 0.15s, background 0.15s;
  }
  .msg-fab:hover { transform: scale(1.06); background: var(--color-background-tertiary, #22222c); }
  .msg-fab .dot {
    position: absolute; top: 6px; right: 6px; width: 8px; height: 8px; border-radius: 50%;
    background: #f2a8c4; box-shadow: 0 0 0 2px var(--color-background-secondary, #1a1a22);
    animation: msgPulse 2s infinite;
  }
  @keyframes msgPulse { 0%,100% { opacity: 1; } 50% { opacity: 0.35; } }

  .msg-panel {
    position: fixed; bottom: 88px; right: 24px; z-index: 9999;
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

  .msg-row.eden .msg-name { color: #7cc9e8; }
  .msg-row.eden .msg-bubble { background: rgba(124,201,232,0.13); border: 0.5px solid rgba(124,201,232,0.28); border-bottom-left-radius: 4px; }
  .msg-row.lilith .msg-name { color: #f2a8c4; }
  .msg-row.lilith .msg-bubble { background: rgba(242,168,196,0.14); border: 0.5px solid rgba(242,168,196,0.30); border-bottom-right-radius: 4px; }

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
  `;
  document.head.appendChild(style);

  var AVA = {
    eden: 'https://raw.githubusercontent.com/end-of-eden/EXL/main/img/wiki/Eden_1.jpg',
    lilith: 'https://raw.githubusercontent.com/end-of-eden/EXL/main/img/wiki/Lilith_1.jpg'
  };
  var NAME = { eden: 'Eden', lilith: 'Lilith' };

  var log = [
    { who: 'eden', text: '아직 안 자?', time: '23:14' },
    { who: 'lilith', text: '몰라도 돼.', time: '23:15' },
    { who: 'eden', text: '담배 다 떨어졌는데', time: '23:16' },
    { who: 'lilith', text: '그래서 뭐, 나보고 사다 달라고?', time: '23:16' },
    { who: 'lilith', text: '편의점 앞에서 기다려.', time: '23:17' },
    { who: 'eden', text: '...알았어', time: '23:17' },
    { who: 'eden', text: '근데 안 와도 되는데', time: '23:18' },
    { who: 'lilith', text: '이미 나왔어.', time: '23:19' }
  ];

  var wrap = document.createElement('div');

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
  document.body.appendChild(wrap);

  var body = panel.querySelector('.msg-body');
  var toast = panel.querySelector('.msg-toast');
  var toastTimer = null;

  function openPanel() {
    panel.classList.add('open');
    body.scrollTop = body.scrollHeight;
  }
  function closePanel() { panel.classList.remove('open'); }

  fab.addEventListener('click', function () {
    panel.classList.contains('open') ? closePanel() : openPanel();
  });
  panel.querySelector('.msg-close').addEventListener('click', closePanel);
  panel.querySelector('.msg-send').addEventListener('click', function () {
    toast.classList.add('show');
    clearTimeout(toastTimer);
    toastTimer = setTimeout(function () { toast.classList.remove('show'); }, 1600);
  });

  // 넓은 화면에서 버튼이 카드와 멀리 떨어지지 않도록, 카드(위키/갤러리/로그 wrap) 모서리에 붙여서 위치 계산
  function reposition() {
    var host = document.querySelector('.wiki-wrap, .gallery-wrap, .log-wrap');
    if (!host) return;
    var r = host.getBoundingClientRect();
    var right = Math.max(12, window.innerWidth - r.right + 4);
    var bottom = Math.max(12, window.innerHeight - r.bottom + 4);
    fab.style.right = right + 'px';
    fab.style.bottom = bottom + 'px';
    panel.style.right = right + 'px';
    panel.style.bottom = (bottom + 64) + 'px';
  }
  window.addEventListener('resize', reposition);
  window.addEventListener('scroll', reposition, { passive: true });
  reposition();
})();
