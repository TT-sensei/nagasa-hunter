// game-core.js
// HUNTモード・CHALLENGE60モードの両方が使う共通ロジック。
// 「正解判定」と「回答位置の可視化」だけに責任を絞ってあるので、
// 新しいモード(例: MEASUREモード)を追加するときもこのファイルをそのまま使い回せる。

import { mmToPx } from './ruler.js';

// 誤差の許容なし。ぴったり一致のみ正解(デジタルなので0が常に揃うため)
export function judge(guessMM, targetMM) {
  return guessMM === targetMM;
}

// 回答位置を定規上にマーカー表示する。
// 不正解のときは「自分が答えた位置」と「本当の位置」のズレが目で見てわかる。
export function showGuessMarker(rulerContainer, guessMM, rulerConfig, correct) {
  const marker = document.createElement('div');
  marker.className = correct ? 'guess-marker correct' : 'guess-marker wrong';
  marker.style.left = `${mmToPx(guessMM, rulerConfig)}px`;
  rulerContainer.appendChild(marker);
  setTimeout(() => marker.remove(), 900);
}
