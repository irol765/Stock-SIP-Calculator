import { GoogleGenAI } from "@google/genai";
import { CalculatorState, SimulationResult, Language } from "../types";
import { formatCurrencyValue } from "../utils/calculations";

const getClient = () => {
  const apiKey = process.env.API_KEY;
  if (!apiKey) return null;
  return new GoogleGenAI({ apiKey });
};

export const generateInvestmentReport = async (
  state: CalculatorState,
  results: SimulationResult[],
  language: Language
): Promise<string> => {
  const ai = getClient();
  if (!ai) return "Please provide an API Key to generate an AI analysis report.";

  const finalResult = results[results.length - 1];
  const totalReturnPercent = ((finalResult.value - finalResult.invested) / finalResult.invested) * 100;
  
  const formatMoney = (val: number) => formatCurrencyValue(val, state.currency);

  let langName = "English";
  if (language === 'zh') langName = "Simplified Chinese (简体中文)";
  if (language === 'ja') langName = "Japanese (日本語)";

  const portfolioDesc = state.portfolio.map(p => `${p.ticker} (${p.percentage}%, Exp: ${p.expenseRatio}%)`).join(', ');

  const prompt = `
    Act as a senior financial analyst. Generate a strictly structured investment report. 
    
    **Inputs:**
    - Strategy: ${state.mode === 'historical' ? 'Historical Backtest' : 'Fixed Rate Projection'}
    - Portfolio: ${portfolioDesc}
    - Duration: ${state.years} years
    - Monthly Contribution: ${formatMoney(state.monthlyContribution)}
    - Total Invested: ${formatMoney(finalResult.invested)}
    - Final Value: ${formatMoney(finalResult.value)}
    - Total Return: ${totalReturnPercent.toFixed(2)}%

    **Output Rules:**
    1. Write strictly in ${langName}.
    2. Do NOT repeat facts or sentences. Be concise.
    3. Do NOT output duplicate content.
    4. Use Markdown for formatting (headers as ###, bold as **).

    **Output Structure (3 Distinct Sections):**

    ### 1. Strategy Summary
    Briefly explain the portfolio composition and the financial result.

    ### 2. Risk & Fee Analysis
    Analyze the risk profile of the assets and the impact of the management fees (expense ratios) on the final wealth.

    ### 3. Professional Outlook
    Provide a professional opinion on holding this specific portfolio for ${state.years} years.
  `;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
    });
    return response.text || "Failed to generate report.";
  } catch (error) {
    console.error("Gemini API Error:", error);
    return "An error occurred while generating the analysis. Please check your API key and try again.";
  }
};