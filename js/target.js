// target.js
// 的(モンスター)の出現・逃走演出を管理するモジュール。
// 位置計算は ruler.js の mmToPx() を再利用するので、定規の見た目を変えても
// このファイルを触る必要はない。

import { mmToPx } from './ruler.js';
import { ASSETS, withFallback } from './assets.js';

let spawnCount = 0;

// 指定範囲・ステップの中からランダムな長さ(mm)を選んで的を出現させる
export function spawnTarget(container, { minMM, maxMM, stepMM, rulerConfig }) {
  const steps = Math.floor((maxMM - minMM) / stepMM);
  const mm = minMM + stepMM * Math.floor(Math.random() * (steps + 1));

  const el = document.createElement('div');
  el.className = 'target';
  el.style.left = `${mmToPx(mm, rulerConfig)}px`;

  const img = document.createElement('img');
  img.src = ASSETS.targets[spawnCount % ASSETS.targets.length];
  img.alt = 'モンスター';
  withFallback(img, spawnCount);
  el.appendChild(img);
  spawnCount++;

  container.appendChild(el);
  return { mm, el };
}

export function removeTarget(target) {
  target.el.remove();
}

// 逃走演出: 位置(答え)は変えずに、その場でピョンピョン跳ねるだけの見た目アニメーション
export function playEscapeAnimation(target) {
  target.el.classList.add('target-hop');
}
