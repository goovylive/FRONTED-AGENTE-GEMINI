
export enum Role {
  USER = 'user',
  ASSISTANT = 'assistant'
}

export interface Message {
  role: Role;
  content: string;
  tools_used?: string[];
  model?: string;
  timestamp: number;
}

export interface ChatSession {
  id: string;
  title: string;
  messages: Message[];
  createdAt: number;
}

export interface ChatResponse {
  response: string;
  tools_used: string[];
  model: string;
}
