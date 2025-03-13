import React, { useState, useEffect } from 'react';
import { Calendar } from './components/Calendar';
import { calendarData, turkishMonths } from './data';
import { CalendarDays, Moon, Sun } from 'lucide-react';

function App() {
  const [selectedMonth, setSelectedMonth] = useState<number | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<'analizler' | 'etkinlikler'>('analizler');
  const [theme, setTheme] = useState(() => {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('theme') || 'light';
    }
    return 'light';
  });

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('theme', theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme(prevTheme => prevTheme === 'light' ? 'dark' : 'light');
  };

  return (
    <div className={`min-h-screen transition-colors duration-300 ${
      theme === 'dark' ? 'bg-gray-900' : 'bg-gray-100'
    }`}>
      <header className={`${theme === 'dark' ? 'bg-gray-800' : 'bg-white'} shadow-sm transition-colors duration-300`}>
        <div className="max-w-7xl mx-auto px-4 py-6 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4 fade-in">
              <CalendarDays className="h-8 w-8 text-blue-600" />
              <h1 className={`text-2xl font-bold ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                ARAŞTIRMA DEKANLIĞI Analiz Takvimi
              </h1>
            </div>
            <div className="flex items-center space-x-4">
              <div className="relative">
                <select
                  className={`
                    appearance-none cursor-pointer
                    px-4 py-2 pr-10 rounded-lg shadow-sm
                    focus:outline-none focus:ring-2 focus:ring-offset-2
                    transform transition-all duration-200 hover:scale-105
                    ${theme === 'dark' 
                      ? 'bg-gray-700 text-gray-200 border-gray-600 hover:bg-gray-600 focus:ring-blue-500'
                      : 'bg-white text-gray-900 border-gray-300 hover:bg-gray-50 focus:ring-blue-400'
                    }
                  `}
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value as 'analizler' | 'etkinlikler')}
                >
                  <option value="analizler" className={`${theme === 'dark' ? 'text-gray-200 bg-gray-700' : 'text-gray-900 bg-white'}`}>Analizler</option>
                  <option value="etkinlikler" className={`${theme === 'dark' ? 'text-gray-200 bg-gray-700' : 'text-gray-900 bg-white'}`}>Etkinlikler</option>
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
                    px-4 py-2 pr-10 rounded-lg shadow-sm
                    focus:outline-none focus:ring-2 focus:ring-offset-2
                    transform transition-all duration-200 hover:scale-105
                    ${theme === 'dark'
                      ? 'bg-gray-700 text-gray-200 border-gray-600 hover:bg-gray-600 focus:ring-blue-500'
                      : 'bg-white text-gray-900 border-gray-300 hover:bg-gray-50 focus:ring-blue-400'
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

      <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8 fade-in">
        <Calendar
          events={calendarData[selectedCategory]}
          selectedMonth={selectedMonth}
          theme={theme}
        />
      </main>

      {/* Fixed Theme Toggle Button */}
      <button
        onClick={toggleTheme}
        className={`
          fixed bottom-6 right-6 p-3 rounded-full shadow-lg
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
