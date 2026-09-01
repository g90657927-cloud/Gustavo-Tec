import React, { createContext, useContext, useState, useEffect, useCallback, useMemo } from 'react';
import { collection, onSnapshot, doc, setDoc, updateDoc, deleteDoc, query, orderBy, getDocs } from 'firebase/firestore';
import { db } from '../lib/firebase';
import { UserProfile, UserRole, RoleChangeLog } from '../types';
import { useAuth, ADMIN_EMAIL, FOUNDER_EMAIL, isFounderEmail, isAdminEmail, GUSTAVO_PHOTO } from './AuthContext';

interface UserManagementContextType {
  users: UserProfile[];
  roleChangeLogs: RoleChangeLog[];
  isLoading: boolean;
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  selectedRoleFilter: string;
  setSelectedRoleFilter: (role: string) => void;
  filteredUsers: UserProfile[];
  updateUserRole: (userId: string, newRole: UserRole, reason?: string) => Promise<{ success: boolean; message: string }>;
  promoteToAdmin: (userId: string, reason?: string) => Promise<{ success: boolean; message: string }>;
  promoteToModerator: (userId: string, reason?: string) => Promise<{ success: boolean; message: string }>;
  promoteToEditor: (userId: string, reason?: string) => Promise<{ success: boolean; message: string }>;
  promoteToVip: (userId: string, reason?: string) => Promise<{ success: boolean; message: string }>;
  demoteToStandard: (userId: string, reason?: string) => Promise<{ success: boolean; message: string }>;
  toggleUserBadge: (userId: string, badge: string) => Promise<{ success: boolean; message: string }>;
  createUserManually: (userData: { name: string; email: string; role: UserRole; username?: string }) => Promise<{ success: boolean; message: string }>;
  deleteUser: (userId: string) => Promise<{ success: boolean; message: string }>;
  clearLogs: () => void;
  getUserById: (id: string) => UserProfile | undefined;
}

