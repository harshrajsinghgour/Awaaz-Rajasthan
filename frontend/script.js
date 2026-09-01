// Function to switch between different screens/pages
function showScreen(screenId) {
  // Hide all screens
  const screens = document.querySelectorAll('.page-screen');
  screens.forEach(screen => {
    screen.classList.remove('active-screen');
  });

  // Show the selected screen
  const targetScreen = document.getElementById(screenId);
  if (targetScreen) {
    targetScreen.classList.add('active-screen');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  // Update navigation active highlight
  updateNavHighlight(screenId);
}

// Function to handle active status on navbar items
function updateNavHighlight(screenId) {
  const navItems = document.querySelectorAll('.nav-item');
  navItems.forEach(item => {
    item.classList.remove('active');
  });

  const mobNavItems = document.querySelectorAll('.mob-nav-item');
  mobNavItems.forEach(item => {
    item.classList.remove('active');
  });
}

// Search functionality simulator
function handleSearch() {
  const query = document.getElementById('searchInput').value;
  if (query.trim() !== '') {
    const queryTextElement = document.getElementById('searchQueryText');
    if (queryTextElement) {
      queryTextElement.innerText = `खोजे गए शब्द: "${query}"`;
    }
    showScreen('search-screen');
  } else {
    alert('कृपया खोजने के लिए कुछ लिखें!');
  }
}
