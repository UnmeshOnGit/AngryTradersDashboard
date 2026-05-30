
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';
import { useApp } from '../context/AppContext';
import { 
  ArrowLeft, 
  TrendingUp, 
  TrendingDown, 
  Activity, 
  Info, 
  History as HistoryIcon, 
  Newspaper,
  ShieldCheck,
  Zap,
  ArrowRightLeft,
  CheckCircle2,
  X
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  Tooltip, 
  ResponsiveContainer, 
  CartesianGrid,
  BarChart,
  Bar,
  ComposedChart,
  Line
} from 'recharts';

// Custom Candlestick Component
const Candlestick = (props: any) => {
  const { x, y, width, height, low, high, open, close } = props;
  const isUp = close >= open;
  const color = isUp ? '#00FFB2' : '#FF4D6D';

  const bodyMax = Math.max(open, close);
  const bodyMin = Math.min(open, close);
  const bodyHeight = bodyMax - bodyMin;
  
  // scale factor: pixels per price unit
  const scale = bodyHeight > 0 ? height / bodyHeight : 1;

  // wick
  const wickX = x + width / 2;
  
  return (
    <g>
      <line 
        x1={wickX} 
        y1={y - (high - bodyMax) * scale} 
        x2={wickX} 
        y2={y + height + (bodyMin - low) * scale}
        stroke={color} 
        strokeWidth={1} 
      />
      <rect 
        x={x} 
        y={y} 
        width={width} 
        height={Math.max(height, 1)} 
        fill={color} 
        stroke={color} 
      />
    </g>
  );
};
import { Badge } from '@/components/ui/badge';
import { Slider } from '@/components/ui/slider';
import { cn } from '@/lib/utils';
import { Skeleton } from '@/components/ui/skeleton';

