// assets.js
// ナビアン素材と背景素材の定義。画像はGitHub上の公式素材を直接参照する。

const RAW = 'https://raw.githubusercontent.com/TT-sensei/navi-character-/main/assets/web/fantasy';

const NAVIAN_GROUP2 = [
  {
    "id": "hinoko-ember-newt",
    "file": "hinoko-ember-newt.webp",
    "name": "ひのこイモリ",
    "folder": "zako"
  },
  {
    "id": "koro-golem-pebble-golem",
    "file": "koro-golem-pebble-golem.webp",
    "name": "ころゴーレム",
    "folder": "zako"
  },
  {
    "id": "yukimaru-snow-puff",
    "file": "yukimaru-snow-puff.webp",
    "name": "ゆきまるスノーパフ",
    "folder": "zako"
  },
  {
    "id": "forest-puru",
    "file": "forest-puru.webp",
    "name": "森ぷる",
    "folder": "zako"
  },
  {
    "id": "sand-ember-newt",
    "file": "sand-ember-newt.webp",
    "name": "サンドエンバーイモリ",
    "folder": "zako"
  },
  {
    "id": "autumn-mushroom",
    "file": "autumn-mushroom.webp",
    "name": "オータムキノコ",
    "folder": "zako"
  },
  {
    "id": "rainy-bat",
    "file": "rainy-bat.webp",
    "name": "雨ふりバット",
    "folder": "zako"
  },
  {
    "id": "sunstone-golem",
    "file": "sunstone-golem.webp",
    "name": "サンストーンゴーレム",
    "folder": "zako"
  },
  {
    "id": "clover-mandragora",
    "file": "clover-mandragora.webp",
    "name": "クローバーマンドラゴラ",
    "folder": "zako"
  },
  {
    "id": "thunder-spark-fox",
    "file": "thunder-spark-fox.webp",
    "name": "サンダースパークフォックス",
    "folder": "zako"
  },
  {
    "id": "honeycomb-bee",
    "file": "honeycomb-bee.webp",
    "name": "ハニカムビー",
    "folder": "zako"
  },
  {
    "id": "ember-lantern-salamander",
    "file": "ember-lantern-salamander.webp",
    "name": "エンバーランタン・サラマンダー",
    "folder": "zako"
  },
  {
    "id": "puddle-mudling",
    "file": "puddle-mudling.webp",
    "name": "みずたまりマドリン",
    "folder": "zako"
  },
  {
    "id": "peach-puff-panda",
    "file": "peach-puff-panda.webp",
    "name": "ピーチパフパンダ",
    "folder": "zako"
  },
  {
    "id": "honeydrop-bear",
    "file": "honeydrop-bear.webp",
    "name": "ハニードロップベア",
    "folder": "zako"
  },
  {
    "id": "stormhorn-kid",
    "file": "stormhorn-kid.webp",
    "name": "ストームホーンキッド",
    "folder": "zako"
  },
  {
    "id": "ironleaf-panther",
    "file": "ironleaf-panther.webp",
    "name": "アイアンリーフパンサー",
    "folder": "zako"
  },
  {
    "id": "duskblade-fox",
    "file": "duskblade-fox.webp",
    "name": "ダスクブレードフォックス",
    "folder": "zako"
  },
  {
    "id": "aurora-shell-lizard",
    "file": "aurora-shell-lizard.webp",
    "name": "オーロラシェルリザード",
    "folder": "zako"
  },
  {
    "id": "hollow-hat-scarecrow",
    "file": "hollow-hat-scarecrow.webp",
    "name": "ホロウハットかかし",
    "folder": "zako"
  },
  {
    "id": "shadow-puppet-cat",
    "file": "shadow-puppet-cat.webp",
    "name": "シャドウあやつりネコ",
    "folder": "zako"
  },
  {
    "id": "cogwheel-beetle",
    "file": "cogwheel-beetle.webp",
    "name": "コグホイール甲虫",
    "folder": "zako"
  },
  {
    "id": "violet-reef-seahorse",
    "file": "violet-reef-seahorse.webp",
    "name": "ヴァイオレットリーフタツノオトシゴ",
    "folder": "zako"
  },
  {
    "id": "rivet-bloom-beetle",
    "file": "rivet-bloom-beetle.webp",
    "name": "リベットブルーム甲虫",
    "folder": "zako"
  }
];
const EVONAVI_GROUP2 = [
  {
    "id": "hinoko-ember-newt-evolved",
    "file": "hinoko-ember-newt-evolved.webp",
    "name": "ひのこイモリ・エボル",
    "folder": "zako-evolved"
  },
  {
    "id": "koro-golem-pebble-golem-evolved",
    "file": "koro-golem-pebble-golem-evolved.webp",
    "name": "ころゴーレム・エボル",
    "folder": "zako-evolved"
  },
  {
    "id": "yukimaru-snow-puff-evolved",
    "file": "yukimaru-snow-puff-evolved.webp",
    "name": "ゆきまるスノーパフ・エボル",
    "folder": "zako-evolved"
  },
  {
    "id": "forest-puru-evolved",
    "file": "forest-puru-evolved.webp",
    "name": "森ぷる・エボル",
    "folder": "zako-evolved"
  },
  {
    "id": "sand-ember-newt-evolved",
    "file": "sand-ember-newt-evolved.webp",
    "name": "サンドエンバーイモリ・エボル",
    "folder": "zako-evolved"
  },
  {
    "id": "autumn-mushroom-evolved",
    "file": "autumn-mushroom-evolved.webp",
    "name": "オータムキノコ・エボル",
    "folder": "zako-evolved"
  },
  {
    "id": "rainy-bat-evolved",
    "file": "rainy-bat-evolved.webp",
    "name": "雨ふりバット・エボル",
    "folder": "zako-evolved"
  },
  {
    "id": "sunstone-golem-evolved",
    "file": "sunstone-golem-evolved.webp",
    "name": "サンストーンゴーレム・エボル",
    "folder": "zako-evolved"
  },
  {
    "id": "clover-mandragora-evolved",
    "file": "clover-mandragora-evolved.webp",
    "name": "クローバーマンドラゴラ・エボル",
    "folder": "zako-evolved"
  },
  {
    "id": "thunder-spark-fox-evolved",
    "file": "thunder-spark-fox-evolved.webp",
    "name": "サンダースパークフォックス・エボル",
    "folder": "zako-evolved"
  },
  {
    "id": "honeycomb-bee-evolved",
    "file": "honeycomb-bee-evolved.webp",
    "name": "ハニカムビー・エボル",
    "folder": "zako-evolved"
  },
  {
    "id": "ember-lantern-salamander-evolved",
    "file": "ember-lantern-salamander-evolved.webp",
    "name": "エンバーランタン・サラマンダー・エボル",
    "folder": "zako-evolved"
  },
  {
    "id": "puddle-mudling-evolved",
    "file": "puddle-mudling-evolved.webp",
    "name": "みずたまりマドリン・エボル",
    "folder": "zako-evolved"
  },
  {
    "id": "cogwheel-beetle-evolved",
    "file": "cogwheel-beetle-evolved.webp",
    "name": "コグホイール甲虫・エボル",
    "folder": "zako-evolved"
  },
  {
    "id": "duskblade-fox-evolved",
    "file": "duskblade-fox-evolved.webp",
    "name": "ダスクブレードフォックス・エボル",
    "folder": "zako-evolved"
  },
  {
    "id": "hollow-hat-scarecrow-evolved",
    "file": "hollow-hat-scarecrow-evolved.webp",
    "name": "ホロウハットかかし・エボル",
    "folder": "zako-evolved"
  },
  {
    "id": "honeydrop-bear-evolved",
    "file": "honeydrop-bear-evolved.webp",
    "name": "ハニードロップベア・エボル",
    "folder": "zako-evolved"
  },
  {
    "id": "ironleaf-panther-evolved",
    "file": "ironleaf-panther-evolved.webp",
    "name": "アイアンリーフパンサー・エボル",
    "folder": "zako-evolved"
  },
  {
    "id": "peach-puff-panda-evolved",
    "file": "peach-puff-panda-evolved.webp",
    "name": "ピーチパフパンダ・エボル",
    "folder": "zako-evolved"
  },
  {
    "id": "shadow-puppet-cat-evolved",
    "file": "shadow-puppet-cat-evolved.webp",
    "name": "シャドウあやつりネコ・エボル",
    "folder": "zako-evolved"
  },
  {
    "id": "stormhorn-kid-evolved",
    "file": "stormhorn-kid-evolved.webp",
    "name": "ストームホーンキッド・エボル",
    "folder": "zako-evolved"
  },
  {
    "id": "violet-reef-seahorse-evolved",
    "file": "violet-reef-seahorse-evolved.webp",
    "name": "ヴァイオレットリーフタツノオトシゴ・エボル",
    "folder": "zako-evolved"
  },
  {
    "id": "aurora-shell-lizard-evolved",
    "file": "aurora-shell-lizard-evolved.webp",
    "name": "オーロラシェルリザード・エボル",
    "folder": "zako-evolved"
  },
  {
    "id": "rivet-bloom-beetle-evolved",
    "file": "rivet-bloom-beetle-evolved.webp",
    "name": "リベットブルーム甲虫・エボル",
    "folder": "zako-evolved"
  }
];
const BOSS_GROUP2 = [
  {
    "id": "bakuretsu-boar",
    "file": "bakuretsu-boar.webp",
    "name": "👑ばくれつイノシシ",
    "folder": "boss"
  },
  {
    "id": "thunder-griffon",
    "file": "thunder-griffon.webp",
    "name": "👑サンダーグリフォン",
    "folder": "boss"
  },
  {
    "id": "berry-boar-king",
    "file": "berry-boar-king.webp",
    "name": "👑ベリーイノシシキング",
    "folder": "boss"
  },
  {
    "id": "solar-griffon-king",
    "file": "solar-griffon-king.webp",
    "name": "👑太陽グリフォンキング",
    "folder": "boss"
  },
  {
    "id": "dream-cat-mage",
    "file": "dream-cat-mage.webp",
    "name": "👑夢見ネコメイジ",
    "folder": "boss"
  },
  {
    "id": "sky-ruin-griffon",
    "file": "sky-ruin-griffon.webp",
    "name": "👑スカイ遺跡グリフォン",
    "folder": "boss"
  },
  {
    "id": "flare-leo",
    "file": "flare-leo.webp",
    "name": "👑フレアレオ",
    "folder": "boss"
  },
  {
    "id": "frost-crystal-lion",
    "file": "frost-crystal-lion.webp",
    "name": "👑フロストクリスタルライオン",
    "folder": "boss"
  },
  {
    "id": "coral-tide-serpent",
    "file": "coral-tide-serpent.webp",
    "name": "👑コーラルタイドサーペント",
    "folder": "boss"
  },
  {
    "id": "amber-dune-scarab",
    "file": "amber-dune-scarab.webp",
    "name": "👑アンバー砂丘スカラベ",
    "folder": "boss"
  },
  {
    "id": "abyssal-mirror-leviathan",
    "file": "abyssal-mirror-leviathan.webp",
    "name": "👑深海ミラーリヴァイアサン",
    "folder": "boss"
  },
  {
    "id": "obsidian-comet-wyvern",
    "file": "obsidian-comet-wyvern.webp",
    "name": "👑黒曜コメットワイバーン",
    "folder": "boss"
  },
  {
    "id": "magitech-gear-dragon",
    "file": "magitech-gear-dragon.webp",
    "name": "👑マギテック・ギアドラゴン",
    "folder": "boss"
  }
];

const toTarget = (item) => `${RAW}/monsters/${item.folder}/${item.file}`;

export const ASSETS = {
  navian: { normal: './assets/navi/navian_normal.png', cheer: './assets/navi/navian_cheer.png' },
  targets: {
    navian: NAVIAN_GROUP2.map(toTarget),
    evolved: EVONAVI_GROUP2.map(toTarget),
    boss: BOSS_GROUP2.map(toTarget)
  },
  collection: [...NAVIAN_GROUP2, ...EVONAVI_GROUP2, ...BOSS_GROUP2],
  background: `${RAW}/backgrounds/riverbank.webp`
};

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
  div.textContent = 'ナ';
  return div;
}
