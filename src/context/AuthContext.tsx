import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  User as FirebaseUser,
  signInWithPopup,
  signInWithRedirect,
  getRedirectResult,
  signOut as firebaseSignOut,
  onAuthStateChanged
} from 'firebase/auth';
import { doc, setDoc, getDoc, updateDoc, onSnapshot } from 'firebase/firestore';
import { auth, googleProvider, db } from '../lib/firebase';
import { UserProfile, TechCategory, UserRole } from '../types';

interface AuthContextType {
  user: UserProfile | null;
  firebaseUser: FirebaseUser | null;
  isAuthenticated: boolean;
  isAdmin: boolean;
  loginWithEmail: (email: string, displayName?: string) => Promise<{ success: boolean; message: string }>;
  loginWithGoogle: () => Promise<void>;
  sendGmailOtp: (email: string) => Promise<{ success: boolean; message: string }>;
  verifyGmailOtp: (email: string, code: string) => Promise<{ success: boolean; message: string }>;
  logout: () => Promise<void>;
  updateProfile: (updated: Partial<UserProfile>) => Promise<void>;
  toggleBookmark: (newsId: string) => Promise<void>;
  isBookmarked: (newsId: string) => boolean;
  toggleSound: () => Promise<void>;
  toggleNotifications: () => Promise<void>;
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

export const getDeterministicUserId = (email: string): string => {
  const clean = email.toLowerCase().trim();
  if (isFounderEmail(clean)) return 'usr-gustavo-peixoto';
  return `usr_${clean.replace(/[^a-z0-9]/g, '_')}`;
};

export const DEFAULT_GUSTAVO_USER: UserProfile = {
  id: 'usr-gustavo-peixoto',
  name: 'Gustavo Peixoto',
  username: 'gustavopeixoto',
  email: ADMIN_EMAIL,
  avatar: GUSTAVO_PHOTO,
  role: 'Administrador',
  bio: 'Fundador & Administrador Geral do Gustavo Tec. Especialista em IA, Infraestrutura Cloud e Cibersegurança.',
  location: 'Portugal & Brasil 🇵🇹🇧🇷',
  techStack: ['TypeScript', 'React 19', 'Next.js', 'Python', 'PyTorch', 'Rust', 'WebAssembly', 'TailwindCSS'],
  badges: ['👑 Fundador', '🛡️ Administrador', '⚡ Tech Pioneer', '🤖 AI Explorer', '✅ Verificado'],
  favoriteCategories: ['Inteligência Artificial', 'Hardware & Chips', 'Dev & Open Source', 'Cibersegurança'],
  joinedAt: 'Fundação Ativa',
  accentColor: '#06b6d4',
  notificationsEnabled: true,
  soundEnabled: true,
  bookmarkedNewsIds: ['news-1', 'news-2', 'news-3'],
  commentsCount: 0,
  likesCount: 0
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const LOCAL_STORAGE_EMAIL_KEY = 'gustavo_tec_active_email_v1';
const LOCAL_STORAGE_SESSION_KEY = 'gustavo_peixoto_user_session_v9';

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [firebaseUser, setFirebaseUser] = useState<FirebaseUser | null>(null);
  const [authError, setAuthError] = useState<string | null>(null);
  const [isAuthLoading, setIsAuthLoading] = useState(false);

  // Initialize profile with cached session if available
  const [user, setUser] = useState<UserProfile | null>(() => {
    try {
      const saved = localStorage.getItem(LOCAL_STORAGE_SESSION_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (parsed && typeof parsed === 'object' && parsed.email) {
          return parsed;
        }
      }
      return null;
    } catch {
      return null;
    }
  });

  // Keep local storage session in sync
  useEffect(() => {
    try {
      if (user) {
        localStorage.setItem(LOCAL_STORAGE_SESSION_KEY, JSON.stringify(user));
        localStorage.setItem(LOCAL_STORAGE_EMAIL_KEY, user.email);
      } else {
        localStorage.removeItem(LOCAL_STORAGE_SESSION_KEY);
        localStorage.removeItem(LOCAL_STORAGE_EMAIL_KEY);
      }
    } catch (e) {
      console.warn('Local storage sync warning:', e);
    }
  }, [user]);

  // Real-time Firestore sync bound to the user's email-based document ID
  useEffect(() => {
    const savedEmail = user?.email || localStorage.getItem(LOCAL_STORAGE_EMAIL_KEY);
    if (!savedEmail) return;

    const docId = getDeterministicUserId(savedEmail);
    const userDocRef = doc(db, 'users', docId);

    const unsubscribe = onSnapshot(userDocRef, (docSnap) => {
      if (docSnap.exists()) {
        const firestoreData = docSnap.data() as Partial<UserProfile>;
        setUser((prev) => {
          if (!prev) {
            return {
              id: docId,
              name: firestoreData.name || savedEmail.split('@')[0],
              username: firestoreData.username || savedEmail.split('@')[0].replace(/[^a-z0-9]/g, '_'),
              email: savedEmail,
              avatar: firestoreData.avatar || (isFounderEmail(savedEmail) ? GUSTAVO_PHOTO : `https://api.dicebear.com/7.x/bottts/svg?seed=${savedEmail}`),
              role: (isFounderEmail(savedEmail) ? 'Administrador' : firestoreData.role || 'Entusiasta de Tecnologia') as UserRole,
              bio: firestoreData.bio || (isFounderEmail(savedEmail) ? 'Fundador & Administrador Chefe do Gustavo Tec.' : 'Membro da Comunidade Gustavo Tec.'),
              location: firestoreData.location || (isFounderEmail(savedEmail) ? 'Portugal & Brasil 🇵🇹🇧🇷' : 'Comunidade Global'),
              techStack: Array.isArray(firestoreData.techStack) ? firestoreData.techStack : ['Inteligência Artificial', 'Tech', 'React'],
              badges: Array.isArray(firestoreData.badges) ? firestoreData.badges : (isFounderEmail(savedEmail) ? DEFAULT_GUSTAVO_USER.badges : ['✉️ E-mail Verificado', '🚀 Membro']),
              favoriteCategories: Array.isArray(firestoreData.favoriteCategories) ? firestoreData.favoriteCategories : ['Todas', 'Inteligência Artificial', 'Dev & Open Source'],
              joinedAt: firestoreData.joinedAt || new Date().toLocaleDateString('pt-PT', { month: 'short', year: 'numeric' }),
              accentColor: firestoreData.accentColor || '#06b6d4',
              notificationsEnabled: firestoreData.notificationsEnabled ?? true,
              soundEnabled: firestoreData.soundEnabled ?? true,
              bookmarkedNewsIds: Array.isArray(firestoreData.bookmarkedNewsIds) ? firestoreData.bookmarkedNewsIds : ['news-1'],
              commentsCount: firestoreData.commentsCount || 0,
              likesCount: firestoreData.likesCount || 0
            };
          }

          // Merge any remote updates from Firestore (e.g. bookmarks or admin role promotion)
          return {
            ...prev,
            ...firestoreData,
            role: (isFounderEmail(savedEmail) ? 'Administrador' : firestoreData.role || prev.role) as UserRole,
            badges: Array.isArray(firestoreData.badges) ? firestoreData.badges : prev.badges,
            bookmarkedNewsIds: Array.isArray(firestoreData.bookmarkedNewsIds) ? firestoreData.bookmarkedNewsIds : prev.bookmarkedNewsIds
          };
        });
      }
    }, (err) => {
      console.warn('Firestore snapshot error for user doc:', err);
    });

    return () => unsubscribe();
  }, [user?.email]);

  // Sync Firebase Google Auth State
  useEffect(() => {
    getRedirectResult(auth)
      .then((result) => {
        if (result?.user) {
          console.log('Autenticado via Google Redirect:', result.user.email);
        }
      })
      .catch((err) => {
        console.warn('Redirect login result warning:', err);
      });

    const unsubscribe = onAuthStateChanged(auth, async (currentFbUser) => {
      setFirebaseUser(currentFbUser);
      if (currentFbUser?.email) {
        await loginWithEmail(currentFbUser.email, currentFbUser.displayName || undefined);
      }
    });

    return () => unsubscribe();
  }, []);

  /**
   * Primary Login Method: Directly by Email Address
   * Binds profile state and persistence to Firestore keyed strictly by email!
   */
  const loginWithEmail = async (email: string, displayName?: string): Promise<{ success: boolean; message: string }> => {
    setAuthError(null);
    setIsAuthLoading(true);

    try {
      const cleanEmail = email.trim().toLowerCase();
      if (!cleanEmail || !cleanEmail.includes('@') || !cleanEmail.includes('.')) {
        const err = 'Por favor, insira um endereço de e-mail válido (ex: seu.nome@gmail.com).';
        setAuthError(err);
        return { success: false, message: err };
      }

      const isGustavo = isFounderEmail(cleanEmail);
      const docId = getDeterministicUserId(cleanEmail);
      const emailPrefix = cleanEmail.split('@')[0];
      const cleanHandle = emailPrefix.replace(/[^a-z0-9]/g, '_');
      const resolvedName = displayName || (isGustavo ? 'Gustavo Peixoto' : emailPrefix);

      let assignedRole: UserRole = isGustavo ? 'Administrador' : 'Entusiasta de Tecnologia';
      let customBadges = isGustavo 
        ? ['👑 Fundador', '🛡️ Administrador', '⚡ Tech Pioneer', '🤖 AI Explorer', '✅ Verificado']
        : ['✉️ E-mail Verificado', '🚀 Membro'];
      let existingBookmarks: string[] = ['news-1'];
      let existingBio = isGustavo 
        ? 'Fundador & Administrador Geral do Gustavo Tec. Especialista em IA, Infraestrutura Cloud e Cibersegurança.'
        : `Membro verificado da comunidade Gustavo Tec (${cleanEmail}).`;
      let existingTechStack = isGustavo 
        ? ['TypeScript', 'React 19', 'Next.js', 'Python', 'PyTorch', 'Rust', 'WebAssembly', 'TailwindCSS']
        : ['Inteligência Artificial', 'Dev & Open Source', 'Tecnologia'];
      let existingJoined = new Date().toLocaleDateString('pt-PT', { month: 'short', year: 'numeric' });

      // Fetch or sync with Firestore by Email Document ID
      try {
        const userDocRef = doc(db, 'users', docId);
        const userSnap = await getDoc(userDocRef);

        if (userSnap.exists()) {
          const remoteData = userSnap.data();
          if (remoteData.role) assignedRole = isGustavo ? 'Administrador' : (remoteData.role as UserRole);
          if (Array.isArray(remoteData.badges)) customBadges = remoteData.badges;
          if (Array.isArray(remoteData.bookmarkedNewsIds)) existingBookmarks = remoteData.bookmarkedNewsIds;
          if (remoteData.bio) existingBio = remoteData.bio;
          if (Array.isArray(remoteData.techStack)) existingTechStack = remoteData.techStack;
          if (remoteData.joinedAt) existingJoined = remoteData.joinedAt;
        }
      } catch (firestoreErr) {
        console.warn('Firestore user fetch notice:', firestoreErr);
      }

      const profile: UserProfile = {
        id: docId,
        name: isGustavo ? 'Gustavo Peixoto' : (resolvedName || emailPrefix),
        username: isGustavo ? 'gustavopeixoto' : cleanHandle,
        email: cleanEmail,
        avatar: isGustavo ? GUSTAVO_PHOTO : `https://api.dicebear.com/7.x/bottts/svg?seed=${cleanHandle}`,
        role: assignedRole,
        bio: existingBio,
        location: isGustavo ? 'Portugal & Brasil 🇵🇹🇧🇷' : 'Comunidade Global',
        techStack: existingTechStack,
        badges: customBadges,
        favoriteCategories: ['Todas', 'Inteligência Artificial', 'Dev & Open Source'],
        joinedAt: existingJoined,
        accentColor: '#06b6d4',
        notificationsEnabled: true,
        soundEnabled: true,
        bookmarkedNewsIds: existingBookmarks,
        commentsCount: 0,
        likesCount: 0
      };

      setUser(profile);
      localStorage.setItem(LOCAL_STORAGE_EMAIL_KEY, cleanEmail);
      localStorage.setItem(LOCAL_STORAGE_SESSION_KEY, JSON.stringify(profile));

      // Persist / update profile in Firestore
      try {
        await setDoc(doc(db, 'users', docId), {
          ...profile,
          lastLoginAt: Date.now(),
          authMethod: 'email_account'
        }, { merge: true });
      } catch (saveErr) {
        console.warn('Firestore profile persist notice:', saveErr);
      }

      return {
        success: true,
        message: isGustavo 
          ? '👑 Bem-vindo, Fundador & Administrador Gustavo Peixoto! Sessão administrativa ativada com sucesso.' 
          : `✅ Sessão iniciada com sucesso para ${cleanEmail}! Perfil e favoritos sincronizados via nuvem.`
      };
    } catch (err: any) {
      const msg = err.message || 'Erro ao efetuar login por e-mail.';
      setAuthError(msg);
      return { success: false, message: msg };
    } finally {
      setIsAuthLoading(false);
    }
  };

  const loginWithGoogle = async () => {
    setAuthError(null);
    setIsAuthLoading(true);
    try {
      const res = await signInWithPopup(auth, googleProvider);
      if (res.user?.email) {
        await loginWithEmail(res.user.email, res.user.displayName || undefined);
      }
    } catch (err: any) {
      console.error('Google Sign-In Error:', err);
      if (err.code === 'auth/popup-blocked' || err.code === 'auth/cancelled-popup-request') {
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

  const sendGmailOtp = async (email: string): Promise<{ success: boolean; message: string }> => {
    setAuthError(null);
    setIsAuthLoading(true);
    try {
      const cleanEmail = email.trim().toLowerCase();
      if (!cleanEmail.endsWith('@gmail.com')) {
        const errorMsg = 'Por favor, insira um e-mail do Gmail válido (@gmail.com).';
        setAuthError(errorMsg);
        return { success: false, message: errorMsg };
      }

      const res = await fetch('/api/auth/send-gmail-code', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: cleanEmail })
      });

      const data = await res.json();
      if (!res.ok || !data.success) {
        const msg = data.message || 'Erro ao processar código de verificação.';
        setAuthError(msg);
        return { success: false, message: msg };
      }

      return {
        success: true,
        message: data.message
      };
    } catch (err: any) {
      const msg = err.message || 'Erro de conexão ao enviar código pelo Bot Gustavo Tec.';
      setAuthError(msg);
      return { success: false, message: msg };
    } finally {
      setIsAuthLoading(false);
    }
  };

  const verifyGmailOtp = async (email: string, code: string): Promise<{ success: boolean; message: string }> => {
    setAuthError(null);
    setIsAuthLoading(true);
    try {
      const cleanEmail = email.trim().toLowerCase();
      const cleanCode = code.trim();

      const res = await fetch('/api/auth/verify-gmail-code', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: cleanEmail, code: cleanCode })
      });

