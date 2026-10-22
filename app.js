/* ===== KONFIGURASI: update berikutnya cukup edit file ini ===== */
// TikTok: API gratis tikwm.com. Instagram & Pinterest: API kompatibel Cobalt.
// Isi cobalt dengan instance milikmu sendiri (gratis, self-host) dan key bila perlu.
const CFG={cobalt:'https://api.cobalt.tools/',key:''};
const VID='https://videotourl.com/videos/1791884903568-c7254efa-ff1e-47d1-b8bc-fc07d85edf2f.mp4';
const AD='https://videotourl.com/videos/1791884931835-918832b7-fca9-47b5-ae99-5955d5021b15.mp4';
const COST=100;
// ID profil yang diberi Premium (Unlimited Luxe). Salin ID dari tab Profil user, lalu tambahkan di sini.
const PREMIUM_IDS=[]; // contoh: ['12345678','87654321']
// Alamat website Premium Luxe untuk Connect with SaveLuxe (harus sama persis dengan alamat hosting-nya).
const PL_URL='https://premiumluxe.netlify.app/';
const PL_ORIGIN=(()=>{try{return new URL(PL_URL).origin}catch{return ''}})();

const $=s=>document.querySelector(s);
const ld=(k,d)=>{try{return JSON.parse(localStorage.getItem(k))??d}catch{return d}};
const sv=(k,v)=>{try{localStorage.setItem(k,JSON.stringify(v))}catch{}};
const esc=s=>String(s||'').replace(/[&<>"]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]));
const P={
gem:'<path d="M6 3h12l4 6-10 12L2 9z"/><path d="M2 9h20"/>',
sun:'<circle cx="12" cy="12" r="4"/><path d="M12 2v2M12 20v2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M2 12h2M20 12h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4"/>',
moon:'<path d="M21 13A9 9 0 1111 3a7 7 0 0010 10z"/>',
dl:'<path d="M12 3v12m0 0l-4-4m4 4l4-4M4 21h16"/>',
music:'<path d="M9 18V5l12-2v13"/><circle cx="6" cy="18" r="3"/><circle cx="18" cy="16" r="3"/>',
send:'<path d="M22 2L11 13M22 2l-7 20-4-9-9-4z"/>',
copy:'<rect x="9" y="9" width="12" height="12" rx="2"/><path d="M5 15V5a2 2 0 012-2h10"/>',
crown:'<path d="M3 8l4 4 5-7 5 7 4-4-2 11H5z"/>',
user:'<circle cx="12" cy="8" r="4"/><path d="M4 21a8 8 0 0116 0"/>',
img:'<rect x="3" y="3" width="18" height="18" rx="2"/><circle cx="9" cy="9" r="2"/><path d="M21 15l-5-5L5 21"/>',
out:'<path d="M9 21H5a2 2 0 01-2-2V5a2 2 0 012-2h4M16 17l5-5-5-5M21 12H9"/>',
check:'<path d="M5 12l5 5 9-10"/>',
play:'<path d="M6 4l14 8-14 8z"/>',
home:'<path d="M3 11l9-8 9 8v10H3z"/>'};
const ic=n=>`<svg viewBox="0 0 24 24" aria-hidden="true">${P[n]||n}</svg>`;

let users=ld('users',{}),me=ld('me',null),tab='home',mode='in',cur=null,connectMode=!!window.opener&&/[?&]connect=1/.test(location.search),linked=false;
if(me&&!users[me])me=null;
const U=()=>users[me];
const isPrem=u=>!!u&&!!(u.premium||PREMIUM_IDS.map(String).includes(String(u.id)));
const persist=()=>sv('users',users);
function toast(m){const t=$('#t');t.textContent=m;t.classList.add('on');clearTimeout(toast.h);toast.h=setTimeout(()=>t.classList.remove('on'),2400)}
async function hash(s){try{const b=await crypto.subtle.digest('SHA-256',new TextEncoder().encode(s));return[...new Uint8Array(b)].map(x=>x.toString(16).padStart(2,'0')).join('')}catch{return btoa(s)}}

/* ===== TAMPILAN ===== */
function hdr(){
 const dk=document.documentElement.dataset.theme==='dark';
 $('#hd').innerHTML=`<div class="w"><div class="bar"><div class="brand"><span class="gem">${ic('gem')}</span>SaveLuxe</div><div class="row">${me?`<span class="chip"><span class="gem">${ic(isPrem(U())?'crown':'gem')}</span>${isPrem(U())?'Unlimited':U().luxe}</span>`:''}<button data-a="theme" aria-label="Ganti mode gelap atau terang">${ic(dk?'sun':'moon')}</button></div></div>${me?`<div class="row" style="padding-bottom:10px">${[['home','Beranda','home'],['pro','Premium','crown'],['me','Profil','user']].map(([k,l,i])=>`<button class="tb ${tab===k?'on':''}" style="flex:1" data-a="go" data-t="${k}">${ic(i)}${l}</button>`).join('')}</div>`:''}</div>`;
}
function render(){hdr();$('#app').innerHTML=!me?authV():connectMode?connV():tab==='home'?homeV():tab==='pro'?proV():profV()}

const authV=()=>`<div class="w"><div class="card" style="margin-top:28px"><h1 style="font-size:30px">${mode==='in'?'Masuk':'Daftar'}</h1><p class="mu">Download video TikTok, Instagram & Pinterest. Akun baru langsung dapat 1000 Luxe.</p>${mode==='up'?'<input id="nm" placeholder="Nama" autocomplete="name">':''}<input id="e" type="email" placeholder="Email" autocomplete="email"><input id="pw" type="password" placeholder="Sandi (min. 6 karakter)" autocomplete="${mode==='in'?'current-password':'new-password'}"><button class="p" data-a="auth" style="width:100%;margin-top:6px">${mode==='in'?'Masuk':'Buat akun'}</button><p class="mu" style="margin-top:12px;text-align:center">${mode==='in'?'Belum punya akun?':'Sudah punya akun?'} <a href="#" data-a="mode" data-m="${mode==='in'?'up':'in'}" style="color:var(--ac);font-weight:700">${mode==='in'?'Daftar':'Masuk'}</a></p></div></div>`;

const connV=()=>{const u=U();return `<div class="w"><div class="card" style="margin-top:28px"><h2 style="font-size:26px">Hubungkan dengan Premium Luxe</h2><p class="mu" style="margin-top:6px">Akun <b>${esc(u.name)}</b> · ID <b>${u.id}</b></p>${isPrem(u)?`<p class="gem" style="margin-top:14px;gap:6px;font-weight:700">${ic('crown')}Premium aktif · Unlimited Luxe</p><button class="p" data-a="fin" style="width:100%;margin-top:12px">Mulai download</button>`:linked?'<p style="margin-top:14px">Terhubung. Kembali ke Premium Luxe, tempel ID, lalu tekan Active Premium.</p>':`<p class="mu" style="margin-top:14px">Izinkan Premium Luxe terhubung ke akun ini untuk mengaktifkan Premium.</p><button class="p" data-a="allow" style="width:100%;margin-top:12px">Izinkan koneksi</button>`}</div></div>`};
const homeV=()=>{const pr=isPrem(U());return `<div class="w"><h1 style="font-size:30px;line-height:1.15;margin-top:18px">Download video tanpa ribet</h1>
<div class="vid"><video src="${VID}" autoplay muted loop playsinline onclick="this.muted=!this.muted"></video></div>
<div class="card"><input id="u" placeholder="Tempel link TikTok / Instagram / Pinterest" inputmode="url"><button class="p" data-a="find" style="width:100%">${ic('dl')}Cari video</button><div id="res"></div></div>
<div class="card"><h3 class="row"><span class="gem">${ic('crown')}</span>Deluxe: maks. 100 link</h3><p class="mu">Satu link per baris. Semua video terunduh otomatis.</p><textarea id="bt" rows="5" placeholder="https://..." ${pr?'':'disabled'}></textarea><button class="p" data-a="batch" style="width:100%" ${pr?'':'disabled'}>Download semua</button>${pr?'':'<p class="mu" style="margin-top:8px">Terkunci. Selesaikan misi di tab Premium.</p>'}<div id="bl" style="margin-top:8px"></div></div></div>`};

const resV=()=>`<div class="row" style="margin-top:12px;align-items:flex-start">${cur.thumb?`<img src="${esc(cur.thumb)}" alt="" style="width:84px;height:84px;object-fit:cover;border-radius:10px">`:''}<div><b>${esc(cur.title)}</b><div class="mu">${esc(cur.by)}</div></div></div><div class="g">${[['uhd','UHD','dl'],['hd','HD','dl'],['sd','SD','dl'],['audio','Audio','music']].map(([k,l,i])=>`<button data-a="dl" data-k="${k}">${ic(i)}${l}</button>`).join('')}<button class="p" data-a="dl" data-k="status" style="grid-column:1/3">${ic('send')}Kirim ke Status WhatsApp / Instagram</button></div><p class="mu" style="margin-top:8px">${isPrem(U())?'Premium: unduh tanpa biaya Luxe.':'Biaya 100 Luxe per video.'}</p>`;

const TASKS=[['share','Bagikan website ke teman','send','Bagikan'],['follow','Ikuti TikTok dev @liliyana.lyna','user','Buka TikTok'],['ad','Tonton iklan 10 detik','play','Tonton']];
function proV(){const u=U(),n=TASKS.filter(t=>u.tasks[t[0]]).length;return `<div class="w"><h2 style="font-size:26px;margin-top:18px">Jadi Premium gratis</h2><p class="mu">Selesaikan 3 misi untuk unduh tanpa batas Luxe dan membuka mode Deluxe.</p>${isPrem(u)?`<div class="card" style="border-color:var(--gd)"><b class="row"><span class="gem">${ic('crown')}</span>Kamu sudah Premium</b></div>`:''}${isPrem(u)?'':TASKS.map(([k,t,i,b])=>`<div class="card row" style="justify-content:space-between"><div class="row">${ic(i)}<span>${t}</span></div>${u.tasks[k]?`<span class="gem">${ic('check')}</span>`:`<button class="p" data-a="task" data-k="${k}">${b}</button>`}</div>`).join('')}${isPrem(u)?'':`<p class="mu" style="margin-top:12px">Progres: ${n}/3 misi</p>`}</div>`}

function profV(){const u=U();return `<div class="w" style="margin-top:18px"><div class="bn" style="${u.banner?`background-image:url(${u.banner})`:''}"><label class="btn" style="position:absolute;right:10px;bottom:10px">${ic('img')}Ubah banner<input type="file" accept="image/*" id="bf" hidden></label></div><div class="av">${esc(u.name[0]||'?').toUpperCase()}</div><div class="card" style="margin-top:-24px;padding-top:34px"><label class="mu" for="pn">Nama</label><input id="pn" value="${esc(u.name)}" maxlength="24"><button data-a="name" style="width:100%">Simpan profil</button><p class="mu" style="margin-top:14px">ID kamu</p><div class="row" style="justify-content:space-between"><b class="lg" style="font-size:24px">${u.id}</b><button data-a="copy">${ic('copy')}Salin ID</button></div><p class="mu" style="margin-top:14px">${esc(me)} · ${isPrem(u)?'Premium · Unlimited Luxe':`Gratis · ${u.luxe} Luxe`}</p></div><button data-a="out" style="width:100%;margin-top:14px">${ic('out')}Keluar</button></div>`}

/* ===== DOWNLOAD ===== */
async function info(u){
 if(/tiktok\.com/i.test(u)){
  const j=await(await fetch('https://www.tikwm.com/api/?hd=1&url='+encodeURIComponent(u))).json();
  if(j.code!==0)throw 0;const d=j.data,hd=d.hdplay||d.play;
  return{src:u,title:d.title||'Video TikTok',thumb:d.cover,by:d.author&&d.author.nickname,u:{uhd:hd,hd:hd,sd:d.play,status:hd,audio:d.music}};
 }
 if(/instagram\.com|pinterest\.|pin\.it/i.test(u))return{src:u,title:/instagram/i.test(u)?'Video Instagram':'Video Pinterest',u:null};
 throw 0;
}
async function link(r,k){
 if(r.u)return r.u[k];
 const h={'Content-Type':'application/json',Accept:'application/json'};if(CFG.key)h.Authorization='Api-Key '+CFG.key;
 const j=await(await fetch(CFG.cobalt,{method:'POST',headers:h,body:JSON.stringify({url:r.src,videoQuality:{uhd:'max',hd:'720',sd:'360'}[k]||'720',downloadMode:k==='audio'?'audio':'auto'})})).json();
 const l=j.url||(j.picker&&j.picker[0]&&j.picker[0].url);if(!l)throw 0;return l;
}
async function saveF(l,n){try{const b=await(await fetch(l)).blob(),a=document.createElement('a');a.href=URL.createObjectURL(b);a.download=n;a.click();setTimeout(()=>URL.revokeObjectURL(a.href),9e3)}catch{window.open(l,'_blank')}}
async function toStatus(l,n){try{const b=await(await fetch(l)).blob(),f=new File([b],n,{type:b.type||'video/mp4'});if(navigator.canShare&&navigator.canShare({files:[f]})){await navigator.share({files:[f]});return}}catch(e){if(e&&e.name==='AbortError')return}saveF(l,n)}
const can=()=>{const u=U();if(isPrem(u)||u.luxe>=COST)return 1;toast('Luxe habis. Buka tab Premium untuk lanjut.');return 0};
const charge=()=>{const u=U();if(!isPrem(u)){u.luxe-=COST;persist();hdr()}};
function done(k){U().tasks[k]=1;if(TASKS.every(t=>U().tasks[t[0]])){U().premium=true;toast('Selamat, kamu sekarang Premium!')}else toast('Misi selesai');persist();render()}
function ad(){
 const m=document.createElement('div');m.className='md';
 m.innerHTML=`<div><div class="vid" style="margin:0"><video src="${AD}" autoplay playsinline disablepictureinpicture disableremoteplayback controlslist="nodownload noremoteplayback" oncontextmenu="return false"></video></div><p id="cd" style="color:#fff;text-align:center;margin:12px 0">Iklan berlangsung 10 detik</p><button class="p" id="cl" disabled style="width:100%">Tunggu...</button></div>`;
 document.body.append(m);let s=10;
 const t=setInterval(()=>{s--;$('#cd').textContent=s>0?`Selesai dalam ${s} detik`:'Iklan selesai';if(s<=0){clearInterval(t);$('#cl').disabled=false;$('#cl').textContent='Klaim misi'}},1000);
 $('#cl').onclick=()=>{m.remove();done('ad')};
}

/* ===== AKSI ===== */
const act={
 async auth(){
  const e=$('#e').value.trim().toLowerCase(),p=$('#pw').value;
  if(!/^\S+@\S+\.\S+$/.test(e)||p.length<6)return toast('Isi email valid dan sandi min. 6 karakter');
  const h=await hash(p);
  if(mode==='up'){
   if(users[e])return toast('Email sudah terdaftar');
   users[e]={name:($('#nm').value.trim()||e.split('@')[0]).slice(0,24),pw:h,id:String(Math.floor(1e7+Math.random()*9e7)),luxe:1000,premium:false,tasks:{},banner:''};persist();
  }else if(!users[e]||users[e].pw!==h)return toast('Email atau sandi salah');
  me=e;sv('me',me);tab='home';render();
 },
 mode(a){mode=a.dataset.m;render()},
 go(a){connectMode=false;tab=a.dataset.t;render()},
 theme(){const d=document.documentElement,n=d.dataset.theme==='dark'?'light':'dark';d.dataset.theme=n;sv('theme',n);hdr()},
 async find(){
  const u=$('#u').value.trim(),r=$('#res');if(!/^https?:\/\//i.test(u))return toast('Tempel link yang valid');
  r.innerHTML='<p class="mu" style="margin-top:12px">Mengambil data...</p>';
  try{cur=await info(u);r.innerHTML=resV()}catch{cur=null;r.innerHTML='<p style="margin-top:12px;color:#e5484d">Video tidak ditemukan. Pastikan link publik dan benar.</p>'}
 },
 async dl(a){
  if(!cur||!can())return;const k=a.dataset.k;a.disabled=true;
  try{const l=await link(cur,k);charge();const n='saveluxe-'+Date.now()+(k==='audio'?'.mp3':'.mp4');k==='status'?await toStatus(l,n):await saveF(l,n)}catch{toast('Gagal mengambil file. Coba lagi.')}
  a.disabled=false;
 },
 async batch(a){
  const ls=[...new Set($('#bt').value.split('\n').map(s=>s.trim()).filter(s=>/^https?:\/\//i.test(s)))].slice(0,100);
  if(!ls.length)return toast('Tempel minimal 1 link');
  a.disabled=true;const o=$('#bl');o.innerHTML='';
  for(let i=0;i<ls.length;i++){
   const d=document.createElement('div');d.className='mu';d.textContent=`${i+1}. Memproses ${ls[i].slice(0,38)}`;o.append(d);
   try{const r=await info(ls[i]);await saveF(await link(r,'uhd'),`saveluxe-${i+1}.mp4`);d.textContent=`${i+1}. Selesai`}catch{d.textContent=`${i+1}. Gagal: ${ls[i].slice(0,38)}`}
   await new Promise(r=>setTimeout(r,700));
  }
  a.disabled=false;toast('Batch selesai');
 },
 task(a){
  const k=a.dataset.k;
  if(k==='share'){const t='Download video TikTok, Instagram & Pinterest tanpa watermark di SaveLuxe: '+location.href;
   if(navigator.share)navigator.share({text:t}).then(()=>done(k)).catch(()=>{});
   else{open('https://wa.me/?text='+encodeURIComponent(t));setTimeout(()=>done(k),4000)}}
  else if(k==='follow'){open('https://www.tiktok.com/@liliyana.lyna','_blank');toast('Ikuti akunnya, misi selesai otomatis');setTimeout(()=>done(k),5000)}
  else ad();
 },
 name(){const v=$('#pn').value.trim();if(!v)return toast('Nama tidak boleh kosong');U().name=v;persist();render();toast('Profil disimpan')},
 copy(){navigator.clipboard.writeText(U().id).then(()=>toast('ID disalin'),()=>toast('ID kamu: '+U().id))},
 out(){me=null;sv('me',null);cur=null;linked=false;render()},
 allow(){if(!window.opener)return toast('Buka lewat tombol Connect di Premium Luxe');try{window.opener.postMessage({t:'sl-connect',id:U().id,name:U().name},PL_ORIGIN)}catch{return toast('Atur PL_URL di app.js')}linked=true;render()},
 fin(){connectMode=false;tab='home';render()}
};
document.addEventListener('click',e=>{const a=e.target.closest('[data-a]');if(!a)return;e.preventDefault();act[a.dataset.a]&&act[a.dataset.a](a)});
document.addEventListener('keydown',e=>{if(e.key==='Enter'&&e.target.id==='pw')act.auth()});
document.addEventListener('change',e=>{
 if(e.target.id!=='bf'||!e.target.files[0])return;
 const im=new Image();
 im.onload=()=>{const c=document.createElement('canvas');c.width=900;c.height=300;const s=Math.max(900/im.width,300/im.height),w=im.width*s,h=im.height*s;c.getContext('2d').drawImage(im,(900-w)/2,(300-h)/2,w,h);U().banner=c.toDataURL('image/jpeg',.7);persist();URL.revokeObjectURL(im.src);render()};
 im.src=URL.createObjectURL(e.target.files[0]);
});

/* ===== KONEKSI PREMIUM LUXE ===== */
addEventListener('message',e=>{
 const d=e.data||{};
 if(!PL_ORIGIN||e.origin!==PL_ORIGIN||d.t!=='pl-activate'||!me||!linked||String(d.id)!==String(U().id))return;
 U().premium=true;persist();
 e.source.postMessage({t:'sl-premium',id:U().id},e.origin);
 toast('Premium aktif, Unlimited Luxe');render();
});
/* ===== SPONSOR HOYOVERSE (ganti tiap 5 detik) ===== */
const SP=[
['Genshin Impact','Jelajahi dunia terbuka Teyvat','#16a394,#e5b53c','<path d="M12 2l2.5 7.5L22 12l-7.5 2.5L12 22l-2.5-7.5L2 12l7.5-2.5z"/>'],
['Honkai: Star Rail','Naik Kereta Bintang ke galaksi baru','#5b4bd6,#d96ad0','<circle cx="12" cy="12" r="9"/><path d="M12 7l1.5 3.5 3.5.5-2.6 2.4.7 3.6-3.1-1.8-3.1 1.8.7-3.6L7 11l3.5-.5z"/>'],
['Zenless Zone Zero','Aksi urban penuh gaya','#f0562d,#2a2a2a','<path d="M5 5h14L5 19h14"/>'],
['Honkai Impact 3rd','Aksi RPG sinematik','#2f7be5,#4cc3ee','<path d="M12 2l9 5v10l-9 5-9-5V7z"/>'],
['Tears of Themis','Misteri hukum dan romansa','#b83a6d,#e8895f','<path d="M12 3v18M5 7h14M5 7l-3 7a3 3 0 006 0zM19 7l-3 7a3 3 0 006 0z"/>']];
let si=0;
function sponsor(){const[n,t,c,p]=SP[si];$('#sp').innerHTML=`<a href="https://www.hoyoverse.com/" target="_blank" rel="noopener"><span class="em" style="background:linear-gradient(135deg,${c})">${ic(p)}</span><span><b class="lg">${n}</b><br><span class="mu">Sponsor HoYoverse · ${t}</span></span></a>`}
setInterval(()=>{si=(si+1)%SP.length;sponsor()},5000);

document.documentElement.dataset.theme=ld('theme',matchMedia('(prefers-color-scheme:dark)').matches?'dark':'light');
render();sponsor();
