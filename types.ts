export interface PortfolioItem {
  id: string;
  ticker: string;
  percentage: number;
  expenseRatio: number; // Percentage, e.g., 0.03 for 0.03%
}

export interface SimulationResult {
  year: number;
  invested: number;
  value: number;
  growth: number;
  inflationAdjustedValue: number;
}

export type SimulationMode = 'fixed' | 'historical';

export type Language = 'en' | 'zh' | 'ja';

export type Currency = 'USD' | 'CNY' | 'JPY' | 'EUR' | 'GBP';

export type RiskLevel = 'conservative' | 'balanced' | 'aggressive';

export interface PortfolioPreset {
  label: string;
  risk: RiskLevel;
  items: Omit<PortfolioItem, 'id'>[];
}

export interface CalculatorState {
  monthlyContribution: number;
  initialInvestment: number;
  years: number;
  annualReturn: number; // For fixed mode
  inflationRate: number;
  portfolio: PortfolioItem[];
  mode: SimulationMode;
  startYear?: number; // For historical mode
  reinvestDividends: boolean;
  currency: Currency;
}

export interface HistoricalData {
  [ticker: string]: {
    [year: number]: number; // Year -> Annual Return % (e.g., 0.15 for 15%)
  };
}