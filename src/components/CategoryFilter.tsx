import React from 'react';
import { TechCategory } from '../types';
import { useNews } from '../context/NewsContext';
import { useAuth } from '../context/AuthContext';
import { 
  Sparkles, 
  Cpu, 
  Terminal, 
  ShieldAlert, 
  Smartphone, 
  Rocket, 
  Cloud, 
  Layers,
  ArrowUpDown,
  Search,
  Globe,
  RefreshCw
} from 'lucide-react';

const CATEGORIES: { label: TechCategory; icon: React.ReactNode }[] = [
  { label: 'Todas', icon: <Layers className="w-3.5 h-3.5" /> },
  { label: 'Inteligência Artificial', icon: <Sparkles className="w-3.5 h-3.5 text-purple-400" /> },
  { label: 'Hardware & Chips', icon: <Cpu className="w-3.5 h-3.5 text-cyan-400" /> },
  { label: 'Dev & Open Source', icon: <Terminal className="w-3.5 h-3.5 text-emerald-400" /> },
  { label: 'Cibersegurança', icon: <ShieldAlert className="w-3.5 h-3.5 text-rose-400" /> },
  { label: 'Mobile & Gadgets', icon: <Smartphone className="w-3.5 h-3.5 text-amber-400" /> },
  { label: 'Espaço & Robótica', icon: <Rocket className="w-3.5 h-3.5 text-indigo-400" /> },
  { label: 'Cloud & Web3', icon: <Cloud className="w-3.5 h-3.5 text-sky-400" /> }
];

