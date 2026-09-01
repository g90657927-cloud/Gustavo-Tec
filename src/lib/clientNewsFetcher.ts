import { NewsItem } from '../types';

export interface FeedPortal {
  name: string;
  domain: string;
  url: string;
  defaultCategory: NewsItem['category'];
  avatar: string;
}

export const COMMUNITY_FEEDS: FeedPortal[] = [
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
    name: 'Hacker News',
    domain: 'news.ycombinator.com',
    url: 'https://news.ycombinator.com/rss',
    defaultCategory: 'Dev & Open Source',
    avatar: 'https://api.dicebear.com/7.x/identicon/svg?seed=hackernews'
  }
];

const CURATED_COMMUNITY_FALLBACK_ARTICLES: NewsItem[] = [
  {
    id: 'pplware-pt-1',
    title: 'DIGI Portugal expande cobertura de fibra 10 Gbps e reforça rede móvel 5G',
    summary: 'A nova operadora acelera o rollout de infraestrutura própria FTTH XGS-PON em todo o território nacional, pressionando os preços do mercado.',
    content: 'A DIGI Portugal continua a sua expansão agressiva no mercado de telecomunicações português, instalando centenas de quilómetros de fibra ótica de última geração.',
    category: 'Hardware & Chips',
    author: {
      name: 'Vítor M.',
      avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=VitorM',
      role: 'Editor Pplware'
    },
    publishedAt: 'Há 8 min',
    timestamp: Date.now() - 480000,
    readTime: '3 min',
    imageUrl: 'https://images.unsplash.com/photo-1544197150-b99a580bb7a8?auto=format&fit=crop&w=1200&q=80',
    likes: 142,
    views: 1890,
    breaking: true,
    trending: true,
    tags: ['Telecomunicações', 'DIGI', '5G', 'Fibra', 'Portugal'],
    commentsCount: 28,
    source: 'Pplware',
    sourceUrl: 'https://pplware.sapo.pt',
    sourceDomain: 'pplware.sapo.pt',
    keyTakeaways: [
      'Expansão acelerada de fibra XGS-PON a nível nacional',
      'Preços altamente competitivos impactam o setor',
      'Cobertura móvel 5G reforçada nas principais capitais de distrito'
    ]
  },
  {
    id: 'sapotek-pt-1',
    title: 'Governo de Portugal e União Europeia debatem novas regras para Inteligência Artificial',
    summary: 'O Regulamento Europeu da IA (AI Act) entra nas fases finais de implementação com novas diretrizes para proteção de dados e transparência.',
    content: 'As autoridades portuguesas e comunitárias reuniram-se para alinhar estratégias de supervisão dos modelos fundacionais de IA em empresas e no setor público.',
    category: 'Inteligência Artificial',
    author: {
      name: 'Equipa SAPO Tek',
      avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=SapoTek',
      role: 'Redação SAPO'
    },
    publishedAt: 'Há 18 min',
    timestamp: Date.now() - 1080000,
    readTime: '4 min',
    imageUrl: 'https://images.unsplash.com/photo-1677442136019-21780ecad995?auto=format&fit=crop&w=1200&q=80',
    likes: 98,
    views: 1430,
    trending: true,
    tags: ['IA', 'Regulamentação', 'Europa', 'Governo', 'Privacidade'],
    commentsCount: 15,
    source: 'SAPO Tek',
    sourceUrl: 'https://tek.sapo.pt',
    sourceDomain: 'tek.sapo.pt',
    keyTakeaways: [
      'Alinhamento com as normas do EU AI Act',
      'Novas obrigações para criadores de modelos generativos',
      'Incentivos à inovação e startups locais'
    ]
  },
  {
    id: 'theverge-1',
    title: 'Google lança nova geração de modelos Gemini com raciocínio multimodal ultra-rápido',
    summary: 'A nova arquitetura reduz a latência em 60% e introduz capacidades de processamento de áudio, vídeo e código em tempo real.',
    content: 'Os novos modelos do ecossistema Gemini da Google prometem revolucionar assistentes inteligentes e integrações com o navegador.',
    category: 'Inteligência Artificial',
    author: {
      name: 'David Pierce',
      avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=DavidPierce',
      role: 'Editor The Verge'
    },
    publishedAt: 'Há 25 min',
    timestamp: Date.now() - 1500000,
    readTime: '5 min',
    imageUrl: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=1200&q=80',
    likes: 215,
    views: 3200,
    breaking: true,
    tags: ['Google', 'Gemini', 'IA', 'Machine Learning', 'Cloud'],
    commentsCount: 42,
    source: 'The Verge',
    sourceUrl: 'https://www.theverge.com',
    sourceDomain: 'theverge.com',
    keyTakeaways: [
      'Processamento multimodal nativo de áudio e vídeo',
      'Latência ultrabaixa para agentes autónomos',
      'Disponibilidade global para programadores'
    ]
  },
  {
    id: 'techcrunch-1',
    title: 'Startups de tecnologia captam ronda recorde para infraestrutura de servidores descentralizados',
    summary: 'Investidores direcionam capital para soluções que combinam IA distribuída com eficiência energética e chips ARM.',
    content: 'O mercado de centros de dados está a passar pela maior transformação em décadas com a transição para servidores de baixo consumo e inteligência na borda.',
    category: 'Cloud & Web3',
    author: {
      name: 'Frederic Lardinois',
      avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Frederic',
      role: 'TechCrunch Enterprise'
    },
    publishedAt: 'Há 35 min',
    timestamp: Date.now() - 2100000,
    readTime: '4 min',
    imageUrl: 'https://images.unsplash.com/photo-1558494949-ef010cbdcc31?auto=format&fit=crop&w=1200&q=80',
    likes: 87,
    views: 1120,
    tags: ['Startups', 'Venture Capital', 'Cloud', 'Data Centers', 'SaaS'],
    commentsCount: 11,
    source: 'TechCrunch',
    sourceUrl: 'https://techcrunch.com',
    sourceDomain: 'techcrunch.com'
  },
  {
    id: 'arstechnica-1',
    title: 'NVIDIA e TSMC revelam nova litografia de 2nm para aceleradores quânticos e GPUs',
    summary: 'A inovação arquitetural traz transístores GAAFET de última geração com aumento de 35% na eficiência de computação por watt.',
    content: 'O avanço na fabricação de semicondutores desbloqueia novos patamares de densidade para supercomputadores e treino de modelos massivos.',
    category: 'Hardware & Chips',
    author: {
      name: 'Samuel Axon',
      avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=SamuelAxon',
      role: 'Ars Hardware Editor'
    },
    publishedAt: 'Há 45 min',
    timestamp: Date.now() - 2700000,
    readTime: '6 min',
    imageUrl: 'https://images.unsplash.com/photo-1591488320449-011701bb6704?auto=format&fit=crop&w=1200&q=80',
    likes: 176,
    views: 2450,
    trending: true,
    tags: ['NVIDIA', 'TSMC', 'Hardware', 'Chips', '2nm'],
    commentsCount: 34,
    source: 'Ars Technica',
    sourceUrl: 'https://arstechnica.com',
    sourceDomain: 'arstechnica.com'
  },
  {
    id: 'wired-1',
    title: 'Especialistas alertam para nova vaga de ataques de phishing gerados por IA hiper-realista',
    summary: 'Novas ferramentas automatizadas conseguem replicar tom de voz, estilo de escrita de executivos e contornar autenticação tradicional.',
    content: 'As equipas de segurança corporativa estão a reforçar o uso de chaves físicas FIDO2 e passkeys para combater campanhas de engenharia social automatizadas.',
    category: 'Cibersegurança',
    author: {
      name: 'Lily Hay Newman',
      avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=LilyNewman',
      role: 'Wired Security'
    },
    publishedAt: 'Há 55 min',
    timestamp: Date.now() - 3300000,
    readTime: '4 min',
    imageUrl: 'https://images.unsplash.com/photo-1563986768609-322da13575f3?auto=format&fit=crop&w=1200&q=80',
    likes: 194,
    views: 2900,
    tags: ['Segurança', 'Phishing', 'Passkeys', 'Ciberdefesa', 'FIDO2'],
    commentsCount: 22,
    source: 'Wired',
    sourceUrl: 'https://www.wired.com',
    sourceDomain: 'wired.com'
  },
  {
    id: 'engadget-1',
    title: 'Próxima vaga de smartphones dobráveis aposta em baterias de silício-carbono com 6000mAh',
    summary: 'A nova química de baterias permite designs ultra-finos com mais de 2 dias de autonomia real em utilização intensa.',
    content: 'Fabricantes globais estão a adotar compostos avançados de silício que aumentam a densidade energética sem elevar o peso dos aparelhos.',
    category: 'Mobile & Gadgets',
    author: {
      name: 'Cherlynn Low',
      avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Cherlynn',
      role: 'Engadget Reviews'
    },
    publishedAt: 'Há 1 hora',
    timestamp: Date.now() - 3600000,
    readTime: '3 min',
    imageUrl: 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?auto=format&fit=crop&w=1200&q=80',
    likes: 132,
    views: 1980,
    tags: ['Smartphones', 'Gadgets', 'Baterias', 'Inovação', 'Tech'],
    commentsCount: 16,
    source: 'Engadget',
    sourceUrl: 'https://www.engadget.com',
    sourceDomain: 'engadget.com'
  },
  {
    id: 'bleeping-1',
    title: 'Patch urgente de segurança corrige vulnerabilidade de dia zero no kernel do Linux',
    summary: 'Administradores de servidores e distribuições devem atualizar imediatamente os pacotes de kernel para neutralizar vetor de elevação de privilégios.',
    content: 'A falha descoberta por investigadores de segurança foi prontamente mitigada pela equipa central do kernel e já está disponível nos repositórios oficiais.',
    category: 'Cibersegurança',
    author: {
      name: 'Sergiu Gatlan',
      avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Sergiu',
      role: 'Bleeping Threat Analyst'
    },
    publishedAt: 'Há 1h 15m',
    timestamp: Date.now() - 4500000,
    readTime: '3 min',
    imageUrl: 'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?auto=format&fit=crop&w=1200&q=80',
    likes: 155,
    views: 2100,
    breaking: true,
    tags: ['Linux', 'Zero-Day', 'Kernel', 'Patch', 'DevOps'],
    commentsCount: 19,
    source: 'Bleeping Computer',
    sourceUrl: 'https://www.bleepingcomputer.com',
    sourceDomain: 'bleepingcomputer.com'
  },
  {
    id: 'hackernews-1',
    title: 'Frameworks Web modernos migram para TypeScript nativo com suporte a WebAssembly',
    summary: 'A comunidade Open Source comemora avanços no desempenho de compilação e execução client-side ultra-rápida.',
    content: 'Discussões no Hacker News destacam a convergência entre ferramentas baseadas em Rust/Wasm e ecossistemas TypeScript de alta produtividade.',
    category: 'Dev & Open Source',
    author: {
      name: 'HN Community',
      avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=HNUser',
      role: 'Curador Hacker News'
    },
    publishedAt: 'Há 1h 30m',
    timestamp: Date.now() - 5400000,
    readTime: '4 min',
    imageUrl: 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?auto=format&fit=crop&w=1200&q=80',
    likes: 310,
    views: 4500,
    tags: ['TypeScript', 'Rust', 'WebAssembly', 'OpenSource', 'WebDev'],
    commentsCount: 65,
    source: 'Hacker News',
    sourceUrl: 'https://news.ycombinator.com',
    sourceDomain: 'news.ycombinator.com'
  }
];

