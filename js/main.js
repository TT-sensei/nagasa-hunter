// ものさしハンター / edu-kit設計版
import { startMeasureMode } from './measure-mode.js';
import { getStats, getPreferences, savePreferences } from './storage.js';

const app = document.getElementById('app');

const MODES = [
  { key: 'cm', title: 'cmまで', description: '1cmごとの目盛を読む', example: '□ cm' },
  { key: 'mm', title: 'cmとmmまで', description: '1mmの目盛まで読んで表す', example: '□ cm □ mm' },
  { key: 'decimal', title: '小数で表す', description: '1mmを0.1cmとして表す', example: '□.□ cm' }
];

function showTitle() {
  const stats = getStats();
  const preferences = getPreferences();
  const savedMode = MODES.some((mode) => mode.key === preferences.mode) ? preferences.mode : 'cm';
  const savedLevel = Number(preferences.level) === 2 ? 2 : 1;
  const activeMode = MODES.find((mode) => mode.key === savedMode) || MODES[0];

  app.innerHTML = `
    <div class="edu-container edu-main hunter-home">
      <header class="home-header">
        <div>
          <div class="home-kicker">MONOSASHI HUNTER</div>
          <h1 class="edu-page-title">長さを読もう</h1>
          <p class="edu-page-lead">ものさしの目盛を見て、はじまりからおわりまでの長さを読もう。</p>
        </div>
        <div class="edu-stat home-record" aria-label="これまでの記録">
          <div class="edu-stat-label">最高れんぞく正解</div>
          <div class="edu-stat-value">${stats.bestStreak}<span>回</span></div>
        </div>
      </header>

      <section class="mode-picker edu-card edu-card-pad" aria-labelledby="modeTitle">
        <div class="mode-picker-head">
          <div>
            <h2 id="modeTitle" class="edu-card-title">どこまで読めるかな？</h2>
            <p class="edu-card-meta">目盛の読み方を選びます。</p>
          </div>
          <span class="edu-badge edu-badge-neutral">れんしゅう</span>
        </div>
        <div class="mode-grid">
          ${MODES.map((mode) => `
            <button type="button" class="mode-card ${mode.key === savedMode ? 'is-selected' : ''}" data-mode="${mode.key}">
              <span class="mode-card-title">${mode.title}</span>
              <span class="mode-card-example">${mode.example}</span>
              <span class="mode-card-note">${mode.description}</span>
            </button>
          `).join('')}
        </div>

        <div class="level-picker">
          <div class="level-picker-head">
            <h3>はじまりの位置</h3>
            <span>どちらから読めるかな？</span>
          </div>
          <div class="level-grid">
            <button type="button" class="level-card ${savedLevel === 1 ? 'is-selected' : ''}" data-level="1">
              <strong>0から</strong><span>ものさしの0から始まる</span>
            </button>
            <button type="button" class="level-card ${savedLevel === 2 ? 'is-selected' : ''}" data-level="2">
              <strong>とちゅうから</strong><span>0ではないところから始まる</span>
            </button>
          </div>
        </div>

        <button type="button" id="startBtn" class="edu-btn edu-btn-primary edu-btn-block start-action">れんしゅうをはじめる</button>
      </section>

      <section class="home-tip edu-note" aria-label="読み方のポイント">
        <div class="edu-note-title">読むポイント</div>
        <p>はじまりの位置を見つけ、おわりの位置を読む。とちゅうから始まるときは、2つの位置の差を考えます。</p>
      </section>
    </div>
  `;

  let selectedMode = savedMode;
  let selectedLevel = savedLevel;

  app.querySelectorAll('.mode-card').forEach((button) => {
    button.addEventListener('click', () => {
      app.querySelectorAll('.mode-card').forEach((item) => item.classList.remove('is-selected'));
      button.classList.add('is-selected');
      selectedMode = button.dataset.mode;
      savePreferences({ mode: selectedMode });
    });
  });

  app.querySelectorAll('.level-card').forEach((button) => {
    button.addEventListener('click', () => {
      app.querySelectorAll('.level-card').forEach((item) => item.classList.remove('is-selected'));
      button.classList.add('is-selected');
      selectedLevel = Number(button.dataset.level);
      savePreferences({ level: selectedLevel });
    });
  });

  app.querySelector('#startBtn').addEventListener('click', () => startGame(selectedMode, selectedLevel));
}

function startGame(mode, level) {
  app.innerHTML = `
    <div class="edu-container edu-main game-page">
      <div id="gameRoot"></div>
    </div>
  `;
  startMeasureMode(app.querySelector('#gameRoot'), { mode, level });
}

showTitle();
