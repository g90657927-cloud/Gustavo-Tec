import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { NotificationAlert } from '../types';

interface NotificationContextType {
  alerts: NotificationAlert[];
  unreadCount: number;
  isPushSupported: boolean;
  pushPermission: NotificationPermission | 'unsupported';
  isPushEnabled: boolean;
  isSoundEnabled: boolean;
  notifyUrgentNews: boolean;
  notifyNetworkChanges: boolean;
  notifyWeatherAlerts: boolean;
  latestToast: NotificationAlert | null;
  requestPushPermission: () => Promise<boolean>;
  sendAlert: (alert: Omit<NotificationAlert, 'id' | 'time' | 'timestamp' | 'read'>) => void;
  markAsRead: (id: string) => void;
  markAllAsRead: () => void;
  clearAlerts: () => void;
  dismissToast: () => void;
  togglePushNotifications: () => Promise<void>;
  toggleSound: () => void;
  setNotifyUrgentNews: (val: boolean) => void;
  setNotifyNetworkChanges: (val: boolean) => void;
  setNotifyWeatherAlerts: (val: boolean) => void;
  triggerTestNotification: (type?: 'urgent_news' | 'network_change' | 'weather_alert') => void;
}

const NotificationContext = createContext<NotificationContextType | undefined>(undefined);

const STORAGE_KEY = 'gustavotec_alerts_v2';
const SETTINGS_KEY = 'gustavotec_alert_settings_v2';

// Built-in Web Audio API sound synthesizer for instant notification chimes
const playAlertSound = (type: 'high' | 'medium' | 'info' = 'info') => {
  try {
    const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
    if (!AudioCtx) return;
    const ctx = new AudioCtx();
    
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    
    osc.connect(gain);
    gain.connect(ctx.destination);
    
    const now = ctx.currentTime;
    
    if (type === 'high') {
      // Urgent double beep
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(880, now); // A5
      osc.frequency.setValueAtTime(1174.66, now + 0.1); // D6
      gain.gain.setValueAtTime(0.15, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.35);
      osc.start(now);
      osc.stop(now + 0.35);
    } else if (type === 'medium') {
      // Medium notification chime
      osc.type = 'sine';
      osc.frequency.setValueAtTime(587.33, now); // D5
      osc.frequency.setValueAtTime(880, now + 0.08); // A5
      gain.gain.setValueAtTime(0.12, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.3);
      osc.start(now);
      osc.stop(now + 0.3);
    } else {
      // Soft gentle ping
      osc.type = 'sine';
      osc.frequency.setValueAtTime(659.25, now); // E5
      osc.frequency.setValueAtTime(987.77, now + 0.07); // B5
      gain.gain.setValueAtTime(0.08, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.25);
      osc.start(now);
      osc.stop(now + 0.25);
    }
  } catch (e) {
    console.debug('Audio synthesizer chime failed:', e);
  }
};

const INITIAL_ALERTS: NotificationAlert[] = [
  {
    id: 'alert-init-1',
    type: 'network_change',
    title: 'Deteção de Operadora Ativa',
    message: 'Rede detetada com sucesso. Suporte ativo para DIGI (10G), Vodafone, MEO, NOS, WOO, UZO, NOWO e LigaT.',
    time: 'Agora',
    timestamp: Date.now() - 60000,
    read: false,
    severity: 'info',
    actionTab: 'tools'
  },
  {
    id: 'alert-init-2',
    type: 'urgent_news',
    title: 'Notícias Tech em Tempo Real',
    message: 'O feed está a sincronizar as novidades tecnológicas a cada 10 segundos.',
    time: 'Há 5m',
    timestamp: Date.now() - 300000,
    read: false,
    severity: 'medium',
    actionTab: 'news'
  }
];