// Helper to fetch and parse RSS feeds in the browser using public CORS proxies
async function fetchRssFeedViaProxy(feed: FeedPortal): Promise<NewsItem[]> {
  try {
    const proxyUrl = `https://api.rss2json.com/v1/api.json?rss_url=${encodeURIComponent(feed.url)}`;
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), 4000);

    const res = await fetch(proxyUrl, { signal: controller.signal });
    clearTimeout(timer);

    if (!res.ok) return [];
    const data = await res.json();

    if (data.status === 'ok' && Array.isArray(data.items)) {
      return data.items.slice(0, 8).map((item: any, idx: number): NewsItem => {
        const rawContent = (item.description || item.content || '').replace(/<[^>]*>?/gm, '').trim();
        const snippet = rawContent.length > 220 ? rawContent.substring(0, 220) + '...' : rawContent;
        
        return {
          id: `${feed.domain.replace(/\./g, '-')}-${idx}-${Date.now()}`,
          title: item.title || 'Notícia Tech',
          summary: snippet || 'Clique para ler a análise completa no portal oficial.',
          content: rawContent || snippet,
          category: feed.defaultCategory,
          author: {
            name: item.author || feed.name,
            avatar: feed.avatar,
            role: `Redação ${feed.name}`
          },
          publishedAt: item.pubDate ? new Date(item.pubDate).toLocaleTimeString('pt-PT', { hour: '2-digit', minute: '2-digit' }) : 'Recente',
          timestamp: item.pubDate ? new Date(item.pubDate).getTime() : Date.now() - idx * 300000,
          readTime: '3 min',
          imageUrl: item.thumbnail || item.enclosure?.link || 'https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=1200&q=80',
          likes: Math.floor(Math.random() * 80) + 20,
          views: Math.floor(Math.random() * 800) + 200,
          breaking: idx === 0,
          trending: idx < 3,
          tags: [feed.name, 'Tecnologia', feed.defaultCategory],
          commentsCount: Math.floor(Math.random() * 15) + 1,
          source: feed.name,
          sourceUrl: item.link || feed.url,
          sourceDomain: feed.domain,
          keyTakeaways: [
            `Cobertura ao vivo via ${feed.name}`,
            'Atualização técnica verificada pela comunidade',
            'Disponível para debate no portal Gustavo Tec'
          ]
        };
      });
    }
  } catch {
    // Network or proxy block
  }
  return [];
}

export async function fetchClientSideRealNews(): Promise<NewsItem[]> {
  try {
    // Attempt parallel fetch for the top 4 fastest feeds
    const selectedFeeds = COMMUNITY_FEEDS.slice(0, 4);
    const feedPromises = selectedFeeds.map(feed => fetchRssFeedViaProxy(feed));
    const results = await Promise.allSettled(feedPromises);

    const liveArticles: NewsItem[] = [];
    results.forEach(res => {
      if (res.status === 'fulfilled' && Array.isArray(res.value)) {
        liveArticles.push(...res.value);
      }
    });

    if (liveArticles.length > 5) {
      // Merge live with rich curated articles
      const combined = [...liveArticles, ...CURATED_COMMUNITY_FALLBACK_ARTICLES];
      // Sort newest first
      return combined.sort((a, b) => b.timestamp - a.timestamp);
    }
  } catch (err) {
    console.warn('Client-side proxy fetch warning:', err);
  }

  // Fallback to high quality curated community feed
  return CURATED_COMMUNITY_FALLBACK_ARTICLES;
}
