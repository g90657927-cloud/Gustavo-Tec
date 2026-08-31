import React, { useState, useEffect, useRef } from 'react';
import { useAuth, isFounderEmail, FOUNDER_EMAIL } from '../context/AuthContext';
import { useNotifications } from '../context/NotificationContext';
import { db } from '../lib/firebase';
import { 
  collection, 
  query, 
  orderBy, 
  limit, 
  onSnapshot, 
  addDoc, 
  deleteDoc, 
  doc, 
  serverTimestamp,
  updateDoc,
  increment
} from 'firebase/firestore';
import { OnlineChatMessage } from '../types';
import { 
  Send, 
  MessageSquare, 
  Lock, 
  UserCheck, 
  Sparkles, 
  Trash2, 
  Heart, 
  Reply, 
  Users, 
  Wifi, 
  ShieldCheck, 
  Radio, 
  RefreshCw,
  Info
} from 'lucide-react';

interface OnlineChatViewProps {
  onOpenAuth?: () => void;
  onOpenLoginView?: () => void;
}

export const OnlineChatView: React.FC<OnlineChatViewProps> = ({ onOpenAuth, onOpenLoginView }) => {
  const { user, isAuthenticated, loginWithGoogle } = useAuth();
  const { sendAlert } = useNotifications();
  
  const [messages, setMessages] = useState<OnlineChatMessage[]>([]);
  const [inputText, setInputText] = useState('');
  const [isSending, setIsSending] = useState(false);
  const [activeChannel, setActiveChannel] = useState<'geral' | 'redes' | 'ia_dev'>('geral');
  const [replyTarget, setReplyTarget] = useState<OnlineChatMessage | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const chatContainerRef = useRef<HTMLDivElement>(null);

  // Scroll to bottom smoothly when new message arrives
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  // Real-time Firestore sync with onSnapshot (Only genuine user messages from Firestore)
  useEffect(() => {
    let unsubscribe: () => void = () => {};

    try {
      const messagesRef = collection(db, 'online_messages');
      const q = query(messagesRef, orderBy('timestamp', 'desc'), limit(50));

      unsubscribe = onSnapshot(
        q,
        (snapshot) => {
          if (!snapshot.empty) {
            const fetchedList: OnlineChatMessage[] = snapshot.docs.map((docSnap) => {
              const data = docSnap.data();
              const ts = data.timestamp?.toMillis ? data.timestamp.toMillis() : (data.timestamp || Date.now());
              return {
                id: docSnap.id,
                userId: data.userId || 'guest',
                userName: data.userName || 'Utilizador',
                userAvatar: data.userAvatar || `https://api.dicebear.com/7.x/bottts/svg?seed=${docSnap.id}`,
                userRole: data.userRole || 'Membro da Comunidade',
                userBadge: data.userBadge,
                userEmail: data.userEmail,
                message: data.message || '',
                timestamp: ts,
                formattedTime: new Date(ts).toLocaleTimeString('pt-PT', { hour: '2-digit', minute: '2-digit' }),
                operatorTag: data.operatorTag || 'Banda Larga PT',
                likes: data.likes || 0,
                likedBy: data.likedBy || [],
                replyTo: data.replyTo || undefined
              };
            });

            // Reverse so oldest is top, newest is bottom
            setMessages(fetchedList.reverse());
          } else {
            // Clean empty state with zero fake/fabricated messages
            setMessages([]);
          }
        },
        (error) => {
          console.warn('Firestore real-time messages listener warning (fallback to clean state):', error);
        }
      );
    } catch (err) {
      console.warn('Could not attach Firestore listener:', err);
    }

    return () => {
      unsubscribe();
    };
  }, []);

  // Send new message (Restricted to logged-in users)
  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputText.trim()) return;

    if (!isAuthenticated || !user) {
      setErrorMsg('É necessário iniciar sessão com a sua conta Google para enviar mensagens online.');
      return;
    }

    setIsSending(true);
    setErrorMsg(null);

    const messageContent = inputText.trim();
    const isFounder = isFounderEmail(user.email);
    const safeRole = isFounder ? 'Fundador & Admin' : (user.role === 'Fundador & Admin' ? 'Dev Full-Stack' : user.role);
    const safeBadge = isFounder ? '👑 Fundador' : (user.badges?.[0]?.includes('Fundador') ? '⚡ Membro' : (user.badges?.[0] || '⚡ Membro'));
    const currentOpTag = isFounder ? 'Criador / Admin' : 'Rede Verificada PT';

    const newMsgData = {
      userId: user.id,
      userName: user.name,
      userAvatar: user.avatar,
      userRole: safeRole,
      userBadge: safeBadge,
      userEmail: user.email,
      message: messageContent,
      timestamp: serverTimestamp(),
      operatorTag: currentOpTag,
      likes: 0,
      likedBy: [],
      channel: activeChannel,
      replyTo: replyTarget ? {
        id: replyTarget.id,
        userName: replyTarget.userName,
        messageSnippet: replyTarget.message.slice(0, 45) + (replyTarget.message.length > 45 ? '...' : '')
      } : null
    };

    try {
      // 1. Optimistic local append
      const localMsg: OnlineChatMessage = {
        id: `msg-opt-${Date.now()}`,
        userId: user.id,
        userName: user.name,
        userAvatar: user.avatar,
        userRole: safeRole,
        userBadge: safeBadge,
        userEmail: user.email,
        message: messageContent,
        timestamp: Date.now(),
        formattedTime: 'Agora',
        operatorTag: currentOpTag,
        likes: 0,
        likedBy: [],
        replyTo: replyTarget ? {
          id: replyTarget.id,
          userName: replyTarget.userName,
          messageSnippet: replyTarget.message.slice(0, 45) + (replyTarget.message.length > 45 ? '...' : '')
        } : undefined
      };

      setMessages(prev => [...prev, localMsg]);
      setInputText('');
      setReplyTarget(null);
      setTimeout(scrollToBottom, 100);

      // 2. Persist to Firestore collection
      await addDoc(collection(db, 'online_messages'), newMsgData);

    } catch (err: any) {
      console.warn('Failed to push message to Firestore, kept in local session:', err);
    } finally {
      setIsSending(false);
    }
  };

  // Like message
  const handleLikeMessage = async (msgId: string) => {
    if (!isAuthenticated || !user) {
      if (onOpenAuth) onOpenAuth();
      return;
    }

    setMessages(prev => prev.map(m => {
      if (m.id === msgId) {
        const isLiked = m.likedBy?.includes(user.id);
        const newLikes = isLiked ? Math.max(0, (m.likes || 0) - 1) : (m.likes || 0) + 1;
        const newLikedBy = isLiked
          ? (m.likedBy || []).filter(uid => uid !== user.id)
          : [...(m.likedBy || []), user.id];
        return { ...m, likes: newLikes, likedBy: newLikedBy };
      }
      return m;
    }));

    try {
      const msgRef = doc(db, 'online_messages', msgId);
      await updateDoc(msgRef, {
        likes: increment(1)
      });
    } catch (e) {
      // Ignored for optimistic UI
    }
  };

  // Delete message (Owner or Creator/Admin only)
  const handleDeleteMessage = async (msgId: string, authorId: string) => {
    if (!isAuthenticated || !user) return;
    const isFounder = isFounderEmail(user.email);
    if (user.id !== authorId && !isFounder) return;

    setMessages(prev => prev.filter(m => m.id !== msgId));

    try {
      await deleteDoc(doc(db, 'online_messages', msgId));
    } catch (e) {
      console.warn('Failed to delete message:', e);
    }
  };

  return (
    <div className="space-y-6">
      
      {/* Top Header Card */}
      <div className="p-6 sm:p-8 rounded-3xl bg-slate-900/80 border border-white/10 shadow-2xl backdrop-blur-2xl relative overflow-hidden">
        
        {/* Glow ambient background */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-80 h-80 bg-blue-600/10 rounded-full blur-3xl pointer-events-none" />

        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 relative z-10">
          <div className="space-y-2">
            <div className="flex items-center gap-2.5">
              <span className="px-3 py-1 rounded-full text-xs font-mono font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-400/40 flex items-center gap-1.5 shadow-[0_0_10px_rgba(52,211,153,0.2)]">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
                <span>Chat em Direto</span>
              </span>
              <span className="px-2.5 py-1 rounded-full text-xs font-mono bg-cyan-500/15 text-cyan-300 border border-cyan-400/30 flex items-center gap-1">
                <ShieldCheck className="w-3.5 h-3.5" />
                <span>Mensagens Reais Verificadas</span>
              </span>
            </div>

            <h2 className="text-2xl sm:text-3xl font-black text-white tracking-tight flex items-center gap-3">
              <MessageSquare className="w-7 h-7 text-cyan-400" />
              <span>Mensagens Online & Comunidade Tech</span>
            </h2>
            <p className="text-xs sm:text-sm text-slate-400 max-w-2xl">
              Converse em direto com entusiastas de tecnologia, partilhe medições de velocidade, tire dúvidas de operadoras e debata novidades de tecnologia.
            </p>
          </div>

          {/* User status card */}
          <div className="flex items-center gap-3 bg-slate-950/70 border border-white/10 p-3 rounded-2xl">
            {isAuthenticated && user ? (
              <div className="flex items-center gap-2.5">
                <img
                  src={user.avatar}
                  alt={user.name}
                  className="w-10 h-10 rounded-xl object-cover ring-2 ring-emerald-400/50"
                  referrerPolicy="no-referrer"
                />
                <div className="text-left">
                  <div className="flex items-center gap-1.5">
                    <span className="text-xs font-bold text-white">{user.name}</span>
                    <span className="text-[10px] font-mono px-1.5 py-0.2 rounded bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                      Online
                    </span>
                  </div>
                  <span className="text-[11px] text-slate-400 font-mono block">
                    {user.role}
                  </span>
                </div>
              </div>
            ) : (
              <div className="flex items-center gap-2.5">
                <div className="w-10 h-10 rounded-xl bg-slate-800 border border-white/10 flex items-center justify-center text-slate-400">
                  <Lock className="w-5 h-5 text-amber-400" />
                </div>
                <div className="text-left">
                  <span className="text-xs font-bold text-amber-300 block">Modo Leitura</span>
                  <span className="text-[10px] text-slate-400">Faça login para escrever</span>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Channels / Filter Tabs */}
        <div className="flex flex-wrap gap-2 mt-6 pt-4 border-t border-white/10">
          {[
            { id: 'geral', label: '💬 Geral & Notícias Tech', count: messages.length },
            { id: 'redes', label: '📡 Operadoras & Redes (DIGI/MEO/Voda)', count: '10G / 5G' },
            { id: 'ia_dev', label: '⚡ Inteligência Artificial & Código', count: 'IA Live' }
          ].map(ch => (
            <button
              key={ch.id}
              onClick={() => setActiveChannel(ch.id as any)}
              className={`px-3.5 py-2 rounded-xl text-xs font-mono font-bold transition-all cursor-pointer flex items-center gap-2 ${
                activeChannel === ch.id
                  ? 'bg-cyan-500 text-slate-950 shadow-[0_0_15px_rgba(6,182,212,0.4)] border border-cyan-300'
                  : 'bg-slate-950/60 text-slate-400 hover:text-white hover:bg-slate-800/80 border border-white/10'
              }`}
            >
              <span>{ch.label}</span>
              <span className={`text-[10px] px-1.5 py-0.5 rounded-full ${
                activeChannel === ch.id ? 'bg-slate-950 text-cyan-300' : 'bg-slate-800 text-slate-400'
              }`}>
                {ch.count}
              </span>
            </button>
          ))}
        </div>
      </div>

      {/* Main Live Chat Window Container */}
      <div className="rounded-3xl bg-slate-900/80 border border-white/10 shadow-2xl backdrop-blur-2xl overflow-hidden flex flex-col h-[600px]">
        
        {/* Messages Stream Body */}
        <div 
          ref={chatContainerRef}
          className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-4 scroll-smooth"
        >
          {messages.length === 0 ? (
            <div className="h-full min-h-[320px] flex flex-col items-center justify-center text-center p-8 text-slate-400 space-y-4">
              <div className="w-16 h-16 rounded-3xl bg-slate-950/80 border border-white/10 flex items-center justify-center text-cyan-400 shadow-[0_0_30px_rgba(6,182,212,0.15)]">
                <MessageSquare className="w-8 h-8" />
              </div>
              <div className="space-y-1.5 max-w-md">
                <h4 className="text-base font-bold text-slate-200">Ainda não há mensagens online</h4>
                <p className="text-xs text-slate-400 leading-relaxed">
                  Todas as mensagens falsas e simuladas foram removidas. Este espaço agora transmite exclusivamente mensagens reais enviadas por utilizadores e pelo Fundador.
                </p>
              </div>
              {isAuthenticated ? (
                <p className="text-xs font-mono text-cyan-300 bg-cyan-950/40 border border-cyan-500/30 px-3.5 py-1.5 rounded-xl">
                  ✨ Tem a sessão iniciada! Escreva abaixo para enviar a primeira mensagem.
                </p>
              ) : (
                onOpenLoginView && (
                  <button
                    onClick={onOpenLoginView}
                    className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-slate-950 text-xs font-bold font-mono shadow-[0_0_20px_rgba(6,182,212,0.3)] transition-all cursor-pointer border border-cyan-300"
                  >
                    Fazer Login com Google para Enviar Mensagem
                  </button>
                )
              )}
            </div>
          ) : (
            messages.map((msg) => {
              const isCurrentUser = user && user.id === msg.userId;
              const hasLiked = user && msg.likedBy?.includes(user.id);

              return (
                <div
                  key={msg.id}
                  className={`flex gap-3 sm:gap-4 items-start group ${
                    isCurrentUser ? 'flex-row-reverse' : 'flex-row'
                  }`}
                >
                  {/* User Avatar */}
                  <img
                    src={msg.userAvatar}
                    alt={msg.userName}
                    className="w-8 h-8 sm:w-10 sm:h-10 rounded-2xl object-cover ring-2 ring-white/10 shrink-0 shadow-md"
                    referrerPolicy="no-referrer"
                  />

                  {/* Message Bubble Container */}
                  <div className={`max-w-[85%] sm:max-w-xl space-y-1.5 ${
                    isCurrentUser ? 'items-end text-right' : 'items-start text-left'
                  }`}>
                    
                    {/* Header info */}
                    <div className={`flex flex-wrap items-center gap-1.5 text-xs font-mono ${
                      isCurrentUser ? 'justify-end' : 'justify-start'
                    }`}>
                      <span className="font-bold text-slate-200">{msg.userName}</span>
                      {isFounderEmail(msg.userEmail) ? (
                        <span className="px-1.5 py-0.2 rounded text-[10px] bg-gradient-to-r from-amber-500/20 via-cyan-500/20 to-blue-500/20 text-amber-300 border border-amber-400/40 shadow-[0_0_8px_rgba(245,158,11,0.2)] font-bold">
                          👑 Fundador Oficial
                        </span>
                      ) : (
                        msg.userBadge && !msg.userBadge.includes('Fundador') && (
                          <span className="px-1.5 py-0.2 rounded text-[10px] bg-cyan-500/20 text-cyan-300 border border-cyan-400/30">
                            {msg.userBadge}
                          </span>
                        )
                      )}
                      {msg.operatorTag && (
                        <span className="px-1.5 py-0.2 rounded text-[10px] bg-slate-800 text-slate-400 border border-white/10">
                          {msg.operatorTag}
                        </span>
                      )}
                      <span className="text-[11px] text-slate-500">{msg.formattedTime}</span>
                    </div>

                    {/* Reply Quoted Preview */}
                    {msg.replyTo && (
                      <div className={`p-2 rounded-xl text-xs font-mono border ${
                        isCurrentUser 
                          ? 'bg-cyan-950/40 border-cyan-500/30 text-cyan-200' 
                          : 'bg-slate-950/60 border-white/10 text-slate-300'
                      }`}>
                        <span className="font-bold block text-[10px] text-slate-400">Em resposta a @{msg.replyTo.userName}:</span>
                        <p className="truncate italic">{msg.replyTo.messageSnippet}</p>
                      </div>
                    )}

                    {/* Bubble Body */}
                    <div className={`p-3.5 sm:p-4 rounded-2xl text-xs sm:text-sm leading-relaxed break-words shadow-lg border ${
                      isCurrentUser
                        ? 'bg-gradient-to-br from-cyan-600/30 via-blue-600/20 to-slate-900 border-cyan-400/40 text-slate-100'
                        : 'bg-slate-950/80 border-white/10 text-slate-200'
                    }`}>
                      <p className="whitespace-pre-wrap">{msg.message}</p>
                    </div>

                    {/* Actions: Reply, Like, Delete */}
                    <div className={`flex items-center gap-2 pt-0.5 text-xs text-slate-400 ${
                      isCurrentUser ? 'justify-end' : 'justify-start'
                    }`}>
                      <button
                        onClick={() => setReplyTarget(msg)}
                        className="hover:text-cyan-300 transition-colors flex items-center gap-1 text-[11px] cursor-pointer"
                        title="Responder"
                      >
                        <Reply className="w-3 h-3" />
                        <span>Responder</span>
                      </button>

                      <button
                        onClick={() => handleLikeMessage(msg.id)}
                        className={`hover:text-red-400 transition-colors flex items-center gap-1 text-[11px] cursor-pointer ${
                          hasLiked ? 'text-red-400 font-bold' : ''
                        }`}
                        title="Gostar da mensagem"
                      >
                        <Heart className={`w-3 h-3 ${hasLiked ? 'fill-red-400' : ''}`} />
                        <span>{msg.likes || 0}</span>
                      </button>

                      {(isCurrentUser || (user && user.role.includes('Admin'))) && (
                        <button
                          onClick={() => handleDeleteMessage(msg.id, msg.userId)}
                          className="hover:text-red-400 transition-colors text-[11px] text-slate-600 cursor-pointer p-0.5"
                          title="Eliminar mensagem"
                        >
                          <Trash2 className="w-3 h-3" />
                        </button>
                      )}
                    </div>

                  </div>
                </div>
              );
            })
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Reply Indicator Bar */}
        {replyTarget && (
          <div className="px-4 py-2 bg-slate-950 border-t border-cyan-500/30 flex items-center justify-between text-xs font-mono text-cyan-300">
            <div className="flex items-center gap-2 truncate">
              <Reply className="w-3.5 h-3.5 text-cyan-400" />
              <span>A responder a <strong className="text-white">@{replyTarget.userName}</strong>: &quot;{replyTarget.message.slice(0, 50)}...&quot;</span>
            </div>
            <button
              onClick={() => setReplyTarget(null)}
              className="text-slate-400 hover:text-white px-2 py-0.5 rounded cursor-pointer"
            >
              ✕ Cancelar
            </button>
          </div>
        )}

        {/* Error notification banner if any */}
        {errorMsg && (
          <div className="px-4 py-2 bg-red-950/80 border-t border-red-500/30 text-red-300 text-xs font-mono flex items-center justify-between">
            <span>{errorMsg}</span>
            <button onClick={() => setErrorMsg(null)} className="text-red-400 hover:text-white">✕</button>
          </div>
        )}

        {/* Chat Input or Authentication Gate */}
        <div className="p-4 bg-slate-950/90 border-t border-white/10 backdrop-blur-xl">
          {isAuthenticated && user ? (
            <form onSubmit={handleSendMessage} className="flex gap-2">
              <input
                type="text"
                value={inputText}
                onChange={e => setInputText(e.target.value)}
                placeholder="Escreva a sua mensagem online em tempo real..."
                maxLength={400}
                className="flex-1 bg-slate-900/80 border border-white/15 focus:border-cyan-400/70 rounded-2xl px-4 py-3 text-xs sm:text-sm text-slate-100 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-cyan-500/20 transition-all"
              />
              <button
                type="submit"
                disabled={isSending || !inputText.trim()}
                className="px-5 py-3 rounded-2xl bg-gradient-to-r from-cyan-500 via-blue-600 to-indigo-600 hover:from-cyan-400 hover:to-blue-500 text-white font-bold text-xs sm:text-sm flex items-center gap-2 shadow-[0_0_20px_rgba(6,182,212,0.35)] transition-all cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed"
              >
                <Send className="w-4 h-4" />
                <span className="hidden sm:inline">Enviar</span>
              </button>
            </form>
          ) : (
            /* Authentication Gate when user is NOT logged in */
            <div className="p-4 rounded-2xl bg-gradient-to-r from-cyan-950/40 via-blue-950/40 to-slate-900 border border-cyan-500/30 flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="flex items-center gap-3 text-center sm:text-left">
                <div className="w-10 h-10 rounded-xl bg-cyan-500/20 border border-cyan-400/40 flex items-center justify-center text-cyan-300 shrink-0">
                  <Lock className="w-5 h-5 text-cyan-400" />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-white font-mono flex items-center gap-1.5 justify-center sm:justify-start">
                    <span>Mensagem Online Ativa (É necessário estar logado)</span>
                  </h4>
                  <p className="text-xs text-slate-400">
                    Inicie sessão com a sua conta Google para participar no chat da comunidade em direto.
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2 shrink-0">
                <button
                  onClick={loginWithGoogle}
                  className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white font-bold text-xs font-mono shadow-[0_0_15px_rgba(6,182,212,0.4)] flex items-center gap-2 transition-all cursor-pointer"
                >
                  <svg className="w-3.5 h-3.5" viewBox="0 0 24 24">
                    <path fill="#ffffff" d="M23.745 12.27c0-.7-.06-1.4-.19-2.07H12v4.51h6.6c-.29 1.52-1.14 2.82-2.4 3.68v3.05h3.88c2.27-2.09 3.665-5.17 3.665-9.17z"/>
                    <path fill="#ffffff" d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.88-3.05c-1.08.72-2.45 1.16-4.05 1.16-3.12 0-5.77-2.1-6.72-4.93H1.25v3.15C3.26 21.36 7.36 24 12 24z"/>
                    <path fill="#ffffff" d="M5.28 14.27c-.25-.72-.38-1.49-.38-2.27s.13-1.55.38-2.27V6.58H1.25C.45 8.18 0 9.98 0 12s.45 3.82 1.25 5.42l4.03-3.15z"/>
                    <path fill="#ffffff" d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0 7.36 0 3.26 2.64 1.25 6.58l4.03 3.15c.95-2.83 3.6-4.98 6.72-4.98z"/>
                  </svg>
                  <span>Entrar com Google</span>
                </button>

                {onOpenLoginView && (
                  <button
                    onClick={onOpenLoginView}
                    className="px-3.5 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-mono font-bold transition-all cursor-pointer"
                  >
                    Outras Opções
                  </button>
                )}
              </div>
            </div>
          )}
        </div>

      </div>

    </div>
  );
};
