import React, { useState } from 'react';
import css from './app.module.css';
import Header from './components/Header';
import Footer from './components/Footer';
import AppRoutes from './routes/routes';

const App: React.FC = () => {
  const [activeTab, setActiveTab] = useState<string>('inicio');

  const handleTabChange = (tab: string) => {
    setActiveTab(tab);
  };

  return (
    <div className={css.app}>
      <Header showTab={handleTabChange}/>
      <main className={css.main}>
        <AppRoutes />
      </main>
      <Footer />
    </div>
  );
};

export default App;