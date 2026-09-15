// config.js
// アプリ全体の設定値を1箇所に集約。数値調整はここだけ触ればOK。

export const CONFIG = {
  rulerRangeMM: 200, // 定規の表示範囲(0〜20cm)

  // ANGLE HUNTERの30°/15°刻みに相当する、長さ版の難易度ステップ
  difficulty: {
    easy: { stepMM: 10, label: '1cm単位(かんたん)' }, // 1cm刻みで出題
    hard: { stepMM: 1, label: '1mm単位(むずかしい)' } // 1mm刻みで出題
  },

  challengeSeconds: 60, // チャレンジ60モードの制限時間
  spawnDelayMs: 700,    // ハントモードで正解/不正解後、次の的が出るまでの間

  storageKey: 'monosashi-hunter-stats-v1' // localStorage保存キー
};
