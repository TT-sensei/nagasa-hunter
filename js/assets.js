// assets.js
// ナビアン素材と背景素材の定義。画像はGitHub上の公式素材を直接参照する。

const RAW = 'https://raw.githubusercontent.com/TT-sensei/navi-character-/main/assets/web/fantasy';

const ZAKO = [
  'acorn-leafy.webp',
  'aurora-shell-lizard.webp',
  'autumn-mushroom.webp',
  'berry-leafy.webp',
  'bubblefin-frog.webp',
  'candy-coral-slug.webp',
  'cloud-rain-rabbit.webp',
  'clover-mandragora.webp',
  'cobalt-blade-mantis.webp',
  'cogwheel-beetle.webp'
];

const EVOLVED = ZAKO.map((name) => name.replace('.webp', '-evolved.webp'));

export const ASSETS = {
  navian: {
    normal: './assets/navi/navian_normal.png',
    cheer: './assets/navi/navian_cheer.png'
  },

  // 通常10体＋進化10体の計20体。出題ごとにランダムで1体を表示する。
  targets: [
    ...ZAKO.map((name) => `${RAW}/monsters/zako/${name}`),
    ...EVOLVED.map((name) => `${RAW}/monsters/zako-evolved/${name}`)
  ],

  background: `${RAW}/backgrounds/riverbank.webp`
};

export function withFallback(imgEl, seed = 0) {
  imgEl.addEventListener('error', () => {
    imgEl.replaceWith(makePlaceholder(seed));
  }, { once: true });
  return imgEl;
}

function makePlaceholder(seed) {
  const hue = (seed * 47) % 360;
  const div = document.createElement('div');
  div.className = 'placeholder-monster';
  div.style.background = `hsl(${hue} 70% 60%)`;
  div.textContent = 'ナ';
  return div;
}
