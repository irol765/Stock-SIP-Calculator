import React from 'react';
import { 
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend, AreaChart, Area
} from 'recharts';
import { SimulationResult, CalculatorState } from '../types';
import { formatCurrencyValue } from '../utils/calculations';

interface ResultsSectionProps {
  results: SimulationResult[];
  state: CalculatorState;
  t: any; // Translation object
}

export const ResultsSection: React.FC<ResultsSectionProps> = ({ results, state, t }) => {
  const finalResult = results[results.length - 1];
  const totalGain = finalResult.value - finalResult.invested;
  const totalReturnPercent = (totalGain / finalResult.invested) * 100;

  const formatCurrency = (val: number) => formatCurrencyValue(val, state.currency);
  const today = new Date().toLocaleDateString();

  return (
    <>
      {/* PAGE 1: COVER PAGE (Print Only) */}
      <div className="print-cover-page">
          <div className="w-full max-w-2xl border-b-4 border-primary-600 pb-8 mb-12">
             <h1 className="text-5xl font-bold text-gray-900 mb-4 tracking-tight">{t.appTitle}</h1>
             <p className="text-2xl text-gray-500 uppercase tracking-widest font-light">Investment Simulation Report</p>
          </div>
          
          <div className="w-full max-w-2xl space-y-8">
             <div className="grid grid-cols-2 gap-8 text-lg">
                <div>
                   <p className="text-gray-500 uppercase text-sm mb-1">Generated On</p>
                   <p className="font-semibold">{today}</p>
                </div>
                <div>
                   <p className="text-gray-500 uppercase text-sm mb-1">Currency</p>
                   <p className="font-semibold">{state.currency}</p>
                </div>
             </div>

             <div className="bg-gray-50 p-8 rounded-xl border border-gray-200">
                 <h3 className="text-xl font-bold mb-6 text-gray-800 border-b pb-2">Simulation Parameters</h3>
                 <div className="grid grid-cols-2 gap-y-6">
                    <div>
                        <p className="text-gray-500 text-sm">Monthly Contribution</p>
                        <p className="text-xl font-medium">{formatCurrency(state.monthlyContribution)}</p>
                    </div>
                    <div>
                        <p className="text-gray-500 text-sm">Initial Investment</p>
                        <p className="text-xl font-medium">{formatCurrency(state.initialInvestment)}</p>
                    </div>
                    <div>
                        <p className="text-gray-500 text-sm">Duration</p>
                        <p className="text-xl font-medium">{state.years} {t.yearsSuffix}</p>
                    </div>
                     <div>
                        <p className="text-gray-500 text-sm">Strategy Type</p>
                        <p className="text-xl font-medium">{state.mode === 'fixed' ? t.fixedRate : t.historicalBacktest}</p>
                    </div>
                 </div>
             </div>

             <div className="bg-gray-50 p-8 rounded-xl border border-gray-200">
                <h3 className="text-xl font-bold mb-4 text-gray-800 border-b pb-2">Portfolio Composition</h3>
                <ul className="space-y-3">
                   {state.portfolio.map(p => (
                       <li key={p.id} className="flex justify-between items-center text-lg">
                          <span className="font-semibold">{p.ticker}</span>
                          <div className="flex space-x-6 text-gray-600">
                             <span>{p.percentage}% Allocation</span>
                             <span>{p.expenseRatio}% Fee</span>
                          </div>
                       </li>
                   ))}
                </ul>
             </div>
          </div>
          
          <div className="absolute bottom-10 text-center w-full text-gray-400 text-sm">
             Private & Confidential • Generated via SIP Calculator
          </div>
      </div>

      {/* PAGE 2: DATA & CHARTS */}
      <div className="space-y-6 print-page-2">
        
        {/* Print Header for Page 2 */}
        <div className="hidden print:block mb-8 border-b-2 border-gray-200 pb-4">
           <h2 className="text-2xl font-bold text-gray-900">Analysis Data</h2>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-sm border border-gray-200 dark:border-gray-700 print-break-inside">
            <p className="text-sm font-medium text-gray-500 dark:text-gray-400">{t.totalInvested}</p>
            <p className="text-2xl font-bold text-gray-900 dark:text-white mt-2">{formatCurrency(finalResult.invested)}</p>
          </div>
          <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-sm border border-gray-200 dark:border-gray-700 print-break-inside">
            <p className="text-sm font-medium text-gray-500 dark:text-gray-400">{t.finalValue}</p>
            <p className="text-2xl font-bold text-primary-600 dark:text-primary-400 mt-2">{formatCurrency(finalResult.value)}</p>
          </div>
          <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-sm border border-gray-200 dark:border-gray-700 print-break-inside">
            <p className="text-sm font-medium text-gray-500 dark:text-gray-400">{t.totalReturn}</p>
            <div className="flex items-baseline mt-2 space-x-2">
               <p className={`text-2xl font-bold ${totalGain >= 0 ? 'text-green-500' : 'text-red-500'}`}>
                 {totalReturnPercent.toFixed(2)}%
               </p>
               <span className="text-sm text-gray-500">({formatCurrency(totalGain)})</span>
            </div>
          </div>
        </div>

        {/* Chart */}
        <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-sm border border-gray-200 dark:border-gray-700 print-break-inside">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-6">{t.growthProjection}</h3>
          <div className="h-[400px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={results} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#0ea5e9" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#0ea5e9" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E5E7EB" className="dark:opacity-10" />
                <XAxis 
                  dataKey="year" 
                  stroke="#9CA3AF" 
                  tick={{fill: '#9CA3AF', fontSize: 12}} 
                  tickLine={false}
                  axisLine={false}
                />
                <YAxis 
                  stroke="#9CA3AF" 
                  tick={{fill: '#9CA3AF', fontSize: 12}} 
                  tickFormatter={(value) => {
                     if (value >= 1000000) return `${(value/1000000).toFixed(1)}M`;
                     if (value >= 1000) return `${(value/1000).toFixed(0)}k`;
                     return value;
                  }}
                  tickLine={false}
                  axisLine={false}
                />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: 'rgba(255, 255, 255, 0.9)', 
                    borderRadius: '12px', 
                    border: 'none', 
                    boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)' 
                  }}
                  formatter={(value: number) => [formatCurrency(value), '']}
                />
                <Legend />
                <Area 
                  type="monotone" 
                  dataKey="value" 
                  name={t.finalValue}
                  stroke="#0ea5e9" 
                  fillOpacity={1} 
                  fill="url(#colorValue)" 
                  strokeWidth={3}
                />
                <Area 
                  type="monotone" 
                  dataKey="invested" 
                  name={t.totalInvested}
                  stroke="#9CA3AF" 
                  fill="transparent" 
                  strokeDasharray="5 5" 
                  strokeWidth={2}
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </>
  );
};