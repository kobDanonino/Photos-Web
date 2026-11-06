const http = require('http');
const { Readable } = require('stream');
const crypto = require('crypto');

const DATA = {"tetas":["jl76up.jpg","8nkq83.jpg","urh2of.jpg","h22p1a.jpg","dhcgo9.jpg","pa8rgg.jpg","qnvp4y.jpg","3gcxfy.jpg","fo2mt7.jpg","hjhsl8.jpg","u1o9pf.jpg","7rgxw7.jpg","67vgin.jpg","3i737s.jpg","svfbd9.jpg","r7002l.jpg","de0jag.jpg","y5w63e.jpg","xa45o8.jpg","wwtmxu.jpg","9a3v74.jpg","tfvlvb.jpg","zat3ec.jpg","96kome.jpg","a0na12.mp4","n5fh2u.mp4","4lethn.mp4","nea151.mp4","y5bz23.mp4","e26ilk.mp4","wlcdh0.mp4"],"gay":["3vhb15.jpg","yxo0vo.jpg","5vgzcc.jpg","4dsvl2.jpg","mbnhhn.jpg","vn03e1.jpg","azshoc.jpg","y3bxt9.jpg","am4rsz.jpg","ua4sy4.jpg","grq6pr.jpg","v2u0hu.jpg","f1s0wz.jpg","ecu7dv.jpg","dhlyqo.jpg","5bq86i.jpg","xkgxpu.jpg","xrpc8k.jpg","5h8lqc.jpg","9zjmzf.jpg","e3uord.jpg","u34msg.jpg","bwg6bx.jpg","s5i1uq.jpg","rlzxbe.jpg","qgvqs0.jpg","ibcqpz.jpg","y8q8ro.jpg","8u66lo.jpg","n6cxn1.jpg","cmv7eg.jpg","19a45x.jpg","t7fwc1.jpg","egmmlq.jpg","duwp76.jpg","8dg1c4.jpg","7x5idu.jpg","0ws2zh.jpg","te4n0w.jpg","z4yb8h.jpg","agg3o2.jpg","a6jcnp.jpg","83q63y.jpg","6xtpcm.jpg","r7c1xv.jpg","nlw6wl.jpg","23ecf4.jpg","l3r104.jpg","bq23nv.jpg","46fyu8.jpg","plx1ig.jpg","k8h5t1.jpg","qz84wm.jpg","5cspke.jpg","im5fz1.jpg","nb2xxe.jpg","ujw6ck.jpg","ja5b2c.jpg","9lc1gm.jpg","trmz5y.jpg","bnfcli.jpg","so0dxy.jpg","imiwv0.jpg","dti4pc.jpg","dcwn5e.jpg","irq3u0.jpg","jqj7cs.jpg","a9b9rn.jpg","ygxd4t.jpg","tosu59.jpg","30ofc7.jpg","bgcmcn.jpg","k9nwza.jpg","n1vcg8.jpg","x59f4n.jpg","qavf9s.jpg","hoid3b.jpg","l4zcx7.jpg","wigji8.jpg","i0lthl.jpg","ri7dbh.jpg","klgnaw.jpg","r8hhk2.jpg","5qam0j.jpg","dkg98d.jpg","mo979c.jpg","20czwp.mp4","ysiiz2.mp4","6mnitt.mp4","3wmlw0.mp4","8rnz6j.mp4","ywdqv9.mp4","vfhqjq.mp4","mjvecv.mp4","gdqlfn.mp4","96g94e.mp4","572vld.mp4","spaqor.mp4","xya3ec.mp4","k2ynvo.mp4","m5q20o.mp4","vwr30n.mp4","if5wxb.mp4","1buk4j.jpg","4v6acx.jpg","cmepep.jpg","cjh015.jpg","f7p62l.jpg","bwx609.jpg","ffym1h.jpg","lpup38.jpg","crfll0.jpg","rpru3e.jpg","s0i7xk.jpg","jljl2b.jpg","2kdzeu.jpg","1gzuid.jpg","6gex05.jpg","j6lzce.jpg","fk1ty8.jpg","6ltufa.jpg","4ubq0d.jpg","z4nlap.jpg","r3kqqk.jpg","0k079q.jpg","1mddw8.jpg"],"pene":["8rzptn.mp4","3zeurr.mp4","557ula.mp4","fcni0u.mp4","5zjqoi.mp4","iusk1x.mp4","6axrhp.mp4","743kj3.mp4","cct1ps.jpg","3koo1x.jpg","yeqqpg.jpg","loikzv.jpg","7xnpmt.jpg","voi2wm.jpg","zasm1u.jpg","q79b0b.jpg","rgmq3b.mp4","4kow6d.mp4","875wez.mp4","auu9ei.mp4","o6yq19.jpg","4jlghs.mp4","d1cczs.jpg","3tddi1.jpg","yt4w5b.mp4","1f0px6.mp4","b65f5o.mp4","c8w1ek.mp4","v98291.mp4","np83y1.mp4","1rsi2e.mp4","wsm8lu.mp4","4xraha.jpg"]};

const BASE = process.env.MEDIA_BASE || ['https:', '', 'files.catbox.moe', ''].join('/');
const MIME = {
  jpg: 'image/jpeg', jpeg: 'image/jpeg', png: 'image/png', gif: 'image/gif', webp: 'image/webp',
  mp4: 'video/mp4', webm: 'video/webm', mov: 'video/quicktime'
};
const ALL = new Set([].concat(DATA.tetas, DATA.gay, DATA.pene));
const CATS = ['tetas', 'gay', 'pene'];

function kindOf(f) {
  return /\.(mp4|webm|mov)$/i.test(f) ? 'video' : 'image';
}

function clean(s) {
  return String(s || '').normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase().trim();
}

function normType(s) {
  const t = clean(s);
  if (!t) return '';
  if (['video', 'videos', 'vid', 'mp4'].includes(t)) return 'video';
  if (['image', 'images', 'imagen', 'imagenes', 'foto', 'fotos', 'img', 'jpg'].includes(t)) return 'image';
  return null;
}

function send(res, code, obj) {
  res.writeHead(code, {
    'Content-Type': 'application/json; charset=utf-8',
    'Access-Control-Allow-Origin': '*',
    'Cache-Control': 'no-store'
  });
  res.end(JSON.stringify(obj));
}

