const jsonHeaders = { 'Content-Type': 'application/json; charset=utf-8', 'X-Content-Type-Options': 'nosniff' };
const allowedTypes = new Set(['image/jpeg', 'image/png', 'image/webp', 'image/gif']);

export default {
  async fetch(request, env) {
    const url = new URL(request.url);
    const origin = request.headers.get('Origin');
    const cors = corsHeaders(origin, env.ALLOWED_ORIGIN);
    if (request.method === 'OPTIONS') return new Response(null, { status: 204, headers: cors });

    try {
      if (request.method === 'GET' && url.pathname === '/api/logs') return withCors(await listMeta(env.CONTENT, 'logs/meta/'), cors);
      if (request.method === 'GET' && url.pathname.startsWith('/api/logs/')) return withCors(await getMeta(env.CONTENT, 'logs/meta/' + safeId(url.pathname.slice(10)) + '.json'), cors);
      if (request.method === 'GET' && url.pathname === '/api/gallery') return withCors(await listMeta(env.CONTENT, 'gallery/meta/'), cors);
      if (request.method === 'GET' && url.pathname.startsWith('/media/')) return withCors(await getMedia(env.CONTENT, decodeURIComponent(url.pathname.slice(7))), cors);

      if (request.method === 'POST' && url.pathname === '/api/admin/logs') {
        await authorize(request, env.UPLOAD_TOKEN);
        return withCors(await uploadLog(request, env.CONTENT), cors);
      }
      if (request.method === 'POST' && url.pathname === '/api/admin/gallery') {
        await authorize(request, env.UPLOAD_TOKEN);
        return withCors(await uploadGallery(request, env.CONTENT), cors);
      }
      return withCors(responseJson({ error: 'Not found' }, 404), cors);
    } catch (error) {
      console.error(JSON.stringify({ event: 'request_error', path: url.pathname, message: error instanceof Error ? error.message : String(error) }));
      const status = error.status || 500;
      return withCors(responseJson({ error: status === 500 ? 'Server error' : error.message }, status), cors);
    }
  }
};

function corsHeaders(origin, allowedOrigin) {
  const allowed = origin === allowedOrigin || /^http:\/\/(127\.0\.0\.1|localhost)(:\d+)?$/.test(origin || '');
  return {
    'Access-Control-Allow-Origin': allowed ? origin : allowedOrigin,
    'Access-Control-Allow-Methods': 'GET,POST,OPTIONS',
    'Access-Control-Allow-Headers': 'Authorization,Content-Type',
    'Access-Control-Max-Age': '86400',
    'Vary': 'Origin'
  };
}
function withCors(response, cors) { const copy = new Response(response.body, response); Object.entries(cors).forEach(([k,v]) => copy.headers.set(k,v)); return copy; }
function responseJson(value, status = 200) { return new Response(JSON.stringify(value), { status, headers: jsonHeaders }); }
function fail(message, status) { const error = new Error(message); error.status = status; throw error; }
function safeId(value) { if (!/^[a-zA-Z0-9-]+$/.test(value || '')) fail('Invalid id', 400); return value; }
function clean(value, max, required = true) { const result = String(value || '').trim(); if (required && !result) fail('필수 항목을 확인해줘.', 400); if (result.length > max) fail('입력 내용이 너무 길어.', 400); return result; }
async function authorize(request, token) {
  if (!token) fail('업로드 비밀값이 설정되지 않았어.', 500);
  const encoder = new TextEncoder();
  const provided = request.headers.get('Authorization') || '';
  const expected = 'Bearer ' + token;
  const [providedHash, expectedHash] = await Promise.all([
    crypto.subtle.digest('SHA-256', encoder.encode(provided)),
    crypto.subtle.digest('SHA-256', encoder.encode(expected))
  ]);
  if (!crypto.subtle.timingSafeEqual(providedHash, expectedHash)) fail('업로드 토큰이 맞지 않아.', 401);
}
function validateImage(image) { if (!image || typeof image.stream !== 'function' || !image.size) fail('이미지를 선택해줘.', 400); if (!allowedTypes.has(image.type)) fail('지원하지 않는 이미지 형식이야.', 400); if (image.size > 15 * 1024 * 1024) fail('이미지는 15MB 이하여야 해.', 413); }
function extension(type) { return ({'image/jpeg':'jpg','image/png':'png','image/webp':'webp','image/gif':'gif'})[type]; }

async function listMeta(bucket, prefix) {
  const listed = await bucket.list({ prefix });
  const items = await Promise.all(listed.objects.filter(o => o.key.endsWith('.json')).map(async o => JSON.parse(await (await bucket.get(o.key)).text())));
  items.sort((a,b) => String(b.createdAt).localeCompare(String(a.createdAt)));
  return responseJson(items);
}
async function getMeta(bucket, key) { const object = await bucket.get(key); if (!object) return responseJson({ error: 'Not found' }, 404); return new Response(object.body, { headers: jsonHeaders }); }
async function getMedia(bucket, key) { if (!/^(logs|gallery)\/images\/[a-zA-Z0-9.-]+$/.test(key)) return responseJson({ error: 'Not found' }, 404); const object = await bucket.get(key); if (!object) return responseJson({ error: 'Not found' }, 404); const headers = new Headers(); object.writeHttpMetadata(headers); headers.set('ETag', object.httpEtag); headers.set('Cache-Control', 'public, max-age=31536000, immutable'); headers.set('X-Content-Type-Options', 'nosniff'); return new Response(object.body, { headers }); }

async function uploadLog(request, bucket) {
  const form = await request.formData(), image = form.get('image'); validateImage(image);
  const id = crypto.randomUUID(), imageKey = `logs/images/${id}.${extension(image.type)}`;
  const item = { id, title: clean(form.get('title'),120), date: clean(form.get('date'),20), preview: clean(form.get('preview'),600), quote: clean(form.get('quote'),240,false), body: clean(form.get('body'),100000), imagePath: '/media/' + imageKey, createdAt: new Date().toISOString() };
  await bucket.put(imageKey, image.stream(), { httpMetadata: { contentType: image.type } });
  await bucket.put(`logs/meta/${id}.json`, JSON.stringify(item), { httpMetadata: { contentType: 'application/json; charset=utf-8' } });
  return responseJson(item, 201);
}
async function uploadGallery(request, bucket) {
  const form = await request.formData(), image = form.get('image'); validateImage(image);
  const id = crypto.randomUUID(), imageKey = `gallery/images/${id}.${extension(image.type)}`;
  const title = clean(form.get('title'),120);
  const item = { id, title, song: title, lyrics: clean(form.get('lyrics'),500,false), imagePath: '/media/' + imageKey, createdAt: new Date().toISOString() };
  await bucket.put(imageKey, image.stream(), { httpMetadata: { contentType: image.type } });
  await bucket.put(`gallery/meta/${id}.json`, JSON.stringify(item), { httpMetadata: { contentType: 'application/json; charset=utf-8' } });
  return responseJson(item, 201);
}
