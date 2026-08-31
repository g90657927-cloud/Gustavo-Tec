import Parser from 'rss-parser';

export interface RealNewsItem {
  id: string;
  title: string;
  summary: string;
  content: string;
  category: 'Inteligência Artificial' | 'Hardware & Chips' | 'Dev & Open Source' | 'Cibersegurança' | 'Mobile & Gadgets' | 'Espaço & Robótica' | 'Cloud & Web3';
  author: {
    name: string;
    avatar: string;
    role: string;
  };
  publishedAt: string;
  timestamp: number;
  readTime: string;
  imageUrl: string;
  likes: number;
  views: number;
  breaking?: boolean;
  trending?: boolean;
  tags: string[];
  commentsCount: number;
  source: string;
  sourceUrl: string;
  sourceDomain: string;
  keyTakeaways?: string[];
}

interface FeedConfig {
  name: string;
  domain: string;
  url: string;
  defaultCategory: RealNewsItem['category'];
  avatar: string;
}

const FEEDS: FeedConfig[] = [
  {
    name: 'Pplware',
    domain: 'pplware.sapo.pt',
    url: 'https://pplware.sapo.pt/feed/',
    defaultCategory: 'Dev & Open Source',
    avatar: 'https://api.dicebear.com/7.x/identicon/svg?seed=pplware'
  },
  {
    name: 'SAPO Tek',
    domain: 'tek.sapo.pt',
    url: 'https://tek.sapo.pt/feed/rss',
    defaultCategory: 'Mobile & Gadgets',
    avatar: 'https://api.dicebear.com/7.x/identicon/svg?seed=sapotek'
  },
  {
    name: 'The Verge',
    domain: 'theverge.com',
    url: 'https://www.theverge.com/rss/index.xml',
    defaultCategory: 'Inteligência Artificial',
    avatar: 'https://api.dicebear.com/7.x/identicon/svg?seed=theverge'
  },
  {
    name: 'TechCrunch',
    domain: 'techcrunch.com',
    url: 'https://techcrunch.com/feed/',
    defaultCategory: 'Inteligência Artificial',
    avatar: 'https://api.dicebear.com/7.x/identicon/svg?seed=techcrunch'
  },
  {
    name: 'Ars Technica',
    domain: 'arstechnica.com',
    url: 'https://feeds.arsonline.com/arstechnica/index',
    defaultCategory: 'Hardware & Chips',
    avatar: 'https://api.dicebear.com/7.x/identicon/svg?seed=arstechnica'
  },
  {
    name: 'Wired',
    domain: 'wired.com',
    url: 'https://www.wired.com/feed/rss',
    defaultCategory: 'Cibersegurança',
    avatar: 'https://api.dicebear.com/7.x/identicon/svg?seed=wired'
  },
  {
    name: 'Engadget',
    domain: 'engadget.com',
    url: 'https://www.engadget.com/rss.xml',
    defaultCategory: 'Mobile & Gadgets',
    avatar: 'https://api.dicebear.com/7.x/identicon/svg?seed=engadget'
  },
  {
    name: '9to5Google',
    domain: '9to5google.com',
    url: 'https://9to5google.com/feed/',
    defaultCategory: 'Mobile & Gadgets',
    avatar: 'https://api.dicebear.com/7.x/identicon/svg?seed=9to5google'
  },
  {
    name: 'Bleeping Computer',
    domain: 'bleepingcomputer.com',
    url: 'https://www.bleepingcomputer.com/feed/',
    defaultCategory: 'Cibersegurança',
    avatar: 'https://api.dicebear.com/7.x/identicon/svg?seed=bleeping'
  },
  {
    name: 'Gizmodo',
    domain: 'gizmodo.com',
    url: 'https://gizmodo.com/feed/',
    defaultCategory: 'Espaço & Robótica',
    avatar: 'https://api.dicebear.com/7.x/identicon/svg?seed=gizmodo'
  }
];

