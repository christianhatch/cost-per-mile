// Scroll handling for header appearance
function handleScroll() {
  const scrollPos = window.scrollY;
  const resultsHeader = document.getElementById('resultsHeader');
  
  if (scrollPos > 50) {
    resultsHeader.classList.add('shadow-lg');
    resultsHeader.classList.remove('shadow-md');
  } else {
    resultsHeader.classList.remove('shadow-lg');
    resultsHeader.classList.add('shadow-md');
  }
}

// Initialize the application
function initApp() {
  // Set up theme mode - use 'system' as default if no preference is stored
  const savedThemeMode = localStorage.getItem('themeMode') || 'system';
  window.theme.setThemeMode(savedThemeMode);
  window.theme.setupSystemThemeListener();
  
  // Set up theme menu button click listener
  document.getElementById('themeMenuButton').addEventListener('click', function(e) {
    e.stopPropagation();
    toggleThemeDropdown();
  });
  
  // Set up theme option click listeners
  document.getElementById('lightModeBtn').addEventListener('click', () => window.theme.setThemeMode('light'));
  document.getElementById('darkModeBtn').addEventListener('click', () => window.theme.setThemeMode('dark'));
  document.getElementById('systemModeBtn').addEventListener('click', () => window.theme.setThemeMode('system'));
  
  // Load EV efficiency mode from localStorage
  const savedMode = localStorage.getItem('evEfficiencyMode');
  if (savedMode !== null) {
    evEfficiencyMode = savedMode === 'true';
    document.getElementById('evModeToggle').checked = evEfficiencyMode;
    
    const evEfficiencyLabel = document.getElementById('evEfficiencyLabel');
    evEfficiencyLabel.textContent = evEfficiencyMode 
      ? 'Efficiency (miles per kWh)' 
      : 'Efficiency (Wh per mile)';
  }
  
  // Set up toggle event listener
  document.getElementById('evModeToggle').addEventListener('change', window.calculator.toggleEvMode);
  
  // Load input values from localStorage
  ['evPrice', 'evEfficiency', 'gasPrice', 'mpg', 'miles'].forEach(id => {
    const input = document.getElementById(id);
    // Set default values if no value is stored
    const defaultValue = {
      evPrice: '0.25', // $0.25 per kWh
      evEfficiency: '250', // 250 Wh per mile
      gasPrice: '2.98', // $2.98 per gallon
      mpg: '28', // 28 miles per gallon
      miles: '10' // 10 miles
    }[id];
    
    input.value = localStorage.getItem(id) || defaultValue;
    input.addEventListener('input', () => {
      localStorage.setItem(id, input.value);
      window.calculator.calculate();
    });
  });
  
  // Set up scroll event listener for header appearance
  window.addEventListener('scroll', handleScroll);
  
  // Initial calculation
  window.calculator.calculate();
}

// Register service worker
if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('sw.js');
  });
}

// Prompt to install PWA
let deferredPrompt;

window.addEventListener('beforeinstallprompt', (e) => {
  e.preventDefault();
  deferredPrompt = e;

  const installBtn = document.createElement('button');
  installBtn.textContent = 'Install App';
  installBtn.className = 'fixed bottom-6 right-6 bg-green-600 hover:bg-green-700 text-white px-4 py-3 text-lg font-semibold rounded-full shadow-lg z-50 dark:bg-green-700 dark:hover:bg-green-600';
  installBtn.addEventListener('click', () => {
    deferredPrompt.prompt();
    deferredPrompt.userChoice.then(() => {
      installBtn.remove();
    });
  });

  document.body.appendChild(installBtn);
});

// Initialize the app when the DOM is loaded
window.addEventListener('DOMContentLoaded', initApp); 