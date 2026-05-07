
import React, { useState } from 'react';
import { motion } from 'motion/react';
import { useApp } from '../context/AppContext';
import { Card, CardContent } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { 
  Search, 
  TrendingUp, 
  TrendingDown, 
  Star, 
  ChevronRight, 
  Activity, 
  Filter,
  ArrowUpDown,
  Zap
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { cn } from '@/lib/utils';
import { ResponsiveContainer, AreaChart, Area } from 'recharts';

const CompactSparkline = ({ data, color }: { data: number[], color: string }) => {
  const chartData = data.map((val, i) => ({ value: val }));
  return (
    <div className="h-8 w-20">
      <ResponsiveContainer width="100%" height="100%" debounce={1}>
        <AreaChart data={chartData}>
          <Area 
            type="monotone" 
            dataKey="value" 
            stroke={color} 
            fill={color} 
            fillOpacity={0.1} 
            strokeWidth={1.5}
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
};

export const MarketsPage = () => {
  const { assets, user, toggleWatchlist } = useApp();
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const [activeCategory, setActiveCategory] = useState<'all' | 'crypto' | 'stock'>('all');

  const filteredAssets = assets.filter(asset => {
    const matchesSearch = asset.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          asset.symbol.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = activeCategory === 'all' || asset.category === activeCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="space-y-6"
    >
      <div className="flex flex-col md:flex-row gap-6 justify-between items-start md:items-end">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Market Terminal</h1>
          <p className="text-muted-foreground mt-1 font-medium">Real-time data for over 250+ global assets on the <span className="text-primary font-bold">AngryTraders</span> Network.</p>
        </div>
        <div className="flex gap-2 w-full md:w-auto">
           <div className="relative flex-1 md:w-64">
             <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
             <Input 
                placeholder="Search markets..." 
                className="pl-10 bg-white/5 border-white/5 rounded-xl h-11"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
             />
           </div>
           <Button variant="outline" className="rounded-xl border-white/5 bg-white/5 h-11">
             <Filter className="w-4 h-4" />
           </Button>
        </div>
      </div>

      <div className="flex gap-2 p-1 bg-white/5 rounded-2xl w-fit">
        {['all', 'crypto', 'stock', 'forex', 'commodities'].map((cat) => (
          <Button 
            key={cat}
            variant="ghost" 
            size="sm"
            className={cn(
                "rounded-xl px-6 capitalize transition-all duration-300", 
                activeCategory === cat ? "bg-primary text-primary-foreground shadow-lg shadow-primary/20" : "text-muted-foreground hover:bg-white/5"
            )}
            onClick={() => setActiveCategory(cat as any)}
          >
            {cat}
          </Button>
        ))}
      </div>

      <Card className="glass border-white/5 overflow-hidden hover-glow transition-all">
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow className="hover:bg-transparent border-white/5 bg-white/5">
                <TableHead className="w-[50px] pl-6"></TableHead>
                <TableHead className="font-bold uppercase text-[10px] tracking-widest font-mono">
                  <div className="flex items-center gap-2 cursor-pointer group">
                    Asset <ArrowUpDown className="w-3 h-3 opacity-30 group-hover:opacity-100" />
                  </div>
                </TableHead>
                <TableHead className="font-bold uppercase text-[10px] tracking-widest font-mono">
                  <div className="flex items-center gap-2 cursor-pointer group">
                    Price <ArrowUpDown className="w-3 h-3 opacity-30 group-hover:opacity-100" />
                  </div>
                </TableHead>
                <TableHead className="font-bold uppercase text-[10px] tracking-widest font-mono">24h Change</TableHead>
                <TableHead className="hidden md:table-cell font-bold uppercase text-[10px] tracking-widest font-mono text-center">7D Performance</TableHead>
                <TableHead className="hidden lg:table-cell font-bold uppercase text-[10px] tracking-widest font-mono">Volume (24h)</TableHead>
                <TableHead className="hidden lg:table-cell font-bold uppercase text-[10px] tracking-widest font-mono">Market Cap</TableHead>
                <TableHead className="pr-6 text-right font-bold uppercase text-[10px] tracking-widest font-mono">Action</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredAssets.map((asset) => (
                <TableRow 
                  key={asset.id} 
                  className="group border-white/5 cursor-pointer hover:bg-primary/5 transition-all"
                  onClick={() => navigate(`/markets/${asset.id}`)}
                >
                  <TableCell className="pl-6">
                    <Button 
                      variant="ghost" 
                      size="icon"
                      onClick={(e) => {
                        e.stopPropagation();
                        toggleWatchlist(asset.id);
                      }}
                      className={cn(
                        "transition-all duration-300",
                        user?.watchlist.includes(asset.id) ? "text-yellow-500 bg-yellow-500/10" : "text-muted-foreground hover:text-yellow-500"
                      )}
                    >
                      <Star className={cn("w-4 h-4", user?.watchlist.includes(asset.id) && "fill-current")} />
                    </Button>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center font-bold text-sm group-hover:scale-110 transition-transform">
                        {asset.symbol}
                      </div>
                      <div>
                        <p className="font-bold tracking-tight">{asset.symbol}</p>
                        <p className="text-[10px] text-muted-foreground font-medium uppercase">{asset.name}</p>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell className="font-mono font-bold">
                    ${asset.price.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                  </TableCell>
                  <TableCell>
                    <div className={cn("inline-flex items-center gap-1.5 px-2 py-1 rounded-lg text-xs font-bold font-mono", asset.change24h >= 0 ? "text-[#00FFB2] bg-[#00FFB2]/10" : "text-[#FF4D6D] bg-[#FF4D6D]/10")}>
                      {asset.change24h >= 0 ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
                      {asset.change24h}%
                    </div>
                  </TableCell>
                   <TableCell className="hidden md:table-cell">
                    <div className="flex justify-center">
                       <CompactSparkline data={asset.sparkline} color={asset.change24h >= 0 ? "#00FFB2" : "#FF4D6D"} />
                    </div>
                  </TableCell>
                  <TableCell className="hidden lg:table-cell font-mono text-xs text-muted-foreground tracking-tight">
                    {asset.volume}
                  </TableCell>
                  <TableCell className="hidden lg:table-cell font-mono text-xs text-muted-foreground tracking-tight">
                    {asset.marketCap}
                  </TableCell>
                  <TableCell className="pr-6 text-right">
                    <Button variant="outline" className="rounded-xl border-white/10 group-hover:bg-primary group-hover:text-primary-foreground group-hover:border-transparent transition-all h-9 px-4 text-xs font-bold uppercase tracking-widest">
                       Trade
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
        {filteredAssets.length === 0 && (
          <div className="p-20 text-center space-y-4">
             <Activity className="w-12 h-12 mx-auto text-muted-foreground opacity-20" />
             <p className="text-muted-foreground font-medium italic">No assets found matching your criteria.</p>
             <Button variant="link" onClick={() => { setSearchTerm(''); setActiveCategory('all'); }} className="text-primary font-bold">Reset Filters</Button>
          </div>
        )}
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <Card className="glass border-white/5 bg-gradient-to-br from-primary/10 to-transparent p-6 relative overflow-hidden group hover-glow transition-all">
          <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:rotate-12 transition-transform">
            <Zap className="w-20 h-20" />
          </div>
          <Badge className="mb-4 bg-primary text-primary-foreground">HOT ASSET</Badge>
          <h3 className="text-2xl font-bold mb-2 text-foreground">SOL/USD</h3>
          <p className="text-muted-foreground text-sm leading-relaxed mb-6 font-medium">
            Solana is seeing extreme whale activity on the <span className="text-primary font-bold">AngryTraders</span> Network with institutional buy pressure increasing by 450% over the last hour.
          </p>
          <Button className="rounded-xl font-bold px-6 shadow-lg shadow-primary/20">View Detail</Button>
        </Card>
      </div>
    </motion.div>
  );
};
