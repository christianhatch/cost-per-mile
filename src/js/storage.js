// Local storage keys
const STORAGE_KEYS = {
    EV_EFFICIENCY: 'evEfficiency',
    EV_PRICE: 'evPrice',
    GAS_MPG: 'mpg',
    GAS_PRICE: 'gasPrice',
    MILES: 'miles',
    EV_MODE: 'evMode'
};

// Function to save a value to local storage
function saveToStorage(key, value) {
    try {
        localStorage.setItem(key, value);
    } catch (error) {
        console.error('Error saving to local storage:', error);
    }
}

// Function to load a value from local storage
function loadFromStorage(key, defaultValue) {
    try {
        const value = localStorage.getItem(key);
        return value !== null ? value : defaultValue;
    } catch (error) {
        console.error('Error loading from local storage:', error);
        return defaultValue;
    }
}

// Function to trigger calculations
function triggerCalculations() {
    // Get all input values
    const evEfficiency = parseFloat(document.getElementById('evEfficiency').value) || 0;
    const evPrice = parseFloat(document.getElementById('evPrice').value) || 0;
    const mpg = parseFloat(document.getElementById('mpg').value) || 0;
    const gasPrice = parseFloat(document.getElementById('gasPrice').value) || 0;
    const miles = parseFloat(document.getElementById('miles').value) || 1;

    // Calculate costs
    const evCostPerMile = (evPrice * (evEfficiency / 1000));
    const gasCostPerMile = (gasPrice / mpg);

    // Update cost per mile display
    document.getElementById('evResult').textContent = `EV: $${evCostPerMile.toFixed(4)}/mi`;
    document.getElementById('gasResult').textContent = `Gas: $${gasCostPerMile.toFixed(4)}/mi`;
    
    const savings = Math.abs(evCostPerMile - gasCostPerMile);
    const cheaper = evCostPerMile < gasCostPerMile ? 'EV' : 'Gas';
    document.getElementById('savingsResult').textContent = `${cheaper} saves $${savings.toFixed(4)}/mi`;

    // Update chart
    if (window.chart && window.chart.updateChart) {
        window.chart.updateChart(evEfficiency, mpg, evPrice, gasPrice, miles);
    }
}

// Function to initialize inputs with saved values
function initializeInputs() {
    // Load and set EV efficiency
    const evEfficiency = loadFromStorage(STORAGE_KEYS.EV_EFFICIENCY, '');
    document.getElementById('evEfficiency').value = evEfficiency;

    // Load and set EV price
    const evPrice = loadFromStorage(STORAGE_KEYS.EV_PRICE, '');
    document.getElementById('evPrice').value = evPrice;

    // Load and set gas MPG
    const mpg = loadFromStorage(STORAGE_KEYS.GAS_MPG, '');
    document.getElementById('mpg').value = mpg;

    // Load and set gas price
    const gasPrice = loadFromStorage(STORAGE_KEYS.GAS_PRICE, '');
    document.getElementById('gasPrice').value = gasPrice;

    // Load and set miles
    const miles = loadFromStorage(STORAGE_KEYS.MILES, '1');
    document.getElementById('miles').value = miles;

    // Load and set EV mode toggle
    const evMode = loadFromStorage(STORAGE_KEYS.EV_MODE, 'false');
    document.getElementById('evModeToggle').checked = evMode === 'true';

    // Trigger calculations after a short delay to ensure all values are set
    setTimeout(triggerCalculations, 100);
}

// Function to set up input event listeners
function setupStorageListeners() {
    // EV Efficiency input
    document.getElementById('evEfficiency').addEventListener('input', (e) => {
        saveToStorage(STORAGE_KEYS.EV_EFFICIENCY, e.target.value);
        triggerCalculations();
    });

    // EV Price input
    document.getElementById('evPrice').addEventListener('input', (e) => {
        saveToStorage(STORAGE_KEYS.EV_PRICE, e.target.value);
        triggerCalculations();
    });

    // Gas MPG input
    document.getElementById('mpg').addEventListener('input', (e) => {
        saveToStorage(STORAGE_KEYS.GAS_MPG, e.target.value);
        triggerCalculations();
    });

    // Gas Price input
    document.getElementById('gasPrice').addEventListener('input', (e) => {
        saveToStorage(STORAGE_KEYS.GAS_PRICE, e.target.value);
        triggerCalculations();
    });

    // Miles input
    document.getElementById('miles').addEventListener('input', (e) => {
        saveToStorage(STORAGE_KEYS.MILES, e.target.value);
        triggerCalculations();
    });

    // EV Mode toggle
    document.getElementById('evModeToggle').addEventListener('change', (e) => {
        saveToStorage(STORAGE_KEYS.EV_MODE, e.target.checked);
        triggerCalculations();
    });
}

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    initializeInputs();
    setupStorageListeners();
}); 