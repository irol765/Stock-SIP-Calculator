import { HistoricalData, Language, PortfolioPreset, Currency } from './types';

// Approximate annual returns for major ETFs used for backtesting demo
export const HISTORICAL_RETURNS: HistoricalData = {
  'VOO': {
    2010: 0.1506, 2011: 0.0211, 2012: 0.1600, 2013: 0.3239, 2014: 0.1369,
    2015: 0.0138, 2016: 0.1196, 2017: 0.2183, 2018: -0.0438, 2019: 0.3149,
    2020: 0.1840, 2021: 0.2871, 2022: -0.1811, 2023: 0.2629, 2024: 0.1500,
  },
  'QQQ': {
    2010: 0.1993, 2011: 0.0270, 2012: 0.1682, 2013: 0.3499, 2014: 0.1794,
    2015: 0.0843, 2016: 0.0592, 2017: 0.3152, 2018: -0.0104, 2019: 0.3796,
    2020: 0.4758, 2021: 0.2724, 2022: -0.3310, 2023: 0.5381, 2024: 0.1800,
  },
  'SPY': {
     2010: 0.1506, 2011: 0.0211, 2012: 0.1600, 2013: 0.3239, 2014: 0.1369,
     2015: 0.0138, 2016: 0.1196, 2017: 0.2183, 2018: -0.0438, 2019: 0.3149,
     2020: 0.1840, 2021: 0.2871, 2022: -0.1811, 2023: 0.2629, 2024: 0.1500,
  }
};

export const DIVIDEND_YIELDS: Record<string, number> = {
  'VOO': 0.015, 'QQQ': 0.006, 'SPY': 0.015, 'QQQM': 0.006, 'SPYM': 0.015, 'IVV': 0.015
};

// Default expense ratios for common lookups, used when adding new items
export const DEFAULT_EXPENSE_RATIOS: Record<string, number> = {
  'VOO': 0.03,
  'QQQ': 0.20,
  'SPY': 0.09,
  'QQQM': 0.15,
  'SPYM': 0.03,
  'IVV': 0.03
};

export const EXCHANGE_RATES: Record<Currency, number> = {
  'USD': 1.0,
  'CNY': 7.25,
  'JPY': 150.0,
  'EUR': 0.92,
  'GBP': 0.79
};

export const CURRENCY_SYMBOLS: Record<Currency, string> = {
  'USD': '$',
  'CNY': '¥',
  'JPY': '¥',
  'EUR': '€',
  'GBP': '£'
};

export const TICKER_MAPPING: Record<string, string> = {
  'QQQM': 'QQQ', 'SPYM': 'SPY', 'IVV': 'VOO',
};

export const COMMON_TICKERS = ['VOO', 'QQQ', 'SPY', 'QQQM', 'SPYM', 'IVV', 'VTI', 'VT'];
export const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8'];

export const PORTFOLIO_PRESETS: PortfolioPreset[] = [
  {
    label: 'conservative',
    risk: 'conservative',
    items: [{ ticker: 'VOO', percentage: 100, expenseRatio: 0.03 }]
  },
  {
    label: 'balanced',
    risk: 'balanced',
    items: [{ ticker: 'VOO', percentage: 60, expenseRatio: 0.03 }, { ticker: 'QQQ', percentage: 40, expenseRatio: 0.20 }]
  },
  {
    label: 'aggressive',
    risk: 'aggressive',
    items: [{ ticker: 'QQQ', percentage: 100, expenseRatio: 0.20 }]
  }
];

