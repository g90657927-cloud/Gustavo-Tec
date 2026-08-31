import React from 'react';
import { useNotifications } from '../context/NotificationContext';
import { 
  Bell, 
  Flame, 
  Radio, 
  CloudSun, 
  X, 
  ExternalLink,
  ChevronRight,
  Trophy
} from 'lucide-react';

interface NotificationToastBannerProps {
  onNavigateTab?: (tab: 'news' | 'football' | 'weather' | 'tools' | 'gemini' | 'community' | 'messages' | 'login') => void;
  onOpenCenter?: () => void;
}

export const NotificationToastBanner: React.FC<NotificationToastBannerProps> = ({
  onNavigateTab,
  onOpenCenter
}) => {
  const { latestToast, dismissToast } = useNotifications();

  if (!latestToast) return null;

  const getIconAndStyle = () => {
    switch (latestToast.type) {
      case 'goal_alert':
        return {
          icon: <Trophy className="w-5 h-5 text-rose-400 animate-pulse" />,
          borderColor: 'border-rose-500/50',
          bgGradient: 'from-rose-950/90 via-slate-900/95 to-slate-950/90',
          badgeText: '⚽ GOLO AO VIVO',
          badgeBg: 'bg-rose-500/20 text-rose-300 border-rose-400/40',
          glow: 'shadow-[0_0_30px_rgba(244,63,94,0.35)]'
        };
      case 'urgent_news':
        return {
          icon: <Flame className="w-5 h-5 text-red-400 animate-pulse" />,
          borderColor: 'border-red-500/50',
          bgGradient: 'from-red-950/90 via-slate-900/95 to-slate-950/90',
          badgeText: 'NOTÍCIA URGENTE',
          badgeBg: 'bg-red-500/20 text-red-300 border-red-400/40',
          glow: 'shadow-[0_0_30px_rgba(239,68,68,0.35)]'
        };
      case 'network_change':
        return {
          icon: <Radio className="w-5 h-5 text-cyan-400 animate-pulse" />,
          borderColor: 'border-cyan-500/50',
          bgGradient: 'from-cyan-950/90 via-slate-900/95 to-slate-950/90',
          badgeText: 'ESTADO DA REDE',
          badgeBg: 'bg-cyan-500/20 text-cyan-300 border-cyan-400/40',
          glow: 'shadow-[0_0_30px_rgba(6,182,212,0.35)]'
        };
      case 'weather_alert':
        return {
          icon: <CloudSun className="w-5 h-5 text-amber-400 animate-pulse" />,
          borderColor: 'border-amber-500/50',
          bgGradient: 'from-amber-950/90 via-slate-900/95 to-slate-950/90',
          badgeText: 'ALERTA CLIMA IPMA',
          badgeBg: 'bg-amber-500/20 text-amber-300 border-amber-400/40',
          glow: 'shadow-[0_0_30px_rgba(245,158,11,0.35)]'
        };
      default:
        return {
          icon: <Bell className="w-5 h-5 text-blue-400" />,
          borderColor: 'border-blue-500/50',
          bgGradient: 'from-blue-950/90 via-slate-900/95 to-slate-950/90',
          badgeText: 'AVISO SISTEMA',
          badgeBg: 'bg-blue-500/20 text-blue-300 border-blue-400/40',
          glow: 'shadow-[0_0_30px_rgba(59,130,246,0.35)]'
        };
    }
  };

  const style = getIconAndStyle();

  const handleAction = () => {
    if (latestToast.actionTab && onNavigateTab) {
      onNavigateTab(latestToast.actionTab);
    } else if (onOpenCenter) {
      onOpenCenter();
    }
    dismissToast();
  };

  return (
    <div className="fixed top-20 right-4 z-50 max-w-sm sm:max-w-md w-[calc(100%-2rem)] animate-in fade-in slide-in-from-top-4 duration-300">
      <div 
        className={`p-4 rounded-2xl bg-gradient-to-r ${style.bgGradient} border ${style.borderColor} backdrop-blur-2xl ${style.glow} shadow-2xl relative overflow-hidden`}
      >
        {/* Animated Progress Bar */}
        <div className="absolute bottom-0 left-0 right-0 h-1 bg-white/10">
          <div className="h-full bg-cyan-400/80 animate-[shrink_6s_linear_forwards]" />
        </div>

        <div className="flex items-start gap-3">
          <div className="p-2.5 rounded-xl bg-slate-950/80 border border-white/10 shrink-0">
            {style.icon}
          </div>

          <div className="flex-1 space-y-1 pr-6 text-left">
            <div className="flex items-center gap-2">
              <span className={`px-2 py-0.5 rounded text-[10px] font-mono font-bold border ${style.badgeBg}`}>
                {style.badgeText}
              </span>
              <span className="text-[10px] text-slate-400 font-mono">{latestToast.time}</span>
            </div>

            <h4 className="text-sm font-bold text-white leading-snug">
              {latestToast.title}
            </h4>

            <p className="text-xs text-slate-300 leading-relaxed line-clamp-2">
              {latestToast.message}
            </p>

            <div className="pt-2 flex items-center gap-3">
              <button
                onClick={handleAction}
                className="text-xs font-mono font-bold text-cyan-300 hover:text-white flex items-center gap-1 cursor-pointer transition-colors"
              >
                <span>Ver Detalhes</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          {/* Close button */}
          <button
            onClick={dismissToast}
            className="absolute top-3 right-3 text-slate-400 hover:text-white p-1 rounded-lg hover:bg-white/10 transition-colors cursor-pointer"
            title="Fechar aviso"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};
