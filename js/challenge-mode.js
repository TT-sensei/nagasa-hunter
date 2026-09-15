// challenge-mode.js
// チャレンジ60モード: 60秒間で何匹ハントできるかを競うモード。
// ハントのコアロジック(judge/showGuessMarker/spawnTarget)はhunt-mode.jsと共通の
// game-core.js / target.js から読んでいるので、ロジックの二重管理を避けている。
// このファイルが持つのは「タイマー」と「スコア」というCHALLENGE固有の要素だけ。

import { RulerConfig, mountRuler } from './ruler.js';
import { CONFIG } from './config.js';
import { spawnTarget, removeTarget, playEscapeAnimation } from './target.js';
import { judge, showGuessMarker } from './game-core.js';
import { recordChallengeResult } from './storage.js';

export function startChallengeMode(root, { difficulty = 'easy', onFinish } = {}) {
  root.innerHTML = template();

  const rulerContainer = root.querySelector('#ruler');
  const targetLayer = root.querySelector('#targetLayer');
  const form = root.querySelector('#guessForm');
  const input = root.querySelector('#guessInput');
  const feedback = root.querySelector('#feedback');
  const scoreEl = root.querySelector('#score');
  const timerEl = root.querySelector('#timer');
  const quitBtn = root.querySelector('#quitBtn');

  const stepMM = CONFIG.difficulty[difficulty].stepMM;
  const rulerConfig = { ...RulerConfig, maxMM: CONFIG.rulerRangeMM };
  mountRuler(rulerContainer, rulerConfig);

  const spawnRange = { minMM: 0, maxMM: CONFIG.rulerRangeMM, stepMM, rulerConfig };

  let score = 0;
  let timeLeft = CONFIG.challengeSeconds;
  let running = true;
  let current = spawnNext();

  timerEl.textContent = `のこり ${timeLeft}秒`;
  const timerId = setInterval(() => {
    timeLeft--;
    timerEl.textContent = `のこり ${timeLeft}秒`;
    if (timeLeft <= 0) endChallenge();
  }, 1000);

  function spawnNext() {
    const t = spawnTarget(targetLayer, spawnRange);
    playEscapeAnimation(t);
    return t;
  }

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    if (!running) return;
    const guessMM = Math.round(Number(input.value) * 10);
    if (Number.isNaN(guessMM)) return;

    const correct = judge(guessMM, current.mm);
    showGuessMarker(rulerContainer, guessMM, rulerConfig, correct);

    if (correct) {
      score++;
      scoreEl.textContent = `スコア: ${score}`;
      feedback.textContent = 'ナイスハント!';
      feedback.className = 'feedback correct';
    } else {
      feedback.textContent = `正解は ${current.mm / 10}cm!`;
      feedback.className = 'feedback wrong';
    }

    removeTarget(current);
    input.value = '';
    input.focus();
    current = spawnNext();
  });

  quitBtn.addEventListener('click', () => {
    if (running) endChallenge();
  });

  function endChallenge() {
    running = false;
    clearInterval(timerId);
    form.querySelector('button').disabled = true;
    input.disabled = true;
    quitBtn.disabled = true;

    const result = recordChallengeResult(score);
    feedback.textContent = `タイムアップ!スコア ${score}(さいこう記録: ${result.bestScore})`;
    feedback.className = 'feedback';

    if (onFinish) onFinish(score);
  }
}

function template() {
  return `
    <div class="mode-header">
      <h2>チャレンジ60</h2>
      <p id="timer">のこり 60秒</p>
      <p id="score">スコア: 0</p>
    </div>
    <div class="stage" id="targetLayer"></div>
    <div id="ruler" class="ruler"></div>
    <form id="guessForm" class="guess-form">
      <label>何cm? <input id="guessInput" type="number" step="0.1" min="0" max="20" required inputmode="decimal"></label>
      <button type="submit">つかまえる!</button>
    </form>
    <button type="button" id="quitBtn" class="quit-btn">やめる</button>
    <p id="feedback" class="feedback"></p>
  `;
}