const INITIAL_COMMUNITY_USERS: UserProfile[] = [
  {
    id: 'usr-gustavo-peixoto',
    name: 'Gustavo Peixoto',
    username: 'gustavopeixoto',
    email: ADMIN_EMAIL,
    avatar: GUSTAVO_PHOTO,
    role: 'Administrador',
    bio: 'Fundador & Administrador Chefe do Gustavo Tec. Especialista em IA, Infraestrutura Cloud e Cibersegurança.',
    location: 'Portugal & Brasil 🇵🇹🇧🇷',
    techStack: ['TypeScript', 'React 19', 'Next.js', 'Python', 'PyTorch', 'Rust', 'WebAssembly'],
    badges: ['👑 Fundador', '🛡️ Administrador', '⚡ Tech Pioneer', '🤖 AI Explorer', '✅ Verificado'],
    favoriteCategories: ['Inteligência Artificial', 'Hardware & Chips', 'Dev & Open Source', 'Cibersegurança'],
    joinedAt: 'Fundação Ativa',
    accentColor: '#06b6d4',
    notificationsEnabled: true,
    soundEnabled: true,
    bookmarkedNewsIds: ['news-1', 'news-2', 'news-3'],
    commentsCount: 28,
    likesCount: 142
  },
  {
    id: 'usr-sarah-chen',
    name: 'Sarah Chen',
    username: 'sarah_ai_dev',
    email: 'sarah.chen@gustavotec.ai',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
    role: 'Moderador',
    bio: 'Pesquisadora em modelos de linguagem generativa e moderadora da comunidade.',
    location: 'Lisboa, Portugal 🇵🇹',
    techStack: ['Python', 'PyTorch', 'HuggingFace', 'LangChain', 'TypeScript'],
    badges: ['🎖️ Moderador', '🤖 Engenheira de IA', '⚡ Super Contribuidora'],
    favoriteCategories: ['Inteligência Artificial', 'Dev & Open Source'],
    joinedAt: 'Jan 2026',
    accentColor: '#8b5cf6',
    notificationsEnabled: true,
    soundEnabled: true,
    bookmarkedNewsIds: ['news-1'],
    commentsCount: 19,
    likesCount: 88
  },
  {
    id: 'usr-marcos-silva',
    name: 'Marcos Silva',
    username: 'marcos_hardware',
    email: 'marcos.silva@techmail.io',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
    role: 'Editor de Notícias',
    bio: 'Editor técnico focado na revolução dos semicondutores, arquitetura ARM e computação quântica.',
    location: 'São Paulo, Brasil 🇧🇷',
    techStack: ['C++', 'Rust', 'Embedded Systems', 'CUDA', 'FPGA'],
    badges: ['✍️ Editor Oficial', '⚙️ Especialista Hardware', '⚡ 10s Reader'],
    favoriteCategories: ['Hardware & Chips', 'Espaço & Robótica'],
    joinedAt: 'Fev 2026',
    accentColor: '#f59e0b',
    notificationsEnabled: true,
    soundEnabled: true,
    bookmarkedNewsIds: ['news-2'],
    commentsCount: 15,
    likesCount: 64
  },
  {
    id: 'usr-elena-rostova',
    name: 'Elena Rostova',
    username: 'elena_cybersec',
    email: 'elena.rostova@defensetech.eu',
    avatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=150&auto=format&fit=crop&q=80',
    role: 'Membro VIP',
    bio: 'Especialista em segurança de redes e defesa proativa contra vetores zero-day.',
    location: 'Porto, Portugal 🇵🇹',
    techStack: ['Go', 'Rust', 'Wireshark', 'Kubernetes', 'Linux Kernel'],
    badges: ['💎 Membro VIP', '🛡️ Cyber Sentinel', '✅ Verificado'],
    favoriteCategories: ['Cibersegurança', 'Cloud & Web3'],
    joinedAt: 'Mar 2026',
    accentColor: '#10b981',
    notificationsEnabled: true,
    soundEnabled: true,
    bookmarkedNewsIds: ['news-4'],
    commentsCount: 12,
    likesCount: 53
  },
  {
    id: 'usr-lucas-mendes',
    name: 'Lucas Mendes',
    username: 'lucas_frontend',
    email: 'lucas.mendes@devhub.com',
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80',
    role: 'Dev Full-Stack',
    bio: 'Criando interfaces rápidas e integrando webhooks para atualizações em tempo real.',
    location: 'Rio de Janeiro, Brasil 🇧🇷',
    techStack: ['React 19', 'Next.js', 'TailwindCSS', 'Node.js', 'PostgreSQL'],
    badges: ['💻 Dev Full-Stack', '🚀 Membro Ativo'],
    favoriteCategories: ['Dev & Open Source', 'Mobile & Gadgets'],
    joinedAt: 'Abr 2026',
    accentColor: '#3b82f6',
    notificationsEnabled: true,
    soundEnabled: true,
    bookmarkedNewsIds: ['news-3'],
    commentsCount: 8,
    likesCount: 31
  },
  {
    id: 'usr-ana-paula',
    name: 'Ana Paula Rocha',
    username: 'anapaula_tech',
    email: 'ana.rocha@techreader.com',
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&auto=format&fit=crop&q=80',
    role: 'Entusiasta de Tecnologia',
    bio: 'Entusiasta de novidades em smartphones, inteligência artificial e gadgets.',
    location: 'Coimbra, Portugal 🇵🇹',
    techStack: ['Gadgets', 'Smart Homes', 'Apple & Android'],
    badges: ['🚀 Membro', '⚡ 10s Reader'],
    favoriteCategories: ['Mobile & Gadgets', 'Inteligência Artificial'],
    joinedAt: 'Mai 2026',
    accentColor: '#ec4899',
    notificationsEnabled: true,
    soundEnabled: true,
    bookmarkedNewsIds: ['news-5'],
    commentsCount: 5,
    likesCount: 22
  }
];

const LOCAL_USERS_KEY = 'gustavo_tec_managed_users_v2';
const LOCAL_ROLE_LOGS_KEY = 'gustavo_tec_role_audit_logs_v1';

const UserManagementContext = createContext<UserManagementContextType | undefined>(undefined);

