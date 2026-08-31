import React, { useState, useEffect } from 'react';
import { RealTechAd, REAL_TECH_ADS } from '../data/realAds';
import { 
  X, 
  ExternalLink, 
  Sparkles, 
  CheckCircle2, 
  ShieldCheck, 
  Timer, 
  Tag, 
  Zap, 
  Copy, 
  Check, 
  ArrowRight,
  Globe
} from 'lucide-react';

interface RealTechAdModalProps {
  isOpen: boolean;
  onClose: () => void;
  adIndex?: number;
}

export const RealTechAdModal: React.FC<RealTechAdModalProps> = ({
  isOpen,
  onClose,
  adIndex = 0
}) => {
  const [currentAd, setCurrentAd] = useState<RealTechAd>(REAL_TECH_ADS[0]);
  const [countdown, setCountdown] = useState<number>(3);
  const [canClose, setCanClose] = useState<boolean>(false);
  const [copiedCode, setCopiedCode] = useState<boolean>(false);

  useEffect(() => {
    if (isOpen) {
      const ad = REAL_TECH_ADS[adIndex % REAL_TECH_ADS.length] || REAL_TECH_ADS[0];
      setCurrentAd(ad);
      setCountdown(3);
      setCanClose(false);
      setCopiedCode(false);

      const interval = setInterval(() => {
        setCountdown(prev => {
          if (prev <= 1) {
            setCanClose(true);
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
    window.open(currentAd.officialUrl, '_blank', 'noopener,noreferrer');
  };

  const handleCopyPromo = () => {
    if (currentAd.promoCode) {
      navigator.clipboard.writeText(currentAd.promoCode);
      setCopiedCode(true);
      setTimeout(() => setCopiedCode(false), 3000);
    }
  };

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/85 backdrop-blur-xl animate-fade-in select-none"
      onClick={(e) => e.stopPropagation()}
    >
      {/* Dynamic Ambient Background Glow */}
      <div className={`absolute inset-0 bg-gradient-to-br ${currentAd.bannerTheme.bgGradient} opacity-60 pointer-events-none`}></div>
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-cyan-600/10 rounded-full blur-3xl pointer-events-none animate-pulse"></div>

      {/* Main Container */}
      <div className="relative w-full max-w-3xl max-h-[92vh] overflow-y-auto bg-slate-950/95 border-2 border-white/15 rounded-3xl p-5 sm:p-8 shadow-[0_0_80px_rgba(0,0,0,0.9)] flex flex-col justify-between space-y-6 custom-scrollbar z-10">
        
        {/* Top Header Bar: Verified Advertiser Label & Close Countdown */}
        <div className="flex items-center justify-between gap-3 border-b border-white/10 pb-4">
          
          <div className="flex items-center gap-3">
            <div className="px-3 py-1 rounded-xl bg-slate-900 border border-white/10 text-cyan-300 font-mono font-bold text-xs flex items-center gap-2 shadow-[0_0_15px_rgba(6,182,212,0.2)]">
              <ShieldCheck className="w-4 h-4 text-cyan-400" />
              <span>PUBLICIDADE REAL VERIFICADA</span>
            </div>
            
            <span className="text-xs text-slate-400 font-mono hidden sm:inline-flex items-center gap-1">
              <Globe className="w-3.5 h-3.5 text-slate-400" />
              {currentAd.verifiedLabel}
            </span>
          </div>

          {/* Close Action */}
          <div>
            {!canClose ? (
              <div className="px-3.5 py-1.5 rounded-xl bg-slate-900 border border-white/10 text-slate-400 text-xs font-mono font-bold flex items-center gap-2">
                <Timer className="w-3.5 h-3.5 text-cyan-400 animate-spin" />
                <span>Fechar ({countdown}s)</span>
              </div>
            ) : (
              <button
                onClick={onClose}
                className="px-4 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-white text-xs font-bold font-mono flex items-center gap-1.5 transition-all cursor-pointer border border-white/10 hover:border-cyan-400/50"
              >
                <span>Fechar</span>
                <X className="w-4 h-4" />
              </button>
            )}
          </div>

        </div>

        {/* Sponsor Brand Info & Real Offer */}
        <div className="space-y-4">
          
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            
            <div className="flex items-center gap-3.5">
              {/* Brand Logo Box */}
              <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${currentAd.logoBg} flex items-center justify-center font-black text-white text-xl font-mono shadow-lg border border-white/20 shrink-0`}>
                {currentAd.logoLetter}
              </div>
              
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="text-xl sm:text-2xl font-black text-white font-sans">
                    {currentAd.brand}
                  </h3>
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-mono font-bold bg-cyan-500/20 text-cyan-300 border border-cyan-400/30">
                    {currentAd.badge}
                  </span>
                </div>
                <p className="text-xs text-slate-400 font-mono">
                  {currentAd.brandTag} • {currentAd.category}
                </p>
              </div>
            </div>

            {/* Discount / Value Proposition Pill */}
            <div className="px-3.5 py-2 rounded-2xl bg-slate-900/90 border border-cyan-500/30 text-cyan-300 font-mono text-xs font-bold flex items-center gap-2 shadow-[0_0_15px_rgba(6,182,212,0.15)]">
              <Zap className="w-4 h-4 text-cyan-400 shrink-0" />
              <span>{currentAd.discountText}</span>
            </div>

          </div>

          {/* Headline & Description */}
          <div className="space-y-2 p-4 rounded-2xl bg-slate-900/60 border border-white/5">
            <h4 className="text-base sm:text-lg font-bold text-slate-100">
              {currentAd.title}
            </h4>
            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
              {currentAd.description}
            </p>
          </div>

          {/* Real Highlights / Features Bullet Points */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 pt-1">
            {currentAd.highlights.map((item, idx) => (
              <div key={idx} className="flex items-start gap-2.5 p-2.5 rounded-xl bg-slate-900/40 border border-white/5 text-xs text-slate-200">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                <span className="leading-snug">{item}</span>
              </div>
            ))}
          </div>

          {/* Promo Code & Coupon Bar (if available) */}
          {currentAd.promoCode && (
            <div className="flex items-center justify-between p-3 rounded-2xl bg-slate-900/80 border border-white/10">
              <div className="flex items-center gap-2">
                <Tag className="w-4 h-4 text-amber-400" />
                <span className="text-xs text-slate-300">Código Promocional Exclusivo:</span>
                <span className="px-2.5 py-0.5 rounded-lg bg-amber-500/20 text-amber-300 font-mono font-bold text-xs border border-amber-400/40">
                  {currentAd.promoCode}
                </span>
              </div>

              <button
                onClick={handleCopyPromo}
                className="px-3 py-1 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs text-slate-200 font-mono flex items-center gap-1.5 cursor-pointer transition-colors"
              >
                {copiedCode ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5 text-slate-400" />}
                <span>{copiedCode ? 'Copiado!' : 'Copiar'}</span>
              </button>
            </div>
          )}

        </div>

        {/* Footer Actions: Real CTA Link & Close Action */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-3 border-t border-white/10">
          
          <span className="text-[11px] text-slate-500 font-mono flex items-center gap-1 text-center sm:text-left">
            <span>Link oficial para</span>
            <span className="text-slate-400 font-bold">{new URL(currentAd.officialUrl).hostname}</span>
          </span>

          <div className="flex items-center gap-2.5 w-full sm:w-auto">
            <button
              onClick={onClose}
              className="flex-1 sm:flex-initial px-4 py-3 rounded-2xl bg-slate-900 hover:bg-slate-800 text-slate-300 hover:text-white text-xs font-semibold font-mono transition-colors border border-white/10 cursor-pointer text-center"
            >
              Continuar a Navegar
            </button>

            <button
              onClick={handleCtaClick}
              className={`flex-1 sm:flex-initial px-6 py-3 rounded-2xl bg-gradient-to-r ${currentAd.bannerTheme.buttonGradient} text-white font-bold text-xs sm:text-sm font-mono flex items-center justify-center gap-2 shadow-[0_0_25px_rgba(6,182,212,0.4)] hover:brightness-110 transition-all cursor-pointer`}
            >
              <span>{currentAd.ctaText}</span>
              <ExternalLink className="w-4 h-4" />
            </button>
          </div>

        </div>

      </div>

    </div>
  );
};
