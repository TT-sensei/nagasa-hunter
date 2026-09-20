import { soundList } from 'https://tt-sensei.github.io/sounds-recipe-/sounds.js';

const STORAGE_KEY = 'nagasa-hunter.sound.v1';

let audioContext = null;
let muted = false;

function loadMuted() {
  try {
    muted = localStorage.getItem(STORAGE_KEY) === 'off';
  } catch {
    muted = false;
  }
}

function getContext() {
  if (!audioContext) {
    const AudioCtor = window.AudioContext || window.webkitAudioContext;
    if (!AudioCtor) return null;
    audioContext = new AudioCtor();
  }
  return audioContext;
}

export async function unlockSound() {
  loadMuted();
  if (muted) return false;
  const ctx = getContext();
  if (!ctx) return false;
  if (ctx.state === 'suspended') {
    try { await ctx.resume(); } catch { return false; }
  }
  return ctx.state === 'running';
}

export async function playSound(id, volume = 0.22) {
  if (muted) return false;
  const ctx = getContext();
  if (!ctx) return false;
  if (ctx.state === 'suspended') {
    try { await ctx.resume(); } catch { return false; }
  }
  const recipe = soundList.find((item) => item.id === id);
  if (!recipe || ctx.state !== 'running') return false;
  try {
    recipe.play(ctx, volume);
    return true;
  } catch {
    return false;
  }
}

export function isSoundMuted() {
  loadMuted();
  return muted;
}

export async function toggleSound() {
  loadMuted();
  muted = !muted;
  try { localStorage.setItem(STORAGE_KEY, muted ? 'off' : 'on'); } catch {}
  if (!muted) await unlockSound();
  return muted;
}

export function updateSoundButton(button) {
  if (!button) return;
  const off = isSoundMuted();
  button.textContent = off ? '音なし' : '音あり';
  button.setAttribute('aria-pressed', String(!off));
  button.setAttribute('aria-label', off ? '音をオンにする' : '音をオフにする');
}
