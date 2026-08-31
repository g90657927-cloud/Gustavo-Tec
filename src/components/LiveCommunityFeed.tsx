import React, { useState } from 'react';
import { useNews } from '../context/NewsContext';
import { useAuth } from '../context/AuthContext';
import { 
  MessageSquare, 
  Send, 
  Heart, 
  Users, 
  ExternalLink
} from 'lucide-react';

export const LiveCommunityFeed: React.FC = () => {
  const { allLiveComments, news, addComment, reactToComment, setSelectedNews } = useNews();
  const { user } = useAuth();
  
  const [selectedNewsId, setSelectedNewsId] = useState<string>(news[0]?.id || 'news-1');
  const [commentText, setCommentText] = useState('');

  const handlePostComment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!commentText.trim() || !selectedNewsId) return;

    addComment(selectedNewsId, commentText);
    setCommentText('');
  };

  return (
    <div className="space-y-6">
      {/* Header banner with liquid glass */}
      <div className="liquid-glass-card rounded-3xl p-5 sm:p-6 shadow-[0_8px_32px_rgba(0,0,0,0.5)]">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3.5">
            <div className="w-13 h-13 rounded-2xl bg-gradient-to-br from-cyan-500 to-blue-600 flex items-center justify-center text-white shadow-[0_0_20px_rgba(6,182,212,0.4)] shrink-0 border border-white/20">
              <MessageSquare className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-xl sm:text-2xl font-black text-slate-100 tracking-tight">
                  Comunidade Tech Ao Vivo
                </h2>
                <span className="flex items-center gap-1 text-[11px] font-mono bg-emerald-500/20 text-emerald-300 border border-emerald-400/40 px-2.5 py-0.5 rounded-full font-bold shadow-[0_0_10px_rgba(52,211,153,0.2)]">
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
                  STREAM
                </span>
              </div>
              <p className="text-xs sm:text-sm text-slate-300">
                Debates em tempo real, análises de código e opiniões sobre as notícias do Gustavo Tec.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 liquid-glass-subtle px-4 py-2.5 rounded-2xl text-xs font-mono text-slate-300 shrink-0 border border-white/10">
            <Users className="w-4 h-4 text-cyan-400" />
            <span>{allLiveComments.length} comentários registrados</span>
          </div>
        </div>
      </div>

      {/* Global Quick Post Widget */}
      <form onSubmit={handlePostComment} className="liquid-glass-card rounded-3xl p-5 space-y-3 shadow-lg">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs">
          <div className="flex items-center gap-2 text-slate-400">
            <img
              src={user ? user.avatar : 'https://api.dicebear.com/7.x/bottts/svg?seed=guest'}
              alt="Avatar"
              referrerPolicy="no-referrer"
              className="w-7 h-7 rounded-xl ring-2 ring-cyan-400/50 object-cover"
            />
            <span className="text-slate-200 font-semibold">{user ? user.name : 'Visitante'}</span>
            <span>comentando sobre:</span>
          </div>

          {/* Topic / Article selector */}
          <select
            value={selectedNewsId}
            onChange={e => setSelectedNewsId(e.target.value)}
            className="liquid-glass border border-white/10 text-slate-200 text-xs rounded-xl px-3 py-2 focus:outline-none focus:border-cyan-400/70 max-w-full sm:max-w-md truncate"
          >
            {news.map(item => (
              <option key={item.id} value={item.id} className="bg-slate-900 text-slate-200">
                [{item.category}] {item.title}
              </option>
            ))}
          </select>
        </div>

        <div className="flex gap-2.5">
          <input
            type="text"
            value={commentText}
            onChange={e => setCommentText(e.target.value)}
            placeholder="Escreva sua análise técnica para a comunidade..."
            className="flex-1 liquid-glass border border-white/10 focus:border-cyan-400/70 rounded-2xl px-5 py-3 text-xs sm:text-sm text-slate-100 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-cyan-500/20 transition-all shadow-[inset_0_1px_1px_rgba(255,255,255,0.06)]"
          />
          <button
            type="submit"
            disabled={!commentText.trim()}
            className="px-6 py-3 bg-gradient-to-r from-cyan-400 to-blue-600 hover:from-cyan-300 hover:to-blue-500 disabled:opacity-40 disabled:cursor-not-allowed text-slate-950 font-bold rounded-2xl text-xs sm:text-sm transition-all shadow-[0_0_20px_rgba(6,182,212,0.35)] flex items-center gap-1.5 shrink-0 cursor-pointer border border-white/20"
          >
            <Send className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Publicar</span>
          </button>
        </div>
      </form>

      {/* Real-time Community Stream List */}
      <div className="space-y-3">
        {allLiveComments.length === 0 ? (
          <div className="text-center py-16 liquid-glass-subtle rounded-3xl p-8 space-y-3 border border-white/5">
            <MessageSquare className="w-10 h-10 text-slate-500 mx-auto" />
            <h3 className="text-lg font-bold text-slate-200">Nenhum comentário registrado ainda</h3>
            <p className="text-sm text-slate-400 max-w-md mx-auto">
              Utilize o campo acima ou abra qualquer notícia do feed para compartilhar sua análise técnica em tempo real.
            </p>
          </div>
        ) : (
          allLiveComments.map(comment => {
            const associatedNews = news.find(n => n.id === comment.newsId);

            return (
              <div
                key={comment.id}
                className="liquid-glass hover:liquid-glass-active rounded-3xl p-5 transition-all space-y-3 shadow-md border border-white/10"
              >
                {/* Header: Author + News Ref + Timestamp */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                  <div className="flex items-center gap-3">
                    <img
                      src={comment.author.avatar}
                      alt={comment.author.name}
                      referrerPolicy="no-referrer"
                      className="w-10 h-10 rounded-2xl object-cover ring-2 ring-cyan-400/30 shadow-sm"
                    />
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-slate-100 text-sm">{comment.author.name}</span>
                        <span className="text-xs text-slate-400 font-mono">@{comment.author.username}</span>
                        {comment.author.badge && (
                          <span className="text-[10px] bg-cyan-950/80 text-cyan-300 border border-cyan-400/40 px-2.5 py-0.5 rounded-full font-semibold shadow-[0_0_10px_rgba(6,182,212,0.2)]">
                            {comment.author.badge}
                          </span>
                        )}
                      </div>
                      <div className="text-[11px] text-slate-400">{comment.author.role}</div>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 self-start sm:self-auto text-xs text-slate-400 font-mono">
                    <span>{comment.createdAt}</span>
                  </div>
                </div>

                {/* Associated Article Reference Tag */}
                {associatedNews && (
                  <div
                    onClick={() => setSelectedNews(associatedNews)}
                    className="flex items-center justify-between gap-2 px-3.5 py-2 liquid-glass-subtle hover:liquid-glass rounded-2xl cursor-pointer transition-all group border border-white/5"
                  >
                    <div className="flex items-center gap-2 text-xs truncate">
                      <span className="text-[10px] font-mono font-bold bg-white/10 text-cyan-300 px-2 py-0.5 rounded-lg shrink-0">
                        {associatedNews.category}
                      </span>
                      <span className="text-slate-300 group-hover:text-cyan-300 truncate font-medium">
                        {associatedNews.title}
                      </span>
                    </div>
                    <ExternalLink className="w-3.5 h-3.5 text-slate-400 group-hover:text-cyan-400 shrink-0" />
                  </div>
                )}

                {/* Comment Content */}
                <p className="text-xs sm:text-sm text-slate-200 leading-relaxed pl-1 sm:pl-3">
                  {comment.content}
                </p>

                {/* Reactions Bar */}
                <div className="flex items-center gap-3 pt-2.5 border-t border-white/10 text-xs">
                  <button
                    onClick={() => reactToComment(comment.newsId, comment.id, 'like')}
                    className={`flex items-center gap-1.5 px-3 py-1 rounded-xl font-mono transition-all cursor-pointer ${
                      comment.userLiked
                        ? 'bg-rose-500/20 text-rose-300 font-bold border border-rose-400/40 shadow-[0_0_10px_rgba(244,63,94,0.2)]'
                        : 'text-slate-400 hover:text-rose-300 liquid-glass-subtle'
                    }`}
                  >
                    <Heart className={`w-3.5 h-3.5 ${comment.userLiked ? 'fill-rose-400' : ''}`} />
                    <span>{comment.likes}</span>
                  </button>

                  <button
                    onClick={() => reactToComment(comment.newsId, comment.id, 'fire')}
                    className="flex items-center gap-1 px-3 py-1 rounded-xl text-slate-400 hover:text-amber-300 liquid-glass-subtle font-mono transition-all cursor-pointer"
                  >
                    <span>🔥</span>
                    <span>{comment.reactions?.fire || 0}</span>
                  </button>

                  <button
                    onClick={() => reactToComment(comment.newsId, comment.id, 'brain')}
                    className="flex items-center gap-1 px-3 py-1 rounded-xl text-slate-400 hover:text-purple-300 liquid-glass-subtle font-mono transition-all cursor-pointer"
                  >
                    <span>🧠</span>
                    <span>{comment.reactions?.brain || 0}</span>
                  </button>

                  <button
                    onClick={() => reactToComment(comment.newsId, comment.id, 'rocket')}
                    className="flex items-center gap-1 px-3 py-1 rounded-xl text-slate-400 hover:text-cyan-300 liquid-glass-subtle font-mono transition-all cursor-pointer"
                  >
                    <span>🚀</span>
                    <span>{comment.reactions?.rocket || 0}</span>
                  </button>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};

