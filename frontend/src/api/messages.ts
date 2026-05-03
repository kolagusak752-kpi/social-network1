import { api } from './apiFetch';
import type { Conversation } from '../types/interfaces';

export const messagesApi = {
  getConversationList: () =>
    api.get<Conversation[]>('/api/messages/getConversationList'),

  uploadAttachments: (formData: FormData) =>
    api.postFormData('/api/messages/uploadAttachments', formData),

  findOrCreateConversation: (userId: string) =>
    api.get<Conversation>(`/api/messages/findOrCreateConversation/${userId}`),
};
