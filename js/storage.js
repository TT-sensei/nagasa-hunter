// 長さハンターの保存。edu-componentsのStorageManagerを使用。
import { StorageManager } from 'https://tt-sensei.github.io/edu-components/index.js';

const storage = new StorageManager('nagasa-hunter');
const KEY = 'stats-v2';

function defaultStats() {
  return { attempts: 0, correct: 0, streak: 0, bestStreak: 0 };
}

function loadStats() {
  const saved = storage.load(KEY, defaultStats());
  if (!saved || typeof saved !== 'object') return defaultStats();
  return {
    attempts: Number(saved.attempts) || 0,
    correct: Number(saved.correct) || 0,
    streak: Number(saved.streak) || 0,
    bestStreak: Number(saved.bestStreak) || 0
  };
}

function saveStats(stats) {
  storage.save(KEY, stats);
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
  saveStats(stats);
  return stats;
}

export function getStats() {
  return loadStats();
}
