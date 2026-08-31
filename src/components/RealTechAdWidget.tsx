import React, { useState, useEffect } from 'react';
import { RealTechAd, REAL_TECH_ADS } from '../data/realAds';
import { ShieldCheck, ExternalLink, Zap, Sparkles, Tag, ArrowRight } from 'lucide-react';

interface RealTechAdWidgetProps {
  onOpenAdModal?: (index: number) => void;
}

export const RealTechAdWidget: React.FC<RealTechAdWidgetProps> = ({ onOpenAdModal }) => {
  const [adIndex, setAdIndex] = useState(0);

  useEffect(() => {
    // Rotate through real authentic tech sponsor ads smoothly every 30s
    const timer = setInterval(() => {
      setAdIndex(prev => (prev + 1) % REAL_TECH_ADS.length);
    }, 30000);
    return () => clearInterval(timer);
  }, []);

  const ad = REAL_TECH_ADS[adIndex];

  const handleOpenAd = () => {
    if (onOpenAdModal) {
      onOpenAdModal(adIndex);
    } else {
      window.open(ad.officialUrl, '_blank', 'noopener,noreferrer');
    }
  };

  return (
    <div className="rounded-3xl p-5 bg-gradient-to-b from-slate-900 via-slate-950 to-slate-950 border border-white/15 shadow-[0_10px_35px_rgba(0,0,0,0.6)] relative overflow-hidden space-y-4 group">
      
      {/* Background Animated Gradient Ambience */}
      <div className={`absolute inset-0 bg-gradient-to-br ${ad.bannerTheme.bgGradient} opacity-40 pointer-events-none group-hover:opacity-60 transition-opacity`}></div>
      <div className="absolute top-0 right-0 w-36 h-36 bg-cyan-500/10 rounded-full blur-2xl pointer-events-none"></div>

      {/* Header Tag: Verified Real Publicidade */}
      <div className="flex items-center justify-between relative z-10">
        <div className="flex items-center gap-2">
          <div className="p-1.5 rounded-lg bg-slate-800 border border-white/10 text-cyan-400 font-black">
            <ShieldCheck className="w-3.5 h-3.5" />
          </div>
          <span className="text-[11px] font-mono font-bold text-cyan-300 uppercase tracking-wider">
            Publicidade Oficial
          </span>
        </div>

        <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded-full bg-cyan-500/20 text-cyan-300 border border-cyan-400/30">
          {ad.badge}
        </span>
      </div>

      {/* Sponsor Brand Info Card */}
      <div 
        onClick={handleOpenAd}
        className="p-4 rounded-2xl bg-slate-950/80 border border-white/10 hover:border-cyan-400/50 transition-all cursor-pointer space-y-3 relative z-10 group/card shadow-inner"
      >
        <div className="flex items-center gap-3">
          <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${ad.logoBg} flex items-center justify-center font-black text-white text-base font-mono shadow-md shrink-0 border border-white/15`}>
            {ad.logoLetter}
          </div>
          <div className="min-w-0">
            <h4 className="text-sm font-black text-white group-hover/card:text-cyan-300 transition-colors truncate">
              {ad.brand}
            </h4>
            <p className="text-[11px] text-slate-400 font-mono truncate">
              {ad.category}
            </p>
          </div>
        </div>

        <p className="text-xs text-slate-300 line-clamp-2 leading-relaxed">
          {ad.tagline}
        </p>

        {/* Offer Tag */}
        <div className="p-2 rounded-xl bg-slate-900/90 border border-cyan-500/30 text-[11px] font-mono text-cyan-300 flex items-center gap-1.5 font-bold">
          <Zap className="w-3.5 h-3.5 text-cyan-400 shrink-0" />
          <span className="truncate">{ad.discountText}</span>
        </div>
      </div>

      {/* CTA Button */}
      <div className="relative z-10 space-y-2">
        <button
          onClick={handleOpenAd}
          className={`w-full py-2.5 px-4 rounded-xl bg-gradient-to-r ${ad.bannerTheme.buttonGradient} text-white font-bold text-xs font-mono flex items-center justify-center gap-2 shadow-[0_0_20px_rgba(6,182,212,0.35)] cursor-pointer transform hover:scale-[1.02] transition-all`}
        >
          <span>{ad.ctaText}</span>
          <ExternalLink className="w-3.5 h-3.5" />
        </button>

        <div className="flex items-center justify-between text-[10px] text-slate-500 font-mono px-1">
          <span>{ad.verifiedLabel}</span>
          <span>{new URL(ad.officialUrl).hostname}</span>
        </div>
      </div>

    </div>
  );
};
