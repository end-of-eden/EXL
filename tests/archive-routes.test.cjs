const assert = require('node:assert/strict');
const { readFileSync } = require('node:fs');
const { test } = require('node:test');
const { runInNewContext } = require('node:vm');
const context = { window: {}, URL, location: { href: 'https://assured.love/' } };
runInNewContext(readFileSync(require('node:path').join(__dirname, '../js/archive-routes.js'), 'utf8'), context);
const routes = context.window.archiveRoutes;

test('cover and world list routes survive reloads', () => {
  for (const [route, hash] of [
    ['log.html', '#log'],
    ['log.html?world=arch', '#log/world/arch'],
    ['log.html?world=parallel-i', '#log/world/parallel-i'],
  ]) {
    assert.equal(routes.hash(route), hash);
    assert.equal(routes.read('https://assured.love/' + hash), route);
  }
});
test('existing static and R2 log links keep their addresses', () => {
  for (const id of ['001', '002', '003', '004', '005', 'new-record-id']) {
    const route = /^00[1-4]$/.test(id) ? `Log/${id}.html` : `Log/view.html?id=${id}`;
    assert.equal(routes.read(`https://assured.love/#log/${id}`), route);
    assert.equal(routes.hash(route), `#log/${id}`);
  }
});
test('parallel log details preserve the world in shareable URLs', () => {
  const route = 'Log/view.html?id=parallel-record&world=parallel-i';
  const hash = '#log/world/parallel-i/parallel-record';
  assert.equal(routes.hash(route), hash);
  assert.equal(routes.read('https://assured.love/' + hash), route);
});
test('legacy log data belongs to ARCH; the unfinished world stays disabled', () => {
  assert.equal(routes.logWorld(undefined), 'arch');
  assert.equal(routes.logWorld('arch'), 'arch');
  assert.equal(routes.logWorld('parallel-i'), 'parallel-i');
  assert.equal(routes.logWorlds['parallel-ii'].disabled, true);
  assert.equal(routes.read('https://assured.love/#log/world/parallel-ii'), 'main.html');
});
test('malformed links do not break navigation and old page links still resolve', () => {
  assert.equal(routes.read('https://assured.love/#log/%E0%A4%A'), 'log.html');
  assert.equal(routes.read('https://assured.love/#log/world/parallel-i/%E0%A4%A'), 'log.html');
  assert.equal(routes.read('https://assured.love/?page=Log%2F003.html'), 'Log/003.html');
  assert.equal(routes.read('https://assured.love/#eden'), 'wiki.html?char=eden');
});
