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

// つかまえようモードと図鑑のための、通常ナビアン全種（catalogのzako全種）。
// 名前・IDは navi-character- のcatalogと1mon-1touのモンスターデータに合わせる。
const ZAKO_ALL = [
  {"id": "happa-squirrel-leafy", "file": "happa-squirrel-leafy.webp", "name": "はっぱリス", "folder": "zako"},
  {"id": "hinoko-ember-newt", "file": "hinoko-ember-newt.webp", "name": "ひのこイモリ", "folder": "zako"},
  {"id": "kinoko-apple-mushroom", "file": "kinoko-apple-mushroom.webp", "name": "りんごキノコ", "folder": "zako"},
  {"id": "komorin-little-night-bat", "file": "komorin-little-night-bat.webp", "name": "こもりんナイトバット", "folder": "zako"},
  {"id": "koro-golem-pebble-golem", "file": "koro-golem-pebble-golem.webp", "name": "ころゴーレム", "folder": "zako"},
  {"id": "mofu-wolf-frost-pup", "file": "mofu-wolf-frost-pup.webp", "name": "もふウルフ", "folder": "zako"},
  {"id": "purun-little-magic-slime", "file": "purun-little-magic-slime.webp", "name": "ぷるんスライム", "folder": "zako"},
  {"id": "yukimaru-snow-puff", "file": "yukimaru-snow-puff.webp", "name": "ゆきまるスノーパフ", "folder": "zako"},
  {"id": "acorn-leafy", "file": "acorn-leafy.webp", "name": "どんぐりリーフ", "folder": "zako"},
  {"id": "ember-frost-pup", "file": "ember-frost-pup.webp", "name": "エンバーフロストパップ", "folder": "zako"},
  {"id": "forest-puru", "file": "forest-puru.webp", "name": "森ぷる", "folder": "zako"},
  {"id": "moss-pebble-golem", "file": "moss-pebble-golem.webp", "name": "モスこいしゴーレム", "folder": "zako"},
  {"id": "sakura-snow-puff", "file": "sakura-snow-puff.webp", "name": "さくらスノーパフ", "folder": "zako"},
  {"id": "sand-ember-newt", "file": "sand-ember-newt.webp", "name": "サンドエンバーイモリ", "folder": "zako"},
  {"id": "snow-mushroom", "file": "snow-mushroom.webp", "name": "スノーキノコ", "folder": "zako"},
  {"id": "star-bat", "file": "star-bat.webp", "name": "スターバット", "folder": "zako"},
  {"id": "autumn-mushroom", "file": "autumn-mushroom.webp", "name": "オータムキノコ", "folder": "zako"},
  {"id": "berry-leafy", "file": "berry-leafy.webp", "name": "ベリーリーフ", "folder": "zako"},
  {"id": "night-snow-puff", "file": "night-snow-puff.webp", "name": "ナイトスノーパフ", "folder": "zako"},
  {"id": "rainy-bat", "file": "rainy-bat.webp", "name": "雨ふりバット", "folder": "zako"},
  {"id": "spring-moss-pup", "file": "spring-moss-pup.webp", "name": "スプリングモスパップ", "folder": "zako"},
  {"id": "sunset-puru", "file": "sunset-puru.webp", "name": "サンセットぷる", "folder": "zako"},
  {"id": "sunstone-golem", "file": "sunstone-golem.webp", "name": "サンストーンゴーレム", "folder": "zako"},
  {"id": "tidal-newt", "file": "tidal-newt.webp", "name": "タイダルイモリ", "folder": "zako"},
  {"id": "mizutama-kappa", "file": "mizutama-kappa.webp", "name": "みずたまカッパ", "folder": "zako"},
  {"id": "clover-mandragora", "file": "clover-mandragora.webp", "name": "クローバーマンドラゴラ", "folder": "zako"},
  {"id": "coral-bubble-crab", "file": "coral-bubble-crab.webp", "name": "コーラルバブルクラブ", "folder": "zako"},
  {"id": "lantern-firefly", "file": "lantern-firefly.webp", "name": "ランタンホタル", "folder": "zako"},
  {"id": "thunder-spark-fox", "file": "thunder-spark-fox.webp", "name": "サンダースパークフォックス", "folder": "zako"},
  {"id": "moon-moth", "file": "moon-moth.webp", "name": "月夜のモス", "folder": "zako"},
  {"id": "cloud-rain-rabbit", "file": "cloud-rain-rabbit.webp", "name": "くもあめウサギ", "folder": "zako"},
  {"id": "honeycomb-bee", "file": "honeycomb-bee.webp", "name": "ハニカムビー", "folder": "zako"},
  {"id": "vine-chameleon", "file": "vine-chameleon.webp", "name": "ヴァインカメレオン", "folder": "zako"},
  {"id": "pebble-ram", "file": "pebble-ram.webp", "name": "こいしラム", "folder": "zako"},
  {"id": "ember-lantern-salamander", "file": "ember-lantern-salamander.webp", "name": "エンバーランタン・サラマンダー", "folder": "zako"},
  {"id": "dusk-feather-owl", "file": "dusk-feather-owl.webp", "name": "たそがれフクロウ", "folder": "zako"},
  {"id": "rainbow-shell-snail", "file": "rainbow-shell-snail.webp", "name": "レインボーシェル・スネイル", "folder": "zako"},
  {"id": "puddle-mudling", "file": "puddle-mudling.webp", "name": "みずたまりマドリン", "folder": "zako"},
  {"id": "shadow-crest-ferret", "file": "shadow-crest-ferret.webp", "name": "シャドウクレストフェレット", "folder": "zako"},
  {"id": "bubblefin-frog", "file": "bubblefin-frog.webp", "name": "バブルフィンカエル", "folder": "zako"},
  {"id": "peach-puff-panda", "file": "peach-puff-panda.webp", "name": "ピーチパフパンダ", "folder": "zako"},
  {"id": "sprout-shell-turtle", "file": "sprout-shell-turtle.webp", "name": "スプラウトシェルカメ", "folder": "zako"},
  {"id": "ribbon-tailed-mouse", "file": "ribbon-tailed-mouse.webp", "name": "リボンテイルねずみ", "folder": "zako"},
  {"id": "honeydrop-bear", "file": "honeydrop-bear.webp", "name": "ハニードロップベア", "folder": "zako"},
  {"id": "shadow-crest-lynx", "file": "shadow-crest-lynx.webp", "name": "シャドウクレストリンクス", "folder": "zako"},
  {"id": "cobalt-blade-mantis", "file": "cobalt-blade-mantis.webp", "name": "コバルトブレードカマキリ", "folder": "zako"},
  {"id": "stormhorn-kid", "file": "stormhorn-kid.webp", "name": "ストームホーンキッド", "folder": "zako"},
  {"id": "emberwing-raven", "file": "emberwing-raven.webp", "name": "エンバーウィングレイヴン", "folder": "zako"},
  {"id": "frostfang-weasel", "file": "frostfang-weasel.webp", "name": "フロストファングイタチ", "folder": "zako"},
  {"id": "ironleaf-panther", "file": "ironleaf-panther.webp", "name": "アイアンリーフパンサー", "folder": "zako"},
  {"id": "prism-tail-drake", "file": "prism-tail-drake.webp", "name": "プリズムテイルドレイク", "folder": "zako"},
  {"id": "thunderclaw-ram", "file": "thunderclaw-ram.webp", "name": "サンダークローラム", "folder": "zako"},
  {"id": "duskblade-fox", "file": "duskblade-fox.webp", "name": "ダスクブレードフォックス", "folder": "zako"},
  {"id": "glacier-crest-hawk", "file": "glacier-crest-hawk.webp", "name": "グレイシャークレストホーク", "folder": "zako"},
  {"id": "skyfin-shark", "file": "skyfin-shark.webp", "name": "スカイフィンシャーク", "folder": "zako"},
  {"id": "aurora-shell-lizard", "file": "aurora-shell-lizard.webp", "name": "オーロラシェルリザード", "folder": "zako"},
  {"id": "whispering-mask-imp", "file": "whispering-mask-imp.webp", "name": "ささやきマスクインプ", "folder": "zako"},
  {"id": "lantern-eye-moth", "file": "lantern-eye-moth.webp", "name": "ランタンアイモス", "folder": "zako"},
  {"id": "hollow-hat-scarecrow", "file": "hollow-hat-scarecrow.webp", "name": "ホロウハットかかし", "folder": "zako"},
  {"id": "root-tangle-goblin", "file": "root-tangle-goblin.webp", "name": "ルートタングルゴブリン", "folder": "zako"},
  {"id": "pond-mirror-spirit", "file": "pond-mirror-spirit.webp", "name": "みずうみミラー精霊", "folder": "zako"},
  {"id": "shadow-puppet-cat", "file": "shadow-puppet-cat.webp", "name": "シャドウあやつりネコ", "folder": "zako"},
  {"id": "moonlit-wisp", "file": "moonlit-wisp.webp", "name": "月あかりウィスプ", "folder": "zako"},
  {"id": "candy-coral-slug", "file": "candy-coral-slug.webp", "name": "キャンディコーラルナメクジ", "folder": "zako"},
  {"id": "cogwheel-beetle", "file": "cogwheel-beetle.webp", "name": "コグホイール甲虫", "folder": "zako"},
  {"id": "paper-crane-spirit", "file": "paper-crane-spirit.webp", "name": "ペーパーつる精霊", "folder": "zako"},
  {"id": "mossy-porcupine", "file": "mossy-porcupine.webp", "name": "モッシーヤマアラシ", "folder": "zako"},
  {"id": "violet-reef-seahorse", "file": "violet-reef-seahorse.webp", "name": "ヴァイオレットリーフタツノオトシゴ", "folder": "zako"},
  {"id": "gearbit-mouse", "file": "gearbit-mouse.webp", "name": "ギアビットねずみ", "folder": "zako"},
  {"id": "steam-sprocket-mole", "file": "steam-sprocket-mole.webp", "name": "スチームスプロケット・モグラ", "folder": "zako"},
  {"id": "rivet-bloom-beetle", "file": "rivet-bloom-beetle.webp", "name": "リベットブルーム甲虫", "folder": "zako"},
  {"id": "hoshizora-penguin", "file": "hoshizora-penguin.webp", "name": "ほしぞらペンギン", "folder": "zako"},
  {"id": "sango-octopus", "file": "sango-octopus.webp", "name": "サンゴタコ", "folder": "zako"},
  {"id": "yume-kurage", "file": "yume-kurage.webp", "name": "ゆめクラゲ", "folder": "zako"},
  {"id": "kumo-whale", "file": "kumo-whale.webp", "name": "くもクジラ", "folder": "zako"},
  {"id": "matcha-tanuki", "file": "matcha-tanuki.webp", "name": "まっちゃタヌキ", "folder": "zako"},
  {"id": "haru-swallow", "file": "haru-swallow.webp", "name": "はるツバメ", "folder": "zako"},
  {"id": "biribiri-eel", "file": "biribiri-eel.webp", "name": "ビリビリウナギ", "folder": "zako"},
  {"id": "yoru-glider", "file": "yoru-glider.webp", "name": "よるモモンガ", "folder": "zako"},
  {"id": "nanahoshi-ladybug", "file": "nanahoshi-ladybug.webp", "name": "ほしぼしテントウ", "folder": "zako"},
  {"id": "kuwagata-stag-beetle", "file": "kuwagata-stag-beetle.webp", "name": "クワガタマン", "folder": "zako"},
  {"id": "marshmallow-alpaca", "file": "marshmallow-alpaca.webp", "name": "マシュマロアルパカ", "folder": "zako"},
  {"id": "nami-seagull", "file": "nami-seagull.webp", "name": "なみウミネコ", "folder": "zako"},
  {"id": "tanpopo-fluff-fairy", "file": "tanpopo-fluff-fairy.webp", "name": "たんぽぽワタゲ", "folder": "zako"},
  {"id": "hikari-butterfly", "file": "hikari-butterfly.webp", "name": "ひかりチョウ", "folder": "zako"},
  {"id": "yousei-shrimp", "file": "yousei-shrimp.webp", "name": "ようせいエビ", "folder": "zako"},
  {"id": "kaze-cheetah", "file": "kaze-cheetah.webp", "name": "かぜチーター", "folder": "zako"},
  {"id": "sumi-squid", "file": "sumi-squid.webp", "name": "すみイカ", "folder": "zako"},
  {"id": "yume-koala", "file": "yume-koala.webp", "name": "ゆめコアラ", "folder": "zako"},
  {"id": "kamonohashi-platypus", "file": "kamonohashi-platypus.webp", "name": "カモノハシ", "folder": "zako"},
  {"id": "tane-hamster", "file": "tane-hamster.webp", "name": "たねハムスター", "folder": "zako"},
  {"id": "yuyake-flamingo", "file": "yuyake-flamingo.webp", "name": "ゆうやけフラミンゴ", "folder": "zako"},
  {"id": "taiyo-meerkat", "file": "taiyo-meerkat.webp", "name": "たいようミーアキャット", "folder": "zako"},
  {"id": "onsen-capybara", "file": "onsen-capybara.webp", "name": "おんせんカピバラ", "folder": "zako"},
  {"id": "korogari-armadillo", "file": "korogari-armadillo.webp", "name": "ころがりアルマジロ", "folder": "zako"},
];
const toTarget = (item) => `${RAW}/monsters/${item.folder}/${item.file}`;

export const ASSETS = {
  navian: { normal: './assets/navi/navian_normal.png', cheer: './assets/navi/navian_cheer.png' },
  targets: {
    navian: NAVIAN_GROUP2.map(toTarget),
    evolved: EVONAVI_GROUP2.map(toTarget),
    boss: BOSS_GROUP2.map(toTarget)
  },
  collection: ZAKO_ALL,
  catchPool: ZAKO_ALL.map(toTarget),
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
