const http = require('http');

const DATA = {"tetas":["jl76up.jpg","8nkq83.jpg","urh2of.jpg","h22p1a.jpg","dhcgo9.jpg","pa8rgg.jpg","qnvp4y.jpg","3gcxfy.jpg","fo2mt7.jpg","hjhsl8.jpg","u1o9pf.jpg","7rgxw7.jpg","67vgin.jpg","3i737s.jpg","svfbd9.jpg","r7002l.jpg","de0jag.jpg","y5w63e.jpg","xa45o8.jpg","wwtmxu.jpg","9a3v74.jpg","tfvlvb.jpg","zat3ec.jpg","96kome.jpg","a0na12.mp4","n5fh2u.mp4","4lethn.mp4","nea151.mp4","y5bz23.mp4","e26ilk.mp4","wlcdh0.mp4"],"gay":["3vhb15.jpg","yxo0vo.jpg","5vgzcc.jpg","4dsvl2.jpg","mbnhhn.jpg","vn03e1.jpg","azshoc.jpg","y3bxt9.jpg","am4rsz.jpg","ua4sy4.jpg","grq6pr.jpg","v2u0hu.jpg","f1s0wz.jpg","ecu7dv.jpg","dhlyqo.jpg","5bq86i.jpg","xkgxpu.jpg","xrpc8k.jpg","5h8lqc.jpg","9zjmzf.jpg","e3uord.jpg","u34msg.jpg","bwg6bx.jpg","s5i1uq.jpg","rlzxbe.jpg","qgvqs0.jpg","ibcqpz.jpg","y8q8ro.jpg","8u66lo.jpg","n6cxn1.jpg","cmv7eg.jpg","19a45x.jpg","t7fwc1.jpg","egmmlq.jpg","duwp76.jpg","8dg1c4.jpg","7x5idu.jpg","0ws2zh.jpg","te4n0w.jpg","z4yb8h.jpg","agg3o2.jpg","a6jcnp.jpg","83q63y.jpg","6xtpcm.jpg","r7c1xv.jpg","nlw6wl.jpg","23ecf4.jpg","l3r104.jpg","bq23nv.jpg","46fyu8.jpg","plx1ig.jpg","k8h5t1.jpg","qz84wm.jpg","5cspke.jpg","im5fz1.jpg","nb2xxe.jpg","ujw6ck.jpg","ja5b2c.jpg","9lc1gm.jpg","trmz5y.jpg","bnfcli.jpg","so0dxy.jpg","imiwv0.jpg","dti4pc.jpg","dcwn5e.jpg","irq3u0.jpg","jqj7cs.jpg","a9b9rn.jpg","ygxd4t.jpg","tosu59.jpg","30ofc7.jpg","bgcmcn.jpg","k9nwza.jpg","n1vcg8.jpg","x59f4n.jpg","qavf9s.jpg","hoid3b.jpg","l4zcx7.jpg","wigji8.jpg","i0lthl.jpg","ri7dbh.jpg","klgnaw.jpg","r8hhk2.jpg","5qam0j.jpg","dkg98d.jpg","mo979c.jpg","20czwp.mp4","ysiiz2.mp4","6mnitt.mp4","3wmlw0.mp4","8rnz6j.mp4","ywdqv9.mp4","vfhqjq.mp4","mjvecv.mp4","gdqlfn.mp4","96g94e.mp4","572vld.mp4","spaqor.mp4","xya3ec.mp4","k2ynvo.mp4","m5q20o.mp4","vwr30n.mp4","if5wxb.mp4"],"pene":["8rzptn.mp4","3zeurr.mp4","557ula.mp4","fcni0u.mp4","5zjqoi.mp4","iusk1x.mp4","6axrhp.mp4","743kj3.mp4","cct1ps.jpg","3koo1x.jpg","yeqqpg.jpg","loikzv.jpg","7xnpmt.jpg","voi2wm.jpg","zasm1u.jpg","q79b0b.jpg"]};

