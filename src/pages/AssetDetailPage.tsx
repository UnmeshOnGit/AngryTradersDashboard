
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

  // wick
  const wickX = x + width / 2;
  
  return (
    <g>
      <line 
        x1={wickX} 
        y1={y - (high - Math.max(open, close)) * (height / (Math.max(open, close) - Math.min(open, close)) || 1)} 
        x2={wickX} 
        y2={y + height + (Math.min(open, close) - low) * (height / (Math.max(open, close) - Math.min(open, close)) || 1)}
        stroke={color} 
        strokeWidth={1} 
      />
      <rect 
        x={x} 
        y={y} 
        width={width} 
        height={height} 
        fill={color} 
        stroke={color} 
      />
    </g>
  );
};
import { Badge } from '@/components/ui/badge';
import { Slider } from '@/components/ui/slider';
import { cn } from '@/lib/utils';

export const AssetDetailPage = () => {
  const { assetId } = useParams();
  const { assets, executeTrade, user } = useApp();
  const navigate = useNavigate();
  const [tradeType, setTradeType] = useState<'buy' | 'sell'>('buy');
  const [amount, setAmount] = useState('0');
  const [activeTimeframe, setActiveTimeframe] = useState('1H');

  const [showCandlesticks, setShowCandlesticks] = useState(false);
  const [showIndicators, setShowIndicators] = useState(false);
  
  const [isSuccess, setIsSuccess] = useState(false);
  const [tradeDetails, setTradeDetails] = useState<{type: string, amount: number} | null>(null);

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

  // Generate enhanced chart data
  const chartData = React.useMemo(() => {
    return asset.sparkline.map((val, i, arr) => {
      const open = i === 0 ? val * 0.99 : arr[i-1];
      const close = val;
      const high = Math.max(open, close) * (1 + Math.random() * 0.01);
      const low = Math.min(open, close) * (1 - Math.random() * 0.01);
      
      // Indicators (SMA 7)
      let sma7 = 0;
      if (i >= 6) {
        sma7 = arr.slice(i-6, i+1).reduce((a, b) => a + b, 0) / 7;
      }

      return {
        time: `${i}:00`,
        price: val,
        open,
        close,
        high,
        low,
        sma7: sma7 || val,
        volume: Math.random() * 100 + 40
      };
    });
  }, [asset.sparkline]);

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
              <span className="text-2xl font-mono font-bold">${asset.price.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
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
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
              <Tabs defaultValue="1H" className="w-[400px]" onValueChange={setActiveTimeframe}>
                <TabsList className="bg-white/5 border-white/5 p-1 rounded-xl">
                  {['1M', '5M', '15M', '1H', '4H', '1D', '1W'].map(tf => (
                    <TabsTrigger key={tf} value={tf} className="rounded-lg px-3 py-1.5 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
                      {tf}
                    </TabsTrigger>
                  ))}
                </TabsList>
              </Tabs>
              <div className="flex gap-2">
                <Button 
                  variant={showCandlesticks ? "default" : "outline"} 
                  size="sm" 
                  className={cn("rounded-lg border-white/10 hidden sm:flex", showCandlesticks && "bg-primary text-primary-foreground")}
                  onClick={() => setShowCandlesticks(!showCandlesticks)}
                >
                  Candlesticks
                </Button>
                <Button 
                  variant={showIndicators ? "default" : "outline"} 
                  size="sm" 
                  className={cn("rounded-lg border-white/10 hidden sm:flex", showIndicators && "bg-primary text-primary-foreground")}
                  onClick={() => setShowIndicators(!showIndicators)}
                >
                  Indicators
                </Button>
              </div>
            </CardHeader>
            <CardContent className="h-[400px] p-0 relative overflow-hidden">
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
                    hide={true}
                  />
                  <YAxis 
                    domain={['auto', 'auto']} 
                    axisLine={false} 
                    tickLine={false} 
                    tick={{ fill: '#94a3b8', fontSize: 10 }}
                    orientation="right"
                    tickFormatter={(v) => `$${v.toLocaleString()}`}
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
                        <p className="text-xs text-muted-foreground uppercase">Circulating Supply</p>
                        <p className="font-bold">19.6M {asset.symbol}</p>
                      </div>
                      <div className="space-y-1">
                        <p className="text-xs text-muted-foreground uppercase">All Time High</p>
                        <p className="font-bold">${(asset.price * 1.4).toLocaleString()}</p>
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
                  </CardContent>
                </Card>
              </div>
            </TabsContent>
            
            <TabsContent value="news">
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
                    <span className="text-xs text-muted-foreground">Available: {tradeType === 'buy' ? `$${user?.balance.toLocaleString()}` : `${userHolding?.amount || 0} ${asset.symbol}`}</span>
                  </div>
                  <div className="relative">
                    <Input 
                      type="number" 
                      step="any"
                      value={amount}
                      onChange={(e) => setAmount(e.target.value)}
                      className="h-16 text-2xl font-bold bg-white/5 border-white/10 rounded-2xl pr-20"
                    />
                    <div className="absolute right-4 top-1/2 -translate-y-1/2 font-bold opacity-50">
                      {asset.symbol}
                    </div>
                  </div>
                  <div className="px-1">
                    <Slider defaultValue={[0]} max={100} step={25} className="mt-4" />
                    <div className="flex justify-between mt-2 px-1">
                      {['0%', '25%', '50%', '75%', '100%'].map(p => (
                        <span key={p} className="text-[10px] text-muted-foreground hover:text-primary cursor-pointer transition-colors font-mono">{p}</span>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="space-y-3 p-4 bg-white/5 rounded-2xl border border-white/5">
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Execution Price:</span>
                    <span className="font-mono">${asset.price.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Trade Fee:</span>
                    <span className="font-mono text-primary">$0.00</span>
                  </div>
                  <div className="pt-2 border-t border-white/5 flex justify-between font-bold">
                    <span>Est. Total:</span>
                    <span className={tradeType === 'buy' ? "text-[#00FFB2]" : "text-[#FF4D6D]"}>
                      ${totalCost.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
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
                      <p className="text-sm text-muted-foreground">Current Value: ${(userHolding.amount * asset.price).toLocaleString()}</p>
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
