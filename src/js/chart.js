// Chart reference
let costChart = null;
let isLockedMode = false;

// Function to calculate cost for a given distance
function calculateCost(price, efficiency, distance) {
    if (efficiency <= 0) return 0;
    return (price / efficiency) * distance;
}

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

// Function to update the chart
function updateChart(evEfficiency, mpg, evPrice, gasPrice, miles, isLocked = false) {
    const ctx = document.getElementById('costChart').getContext('2d');
    
    // Destroy existing chart if it exists
    if (costChart) {
        costChart.destroy();
    }

    isLockedMode = isLocked;

    if (isLocked) {
        // In locked mode, we'll show a price comparison chart
        const labels = ['Electricity Price ($/kWh)', 'Gas Price ($/gallon)'];
        const evCostPerMile = calculateCost(evPrice, evEfficiency / 1000, 1);
        const gasCostPerMile = calculateCost(gasPrice, mpg, 1);

        costChart = new Chart(ctx, {
            type: 'bar',
            data: {
                labels: labels,
                datasets: [{
                    label: 'Cost per Mile ($)',
                    data: [evCostPerMile, gasCostPerMile],
                    backgroundColor: [
                        'rgba(34, 197, 94, 0.5)',  // Green for EV
                        'rgba(239, 68, 68, 0.5)'   // Red for Gas
                    ],
                    borderColor: [
                        'rgb(34, 197, 94)',        // Green for EV
                        'rgb(239, 68, 68)'         // Red for Gas
                    ],
                    borderWidth: 1
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                scales: {
                    y: {
                        beginAtZero: true,
                        title: {
                            display: true,
                            text: 'Cost per Mile ($)'
                        }
                    }
                },
                plugins: {
                    title: {
                        display: true,
                        text: 'Cost per Mile Comparison'
                    },
                    tooltip: {
                        callbacks: {
                            label: function(context) {
                                return `$${context.raw.toFixed(4)} per mile`;
                            }
                        }
                    }
                }
            }
        });

        // Update chart summary
        const chartSummary = document.getElementById('chartSummary');
        const difference = Math.abs(evCostPerMile - gasCostPerMile);
        const cheaper = evCostPerMile < gasCostPerMile ? 'electricity' : 'gasoline';
        chartSummary.textContent = `Electricity costs $${evCostPerMile.toFixed(4)} per mile, while gasoline costs $${gasCostPerMile.toFixed(4)} per mile. ${cheaper.charAt(0).toUpperCase() + cheaper.slice(1)} is $${difference.toFixed(4)} cheaper per mile.`;
    } else {
        // Original distance-based chart
        const maxDistance = Math.max(miles, 100);
        const distances = Array.from({length: 11}, (_, i) => Math.round((maxDistance / 10) * i));
        
        const evCosts = distances.map(d => calculateCost(evPrice, evEfficiency / 1000, d));
        const gasCosts = distances.map(d => calculateCost(gasPrice, mpg, d));

        costChart = new Chart(ctx, {
            type: 'line',
            data: {
                labels: distances,
                datasets: [
                    {
                        label: 'EV Cost',
                        data: evCosts,
                        borderColor: 'rgb(34, 197, 94)',
                        backgroundColor: 'rgba(34, 197, 94, 0.1)',
                        tension: 0.1
                    },
                    {
                        label: 'Gas Cost',
                        data: gasCosts,
                        borderColor: 'rgb(239, 68, 68)',
                        backgroundColor: 'rgba(239, 68, 68, 0.1)',
                        tension: 0.1
                    }
                ]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                scales: {
                    x: {
                        title: {
                            display: true,
                            text: 'Distance (miles)'
                        }
                    },
                    y: {
                        title: {
                            display: true,
                            text: 'Cost ($)'
                        }
                    }
                },
                plugins: {
                    title: {
                        display: true,
                        text: 'Cost Over Distance'
                    }
                }
            }
        });

        // Update chart summary
        const chartSummary = document.getElementById('chartSummary');
        const evCost = calculateCost(evPrice, evEfficiency / 1000, miles);
        const gasCost = calculateCost(gasPrice, mpg, miles);
        const savings = Math.abs(evCost - gasCost);
        const cheaper = evCost < gasCost ? 'electricity' : 'gasoline';
        chartSummary.textContent = `For ${miles} miles, electricity costs $${evCost.toFixed(2)} while gasoline costs $${gasCost.toFixed(2)}. ${cheaper.charAt(0).toUpperCase() + cheaper.slice(1)} is $${savings.toFixed(2)} cheaper.`;
    }
}

// Listen for price update events
document.addEventListener('priceUpdate', (event) => {
    const { evPrice, gasPrice, isLocked } = event.detail;
    const evEfficiency = parseFloat(document.getElementById('evEfficiency').value);
    const mpg = parseFloat(document.getElementById('mpg').value);
    const miles = parseFloat(document.getElementById('miles').value);

    if (!isNaN(evEfficiency) && !isNaN(mpg) && !isNaN(miles)) {
        updateChart(evEfficiency, mpg, evPrice, gasPrice, miles, isLocked);
    }
});

// Export functions for use in other files
window.chart = {
  updateChart
}; 