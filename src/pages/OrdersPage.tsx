
import React, { useState } from 'react';
import { motion } from 'motion/react';
import { useApp } from '../context/AppContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Search, Filter, ArrowUpRight, ArrowDownLeft, Clock, Download, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuLabel, 
  DropdownMenuSeparator, 
  DropdownMenuTrigger 
} from '@/components/ui/dropdown-menu';

export const OrdersPage = () => {
  const { user } = useApp();
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState<'all' | 'buy' | 'sell'>('all');

  const history = user?.history || [];
  
  const filteredHistory = history.filter(trade => {
    const symbolMatch = trade.symbol?.toLowerCase() || '';
    const matchesSearch = symbolMatch.includes(searchTerm.toLowerCase());
    const matchesType = filterType === 'all' || trade.type === filterType;
    return matchesSearch && matchesType;
  });

  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      className="space-y-8"
    >
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Order History</h1>
          <p className="text-muted-foreground mt-1">A comprehensive log of all your trades on the terminal.</p>
        </div>
        <Button variant="outline" className="rounded-xl border-white/5 bg-white/5 hover:bg-white/10 h-12 px-6">
          <Download className="w-4 h-4 mr-2" /> Download CSV
        </Button>
      </div>

      <Card className="glass border-white/5">
        <CardHeader className="border-b border-white/5 bg-white/5 px-6 py-4 rounded-t-3xl">
          <div className="flex flex-col md:flex-row gap-4 justify-between items-center">
            <div className="relative w-full md:max-w-md">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input 
                placeholder="Search by ticker symbol..." 
                className="pl-10 bg-background border-white/5 rounded-xl h-10"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <div className="flex gap-2 w-full md:w-auto">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" className="flex-1 md:flex-none rounded-xl border-white/5 bg-background h-10 px-4">
                    <Filter className="w-4 h-4 mr-2" /> Filter
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="bg-popover border-border rounded-xl">
                  <DropdownMenuLabel>Order Type</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={() => setFilterType('all')}>All Orders</DropdownMenuItem>
                  <DropdownMenuItem onClick={() => setFilterType('buy')}>Buy Orders Only</DropdownMenuItem>
                  <DropdownMenuItem onClick={() => setFilterType('sell')}>Sell Orders Only</DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
              <Button variant="outline" className="flex-1 md:flex-none rounded-xl border-white/5 bg-background h-10 px-4">
                <Clock className="w-4 h-4 mr-2" /> Last 30 Days
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow className="hover:bg-transparent border-white/5 bg-white/10">
                <TableHead className="pl-6 font-bold uppercase text-[10px] tracking-widest font-mono">Date / Time</TableHead>
                <TableHead className="font-bold uppercase text-[10px] tracking-widest font-mono">Asset</TableHead>
                <TableHead className="font-bold uppercase text-[10px] tracking-widest font-mono">Type</TableHead>
                <TableHead className="font-bold uppercase text-[10px] tracking-widest font-mono">Execution Price</TableHead>
                <TableHead className="font-bold uppercase text-[10px] tracking-widest font-mono">Amount</TableHead>
                <TableHead className="font-bold uppercase text-[10px] tracking-widest font-mono">Total Value</TableHead>
                <TableHead className="font-bold uppercase text-[10px] tracking-widest font-mono">Status</TableHead>
                <TableHead className="pr-6 text-right font-bold uppercase text-[10px] tracking-widest font-mono">ID</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredHistory.length > 0 ? (
                filteredHistory.map((trade) => (
                  <TableRow key={trade.id} className="group border-white/5 hover:bg-white/5 transition-colors">
                    <TableCell className="pl-6">
                      <p className="font-medium text-sm">{new Date(trade.timestamp).toLocaleDateString()}</p>
                      <p className="text-[10px] text-muted-foreground font-mono">{new Date(trade.timestamp).toLocaleTimeString()}</p>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <div className="w-7 h-7 rounded-lg bg-primary/10 flex items-center justify-center font-bold text-[10px]">
                          {trade.symbol}
                        </div>
                        <span className="font-bold text-sm">{trade.symbol}</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-1.5 font-bold text-xs uppercase tracking-tighter">
                        {trade.type === 'buy' ? (
                          <span className="text-green-500 flex items-center gap-1">
                            <ArrowDownLeft className="w-3 h-3" /> BUY
                          </span>
                        ) : (
                          <span className="text-red-500 flex items-center gap-1">
                            <ArrowUpRight className="w-3 h-3" /> SELL
                          </span>
                        )}
                      </div>
                    </TableCell>
                    <TableCell className="font-mono text-xs">${trade.price.toLocaleString(undefined, { minimumFractionDigits: 2 })}</TableCell>
                    <TableCell className="font-mono text-xs text-muted-foreground">{trade.amount.toLocaleString()} {trade.symbol}</TableCell>
                    <TableCell className="font-mono font-bold">${(trade.price * trade.amount).toLocaleString(undefined, { minimumFractionDigits: 2 })}</TableCell>
                    <TableCell>
                      <Badge className="bg-blue-500/10 text-blue-500 border-blue-500/20 text-[10px] py-0 px-2 h-5 flex items-center w-fit">
                        {trade.status.toUpperCase()}
                      </Badge>
                    </TableCell>
                    <TableCell className="pr-6 text-right font-mono text-[10px] text-muted-foreground">
                      #{trade.id}
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={8} className="h-40 text-center text-muted-foreground italic">
                    <div className="flex flex-col items-center gap-2">
                      <Clock className="w-8 h-8 opacity-20" />
                      No trade history found.
                    </div>
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
        <div className="p-4 border-t border-white/5 flex items-center justify-between">
            <p className="text-xs text-muted-foreground">Showing 1-{filteredHistory.length} of {filteredHistory.length} orders</p>
            <div className="flex gap-2">
               <Button variant="outline" size="sm" disabled className="rounded-lg border-white/5 h-8">Previous</Button>
               <Button variant="outline" size="sm" disabled className="rounded-lg border-white/5 h-8">Next</Button>
            </div>
        </div>
      </Card>
      
      <div className="p-8 rounded-3xl bg-primary/5 border border-primary/10 flex flex-col items-center text-center max-w-2xl mx-auto space-y-4">
          <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center text-primary">
            <Filter className="w-6 h-6" />
          </div>
          <h3 className="text-xl font-bold">Trade Auditing</h3>
          <p className="text-sm text-muted-foreground max-w-sm">
            Need localized auditing for tax compliance or institutional reporting? Our premium AngryTraders tools are available for all verified users.
          </p>
          <Button variant="link" className="text-primary font-bold">Learn more about reporting tools <ChevronRight className="w-4 h-4" /></Button>
      </div>
    </motion.div>
  );
};
