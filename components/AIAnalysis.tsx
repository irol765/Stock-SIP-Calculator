import React, { useState } from 'react';
import { CalculatorState, SimulationResult, Language } from '../types';
import { generateInvestmentReport } from '../services/geminiService';

interface AIAnalysisProps {
  state: CalculatorState;
  results: SimulationResult[];
  language: Language;
  t: any; // Translations
}

// Improved Simple Markdown Parser
const SimpleMarkdown: React.FC<{ content: string }> = ({ content }) => {
  if (!content) return null;

  const lines = content.split('\n');
  const formattedElements: React.ReactNode[] = [];

  let inList = false;

  lines.forEach((line, index) => {
    const trimmedLine = line.trim();
    if (!trimmedLine) {
        inList = false;
        return;
    }

    // Headers (### or ##)
    if (trimmedLine.startsWith('#')) {
      const level = trimmedLine.match(/^#+/)?.[0].length || 0;
      const text = trimmedLine.replace(/^#+\s*/, '');
      const className = level === 2 
        ? "text-xl font-bold text-gray-900 dark:text-white mt-6 mb-3 border-b border-gray-200 dark:border-gray-700 pb-2 print:text-black"
        : "text-lg font-bold text-gray-800 dark:text-gray-100 mt-4 mb-2 print:text-black";
      
      formattedElements.push(<div key={index} className={className}>{text}</div>);
      inList = false;
    }
    // List Items (Bullet - or * or Numbered 1.)
    else if (trimmedLine.match(/^(\-|\*|\d+\.)\s/)) {
      // Remove the list marker (-, *, 1., 1. -) and any leading weird chars
      const textContent = trimmedLine.replace(/^(\-|\*|\d+\.)\s+/, '').replace(/^[\-\.]\s*/, '');
      
      // Parse Bold inside list
      const parts = textContent.split(/(\*\*.*?\*\*)/g);
      const listContent = parts.map((part, i) => {
        if (part.startsWith('**') && part.endsWith('**')) {
          return <strong key={i} className="font-semibold text-gray-900 dark:text-white print:text-black">{part.slice(2, -2)}</strong>;
        }
        return part;
      });

      formattedElements.push(
        <div key={index} className="flex items-start mb-2 pl-2">
            <span className="mr-2 text-primary-500 mt-1.5 flex-shrink-0 text-[10px]">•</span>
            <p className="text-sm text-gray-700 dark:text-gray-300 leading-relaxed print:text-black">{listContent}</p>
        </div>
      );
      inList = true;
    }
    // Regular Text / Bold parsing
    else {
      const parts = line.split(/(\*\*.*?\*\*)/g);
      const pContent = parts.map((part, i) => {
        if (part.startsWith('**') && part.endsWith('**')) {
          return <strong key={i} className="font-semibold text-gray-900 dark:text-white print:text-black">{part.slice(2, -2)}</strong>;
        }
        return part;
      });

      formattedElements.push(
        <p key={index} className="mb-3 text-sm text-gray-700 dark:text-gray-300 leading-relaxed print:text-black">
          {pContent}
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
    <div className={`mt-6 ${report ? 'print-page-3' : ''}`}>
        
      {/* Screen Card Container / Print Transparent Container */}
      <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-sm border border-gray-200 dark:border-gray-700">
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
    
          {/* Print-only title for the section (Page 3 Header) */}
          {report && (
              <div className="hidden print:block mb-8 border-b-2 border-gray-200 pb-4">
                  <h2 className="text-2xl font-bold text-gray-900">{t.professionalAssessment}</h2>
              </div>
          )}
    
          {report && (
            <div className="prose dark:prose-invert max-w-none">
               <div className="p-4 bg-gray-50 dark:bg-gray-700/50 rounded-xl text-sm leading-relaxed text-gray-700 dark:text-gray-300 print:bg-transparent print:p-0 print:text-base">
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
    </div>
  );
};