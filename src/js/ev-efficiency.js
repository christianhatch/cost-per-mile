document.addEventListener('DOMContentLoaded', () => {
    const evModeToggle = document.getElementById('evModeToggle');
    const evEfficiencyInput = document.getElementById('evEfficiency');
    const evEfficiencyLabel = document.getElementById('evEfficiencyLabel');

    // Function to update the display based on toggle state
    function updateDisplay(isMilesPerKWh) {
        if (isMilesPerKWh) {
            evEfficiencyLabel.textContent = 'Efficiency (mi/kWh)';
        } else {
            evEfficiencyLabel.textContent = 'Efficiency (Wh/mi)';
        }
    }

    // Function to convert between units
    function convertEfficiency(value, toMilesPerKWh) {
        if (toMilesPerKWh) {
            // Convert from Wh/mi to mi/kWh
            return 1000 / value;
        } else {
            // Convert from mi/kWh to Wh/mi
            return 1000 / value;
        }
    }

    // Event listener for toggle
    evModeToggle.addEventListener('change', () => {
        const currentValue = parseFloat(evEfficiencyInput.value);
        if (!isNaN(currentValue)) {
            const newValue = convertEfficiency(currentValue, evModeToggle.checked);
            evEfficiencyInput.value = newValue.toFixed(2);
        }
        updateDisplay(evModeToggle.checked);
    });

    // Initialize display
    updateDisplay(evModeToggle.checked);
}); 