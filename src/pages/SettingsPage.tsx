
import React from 'react';
import { motion } from 'motion/react';
import { useApp } from '../context/AppContext';
import { 
  User, 
  Bell, 
  Shield, 
  Palette, 
  Globe, 
  LineChart, 
  Smartphone,
  ChevronRight,
  Monitor,
  Moon,
  Sun,
  Eye,
  Key,
  CreditCard
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { cn } from '@/lib/utils';

const SettingItem = ({ icon: Icon, title, description, children }: any) => (
  <div className="flex items-center justify-between py-6 border-b border-white/5 last:border-0 group">
    <div className="flex items-start gap-4">
      <div className="min-w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center text-muted-foreground group-hover:bg-primary group-hover:text-primary-foreground transition-all duration-300">
        <Icon className="w-5 h-5 transition-transform group-hover:scale-110" />
      </div>
      <div>
        <h4 className="font-bold text-sm">{title}</h4>
        <p className="text-xs text-muted-foreground max-w-xs">{description}</p>
      </div>
    </div>
    <div className="ml-4">
      {children}
    </div>
  </div>
);

export const SettingsPage = () => {
  const { 
    user, 
    theme, 
    toggleTheme, 
    updateProfile, 
    language, 
    currency, 
    setLanguage, 
    setCurrency,
    t 
  } = useApp();
  const [isEditing, setIsEditing] = React.useState(false);
  const [formData, setFormData] = React.useState({
    name: user?.name || '',
    email: user?.email || ''
  });

  const handleSave = () => {
    updateProfile(formData);
    setIsEditing(false);
  };

  const languages = [
    { code: 'en', name: 'English', flag: '🇺🇸' },
    { code: 'hi', name: 'हिन्दी (Hindi)', flag: '🇮🇳' },
    { code: 'es', name: 'Español', flag: '🇪🇸' },
    { code: 'fr', name: 'Français', flag: '🇫🇷' },
  ];

  const currencies = [
    { code: 'USD', name: 'US Dollar', symbol: '$' },
    { code: 'INR', name: 'Indian Rupee', symbol: '₹' },
    { code: 'EUR', name: 'Euro', symbol: '€' },
    { code: 'GBP', name: 'British Pound', symbol: '£' },
  ];

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.98 }}
      animate={{ opacity: 1, scale: 1 }}
      className="space-y-8 max-w-5xl mx-auto"
    >
      <div>
        <h1 className="text-3xl font-bold tracking-tight">{t('settings')}</h1>
        <p className="text-muted-foreground mt-1">Manage your terminal configuration and personal preferences.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="space-y-6">
          <Card className="glass border-white/5 overflow-hidden">
             <div className="h-24 bg-gradient-to-r from-primary/30 to-blue-500/30" />
             <CardContent className="pt-0 -mt-12 text-center pb-8">
                <div className="w-24 h-24 rounded-full border-4 border-background bg-card mx-auto flex items-center justify-center overflow-hidden shadow-2xl relative group cursor-pointer">
                  <div className="text-4xl font-bold text-primary">{user?.name?.[0].toUpperCase()}</div>
                  <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity">
                     <Monitor className="w-6 h-6 text-white" />
                  </div>
                </div>
                {isEditing ? (
                  <div className="mt-4 space-y-3 px-4">
                    <Input 
                      value={formData.name} 
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      placeholder="Name"
                      className="text-center h-10 rounded-lg"
                    />
                    <Input 
                      value={formData.email} 
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      placeholder="Email"
                      className="text-center h-10 rounded-lg"
                    />
                    <div className="flex gap-2">
                       <Button size="sm" className="flex-1 rounded-lg" onClick={handleSave}>Save</Button>
                       <Button size="sm" variant="outline" className="flex-1 rounded-lg" onClick={() => setIsEditing(false)}>Cancel</Button>
                    </div>
                  </div>
                ) : (
                  <>
                    <h3 className="text-xl font-bold mt-4">{user?.name}</h3>
                    <p className="text-sm text-muted-foreground mb-4">{user?.email}</p>
                    <Button variant="outline" size="sm" className="rounded-lg h-8 mb-4 border-white/10" onClick={() => setIsEditing(true)}>Edit Profile</Button>
                  </>
                )}
                <div>
                   <Badge className="bg-primary/10 text-primary border-primary/20 hover:bg-primary/20">PRO TRADER v1</Badge>
                </div>
             </CardContent>
             <div className="border-t border-white/5 p-4 grid grid-cols-2 gap-4">
                <div className="text-center">
                   <p className="text-[10px] text-muted-foreground uppercase font-mono">Terminal ID</p>
                   <p className="text-xs font-bold font-mono">TX-990-21</p>
                </div>
                <div className="text-center">
                   <p className="text-[10px] text-muted-foreground uppercase font-mono">Account Status</p>
                   <p className="text-xs font-bold text-green-500 uppercase">Verified</p>
                </div>
             </div>
          </Card>

          <div className="flex flex-col gap-2">
            <Button variant="ghost" className="justify-start h-12 rounded-xl text-muted-foreground hover:bg-white/5">
              <User className="w-4 h-4 mr-3" /> Profile Info
            </Button>
            <Button variant="ghost" className="justify-start h-12 rounded-xl text-muted-foreground hover:bg-white/5 text-primary bg-primary/5">
              <Shield className="w-4 h-4 mr-3" /> Privacy & Security
            </Button>
            <Button variant="ghost" className="justify-start h-12 rounded-xl text-muted-foreground hover:bg-white/5">
              <CreditCard className="w-4 h-4 mr-3" /> Payment Methods
            </Button>
            <Button variant="ghost" className="justify-start h-12 rounded-xl text-muted-foreground hover:bg-white/5">
              <Bell className="w-4 h-4 mr-3" /> Notifications
            </Button>
          </div>
        </div>

        <div className="md:col-span-2 space-y-8">
          <Card className="glass border-white/5">
            <CardHeader className="border-b border-white/5">
              <CardTitle className="text-lg flex items-center gap-2">
                <Palette className="w-5 h-5 text-primary" /> Appearance Configuration
              </CardTitle>
              <CardDescription>Personalize the look and feel of your AngryTraders dashboard.</CardDescription>
            </CardHeader>
            <CardContent className="divide-y divide-white/5">
              <SettingItem 
                icon={theme === 'dark' ? Moon : Sun} 
                title="Interface Theme" 
                description="Toggle between clean light mode and premium futuristic dark mode."
              >
                <div className="flex items-center gap-3 p-1 bg-white/5 rounded-xl border border-white/5">
                  <Button variant="ghost" size="sm" onClick={() => theme !== 'light' && toggleTheme()} className={cn("rounded-lg h-8 px-4", theme === 'light' ? "bg-white text-black hover:bg-white" : "text-muted-foreground hover:text-white")}>
                    <Sun className="w-3 h-3 mr-2" /> Light
                  </Button>
                  <Button variant="ghost" size="sm" onClick={() => theme !== 'dark' && toggleTheme()} className={cn("rounded-lg h-8 px-4", theme === 'dark' ? "bg-primary text-primary-foreground hover:bg-primary shadow-lg shadow-primary/20" : "text-muted-foreground hover:text-white")}>
                    <Moon className="w-3 h-3 mr-2" /> Dark
                  </Button>
                </div>
              </SettingItem>
              
              <SettingItem 
                icon={Globe} 
                title={t('language')} 
                description="Select your preferred language for the terminal interface."
              >
                <div className="flex flex-wrap gap-2">
                  {languages.map((lang) => (
                    <Button 
                      key={lang.code}
                      variant="outline" 
                      size="sm" 
                      onClick={() => setLanguage(lang.code as any)}
                      className={cn(
                        "rounded-lg h-9 px-3 border-white/5 transition-all",
                        language === lang.code 
                          ? "bg-primary/20 text-primary border-primary/30" 
                          : "bg-white/5 text-muted-foreground hover:bg-white/10"
                      )}
                    >
                      <span className="mr-1.5">{lang.flag}</span>
                      {lang.name}
                    </Button>
                  ))}
                </div>
              </SettingItem>

              <SettingItem 
                icon={CreditCard} 
                title={t('currency')} 
                description="Base currency for balance, prices and trade calculations."
              >
                <div className="flex flex-wrap gap-2">
                  {currencies.map((cur) => (
                    <Button 
                      key={cur.code}
                      variant="outline" 
                      size="sm" 
                      onClick={() => setCurrency(cur.code as any)}
                      className={cn(
                        "rounded-lg h-9 px-3 border-white/5 transition-all font-mono",
                        currency === cur.code 
                          ? "bg-primary/20 text-primary border-primary/30" 
                          : "bg-white/5 text-muted-foreground hover:bg-white/10"
                      )}
                    >
                      <span className="font-bold mr-1">{cur.symbol}</span>
                      {cur.code}
                    </Button>
                  ))}
                </div>
              </SettingItem>

              <SettingItem 
                icon={Eye} 
                title="Privacy Mode" 
                description="Conceal portfolio balances and sensitive data from the main interface."
              >
                <Switch />
              </SettingItem>

              <SettingItem 
                icon={LineChart} 
                title="Advanced Charts" 
                description="Enable candle-based technical analysis tools and drawing overlays."
              >
                <Switch defaultChecked />
              </SettingItem>
            </CardContent>
          </Card>

          <Card className="glass border-white/5">
            <CardHeader className="border-b border-white/5">
              <CardTitle className="text-lg flex items-center gap-2">
                <Shield className="w-5 h-5 text-primary" /> Security & Access
              </CardTitle>
            </CardHeader>
            <CardContent>
              <SettingItem 
                icon={Key} 
                title="Two-Factor Authentication" 
                description="Secure your account with TOTP based 2FA or hardware security keys."
              >
                <Button variant="outline" className="rounded-lg h-9 border-white/10 hover:bg-white/5">Enable</Button>
              </SettingItem>
              
              <SettingItem 
                icon={Smartphone} 
                title="Authorized Devices" 
                description="View and manage sessions across your mobile and desktop devices."
              >
                <div className="flex items-center text-xs text-muted-foreground gap-1 hover:text-primary cursor-pointer transition-colors font-bold">
                   Manage <ChevronRight className="w-3 h-3" />
                </div>
              </SettingItem>
            </CardContent>
          </Card>

          <div className="pt-4 flex flex-col md:flex-row gap-4 items-center justify-between text-muted-foreground text-xs font-mono">
            <span>Last Login: Today at 08:42 AM (192.168.1.1)</span>
            <div className="flex gap-4">
              <Button 
                variant="link" 
                className="text-primary h-auto p-0 font-bold uppercase tracking-widest text-[10px]"
                onClick={() => {
                  localStorage.clear();
                  window.location.href = '/';
                }}
              >
                Reset App Data
              </Button>
              <Button variant="link" className="text-red-500 h-auto p-0 font-bold uppercase tracking-widest text-[10px]">Deactivate Account</Button>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
};