async function proxy(req, res, name, ranged) {
  const headers = {};
  if (ranged && req.headers.range) headers.Range = req.headers.range;
  let up;
  try {
    up = await fetch(BASE + name, { headers: headers });
  } catch (e) {
    return send(res, 502, { status: false, error: 'No se pudo obtener el archivo' });
  }
  if (!up.ok || !up.body) {
    return send(res, 502, { status: false, error: 'No se pudo obtener el archivo' });
  }
  const ext = name.split('.').pop().toLowerCase();
  const out = {
    'Content-Type': MIME[ext] || up.headers.get('content-type') || 'application/octet-stream',
    'Content-Disposition': 'inline',
    'Access-Control-Allow-Origin': '*',
    'Cache-Control': ranged ? 'public, max-age=3600' : 'no-store',
    'Accept-Ranges': ranged ? 'bytes' : 'none'
  };
  const len = up.headers.get('content-length');
  const rng = up.headers.get('content-range');
  if (len && !up.headers.get('content-encoding')) out['Content-Length'] = len;
  if (rng) out['Content-Range'] = rng;
  res.writeHead(up.status === 206 ? 206 : 200, out);
  const stream = Readable.fromWeb(up.body);
  stream.on('error', () => res.destroy());
  res.on('close', () => stream.destroy());
  stream.pipe(res);
}

async function api(req, res, qs) {
  const q = new URLSearchParams(qs);
  const file = q.get('f');
  if (file) {
    if (!ALL.has(file)) return send(res, 404, { status: false, error: 'Archivo no encontrado' });
    return proxy(req, res, file, true);
  }
  const catRaw = clean(q.get('category') || q.get('categoria'));
  const type = normType(q.get('type') || q.get('tipo'));
  const format = clean(q.get('format') || q.get('formato'));
  if (catRaw && !CATS.includes(catRaw)) {
    return send(res, 400, { status: false, error: 'Categoria invalida', categories: CATS });
  }
  if (type === null) {
    return send(res, 400, { status: false, error: 'Tipo invalido', types: ['image', 'video'] });
  }
  const pool = [];
  CATS.forEach((c) => {
    if (catRaw && c !== catRaw) return;
    DATA[c].forEach((f) => {
      if (!type || kindOf(f) === type) pool.push({ f: f, c: c });
    });
  });
  if (!pool.length) {
    return send(res, 404, { status: false, error: 'No hay archivos para ese filtro' });
  }
  const pick = pool[Math.floor(Math.random() * pool.length)];
  if (format === 'json') {
    return send(res, 200, { status: true, category: pick.c, type: kindOf(pick.f), url: BASE + pick.f });
  }
  if (req.headers.range) {
    res.writeHead(302, { Location: '/api/nsfw?f=' + pick.f, 'Cache-Control': 'no-store' });
    return res.end();
  }
  return proxy(req, res, pick.f, false);
}


const GH_ID = process.env.GITHUB_ID || 'Ov23lix8kM8uwqcJBRNi';
const GH_SECRET = process.env.GITHUB_SECRET || '';
const KEY = process.env.SESSION_SECRET || GH_SECRET;
const ALLOWED = (process.env.ALLOWED_USERS || '').split(',').map((s) => s.trim().toLowerCase()).filter(Boolean);
const site = (host, p) => ['https:', '', host].join('/') + p;
const GH_AUTH = site('github.com', '/login/oauth/authorize');
const GH_TOKEN = site('github.com', '/login/oauth/access_token');
const GH_USER = site('api.github.com', '/user');
const AVATAR = site('avatars.githubusercontent.com', '/');
const DAYS30 = 30 * 24 * 60 * 60;

const COUNT = { all: 0, image: 0, video: 0 };
CATS.forEach((c) => DATA[c].forEach((f) => {
  COUNT.all++;
  COUNT[kindOf(f)]++;
}));
const EMPTY = { tetas: [], gay: [], pene: [] };

function origin(req) {
  if (process.env.SITE_URL) return process.env.SITE_URL.replace(/\/+$/, '');
  const proto = String(req.headers['x-forwarded-proto'] || 'http').split(',')[0];
  const host = req.headers['x-forwarded-host'] || req.headers.host;
  return proto + ':' + '/' + '/' + host;
}

function parseCookies(req) {
  const out = {};
  String(req.headers.cookie || '').split(';').forEach((p) => {
    const i = p.indexOf('=');
    if (i > 0) {
      try { out[p.slice(0, i).trim()] = decodeURIComponent(p.slice(i + 1).trim()); } catch (e) {}
    }
  });
  return out;
}

function sign(s) {
  return crypto.createHmac('sha256', KEY).update(s).digest('base64url');
}

function makeSession(u) {
  const body = Buffer.from(JSON.stringify(u)).toString('base64url');
  return body + '.' + sign(body);
}

function readSession(req) {
  if (!KEY) return null;
  const c = parseCookies(req).ml;
  if (!c) return null;
  const parts = c.split('.');
  if (parts.length !== 2) return null;
  const good = sign(parts[0]);
  if (parts[1].length !== good.length) return null;
  if (!crypto.timingSafeEqual(Buffer.from(parts[1]), Buffer.from(good))) return null;
  try {
    const u = JSON.parse(Buffer.from(parts[0], 'base64url').toString());
    if (!u.exp || u.exp < Date.now() || !u.u) return null;
    if (ALLOWED.length && !ALLOWED.includes(String(u.u).toLowerCase())) return null;
    return u;
  } catch (e) {
    return null;
  }
}

function cookie(req, name, val, age) {
  const secure = String(req.headers['x-forwarded-proto'] || '').split(',')[0] === 'https' ? '; Secure' : '';
  return name + '=' + encodeURIComponent(val) + '; HttpOnly; SameSite=Lax; Path=/; Max-Age=' + age + secure;
}

function redirect(res, loc, cookies) {
  const h = { Location: loc, 'Cache-Control': 'no-store' };
  if (cookies) h['Set-Cookie'] = cookies;
  res.writeHead(302, h);
  res.end();
}