const CATEGORY_IMAGES: Record<RealNewsItem['category'], string[]> = {
  'Inteligência Artificial': [
    'https://images.unsplash.com/photo-1677442136019-21780ecad995?w=800&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1620712943543-bcc4688e7485?w=800&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=800&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1534972195531-a756b1126f24?w=800&auto=format&fit=crop&q=80'
  ],
  'Hardware & Chips': [
    'https://images.unsplash.com/photo-1518770660439-4636190af475?w=800&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1555680202-c86f0e12f086?w=800&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1591799264318-7e6ef8ddb7ea?w=800&auto=format&fit=crop&q=80'
  ],
  'Dev & Open Source': [
    'https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=800&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1542831371-29b0f74f9713?w=800&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1461749280684-dccba630e2f6?w=800&auto=format&fit=crop&q=80'
  ],
  'Cibersegurança': [
    'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?w=800&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1563986768609-322da13575f3?w=800&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1510511459019-5dda7724fd87?w=800&auto=format&fit=crop&q=80'
  ],
  'Mobile & Gadgets': [
    'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=800&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1519389950473-47ba0277781c?w=800&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1558441719-646b22ad440c?w=800&auto=format&fit=crop&q=80'
  ],
  'Espaço & Robótica': [
    'https://images.unsplash.com/photo-1485827404703-89b55fcc595e?w=800&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=800&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1508614589041-895b88991e3e?w=800&auto=format&fit=crop&q=80'
  ],
  'Cloud & Web3': [
    'https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=800&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1639762681485-074b7f938ba0?w=800&auto=format&fit=crop&q=80'
  ]
};

const parser = new Parser({
  headers: {
    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
  },
  timeout: 8000
});

let cachedArticles: RealNewsItem[] = [];
let lastFetchTime = 0;
const CACHE_TTL_MS = 60 * 1000; // 1 minute cache

