import React, { useState, useEffect, useRef } from 'react';
import { useNews } from '../context/NewsContext';
import { TechCategory } from '../types';
import { 
  Search, 
  X, 
  Filter, 
  Sparkles, 
  Cpu, 
  Terminal, 
  ShieldAlert, 
  Smartphone, 
  Rocket, 
  Cloud, 
  Layers, 
  ChevronDown,
  TrendingUp,
  Tag
} from 'lucide-react';

interface GlobalSearchInputProps {
  onNavigateToNews?: () => void;
}

const CATEGORY_ITEMS: { label: TechCategory; icon: React.ComponentType<{ className?: string }>; color: string }[] = [
  { label: 'Todas', icon: Layers, color: 'text-slate-400' },
  { label: 'Inteligência Artificial', icon: Sparkles, color: 'text-purple-400' },
  { label: 'Hardware & Chips', icon: Cpu, color: 'text-cyan-400' },
  { label: 'Dev & Open Source', icon: Terminal, color: 'text-emerald-400' },
  { label: 'Cibersegurança', icon: ShieldAlert, color: 'text-rose-400' },
  { label: 'Mobile & Gadgets', icon: Smartphone, color: 'text-amber-400' },
  { label: 'Espaço & Robótica', icon: Rocket, color: 'text-indigo-400' },
  { label: 'Cloud & Web3', icon: Cloud, color: 'text-sky-400' }
];

const TRENDING_SEARCHES = ['DIGI', 'Gemini', 'NVIDIA', '5G', 'Fibra', 'Apple', 'Linux', 'OpenAI'];

