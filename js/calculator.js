// Track EV efficiency mode (false = Wh/mile, true = miles/kWh)
let evEfficiencyMode = false;

function calculate() {
  const evPrice = parseFloat(document.getElementById('evPrice').value);
  const evEfficiencyInput = parseFloat(document.getElementById('evEfficiency').value);
  const gasPrice = parseFloat(document.getElementById('gasPrice').value);
  const mpg = parseFloat(document.getElementById('mpg').value);
  const miles = parseFloat(document.getElementById('miles').value) || 1;
  
  // Get all result elements
  const fixedEvResultEl = document.getElementById('fixedEvResult');
  const fixedGasResultEl = document.getElementById('fixedGasResult');
  const inlineEvResultEl = document.getElementById('inlineEvResult');
  const inlineGasResultEl = document.getElementById('inlineGasResult');
  const inlineSavingsResultEl = document.getElementById('inlineSavingsResult');
  
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
    fixedEvResultEl.textContent = evResultText;
    inlineEvResultEl.textContent = evResultText;
  } else {
    fixedEvResultEl.textContent = '';
    inlineEvResultEl.textContent = '';
  }

  if (!isNaN(gasPrice) && !isNaN(mpg)) {
    gasCost = (gasPrice / mpg) * miles;
    gasCostPerMile = gasPrice / mpg;
    
    const gasResultText = `Gas: $${gasCost.toFixed(2)} total ($${gasCostPerMile.toFixed(3)}/mi)`;
    fixedGasResultEl.textContent = gasResultText;
    inlineGasResultEl.textContent = gasResultText;
  } else {
    fixedGasResultEl.textContent = '';
    inlineGasResultEl.textContent = '';
  }
  
  // Calculate savings for the inline display (only on wide screens)
  if (!isNaN(evCost) && !isNaN(gasCost)) {
    const diff = gasCost - evCost;
    const percentSavings = (diff / gasCost) * 100;
    
    if (diff > 0) {
      inlineSavingsResultEl.textContent = `EV saves $${diff.toFixed(2)} (${percentSavings.toFixed(1)}%)`;
    } else if (diff < 0) {
      inlineSavingsResultEl.textContent = `Gas saves $${Math.abs(diff).toFixed(2)} (${Math.abs(percentSavings).toFixed(1)}%)`;
    } else {
      inlineSavingsResultEl.textContent = 'Both options cost the same';
    }
  } else {
    inlineSavingsResultEl.textContent = '';
  }
  
  // Check if we should show/hide the header based on results
  const resultsHeader = document.getElementById('resultsHeader');
  if (fixedEvResultEl.textContent === '' && fixedGasResultEl.textContent === '') {
    resultsHeader.classList.add('opacity-0', '-translate-y-10');
    
    // Also hide chart section if no valid results
    const chartSection = document.getElementById('chartSection');
    chartSection.classList.add('opacity-0', '-translate-y-10');
  } else {
    resultsHeader.classList.remove('opacity-0', '-translate-y-10');
    
    // Update chart if both values are valid
    if (!isNaN(evCost) && !isNaN(gasCost)) {
      window.chart.updateChart(evCost, gasCost, miles);
    }
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