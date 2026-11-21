// drag-mode.js
// 「にげたナビアンをつかまえよう」: ものさしを自分で動かして当てる体験。
// 読む練習（measure-mode）とは技能を分け、0をはじまりに合わせることを学ぶ。
// 間違いのフィードバックも「当て方」と「読み方」で分けて返す。
import { RulerConfig, mountRuler, mmToPx } from './ruler.js';
import { CONFIG } from './config.js';
import { ASSETS, withFallback } from './assets.js';
import { playSound, toggleSound, updateSoundButton } from './sound.js';
import { recordHuntResult, getStats } from './storage.js';

const MODE = {
  cm: { key: 'cm', title: 'cmまで', description: '1cmごとの目盛を読む', lengthStepMM: 10 },
  mm: { key: 'mm', title: 'cmとmmまで', description: '1mmの目盛まで読んで表す', lengthStepMM: 1 },
  decimal: { key: 'decimal', title: '小数で表す', description: '1mmを0.1cmとして表す', lengthStepMM: 1 }
};

const SNAP_MM = 2;      // この範囲に入ったら0が吸着する
const SNAP_PX = 7;      // 上下はこの範囲（px）で吸着する
const UNSNAP_PX = 12;
const UNSNAP_MM = 4;    // ここまで離れたら吸着が外れたとみなす
const COLLECTION_KEY = 'nagasa-hunter.navianGets.v1';

