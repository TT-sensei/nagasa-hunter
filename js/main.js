// main.js
// 長さハンターのタイトル画面と、3モード×2レベルの切り替えを担当。

import { startMeasureMode } from './measure-mode.js';
import { ASSETS, withFallback } from './assets.js';
import { getStats } from './storage.js';

const app = document.getElementById('app');

const MODES = [
  { key: 'cm', title: 'CMのみ', description: 'cmの目盛だけで答える' },
  { key: 'mm', title: 'MMあり', description: '5mmの目盛を使い、cm＋mmで答える' },
  { key: 'decimal', title: '小数で答える', description: 'mmまで読み、cmの小数で答える' }
];

function showTitle() {
  const stats = getStats();
  app.innerHTML = `
    <div class="title-screen">
      <div class="navi-wrap" id="naviWrap"></div>
      <h1>長さハンター</h1>
      <p class="lead">目盛を読んで、ナビアンとの長さ勝負！</p>

      <div class="select-panel">
        <div class="select-title">モードを選ぶ</div>
        <div class="mode-buttons">
          ${MODES.map((mode, i) => `
            <button type="button" class="mode-btn ${i === 0 ? 'selected' : ''}" data-mode="${mode.key}">
              <span>${mode.title}</span><small>${mode.description}</small>
            </button>
          `).join('')}
        </div>

        <div class="select-title">レベルを選ぶ</div>
        <div class="level-buttons">
          <button type="button" class="level-btn selected" data-level="1">レベル1<small>0から</small></button>
          <button type="button" class="level-btn" data-level="2">レベル2<small>とちゅうから</small></button>
        </div>

        <button type="button" id="startBtn" class="start-btn">はじめる！</button>
      </div>

      <p class="stats">れんぞく正解さいこう: ${stats.hunt.bestStreak}回</p>
    </div>
  `;

  const naviImg = document.createElement('img');
  naviImg.src = ASSETS.navian.normal;
  naviImg.alt = 'ナビアン';
  withFallback(naviImg, 0);
  app.querySelector('#naviWrap').appendChild(naviImg);

  let selectedMode = 'cm';
  let selectedLevel = 1;

  app.querySelectorAll('.mode-btn').forEach((btn) => {
    btn.addEventListener('click', () => {
      app.querySelectorAll('.mode-btn').forEach((b) => b.classList.remove('selected'));
      btn.classList.add('selected');
      selectedMode = btn.dataset.mode;
    });
  });

  app.querySelectorAll('.level-btn').forEach((btn) => {
    btn.addEventListener('click', () => {
      app.querySelectorAll('.level-btn').forEach((b) => b.classList.remove('selected'));
      btn.classList.add('selected');
      selectedLevel = Number(btn.dataset.level);
    });
  });

  app.querySelector('#startBtn').addEventListener('click', () => startGame(selectedMode, selectedLevel));
}

function startGame(mode, level) {
  app.innerHTML = `
    <div id="gameRoot" class="game-root"></div>
    <button id="backBtn" class="back-btn">タイトルへもどる</button>
  `;
  startMeasureMode(app.querySelector('#gameRoot'), { mode, level });
  app.querySelector('#backBtn').addEventListener('click', showTitle);
}

showTitle();
