// Ship Log - Captain's log for what you shipped
// localStorage-based, no backend

const STORAGE_KEY = 'ship-log-entries';
const TAG_ICONS = {
  shipped: '🚀',
  fixed: '🔧',
  reviewed: '👀',
  wrote: '✍️',
  meeting: '🤝',
  learned: '💡',
  other: '📦',
  '': '📝'
};

let entries = [];
let currentView = 'day';
let searchQuery = '';

// Initialize
document.addEventListener('DOMContentLoaded', () => {
  loadEntries();
  setupEventListeners();
  render();
});

function loadEntries() {
  const stored = localStorage.getItem(STORAGE_KEY);
  entries = stored ? JSON.parse(stored) : [];
}

function saveEntries() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(entries));
}

function setupEventListeners() {
  // Log form
  document.getElementById('log-form').addEventListener('submit', handleSubmit);
  
  // View tabs
  document.querySelectorAll('.view-tab').forEach(tab => {
    tab.addEventListener('click', () => {
      document.querySelector('.view-tab.active').classList.remove('active');
      tab.classList.add('active');
      currentView = tab.dataset.view;
      render();
    });
  });

  // Search
  document.getElementById('search').addEventListener('input', (e) => {
    searchQuery = e.target.value.toLowerCase();
    render();
  });

  // Export
  document.getElementById('export-btn').addEventListener('click', exportForStandup);

  // Keyboard shortcut: Ctrl/Cmd + Enter to submit
  document.getElementById('entry').addEventListener('keydown', (e) => {
    if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') {
      document.getElementById('log-form').dispatchEvent(new Event('submit'));
    }
  });
}

function handleSubmit(e) {
  e.preventDefault();
  
  const entryInput = document.getElementById('entry');
  const projectInput = document.getElementById('project');
  const tagSelect = document.getElementById('tag');

  const text = entryInput.value.trim();
  if (!text) return;

  const entry = {
    id: Date.now(),
    text,
    project: projectInput.value.trim(),
    tag: tagSelect.value,
    timestamp: new Date().toISOString()
  };

  entries.unshift(entry);
  saveEntries();

  // Clear form
  entryInput.value = '';
  projectInput.value = '';
  tagSelect.value = '';
  entryInput.focus();

  showToast('Logged! ⚓');
  render();
}

function deleteEntry(id) {
  entries = entries.filter(e => e.id !== id);
  saveEntries();
  render();
}

function getFilteredEntries() {
  const now = new Date();
  const todayStart = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const weekStart = new Date(todayStart);
  weekStart.setDate(weekStart.getDate() - weekStart.getDay()); // Start of week (Sunday)
  const monthStart = new Date(now.getFullYear(), now.getMonth(), 1);

  let filtered = entries;

  // Filter by view
  switch (currentView) {
    case 'day':
      filtered = entries.filter(e => new Date(e.timestamp) >= todayStart);
      break;
    case 'week':
      filtered = entries.filter(e => new Date(e.timestamp) >= weekStart);
      break;
    case 'month':
      filtered = entries.filter(e => new Date(e.timestamp) >= monthStart);
      break;
    // 'all' shows everything
  }

  // Filter by search
  if (searchQuery) {
    filtered = filtered.filter(e => 
      e.text.toLowerCase().includes(searchQuery) ||
      e.project.toLowerCase().includes(searchQuery)
    );
  }

  return filtered;
}

function groupByDay(entriesList) {
  const groups = {};
  
  entriesList.forEach(entry => {
    const date = new Date(entry.timestamp);
    const dateKey = date.toISOString().split('T')[0];
    if (!groups[dateKey]) {
      groups[dateKey] = [];
    }
    groups[dateKey].push(entry);
  });

  return groups;
}

function formatDate(dateStr) {
  const date = new Date(dateStr);
  const today = new Date();
  const yesterday = new Date(today);
  yesterday.setDate(yesterday.getDate() - 1);

  if (dateStr === today.toISOString().split('T')[0]) {
    return 'Today';
  } else if (dateStr === yesterday.toISOString().split('T')[0]) {
    return 'Yesterday';
  } else {
    return date.toLocaleDateString('en-US', { 
      weekday: 'long',
      month: 'short', 
      day: 'numeric'
    });
  }
}

function formatTime(timestamp) {
  return new Date(timestamp).toLocaleTimeString('en-US', {
    hour: 'numeric',
    minute: '2-digit',
    hour12: true
  });
}

function render() {
  renderEntries();
  renderStats();
  updateProjectSuggestions();
}

