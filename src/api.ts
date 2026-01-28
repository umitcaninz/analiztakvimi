export interface ApiEvent {
  category: 'analizler' | 'etkinlikler' | 'haberler';
  date: string;
  description: string;
  is_new: boolean;
  link?: string;
}

export interface DataStoreDto {
  etkinlikler: Record<string, ApiEvent>;
  analizler: Record<string, ApiEvent>;
  haberler: Record<string, ApiEvent>;
}

const getBase = (): string => {
  try {
    // @ts-expect-error vite env
    const envBase = import.meta.env?.VITE_API_BASE as string | undefined;
    return envBase || 'http://localhost:4000';
  } catch {
    return 'http://localhost:4000';
  }
};

const authHeader = (): HeadersInit => {
  const token = typeof window !== 'undefined' ? localStorage.getItem('adminJwt') : '';
  return token ? { Authorization: `Bearer ${token}` } : {};
};

export async function apiLogin(username: string, password: string): Promise<string> {
  const res = await fetch(`${getBase()}/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ username, password })
  });
  if (!res.ok) throw new Error('Login failed');
  const data = await res.json();
  return data.token as string;
}

export async function apiGetAll(): Promise<DataStoreDto> {
  const res = await fetch(`${getBase()}/events`, { method: 'GET' });
  if (!res.ok) throw new Error('Fetch failed');
  return res.json();
}

export async function apiUpsert(category: ApiEvent['category'], event: ApiEvent): Promise<void> {
  const res = await fetch(`${getBase()}/upsert`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', ...authHeader() },
    body: JSON.stringify({ category, event })
  });
  if (!res.ok) throw new Error('Upsert failed');
}

export async function apiDelete(category: ApiEvent['category'], date: string): Promise<void> {
  const res = await fetch(`${getBase()}/delete`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', ...authHeader() },
    body: JSON.stringify({ category, date })
  });
  if (!res.ok) throw new Error('Delete failed');
}


