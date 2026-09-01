import React, { useState, useRef, useEffect } from 'react';
import {
  ExternalLink,
  Sparkles,
  Send,
  Copy,
  Check,
  Maximize2,
  Minimize2,
  ArrowUpRight,
  User,
  Trash2,
  Lightbulb,
  Code2,
  Layers,
  Bot
} from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import { sendAiChatMessage } from '../lib/clientAiChat';

interface ChatMessage {
  id: string;
  role: 'user' | 'model';
  content: string;
  timestamp: string;
}

type ChatbotRole = 'general' | 'dev' | 'architect' | 'fast' | 'ai_tutor';

const GEMINI_URL = 'https://gemini.google.com';

const ROLE_PRESETS: {
  id: ChatbotRole;
  name: string;
  shortName: string;
  description: string;
  icon: string;
  color: string;
}[] = [
  {
    id: 'general',
    name: 'ChatBot Geral',
    shortName: 'Geral',
    description: 'Assistente versátil para todas as tarefas cotidianas e dúvidas de tecnologia',
    icon: '✨',
    color: 'from-blue-600 to-cyan-500'
  },
  {
    id: 'dev',
    name: 'Engenheiro Full-Stack & Dev',
    shortName: 'Dev Specialist',
    description: 'Especialista em TypeScript, Rust, Python, Go, APIs REST e depuração',
    icon: '💻',
    color: 'from-emerald-600 to-teal-500'
  },
  {
    id: 'architect',
    name: 'Arquiteto de Sistemas Cloud',
    shortName: 'Arquitetura',
    description: 'Design de microsserviços, escalabilidade, trade-offs e diagramas de infra',
    icon: '🏛️',
    color: 'from-purple-600 to-indigo-500'
  },
  {
    id: 'fast',
    name: 'Modo Ultra-Rápido',
    shortName: 'Fast Lite',
    description: 'Respostas concisas, pontuais e com latência mínima',
    icon: '⚡',
    color: 'from-amber-500 to-orange-500'
  },
  {
    id: 'ai_tutor',
    name: 'Tutor de IA & LLMs',
    shortName: 'Tutor IA',
    description: 'Explicações didáticas de Transformers, RAG, Fine-Tuning e Agentes',
    icon: '🧠',
    color: 'from-pink-600 to-rose-500'
  }
];

const QUICK_SUGGESTIONS = [
  {
    icon: '⚡',
    title: 'Arquitetura MLA vs MHA',
    role: 'ai_tutor' as ChatbotRole,
    prompt: 'Explique a arquitetura Multi-Head Latent Attention (MLA) do DeepSeek e como ela reduz o cache KV comparada a modelos tradicionais.'
  },
  {
    icon: '💻',
    title: 'API Rust com Axum e JWT',
    role: 'dev' as ChatbotRole,
    prompt: 'Crie uma API RESTful completa em Rust usando Axum, Tokio e SQLx com autenticação JWT e tratamento de erros limpo.'
  },
  {
    icon: '🏛️',
    title: 'Microsserviços de Alta Escala',
    role: 'architect' as ChatbotRole,
    prompt: 'Desenhe a arquitetura de um sistema de notificações distribuído capaz de enviar 1 milhão de push notifications por minuto usando Kafka e Redis.'
  },
  {
    icon: '🚀',
    title: 'Otimização React 19',
    role: 'fast' as ChatbotRole,
    prompt: 'Quais as 4 melhores estratégias para evitar re-renderizações desnecessárias em apps React 19 de alta escala?'
  }
];

