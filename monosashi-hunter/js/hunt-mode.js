// hunt-mode.js
// ハントモード: タイマーなしでじっくり練習するモード。
// 出現→回答→フィードバック→次の的、というループはchallenge-mode.jsと共通の考え方だが、
// あえて別ファイルに分けることで「HUNTだけ挙動を変えたい」ときに影響範囲を絞れるようにしている。

import { RulerConfig, mountRuler } from './ruler.js';
import { CONFIG } from './config.js';
import { spawnTarget, removeTarget, playEscapeAnimation } from './target.js';
import { judge, showGuessMarker } from './game-core.js';
import { recordHuntResult } from './storage.js';

export function startHuntMode(root, { difficulty = 'easy' } = {}) {
  root.innerHTML = template();

  const rulerContainer = root.querySelector('#ruler');
  const targetLayer = root.querySelector('#targetLayer');
  const form = root.querySelector('#guessForm');
  const input = root.querySelector('#guessInput');
  const feedback = root.querySelector('#feedback');
  const streakEl = root.querySelector('#streak');

  const stepMM = CONFIG.difficulty[difficulty].stepMM;
  const rulerConfig = { ...RulerConfig, maxMM: CONFIG.rulerRangeMM };
  mountRuler(rulerContainer, rulerConfig);

  const spawnRange = { minMM: 0, maxMM: CONFIG.rulerRangeMM, stepMM, rulerConfig };
  let current = spawnNext();

  function spawnNext() {
    const t = spawnTarget(targetLayer, spawnRange);
    playEscapeAnimation(t);
    return t;
  }

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const guessMM = Math.round(Number(input.value) * 10); // cm入力 → mmに変換
    if (Number.isNaN(guessMM)) return;

    const correct = judge(guessMM, current.mm);
    showGuessMarker(rulerContainer, guessMM, rulerConfig, correct);
    const stats = recordHuntResult(correct);

    feedback.textContent = correct
      ? '大成功!ハントできた!'
      : `おしい!正解は ${current.mm / 10}cm だったよ`;
    feedback.className = correct ? 'feedback correct' : 'feedback wrong';
    streakEl.textContent = `れんぞく正解: ${stats.streak} / さいこう: ${stats.bestStreak}`;

    removeTarget(current);
    input.value = '';
    input.focus();
    setTimeout(() => { current = spawnNext(); }, CONFIG.spawnDelayMs);
  });
}

function template() {
  return `
    <div class="mode-header">
      <h2>ハントモード</h2>
      <p id="streak">れんぞく正解: 0</p>
    </div>
    <div class="stage" id="targetLayer"></div>
    <div id="ruler" class="ruler"></div>
    <form id="guessForm" class="guess-form">
      <label>何cm? <input id="guessInput" type="number" step="0.1" min="0" max="20" required inputmode="decimal"></label>
      <button type="submit">つかまえる!</button>
    </form>
    <p id="feedback" class="feedback"></p>
  `;
}
