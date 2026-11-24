import { stat } from 'node:fs/promises';
import { pipeline } from '@huggingface/transformers';

const MODEL = 'open-world-group/Supertonic-3-ONNX';
const VOICE = 'https://huggingface.co/open-world-group/Supertonic-3-ONNX/resolve/main/voices/M1.bin';
const OUTPUT = 'supertonic-smoke-test.wav';

console.log('Loading Supertonic 3 with the Node.js CPU execution provider...');
const tts = await pipeline('text-to-speech', MODEL, {
  device: 'cpu',
  dtype: {
    text_encoder: 'fp32',
    latent_denoiser: 'q8',
    voice_decoder: 'fp32',
  },
  progress_callback: (progress) => {
    if (progress?.status === 'progress') {
      const percent = Math.round(progress.progress ?? 0);
      console.log(`Model download: ${percent}%`);
    }
  },
});

console.log('Synthesizing a short Arabic sample with the official M1 preset...');
const audio = await tts('<ar>الرَّحْمَٰنُ</ar>', {
  speaker_embeddings: VOICE,
  num_inference_steps: 5,
  speed: 1.05,
});

if (!audio || typeof audio.save !== 'function') {
  throw new Error('Transformers.js returned no savable audio object.');
}
await audio.save(OUTPUT);

const file = await stat(OUTPUT);
if (file.size < 1024) {
  throw new Error(`Generated WAV is unexpectedly small: ${file.size} bytes`);
}

console.log(`SUCCESS: generated ${OUTPUT} (${file.size} bytes)`);
console.log('The smoke test confirms model loading and Arabic synthesis in the WASM runtime.');
