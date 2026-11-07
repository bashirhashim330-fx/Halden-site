/* Shop interface: views, bag drawer, checkout, wishlist, order history, dialogs and toasts. */
(function(){
var H = window.HAL, P = H.products, money = H.money;
var $ = function(s,r){ return (r||document).querySelector(s); };
var $$ = function(s,r){ return [].slice.call((r||document).querySelectorAll(s)); };
var reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
var MB = matchMedia('(max-width:899px)').matches;
function src(s){ return MB ? s.replace('.webp','-m.webp') : s; }
function countWord(n){ return ['No','One','Two','Three','Four','Five','Six','Seven','Eight','Nine','Ten'][n] || String(n); }
function esc(s){ return String(s == null ? '' : s).replace(/[&<>"']/g, function(c){ return {'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]; }); }
var ICON = {
  search:'<svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="1.8" aria-hidden="true"><circle cx="11" cy="11" r="6.5"/><path d="M16 16l5 5"/></svg>',
  heart:'<svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="1.8" aria-hidden="true"><path d="M12 20s-7-4.4-7-10a4 4 0 017-2.6A4 4 0 0119 10c0 5.6-7 10-7 10z"/></svg>',
  bag:'<svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="1.8" aria-hidden="true"><path d="M5 8h14l-1 12H6L5 8z"/><path d="M9 8V6a3 3 0 016 0v2"/></svg>'
};
var app, home, lastFocus = null, openName = '', toastN = 0;

/* ---------- overlays: bag drawer, confirm dialog, toasts, order confirmation, menu ---------- */
function build(){
  document.body.insertAdjacentHTML('beforeend',
    '<div class="veil" id="veil"></div>'+
    '<aside class="bag" id="cart" role="dialog" aria-modal="true" aria-labelledby="cart-t" tabindex="-1" inert><header><h3 id="cart-t">Your bag</h3><button class="x" data-act="close" aria-label="Close bag">✕</button></header><div id="cart-body"></div><div id="cart-foot"></div></aside>'+
    '<div class="modal" id="modal" role="alertdialog" aria-modal="true" aria-labelledby="m-t" aria-describedby="m-p" inert><div class="box" tabindex="-1"><h3 id="m-t"></h3><p id="m-p"></p><div class="row"><button class="ghost" data-m="no"></button><button class="solid" data-m="yes"></button></div></div></div>'+
    '<div id="toasts" role="status" aria-live="polite"></div>'+
    '<section class="done" id="done" role="dialog" aria-modal="true" aria-labelledby="done-t" tabindex="-1" inert></section>'+
    '<div class="busy" id="busy" role="status" inert><div><i></i><p>Placing your demo order…</p></div></div>'+
    '<section class="pack" id="pack" role="dialog" aria-modal="true" aria-labelledby="pk-t" inert><div class="pk"><p class="eyebrow">Demo order</p><h2 id="pk-t">Packing your order</h2><div class="bxrow" id="bxrow"></div><p class="pk-c" id="pk-c" aria-live="polite"></p></div></section>'+
    '<button class="skip" id="skip" type="button" data-act="skip" inert>Skip animation</button>');
  var menu = $('#menu');
  menu.setAttribute('role','dialog'); menu.setAttribute('aria-modal','true'); menu.setAttribute('aria-label','Menu'); menu.inert = true;
  function lk(h,t,n){ return '<a href="'+h+'" data-menu><span>'+t+'</span>'+(n?'<em>'+n+'</em>':'')+'</a>'; }
  menu.innerHTML = '<div class="gl"><header><a class="logo" href="#/" data-menu>HALDEN</a><button class="x" type="button" data-act="close" aria-label="Close menu">✕</button></header>'+
    '<form class="sq" data-form="menusearch" role="search"><input type="search" placeholder="Search watches" aria-label="Search watches" autocomplete="off"><button type="submit" aria-label="Search">'+ICON.search+'</button></form>'+
    '<nav aria-label="Main"><p class="gh">Shop</p>'+lk('#/','Home')+lk('#/collection','Collection',P.length)+
    '<a href="#/wishlist" data-menu><span>Wishlist</span><em id="m-w"></em></a><button type="button" data-act="open-cart" data-menu><span>Bag</span><em id="m-b"></em></button>'+lk('#/orders','Order history')+
    '<p class="gh">Brand</p>'+lk('#/story','Our story')+lk('#/care','Product care')+lk('#/faq','FAQ')+
    '<p class="gh">Support</p>'+lk('#/contact','Contact')+lk('#/policies','Sample policies')+'</nav><p class="fine">Concept store. Demo only.</p></div>';
}
function focusables(c){ return $$('a[href],button:not([disabled]),input:not([disabled]),select,textarea,summary,[tabindex]:not([tabindex="-1"])', c).filter(function(e){ return e.offsetParent !== null || e === document.activeElement; }); }
function openOv(name){
  closeOv(true);
  lastFocus = document.activeElement; openName = name;
  var el = name==='cart' ? $('#cart') : name==='menu' ? $('#menu') : name==='modal' ? $('#modal') : $('#done');
  el.inert = false;
  if(name==='cart'){ $('#veil').classList.add('open'); el.classList.add('open'); }
  if(name==='menu'){ el.classList.add('on'); $('#veil').classList.add('open'); $('#mb').setAttribute('aria-expanded','true'); }
  if(name==='modal'){ el.classList.add('open'); $('#veil').classList.add('open'); }
  if(name==='done'){ el.classList.add('open'); }
  setTimeout(function(){ var f = (name==='modal') ? $('.box',el) : (name==='done') ? el : (focusables(el)[0] || el); if(f) f.focus({ preventScroll:true }); }, 40);
}
function closeOv(quiet){
  if(!openName) return;
  var el = openName==='cart' ? $('#cart') : openName==='menu' ? $('#menu') : openName==='modal' ? $('#modal') : $('#done');
  el.classList.remove('open','on'); el.inert = true; $('#veil').classList.remove('open'); $('#mb').setAttribute('aria-expanded','false');
  var was = openName; openName = '';
  if(!quiet && lastFocus && was !== 'done' && document.body.contains(lastFocus)) try{ lastFocus.focus(); }catch(e){}
}
document.addEventListener('keydown', function(e){
  if(!openName) return;
  if(e.key === 'Escape'){ e.preventDefault(); if(openName==='modal') resolveConfirm(false); else if(openName!=='done') closeOv(); return; }
  if(e.key === 'Tab'){
    var el = openName==='cart' ? $('#cart') : openName==='menu' ? $('#menu') : openName==='modal' ? $('#modal') : $('#done');
    var f = focusables(el); if(!f.length) return;
    var first = f[0], last = f[f.length-1];
    if(e.shiftKey && (document.activeElement === first || document.activeElement === el)){ e.preventDefault(); last.focus(); }
    else if(!e.shiftKey && document.activeElement === last){ e.preventDefault(); first.focus(); }
  }
});
function toast(msg, o){
  o = o || {}; var host = $('#toasts'), id = 't' + (++toastN);
  var t = document.createElement('div'); t.className = 'toast' + (o.kind ? ' ' + o.kind : ''); t.id = id;
  t.innerHTML = '<span>'+esc(msg)+'</span>' + (o.label ? '<button type="button">'+esc(o.label)+'</button>' : '');
  if(o.label) $('button', t).addEventListener('click', function(){ t.remove(); if(o.fn) o.fn(); });
  host.appendChild(t); while(host.children.length > 3) host.firstChild.remove();
  requestAnimationFrame(function(){ t.classList.add('in'); });
  setTimeout(function(){ t.classList.remove('in'); setTimeout(function(){ t.remove(); }, 400); }, o.label ? 5200 : 3000);
}
var confirmRes = null;
function ask(o){
  return new Promise(function(res){
    confirmRes = res; $('#m-t').textContent = o.title; $('#m-p').textContent = o.text;
    var n = $('[data-m=no]'), y = $('[data-m=yes]'); n.textContent = o.no || 'Cancel'; y.textContent = o.yes || 'Confirm';
    var keep = openName; openOv('modal'); if(keep) lastFocus = document.activeElement;
  });
}
function resolveConfirm(v){ if(!confirmRes) return; var r = confirmRes; confirmRes = null; closeOv(); r(v); }

/* ---------- badges and bag drawer ---------- */
var pending = 0;
function badges(){
  var c = Math.max(0, H.cart.count() - pending), w = H.wish.list().length, cn = $('#cn'), wn = $('#wn');
  cn.textContent = c || ''; wn.textContent = w || ''; cn.hidden = !c; wn.hidden = !w;
  var mw = $('#m-w'), mb = $('#m-b'); if(mw) mw.textContent = w || ''; if(mb) mb.textContent = c || '';
}
function pulse(){ var b = $('#cb'); b.classList.remove('pulse'); void b.offsetWidth; b.classList.add('pulse'); }
function renderCart(){
  var lines = H.cart.lines(), body = $('#cart-body'), foot = $('#cart-foot'), n = H.cart.count();
  $('#cart-t').textContent = 'Your bag' + (n ? ' (' + n + ')' : '');
  if(!lines.length){
    body.innerHTML = '<div class="empty"><svg viewBox="0 0 64 64" width="64" height="64" fill="none" stroke="currentColor" stroke-width="1.4" aria-hidden="true"><circle cx="32" cy="32" r="14"/><path d="M32 24v8l5 3M26 8h12l2 10H24zM26 56h12l2-10H24z"/></svg><h4>Your bag is empty</h4><p>Pick a watch from the collection and it will wait here for you.</p><a class="solid" href="#/collection" data-act="close">Browse the collection</a></div>';
    foot.innerHTML = ''; return;
  }
  body.innerHTML = lines.map(function(l){
    var p = l.p;
    return '<div class="cl" data-id="'+p.id+'"><a class="cli" href="#/watch/'+p.id+'" data-act="close"><img src="'+src(p.img.alone)+'" alt=""></a><div class="cld"><a href="#/watch/'+p.id+'" data-act="close"><b>'+esc(p.code)+' / '+esc(p.name)+'</b></a><small>'+esc(p.title)+'</small>'+
      '<div class="qty" role="group" aria-label="Quantity for '+esc(p.name)+'"><button type="button" data-act="dec" data-id="'+p.id+'" aria-label="Decrease quantity">−</button><span aria-live="polite">'+l.qty+'</span><button type="button" data-act="inc" data-id="'+p.id+'" aria-label="Increase quantity"'+(l.qty>=99?' disabled':'')+'>+</button></div></div>'+
      '<div class="clp"><b>'+money(l.total)+'</b><small>'+money(p.price)+' each</small><button type="button" class="lnk" data-act="rm" data-id="'+p.id+'" aria-label="Remove '+esc(p.name)+' from bag">Remove</button></div></div>';
  }).join('');
  foot.innerHTML = '<div class="tot"><span>Subtotal</span><b>'+money(H.cart.subtotal())+'</b></div><p class="fine">Shipping is chosen at checkout. Sample settings.</p>'+
    '<button class="solid" type="button" data-act="checkout">Proceed to checkout</button><button class="ghost" type="button" data-act="close">Continue shopping</button><button class="lnk" type="button" data-act="clear">Clear bag</button>';
}
H.on('cart', function(){ badges(); renderCart(); if(location.hash === '#/checkout') checkoutRefresh(); });
H.on('wish', function(){ badges(); $$('.heart').forEach(function(b){ var on = H.wish.has(b.dataset.id); b.classList.toggle('on', on); b.textContent = on ? '♥' : '♡'; b.setAttribute('aria-pressed', on); b.setAttribute('aria-label', (on?'Remove ':'Save ')+(H.byId(b.dataset.id).name)+(on?' from':' to')+' wishlist'); }); if(location.hash === '#/wishlist') route(); });
function flyToBag(img, done){
  var cb = $('#cb');
  if(!img || reduce || !cb || !img.getBoundingClientRect){ done(); return; }
  var r = img.getBoundingClientRect(), t = cb.getBoundingClientRect();
  if(!r.width || !r.height || r.bottom < 0 || r.top > innerHeight){ done(); return; }
  var c = document.createElement('img'); c.className = 'flyb'; c.src = img.currentSrc || img.src; c.alt = '';
  c.style.cssText = 'left:'+r.left+'px;top:'+r.top+'px;width:'+r.width+'px;height:'+r.height+'px';
  document.body.appendChild(c);
  var dx = t.left + t.width/2 - (r.left + r.width/2), dy = t.top + t.height/2 - (r.top + r.height/2), arc = Math.min(180, Math.abs(dy) * .35 + 70);
  var a = c.animate([
    { transform:'translate(0,0) scale(1) rotate(0deg)', opacity:1 },
    { transform:'translate('+(dx*.5)+'px,'+(dy*.5-arc)+'px) scale(.42) rotate(-8deg)', opacity:1, offset:.5 },
    { transform:'translate('+dx+'px,'+dy+'px) scale(.05) rotate(-16deg)', opacity:.85 }
  ], { duration:1050, easing:'cubic-bezier(.5,.05,.25,1)' });
  setTimeout(function(){ cb.classList.add('open'); }, 420);
  var ended = false;
  function end(){ if(ended) return; ended = true; c.remove(); cb.classList.remove('open'); cb.classList.remove('catch'); void cb.offsetWidth; cb.classList.add('catch'); done(); }
  a.onfinish = end; setTimeout(end, 1500);
}
function addToBag(id, btn, img){
  var p = H.byId(id); if(!p) return;
  pending++; var q = H.cart.add(id, 1);
  if(btn){ var old = btn.dataset.t || btn.textContent; btn.dataset.t = old; btn.classList.add('added'); btn.textContent = 'Added ✓'; setTimeout(function(){ btn.classList.remove('added'); btn.textContent = old; }, 1500); }
  flyToBag(img, function(){
    pending = Math.max(0, pending - 1); badges(); pulse();
    toast(p.name + ' added to your bag' + (q > 1 ? ' (' + q + ')' : ''), { label:'View bag', fn:function(){ openOv('cart'); } });
  });
}

/* ---------- shared pieces ---------- */
function heart(p){ var on = H.wish.has(p.id); return '<button class="heart'+(on?' on':'')+'" type="button" data-act="wish" data-id="'+p.id+'" aria-pressed="'+on+'" aria-label="'+(on?'Remove ':'Save ')+esc(p.name)+(on?' from':' to')+' wishlist">'+(on?'♥':'♡')+'</button>'; }
function card(p){
  var sel = H.selected === p.id;
  return '<article class="pcard tile" data-id="'+p.id+'"><a class="tm" href="#/watch/'+p.id+'" aria-label="View '+esc(p.name)+'"><img class="a" src="'+src(p.img.alone)+'" alt="'+esc(p.name)+' watch" loading="lazy"><img class="b" src="'+src(p.img.dial)+'" alt="" loading="lazy">'+(sel?'<span class="tag">Selected</span>':'')+'</a>'+heart(p)+
    '<div class="tcap glass"><div class="pr"><a class="pn" href="#/watch/'+p.id+'">'+esc(p.name)+'</a><b>'+money(p.price)+'</b></div><small>'+esc(p.code)+' · '+esc(p.title)+'</small><div class="pa"><button class="mini" type="button" data-act="add" data-id="'+p.id+'">Add to bag</button><a class="lnk" href="#/watch/'+p.id+'">Details</a></div></div></article>';
}
function foot(){
  return '<footer class="sfoot"><div class="fg"><div><p class="eyebrow">Halden</p><p>A concept watch brand. This site is a front-end demonstration: no real orders, payments or shipping.</p>'+
    '<form class="nl" data-form="news" novalidate><input type="email" placeholder="Your email" aria-label="Email address for the newsletter" autocomplete="email"><button class="solid" type="submit">Join</button><p class="err" role="alert"></p><p class="fine">Demo only. Nobody is subscribed to a real list.</p></form></div>'+
    '<div><h4>Shop</h4><a href="#/collection">Collection</a><a href="#/wishlist">Wishlist</a><a href="#/orders">Order history</a><button class="lnk" type="button" data-act="open-cart">Bag</button></div>'+
    '<div><h4>Brand</h4><a href="#/story">Our story</a><a href="#/care">Product care</a><a href="#/faq">FAQ</a></div>'+
    '<div><h4>Support</h4><a href="#/contact">Contact</a><a href="#/policies">Shipping, returns and privacy</a><small class="fine">Sample policies. Replace before launch.</small></div></div>'+
    '<div class="big" aria-hidden="true">Halden</div><div class="fine2"><span>Concept brand. Not a real shop.</span><span>Prices and specifications are samples.</span></div></footer>';
}
function page(title, inner, cls){ return '<section class="page '+(cls||'')+'"><div class="wrap">'+inner+'</div></section>'+foot(); }
function eyebrow(t){ return '<p class="eyebrow">'+esc(t)+'</p>'; }
function emptyState(h, t, a){ return '<div class="empty roomy"><h2>'+esc(h)+'</h2><p>'+esc(t)+'</p>'+(a||'')+'</div>'; }

/* ---------- collection with search, filters and sorting ---------- */
var CS = { q:'', min:'', max:'', dial:[], strap:[], metal:[], sort:'rec', panel:false };
function norm(s){ return String(s).toLowerCase().replace(/[^a-z0-9]/g,''); }
function num(v){ v = String(v).trim(); return v !== '' && isFinite(+v) && +v >= 0 ? +v : null; }
function uniq(k){ var o = []; P.forEach(function(p){ if(o.indexOf(p[k]) < 0) o.push(p[k]); }); return o; }
function results(){
  var q = norm(CS.q), mn = num(CS.min), mx = num(CS.max);
  var r = P.filter(function(p){
    if(q && norm(p.name+p.code+p.title+p.metal+p.dial+p.strap).indexOf(q) < 0) return false;
    if(mn !== null && p.price < mn) return false; if(mx !== null && p.price > mx) return false;
    if(CS.dial.length && CS.dial.indexOf(p.dial) < 0) return false;
    if(CS.strap.length && CS.strap.indexOf(p.strap) < 0) return false;
    if(CS.metal.length && CS.metal.indexOf(p.metal) < 0) return false;
    return true; });
  if(CS.sort === 'pa') r.sort(function(a,b){ return a.price - b.price; });
  if(CS.sort === 'pd') r.sort(function(a,b){ return b.price - a.price; });
  if(CS.sort === 'na') r.sort(function(a,b){ return a.name.localeCompare(b.name); });
  return r;
}
function chips(){
  var c = [];
  if(CS.q.trim()) c.push(['q','', 'Search: ' + CS.q.trim()]);
  if(num(CS.min) !== null) c.push(['min','', 'From ' + money(num(CS.min))]);
  if(num(CS.max) !== null) c.push(['max','', 'Up to ' + money(num(CS.max))]);
  ['dial','strap','metal'].forEach(function(k){ CS[k].forEach(function(v){ c.push([k, v, (k==='dial'?'Dial: ':k==='strap'?'Strap: ':'Case: ') + v]); }); });
  return c;
}
function renderResults(){
  var r = results(), c = chips();
  $('#pg').className = r.length === P.length && r.length > 3 ? 'bento' : 'pg';
  $('#pg').innerHTML = r.length ? r.map(card).join('') : '<div class="empty roomy wide"><h2>No watches match</h2><p>Try a different name or model number, or remove a filter.</p><button class="solid" type="button" data-act="clear-filters">Clear all filters</button></div>';
  $('#rc').textContent = r.length + (r.length === 1 ? ' watch' : ' watches') + (c.length ? ' match your filters' : '');
  $('#chips').innerHTML = c.map(function(x){ return '<button class="chip" type="button" data-act="rmf" data-k="'+x[0]+'" data-v="'+esc(x[1])+'" aria-label="Remove filter '+esc(x[2])+'">'+esc(x[2])+' <i>✕</i></button>'; }).join('') + (c.length ? '<button class="lnk" type="button" data-act="clear-filters">Clear all</button>' : '');
  var cq = $('#cq'); if(cq) cq.hidden = !CS.q;
  $$('[data-f]').forEach(function(b){ var on = CS[b.dataset.k].indexOf(b.dataset.f) > -1; b.classList.toggle('on', on); b.setAttribute('aria-pressed', on); });
  $('#ftog').textContent = 'Filters' + (c.filter(function(x){ return x[0] !== 'q'; }).length ? ' (' + c.filter(function(x){ return x[0] !== 'q'; }).length + ')' : '');
}
function group(k, label){
  return '<fieldset><legend>'+label+'</legend><div class="opts">'+uniq(k).map(function(v){ return '<button class="opt" type="button" data-f="'+esc(v)+'" data-k="'+k+'" aria-pressed="false">'+esc(v)+'</button>'; }).join('')+'</div></fieldset>';
}
var colScroll = 0, lastCol = 0, prevH = '';
window.addEventListener('scroll', function(){ if(!app.hidden && app.dataset.h === '#/collection') lastCol = window.scrollY; }, { passive:true });
function viewCollection(){
  var rec = H.recent.list();
  var html = eyebrow('The collection') + '<h1 class="ph">'+countWord(H.products.length)+' watches</h1>'+
    '<div class="ctl"><div class="srch"><label class="sr" for="q">Search watches</label>'+ICON.search+'<input id="q" type="search" placeholder="Search name or model, e.g. Azure or H-02" value="'+esc(CS.q)+'" autocomplete="off"><button id="cq" class="x" type="button" data-act="clear-q" aria-label="Clear search" hidden>✕</button></div>'+
    '<button class="ghost" id="ftog" type="button" data-act="ftog" aria-expanded="'+CS.panel+'" aria-controls="fp">Filters</button>'+
    '<label class="sort"><span>Sort</span><select id="sort"><option value="rec">Recommended</option><option value="pa">Price, low to high</option><option value="pd">Price, high to low</option><option value="na">Name, A to Z</option></select></label></div>'+
    '<div class="fpanel'+(CS.panel?' open':'')+'" id="fp"><fieldset><legend>Price (USD)</legend><div class="rng"><label class="sr" for="minp">Minimum price</label><input id="minp" inputmode="numeric" placeholder="Min" value="'+esc(CS.min)+'"><span>to</span><label class="sr" for="maxp">Maximum price</label><input id="maxp" inputmode="numeric" placeholder="Max" value="'+esc(CS.max)+'"></div></fieldset>'+
    group('dial','Dial colour')+group('strap','Strap')+group('metal','Case')+'</div>'+
    '<div class="chips" id="chips"></div><p class="rc" id="rc" aria-live="polite"></p><div class="pg" id="pg"></div>'+
    (rec.length ? '<h2 class="sh">Recently viewed</h2><div class="pg small">'+rec.map(function(id){ return card(H.byId(id)); }).join('')+'</div>' : '');
  return { html:page('Collection', html), after:function(){ $('#sort').value = CS.sort; renderResults(); if(H.focusSearch){ H.focusSearch = false; var q = $('#q'); q.focus(); } else if(prevH.indexOf('#/watch/') === 0 && lastCol > 0){ window.scrollTo(0, lastCol); } } };
}

/* ---------- product detail ---------- */
function viewProduct(id){
  var p = H.byId(id);
  if(!p) return { html:page('Not found', emptyState('Watch not found','That model does not exist.','<a class="solid" href="#/collection">Back to the collection</a>')) };
  H.selected = id; H.recent.push(id);
  var shots = [{ src:src(p.img.alone), label:'Watch' }].concat(p.gallery.map(function(g){ return { src:src(g.src), label:g.label || 'Photo' }; }));
  var others = P.filter(function(x){ return x.id !== id; }), rec = H.recent.list().filter(function(x){ return x !== id; });
  var inBag = H.cart.qty(id);
  var html = '<nav class="crumb" aria-label="Breadcrumb"><a href="#/collection" data-back>← Collection</a><span>/</span><span>'+esc(p.code)+'</span></nav>'+
    '<div class="pd"><div class="gal"><div class="gmain"><img id="gm" src="'+src(p.img.alone)+'" alt="'+esc(p.name)+' watch"></div><div class="gth" role="group" aria-label="Product photos">'+
      (shots.length > 1 ? shots.map(function(s,i){ return '<button type="button" class="'+(i?'':'on')+'" data-act="shot" data-s="'+esc(s.src)+'" data-alt="'+esc(p.name+' – '+s.label)+'" aria-pressed="'+(i?'false':'true')+'" aria-label="'+esc(s.label)+'"><img src="'+esc(s.src)+'" alt="" onerror="var b=this.closest(\'button\');if(b)b.remove()"></button>'; }).join('') : '')+'</div></div>'+
    '<div class="inf"><p class="eyebrow">'+esc(p.code)+' · Selected watch</p><h1 class="ph">'+esc(p.name)+'</h1><p class="sub">'+esc(p.title)+'</p><p class="price">'+money(p.price)+'</p>'+
      '<p class="avail"><i></i>'+H.availability+'</p><p class="desc">'+esc(p.desc)+'</p>'+
      '<dl class="kv"><div><dt>Colour</dt><dd>'+esc(p.metal)+' case, '+esc(p.dial.toLowerCase())+' dial</dd></div><div><dt>Strap</dt><dd>'+esc(p.strapNote)+'</dd></div><div><dt>Colourway</dt><dd>One colourway available</dd></div></dl>'+
      '<div class="buy"><button class="solid" type="button" data-act="add" data-id="'+p.id+'">Add to bag</button><button class="ghost" type="button" data-act="buynow" data-id="'+p.id+'">Buy now</button>'+heart(p)+'</div>'+
      '<p class="fine" id="inbag">'+(inBag ? inBag + ' in your bag' : '')+'</p>'+
      '<table class="specs"><caption>Specifications <small>Sample data. Replace with real specifications.</small></caption><tbody>'+p.specs.map(function(r){ return '<tr><th scope="row">'+esc(r[0])+'</th><td>'+esc(r[1])+'</td></tr>'; }).join('')+'</tbody></table></div></div>'+
    '<h2 class="sh">You may also like</h2><div class="pg small">'+others.map(card).join('')+'</div>'+
    (rec.length ? '<h2 class="sh">Recently viewed</h2><div class="pg small">'+rec.map(function(x){ return card(H.byId(x)); }).join('')+'</div>' : '');
  return { html:page(p.name, html), title:p.name + ' – ' + p.code };
}

/* ---------- wishlist ---------- */
function viewWishlist(){
  var l = H.wish.list().map(H.byId);
  var html = eyebrow('Saved') + '<h1 class="ph">Your wishlist</h1>' + (l.length ?
    '<div class="pg">'+l.map(card).join('')+'</div>'
    : emptyState('Nothing saved yet','Tap the heart on any watch to keep it here.','<a class="solid" href="#/collection">Browse the collection</a>'));
  return { html:page('Wishlist', html) };
}

/* ---------- checkout: information, review, demo order ---------- */
var CK = { step:1, ship:'std', busy:false, err:{} };
var FIELDS = [['name','Full name','text','name'],['email','Email address','email','email'],['phone','Phone number','tel','tel']];
function shipOpt(id){ for(var i=0;i<H.shipping.length;i++) if(H.shipping[i].id === id) return H.shipping[i]; return H.shipping[0]; }
function validate(v){
  var e = {};
  if(String(v.name||'').trim().length < 2) e.name = 'Enter your full name.';
  if(!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(String(v.email||'').trim())) e.email = 'Enter a valid email address, like name@example.com.';
  var d = String(v.phone||'').replace(/\D/g,''); if(d.length < 7 || d.length > 15) e.phone = 'Enter a phone number with 7 to 15 digits.';
  if(H.countries.indexOf(v.country) < 0) e.country = 'Choose a country.';
  if(String(v.state||'').trim().length < 2) e.state = 'Enter your state or region.';
  if(String(v.city||'').trim().length < 2) e.city = 'Enter your city.';
  if(String(v.street||'').trim().length < 5) e.street = 'Enter your street address.';
  if(String(v.notes||'').length > 300) e.notes = 'Keep delivery notes under 300 characters.';
  return e;
}
function readForm(){ var v = {}; $$('[data-field]').forEach(function(i){ v[i.dataset.field] = i.value; }); return v; }
function saveDraft(){ var d = H.draft.get(); $$('[data-field]').forEach(function(i){ d[i.dataset.field] = i.value; }); d.ship = CK.ship; H.draft.set(d); }
function fld(id,label,type,ac,v,e,extra){
  return '<div class="fld'+(e?' bad':'')+'"><label for="f-'+id+'">'+label+'</label>'+
    '<input id="f-'+id+'" data-field="'+id+'" type="'+type+'" autocomplete="'+ac+'" value="'+esc(v||'')+'"'+(e?' aria-invalid="true"':'')+' aria-describedby="e-'+id+'"'+(extra||'')+'><p class="err" id="e-'+id+'">'+esc(e||'')+'</p></div>';
}
function summary(){
  var lines = H.cart.lines(), sh = shipOpt(CK.ship), sub = H.cart.subtotal();
  return '<aside class="sum" aria-label="Order summary"><h2>Order summary</h2>'+lines.map(function(l){ return '<div class="sl"><img src="'+src(l.p.img.alone)+'" alt=""><div><b>'+esc(l.p.code)+' / '+esc(l.p.name)+'</b><small>'+l.qty+' × '+money(l.p.price)+'</small></div><span>'+money(l.total)+'</span></div>'; }).join('')+
    '<div class="row"><span>Subtotal</span><b>'+money(sub)+'</b></div><div class="row"><span>Shipping (sample)</span><b>'+money(sh.cost)+'</b></div><div class="row total"><span>Total</span><b>'+money(sub + sh.cost)+'</b></div>'+
    '<button class="lnk" type="button" data-act="open-cart">Edit bag</button><p class="fine">Demo order. No payment is taken.</p></aside>';
}
function viewCheckout(){
  if(!H.cart.count()) return { html:page('Checkout', eyebrow('Checkout') + emptyState('Your bag is empty','Add a watch before checking out.','<a class="solid" href="#/collection">Browse the collection</a>')) };
  var d = H.draft.get(); if(d.ship && H.shipping.some(function(s){ return s.id === d.ship; })) CK.ship = d.ship;
  var steps = '<ol class="steps" aria-label="Checkout steps"><li class="'+(CK.step===1?'on':'done')+'">1 Details</li><li class="'+(CK.step===2?'on':'')+'">2 Review</li><li>3 Confirmation</li></ol>';
  var form;
  if(CK.step === 1){
    var e = CK.err;
    form = '<form id="ckf" novalidate><h2>Customer</h2>'+FIELDS.map(function(f){ return fld(f[0],f[1],f[2],f[3],d[f[0]],e[f[0]]); }).join('')+
      '<h2>Delivery</h2><div class="fld'+(e.country?' bad':'')+'"><label for="f-country">Country</label><select id="f-country" data-field="country" autocomplete="country-name" aria-describedby="e-country"'+(e.country?' aria-invalid="true"':'')+'><option value="">Choose a country</option>'+H.countries.map(function(c){ return '<option'+(d.country===c?' selected':'')+'>'+esc(c)+'</option>'; }).join('')+'</select><p class="err" id="e-country">'+esc(e.country||'')+'</p></div>'+
      '<div class="two">'+fld('state','State or region','text','address-level1',d.state,e.state)+fld('city','City','text','address-level2',d.city,e.city)+'</div>'+
      fld('street','Street address','text','street-address',d.street,e.street)+
      '<div class="fld'+(e.notes?' bad':'')+'"><label for="f-notes">Delivery instructions <small>(optional)</small></label><textarea id="f-notes" data-field="notes" rows="3" maxlength="320" aria-describedby="e-notes">'+esc(d.notes||'')+'</textarea><p class="err" id="e-notes">'+esc(e.notes||'')+'</p></div>'+
      '<h2>Shipping</h2><p class="fine">Sample shipping settings. Replace with your real rates and policies.</p><div class="ship" role="radiogroup" aria-label="Shipping options">'+H.shipping.map(function(s){ return '<label class="sopt'+(CK.ship===s.id?' on':'')+'"><input type="radio" name="ship" value="'+s.id+'"'+(CK.ship===s.id?' checked':'')+'><span><b>'+esc(s.label)+'</b><small>'+esc(s.note)+'</small></span><em>'+money(s.cost)+'</em></label>'; }).join('')+'</div>'+
      '<p class="err banner" id="ck-err" role="alert">'+(Object.keys(e).length ? 'Please fix the highlighted fields.' : '')+'</p><button class="solid" type="submit">Review order</button></form>';
  } else {
    var v = H.draft.get(), sh = shipOpt(CK.ship);
    form = '<div class="rev"><h2>Review your order</h2><div class="rb"><h3>Customer</h3><p>'+esc(v.name)+'<br>'+esc(v.email)+'<br>'+esc(v.phone)+'</p><button class="lnk" type="button" data-act="ck-edit">Edit</button></div>'+
      '<div class="rb"><h3>Delivery</h3><p>'+esc(v.street)+'<br>'+esc(v.city)+', '+esc(v.state)+'<br>'+esc(v.country)+(v.notes ? '<br><em>'+esc(v.notes)+'</em>' : '')+'</p><button class="lnk" type="button" data-act="ck-edit">Edit</button></div>'+
      '<div class="rb"><h3>Shipping</h3><p>'+esc(sh.label)+' (sample) · '+money(sh.cost)+'</p><button class="lnk" type="button" data-act="ck-edit">Edit</button></div>'+
      '<p class="err banner" id="ck-err" role="alert"></p><div class="acts"><button class="ghost" type="button" data-act="ck-edit">Back to details</button><button class="solid" type="button" id="place" data-act="place">Place demo order · '+money(H.cart.subtotal() + sh.cost)+'</button></div><p class="fine">This creates a demonstration order stored only in this browser.</p></div>';
  }
  return { html:page('Checkout', eyebrow('Checkout') + '<h1 class="ph">Checkout</h1>' + steps + '<div class="ck"><div class="ckm">'+form+'</div>'+summary()+'</div>'), after:function(){ $$('[data-field]').forEach(function(i){ i.addEventListener('input', saveDraft); i.addEventListener('change', saveDraft); }); $$('input[name=ship]').forEach(function(r){ r.addEventListener('change', function(){ CK.ship = r.value; saveDraft(); $$('.sopt').forEach(function(l){ l.classList.toggle('on', $('input', l).checked); }); $('.sum').outerHTML = summary(); }); }); } };
}
function checkoutRefresh(){ if(!$('.sum') && H.cart.count()) { route(); return; } if(!H.cart.count()){ route(); return; } var s = $('.sum'); if(s) s.outerHTML = summary(); var pb = $('#place'); if(pb) pb.textContent = 'Place demo order · ' + money(H.cart.subtotal() + shipOpt(CK.ship).cost); }
function submitInfo(){
  saveDraft(); var v = readForm(), e = validate(v); CK.err = e;
  if(Object.keys(e).length){ route(); setTimeout(function(){ var b = $('.fld.bad input, .fld.bad select, .fld.bad textarea'); if(b) b.focus(); }, 30); return; }
  CK.step = 2; route();
}
function placeOrder(){
  if(CK.busy) return;
  var lines = H.cart.lines(); if(!lines.length){ toast('Your bag is empty.'); route(); return; }
  var v = H.draft.get(), e = validate(v); if(Object.keys(e).length){ CK.step = 1; CK.err = e; route(); return; }
  CK.busy = true; var pb = $('#place'); if(pb){ pb.disabled = true; pb.textContent = 'Placing order…'; }
  $('#busy').inert = false; $('#busy').classList.add('on');
  setTimeout(function(){
    var order;
    try{
      var sh = shipOpt(CK.ship), sub = H.cart.subtotal();
      order = { ref:H.orders.newRef(), createdAt:new Date().toISOString(), status:'Demo order created',
        items:lines.map(function(l){ return { id:l.p.id, code:l.p.code, name:l.p.name, title:l.p.title, price:l.p.price, qty:l.qty, total:l.total }; }),
        subtotal:sub, shipping:{ id:sh.id, label:sh.label, cost:sh.cost }, total:sub + sh.cost,
        customer:{ name:String(v.name).trim(), email:String(v.email).trim(), phone:String(v.phone).trim() },
        delivery:{ country:v.country, state:String(v.state).trim(), city:String(v.city).trim(), street:String(v.street).trim(), notes:String(v.notes||'').trim() } };
      if(!H.orders.save(order)) throw new Error('save failed');
    }catch(x){
      CK.busy = false; $('#busy').classList.remove('on'); $('#busy').inert = true; if(pb){ pb.disabled = false; pb.textContent = 'Place demo order'; }
      var b = $('#ck-err'); if(b) b.textContent = 'We could not save your demo order, so nothing was changed and your bag is safe. Please try again.';
      toast('Order could not be saved. Your bag is unchanged.', { kind:'bad' }); return;
    }
    H.cart.clear(); H.draft.clear(); CK = { step:1, ship:'std', busy:false, err:{} };
    $('#busy').classList.remove('on'); $('#busy').inert = true;
    playOrder(order);
  }, 650);
}
var pk = { timers:[], done:null, finished:false };
function pkClear(){ pk.timers.forEach(clearTimeout); pk.timers = []; }
function pkAt(ms, fn){ pk.timers.push(setTimeout(fn, ms)); }
/* Real box photos (assets/img). Box bounds inside each 1000x1250 photo, used to line the closed box up with the open one. */
var BXO = { azure:[142,32,860,1207], cocoa:[111,13,890,1219], onyx:[108,33,892,1220], verde:[138,37,887,1236], ivory:[130,26,869,1214] }, BXC = [74,222,928,1066], SEAM = .62;
function packOrder(order){
  closeOv(true); H.lastOrder = order;
  var ov = $('#pack'), row = $('#bxrow'), cnt = $('#pk-c'), sk = $('#skip'), fast = reduce ? 0 : 1;
  var total = order.items.reduce(function(n,i){ return n + i.qty; }, 0), ids = [];
  order.items.forEach(function(l){ for(var q = 0; q < l.qty && ids.length < 8; q++) ids.push(l.id); });
  var more = Math.max(0, total - ids.length), n = ids.length;
  function label(k){ return k + ' of ' + total + (total === 1 ? ' watch' : ' watches') + ' sealed'; }
  pk.finished = false; pkClear(); var run = pk.run = (pk.run || 0) + 1;
  ov.classList.remove('closed'); ov.inert = false; ov.classList.add('on'); sk.inert = false; sk.classList.add('on');
  $('#pk-t').textContent = 'Packing your order'; cnt.textContent = label(0);
  /* size the boxes so they all fit on screen */
  var cols = Math.min(n, innerWidth < 600 ? 3 : 4), rows = Math.ceil(n / cols);
  var w = Math.max(72, Math.floor(Math.min(300, Math.min(innerWidth * .94, 1100) / cols - 12, innerHeight * .5 / rows / 1.25)));
  row.style.setProperty('--bw', w + 'px'); row.style.maxWidth = (cols * (w + 12)) + 'px';
  row.innerHTML = ids.map(function(id, k){
    var o = BXO[id] || BXO.azure, c = BXC, sc = (o[2] - o[0]) / (c[2] - c[0]);
    var cl = ((o[0] + o[2]) / 2 - (c[0] + c[2]) / 2 * sc) / 10, ct = (o[3] - c[3] * sc) / 12.5;        /* closed photo: left/top in % of the box frame */
    var bx0 = cl + c[0] * sc / 10, bw = (c[2] - c[0]) * sc / 10, by0 = ct + c[1] * sc / 12.5, bh = (c[3] - c[1]) * sc / 12.5;
    var p = H.byId(id);
    return '<div class="pbx" data-k="'+k+'"><div class="pbs"></div><div class="pbi">'+
      '<img class="po" src="'+src('assets/img/box-'+id+'.webp')+'" alt="Open Halden box with the '+esc(p ? p.name : '')+' watch inside">'+
      '<img class="pc" src="'+src('assets/img/box-closed.webp')+'" alt="Closed Halden box" style="left:'+cl+'%;top:'+ct+'%;width:'+(sc * 100)+'%">'+
      '<div class="pbb" style="left:'+(bx0 + bw * .41)+'%;width:'+(bw * .18)+'%;top:'+by0+'%;height:'+bh+'%"></div>'+
      '<div class="pbk" style="left:'+(bx0 + bw * .5)+'%;top:'+(by0 + bh * SEAM)+'%;width:'+(bw * .22)+'%"><b>H</b></div>'+
      (more && k === n - 1 ? '<span class="qc">+'+more+'</span>' : '')+'</div></div>';
  }).join('');
  function finish(){
    if(pk.finished) return; pk.finished = true; pkClear(); sk.classList.remove('on'); sk.inert = true;
    $('#pk-t').textContent = 'Sealed with care'; cnt.textContent = label(total);
    [].forEach.call(row.querySelectorAll('.pbx'), function(b){ b.style.opacity = 1; $('.po', b).style.opacity = 0; $('.pc', b).style.opacity = 1; $('.pbb', b).style.transform = 'scaleY(1)'; $('.pbk', b).style.opacity = 1; $('.pbk', b).style.transform = 'translate(-50%,-50%)'; });
    setTimeout(function(){ ov.classList.remove('on'); ov.inert = true; }, 700); showDone(order);
  }
  pk.done = finish;
  function D(ms){ return fast ? ms : 1; }
  function go(){
    if(pk.run !== run || pk.finished) return;
    var enter = 240 * fast, lidGap = 170 * fast, sealGap = 150 * fast, t = 150, sealed = 0;
    for(var k = 0; k < n; k++) (function(k){
      var b = $('.pbx[data-k="'+k+'"]', row), inn = $('.pbi', b), po = $('.po', b), pc = $('.pc', b), band = $('.pbb', b), seal = $('.pbk', b);
      /* 1. the box comes in, open, with the watch inside */
      pkAt(t + k * enter, function(){ b.animate([{ transform:'translateY(120px) scale(.94)', opacity:0 }, { transform:'translateY(0) scale(1)', opacity:1 }], { duration:D(700), easing:'cubic-bezier(.2,.8,.2,1)', fill:'forwards' }); });
      /* 2. the lid comes down */
      var tl = t + (n - 1) * enter + D(700) + (fast ? 260 : 0) + k * lidGap;
      pkAt(tl, function(){
        po.animate([{ opacity:1 }, { opacity:0 }], { duration:D(240), easing:'ease-in', fill:'forwards' });
        pc.animate([{ opacity:0, transform:'translateY(-34px)' }, { opacity:1, transform:'translateY(0)' }], { duration:D(300), easing:'cubic-bezier(.5,0,.3,1)', fill:'forwards' });
        pkAt(D(300), function(){ inn.animate([{ transform:'translateY(0) scale(1)' }, { transform:'translateY(6px) scale(1.02,.975)' }, { transform:'translateY(0) scale(1)' }], { duration:D(340), easing:'ease-out' }); });
      });
      /* 3. the band wraps round and the seal goes on */
      var ts = t + (n - 1) * enter + D(700) + (fast ? 260 : 0) + (n - 1) * lidGap + D(640) + k * sealGap;
      pkAt(ts, function(){
        band.animate([{ transform:'scaleY(0)' }, { transform:'scaleY(1)' }], { duration:D(420), easing:'cubic-bezier(.4,0,.2,1)', fill:'forwards' });
        pkAt(D(380), function(){
          seal.animate([{ transform:'translate(-50%,-50%) scale(0) rotate(-40deg)', opacity:0 }, { transform:'translate(-50%,-50%) scale(1.18) rotate(6deg)', opacity:1, offset:.65 }, { transform:'translate(-50%,-50%) scale(1) rotate(0)', opacity:1 }], { duration:D(380), easing:'ease-out', fill:'forwards' });
          sealed++; cnt.textContent = label(sealed === n ? total : Math.min(sealed, total));
        });
      });
    })(k);
    var end = t + (n - 1) * enter + D(700) + (fast ? 260 : 0) + (n - 1) * lidGap + D(640) + (n - 1) * sealGap + D(800) + (fast ? 900 : 0);
    pkAt(end, finish);
  }
  /* wait for the photos so nothing pops in, but never wait long */
  var imgs = [].slice.call(row.querySelectorAll('img')), left = imgs.length, started = false;
  function ready(){ if(started) return; started = true; go(); }
  imgs.forEach(function(im){ if(im.complete) left--; else im.onload = im.onerror = function(){ if(--left <= 0) ready(); }; });
  if(left <= 0) ready(); else pkAt(2500, ready);
  pkAt(14000, finish);
}
function playOrder(order){ packOrder(order); }

/* ---------- orders ---------- */
function when(iso){ var d = new Date(iso); return isNaN(d) ? '' : d.toLocaleString(undefined, { dateStyle:'medium', timeStyle:'short' }); }
function orderBlock(o){
  return '<div class="ob"><div class="obh"><div><p class="eyebrow">Order reference</p><h2 class="ref">'+esc(o.ref)+'</h2><p class="fine">'+esc(when(o.createdAt))+'</p></div><span class="badge">'+esc(o.status)+'</span></div>'+
    '<div class="ol">'+o.items.map(function(i){ var p = H.byId(i.id); return '<div class="sl">'+(p?'<img src="'+src(p.img.alone)+'" alt="">':'<span></span>')+'<div><b>'+esc(i.code)+' / '+esc(i.name)+'</b><small>'+i.qty+' × '+money(i.price)+'</small></div><span>'+money(i.total)+'</span></div>'; }).join('')+'</div>'+
    '<div class="row"><span>Subtotal</span><b>'+money(o.subtotal)+'</b></div><div class="row"><span>'+esc(o.shipping.label)+' (sample)</span><b>'+money(o.shipping.cost)+'</b></div><div class="row total"><span>Total</span><b>'+money(o.total)+'</b></div>'+
    '<div class="two cols"><div><h3>Customer</h3><p>'+esc(o.customer.name)+'<br>'+esc(o.customer.email)+'<br>'+esc(o.customer.phone)+'</p></div><div><h3>Delivery</h3><p>'+esc(o.delivery.street)+'<br>'+esc(o.delivery.city)+', '+esc(o.delivery.state)+'<br>'+esc(o.delivery.country)+(o.delivery.notes?'<br><em>'+esc(o.delivery.notes)+'</em>':'')+'</p></div></div>'+
    '<p class="fine">Demonstration order. Nothing was paid, dispatched or delivered.</p></div>';
}
function viewOrders(){
  var l = H.orders.list();
  var html = eyebrow('Your orders') + '<h1 class="ph">Order history</h1><p class="note">Demo orders are saved only in this browser (local storage). They are not sent to a server, and clearing your browser data removes them.</p>' +
    (l.length ? '<div class="olist">'+l.map(function(o){ return '<article class="orow"><div><b>'+esc(o.ref)+'</b><small>'+esc(when(o.createdAt))+'</small></div><div class="oi">'+o.items.map(function(i){ return esc(i.name) + ' × ' + i.qty; }).join(', ')+'</div><div><b>'+money(o.total)+'</b><small>'+esc(o.status)+'</small></div><a class="ghost" href="#/order/'+encodeURIComponent(o.ref)+'">View order details</a></article>'; }).join('')+'</div><button class="lnk" type="button" data-act="clear-orders">Clear order history</button>'
    : emptyState('No orders yet','When you place a demo order it will appear here.','<a class="solid" href="#/collection">Browse the collection</a>'));
  return { html:page('Orders', html) };
}
function viewOrder(ref){
  var o = H.orders.get(decodeURIComponent(ref));
  return { html:page('Order', o ? '<nav class="crumb"><a href="#/orders">← Order history</a></nav>' + orderBlock(o) : emptyState('Order not found','We could not find that order in this browser.','<a class="solid" href="#/orders">Back to order history</a>')) };
}
function showDone(order){ $('#skip').classList.remove('on'); $('#skip').inert = true;
  $('#done').innerHTML = '<div class="dbox"><p class="eyebrow">Demo order created</p><h2 id="done-t">Thank you</h2><p class="fine">Your demonstration order is saved in this browser. Nothing was paid or shipped.</p>'+orderBlock(order)+
    '<div class="acts"><button class="solid" type="button" data-act="done-continue">Continue shopping</button><button class="ghost" type="button" data-act="done-view" data-ref="'+esc(order.ref)+'">View order details</button></div></div>';
  openOv('done');
}

/* ---------- information pages ---------- */
function viewStory(){ return { html:page('Story', eyebrow('Our story') + '<h1 class="ph">Fewer watches, finished slowly</h1><div class="prose"><p>Halden is a concept watch brand made for this demonstration. The story below is placeholder copy.</p><p>The idea is simple: a small collection of watches, each with one clear character. A gold watch with a blue dial. A rose gold watch the colour of warm chocolate. A steel watch in black. A gold watch on green leather.</p><p class="cfg">To configure: replace this section with the real history, makers and values of the brand.</p></div><a class="solid" href="#/collection">View the collection</a>') }; }
function viewCare(){ return { html:page('Care', eyebrow('Product care') + '<h1 class="ph">Looking after your watch</h1><div class="prose"><p>General care advice for most watches. Always follow the instructions that come with your own watch.</p><ul><li>Wipe the case and crystal with a soft, dry cloth.</li><li>Keep leather straps away from water and rotate between straps when you can.</li><li>Keep your watch away from strong magnets and extreme heat.</li><li>Have mechanical watches checked by a qualified watchmaker at regular intervals.</li></ul><p class="cfg">To configure: add the real care, servicing and water-resistance guidance for each model.</p></div>') }; }
var FAQ = [['Is this a real store?','No. Halden is a front-end demonstration. Orders are examples saved in your browser and nothing is paid, shipped or delivered.'],['Where are my demo orders saved?','Only in this browser, using local storage. They are not sent anywhere. Clearing your browser data removes them.'],['Are the prices and specifications real?','They are samples. Replace them with real data before using this site for a real business.'],['How does shipping work?','The shipping options at checkout are sample settings. Real rates and delivery promises must come from the business.'],['Can I return a watch?','Returns, warranty and repairs are not defined in this demo. See the sample policies page and replace it with real policies.'],['How do I contact the brand?','Contact details are placeholders. Add real support details on the contact page.']];
function viewFaq(){ return { html:page('FAQ', eyebrow('Help') + '<h1 class="ph">Frequently asked questions</h1><div class="faq">'+FAQ.map(function(q){ return '<details><summary>'+esc(q[0])+'</summary><p>'+esc(q[1])+'</p></details>'; }).join('')+'</div><p class="cfg">To configure: replace with the real answers of the business.</p>') }; }
function viewContact(){ return { html:page('Contact', eyebrow('Support') + '<h1 class="ph">Contact</h1><div class="two cols"><div class="prose"><p class="cfg">Contact details to configure: customer support email, phone number, opening hours and address. None are provided in this demo.</p></div><form data-form="contact" novalidate><div class="fld"><label for="c-n">Your name</label><input id="c-n" autocomplete="name"><p class="err" id="c-ne" role="alert"></p></div><div class="fld"><label for="c-e">Email</label><input id="c-e" type="email" autocomplete="email"><p class="err" id="c-ee" role="alert"></p></div><div class="fld"><label for="c-m">Message</label><textarea id="c-m" rows="4"></textarea><p class="err" id="c-me" role="alert"></p></div><button class="solid" type="submit">Send message</button><p class="fine">Demo form. Your message is not sent anywhere.</p></form></div>') }; }
function viewPolicies(){ return { html:page('Policies', eyebrow('Sample policies') + '<h1 class="ph">Shipping, returns and privacy</h1><p class="note">These are sample placeholders. They are not real policies and must be replaced by the business before launch.</p><div class="prose"><h2>Shipping (sample)</h2><p>Shipping options and rates at checkout are sample settings only. No delivery times are promised.</p><h2>Returns (sample)</h2><p>This demo defines no return period, warranty or repair terms. Add real terms here.</p><h2>Privacy (sample)</h2><p>This demo stores your bag, wishlist, recently viewed watches and demo orders in your own browser using local storage. Nothing is sent to a server.</p></div>') }; }

/* ---------- routing ---------- */
function show(which){ var isHome = which === 'home'; home.hidden = !isHome; app.hidden = isHome; document.body.classList.toggle('inshop', !isHome); if(isHome) H.home.show(); }
function route(){
  var h = location.hash || '#/';
  if(h === '#/' || h === '#' || h === ''){ closeOv(true); show('home'); document.title = 'Halden — Watches'; mark('#/'); return; }
  var v;
  if(h === '#/collection') v = viewCollection();
  else if(h.indexOf('#/watch/') === 0) v = viewProduct(h.slice(8));
  else if(h === '#/wishlist') v = viewWishlist();
  else if(h === '#/checkout') v = viewCheckout();
  else if(h === '#/orders') v = viewOrders();
  else if(h.indexOf('#/order/') === 0) v = viewOrder(h.slice(8));
  else if(h === '#/story') v = viewStory();
  else if(h === '#/care') v = viewCare();
  else if(h === '#/faq') v = viewFaq();
  else if(h === '#/contact') v = viewContact();
  else if(h === '#/policies') v = viewPolicies();
  else v = { html:page('Not found', emptyState('Page not found','That page does not exist.','<a class="solid" href="#/collection">Browse the collection</a>')) };
  var same = app.dataset.h === h; prevH = app.dataset.h || '';
  show('app'); app.innerHTML = v.html; app.dataset.h = h;
  document.title = (v.title || 'Halden') + ' — Halden';
  if(v.after) v.after(); else window.scrollTo(0,0);
  if(h !== '#/collection') window.scrollTo(0,0);
  var hd = $('h1', app); if(hd){ hd.setAttribute('tabindex','-1'); if(!same && h !== '#/collection') hd.focus({ preventScroll:true }); }
  mark(h);
}
function mark(h){ $$('.nr button').forEach(function(b){ b.removeAttribute('aria-current'); }); if(h === '#/wishlist') $('#wb').setAttribute('aria-current','page'); }
window.addEventListener('hashchange', function(){ route(); });

/* ---------- events ---------- */
document.addEventListener('click', function(e){
  var t = e.target, m = t.closest('[data-m]');
  if(m){ resolveConfirm(m.dataset.m === 'yes'); return; }
  if(t.closest('#veil') && (openName === 'cart' || openName === 'menu')){ closeOv(); return; }
  if(t.closest('[data-menu]') && !t.closest('[data-act]')){ closeOv(true); }
  var b = t.closest('[data-act]'), back = t.closest('[data-back]');
  if(!b) return;
  var a = b.dataset.act, id = b.dataset.id;
  if(a === 'close'){ closeOv(); }
  else if(a === 'open-cart'){ openOv('cart'); }
  else if(a === 'search'){ closeOv(true); H.focusSearch = true; if(location.hash === '#/collection') route(); else location.hash = '#/collection'; }
  else if(a === 'add'){ if(b.closest('#add')) return; var ce = b.closest('.pcard'); addToBag(id, b, ce ? $('.tm img.a', ce) : $('#gm')); }
  else if(a === 'buynow'){ H.cart.ensure(id); CK = { step:1, ship:CK.ship, busy:false, err:{} }; location.hash = '#/checkout'; }
  else if(a === 'wish'){ var on = H.wish.toggle(id); toast(H.byId(id).name + (on ? ' saved to your wishlist' : ' removed from your wishlist')); }
  else if(a === 'inc'){ H.cart.setQty(id, H.cart.qty(id) + 1); }
  else if(a === 'dec'){ H.cart.setQty(id, H.cart.qty(id) - 1); }
  else if(a === 'rm'){ var q = H.cart.qty(id), p = H.byId(id); H.cart.remove(id); toast(p.name + ' removed from your bag', { label:'Undo', fn:function(){ H.cart.add(id, q); } }); }
  else if(a === 'clear'){ ask({ title:'Clear your bag?', text:'All watches will be removed from your bag.', yes:'Clear bag', no:'Keep them' }).then(function(ok){ if(ok){ H.cart.clear(); toast('Your bag is empty.'); } }); }
  else if(a === 'checkout'){ closeOv(true); CK = { step:1, ship:CK.ship, busy:false, err:{} }; if(location.hash === '#/checkout') route(); else location.hash = '#/checkout'; }
  else if(a === 'ck-edit'){ CK.step = 1; CK.err = {}; route(); }
  else if(a === 'place'){ placeOrder(); }
  else if(a === 'shot'){ var gm = $('#gm'); gm.style.opacity = 0; setTimeout(function(){ gm.src = b.dataset.s; gm.alt = b.dataset.alt; gm.style.opacity = 1; }, reduce ? 0 : 160); $$('.gth button').forEach(function(x){ x.classList.toggle('on', x === b); x.setAttribute('aria-pressed', x === b); }); }
  else if(a === 'ftog'){ CS.panel = !CS.panel; $('#fp').classList.toggle('open', CS.panel); b.setAttribute('aria-expanded', CS.panel); }
  else if(a === 'clear-q'){ CS.q = ''; $('#q').value = ''; renderResults(); $('#q').focus(); }
  else if(a === 'clear-filters'){ CS.q = ''; CS.min = ''; CS.max = ''; CS.dial = []; CS.strap = []; CS.metal = []; $('#q').value = ''; $('#minp').value = ''; $('#maxp').value = ''; renderResults(); }
  else if(a === 'rmf'){ var k = b.dataset.k, v = b.dataset.v; if(k === 'q'){ CS.q = ''; $('#q').value = ''; } else if(k === 'min'){ CS.min = ''; $('#minp').value = ''; } else if(k === 'max'){ CS.max = ''; $('#maxp').value = ''; } else CS[k] = CS[k].filter(function(x){ return x !== v; }); renderResults(); }
  else if(a === 'clear-orders'){ ask({ title:'Clear order history?', text:'This removes the demo orders saved in this browser.', yes:'Clear history', no:'Keep orders' }).then(function(ok){ if(ok){ H.orders.clear(); route(); toast('Order history cleared.'); } }); }
  else if(a === 'skip'){ if(pk.done) pk.done(); }
  else if(a === 'done-continue'){ closeOv(true); location.hash = '#/collection'; if(app.dataset.h === '#/collection') route(); }
  else if(a === 'done-view'){ var ref = b.dataset.ref; closeOv(true); location.hash = '#/order/' + encodeURIComponent(ref); }
});
document.addEventListener('click', function(e){ var f = e.target.closest('[data-f]'); if(!f) return; var k = f.dataset.k, v = f.dataset.f, i = CS[k].indexOf(v); if(i > -1) CS[k].splice(i,1); else CS[k].push(v); renderResults(); });
document.addEventListener('input', function(e){
  var t = e.target;
  if(t.id === 'q'){ CS.q = t.value; renderResults(); } else if(t.id === 'minp'){ CS.min = t.value; renderResults(); } else if(t.id === 'maxp'){ CS.max = t.value; renderResults(); }
});
document.addEventListener('change', function(e){ if(e.target.id === 'sort'){ CS.sort = e.target.value; renderResults(); } });
document.addEventListener('submit', function(e){
  var f = e.target; e.preventDefault();
  if(f.id === 'ckf'){ submitInfo(); return; }
  var kind = f.dataset.form;
  if(kind === 'menusearch'){ CS.q = $('input', f).value.trim(); closeOv(true); if(location.hash === '#/collection') route(); else location.hash = '#/collection'; return; }
  if(kind === 'news'){ var inp = $('input', f), em = inp.value.trim(), er = $('.err', f); if(!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(em)){ er.textContent = 'Enter a valid email address.'; return; } er.textContent = ''; inp.value = ''; toast('Thanks. This is a demo, so nobody was subscribed.'); }
  if(kind === 'contact'){ var n = $('#c-n').value.trim(), m = $('#c-e').value.trim(), g = $('#c-m').value.trim(), ok = true;
    $('#c-ne').textContent = n.length < 2 ? (ok = false, 'Enter your name.') : ''; $('#c-ee').textContent = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(m) ? '' : (ok = false, 'Enter a valid email address.'); $('#c-me').textContent = g.length < 5 ? (ok = false, 'Write a short message.') : '';
    if(ok){ f.reset(); toast('Demo form. Your message was not sent anywhere.'); } }
});
/* hook for the cinematic page: add to bag button */
H.addFromHome = function(id, btn, img){ addToBag(id, btn, img); };

/* ---------- start ---------- */
function init(){
  app = $('#app'); home = $('#home'); build(); badges(); renderCart();
  var eg = $('#eg'); if(eg){ eg.className = 'bento'; eg.innerHTML = P.map(card).join(''); }
  $('#homefoot').outerHTML = foot().replace('<footer class="sfoot">','<footer class="sfoot" id="homefoot2">');
  $('#mb').addEventListener('click', function(){ if(openName === 'menu') closeOv(); else openOv('menu'); });
  $('#mb').setAttribute('aria-expanded','false');
  route();
}
H.ui = { overlayOpen:function(){ return !!openName; }, toast:toast, route:route };
if(document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init); else init();
})();
