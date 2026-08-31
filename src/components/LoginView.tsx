import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNews } from '../context/NewsContext';
import {
  Sparkles,
  Shield,
  CheckCircle2,
  Lock,
  Mail,
  ArrowRight,
  LogOut,
  User,
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
  Bot
} from 'lucide-react';

interface LoginViewProps {
  onSuccess?: () => void;
  onOpenGemini?: () => void;
}

export const LoginView: React.FC<LoginViewProps> = ({ onSuccess, onOpenGemini }) => {
  const { 
    user, 
    loginWithGoogle, 
    loginAsGustavo, 
    loginAsGuest, 
    logout, 
    isAuthLoading, 
    authError, 
    clearAuthError,
    toggleBookmark
  } = useAuth();
  
  const { news, setSelectedNews } = useNews();
  const [dailyBrief, setDailyBrief] = useState<string | null>(null);
  const [isGeneratingBrief, setIsGeneratingBrief] = useState(false);

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
                  <div className="absolute -bottom-1 -right-1 w-7 h-7 bg-emerald-500 rounded-full border-2 border-slate-950 flex items-center justify-center text-white shadow-md shadow-emerald-500/40" title="Conta Conectada">
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
                  {user.favoriteCategories.length}
                </div>
                <div className="text-xs text-slate-300 font-medium mt-0.5 flex items-center justify-center gap-1">
                  <Flame className="w-3.5 h-3.5 text-emerald-400" />
                  <span>Tópicos Favoritos</span>
                </div>
              </div>

              <div className="liquid-glass-subtle rounded-2xl p-4 text-center border border-white/5">
                <div className="text-xl sm:text-2xl font-black text-amber-400 font-mono">
                  {user.badges.length}
                </div>
                <div className="text-xs text-slate-300 font-medium mt-0.5 flex items-center justify-center gap-1">
                  <Award className="w-3.5 h-3.5 text-amber-400" />
                  <span>Distintivos</span>
                </div>
              </div>
            </div>

            {/* Badges & Tech Stack */}
            <div className="mt-6 pt-6 border-t border-white/10 flex flex-wrap items-center justify-between gap-4">
              <div className="space-y-1.5">
                <span className="text-xs font-bold text-slate-300 font-mono uppercase tracking-wider">Sua Stack Técnica</span>
                <div className="flex flex-wrap gap-1.5">
                  {user.techStack.map((tech, idx) => (
                    <span key={idx} className="text-xs px-3 py-1 rounded-xl liquid-glass text-cyan-300 border border-cyan-400/20 font-mono">
                      {tech}
                    </span>
                  ))}
                </div>
              </div>

              <div className="space-y-1.5">
                <span className="text-xs font-bold text-slate-300 font-mono uppercase tracking-wider">Crachás de Membro</span>
                <div className="flex flex-wrap gap-1.5">
                  {user.badges.map((badge, idx) => (
                    <span key={idx} className="text-xs px-3 py-1 rounded-xl liquid-glass text-purple-300 border border-purple-400/20 font-mono">
                      {badge}
                    </span>
                  ))}
                </div>
              </div>
            </div>

          </div>

          {/* AI Briefing Generator Feature for Logged In User */}
          <div className="liquid-glass-card rounded-3xl p-6 sm:p-8 space-y-4 shadow-[0_8px_32px_rgba(0,0,0,0.5)] border border-cyan-500/30">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className="p-2 rounded-xl bg-gradient-to-r from-cyan-500/20 to-blue-500/20 text-cyan-300 border border-cyan-400/30">
                    <Bot className="w-5 h-5" />
                  </span>
                  <h3 className="text-lg font-bold text-white">
                    Briefing de IA Personalizado ({user.name})
                  </h3>
                </div>
                <p className="text-xs sm:text-sm text-slate-300">
                  Gera um resumo executivo inteligente das principais notícias do momento adaptado aos seus tópicos ({user.favoriteCategories.join(', ')}) e stack ({user.techStack.slice(0, 3).join(', ')}).
                </p>
              </div>

              <button
                onClick={handleGenerateDailyBrief}
                disabled={isGeneratingBrief}
                className="px-6 py-3 bg-gradient-to-r from-cyan-400 to-blue-600 hover:from-cyan-300 hover:to-blue-500 text-slate-950 font-bold rounded-2xl text-xs sm:text-sm flex items-center gap-2 shadow-[0_0_20px_rgba(6,182,212,0.35)] transition-all cursor-pointer shrink-0 disabled:opacity-50 border border-white/20"
              >
                <RefreshCw className={`w-4 h-4 ${isGeneratingBrief ? 'animate-spin' : ''}`} />
                <span>{isGeneratingBrief ? 'Analisando Feeds...' : 'Gerar Meu Briefing Tech'}</span>
              </button>
            </div>

            {dailyBrief && (
              <div className="mt-4 p-5 liquid-glass rounded-2xl text-slate-200 text-xs sm:text-sm leading-relaxed space-y-2 border border-cyan-400/30 shadow-inner">
                <div className="flex items-center gap-2 text-cyan-300 font-mono font-bold text-xs">
                  <Check className="w-4 h-4 text-emerald-400" />
                  <span>Resumo Gerado com Sucesso via ChatBot IA:</span>
                </div>
                <div className="whitespace-pre-line text-slate-200 pt-2 border-t border-white/10">
                  {dailyBrief}
                </div>
              </div>
            )}
          </div>

          {/* Bookmarked News Vault */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-bold text-white flex items-center gap-2">
                <Bookmark className="w-5 h-5 text-cyan-400" />
                <span>Seus Artigos Salvos ({bookmarkedNews.length})</span>
              </h3>
              <span className="text-xs text-slate-400 font-mono">
                Sincronizado na sua conta
              </span>
            </div>

            {bookmarkedNews.length === 0 ? (
              <div className="p-8 liquid-glass-subtle rounded-3xl text-center space-y-2 border border-white/5">
                <Bookmark className="w-8 h-8 text-slate-500 mx-auto" />
                <p className="text-sm font-semibold text-slate-200">Nenhum artigo salvo ainda.</p>
                <p className="text-xs text-slate-400 max-w-sm mx-auto">
                  Clique no ícone de marcador nas notícias para salvá-las aqui e acessá-las rapidamente a qualquer momento.
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {bookmarkedNews.map(item => (
                  <div
                    key={item.id}
                    onClick={() => setSelectedNews(item)}
                    className="p-5 liquid-glass hover:liquid-glass-active rounded-3xl transition-all cursor-pointer group flex flex-col justify-between space-y-3 shadow-md"
                  >
                    <div className="space-y-2">
                      <div className="flex items-center justify-between text-[11px] font-mono">
                        <span className="text-cyan-400 font-bold">{item.category}</span>
                        <span className="text-slate-400">{item.source}</span>
                      </div>
                      <h4 className="font-bold text-sm text-slate-100 group-hover:text-cyan-300 line-clamp-2">
                        {item.title}
                      </h4>
                      <p className="text-xs text-slate-300 line-clamp-2">
                        {item.summary}
                      </p>
                    </div>

                    <div className="flex items-center justify-between pt-3 border-t border-white/10 text-xs">
                      <span className="text-slate-400 font-mono">{item.publishedAt}</span>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          toggleBookmark(item.id);
                        }}
                        className="text-rose-400 hover:text-rose-300 font-semibold text-xs cursor-pointer"
                      >
                        Remover
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

        </div>
      ) : (
        /* Logged Out - Benefits and 1-Click Login */
        <div className="liquid-glass-card rounded-3xl p-6 sm:p-12 shadow-[0_16px_50px_rgba(0,0,0,0.6)] relative overflow-hidden text-center max-w-2xl mx-auto space-y-8">
          
          <div className="absolute top-0 right-0 w-80 h-80 bg-cyan-500/15 rounded-full blur-3xl pointer-events-none -mr-20 -mt-20"></div>
          <div className="absolute bottom-0 left-0 w-80 h-80 bg-blue-500/10 rounded-full blur-3xl pointer-events-none -ml-20 -mb-20"></div>

          {/* Logo / Brand Header */}
          <div className="relative z-10 flex flex-col items-center space-y-3">
            
            <div className="w-16 h-16 rounded-3xl bg-gradient-to-tr from-cyan-500 via-blue-600 to-indigo-600 flex items-center justify-center text-white shadow-[0_0_30px_rgba(6,182,212,0.4)] border border-white/20">
              <Zap className="w-8 h-8 text-white" />
            </div>

            <span className="px-3.5 py-1 rounded-full bg-cyan-950/80 border border-cyan-400/30 text-cyan-300 text-xs font-mono font-bold uppercase tracking-wider shadow-[0_0_10px_rgba(6,182,212,0.2)]">
              Portal Gustavo Tec
            </span>

            <h1 className="text-2xl sm:text-3xl md:text-4xl font-black text-white tracking-tight">
              Entrar no Gustavo Tec
            </h1>

            <p className="text-slate-300 text-sm max-w-lg leading-relaxed">
              Faça login para desbloquear o cofre de artigos favoritos, comentar com perfil verificado e receber análises com inteligência artificial ChatBot.
            </p>
          </div>

          {/* Error display */}
          {authError && (
            <div className="w-full bg-rose-500/15 border border-rose-400/30 rounded-2xl p-4 text-xs text-rose-200 space-y-2 text-left backdrop-blur-md">
              <div className="flex items-start gap-2.5">
                <AlertCircle className="w-4 h-4 shrink-0 text-rose-400 mt-0.5" />
                <div className="flex-1 font-medium">{authError}</div>
                <button onClick={clearAuthError} className="text-xs text-rose-300 hover:text-white cursor-pointer font-bold">✕</button>
              </div>
              {authError.includes('Domínio não autorizado') && (
                <div className="pt-2 border-t border-rose-500/20 flex flex-wrap items-center justify-between gap-2">
                  <div className="text-[11px] text-slate-300">
                    Copie o domínio abaixo e cole em <strong className="text-cyan-300">Firebase Console &gt; Authentication &gt; Settings &gt; Authorized Domains</strong>:
                  </div>
                  <div className="flex items-center gap-2 w-full sm:w-auto">
                    <span className="font-mono text-[11px] text-cyan-300 bg-slate-950 px-2.5 py-1 rounded-lg border border-cyan-500/30">
                      {typeof window !== 'undefined' ? window.location.hostname : ''}
                    </span>
                    <button
                      type="button"
                      onClick={() => {
                        if (typeof window !== 'undefined') {
                          navigator.clipboard.writeText(window.location.hostname);
                          alert('Domínio copiado: ' + window.location.hostname);
                        }
                      }}
                      className="px-2.5 py-1 bg-cyan-500/20 hover:bg-cyan-500/30 text-cyan-300 rounded-lg text-[11px] font-bold border border-cyan-400/40 cursor-pointer"
                    >
                      Copiar
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Login Action Buttons */}
          <div className="space-y-3 max-w-md mx-auto">
            {/* Google Sign In Button */}
            <button
              onClick={loginWithGoogle}
              disabled={isAuthLoading}
              className="w-full py-4 px-6 bg-white hover:bg-slate-100 active:bg-slate-200 text-slate-950 font-bold rounded-2xl text-sm sm:text-base flex items-center justify-center gap-3.5 shadow-xl shadow-white/10 transition-all cursor-pointer border border-slate-200 disabled:opacity-50"
            >
              {/* Official Google SVG Icon */}
              <svg className="w-5 h-5 shrink-0" viewBox="0 0 24 24">
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

              <span>{isAuthLoading ? 'Autenticando com Google...' : 'Continuar com o Google (Gmail)'}</span>
              <ArrowRight className="w-4 h-4 ml-1 text-slate-500" />
            </button>

            {/* Quick Login Options */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 pt-2">
              <button
                onClick={loginAsGustavo}
                className="py-3 px-4 liquid-glass hover:liquid-glass-active text-cyan-300 hover:text-cyan-200 rounded-2xl text-xs font-semibold flex items-center justify-center gap-1.5 transition-all cursor-pointer border border-cyan-400/30 group"
              >
                <Shield className="w-3.5 h-3.5 text-cyan-400 group-hover:scale-110 transition-transform" />
                <span>Entrar como Gustavo Peixoto</span>
              </button>

              <button
                onClick={loginAsGuest}
                className="py-3 px-4 liquid-glass hover:liquid-glass-active text-slate-300 hover:text-white rounded-2xl text-xs font-semibold flex items-center justify-center gap-1.5 transition-all cursor-pointer border border-white/10"
              >
                <User className="w-3.5 h-3.5 text-slate-400" />
                <span>Sessão de Convidado</span>
              </button>
            </div>
          </div>

          {/* Real Utility Features Highlights */}
          <div className="pt-6 border-t border-white/10 grid grid-cols-1 sm:grid-cols-2 gap-3 text-left">
            <div className="p-3.5 liquid-glass-subtle rounded-2xl flex items-start gap-3 border border-white/5">
              <Bookmark className="w-4 h-4 text-cyan-400 shrink-0 mt-0.5" />
              <div>
                <h4 className="text-xs font-bold text-slate-200">Cofre de Artigos Salvos</h4>
                <p className="text-[11px] text-slate-400">Guarde notícias importantes para leitura posterior com 1 clique.</p>
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
                <p className="text-[11px] text-slate-400">Participe nas discussões técnicas com distintivo e reputação.</p>
              </div>
            </div>

            <div className="p-3.5 liquid-glass-subtle rounded-2xl flex items-start gap-3 border border-white/5">
              <Sliders className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
              <div>
                <h4 className="text-xs font-bold text-slate-200">Preferências Sincronizadas</h4>
                <p className="text-[11px] text-slate-400">Sons, alertas e categorias prioritárias salvas na sua conta.</p>
              </div>
            </div>
          </div>

        </div>
      )}

    </div>
  );
};

