// Autenticação simples por "senha única da loja".
// Não é um sistema multiusuário — é um portão de acesso para o PC da loja.
// A senha pode ser trocada em Configurações e fica guardada no navegador.

const PWD_KEY = 'gestaophone_pwd';
const AUTH_KEY = 'gestaophone_auth';

// Senha padrão no primeiro acesso (troque em Configurações depois).
// Pode ser sobrescrita por VITE_STORE_PASSWORD no build, se preferir.
const DEFAULT_PASSWORD = (import.meta.env.VITE_STORE_PASSWORD || 'gestao123').trim();

export function getStoredPassword() {
  return localStorage.getItem(PWD_KEY) || DEFAULT_PASSWORD;
}

export function setStoredPassword(newPassword) {
  const value = (newPassword || '').trim();
  if (!value) return false;
  localStorage.setItem(PWD_KEY, value);
  return true;
}

export function isAuthenticated() {
  return localStorage.getItem(AUTH_KEY) === 'true';
}

// Retorna true se a senha conferir (e marca como logado).
export function login(password) {
  if ((password || '').trim() === getStoredPassword()) {
    localStorage.setItem(AUTH_KEY, 'true');
    return true;
  }
  return false;
}

export function logout() {
  localStorage.removeItem(AUTH_KEY);
}