async function auth(req, res, url, qs) {
  const q = new URLSearchParams(qs);
  if (url === '/auth/logout') {
    return redirect(res, '/', [cookie(req, 'ml', '', 0), cookie(req, 'ms', '', 0)]);
  }
  if (!GH_SECRET) return redirect(res, '/?e=config');
  const back = origin(req) + '/auth/github/callback';
  if (url === '/auth/github') {
    const st = crypto.randomBytes(16).toString('hex');
    const p = new URLSearchParams({ client_id: GH_ID, redirect_uri: back, scope: 'read:user', state: st });
    return redirect(res, GH_AUTH + '?' + p.toString(), [cookie(req, 'ms', st, 600)]);
  }
  if (url !== '/auth/github/callback') return redirect(res, '/');
  const saved = parseCookies(req).ms;
  const code = q.get('code');
  if (!code || !saved || q.get('state') !== saved) {
    return redirect(res, '/?e=state', [cookie(req, 'ms', '', 0)]);
  }
  const tr = await fetch(GH_TOKEN, {
    method: 'POST',
    headers: { Accept: 'application/json', 'Content-Type': 'application/json', 'User-Agent': 'moonlight' },
    body: JSON.stringify({ client_id: GH_ID, client_secret: GH_SECRET, code: code, redirect_uri: back })
  });
  const tk = await tr.json();
  if (!tk.access_token) {
    const why = String(tk.error || 'sin_respuesta').replace(/[^a-z_]/g, '').slice(0, 40);
    return redirect(res, '/?e=token&d=' + why, [cookie(req, 'ms', '', 0)]);
  }
  const ur = await fetch(GH_USER, {
    headers: { Authorization: 'Bearer ' + tk.access_token, Accept: 'application/vnd.github+json', 'User-Agent': 'moonlight' }
  });
  const me = await ur.json();
  if (!me.login) return redirect(res, '/?e=token&d=sin_usuario', [cookie(req, 'ms', '', 0)]);
  if (ALLOWED.length && !ALLOWED.includes(String(me.login).toLowerCase())) {
    return redirect(res, '/?e=denied', [cookie(req, 'ms', '', 0)]);
  }
  const avatar = String(me.avatar_url || '').indexOf(AVATAR) === 0 ? me.avatar_url : '';
  const session = makeSession({
    u: String(me.login),
    n: String(me.name || me.login).slice(0, 60),
    a: avatar,
    exp: Date.now() + DAYS30 * 1000
  });
  return redirect(res, '/', [cookie(req, 'ml', session, DAYS30), cookie(req, 'ms', '', 0)]);
}

function safeJson(x) {
  return JSON.stringify(x).replace(/</g, '\\u003c');
}

