// Shortcut Shelf - Store your shortcuts, commands, and snippets
// All data stored in localStorage

const STORAGE_KEY = 'shortcut-shelf-data';
const STATS_KEY = 'shortcut-shelf-stats';

// Default data structure
const defaultData = {
  shortcuts: [],
  version: 1
};

const defaultStats = {
  totalCopies: 0,
  copyHistory: {}
};

// State
let data = loadData();
let stats = loadStats();
let currentFilter = 'all';
let currentAppFilter = 'all';
let searchQuery = '';

// Load data from localStorage
function loadData() {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      return JSON.parse(stored);
    }
  } catch (e) {
    console.error('Failed to load data:', e);
  }
  return { ...defaultData };
}

function loadStats() {
  try {
    const stored = localStorage.getItem(STATS_KEY);
    if (stored) {
      return JSON.parse(stored);
    }
  } catch (e) {
    console.error('Failed to load stats:', e);
  }
  return { ...defaultStats };
}

// Save data to localStorage
function saveData() {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  } catch (e) {
    console.error('Failed to save data:', e);
  }
}

function saveStats() {
  try {
    localStorage.setItem(STATS_KEY, JSON.stringify(stats));
  } catch (e) {
    console.error('Failed to save stats:', e);
  }
}

// DOM elements
const searchInput = document.getElementById('searchInput');
const addZone = document.getElementById('addZone');
const addToggle = document.getElementById('addToggle');
const addForm = document.getElementById('addForm');
const appInput = document.getElementById('appInput');
const keysInput = document.getElementById('keysInput');
const descInput = document.getElementById('descInput');
const tagsInput = document.getElementById('tagsInput');
const addBtn = document.getElementById('addBtn');
const shelf = document.getElementById('shelf');
const appFilter = document.getElementById('appFilter');
const toast = document.getElementById('toast');

// Category buttons
const catBtns = document.querySelectorAll('.cat-btn');
let selectedCategory = 'keyboard';

// Filter tabs
const filterTabs = document.querySelectorAll('.filter-tab');

// Initialize
function init() {
  renderShelf();
  updateStats();
  updateAppFilter();
  setupEventListeners();
}

function setupEventListeners() {
  // Toggle add form
  addToggle.addEventListener('click', () => {
    addZone.classList.toggle('open');
    if (addZone.classList.contains('open')) {
      appInput.focus();
    }
  });

  // Category selection
  catBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      catBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      selectedCategory = btn.dataset.cat;
    });
  });

  // Add shortcut
  addBtn.addEventListener('click', addShortcut);

  // Enter to add from any input
  [appInput, keysInput, descInput, tagsInput].forEach(input => {
    input.addEventListener('keypress', (e) => {
      if (e.key === 'Enter') {
        addShortcut();
      }
    });
  });

  // Search
  searchInput.addEventListener('input', (e) => {
    searchQuery = e.target.value.toLowerCase();
    renderShelf();
  });

  // Cmd+K to focus search
  document.addEventListener('keydown', (e) => {
    if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
      e.preventDefault();
      searchInput.focus();
      searchInput.select();
    }
  });

  // Filter tabs
  filterTabs.forEach(tab => {
    tab.addEventListener('click', () => {
      filterTabs.forEach(t => t.classList.remove('active'));
      tab.classList.add('active');
      currentFilter = tab.dataset.filter;
      renderShelf();
    });
  });

  // App filter
  appFilter.addEventListener('change', (e) => {
    currentAppFilter = e.target.value;
    renderShelf();
  });
}

function addShortcut() {
  const app = appInput.value.trim();
  const keys = keysInput.value.trim();
  const desc = descInput.value.trim();
  const tagsStr = tagsInput.value.trim();

  if (!keys) {
    showToast('Please enter a shortcut or command', 'error');
    keysInput.focus();
    return;
  }

  if (!desc) {
    showToast('Please describe what it does', 'error');
    descInput.focus();
    return;
  }

  const tags = tagsStr
    ? tagsStr.split(',').map(t => t.trim().toLowerCase()).filter(Boolean)
    : [];

  const shortcut = {
    id: Date.now().toString(),
    app: app || 'General',
    category: selectedCategory,
    keys,
    description: desc,
    tags,
    createdAt: new Date().toISOString()
  };

  data.shortcuts.unshift(shortcut);
  saveData();

  // Clear form
  appInput.value = '';
  keysInput.value = '';
  descInput.value = '';
  tagsInput.value = '';

  // Reset category
  catBtns.forEach(b => b.classList.remove('active'));
  catBtns[0].classList.add('active');
  selectedCategory = 'keyboard';

  renderShelf();
  updateStats();
  updateAppFilter();

  showToast('Shortcut added! 📚');

  // Close add form
  addZone.classList.remove('open');
}

function deleteShortcut(id) {
  data.shortcuts = data.shortcuts.filter(s => s.id !== id);
  saveData();
  renderShelf();
  updateStats();
  updateAppFilter();
  showToast('Shortcut removed');
}

