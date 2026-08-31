import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNews } from '../context/NewsContext';
import { 
  X, 
  User, 
  Bookmark, 
  Award, 
  Settings, 
  LogOut, 
  Volume2, 
  VolumeX, 
  Bell, 
  Sparkles, 
  ShieldCheck, 
  ExternalLink,
  Lock,
  Flame,
  CheckCircle2,
  Cpu
} from 'lucide-react';

interface ProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const ProfileModal: React.FC<ProfileModalProps> = ({ isOpen, onClose }) => {
  const { user, logout, toggleBookmark, toggleSound, toggleNotifications } = useAuth();
  const { news, setSelectedNews } = useNews();

  const [activeTab, setActiveTab] = useState<'profile' | 'bookmarks' | 'security'>('profile');

  if (!isOpen || !user) return null;

  const bookmarkedArticles = news.filter(n => user.bookmarkedNewsIds.includes(n.id));

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 md:p-6 overflow-y-auto bg-slate-950/85 backdrop-blur-md">
      <div 
        className="relative w-full max-w-2xl bg-slate-950/95 border border-white/15 rounded-3xl overflow-hidden shadow-[0_16px_50px_rgba(0,0,0,0.7)] my-auto max-h-[90vh] flex flex-col backdrop-blur-2xl"
        onClick={e => e.stopPropagation()}
      >
        {/* Top Header */}
        <div className="flex items-center justify-between px-6 py-4 bg-slate-900/80 border-b border-white/10">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-cyan-500/15 border border-cyan-500/30 flex items-center justify-center text-cyan-400">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-base sm:text-lg font-bold text-white">Perfil Google Verificado</h2>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-emerald-500/15 text-emerald-300 border border-emerald-500/30 font-semibold flex items-center gap-1">
                  <CheckCircle2 className="w-3 h-3 text-emerald-400" /> Ativo
                </span>
              </div>
              <p className="text-xs text-slate-400">Identidade sincronizada diretamente com a sua Conta Google</p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-xl bg-slate-800/80 text-slate-400 hover:text-white transition-colors cursor-pointer border border-white/10"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Tab Navigation */}
        <div className="flex items-center gap-2 px-6 pt-3 border-b border-white/10 bg-slate-950/60 overflow-x-auto">
          <button
            onClick={() => setActiveTab('profile')}
            className={`pb-3 px-3 text-xs sm:text-sm font-semibold border-b-2 transition-all cursor-pointer whitespace-nowrap ${
              activeTab === 'profile'
                ? 'border-cyan-400 text-cyan-300'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            Conta & Identidade
          </button>

          <button
            onClick={() => setActiveTab('bookmarks')}
            className={`pb-3 px-3 text-xs sm:text-sm font-semibold border-b-2 transition-all cursor-pointer whitespace-nowrap ${
              activeTab === 'bookmarks'
                ? 'border-cyan-400 text-cyan-300'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            Cofre de Salvos ({bookmarkedArticles.length})
          </button>

          <button
            onClick={() => setActiveTab('security')}
            className={`pb-3 px-3 text-xs sm:text-sm font-semibold border-b-2 transition-all cursor-pointer whitespace-nowrap ${
              activeTab === 'security'
                ? 'border-cyan-400 text-cyan-300'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            Preferências & Sistema
          </button>
        </div>

        {/* Scrollable Content */}
        <div className="overflow-y-auto p-6 space-y-6 flex-1">
          
          {/* TAB 1: Profile & Identity (Locked to Google Data) */}
          {activeTab === 'profile' && (
            <div className="space-y-6">
              
              {/* Main Google Profile Card */}
              <div className="p-5 sm:p-6 bg-gradient-to-br from-slate-900/90 via-cyan-950/20 to-slate-900/90 border border-white/15 rounded-3xl space-y-4 shadow-[0_8px_30px_rgba(0,0,0,0.4)]">
                <div className="flex flex-col sm:flex-row items-center gap-5">
                  <div className="relative">
                    <img
                      src={user.avatar}
                      alt={user.name}
                      referrerPolicy="no-referrer"
                      className="w-20 h-20 sm:w-24 sm:h-24 rounded-3xl object-cover ring-2 ring-cyan-400/50 shadow-[0_0_25px_rgba(6,182,212,0.3)]"
                    />
                    <div className="absolute -bottom-1 -right-1 p-1.5 bg-slate-900 rounded-full border border-cyan-400/50 shadow-md">
                      {/* Google G Mini Icon */}
                      <svg className="w-4 h-4" viewBox="0 0 24 24">
                        <path fill="#4285F4" d="M23.745 12.27c0-.7-.06-1.4-.19-2.07H12v4.51h6.6c-.29 1.52-1.14 2.82-2.4 3.68v3.05h3.88c2.27-2.09 3.665-5.17 3.665-9.17z"/>
                        <path fill="#34A853" d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.88-3.05c-1.08.72-2.45 1.16-4.05 1.16-3.12 0-5.77-2.1-6.72-4.93H1.25v3.15C3.26 21.36 7.36 24 12 24z"/>
                        <path fill="#FBBC05" d="M5.28 14.27c-.25-.72-.38-1.49-.38-2.27s.13-1.55.38-2.27V6.58H1.25C.45 8.18 0 9.98 0 12s.45 3.82 1.25 5.42l4.03-3.15z"/>
                        <path fill="#EA4335" d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0 7.36 0 3.26 2.64 1.25 6.58l4.03 3.15c.95-2.83 3.6-4.98 6.72-4.98z"/>
                      </svg>
                    </div>
                  </div>

                  <div className="text-center sm:text-left flex-1 space-y-1.5">
                    <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2">
                      <h3 className="text-xl font-bold text-white">{user.name}</h3>
                      <span className="text-xs font-mono px-2 py-0.5 rounded-lg bg-cyan-950/80 text-cyan-300 border border-cyan-500/40 font-bold">
                        {user.role}
                      </span>
                    </div>
                    
                    <p className="text-xs text-slate-300 font-mono flex items-center justify-center sm:justify-start gap-1.5">
                      <span>{user.email}</span>
                    </p>

                    <div className="pt-1 flex flex-wrap items-center justify-center sm:justify-start gap-1.5">
                      {user.badges.map((badge, idx) => (
                        <span key={idx} className="text-[10px] px-2 py-0.5 rounded-md bg-slate-800/80 text-slate-300 border border-white/10 font-medium">
                          {badge}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Immutable Notice Banner */}
                <div className="p-3.5 rounded-2xl bg-cyan-950/40 border border-cyan-500/30 flex items-center gap-3 text-cyan-200 text-xs">
                  <Lock className="w-4 h-4 text-cyan-400 shrink-0" />
                  <span>
                    <strong>Perfil Protegido:</strong> O nome oficial e a foto de perfil permanecem sincronizados e vinculados à sua Conta Google, sem alterações manuais.
                  </span>
                </div>
              </div>

              {/* Statistics Grid */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                <div className="p-3.5 bg-slate-900/60 border border-white/10 rounded-2xl text-center space-y-1">
                  <div className="text-lg font-black text-cyan-400 font-mono">{bookmarkedArticles.length}</div>
                  <div className="text-[11px] text-slate-400">Artigos Salvos</div>
                </div>
                <div className="p-3.5 bg-slate-900/60 border border-white/10 rounded-2xl text-center space-y-1">
                  <div className="text-lg font-black text-blue-400 font-mono">{user.commentsCount || 0}</div>
                  <div className="text-[11px] text-slate-400">Comentários</div>
                </div>
                <div className="p-3.5 bg-slate-900/60 border border-white/10 rounded-2xl text-center space-y-1">
                  <div className="text-lg font-black text-emerald-400 font-mono">10s</div>
                  <div className="text-[11px] text-slate-400">Feed Live</div>
                </div>
                <div className="p-3.5 bg-slate-900/60 border border-white/10 rounded-2xl text-center space-y-1">
                  <div className="text-lg font-black text-teal-400 font-mono">OpenMeteo</div>
                  <div className="text-[11px] text-slate-400">Clima em Tempo Real</div>
                </div>
              </div>

              {/* Tech Topics */}
              <div className="p-4 bg-slate-900/60 border border-white/10 rounded-2xl space-y-2">
                <div className="text-xs font-bold text-slate-300 font-mono uppercase tracking-wider">
                  Tópicos de Interesse no Portal
                </div>
                <div className="flex flex-wrap gap-1.5">
                  {user.favoriteCategories.map((cat, idx) => (
                    <span key={idx} className="text-xs px-3 py-1 rounded-xl bg-cyan-950/40 text-cyan-300 border border-cyan-500/20 font-medium">
                      {cat}
                    </span>
                  ))}
                </div>
              </div>

            </div>
          )}

          {/* TAB 2: Bookmarks */}
          {activeTab === 'bookmarks' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-bold text-white flex items-center gap-2">
                  <Bookmark className="w-4 h-4 text-cyan-400" /> Artigos Guardados no Seu Cofre
                </h3>
                <span className="text-xs text-slate-400 font-mono">{bookmarkedArticles.length} salvos</span>
              </div>

              {bookmarkedArticles.length === 0 ? (
                <div className="text-center py-12 bg-slate-900/40 border border-white/10 rounded-2xl space-y-2">
                  <Bookmark className="w-8 h-8 text-slate-600 mx-auto" />
                  <p className="text-xs text-slate-400">Você ainda não guardou notícias.</p>
                  <p className="text-[11px] text-slate-500">Clique no ícone de marcador em qualquer notícia para adicioná-la aqui.</p>
                </div>
              ) : (
                <div className="space-y-2.5">
                  {bookmarkedArticles.map(article => (
                    <div 
                      key={article.id}
                      className="p-3.5 bg-slate-900/80 hover:bg-slate-900 border border-white/10 hover:border-cyan-500/30 rounded-2xl flex items-center justify-between gap-3 transition-all"
                    >
                      <div 
                        className="flex-1 cursor-pointer"
                        onClick={() => {
                          setSelectedNews(article);
                          onClose();
                        }}
                      >
                        <span className="text-[10px] font-mono px-2 py-0.5 rounded-md bg-cyan-950 text-cyan-400 border border-cyan-800/40 font-bold">
                          {article.category}
                        </span>
                        <h4 className="text-xs sm:text-sm font-bold text-slate-100 mt-1 line-clamp-1 hover:text-cyan-300">
                          {article.title}
                        </h4>
                        <p className="text-[11px] text-slate-400 line-clamp-1 mt-0.5">
                          {article.source} • {article.publishedAt}
                        </p>
                      </div>

                      <button
                        onClick={() => toggleBookmark(article.id)}
                        title="Remover dos salvos"
                        className="p-2 rounded-xl text-slate-400 hover:text-rose-400 hover:bg-rose-950/30 transition-colors cursor-pointer shrink-0"
                      >
                        <Bookmark className="w-4 h-4 fill-cyan-400 text-cyan-400" />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* TAB 3: Preferences & System Controls */}
          {activeTab === 'security' && (
            <div className="space-y-4">
              <h3 className="text-sm font-bold text-white flex items-center gap-2">
                <Settings className="w-4 h-4 text-cyan-400" /> Configurações de Experiência
              </h3>

              <div className="space-y-3">
                <div className="p-4 bg-slate-900/60 border border-white/10 rounded-2xl flex items-center justify-between">
                  <div className="space-y-0.5">
                    <div className="text-xs font-bold text-white flex items-center gap-2">
                      <Volume2 className="w-4 h-4 text-cyan-400" /> Efeitos Sonoros do Radar
                    </div>
                    <div className="text-[11px] text-slate-400">
                      Sons táteis discretos ao atualizar feeds e navegar no portal.
                    </div>
                  </div>
                  <button
                    onClick={toggleSound}
                    className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                      user.soundEnabled 
                        ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-400/40' 
                        : 'bg-slate-800 text-slate-400 border border-slate-700'
                    }`}
                  >
                    {user.soundEnabled ? 'Ativado' : 'Desativado'}
                  </button>
                </div>

                <div className="p-4 bg-slate-900/60 border border-white/10 rounded-2xl flex items-center justify-between">
                  <div className="space-y-0.5">
                    <div className="text-xs font-bold text-white flex items-center gap-2">
                      <Bell className="w-4 h-4 text-cyan-400" /> Notificações de Breaking News
                    </div>
                    <div className="text-[11px] text-slate-400">
                      Avisos em tempo real a cada novo ciclo de 10 segundos.
                    </div>
                  </div>
                  <button
                    onClick={toggleNotifications}
                    className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                      user.notificationsEnabled 
                        ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-400/40' 
                        : 'bg-slate-800 text-slate-400 border border-slate-700'
                    }`}
                  >
                    {user.notificationsEnabled ? 'Ativado' : 'Desativado'}
                  </button>
                </div>
              </div>

              {/* Logout Action */}
              <div className="pt-4 border-t border-white/10">
                <button
                  onClick={async () => {
                    await logout();
                    onClose();
                  }}
                  className="w-full py-3 px-4 bg-rose-950/40 hover:bg-rose-900/50 text-rose-300 hover:text-rose-200 border border-rose-800/50 rounded-2xl text-xs sm:text-sm font-bold flex items-center justify-center gap-2 transition-all cursor-pointer shadow-lg"
                >
                  <LogOut className="w-4 h-4" />
                  <span>Sair da Conta Google</span>
                </button>
              </div>

            </div>
          )}

        </div>

        {/* Footer */}
        <div className="p-4 bg-slate-900/80 border-t border-white/10 flex items-center justify-between">
          <div className="text-[11px] text-slate-400 flex items-center gap-1.5 font-mono">
            <span>ID Google:</span>
            <span className="text-slate-300 font-bold">{user.id.slice(0, 14)}...</span>
          </div>
          <button
            onClick={onClose}
            className="px-5 py-2 bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white font-bold rounded-xl text-xs transition-all cursor-pointer shadow-[0_0_15px_rgba(6,182,212,0.3)]"
          >
            Fechar
          </button>
        </div>

      </div>
    </div>
  );
};
