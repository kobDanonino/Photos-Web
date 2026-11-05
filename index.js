const http = require('http');
const { Readable } = require('stream');

const DATA = {"tetas":["jl76up.jpg","8nkq83.jpg","urh2of.jpg","h22p1a.jpg","dhcgo9.jpg","pa8rgg.jpg","qnvp4y.jpg","3gcxfy.jpg","fo2mt7.jpg","hjhsl8.jpg","u1o9pf.jpg","7rgxw7.jpg","67vgin.jpg","3i737s.jpg","svfbd9.jpg","r7002l.jpg","de0jag.jpg","y5w63e.jpg","xa45o8.jpg","wwtmxu.jpg","9a3v74.jpg","tfvlvb.jpg","zat3ec.jpg","96kome.jpg","a0na12.mp4","n5fh2u.mp4","4lethn.mp4","nea151.mp4","y5bz23.mp4","e26ilk.mp4","wlcdh0.mp4"],"gay":["3vhb15.jpg","yxo0vo.jpg","5vgzcc.jpg","4dsvl2.jpg","mbnhhn.jpg","vn03e1.jpg","azshoc.jpg","y3bxt9.jpg","am4rsz.jpg","ua4sy4.jpg","grq6pr.jpg","v2u0hu.jpg","f1s0wz.jpg","ecu7dv.jpg","dhlyqo.jpg","5bq86i.jpg","xkgxpu.jpg","xrpc8k.jpg","5h8lqc.jpg","9zjmzf.jpg","e3uord.jpg","u34msg.jpg","bwg6bx.jpg","s5i1uq.jpg","rlzxbe.jpg","qgvqs0.jpg","ibcqpz.jpg","y8q8ro.jpg","8u66lo.jpg","n6cxn1.jpg","cmv7eg.jpg","19a45x.jpg","t7fwc1.jpg","egmmlq.jpg","duwp76.jpg","8dg1c4.jpg","7x5idu.jpg","0ws2zh.jpg","te4n0w.jpg","z4yb8h.jpg","agg3o2.jpg","a6jcnp.jpg","83q63y.jpg","6xtpcm.jpg","r7c1xv.jpg","nlw6wl.jpg","23ecf4.jpg","l3r104.jpg","bq23nv.jpg","46fyu8.jpg","plx1ig.jpg","k8h5t1.jpg","qz84wm.jpg","5cspke.jpg","im5fz1.jpg","nb2xxe.jpg","ujw6ck.jpg","ja5b2c.jpg","9lc1gm.jpg","trmz5y.jpg","bnfcli.jpg","so0dxy.jpg","imiwv0.jpg","dti4pc.jpg","dcwn5e.jpg","irq3u0.jpg","jqj7cs.jpg","a9b9rn.jpg","ygxd4t.jpg","tosu59.jpg","30ofc7.jpg","bgcmcn.jpg","k9nwza.jpg","n1vcg8.jpg","x59f4n.jpg","qavf9s.jpg","hoid3b.jpg","l4zcx7.jpg","wigji8.jpg","i0lthl.jpg","ri7dbh.jpg","klgnaw.jpg","r8hhk2.jpg","5qam0j.jpg","dkg98d.jpg","mo979c.jpg","20czwp.mp4","ysiiz2.mp4","6mnitt.mp4","3wmlw0.mp4","8rnz6j.mp4","ywdqv9.mp4","vfhqjq.mp4","mjvecv.mp4","gdqlfn.mp4","96g94e.mp4","572vld.mp4","spaqor.mp4","xya3ec.mp4","k2ynvo.mp4","m5q20o.mp4","vwr30n.mp4","if5wxb.mp4","1buk4j.jpg","4v6acx.jpg","cmepep.jpg","cjh015.jpg","f7p62l.jpg","bwx609.jpg","ffym1h.jpg","lpup38.jpg","crfll0.jpg","rpru3e.jpg","s0i7xk.jpg","jljl2b.jpg","2kdzeu.jpg","1gzuid.jpg","6gex05.jpg","j6lzce.jpg","fk1ty8.jpg","6ltufa.jpg","4ubq0d.jpg","z4nlap.jpg","r3kqqk.jpg","0k079q.jpg","1mddw8.jpg"],"pene":["8rzptn.mp4","3zeurr.mp4","557ula.mp4","fcni0u.mp4","5zjqoi.mp4","iusk1x.mp4","6axrhp.mp4","743kj3.mp4","cct1ps.jpg","3koo1x.jpg","yeqqpg.jpg","loikzv.jpg","7xnpmt.jpg","voi2wm.jpg","zasm1u.jpg","q79b0b.jpg"]};

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

