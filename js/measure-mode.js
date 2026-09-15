// measure-mode.js
// 長さハンター本体。
// 3モード × 2レベルで「目盛を読む」→「長さを考える」を練習する。

import { RulerConfig, mountRuler, mmToPx } from './ruler.js';
import { CONFIG } from './config.js';
import { ASSETS, withFallback } from './assets.js';
import { judge } from './game-core.js';
import { recordHuntResult } from './storage.js';

const MODE = {
  cm: { key: 'cm', title: 'CMのみ', description: 'cmの目盛だけで答える', stepMM: 10 },
  mm: { key: 'mm', title: 'MMあり', description: 'mmの目盛を使って答える', stepMM: 5 },
  decimal: { key: 'decimal', title: '小数で答える', description: 'cmの小数で答える', stepMM: 1 }
};

export function startMeasureMode(root, { mode = 'cm', level = 1 } = {}) {
  const modeInfo = MODE[mode] || MODE.cm;
  const levelNo = Number(level) === 2 ? 2 : 1;
  root.innerHTML = template(modeInfo, levelNo);

  const rulerContainer = root.querySelector('#ruler');
  const stage = root.querySelector('#stage');
  const form = root.querySelector('#guessForm');
  const feedback = root.querySelector('#feedback');
  const streakEl = root.querySelector('#streak');
  const statusEl = root.querySelector('#status');

  const rulerConfig = getRulerConfig(modeInfo);
  mountRuler(rulerContainer, rulerConfig);
  setStageWidth(stage, rulerConfig);

  let current = spawnProblem(stage, modeInfo, levelNo, rulerConfig);
  let streak = 0;

  setupAnswerInputs(root, modeInfo);
  root.querySelector('#guessInput')?.focus();

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const guessMM = readAnswer(root, modeInfo);
    if (guessMM === null) return;

    const correct = judge(guessMM, current.lengthMM);
    streak = correct ? streak + 1 : 0;
    const stats = recordHuntResult(correct);

    feedback.textContent = correct
      ? '大成功！長さをハントできた！'
      : `おしい！答えは ${formatAnswer(current.lengthMM, modeInfo)} だよ`;
    feedback.className = correct ? 'feedback correct' : 'feedback wrong';
    streakEl.textContent = `れんぞく正解: ${streak} / さいこう: ${stats.bestStreak}`;
    statusEl.textContent = levelNo === 1 ? '0からはかる' : 'とちゅうからはかる';

    root.querySelectorAll('.answer-marker').forEach((el) => el.remove());
    showLengthMarker(stage, current, rulerConfig, correct);

    setTimeout(() => {
      current = spawnProblem(stage, modeInfo, levelNo, rulerConfig);
      resetInputs(root, modeInfo);
    }, CONFIG.spawnDelayMs);
  });
}

function getRulerConfig(modeInfo) {
  if (modeInfo.key === 'cm') {
    return {
      ...RulerConfig,
      maxMM: CONFIG.rulerRangeMM,
      tickStepMM: 10,
      showFiveMMTicks: false,
      labelIntervalMM: 50
    };
  }
  return {
    ...RulerConfig,
    maxMM: CONFIG.rulerRangeMM,
    tickStepMM: modeInfo.key === 'mm' ? 5 : 1,
    showFiveMMTicks: true,
    labelIntervalMM: 50
  };
}

function setStageWidth(stage, rulerConfig) {
  stage.style.width = `${mmToPx(rulerConfig.maxMM, rulerConfig) + 20}px`;
}

function spawnProblem(stage, modeInfo, levelNo, rulerConfig) {
  stage.innerHTML = '';

  const lengthStep = modeInfo.stepMM;
  const minLength = lengthStep;
  const maxLength = modeInfo.key === 'cm' ? 150 : 155;

  let startMM = 0;
  let lengthMM = randomStep(minLength, maxLength, lengthStep);

  if (levelNo === 2) {
    const latestStart = CONFIG.rulerRangeMM - lengthMM;
    startMM = randomStep(10, latestStart, 5);
  }

  const endMM = startMM + lengthMM;

  const segment = document.createElement('div');
  segment.className = 'measure-segment';
  segment.style.left = `${mmToPx(startMM, rulerConfig)}px`;
  segment.style.width = `${mmToPx(lengthMM, rulerConfig)}px`;
  stage.appendChild(segment);

  addEndpoint(stage, startMM, rulerConfig, 'start');
  addEndpoint(stage, endMM, rulerConfig, 'end');
  addTarget(stage, endMM, rulerConfig);

  return { startMM, lengthMM, endMM };
}