export const UserManagementProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user: currentUser, updateProfile, isAdmin } = useAuth();
  
  const [users, setUsers] = useState<UserProfile[]>(() => {
    try {
      const saved = localStorage.getItem(LOCAL_USERS_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) {
          // Always ensure Gustavo Peixoto is present and Admin
          const hasGustavo = parsed.some(u => isFounderEmail(u.email));
          if (!hasGustavo) {
            return [INITIAL_COMMUNITY_USERS[0], ...parsed];
          }
          return parsed;
        }
      }
      return INITIAL_COMMUNITY_USERS;
    } catch {
      return INITIAL_COMMUNITY_USERS;
    }
  });

  const [roleChangeLogs, setRoleChangeLogs] = useState<RoleChangeLog[]>(() => {
    try {
      const saved = localStorage.getItem(LOCAL_ROLE_LOGS_KEY);
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedRoleFilter, setSelectedRoleFilter] = useState('Todos');
  const [isLoading, setIsLoading] = useState(false);

  // Sync users with Firestore collection `users`
  useEffect(() => {
    try {
      const usersCol = collection(db, 'users');
      const unsubscribe = onSnapshot(usersCol, (snapshot) => {
        if (!snapshot.empty) {
          const firestoreUsers: UserProfile[] = [];
          snapshot.forEach((docSnap) => {
            const data = docSnap.data();
            firestoreUsers.push({
              id: docSnap.id,
              name: data.name || 'Usuário Tech',
              username: data.username || docSnap.id,
              email: data.email || '',
              avatar: data.avatar || `https://api.dicebear.com/7.x/bottts/svg?seed=${docSnap.id}`,
              role: (data.role as UserRole) || 'Entusiasta de Tecnologia',
              bio: data.bio || 'Membro da comunidade Gustavo Tec.',
              location: data.location || 'Brasil / Portugal',
              techStack: Array.isArray(data.techStack) ? data.techStack : ['Tech', 'IA'],
              badges: Array.isArray(data.badges) ? data.badges : ['🚀 Membro'],
              favoriteCategories: Array.isArray(data.favoriteCategories) ? data.favoriteCategories : ['Todas'],
              joinedAt: data.joinedAt || 'Membro Ativo',
              accentColor: data.accentColor || '#06b6d4',
              notificationsEnabled: data.notificationsEnabled ?? true,
              soundEnabled: data.soundEnabled ?? true,
              bookmarkedNewsIds: Array.isArray(data.bookmarkedNewsIds) ? data.bookmarkedNewsIds : [],
              commentsCount: data.commentsCount || 0,
              likesCount: data.likesCount || 0
            });
          });

          // Merge Firestore users with community presets
          setUsers((prevUsers) => {
            const map = new Map<string, UserProfile>();
            // Add community presets
            INITIAL_COMMUNITY_USERS.forEach(u => map.set(u.id, u));
            // Add local users
            prevUsers.forEach(u => map.set(u.id, u));
            // Add/Overwrite Firestore users
            firestoreUsers.forEach(u => map.set(u.id, u));
            
            // Ensure founder is always Admin
            const list = Array.from(map.values()).map(u => {
              if (isFounderEmail(u.email)) {
                return { ...u, role: 'Administrador' as UserRole };
              }
              return u;
            });
            return list;
          });
        }
      }, (err) => {
        console.warn('Firestore users snapshot info/offline fallback:', err.message);
      });

      return () => unsubscribe();
    } catch (e) {
      console.warn('Firestore users listener initialization:', e);
    }
  }, []);

  // Sync role change logs with Firestore collection `role_logs`
  useEffect(() => {
    try {
      const logsCol = collection(db, 'role_logs');
      const unsubscribe = onSnapshot(logsCol, (snapshot) => {
        if (!snapshot.empty) {
          const remoteLogs: RoleChangeLog[] = [];
          snapshot.forEach((docSnap) => {
            const data = docSnap.data();
            remoteLogs.push({
              id: docSnap.id,
              targetUserId: data.targetUserId || '',
              targetUserName: data.targetUserName || '',
              targetUserEmail: data.targetUserEmail || '',
              previousRole: data.previousRole || 'Entusiasta de Tecnologia',
              newRole: data.newRole || 'Entusiasta de Tecnologia',
              changedByEmail: data.changedByEmail || ADMIN_EMAIL,
              changedByName: data.changedByName || 'Gustavo Peixoto',
              timestamp: data.timestamp || Date.now(),
              reason: data.reason
            });
          });
          remoteLogs.sort((a, b) => b.timestamp - a.timestamp);
          setRoleChangeLogs(remoteLogs);
        }
      }, (err) => {
        console.warn('Firestore role_logs listener:', err.message);
      });

      return () => unsubscribe();
    } catch (e) {
      console.warn('Firestore role_logs setup:', e);
    }
  }, []);

  // Save users to localStorage on change
  useEffect(() => {
    try {
      localStorage.setItem(LOCAL_USERS_KEY, JSON.stringify(users));
    } catch (e) {
      console.warn('Failed to save users locally:', e);
    }
  }, [users]);

  // Save logs to localStorage on change
  useEffect(() => {
    try {
      localStorage.setItem(LOCAL_ROLE_LOGS_KEY, JSON.stringify(roleChangeLogs));
    } catch (e) {
      console.warn('Failed to save role logs locally:', e);
    }
  }, [roleChangeLogs]);

  // Sync logged-in user to user list if not already present
  useEffect(() => {
    if (currentUser) {
      setUsers((prev) => {
        const index = prev.findIndex(u => u.id === currentUser.id || (u.email && currentUser.email && u.email.toLowerCase() === currentUser.email.toLowerCase()));
        if (index >= 0) {
          const updated = [...prev];
          updated[index] = {
            ...updated[index],
            ...currentUser,
            role: isFounderEmail(currentUser.email) ? 'Administrador' : updated[index].role
          };
          return updated;
        } else {
          return [currentUser, ...prev];
        }
      });
    }
  }, [currentUser]);

  // Core Role Update Function
  const updateUserRole = useCallback(async (
    userId: string,
    newRole: UserRole,
    reason: string = 'Atualização de permissões administrativas pelo Painel de Controlo'
  ): Promise<{ success: boolean; message: string }> => {
    const targetUser = users.find(u => u.id === userId);
    if (!targetUser) {
      return { success: false, message: 'Usuário não encontrado no sistema.' };
    }

    // Security protection: Root Founder cannot be demoted
    if (isFounderEmail(targetUser.email) && newRole !== 'Administrador') {
      return {
        success: false,
        message: 'Aviso de Segurança: O Administrador Principal (Gustavo Peixoto) não pode ser rebaixado.'
      };
    }

    const previousRole = targetUser.role;
    if (previousRole === newRole) {
      return {
        success: false,
        message: `O usuário já possui o cargo "${newRole}".`
      };
    }

    // Assign appropriate default badges when role changes
    let updatedBadges = [...targetUser.badges];
    if (newRole === 'Administrador') {
      if (!updatedBadges.includes('🛡️ Administrador')) updatedBadges.unshift('🛡️ Administrador');
    } else if (newRole === 'Moderador') {
      if (!updatedBadges.includes('🎖️ Moderador')) updatedBadges.unshift('🎖️ Moderador');
      updatedBadges = updatedBadges.filter(b => b !== '🛡️ Administrador');
    } else if (newRole === 'Editor de Notícias') {
      if (!updatedBadges.includes('✍️ Editor Oficial')) updatedBadges.unshift('✍️ Editor Oficial');
      updatedBadges = updatedBadges.filter(b => b !== '🛡️ Administrador');
    } else if (newRole === 'Membro VIP') {
      if (!updatedBadges.includes('💎 Membro VIP')) updatedBadges.unshift('💎 Membro VIP');
      updatedBadges = updatedBadges.filter(b => b !== '🛡️ Administrador');
    } else if (newRole === 'Entusiasta de Tecnologia') {
      // Demoted to standard member
      updatedBadges = updatedBadges.filter(b => !['🛡️ Administrador', '🎖️ Moderador', '✍️ Editor Oficial', '💎 Membro VIP'].includes(b));
      if (!updatedBadges.includes('🚀 Membro')) updatedBadges.push('🚀 Membro');
    }

    const updatedUser: UserProfile = {
      ...targetUser,
      role: newRole,
      badges: updatedBadges
    };

    // Update Local State
    setUsers(prev => prev.map(u => u.id === userId ? updatedUser : u));

    // If target is the currently active user, update their live profile
    if (currentUser && (currentUser.id === userId || currentUser.email === targetUser.email)) {
      updateProfile({ role: newRole, badges: updatedBadges });
    }

    // Create Audit Log
    const newLog: RoleChangeLog = {
      id: `log-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`,
      targetUserId: targetUser.id,
      targetUserName: targetUser.name,
      targetUserEmail: targetUser.email,
      previousRole,
      newRole,
      changedByEmail: currentUser?.email || ADMIN_EMAIL,
      changedByName: currentUser?.name || 'Gustavo Peixoto (Administrador)',
      timestamp: Date.now(),
      reason
    };

    setRoleChangeLogs(prev => [newLog, ...prev]);

    // Async sync to Firestore
    try {
      // Update User Doc
      const userRef = doc(db, 'users', userId);
      await setDoc(userRef, {
        ...updatedUser,
        updatedAt: Date.now(),
        updatedBy: currentUser?.email || ADMIN_EMAIL
      }, { merge: true });

      // Save Log Doc
      const logRef = doc(db, 'role_logs', newLog.id);
      await setDoc(logRef, newLog);
    } catch (e: any) {
      console.warn('Firestore role persistence note:', e.message);
    }

    const isPromotion = ['Administrador', 'Moderador', 'Editor de Notícias', 'Membro VIP'].includes(newRole);
    const actionLabel = isPromotion ? 'promovido para' : 'alterado para';

    return {
      success: true,
      message: `Sucesso: O usuário ${targetUser.name} foi ${actionLabel} "${newRole}" com êxito!`
    };
  }, [users, currentUser, updateProfile]);

  // Convenience helper functions
  const promoteToAdmin = useCallback(async (userId: string, reason?: string) => {
    return updateUserRole(userId, 'Administrador', reason || 'Promoção a Administrador com privilégios plenos de gestão');
  }, [updateUserRole]);

  const promoteToModerator = useCallback(async (userId: string, reason?: string) => {
    return updateUserRole(userId, 'Moderador', reason || 'Promoção a Moderador da Comunidade');
  }, [updateUserRole]);

  const promoteToEditor = useCallback(async (userId: string, reason?: string) => {
    return updateUserRole(userId, 'Editor de Notícias', reason || 'Promoção a Editor Técnico Oficial');
  }, [updateUserRole]);

  const promoteToVip = useCallback(async (userId: string, reason?: string) => {
    return updateUserRole(userId, 'Membro VIP', reason || 'Atribuição de Membro VIP com destaque');
  }, [updateUserRole]);

  const demoteToStandard = useCallback(async (userId: string, reason?: string) => {
    return updateUserRole(userId, 'Entusiasta de Tecnologia', reason || 'Rebaixamento para Membro Padrão (Entusiasta de Tecnologia)');
  }, [updateUserRole]);

  const toggleUserBadge = useCallback(async (userId: string, badge: string): Promise<{ success: boolean; message: string }> => {
    const target = users.find(u => u.id === userId);
    if (!target) return { success: false, message: 'Usuário não encontrado.' };

    const hasBadge = target.badges.includes(badge);
    const newBadges = hasBadge ? target.badges.filter(b => b !== badge) : [...target.badges, badge];

    setUsers(prev => prev.map(u => u.id === userId ? { ...u, badges: newBadges } : u));
    
    try {
      const userRef = doc(db, 'users', userId);
      await updateDoc(userRef, { badges: newBadges });
    } catch (e: any) {
      console.warn('Firestore badge update note:', e.message);
    }

    return {
      success: true,
      message: hasBadge ? `Selo "${badge}" removido de ${target.name}.` : `Selo "${badge}" atribuído a ${target.name}.`
    };
  }, [users]);

  const createUserManually = useCallback(async (userData: {
    name: string;
    email: string;
    role: UserRole;
    username?: string;
  }): Promise<{ success: boolean; message: string }> => {
    if (!userData.email || !userData.email.includes('@')) {
      return { success: false, message: 'Insira um e-mail válido.' };
    }

    const exists = users.some(u => u.email.toLowerCase() === userData.email.toLowerCase());
    if (exists) {
      return { success: false, message: 'Já existe um usuário cadastrado com este e-mail.' };
    }

    const cleanUsername = (userData.username || userData.email.split('@')[0])
      .toLowerCase()
      .replace(/[^a-z0-9]/g, '_');

    const newUser: UserProfile = {
      id: `usr-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`,
      name: userData.name || userData.email.split('@')[0],
      username: cleanUsername,
      email: userData.email.trim(),
      avatar: `https://api.dicebear.com/7.x/bottts/svg?seed=${cleanUsername}`,
      role: userData.role,
      bio: `Membro ${userData.role} adicionado pela Administração.`,
      location: 'Cadastrado no Portal',
      techStack: ['Tech', 'IA'],
      badges: userData.role === 'Administrador' 
        ? ['🛡️ Administrador', '✅ Verificado'] 
        : userData.role === 'Moderador' 
        ? ['🎖️ Moderador', '✅ Verificado']
        : userData.role === 'Membro VIP'
        ? ['💎 Membro VIP']
        : ['🚀 Membro'],
      favoriteCategories: ['Todas'],
      joinedAt: new Date().toLocaleDateString('pt-PT', { month: 'short', year: 'numeric' }),
      accentColor: '#06b6d4',
      notificationsEnabled: true,
      soundEnabled: true,
      bookmarkedNewsIds: [],
      commentsCount: 0,
      likesCount: 0
    };

    setUsers(prev => [newUser, ...prev]);

    // Save to Firestore
    try {
      const userRef = doc(db, 'users', newUser.id);
      await setDoc(userRef, newUser);
    } catch (e: any) {
      console.warn('Firestore create user note:', e.message);
    }

    // Add log
    const log: RoleChangeLog = {
      id: `log-${Date.now()}`,
      targetUserId: newUser.id,
      targetUserName: newUser.name,
      targetUserEmail: newUser.email,
      previousRole: 'Entusiasta de Tecnologia',
      newRole: userData.role,
      changedByEmail: currentUser?.email || ADMIN_EMAIL,
      changedByName: currentUser?.name || 'Gustavo Peixoto',
      timestamp: Date.now(),
      reason: 'Criação e atribuição inicial de cargo pela Administração'
    };
    setRoleChangeLogs(prev => [log, ...prev]);

    return {
      success: true,
      message: `Usuário "${newUser.name}" cadastrado com sucesso com o cargo "${newUser.role}".`
    };
  }, [users, currentUser]);

  const deleteUser = useCallback(async (userId: string): Promise<{ success: boolean; message: string }> => {
    const target = users.find(u => u.id === userId);
    if (!target) return { success: false, message: 'Usuário não encontrado.' };

    if (isFounderEmail(target.email)) {
      return { success: false, message: 'Não é permitido excluir a conta do Fundador Principal.' };
    }

    setUsers(prev => prev.filter(u => u.id !== userId));

    try {
      const userRef = doc(db, 'users', userId);
      await deleteDoc(userRef);
    } catch (e: any) {
      console.warn('Firestore delete user note:', e.message);
    }

    return { success: true, message: `Usuário ${target.name} removido do sistema.` };
  }, [users]);

  const clearLogs = useCallback(() => {
    setRoleChangeLogs([]);
    try {
      localStorage.removeItem(LOCAL_ROLE_LOGS_KEY);
    } catch (e) {
      console.warn('Failed to clear logs:', e);
    }
  }, []);

  const getUserById = useCallback((id: string) => {
    return users.find(u => u.id === id);
  }, [users]);

  // Filtered Users computation
  const filteredUsers = useMemo(() => {
    return users.filter((u) => {
      const q = searchQuery.toLowerCase().trim();
      const matchesSearch = !q || (
        u.name.toLowerCase().includes(q) ||
        u.username.toLowerCase().includes(q) ||
        u.email.toLowerCase().includes(q) ||
        u.role.toLowerCase().includes(q) ||
        u.id.toLowerCase().includes(q) ||
        u.badges.some(b => b.toLowerCase().includes(q)) ||
        u.techStack.some(t => t.toLowerCase().includes(q))
      );

      if (!matchesSearch) return false;

      if (selectedRoleFilter === 'Todos') return true;
      if (selectedRoleFilter === 'Administrador' || selectedRoleFilter === 'Administradores') {
        return u.role === 'Administrador';
      }
      if (selectedRoleFilter === 'Moderador' || selectedRoleFilter === 'Moderadores') {
        return u.role === 'Moderador';
      }
      if (selectedRoleFilter === 'Editor' || selectedRoleFilter === 'Editores') {
        return u.role === 'Editor de Notícias';
      }
      if (selectedRoleFilter === 'VIP' || selectedRoleFilter === 'Membros VIP') {
        return u.role === 'Membro VIP';
      }
      if (selectedRoleFilter === 'Devs') {
        return ['Dev Full-Stack', 'Engenheiro de IA', 'Analista de Segurança', 'Especialista em Hardware', 'Designer de Produto'].includes(u.role);
      }
      if (selectedRoleFilter === 'Membros') {
        return u.role === 'Entusiasta de Tecnologia';
      }
      return u.role === selectedRoleFilter;
    });
  }, [users, searchQuery, selectedRoleFilter]);

  return (
    <UserManagementContext.Provider
      value={{
        users,
        roleChangeLogs,
        isLoading,
        searchQuery,
        setSearchQuery,
        selectedRoleFilter,
        setSelectedRoleFilter,
        filteredUsers,
        updateUserRole,
        promoteToAdmin,
        promoteToModerator,
        promoteToEditor,
        promoteToVip,
        demoteToStandard,
        toggleUserBadge,
        createUserManually,
        deleteUser,
        clearLogs,
        getUserById
      }}
    >
      {children}
    </UserManagementContext.Provider>
  );
};

export const useUserManagement = () => {
  const context = useContext(UserManagementContext);
  if (!context) {
    throw new Error('useUserManagement must be used within a UserManagementProvider');
  }
  return context;
};
