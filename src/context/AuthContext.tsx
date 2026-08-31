import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  User as FirebaseUser,
  signInWithPopup,
  signInWithRedirect,
  getRedirectResult,
  signOut as firebaseSignOut,
  onAuthStateChanged
} from 'firebase/auth';
import { auth, googleProvider } from '../lib/firebase';
import { UserProfile, TechCategory, UserRole } from '../types';

interface AuthContextType {
  user: UserProfile | null;
  firebaseUser: FirebaseUser | null;
  isAuthenticated: boolean;
  loginWithGoogle: () => Promise<void>;
  login: (email: string, name?: string, role?: UserRole) => void;
  logout: () => Promise<void>;
  updateProfile: (updated: Partial<UserProfile>) => void;
  toggleBookmark: (newsId: string) => void;
  isBookmarked: (newsId: string) => boolean;
  toggleSound: () => void;
  toggleNotifications: () => void;
  loginAsGuest: () => void;
  loginAsGustavo: () => void;
  authError: string | null;
  isAuthLoading: boolean;
  clearAuthError: () => void;
}

export const GUSTAVO_PHOTO = '/gustavo_peixoto.jpg';
export const FOUNDER_EMAIL = 'sougustavo000@gmail.com';

export const isFounderEmail = (email?: string | null): boolean => {
  if (!email) return false;
  return email.toLowerCase().trim() === FOUNDER_EMAIL.toLowerCase();
};

