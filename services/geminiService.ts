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
  
  // Calculate CAGR (Compound Annual Growth Rate)
  // Formula: (End Value / Total Invested) ^ (1 / Number of Years) - 1
  // Note: This is a rough approximation for SIP, but effective for prompt context.
  const years = state.years;
  const cagr = (Math.pow(finalResult.value / finalResult.invested, 1 / years) - 1) * 100;

  const formatMoney = (val: number) => formatCurrencyValue(val, state.currency);

  let langName = "English";
  if (language === 'zh') langName = "Simplified Chinese (简体中文)";
  if (language === 'ja') langName = "Japanese (日本語)";

  const portfolioDesc = state.portfolio.map(p => `${p.ticker} (${p.percentage}%, Fee: ${p.expenseRatio}%)`).join(', ');

  const prompt = `
    Role: Act as a **CFA (Chartered Financial Analyst) Level III** portfolio manager. 
    Task: Write a sophisticated, high-level investment strategy review.
    
    **Financial Data Context:**
    - Strategy Type: ${state.mode === 'historical' ? 'Historical Data Backtest' : 'Fixed Rate Projection'}
    - Asset Allocation: ${portfolioDesc}
    - Time Horizon: ${state.years} years
    - Monthly Inflow: ${formatMoney(state.monthlyContribution)}
    - End Portfolio Value: ${formatMoney(finalResult.value)}
    - Total ROI: ${totalReturnPercent.toFixed(2)}%
    - Approx. CAGR (Yield): ${cagr.toFixed(2)}%

    **Strict Guidelines:**
    1. **Language:** ${langName}.
    2. **Tone:** Highly professional, objective, institutional-grade. Avoid casual phrases like "It is good". Use terms like "capital appreciation," "expense drag," "volatility dampening," "risk-adjusted returns," "compounding efficacy."
    3. **No Repetition:** Do NOT repeat the portfolio list. Do NOT loop sentences.
    4. **Formatting:** Use clean Markdown headers (###). For lists, use standard bullet points.

    **Report Structure:**

    ### 1. Performance Attribution
    Analyze the ${totalReturnPercent.toFixed(2)}% return. Discuss the power of compounding over ${state.years} years. If the CAGR is high (>8%), mention "aggressive growth potential"; if lower, mention "preservation focus."

    ### 2. Risk & Expense Analysis
    - **Concentration:** Discuss the diversification level (or lack thereof) of ${portfolioDesc}. Is there sector concentration risk?
    - **Cost Efficiency:** explicit comment on the Expense Ratios. How does low fee maximize the "net-of-fees" return over ${state.years} years?

    ### 3. Strategic Recommendations
    Provide 3 distinct, actionable adjustments for a long-term holder.
    - Suggest specific concepts like "Satellite Allocation" for higher yield or "Bond/Gold hedging" for stability.
    - Mention "Rebalancing" necessity.
    - Mention "Dollar-Cost Averaging" benefits in volatile markets.
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