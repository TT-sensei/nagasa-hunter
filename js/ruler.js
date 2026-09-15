// ruler.js
// 長さハンターの定規描画。
// 通常モードは学習用に整理した目盛、小数モードは1mmを読むための実物風定規を使用する。

export const RulerConfig = {
  minMM: 0,
  maxMM: 200,
  pxPerMM: 6,

  tickHeight: { mm: 9, mm5: 16, cm: 28 },
  tickColor: { mm: '#94a3b8', mm5: '#64748b', cm: '#1e293b' },
  tickWidth: { mm: 1.25, mm5: 1.8, cm: 2.2 },

  tickStepMM: 1,
  showOneMMTicks: true,
  showFiveMMTicks: true,
  labelIntervalMM: 50,
  labelFontSize: 16,
  labelColor: '#1e293b',
  showUnitOnLastLabel: true,

  baselineY: 64,
  marginTop: 26,

  // SVG Silh / Pixabay の CC0 定規素材。
  // 小数モードだけで使用し、CM/MMモードの学習上の目盛設計は維持する。
  referenceRulerUrl: 'https://svgsilh.com/svg/148506.svg',
  referenceRulerPxPerMM: 6.4
};

export function mmToPx(mm, config = RulerConfig) {
  return (mm - config.minMM) * config.pxPerMM;
}

function tickKind(mm, config) {
  if (mm % 10 === 0) return 'cm';
  if (mm % 5 === 0 && config.showFiveMMTicks) return 'mm5';
  return 'mm';
}

function buildTick(mm, config) {
  const kind = tickKind(mm, config);
  const x = mmToPx(mm, config);
  const h = config.tickHeight[kind];
  return `<line x1="${x}" y1="${config.baselineY}" x2="${x}" y2="${config.baselineY - h}" stroke="${config.tickColor[kind]}" stroke-width="${config.tickWidth[kind]}" stroke-linecap="round" />`;
}

function buildLabel(mm, config) {
  const x = mmToPx(mm, config);
  const cm = mm / 10;
  const isLast = mm === config.maxMM;
  const text = (isLast && config.showUnitOnLastLabel) ? `${cm}cm` : `${cm}`;
  const y = config.baselineY - config.tickHeight.cm - 7;
  return `<text x="${x}" y="${y}" font-size="${config.labelFontSize}" fill="${config.labelColor}" text-anchor="middle">${text}</text>`;
}

export function renderRulerSVG(userConfig = {}) {
  const config = {
    ...RulerConfig,
    ...userConfig,
    tickHeight: { ...RulerConfig.tickHeight, ...(userConfig.tickHeight || {}) },
    tickColor: { ...RulerConfig.tickColor, ...(userConfig.tickColor || {}) },
    tickWidth: { ...RulerConfig.tickWidth, ...(userConfig.tickWidth || {}) },
  };

  const width = mmToPx(config.maxMM, config) + 30;
  const height = config.baselineY + config.marginTop;
  let ticks = '';
  let labels = '';

  const step = Math.max(1, config.tickStepMM || 1);
  for (let mm = config.minMM; mm <= config.maxMM; mm += step) {
    ticks += buildTick(mm, config);
    if (mm % config.labelIntervalMM === 0) labels += buildLabel(mm, config);
  }

  const baseline = `<line x1="0" y1="${config.baselineY}" x2="${width - 20}" y2="${config.baselineY}" stroke="${config.tickColor.cm}" stroke-width="2" />`;
  return `<svg viewBox="0 0 ${width} ${height}" xmlns="http://www.w3.org/2000/svg">${baseline}${ticks}${labels}</svg>`;
}

export function mountRuler(container, userConfig = {}) {
  const config = { ...RulerConfig, ...userConfig };

  if (config.useReferenceRuler) {
    const width = config.maxMM * config.referenceRulerPxPerMM;
    container.innerHTML = `<div class="reference-ruler-wrap"><img class="reference-ruler" src="${config.referenceRulerUrl}" alt="1mm目盛の定規" draggable="false"></div>`;
    const img = container.querySelector('.reference-ruler');
    img.style.width = `${width}px`;
    img.style.height = 'auto';
    img.addEventListener('error', () => {
      container.innerHTML = renderRulerSVG(config);
    }, { once: true });
    return img;
  }

  container.innerHTML = renderRulerSVG(config);
  return container.querySelector('svg');
}