export const CategoryFilter: React.FC = React.memo(() => {
  const { 
    selectedCategory, 
    setSelectedCategory, 
    selectedSource,
    setSelectedSource,
    availableSources,
    sortBy, 
    setSortBy, 
    searchQuery, 
    setSearchQuery,
    news,
    isLoadingNews,
    triggerManualRefresh
  } = useNews();

  const { user } = useAuth();

  return (
    <div className="space-y-4 mb-6">
      {/* Search & Sort Controls row with Liquid Glass */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
        {/* Search input */}
        <div className="relative flex-1 max-w-lg">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-cyan-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            placeholder="Pesquisar em notícias reais (Pplware, The Verge, TechCrunch, Hacker News...)"
            className="w-full liquid-glass focus:border-cyan-400/60 rounded-2xl pl-10 pr-4 py-2 text-xs sm:text-sm text-slate-100 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-cyan-500/20 transition-all shadow-[inset_0_1px_1px_rgba(255,255,255,0.08)]"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-slate-400 hover:text-white px-2 py-0.5 rounded-lg bg-slate-800/80 hover:bg-slate-700 cursor-pointer transition-colors"
            >
              Limpar
            </button>
          )}
        </div>

        {/* Sort selector & manual refresh */}
        <div className="flex items-center gap-2 self-end sm:self-auto shrink-0">
          <button
            onClick={triggerManualRefresh}
            disabled={isLoadingNews}
            title="Atualizar notícias agora dos feeds"
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-2xl liquid-glass hover:border-cyan-400/50 text-slate-300 hover:text-white text-xs font-semibold transition-all cursor-pointer disabled:opacity-50 shadow-[0_2px_10px_rgba(0,0,0,0.2)] hover:shadow-[0_0_15px_rgba(6,182,212,0.2)]"
          >
            <RefreshCw className={`w-3.5 h-3.5 text-cyan-400 ${isLoadingNews ? 'animate-spin' : ''}`} />
            <span className="hidden sm:inline">Sincronizar Feeds</span>
          </button>

          <div className="flex items-center gap-1 liquid-glass p-1 rounded-2xl">
            <ArrowUpDown className="w-3.5 h-3.5 text-slate-400 ml-2" />
            <span className="text-xs text-slate-400 font-medium hidden md:inline">Ordenar:</span>
            
            <button
              onClick={() => setSortBy('recent')}
              className={`px-3 py-1 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                sortBy === 'recent'
                  ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-400/40 shadow-[0_0_10px_rgba(6,182,212,0.2)]'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              Recentes
            </button>
            
            <button
              onClick={() => setSortBy('popular')}
              className={`px-3 py-1 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                sortBy === 'popular'
                  ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-400/40 shadow-[0_0_10px_rgba(6,182,212,0.2)]'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              Populares
            </button>
            
            <button
              onClick={() => setSortBy('comments')}
              className={`px-3 py-1 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                sortBy === 'comments'
                  ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-400/40 shadow-[0_0_10px_rgba(6,182,212,0.2)]'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              Debates
            </button>
          </div>
        </div>
      </div>

      {/* Sources Filter Row (Multi-site portals) */}
      {availableSources.length > 0 && (
        <div className="space-y-2 pt-1">
          <div className="flex items-center gap-2 text-xs text-slate-400 font-medium px-1">
            <Globe className="w-3.5 h-3.5 text-cyan-400" />
            <span>Filtrar por Portal / Fonte de Notícias:</span>
          </div>

          <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
            <button
              onClick={() => setSelectedSource('Todas')}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-all cursor-pointer whitespace-nowrap ${
                selectedSource === 'Todas'
                  ? 'bg-gradient-to-r from-cyan-400 to-blue-500 text-slate-950 font-bold shadow-[0_0_15px_rgba(6,182,212,0.4)]'
                  : 'liquid-glass-subtle text-slate-400 hover:text-slate-200 hover:border-white/20'
              }`}
            >
              Todas as Fontes ({news.length})
            </button>

            {availableSources.map(src => {
              const isSelected = selectedSource === src.name;
              const count = news.filter(n => n.source === src.name).length;
              return (
                <button
                  key={src.name}
                  onClick={() => setSelectedSource(src.name)}
                  className={`flex items-center gap-2 px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-all cursor-pointer whitespace-nowrap ${
                    isSelected
                      ? 'liquid-glass-active text-cyan-200 font-bold'
                      : 'liquid-glass-subtle text-slate-400 hover:text-slate-200 hover:border-white/20'
                  }`}
                >
                  <img
                    src={src.avatar}
                    alt={src.name}
                    className="w-4 h-4 rounded-full object-cover ring-1 ring-white/20"
                  />
                  <span>{src.name}</span>
                  <span className="text-[10px] opacity-70 font-mono">({count})</span>
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* Category Pills Slider with Bookmarks indicator for logged in users */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none pt-1">
        {CATEGORIES.map(cat => {
          const isSelected = selectedCategory === cat.label;
          const count = cat.label === 'Todas' 
            ? news.length 
            : news.filter(n => n.category === cat.label).length;

          const isUserFavorite = user?.favoriteCategories.includes(cat.label);

          return (
            <button
              key={cat.label}
              onClick={() => setSelectedCategory(cat.label)}
              className={`flex items-center gap-2 px-4 py-2 rounded-2xl text-xs font-semibold whitespace-nowrap transition-all duration-200 cursor-pointer pill-3d ${
                isSelected
                  ? 'bg-gradient-to-r from-slate-100 to-white text-slate-950 shadow-[0_0_20px_rgba(255,255,255,0.25)] font-bold scale-[1.02]'
                  : 'liquid-glass text-slate-300 hover:text-white hover:border-white/20'
              }`}
            >
              {cat.icon}
              <span>{cat.label}</span>
              {isUserFavorite && cat.label !== 'Todas' && (
                <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 shadow-[0_0_6px_rgba(6,182,212,0.9)]" title="Categoria do seu perfil" />
              )}
              <span className={`text-[10px] font-mono px-2 py-0.5 rounded-full ${
                isSelected ? 'bg-slate-300 text-slate-900 font-bold' : 'bg-slate-800/80 text-slate-400 border border-white/5'
              }`}>
                {count}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
});

