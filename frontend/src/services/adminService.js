import api, { unwrap } from '@/services/api';

export async function getStats() {
  const { data } = await api.get('/admin/stats');
  return unwrap(data);
}

export async function getUsers(params = {}) {
  const { data } = await api.get('/admin/users', { params });
  return unwrap(data);
}

export async function getUser(id) {
  const { data } = await api.get(`/admin/users/${id}`);
  return unwrap(data);
}

export async function createUser(payload) {
  const { data } = await api.post('/admin/users', payload);
  return unwrap(data);
}

export async function updateUser(id, payload) {
  const { data } = await api.put(`/admin/users/${id}`, payload);
  return unwrap(data);
}

export async function deleteUser(id) {
  const { data } = await api.delete(`/admin/users/${id}`);
  return unwrap(data);
}

export async function getHospitals() {
  const { data } = await api.get('/admin/hospitals');
  return unwrap(data);
}

export async function createHospital(payload) {
  const { data } = await api.post('/admin/hospitals', payload);
  return unwrap(data);
}

export async function updateHospital(id, payload) {
  const { data } = await api.put(`/admin/hospitals/${id}`, payload);
  return unwrap(data);
}

export async function deleteHospital(id) {
  const { data } = await api.delete(`/admin/hospitals/${id}`);
  return unwrap(data);
}

export async function getLogs(params = {}) {
  const { data } = await api.get('/admin/logs', { params });
  return unwrap(data);
}
