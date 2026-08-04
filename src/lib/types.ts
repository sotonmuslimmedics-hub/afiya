import type { CategoryId } from './categories';

export type ConcernStatus = 'needs_reply' | 'answered' | 'resolved';

export interface Message {
  sender: 'student' | 'welfare';
  message: string;
  created_at: string;
}

export interface Thread {
  code: string;
  category: CategoryId;
  message: string;
  status: ConcernStatus;
  created_at: string;
  replies: Message[];
}

export interface InboxItem {
  id: string;
  code: string;
  category: CategoryId;
  message: string;
  status: ConcernStatus;
  created_at: string;
  updated_at: string;
}
