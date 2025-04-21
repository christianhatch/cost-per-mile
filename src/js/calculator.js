// Track EV efficiency mode (false = Wh/mile, true = miles/kWh)
let evEfficiencyMode = false;

// Calculator module
const Calculator = {
    // Get all current input values
    getInputValues() {
        return {
            evEfficiency: parseFloat(document.getElementById('evEfficiency').value) || 0,
            evPrice: parseFloat(document.getElementById('evPrice').value) || 0,
            mpg: parseFloat(document.getElementById('mpg').value) || 0,
            gasPrice: parseFloat(document.getElementById('gasPrice').value) || 0,
            miles: parseFloat(document.getElementById('miles').value) || 1,
            isLocked: document.getElementById('evPrice').disabled || document.getElementById('gasPrice').disabled
        };
    },

    // Calculate costs
    calculateCosts(values) {
        const evEfficiencyKWh = values.evEfficiency / 1000;
        const evCostPerMile = values.evPrice * evEfficiencyKWh;
        const gasCostPerMile = values.gasPrice / values.mpg;
        const evCost = evCostPerMile * values.miles;
        const gasCost = gasCostPerMile * values.miles;
        const savings = Math.abs(evCost - gasCost);
        const cheaper = evCost < gasCost ? 'EV' : 'Gas';

        return {
            evCostPerMile,
            gasCostPerMile,
            evCost,
            gasCost,
            savings,
            cheaper
        };
    },

    // Update the UI with calculated values
    updateUI(values, costs) {
        // Update cost per mile display
        document.getElementById('evResult').textContent = `EV: $${costs.evCostPerMile.toFixed(4)}/mi`;
        document.getElementById('gasResult').textContent = `Gas: $${costs.gasCostPerMile.toFixed(4)}/mi`;
        document.getElementById('savingsResult').textContent = `${costs.cheaper} saves $${costs.savings.toFixed(4)}/mi`;

        // Update chart
        if (window.chart && window.chart.updateChart) {
            window.chart.updateChart(
                values.evEfficiency,
                values.mpg,
                values.evPrice,
                values.gasPrice,
                values.miles,
                values.isLocked
            );
        }
    },

    // Main update function that should be called whenever anything changes
    update() {
        const values = this.getInputValues();
        const costs = this.calculateCosts(values);
        this.updateUI(values, costs);
    }
};

// Export the calculator
window.calculator = Calculator;

function calculate() {
  const evPrice = parseFloat(document.getElementById('evPrice').value);
  const evEfficiencyInput = parseFloat(document.getElementById('evEfficiency').value);
  const gasPrice = parseFloat(document.getElementById('gasPrice').value);
  const mpg = parseFloat(document.getElementById('mpg').value);
  const miles = parseFloat(document.getElementById('miles').value) || 1;
  
  // Get result elements
  const evResultEl = document.getElementById('evResult');
  const gasResultEl = document.getElementById('gasResult');
  const savingsResultEl = document.getElementById('savingsResult');
  
  let evCost = 0;
  let gasCost = 0;
  let evCostPerMile = 0;
  let gasCostPerMile = 0;

  if (!isNaN(evPrice) && !isNaN(evEfficiencyInput)) {
    // Convert between the two modes
    let evEfficiencyWh;
    if (evEfficiencyMode) {
      // Input is miles per kWh, convert to Wh per mile
      evEfficiencyWh = 1000 / evEfficiencyInput;
    } else {
      // Input is already Wh per mile
      evEfficiencyWh = evEfficiencyInput;
    }
    
    // Convert Wh to kWh for calculation (divide by 1000)
    evCost = evPrice * (evEfficiencyWh / 1000) * miles;
    evCostPerMile = evPrice * (evEfficiencyWh / 1000);
    
    const evResultText = `EV: $${evCost.toFixed(2)} total ($${evCostPerMile.toFixed(3)}/mi)`;
    evResultEl.textContent = evResultText;
  } else {
    evResultEl.textContent = '';
  }

  if (!isNaN(gasPrice) && !isNaN(mpg)) {
    gasCost = (gasPrice / mpg) * miles;
    gasCostPerMile = gasPrice / mpg;
    
    const gasResultText = `Gas: $${gasCost.toFixed(2)} total ($${gasCostPerMile.toFixed(3)}/mi)`;
    gasResultEl.textContent = gasResultText;
  } else {
    gasResultEl.textContent = '';
  }
  
  // Calculate savings
  if (!isNaN(evCost) && !isNaN(gasCost)) {
    const diff = gasCost - evCost;
    const percentSavings = (diff / gasCost) * 100;
    
    if (diff > 0) {
      savingsResultEl.textContent = `EV saves $${diff.toFixed(2)} (${percentSavings.toFixed(1)}%)`;
    } else if (diff < 0) {
      savingsResultEl.textContent = `Gas saves $${Math.abs(diff).toFixed(2)} (${Math.abs(percentSavings).toFixed(1)}%)`;
    } else {
      savingsResultEl.textContent = 'Both options cost the same';
    }
  } else {
    savingsResultEl.textContent = '';
  }
  
  // Show/hide chart section based on results
  const chartSection = document.getElementById('chartSection');
  if (evResultEl.textContent === '' && gasResultEl.textContent === '') {
    chartSection.classList.add('opacity-0', '-translate-y-10');
  } else if (!isNaN(evCost) && !isNaN(gasCost)) {
    chartSection.classList.remove('opacity-0', '-translate-y-10');
    window.chart.updateChart(evCost, gasCost, miles);
  }
}

// Toggle between Wh/mile and miles/kWh
function toggleEvMode() {
  const evEfficiencyInput = document.getElementById('evEfficiency');
  const evEfficiencyLabel = document.getElementById('evEfficiencyLabel');
  const currentValue = parseFloat(evEfficiencyInput.value);
  
  if (!isNaN(currentValue) && currentValue !== 0) {
    if (evEfficiencyMode) {
      // Converting from miles/kWh to Wh/mile
      evEfficiencyInput.value = (1000 / currentValue).toFixed(1);
    } else {
      // Converting from Wh/mile to miles/kWh
      evEfficiencyInput.value = (1000 / currentValue).toFixed(1);
    }
  }
  
  // Update the mode flag
  evEfficiencyMode = !evEfficiencyMode;
  
  // Update the label
  evEfficiencyLabel.textContent = evEfficiencyMode 
    ? 'Efficiency (miles per kWh)' 
    : 'Efficiency (Wh per mile)';
  
  // Save mode to localStorage
  localStorage.setItem('evEfficiencyMode', evEfficiencyMode);
  
  calculate();
}

// Export functions for use in other files
window.calculator = {
  calculate,
  toggleEvMode
}; 