export const GeminiGoogleView: React.FC = () => {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'welcome',
      role: 'model',
      content: 'Olá! Sou o **ChatBot IA** oficial integrado ao portal **Gustavo Tec**.\n\nEscolha um perfil especializado acima ou faça qualquer pergunta sobre desenvolvimento, notícias, arquitetura, inteligência artificial ou código!',
      timestamp: new Date().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })
    }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [selectedRole, setSelectedRole] = useState<ChatbotRole>('general');
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [isFullscreen, setIsFullscreen] = useState(false);

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Auto scroll to bottom
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isLoading]);

  const handleSendMessage = async (customText?: string, overrideRole?: ChatbotRole) => {
    const query = (customText || input).trim();
    if (!query || isLoading) return;

    const roleToUse = overrideRole || selectedRole;
    if (overrideRole) {
      setSelectedRole(overrideRole);
    }

    const userMessage: ChatMessage = {
      id: `user-${Date.now()}`,
      role: 'user',
      content: query,
      timestamp: new Date().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })
    };

    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);

    try {
      // Build conversation history (excluding welcome greeting)
      const history = messages
        .filter(m => m.id !== 'welcome')
        .map(m => ({
          role: m.role,
          content: m.content
        }));

      const reply = await sendAiChatMessage({
        message: query,
        history,
        role: roleToUse
      });

      const modelMessage: ChatMessage = {
        id: `model-${Date.now()}`,
        role: 'model',
        content: reply || 'Sem resposta retornada pelo ChatBot.',
        timestamp: new Date().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })
      };

      setMessages(prev => [...prev, modelMessage]);
    } catch (err: any) {
      console.error('Erro ao enviar mensagem:', err);
      const errorMessage: ChatMessage = {
        id: `error-${Date.now()}`,
        role: 'model',
        content: `⚠️ **Erro na comunicação**: ${err.message || 'Falha temporária ao contactar o serviço do ChatBot'}.\n\nVocê também pode acessar diretamente em [gemini.google.com](${GEMINI_URL}).`,
        timestamp: new Date().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
      setTimeout(() => inputRef.current?.focus(), 100);
    }
  };

  const handleCopyMessage = (content: string, id: string) => {
    navigator.clipboard.writeText(content);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleClearChat = () => {
    setMessages([
      {
        id: 'welcome',
        role: 'model',
        content: 'Chat reiniciado. O que você gostaria de explorar ou programar agora?',
        timestamp: new Date().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })
      }
    ]);
  };

  const currentRolePreset = ROLE_PRESETS.find(r => r.id === selectedRole) || ROLE_PRESETS[0];

  return (
    <div className={`space-y-4 ${isFullscreen ? 'fixed inset-0 z-50 bg-slate-950/95 backdrop-blur-3xl p-4 sm:p-6 overflow-y-auto' : 'w-full'}`}>
      
      {/* Top Banner & Quick Controls with Liquid Glass */}
      <div className="liquid-glass-card rounded-3xl p-5 sm:p-6 shadow-[0_8px_32px_rgba(0,0,0,0.4)] relative overflow-hidden">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          
          {/* Title & Brand */}
          <div className="flex items-center gap-4">
            <div className={`w-13 h-13 rounded-2xl bg-gradient-to-tr ${currentRolePreset.color} flex items-center justify-center text-white text-2xl shadow-[0_0_25px_rgba(6,182,212,0.4)] shrink-0 border border-white/20`}>
              <Bot className="w-7 h-7 text-white" />
            </div>
            <div>
              <div className="flex items-center gap-2.5 flex-wrap">
                <h1 className="text-xl sm:text-2xl font-black text-white tracking-tight flex items-center gap-2">
                  <span>ChatBot</span>
                  <span className="bg-gradient-to-r from-cyan-400 to-blue-400 bg-clip-text text-transparent">IA</span>
                </h1>
                <span className="text-[10px] bg-gradient-to-r from-blue-500/20 to-cyan-400/20 border border-cyan-400/30 text-cyan-300 font-bold px-2.5 py-0.5 rounded-full font-mono uppercase shadow-[0_0_10px_rgba(6,182,212,0.2)]">
                  Assistente Inteligente
                </span>
              </div>
              <p className="text-xs text-slate-300 flex items-center gap-2 mt-1">
                <span className="text-cyan-300 font-semibold">{currentRolePreset.name}</span>
                <span className="text-slate-600">•</span>
                <span className="text-emerald-400 flex items-center gap-1 font-medium">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping"></span>
                  Conectado em tempo real
                </span>
              </p>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-wrap items-center gap-2">
            <button
              onClick={() => setIsFullscreen(!isFullscreen)}
              className="p-2.5 liquid-glass hover:border-cyan-400/40 text-slate-200 rounded-2xl transition-all cursor-pointer text-xs flex items-center gap-1.5 shadow-sm"
              title={isFullscreen ? 'Sair da Tela Cheia' : 'Modo Tela Cheia'}
            >
              {isFullscreen ? <Minimize2 className="w-4 h-4 text-cyan-400" /> : <Maximize2 className="w-4 h-4 text-cyan-400" />}
              <span className="hidden sm:inline">{isFullscreen ? 'Minimizar' : 'Tela Cheia'}</span>
            </button>

            <button
              onClick={handleClearChat}
              className="p-2.5 liquid-glass hover:bg-rose-500/20 hover:text-rose-300 text-slate-400 hover:border-rose-500/40 rounded-2xl transition-all cursor-pointer text-xs flex items-center gap-1.5 shadow-sm"
              title="Limpar Histórico"
            >
              <Trash2 className="w-4 h-4" />
              <span className="hidden sm:inline">Limpar</span>
            </button>

            <a
              href={GEMINI_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="px-4 py-2.5 bg-gradient-to-r from-blue-600 via-cyan-500 to-teal-400 hover:from-blue-500 hover:to-cyan-400 text-slate-950 font-bold rounded-2xl text-xs sm:text-sm flex items-center gap-2 shadow-[0_0_20px_rgba(6,182,212,0.4)] transition-all cursor-pointer border border-white/20"
            >
              <span>gemini.google.com</span>
              <ExternalLink className="w-4 h-4" />
            </a>
          </div>

        </div>

        {/* Specialized Persona Selector Tabs */}
        <div className="mt-4 pt-3 border-t border-white/10">
          <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider font-mono mb-2.5 flex items-center gap-1.5">
            <Layers className="w-3.5 h-3.5 text-cyan-400" />
            <span>Papel do Especialista do ChatBot:</span>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-2">
            {ROLE_PRESETS.map((preset) => (
              <button
                key={preset.id}
                onClick={() => setSelectedRole(preset.id)}
                className={`p-3 rounded-2xl border text-left transition-all cursor-pointer flex flex-col justify-between ${
                  selectedRole === preset.id
                    ? 'liquid-glass-active text-white ring-1 ring-cyan-400/50'
                    : 'liquid-glass-subtle text-slate-400 hover:text-slate-200 hover:border-white/20'
                }`}
              >
                <div className="flex items-center gap-2">
                  <span className="text-base">{preset.icon}</span>
                  <span className="text-xs font-bold text-slate-200">{preset.shortName}</span>
                </div>
                <span className="text-[10px] text-slate-400 mt-1 line-clamp-1">{preset.description}</span>
              </button>
            ))}
          </div>
        </div>

      </div>

      {/* Main Chat Container */}
      <div className="liquid-glass-card rounded-3xl overflow-hidden shadow-[0_8px_32px_rgba(0,0,0,0.5)] flex flex-col h-[600px] sm:h-[680px]">
        
        {/* Chat Control Bar */}
        <div className="bg-slate-950/60 px-5 py-3 border-b border-white/10 flex items-center justify-between gap-3 backdrop-blur-md">
          <div className="flex items-center gap-2">
            <div className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse shadow-[0_0_8px_rgba(52,211,153,0.8)]"></div>
            <span className="text-xs font-bold text-slate-200 font-mono">
              Conversa Interativa • {messages.filter(m => m.role === 'user').length} turnos
            </span>
          </div>
          <div className="text-xs text-slate-400 font-mono flex items-center gap-1.5">
            <span className="text-cyan-400">●</span>
            <span className="text-slate-300 font-medium">{currentRolePreset.name}</span>
          </div>
        </div>

        {/* Chat Messages Thread */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-6 bg-slate-950/40">
          
          {messages.map((msg) => (
            <div
              key={msg.id}
              className={`flex gap-3.5 ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              {msg.role === 'model' && (
                <div className={`w-8 h-8 rounded-xl bg-gradient-to-br ${currentRolePreset.color} flex items-center justify-center text-white shrink-0 mt-1 shadow-[0_0_15px_rgba(6,182,212,0.3)] border border-white/20`}>
                  <Bot className="w-4 h-4" />
                </div>
              )}

              <div className={`max-w-3xl flex flex-col ${msg.role === 'user' ? 'items-end' : 'items-start'}`}>
                
                <div
                  className={`rounded-3xl p-4 sm:p-5 text-sm leading-relaxed backdrop-blur-xl ${
                    msg.role === 'user'
                      ? 'bg-gradient-to-r from-blue-600 to-cyan-600 text-white rounded-br-none shadow-[0_4px_20px_rgba(6,182,212,0.3)] border border-white/15'
                      : 'liquid-glass text-slate-100 rounded-bl-none shadow-[0_4px_20px_rgba(0,0,0,0.3)]'
                  }`}
                >
                  {msg.role === 'user' ? (
                    <div className="whitespace-pre-wrap font-medium">{msg.content}</div>
                  ) : (
                    <div className="prose prose-invert prose-sm max-w-none text-slate-200">
                      <ReactMarkdown
                        components={{
                          code({ node, className, children, ...props }: any) {
                            return (
                              <code
                                className={`${className || ''} bg-slate-950/80 px-2 py-0.5 rounded-lg text-cyan-300 font-mono text-xs border border-white/10`}
                                {...props}
                              >
                                {children}
                              </code>
                            );
                          },
                          pre({ children }: any) {
                            return (
                              <pre className="bg-slate-950/90 border border-white/10 p-4 rounded-2xl overflow-x-auto text-xs my-3 text-cyan-300 font-mono shadow-inner">
                                {children}
                              </pre>
                            );
                          }
                        }}
                      >
                        {msg.content}
                      </ReactMarkdown>
                    </div>
                  )}
                </div>

                {/* Message Footer Info */}
                <div className="flex items-center gap-2 mt-1.5 px-2 text-[11px] text-slate-500 font-mono">
                  <span>{msg.timestamp}</span>
                  {msg.role === 'model' && (
                    <>
                      <span>•</span>
                      <button
                        onClick={() => handleCopyMessage(msg.content, msg.id)}
                        className="hover:text-slate-300 transition-colors flex items-center gap-1 cursor-pointer"
                        title="Copiar resposta"
                      >
                        {copiedId === msg.id ? (
                          <>
                            <Check className="w-3 h-3 text-emerald-400" />
                            <span className="text-emerald-400">Copiado</span>
                          </>
                        ) : (
                          <>
                            <Copy className="w-3 h-3 text-slate-400 hover:text-cyan-400" />
                            <span>Copiar</span>
                          </>
                        )}
                      </button>
                    </>
                  )}
                </div>

              </div>

              {msg.role === 'user' && (
                <div className="w-8 h-8 rounded-xl bg-slate-800/80 border border-white/10 flex items-center justify-center text-slate-300 shrink-0 mt-1 shadow-sm">
                  <User className="w-4 h-4" />
                </div>
              )}
            </div>
          ))}

          {/* Loading Indicator */}
          {isLoading && (
            <div className="flex gap-3.5 justify-start">
              <div className={`w-8 h-8 rounded-xl bg-gradient-to-br ${currentRolePreset.color} flex items-center justify-center text-white shrink-0 mt-1 shadow-[0_0_15px_rgba(6,182,212,0.3)] border border-white/20`}>
                <Bot className="w-4 h-4 animate-spin" />
              </div>
              <div className="liquid-glass rounded-3xl rounded-bl-none p-4 text-slate-300 flex items-center gap-3">
                <div className="flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-cyan-400 animate-bounce"></span>
                  <span className="w-2 h-2 rounded-full bg-blue-400 animate-bounce [animation-delay:0.2s]"></span>
                  <span className="w-2 h-2 rounded-full bg-teal-400 animate-bounce [animation-delay:0.4s]"></span>
                </div>
                <span className="text-xs text-slate-300 font-mono">
                  ChatBot processando resposta...
                </span>
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Quick Suggestion Chips */}
        {messages.length <= 3 && (
          <div className="px-5 py-3 bg-slate-950/60 border-t border-white/10 overflow-x-auto backdrop-blur-md">
            <div className="flex items-center gap-2 min-w-max">
              <span className="text-[11px] font-bold text-slate-300 flex items-center gap-1 mr-1">
                <Lightbulb className="w-3.5 h-3.5 text-amber-400" />
                Sugestões rápidas:
              </span>
              {QUICK_SUGGESTIONS.map((item, idx) => (
                <button
                  key={idx}
                  onClick={() => handleSendMessage(item.prompt, item.role)}
                  className="px-3.5 py-1.5 liquid-glass-subtle hover:border-cyan-400/40 rounded-xl text-xs text-slate-300 hover:text-white flex items-center gap-1.5 transition-all cursor-pointer"
                >
                  <span>{item.icon}</span>
                  <span>{item.title}</span>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Chat Input Field */}
        <div className="bg-slate-950/80 p-4 sm:p-5 border-t border-white/10 backdrop-blur-xl">
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSendMessage();
            }}
            className="flex items-center gap-2.5"
          >
            <div className="relative flex-1">
              <input
                ref={inputRef}
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder={`Pergunte ao ChatBot (${currentRolePreset.shortName})...`}
                disabled={isLoading}
                className="w-full liquid-glass focus:border-cyan-400/70 rounded-2xl px-5 py-3.5 text-sm text-slate-100 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-cyan-500/20 disabled:opacity-50 pr-12 shadow-[inset_0_1px_1px_rgba(255,255,255,0.08)]"
              />
              <div className="absolute right-4 top-1/2 -translate-y-1/2 text-cyan-400 pointer-events-none">
                <Code2 className="w-4 h-4" />
              </div>
            </div>

            <button
              type="submit"
              disabled={!input.trim() || isLoading}
              className="px-6 py-3.5 bg-gradient-to-r from-cyan-500 via-blue-600 to-indigo-600 hover:from-cyan-400 hover:to-blue-500 disabled:opacity-40 text-white font-bold rounded-2xl text-sm flex items-center gap-2 shadow-[0_0_20px_rgba(6,182,212,0.35)] transition-all cursor-pointer shrink-0 border border-white/15"
            >
              <span>Enviar</span>
              <Send className="w-4 h-4" />
            </button>
          </form>

          <div className="flex items-center justify-between mt-2.5 px-2 text-[11px] text-slate-400">
            <span>Pressione Enter para enviar • Histórico mantido no contexto da sessão</span>
            <a
              href={GEMINI_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="text-cyan-400 hover:text-cyan-300 flex items-center gap-1 font-medium"
            >
              <span>Abrir gemini.google.com</span>
              <ArrowUpRight className="w-3 h-3" />
            </a>
          </div>
        </div>

      </div>

    </div>
  );
};

