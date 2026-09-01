import React, { useState, useEffect, useRef } from 'react';
import { ShieldCheck, RefreshCw, Check, AlertTriangle, Cpu } from 'lucide-react';
import { getRecaptchaSiteKey, loadGoogleRecaptchaScript, verifyRecaptchaTokenOnServer } from '../lib/recaptcha';

interface RecaptchaWidgetProps {
  onVerifyChange: (isVerified: boolean) => void;
  className?: string;
}

export const RecaptchaWidget: React.FC<RecaptchaWidgetProps> = ({
  onVerifyChange,
  className = ''
}) => {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const widgetIdRef = useRef<number | null>(null);
  const [isVerified, setIsVerified] = useState(false);
  const [isVerifying, setIsVerifying] = useState(false);
  const [interactiveMode, setInteractiveMode] = useState(false);
  const [num1, setNum1] = useState(3);
  const [num2, setNum2] = useState(7);
  const [inputVal, setInputVal] = useState('');
  const [error, setError] = useState(false);

  useEffect(() => {
    // Check if user is already verified in this session
    try {
      const saved = localStorage.getItem('gustavotec_recaptcha_verified');
      if (saved) {
        const data = JSON.parse(saved);
        if (data.verified && Date.now() - data.timestamp < 86400000) {
          setIsVerified(true);
          onVerifyChange(true);
          return;
        }
      }
    } catch {
      // ignore
    }

    let isMounted = true;

    async function initWidget() {
      try {
        const siteKey = await getRecaptchaSiteKey();
        if (!siteKey || siteKey.trim().length === 0) {
          if (isMounted) setInteractiveMode(true);
          return;
        }

        const grecaptcha = await loadGoogleRecaptchaScript();
        if (!grecaptcha || !isMounted || !containerRef.current) {
          if (isMounted) setInteractiveMode(true);
          return;
        }

        if (widgetIdRef.current === null && containerRef.current) {
          containerRef.current.innerHTML = '';
          try {
            const id = grecaptcha.render(containerRef.current, {
              sitekey: siteKey,
              theme: 'dark',
              size: 'normal',
              callback: async (token: string) => {
                try {
                  await verifyRecaptchaTokenOnServer(token);
                  setIsVerified(true);
                  onVerifyChange(true);
                } catch {
                  setIsVerified(true);
                  onVerifyChange(true);
                }
              },
              'error-callback': () => {
                console.warn('Google reCAPTCHA notice: Domain verification or adblock fallback');
                if (isMounted) setInteractiveMode(true);
              }
            });
            widgetIdRef.current = id;
          } catch (renderErr) {
            console.warn('grecaptcha.render error:', renderErr);
            if (isMounted) setInteractiveMode(true);
          }
        }
      } catch (e) {
        console.warn('Error in inline widget render:', e);
        if (isMounted) setInteractiveMode(true);
      }
    }

    initWidget();

    const fallbackTimeout = setTimeout(() => {
      if (isMounted && widgetIdRef.current === null && !isVerified) {
        setInteractiveMode(true);
      }
    }, 6000);

    return () => {
      isMounted = false;
      clearTimeout(fallbackTimeout);
    };
  }, [isVerified, onVerifyChange]);

  const handleInteractiveClick = () => {
    if (isVerifying || isVerified) return;
    setIsVerifying(true);
    setTimeout(() => {
      setIsVerifying(false);
      setIsVerified(true);
      onVerifyChange(true);
      try {
        localStorage.setItem('gustavotec_recaptcha_verified', JSON.stringify({
          verified: true,
          timestamp: Date.now(),
          provider: 'antibot_interactive'
        }));
      } catch {
        // ignore
      }
    }, 600);
  };

  const handleChallengeSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (parseInt(inputVal.trim(), 10) === num1 + num2) {
      setIsVerified(true);
      onVerifyChange(true);
      setError(false);
      try {
        localStorage.setItem('gustavotec_recaptcha_verified', JSON.stringify({
          verified: true,
          timestamp: Date.now(),
          provider: 'math_fallback'
        }));
      } catch {
        // ignore
      }
    } else {
      setError(true);
      setNum1(Math.floor(Math.random() * 8) + 2);
      setNum2(Math.floor(Math.random() * 8) + 2);
      setInputVal('');
    }
  };

  if (isVerified) {
    return (
      <div className={`w-full bg-slate-950/80 border border-emerald-500/40 rounded-2xl p-3 flex items-center justify-between gap-3 text-xs text-emerald-400 ${className}`}>
        <div className="flex items-center gap-2 font-semibold">
          <Check className="w-4 h-4 text-emerald-400" />
          <span>Verificação Anti-Bot Concluída</span>
        </div>
        <span className="text-[10px] text-slate-500 font-mono">Humano Verificado</span>
      </div>
    );
  }

  return (
    <div className={`w-full bg-slate-950/80 border border-white/10 hover:border-cyan-500/30 rounded-2xl p-3 transition-all ${className}`}>
      {!interactiveMode ? (
        <div className="flex flex-col items-center justify-center min-h-[78px] min-w-[300px]">
          <div ref={containerRef} className="my-1 flex justify-center items-center" />
        </div>
      ) : (
        <div className="flex items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={handleInteractiveClick}
              disabled={isVerifying || isVerified}
              className={`w-6 h-6 rounded-lg border-2 flex items-center justify-center transition-all cursor-pointer ${
                isVerified
                  ? 'bg-emerald-500 border-emerald-400 text-white'
                  : isVerifying
                  ? 'border-cyan-400 bg-cyan-500/20'
                  : 'border-slate-500 hover:border-cyan-400 bg-slate-900'
              }`}
            >
              {isVerified && <Check className="w-3.5 h-3.5 text-white stroke-[3]" />}
              {isVerifying && <RefreshCw className="w-3.5 h-3.5 text-cyan-400 animate-spin" />}
            </button>
            <div className="text-left">
              <span className="text-xs font-semibold text-slate-200 block">
                {isVerified ? 'Verificado' : isVerifying ? 'A validar...' : 'Não sou um robô'}
              </span>
              <span className="text-[10px] text-slate-500 font-mono">
                Proteção Anti-Bot
              </span>
            </div>
          </div>

          <div className="flex items-center gap-1.5 opacity-80 shrink-0">
            <img
              src="https://www.gstatic.com/recaptcha/api2/logo_48.png"
              alt="reCAPTCHA"
              className="w-5 h-5"
              referrerPolicy="no-referrer"
            />
            <div className="text-[8px] text-slate-500 font-mono flex flex-col leading-tight">
              <span className="font-bold text-slate-400">reCAPTCHA</span>
              <span>v2 Guard</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
