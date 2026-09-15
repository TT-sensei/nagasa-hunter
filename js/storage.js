// 長さハンターの保存。edu-componentsのStorageManagerを使用。
import { StorageManager } from 'https://tt-sensei.github.io/edu-components/index.js';

const storage = new StorageManager('nagasa-hunter');
const KEY = 'stats-v2';
const PREFS_KEY = 'preferences-v1';
const LEGACY_KEY = 'monosashi-hunter-stats-v1';

function defaultStats() {
  return { attempts: 0, correct: 0, streak: 0, bestStreak: 0 };
}

function loadStats() {
  const saved = storage.load(KEY, null);
  if (saved && typeof saved === 'object') return normalizeStats(saved);

  try {
    const oldRaw = localStorage.getItem(LEGACY_KEY);
    const old = oldRaw ? JSON.parse(oldRaw) : null;
    if (old?.hunt) {
      const migrated = normalizeStats(old.hunt);
      storage.save(KEY, migrated);
      return migrated;
    }
  } catch {
    // 保存できなくても学習本体は継続する。
  }

  return defaultStats();
}

function normalizeStats(saved) {
  return {
    attempts: Number(saved.attempts) || 0,
    correct: Number(saved.correct) || 0,
    streak: Number(saved.streak) || 0,
    bestStreak: Number(saved.bestStreak) || 0
  };
}

export function recordHuntResult(isCorrect) {
  const stats = loadStats();
  stats.attempts += 1;
  if (isCorrect) {
    stats.correct += 1;
    stats.streak += 1;
    stats.bestStreak = Math.max(stats.bestStreak, stats.streak);
  } else {
    stats.streak = 0;
  }
  storage.save(KEY, stats);
  return stats;
}

export function getStats() {
  return loadStats();
}

export function getPreferences() {
  const saved = storage.load(PREFS_KEY, {});
  return saved && typeof saved === 'object' ? saved : {};
}

export function savePreferences(patch = {}) {
  const current = getPreferences();
  const next = { ...current, ...patch };
  storage.save(PREFS_KEY, next);
  return next;
}
