/**
 * Claude Desktop との連携のためのサンプルコード
 * このスクリプトはNode.jsで実行できるスタンドアロンのクライアントとしても、
 * ブラウザ拡張機能としても使用できます。
 */

// WebスクレイパーサーバーのベースURL
const SCRAPER_BASE_URL = 'http://localhost:3000';

/**
 * 指定したURLからコンテンツを取得してClaudeに送るための準備をする
 * @param {string} url 取得するWebページのURL
 * @param {string} format レスポンスのフォーマット（'text', 'json', 'markdown'）
 * @param {number} maxLength 最大文字数
 * @returns {Promise<string>} 処理されたコンテンツ
 */
async function fetchContentForClaude(url, format = 'text', maxLength = 4000) {
  try {
    const response = await fetch(`${SCRAPER_BASE_URL}/ai/content?url=${encodeURIComponent(url)}&format=${format}&maxLength=${maxLength}`);
    
    if (!response.ok) {
      throw new Error(`Error fetching content: ${response.status} ${response.statusText}`);
    }
    
    if (format === 'json') {
      const data = await response.json();
      return JSON.stringify(data, null, 2);
    } else {
      return await response.text();
    }
  } catch (error) {
    console.error('Error in fetchContentForClaude:', error);
    return `Failed to fetch content from ${url}: ${error.message}`;
  }
}

/**
 * 複数のURLからコンテンツを取得
 * @param {string[]} urls 取得するURLの配列
 * @param {number} maxLength 各URLの最大文字数
 * @returns {Promise<Object>} 処理された結果
 */
async function fetchBulkContentForClaude(urls, maxLength = 2000) {
  try {
    const response = await fetch(`${SCRAPER_BASE_URL}/ai/bulk`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        urls,
        maxLength
      })
    });
    
    if (!response.ok) {
      throw new Error(`Error fetching bulk content: ${response.status} ${response.statusText}`);
    }
    
    return await response.json();
  } catch (error) {
    console.error('Error in fetchBulkContentForClaude:', error);
    return {
      error: error.message,
      results: []
    };
  }
}

/**
 * Claude Desktopにコンテンツを送信する（実際の方法はAPI次第）
 * @param {string} content Claudeに送信するコンテンツ
 * @param {string} context 追加のコンテキスト情報
 */
async function sendToClaudeDesktop(content, context = '') {
  // NOTE: Claude DesktopのAPIは現在公開されていないため、
  // 以下はプレースホルダーです。実際の実装はAPI仕様に合わせて変更が必要です。
  
  console.log('Sending to Claude Desktop:');
  console.log('------ CONTENT ------');
  console.log(content.substring(0, 200) + '...');
  console.log('--------------------');
  
  // もし将来的にAPIが公開された場合の実装例：
  /*
  const response = await fetch('http://localhost:CLAUDE_PORT/api/submit', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      message: `${context}\n\n${content}`,
      source: 'web-scraper'
    })
  });
  
  return await response.json();
  */
  
  return {
    success: true,
    message: 'Content ready for Claude (simulation only)'
  };
}

// ブラウザ環境で実行される場合のエクスポート
if (typeof window !== 'undefined') {
  window.ClaudeIntegration = {
    fetchContentForClaude,
    fetchBulkContentForClaude,
    sendToClaudeDesktop
  };
}

// Node.js環境で実行される場合のエクスポート
if (typeof module !== 'undefined') {
  module.exports = {
    fetchContentForClaude,
    fetchBulkContentForClaude,
    sendToClaudeDesktop
  };
}

// CLIとして実行されるサンプル
if (require.main === module) {
  // コマンドライン引数からURLを取得
  const url = process.argv[2];
  
  if (!url) {
    console.error('Usage: node claude-desktop-integration.js <URL>');
    process.exit(1);
  }
  
  console.log(`Fetching content from ${url} for Claude...`);
  
  fetchContentForClaude(url)
    .then(content => {
      console.log('Content fetched successfully!');
      console.log('Preview:');
      console.log('-'.repeat(40));
      console.log(content.substring(0, 500) + '...');
      console.log('-'.repeat(40));
      console.log(`Total length: ${content.length} characters`);
      
      // 擬似的なClaude送信
      return sendToClaudeDesktop(content, `The following content was scraped from ${url}. Please summarize it:`);
    })
    .then(result => {
      console.log('Result:', result);
    })
    .catch(err => {
      console.error('Error:', err);
    });
}
