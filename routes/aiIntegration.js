const express = require('express');
const axios = require('axios');
const cheerio = require('cheerio');
const { extractMainContent, summarizeText } = require('../utils/textProcessor');

const router = express.Router();

/**
 * AIアプリ連携用のエンドポイント
 * Webページの内容を取得してAIが利用しやすい形式で返す
 */
router.get('/content', async (req, res) => {
  const { url, format = 'text', maxLength } = req.query;
  
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
    
    // ページのタイトルとメタ情報を取得
    const title = $('title').text();
    const description = $('meta[name="description"]').attr('content') || '';
    
    // メインコンテンツを抽出
    const content = extractMainContent(response.data, $);
    
    // 出力する最大長を設定
    const limit = maxLength ? parseInt(maxLength) : 4000;
    
    // コンテンツを要約（必要に応じて）
    const processedContent = summarizeText(content, limit);
    
    // 出力形式に応じた結果を返す
    if (format === 'json') {
      res.json({
        url,
        title,
        description,
        content: processedContent,
        contentLength: processedContent.length,
        originalLength: content.length
      });
    } else if (format === 'markdown') {
      const markdown = `# ${title}\n\n${description ? `> ${description}\n\n` : ''}${processedContent}`;
      res.type('text/markdown').send(markdown);
    } else {
      // デフォルトはプレーンテキスト
      const text = `Title: ${title}\n${description ? `Description: ${description}\n\n` : '\n'}${processedContent}`;
      res.type('text/plain').send(text);
    }
  } catch (error) {
    console.error('Error fetching URL for AI integration:', error.message);
    res.status(500).json({
      error: 'Failed to fetch webpage content',
      message: error.message
    });
  }
});

/**
 * LLMアプリが複数のURLをまとめて取得できるバルクエンドポイント
 */
router.post('/bulk', async (req, res) => {
  const { urls, format = 'text', maxLength = 2000 } = req.body;
  
  if (!urls || !Array.isArray(urls) || urls.length === 0) {
    return res.status(400).json({ error: 'URLs array is required in the request body' });
  }
  
  try {
    // 並列でURLを処理（最大5つ同時に）
    const promises = urls.map(url => {
      return axios.get(url, {
        headers: {
          'User-Agent': process.env.USER_AGENT || 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
        }
      })
      .then(response => {
        const $ = cheerio.load(response.data);
        const title = $('title').text();
        const content = extractMainContent(response.data, $);
        const processedContent = summarizeText(content, maxLength);
        
        return {
          url,
          title,
          content: processedContent
        };
      })
      .catch(error => {
        return {
          url,
          error: error.message,
          content: null
        };
      });
    });
    
    const results = await Promise.all(promises);
    
    res.json({
      results,
      count: results.length,
      successCount: results.filter(r => !r.error).length
    });
  } catch (error) {
    console.error('Error in bulk processing:', error.message);
    res.status(500).json({
      error: 'Failed to process URLs in bulk',
      message: error.message
    });
  }
});

module.exports = router;