const page = `<!DOCTYPE html>
<html lang="es">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<meta name="theme-color" content="#fdf8fc">
<meta name="referrer" content="no-referrer">
<title>Moonlight</title>
<style>
:root {
  --solid: #ffffff;
  --pink: #ffd9ea;
  --lilac: #e6dcff;
  --mint: #d5f5e8;
  --sky: #d8ecfd;
  --peach: #ffe8d6;
  --ink: #574f6e;
  --soft: #9b94b2;
  --accent: #a56fcb;
  --line: rgba(130, 110, 175, 0.14);
  --shadow: 0 2px 8px rgba(125, 105, 170, 0.13);
}
* { box-sizing: border-box; margin: 0; padding: 0; -webkit-tap-highlight-color: transparent; }
html { overflow-y: scroll; }
html.lock, html.lock body { overflow: hidden; }
body {
  background: #fdf8fc;
  color: var(--ink);
  font-family: system-ui, -apple-system, "Segoe UI", Roboto, sans-serif;
  min-height: 100vh;
}
body::before {
  content: ""; position: fixed; inset: 0; z-index: -1; pointer-events: none;
  background:
    radial-gradient(520px 380px at 6% -4%, #ffe1f0 0%, transparent 70%),
    radial-gradient(540px 400px at 100% 6%, #e4e3ff 0%, transparent 70%),
    radial-gradient(540px 400px at 40% 108%, #d9f6ea 0%, transparent 70%);
  transform: translateZ(0);
}
button { font-family: inherit; }
.top {
  position: sticky; top: 0; z-index: 5;
  background: rgba(253, 248, 252, 0.97);
  border-bottom: 1px solid var(--line);
}
.bar { max-width: 1000px; margin: 0 auto; padding: 10px 14px; display: flex; align-items: center; gap: 10px; }
.menu {
  width: 38px; height: 38px; border: 0; border-radius: 12px; cursor: pointer;
  background: var(--solid); color: var(--ink); display: grid; place-items: center;
  box-shadow: var(--shadow); transition: transform 0.15s, background 0.2s;
}
.menu:hover { background: var(--pink); }
.menu:active { transform: scale(0.92); }
.menu svg { width: 20px; height: 20px; }
.brand { display: flex; align-items: center; gap: 8px; font-weight: 700; font-size: 17px; letter-spacing: 0.2px; }
.logo {
  width: 30px; height: 30px; border-radius: 10px;
  background: linear-gradient(135deg, var(--pink), var(--lilac));
  display: grid; place-items: center; color: var(--accent);
}
.count {
  margin-left: auto; font-size: 11px; color: var(--soft);
  background: var(--solid); padding: 4px 10px; border-radius: 999px; box-shadow: var(--shadow);
}
.chips { max-width: 1000px; margin: 0 auto; padding: 0 14px 10px; display: flex; flex-direction: column; gap: 6px; }
.rowc { display: flex; gap: 6px; overflow-x: auto; scrollbar-width: none; }
.rowc::-webkit-scrollbar { display: none; }
.chip {
  flex: none; display: flex; align-items: center; gap: 5px;
  border: 0; border-radius: 999px; padding: 6px 12px;
  background: var(--solid); color: var(--ink); font-size: 13px; cursor: pointer;
  box-shadow: 0 1px 4px rgba(125, 105, 170, 0.1); transition: background 0.2s, transform 0.15s;
}
.chip:active { transform: scale(0.95); }
.chip.on { background: var(--pink); }
.chip.on.c-gay { background: var(--lilac); }
.chip.on.c-pene { background: var(--mint); }
.chip svg { width: 15px; height: 15px; }
.chip small { font-size: 10px; color: var(--soft); }
.rowc.mini .chip { padding: 4px 10px; font-size: 12px; background: transparent; box-shadow: none; color: var(--soft); }
.rowc.mini .chip.on { background: var(--sky); color: var(--ink); }
.rowc.mini svg { width: 13px; height: 13px; }
main { max-width: 1000px; margin: 0 auto; padding: 14px 14px 50px; }
#grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(96px, 1fr)); gap: 9px; }
.t {
  position: relative; border: 0; padding: 0; cursor: pointer;
  aspect-ratio: 1; border-radius: 18px; overflow: hidden;
  background: var(--pink); box-shadow: var(--shadow);
  content-visibility: auto; contain-intrinsic-size: 96px 96px;
  transition: transform 0.18s;
}
.t:nth-child(4n+2) { background: var(--sky); }
.t:nth-child(4n+3) { background: var(--mint); }
.t:nth-child(4n+4) { background: var(--peach); }
.t:active { transform: scale(0.96); }
@media (hover: hover) { .t:hover { transform: translateY(-3px); } }
.t img { width: 100%; height: 100%; object-fit: cover; display: block; opacity: 0; transition: opacity 0.35s; }
.t img.ok { opacity: 1; }
.vid { width: 100%; height: 100%; display: grid; place-items: center; color: var(--accent); }
.vid .pl {
  width: 38px; height: 38px; border-radius: 50%; background: rgba(255, 255, 255, 0.85);
  display: grid; place-items: center; box-shadow: var(--shadow);
}
.vid svg { width: 16px; height: 16px; margin-left: 2px; }
.tag-v {
  position: absolute; left: 7px; bottom: 7px; font-size: 9px; letter-spacing: 1px;
  background: rgba(255, 255, 255, 0.85); border-radius: 999px; padding: 2px 7px; color: var(--ink);
}
.empty { text-align: center; padding: 60px 16px; color: var(--soft); font-size: 14px; }
.empty svg { width: 46px; height: 46px; margin-bottom: 10px; color: #cbbfe6; }
.hide { display: none !important; }
#sent { height: 40px; }
#shade {
  position: fixed; inset: 0; z-index: 8; background: rgba(90, 70, 130, 0.25);
  opacity: 0; pointer-events: none; transition: opacity 0.25s;
}
#shade.on { opacity: 1; pointer-events: auto; }
#side {
  position: fixed; top: 0; bottom: 0; left: 0; z-index: 9; width: 250px;
  background: #ffffff; box-shadow: 6px 0 28px rgba(125, 105, 170, 0.22);
  transform: translateX(-105%); transition: transform 0.28s ease; will-change: transform;
  display: flex; flex-direction: column; padding: 18px 14px; border-radius: 0 24px 24px 0;
}
#side.on { transform: none; }
.shead { display: flex; align-items: center; justify-content: space-between; margin-bottom: 18px; }
.shead .brand { font-size: 16px; }
.sx { width: 32px; height: 32px; border: 0; border-radius: 10px; cursor: pointer; background: var(--lilac); color: var(--ink); display: grid; place-items: center; }
.sx svg { width: 16px; height: 16px; }
.item {
  display: flex; align-items: center; gap: 10px; width: 100%;
  border: 0; border-radius: 14px; padding: 11px 12px; margin-bottom: 6px;
  background: transparent; color: var(--ink); font-size: 14px; cursor: pointer; text-align: left; transition: background 0.2s;
}
.item:hover { background: var(--lilac); }
.item.on { background: var(--pink); }
.item .ico { width: 30px; height: 30px; border-radius: 10px; background: var(--solid); display: grid; place-items: center; box-shadow: 0 1px 4px rgba(125, 105, 170, 0.12); }
.item svg { width: 16px; height: 16px; }
.sfoot { margin-top: auto; font-size: 11px; color: var(--soft); text-align: center; letter-spacing: 1px; }
.doc { display: flex; flex-direction: column; gap: 12px; }
.pane { background: #ffffffcc; border-radius: 20px; padding: 16px; box-shadow: var(--shadow); border: 1px solid var(--line); }
.pane h2 { font-size: 15px; margin-bottom: 8px; display: flex; align-items: center; gap: 8px; }
.pane h2 svg { width: 17px; height: 17px; color: var(--accent); }
.pane p { font-size: 13px; color: var(--soft); line-height: 1.55; }
.code { display: flex; align-items: center; gap: 8px; margin-top: 8px; background: #f6f1fd; border-radius: 12px; padding: 9px 10px; }
.code code { flex: 1; font-size: 12px; color: var(--ink); word-break: break-all; font-family: ui-monospace, Menlo, Consolas, monospace; }
.cp { flex: none; width: 28px; height: 28px; border: 0; border-radius: 9px; cursor: pointer; background: var(--solid); color: var(--ink); display: grid; place-items: center; box-shadow: 0 1px 4px rgba(125, 105, 170, 0.15); }
.cp svg { width: 14px; height: 14px; }
.cp.ok { background: var(--mint); }
.lab { font-size: 12px; color: var(--ink); margin-top: 12px; font-weight: 600; }
.params { width: 100%; border-collapse: collapse; margin-top: 8px; font-size: 12px; }
.params td { padding: 7px 6px; border-top: 1px solid var(--line); vertical-align: top; }
.params td:first-child { font-family: ui-monospace, Menlo, Consolas, monospace; color: var(--accent); white-space: nowrap; }
.params td:last-child { color: var(--soft); }
.tags { display: flex; flex-wrap: wrap; gap: 6px; margin-top: 8px; }
.tag { font-size: 11px; background: var(--sky); border-radius: 999px; padding: 4px 10px; }
.tag.p { background: var(--pink); }
.tag.m { background: var(--mint); }
.go { margin-top: 10px; display: inline-flex; align-items: center; gap: 6px; border: 0; border-radius: 999px; padding: 8px 14px; cursor: pointer; background: var(--lilac); color: var(--ink); font-size: 12px; }
.go svg { width: 14px; height: 14px; }
#lb { position: fixed; inset: 0; z-index: 12; background: #fbf5ff; display: none; align-items: center; justify-content: center; }
#lb.open { display: flex; animation: fade 0.18s ease; }
@keyframes fade { from { opacity: 0; } to { opacity: 1; } }
#stage { display: flex; max-width: 92vw; max-height: 82vh; }
#stage img, #stage video { max-width: 92vw; max-height: 82vh; border-radius: 18px; box-shadow: 0 10px 28px rgba(125, 105, 170, 0.26); background: #fff; }
.ib {
  position: absolute; border: 0; cursor: pointer; width: 40px; height: 40px; border-radius: 50%;
  background: var(--solid); color: var(--ink); display: grid; place-items: center; text-decoration: none;
  box-shadow: 0 2px 8px rgba(125, 105, 170, 0.22); transition: transform 0.15s, background 0.2s;
}
.ib:hover { background: var(--pink); }
.ib:active { transform: scale(0.92); }
.ib svg { width: 20px; height: 20px; }
#x { top: 14px; right: 14px; }
#ex { top: 14px; right: 62px; }
#pv { left: 12px; top: 50%; margin-top: -20px; }
#nx { right: 12px; top: 50%; margin-top: -20px; }
#info { position: absolute; bottom: 16px; left: 0; right: 0; text-align: center; font-size: 12px; color: var(--soft); }
#wel {
  position: fixed; inset: 0; z-index: 30; display: none; align-items: center; justify-content: center; padding: 22px; overflow: hidden;
  background: linear-gradient(160deg, #fff0f8 0%, #f1eeff 50%, #e9faf3 100%);
  transition: opacity 0.45s ease, transform 0.45s ease;
}
#wel.show { display: flex; }
#wel.out { opacity: 0; transform: scale(1.04); pointer-events: none; }
.orb { position: absolute; border-radius: 50%; will-change: transform; animation: float 9s ease-in-out infinite; }
.o1 { width: 260px; height: 260px; left: -70px; top: -50px; background: radial-gradient(circle, #ffd0e6 0%, transparent 70%); }
.o2 { width: 300px; height: 300px; right: -90px; top: 18%; background: radial-gradient(circle, #d9d2ff 0%, transparent 70%); animation-delay: -3s; }
.o3 { width: 280px; height: 280px; left: 10%; bottom: -90px; background: radial-gradient(circle, #cdf3e2 0%, transparent 70%); animation-delay: -6s; }
.o4 { width: 160px; height: 160px; right: 12%; bottom: 14%; background: radial-gradient(circle, #ffe3cc 0%, transparent 70%); animation-delay: -1.5s; }
@keyframes float { 0%, 100% { transform: translate3d(0, 0, 0); } 50% { transform: translate3d(0, -22px, 0); } }
.star { position: absolute; color: #d8c8f5; animation: tw 3.2s ease-in-out infinite; }
.star svg { width: 100%; height: 100%; }
.s1 { width: 14px; height: 14px; left: 18%; top: 22%; }
.s2 { width: 10px; height: 10px; right: 20%; top: 16%; animation-delay: -1s; }
.s3 { width: 12px; height: 12px; right: 14%; bottom: 26%; animation-delay: -2s; }
.s4 { width: 9px; height: 9px; left: 12%; bottom: 30%; animation-delay: -0.5s; }
@keyframes tw { 0%, 100% { opacity: 0.25; transform: scale(0.8); } 50% { opacity: 1; transform: scale(1.1); } }
.wc { position: relative; text-align: center; max-width: 330px; width: 100%; animation: up 0.8s ease both; }
@keyframes up { from { opacity: 0; transform: translateY(18px); } to { opacity: 1; transform: none; } }
.moon {
  width: 84px; height: 84px; margin: 0 auto 18px; border-radius: 28px;
  background: linear-gradient(135deg, #ffd9ea, #e1d6ff);
  display: grid; place-items: center; color: var(--accent);
  box-shadow: 0 14px 34px rgba(165, 111, 203, 0.28); animation: pulse 3.6s ease-in-out infinite;
}
.moon svg { width: 40px; height: 40px; }
@keyframes pulse { 0%, 100% { transform: translateY(0); } 50% { transform: translateY(-6px); } }
.wc h1 {
  font-size: 38px; letter-spacing: 0.5px; margin-bottom: 6px;
  background: linear-gradient(90deg, #e07aa9, #a56fcb, #62b8a0);
  -webkit-background-clip: text; background-clip: text; color: transparent;
}
.wc .lead { font-size: 14px; color: var(--soft); margin-bottom: 20px; }
.stats { display: flex; justify-content: center; gap: 8px; margin-bottom: 16px; }
.stat { background: #ffffffd9; border-radius: 16px; padding: 9px 14px; box-shadow: var(--shadow); min-width: 76px; animation: up 0.8s ease both; }
.stat:nth-child(2) { animation-delay: 0.12s; }
.stat:nth-child(3) { animation-delay: 0.24s; }
.stat b { display: block; font-size: 18px; color: var(--ink); }
.stat span { font-size: 10px; letter-spacing: 1px; color: var(--soft); text-transform: uppercase; }
.wcat { display: flex; justify-content: center; gap: 6px; margin-bottom: 20px; flex-wrap: wrap; }
.wcat span { display: flex; align-items: center; gap: 5px; font-size: 12px; border-radius: 999px; padding: 5px 11px; }
.wcat svg { width: 13px; height: 13px; }
.wcat .a { background: var(--pink); }
.wcat .b { background: var(--lilac); }
.wcat .c { background: var(--mint); }
.enter {
  display: inline-flex; align-items: center; justify-content: center; gap: 8px; width: 100%;
  border: 0; border-radius: 999px; padding: 13px 0; cursor: pointer; font-size: 15px; font-weight: 600; color: #fff;
  background: linear-gradient(90deg, #f29ac2, #b48be0); box-shadow: 0 10px 24px rgba(180, 139, 224, 0.4);
  transition: transform 0.15s;
}
.enter:active { transform: scale(0.97); }
.enter svg { width: 18px; height: 18px; }
.note { font-size: 11px; color: var(--soft); margin-top: 12px; line-height: 1.5; }
.leave { border: 0; background: transparent; color: var(--soft); font-size: 12px; margin-top: 6px; cursor: pointer; text-decoration: underline; }
html.anon .top, html.anon main { display: none; }
a.item { text-decoration: none; }
.me { display: flex; align-items: center; gap: 10px; background: var(--lilac); border-radius: 16px; padding: 10px; margin-bottom: 14px; }
.me img { width: 38px; height: 38px; border-radius: 50%; object-fit: cover; background: #fff; flex: none; }
.me div { min-width: 0; }
.me b { display: block; font-size: 13px; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
.me span { font-size: 11px; color: var(--soft); }
.who { display: inline-flex; align-items: center; gap: 8px; background: #ffffffd9; border-radius: 999px; padding: 5px 14px 5px 5px; margin-bottom: 14px; box-shadow: var(--shadow); font-size: 13px; }
.who img { width: 28px; height: 28px; border-radius: 50%; object-fit: cover; }
a.enter { text-decoration: none; }
.gh { background: linear-gradient(90deg, #7a7595, #4b4666); box-shadow: 0 10px 24px rgba(75, 70, 102, 0.3); }
.err { font-size: 12px; color: #b4457d; background: #ffe3ef; border-radius: 12px; padding: 8px 10px; margin-bottom: 12px; }
</style>
</head>
<body>
<div class="top">
  <div class="bar">
    <button class="menu" id="mb" aria-label="Menu"></button>
    <div class="brand"><span class="logo" id="logo"></span>Moonlight</div>
    <span class="count" id="count"></span>
  </div>
  <div class="chips" id="chips">
    <div class="rowc" id="nav"></div>
    <div class="rowc mini" id="sub"></div>
  </div>
</div>
<div id="shade"></div>
<aside id="side">
  <div class="shead">
    <div class="brand"><span class="logo" id="slogo"></span>Moonlight</div>
    <button class="sx" id="sx" aria-label="Cerrar"></button>
  </div>
  <div class="me hide" id="me"></div>
  <button class="item on" id="m-home"><span class="ico" id="i-home"></span>Inicio</button>
  <button class="item" id="m-api"><span class="ico" id="i-api"></span>API</button>
  <a class="item hide" id="m-out" href="/auth/logout"><span class="ico" id="i-out"></span>Cerrar sesion</a>
  <div class="sfoot">𝓢𝓽𝓪𝓻𝓛𝔂𝓷</div>
</aside>
<main>
  <div id="home">
    <div id="grid"></div>
    <div id="sent"></div>
  </div>
  <div class="doc hide" id="doc"></div>
</main>
<div id="lb">
  <button class="ib" id="x" aria-label="Cerrar"></button>
  <a class="ib" id="ex" aria-label="Abrir original" target="_blank" rel="noopener noreferrer"></a>
  <button class="ib" id="pv" aria-label="Anterior"></button>
  <button class="ib" id="nx" aria-label="Siguiente"></button>
  <div id="stage"></div>
  <div id="info"></div>
</div>
<div id="wel">
  <span class="orb o1"></span><span class="orb o2"></span><span class="orb o3"></span><span class="orb o4"></span>
  <span class="star s1" id="st1"></span><span class="star s2" id="st2"></span><span class="star s3" id="st3"></span><span class="star s4" id="st4"></span>
  <div class="wc">
    <div class="moon" id="wmoon"></div>
    <h1>Moonlight</h1>
    <p class="lead">Tu galeria de fotos y videos, suave y rapida</p>
    <div class="stats">
      <div class="stat"><b id="n-all">0</b><span>Archivos</span></div>
      <div class="stat"><b id="n-img">0</b><span>Fotos</span></div>
      <div class="stat"><b id="n-vid">0</b><span>Videos</span></div>
    </div>
    <div class="wcat" id="wcat"></div>
    <div class="err hide" id="err"></div>
    <div id="who"></div>
    <button class="enter" id="enter"></button>
    <a class="enter gh hide" id="login" href="/auth/github"></a>
    <p class="note">Contenido solo para adultos. Al entrar confirmas que tienes 18 anos o mas</p>
    <button class="leave" id="leave">Salir</button>
  </div>
</div>
<script>
var DATA = @@DATA@@;
var USER = @@USER@@;
var COUNT = @@COUNT@@;
var BASE = ['https:', '', 'files.catbox.moe', ''].join('/');
var S = 'viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"';
var ICON = {
  all: '<svg ' + S + '><rect x="3" y="3" width="7" height="7" rx="2"></rect><rect x="14" y="3" width="7" height="7" rx="2"></rect><rect x="3" y="14" width="7" height="7" rx="2"></rect><rect x="14" y="14" width="7" height="7" rx="2"></rect></svg>',
  tetas: '<svg ' + S + '><path d="M12 20s-7-4.4-7-10a4 4 0 0 1 7-2.6A4 4 0 0 1 19 10c0 5.6-7 10-7 10z"></path></svg>',
  gay: '<svg ' + S + '><circle cx="9" cy="12" r="5"></circle><circle cx="15" cy="12" r="5"></circle></svg>',
  pene: '<svg ' + S + '><path d="M12 3l2.2 5.4L20 9l-4.4 3.8L17 18.5 12 15.5 7 18.5l1.4-5.7L4 9l5.8-.6z"></path></svg>',
  image: '<svg ' + S + '><rect x="3" y="4" width="18" height="16" rx="4"></rect><circle cx="9" cy="10" r="1.8"></circle><path d="M21 16l-5-5-8 8"></path></svg>',
  video: '<svg ' + S + '><rect x="2" y="5" width="14" height="14" rx="4"></rect><path d="M16 10l6-3v10l-6-3z"></path></svg>',
  play: '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M8 5.5v13a1 1 0 0 0 1.5.86l10.5-6.5a1 1 0 0 0 0-1.72L9.5 4.64A1 1 0 0 0 8 5.5z"></path></svg>',
  close: '<svg ' + S + '><path d="M6 6l12 12M18 6L6 18"></path></svg>',
  prev: '<svg ' + S + '><path d="M15 5l-7 7 7 7"></path></svg>',
  next: '<svg ' + S + '><path d="M9 5l7 7-7 7"></path></svg>',
  ext: '<svg ' + S + '><path d="M14 4h6v6M20 4l-9 9M18 14v4a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4"></path></svg>',
  moon: '<svg width="17" height="17" ' + S + '><path d="M20 14.5A8 8 0 0 1 9.5 4a8 8 0 1 0 10.5 10.5z"></path></svg>',
  burger: '<svg ' + S + '><path d="M4 6.5h16M4 12h16M4 17.5h16"></path></svg>',
  home: '<svg ' + S + '><path d="M4 11l8-7 8 7v8a1 1 0 0 1-1 1h-4v-6h-6v6H5a1 1 0 0 1-1-1z"></path></svg>',
  api: '<svg ' + S + '><path d="M8 8l-4 4 4 4M16 8l4 4-4 4M13.5 5l-3 14"></path></svg>',
  copy: '<svg ' + S + '><rect x="9" y="9" width="11" height="11" rx="3"></rect><path d="M5 15V6a2 2 0 0 1 2-2h8"></path></svg>',
  check: '<svg ' + S + '><path d="M5 12.5l4.5 4.5L19 7.5"></path></svg>',
  bolt: '<svg ' + S + '><path d="M13 3L5 13.5h6L10 21l8-10.5h-6z"></path></svg>',
  github: '<svg ' + S + '><path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22"></path></svg>',
  out: '<svg ' + S + '><path d="M9 4H6a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h3M16 8l4 4-4 4M20 12H9"></path></svg>',
  sparkle: '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M12 2l2.2 7.8L22 12l-7.8 2.2L12 22l-2.2-7.8L2 12l7.8-2.2z"></path></svg>'
};
var NAMES = { all: 'Todo', tetas: 'Tetas', gay: 'Gay', pene: 'Pene' };
var SUBS = { all: 'Todo', image: 'Fotos', video: 'Videos' };
var items = [];
var totals = { all: 0, tetas: 0, gay: 0, pene: 0, image: 0, video: 0 };
['tetas', 'gay', 'pene'].forEach(function (c) {
  DATA[c].forEach(function (f) {
    var k = /\\.(mp4|webm|mov)$/i.test(f) ? 'video' : 'image';
    items.push({ name: f, cat: c, kind: k });
    totals[c]++;
    totals.all++;
    totals[k]++;
  });
});
var cat = 'all';
var kind = 'all';
var view = [];
var cur = 0;
var shown = 0;
var STEP = 40;
var $ = function (id) { return document.getElementById(id); };
var grid = $('grid'), nav = $('nav'), sub = $('sub'), lb = $('lb'), stage = $('stage'), info = $('info'), count = $('count'), ex = $('ex');
var side = $('side'), shade = $('shade'), doc = $('doc'), chips = $('chips'), home = $('home'), sent = $('sent'), wel = $('wel');
$('logo').innerHTML = ICON.moon;
$('slogo').innerHTML = ICON.moon;
$('wmoon').innerHTML = ICON.moon;
$('mb').innerHTML = ICON.burger;
$('sx').innerHTML = ICON.close;
$('i-home').innerHTML = ICON.home;
$('i-api').innerHTML = ICON.api;
$('x').innerHTML = ICON.close;
$('pv').innerHTML = ICON.prev;
$('nx').innerHTML = ICON.next;
$('enter').innerHTML = ICON.sparkle + 'Entrar';
$('login').innerHTML = ICON.github + 'Continuar con GitHub';
$('i-out').innerHTML = ICON.out;
['st1', 'st2', 'st3', 'st4'].forEach(function (id) { $(id).innerHTML = ICON.sparkle; });
$('wcat').innerHTML =
  '<span class="a">' + ICON.tetas + 'Tetas</span>' +
  '<span class="b">' + ICON.gay + 'Gay</span>' +
  '<span class="c">' + ICON.pene + 'Pene</span>';
ex.innerHTML = ICON.ext;
function src(m) { return BASE + m.name; }
function buildNav() {
  nav.innerHTML = '';
  ['all', 'tetas', 'gay', 'pene'].forEach(function (k) {
    var b = document.createElement('button');
    b.className = 'chip c-' + k + (k === cat ? ' on' : '');
    b.innerHTML = ICON[k] + NAMES[k] + '<small>' + totals[k] + '</small>';
    b.onclick = function () { cat = k; buildNav(); render(); };
    nav.appendChild(b);
  });
  sub.innerHTML = '';
  ['all', 'image', 'video'].forEach(function (k) {
    var b = document.createElement('button');
    b.className = 'chip' + (k === kind ? ' on' : '');
    b.innerHTML = ICON[k] + SUBS[k];
    b.onclick = function () { kind = k; buildNav(); render(); };
    sub.appendChild(b);
  });
}
function tile(m, i) {
  var inner = m.kind === 'video'
    ? '<div class="vid"><span class="pl">' + ICON.play + '</span></div><span class="tag-v">VIDEO</span>'
    : '<img loading="lazy" decoding="async" referrerpolicy="no-referrer" alt="" src="' + src(m) + '" onload="this.classList.add(\\'ok\\')">';
  return '<button class="t" data-i="' + i + '">' + inner + '</button>';
}
function more() {
  var end = Math.min(shown + STEP, view.length);
  var h = '';
  for (var i = shown; i < end; i++) h += tile(view[i], i);
  grid.insertAdjacentHTML('beforeend', h);
  shown = end;
  sent.classList.toggle('hide', shown >= view.length);
}
var io = null;
if ('IntersectionObserver' in window) {
  io = new IntersectionObserver(function (es) {
    if (es[0].isIntersecting && shown < view.length) {
      more();
      io.unobserve(sent);
      io.observe(sent);
    }
  }, { rootMargin: '700px 0px' });
  io.observe(sent);
}
function render() {
  view = items.filter(function (m) {
    return (cat === 'all' || m.cat === cat) && (kind === 'all' || m.kind === kind);
  });
  count.textContent = view.length ? view.length + ' archivos' : '';
  shown = 0;
  grid.innerHTML = '';
  if (!view.length) {
    grid.style.display = 'block';
    grid.innerHTML = '<div class="empty">' + ICON.image + '<div>No hay nada aqui todavia</div></div>';
    sent.classList.add('hide');
    return;
  }
  grid.style.display = '';
  more();
  if (!io) { while (shown < view.length) more(); }
}
function counts(c, t) {
  return items.filter(function (m) { return (!c || m.cat === c) && (!t || m.kind === t); }).length;
}
function codeBox(text) {
  return '<div class="code"><code>' + text + '</code><button class="cp" data-c="' + text + '" aria-label="Copiar">' + ICON.copy + '</button></div>';
}
function buildDoc() {
  var ep = location.host + '/api/nsfw';
  doc.innerHTML =
    '<div class="pane"><h2>' + ICON.bolt + 'Endpoint</h2>' +
    '<p>Devuelve una imagen o video al azar directamente, sin redirigir a otra pagina. Usa el link tal cual en un bot, en una etiqueta img o video, o abrelo en el navegador y se muestra el archivo.</p>' +
    codeBox('GET ' + ep) + '</div>' +
    '<div class="pane"><h2>' + ICON.api + 'Parametros</h2>' +
    '<table class="params">' +
    '<tr><td>category</td><td>tetas, gay o pene. Si no lo pones, elige de todas</td></tr>' +
    '<tr><td>type</td><td>image o video. Tambien acepta imagen, foto y vídeo. Si no lo pones, elige cualquiera</td></tr>' +
    '<tr><td>format</td><td>json para recibir los datos y el link en vez del archivo</td></tr>' +
    '</table></div>' +
    '<div class="pane"><h2>' + ICON.video + 'Ejemplos</h2>' +
    '<div class="lab">Video de gay</div>' + codeBox(ep + '?category=gay&type=video') +
    '<div class="lab">Imagen de tetas</div>' + codeBox(ep + '?category=tetas&type=image') +
    '<div class="lab">Cualquier cosa de pene</div>' + codeBox(ep + '?category=pene') +
    '<div class="lab">Totalmente al azar</div>' + codeBox(ep) +
    '<div class="lab">Respuesta en JSON</div>' + codeBox(ep + '?category=gay&type=video&format=json') +
    '<p style="margin-top:8px">Ejemplo de respuesta JSON</p>' +
    '<div class="code"><code>{"status":true,"category":"gay","type":"video","url":"' + BASE + 'abc123.mp4"}</code></div>' +
    '<button class="go" id="try">' + ICON.next + 'Probar un video de gay</button></div>' +
    '<div class="pane"><h2>' + ICON.all + 'Disponible</h2>' +
    '<div class="tags">' +
    '<span class="tag p">tetas ' + totals.tetas + '</span>' +
    '<span class="tag p">gay ' + totals.gay + '</span>' +
    '<span class="tag p">pene ' + totals.pene + '</span>' +
    '<span class="tag m">fotos ' + totals.image + '</span>' +
    '<span class="tag m">videos ' + totals.video + '</span>' +
    '</div>' +
    '<p style="margin-top:10px">Errores: 400 si la categoria o el tipo no existen, 404 si no hay archivos para ese filtro.</p></div>';
}
doc.addEventListener('click', function (e) {
  var cp = e.target.closest('.cp');
  if (cp) {
    var txt = cp.getAttribute('data-c').replace(/^GET /, '');
    var full = location.protocol + '/' + '/' + txt;
    var done = function () {
      cp.classList.add('ok');
      cp.innerHTML = ICON.check;
      setTimeout(function () { cp.classList.remove('ok'); cp.innerHTML = ICON.copy; }, 1200);
    };
    try { navigator.clipboard.writeText(full).then(done); } catch (err) {}
    return;
  }
  if (e.target.closest('#try')) {
    window.open('/api/nsfw?category=gay&type=video', '_blank');
  }
});
function go(p) {
  $('m-home').classList.toggle('on', p === 'home');
  $('m-api').classList.toggle('on', p === 'api');
  home.classList.toggle('hide', p !== 'home');
  chips.classList.toggle('hide', p !== 'home');
  doc.classList.toggle('hide', p !== 'api');
  if (p === 'api') {
    buildDoc();
    count.textContent = 'API';
  } else {
    count.textContent = view.length ? view.length + ' archivos' : '';
  }
  closeSide();
  window.scrollTo(0, 0);
}
function openSide() { side.classList.add('on'); shade.classList.add('on'); }
function closeSide() { side.classList.remove('on'); shade.classList.remove('on'); }
$('mb').onclick = openSide;
$('sx').onclick = closeSide;
shade.onclick = closeSide;
$('m-home').onclick = function () { go('home'); };
$('m-api').onclick = function () { go('api'); };
grid.addEventListener('click', function (e) {
  var t = e.target.closest('.t');
  if (t) open(parseInt(t.getAttribute('data-i'), 10));
});
function show() {
  var m = view[cur];
  stage.innerHTML = m.kind === 'video'
    ? '<video src="' + src(m) + '" controls autoplay loop playsinline></video>'
    : '<img referrerpolicy="no-referrer" alt="" src="' + src(m) + '">';
  ex.href = src(m);
  info.textContent = (cur + 1) + ' / ' + view.length;
  var nx = view[(cur + 1) % view.length];
  if (nx && nx.kind === 'image') { var pre = new Image(); pre.referrerPolicy = 'no-referrer'; pre.src = src(nx); }
}
function open(i) {
  cur = i;
  show();
  lb.classList.add('open');
}
function close() {
  lb.classList.remove('open');
  stage.innerHTML = '';
}
function move(d) {
  cur = (cur + d + view.length) % view.length;
  show();
}
$('x').onclick = close;
$('pv').onclick = function (e) { e.stopPropagation(); move(-1); };
$('nx').onclick = function (e) { e.stopPropagation(); move(1); };
lb.addEventListener('click', function (e) {
  if (e.target === lb) close();
});
document.addEventListener('keydown', function (e) {
  if (e.key === 'Escape') { close(); closeSide(); }
  if (!lb.classList.contains('open')) return;
  if (e.key === 'ArrowLeft') move(-1);
  if (e.key === 'ArrowRight') move(1);
});
var sx = 0;
lb.addEventListener('touchstart', function (e) { sx = e.touches[0].clientX; }, { passive: true });
lb.addEventListener('touchend', function (e) {
  var dx = e.changedTouches[0].clientX - sx;
  if (Math.abs(dx) > 60) move(dx < 0 ? 1 : -1);
}, { passive: true });
function countUp(id, to) {
  var el = $(id), t0 = null;
  function step(t) {
    if (t0 === null) t0 = t;
    var p = Math.min((t - t0) / 900, 1);
    el.textContent = Math.round(to * (1 - Math.pow(1 - p, 3)));
    if (p < 1) requestAnimationFrame(step);
  }
  requestAnimationFrame(step);
}
function enter() {
  try { sessionStorage.setItem('w', '1'); } catch (e) {}
  wel.classList.add('out');
  document.documentElement.classList.remove('lock');
  setTimeout(function () { wel.classList.remove('show'); }, 480);
}
var N = USER ? totals : COUNT;
var seen = false;
try { seen = sessionStorage.getItem('w') === '1'; } catch (e) {}
function esc(s) {
  return String(s).replace(/[&<>"']/g, function (c) { return '&#' + c.charCodeAt(0) + ';'; });
}
var ERRS = {
  config: 'Falta configurar GITHUB_SECRET en el servidor',
  state: 'La sesion expiro, intenta de nuevo',
  token: 'GitHub no acepto el inicio de sesion, intenta de nuevo',
  denied: 'Tu cuenta no tiene permiso para entrar'
};
var em = /[?&]e=([a-z]+)/.exec(location.search);
if (em && ERRS[em[1]]) {
  var dm = /[?&]d=([a-z_]+)/.exec(location.search);
  $('err').textContent = ERRS[em[1]] + (dm ? ' (' + dm[1] + ')' : '');
  $('err').classList.remove('hide');
  try { history.replaceState(null, '', location.pathname); } catch (e) {}
}
if (USER) {
  var av = USER.a ? '<img alt="" referrerpolicy="no-referrer" src="' + esc(USER.a) + '">' : '';
  $('who').innerHTML = '<span class="who">' + av + esc(USER.n) + '</span>';
  $('me').innerHTML = av + '<div><b>' + esc(USER.n) + '</b><span>@' + esc(USER.u) + '</span></div>';
  $('me').classList.remove('hide');
  $('m-out').classList.remove('hide');
} else {
  document.documentElement.classList.add('anon');
  $('enter').classList.add('hide');
  $('login').classList.remove('hide');
}
if (!USER || !seen) {
  wel.classList.add('show');
  document.documentElement.classList.add('lock');
  countUp('n-all', N.all);
  countUp('n-img', N.image);
  countUp('n-vid', N.video);
}
$('enter').onclick = enter;
$('leave').onclick = function () { location.href = 'about:blank'; };
buildNav();
render();
</script>
</body>
</html>`;

