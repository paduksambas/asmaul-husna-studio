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
    audioUrl:'', recorder:null, chunks:[], timer:0, audioDestination:null, backgroundAudioSource:null, backgroundAudioGain:null,
    ttsPipeline:null, ttsLoadPromise:null, ttsBackend:'', ttsBusy:false, ttsStop:false, speechAudioContext:null, speechSource:null,
    speechAnimating:false, speechAnimationStart:0, renderLoopActive:false, transitionStart:0, transitionDuration:420,
    exportBusy:false, exportPreparing:false, exportCancelled:false, narrationExportActive:false,
    exportDuration:0, exportAudioStart:0, exportTimeline:[], exportSources:[] };
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
      b.addEventListener('click',()=>{ stopSpeech(false); state.index=i; renderNames(byId('searchInput').value); updateCaptions(); persist(); draw(0); });
      list.appendChild(b);
    });
  }
  function updateCaptions() {
    const item = data[state.index] || data[0];
    if (!item) return;
    byId('previewName').textContent = item[0];
    byId('previewMeaning').textContent = item[2];
    byId('dimensionLabel').textContent = formats[state.format][2];
    const visibleDuration = state.narrationExportActive ? state.exportDuration : state.duration;
    byId('timeLabel').textContent = timeText(state.elapsed) + ' / ' + timeText(visibleDuration);
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
  function beginNameTransition(nextIndex) {
    if (nextIndex === state.index) return;
    // Fade only the changing name/text layer; never cover the animated canvas
    // with a frozen full-frame snapshot.
    state.transitionStart = performance.now();
  }
  function draw(t) {
    if (!ctx || !data.length) return;
    const animated = state.playing || state.speechAnimating;
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
    const motionActive=animated&&state.animation!=='none';
    // Use a monotonic wall-clock phase for shimmer so redraw cadence or elapsed-time
    // resets cannot make the decorative rotation pause or jump.
    const motionTime=animated ? performance.now()/1000 : t;
    const ambientPulse=motionActive ? .5+.5*Math.sin(t*.72) : 0;
    const glow=ctx.createRadialGradient(cx,cy,0,cx,cy,u*(.47+ambientPulse*.025));glow.addColorStop(0,c[5]+(motionActive?'48':'40'));glow.addColorStop(1,'#00000000');
    ctx.fillStyle=glow;ctx.fillRect(0,0,w,h);
    ctx.save();ctx.translate(cx,cy);ctx.strokeStyle=c[3]+'38';ctx.lineWidth=Math.max(1,w*.001);
    for(let i=0;i<4;i++){
      const ringPulse=motionActive?Math.sin(t*.48-i*.42)*u*.003:0;
      ctx.beginPath();ctx.arc(0,0,u*(.22+i*.035)+ringPulse,0,Math.PI*2);ctx.stroke();
    }
    const shimmering=animated&&state.animation==='shimmer';
    if(shimmering){
      // Three separated arc tracks make the rotation visually legible; the angle
      // advances continuously and wraps naturally through a full 2π revolution.
      ctx.save();
      ctx.rotate(motionTime*.34);
      ctx.strokeStyle=c[3]+'b8';
      ctx.lineWidth=Math.max(2,w*.0022);
      ctx.lineCap='round';
      for(let i=0;i<3;i++){
        const radius=u*(.285+i*.026);
        const offset=i*Math.PI*2/3;
        ctx.beginPath();
        ctx.arc(0,0,radius,offset+.18,offset+1.12);
        ctx.stroke();
      }
      ctx.restore();
    }
    for(let i=0;i<16;i++){
      const starPulse=shimmering ? .66+.34*(.5+.5*Math.sin(motionTime*1.12+i*1.43)) : 1;
      const starSizePulse=shimmering ? .5+.5*Math.sin(motionTime*.8+i) : 0;
      ctx.save();ctx.globalAlpha=starPulse;ctx.rotate(i*Math.PI/8+(shimmering?motionTime*.105:0));
      star(0,-u*.34,u*(.024+.0015*starSizePulse),c[3]+'88');ctx.restore();
    }
    ctx.restore();
    for(let i=0;i<42;i++){
      const x0=((i*173+41)%997)/997*w;
      const x=x0+(motionActive?Math.sin(t*.34+i*1.17)*u*.006:0);
      const y0=((i*317+19)%991)/991*h;
      const y=(y0+(motionActive?t*(10+i%5*2.5):0))%h;
      const twinkle=motionActive ? .78+.22*(.5+.5*Math.sin(t*.82+i*1.91)) : 1;
      ctx.globalAlpha=(.16+(i*7%10)/60)*twinkle;ctx.fillStyle=c[3];ctx.beginPath();ctx.arc(x,y,Math.max(1.5,w*.0015),0,Math.PI*2);ctx.fill();
    }
    ctx.globalAlpha=1;
    const item=data[state.index]||data[0];
    const floatY=animated&&state.animation==='float'?Math.sin(t*.72)*u*.018:0;
    const zoom=animated&&state.animation==='zoom'?1+Math.sin(t*.52)*.032:1;
    const floatScale=animated&&state.animation==='float'?1+Math.sin(t*.72+Math.PI/2)*.006:1;
    const nameFade = state.transitionStart
      ? clamp((performance.now() - state.transitionStart) / state.transitionDuration, 0, 1)
      : 1;
    // Static identity header: it stays fixed and never joins the name transition.
    ctx.save();
    ctx.textAlign='center';ctx.textBaseline='middle';ctx.fillStyle=c[3];
    ctx.font='600 '+Math.max(17,u*.019)+'px "DM Sans",sans-serif';ctx.letterSpacing=Math.max(2,u*.003)+'px';
    const headerY=cy-u*.43;
    ctx.fillText('ASMAUL HUSNA',cx,headerY);ctx.letterSpacing='0px';
    ctx.fillStyle=c[3]+'bb';ctx.font='400 '+Math.max(13,u*.013)+'px "Amiri",serif';
    ctx.fillText('أَسْمَاءُ اللَّهِ الْحُسْنَى',cx,cy-u*.39);
    ctx.restore();

    // Only the changing name, transliteration, meaning and sequence fade.
    ctx.save();
    ctx.globalAlpha = nameFade;
    ctx.textAlign='center';ctx.textBaseline='middle';
    ctx.save();ctx.translate(cx,cy-u*.14+floatY);ctx.scale(zoom*floatScale,zoom*floatScale);
    let font=u*.126*(state.size/100);ctx.font='700 '+font+'px "Amiri",serif';
    while(ctx.measureText(item[1]).width>w*.82&&font>u*.065){font*=.94;ctx.font='700 '+font+'px "Amiri",serif';}
    ctx.shadowColor=c[3]+'55';ctx.shadowBlur=u*(.022+(motionActive?ambientPulse*.004:0));
    let arabicFill=c[4];
    if(shimmering){
      const sheenCenter=-w*.48+((motionTime*.19)%1)*w*.96;
      const sheen=ctx.createLinearGradient(sheenCenter-u*.12,0,sheenCenter+u*.12,0);
      sheen.addColorStop(0,c[4]);sheen.addColorStop(.5,'#fff9e9');sheen.addColorStop(1,c[4]);
      arabicFill=sheen;
    }
    ctx.fillStyle=arabicFill;ctx.fillText(item[1],0,0,w*.82);ctx.restore();ctx.shadowBlur=0;
    const ly=cy+u*.025;ctx.strokeStyle=c[3]+'aa';ctx.lineWidth=Math.max(1,w*.0014);
    ctx.beginPath();ctx.moveTo(cx-u*.12,ly);ctx.lineTo(cx-u*.035,ly);ctx.moveTo(cx+u*.035,ly);ctx.lineTo(cx+u*.12,ly);ctx.stroke();star(cx,ly,u*.012,c[3]);
    let ty=cy+u*.10;
    if(state.transliteration){ctx.fillStyle=c[4]+'dd';ctx.font='600 '+Math.max(18,u*.03)+'px "DM Sans",sans-serif';ctx.fillText(item[0],cx,ty);ty+=u*.055;}
    if(state.translation){ctx.fillStyle=c[4];ctx.font='400 '+Math.max(16,u*.024)+'px "DM Sans",sans-serif';ctx.fillText(item[2],cx,ty,w*.8);}
    const py=cy+u*.28,pw=u*.105,ph=u*.034;ctx.strokeStyle=c[3]+'88';ctx.lineWidth=1.3;
    if(ctx.roundRect){ctx.beginPath();ctx.roundRect(cx-pw/2,py-ph/2,pw,ph,ph/2);ctx.stroke();}
    else {ctx.strokeRect(cx-pw/2,py-ph/2,pw,ph);}
    ctx.fillStyle=c[3];ctx.font='500 '+Math.max(12,u*.014)+'px "DM Sans",sans-serif';
    ctx.fillText(String(state.index+1).padStart(2,'0')+' / 99',cx,py);
    ctx.restore();
    if (nameFade >= 1) state.transitionStart = 0;
    ctx.fillStyle=c[4]+'b5';ctx.font='500 '+Math.max(10,u*.011)+'px "DM Sans",sans-serif';
    ctx.fillText('REMEMBER THE BEAUTIFUL NAMES',cx,h-Math.max(54,u*.065));
  }
  function ensureRenderLoop() {
    if (state.renderLoopActive) return;
    state.renderLoopActive = true;
    requestAnimationFrame(loop);
  }
  function startSpeechAnimation(restartPhase=false) {
    if (!state.speechAnimating || restartPhase) {
      state.speechAnimating = true;
      state.speechAnimationStart = performance.now();
    }
    ensureRenderLoop();
  }
  function stopSpeechAnimation() {
    if (!state.speechAnimating) return;
    state.speechAnimating = false;
    if (!state.playing) draw(0);
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
    if(state.audioUrl){
      if(state.backgroundAudioSource&&state.speechAudioContext&&state.speechAudioContext.state!=='running'){
        state.speechAudioContext.resume().catch(()=>{});
      }
      if(state.elapsed===0)audio.currentTime=0;
      audio.play().catch(()=>{});
    }
    ensureRenderLoop();
  }
  function loop(now) {
    if (!state.playing && !state.speechAnimating) {
      state.renderLoopActive = false;
      draw(0);
      return;
    }
    if (state.playing) {
      const activeDuration = state.narrationExportActive ? state.exportDuration : state.duration;
      if (state.narrationExportActive && state.speechAudioContext && state.exportAudioStart) {
        state.elapsed = clamp(state.speechAudioContext.currentTime - state.exportAudioStart, 0, activeDuration);
        let nextIndex = 0;
        for (let i = 1; i < state.exportTimeline.length; i++) {
          if (state.elapsed >= state.exportTimeline[i]) nextIndex = i;
          else break;
        }
        if (nextIndex !== state.index) {
          beginNameTransition(nextIndex);
          state.index = nextIndex;
          renderNames(byId('searchInput').value);
          updateCaptions();
          persist();
          // Keep the animation phase continuous while the narrated sequence changes names.
        }
      } else {
        state.elapsed = Math.min(activeDuration, (now - state.start) / 1000);
      }
      byId('timelineFill').style.width = (state.elapsed / activeDuration * 100) + '%';
      byId('timeLabel').textContent = timeText(state.elapsed) + ' / ' + timeText(activeDuration);
      if (state.elapsed >= activeDuration && !state.recorder) stopPlayback();
    }
    if (state.speechAnimating) draw((now - state.speechAnimationStart) / 1000);
    else if (state.playing) draw(state.elapsed);
    else {
      state.renderLoopActive = false;
      draw(0);
      return;
    }
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
  function ensureAudioMixDestination() {
    const context = ensureSpeechAudioContext();
    if (!state.audioDestination) state.audioDestination = context.createMediaStreamDestination();
    if (state.audioUrl && !state.backgroundAudioSource) {
      state.backgroundAudioSource = context.createMediaElementSource(audio);
      state.backgroundAudioGain = context.createGain();
      state.backgroundAudioGain.gain.value = 1;
      state.backgroundAudioSource.connect(state.backgroundAudioGain);
      state.backgroundAudioGain.connect(context.destination);
      state.backgroundAudioGain.connect(state.audioDestination);
    }
    return state.audioDestination;
  }
  function attachAudioMixTrack(stream, audioDestination) {
    const track = audioDestination.stream.getAudioTracks()[0];
    if (!track || typeof track.clone !== 'function') {
      throw new Error('Browser tidak dapat menggandakan track audio untuk ekspor.');
    }
    stream.addTrack(track.clone());
  }
  async function loadBackgroundAudioBuffer(context) {
    if (!state.audioUrl) return null;
    const response = await fetch(state.audioUrl);
    if (!response.ok) throw new Error('File audio latar tidak dapat dibaca untuk ekspor.');
    const buffer = await context.decodeAudioData(await response.arrayBuffer());
    if (!buffer || !Number.isFinite(buffer.duration) || buffer.duration <= 0) {
      throw new Error('File audio latar tidak menghasilkan audio yang valid.');
    }
    return buffer;
  }
  function scheduleBackgroundAudio(context, audioDestination, buffer, startAt) {
    if (!buffer) return;
    const source = context.createBufferSource();
    const gain = context.createGain();
    source.buffer = buffer;
    source.loop = true;
    gain.gain.value = 0.18;
    source.connect(gain);
    gain.connect(context.destination);
    gain.connect(audioDestination);
    state.exportSources.push({ source, gain });
    source.start(startAt);
  }
  function stopNarrationSources() {
    state.exportSources.forEach(entry => { try { (entry.source || entry).stop(); } catch (_) {} });
    state.exportSources = [];
  }
  function stopExport(userCancelled=true) {
    if (state.exportPreparing && !state.recorder) {
      if (userCancelled) {
        state.exportCancelled = true;
        byId('exportTitle').textContent = 'Membatalkan ekspor…';
        byId('exportMessage').textContent = 'Menghentikan persiapan audio AI dengan aman.';
        byId('cancelExportButton').disabled = true;
      }
      return;
    }
    if (state.recorder && state.recorder.state !== 'inactive') {
      if (userCancelled && state.narrationExportActive) state.exportCancelled = true;
      if (state.narrationExportActive) {
        stopNarrationSources();
        audio.pause();
      }
      state.recorder.stop();
      byId('exportTitle').textContent = 'Menyelesaikan video…';
      byId('exportMessage').textContent = state.narrationExportActive && state.exportCancelled
        ? 'Ekspor narasi dibatalkan. Membersihkan rekaman.'
        : 'Menyiapkan file unduhan.';
      byId('cancelExportButton').classList.add('hidden');
    }
  }
  async function exportVideo() {
    if (state.recorder || state.exportBusy) return;
    if (state.ttsBusy) { notify('Hentikan pembacaan suara AI sebelum mengekspor video biasa.'); return; }
    if (!canvas.captureStream || !window.MediaRecorder) { notify('Ekspor video memerlukan browser Chrome atau Edge modern.'); return; }
    const mime = ['video/mp4;codecs=avc1.42E01E,mp4a.40.2','video/mp4','video/webm;codecs=vp9,opus','video/webm;codecs=vp8,opus','video/webm'].find(x => MediaRecorder.isTypeSupported(x));
    if (!mime) { notify('Browser ini belum mendukung ekspor MP4 atau WebM.'); return; }
    const fileExtension = mime.includes('mp4') ? 'mp4' : 'webm';
    let stream;
    state.exportBusy = true;
    try {
      stream = canvas.captureStream(30);
      if (state.audioUrl) {
        const context = ensureSpeechAudioContext();
        const audioDestination = ensureAudioMixDestination();
        await context.resume();
        attachAudioMixTrack(stream, audioDestination);
      }
      state.chunks = [];
      const rec = new MediaRecorder(stream, { mimeType:mime, videoBitsPerSecond:8000000, audioBitsPerSecond:128000 });
      state.recorder = rec;
      rec.ondataavailable = e => { if (e.data && e.data.size) state.chunks.push(e.data); };
      rec.onerror = () => {
        state.recorder = null; state.exportBusy = false; clearTimeout(state.timer);
        stream.getTracks().forEach(t => t.stop());
        byId('exportOverlay').classList.add('hidden'); stopPlayback();
        notify('Terjadi kesalahan saat merekam.');
      };
      rec.onstop = () => {
        const blob = new Blob(state.chunks, { type:mime });
        stream.getTracks().forEach(t => t.stop());
        if (blob.size) {
          const url = URL.createObjectURL(blob), a = document.createElement('a');
          a.href = url; a.download = fileSafe(byId('projectName').value) + '.' + fileExtension; a.click();
          setTimeout(() => URL.revokeObjectURL(url), 15000);
          notify('Video ' + fileExtension.toUpperCase() + ' berhasil dibuat dan diunduh.');
        } else notify('Rekaman kosong. Coba lagi.');
        state.recorder = null; state.chunks = []; state.exportBusy = false; clearTimeout(state.timer);
        byId('exportOverlay').classList.add('hidden'); stopPlayback();
      };
      exportView('Mengekspor video…', 'Perekaman berlangsung ' + state.duration + ' detik. Biarkan tab ini tetap terbuka.', true);
      rec.start(500); state.elapsed = 0; play();
      byId('transportStatus').textContent = 'Merekam video…';
      state.timer = setTimeout(() => stopExport(false), state.duration * 1000 + 200);
    } catch (err) {
      if (stream) stream.getTracks().forEach(t => t.stop());
      state.recorder = null; state.exportBusy = false;
      byId('exportOverlay').classList.add('hidden'); console.error(err);
      notify(err.message || 'Tidak dapat memulai ekspor.');
    }
  }
  async function exportNarrationVideo() {
    if (state.recorder || state.exportBusy) return;
    if (state.ttsBusy) { notify('Selesaikan pembacaan suara yang sedang berjalan terlebih dahulu.'); return; }
    if (data.length !== 99) { notify('Data Asmaul Husna belum lengkap. Ekspor narasi membutuhkan 99 nama.'); return; }
    if (!canvas.captureStream || !window.MediaRecorder) { notify('Ekspor video memerlukan browser yang mendukung perekaman kanvas dan audio.'); return; }
    const mime = ['video/mp4;codecs=avc1.42E01E,mp4a.40.2','video/mp4','video/webm;codecs=vp9,opus','video/webm;codecs=vp8,opus','video/webm'].find(x => MediaRecorder.isTypeSupported(x));
    if (!mime) { notify('Browser ini belum mendukung ekspor MP4 atau WebM.'); return; }

    const fileExtension = mime.includes('mp4') ? 'mp4' : 'webm';
    let stream = null;
    let recorder = null;
    let completed = false;
    state.exportBusy = true;
    state.exportPreparing = true;
    state.exportCancelled = false;
    state.ttsBusy = true;
    byId('cancelExportButton').disabled = false;

    try {
      const voice = selectedSpeechVoice();
      const context = ensureSpeechAudioContext();
      await context.resume();
      exportView('Menyiapkan narasi AI…', 'Memuat Supertonic 3 dan membuat audio untuk 99 nama. Jangan tutup tab ini.', true);
      await loadSpeechModel();

      const buffers = [];
      for (let i = 0; i < data.length; i++) {
        if (state.exportCancelled) throw new Error('EXPORT_CANCELLED');
        byId('exportTitle').textContent = 'Membuat audio AI ' + (i + 1) + ' / ' + data.length + '…';
        byId('exportMessage').textContent = data[i][0] + ' · ' + Math.round((i / data.length) * 100) + '% selesai';
        byId('speechStatus').textContent = 'Menyiapkan narasi video ' + (i + 1) + ' dari 99: ' + data[i][0] + ' · preset ' + voice + '…';
        const blob = await synthesizeName(i, voice);
        const buffer = await context.decodeAudioData(await blob.arrayBuffer());
        if (!buffer || !Number.isFinite(buffer.duration) || buffer.duration <= 0) {
          throw new Error('Audio untuk ' + data[i][0] + ' tidak valid.');
        }
        buffers.push(buffer);
      }
      if (state.exportCancelled) throw new Error('EXPORT_CANCELLED');

      const pauseBetweenNames = 0.32;
      let cursor = 0;
      const timeline = buffers.map((buffer, index) => {
        const start = cursor;
        cursor += buffer.duration + (index < buffers.length - 1 ? pauseBetweenNames : 0);
        return start;
      });
      const totalDuration = cursor;
      const audioDestination = ensureAudioMixDestination();
      let backgroundBuffer = null;
      if (state.audioUrl) {
        byId('exportMessage').textContent = 'Menyiapkan audio latar untuk dicampur dengan narasi…';
        backgroundBuffer = await loadBackgroundAudioBuffer(context);
      }
      if (state.exportCancelled) throw new Error('EXPORT_CANCELLED');
      await context.resume();

      stream = canvas.captureStream(30);
      attachAudioMixTrack(stream, audioDestination);
      state.chunks = [];
      recorder = new MediaRecorder(stream, { mimeType:mime, videoBitsPerSecond:8000000, audioBitsPerSecond:128000 });
      state.recorder = recorder;
      state.exportPreparing = false;
      state.ttsBusy = false;
      state.narrationExportActive = true;
      state.exportDuration = totalDuration;
      state.exportTimeline = timeline;
      state.exportSources = [];

      recorder.ondataavailable = event => { if (event.data && event.data.size) state.chunks.push(event.data); };
      recorder.onerror = () => {
        state.exportCancelled = true;
        try { if (recorder.state !== 'inactive') recorder.stop(); } catch (_) {}
      };
      recorder.onstop = () => {
        if (completed) return;
        completed = true;
        const cancelled = state.exportCancelled;
        const blob = new Blob(state.chunks, { type:mime });
        stream.getTracks().forEach(track => track.stop());
        if (blob.size && !cancelled) {
          const url = URL.createObjectURL(blob), a = document.createElement('a');
          a.href = url;
          a.download = fileSafe(byId('projectName').value) + '-99-nama-ai.' + fileExtension;
          a.click();
          setTimeout(() => URL.revokeObjectURL(url), 15000);
          notify('Video 99 nama dengan narasi AI berhasil diunduh (' + fileExtension.toUpperCase() + ').');
          byId('speechStatus').textContent = 'Ekspor 99 nama selesai · Supertonic 3 ' + voice + '.';
        } else if (cancelled) {
          notify('Ekspor narasi dibatalkan. Tidak ada file parsial yang disimpan.');
          byId('speechStatus').textContent = 'Ekspor narasi dibatalkan.';
        } else {
          notify('Rekaman narasi kosong. Coba lagi.');
        }

        clearTimeout(state.timer);
        stopNarrationSources();
        audio.pause();
        state.recorder = null; state.chunks = []; state.exportBusy = false;
        state.exportPreparing = false; state.narrationExportActive = false;
        state.exportDuration = 0; state.exportAudioStart = 0; state.exportTimeline = [];
        state.exportCancelled = false; state.ttsBusy = false;
        byId('cancelExportButton').disabled = false;
        byId('exportOverlay').classList.add('hidden');
        stopSpeechAnimation(); stopPlayback();
        if (typeof resolveRecording === 'function') resolveRecording();
      };

      let resolveRecording;
      const recordingFinished = new Promise(resolve => { resolveRecording = resolve; });
      const estimatedDuration = Math.ceil(totalDuration);
      exportView(
        'Merekam video + narasi 99 nama…',
        'Durasi sekitar ' + timeText(estimatedDuration) + ' · preset ' + voice + (state.audioUrl ? ' · audio latar dipelankan' : '') + '. Biarkan tab tetap terbuka.',
        true
      );

      state.index = 0;
      renderNames(byId('searchInput').value);
      state.elapsed = 0;
      state.playing = true;
      state.start = performance.now();
      state.exportAudioStart = context.currentTime + 0.25;
      audio.pause();
      scheduleBackgroundAudio(context, audioDestination, backgroundBuffer, state.exportAudioStart);
      startSpeechAnimation(true);
      updateCaptions();
      draw(0);
      recorder.start(500);
      ensureRenderLoop();
      byId('transportStatus').textContent = 'Merekam video + suara AI…';
      byId('speechStatus').textContent = 'Merekam 99 nama dengan preset ' + voice + '…';

      buffers.forEach((buffer, index) => {
        const source = context.createBufferSource();
        const gain = context.createGain();
        source.buffer = buffer;
        gain.gain.value = 0.92;
        source.connect(gain);
        gain.connect(context.destination);
        gain.connect(audioDestination);
        state.exportSources.push({ source, gain });
        source.start(state.exportAudioStart + timeline[index]);
      });

      state.timer = setTimeout(() => stopExport(false), Math.ceil((totalDuration + 1) * 1000));
      await recordingFinished;
    } catch (error) {
      if (state.recorder && state.recorder.state !== 'inactive') {
        state.exportCancelled = true;
        stopNarrationSources();
        audio.pause();
        try { state.recorder.stop(); } catch (_) {}
        return;
      }
      if (stream) stream.getTracks().forEach(track => track.stop());
      stopNarrationSources();
      state.recorder = null; state.chunks = []; state.exportBusy = false;
      state.exportPreparing = false; state.narrationExportActive = false;
      state.exportDuration = 0; state.exportAudioStart = 0; state.exportTimeline = [];
      state.exportCancelled = false; state.ttsBusy = false;
      byId('cancelExportButton').disabled = false;
      byId('exportOverlay').classList.add('hidden');
      stopSpeechAnimation(); stopPlayback();
      if (error && error.message === 'EXPORT_CANCELLED') {
        byId('speechStatus').textContent = 'Persiapan ekspor narasi dibatalkan.';
        notify('Persiapan ekspor narasi dibatalkan.');
      } else {
        console.error('Narrated video export failed:', error);
        byId('speechStatus').textContent = 'Ekspor narasi gagal: ' + (error.message || String(error));
        notify(error.message || 'Tidak dapat membuat video dengan narasi AI.');
      }
    }
  }
  function refreshSpeechVoices() {
    const select = byId('speechVoice');
    if (!select.options.length) select.add(new Option('Suara laki-laki · M1','M1'));
    return select.value || 'M1';
  }
  function selectedSpeechVoice() {
    return byId('speechVoice').value || 'M1';
  }
  function speechProgress(progress) {
    if (!progress || progress.status !== 'progress') return;
    const file = String(progress.file || progress.name || 'aset model').split('/').pop();
    const percent = Math.round(progress.progress || 0);
    byId('speechStatus').textContent = 'Memuat ' + file + ': ' + percent + '%';
  }
  async function loadSpeechModel() {
    if (state.ttsPipeline) {
      byId('speechStatus').textContent = 'Model suara AI siap (' + state.ttsBackend + '). Pilih suara lalu tekan Baca nama ini.';
      return state.ttsPipeline;
    }
    if (state.ttsLoadPromise) return state.ttsLoadPromise;

    const loadButton = byId('loadSpeechButton');
    loadButton.disabled = true;
    loadButton.textContent = 'Memuat model…';
    byId('speechStatus').textContent = 'Mengunduh dan menyiapkan model Supertonic 3. Unduhan awal sekitar 200 MB; browser akan menyimpan cache bila diizinkan.';
    state.ttsLoadPromise = (async () => {
      try {
        if (navigator.storage && typeof navigator.storage.persist === 'function') {
          try { await navigator.storage.persist(); } catch (_) {}
        }

        const { pipeline, env } = await import('https://esm.sh/@huggingface/transformers');
        env.allowLocalModels = false;
        env.useBrowserCache = true;

        const model = 'open-world-group/Supertonic-3-ONNX';
        try {
          byId('speechStatus').textContent = 'Mencoba akselerasi WebGPU (FP16)…';
          state.ttsPipeline = await pipeline('text-to-speech', model, {
            device: 'webgpu',
            dtype: 'fp16',
            progress_callback: speechProgress
          });
          state.ttsBackend = 'WebGPU FP16';
        } catch (webgpuError) {
          console.warn('WebGPU tidak tersedia atau gagal; beralih ke WASM Q8:', webgpuError);
          byId('speechStatus').textContent = 'WebGPU tidak tersedia. Menyiapkan mode kompatibel WASM Q8…';
          state.ttsPipeline = await pipeline('text-to-speech', model, {
            device: 'wasm',
            dtype: {
              text_encoder: 'fp32',
              latent_denoiser: 'q8',
              voice_decoder: 'fp32'
            },
            progress_callback: speechProgress
          });
          state.ttsBackend = 'WASM Q8';
        }

        loadButton.textContent = 'Model suara siap';
        byId('speechStatus').textContent = 'Supertonic 3 siap (' + state.ttsBackend + '). Pilih preset M1–M5 atau F1–F5.';
        return state.ttsPipeline;
      } catch (error) {
        state.ttsPipeline = null;
        state.ttsBackend = '';
        console.error('Supertonic 3 load failed:', error);
        byId('speechStatus').textContent = 'Model AI gagal dimuat: ' + (error.message || String(error)) + '. Periksa internet lalu coba Muat model AI lagi.';
        loadButton.textContent = 'Coba muat model lagi';
        throw error;
      } finally {
        state.ttsLoadPromise = null;
        loadButton.disabled = false;
      }
    })();
    return state.ttsLoadPromise;
  }
  function ensureSpeechAudioContext() {
    if (state.speechAudioContext) return state.speechAudioContext;
    const AudioContextClass = window.AudioContext || window.webkitAudioContext;
    if (!AudioContextClass) throw new Error('AudioContext tidak tersedia pada browser ini.');
    state.speechAudioContext = new AudioContextClass();
    return state.speechAudioContext;
  }
  async function synthesizeName(index, voice) {
    if (!state.ttsPipeline) throw new Error('Model Supertonic 3 belum dimuat.');
    const item = data[index];
    const speaker = 'https://huggingface.co/open-world-group/Supertonic-3-ONNX/resolve/main/voices/' + voice + '.bin';
    const output = await state.ttsPipeline('<ar>' + item[1] + '</ar>', {
      speaker_embeddings: speaker,
      num_inference_steps: 5,
      speed: 1.0
    });
    const blob = output && typeof output.toBlob === 'function' ? output.toBlob() : null;
    if (!(blob instanceof Blob) || !blob.size) throw new Error('Model tidak menghasilkan audio yang dapat diputar.');
    return blob;
  }
  async function playSpeechBlob(blob) {
    const context = ensureSpeechAudioContext();
    if (context.state !== 'running') await context.resume();
    const buffer = await context.decodeAudioData(await blob.arrayBuffer());
    if (state.ttsStop) return false;

    return new Promise((resolve, reject) => {
      const source = context.createBufferSource();
      source.buffer = buffer;
      source.connect(context.destination);
      state.speechSource = source;
      source.onended = () => {
        if (state.speechSource === source) state.speechSource = null;
        resolve(!state.ttsStop);
      };
      try {
        startSpeechAnimation();
        source.start(0);
      } catch (error) {
        state.speechSource = null;
        reject(error);
      }
    });
  }
  function stopSpeech(showMessage=true) {
    if (state.exportPreparing || state.narrationExportActive) {
      stopExport(true);
      if (showMessage) byId('speechStatus').textContent = 'Menghentikan ekspor narasi…';
      return;
    }
    if (state.exportBusy) {
      if (showMessage) byId('speechStatus').textContent = 'Gunakan tombol Hentikan ekspor untuk menghentikan rekaman video.';
      return;
    }
    state.ttsStop = true;
    const activeSource = state.speechSource;
    state.speechSource = null;
    stopSpeechAnimation();
    if (activeSource) {
      try { activeSource.stop(); } catch (_) {}
    }
    if (showMessage) byId('speechStatus').textContent = 'Pembacaan dihentikan.';
  }
  async function speakCurrent() {
    if (state.ttsBusy || state.exportBusy) return;
    state.ttsStop = false;
    state.ttsBusy = true;
    try {
      const context = ensureSpeechAudioContext();
      await context.resume();
      const voice = selectedSpeechVoice();
      await loadSpeechModel();
      startSpeechAnimation();
      byId('speechStatus').textContent = 'Membuat audio AI untuk ' + data[state.index][0] + ' dengan preset ' + voice + '…';
      const blob = await synthesizeName(state.index, voice);
      if (state.ttsStop) return;
      await playSpeechBlob(blob);
      if (!state.ttsStop) byId('speechStatus').textContent = 'Selesai membaca ' + data[state.index][0] + ' · Supertonic 3 ' + state.ttsBackend + '.';
    } catch (error) {
      console.error('Supertonic 3 synthesis failed:', error);
      if (!state.ttsStop) byId('speechStatus').textContent = 'Gagal membuat audio AI: ' + (error.message || String(error));
    } finally {
      stopSpeechAnimation();
      state.ttsBusy = false;
    }
  }
  async function speakAll() {
    if (state.ttsBusy || state.exportBusy) return;
    state.ttsStop = false;
    state.ttsBusy = true;
    try {
      const context = ensureSpeechAudioContext();
      await context.resume();
      const voice = selectedSpeechVoice();
      await loadSpeechModel();
      startSpeechAnimation();
      for (let i = 0; i < data.length; i++) {
        if (state.ttsStop) break;
        if (i !== state.index) beginNameTransition(i);
        state.index = i;
        renderNames(byId('searchInput').value);
        updateCaptions();
        persist();
        draw(state.speechAnimating ? (performance.now() - state.speechAnimationStart) / 1000 : 0);
        byId('speechStatus').textContent = 'Membuat audio AI ' + (i + 1) + ' dari ' + data.length + ': ' + data[i][0] + ' · preset ' + voice + '…';
        const blob = await synthesizeName(i, voice);
        if (state.ttsStop) break;
        await playSpeechBlob(blob);
      }
      if (!state.ttsStop) byId('speechStatus').textContent = 'Selesai membaca seluruh 99 Asmaul Husna dengan Supertonic 3 ' + state.ttsBackend + '.';
    } catch (error) {
      console.error('Supertonic 3 sequence failed:', error);
      if (!state.ttsStop) byId('speechStatus').textContent = 'Pembacaan terhenti: ' + (error.message || String(error));
    } finally {
      stopSpeechAnimation();
      state.ttsBusy = false;
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
    stopSpeech(false);
    state.index=0;state.theme='emerald';state.format='portrait';state.animation='float';
    state.duration=15;state.size=100;state.translation=true;state.transliteration=true;state.elapsed=0;
    byId('projectName').value='Asmaul Husna — Video 01';byId('searchInput').value='';
    removeMedia();renderNames('');applyControls();persist();stopPlayback();notify('Pengaturan dikembalikan ke awal.');
  }
  function bind() {
    byId('searchInput').addEventListener('input',e=>renderNames(e.target.value));
    byId('loadSpeechButton').addEventListener('click',()=>loadSpeechModel().catch(()=>{}));
    byId('speakCurrentButton').addEventListener('click',speakCurrent);
    byId('speakAllButton').addEventListener('click',speakAll);
    byId('stopSpeechButton').addEventListener('click',()=>stopSpeech(true));
    byId('exportNarrationButton').addEventListener('click',exportNarrationVideo);
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
    byId('cancelExportButton').addEventListener('click',()=>stopExport(true));
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
    refreshSpeechVoices();
    byId('speechStatus').textContent = 'Pilih preset suara, lalu tekan Muat model AI. Model akan diunduh otomatis dan disimpan dalam cache browser bila tersedia.';
    let helpSeen=false;
    try { helpSeen=localStorage.getItem('asmaul-husna-help-seen')==='1'; } catch (_) {}
    if(!helpSeen)byId('helpModal').classList.remove('hidden');
  }
  init();
})();