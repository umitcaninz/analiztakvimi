import React, { useEffect, useMemo, useState } from 'react';
import { AdminPanel } from './components/AdminPanel';
import { CalendarDays, LogOut } from 'lucide-react';
import { apiGetAll, apiLogin, apiUpsert, apiDelete } from './api';
import type { DataStore } from './types';
import { loadDataStore } from './storage';

const getEnv = (key: string, fallback: string) => {
  try {
    // @ts-expect-error vite env shape
    const val = import.meta.env?.[key];
    return (val && typeof val === 'string') ? val : fallback;
  } catch {
    return fallback;
  }
};

const ADMIN_USER = getEnv('VITE_ADMIN_USER', 'admin');
const ADMIN_PASS = getEnv('VITE_ADMIN_PASS', 'admin123!');
const AUTH_KEY = 'adminAuthV1';

export default function AdminApp() {
  const [theme, setTheme] = useState(() => {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('theme') || 'light';
    }
    return 'light';
  });
  const [dataStore, setDataStore] = useState<DataStore>({ analizler: {}, etkinlikler: {}, haberler: {} });
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const authed = useMemo(() => {
    if (typeof window === 'undefined') return false;
    return !!localStorage.getItem('adminJwt');
  }, []);
  const [isAuthed, setIsAuthed] = useState<boolean>(authed);

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('theme', theme);
  }, [theme]);

  useEffect(() => {
    const sync = () => setDataStore(loadDataStore());
    const onVisibility = () => { if (document.visibilityState === 'visible') sync(); };
    window.addEventListener('storage', sync);
    window.addEventListener('focus', sync);
    document.addEventListener('visibilitychange', onVisibility);
    return () => {
      window.removeEventListener('storage', sync);
      window.removeEventListener('focus', sync);
      document.removeEventListener('visibilitychange', onVisibility);
    };
  }, []);

  const onLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    try {
      const token = await apiLogin(username, password);
      localStorage.setItem('adminJwt', token);
      setIsAuthed(true);
      const data = await apiGetAll();
      setDataStore(data as unknown as DataStore);
    } catch {
      setError('Kullanıcı adı veya şifre hatalı');
    }
  };

  const onLogout = () => {
    localStorage.removeItem('adminJwt');
    setIsAuthed(false);
    setUsername('');
    setPassword('');
  };

  useEffect(() => {
    const load = async () => {
      try {
        const data = await apiGetAll();
        setDataStore(data as unknown as DataStore);
      } catch {
        // ignore
      }
    };
    load();
  }, []);

  return (
    <div className={`min-h-screen transition-colors duration-300 ${theme === 'dark' ? 'bg-gray-900' : 'bg-gray-100'}`}>
      <header className={`${theme === 'dark' ? 'bg-gray-900' : 'bg-white'} brand-gradient border-b ${theme === 'dark' ? 'border-gray-800' : 'border-gray-200'}`}>
        <div className="max-w-7xl mx-auto px-4 py-6 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className={`h-10 w-10 rounded-lg flex items-center justify-center ${theme === 'dark' ? 'bg-blue-600/20' : 'bg-blue-600/10'}`}>
                <CalendarDays className="h-6 w-6 text-blue-600" />
              </div>
              <h1 className={`text-2xl font-semibold tracking-tight ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>Admin</h1>
            </div>
            <div className="flex items-center space-x-3">
              <button
                onClick={() => setTheme(prev => prev === 'light' ? 'dark' : 'light')}
                className={`px-3 py-2 rounded-lg brand-card transform transition-all duration-200 hover:scale-105 focus:outline-none focus:ring-2 focus:ring-offset-2 ${
                  theme === 'dark' ? 'bg-gray-800 text-gray-200 border border-gray-700 focus:ring-blue-500' : 'bg-white text-gray-900 border border-gray-200 focus:ring-blue-400'
                }`}
              >
                {theme === 'dark' ? 'Light' : 'Dark'}
              </button>
              {isAuthed && (
                <button
                  onClick={onLogout}
                  className={`px-3 py-2 rounded-lg brand-card transform transition-all duration-200 hover:scale-105 focus:outline-none focus:ring-2 focus:ring-offset-2 bg-red-600 text-white hover:bg-red-500 focus:ring-red-500 flex items-center gap-2`}
                >
                  <LogOut className="h-4 w-4" />
                  Çıkış
                </button>
              )}
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        {!isAuthed ? (
          <div className={`max-w-md mx-auto rounded-xl shadow-lg p-6 ${theme === 'dark' ? 'bg-gray-800' : 'bg-white'}`}>
            <h2 className={`text-xl font-semibold mb-4 ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>Giriş Yap</h2>
            <form onSubmit={onLogin} className="space-y-4">
              <div>
                <label className={`block mb-1 ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>Kullanıcı Adı</label>
                <input
                  className={`w-full px-3 py-2 rounded-lg border ${theme === 'dark' ? 'bg-gray-700 border-gray-600 text-gray-100' : 'bg-white border-gray-300 text-gray-900'}`}
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                />
              </div>
              <div>
                <label className={`block mb-1 ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>Şifre</label>
                <input
                  type="password"
                  className={`w-full px-3 py-2 rounded-lg border ${theme === 'dark' ? 'bg-gray-700 border-gray-600 text-gray-100' : 'bg-white border-gray-300 text-gray-900'}`}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </div>
              {error && <div className="text-red-500 text-sm">{error}</div>}
              <button type="submit" className={`w-full px-4 py-2 rounded-lg font-medium ${theme === 'dark' ? 'bg-blue-600 hover:bg-blue-500 text-white' : 'bg-blue-600 hover:bg-blue-500 text-white'}`}>Giriş</button>
            </form>
            <div className={`text-xs mt-3 ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>
              Varsayılan bilgiler: admin / admin123!
            </div>
          </div>
        ) : (
          <AdminPanel
            data={dataStore}
            setData={setDataStore}
            theme={theme}
            onUpsert={async (category, previousDateKey, ev) => {
              await apiUpsert(category as any, { ...ev, category: category as any });
              const data = await apiGetAll();
              return data as unknown as DataStore;
            }}
            onDelete={async (category, dateKey) => {
              await apiDelete(category as any, dateKey);
              const data = await apiGetAll();
              return data as unknown as DataStore;
            }}
          />
        )}
      </main>
    </div>
  );
}


