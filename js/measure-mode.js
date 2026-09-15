// 長さハンター本体。
// 「はじまりを見る → おわりを読む → 長さを表す」の学習循環を中心にする。
import { RulerConfig, mountRuler, mmToPx } from './ruler.js';
import { CONFIG } from './config.js';
import { ASSETS, withFallback } from './assets.js';
import { AnswerChecker } from 'https://tt-sensei.github.io/edu-components/index.js';
import { recordHuntResult, getStats } from './storage.js';

const MODE = {
  cm: { key: 'cm', title: 'cmまで', description: '1cmごとの目盛を読む', lengthStepMM: 10 },
  mm: { key: 'mm', title: 'cmとmmまで', description: '1mmの目盛まで読んで表す', lengthStepMM: 1 },
  decimal: { key: 'decimal', title: '小数で表す', description: '1mmを0.1cmとして表す', lengthStepMM: 1 }
};

export function startMeasureMode(root, { mode = 'cm', level = 1, timed = false } = {}) {
  const modeInfo = MODE[mode] || MODE.cm;
  const levelNo = Number(level) === 2 ? 2 : 1;
  root.innerHTML = template(modeInfo, levelNo, timed);

  const rulerContainer = root.querySelector('#ruler');
  const stage = root.querySelector('#stage');
  const board = root.querySelector('#rulerBoard');
  const form = root.querySelector('#guessForm');
  const feedback = root.querySelector('#feedback');
  const streakEl = root.querySelector('#streak');
  const resultEl = root.querySelector('#result');
  const progressEl = root.querySelector('#progressText');
  const timerEl = root.querySelector('#timer');

  const rulerConfig = getRulerConfig(modeInfo);
  mountRuler(rulerContainer, rulerConfig);
  setBoardWidth(board, rulerConfig);
  setupAnswerInputs(root, modeInfo);

  const answerChecker = new AnswerChecker();
  let current = spawnProblem(stage, modeInfo, levelNo, rulerConfig);
  let streak = getStats().streak;
  let solved = 0;
  let correctCount = 0;
  let locked = false;
  let timeLeft = timed ? 60 : null;
  let timerId = null;
  let challengeFinished = false;
  let deadline = null;
  updateProgress();

  if (timed) {
    deadline = Date.now() + 60000;
    timerEl.textContent = '60';
    timerId = setInterval(() => {
      if (challengeFinished) return;
      timeLeft = Math.max(0, Math.ceil((deadline - Date.now()) / 1000));
      timerEl.textContent = `${timeLeft}`;
      timerEl.classList.toggle('urgent', timeLeft <= 10 && timeLeft > 0);
      if (timeLeft <= 0) finishChallenge();
    }, 200);
  }

  form.addEventListener('submit', (event) => {
    event.preventDefault();
    if (locked || challengeFinished) return;

    const guessMM = readAnswer(root, modeInfo);
    if (guessMM === null) {
      showInputHint(root, modeInfo);
      return;
    }

    locked = true;
    const correct = answerChecker.matches(guessMM, current.lengthMM, { numeric: true });
    const stats = recordHuntResult(correct);
    streak = stats.streak;
    solved += 1;
    if (correct) correctCount += 1;

    renderResult(root, current, guessMM, correct, modeInfo, rulerConfig);
    streakEl.textContent = `れんぞく ${streak}回`;
    resultEl.textContent = correct ? '正解！' : 'もう一度、目盛を確認しよう';
    resultEl.className = `answer-result ${correct ? 'is-correct' : 'is-wrong'}`;
    feedback.textContent = correct
      ? 'はじまりからおわりまで、きちんと読めました。'
      : `正しい長さは ${formatAnswer(current.lengthMM, modeInfo)}。線のはじまりとおわりを見くらべよう。`;
    feedback.className = `feedback-message ${correct ? 'is-correct' : 'is-wrong'}`;
    progressEl.textContent = `ここまで ${solved}問`;
    updateProgress(true);

    form.querySelector('button').disabled = true;
    const delay = timed ? (correct ? 220 : 650) : CONFIG.spawnDelayMs;
    setTimeout(() => {
      if (challengeFinished) return;
      locked = false;
      form.querySelector('button').disabled = false;
      current = spawnProblem(stage, modeInfo, levelNo, rulerConfig);
      resetInputs(root);
      resetResult(root);
      focusFirstInput(root, modeInfo);
      updateProgress();
    }, delay);
  });

  root.querySelector('#homeBtn').addEventListener('click', () => {
    clearInterval(timerId);
    window.location.reload();
  });

  root.querySelector('#challengeHome')?.addEventListener('click', () => {
    clearInterval(timerId);
    window.location.reload();
  });
  root.querySelector('#challengeAgain')?.addEventListener('click', () => {
    clearInterval(timerId);
    window.location.reload();
  });

  function finishChallenge() {
    if (challengeFinished) return;
    challengeFinished = true;
    clearInterval(timerId);
    timerId = null;
    timeLeft = 0;
    if (timerEl) {
      timerEl.textContent = '0';
      timerEl.classList.add('urgent');
    }
    locked = true;
    form.querySelector('button').disabled = true;
    root.querySelector('#challengeResultNumber').textContent = correctCount;
    root.querySelector('#challengeResultSolved').textContent = solved;
    root.querySelector('#challengeResult').hidden = false;
  }

  function updateProgress(afterAnswer = false) {
    root.querySelector('#streak').textContent = `れんぞく ${streak}回`;
    if (!afterAnswer) progressEl.textContent = `ここまで ${solved}問`;
  }
}

