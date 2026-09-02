import React, { useState } from 'react';
import { useAuth, FOUNDER_EMAIL, isFounderEmail } from '../context/AuthContext';
import { useNews } from '../context/NewsContext';
import {
  Sparkles,
  Shield,
  CheckCircle2,
  Lock,
  Mail,
  ArrowRight,
  LogOut,
  Zap,
  Award,
  AlertCircle,
  Bookmark,
  MessageSquare,
  Flame,
  RefreshCw,
  Code2,
  Sliders,
  Check,
  Bot,
  KeyRound,
  Inbox,
  Send,
  RotateCcw,
  ExternalLink,
  Globe,
  Database
} from 'lucide-react';

interface LoginViewProps {
  onSuccess?: () => void;
  onOpenGemini?: () => void;
}

export const LoginView: React.FC<LoginViewProps> = ({ onSuccess, onOpenGemini }) => {
  const { 
    user, 
    loginWithEmail,
    loginWithGoogle, 
    sendGmailOtp,
    verifyGmailOtp,
    logout, 
    isAuthLoading, 
    authError, 
    clearAuthError,
    toggleBookmark
  } = useAuth();
  
  const { news, setSelectedNews } = useNews();
  const [dailyBrief, setDailyBrief] = useState<string | null>(null);
  const [isGeneratingBrief, setIsGeneratingBrief] = useState(false);

  // Email Auth State
  const [inputEmail, setInputEmail] = useState('');
  const [otpCode, setOtpCode] = useState('');
  const [otpStep, setOtpStep] = useState<'input' | 'verify'>('input');
  const [statusMessage, setStatusMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  const bookmarkedNews = news.filter(n => user?.bookmarkedNewsIds.includes(n.id));

  const handleGenerateDailyBrief = async () => {
    if (!user) return;
    setIsGeneratingBrief(true);
    try {
      const topHeadlines = news.slice(0, 5).map(n => `- ${n.title} (${n.source}): ${n.summary}`).join('\n');
      const response = await fetch('/api/gemini/summarize', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          text: `Perfil do usuário: ${user.name} (${user.role}). Interesses: ${user.favoriteCategories.join(', ')}. Stack: ${user.techStack.join(', ')}.\n\nPrincipais notícias do momento:\n${topHeadlines}`,
          mode: 'executive'
        })
      });
      const data = await response.json();
      if (data.output) {
        setDailyBrief(data.output);
      }
    } catch (err) {
      console.error('Erro ao gerar brief diário:', err);
    } finally {
      setIsGeneratingBrief(false);
    }
  };

  /**
   * Request OTP verification code via Bot Gustavo Tec
   */
  const handleSendOtp = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    clearAuthError();
    setStatusMessage(null);

    const clean = inputEmail.trim().toLowerCase();
    if (!clean || !clean.endsWith('@gmail.com')) {
      setStatusMessage({ type: 'error', text: 'Por favor, insira um endereço de e-mail do Gmail válido (@gmail.com).' });
      return;
    }

    const res = await sendGmailOtp(clean);
    if (res.success) {
      setOtpStep('verify');
      setStatusMessage({ 
        type: 'success', 
        text: `O Bot Gustavo Tec enviou o código de 6 dígitos para ${clean}. Verifique a sua caixa de entrada do Gmail.` 
      });
    } else {
      setStatusMessage({ type: 'error', text: res.message || 'Erro ao processar envio do código.' });
    }
  };

  /**
   * Verify OTP Code
   */
  const handleVerifyOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    clearAuthError();
    setStatusMessage(null);

    const cleanCode = otpCode.trim();
    if (!cleanCode || cleanCode.length < 6) {
      setStatusMessage({ type: 'error', text: 'Por favor, insira o código de 6 dígitos que recebeu no seu Gmail.' });
      return;
    }

    const res = await verifyGmailOtp(inputEmail, cleanCode);
    if (res.success) {
      setStatusMessage({ type: 'success', text: res.message });
      if (onSuccess) {
        setTimeout(onSuccess, 800);
      }
    } else {
      setStatusMessage({ type: 'error', text: res.message || 'Código incorreto ou expirado.' });
    }
  };

  const handleFillFounderDemo = () => {
    setInputEmail(FOUNDER_EMAIL);
    clearAuthError();
    setStatusMessage(null);
  };

  return (
    <div className="max-w-5xl mx-auto py-4 sm:py-6 px-3 sm:px-6 space-y-8">
      
      {/* If already authenticated - Show Rich Utility Hub */}
      {user ? (
        <div className="space-y-6">
          
          {/* Main Profile Header Card with Liquid Glass */}
          <div className="liquid-glass-card rounded-3xl p-6 sm:p-8 shadow-[0_8px_32px_rgba(0,0,0,0.5)] relative overflow-hidden">
            <div className="absolute top-0 right-0 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none -mr-20 -mt-20"></div>
            
            <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-6 pb-6 border-b border-white/10">
              <div className="flex flex-col sm:flex-row items-center sm:items-start text-center sm:text-left gap-5">
                <div className="relative">
                  <img
                    src={user.avatar}
                    alt={user.name}
                    className="w-20 h-20 sm:w-24 sm:h-24 rounded-3xl object-cover ring-2 ring-cyan-400/50 shadow-2xl shadow-cyan-950/50"
                    referrerPolicy="no-referrer"
                  />
                  <div className="absolute -bottom-1 -right-1 w-7 h-7 bg-emerald-500 rounded-full border-2 border-slate-950 flex items-center justify-center text-white shadow-md shadow-emerald-500/40" title="Conta Conectada na Nuvem">
                    <CheckCircle2 className="w-4 h-4" />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2">
                    <span className="px-3 py-0.5 rounded-full bg-cyan-950/80 text-cyan-300 text-xs font-mono font-bold border border-cyan-400/30 flex items-center gap-1 shadow-[0_0_10px_rgba(6,182,212,0.2)]">
                      <Shield className="w-3 h-3 text-cyan-400" />
                      {user.role}
                    </span>
                    <span className="text-xs text-slate-400 font-mono">@{user.username}</span>
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-emerald-950/60 text-emerald-300 border border-emerald-500/30 flex items-center gap-1">
                      <Database className="w-2.5 h-2.5 text-emerald-400" /> Firestore Sincronizado
                    </span>
                  </div>

                  <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
                    {user.name}
                  </h1>

                  <p className="text-slate-300 text-xs sm:text-sm font-mono flex items-center justify-center sm:justify-start gap-1.5">
                    <Mail className="w-3.5 h-3.5 text-cyan-400" />
                    <span>{user.email}</span>
                  </p>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center gap-3 w-full sm:w-auto justify-center">
                <button
                  onClick={logout}
                  className="px-5 py-2.5 liquid-glass hover:bg-rose-500/20 hover:text-rose-300 text-slate-300 hover:border-rose-400/40 rounded-2xl text-xs sm:text-sm font-bold flex items-center gap-2 transition-all cursor-pointer shadow-md"
                >
                  <LogOut className="w-4 h-4" />
                  <span>Sair da Conta</span>
                </button>
              </div>
            </div>

            {/* User Quick Stats Bar */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-6">
              <div className="liquid-glass-subtle rounded-2xl p-4 text-center border border-white/5">
                <div className="text-xl sm:text-2xl font-black text-cyan-400 font-mono">
                  {user.bookmarkedNewsIds.length}
                </div>
                <div className="text-xs text-slate-300 font-medium mt-0.5 flex items-center justify-center gap-1">
                  <Bookmark className="w-3.5 h-3.5 text-cyan-400" />
                  <span>Artigos Salvos</span>
                </div>
              </div>

              <div className="liquid-glass-subtle rounded-2xl p-4 text-center border border-white/5">
                <div className="text-xl sm:text-2xl font-black text-purple-400 font-mono">
                  {user.techStack.length}
                </div>
                <div className="text-xs text-slate-300 font-medium mt-0.5 flex items-center justify-center gap-1">
                  <Code2 className="w-3.5 h-3.5 text-purple-400" />
                  <span>Tecnologias</span>
                </div>
              </div>

              <div className="liquid-glass-subtle rounded-2xl p-4 text-center border border-white/5">
                <div className="text-xl sm:text-2xl font-black text-emerald-400 font-mono">
                  {user.badges.length}
                </div>
                <div className="text-xs text-slate-300 font-medium mt-0.5 flex items-center justify-center gap-1">
                  <Award className="w-3.5 h-3.5 text-emerald-400" />
                  <span>Distintivos</span>
                </div>
              </div>

              <div className="liquid-glass-subtle rounded-2xl p-4 text-center border border-white/5">
                <div className="text-xl sm:text-2xl font-black text-amber-400 font-mono">
                  {user.commentsCount || 0}
                </div>
                <div className="text-xs text-slate-300 font-medium mt-0.5 flex items-center justify-center gap-1">
                  <MessageSquare className="w-3.5 h-3.5 text-amber-400" />
                  <span>Comentários</span>
                </div>
              </div>
            </div>

            {/* Badges Pill Row */}
            <div className="pt-6 flex flex-wrap items-center gap-2">
              <span className="text-xs text-slate-400 font-mono mr-2">Distintivos da Conta:</span>
              {user.badges.map((badge, idx) => (
                <span
                  key={idx}
                  className="px-3 py-1 rounded-xl bg-white/5 border border-white/10 text-xs font-semibold text-slate-200 flex items-center gap-1.5 shadow-sm"
                >
                  <span>{badge}</span>
                </span>
              ))}
            </div>
          </div>

          {/* AI Executive Daily Briefing Section */}
          <div className="liquid-glass-card rounded-3xl p-6 sm:p-7 border border-purple-500/20 shadow-xl space-y-4">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-purple-600 to-indigo-600 flex items-center justify-center text-white shadow-lg shadow-purple-500/30">
                  <Sparkles className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-white flex items-center gap-2">
                    Briefing Executivo Personalizado
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-purple-500/20 text-purple-300 border border-purple-500/30">
                      Gemini 2.5 Flash
                    </span>
                  </h3>
                  <p className="text-xs text-slate-400">
                    Resumo analítico focado no seu perfil e tecnologias favoritas ({user.techStack.slice(0, 3).join(', ')}).
                  </p>
                </div>
              </div>

              <button
                onClick={handleGenerateDailyBrief}
                disabled={isGeneratingBrief}
                className="w-full sm:w-auto px-4 py-2.5 bg-purple-600 hover:bg-purple-500 text-white rounded-xl text-xs font-bold flex items-center justify-center gap-2 transition-all shadow-md shadow-purple-600/30 cursor-pointer disabled:opacity-50"
              >
                <RefreshCw className={`w-3.5 h-3.5 ${isGeneratingBrief ? 'animate-spin' : ''}`} />
                <span>{isGeneratingBrief ? 'A sintetizar com IA...' : 'Gerar Meu Briefing'}</span>
              </button>
            </div>

            {dailyBrief ? (
              <div className="p-4 rounded-2xl bg-slate-900/90 border border-purple-500/30 text-xs text-slate-200 whitespace-pre-line leading-relaxed font-sans shadow-inner">
                {dailyBrief}
              </div>
            ) : (
              <div className="p-4 rounded-2xl bg-slate-900/40 border border-dashed border-white/10 text-center text-xs text-slate-400">
                Clique no botão acima para gerar um briefing executivo sob medida com as notícias mais importantes do dia.
              </div>
            )}
          </div>

          {/* Bookmarked News Section */}
          <div className="liquid-glass-card rounded-3xl p-6 sm:p-7 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-white/10">
              <div className="flex items-center gap-2.5">
                <Bookmark className="w-5 h-5 text-cyan-400" />
                <h3 className="text-base font-bold text-white">Seus Artigos Salvos</h3>
                <span className="px-2 py-0.5 rounded-full bg-cyan-950 text-cyan-400 text-xs font-mono font-bold border border-cyan-500/30">
                  {bookmarkedNews.length}
                </span>
              </div>
              <span className="text-[11px] text-slate-400 font-mono">Sincronizado na Nuvem</span>
            </div>

            {bookmarkedNews.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pt-2">
                {bookmarkedNews.map(item => (
                  <div
                    key={item.id}
                    onClick={() => setSelectedNews(item)}
                    className="p-3.5 rounded-2xl bg-slate-900/80 hover:bg-slate-800/90 border border-white/10 hover:border-cyan-500/40 transition-all cursor-pointer flex gap-3 group"
                  >
                    <img
                      src={item.imageUrl}
                      alt={item.title}
                      className="w-16 h-16 rounded-xl object-cover shrink-0 group-hover:scale-105 transition-transform"
                    />
                    <div className="flex-1 min-w-0 flex flex-col justify-between">
                      <h4 className="text-xs font-bold text-slate-200 line-clamp-2 group-hover:text-cyan-300 transition-colors">
                        {item.title}
                      </h4>
                      <div className="flex items-center justify-between text-[11px] text-slate-400 mt-1">
                        <span className="font-mono text-cyan-400">{item.category}</span>
                        <span>{item.readTime}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="py-8 text-center text-xs text-slate-400 space-y-2">
                <Bookmark className="w-8 h-8 mx-auto text-slate-600 stroke-[1.5]" />
                <p>Ainda não salvou nenhum artigo nos seus favoritos.</p>
                <p className="text-[11px] text-slate-500">Clique no ícone de marcador nos cards de notícias para salvá-los no seu perfil.</p>
              </div>
            )}
          </div>

        </div>
      ) : (
        /* If NOT Authenticated - Main Login View */
        <div className="liquid-glass-card rounded-3xl p-6 sm:p-10 border border-white/15 shadow-2xl text-center space-y-6 max-w-2xl mx-auto">
          
          {/* Header */}
          <div className="space-y-3">
            <div className="w-16 h-16 mx-auto rounded-3xl bg-gradient-to-tr from-cyan-500 to-blue-600 flex items-center justify-center text-slate-950 shadow-xl shadow-cyan-500/30">
              <Mail className="w-8 h-8" />
            </div>

            <span className="px-3.5 py-1 rounded-full bg-cyan-950/80 border border-cyan-400/30 text-cyan-300 text-xs font-mono font-bold uppercase tracking-wider shadow-[0_0_10px_rgba(6,182,212,0.2)]">
              Portal Gustavo Tec
            </span>

            <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
              Acesso por E-mail & Conta Google
            </h1>

            <p className="text-slate-300 text-xs sm:text-sm max-w-lg mx-auto leading-relaxed">
              Inicie sessão com o seu <strong className="text-white">endereço de e-mail</strong> para sincronizar instantaneamente os seus favoritos, perfil e preferências na nuvem.
            </p>
          </div>

          {/* Quick Demo Profile Selector */}
          <div className="flex flex-wrap items-center justify-center gap-2 pt-1">
            <span className="text-[11px] text-slate-400 font-mono">Acesso rápido:</span>
            <button
              type="button"
              onClick={handleFillFounderDemo}
              className="px-3 py-1 rounded-full bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 border border-amber-400/40 text-xs font-mono font-bold flex items-center gap-1.5 transition-all cursor-pointer"
            >
              👑 {FOUNDER_EMAIL} (Fundador)
            </button>
          </div>

          {/* Global Auth Error display */}
          {(authError || (statusMessage && statusMessage.type === 'error')) && (
            <div className="w-full bg-rose-500/15 border border-rose-400/30 rounded-2xl p-4 text-xs text-rose-200 space-y-2 text-left backdrop-blur-md">
              <div className="flex items-start gap-2.5">
                <AlertCircle className="w-4 h-4 shrink-0 text-rose-400 mt-0.5" />
                <div className="flex-1 font-medium">{authError || statusMessage?.text}</div>
                <button 
                  onClick={() => {
                    clearAuthError();
                    setStatusMessage(null);
                  }} 
                  className="text-xs text-rose-300 hover:text-white cursor-pointer font-bold"
                >
                  ✕
                </button>
              </div>
            </div>
          )}

          {/* Success Banner */}
          {statusMessage && statusMessage.type === 'success' && (
            <div className="w-full bg-emerald-500/15 border border-emerald-400/30 rounded-2xl p-4 text-xs text-emerald-200 flex items-center gap-2.5 text-left backdrop-blur-md">
              <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-400" />
              <div className="flex-1 font-medium">{statusMessage.text}</div>
            </div>
          )}

          {/* PRIMARY METHOD: Direct Email Login */}
          <div className="p-6 rounded-2xl bg-cyan-950/30 border border-cyan-500/40 space-y-4 text-left shadow-xl">
            
            <div className="flex items-center justify-between pb-2 border-b border-white/10">
              <div className="flex items-center gap-2">
                <div className="p-1.5 rounded-lg bg-cyan-500/20 text-cyan-400 border border-cyan-500/30">
                  <Mail className="w-4 h-4" />
                </div>
                <div>
                  <span className="text-xs font-mono font-bold text-cyan-300 uppercase tracking-wider">
                    Entrar com E-mail
                  </span>
                  <p className="text-[11px] text-slate-400">
                    Sincronização na nuvem vinculada ao seu e-mail
                  </p>
                </div>
              </div>

              {isFounderEmail(inputEmail) && (
                <span className="px-2.5 py-0.5 rounded-full bg-amber-500/20 text-amber-300 border border-amber-400/30 text-[10px] font-mono font-bold">
                  👑 Conta Fundador
                </span>
              )}
            </div>

            {otpStep === 'input' ? (
              <form onSubmit={handleSendOtp} className="space-y-4">
                <div>
                  <label className="text-xs font-semibold text-slate-300 mb-1.5 flex items-center justify-between">
                    <span>Endereço de Gmail</span>
                    <span className="text-[11px] text-slate-400 font-mono">@gmail.com</span>
                  </label>
                  <div className="relative">
                    <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                    <input
                      type="email"
                      required
                      value={inputEmail}
                      onChange={(e) => setInputEmail(e.target.value)}
                      placeholder="exemplo@gmail.com"
                      className="w-full bg-slate-950/90 border border-slate-700 focus:border-cyan-400 rounded-xl pl-10 pr-4 py-3 text-sm text-slate-100 placeholder-slate-500 focus:outline-none transition-all font-mono"
                    />
                  </div>
                </div>

                {/* Primary Action Button: Request 6-digit Code */}
                <div className="pt-1">
                  <button
                    type="submit"
                    disabled={isAuthLoading || !inputEmail}
                    className="w-full py-3 px-5 bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 active:from-cyan-600 text-slate-950 font-bold rounded-xl text-xs sm:text-sm flex items-center justify-center gap-2 shadow-lg shadow-cyan-500/25 transition-all cursor-pointer disabled:opacity-50"
                  >
                    <Send className="w-4 h-4" />
                    <span>{isAuthLoading ? 'A enviar código...' : 'Enviar Código de 6 Dígitos para o Gmail'}</span>
                  </button>
                </div>
              </form>
            ) : (
              /* Step 2: Verification of Code */
              <div className="space-y-4">
                <div className="p-4 rounded-xl bg-slate-950/90 border border-cyan-500/40 space-y-2">
                  <div className="flex items-center justify-between pb-2 border-b border-white/10 text-xs font-mono">
                    <div className="flex items-center gap-1.5 text-cyan-300 font-bold">
                      <Inbox className="w-4 h-4 text-cyan-400" />
                      <span>Verificação de Acesso</span>
                    </div>
                    <span className="text-slate-400 text-[11px] font-mono">{inputEmail}</span>
                  </div>

                  <p className="text-slate-300 text-xs leading-relaxed">
                    O <strong className="text-cyan-300">Bot Gustavo Tec</strong> enviou o código de 6 dígitos para o seu e-mail <strong className="text-white font-mono">{inputEmail}</strong>. Verifique a sua caixa de entrada e introduza o código abaixo.
                  </p>
                </div>

                <form onSubmit={handleVerifyOtp} className="space-y-3">
                  <div>
                    <label className="text-xs font-semibold text-slate-300 mb-1.5 flex items-center justify-between">
                      <span>Código de 6 Dígitos</span>
                      <span className="text-[11px] text-slate-400 font-mono">Válido por 10 min</span>
                    </label>
                    <div className="relative">
                      <KeyRound className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-cyan-400" />
                      <input
                        type="text"
                        maxLength={6}
                        required
                        value={otpCode}
                        onChange={(e) => setOtpCode(e.target.value.replace(/\D/g, ''))}
                        placeholder="Ex: 849201"
                        className="w-full bg-slate-950/90 border border-cyan-500/50 focus:border-cyan-400 rounded-xl pl-10 pr-4 py-3 text-lg text-cyan-200 tracking-widest font-mono text-center placeholder-slate-600 focus:outline-none transition-all font-bold"
                        autoFocus
                      />
                    </div>
                  </div>

                  <div className="flex flex-col sm:flex-row gap-2">
                    <button
                      type="submit"
                      disabled={isAuthLoading || otpCode.length < 6}
                      className="flex-1 py-3 px-5 bg-gradient-to-r from-emerald-400 to-cyan-500 hover:from-emerald-300 hover:to-cyan-400 text-slate-950 font-bold rounded-xl text-xs sm:text-sm flex items-center justify-center gap-2 shadow-lg shadow-emerald-500/20 transition-all cursor-pointer disabled:opacity-50"
                    >
                      <CheckCircle2 className="w-4 h-4" />
                      <span>{isAuthLoading ? 'A validar...' : 'Validar Código & Entrar'}</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => {
                        setOtpStep('input');
                        setOtpCode('');
                      }}
                      className="px-4 py-3 bg-slate-900 hover:bg-slate-800 text-slate-300 hover:text-white border border-slate-700 rounded-xl text-xs font-semibold flex items-center justify-center gap-1.5 transition-all cursor-pointer"
                      title="Trocar e-mail ou voltar"
                    >
                      <RotateCcw className="w-3.5 h-3.5" />
                      <span>Voltar</span>
                    </button>
                  </div>
                </form>
              </div>
            )}

          </div>

          {/* Divider */}
          <div className="relative flex items-center justify-center">
            <div className="border-t border-white/10 w-full"></div>
            <span className="bg-slate-950 px-4 text-xs text-slate-400 font-mono uppercase tracking-wider">
              ou acesse com 1-clique
            </span>
          </div>

          {/* SECONDARY METHOD: Google 1-Click Sign In */}
          <div className="p-4 rounded-2xl bg-white/5 border border-white/10 flex flex-col sm:flex-row items-center justify-between gap-3 text-left">
            <div>
              <span className="text-xs font-mono font-bold text-slate-300 uppercase tracking-wider flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-cyan-400"></span>
                Autenticação Google no Gustavo Tec
              </span>
              <p className="text-[11px] text-slate-400">Login automático e seguro na plataforma Gustavo Tec com a sua conta Google</p>
            </div>

            <button
              type="button"
              onClick={loginWithGoogle}
              disabled={isAuthLoading}
              className="w-full sm:w-auto py-2.5 px-5 bg-white hover:bg-slate-100 active:bg-slate-200 text-slate-950 font-bold rounded-xl text-xs sm:text-sm flex items-center justify-center gap-2.5 shadow-md transition-all cursor-pointer border border-slate-200 disabled:opacity-50 shrink-0"
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
              <span>Entrar no Gustavo Tec com Google</span>
            </button>
          </div>

          {/* Real Benefits Highlights */}
          <div className="pt-6 border-t border-white/10 grid grid-cols-1 sm:grid-cols-2 gap-3 text-left">
            <div className="p-3.5 liquid-glass-subtle rounded-2xl flex items-start gap-3 border border-white/5">
              <Bookmark className="w-4 h-4 text-cyan-400 shrink-0 mt-0.5" />
              <div>
                <h4 className="text-xs font-bold text-slate-200">Cofre de Artigos Salvos</h4>
                <p className="text-[11px] text-slate-400">Guarde notícias importantes para leitura posterior sincronizado na nuvem.</p>
              </div>
            </div>

            <div className="p-3.5 liquid-glass-subtle rounded-2xl flex items-start gap-3 border border-white/5">
              <Sparkles className="w-4 h-4 text-purple-400 shrink-0 mt-0.5" />
              <div>
                <h4 className="text-xs font-bold text-slate-200">Briefing Personalizado IA</h4>
                <p className="text-[11px] text-slate-400">Resumos técnicos adaptados à sua stack e preferências de leitura.</p>
              </div>
            </div>

            <div className="p-3.5 liquid-glass-subtle rounded-2xl flex items-start gap-3 border border-white/5">
              <MessageSquare className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
              <div>
                <h4 className="text-xs font-bold text-slate-200">Comentários com Perfil Verificado</h4>
                <p className="text-[11px] text-slate-400">Participe nas discussões técnicas com distintivo oficial do portal.</p>
              </div>
            </div>

            <div className="p-3.5 liquid-glass-subtle rounded-2xl flex items-start gap-3 border border-white/5">
              <Shield className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
              <div>
                <h4 className="text-xs font-bold text-slate-200">Gestão Administrativa Segura</h4>
                <p className="text-[11px] text-slate-400">Acesso protegido exclusivo para a conta do Fundador ({FOUNDER_EMAIL}).</p>
              </div>
            </div>
          </div>

        </div>
      )}

    </div>
  );
};
