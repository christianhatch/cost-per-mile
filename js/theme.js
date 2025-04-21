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
  iconContainer.innerHTML = '';
  
  // Create new icon based on current mode
  let newIcon;
  if (mode === 'light') {
    newIcon = `<svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-yellow-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
    </svg>`;
    textContainer.textContent = 'Light';
  } else if (mode === 'dark') {
    newIcon = `<svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-indigo-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
    </svg>`;
    textContainer.textContent = 'Dark';
  } else {
    newIcon = `<svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 3v2m6-2v2M9 19v2m6-2v2M5 9H3m2 6H3m18-6h-2m2 6h-2M7 19h10a2 2 0 002-2V7a2 2 0 00-2-2H7a2 2 0 00-2 2v10a2 2 0 002 2z" />
    </svg>`;
    textContainer.textContent = 'System';
  }
  
  iconContainer.innerHTML = newIcon;
  
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