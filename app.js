/* ===== KONFIGURASI: update berikutnya cukup edit file ini ===== */
const SL_URL='https://saveluxe.netlify.app/'; // ganti dengan alamat website SaveLuxe-mu (harus sama persis)
const SL_ORIGIN=(()=>{try{return new URL(SL_URL).origin}catch{return ''}})();

const $=s=>document.querySelector(s);
const ld=(k,d)=>{try{return JSON.parse(localStorage.getItem(k))??d}catch{return d}};
const sv=(k,v)=>{try{localStorage.setItem(k,JSON.stringify(v))}catch{}};
const esc=s=>String(s||'').replace(/[&<>"]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]));
let conn=ld('conn',null),done=ld('done',null),win=null,live=false,pend=false,want='';

function say(t,bad){const m=$('#ms');m.textContent=t||'';m.className=bad?'bad':'good'}
function sync(){
 const ok=!!conn,fin=ok&&done===conn.id;
 $('#gem').setAttribute('class',fin?'s2':ok?'s1':'s0');
 $('#cs').innerHTML=ok?`Terhubung sebagai <b>${esc(conn.name)}</b>`:'Belum terhubung. Hubungkan akun SaveLuxe dulu sebelum mengaktifkan.';
 $('#bt').textContent=ok?'Putuskan':'Connect with SaveLuxe';
 $('#bc').classList.toggle('sl',!ok);
 $('#c2').classList.toggle('lock',!ok);
 document.querySelectorAll('#c2 input,#c2 button').forEach(el=>el.disabled=!ok);
 $('#ok').hidden=!fin;$('#go').href=SL_URL;
}
function openSL(){
 if(!SL_ORIGIN){say('Atur SL_URL di app.js dengan alamat SaveLuxe.',1);return 0}
 if(win&&!win.closed){win.focus();return 1}
 live=false;win=window.open(SL_URL+'?connect=1','saveluxe','width=440,height=700');
 if(!win){say('Popup diblokir. Izinkan popup lalu coba lagi.',1);return 0}
 return 1;
}
function push(){pend=false;win.postMessage({t:'pl-activate',id:conn.id},SL_ORIGIN);say('Mengaktifkan Premium...')}

$('#bc').onclick=()=>{
 if(conn){conn=null;done=null;live=false;pend=false;sv('conn',null);sv('done',null);say('');sync()}
 else if(openSL())say('Izinkan koneksi di jendela SaveLuxe.');
};
$('#bp').onclick=async()=>{try{$('#id').value=(await navigator.clipboard.readText()).trim()}catch{say('Clipboard tidak bisa dibaca. Tempel manual.',1)}};
$('#ba').onclick=()=>{
 const v=$('#id').value.trim();
 if(!conn)return say('Hubungkan akun SaveLuxe dulu.',1);
 if(v!==conn.id)return say('ID tidak cocok dengan akun yang terhubung.',1);
 want=v;
 if(win&&!win.closed&&live)return push();
 pend=true;if(openSL())say('Izinkan koneksi di jendela SaveLuxe untuk melanjutkan.');
};
addEventListener('message',e=>{
 const d=e.data||{};
 if(!SL_ORIGIN||e.origin!==SL_ORIGIN||e.source!==win)return;
 if(d.t==='sl-connect'){
  live=true;
  if(pend&&String(d.id)!==want){pend=false;return say('Akun SaveLuxe yang login berbeda dari ID yang ditempel.',1)}
  conn={id:String(d.id),name:String(d.name||'')};sv('conn',conn);sync();
  pend?push():say('Akun terhubung. Tempel ID lalu tekan Active Premium.');
 }else if(d.t==='sl-premium'&&conn&&String(d.id)===conn.id){done=conn.id;sv('done',done);say('');sync()}
});
sync();
/* ===== KONFIGURASI: update berikutnya cukup edit file ini ===== */
const SL_URL = 'https://saveluxe.netlify.app/'; // ganti dengan alamat website SaveLuxe-mu (harus sama persis)
const SL_ORIGIN = (() => { try { return new URL(SL_URL).origin } catch { return '' } })();
const RETRY_MS = 1500, MAX_TRY = 6; // perintah aktivasi dikirim ulang sampai SaveLuxe membalas

const $ = s => document.querySelector(s);
const ld = (k, d) => { try { return JSON.parse(localStorage.getItem(k)) ?? d } catch { return d } };
const sv = (k, v) => { try { localStorage.setItem(k, JSON.stringify(v)) } catch {} };
const esc = s => String(s || '').replace(/[&<>"]/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));
let conn = ld('conn', null), done = ld('done', null), win = null, live = false, pend = false, busy = false, want = '', timer = null;

function say(t, bad) { const m = $('#ms'); m.textContent = t || ''; m.className = bad ? 'bad' : 'good' }
function stop() { busy = false; pend = false; clearTimeout(timer) }
function sync() {
  const ok = !!conn, fin = ok && done === conn.id;
  $('#gem').setAttribute('class', fin ? 's2' : ok ? 's1' : 's0');
  $('#cs').innerHTML = ok ? `Terhubung sebagai <b>${esc(conn.name)}</b>` : 'Belum terhubung. Hubungkan akun SaveLuxe dulu sebelum mengaktifkan Premium.';
  $('#bt').textContent = ok ? 'Putuskan' : 'Connect with SaveLuxe';
  $('#bc').classList.toggle('s1', !ok);
  $('#c2').classList.toggle('lock', !ok);
  document.querySelectorAll('#c2 input,#c2 button').forEach(el => el.disabled = !ok);
  if (busy) $('#ba').disabled = true; // cegah klik ganda saat aktivasi berjalan
  $('#ok').hidden = !fin; $('#go').href = SL_URL;
}

function openSL() {
  if (!SL_ORIGIN) { say('Atur SL_URL di app.js dengan alamat SaveLuxe.', 1); return 0 }
  if (win && !win.closed) { win.focus(); return 1 }
  live = false; win = window.open(SL_URL + '?connect=1', 'saveluxe', 'width=440,height=700');
  if (!win) { say('Popup diblokir. Izinkan popup lalu coba lagi.', 1); return 0 }
  return 1;
}

// Kirim perintah aktivasi ke SaveLuxe, ulangi sampai ada balasan (sl-premium) atau waktu habis
function push() {
  pend = false; busy = true; let n = 0; clearTimeout(timer);
  say('Mengaktifkan Premium...'); sync();
  (function send() {
    if (!busy) return;
    if (!win || win.closed) { stop(); sync(); return say('Jendela SaveLuxe tertutup. Tekan Active Premium lagi.', 1) }
    if (n++ >= MAX_TRY) { stop(); sync(); return say('SaveLuxe belum membalas. Pastikan premium-bridge.js sudah terpasang di SaveLuxe, lalu coba lagi.', 1) }
    try { win.postMessage({ t: 'pl-activate', id: conn.id }, SL_ORIGIN) } catch {}
    timer = setTimeout(send, RETRY_MS);
  })();
}

$('#bc').onclick = () => {
  if (conn) { stop(); conn = null; done = null; live = false; sv('conn', null); sv('done', null); say(''); sync() }
  else if (openSL()) say('Izinkan koneksi di jendela SaveLuxe.');
};
$('#bp').onclick = async () => {
  try { $('#id').value = (await navigator.clipboard.readText()).trim() }
  catch { say('Clipboard tidak bisa dibaca. Tempel ID secara manual.', 1) }
};
$('#ba').onclick = () => {
  if (busy) return;
  const v = $('#id').value.trim();
  if (!conn) return say('Hubungkan akun SaveLuxe dulu.', 1);
  if (v !== conn.id) return say('ID tidak cocok dengan akun yang terhubung.', 1);
  want = v;
  if (win && !win.closed && live) return push();
  pend = true; if (openSL()) say('Izinkan koneksi di jendela SaveLuxe untuk melanjutkan.');
};

addEventListener('message', e => {
  const d = e.data || {};
  if (!SL_ORIGIN || e.origin !== SL_ORIGIN || e.source !== win) return;
  if (d.t === 'sl-connect') {
    live = true;
    if (pend && String(d.id) !== want) { pend = false; return say('Akun SaveLuxe yang login berbeda dari ID yang ditempel.', 1) }
    conn = { id: String(d.id), name: String(d.name || '') }; sv('conn', conn); sync();
    if (pend) push(); else say('Akun terhubung. Tempel ID lalu tekan Active Premium.');
  } else if (d.t === 'sl-premium' && conn && String(d.id) === conn.id) {
    stop(); sync();
    if (d.ok === false) return say(String(d.error || 'SaveLuxe menolak aktivasi Premium.'), 1);
    done = conn.id; sv('done', done); sync(); say('Premium aktif! Buka SaveLuxe untuk memakainya.');
  }
});

// Deteksi jendela SaveLuxe yang ditutup di tengah proses
setInterval(() => {
  if (win && win.closed) {
    win = null; live = false;
    if (pend || busy) { stop(); sync(); say('Jendela SaveLuxe ditutup sebelum selesai. Coba lagi.', 1) }
  }
}, 1000);

sync();
 /* premium-bridge.js — pasang di website SaveLuxe: <script src="premium-bridge.js"></script> sebelum </body> */
const PL_ORIGIN = 'https://GANTI-DENGAN-ALAMAT-HALAMAN-PREMIUM.netlify.app'; // alamat halaman premium (tanpa "/" di akhir, harus sama persis)

/* ===== SESUAIKAN 2 FUNGSI INI dengan sistem akun SaveLuxe-mu ===== */
function slGetUser() { // user yang sedang login -> {id, name}, atau null kalau belum login
  try {
    const u = JSON.parse(localStorage.getItem('user'));
    return u && u.id ? { id: String(u.id), name: String(u.name || u.username || '') } : null;
  } catch { return null }
}
function slSetPremium(u) { // tandai akun ini premium (ganti sesuai cara SaveLuxe menyimpan status premium)
  localStorage.setItem('premium', JSON.stringify({ id: u.id, active: true, at: Date.now() }));
}

/* ===== bagian bawah ini tidak perlu diubah ===== */
(() => {
  const op = window.opener;
  if (!op) return; // hanya aktif kalau dibuka dari halaman premium
  const send = m => { try { op.postMessage(m, PL_ORIGIN) } catch {} };

  addEventListener('message', e => {
    const d = e.data || {};
    if (e.origin !== PL_ORIGIN || e.source !== op || d.t !== 'pl-activate') return;
    const u = slGetUser();
    if (!u || u.id !== String(d.id)) return send({ t: 'sl-premium', id: String(d.id), ok: false, error: 'Akun SaveLuxe yang login tidak cocok dengan ID.' });
    slSetPremium(u);
    send({ t: 'sl-premium', id: u.id, ok: true });
    setTimeout(() => { try { window.close() } catch {} }, 1200); // kembali ke halaman premium
  });

  if (new URLSearchParams(location.search).get('connect') === '1') {
    const u = slGetUser();
    if (!u) alert('Login ke SaveLuxe dulu, lalu tekan Connect lagi dari halaman premium.');
    else if (confirm('Izinkan halaman premium terhubung ke akun ' + (u.name || u.id) + '?')) send({ t: 'sl-connect', id: u.id, name: u.name });
  }
})();
   
