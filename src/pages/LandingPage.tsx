import React, { useMemo } from 'react';
import { motion } from 'motion/react';
import { useNavigate } from 'react-router-dom';
import { 
  BarChart3, 
  ShieldCheck, 
  Zap, 
  Globe, 
  ArrowRight, 
  TrendingUp, 
  TrendingDown,
  Cpu, 
  Layers,
  Lock,
  Sun,
  Moon,
  LineChart,
  ArrowUpRight
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useApp } from '../context/AppContext';
import { cn } from '@/lib/utils';
import { ResponsiveContainer, AreaChart, Area } from 'recharts';

const FeatureCard = ({ icon: Icon, title, description, delay }: any) => {
  const { theme } = useApp();
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ delay, duration: 0.5 }}
      whileHover={{ scale: 1.05 }}
      viewport={{ once: true }}
      className={cn(
        "p-8 rounded-3xl border transition-all group backdrop-blur-sm hover-glow",
        theme === 'dark' 
          ? "bg-card/40 border-white/5 hover:border-primary/30" 
          : "bg-white/60 border-slate-200 hover:border-primary/30 shadow-sm shadow-slate-100"
      )}
    >
      <div className="w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center text-primary mb-6 group-hover:scale-110 transition-transform">
        <Icon className="w-6 h-6" />
      </div>
      <h3 className={cn("text-xl font-bold mb-3", theme === 'dark' ? "text-white" : "text-slate-900")}>{title}</h3>
      <p className={cn("text-sm leading-relaxed", theme === 'dark' ? "text-[#94A3B8]" : "text-slate-500")}>{description}</p>
    </motion.div>
  );
};