function addEndpoint(stage, mm, rulerConfig, kind) {
  const line = document.createElement('div');
  line.className = `endpoint ${kind}`;
  line.style.left = `${mmToPx(mm, rulerConfig)}px`;
  stage.appendChild(line);
}

let targetSeed = 0;
function addTarget(stage, mm, rulerConfig) {
  const wrap = document.createElement('div');
  wrap.className = 'target';
  wrap.style.left = `${mmToPx(mm, rulerConfig)}px`;

  const img = document.createElement('img');
  img.src = ASSETS.targets[targetSeed % ASSETS.targets.length];
  img.alt = 'ナビアン';
  withFallback(img, targetSeed++);
  wrap.appendChild(img);
  stage.appendChild(wrap);
}

function setupAnswerInputs(root, modeInfo) {
  const cm = root.querySelector('#answerCm');
  const mm = root.querySelector('#answerMm');
  const dec = root.querySelector('#guessInput');

  if (modeInfo.key === 'mm') {
    cm.hidden = false;
    mm.hidden = false;
    dec.hidden = true;
  } else {
    cm.hidden = true;
    mm.hidden = true;
    dec.hidden = false;
    dec.step = modeInfo.key === 'cm' ? '1' : '0.1';
  }
}

function resetInputs(root, modeInfo) {
  root.querySelectorAll('input').forEach((input) => { input.value = ''; });
  const first = modeInfo.key === 'mm' ? root.querySelector('#answerCm') : root.querySelector('#guessInput');
  first?.focus();
}

function readAnswer(root, modeInfo) {
  if (modeInfo.key === 'mm') {
    const cmRaw = root.querySelector('#answerCm').value;
    const mmRaw = root.querySelector('#answerMm').value;
    if (cmRaw === '' || mmRaw === '') return null;
    const cm = Number(cmRaw);
    const mm = Number(mmRaw);
    if (!Number.isInteger(cm) || !Number.isInteger(mm) || cm < 0 || mm < 0 || mm > 9) return null;
    return cm * 10 + mm;
  }

  const value = Number(root.querySelector('#guessInput').value);
  if (!Number.isFinite(value) || value < 0) return null;
  return Math.round(value * 10);
}

function formatAnswer(lengthMM, modeInfo) {
  if (modeInfo.key === 'mm') {
    return `${Math.floor(lengthMM / 10)}cm ${lengthMM % 10}mm`;
  }
  if (modeInfo.key === 'cm') {
    return `${lengthMM / 10}cm`;
  }
  return `${(lengthMM / 10).toFixed(1)}cm`;
}

function showLengthMarker(stage, problem, rulerConfig, correct) {
  const marker = document.createElement('div');
  marker.className = `answer-marker ${correct ? 'correct' : 'wrong'}`;
  marker.style.left = `${mmToPx(problem.endMM, rulerConfig)}px`;
  marker.innerHTML = '│';
  stage.appendChild(marker);
}

function randomStep(min, max, step) {
  if (max < min) return min;
  const first = Math.ceil(min / step) * step;
  const last = Math.floor(max / step) * step;
  const count = Math.floor((last - first) / step) + 1;
  return first + step * Math.floor(Math.random() * count);
}

function template(modeInfo, levelNo) {
  return `
    <div class="mode-header">
      <div>
        <h2>長さハンター　${modeInfo.title}</h2>
        <p>${modeInfo.description}</p>
      </div>
      <p id="streak">れんぞく正解: 0</p>
    </div>
    <div class="level-badge">レベル${levelNo}　${levelNo === 1 ? '0から' : 'とちゅうから'}</div>
    <div class="status-row"><span id="status">${levelNo === 1 ? '0からはかる' : 'とちゅうからはかる'}</span></div>
    <div class="stage-wrap"><div class="stage" id="stage"></div></div>
    <div id="ruler" class="ruler"></div>
    <form id="guessForm" class="guess-form">
      <span>長さは</span>
      <input id="guessInput" type="number" min="0" inputmode="decimal" required aria-label="長さ">
      <span>cm</span>
      <input id="answerCm" type="number" min="0" max="20" inputmode="numeric" aria-label="センチメートル" hidden>
      <span class="mm-unit" hidden>cm</span>
      <input id="answerMm" type="number" min="0" max="9" inputmode="numeric" aria-label="ミリメートル" hidden>
      <span class="mm-unit" hidden>mm</span>
      <button type="submit">つかまえる！</button>
    </form>
    <p id="feedback" class="feedback"></p>
  `;
}
