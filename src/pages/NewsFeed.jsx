import { useState, useEffect, useCallback } from 'react';
import { Newspaper, RefreshCw, Clock, ExternalLink, AlertCircle, Rss, X, Loader } from 'lucide-react';
import './NewsFeed.css';

const RSS2JSON_API = 'https://api.rss2json.com/v1/api.json?rss_url=';

const FEED_SOURCES = {
  english: [
    { id: 'bbc', name: 'BBC News', url: 'https://feeds.bbci.co.uk/news/world/rss.xml', color: '#bb1919' },
    { id: 'the-hindu', name: 'The Hindu', url: 'https://www.thehindu.com/news/international/feeder/default.rss', color: '#1a5276' },
    { id: 'indian-express', name: 'Indian Express', url: 'https://indianexpress.com/section/india/feed/', color: '#c0392b' },
  ],
  hindi: [
    { id: 'aaj-tak', name: 'Aaj Tak', url: 'https://feeds.feedburner.com/aajtak/topstories', color: '#e74c3c' },
    { id: 'amar-ujala', name: 'Amar Ujala', url: 'https://www.amarujala.com/rss/crime.xml', color: '#d35400' },
    { id: 'dainik-bhaskar', name: 'Dainik Bhaskar', url: 'https://www.bhaskar.com/rss/primary.xml', color: '#e67e22' },
  ],
  telugu: [
    { id: 'eenadu', name: 'Eenadu', url: 'https://www.eenadu.net/rss/telugu-news', color: '#2980b9' },
    { id: 'sakshi', name: 'Sakshi', url: 'https://www.sakshi.com/rss/politics.xml', color: '#27ae60' },
    { id: 'tv9-telugu', name: 'TV9 Telugu', url: 'https://tv9telugu.com/feed/', color: '#8e44ad' },
    { id: 'andhra-jyothy', name: 'Andhra Jyothy', url: 'https://www.andhrajyothy.com/rss', color: '#16a085' },
  ],
};

const LANGUAGES = [
  { id: 'telugu', label: 'Telugu' },
  { id: 'hindi', label: 'Hindi' },
  { id: 'english', label: 'English' },
];

function stripHtml(html) {
  if (!html) return '';
  return html.replace(/<[^>]*>/g, '').replace(/&nbsp;/g, ' ').replace(/&amp;/g, '&').replace(/&lt;/g, '<').replace(/&gt;/g, '>').trim();
}

function formatDate(dateStr) {
  if (!dateStr) return '';
  const d = new Date(dateStr);
  if (isNaN(d)) return '';
  const now = new Date();
  const diff = now - d;
  const mins = Math.floor(diff / 60000);
  const hrs = Math.floor(diff / 3600000);
  const days = Math.floor(diff / 86400000);
  if (mins < 1) return 'Just now';
  if (mins < 60) return `${mins}m ago`;
  if (hrs < 24) return `${hrs}h ago`;
  if (days < 7) return `${days}d ago`;
  return d.toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' });
}

async function fetchFeed(url) {
  const res = await fetch(`${RSS2JSON_API}${encodeURIComponent(url)}`);
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
  const data = await res.json();
  if (data.status !== 'ok' || !data.items) {
    throw new Error(data.message || 'Failed to parse feed');
  }
  return data.items.map((item) => ({
    title: item.title || 'Untitled',
    link: item.link || '#',
    description: stripHtml(item.description || item.content || ''),
    fullContent: item.content || item.description || '',
    pubDate: item.pubDate || '',
    thumbnail: item.thumbnail || item.enclosure?.link || item.enclosures?.[0]?.link || '',
    author: item.author || '',
    source: data.feed?.title || '',
  }));
}

