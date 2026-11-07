/* State and persistence: cart, wishlist, recently viewed, demo orders, checkout draft. */
(function(){
var H = window.HAL = window.HAL || {};
var K = { cart:'halden.cart.v1', wish:'halden.wish.v1', recent:'halden.recent.v1', orders:'halden.orders.v1', draft:'halden.draft.v1' };
var bus = {};
H.on = function(e,f){ (bus[e] = bus[e] || []).push(f); };
H.emit = function(e,d){ (bus[e] || []).forEach(function(f){ try{ f(d); }catch(x){ console.error(x); } }); };
H.money = function(n){ return '$' + Number(n).toLocaleString('en-US'); };
H.byId = function(id){ for(var i=0;i<H.products.length;i++) if(H.products[i].id===id) return H.products[i]; return null; };
function rd(k,fb){ try{ var v = JSON.parse(localStorage.getItem(k)); return v == null ? fb : v; }catch(e){ return fb; } }
function wr(k,v){ try{ localStorage.setItem(k, JSON.stringify(v)); return localStorage.getItem(k) === JSON.stringify(v); }catch(e){ return false; } }
H.store = { read:rd, write:wr, keys:K };

/* cart: only ids and quantities are stored. Prices always come from product data. */
var cart = [];
function cleanCart(raw){
  if(!Array.isArray(raw)) return [];
  var seen = {}, out = [];
  raw.forEach(function(x){
    if(!x || typeof x !== 'object') return;
    var p = H.byId(x.id), q = Math.floor(Number(x.qty));
    if(!p || !isFinite(q) || q < 1 || seen[p.id]) return;
    seen[p.id] = 1; out.push({ id:p.id, qty:Math.min(q,99) });
  });
  return out;
}
function saveCart(){ wr(K.cart, cart); H.emit('cart'); }
H.cart = {
  load:function(){ cart = cleanCart(rd(K.cart, [])); wr(K.cart, cart); },
  items:function(){ return cart.map(function(x){ return { id:x.id, qty:x.qty }; }); },
  qty:function(id){ for(var i=0;i<cart.length;i++) if(cart[i].id===id) return cart[i].qty; return 0; },
  add:function(id,q){ var p = H.byId(id); q = Math.floor(Number(q)||1); if(!p || q < 1) return 0;
    var f = null; cart.forEach(function(x){ if(x.id===id) f = x; });
    if(f) f.qty = Math.min(99, f.qty + q); else cart.push({ id:id, qty:Math.min(99,q) });
    saveCart(); return H.cart.qty(id); },
  ensure:function(id){ if(!H.cart.qty(id)) H.cart.add(id,1); },
  setQty:function(id,q){ q = Math.floor(Number(q)); if(!isFinite(q)) return;
    if(q < 1){ H.cart.remove(id); return; }
    cart.forEach(function(x){ if(x.id===id) x.qty = Math.min(99,q); }); saveCart(); },
  remove:function(id){ cart = cart.filter(function(x){ return x.id !== id; }); saveCart(); },
  clear:function(){ cart = []; saveCart(); },
  count:function(){ return cart.reduce(function(n,x){ return n + x.qty; }, 0); },
  subtotal:function(){ return cart.reduce(function(n,x){ return n + H.byId(x.id).price * x.qty; }, 0); },
  lines:function(){ return cart.map(function(x){ var p = H.byId(x.id); return { p:p, qty:x.qty, total:p.price * x.qty }; }); }
};

/* wishlist */
var wish = [];
H.wish = {
  load:function(){ var r = rd(K.wish, []); wish = Array.isArray(r) ? r.filter(function(id,i){ return H.byId(id) && r.indexOf(id) === i; }) : []; wr(K.wish, wish); },
  has:function(id){ return wish.indexOf(id) > -1; },
  list:function(){ return wish.slice(); },
  toggle:function(id){ if(!H.byId(id)) return false; var on = !H.wish.has(id);
    wish = on ? wish.concat(id) : wish.filter(function(x){ return x !== id; }); wr(K.wish, wish); H.emit('wish'); return on; }
};

/* recently viewed */
H.recent = {
  list:function(){ var r = rd(K.recent, []); return Array.isArray(r) ? r.filter(H.byId) : []; },
  push:function(id){ if(!H.byId(id)) return; var r = H.recent.list().filter(function(x){ return x !== id; }); r.unshift(id); wr(K.recent, r.slice(0,6)); }
};

/* demo orders (local only) */
function cleanOrders(raw){ return Array.isArray(raw) ? raw.filter(function(o){ return o && typeof o.ref === 'string' && Array.isArray(o.items) && isFinite(o.total); }) : []; }
H.orders = {
  list:function(){ return cleanOrders(rd(K.orders, [])); },
  get:function(ref){ var l = H.orders.list(); for(var i=0;i<l.length;i++) if(l[i].ref === ref) return l[i]; return null; },
  newRef:function(){ var used = {}; H.orders.list().forEach(function(o){ used[o.ref] = 1; }); var ref, n = 0;
    do{ var d = new Date(), s = String(d.getFullYear()).slice(2) + ('0'+(d.getMonth()+1)).slice(-2) + ('0'+d.getDate()).slice(-2);
        var r = ''; for(var i=0;i<4;i++) r += 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789'.charAt(Math.floor(Math.random()*32));
        ref = 'HAL-' + s + '-' + r; n++; }while(used[ref] && n < 50);
    return ref; },
  save:function(order){ if(H.__failSave) return false; var l = H.orders.list(); l.unshift(order); var ok = wr(K.orders, l); return ok && !!H.orders.get(order.ref); },
  clear:function(){ wr(K.orders, []); H.emit('orders'); }
};

/* checkout draft (kept so a customer can edit the bag and come back) */
H.draft = {
  get:function(){ var d = rd(K.draft, {}); return d && typeof d === 'object' ? d : {}; },
  set:function(d){ wr(K.draft, d); },
  clear:function(){ try{ localStorage.removeItem(K.draft); }catch(e){} }
};
H.cart.load(); H.wish.load();
})();
