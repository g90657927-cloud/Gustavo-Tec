import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { doc, onSnapshot, setDoc, collection, addDoc, query, orderBy, limit, getDocs } from 'firebase/firestore';
import { db } from '../lib/firebase';
import { useAuth, isAdminEmail, ADMIN_EMAIL } from './AuthContext';

export interface MaintenanceState {
  isActive: boolean;
  reason: string;
  activatedAt: number | null;
  estimatedMinutes: number;
  activatedBy: string;
}

export interface MaintenanceLog {
  id: string;
  action: 'activate' | 'deactivate' | 'bypass_on' | 'bypass_off' | 'config_update';
  actionLabel: string;
  timestamp: number;
  reason?: string;
  estimatedMinutes?: number;
  executedBy: string;
  executorEmail: string;
  executorRole: string;
  details: string;
}

interface MaintenanceContextType {
  isMaintenanceActive: boolean;
  maintenanceReason: string;
  estimatedMinutes: number;
  activatedAt: number | null;
  isFounderBypassing: boolean;
  isAdmin: boolean;
  isFounder: boolean;
  maintenanceLogs: MaintenanceLog[];
  activateMaintenance: (credential?: string, reason?: string, duration?: number) => Promise<{ success: boolean; message: string }>;
  deactivateMaintenance: (credential?: string) => Promise<{ success: boolean; message: string }>;
  toggleFounderBypass: () => void;
  verifyFounderKey: (credential: string) => boolean;
  clearMaintenanceLogs: () => void;
  addMaintenanceLog: (log: Omit<MaintenanceLog, 'id' | 'timestamp'>) => void;
}

const STORAGE_KEY = 'gustavotec_maintenance_state_v3';
const BYPASS_STORAGE_KEY = 'gustavotec_admin_bypass_v3';

// Master Keys for Gustavo (Admin)
const ADMIN_MASTER_KEYS = [
  'gustavo2026',
  'peixoto2026',
  '2026',
  'gustavotec',
  'admin2026'
];

const DEFAULT_STATE: MaintenanceState = {
  isActive: false,
  reason: 'Atualização de Infraestrutura e Otimização do Servidor',
  activatedAt: null,
  estimatedMinutes: 30,
  activatedBy: 'Gustavo Peixoto (Administrador)'
};

const MaintenanceContext = createContext<MaintenanceContextType | undefined>(undefined);

