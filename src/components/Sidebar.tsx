
import React from 'react';
import { motion } from 'motion/react';
import { ChatSession } from '../types';
import { Plus, MessageSquare, Trash2, Github } from 'lucide-react';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

interface SidebarProps {
  sessions: ChatSession[];
  activeSessionId: string | null;
  onSelectSession: (id: string) => void;
  onNewChat: () => void;
  onDeleteSession: (id: string) => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  sessions,
  activeSessionId,
  onSelectSession,
  onNewChat,
  onDeleteSession,
}) => {
  return (
    <aside className="w-72 h-full bg-white/5 backdrop-blur-xl border-r border-white/10 flex flex-col overflow-hidden z-20">
      <div className="p-6">
        <div className="flex items-center gap-3 mb-8 px-2">
          <div className="w-8 h-8 bg-gradient-to-tr from-indigo-500 to-teal-400 rounded flex items-center justify-center shadow-lg shadow-teal-500/10">
            <Github className="text-black" size={18} />
          </div>
          <span className="text-lg font-semibold tracking-tight text-white">Grover <span className="text-teal-400">Agent</span></span>
        </div>

        <button
          onClick={onNewChat}
          className="w-full flex items-center justify-center gap-2 py-3 px-4 bg-white/10 hover:bg-white/15 border border-white/20 text-white rounded-xl font-medium transition-all duration-200 active:scale-95 shadow-xl shadow-black/20"
        >
          <Plus size={18} />
          Nuevo Chat
        </button>
      </div>

      <div className="flex-1 overflow-y-auto custom-scrollbar px-4 space-y-6">
        <p className="text-[10px] uppercase tracking-widest text-white/40 font-bold px-2">Historial Reciente</p>
        
        <div className="space-y-2">
          {sessions.length === 0 && (
            <div className="flex flex-col items-center justify-center py-10 opacity-20 text-white text-center px-4">
              <MessageSquare size={32} className="mb-2" />
              <p className="text-[10px] uppercase tracking-widest font-mono">Sin sesiones</p>
            </div>
          )}
          
          {sessions.slice().reverse().map((session) => (
            <div
              key={session.id}
              className={cn(
                "group relative flex items-center gap-3 p-3 rounded-lg cursor-pointer transition-all duration-200",
                activeSessionId === session.id 
                  ? "bg-white/10 text-white border border-white/10 shadow-lg" 
                  : "text-white/40 hover:bg-white/5 hover:text-white/80"
              )}
              onClick={() => onSelectSession(session.id)}
            >
              <MessageSquare size={16} className={cn(activeSessionId === session.id ? "text-teal-400" : "text-white/20 group-hover:text-white/40")} />
              <span className="flex-1 text-sm truncate font-medium">
                {session.title || 'Draft chat'}
              </span>
              
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onDeleteSession(session.id);
                }}
                className="opacity-0 group-hover:opacity-100 p-1 hover:text-red-400 text-white/20 transition-opacity"
              >
                <Trash2 size={14} />
              </button>
            </div>
          ))}
        </div>
      </div>

      <div className="p-6 border-t border-white/10">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-indigo-500 to-teal-400 flex items-center justify-center text-[10px] font-bold text-black border border-white/20">
            GA
          </div>
          <div className="text-[10px]">
            <p className="font-semibold text-white/90">Grover User</p>
            <p className="text-white/30 uppercase tracking-tighter">System Access</p>
          </div>
        </div>
      </div>
    </aside>
  );
};
