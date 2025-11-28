import { HistoricalData, Language, PortfolioPreset, Currency } from './types';

// Approximate annual returns for major ETFs used for backtesting demo
// Extended back to 1985 using index proxies (S&P 500 for SPY/VOO, Nasdaq 100 for QQQ)
export const HISTORICAL_RETURNS: HistoricalData = {
  'VOO': {
    2024: 0.20, 2023: 0.2629, 2022: -0.1811, 2021: 0.2871, 2020: 0.1840,
    2019: 0.3149, 2018: -0.0438, 2017: 0.2183, 2016: 0.1196, 2015: 0.0138,
    2014: 0.1369, 2013: 0.3239, 2012: 0.1600, 2011: 0.0211, 2010: 0.1506,
    2009: 0.2646, 2008: -0.3700, 2007: 0.0549, 2006: 0.1579, 2005: 0.0491,
    2004: 0.1088, 2003: 0.2868, 2002: -0.2210, 2001: -0.1189, 2000: -0.0910,
    1999: 0.2104, 1998: 0.2858, 1997: 0.3336, 1996: 0.2296, 1995: 0.3758,
    1994: 0.0132, 1993: 0.1008, 1992: 0.0762, 1991: 0.3047, 1990: -0.0310,
    1989: 0.3169, 1988: 0.1661, 1987: 0.0525, 1986: 0.1867, 1985: 0.3173
  },
  'QQQ': {
    2024: 0.20, 2023: 0.5381, 2022: -0.3310, 2021: 0.2724, 2020: 0.4758,
    2019: 0.3796, 2018: -0.0104, 2017: 0.3152, 2016: 0.0592, 2015: 0.0843,
    2014: 0.1794, 2013: 0.3499, 2012: 0.1682, 2011: 0.0270, 2010: 0.1993,
    2009: 0.5354, 2008: -0.4189, 2007: 0.1867, 2006: 0.0727, 2005: 0.0149,
    2004: 0.1068, 2003: 0.4967, 2002: -0.3758, 2001: -0.3265, 2000: -0.3684,
    1999: 1.0195, 1998: 0.8530, 1997: 0.2063, 1996: 0.4254, 1995: 0.4254,
    1994: -0.0080, 1993: 0.1400, 1992: 0.1000, 1991: 0.6500, 1990: -0.1100,
    1989: 0.2000, 1988: 0.1500, 1987: -0.0500, 1986: 0.0700, 1985: 0.2500
  },
  'SPY': {
    2024: 0.20, 2023: 0.2629, 2022: -0.1811, 2021: 0.2871, 2020: 0.1840,
    2019: 0.3149, 2018: -0.0438, 2017: 0.2183, 2016: 0.1196, 2015: 0.0138,
    2014: 0.1369, 2013: 0.3239, 2012: 0.1600, 2011: 0.0211, 2010: 0.1506,
    2009: 0.2646, 2008: -0.3700, 2007: 0.0549, 2006: 0.1579, 2005: 0.0491,
    2004: 0.1088, 2003: 0.2868, 2002: -0.2210, 2001: -0.1189, 2000: -0.0910,
    1999: 0.2104, 1998: 0.2858, 1997: 0.3336, 1996: 0.2296, 1995: 0.3758,
    1994: 0.0132, 1993: 0.1008, 1992: 0.0762, 1991: 0.3047, 1990: -0.0310,
    1989: 0.3169, 1988: 0.1661, 1987: 0.0525, 1986: 0.1867, 1985: 0.3173
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
    fixedRate: "SIP Projection",
    historicalBacktest: "Historical Backtest",
    initialInvestment: "Initial Investment",
    monthlyContribution: "Monthly Contribution",
    duration: "Duration (Years)",
    expectedReturn: "Expected Annual Return (%)",
    inflationRate: "Inflation Rate (%)",
    startYear: "Start Year",
    portfolioAllocation: "Portfolio Allocation",
    total: "Total",
    addETF: "+ Add Asset",
    reinvestDividends: "Reinvest Dividends",
    reinvestDividendsDesc: "If unchecked, dividends are paid out as cash.",
    tipsTitle: "Glossary & Tips",
    tipsList: [
      "Use 'Strategies' to auto-fill portfolios.",
      "Inflation Rate: Simulates purchasing power loss (e.g. 2%/yr).",
      "Inflation Adj.: 'Real Value' in today's money (Nominal / Inflation).",
      "Start Year: In Fixed Projection, sets the start of simulation; in Historical, it locks the duration to end today."
    ],
    resultsTitle: "Simulation Results",
    exportPDF: "Print / Save PDF",
    totalInvested: "Total Invested",
    finalValue: "Final Portfolio Value",
    inflationAdjusted: "Inflation Adj.",
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
    customTickerWarning: "Note: Custom tickers use proxy data in historical mode if unknown.",
    yearlyBreakdown: "Yearly Breakdown",
    yearColumn: "Year",
    professionalAssessment: "Professional Assessment",
    // PDF Report
    reportTitle: "Investment Report",
    investmentPlan: "Investment Plan",
    sipStrategy: "SIP Strategy Simulation & Analysis",
    preparedFor: "Prepared For",
    investor: "Client / Investor",
    generatedOn: "Generated On",
    confidential: "CONFIDENTIAL - Generated via SIP Calculator",
    analysisData: "Analysis Data",
    configTitle: "Configuration",
    appendix: "Appendix"
  },
  zh: {
    appTitle: "美股定投计算器",
    darkMode: "暗黑模式",
    simulationSettings: "模拟设置",
    fixedRate: "定投测算",
    historicalBacktest: "历史回测",
    initialInvestment: "初始投入",
    monthlyContribution: "每月定投",
    duration: "定投时长 (年)",
    expectedReturn: "预期年化收益率 (%)",
    inflationRate: "通货膨胀率 (%)",
    startYear: "开始年份",
    portfolioAllocation: "持仓配置",
    total: "总计",
    addETF: "+ 添加资产",
    reinvestDividends: "红利再投资",
    reinvestDividendsDesc: "若不勾选，股息将作为现金派发。",
    tipsTitle: "名词解释与贴士",
    tipsList: [
      "通货膨胀率：模拟每年货币贬值幅度（如2%），用于计算真实购买力。",
      "通胀调整后：即‘真实价值’(Real Value)，剔除通胀水分后在今天的购买力。",
      "开始年份：定投测算模式下，设定模拟的起点；历史回测模式下，它决定了回测区间（至今日）。",
      "使用‘策略组合’可快速填充持仓。"
    ],
    resultsTitle: "模拟结果",
    exportPDF: "打印 / 保存 PDF",
    totalInvested: "总投入本金",
    finalValue: "期末总资产",
    inflationAdjusted: "通胀调整后",
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
    customTickerWarning: "注意：未知代码在回测中将使用替代数据。",
    yearlyBreakdown: "年度数据明细",
    yearColumn: "年份",
    professionalAssessment: "AI 专家评估",
    // PDF Report
    reportTitle: "投资分析报告",
    investmentPlan: "定投增值计划",
    sipStrategy: "定投策略模拟与分析",
    preparedFor: "致",
    investor: "投资人 / 客户",
    generatedOn: "生成日期",
    confidential: "机密文件 - 由美股定投计算器生成",
    analysisData: "数据分析",
    configTitle: "配置参数",
    appendix: "附录"
  },
  ja: {
    appTitle: "米国株積立計算機",
    darkMode: "ダークモード",
    simulationSettings: "シミュレーション設定",
    fixedRate: "積立シミュレーション",
    historicalBacktest: "過去データ分析",
    initialInvestment: "初期投資額",
    monthlyContribution: "毎月の積立額",
    duration: "期間 (年)",
    expectedReturn: "予想年間収益率 (%)",
    inflationRate: "インフレ率 (%)",
    startYear: "開始年",
    portfolioAllocation: "ポートフォリオ配分",
    total: "合計",
    addETF: "+ 資産を追加",
    reinvestDividends: "配当金再投資",
    reinvestDividendsDesc: "チェックを外すと、配当金は現金として支払われます。",
    tipsTitle: "用語解説とヒント",
    tipsList: [
      "インフレ率: 時間の経過に伴う購買力の低下をシミュレートします。",
      "インフレ調整後: インフレを考慮した後の「実質価値」です。",
      "開始年: 積立シミュでは開始時点を設定し、過去分析では今日までの期間を決定します。"
    ],
    resultsTitle: "シミュレーション結果",
    exportPDF: "印刷 / PDF保存",
    totalInvested: "総投資額",
    finalValue: "最終評価額",
    inflationAdjusted: "インフレ調整後",
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
    customTickerWarning: "注: 未知の銘柄は代替データを使用します。",
    yearlyBreakdown: "年間内訳",
    yearColumn: "年",
    professionalAssessment: "専門家による評価",
    // PDF Report
    reportTitle: "投資分析レポート",
    investmentPlan: "積立投資プラン",
    sipStrategy: "積立シミュレーション＆分析",
    preparedFor: "対象",
    investor: "クライアント / 投資家",
    generatedOn: "作成日",
    confidential: "社外秘 - 米国株積立計算機により作成",
    analysisData: "分析データ",
    configTitle: "設定パラメータ",
    appendix: "付録"
  }
};