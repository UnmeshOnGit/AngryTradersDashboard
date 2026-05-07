
import React, { useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { 
  LayoutDashboard, 
  BarChart3, 
  Wallet, 
  Clock, 
  Settings, 
  LogOut, 
  Menu, 
  X, 
  Sun, 
  Moon,
  Bell,
  GripVertical
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { useApp } from '../context/AppContext';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent
} from '@dnd-kit/core';
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
  useSortable
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';

const SortableWatchlistItem = ({ asset, isCollapsed }: any) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
  } = useSortable({ id: asset.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={cn(
        "flex items-center gap-2 p-2 rounded-lg hover:bg-muted/50 transition-colors group relative",
        isCollapsed ? "justify-center" : "justify-between"
      )}
    >
      <div className="flex items-center gap-2 overflow-hidden">
        <div {...attributes} {...listeners} className="cursor-grab active:cursor-grabbing p-1 opacity-0 group-hover:opacity-100 transition-opacity">
          <GripVertical className="w-3 h-3 text-muted-foreground" />
        </div>
        <div className="w-6 h-6 rounded-md bg-primary/10 flex items-center justify-center text-[10px] font-bold text-primary shrink-0">
          {asset.symbol[0]}
        </div>
        {!isCollapsed && (
          <div className="overflow-hidden">
            <p className="text-xs font-bold truncate">{asset.symbol}</p>
            <p className="text-[10px] text-muted-foreground truncate">${asset.price.toLocaleString()}</p>
          </div>
        )}
      </div>
      {!isCollapsed && (
        <div className={cn("text-[10px] font-bold", asset.change24h >= 0 ? "text-[#00FFB2]" : "text-[#FF4D6D]")}>
          {asset.change24h > 0 ? "+" : ""}{asset.change24h}%
        </div>
      )}
    </div>
  );
};

const SidebarLink = ({ to, icon: Icon, label, collapsed }: any) => (
  <NavLink
    to={to}
    className={({ isActive }) => cn(
      "flex items-center gap-3 px-3 py-2 rounded-xl transition-all duration-300 group relative",
      isActive 
        ? "bg-primary text-primary-foreground shadow-lg shadow-primary/20" 
        : "text-muted-foreground hover:bg-muted font-medium"
    )}
  >
    {({ isActive }) => (
      <>
        <Icon className={cn("w-5 h-5 flex-shrink-0 transition-transform group-hover:scale-110", isActive && "animate-pulse")} />
        {!collapsed && <span className="text-sm tracking-wide">{label}</span>}
        {collapsed && (
          <div className="absolute left-full ml-4 px-2 py-1 bg-popover text-popover-foreground text-xs rounded opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity whitespace-nowrap z-50">
            {label}
          </div>
        )}
      </>
    )}
  </NavLink>
);

