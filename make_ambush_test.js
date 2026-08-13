/* Generates ambush-test.html — a standalone playable harness for the Ambush
   minigame. The game object is EXTRACTED from index.html at build time, so the
   tester always exercises the real shipped code. Re-run after any tweak:
     node make_ambush_test.js
*/
const fs=require('fs'), path=require('path');
const ROOT='C:/Users/Tim/dangerous_marine_creatures';
const src=fs.readFileSync(path.join(ROOT,'index.html'),'utf8');

// --- brace-match a top-level MINIGAMES entry (comment/string aware) ---
function extract(name){
  const start=src.indexOf(name+': {');
  if(start<0) throw new Error('not found: '+name);
  const open=src.indexOf('{',start);
  let i=open, depth=0, inStr=null, prev='';
  for(; i<src.length; i++){
    const ch=src[i], nx=src[i+1];
    if(inStr){ if(ch===inStr && prev!=='\\') inStr=null; prev=ch; continue; }
    if(ch==='/'&&nx==='/'){ while(i<src.length&&src[i]!=='\n') i++; prev='\n'; continue; }
    if(ch==='/'&&nx==='*'){ i+=2; while(i<src.length&&!(src[i]==='*'&&src[i+1]==='/')) i++; i++; prev='/'; continue; }
    if(ch==='"'||ch==="'"||ch==='`') inStr=ch;
    else if(ch==='{') depth++;
    else if(ch==='}'){ depth--; if(depth===0){ i++; break; } }
    prev=ch;
  }
  return src.slice(open,i);
}
const ambush=extract('ambush');

// --- the three species that actually use Ambush (region>=4, sandflat) ---
const SPECIES=[
  {id:'saltwater-crocodile', name:'Saltwater Crocodile', pace:6, rarity:'uncommon'},
  {id:'wobbegong',           name:'Wobbegong',           pace:1, rarity:'common'},
  {id:'dugong',              name:'Dugong',              pace:3, rarity:'rare'},
];
const sprites={};
for(const sp of SPECIES){
  const f=path.join(ROOT,'sprites',sp.id+'.svg');
  if(fs.existsSync(f)) sprites[sp.id]='data:image/svg+xml,'+encodeURIComponent(fs.readFileSync(f,'utf8'));
}

