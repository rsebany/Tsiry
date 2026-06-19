const TOKEN_KEY = 'hospital_auth_token';

export function getStoredToken() {
  return localStorage.getItem(TOKEN_KEY);
}

export function setStoredToken(token) {
  localStorage.setItem(TOKEN_KEY, token);
}

export function clearStoredToken() {
  localStorage.removeItem(TOKEN_KEY);
}

export const ROLE_HOME = {
  PATIENT: '/patient',
  AGENT: '/agent',
  MEDECIN: '/medecin',
};

export function getRoleHome(role) {
  return ROLE_HOME[role] || '/login';
}
