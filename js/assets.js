// assets.js
// ナビアン素材と背景素材の定義。外部CDNには依存しない。

export const ASSETS = {
  navian: {
    normal: './assets/navi/navian_normal.png',
    cheer: './assets/navi/navian_cheer.png'
  },

  // ナビアン20種。リポジトリ内に同名ファイルを配置する想定。
  targets: Array.from({ length: 20 }, (_, i) => `./assets/navian/navian_${String(i + 1).padStart(2, '0')}.png`),

  background: './assets/backgrounds/riverbank.webp'
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