function pageFor(user) {
  const data = user ? DATA : EMPTY;
  const u = user ? { u: user.u, n: user.n, a: user.a } : null;
  return page
    .replace('@@DATA@@', () => safeJson(data))
    .replace('@@USER@@', () => safeJson(u))
    .replace('@@COUNT@@', () => safeJson(COUNT));
}

async function handler(req, res) {
  const parts = req.url.split('?');
  const url = parts[0];
  if (url === '/api/nsfw' || url === '/api/nsfw/') {
    try {
      return await api(req, res, parts[1] || '');
    } catch (e) {
      if (!res.headersSent) return send(res, 500, { status: false, error: 'Error interno' });
      return res.destroy();
    }
  }
  if (url.indexOf('/auth/') === 0) {
    try {
      return await auth(req, res, url, parts[1] || '');
    } catch (e) {
      return redirect(res, '/?e=token&d=error_de_red');
    }
  }
  res.writeHead(200, {
    'Content-Type': 'text/html; charset=utf-8',
    'Cache-Control': 'private, no-store',
    'Referrer-Policy': 'no-referrer'
  });
  res.end(pageFor(readSession(req)));
}

module.exports = handler;

if (require.main === module) {
  const port = process.env.PORT || 3000;
  http.createServer(handler).listen(port, () => {
    console.log('Galeria lista en el puerto ' + port);
  });
}
