
import React from 'react';
import { motion } from 'motion/react';
import { useApp } from '../context/AppContext';
import { 
  PieChart as PieChartIcon, 
  Wallet, 
  TrendingUp, 
  TrendingDown, 
  ArrowUpRight, 
  History,
  Target,
  Shield,
  Search
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { 
  PieChart, 
  Pie, 
  Cell, 
  ResponsiveContainer, 
  Tooltip as RechartsTooltip,
  BarChart,
  Bar,
  XAxis,
  YAxis
} from 'recharts';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Input } from '@/components/ui/input';
import { useNavigate } from 'react-router-dom';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';

const COLORS = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#ec4899'];

export const PortfolioPage = () => {
  const { user, assets, formatCurrency, t } = useApp();
  const navigate = useNavigate();

  if (!user) return null;

  const portfolioWithData = user.portfolio.map(p => {
    const asset = assets.find(a => a.id === p.assetId);
    const currentValue = p.amount * (asset?.price || 0);
    const costBasis = p.amount * p.avgPrice;
    const profitLoss = currentValue - costBasis;
    const profitLossPercentage = costBasis > 0 ? (profitLoss / costBasis) * 100 : 0;

    return {
      ...p,
      asset,
      currentValue,
      costBasis,
      profitLoss,
      profitLossPercentage
    };
  });

  const totalPortfolioValue = portfolioWithData.reduce((acc, curr) => acc + curr.currentValue, 0);
  const totalCostBasis = portfolioWithData.reduce((acc, curr) => acc + curr.costBasis, 0);
  const totalProfitLoss = totalPortfolioValue - totalCostBasis;
  const totalProfitLossPercentage = (totalProfitLoss / totalCostBasis) * 100 || 0;

  const pieData = portfolioWithData.map(p => ({
    name: p.symbol,
    value: p.currentValue
  })).sort((a, b) => b.value - a.value);

  // Performance data mock
  const performanceData = [
    { name: 'Mon', value: 4000 },
    { name: 'Tue', value: 3000 },
    { name: 'Wed', value: 2000 },
    { name: 'Thu', value: 2780 },
    { name: 'Fri', value: 1890 },
    { name: 'Sat', value: 2390 },
    { name: 'Sun', value: totalPortfolioValue / 10 },
  ];

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.98 }}
      animate={{ opacity: 1, scale: 1 }}
      className="space-y-8"
    >
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 rounded-2xl bg-primary/10 flex items-center justify-center text-primary shadow-inner">
            <Wallet className="w-8 h-8" />
          </div>
          <div>
            <h1 className="text-3xl font-bold tracking-tight">{t('portfolio')}</h1>
            <p className="text-muted-foreground flex items-center gap-1.5">
              <Shield className="w-3 h-3" /> Encrypted Asset Management
            </p>
          </div>
        </div>
        <div className="flex gap-3">
          <Button variant="outline" className="rounded-xl border-white/5 bg-white/5 font-bold">
            <History className="w-4 h-4 mr-2" /> View History
          </Button>
          <Button className="rounded-xl bg-primary shadow-xl shadow-primary/20 font-bold px-6">
            Export Report
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <Card className="glass border-white/5 lg:col-span-1 overflow-hidden group">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm text-muted-foreground uppercase tracking-widest font-mono">{t('balance')}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-1">
              <h2 className="text-4xl font-bold font-mono tracking-tighter">
                {formatCurrency(totalPortfolioValue)}
              </h2>
              <div className="flex items-center gap-2">
                <span className={`flex items-center text-sm font-bold ${totalProfitLoss >= 0 ? "text-[#00FFB2]" : "text-[#FF4D6D]"}`}>
                  {totalProfitLoss >= 0 ? <TrendingUp className="w-4 h-4 mr-1" /> : <TrendingDown className="w-4 h-4 mr-1" />}
                  {formatCurrency(Math.abs(totalProfitLoss))} ({totalProfitLossPercentage.toFixed(2)}%)
                </span>
                <span className="text-xs text-muted-foreground">All-time P/L</span>
              </div>
            </div>
            <div className="mt-8 pt-6 border-t border-white/5 flex gap-12">
              <div>
                <p className="text-xs text-muted-foreground uppercase mb-1">Available Cash</p>
                <p className="font-bold font-mono text-lg">{formatCurrency(user.balance)}</p>
              </div>
              <div>
                <p className="text-xs text-muted-foreground uppercase mb-1">Risk Rating</p>
                <div className="flex items-center gap-1.5">
                  <Badge className="bg-yellow-500/20 text-yellow-500 hover:bg-yellow-500/30 border-yellow-500/30">MEDIUM</Badge>
                </div>
              </div>
            </div>
          </CardContent>
          <div className="absolute top-0 right-0 p-4 opacity-5 pointer-events-none group-hover:scale-110 transition-transform">
            <Target className="w-32 h-32" />
          </div>
        </Card>

        {/* Allocation Chart */}
        <Card className="glass border-white/5 lg:col-span-1 min-h-[300px]">
          <CardHeader className="pb-0">
            <CardTitle className="text-sm uppercase font-mono text-muted-foreground">Asset Allocation</CardTitle>
          </CardHeader>
          <CardContent className="h-[250px] relative">
            {pieData.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%" debounce={1}>
                <PieChart>
                  <Pie
                    data={pieData}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={80}
                    paddingAngle={5}
                    dataKey="value"
                    animationDuration={1000}
                  >
                    {pieData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <RechartsTooltip 
                    contentStyle={{ backgroundColor: '#1e293b', border: 'none', borderRadius: '12px' }}
                  />
                </PieChart>
              </ResponsiveContainer>
            ) : (
              <div className="flex items-center justify-center h-full text-muted-foreground text-sm italic">
                No items in portfolio
              </div>
            )}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-center pointer-events-none">
              <PieChartIcon className="w-6 h-6 mx-auto text-primary" />
              <p className="text-[10px] text-muted-foreground font-mono uppercase mt-1">Diversity</p>
            </div>
          </CardContent>
        </Card>

        {/* Performance Chart */}
        <Card className="glass border-white/5 lg:col-span-1">
          <CardHeader className="pb-0">
            <CardTitle className="text-sm uppercase font-mono text-muted-foreground">Weekly Performance</CardTitle>
          </CardHeader>
          <CardContent className="h-[250px] pt-4">
             <ResponsiveContainer width="100%" height="100%" debounce={1}>
               <BarChart data={performanceData}>
                 <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 10, fill: '#94a3b8' }} />
                 <YAxis hide />
                 <RechartsTooltip cursor={{ fill: 'rgba(255,255,255,0.05)' }} contentStyle={{ backgroundColor: '#1e293b', border: 'none', borderRadius: '12px' }} />
                 <Bar dataKey="value" fill="#3b82f6" radius={[4, 4, 0, 0]} />
               </BarChart>
             </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      <div className="space-y-4">
        <div className="flex flex-col md:flex-row justify-between md:items-center gap-4">
          <h2 className="text-xl font-bold">Your Assets</h2>
          <div className="relative max-w-sm w-full">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input placeholder="Search holdings..." className="pl-10 bg-white/5 border-white/5 rounded-xl h-10" />
          </div>
        </div>

        <Card className="glass border-white/5">
          <CardContent className="p-0">
            <Table>
              <TableHeader>
                <TableRow className="hover:bg-transparent border-white/5">
                  <TableHead className="pl-6">Asset</TableHead>
                  <TableHead>Balance</TableHead>
                  <TableHead>Avg. Entry</TableHead>
                  <TableHead>Current Price</TableHead>
                  <TableHead>Market Value</TableHead>
                  <TableHead>Profit/Loss</TableHead>
                  <TableHead className="pr-6 text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {portfolioWithData.length > 0 ? (
                  portfolioWithData.map((p) => (
                    <TableRow 
                      key={p.assetId} 
                      className="group border-white/5 hover:bg-white/5 transition-colors cursor-pointer"
                      onClick={() => navigate(`/markets/${p.assetId}`)}
                    >
                      <TableCell className="pl-6 font-medium">
                        <div className="flex items-center gap-3">
                          <div className="w-9 h-9 rounded-xl bg-white/5 flex items-center justify-center font-bold text-sm">
                            {p.symbol}
                          </div>
                          <div>
                            <p className="font-bold">{p.symbol}</p>
                            <p className="text-xs text-muted-foreground capitalize">{p.asset?.category}</p>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <p className="font-bold">{p.amount.toLocaleString()}</p>
                        <p className="text-xs text-muted-foreground">Invested: {formatCurrency(p.costBasis)}</p>
                      </TableCell>
                      <TableCell className="font-mono text-muted-foreground">{formatCurrency(p.avgPrice)}</TableCell>
                      <TableCell className="font-mono">{formatCurrency(p.asset?.price || 0)}</TableCell>
                      <TableCell className="font-mono font-bold">{formatCurrency(p.currentValue)}</TableCell>
                      <TableCell>
                        <span className={`text-sm font-bold flex items-center ${p.profitLoss >= 0 ? "text-[#00FFB2]" : "text-[#FF4D6D]"}`}>
                          {p.profitLoss >= 0 ? '+' : '-'}{formatCurrency(Math.abs(p.profitLoss))} ({p.profitLossPercentage.toFixed(2)}%)
                        </span>
                      </TableCell>
                      <TableCell className="pr-6 text-right">
                        <Button variant="ghost" size="sm" className="rounded-lg hover:bg-primary/20 hover:text-primary">
                          Trade
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                     <TableCell colSpan={7} className="h-32 text-center text-muted-foreground italic">
                        Your portfolio is empty. Time to make your first trade!
                     </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card className="glass border-white/5 p-6 space-y-4">
           <h3 className="font-bold tracking-tight">Best Performing</h3>
           {portfolioWithData.length > 0 ? (
             <div className="flex items-center justify-between p-4 bg-[#00FFB2]/10 border border-[#00FFB2]/20 rounded-2xl">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-xl bg-[#00FFB2] text-black flex items-center justify-center">
                    <ArrowUpRight className="w-6 h-6" />
                  </div>
                  <div>
                    <p className="text-lg font-bold">SOL/USD</p>
                    <p className="text-xs text-muted-foreground">Holding for 12 days</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-xl font-bold text-[#00FFB2]">+42.15%</p>
                  <p className="text-xs text-muted-foreground">+$1,240.50</p>
                </div>
             </div>
           ) : (
             <div className="h-20 flex items-center justify-center border border-dashed border-white/10 rounded-2xl text-muted-foreground text-sm">
                Awaiting market data...
             </div>
           )}
        </Card>
        
        <Card className="glass border-white/5 p-6 space-y-4">
           <h3 className="font-bold tracking-tight">Worst Performing</h3>
           {portfolioWithData.length > 0 ? (
             <div className="flex items-center justify-between p-4 bg-[#FF4D6D]/10 border border-[#FF4D6D]/20 rounded-2xl">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-xl bg-[#FF4D6D] text-white flex items-center justify-center">
                    <TrendingDown className="w-6 h-6" />
                  </div>
                  <div>
                    <p className="text-lg font-bold">TSLA/USD</p>
                    <p className="text-xs text-muted-foreground">Holding for 3 days</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-xl font-bold text-[#FF4D6D]">-12.42%</p>
                  <p className="text-xs text-muted-foreground">-$420.00</p>
                </div>
             </div>
           ) : (
             <div className="h-20 flex items-center justify-center border border-dashed border-white/10 rounded-2xl text-muted-foreground text-sm">
                Awaiting market data...
             </div>
           )}
        </Card>
      </div>
    </motion.div>
  );
};
