import React, { useEffect, useState } from 'react';
import css from './app.module.css';
import Header from './components/Header';
import Footer from './components/Footer';
import AppRoutes from './routes/routes';

const App: React.FC = () => {
  const [activeTab, setActiveTab] = useState<string>('inicio');
  const [theme, setTheme] = useState<'light' | 'dark'>('light');

  
  useEffect(() => {
    const saved = localStorage.getItem('theme');
    if (saved === 'dark' || saved === 'light') {
      setTheme(saved);
      document.documentElement.setAttribute('data-theme', saved);
    } else {
      setTheme('light');
      document.documentElement.setAttribute('data-theme', 'light');
    }
  }, []);

 
  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('theme', theme);
  }, [theme]);

  const handleTabChange = (tab: string) => {
    setActiveTab(tab);
  };

  const toggleTheme = () => {
    setTheme(theme === 'dark' ? 'light' : 'dark');
  };

  return (
    <div className={css.app}>
      <Header showTab={handleTabChange} theme={theme} toggleTheme={toggleTheme} />
      <main className={css.main}>
        <AppRoutes />
      </main>
      <Footer />
    </div>
  );
};

export default App;