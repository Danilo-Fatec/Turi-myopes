import React from 'react';
import styles from '../app.module.css';

const Footer: React.FC = () => {
  return (
    <footer className={styles.footer}>
      <p>Projeto TURI © 2025 | Equipe MYOPES</p>
      <p>Email: myopes@gmail.com</p>
      <div className={styles.footerLogos}>
        <img src="./img/logo-equipe.png" alt="Turi Burned" className={styles.footerLogo} />
        <img src="./img/logo-projeto.png" alt="Myopes" className={styles.footerLogo} />
      </div>
    </footer>
  );
};

export default Footer;