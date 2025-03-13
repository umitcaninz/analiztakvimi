import React from 'react';
import { Event } from '../types';
import { turkishMonths, turkishDays } from '../data';
import { Calendar as CalendarIcon } from 'lucide-react';

interface CalendarProps {
  events: Record<string, Event>;
  selectedMonth: number | null;
  theme: string;
}

export const Calendar: React.FC<CalendarProps> = ({ events, selectedMonth, theme }) => {
  const currentYear = 2025;
  const today = new Date();
  const isDark = theme === 'dark';
  
  const getMonthDays = (month: number) => {
    const firstDay = new Date(currentYear, month - 1, 1);
    const lastDay = new Date(currentYear, month, 0);
    const days = [];
    
    // Add empty days for the start of the month
    for (let i = 0; i < firstDay.getDay(); i++) {
      days.push(null);
    }
    
    // Add the days of the month
    for (let i = 1; i <= lastDay.getDate(); i++) {
      days.push(i);
    }
    
    return days;
  };

  const isDatePast = (day: number, month: number) => {
    const date = new Date(currentYear, month - 1, day);
    return date < today;
  };

  const months = selectedMonth ? [selectedMonth] : Array.from({ length: 12 }, (_, i) => i + 1);

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 p-8">
      {months.map((month) => {
        const days = getMonthDays(month);
        const monthEvents = Object.entries(events).filter(
          ([_, event]) => new Date(event.date).getMonth() === month - 1
        ).map(([_, event]) => event);

        return (
          <div key={month} className={`${isDark ? 'bg-gray-800' : 'bg-white'} rounded-lg shadow-lg overflow-hidden transition-colors duration-300`}>
            <div className={`${isDark ? 'bg-blue-700' : 'bg-blue-600'} text-white p-4 flex items-center justify-between`}>
              <h3 className="text-xl font-semibold">{turkishMonths[month - 1]} {currentYear}</h3>
              <CalendarIcon className="h-5 w-5" />
            </div>
            
            <div className="p-4">
              <div className="grid grid-cols-7 gap-1">
                {turkishDays.map(day => (
                  <div key={day} className={`text-center text-sm font-medium ${isDark ? 'text-gray-300' : 'text-gray-600'} p-2`}>
                    {day}
                  </div>
                ))}
                
                {days.map((day, index) => {
                  const dateStr = day ? `${currentYear}-${String(month).padStart(2, '0')}-${String(day).padStart(2, '0')}` : '';
                  const hasEvent = dateStr && events[dateStr];
                  const isPast = day && isDatePast(day, month);
                  
                  return (
                    <div
                      key={index}
                      className={`
                        aspect-square p-1 border ${isDark ? 'border-gray-700' : 'border-gray-100'} relative transition-colors duration-300
                        ${hasEvent ? (isDark ? 'bg-blue-900/30' : 'bg-blue-50') : (isDark ? 'bg-gray-800' : 'bg-white')}
                        ${day ? 'hover:bg-opacity-80' : ''}
                        ${isPast ? 'text-red-500' : (isDark ? 'text-gray-300' : 'text-gray-900')}
                      `}
                    >
                      {day && (
                        <>
                          <span className="text-sm">{day}</span>
                          {hasEvent && (
                            <div className={`absolute bottom-1 right-1 w-2 h-2 ${isDark ? 'bg-blue-500' : 'bg-blue-600'} rounded-full`} />
                          )}
                        </>
                      )}
                    </div>
                  );
                })}
              </div>
              
              {monthEvents.length > 0 && (
                <div className="mt-4 space-y-2">
                  {monthEvents.map(event => {
                    const eventDate = new Date(event.date);
                    const isPast = eventDate < today;
                    
                    return (
                      <div
                        key={event.date}
                        className={`
                          p-3 rounded-lg text-sm border-l-4 shadow-sm hover:shadow-md transition-all relative overflow-hidden
                          ${isPast 
                            ? `${event.is_new 
                                ? (isDark ? 'bg-red-900/30 border-l-red-500' : 'bg-red-50 border-l-red-500')
                                : (isDark ? 'bg-gray-700 border-l-blue-500' : 'bg-gray-50 border-l-blue-500')
                              } opacity-75`
                            : `${event.is_new
                                ? (isDark ? 'bg-green-900/30 border-l-green-500' : 'bg-green-50 border-l-green-500')
                                : (isDark ? 'bg-green-900/20 border-l-green-600' : 'bg-green-50 border-l-green-600')
                              }`
                          }
                        `}
                        style={{
                          background: isDark 
                            ? `linear-gradient(45deg, ${
                                isPast 
                                  ? (event.is_new ? '#7f1d1d30' : '#1f293730')
                                  : (event.is_new ? '#14532d30' : '#14532d20')
                              } 0%, #00000000 100%)`
                            : `linear-gradient(45deg, ${
                                isPast 
                                  ? (event.is_new ? '#FEE2E2' : '#F3F4F6')
                                  : (event.is_new ? '#DCFCE7' : '#DCFCE7')
                              } 0%, white 100%)`
                        }}
                      >
                        <div className={`font-medium mb-1 ${isDark ? 'text-gray-200' : 'text-gray-800'}`}>
                          {eventDate.getDate()} {turkishMonths[month - 1]}
                        </div>
                        <div 
                          className={`
                            ${isDark ? 'text-gray-300' : 'text-gray-700'} 
                            font-light leading-relaxed
                            ${event.link ? 'cursor-pointer hover:underline hover:text-blue-500 transition-colors duration-200' : ''}
                          `}
                          onClick={() => event.link && window.open(event.link, '_blank')}
                        >
                          {event.description}
                        </div>
                        <div className={`absolute top-0 right-0 w-16 h-16 opacity-10 transform rotate-45 translate-x-8 -translate-y-8 bg-gradient-to-br ${
                          isDark ? 'from-gray-300' : 'from-blue-500'
                        } to-transparent`}></div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
};