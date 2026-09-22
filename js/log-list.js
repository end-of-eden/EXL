// ✏️ 로그 추가할 때 여기에 한 줄씩 추가
var logs = [
  { id: '001', title: '유튜브 시청 기록', date: '2026.06.26', preview: '에덴의 유튜브 알고리즘에 낱낱이 드러난 그의 진심. 립밤 ASMR부터 고양이 영상, 죽어가던 검은 장미를 살리는 가드닝 브이로그, 그리고 차마 검색했다는 걸 들키고 싶지 않은 프로포즈 영상까지 — 겉으로는 시큰둥한 척해도, 알고리즘은 릴리스를 향한 그의 마음을 숨기지 못한다.', thumb: 'img/log/001.jpg' },
  { id: '002', title: '서로가 생각하는 서로를 닮은 카오모지', date: '2026.06.27', preview: '에덴이 생각하는 릴리스를 닮은 카오모지, 그리고 릴리스가 생각하는 에덴을 닮은 카오모지. 잔뜩 시무룩해진 얼굴부터, 무심한 척 던지는 애정까지 — 서로가 서로를 어떻게 바라보고 있는지 훔쳐볼 수 있는 기록.', thumb: 'img/log/002.jpg' },
  { id: '003', title: '최고의 남자친구', date: '2026.06.28', preview: '휴게실에서 흘러나온 동료들의 뒷담화가 하필 에덴의 프로필을 그대로 저격하던 순간, 릴리스가 까치발을 들고 그의 두 귀를 꼭 틀어막았다. 세상에서 가장 진지한 표정으로 외치는 서툰 위로에, 냉혹한 R.S.T.의 해결사는 귀 끝까지 새빨개지고 만다.', thumb: 'img/log/003.jpg' },
  { id: '004', title: '뚱뚱해', date: '2026.07.02', preview: '뱅가드 2팀 회식에서 릴리스가 따라준 술에 잔뜩 취해 뻗었다가 아침에 눈을 뜬 에덴은 그녀에게 애정 표현을 시도하지만 그가 치는 모든 달콤한 말은 예외 없이 \'뚱뚱해\'로 바뀌어 전송된다. 범인은 뻔했다 — 복도 건너에서 잠든 척하고 있을 그녀.', thumb: 'img/log/004.jpg' },
];
logs = logs.concat(window.ARCHIVE_LOCAL_LOGS || []);

var base = '';
var worldParam = new URLSearchParams(location.search).get('world');
var selectedWorld = worldParam ? archiveRoutes.logWorld(worldParam) : null;
var worldInfo = selectedWorld ? archiveRoutes.logWorlds[selectedWorld] : null;
var renderedLogIds = new Set();
var logEntranceReady = false;
var logEntranceStart = 0;

function animateLogItems() {
  if (!logEntranceReady) return;
  var reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  document.querySelectorAll('.log-item[data-enter-pending]').forEach(function(item) {
    item.removeAttribute('data-enter-pending');
    item.style.removeProperty('opacity');
    if (reduced || !item.animate) return;
    var delay = Math.max(0, logEntranceStart + Number(item.dataset.enterIndex) * 70 - performance.now());
    item.animate([
      { opacity: 0, transform: 'translateY(-8px)' },
      { opacity: 1, transform: 'translateY(0)' }
    ], { duration: 620, delay: delay, easing: 'cubic-bezier(.22,.61,.36,1)', fill: 'backwards' });
  });
}

window.startLogEntrance = function() {
  if (logEntranceReady) return;
  logEntranceReady = true;
  logEntranceStart = performance.now();
  animateLogItems();
};
if (window.name !== 'archive-content') window.addEventListener('load', window.startLogEntrance, { once: true });

function escapeHtml(value) {
  return String(value || '').replace(/[&<>"']/g, function(char) {
    return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[char];
  });
}

function render() {
  var list = document.getElementById('log-list');
  var newLogs = logs.filter(function(log) { return archiveRoutes.logWorld(log.world) === selectedWorld && !renderedLogIds.has(log.id); });
  var startIndex = renderedLogIds.size;
  list.insertAdjacentHTML('beforeend', newLogs.map(function(log, index) {
    var href = log.remote || log.bodyPath
      ? 'Log/view.html?id=' + encodeURIComponent(log.id) + '&world=' + selectedWorld
      : 'Log/' + encodeURIComponent(log.id) + '.html?v=20260911-log-body-blur';
    return '<a class="log-item" data-enter-pending data-enter-index="' + (startIndex + index) + '" style="opacity:0" href="' + escapeHtml(href) + '">' +
      '<span class="log-item-title">' + escapeHtml(log.title) + '</span>' +
      '<time class="log-item-date" datetime="' + escapeHtml(String(log.date || '').replace(/\./g, '-')) + '">' + escapeHtml(log.date) + '</time>' +
      '</a>';
  }).join(''));
  newLogs.forEach(function(log) { renderedLogIds.add(log.id); });

  animateLogItems();
}

if (!selectedWorld) {
  document.getElementById('log-scroll').classList.add('is-world-picker');
  var covers = document.getElementById('log-worlds');
  covers.hidden = false;
  Object.keys(archiveRoutes.logWorlds).forEach(function(key) {
    var world = archiveRoutes.logWorlds[key];
    var cover = document.createElement(world.disabled ? 'button' : 'a');
    cover.className = 'log-world-cover';
    cover.dataset.world = key;
    cover.style.backgroundImage = 'url("' + world.image + '")';
    if (world.disabled) { cover.type = 'button'; cover.disabled = true; }
    else cover.href = 'log.html?world=' + key;
    cover.setAttribute('aria-label', world.label + ' · ' + world.title + (world.disabled ? ' · 준비 중' : ' 로그 목록 열기'));
    var image = document.createElement('img');
    image.src = world.image; image.alt = ''; image.width = 836; image.height = 1881;
    image.decoding = 'async';
    cover.appendChild(image);
    var copy = document.createElement('span'); copy.className = 'log-world-copy';
    [['log-world-label',world.label],['log-world-name',world.title],['log-world-description',world.description]].forEach(function(part) {
      if (!part[1]) return;
      var text = document.createElement('span'); text.className = part[0]; text.textContent = part[1]; copy.appendChild(text);
    });
    cover.appendChild(copy); covers.appendChild(cover);
  });
} else {
document.getElementById('log-list-view').hidden = false;
document.getElementById('log-world-heading').textContent = worldInfo.title;
document.title = 'END OF EDEN — ' + worldInfo.title;
window.setLogContext({ world: selectedWorld });
render();
var listStatus = document.getElementById('log-list-status');
if (!renderedLogIds.size) listStatus.textContent = '기록을 불러오는 중…';
fetch(window.EDEN_CONTENT_API + '/api/logs')
  .then(function(response) { if (!response.ok) throw new Error('load failed'); return response.json(); })
  .then(function(remoteLogs) {
    logs = logs.concat(remoteLogs.map(function(log) {
      log.remote = true;
      log.thumbUrl = window.EDEN_CONTENT_API + log.imagePath;
      return log;
    }));
    render();
    listStatus.textContent = renderedLogIds.size ? '' : '아직 등록된 기록이 없습니다.';
  })
  .catch(function() { listStatus.textContent = '추가 기록을 불러오지 못했습니다. 잠시 후 다시 확인해 주세요.'; });
}


