// main.js
// アプリのエントリーポイント。タイトル画面の表示と、
// HUNT / CHALLENGE60 モードへの切り替えだけを担当する「司令塔」。
// 新しいモード(例: 将来のMEASUREモード)を足すときは、
// 1) xxxx-mode.js を追加
// 2) ここにボタンと呼び出しを1つ足す
// だけで済むようにしてある。

import { startHuntMode } from './hunt-mode.js';
import { startChallengeMode } from './challenge-mode.js';
import { ASSETS, withFallback } from './assets.js';
import { getStats } from './storage.js';

const app = document.getElementById('app');

function showTitle() {
  const stats = getStats();

  app.innerHTML = `
    <div class="title-screen">
      <div class="navi-wrap" id="naviWrap"></div>
      <h1>ものさしハンター</h1>
      <p class="lead">ものさしを使わず、目で見て長さを当てよう!</p>

      <fieldset class="difficulty-select">
        <legend>むずかしさ</legend>
        <label><input type="radio" name="diff" value="easy" checked> 1cm単位(かんたん)</label>
        <label><input type="radio" name="diff" value="hard"> 1mm単位(むずかしい)</label>
      </fieldset>

      <div class="mode-buttons">
        <button id="huntBtn" class="mode-btn">ハントモード</button>
        <button id="challengeBtn" class="mode-btn challenge">チャレンジ60</button>
      </div>

      <p class="stats">
        れんぞく正解さいこう: ${stats.hunt.bestStreak}回 /
        チャレンジさいこうスコア: ${stats.challenge.bestScore}
      </p>
    </div>
  `;

  const naviImg = document.createElement('img');
  naviImg.src = ASSETS.navian.normal;
  naviImg.alt = 'ナビアン';
  withFallback(naviImg, 0);
  app.querySelector('#naviWrap').appendChild(naviImg);

  const getDifficulty = () => app.querySelector('input[name="diff"]:checked').value;

  app.querySelector('#huntBtn').addEventListener('click', () => {
    goToGameScreen((root) => startHuntMode(root, { difficulty: getDifficulty() }));
  });

  app.querySelector('#challengeBtn').addEventListener('click', () => {
    goToGameScreen((root) => startChallengeMode(root, { difficulty: getDifficulty() }));
  });
}

function goToGameScreen(startFn) {
  app.innerHTML = `
    <div id="gameRoot" class="game-root"></div>
    <button id="backBtn" class="back-btn">タイトルへもどる</button>
  `;
  const root = app.querySelector('#gameRoot');
  startFn(root);
  app.querySelector('#backBtn').addEventListener('click', showTitle);
}

showTitle();
