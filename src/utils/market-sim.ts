
import { Asset } from '../types';

export const INITIAL_ASSETS: Asset[] = [
  { id: '1', symbol: 'BTC', name: 'Bitcoin', price: 65420.5, change24h: 2.5, volume: '$35.2B', marketCap: '$1.2T', category: 'crypto', sparkline: generateSparkline(65420.5) },
  { id: '2', symbol: 'ETH', name: 'Ethereum', price: 3450.2, change24h: -1.2, volume: '$15.8B', marketCap: '$410B', category: 'crypto', sparkline: generateSparkline(3450.2) },
  { id: '3', symbol: 'SOL', name: 'Solana', price: 145.8, change24h: 5.4, volume: '$4.2B', marketCap: '$65B', category: 'crypto', sparkline: generateSparkline(145.8) },
  { id: '4', symbol: 'AAPL', name: 'Apple Inc.', price: 185.4, change24h: 0.8, volume: '$8.5B', marketCap: '$2.8T', category: 'stock', sparkline: generateSparkline(185.4) },
  { id: '5', symbol: 'TSLA', name: 'Tesla, Inc.', price: 175.2, change24h: -3.5, volume: '$12.1B', marketCap: '$550B', category: 'stock', sparkline: generateSparkline(175.2) },
  { id: '6', symbol: 'NVDA', name: 'NVIDIA', price: 890.5, change24h: 4.2, volume: '$10.2B', marketCap: '$2.2T', category: 'stock', sparkline: generateSparkline(890.5) },
  { id: '7', symbol: 'BNB', name: 'Binance Coin', price: 580.4, change24h: 1.5, volume: '$1.2B', marketCap: '$88B', category: 'crypto', sparkline: generateSparkline(580.4) },
  { id: '8', symbol: 'XRP', name: 'Ripple', price: 0.62, change24h: -0.5, volume: '$1.1B', marketCap: '$34B', category: 'crypto', sparkline: generateSparkline(0.62) },
  { id: '9', symbol: 'MSFT', name: 'Microsoft', price: 420.1, change24h: 1.1, volume: '$5.4B', marketCap: '$3.1T', category: 'stock', sparkline: generateSparkline(420.1) },
  { id: '10', symbol: 'GOOGL', name: 'Alphabet', price: 155.8, change24h: -0.2, volume: '$3.2B', marketCap: '$1.9T', category: 'stock', sparkline: generateSparkline(155.8) },
];

function generateSparkline(basePrice: number): number[] {
  const points = 20;
  let current = basePrice;
  return Array.from({ length: points }, () => {
    current = current * (1 + (Math.random() * 0.04 - 0.02));
    return current;
  });
}

export function simulatePriceMovement(assets: Asset[]): Asset[] {
  return assets.map(asset => {
    const volatility = 0.002; // 0.2% max move per tick
    const change = 1 + (Math.random() * volatility * 2 - volatility);
    const newPrice = asset.price * change;
    const newSparkline = [...asset.sparkline.slice(1), newPrice];
    
    // Calculate 24h change mock
    const firstPrice = newSparkline[0];
    const change24h = ((newPrice - firstPrice) / firstPrice) * 100;

    return {
      ...asset,
      price: newPrice,
      sparkline: newSparkline,
      change24h: parseFloat(change24h.toFixed(2))
    };
  });
}
