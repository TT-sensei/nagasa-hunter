// ruler.js
// 長さハンターの定規描画。
// 1mmを目で追えるよう、学習用の目盛をアプリ内SVGで確実に表示する。

export const RulerConfig = {
  minMM: 0,
  maxMM: 200,
  pxPerMM: 6.4,
  referenceRulerUrl: 'https://svgsilh.com/svg/148506.svg',
  referenceRulerPxPerMM: 6.4
};

export function mmToPx(mm, config = RulerConfig) {
  return (mm - config.minMM) * config.pxPerMM;
}

function renderFallbackSVG(userConfig = {}) {
  const config = { ...RulerConfig, ...userConfig };
  const width = mmToPx(config.maxMM, config) + 4;

  // 本物のものさしに近い配置：基準線→目盛→数字をすべて下側へ。
  const baselineY = 24;
  const height = 94;
  let ticks = '';
  let labels = '';

  for (let mm = config.minMM; mm <= config.maxMM; mm += 1) {
    const x = mmToPx(mm, config);
    const kind = mm % 10 === 0 ? 'cm' : mm % 5 === 0 ? 'mm5' : 'mm';
    const h = kind === 'cm' ? 30 : kind === 'mm5' ? 18 : 10;
    const w = kind === 'cm' ? 2.2 : kind === 'mm5' ? 1.7 : 1.15;

    // 目盛は基準線の下側。
    ticks += `<line x1="${x}" y1="${baselineY}" x2="${x}" y2="${baselineY + h}" stroke="#172033" stroke-width="${w}" />`;

    // 数字も目盛の下側。1cmごとの数字を読みやすく配置する。
    if (mm % 10 === 0) {
      labels += `<text x="${x}" y="76" font-size="14" font-weight="700" fill="#172033" text-anchor="middle">${mm / 10}</text>`;
    }
  }

  return `<svg viewBox="0 0 ${width} ${height}" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="1mm目盛の定規"><rect width="${width}" height="${height}" fill="#fff"/><line x1="0" y1="${baselineY}" x2="${width}" y2="${baselineY}" stroke="#172033" stroke-width="2"/>${ticks}${labels}</svg>`;
}

export function renderRulerSVG(userConfig = {}) {
  return renderFallbackSVG(userConfig);
}

export function mountRuler(container, userConfig = {}) {
  const config = { ...RulerConfig, ...userConfig };
  // 外部SVGは端末や通信環境によって表示できないことがあるため、
  // 学習に必要な1mm目盛はアプリ内SVGを最初から確実に表示する。
  container.innerHTML = `<div class="reference-ruler-wrap">${renderFallbackSVG(config)}</div>`;
  const svg = container.querySelector('svg');
  svg.classList.add('reference-ruler');
  svg.style.width = `${config.maxMM * config.referenceRulerPxPerMM}px`;
  svg.style.height = '94px';
  return svg;
}