function cleanHtml(html?: string): string {
  if (!html) return '';
  return html
    .replace(/<[^>]*>?/gm, '')
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    .replace(/&#039;/g, "'")
    .replace(/&nbsp;/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

function extractImageFromItem(item: any, category: RealNewsItem['category']): string {
  // Check enclosure
  if (item.enclosure && item.enclosure.url && item.enclosure.type?.startsWith('image')) {
    return item.enclosure.url;
  }
  // Check media:content or media:thumbnail
  if (item['media:content'] && item['media:content'].$ && item['media:content'].$.url) {
    return item['media:content'].$.url;
  }
  if (item['media:thumbnail'] && item['media:thumbnail'].$ && item['media:thumbnail'].$.url) {
    return item['media:thumbnail'].$.url;
  }
  // Check img tags inside content
  const content = item['content:encoded'] || item.content || item.summary || '';
  const imgMatch = content.match(/<img[^>]+src=["']([^"']+)["']/i);
  if (imgMatch && imgMatch[1] && (imgMatch[1].startsWith('http://') || imgMatch[1].startsWith('https://'))) {
    return imgMatch[1];
  }
  // Fallback to high-quality thematic image
  const fallbackList = CATEGORY_IMAGES[category] || CATEGORY_IMAGES['Inteligência Artificial'];
  const hash = Math.abs((item.title || '').split('').reduce((acc: number, char: string) => acc + char.charCodeAt(0), 0));
  return fallbackList[hash % fallbackList.length];
}

function inferCategory(title: string, content: string, defaultCat: RealNewsItem['category']): RealNewsItem['category'] {
  const combined = `${title} ${content}`.toLowerCase();
  
  if (/(\bai\b|intelig[eê]ncia artificial|gpt|gemini|openai|deepseek|claude|llm|copilot|transformer|machine learning|prompt|neural|anthropic|mistral)/i.test(combined)) {
    return 'Inteligência Artificial';
  }
  if (/(nvidia|intel|amd|tsmc|qualcomm|snapdragon|processador|chip|semicondutor|gpu|cpu|arm|geforce|radeon|silicon)/i.test(combined)) {
    return 'Hardware & Chips';
  }
  if (/(security|seguran[çc]a|ciber|vulnerabilidade|ransomware|malware|hacker|breach|cve|phishing|patch|leak|nist|exploit)/i.test(combined)) {
    return 'Cibersegurança';
  }
  if (/(rust|python|typescript|javascript|github|open source|framework|react|vue|node|linux|kernel|api|código|desenvolvedor|devops|docker)/i.test(combined)) {
    return 'Dev & Open Source';
  }
  if (/(iphone|android|samsung|galaxy|apple|pixel|xiaomi|smartphone|smartwatch|gadget|fone|bluetooth|tela|oled|wearable)/i.test(combined)) {
    return 'Mobile & Gadgets';
  }
  if (/(espa[çc]o|nasa|spacex|rob[oô]|foguete|sat[eé]lite|marte|lua|astronomia|humanoid|boston dynamics)/i.test(combined)) {
    return 'Espaço & Robótica';
  }
  if (/(cloud|aws|azure|gcp|kubernetes|serverless|blockchain|crypto|bitcoin|ethereum|web3)/i.test(combined)) {
    return 'Cloud & Web3';
  }

  return defaultCat;
}

function formatRelativeTime(dateStr?: string): string {
  if (!dateStr) return 'Recente';
  const diffMs = Date.now() - new Date(dateStr).getTime();
  const mins = Math.floor(diffMs / (1000 * 60));
  if (mins < 1) return 'Agora mesmo';
  if (mins < 60) return `Há ${mins} min`;
  const hours = Math.floor(mins / 60);
  if (hours < 24) return `Há ${hours}h`;
  const days = Math.floor(hours / 24);
  return `Há ${days}d`;
}

// Fetch Hacker News Top Stories
async function fetchHackerNews(): Promise<RealNewsItem[]> {
  try {
    const res = await fetch('https://hacker-news.firebaseio.com/v0/topstories.json');
    if (!res.ok) return [];
    const storyIds: number[] = await res.json();
    const topIds = storyIds.slice(0, 10);

    const items = await Promise.all(
      topIds.map(async (id) => {
        try {
          const itemRes = await fetch(`https://hacker-news.firebaseio.com/v0/item/${id}.json`);
          if (!itemRes.ok) return null;
          return await itemRes.json();
        } catch {
          return null;
        }
      })
    );

    return items
      .filter((item) => item && item.title && item.url)
      .map((item) => {
        const category = inferCategory(item.title, '', 'Dev & Open Source');
        return {
          id: `hn-${item.id}`,
          title: item.title,
          summary: `História em alta no Hacker News com ${item.score || 0} pontos e ${item.descendants || 0} comentários da comunidade dev mundial.`,
          content: `Discussão técnica ao vivo em destaque na plataforma global Hacker News (Y Combinator).\n\nPontos de relevância: ${item.score || 0} upvotes registrados.\nArtigo original referenciado pela comunidade técnica: ${item.url}`,
          category,
          author: {
            name: item.by || 'Hacker News Community',
            avatar: 'https://api.dicebear.com/7.x/identicon/svg?seed=hackernews',
            role: 'Comunidade Tech YC'
          },
          publishedAt: formatRelativeTime(new Date(item.time * 1000).toISOString()),
          timestamp: item.time * 1000,
          readTime: '3 min de leitura',
          imageUrl: CATEGORY_IMAGES[category][0],
          likes: 0,
          views: 0,
          breaking: (item.score || 0) > 300,
          trending: true,
          tags: ['HackerNews', 'OpenSource', 'Dev', category.split(' ')[0]],
          commentsCount: item.descendants || 0,
          source: 'Hacker News',
          sourceUrl: item.url,
          sourceDomain: 'news.ycombinator.com',
          keyTakeaways: [
            `Registou mais de ${item.score || 0} recomendações de engenheiros de software`,
            `Debate ativo com ${item.descendants || 0} contribuições`,
            'Publicação verificada no feed global do Y Combinator'
          ]
        };
      });
  } catch (err) {
    console.warn('Erro ao carregar Hacker News:', err);
    return [];
  }
}

export async function fetchAllRealNews(): Promise<RealNewsItem[]> {
  const now = Date.now();
  if (cachedArticles.length > 0 && now - lastFetchTime < CACHE_TTL_MS) {
    return cachedArticles;
  }

  const results: RealNewsItem[] = [];

  // 1. Fetch RSS Feeds in parallel
  const feedPromises = FEEDS.map(async (feed) => {
    try {
      const parsed = await parser.parseURL(feed.url);
      if (!parsed || !parsed.items) return [];

      return parsed.items.slice(0, 8).map((item, idx) => {
        const title = cleanHtml(item.title || 'Novidade Tecnológica');
        const rawSummary = cleanHtml(item.contentSnippet || item.summary || item.content || '');
        const summary = rawSummary.length > 280 ? `${rawSummary.substring(0, 277)}...` : rawSummary || title;
        const category = inferCategory(title, summary, feed.defaultCategory);
        const imageUrl = extractImageFromItem(item, category);
        const pubDate = item.pubDate || item.isoDate;
        const itemTimestamp = pubDate ? new Date(pubDate).getTime() : Date.now() - idx * 60000;

        const cleanContent = cleanHtml(item['content:encoded'] || item.content || summary);
        const fullContent = cleanContent.length > 300
          ? cleanContent
          : `${summary}\n\nNotícia apurada e publicada originalmente por ${feed.name} (${feed.domain}). Acompanhe a cobertura completa e detalhes técnicos no artigo original.`;

        const article: RealNewsItem = {
          id: `real-${feed.name.toLowerCase().replace(/[^a-z0-9]/g, '')}-${Math.abs((title + itemTimestamp).split('').reduce((acc, c) => acc + c.charCodeAt(0), 0))}`,
          title,
          summary,
          content: fullContent,
          category,
          author: {
            name: item.creator || item.author || feed.name,
            avatar: feed.avatar,
            role: `Redação ${feed.name}`
          },
          publishedAt: formatRelativeTime(pubDate),
          timestamp: itemTimestamp,
          readTime: `${Math.max(2, Math.min(8, Math.ceil(fullContent.length / 500)))} min de leitura`,
          imageUrl,
          likes: 0,
          views: 0,
          breaking: idx === 0 && (category === 'Inteligência Artificial' || category === 'Cibersegurança'),
          trending: idx < 2,
          tags: [feed.name.replace(/\s+/g, ''), category.split(' ')[0], 'TechLive'],
          commentsCount: 0,
          source: feed.name,
          sourceUrl: item.link || `https://${feed.domain}`,
          sourceDomain: feed.domain,
          keyTakeaways: [
            `Notícia real e verificada via ${feed.name} (${feed.domain})`,
            `Categoria: ${category}`,
            'Link oficial direto disponível para leitura integral'
          ]
        };
        return article;
      });
    } catch (err: any) {
      console.warn(`Aviso ao ler feed RSS de ${feed.name} (${feed.url}):`, err?.message || err);
      return [];
    }
  });

  // 2. Fetch Hacker News in parallel
  const [feedResults, hnResults] = await Promise.all([
    Promise.all(feedPromises),
    fetchHackerNews()
  ]);

  feedResults.forEach((items) => {
    results.push(...items);
  });
  results.push(...hnResults);

  // Sort by timestamp descending
  results.sort((a, b) => b.timestamp - a.timestamp);

  if (results.length > 0) {
    cachedArticles = results;
    lastFetchTime = now;
  }

  return cachedArticles;
}

export function getActiveSources() {
  return FEEDS.map(f => ({
    name: f.name,
    domain: f.domain,
    avatar: f.avatar
  }));
}
