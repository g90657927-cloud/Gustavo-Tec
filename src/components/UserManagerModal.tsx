import React, { useState } from 'react';
import {
  X,
  Search,
  UserCheck,
  Shield,
  ShieldAlert,
  ShieldCheck,
  Award,
  Crown,
  Sparkles,
  Users,
  UserPlus,
  ArrowUpRight,
  ArrowDownRight,
  RefreshCw,
  Trash2,
  CheckCircle2,
  AlertTriangle,
  FileText,
  Filter,
  Check,
  Plus,
  Mail,
  Calendar,
  MapPin,
  Tag,
  ChevronDown,
  ChevronUp,
  Cpu,
  Lock,
  Unlock,
  Eye,
  SlidersHorizontal
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { useUserManagement } from '../context/UserManagementContext';
import { useAuth, ADMIN_EMAIL, isFounderEmail } from '../context/AuthContext';
import { UserProfile, UserRole } from '../types';

interface UserManagerModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const ALL_ROLES: { role: UserRole; label: string; icon: string; desc: string; color: string; tier: number }[] = [
  {
    role: 'Administrador',
    label: 'Administrador (Admin)',
    icon: '🛡️',
    desc: 'Acesso pleno ao painel de manutenção, gestão de usuários, auditoria e moderação.',
    color: 'from-amber-500/20 via-rose-500/20 to-amber-500/20 border-amber-500/50 text-amber-300',
    tier: 1
  },
  {
    role: 'Moderador',
    label: 'Moderador da Comunidade',
    icon: '🎖️',
    desc: 'Pode gerenciar e moderar comentários e mensagens na sala online.',
    color: 'from-purple-500/20 via-indigo-500/20 to-purple-500/20 border-purple-500/50 text-purple-300',
    tier: 2
  },
  {
    role: 'Editor de Notícias',
    label: 'Editor Técnico Oficial',
    icon: '✍️',
    desc: 'Permissão para publicar, revisar e destacar artigos e novidades tecnológicas.',
    color: 'from-amber-500/20 via-orange-500/20 to-amber-500/20 border-amber-500/50 text-amber-300',
    tier: 3
  },
  {
    role: 'Membro VIP',
    label: 'Membro VIP',
    icon: '💎',
    desc: 'Usuário com selo exclusivo de apoiador e privilégios especiais de destaque.',
    color: 'from-emerald-500/20 via-teal-500/20 to-emerald-500/20 border-emerald-500/50 text-emerald-300',
    tier: 4
  },
  {
    role: 'Dev Full-Stack',
    label: 'Desenvolvedor Full-Stack',
    icon: '💻',
    desc: 'Membro técnico especializado em desenvolvimento e APIs.',
    color: 'from-blue-500/20 via-cyan-500/20 to-blue-500/20 border-blue-500/50 text-blue-300',
    tier: 5
  },
  {
    role: 'Engenheiro de IA',
    label: 'Engenheiro de IA',
    icon: '🤖',
    desc: 'Especialista em modelos de linguagem generativa, LLMs e IA.',
    color: 'from-cyan-500/20 via-teal-500/20 to-cyan-500/20 border-cyan-500/50 text-cyan-300',
    tier: 5
  },
  {
    role: 'Analista de Segurança',
    label: 'Analista de Segurança',
    icon: '🔒',
    desc: 'Focado em auditoria cibernética, firewalls e integridade de dados.',
    color: 'from-rose-500/20 via-red-500/20 to-rose-500/20 border-rose-500/50 text-rose-300',
    tier: 5
  },
  {
    role: 'Especialista em Hardware',
    label: 'Especialista em Hardware',
    icon: '⚙️',
    desc: 'Especialista em semicondutores, CPUs, GPUs e arquiteturas computacionais.',
    color: 'from-orange-500/20 via-amber-500/20 to-orange-500/20 border-orange-500/50 text-orange-300',
    tier: 5
  },
  {
    role: 'Designer de Produto',
    label: 'Designer de Produto',
    icon: '🎨',
    desc: 'Focado em interfaces futuristas, usabilidade e design systems.',
    color: 'from-pink-500/20 via-purple-500/20 to-pink-500/20 border-pink-500/50 text-pink-300',
    tier: 5
  },
  {
    role: 'Entusiasta de Tecnologia',
    label: 'Entusiasta de Tecnologia (Membro Padrão)',
    icon: '👤',
    desc: 'Membro da comunidade comum com acesso padrão de leitura e interação.',
    color: 'from-slate-800/80 to-slate-900/80 border-white/10 text-slate-300',
    tier: 6
  }
];

const AVAILABLE_BADGES = [
  '👑 Fundador',
  '🛡️ Administrador',
  '🎖️ Moderador',
  '✍️ Editor Oficial',
  '💎 Membro VIP',
  '⚡ Tech Pioneer',
  '🤖 AI Explorer',
  '🔒 Cyber Sentinel',
  '⚙️ Especialista Hardware',
  '💻 Dev Full-Stack',
  '✅ Verificado',
  '🚀 Membro Ativo'
];

export const UserManagerModal: React.FC<UserManagerModalProps> = ({ isOpen, onClose }) => {
  const { user: currentUser, isAdmin } = useAuth();
  const {
    users,
    filteredUsers,
    searchQuery,
    setSearchQuery,
    selectedRoleFilter,
    setSelectedRoleFilter,
    updateUserRole,
    promoteToAdmin,
    promoteToModerator,
    demoteToStandard,
    toggleUserBadge,
    createUserManually,
    deleteUser,
    roleChangeLogs,
    clearLogs
  } = useUserManagement();

  const [activeView, setActiveView] = useState<'users' | 'logs' | 'add'>('users');
  const [feedback, setFeedback] = useState<{ success: boolean; message: string } | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);

  // Quick Action Modal Target
  const [selectedUserForAction, setSelectedUserForAction] = useState<UserProfile | null>(null);
  const [targetRole, setTargetRole] = useState<UserRole>('Moderador');
  const [roleReason, setRoleReason] = useState('');
  const [isConfirmingRoleChange, setIsConfirmingRoleChange] = useState(false);

  // New User Form State
  const [newUserName, setNewUserName] = useState('');
  const [newUserEmail, setNewUserEmail] = useState('');
  const [newUserRole, setNewUserRole] = useState<UserRole>('Moderador');
  const [newUserUsername, setNewUserUsername] = useState('');

  if (!isOpen) return null;

  const showNotification = (success: boolean, message: string) => {
    setFeedback({ success, message });
    setTimeout(() => {
      setFeedback(null);
    }, 4500);
  };

  const handleOpenRoleModal = (user: UserProfile) => {
    setSelectedUserForAction(user);
    setTargetRole(user.role);
    setRoleReason('');
    setIsConfirmingRoleChange(true);
  };

  const handleExecuteRoleChange = async () => {
    if (!selectedUserForAction) return;
    setIsProcessing(true);

    const res = await updateUserRole(
      selectedUserForAction.id,
      targetRole,
      roleReason.trim() || `Alteração manual de permissão para ${targetRole}`
    );

    setIsProcessing(false);
    showNotification(res.success, res.message);
    if (res.success) {
      setIsConfirmingRoleChange(false);
      setSelectedUserForAction(null);
    }
  };

  const handleQuickPromote = async (user: UserProfile, role: 'admin' | 'moderator' | 'editor' | 'vip' | 'demote') => {
    setIsProcessing(true);
    let res;
    if (role === 'admin') {
      res = await promoteToAdmin(user.id, 'Promoção rápida a Administrador via Painel');
    } else if (role === 'moderator') {
      res = await promoteToModerator(user.id, 'Promoção rápida a Moderador via Painel');
    } else if (role === 'demote') {
      res = await demoteToStandard(user.id, 'Rebaixamento rápido para Membro Padrão');
    }
    setIsProcessing(false);
    if (res) {
      showNotification(res.success, res.message);
    }
  };

  const handleCreateUserSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newUserEmail.trim()) {
      showNotification(false, 'Por favor, insira um e-mail válido.');
      return;
    }

    setIsProcessing(true);
    const res = await createUserManually({
      name: newUserName.trim() || newUserEmail.split('@')[0],
      email: newUserEmail.trim(),
      role: newUserRole,
      username: newUserUsername.trim()
    });

    setIsProcessing(false);
    showNotification(res.success, res.message);
    if (res.success) {
      setNewUserName('');
      setNewUserEmail('');
      setNewUserUsername('');
      setActiveView('users');
    }
  };

  const handleDeleteUser = async (user: UserProfile) => {
    if (!window.confirm(`Tem certeza de que deseja remover ${user.name} (${user.email}) do sistema?`)) {
      return;
    }
    const res = await deleteUser(user.id);
    showNotification(res.success, res.message);
  };

  // Stats calculation
  const totalUsers = users.length;
  const adminCount = users.filter(u => u.role === 'Administrador').length;
  const modCount = users.filter(u => u.role === 'Moderador').length;
  const editorCount = users.filter(u => u.role === 'Editor de Notícias').length;
  const vipCount = users.filter(u => u.role === 'Membro VIP').length;
  const devCount = users.filter(u => ['Dev Full-Stack', 'Engenheiro de IA', 'Analista de Segurança', 'Especialista em Hardware', 'Designer de Produto'].includes(u.role)).length;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 md:p-6 overflow-y-auto bg-slate-950/85 backdrop-blur-md">
      <div 
        className="relative w-full max-w-4xl bg-slate-950/95 border border-white/15 rounded-3xl overflow-hidden shadow-[0_20px_60px_rgba(0,0,0,0.8)] my-auto max-h-[92vh] flex flex-col backdrop-blur-2xl text-slate-100"
        onClick={e => e.stopPropagation()}
      >
        
        {/* Top Header */}
        <div className="flex items-center justify-between px-5 sm:px-8 py-5 bg-gradient-to-r from-slate-900 via-slate-900/90 to-cyan-950/30 border-b border-white/10">
          <div className="flex items-center gap-3.5">
            <div className="w-11 h-11 rounded-2xl bg-gradient-to-tr from-cyan-500/20 via-blue-500/20 to-indigo-500/20 border border-cyan-500/40 flex items-center justify-center text-cyan-400 shadow-[0_0_20px_rgba(6,182,212,0.2)]">
              <Users className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-base sm:text-xl font-black text-white tracking-tight">
                  Central de Gestão de Usuários & Cargos
                </h2>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-mono bg-amber-500/20 text-amber-300 border border-amber-500/40 font-bold flex items-center gap-1">
                  <ShieldCheck className="w-3 h-3 text-amber-400" /> Admin Master
                </span>
              </div>
              <p className="text-xs text-slate-400 font-mono">
                Pesquise, promova para Administrador, Moderador, VIP ou rebaixe usuários do portal
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-xl bg-slate-800/80 text-slate-400 hover:text-white transition-colors cursor-pointer border border-white/10"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Global Feedback Banner */}
        {feedback && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className={`px-6 py-3 text-xs font-medium flex items-center gap-2.5 border-b ${
              feedback.success
                ? 'bg-emerald-500/20 border-emerald-500/40 text-emerald-200'
                : 'bg-rose-500/20 border-rose-500/40 text-rose-200'
            }`}
          >
            {feedback.success ? (
              <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
            ) : (
              <AlertTriangle className="w-4 h-4 text-rose-400 shrink-0" />
            )}
            <span>{feedback.message}</span>
          </motion.div>
        )}

        {/* Quick Stats Bar */}
        <div className="grid grid-cols-2 sm:grid-cols-6 gap-2 px-5 sm:px-8 py-3 bg-slate-900/60 border-b border-white/5 text-xs font-mono">
          <div className="p-2 rounded-xl bg-slate-950/60 border border-white/5 flex items-center justify-between">
            <span className="text-slate-400">Total:</span>
            <span className="font-bold text-white text-sm">{totalUsers}</span>
          </div>
          <div className="p-2 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-between">
            <span className="text-amber-300">🛡️ Admins:</span>
            <span className="font-bold text-amber-300 text-sm">{adminCount}</span>
          </div>
          <div className="p-2 rounded-xl bg-purple-500/10 border border-purple-500/20 flex items-center justify-between">
            <span className="text-purple-300">🎖️ Mods:</span>
            <span className="font-bold text-purple-300 text-sm">{modCount}</span>
          </div>
          <div className="p-2 rounded-xl bg-orange-500/10 border border-orange-500/20 flex items-center justify-between">
            <span className="text-orange-300">✍️ Editores:</span>
            <span className="font-bold text-orange-300 text-sm">{editorCount}</span>
          </div>
          <div className="p-2 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-between">
            <span className="text-emerald-300">💎 VIPs:</span>
            <span className="font-bold text-emerald-300 text-sm">{vipCount}</span>
          </div>
          <div className="p-2 rounded-xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-between">
            <span className="text-blue-300">💻 Tech Devs:</span>
            <span className="font-bold text-blue-300 text-sm">{devCount}</span>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="flex items-center justify-between px-5 sm:px-8 pt-3 border-b border-white/10 bg-slate-950/70 overflow-x-auto gap-3">
          <div className="flex items-center gap-2">
            <button
              onClick={() => setActiveView('users')}
              className={`pb-3 px-3 text-xs sm:text-sm font-bold border-b-2 transition-all cursor-pointer whitespace-nowrap flex items-center gap-1.5 ${
                activeView === 'users'
                  ? 'border-cyan-400 text-cyan-300'
                  : 'border-transparent text-slate-400 hover:text-slate-200'
              }`}
            >
              <Users className="w-4 h-4" />
              <span>Lista & Pesquisa ({filteredUsers.length})</span>
            </button>

            <button
              onClick={() => setActiveView('add')}
              className={`pb-3 px-3 text-xs sm:text-sm font-bold border-b-2 transition-all cursor-pointer whitespace-nowrap flex items-center gap-1.5 ${
                activeView === 'add'
                  ? 'border-cyan-400 text-cyan-300'
                  : 'border-transparent text-slate-400 hover:text-slate-200'
              }`}
            >
              <UserPlus className="w-4 h-4 text-emerald-400" />
              <span>Adicionar / Atribuir Cargo</span>
            </button>

            <button
              onClick={() => setActiveView('logs')}
              className={`pb-3 px-3 text-xs sm:text-sm font-bold border-b-2 transition-all cursor-pointer whitespace-nowrap flex items-center gap-1.5 ${
                activeView === 'logs'
                  ? 'border-cyan-400 text-cyan-300'
                  : 'border-transparent text-slate-400 hover:text-slate-200'
              }`}
            >
              <FileText className="w-4 h-4 text-amber-400" />
              <span>Auditoria de Cargos ({roleChangeLogs.length})</span>
            </button>
          </div>
        </div>

        {/* Scrollable Content Area */}
        <div className="overflow-y-auto p-4 sm:p-6 space-y-5 flex-1 custom-scrollbar">
          
          {/* VIEW 1: SEARCH & USER LIST */}
          {activeView === 'users' && (
            <div className="space-y-4">
              
              {/* Search & Filter Toolbar */}
              <div className="flex flex-col sm:flex-row gap-3">
                
                {/* Search input */}
                <div className="relative flex-1">
                  <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-cyan-400" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={e => setSearchQuery(e.target.value)}
                    placeholder="Pesquisar por nome, @username, e-mail, cargo, selo ou tecnologia..."
                    className="w-full pl-10 pr-10 py-2.5 rounded-2xl bg-slate-900 border border-white/15 text-white placeholder-slate-500 text-xs sm:text-sm font-mono focus:outline-none focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400 shadow-inner"
                  />
                  {searchQuery && (
                    <button
                      onClick={() => setSearchQuery('')}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white p-1 rounded-full"
                    >
                      <X className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>

                {/* Role Filter Pills / Dropdown */}
                <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0">
                  {['Todos', 'Administradores', 'Moderadores', 'Editores', 'VIP', 'Devs', 'Membros'].map(filter => (
                    <button
                      key={filter}
                      onClick={() => setSelectedRoleFilter(filter)}
                      className={`px-3 py-2 rounded-xl text-xs font-mono whitespace-nowrap transition-all cursor-pointer ${
                        selectedRoleFilter === filter
                          ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-400/50 font-bold shadow-[0_0_10px_rgba(6,182,212,0.2)]'
                          : 'bg-slate-900/80 text-slate-400 hover:text-slate-200 border border-white/5 hover:border-white/20'
                      }`}
                    >
                      {filter}
                    </button>
                  ))}
                </div>
              </div>

              {/* Users Cards / Table */}
              {filteredUsers.length === 0 ? (
                <div className="p-10 text-center rounded-3xl bg-slate-900/40 border border-white/5 space-y-3">
                  <Users className="w-12 h-12 text-slate-600 mx-auto" />
                  <p className="text-sm text-slate-400 font-mono">
                    Nenhum usuário encontrado para "{searchQuery || selectedRoleFilter}".
                  </p>
                  <button
                    onClick={() => { setSearchQuery(''); setSelectedRoleFilter('Todos'); }}
                    className="px-4 py-2 rounded-xl bg-slate-800 text-cyan-300 text-xs font-mono border border-cyan-500/30 hover:bg-slate-700"
                  >
                    Limpar filtros
                  </button>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
                  {filteredUsers.map((user) => {
                    const isRootFounder = isFounderEmail(user.email);
                    const roleConfig = ALL_ROLES.find(r => r.role === user.role) || ALL_ROLES[ALL_ROLES.length - 1];

                    return (
                      <motion.div
                        key={user.id}
                        layout
                        initial={{ opacity: 0, scale: 0.98 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className={`p-4 rounded-3xl bg-slate-900/90 border transition-all duration-200 shadow-lg flex flex-col justify-between gap-3 relative overflow-hidden ${
                          user.role === 'Administrador'
                            ? 'border-amber-500/40 shadow-[0_0_20px_rgba(245,158,11,0.1)]'
                            : user.role === 'Moderador'
                            ? 'border-purple-500/30'
                            : user.role === 'Membro VIP'
                            ? 'border-emerald-500/30'
                            : 'border-white/10 hover:border-white/20'
                        }`}
                      >
                        {/* Top Ambient Glow */}
                        {user.role === 'Administrador' && (
                          <div className="absolute -top-12 -right-12 w-28 h-28 bg-amber-500/10 rounded-full blur-2xl pointer-events-none" />
                        )}

                        <div className="space-y-3">
                          {/* User Header */}
                          <div className="flex items-start gap-3">
                            <div className="relative shrink-0">
                              <img
                                src={user.avatar}
                                alt={user.name}
                                referrerPolicy="no-referrer"
                                className="w-12 h-12 rounded-2xl object-cover ring-1 ring-white/20 shadow-md"
                              />
                              <span className="absolute -bottom-1 -right-1 w-3.5 h-3.5 rounded-full bg-emerald-500 border-2 border-slate-950" title="Online" />
                            </div>

                            <div className="flex-1 min-w-0">
                              <div className="flex items-center justify-between gap-1.5">
                                <h3 className="font-bold text-white text-sm truncate flex items-center gap-1.5">
                                  <span>{user.name}</span>
                                  {isRootFounder && (
                                    <span title="Fundador Master" className="text-amber-400">👑</span>
                                  )}
                                </h3>
                                
                                {/* Role Pill Badge */}
                                <span className={`px-2 py-0.5 rounded-full text-[10px] font-mono font-bold border whitespace-nowrap bg-gradient-to-r ${roleConfig.color}`}>
                                  {roleConfig.icon} {user.role}
                                </span>
                              </div>

                              <div className="text-xs text-slate-400 font-mono truncate">
                                @{user.username} • <span className="text-slate-300">{user.email}</span>
                              </div>

                              {user.location && (
                                <div className="text-[11px] text-slate-500 flex items-center gap-1 mt-0.5">
                                  <MapPin className="w-3 h-3 text-cyan-400 shrink-0" />
                                  <span className="truncate">{user.location}</span>
                                </div>
                              )}
                            </div>
                          </div>

                          {/* Badges row */}
                          <div className="flex flex-wrap gap-1 items-center">
                            {user.badges.map(b => (
                              <span
                                key={b}
                                className="px-2 py-0.5 rounded-md bg-slate-950/80 border border-white/5 text-[10px] font-mono text-slate-300"
                              >
                                {b}
                              </span>
                            ))}
                          </div>
                        </div>

                        {/* Bottom Actions Bar */}
                        <div className="pt-2 border-t border-white/5 flex flex-wrap items-center justify-between gap-2">
                          
                          {/* Main Promote/Demote Trigger Button */}
                          <button
                            onClick={() => handleOpenRoleModal(user)}
                            className="px-3 py-1.5 rounded-xl bg-cyan-500/15 hover:bg-cyan-500/25 border border-cyan-500/40 text-cyan-300 text-xs font-mono font-bold flex items-center gap-1.5 transition-all cursor-pointer shadow-sm hover:shadow-cyan-500/20"
                          >
                            <SlidersHorizontal className="w-3.5 h-3.5" />
                            <span>Atribuir Cargo / Nível</span>
                          </button>

                          {/* Quick 1-click Promoters / Demoters */}
                          <div className="flex items-center gap-1 ml-auto">
                            
                            {user.role !== 'Administrador' && !isRootFounder && (
                              <button
                                onClick={() => handleQuickPromote(user, 'admin')}
                                title="Promover rapidamente a Administrador"
                                className="p-1.5 rounded-lg bg-amber-500/15 hover:bg-amber-500/30 text-amber-300 border border-amber-500/30 text-[11px] font-mono flex items-center gap-1 cursor-pointer transition-all"
                              >
                                <ArrowUpRight className="w-3.5 h-3.5" />
                                <span className="hidden sm:inline">Admin</span>
                              </button>
                            )}

                            {user.role !== 'Moderador' && (
                              <button
                                onClick={() => handleQuickPromote(user, 'moderator')}
                                title="Promover rapidamente a Moderador"
                                className="p-1.5 rounded-lg bg-purple-500/15 hover:bg-purple-500/30 text-purple-300 border border-purple-500/30 text-[11px] font-mono flex items-center gap-1 cursor-pointer transition-all"
                              >
                                <ArrowUpRight className="w-3.5 h-3.5" />
                                <span className="hidden sm:inline">Mod</span>
                              </button>
                            )}

                            {user.role !== 'Entusiasta de Tecnologia' && !isRootFounder && (
                              <button
                                onClick={() => handleQuickPromote(user, 'demote')}
                                title="Rebaixar para Membro Comum"
                                className="p-1.5 rounded-lg bg-rose-500/15 hover:bg-rose-500/30 text-rose-300 border border-rose-500/30 text-[11px] font-mono flex items-center gap-1 cursor-pointer transition-all"
                              >
                                <ArrowDownRight className="w-3.5 h-3.5" />
                                <span className="hidden sm:inline">Rebaixar</span>
                              </button>
                            )}

                            {!isRootFounder && (
                              <button
                                onClick={() => handleDeleteUser(user)}
                                title="Remover usuário do sistema"
                                className="p-1.5 rounded-lg bg-slate-800 hover:bg-rose-900/50 text-slate-400 hover:text-rose-300 border border-white/5 transition-colors cursor-pointer"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>
                            )}
                          </div>
                        </div>
                      </motion.div>
                    );
                  })}
                </div>
              )}
            </div>
          )}

          {/* VIEW 2: ADD / PRE-ASSIGN USER ROLE */}
          {activeView === 'add' && (
            <div className="max-w-2xl mx-auto p-5 sm:p-7 rounded-3xl bg-slate-900/90 border border-white/10 space-y-6 shadow-xl backdrop-blur-xl">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center text-emerald-400">
                  <UserPlus className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-white">Cadastrar / Pré-atribuir Cargo</h3>
                  <p className="text-xs text-slate-400">
                    Defina o cargo de qualquer usuário por e-mail antes do primeiro login
                  </p>
                </div>
              </div>

              <form onSubmit={handleCreateUserSubmit} className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-xs font-mono text-slate-300">Nome do Usuário</label>
                    <input
                      type="text"
                      value={newUserName}
                      onChange={e => setNewUserName(e.target.value)}
                      placeholder="Ex: Carlos Eduardo"
                      className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-white/10 text-white text-xs font-sans focus:outline-none focus:border-cyan-400 shadow-inner"
                      required
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-mono text-slate-300">E-mail (Google ou Tech)</label>
                    <input
                      type="email"
                      value={newUserEmail}
                      onChange={e => setNewUserEmail(e.target.value)}
                      placeholder="Ex: carlos@empresa.com"
                      className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-white/10 text-white text-xs font-mono focus:outline-none focus:border-cyan-400 shadow-inner"
                      required
                    />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-mono text-slate-300">Selecione o Cargo a Atribuir</label>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 max-h-56 overflow-y-auto pr-1 custom-scrollbar">
                    {ALL_ROLES.map(r => (
                      <div
                        key={r.role}
                        onClick={() => setNewUserRole(r.role)}
                        className={`p-3 rounded-2xl border transition-all cursor-pointer flex items-start gap-2.5 ${
                          newUserRole === r.role
                            ? 'bg-cyan-500/20 border-cyan-400 text-white shadow-md'
                            : 'bg-slate-950/70 border-white/5 text-slate-400 hover:border-white/20'
                        }`}
                      >
                        <span className="text-lg">{r.icon}</span>
                        <div className="flex-1 min-w-0">
                          <div className="text-xs font-bold text-slate-200">{r.label}</div>
                          <div className="text-[10px] text-slate-400 leading-tight">{r.desc}</div>
                        </div>
                        {newUserRole === r.role && (
                          <Check className="w-4 h-4 text-cyan-400 shrink-0" />
                        )}
                      </div>
                    ))}
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={isProcessing}
                  className="w-full py-3 rounded-2xl bg-gradient-to-r from-emerald-500 via-teal-500 to-cyan-500 hover:from-emerald-400 hover:to-teal-400 text-slate-950 font-bold text-xs sm:text-sm flex items-center justify-center gap-2 transition-all cursor-pointer shadow-lg shadow-emerald-500/20 disabled:opacity-50"
                >
                  <UserPlus className="w-4 h-4" />
                  <span>Confirmar & Cadastrar Usuário</span>
                </button>
              </form>
            </div>
          )}

          {/* VIEW 3: AUDIT LOGS */}
          {activeView === 'logs' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-xs font-mono text-amber-300">
                  <FileText className="w-4 h-4 text-amber-400" />
                  <span>Histórico de Promoções, Rebaixamentos e Mudanças de Cargo</span>
                </div>
                {roleChangeLogs.length > 0 && (
                  <button
                    onClick={clearLogs}
                    className="px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-rose-900/40 text-slate-400 hover:text-rose-300 border border-white/10 text-[11px] font-mono cursor-pointer transition-colors"
                  >
                    Limpar Histórico
                  </button>
                )}
              </div>

              {roleChangeLogs.length === 0 ? (
                <div className="p-8 text-center rounded-2xl bg-slate-900/50 border border-white/5 text-slate-500 font-mono text-xs">
                  Nenhuma alteração de cargo registrada ainda.
                </div>
              ) : (
                <div className="space-y-2.5">
                  {roleChangeLogs.map(log => (
                    <div
                      key={log.id}
                      className="p-3.5 rounded-2xl bg-slate-900/80 border border-white/10 space-y-1.5 text-xs font-mono"
                    >
                      <div className="flex flex-wrap items-center justify-between gap-2">
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-white text-sm">{log.targetUserName}</span>
                          <span className="text-slate-400 text-[11px]">({log.targetUserEmail})</span>
                        </div>
                        <span className="text-[10px] text-slate-500">
                          {new Date(log.timestamp).toLocaleString('pt-PT')}
                        </span>
                      </div>

                      <div className="flex items-center gap-2 text-[11px]">
                        <span className="px-2 py-0.5 rounded bg-slate-950 border border-white/10 text-slate-400">
                          {log.previousRole}
                        </span>
                        <span className="text-cyan-400 font-bold">➔</span>
                        <span className="px-2 py-0.5 rounded bg-cyan-500/20 border border-cyan-400/50 text-cyan-300 font-bold">
                          {log.newRole}
                        </span>
                      </div>

                      {log.reason && (
                        <p className="text-[11px] text-slate-300 font-sans italic bg-slate-950/60 p-2 rounded-xl border border-white/5">
                          "{log.reason}"
                        </p>
                      )}

                      <div className="text-[10px] text-slate-500 flex items-center justify-between pt-1">
                        <span>Autor da alteração: {log.changedByName}</span>
                        <span>{log.changedByEmail}</span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

        </div>

        {/* MODAL DE CONFIRMAÇÃO / ATRIBUIÇÃO DE CARGO */}
        <AnimatePresence>
          {isConfirmingRoleChange && selectedUserForAction && (
            <div className="fixed inset-0 z-60 flex items-center justify-center p-3 sm:p-4 bg-slate-950/80 backdrop-blur-md">
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="w-full max-w-lg bg-slate-900 border border-cyan-500/40 rounded-3xl p-6 space-y-5 shadow-2xl relative text-slate-100"
              >
                <div className="flex items-center justify-between border-b border-white/10 pb-4">
                  <div className="flex items-center gap-2.5">
                    <div className="w-10 h-10 rounded-2xl bg-cyan-500/20 border border-cyan-500/40 flex items-center justify-center text-cyan-400">
                      <SlidersHorizontal className="w-5 h-5" />
                    </div>
                    <div>
                      <h3 className="font-bold text-white text-base">Atribuir Novo Cargo / Nível</h3>
                      <p className="text-xs text-slate-400 font-mono">
                        Usuário: <span className="text-cyan-300 font-bold">{selectedUserForAction.name}</span>
                      </p>
                    </div>
                  </div>
                  <button
                    onClick={() => setIsConfirmingRoleChange(false)}
                    className="p-1.5 rounded-xl bg-slate-800 text-slate-400 hover:text-white"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>

                {/* Role Selector Grid */}
                <div className="space-y-2">
                  <label className="text-xs font-mono text-slate-300">Escolha o novo cargo para este usuário:</label>
                  <div className="grid grid-cols-1 gap-2 max-h-60 overflow-y-auto pr-1 custom-scrollbar">
                    {ALL_ROLES.map(r => (
                      <div
                        key={r.role}
                        onClick={() => setTargetRole(r.role)}
                        className={`p-3 rounded-2xl border transition-all cursor-pointer flex items-center justify-between gap-3 ${
                          targetRole === r.role
                            ? 'bg-cyan-500/20 border-cyan-400 shadow-md'
                            : 'bg-slate-950/80 border-white/5 hover:border-white/20'
                        }`}
                      >
                        <div className="flex items-center gap-2.5">
                          <span className="text-xl">{r.icon}</span>
                          <div>
                            <div className="text-xs font-bold text-white">{r.label}</div>
                            <div className="text-[10px] text-slate-400">{r.desc}</div>
                          </div>
                        </div>
                        {targetRole === r.role && (
                          <Check className="w-4 h-4 text-cyan-400 shrink-0" />
                        )}
                      </div>
                    ))}
                  </div>
                </div>

                {/* Justification / Note */}
                <div className="space-y-1.5">
                  <label className="text-xs font-mono text-slate-300">Motivo / Justificativa (Opcional)</label>
                  <input
                    type="text"
                    value={roleReason}
                    onChange={e => setRoleReason(e.target.value)}
                    placeholder="Ex: Promovido por contribuições ativas na comunidade"
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-white/10 text-white text-xs font-sans focus:outline-none focus:border-cyan-400 shadow-inner"
                  />
                </div>

                {/* Actions */}
                <div className="flex items-center justify-end gap-2 pt-2 border-t border-white/10">
                  <button
                    type="button"
                    onClick={() => setIsConfirmingRoleChange(false)}
                    className="px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-mono cursor-pointer"
                  >
                    Cancelar
                  </button>
                  <button
                    type="button"
                    onClick={handleExecuteRoleChange}
                    disabled={isProcessing}
                    className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-cyan-500 via-teal-500 to-emerald-500 hover:from-cyan-400 hover:to-teal-400 text-slate-950 font-bold text-xs font-mono flex items-center gap-1.5 transition-all cursor-pointer shadow-lg shadow-cyan-500/20 disabled:opacity-50"
                  >
                    {isProcessing ? <RefreshCw className="w-4 h-4 animate-spin" /> : <CheckCircle2 className="w-4 h-4" />}
                    <span>Confirmar Alteração</span>
                  </button>
                </div>
              </motion.div>
            </div>
          )}
        </AnimatePresence>

      </div>
    </div>
  );
};
