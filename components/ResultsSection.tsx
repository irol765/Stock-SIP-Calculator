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
    <div className="space-y-6">
       {/* Professional Print Header - Hidden on screen */}
      <div className="print-header-container">
        <div className="flex justify-between items-end">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-1">{t.appTitle}</h1>
            <p className="text-sm text-gray-500 uppercase tracking-wider">Investment Simulation Report</p>
          </div>
          <div className="text-right">
            <p className="text-sm text-gray-600">Date: {today}</p>
          </div>
        </div>
        
        <div className="grid grid-cols-3 gap-4 mt-6 p-4 bg-gray-50 rounded-lg border border-gray-200">
           <div>
             <span className="text-xs text-gray-500 uppercase block">Monthly</span>
             <span className="font-semibold">{formatCurrency(state.monthlyContribution)}</span>
           </div>
           <div>
             <span className="text-xs text-gray-500 uppercase block">Duration</span>
             <span className="font-semibold">{state.years} {t.yearsSuffix}</span>
           </div>
           <div>
             <span className="text-xs text-gray-500 uppercase block">Strategy</span>
             <span className="font-semibold">{state.mode === 'fixed' ? `${t.fixedRate} (${state.annualReturn}%)` : t.historicalBacktest}</span>
           </div>
        </div>
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
      
      {/* Print Footer - Hidden on screen */}
      <div className="print-footer-container">
        <p>Generated by US Stock SIP Calculator &bull; This report is for informational purposes only and does not constitute financial advice.</p>
      </div>
    </div>
  );
};