export const GlobalSearchInput: React.FC<GlobalSearchInputProps> = ({ onNavigateToNews }) => {
  const { 
    searchQuery, 
    setSearchQuery, 
    selectedCategory, 
    setSelectedCategory,
    news
  } = useNews();

  const [isFocused, setIsFocused] = useState(false);
  const [isCategoryMenuOpen, setIsCategoryMenuOpen] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  // Keyboard shortcut: '/' or 'Ctrl+K' / 'Cmd+K' to focus global search
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (
        (e.key === '/' || ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k')) &&
        document.activeElement?.tagName !== 'INPUT' &&
        document.activeElement?.tagName !== 'TEXTAREA'
      ) {
        e.preventDefault();
        inputRef.current?.focus();
      } else if (e.key === 'Escape' && isFocused) {
        setIsFocused(false);
        setIsCategoryMenuOpen(false);
        inputRef.current?.blur();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isFocused]);

  // Close dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setIsFocused(false);
        setIsCategoryMenuOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSearchChange = (val: string) => {
    setSearchQuery(val);
    if (onNavigateToNews) onNavigateToNews();
  };

  const handleSelectCategory = (cat: TechCategory) => {
    setSelectedCategory(cat);
    setIsCategoryMenuOpen(false);
    if (onNavigateToNews) onNavigateToNews();
  };

  const handleClearAll = () => {
    setSearchQuery('');
    if (selectedCategory !== 'Todas') {
      setSelectedCategory('Todas');
    }
    inputRef.current?.focus();
  };

  // Live match counter
  const trimmedQuery = searchQuery.trim().toLowerCase();
  const matchingCount = news.filter(item => {
    const matchesCategory = selectedCategory === 'Todas' || item.category === selectedCategory;
    const matchesQuery = !trimmedQuery ||
      item.title.toLowerCase().includes(trimmedQuery) ||
      item.summary.toLowerCase().includes(trimmedQuery) ||
      (item.category && item.category.toLowerCase().includes(trimmedQuery)) ||
      (item.source && item.source.toLowerCase().includes(trimmedQuery)) ||
      (item.tags && item.tags.some(t => t.toLowerCase().includes(trimmedQuery)));
    return matchesCategory && matchesQuery;
  }).length;

  const currentCategoryObj = CATEGORY_ITEMS.find(c => c.label === selectedCategory) || CATEGORY_ITEMS[0];
  const CategoryIcon = currentCategoryObj.icon;

  return (
    <div ref={containerRef} className="relative flex-1 max-w-[200px] sm:max-w-md md:max-w-lg mx-1 sm:mx-3">
      
      {/* Search Input Bar */}
      <div className={`relative flex items-center bg-slate-900/80 backdrop-blur-xl border rounded-2xl transition-all shadow-[inset_0_1px_1px_rgba(255,255,255,0.08)] ${
        isFocused 
          ? 'border-cyan-400/80 ring-2 ring-cyan-500/20 shadow-[0_0_20px_rgba(6,182,212,0.25)]' 
          : 'border-white/10 hover:border-white/20'
      }`}>
        
        {/* Category Picker Dropdown Button inside Search */}
        <button
          type="button"
          onClick={() => {
            setIsCategoryMenuOpen(prev => !prev);
            setIsFocused(true);
          }}
          title={`Filtrar por Categoria: ${selectedCategory}`}
          className={`flex items-center gap-1 sm:gap-1.5 pl-2.5 sm:pl-3 pr-2 py-1.5 sm:py-2 border-r border-white/10 text-xs font-mono font-semibold transition-colors cursor-pointer shrink-0 rounded-l-2xl ${
            selectedCategory !== 'Todas' 
              ? 'text-cyan-300 bg-cyan-950/40' 
              : 'text-slate-400 hover:text-slate-200 bg-slate-950/30'
          }`}
        >
          <CategoryIcon className={`w-3.5 h-3.5 ${currentCategoryObj.color}`} />
          <span className="hidden md:inline max-w-[80px] lg:max-w-[110px] truncate text-[11px]">
            {selectedCategory === 'Todas' ? 'Categoria' : selectedCategory}
          </span>
          <ChevronDown className={`w-3 h-3 transition-transform text-slate-400 ${isCategoryMenuOpen ? 'rotate-180' : ''}`} />
        </button>

        {/* Text Input with Search Icon */}
        <div className="relative flex-1 flex items-center min-w-0">
          <Search className="absolute left-2.5 sm:left-3 w-3.5 h-3.5 sm:w-4 sm:h-4 text-cyan-400/80 pointer-events-none shrink-0" />
          
          <input
            ref={inputRef}
            type="text"
            value={searchQuery}
            onChange={e => handleSearchChange(e.target.value)}
            onFocus={() => setIsFocused(true)}
            placeholder="Buscar por palavra-chave ou categoria..."
            className="w-full bg-transparent pl-8 sm:pl-9 pr-7 sm:pr-8 py-1.5 sm:py-2 text-xs sm:text-sm text-slate-100 placeholder-slate-400 focus:outline-none font-sans"
          />

          {/* Clear or Keyboard Shortcut Helper */}
          {searchQuery || selectedCategory !== 'Todas' ? (
            <button
              type="button"
              onClick={handleClearAll}
              title="Limpar busca e filtros"
              className="absolute right-2 top-1/2 -translate-y-1/2 w-4 h-4 rounded-full bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white flex items-center justify-center text-[10px] cursor-pointer transition-colors"
            >
              <X className="w-3 h-3" />
            </button>
          ) : (
            <kbd className="hidden lg:inline-flex items-center absolute right-2.5 top-1/2 -translate-y-1/2 px-1.5 py-0.5 text-[10px] font-mono text-slate-400 bg-slate-800/60 border border-white/10 rounded pointer-events-none">
              /
            </kbd>
          )}
        </div>

      </div>

      {/* Floating Suggestions & Category Selector Popover when Focused / Menu Open */}
      {(isFocused || isCategoryMenuOpen) && (
        <div className="absolute top-full left-0 right-0 mt-2 p-3 bg-slate-950/95 border border-white/15 rounded-2xl shadow-[0_15px_40px_rgba(0,0,0,0.8)] backdrop-blur-2xl z-50 animate-fade-in space-y-3">
          
          {/* Active Result Status */}
          <div className="flex items-center justify-between text-[11px] font-mono pb-2 border-b border-white/10 text-slate-400">
            <span className="flex items-center gap-1.5 text-cyan-300">
              <Search className="w-3.5 h-3.5 text-cyan-400" />
              <span>{matchingCount} {matchingCount === 1 ? 'notícia encontrada' : 'notícias encontradas'}</span>
            </span>
            
            {(searchQuery || selectedCategory !== 'Todas') && (
              <button
                type="button"
                onClick={handleClearAll}
                className="text-xs text-rose-400 hover:text-rose-300 underline cursor-pointer"
              >
                Limpar filtros
              </button>
            )}
          </div>

          {/* Categories Grid Selector */}
          <div>
            <div className="text-[10px] font-mono uppercase tracking-wider text-slate-400 mb-1.5 flex items-center gap-1">
              <Filter className="w-3 h-3 text-cyan-400" />
              <span>Filtrar por Categoria:</span>
            </div>
            
            <div className="grid grid-cols-2 gap-1.5">
              {CATEGORY_ITEMS.map(cat => {
                const CatIcon = cat.icon;
                const isSelected = selectedCategory === cat.label;

                return (
                  <button
                    key={cat.label}
                    type="button"
                    onClick={() => handleSelectCategory(cat.label)}
                    className={`flex items-center gap-2 p-1.5 sm:p-2 rounded-xl text-xs font-semibold text-left transition-all cursor-pointer border ${
                      isSelected
                        ? 'bg-cyan-500/20 text-cyan-300 border-cyan-400/50 shadow-[0_0_10px_rgba(6,182,212,0.2)]'
                        : 'bg-slate-900/60 hover:bg-slate-800 text-slate-300 hover:text-white border-white/5'
                    }`}
                  >
                    <CatIcon className={`w-3.5 h-3.5 shrink-0 ${cat.color}`} />
                    <span className="truncate text-[11px] sm:text-xs">{cat.label}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Trending Search Keywords */}
          <div>
            <div className="text-[10px] font-mono uppercase tracking-wider text-slate-400 mb-1.5 flex items-center gap-1">
              <TrendingUp className="w-3 h-3 text-amber-400" />
              <span>Termos Populares / Operadoras:</span>
            </div>

            <div className="flex flex-wrap gap-1.5">
              {TRENDING_SEARCHES.map(keyword => (
                <button
                  key={keyword}
                  type="button"
                  onClick={() => {
                    handleSearchChange(keyword);
                    setIsFocused(false);
                  }}
                  className="px-2 py-0.5 rounded-lg bg-slate-900 hover:bg-slate-800 text-slate-300 hover:text-cyan-300 text-[11px] font-mono border border-white/10 transition-colors cursor-pointer flex items-center gap-1"
                >
                  <Tag className="w-2.5 h-2.5 text-cyan-400" />
                  <span>{keyword}</span>
                </button>
              ))}
            </div>
          </div>

        </div>
      )}

    </div>
  );
};
