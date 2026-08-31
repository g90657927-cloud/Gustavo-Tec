import React, { useState } from 'react';
import { NewsItem } from '../types';
import { useNews } from '../context/NewsContext';
import { useAuth } from '../context/AuthContext';
import { CommentsSection } from './CommentsSection';
import { 
  X, 
  Heart, 
  Bookmark, 
  Share2, 
  Clock, 
  ExternalLink, 
  CheckCircle2, 
  Flame, 
  Zap, 
  Layers,
  Globe,
  ShieldCheck,
  Check
} from 'lucide-react';

interface NewsDetailModalProps {
  news: NewsItem | null;
  onClose: () => void;
}

export const NewsDetailModal: React.FC<NewsDetailModalProps> = ({ news, onClose }) => {
  const { toggleLikeNews, likedNewsIds, news: allNews, setSelectedNews } = useNews();
  const { toggleBookmark, isBookmarked } = useAuth();
  const [scrollProgress, setScrollProgress] = useState(0);
  const [isCopied, setIsCopied] = useState(false);

  if (!news) return null;

  const isLiked = likedNewsIds.includes(news.id);
  const bookmarked = isBookmarked(news.id);

  const relatedArticles = allNews
    .filter(n => n.id !== news.id && (n.category === news.category || n.tags.some(t => news.tags.includes(t))))
    .slice(0, 3);

  const handleScroll = (e: React.UIEvent<HTMLDivElement>) => {
    const { scrollTop, scrollHeight, clientHeight } = e.currentTarget;
    const total = scrollHeight - clientHeight;
    if (total > 0) {
      const percentage = Math.min(100, Math.max(0, (scrollTop / total) * 100));
      setScrollProgress(percentage);
    }
  };

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: news.title,
        text: news.summary,
        url: news.sourceUrl || window.location.href
      }).catch(() => {});
    } else {
      navigator.clipboard.writeText(`${news.title} - Leia no Gustavo Tec (${news.source}): ${news.sourceUrl || window.location.href}`);
      setIsCopied(true);
      setTimeout(() => setIsCopied(false), 2500);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 md:p-6 overflow-y-auto bg-slate-950/80 backdrop-blur-2xl">
      {/* Modal Container with Liquid Glass */}
      <div 
        className="relative w-full max-w-4xl liquid-glass-card rounded-3xl overflow-hidden shadow-[0_16px_50px_rgba(0,0,0,0.6)] my-auto max-h-[92vh] flex flex-col"
        onClick={e => e.stopPropagation()}
      >
        {/* Subtle Reading Progress Bar at the top of the modal */}
        <div className="absolute top-0 left-0 right-0 h-1 bg-slate-900/90 z-40 overflow-hidden">
          <div 
            className="h-full bg-gradient-to-r from-cyan-400 via-teal-300 to-blue-500 transition-[width] duration-100 ease-out shadow-[0_0_12px_rgba(6,182,212,0.9)]"
            style={{ width: `${scrollProgress}%` }}
          />
        </div>

        {/* Sticky top action bar with close */}
        <div className="sticky top-0 z-30 flex items-center justify-between px-6 py-3.5 bg-slate-950/80 border-b border-white/10 backdrop-blur-xl">
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold text-cyan-300 uppercase tracking-wider font-mono">
              {news.category}
            </span>
            <span className="text-slate-600">•</span>
            <span className="text-xs text-slate-400 flex items-center gap-1 font-mono">
              <Clock className="w-3 h-3 text-cyan-400" />
              {news.publishedAt}
            </span>
            {scrollProgress > 0 && (
              <span className="hidden sm:inline-flex items-center gap-1 text-[11px] font-mono font-semibold px-2.5 py-0.5 rounded-full bg-cyan-950/80 text-cyan-300 border border-cyan-400/30 ml-2 shadow-[0_0_10px_rgba(6,182,212,0.2)]">
                {scrollProgress >= 98 ? (
                  <>
                    <Check className="w-3 h-3 text-emerald-400" />
                    <span>Concluído</span>
                  </>
                ) : (
                  <span>{Math.round(scrollProgress)}% lido</span>
                )}
              </span>
            )}
          </div>

          <div className="flex items-center gap-2">
            {/* Quick like */}
            <button
              onClick={() => toggleLikeNews(news.id)}
              className={`flex items-center gap-1 px-3 py-1.5 rounded-xl text-xs font-semibold font-mono transition-all cursor-pointer ${
                isLiked
                  ? 'bg-rose-500/20 text-rose-300 border border-rose-400/40 shadow-[0_0_10px_rgba(244,63,94,0.2)]'
                  : 'liquid-glass-subtle text-slate-300 hover:text-rose-300 hover:border-white/20'
              }`}
            >
              <Heart className={`w-3.5 h-3.5 ${isLiked ? 'fill-rose-500 text-rose-500' : ''}`} />
              <span>{news.likes}</span>
            </button>

            {/* Bookmark */}
            <button
              onClick={() => toggleBookmark(news.id)}
              title={bookmarked ? "Remover dos favoritos" : "Salvar artigo nos favoritos"}
              className={`p-2 rounded-xl text-xs transition-all cursor-pointer border ${
                bookmarked
                  ? 'bg-cyan-950/80 text-cyan-300 border-cyan-500/40 shadow-[0_0_10px_rgba(6,182,212,0.3)]'
                  : 'liquid-glass-subtle text-slate-400 hover:text-white hover:border-white/20'
              }`}
            >
              <Bookmark className={`w-3.5 h-3.5 ${bookmarked ? 'fill-cyan-400' : ''}`} />
            </button>

            {/* Share */}
            <button
              onClick={handleShare}
              title={isCopied ? "Link copiado!" : "Compartilhar notícia"}
              className={`p-2 rounded-xl transition-all cursor-pointer flex items-center gap-1 ${
                isCopied 
                  ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-400/50 shadow-[0_0_10px_rgba(52,211,153,0.3)]' 
                  : 'liquid-glass-subtle text-slate-400 hover:text-white hover:border-white/20'
              }`}
            >
              {isCopied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Share2 className="w-3.5 h-3.5" />}
              {isCopied && <span className="text-[10px] font-mono font-bold">Copiado!</span>}
            </button>

            {/* Close */}
            <button
              onClick={onClose}
              className="p-2 rounded-xl liquid-glass hover:bg-slate-800 text-slate-400 hover:text-white transition-all cursor-pointer ml-1"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Modal Scrollable Body with onScroll listener */}
        <div 
          onScroll={handleScroll}
          className="overflow-y-auto p-6 sm:p-8 space-y-8 divide-y divide-white/10"
        >
          
          {/* Article Header & Media */}
          <div className="space-y-6">
            {/* Badges */}
            <div className="flex flex-wrap items-center gap-2">
              <span className="flex items-center gap-1.5 text-xs font-bold px-3 py-1 rounded-xl bg-cyan-950/80 text-cyan-300 border border-cyan-400/30 font-mono shadow-[0_0_10px_rgba(6,182,212,0.2)]">
                <Globe className="w-3.5 h-3.5 text-cyan-400" />
                Fonte Oficial: {news.source}
              </span>

              {news.breaking && (
                <span className="flex items-center gap-1 text-xs font-bold px-2.5 py-1 rounded-xl bg-rose-500 text-white shadow-[0_0_12px_rgba(244,63,94,0.6)] animate-pulse">
                  <Zap className="w-3.5 h-3.5 fill-current" />
                  AO VIVO
                </span>
              )}
              {news.trending && (
                <span className="flex items-center gap-1 text-xs font-semibold px-2.5 py-1 rounded-xl bg-amber-500/20 text-amber-200 border border-amber-400/40">
                  <Flame className="w-3.5 h-3.5 text-amber-400" />
                  Em Alta
                </span>
              )}
              {news.tags.map((t, idx) => (
                <span key={idx} className="text-xs text-slate-400 font-mono bg-white/5 px-2.5 py-1 rounded-xl border border-white/5">
                  #{t}
                </span>
              ))}
            </div>

            {/* Title */}
            <h1 className="text-2xl sm:text-3xl md:text-4xl font-black text-slate-100 tracking-tight leading-tight">
              {news.title}
            </h1>

            {/* Author & Source bar */}
            <div className="flex items-center justify-between flex-wrap gap-4 py-3.5 px-4 liquid-glass rounded-2xl border border-white/10">
              <div className="flex items-center gap-3">
                <img
                  src={news.author.avatar}
                  alt={news.author.name}
                  referrerPolicy="no-referrer"
                  className="w-11 h-11 rounded-2xl object-cover ring-2 ring-cyan-400/40 shadow-sm"
                />
                <div>
                  <div className="font-bold text-slate-200 text-sm sm:text-base flex items-center gap-2">
                    <span>{news.author.name}</span>
                    <ShieldCheck className="w-4 h-4 text-cyan-400" />
                  </div>
                  <div className="text-xs text-slate-400">
                    {news.author.role} • <span className="text-cyan-400 font-semibold">{news.source}</span>
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-3">
                {news.sourceUrl && (
                  <a
                    href={news.sourceUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-1.5 px-4 py-2 rounded-2xl bg-gradient-to-r from-cyan-400 to-blue-500 hover:from-cyan-300 hover:to-blue-400 text-slate-950 font-bold text-xs shadow-[0_0_15px_rgba(6,182,212,0.4)] transition-all cursor-pointer"
                  >
                    <span>Ler Artigo Original no {news.source}</span>
                    <ExternalLink className="w-3.5 h-3.5" />
                  </a>
                )}
              </div>
            </div>

            {/* Main Featured Image */}
            <div className="relative rounded-3xl overflow-hidden max-h-96 w-full border border-white/10 bg-slate-950 shadow-inner">
              <img
                src={news.imageUrl}
                alt={news.title}
                referrerPolicy="no-referrer"
                className="w-full h-full object-cover"
              />
            </div>

            {/* Lead Summary */}
            <div className="p-5 liquid-glass border-l-4 !border-l-cyan-400 rounded-2xl text-slate-200 font-medium text-sm sm:text-base leading-relaxed shadow-[0_4px_20px_rgba(0,0,0,0.2)]">
              {news.summary}
            </div>

            {/* Key Takeaways */}
            {news.keyTakeaways && news.keyTakeaways.length > 0 && (
              <div className="liquid-glass rounded-2xl p-5 space-y-3">
                <h4 className="text-xs font-bold text-cyan-300 uppercase tracking-wider font-mono flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-cyan-400" />
                  Destaques e Verificação da Notícia
                </h4>
                <ul className="space-y-2">
                  {news.keyTakeaways.map((point, idx) => (
                    <li key={idx} className="flex items-start gap-2.5 text-xs sm:text-sm text-slate-300">
                      <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 mt-2 shrink-0 shadow-[0_0_6px_rgba(6,182,212,0.8)]"></span>
                      <span>{point}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Article Full Body */}
            <div className="prose prose-invert max-w-none text-slate-300 space-y-4 text-sm sm:text-base leading-relaxed">
              {news.content.split('\n\n').map((paragraph, idx) => (
                <p key={idx}>{paragraph}</p>
              ))}
            </div>

            {/* Bottom link to original article */}
            {news.sourceUrl && (
              <div className="p-4 liquid-glass-subtle rounded-2xl flex flex-col sm:flex-row items-center justify-between gap-3 border border-white/10">
                <div className="text-xs text-slate-400">
                  A notícia original e direitos pertencem a <strong className="text-slate-200">{news.source}</strong> ({news.sourceDomain || 'portal oficial'}).
                </div>
                <a
                  href={news.sourceUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-1.5 px-4 py-2 liquid-glass hover:bg-slate-800 text-cyan-300 hover:text-white rounded-xl text-xs font-bold transition-all shrink-0 border border-cyan-500/30"
                >
                  <span>Abrir link original ({news.sourceDomain || news.source})</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </a>
              </div>
            )}
          </div>

          {/* Real-Time Comments Section */}
          <div className="pt-8">
            <CommentsSection newsId={news.id} />
          </div>

          {/* Related News suggestions */}
          {relatedArticles.length > 0 && (
            <div className="pt-8 space-y-4">
              <h4 className="text-sm font-bold text-slate-300 flex items-center gap-2">
                <Layers className="w-4 h-4 text-cyan-400" />
                Mais Notícias Reais em {news.category}
              </h4>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                {relatedArticles.map(rel => (
                  <div
                    key={rel.id}
                    onClick={() => setSelectedNews(rel)}
                    className="p-3.5 liquid-glass-subtle hover:liquid-glass-active rounded-2xl cursor-pointer transition-all space-y-1.5 group border border-white/5"
                  >
                    <div className="flex items-center justify-between text-[10px] text-cyan-400 font-mono">
                      <span>{rel.publishedAt}</span>
                      <span className="text-slate-400">{rel.source}</span>
                    </div>
                    <div className="text-xs font-bold text-slate-200 group-hover:text-cyan-300 line-clamp-2">
                      {rel.title}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

        </div>
      </div>
    </div>
  );
};

