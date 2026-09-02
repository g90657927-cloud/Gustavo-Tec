import React, { useState } from 'react';
import { useAuth, FOUNDER_EMAIL, isFounderEmail } from '../context/AuthContext';
import { 
  X, 
  Mail, 
  Zap, 
  Bot, 
  KeyRound,
  CheckCircle2,
  AlertCircle,
  ArrowRight,
  Send,
  RotateCcw,
  Inbox,
  ExternalLink
} from 'lucide-react';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const AuthModal: React.FC<AuthModalProps> = ({ isOpen, onClose }) => {
  const { 
    loginWithEmail,
    loginWithGoogle, 
    sendGmailOtp,
    verifyGmailOtp,
    authError, 
    isAuthLoading, 
    clearAuthError 
  } = useAuth();

  const [inputEmail, setInputEmail] = useState('');
  const [otpCode, setOtpCode] = useState('');
  const [otpStep, setOtpStep] = useState<'input' | 'verify'>('input');
  const [modalFeedback, setModalFeedback] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  if (!isOpen) return null;

  const handleGoogleSignIn = async () => {
    clearAuthError();
    setModalFeedback(null);
    await loginWithGoogle();
    onClose();
  };

  const handleSendCode = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    clearAuthError();
    setModalFeedback(null);

    const clean = inputEmail.trim().toLowerCase();
    if (!clean || !clean.endsWith('@gmail.com')) {
      setModalFeedback({ type: 'error', text: 'Por favor, insira um e-mail do Gmail válido (@gmail.com).' });
      return;
    }

    const res = await sendGmailOtp(clean);
    if (res.success) {
      setOtpStep('verify');
      setModalFeedback({ 
        type: 'success', 
        text: `O Bot Gustavo Tec enviou o código para ${clean}. Verifique a sua caixa de entrada.` 
      });
    } else {
      setModalFeedback({ type: 'error', text: res.message || 'Erro ao enviar código.' });
    }
  };

  const handleVerifyCode = async (e: React.FormEvent) => {
    e.preventDefault();
    clearAuthError();
    setModalFeedback(null);

    const cleanCode = otpCode.trim();
    if (!cleanCode || cleanCode.length < 6) {
      setModalFeedback({ type: 'error', text: 'Por favor, insira o código de 6 dígitos que recebeu no Gmail.' });
      return;
    }

    const res = await verifyGmailOtp(inputEmail, cleanCode);
    if (res.success) {
      setModalFeedback({ type: 'success', text: res.message });
      setTimeout(() => {
        onClose();
      }, 700);
    } else {
      setModalFeedback({ type: 'error', text: res.message || 'Código incorreto ou expirado.' });
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-md">
      <div 
        className="relative w-full max-w-lg bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 shadow-2xl shadow-cyan-950/40 space-y-6"
        onClick={e => e.stopPropagation()}
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition-colors cursor-pointer"
        >
          <X className="w-4 h-4" />
        </button>

        {/* Modal Header */}
        <div className="text-center space-y-2">
          <div className="inline-flex items-center justify-center w-12 h-12 rounded-2xl bg-cyan-500/10 border border-cyan-500/30 text-cyan-400 mb-1">
            <Mail className="w-6 h-6" />
          </div>
          <h2 className="text-xl sm:text-2xl font-black text-slate-100 tracking-tight">
            Entrar no Gustavo Tec
          </h2>
          <p className="text-xs sm:text-sm text-slate-400">
            Acesso vinculado exclusivamente ao seu <strong className="text-white">endereço de e-mail</strong>.
          </p>
        </div>

        {/* Auth Error Banner */}
        {(authError || (modalFeedback && modalFeedback.type === 'error')) && (
          <div className="bg-rose-500/15 border border-rose-500/30 rounded-2xl p-4 text-xs text-rose-200 space-y-2 text-left">
            <div className="flex items-start gap-2">
              <AlertCircle className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />
              <span className="flex-1 font-medium">{authError || modalFeedback?.text}</span>
            </div>
          </div>
        )}

        {/* Success Banner */}
        {modalFeedback && modalFeedback.type === 'success' && (
          <div className="bg-emerald-500/15 border border-emerald-500/30 rounded-2xl p-4 text-xs text-emerald-200 flex items-center gap-2 text-left">
            <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
            <span className="flex-1 font-medium">{modalFeedback.text}</span>
          </div>
        )}

        {/* Email Login Section */}
        <div className="p-4 rounded-2xl bg-slate-950/80 border border-cyan-500/40 space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-xs font-mono font-bold text-cyan-300">
              <Mail className="w-4 h-4 text-cyan-400" />
              <span>Entrar com E-mail</span>
            </div>
            {isFounderEmail(inputEmail) && (
              <span className="px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-300 border border-amber-400/30 text-[10px] font-mono">
                👑 Fundador
              </span>
            )}
          </div>

          {otpStep === 'input' ? (
            <form onSubmit={handleSendCode} className="space-y-3">
              <div>
                <label className="text-xs font-semibold text-slate-300 mb-1 flex items-center justify-between">
                  <span>Endereço de Gmail</span>
                  <button
                    type="button"
                    onClick={() => setInputEmail(FOUNDER_EMAIL)}
                    className="text-[10px] text-cyan-400 hover:text-cyan-300 font-mono underline cursor-pointer"
                  >
                    Usar {FOUNDER_EMAIL}
                  </button>
                </label>
                <div className="relative">
                  <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                  <input
                    type="email"
                    required
                    value={inputEmail}
                    onChange={e => setInputEmail(e.target.value)}
                    placeholder="seu.email@gmail.com"
                    className="w-full bg-slate-950 border border-slate-800 focus:border-cyan-500 rounded-xl pl-10 pr-4 py-2.5 text-xs sm:text-sm text-slate-100 placeholder-slate-600 focus:outline-none transition-all font-mono"
                  />
                </div>
              </div>

              <div className="pt-1">
                <button
                  type="submit"
                  disabled={isAuthLoading || !inputEmail}
                  className="w-full py-2.5 bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-slate-950 font-bold rounded-xl text-xs sm:text-sm transition-all shadow-md shadow-cyan-500/20 cursor-pointer flex items-center justify-center gap-2 disabled:opacity-50"
                >
                  <Send className="w-4 h-4" />
                  <span>{isAuthLoading ? 'A enviar código...' : 'Enviar Código para o Gmail'}</span>
                </button>
              </div>
            </form>
          ) : (
            <div className="space-y-3">
              <div className="p-3 rounded-xl bg-slate-900 border border-cyan-500/30 text-xs space-y-1.5">
                <div className="flex items-center justify-between text-[11px] font-mono text-cyan-300">
                  <span className="flex items-center gap-1">
                    <Inbox className="w-3.5 h-3.5 text-cyan-400" />
                    <span>Código enviado para:</span>
                  </span>
                  <span className="text-slate-300 font-mono">{inputEmail}</span>
                </div>
                <p className="text-slate-300 text-[11px] leading-relaxed">
                  O Bot Gustavo Tec enviou o código de 6 dígitos para a sua caixa de entrada do Gmail.
                </p>
              </div>

              <form onSubmit={handleVerifyCode} className="space-y-3">
                <div>
                  <label className="text-xs font-semibold text-slate-300 mb-1 flex items-center justify-between">
                    <span>Código de 6 Dígitos</span>
                    <span className="text-[10px] text-slate-400 font-mono">10 min</span>
                  </label>
                  <div className="relative">
                    <KeyRound className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-cyan-400" />
                    <input
                      type="text"
                      maxLength={6}
                      required
                      value={otpCode}
                      onChange={e => setOtpCode(e.target.value.replace(/\D/g, ''))}
                      placeholder="849201"
                      className="w-full bg-slate-950 border border-cyan-500/50 focus:border-cyan-400 rounded-xl pl-10 pr-4 py-2.5 text-center text-sm font-bold font-mono tracking-widest text-cyan-200 focus:outline-none transition-all"
                      autoFocus
                    />
                  </div>
                </div>

                <div className="flex gap-2">
                  <button
                    type="submit"
                    disabled={isAuthLoading || otpCode.length < 6}
                    className="flex-1 py-2.5 bg-gradient-to-r from-emerald-400 to-cyan-500 hover:from-emerald-300 hover:to-cyan-400 text-slate-950 font-bold rounded-xl text-xs sm:text-sm transition-all shadow-md shadow-emerald-500/20 cursor-pointer flex items-center justify-center gap-2 disabled:opacity-50"
                  >
                    <CheckCircle2 className="w-4 h-4" />
                    <span>Validar Código & Entrar</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      setOtpStep('input');
                      setOtpCode('');
                    }}
                    className="px-3 py-2.5 bg-slate-900 hover:bg-slate-800 text-slate-300 border border-slate-700 rounded-xl text-xs font-semibold flex items-center gap-1 cursor-pointer"
                    title="Voltar"
                  >
                    <RotateCcw className="w-3.5 h-3.5" />
                  </button>
                </div>
              </form>
            </div>
          )}
        </div>

        {/* Divider */}
        <div className="relative flex items-center justify-center">
          <div className="border-t border-slate-800 w-full"></div>
          <span className="bg-slate-900 px-3 text-[11px] text-slate-500 font-mono uppercase">
            ou Google
          </span>
        </div>

        {/* Google 1-Click Sign In */}
        <div>
          <button
            onClick={handleGoogleSignIn}
            disabled={isAuthLoading}
            className="w-full py-3 px-4 bg-white hover:bg-slate-100 text-slate-900 font-bold rounded-2xl text-xs sm:text-sm flex items-center justify-center gap-3 shadow-lg shadow-white/5 transition-all cursor-pointer border border-slate-200 disabled:opacity-60"
          >
            <svg className="w-4 h-4 shrink-0" viewBox="0 0 24 24">
              <path
                fill="#4285F4"
                d="M23.745 12.27c0-.7-.06-1.4-.19-2.07H12v4.51h6.6c-.29 1.52-1.14 2.82-2.4 3.68v3.05h3.88c2.27-2.09 3.665-5.17 3.665-9.17z"
              />
              <path
                fill="#34A853"
                d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.88-3.05c-1.08.72-2.45 1.16-4.05 1.16-3.12 0-5.77-2.1-6.72-4.93H1.25v3.15C3.26 21.36 7.36 24 12 24z"
              />
              <path
                fill="#FBBC05"
                d="M5.28 14.27c-.25-.72-.38-1.49-.38-2.27s.13-1.55.38-2.27V6.58H1.25C.45 8.18 0 9.98 0 12s.45 3.82 1.25 5.42l4.03-3.15z"
              />
              <path
                fill="#EA4335"
                d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0 7.36 0 3.26 2.64 1.25 6.58l4.03 3.15c.95-2.83 3.6-4.98 6.72-4.98z"
              />
            </svg>
            <span>{isAuthLoading ? 'A autenticar no Gustavo Tec...' : 'Entrar no Gustavo Tec com Google'}</span>
          </button>
        </div>

      </div>
    </div>
  );
};
