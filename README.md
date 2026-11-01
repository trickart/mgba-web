# mGBA Web

mGBA エミュレータ(WebAssembly版)をブラウザで動かす Web ページです。
ROM はドラッグ＆ドロップ、または「ROMを開く」ボタンから読み込みます。

## 起動方法

```bash
npm install
npm start
```

ブラウザで http://localhost:8080 を開きます。

## 構成

| パス | 内容 |
| --- | --- |
| `public/index.html` | ページ本体(UI とエミュレータ制御) |
| `public/mgba.js` / `public/mgba.wasm` | mGBA の WebAssembly コア(`@thenick775/mgba-wasm` からコピー) |
| `server.js` | COOP/COEP ヘッダ付きの静的配信サーバ(依存なし) |
| `test/test.gba` | 動作確認用の最小 ROM(画面をマゼンタに塗るだけ) |

`npm install` 時に `postinstall` でコアファイルが `public/` にコピーされます。
手動で更新したい場合は `npm run copy-core` を実行してください。

## 機能

- ROM の読み込み: ドラッグ＆ドロップ / 「ROMを開く」ボタン(.gba / .gbc / .gb / .zip / .7z)
- `.sav`(ゲーム内セーブ)や `.ss1` などのステートファイルもドロップで取り込み可能
- 一時停止 / 再開、リセット、早送り(×4)、終了(ROM 選択画面に戻る)
- ステートセーブ / ロード(スロット 1〜5)
- 音量調整、全画面表示
- `.sav` の書き出し(ダウンロード)
- セーブデータ・ステートは IndexedDB に保存され、次回アクセス時も保持されます

## キー操作

| 操作 | キー |
| --- | --- |
| 十字キー | 矢印キー |
| A / B | X / Z |
| L / R | A / S |
| START / SELECT | Enter / Backspace |
| 一時停止 / 再開 | P |
| 早送り切替 | Space |
| ステートセーブ / ロード | F5 / F8 |

## GitHub Pages で公開する

`.github/workflows/deploy.yml` により、`main` ブランチへ push すると `public/` が GitHub Pages に自動デプロイされます。

初回のみ、GitHub のリポジトリ設定で次を行ってください。

1. Settings → Pages → Build and deployment → Source を **GitHub Actions** にする
2. `main` に push する(または Actions タブから `Deploy to GitHub Pages` を手動実行する)

公開 URL は `https://<ユーザー名>.github.io/<リポジトリ名>/` です。

GitHub Pages はレスポンスヘッダを設定できないため、`public/coi-serviceworker.js`
(Service Worker)で COOP/COEP ヘッダを付与しています。初回アクセス時は
Service Worker 登録のためページが自動で 1 回リロードされます。

## 別のサーバで配信する場合

mGBA の WebAssembly コアはスレッド(SharedArrayBuffer)を使うため、
本来は配信元で以下のレスポンスヘッダを付ける必要があります。

```
Cross-Origin-Opener-Policy: same-origin
Cross-Origin-Embedder-Policy: require-corp
```

ヘッダを設定できる環境ではそちらを優先し(`coi-serviceworker.js` は何もしません)、
設定できない環境では Service Worker が代わりに付与します。
`mgba.js` と `mgba.wasm` はページと同一オリジンから配信してください。

## 注意

ROM ファイルは同梱していません。ご自身で合法的に所有しているソフトの ROM をご利用ください。
