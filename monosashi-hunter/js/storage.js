// storage.js
// 記録はlocalStorageのみ。サーバー・アカウント・API不要(ANGLE HUNTERと同方針)。

import { CONFIG } from './config.js';

function defaultStats() {
  return {
    hunt: { attempts: 0, correct: 0, streak: 0, bestStreak: 0 },
    challenge: { plays: 0, bestScore: 0 }
  };
}

function loadStats() {
  try {
    const raw = localStorage.getItem(CONFIG.storageKey);
    return raw ? JSON.parse(raw) : defaultStats();
  } catch {
    return defaultStats();
  }
}

function saveStats(stats) {
  localStorage.setItem(CONFIG.storageKey, JSON.stringify(stats));
}

export function recordHuntResult(correct) {
  const stats = loadStats();
  stats.hunt.attempts++;
  if (correct) {
    stats.hunt.correct++;
    stats.hunt.streak++;
    stats.hunt.bestStreak = Math.max(stats.hunt.bestStreak, stats.hunt.streak);
  } else {
    stats.hunt.streak = 0;
  }
  saveStats(stats);
  return stats.hunt;
}

export function recordChallengeResult(score) {
  const stats = loadStats();
  stats.challenge.plays++;
  stats.challenge.bestScore = Math.max(stats.challenge.bestScore, score);
  saveStats(stats);
  return stats.challenge;
}

export function getStats() {
  return loadStats();
}