const DashboardPreview = () => {
  const { theme } = useApp();
  const mockData = useMemo(() => Array.from({ length: 20 }, (_, i) => ({ value: 40 + Math.random() * 20 + Math.sin(i * 0.5) * 10 })), []);
  const isDark = theme === 'dark';

  return (
    <div className={cn(
      "w-full h-full flex flex-col p-4 md:p-6",
      isDark ? "text-white/80" : "text-slate-800"
    )}>
      {/* Top Header Mock */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-4">
          <div className={cn("w-8 h-8 rounded-lg animate-pulse", isDark ? "bg-white/10" : "bg-slate-200")} />
          <div className={cn("h-4 w-24 rounded animate-pulse", isDark ? "bg-white/5" : "bg-slate-100")} />
        </div>
        <div className="flex gap-2">
          <div className={cn("w-16 sm:w-20 h-8 rounded-lg border", isDark ? "bg-white/5 border-white/10" : "bg-slate-50 border-slate-200")} />
          <div className={cn("w-16 sm:w-20 h-8 rounded-lg", isDark ? "bg-primary/20" : "bg-primary/10")} />
        </div>
      </div>

      <div className="grid grid-cols-12 gap-4 h-full min-h-0">
        {/* Main Chart Area */}
        <div className="col-span-12 lg:col-span-8 flex flex-col gap-4 h-full">
          <div className={cn(
            "flex-1 rounded-2xl border p-4 relative overflow-hidden",
            isDark ? "bg-white/5 border-white/5" : "bg-slate-50/50 border-slate-100"
          )}>
             <div className="absolute top-4 left-4 z-10">
               <p className={cn("text-[10px] uppercase font-mono tracking-widest", isDark ? "text-muted-foreground" : "text-slate-400")}>Main Asset Index</p>
               <h4 className="text-xl sm:text-2xl font-bold font-mono tracking-tighter">$65,420.40</h4>
               <span className="text-xs text-[#00FFB2] font-bold">+4.12%</span>
             </div>
             <div className="h-full w-full opacity-60">
               <ResponsiveContainer width="100%" height="100%" debounce={1}>
                  <AreaChart data={mockData}>
                    <defs>
                      <linearGradient id="prevGradient" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#3B82F6" stopOpacity={0.3}/>
                        <stop offset="95%" stopColor="#3B82F6" stopOpacity={0}/>
                      </linearGradient>
                    </defs>
                    <Area 
                      type="monotone" 
                      dataKey="value" 
                      stroke="#3B82F6" 
                      fill="url(#prevGradient)" 
                      strokeWidth={2}
                      animationDuration={3000}
                    />
                  </AreaChart>
               </ResponsiveContainer>
             </div>
          </div>
          <div className={cn("h-16 sm:h-20 grid grid-cols-3 gap-4", isDark ? "opacity-100" : "opacity-70")}>
            {[1, 2, 3].map(i => (
              <div key={i} className={cn("rounded-xl border p-3 flex flex-col justify-between", isDark ? "bg-white/5 border-white/5" : "bg-white border-slate-100 shadow-sm")}>
                <div className={cn("h-2 w-10 sm:w-12 rounded", isDark ? "bg-white/10" : "bg-slate-100")} />
                <div className={cn("h-3 sm:h-4 w-12 sm:w-16 rounded", isDark ? "bg-primary/20" : "bg-primary/5")} />
              </div>
            ))}
          </div>
        </div>

        {/* Sidebar Mock - Hidden on small screens */}
        <div className="hidden lg:col-span-4 lg:flex flex-col gap-4">
          <div className={cn("flex-1 rounded-2xl border p-4 space-y-4", isDark ? "bg-white/5 border-white/5" : "bg-white border-slate-100 shadow-sm")}>
             <div className={cn("flex justify-between items-center pb-2 border-b", isDark ? "border-white/5" : "border-slate-50")}>
                <span className={cn("text-[10px] font-black uppercase tracking-widest", isDark ? "text-[#94A3B8]" : "text-slate-400")}>Security Sync</span>
                <ShieldCheck className="w-3 h-3 text-primary" />
             </div>
             {[1, 2, 3, 4, 5].map(i => (
               <motion.div 
                key={i} 
                initial={{ x: 20, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ delay: 0.8 + i * 0.1 }}
                className={cn("flex items-center justify-between p-2 rounded-lg", isDark ? "bg-white/5" : "bg-slate-50")}
               >
                 <div className={cn("w-6 h-6 rounded-md", isDark ? "bg-white/10" : "bg-slate-200")} />
                 <div className={cn("h-2 w-12 rounded", isDark ? "bg-white/10" : "bg-slate-100")} />
                 <div className="h-2 w-8 bg-[#00FFB2]/20 rounded" />
               </motion.div>
             ))}
          </div>
          <div className={cn("h-24 sm:h-32 rounded-2xl border p-4 flex flex-col justify-center items-center text-center", isDark ? "bg-primary/10 border-primary/20" : "bg-primary/5 border-primary/10")}>
             <Zap className={cn("w-6 h-6 mb-2 animate-pulse", isDark ? "text-primary" : "text-primary")} />
             <p className={cn("text-[10px] font-black uppercase tracking-tighter text-primary")}>Engine Running</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export const LandingPage = () => {
  const navigate = useNavigate();
  const { user, theme, toggleTheme, assets } = useApp();

  const isDark = theme === 'dark';

  return (
    <div className={cn(
      "min-h-screen selection:bg-primary/30 transition-colors duration-500 overflow-x-hidden",
      isDark ? "bg-[#0B0F19] text-white selection:text-white" : "bg-white text-slate-800 selection:text-white"
    )}>
      {/* Navigation */}
      <nav className={cn(
        "fixed top-0 left-0 right-0 z-[100] h-20 border-b backdrop-blur-xl transition-all duration-500",
        isDark ? "bg-[#0B0F19]/80 border-white/5" : "bg-white/80 border-slate-100"
      )}>
        <div className="max-w-7xl mx-auto h-full px-6 flex items-center justify-between">
          <div className="flex items-center gap-2 font-black text-2xl tracking-tighter cursor-pointer" onClick={() => navigate('/')}>
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-accent-blue to-accent-green flex items-center justify-center text-white shadow-lg shadow-blue-500/20">
              <BarChart3 className="w-6 h-6" />
            </div>
            <span className={cn("transition-colors", isDark ? "text-white" : "text-slate-900")}>AngryTraders</span>
          </div>

          <div className={cn(
            "hidden lg:flex items-center gap-8 text-sm font-bold transition-colors",
            isDark ? "text-[#94A3B8]" : "text-slate-400"
          )}>
            <a href="#features" className="hover:text-primary transition-colors">Features</a>
            <a href="#markets" className="hover:text-primary transition-colors">Markets</a>
            <a href="#security" className="hover:text-primary transition-colors">Security</a>
          </div>

          <div className="flex items-center gap-3 sm:gap-4">
            <Button 
              variant="ghost" 
              size="icon" 
              onClick={toggleTheme} 
              className={cn("rounded-xl h-10 w-10 transition-colors", isDark ? "hover:bg-white/5 text-[#94A3B8]" : "hover:bg-slate-100 text-slate-400")}
            >
              {isDark ? <Sun className="w-5 h-5 shadow-inner" /> : <Moon className="w-5 h-5" />}
            </Button>
            
            {user ? (
              <Button 
                onClick={() => navigate('/dashboard')}
                className="bg-primary hover:bg-primary/90 text-white rounded-xl px-5 sm:px-6 font-black h-11 transition-all hover:scale-[1.02]"
              >
                Terminal
              </Button>
            ) : (
              <>
                <Button 
                  variant="ghost" 
                  onClick={() => navigate('/login')}
                  className={cn("hidden sm:flex rounded-xl font-black h-11 px-6", isDark ? "text-[#94A3B8] hover:text-white" : "text-slate-400 hover:text-slate-900")}
                >
                  Sign In
                </Button>
                <Button 
                  onClick={() => navigate('/login')}
                  className="bg-primary hover:bg-primary/90 text-white rounded-xl px-5 sm:px-8 font-black h-11 shadow-xl shadow-primary/20 transition-all hover:scale-[1.02]"
                >
                  Sign Up
                </Button>
              </>
            )}
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative pt-40 pb-16 px-6">
        {/* Background Effects */}
        <div className={cn(
          "absolute top-1/4 left-1/2 -translate-x-1/2 w-full max-w-4xl h-[600px] blur-[120px] rounded-full pointer-events-none opacity-40 transition-all duration-1000",
          isDark ? "bg-primary/30" : "bg-primary/15"
        )} />
        <div className={cn(
          "absolute top-0 left-0 w-full h-full pointer-events-none opacity-[0.2] transition-opacity duration-500",
          isDark ? "bg-[radial-gradient(#ffffff15_1px,transparent_1px)]" : "bg-[radial-gradient(#00000010_1px,transparent_1px)]",
          "[background-size:40px_40px]"
        )} />

        <div className="max-w-7xl mx-auto text-center relative z-10">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
            className={cn(
              "inline-flex items-center gap-2.5 px-6 py-2.5 rounded-full border text-xs font-black tracking-[0.25em] mb-12 uppercase"
            )}
            style={{
              background: isDark ? 'rgba(255,255,255,0.03)' : 'rgba(59, 130, 246, 0.05)',
              borderColor: isDark ? 'rgba(255,255,255,0.08)' : 'rgba(59, 130, 246, 0.15)',
              color: isDark ? '#00FFB2' : '#2563EB'
            }}
          >
            <Zap className="w-3.5 h-3.5 animate-pulse" /> THE QUANTUM TRADING ERA
          </motion.div>
          
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.8 }}
            className={cn(
              "text-5xl md:text-[6.5rem] font-black tracking-tighter mb-10 leading-[0.85] transition-colors",
              isDark ? "text-white" : "text-slate-900"
            )}
          >
            Institutional Power.<br />
            <span className="bg-gradient-to-r from-primary via-accent-green to-accent-blue bg-clip-text text-transparent">Retail Accessibility.</span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.8 }}
            className={cn(
              "max-w-2xl mx-auto text-lg md:text-2xl mb-16 leading-relaxed transition-colors font-medium",
              isDark ? "text-[#94A3B8]" : "text-slate-500"
            )}
          >
            Experience lightning-fast execution, advanced analytics, and deep liquidity pools. The definitively premium OS for modern finance.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.8 }}
            className="flex flex-col sm:flex-row items-center justify-center gap-5"
          >
            <Button 
              size="lg"
              onClick={() => navigate('/login')}
              className="w-full sm:w-auto h-20 rounded-3xl px-16 bg-primary hover:bg-primary/90 text-white font-black text-2xl shadow-2xl shadow-primary/40 group transition-all hover:scale-[1.03] active:scale-[0.98]"
            >
              Enter Terminal
              <ArrowRight className="ml-2 w-7 h-7 transition-transform group-hover:translate-x-2" />
            </Button>
          </motion.div>
        </div>
      </section>

      {/* Real-time Market Rate Slide (Marquee) */}
      <div className={cn(
        "relative py-8 border-y overflow-hidden whitespace-nowrap z-20 backdrop-blur-md transition-colors",
        isDark ? "bg-[#0B0F19]/50 border-white/5" : "bg-slate-50 border-slate-100 shadow-sm"
      )}>
        <div className="flex animate-marquee cursor-pointer">
          {[...Array(4)].map((_, groupIndex) => (
            <div key={groupIndex} className="flex gap-16 px-8">
              {assets.map((asset) => (
                <div 
                  key={`${groupIndex}-${asset.id}`} 
                  className={cn(
                    "flex items-center gap-4 transition-opacity",
                    isDark ? "opacity-100" : "opacity-80"
                  )}
                >
                   <div className={cn(
                    "w-10 h-10 rounded-xl flex items-center justify-center font-black text-xs shadow-inner",
                    isDark ? "bg-white/5 text-white" : "bg-white text-slate-900 border border-slate-100"
                   )}>
                    {asset.symbol}
                   </div>
                   <div className="flex flex-col">
                      <span className={cn("text-[10px] font-black uppercase tracking-[0.2em]", isDark ? "text-white/40" : "text-slate-400")}>{asset.name}</span>
                      <div className="flex items-center gap-3">
                        <span className={cn("font-mono font-black text-lg tracking-tighter", isDark ? "text-white" : "text-slate-800")}>${asset.price.toLocaleString(undefined, { minimumFractionDigits: 2 })}</span>
                        <span className={cn("text-xs font-black flex items-center", asset.change24h >= 0 ? "text-[#00FFB2]" : "text-[#FF4D6D]")}>
                          {asset.change24h >= 0 ? <TrendingUp className="w-3 h-3 mr-1" /> : <TrendingDown className="w-3 h-3 mr-1" />}
                          {Math.abs(asset.change24h)}%
                        </span>
                      </div>
                   </div>
                </div>
              ))}
            </div>
          ))}
        </div>
      </div>

      {/* Animated Dashboard Preview Section */}
      <section className="py-24 px-6 overflow-hidden">
        <div className="max-w-6xl mx-auto">
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 50 }}
            whileInView={{ opacity: 1, scale: 1, y: 0 }}
            transition={{ duration: 1.2, ease: "circOut" }}
            viewport={{ once: true }}
            className="relative group"
          >
            {/* Glow effect */}
            <div className="absolute -inset-2 sm:-inset-4 bg-gradient-to-tr from-primary via-[#00FFB2] to-accent-blue rounded-[52px] blur-3xl opacity-15 group-hover:opacity-25 transition duration-1000" />
            
            <div className={cn(
              "relative rounded-[40px] sm:rounded-[48px] border overflow-hidden aspect-[16/10] shadow-[0_40px_100px_-20px_rgba(0,0,0,0.5)] transition-all",
              isDark ? "bg-[#121826]/90 border-white/10" : "bg-white border-slate-200"
            )}>
              {/* Fake OS header */}
              <div className={cn(
                "h-14 sm:h-16 border-b flex items-center px-6 sm:px-8 gap-4 sm:gap-6",
                isDark ? "border-white/5 bg-[#1A2235]/40" : "border-slate-50 bg-slate-50/50"
              )}>
                <div className="flex gap-2.5">
                  <div className="w-3 h-3 rounded-full bg-red-400/40" />
                  <div className="w-3 h-3 rounded-full bg-yellow-400/40" />
                  <div className="w-3 h-3 rounded-full bg-green-400/40" />
                </div>
                <div className={cn(
                  "hidden sm:block mx-auto text-[10px] font-black uppercase tracking-[0.4em] font-mono",
                  isDark ? "text-white/20" : "text-slate-300"
                )}>
                  AngryTraders Terminal | Session: Mainnet Alpha | Sync: 100%
                </div>
                <div className="flex items-center gap-3">
                  <div className={cn("hidden sm:flex h-2 w-12 rounded-full", isDark ? "bg-white/5" : "bg-slate-100")} />
                  <div className={cn("h-8 w-8 rounded-full", isDark ? "bg-primary/20" : "bg-primary/10")} />
                </div>
              </div>
              
              {/* Inner Mockup UI */}
              <DashboardPreview />
            </div>

            {/* Floating UI Elements */}
            <motion.div 
              animate={{ y: [0, -15, 0], x: [0, 5, 0] }}
              transition={{ repeat: Infinity, duration: 6, ease: "easeInOut" }}
              className={cn(
                "absolute -right-6 top-1/4 p-5 rounded-3xl shadow-2xl z-40 hidden lg:block border transition-all",
                isDark ? "glass border-white/10" : "bg-white border-slate-100 shadow-slate-200/50"
              )}
            >
              <div className="flex items-center gap-4">
                 <div className="w-12 h-12 rounded-2xl bg-[#00FFB2]/10 flex items-center justify-center text-[#00FFB2]">
                    <TrendingUp className="w-7 h-7" />
                 </div>
                 <div>
                    <p className={cn("text-[9px] uppercase font-mono font-black", isDark ? "text-white/30" : "text-slate-400")}>Latest Execution</p>
                    <p className={cn("text-base font-black tracking-tight", isDark ? "text-white" : "text-slate-900")}>+4.82 ETH</p>
                 </div>
              </div>
            </motion.div>

            <motion.div 
              animate={{ y: [0, 15, 0], x: [0, -5, 0] }}
              transition={{ repeat: Infinity, duration: 7, ease: "easeInOut", delay: 1 }}
              className={cn(
                "absolute -left-10 bottom-1/3 p-5 rounded-3xl shadow-2xl z-40 hidden lg:block border transition-all",
                isDark ? "glass border-white/10" : "bg-white border-slate-100 shadow-slate-200/50"
              )}
            >
              <div className="flex items-center gap-4">
                 <div className="w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center text-primary">
                    <ShieldCheck className="w-7 h-7" />
                 </div>
                 <div>
                    <p className={cn("text-[9px] uppercase font-mono font-black", isDark ? "text-white/30" : "text-slate-400")}>Security Status</p>
                    <p className={cn("text-base font-black text-[#00FFB2]")}>ENCRYPTED</p>
                 </div>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Stats Section */}
      <section className={cn(
        "py-24 border-y transition-all duration-500",
        isDark ? "bg-white/[0.01] border-white/5" : "bg-slate-50/50 border-slate-50 shadow-inner"
      )}>
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-12 lg:gap-8 text-center">
            {[
              { label: 'Weekly Volume', value: '$8.4B+' },
              { label: 'Institutional Desk', value: '850+' },
              { label: 'Engine Latency', value: '< 2ms' },
              { label: 'Asset Protection', value: '$2.1B' },
            ].map((stat, i) => (
              <div key={i} className="group">
                <h4 className={cn(
                  "text-4xl md:text-[4.5rem] font-black tracking-tighter mb-4 transition-all group-hover:scale-105",
                  isDark ? "text-white" : "text-slate-900"
                )}>{stat.value}</h4>
                <p className={cn(
                  "text-[10px] sm:text-[11px] uppercase tracking-[0.3em] font-black",
                  isDark ? "text-[#00FFB2]" : "text-primary"
                )}>{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section id="features" className="py-40 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-28">
            <h2 className={cn(
              "text-5xl md:text-8xl font-black tracking-tighter mb-8 leading-[0.9]",
              isDark ? "text-white" : "text-slate-900"
            )}>Elite Infrastructure.</h2>
            <p className={cn(
              "text-lg sm:text-2xl max-w-3xl mx-auto leading-relaxed font-medium transition-colors",
              isDark ? "text-[#94A3B8]" : "text-slate-500"
            )}>
              We didn&apos;t just build an app. We built the definitive operating system for professional finance.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <FeatureCard 
              icon={LineChart}
              title="L3 Liquid Feeds"
              description="Direct exchange order-book access. Observe every significant move before the standard market knows what hit them."
              delay={0.1}
            />
            <FeatureCard 
              icon={ShieldCheck}
              title="Identity Isolation"
              description="Biometric login, cold-storage vaults, and multi-sig authorization flows. Your digital wealth has never been protected by a layer this dense."
              delay={0.2}
            />
            <FeatureCard 
              icon={Cpu}
              title="Quantum Abstraction"
              description="A refined technical core ensures the terminal never lags. Execute complex strategies across multiple pools with millisecond precision."
              delay={0.3}
            />
          </div>
        </div>
      </section>

      {/* Institutional CTA */}
      <section className="py-40 px-6 relative overflow-hidden">
        <div className={cn(
          "absolute inset-0 -skew-y-3 origin-center opacity-[0.4] transition-all",
          isDark ? "bg-primary/10" : "bg-primary/5"
        )} />
        <div className="max-w-5xl mx-auto relative z-10">
          <div className={cn(
            "p-12 md:p-32 rounded-[60px] sm:rounded-[80px] border text-center flex flex-col items-center transition-all",
            isDark ? "glass border-white/10" : "bg-white border-slate-100 shadow-3xl shadow-slate-200/50"
          )}>
            <motion.div 
              whileHover={{ rotate: 12, scale: 1.1 }}
              className="w-24 h-24 rounded-[32px] bg-primary flex items-center justify-center text-white mb-12 shadow-2xl shadow-primary/30"
            >
               <Lock className="w-12 h-12" />
            </motion.div>
            <h2 className={cn(
              "text-5xl md:text-[6rem] font-black tracking-tighter mb-10 leading-[0.85]",
              isDark ? "text-white" : "text-slate-900"
            )}>Ready to<br />Evolve?</h2>
            <p className={cn(
              "text-lg sm:text-2xl max-w-xl mb-16 leading-relaxed transition-colors font-medium",
              isDark ? "text-[#94A3B8]" : "text-slate-500"
            )}>
              Professional trading isn&apos;t just about strategy. It&apos;s about the tools you use to execute it. Join AngryTraders today.
            </p>
            <Button 
               size="lg"
               onClick={() => navigate('/login')}
               className="h-24 rounded-[36px] px-20 bg-primary hover:bg-primary/90 text-white font-black text-3xl shadow-3xl shadow-primary/40 transition-all hover:scale-[1.05] active:scale-[0.98]"
            >
              Sign Up Now
            </Button>
            <p className={cn("mt-12 text-xs uppercase tracking-[0.4em] font-black", isDark ? "text-white/20" : "text-slate-300")}>Secure Global Access Priority</p>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className={cn(
        "py-32 border-t transition-colors",
        isDark ? "bg-[#0B0F19] border-white/5" : "bg-slate-50 border-slate-100"
      )}>
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-20 mb-32">
            <div className="col-span-1 md:col-span-1 flex flex-col gap-10">
              <div className="flex items-center gap-2 font-black text-4xl tracking-tighter">
                <div className="w-12 h-12 rounded-xl bg-primary flex items-center justify-center text-white">
                  <BarChart3 className="w-7 h-7" />
                </div>
                <span className={isDark ? "text-white" : "text-slate-900"}>AngryTraders</span>
              </div>
              <p className={cn("text-base leading-relaxed transition-colors font-medium", isDark ? "text-[#94A3B8]" : "text-slate-500")}>
                The definitively premium digital asset operating system. Built for speed, safety, and sophisticated market execution on a global scale.
              </p>
              <div className="flex gap-8">
                 <Globe className="w-6 h-6 text-[#94A3B8] hover:text-primary cursor-pointer transition-colors" />
                 <div className="w-6 h-6 text-[#94A3B8] hover:text-primary cursor-pointer transition-colors">
                    <svg fill="currentColor" viewBox="0 0 24 24"><path d="M24 4.557c-.883.392-1.832.656-2.828.775 1.017-.609 1.798-1.574 2.165-2.724-.951.564-2.005.974-3.127 1.195-.897-.957-2.178-1.555-3.594-1.555-3.179 0-5.515 2.966-4.797 6.045-4.091-.205-7.719-2.165-10.148-5.144-1.29 2.213-.669 5.108 1.523 6.574-.806-.026-1.566-.247-2.229-.616-.054 2.281 1.581 4.415 3.949 4.89-.693.188-1.452.232-2.224.084.626 1.956 2.444 3.379 4.6 3.419-2.07 1.623-4.678 2.348-7.29 2.04 2.179 1.397 4.768 2.212 7.548 2.212 9.142 0 14.307-7.721 13.995-14.646.962-.695 1.797-1.562 2.457-2.549z"/></svg>
                 </div>
              </div>
            </div>
            
            {[
              { 
                title: 'Infrastructure', 
                links: ['Quantum Terminals', 'Execution Engines', 'API Reference', 'Fees & Limits'] 
              },
              { 
                title: 'Organization', 
                links: ['Intelligence Desk', 'Security Center', 'Cloud Status', 'Protocol Terms'] 
              }
            ].map((col, idx) => (
              <div key={idx}>
                <h5 className="font-black mb-10 uppercase text-xs tracking-[0.4em] text-primary">{col.title}</h5>
                <ul className={cn("space-y-6 text-base font-bold", isDark ? "text-[#94A3B8]" : "text-slate-400")}>
                  {col.links.map(link => (
                    <li key={link}><a href="#" className="hover:text-primary transition-all hover:translate-x-1 inline-block">{link}</a></li>
                  ))}
                </ul>
              </div>
            ))}

            <div>
              <h5 className="font-black mb-10 uppercase text-xs tracking-[0.4em] text-primary">Intelligence</h5>
              <p className={cn("text-sm mb-8 font-bold", isDark ? "text-[#94A3B8]" : "text-slate-400")}>Request our monthly outlook from the institutional desk.</p>
              <div className="flex flex-col gap-4">
                <input 
                  type="email" 
                  placeholder="name@organization.com" 
                  className={cn(
                    "border-2 rounded-2xl px-6 py-4 text-base font-bold focus:outline-none focus:border-primary transition-all",
                    isDark ? "bg-white/5 border-white/5 text-white" : "bg-white border-slate-100 text-slate-900"
                  )}
                />
                <Button className="rounded-2xl bg-primary hover:bg-primary/90 text-white font-black h-16 text-lg">
                   Subscribe
                </Button>
              </div>
            </div>
          </div>
          <div className="flex flex-col md:flex-row justify-between items-center pt-16 border-t border-white/5 gap-10">
            <p className={cn("text-[10px] sm:text-xs uppercase tracking-[0.4em] font-black", isDark ? "text-white/20" : "text-slate-300")}>© 2026 ANGRYTRADERS GLOBAL QUANTUM SYSTEMS. ALL RIGHTS RESERVED SEAMLESSLY.</p>
            <div className={cn("flex items-center gap-2 text-[10px] font-black uppercase tracking-widest", isDark ? "text-white/40" : "text-slate-400")}>
               <ShieldCheck className="w-4 h-4 text-[#00FFB2]" /> Secure Terminal v2.4.0
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

function Badge({ children, className }: { children: React.ReactNode, className?: string }) {
  return (
    <span className={cn("px-2.5 py-1 rounded-lg text-[9px] font-black tracking-[0.2em] border", className)}>
      {children}
    </span>
  );
}
