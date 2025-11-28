import { CalculatorState, SimulationResult, PortfolioItem, Currency } from '../types';
import { HISTORICAL_RETURNS, TICKER_MAPPING, DIVIDEND_YIELDS } from '../constants';

export const calculateWeightedExpenseRatio = (portfolio: PortfolioItem[]): number => {
  let weightedExpense = 0;
  portfolio.forEach(item => {
    // Input is in percent (e.g. 0.03), convert to decimal (0.0003)
    const expenseDecimal = (item.expenseRatio || 0) / 100;
    weightedExpense += expenseDecimal * (item.percentage / 100);
  });
  return weightedExpense;
};

export const calculateHistoricalAverage = (portfolio: PortfolioItem[]): number => {
  // Calculate average return over the available data period (last ~10-14 years)
  // We'll use 2014-2023 as a standard 10y rolling window for simplicity of "Average" suggestion
  const startYear = 2014;
  const endYear = 2023;

  let sumAnnualReturns = 0;
  let count = 0;

  for (let year = startYear; year <= endYear; year++) {
    let yearWeightedReturn = 0;
    
    portfolio.forEach(item => {
      const mainTicker = TICKER_MAPPING[item.ticker] || item.ticker;
      const tickerData = HISTORICAL_RETURNS[mainTicker];
      // Fallback to 8% if ticker data is unknown
      const yearReturn = tickerData && tickerData[year] !== undefined ? tickerData[year] : 0.08;
      yearWeightedReturn += yearReturn * (item.percentage / 100);
    });

    sumAnnualReturns += yearWeightedReturn;
    count++;
  }

  // NOTE: This calculates Gross Return. Expense ratio is subtracted during the actual SIP projection loop.
  return count > 0 ? (sumAnnualReturns / count) * 100 : 8.0;
};

export const calculateSIP = (state: CalculatorState): SimulationResult[] => {
  const results: SimulationResult[] = [];
  let currentValue = state.initialInvestment;
  let totalInvested = state.initialInvestment;
  
  const monthlyContrib = state.monthlyContribution;
  const startYear = state.startYear || 2010;
  
  // Calculate weighted expense ratio for the portfolio based on individual items
  const weightedExpenseRatio = calculateWeightedExpenseRatio(state.portfolio);

  for (let yearOffset = 0; yearOffset <= state.years; yearOffset++) {
    const currentYear = startYear + yearOffset;
    
    // Record start of period (Year 0)
    if (yearOffset === 0) {
      results.push({
        year: currentYear,
        invested: totalInvested,
        value: currentValue,
        growth: 0
      });
      continue;
    }

    // Determine Annual Return Rate for this specific year
    let grossAnnualRate = 0;

    if (state.mode === 'fixed') {
      grossAnnualRate = state.annualReturn / 100;
    } else {
      // Historical Mode: weighted average of that year's returns
      let weightedReturn = 0;
      state.portfolio.forEach(item => {
        const mainTicker = TICKER_MAPPING[item.ticker] || item.ticker;
        const tickerData = HISTORICAL_RETURNS[mainTicker];
        
        // Use historical data or fallback to 8% if unknown
        const yearReturn = tickerData && tickerData[currentYear] !== undefined 
          ? tickerData[currentYear] 
          : 0.08; 
          
        weightedReturn += yearReturn * (item.percentage / 100);
      });
      grossAnnualRate = weightedReturn;
    }

    // Subtract Expense Ratio from Gross Return
    let netAnnualRate = grossAnnualRate - weightedExpenseRatio;

    // Apply Dividend Reinvestment Logic
    if (!state.reinvestDividends) {
      let weightedYield = 0;
      if (state.mode === 'historical') {
         state.portfolio.forEach(item => {
            const y = DIVIDEND_YIELDS[item.ticker] || 0.015; 
            weightedYield += y * (item.percentage / 100);
         });
      } else {
         weightedYield = 0.015; 
      }
      
      // Reduce compounding rate by yield (paid out)
      netAnnualRate = netAnnualRate - weightedYield;
    }

    // Monthly Compounding
    let yearStartValue = currentValue;
    let yearInvested = 0;

    for (let m = 0; m < 12; m++) {
      const monthlyRate = netAnnualRate / 12; 
      yearStartValue = yearStartValue * (1 + monthlyRate) + monthlyContrib;
      yearInvested += monthlyContrib;
    }
    
    currentValue = yearStartValue;
    totalInvested += yearInvested;

    results.push({
      year: currentYear,
      invested: totalInvested,
      value: currentValue,
      growth: currentValue - totalInvested
    });
  }

  return results;
};

export const formatCurrencyValue = (val: number, currency: Currency): string => {
  const localeMap: Record<Currency, string> = {
    'USD': 'en-US',
    'CNY': 'zh-CN',
    'JPY': 'ja-JP',
    'EUR': 'de-DE',
    'GBP': 'en-GB'
  };

  return new Intl.NumberFormat(localeMap[currency], { 
    style: 'currency', 
    currency: currency, 
    maximumFractionDigits: 0 
  }).format(val);
};