export function startDragMode(root, { mode = 'cm', slant = false } = {}) {
  const modeInfo = MODE[mode] || MODE.cm;
  const levelNo = mode === 'decimal' ? 3 : mode === 'mm' ? 2 : 1;
  root.innerHTML = template(modeInfo, levelNo, slant);

  const rulerContainer = root.querySelector('#ruler');
  const scrollEl = root.querySelector('#rulerScroll');
  const board = root.querySelector('#rulerBoard');
  const stage = root.querySelector('#stage');
  const form = root.querySelector('#guessForm');
  const feedback = root.querySelector('#feedback');
  const resultEl = root.querySelector('#result');
  const progressEl = root.querySelector('#progressText');
  const streakEl = root.querySelector('#streak');
  const catchEl = root.querySelector('#catchCount');
  const alignEl = root.querySelector('#alignStatus');
  const soundBtn = root.querySelector('#soundBtn');

  const rulerConfig = getRulerConfig(modeInfo);
  mountRuler(rulerContainer, rulerConfig);
  const rulerPxWidth = `${mmToPx(rulerConfig.maxMM, rulerConfig)}px`;
  const wrapEl = rulerContainer.querySelector('.reference-ruler-wrap');
  if (wrapEl) wrapEl.style.width = rulerPxWidth;
  const grip = document.createElement('div');
  grip.className = 'ruler-grip';
  grip.style.width = rulerPxWidth;
  grip.textContent = 'ものさしを うごかす（たて・よこ）';
  rulerContainer.appendChild(grip);
  rulerContainer.style.transformOrigin = '0px 24px';
  let knob = null;
  if (slant) {
    knob = document.createElement('div');
    knob.className = 'ruler-rotate-knob';
    knob.textContent = '↻';
    knob.style.left = `${mmToPx(70, rulerConfig)}px`;
    knob.hidden = true;
    rulerContainer.appendChild(knob);
  }
  board.style.width = `${mmToPx(rulerConfig.maxMM, rulerConfig) + mmToPx(64, rulerConfig) + 24}px`;
  board.style.minHeight = slant ? '540px' : '252px';
  if (slant) stage.style.height = '480px';
  setupAnswerInputs(root, modeInfo);

  const zeroLine = document.createElement('div');
  zeroLine.className = 'zero-line';
  board.appendChild(zeroLine);

  let current = null;
  let shiftMM = 0;
  let dyPx = 0;
  let hSnap = false;
  let vSnap = false;
  let wasAligned = false;
  let rotDeg = 0;
  let angleOk = true;
  let posOk = true;
  let alignedNow = false;
  let locked = false;
  let streak = getStats().streak;
  let solved = 0;
  let catches = 0;
  streakEl.textContent = `れんぞく ${streak}回`;
  updateSoundButton(soundBtn);
  soundBtn?.addEventListener('click', async () => { await toggleSound(); updateSoundButton(soundBtn); });
  playSound('questionStart', 0.16);

  function applyShift() {
    rulerContainer.style.transform = `translate(${mmToPx(shiftMM, rulerConfig)}px, ${dyPx}px) rotate(${rotDeg}deg)`;
  }

  function updateAlignUI() {
    const diag = !!(current && current.diagonal);
    const aligned = diag ? (angleOk && posOk) : (hSnap && vSnap && angleOk);
    alignedNow = aligned;
    if (aligned && !wasAligned) playSound('questionStart', 0.12);
    wasAligned = aligned;
    alignEl.textContent = aligned
      ? (diag ? '0と向きが 合った！' : '0が 合った！')
      : diag
        ? (!angleOk && !posOk
          ? '向きと0を合わせよう'
          : !angleOk
            ? 'あとは 向きを合わせよう（金色の丸）'
            : 'あとは 0の場所を合わせよう')
        : hSnap
          ? 'あとは 上下を合わせよう'
          : vSnap
            ? 'あとは 0を合わせよう'
            : '0が 合っていない';
    alignEl.classList.toggle('is-ok', aligned);
    rulerContainer.classList.toggle('is-aligned', aligned);
    zeroLine.classList.toggle('show', hSnap && !diag);
    stage.querySelector('.endpoint.start')?.classList.toggle('is-hit', aligned);
  }

  function setShift(valueMM, fromDrag = false) {
    shiftMM = Math.max(-6, Math.min(150, valueMM));
    const off = Math.abs(shiftMM - current.startMM);
    if (off <= SNAP_MM) {
      shiftMM = current.startMM;
      hSnap = true;
    } else if (off > UNSNAP_MM) {
      hSnap = false;
    }
    applyShift();
    updateAlignUI();
    updateDiagonalSnap();
    if (fromDrag) nudgeScroll();
  }

  function setDy(valuePx) {
    dyPx = Math.max(-80, Math.min(95, valuePx));
    if (Math.abs(dyPx) <= SNAP_PX) {
      dyPx = 0;
      vSnap = true;
    } else if (Math.abs(dyPx) > UNSNAP_PX) {
      vSnap = false;
    }
    applyShift();
    updateAlignUI();
    updateDiagonalSnap();
  }

  const ANGLE_SNAP = 3;
  const ANGLE_UNSNAP = 5;
  function setRot(value) {
    if (!current || !current.diagonal) { rotDeg = 0; applyShift(); return; }
    rotDeg = Math.max(-100, Math.min(100, value));
    const off = Math.abs(rotDeg - current.angleDeg);
    if (off <= ANGLE_SNAP) { rotDeg = current.angleDeg; angleOk = true; }
    else if (off > ANGLE_UNSNAP) { angleOk = false; }
    applyShift();
    updateAlignUI();
  }
  function updateDiagonalSnap() {
    if (!current || !current.diagonal) return;
    const pv = pivotBoardPos();
    const dx = current.pivotX - pv.x;
    const dy = current.pivotY - pv.y;
    const dist = Math.hypot(dx, dy);
    if (dist <= 10) {
      if (dx !== 0 || dy !== 0) {
        shiftMM += dx / rulerConfig.pxPerMM;
        dyPx += dy;
        applyShift();
      }
      posOk = true;
      updateAlignUI();
    } else if (dist > 16) {
      if (posOk) { posOk = false; updateAlignUI(); }
    }
  }
  function pointerBoardPos(event) {
    const rect = board.getBoundingClientRect();
    return { x: event.clientX - rect.left, y: event.clientY - rect.top };
  }
  function pivotBoardPos() {
    return { x: rulerContainer.offsetLeft + mmToPx(shiftMM, rulerConfig), y: rulerContainer.offsetTop + dyPx + 24 };
  }

  function nudgeScroll() {
    if (!dragState) return;
    const rect = scrollEl.getBoundingClientRect();
    if (dragState.clientX > rect.right - 52) scrollEl.scrollLeft += 12;
    else if (dragState.clientX < rect.left + 52) scrollEl.scrollLeft -= 12;
  }

  let dragState = null;
  rulerContainer.addEventListener('pointerdown', (event) => {
    if (locked) return;
    const rotating = !!(knob && !knob.hidden && event.target === knob);
    dragState = { pointerId: event.pointerId, kind: rotating ? 'rotate' : 'move', startX: event.clientX, startY: event.clientY, startShift: shiftMM, startDy: dyPx, clientX: event.clientX, rotOffset: 0 };
    if (rotating) {
      const pt = pointerBoardPos(event);
      const pv = pivotBoardPos();
      dragState.rotOffset = rotDeg - Math.atan2(pt.y - pv.y, pt.x - pv.x) * 180 / Math.PI;
    }
    rulerContainer.setPointerCapture(event.pointerId);
    rulerContainer.classList.add('is-dragging');
    event.preventDefault();
  });
  rulerContainer.addEventListener('pointermove', (event) => {
    if (!dragState || event.pointerId !== dragState.pointerId) return;
    dragState.clientX = event.clientX;
    if (dragState.kind === 'rotate') {
      const pt = pointerBoardPos(event);
      const pv = pivotBoardPos();
      setRot(Math.atan2(pt.y - pv.y, pt.x - pv.x) * 180 / Math.PI + dragState.rotOffset);
      return;
    }
    const dxMM = (event.clientX - dragState.startX) / rulerConfig.pxPerMM;
    setShift(dragState.startShift + dxMM, true);
    setDy(dragState.startDy + (event.clientY - dragState.startY));
  });
  const endDrag = (event) => {
    if (!dragState || event.pointerId !== dragState.pointerId) return;
    const wasRotate = dragState.kind === 'rotate';
    dragState = null;
    rulerContainer.classList.remove('is-dragging');
    setShift(shiftMM);
    setDy(dyPx);
    if (wasRotate) setRot(rotDeg);
  };
  rulerContainer.addEventListener('pointerup', endDrag);
  rulerContainer.addEventListener('pointercancel', endDrag);

  function spawn() {
    current = spawnProblem(stage, modeInfo, rulerConfig, slant);
    if (current.diagonal) {
      // pivotX/pivotYはstage内座標で作られているので、board座標へそろえる
      current.pivotX += stage.offsetLeft;
      current.pivotY += stage.offsetTop;
      rulerContainer.style.top = `${current.rulerTop}px`;
      rotDeg = current.spawnRot;
      angleOk = false;
      posOk = false;
      if (knob) knob.hidden = false;
    } else {
      rulerContainer.style.top = '';
      rotDeg = 0;
      angleOk = true;
      posOk = true;
      if (knob) knob.hidden = true;
    }
    zeroLine.style.left = `${40 + mmToPx(current.startMM, rulerConfig)}px`;
    hSnap = false;
    vSnap = false;
    wasAligned = false;
    shiftMM = pickInitialShift(current.startMM);
    if (Math.abs(shiftMM - current.startMM) <= SNAP_MM) shiftMM = current.startMM + 30;
    dyPx = pickInitialDy();
    if (current.diagonal) {
      const pvx = rulerContainer.offsetLeft + mmToPx(shiftMM, rulerConfig);
      const pvy = current.rulerTop + dyPx + 24;
      if (Math.hypot(current.pivotX - pvx, current.pivotY - pvy) < 24) shiftMM = Math.min(150, shiftMM + 34);
    }
    applyShift();
    updateAlignUI();
    scrollEl.scrollLeft = Math.max(0, mmToPx(current.startMM, rulerConfig) - 150);
    progressEl.textContent = `ここまで ${solved}問`;
  }

  form.addEventListener('submit', (event) => {
    event.preventDefault();
    if (locked) return;
    const guessMM = readAnswer(root, modeInfo);
    if (guessMM === null) {
      showInputHint(root, modeInfo);
      return;
    }
    locked = true;
    const correct = Math.abs(guessMM - current.lengthMM) <= 1;
    playSound(correct ? 'correct' : 'softFail', correct ? 0.2 : 0.16);
    const stats = recordHuntResult(correct);
    streak = stats.streak;
    solved += 1;
    renderResult(root, current, guessMM, correct, modeInfo, rulerConfig);
    streakEl.textContent = `れんぞく ${streak}回`;
    progressEl.textContent = `ここまで ${solved}問`;

    if (correct) {
      catches += 1;
      catchEl.textContent = `つかまえた ${catches}体`;
      recordCatch(current.targetFile);
      stage.querySelector('.target')?.classList.add('is-caught');
      resultEl.textContent = 'つかまえた！';
      resultEl.className = 'answer-result is-correct';
      feedback.textContent = current.targetName
        ? `${current.targetName}をつかまえた！ 0を合わせて、きちんと読めました。`
        : 'ナビアンをつかまえた！ 0を合わせて、きちんと読めました。';
      feedback.className = 'feedback-message is-correct';
    } else if (!alignedNow) {
      resultEl.textContent = 'おしい！';
      resultEl.className = 'answer-result is-wrong';
      feedback.textContent = current.diagonal
        ? 'ものさしの当て方を確認しよう。金色の丸で向きを線に合わせ、0の目盛を「ここから」に合わせよう。'
        : 'ものさしの当て方を確認しよう。0の目盛が「ここから」に合っているかな？ 上下の位置も、線のすぐ下に合わせよう。';
      feedback.className = 'feedback-message is-wrong';
    } else {
      resultEl.textContent = 'おしい！';
      resultEl.className = 'answer-result is-wrong';
      feedback.textContent = `当て方は合っていました。正しい長さは ${formatAnswer(current.lengthMM, modeInfo)}。おわりの目盛をもう一度見てみよう。`;
      feedback.className = 'feedback-message is-wrong';
    }

    form.querySelector('button').disabled = true;
    setTimeout(() => {
      locked = false;
      form.querySelector('button').disabled = false;
      resetInputs(root);
      resetResult(root);
      spawn();
      playSound('questionStart', 0.12);
    }, correct ? 1400 : CONFIG.spawnDelayMs);
  });

  root.querySelector('#homeBtn').addEventListener('click', () => { window.location.reload(); });
  spawn();
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

function spawnProblem(stage, modeInfo, rulerConfig, slant = false) {
  stage.innerHTML = '';
  const minLength = modeInfo.key === 'cm' ? 30 : 20;
  const maxLength = modeInfo.key === 'cm' ? 150 : 160;
  const diagonal = !!slant && Math.random() < 0.55;
  let angleDeg = 0, dirCos = 1, dirSin = 0;
  let lengthCap = maxLength;
  if (diagonal) {
    const band = Math.random();
    const mag = band < 0.4 ? 15 + Math.random() * 25 : band < 0.75 ? 40 + Math.random() * 30 : 70 + Math.random() * 20;
    angleDeg = Math.round(mag) * (Math.random() < 0.5 ? -1 : 1);
    const rad = angleDeg * Math.PI / 180;
    dirCos = Math.cos(rad);
    dirSin = Math.sin(rad);
    const capX = Math.abs(dirCos) > 0.02 ? 900 / Math.abs(dirCos) : Infinity;
    const capY = Math.abs(dirSin) > 0.02 ? (dirSin > 0 ? 400 : 380) / Math.abs(dirSin) : Infinity;
    lengthCap = Math.min(maxLength, Math.floor(Math.min(capX, capY) / rulerConfig.pxPerMM));
  }
  const lengthMM = randomStep(minLength, Math.max(minLength, lengthCap), modeInfo.lengthStepMM);
  let startMM = randomStep(30, 110, 1);
  if (startMM + lengthMM > 195) startMM = 195 - lengthMM;
  const endMM = startMM + lengthMM;

  const startX = mmToPx(startMM, rulerConfig);
  const lenPx = mmToPx(lengthMM, rulerConfig);
  let startY = 80, endX = mmToPx(endMM, rulerConfig), endY = 80;
  let rulerTop = null, spawnRot = 0, pivotX = null, pivotY = null;
  if (diagonal) {
    if (dirSin > 0) startY = 64;
    else if (dirSin < 0) startY = 84 + lenPx * Math.abs(dirSin);
    endX = startX + lenPx * dirCos;
    endY = startY + lenPx * dirSin;
    pivotX = startX - dirSin * 36;
    pivotY = startY + dirCos * 36;
    rulerTop = pivotY - 24;
    const offMag = 12 + Math.random() * 14;
    const candidates = [angleDeg + offMag, angleDeg - offMag, angleDeg + (angleDeg > 0 ? -12 : 12)];
    spawnRot = candidates.find((r) => {
      const ky = pivotY + mmToPx(70, rulerConfig) * Math.sin(r * Math.PI / 180);
      return ky >= 34 && ky <= 506 && Math.abs(r - angleDeg) >= 10;
    });
    if (spawnRot === undefined) spawnRot = angleDeg + (angleDeg > 0 ? -12 : 12);
    spawnRot = Math.max(-95, Math.min(95, spawnRot));
  }

  const segment = document.createElement('div');
  segment.className = 'measure-segment';
  segment.style.left = `${startX}px`;
  segment.style.width = `${lenPx}px`;
  if (diagonal) {
    segment.style.top = `${startY}px`;
    segment.style.transform = `translateY(-50%) rotate(${angleDeg}deg)`;
    segment.style.transformOrigin = '0 50%';
  }
  stage.appendChild(segment);
  addEndpoint(stage, startMM, rulerConfig, 'start', diagonal ? startY - 24 : null, diagonal ? angleDeg : null);
  if (diagonal) addEndpointAt(stage, endX, endY - 24, 'end', angleDeg);
  else addEndpoint(stage, endMM, rulerConfig, 'end');

  const targetPool = ASSETS.catchPool;
  const index = Math.floor(Math.random() * targetPool.length);
  const wrap = document.createElement('div');
  wrap.className = 'target';
  wrap.style.left = `${diagonal ? endX : mmToPx(endMM, rulerConfig)}px`;
  if (diagonal) wrap.style.top = `${endY - 76}px`;
  const img = document.createElement('img');
  img.src = targetPool[index];
  img.alt = 'にげたナビアン';
  withFallback(img, index);
  wrap.appendChild(img);
  stage.appendChild(wrap);

  const file = (targetPool[index] || '').split('/').pop();
  const entry = ASSETS.collection.find((item) => item.file === file);
  return { startMM, lengthMM, endMM, targetFile: file, targetName: entry ? entry.name : '', diagonal, angleDeg, startX, startY, endX, endY, rulerTop, spawnRot, dirCos, dirSin, pivotX, pivotY };
}

function addEndpointAt(stage, x, top, kind, angleDeg = null) {
  const line = document.createElement('div');
  line.className = `endpoint ${kind}`;
  line.style.left = `${x}px`;
  if (top !== null && top !== undefined) line.style.top = `${top}px`;
  styleSlantEndpoint(line, angleDeg);
  stage.appendChild(line);
}

function styleSlantEndpoint(line, angleDeg) {
  if (angleDeg === null || angleDeg === undefined) return;
  line.classList.add('slant');
  line.style.height = '48px';
  line.style.transform = `translateX(-50%) rotate(${angleDeg}deg)`;
  line.style.setProperty('--erot', `${-angleDeg}deg`);
}

function addEndpoint(stage, mm, rulerConfig, kind, topPx = null, angleDeg = null) {
  const line = document.createElement('div');
  line.className = `endpoint ${kind}`;
  line.style.left = `${mmToPx(mm, rulerConfig)}px`;
  if (topPx !== null) line.style.top = `${topPx}px`;
  styleSlantEndpoint(line, angleDeg);
  stage.appendChild(line);
}

function pickInitialDy() {
  const options = [-36, -24, 30, 52];
  return options[Math.floor(Math.random() * options.length)];
}

function pickInitialShift(startMM) {
  const deltas = [-68, -55, -42, 34, 44, 54];
  for (const delta of deltas.sort(() => Math.random() - 0.5)) {
    const candidate = startMM + delta;
    if (candidate >= 0 && candidate <= 130) return candidate;
  }
  return Math.max(0, startMM - 45);
}

function recordCatch(file) {
  if (!file) return;
  try {
    const gets = JSON.parse(localStorage.getItem(COLLECTION_KEY) || '{}');
    gets[file] = (Number(gets[file]) || 0) + 1;
    localStorage.setItem(COLLECTION_KEY, JSON.stringify(gets));
  } catch {
    // 記録できなくても学習本体は継続する。
  }
}

function setupAnswerInputs(root, modeInfo) {
  const decimalArea = root.querySelector('#decimalAnswer');
  const splitArea = root.querySelector('#splitAnswer');
  const guessInput = root.querySelector('#guessInput');
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
  answerMarker.style.left = `${problem.diagonal ? problem.endX : mmToPx(problem.endMM, rulerConfig)}px`;
  if (problem.diagonal) answerMarker.style.top = `${problem.endY - 59}px`;
  answerMarker.textContent = '↓';
  stage.appendChild(answerMarker);
  if (!correct) {
    const guessMarker = document.createElement('div');
    guessMarker.className = 'guess-marker';
    guessMarker.style.left = `${problem.diagonal ? problem.startX + mmToPx(guessMM, rulerConfig) * problem.dirCos : mmToPx(problem.startMM + guessMM, rulerConfig)}px`;
    if (problem.diagonal) guessMarker.style.top = `${problem.startY + mmToPx(guessMM, rulerConfig) * problem.dirSin - 59}px`;
    guessMarker.textContent = 'あなたの答え';
    stage.appendChild(guessMarker);
  }
  root.querySelector('#correctAnswer').textContent = formatAnswer(problem.lengthMM, modeInfo);
  root.querySelector('#resultGuide').textContent = correct ? 'ものさしを当てて、長さを読めた！' : '緑の線がどこからどこまであるか、もう一度見てみよう。';
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

function template(modeInfo, levelNo, slant = false) {
  return `
    <div class="hunter-shell">
      <header class="hunter-topbar">
        <div class="hunter-title-block"><div class="hunter-kicker">MONOSASHI HUNTER</div><div class="hunter-title-line"><h1>つかまえよう</h1><span class="edu-badge edu-badge-primary">${modeInfo.title}</span></div><p>ものさしを動かして、0をはじまりに合わせよう</p></div>
        <div class="hunter-top-actions"><span id="progressText" class="progress-text">ここまで 0問</span><span id="catchCount" class="streak-pill">つかまえた 0体</span><span id="streak" class="streak-pill">れんぞく 0回</span><button id="soundBtn" type="button" class="edu-btn edu-btn-secondary sound-toggle" aria-pressed="true">音あり</button><button id="homeBtn" type="button" class="edu-btn edu-btn-secondary">もどる</button></div>
      </header>
      <div class="level-strip" aria-label="レベル"><span class="level-strip-label">レベル</span><span class="level-chip ${levelNo === 1 ? 'is-current' : ''}"><strong>1</strong> cmまで</span><span class="level-chip ${levelNo === 2 ? 'is-current' : ''}"><strong>2</strong> cmとmmまで</span><span class="level-chip ${levelNo === 3 ? 'is-current' : ''}"><strong>3</strong> 小数で表す</span><span class="level-chip level-position"><strong>はじまり</strong> 自分で合わせる</span>${slant ? '<span class="level-chip level-position"><strong>線</strong> 斜めも</span>' : ''}</div>
      <div class="learning-layout">
        <section class="ruler-panel edu-card"><div class="panel-heading"><div><div class="panel-kicker">まず当てる</div><h2>ものさしを当てよう</h2></div><span id="alignStatus" class="align-pill">0が 合っていない</span></div>
          <div class="reading-guide"><span class="guide-item"><i class="guide-dot guide-start"></i>ものさしを動かす</span><span class="guide-arrow">→</span><span class="guide-item"><i class="guide-dot guide-mid"></i>0を合わせる</span><span class="guide-arrow">→</span><span class="guide-item"><i class="guide-dot guide-end"></i>おわりを読む</span></div>
          <div class="ruler-scroll" id="rulerScroll"><div class="ruler-board" id="rulerBoard"><div class="stage" id="stage"></div><div id="ruler" class="ruler drag-ruler"></div></div></div>
          <p class="ruler-help">${slant ? 'ものさしの下の緑の部分を指で動かして、0の目盛を「ここから」に合わせよう。斜めの線は、金色の丸を動かすとものさしが回るよ。' : 'ものさしの下の緑の部分を指で動かして、0の目盛を「ここから」に合わせよう。たてにも横にも動かせるよ。'}</p>
        </section>
        <aside class="answer-panel edu-card edu-card-pad" aria-label="答える"><div class="answer-heading"><div class="panel-kicker">次に答える</div><h2>長さは？</h2></div>
          <div id="result" class="answer-result" aria-live="polite"></div>
          <form id="guessForm" class="answer-form"><div class="answer-line"><span>長さは</span><span id="decimalAnswer" class="answer-unit-group"><input id="guessInput" class="edu-input answer-input" type="number" min="0" inputmode="decimal" aria-label="長さ"><span>cm</span></span><span id="splitAnswer" hidden class="answer-unit-group"><input id="answerCm" class="edu-input answer-input answer-input-small" type="number" min="0" max="20" inputmode="numeric" aria-label="センチメートル"><span>cm</span><input id="answerMm" class="edu-input answer-input answer-input-small" type="number" min="0" max="9" inputmode="numeric" aria-label="ミリメートル"><span>mm</span></span></div><button type="submit" class="edu-btn edu-btn-primary edu-btn-block answer-submit">答える</button></form>
          <div class="result-box" aria-live="polite"><div class="result-box-label">答えを確かめる</div><div id="correctAnswer" class="correct-answer"></div><p id="resultGuide"></p></div><p id="feedback" class="feedback-message"></p>
        </aside>
      </div>
    </div>`;
}
