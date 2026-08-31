import React, { useState } from 'react';
import { useNews } from '../context/NewsContext';
import { useAuth } from '../context/AuthContext';
import { 
  Send, 
  MessageSquare, 
  Flame, 
  Sparkles, 
  Heart, 
  Rocket, 
  Brain, 
  ShieldCheck, 
  CornerDownRight,
  Smile,
  UserCheck
} from 'lucide-react';

interface CommentsSectionProps {
  newsId: string;
}

export const CommentsSection: React.FC<CommentsSectionProps> = ({ newsId }) => {
  const { comments, addComment, reactToComment } = useNews();
  const { user, isAuthenticated } = useAuth();
  
  const [commentText, setCommentText] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [replyingTo, setReplyingTo] = useState<string | null>(null);

  const articleComments = comments[newsId] || [];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!commentText.trim() || isSubmitting) return;

    setIsSubmitting(true);
    addComment(newsId, commentText);
    setCommentText('');
    setReplyingTo(null);
    setIsSubmitting(false);
  };

  const handleQuickReaction = (text: string) => {
    setCommentText(prev => (prev ? `${prev} ${text}` : text));
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-slate-800 pb-3">
        <div className="flex items-center gap-2">
          <div className="p-1.5 rounded-lg bg-cyan-500/10 text-cyan-400">
            <MessageSquare className="w-4 h-4" />
          </div>
          <h3 className="font-bold text-slate-100 text-base sm:text-lg">
            Comentários em Tempo Real
          </h3>
          <span className="text-xs font-mono font-bold bg-slate-800 text-cyan-400 px-2 py-0.5 rounded-full border border-slate-700">
            {articleComments.length}
          </span>
        </div>

        <div className="flex items-center gap-1.5 text-xs text-slate-400 font-mono">
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
          <span>Ao Vivo</span>
        </div>
      </div>

      {/* Comment Form Composer */}
      <form onSubmit={handleSubmit} className="bg-slate-900/90 border border-slate-800 rounded-2xl p-4 space-y-3 shadow-inner">
        {/* User identification strip */}
        <div className="flex items-center justify-between text-xs text-slate-400">
          <div className="flex items-center gap-2">
            <img
              src={user ? user.avatar : 'https://api.dicebear.com/7.x/bottts/svg?seed=guest'}
              alt={user ? user.name : 'Visitante'}
              referrerPolicy="no-referrer"
              className="w-6 h-6 rounded-full ring-1 ring-cyan-500/50 object-cover"
            />
            <span className="text-slate-200 font-semibold">
              {user ? user.name : 'Visitante Tech'}
            </span>
            {user && (
              <span className="text-[10px] bg-cyan-950 text-cyan-300 px-1.5 py-0.2 rounded border border-cyan-800">
                {user.role}
              </span>
            )}
          </div>
          <span className="text-[11px] text-slate-500 font-mono">
            {commentText.length}/500
          </span>
        </div>

        {/* Textarea */}
        <div className="relative">
          <textarea
            value={commentText}
            onChange={e => setCommentText(e.target.value)}
            maxLength={500}
            rows={3}
            placeholder={
              user
                ? `O que você acha dessa tecnologia, ${user.name.split(' ')[0]}? Escreva seu comentário...`
                : 'Compartilhe sua opinião técnica com a comunidade do Gustavo Tec...'
            }
            className="w-full bg-slate-950 border border-slate-800 focus:border-cyan-500 rounded-xl p-3 text-xs sm:text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:ring-1 focus:ring-cyan-500/50 resize-none transition-all"
          />
        </div>

        {/* Action bar with Quick emoji reaction chips & Send */}
        <div className="flex items-center justify-between gap-2 pt-1">
          <div className="flex items-center gap-1.5 overflow-x-auto">
            <span className="text-[11px] text-slate-500 hidden sm:inline">Rápido:</span>
            {['🔥 Sensacional', '🤯 Revolucionário', '🚀 Testar agora', '💻 Código limpo', '⚡ 10s Live'].map(chip => (
              <button
                key={chip}
                type="button"
                onClick={() => handleQuickReaction(chip)}
                className="text-[11px] bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white px-2 py-1 rounded-lg border border-slate-700/80 transition-colors whitespace-nowrap cursor-pointer"
              >
                {chip}
              </button>
            ))}
          </div>

          <button
            type="submit"
            disabled={!commentText.trim() || isSubmitting}
            className="flex items-center gap-1.5 px-4 py-2 bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 disabled:opacity-40 disabled:cursor-not-allowed text-slate-950 font-bold rounded-xl text-xs sm:text-sm transition-all shadow-md shadow-cyan-500/20 shrink-0 cursor-pointer"
          >
            <Send className="w-3.5 h-3.5" />
            <span>Publicar</span>
          </button>
        </div>
      </form>

      {/* Live Comments List */}
      <div className="space-y-3.5">
        {articleComments.length === 0 ? (
          <div className="text-center py-8 bg-slate-900/40 rounded-2xl border border-slate-800/80 p-6">
            <MessageSquare className="w-8 h-8 text-slate-600 mx-auto mb-2" />
            <p className="text-slate-400 text-sm font-medium">
              Seja o primeiro a comentar nesta notícia em tempo real!
            </p>
            <p className="text-slate-500 text-xs mt-1">
              Participe da conversa da comunidade de desenvolvedores e entusiastas.
            </p>
          </div>
        ) : (
          articleComments.map(comment => (
            <div
              key={comment.id}
              className="bg-slate-900/70 border border-slate-800/80 rounded-2xl p-4 space-y-2.5 transition-all hover:border-slate-700"
            >
              {/* Comment Author Header */}
              <div className="flex items-center justify-between gap-2">
                <div className="flex items-center gap-2.5">
                  <img
                    src={comment.author.avatar}
                    alt={comment.author.name}
                    referrerPolicy="no-referrer"
                    className="w-8 h-8 rounded-full object-cover ring-1 ring-slate-700"
                  />
                  <div>
                    <div className="flex items-center gap-1.5">
                      <span className="text-xs sm:text-sm font-bold text-slate-200">
                        {comment.author.name}
                      </span>
                      <span className="text-[11px] text-slate-400 font-mono hidden sm:inline">
                        @{comment.author.username}
                      </span>
                      {comment.author.badge && (
                        <span className="text-[10px] bg-cyan-950 text-cyan-400 border border-cyan-800/60 px-1.5 py-0.2 rounded font-semibold">
                          {comment.author.badge}
                        </span>
                      )}
                    </div>
                    <div className="text-[10px] text-slate-500">
                      {comment.author.role}
                    </div>
                  </div>
                </div>

                <span className="text-[11px] text-slate-500 font-mono">
                  {comment.createdAt}
                </span>
              </div>

              {/* Comment Content Body */}
              <p className="text-xs sm:text-sm text-slate-300 leading-relaxed pl-10">
                {comment.content}
              </p>

              {/* Reactions & Actions bar */}
              <div className="flex items-center justify-between pl-10 pt-1 border-t border-slate-800/50">
                <div className="flex items-center gap-2">
                  {/* Like */}
                  <button
                    onClick={() => reactToComment(newsId, comment.id, 'like')}
                    className={`flex items-center gap-1 px-2 py-0.5 rounded-lg text-xs font-mono transition-colors cursor-pointer ${
                      comment.userLiked
                        ? 'bg-rose-500/20 text-rose-400 font-bold border border-rose-500/40'
                        : 'text-slate-400 hover:text-rose-400 hover:bg-slate-800'
                    }`}
                  >
                    <Heart className={`w-3 h-3 ${comment.userLiked ? 'fill-rose-400' : ''}`} />
                    <span>{comment.likes}</span>
                  </button>

                  {/* Fire */}
                  <button
                    onClick={() => reactToComment(newsId, comment.id, 'fire')}
                    className="flex items-center gap-1 px-2 py-0.5 rounded-lg text-xs font-mono text-slate-400 hover:text-amber-400 hover:bg-slate-800 transition-colors cursor-pointer"
                  >
                    <span>🔥</span>
                    <span>{comment.reactions?.fire || 0}</span>
                  </button>

                  {/* Brain */}
                  <button
                    onClick={() => reactToComment(newsId, comment.id, 'brain')}
                    className="flex items-center gap-1 px-2 py-0.5 rounded-lg text-xs font-mono text-slate-400 hover:text-purple-400 hover:bg-slate-800 transition-colors cursor-pointer"
                  >
                    <span>🧠</span>
                    <span>{comment.reactions?.brain || 0}</span>
                  </button>

                  {/* Rocket */}
                  <button
                    onClick={() => reactToComment(newsId, comment.id, 'rocket')}
                    className="flex items-center gap-1 px-2 py-0.5 rounded-lg text-xs font-mono text-slate-400 hover:text-cyan-400 hover:bg-slate-800 transition-colors cursor-pointer"
                  >
                    <span>🚀</span>
                    <span>{comment.reactions?.rocket || 0}</span>
                  </button>
                </div>

                <button
                  onClick={() => {
                    setCommentText(`@${comment.author.username} `);
                  }}
                  className="text-xs text-slate-400 hover:text-cyan-300 flex items-center gap-1 transition-colors cursor-pointer"
                >
                  <CornerDownRight className="w-3 h-3" />
                  <span>Responder</span>
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};
