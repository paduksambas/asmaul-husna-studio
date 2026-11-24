import { readFile } from 'node:fs/promises';
import assert from 'node:assert/strict';

const [app, html, names] = await Promise.all([
  readFile(new URL('../app.js', import.meta.url), 'utf8'),
  readFile(new URL('../index.html', import.meta.url), 'utf8'),
  readFile(new URL('../asmaul-husna.js', import.meta.url), 'utf8')
]);

const htmlIds = [...html.matchAll(/\bid="([^"]+)"/g)].map(match => match[1]);
const uniqueHtmlIds = new Set(htmlIds);
assert.equal(uniqueHtmlIds.size, htmlIds.length, 'index.html contains duplicate id attributes');

const appIds = [...app.matchAll(/byId\(['"]([^'"]+)['"]\)/g)].map(match => match[1]);
const missingIds = [...new Set(appIds)].filter(id => !uniqueHtmlIds.has(id));
assert.deepEqual(missingIds, [], 'app.js references IDs missing from index.html');

const nameRows = names.match(/^\s*\["[^"]+",\s*"[^"]+",\s*"[^"]+"\],?$/gm) || [];
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

assert.match(app, /function createBuiltinMusicBuffer\(context\)/, 'ambient music must be synthesized locally with Web Audio');
assert.match(app, /const seconds = 48/, 'devotional music must use a spacious 48-second loop');
assert.match(app, /const melody = \[293\.66,349\.23,392,349\.23,311\.13,293\.66,261\.63,293\.66\]/, 'devotional melody must use a gentle low-register Bayati-inspired phrase');
assert.match(app, /const neyLine = \[392,349\.23,311\.13,293\.66\]/, 'devotional music must include a restrained ney-like layer');
assert.match(html, /maqam Bayati/i, 'music controls must describe the calm Bayati-inspired style');
assert.match(app, /function startBuiltinMusic\(offset=0\)/, 'built-in music must play in the live preview');
assert.match(app, /function scheduleBuiltinMusic\(context, audioDestination, startAt\)/, 'built-in music must be scheduled into video exports');
assert.match(app, /scheduleBuiltinMusic\(context, audioDestination, state\.exportAudioStart\)/, 'built-in music must align with the narrated export timeline');
assert.match(app, /state\.builtinMusicVolume \/ 100/, 'built-in music volume must be adjustable');
assert.match(app, /state\.builtinMusicEnabled:true|builtinMusicEnabled:true/, 'built-in music must default to enabled');

assert.match(app, /source\.start\(state\.exportAudioStart \+ timeline\[index\]\)/, 'all speech clips must be scheduled on the shared timeline');
assert.match(app, /state\.exportCancelled/, 'narration export must support cancellation');
assert.match(app, /totalDuration \+ 1/, 'recording duration must follow the generated narration');

assert.ok(app.includes("const motionActive=animated&&state.animation!=='none'"), 'ambient motion must respect the selected animation mode');
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