function getRulerConfig(modeInfo) {
  const isDecimal = modeInfo.key === 'decimal';
  return {
    ...RulerConfig,
    maxMM: CONFIG.rulerRangeMM,
    pxPerMM: 5.8,
    referenceRulerPxPerMM: 5.8,
    useReferenceRuler: true,
    tickStepMM: 1,
    showOneMMTicks: true,
    showFiveMMTicks: true,
    labelIntervalMM: isDecimal ? 10 : 20,
    labelFontSize: 15,
    baselineY: 70,
    marginTop: 18,
    tickHeight: { mm: 8, mm5: 15, cm: 28 }
  };
}

function setBoardWidth(board, rulerConfig) { board.style.width = `${mmToPx(rulerConfig.maxMM, rulerConfig) + 24}px`; }

function spawnProblem(stage, modeInfo, levelNo, rulerConfig) {
  stage.innerHTML = '';
  const lengthStep = modeInfo.lengthStepMM;
  const minLength = modeInfo.key === 'cm' ? 20 : 10;
  const maxLength = modeInfo.key === 'cm' ? 150 : 160;
  const lengthMM = randomStep(minLength, maxLength, lengthStep);
  let startMM = 0;
  if (levelNo === 2) {
    const latestStart = Math.max(10, CONFIG.rulerRangeMM - lengthMM - 10);
    startMM = randomStep(10, latestStart, 1);
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
  if (ASSETS.targets.length > 1 && index === lastTargetIndex) index = (index + 1 + Math.floor(Math.random() * (ASSETS.targets.length - 1))) % ASSETS.targets.length;
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
  const guessInput = root.querySelector('#guessInput');

  // edu-kit側のCSSで [hidden] が上書きされる場合にも確実に1種類だけ表示する。
  decimalArea.hidden = modeInfo.key === 'mm';
  splitArea.hidden = modeInfo.key !== 'mm';
  decimalArea.style.display = modeInfo.key === 'mm' ? 'none' : 'inline-flex';
  splitArea.style.display = modeInfo.key === 'mm' ? 'inline-flex' : 'none';

  if (guessInput) {
    guessInput.step = modeInfo.key === 'cm' ? '1' : '0.1';
    guessInput.setAttribute('aria-label', modeInfo.key === 'decimal' ? '長さ（小数）' : '長さ（cm）');
  }
}
function resetInputs(root) { root.querySelectorAll('input').forEach((input) => { input.value = ''; }); }
function focusFirstInput(root, modeInfo) { (modeInfo.key === 'mm' ? root.querySelector('#answerCm') : root.querySelector('#guessInput'))?.focus(); }
function showInputHint(root, modeInfo) {
  const feedback = root.querySelector('#feedback');
  feedback.textContent = modeInfo.key === 'mm' ? 'cmとmmの両方を入れてみよう。' : '長さを数字で入れてみよう。';
  feedback.className = 'feedback-message is-hint';
}
function readAnswer(root, modeInfo) {
  if (modeInfo.key === 'mm') {
    const cmRaw = root.querySelector('#answerCm').value, mmRaw = root.querySelector('#answerMm').value;
    if (cmRaw === '' || mmRaw === '') return null;
    const cm = Number(cmRaw), mm = Number(mmRaw);
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
function renderResult(root, problem, guessMM, correct, modeInfo, rulerConfig) {
  const stage = root.querySelector('#stage');
  stage.querySelectorAll('.answer-marker, .guess-marker').forEach((node) => node.remove());
  const answerMarker = document.createElement('div');
  answerMarker.className = `answer-marker ${correct ? 'correct' : 'wrong'}`;
  answerMarker.style.left = `${mmToPx(problem.endMM, rulerConfig)}px`;
  answerMarker.textContent = '↓'; stage.appendChild(answerMarker);
  if (!correct) {
    const guessMarker = document.createElement('div');
    guessMarker.className = 'guess-marker';
    guessMarker.style.left = `${mmToPx(problem.startMM + guessMM, rulerConfig)}px`;
    guessMarker.textContent = 'あなたの答え'; stage.appendChild(guessMarker);
  }
  root.querySelector('#correctAnswer').textContent = formatAnswer(problem.lengthMM, modeInfo);
  root.querySelector('#resultGuide').textContent = correct ? 'はじまりからおわりまでの長さを読めた！' : '緑の線がどこからどこまであるか、もう一度見てみよう。';
}
function resetResult(root) {
  root.querySelector('#correctAnswer').textContent = '';
  root.querySelector('#resultGuide').textContent = '';
  root.querySelector('#feedback').textContent = '';
  root.querySelector('#feedback').className = 'feedback-message';
  root.querySelector('#result').textContent = '';
  root.querySelector('#result').className = 'answer-result';
  root.querySelector('#stage').querySelectorAll('.answer-marker, .guess-marker').forEach((node) => node.remove());
}
function randomStep(min, max, step) {
  if (max < min) return min;
  const first = Math.ceil(min / step) * step, last = Math.floor(max / step) * step;
  const count = Math.floor((last - first) / step) + 1;
  return first + step * Math.floor(Math.random() * count);
}
function template(modeInfo, levelNo, timed) {
  return `
    <div class="hunter-shell">
      <header class="hunter-topbar">
        <div class="hunter-title-block"><div class="hunter-kicker">MONOSASHI HUNTER</div><div class="hunter-title-line"><h1>長さを読もう</h1><span class="edu-badge edu-badge-primary">${modeInfo.title}</span></div><p>${modeInfo.description}</p></div>
        <div class="hunter-top-actions">${timed ? '<span id="timer" class="time-pill">60</span>' : ''}<span id="progressText" class="progress-text">ここまで 0問</span><span id="streak" class="streak-pill">れんぞく 0回</span><button id="homeBtn" type="button" class="edu-btn edu-btn-secondary">もどる</button></div>
      </header>
      <div class="level-strip" aria-label="はかり方"><span class="level-strip-label">はかり方</span><span class="level-chip ${levelNo === 1 ? 'is-current' : ''}"><strong>1</strong> 0から読む</span><span class="level-chip ${levelNo === 2 ? 'is-current' : ''}"><strong>2</strong> とちゅうから読む</span></div>
      <div class="learning-layout">
        <section class="ruler-panel edu-card"><div class="panel-heading"><div><div class="panel-kicker">まず見る</div><h2>はじまりとおわりを見よう</h2></div><span class="edu-badge edu-badge-neutral">ものさし</span></div>
          <div class="reading-guide"><span class="guide-item"><i class="guide-dot guide-start"></i>はじまり</span><span class="guide-arrow">→</span><span class="guide-item"><i class="guide-dot guide-end"></i>おわり</span></div>
          <div class="ruler-scroll" id="rulerScroll"><div class="ruler-board" id="rulerBoard"><div class="stage" id="stage"></div><div id="ruler" class="ruler"></div></div></div>
          <p class="ruler-help">1mmの目盛まで見える大きさです。必要なら横に動かして見てください。</p>
        </section>
        <aside class="answer-panel edu-card edu-card-pad" aria-label="答える"><div class="answer-heading"><div class="panel-kicker">次に答える</div><h2>長さは？</h2></div>
          <div id="result" class="answer-result" aria-live="polite"></div>
          <form id="guessForm" class="answer-form"><div class="answer-line"><span>長さは</span><span id="decimalAnswer" class="answer-unit-group"><input id="guessInput" class="edu-input answer-input" type="number" min="0" inputmode="decimal" aria-label="長さ"><span>cm</span></span><span id="splitAnswer" hidden class="answer-unit-group"><input id="answerCm" class="edu-input answer-input answer-input-small" type="number" min="0" max="20" inputmode="numeric" aria-label="センチメートル"><span>cm</span><input id="answerMm" class="edu-input answer-input answer-input-small" type="number" min="0" max="9" inputmode="numeric" aria-label="ミリメートル"><span>mm</span></span></div><button type="submit" class="edu-btn edu-btn-primary edu-btn-block answer-submit">答える</button></form>
          <div class="result-box" aria-live="polite"><div class="result-box-label">答えを確かめる</div><div id="correctAnswer" class="correct-answer"></div><p id="resultGuide"></p></div><p id="feedback" class="feedback-message"></p>
        </aside>
      </div>
      ${timed ? '<div id="challengeResult" class="challenge-result" hidden><div class="challenge-result-card"><div class="panel-kicker">TIME UP</div><h2>タイムアップ！</h2><div id="challengeResultNumber" class="challenge-result-number">0</div><p>正解</p><p>全 <span id="challengeResultSolved">0</span>問に挑戦</p><div class="challenge-result-actions"><button id="challengeAgain" class="edu-btn edu-btn-primary">もう一度</button><button id="challengeHome" class="edu-btn edu-btn-secondary">タイトルへ</button></div></div></div>' : ''}
    </div>`;
}
