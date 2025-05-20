import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import styles from '../app.module.css';


interface HeaderProps {
  showTab: (tab: string) => void;
  theme: 'light' | 'dark';
  toggleTheme: () => void;
}

const Header: React.FC<HeaderProps> = ({ showTab, theme, toggleTheme }) => {
  const [menuOpen, setMenuOpen] = useState(false);

  const toggleMenu = () => {
    setMenuOpen(!menuOpen);
  };

  return (
    <header className={styles.header}>
      <div className={styles.logo}>
        <Link to="/">
          <img src="./img/unnamed.png" alt="Turi Logo" />
        </Link>
      </div>
      <button className={styles.hamburger} onClick={toggleMenu}>
        &#9776; 
      </button>
      <nav
        className={`${styles.navContainer} ${
          menuOpen ? styles.active : ''
        }`}
      >
        <Link to="/" className={styles.navBtn}>
          Início
        </Link>
        <Link to="/mapa" className={styles.navBtn}>
          Mapa
        </Link>
        <Link to="/dados" className={styles.navBtn}>
          Dados
        </Link>
        <Link to="/quem-somos" className={styles.navBtn}>
          Quem Somos
        </Link>
        <button
          className={styles.themeToggle}
          onClick={toggleTheme}
          aria-label="Alternar tema"
        >
          {theme === 'dark' ? '☀️ Claro' : '🌙 Escuro'}
        </button>
      </nav>
    </header>
  );
};

export default Header;