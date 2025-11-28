import React, { useState } from 'react';
import { CalculatorState, SimulationResult, Language } from '../types';
import { generateInvestmentReport } from '../services/geminiService';

interface AIAnalysisProps {
  state: CalculatorState;
  results: SimulationResult[];
  language: Language;
  t: any; // Translations
}

// Simple Markdown Parser Component to avoid heavy dependencies
const SimpleMarkdown: React.FC<{ content: string }> = ({ content }) => {
  if (!content) return null;

  const lines = content.split('\n');
  const formattedElements: React.ReactNode[] = [];

  let inList = false;

  lines.forEach((line, index) => {
    // Headers (###)
    if (line.startsWith('###')) {
      formattedElements.push(
        <h4 key={index} className="text-md font-bold text-gray-900 dark:text-white mt-4 mb-2 print:text-black">
          {line.replace(/^###\s*/, '')}
        </h4>
      );
      inList = false;
    }
    else if (line.startsWith('##')) {
        formattedElements.push(
          <h3 key={index} className="text-lg font-bold text-gray-900 dark:text-white mt-5 mb-3 print:text-black">
            {line.replace(/^##\s*/, '')}
          </h3>
        );
        inList = false;
      }
    // Bold text (**text**) - Split by double asterisks
    else if (line.includes('**')) {
      const parts = line.split(/(\*\*.*?\*\*)/g);
      const lineContent = parts.map((part, i) => {
        if (part.startsWith('**') && part.endsWith('**')) {
          return <strong key={i} className="font-semibold text-gray-900 dark:text-white print:text-black">{part.slice(2, -2)}</strong>;
        }
        return part;
      });
      
      // List items with bold text
      if (line.trim().startsWith('-') || line.trim().startsWith('* ')) {
         formattedElements.push(
            <li key={index} className="ml-4 list-disc text-gray-700 dark:text-gray-300 mb-1 print:text-black">
                {lineContent.slice(1) /* rudimentary slice to remove the dash/star if it was parsed as string */}
                {/* A safer way for mixed content: */}
                <span className="-ml-1">{line.replace(/^[\-\*]\s/, '').split(/(\*\*.*?\*\*)/g).map((p, k) => 
                    p.startsWith('**') && p.endsWith('**') 
                    ? <strong key={k} className="font-semibold text-gray-900 dark:text-gray-100 print:text-black">{p.slice(2,-2)}</strong> 
                    : p
                )}</span>
            </li>
         );
         inList = true;
      } else {
         formattedElements.push(<p key={index} className="mb-2 text-gray-700 dark:text-gray-300 print:text-black">{lineContent}</p>);
         inList = false;
      }
    }
    // Standard List items
    else if (line.trim().startsWith('- ') || line.trim().startsWith('* ')) {
      formattedElements.push(
        <li key={index} className="ml-4 list-disc text-gray-700 dark:text-gray-300 mb-1 print:text-black">
          {line.replace(/^[\-\*]\s*/, '')}
        </li>
      );
      inList = true;
    }
    // Regular text
    else if (line.trim() !== '') {
      formattedElements.push(
        <p key={index} className="mb-2 text-gray-700 dark:text-gray-300 leading-relaxed print:text-black">
          {line}
        </p>
      );
      inList = false;
    }
  });

  return <div>{formattedElements}</div>;
};

export const AIAnalysis: React.FC<AIAnalysisProps> = ({ state, results, language, t }) => {
  const [report, setReport] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleGenerate = async () => {
    setLoading(true);
    setReport(null);
    const text = await generateInvestmentReport(state, results, language);
    setReport(text);
    setLoading(false);
  };

  return (
    <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-sm border border-gray-200 dark:border-gray-700 print-break-inside mt-6">
      <div className="flex justify-between items-center mb-4 no-print">
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

      {/* Print-only title for the section */}
      {report && <h3 className="hidden print:block text-lg font-bold mb-4 border-b pb-2">Investment Strategy Analysis Report</h3>}

      {report && (
        <div className="prose dark:prose-invert max-w-none">
           <div className="p-4 bg-gray-50 dark:bg-gray-700/50 rounded-xl text-sm leading-relaxed text-gray-700 dark:text-gray-300">
             <SimpleMarkdown content={report} />
           </div>
           <div className="mt-4 flex justify-end no-print">
             <button onClick={() => setReport(null)} className="text-xs text-gray-500 hover:text-gray-700 dark:hover:text-gray-300 underline">
               {t.clearReport}
             </button>
           </div>
        </div>
      )}
      
      {!report && !loading && (
        <p className="text-sm text-gray-500 dark:text-gray-400 italic no-print">
          {t.aiPromptHelp}
        </p>
      )}
    </div>
  );
};
