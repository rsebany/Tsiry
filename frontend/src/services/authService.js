import api, { unwrap } from '@/services/api';

// ============ OWNER: Jess (auth partagée) ============
// // TODO Jess: ajouter "register" quand le backend le permettra.
export async function login(email, password) {
  const { data } = await api.post('/auth/login', { email, password });
  return unwrap(data); // { token, user }
}

export async function getMe() {
  const { data } = await api.get('/auth/me');
  return unwrap(data); // { user }
}
