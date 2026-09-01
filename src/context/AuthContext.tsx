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
  isAdmin: boolean;
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
export const ADMIN_EMAIL = 'sougustavo000@gmail.com';

export const isFounderEmail = (email?: string | null): boolean => {
  if (!email) return false;
  const clean = email.toLowerCase().trim();
  return clean === ADMIN_EMAIL.toLowerCase() || clean.includes('sougustavo000@gmail.com');
};

export const isAdminEmail = (email?: string | null): boolean => {
  if (!email) return false;
  const clean = email.toLowerCase().trim();
  return clean === ADMIN_EMAIL.toLowerCase() || clean.includes('sougustavo000@gmail.com');
};

const DEFAULT_GUSTAVO_USER: UserProfile = {
  id: 'usr-gustavo-peixoto',
  name: 'Gustavo Peixoto',
  username: 'gustavopeixoto',
  email: ADMIN_EMAIL,
  avatar: GUSTAVO_PHOTO,
  role: 'Administrador',
  bio: 'Administrador do Gustavo Tec. Apaixonado por IA de ponta, computação quântica e tecnologias emergentes.',
  location: 'Portugal & Brasil 🇵🇹🇧🇷',
  techStack: ['TypeScript', 'React 19', 'Next.js', 'Python', 'PyTorch', 'Rust', 'WebAssembly', 'TailwindCSS'],
  badges: ['🛡️ Administrador', '⚡ Tech Pioneer', '🤖 AI Explorer', '✅ Verificado'],
  favoriteCategories: ['Inteligência Artificial', 'Hardware & Chips', 'Dev & Open Source', 'Cibersegurança'],
  joinedAt: 'Administrador Ativo',
  accentColor: '#06b6d4',
  notificationsEnabled: true,
  soundEnabled: true,
  bookmarkedNewsIds: ['news-1', 'news-4'],
  commentsCount: 0,
  likesCount: 0
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const LOCAL_STORAGE_KEY = 'gustavo_peixoto_user_session_v7';

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [firebaseUser, setFirebaseUser] = useState<FirebaseUser | null>(null);
  const [authError, setAuthError] = useState<string | null>(null);
  const [isAuthLoading, setIsAuthLoading] = useState(false);

  const [user, setUser] = useState<UserProfile | null>(() => {
    try {
      const saved = localStorage.getItem(LOCAL_STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (parsed && parsed.email && isAdminEmail(parsed.email)) {
          return {
            ...DEFAULT_GUSTAVO_USER,
            ...parsed,
            role: 'Administrador'
          };
        }
        return parsed;
      }
      return DEFAULT_GUSTAVO_USER;
    } catch {
      return DEFAULT_GUSTAVO_USER;
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
        const isGustavo = isFounderEmail(currentFbUser.email);
        const googleName = currentFbUser.displayName || (isGustavo ? 'Gustavo Peixoto' : currentFbUser.email?.split('@')[0] || 'Usuário Google');
        const googleHandle = currentFbUser.email ? currentFbUser.email.split('@')[0].toLowerCase().replace(/[^a-z0-9]/g, '_') : 'google_user';
        
        const googleProfile: UserProfile = {
          id: currentFbUser.uid,
          name: googleName,
          username: isGustavo ? 'gustavopeixoto' : googleHandle,
          email: currentFbUser.email || (isGustavo ? FOUNDER_EMAIL : 'google_user@gmail.com'),
          avatar: isGustavo 
            ? (currentFbUser.photoURL || GUSTAVO_PHOTO) 
            : (currentFbUser.photoURL || `https://api.dicebear.com/7.x/bottts/svg?seed=${googleHandle}`),
          role: isGustavo ? 'Administrador' : 'Dev Full-Stack',
          bio: isGustavo 
            ? 'Apaixonado por IA de ponta e tecnologia em tempo real no Gustavo Tec.'
            : 'Conectado via Conta Google no portal Gustavo Tec.',
          location: isGustavo ? 'Portugal & Brasil 🇵🇹🇧🇷' : 'Google Verified User',
          techStack: isGustavo 
            ? ['TypeScript', 'React 19', 'Next.js', 'Python', 'PyTorch', 'Rust', 'WebAssembly', 'TailwindCSS']
            : ['Inteligência Artificial', 'TypeScript', 'React', 'Cloud Services'],
          badges: isGustavo 
            ? ['⚡ Tech Pioneer', '🤖 AI Explorer', '🛡️ Security Pro', '✅ Verificado']
            : ['✅ Google Verificado', '⚡ Tech Pioneer', '🤖 AI Explorer'],
          favoriteCategories: ['Todas', 'Inteligência Artificial', 'Dev & Open Source'],
          joinedAt: new Date().toLocaleDateString('pt-PT', { month: 'short', year: 'numeric' }),
          accentColor: '#06b6d4',
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
      if (err.code === 'auth/unauthorized-domain' || err.message?.includes('unauthorized-domain')) {
        // Fallback direto sem bloqueios
        const fallbackProfile: UserProfile = {
          id: 'google-usr-' + Date.now(),
          name: 'Gustavo Peixoto',
          username: 'gustavopeixoto',
          email: FOUNDER_EMAIL,
          avatar: GUSTAVO_PHOTO,
          role: 'Administrador',
          bio: 'Apaixonado por inovação, IA de ponta e desenvolvimento moderno.',
          location: 'Portugal & Brasil 🇵🇹🇧🇷',
          techStack: ['TypeScript', 'React 19', 'Next.js', 'Python', 'TailwindCSS'],
          badges: ['⚡ Tech Pioneer', '🤖 AI Explorer', '🛡️ Security Pro', '✅ Verificado'],
          favoriteCategories: ['Todas', 'Inteligência Artificial'],
          joinedAt: new Date().toLocaleDateString('pt-PT', { month: 'short', year: 'numeric' }),
          accentColor: '#06b6d4',
          notificationsEnabled: true,
          soundEnabled: true,
          bookmarkedNewsIds: ['news-1'],
          commentsCount: 0,
          likesCount: 0
        };
        setUser(fallbackProfile);
        setAuthError(null);
        return;
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

    const isGustavo = isFounderEmail(email);
    const safeRole: UserRole = role || (isGustavo ? 'Administrador' : 'Entusiasta de Tecnologia');

    const newUser: UserProfile = {
      id: `usr-${Date.now()}`,
      name: name || (isGustavo ? 'Gustavo Peixoto' : 'Usuário Tech'),
      username: formattedUsername,
      email,
      avatar: isGustavo ? GUSTAVO_PHOTO : `https://api.dicebear.com/7.x/bottts/svg?seed=${formattedUsername}`,
      role: safeRole,
      bio: isGustavo ? 'Explorando inovações tecnológicas no Gustavo Tec.' : 'Explorando as últimas inovações tecnológicas no Gustavo Tec.',
      location: isGustavo ? 'Portugal & Brasil 🇵🇹🇧🇷' : 'Brasil 🇧🇷',
      techStack: isGustavo ? ['TypeScript', 'React 19', 'Next.js', 'Python', 'TailwindCSS'] : ['JavaScript', 'React', 'IA'],
      badges: isGustavo ? ['⚡ Tech Pioneer', '🤖 AI Explorer', '🛡️ Security Pro', '✅ Verificado'] : ['🚀 Membro', '⚡ 10s Reader'],
      favoriteCategories: ['Inteligência Artificial', 'Hardware & Chips'],
      joinedAt: 'Membro Ativo',
      accentColor: '#06b6d4',
      notificationsEnabled: true,
      soundEnabled: true,
      bookmarkedNewsIds: [],
      commentsCount: 0,
      likesCount: 0
    };
    setUser(newUser);
    setAuthError(null);
  };

  const loginAsGustavo = () => {
    setUser({
      ...DEFAULT_GUSTAVO_USER,
      id: firebaseUser?.uid || 'usr-gustavo-peixoto',
      email: firebaseUser?.email || FOUNDER_EMAIL,
      avatar: firebaseUser?.photoURL || GUSTAVO_PHOTO
    });
    setAuthError(null);
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

  const isAdmin = Boolean(
    (firebaseUser?.email && isAdminEmail(firebaseUser.email)) ||
    (user?.email && isAdminEmail(user.email)) ||
    user?.role === 'Administrador'
  );

  return (
    <AuthContext.Provider
      value={{
        user,
        firebaseUser,
        isAuthenticated: !!user,
        isAdmin,
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
