// Chart reference
let costChart = null;

// Initialize chart
function initChart() {
  const ctx = document.getElementById('costChart').getContext('2d');
  
  // Line chart configuration
  const chartConfig = {
    type: 'line',
    data: {
      labels: [],
      datasets: [
        {
          label: 'EV',
          data: [],
          borderColor: 'rgba(72, 187, 120, 1)',
          backgroundColor: 'rgba(72, 187, 120, 0.1)',
          fill: true,
          tension: 0.1
        },
        {
          label: 'Gas',
          data: [],
          borderColor: 'rgba(224, 36, 94, 1)',
          backgroundColor: 'rgba(224, 36, 94, 0.1)',
          fill: true,
          tension: 0.1
        }
      ]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: {
          display: true
        },
        tooltip: {
          callbacks: {
            label: function(context) {
              return `$${context.raw.toFixed(2)}`;
            }
          }
        }
      },
      scales: {
        x: {
          title: {
            display: true,
            text: 'Distance (miles)',
            color: window.theme.isDarkMode() ? '#e2e8f0' : '#4a5568'
          }
        },
        y: {
          beginAtZero: true,
          ticks: {
            callback: function(value) {
              return '$' + value.toFixed(2);
            }
          },
          title: {
            display: true,
            text: 'Cost ($)',
            color: window.theme.isDarkMode() ? '#e2e8f0' : '#4a5568'
          }
        }
      }
    }
  };
  
  costChart = new Chart(ctx, chartConfig);
}

// Update chart with calculated costs
function updateChart(evCost, gasCost, miles) {
  if (!costChart) {
    initChart();
  }
  
  // Show chart section
  const chartSection = document.getElementById('chartSection');
  chartSection.classList.remove('opacity-0', '-translate-y-10');
  
  // Line graph showing costs over distance
  const distances = [];
  const evCosts = [];
  const gasCosts = [];
  
  // Generate data for various distances
  const maxDistance = Math.max(miles * 2, 100);
  const step = maxDistance / 10;
  
  for (let dist = 0; dist <= maxDistance; dist += step) {
    distances.push(dist);
    
    const evCostPerMile = evCost / miles;
    const gasCostPerMile = gasCost / miles;
    
    evCosts.push(evCostPerMile * dist);
    gasCosts.push(gasCostPerMile * dist);
  }
  
  costChart.data.labels = distances;
  costChart.data.datasets[0].data = evCosts;
  costChart.data.datasets[1].data = gasCosts;
  
  // Update chart summary for line chart
  const evCostPerMile = evCost / miles;
  const gasCostPerMile = gasCost / miles;
  const breakEvenDistance = Math.abs(evCost - gasCost) / Math.abs(gasCostPerMile - evCostPerMile);
  
  const chartSummary = document.getElementById('chartSummary');
  if (evCostPerMile < gasCostPerMile) {
    chartSummary.textContent = `EV is cheaper at all distances. You save $${(gasCostPerMile - evCostPerMile).toFixed(3)} per mile.`;
  } else if (evCostPerMile > gasCostPerMile) {
    chartSummary.textContent = `Gas is cheaper at all distances. You save $${(evCostPerMile - gasCostPerMile).toFixed(3)} per mile.`;
  } else {
    chartSummary.textContent = `Both options cost the same per mile.`;
  }
  
  costChart.update();
}

// Export functions for use in other files
window.chart = {
  updateChart
}; 