
import { ChatResponse, Message, Role } from '../types';

const API_BASE_URL = 'https://agente-grover.onrender.com';

export const chatService = {
  async sendMessage(message: string, history: Message[]): Promise<ChatResponse> {
    console.log('--- Chat Request Info ---');
    console.log('Sending message:', message);
    console.log('History length:', history.length);
    
    try {
      const payload = {
        message,
        history: history.map(m => ({
          role: m.role,
          content: m.content
        }))
      };

      console.log('Payload:', JSON.stringify(payload, null, 2));

      const response = await fetch('https://agente-grover.onrender.com/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });

      console.log('Response status:', response.status);

      if (!response.ok) {
        const errorText = await response.text();
        console.error('API Error Response:', errorText);
        throw new Error(`Error en la API: ${response.status} - ${response.statusText}`);
      }

      const data = await response.json();
      console.log('--- Chat Response Received ---');
      console.log('Data:', data);
      return data;
    } catch (error) {
      console.error('Fetch error details:', error);
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
