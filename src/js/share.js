// Function to generate a shareable URL with current parameters
function generateShareUrl() {
  const params = new URLSearchParams();
  
  // Add all input values to URL parameters
  const inputs = ['evPrice', 'evEfficiency', 'gasPrice', 'mpg', 'miles'];
  inputs.forEach(id => {
    const value = document.getElementById(id).value;
    if (value) {
      params.append(id, value);
    }
  });
  
  // Add EV efficiency mode
  params.append('evMode', evEfficiencyMode);
  
  // Add theme mode
  params.append('theme', localStorage.getItem('themeMode') || 'system');
  
  // Return the full URL with parameters
  return `${window.location.origin}${window.location.pathname}?${params.toString()}`;
}

// Function to parse URL parameters and update the UI
function parseUrlParameters() {
  const params = new URLSearchParams(window.location.search);
  
  // Update input values from URL parameters
  const inputs = ['evPrice', 'evEfficiency', 'gasPrice', 'mpg', 'miles'];
  inputs.forEach(id => {
    const value = params.get(id);
    if (value) {
      document.getElementById(id).value = value;
    }
  });
  
  // Update EV efficiency mode
  const evMode = params.get('evMode');
  if (evMode !== null) {
    const newMode = evMode === 'true';
    if (newMode !== evEfficiencyMode) {
      window.calculator.toggleEvMode();
    }
  }
  
  // Update theme mode
  const theme = params.get('theme');
  if (theme) {
    window.theme.setThemeMode(theme);
  }
  
  // Recalculate after updating values
  window.calculator.calculate();
}

// Function to copy URL to clipboard and show feedback
async function copyToClipboard() {
  const url = generateShareUrl();
  try {
    await navigator.clipboard.writeText(url);
    
    // Show success feedback
    const shareButton = document.getElementById('shareButton');
    const originalText = shareButton.innerHTML;
    shareButton.innerHTML = `
      <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
      </svg>
      <span>Copied!</span>
    `;
    
    // Reset button after 2 seconds
    setTimeout(() => {
      shareButton.innerHTML = originalText;
    }, 2000);
  } catch (err) {
    console.error('Failed to copy URL:', err);
    alert('Failed to copy URL to clipboard. Please try again.');
  }
}

// Initialize share functionality
function initShare() {
  // Add click handler to share button
  document.getElementById('shareButton').addEventListener('click', copyToClipboard);
  
  // Parse URL parameters on page load
  if (window.location.search) {
    parseUrlParameters();
  }
}

// Export functions for use in other files
window.share = {
  initShare
}; 