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
  const state = { index:0, theme:'emerald', format:'portrait', template:'classic', animation:'float', tasbihStart:0, tasbihTransitionStart:0, tasbihFromIndex:0, tasbihToIndex:0, duration:15,
    translation:true, transliteration:true, arabicVerticalOffset:0, arabicTextGap:0, textMeaningGap:0, builtinMusicEnabled:true, builtinMusicVolume:10, builtinMusicMode:'vocal', builtinMusicBuffers:{}, builtinMusicLoadPromises:{}, builtinMusicSource:null, builtinMusicGain:null, builtinMusicStarting:false, builtinMusicPreview:false, playing:false, elapsed:0, start:0, image:null, imageUrl:'',
    audioUrl:'', recorder:null, chunks:[], timer:0, audioDestination:null, backgroundAudioSource:null, backgroundAudioGain:null,
    ttsPipeline:null, ttsLoadPromise:null, ttsBackend:'', ttsBusy:false, ttsStop:false, speechSequenceActive:false, speechAudioContext:null, speechSource:null, wheelTransitionStart:0, wheelFromIndex:0, wheelToIndex:0, wheelDirection:1, pendingWheelTransition:null,
    speechAnimating:false, speechAnimationStart:0, renderLoopActive:false, transitionStart:0, transitionDuration:420,
    exportBusy:false, exportPreparing:false, exportCancelled:false, narrationExportActive:false,
    exportDuration:0, exportAudioStart:0, exportTimeline:[], exportSources:[] };
  // Keep the wheel move shorter, with a small lead before the spoken clip ends.
  const WHEEL_TRANSITION_MS = 420;
  const WHEEL_TRANSITION_LEAD_MS = WHEEL_TRANSITION_MS + 40;
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
        index:state.index,theme:state.theme,format:state.format,template:state.template,animation:state.animation,
        duration:state.duration,size:state.size,translation:state.translation,builtinMusicEnabled:state.builtinMusicEnabled,builtinMusicVolume:state.builtinMusicVolume,builtinMusicMode:state.builtinMusicMode,
        transliteration:state.transliteration,arabicVerticalOffset:state.arabicVerticalOffset,arabicTextGap:state.arabicTextGap,textMeaningGap:state.textMeaningGap,project:byId('projectName').value
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
      if (s.template === 'tasbih' || s.animation === 'tasbih') state.template = 'tasbih';
      if (['float','zoom','shimmer','none','wheel'].includes(s.animation)) state.animation = s.animation;
      if (Number.isFinite(s.duration)) state.duration = clamp(s.duration,5,60);
      if (typeof s.builtinMusicEnabled === 'boolean') state.builtinMusicEnabled = s.builtinMusicEnabled;
      if (['vocal','instrumental'].includes(s.builtinMusicMode)) state.builtinMusicMode = s.builtinMusicMode;
      if (Number.isFinite(s.builtinMusicVolume)) state.builtinMusicVolume = clamp(s.builtinMusicVolume,0,30);
      if (Number.isFinite(s.size)) state.size = clamp(s.size,70,130);
      if (typeof s.translation === 'boolean') state.translation = s.translation;
      if (typeof s.transliteration === 'boolean') state.transliteration = s.transliteration;
      if (Number.isFinite(s.arabicVerticalOffset)) state.arabicVerticalOffset = clamp(s.arabicVerticalOffset,-40,40);
      if (Number.isFinite(s.arabicTextGap)) state.arabicTextGap = clamp(s.arabicTextGap,-40,40);
      if (Number.isFinite(s.textMeaningGap)) state.textMeaningGap = clamp(s.textMeaningGap,-40,40);
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
      b.addEventListener('click',()=>{ stopSpeech(false); if((state.animation==='wheel' || state.template==='tasbih') && i!==state.index) beginNameTransition(i); state.index=i; renderNames(byId('searchInput').value); updateCaptions(); persist(); draw(0); });
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
    byId('arabicVerticalOffset').value = state.arabicVerticalOffset; byId('arabicVerticalOffsetValue').textContent = (state.arabicVerticalOffset>0?'+':'')+state.arabicVerticalOffset;
    byId('arabicTextGap').value = state.arabicTextGap; byId('arabicTextGapValue').textContent = (state.arabicTextGap>0?'+':'')+state.arabicTextGap;
     byId('textMeaningGap').value = state.textMeaningGap; byId('textMeaningGapValue').textContent = (state.textMeaningGap>0?'+':'')+state.textMeaningGap;
     byId('animationSelect').value = state.animation;
    byId('templateSelect').value = state.template;
    byId('durationInput').value = state.duration; byId('durationValue').textContent = state.duration;
    byId('builtinMusicEnabled').checked = state.builtinMusicEnabled;
    byId('builtinMusicMode').value = state.builtinMusicMode;
    byId('builtinMusicTestButton').textContent = state.builtinMusicPreview ? 'Hentikan contoh audio' : 'Dengarkan contoh audio';
    byId('builtinMusicVolume').value = state.builtinMusicVolume;
    byId('builtinMusicVolumeValue').textContent = state.builtinMusicVolume + '%';
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
    const now = performance.now();
    if (state.template === 'tasbih') {
      state.tasbihFromIndex = state.index;
      state.tasbihToIndex = nextIndex;
      state.tasbihTransitionStart = now;
      state.transitionStart = now;
      ensureRenderLoop();
    }
    // In wheel mode, rotate only the three reading labels around a vertical loop.
    if (state.animation === 'wheel' && Math.abs(nextIndex - state.index) === 1) {
      state.wheelFromIndex = state.index;
      state.wheelToIndex = nextIndex;
      state.wheelDirection = Math.sign(nextIndex - state.index) || 1;
      state.wheelTransitionStart = performance.now();
      state.transitionStart = 0;
      ensureRenderLoop();
      return;
    }
    state.wheelTransitionStart = 0;
    // Fade only the changing name/text layer; never cover the animated canvas
    // with a frozen full-frame snapshot.
    state.transitionStart = now;
  }
  // Physical misbaha scene: open 99-bead strand, imam assembly and silk tassel.
  function drawTasbihTemplate(t, item) {
    const w=canvas.width,h=canvas.height,cx=w/2,cy=h/2,u=Math.min(w,h);
    const elapsed=Math.max(0,(performance.now()-state.tasbihStart)/1000);
    const opening=clamp(elapsed/2.4,0,1),formation=1-Math.pow(1-opening,3);
    const finale=state.index===98&&!state.speechSequenceActive&&!state.ttsBusy;
    const pulse=.5+.5*Math.sin(elapsed*1.35);
    const bg=ctx.createLinearGradient(0,0,w,h);
    bg.addColorStop(0,'#080f1c');bg.addColorStop(.48,'#111827');bg.addColorStop(1,'#070b14');
    ctx.fillStyle=bg;ctx.fillRect(0,0,w,h);
    const aura=ctx.createRadialGradient(cx,cy,u*.025,cx,cy,u*.58);
    aura.addColorStop(0,'#b9853828');aura.addColorStop(.52,'#6f4b2020');aura.addColorStop(1,'#05091400');
    ctx.fillStyle=aura;ctx.fillRect(0,0,w,h);
    // Dedicated celestial arch and fine ornamental frame, independent of editor themes/background uploads.
    ctx.save();ctx.strokeStyle='#d7b36b55';ctx.lineWidth=Math.max(2,u*.002);
    const inset=u*.055, top=h*.075, bottom=h*.925;
    ctx.beginPath();ctx.moveTo(inset,bottom);ctx.lineTo(inset,top+u*.16);
    ctx.quadraticCurveTo(inset,top,inset+u*.16,top);
    ctx.lineTo(w-inset-u*.16,top);ctx.quadraticCurveTo(w-inset,top,w-inset,top+u*.16);
    ctx.lineTo(w-inset,bottom);ctx.stroke();
    ctx.strokeStyle='#d7b36b28';ctx.lineWidth=Math.max(1,u*.001);
    ctx.strokeRect(inset+u*.018,top+u*.02,w-2*(inset+u*.018),bottom-top-u*.04);
    ctx.restore();
    // Sparse stars and floating gold dust.
    for(let i=0;i<72;i++){
      const x=((i*193+31)%997)/997*w,y=((i*317+67)%991)/991*h;
      const twinkle=.35+.65*(.5+.5*Math.sin(elapsed*(.7+i%4*.18)+i*1.7));
      ctx.save();ctx.globalAlpha=twinkle*(i%5===0?.8:.35);ctx.fillStyle=i%7===0?'#fff0c4':'#d8b36c';
      ctx.beginPath();ctx.arc(x,y,Math.max(1,u*(i%9===0?.0024:.0011)),0,Math.PI*2);ctx.fill();ctx.restore();
    }
    // Header and title belong to this template rather than the generic frame.
    ctx.save();ctx.textAlign='center';ctx.textBaseline='middle';
    ctx.fillStyle='#e8c982';ctx.font='600 '+Math.max(18,u*.021)+'px "DM Sans",sans-serif';ctx.letterSpacing=Math.max(2,u*.004)+'px';
    ctx.fillText('THE 99 BEAUTIFUL NAMES',cx,h*.125);ctx.letterSpacing='0px';
    ctx.fillStyle='#f4e7c7';ctx.font='400 '+Math.max(25,u*.036)+'px "Amiri",serif';ctx.fillText('أَسْمَاءُ اللَّهِ الْحُسْنَى',cx,h*.165);
    ctx.fillStyle='#bda36f';ctx.font='400 '+Math.max(12,u*.013)+'px "DM Sans",sans-serif';ctx.fillText('A CIRCLE OF LIGHT · A JOURNEY OF REMEMBRANCE',cx,h*.205);
    ctx.restore();
    // A physical misbaha silhouette: 99 individually spaced amber beads
    // leave a small opening at the lower join for the imam bead and tassel.
    const ringY=cy+u*.005,spin=elapsed*.035,beads=[];
    const yaw=spin, pitch=.30+Math.sin(elapsed*.16)*.012, focal=u*2.6;
    const projectTasbihPoint=(angle,scale=1,zBoost=0)=>{
      const lx=Math.cos(angle)*u*.325*scale,ly=Math.sin(angle)*u*.255*scale;
      const tiltedY=ly*Math.cos(pitch),tiltedZ=ly*Math.sin(pitch);
      const rotatedX=lx*Math.cos(yaw)+tiltedZ*Math.sin(yaw);
      const rotatedZ=-lx*Math.sin(yaw)+tiltedZ*Math.cos(yaw)+zBoost;
      const perspective=focal/Math.max(focal*.78,focal-rotatedZ);
      return {x:cx+rotatedX*perspective,y:ringY+tiltedY*perspective,z:rotatedZ,perspective};
    };
    const transitionProgress=state.tasbihTransitionStart?clamp((performance.now()-state.tasbihTransitionStart)/1050,0,1):1;
    const transitionEase=1-Math.pow(1-transitionProgress,3);
    const transitionActive=state.tasbihTransitionStart&&transitionProgress<1;
    const imamAngle=Math.PI/2,joinGap=.19;
    const beadStart=imamAngle+joinGap/2,beadSweep=Math.PI*2-joinGap;
    for(let i=0;i<99;i++){
      const angle=beadStart+i/(98)*beadSweep;
      const active=i===state.index,lit=active||finale;
      const point=projectTasbihPoint(angle,1,active?u*(.052+.012*pulse):0);
      const depth=clamp(.5+point.z/(u*.62),0,1);
      const sx=cx+Math.sin(i*12.9898+1.7)*u*(.17+(i%7)*.024);
      const sy=ringY+Math.cos(i*7.233+2.4)*u*(.16+(i%5)*.025);
      const x=sx+(point.x-sx)*formation,y=sy+(point.y-sy)*formation;
      const radius=u*(.0072+depth*.0015)*(active?1.65:1)*point.perspective;
      beads.push({index:i,x,y,baseY:y,depth:active?1.1:depth,angle,active,lit,r:radius,point});
    }
    // A travelling ribbon follows the ring from the last reading bead to the new one.
    if(transitionActive&&opening>=.8){
      const deltaRaw=state.tasbihToIndex-state.tasbihFromIndex;
      const fromAngle=beadStart+state.tasbihFromIndex/98*beadSweep;
      let targetAngle=beadStart+state.tasbihToIndex/98*beadSweep;
      if(deltaRaw>49) targetAngle-=Math.PI*2;
      else if(deltaRaw< -49) targetAngle+=Math.PI*2;
      const toAngle=fromAngle+(targetAngle-fromAngle)*transitionEase;
      const ribbon=ctx.createLinearGradient(cx-u*.32,ringY-u*.22,cx+u*.32,ringY+u*.22);
      ribbon.addColorStop(0,'#f5c76a00');ribbon.addColorStop(.5,'#ffe9ae');ribbon.addColorStop(1,'#f5c76a00');
      ctx.save();ctx.beginPath();
      for(let step=0;step<=48;step++){const a=fromAngle+(toAngle-fromAngle)*step/48,p=projectTasbihPoint(a,1,u*.012);if(step===0)ctx.moveTo(p.x,p.y);else ctx.lineTo(p.x,p.y);}
      ctx.strokeStyle=ribbon;ctx.lineWidth=u*.009;ctx.lineCap='round';ctx.shadowColor='#ffd77b';ctx.shadowBlur=u*.025;ctx.globalAlpha=1-transitionProgress*.28;ctx.stroke();ctx.restore();
    }
    // A slow moving specular sweep gives the polished gold beads a living surface.
    const sheenAngle=elapsed*.34;
    const sheenPoint=projectTasbihPoint(sheenAngle,1.04);
    const sheenX=sheenPoint.x,sheenY=sheenPoint.y;
    const sheen=ctx.createRadialGradient(sheenX,sheenY,0,sheenX,sheenY,u*.09);
    sheen.addColorStop(0,'#ffe8ae24');sheen.addColorStop(1,'#ffe8ae00');
    ctx.fillStyle=sheen;ctx.fillRect(cx-u*.43,ringY-u*.34,u*.86,u*.68);
    beads.sort((a,b)=>a.depth-b.depth);
    // A real misbaha reads as a connected strand: draw the dark silk cord first,
    // then the 99 beads over it so tiny gaps reveal the thread between beads.
    ctx.save();
    ctx.beginPath();
    for(let step=0;step<=198;step++){
      const p=projectTasbihPoint(beadStart+step/198*beadSweep,1);
      if(step===0)ctx.moveTo(p.x,p.y);else ctx.lineTo(p.x,p.y);
    }
    ctx.strokeStyle='#21160f';ctx.lineWidth=u*.008;ctx.lineCap='round';ctx.stroke();
    ctx.strokeStyle='#b88743';ctx.lineWidth=u*.0017;ctx.stroke();ctx.restore();
    beads.forEach(b=>{
      const r=b.r;ctx.save();ctx.globalAlpha=.15+.85*formation;
      // Soft contact shadow adds separation from the dark scene.
      ctx.fillStyle='#02050b88';ctx.beginPath();ctx.ellipse(b.x+u*.002,b.y+r*.62,r*.92,r*.43,0,0,Math.PI*2);ctx.fill();
      if(b.lit){ctx.shadowColor='#ffd77b';ctx.shadowBlur=u*(b.active?.06:.025);}
      const grad=ctx.createRadialGradient(b.x-r*.38,b.y-r*.46,r*.04,b.x,b.y,r*1.22);
      grad.addColorStop(0,b.lit?'#fff4d2':'#f7d89a');grad.addColorStop(.18,b.lit?'#edbd68':'#dca85c');grad.addColorStop(.48,b.lit?'#b9772f':'#a66b32');grad.addColorStop(.78,b.lit?'#75421e':'#6e421f');grad.addColorStop(1,'#29170e');
      ctx.fillStyle=grad;ctx.beginPath();ctx.arc(b.x,b.y,r,0,Math.PI*2);ctx.fill();
      ctx.shadowBlur=0;ctx.strokeStyle=b.lit?'#fff4ce':'#dfc28a88';ctx.lineWidth=Math.max(1,u*.0012);ctx.stroke();
      // Tiny white-gold reflection at the upper-left of each bead.
      ctx.globalAlpha*=b.active?.9:.62;ctx.fillStyle='#fff7dc';ctx.beginPath();ctx.ellipse(b.x-r*.27,b.y-r*.34,r*.2,r*.105,-.6,0,Math.PI*2);ctx.fill();
      // A tiny dark bore with a warm rim suggests the drilled channel through each bead.
      ctx.globalAlpha=.62;ctx.fillStyle='#29180f';ctx.beginPath();ctx.ellipse(b.x+r*.12,b.y+r*.27,r*.105,r*.075,.35,0,Math.PI*2);ctx.fill();
      ctx.strokeStyle='#e2bd7a88';ctx.lineWidth=Math.max(.7,u*.00065);ctx.stroke();
      ctx.restore();
    });
    // Three small separator spacers mark the traditional 33-bead sections.
    [32,65].forEach(index=>{
      const bead=beads.find(entry=>entry.index===index);if(!bead)return;
      const r=bead.r*1.24;
      ctx.save();ctx.shadowColor='#f4c66e';ctx.shadowBlur=u*.009;
      const spacer=ctx.createLinearGradient(bead.x-r,bead.y-r,bead.x+r,bead.y+r);
      spacer.addColorStop(0,'#fff0bd');spacer.addColorStop(.32,'#d6a34d');spacer.addColorStop(.7,'#8b5b20');spacer.addColorStop(1,'#f8d98d');
      ctx.fillStyle=spacer;ctx.beginPath();ctx.ellipse(bead.x,bead.y,r*.72,r*1.38,bead.angle,0,Math.PI*2);ctx.fill();
      ctx.strokeStyle='#ffe6a0';ctx.lineWidth=u*.001;ctx.stroke();ctx.restore();
    });
    // Traditional imam bead closes the two ends of the strand. Its neck,
    // engraved metal cap and hanging silk tassel are deliberately distinct.
    const imam=projectTasbihPoint(imamAngle,1.02,u*.006);
    const imamR=u*.018*imam.perspective;
    const tasselSway=Math.sin(elapsed*.9)*imamR*.08;
    ctx.save();
    // Short connector cord emerging from the two end beads.
    ctx.strokeStyle='#2b1a10';ctx.lineWidth=u*.006;ctx.lineCap='round';
    ctx.beginPath();ctx.moveTo(imam.x-imamR*.48,imam.y);ctx.quadraticCurveTo(imam.x,imam.y+imamR*.5,imam.x+imamR*.48,imam.y);ctx.stroke();
    // Elongated imam bead, polished amber with a fine brass collar.
    const imamGrad=ctx.createRadialGradient(imam.x-imamR*.32,imam.y-imamR*.32,imamR*.04,imam.x,imam.y,imamR*1.25);
    imamGrad.addColorStop(0,'#fff0c5');imamGrad.addColorStop(.2,'#e9bb70');imamGrad.addColorStop(.58,'#a9692c');imamGrad.addColorStop(1,'#321b0e');
    ctx.fillStyle=imamGrad;ctx.shadowColor='#e9b85e';ctx.shadowBlur=u*.012;
    ctx.beginPath();ctx.ellipse(imam.x,imam.y,imamR*.78,imamR*1.55,0,0,Math.PI*2);ctx.fill();
    ctx.shadowBlur=0;ctx.strokeStyle='#d8b16d';ctx.lineWidth=u*.0015;ctx.stroke();
    // Brass collars and the small cap at the tassel neck.
    ctx.strokeStyle='#f0d18b';ctx.lineWidth=u*.003;
    [-.92,.92].forEach(k=>{ctx.beginPath();ctx.ellipse(imam.x,imam.y+imamR*k,imamR*.72,imamR*.16,0,0,Math.PI*2);ctx.stroke();});
    const capY=imam.y+imamR*1.45,capW=imamR*.78,capH=imamR*.62;
    const capGrad=ctx.createLinearGradient(imam.x-capW/2,capY,imam.x+capW/2,capY);
    capGrad.addColorStop(0,'#79501f');capGrad.addColorStop(.35,'#f4d48b');capGrad.addColorStop(.7,'#a16b2b');capGrad.addColorStop(1,'#f5d995');
    ctx.fillStyle=capGrad;ctx.fillRect(imam.x-capW/2,capY,capW,capH);
    ctx.strokeStyle='#f5dfa8';ctx.lineWidth=u*.001;ctx.strokeRect(imam.x-capW/2,capY,capW,capH);
    // Fine silk threads hang down from the cap and sway gently.
    ctx.strokeStyle='#c49a5a';ctx.lineWidth=Math.max(1,u*.0017);
    for(let strand=0;strand<17;strand++){
      const offset=(strand-8)*imamR*.095;
      const sway=Math.sin(elapsed*.95+strand*.43)*imamR*.12;
      ctx.beginPath();ctx.moveTo(imam.x+offset*.25,capY+capH);
      ctx.bezierCurveTo(imam.x+offset+sway,capY+capH+imamR*.7,imam.x+offset*.8-sway,capY+capH+imamR*1.35,imam.x+offset*.72+tasselSway,capY+capH+imamR*(2.15+(strand%4)*.12));
      ctx.stroke();
    }
    ctx.restore();
    const activeBead=beads.find(b=>b.active);
    if(activeBead&&opening>=.8){
      const haloPulse=.5+.5*Math.sin(elapsed*2.4);
      ctx.save();ctx.globalAlpha=.28+.42*haloPulse;ctx.strokeStyle='#ffe8ae';ctx.lineWidth=u*.0028;ctx.shadowColor='#ffd77b';ctx.shadowBlur=u*.045;
      ctx.beginPath();ctx.arc(activeBead.x,activeBead.y,activeBead.r*(2.1+.22*haloPulse),0,Math.PI*2);ctx.stroke();
      ctx.globalAlpha=.15+.15*haloPulse;ctx.beginPath();ctx.arc(activeBead.x,activeBead.y,activeBead.r*3.1,0,Math.PI*2);ctx.stroke();ctx.restore();
    }
    if(state.tasbihTransitionStart&&transitionProgress>=1) state.tasbihTransitionStart=0;
    // Fine inner orbit and central reading panel.
    ctx.save();ctx.strokeStyle='#d8b36b45';ctx.lineWidth=Math.max(1,u*.0014);
    ctx.beginPath();
    for(let step=0;step<=120;step++){const p=projectTasbihPoint(step/120*Math.PI*2,.91);if(step===0)ctx.moveTo(p.x,p.y);else ctx.lineTo(p.x,p.y);}
    ctx.closePath();ctx.stroke();ctx.restore();
    const panelW=u*.49,panelH=u*.31,py=ringY;
    const panel=ctx.createLinearGradient(cx-panelW/2,py-panelH/2,cx+panelW/2,py+panelH/2);
    panel.addColorStop(0,'#0c1423dd');panel.addColorStop(.5,'#111a2add');panel.addColorStop(1,'#0a1220dd');
    ctx.save();ctx.fillStyle=panel;ctx.strokeStyle='#d6b36d77';ctx.lineWidth=Math.max(1,u*.0015);
    if(ctx.roundRect){ctx.beginPath();ctx.roundRect(cx-panelW/2,py-panelH/2,panelW,panelH,u*.018);ctx.fill();ctx.stroke();}
    else{ctx.fillRect(cx-panelW/2,py-panelH/2,panelW,panelH);ctx.strokeRect(cx-panelW/2,py-panelH/2,panelW,panelH);}
    const fade=state.transitionStart?clamp((performance.now()-state.transitionStart)/state.transitionDuration,0,1):1;
    ctx.globalAlpha=fade;ctx.textAlign='center';ctx.textBaseline='middle';
    let arabicSize=u*.092*(state.size/100);ctx.font='700 '+arabicSize+'px "Amiri",serif';
    while(ctx.measureText(item[1]).width>panelW*.88&&arabicSize>u*.045){arabicSize*=.94;ctx.font='700 '+arabicSize+'px "Amiri",serif';}
    ctx.shadowColor='#f4c96f88';ctx.shadowBlur=u*.018;ctx.fillStyle='#fff0ca';ctx.fillText(item[1],cx,py-u*.067,panelW*.9);ctx.shadowBlur=0;
    if(state.transliteration){ctx.fillStyle='#e9d4a4';ctx.font='600 '+Math.max(16,u*.027)+'px "DM Sans",sans-serif';ctx.fillText(item[0],cx,py+u*.018,panelW*.9);}
    if(state.translation){ctx.fillStyle='#c9b58c';ctx.font='400 '+Math.max(14,u*.022)+'px "DM Sans",sans-serif';ctx.fillText(item[2],cx,py+u*.073,panelW*.9);}
    ctx.restore();
    // Footer ornament and counter.
    ctx.save();ctx.textAlign='center';ctx.textBaseline='middle';ctx.fillStyle='#d9bd80';
    ctx.font='500 '+Math.max(15,u*.018)+'px "DM Sans",sans-serif';ctx.fillText(String(state.index+1).padStart(2,'0')+'  /  99',cx,h*.835);
    ctx.fillStyle='#9e8c6b';ctx.font='400 '+Math.max(12,u*.013)+'px "DM Sans",sans-serif';ctx.fillText('REMEMBER · REFLECT · RECONNECT',cx,h*.865);
    ctx.restore();
    if(opening<1){
      for(let i=0;i<55;i++){const a=i*2.399+elapsed*1.7,rad=u*(.05+(i%13)*.019)*(1-opening);
        const x=cx+Math.cos(a)*rad,y=ringY+Math.sin(a)*rad;
        ctx.save();ctx.globalAlpha=(1-opening)*(.2+.6*(.5+.5*Math.sin(elapsed*5+i)));
        ctx.fillStyle='#ffe4a4';ctx.shadowColor='#f2c66e';ctx.shadowBlur=u*.012;
        ctx.beginPath();ctx.arc(x,y,u*.002,0,Math.PI*2);ctx.fill();ctx.restore();}
    }
    if(finale){
      const halo=ctx.createRadialGradient(cx,ringY,u*.12,cx,ringY,u*.43);
      halo.addColorStop(0,'#ffe4a42b');halo.addColorStop(1,'#ffe4a400');
      ctx.save();ctx.globalAlpha=.65+.35*pulse;ctx.fillStyle=halo;ctx.fillRect(cx-u*.45,ringY-u*.45,u*.9,u*.9);ctx.restore();
    }
  }
  function draw(t) {
    if (!ctx || !data.length) return;
    const w=canvas.width,h=canvas.height,cx=w/2,cy=h/2,u=Math.min(w,h);
    const item=data[state.index]||data[0];
    if(state.template==='tasbih'){drawTasbihTemplate(t,item);return;}
    const animated = state.playing || state.speechAnimating;

    const c=themes[state.theme] || themes.emerald;
    const g=ctx.createLinearGradient(0,0,w,h); g.addColorStop(0,c[0]);g.addColorStop(.55,c[1]);g.addColorStop(1,c[2]);
    ctx.fillStyle=g;ctx.fillRect(0,0,w,h);
    if (state.image && state.image.complete) {
      const scale=Math.max(w/state.image.width,h/state.image.height),iw=state.image.width*scale,ih=state.image.height*scale;
      ctx.save();ctx.globalAlpha=.36;ctx.drawImage(state.image,(w-iw)/2,(h-ih)/2,iw,ih);ctx.restore();
      const shade=ctx.createLinearGradient(0,0,0,h);shade.addColorStop(0,'#08130cb0');shade.addColorStop(1,'#08130ce0');
      ctx.fillStyle=shade;ctx.fillRect(0,0,w,h);
    }
    const motionActive=animated&&state.animation!=='none'&&state.animation!=='wheel';
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

    const floatY=animated&&state.animation==='float'?Math.sin(t*.72)*u*.018:0;
    const zoom=animated&&state.animation==='zoom'?1+Math.sin(t*.52)*.032:1;
    const floatScale=animated&&state.animation==='float'?1+Math.sin(t*.72+Math.PI/2)*.006:1;
    const nameFade = state.transitionStart
      ? clamp((performance.now() - state.transitionStart) / state.transitionDuration, 0, 1)
      : 1;
    // Static identity header: it stays fixed and never joins the name transition.
    // The Arabic vertical offset is independent of the two text-spacing controls.
    ctx.save();
    ctx.textAlign='center';ctx.textBaseline='middle';ctx.fillStyle=c[3];
    ctx.font='600 '+Math.max(17,u*.019)+'px "DM Sans",sans-serif';ctx.letterSpacing=Math.max(2,u*.003)+'px';
    const headerY=cy-u*.43;
    ctx.fillText('ASMAUL HUSNA',cx,headerY);ctx.letterSpacing='0px';
    ctx.fillStyle=c[3]+'bb';ctx.font='400 '+Math.max(13,u*.013)+'px "Amiri",serif';
    ctx.fillText('أَسْمَاءُ اللَّهِ الْحُسْنَى',cx,cy-u*.39);
    ctx.restore();

    // Roda bacaan affects only the names/text: the frame, ornaments and background stay still.
    if (state.animation === 'wheel') {
      let baseIndex = state.index;
      let rotationProgress = 0;
      let rawProgress = 0;
      let direction = 1;
      if (state.wheelTransitionStart) {
        baseIndex = state.wheelFromIndex;
        direction = state.wheelDirection || 1;
        rawProgress = clamp((performance.now() - state.wheelTransitionStart) / WHEEL_TRANSITION_MS, 0, 1);
        // First clear the just-read label; only then let the next label move in.
        const movementProgress = clamp((rawProgress - .14) / .86, 0, 1);
        rotationProgress = 1 - Math.pow(1 - movementProgress, 3);
        if (rawProgress >= 1) state.wheelTransitionStart = 0;
      }
      // Keep only the current label and the next label in the direction of travel.
      // Never draw the already-read label behind the wheel: it would rotate back
      // into the incoming position and look like a duplicate of the next reading.
      const wheelOffsets = direction >= 0 ? [0, 1] : [-1, 0];
      const wheelEntries = wheelOffsets.map(offset => {
        const angle = offset * (Math.PI * 2 / 3) - direction * rotationProgress * (Math.PI * 2 / 3);
        return { index:baseIndex + offset, angle, depth:Math.cos(angle), offset };
      }).filter(entry => entry.index >= 0 && entry.index < data.length);
      // Paint distant/previous names first so the incoming name is never covered.
      wheelEntries.sort((a,b) => a.depth - b.depth);
      wheelEntries.forEach(entry => {
        const wheelItem = data[entry.index];
        const depth = Math.max(0, entry.depth);
        // Rear labels recede strongly: this prevents the just-read name from
        // visually doubling with the incoming name during the hand-off.
        const perspective = clamp((entry.depth + 1) / 2, 0, 1);
        const scale = .28 + .72 * depth;
        const depthAlpha = .08 + .92 * Math.pow(perspective, 2.2);
        // The just-read/current label must disappear early in the rotation.
        // Do not let it travel visually into the incoming label's approach path.
        const outgoingFade = state.wheelTransitionStart && entry.offset === 0
          ? 1 - clamp(rawProgress / .14, 0, 1)
          : 1;
        const alpha = depthAlpha * outgoingFade;
        if (alpha <= .015) return;
        const x = cx + Math.sin(entry.angle) * u * .075;
        const y = cy - u * .025 + Math.sin(entry.angle) * u * .235;
        const arabicY = -u * (.12 - state.arabicVerticalOffset * .0025);
        const transliterationY = u * (.10 + state.arabicTextGap * .001);
        const translationY = transliterationY + (state.transliteration ? u * (.055 + state.textMeaningGap * .001) : 0);
        const isFocus = entry.depth > .72;
        ctx.save();
        ctx.translate(x,y);
        ctx.scale(scale,scale);
        ctx.globalAlpha = alpha;
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        let arabicFont = u * .12 * (state.size / 100);
        ctx.font = '700 ' + arabicFont + 'px "Amiri",serif';
        while (ctx.measureText(wheelItem[1]).width > w * .76 && arabicFont > u * .06) {
          arabicFont *= .94;
          ctx.font = '700 ' + arabicFont + 'px "Amiri",serif';
        }
        ctx.shadowColor = c[3] + '55';
        ctx.shadowBlur = isFocus ? u * .02 : u * .008;
        ctx.fillStyle = c[4];
        ctx.fillText(wheelItem[1],0,arabicY,w*.78);
        ctx.shadowBlur = 0;
        // Keep the rear-most name visually quiet: Arabic calligraphy alone
        // remains visible in the back; supporting text appears as it approaches.
        if (state.transliteration && entry.depth > -.15) {
          ctx.shadowBlur = 0;
          ctx.fillStyle = c[4] + (isFocus ? 'ee' : 'bb');
          ctx.font = '600 ' + Math.max(12,u*(isFocus ? .028 : .021)) + 'px "DM Sans",sans-serif';
          ctx.fillText(wheelItem[0],0,transliterationY,w*.76);
        }
        if (isFocus && state.translation) {
          ctx.fillStyle = c[4];
          ctx.font = '400 ' + Math.max(13,u*.022) + 'px "DM Sans",sans-serif';
          ctx.fillText(wheelItem[2],0,translationY,w*.76);
        }
        ctx.restore();
      });
      state.transitionStart = 0;
    } else {
      ctx.save();
      ctx.globalAlpha = nameFade;
      ctx.textAlign='center';ctx.textBaseline='middle';
      ctx.save();ctx.translate(cx,cy-u*(.14-state.arabicVerticalOffset*.0025)+floatY);ctx.scale(zoom*floatScale,zoom*floatScale);
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
      let ty=cy+u*(.10+state.arabicTextGap*.001);
      if(state.transliteration){ctx.fillStyle=c[4]+'dd';ctx.font='600 '+Math.max(18,u*.03)+'px "DM Sans",sans-serif';ctx.fillText(item[0],cx,ty);ty+=u*(.055+state.textMeaningGap*.001);}
      if(state.translation){ctx.fillStyle=c[4];ctx.font='400 '+Math.max(16,u*.024)+'px "DM Sans",sans-serif';ctx.fillText(item[2],cx,ty,w*.8);}
      ctx.restore();
  
    }
    // The sequence counter is persistent UI, not part of the fading name layer.
    const py=cy+u*.43,pw=u*.105,ph=u*.034;
    ctx.save();ctx.globalAlpha=1;ctx.textAlign='center';ctx.textBaseline='middle';
    ctx.strokeStyle=c[3]+'88';ctx.lineWidth=1.3;
    if(ctx.roundRect){ctx.beginPath();ctx.roundRect(cx-pw/2,py-ph/2,pw,ph,ph/2);ctx.stroke();}
    else {ctx.strokeRect(cx-pw/2,py-ph/2,pw,ph);}
    ctx.fillStyle=c[3];ctx.font='500 '+Math.max(12,u*.014)+'px "DM Sans",sans-serif';
    ctx.fillText(String(state.index+1).padStart(2,'0')+' / 99',cx,py);
    ctx.restore();
    if (nameFade >= 1) state.transitionStart = 0;
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
  function stopBuiltinMusic() {
    const source = state.builtinMusicSource, gain = state.builtinMusicGain;
    state.builtinMusicSource = null; state.builtinMusicGain = null;
    if (!source) return;
    try {
      const now = source.context.currentTime;
      gain.gain.cancelScheduledValues(now);
      gain.gain.setTargetAtTime(0, now, 0.045);
      source.stop(now + 0.22);
    } catch (_) { try { source.stop(); } catch (_) {} }
  }
  async function loadBuiltinMusicBuffer(context) {
    const mode = state.builtinMusicMode;
    const cached = state.builtinMusicBuffers[mode];
    if (cached && cached.sampleRate === context.sampleRate) return cached;
    if (state.builtinMusicLoadPromises[mode]) return state.builtinMusicLoadPromises[mode];
    state.builtinMusicLoadPromises[mode] = (async () => {
      const asset = mode === 'instrumental'
        ? './assets/audio/ramadan-music-dark-reflective.mp3'
        : './assets/audio/alhamdulillah-jawad-syed.m4a';
      const response = await fetch(asset, { cache: 'force-cache' });
      if (!response.ok) throw new Error('Berkas audio latar tidak dapat dimuat. Periksa aset audio pada server Preview.');
      const decoded = await context.decodeAudioData(await response.arrayBuffer());
      if (!decoded || !Number.isFinite(decoded.duration) || decoded.duration <= 0) throw new Error('Berkas audio tidak menghasilkan audio yang valid.');
      let loop = decoded;
      if (mode === 'vocal') {
        const fadeSamples = Math.min(Math.floor(context.sampleRate * 1.8), Math.floor(decoded.length / 6));
        const middleLength = decoded.length - fadeSamples * 2;
        loop = context.createBuffer(decoded.numberOfChannels, decoded.length - fadeSamples, decoded.sampleRate);
        for (let channel = 0; channel < decoded.numberOfChannels; channel++) {
          const input = decoded.getChannelData(channel), output = loop.getChannelData(channel);
          output.set(input.subarray(fadeSamples, decoded.length - fadeSamples), 0);
          for (let i = 0; i < fadeSamples; i++) {
            const mix = fadeSamples > 1 ? i / (fadeSamples - 1) : 1;
            output[middleLength + i] = input[decoded.length - fadeSamples + i] * Math.cos(mix * Math.PI / 2) + input[i] * Math.sin(mix * Math.PI / 2);
          }
        }
      }
      state.builtinMusicBuffers[mode] = loop;
      return loop;
    })().finally(() => { delete state.builtinMusicLoadPromises[mode]; });
    return state.builtinMusicLoadPromises[mode];
  }
  async function startBuiltinMusic(offset=0) {
    if (!state.builtinMusicEnabled || state.builtinMusicVolume <= 0 || state.builtinMusicSource || state.builtinMusicStarting) return;
    let loadingMode = state.builtinMusicMode;
    state.builtinMusicStarting = true;
    try {
      const context = ensureSpeechAudioContext();
      // Call resume inside the user gesture path so Safari/iOS can unlock audio playback.
      if (context.state !== 'running') await context.resume();
      loadingMode = state.builtinMusicMode;
      const buffer = await loadBuiltinMusicBuffer(context);
      if (loadingMode !== state.builtinMusicMode) return;
      if (!state.builtinMusicEnabled || state.builtinMusicVolume <= 0 || !(state.playing || state.builtinMusicPreview || state.speechSequenceActive) || state.builtinMusicSource) return;
      const source = context.createBufferSource(), gain = context.createGain();
      source.buffer = buffer; source.loop = true;
      const now = context.currentTime, volume = state.builtinMusicVolume / 100;
      gain.gain.setValueAtTime(0, now); gain.gain.linearRampToValueAtTime(volume, now + 0.22);
      source.connect(gain); gain.connect(context.destination);
      if (state.audioDestination) gain.connect(state.audioDestination);
      source.onended = () => { if (state.builtinMusicSource === source) { state.builtinMusicSource = null; state.builtinMusicGain = null; } };
      state.builtinMusicSource = source; state.builtinMusicGain = gain;
      source.start(now, Math.max(0, offset) % buffer.duration);
    } catch (error) {
      console.warn('Built-in ambient music could not start:', error);
      notify('Audio belum dapat diputar. Coba tekan Dengarkan musik sekali lagi.');
    } finally {
      state.builtinMusicStarting = false;
      // A mode change during decode must restart the newly selected track, not
      // accidentally start the old buffer or leave playback silent.
      if (loadingMode !== state.builtinMusicMode && state.builtinMusicEnabled && state.builtinMusicVolume > 0 &&
          (state.playing || state.builtinMusicPreview || state.speechSequenceActive) && !state.builtinMusicSource) {
        startBuiltinMusic(offset);
      }
    }
  }
  function syncBuiltinMusic(offset=state.elapsed) {
    if (state.builtinMusicEnabled && state.builtinMusicVolume > 0 && (state.playing || state.builtinMusicPreview || state.speechSequenceActive)) {
      startBuiltinMusic(offset);
    } else {
      stopBuiltinMusic();
    }
  }
  function scheduleBuiltinMusic(context, audioDestination, startAt, duration=0) {
    if (!state.builtinMusicEnabled || state.builtinMusicVolume <= 0) return;
    const source = context.createBufferSource(), gain = context.createGain();
    source.buffer = state.builtinMusicBuffers[state.builtinMusicMode];
    if (!source.buffer) throw new Error('Musik latar terpilih belum dimuat untuk ekspor.');
    source.loop = true;
    const volume = state.builtinMusicVolume / 100;
    gain.gain.setValueAtTime(0, startAt);
    gain.gain.linearRampToValueAtTime(volume, startAt + 0.6);
    if (duration > 1.2) {
      gain.gain.setValueAtTime(volume, startAt + duration - 1.2);
      gain.gain.linearRampToValueAtTime(0, startAt + duration);
    }
    source.connect(gain); gain.connect(context.destination); gain.connect(audioDestination);
    state.exportSources.push({ source, gain });
    source.start(startAt);
  }
  function stopPlayback() {
    state.playing=false;state.elapsed=0;audio.pause();syncBuiltinMusic();
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
    syncBuiltinMusic(state.elapsed);
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
    if (state.pendingWheelTransition && state.speechAudioContext &&
        state.speechAudioContext.currentTime >= state.pendingWheelTransition.at) {
      const pending = state.pendingWheelTransition;
      state.pendingWheelTransition = null;
      if (!state.ttsStop && state.speechSequenceActive && pending.nextIndex < data.length) {
        beginNameTransition(pending.nextIndex);
        state.index = pending.nextIndex;
        renderNames(byId('searchInput').value);
        updateCaptions();
        persist();
      }
    }
    if (!state.playing && !state.speechAnimating && !state.wheelTransitionStart && state.template !== 'tasbih') {
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
    else if (state.wheelTransitionStart) draw((now - state.wheelTransitionStart) / 1000);
    else if (state.template === 'tasbih') draw((now - state.tasbihStart) / 1000);
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
      if (state.audioUrl || state.builtinMusicEnabled) {
        const context = ensureSpeechAudioContext();
        const audioDestination = ensureAudioMixDestination();
        await context.resume();
        if (state.builtinMusicEnabled) await loadBuiltinMusicBuffer(context);
        if (state.builtinMusicGain) state.builtinMusicGain.connect(audioDestination);
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
    ['builtinMusicEnabled','builtinMusicMode','builtinMusicTestButton','builtinMusicVolume'].forEach(id => { byId(id).disabled = true; });
    state.builtinMusicPreview = false;
    byId('builtinMusicTestButton').textContent = 'Dengarkan contoh audio';
    stopBuiltinMusic();
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
      if (state.builtinMusicEnabled) {
        byId('exportMessage').textContent = state.builtinMusicMode === 'instrumental' ? 'Menyiapkan musik instrumental untuk latar video…' : 'Menyiapkan nasheed vokal-only untuk latar video…';
        await loadBuiltinMusicBuffer(context);
      }
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
        ['builtinMusicEnabled','builtinMusicMode','builtinMusicTestButton','builtinMusicVolume'].forEach(id => { byId(id).disabled = false; });
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
        'Durasi sekitar ' + timeText(estimatedDuration) + ' · preset ' + voice + (state.builtinMusicEnabled ? ' · musik ambient bawaan' : '') + (state.audioUrl ? ' · audio tambahan' : '') + '. Biarkan tab tetap terbuka.',
        true
      );

      state.wheelTransitionStart = 0;
      state.transitionStart = 0;
      state.index = 0;
      renderNames(byId('searchInput').value);
      state.elapsed = 0;
      state.playing = true;
      state.start = performance.now();
      state.exportAudioStart = context.currentTime + 0.25;
      audio.pause();
      scheduleBackgroundAudio(context, audioDestination, backgroundBuffer, state.exportAudioStart);
      scheduleBuiltinMusic(context, audioDestination, state.exportAudioStart, totalDuration);
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
      ['builtinMusicEnabled','builtinMusicMode','builtinMusicTestButton','builtinMusicVolume'].forEach(id => { byId(id).disabled = false; });
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
  async function decodeSpeechBlob(blob) {
    const context = ensureSpeechAudioContext();
    if (context.state !== 'running') await context.resume();
    return context.decodeAudioData(await blob.arrayBuffer());
  }
  async function prepareSpeechBuffer(index, voice) {
    const blob = await synthesizeName(index, voice);
    return decodeSpeechBlob(blob);
  }
  async function playSpeechBuffer(buffer, onStart=()=>{}) {
    const context = ensureSpeechAudioContext();
    if (context.state !== 'running') await context.resume();
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
        onStart();
        source.start(0);
      } catch (error) {
        state.speechSource = null;
        reject(error);
      }
    });
  }
  async function playSpeechBlob(blob) {
    const buffer = await decodeSpeechBlob(blob);
    if (state.ttsStop) return false;
    return playSpeechBuffer(buffer);
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
    state.pendingWheelTransition = null;
    if (state.speechSequenceActive) {
      state.speechSequenceActive = false;
      syncBuiltinMusic();
    }
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
    const readySpeechBuffers = new Map();
    const prefetchAhead = 3;
    let nextBufferIndex = 0;
    let playbackIndex = 0;
    let playbackStarted = false;
    let prefetchTask = null;
    try {
      const context = ensureSpeechAudioContext();
      await context.resume();
      state.speechSequenceActive = true;
      state.builtinMusicPreview = false;
      byId('builtinMusicTestButton').textContent = 'Dengarkan contoh audio';
      syncBuiltinMusic(0);
      const voice = selectedSpeechVoice();
      await loadSpeechModel();
      startSpeechAnimation();

      // Keep a short, ordered audio queue ready so synthesis does not hold up
      // the wheel between names. Before the first clip, warm one clip ahead;
      // once playback starts, maintain up to three clips ahead.
      const prefetchSpeechBuffers = () => {
        if (prefetchTask) return prefetchTask;
        if (state.ttsStop || nextBufferIndex >= data.length) return null;
        prefetchTask = (async () => {
          while (!state.ttsStop && nextBufferIndex < data.length) {
            const aheadReady = [...readySpeechBuffers.keys()].filter(index => index > playbackIndex).length;
            const aheadLimit = playbackStarted ? prefetchAhead : 1;
            if (aheadReady >= aheadLimit) break;
            const index = nextBufferIndex++;
            try {
              const buffer = await prepareSpeechBuffer(index, voice);
              if (state.ttsStop) break;
              readySpeechBuffers.set(index, { buffer });
            } catch (error) {
              readySpeechBuffers.set(index, { error });
              break;
            }
          }
        })().finally(() => { prefetchTask = null; });
        return prefetchTask;
      };

      const takePreparedBuffer = async index => {
        playbackIndex = index;
        while (!state.ttsStop) {
          const ready = readySpeechBuffers.get(index);
          if (ready) {
            readySpeechBuffers.delete(index);
            prefetchSpeechBuffers();
            if (ready.error) throw ready.error;
            return ready.buffer;
          }
          byId('speechStatus').textContent = 'Menyiapkan antrean audio ' + (index + 1) + ' dari ' + data.length + '…';
          const task = prefetchSpeechBuffers();
          if (task) await task;
          else if (!readySpeechBuffers.has(index)) {
            throw new Error('Antrean audio AI terhenti sebelum nama berikutnya siap.');
          }
        }
        return null;
      };

      byId('speechStatus').textContent = 'Menyiapkan audio AI pertama…';
      await prefetchSpeechBuffers();

      for (let i = 0; i < data.length; i++) {
        if (state.ttsStop) break;
        const preparedBuffer = await takePreparedBuffer(i);
        if (!preparedBuffer || state.ttsStop) break;

        const played = await playSpeechBuffer(preparedBuffer, () => {
          // The current name stays centered for its spoken duration. In wheel
          // mode, schedule the next rotation into the final transition window
          // of this clip so it lands at center exactly as this audio ends.
          if (i !== state.index) {
            if (state.animation !== 'wheel') beginNameTransition(i);
            else {
              state.wheelTransitionStart = 0;
              state.index = i;
            }
          }
          playbackStarted = true;
          renderNames(byId('searchInput').value);
          updateCaptions();
          persist();
          draw(state.speechAnimating ? (performance.now() - state.speechAnimationStart) / 1000 : 0);
          state.pendingWheelTransition = state.animation === 'wheel' && i + 1 < data.length
            ? {
                at: context.currentTime + Math.max(0, preparedBuffer.duration - WHEEL_TRANSITION_LEAD_MS / 1000),
                nextIndex: i + 1
              }
            : null;
          byId('speechStatus').textContent = 'Membacakan ' + (i + 1) + ' dari ' + data.length + ': ' + data[i][0] + ' · preset ' + voice + '…';
          prefetchSpeechBuffers();
        });
        if (!played || state.ttsStop) break;
        playbackIndex = i + 1;
        prefetchSpeechBuffers();
      }
      if (!state.ttsStop) byId('speechStatus').textContent = 'Selesai membaca seluruh 99 Asmaul Husna dengan Supertonic 3 ' + state.ttsBackend + '.';
    } catch (error) {
      console.error('Supertonic 3 sequence failed:', error);
      if (!state.ttsStop) byId('speechStatus').textContent = 'Pembacaan terhenti: ' + (error.message || String(error));
    } finally {
      // Wait for an in-flight model call to settle before allowing another run.
      if (prefetchTask) await prefetchTask;
      state.pendingWheelTransition = null;
      state.speechSequenceActive = false;
      syncBuiltinMusic();
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
    if (state.exportBusy || state.exportPreparing) {
      notify('Selesaikan atau hentikan ekspor sebelum mengatur ulang pengaturan.');
      return;
    }
    stopSpeech(false);
    state.index=0;state.theme='emerald';state.format='portrait';state.template='classic';state.animation='float';state.tasbihTransitionStart=0;state.tasbihFromIndex=0;state.tasbihToIndex=0;
    state.duration=15;state.size=100;state.tasbihStart=0;state.translation=true;state.transliteration=true;state.arabicVerticalOffset=0;state.arabicTextGap=0;state.textMeaningGap=0;state.wheelTransitionStart=0;state.pendingWheelTransition=null;state.transitionStart=0;state.builtinMusicEnabled=true;state.builtinMusicMode='vocal';state.builtinMusicVolume=10;state.builtinMusicPreview=false;byId('builtinMusicTestButton').textContent='Dengarkan contoh audio';state.elapsed=0;
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
    byId('arabicVerticalOffset').addEventListener('input',e=>{state.arabicVerticalOffset=Number(e.target.value);byId('arabicVerticalOffsetValue').textContent=(state.arabicVerticalOffset>0?'+':'')+state.arabicVerticalOffset;draw(0);persist();});
    byId('arabicTextGap').addEventListener('input',e=>{state.arabicTextGap=Number(e.target.value);byId('arabicTextGapValue').textContent=(state.arabicTextGap>0?'+':'')+state.arabicTextGap;draw(0);persist();});
     byId('textMeaningGap').addEventListener('input',e=>{state.textMeaningGap=Number(e.target.value);byId('textMeaningGapValue').textContent=(state.textMeaningGap>0?'+':'')+state.textMeaningGap;draw(0);persist();});
     byId('templateSelect').addEventListener('change',e=>{state.template=e.target.value;state.tasbihStart=performance.now();state.tasbihTransitionStart=0;state.transitionStart=0;if(state.template==='tasbih')ensureRenderLoop();byId('renderHint').textContent=state.template==='tasbih'?'Template Tasbih Emas 99 · latar dan komposisi khusus':'Template klasik · mengikuti tema dan latar editor';draw(0);persist();});
     byId('animationSelect').addEventListener('change',e=>{state.animation=e.target.value;state.wheelTransitionStart=0;state.transitionStart=0;byId('renderHint').textContent=state.animation==='none'?'Animasi dinonaktifkan':state.animation==='wheel'?'Roda bacaan: teks aktif membesar, tetangganya mengecil dan berputar':'Animasi lembut aktif saat diputar';draw(0);persist();});
    byId('durationInput').addEventListener('input',e=>{state.duration=Number(e.target.value);byId('durationValue').textContent=state.duration;updateCaptions();persist();});
    byId('builtinMusicEnabled').addEventListener('change',e=>{state.builtinMusicEnabled=e.target.checked;syncBuiltinMusic(state.elapsed);persist();});
    byId('builtinMusicMode').addEventListener('change',e=>{state.builtinMusicMode=e.target.value;stopBuiltinMusic();state.builtinMusicPreview=false;byId('builtinMusicTestButton').textContent='Dengarkan contoh audio';syncBuiltinMusic(state.elapsed);draw(0);persist();});
    byId('builtinMusicTestButton').addEventListener('click',()=>{state.builtinMusicPreview=!state.builtinMusicPreview;if(state.builtinMusicPreview){state.builtinMusicEnabled=true;byId('builtinMusicEnabled').checked=true;}byId('builtinMusicTestButton').textContent=state.builtinMusicPreview?'Hentikan contoh audio':'Dengarkan contoh audio';syncBuiltinMusic(0);persist();});
    byId('builtinMusicVolume').addEventListener('input',e=>{state.builtinMusicVolume=Number(e.target.value);byId('builtinMusicVolumeValue').textContent=state.builtinMusicVolume+'%';if(state.builtinMusicGain)state.builtinMusicGain.gain.setTargetAtTime(state.builtinMusicVolume/100,state.speechAudioContext.currentTime,0.08);persist();});
    byId('builtinMusicCreditButton').addEventListener('click',async()=>{try{if(!navigator.clipboard||!navigator.clipboard.writeText)throw new Error('Clipboard tidak tersedia');const attribution=state.builtinMusicMode==='instrumental'?'Music: “Ramadan Music With Dark Reflective Tone” — Alex Morgan. Source: https://freemusicarchive.org/music/alex-morgan/world-celebration-vol-1/ramadan-music-with-dark-reflective-tone. License: CC BY 4.0 https://creativecommons.org/licenses/by/4.0/. This track is identified by FMA as partly AI-generated.':'Audio: “Alhamdulilah (Vocal Only Nasheed)” — SyedsLife. Source: https://commons.wikimedia.org/wiki/File:Jawad_Syed_-_Alhamdulilah_(Vocal_Only_Nasheed).flac License: https://creativecommons.org/licenses/by/3.0/. Edited: 46-second excerpt, looped with a 1.8-second crossfade.';await navigator.clipboard.writeText(attribution);notify('Atribusi audio berhasil disalin untuk caption.');}catch(_){notify('Salin atribusi yang tertulis pada panel lisensi di bawah musik.');}});
    byId('projectName').addEventListener('input',persist);
    byId('playButton').addEventListener('click',()=>{if(state.recorder){notify('Ekspor sedang berlangsung. Gunakan tombol Hentikan ekspor untuk menghentikannya.');return;}if(state.playing){state.playing=false;audio.pause();syncBuiltinMusic();byId('playIcon').textContent='▶';byId('transportStatus').textContent='Pratinjau dijeda';}else play();});
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
    byId('renderHint').textContent=state.template==='tasbih'?'Template Tasbih Emas 99 · latar dan komposisi khusus':state.animation==='none'?'Animasi dinonaktifkan':state.animation==='wheel'?'Roda bacaan: teks aktif membesar, tetangganya mengecil dan berputar':'Animasi lembut aktif saat diputar';if(state.template==='tasbih'){state.tasbihStart=performance.now();ensureRenderLoop();}
    bind();
    refreshSpeechVoices();
    byId('speechStatus').textContent = 'Pilih preset suara, lalu tekan Muat model AI. Model akan diunduh otomatis dan disimpan dalam cache browser bila tersedia.';
    let helpSeen=false;
    try { helpSeen=localStorage.getItem('asmaul-husna-help-seen')==='1'; } catch (_) {}
    if(!helpSeen)byId('helpModal').classList.remove('hidden');
  }
  init();
})();