export const TRANSLATIONS: Record<Language, any> = {
  en: {
    appTitle: "US Stock SIP Calculator",
    darkMode: "Dark Mode",
    simulationSettings: "Simulation Settings",
    fixedRate: "Fixed Rate",
    historicalBacktest: "Historical Backtest",
    initialInvestment: "Initial Investment",
    monthlyContribution: "Monthly Contribution",
    duration: "Duration (Years)",
    expectedReturn: "Expected Annual Return (%)",
    startYear: "Start Year",
    portfolioAllocation: "Portfolio Allocation",
    total: "Total",
    addETF: "+ Add Asset",
    reinvestDividends: "Reinvest Dividends",
    reinvestDividendsDesc: "If unchecked, dividends are paid out as cash.",
    tipsTitle: "Tips",
    tipsList: [
      "Use 'Strategies' to auto-fill portfolios.",
      "You can type custom tickers and set expense ratios manually.",
      "For custom tickers without historical data, a default growth rate is used in Backtest mode."
    ],
    resultsTitle: "Simulation Results",
    exportPDF: "Print / Save PDF",
    totalInvested: "Total Invested",
    finalValue: "Final Portfolio Value",
    totalReturn: "Total Return",
    growthProjection: "Growth Projection",
    aiTitle: "Investment Analysis",
    generateReport: "Generate Report",
    generating: "Generating...",
    clearReport: "Clear Report",
    aiPromptHelp: "Generate an AI-powered report summarizing this strategy.",
    yearsSuffix: "Years",
    strategies: "Strategies",
    conservative: "Conservative (S&P 500)",
    balanced: "Balanced (Mix)",
    aggressive: "Aggressive (Growth)",
    avgReturnNote: "Approx. 10y Avg Return:",
    useThisRate: "Use this rate",
    expenseRatio: "Exp Ratio %",
    weightedExpense: "Avg Fee",
    netReturn: "Net Return",
    tickerPlaceholder: "Ticker (e.g. VOO)",
    customTickerWarning: "Note: Custom tickers use proxy data in historical mode if unknown."
  },
  zh: {
    appTitle: "美股定投计算器",
    darkMode: "暗黑模式",
    simulationSettings: "模拟设置",
    fixedRate: "固定收益率",
    historicalBacktest: "历史回测",
    initialInvestment: "初始投入",
    monthlyContribution: "每月定投",
    duration: "定投时长 (年)",
    expectedReturn: "预期年化收益率 (%)",
    startYear: "开始年份",
    portfolioAllocation: "持仓配置",
    total: "总计",
    addETF: "+ 添加资产",
    reinvestDividends: "红利再投资",
    reinvestDividendsDesc: "若不勾选，股息将作为现金派发。",
    tipsTitle: "小贴士",
    tipsList: [
      "使用‘策略组合’可快速填充持仓。",
      "您可以输入自定义代码并手动设置管理费率。",
      "历史回测模式下，未知代码将使用默认增长率代替。"
    ],
    resultsTitle: "模拟结果",
    exportPDF: "打印 / 保存 PDF",
    totalInvested: "总投入本金",
    finalValue: "期末总资产",
    totalReturn: "总回报率",
    growthProjection: "资产增长曲线",
    aiTitle: "AI 投资分析报告",
    generateReport: "生成分析报告",
    generating: "生成中...",
    clearReport: "清除报告",
    aiPromptHelp: "基于您的持仓选择，生成一份AI分析报告。",
    yearsSuffix: "年",
    strategies: "策略组合",
    conservative: "稳健 (标普500)",
    balanced: "平衡 (混合)",
    aggressive: "进取 (成长股)",
    avgReturnNote: "近10年平均年化:",
    useThisRate: "使用此利率",
    expenseRatio: "管理费 %",
    weightedExpense: "平均费率",
    netReturn: "净收益",
    tickerPlaceholder: "代码 (如 VOO)",
    customTickerWarning: "注意：未知代码在回测中将使用替代数据。"
  },
  ja: {
    appTitle: "米国株積立計算機",
    darkMode: "ダークモード",
    simulationSettings: "シミュレーション設定",
    fixedRate: "固定金利",
    historicalBacktest: "過去データ分析",
    initialInvestment: "初期投資額",
    monthlyContribution: "毎月の積立額",
    duration: "期間 (年)",
    expectedReturn: "予想年間収益率 (%)",
    startYear: "開始年",
    portfolioAllocation: "ポートフォリオ配分",
    total: "合計",
    addETF: "+ 資産を追加",
    reinvestDividends: "配当金再投資",
    reinvestDividendsDesc: "チェックを外すと、配当金は現金として支払われます。",
    tipsTitle: "ヒント",
    tipsList: [
      "「戦略」を使用してポートフォリオを自動入力します。",
      "カスタムティッカーと経費率を手動で入力できます。",
      "履歴データがない銘柄は、デフォルトの成長率が使用されます。"
    ],
    resultsTitle: "シミュレーション結果",
    exportPDF: "印刷 / PDF保存",
    totalInvested: "総投資額",
    finalValue: "最終評価額",
    totalReturn: "トータルリターン",
    growthProjection: "資産推移",
    aiTitle: "AI投資分析",
    generateReport: "レポートを作成",
    generating: "作成中...",
    clearReport: "クリア",
    aiPromptHelp: "ポートフォリオに基づき、AI分析レポートを作成します。",
    yearsSuffix: "年",
    strategies: "戦略プリセット",
    conservative: "堅実 (S&P 500)",
    balanced: "バランス (混合)",
    aggressive: "積極 (成長株)",
    avgReturnNote: "過去10年の平均年率:",
    useThisRate: "この率を使用",
    expenseRatio: "経費率 %",
    weightedExpense: "平均手数料",
    netReturn: "純収益",
    tickerPlaceholder: "銘柄 (例: VOO)",
    customTickerWarning: "注: 未知の銘柄は代替データを使用します。"
  }
};