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

  const prompt = `
    Act as a professional financial advisor. Analyze the following systematic investment plan (SIP) simulation and generate a concise, professional report suitable for a PDF export.

    **Investment Details:**
    - Currency: ${state.currency}
    - Monthly Contribution: ${formatMoney(state.monthlyContribution)}
    - Initial Investment: ${formatMoney(state.initialInvestment)}
    - Duration: ${state.years} years
    - Mode: ${state.mode === 'historical' ? 'Historical Backtest' : 'Projected Fixed Rate'}
    - Reinvest Dividends: ${state.reinvestDividends ? 'Yes' : 'No (Cash Payout)'}
    - Portfolio: ${state.portfolio.map(p => `${p.ticker} (${p.percentage}%)`).join(', ')}
    
    **Simulation Results:**
    - Total Invested: ${formatMoney(finalResult.invested)}
    - Final Portfolio Value: ${formatMoney(finalResult.value)}
    - Total Return: ${totalReturnPercent.toFixed(2)}%

    **Requirements:**
    1. Summarize the growth strategy.
    2. Comment on the risk profile based on the selected ETFs (e.g., QQQ is tech-heavy/volatile, VOO is broad market).
    3. Provide a brief outlook or advice on holding this portfolio long-term, considering the currency ${state.currency} and typical expense ratios.
    4. Keep it concise (under 300 words).
    5. Format with clear headings using Markdown.
    6. **IMPORTANT**: Output the response strictly in ${langName}.
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