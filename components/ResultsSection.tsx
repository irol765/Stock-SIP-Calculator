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
          <div className="w-full pl-8">
             <div className="mb-2 text-primary-600 font-bold tracking-wider uppercase text-sm">{t.reportTitle}</div>
             <h1 className="text-6xl font-extrabold text-gray-900 mb-6 tracking-tight leading-tight">
               {state.years} {t.yearsSuffix}<br/>{t.investmentPlan}
             </h1>
             <p className="text-2xl text-gray-500 font-light mb-12">
               {t.sipStrategy}
             </p>

             <div className="grid grid-cols-2 gap-12 border-t border-gray-200 pt-12">
                <div>
                   <p className="text-gray-400 uppercase text-xs font-bold tracking-widest mb-2">{t.preparedFor}</p>
                   <p className="text-xl font-semibold text-gray-800">{t.investor}</p>
                </div>
                <div>
                   <p className="text-gray-400 uppercase text-xs font-bold tracking-widest mb-2">{t.generatedOn}</p>
                   <p className="text-xl font-semibold text-gray-800">{today}</p>
                </div>
                <div>
                   <p className="text-gray-400 uppercase text-xs font-bold tracking-widest mb-2">{t.totalInvested}</p>
                   <p className="text-xl font-semibold text-gray-800">{formatCurrency(finalResult.invested)}</p>
                </div>
                <div>
                   <p className="text-gray-400 uppercase text-xs font-bold tracking-widest mb-2">{t.finalValue}</p>
                   <p className="text-xl font-semibold text-primary-600">{formatCurrency(finalResult.value)}</p>
                </div>
             </div>
          </div>
          
          <div className="absolute bottom-12 left-0 w-full text-center text-gray-400 text-xs">
             {t.confidential}
          </div>
      </div>

      {/* PAGE 2: DATA & CHARTS */}
      <div className="space-y-6 print-page-2">
        
        {/* Print Header for Page 2 */}
        <div className="hidden print:block mb-8 pb-4 border-b border-gray-200">
           <div className="flex justify-between items-end">
             <h2 className="text-3xl font-bold text-gray-900 m-0 border-none p-0">{t.analysisData}</h2>
             <span className="text-gray-400 text-sm">Page 2</span>
           </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-sm border border-gray-200 dark:border-gray-700 print-break-inside">
            <p className="text-sm font-medium text-gray-500 dark:text-gray-400">{t.totalInvested}</p>
            <p className="text-2xl font-bold text-gray-900 dark:text-white mt-2">{formatCurrency(finalResult.invested)}</p>
          </div>
          <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-sm border border-gray-200 dark:border-gray-700 print-break-inside relative overflow-hidden">
            <p className="text-sm font-medium text-gray-500 dark:text-gray-400">{t.finalValue}</p>
            <p className="text-2xl font-bold text-primary-600 dark:text-primary-400 mt-2">{formatCurrency(finalResult.value)}</p>
            {/* Real Value (Inflation Adjusted) */}
            <div className="mt-1 flex items-center text-xs text-gray-500 dark:text-gray-400" title={t.inflationAdjusted}>
                <svg className="w-3 h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" /></svg>
                {t.inflationAdjusted}: {formatCurrency(finalResult.inflationAdjustedValue)}
            </div>
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
                  formatter={(value: number, name: string) => {
                    // Just return formatted value and the name (which is now localized via Area prop)
                    return [formatCurrency(value), name];
                  }}
                  labelStyle={{ color: '#374151', fontWeight: 'bold' }}
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

        {/* Parameters Summary (for Page 2 Reference) */}
        <div className="hidden print:block mt-8 pt-8 border-t border-gray-100">
           <h4 className="text-sm font-bold text-gray-500 uppercase tracking-wide mb-4">{t.configTitle}</h4>
           <div className="flex space-x-8 text-sm">
               <div><span className="text-gray-500">{t.monthlyContribution}:</span> <span className="font-semibold">{formatCurrency(state.monthlyContribution)}</span></div>
               <div><span className="text-gray-500">{t.duration}:</span> <span className="font-semibold">{state.years} {t.yearsSuffix}</span></div>
               <div><span className="text-gray-500">{t.startYear}:</span> <span className="font-semibold">{state.startYear || 'N/A'}</span></div>
           </div>
        </div>
      </div>

      {/* PAGE 3: DETAILED TABLE (Print Only) */}
      <div className="hidden print:block pt-8" style={{ pageBreakBefore: 'always' }}>
         <div className="flex justify-between items-end mb-6 border-b border-gray-200 pb-4">
             <h2 className="text-2xl font-bold text-gray-900 m-0">{t.yearlyBreakdown}</h2>
             <span className="text-gray-400 text-sm">{t.appendix}</span>
         </div>
         
         <table className="w-full text-sm text-left border-collapse">
            <thead>
               <tr className="border-b-2 border-gray-800">
                 <th className="py-2 text-gray-600 font-bold">{t.yearColumn}</th>
                 <th className="py-2 text-gray-600 font-bold">{t.totalInvested}</th>
                 <th className="py-2 text-gray-600 font-bold">{t.finalValue}</th>
                 <th className="py-2 text-gray-600 font-bold">{t.inflationAdjusted}</th>
               </tr>
            </thead>
            <tbody>
               {results.map((r, i) => (
                 <tr key={r.year} className={`border-b border-gray-200 ${i % 2 === 0 ? 'bg-gray-50' : ''}`}>
                    <td className="py-2 pl-2 font-mono">{r.year}</td>
                    <td className="py-2">{formatCurrency(r.invested)}</td>
                    <td className="py-2 font-semibold text-gray-900">{formatCurrency(r.value)}</td>
                    <td className="py-2 text-gray-500 italic">{formatCurrency(r.inflationAdjustedValue)}</td>
                 </tr>
               ))}
            </tbody>
         </table>
      </div>
    </>
  );
};
