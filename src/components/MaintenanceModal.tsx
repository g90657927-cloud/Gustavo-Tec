import React, { useState } from 'react';
import {
  Wrench,
  ShieldCheck,
  Lock,
  Unlock,
  KeyRound,
  Eye,
  CheckCircle2,
  AlertTriangle,
  RefreshCw,
  Sparkles,
  Zap,
  LogIn,
  X,
  FileText,
  Clock,
  UserCheck,
  Trash2,
  Download,
  Terminal,
  Activity
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { useMaintenance, MaintenanceLog } from '../context/MaintenanceContext';
import { useAuth, ADMIN_EMAIL } from '../context/AuthContext';

interface MaintenanceModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const MaintenanceModal: React.FC<MaintenanceModalProps> = ({ isOpen, onClose }) => {
  const {
    isMaintenanceActive,
    maintenanceReason,
    estimatedMinutes,
    activateMaintenance,
    deactivateMaintenance,
    toggleFounderBypass,
    isFounderBypassing,
    isAdmin,
    maintenanceLogs,
    clearMaintenanceLogs
  } = useMaintenance();

  const { user, firebaseUser, loginWithGoogle } = useAuth();

  const [activeModalTab, setActiveModalTab] = useState<'controls' | 'logs'>('controls');
  const [customReason, setCustomReason] = useState(
    maintenanceReason || 'Atualização de Infraestrutura e Otimização do Servidor'
  );
  const [durationMinutes, setDurationMinutes] = useState(estimatedMinutes || 30);
  const [adminKeyInput, setAdminKeyInput] = useState('');
  const [feedback, setFeedback] = useState<{ success: boolean; msg: string } | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);

  if (!isOpen) return null;

  const handleActivate = async () => {
    setIsProcessing(true);
    setFeedback(null);

    const credential = isAdmin ? (user?.email || firebaseUser?.email || ADMIN_EMAIL) : adminKeyInput;
    const result = await activateMaintenance(credential, customReason, durationMinutes);

    setFeedback({ success: result.success, msg: result.message });
    setIsProcessing(false);
    if (result.success) {
      setAdminKeyInput('');
    }
  };

  const handleDeactivate = async () => {
    setIsProcessing(true);
    setFeedback(null);

    const credential = isAdmin ? (user?.email || firebaseUser?.email || ADMIN_EMAIL) : adminKeyInput;
    const result = await deactivateMaintenance(credential);

    setFeedback({ success: result.success, msg: result.message });
    setIsProcessing(false);
    if (result.success) {
      setAdminKeyInput('');
    }
  };

  const handleGoogleAdminLogin = async () => {
    setIsProcessing(true);
    try {
      await loginWithGoogle();
      setFeedback({
        success: true,
        msg: 'Autenticação com o Google solicitada com sucesso!'
      });
    } catch {
      setFeedback({ success: false, msg: 'Erro ao autenticar com Google.' });
    } finally {
      setIsProcessing(false);
    }
  };

  const handleExportLogs = () => {
    try {
      const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(maintenanceLogs, null, 2));
      const downloadAnchor = document.createElement('a');
      downloadAnchor.setAttribute("href", dataStr);
      downloadAnchor.setAttribute("download", `gustavotec_maintenance_logs_${new Date().toISOString().slice(0, 10)}.json`);
      document.body.appendChild(downloadAnchor);
      downloadAnchor.click();
      downloadAnchor.remove();
    } catch {
      // Fallback
    }
  };

  const getActionBadge = (action: MaintenanceLog['action']) => {
    switch (action) {
      case 'activate':
        return (
          <span className="px-2 py-0.5 rounded-md text-[10px] font-mono font-bold bg-rose-500/20 text-rose-300 border border-rose-500/40">
            🔴 ATIVADO
          </span>
        );
      case 'deactivate':
        return (
          <span className="px-2 py-0.5 rounded-md text-[10px] font-mono font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/40">
            🟢 DESATIVADO
          </span>
        );
      case 'bypass_on':
      case 'bypass_off':
        return (
          <span className="px-2 py-0.5 rounded-md text-[10px] font-mono font-bold bg-cyan-500/20 text-cyan-300 border border-cyan-500/40">
            🔵 BYPASS ADMIN
          </span>
        );
      default:
        return (
          <span className="px-2 py-0.5 rounded-md text-[10px] font-mono font-bold bg-amber-500/20 text-amber-300 border border-amber-500/40">
            🟡 CONFIGURAÇÃO
          </span>
        );
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 overflow-y-auto bg-slate-950/85 backdrop-blur-md">
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 15 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 15 }}
        className="w-full max-w-xl bg-slate-900/95 border border-amber-500/30 rounded-3xl p-5 sm:p-7 shadow-[0_0_50px_rgba(245,158,11,0.2)] text-slate-100 relative overflow-hidden"
      >
        {/* Top Decorative Gradient */}
        <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-amber-500 via-orange-500 to-cyan-500" />

        {/* Modal Header */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-2xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400 shadow-inner">
              <Wrench className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-white tracking-tight flex items-center gap-2">
                <span>Painel de Manutenção</span>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/40 font-bold">
                  Admin
                </span>
              </h2>
              <p className="text-xs text-slate-400 font-mono">
                Acesso Exclusivo • {ADMIN_EMAIL}
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white flex items-center justify-center text-sm cursor-pointer transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Sub-Navigation Tabs */}
        <div className="flex items-center gap-2 border-b border-white/10 mb-4 pb-2">
          <button
            type="button"
            onClick={() => setActiveModalTab('controls')}
            className={`px-3 py-1.5 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-all cursor-pointer ${
              activeModalTab === 'controls'
                ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40 shadow-sm'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Wrench className="w-3.5 h-3.5" />
            <span>Controlo & Status</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveModalTab('logs')}
            className={`px-3 py-1.5 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-all cursor-pointer ${
              activeModalTab === 'logs'
                ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 shadow-sm'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <FileText className="w-3.5 h-3.5" />
            <span>Logs de Manutenção</span>
            <span className="px-1.5 py-0.2 rounded-full text-[10px] font-mono bg-cyan-500/20 text-cyan-300 border border-cyan-500/30">
              {maintenanceLogs.length}
            </span>
          </button>
        </div>

        {activeModalTab === 'controls' ? (
          <div>
            {/* Status Indicator Banner */}
            <div className={`p-4 rounded-2xl border mb-5 flex items-center justify-between ${
              isMaintenanceActive
                ? 'bg-rose-500/10 border-rose-500/40 text-rose-200'
                : 'bg-emerald-500/10 border-emerald-500/40 text-emerald-200'
            }`}>
              <div className="flex items-center gap-2.5">
                <span className={`w-3 h-3 rounded-full ${
                  isMaintenanceActive ? 'bg-rose-500 animate-ping' : 'bg-emerald-400'
                }`} />
                <div>
                  <div className="text-xs font-bold font-mono uppercase tracking-wider">
                    {isMaintenanceActive ? '🔴 MODO DE MANUTENÇÃO ATIVO' : '🟢 SITE ONLINE / OPERAÇÃO NORMAL'}
                  </div>
                  <div className="text-[11px] text-slate-400 font-sans">
                    {isMaintenanceActive
                      ? 'Visitantes veem a tela de manutenção e o reCAPTCHA fica inativo.'
                      : 'Todos os utilizadores têm acesso completo às notícias, ferramentas e chat.'}
                  </div>
                </div>
              </div>
            </div>

            {/* Admin Verification Check */}
            {isAdmin ? (
              <div className="space-y-4">
                <div className="p-3.5 rounded-xl bg-cyan-500/10 border border-cyan-500/25 flex items-center justify-between text-xs text-cyan-200">
                  <div className="flex items-center gap-2">
                    <Sparkles className="w-4 h-4 text-cyan-400 shrink-0" />
                    <span>Autenticado como: <strong>Gustavo Peixoto</strong> ({ADMIN_EMAIL})</span>
                  </div>
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-cyan-500/20 text-cyan-300 font-bold">
                    Administrador
                  </span>
                </div>

                {!isMaintenanceActive && (
                  <div className="space-y-3">
                    <div className="space-y-1.5">
                      <label className="text-[11px] font-mono text-slate-300 uppercase tracking-wider flex items-center justify-between">
                        <span>Motivo da Manutenção (Exibido aos Visitantes)</span>
                      </label>
                      <input
                        type="text"
                        value={customReason}
                        onChange={(e) => setCustomReason(e.target.value)}
                        placeholder="Ex: Atualização dos Servidores e Banco de Dados"
                        className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-white/10 text-white text-xs font-medium focus:outline-none focus:border-amber-400 shadow-inner"
                      />
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-[11px] font-mono text-slate-300 uppercase tracking-wider flex items-center justify-between">
                        <span>Duração Estimada (Minutos)</span>
                        <span className="text-amber-400 font-bold">{durationMinutes} min</span>
                      </label>
                      <input
                        type="range"
                        min="5"
                        max="180"
                        step="5"
                        value={durationMinutes}
                        onChange={(e) => setDurationMinutes(Number(e.target.value))}
                        className="w-full accent-amber-400 cursor-pointer"
                      />
                    </div>
                  </div>
                )}

                {/* Action Buttons for Admin */}
                <div className="space-y-2.5 pt-2">
                  {isMaintenanceActive ? (
                    <button
                      type="button"
                      onClick={handleDeactivate}
                      disabled={isProcessing}
                      className="w-full py-3 px-4 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-400 hover:to-teal-500 text-slate-950 font-bold text-xs flex items-center justify-center gap-2 transition-all cursor-pointer shadow-lg disabled:opacity-50"
                    >
                      <Unlock className="w-4 h-4" />
                      <span>Desativar Manutenção (Restaurar Site para Todos)</span>
                    </button>
                  ) : (
                    <button
                      type="button"
                      onClick={handleActivate}
                      disabled={isProcessing}
                      className="w-full py-3 px-4 rounded-xl bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-400 hover:to-orange-500 text-slate-950 font-bold text-xs flex items-center justify-center gap-2 transition-all cursor-pointer shadow-lg disabled:opacity-50"
                    >
                      <Lock className="w-4 h-4" />
                      <span>Ativar Modo de Manutenção Agora</span>
                    </button>
                  )}

                  {isMaintenanceActive && (
                    <button
                      type="button"
                      onClick={toggleFounderBypass}
                      className={`w-full py-2.5 px-4 rounded-xl border text-xs font-mono font-bold flex items-center justify-center gap-2 transition-all cursor-pointer ${
                        isFounderBypassing
                          ? 'bg-cyan-500/20 text-cyan-300 border-cyan-400/50'
                          : 'bg-slate-800 text-slate-300 border-white/10 hover:bg-slate-700'
                      }`}
                    >
                      <Eye className="w-4 h-4 text-cyan-400" />
                      <span>{isFounderBypassing ? 'Bypass de Admin Ativo (A ver site)' : 'Ativar Bypass (Ver Site)'}</span>
                    </button>
                  )}
                </div>
              </div>
            ) : (
              /* User not logged in as Admin */
              <div className="space-y-4">
                <p className="text-xs text-slate-300 leading-relaxed">
                  Para controlar o Modo de Manutenção, autentique-se com a sua conta de <strong>Administrador ({ADMIN_EMAIL})</strong>.
                </p>

                <div className="flex justify-center">
                  <button
                    type="button"
                    onClick={handleGoogleAdminLogin}
                    disabled={isProcessing}
                    className="w-full p-3 rounded-xl bg-cyan-500/15 hover:bg-cyan-500/25 border border-cyan-500/40 text-cyan-300 text-xs font-semibold flex items-center justify-center gap-2 transition-all cursor-pointer shadow-lg disabled:opacity-50"
                  >
                    <Sparkles className="w-4 h-4 text-cyan-400" />
                    <span>Autenticar com Conta Google ({ADMIN_EMAIL})</span>
                  </button>
                </div>

                {/* Direct Master Key or Email Input */}
                <div className="p-4 rounded-2xl bg-slate-950/60 border border-white/5 space-y-3">
                  <label className="text-[11px] font-mono text-slate-400 uppercase tracking-wider block">
                    Ou use Chave Mestre de Administrador:
                  </label>
                  <input
                    type="password"
                    value={adminKeyInput}
                    onChange={(e) => setAdminKeyInput(e.target.value)}
                    placeholder="Insira a chave secreta ou sougustavo000@gmail.com..."
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-amber-500/30 text-white font-mono text-xs focus:outline-none focus:border-amber-400 shadow-inner"
                  />

                  <div className="flex gap-2">
                    <button
                      type="button"
                      onClick={handleActivate}
                      disabled={!adminKeyInput.trim() || isProcessing}
                      className="flex-1 py-2.5 px-3 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs flex items-center justify-center gap-1.5 transition-all cursor-pointer disabled:opacity-40"
                    >
                      <Lock className="w-3.5 h-3.5" />
                      <span>Ativar Manutenção</span>
                    </button>

                    <button
                      type="button"
                      onClick={handleDeactivate}
                      disabled={!adminKeyInput.trim() || isProcessing}
                      className="flex-1 py-2.5 px-3 rounded-xl bg-teal-500 hover:bg-teal-400 text-slate-950 font-bold text-xs flex items-center justify-center gap-1.5 transition-all cursor-pointer disabled:opacity-40"
                    >
                      <Unlock className="w-3.5 h-3.5" />
                      <span>Desativar</span>
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        ) : (
          /* TAB 2: Maintenance Logs (Auditoria) */
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-xs text-slate-400 font-mono">
                <Terminal className="w-4 h-4 text-cyan-400" />
                <span>Histórico de Auditoria e Eventos</span>
              </div>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={handleExportLogs}
                  title="Descarregar ficheiro JSON"
                  className="px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white text-[11px] font-mono flex items-center gap-1 transition-colors cursor-pointer border border-white/10"
                >
                  <Download className="w-3 h-3 text-cyan-400" />
                  <span>Exportar</span>
                </button>

                {isAdmin && maintenanceLogs.length > 0 && (
                  <button
                    type="button"
                    onClick={clearMaintenanceLogs}
                    title="Limpar Histórico de Logs"
                    className="px-2.5 py-1 rounded-lg bg-rose-500/10 hover:bg-rose-500/20 text-rose-300 text-[11px] font-mono flex items-center gap-1 transition-colors cursor-pointer border border-rose-500/30"
                  >
                    <Trash2 className="w-3 h-3" />
                    <span>Limpar</span>
                  </button>
                )}
              </div>
            </div>

            {/* Logs List Container */}
            <div className="max-h-72 overflow-y-auto space-y-2.5 pr-1 custom-scrollbar">
              {maintenanceLogs.length === 0 ? (
                <div className="p-8 text-center bg-slate-950/50 rounded-2xl border border-white/5 text-slate-500 text-xs">
                  Nenhum evento registrado até ao momento.
                </div>
              ) : (
                maintenanceLogs.map((log) => (
                  <div
                    key={log.id}
                    className="p-3.5 rounded-2xl bg-slate-950/70 border border-white/10 hover:border-cyan-500/30 transition-all space-y-2 text-xs"
                  >
                    <div className="flex items-center justify-between gap-2">
                      <div className="flex items-center gap-2">
                        {getActionBadge(log.action)}
                        <span className="font-semibold text-white">{log.actionLabel}</span>
                      </div>
                      <span className="text-[10px] font-mono text-slate-400 flex items-center gap-1">
                        <Clock className="w-3 h-3 text-slate-500" />
                        {new Date(log.timestamp).toLocaleString('pt-PT', {
                          day: '2-digit',
                          month: '2-digit',
                          year: 'numeric',
                          hour: '2-digit',
                          minute: '2-digit',
                          second: '2-digit'
                        })}
                      </span>
                    </div>

                    <p className="text-slate-300 text-[11px] leading-relaxed">
                      {log.details}
                    </p>

                    <div className="pt-1 border-t border-white/5 flex items-center justify-between text-[10px] font-mono text-slate-400">
                      <span className="flex items-center gap-1 text-cyan-300">
                        <UserCheck className="w-3 h-3" />
                        {log.executedBy}
                      </span>
                      <span className="text-slate-500">
                        {log.executorEmail}
                      </span>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        )}

        {/* Feedback Alert Message */}
        {feedback && (
          <div className={`mt-4 p-3 rounded-xl text-xs flex items-start gap-2 ${
            feedback.success
              ? 'bg-emerald-500/20 border border-emerald-500/40 text-emerald-300'
              : 'bg-rose-500/20 border border-rose-500/40 text-rose-300'
          }`}>
            {feedback.success ? (
              <CheckCircle2 className="w-4 h-4 shrink-0 mt-0.5" />
            ) : (
              <AlertTriangle className="w-4 h-4 shrink-0 mt-0.5" />
            )}
            <span>{feedback.msg}</span>
          </div>
        )}
      </motion.div>
    </div>
  );
};