function renderEntries() {
  const container = document.getElementById('entries-container');
  const emptyState = document.getElementById('empty-state');
  
  const filtered = getFilteredEntries();
  
  if (filtered.length === 0) {
    container.innerHTML = '';
    emptyState.style.display = 'block';
    return;
  }

  emptyState.style.display = 'none';
  const groups = groupByDay(filtered);
  const sortedDates = Object.keys(groups).sort((a, b) => b.localeCompare(a));

  container.innerHTML = sortedDates.map(dateKey => `
    <div class="day-group">
      <div class="day-header">
        <span class="day-date">${formatDate(dateKey)}</span>
        <span class="day-count">${groups[dateKey].length} ${groups[dateKey].length === 1 ? 'ship' : 'ships'}</span>
      </div>
      <div class="entries-list">
        ${groups[dateKey].map(entry => `
          <div class="entry-item" data-id="${entry.id}">
            <span class="entry-tag">${TAG_ICONS[entry.tag] || TAG_ICONS['']}</span>
            <div class="entry-content">
              <div class="entry-text">${escapeHtml(entry.text)}</div>
              <div class="entry-meta">
                ${entry.project ? `<span class="entry-project">${escapeHtml(entry.project)}</span>` : ''}
                <span class="entry-time">${formatTime(entry.timestamp)}</span>
              </div>
            </div>
            <div class="entry-actions">
              <button class="btn-entry-action delete" onclick="deleteEntry(${entry.id})" title="Delete">✕</button>
            </div>
          </div>
        `).join('')}
      </div>
    </div>
  `).join('');
}

function renderStats() {
  const now = new Date();
  const todayStart = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const weekStart = new Date(todayStart);
  weekStart.setDate(weekStart.getDate() - weekStart.getDay());

  // Count stats
  const todayCount = entries.filter(e => new Date(e.timestamp) >= todayStart).length;
  const weekCount = entries.filter(e => new Date(e.timestamp) >= weekStart).length;
  
  // Calculate streak
  const streak = calculateStreak();

  document.getElementById('stat-today').textContent = todayCount;
  document.getElementById('stat-week').textContent = weekCount;
  document.getElementById('stat-streak').textContent = streak;
  document.getElementById('stat-total').textContent = entries.length;

  renderStreakCalendar();
}

function calculateStreak() {
  if (entries.length === 0) return 0;

  const today = new Date();
  today.setHours(0, 0, 0, 0);
  
  // Get unique days with entries
  const daysWithEntries = new Set();
  entries.forEach(e => {
    const date = new Date(e.timestamp);
    date.setHours(0, 0, 0, 0);
    daysWithEntries.add(date.getTime());
  });

  // Check if today or yesterday has entries (streak must be current)
  const yesterday = new Date(today);
  yesterday.setDate(yesterday.getDate() - 1);
  
  if (!daysWithEntries.has(today.getTime()) && !daysWithEntries.has(yesterday.getTime())) {
    return 0;
  }

  // Count consecutive days going backward
  let streak = 0;
  let checkDate = daysWithEntries.has(today.getTime()) ? new Date(today) : new Date(yesterday);
  
  while (daysWithEntries.has(checkDate.getTime())) {
    streak++;
    checkDate.setDate(checkDate.getDate() - 1);
  }

  return streak;
}

function renderStreakCalendar() {
  const calendar = document.getElementById('streak-calendar');
  const days = [];
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  // Count entries per day for the last 8 weeks
  const entriesPerDay = {};
  entries.forEach(e => {
    const dateKey = new Date(e.timestamp).toISOString().split('T')[0];
    entriesPerDay[dateKey] = (entriesPerDay[dateKey] || 0) + 1;
  });

  // Generate last 56 days (8 weeks)
  for (let i = 55; i >= 0; i--) {
    const date = new Date(today);
    date.setDate(date.getDate() - i);
    const dateKey = date.toISOString().split('T')[0];
    const count = entriesPerDay[dateKey] || 0;
    
    let level = '';
    if (count >= 5) level = 'level-4';
    else if (count >= 3) level = 'level-3';
    else if (count >= 2) level = 'level-2';
    else if (count >= 1) level = 'level-1';

    const isToday = i === 0 ? 'today' : '';
    const title = `${date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}: ${count} ships`;
    
    days.push(`<div class="cal-day ${level} ${isToday}" title="${title}"></div>`);
  }

  calendar.innerHTML = days.join('');
}

function updateProjectSuggestions() {
  const projects = [...new Set(entries.map(e => e.project).filter(Boolean))];
  const datalist = document.getElementById('project-suggestions');
  datalist.innerHTML = projects.map(p => `<option value="${escapeHtml(p)}">`).join('');
}

function exportForStandup() {
  const filtered = getFilteredEntries();
  if (filtered.length === 0) {
    showToast('Nothing to export!', 'info');
    return;
  }

  const groups = groupByDay(filtered);
  const sortedDates = Object.keys(groups).sort((a, b) => b.localeCompare(a));

  let text = '';
  sortedDates.forEach(dateKey => {
    text += `${formatDate(dateKey)}:\n`;
    groups[dateKey].forEach(entry => {
      const project = entry.project ? ` [${entry.project}]` : '';
      text += `• ${entry.text}${project}\n`;
    });
    text += '\n';
  });

  navigator.clipboard.writeText(text.trim()).then(() => {
    showToast('Copied to clipboard! 📋');
  }).catch(() => {
    showToast('Failed to copy', 'info');
  });
}

function escapeHtml(text) {
  const div = document.createElement('div');
  div.textContent = text;
  return div.innerHTML;
}

function showToast(message, type = 'success') {
  const toast = document.getElementById('toast');
  toast.textContent = message;
  toast.className = 'toast' + (type === 'info' ? ' info' : '');
  toast.style.display = 'block';
  
  setTimeout(() => {
    toast.style.display = 'none';
  }, 2000);
}

// Make deleteEntry available globally
window.deleteEntry = deleteEntry;
