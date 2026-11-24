(() => {
  'use strict';
  const byId = (id) => document.getElementById(id);
  const data = window.ASMAUL_HUSNA || [];
  const canvas = byId('previewCanvas');
  const ctx = canvas.getContext('2d');
  const audio = byId('backgroundAudio');
  const themes = {
    emerald: ['#1b382b','#10291f','#091811','#d6b978','#f4eedb','#8ea66c'],
    midnight: ['#26344c','#151f35','#090f1c','#d7c38e','#f0eee5','#748ebc'],
    sand: ['#74553a','#4b3427','#241a16','#f0d19a','#fff0d8','#d4a66a'],
    rose: ['#623e4d','#3e2939','#1c1721','#e4c39b','#f7e9e5','#bd8291']
  };
  const formats = {
    landscape: [1920,1080,'16:9 · 1920 × 1080'],
    portrait: [1080,1920,'9:16 · 1080 × 1920'],
    square: [1080,1080,'1:1 · 1080 × 1080']
  };
  const state = { index:0, theme:'emerald', format:'portrait', animation:'float', duration:15, size:100,
    translation:true, transliteration:true, playing:false, elapsed:0, start:0, image:null, imageUrl:'',
    audioUrl:'', recorder:null, chunks:[], timer:0, audioContext:null, audioDestination:null };
  const clamp = (n,min,max) => Math.min(max,Math.max(min,n));
  const fileSafe = (s) => String(s || 'asmaul-husna').normalize('NFKD').replace(/[^a-z0-9_-]+/gi,'-').replace(/^-+|-+$/g,'').toLowerCase() || 'asmaul-husna';
  const timeText = (n) => {
    n = Math.floor(Math.max(0,n));
    return String(Math.floor(n/60)).padStart(2,'0') + ':' + String(n%60).padStart(2,'0');
  };
  function notify(message) {
    const old = document.querySelector('.toast');
    if (old) old.remove();
    const el = document.createElement('div');
    el.className = 'toast'; el.textContent = message; document.body.appendChild(el);
    setTimeout(() => el.remove(), 3200);
  }
  function persist() {
    try {
      localStorage.setItem('asmaul-husna-studio-v1', JSON.stringify({
        index:state.index,theme:state.theme,format:state.format,animation:state.animation,
        duration:state.duration,size:state.size,translation:state.translation,
        transliteration:state.transliteration,project:byId('projectName').value
      }));
      byId('saveStatus').textContent = 'Tersimpan di perangkat';
    } catch (_) { byId('saveStatus').textContent = 'Penyimpanan lokal tidak tersedia'; }
  }
  function restore() {
    try {
      const s = JSON.parse(localStorage.getItem('asmaul-husna-studio-v1') || 'null');
      if (!s) return;
      if (Number.isInteger(s.index)) state.index = clamp(s.index,0,data.length-1);
      if (themes[s.theme]) state.theme = s.theme;
      if (formats[s.format]) state.format = s.format;
      if (['float','zoom','shimmer','none'].includes(s.animation)) state.animation = s.animation;
      if (Number.isFinite(s.duration)) state.duration = clamp(s.duration,5,60);
      if (Number.isFinite(s.size)) state.size = clamp(s.size,70,130);
      if (typeof s.translation === 'boolean') state.translation = s.translation;
      if (typeof s.transliteration === 'boolean') state.transliteration = s.transliteration;
      if (typeof s.project === 'string') byId('projectName').value = s.project.slice(0,60);
    } catch (_) {}
  }
  function renderNames(filter) {
    const q = (filter || '').trim().toLocaleLowerCase('id');
    const list = byId('nameList'); list.replaceChildren();
    const matches = data.map((item,i)=>({item,i})).filter(x => !q || x.item.join(' ').toLocaleLowerCase('id').includes(q));
    byId('resultCount').textContent = matches.length + ' nama';
    matches.forEach(({item,i}) => {
      const b = document.createElement('button'); b.type = 'button';
      b.className = 'name-item' + (i === state.index ? ' active' : '');
      b.setAttribute('aria-pressed',String(i === state.index));
      b.innerHTML = '<span class="name-number"></span><span class="name-item-copy"><strong></strong><small></small></span><span class="name-item-arabic" lang="ar" dir="rtl"></span>';
      b.querySelector('.name-number').textContent = String(i+1).padStart(2,'0');
      b.querySelector('strong').textContent = item[0];
      b.querySelector('small').textContent = item[2];
      b.querySelector('.name-item-arabic').textContent = item[1];
      b.addEventListener('click',()=>{ state.index=i; renderNames(byId('searchInput').value); updateCaptions(); persist(); draw(0); });
      list.appendChild(b);
    });
  }
  function updateCaptions() {
    const item = data[state.index] || data[0];
    if (!item) return;
    byId('previewName').textContent = item[0];
    byId('previewMeaning').textContent = item[2];
    byId('dimensionLabel').textContent = formats[state.format][2];
    byId('timeLabel').textContent = timeText(state.elapsed) + ' / ' + timeText(state.duration);
  }
  function applyControls() {
    document.querySelectorAll('[data-theme]').forEach(b=>b.classList.toggle('active',b.dataset.theme===state.theme));
    document.querySelectorAll('[data-format]').forEach(b=>b.classList.toggle('active',b.dataset.format===state.format));
    byId('arabicSize').value = state.size; byId('arabicSizeValue').textContent = state.size + '%';
    byId('showTranslation').checked = state.translation;
    byId('showTransliteration').checked = state.transliteration;
    byId('animationSelect').value = state.animation;
    byId('durationInput').value = state.duration; byId('durationValue').textContent = state.duration;
    byId('dimensionLabel').textContent = formats[state.format][2];
    const f = formats[state.format]; canvas.width = f[0]; canvas.height = f[1];
    canvas.style.aspectRatio = f[0] + ' / ' + f[1];
    updateCaptions(); draw(0);
  }
  function star(x,y,r,color) {
    ctx.save(); ctx.translate(x,y); ctx.strokeStyle = color; ctx.lineWidth = Math.max(1,canvas.width*.001);
    ctx.beginPath();
    for (let i=0;i<16;i++) {
      const a = Math.PI*i/8, rr = i%2 ? r*.48 : r;
      if (i===0) ctx.moveTo(Math.cos(a)*rr,Math.sin(a)*rr); else ctx.lineTo(Math.cos(a)*rr,Math.sin(a)*rr);
    }
    ctx.closePath(); ctx.stroke(); ctx.restore();
  }
  function draw(t) {
    if (!ctx || !data.length) return;
    const w=canvas.width,h=canvas.height,cx=w/2,cy=h/2,u=Math.min(w,h);
    const c=themes[state.theme] || themes.emerald;
    const g=ctx.createLinearGradient(0,0,w,h); g.addColorStop(0,c[0]);g.addColorStop(.55,c[1]);g.addColorStop(1,c[2]);
    ctx.fillStyle=g;ctx.fillRect(0,0,w,h);
    if (state.image && state.image.complete) {
      const scale=Math.max(w/state.image.width,h/state.image.height),iw=state.image.width*scale,ih=state.image.height*scale;
      ctx.save();ctx.globalAlpha=.36;ctx.drawImage(state.image,(w-iw)/2,(h-ih)/2,iw,ih);ctx.restore();
      const shade=ctx.createLinearGradient(0,0,0,h);shade.addColorStop(0,'#08130cb0');shade.addColorStop(1,'#08130ce0');
      ctx.fillStyle=shade;ctx.fillRect(0,0,w,h);
    }
    const glow=ctx.createRadialGradient(cx,cy,0,cx,cy,u*.5);glow.addColorStop(0,c[5]+'40');glow.addColorStop(1,'#00000000');
    ctx.fillStyle=glow;ctx.fillRect(0,0,w,h);
    ctx.save();ctx.translate(cx,cy);ctx.strokeStyle=c[3]+'38';ctx.lineWidth=Math.max(1,w*.001);
    for(let i=0;i<4;i++){ctx.beginPath();ctx.arc(0,0,u*(.22+i*.035),0,Math.PI*2);ctx.stroke();}
    for(let i=0;i<16;i++){ctx.save();ctx.rotate(i*Math.PI/8+(state.animation==='shimmer'&&state.playing?t*.01:0));star(0,-u*.34,u*.025,c[3]+'55');ctx.restore();}
    ctx.restore();
    for(let i=0;i<42;i++){
      const x=((i*173+41)%997)/997*w;
      const y0=((i*317+19)%991)/991*h;
      const y=(y0+(state.playing&&state.animation!=='none'?t*(5+i%4*3):0))%h;
      ctx.globalAlpha=.12+(i*7%10)/75;ctx.fillStyle=c[3];ctx.beginPath();ctx.arc(x,y,Math.max(1,w*.001),0,Math.PI*2);ctx.fill();
    }
    ctx.globalAlpha=1;
    const item=data[state.index]||data[0];
    const floatY=state.playing&&state.animation==='float'?Math.sin(t*.9)*u*.008:0;
    const zoom=state.playing&&state.animation==='zoom'?1+Math.sin(t*.55)*.018:1;
    ctx.textAlign='center';ctx.textBaseline='middle';ctx.fillStyle=c[3];
    ctx.font='600 '+Math.max(17,u*.019)+'px "DM Sans",sans-serif';ctx.letterSpacing=Math.max(2,u*.003)+'px';
    ctx.fillText('ASMAUL HUSNA',cx,cy-u*.205);ctx.letterSpacing='0px';
    ctx.fillStyle=c[3]+'bb';ctx.font='400 '+Math.max(13,u*.013)+'px "Amiri",serif';
    ctx.fillText('أَسْمَاءُ اللَّهِ الْحُسْنَى',cx,cy-u*.165);
    ctx.save();ctx.translate(cx,cy+floatY-u*.008);ctx.scale(zoom,zoom);
    let font=u*.126*(state.size/100);ctx.font='700 '+font+'px "Amiri",serif';
    while(ctx.measureText(item[1]).width>w*.82&&font>u*.065){font*=.94;ctx.font='700 '+font+'px "Amiri",serif';}
    ctx.shadowColor=c[3]+'55';ctx.shadowBlur=u*.025;ctx.fillStyle=c[4];ctx.fillText(item[1],0,0,w*.82);ctx.restore();ctx.shadowBlur=0;
    const ly=cy+u*.105;ctx.strokeStyle=c[3]+'aa';ctx.lineWidth=Math.max(1,w*.0014);
    ctx.beginPath();ctx.moveTo(cx-u*.12,ly);ctx.lineTo(cx-u*.035,ly);ctx.moveTo(cx+u*.035,ly);ctx.lineTo(cx+u*.12,ly);ctx.stroke();star(cx,ly,u*.012,c[3]);
    let ty=ly+u*.065;
    if(state.transliteration){ctx.fillStyle=c[4]+'dd';ctx.font='600 '+Math.max(18,u*.03)+'px "DM Sans",sans-serif';ctx.fillText(item[0],cx,ty);ty+=u*.055;}
    if(state.translation){ctx.fillStyle=c[4];ctx.font='400 '+Math.max(16,u*.024)+'px "DM Sans",sans-serif';ctx.fillText(item[2],cx,ty,w*.8);}
    const py=cy+u*.255,pw=u*.105,ph=u*.034;ctx.strokeStyle=c[3]+'88';ctx.lineWidth=1.3;
    if(ctx.roundRect){ctx.beginPath();ctx.roundRect(cx-pw/2,py-ph/2,pw,ph,ph/2);ctx.stroke();}
    else {ctx.strokeRect(cx-pw/2,py-ph/2,pw,ph);}
    ctx.fillStyle=c[3];ctx.font='500 '+Math.max(12,u*.014)+'px "DM Sans",sans-serif';
    ctx.fillText(String(state.index+1).padStart(2,'0')+' / 99',cx,py);
    ctx.fillStyle=c[4]+'b5';ctx.font='500 '+Math.max(10,u*.011)+'px "DM Sans",sans-serif';
    ctx.fillText('REMEMBER THE BEAUTIFUL NAMES',cx,h-Math.max(54,u*.065));
  }
  function stopPlayback() {
    state.playing=false;state.elapsed=0;audio.pause();
    byId('playIcon').textContent='▶';byId('playButton').setAttribute('aria-label','Putar pratinjau');
    byId('transportStatus').textContent=state.recorder?'Mengekspor video…':'Pratinjau siap';
    byId('timelineFill').style.width='0%';updateCaptions();draw(0);
  }
  function play() {
    if(state.playing)return;
    if(state.elapsed>=state.duration)state.elapsed=0;
    state.start=performance.now()-state.elapsed*1000;state.playing=true;
    byId('playIcon').textContent='Ⅱ';byId('playButton').setAttribute('aria-label','Jeda pratinjau');
    byId('transportStatus').textContent=state.recorder?'Merekam video…':'Pratinjau berjalan';
    if(state.audioUrl){if(state.elapsed===0)audio.currentTime=0;audio.play().catch(()=>{});}
    requestAnimationFrame(loop);
  }
  function loop(now) {
    if(!state.playing)return;
    state.elapsed=Math.min(state.duration,(now-state.start)/1000);draw(state.elapsed);
    byId('timelineFill').style.width=(state.elapsed/state.duration*100)+'%';
    byId('timeLabel').textContent=timeText(state.elapsed)+' / '+timeText(state.duration);
    if(state.elapsed>=state.duration&&!state.recorder){stopPlayback();return;}
    requestAnimationFrame(loop);
  }
  function snapshot() {
    canvas.toBlob(blob=>{
      if(!blob){notify('Gambar tidak dapat dibuat.');return;}
      const url=URL.createObjectURL(blob),a=document.createElement('a');
      a.href=url;a.download=fileSafe(byId('projectName').value)+'-'+String(state.index+1).padStart(2,'0')+'.png';
      a.click();URL.revokeObjectURL(url);notify('Gambar PNG berhasil disimpan.');
    },'image/png');
  }
  function exportView(title,message,cancel) {
    byId('exportTitle').textContent=title;byId('exportMessage').textContent=message;
    byId('cancelExportButton').classList.toggle('hidden',!cancel);byId('exportOverlay').classList.remove('hidden');
  }
  function stopExport() {
    if(state.recorder&&state.recorder.state!=='inactive'){
      state.recorder.stop();byId('exportTitle').textContent='Menyelesaikan video…';
      byId('exportMessage').textContent='Menyiapkan file unduhan.';byId('cancelExportButton').classList.add('hidden');
    }
  }
  async function exportVideo() {
    if(state.recorder)return;
    if(!canvas.captureStream||!window.MediaRecorder){notify('Ekspor video memerlukan browser Chrome atau Edge modern.');return;}
    const mime=['video/mp4;codecs=avc1.42E01E,mp4a.40.2','video/mp4','video/webm;codecs=vp9,opus','video/webm;codecs=vp8,opus','video/webm'].find(x=>MediaRecorder.isTypeSupported(x));
    if(!mime){notify('Browser ini belum mendukung ekspor MP4 atau WebM.');return;}
    const fileExtension=mime.includes('mp4')?'mp4':'webm';
    let stream;
    try{
      stream=canvas.captureStream(30);
      if(state.audioUrl){
        const AC=window.AudioContext||window.webkitAudioContext;
        if(!AC)throw new Error('Audio Web tidak tersedia pada browser ini.');
        if(!state.audioContext){
          state.audioContext=new AC();const source=state.audioContext.createMediaElementSource(audio);
          state.audioDestination=state.audioContext.createMediaStreamDestination();
          source.connect(state.audioDestination);source.connect(state.audioContext.destination);
        }
        await state.audioContext.resume();
        state.audioDestination.stream.getAudioTracks().forEach(track=>stream.addTrack(track));
      }
      state.chunks=[];const rec=new MediaRecorder(stream,{mimeType:mime,videoBitsPerSecond:8000000});state.recorder=rec;
      rec.ondataavailable=e=>{if(e.data&&e.data.size)state.chunks.push(e.data);};
      rec.onerror=()=>{state.recorder=null;stream.getTracks().forEach(t=>t.stop());byId('exportOverlay').classList.add('hidden');stopPlayback();notify('Terjadi kesalahan saat merekam.');};
      rec.onstop=()=>{
        const blob=new Blob(state.chunks,{type:mime});stream.getTracks().forEach(t=>t.stop());
        if(blob.size){
          const url=URL.createObjectURL(blob),a=document.createElement('a');a.href=url;
          a.download=fileSafe(byId('projectName').value)+'.'+fileExtension;a.click();setTimeout(()=>URL.revokeObjectURL(url),15000);
          notify('Video WebM berhasil dibuat dan diunduh.');
        }else notify('Rekaman kosong. Coba lagi.');
        state.recorder=null;state.chunks=[];clearTimeout(state.timer);
        byId('exportOverlay').classList.add('hidden');stopPlayback();
      };
      exportView('Mengekspor video…','Perekaman berlangsung '+state.duration+' detik. Biarkan tab ini tetap terbuka.',true);
      rec.start(500);state.elapsed=0;play();
      byId('transportStatus').textContent='Merekam video…';
      state.timer=setTimeout(stopExport,state.duration*1000+200);
    }catch(err){
      if(stream)stream.getTracks().forEach(t=>t.stop());state.recorder=null;
      byId('exportOverlay').classList.add('hidden');console.error(err);notify(err.message||'Tidak dapat memulai ekspor.');
    }
  }
  function uploadImage(file) {
    if(!file)return;if(!file.type.startsWith('image/')){notify('Pilih file gambar yang valid.');return;}
    if(state.imageUrl)URL.revokeObjectURL(state.imageUrl);
    const url=URL.createObjectURL(file),img=new Image();
    img.onload=()=>{state.image=img;state.imageUrl=url;byId('backgroundFileLabel').textContent=file.name;draw(0);};
    img.onerror=()=>{URL.revokeObjectURL(url);notify('Gambar tidak dapat dibaca.');};img.src=url;
  }
  function uploadAudio(file) {
    if(!file)return;if(!file.type.startsWith('audio/')){notify('Pilih file audio yang valid.');return;}
    if(state.audioUrl)URL.revokeObjectURL(state.audioUrl);
    state.audioUrl=URL.createObjectURL(file);audio.src=state.audioUrl;
    byId('audioFileLabel').textContent=file.name;notify('Audio ditambahkan ke proyek.');
  }
  function removeMedia() {
    if(state.imageUrl)URL.revokeObjectURL(state.imageUrl);if(state.audioUrl)URL.revokeObjectURL(state.audioUrl);
    state.image=null;state.imageUrl='';state.audioUrl='';audio.pause();audio.removeAttribute('src');audio.load();
    byId('backgroundInput').value='';byId('audioInput').value='';
    byId('backgroundFileLabel').textContent='Gunakan latar bawaan';byId('audioFileLabel').textContent='Tambahkan audio sendiri';
    draw(0);persist();notify('Media tambahan dihapus.');
  }
  function reset() {
    state.index=0;state.theme='emerald';state.format='portrait';state.animation='float';
    state.duration=15;state.size=100;state.translation=true;state.transliteration=true;state.elapsed=0;
    byId('projectName').value='Asmaul Husna — Video 01';byId('searchInput').value='';
    removeMedia();renderNames('');applyControls();persist();stopPlayback();notify('Pengaturan dikembalikan ke awal.');
  }
  function bind() {
    byId('searchInput').addEventListener('input',e=>renderNames(e.target.value));
    byId('clearSearch').addEventListener('click',()=>{byId('searchInput').value='';renderNames('');byId('searchInput').focus();});
    byId('themeGrid').addEventListener('click',e=>{const b=e.target.closest('[data-theme]');if(b){state.theme=b.dataset.theme;applyControls();persist();}});
    byId('formatOptions').addEventListener('click',e=>{const b=e.target.closest('[data-format]');if(b){state.format=b.dataset.format;applyControls();persist();}});
    byId('arabicSize').addEventListener('input',e=>{state.size=Number(e.target.value);byId('arabicSizeValue').textContent=state.size+'%';draw(0);persist();});
    byId('showTranslation').addEventListener('change',e=>{state.translation=e.target.checked;draw(0);persist();});
    byId('showTransliteration').addEventListener('change',e=>{state.transliteration=e.target.checked;draw(0);persist();});
    byId('animationSelect').addEventListener('change',e=>{state.animation=e.target.value;byId('renderHint').textContent=state.animation==='none'?'Animasi dinonaktifkan':'Animasi lembut aktif saat diputar';draw(0);persist();});
    byId('durationInput').addEventListener('input',e=>{state.duration=Number(e.target.value);byId('durationValue').textContent=state.duration;updateCaptions();persist();});
    byId('projectName').addEventListener('input',persist);
    byId('playButton').addEventListener('click',()=>{if(state.recorder){notify('Ekspor sedang berlangsung. Gunakan tombol Hentikan ekspor untuk menghentikannya.');return;}if(state.playing){state.playing=false;audio.pause();byId('playIcon').textContent='▶';byId('transportStatus').textContent='Pratinjau dijeda';}else play();});
    byId('snapshotButton').addEventListener('click',snapshot);
    byId('exportTopButton').addEventListener('click',exportVideo);
    byId('cancelExportButton').addEventListener('click',stopExport);
    byId('backgroundInput').addEventListener('change',e=>uploadImage(e.target.files&&e.target.files[0]));
    byId('audioInput').addEventListener('change',e=>uploadAudio(e.target.files&&e.target.files[0]));
    byId('removeMediaButton').addEventListener('click',removeMedia);
    byId('resetButton').addEventListener('click',reset);
    byId('fullscreenButton').addEventListener('click',async()=>{try{if(!document.fullscreenElement)await byId('canvasStage').requestFullscreen();else await document.exitFullscreen();}catch(_){notify('Layar penuh tidak tersedia.');}});
    byId('helpButton').addEventListener('click',()=>byId('helpModal').classList.remove('hidden'));
    const dismissHelp = () => { byId('helpModal').classList.add('hidden'); try { localStorage.setItem('asmaul-husna-help-seen','1'); } catch (_) {} };
    byId('closeHelp').addEventListener('click',dismissHelp);
    byId('gotItButton').addEventListener('click',dismissHelp);
    byId('helpModal').addEventListener('click',e=>{if(e.target===byId('helpModal'))dismissHelp();});
    document.addEventListener('keydown',e=>{if(e.key==='Escape'){byId('helpModal').classList.add('hidden');if(document.fullscreenElement)document.exitFullscreen();}});
  }
  function init() {
    if(!ctx){notify('Browser tidak mendukung kanvas HTML5.');return;}
    restore();renderNames('');applyControls();
    byId('renderHint').textContent=state.animation==='none'?'Animasi dinonaktifkan':'Animasi lembut aktif saat diputar';
    bind();
    let helpSeen=false;
    try { helpSeen=localStorage.getItem('asmaul-husna-help-seen')==='1'; } catch (_) {}
    if(!helpSeen)byId('helpModal').classList.remove('hidden');
  }
  init();
})();