// assets.js
// NAVI CHARACTER (https://github.com/TT-sensei/navi-character-) の
// ナビアン素材・モンスター図鑑素材を利用する前提のアセット定義。
//
// 【使い方】
// navi-character- リポジトリから必要なPNGをダウンロードし、
// 下記のパスに合わせて assets/navi/ , assets/monsters/ に配置してください。
// ANGLE HUNTERと同様、外部CDNには依存せずリポジトリ内に同梱する方針。
//
// 画像がまだ配置されていない場合は自動でSVGプレースホルダーに差し替わるので、
// 素材なしの状態でも見た目確認・動作確認ができます。

export const ASSETS = {
  navian: {
    normal: './assets/navi/navian_normal.png', // タイトル画面: ナビアン(通常ポーズ)
    cheer: './assets/navi/navian_cheer.png'    // 正解時: ナビアンの応援ポーズ
  },

  // モンスター図鑑(ザコ系)から流用する想定。増やすときはここに追加するだけでよい。
  targets: [
    './assets/monsters/zako_01.png',
    './assets/monsters/zako_02.png',
    './assets/monsters/zako_03.png',
    './assets/monsters/zako_evo_01.png'
  ]
};

// 画像読み込みに失敗したら、代わりにモンスター風のSVGプレースホルダーへ差し替える
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
  div.textContent = '👾';
  return div;
}
