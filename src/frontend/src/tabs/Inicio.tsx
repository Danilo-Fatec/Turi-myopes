import React from 'react';
import styles from '../Styles/Home.module.css';
import { Link } from 'react-router-dom';

const Home: React.FC = () => {
  return (
    <div className={styles.container}>
      <h1 className={styles.title}>Bem-vindo ao Projeto Turi</h1>
      <div className={styles.grid}>

        <Link to="/mapa/focos-de-calor">
          <div className={styles.card}>
            <img src="/img/termometro.png" alt="Focos de Calor" className={styles.icon} />
            <h2>Focos de Calor</h2>
            <p>Mapa interativo com áreas com foco de calor - dados dos satélites do INPE</p>
          </div>
        </Link>
        <Link to="/mapa/risco-de-fogo">
          <div className={styles.card}>
            <img src="/img/queimada.png" alt="Risco de Fogo" className={styles.icon} />
            <h2>Risco de Fogo</h2>
            <p>Mapa interativo com áreas de risco de fogo - dados dos satélites do INPE</p>
          </div>
        </Link>
        <Link to="/mapa/areas-queimadas">
          <div className={styles.card}>
            <img src="/img/fogo.png" alt="Áreas Queimadas" className={styles.icon} />
            <h2>Áreas Queimadas</h2>
            <p>Mapa interativo com áreas queimadas - dados dos satélites do INPE</p>
          </div>
        </Link>
        <Link to="/dados">
          <div className={styles.card}>
            <img src="/img/grafico.png" alt="Gráficos" className={styles.icon} />
            <h2>Gráficos</h2>
            <p>Gráficos com informações dos dados geográficos ambientais</p>
          </div>
        </Link>



      </div>
    </div>
  );
};

export default Home;