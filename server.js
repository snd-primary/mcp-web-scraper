require('dotenv').config();
const express = require('express');
const axios = require('axios');
const cheerio = require('cheerio');
const cors = require('cors');

// サーバーの設定
const app = express();
const PORT = process.env.PORT || 3000;

// ミドルウェアの設定
app.use(express.json());
app.use(cors());

// ルートエンドポイント
app.get('/', (req, res) => {
  res.json({
    message: 'MCP Web Scraper API',
    endpoints: {
      '/scrape': 'GET - URLからWebページを取得',
    }
  });
});

// Webページスクレイピングエンドポイント
app.get('/scrape', async (req, res) => {
  const { url } = req.query;
  
  if (!url) {
    return res.status(400).json({ error: 'URL parameter is required' });
  }
  
  try {
    // URLからWebページを取得
    const response = await axios.get(url, {
      headers: {
        'User-Agent': process.env.USER_AGENT || 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
      }
    });
    
    // cheerioでHTMLをパース
    const $ = cheerio.load(response.data);
    
    // ページのタイトルを取得
    const title = $('title').text();
    
    // メタデータを取得
    const metaData = {};
    $('meta').each((i, el) => {
      const name = $(el).attr('name') || $(el).attr('property');
      const content = $(el).attr('content');
      if (name && content) {
        metaData[name] = content;
      }
    });
    
    // ページの本文を取得
    const bodyText = $('body').text().replace(/\s+/g, ' ').trim();
    
    // リンクを取得
    const links = [];
    $('a').each((i, el) => {
      const href = $(el).attr('href');
      const text = $(el).text().trim();
      if (href) {
        links.push({ href, text });
      }
    });
    
    // 結果を返す
    res.json({
      url,
      title,
      metaData,
      bodyTextPreview: bodyText.substring(0, 500) + '...',
      bodyTextLength: bodyText.length,
      linkCount: links.length,
      links: links.slice(0, 10), // 最初の10個のリンクのみ返す
      html: response.data // 元のHTMLも返す（必要に応じて）
    });
    
  } catch (error) {
    console.error('Error fetching URL:', error.message);
    res.status(500).json({
      error: 'Failed to scrape the webpage',
      message: error.message
    });
  }
});

// 404ハンドラー
app.use((req, res) => {
  res.status(404).json({ error: 'Endpoint not found' });
});

// エラーハンドラー
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Internal server error' });
});

// サーバーを起動
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