const NavItems = [
  { to: '/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
  { to: '/markets', icon: BarChart3, label: 'Markets' },
  { to: '/portfolio', icon: Wallet, label: 'Portfolio' },
  { to: '/orders', icon: Clock, label: 'Orders' },
  { to: '/notifications', icon: Bell, label: 'Notifications' },
  { to: '/settings', icon: Settings, label: 'Settings' },
];

export const MainLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isCollapsed, setIsCollapsed] = React.useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = React.useState(false);
  const [isNotificationsOpen, setIsNotificationsOpen] = React.useState(false);
  const { theme, toggleTheme, logout, user, assets, updateWatchlist, notifications, markNotificationAsRead } = useApp();
  const navigate = useNavigate();

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    if (user && over && active.id !== over.id) {
      const oldIndex = user.watchlist.indexOf(active.id as string);
      const newIndex = user.watchlist.indexOf(over.id as string);
      updateWatchlist(arrayMove(user.watchlist, oldIndex, newIndex));
    }
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const watchlistAssets = (user?.watchlist || []).map(id => assets.find(a => a.id === id)).filter(Boolean);
  const unreadCount = notifications.filter(n => !n.read).length;

  return (
    <div className="flex h-screen bg-background text-foreground overflow-hidden font-sans">
      {/* Notifications Backdrop */}
      {isNotificationsOpen && (
        <div 
          className="fixed inset-0 z-40 bg-transparent" 
          onClick={() => setIsNotificationsOpen(false)} 
        />
      )}
      
      {/* Desktop Sidebar */}
      <motion.aside
        initial={false}
        animate={{ width: isCollapsed ? 80 : 260 }}
        className="hidden md:flex flex-col border-r border-white/5 bg-sidebar relative z-40"
      >
        <div className="p-6 flex items-center justify-between">
          {!isCollapsed && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="flex items-center gap-2 font-black text-2xl tracking-tighter"
            >
              <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-accent-blue to-accent-green flex items-center justify-center text-white shadow-lg shadow-blue-500/20">
                <BarChart3 className="w-6 h-6" />
              </div>
              <span className={cn(theme === 'dark' ? "text-white" : "text-slate-900")}>AngryTraders</span>
            </motion.div>
          )}
          {isCollapsed && (
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-accent-blue to-accent-green flex items-center justify-center text-white mx-auto shadow-lg shadow-blue-500/20">
              <BarChart3 className="w-6 h-6" />
            </div>
          )}
        </div>

        <ScrollArea className="flex-1 px-3">
          <nav className="space-y-1 py-4">
            {NavItems.map((item) => (
              <SidebarLink 
                key={item.to} 
                to={item.to} 
                icon={item.icon} 
                label={item.label} 
                collapsed={isCollapsed} 
              />
            ))}
          </nav>

          <div className="mt-8 space-y-4">
            {!isCollapsed && (
              <p className="px-3 text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground/50">Watchlist</p>
            )}
            <DndContext
              sensors={sensors}
              collisionDetection={closestCenter}
              onDragEnd={handleDragEnd}
            >
              <SortableContext
                items={user?.watchlist || []}
                strategy={verticalListSortingStrategy}
              >
                <div className="space-y-1">
                  {watchlistAssets.map((asset: any) => (
                    <SortableWatchlistItem key={asset.id} asset={asset} isCollapsed={isCollapsed} />
                  ))}
                </div>
              </SortableContext>
            </DndContext>
          </div>
        </ScrollArea>

        <div className="p-4 border-t border-border mt-auto">
          <Button
            variant="ghost"
            className="w-full justify-start gap-3 rounded-xl hover:bg-destructive/10 hover:text-destructive group"
            onClick={handleLogout}
          >
            <LogOut className="w-5 h-5 transition-transform group-hover:-translate-x-1" />
            {!isCollapsed && <span className="text-sm font-medium">Sign Out</span>}
          </Button>
          <div className="mt-4 flex items-center justify-center gap-2">
            {!isCollapsed && <span className="text-xs text-muted-foreground font-mono">v1.2.0</span>}
            <Button variant="ghost" size="icon" onClick={toggleTheme} className="rounded-full">
              {theme === 'dark' ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
            </Button>
          </div>
        </div>
      </motion.aside>

      {/* Main Content Area */}
      <main className="flex-1 flex flex-col min-w-0 relative h-full">
        {/* Top Header (Visible on mobile/tablet) */}
        <header className="md:hidden flex items-center justify-between p-4 border-b border-white/5 bg-sidebar backdrop-blur-md z-[60]">
          <div className="flex items-center gap-2 font-black text-xl tracking-tighter">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-accent-blue to-accent-green flex items-center justify-center text-white shadow-lg shadow-blue-500/20">
              <BarChart3 className="w-5 h-5" />
            </div>
            <span className={cn(theme === 'dark' ? "text-white" : "text-slate-900")}>AngryTraders</span>
          </div>
          <div className="flex items-center gap-2">
             <Button variant="ghost" size="icon" className="relative" onClick={() => setIsNotificationsOpen(!isNotificationsOpen)}>
               <Bell className="w-5 h-5" />
               {unreadCount > 0 && <span className="absolute top-2 right-2 w-2 h-2 bg-primary rounded-full" />}
             </Button>
             <Button variant="ghost" size="icon" onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}>
              {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </Button>
          </div>
        </header>

        {/* Mobile Menu Overlay */}
        <AnimatePresence>
          {isMobileMenuOpen && (
            <>
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[70] md:hidden"
                onClick={() => setIsMobileMenuOpen(false)}
              />
              <motion.div
                initial={{ x: '-100%' }}
                animate={{ x: 0 }}
                exit={{ x: '-100%' }}
                transition={{ type: 'spring', damping: 25, stiffness: 200 }}
                className="fixed top-0 left-0 bottom-0 w-[280px] bg-sidebar z-[80] md:hidden shadow-2xl flex flex-col pt-20"
              >
                <div className="px-6 py-4 space-y-2">
                  {NavItems.map((item) => (
                    <SidebarLink 
                      key={item.to} 
                      to={item.to} 
                      icon={item.icon} 
                      label={item.label} 
                      onClick={() => setIsMobileMenuOpen(false)}
                    />
                  ))}
                </div>
                <div className="mt-8 px-6">
                   <p className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground/50 mb-4 px-3">Watchlist</p>
                   <div className="space-y-1">
                      {watchlistAssets.map((asset: any) => (
                        <div 
                          key={asset.id} 
                          className="flex items-center justify-between p-3 rounded-xl bg-white/5"
                          onClick={() => {
                            navigate(`/markets/${asset.id}`);
                            setIsMobileMenuOpen(false);
                          }}
                        >
                          <div className="flex items-center gap-3">
                            <div className="text-xs font-bold">{asset.symbol}</div>
                          </div>
                          <div className={cn("text-xs font-bold", asset.change24h >= 0 ? "text-[#00FFB2]" : "text-[#FF4D6D]")}>
                            {asset.change24h}%
                          </div>
                        </div>
                      ))}
                   </div>
                </div>
                <div className="mt-auto p-6 border-t border-white/5">
                   <Button variant="ghost" className="w-full justify-start gap-4 text-destructive" onClick={handleLogout}>
                      <LogOut className="w-5 h-5" /> Sign Out
                   </Button>
                </div>
              </motion.div>
            </>
          )}
        </AnimatePresence>

        {/* Global Market Ticker (Desktop only) */}
        <div className="hidden md:flex h-12 border-b border-white/5 bg-sidebar/50 items-center justify-between px-6 relative backdrop-blur-sm transition-all z-[60]">
           <div className="flex-1 overflow-hidden h-full flex items-center">
             <div className="flex animate-marquee whitespace-nowrap">
              {[...Array(5)].map((_, i) => (
                <span key={i} className="mx-6 text-[11px] font-mono text-[#94A3B8] uppercase flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#00FFB2] shadow-[0_0_8px_#00FFB2]" />
                  BTC/USD 64,520.40 <span className="text-[#00FFB2]">+1.24%</span>
                  <span className="w-1.5 h-1.5 rounded-full bg-[#FF4D6D] shadow-[0_0_8px_#FF4D6D] ml-2" />
                  ETH/USD 3,420.10 <span className="text-[#FF4D6D]">-0.42%</span>
                  <span className="w-1.5 h-1.5 rounded-full bg-accent-blue shadow-[0_0_8px_#3B82F6] ml-2" />
                  SOL/USD 142.50 <span className="text-accent-blue">+4.12%</span>
                </span>
              ))}
            </div>
           </div>

           <div className="flex items-center gap-4 pl-4 border-l border-white/5 ml-4">
              <div className="relative">
                <Button 
                  variant="ghost" 
                  size="icon" 
                  className="rounded-full h-8 w-8 hover:bg-white/5 relative"
                  onClick={() => setIsNotificationsOpen(!isNotificationsOpen)}
                >
                  <Bell className="w-4 h-4 text-muted-foreground" />
                  {unreadCount > 0 && (
                    <span className="absolute top-1 right-1 w-2 h-2 bg-primary rounded-full animate-pulse shadow-[0_0_8px_var(--primary)]" />
                  )}
                </Button>

                <AnimatePresence>
                  {isNotificationsOpen && (
                    <motion.div
                      initial={{ opacity: 0, y: 10, scale: 0.95 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: 10, scale: 0.95 }}
                      className="absolute right-0 mt-2 w-80 bg-popover border border-white/10 rounded-2xl shadow-2xl z-[100] overflow-hidden"
                    >
                      <div className="p-4 border-b border-white/5 flex justify-between items-center bg-muted/30">
                        <h3 className="font-bold text-sm">Notifications</h3>
                        <Badge variant="outline" className="text-[10px]">{unreadCount} New</Badge>
                      </div>
                      <ScrollArea className="max-h-[400px]">
                        <div className="p-2 space-y-1">
                          {notifications.length === 0 ? (
                            <div className="p-8 text-center text-muted-foreground text-xs italic">
                              No notifications yet
                            </div>
                          ) : (
                            notifications.map((n) => (
                              <div 
                                key={n.id} 
                                className={cn(
                                  "p-3 rounded-xl transition-colors cursor-pointer",
                                  n.read ? "opacity-60 bg-transparent" : "bg-primary/5 hover:bg-primary/10"
                                )}
                                onClick={(e) => {
                                  e.stopPropagation();
                                  markNotificationAsRead(n.id);
                                  navigate('/notifications');
                                  setIsNotificationsOpen(false);
                                }}
                              >
                                <div className="flex justify-between items-start mb-1">
                                  <p className="text-xs font-bold truncate">{n.title}</p>
                                  <span className="text-[10px] text-muted-foreground">{new Date(n.time).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                                </div>
                                <p className="text-[11px] text-muted-foreground line-clamp-2">{n.message}</p>
                              </div>
                            ))
                          )}
                        </div>
                      </ScrollArea>
                      <div className="p-3 bg-muted/30 border-t border-white/5">
                        <Button 
                          variant="ghost" 
                          size="sm" 
                          className="w-full text-xs font-bold text-primary rounded-lg"
                          onClick={() => {
                            navigate('/notifications');
                            setIsNotificationsOpen(false);
                          }}
                        >
                          View All Notifications
                        </Button>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
              
              <div className="flex items-center gap-2">
                <div className="w-6 h-6 rounded-full bg-gradient-to-tr from-primary to-accent-blue flex items-center justify-center text-[10px] font-bold">
                  {user?.name?.[0].toUpperCase()}
                </div>
                {!isCollapsed && <span className="text-xs font-bold truncate max-w-[80px]">{user?.name}</span>}
              </div>
           </div>
        </div>

        <ScrollArea className="flex-1 overflow-x-hidden">
          <div className="max-w-[1600px] mx-auto p-4 md:p-8 pb-24 md:pb-8">
            {children}
          </div>
        </ScrollArea>

        {/* Mobile Bottom Nav */}
        <nav className="md:hidden fixed bottom-6 left-4 right-4 h-16 bg-card/80 backdrop-blur-2xl border border-border/50 rounded-2xl flex items-center justify-around px-4 shadow-2xl shadow-black/20 z-50">
          {NavItems.map((item) => {
            const Icon = item.icon;
            return (
              <NavLink
                key={item.to}
                to={item.to}
                className={({ isActive }) => cn(
                  "p-2 rounded-xl transition-all duration-300",
                  isActive ? "text-primary scale-125 bg-primary/10" : "text-muted-foreground"
                )}
              >
                <Icon className="w-6 h-6" />
              </NavLink>
            );
          })}
        </nav>
      </main>

      {/* Background Polish */}
      <div className="fixed inset-0 pointer-events-none z-[-1] overflow-hidden">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-primary/10 rounded-full blur-[120px] animate-pulse" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-blue-500/10 rounded-full blur-[120px] animate-pulse" style={{ animationDelay: '2s' }} />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full opacity-[0.03] pointer-events-none bg-[radial-gradient(#888_1px,transparent_1px)] [background-size:20px_20px]" />
      </div>
    </div>
  );
};
