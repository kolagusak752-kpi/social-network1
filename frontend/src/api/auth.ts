import { api } from './apiFetch';

export const authApi = {
  login: (data: { email: string; password: string }) =>
    api.post('/proxy/login', data),

  logout: () =>
    api.post('/proxy/logout'),

  register: (data: { email: string; password: string; username: string }) =>
    api.post('/proxy/register', data),

  verify: (data: { email: string; code: string }) =>
    api.post('/proxy/verify', data),

  getToken: () =>
    api.get<{ accessToken: string }>('/proxy/token'),
};
