// ものさしハンター / edu-kit設計版
import { startMeasureMode } from './measure-mode.js';
import { startDragMode } from './drag-mode.js';
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
  const savedSlant = Number(preferences.slant) === 1 ? 1 : 0;
  app.innerHTML = `<div class="edu-container edu-main hunter-home">
    <header class="home-header"><div><div class="home-kicker">MONOSASHI HUNTER</div><h1 class="edu-page-title">ものさしハンター</h1><p class="edu-page-lead">目盛を読んで、ものさしを当てて。逃げたナビアンをつかまえよう。</p></div><div class="edu-stat home-record"><div class="edu-stat-label">最高れんぞく正解</div><div class="edu-stat-value">${stats.bestStreak}<span>回</span></div></div></header>
    <section class="mode-picker edu-card edu-card-pad" aria-labelledby="modeTitle"><div class="mode-picker-head"><div><h2 id="modeTitle" class="edu-card-title">どこまで読めるかな？</h2><p class="edu-card-meta">目盛の読み方を選びます。「つかまえよう」と「読むれんしゅう」の、どちらにも使う設定です。</p></div><span class="edu-badge edu-badge-neutral">共通</span></div>
      <div class="mode-grid">${MODES.map((mode) => `<button type="button" class="mode-card ${mode.key === savedMode ? 'is-selected' : ''}" data-mode="${mode.key}"><span class="mode-card-level">レベル${mode.level}</span><span class="mode-card-title">${mode.title}</span><span class="mode-card-example">${mode.example}</span><span class="mode-card-note">${mode.description}</span></button>`).join('')}</div>
    </section>
    <section class="escape-card"><img class="escape-img" src="${ASSETS.targets.navian[1]}" alt="" onerror="this.style.display='none'"><div class="escape-copy"><div class="panel-kicker">あてて はかる</div><h2>にげたナビアンを つかまえよう</h2><p>ナビアンが逃げちゃった！ ものさしを指で動かして、0の目盛をはじまりに合わせよう。長さを正しく読めると、つかまえられます。選んだレベル（目盛の読み方）で遊びます。</p><div class="level-picker slant-picker"><div class="level-picker-head"><h3>線のむき</h3><span>斜めの線も出す？</span></div><div class="level-grid"><button type="button" class="level-card slant-card ${savedSlant === 0 ? 'is-selected' : ''}" data-slant="0"><strong>まっすぐだけ</strong><span>いままでの線</span></button><button type="button" class="level-card slant-card ${savedSlant === 1 ? 'is-selected' : ''}" data-slant="1"><strong>斜めも</strong><span>ものさしを回して当てる</span></button></div></div></div><button type="button" id="dragBtn" class="edu-btn edu-btn-primary escape-start">つかまえにいく</button></section>
    <section class="mode-picker edu-card edu-card-pad" aria-labelledby="readTitle"><div class="mode-picker-head"><div><h2 id="readTitle" class="edu-card-title">読むれんしゅう</h2><p class="edu-card-meta">ものさしは置いてあります。目盛を読む練習です。</p></div><span class="edu-badge edu-badge-neutral">れんしゅう</span></div>
      <div class="level-picker level-picker-first"><div class="level-picker-head"><h3>はじまりの位置</h3><span>どちらから読めるかな？</span></div><div class="level-grid"><button type="button" class="level-card ${savedStartPosition === 1 ? 'is-selected' : ''}" data-level="1"><strong>0から</strong><span>ものさしの0から始まる</span></button><button type="button" class="level-card ${savedStartPosition === 2 ? 'is-selected' : ''}" data-level="2"><strong>とちゅうから</strong><span>0ではないところから始まる</span></button></div></div>
      <button type="button" id="startBtn" class="edu-btn edu-btn-primary edu-btn-block start-action">読むれんしゅうをはじめる</button>
      <div class="navian-feature-grid"><button type="button" class="feature-card" id="timeBtn"><span class="feature-card-title">タイム制　60秒</span><span class="feature-card-note">60秒で何問正解できる？ 長さを読んでどんどん答えよう。</span></button><button type="button" class="feature-card" id="bookBtn"><span class="feature-card-title">ナビアン図鑑</span><span class="feature-card-note">出会ったナビアンを一覧で見よう。つかまえた数も記録。</span></button></div>
    </section>
<section class="home-tip edu-note"><div class="edu-note-title">読むポイント</div><p>はじまりの位置を見つけ、おわりの位置を読む。とちゅうから始まるときは、2つの位置の差を考えます。</p></section></div>`;
  let selectedMode = savedMode, selectedStartPosition = savedStartPosition, selectedSlant = savedSlant;
  app.querySelectorAll('.mode-card').forEach((button) => button.addEventListener('click', () => { app.querySelectorAll('.mode-card').forEach((item) => item.classList.remove('is-selected')); button.classList.add('is-selected'); selectedMode = button.dataset.mode; savePreferences({ mode: selectedMode }); }));
  app.querySelectorAll('.level-picker-first .level-card').forEach((button) => button.addEventListener('click', () => { app.querySelectorAll('.level-picker-first .level-card').forEach((item) => item.classList.remove('is-selected')); button.classList.add('is-selected'); selectedStartPosition = Number(button.dataset.level); savePreferences({ startPosition: selectedStartPosition }); }));
  app.querySelectorAll('.slant-card').forEach((button) => button.addEventListener('click', () => { app.querySelectorAll('.slant-card').forEach((item) => item.classList.remove('is-selected')); button.classList.add('is-selected'); selectedSlant = Number(button.dataset.slant); savePreferences({ slant: selectedSlant }); }));
  app.querySelector('#startBtn').addEventListener('click', async () => { await unlockSound(); playSound('start', 0.16); startGame(selectedMode, selectedStartPosition); });
  app.querySelector('#dragBtn').addEventListener('click', async () => { await unlockSound(); playSound('start', 0.16); startDragGame(selectedMode, selectedSlant); });
  app.querySelector('#timeBtn').addEventListener('click', async () => { await unlockSound(); playSound('start', 0.16); startGame(selectedMode, selectedStartPosition, { timed: true }); });
  app.querySelector('#bookBtn').addEventListener('click', showBook);
}

