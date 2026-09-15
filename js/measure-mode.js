// measure-mode.js
// 長さハンター本体。
// 3モード × 2レベルで「目盛を読む」→「長さを考える」を練習する。

import { RulerConfig, mountRuler, mmToPx } from './ruler.js';
import { CONFIG } from './config.js';
import { ASSETS, withFallback } from './assets.js';
import { judge } from './game-core.js';
import { recordHuntResult } from './storage.js';

const MODE = {
  cm: { key: 'cm', title: 'CMのみ', description: 'cmの目盛だけで答える', lengthStepMM: 10 },
  mm: { key: 'mm', title: 'MMあり', description: '5mmの目盛を使い、cm＋mmで答える', lengthStepMM: 5 },
  decimal: { key: 'decimal', title: '小数で答える', description: 'mmまで読み、cmの小数で答える', lengthStepMM: 1 }
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
  setupAnswerInputs(root, modeInfo);

  let current = spawnProblem(stage, modeInfo, levelNo, rulerConfig);
  let streak = 0;
  focusFirstInput(root, modeInfo);

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
    statusEl.textContent = levelNo === 1 ? '0からはかる' : `とちゅうから：${formatPosition(current.startMM)}`;

    showLengthMarker(stage, current, rulerConfig, correct);

    form.querySelector('button').disabled = true;
    setTimeout(() => {
      form.querySelector('button').disabled = false;
      current = spawnProblem(stage, modeInfo, levelNo, rulerConfig);
      resetInputs(root);
      focusFirstInput(root, modeInfo);
    }, CONFIG.spawnDelayMs);
  });
}

function getRulerConfig(modeInfo) {
  return {
    ...RulerConfig,
    maxMM: CONFIG.rulerRangeMM,
    tickStepMM: modeInfo.key === 'cm' ? 10 : (modeInfo.key === 'mm' ? 5 : 1),
    showFiveMMTicks: modeInfo.key !== 'cm',
    showOneMMTicks: modeInfo.key === 'decimal',
    labelIntervalMM: 50
  };
}

function setStageWidth(stage, rulerConfig) {
  stage.style.width = `${mmToPx(rulerConfig.maxMM, rulerConfig) + 20}px`;
}

function spawnProblem(stage, modeInfo, levelNo, rulerConfig) {
  stage.innerHTML = '';

  const lengthStep = modeInfo.lengthStepMM;
  const maxLength = modeInfo.key === 'cm' ? 150 : 155;
  const lengthMM = randomStep(lengthStep, maxLength, lengthStep);

  let startMM = 0;
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
  const decimalArea = root.querySelector('#decimalAnswer');
  const splitArea = root.querySelector('#splitAnswer');
  if (modeInfo.key === 'mm') {
    decimalArea.hidden = true;
    splitArea.hidden = false;
  } else {
    decimalArea.hidden = false;
    splitArea.hidden = true;
    root.querySelector('#guessInput').step = modeInfo.key === 'cm' ? '1' : '0.1';
  }
}

function resetInputs(root) {
  root.querySelectorAll('input').forEach((input) => { input.value = ''; });
}

function focusFirstInput(root, modeInfo) {
  const el = modeInfo.key === 'mm' ? root.querySelector('#answerCm') : root.querySelector('#guessInput');
  el?.focus();
}

function readAnswer(root, modeInfo) {
  if (modeInfo.key === 'mm') {
    const cm = Number(root.querySelector('#answerCm').value);
    const mm = Number(root.querySelector('#answerMm').value);
    if (!Number.isInteger(cm) || !Number.isInteger(mm) || cm < 0 || mm < 0 || mm > 9) return null;
    return cm * 10 + mm;
  }

  const value = Number(root.querySelector('#guessInput').value);
  if (!Number.isFinite(value) || value < 0) return null;
  if (modeInfo.key === 'cm' && !Number.isInteger(value)) return null;
  return Math.round(value * 10);
}

function formatAnswer(lengthMM, modeInfo) {
  if (modeInfo.key === 'mm') return `${Math.floor(lengthMM / 10)}cm ${lengthMM % 10}mm`;
  if (modeInfo.key === 'cm') return `${lengthMM / 10}cm`;
  return `${(lengthMM / 10).toFixed(1)}cm`;
}

function formatPosition(mm) {
  return `${mm / 10}cmから`;
}

function showLengthMarker(stage, problem, rulerConfig, correct) {
  const old = stage.querySelector('.answer-marker');
  old?.remove();
  const marker = document.createElement('div');
  marker.className = `answer-marker ${correct ? 'correct' : 'wrong'}`;
  marker.style.left = `${mmToPx(problem.endMM, rulerConfig)}px`;
  marker.textContent = '│';
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
    <div class="status-row"><span id="status">${levelNo === 1 ? '0からはかる' : 'とちゅうから'}</span></div>
    <div class="stage-wrap"><div class="stage" id="stage"></div></div>
    <div id="ruler" class="ruler"></div>
    <form id="guessForm" class="guess-form">
      <span>長さは</span>
      <span id="decimalAnswer">
        <input id="guessInput" type="number" min="0" inputmode="decimal" required aria-label="長さ">
        <span>cm</span>
      </span>
      <span id="splitAnswer" hidden>
        <input id="answerCm" type="number" min="0" max="20" inputmode="numeric" aria-label="センチメートル">
        <span>cm</span>
        <input id="answerMm" type="number" min="0" max="9" inputmode="numeric" aria-label="ミリメートル">
        <span>mm</span>
      </span>
      <button type="submit">つかまえる！</button>
    </form>
    <p id="feedback" class="feedback"></p>
  `;
}
