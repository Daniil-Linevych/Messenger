import {api} from "./api"
import type { Conversation } from "../types/conversation"
import type {Message, MessageSendData} from "../types/message"


export const conversationAPI = {
    loadConversations: () => api.get<Conversation[]>('/conversations'),
    loadConversationMessages: (user_id:number) => api.get<Message[]>(`/conversations/${user_id}`),
    createConversation: (data:MessageSendData) => api.post<Message>('/messages/send', data)
}