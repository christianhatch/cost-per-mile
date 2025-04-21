// Price lock functionality
document.addEventListener('DOMContentLoaded', () => {
    const evPriceLock = document.getElementById('evPriceLock');
    const gasPriceLock = document.getElementById('gasPriceLock');
    const evPriceInput = document.getElementById('evPrice');
    const gasPriceInput = document.getElementById('gasPrice');
    const evEfficiencyInput = document.getElementById('evEfficiency');
    const mpgInput = document.getElementById('mpg');

    // Function to calculate equivalent price
    function calculateEquivalentPrice(lockedInput, unlockedInput) {
        const evEfficiency = parseFloat(evEfficiencyInput.value);
        const mpg = parseFloat(mpgInput.value);
        
        if (isNaN(evEfficiency) || isNaN(mpg)) return;

        // Convert Wh/mi to kWh/mi
        const evEfficiencyKWh = evEfficiency / 1000;

        if (lockedInput === evPriceInput) {
            // Calculate equivalent electricity price based on gas price
            const gasPrice = parseFloat(unlockedInput.value);
            if (isNaN(gasPrice)) return;
            
            // For 1 mile:
            // Gas cost = gasPrice / mpg
            // EV cost = evPrice * evEfficiencyKWh
            // Set them equal: gasPrice / mpg = evPrice * evEfficiencyKWh
            // Therefore: evPrice = (gasPrice / mpg) / evEfficiencyKWh
            const equivalentEvPrice = (gasPrice / mpg) / evEfficiencyKWh;
            evPriceInput.value = equivalentEvPrice.toFixed(4);
        } else {
            // Calculate equivalent gas price based on electricity price
            const evPrice = parseFloat(unlockedInput.value);
            if (isNaN(evPrice)) return;
            
            // For 1 mile:
            // Gas cost = gasPrice / mpg
            // EV cost = evPrice * evEfficiencyKWh
            // Set them equal: gasPrice / mpg = evPrice * evEfficiencyKWh
            // Therefore: gasPrice = evPrice * evEfficiencyKWh * mpg
            const equivalentGasPrice = evPrice * evEfficiencyKWh * mpg;
            gasPriceInput.value = equivalentGasPrice.toFixed(4);
        }

        // Update all calculations
        window.calculator.update();
    }

    // Function to update lock states
    function updateLockStates(lockedInput, unlockedInput) {
        // Update unlocked input (now disabled)
        unlockedInput.disabled = true;
        unlockedInput.classList.add('opacity-50');
        unlockedInput.classList.remove('focus:ring-green-500', 'focus:ring-red-500');
        
        // Update locked input (now enabled)
        lockedInput.disabled = false;
        lockedInput.classList.remove('opacity-50');
        if (lockedInput === evPriceInput) {
            lockedInput.classList.add('focus:ring-green-500');
        } else {
            lockedInput.classList.add('focus:ring-red-500');
        }

        // Calculate initial equivalent price
        calculateEquivalentPrice(lockedInput, unlockedInput);
    }

    // Function to reset lock states
    function resetLockStates() {
        [evPriceInput, gasPriceInput].forEach(input => {
            input.disabled = false;
            input.classList.remove('opacity-50');
            if (input === evPriceInput) {
                input.classList.add('focus:ring-green-500');
            } else {
                input.classList.add('focus:ring-red-500');
            }
        });

        // Update all calculations
        window.calculator.update();
    }

    // Function to update lock button appearance
    function updateLockButton(button, isLocked) {
        button.textContent = isLocked ? '🔒' : '🔓';
        button.classList.toggle('text-green-500', isLocked);
        button.classList.toggle('text-red-500', isLocked);
    }

    // Event listeners for lock buttons
    evPriceLock.addEventListener('click', () => {
        const isLocked = evPriceLock.textContent === '🔓';
        if (isLocked) {
            updateLockStates(evPriceInput, gasPriceInput);
            updateLockButton(evPriceLock, true);
            updateLockButton(gasPriceLock, false);
        } else {
            resetLockStates();
            updateLockButton(evPriceLock, false);
        }
    });

    gasPriceLock.addEventListener('click', () => {
        const isLocked = gasPriceLock.textContent === '🔓';
        if (isLocked) {
            updateLockStates(gasPriceInput, evPriceInput);
            updateLockButton(gasPriceLock, true);
            updateLockButton(evPriceLock, false);
        } else {
            resetLockStates();
            updateLockButton(gasPriceLock, false);
        }
    });

    // Add input event listeners for price calculations
    evPriceInput.addEventListener('input', () => {
        if (gasPriceInput.disabled) {
            calculateEquivalentPrice(gasPriceInput, evPriceInput);
        } else {
            window.calculator.update();
        }
    });

    gasPriceInput.addEventListener('input', () => {
        if (evPriceInput.disabled) {
            calculateEquivalentPrice(evPriceInput, gasPriceInput);
        } else {
            window.calculator.update();
        }
    });

    // Add input event listeners for efficiency changes
    evEfficiencyInput.addEventListener('input', () => {
        if (evPriceInput.disabled || gasPriceInput.disabled) {
            const lockedInput = evPriceInput.disabled ? evPriceInput : gasPriceInput;
            const unlockedInput = evPriceInput.disabled ? gasPriceInput : evPriceInput;
            calculateEquivalentPrice(lockedInput, unlockedInput);
        } else {
            window.calculator.update();
        }
    });

    mpgInput.addEventListener('input', () => {
        if (evPriceInput.disabled || gasPriceInput.disabled) {
            const lockedInput = evPriceInput.disabled ? evPriceInput : gasPriceInput;
            const unlockedInput = evPriceInput.disabled ? gasPriceInput : evPriceInput;
            calculateEquivalentPrice(lockedInput, unlockedInput);
        } else {
            window.calculator.update();
        }
    });
}); 