
import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { Asset, User, TradeHistory, PortfolioItem } from '../types';
import { INITIAL_ASSETS, simulatePriceMovement } from '../utils/market-sim';

interface Notification {
  id: string;
  title: string;
  message: string;
  time: number;
  read: boolean;
  type: 'price' | 'news' | 'system';
}

interface AppContextType {
  assets: Asset[];
  user: User | null;
  theme: 'dark' | 'light';
  notifications: Notification[];
  toggleTheme: () => void;
  login: (email: string) => void;
  logout: () => void;
  executeTrade: (assetId: string, type: 'buy' | 'sell', amount: number) => void;
  updateWatchlist: (assetIds: string[]) => void;
  toggleWatchlist: (assetId: string) => void;
  updateProfile: (data: Partial<User>) => void;
  markNotificationAsRead: (id: string) => void;
  language: 'en' | 'hi' | 'es' | 'fr';
  currency: 'USD' | 'INR' | 'EUR' | 'GBP';
  setLanguage: (lang: 'en' | 'hi' | 'es' | 'fr') => void;
  setCurrency: (cur: 'USD' | 'INR' | 'EUR' | 'GBP') => void;
  formatCurrency: (amount: number) => string;
  t: (key: string) => string;
  isLoading: boolean;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [assets, setAssets] = useState<Asset[]>(() => {
    const saved = localStorage.getItem('tradex_assets');
    return saved ? JSON.parse(saved) : INITIAL_ASSETS;
  });

  const [user, setUser] = useState<User | null>(() => {
    const saved = localStorage.getItem('tradex_user');
    return saved ? JSON.parse(saved) : null;
  });

  const [theme, setTheme] = useState<'dark' | 'light'>(() => {
    const saved = localStorage.getItem('tradex_theme');
    return (saved as 'dark' | 'light') || 'dark';
  });

  const [language, setLanguageState] = useState<'en' | 'hi' | 'es' | 'fr'>(() => {
    const saved = localStorage.getItem('tradex_language');
    return (saved as any) || 'en';
  });

  const [currency, setCurrencyState] = useState<'USD' | 'INR' | 'EUR' | 'GBP'>(() => {
    const saved = localStorage.getItem('tradex_currency');
    return (saved as any) || 'USD';
  });

  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Persistence
  useEffect(() => {
    localStorage.setItem('tradex_assets', JSON.stringify(assets));
  }, [assets]);

  useEffect(() => {
    if (user) {
      localStorage.setItem('tradex_user', JSON.stringify(user));
    } else {
      localStorage.removeItem('tradex_user');
    }
  }, [user]);

