import React, { useState, useEffect } from 'react';
import { Calendar } from './components/Calendar';
import { turkishMonths, calendarData } from './data';
import type { DataStore } from './types';
import { apiGetAll } from './api';
import { CalendarDays, Moon, Sun } from 'lucide-react';

function App() {
  const [selectedYear, setSelectedYear] = useState<number>(2026);
  const [selectedMonth, setSelectedMonth] = useState<number | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<'analizler' | 'etkinlikler' | 'haberler'>('analizler');
  const [theme, setTheme] = useState(() => {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('theme') || 'light';
    }
    return 'light';
  });
  const [dataStore, setDataStore] = useState<DataStore>(calendarData);

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('theme', theme);
  }, [theme]);

  useEffect(() => {
    const load = async () => {
      try {
        const data = await apiGetAll();
        setDataStore(data as unknown as DataStore);
      } catch {
        // keep fallback calendarData
      }
    };
    load();
    const onFocus = () => load();
    window.addEventListener('focus', onFocus);
    return () => window.removeEventListener('focus', onFocus);
  }, []);

  const toggleTheme = () => {
    setTheme(prevTheme => prevTheme === 'light' ? 'dark' : 'light');
  };

  return (
    <div className={`min-h-screen transition-colors duration-300 ${theme === 'dark' ? 'bg-gray-900' : 'bg-gray-50'}`}>
      <header className={`${theme === 'dark' ? 'bg-gray-900' : 'bg-white'} brand-gradient border-b ${theme === 'dark' ? 'border-gray-800' : 'border-gray-200'}`}>
        <div className="max-w-7xl mx-auto px-4 py-6 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4 fade-in">
              <div className={`h-10 w-10 rounded-lg flex items-center justify-center ${theme === 'dark' ? 'bg-blue-600/20' : 'bg-blue-600/10'}`}>
                <CalendarDays className="h-6 w-6 text-blue-600" />
              </div>
              <div>
                <h1 className={`text-2xl font-semibold tracking-tight ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>Araştırma Dekanlığı Analiz Takvimi</h1>
                <p className={`text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>Kurumsal planlama ve görünürlük</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="relative">
                <select
                  className={`
                    appearance-none cursor-pointer
                    px-4 py-2 pr-10 rounded-lg brand-card
                    focus:outline-none focus:ring-2 focus:ring-offset-2
                    transform transition-all duration-200 hover:scale-105
                    ${theme === 'dark' 
                      ? 'bg-gray-800 text-gray-200 border border-gray-700 hover:bg-gray-700 focus:ring-blue-500'
                      : 'bg-white text-gray-900 border border-gray-200 hover:bg-gray-50 focus:ring-blue-400'
                    }
                  `}
                  value={selectedYear}
                  onChange={(e) => setSelectedYear(Number(e.target.value))}
                >
                  <option value="2025" className={`${theme === 'dark' ? 'text-gray-200 bg-gray-700' : 'text-gray-900 bg-white'}`}>2025</option>
                  <option value="2026" className={`${theme === 'dark' ? 'text-gray-200 bg-gray-700' : 'text-gray-900 bg-white'}`}>2026</option>
                </select>
                <div className={`
                  pointer-events-none absolute inset-y-0 right-0 flex items-center px-2
                  ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}
                `}>
                  <svg className="h-5 w-5" fill="none" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24" stroke="currentColor">
                    <path d="M19 9l-7 7-7-7"></path>
                  </svg>
                </div>
              </div>
              <div className="relative">
                <select
                  className={`
                    appearance-none cursor-pointer
                    px-4 py-2 pr-10 rounded-lg brand-card
                    focus:outline-none focus:ring-2 focus:ring-offset-2
                    transform transition-all duration-200 hover:scale-105
                    ${theme === 'dark' 
                      ? 'bg-gray-800 text-gray-200 border border-gray-700 hover:bg-gray-700 focus:ring-blue-500'
                      : 'bg-white text-gray-900 border border-gray-200 hover:bg-gray-50 focus:ring-blue-400'
                    }
                  `}
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value as 'analizler' | 'etkinlikler' | 'haberler')}
                >
                  <option value="analizler" className={`${theme === 'dark' ? 'text-gray-200 bg-gray-700' : 'text-gray-900 bg-white'}`}>Analizler</option>
                  <option value="etkinlikler" className={`${theme === 'dark' ? 'text-gray-200 bg-gray-700' : 'text-gray-900 bg-white'}`}>Etkinlikler</option>
                  <option value="haberler" className={`${theme === 'dark' ? 'text-gray-200 bg-gray-700' : 'text-gray-900 bg-white'}`}>Haberler</option>
                </select>
                <div className={`
                  pointer-events-none absolute inset-y-0 right-0 flex items-center px-2
                  ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}
                `}>
                  <svg className="h-5 w-5" fill="none" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24" stroke="currentColor">
                    <path d="M19 9l-7 7-7-7"></path>
                  </svg>
                </div>
              </div>
              <div className="relative">
                <select
                  className={`
                    appearance-none cursor-pointer
                    px-4 py-2 pr-10 rounded-lg brand-card
                    focus:outline-none focus:ring-2 focus:ring-offset-2
                    transform transition-all duration-200 hover:scale-105
                    ${theme === 'dark'
                      ? 'bg-gray-800 text-gray-200 border border-gray-700 hover:bg-gray-700 focus:ring-blue-500'
                      : 'bg-white text-gray-900 border border-gray-200 hover:bg-gray-50 focus:ring-blue-400'
                    }
                  `}
                  value={selectedMonth || ''}
                  onChange={(e) => setSelectedMonth(e.target.value ? Number(e.target.value) : null)}
                >
                  <option value="" className={`${theme === 'dark' ? 'text-gray-200 bg-gray-700' : 'text-gray-900 bg-white'}`}>Tüm Aylar</option>
                  {turkishMonths.map((month, index) => (
                    <option 
                      key={month} 
                      value={index + 1}
                      className={`${theme === 'dark' ? 'text-gray-200 bg-gray-700' : 'text-gray-900 bg-white'}`}
                    >
                      {month}
                    </option>
                  ))}
                </select>
                <div className={`
                  pointer-events-none absolute inset-y-0 right-0 flex items-center px-2
                  ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}
                `}>
                  <svg className="h-5 w-5" fill="none" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24" stroke="currentColor">
                    <path d="M19 9l-7 7-7-7"></path>
                  </svg>
                </div>
              </div>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto py-8 sm:px-6 lg:px-8 fade-in">
        <Calendar
          events={dataStore[selectedCategory]}
          selectedMonth={selectedMonth}
          selectedYear={selectedYear}
          theme={theme}
        />
      </main>

      {/* Fixed Theme Toggle Button */}
      <button
        onClick={toggleTheme}
        className={`
          fixed bottom-6 right-6 p-3 rounded-full brand-card
          transform transition-all duration-300
          hover:scale-110 hover:rotate-12
          focus:outline-none focus:ring-2 focus:ring-offset-2
          ${theme === 'dark'
            ? 'bg-yellow-400 text-gray-900 hover:bg-yellow-300 focus:ring-yellow-500'
            : 'bg-gray-800 text-yellow-300 hover:bg-gray-700 focus:ring-gray-500'
          }
        `}
        aria-label="Toggle Theme"
      >
        {theme === 'dark' ? (
          <Sun className="h-6 w-6 transform transition-transform" />
        ) : (
          <Moon className="h-6 w-6 transform transition-transform" />
        )}
      </button>
    </div>
  );
}

export default App;
