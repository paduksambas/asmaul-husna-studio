import { readFile } from 'node:fs/promises';
import assert from 'node:assert/strict';

const [app, html, names, styles] = await Promise.all([
  readFile(new URL('../app.js', import.meta.url), 'utf8'),
  readFile(new URL('../index.html', import.meta.url), 'utf8'),
  readFile(new URL('../asmaul-husna.js', import.meta.url), 'utf8'),
  readFile(new URL('../styles.css', import.meta.url), 'utf8')
]);

const htmlIds = [...html.matchAll(/\bid="([^"]+)"/g)].map(match => match[1]);
const uniqueHtmlIds = new Set(htmlIds);
assert.equal(uniqueHtmlIds.size, htmlIds.length, 'index.html contains duplicate id attributes');

const appIds = [...app.matchAll(/byId\(['"]([^'"]+)['"]\)/g)].map(match => match[1]);
const missingIds = [...new Set(appIds)].filter(id => !uniqueHtmlIds.has(id));
assert.deepEqual(missingIds, [], 'app.js references IDs missing from index.html');

const nameRows = names.match(/^\s*\["[^"]+",\s*"[^"]+",\s*"[^"]+"\],?$/gm) || [];
const cssBraceBalance = (styles.match(/{/g) || []).length - (styles.match(/}/g) || []).length;
assert.equal(cssBraceBalance, 0, 'styles.css contains unbalanced rule braces');
assert.match(html, /href="\.\/styles\.css"/, 'index.html must load the project stylesheet');
assert.equal(nameRows.length, 99, 'Asmaul Husna data must contain exactly 99 three-field rows');

const arabicGroupStart = html.indexOf('<div class="text-control-group">');
const arabicGroupEnd = arabicGroupStart >= 0 ? html.indexOf('</section>', arabicGroupStart) : -1;
const arabicTextGroup = arabicGroupEnd > arabicGroupStart ? html.slice(arabicGroupStart, arabicGroupEnd) : '';
assert.ok(arabicTextGroup, 'Arabic position and Arabic-to-transliteration controls must share one group');
assert.ok(arabicTextGroup.includes('id="arabicVerticalOffset"'), 'Arabic position control must be inside the Arabic group');
assert.ok(arabicTextGroup.includes('id="arabicTextGap"'), 'Arabic-to-transliteration spacing must be inside the Arabic group');
assert.ok(arabicTextGroup.includes('id="textMeaningGap"'), 'transliteration-to-meaning spacing must be inside the text spacing group');
assert.ok(arabicTextGroup.includes('id="arabicSize"'), 'Arabic calligraphy size control must be inside the text spacing group');
assert.ok(arabicTextGroup.includes('id="durationInput"'), 'Video duration control must be inside the text and layout group');
assert.match(html, /id="arabicVerticalOffset"/, 'Arabic calligraphy vertical position control must exist');
assert.ok(app.includes('state.arabicVerticalOffset*.0025'), 'Arabic calligraphy vertical position must affect canvas layout');
assert.match(html, /id="arabicTextGap"/, 'Arabic-to-transliteration spacing control must exist');
assert.match(html, /id="textMeaningGap"/, 'transliteration-to-meaning spacing control must exist');
assert.ok(app.includes('state.arabicTextGap*.001'), 'Arabic-to-transliteration spacing must affect canvas layout');
assert.ok(app.includes('state.textMeaningGap*.001'), 'transliteration-to-meaning spacing must affect canvas layout');
assert.match(html, /id="exportNarrationButton"/, 'narration export button must exist');
assert.match(app, /byId\('exportNarrationButton'\)\.addEventListener\('click',exportNarrationVideo\)/, 'narration export button must be wired');
assert.match(app, /function ensureAudioMixDestination\(\)/, 'audio mix destination helper must exist');
assert.match(app, /createMediaStreamDestination\(\)/, 'recordable audio stream must be created');
assert.match(app, /stream\.addTrack\(track\.clone\(\)\)/, 'each recording must use a clone of the reusable audio track');
assert.match(app, /createMediaElementSource\(audio\)/, 'uploaded background audio must feed the mix');
assert.match(app, /gain\.connect\(audioDestination\)/, 'speech audio must feed the recorded audio track');
assert.match(app, /async function loadBackgroundAudioBuffer\(context\)/, 'uploaded background audio must be decoded before recording');
assert.match(app, /function scheduleBackgroundAudio\(context, audioDestination, buffer, startAt\)/, 'background audio must use the scheduled Web Audio timeline');
assert.match(app, /source\.loop = true/, 'background audio must loop for the full narration');
assert.match(app, /gain\.gain\.value = 0\.18/, 'background audio must be mixed below the AI narration');
assert.match(app, /scheduleBackgroundAudio\(context, audioDestination, backgroundBuffer, state\.exportAudioStart\)/, 'background audio must start with the narration');

assert.match(html, /id="builtinMusicEnabled"/, 'built-in ambient music toggle must exist');
assert.match(html, /id="builtinMusicVolume"/, 'built-in ambient music volume control must exist');

assert.match(html, /id="builtinMusicTestButton"/, 'built-in ambient music must have an independent test-play button');
assert.match(app, /async function startBuiltinMusic\(offset=0\)/, 'music start must await AudioContext resume for mobile browsers');
assert.match(app, /if \(context\.state !== 'running'\) await context\.resume\(\)/, 'music playback must explicitly resume the audio context');
assert.match(app, /builtinMusicPreview=!state\.builtinMusicPreview/, 'music test playback must be independently toggleable');
assert.match(app, /speechSequenceActive:false/, 'full 99-name playback must track its own background-music lifecycle');
assert.match(app, /state\.speechSequenceActive = true;[\s\S]*?syncBuiltinMusic\(0\);/, 'background music must start when full 99-name playback begins');
assert.match(app, /state\.playing \|\| state\.builtinMusicPreview \|\| state\.speechSequenceActive/, 'background music must remain active during live 99-name recitation');
assert.match(app, /\!\(state\.playing \|\| state\.builtinMusicPreview \|\| state\.speechSequenceActive\)/, 'background loader must not abort while full 99-name playback is active');
assert.match(app, /state\.speechSequenceActive = false;\s*syncBuiltinMusic\(\);\s*stopSpeechAnimation\(\);/, 'background music must stop when full 99-name playback finishes or errors');
assert.match(app, /if \(state\.speechSequenceActive\) \{\s*state\.speechSequenceActive = false;\s*syncBuiltinMusic\(\);/, 'stopping a 99-name recitation must also stop background music');

assert.match(app, /async function loadBuiltinMusicBuffer\(context\)/, 'licensed vocal nasheed must load from the bundled audio asset');
assert.match(app, /'\.\/assets\/audio\/alhamdulillah-jawad-syed\.m4a'/, 'vocal nasheed audio must load from the app origin');
assert.match(app, /'\.\/assets\/audio\/ramadan-music-dark-reflective\.mp3'/, 'instrumental audio must load from the app origin');
assert.match(app, /builtinMusicMode:'vocal'/, 'vocal nasheed remains the default background option');
assert.match(app, /builtinMusicBuffers\[state\.builtinMusicMode\]/, 'video export must use the selected audio buffer');
assert.match(app, /const fadeSamples = Math\.min\(Math\.floor\(context\.sampleRate \* 1\.8\)/, 'nasheed loop must use a short crossfade');
assert.match(app, /source\.buffer = state\.builtinMusicBuffers\[state\.builtinMusicMode\]/, 'video export must use the selected loaded audio buffer');
assert.match(app, /async function startBuiltinMusic\(offset=0\)/, 'nasheed preview must await local audio loading and AudioContext resume');
assert.match(app, /await loadBuiltinMusicBuffer\(context\)/, 'export paths must prepare the bundled nasheed before recording');
assert.match(app, /function scheduleBuiltinMusic\(context, audioDestination, startAt, duration=0\)/, 'narrated export must schedule background nasheed on the shared timeline');
assert.match(app, /attachAudioMixTrack\(stream, audioDestination\)/, 'downloaded narration video must contain the mixed audio track');
assert.match(app, /scheduleBuiltinMusic\(context, audioDestination, state\.exportAudioStart, totalDuration\)/, 'downloaded narration video must schedule the selected background track for the entire recitation');
assert.match(app, /stopNarrationSources\(\);[\s\S]*?stopSpeechAnimation\(\); stopPlayback\(\);/, 'narration export cleanup must stop scheduled audio after recording');
assert.match(app, /gain\.gain\.linearRampToValueAtTime\(0, startAt \+ duration\)/, 'background music must fade out at the end of the downloaded narration');
assert.match(app, /builtinMusicVolume:10/, 'nasheed volume must default to a quiet narration-friendly level');
assert.match(app, /clamp\(s\.builtinMusicVolume,0,30\)/, 'restored music volume must stay within the slider maximum');
assert.match(app, /let loadingMode = state\.builtinMusicMode;[\s\S]*?loadingMode = state\.builtinMusicMode;[\s\S]*?loadingMode !== state\.builtinMusicMode/, 'music mode changes during asynchronous loading must not start the stale track');
assert.match(app, /state\.builtinMusicMode='vocal'/, 'reset must restore the default vocal soundtrack');
assert.match(app, /\['builtinMusicEnabled','builtinMusicMode','builtinMusicTestButton','builtinMusicVolume'\]\.forEach\(id => \{ byId\(id\)\.disabled = true; \}\)/, 'music controls must be locked while a narrated export is being prepared and recorded');
assert.match(app, /\['builtinMusicEnabled','builtinMusicMode','builtinMusicTestButton','builtinMusicVolume'\]\.forEach\(id => \{ byId\(id\)\.disabled = false; \}\)/, 'music controls must be restored after narrated export ends');
assert.match(app, /function reset\(\) \{\s*if \(state\.exportBusy \|\| state\.exportPreparing\)/, 'reset must not mutate the canvas during an active export');
assert.match(html, /Alhamdulilah \(Vocal Only Nasheed\)/, 'music panel must identify the vocal-only nasheed');
assert.match(html, /Instrumental tanpa vokal · Alex Morgan/, 'music panel must offer the instrumental option');
assert.match(html, /id="builtinMusicMode"/, 'music panel must expose the background audio selector');
assert.match(html, /Ramadan Music With Dark Reflective Tone/, 'music panel must identify the instrumental track');
assert.match(html, /CC BY 3\.0/, 'music panel must disclose the audio license');
assert.match(html, /id="builtinMusicCreditButton"/, 'music panel must provide an attribution copy control');
assert.doesNotMatch(app, /ctx\.fillText\(creditText/, 'video canvas must not draw an audio-credit overlay');
assert.match(html, /music-credit-note[\s\S]*?CC BY 4\.0/, 'music license attribution must remain visible in the settings panel');
assert.match(html, /id="builtinMusicCreditButton"/, 'caption attribution copy control must remain available');
assert.match(html, /id="builtinMusicVolume"[^>]*value="10"/, 'nasheed slider must default to 10 percent');

assert.match(app, /source\.start\(state\.exportAudioStart \+ timeline\[index\]\)/, 'all speech clips must be scheduled on the shared timeline');
assert.match(app, /state\.exportCancelled/, 'narration export must support cancellation');
assert.match(app, /totalDuration \+ 1/, 'recording duration must follow the generated narration');

assert.ok(app.includes("const motionActive=animated&&state.animation!=='none'&&state.animation!=='wheel'"), 'wheel mode must keep the backdrop static and animate only reading text');
assert.match(html, /<option value="wheel">Roda bacaan · teks berputar<\/option>/, 'new rotating-wheel text transition must be selectable');
assert.match(app, /state\.wheelFromIndex = state\.index;[\s\S]*?state\.wheelTransitionStart = performance\.now\(\)/, 'adjacent reading items must rotate into focus');
assert.match(app, /const scale = \.43 \+ \.57 \* depth/, 'current reading item must enlarge while neighboring items remain smaller');
assert.match(app, /const alpha = \.2 \+ \.8 \* \(\(entry\.depth \+ 1\) \/ 2\)/, 'wheel label opacity must remain inside the valid canvas alpha range');
assert.match(app, /ctx\.fillText\(wheelItem\[1\],0,arabicY,w\*\.78\);\s*ctx\.shadowBlur = 0;/, 'Arabic calligraphy shadow must not leak into wheel transliteration or meaning');
assert.match(app, /const angle = offset \* \(Math\.PI \* 2 \/ 3\) - direction \* rotationProgress \* \(Math\.PI \* 2 \/ 3\)/, 'wheel transition must rotate the three reading labels around a circular path');
assert.match(app, /const arabicY = -u \* \(\.12 - state\.arabicVerticalOffset \* \.0025\)/, 'Arabic vertical-position control must affect calligraphy in wheel mode');
assert.match(app, /const transliterationY = u \* \(\.10 \+ state\.arabicTextGap \* \.001\)/, 'Arabic-to-transliteration spacing control must affect wheel mode');
assert.match(app, /state\.textMeaningGap \* \.001/, 'transliteration-to-meaning spacing control must affect wheel mode');
assert.match(app, /else if \(state\.wheelTransitionStart\) draw\(/, 'manual wheel transitions must continue rendering even when speech is not active');
assert.match(app, /state\.wheelTransitionStart = performance\.now\(\);\s*state\.transitionStart = 0;\s*ensureRenderLoop\(\)/, 'manual selection must start a render loop for the wheel transition');
assert.ok(app.includes("const ambientPulse=motionActive ? .5+.5*Math.sin(t*.72) : 0;"), 'ambient glow must use a smooth continuous pulse');
assert.ok(app.includes("const sheenCenter=-w*.48+((motionTime*.19)%1)*w*.96;"), 'shimmer mode must sweep a highlight across the Arabic title');
assert.ok(app.includes("const floatScale=animated&&state.animation==='float'"), 'float mode must combine eased vertical drift with subtle scale breathing');
assert.ok(app.includes('Keep the animation phase continuous while the narrated sequence changes names'), 'narrated export must not reset animation phase on each name');

console.log('App source validation passed.');
console.log('HTML IDs:', htmlIds.length, 'unique.');
console.log('DOM references:', new Set(appIds).size, 'all present.');
console.log('Asmaul Husna entries:', nameRows.length + '.');
console.log('Narration audio mix and 99-clip timeline checks passed.');

assert.ok(app.includes('const headerY=cy-u*.43;'), 'Header title keeps the reference spacing from the circular ornament');
assert.ok(app.includes('const py=cy+u*.43,pw=u*.105,ph=u*.034;'), 'Sequence counter mirrors title spacing below the circular ornament');
assert.match(app, /ctx\.globalAlpha=1;ctx\.textAlign='center';ctx\.textBaseline='middle';[\s\S]*?ctx\.fillText\(String\(state\.index\+1\)/, 'Sequence counter must render independently at full opacity after the name fade layer');
