# ものさしハンター

ANGLE HUNTER(角度版)の長さ版。ものさしを使わず、目で見て長さを当てるハンティング型学習アプリ。

## 構成

```
index.html          エントリーHTML(CSSとmain.jsを読み込むだけ)
css/style.css        全体スタイル
js/config.js         設定値(定規範囲・難易度ステップ・チャレンジ秒数など)を集約
js/ruler.js           定規(目盛り)描画。mmToPx()を他モジュールが再利用
js/target.js          的(モンスター)の出現・逃走演出
js/assets.js          navi-character-素材のパス定義+フォールバック
js/game-core.js       正解判定・回答位置の可視化(共通ロジック)
js/storage.js         localStorageでの記録管理
js/hunt-mode.js       ハントモード(タイマーなし練習)
js/challenge-mode.js  チャレンジ60モード(60秒タイマー)
js/main.js            タイトル画面・モード切り替えの司令塔
assets/navi/          ナビアン画像を配置する場所(未配置でも動作)
assets/monsters/      モンスター画像を配置する場所(未配置でも動作)
```

## 素材(画像)の入れ方

このアプリは [NAVI CHARACTER](https://github.com/TT-sensei/navi-character-) のナビアン・モンスター図鑑素材を
利用する前提で作ってあります。ANGLE HUNTERと同じく、外部CDNには依存せずリポジトリに同梱する方針です。

1. navi-character- リポジトリから使いたい画像をダウンロード
2. 下記のファイル名で配置するだけで自動的に反映されます

- `assets/navi/navian_normal.png` … タイトル画面のナビアン
- `assets/navi/navian_cheer.png` … 応援ポーズ(現状は未使用、拡張用に予約済み)
- `assets/monsters/zako_01.png` 〜 `zako_evo_01.png` … 的として出現するモンスター

画像がまだ無くても `js/assets.js` のフォールバック処理により絵文字プレースホルダー(👾)で
代替表示されるので、素材配置前でも動作確認ができます。モンスターを増やしたいときは
`ASSETS.targets` 配列にパスを追加するだけです。

## 難易度

- **1cm単位(かんたん)**: 10mm刻みで出題
- **1mm単位(むずかしい)**: 1mm刻みで出題

`js/config.js` の `CONFIG.difficulty` を編集すれば、刻み幅を自由に変更・追加できます。

## モード

- **ハントモード**: タイマーなし。連続正解数を記録。
- **チャレンジ60**: 60秒間で何匹ハントできるかを競う。ベストスコアをlocalStorageに保存。

## 拡張のしかた(想定)

- **新モードを追加したい** → `xxxx-mode.js` を1つ追加し、`main.js` にボタンと呼び出しを1行足すだけ
- **定規のデザインを変えたい** → `ruler.js` の `RulerConfig` だけ触れば良い(他ファイルへの影響なし)
- **的の見た目や動きを変えたい** → `target.js` のみで完結
- **記録の項目を増やしたい** → `storage.js` の `defaultStats()` に項目を足すだけ

学習ロジック(出題・判定)とUI/演出を分離しているので、
今後MEASUREモードやモンスター図鑑を足す場合も既存コードへの影響を最小限にできます。