export const MaintenanceProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user, firebaseUser } = useAuth();

  // Validate Admin permission directly via Firebase Auth email, user profile email, or role
  const isAdmin = Boolean(
    (firebaseUser?.email && isAdminEmail(firebaseUser.email)) ||
    (user?.email && isAdminEmail(user.email) && user?.role === 'Administrador')
  );

  const [state, setState] = useState<MaintenanceState>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        return JSON.parse(saved);
      }
    } catch {
      // Ignore storage errors
    }
    return DEFAULT_STATE;
  });

  const [isFounderBypassing, setIsFounderBypassing] = useState<boolean>(() => {
    try {
      return localStorage.getItem(BYPASS_STORAGE_KEY) === 'true';
    } catch {
      return false;
    }
  });

  const [maintenanceLogs, setMaintenanceLogs] = useState<MaintenanceLog[]>([]);

  // 1. Listen in real-time to global Firestore maintenance state
  useEffect(() => {
    try {
      const unsub = onSnapshot(doc(db, 'system_config', 'maintenance'), (docSnap) => {
        if (docSnap.exists()) {
          const data = docSnap.data();
          const newState: MaintenanceState = {
            isActive: Boolean(data.isActive),
            reason: data.reason || 'Atualização programada de sistema',
            activatedAt: data.activatedAt || null,
            estimatedMinutes: data.estimatedMinutes || 30,
            activatedBy: data.activatedBy || 'Gustavo Peixoto (Administrador)'
          };
          setState(newState);
          try {
            localStorage.setItem(STORAGE_KEY, JSON.stringify(newState));
          } catch {}
        }
      }, (err) => {
        console.warn('Firestore maintenance sync info:', err.message);
      });

      return () => unsub();
    } catch (e) {
      console.warn('Failed to subscribe to maintenance state:', e);
    }
  }, []);

  // 2. Fetch logs from Firestore
  useEffect(() => {
    const fetchLogs = async () => {
      try {
        const q = query(collection(db, 'role_logs'), limit(30));
        const snap = await getDocs(q);
        const logs: MaintenanceLog[] = [];
        snap.forEach(d => {
          const data = d.data();
          logs.push({
            id: d.id,
            action: data.action || 'config_update',
            actionLabel: data.actionLabel || data.action || 'Evento do Sistema',
            timestamp: data.timestamp || Date.now(),
            reason: data.reason,
            estimatedMinutes: data.estimatedMinutes,
            executedBy: data.executedBy || 'Administrador',
            executorEmail: data.executorEmail || ADMIN_EMAIL,
            executorRole: data.executorRole || 'Administrador',
            details: data.details || 'Ação registrada no sistema.'
          });
        });
        if (logs.length > 0) {
          setMaintenanceLogs(logs.sort((a, b) => b.timestamp - a.timestamp));
        }
      } catch (err) {
        console.warn('Could not fetch role_logs:', err);
      }
    };
    fetchLogs();
  }, []);

  // Verify whether credential is valid admin key or admin session
  const verifyFounderKey = useCallback((credential?: string): boolean => {
    if (isAdmin) return true;
    if (!credential) return false;
    const clean = credential.trim().toLowerCase();
    if (!clean) return false;
    if (clean === ADMIN_EMAIL.toLowerCase() || clean.includes('sougustavo000@gmail.com')) {
      // Must match admin
      return true;
    }
    if (firebaseUser?.email && isAdminEmail(firebaseUser.email)) return true;
    if (user?.email && isAdminEmail(user.email)) return true;
    return ADMIN_MASTER_KEYS.some(k => k.toLowerCase() === clean);
  }, [isAdmin, user, firebaseUser]);

  const addMaintenanceLog = useCallback(async (newLog: Omit<MaintenanceLog, 'id' | 'timestamp'>) => {
    const entry: MaintenanceLog = {
      ...newLog,
      id: `log-${Date.now()}-${Math.random().toString(36).substr(2, 6)}`,
      timestamp: Date.now()
    };
    setMaintenanceLogs(prev => [entry, ...prev.slice(0, 49)]);

    try {
      await addDoc(collection(db, 'role_logs'), {
        action: entry.action,
        actionLabel: entry.actionLabel,
        timestamp: entry.timestamp,
        reason: entry.reason || '',
        estimatedMinutes: entry.estimatedMinutes || 0,
        executedBy: entry.executedBy,
        executorEmail: entry.executorEmail,
        executorRole: entry.executorRole,
        details: entry.details
      });
    } catch (e) {
      console.warn('Firestore log write warning:', e);
    }
  }, []);

  const clearMaintenanceLogs = useCallback(() => {
    if (!isAdmin) return;
    setMaintenanceLogs([]);
  }, [isAdmin]);

  const activateMaintenance = useCallback(async (
    credential: string = '',
    reason: string = 'Atualização de Infraestrutura e Otimização de Performance',
    duration: number = 30
  ) => {
    const isValid = isAdmin || verifyFounderKey(credential);
    if (!isValid) {
      return {
        success: false,
        message: 'Acesso Negado. Apenas o Administrador (Gustavo - sougustavo000@gmail.com) possui autorização para ativar o Modo de Manutenção.'
      };
    }

    const executorName = user?.name || firebaseUser?.displayName || 'Gustavo Peixoto (Administrador)';
    const executorEmail = user?.email || firebaseUser?.email || ADMIN_EMAIL;
    const finalReason = reason.trim() || 'Atualização programada do ecossistema Gustavo Tec';

    const newState: MaintenanceState = {
      isActive: true,
      reason: finalReason,
      activatedAt: Date.now(),
      estimatedMinutes: Math.max(5, duration),
      activatedBy: executorName
    };

    setState(newState);
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(newState));
    } catch {}

    // Persist globally in Firestore for ALL users
    try {
      await setDoc(doc(db, 'system_config', 'maintenance'), newState, { merge: true });
    } catch (err) {
      console.warn('Firestore maintenance sync write warning:', err);
    }

    // Record in Maintenance Logs
    addMaintenanceLog({
      action: 'activate',
      actionLabel: 'Modo de Manutenção Ativado Globalmente',
      reason: finalReason,
      estimatedMinutes: Math.max(5, duration),
      executedBy: executorName,
      executorEmail,
      executorRole: 'Administrador',
      details: `Serviço bloqueado para todos os visitantes. Motivo: "${finalReason}". Previsão de retorno: ${Math.max(5, duration)} minutos.`
    });

    return {
      success: true,
      message: 'Modo de Manutenção ATIVADO GLOBALMENTE com sucesso. Todos os usuários agora veem a tela de manutenção.'
    };
  }, [isAdmin, verifyFounderKey, user, firebaseUser, addMaintenanceLog]);

  const deactivateMaintenance = useCallback(async (credential: string = '') => {
    const isValid = isAdmin || verifyFounderKey(credential);
    if (!isValid) {
      return {
        success: false,
        message: 'Acesso Negado. Chave ou credenciais de Administrador inválidas.'
      };
    }

    const executorName = user?.name || firebaseUser?.displayName || 'Gustavo Peixoto (Administrador)';
    const executorEmail = user?.email || firebaseUser?.email || ADMIN_EMAIL;

    const newState: MaintenanceState = {
      isActive: false,
      reason: 'Operação Normal',
      activatedAt: null,
      estimatedMinutes: 0,
      activatedBy: ''
    };

    setState(newState);
    setIsFounderBypassing(false);

    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(newState));
      localStorage.removeItem(BYPASS_STORAGE_KEY);
    } catch {}

    // Persist globally in Firestore
    try {
      await setDoc(doc(db, 'system_config', 'maintenance'), newState, { merge: true });
    } catch (err) {
      console.warn('Firestore maintenance sync write warning:', err);
    }

    // Record in Maintenance Logs
    addMaintenanceLog({
      action: 'deactivate',
      actionLabel: 'Modo de Manutenção Desativado Globalmente',
      reason: 'Restauração de Operação Normal',
      estimatedMinutes: 0,
      executedBy: executorName,
      executorEmail,
      executorRole: 'Administrador',
      details: 'O portal Gustavo Tec foi restaurado para acesso normal a todos os utilizadores.'
    });

    return {
      success: true,
      message: 'Modo de Manutenção DESATIVADO globalmente. O portal está acessível a todos!'
    };
  }, [isAdmin, verifyFounderKey, user, firebaseUser, addMaintenanceLog]);

  const toggleFounderBypass = useCallback(() => {
    if (!isAdmin) return;
    setIsFounderBypassing(prev => {
      const next = !prev;
      try {
        if (next) {
          localStorage.setItem(BYPASS_STORAGE_KEY, 'true');
        } else {
          localStorage.removeItem(BYPASS_STORAGE_KEY);
        }
      } catch {}
      return next;
    });
  }, [isAdmin]);

  return (
    <MaintenanceContext.Provider
      value={{
        isMaintenanceActive: state.isActive,
        maintenanceReason: state.reason,
        estimatedMinutes: state.estimatedMinutes,
        activatedAt: state.activatedAt,
        isFounderBypassing,
        isAdmin,
        isFounder: isAdmin,
        maintenanceLogs,
        activateMaintenance,
        deactivateMaintenance,
        toggleFounderBypass,
        verifyFounderKey,
        clearMaintenanceLogs,
        addMaintenanceLog
      }}
    >
      {children}
    </MaintenanceContext.Provider>
  );
};

export const useMaintenance = () => {
  const context = useContext(MaintenanceContext);
  if (!context) {
    throw new Error('useMaintenance must be used within a MaintenanceProvider');
  }
  return context;
};
