/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useRef } from 'react';
import { AuthProvider } from './context/AuthContext';
import { NewsProvider, useNews } from './context/NewsContext';
import { ThemeProvider } from './context/ThemeContext';
import { NotificationProvider, useNotifications } from './context/NotificationContext';
import { Navbar } from './components/Navbar';
import { BreakingTicker } from './components/BreakingTicker';
import { NewsFeedView } from './components/NewsFeedView';
import { WeatherIpmaView } from './components/WeatherIpmaView';
import { GeminiGoogleView } from './components/GeminiGoogleView';
import { LiveCommunityFeed } from './components/LiveCommunityFeed';
import { OnlineChatView } from './components/OnlineChatView';
import { LoginView } from './components/LoginView';
import { TechToolsView } from './components/TechToolsView';
import { FootballFlashscoreView } from './components/FootballFlashscoreView';
import { NewsDetailModal } from './components/NewsDetailModal';
import { AuthModal } from './components/AuthModal';
import { ProfileModal } from './components/ProfileModal';
import { FooterReadingControls } from './components/FooterReadingControls';
import { RealTechAdModal } from './components/RealTechAdModal';
import { NotificationCenterModal } from './components/NotificationCenterModal';
import { NotificationToastBanner } from './components/NotificationToastBanner';
import { MobileBottomNavigation } from './components/MobileBottomNavigation';
import { RecaptchaVerificationModal } from './components/RecaptchaVerificationModal';
import { DeviceViewMode } from './types';
import { Smartphone, Tablet, Monitor, Sparkles } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

