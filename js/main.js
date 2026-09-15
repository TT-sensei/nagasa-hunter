// ものさしハンター / edu-kit設計版
import { startMeasureMode } from './measure-mode.js';
import { getStats } from './storage.js';

const app = document.getElementById('app');

const MODES = [
  { key: 'cm', title: 'cmまで', description: '1cmごとの目盛を読む', example: '□ cm', color: 'primary' },
  { key: 'mm', title: 'cmとmmまで', description: '1mmの目盛まで読んで表す', example: '□ cm □ mm', color: 'accent' },
  { key: 'decimal', title: '小数で表す', description: '1mmを0.1cmとして表す', example: '□.□ cm', color: 'success' }
];

function showTitle() {
  const stats = getStats();
  const savedMode = localStorage.getItem('nagasa-hunter-mode') || 'cm';
  const activeMode = MODES.some((mode) => mode.key === savedMode) ? savedMode : 'cm';

  app.innerHTML = `
    <div class="edu-container edu-main hunter-home">
      <header class="home-header">
        <div>
          <div class="home-kicker">MONOSASHI HUNTER</div>
          <h1 class="edu-page-title">長さを読もう</h1>
          <p class="edu-page-lead">ものさしの目盛を見て、長さを答えます。</p>
        </div>
        <div class="edu-stat home-record" aria-label="これまでの記録">
          <div class="edu-stat-label">最高れんぞく正解</div>
          <div class="edu-stat-value">${stats.hunt.bestStreak}<span>回</span></div>
        </div>
      </header>

      <section class="mode-picker edu-card edu-card-pad" aria-labelledby="modeTitle">
        <div class="mode-picker-head">
          <div>
            <h2 id="modeTitle" class="edu-card-title">どこまで読めるかな？</h2>
            <p class="edu-card-meta">今の学習に合うものを選びます。</p>
          </div>
          <span class="edu-badge edu-badge-neutral">れんしゅう</span>
        </div>
        <div class="mode-grid">
          ${MODES.map((mode) => `
            <button type="button" class="mode-card ${mode.key === activeMode ? 'is-selected' : ''}" data-mode="${mode.key}">
              <span class="mode-card-title">${mode.title}</span>
              <span class="mode-card-example">${mode.example}</span>
              <span class="mode-card-note">${mode.description}</span>
            </button>
          `).join('')}
        </div>
        <button type="button" id="startBtn" class="edu-btn edu-btn-primary edu-btn-block start-action">このコースをはじめる</button>
      </section>

      <section class="home-tip edu-note" aria-label="読み方のポイント">
        <div class="edu-note-title">読むポイント</div>
        <p>はじまりとおわりの位置を見て、その間の長さを読みます。0から始まらない問題も出ます。</p>
      </section>
    </div>
  `;

  let selectedMode = activeMode;
  app.querySelectorAll('.mode-card').forEach((button) => {
    button.addEventListener('click', () => {
      app.querySelectorAll('.mode-card').forEach((item) => item.classList.remove('is-selected'));
      button.classList.add('is-selected');
      selectedMode = button.dataset.mode;
      localStorage.setItem('nagasa-hunter-mode', selectedMode);
    });
  });

  app.querySelector('#startBtn').addEventListener('click', () => startGame(selectedMode));
}

function startGame(mode) {
  app.innerHTML = `
    <div class="edu-container edu-main game-page">
      <div id="gameRoot"></div>
    </div>
  `;
  startMeasureMode(app.querySelector('#gameRoot'), { mode });
}

showTitle();
