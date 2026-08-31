import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { UserRole } from '../types';
import { 
  X, 
  User, 
  Mail, 
  Sparkles, 
  Zap, 
  Shield, 
  Code, 
  Bot, 
  LogIn,
  Check,
  AlertCircle
} from 'lucide-react';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const ROLES: UserRole[] = [
  'Dev Full-Stack',
  'Engenheiro de IA',
  'Entusiasta de Tecnologia',
  'Analista de Segurança',
  'Especialista em Hardware',
  'Designer de Produto'
];

export const AuthModal: React.FC<AuthModalProps> = ({ isOpen, onClose }) => {
  const { 
    loginWithGoogle, 
    login, 
    loginAsGustavo, 
    loginAsGuest, 
    authError, 
    isAuthLoading, 
    clearAuthError 
  } = useAuth();

  const [mode, setMode] = useState<'login' | 'register'>('login');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [role, setRole] = useState<UserRole>('Entusiasta de Tecnologia');

  if (!isOpen) return null;

  const handleGoogleSignIn = async () => {
    clearAuthError();
    await loginWithGoogle();
    onClose();
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;

    login(email, name || undefined, role);
    onClose();
  };

  const handleGustavoSelect = () => {
    loginAsGustavo();
    onClose();
  };

  const handleGuestSelect = () => {
    loginAsGuest();
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-md">
      <div 
        className="relative w-full max-w-md bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 shadow-2xl shadow-cyan-950/40 space-y-6"
        onClick={e => e.stopPropagation()}
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition-colors cursor-pointer"
        >
          <X className="w-4 h-4" />
        </button>

        {/* Modal Header */}
        <div className="text-center space-y-2">
          <div className="inline-flex items-center justify-center w-12 h-12 rounded-2xl bg-cyan-500/10 border border-cyan-500/30 text-cyan-400 mb-1">
            <Zap className="w-6 h-6" />
          </div>
          <h2 className="text-xl sm:text-2xl font-black text-slate-100 tracking-tight">
            Entrar no Gustavo Tec
          </h2>
          <p className="text-xs sm:text-sm text-slate-400">
            Acesse para comentar, salvar artigos favoritos e interagir com o Gemini.
          </p>
        </div>

        {/* Auth Error Banner */}
        {authError && (
          <div className="bg-red-500/10 border border-red-500/30 rounded-xl p-3 text-xs text-red-300 flex items-center gap-2">
            <AlertCircle className="w-4 h-4 text-red-400 shrink-0" />
            <span>{authError}</span>
          </div>
        )}

        {/* Primary Google Login Button */}
        <div>
          <button
            onClick={handleGoogleSignIn}
            disabled={isAuthLoading}
            className="w-full py-3.5 px-4 bg-white hover:bg-slate-100 text-slate-900 font-bold rounded-2xl text-sm flex items-center justify-center gap-3 shadow-lg shadow-white/5 transition-all cursor-pointer border border-slate-200 disabled:opacity-60"
          >
            {/* Google SVG Icon */}
            <svg className="w-5 h-5 shrink-0" viewBox="0 0 24 24">
              <path
                fill="#4285F4"
                d="M23.745 12.27c0-.7-.06-1.4-.19-2.07H12v4.51h6.6c-.29 1.52-1.14 2.82-2.4 3.68v3.05h3.88c2.27-2.09 3.665-5.17 3.665-9.17z"
              />
              <path
                fill="#34A853"
                d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.88-3.05c-1.08.72-2.45 1.16-4.05 1.16-3.12 0-5.77-2.1-6.72-4.93H1.25v3.15C3.26 21.36 7.36 24 12 24z"
              />
              <path
                fill="#FBBC05"
                d="M5.28 14.27c-.25-.72-.38-1.49-.38-2.27s.13-1.55.38-2.27V6.58H1.25C.45 8.18 0 9.98 0 12s.45 3.82 1.25 5.42l4.03-3.15z"
              />
              <path
                fill="#EA4335"
                d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0 7.36 0 3.26 2.64 1.25 6.58l4.03 3.15c.95-2.83 3.6-4.98 6.72-4.98z"
              />
            </svg>
            <span>{isAuthLoading ? 'Autenticando...' : 'Entrar com Google (Gmail)'}</span>
          </button>
        </div>

        {/* Divider */}
        <div className="relative flex items-center justify-center">
          <div className="border-t border-slate-800 w-full"></div>
          <span className="bg-slate-900 px-3 text-[11px] text-slate-500 font-mono uppercase">
            ou perfis rápidos
          </span>
        </div>

        {/* Fast Profile Access */}
        <div className="space-y-2">
          <div className="grid grid-cols-2 gap-2">
            <button
              onClick={handleGustavoSelect}
              className="p-3 bg-slate-950 hover:bg-slate-800 border border-cyan-500/40 hover:border-cyan-400 rounded-xl text-left transition-all cursor-pointer group flex items-center gap-2.5"
            >
              <img
                src="/gustavo_peixoto.jpg"
                alt="Gustavo Peixoto"
                className="w-8 h-8 rounded-lg object-cover ring-1 ring-cyan-400"
                referrerPolicy="no-referrer"
              />
              <div>
                <div className="text-xs font-bold text-cyan-300 group-hover:text-cyan-200">Criador & Fundador</div>
                <div className="text-[10px] text-slate-400">sougustavo000@gmail.com</div>
              </div>
            </button>

            <button
              onClick={handleGuestSelect}
              className="p-3 bg-slate-950 hover:bg-slate-800 border border-slate-700 hover:border-slate-500 rounded-xl text-left transition-all cursor-pointer group flex items-center gap-2.5"
            >
              <div className="w-8 h-8 rounded-lg bg-slate-800 flex items-center justify-center text-slate-300 font-mono text-xs">
                👤
              </div>
              <div>
                <div className="text-xs font-bold text-slate-300 group-hover:text-slate-100">Visitante</div>
                <div className="text-[10px] text-slate-400">Sessão Rápida</div>
              </div>
            </button>
          </div>
        </div>

        {/* Custom Email Form */}
        <form onSubmit={handleSubmit} className="space-y-3 pt-1 border-t border-slate-800/80">
          <div>
            <label className="text-xs font-semibold text-slate-300 mb-1 block">
              Nome Completo
            </label>
            <div className="relative">
              <User className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
              <input
                type="text"
                value={name}
                onChange={e => setName(e.target.value)}
                placeholder="Ex: Gustavo Silva"
                className="w-full bg-slate-950 border border-slate-800 focus:border-cyan-500 rounded-xl pl-10 pr-4 py-2 text-xs sm:text-sm text-slate-100 placeholder-slate-600 focus:outline-none transition-all"
              />
            </div>
          </div>

          <div>
            <label className="text-xs font-semibold text-slate-300 mb-1 block">
              E-mail
            </label>
            <div className="relative">
              <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
              <input
                type="email"
                required
                value={email}
                onChange={e => setEmail(e.target.value)}
                placeholder="seu.email@exemplo.com"
                className="w-full bg-slate-950 border border-slate-800 focus:border-cyan-500 rounded-xl pl-10 pr-4 py-2 text-xs sm:text-sm text-slate-100 placeholder-slate-600 focus:outline-none transition-all"
              />
            </div>
          </div>

          <div>
            <label className="text-xs font-semibold text-slate-300 mb-1 block">
              Especialidade Tech
            </label>
            <select
              value={role}
              onChange={e => setRole(e.target.value as UserRole)}
              className="w-full bg-slate-950 border border-slate-800 text-slate-200 text-xs rounded-xl px-3 py-2 focus:outline-none focus:border-cyan-500"
            >
              {ROLES.map(r => (
                <option key={r} value={r}>
                  {r}
                </option>
              ))}
            </select>
          </div>

          <button
            type="submit"
            className="w-full py-2.5 bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-slate-950 font-bold rounded-xl text-xs sm:text-sm transition-all shadow-md shadow-cyan-500/20 cursor-pointer flex items-center justify-center gap-2 mt-2"
          >
            <LogIn className="w-4 h-4" />
            <span>Entrar com E-mail</span>
          </button>
        </form>

      </div>
    </div>
  );
};
