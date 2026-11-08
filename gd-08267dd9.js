(function () {
var GD = window.GD, D = GD.DELIVERY, F = GD.FLAGS, PROD = GD.MODE === 'prod';
var $ = function (s, r) { return (r || document).querySelector(s); };
var $$ = function (s, r) { return Array.prototype.slice.call((r || document).querySelectorAll(s)); };
var ASSETS = document.documentElement.getAttribute('data-assets') || 'assets/';
function img(f, alt, attrs) { var s = (window.GD_IMG && window.GD_IMG[f] !== undefined) ? window.GD_IMG[f] : ASSETS + f; return s ? '<img src="' + s + '" alt="' + alt + '" ' + (attrs || '') + '>' : '<span class="ph">PHOTO</span>'; }
var yen = GD.yen, show = function (flag) { return !flag || F[flag] !== 'off'; };
var draftTag = function (flag, txt) { return !PROD && flag && F[flag] === 'draft' ? '<span class="draft">' + (txt || '案・承認待ち') + '</span>' : ''; };
var plants = function () { return GD.PLANTS.filter(function (p) { return p.active; }); };
var byId = function (id) { return plants().filter(function (p) { return p.id === id; })[0]; };
var inSize = function (k) { return plants().filter(function (p) { return p.sizes.indexOf(k) >= 0; }); };
var pname = function (p, k) { var f = GD.formOf(p, k); return p.name + (f ? '(' + f + ')' : ''); };
var SHOP_ORIGIN = 'https://greendesign.shopselect.net';
var shopUrl = function (path) { return path ? (/^https?:/.test(path) ? path : SHOP_ORIGIN + path) : ''; };
var qs = {}; (window.__QS || location.search || '').replace(/[?&]([^=&]+)=([^&]*)/g, function (_, a, b) { qs[a] = decodeURIComponent(b); });
var $d = function (s) { return $(s) || { innerHTML: '', style: {}, textContent: '', setAttribute: function () {} }; };
if (PROD) { $$('.draft,.todo').forEach(function (e) { e.parentNode.removeChild(e); }); var an = $('#afterNote'); if (an) an.textContent = '※ 訪問診療の内容・料金は、LINEでご案内します。'; }
$$('[data-t]').forEach(function (el) { var p = el.getAttribute('data-t').split('.'); var o = p[0] === 'brand' ? GD.BRAND : D; el.textContent = o[p[1]]; });
var MSG = {
general: '【Green Design】植物のお医者さんに相談したいです。\n・気になる植物：\n・設置場所：\n・お届け先の地域(都道府県・市区)：\n・ご希望サイズ(S/M/L)：',
corp: '【Green Design】法人ギフトについて相談したいです。\n・用途(開店/開業/移転/周年)：\n・ご予算：\n・本数：\n・お届け先の地域：\n・お届け希望日：',
care: '【Green Design】購入した植物について相談したいです。\n・植物の名前：\n・気になる状態：\n(写真があれば一緒にお送りください)',
visit: '【Green Design】訪問診療サービスについて問い合わせたいです。\n・お住まい/施設の地域：\n・植物の種類・本数：\n・気になる状態：'
};
function bindLine(root) {
$$('[data-line]', root).forEach(function (a) { a.href = GD.lineUrl(a.getAttribute('data-msg') || MSG[a.getAttribute('data-line')] || MSG.general); a.target = '_blank'; a.rel = 'noopener'; });
}
var drawer = $('#drawer');
function setDrawer(o) { drawer.classList.toggle('is-open', o); document.body.style.overflow = o ? 'hidden' : ''; $('#menuBtn').setAttribute('aria-expanded', String(o)); }
$('#menuBtn').addEventListener('click', function () { setDrawer(true); });
$$('[data-close]', drawer).forEach(function (e) { e.addEventListener('click', function () { setDrawer(false); }); });
document.addEventListener('keydown', function (e) { if (e.key === 'Escape') setDrawer(false); });
function areaChips(cur, id) {
return D.AREAS.map(function (a) { return '<button type="button" class="chip" data-area="' + a.key + '" aria-pressed="' + (a.key === cur) + '">' + a.short + '</button>'; }).join('');
}
function areaTable(base, cur) {
return '<table class="ship-table"><thead><tr><th>お届け先</th><th style="text-align:right">配送・設置・育成アドバイス</th><th style="text-align:right">お支払い総額</th></tr></thead><tbody>' + D.AREAS.map(function (a) {
return '<tr' + (cur === a.key ? ' class="is-cur"' : '') + '><th scope="row">' + a.short + '</th><td class="fee">' + yen(a.fee) + '</td><td class="fee">' + yen(base + a.fee) + '</td></tr>';
}).join('') + '</tbody></table>';
}
function services() {
return '<ol class="svc">' + D.SERVICES.map(function (s, i) { return '<li><b>' + (i + 1) + '</b><div><strong>' + s.ttl + '</strong><ul>' + s.pts.map(function (t) { return '<li>' + t + '</li>'; }).join('') + '</ul></div></li>'; }).join('') + '</ol>';
}
function itemHref(p, k, a) { return PROD ? (shopUrl(GD.itemUrl(p.id, k, a || 'B')) || '#lineup') : 'item.html?p=' + p.id + '&s=' + k; }
if (!$('#diagnosis')) $$('a[href$="#diagnosis"]').forEach(function (a) { a.setAttribute('href', a.getAttribute('href').replace('#diagnosis', '#lineup')); });
if ($('#reasons-list') || $('#flow-list') || $('#doctor-body')) {
var vis = GD.REASONS.filter(function (r) { return show(r.flag); }), n = 0;
$d('#reasons-list').innerHTML = vis.map(function (r) {
n++; var no = '<div class="reason__no">' + String(n).padStart(2, '0') + '</div>';
var items = r.items ? '<ul class="reason__items">' + r.items.map(function (t) { return '<li>' + t + '</li>'; }).join('') + '</ul>' : '';
if (r.id === 'after') return '<div class="reason reason--key">' + no + '<h3 class="reason__ttl">' + r.ttl + '</h3><p class="reason__txt">' + r.txt + '</p><a class="btn btn--light" data-line="care" href="https://line.me/R/ti/p/%40efc9662d" target="_blank" rel="noopener">LINEで相談する</a></div>';
return '<div class="reason">' + no + '<h3 class="reason__ttl">' + r.ttl + draftTag(r.flag) + '</h3><p class="reason__txt">' + r.txt + '</p>' + items + '</div>';
}).join('');
$d('#flow-list').innerHTML = GD.FLOW.map(function (f) { return '<li><p class="flow__ttl">' + f.ttl + '</p><p class="flow__txt">' + f.txt + '</p></li>'; }).join('');
var dr = GD.DOCTOR, miss = function (t) { return PROD ? '' : '<div class="todo">【入力待ち】' + t + '</div>'; };
$d('#doctor-ph').innerHTML = dr.PHOTO ? img(dr.PHOTO, '植物のお医者さん(白衣で植物の葉を見る専門家)', 'loading="lazy" width="720" height="960"') : 'PHOTO(入力待ち)';
$d('#doctor-body').innerHTML = '<p class="eyebrow">Plant Doctor</p><h3>' + dr.FACT + 'が、<br>植物のお医者さんとして立ち上げました。' + draftTag('DOCTOR_PROFILE', '紹介文は入力待ち') + '</h3><p class="doctor__quote">' + dr.TITLE + '</p><dl class="dl">' +
[['Career', '経歴', dr.CAREER], ['Thoughts', '植物への想い', dr.THOUGHTS], ['Why', '事業を始めた理由', dr.WHY]].map(function (x) { return '<div><dt>' + x[0] + '｜' + x[1] + '</dt><dd>' + (x[2] || miss(x[1] + '(ご本人の言葉で記入)')) + '</dd></div>'; }).join('') + '</dl>';
$d('#faq-list').innerHTML = GD.FAQ.map(function (f) { return '<details><summary>' + f.q + '</summary><p class="faq__a">' + f.a + '</p></details>'; }).join('');
(function () {
var st = { size: 'M', area: 'B' }, root = $('#lineup-ui'); if (!root) return;
function render() {
var z = GD.size(st.size), a = GD.area(st.area), list = inSize(st.size);
var bd = GD.breakdown(st.size);
root.innerHTML =
'<div class="tabs" role="tablist">' + GD.SIZES.map(function (s) { return '<button class="tab" role="tab" data-size="' + s.key + '" aria-selected="' + (s.key === st.size) + '">' + s.key + ' サイズ<small>' + s.height + '</small></button>'; }).join('') + '</div>' +
'<div class="sizehead"><p class="sizehead__price">' + yen(z.price) + '<small>税込・植物＋鉢セット</small></p><p class="sizehead__form">' + list.length + '種類 ／ ' + z.height + (bd ? ' ／ 植物 ' + yen(bd.plant) + '・鉢 ' + yen(bd.pot) : '') + '</p></div>' +
'<div class="areabar"><p class="areabar__lbl">お届け先エリア(首都圏限定・自社配送)</p><div class="chips" id="lAreas">' + areaChips(st.area) + '</div><p class="areabar__calc"><span>商品 ' + yen(z.price) + '</span><em>＋</em><span>配送・設置・育成アドバイス ' + yen(a.fee) + '</span><em>＝</em><strong>' + yen(z.price + a.fee) + '</strong></p></div>' +
'<div class="cards">' + list.map(function (p) {
return '<a class="card" href="' + itemHref(p, st.size, st.area) + '"><div class="card__img">' + img(p.img, p.name, 'loading="lazy" width="600" height="750"') + (p.tag ? '<span class="card__flag">屋外向け</span>' : '') + '</div><p class="card__name">' + p.name + '</p><p class="card__form">' + (GD.formOf(p, st.size) || '&nbsp;') + '</p><p class="card__price">' + yen(z.price) + '</p><span class="card__more">詳しく見る<i class="arrow"></i></span></a>';
}).join('') + '</div>' +
'<div class="lserv"><div><h3>' + D.SERVICE_FULL + '</h3><p class="note" style="margin-top:8px">' + D.LIMIT + '。全サイズ共通です。</p>' + areaTable(z.price, st.area) + '<p class="note" style="margin-top:12px">' + D.CAUTION + '</p></div><div>' + services() + '</div></div>';
$$('[data-size]', root).forEach(function (b) { b.addEventListener('click', function () { st.size = b.getAttribute('data-size'); render(); }); });
$$('[data-area]', root).forEach(function (b) { b.addEventListener('click', function () { st.area = b.getAttribute('data-area'); render(); }); });
revealAll();
}
render();
})();
if (F.DIAG_DEMO !== 'draft' || PROD) { var dd = $('#diagDraft'); if (dd) dd.remove(); }
}
function fillInfo(p, k, ar) {
var z = GD.size(k), a = GD.area(ar), d = p.diag, total = z.price + a.fee, bd = GD.breakdown(k);
var todo = function (t) { return PROD ? '' : '<div class="todo">' + t + '</div>'; };
$d('#pdBd').innerHTML = bd ? '<div class="price__bd"><div><span>植物</span><span>' + yen(bd.plant) + '</span></div><div><span>鉢(黒のエコ素材プランター)</span><span>' + yen(bd.pot) + '</span></div></div>' : todo('【モックのみ】植物代・鉢代の内訳は未確定のため非表示です。確定値を入れると、この位置に自動で表示されます。');
if ($('#pdBd') && !bd && PROD) $('#pdBd').style.display = 'none';
$d('#pdAreas').innerHTML = areaChips(ar);
var tail = PROD ? '<p class="pd__fine" style="margin-top:8px">※ 上記の総額には、配送・設置・育成アドバイス料金が含まれています(' + a.short + 'お届け分)。決済時に別途の送料は加算されません。</p>' : '';
$d('#pdPay').innerHTML = '<div><span>商品代金(植物＋鉢)</span><span>' + yen(z.price) + '</span></div><div><span>配送・設置・育成アドバイス(' + a.short + ')</span><span>' + yen(a.fee) + '</span></div><div class="total"><span>お支払い総額(税込)</span><b>' + yen(total) + '</b></div>' + tail;
var stk = $('#stkPrice'); if (stk) { $('#stkLbl').textContent = k + 'サイズ ／ ' + a.short + ' 配送・設置込み'; stk.textContent = yen(total); }
var bf = GD.REASONS.filter(function (r) { return r.id === 'set'; })[0], bb = $('#pdBenefit');
if (bb) { var blk = bb.parentNode; if (F.BENEFIT === 'off') { blk.style.display = 'none'; } else { blk.style.display = ''; bb.innerHTML = '<ul class="items3">' + bf.items.map(function (t) { return '<li>' + t + '<span>標準付属</span></li>'; }).join('') + '</ul>'; } }
var cb = $('#pdCare');
if (cb) {
if (p.care) { cb.parentNode.style.display = ''; cb.innerHTML = '<dl class="specs"><div><dt>日照</dt><dd>' + p.care.light + '</dd></div><div><dt>温度</dt><dd>' + p.care.temp + '</dd></div><div><dt>水やり</dt><dd>' + p.care.water + '</dd></div></dl>'; }
else if (PROD) { cb.parentNode.style.display = 'none'; }
else cb.innerHTML = '<dl class="specs"><div><dt>日照</dt><dd>—</dd></div><div><dt>温度</dt><dd>—</dd></div><div><dt>水やり</dt><dd>—</dd></div></dl>' + todo('【入力待ち】' + p.name + 'の適した日照・温度・水やりは、専門家の監修内容を入力してください。');
}
var fb = $('#pdFit');
if (fb) {
var L = { 1: '暗めの場所でも育てやすい', 2: '明るい室内向き', 3: '日当たりの良い場所向き' };
if (PROD && !p.tag && !p.fitOk) fb.parentNode.style.display = 'none';
else { fb.parentNode.style.display = ''; fb.innerHTML = p.tag ? '<ul class="fit"><li>' + p.tag + '</li></ul>' : '<ul class="fit"><li>' + (d.place === 'out' ? '屋外向き' : '室内向き') + '</li><li>' + L[d.light] + '</li><li class="' + (d.temp === 'cool' ? '' : 'no') + '">' + (d.temp === 'cool' ? '冬の低めの室温にも比較的強い' : '冬は暖かい室内で管理') + '</li><li>' + (d.care === 'low' ? 'お手入れ手間少なめ' : '丁寧な管理向き') + '</li></ul>' + todo('※ 相性の表示は仮データです(専門家の監修後に確定)。'); }
}
var ab = $('#pdAdvice');
if (ab) {
var txt = (p.advice || window.__ADVICE || '') + (p.adviceL || '');
if (txt.indexOf('専門家コメントを入力') >= 0) txt = '';
if (!txt && PROD) ab.parentNode.style.display = 'none';
else { ab.parentNode.style.display = ''; ab.innerHTML = '<div class="advice"><div class="advice__by"><i>' + img(GD.DOCTOR.PHOTO, '') + '</i><div><b>植物のお医者さん</b><span>' + GD.DOCTOR.FACT + '</span></div></div>' + (txt ? '<p>' + txt + '</p>' : todo('【入力待ち】' + p.name + 'についての専門家コメント(選んだ理由・育てるときのポイントなど)を、商品ごとにこの欄へ入力します。')) + '</div>'; }
}
$d('#pdSvc').innerHTML = services();
$d('#pdFees').innerHTML = '<p class="note" style="margin-top:18px">' + D.LIMIT + '(全サイズ共通)</p>' + areaTable(z.price, ar);
bindLine(document);
if (PROD) $$('[data-area]').forEach(function (b) { b.onclick = function () { var u = shopUrl(GD.itemUrl(p.id, k, b.getAttribute('data-area'))); if (u) location.href = u; else window.open(GD.lineUrl('【Green Design】' + p.name + ' ' + k + 'サイズを' + GD.area(b.getAttribute('data-area')).short + 'へお届け希望です。'), '_blank'); }; });
else $$('[data-area]').forEach(function (b) { b.onclick = function () { fillInfo(p, k, b.getAttribute('data-area')); }; });
}
if ($('#pdTitle') && !PROD) {
var st = { id: byId(qs.p) ? qs.p : 'bengalensis', size: qs.s || 'M', area: 'B' };
var renderItem = function () {
var p = byId(st.id); if (p.sizes.indexOf(st.size) < 0) st.size = p.sizes[0];
var z = GD.size(st.size), a = GD.area(st.area), f = GD.formOf(p, st.size);
document.title = pname(p, st.size) + ' | Green Design';
$('#crumbName').textContent = p.name;
var note = (p.photoSize && p.photoSize !== st.size) ? '<div class="pd__phnote">掲載写真は' + GD.formOf(p, p.photoSize) + '(' + p.photoSize + 'サイズ)です。' + st.size + 'サイズは' + f + 'でお届けします。<span class="draft">S・M写真は準備中</span></div>' : '';
$('#pdPhoto').innerHTML = img(p.img, p.name, 'width="800" height="1000"') + note;
$('#pdTitle').textContent = p.name;
$('#pdForm').textContent = [f, st.size + 'サイズ(' + z.height + ')', '黒のエコ素材プランター付き'].filter(Boolean).join(' ／ ');
$('#pdCopy').innerHTML = p.copy + (p.tag ? '。<b style="font-weight:500">' + p.tag + '</b>です。' : '。');
$('#pdPlantPick').innerHTML = '<div class="pd__lbl"><span>植物を変えて確認(モックのみ)</span></div><div class="chips">' + plants().map(function (q) { return '<button type="button" class="chip" data-p="' + q.id + '" aria-pressed="' + (q.id === st.id) + '">' + q.name.replace('フィカス・', '').replace('ドラセナ・', '').replace('ストレリチア・', '') + '</button>'; }).join('') + '</div>';
$('#pdSizes').innerHTML = GD.SIZES.map(function (s) { var ok = p.sizes.indexOf(s.key) >= 0; return '<button type="button" class="sz" data-size="' + s.key + '" aria-pressed="' + (s.key === st.size) + '"' + (ok ? '' : ' disabled') + '><b>' + s.key + '</b><small>' + (ok ? s.height : '取扱いなし') + '</small></button>'; }).join('');
$('#pdPrice').innerHTML = '<div class="price__main"><span>植物＋鉢セット(税込)</span><b>' + yen(z.price) + '</b></div><div id="pdBd"></div>';
var url = shopUrl(GD.itemUrl(st.id, st.size, st.area)), total = z.price + a.fee;
var msg = '【Green Design】「' + pname(p, st.size) + '」' + st.size + 'サイズについて相談・注文したいです。\n・お届け先エリア：' + a.short + '\n・お支払い総額(税込)：' + yen(total) + '\n・設置場所：\n・お届け先の住所(市区)：';
[$('#pdBuy'), $('#stkBuy')].forEach(function (b) { if (url) { b.href = url; b.removeAttribute('data-line'); b.removeAttribute('data-msg'); b.target = '_blank'; } else { b.setAttribute('data-line', 'x'); b.setAttribute('data-msg', msg); } });
$('#pdBuy').textContent = url ? 'カートに入れる' : 'この内容でLINE相談・ご注文';
fillInfo(p, st.size, st.area);
$$('[data-area]').forEach(function (b) { b.onclick = function () { st.area = b.getAttribute('data-area'); renderItem(); }; });
$$('[data-p]').forEach(function (b) { b.onclick = function () { st.id = b.getAttribute('data-p'); renderItem(); }; });
$$('[data-size]').forEach(function (b) { b.onclick = function () { st.size = b.getAttribute('data-size'); renderItem(); }; });
};
renderItem();
}
if ($('#pdTitle') && PROD) {
document.body.classList.add('item-body');
var ttl = $('#pdTitle').textContent, p0 = plants().filter(function (q) { return ttl.indexOf(q.name) >= 0 || ttl.indexOf(q.name.replace(/^.*・/, '')) >= 0; })[0];
var m = /([SMLＳＭＬ])\s*サイズ/.exec(ttl), k0 = m ? m[1].replace('Ｓ', 'S').replace('Ｍ', 'M').replace('Ｌ', 'L') : null;
var dt = $('.item__detail');
if (dt) { var mk = '▼植物のお医者さんからのアドバイス', h = dt.innerHTML, i = h.indexOf(mk); if (i >= 0) { window.__ADVICE = h.slice(i + mk.length).replace(/^(<br\s*\/?>|\s)+/, ''); dt.innerHTML = h.slice(0, i); } }
if (p0 && k0 && GD.size(k0)) {
$('#pdForm').textContent = [GD.formOf(p0, k0), k0 + 'サイズ(' + GD.size(k0).height + ')', '黒のエコ素材プランター付き'].filter(Boolean).join(' ／ ');
var bp = ($('.price__main b') || {}).textContent || ''; var num = +bp.replace(/[^0-9]/g, '');
var a0 = D.AREAS.filter(function (a) { return a.place.split('・').some(function (w) { return ttl.indexOf(w.replace('県', '').replace('都', '')) >= 0; }); })[0];
if (!a0) { if (window.console) console.warn('[Green Design] 商品名にお届け先エリア(神奈川県/東京都/埼玉県・千葉県)が含まれていません: ' + ttl); a0 = D.AREAS[1]; }
var tot = GD.size(k0).price + a0.fee;
if (num && num !== tot && window.console) console.warn('[Green Design] BASEの商品価格(' + num + ')が 設定価格+配送料金(' + tot + ')と異なります。商品登録を確認してください。');
fillInfo(p0, k0, a0.key);
var lb = $('#pdLine'); if (lb) lb.setAttribute('data-msg', '【Green Design】「' + ttl + '」について相談したいです。\n・お届け先エリア(神奈川県/東京都/埼玉県/千葉県)：\n・設置場所：');
bindLine(document);
} else { ['#pdBenefit', '#pdCare', '#pdFit', '#pdAdvice'].forEach(function (q) { var e = $(q); if (e) e.parentNode.style.display = 'none'; }); $d('#pdSvc').innerHTML = services(); $d('#pdFees').innerHTML = ''; }
}
bindLine(document);
if (window.__HASH) { setTimeout(function () { var t = document.querySelector(window.__HASH); if (t) t.scrollIntoView(); }, 50); }
document.addEventListener('click', function (e) {
var a = e.target.closest && e.target.closest('a[href]'); if (!a) return;
var h = a.getAttribute('href'); if (/^(top|item)\.html/.test(h) && window.parent !== window) { e.preventDefault(); window.parent.postMessage({ go: h }, '*'); }
});
function revealAll() {
var els = $$('.rv:not(.is-in)'); if (!('IntersectionObserver' in window)) { els.forEach(function (e) { e.classList.add('is-in'); }); return; }
var io = new IntersectionObserver(function (es) { es.forEach(function (e) { if (e.isIntersecting) { e.target.classList.add('is-in'); io.unobserve(e.target); } }); }, { threshold: .08 });
els.forEach(function (e) { io.observe(e); });
}
revealAll();
})();