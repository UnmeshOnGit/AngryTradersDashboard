
import React from 'react';
import { motion } from 'motion/react';
import { 
  Bell, 
  Search, 
  Filter, 
  Trash2, 
  CheckCircle2, 
  TrendingUp, 
  Globe, 
  Zap,
  MoreVertical,
  ChevronRight
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { cn } from '@/lib/utils';

export const NotificationsPage = () => {
  const { notifications, markNotificationAsRead, theme } = useApp();
  const [filter, setFilter] = React.useState<'all' | 'unread' | 'price' | 'news'>('all');
  const [search, setSearch] = React.useState('');

  const filteredNotifications = notifications.filter(n => {
    const matchesFilter = 
      filter === 'all' || 
      (filter === 'unread' && !n.read) || 
      n.type === filter;
    
    const matchesSearch = n.title.toLowerCase().includes(search.toLowerCase()) || 
                         n.message.toLowerCase().includes(search.toLowerCase());
    
    return matchesFilter && matchesSearch;
  });

  const getIcon = (type: string) => {
    switch (type) {
      case 'price': return <TrendingUp className="w-4 h-4 text-[#00FFB2]" />;
      case 'news': return <Globe className="w-4 h-4 text-accent-blue" />;
      case 'system': return <Zap className="w-4 h-4 text-yellow-500" />;
      default: return <Bell className="w-4 h-4 text-primary" />;
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-6 max-w-5xl mx-auto"
    >
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4 px-2">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Notification Center</h1>
          <p className="text-muted-foreground mt-1 font-medium">Manage your price alerts, network news, and platform updates.</p>
        </div>
        <div className="flex gap-2">
           <Button variant="outline" size="sm" className="rounded-xl border-white/5 bg-white/5">
            Mark all as read
           </Button>
           <Button variant="outline" size="sm" className="rounded-xl border-white/5 bg-white/5 text-destructive hover:bg-destructive/10">
            Clear All
           </Button>
        </div>
      </div>

      <Card className="glass border-white/5">
        <CardHeader className="border-b border-white/5 pb-4">
          <div className="flex flex-col sm:flex-row gap-4 justify-between items-center">
            <div className="flex bg-muted/30 p-1 rounded-xl w-full sm:w-auto">
              {(['all', 'unread', 'price', 'news'] as const).map((f) => (
                <button
                  key={f}
                  onClick={() => setFilter(f)}
                  className={cn(
                    "flex-1 px-4 py-1.5 rounded-lg text-xs font-bold transition-all capitalize",
                    filter === f ? "bg-primary text-white shadow-lg shadow-primary/20" : "text-muted-foreground hover:text-foreground"
                  )}
                >
                  {f}
                </button>
              ))}
            </div>
            <div className="relative w-full sm:w-64">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input 
                placeholder="Search alerts..." 
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-9 h-9 rounded-xl border-white/5 bg-white/5 focus:bg-white/10 transition-all font-medium"
              />
            </div>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          <ScrollArea className="h-[600px]">
            <div className="divide-y divide-white/5">
              {filteredNotifications.length === 0 ? (
                <div className="p-20 text-center space-y-4">
                   <div className="w-16 h-16 rounded-3xl bg-muted/20 flex items-center justify-center mx-auto">
                      <Bell className="w-8 h-8 text-muted-foreground/50" />
                   </div>
                   <p className="text-muted-foreground font-medium">No results found matching your criteria.</p>
                </div>
              ) : (
                filteredNotifications.map((n) => (
                  <motion.div 
                    layout
                    key={n.id} 
                    className={cn(
                      "p-6 flex gap-4 hover:bg-white/[0.02] transition-colors relative group cursor-pointer",
                      !n.read && "bg-primary/[0.03]"
                    )}
                    onClick={() => markNotificationAsRead(n.id)}
                  >
                    {!n.read && (
                      <div className="absolute left-0 top-0 bottom-0 w-1 bg-primary shadow-[0_0_10px_var(--primary)]" />
                    )}
                    
                    <div className={cn(
                      "w-12 h-12 rounded-2xl flex items-center justify-center shrink-0 shadow-inner",
                      n.type === 'price' ? "bg-[#00FFB2]/10" : 
                      n.type === 'news' ? "bg-accent-blue/10" : "bg-primary/10"
                    )}>
                      {getIcon(n.type)}
                    </div>

                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between mb-1">
                        <div className="flex items-center gap-2">
                           <h4 className={cn("font-bold text-sm", !n.read ? "text-foreground" : "text-muted-foreground")}>{n.title}</h4>
                           {!n.read && <Badge className="h-1.5 w-1.5 p-0 rounded-full bg-primary" />}
                        </div>
                        <span className="text-xs text-muted-foreground font-mono">
                          {new Date(n.time).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                          <span className="hidden sm:inline"> • {new Date(n.time).toLocaleDateString()}</span>
                        </span>
                      </div>
                      <p className={cn(
                        "text-sm leading-relaxed",
                        !n.read ? "text-foreground/80 font-medium" : "text-muted-foreground"
                      )}>
                        {n.message}
                      </p>
                      
                      <div className="mt-4 flex items-center gap-4">
                         <Button variant="link" className="p-0 h-auto text-xs font-bold text-primary group-hover:translate-x-1 transition-transform">
                            View Details <ChevronRight className="w-3 h-3 ml-1" />
                         </Button>
                         <span className="text-[10px] uppercase font-black tracking-widest text-muted-foreground/30">
                            ID: {n.id.toUpperCase()}
                         </span>
                      </div>
                    </div>

                    <div className="opacity-0 group-hover:opacity-100 transition-opacity">
                       <Button variant="ghost" size="icon" className="h-8 w-8 rounded-lg">
                          <MoreVertical className="w-4 h-4 text-muted-foreground" />
                       </Button>
                    </div>
                  </motion.div>
                ))
              )}
            </div>
          </ScrollArea>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
         {[
           { icon: Filter, title: "Smart Filtering", desc: "Our AI prioritizes high-impact market news for your portfolio." },
           { icon: Zap, title: "Real-time Sync", desc: "Notifications are pushed instantly to your mobile secure terminal." },
           { icon: CheckCircle2, title: "Execution Log", desc: "Complete transparency of every trade notification received." }
         ].map((item, i) => (
           <div key={i} className="p-6 rounded-3xl border border-white/5 bg-white/5 space-y-3">
              <div className="w-10 h-10 rounded-xl bg-primary/20 flex items-center justify-center text-primary">
                 <item.icon className="w-5 h-5" />
              </div>
              <h4 className="font-bold">{item.title}</h4>
              <p className="text-xs text-muted-foreground leading-relaxed">{item.desc}</p>
           </div>
         ))}
      </div>
    </motion.div>
  );
};
