import React, { useState, useEffect } from 'react';
import { SponsorAd, SPONSOR_ADS } from '../data/sponsorAds';
import { 
  X, 
  ExternalLink, 
  Sparkles, 
  ShieldCheck, 
  ChevronRight, 
  Award,
  Zap,
  Clock,
  CheckCircle2
} from 'lucide-react';

interface FullscreenAdModalProps {
  isOpen: boolean;
  onClose: () => void;
  adIndex?: number;
}

export const FullscreenAdModal: React.FC<FullscreenAdModalProps> = ({
  isOpen,
  onClose,
  adIndex = 0
}) => {
  const [currentAd, setCurrentAd] = useState<SponsorAd>(SPONSOR_ADS[0]);
  const [countdown, setCountdown] = useState<number>(3);
  const [canSkip, setCanSkip] = useState<boolean>(false);

  useEffect(() => {
    if (isOpen) {
      // Pick ad based on index or rotate
      const ad = SPONSOR_ADS[adIndex % SPONSOR_ADS.length] || SPONSOR_ADS[0];
      setCurrentAd(ad);
      setCountdown(3);
      setCanSkip(false);

      const interval = setInterval(() => {
        setCountdown(prev => {
          if (prev <= 1) {
            setCanSkip(true);
            clearInterval(interval);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);

      return () => clearInterval(interval);
    }
  }, [isOpen, adIndex]);

  if (!isOpen) return null;

  const handleCtaClick = () => {
    window.open(currentAd.ctaUrl, '_blank', 'noopener,noreferrer');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-slate-950/85 backdrop-blur-2xl animate-fade-in">
      
      {/* Dynamic Background Glow */}
      <div className={`absolute inset-0 bg-gradient-to-br ${currentAd.gradient} pointer-events-none opacity-60`}></div>
      <div className="absolute -top-20 -left-20 w-96 h-96 bg-cyan-500/15 rounded-full blur-3xl pointer-events-none"></div>
      <div className="absolute -bottom-20 -right-20 w-96 h-96 bg-blue-600/15 rounded-full blur-3xl pointer-events-none"></div>

      {/* Main Fullscreen Card Container */}
      <div className="relative w-full max-w-4xl max-h-[92vh] overflow-y-auto bg-slate-900/90 border border-white/15 rounded-3xl p-6 sm:p-10 shadow-[0_25px_70px_rgba(0,0,0,0.8)] backdrop-blur-2xl flex flex-col justify-between space-y-6 z-10 custom-scrollbar">
        
        {/* Top Header Bar with Sponsor Note & Close/Skip Button */}
        <div className="flex items-center justify-between gap-4 border-b border-white/10 pb-4">
          
          <div className="flex items-center gap-2.5">
            <span className="px-2.5 py-1 rounded-full bg-cyan-500/20 text-cyan-300 border border-cyan-400/30 text-[11px] font-mono font-black tracking-wider flex items-center gap-1.5 shadow-[0_0_10px_rgba(6,182,212,0.3)]">
              <Sparkles className="w-3 h-3 text-cyan-400" />
              {currentAd.badge}
            </span>
            <span className="text-xs text-slate-400 font-mono hidden sm:inline">
              Parceiro Oficial • Gustavo Tec Showcase
            </span>
          </div>

          {/* Close or Skip countdown button */}
          <div className="flex items-center gap-2">
            {!canSkip ? (
              <div className="px-3.5 py-1.5 rounded-xl bg-slate-800/80 border border-white/10 text-slate-300 text-xs font-mono font-bold flex items-center gap-1.5 shadow-sm">
                <Clock className="w-3.5 h-3.5 text-cyan-400 animate-spin-slow" />
                <span>Pode fechar em {countdown}s</span>
              </div>
            ) : (
              <button
                onClick={onClose}
                className="px-4 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-white hover:text-cyan-300 border border-white/20 hover:border-cyan-400/50 text-xs font-bold font-mono flex items-center gap-1.5 transition-all cursor-pointer shadow-md"
              >
                <span>Fechar Anúncio</span>
                <X className="w-4 h-4" />
              </button>
            )}
          </div>

        </div>

        {/* Ad Center Body */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center py-2">
          
          {/* Left / Info column */}
          <div className="lg:col-span-7 space-y-4">
            <div className="space-y-1.5">
              <div className="text-xs font-mono font-bold uppercase tracking-widest text-slate-400 flex items-center gap-2">
                <Award className="w-4 h-4 text-amber-400" />
                <span>{currentAd.brand} • {currentAd.category}</span>
              </div>
              
              <h2 className="text-2xl sm:text-4xl font-black text-white tracking-tight leading-tight">
                {currentAd.title}
              </h2>

              <p className={`text-sm sm:text-base font-semibold ${currentAd.textColor}`}>
                {currentAd.tagline}
              </p>
            </div>

            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
              {currentAd.description}
            </p>

            {/* Feature Highlights Grid */}
            <div className="space-y-2 pt-2">
              <div className="text-[11px] font-mono font-bold text-slate-400 uppercase tracking-wider">
                Principais Vantagens Tecnológicas:
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {currentAd.highlights.map((highlight, idx) => (
                  <div 
                    key={idx}
                    className="p-2.5 bg-slate-950/60 border border-white/10 rounded-xl flex items-start gap-2 text-xs text-slate-200"
                  >
                    <CheckCircle2 className="w-4 h-4 text-teal-400 shrink-0 mt-0.5" />
                    <span>{highlight}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Right / Visual Showcase Banner */}
          <div className="lg:col-span-5 flex flex-col items-center justify-center p-6 sm:p-8 rounded-3xl bg-slate-950/80 border border-white/15 relative overflow-hidden text-center space-y-5 shadow-2xl">
            <div className="absolute top-0 right-0 w-48 h-48 bg-cyan-500/20 rounded-full blur-2xl pointer-events-none"></div>

            <div className="w-20 h-20 rounded-3xl bg-gradient-to-br from-cyan-400 via-blue-500 to-indigo-600 p-[2px] shadow-[0_0_30px_rgba(6,182,212,0.4)] flex items-center justify-center">
              <div className="w-full h-full bg-slate-950 rounded-[22px] flex items-center justify-center text-cyan-300">
                <Zap className="w-10 h-10 animate-pulse" />
              </div>
            </div>

            <div className="space-y-1">
              <span className="text-xs font-mono text-cyan-300 font-bold uppercase tracking-wider">Oferta Exclusiva 2026</span>
              <div className="text-lg font-black text-white">{currentAd.brand}</div>
              <p className="text-xs text-slate-400">Garantia oficial e suporte premium para leitores do Gustavo Tec</p>
            </div>

            <div className="w-full space-y-2 pt-2">
              <button
                onClick={handleCtaClick}
                className="w-full py-3 px-5 rounded-2xl bg-gradient-to-r from-cyan-500 via-teal-400 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-slate-950 font-black text-sm flex items-center justify-center gap-2 shadow-[0_0_25px_rgba(6,182,212,0.4)] transition-all cursor-pointer transform hover:scale-[1.02]"
              >
                <span>{currentAd.ctaText}</span>
                <ExternalLink className="w-4 h-4" />
              </button>

              {canSkip && (
                <button
                  onClick={onClose}
                  className="w-full py-2 px-4 rounded-xl text-xs font-mono font-semibold text-slate-400 hover:text-white transition-colors cursor-pointer"
                >
                  Continuar navegando no Gustavo Tec →
                </button>
              )}
            </div>

          </div>

        </div>

        {/* Footer Disclaimer */}
        <div className="pt-4 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between text-[11px] text-slate-400 font-mono gap-2">
          <div className="flex items-center gap-1.5">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
            <span>Publicidade verificada e selecionada pela curadoria editorial Gustavo Tec</span>
          </div>
          <span>Exibição pontual de patrocínio</span>
        </div>

      </div>

    </div>
  );
};