export const NotificationProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [alerts, setAlerts] = useState<NotificationAlert[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      return saved ? JSON.parse(saved) : INITIAL_ALERTS;
    } catch {
      return INITIAL_ALERTS;
    }
  });

  const [pushPermission, setPushPermission] = useState<NotificationPermission | 'unsupported'>(() => {
    if (typeof window !== 'undefined' && 'Notification' in window) {
      return Notification.permission;
    }
    return 'unsupported';
  });

  const [isPushEnabled, setIsPushEnabled] = useState<boolean>(() => {
    try {
      const saved = localStorage.getItem(SETTINGS_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        return parsed.isPushEnabled ?? (typeof window !== 'undefined' && 'Notification' in window && Notification.permission === 'granted');
      }
      return false;
    } catch {
      return false;
    }
  });

  const [isSoundEnabled, setIsSoundEnabled] = useState<boolean>(true);
  const [notifyUrgentNews, setNotifyUrgentNews] = useState<boolean>(true);
  const [notifyNetworkChanges, setNotifyNetworkChanges] = useState<boolean>(true);
  const [notifyWeatherAlerts, setNotifyWeatherAlerts] = useState<boolean>(true);
  const [latestToast, setLatestToast] = useState<NotificationAlert | null>(null);

  const isPushSupported = typeof window !== 'undefined' && 'Notification' in window;

  // Persist alerts to localStorage
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(alerts.slice(0, 30)));
    } catch (e) {
      console.warn('Failed to save alerts to localStorage:', e);
    }
  }, [alerts]);

  // Persist settings
  useEffect(() => {
    try {
      localStorage.setItem(
        SETTINGS_KEY,
        JSON.stringify({
          isPushEnabled,
          isSoundEnabled,
          notifyUrgentNews,
          notifyNetworkChanges,
          notifyWeatherAlerts
        })
      );
    } catch (e) {
      console.warn('Failed to save notification settings:', e);
    }
  }, [isPushEnabled, isSoundEnabled, notifyUrgentNews, notifyNetworkChanges, notifyWeatherAlerts]);

  // Update permission state
  useEffect(() => {
    if (isPushSupported) {
      setPushPermission(Notification.permission);
    }
  }, [isPushSupported]);

  // Auto-dismiss latest toast after 6 seconds
  useEffect(() => {
    if (latestToast) {
      const timer = setTimeout(() => {
        setLatestToast(null);
      }, 6000);
      return () => clearTimeout(timer);
    }
  }, [latestToast]);

  const requestPushPermission = async (): Promise<boolean> => {
    if (!isPushSupported) return false;
    try {
      const permission = await Notification.requestPermission();
      setPushPermission(permission);
      if (permission === 'granted') {
        setIsPushEnabled(true);
        return true;
      }
      setIsPushEnabled(false);
      return false;
    } catch (e) {
      console.warn('Error requesting notification permission:', e);
      return false;
    }
  };

  const togglePushNotifications = async () => {
    if (pushPermission !== 'granted') {
      await requestPushPermission();
    } else {
      setIsPushEnabled(prev => !prev);
    }
  };

  const toggleSound = () => setIsSoundEnabled(prev => !prev);

  const sendAlert = useCallback((alertData: Omit<NotificationAlert, 'id' | 'time' | 'timestamp' | 'read'>) => {
    // Check user preference by type
    if (alertData.type === 'urgent_news' && !notifyUrgentNews) return;
    if (alertData.type === 'network_change' && !notifyNetworkChanges) return;
    if (alertData.type === 'weather_alert' && !notifyWeatherAlerts) return;

    const newAlert: NotificationAlert = {
      ...alertData,
      id: `alert-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`,
      time: 'Agora',
      timestamp: Date.now(),
      read: false
    };

    setAlerts(prev => [newAlert, ...prev.slice(0, 49)]);
    setLatestToast(newAlert);

    // Audio chime
    if (isSoundEnabled) {
      playAlertSound(alertData.severity);
    }

    // Web Notification API (Browser Push)
    if (isPushSupported && pushPermission === 'granted' && isPushEnabled) {
      try {
        const n = new Notification(alertData.title, {
          body: alertData.message,
          icon: '/favicon.ico',
          tag: alertData.type
        });
        n.onclick = () => {
          window.focus();
          n.close();
        };
      } catch (e) {
        console.debug('Browser native notification error:', e);
      }
    }
  }, [isPushSupported, pushPermission, isPushEnabled, isSoundEnabled, notifyUrgentNews, notifyNetworkChanges, notifyWeatherAlerts]);

  const markAsRead = (id: string) => {
    setAlerts(prev => prev.map(a => a.id === id ? { ...a, read: true } : a));
  };

  const markAllAsRead = () => {
    setAlerts(prev => prev.map(a => ({ ...a, read: true })));
  };

  const clearAlerts = () => {
    setAlerts([]);
  };

  const dismissToast = () => {
    setLatestToast(null);
  };

  const triggerTestNotification = (type: 'urgent_news' | 'network_change' | 'weather_alert' = 'urgent_news') => {
    if (type === 'urgent_news') {
      sendAlert({
        type: 'urgent_news',
        title: '🚨 Notícia Urgente: Novo Modelo de IA Anunciado',
        message: 'A Google acaba de lançar uma nova arquitetura quântica que acelera o processamento em 100x.',
        severity: 'high',
        actionTab: 'news'
      });
    } else if (type === 'network_change') {
      sendAlert({
        type: 'network_change',
        title: '🌐 Rede: DIGI Portugal 10 Gbps Conectada',
        message: 'Velocidade de ligação atualizada para 10 000 Mbps simétricos com latência de 6ms.',
        severity: 'medium',
        actionTab: 'tools'
      });
    } else {
      sendAlert({
        type: 'weather_alert',
        title: '⚠️ Alerta Clima IPMA: Rajadas de Vento em Lisboa',
        message: 'Aviso amarelo para a costa portuguesa com vento até 75 km/h e descida de temperatura.',
        severity: 'high',
        actionTab: 'weather'
      });
    }
  };

  const unreadCount = alerts.filter(a => !a.read).length;

  return (
    <NotificationContext.Provider
      value={{
        alerts,
        unreadCount,
        isPushSupported,
        pushPermission,
        isPushEnabled,
        isSoundEnabled,
        notifyUrgentNews,
        notifyNetworkChanges,
        notifyWeatherAlerts,
        latestToast,
        requestPushPermission,
        sendAlert,
        markAsRead,
        markAllAsRead,
        clearAlerts,
        dismissToast,
        togglePushNotifications,
        toggleSound,
        setNotifyUrgentNews,
        setNotifyNetworkChanges,
        setNotifyWeatherAlerts,
        triggerTestNotification
      }}
    >
      {children}
    </NotificationContext.Provider>
  );
};

export const useNotifications = () => {
  const context = useContext(NotificationContext);
  if (!context) {
    throw new Error('useNotifications must be used within a NotificationProvider');
  }
  return context;
};
