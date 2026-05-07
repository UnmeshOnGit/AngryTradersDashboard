
export interface Asset {
  id: string;
  symbol: string;
  name: string;
  price: number;
  change24h: number;
  volume: string;
  marketCap: string;
  sparkline: number[];
  category: 'crypto' | 'stock' | 'forex';
}

export interface User {
  id: string;
  name: string;
  email: string;
  balance: number;
  portfolio: PortfolioItem[];
  history: TradeHistory[];
  watchlist: string[];
}

export interface PortfolioItem {
  assetId: string;
  symbol: string;
  amount: number;
  avgPrice: number;
}

export interface TradeHistory {
  id: string;
  assetId: string;
  symbol: string;
  type: 'buy' | 'sell';
  amount: number;
  price: number;
  timestamp: number;
  status: 'completed' | 'pending' | 'cancelled';
}

export interface MarketState {
  assets: Asset[];
  lastUpdate: number;
}
