# MCP Web Scraper

特定のWebページを取得するためのMCPサーバーです。このサーバーは、指定されたURLからWebページの内容を取得し、その内容を解析して返すRESTful APIを提供します。

## 機能

- Webページの取得とスクレイピング
- ページタイトルの抽出
- メタデータの抽出
- ページ本文の取得
- リンクの抽出
- 元のHTML取得

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

## エラー処理

- 400 Bad Request: URLパラメータが不足している場合
- 500 Internal Server Error: スクレイピング中にエラーが発生した場合

## カスタマイズ

- `server.js`ファイルを編集して、必要に応じてスクレイピングロジックを変更できます
- 特定のデータを抽出するためのカスタムロジックを追加できます
- レート制限や認証などの追加機能を実装できます

## ライセンス

MIT
