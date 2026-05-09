
import React from 'react';
import { motion } from 'motion/react';
import { useApp } from '../context/AppContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { 
  TrendingUp, 
  TrendingDown, 
  ArrowUpRight, 
  ArrowDownRight, 
  Zap, 
  BarChart3, 
  Clock, 
  ChevronRight,
  Plus,
  X,
  Wallet,
  CheckCircle2
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { useNavigate } from 'react-router-dom';
import { cn } from '@/lib/utils';
import { AnimatePresence } from 'motion/react';

const Sparkline = ({ data, color }: { data: number[], color: string }) => {
  const chartData = data.map((val, i) => ({ value: val, time: i }));
  return (
    <div className="h-10 w-24">
      <ResponsiveContainer width="100%" height="100%" debounce={1}>
        <AreaChart data={chartData}>
          <Area 
            type="monotone" 
            dataKey="value" 
            stroke={color} 
            fill={color} 
            fillOpacity={0.1} 
            strokeWidth={2}
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
};

const StatCard = ({ title, value, change, icon: Icon, color }: any) => (
  <Card className="glass relative overflow-hidden group hover-glow cursor-default border-white/5 transition-all">
    <CardContent className="p-6">
      <div className="flex justify-between items-start mb-4">
        <div className={`p-2 rounded-xl bg-primary/10 text-primary`}>
          <Icon className="w-5 h-5" />
        </div>
        <Badge variant="outline" className={change >= 0 ? "text-[#00FFB2] border-[#00FFB2]/20 bg-[#00FFB2]/5" : "text-[#FF4D6D] border-[#FF4D6D]/20 bg-[#FF4D6D]/5"}>
          {change >= 0 ? '+' : ''}{change}%
        </Badge>
      </div>
      <div className="space-y-1">
        <p className="text-sm font-medium text-muted-foreground">{title}</p>
        <h3 className="text-2xl font-bold tracking-tight text-foreground">{value}</h3>
      </div>
      <div className="absolute -right-4 -bottom-4 opacity-5 group-hover:opacity-10 transition-opacity">
        <Icon className="w-24 h-24" />
      </div>
    </CardContent>
  </Card>
);

export const DashboardPage = () => {
  const { assets, user, isLoading, toggleWatchlist, updateProfile, formatCurrency, t } = useApp();
  const navigate = useNavigate();
  const [isDepositOpen, setIsDepositOpen] = React.useState(false);
  const [depositAmount, setDepositAmount] = React.useState('1000');
  const [isDepositing, setIsDepositing] = React.useState(false);
  const [depositSuccess, setDepositSuccess] = React.useState(false);

  if (isLoading) return <div>Loading...</div>;

  const handleDeposit = () => {
    setIsDepositing(true);
    setTimeout(() => {
      if (user) {
        updateProfile({ balance: user.balance + parseFloat(depositAmount) });
        setIsDepositing(false);
        setDepositSuccess(true);
        setTimeout(() => {
          setDepositSuccess(false);
          setIsDepositOpen(false);
        }, 2000);
      }
    }, 1500);
  };

  const topGainers = [...assets].sort((a, b) => b.change24h - a.change24h).slice(0, 4);
  const totalBalance = user?.balance || 0;
  
  const portfolioSummary = user?.portfolio.reduce((acc, item) => {
    const asset = assets.find(a => a.id === item.assetId);
    if (!asset) return acc;
    
    const currentValue = item.amount * asset.price;
    const costBasis = item.amount * item.avgPrice;
    
    return {
      currentValue: acc.currentValue + currentValue,
      costBasis: acc.costBasis + costBasis
    };
  }, { currentValue: 0, costBasis: 0 }) || { currentValue: 0, costBasis: 0 };

  const totalValue = totalBalance + portfolioSummary.currentValue;
  const totalProfitLoss = portfolioSummary.currentValue - portfolioSummary.costBasis;
  const plPercentage = portfolioSummary.costBasis > 0 
    ? (totalProfitLoss / portfolioSummary.costBasis) * 100 
    : 0;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-8"
    >
      {/* Header Info */}
      <div className="flex flex-col md:flex-row gap-6 justify-between items-start md:items-end">
        <div>
          <h1 className="text-3xl font-bold tracking-tight mb-2">Welcome back, {user?.name || 'Trader'}</h1>
          <p className="text-muted-foreground font-medium">Market is currently <span className="text-[#00FFB2] font-bold animate-pulse">Live</span>. Analysis complete.</p>
        </div>
        <div className="flex gap-4">
          <Button 
            className="rounded-xl px-6 h-12 bg-primary hover:bg-primary/90 text-primary-foreground font-bold shadow-lg shadow-primary/20"
            onClick={() => setIsDepositOpen(true)}
          >
            <Plus className="w-5 h-5 mr-2" /> Deposit
          </Button>
          <Button variant="outline" className="rounded-xl px-6 h-12 border-white/10 hover:bg-white/5">
            Withdraw
          </Button>
        </div>
      </div>

      <AnimatePresence>
        {isDepositOpen && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-black/60 backdrop-blur-sm"
              onClick={() => !isDepositing && !depositSuccess && setIsDepositOpen(false)}
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="relative w-full max-w-md bg-card border border-white/10 rounded-3xl shadow-2xl overflow-hidden hover-glow"
            >
              <div className="p-8">
                {depositSuccess ? (
                  <div className="text-center py-10 space-y-4">
                    <div className="w-20 h-20 bg-[#00FFB2]/10 rounded-full flex items-center justify-center mx-auto">
                      <CheckCircle2 className="w-10 h-10 text-[#00FFB2]" />
                    </div>
                    <h2 className="text-2xl font-bold">Deposit Successful</h2>
                    <p className="text-muted-foreground">Your account balance has been updated.</p>
                  </div>
                ) : (
                  <>
                    <div className="flex justify-between items-center mb-6">
                      <h2 className="text-2xl font-bold">Deposit Funds</h2>
                      <Button variant="ghost" size="icon" onClick={() => setIsDepositOpen(false)} disabled={isDepositing}>
                        <X className="w-5 h-5" />
                      </Button>
                    </div>
                    <div className="space-y-6">
                      <div className="p-4 bg-primary/5 rounded-2xl border border-primary/10 flex items-center gap-4">
                        <Wallet className="w-6 h-6 text-primary" />
                        <div>
                          <p className="text-xs text-muted-foreground uppercase tracking-wider font-bold">Current Balance</p>
                          <p className="text-xl font-black text-foreground font-mono">{formatCurrency(user?.balance || 0)}</p>
                        </div>
                      </div>
                      <div className="space-y-2">
                        <label className="text-xs font-black uppercase text-muted-foreground/50 ml-1">Amount to Deposit (USD)</label>
                        <Input 
                          type="number" 
                          value={depositAmount} 
                          onChange={(e) => setDepositAmount(e.target.value)}
                          className="h-14 bg-white/5 border-white/5 rounded-2xl text-xl font-bold font-mono focus:bg-white/10"
                        />
                      </div>
                      <Button 
                        className="w-full h-14 rounded-2xl font-black text-lg shadow-lg shadow-primary/20"
                        onClick={handleDeposit}
                        disabled={isDepositing || !depositAmount || parseFloat(depositAmount) <= 0}
                      >
                        {isDepositing ? "Processing..." : `Complete Deposit`}
                      </Button>
                    </div>
                  </>
                )}
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard 
          title="Total Net Worth" 
          value={formatCurrency(totalValue)} 
          change={2.4} 
          icon={BarChart3} 
          color="primary" 
        />
        <StatCard 
          title="Profit / Loss" 
          value={formatCurrency(totalProfitLoss)} 
          change={plPercentage.toFixed(2)} 
          icon={TrendingUp} 
          color={totalProfitLoss >= 0 ? "green-500" : "red-500"} 
        />
        <StatCard 
          title={t('balance')} 
          value={formatCurrency(totalBalance)} 
          change={0} 
          icon={Zap} 
          color="blue-500" 
        />
        <StatCard 
          title="Active Positions" 
          value={user?.portfolio.length || 0} 
          change={-1.2} 
          icon={Clock} 
          color="amber-500" 
        />
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        {/* Main Watchlist */}
        <Card className="xl:col-span-2 glass border-white/5 hover-glow transition-all">
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle>Market Overview</CardTitle>
            <Button variant="ghost" className="text-primary font-bold" onClick={() => navigate('/markets')}>
              View Markets <ChevronRight className="w-4 h-4 ml-1" />
            </Button>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow className="hover:bg-transparent border-white/5">
                  <TableHead>Asset</TableHead>
                  <TableHead>Price</TableHead>
                  <TableHead>24h Change</TableHead>
                  <TableHead className="hidden md:table-cell">Market Cap</TableHead>
                  <TableHead className="hidden md:table-cell">Last 7 Days</TableHead>
                  <TableHead></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {assets.slice(0, 6).map((asset) => (
                  <TableRow 
                    key={asset.id} 
                    className="group border-white/5 cursor-pointer hover:bg-white/5 transition-colors"
                    onClick={() => navigate(`/markets/${asset.id}`)}
                  >
                    <TableCell className="font-medium">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold text-xs">
                          {asset.symbol[0]}
                        </div>
                        <div>
                          <p className="font-bold">{asset.symbol}</p>
                          <p className="text-xs text-muted-foreground">{asset.name}</p>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell className="font-mono font-bold">
                      {formatCurrency(asset.price)}
                    </TableCell>
                    <TableCell>
                      <span className={cn("flex items-center font-bold text-sm", asset.change24h >= 0 ? "text-[#00FFB2]" : "text-[#FF4D6D]")}>
                        {asset.change24h >= 0 ? <TrendingUp className="w-3 h-3 mr-1" /> : <TrendingDown className="w-3 h-3 mr-1" />}
                        {Math.abs(asset.change24h)}%
                      </span>
                    </TableCell>
                    <TableCell className="hidden md:table-cell text-muted-foreground text-sm">{asset.marketCap}</TableCell>
                    <TableCell className="hidden md:table-cell">
                      <Sparkline data={asset.sparkline} color={asset.change24h >= 0 ? "#00FFB2" : "#FF4D6D"} />
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Button 
                          variant="ghost" 
                          size="icon" 
                          className={cn(
                            "rounded-lg transition-colors",
                            user?.watchlist.includes(asset.id) ? "text-primary bg-primary/10" : "text-muted-foreground hover:text-primary"
                          )}
                          onClick={(e) => {
                            e.stopPropagation();
                            toggleWatchlist(asset.id);
                          }}
                        >
                          <Plus className={cn("w-4 h-4 transition-transform", user?.watchlist.includes(asset.id) && "rotate-45")} />
                        </Button>
                        <Button variant="ghost" size="icon" className="text-muted-foreground group-hover:text-primary">
                          <ChevronRight className="w-4 h-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>

        {/* Top Movers Sidebar */}
        <div className="space-y-6">
          <Card className="glass border-white/5 bg-gradient-to-br from-card/80 to-primary/5">
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <Zap className="w-4 h-4 text-primary" /> Top Performers
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {topGainers.map((asset) => (
                <div 
                  key={asset.id} 
                  className="flex items-center justify-between p-3 rounded-xl bg-white/5 hover:bg-white/10 transition-colors cursor-pointer group"
                  onClick={() => navigate(`/markets/${asset.id}`)}
                >
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-[#00FFB2]/10 flex items-center justify-center text-[#00FFB2]">
                      {asset.change24h >= 0 ? <TrendingUp className="w-5 h-5" /> : <TrendingDown className="w-5 h-5" />}
                    </div>
                    <div>
                      <p className="font-bold">{asset.symbol}</p>
                      <p className="text-xs text-muted-foreground">{asset.name}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-bold text-[#00FFB2]">+{asset.change24h}%</p>
                    <p className="text-xs font-mono text-muted-foreground">{formatCurrency(asset.price)}</p>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>

          {/* Quick Trade Hint */}
          <Card className="glass border-white/5 overflow-hidden relative hover-glow transition-all cursor-pointer" onClick={() => navigate('/pro-insights')}>
            <div className="absolute top-0 right-0 p-4 opacity-10">
              <BarChart3 className="w-24 h-24" />
            </div>
            <CardHeader>
              <CardTitle className="text-lg">Pro Insights</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground mb-4">
                Bitcoin is showing strong support at $64,000. Institutional volume has increased by 12% in the last 4 hours.
              </p>
              <Button variant="link" className="p-0 h-auto text-primary font-bold" onClick={(e) => { e.stopPropagation(); navigate('/pro-insights'); }}>
                Read full analysis <ArrowUpRight className="w-4 h-4 ml-1" />
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </motion.div>
  );
};
