
import React from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { motion, AnimatePresence } from 'motion/react';
import { Message, Role } from '../types';
import { Terminal, Bot, User, CheckCircle2, ChevronDown, ChevronUp } from 'lucide-react';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

interface ChatMessageProps {
  message: Message;
}

export const ChatMessage: React.FC<ChatMessageProps> = ({ message }) => {
  const [showTools, setShowTools] = React.useState(false);
  const isAssistant = message.role === Role.ASSISTANT;

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className={cn(
        "flex w-full mb-6 gap-4 p-4 transition-all duration-300",
        isAssistant ? "" : "justify-end"
      )}
    >
      {isAssistant && (
        <div className={cn(
          "flex-shrink-0 w-10 h-10 rounded-xl flex items-center justify-center bg-white/5 border border-white/10 text-teal-400 backdrop-blur-md shadow-lg"
        )}>
           <Bot size={20} />
        </div>
      )}

      <div className={cn(
        "max-w-[85%] p-5 rounded-2xl shadow-2xl relative",
        isAssistant 
          ? "bg-white/5 border border-white/10 rounded-tl-none backdrop-blur-md" 
          : "bg-indigo-600/30 border border-indigo-500/30 rounded-tr-none backdrop-blur-sm self-end"
      )}>
        <div className="flex items-center gap-2 mb-2">
          {!isAssistant && <User size={12} className="text-white/40" />}
          <span className="text-[10px] font-mono uppercase tracking-widest text-white/40">
            {isAssistant ? (
              <div className="flex items-center gap-2 text-teal-400">
                <span className="flex h-1.5 w-1.5 rounded-full bg-teal-400" />
                Agente de Grover
              </div>
            ) : 'User Terminal'}
          </span>
          <span className="text-[8px] font-mono text-white/20 ml-auto">
            {new Date(message.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
          </span>
        </div>

        <div className="prose prose-invert max-w-none prose-zinc prose-p:leading-relaxed prose-pre:bg-black/30 prose-pre:border prose-pre:border-white/10 prose-pre:rounded-xl">
          <ReactMarkdown remarkPlugins={[remarkGfm]}>
            {message.content}
          </ReactMarkdown>
        </div>

        {isAssistant && message.tools_used && message.tools_used.length > 0 && (
          <div className="mt-4 pt-4 border-t border-white/5">
            <button
              onClick={() => setShowTools(!showTools)}
              className="flex items-center gap-2 text-[9px] font-mono uppercase tracking-[0.2em] text-teal-400/60 hover:text-teal-400 transition-colors"
            >
              <Terminal size={10} />
              {showTools ? 'Hide Runtime Data' : `Usado: ${message.tools_used[0]}${message.tools_used.length > 1 ? ` (+${message.tools_used.length - 1})` : ''}`}
            </button>
            
            <AnimatePresence>
              {showTools && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  className="overflow-hidden"
                >
                  <div className="flex flex-wrap gap-2 mt-3">
                    {message.tools_used.map((tool, i) => (
                      <span key={i} className="flex items-center gap-1.5 px-2 py-1 bg-white/5 border border-white/10 rounded text-[9px] font-mono text-white/50">
                        {tool}
                      </span>
                    ))}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        )}
      </div>
      
      {!isAssistant && (
        <div className="flex-shrink-0 w-10 h-10 rounded-xl flex items-center justify-center bg-indigo-500/20 border border-indigo-500/30 text-indigo-300 backdrop-blur-md">
          <User size={20} />
        </div>
      )}
    </motion.div>
  );
};
