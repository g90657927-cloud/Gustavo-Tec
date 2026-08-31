import React, { useState } from 'react';
import { useNotifications } from '../context/NotificationContext';
import { 
  Bell, 
  Flame, 
  Radio, 
  CloudSun, 
  X, 
  CheckCheck, 
  Trash2, 
  Volume2, 
  VolumeX, 
  Smartphone, 
  ShieldCheck, 
  Send, 
  Settings, 
  Sliders,
  ExternalLink,
  ChevronRight,
  Trophy
} from 'lucide-react';
import { NotificationAlert } from '../types';

interface NotificationCenterModalProps {
  isOpen: boolean;
  onClose: () => void;
  onNavigateTab: (tab: 'news' | 'football' | 'weather' | 'tools' | 'gemini' | 'community' | 'messages' | 'login') => void;
}

export const NotificationCenterModal: React.FC<NotificationCenterModalProps> = ({
  isOpen,
  onClose,
  onNavigateTab
}) => {
  const {
    alerts,
    unreadCount,
    isPushSupported,
    pushPermission,
    isPushEnabled,
    isSoundEnabled,
    notifyUrgentNews,
    notifyNetworkChanges,
    notifyWeatherAlerts,
    requestPushPermission,
    togglePushNotifications,
    toggleSound,
    setNotifyUrgentNews,
    setNotifyNetworkChanges,
    setNotifyWeatherAlerts,
    markAsRead,
    markAllAsRead,
    clearAlerts,
    triggerTestNotification
  } = useNotifications();

  const [activeTab, setActiveTab] = useState<'alerts' | 'settings'>('alerts');
  const [filterType, setFilterType] = useState<'all' | 'urgent_news' | 'network_change' | 'weather_alert'>('all');

  if (!isOpen) return null;

  const filteredAlerts = alerts.filter(a => {
    if (filterType === 'all') return true;
    return a.type === filterType;
  });

  const handleAlertClick = (alert: NotificationAlert) => {
    markAsRead(alert.id);
    if (alert.actionTab) {
      onNavigateTab(alert.actionTab);
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-in fade-in duration-200">
      <div className="relative w-full max-w-2xl bg-slate-900 border border-white/10 rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[85vh]">
        
        {/* Header */}
        <div className="p-5 sm:p-6 bg-slate-950/80 border-b border-white/10 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-2xl bg-cyan-500/20 border border-cyan-400/40 text-cyan-300 shadow-[0_0_15px_rgba(6,182,212,0.3)]">
              <Bell className="w-5 h-5 text-cyan-400" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-lg sm:text-xl font-bold text-white font-mono">
                  Centro de Notificações Push
                </h3>
                {unreadCount > 0 && (
                  <span className="px-2 py-0.5 rounded-full text-xs font-mono font-bold bg-cyan-500 text-slate-950">
                    {unreadCount} novas
                  </span>
                )}
              </div>
              <p className="text-xs text-slate-400">
                Alertas automáticos de notícias urgentes, operadoras de rede e clima em Portugal
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Navigation Sub-Tabs */}
        <div className="flex items-center justify-between px-6 py-3 bg-slate-950/40 border-b border-white/5 text-xs font-mono">
          <div className="flex items-center gap-2">
            <button
              onClick={() => setActiveTab('alerts')}
              className={`px-3 py-1.5 rounded-xl font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
                activeTab === 'alerts'
                  ? 'bg-cyan-500 text-slate-950 shadow-[0_0_12px_rgba(6,182,212,0.3)]'
                  : 'bg-slate-800 text-slate-400 hover:text-white'
              }`}
            >
              <Bell className="w-3.5 h-3.5" />
              <span>Avisos ({alerts.length})</span>
            </button>
            <button
              onClick={() => setActiveTab('settings')}
              className={`px-3 py-1.5 rounded-xl font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
                activeTab === 'settings'
                  ? 'bg-cyan-500 text-slate-950 shadow-[0_0_12px_rgba(6,182,212,0.3)]'
                  : 'bg-slate-800 text-slate-400 hover:text-white'
              }`}
            >
              <Settings className="w-3.5 h-3.5" />
              <span>Configurações Push</span>
            </button>
          </div>

          {activeTab === 'alerts' && alerts.length > 0 && (
            <div className="flex items-center gap-2">
              <button
                onClick={markAllAsRead}
                className="text-[11px] text-cyan-400 hover:text-cyan-300 flex items-center gap-1 cursor-pointer transition-colors"
              >
                <CheckCheck className="w-3.5 h-3.5" />
                <span>Marcar lidas</span>
              </button>
              <span className="text-slate-600">|</span>
              <button
                onClick={clearAlerts}
                className="text-[11px] text-red-400 hover:text-red-300 flex items-center gap-1 cursor-pointer transition-colors"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span>Limpar</span>
              </button>
            </div>
          )}
        </div>

        {/* Content Body */}
        <div className="flex-1 overflow-y-auto p-5 sm:p-6 space-y-4">
          
          {/* TAB 1: ALERTS LIST */}
          {activeTab === 'alerts' && (
            <div className="space-y-4">
              
              {/* Filter Pills */}
              <div className="flex flex-wrap gap-1.5">
                {[
                  { id: 'all', label: 'Todos', icon: Bell },
                  { id: 'goal_alert', label: '🏆 Desporto Flashscore', icon: Trophy },
                  { id: 'urgent_news', label: '🚨 Notícias Urgentes', icon: Flame },
                  { id: 'network_change', label: '🌐 Rede & Operadoras', icon: Radio },
                  { id: 'weather_alert', label: '⚠️ Clima IPMA', icon: CloudSun }
                ].map(f => (
                  <button
                    key={f.id}
                    onClick={() => setFilterType(f.id as any)}
                    className={`px-2.5 py-1 rounded-lg text-xs font-mono transition-all cursor-pointer ${
                      filterType === f.id
                        ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-400/40 font-bold'
                        : 'bg-slate-950/60 text-slate-400 hover:text-slate-200 border border-white/5'
                    }`}
                  >
                    {f.label}
                  </button>
                ))}
              </div>

              {/* Alert List Items */}
              {filteredAlerts.length === 0 ? (
                <div className="p-12 text-center text-slate-400 space-y-3">
                  <Bell className="w-10 h-10 mx-auto text-slate-600 animate-pulse" />
                  <p className="text-sm font-mono">Nenhuma notificação encontrada nesta categoria.</p>
                  <button
                    onClick={() => triggerTestNotification('urgent_news')}
                    className="px-4 py-2 rounded-xl bg-cyan-500/20 hover:bg-cyan-500/30 text-cyan-300 border border-cyan-400/40 text-xs font-mono font-bold cursor-pointer transition-colors"
                  >
                    Disparar Alerta de Teste
                  </button>
                </div>
              ) : (
                <div className="space-y-2.5">
                  {filteredAlerts.map(alert => {
                    const isGoal = alert.type === 'goal_alert';
                    const isUrgent = alert.type === 'urgent_news';
                    const isNetwork = alert.type === 'network_change';
                    const isWeather = alert.type === 'weather_alert';

                    return (
                      <div
                        key={alert.id}
                        onClick={() => handleAlertClick(alert)}
                        className={`p-4 rounded-2xl border transition-all cursor-pointer relative group ${
                          !alert.read
                            ? 'bg-slate-950/90 border-cyan-500/40 shadow-[0_0_20px_rgba(6,182,212,0.15)]'
                            : 'bg-slate-950/40 border-white/5 hover:border-white/20'
                        }`}
                      >
                        <div className="flex items-start gap-3.5">
                          <div className={`p-2.5 rounded-xl border shrink-0 ${
                            isGoal
                              ? 'bg-rose-500/20 text-rose-400 border-rose-400/30'
                              : isUrgent
                              ? 'bg-red-500/20 text-red-400 border-red-400/30'
                              : isNetwork
                              ? 'bg-cyan-500/20 text-cyan-400 border-cyan-400/30'
                              : isWeather
                              ? 'bg-amber-500/20 text-amber-400 border-amber-400/30'
                              : 'bg-blue-500/20 text-blue-400 border-blue-400/30'
                          }`}>
                            {isGoal && <Trophy className="w-4 h-4" />}
                            {isUrgent && <Flame className="w-4 h-4" />}
                            {isNetwork && <Radio className="w-4 h-4" />}
                            {isWeather && <CloudSun className="w-4 h-4" />}
                            {!isGoal && !isUrgent && !isNetwork && !isWeather && <Bell className="w-4 h-4" />}
                          </div>

                          <div className="flex-1 space-y-1 text-left">
                            <div className="flex items-center justify-between">
                              <div className="flex items-center gap-2">
                                <span className={`text-[10px] font-mono px-2 py-0.5 rounded font-bold uppercase ${
                                  isGoal
                                    ? 'bg-rose-500/20 text-rose-300'
                                    : isUrgent
                                    ? 'bg-red-500/20 text-red-300'
                                    : isNetwork
                                    ? 'bg-cyan-500/20 text-cyan-300'
                                    : isWeather
                                    ? 'bg-amber-500/20 text-amber-300'
                                    : 'bg-slate-800 text-slate-300'
                                }`}>
                                  {alert.type.replace('_', ' ')}
                                </span>
                                {!alert.read && (
                                  <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse"></span>
                                )}
                              </div>
                              <span className="text-[11px] font-mono text-slate-500">{alert.time}</span>
                            </div>

                            <h4 className="text-sm font-bold text-white leading-snug">
                              {alert.title}
                            </h4>

                            <p className="text-xs text-slate-300 leading-relaxed">
                              {alert.message}
                            </p>

                            <div className="pt-1 flex items-center gap-2 text-xs font-mono text-cyan-400 group-hover:text-cyan-300">
                              <span>Abrir aba correspondente</span>
                              <ChevronRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
                            </div>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}

            </div>
          )}

          {/* TAB 2: PUSH & ALERT SETTINGS */}
          {activeTab === 'settings' && (
            <div className="space-y-6">
              
              {/* Push API Card */}
              <div className="p-5 rounded-2xl bg-slate-950/80 border border-cyan-500/30 space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="p-2.5 rounded-xl bg-cyan-500/20 text-cyan-400">
                      <Smartphone className="w-5 h-5" />
                    </div>
                    <div>
                      <h4 className="text-sm font-bold text-white font-mono">
                        Notificações Push do Navegador (Web Push API)
                      </h4>
                      <p className="text-xs text-slate-400">
                        Receba alertas na área de trabalho ou ecrã de bloqueio mesmo em segundo plano.
                      </p>
                    </div>
                  </div>

                  <button
                    onClick={togglePushNotifications}
                    className={`px-4 py-2 rounded-xl text-xs font-mono font-bold transition-all cursor-pointer ${
                      isPushEnabled && pushPermission === 'granted'
                        ? 'bg-emerald-500 text-slate-950 shadow-[0_0_15px_rgba(52,211,153,0.4)]'
                        : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
                    }`}
                  >
                    {isPushEnabled && pushPermission === 'granted' ? 'Ativo ✅' : 'Ativar Push'}
                  </button>
                </div>

                <div className="text-[11px] font-mono text-slate-400 pt-2 border-t border-white/5 flex items-center justify-between">
                  <span>Permissão do Navegador: <strong>{pushPermission}</strong></span>
                  {pushPermission === 'denied' && (
                    <span className="text-amber-400">Permissão bloqueada nas definições do browser</span>
                  )}
                </div>
              </div>

              {/* Alert Category Toggles */}
              <div className="p-5 rounded-2xl bg-slate-950/60 border border-white/10 space-y-4">
                <h4 className="text-xs font-mono uppercase tracking-wider text-slate-400 font-bold">
                  Categorias de Alertas Automáticos
                </h4>

                <div className="space-y-3">
                  {/* Urgent News */}
                  <div className="flex items-center justify-between p-3 rounded-xl bg-slate-900/80 border border-white/5">
                    <div className="flex items-center gap-2.5">
                      <Flame className="w-4 h-4 text-red-400" />
                      <div>
                        <span className="text-xs font-bold text-white block">🚨 Notícias Urgentes & Furos de Reportagem</span>
                        <span className="text-[11px] text-slate-400">Avisos imediatos de lançamentos e eventos de última hora</span>
                      </div>
                    </div>
                    <button
                      onClick={() => setNotifyUrgentNews(!notifyUrgentNews)}
                      className={`w-11 h-6 rounded-full transition-colors relative cursor-pointer ${
                        notifyUrgentNews ? 'bg-cyan-500' : 'bg-slate-800'
                      }`}
                    >
                      <span className={`absolute top-1 w-4 h-4 rounded-full bg-white transition-transform ${
                        notifyUrgentNews ? 'left-6' : 'left-1'
                      }`} />
                    </button>
                  </div>

                  {/* Network changes */}
                  <div className="flex items-center justify-between p-3 rounded-xl bg-slate-900/80 border border-white/5">
                    <div className="flex items-center gap-2.5">
                      <Radio className="w-4 h-4 text-cyan-400" />
                      <div>
                        <span className="text-xs font-bold text-white block">🌐 Estado da Rede & Operadoras (DIGI/MEO/Voda/NOS)</span>
                        <span className="text-[11px] text-slate-400">Alterações de velocidade, rotas e nós em Portugal</span>
                      </div>
                    </div>
                    <button
                      onClick={() => setNotifyNetworkChanges(!notifyNetworkChanges)}
                      className={`w-11 h-6 rounded-full transition-colors relative cursor-pointer ${
                        notifyNetworkChanges ? 'bg-cyan-500' : 'bg-slate-800'
                      }`}
                    >
                      <span className={`absolute top-1 w-4 h-4 rounded-full bg-white transition-transform ${
                        notifyNetworkChanges ? 'left-6' : 'left-1'
                      }`} />
                    </button>
                  </div>

                  {/* Weather */}
                  <div className="flex items-center justify-between p-3 rounded-xl bg-slate-900/80 border border-white/5">
                    <div className="flex items-center gap-2.5">
                      <CloudSun className="w-4 h-4 text-amber-400" />
                      <div>
                        <span className="text-xs font-bold text-white block">⚠️ Alertas Meteorológicos & Clima IPMA</span>
                        <span className="text-[11px] text-slate-400">Avisos de tempestade, rajadas de vento e chuva forte</span>
                      </div>
                    </div>
                    <button
                      onClick={() => setNotifyWeatherAlerts(!notifyWeatherAlerts)}
                      className={`w-11 h-6 rounded-full transition-colors relative cursor-pointer ${
                        notifyWeatherAlerts ? 'bg-cyan-500' : 'bg-slate-800'
                      }`}
                    >
                      <span className={`absolute top-1 w-4 h-4 rounded-full bg-white transition-transform ${
                        notifyWeatherAlerts ? 'left-6' : 'left-1'
                      }`} />
                    </button>
                  </div>

                  {/* Sound */}
                  <div className="flex items-center justify-between p-3 rounded-xl bg-slate-900/80 border border-white/5">
                    <div className="flex items-center gap-2.5">
                      <Volume2 className="w-4 h-4 text-emerald-400" />
                      <div>
                        <span className="text-xs font-bold text-white block">🔔 Sinal Sonoro Personalizado (Synth Audio)</span>
                        <span className="text-[11px] text-slate-400">Toque subtil de confirmação gerado pelo navegador</span>
                      </div>
                    </div>
                    <button
                      onClick={toggleSound}
                      className={`w-11 h-6 rounded-full transition-colors relative cursor-pointer ${
                        isSoundEnabled ? 'bg-cyan-500' : 'bg-slate-800'
                      }`}
                    >
                      <span className={`absolute top-1 w-4 h-4 rounded-full bg-white transition-transform ${
                        isSoundEnabled ? 'left-6' : 'left-1'
                      }`} />
                    </button>
                  </div>
                </div>
              </div>

              {/* Test Buttons Row */}
              <div className="p-5 rounded-2xl bg-slate-950/60 border border-white/10 space-y-3">
                <h4 className="text-xs font-mono uppercase tracking-wider text-slate-400 font-bold">
                  Testar Alertas em Tempo Real
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                  <button
                    onClick={() => triggerTestNotification('urgent_news')}
                    className="p-2.5 rounded-xl bg-red-500/10 hover:bg-red-500/20 text-red-300 border border-red-500/30 text-xs font-mono font-bold flex items-center justify-center gap-1.5 transition-all cursor-pointer"
                  >
                    <Flame className="w-3.5 h-3.5 text-red-400" />
                    <span>Testar Notícia</span>
                  </button>

                  <button
                    onClick={() => triggerTestNotification('network_change')}
                    className="p-2.5 rounded-xl bg-cyan-500/10 hover:bg-cyan-500/20 text-cyan-300 border border-cyan-500/30 text-xs font-mono font-bold flex items-center justify-center gap-1.5 transition-all cursor-pointer"
                  >
                    <Radio className="w-3.5 h-3.5 text-cyan-400" />
                    <span>Testar Rede</span>
                  </button>

                  <button
                    onClick={() => triggerTestNotification('weather_alert')}
                    className="p-2.5 rounded-xl bg-amber-500/10 hover:bg-amber-500/20 text-amber-300 border border-amber-500/30 text-xs font-mono font-bold flex items-center justify-center gap-1.5 transition-all cursor-pointer"
                  >
                    <CloudSun className="w-3.5 h-3.5 text-amber-400" />
                    <span>Testar Clima</span>
                  </button>
                </div>
              </div>

            </div>
          )}

        </div>

      </div>
    </div>
  );
};