const page = `<!DOCTYPE html>
<html lang="es">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<meta name="theme-color" content="#fbf4fb">
<meta name="referrer" content="no-referrer">
<title>Moonlight</title>
<style>
:root {
  --card: rgba(255, 255, 255, 0.78);
  --solid: #ffffff;
  --pink: #ffd9ea;
  --lilac: #e6dcff;
  --mint: #d5f5e8;
  --sky: #d8ecfd;
  --peach: #ffe8d6;
  --ink: #574f6e;
  --soft: #9b94b2;
  --line: rgba(130, 110, 175, 0.14);
  --shadow: 0 4px 14px rgba(125, 105, 170, 0.14);
}
* { box-sizing: border-box; margin: 0; padding: 0; -webkit-tap-highlight-color: transparent; }
html { scroll-behavior: smooth; }
body {
  background:
    radial-gradient(500px 360px at 8% -4%, #ffe1f0 0%, transparent 70%),
    radial-gradient(520px 380px at 100% 8%, #e3e2ff 0%, transparent 70%),
    radial-gradient(520px 380px at 50% 105%, #d9f6ea 0%, transparent 70%),
    #fdf8fc;
  background-attachment: fixed;
  color: var(--ink);
  font-family: system-ui, -apple-system, "Segoe UI", Roboto, sans-serif;
  min-height: 100vh;
}
button { font-family: inherit; }
.top {
  position: sticky; top: 0; z-index: 5;
  background: rgba(253, 248, 252, 0.72);
  backdrop-filter: blur(14px);
  -webkit-backdrop-filter: blur(14px);
  border-bottom: 1px solid var(--line);
}
.bar {
  max-width: 1000px; margin: 0 auto; padding: 10px 14px;
  display: flex; align-items: center; gap: 10px;
}
.menu {
  width: 38px; height: 38px; border: 0; border-radius: 12px; cursor: pointer;
  background: var(--solid); color: var(--ink);
  display: grid; place-items: center; box-shadow: var(--shadow);
  transition: transform 0.15s, background 0.2s;
}
.menu:hover { background: var(--pink); }
.menu:active { transform: scale(0.92); }
.menu svg { width: 20px; height: 20px; }
.brand { display: flex; align-items: center; gap: 8px; font-weight: 650; font-size: 17px; letter-spacing: 0.2px; }
.logo {
  width: 30px; height: 30px; border-radius: 10px;
  background: linear-gradient(135deg, var(--pink), var(--lilac));
  display: grid; place-items: center; color: #a06ac4;
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
  box-shadow: 0 1px 5px rgba(125, 105, 170, 0.1);
  transition: background 0.2s, transform 0.15s;
}
.chip:active { transform: scale(0.95); }
.chip.on { background: var(--pink); }
.chip svg { width: 15px; height: 15px; }
.chip small { font-size: 10px; color: var(--soft); }
.rowc.mini .chip { padding: 4px 10px; font-size: 12px; background: transparent; box-shadow: none; color: var(--soft); }
.rowc.mini .chip.on { background: var(--sky); color: var(--ink); }
.rowc.mini svg { width: 13px; height: 13px; }
main { max-width: 1000px; margin: 0 auto; padding: 14px 14px 50px; }
#grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(96px, 1fr)); gap: 9px; }
.t {
  position: relative; border: 0; padding: 0; cursor: pointer;
  aspect-ratio: 1; border-radius: 16px; overflow: hidden;
  background: var(--pink); box-shadow: var(--shadow);
  transition: transform 0.22s, box-shadow 0.22s;
}
.t:nth-child(4n+2) { background: var(--sky); }
.t:nth-child(4n+3) { background: var(--mint); }
.t:nth-child(4n+4) { background: var(--peach); }
.t:hover { transform: translateY(-3px) scale(1.02); box-shadow: 0 10px 20px rgba(125, 105, 170, 0.2); }
.t img, .t video { width: 100%; height: 100%; object-fit: cover; display: block; }
.badge {
  position: absolute; right: 6px; bottom: 6px; width: 22px; height: 22px; border-radius: 50%;
  background: rgba(255, 255, 255, 0.9); display: grid; place-items: center; color: var(--ink);
}
.badge svg { width: 12px; height: 12px; }
.empty { text-align: center; padding: 60px 16px; color: var(--soft); font-size: 14px; }
.empty svg { width: 46px; height: 46px; margin-bottom: 10px; color: #cbbfe6; }
.hide { display: none !important; }
#shade {
  position: fixed; inset: 0; z-index: 8; background: rgba(90, 70, 130, 0.22);
  opacity: 0; pointer-events: none; transition: opacity 0.25s;
}
#shade.on { opacity: 1; pointer-events: auto; }
#side {
  position: fixed; top: 0; bottom: 0; left: 0; z-index: 9; width: 250px;
  background: rgba(255, 255, 255, 0.92); backdrop-filter: blur(16px); -webkit-backdrop-filter: blur(16px);
  box-shadow: 6px 0 28px rgba(125, 105, 170, 0.2);
  transform: translateX(-105%); transition: transform 0.28s ease;
  display: flex; flex-direction: column; padding: 18px 14px;
  border-radius: 0 24px 24px 0;
}
#side.on { transform: none; }
.shead { display: flex; align-items: center; justify-content: space-between; margin-bottom: 18px; }
.shead .brand { font-size: 16px; }
.sx {
  width: 32px; height: 32px; border: 0; border-radius: 10px; cursor: pointer;
  background: var(--lilac); color: var(--ink); display: grid; place-items: center;
}
.sx svg { width: 16px; height: 16px; }
.item {
  display: flex; align-items: center; gap: 10px; width: 100%;
  border: 0; border-radius: 14px; padding: 11px 12px; margin-bottom: 6px;
  background: transparent; color: var(--ink); font-size: 14px; cursor: pointer; text-align: left;
  transition: background 0.2s;
}
.item:hover { background: var(--lilac); }
.item.on { background: var(--pink); }
.item .ico {
  width: 30px; height: 30px; border-radius: 10px; background: var(--solid);
  display: grid; place-items: center; box-shadow: 0 1px 4px rgba(125, 105, 170, 0.12);
}
.item svg { width: 16px; height: 16px; }
.sfoot { margin-top: auto; font-size: 11px; color: var(--soft); text-align: center; letter-spacing: 1px; }
.doc { display: flex; flex-direction: column; gap: 12px; }
.pane {
  background: var(--card); border-radius: 20px; padding: 16px;
  box-shadow: var(--shadow); border: 1px solid var(--line);
}
.pane h2 { font-size: 15px; margin-bottom: 8px; display: flex; align-items: center; gap: 8px; }
.pane h2 svg { width: 17px; height: 17px; color: #a06ac4; }
.pane p { font-size: 13px; color: var(--soft); line-height: 1.55; }
.code {
  display: flex; align-items: center; gap: 8px; margin-top: 8px;
  background: #f6f1fd; border-radius: 12px; padding: 9px 10px;
}
.code code { flex: 1; font-size: 12px; color: var(--ink); word-break: break-all; font-family: ui-monospace, Menlo, Consolas, monospace; }
.cp {
  flex: none; width: 28px; height: 28px; border: 0; border-radius: 9px; cursor: pointer;
  background: var(--solid); color: var(--ink); display: grid; place-items: center;
  box-shadow: 0 1px 4px rgba(125, 105, 170, 0.15);
}
.cp svg { width: 14px; height: 14px; }
.cp.ok { background: var(--mint); }
.lab { font-size: 12px; color: var(--ink); margin-top: 12px; font-weight: 600; }
.params { width: 100%; border-collapse: collapse; margin-top: 8px; font-size: 12px; }
.params td { padding: 7px 6px; border-top: 1px solid var(--line); vertical-align: top; }
.params td:first-child { font-family: ui-monospace, Menlo, Consolas, monospace; color: #a06ac4; white-space: nowrap; }
.params td:last-child { color: var(--soft); }
.tags { display: flex; flex-wrap: wrap; gap: 6px; margin-top: 8px; }
.tag { font-size: 11px; background: var(--sky); border-radius: 999px; padding: 4px 10px; }
.tag.p { background: var(--pink); }
.tag.m { background: var(--mint); }
.go {
  margin-top: 10px; display: inline-flex; align-items: center; gap: 6px;
  border: 0; border-radius: 999px; padding: 8px 14px; cursor: pointer;
  background: var(--lilac); color: var(--ink); font-size: 12px;
}
.go svg { width: 14px; height: 14px; }
#lb {
  position: fixed; inset: 0; z-index: 12; background: rgba(251, 244, 255, 0.95);
  backdrop-filter: blur(10px); -webkit-backdrop-filter: blur(10px);
  display: none; align-items: center; justify-content: center;
}
#lb.open { display: flex; animation: fade 0.2s ease; }
@keyframes fade { from { opacity: 0; } to { opacity: 1; } }
#stage { display: flex; max-width: 92vw; max-height: 82vh; }
#stage img, #stage video {
  max-width: 92vw; max-height: 82vh; border-radius: 18px;
  box-shadow: 0 12px 34px rgba(125, 105, 170, 0.28); background: #fff;
}
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
#gate {
  position: fixed; inset: 0; z-index: 20;
  background: radial-gradient(500px 360px at 20% 0%, #ffe1f0 0%, transparent 70%), radial-gradient(500px 360px at 90% 100%, #dcd9ff 0%, transparent 70%), #fdf8fc;
  display: none; align-items: center; justify-content: center; padding: 20px;
}
#gate.show { display: flex; }
.box {
  background: var(--solid); border-radius: 24px; padding: 26px 22px;
  max-width: 310px; width: 100%; text-align: center; box-shadow: 0 10px 30px rgba(125, 105, 170, 0.18);
}
.box .logo { margin: 0 auto 12px; width: 46px; height: 46px; border-radius: 15px; }
.box h1 { font-size: 17px; margin-bottom: 6px; }
.box p { font-size: 13px; color: var(--soft); margin-bottom: 16px; }
.row { display: flex; gap: 8px; }
.row button { flex: 1; border: 0; border-radius: 999px; padding: 10px 0; font-size: 13px; cursor: pointer; color: var(--ink); }
#yes { background: var(--mint); }
#no { background: var(--lilac); }
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
  <button class="item on" id="m-home"><span class="ico" id="i-home"></span>Inicio</button>
  <button class="item" id="m-api"><span class="ico" id="i-api"></span>API</button>
  <div class="sfoot">𝓢𝓽𝓪𝓻𝓛𝔂𝓷</div>
</aside>
<main>
  <div id="grid"></div>
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
<div id="gate">
  <div class="box">
    <span class="logo" id="glogo"></span>
    <h1>Contenido para adultos</h1>
    <p>Esta galeria es solo para mayores de 18 anos</p>
    <div class="row">
      <button id="yes">Tengo 18 o mas</button>
      <button id="no">Salir</button>
    </div>
  </div>
</div>
<script>
var DATA = ${JSON.stringify(DATA)};
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
  bolt: '<svg ' + S + '><path d="M13 3L5 13.5h6L10 21l8-10.5h-6z"></path></svg>'
};
var NAMES = { all: 'Todo', tetas: 'Tetas', gay: 'Gay', pene: 'Pene' };
var SUBS = { all: 'Todo', image: 'Fotos', video: 'Videos' };
var items = [];
var totals = { all: 0, tetas: 0, gay: 0, pene: 0 };
['tetas', 'gay', 'pene'].forEach(function (c) {
  DATA[c].forEach(function (f) {
    items.push({ name: f, cat: c, kind: /\\.(mp4|webm|mov)$/i.test(f) ? 'video' : 'image' });
    totals[c]++;
    totals.all++;
  });
});
var cat = 'all';
var kind = 'all';
var page = 'home';
var view = [];
var cur = 0;
var $ = function (id) { return document.getElementById(id); };
var grid = $('grid'), nav = $('nav'), sub = $('sub'), lb = $('lb'), stage = $('stage'), info = $('info'), count = $('count'), ex = $('ex');
var side = $('side'), shade = $('shade'), doc = $('doc'), chips = $('chips');
$('logo').innerHTML = ICON.moon;
$('slogo').innerHTML = ICON.moon;
$('glogo').innerHTML = ICON.moon;
$('mb').innerHTML = ICON.burger;
$('sx').innerHTML = ICON.close;
$('i-home').innerHTML = ICON.home;
$('i-api').innerHTML = ICON.api;
$('x').innerHTML = ICON.close;
$('pv').innerHTML = ICON.prev;
$('nx').innerHTML = ICON.next;
ex.innerHTML = ICON.ext;
function src(m) { return BASE + m.name; }
function buildNav() {
  nav.innerHTML = '';
  ['all', 'tetas', 'gay', 'pene'].forEach(function (k) {
    var b = document.createElement('button');
    b.className = 'chip' + (k === cat ? ' on' : '');
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
function render() {
  view = items.filter(function (m) {
    return (cat === 'all' || m.cat === cat) && (kind === 'all' || m.kind === kind);
  });
  count.textContent = view.length ? view.length + ' archivos' : '';
  if (!view.length) {
    grid.style.display = 'block';
    grid.innerHTML = '<div class="empty">' + ICON.image + '<div>No hay nada aqui todavia</div></div>';
    return;
  }
  grid.style.display = '';
  grid.innerHTML = view.map(function (m, i) {
    var inner = m.kind === 'video'
      ? '<video muted playsinline preload="metadata" src="' + src(m) + '#t=0.1"></video><span class="badge">' + ICON.play + '</span>'
      : '<img loading="lazy" decoding="async" referrerpolicy="no-referrer" alt="" src="' + src(m) + '">';
    return '<button class="t" data-i="' + i + '">' + inner + '</button>';
  }).join('');
}
function counts(c, t) {
  return items.filter(function (m) { return (!c || m.cat === c) && (!t || m.kind === t); }).length;
}
function codeBox(text) {
  return '<div class="code"><code>' + text + '</code><button class="cp" data-c="' + text + '" aria-label="Copiar">' + ICON.copy + '</button></div>';
}
function buildDoc() {
  var h = location.host;
  var ep = h + '/api/nsfw';
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
    '<span class="tag p">tetas ' + counts('tetas') + '</span>' +
    '<span class="tag p">gay ' + counts('gay') + '</span>' +
    '<span class="tag p">pene ' + counts('pene') + '</span>' +
    '<span class="tag m">fotos ' + counts('', 'image') + '</span>' +
    '<span class="tag m">videos ' + counts('', 'video') + '</span>' +
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
  page = p;
  $('m-home').classList.toggle('on', p === 'home');
  $('m-api').classList.toggle('on', p === 'api');
  grid.classList.toggle('hide', p !== 'home');
  chips.classList.toggle('hide', p !== 'home');
  doc.classList.toggle('hide', p !== 'api');
  if (p === 'api') {
    buildDoc();
    count.textContent = 'API';
  } else {
    render();
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
var ok = false;
try { ok = localStorage.getItem('adult') === '1'; } catch (e) {}
if (!ok) $('gate').classList.add('show');
$('yes').onclick = function () {
  try { localStorage.setItem('adult', '1'); } catch (e) {}
  $('gate').classList.remove('show');
};
$('no').onclick = function () { location.href = 'about:blank'; };
buildNav();
render();
</script>
</body>
</html>`;

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
  res.writeHead(200, {
    'Content-Type': 'text/html; charset=utf-8',
    'Cache-Control': 'public, max-age=300',
    'Referrer-Policy': 'no-referrer'
  });
  res.end(page);
}

module.exports = handler;

if (require.main === module) {
  const port = process.env.PORT || 3000;
  http.createServer(handler).listen(port, () => {
    console.log('Galeria lista en el puerto ' + port);
  });
}
