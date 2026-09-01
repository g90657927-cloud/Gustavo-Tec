import React from 'react';
import { useAuth, isFounderEmail } from '../context/AuthContext';
import { useNotifications } from '../context/NotificationContext';
import { useMaintenance } from '../context/MaintenanceContext';
import { 
  Flame, 
  MessageSquare, 
  Volume2, 
  VolumeX, 
  User as UserIcon, 
  Bot,
  CloudSun,
  Sliders,
  Bell,
  Trophy,
  ShieldCheck,
  Wrench
} from 'lucide-react';
import { DeviceViewMode } from '../types';
import { DeviceModeSwitcher } from './DeviceModeSwitcher';
import { GlobalSearchInput } from './GlobalSearchInput';

interface NavbarProps {
  currentTab: 'news' | 'football' | 'weather' | 'gemini' | 'tools' | 'community' | 'messages' | 'login';
  setCurrentTab: (tab: 'news' | 'football' | 'weather' | 'gemini' | 'tools' | 'community' | 'messages' | 'login') => void;
  onOpenAuth: () => void;
  onOpenProfile: () => void;
  onOpenMaintenance?: () => void;
  onOpenSponsorAd?: () => void;
  onOpenNotifications?: () => void;
  onOpenRecaptcha?: () => void;
  viewMode: DeviceViewMode;
  setViewMode: (mode: DeviceViewMode) => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentTab,
  setCurrentTab,
  onOpenAuth,
  onOpenProfile,
  onOpenMaintenance,
  onOpenSponsorAd,
  onOpenNotifications,
  onOpenRecaptcha,
  viewMode,
  setViewMode
}) => {
  const { user, isAuthenticated, toggleSound } = useAuth();
  const { unreadCount } = useNotifications();
  const { isMaintenanceActive, isAdmin } = useMaintenance();

  const navTabs = [
    {
      id: 'news' as const,
      label: 'Notícias',
      badge: '10s',
      icon: Flame,
      color: 'text-cyan-400',
      activeClass: 'liquid-glass-active text-cyan-200 !border-cyan-400/60 shadow-[0_0_20px_rgba(6,182,212,0.35)]'
    },
    {
      id: 'football' as const,
      label: 'Desporto Ao Vivo',
      badge: 'Flashscore',
      liveDot: true,
      icon: Trophy,
      color: 'text-rose-400',
      activeClass: 'liquid-glass-active text-rose-200 !border-rose-400/60 shadow-[0_0_20px_rgba(244,63,94,0.35)]'
    },
    {
      id: 'messages' as const,
      label: 'Mensagens Online',
      liveDot: true,
      icon: MessageSquare,
      color: 'text-emerald-400',
      activeClass: 'liquid-glass-active text-emerald-200 !border-emerald-400/60 shadow-[0_0_20px_rgba(52,211,153,0.35)]'
    },
    {
      id: 'weather' as const,
      label: 'Clima Portugal',
      icon: CloudSun,
      color: 'text-teal-400',
      activeClass: 'liquid-glass-active text-teal-200 !border-teal-400/60 shadow-[0_0_20px_rgba(20,184,166,0.35)]'
    },
    {
      id: 'gemini' as const,
      label: 'ChatBot IA',
      icon: Bot,
      color: 'text-blue-400',
      activeClass: 'liquid-glass-active text-blue-200 !border-blue-400/60 shadow-[0_0_20px_rgba(59,130,246,0.35)]'
    },
    {
      id: 'tools' as const,
      label: 'Operadoras (DIGI/MEO)',
      icon: Sliders,
      color: 'text-amber-400',
      activeClass: 'liquid-glass-active text-amber-200 !border-amber-400/60 shadow-[0_0_20px_rgba(245,158,11,0.35)]'
    },
    {
      id: 'login' as const,
      label: isAuthenticated ? 'A Minha Conta' : 'Login / Google',
      isAuth: true,
      icon: UserIcon,
      color: 'text-indigo-400',
      activeClass: 'bg-gradient-to-r from-blue-600/40 via-cyan-600/40 to-teal-500/30 text-white !border-cyan-400/60 shadow-[0_0_20px_rgba(6,182,212,0.35)]'
    }
  ];

  return (
    <header className="sticky top-0 z-40 bg-slate-950/85 border-b border-white/10 backdrop-blur-2xl shadow-[0_4px_30px_rgba(0,0,0,0.6)]">
      
      {/* Top Main Row */}
      <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 sm:h-20 gap-2 sm:gap-3">
          
          {/* Logo & Brand */}
          <div className="flex items-center gap-2 sm:gap-3 shrink-0">
            <button
              onClick={() => setCurrentTab('news')}
              className="flex items-center gap-2 sm:gap-2.5 text-left group cursor-pointer focus:outline-none"
            >
              <div className="relative flex items-center justify-center w-9 h-9 sm:w-11 sm:h-11 rounded-2xl bg-gradient-to-br from-cyan-400 via-blue-500 to-indigo-600 p-[1.5px] shadow-[0_0_20px_rgba(6,182,212,0.4)] group-hover:shadow-[0_0_30px_rgba(6,182,212,0.7)] transition-all duration-300">
                <div className="w-full h-full bg-slate-950/90 backdrop-blur-md rounded-[14px] flex items-center justify-center border border-white/10">
                  <span className="text-lg sm:text-2xl font-black bg-gradient-to-tr from-cyan-300 via-teal-200 to-blue-400 bg-clip-text text-transparent font-mono">
                    G
                  </span>
                </div>
                <span className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-cyan-400 rounded-full animate-ping opacity-75"></span>
                <span className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-cyan-400 rounded-full border-2 border-slate-950 shadow-[0_0_8px_rgba(6,182,212,0.9)]"></span>
              </div>

              <div>
                <div className="flex items-center gap-1.5">
                  <span className="text-lg sm:text-2xl font-black tracking-tight text-white font-sans drop-shadow-sm">
                    Gustavo<span className="bg-gradient-to-r from-cyan-400 to-blue-400 bg-clip-text text-transparent">Tec</span>
                  </span>
                  <span className="hidden xs:inline-block text-[10px] font-mono px-2 py-0.5 rounded-full bg-cyan-500/15 text-cyan-300 border border-cyan-400/30 uppercase tracking-widest font-semibold shadow-[0_0_10px_rgba(6,182,212,0.2)]">
                    10s LIVE
                  </span>
                </div>
              </div>
            </button>
          </div>

          {/* Global Search Input Field with Keyword & Category Filtering */}
          <GlobalSearchInput 
            onNavigateToNews={() => {
              if (currentTab !== 'news') {
                setCurrentTab('news');
              }
            }} 
          />

          {/* Right Action Tools */}
          <div className="flex items-center gap-1.5 sm:gap-2 shrink-0">
            
            {/* Device Switcher (Desktop / Tablet / Celular) */}
            <div className="flex">
              <DeviceModeSwitcher viewMode={viewMode} setViewMode={setViewMode} />
            </div>

            {/* Maintenance Control / Admin Button (Visible ONLY to Admin sougustavo000@gmail.com) */}
            {isAdmin && (
              <button
                onClick={onOpenMaintenance || onOpenProfile}
                title={isMaintenanceActive ? 'Modo de Manutenção ATIVO (Clique para gerir)' : 'Painel de Manutenção & Auditoria do Administrador'}
                className={`px-2.5 py-1.5 sm:py-2 rounded-xl backdrop-blur-md border text-xs font-mono transition-all cursor-pointer flex items-center gap-1.5 ${
                  isMaintenanceActive
                    ? 'bg-rose-500/20 text-rose-300 border-rose-500/50 hover:bg-rose-500/30 animate-pulse shadow-[0_0_12px_rgba(244,63,94,0.3)]'
                    : 'bg-amber-500/15 hover:bg-amber-500/25 text-amber-300 border-amber-500/40 hover:border-amber-400 shadow-[0_0_12px_rgba(245,158,11,0.2)]'
                }`}
              >
                <Wrench className="w-3.5 h-3.5 text-amber-400" />
                <span className="hidden sm:inline font-bold">
                  {isMaintenanceActive ? 'Manutenção Ativa' : 'Manutenção (Admin)'}
                </span>
              </button>
            )}

            {/* reCAPTCHA Security Center Test Button */}
            {onOpenRecaptcha && (
              <button
                onClick={onOpenRecaptcha}
                title="Verificação Google reCAPTCHA / Proteção Anti-Bot"
                className="px-2.5 py-1.5 sm:py-2 rounded-xl bg-slate-900/70 hover:bg-slate-800 backdrop-blur-md border border-cyan-500/30 text-cyan-300 hover:text-cyan-200 hover:border-cyan-400 transition-all cursor-pointer flex items-center gap-1.5 text-xs font-mono shadow-[0_0_12px_rgba(6,182,212,0.15)]"
              >
                <ShieldCheck className="w-3.5 h-3.5 text-cyan-400" />
                <span className="hidden md:inline font-bold">reCAPTCHA</span>
              </button>
            )}

            {/* Notifications Button */}
            {onOpenNotifications && (
              <button
                onClick={onOpenNotifications}
                title="Abrir Centro de Notificações Push"
                className="p-2 sm:p-2.5 rounded-xl bg-slate-900/70 hover:bg-slate-800 backdrop-blur-md border border-white/10 text-slate-300 hover:text-cyan-300 hover:border-cyan-500/40 transition-all cursor-pointer relative shadow-[inset_0_1px_0_rgba(255,255,255,0.08)]"
              >
                <Bell className="w-4 h-4" />
                {unreadCount > 0 && (
                  <span className="absolute -top-1 -right-1 px-1.5 py-0.2 rounded-full text-[10px] font-mono font-bold bg-cyan-500 text-slate-950 shadow-[0_0_10px_rgba(6,182,212,0.9)] animate-pulse">
                    {unreadCount}
                  </span>
                )}
              </button>
            )}

            {/* Sound toggle button */}
            <button
              onClick={toggleSound}
              title={user?.soundEnabled ? 'Silenciar avisos sonoros' : 'Ativar avisos sonoros'}
              className="p-2 sm:p-2.5 rounded-xl bg-slate-900/70 backdrop-blur-md border border-white/10 text-slate-400 hover:text-cyan-300 hover:border-cyan-500/40 transition-all cursor-pointer hidden sm:flex shadow-[inset_0_1px_0_rgba(255,255,255,0.08)]"
            >
              {user?.soundEnabled ? (
                <Volume2 className="w-4 h-4 text-cyan-400" />
              ) : (
                <VolumeX className="w-4 h-4 text-slate-500" />
              )}
            </button>

            {/* User Profile Button / Login */}
            {isAuthenticated && user ? (
              <button
                onClick={onOpenProfile}
                className="flex items-center gap-2 pl-1.5 sm:pl-2 pr-2 sm:pr-3 py-1 bg-slate-900/70 hover:bg-slate-800/80 backdrop-blur-md border border-white/10 hover:border-cyan-400/50 rounded-2xl transition-all cursor-pointer group shadow-[0_4px_20px_rgba(0,0,0,0.3)]"
              >
                <div className="relative">
                  <img
                    src={user.avatar}
                    alt={user.name}
                    className="w-7 h-7 sm:w-8 sm:h-8 rounded-xl object-cover ring-2 ring-cyan-400/40 group-hover:ring-cyan-400 shadow-sm"
                    referrerPolicy="no-referrer"
                  />
                  <span className="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 bg-emerald-400 rounded-full border-2 border-slate-950 shadow-[0_0_6px_rgba(52,211,153,0.9)]"></span>
                </div>
                <div className="text-left hidden md:block">
                  <div className="text-xs font-bold text-slate-100 group-hover:text-cyan-300 leading-tight">
                    {user.name.split(' ')[0]}
                  </div>
                  <div className="text-[10px] text-slate-400 font-mono truncate max-w-[80px]">
                    @{user.username}
                  </div>
                </div>
              </button>
            ) : (
              <button
                onClick={() => setCurrentTab('login')}
                className="flex items-center gap-1.5 px-2.5 sm:px-4 py-1.5 sm:py-2 bg-gradient-to-r from-cyan-500 via-blue-600 to-indigo-600 hover:from-cyan-400 hover:to-blue-500 text-white font-bold rounded-2xl text-xs sm:text-sm shadow-[0_0_20px_rgba(6,182,212,0.35)] transition-all cursor-pointer border border-white/10"
              >
                <UserIcon className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Entrar</span>
              </button>
            )}
          </div>

        </div>
      </div>

      {/* Primary Navigation Menu Bar - 100% VISIBLE IN ALL MODES (Desktop, Tablet, Mobile) */}
      <div className="w-full bg-slate-950/95 border-t border-white/10 px-2 sm:px-6 lg:px-8 py-2 overflow-x-auto no-scrollbar">
        <div className="max-w-7xl mx-auto flex items-center gap-1.5 sm:gap-2 min-w-max">
          {navTabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = currentTab === tab.id;

            return (
              <button
                key={tab.id}
                onClick={() => setCurrentTab(tab.id)}
                className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer whitespace-nowrap border pill-3d ${
                  isActive 
                    ? tab.activeClass 
                    : 'bg-slate-900/60 hover:bg-slate-800/80 text-slate-300 hover:text-white border-white/5 hover:border-white/20'
                }`}
              >
                <Icon className={`w-4 h-4 ${tab.color}`} />
                <span>{tab.label}</span>
                
                {tab.badge && (
                  <span className="text-[10px] bg-cyan-950 text-cyan-300 px-1.5 py-0.2 rounded-md font-mono border border-cyan-500/40">
                    {tab.badge}
                  </span>
                )}

                {tab.liveDot && (
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse shadow-[0_0_6px_rgba(52,211,153,0.8)]"></span>
                )}
              </button>
            );
          })}
        </div>
      </div>

    </header>
  );
};
