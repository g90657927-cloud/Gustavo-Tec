import React, { createContext, useContext, useState, useEffect, useRef, useCallback } from 'react';
import { NewsItem, NewsComment, BreakingAlert, TechCategory, UserRole } from '../types';
import { 
  INITIAL_NEWS, 
  INITIAL_BREAKING_ALERTS, 
  INITIAL_COMMENTS 
} from '../data/newsDatabase';
import { useAuth, isFounderEmail } from './AuthContext';

export interface NewsSourceInfo {
  name: string;
  domain: string;
  avatar: string;
}

interface NewsContextType {
  news: NewsItem[];
  allRealArticles: NewsItem[];
  breakingAlerts: BreakingAlert[];
  comments: Record<string, NewsComment[]>;
  allLiveComments: NewsComment[];
  selectedCategory: TechCategory;
  selectedSource: string;
  searchQuery: string;
  sortBy: 'recent' | 'popular' | 'comments';
  countdown: number;
  isAutoRefreshActive: boolean;
  totalNewStoriesReceived: number;
  lastUpdatedTime: Date;
  selectedNews: NewsItem | null;
  isLoadingNews: boolean;
  availableSources: NewsSourceInfo[];
  
  setSelectedCategory: (cat: TechCategory) => void;
  setSelectedSource: (source: string) => void;
  setSearchQuery: (query: string) => void;
  setSortBy: (sort: 'recent' | 'popular' | 'comments') => void;
  toggleAutoRefresh: () => void;
  triggerManualRefresh: () => void;
  setSelectedNews: (news: NewsItem | null) => void;
  
  addComment: (newsId: string, content: string) => void;
  reactToComment: (newsId: string, commentId: string, reaction: 'like' | 'fire' | 'brain' | 'rocket') => void;
  toggleLikeNews: (newsId: string) => void;
  likedNewsIds: string[];
}

const NewsContext = createContext<NewsContextType | undefined>(undefined);

// Web Audio API beep generator for subtle tech ping
const playTechPing = () => {
  try {
    const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
    if (!AudioCtx) return;
    const ctx = new AudioCtx();
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.type = 'sine';
    osc.frequency.setValueAtTime(880, ctx.currentTime); // A5
    osc.frequency.exponentialRampToValueAtTime(1320, ctx.currentTime + 0.1); // E6

    gain.gain.setValueAtTime(0.04, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.15);

    osc.connect(gain);
    gain.connect(ctx.destination);

    osc.start();
    osc.stop(ctx.currentTime + 0.15);
  } catch {
    // ignore audio block
  }
};

let globalIdCounter = 0;
const generateUniqueId = (prefix: string) => {
  globalIdCounter += 1;
  return `${prefix}-${Date.now()}-${Math.random().toString(36).substring(2, 8)}-${globalIdCounter}`;
};

