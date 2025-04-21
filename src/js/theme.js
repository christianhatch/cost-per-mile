// Theme modes: 'light', 'dark', 'system'
function setThemeMode(mode) {
  // Store the user's theme preference
  localStorage.setItem('themeMode', mode);
  
  // Update dropdown menu to show current theme
  updateCurrentThemeIndicator(mode);
  
  // Close the dropdown
  closeThemeDropdown();
  
  if (mode === 'system') {
    // Use system preference
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    if (prefersDark) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  } else if (mode === 'dark') {
    document.documentElement.classList.add('dark');
  } else {
    document.documentElement.classList.remove('dark');
  }
}

// Update the current theme indicator in the dropdown button
function updateCurrentThemeIndicator(mode) {
  const iconContainer = document.getElementById('currentThemeIcon');
  const textContainer = document.getElementById('currentThemeText');
  
  // Clear previous icon
  iconContainer.textContent = '';
  
  // Create new icon based on current mode
  let newIcon;
  if (mode === 'light') {
    newIcon = '☀️';  // sun emoji
    textContainer.textContent = 'Light';
  } else if (mode === 'dark') {
    newIcon = '🌙';  // moon emoji
    textContainer.textContent = 'Dark';
  } else {
    newIcon = '💻';  // computer emoji
    textContainer.textContent = 'System';
  }
  
  iconContainer.textContent = newIcon;  // use textContent instead of innerHTML since we're using emojis
  
  // Highlight the active option in dropdown
  document.querySelectorAll('.theme-option').forEach(option => {
    option.classList.remove('bg-gray-100', 'dark:bg-slate-700');
  });
  
  if (mode === 'light') {
    document.getElementById('lightModeBtn').classList.add('bg-gray-100', 'dark:bg-slate-700');
  } else if (mode === 'dark') {
    document.getElementById('darkModeBtn').classList.add('bg-gray-100', 'dark:bg-slate-700');
  } else {
    document.getElementById('systemModeBtn').classList.add('bg-gray-100', 'dark:bg-slate-700');
  }
}

// Toggle theme dropdown
function toggleThemeDropdown() {
  const dropdown = document.getElementById('themeDropdown');
  if (dropdown.classList.contains('hidden')) {
    // Open dropdown
    dropdown.classList.remove('hidden');
    // Add click outside listener to close dropdown
    setTimeout(() => {
      window.addEventListener('click', closeDropdownOnClickOutside);
    }, 10);
  } else {
    closeThemeDropdown();
  }
}

// Close theme dropdown
function closeThemeDropdown() {
  const dropdown = document.getElementById('themeDropdown');
  dropdown.classList.add('hidden');
  window.removeEventListener('click', closeDropdownOnClickOutside);
}

// Close dropdown when clicking outside
function closeDropdownOnClickOutside(event) {
  const dropdown = document.getElementById('themeDropdown');
  const button = document.getElementById('themeMenuButton');
  
  if (!dropdown.contains(event.target) && !button.contains(event.target)) {
    closeThemeDropdown();
  }
}

// Listen for system theme changes
function setupSystemThemeListener() {
  window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', (e) => {
    // Only update if system mode is active
    if (localStorage.getItem('themeMode') === 'system') {
      if (e.matches) {
        document.documentElement.classList.add('dark');
      } else {
        document.documentElement.classList.remove('dark');
      }
    }
  });
}

// Helper function to check dark mode
function isDarkMode() {
  return document.documentElement.classList.contains('dark');
}

// Export functions for use in other files
window.theme = {
  setThemeMode,
  setupSystemThemeListener,
  isDarkMode
}; 