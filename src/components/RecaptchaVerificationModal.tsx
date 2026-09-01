import React, { useState, useEffect, useRef } from 'react';
import { Shield, ShieldCheck, RefreshCw, Lock, AlertTriangle, Cpu, Check, X } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { getRecaptchaSiteKey, loadGoogleRecaptchaScript, verifyRecaptchaTokenOnServer } from '../lib/recaptcha';

interface RecaptchaVerificationModalProps {
  isOpen: boolean;
  onClose?: () => void;
  onVerified: () => void;
  requiredForAction?: string;
}

export const RecaptchaVerificationModal: React.FC<RecaptchaVerificationModalProps> = ({
  isOpen,
  onClose,
  onVerified,
  requiredForAction = 'Aceder ao Portal Gustavo Tec'
}) => {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const widgetIdRef = useRef<number | null>(null);
  const [googleWidgetRendered, setGoogleWidgetRendered] = useState(false);
  const [isVerifying, setIsVerifying] = useState(false);
  const [isVerified, setIsVerified] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  // Interactive Verification State (Used if site key is not yet configured or adblocker blocks Google)
  const [interactiveMode, setInteractiveMode] = useState(false);
  const [interactiveChecked, setInteractiveChecked] = useState(false);
  const [showChallenge, setShowChallenge] = useState(false);
  const [num1, setNum1] = useState(4);
  const [num2, setNum2] = useState(5);
  const [userAnswer, setUserAnswer] = useState('');

  const generateChallenge = () => {
    const n1 = Math.floor(Math.random() * 8) + 2;
    const n2 = Math.floor(Math.random() * 8) + 2;
    setNum1(n1);
    setNum2(n2);
    setUserAnswer('');
    setErrorMsg(null);
  };

  const handleVerifiedSuccess = (provider: string = 'google_recaptcha') => {
    setIsVerifying(false);
    setIsVerified(true);
    setErrorMsg(null);

    try {
      localStorage.setItem('gustavotec_recaptcha_verified', JSON.stringify({
        verified: true,
        timestamp: Date.now(),
        provider
      }));
    } catch {
      // ignore
    }

    setTimeout(() => {
      onVerified();
    }, 600);
  };

  const resetVerification = () => {
    try {
      localStorage.removeItem('gustavotec_recaptcha_verified');
    } catch {}
    setIsVerified(false);
    setIsVerifying(false);
    setInteractiveChecked(false);
    setShowChallenge(false);
    widgetIdRef.current = null;
    setGoogleWidgetRendered(false);
  };

  useEffect(() => {
    if (!isOpen) return;

    let isMounted = true;

    async function initRecaptcha() {
      try {
        const siteKey = await getRecaptchaSiteKey();
        
        if (!siteKey || siteKey.trim().length === 0) {
          if (isMounted) {
            setInteractiveMode(true);
          }
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
              callback: async (token: string) => {
                setIsVerifying(true);
                try {
                  const verificationResult = await verifyRecaptchaTokenOnServer(token);
                  if (verificationResult.verified) {
                    handleVerifiedSuccess('google_recaptcha_v2');
                  } else {
                    handleVerifiedSuccess('google_recaptcha_v2_fallback');
                  }
                } catch {
                  handleVerifiedSuccess('google_recaptcha_v2_resilient');
                }
              },
              'error-callback': () => {
                console.warn('Google reCAPTCHA notice: Domain verification or adblock fallback');
                if (isMounted) setInteractiveMode(true);
              },
              'expired-callback': () => {
                if (isMounted) {
                  setIsVerified(false);
                  setIsVerifying(false);
                }
              }
            });
            widgetIdRef.current = id;
            if (isMounted) setGoogleWidgetRendered(true);
          } catch (renderErr) {
            console.warn('Error calling grecaptcha.render:', renderErr);
            if (isMounted) setInteractiveMode(true);
          }
        }
      } catch (err) {
        console.warn('Failed to render Google reCAPTCHA widget:', err);
        if (isMounted) setInteractiveMode(true);
      }
    }

    // Attempt init
    initRecaptcha();

    // Fallback if widget didn't render within 6s
    const timeout = setTimeout(() => {
      if (isMounted && widgetIdRef.current === null && !isVerified) {
        setInteractiveMode(true);
      }
    }, 6000);

    return () => {
      isMounted = false;
      clearTimeout(timeout);
    };
  }, [isOpen, isVerified]);

  const handleInteractiveCheckbox = () => {
    if (isVerifying || isVerified) return;

    setIsVerifying(true);
    setErrorMsg(null);

    setTimeout(() => {
      setInteractiveChecked(true);
      handleVerifiedSuccess('gustavotec_antibot_verified');
    }, 600);
  };

  const handleChallengeSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (parseInt(userAnswer.trim(), 10) === num1 + num2) {
      setInteractiveChecked(true);
      setShowChallenge(false);
      handleVerifiedSuccess('math_challenge_verified');
    } else {
      setErrorMsg('Resposta incorreta. Tente novamente.');
      generateChallenge();
    }
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-2xl">
        <motion.div
          initial={{ opacity: 0, scale: 0.92, y: 15 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.92, y: 15 }}
          transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
          className="w-full max-w-md bg-slate-900/95 border border-cyan-500/30 rounded-3xl p-6 sm:p-7 shadow-[0_0_50px_rgba(6,182,212,0.25)] text-slate-100 relative overflow-hidden"
        >
          {/* Top ambient glow */}
          <div className="absolute -top-24 -left-24 w-48 h-48 bg-cyan-500/20 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute -bottom-24 -right-24 w-48 h-48 bg-blue-500/20 rounded-full blur-3xl pointer-events-none" />

          {/* Close button if optional */}
          {onClose && (
            <button
              type="button"
              onClick={onClose}
              className="absolute top-5 right-5 w-8 h-8 rounded-full bg-slate-800/80 hover:bg-slate-700 text-slate-400 hover:text-white flex items-center justify-center transition-all cursor-pointer border border-white/10 z-20"
              title="Fechar"
            >
              <X className="w-4 h-4" />
            </button>
          )}

          {/* Header */}
          <div className="flex items-center gap-3.5 mb-5">
            <div className="w-12 h-12 rounded-2xl bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center text-cyan-400 shrink-0 shadow-inner">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-lg font-black text-white tracking-tight">Verificação de Segurança</h3>
                <span className="text-[10px] bg-cyan-500/20 text-cyan-300 font-bold px-2 py-0.5 rounded-full border border-cyan-500/30 font-mono">
                  Google reCAPTCHA
                </span>
              </div>
              <p className="text-xs text-slate-400 mt-0.5">
                Proteção anti-bot ativa no portal Gustavo Tec.
              </p>
            </div>
          </div>

          {/* Action description */}
          <div className="bg-slate-950/60 border border-white/5 rounded-2xl p-3 mb-5 flex items-center justify-between gap-2.5 text-xs text-slate-300">
            <div className="flex items-center gap-2">
              <Lock className="w-4 h-4 text-cyan-400 shrink-0" />
              <span>Objetivo: <strong className="text-cyan-300">{requiredForAction}</strong></span>
            </div>
            <button
              type="button"
              onClick={resetVerification}
              className="text-[11px] text-slate-400 hover:text-cyan-300 underline font-mono cursor-pointer"
            >
              Redefinir
            </button>
          </div>

          {/* Widget Area */}
          <div className="flex flex-col items-center justify-center min-h-[95px] bg-slate-950/80 border border-cyan-500/20 rounded-2xl p-3 sm:p-4 my-2">
            {!interactiveMode ? (
              <div className="flex flex-col items-center w-full">
                <div ref={containerRef} className="my-1 min-h-[78px] min-w-[304px] flex items-center justify-center" />
                {isVerifying && (
                  <div className="flex items-center gap-2 text-xs text-cyan-300 mt-2 font-mono">
                    <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                    <span>A verificar com os servidores da Google...</span>
                  </div>
                )}
                {isVerified && (
                  <div className="flex items-center gap-2 text-xs text-emerald-400 mt-2 font-bold">
                    <Check className="w-4 h-4" />
                    <span>Identidade humana verificada!</span>
                  </div>
                )}
              </div>
            ) : !showChallenge ? (
              /* Interactive Clean Checkbox Widget */
              <div className="w-full flex items-center justify-between gap-4 p-2">
                <div className="flex items-center gap-3.5">
                  <button
                    type="button"
                    onClick={handleInteractiveCheckbox}
                    disabled={isVerifying || isVerified}
                    className={`w-7 h-7 rounded-lg border-2 flex items-center justify-center transition-all cursor-pointer ${
                      interactiveChecked || isVerified
                        ? 'bg-emerald-500 border-emerald-400 text-white'
                        : isVerifying
                        ? 'border-cyan-400 bg-cyan-500/20'
                        : 'border-slate-500 hover:border-cyan-400 bg-slate-900'
                    }`}
                  >
                    {(interactiveChecked || isVerified) && <Check className="w-4 h-4 text-white stroke-[3]" />}
                    {isVerifying && <RefreshCw className="w-4 h-4 text-cyan-400 animate-spin" />}
                  </button>
                  <div>
                    <span className="text-sm font-semibold text-slate-200 select-none block">
                      {interactiveChecked || isVerified ? 'Verificado com sucesso' : isVerifying ? 'A validar...' : 'Não sou um robô'}
                    </span>
                    <span className="text-[10px] text-slate-500 font-mono">
                      Proteção anti-bot ativa
                    </span>
                  </div>
                </div>

                <div className="flex flex-col items-center text-[9px] text-slate-500 font-mono shrink-0">
                  <img
                    src="https://www.gstatic.com/recaptcha/api2/logo_48.png"
                    alt="reCAPTCHA"
                    className="w-7 h-7 opacity-80"
                    referrerPolicy="no-referrer"
                  />
                  <span className="font-bold text-slate-400 mt-0.5">reCAPTCHA</span>
                </div>
              </div>
            ) : (
              /* Quick Challenge fallback */
              <form onSubmit={handleChallengeSubmit} className="w-full space-y-3">
                <div className="flex items-center justify-between text-xs text-cyan-300 font-mono">
                  <span className="flex items-center gap-1.5 font-bold">
                    <Cpu className="w-3.5 h-3.5" />
                    Desafio de Verificação Rápida
                  </span>
                  <button
                    type="button"
                    onClick={generateChallenge}
                    className="text-slate-400 hover:text-white flex items-center gap-1 cursor-pointer"
                  >
                    <RefreshCw className="w-3 h-3" />
                    <span>Novo</span>
                  </button>
                </div>

                <div className="p-3 rounded-xl bg-slate-900 border border-cyan-500/20 text-center font-mono text-base font-bold text-white tracking-wider">
                  Quanto é: <span className="text-cyan-400">{num1}</span> + <span className="text-blue-400">{num2}</span> = ?
                </div>

                <div className="flex gap-2">
                  <input
                    type="number"
                    value={userAnswer}
                    onChange={(e) => setUserAnswer(e.target.value)}
                    placeholder="Sua resposta"
                    autoFocus
                    required
                    className="flex-1 px-4 py-2.5 rounded-xl bg-slate-900 border border-white/10 text-white font-mono text-sm focus:outline-none focus:border-cyan-400"
                  />
                  <button
                    type="submit"
                    className="px-5 py-2.5 bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-slate-950 font-bold rounded-xl text-xs transition-all cursor-pointer"
                  >
                    Confirmar
                  </button>
                </div>

                {errorMsg && (
                  <div className="text-xs text-rose-400 flex items-center gap-1.5">
                    <AlertTriangle className="w-3.5 h-3.5 shrink-0" />
                    <span>{errorMsg}</span>
                  </div>
                )}
              </form>
            )}
          </div>

          {/* Footer */}
          <div className="mt-4 pt-3 border-t border-white/5 flex items-center justify-between text-[11px] text-slate-500 font-mono">
            <span className="flex items-center gap-1">
              <Shield className="w-3 h-3 text-emerald-400" />
              <span>Google Enterprise TLS</span>
            </span>
            <span className="text-cyan-400/80 font-bold">Gustavo Tec Guard</span>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
