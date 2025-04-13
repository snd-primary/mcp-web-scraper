// テキスト処理用のユーティリティ関数

/**
 * HTMLからメインコンテンツを抽出し、Plain Textに変換する
 * @param {string} html HTML文字列
 * @param {object} $ cheerioオブジェクト
 * @returns {string} 整形されたテキスト
 */
function extractMainContent(html, $) {
  // コンテンツを含む可能性が高い要素
  const contentSelectors = [
    'article', 'main', '.content', '.post-content', '.entry-content', 
    '#content', '#main', '.article-content', '.blog-post'
  ];
  
  let mainContent = '';
  
  // コンテンツセレクタを順番に試す
  for (const selector of contentSelectors) {
    const element = $(selector);
    if (element.length > 0) {
      mainContent = element.text();
      break;
    }
  }
  
  // メインコンテンツがない場合はbodyから抽出
  if (!mainContent) {
    // 不要な要素を削除
    $('header, footer, nav, aside, script, style, .sidebar, .comments, .ad, .advertisement').remove();
    mainContent = $('body').text();
  }
  
  // テキストのクリーンアップ
  return cleanText(mainContent);
}

/**
 * テキストを整形する
 * @param {string} text 整形する元のテキスト
 * @returns {string} 整形されたテキスト
 */
function cleanText(text) {
  return text
    .replace(/\s+/g, ' ')      // 複数の空白を1つに
    .replace(/\n+/g, '\n')     // 複数の改行を1つに
    .replace(/\t+/g, ' ')      // タブを空白に
    .trim();                   // 前後の空白を削除
}

/**
 * テキストを要約する簡易関数
 * @param {string} text 要約する元のテキスト
 * @param {number} maxLength 最大文字数
 * @returns {string} 要約されたテキスト
 */
function summarizeText(text, maxLength = 1000) {
  if (text.length <= maxLength) {
    return text;
  }
  
  // 文章単位で分割
  const sentences = text.match(/[^.!?]+[.!?]+/g) || [];
  
  let summary = '';
  let currentLength = 0;
  
  for (const sentence of sentences) {
    if (currentLength + sentence.length > maxLength) {
      break;
    }
    
    summary += sentence;
    currentLength += sentence.length;
  }
  
  return summary;
}

module.exports = {
  extractMainContent,
  cleanText,
  summarizeText
};
