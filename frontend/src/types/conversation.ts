import type {Message} from './message'

export interface ConversationUser {
  id: number;
  username: string;
  is_online: boolean;
}

export interface Conversation {
  user: ConversationUser;
  last_message?: Message;
}