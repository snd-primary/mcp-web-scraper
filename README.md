# MCP Web Scraper

特定のWebページを取得するためのMCPサーバーです。このサーバーは、指定されたURLからWebページの内容を取得し、その内容を解析して返すRESTful APIを提供します。さらに、Claude DesktopなどのAIアプリとの連携機能も提供します。

## 機能

- Webページの取得とスクレイピング
- ページタイトルの抽出
- メタデータの抽出
- ページ本文の取得
- リンクの抽出
- 元のHTML取得
- **AI連携機能**：AIアプリが利用しやすい形式でコンテンツを提供

## 前提条件

- Node.js (バージョン12以上)
- npm (バージョン6以上)

## インストール

1. このリポジトリをクローンします：

```bash
git clone https://github.com/snd-primary/mcp-web-scraper.git
cd mcp-web-scraper
```

2. 必要なパッケージをインストールします：

```bash
npm install
```

3. 環境変数を設定します：

```bash
cp .env.example .env
```

必要に応じて`.env`ファイルを編集します。

## 使用方法

1. サーバーを起動します：

```bash
npm start
```

開発モードで起動する場合：

```bash
npm run dev
```

2. APIエンドポイントを使用します：

### Webページのスクレイピング

```
GET /scrape?url=https://example.com
```

#### リクエストパラメータ

- `url`: スクレイピングするWebページのURL（必須）

#### レスポンス例

```json
{
  "url": "https://example.com",
  "title": "Example Domain",
  "metaData": {
    "description": "Example website description",
    "keywords": "example, website, domain"
  },
  "bodyTextPreview": "This domain is for use in illustrative examples in documents...",
  "bodyTextLength": 234,
  "linkCount": 2,
  "links": [
    {
      "href": "https://www.iana.org/domains/example",
      "text": "More information..."
    }
  ],
  "html": "<!doctype html><html>...</html>"
}
```

## AI連携機能

このAPIには、ClaudeなどのAIアプリと連携するための特別なエンドポイントが含まれています。

### AI用コンテンツ取得

```
GET /ai/content?url=https://example.com&format=text&maxLength=4000
```

#### リクエストパラメータ

- `url`: 取得するWebページのURL（必須）
- `format`: レスポンス形式（'text', 'json', 'markdown'のいずれか、デフォルトは'text'）
- `maxLength`: 最大文字数（省略可、デフォルトは4000文字）

#### レスポンス例（format=textの場合）

```
Title: Example Domain

This domain is for use in illustrative examples in documents. You may use this domain in literature without prior coordination or asking for permission...
```

### 複数URL一括処理

```
POST /ai/bulk
```

#### リクエストボディ

```json
{
  "urls": ["https://example.com", "https://example.org"],
  "format": "json",
  "maxLength": 2000
}
```

#### レスポンス例

```json
{
  "results": [
    {
      "url": "https://example.com",
      "title": "Example Domain",
      "content": "This domain is for use in illustrative examples..."
    },
    {
      "url": "https://example.org",
      "title": "Example Domain",
      "content": "This domain is for use in illustrative examples..."
    }
  ],
  "count": 2,
  "successCount": 2
}
```

## Claude Desktopとの連携方法

Claude Desktopなどのローカルで実行されるAIアプリケーションと連携するための例として、`client-examples/claude-desktop-integration.js`ファイルが含まれています。

### 基本的な使用方法

1. サーバーを起動します: `npm start`
2. 連携スクリプトを実行します: `node client-examples/claude-desktop-integration.js https://example.com`

### Chrome拡張機能として使用

このリポジトリのコードは、Chrome拡張機能としても簡単に改変できます。基本的な手順は以下の通りです：

1. `manifest.json`ファイルを作成する
2. 拡張機能のUIを作成する（ポップアップなど）
3. バックグラウンドスクリプトで`claude-desktop-integration.js`の関数を利用する

詳細な実装例については、`chrome-extension-example`ディレクトリを参照してください（今後追加予定）。

### ClaudeのAPIを使用した連携

Claude APIを直接利用して、Webページの内容をClaudeに送信する例も用意されています。APIキーを設定して、以下のように使用できます：

```javascript
// client-examples/claude-api-integration.js の例を参照してください
```

## エラー処理

- 400 Bad Request: URLパラメータが不足している場合
- 500 Internal Server Error: スクレイピング中にエラーが発生した場合

## カスタマイズ

- `server.js`ファイルを編集して、必要に応じてスクレイピングロジックを変更できます
- 特定のデータを抽出するためのカスタムロジックを追加できます
- レート制限や認証などの追加機能を実装できます
- `utils/textProcessor.js`を編集して、テキスト処理ロジックをカスタマイズできます

## ライセンス

MIT
