import type {User} from "./user"
import type {FileAttachment} from "./file"

export interface Message {
  id: number;
  content?: string;
  sender_id: number;
  receiver_id: number;
  is_edited: boolean;
  created_at: string;
  updated_at?: string;
  sender: User;
  receiver: User;
  attachments: FileAttachment[];
}

export interface MessageSendData {
  content?: string;
  receiver_id: number,
  attachments: FileAttachment[];
}

export interface MessageUpdateData {
  content?: string;
  receiver_id: number,
  attachments: FileAttachment[];
}