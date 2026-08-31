import React from 'react';
import { NewsItem } from '../types';
import { useNews } from '../context/NewsContext';
import { useAuth } from '../context/AuthContext';
import { 
  Heart, 
  MessageSquare, 
  Bookmark, 
  Share2, 
  Clock, 
  Flame, 
  Zap, 
  ExternalLink,
  Globe
} from 'lucide-react';

interface NewsCardProps {
  news: NewsItem;
  featured?: boolean;
}

export const NewsCard: React.FC<NewsCardProps> = React.memo(({ news, featured = false }) => {
  const { setSelectedNews, toggleLikeNews, likedNewsIds } = useNews();
  const { toggleBookmark, isBookmarked } = useAuth();

  const isLiked = likedNewsIds.includes(news.id);
  const bookmarked = isBookmarked(news.id);

  const handleShare = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (navigator.share) {
      navigator.share({
        title: news.title,
        text: news.summary,
        url: news.sourceUrl || window.location.href
      }).catch(() => {});
    } else {
      navigator.clipboard.writeText(`${news.title} - Leia no Gustavo Tec (${news.source}): ${news.sourceUrl || window.location.href}`);
      alert('Link copiado para a área de transferência!');
    }
  };

  const getCategoryColor = (cat: string) => {
    switch (cat) {
      case 'Inteligência Artificial':
        return 'bg-purple-500/20 text-purple-200 border-purple-400/40 shadow-[0_0_10px_rgba(168,85,247,0.2)]';
      case 'Hardware & Chips':
        return 'bg-cyan-500/20 text-cyan-200 border-cyan-400/40 shadow-[0_0_10px_rgba(6,182,212,0.2)]';
      case 'Dev & Open Source':
        return 'bg-emerald-500/20 text-emerald-200 border-emerald-400/40 shadow-[0_0_10px_rgba(52,211,153,0.2)]';
      case 'Cibersegurança':
        return 'bg-rose-500/20 text-rose-200 border-rose-400/40 shadow-[0_0_10px_rgba(244,63,94,0.2)]';
      case 'Mobile & Gadgets':
        return 'bg-amber-500/20 text-amber-200 border-amber-400/40 shadow-[0_0_10px_rgba(245,158,11,0.2)]';
      case 'Espaço & Robótica':
        return 'bg-indigo-500/20 text-indigo-200 border-indigo-400/40 shadow-[0_0_10px_rgba(99,102,241,0.2)]';
      default:
        return 'bg-sky-500/20 text-sky-200 border-sky-400/40 shadow-[0_0_10px_rgba(14,165,233,0.2)]';
    }
  };

  return (
    <article
      onClick={() => setSelectedNews(news)}
      className={`group relative liquid-glass-card rounded-3xl overflow-hidden transition-all duration-300 flex flex-col justify-between cursor-pointer ${
        featured ? 'lg:col-span-2 lg:flex-row' : ''
      }`}
    >
      {/* 3D Light Glare Sheen Reflection (GPU Accelerated) */}
      <div className="card-3d-glare" />

      {/* Media Image container with 3D Z-elevation */}
      <div className={`relative overflow-hidden ${featured ? 'lg:w-1/2 h-64 lg:h-auto' : 'h-52 w-full'} bg-slate-950 z-layer-media`}>
        <img
          src={news.imageUrl}
          alt={news.title}
          referrerPolicy="no-referrer"
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 opacity-90 group-hover:opacity-100"
          loading="lazy"
          onError={(e) => {
            (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1518770660439-4636190af475?w=800&auto=format&fit=crop&q=80';
          }}
        />

        {/* Liquid gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/30 to-transparent"></div>

        {/* Category & Source badges with 3D Pop Out */}
        <div className="absolute top-3.5 left-3.5 flex flex-wrap items-center gap-1.5 z-10 z-layer-badge">
          <span className={`text-[11px] font-semibold px-2.5 py-1 rounded-xl border backdrop-blur-md pill-3d ${getCategoryColor(news.category)}`}>
            {news.category}
          </span>

          <span className="flex items-center gap-1.5 text-[11px] font-bold px-2.5 py-1 rounded-xl bg-slate-950/80 text-cyan-300 border border-cyan-400/40 backdrop-blur-md pill-3d shadow-sm">
            <Globe className="w-3 h-3 text-cyan-400" />
            {news.source}
          </span>

          {news.breaking && (
            <span className="flex items-center gap-1 text-[11px] font-bold px-2.5 py-1 rounded-xl bg-rose-500 text-white shadow-[0_0_15px_rgba(244,63,94,0.7)] animate-pulse pill-3d">
              <Zap className="w-3 h-3 fill-current" />
              URGENTE
            </span>
          )}

          {news.trending && (
            <span className="flex items-center gap-1 text-[11px] font-semibold px-2.5 py-1 rounded-xl bg-amber-500/20 text-amber-200 border border-amber-400/40 backdrop-blur-md pill-3d shadow-[0_0_10px_rgba(245,158,11,0.2)]">
              <Flame className="w-3 h-3 text-amber-400" />
              Em Alta
            </span>
          )}
        </div>

        {/* Timestamp & Source badge with 3D Float */}
        <div className="absolute bottom-3.5 left-3.5 right-3.5 flex items-center justify-between text-[11px] text-slate-300 font-mono z-layer-badge">
          <div className="flex items-center gap-2 bg-slate-950/80 backdrop-blur-md px-2.5 py-1 rounded-xl border border-white/10 shadow-sm pill-3d">
            <Clock className="w-3 h-3 text-cyan-400" />
            <span>{news.publishedAt}</span>
            <span className="text-slate-500">•</span>
            <span>{news.readTime}</span>
          </div>

          {news.sourceUrl && (
            <a
              href={news.sourceUrl}
              target="_blank"
              rel="noopener noreferrer"
              onClick={(e) => e.stopPropagation()}
              className="flex items-center gap-1 bg-slate-950/80 hover:bg-cyan-950/90 text-slate-400 hover:text-cyan-300 border border-white/10 hover:border-cyan-400/50 px-2.5 py-1 rounded-xl backdrop-blur-md transition-all pill-3d shadow-sm"
              title="Abrir no portal original"
            >
              <span>Fonte</span>
              <ExternalLink className="w-3 h-3 text-cyan-400" />
            </a>
          )}
        </div>
      </div>

      {/* Content Section with 3D Text Elevation */}
      <div className={`p-6 flex-1 flex flex-col justify-between ${featured ? 'lg:w-1/2' : ''} z-layer-text`}>
        <div>
          {/* Tags list */}
          <div className="flex flex-wrap gap-1.5 mb-3">
            {news.tags.slice(0, 3).map((tag, idx) => (
              <span key={idx} className="text-[10px] text-slate-400 font-mono bg-white/5 px-2.5 py-0.5 rounded-lg border border-white/5 pill-3d">
                #{tag}
              </span>
            ))}
          </div>

          {/* Title */}
          <h3 className={`font-bold text-slate-100 group-hover:text-cyan-300 transition-colors tracking-tight leading-snug mb-3 ${featured ? 'text-xl sm:text-2xl' : 'text-base sm:text-lg'}`}>
            {news.title}
          </h3>

          {/* Summary */}
          <p className="text-xs sm:text-sm text-slate-400 leading-relaxed line-clamp-3 mb-4">
            {news.summary}
          </p>
        </div>

        {/* Footer: Author & Interactive 3D actions */}
        <div className="pt-4 border-t border-white/10 flex items-center justify-between gap-2 mt-auto z-layer-pop">
          {/* Author / Source info */}
          <div className="flex items-center gap-2.5 min-w-0">
            <img
              src={news.author.avatar}
              alt={news.author.name}
              referrerPolicy="no-referrer"
              className="w-7 h-7 rounded-xl object-cover border border-white/10 shrink-0 shadow-sm"
            />
            <div className="min-w-0">
              <div className="text-xs font-semibold text-slate-200 truncate group-hover:text-cyan-200">
                {news.author.name}
              </div>
              <div className="text-[10px] text-cyan-400 truncate font-mono">
                {news.source} {news.sourceDomain ? `(${news.sourceDomain})` : ''}
              </div>
            </div>
          </div>

          {/* Action buttons */}
          <div className="flex items-center gap-1 shrink-0">
            {/* Likes */}
            <button
              onClick={(e) => {
                e.stopPropagation();
                toggleLikeNews(news.id);
              }}
              title="Curtir notícia"
              className={`flex items-center gap-1 px-2.5 py-1 rounded-xl text-xs font-mono font-semibold transition-all cursor-pointer pill-3d ${
                isLiked
                  ? 'bg-rose-500/20 text-rose-300 border border-rose-400/40 shadow-[0_0_10px_rgba(244,63,94,0.2)]'
                  : 'text-slate-400 hover:text-rose-300 hover:bg-white/5'
              }`}
            >
              <Heart className={`w-3.5 h-3.5 ${isLiked ? 'fill-rose-500 text-rose-500' : ''}`} />
              <span>{news.likes}</span>
            </button>

            {/* Comments */}
            <button
              onClick={(e) => {
                e.stopPropagation();
                setSelectedNews(news);
              }}
              title="Comentários e debate"
              className="flex items-center gap-1 px-2.5 py-1 rounded-xl text-xs font-mono font-semibold text-slate-400 hover:text-cyan-300 hover:bg-white/5 transition-all cursor-pointer pill-3d"
            >
              <MessageSquare className="w-3.5 h-3.5 text-cyan-400" />
              <span>{news.commentsCount}</span>
            </button>

            {/* Bookmark */}
            <button
              onClick={(e) => {
                e.stopPropagation();
                toggleBookmark(news.id);
              }}
              title={bookmarked ? 'Remover dos favoritos' : 'Salvar no meu perfil'}
              className={`p-1.5 rounded-xl text-xs transition-all cursor-pointer pill-3d ${
                bookmarked
                  ? 'text-cyan-300 bg-cyan-950/80 border border-cyan-500/40 shadow-[0_0_10px_rgba(6,182,212,0.3)]'
                  : 'text-slate-400 hover:text-cyan-300 hover:bg-white/5'
              }`}
            >
              <Bookmark className={`w-3.5 h-3.5 ${bookmarked ? 'fill-cyan-400 text-cyan-400' : ''}`} />
            </button>

            {/* Share */}
            <button
              onClick={handleShare}
              title="Compartilhar notícia"
              className="p-1.5 rounded-xl text-xs text-slate-400 hover:text-white hover:bg-white/5 transition-all cursor-pointer pill-3d"
            >
              <Share2 className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>
    </article>
  );
});

