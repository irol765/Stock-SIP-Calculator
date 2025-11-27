import React, { useState } from 'react';
import { CalculatorState, SimulationResult, Language } from '../types';
import { generateInvestmentReport } from '../services/geminiService';

interface AIAnalysisProps {
  state: CalculatorState;
  results: SimulationResult[];
  language: Language;
  t: any; // Translations
}

export const AIAnalysis: React.FC<AIAnalysisProps> = ({ state, results, language, t }) => {
  const [report, setReport] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleGenerate = async () => {
    setLoading(true);
    // Clear previous report to show loading properly if retrying
    setReport(null);
    const text = await generateInvestmentReport(state, results, language);
    setReport(text);
    setLoading(false);
  };

  return (
    <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-sm border border-gray-200 dark:border-gray-700 print-break-inside mt-6">
      <div className="flex justify-between items-center mb-4">
         <h3 className="text-lg font-semibold text-gray-900 dark:text-white flex items-center">
           <span className="bg-gradient-to-r from-blue-500 to-purple-500 text-transparent bg-clip-text mr-2">AI</span> 
           {t.aiTitle}
         </h3>
         {!report && (
           <button
            onClick={handleGenerate}
            disabled={loading}
            className="px-4 py-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white text-sm font-medium rounded-lg hover:shadow-lg transition-all disabled:opacity-50 flex items-center"
           >
             {loading ? (
               <>
                 <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
                 {t.generating}
               </>
             ) : (
               t.generateReport
             )}
           </button>
         )}
      </div>

      {report && (
        <div className="prose dark:prose-invert max-w-none">
           <div className="p-4 bg-gray-50 dark:bg-gray-700/50 rounded-xl text-sm leading-relaxed whitespace-pre-line text-gray-700 dark:text-gray-300">
             {report}
           </div>
           <div className="mt-4 flex justify-end no-print">
             <button onClick={() => setReport(null)} className="text-xs text-gray-500 hover:text-gray-700 dark:hover:text-gray-300 underline">
               {t.clearReport}
             </button>
           </div>
        </div>
      )}
      
      {!report && !loading && (
        <p className="text-sm text-gray-500 dark:text-gray-400 italic">
          {t.aiPromptHelp}
        </p>
      )}
    </div>
  );
};