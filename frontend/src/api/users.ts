import { api } from './apiFetch';
import type { User } from '../types/interfaces';

export const usersApi = {
  getMe: () =>
    api.get<User>('/api/users/Me'),

  changeAvatar: (formData: FormData) =>
    api.postFormData<User>('/api/users/changeAvatar', formData),

  updateProfile: (data: Partial<User>) =>
    api.patch<User>('/api/users/updateProfile', data),

  findByUsername: (username: string) =>
    api.get<User[]>(`/api/users/findByUsername?username=${username}`),
};