const MainLayout: React.FC = () => {
  const [currentTab, setCurrentTab] = useState<'news' | 'football' | 'weather' | 'gemini' | 'tools' | 'community' | 'messages' | 'login'>('news');
  const [isAuthOpen, setIsAuthOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);
  const [viewMode, setViewMode] = useState<DeviceViewMode>('desktop');
  const [isRecaptchaOpen, setIsRecaptchaOpen] = useState<boolean>(() => {
    try {
      const saved = localStorage.getItem('gustavotec_recaptcha_verified');
      if (saved) {
        const data = JSON.parse(saved);
        if (data.verified && Date.now() - data.timestamp < 86400000) {
          return false;
        }
      }
    } catch {
      // ignore
    }
    return true;
  });
  
  // Game-style Interstitial Ad State (Non-intrusive frequency capping, natural reward mechanics)
  const [isGameAdOpen, setIsGameAdOpen] = useState(false);
  const [gameAdIndex, setGameAdIndex] = useState(0);
  const lastAdTimeRef = useRef<number>(Date.now());
  const articlesReadCountRef = useRef<number>(0);

  const { selectedNews, setSelectedNews, countdown, isAutoRefreshActive, breakingAlerts } = useNews();
  const { sendAlert } = useNotifications();

  // Gentle game-ad frequency capping: triggers smoothly after reading several articles, with at least 4 min interval
  useEffect(() => {
    if (selectedNews) {
      articlesReadCountRef.current += 1;
      const now = Date.now();
      const timeSinceLastAd = now - lastAdTimeRef.current;

      if (articlesReadCountRef.current >= 5 && timeSinceLastAd > 240000) {
        setIsGameAdOpen(true);
        lastAdTimeRef.current = now;
        articlesReadCountRef.current = 0;
        setGameAdIndex(prev => prev + 1);
      }
    }
  }, [selectedNews]);

  // Push notification alert when urgent breaking news is loaded
  const lastAlertedNewsIdRef = useRef<string>('');
  useEffect(() => {
    if (breakingAlerts && breakingAlerts.length > 0) {
      const topAlert = breakingAlerts[0];
      if (topAlert.id !== lastAlertedNewsIdRef.current) {
        lastAlertedNewsIdRef.current = topAlert.id;
        sendAlert({
          type: 'urgent_news',
          title: `🚨 ${topAlert.title}`,
          message: `Nova notícia tecnológica prioritária na categoria ${topAlert.category}.`,
          severity: 'high',
          actionTab: 'news'
        });
      }
    }
  }, [breakingAlerts, sendAlert]);

  const handleOpenManualAd = (customIndex?: number) => {
    if (typeof customIndex === 'number') {
      setGameAdIndex(customIndex);
    } else {
      setGameAdIndex(prev => prev + 1);
    }
    setIsGameAdOpen(true);
  };

  return (
    <div className={`min-h-screen bg-slate-950 text-slate-100 flex flex-col selection:bg-cyan-500 selection:text-slate-950 relative overflow-x-hidden ${
      viewMode === 'mobile' ? 'p-0 sm:py-6 bg-slate-900' : viewMode === 'tablet' ? 'p-0 sm:py-6 bg-slate-900' : ''
    }`}>
      
      {/* Background Liquid Glass Ambient Mesh Orbs */}
      <div className="liquid-orb-1" />
      <div className="liquid-orb-2" />
      <div className="liquid-orb-3" />

      {/* 3D Isometric Cyber Grid Background for spatial depth (Hardware Accelerated) */}
      <div className="cyber-3d-grid" />

      {/* Floating Push Notification Toast Banner */}
      <NotificationToastBanner
        onNavigateTab={(tab) => setCurrentTab(tab)}
        onOpenCenter={() => setIsNotificationsOpen(true)}
      />

      {/* Device Mode Switcher Floating Badge (When in Mobile or Tablet preview mode on desktop) */}
      {viewMode !== 'desktop' && (
        <div className="hidden sm:flex fixed top-4 right-4 z-50 items-center gap-2 bg-slate-950/90 border border-cyan-500/40 p-2 rounded-2xl shadow-2xl backdrop-blur-xl font-mono text-xs">
          <span className="text-cyan-300 font-bold px-1 flex items-center gap-1.5">
            {viewMode === 'mobile' ? <Smartphone className="w-4 h-4 text-cyan-400" /> : <Tablet className="w-4 h-4 text-cyan-400" />}
            <span>Modo {viewMode === 'mobile' ? 'Celular (390px)' : 'Tablet (768px)'} Ativo</span>
          </span>
          <button
            onClick={() => setViewMode('desktop')}
            className="px-2.5 py-1 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold transition-all cursor-pointer flex items-center gap-1"
          >
            <Monitor className="w-3.5 h-3.5" />
            <span>Voltar ao Desktop</span>
          </button>
        </div>
      )}

      {/* Main Responsive Shell Container (Adapts smoothly to Mobile, Tablet, and Desktop view modes) */}
      <div className={`flex-1 flex flex-col w-full transition-all duration-300 ${
        viewMode === 'mobile'
          ? 'max-w-[414px] mx-auto rounded-[38px] border-[6px] border-slate-800 shadow-[0_0_60px_rgba(0,0,0,0.9)] overflow-hidden bg-slate-950 relative my-auto'
          : viewMode === 'tablet'
          ? 'max-w-[768px] mx-auto rounded-[32px] border-[6px] border-slate-800 shadow-[0_0_60px_rgba(0,0,0,0.9)] overflow-hidden bg-slate-950 relative my-auto'
          : 'w-full'
      }`}>

        {/* Smartphone / Tablet Simulated Top Notch & Speaker Bar */}
        {viewMode !== 'desktop' && (
          <div className="hidden sm:flex items-center justify-between px-6 py-2 bg-slate-950 border-b border-white/5 text-[11px] font-mono text-slate-400">
            <span>{new Date().toLocaleTimeString('pt-PT', { hour: '2-digit', minute: '2-digit' })}</span>
            <div className="w-20 h-4 bg-slate-900 rounded-full flex items-center justify-center">
              <div className="w-3 h-3 rounded-full bg-slate-950 border border-slate-800"></div>
            </div>
            <span className="text-cyan-400 font-bold">5G • 100%</span>
          </div>
        )}

        {/* 1. Breaking News 10s Ticker */}
        <div className="relative z-30">
          <BreakingTicker />
        </div>

        {/* 2. Top Navigation Bar */}
        <Navbar
          currentTab={currentTab}
          setCurrentTab={setCurrentTab}
          onOpenAuth={() => setIsAuthOpen(true)}
          onOpenProfile={() => setIsProfileOpen(true)}
          onOpenSponsorAd={() => handleOpenManualAd()}
          onOpenNotifications={() => setIsNotificationsOpen(true)}
          viewMode={viewMode}
          setViewMode={setViewMode}
        />

        {/* 3. Main Stage Container */}
        <main className={`flex-1 w-full mx-auto py-4 sm:py-8 relative z-10 ${
          viewMode === 'mobile' ? 'px-3 pb-20' : viewMode === 'tablet' ? 'px-4 pb-20' : 'max-w-7xl px-4 sm:px-6 lg:px-8 pb-12'
        }`}>
          <AnimatePresence mode="wait" initial={false}>
            <motion.div
              key={currentTab}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -6 }}
              transition={{ duration: 0.22, ease: [0.25, 1, 0.5, 1] }}
              className="w-full"
            >
              {currentTab === 'news' && (
                <NewsFeedView
                  onOpenGemini={() => setCurrentTab('gemini')}
                  onOpenCommunity={() => setCurrentTab('messages')}
                  onOpenRealAd={(idx) => handleOpenManualAd(idx)}
                />
              )}

              {/* Football / Flashscore Live Scores Tab */}
              {currentTab === 'football' && (
                <FootballFlashscoreView />
              )}

              {/* Online Messages / Live Chat Tab */}
              {currentTab === 'messages' && (
                <OnlineChatView
                  onOpenAuth={() => setIsAuthOpen(true)}
                  onOpenLoginView={() => setCurrentTab('login')}
                />
              )}

              {currentTab === 'weather' && (
                <WeatherIpmaView />
              )}

              {currentTab === 'gemini' && (
                <GeminiGoogleView />
              )}

              {currentTab === 'tools' && (
                <TechToolsView />
              )}

              {currentTab === 'community' && (
                <LiveCommunityFeed />
              )}

              {currentTab === 'login' && (
                <LoginView 
                  onSuccess={() => setCurrentTab('news')} 
                  onOpenGemini={() => setCurrentTab('gemini')}
                />
              )}
            </motion.div>
          </AnimatePresence>
        </main>

        {/* 4. Modals */}
        <RecaptchaVerificationModal
          isOpen={isRecaptchaOpen}
          onVerified={() => setIsRecaptchaOpen(false)}
          requiredForAction="Acesso ao Portal Gustavo Tec"
        />

        {selectedNews && (
          <NewsDetailModal
            news={selectedNews}
            onClose={() => setSelectedNews(null)}
          />
        )}

        <AuthModal
          isOpen={isAuthOpen}
          onClose={() => setIsAuthOpen(false)}
        />

        <ProfileModal
          isOpen={isProfileOpen}
          onClose={() => setIsProfileOpen(false)}
        />

        {/* Notification Center Modal */}
        <NotificationCenterModal
          isOpen={isNotificationsOpen}
          onClose={() => setIsNotificationsOpen(false)}
          onNavigateTab={(tab) => setCurrentTab(tab)}
        />

        {/* 5. Authentic Real Tech Sponsor Advertisement Modal */}
        <RealTechAdModal
          isOpen={isGameAdOpen}
          onClose={() => setIsGameAdOpen(false)}
          adIndex={gameAdIndex}
        />

        {/* 6. Modern Tech Liquid Glass Footer */}
        <footer className="relative z-10 border-t border-white/10 bg-slate-950/80 backdrop-blur-2xl py-6 sm:py-10 mt-8 shadow-[0_-10px_30px_rgba(0,0,0,0.5)]">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
            
            {/* Liquid Glass Low-Light Reading Mode & Contrast Toggle */}
            <FooterReadingControls />

            <div className="flex flex-col md:flex-row items-center justify-between gap-4 sm:gap-6 text-xs text-slate-400 pt-4 border-t border-white/5">
              
              {/* Brand & Mission */}
              <div className="flex flex-col sm:flex-row items-center gap-3 text-center sm:text-left">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-cyan-500/30 to-blue-600/30 border border-cyan-500/40 flex items-center justify-center font-mono font-black text-cyan-300 shadow-[0_0_15px_rgba(6,182,212,0.25)]">
                    G
                  </div>
                  <span className="font-bold text-slate-100 text-sm">Gustavo Tec</span>
                </div>
                <span className="hidden sm:inline text-slate-700">|</span>
                <span>Notícias Tech a cada 10s • Desporto Flashscore Ao Vivo • Mensagens Online • Clima Portugal • Suporte DIGI/MEO/Voda/NOS</span>
              </div>

              {/* Status Indicator */}
              <div className="flex items-center gap-2.5 bg-slate-900/80 backdrop-blur-md border border-white/10 px-3.5 py-1.5 rounded-full font-mono text-[11px] text-cyan-300 shadow-[inset_0_1px_0_rgba(255,255,255,0.1)]">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse shadow-[0_0_8px_rgba(52,211,153,0.8)]"></span>
                <span>Feed 10s: {isAutoRefreshActive ? `Ativo (${countdown}s)` : 'Pausado'}</span>
              </div>

              {/* Copyright */}
              <div className="text-slate-500 text-center md:text-right font-mono text-[11px]">
                © {new Date().getFullYear()} Gustavo Tec • Liquid Glassmorphism Design System
              </div>
            </div>
          </div>
        </footer>

        {/* 7. Mobile Bottom Navigation Bar (Visible on mobile/tablet view or screen sizes < 640px) */}
        <MobileBottomNavigation
          currentTab={currentTab}
          setCurrentTab={setCurrentTab}
          onOpenNotifications={() => setIsNotificationsOpen(true)}
          onOpenProfile={() => setIsProfileOpen(true)}
        />

      </div>

    </div>
  );
};

export default function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <NotificationProvider>
          <NewsProvider>
            <MainLayout />
          </NewsProvider>
        </NotificationProvider>
      </AuthProvider>
    </ThemeProvider>
  );
}
