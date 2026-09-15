// ruler.js
// 長さハンターの定規描画。
// 3モードともSVG Silhの実物風定規を共通で使用する。

export const RulerConfig = {
  minMM: 0,
  maxMM: 200,
  pxPerMM: 6.4,

  // SVG Silh / Pixabay の CC0 定規素材。
  referenceRulerUrl: 'https://svgsilh.com/svg/148506.svg',
  referenceRulerPxPerMM: 6.4
};

export function mmToPx(mm, config = RulerConfig) {
  return (mm - config.minMM) * config.pxPerMM;
}

// 後方互換用。現在は実物風SVGを使うため、生成SVGはフォールバックとして残す。
function renderFallbackSVG(userConfig = {}) {
  const config = { ...RulerConfig, ...userConfig };
  const width = mmToPx(config.maxMM, config) + 30;
  const baselineY = 64;
  const height = 92;
  let ticks = '';
  let labels = '';

  for (let mm = config.minMM; mm <= config.maxMM; mm += 1) {
    const x = mmToPx(mm, config);
    const kind = mm % 10 === 0 ? 'cm' : mm % 5 === 0 ? 'mm5' : 'mm';
    const h = kind === 'cm' ? 28 : kind === 'mm5' ? 16 : 9;
    const w = kind === 'cm' ? 2.2 : kind === 'mm5' ? 1.8 : 1.25;
    ticks += `<line x1="${x}" y1="${baselineY}" x2="${x}" y2="${baselineY - h}" stroke="#1e293b" stroke-width="${w}" />`;
    if (mm % 50 === 0) {
      labels += `<text x="${x}" y="29" font-size="16" fill="#1e293b" text-anchor="middle">${mm / 10}${mm === config.maxMM ? 'cm' : ''}</text>`;
    }
  }

  return `<svg viewBox="0 0 ${width} ${height}" xmlns="http://www.w3.org/2000/svg"><line x1="0" y1="${baselineY}" x2="${width - 20}" y2="${baselineY}" stroke="#1e293b" stroke-width="2" />${ticks}${labels}</svg>`;
}

export function renderRulerSVG(userConfig = {}) {
  return renderFallbackSVG(userConfig);
}

export function mountRuler(container, userConfig = {}) {
  const config = { ...RulerConfig, ...userConfig };
  const width = config.maxMM * config.referenceRulerPxPerMM;

  container.innerHTML = `<div class="reference-ruler-wrap"><img class="reference-ruler" src="${config.referenceRulerUrl}" alt="1mm目盛の定規" draggable="false"></div>`;
  const img = container.querySelector('.reference-ruler');
  img.style.width = `${width}px`;
  img.style.height = 'auto';

  img.addEventListener('error', () => {
    container.innerHTML = renderFallbackSVG(config);
  }, { once: true });

  return img;
}
