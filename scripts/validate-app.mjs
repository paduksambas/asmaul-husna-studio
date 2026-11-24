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

assert.match(html, /id="exportNarrationButton"/, 'narration export button must exist');
assert.match(app, /byId\('exportNarrationButton'\)\.addEventListener\('click',exportNarrationVideo\)/, 'narration export button must be wired');
assert.match(app, /function ensureAudioMixDestination\(\)/, 'audio mix destination helper must exist');
assert.match(app, /createMediaStreamDestination\(\)/, 'recordable audio stream must be created');
assert.match(app, /createMediaElementSource\(audio\)/, 'uploaded background audio must feed the mix');
assert.match(app, /gain\.connect\(audioDestination\)/, 'speech audio must feed the recorded audio track');
assert.match(app, /source\.start\(state\.exportAudioStart \+ timeline\[index\]\)/, 'all speech clips must be scheduled on the shared timeline');
assert.match(app, /state\.exportCancelled/, 'narration export must support cancellation');
assert.match(app, /totalDuration \+ 1/, 'recording duration must follow the generated narration');

console.log('App source validation passed.');
console.log('HTML IDs:', htmlIds.length, 'unique.');
console.log('DOM references:', new Set(appIds).size, 'all present.');
console.log('Asmaul Husna entries:', nameRows.length + '.');
console.log('Narration audio mix and 99-clip timeline checks passed.');
