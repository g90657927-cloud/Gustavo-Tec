import React from 'react';
import { useNews } from '../context/NewsContext';
import { Clock, Zap, Users, Bot, Sparkles } from 'lucide-react';

interface TechStatsBannerProps {
  onOpenGemini: () => void;
}

export const TechStatsBanner: React.FC<TechStatsBannerProps> = React.memo(({ onOpenGemini }) => {
  const { news, countdown, totalNewStoriesReceived, isAutoRefreshActive, allLiveComments } = useNews();

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mb-6 perspective-scene">
      {/* 10s Streaming Velocity */}
      <div className="liquid-glass-card rounded-2xl p-4 flex items-center gap-3 relative overflow-hidden transition-all hover:border-cyan-500/40 shadow-[0_4px_25px_rgba(0,0,0,0.3)] group">
        <div className="card-3d-glare" />
        <div className="w-10 h-10 rounded-xl bg-cyan-500/15 border border-cyan-400/30 flex items-center justify-center text-cyan-300 shrink-0 shadow-[0_0_12px_rgba(6,182,212,0.2)] z-layer-badge">
          <Clock className="w-5 h-5 animate-spin text-cyan-400" style={{ animationDuration: '10s' }} />
        </div>
        <div className="min-w-0 z-layer-text">
          <div className="flex items-center gap-1.5">
            <span className="text-xs text-slate-400 font-medium">Ciclo de Atualização</span>
            <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-ping"></span>
          </div>
          <div className="text-base sm:text-lg font-black text-slate-100 font-mono flex items-center gap-1.5">
            <span>{countdown}s</span>
            <span className="text-[11px] font-normal text-cyan-400 font-sans">
              ({isAutoRefreshActive ? '10s ativo' : 'pausado'})
            </span>
          </div>
        </div>
      </div>

      {/* Stories Processed */}
      <div className="liquid-glass-card rounded-2xl p-4 flex items-center gap-3 relative overflow-hidden transition-all hover:border-blue-500/40 shadow-[0_4px_25px_rgba(0,0,0,0.3)] group">
        <div className="card-3d-glare" />
        <div className="w-10 h-10 rounded-xl bg-blue-500/15 border border-blue-400/30 flex items-center justify-center text-blue-300 shrink-0 shadow-[0_0_12px_rgba(59,130,246,0.2)] z-layer-badge">
          <Zap className="w-5 h-5 text-blue-400" />
        </div>
        <div className="min-w-0 z-layer-text">
          <span className="text-xs text-slate-400 font-medium">Notícias no Feed</span>
          <div className="text-base sm:text-lg font-black text-slate-100 font-mono">
            {news.length}{' '}
            <span className="text-[11px] font-normal text-blue-400 font-sans">
              +{totalNewStoriesReceived} novas
            </span>
          </div>
        </div>
      </div>

      {/* Community Engagement */}
      <div className="liquid-glass-card rounded-2xl p-4 flex items-center gap-3 relative overflow-hidden transition-all hover:border-emerald-500/40 shadow-[0_4px_25px_rgba(0,0,0,0.3)] group">
        <div className="card-3d-glare" />
        <div className="w-10 h-10 rounded-xl bg-emerald-500/15 border border-emerald-400/30 flex items-center justify-center text-emerald-300 shrink-0 shadow-[0_0_12px_rgba(52,211,153,0.2)] z-layer-badge">
          <Users className="w-5 h-5 text-emerald-400" />
        </div>
        <div className="min-w-0 z-layer-text">
          <span className="text-xs text-slate-400 font-medium">Comunidade Ao Vivo</span>
          <div className="text-base sm:text-lg font-black text-slate-100 font-mono">
            {allLiveComments.length}{' '}
            <span className="text-[11px] font-normal text-emerald-400 font-sans">
              {allLiveComments.length === 1 ? 'comentário' : 'comentários'}
            </span>
          </div>
        </div>
      </div>

      {/* ChatBot IA CTA */}
      <button
        onClick={onOpenGemini}
        className="liquid-glass-card rounded-2xl p-4 flex items-center gap-3 shadow-[0_4px_25px_rgba(0,0,0,0.3)] transition-all duration-300 text-left group cursor-pointer border border-white/10 hover:border-blue-400/60 relative overflow-hidden"
      >
        <div className="card-3d-glare" />
        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500/30 to-indigo-600/30 border border-blue-400/40 flex items-center justify-center text-blue-200 group-hover:scale-110 transition-transform shrink-0 shadow-[0_0_15px_rgba(59,130,246,0.3)] z-layer-badge">
          <Bot className="w-5 h-5 text-blue-300" />
        </div>
        <div className="min-w-0 z-layer-text">
          <div className="flex items-center gap-1.5">
            <span className="text-xs text-blue-200 font-bold group-hover:text-cyan-300 transition-colors">ChatBot IA</span>
            <span className="text-[9px] bg-blue-500/20 text-blue-300 px-1.5 py-0.2 rounded-full font-mono border border-blue-400/30 pill-3d">
              Online
            </span>
          </div>
          <div className="text-[11px] text-slate-400 group-hover:text-slate-200 transition-colors truncate">
            Assistente técnico e resumos →
          </div>
        </div>
      </button>
    </div>
  );
});

