import React, { useState } from 'react';
import { 
  Trophy, 
  ExternalLink, 
  RefreshCw, 
  Maximize2, 
  Minimize2, 
  Radio, 
  Sparkles,
  ShieldCheck,
  Globe,
  Flame,
  ArrowUpRight,
  Activity
} from 'lucide-react';

interface FlashscorePortal {
  id: string;
  name: string;
  url: string;
  icon: string;
  badge: string;
}

const PORTALS: FlashscorePortal[] = [
  {
    id: 'pt-live',
    name: 'Flashscore Ao Vivo',
    url: 'https://www.flashscore.pt/',
    icon: '🏆',
    badge: 'Todos os Desportos'
  },
  {
    id: 'liga-portugal',
    name: 'Liga Portugal Betclic',
    url: 'https://www.flashscore.pt/futebol/portugal/liga-portugal/',
    icon: '🇵🇹',
    badge: 'Futebol PT'
  },
  {
    id: 'champions',
    name: 'Champions League',
    url: 'https://www.flashscore.pt/futebol/europa/liga-dos-campeoes/',
    icon: '🇪🇺',
    badge: 'UEFA'
  },
  {
    id: 'premier',
    name: 'Premier League',
    url: 'https://www.flashscore.pt/futebol/inglaterra/premier-league/',
    icon: '🏴󠁧󠁢󠁥󠁮󠁧󠁿',
    badge: 'Inglaterra'
  },
  {
    id: 'brasileirao',
    name: 'Brasileirão Série A',
    url: 'https://www.flashscore.pt/futebol/brasil/serie-a-betano/',
    icon: '🇧🇷',
    badge: 'Brasil'
  },
  {
    id: 'tenis',
    name: 'Ténis Ao Vivo',
    url: 'https://www.flashscore.pt/tenis/',
    icon: '🎾',
    badge: 'ATP / WTA'
  },
  {
    id: 'basquetebol',
    name: 'Basquetebol',
    url: 'https://www.flashscore.pt/basquetebol/',
    icon: '🏀',
    badge: 'NBA / Europa'
  },
  {
    id: 'futsal',
    name: 'Futsal',
    url: 'https://www.flashscore.pt/futsal/',
    icon: '⚽',
    badge: 'Portugal & Global'
  }
];

