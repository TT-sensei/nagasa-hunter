// ruler.js
// 長さハンターの定規描画。モードに応じて目盛りの細かさを切り替える。

export const RulerConfig = {
  minMM: 0,
  maxMM: 200,
  pxPerMM: 4,

  tickHeight: { mm: 7, mm5: 13, cm: 24 },
  tickColor: { mm: '#94a3b8', mm5: '#64748b', cm: '#1e293b' },
  tickWidth: { mm: 1, mm5: 1.5, cm: 2 },

  tickStepMM: 1,
  showOneMMTicks: true,
  showFiveMMTicks: true,
  labelIntervalMM: 50,
  labelFontSize: 14,
  labelColor: '#1e293b',
  showUnitOnLastLabel: true,

  baselineY: 60,
  marginTop: 20
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
  const y = config.baselineY - config.tickHeight.cm - 6;
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

  const width = mmToPx(config.maxMM, config) + 20;
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
  container.innerHTML = renderRulerSVG(userConfig);
  return container.querySelector('svg');
}
