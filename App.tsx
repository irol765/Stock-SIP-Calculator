import React, { useState, useEffect, useMemo } from 'react';
import { Layout } from './components/Layout';
import { InputForm } from './components/InputForm';
import { ResultsSection } from './components/ResultsSection';
import { AIAnalysis } from './components/AIAnalysis';
import { CalculatorState, Language, Currency } from './types';
import { calculateSIP } from './utils/calculations';
import { TRANSLATIONS, EXCHANGE_RATES } from './constants';

const App = () => {
  // Theme State
  const [darkMode, setDarkMode] = useState(false);
  const [language, setLanguage] = useState<Language>('en');

  // Calculator State
  const [state, setState] = useState<CalculatorState>({
    monthlyContribution: 500,
    initialInvestment: 1000,
    years: 10,
    annualReturn: 10, // Default 10%
    inflationRate: 2,
    mode: 'fixed',
    startYear: 2014,
    reinvestDividends: true,
    currency: 'USD',
    portfolio: [
      { id: '1', ticker: 'VOO', percentage: 100, expenseRatio: 0.03 }
    ]
  });

  // Derived State (Calculations)
  const results = useMemo(() => calculateSIP(state), [state]);
  const t = TRANSLATIONS[language];

  // Effects
  useEffect(() => {
    // Check system preference
    if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
      setDarkMode(true);
    }
    // Check browser language
    const browserLang = navigator.language.slice(0, 2);
    if (browserLang === 'zh') setLanguage('zh');
    if (browserLang === 'ja') setLanguage('ja');
  }, []);

  const handleStateChange = (updates: Partial<CalculatorState>) => {
    setState(prev => ({ ...prev, ...updates }));
  };
  
  const handleCurrencyChange = (newCurrency: Currency) => {
    const oldRate = EXCHANGE_RATES[state.currency];
    const newRate = EXCHANGE_RATES[newCurrency];
    const multiplier = newRate / oldRate;

    setState(prev => ({
      ...prev,
      currency: newCurrency,
      initialInvestment: Math.round(prev.initialInvestment * multiplier),
      monthlyContribution: Math.round(prev.monthlyContribution * multiplier)
    }));
  };

  const toggleTheme = () => setDarkMode(!darkMode);

  const handlePrint = () => {
    window.print();
  };

  return (
    <Layout 
      darkMode={darkMode} 
      toggleTheme={toggleTheme} 
      language={language} 
      setLanguage={setLanguage}
      currency={state.currency}
      setCurrency={handleCurrencyChange}
    >
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Left Col: Inputs */}
        <div className="lg:col-span-4 space-y-6">
          <InputForm state={state} onChange={handleStateChange} t={t} />
          
          <div className="hidden lg:block bg-blue-50 dark:bg-blue-900/20 p-4 rounded-xl border border-blue-100 dark:border-blue-800 no-print">
            <h4 className="font-semibold text-blue-900 dark:text-blue-100 text-sm mb-2">{t.tipsTitle}</h4>
            <ul className="text-xs text-blue-800 dark:text-blue-200 space-y-1 list-disc pl-4">
              {t.tipsList.map((tip: string, i: number) => (
                <li key={i}>{tip}</li>
              ))}
            </ul>
          </div>
        </div>

        {/* Right Col: Visualization */}
        <div className="lg:col-span-8">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white">{t.resultsTitle}</h2>
            <button 
              onClick={handlePrint}
              className="flex items-center space-x-2 px-4 py-2 bg-gray-900 dark:bg-gray-100 text-white dark:text-gray-900 rounded-lg text-sm font-medium hover:opacity-90 transition-opacity no-print"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z" /></svg>
              <span>{t.exportPDF}</span>
            </button>
          </div>

          <ResultsSection results={results} state={state} t={t} />
          
          <AIAnalysis state={state} results={results} language={language} t={t} />
        </div>
      </div>
    </Layout>
  );
};

export default App;