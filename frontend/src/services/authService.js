import api, { unwrap } from '@/services/api';

// ============ OWNER: Jess (auth partagée) ============
export async function login(email, password) {
  const { data } = await api.post('/auth/login', { email, password });
  return unwrap(data); // { token, user }
}

export async function register(payload) {
  const { data } = await api.post('/auth/register', payload);
  return unwrap(data); // { token, user }
}

export async function forgotPassword(email) {
  const { data } = await api.post('/auth/forgot-password', { email });
  return data; // { message, resetToken? }
}

export async function resetPassword(token, password) {
  const { data } = await api.post('/auth/reset-password', { token, password });
  return data; // { message }
}

export async function getMe() {
  const { data } = await api.get('/auth/me');
  return unwrap(data); // { user }
}
