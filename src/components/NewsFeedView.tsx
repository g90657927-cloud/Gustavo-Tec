import React, { useMemo } from 'react';
import { useNews } from '../context/NewsContext';
import { TechStatsBanner } from './TechStatsBanner';
import { CategoryFilter } from './CategoryFilter';
import { NewsCard } from './NewsCard';
import { RealTechAdWidget } from './RealTechAdWidget';
import { 
  Flame, 
  Sparkles, 
  Globe, 
  ExternalLink, 
  Zap, 
  RefreshCw,
  Radio,
  ShieldCheck
} from 'lucide-react';

interface NewsFeedViewProps {
  onOpenGemini: () => void;
  onOpenCommunity: () => void;
  onOpenRealAd?: (index: number) => void;
}

export const NewsFeedView: React.FC<NewsFeedViewProps> = ({ 
  onOpenGemini, 
  onOpenCommunity,
  onOpenRealAd 
}) => {
  const { 
    news, 
    selectedCategory, 
    selectedSource, 
    searchQuery, 
    sortBy, 
    isLoadingNews, 
    availableSources,
    triggerManualRefresh 
  } = useNews();

  // Filter and sort news with memoization to prevent UI frame drops
  const sortedNews = useMemo(() => {
    const query = searchQuery.trim().toLowerCase();
    const filtered = news.filter(item => {
      const matchesCategory = selectedCategory === 'Todas' || item.category === selectedCategory;
      const matchesSource = selectedSource === 'Todas' || item.source === selectedSource;
      const matchesSearch = 
        !query ||
        item.title.toLowerCase().includes(query) ||
        item.summary.toLowerCase().includes(query) ||
        (item.category && item.category.toLowerCase().includes(query)) ||
        (item.source && item.source.toLowerCase().includes(query)) ||
        (item.tags && item.tags.some(t => t.toLowerCase().includes(query))) ||
        (item.author?.name && item.author.name.toLowerCase().includes(query));

      return matchesCategory && matchesSource && matchesSearch;
    });

    return [...filtered].sort((a, b) => {
      if (sortBy === 'popular') return b.views - a.views;
      if (sortBy === 'comments') return b.commentsCount - a.commentsCount;
      return b.timestamp - a.timestamp; // recent default
    });
  }, [news, selectedCategory, selectedSource, searchQuery, sortBy]);

  const featuredNews = sortedNews[0];
  const gridNews = useMemo(() => sortedNews.slice(1), [sortedNews]);

  return (
    <div className="space-y-6">
      {/* Real-time Dynamic Stats Banner */}
      <TechStatsBanner onOpenGemini={onOpenGemini} />

      {/* Category selector, Multi-source bar & Search bar */}
      <CategoryFilter />

      {/* Main Content Layout (Grid + Sidebar) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left / Main News Column (8 cols on lg) */}
        <div className="lg:col-span-8 space-y-6">
          
          {isLoadingNews && sortedNews.length === 0 ? (
            <div className="text-center py-20 bg-slate-900/40 rounded-3xl border border-slate-800 p-8 space-y-4">
              <RefreshCw className="w-10 h-10 text-cyan-400 mx-auto animate-spin" />
              <h3 className="text-lg font-bold text-slate-200">A obter notícias reais dos portais...</h3>
              <p className="text-xs text-slate-400 max-w-md mx-auto">
                A sincronizar feeds RSS e APIs em tempo real de Pplware, The Verge, TechCrunch, Wired, Hacker News, SAPO Tek e mais.
              </p>
            </div>
          ) : sortedNews.length === 0 ? (
            <div className="text-center py-16 bg-slate-900/40 rounded-3xl border border-slate-800 p-8 space-y-3">
              <Sparkles className="w-10 h-10 text-slate-600 mx-auto" />
              <h3 className="text-lg font-bold text-slate-300">Nenhuma notícia encontrada</h3>
              <p className="text-sm text-slate-500 max-w-md mx-auto">
                Tente alterar a fonte, categoria ou limpar os termos da busca. Novas notícias continuam sendo sincronizadas!
              </p>
              <button
                onClick={triggerManualRefresh}
                className="mt-2 px-4 py-2 bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold rounded-xl text-xs transition-all cursor-pointer inline-flex items-center gap-1.5"
              >
                <RefreshCw className="w-3.5 h-3.5" />
                <span>Recarregar Todos os Portais</span>
              </button>
            </div>
          ) : (
            <>
              {/* Featured Top Story */}
              {featuredNews && (
                <div>
                  <div className="flex items-center justify-between gap-2 mb-3">
                    <div className="flex items-center gap-2">
                      <span className="flex h-2 w-2 relative">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-cyan-400 opacity-75"></span>
                        <span className="relative inline-flex rounded-full h-2 w-2 bg-cyan-500"></span>
                      </span>
                      <span className="text-xs font-bold text-cyan-400 uppercase tracking-wider font-mono">
                        Destaque em Tempo Real • {featuredNews.source}
                      </span>
                    </div>

                    <span className="text-[11px] text-slate-500 font-mono">
                      {sortedNews.length} {sortedNews.length === 1 ? 'artigo disponível' : 'artigos disponíveis'}
                    </span>
                  </div>
                  <NewsCard news={featuredNews} featured={true} />
                </div>
              )}

              {/* Grid of news */}
              {gridNews.length > 0 && (
                <div className="space-y-3 pt-2">
                  <div className="flex items-center justify-between">
                    <h3 className="text-base font-bold text-slate-200 flex items-center gap-2">
                      <Flame className="w-4 h-4 text-cyan-400" />
                      Feed Multi-Portais de Notícias (10s)
                    </h3>
                    <span className="text-xs text-slate-500 font-mono">
                      {gridNews.length} artigos listados
                    </span>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {gridNews.map(item => (
                      <NewsCard key={item.id} news={item} />
                    ))}
                  </div>
                </div>
              )}
            </>
          )}

        </div>

        {/* Right Sidebar Widgets (4 cols on lg) */}
        <div className="lg:col-span-4 space-y-6">
          
          {/* Real Authentic Tech Ad Widget (DIGI, Google Cloud, Cloudflare, NVIDIA, Starlink) */}
          <RealTechAdWidget onOpenAdModal={onOpenRealAd} />

          {/* Active Verified News Sources Widget */}
          <div className="bg-slate-900/80 border border-slate-800 rounded-3xl p-5 shadow-lg space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Globe className="w-4 h-4 text-cyan-400" />
                <h4 className="text-sm font-bold text-slate-200">Portais de Notícias Conectados</h4>
              </div>
              <span className="text-[10px] font-mono bg-emerald-950 text-emerald-300 border border-emerald-800 px-2 py-0.5 rounded-full font-bold">
                AO VIVO
              </span>
            </div>

            <p className="text-xs text-slate-400 leading-relaxed">
              Notícias apuradas diretamente das principais redações de tecnologia em Portugal e no Mundo:
            </p>

            <div className="space-y-2">
              {[
                { name: 'Pplware', desc: 'Tecnologia, Linux & Dev em Portugal', domain: 'pplware.sapo.pt', flag: '🇵🇹' },
                { name: 'SAPO Tek', desc: 'Telecomunicações, Gadgets e Mercado', domain: 'tek.sapo.pt', flag: '🇵🇹' },
                { name: 'The Verge', desc: 'Ciência, IA e Cultura Digital', domain: 'theverge.com', flag: '🌍' },
                { name: 'TechCrunch', desc: 'Startups, Venture Capital & Inovação', domain: 'techcrunch.com', flag: '🌍' },
                { name: 'Ars Technica', desc: 'Chips, Hardware & Deep Tech', domain: 'arstechnica.com', flag: '🌍' },
                { name: 'Wired', desc: 'Cibersegurança e Futuro Digital', domain: 'wired.com', flag: '🌍' },
                { name: 'Hacker News', desc: 'Comunidade Global de Engenharia YC', domain: 'news.ycombinator.com', flag: '⚡' }
              ].map(source => (
                <a
                  key={source.name}
                  href={`https://${source.domain}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-2.5 bg-slate-950/80 hover:bg-slate-800/80 border border-slate-800/80 hover:border-cyan-500/40 rounded-xl flex items-center justify-between transition-all group"
                >
                  <div className="flex items-center gap-2.5 min-w-0">
                    <span className="text-sm">{source.flag}</span>
                    <div className="min-w-0">
                      <div className="text-xs font-bold text-slate-200 group-hover:text-cyan-300 truncate">
                        {source.name}
                      </div>
                      <div className="text-[10px] text-slate-500 truncate">
                        {source.desc}
                      </div>
                    </div>
                  </div>
                  <ExternalLink className="w-3.5 h-3.5 text-slate-600 group-hover:text-cyan-400 shrink-0 ml-2" />
                </a>
              ))}
            </div>
          </div>

          {/* Google Gemini Card */}
          <div className="bg-gradient-to-br from-blue-950/40 via-slate-900 to-slate-900 border border-blue-800/40 rounded-3xl p-5 shadow-lg space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-blue-500/20 text-blue-400 flex items-center justify-center border border-blue-500/40">
                  <Sparkles className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-blue-200">Google Gemini</h4>
                  <p className="text-[11px] text-slate-400">gemini.google.com</p>
                </div>
              </div>
              <span className="text-[10px] font-mono bg-blue-950 text-blue-300 border border-blue-800 px-2 py-0.5 rounded-full font-semibold">
                OFICIAL
              </span>
            </div>

            <p className="text-xs text-slate-300 leading-relaxed">
              Analise notícias, execute código e formule perguntas avançadas diretamente com o ecossistema do Google Gemini.
            </p>

            <button
              onClick={onOpenGemini}
              className="w-full py-2.5 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-bold rounded-xl text-xs transition-all shadow-md shadow-blue-500/20 cursor-pointer flex items-center justify-center gap-2"
            >
              <span>Abrir Google Gemini</span>
              <Sparkles className="w-3.5 h-3.5" />
            </button>
          </div>

        </div>

      </div>
    </div>
  );
};