      const data = await res.json();
      if (!res.ok || !data.success) {
        const msg = data.message || 'Código de verificação incorreto ou expirado.';
        setAuthError(msg);
        return { success: false, message: msg };
      }

      // Log in with email to load/persist profile
      return await loginWithEmail(cleanEmail);
    } catch (err: any) {
      const msg = err.message || 'Erro ao validar código com o servidor.';
      setAuthError(msg);
      return { success: false, message: msg };
    } finally {
      setIsAuthLoading(false);
    }
  };

  const logout = async () => {
    try {
      if (auth.currentUser) {
        await firebaseSignOut(auth);
      }
      setUser(null);
      setFirebaseUser(null);
      localStorage.removeItem(LOCAL_STORAGE_SESSION_KEY);
      localStorage.removeItem(LOCAL_STORAGE_EMAIL_KEY);
    } catch (err: any) {
      console.error('Sign Out Error:', err);
      setUser(null);
      setFirebaseUser(null);
      localStorage.removeItem(LOCAL_STORAGE_SESSION_KEY);
      localStorage.removeItem(LOCAL_STORAGE_EMAIL_KEY);
    }
  };

  const updateProfile = async (updated: Partial<UserProfile>) => {
    setUser(prev => {
      if (!prev) return null;
      const merged = { ...prev, ...updated };
      return merged;
    });

    if (user?.id) {
      try {
        await setDoc(doc(db, 'users', user.id), {
          ...updated,
          updatedAt: Date.now()
        }, { merge: true });
      } catch (err) {
        console.warn('Firestore profile update error:', err);
      }
    }
  };

  const toggleBookmark = async (newsId: string) => {
    if (!user) return;
    const isBookmarked = user.bookmarkedNewsIds.includes(newsId);
    const newBookmarks = isBookmarked
      ? user.bookmarkedNewsIds.filter(id => id !== newsId)
      : [...user.bookmarkedNewsIds, newsId];

    setUser(prev => prev ? { ...prev, bookmarkedNewsIds: newBookmarks } : null);

    try {
      await updateDoc(doc(db, 'users', user.id), {
        bookmarkedNewsIds: newBookmarks,
        updatedAt: Date.now()
      });
    } catch (err) {
      console.warn('Firestore bookmark sync error:', err);
    }
  };

  const isBookmarked = (newsId: string) => {
    return user ? user.bookmarkedNewsIds.includes(newsId) : false;
  };

  const toggleSound = async () => {
    if (!user) return;
    const newVal = !user.soundEnabled;
    setUser(prev => (prev ? { ...prev, soundEnabled: newVal } : null));
    try {
      await updateDoc(doc(db, 'users', user.id), { soundEnabled: newVal });
    } catch (e) {
      console.warn('Sound preference sync error:', e);
    }
  };

  const toggleNotifications = async () => {
    if (!user) return;
    const newVal = !user.notificationsEnabled;
    setUser(prev => (prev ? { ...prev, notificationsEnabled: newVal } : null));
    try {
      await updateDoc(doc(db, 'users', user.id), { notificationsEnabled: newVal });
    } catch (e) {
      console.warn('Notification preference sync error:', e);
    }
  };

  const clearAuthError = () => setAuthError(null);

  const isAdmin = Boolean(
    (firebaseUser?.email && isAdminEmail(firebaseUser.email)) ||
    (user?.email && isAdminEmail(user.email) && user?.role === 'Administrador')
  );

  return (
    <AuthContext.Provider
      value={{
        user,
        firebaseUser,
        isAuthenticated: !!user,
        isAdmin,
        loginWithEmail,
        loginWithGoogle,
        sendGmailOtp,
        verifyGmailOtp,
        logout,
        updateProfile,
        toggleBookmark,
        isBookmarked,
        toggleSound,
        toggleNotifications,
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
