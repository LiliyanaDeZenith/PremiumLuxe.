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
