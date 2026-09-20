// ものさしハンター / edu-kit設計版
import { startMeasureMode } from './measure-mode.js';
import { getStats, getPreferences, savePreferences } from './storage.js';
import { ASSETS } from './assets.js';
import { playSound, unlockSound } from './sound.js';

const app = document.getElementById('app');
const MODES = [
  { key: 'cm', level: 1, title: 'cmまで', description: '1cmごとの目盛を読む', example: '□ cm' },
  { key: 'mm', level: 2, title: 'cmとmmまで', description: '1mmの目盛まで読んで表す', example: '□ cm □ mm' },
  { key: 'decimal', level: 3, title: '小数で表す', description: '1mmを0.1cmとして表す', example: '□.□ cm' }
];
const COLLECTION = ASSETS.collection;
const NAV_BASE = 'https://raw.githubusercontent.com/TT-sensei/navi-character-/main/assets/web/fantasy/monsters/';

function showTitle() {
  const stats = getStats();
  const preferences = getPreferences();
  const savedMode = MODES.some((mode) => mode.key === preferences.mode) ? preferences.mode : 'cm';
  const savedStartPosition = Number(preferences.startPosition ?? preferences.level) === 2 ? 2 : 1;
  app.innerHTML = `<div class="edu-container edu-main hunter-home">
    <header class="home-header"><div><div class="home-kicker">MONOSASHI HUNTER</div><h1 class="edu-page-title">長さを読もう</h1><p class="edu-page-lead">ものさしの目盛を見て、はじまりからおわりまでの長さを読もう。</p></div><div class="edu-stat home-record"><div class="edu-stat-label">最高れんぞく正解</div><div class="edu-stat-value">${stats.bestStreak}<span>回</span></div></div></header>
    <section class="mode-picker edu-card edu-card-pad" aria-labelledby="modeTitle"><div class="mode-picker-head"><div><h2 id="modeTitle" class="edu-card-title">どこまで読めるかな？</h2><p class="edu-card-meta">目盛の読み方を選びます。</p></div><span class="edu-badge edu-badge-neutral">れんしゅう</span></div>
      <div class="mode-grid">${MODES.map((mode) => `<button type="button" class="mode-card ${mode.key === savedMode ? 'is-selected' : ''}" data-mode="${mode.key}"><span class="mode-card-level">レベル${mode.level}</span><span class="mode-card-title">${mode.title}</span><span class="mode-card-example">${mode.example}</span><span class="mode-card-note">${mode.description}</span></button>`).join('')}</div>
      <div class="level-picker"><div class="level-picker-head"><h3>はじまりの位置</h3><span>どちらから読めるかな？</span></div><div class="level-grid"><button type="button" class="level-card ${savedStartPosition === 1 ? 'is-selected' : ''}" data-level="1"><strong>0から</strong><span>ものさしの0から始まる</span></button><button type="button" class="level-card ${savedStartPosition === 2 ? 'is-selected' : ''}" data-level="2"><strong>とちゅうから</strong><span>0ではないところから始まる</span></button></div></div>
      <button type="button" id="startBtn" class="edu-btn edu-btn-primary edu-btn-block start-action">れんしゅうをはじめる</button>
      <div class="navian-feature-grid"><button type="button" class="feature-card" id="timeBtn"><span class="feature-card-title">タイム制　60秒</span><span class="feature-card-note">60秒で何問正解できる？ 長さを読んでどんどん答えよう。</span></button><button type="button" class="feature-card" id="bookBtn"><span class="feature-card-title">ナビアン図鑑</span><span class="feature-card-note">出会ったナビアンを一覧で見よう。つかまえた数も記録。</span></button></div>
    </section><section class="home-tip edu-note"><div class="edu-note-title">読むポイント</div><p>はじまりの位置を見つけ、おわりの位置を読む。とちゅうから始まるときは、2つの位置の差を考えます。</p></section></div>`;
  let selectedMode = savedMode, selectedStartPosition = savedStartPosition;
  app.querySelectorAll('.mode-card').forEach((button) => button.addEventListener('click', () => { app.querySelectorAll('.mode-card').forEach((item) => item.classList.remove('is-selected')); button.classList.add('is-selected'); selectedMode = button.dataset.mode; savePreferences({ mode: selectedMode }); }));
  app.querySelectorAll('.level-card').forEach((button) => button.addEventListener('click', () => { app.querySelectorAll('.level-card').forEach((item) => item.classList.remove('is-selected')); button.classList.add('is-selected'); selectedStartPosition = Number(button.dataset.level); savePreferences({ startPosition: selectedStartPosition }); }));
  app.querySelector('#startBtn').addEventListener('click', async () => { await unlockSound(); playSound('start', 0.16); startGame(selectedMode, selectedStartPosition); });
  app.querySelector('#timeBtn').addEventListener('click', async () => { await unlockSound(); playSound('start', 0.16); startGame(selectedMode, selectedStartPosition, { timed: true }); });
  app.querySelector('#bookBtn').addEventListener('click', showBook);
}

function startGame(mode, startPosition, options = {}) {
  app.innerHTML = '<div class="edu-container edu-main game-page"><div id="gameRoot"></div></div>';
  const root = app.querySelector('#gameRoot');
  startMeasureMode(root, { mode, startPosition, ...options });
  attachNavianCollection(root);
}

function attachNavianCollection(root) {
  root.querySelector('#guessForm')?.addEventListener('submit', () => {
    setTimeout(() => {
      const result = root.querySelector('#result');
      const img = root.querySelector('#stage .target img');
      if (!result || !img || !result.classList.contains('is-correct')) return;
      const file = (img.src || '').split('/').pop();
      if (!file) return;
      const key = 'nagasa-hunter.navianGets.v1';
      const gets = JSON.parse(localStorage.getItem(key) || '{}');
      gets[file] = (Number(gets[file]) || 0) + 1;
      localStorage.setItem(key, JSON.stringify(gets));
    }, 40);
  });
}

function showBook() {
  const gets = JSON.parse(localStorage.getItem('nagasa-hunter.navianGets.v1') || '{}');
  const all = COLLECTION;
  const gotCount = all.filter(({ file }) => Number(gets[file]) > 0).length;
  app.innerHTML = `<div class="edu-container edu-main book-page"><div class="book-head"><div><div class="home-kicker">NAVIANS</div><h2>ナビアン図鑑</h2><p class="edu-page-lead">出会ったナビアンを集めよう。 ${gotCount} / ${all.length}</p></div><button id="bookBack" class="edu-btn edu-btn-secondary">タイトル</button></div><div class="book-grid">${all.map(({file,name,folder}) => { const count=Number(gets[file])||0; const locked=count===0; return `<article class="navian-card ${count?'is-new':''} ${locked?'is-locked':''}"><div class="navian-card-img">${locked ? `<div class="navian-locked" aria-label="まだ出会っていない"><img src="${NAV_BASE}${folder}/${file}" alt="" aria-hidden="true"><span>？？？</span></div>` : `<img src="${NAV_BASE}${folder}/${file}" alt="${name}">`}</div><div class="navian-card-body"><span class="navian-card-mark">ナビアン</span><div class="navian-card-name">${locked?'？？？':name}</div><div class="navian-card-count">${count ? `出会った ${count}回` : 'まだ出会っていない'}</div></div></article>`; }).join('')}</div></div>`;
  app.querySelector('#bookBack').addEventListener('click', showTitle);
}
showTitle();