import React, { useState, useEffect } from 'react';
import {
  ShieldAlert,
  Wrench,
  Cpu,
  Server,
  Lock,
  Unlock,
  KeyRound,
  Eye,
  CheckCircle2,
  RefreshCw,
  AlertTriangle,
  Sparkles,
  Zap,
  Clock,
  Terminal,
  Activity,
  Radio,
  FileText,
  UserCheck,
  ChevronDown,
  ChevronUp,
  LogIn
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { useMaintenance, MaintenanceLog } from '../context/MaintenanceContext';
import { useAuth, ADMIN_EMAIL } from '../context/AuthContext';

export const MaintenanceScreen: React.FC = () => {
  const {
    maintenanceReason,
    estimatedMinutes,
    activatedAt,
    deactivateMaintenance,
    toggleFounderBypass,
    isFounderBypassing,
    isAdmin,
    maintenanceLogs
  } = useMaintenance();

  const { user, firebaseUser, loginWithGoogle } = useAuth();

  const [adminKeyInput, setAdminKeyInput] = useState('');
  const [actionFeedback, setActionFeedback] = useState<{ success: boolean; msg: string } | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [showLogsDrawer, setShowLogsDrawer] = useState(false);
  const [showAdminUnlockBox, setShowAdminUnlockBox] = useState(false);
  const [tick, setTick] = useState(0);

  // Auto-refresh countdown every 5 seconds
  useEffect(() => {
    const timer = setInterval(() => setTick(t => t + 1), 5000);
    return () => clearInterval(timer);
  }, []);

  // Calculate elapsed or remaining time
  const elapsedMinutes = activatedAt ? Math.floor((Date.now() - activatedAt) / 60000) : 0;
  const remainingMinutes = Math.max(1, (estimatedMinutes || 30) - elapsedMinutes);
  const progressPercent = Math.min(95, Math.max(15, Math.round(((estimatedMinutes - remainingMinutes) / (estimatedMinutes || 30)) * 100)));

  const handleDeactivateDirect = async () => {
    setIsProcessing(true);
    setActionFeedback(null);

    const credential = user?.email || firebaseUser?.email || ADMIN_EMAIL;
    const result = await deactivateMaintenance(credential);

    setActionFeedback({ success: result.success, msg: result.message });
    setIsProcessing(false);
  };

  const handleUnlockWithKey = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsProcessing(true);
    setActionFeedback(null);

    const result = await deactivateMaintenance(adminKeyInput);
    setActionFeedback({ success: result.success, msg: result.message });
    setIsProcessing(false);
    if (result.success) {
      setAdminKeyInput('');
    }
  };

  const handleGoogleAdminLogin = async () => {
    setIsProcessing(true);
    await loginWithGoogle();
    setIsProcessing(false);
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col items-center justify-center p-3 sm:p-6 relative overflow-hidden selection:bg-cyan-500 selection:text-slate-950 font-sans">
      
      {/* Background Ambience Orbs & Grid */}
      <div className="liquid-orb-1 opacity-50 pointer-events-none" />
      <div className="liquid-orb-2 opacity-40 pointer-events-none" />
      <div className="liquid-orb-3 opacity-35 pointer-events-none" />
      <div className="cyber-3d-grid opacity-70 pointer-events-none" />

      {/* Main Container */}
      <main className="w-full max-w-3xl relative z-10 space-y-5 my-auto py-4">
        
        {/* TOP ADMIN QUICK-CONTROL STRIP (Highlighted for Admin) */}
        {isAdmin && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="p-4 sm:p-5 rounded-3xl bg-gradient-to-r from-amber-500/20 via-slate-900/90 to-cyan-500/20 border border-amber-500/50 backdrop-blur-xl shadow-[0_0_30px_rgba(245,158,11,0.25)] flex flex-col sm:flex-row items-center justify-between gap-3.5"
          >
            <div className="flex items-center gap-3 text-center sm:text-left">
              <div className="w-10 h-10 rounded-2xl bg-amber-500/20 border border-amber-500/40 flex items-center justify-center text-amber-400 shrink-0">
                <Sparkles className="w-5 h-5 animate-spin" style={{ animationDuration: '6s' }} />
              </div>
              <div>
                <div className="text-xs font-bold text-white flex items-center justify-center sm:justify-start gap-2">
                  <span>Painel de Administrador Reconhecido</span>
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-mono bg-amber-500/20 text-amber-300 border border-amber-500/30">
                    Gustavo Peixoto
                  </span>
                </div>
                <p className="text-[11px] text-slate-300 font-mono">
                  {ADMIN_EMAIL} • Acesso total para restaurar o sistema
                </p>
              </div>
            </div>

            <div className="flex flex-wrap items-center justify-center gap-2 w-full sm:w-auto">
              <button
                type="button"
                onClick={handleDeactivateDirect}
                disabled={isProcessing}
                className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-slate-950 font-bold text-xs flex items-center justify-center gap-1.5 transition-all cursor-pointer shadow-lg shadow-emerald-500/20 disabled:opacity-50"
              >
                <Unlock className="w-4 h-4" />
                <span>Desativar Manutenção Agora</span>
              </button>

              <button
                type="button"
                onClick={toggleFounderBypass}
                className={`px-3 py-2.5 rounded-xl border text-xs font-mono font-bold flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
                  isFounderBypassing
                    ? 'bg-cyan-500/20 text-cyan-300 border-cyan-400/50'
                    : 'bg-slate-800 text-slate-300 border-white/10 hover:bg-slate-750'
                }`}
              >
                <Eye className="w-3.5 h-3.5 text-cyan-400" />
                <span>{isFounderBypassing ? 'Bypass Ativo' : 'Ver Site (Bypass)'}</span>
              </button>
            </div>
          </motion.div>
        )}

        {/* FEEDBACK ALERT */}
        {actionFeedback && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className={`p-4 rounded-2xl text-xs flex items-start gap-2.5 backdrop-blur-xl ${
              actionFeedback.success
                ? 'bg-emerald-500/20 border border-emerald-500/50 text-emerald-200'
                : 'bg-rose-500/20 border border-rose-500/50 text-rose-200'
            }`}
          >
            {actionFeedback.success ? (
              <CheckCircle2 className="w-5 h-5 shrink-0 mt-0.5 text-emerald-400" />
            ) : (
              <AlertTriangle className="w-5 h-5 shrink-0 mt-0.5 text-rose-400" />
            )}
            <div className="font-medium">{actionFeedback.msg}</div>
          </motion.div>
        )}

        {/* MAIN VISUAL MAINTENANCE CARD */}
        <div className="liquid-glass-card rounded-3xl p-6 sm:p-10 text-center shadow-[0_0_60px_rgba(6,182,212,0.15)] border border-cyan-500/30 relative overflow-hidden backdrop-blur-2xl">
          
          {/* Top glowing ambient accent */}
          <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-cyan-500 via-amber-500 to-indigo-500" />

          {/* Top pulse badge */}
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-300 text-xs font-mono mb-6 shadow-inner">
            <span className="w-2.5 h-2.5 rounded-full bg-amber-400 animate-ping" />
            <span className="font-bold tracking-wide">MODO DE MANUTENÇÃO ATIVO</span>
          </div>

          {/* Logo & Brand Header */}
          <div className="flex flex-col items-center mb-6">
            <div className="relative mb-4">
              <div className="w-20 h-20 rounded-3xl bg-gradient-to-tr from-cyan-500 via-blue-600 to-indigo-600 flex items-center justify-center text-white shadow-[0_0_40px_rgba(6,182,212,0.4)] border border-white/20 transform hover:scale-105 transition-transform">
                <Wrench className="w-10 h-10 text-white animate-pulse" />
              </div>
              <div className="absolute -bottom-1 -right-1 w-6 h-6 rounded-full bg-amber-500 border-2 border-slate-950 flex items-center justify-center text-slate-950">
                <Radio className="w-3 h-3 animate-ping" />
              </div>
            </div>
            
            <h1 className="text-2xl sm:text-4xl font-black text-white tracking-tight">
              Gustavo <span className="bg-gradient-to-r from-cyan-400 via-teal-300 to-blue-400 bg-clip-text text-transparent">Tec</span>
            </h1>
            <p className="text-xs sm:text-sm text-slate-400 font-mono mt-1">
              Portal de Tecnologia, Inovação & Inteligência Artificial
            </p>
          </div>

          {/* Reason & Status Box */}
          <div className="bg-slate-900/80 border border-white/10 rounded-2xl p-5 sm:p-6 mb-6 text-left space-y-4 shadow-inner">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-cyan-400 font-mono text-xs font-bold uppercase tracking-wider">
                <ShieldAlert className="w-4 h-4" />
                <span>Atualização de Serviços & Otimização</span>
              </div>
              <span className="text-[11px] font-mono text-amber-300 bg-amber-500/15 border border-amber-500/30 px-2.5 py-0.5 rounded-full font-bold">
                Em Andamento
              </span>
            </div>
            
            <div className="p-3.5 rounded-xl bg-slate-950/60 border border-white/5">
              <p className="text-sm sm:text-base text-slate-100 font-medium leading-relaxed">
                "{maintenanceReason || 'Atualização de Infraestrutura e Otimização do Servidor'}"
              </p>
            </div>

            {/* Diagnostic Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 pt-1 text-xs font-mono">
              <div className="bg-slate-950/70 p-2.5 rounded-xl border border-white/5 space-y-1">
                <div className="text-slate-400 flex items-center gap-1 text-[11px]">
                  <Server className="w-3 h-3 text-cyan-400" />
                  <span>Servidores</span>
                </div>
                <div className="text-emerald-400 font-bold text-[11px] flex items-center gap-1">
                  <CheckCircle2 className="w-3 h-3" />
                  <span>Ativos</span>
                </div>
              </div>

              <div className="bg-slate-950/70 p-2.5 rounded-xl border border-white/5 space-y-1">
                <div className="text-slate-400 flex items-center gap-1 text-[11px]">
                  <Cpu className="w-3 h-3 text-purple-400" />
                  <span>Banco de Dados</span>
                </div>
                <div className="text-amber-300 font-bold text-[11px] flex items-center gap-1">
                  <RefreshCw className="w-3 h-3 animate-spin" />
                  <span>Sincronizando</span>
                </div>
              </div>

              <div className="bg-slate-950/70 p-2.5 rounded-xl border border-white/5 space-y-1">
                <div className="text-slate-400 flex items-center gap-1 text-[11px]">
                  <Zap className="w-3 h-3 text-amber-400" />
                  <span>reCAPTCHA</span>
                </div>
                <div className="text-slate-400 font-bold text-[11px]">
                  <span>Pausado</span>
                </div>
              </div>

              <div className="bg-slate-950/70 p-2.5 rounded-xl border border-white/5 space-y-1">
                <div className="text-slate-400 flex items-center gap-1 text-[11px]">
                  <Clock className="w-3 h-3 text-emerald-400" />
                  <span>Previsão</span>
                </div>
                <div className="text-cyan-300 font-bold text-[11px]">
                  <span>~{remainingMinutes} min</span>
                </div>
              </div>
            </div>

            {/* Progress Bar */}
            <div className="space-y-1.5 pt-1">
              <div className="flex items-center justify-between text-[11px] font-mono text-slate-400">
                <span>Progresso da Atualização</span>
                <span className="text-cyan-400 font-bold">{progressPercent}%</span>
              </div>
              <div className="w-full h-2 rounded-full bg-slate-950 overflow-hidden border border-white/10">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${progressPercent}%` }}
                  transition={{ duration: 1 }}
                  className="h-full bg-gradient-to-r from-cyan-500 via-teal-400 to-amber-400"
                />
              </div>
            </div>
          </div>

          {/* User notification notice */}
          <p className="text-xs text-slate-400 max-w-md mx-auto leading-relaxed">
            Estamos a aprimorar a estabilidade, velocidade e segurança da plataforma Gustavo Tec. O acesso será reaberto automaticamente.
          </p>

          {/* Footer branding */}
          <div className="mt-8 pt-6 border-t border-white/5 flex flex-col sm:flex-row items-center justify-between gap-2 text-[11px] text-slate-500 font-mono">
            <span>© {new Date().getFullYear()} Gustavo Tec • All Rights Reserved</span>
            <span className="text-cyan-400/80">Administrador: Gustavo Peixoto</span>
          </div>
        </div>

        {/* BOTTOM ACTION BAR & CONTROLS */}
        <div className="flex flex-wrap items-center justify-center gap-3">
          
          {/* 1. Direct Deactivate button if Admin */}
          {isAdmin ? (
            <button
              type="button"
              onClick={handleDeactivateDirect}
              disabled={isProcessing}
              className="px-5 py-3 rounded-2xl bg-gradient-to-r from-emerald-500 via-teal-500 to-cyan-500 hover:from-emerald-400 hover:to-teal-400 text-slate-950 font-bold text-xs sm:text-sm flex items-center gap-2 transition-all cursor-pointer shadow-[0_0_25px_rgba(16,185,129,0.3)] disabled:opacity-50"
            >
              <Unlock className="w-4 h-4" />
              <span>Desativar Manutenção (Restaurar Site)</span>
            </button>
          ) : (
            /* If not logged in, provide Google Admin Login or Unlock Form */
            <div className="flex flex-wrap items-center justify-center gap-2">
              <button
                type="button"
                onClick={handleGoogleAdminLogin}
                className="px-4 py-2.5 rounded-xl bg-cyan-500/15 hover:bg-cyan-500/25 border border-cyan-500/40 text-cyan-300 text-xs font-mono font-bold flex items-center gap-2 transition-all cursor-pointer shadow-lg"
              >
                <Sparkles className="w-4 h-4 text-cyan-400" />
                <span>Entrar com Conta Google (Admin)</span>
              </button>

              <button
                type="button"
                onClick={() => setShowAdminUnlockBox(!showAdminUnlockBox)}
                className="px-4 py-2.5 rounded-xl bg-slate-900/80 hover:bg-slate-800 border border-white/10 hover:border-amber-500/40 text-slate-300 text-xs font-mono flex items-center gap-2 transition-all cursor-pointer backdrop-blur-md"
              >
                <KeyRound className="w-3.5 h-3.5 text-amber-400" />
                <span>Inserir Chave / Desbloquear</span>
                {showAdminUnlockBox ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
              </button>
            </div>
          )}

          {/* 2. Logs button for Audit */}
          <button
            type="button"
            onClick={() => setShowLogsDrawer(!showLogsDrawer)}
            className="px-4 py-2.5 rounded-xl bg-slate-900/60 hover:bg-slate-800 border border-white/10 text-slate-400 hover:text-cyan-300 text-xs font-mono flex items-center gap-2 transition-all cursor-pointer backdrop-blur-md"
          >
            <FileText className="w-3.5 h-3.5 text-cyan-400" />
            <span>Logs de Manutenção ({maintenanceLogs.length})</span>
            {showLogsDrawer ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
          </button>
        </div>

        {/* EXPANDABLE ADMIN KEY BOX */}
        <AnimatePresence>
          {showAdminUnlockBox && !isAdmin && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="overflow-hidden"
            >
              <form onSubmit={handleUnlockWithKey} className="p-5 rounded-3xl bg-slate-900/95 border border-cyan-500/30 space-y-3 shadow-2xl backdrop-blur-xl">
                <div className="flex items-center justify-between text-xs font-mono text-cyan-300">
                  <span className="flex items-center gap-1.5">
                    <KeyRound className="w-4 h-4 text-cyan-400" />
                    Desbloqueio com E-mail ou Chave de Administrador
                  </span>
                  <span className="text-[10px] text-slate-500">sougustavo000@gmail.com</span>
                </div>

                <div className="flex flex-col sm:flex-row gap-2">
                  <input
                    type="password"
                    value={adminKeyInput}
                    onChange={(e) => setAdminKeyInput(e.target.value)}
                    placeholder="Insira sougustavo000@gmail.com ou chave secreta..."
                    className="flex-1 px-4 py-2.5 rounded-xl bg-slate-950 border border-white/10 text-white font-mono text-xs focus:outline-none focus:border-cyan-400 shadow-inner"
                    autoFocus
                  />

                  <button
                    type="submit"
                    disabled={isProcessing || !adminKeyInput.trim()}
                    className="py-2.5 px-5 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-slate-950 font-bold text-xs flex items-center justify-center gap-1.5 transition-all cursor-pointer disabled:opacity-50"
                  >
                    {isProcessing ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Unlock className="w-4 h-4" />}
                    <span>Desativar</span>
                  </button>
                </div>
              </form>
            </motion.div>
          )}
        </AnimatePresence>

        {/* EXPANDABLE AUDIT LOGS DRAWER */}
        <AnimatePresence>
          {showLogsDrawer && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="overflow-hidden"
            >
              <div className="p-5 sm:p-6 rounded-3xl bg-slate-900/95 border border-white/10 space-y-3 shadow-2xl backdrop-blur-xl">
                <div className="flex items-center justify-between text-xs font-mono">
                  <div className="flex items-center gap-2 text-cyan-300 font-bold">
                    <Terminal className="w-4 h-4 text-cyan-400" />
                    <span>Registro de Auditoria do Modo de Manutenção</span>
                  </div>
                  <span className="text-[10px] text-slate-400">
                    Total: {maintenanceLogs.length} eventos
                  </span>
                </div>

                <div className="max-h-56 overflow-y-auto space-y-2 pr-1 custom-scrollbar text-xs font-sans">
                  {maintenanceLogs.length === 0 ? (
                    <div className="p-4 text-center text-slate-500 font-mono text-[11px]">
                      Nenhum evento registrado.
                    </div>
                  ) : (
                    maintenanceLogs.map((log) => (
                      <div
                        key={log.id}
                        className="p-3 rounded-2xl bg-slate-950/80 border border-white/5 space-y-1.5"
                      >
                        <div className="flex items-center justify-between gap-2">
                          <span className={`px-2 py-0.5 rounded text-[9px] font-mono font-bold ${
                            log.action === 'activate'
                              ? 'bg-rose-500/20 text-rose-300 border border-rose-500/40'
                              : log.action === 'deactivate'
                              ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
                              : 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40'
                          }`}>
                            {log.action === 'activate' ? 'ATIVADO' : log.action === 'deactivate' ? 'DESATIVADO' : 'EVENTO'}
                          </span>
                          <span className="font-semibold text-white text-[11px]">{log.actionLabel}</span>
                          <span className="text-[10px] font-mono text-slate-500 ml-auto">
                            {new Date(log.timestamp).toLocaleTimeString('pt-PT', { hour: '2-digit', minute: '2-digit' })}
                          </span>
                        </div>
                        <p className="text-[11px] text-slate-300">{log.details}</p>
                        <div className="text-[10px] font-mono text-slate-500 flex items-center justify-between">
                          <span>Por: {log.executedBy}</span>
                          <span>{log.executorEmail}</span>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

      </main>
    </div>
  );
};
