const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:3000';

export async function login(email: string, password: string) {
  const res = await fetch(`${API_BASE}/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password }),
    credentials: 'include',
  });

  if (!res.ok) {
    throw new Error('Invalid credentials');
  }

  const body = await res.json();
  return body?.data?.user;
}

export async function fetchCurrentUser() {
  const res = await fetch(`${API_BASE}/auth/me`, {
    credentials: 'include',
  });

  if (!res.ok) {
    logout();
    return null;
  }

  const body = await res.json();
  return body?.data?.user ?? null;
}

export function logout(): void {
  // best-effort call to backend to revoke refresh token
  fetch(`${API_BASE}/auth/logout`, { method: 'POST', credentials: 'include' }).catch(() => {});
}