export const AssetDetailPage = () => {
  const { assetId } = useParams();
  const { assets, executeTrade, user, formatCurrency } = useApp();
  const navigate = useNavigate();
  const [tradeType, setTradeType] = useState<'buy' | 'sell'>('buy');
  const [amount, setAmount] = useState('0');
  const [activeTimeframe, setActiveTimeframe] = useState('1H');

  const [showCandlesticks, setShowCandlesticks] = useState(false);
  const [showIndicators, setShowIndicators] = useState(false);
  
  const [isSuccess, setIsSuccess] = useState(false);
  const [tradeDetails, setTradeDetails] = useState<{type: string, amount: number} | null>(null);

  const [isResolving, setIsResolving] = useState(true);

  // Trigger simulated loader when component shifts context (timeframe or asset change)
  useEffect(() => {
    setIsResolving(true);
    const timer = setTimeout(() => {
      setIsResolving(false);
    }, 800);
    return () => clearTimeout(timer);
  }, [assetId, activeTimeframe]);

  const asset = assets.find(a => a.id === assetId);

  if (!asset) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh]">
        <h2 className="text-2xl font-bold">Asset not found</h2>
        <Button onClick={() => navigate('/markets')} className="mt-4">Back to Markets</Button>
      </div>
    );
  }

  const handleTrade = (e: React.FormEvent) => {
    e.preventDefault();
    const numAmount = parseFloat(amount);
    if (isNaN(numAmount) || numAmount <= 0) return;
    
    executeTrade(asset.id, tradeType, numAmount);
    setTradeDetails({ type: tradeType, amount: numAmount });
    setIsSuccess(true);
    
    setTimeout(() => {
      setIsSuccess(false);
      setAmount('0');
    }, 4000);
  };

  const handleMaxClick = () => {
    if (tradeType === 'buy') {
      const maxBuy = (user?.balance || 0) / asset.price;
      const formatted = Number(maxBuy.toFixed(6));
      setAmount(formatted > 0 ? formatted.toString() : '0');
    } else {
      const maxSell = userHolding?.amount || 0;
      const formatted = Number(maxSell.toFixed(6));
      setAmount(formatted > 0 ? formatted.toString() : '0');
    }
  };

  const handlePercentageClick = (percentage: number) => {
    if (tradeType === 'buy') {
      const maxBuy = (user?.balance || 0) / asset.price;
      const calculated = maxBuy * (percentage / 100);
      const formatted = Number(calculated.toFixed(6));
      setAmount(formatted > 0 ? formatted.toString() : '0');
    } else {
      const maxSell = userHolding?.amount || 0;
      const calculated = maxSell * (percentage / 100);
      const formatted = Number(calculated.toFixed(6));
      setAmount(formatted > 0 ? formatted.toString() : '0');
    }
  };

  // Generate enhanced chart data dynamically based on timeframe
  const chartData = React.useMemo(() => {
    const pointsCount = 40;
    const basePrice = asset.price;
    const volatilityMap: Record<string, number> = {
      '1M': 0.001,
      '5M': 0.003,
      '15M': 0.005,
      '1H': 0.012,
      '4H': 0.025,
      '1D': 0.06,
      '1W': 0.12
    };
    
    const volatility = volatilityMap[activeTimeframe] || 0.01;
    
    // Use asset ID and timeframe for a deterministic but distinct seed
    let seed = asset.id.split('').reduce((a, b) => a + b.charCodeAt(0), 0) + 
              activeTimeframe.split('').reduce((a, b) => a + b.charCodeAt(0) * 2, 0);
    
    const pseudoRandom = () => {
      seed = (seed * 9301 + 49297) % 233280;
      return seed / 233280;
    };

    // Starting price should be somewhat related to the current price but shifted back
    let currentPrice = basePrice * (1 - (pseudoRandom() * 0.1 - 0.05));
    
    const data = Array.from({ length: pointsCount }).map((_, i) => {
      const change = 1 + (pseudoRandom() * volatility * 2 - volatility);
      const open = currentPrice;
      currentPrice = currentPrice * change;
      const close = currentPrice;
      const high = Math.max(open, close) * (1 + pseudoRandom() * (volatility * 0.2));
      const low = Math.min(open, close) * (1 - pseudoRandom() * (volatility * 0.2));
      
      const timeLabels: Record<string, string> = {
        '1M': `${i}m`,
        '5M': `${i*5}m`,
        '15M': `${i*15}m`,
        '1H': `${i}h`,
        '4H': `${i*4}h`,
        '1D': `Day ${i}`,
        '1W': `Week ${i}`
      };

      return {
        time: timeLabels[activeTimeframe] || `${i}:00`,
        price: close,
        open,
        close,
        high,
        low,
        volume: pseudoRandom() * 100 + 40
      };
    });

    // Add indicators
    return data.map((item, i, arr) => {
      let sma7 = item.price;
      if (i >= 6) {
        sma7 = arr.slice(i-6, i+1).reduce((sum, d) => sum + d.price, 0) / 7;
      }
      return { ...item, sma7 };
    });
  }, [asset.id, asset.price, activeTimeframe]);

  const userHolding = user?.portfolio.find(p => p.assetId === asset.id);
  const totalCost = (parseFloat(amount) || 0) * asset.price;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="space-y-6"
    >
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" onClick={() => navigate(-1)} className="rounded-xl border-white/5 hover:bg-white/5">
          <ArrowLeft className="w-5 h-5" />
        </Button>
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-primary flex items-center justify-center text-primary-foreground font-bold text-xl shadow-lg shadow-primary/20">
            {asset.symbol[0]}
          </div>
          <div>
            <h1 className="text-2xl md:text-3xl font-bold tracking-tight flex items-center gap-2">
              {asset.name} <span className="text-muted-foreground text-xl font-medium">{asset.symbol}</span>
            </h1>
            <div className="flex items-center gap-4 mt-1">
              <span className="text-2xl font-mono font-bold">{formatCurrency(asset.price)}</span>
              <Badge className={asset.change24h >= 0 ? "bg-[#00FFB2]/10 text-[#00FFB2] border-[#00FFB2]/20" : "bg-[#FF4D6D]/10 text-[#FF4D6D] border-[#FF4D6D]/20"}>
                {asset.change24h >= 0 ? '+' : ''}{asset.change24h}%
              </Badge>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        {/* Left Column: Chart & Info */}
        <div className="xl:col-span-2 space-y-6">
          <Card className="glass border-white/5 p-2">
            <CardHeader className="flex flex-col md:flex-row items-start md:items-center justify-between space-y-4 md:space-y-0 pb-4">
              <Tabs value={activeTimeframe} className="w-full md:w-auto overflow-x-auto" onValueChange={setActiveTimeframe}>
                <TabsList className="bg-white/5 border-white/5 p-1 rounded-xl flex w-fit min-w-full">
                  {['1M', '5M', '15M', '1H', '4H', '1D', '1W'].map(tf => (
                    <TabsTrigger 
                      key={tf} 
                      value={tf} 
                      className={cn(
                        "rounded-lg px-3 sm:px-4 py-2 text-xs sm:text-sm font-bold transition-all",
                        activeTimeframe === tf 
                          ? "bg-primary text-primary-foreground shadow-[0_0_20px_rgba(0,255,178,0.3)] scale-105" 
                          : "text-muted-foreground hover:bg-white/5"
                      )}
                    >
                      {tf}
                    </TabsTrigger>
                  ))}
                </TabsList>
              </Tabs>
              <div className="flex gap-2">
                <Button 
                  variant={showCandlesticks ? "default" : "outline"} 
                  size="sm" 
                  className={cn("rounded-lg border-white/10", showCandlesticks && "bg-primary text-primary-foreground")}
                  onClick={() => setShowCandlesticks(!showCandlesticks)}
                >
                  Candlesticks
                </Button>
                <Button 
                  variant={showIndicators ? "default" : "outline"} 
                  size="sm" 
                  className={cn("rounded-lg border-white/10", showIndicators && "bg-primary text-primary-foreground")}
                  onClick={() => setShowIndicators(!showIndicators)}
                >
                  Indicators
                </Button>
              </div>
            </CardHeader>
            <CardContent className="h-[400px] p-0 relative overflow-hidden">
              {isResolving ? (
                <div className="flex flex-col justify-between h-[400px] p-6 animate-pulse select-none">
                  <div className="flex justify-between items-start">
                    <Skeleton className="h-8 w-1/4 rounded-xl bg-white/10" />
                    <div className="flex gap-2">
                      <Skeleton className="h-2 w-16 bg-white/10 rounded-lg" />
                      <Skeleton className="h-2 w-16 bg-white/10 rounded-lg" />
                    </div>
                  </div>
                  <div className="flex-1 flex items-end justify-between px-2 gap-4 my-6">
                    {[15, 35, 25, 50, 30, 65, 45, 80, 55, 75, 60, 90].map((h, i) => (
                      <Skeleton 
                        key={i} 
                        className="w-full bg-white/10 rounded-t-lg transition-all duration-500" 
                        style={{ height: `${h}%` }} 
                      />
                    ))}
                  </div>
                  <div className="flex justify-between">
                    <Skeleton className="h-4 w-12 bg-white/10" />
                    <Skeleton className="h-4 w-12 bg-white/10" />
                    <Skeleton className="h-4 w-12 bg-white/10" />
                    <Skeleton className="h-4 w-12 bg-white/10" />
                  </div>
                </div>
              ) : (
                <>
                  <ResponsiveContainer width="100%" height="100%" debounce={1}>
                    <ComposedChart data={chartData}>
                      <defs>
                        <linearGradient id={`colorPrice-${asset.id}`} x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor={asset.change24h >= 0 ? "#00FFB2" : "#FF4D6D"} stopOpacity={0.3}/>
                          <stop offset="95%" stopColor={asset.change24h >= 0 ? "#00FFB2" : "#FF4D6D"} stopOpacity={0}/>
                        </linearGradient>
                      </defs>
                      <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(255,255,255,0.05)" />
                      <XAxis 
                        dataKey="time" 
                        axisLine={false} 
                        tickLine={false} 
                        tick={{ fill: '#94a3b8', fontSize: 10 }}
                        minTickGap={30}
                      />
                      <YAxis 
                        domain={['auto', 'auto']} 
                        axisLine={false} 
                        tickLine={false} 
                        tick={{ fill: '#94a3b8', fontSize: 10 }}
                        orientation="right"
                        tickFormatter={(v) => formatCurrency(v)}
                      />
                      <Tooltip 
                        contentStyle={{ backgroundColor: '#1e293b', border: 'none', borderRadius: '12px', boxShadow: '0 10px 15px -3px rgba(0,0,0,0.5)' }}
                        itemStyle={{ color: '#fff', fontWeight: 'bold' }}
                        labelStyle={{ color: '#94a3b8', marginBottom: '4px' }}
                      />
                      
                      {!showCandlesticks ? (
                        <Area 
                          type="monotone" 
                          dataKey="price" 
                          stroke={asset.change24h >= 0 ? "#00FFB2" : "#FF4D6D"} 
                          fillOpacity={1} 
                          fill={`url(#colorPrice-${asset.id})`} 
                          strokeWidth={3}
                          animationDuration={1000}
                        />
                      ) : (
                        <Bar 
                          dataKey="close" 
                          shape={(props: any) => {
                            const { index } = props;
                            const data = chartData[index];
                            return <Candlestick {...props} {...data} />;
                          }} 
                        />
                      )}

                      {showIndicators && (
                        <Line 
                          type="monotone" 
                          dataKey="sma7" 
                          stroke="#8B5CF6" 
                          strokeWidth={2} 
                          dot={false}
                        />
                      )}
                    </ComposedChart>
                  </ResponsiveContainer>
                  <div className="absolute bottom-0 left-0 right-0 h-[80px] pointer-events-none opacity-20">
                    <ResponsiveContainer width="100%" height="100%" debounce={1}>
                       <BarChart data={chartData}>
                         <Bar dataKey="volume" fill="rgba(255,255,255,0.1)" radius={[2, 2, 0, 0]} />
                       </BarChart>
                    </ResponsiveContainer>
                  </div>
                </>
              )}
            </CardContent>
          </Card>

          <Tabs defaultValue="overview" className="w-full">
            <TabsList className="bg-transparent border-b border-white/5 w-full justify-start h-12 p-0 rounded-none mb-6">
              <TabsTrigger value="overview" className="border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent rounded-none h-full px-6">
                Overview
              </TabsTrigger>
              <TabsTrigger value="analytics" className="border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent rounded-none h-full px-6">
                Analytics
              </TabsTrigger>
              <TabsTrigger value="history" className="border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent rounded-none h-full px-6">
                Order History
              </TabsTrigger>
              <TabsTrigger value="news" className="border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent rounded-none h-full px-6">
                News
              </TabsTrigger>
            </TabsList>

            <TabsContent value="overview">
              {isResolving ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <Card className="glass border-white/5">
                    <CardContent className="p-6 space-y-6">
                      <div className="flex items-center gap-2">
                        <Skeleton className="w-5 h-5 rounded-full bg-white/10 animate-pulse" />
                        <Skeleton className="h-5 w-36 bg-white/10 animate-pulse" />
                      </div>
                      <div className="grid grid-cols-2 gap-6">
                        {[...Array(6)].map((_, i) => (
                          <div key={i} className="space-y-2">
                            <Skeleton className="h-3 w-20 bg-white/10 animate-pulse" />
                            <Skeleton className="h-5 w-28 bg-primary/20 animate-pulse" />
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                  
                  <Card className="glass border-white/5">
                    <CardContent className="p-6 space-y-4">
                      <div className="flex items-center gap-2">
                        <Skeleton className="w-5 h-5 rounded-full bg-white/10 animate-pulse" />
                        <Skeleton className="h-5 w-36 bg-white/10 animate-pulse" />
                      </div>
                      <div className="flex justify-between">
                        <Skeleton className="h-4 w-16 bg-[#00FFB2]/25 animate-pulse" />
                        <Skeleton className="h-4 w-16 bg-[#FF4D6D]/25 animate-pulse" />
                      </div>
                      <Skeleton className="h-3 w-full bg-white/15 rounded-full animate-pulse" />
                      <div className="space-y-2 pt-2">
                        <Skeleton className="h-3 w-full bg-white/10 animate-pulse" />
                        <Skeleton className="h-3 w-[90%] bg-white/10 animate-pulse" />
                      </div>
                      <div className="pt-4 border-t border-white/5 mt-4 space-y-3">
                        <Skeleton className="h-4 w-28 bg-white/10 animate-pulse" />
                        <div className="space-y-2">
                          <div className="flex items-center gap-2">
                            <Skeleton className="w-4 h-4 rounded-full bg-white/10 animate-pulse" />
                            <Skeleton className="h-3 w-40 bg-white/10 animate-pulse" />
                          </div>
                          <div className="flex items-center gap-2">
                            <Skeleton className="w-4 h-4 rounded-full bg-white/10 animate-pulse" />
                            <Skeleton className="h-3 w-44 bg-white/10 animate-pulse" />
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <Card className="glass border-white/5">
                    <CardContent className="p-6 space-y-4">
                      <h3 className="font-bold flex items-center gap-2"><Info className="w-4 h-4 text-primary" /> Market Statistics</h3>
                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-1">
                          <p className="text-xs text-muted-foreground uppercase">Market Cap</p>
                          <p className="font-bold">{asset.marketCap}</p>
                        </div>
                        <div className="space-y-1">
                          <p className="text-xs text-muted-foreground uppercase">24h Volume</p>
                          <p className="font-bold">{asset.volume}</p>
                        </div>
                        <div className="space-y-1">
                          <p className="text-xs text-muted-foreground uppercase">24h High</p>
                          <p className="font-bold">{formatCurrency(asset.price * 1.05)}</p>
                        </div>
                        <div className="space-y-1">
                          <p className="text-xs text-muted-foreground uppercase">24h Low</p>
                          <p className="font-bold">{formatCurrency(asset.price * 0.96)}</p>
                        </div>
                        <div className="space-y-1">
                          <p className="text-xs text-muted-foreground uppercase">Circulating Supply</p>
                          <p className="font-bold">19.6M {asset.symbol}</p>
                        </div>
                        <div className="space-y-1">
                          <p className="text-xs text-muted-foreground uppercase">All Time High</p>
                          <p className="font-bold">{formatCurrency(asset.price * 1.4)}</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                  <Card className="glass border-white/5">
                    <CardContent className="p-6 space-y-2">
                      <h3 className="font-bold flex items-center gap-2"><Activity className="w-4 h-4 text-primary" /> Popular Sentiment</h3>
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-[#00FFB2]">68% Buy</span>
                        <span className="text-sm text-[#FF4D6D]">32% Sell</span>
                      </div>
                      <div className="h-2 w-full bg-[#FF4D6D]/20 rounded-full overflow-hidden flex">
                        <div className="bg-[#00FFB2] h-full" style={{ width: '68%' }} />
                      </div>
                      <p className="text-xs text-muted-foreground mt-4 leading-relaxed">
                        Most traders are currently bullish on {asset.name} following recent market expansion and positive institutional reports.
                      </p>
                      <div className="pt-4 border-t border-white/5 mt-4">
                        <h4 className="text-xs font-bold uppercase tracking-widest text-muted-foreground mb-3">Key Highlights</h4>
                        <ul className="space-y-2">
                          <li className="flex items-center gap-2 text-xs">
                            <Zap className="w-3 h-3 text-yellow-400" /> High institutional interest detected
                          </li>
                          <li className="flex items-center gap-2 text-xs">
                            <ShieldCheck className="w-3 h-3 text-primary" /> Low security risk audit passed
                          </li>
                        </ul>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              )}
            </TabsContent>

            <TabsContent value="analytics">
              {isResolving ? (
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <Card className="glass border-white/5 md:col-span-2">
                    <CardContent className="p-6 space-y-6">
                      <div className="flex items-center gap-2">
                        <Skeleton className="w-5 h-5 rounded-full bg-white/10 animate-pulse" />
                        <Skeleton className="h-5 w-48 bg-white/10 animate-pulse" />
                      </div>
                      <div className="space-y-3">
                        <div className="flex justify-between">
                          <Skeleton className="h-3 w-40 bg-white/10 animate-pulse" />
                          <Skeleton className="h-4 w-28 bg-white/10 animate-pulse" />
                        </div>
                        <Skeleton className="h-4 w-full bg-white/10 rounded-lg animate-pulse" />
                        <div className="flex justify-between">
                          <Skeleton className="h-3 w-20 bg-white/10 animate-pulse" />
                          <Skeleton className="h-3 w-20 bg-white/10 animate-pulse" />
                        </div>
                      </div>
                      <div className="grid grid-cols-2 gap-4 pt-4">
                        {[...Array(4)].map((_, i) => (
                          <div key={i} className="p-4 bg-white/5 rounded-xl border border-white/5 space-y-2">
                            <Skeleton className="h-3 w-16 bg-white/10" />
                            <Skeleton className="h-6 w-24 bg-primary/20" />
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>

                  <Card className="glass border-white/5">
                    <CardContent className="p-6 space-y-4">
                      <div className="flex items-center gap-2 text-md">
                        <Skeleton className="w-5 h-5 rounded-full bg-white/10" />
                        <Skeleton className="h-5 w-32 bg-white/10" />
                      </div>
                      <div className="h-[180px] w-full flex items-end gap-3 px-2">
                        {[80, 140, 100, 160, 110, 150, 90].map((h, idx) => (
                          <Skeleton key={idx} className="w-full bg-blue-500/10 rounded-t-lg" style={{ height: `${h / 1.8}px` }} />
                        ))}
                      </div>
                      <div className="space-y-3 pt-2">
                        <div className="flex justify-between">
                          <Skeleton className="h-4 w-24 bg-white/10 animate-pulse" />
                          <Skeleton className="h-4 w-12 bg-white/10" />
                        </div>
                        <div className="flex justify-between">
                          <Skeleton className="h-4 w-24 bg-white/10 animate-pulse" />
                          <Skeleton className="h-4 w-12 bg-white/10" />
                        </div>
                        <Skeleton className="h-3 w-full bg-white/10 animate-pulse" style={{ marginTop: '12px' }} />
                      </div>
                    </CardContent>
                  </Card>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <Card className="glass border-white/5 md:col-span-2">
                    <CardContent className="p-6">
                      <h3 className="font-bold mb-6 flex items-center gap-2 font-mono text-xs uppercase tracking-tighter text-muted-foreground">
                        <Activity className="w-4 h-4 text-primary" /> Technical Intelligence Indicators
                      </h3>
                      <div className="space-y-8">
                        <div className="space-y-2">
                          <div className="flex justify-between items-end">
                            <span className="text-xs font-bold uppercase">Relative Strength Index (RSI)</span>
                            <span className="text-sm font-mono text-primary">58.42 - Neutral</span>
                          </div>
                          <div className="h-4 w-full bg-white/5 rounded-lg relative overflow-hidden">
                            <div className="absolute inset-y-0 left-0 bg-primary/20" style={{ width: '30%', left: '35%' }} />
                            <div className="absolute top-0 bottom-0 w-1 bg-primary shadow-[0_0_10px_#00FFB2]" style={{ left: '58.42%' }} />
                          </div>
                          <div className="flex justify-between text-[10px] text-muted-foreground font-mono">
                            <span>30 (OVER-SOLD)</span>
                            <span>70 (OVER-BOUGHT)</span>
                          </div>
                        </div>

                        <div className="grid grid-cols-2 gap-4 pt-4">
                          <div className="p-4 bg-white/5 rounded-xl border border-white/5">
                            <p className="text-[10px] text-muted-foreground uppercase font-bold tracking-widest mb-1">Volatility</p>
                            <p className="text-xl font-bold font-mono">Medium</p>
                          </div>
                          <div className="p-4 bg-white/5 rounded-xl border border-white/5">
                            <p className="text-[10px] text-muted-foreground uppercase font-bold tracking-widest mb-1">Sharpe Ratio</p>
                            <p className="text-xl font-bold font-mono">2.41</p>
                          </div>
                          <div className="p-4 bg-white/5 rounded-xl border border-white/5">
                            <p className="text-[10px] text-muted-foreground uppercase font-bold tracking-widest mb-1">Beta</p>
                            <p className="text-xl font-bold font-mono">1.18</p>
                          </div>
                          <div className="p-4 bg-white/5 rounded-xl border border-white/5">
                            <p className="text-[10px] text-muted-foreground uppercase font-bold tracking-widest mb-1">Liquidity Score</p>
                            <p className="text-xl font-bold font-mono">9.8/10</p>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  <Card className="glass border-white/5">
                    <CardContent className="p-6 space-y-4">
                      <h3 className="font-bold flex items-center gap-2"><ArrowRightLeft className="w-4 h-4 text-primary" /> Volume Analysis</h3>
                      <div className="h-[180px] w-full">
                         <ResponsiveContainer width="100%" height="100%">
                           <BarChart data={chartData.slice(-10)}>
                             <Bar dataKey="volume" fill="#3b82f6" radius={[4, 4, 0, 0]} />
                             <Tooltip content={() => null} />
                           </BarChart>
                         </ResponsiveContainer>
                      </div>
                      <div className="space-y-3">
                        <div className="flex justify-between text-xs">
                          <span className="text-muted-foreground">Buy Pressure:</span>
                          <span className="text-[#00FFB2] font-bold">High</span>
                        </div>
                        <div className="flex justify-between text-xs">
                          <span className="text-muted-foreground">Sell Pressure:</span>
                          <span className="text-muted-foreground font-bold">Low</span>
                        </div>
                        <p className="text-[10px] text-muted-foreground leading-relaxed pt-2">
                          Buy side volume concentration at current support levels suggests a strong floor for {asset.name}.
                        </p>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              )}
            </TabsContent>

            <TabsContent value="history">
              {isResolving ? (
                <Card className="glass border-white/5">
                  <CardContent className="p-6">
                    <div className="space-y-4">
                      <div className="grid grid-cols-6 gap-4 pb-4 border-b border-white/5">
                        {[...Array(6)].map((_, i) => (
                          <Skeleton key={i} className="h-3 bg-white/10 w-16" />
                        ))}
                      </div>
                      {[...Array(3)].map((_, rowIdx) => (
                        <div key={rowIdx} className="grid grid-cols-6 gap-4 py-4 border-b border-white/5 items-center">
                          <Skeleton className="h-4 bg-white/10 w-24" />
                          <Skeleton className="h-5 bg-white/10 w-12 rounded-full" />
                          <Skeleton className="h-4 bg-white/10 w-16" />
                          <Skeleton className="h-4 bg-white/10 w-20" />
                          <Skeleton className="h-4 bg-white/10 w-20" />
                          <Skeleton className="h-4 bg-white/10 w-16" />
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              ) : (
                <Card className="glass border-white/5">
                  <CardContent className="p-0">
                    <div className="overflow-x-auto">
                      <table className="w-full text-left text-sm">
                        <thead>
                          <tr className="border-b border-white/5 text-muted-foreground uppercase text-[10px] font-bold tracking-widest">
                            <th className="px-6 py-4">Time</th>
                            <th className="px-6 py-4">Type</th>
                            <th className="px-6 py-4">Amount</th>
                            <th className="px-6 py-4">Price</th>
                            <th className="px-6 py-4">Total</th>
                            <th className="px-6 py-4">Status</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-white/5">
                          {user?.history.filter(h => h.assetId === asset.id).length ? (
                            user.history.filter(h => h.assetId === asset.id).map((trade) => (
                              <tr key={trade.id} className="hover:bg-white/5 transition-colors group">
                                <td className="px-6 py-4 whitespace-nowrap font-mono text-xs">
                                  {new Date(trade.timestamp).toLocaleString([], { dateStyle: 'short', timeStyle: 'short' })}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                  <span className={cn(
                                    "px-2 py-0.5 rounded-full text-[10px] font-bold uppercase",
                                    trade.type === 'buy' ? "bg-[#00FFB2]/10 text-[#00FFB2]" : "bg-[#FF4D6D]/10 text-[#FF4D6D]"
                                  )}>
                                    {trade.type}
                                  </span>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap font-bold">
                                  {trade.amount} {trade.symbol}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap font-mono">
                                  {formatCurrency(trade.price)}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap font-mono font-bold">
                                  {formatCurrency(trade.amount * trade.price)}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                  <span className="flex items-center gap-1 text-[10px] font-bold text-muted-foreground uppercase">
                                    <CheckCircle2 className="w-3 h-3 text-primary" /> {trade.status}
                                  </span>
                                </td>
                              </tr>
                            ))
                          ) : (
                            <tr>
                              <td colSpan={6} className="px-6 py-12 text-center text-muted-foreground italic">
                                No transaction history found for this asset.
                              </td>
                            </tr>
                          )}
                        </tbody>
                      </table>
                    </div>
                  </CardContent>
                </Card>
              )}
            </TabsContent>
            
            <TabsContent value="news">
              {isResolving ? (
                <div className="space-y-4">
                  {[...Array(3)].map((_, i) => (
                    <div key={i} className="glass p-4 rounded-xl flex gap-4 items-start">
                      <Skeleton className="w-16 h-16 rounded-lg bg-white/10 flex-shrink-0 animate-pulse" />
                      <div className="space-y-3 flex-1">
                        <Skeleton className="h-4 w-24 bg-white/10 rounded-lg animate-pulse" />
                        <Skeleton className="h-5 w-[90%] bg-white/10 rounded-lg animate-pulse" />
                        <Skeleton className="h-3 w-40 bg-white/10 rounded-lg animate-pulse" />
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="space-y-4">
                  {[1, 2, 3].map(i => (
                    <div key={i} className="glass p-4 rounded-xl flex gap-4 items-start cursor-pointer hover:bg-white/5">
                      <div className="w-16 h-16 rounded-lg bg-white/5 flex-shrink-0 flex items-center justify-center">
                         <Newspaper className="w-8 h-8 text-muted-foreground opacity-50" />
                      </div>
                      <div className="space-y-2">
                        <Badge variant="outline" className="text-[10px]">LATEST NEWS</Badge>
                        <h4 className="font-bold leading-tight">Big moves in the {asset.category} sector as {asset.name} hits new monthly high.</h4>
                        <p className="text-xs text-muted-foreground">Decentered Digest • 2 hours ago</p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </TabsContent>
          </Tabs>
        </div>

        {/* Right Column: Trade Terminal */}
        <div className="space-y-6">
          <Card className="glass border-white/5 relative overflow-hidden group">
            <div className="absolute top-0 right-0 p-4">
              <ArrowRightLeft className="w-8 h-8 text-primary opacity-5 group-hover:opacity-20 transition-opacity" />
            </div>
            <CardHeader>
              <CardTitle>Trade Terminal</CardTitle>
              <CardDescription>Instant execution via AngryTraders Engine</CardDescription>
            </CardHeader>
            <CardContent className="relative">
              <AnimatePresence>
                {isSuccess && (
                  <motion.div 
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.9 }}
                    className="absolute inset-0 z-50 bg-card flex flex-col items-center justify-center p-6 text-center"
                  >
                    <div className="w-16 h-16 bg-[#00FFB2]/10 rounded-full flex items-center justify-center text-[#00FFB2] mb-4">
                      <CheckCircle2 className="w-8 h-8" />
                    </div>
                    <h3 className="text-xl font-bold">Order Confirmed!</h3>
                    <p className="text-sm text-muted-foreground mt-2">
                       Successfully {tradeDetails?.type === 'buy' ? 'purchased' : 'sold'} {tradeDetails?.amount} {asset.symbol} via AngryTraders Mainnet.
                    </p>
                    <Button 
                      variant="outline" 
                      size="sm" 
                      className="mt-6 rounded-lg"
                      onClick={() => setIsSuccess(false)}
                    >
                      New Order
                    </Button>
                  </motion.div>
                )}
              </AnimatePresence>
              
              <div className="flex p-1 bg-background rounded-xl mb-6 border border-white/5">
                <Button 
                  variant="ghost" 
                  className={cn("flex-1 rounded-lg transition-all font-bold", tradeType === 'buy' ? "bg-[#00FFB2] text-black hover:bg-[#00FFB2]/90" : "text-[#94A3B8]")}
                  onClick={() => setTradeType('buy')}
                >
                  Buy
                </Button>
                <Button 
                  variant="ghost" 
                  className={cn("flex-1 rounded-lg transition-all font-bold", tradeType === 'sell' ? "bg-[#FF4D6D] text-white hover:bg-[#FF4D6D]/90" : "text-[#94A3B8]")}
                  onClick={() => setTradeType('sell')}
                >
                  Sell
                </Button>
              </div>

              <form onSubmit={handleTrade} className="space-y-6">
                <div className="space-y-3">
                  <div className="flex justify-between items-center px-1">
                    <Label className="text-xs font-mono text-muted-foreground uppercase">Amount ({asset.symbol})</Label>
                    <span className="text-xs text-muted-foreground">Available: {tradeType === 'buy' ? formatCurrency(user?.balance || 0) : `${userHolding?.amount || 0} ${asset.symbol}`}</span>
                  </div>
                  <div className="relative">
                    <Input 
                      type="number" 
                      step="any"
                      value={amount}
                      onChange={(e) => setAmount(e.target.value)}
                      className="h-16 text-2xl font-bold bg-white/5 border-white/10 rounded-2xl pr-32 select-all"
                    />
                    <div className="absolute right-4 top-1/2 -translate-y-1/2 flex items-center gap-2">
                      <button
                        type="button"
                        onClick={handleMaxClick}
                        className="text-[10px] bg-primary/10 text-primary border border-primary/20 hover:bg-primary/20 active:scale-95 transition-all font-bold px-2 py-1 rounded-md uppercase tracking-wider h-7"
                      >
                        Max
                      </button>
                      <span className="font-bold opacity-50 text-sm">
                        {asset.symbol}
                      </span>
                    </div>
                  </div>
                  <div className="px-1">
                    <Slider 
                      value={[tradeType === 'buy' ? Math.min(100, Math.round(((parseFloat(amount) || 0) * asset.price / (user?.balance || 1)) * 100)) : Math.min(100, Math.round(((parseFloat(amount) || 0) / (userHolding?.amount || 1)) * 100))]} 
                      onValueChange={(val) => handlePercentageClick(val[0])}
                      max={100} 
                      step={1} 
                      className="mt-4 cursor-pointer" 
                    />
                    <div className="flex justify-between mt-2 px-1">
                      {['0%', '25%', '50%', '75%', '100%'].map(p => (
                        <span 
                          key={p} 
                          onClick={() => handlePercentageClick(parseInt(p))}
                          className="text-[10px] text-muted-foreground hover:text-primary cursor-pointer transition-colors font-mono"
                        >
                          {p}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="space-y-3 p-4 bg-white/5 rounded-2xl border border-white/5">
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Execution Price:</span>
                    <span className="font-mono">{formatCurrency(asset.price)}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Trade Fee:</span>
                    <span className="font-mono text-primary">{formatCurrency(0)}</span>
                  </div>
                  <div className="pt-2 border-t border-white/5 flex justify-between font-bold">
                    <span>Est. Total:</span>
                    <span className={tradeType === 'buy' ? "text-[#00FFB2]" : "text-[#FF4D6D]"}>
                      {formatCurrency(totalCost)}
                    </span>
                  </div>
                </div>

                <Button 
                  type="submit" 
                  disabled={parseFloat(amount) <= 0}
                  className={cn(
                    "w-full h-16 rounded-2xl font-black text-lg shadow-xl uppercase tracking-widest group overflow-hidden relative transition-all active:scale-[0.98]",
                    tradeType === 'buy' ? "bg-[#00FFB2] text-black shadow-[#00FFB2]/20 hover:brightness-110" : "bg-[#FF4D6D] text-white shadow-[#FF4D6D]/20 hover:brightness-110"
                  )}
                >
                  <motion.div
                    whileHover={{ x: 10 }}
                    className="flex items-center justify-center gap-3 relative z-10"
                  >
                    {tradeType.toUpperCase()} {asset.symbol}
                  </motion.div>
                  <div className="absolute inset-0 bg-white/10 translate-y-full hover:translate-y-0 transition-transform duration-300 pointer-events-none" />
                </Button>
              </form>
            </CardContent>
          </Card>

          <Card className="glass border-white/5">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm uppercase tracking-widest font-mono text-muted-foreground">My Holdings</CardTitle>
            </CardHeader>
            <CardContent>
              {userHolding ? (
                <div className="space-y-4">
                  <div className="flex justify-between items-end">
                    <div>
                      <p className="text-3xl font-bold font-mono">{(userHolding.amount).toLocaleString()} <span className="text-sm font-normal text-muted-foreground">{asset.symbol}</span></p>
                      <p className="text-sm text-muted-foreground">Current Value: {formatCurrency(userHolding.amount * asset.price)}</p>
                    </div>
                    <div className="text-right">
                       <p className={cn("font-bold text-lg", (asset.price - userHolding.avgPrice) >= 0 ? "text-[#00FFB2]" : "text-[#FF4D6D]")}>
                         {(((asset.price - userHolding.avgPrice) / userHolding.avgPrice) * 100).toFixed(2)}%
                       </p>
                       <p className="text-xs text-muted-foreground">Total P/L</p>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="py-4 text-center">
                  <p className="text-sm text-muted-foreground italic">No holdings in this asset yet.</p>
                </div>
              )}
            </CardContent>
          </Card>
          
          <div className="flex items-center gap-2 justify-center text-[10px] text-muted-foreground py-2 uppercase tracking-tight">
            <ShieldCheck className="w-3 h-3 text-primary" /> SECURED BY ANGRYTRADERS QUANTUM ENCRYPTION
          </div>
        </div>
      </div>
    </motion.div>
  );
};
