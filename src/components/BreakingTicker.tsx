import React from 'react';
import { useNews } from '../context/NewsContext';
import { Zap, Radio, ChevronRight } from 'lucide-react';

export const BreakingTicker: React.FC = React.memo(() => {
  const { breakingAlerts, countdown, setSelectedNews, news } = useNews();

  const handleAlertClick = (title: string) => {
    const matched = news.find(n => n.title.toLowerCase().includes(title.toLowerCase().substring(0, 20)));
    if (matched) {
      setSelectedNews(matched);
    }
  };

  return (
    <div className="relative liquid-glass border-x-0 border-t-0 border-b border-cyan-500/20 px-4 py-2.5 flex items-center gap-3 overflow-hidden z-20 text-xs sm:text-sm">
      {/* Live Badge */}
      <div className="flex items-center gap-1.5 bg-rose-500/20 text-rose-300 border border-rose-400/40 px-3 py-1 rounded-xl font-bold shrink-0 uppercase tracking-wider text-[11px] shadow-[0_0_12px_rgba(244,63,94,0.3)]">
        <span className="relative flex h-2 w-2">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-rose-400 opacity-75"></span>
          <span className="relative inline-flex rounded-full h-2 w-2 bg-rose-500"></span>
        </span>
        <Zap className="w-3.5 h-3.5 fill-rose-400 text-rose-300" />
        <span>URGENTE (10s)</span>
      </div>

      {/* Auto update countdown indicator */}
      <div className="hidden md:flex items-center gap-1.5 text-cyan-300 liquid-glass-subtle px-3 py-1 rounded-xl text-[11px] font-mono shrink-0 border border-cyan-400/20">
        <Radio className="w-3 h-3 animate-pulse text-cyan-400" />
        <span>Próxima atualização em <strong className="text-cyan-200 font-bold">{countdown}s</strong></span>
      </div>

      {/* Ticker marquee */}
      <div className="flex-1 overflow-hidden relative">
        <div className="ticker-track flex items-center gap-8 text-slate-200 font-medium">
          {breakingAlerts.map((alert, idx) => (
            <button
              key={`${alert.id}-${idx}`}
              onClick={() => handleAlertClick(alert.title)}
              className="flex items-center gap-2 hover:text-cyan-300 transition-colors text-left shrink-0 cursor-pointer group"
            >
              <span className="liquid-glass-subtle text-cyan-300 text-[10px] px-2 py-0.5 rounded-lg border border-white/10 font-mono">
                {alert.category}
              </span>
              <span className="group-hover:underline underline-offset-4">{alert.title}</span>
              <span className="text-slate-400 text-[11px]">({alert.time})</span>
              <ChevronRight className="w-3 h-3 text-slate-500 group-hover:text-cyan-400 transition-transform group-hover:translate-x-0.5" />
            </button>
          ))}
        </div>
      </div>
    </div>
  );
});

