# Wisteria Noble - Fantasy Outfit Builder

## ファイル構成

- `index.html`：ページ構造
- `style.css`：ゲームUI風デザインとレスポンシブ対応
- `script.js`：JSON読み込み、シリーズ展開、コピー、プロンプト選択
- `outfits.json`：衣装シリーズとカテゴリデータ

## ローカル確認

`fetch()` でJSONを読み込むため、HTMLファイルを直接ダブルクリックせず、
簡易Webサーバー経由で確認してください。

### VS Code
Live Server 拡張機能で `index.html` を開く。

### Python
```bash
python -m http.server 8000
```

その後、ブラウザで `http://localhost:8000` を開く。

## GitHub Pages

リポジトリ直下に4ファイルを配置し、GitHub Pagesの公開元を
`Deploy from a branch` / `main` / `/root` に設定してください。
