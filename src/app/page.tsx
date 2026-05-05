'use client';

import React, { useState, useEffect, useRef } from 'react';
import { Sidebar } from '../components/Sidebar';
import { ChatMessage } from '../components/ChatMessage';
import { ChatInput } from '../components/ChatInput';
import { Message, ChatSession, Role } from '../types';
import { chatService } from '../services/chatService';
import { motion, AnimatePresence } from 'motion/react';
import { Loader2, Sparkles, MessageCircleCode } from 'lucide-react';

const STORAGE_KEY = 'grover_chat_sessions';

export default function Page() {
  const [sessions, setSessions] = useState<ChatSession[]>([]);
  const [activeSessionId, setActiveSessionId] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  // Load persistence
  useEffect(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        setSessions(parsed);
        if (parsed.length > 0) {
          setActiveSessionId(parsed[parsed.length - 1].id);
        }
      } catch (e) {
        console.error("Failed to parse sessions", e);
      }
    }
  }, []);

  // Save persistence
  useEffect(() => {
    if (sessions.length > 0) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(sessions));
    }
  }, [sessions]);

  // Scroll to bottom
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [sessions, activeSessionId, isLoading]);

  const activeSession = sessions.find(s => s.id === activeSessionId) || null;

  const handleNewChat = () => {
    const newId = crypto.randomUUID();
    const newSession: ChatSession = {
      id: newId,
      title: '',
      messages: [],
      createdAt: Date.now(),
    };
    setSessions(prev => [...prev, newSession]);
    setActiveSessionId(newId);
  };

  const handleDeleteSession = (id: string) => {
    setSessions(prev => {
      const filtered = prev.filter(s => s.id !== id);
      if (activeSessionId === id) {
        setActiveSessionId(filtered.length > 0 ? filtered[filtered.length - 1].id : null);
      }
      return filtered;
    });
  };

  const handleSendMessage = async (content: string) => {
    let currentSessionId = activeSessionId;
    
    // Create session if none active
    if (!currentSessionId) {
      const newId = crypto.randomUUID();
      const newSession: ChatSession = {
        id: newId,
        title: content.substring(0, 30),
        messages: [],
        createdAt: Date.now(),
      };
      setSessions(prev => [...prev, newSession]);
      setActiveSessionId(newId);
      currentSessionId = newId;
    }

    const userMessage: Message = {
      role: Role.USER,
      content,
      timestamp: Date.now(),
    };

    setSessions(prev => prev.map(s => {
      if (s.id === currentSessionId) {
        return { 
          ...s, 
          messages: [...s.messages, userMessage],
          title: s.title || content.substring(0, 40)
        };
      }
      return s;
    }));

    setIsLoading(true);

    try {
      const targetSession = sessions.find(s => s.id === currentSessionId);
      const history = targetSession?.messages || [];
      const response = await chatService.sendMessage(content, history);

      const assistantMessage: Message = {
        role: Role.ASSISTANT,
        content: response.response,
        tools_used: response.tools_used,
        model: response.model,
        timestamp: Date.now(),
      };

      setSessions(prev => prev.map(s => {
        if (s.id === currentSessionId) {
          return { ...s, messages: [...s.messages, assistantMessage] };
        }
        return s;
      }));
    } catch (error) {
      const errorMessage: Message = {
        role: Role.ASSISTANT,
        content: "Lo siento, hubo un error técnico al procesar tu mensaje. Por favor intenta de nuevo.",
        timestamp: Date.now(),
      };
      setSessions(prev => prev.map(s => {
        if (s.id === currentSessionId) {
          return { ...s, messages: [...s.messages, errorMessage] };
        }
        return s;
      }));
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex h-screen bg-[#0a0a0c] overflow-hidden font-sans relative text-white">
      {/* Background Decorative Gradients */}
      <div className="absolute top-[-10%] left-[-10%] w-[500px] h-[500px] bg-indigo-600/20 rounded-full blur-[120px] pointer-events-none z-0" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[400px] h-[400px] bg-teal-500/10 rounded-full blur-[100px] pointer-events-none z-0" />

      <Sidebar
        sessions={sessions}
        activeSessionId={activeSessionId}
        onSelectSession={setActiveSessionId}
        onNewChat={handleNewChat}
        onDeleteSession={handleDeleteSession}
      />

      <main className="flex-1 flex flex-col min-w-0 bg-transparent relative z-10">
        {/* Header */}
        <header className="h-16 flex items-center justify-between px-8 bg-white/5 backdrop-blur-md border-b border-white/10 z-10">
          <div className="flex items-center gap-2">
            <h2 className="text-lg font-semibold tracking-tight text-white flex items-center gap-2">
              Agente de <span className="text-teal-400 font-bold uppercase text-sm">{activeSession?.title || 'Grover'}</span>
              <span className="flex h-2 w-2 rounded-full bg-green-500 shadow-[0_0_8px_rgba(34,197,94,0.6)] animate-pulse" />
            </h2>
          </div>
          <div className="flex items-center gap-4 text-xs font-mono">
            <span className="text-white/40">MODEL</span>
            <span className="text-white/60 bg-white/10 px-2 py-1 rounded">AGENT-GROVER-V4</span>
          </div>
        </header>

        {/* Messages Area */}
        <div 
          ref={scrollRef}
          className="flex-1 overflow-y-auto custom-scrollbar p-8 scroll-smooth"
        >
          <div className="max-w-4xl mx-auto space-y-4">
            <AnimatePresence initial={false}>
              {activeSession ? (
                <>
                  {activeSession.messages.length === 0 && (
                    <motion.div 
                      key="empty-state"
                      initial={{ opacity: 0, scale: 0.95 }}
                      animate={{ opacity: 1, scale: 1 }}
                      className="flex flex-col items-center justify-center py-24 text-center"
                    >
                      <div className="w-16 h-16 bg-white/5 rounded-2xl flex items-center justify-center mb-6 border border-white/10 shadow-2xl backdrop-blur-md">
                        <MessageCircleCode size={32} className="text-teal-400" />
                      </div>
                      <h1 className="text-2xl font-bold text-white mb-2 tracking-tight">System Ready</h1>
                      <p className="text-white/40 text-sm max-w-md">
                        Pregúntame sobre cualquier tarea. Puedo ejecutar herramientas, listar tablas y ayudarte con información técnica.
                      </p>
                    </motion.div>
                  )}
                  {activeSession.messages.map((msg, i) => (
                    <ChatMessage key={i} message={msg} />
                  ))}
                  {isLoading && (
                    <motion.div
                      key="loading-indicator"
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="flex items-center gap-3 text-white/30 text-xs px-2"
                    >
                      <div className="flex space-x-1">
                        <div className="w-1.5 h-1.5 bg-white/20 rounded-full dot-anim" />
                        <div className="w-1.5 h-1.5 bg-white/20 rounded-full dot-anim [animation-delay:0.2s]" />
                        <div className="w-1.5 h-1.5 bg-white/20 rounded-full dot-anim [animation-delay:0.4s]" />
                      </div>
                      <span>Grover está escribiendo...</span>
                    </motion.div>
                  )}
                </>
              ) : (
                <div className="flex flex-col items-center justify-center h-full py-40">
                  <Sparkles size={48} className="text-white/10 mb-4" />
                  <p className="text-white/20 font-mono text-[10px] uppercase tracking-widest">Inicia una nueva sesión para comenzar</p>
                </div>
              )}
            </AnimatePresence>
          </div>
        </div>

        {/* Input Area */}
        <div className="p-8">
          <ChatInput key={activeSessionId} onSend={handleSendMessage} isLoading={isLoading} />
        </div>
      </main>
    </div>
  );
}