async function copyToClipboard(text, id) {
  try {
    await navigator.clipboard.writeText(text);
    
    // Update stats
    stats.totalCopies++;
    stats.copyHistory[id] = (stats.copyHistory[id] || 0) + 1;
    saveStats();
    updateStats();

    // Visual feedback
    const card = document.querySelector(`[data-id="${id}"]`);
    if (card) {
      card.classList.add('copied');
      setTimeout(() => card.classList.remove('copied'), 1000);
    }

    showToast('Copied to clipboard! 📋');
  } catch (e) {
    showToast('Failed to copy', 'error');
  }
}

function renderShelf() {
  let shortcuts = [...data.shortcuts];

  // Filter by category
  if (currentFilter !== 'all') {
    shortcuts = shortcuts.filter(s => s.category === currentFilter);
  }

  // Filter by app
  if (currentAppFilter !== 'all') {
    shortcuts = shortcuts.filter(s => s.app.toLowerCase() === currentAppFilter.toLowerCase());
  }

  // Search
  if (searchQuery) {
    shortcuts = shortcuts.filter(s => {
      const searchable = [
        s.app,
        s.keys,
        s.description,
        ...s.tags
      ].join(' ').toLowerCase();
      return searchable.includes(searchQuery);
    });
  }

  if (shortcuts.length === 0) {
    if (data.shortcuts.length === 0) {
      shelf.innerHTML = `
        <div class="empty-shelf" id="emptyShelf">
          <div class="empty-icon">📚</div>
          <h3>Your shelf is empty</h3>
          <p>Add your first shortcut above. You'll thank yourself later.</p>
        </div>
      `;
    } else {
      shelf.innerHTML = `
        <div class="empty-shelf">
          <div class="empty-icon">🔍</div>
          <h3>No matches found</h3>
          <p>Try a different search or filter.</p>
        </div>
      `;
    }
    return;
  }

  shelf.innerHTML = shortcuts.map(s => renderCard(s)).join('');

  // Add event listeners to cards
  shelf.querySelectorAll('.copy-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      const id = btn.closest('.shortcut-card').dataset.id;
      const shortcut = data.shortcuts.find(s => s.id === id);
      if (shortcut) {
        copyToClipboard(shortcut.keys, id);
      }
    });
  });

  shelf.querySelectorAll('.delete-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      const id = btn.closest('.shortcut-card').dataset.id;
      if (confirm('Delete this shortcut?')) {
        deleteShortcut(id);
      }
    });
  });
}

function renderCard(shortcut) {
  const typeIcons = {
    keyboard: '⌨️',
    cli: '💻',
    snippet: '📝'
  };

  const tagsHtml = shortcut.tags.length > 0
    ? `<div class="card-tags">${shortcut.tags.map(t => `<span class="card-tag">#${t}</span>`).join('')}</div>`
    : '';

  return `
    <div class="shortcut-card" data-id="${shortcut.id}">
      <div class="card-type">${typeIcons[shortcut.category] || '⌨️'}</div>
      <div class="card-content">
        <div class="card-top">
          <span class="card-app">${escapeHtml(shortcut.app)}</span>
          <code class="card-keys">${escapeHtml(shortcut.keys)}</code>
        </div>
        <div class="card-desc">${escapeHtml(shortcut.description)}</div>
        ${tagsHtml}
      </div>
      <div class="card-actions">
        <button class="action-btn copy copy-btn" title="Copy to clipboard">📋</button>
        <button class="action-btn delete delete-btn" title="Delete">🗑️</button>
      </div>
    </div>
  `;
}

function updateAppFilter() {
  const apps = [...new Set(data.shortcuts.map(s => s.app))].sort();
  
  appFilter.innerHTML = `
    <option value="all">All Apps (${apps.length})</option>
    ${apps.map(app => `<option value="${app}">${app}</option>`).join('')}
  `;
}

function updateStats() {
  const totalShortcuts = data.shortcuts.length;
  const apps = [...new Set(data.shortcuts.map(s => s.app))];
  const totalApps = apps.length;
  const totalCopies = stats.totalCopies;

  // Find most used app
  const appCounts = {};
  data.shortcuts.forEach(s => {
    const copies = stats.copyHistory[s.id] || 0;
    appCounts[s.app] = (appCounts[s.app] || 0) + copies;
  });
  
  let mostUsedApp = '-';
  let maxCopies = 0;
  for (const [app, count] of Object.entries(appCounts)) {
    if (count > maxCopies) {
      maxCopies = count;
      mostUsedApp = app;
    }
  }

  document.getElementById('totalShortcuts').textContent = totalShortcuts;
  document.getElementById('totalApps').textContent = totalApps;
  document.getElementById('totalCopies').textContent = totalCopies;
  document.getElementById('mostUsedApp').textContent = mostUsedApp;

  // Show/hide stats panel
  const statsPanel = document.getElementById('statsPanel');
  statsPanel.style.display = totalShortcuts > 0 ? 'block' : 'none';
}

function showToast(message, type = 'success') {
  toast.textContent = message;
  toast.style.background = type === 'error' ? 'var(--error)' : 'var(--success)';
  toast.classList.add('show');
  
  setTimeout(() => {
    toast.classList.remove('show');
  }, 2000);
}

function escapeHtml(str) {
  const div = document.createElement('div');
  div.textContent = str;
  return div.innerHTML;
}

// Initialize on DOM ready
document.addEventListener('DOMContentLoaded', init);
