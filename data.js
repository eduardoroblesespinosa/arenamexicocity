const mexicanStocks = [
    { ticker: 'AMX L', name: 'América Móvil', price: 15.80, change: 0.15, changePercent: 0.96, history: [15.5, 15.6, 15.4, 15.7, 15.8] },
    { ticker: 'FEMSA UBD', name: 'Fomento Económico Mexicano', price: 180.25, change: -1.50, changePercent: -0.83, history: [182.1, 181.5, 181.9, 180.5, 180.25] },
    { ticker: 'WALMEX *', name: 'Walmart de México', price: 71.50, change: 0.75, changePercent: 1.06, history: [70.5, 70.8, 70.7, 71.1, 71.5] },
    { ticker: 'GFNORTE O', name: 'Grupo Financiero Banorte', price: 145.90, change: -0.20, changePercent: -0.14, history: [146.0, 146.2, 145.8, 146.1, 145.9] },
    { ticker: 'CEMEX CPO', name: 'Cemex', price: 12.30, change: 0.25, changePercent: 2.07, history: [12.0, 12.1, 12.05, 12.2, 12.3] },
];

const internationalStocks = [
    { ticker: 'AAPL', name: 'Apple Inc.', price: 195.89, change: 1.25, changePercent: 0.64, history: [194.5, 195.1, 194.9, 195.5, 195.89] },
    { ticker: 'TSLA', name: 'Tesla, Inc.', price: 250.22, change: -5.60, changePercent: -2.19, history: [255.0, 256.1, 252.5, 253.0, 250.22] },
    { ticker: 'MSFT', name: 'Microsoft Corp.', price: 370.95, change: 3.10, changePercent: 0.84, history: [368.0, 369.5, 369.0, 370.1, 370.95] },
    { ticker: 'BABA', name: 'Alibaba Group', price: 88.67, change: -1.12, changePercent: -1.25, history: [90.1, 89.5, 89.8, 89.2, 88.67] },
    { ticker: 'GOOGL', name: 'Alphabet Inc.', price: 138.58, change: 0.98, changePercent: 0.71, history: [137.2, 137.8, 137.5, 138.1, 138.58] },
];

const globalIndices = [
    { name: 'S&P 500', value: 4550.58, change: 15.20, changePercent: 0.33 },
    { name: 'NASDAQ', value: 14250.85, change: -50.40, changePercent: -0.35 },
    { name: 'DOW JONES', value: 35400.12, change: 120.75, changePercent: 0.34 },
    { name: 'DAX', value: 15980.40, change: 45.10, changePercent: 0.28 },
    { name: 'Nikkei 225', value: 33450.70, change: -150.20, changePercent: -0.45 },
];

const newsFeed = [
    { title: "Market hits new highs on tech sector gains", source: "Financial News Today", summary: "Tech giants pushed the S&P 500 to a record close...", date: "2024-07-20" },
    { title: "Central Bank hints at interest rate stability", source: "Economic Times", summary: "Officials suggest rates will hold steady through the next quarter...", date: "2024-07-20" },
    { title: "Tesla stock drops amid production concerns", source: "Auto Investor", summary: "Shares of TSLA fell after reports of supply chain disruptions surfaced...", date: "2024-07-19" },
    { title: "Emerging markets show strong growth potential", source: "Global Wealth", summary: "Investors are looking towards emerging markets for higher returns...", date: "2024-07-18" },
];

