
import React from 'react';
import { Send, Hash } from 'lucide-react';
import { motion } from 'motion/react';

interface ChatInputProps {
  onSend: (message: string) => void;
  isLoading: boolean;
}

export const ChatInput: React.FC<ChatInputProps> = ({ onSend, isLoading }) => {
  const [input, setInput] = React.useState('');

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      triggerSend();
    }
  };

  const triggerSend = () => {
    if (input.trim() && !isLoading) {
      onSend(input.trim());
      setInput('');
    }
  };

  return (
    <div className="max-w-4xl mx-auto relative group">
      <div className="relative flex items-center bg-white/5 backdrop-blur-xl border border-white/20 rounded-2xl p-1 shadow-inner focus-within:ring-2 focus-within:ring-indigo-500/50 transition-all">
        <div className="absolute left-4 top-1/2 -translate-y-1/2 text-white/20">
          <Hash size={18} />
        </div>
        <input
          type="text"
          value={input}
          autoFocus
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Escribe un mensaje al Agente Grover..."
          disabled={isLoading}
          className="bg-transparent border-none outline-none flex-1 px-5 pl-12 text-sm py-4 placeholder:text-white/20 text-white disabled:opacity-50"
        />
        <button
          type="button"
          onClick={triggerSend}
          disabled={!input.trim() || isLoading}
          className="p-3 bg-teal-500 hover:bg-teal-400 disabled:bg-white/5 disabled:text-white/10 text-black rounded-xl transition-all shadow-lg shadow-teal-500/20 active:scale-95"
        >
          <Send size={18} strokeWidth={2.5} />
        </button>
      </div>
      <div className="mt-3 text-center">
        <p className="text-[10px] text-white/30 uppercase tracking-tighter">
          Seguridad: Grover API utiliza encriptación de extremo a extremo.
        </p>
      </div>
    </div>
  );
};
