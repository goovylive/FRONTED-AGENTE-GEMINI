
import { ChatResponse, Message, Role } from '../types';

const API_BASE_URL = 'https://agente-grover.onrender.com';

export const chatService = {
  async sendMessage(message: string, history: Message[]): Promise<ChatResponse> {
    try {
      const response = await fetch(`${API_BASE_URL}/chat`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          message,
          history: history.map(m => ({
            role: m.role,
            content: m.content
          }))
        }),
      });

      if (!response.ok) {
        throw new Error(`Error en la API: ${response.statusText}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Chat error:', error);
      throw error;
    }
  },

  async getAvailableTools(): Promise<string[]> {
    try {
      const response = await fetch(`${API_BASE_URL}/tools`);
      if (!response.ok) return [];
      return await response.json();
    } catch (error) {
      console.error('Tools error:', error);
      return [];
    }
  }
};
