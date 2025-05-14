import React from 'react';
import styles from '../Styles/Home.module.css';

const Home: React.FC = () => {
  return (
    <div className={styles.container}>
      <h1 className={styles.title}>Bem-vindo ao Projeto Turi</h1>
      <div className={styles.grid}>
        <div className={styles.card}>
          <img src="/img/termometro.png" alt="Focos de Calor" className={styles.icon} />
          <h2>Focos de Calor</h2>
          <p>Mapa interativo com áreas com foco de calor - dados dos satélites do INPE</p>
        </div>
        <div className={styles.card}>
          <img src="/img/queimada.png" alt="Risco de Fogo" className={styles.icon} />
          <h2>Risco de Fogo</h2>
          <p>Mapa interativo com áreas de risco de fogo - dados dos satélites do INPE</p>
        </div>
        <div className={styles.card}>
          <img src="/img/fogo.png" alt="Áreas Queimadas" className={styles.icon} />
          <h2>Áreas Queimadas</h2>
          <p>Mapa interativo com áreas queimadas - dados dos satélites do INPE</p>
        </div>
        <div className={styles.card}>
          <img src="/img/grafico.png" alt="Gráficos" className={styles.icon} />
          <h2>Gráficos</h2>
          <p>Gráficos com informações dos dados geográficos ambientais</p>
        </div>
      </div>
    </div>
  );
};

export default Home;