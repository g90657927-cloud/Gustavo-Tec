import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
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
  isFounder: boolean; // Alias for backward compatibility
  maintenanceLogs: MaintenanceLog[];
  activateMaintenance: (credential?: string, reason?: string, duration?: number) => { success: boolean; message: string };
  deactivateMaintenance: (credential?: string) => { success: boolean; message: string };
  toggleFounderBypass: () => void;
  verifyFounderKey: (credential: string) => boolean;
  clearMaintenanceLogs: () => void;
  addMaintenanceLog: (log: Omit<MaintenanceLog, 'id' | 'timestamp'>) => void;
}

const STORAGE_KEY = 'gustavotec_maintenance_state_v2';
const BYPASS_STORAGE_KEY = 'gustavotec_admin_bypass_v2';
const LOGS_STORAGE_KEY = 'gustavotec_maintenance_logs_v2';

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

const INITIAL_LOGS: MaintenanceLog[] = [
  {
    id: 'log-init-1',
    action: 'config_update',
    actionLabel: 'Sistema Inicializado',
    timestamp: Date.now() - 3600000 * 2,
    reason: 'Configuração de Segurança e Modo de Manutenção',
    estimatedMinutes: 0,
    executedBy: 'Gustavo Peixoto (Administrador)',
    executorEmail: ADMIN_EMAIL,
    executorRole: 'Administrador',
    details: 'Políticas de proteção e auditoria de manutenção vinculadas a sougustavo000@gmail.com com sucesso.'
  }
];

const MaintenanceContext = createContext<MaintenanceContextType | undefined>(undefined);

export const MaintenanceProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user, firebaseUser } = useAuth();

  // Validate Admin permission directly via Firebase Auth email, user profile email, or role
  const isAdmin = Boolean(
    (firebaseUser?.email && isAdminEmail(firebaseUser.email)) ||
    (user?.email && isAdminEmail(user.email)) ||
    user?.role === 'Administrador'
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

  const [maintenanceLogs, setMaintenanceLogs] = useState<MaintenanceLog[]>(() => {
    try {
      const saved = localStorage.getItem(LOGS_STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) {
          return parsed;
        }
      }
    } catch {
      // Ignore storage errors
    }
    return INITIAL_LOGS;
  });

  // Verify whether credential is valid admin key or admin session
  const verifyFounderKey = useCallback((credential?: string): boolean => {
    if (isAdmin) return true;
    if (!credential) return false;
    const clean = credential.trim().toLowerCase();
    if (!clean) return false;
    if (clean === ADMIN_EMAIL.toLowerCase() || clean.includes('sougustavo000@gmail.com')) return true;
    if (firebaseUser?.email && isAdminEmail(firebaseUser.email)) return true;
    if (user?.email && isAdminEmail(user.email)) return true;
    return ADMIN_MASTER_KEYS.some(k => k.toLowerCase() === clean);
  }, [isAdmin, user, firebaseUser]);

  // Persist state changes
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    } catch {
      // Storage error
    }
  }, [state]);

  // Persist logs changes
  useEffect(() => {
    try {
      localStorage.setItem(LOGS_STORAGE_KEY, JSON.stringify(maintenanceLogs));
    } catch {
      // Storage error
    }
  }, [maintenanceLogs]);

  const addMaintenanceLog = useCallback((newLog: Omit<MaintenanceLog, 'id' | 'timestamp'>) => {
    const entry: MaintenanceLog = {
      ...newLog,
      id: `log-${Date.now()}-${Math.random().toString(36).substr(2, 6)}`,
      timestamp: Date.now()
    };
    setMaintenanceLogs(prev => [entry, ...prev.slice(0, 49)]); // Keep last 50 logs
  }, []);

  const clearMaintenanceLogs = useCallback(() => {
    if (!isAdmin) return;
    setMaintenanceLogs([]);
    try {
      localStorage.removeItem(LOGS_STORAGE_KEY);
    } catch {}
  }, [isAdmin]);

  const activateMaintenance = useCallback((
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

    // Record in Maintenance Logs
    addMaintenanceLog({
      action: 'activate',
      actionLabel: 'Modo de Manutenção Ativado',
      reason: finalReason,
      estimatedMinutes: Math.max(5, duration),
      executedBy: executorName,
      executorEmail,
      executorRole: 'Administrador',
      details: `Serviço bloqueado para visitantes. Motivo: "${finalReason}". Previsão de retorno: ${Math.max(5, duration)} minutos.`
    });

    return {
      success: true,
      message: 'Modo de Manutenção ATIVADO com sucesso. O portal agora exibe a tela de manutenção e logs registrados.'
    };
  }, [isAdmin, verifyFounderKey, user, firebaseUser, addMaintenanceLog]);

  const deactivateMaintenance = useCallback((credential: string = '') => {
    const isValid = isAdmin || verifyFounderKey(credential);
    if (!isValid) {
      return {
        success: false,
        message: 'Acesso Negado. Chave ou credenciais de Administrador inválidas.'
      };
    }

    const executorName = user?.name || firebaseUser?.displayName || 'Gustavo Peixoto (Administrador)';
    const executorEmail = user?.email || firebaseUser?.email || ADMIN_EMAIL;

    setState({
      isActive: false,
      reason: 'Operação Normal',
      activatedAt: null,
      estimatedMinutes: 0,
      activatedBy: ''
    });

    setIsFounderBypassing(false);
    try {
      localStorage.removeItem(BYPASS_STORAGE_KEY);
    } catch {}

    // Record in Maintenance Logs
    addMaintenanceLog({
      action: 'deactivate',
      actionLabel: 'Modo de Manutenção Desativado',
      reason: 'Restauração de Operação Normal',
      estimatedMinutes: 0,
      executedBy: executorName,
      executorEmail,
      executorRole: 'Administrador',
      details: 'Acesso restabelecido para todos os utilizadores e tráfego liberado.'
    });

    return {
      success: true,
      message: 'Modo de Manutenção DESATIVADO. O portal Gustavo Tec foi restaurado para todos os utilizadores!'
    };
  }, [isAdmin, verifyFounderKey, user, firebaseUser, addMaintenanceLog]);

  const toggleFounderBypass = useCallback(() => {
    if (!isAdmin) return;
    setIsFounderBypassing(prev => {
      const next = !prev;
      try {
        localStorage.setItem(BYPASS_STORAGE_KEY, String(next));
      } catch {}

      addMaintenanceLog({
        action: next ? 'bypass_on' : 'bypass_off',
        actionLabel: next ? 'Bypass de Administrador Ligado' : 'Bypass de Administrador Desligado',
        executedBy: user?.name || firebaseUser?.displayName || 'Gustavo Peixoto (Administrador)',
        executorEmail: user?.email || firebaseUser?.email || ADMIN_EMAIL,
        executorRole: 'Administrador',
        details: next 
          ? 'Administrador visualizando o portal normalmente enquanto o público vê a tela de manutenção.'
          : 'Bypass finalizado.'
      });

      return next;
    });
  }, [isAdmin, user, firebaseUser, addMaintenanceLog]);

  return (
    <MaintenanceContext.Provider
      value={{
        isMaintenanceActive: state.isActive,
        maintenanceReason: state.reason,
        estimatedMinutes: state.estimatedMinutes,
        activatedAt: state.activatedAt,
        isFounderBypassing,
        isAdmin,
        isFounder: isAdmin, // Alias for backward compatibility
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

export const useMaintenance = (): MaintenanceContextType => {
  const context = useContext(MaintenanceContext);
  if (!context) {
    throw new Error('useMaintenance deve ser utilizado dentro de um MaintenanceProvider');
  }
  return context;
};