export default function NewsFeed() {
  const [activeLang, setActiveLang] = useState('telugu');
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [lastUpdated, setLastUpdated] = useState(null);
  const [selectedArticle, setSelectedArticle] = useState(null);
  const [iframeLoading, setIframeLoading] = useState(true);
  const [articleHtml, setArticleHtml] = useState('');

  useEffect(() => {
    if (!selectedArticle) return;
    const onKey = (e) => { if (e.key === 'Escape') setSelectedArticle(null); };
    document.addEventListener('keydown', onKey);
    document.body.style.overflow = 'hidden';
    return () => {
      document.removeEventListener('keydown', onKey);
      document.body.style.overflow = '';
    };
  }, [selectedArticle]);

  useEffect(() => {
    if (!selectedArticle) { setArticleHtml(''); return; }
    setIframeLoading(true);

    const hasContent = selectedArticle.fullContent && selectedArticle.fullContent.length > 100;

    if (hasContent) {
      const baseUrl = new URL(selectedArticle.link);
      const parser = new DOMParser();
      const doc = parser.parseFromString(selectedArticle.fullContent, 'text/html');

      doc.querySelectorAll('img').forEach((img) => {
        const src = img.getAttribute('src');
        if (src && !src.startsWith('http')) {
          try { img.setAttribute('src', new URL(src, baseUrl).href); } catch (_e) {}
        }
      });
      doc.querySelectorAll('a').forEach((a) => {
        const href = a.getAttribute('href');
        if (href && !href.startsWith('http') && !href.startsWith('#') && !href.startsWith('javascript:')) {
          try { a.setAttribute('href', new URL(href, baseUrl).href); } catch (_e) {}
        }
      });

      setArticleHtml(`
        <html><head><base href="${baseUrl.origin}">
        <style>
          body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; color: #1a1a1a; line-height: 1.7; padding: 24px; margin: 0; background: #fff; }
          img { max-width: 100%; height: auto; border-radius: 8px; margin: 12px 0; }
          a { color: #2563eb; }
          h1, h2, h3 { line-height: 1.3; }
          p { margin: 12px 0; }
          blockquote { border-left: 3px solid #2563eb; padding-left: 16px; margin: 16px 0; color: #555; font-style: italic; }
          figure { margin: 16px 0; }
          figcaption { font-size: 13px; color: #666; text-align: center; }
        </style></head><body>
          <h1 style="font-size:24px;margin-bottom:8px">${selectedArticle.title}</h1>
          <hr style="border:none;border-top:1px solid #e5e7eb;margin:16px 0">
          ${doc.body.innerHTML}
        </body></html>
      `);
      setIframeLoading(false);
    } else {
      setArticleHtml(`<html><body style="font-family:sans-serif;padding:40px;text-align:center;color:#666">
        <h2 style="color:#1a1a1a">${selectedArticle.title}</h2>
        <p style="margin:16px 0">${selectedArticle.description || 'No preview available.'}</p>
        <a href="${selectedArticle.link}" target="_blank" rel="noopener" style="display:inline-block;margin-top:16px;padding:10px 24px;background:#2563eb;color:#fff;border-radius:8px;text-decoration:none;font-weight:500">Read full article &rarr;</a>
      </body></html>`);
      setIframeLoading(false);
    }
  }, [selectedArticle]);

  const loadFeeds = useCallback(async () => {
    setLoading(true);
    setError(null);

    const urls = (FEED_SOURCES[activeLang] || []).map((s) => s.url);

    try {
      const results = await Promise.allSettled(urls.map((url) => fetchFeed(url)));
      const allArticles = [];
      let failedCount = 0;

      results.forEach((r) => {
        if (r.status === 'fulfilled') {
          allArticles.push(...r.value);
        } else {
          failedCount++;
        }
      });

      allArticles.sort((a, b) => new Date(b.pubDate) - new Date(a.pubDate));

      if (allArticles.length === 0 && failedCount > 0) {
        throw new Error('All feeds failed to load. The RSS services may be temporarily unavailable.');
      }

      setArticles(allArticles);
      setLastUpdated(new Date());
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [activeLang]);

  useEffect(() => {
    loadFeeds();
  }, [loadFeeds]);

  useEffect(() => {
    const interval = setInterval(() => {
      loadFeeds();
    }, 5 * 60 * 1000);
    return () => clearInterval(interval);
  }, [loadFeeds]);

  return (
    <div className="newsfeed-page">
      <div className="newsfeed-header">
        <h1>
          <Newspaper size={28} />
          News Feed
        </h1>
        <p>Stay updated with the latest news from India and around the world</p>
      </div>

      <div className="newsfeed-lang-tabs">
        {LANGUAGES.map((lang) => (
          <button
            key={lang.id}
            className={`newsfeed-lang-tab ${activeLang === lang.id ? 'active' : ''}`}
            onClick={() => setActiveLang(lang.id)}
          >
            {lang.label}
          </button>
        ))}
      </div>

      {loading ? (
        <div className="newsfeed-loading">
          <div className="newsfeed-spinner"></div>
          <span className="newsfeed-loading-text">Fetching latest news...</span>
        </div>
      ) : error ? (
        <div className="newsfeed-error">
          <AlertCircle size={48} className="newsfeed-error-icon" />
          <h3>Failed to load news</h3>
          <p>{error}</p>
          <button className="newsfeed-retry-btn" onClick={loadFeeds}>
            <RefreshCw size={14} /> Try Again
          </button>
        </div>
      ) : (
        <>
          <div className="newsfeed-toolbar">
            <span className="newsfeed-count">
              {articles.length} article{articles.length !== 1 ? 's' : ''}
              {lastUpdated && ` \u00B7 Updated ${formatDate(lastUpdated.toISOString())}`}
            </span>
            <button className="newsfeed-refresh-btn" onClick={loadFeeds}>
              <RefreshCw size={14} /> Refresh
            </button>
          </div>

          {articles.length === 0 ? (
            <div className="newsfeed-empty">
              <Rss size={48} className="newsfeed-empty-icon" />
              <p>No articles found. Try a different source.</p>
            </div>
          ) : (
            <div className="newsfeed-grid">
              {articles.map((article, i) => (
                <div
                  key={`${article.link}-${i}`}
                  className="newsfeed-card"
                  onClick={() => { setSelectedArticle(article); setIframeLoading(true); }}
                >
                  {article.thumbnail ? (
                    <img
                      src={article.thumbnail}
                      alt=""
                      className="newsfeed-card-image"
                      loading="lazy"
                      onError={(e) => { e.target.style.display = 'none'; }}
                    />
                  ) : (
                    <div className="newsfeed-card-image-placeholder">
                      <Newspaper size={40} color="#334155" />
                    </div>
                  )}
                  <div className="newsfeed-card-body">
                    {article.source && (
                      <div className="newsfeed-card-source">
                        <Rss size={12} />
                        {article.source}
                      </div>
                    )}
                    <h3 className="newsfeed-card-title">{article.title}</h3>
                    {article.description && (
                      <p className="newsfeed-card-desc">{article.description}</p>
                    )}
                    <div className="newsfeed-card-meta">
                      <span className="newsfeed-card-date">
                        <Clock size={12} />
                        {formatDate(article.pubDate)}
                      </span>
                      <span className="newsfeed-card-readmore">
                        Read more <ExternalLink size={12} />
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </>
      )}

      {selectedArticle && (
        <div className="newsfeed-modal-overlay" onClick={() => setSelectedArticle(null)}>
          <div className="newsfeed-modal" onClick={(e) => e.stopPropagation()}>
            <div className="newsfeed-modal-header">
              <div className="newsfeed-modal-title">
                {selectedArticle.source && <span className="newsfeed-modal-source">{selectedArticle.source}</span>}
                <h2>{selectedArticle.title}</h2>
              </div>
              <a href={selectedArticle.link} target="_blank" rel="noopener noreferrer" className="newsfeed-modal-open">
                <ExternalLink size={16} />
              </a>
              <button className="newsfeed-modal-close" onClick={() => setSelectedArticle(null)}>
                <X size={20} />
              </button>
            </div>
            <div className="newsfeed-modal-body">
              {iframeLoading && (
                <div className="newsfeed-modal-loader">
                  <Loader size={32} className="newsfeed-modal-spinner" />
                  <span>Loading article...</span>
                </div>
              )}
              <iframe
                srcDoc={articleHtml}
                title={selectedArticle.title}
                className="newsfeed-modal-iframe"
                onLoad={() => setIframeLoading(false)}
                sandbox="allow-same-origin"
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
