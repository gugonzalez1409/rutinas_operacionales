function generateStats() {
    var selectedArea = document.getElementById('area').value;
    // Aquí deberías realizar lógica para obtener datos estadísticos basados en el área seleccionada
    var statsData = getStatsData(selectedArea);
    // Llama a la función para crear/graficar el gráfico
    renderChart(statsData);
  }
  function getStatsData(area) {
    // Simula obtener datos estadísticos desde una fuente de datos (reemplaza con datos reales)
    var statsData = {
      labels: ['Categoría 1', 'Categoría 2', 'Categoría 3', 'Categoría 4', 'Categoría 5'],
      datasets: [
        {
          label: 'Datos de Estadísticas',
          data: [20, 35, 25, 15, 30], // Aquí deberías tener los datos reales basados en el área
          backgroundColor: 'rgba(75, 192, 192, 0.2)',
          borderColor: 'rgba(75, 192, 192, 1)',
          borderWidth: 1
        }
      ]
    };
    return statsData;
  }
  function renderChart(statsData) {
    var ctx = document.getElementById('myChart').getContext('2d');
    var myChart = new Chart(ctx, { // problema con Chart.js
      type: 'bar', // Puedes cambiar el tipo de gráfico según tus necesidades
      data: statsData,
      options: {
        responsive: true,
        scales: {
          x: {
            beginAtZero: true
          },
          y: {
            beginAtZero: true
          }
        }
      }
    });
  }  