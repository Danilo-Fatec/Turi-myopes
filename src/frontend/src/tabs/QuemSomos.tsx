import React from 'react';
import styles from '../Styles/QuemSomos.module.css';

const QuemSomos: React.FC = () => {
  return (
      <div className={styles.container}>
        <div className={styles.card}>
          <h1 className={styles.title}>Quem Somos</h1>
          <p>
            Os Myopes surgiram na sala de aula da Fatec, com o desafio de criar um site informativo, onde a população pudesse se informar a respeito de focos de calor, área queimada e risco de fogo de sua região. 
            Assim surge o TURI, um site informativo que tem como objetivo facilitar o acesso à informação com dados precisos e atualizados de cada região e bioma. 
            Nossa equipe é formada por seis estudantes apaixonados por tecnologia e pelo que fazem. 
            Utilizamos tecnologias modernas para coletar e apresentar dados de forma clara e interativa. 
            Para mais informações, entre em contato conosco pelo e-mail mmoypes@gmail.com.
          </p>
        </div>
      </div>
  );
};

export default QuemSomos;