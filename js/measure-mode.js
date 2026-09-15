// measure-mode.js
// 長さハンター本体。
// 3モード × 2レベルで「目盛を読む」→「長さを考える」を練習する。

import { RulerConfig, mountRuler, mmToPx } from './ruler.js';
import { CONFIG } from './config.js';
import { ASSETS, withFallback } from './assets.js';
import { judge } from './game-core.js';
import { recordHuntResult } from './storage.js';

const MODE = {
  cm: { key: 'cm', title: 'CMのみ', description: 'cmの目盛を読んで答える', lengthStepMM: 10 },
  mm: { key: 'mm', title: 'MMあり', description: '5mmの目盛を手がかりに答える', lengthStepMM: 5 },
  decimal: { key: 'decimal', title: '小数で答える', description: '1mmまで読んで小数で答える', lengthStepMM: 1 }
};

export function startMeasureMode(root, { mode = 'cm', level = 1 } = {}) {
  const modeInfo = MODE[mode] || MODE.cm;
  const levelNo = Number(level) === 2 ? 2 : 1;
  root.innerHTML = template(modeInfo, levelNo);

  const rulerContainer = root.querySelector('#ruler');
  const stage = root.querySelector('#stage');
  const board = root.querySelector('#rulerBoard');
  const form = root.querySelector('#guessForm');
  const feedback = root.querySelector('#feedback');
  const streakEl = root.querySelector('#streak');
  const resultEl = root.querySelector('#result');

  const rulerConfig = getRulerConfig(modeInfo);
  mountRuler(rulerContainer, rulerConfig);
  setBoardWidth(board, rulerConfig);
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
    streakEl.textContent = `れんぞく正解 ${streak}　/　さいこう ${stats.bestStreak}`;
    resultEl.textContent = correct ? '✓ 正解' : '答えを確認しよう';
    resultEl.className = `result ${correct ? 'correct' : 'wrong'}`;

    showLengthMarker(stage, current, rulerConfig, correct);
    form.querySelector('button').disabled = true;

    setTimeout(() => {
      form.querySelector('button').disabled = false;
      current = spawnProblem(stage, modeInfo, levelNo, rulerConfig);
      resetInputs(root);
      focusFirstInput(root, modeInfo);
      feedback.textContent = '';
      feedback.className = 'feedback';
      resultEl.textContent = '';
      resultEl.className = 'result';
    }, CONFIG.spawnDelayMs);
  });
}

function getRulerConfig(modeInfo) {
  const isDecimal = modeInfo.key === 'decimal';
  return {
    ...RulerConfig,
    maxMM: CONFIG.rulerRangeMM,
    // SVG Silhの定規は20cmを1280pxで描いた素材なので、1mm=6.4pxに合わせる。
    pxPerMM: isDecimal ? 6.4 : 6,
    useReferenceRuler: isDecimal,
    tickStepMM: modeInfo.key === 'cm' ? 10 : (modeInfo.key === 'mm' ? 5 : 1),
    showOneMMTicks: isDecimal,
    showFiveMMTicks: modeInfo.key !== 'cm',
    labelIntervalMM: 50,
    labelFontSize: 16,
    baselineY: 70,
    marginTop: 28,
    tickHeight: { mm: 10, mm5: 18, cm: 30 }
  };
}

function setBoardWidth(board, rulerConfig) {
  board.style.width = `${mmToPx(rulerConfig.maxMM, rulerConfig) + 24}px`;
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

let lastTargetIndex = -1;
function addTarget(stage, mm, rulerConfig) {
  const wrap = document.createElement('div');
  wrap.className = 'target';
  wrap.style.left = `${mmToPx(mm, rulerConfig)}px`;

  let index = Math.floor(Math.random() * ASSETS.targets.length);
  if (ASSETS.targets.length > 1 && index === lastTargetIndex) {
    index = (index + 1 + Math.floor(Math.random() * (ASSETS.targets.length - 1))) % ASSETS.targets.length;
  }
  lastTargetIndex = index;

  const img = document.createElement('img');
  img.src = ASSETS.targets[index];
  img.alt = 'ナビアン';
  withFallback(img, index);
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
    const cmRaw = root.querySelector('#answerCm').value;
    const mmRaw = root.querySelector('#answerMm').value;
    if (cmRaw === '' || mmRaw === '') return null;
    const cm = Number(cmRaw);
    const mm = Number(mmRaw);
    if (!Number.isInteger(cm) || !Number.isInteger(mm) || cm < 0 || mm < 0 || mm > 9) return null;
    return cm * 10 + mm;
  }

  const raw = root.querySelector('#guessInput').value;
  if (raw === '') return null;
  const value = Number(raw);
  if (!Number.isFinite(value) || value < 0) return null;
  if (modeInfo.key === 'cm' && !Number.isInteger(value)) return null;
  if (modeInfo.key === 'decimal' && Math.abs(value * 10 - Math.round(value * 10)) > 1e-9) return null;
  return Math.round(value * 10);
}

function formatAnswer(lengthMM, modeInfo) {
  if (modeInfo.key === 'mm') return `${Math.floor(lengthMM / 10)}cm ${lengthMM % 10}mm`;
  if (modeInfo.key === 'cm') return `${lengthMM / 10}cm`;
  return `${(lengthMM / 10).toFixed(1)}cm`;
}

function showLengthMarker(stage, problem, rulerConfig, correct) {
  stage.querySelector('.answer-marker')?.remove();
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
      <div class="header-main">
        <div class="eyebrow">LENGTH HUNTER</div>
        <h2>長さハンター <span>${modeInfo.title}</span></h2>
        <p>${modeInfo.description}</p>
      </div>
      <div class="header-stats" id="streak">れんぞく正解 0　/　さいこう 0</div>
    </div>

    <div class="game-layout">
      <section class="measure-card">
        <div class="level-row">
          <span class="level-badge">LEVEL ${levelNo}</span>
          <span class="level-note">${levelNo === 1 ? '0からはかる' : 'とちゅうからはかる'}</span>
        </div>
        <div class="guide-row">
          <span>① はじまりを見つける</span>
          <span>② おわりを読む</span>
          <span>③ 長さを答える</span>
        </div>
        <div class="ruler-scroll" id="rulerScroll">
          <div class="ruler-board" id="rulerBoard">
            <div class="stage" id="stage"></div>
            <div id="ruler" class="ruler"></div>
          </div>
        </div>
        <div class="scroll-hint">↔ 定規は横に動かして見ることができます</div>
      </section>

      <aside class="answer-card">
        <div class="answer-label">答え</div>
        <div id="result" class="result"></div>
        <form id="guessForm" class="guess-form">
          <span>長さは</span>
          <span id="decimalAnswer">
            <input id="guessInput" type="number" min="0" inputmode="decimal" aria-label="長さ">
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
        <p id="feedback" class="feedback" aria-live="polite"></p>
      </aside>
    </div>
  `;
}
