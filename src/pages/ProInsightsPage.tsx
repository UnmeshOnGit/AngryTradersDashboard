
import React from 'react';
import { motion } from 'motion/react';
import { 
  Zap, 
  TrendingUp, 
  Target, 
  ShieldAlert, 
  Lightbulb, 
  Globe,
  ArrowUpRight,
  Clock,
  BookOpen,
  PieChart
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { cn } from '@/lib/utils';

export const ProInsightsPage = () => {
  const { assets } = useApp();

  const mockNews = [
    {
      id: 1,
      title: "Bitcoin ETFs See Massive Inflows from Sovereign Wealth Funds",
      source: "CryptoGlobal",
      time: "12m ago",
      impact: "High",
      category: "Crypto"
    },
    {
      id: 2,
      title: "Tech Giants Announce Multi-Billion Dollar AI Infrastructure Partnership",
      source: "WallSt Daily",
      time: "45m ago",
      impact: "Medium",
      category: "Stocks"
    },
    {
      id: 3,
      title: "Federal Reserve Chair Hints at Rate Stabilization Through Q4",
      source: "MacroInsights",
      time: "2h ago",
      impact: "High",
      category: "Economics"
    },
    {
      id: 4,
      title: "New Regulation Framework Proposed for Digital Asset Custody",
      source: "LegalBrief",
      time: "4h ago",
      impact: "Low",
      category: "Regulation"
    }
  ];

  const tradingTips = [
    {
      title: "Risk Management: The 1% Rule",
      desc: "Never risk more than 1% of your total account balance on a single trade. This ensures longevity even during losing streaks.",
      icon: ShieldAlert,
      color: "red-500"
    },
    {
      title: "Trend Identification",
      desc: "The trend is your friend until the end. Use the 200-day Moving Average to identify the long-term market direction.",
      icon: TrendingUp,
      color: "green-500"
    },
    {
      title: "Emotional Discipline",
      desc: "Plan your trade and trade your plan. Don't let fear or greed override your predefined exit strategies.",
      icon: Target,
      color: "primary"
    },
    {
      title: "DCA Strategy",
      desc: "Dollar-Cost Averaging helps mitigate volatility by spreading buys over time rather than attempting to time the exact bottom.",
      icon: Zap,
      color: "accent-blue"
    }
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-8 max-w-7xl mx-auto pb-12"
    >
      <div className="px-2">
        <h1 className="text-3xl font-bold tracking-tight">Pro Insights</h1>
        <p className="text-muted-foreground mt-1 font-medium">Advanced market research and institutional-grade trading intelligence.</p>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
        {/* Market Analysis Feed */}
        <div className="xl:col-span-2 space-y-6">
          <Card className="glass border-white/5 hover-glow transition-all">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Globe className="w-5 h-5 text-primary" /> Global Market News
              </CardTitle>
              <CardDescription>Live updates from our network of intelligence partners.</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {mockNews.map((news) => (
                  <div key={news.id} className="p-4 rounded-2xl bg-white/[0.02] border border-white/5 hover:border-primary/20 transition-all cursor-pointer group">
                    <div className="flex justify-between items-start mb-2">
                      <div className="flex items-center gap-2">
                        <Badge variant="outline" className="text-[10px] font-black uppercase tracking-widest">{news.category}</Badge>
                        <span className="text-[10px] text-muted-foreground font-mono">{news.time}</span>
                      </div>
                      <Badge className={cn(
                        "text-[10px] font-black uppercase tracking-widest",
                        news.impact === 'High' ? "bg-red-500/10 text-red-500 border-red-500/20" : "bg-primary/10 text-primary border-primary/20"
                      )}>
                        {news.impact} Impact
                      </Badge>
                    </div>
                    <h4 className="font-bold text-base group-hover:text-primary transition-colors leading-snug">{news.title}</h4>
                    <div className="flex items-center justify-between mt-4">
                      <span className="text-xs text-muted-foreground">Source: <span className="text-foreground">{news.source}</span></span>
                      <Button variant="ghost" size="sm" className="h-7 text-xs font-bold gap-1 group-hover:translate-x-1 transition-transform">
                        Read Story <ArrowUpRight className="w-3 h-3" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
             <Card className="glass border-white/5 hover-glow transition-all">
                <CardHeader>
                  <CardTitle className="text-lg">Technical Outlook</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                   <div className="flex justify-between items-center text-sm">
                      <span className="text-muted-foreground">BTC Support Level</span>
                      <span className="font-mono font-bold">$62,400</span>
                   </div>
                   <div className="flex justify-between items-center text-sm">
                      <span className="text-muted-foreground">RSI Index</span>
                      <span className="text-[#FF4D6D] font-bold">72.4 (Overbought)</span>
                   </div>
                   <div className="w-full bg-muted/30 h-2 rounded-full overflow-hidden mt-4">
                      <div className="bg-primary h-full w-[72%]" />
                   </div>
                   <p className="text-xs text-muted-foreground leading-relaxed">Most crypto indicators are flashing cautinary signals. Volume remains consistent but consolidating.</p>
                </CardContent>
             </Card>
             <Card className="glass border-white/5 hover-glow transition-all">
                <CardHeader>
                  <CardTitle className="text-lg">Sector Strength</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                   <div className="flex justify-between items-center text-sm">
                      <span className="text-muted-foreground">AI Tech</span>
                      <span className="text-[#00FFB2] font-bold">+12.4%</span>
                   </div>
                   <div className="flex justify-between items-center text-sm">
                      <span className="text-muted-foreground">Energy</span>
                      <span className="text-[#00FFB2] font-bold">+2.1%</span>
                   </div>
                   <div className="flex justify-between items-center text-sm">
                      <span className="text-muted-foreground">Banking</span>
                      <span className="text-[#FF4D6D] font-bold">-1.8%</span>
                   </div>
                   <div className="flex justify-between items-center text-sm">
                      <span className="text-muted-foreground">Retail</span>
                      <span className="text-muted-foreground">0.0%</span>
                   </div>
                </CardContent>
             </Card>
          </div>
        </div>

        {/* Trading Intelligence Sidebar */}
        <div className="space-y-6">
          <Card className="glass border-white/5 bg-gradient-to-br from-primary/10 to-transparent overflow-hidden">
            <CardHeader>
              <div className="w-12 h-12 rounded-2xl bg-primary flex items-center justify-center text-white mb-2 shadow-lg shadow-primary/20">
                <Lightbulb className="w-6 h-6" />
              </div>
              <CardTitle>Trade Mastery</CardTitle>
              <CardDescription>Daily educational tips for modern market execution.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {tradingTips.map((tip, i) => (
                <div key={i} className="space-y-2">
                  <div className="flex items-center gap-2">
                    <div className={cn("p-1.5 rounded-lg bg-background/50", `text-${tip.color}`)}>
                      <tip.icon className="w-4 h-4" />
                    </div>
                    <h5 className="font-bold text-sm">{tip.title}</h5>
                  </div>
                  <p className="text-xs text-muted-foreground leading-relaxed pl-8">
                    {tip.desc}
                  </p>
                </div>
              ))}
              <Button className="w-full rounded-xl h-11 font-bold mt-4 shadow-lg shadow-primary/20">
                <BookOpen className="w-4 h-4 mr-2" /> Access Full Academy
              </Button>
            </CardContent>
          </Card>

          <Card className="glass border-white/5 border-primary/20 relative overflow-hidden group">
             <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:rotate-12 transition-transform h-full w-full flex items-end justify-end">
                <PieChart className="w-40 h-40" />
             </div>
             <CardHeader>
                <CardTitle>Portfolio Optimizer</CardTitle>
                <CardDescription>AI-driven allocation suggestions.</CardDescription>
             </CardHeader>
             <CardContent>
                <p className="text-xs text-muted-foreground mb-6 font-medium">Based on your recent trades, our algorithms suggest rebalancing your SOL position to hedge against market volatility.</p>
                <Button variant="outline" className="w-full rounded-xl border-white/10 hover:bg-white/5">Run Analysis</Button>
             </CardContent>
          </Card>
        </div>
      </div>
    </motion.div>
  );
};