export const FootballFlashscoreView: React.FC = () => {
  const [selectedPortal, setSelectedPortal] = useState<FlashscorePortal>(PORTALS[0]);
  const [iframeKey, setIframeKey] = useState<number>(0);
  const [isFullscreen, setIsFullscreen] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  const handleRefresh = () => {
    setIsLoading(true);
    setIframeKey(prev => prev + 1);
  };

  const handleSelectPortal = (portal: FlashscorePortal) => {
    if (portal.id !== selectedPortal.id) {
      setSelectedPortal(portal);
      setIsLoading(true);
      setIframeKey(prev => prev + 1);
    }
  };

  return (
    <div className={`space-y-4 pb-12 transition-all duration-300 ${
      isFullscreen 
        ? 'fixed inset-0 z-50 bg-slate-950 p-2 sm:p-4 overflow-hidden h-screen flex flex-col' 
        : 'w-full'
    }`}>
      {/* Header bar with controls */}
      <div className="liquid-glass-header rounded-2xl p-3 sm:p-4 border border-rose-500/20 shadow-[0_8px_32px_rgba(244,63,94,0.15)] flex flex-col md:flex-row items-start md:items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-rose-500/30 to-amber-500/20 border border-rose-400/40 flex items-center justify-center text-rose-400 shadow-[0_0_15px_rgba(244,63,94,0.3)]">
            <Trophy className="w-5 h-5 text-rose-400 animate-pulse" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-base sm:text-lg font-bold text-slate-100 flex items-center gap-1.5">
                Desporto Ao Vivo • Flashscore
              </h2>
              <span className="flex items-center gap-1 px-2 py-0.5 rounded-full bg-rose-500/20 border border-rose-500/40 text-[10px] font-mono text-rose-300 font-bold">
                <Radio className="w-2.5 h-2.5 animate-ping text-rose-400" /> DIRETO
              </span>
            </div>
            <p className="text-xs text-slate-400">
              Resultados, golos, pontos, classificações e estatísticas oficiais em tempo real
            </p>
          </div>
        </div>

        {/* Quick action buttons */}
        <div className="flex items-center gap-2 self-end md:self-auto">
          <button
            onClick={handleRefresh}
            title="Recarregar Iframe"
            className="px-3 py-1.5 rounded-xl border border-slate-700 bg-slate-900/80 hover:bg-slate-800 text-slate-300 hover:text-white text-xs font-mono flex items-center gap-1.5 transition-all shadow-sm cursor-pointer"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isLoading ? 'animate-spin text-rose-400' : ''}`} />
            <span className="hidden sm:inline">Atualizar</span>
          </button>

          <a
            href={selectedPortal.url}
            target="_blank"
            rel="noopener noreferrer"
            title="Abrir em Nova Aba"
            className="px-3 py-1.5 rounded-xl border border-rose-500/40 bg-rose-500/10 hover:bg-rose-500/20 text-rose-300 hover:text-rose-200 text-xs font-mono font-medium flex items-center gap-1.5 transition-all cursor-pointer"
          >
            <ExternalLink className="w-3.5 h-3.5" />
            <span>Abrir Aba</span>
          </a>

          <button
            onClick={() => setIsFullscreen(!isFullscreen)}
            title={isFullscreen ? 'Sair do Ecrã Inteiro' : 'Modo Ecrã Inteiro'}
            className="px-3 py-1.5 rounded-xl border border-slate-700 bg-slate-900/80 hover:bg-slate-800 text-slate-300 hover:text-white text-xs font-mono flex items-center gap-1.5 transition-all shadow-sm cursor-pointer"
          >
            {isFullscreen ? (
              <>
                <Minimize2 className="w-3.5 h-3.5 text-amber-400" />
                <span className="hidden sm:inline">Restaurar</span>
              </>
            ) : (
              <>
                <Maximize2 className="w-3.5 h-3.5 text-cyan-400" />
                <span className="hidden sm:inline">Ecrã Cheio</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Preset Sport & League Bar */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
        {PORTALS.map(portal => {
          const isSelected = selectedPortal.id === portal.id;
          return (
            <button
              key={portal.id}
              onClick={() => handleSelectPortal(portal)}
              className={`flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-mono whitespace-nowrap transition-all cursor-pointer border shrink-0 ${
                isSelected
                  ? 'bg-rose-500/20 border-rose-400/60 text-rose-200 font-bold shadow-[0_0_15px_rgba(244,63,94,0.25)]'
                  : 'bg-slate-900/60 border-slate-800 text-slate-400 hover:text-slate-200 hover:border-slate-700'
              }`}
            >
              <span className="text-sm">{portal.icon}</span>
              <span>{portal.name}</span>
              <span className={`text-[9px] px-1.5 py-0.2 rounded font-mono ${
                isSelected ? 'bg-rose-500/40 text-rose-100' : 'bg-slate-800 text-slate-400'
              }`}>
                {portal.badge}
              </span>
            </button>
          );
        })}
      </div>

      {/* Iframe Container */}
      <div className={`relative w-full rounded-2xl overflow-hidden border border-slate-800 bg-slate-950 shadow-2xl transition-all ${
        isFullscreen ? 'flex-1 h-full min-h-0' : 'h-[750px] sm:h-[820px] lg:h-[900px]'
      }`}>
        {/* Loading overlay */}
        {isLoading && (
          <div className="absolute inset-0 z-10 bg-slate-950/80 backdrop-blur-sm flex flex-col items-center justify-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-rose-500/20 border border-rose-400/40 flex items-center justify-center text-rose-400 animate-spin">
              <RefreshCw className="w-6 h-6" />
            </div>
            <div className="text-center space-y-1">
              <p className="text-sm font-bold text-slate-200">A carregar Desporto Ao Vivo...</p>
              <p className="text-xs text-slate-400 font-mono">{selectedPortal.name}</p>
            </div>
          </div>
        )}

        {/* Embedded Iframe */}
        <iframe
          key={iframeKey}
          id="flashscore-main-frame"
          src={selectedPortal.url}
          title="Flashscore Desporto Ao Vivo"
          onLoad={() => setIsLoading(false)}
          className="w-full h-full border-0 bg-slate-950"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
          loading="lazy"
          referrerPolicy="no-referrer"
          sandbox="allow-scripts allow-same-origin allow-popups allow-forms allow-top-navigation-by-user-activation"
        />

        {/* Floating Quick Footer Info & Fallback */}
        <div className="absolute bottom-3 right-3 z-20 flex items-center gap-2">
          <a
            href={selectedPortal.url}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-900/90 hover:bg-slate-800 border border-slate-700/80 text-[11px] font-mono text-slate-300 hover:text-white backdrop-blur-md shadow-lg transition-all"
          >
            <span>Ver no Flashscore Oficial</span>
            <ArrowUpRight className="w-3.5 h-3.5 text-rose-400" />
          </a>
        </div>
      </div>
    </div>
  );
};