  useEffect(() => {
    localStorage.setItem('tradex_theme', JSON.stringify(theme));
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [theme]);

  useEffect(() => {
    localStorage.setItem('tradex_language', language);
  }, [language]);

  useEffect(() => {
    localStorage.setItem('tradex_currency', currency);
  }, [currency]);

  // Market Simulation and Random Notifications
  useEffect(() => {
    const interval = setInterval(() => {
      setAssets(prev => {
        const newAssets = simulatePriceMovement(prev);
        
        // Randomly generate price alert
        if (Math.random() > 0.95) {
          const randomAsset = newAssets[Math.floor(Math.random() * newAssets.length)];
          const newNotif: Notification = {
            id: Math.random().toString(36).substr(2, 9),
            title: `${randomAsset.symbol} Price Alert`,
            message: `${randomAsset.name} is showing high volatility! Current price: $${randomAsset.price.toFixed(2)}`,
            time: Date.now(),
            read: false,
            type: 'price'
          };
          setNotifications(prevNotifs => [newNotif, ...prevNotifs].slice(0, 50));
        }
        
        // Randomly generate fake news
        if (Math.random() > 0.98) {
          const news = [
            "Federal Reserve hints at potential rate adjustments next quarter.",
            "Tech giants report record earnings amidst global expansion.",
            "New protocol upgrade announced for major decentralized network.",
            "Institutional investors showing increased interest in digital assets."
          ];
          const newNotif: Notification = {
            id: Math.random().toString(36).substr(2, 9),
            title: "Breaking News",
            message: news[Math.floor(Math.random() * news.length)],
            time: Date.now(),
            read: false,
            type: 'news'
          };
          setNotifications(prevNotifs => [newNotif, ...prevNotifs].slice(0, 50));
        }

        return newAssets;
      });
    }, 3000);
    
    // Simulate initial loading
    setTimeout(() => setIsLoading(false), 1500);

    return () => clearInterval(interval);
  }, []);

  const setLanguage = useCallback((lang: 'en' | 'hi' | 'es' | 'fr') => {
    setLanguageState(lang);
  }, []);

  const setCurrency = useCallback((cur: 'USD' | 'INR' | 'EUR' | 'GBP') => {
    setCurrencyState(cur);
  }, []);

  const exchangeRates = {
    USD: 1,
    INR: 83.31,
    EUR: 0.93,
    GBP: 0.80
  };

  const currencySymbols = {
    USD: '$',
    INR: '₹',
    EUR: '€',
    GBP: '£'
  };

  const formatCurrency = useCallback((amount: number) => {
    const rate = exchangeRates[currency];
    const converted = amount * rate;
    const symbol = currencySymbols[currency];
    
    return `${symbol}${converted.toLocaleString(undefined, { 
      minimumFractionDigits: 2, 
      maximumFractionDigits: 2 
    })}`;
  }, [currency]);

  const translations: Record<string, Record<string, string>> = {
    en: {
      dashboard: 'Dashboard',
      markets: 'Markets',
      portfolio: 'Portfolio',
      orders: 'Orders',
      settings: 'Settings',
      pro_insights: 'Pro Insights',
      deposit: 'Deposit',
      withdraw: 'Withdraw',
      buy: 'Buy',
      sell: 'Sell',
      watchlist: 'Watchlist',
      balance: 'Portfolio Balance',
      language: 'Language',
      currency: 'Currency'
    },
    hi: {
      dashboard: 'डैशबोर्ड',
      markets: 'बाजार',
      portfolio: 'पोर्टफोलियो',
      orders: 'ऑर्डर',
      settings: 'सेटिंग्स',
      pro_insights: 'प्रो इनसाइट्स',
      deposit: 'जमा करें',
      withdraw: 'निकालें',
      buy: 'खरीदें',
      sell: 'बेचें',
      watchlist: 'वॉचलिस्ट',
      balance: 'पोर्टफोलियो बैलेंस',
      language: 'भाषा',
      currency: 'मुद्रा'
    },
    es: {
      dashboard: 'Tablero',
      markets: 'Mercados',
      portfolio: 'Portafolio',
      orders: 'Órdenes',
      settings: 'Ajustes',
      pro_insights: 'Perspectivas Pro',
      deposit: 'Depositar',
      withdraw: 'Retirar',
      buy: 'Comprar',
      sell: 'Vender',
      watchlist: 'Lista de seguimiento',
      balance: 'Saldo del portafolio',
      language: 'Idioma',
      currency: 'Moneda'
    },
    fr: {
      dashboard: 'Tableau de bord',
      markets: 'Marchés',
      portfolio: 'Portefeuille',
      orders: 'Commandes',
      settings: 'Paramètres',
      pro_insights: 'Aperçus Pro',
      deposit: 'Dépôt',
      withdraw: 'Retirer',
      buy: 'Acheter',
      sell: 'Vendre',
      watchlist: 'Liste de surveillance',
      balance: 'Solde du portefeuille',
      language: 'Langue',
      currency: 'Devise'
    }
  };

  const t = useCallback((key: string) => {
    return translations[language][key] || key;
  }, [language]);

  const toggleTheme = useCallback(() => {
    setTheme(prev => prev === 'dark' ? 'light' : 'dark');
  }, []);

  const login = useCallback((email: string) => {
    const newUser: User = {
      id: Math.random().toString(36).substr(2, 9),
      name: email.split('@')[0],
      email,
      balance: 100000, 
      portfolio: [
        { assetId: '1', symbol: 'BTC', amount: 0.5, avgPrice: 62000 },
        { assetId: '3', symbol: 'SOL', amount: 15, avgPrice: 130 }
      ],
      history: [
        {
          id: 'h1',
          assetId: '1',
          symbol: 'BTC',
          type: 'buy',
          amount: 0.5,
          price: 62000,
          timestamp: Date.now() - 86400000 * 2,
          status: 'completed'
        },
        {
          id: 'h2',
          assetId: '3',
          symbol: 'SOL',
          type: 'buy',
          amount: 15,
          price: 130,
          timestamp: Date.now() - 86400000 * 5,
          status: 'completed'
        }
      ],
      watchlist: ['1', '2', '3', '6'] // Correct initial watchlist IDs
    };
    setUser(newUser);
  }, []);

  const logout = useCallback(() => {
    setUser(null);
  }, []);

  const updateWatchlist = useCallback((assetIds: string[]) => {
    setUser(prev => prev ? { ...prev, watchlist: assetIds } : null);
  }, []);

  const toggleWatchlist = useCallback((assetId: string) => {
    setUser(prev => {
      if (!prev) return null;
      const isWatchlisted = prev.watchlist.includes(assetId);
      const newWatchlist = isWatchlisted
        ? prev.watchlist.filter(id => id !== assetId)
        : [...prev.watchlist, assetId];
      return { ...prev, watchlist: newWatchlist };
    });
  }, []);

  const updateProfile = useCallback((data: Partial<User>) => {
    setUser(prev => prev ? { ...prev, ...data } : null);
  }, []);

  const markNotificationAsRead = useCallback((id: string) => {
    setNotifications(prev => prev.map(n => n.id === id ? { ...n, read: true } : n));
  }, []);

  const executeTrade = useCallback((assetId: string, type: 'buy' | 'sell', amount: number) => {
    if (!user) return;

    const asset = assets.find(a => a.id === assetId);
    if (!asset) return;

    const totalCost = asset.price * amount;

    if (type === 'buy') {
      if (user.balance < totalCost) {
        alert('Insufficient funds');
        return;
      }

      setUser(prev => {
        if (!prev) return null;
        const newPortfolio = [...prev.portfolio];
        const existingIndex = newPortfolio.findIndex(p => p.assetId === assetId);

        if (existingIndex >= 0) {
          const item = newPortfolio[existingIndex];
          const newAmount = item.amount + amount;
          const newAvgPrice = (item.amount * item.avgPrice + totalCost) / newAmount;
          newPortfolio[existingIndex] = { ...item, amount: newAmount, avgPrice: newAvgPrice };
        } else {
          newPortfolio.push({ assetId, symbol: asset.symbol, amount, avgPrice: asset.price });
        }

        const trade: TradeHistory = {
          id: Math.random().toString(36).substr(2, 9),
          assetId,
          symbol: asset.symbol,
          type: 'buy',
          amount,
          price: asset.price,
          timestamp: Date.now(),
          status: 'completed'
        };

        return {
          ...prev,
          balance: prev.balance - totalCost,
          portfolio: newPortfolio,
          history: [trade, ...prev.history]
        };
      });
    } else {
      setUser(prev => {
        if (!prev) return null;
        const newPortfolio = [...prev.portfolio];
        const existingIndex = newPortfolio.findIndex(p => p.assetId === assetId);

        if (existingIndex < 0 || newPortfolio[existingIndex].amount < amount) {
          alert('Insufficient asset balance');
          return prev;
        }

        const item = newPortfolio[existingIndex];
        const newAmount = item.amount - amount;
        if (newAmount === 0) {
          newPortfolio.splice(existingIndex, 1);
        } else {
          newPortfolio[existingIndex] = { ...item, amount: newAmount };
        }

        const trade: TradeHistory = {
          id: Math.random().toString(36).substr(2, 9),
          assetId,
          symbol: asset.symbol,
          type: 'sell',
          amount,
          price: asset.price,
          timestamp: Date.now(),
          status: 'completed'
        };

        return {
          ...prev,
          balance: prev.balance + totalCost,
          portfolio: newPortfolio,
          history: [trade, ...prev.history]
        };
      });
    }
  }, [assets, user]);

  return (
    <AppContext.Provider value={{ 
      assets, 
      user, 
      theme, 
      notifications,
      language,
      currency,
      setLanguage,
      setCurrency,
      formatCurrency,
      t,
      toggleTheme, 
      login, 
      logout, 
      executeTrade, 
      updateWatchlist,
      toggleWatchlist,
      updateProfile,
      markNotificationAsRead,
      isLoading 
    }}>
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
