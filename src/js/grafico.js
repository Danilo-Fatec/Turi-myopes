let graficoPizza;

function renderizaGraficoPizza() {
  const ctx = document.getElementById('graficoPizza');
  if (!ctx || graficoPizza) return; // Evita múltiplos renders

  graficoPizza = new Chart(ctx, {
    type: 'pie',
    data: {
      labels: ['Focos de Calor', 'Risco de Fogo', 'Áreas Queimadas'],
      datasets: [{
        label: 'Distribuição Média',
        data: [45, 25, 30], // Exemplo fixo
        backgroundColor: [
          'rgb(255, 0, 0)',
          'rgb(255, 139, 86)',
          'rgb(235, 160, 54)'
        ],
        borderColor: [
         'rgb(255, 0, 0)',
          'rgb(255, 139, 86)',
          'rgb(235, 160, 54)'
        ],
        borderWidth: 1
      }]
    },
    options: {
      responsive: true,
      plugins: {
        legend: {
          position: 'bottom'
        }
      }
    }
  });
}

// Escuta mudança de aba e renderiza se for "dados"
document.addEventListener('DOMContentLoaded', () => {
  const dadosBtn = document.getElementById('btn-dados');
  if (dadosBtn) {
    dadosBtn.addEventListener('click', () => {
      setTimeout(renderizaGraficoPizza, 100); // Espera o display:block acontecer
    });
  }

  // Também tenta renderizar no carregamento (caso já esteja visível)
  if (document.getElementById('dados')?.classList.contains('active')) {
    renderizaGraficoPizza();
  }
});
