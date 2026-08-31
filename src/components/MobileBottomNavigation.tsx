import React from 'react';
import { 
  Flame, 
  MessageSquare, 
  Bot, 
  Sliders, 
  CloudSun, 
  Bell,
  User as UserIcon,
  Trophy
} from 'lucide-react';
import { useNotifications } from '../context/NotificationContext';
import { useAuth } from '../context/AuthContext';

interface MobileBottomNavigationProps {
  currentTab: 'news' | 'football' | 'weather' | 'gemini' | 'tools' | 'community' | 'messages' | 'login';
  setCurrentTab: (tab: 'news' | 'football' | 'weather' | 'gemini' | 'tools' | 'community' | 'messages' | 'login') => void;
  onOpenNotifications: () => void;
  onOpenProfile: () => void;
}

export const MobileBottomNavigation: React.FC<MobileBottomNavigationProps> = ({
  currentTab,
  setCurrentTab,
  onOpenNotifications,
  onOpenProfile
}) => {
  const { unreadCount } = useNotifications();
  const { user, isAuthenticated } = useAuth();

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-40 bg-slate-950/90 border-t border-white/10 backdrop-blur-2xl px-2 py-1.5 shadow-[0_-10px_30px_rgba(0,0,0,0.7)] flex items-center justify-around sm:hidden">
      
      {/* 1. Notícias */}
      <button
        onClick={() => setCurrentTab('news')}
        className={`flex flex-col items-center justify-center py-1 px-1.5 rounded-xl transition-all cursor-pointer ${
          currentTab === 'news'
            ? 'text-cyan-400 bg-cyan-500/10 font-bold'
            : 'text-slate-400 hover:text-slate-200'
        }`}
      >
        <Flame className="w-4 h-4 mb-0.5" />
        <span className="text-[9px] font-mono leading-none">Notícias</span>
      </button>

      {/* 2. Desporto Flashscore */}
      <button
        onClick={() => setCurrentTab('football')}
        className={`flex flex-col items-center justify-center py-1 px-1.5 rounded-xl transition-all cursor-pointer relative ${
          currentTab === 'football'
            ? 'text-rose-400 bg-rose-500/10 font-bold'
            : 'text-slate-400 hover:text-slate-200'
        }`}
      >
        <Trophy className="w-4 h-4 mb-0.5" />
        <span className="text-[9px] font-mono leading-none">Desporto</span>
        <span className="absolute top-0.5 right-1 w-1.5 h-1.5 rounded-full bg-rose-500 animate-pulse"></span>
      </button>

      {/* 3. Mensagens Online (Live Chat) */}
      <button
        onClick={() => setCurrentTab('messages')}
        className={`flex flex-col items-center justify-center py-1 px-1.5 rounded-xl transition-all cursor-pointer relative ${
          currentTab === 'messages'
            ? 'text-emerald-400 bg-emerald-500/10 font-bold'
            : 'text-slate-400 hover:text-slate-200'
        }`}
      >
        <MessageSquare className="w-4 h-4 mb-0.5" />
        <span className="text-[9px] font-mono leading-none">Online</span>
        <span className="absolute top-0.5 right-1 w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
      </button>

      {/* 4. ChatBot IA */}
      <button
        onClick={() => setCurrentTab('gemini')}
        className={`flex flex-col items-center justify-center py-1 px-1.5 rounded-xl transition-all cursor-pointer ${
          currentTab === 'gemini'
            ? 'text-blue-400 bg-blue-500/10 font-bold'
            : 'text-slate-400 hover:text-slate-200'
        }`}
      >
        <Bot className="w-4 h-4 mb-0.5" />
        <span className="text-[9px] font-mono leading-none">ChatBot</span>
      </button>

      {/* 5. Ferramentas & Operadoras */}
      <button
        onClick={() => setCurrentTab('tools')}
        className={`flex flex-col items-center justify-center py-1 px-1.5 rounded-xl transition-all cursor-pointer ${
          currentTab === 'tools'
            ? 'text-amber-400 bg-amber-500/10 font-bold'
            : 'text-slate-400 hover:text-slate-200'
        }`}
      >
        <Sliders className="w-4 h-4 mb-0.5" />
        <span className="text-[9px] font-mono leading-none">Redes</span>
      </button>

      {/* 6. Clima */}
      <button
        onClick={() => setCurrentTab('weather')}
        className={`flex flex-col items-center justify-center py-1 px-1.5 rounded-xl transition-all cursor-pointer ${
          currentTab === 'weather'
            ? 'text-teal-400 bg-teal-500/10 font-bold'
            : 'text-slate-400 hover:text-slate-200'
        }`}
      >
        <CloudSun className="w-4 h-4 mb-0.5" />
        <span className="text-[9px] font-mono leading-none">Clima</span>
      </button>

      {/* 7. Push Notifications Bell */}
      <button
        onClick={onOpenNotifications}
        className="flex flex-col items-center justify-center py-1 px-1.5 rounded-xl text-slate-400 hover:text-cyan-300 transition-all cursor-pointer relative"
      >
        <Bell className="w-4 h-4 mb-0.5" />
        <span className="text-[9px] font-mono leading-none">Alertas</span>
        {unreadCount > 0 && (
          <span className="absolute -top-0.5 right-0.5 px-1 rounded-full text-[8px] font-mono font-bold bg-cyan-500 text-slate-950 shadow-[0_0_8px_rgba(6,182,212,0.8)]">
            {unreadCount}
          </span>
        )}
      </button>

    </nav>
  );
};
