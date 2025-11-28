import React from 'react';
import { CalculatorState, PortfolioItem, RiskLevel } from '../types';
import { COMMON_TICKERS, COLORS, PORTFOLIO_PRESETS, CURRENCY_SYMBOLS, DEFAULT_EXPENSE_RATIOS } from '../constants';
import { calculateHistoricalAverage, calculateWeightedExpenseRatio } from '../utils/calculations';

interface InputFormProps {
  state: CalculatorState;
  onChange: (updates: Partial<CalculatorState>) => void;
  t: any; // Translation object
}

export const InputForm: React.FC<InputFormProps> = ({ state, onChange, t }) => {
  
  const currentAvgReturn = React.useMemo(() => calculateHistoricalAverage(state.portfolio), [state.portfolio]);
  const currentExpenseRatio = React.useMemo(() => calculateWeightedExpenseRatio(state.portfolio), [state.portfolio]);
  
  const symbol = CURRENCY_SYMBOLS[state.currency];
  
  // Use 2025 as the reference "Now" to match data context
  const CURRENT_YEAR = 2025;

  const handlePortfolioChange = (id: string, field: keyof PortfolioItem, value: any) => {
    const updatedPortfolio = state.portfolio.map(p => {
      if (p.id === id) {
        // If changing ticker, try to autofill expense ratio if we know it
        if (field === 'ticker') {
           const defaultExp = DEFAULT_EXPENSE_RATIOS[value] !== undefined ? DEFAULT_EXPENSE_RATIOS[value] : p.expenseRatio;
           return { ...p, ticker: value, expenseRatio: defaultExp };
        }
        return { ...p, [field]: value };
      }
      return p;
    });
    onChange({ portfolio: updatedPortfolio });
  };

  const addPortfolioItem = () => {
    if (state.portfolio.length >= 8) return;
    const newItem: PortfolioItem = {
      id: Math.random().toString(36).substr(2, 9),
      ticker: COMMON_TICKERS[0],
      percentage: 0,
      expenseRatio: DEFAULT_EXPENSE_RATIOS[COMMON_TICKERS[0]] || 0.03
    };
    onChange({ portfolio: [...state.portfolio, newItem] });
  };

  const removePortfolioItem = (id: string) => {
    if (state.portfolio.length <= 1) return;
    onChange({ portfolio: state.portfolio.filter(p => p.id !== id) });
  };

  const applyPreset = (risk: RiskLevel) => {
    const preset = PORTFOLIO_PRESETS.find(p => p.risk === risk);
    if (!preset) return;

    const newPortfolio = preset.items.map(item => ({
      ...item,
      id: Math.random().toString(36).substr(2, 9)
    }));
    
    const avgReturn = calculateHistoricalAverage(newPortfolio as PortfolioItem[]);

    onChange({ 
      portfolio: newPortfolio as PortfolioItem[],
      annualReturn: Number(avgReturn.toFixed(2)) 
    });
  };

  const handleModeSwitch = (newMode: 'fixed' | 'historical') => {
    if (newMode === state.mode) return;
    
    if (newMode === 'fixed') {
      onChange({ mode: newMode, years: 10, startYear: CURRENT_YEAR - 10 });
    } else {
      const duration = state.years;
      const newStartYear = CURRENT_YEAR - duration;
      onChange({ mode: newMode, startYear: newStartYear, years: duration });
    }
  };

  const handleStartYearChange = (year: number) => {
    if (state.mode === 'historical') {
       onChange({ startYear: year, years: CURRENT_YEAR - year });
    } else {
       onChange({ startYear: year });
    }
  };

  const handleDurationChange = (years: number) => {
    if (state.mode === 'historical') {
       onChange({ years: years, startYear: CURRENT_YEAR - years });
    } else {
       onChange({ years: years });
    }
  };

  const totalAllocation = state.portfolio.reduce((sum, item) => sum + item.percentage, 0);
  const maxYears = 40; 
  const minStartYear = CURRENT_YEAR - maxYears; // 1985
  const effectiveStartYear = state.startYear || (CURRENT_YEAR - state.years);

  return (
    <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-200 dark:border-gray-700 p-6 space-y-8 no-print-section">
      
      {/* Simulation Mode */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white flex items-center">
          <svg className="w-5 h-5 mr-2 text-primary-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4" /></svg>
          {t.simulationSettings}
        </h3>
        <div className="grid grid-cols-2 gap-4">
          <button
            onClick={() => handleModeSwitch('fixed')}
            className={`px-4 py-3 rounded-xl border text-sm font-medium transition-all ${state.mode === 'fixed' ? 'border-primary-500 bg-primary-50 dark:bg-primary-900/20 text-primary-700 dark:text-primary-400' : 'border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-700'}`}
          >
            {t.fixedRate}
          </button>
          <button
            onClick={() => handleModeSwitch('historical')}
            className={`px-4 py-3 rounded-xl border text-sm font-medium transition-all ${state.mode === 'historical' ? 'border-primary-500 bg-primary-50 dark:bg-primary-900/20 text-primary-700 dark:text-primary-400' : 'border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-700'}`}
          >
            {t.historicalBacktest}
          </button>
        </div>
      </div>

      {/* Basic Inputs */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-2">
          <label className="text-sm font-medium text-gray-700 dark:text-gray-300">{t.initialInvestment} ({symbol})</label>
          <input
            type="number"
            value={Math.round(state.initialInvestment)}
            onChange={(e) => onChange({ initialInvestment: Number(e.target.value) })}
            className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none transition-shadow"
          />
        </div>
        <div className="space-y-2">
          <label className="text-sm font-medium text-gray-700 dark:text-gray-300">{t.monthlyContribution} ({symbol})</label>
          <input
            type="number"
            value={Math.round(state.monthlyContribution)}
            onChange={(e) => onChange({ monthlyContribution: Number(e.target.value) })}
            className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none transition-shadow"
          />
        </div>
        
        {/* Start Year */}
        <div className="space-y-2">
           <label className="text-sm font-medium text-gray-700 dark:text-gray-300">{t.startYear}</label>
           <select
              value={effectiveStartYear}
              onChange={(e) => handleStartYearChange(Number(e.target.value))}
              className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none"
           >
             {Array.from({ length: 41 }, (_, i) => minStartYear + i).reverse().map(year => (
               <option key={year} value={year}>{year}</option>
             ))}
           </select>
        </div>

        {/* Duration Slider */}
        <div className="space-y-2">
          <label className="text-sm font-medium text-gray-700 dark:text-gray-300">{t.duration}</label>
          <input
            type="range"
            min="1"
            max={maxYears}
            value={Math.min(state.years, maxYears)}
            onChange={(e) => handleDurationChange(Number(e.target.value))}
            className="w-full h-2 bg-gray-200 dark:bg-gray-600 rounded-lg appearance-none cursor-pointer accent-primary-600"
          />
          <div className="text-right text-xs text-gray-500 dark:text-gray-400 font-mono">
            {Math.min(state.years, maxYears)} {t.yearsSuffix} (Max: {maxYears})
          </div>
        </div>

        {state.mode === 'fixed' && (
          <div className="space-y-2">
             <div className="flex justify-between items-center h-5">
               <label className="text-sm font-medium text-gray-700 dark:text-gray-300">{t.expectedReturn}</label>
             </div>
             <input
              type="number"
              value={state.annualReturn}
              onChange={(e) => onChange({ annualReturn: Number(e.target.value) })}
              className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none"
             />
             <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
               {t.avgReturnNote} {currentAvgReturn.toFixed(2)}%
               <button 
                onClick={() => onChange({ annualReturn: Number(currentAvgReturn.toFixed(2)) })}
                className="ml-2 text-primary-500 hover:text-primary-600 underline focus:outline-none"
               >
                 ({t.useThisRate})
               </button>
             </p>
          </div>
        )}
        
        {/* Inflation Rate Input */}
        <div className="space-y-2">
          <div className="flex justify-between items-center h-5">
            <label className="text-sm font-medium text-gray-700 dark:text-gray-300">{t.inflationRate}</label>
          </div>
          <input
            type="number"
            step="0.1"
            value={state.inflationRate}
            onChange={(e) => onChange({ inflationRate: Number(e.target.value) })}
            className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none transition-shadow"
          />
          {state.mode === 'fixed' && (
            <div className="text-xs opacity-0 select-none pointer-events-none" aria-hidden="true">Spacer</div>
          )}
        </div>
      </div>

      {/* Dividend Reinvestment Toggle */}
      <div className="flex items-start space-x-3 p-3 bg-gray-50 dark:bg-gray-700/30 rounded-lg border border-gray-100 dark:border-gray-700">
        <div className="flex items-center h-5">
          <input
            id="reinvest"
            type="checkbox"
            checked={state.reinvestDividends}
            onChange={(e) => onChange({ reinvestDividends: e.target.checked })}
            className="w-4 h-4 text-primary-600 bg-gray-100 border-gray-300 rounded focus:ring-primary-500 dark:focus:ring-primary-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
          />
        </div>
        <div className="ml-2 text-sm">
          <label htmlFor="reinvest" className="font-medium text-gray-900 dark:text-gray-300">
            {t.reinvestDividends}
          </label>
          <p className="text-gray-500 dark:text-gray-400 text-xs mt-0.5">
            {t.reinvestDividendsDesc}
          </p>
        </div>
      </div>

      {/* Portfolio Allocation */}
      <div className="space-y-4 pt-4 border-t border-gray-200 dark:border-gray-700">
         <div className="flex justify-between items-center">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">{t.strategies} / {t.portfolioAllocation}</h3>
            <span className="text-xs text-orange-500 bg-orange-50 dark:bg-orange-900/20 px-2 py-1 rounded">
               {t.weightedExpense}: {(currentExpenseRatio * 100).toFixed(2)}%
            </span>
         </div>
         
         {/* Strategy Buttons */}
         <div className="flex gap-2">
            <button onClick={() => applyPreset('conservative')} className="flex-1 h-10 px-1 text-xs sm:text-sm bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-300 border border-green-200 dark:border-green-800 rounded-lg hover:bg-green-100 dark:hover:bg-green-900/30 transition-colors">
              {t.conservative}
            </button>
            <button onClick={() => applyPreset('balanced')} className="flex-1 h-10 px-1 text-xs sm:text-sm bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-300 border border-blue-200 dark:border-blue-800 rounded-lg hover:bg-blue-100 dark:hover:bg-blue-900/30 transition-colors">
              {t.balanced}
            </button>
            <button onClick={() => applyPreset('aggressive')} className="flex-1 h-10 px-1 text-xs sm:text-sm bg-purple-50 dark:bg-purple-900/20 text-purple-700 dark:text-purple-300 border border-purple-200 dark:border-purple-800 rounded-lg hover:bg-purple-100 dark:hover:bg-purple-900/30 transition-colors">
              {t.aggressive}
            </button>
         </div>

         {/* Datalist for suggestions */}
         <datalist id="tickers-list">
             {COMMON_TICKERS.map(tic => <option key={tic} value={tic} />)}
         </datalist>

         <div className="space-y-3 mt-4">
           {state.portfolio.map((item, idx) => (
             <div key={item.id} className="grid grid-cols-12 gap-2 items-center">
               {/* Color Bar */}
               <div className="col-span-1 flex justify-center">
                 <div className="w-1.5 h-8 rounded-full" style={{ backgroundColor: COLORS[idx % COLORS.length] }}></div>
               </div>
               
               {/* Ticker Input */}
               <div className="col-span-4">
                 <input
                   list="tickers-list"
                   value={item.ticker}
                   onChange={(e) => handlePortfolioChange(item.id, 'ticker', e.target.value.toUpperCase())}
                   placeholder={t.tickerPlaceholder || "Type/Select"}
                   className="w-full h-10 px-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white text-sm focus:ring-2 focus:ring-primary-500 outline-none uppercase"
                 />
               </div>

               {/* Percentage Input */}
               <div className="col-span-3 relative h-10">
                  <input
                    type="number"
                    min="0"
                    max="100"
                    value={item.percentage}
                    onChange={(e) => handlePortfolioChange(item.id, 'percentage', Number(e.target.value))}
                    className="w-full h-full px-3 pr-7 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white text-sm focus:ring-2 focus:ring-primary-500 outline-none text-right"
                    placeholder="%"
                  />
                  <span className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 text-xs pointer-events-none">%</span>
               </div>

               {/* Expense Ratio Input - Unified Height & Font */}
               <div className="col-span-3 relative h-10">
                 <input
                    type="number"
                    min="0"
                    step="0.01"
                    value={item.expenseRatio}
                    onChange={(e) => handlePortfolioChange(item.id, 'expenseRatio', Number(e.target.value))}
                    className="w-full h-full px-3 pr-7 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white text-sm focus:ring-2 focus:ring-primary-500 outline-none text-right"
                    placeholder="Fee"
                    title={t.expenseRatio}
                  />
                  <span className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 text-xs pointer-events-none">%</span>
               </div>

               {/* Delete Button */}
               <div className="col-span-1 flex justify-end">
                 <button
                   onClick={() => removePortfolioItem(item.id)}
                   className="p-1.5 text-gray-400 hover:text-red-500 transition-colors"
                 >
                   <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                 </button>
               </div>
             </div>
           ))}
         </div>
         
         <div className="flex justify-between items-center mt-2">
            <span className={`text-sm font-bold ${totalAllocation === 100 ? 'text-green-500' : 'text-red-500'}`}>
              {t.total}: {totalAllocation}%
            </span>
             <button
               onClick={addPortfolioItem}
               disabled={state.portfolio.length >= 8}
               className="text-sm text-primary-600 hover:text-primary-700 font-medium"
             >
               {t.addETF}
             </button>
         </div>
      </div>
    </div>
  );
};