export const NewsProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user } = useAuth();
  
  const [news, setNews] = useState<NewsItem[]>(() => {
    try {
      const saved = localStorage.getItem('gustavo_tec_real_news_v3');
      if (saved) return JSON.parse(saved);
    } catch {}
    return INITIAL_NEWS;
  });

  const [allRealArticles, setAllRealArticles] = useState<NewsItem[]>([]);
  const [availableSources, setAvailableSources] = useState<NewsSourceInfo[]>([]);
  const [breakingAlerts, setBreakingAlerts] = useState<BreakingAlert[]>(INITIAL_BREAKING_ALERTS);
  const [isLoadingNews, setIsLoadingNews] = useState(false);

  const [comments, setComments] = useState<Record<string, NewsComment[]>>(() => {
    try {
      const saved = localStorage.getItem('gustavo_tec_comments_v3');
      if (saved) return JSON.parse(saved);
    } catch {}
    return INITIAL_COMMENTS;
  });

  const [selectedCategory, setSelectedCategory] = useState<TechCategory>('Todas');
  const [selectedSource, setSelectedSource] = useState<string>('Todas');
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState<'recent' | 'popular' | 'comments'>('recent');
  
  // 10s countdown timer
  const [countdown, setCountdown] = useState(10);
  const [isAutoRefreshActive, setIsAutoRefreshActive] = useState(true);
  const [totalNewStoriesReceived, setTotalNewStoriesReceived] = useState(0);
  const [lastUpdatedTime, setLastUpdatedTime] = useState<Date>(new Date());
  
  const [selectedNews, setSelectedNews] = useState<NewsItem | null>(null);
  const [likedNewsIds, setLikedNewsIds] = useState<string[]>([]);
  
  const newsRef = useRef(news);
  newsRef.current = news;
  const poolRef = useRef<NewsItem[]>([]);
  poolRef.current = allRealArticles;
  const poolIndexRef = useRef(0);
  const userRef = useRef(user);
  userRef.current = user;

  // Fetch real multi-source news from server backend (/api/news/live)
  const fetchLiveRealNews = useCallback(async () => {
    setIsLoadingNews(true);
    try {
      const res = await fetch('/api/news/live');
      if (res.ok) {
        const json = await res.json();
        if (json && json.success && Array.isArray(json.news) && json.news.length > 0) {
          const fetchedNews: NewsItem[] = json.news;
          setAllRealArticles(fetchedNews);
          
          // Initial display set (first 25 articles)
          setNews(prev => {
            // Keep any user-liked status or comments count from previous
            const updated = fetchedNews.map(item => {
              const prevItem = prev.find(p => p.id === item.id || p.title === item.title);
              return prevItem ? { ...item, likes: prevItem.likes, commentsCount: prevItem.commentsCount } : item;
            });
            return updated.slice(0, 30);
          });

          // Generate real breaking ticker alerts
          const newAlerts: BreakingAlert[] = fetchedNews.slice(0, 6).map((item, idx) => ({
            id: generateUniqueId(`alert-real-${idx}`),
            title: `[${item.source}] ${item.title}`,
            category: item.category,
            time: item.publishedAt || 'Recente',
            isUrgent: item.breaking || idx === 0
          }));
          setBreakingAlerts(newAlerts);

          // Extract distinct sources
          const sourceMap = new Map<string, NewsSourceInfo>();
          fetchedNews.forEach(item => {
            if (item.source && !sourceMap.has(item.source)) {
              sourceMap.set(item.source, {
                name: item.source,
                domain: item.sourceDomain || item.source.toLowerCase().replace(/\s+/g, '') + '.com',
                avatar: item.author?.avatar || 'https://api.dicebear.com/7.x/identicon/svg?seed=' + item.source
              });
            }
          });
          setAvailableSources(Array.from(sourceMap.values()));
        }
      }
    } catch (err) {
      console.warn('Aviso ao carregar notícias dos feeds externos:', err);
    } finally {
      setIsLoadingNews(false);
      setLastUpdatedTime(new Date());
    }
  }, []);

  // Fetch on mount
  useEffect(() => {
    fetchLiveRealNews();
  }, [fetchLiveRealNews]);

  // Save to local storage
  useEffect(() => {
    try {
      localStorage.setItem('gustavo_tec_real_news_v3', JSON.stringify(news.slice(0, 30)));
    } catch {}
  }, [news]);

  useEffect(() => {
    try {
      localStorage.setItem('gustavo_tec_comments_v3', JSON.stringify(comments));
    } catch {}
  }, [comments]);

  // Function called every 10 seconds to cycle/introduce real fresh stories
  const pushRealUpdate = useCallback(() => {
    setLastUpdatedTime(new Date());
    const pool = poolRef.current;

    if (pool.length > 0) {
      // Pick next article from the multi-site pool
      const nextIndex = poolIndexRef.current % pool.length;
      poolIndexRef.current += 1;
      const candidate = pool[nextIndex];

      if (candidate) {
        setNews(prev => {
          // If already in top 3, rotate with timestamp refresh
          const existing = prev.find(p => p.id === candidate.id || p.title === candidate.title);
          const freshArticle: NewsItem = {
            ...(existing || candidate),
            publishedAt: 'Agora mesmo',
            timestamp: Date.now(),
            breaking: Math.random() > 0.65
          };

          const filtered = prev.filter(p => p.id !== freshArticle.id && p.title !== freshArticle.title);
          return [freshArticle, ...filtered.slice(0, 29)];
        });

        setTotalNewStoriesReceived(prev => prev + 1);

        // Update breaking ticker
        const newAlert: BreakingAlert = {
          id: generateUniqueId('alert-10s'),
          title: `[${candidate.source}] ${candidate.title}`,
          category: candidate.category,
          time: 'Agora',
          isUrgent: candidate.breaking || false
        };

        setBreakingAlerts(prev => [newAlert, ...prev.slice(0, 5)]);

        if (userRef.current?.soundEnabled) {
          playTechPing();
        }
      }
    }
  }, []);

  const pushRealUpdateRef = useRef(pushRealUpdate);
  pushRealUpdateRef.current = pushRealUpdate;

  // 10s Countdown interval
  useEffect(() => {
    if (!isAutoRefreshActive) return;

    let currentSec = 10;
    const interval = setInterval(() => {
      currentSec -= 1;
      if (currentSec <= 0) {
        currentSec = 10;
        setCountdown(10);
        pushRealUpdateRef.current();
      } else {
        setCountdown(currentSec);
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [isAutoRefreshActive]);

  const triggerManualRefresh = () => {
    fetchLiveRealNews();
    setCountdown(10);
  };

  const toggleAutoRefresh = () => {
    setIsAutoRefreshActive(prev => !prev);
  };

  // Add comment function (Real user comments)
  const addComment = (newsId: string, content: string) => {
    if (!content.trim()) return;

    const isFounder = isFounderEmail(user?.email);
    const author = user
      ? {
          id: user.id,
          name: user.name,
          username: user.username,
          avatar: user.avatar,
          role: (isFounder ? 'Administrador' : (user.role || 'Dev Full-Stack')) as UserRole,
          badge: isFounder ? '👑 Administrador' : (user.badges[0] || 'Membro')
        }
      : {
          id: 'guest',
          name: 'Visitante Tech',
          username: 'visitante',
          avatar: 'https://api.dicebear.com/7.x/bottts/svg?seed=guest',
          role: 'Entusiasta de Tecnologia',
          badge: 'Visitante'
        };

    const newComment: NewsComment = {
      id: generateUniqueId('c-user'),
      newsId,
      author,
      content: content.trim(),
      createdAt: 'Agora mesmo',
      timestamp: Date.now(),
      likes: 1,
      userLiked: true,
      reactions: { fire: 1, brain: 1, rocket: 1 }
    };

    setComments(prev => ({
      ...prev,
      [newsId]: [newComment, ...(prev[newsId] || [])]
    }));

    setNews(prev =>
      prev.map(n => (n.id === newsId ? { ...n, commentsCount: (prev[newsId]?.length || 0) + 1 } : n))
    );

    if (user) {
      user.commentsCount = (user.commentsCount || 0) + 1;
    }
  };

  const reactToComment = (
    newsId: string,
    commentId: string,
    reactionType: 'like' | 'fire' | 'brain' | 'rocket'
  ) => {
    setComments(prev => {
      const newsComments = prev[newsId] || [];
      const updated = newsComments.map(c => {
        if (c.id === commentId) {
          if (reactionType === 'like') {
            const isLiked = c.userLiked;
            return {
              ...c,
              likes: isLiked ? c.likes - 1 : c.likes + 1,
              userLiked: !isLiked
            };
          } else {
            const currentReactions = c.reactions || { fire: 0, brain: 0, rocket: 0 };
            return {
              ...c,
              reactions: {
                ...currentReactions,
                [reactionType]: currentReactions[reactionType] + 1
              }
            };
          }
        }
        return c;
      });
      return { ...prev, [newsId]: updated };
    });
  };

  const toggleLikeNews = (newsId: string) => {
    const isLiked = likedNewsIds.includes(newsId);
    setLikedNewsIds(prev => (isLiked ? prev.filter(id => id !== newsId) : [...prev, newsId]));
    setNews(prev =>
      prev.map(n => {
        if (n.id === newsId) {
          return { ...n, likes: isLiked ? n.likes - 1 : n.likes + 1 };
        }
        return n;
      })
    );
  };

  const allLiveComments: NewsComment[] = Object.values(comments).flat().sort((a, b) => b.timestamp - a.timestamp);

  return (
    <NewsContext.Provider
      value={{
        news,
        allRealArticles,
        breakingAlerts,
        comments,
        allLiveComments,
        selectedCategory,
        selectedSource,
        searchQuery,
        sortBy,
        countdown,
        isAutoRefreshActive,
        totalNewStoriesReceived,
        lastUpdatedTime,
        selectedNews,
        isLoadingNews,
        availableSources,
        setSelectedCategory,
        setSelectedSource,
        setSearchQuery,
        setSortBy,
        toggleAutoRefresh,
        triggerManualRefresh,
        setSelectedNews,
        addComment,
        reactToComment,
        toggleLikeNews,
        likedNewsIds
      }}
    >
      {children}
    </NewsContext.Provider>
  );
};

export const useNews = () => {
  const context = useContext(NewsContext);
  if (!context) {
    throw new Error('useNews must be used within a NewsProvider');
  }
  return context;
};