const DEFAULT_GUSTAVO_USER: UserProfile = {
  id: 'usr-gustavo-peixoto',
  name: 'Gustavo Peixoto',
  username: 'gustavopeixoto',
  email: FOUNDER_EMAIL,
  avatar: GUSTAVO_PHOTO,
  role: 'Fundador & Admin',
  bio: 'Criador e Fundador Oficial do Gustavo Tec. Apaixonado por IA de ponta, computação quântica, hardware e tecnologias emergentes em tempo real.',
  location: 'Portugal & Brasil 🇵🇹🇧🇷',
  techStack: ['TypeScript', 'React 19', 'Next.js', 'Python', 'PyTorch', 'Rust', 'WebAssembly', 'TailwindCSS'],
  badges: ['👑 Fundador', '⚡ Tech Pioneer', '🤖 AI Explorer', '🛡️ Security Pro', '✅ Criador Verificado'],
  favoriteCategories: ['Inteligência Artificial', 'Hardware & Chips', 'Dev & Open Source', 'Cibersegurança'],
  joinedAt: 'Fundador & Criador',
  accentColor: '#06b6d4',
  notificationsEnabled: true,
  soundEnabled: true,
  bookmarkedNewsIds: ['news-1', 'news-4'],
  commentsCount: 0,
  likesCount: 0
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const LOCAL_STORAGE_KEY = 'gustavo_peixoto_user_session_v5';

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [firebaseUser, setFirebaseUser] = useState<FirebaseUser | null>(null);
  const [authError, setAuthError] = useState<string | null>(null);
  const [isAuthLoading, setIsAuthLoading] = useState(true);

  const [user, setUser] = useState<UserProfile | null>(() => {
    try {
      const saved = localStorage.getItem(LOCAL_STORAGE_KEY);
      if (saved) {
        const parsed: UserProfile = JSON.parse(saved);
        // Security check: only sougustavo000@gmail.com can possess Founder role/badges
        if (parsed.role === 'Fundador & Admin' || parsed.badges?.includes('👑 Fundador')) {
          if (!isFounderEmail(parsed.email)) {
            parsed.role = 'Dev Full-Stack';
            parsed.badges = (parsed.badges || []).filter(b => !b.includes('Fundador'));
          }
        }
        return parsed;
      }
      return null;
    } catch {
      return null;
    }
  });

  // Sync Firebase Auth state
  useEffect(() => {
    // Check redirect login fallback
    getRedirectResult(auth)
      .then((result) => {
        if (result?.user) {
          console.log('Autenticado com sucesso via redirecionamento Google:', result.user.email);
        }
      })
      .catch((err) => {
        console.warn('Redirect login result warning:', err);
      });

    const unsubscribe = onAuthStateChanged(auth, (currentFbUser) => {
      setFirebaseUser(currentFbUser);
      if (currentFbUser) {
        const isFounder = isFounderEmail(currentFbUser.email);
        const googleName = currentFbUser.displayName || (isFounder ? 'Gustavo Peixoto' : currentFbUser.email?.split('@')[0] || 'Usuário Google');
        const googleHandle = currentFbUser.email ? currentFbUser.email.split('@')[0].toLowerCase().replace(/[^a-z0-9]/g, '_') : 'google_user';
        
        const googleProfile: UserProfile = {
          id: currentFbUser.uid,
          name: googleName,
          username: isFounder ? 'gustavopeixoto' : googleHandle,
          email: currentFbUser.email || (isFounder ? FOUNDER_EMAIL : 'google_user@gmail.com'),
          avatar: isFounder 
            ? (currentFbUser.photoURL || GUSTAVO_PHOTO) 
            : (currentFbUser.photoURL || `https://api.dicebear.com/7.x/bottts/svg?seed=${googleHandle}`),
          role: isFounder ? 'Fundador & Admin' : 'Dev Full-Stack',
          bio: isFounder 
            ? 'Criador e Fundador Oficial do Gustavo Tec. Apaixonado por IA de ponta e tecnologia em tempo real.'
            : 'Conectado via Conta Google no portal Gustavo Tec.',
          location: isFounder ? 'Portugal & Brasil 🇵🇹🇧🇷' : 'Google Verified User',
          techStack: isFounder 
            ? ['TypeScript', 'React 19', 'Next.js', 'Python', 'PyTorch', 'Rust', 'WebAssembly', 'TailwindCSS']
            : ['Inteligência Artificial', 'TypeScript', 'React', 'Cloud Services'],
          badges: isFounder 
            ? ['👑 Fundador', '⚡ Tech Pioneer', '🤖 AI Explorer', '🛡️ Security Pro', '✅ Criador Verificado']
            : ['✅ Google Verificado', '⚡ Tech Pioneer', '🤖 AI Explorer'],
          favoriteCategories: ['Todas', 'Inteligência Artificial', 'Dev & Open Source'],
          joinedAt: isFounder ? 'Fundador & Criador' : new Date().toLocaleDateString('pt-PT', { month: 'short', year: 'numeric' }),
          accentColor: isFounder ? '#06b6d4' : '#0ea5e9',
          notificationsEnabled: true,
          soundEnabled: true,
          bookmarkedNewsIds: ['news-1'],
          commentsCount: 0,
          likesCount: 0
        };

        setUser(googleProfile);
      }
      setIsAuthLoading(false);
    });

    return () => unsubscribe();
  }, []);

  // Save profile to local storage whenever it changes
  useEffect(() => {
    try {
      if (user) {
        localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(user));
      } else {
        localStorage.removeItem(LOCAL_STORAGE_KEY);
      }
    } catch (e) {
      console.warn('Failed to save user in storage:', e);
    }
  }, [user]);

  const loginWithGoogle = async () => {
    setAuthError(null);
    setIsAuthLoading(true);
    try {
      await signInWithPopup(auth, googleProvider);
    } catch (err: any) {
      console.error('Google Sign-In Error:', err);
      if (err.code === 'auth/unauthorized-domain') {
        const currentDomain = typeof window !== 'undefined' ? window.location.hostname : 'seu-dominio.vercel.app';
        setAuthError(`Domínio não autorizado no Firebase (${currentDomain}). Adicione este domínio no Firebase Console > Authentication > Settings > Authorized Domains.`);
      } else if (err.code === 'auth/popup-blocked' || err.code === 'auth/cancelled-popup-request') {
        try {
          await signInWithRedirect(auth, googleProvider);
          return;
        } catch (redirectErr: any) {
          setAuthError(redirectErr.message || 'Erro ao redirecionar para login Google.');
        }
      } else if (err.code === 'auth/popup-closed-by-user') {
        setAuthError('O login foi cancelado ao fechar a janela do Google.');
      } else {
        setAuthError(err.message || 'Falha ao autenticar com o Google.');
      }
    } finally {
      setIsAuthLoading(false);
    }
  };

  const login = (email: string, name?: string, role?: UserRole) => {
    const formattedUsername = (name || email.split('@')[0])
      .toLowerCase()
      .replace(/[^a-z0-9]/g, '_');

    const isFounder = isFounderEmail(email);

    // Enforce role security: Only sougustavo000@gmail.com can have Founder title
    let safeRole: UserRole = role || 'Entusiasta de Tecnologia';
    if (safeRole === 'Fundador & Admin' && !isFounder) {
      safeRole = 'Dev Full-Stack';
    } else if (isFounder) {
      safeRole = 'Fundador & Admin';
    }

    const newUser: UserProfile = {
      id: `usr-${Date.now()}`,
      name: name || (isFounder ? 'Gustavo Peixoto' : 'Usuário Tech'),
      username: formattedUsername,
      email,
      avatar: isFounder ? GUSTAVO_PHOTO : `https://api.dicebear.com/7.x/bottts/svg?seed=${formattedUsername}`,
      role: safeRole,
      bio: isFounder ? 'Criador e Fundador Oficial do Gustavo Tec.' : 'Explorando as últimas inovações tecnológicas no Gustavo Tec.',
      location: isFounder ? 'Portugal & Brasil 🇵🇹🇧🇷' : 'Brasil 🇧🇷',
      techStack: isFounder ? ['TypeScript', 'React 19', 'Next.js', 'Python', 'TailwindCSS'] : ['JavaScript', 'React', 'IA'],
      badges: isFounder ? ['👑 Fundador', '⚡ Tech Pioneer', '🤖 AI Explorer', '🛡️ Security Pro'] : ['🚀 Membro', '⚡ 10s Reader'],
      favoriteCategories: ['Inteligência Artificial', 'Hardware & Chips'],
      joinedAt: isFounder ? 'Fundador & Criador' : 'Membro Ativo',
      accentColor: '#06b6d4',
      notificationsEnabled: true,
      soundEnabled: true,
      bookmarkedNewsIds: [],
      commentsCount: 0,
      likesCount: 0
    };
    setUser(newUser);
  };

  const loginAsGustavo = async () => {
    // Check if the current Firebase authenticated user is indeed the founder
    if (firebaseUser && isFounderEmail(firebaseUser.email)) {
      setUser({
        ...DEFAULT_GUSTAVO_USER,
        id: firebaseUser.uid,
        email: firebaseUser.email || FOUNDER_EMAIL,
        avatar: firebaseUser.photoURL || GUSTAVO_PHOTO
      });
      setAuthError(null);
    } else {
      // Require real Google OAuth login with sougustavo000@gmail.com
      setAuthError('Acesso Restrito: Apenas a conta Google do Criador (sougustavo000@gmail.com) pode aceder à conta de Fundador. A iniciar autenticação Google...');
      try {
        await loginWithGoogle();
      } catch {
        setAuthError('Falha ao autenticar com o Google como Fundador.');
      }
    }
  };

  const loginAsGuest = () => {
    const guestId = Date.now().toString().slice(-4);
    setUser({
      id: `guest-${Date.now()}`,
      name: `Visitante Tech #${guestId}`,
      username: `visitante_${guestId}`,
      email: `visitante${guestId}@gustavotec.com`,
      avatar: `https://api.dicebear.com/7.x/bottts/svg?seed=guest${guestId}`,
      role: 'Entusiasta de Tecnologia',
      bio: 'Acompanhando novidades tech a cada 10s no Gustavo Tec.',
      techStack: ['Tech', 'IA'],
      badges: ['👀 Convidado'],
      favoriteCategories: ['Todas'],
      joinedAt: 'Sessão Convidado',
      accentColor: '#06b6d4',
      notificationsEnabled: true,
      soundEnabled: true,
      bookmarkedNewsIds: [],
      commentsCount: 0,
      likesCount: 0
    });
  };

  const logout = async () => {
    try {
      if (auth.currentUser) {
        await firebaseSignOut(auth);
      }
      setUser(null);
      setFirebaseUser(null);
    } catch (err: any) {
      console.error('Sign Out Error:', err);
      setUser(null);
    }
  };

  const updateProfile = (updated: Partial<UserProfile>) => {
    setUser(prev => (prev ? { ...prev, ...updated } : null));
  };

  const toggleBookmark = (newsId: string) => {
    setUser(prev => {
      if (!prev) return null;
      const isBookmarked = prev.bookmarkedNewsIds.includes(newsId);
      const newBookmarks = isBookmarked
        ? prev.bookmarkedNewsIds.filter(id => id !== newsId)
        : [...prev.bookmarkedNewsIds, newsId];
      return { ...prev, bookmarkedNewsIds: newBookmarks };
    });
  };

  const isBookmarked = (newsId: string) => {
    return user ? user.bookmarkedNewsIds.includes(newsId) : false;
  };

  const toggleSound = () => {
    setUser(prev => (prev ? { ...prev, soundEnabled: !prev.soundEnabled } : null));
  };

  const toggleNotifications = () => {
    setUser(prev => (prev ? { ...prev, notificationsEnabled: !prev.notificationsEnabled } : null));
  };

  const clearAuthError = () => setAuthError(null);

  return (
    <AuthContext.Provider
      value={{
        user,
        firebaseUser,
        isAuthenticated: !!user,
        loginWithGoogle,
        login,
        logout,
        updateProfile,
        toggleBookmark,
        isBookmarked,
        toggleSound,
        toggleNotifications,
        loginAsGuest,
        loginAsGustavo,
        authError,
        isAuthLoading,
        clearAuthError
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