const html=`<!doctype html>
<meta charset="utf-8">
<title>Ambush minigame — test harness</title>
<style>
  :root{ --stroke:rgba(126,224,255,.22); }
  body{ margin:0; background:#04141f; color:#e8f4fa;
        font:14px/1.5 system-ui,-apple-system,Segoe UI,sans-serif;
        display:flex; flex-direction:column; align-items:center; padding:22px 14px 40px; }
  h1{ font-size:19px; margin:0 0 4px; }
  .sub{ color:#8fb3c8; font-size:13px; margin:0 0 16px; text-align:center; max-width:640px; }
  .panel{ background:rgba(6,32,47,.75); border:1px solid var(--stroke); border-radius:14px;
          padding:16px; width:min(660px,100%); }
  .row{ display:flex; gap:10px; flex-wrap:wrap; align-items:center; margin-bottom:12px; }
  label{ font-size:12.5px; color:#a8c8db; }
  select,button{ font:600 13px system-ui,sans-serif; color:#e8f4fa; background:rgba(4,32,47,.9);
                 border:1px solid var(--stroke); border-radius:8px; padding:6px 11px; cursor:pointer; }
  button.go{ background:#0d6b8a; border-color:#7ee0ff; }
  canvas{ display:block; width:100%; max-width:620px; border-radius:10px; background:#0a1f18;
          border:1px solid var(--stroke); }
  .meters{ display:flex; gap:12px; margin:12px 0 6px; }
  .meter{ flex:1; }
  .lab{ display:flex; justify-content:space-between; font-size:10.5px; letter-spacing:1.2px;
        text-transform:uppercase; color:#a8c8db; font-weight:700; margin-bottom:4px; }
  .bar{ height:10px; background:rgba(0,0,0,.45); border-radius:99px; overflow:hidden; }
  .bar i{ display:block; height:100%; border-radius:99px; transition:width .1s linear; }
  #progbar i{ background:linear-gradient(90deg,#63e6a5,#2fbf87); }
  #spookbar i{ background:linear-gradient(90deg,#ffb648,#ff6b6b); }
  .hint{ font-size:12.5px; color:#bcd9e8; margin-top:10px; }
  .hint b{ color:#fff; }
  #verdict{ text-align:center; font-weight:800; font-size:17px; min-height:24px; margin-top:10px; }
  .ok{ color:#3ddc97; } .bad{ color:#ff6b6b; }
  #dbg{ font:12px ui-monospace,Consolas,monospace; color:#8fb3c8; white-space:pre;
        margin-top:10px; display:none; }
  .tally{ font-size:12.5px; color:#8fb3c8; margin-top:8px; }
</style>

<h1>Ambush minigame — test harness</h1>
<p class="sub">The real <code>ambush</code> code lifted straight out of <code>index.html</code>.
Try to beat it by tapping the key blindly, then try playing it properly.</p>

<div class="panel">
  <div class="row">
    <label>Creature</label>
    <select id="sel-sp"></select>
    <label>Marine ID level</label>
    <select id="sel-a">
      <option value="0">0 (none)</option><option value="1">1</option>
      <option value="2">2</option><option value="3">3 (max)</option>
    </select>
    <button class="go" id="btn-restart">Restart ↻</button>
    <label style="margin-left:auto"><input type="checkbox" id="chk-dbg"> internals</label>
  </div>

  <canvas id="cv" width="620" height="290"></canvas>

  <div class="meters">
    <div class="meter"><div class="lab"><span>Identification</span><span id="ptxt">0%</span></div>
      <div class="bar" id="progbar"><i style="width:0%"></i></div></div>
    <div class="meter"><div class="lab"><span id="slab">Startled</span><span id="stxt">0%</span></div>
      <div class="bar" id="spookbar"><i style="width:0%"></i></div></div>
  </div>

  <div id="verdict"></div>
  <div class="hint" id="hint"></div>
  <div class="tally" id="tally">wins 0 · losses 0</div>
  <pre id="dbg"></pre>
</div>

<script>
const SPECIES=${JSON.stringify(SPECIES)};
const SPRITE_DATA=${JSON.stringify(sprites)};
const MGW=620, MGH=290;
const cv=document.getElementById('cv'), mgx=cv.getContext('2d');

/* ---- sprite loading + drawSpriteAt (same contract as the game) ---- */
const spriteImg={};
for(const id in SPRITE_DATA){ const im=new Image(); im.onload=()=>{spriteImg[id]=im;}; im.src=SPRITE_DATA[id]; }
function drawSpriteAt(g, sp, x, y, size){
  g.save(); g.translate(x,y);
  if(spriteImg[sp.id]) g.drawImage(spriteImg[sp.id], -size/2, -size/2, size, size);
  else { g.fillStyle='rgba(200,220,210,.35)'; g.beginPath(); g.ellipse(0,0,size*0.5,size*0.3,0,0,6.3); g.fill(); }
  g.restore();
}

/* ---- input (mirrors the game) ---- */
let keys={}, pressed=new Set();
addEventListener('keydown',e=>{ const k=e.key.toLowerCase();
  if(!keys[k]) pressed.add(k); keys[k]=true;
  if(['arrowup','arrowdown','arrowleft','arrowright',' '].includes(k)) e.preventDefault(); });
addEventListener('keyup',e=>{ keys[e.key.toLowerCase()]=false; });
addEventListener('blur',()=>{ keys={}; pressed.clear(); });

/* ================= THE REAL GAME OBJECT, EXTRACTED ================= */
const AMBUSH = ${ambush};
/* =================================================================== */

let m=null, over=false, wins=0, losses=0, t0=0;
const $=id=>document.getElementById(id);

SPECIES.forEach((s,i)=>{ const o=document.createElement('option'); o.value=i; o.textContent=s.name+' (pace '+s.pace+')'; $('sel-sp').appendChild(o); });

function start(){
  const sp=SPECIES[+$('sel-sp').value], a=+$('sel-a').value;
  m={prog:0, spook:0, ready:false, sp};
  AMBUSH.init(m, sp, a);
  over=false; t0=performance.now();
  $('verdict').textContent=''; $('verdict').className='';
  $('slab').textContent=AMBUSH.spookLabel||'Spooked';
  $('hint').innerHTML=AMBUSH.hint;
}
$('btn-restart').onclick=start;
$('sel-sp').onchange=start; $('sel-a').onchange=start;
$('chk-dbg').onchange=()=>{ $('dbg').style.display=$('chk-dbg').checked?'block':'none'; };

let prev=performance.now();
function frame(now){
  const dt=Math.min(0.05,(now-prev)/1000||0); prev=now;

  if(!m){ requestAnimationFrame(frame); return; }

  if(!over && !m.ready){                    // the same Ready? gate the game uses
    mgx.clearRect(0,0,MGW,MGH); AMBUSH.draw(mgx,m,m.sp);
    mgx.fillStyle='rgba(2,26,44,.72)'; mgx.fillRect(0,0,MGW,MGH);
    mgx.fillStyle='#fff'; mgx.font='700 26px system-ui,sans-serif';
    mgx.textAlign='center'; mgx.textBaseline='middle';
    mgx.fillText('Ready?',MGW/2,MGH/2-16);
    mgx.font='600 15px system-ui,sans-serif'; mgx.fillStyle='rgba(255,255,255,.75)';
    mgx.fillText('Read the hint below, then press any key to begin',MGW/2,MGH/2+16);
    if(pressed.size){ m.ready=true; t0=now; }
    pressed.clear(); requestAnimationFrame(frame); return;
  }

  if(!over){
    AMBUSH.update(m,dt);
    m.prog=Math.max(0,Math.min(1,m.prog));
    m.spook=Math.max(0,Math.min(1,m.spook));
  }
  mgx.clearRect(0,0,MGW,MGH); AMBUSH.draw(mgx,m,m.sp);

  $('progbar').firstElementChild.style.width=(m.prog*100)+'%';
  $('spookbar').firstElementChild.style.width=(m.spook*100)+'%';
  $('ptxt').textContent=Math.round(m.prog*100)+'%';
  $('stxt').textContent=Math.round(m.spook*100)+'%';

  if($('chk-dbg').checked){
    $('dbg').textContent=
      'phase   '+m.phase+'   (t-'+m.pt.toFixed(2)+'s)\\n'+
      'alert   '+m.alert.toFixed(2)+' / thresh '+m.thresh.toFixed(2)+'\\n'+
      'lunge   '+m.lunge.toFixed(2)+'\\n'+
      'grace   '+m.grace.toFixed(2)+'\\n'+
      'near    '+m.near.toFixed(2)+'\\n'+
      'calmBase '+m.calmBase.toFixed(2)+'  tellLen '+m.tellLen.toFixed(2)+'  watchLen '+m.watchLen.toFixed(2);
  }

  if(!over && m.prog>=1){ over=true; wins++;
    $('verdict').textContent='✅ Identified it — '+((now-t0)/1000).toFixed(1)+'s';
    $('verdict').className='ok'; $('tally').textContent='wins '+wins+' · losses '+losses; }
  else if(!over && m.spook>=1){ over=true; losses++;
    $('verdict').textContent='💨 It bolted — you startled it';
    $('verdict').className='bad'; $('tally').textContent='wins '+wins+' · losses '+losses; }

  pressed.clear();
  requestAnimationFrame(frame);
}
start(); requestAnimationFrame(frame);
</script>
`;

const out=path.join(ROOT,'ambush-test.html');
fs.writeFileSync(out,html);
console.log('wrote',out, (Buffer.byteLength(html)/1024/1024).toFixed(2)+' MB');
