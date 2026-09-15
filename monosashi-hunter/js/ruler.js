// ruler.js
// 「ものさしハンター」定規(目盛り)描画モジュール
//
// ANGLE HUNTER の分度器モジュールと同じ設計思想:
//   ・座標変換(mm → px)を独立した関数として切り出す
//   ・目盛り/ラベルの見た目はすべて RulerConfig で調整できるようにする
//   ・的の位置計算(target.js)からも mmToPx() をそのまま再利用する

export const RulerConfig = {
  minMM: 0,
  maxMM: 200,        // 20cm
  pxPerMM: 4,

  tickHeight: { mm: 8, mm5: 14, cm: 24 },   // 1mm短い/5mmやや長い/1cm一番長い
  tickColor: { mm: '#94a3b8', mm5: '#64748b', cm: '#1e293b' },
  tickWidth: { mm: 1, mm5: 1.5, cm: 2 },

  labelIntervalMM: 50, // 数字は5cmごとに表示(1cmごとではない)
  labelFontSize: 14,
  labelColor: '#1e293b',
  showUnitOnLastLabel: true,

  baselineY: 60,
  marginTop: 20
};

export function mmToPx(mm, config = RulerConfig) {
  return (mm - config.minMM) * config.pxPerMM;
}

function tickKind(mm) {
  if (mm % 10 === 0) return 'cm';
  if (mm % 5 === 0) return 'mm5';
  return 'mm';
}

function buildTick(mm, config) {
  const kind = tickKind(mm);
  const x = mmToPx(mm, config);
  const h = config.tickHeight[kind];
  return `<line x1="${x}" y1="${config.baselineY}" x2="${x}" y2="${config.baselineY - h}" ` +
         `stroke="${config.tickColor[kind]}" stroke-width="${config.tickWidth[kind]}" stroke-linecap="round" />`;
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
  for (let mm = config.minMM; mm <= config.maxMM; mm++) {
    ticks += buildTick(mm, config);
    if (mm % config.labelIntervalMM === 0) {
      labels += buildLabel(mm, config);
    }
  }

  const baseline = `<line x1="0" y1="${config.baselineY}" x2="${width - 20}" y2="${config.baselineY}" ` +
                    `stroke="${config.tickColor.cm}" stroke-width="2" />`;

  return `<svg viewBox="0 0 ${width} ${height}" xmlns="http://www.w3.org/2000/svg">` +
         `${baseline}${ticks}${labels}</svg>`;
}

export function mountRuler(container, userConfig = {}) {
  container.innerHTML = renderRulerSVG(userConfig);
  return container.querySelector('svg');
}