function startGame(mode, startPosition, options = {}) {
  app.innerHTML = '<div class="edu-container edu-main game-page"><div id="gameRoot"></div></div>';
  const root = app.querySelector('#gameRoot');
  startMeasureMode(root, { mode, startPosition, ...options });
  attachNavianCollection(root);
}

function startDragGame(mode, slant) {
  app.innerHTML = '<div class="edu-container edu-main game-page"><div id="gameRoot"></div></div>';
  const root = app.querySelector('#gameRoot');
  startDragMode(root, { mode, slant: slant === 1 });
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
  const bookTier = Math.min(5, Math.floor(gotCount / 10));
  app.innerHTML = `<div class="edu-container edu-main book-page book-tier-${bookTier}"><div class="book-head"><div><div class="home-kicker">NAVIANS</div><h2>ナビアン図鑑</h2><p class="edu-page-lead">出会ったナビアンを集めよう。 ${gotCount} / ${all.length}</p></div><button id="bookBack" class="edu-btn edu-btn-secondary">タイトル</button></div><div class="book-grid">${all.map(({file,name,folder}) => { const count=Number(gets[file])||0; const locked=count===0; return `<article class="navian-card ${count?'is-new':''} ${locked?'is-locked':''}"><div class="navian-card-img">${locked ? `<div class="navian-locked" aria-label="まだ出会っていない"><img src="${NAV_BASE}${folder}/${file}" alt="" aria-hidden="true"><span>？？？</span></div>` : `<img src="${NAV_BASE}${folder}/${file}" alt="${name}">`}</div><div class="navian-card-body"><span class="navian-card-mark">ナビアン</span><div class="navian-card-name">${locked?'？？？':name}</div><div class="navian-card-count">${count ? `出会った ${count}回` : 'まだ出会っていない'}</div></div></article>`; }).join('')}</div></div>`;
  app.querySelector('#bookBack').addEventListener('click', showTitle);
}
showTitle();