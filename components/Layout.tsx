import React from 'react';
import { Language, Currency } from '../types';
import { TRANSLATIONS } from '../constants';

interface LayoutProps {
  children: React.ReactNode;
  darkMode: boolean;
  toggleTheme: () => void;
  language: Language;
  setLanguage: (lang: Language) => void;
  currency: Currency;
  setCurrency: (curr: Currency) => void;
}

export const Layout: React.FC<LayoutProps> = ({ 
  children, darkMode, toggleTheme, language, setLanguage, currency, setCurrency 
}) => {
  const t = TRANSLATIONS[language];

  return (
    <div className={`min-h-screen flex flex-col ${darkMode ? 'dark' : ''}`}>
      <div className="flex-grow bg-gray-50 dark:bg-gray-900 transition-colors duration-300">
        <header className="sticky top-0 z-50 bg-white/80 dark:bg-gray-800/80 backdrop-blur-md border-b border-gray-200 dark:border-gray-700 no-print">
          <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
            {/* Logo and Title Container */}
            <div className="flex items-center space-x-2 sm:space-x-3 min-w-0 flex-1 mr-1 sm:mr-2">
              <div className="w-7 h-7 sm:w-8 sm:h-8 bg-primary-600 rounded-lg flex items-center justify-center text-white font-bold shadow-lg shadow-primary-500/30 flex-shrink-0">
                <span className="text-sm sm:text-base">
                  {currency === 'USD' ? '$' : currency === 'CNY' || currency === 'JPY' ? '¥' : currency === 'EUR' ? '€' : '£'}
                </span>
              </div>
              
              {/* Responsive Title: Full title on all screens, adjusting size for mobile */}
              <h1 className="text-xs sm:text-xl font-bold text-gray-900 dark:text-white leading-tight min-w-0">
                <span className="text-primary-600 sm:font-light block truncate">
                   {t.appTitle}
                </span>
              </h1>
            </div>
            
            {/* Controls Container - Compact on mobile */}
            <div className="flex items-center space-x-1 sm:space-x-2 flex-shrink-0">
              <select 
                value={currency}
                onChange={(e) => setCurrency(e.target.value as Currency)}
                className="bg-gray-100 dark:bg-gray-700 border-none text-[10px] sm:text-sm rounded-md sm:rounded-lg px-1 sm:px-3 py-1.5 text-gray-700 dark:text-gray-200 focus:ring-2 focus:ring-primary-500 outline-none font-medium max-w-[65px] sm:max-w-none truncate"
              >
                <option value="USD">USD ($)</option>
                <option value="CNY">CNY (¥)</option>
                <option value="JPY">JPY (¥)</option>
                <option value="EUR">EUR (€)</option>
                <option value="GBP">GBP (£)</option>
              </select>

              <select 
                value={language}
                onChange={(e) => setLanguage(e.target.value as Language)}
                className="bg-gray-100 dark:bg-gray-700 border-none text-[10px] sm:text-sm rounded-md sm:rounded-lg px-1 sm:px-3 py-1.5 text-gray-700 dark:text-gray-200 focus:ring-2 focus:ring-primary-500 outline-none max-w-[65px] sm:max-w-none truncate"
              >
                <option value="en">English</option>
                <option value="zh">中文</option>
                <option value="ja">日本語</option>
              </select>

              <button
                onClick={toggleTheme}
                className="p-1.5 sm:p-2 rounded-lg bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors focus:outline-none focus:ring-2 focus:ring-primary-500 flex-shrink-0"
                aria-label="Toggle Dark Mode"
              >
                {darkMode ? (
                  // Sun Icon
                   <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" /></svg>
                ) : (
                  // Moon Icon
                   <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12.79A9 9 0 1111.21 3 7 7 0 0021 12.79z" /></svg>
                )}
              </button>
            </div>
          </div>
        </header>

        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 print:p-0">
          {children}
        </main>
      </div>
    </div>
  );
};
