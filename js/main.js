(function(){
var HL=window.HAL,PR=HL.products;
var D={al:PR.map(function(p){return p.img.alone}),cush:'assets/img/cushion.webp',boxc:'assets/img/box-closed.webp',box:PR.map(function(p){return p.img.box}),dial:PR.map(function(p){return p.img.dial}),mv:'assets/img/movement.webp',br:'assets/img/bracelet.webp'};
if(matchMedia('(max-width:899px)').matches){(function m(o){for(var k in o){if(typeof o[k]==='string')o[k]=o[k].replace('.webp','-m.webp');else m(o[k])}})(D)}
var K=.92,T=[562,660];
var M=PR.map(function(p){var a=p.anim;return{id:p.id,n:p.name,c:p.code,t:p.title,p:p.price,k:p.strapNote,pv:a.pv,mc:a.mc,mr:a.mr,bp:a.bp,br:a.br,r:a.r}});
var CO=[{t:'Sunburst dial',s:'Fine radial finish',a:[-.5,-.28],l:[.07,.27,.04,.13]},{t:'Slim hands',s:'Cut from solid metal',a:[-.2,-.15],l:[.07,.5,.04,.23]},{t:'Mirror case',s:'Polished by hand',a:[-1,.18],l:[.07,.74,.04,.86]},{t:'Signed crown',s:'Groove-cut grip',a:[1.06,0],r:[.93,.42,.96,.18]},{t:'Applied markers',s:'Set one by one',a:[.55,.33],r:[.93,.68,.96,.8]}];
var $=function(s){return document.querySelector(s)};
var st=$('#st'),track=$('#track'),fr=$('#fr'),rig=$('#rig'),hl=$('#hl'),info=$('#info'),dark=$('#dark'),dz=$('#dz'),bx=$('#bx'),bxc=$('#bxc'),stm=$('#stm'),ln=$('#ln'),cu=$('#cu'),acts=$('#acts');
var reduce=matchMedia('(prefers-reduced-motion: reduce)').matches;
function cl(v,a,b){return v<a?a:v>b?b:v}function seg(p,a,b){return cl((p-a)/(b-a),0,1)}function ez(t){return t*t*(3-2*t)}function lp(a,b,t){return a+(b-a)*t}
function money(n){return'$'+n.toLocaleString('en-US')}
var svg="<svg xmlns='http://www.w3.org/2000/svg' width='180' height='180'><filter id='n'><feTurbulence type='fractalNoise' baseFrequency='.85' numOctaves='2' stitchTiles='stitch'/><feColorMatrix values='0 0 0 0 .99 0 0 0 0 .93 0 0 0 0 .80 0 0 0 -2.4 1.2'/></filter><rect width='180' height='180' filter='url(#n)'/></svg>";
document.documentElement.style.setProperty('--gr','url("data:image/svg+xml,'+encodeURIComponent(svg)+'")');
var idx=0,cur=0,tgt=0,L={p:0},WP=[],now=0,ins=0,ord=0,mode='',cart=[],flight=null;
cu.src=D.cush;bxc.src=D.boxc;
M.forEach(function(m,i){var w=document.createElement('div');w.className='wp';w.innerHTML='<img src="'+D.al[i]+'" alt="Halden '+m.n+'">';fr.appendChild(w);WP.push(w)});
WP[0].style.visibility='visible';
$('#fcs').innerHTML='<div class="fc" id="f1"><i><img src="'+D.mv+'" alt=""></i><b>In-house movement</b></div><div class="fc" id="f2"><i><img src="'+D.br+'" alt=""></i><b>Solid gold links</b></div>';
$('#ei1').src=D.mv;$('#ei2').src=D.al[2];
$('#cos').innerHTML=CO.map(function(c){return'<div class="co">'+c.t+'<small>'+c.s+'</small></div>'}).join('');
ln.innerHTML=CO.map(function(){return'<path d="M0 0"/><circle class="d" r="0"/><circle class="rg" r="0"/>'}).join('');
var paths=ln.querySelectorAll('path'),dots=ln.querySelectorAll('circle.d'),rings=ln.querySelectorAll('circle.rg'),cos=document.querySelectorAll('#cos .co');
if('IntersectionObserver' in window){var io=new IntersectionObserver(function(es){es.forEach(function(e){if(e.isIntersecting){var k=[].indexOf.call(e.target.parentNode.children,e.target);setTimeout(function(){e.target.classList.add('in')},k*140);io.unobserve(e.target)}})},{threshold:.15});[].forEach.call(document.querySelectorAll('.ecard'),function(c){io.observe(c)})}else[].forEach.call(document.querySelectorAll('.ecard'),function(c){c.classList.add('in')});
/* tween helper: one running tween per name */
var tw={};function tween(name,get,set,to,dur,ease,done){var id=(tw[name]=(tw[name]||0)+1),from=get(),t0=performance.now();(function step(n){if(tw[name]!==id)return;var k=cl((n-t0)/dur,0,1),e=ease?k:(k<.5?4*k*k*k:1-Math.pow(-2*k+2,3)/2);set(lp(from,to,reduce?1:e));if(k<1&&!reduce)requestAnimationFrame(step);else{set(to);if(done)done()}})(t0)}
var locked=0,gate=0,ty=0;function lock(v){locked=v}
addEventListener('wheel',function(e){if($('#home').hidden||(e.target.closest&&e.target.closest('#cart')))return;
  if(locked){e.preventDefault();if(mode==='vid')vScrub(e.deltaY*(e.deltaMode===1?16:1)/3200);else if(mode==='ins'&&e.deltaY>25){gate=1;closeInspect()}return}
  },{passive:false});
addEventListener('touchstart',function(e){ty=e.touches[0].clientY},{passive:true});
addEventListener('touchmove',function(e){if($('#home').hidden||(e.target.closest&&e.target.closest('#cart')))return;var dy=e.touches[0].clientY-ty;
  if(locked){e.preventDefault();if(mode==='vid'){vScrub(-(e.touches[0].clientY-ty)/1100);ty=e.touches[0].clientY}else if(mode==='ins'&&dy<-60){gate=1;closeInspect()}return}
  },{passive:false});
addEventListener('keydown',function(e){if(locked&&[' ','PageDown','PageUp','ArrowDown','ArrowUp','Home','End'].indexOf(e.key)>-1)e.preventDefault()});
function thumbs(){$('#th').innerHTML=M.map(function(m,i){return'<button class="dk'+(i===idx?' on':'')+'" type="button" data-i="'+i+'" aria-pressed="'+(i===idx)+'" aria-label="'+m.n+', '+money(m.p)+'"><i><img src="'+D.al[i]+'" alt=""></i><b>'+m.n+'</b></button>'}).join('')}
function bounce(){cu.animate([{transform:'translate(-50%,-50%) scale(1)'},{transform:'translate(-50%,-50%) scale(.985,.972)'},{transform:'translate(-50%,-50%) scale(1)'}],{duration:reduce?1:520,easing:'ease-out'})}
function go(i,from,instant){
  i=(i+M.length)%M.length;var prev=idx,first=(now===0);if(!first&&i===prev&&!from)return;idx=i;
  var pe=WP[prev],ne=WP[i],skipExit=false;
  /* a new choice can arrive while the last one is still moving: stop the old movement so only the chosen watch stays */
  if(flight){flight.an.cancel();flight.c.remove();flight=null;skipExit=true}
  [].forEach.call(WP,function(w,k){if(w._ex){w._ex.cancel();w._ex=null}if(w._in){w._in.cancel();w._in=null}if(k!==prev&&k!==i)w.style.visibility='hidden'});
  if(skipExit&&prev!==i)pe.style.visibility='hidden';
  if(instant||first){[].forEach.call(WP,function(w){w.style.visibility='hidden'});ne.style.visibility='visible'}
  else{
    if(prev!==i&&!skipExit){pe.style.visibility='visible';var ex=pe.animate([{transform:'translate(0,0)',opacity:1},{transform:'translate('+(-L.W*.75)+'px,0)',opacity:0}],{duration:reduce?1:760,easing:'cubic-bezier(.7,0,.84,0)'});pe._ex=ex;ex.onfinish=function(){pe._ex=null;if(idx!==prev)pe.style.visibility='hidden'}}
    if(from){
      var im=from.querySelector('img'),r=im.getBoundingClientRect(),c=document.createElement('img');c.src=im.src;c.className='fly';
      ne.style.visibility='hidden';var t=ne.querySelector('img').getBoundingClientRect();
      c.style.cssText='left:'+r.left+'px;top:'+r.top+'px;width:'+r.width+'px;height:'+r.height+'px';document.body.appendChild(c);
      var an=c.animate([{left:r.left+'px',top:r.top+'px',width:r.width+'px',height:r.height+'px',transform:'translateY(0)'},{left:(r.left+t.left)/2+'px',top:(r.top+t.top)/2-60+'px',width:(r.width+t.width)/2*1.12+'px',height:(r.height+t.height)/2*1.12+'px',transform:'translateY(0)',offset:.5},{left:t.left+'px',top:t.top+'px',width:t.width+'px',height:t.height+'px',transform:'translateY(0)'}],{duration:reduce?1:1300,easing:'cubic-bezier(.5,0,.15,1.04)',fill:'forwards'});
      flight={an:an,c:c};an.onfinish=function(){flight=null;ne.style.visibility='visible';c.remove();bounce()};
    }else{ne.style.visibility='visible';var inn=ne.animate([{transform:'translate('+(L.W*.6)+'px,0)',opacity:0},{transform:'translate(0,0)',opacity:1}],{duration:reduce?1:900,easing:'cubic-bezier(.16,1,.3,1)'});ne._in=inn;inn.onfinish=function(){ne._in=null}}
  }
  var m=M[idx];dz.src=D.dial[idx];bx.src=D.box[idx];layoutDz();
  setTimeout(function(){var pp=PR[idx];HL.selected=m.id;$('#lcode').textContent=m.c+' · Selected';$('#lname').textContent=m.n;$('#ltitle').textContent=m.t;$('#lprice').textContent=money(m.p);$('#ldet').href='#/watch/'+m.id;$('#r1').textContent=pp.metal;$('#r2').textContent=pp.dial;$('#r3').textContent=pp.strapNote;$('#add').textContent='Add to bag · '+money(m.p)},(first||instant)?0:450);
  thumbs();now=1;
}
function toHold(i){go(i);var r=track.getBoundingClientRect().top+scrollY;window.scrollTo({top:r+(track.offsetHeight-L.H)*.85,behavior:'smooth'})}
/* inspect */
function inspect(){if(mode||L.iv<.8)return;var pi=PR[idx];if(pi.inspect&&pi.inspect.count>0){vInspect(pi);return}mode='ins';lock(1);tween('ins',function(){return ins},function(v){ins=v},1,2600)}
function closeInspect(){if(mode==='vid'){gate=1;vClose();return}if(mode!=='ins')return;gate=1;tween('ins',function(){return ins},function(v){ins=v},0,1200,0,function(){mode='';lock(0)})}
/* inspect player: a frame sequence per watch (assets/inspect/<id>/f_001.webp ...) with labelled stages */
document.body.appendChild($('#vp'));document.body.appendChild($('#icl'));  /* the player lives on top of the page, not inside the scrolling section */
var VP={n:0,fr:[],pos:0,tgt:0,last:0,lastIn:0,raf:0,p:null,lab:-1,loaded:0,started:false,moved:false};
function vpad(i){return('000'+i).slice(-3)}
function vsize(){var vp=$('#vp'),cv=$('#vc'),dpr=Math.min(devicePixelRatio||1,2),w=vp.clientWidth||L.W,h=vp.clientHeight||L.H;VP.cw=w;VP.ch=h;cv.width=Math.round(w*dpr);cv.height=Math.round(h*dpr)}
function vInspect(p){
  mode='vid';lock(1);gate=1;VP.p=p;VP.n=p.inspect.count;VP.fr=[];VP.pos=0;VP.tgt=0;VP.loaded=0;VP.started=false;VP.lab=-1;VP.moved=false;
  var vp=$('#vp');vp.classList.add('on');vp.setAttribute('aria-hidden','false');$('#vload').style.display='block';$('#vload').textContent='Loading 0%';$('#vlab').classList.remove('on');$('#vln').textContent=p.name;
  $('#vhint').textContent=matchMedia('(pointer:coarse)').matches?'Swipe up to take it apart':'Scroll to take it apart';$('#vhint').classList.remove('off');
  var labs=p.inspect.labels||[];$('#vticks').innerHTML=labs.slice(1).map(function(l){return'<u style=\"left:'+(l.from*100)+'%\"></u>'}).join('');
  vsize();
  for(var i=0;i<VP.n;i++){(function(i){var im=new Image();im.onload=im.onerror=function(){VP.loaded++;$('#vload').textContent='Loading '+Math.round(VP.loaded/VP.n*100)+'%';if(VP.loaded>=VP.n&&mode==='vid'){$('#vload').style.display='none';VP.started=true}};im.src=p.inspect.dir+'/f_'+vpad(i+1)+'.webp';VP.fr[i]=im})(i)}
  cancelAnimationFrame(VP.raf);VP.last=performance.now();VP.raf=requestAnimationFrame(vloop);
}
function vframe(i){for(var k=i;k>=0;k--){var im=VP.fr[k];if(im&&im.complete&&im.naturalWidth)return im}return null}
function vloop(n){
  if(mode!=='vid')return;
  if($('#home').hidden){vClose();return}
  var vpe=$('#vp');if(vpe.clientWidth!==VP.cw||vpe.clientHeight!==VP.ch)vsize();
  var dt=Math.min(100,n-VP.last);VP.last=n;
  if(n-VP.lastIn>200){var sn=Math.round(VP.tgt*(VP.n-1))/(VP.n-1);if(sn!==VP.tgt)VP.tgt=sn}  /* when you stop, settle on one clean frame */
  var d=VP.tgt-VP.pos;VP.pos=Math.abs(d)<.0004?VP.tgt:VP.pos+d*(reduce?1:1-Math.exp(-dt/110));
  var cv=$('#vc'),c=cv.getContext('2d'),f=VP.pos*(VP.n-1),i0=Math.floor(f),a=f-i0,i1=Math.min(VP.n-1,i0+1);
  c.fillStyle='#07090d';c.fillRect(0,0,cv.width,cv.height);
  var im0=vframe(i0),im1=a>.01?vframe(i1):null,ref=im0||im1;
  if(ref){var s=Math.min(cv.width/ref.naturalWidth,cv.height/ref.naturalHeight)*(L.mob?1.3:1),iw=ref.naturalWidth*s,ih=ref.naturalHeight*s,ix=(cv.width-iw)/2,iy=(cv.height-ih)/2;
    if(im0)c.drawImage(im0,ix,iy,iw,ih);
    if(im1&&im1!==im0){c.globalAlpha=a;c.drawImage(im1,ix,iy,iw,ih);c.globalAlpha=1}
    if(ix>2){var fw=iw*.14,g1=c.createLinearGradient(ix,0,ix+fw,0),g2=c.createLinearGradient(ix+iw,0,ix+iw-fw,0);g1.addColorStop(0,'#07090d');g1.addColorStop(1,'rgba(7,9,13,0)');g2.addColorStop(0,'#07090d');g2.addColorStop(1,'rgba(7,9,13,0)');c.fillStyle=g1;c.fillRect(ix,0,fw,cv.height);c.fillStyle=g2;c.fillRect(ix+iw-fw,0,fw,cv.height)}}
  $('#vfill').style.width=(VP.pos*100)+'%';$('#vtrack').setAttribute('aria-valuenow',Math.round(VP.pos*100));
  var labs=VP.p.inspect.labels||[],k=-1;labs.forEach(function(l,j){if(VP.pos>=l.from&&VP.pos<=l.to)k=j});
  if(k!==VP.lab){VP.lab=k;var box=$('#vlab');if(k<0)box.classList.remove('on');else{$('#vlt').textContent=labs[k].title;$('#vlp').textContent=labs[k].text;box.classList.add('on')}$('#vstep').textContent=k<0?'':(k+1)+' / '+labs.length}
  VP.raf=requestAnimationFrame(vloop);
}
function vScrub(d){if(!VP.started)return;VP.lastIn=performance.now();VP.tgt=cl(VP.tgt+d,0,1);if(Math.abs(d)>0)vMoved()}
function vMoved(){if(!VP.moved){VP.moved=true;$('#vhint').classList.add('off')}}
function vClose(){cancelAnimationFrame(VP.raf);var ic=$('#icl');ic.style.opacity=0;ic.style.pointerEvents='none';var vp=$('#vp');vp.classList.remove('on');vp.setAttribute('aria-hidden','true');mode='';lock(0)}
(function(){var vt=$('#vtrack');function set(e){if(!VP.started)return;var r=vt.getBoundingClientRect();VP.lastIn=performance.now();VP.tgt=cl((e.clientX-r.left)/r.width,0,1);vMoved()}
  vt.addEventListener('pointerdown',function(e){if(vt.setPointerCapture)vt.setPointerCapture(e.pointerId);set(e);vt.onpointermove=set});vt.addEventListener('pointerup',function(){vt.onpointermove=null});
  vt.addEventListener('keydown',function(e){if(e.key==='ArrowRight')vScrub(.04);if(e.key==='ArrowLeft')vScrub(-.04)})})();
/* order scene (kept for the cinematic page; the shop uses the packing overlay). Shopping logic lives in store.js and ui.js. */
var orderDone=null;
function startOrder(id,done){var i=0;M.forEach(function(m,k){if(m.id===id)i=k});go(i,null,true);mode='ord';lock(1);orderDone=done||null;ord=0;tween('ord',function(){return ord},function(v){ord=v;if(v>=.985&&orderDone){var f=orderDone;orderDone=null;f()}},1,7000,1)}
function endOrder(cb){if(mode!=='ord'){if(cb)cb();return}orderDone=null;tween('ord',function(){return ord},function(v){ord=v},0,1400,0,function(){mode='';lock(0);if(cb)cb()})}
function skipOrder(){if(mode==='ord')tween('ord',function(){return ord},function(v){ord=v;if(v>=.985&&orderDone){var f=orderDone;orderDone=null;f()}},1,500,1)}
document.addEventListener('click',function(e){
  if($('#home').hidden)return;
  var t=e.target,b=t.closest('[data-i]');
  if(b&&!mode){var i=+b.getAttribute('data-i');if(b.classList.contains('dk')&&cur>.18&&i!==idx)go(i,b);return}
  if(mode==='ord')return;
  if(t.closest('#insp'))inspect();else if(t.closest('#icl'))closeInspect();
  else if(t.closest('#add')){if(!mode&&L.iv>.8)HL.addFromHome(M[idx].id,t.closest('#add'),WP[idx].firstChild)}
});
$('#ap').onclick=function(){if(!mode)go(idx-1)};$('#an').onclick=function(){if(!mode)go(idx+1)};
addEventListener('keydown',function(e){if($('#home').hidden||HL.ui.overlayOpen())return;if(e.key==='Escape')closeInspect();if(mode==='vid'&&document.activeElement.id!=='vtrack'){if(e.key==='ArrowRight'||e.key==='ArrowDown')vScrub(.04);if(e.key==='ArrowLeft'||e.key==='ArrowUp')vScrub(-.04);if(e.key==='PageDown')vScrub(.12);if(e.key==='PageUp')vScrub(-.12)}if(!mode&&cur>.18&&!/INPUT|TEXTAREA|SELECT/.test(document.activeElement.tagName)){if(e.key==='ArrowRight')go(idx+1);if(e.key==='ArrowLeft')go(idx-1)}});
function layoutDz(){var m=M[idx],sm=L.sm;dz.style.width=1672*sm+'px';dz.style.height=941*sm+'px';dz.style.left=(L.W/2-m.mc[0]*sm)+'px';dz.style.top=(L.H/2-m.mc[1]*sm)+'px';dz.style.transformOrigin=m.mc[0]*sm+'px '+m.mc[1]*sm+'px';dz.classList.toggle('m',L.mob)}
function layout(){
  var W=st.clientWidth,H=st.clientHeight,mob=W<900,wh=(mob?.56:.84)*H,kf=wh/1402;L.W=W;L.H=H;L.mob=mob;L.wh=wh;L.kf=kf;st.style.setProperty('--wh',wh+'px');
  L.Cx=0;L.Cy=mob?-.17*H:-.08*H;L.Cs=mob?.9:.86;L.po=[(T[0]-561)*kf,(T[1]-701)*kf];L.sm=mob?1.44*W/1672:Math.max(W/1672,H/941);L.SE=mob?.8:.62;
  M.forEach(function(m,i){var w=WP[i],im=w.firstChild,s=K*kf;w.style.left='calc(50% + '+L.po[0]+'px)';w.style.top='calc(50% + '+L.po[1]+'px)';im.style.height=(K*wh)+'px';im.style.left=(-m.pv[0]*s)+'px';im.style.top=(-m.pv[1]*s)+'px';
    m.R0=m.r*s;m.q=m.br/(m.r*K);m.bd=[(m.bp[0]-T[0])*kf,(m.bp[1]-T[1])*kf]});
  if(mode==='vid')vsize();layoutDz();bx.style.height=wh*L.SE+'px';bx.style.width='auto';bxc.style.height=.912*wh*L.SE+'px';bxc.style.width='auto';L.cy0=214*kf*L.SE;
  acts.style.left=(W/2+L.Cx)+'px';acts.style.top=Math.min(H/2+L.Cy+.4*wh*L.Cs+12,mob?H*.535:H-200)+'px';
  stm.style.fontSize='';hl.querySelector('h1').style.fontSize='';
  var fs=parseFloat(getComputedStyle(stm).fontSize),mx=0;[].forEach.call(stm.querySelectorAll(mob?'.mb .ln':'.dk .ln'),function(l){mx=Math.max(mx,l.offsetWidth)});if(mx>W*.94)stm.style.fontSize=(fs*W*.94/mx)+'px';
  var h1=hl.querySelector('h1'),hf=parseFloat(getComputedStyle(h1).fontSize),hm=0;[].forEach.call(h1.children,function(s){hm=Math.max(hm,s.offsetWidth)});if(hm>W*.94)h1.style.fontSize=(hf*W*.94/hm)+'px';
  stm.classList.add('rest');stm.style.visibility='hidden';
  var sl=stm.querySelector(mob?'.mb .slot':'.dk .slot'),sr=sl.getBoundingClientRect(),R=st.getBoundingClientRect();
  L.dx=sr.left+sr.width/2-R.left-W/2;L.dy=sr.top+sr.height/2-R.top-H/2;L.k=Math.min(sr.height/(.96*wh*L.SE),sr.width/(.62*wh*L.SE));L.sr={x:sr.left-R.left,y:sr.top-R.top,w:sr.width,h:sr.height};
  stm.classList.remove('rest');
  var s1=$('#s1'),s2=$('#s2');s1.style.left=(L.sr.x+L.sr.w*.4-s1.offsetWidth)+'px';s1.style.top=(L.sr.y-28)+'px';s2.style.left=(L.sr.x+L.sr.w*.6)+'px';s2.style.top=(L.sr.y-28)+'px';
  CO.forEach(function(c,i){var p=mob?(c.l?[c.l[2],c.l[3]]:[c.r[2],c.r[3]]):(c.l?[c.l[0],c.l[1]]:[c.r[0],c.r[1]]);var el=cos[i];
    el.style.top=(p[1]*H)+'px';el.style.left=c.l?(p[0]*W)+'px':(p[0]*W-el.offsetWidth)+'px';c.px=c.l?p[0]*W+el.offsetWidth:p[0]*W-el.offsetWidth;c.py=p[1]*H+el.offsetHeight/2});
}
var lw=0;addEventListener('resize',function(){if(innerWidth!==lw&&!$('#home').hidden){lw=innerWidth;layout()}});lw=innerWidth;
function read(){var r=track.getBoundingClientRect(),p=cl(-r.top/(track.offsetHeight-L.H),0,1);L.p=p;tgt=p*.3;if(p<.9)gate=0}
addEventListener('scroll',read,{passive:true});
function draw(a){
  cur=a;var W=L.W,H=L.H,po=L.po,SE=L.SE,mm=M[idx],Sf=mm.mr*L.sm/mm.R0;
  var e=ez(seg(a,.05,.15));hl.style.transform='translateY('+(-e*.5*H)+'px) scale('+(1+e*.1)+')';hl.style.opacity=1-ez(seg(a,.07,.15));hl.style.filter='blur('+(e*12)+'px)';
  var fo=1-ez(seg(a,.04,.1));$('#fcs').style.opacity=fo;$('#ip').style.opacity=fo;$('#hint').style.visibility=a>.02?'hidden':'visible';
  $('#labs').style.opacity=ez(seg(a,.05,.09))*(1-ez(seg(a,.12,.16)));
  var m=ez(seg(a,.07,.18)),t=[lp(0,L.Cx,m),lp(0,L.Cy,m)],s=lp(1+.06*seg(a,0,.07),L.Cs,m),ro=1;
  if(ins>0){var d=ez(seg(ins,0,.42));t=[lp(t[0],-Sf*po[0],d),lp(t[1],-Sf*po[1],d)];s=lp(s,Sf,d);ro=1-ez(seg(ins,.36,.46))}
  else if(ord>0){var m2=ez(seg(ord,0,.16));t=[lp(t[0],0,m2),lp(t[1],0,m2)];s=lp(s,SE,m2)}
  rig.style.transform='translate('+t[0]+'px,'+t[1]+'px) scale('+s+')';rig.style.opacity=ro;rig.style.visibility=(ord>.5||ro<=0)?'hidden':'visible';
  rig.style.setProperty('--ha',1);
  var cm=ez(seg(a,.08,.16)),cm2=ez(seg(a,.08,.2));cu.style.opacity=cm*(1-ez(seg(ord,.18,.26)));cu.style.transform='translate(-50%,-50%) translate('+lp(-22,0,cm2)+'%,'+lp(26,0,cm2)+'%)';
  var b1=ez(seg(ord,.18,.34)),wp=WP[idx];
  if(ord>0){wp.style.transform='translate('+(mm.bd[0]*b1)+'px,'+(mm.bd[1]*b1)+'px) scale('+lp(1,mm.q,b1)+')';wp.style.opacity=1-ez(seg(ord,.36,.42))}else{wp.style.transform='';wp.style.opacity=''}
  var iv=ez(seg(a,.14,.2))*(1-ez(seg(ins,0,.14)))*(1-ez(seg(ord,0,.1)));L.iv=iv;
  info.style.opacity=iv;info.style.transform='translateY('+((1-ez(seg(a,.14,.2)))*26)+'px)';info.classList.toggle('on',iv>.6);
  acts.style.opacity=iv;acts.style.pointerEvents=iv>.8?'auto':'none';
  var ic=$('#icl');ic.style.opacity=mode==='vid'?1:ez(seg(ins,.5,.7));ic.style.pointerEvents=(mode==='vid'||ins>.7)?'auto':'none';
  var dk=ez(seg(ins,.36,.46));dark.style.opacity=dk;dark.style.visibility=dk>0?'visible':'hidden';
  var z=lp(1,1.06,seg(ins,.4,1));dz.style.transform='scale('+z+')';
  var cx=W/2,cy=H/2,sc=L.sm*z*mm.mr,ph=(performance.now()/1700)%1;
  CO.forEach(function(c,i){var p=ez(seg(ins,.56+.05*i,.8+.05*i));var ax=cx+c.a[0]*sc,ay=cy+c.a[1]*sc;
    var len=Math.hypot(ax-c.px,ay-c.py);paths[i].setAttribute('d','M'+ax+' '+ay+'L'+c.px+' '+c.py);paths[i].style.strokeDasharray=len;paths[i].style.strokeDashoffset=len*(1-p);dots[i].setAttribute('cx',ax);dots[i].setAttribute('cy',ay);dots[i].setAttribute('r',4*p);
    rings[i].setAttribute('cx',ax);rings[i].setAttribute('cy',ay);rings[i].setAttribute('r',4+12*ph);rings[i].style.opacity=p>.95?.55*(1-ph):0;cos[i].style.opacity=ez(seg(p,.5,1));cos[i].style.transform='translateY('+((1-p)*12)+'px)'});
  var bo=ez(seg(ord,.36,.44)),rise=1-ez(seg(ord,.36,.42)),lid=ez(seg(ord,.5,.58)),c3=ez(seg(ord,.6,.78));
  var tf='translate(-50%,-50%) translate('+lp(0,L.dx,c3)+'px,'+(lp(0,L.dy,c3)+rise*.04*H)+'px) scale('+lp(1,L.k,c3)+')';
  bx.style.opacity=bo*(1-lid);bx.style.transform=tf;
  bxc.style.opacity=lid;bxc.style.transform=tf.replace(/\) scale/,')  translate(0,'+((1-c3)*L.cy0)+'px) scale');
  stm.style.visibility=ord>.62?'visible':'hidden';
  [].forEach.call(stm.querySelectorAll('.ln'),function(el,i){var p=ez(seg(ord,.66+.04*(i%4),.8+.04*(i%4)));el.querySelectorAll('span.gr').forEach(function(sp){sp.style.transform='translateY('+((1-p)*112)+'%)'})});
  var q=ez(seg(ord,.84,.95));['#s1','#s2'].forEach(function(k){$(k).style.opacity=q*.8});
  $('#e1').style.opacity=q;$('#e1').style.transform='translate(0,'+((1-q)*160)+'px) rotate(-5deg)';$('#e2').style.opacity=q;$('#e2').style.transform='translate('+((1-q)*120)+'px,'+((1-q)*120)+'px) rotate(6deg)';
  }
layout();read();cur=tgt;go(0);if(document.fonts&&document.fonts.ready)document.fonts.ready.then(function(){if(!$('#home').hidden)layout()});
HL.home={show:function(){layout();read();cur=tgt;draw(cur)},scrollHold:function(){window.scrollTo(0,track.getBoundingClientRect().top+scrollY+(track.offsetHeight-L.H)*.9)},play:startOrder,end:endOrder,skip:skipOrder};window.__seek=function(a){tgt=cur=a;draw(a)};window.__set=function(i,o){ins=i;ord=o;draw(cur)};window.__go=function(i){go(i,null,true)};
if(/lite/.test(location.search))document.body.classList.add('lowfps');
var fc=0,ft=0,lt=performance.now();(function loop(n){var dt=n-lt;lt=n;if(dt<400){fc++;if(fc>40&&fc<=140)ft+=dt;if(fc===140&&ft/100>38)document.body.classList.add('lowfps')}if(!$('#home').hidden){var d=tgt-cur;draw(reduce?tgt:(Math.abs(d)<.0003?tgt:cur+d*.085))}requestAnimationFrame(loop)})(performance.now());
})();