const page = `<!DOCTYPE html>
<html lang="es">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<meta name="theme-color" content="#fdf6fb">
<meta name="referrer" content="no-referrer">
<title>Moonlight</title>
<style>
:root {
  --card: #ffffff;
  --pink: #ffd6e8;
  --lilac: #e4d9ff;
  --mint: #d3f4e6;
  --sky: #d5eafc;
  --peach: #ffe6d1;
  --ink: #5b5370;
  --soft: #9a93ad;
}
* { box-sizing: border-box; margin: 0; padding: 0; -webkit-tap-highlight-color: transparent; }
body {
  background: linear-gradient(160deg, #fdf6fb 0%, #f1f6ff 55%, #f2fbf6 100%);
  background-attachment: fixed;
  color: var(--ink);
  font-family: system-ui, -apple-system, "Segoe UI", Roboto, sans-serif;
  min-height: 100vh;
}
header {
  display: flex; align-items: center; justify-content: space-between;
  gap: 12px; flex-wrap: wrap;
  padding: 18px 16px 8px; max-width: 1000px; margin: 0 auto;
}
.brand { display: flex; align-items: center; gap: 8px; font-weight: 600; font-size: 18px; }
.logo {
  width: 32px; height: 32px; border-radius: 10px;
  background: var(--lilac); display: grid; place-items: center;
}
.count { font-size: 12px; color: var(--soft); font-weight: 400; }
nav { display: flex; gap: 6px; flex-wrap: wrap; }
nav button {
  display: flex; align-items: center; gap: 5px;
  border: 0; border-radius: 999px; padding: 6px 12px;
  background: var(--card); color: var(--ink);
  font-size: 13px; cursor: pointer;
  box-shadow: 0 1px 4px rgba(120, 100, 160, 0.12);
  transition: background 0.2s, transform 0.15s;
}
nav button:active { transform: scale(0.95); }
nav button.on { background: var(--pink); }
nav svg { width: 15px; height: 15px; }
.sub { display: flex; gap: 6px; max-width: 1000px; margin: 0 auto; padding: 4px 16px 0; }
.sub button {
  display: flex; align-items: center; gap: 4px;
  border: 0; border-radius: 999px; padding: 4px 10px;
  background: transparent; color: var(--soft);
  font-size: 12px; cursor: pointer;
}
.sub button.on { background: var(--sky); color: var(--ink); }
.sub svg { width: 13px; height: 13px; }
main { max-width: 1000px; margin: 0 auto; padding: 10px 16px 40px; }
#grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(96px, 1fr)); gap: 8px; }
.t {
  position: relative; border: 0; padding: 0; cursor: pointer;
  aspect-ratio: 1; border-radius: 14px; overflow: hidden;
  background: var(--pink);
  box-shadow: 0 2px 6px rgba(120, 100, 160, 0.14);
  transition: transform 0.2s, box-shadow 0.2s;
}
.t:nth-child(4n+2) { background: var(--sky); }
.t:nth-child(4n+3) { background: var(--mint); }
.t:nth-child(4n+4) { background: var(--peach); }
.t:hover { transform: translateY(-2px); box-shadow: 0 6px 12px rgba(120, 100, 160, 0.2); }
.t img, .t video { width: 100%; height: 100%; object-fit: cover; display: block; }
.badge {
  position: absolute; right: 6px; bottom: 6px;
  width: 22px; height: 22px; border-radius: 50%;
  background: rgba(255, 255, 255, 0.88);
  display: grid; place-items: center; color: var(--ink);
}
.badge svg { width: 12px; height: 12px; }
.empty { text-align: center; padding: 60px 16px; color: var(--soft); font-size: 14px; }
.empty svg { width: 46px; height: 46px; margin-bottom: 10px; color: #cbbfe6; }
#lb {
  position: fixed; inset: 0; z-index: 10;
  background: rgba(250, 244, 255, 0.95);
  backdrop-filter: blur(8px);
  display: none; align-items: center; justify-content: center;
}
#lb.open { display: flex; animation: fade 0.2s ease; }
@keyframes fade { from { opacity: 0; } to { opacity: 1; } }
#stage { display: flex; max-width: 92vw; max-height: 82vh; }
#stage img, #stage video {
  max-width: 92vw; max-height: 82vh; border-radius: 16px;
  box-shadow: 0 10px 30px rgba(120, 100, 160, 0.25); background: #fff;
}
.ib {
  position: absolute; border: 0; cursor: pointer;
  width: 40px; height: 40px; border-radius: 50%;
  background: var(--card); color: var(--ink);
  display: grid; place-items: center; text-decoration: none;
  box-shadow: 0 2px 8px rgba(120, 100, 160, 0.2);
  transition: transform 0.15s, background 0.2s;
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
  background: linear-gradient(160deg, #fdf6fb 0%, #eef3ff 55%, #eefaf3 100%);
  display: none; align-items: center; justify-content: center; padding: 20px;
}
#gate.show { display: flex; }
.box {
  background: var(--card); border-radius: 22px; padding: 24px 22px;
  max-width: 300px; width: 100%; text-align: center;
  box-shadow: 0 8px 24px rgba(120, 100, 160, 0.16);
}
.box .logo { margin: 0 auto 12px; width: 44px; height: 44px; border-radius: 14px; background: var(--pink); }
.box h1 { font-size: 17px; margin-bottom: 6px; }
.box p { font-size: 13px; color: var(--soft); margin-bottom: 16px; }
.row { display: flex; gap: 8px; }
.row button {
  flex: 1; border: 0; border-radius: 999px; padding: 9px 0;
  font-size: 13px; cursor: pointer; color: var(--ink);
}
#yes { background: var(--mint); }
#no { background: var(--lilac); }
</style>
</head>
<body>
<header>
  <div class="brand">
    <span class="logo" id="logo"></span>
    Moonlight
    <span class="count" id="count"></span>
  </div>
  <nav id="nav"></nav>
</header>
<div class="sub" id="sub"></div>
<main>
  <div id="grid"></div>
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
  moon: '<svg width="18" height="18" ' + S + '><path d="M20 14.5A8 8 0 0 1 9.5 4a8 8 0 1 0 10.5 10.5z"></path></svg>'
};
var NAMES = { all: 'Todo', tetas: 'Tetas', gay: 'Gay', pene: 'Pene' };
var SUBS = { all: 'Todo', image: 'Fotos', video: 'Videos' };
var items = [];
['tetas', 'gay', 'pene'].forEach(function (c) {
  DATA[c].forEach(function (f) {
    items.push({ name: f, cat: c, kind: /\\.(mp4|webm|mov)$/i.test(f) ? 'video' : 'image' });
  });
});
var cat = 'all';
var kind = 'all';
var view = [];
var cur = 0;
var $ = function (id) { return document.getElementById(id); };
var grid = $('grid'), nav = $('nav'), sub = $('sub'), lb = $('lb'), stage = $('stage'), info = $('info'), count = $('count'), ex = $('ex');
$('logo').innerHTML = ICON.moon;
$('glogo').innerHTML = ICON.moon;
$('x').innerHTML = ICON.close;
$('pv').innerHTML = ICON.prev;
$('nx').innerHTML = ICON.next;
ex.innerHTML = ICON.ext;
function src(m) { return BASE + m.name; }
function buildNav() {
  nav.innerHTML = '';
  ['all', 'tetas', 'gay', 'pene'].forEach(function (k) {
    var b = document.createElement('button');
    b.className = k === cat ? 'on' : '';
    b.innerHTML = ICON[k] + NAMES[k];
    b.onclick = function () { cat = k; buildNav(); render(); };
    nav.appendChild(b);
  });
  sub.innerHTML = '';
  ['all', 'image', 'video'].forEach(function (k) {
    var b = document.createElement('button');
    b.className = k === kind ? 'on' : '';
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
  if (!lb.classList.contains('open')) return;
  if (e.key === 'Escape') close();
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

function handler(req, res) {
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
