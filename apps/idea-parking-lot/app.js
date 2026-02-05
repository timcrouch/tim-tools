// Idea Parking Lot - Quick capture for brain interrupts
// Built by Giterdone at 3am

const STORAGE_KEY = 'idea-parking-lot';
const TAG_ICONS = {
  product: '💡',
  code: '💻',
  business: '📈',
  content: '✍️',
  personal: '🏠',
  random: '🎲'
};

const SNARKY_NOTES = [
  "The best ideas come when you're doing something else.",
  "Your brain has no respect for your todo list.",
  "Ideas are like cats — they show up when they want.",
  "The shower would be jealous of this parking lot.",
  "Capture now, judge later. (That's the rule.)",
  "Every startup began as an interruption.",
  "Your future self will thank you. Maybe.",
  "Ideas have a half-life. Parking extends it.",
  "Better parked than forgotten in 3 seconds.",
  "The muse doesn't check your calendar.",
];

let state = {
  ideas: [],
  archived: [],
  selectedTag: 'random',
  filterTag: 'all',
  searchQuery: '',
  stats: {
    totalParked: 0,
    actedOn: 0
  }
};

// Initialize
document.addEventListener('DOMContentLoaded', () => {
  loadState();
  bindEvents();
  render();
  updateStats();
  
  // Focus input on load
  document.getElementById('ideaInput').focus();
});

function loadState() {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      const parsed = JSON.parse(saved);
      state = { ...state, ...parsed };
    }
  } catch (e) {
    console.error('Failed to load state:', e);
  }
}

function saveState() {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  } catch (e) {
    console.error('Failed to save state:', e);
  }
}

function bindEvents() {
  // Input enter key
  const input = document.getElementById('ideaInput');
  input.addEventListener('keydown', (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      parkIdea();
    }
  });

  // Park button
  document.getElementById('parkBtn').addEventListener('click', parkIdea);

  // Tag selector
  document.querySelectorAll('.tag-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      document.querySelectorAll('.tag-btn').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      state.selectedTag = btn.dataset.tag;
    });
  });

  // Filter tabs
  document.querySelectorAll('.filter-tab').forEach(tab => {
    tab.addEventListener('click', () => {
      document.querySelectorAll('.filter-tab').forEach(t => t.classList.remove('active'));
      tab.classList.add('active');
      state.filterTag = tab.dataset.filter;
      render();
    });
  });

  // Search
  document.getElementById('searchInput').addEventListener('input', (e) => {
    state.searchQuery = e.target.value.toLowerCase();
    render();
  });

  // Archive toggle
  document.getElementById('archiveToggle').addEventListener('click', () => {
    document.getElementById('archiveSection').classList.toggle('open');
  });

  // Global keyboard shortcuts
  document.addEventListener('keydown', (e) => {
    // Ctrl/Cmd + K to focus input
    if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
      e.preventDefault();
      input.focus();
      input.select();
    }
  });
}

function parkIdea() {
  const input = document.getElementById('ideaInput');
  const text = input.value.trim();
  
  if (!text) {
    input.classList.add('shake');
    setTimeout(() => input.classList.remove('shake'), 500);
    return;
  }

  const idea = {
    id: Date.now().toString(36) + Math.random().toString(36).substr(2, 5),
    text,
    tag: state.selectedTag,
    createdAt: new Date().toISOString(),
    parkedAt: new Date().toISOString()
  };

  state.ideas.unshift(idea);
  state.stats.totalParked++;
  
  input.value = '';
  input.focus();
  
  saveState();
  render();
  updateStats();
}

function markActed(id) {
  const index = state.ideas.findIndex(i => i.id === id);
  if (index === -1) return;

  const idea = state.ideas[index];
  
  // Animate out
  const card = document.querySelector(`[data-id="${id}"]`);
  if (card) {
    card.classList.add('driving-away');
    setTimeout(() => {
      idea.actedOn = true;
      idea.resolvedAt = new Date().toISOString();
      state.archived.unshift(idea);
      state.ideas.splice(index, 1);
      state.stats.actedOn++;
      
      saveState();
      render();
      updateStats();
    }, 500);
  }
}

function archiveIdea(id) {
  const index = state.ideas.findIndex(i => i.id === id);
  if (index === -1) return;

  const idea = state.ideas[index];
  
  const card = document.querySelector(`[data-id="${id}"]`);
  if (card) {
    card.classList.add('driving-away');
    setTimeout(() => {
      idea.archived = true;
      idea.resolvedAt = new Date().toISOString();
      state.archived.unshift(idea);
      state.ideas.splice(index, 1);
      
      saveState();
      render();
      updateStats();
    }, 500);
  }
}

function deleteIdea(id) {
  const index = state.ideas.findIndex(i => i.id === id);
  if (index === -1) return;

  const card = document.querySelector(`[data-id="${id}"]`);
  if (card) {
    card.classList.add('driving-away');
    setTimeout(() => {
      state.ideas.splice(index, 1);
      saveState();
      render();
      updateStats();
    }, 500);
  }
}

function restoreIdea(id) {
  const index = state.archived.findIndex(i => i.id === id);
  if (index === -1) return;

  const idea = state.archived[index];
  delete idea.actedOn;
  delete idea.archived;
  delete idea.resolvedAt;
  
  state.ideas.unshift(idea);
  state.archived.splice(index, 1);
  
  saveState();
  render();
  updateStats();
}

function getFilteredIdeas() {
  return state.ideas.filter(idea => {
    // Tag filter
    if (state.filterTag !== 'all' && idea.tag !== state.filterTag) {
      return false;
    }
    
    // Search filter
    if (state.searchQuery && !idea.text.toLowerCase().includes(state.searchQuery)) {
      return false;
    }
    
    return true;
  });
}

function formatRelativeTime(dateStr) {
  const date = new Date(dateStr);
  const now = new Date();
  const diffMs = now - date;
  const diffMins = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMins / 60);
  const diffDays = Math.floor(diffHours / 24);

  if (diffMins < 1) return 'just now';
  if (diffMins < 60) return `${diffMins}m ago`;
  if (diffHours < 24) return `${diffHours}h ago`;
  if (diffDays < 7) return `${diffDays}d ago`;
  
  return date.toLocaleDateString();
}

function render() {
  const lot = document.getElementById('parkingLot');
  const emptyLot = document.getElementById('emptyLot');
  const filtered = getFilteredIdeas();

  if (filtered.length === 0) {
    lot.innerHTML = '';
    lot.appendChild(emptyLot);
    emptyLot.style.display = 'flex';
    
    if (state.ideas.length > 0 && filtered.length === 0) {
      emptyLot.querySelector('p').textContent = 'No ideas match your filter.';
      emptyLot.querySelector('.empty-subtext').textContent = '(Try widening your search.)';
    } else {
      emptyLot.querySelector('p').textContent = "Lot's empty. Your brain must be focused.";
      emptyLot.querySelector('.empty-subtext').textContent = "(That won't last long.)";
    }
  } else {
    emptyLot.style.display = 'none';
    
    lot.innerHTML = filtered.map(idea => `
      <div class="idea-card" data-id="${idea.id}">
        <span class="idea-tag">${TAG_ICONS[idea.tag] || '🎲'}</span>
        <div class="idea-content">
          <p class="idea-text">${escapeHtml(idea.text)}</p>
          <div class="idea-meta">
            <span>Parked ${formatRelativeTime(idea.parkedAt)}</span>
          </div>
        </div>
        <div class="idea-actions">
          <button class="action-btn acted" onclick="markActed('${idea.id}')" title="Mark as acted on">✅</button>
          <button class="action-btn archive" onclick="archiveIdea('${idea.id}')" title="Archive (maybe later)">📦</button>
          <button class="action-btn delete" onclick="deleteIdea('${idea.id}')" title="Delete forever">🗑️</button>
        </div>
      </div>
    `).join('');
  }

  // Render archive
  renderArchive();
}

function renderArchive() {
  const section = document.getElementById('archiveSection');
  const list = document.getElementById('archiveList');
  const count = document.getElementById('archiveCount');

  if (state.archived.length === 0) {
    section.style.display = 'none';
    return;
  }

  section.style.display = 'block';
  count.textContent = `(${state.archived.length})`;

  list.innerHTML = state.archived.slice(0, 20).map(idea => `
    <div class="archive-item ${idea.actedOn ? 'acted-on' : 'archived'}">
      <span>${TAG_ICONS[idea.tag] || '🎲'} ${escapeHtml(idea.text.substring(0, 50))}${idea.text.length > 50 ? '...' : ''}</span>
      <button class="restore-btn" onclick="restoreIdea('${idea.id}')">Restore</button>
    </div>
  `).join('');
}

function updateStats() {
  document.getElementById('totalParked').textContent = state.stats.totalParked;
  document.getElementById('actedOn').textContent = state.stats.actedOn;

  // Calculate top category
  const tagCounts = {};
  state.ideas.forEach(idea => {
    tagCounts[idea.tag] = (tagCounts[idea.tag] || 0) + 1;
  });
  
  const topTag = Object.entries(tagCounts)
    .sort((a, b) => b[1] - a[1])[0];
  
  document.getElementById('topCategory').textContent = topTag 
    ? TAG_ICONS[topTag[0]] 
    : '-';

  // Oldest idea
  if (state.ideas.length > 0) {
    const oldest = state.ideas[state.ideas.length - 1];
    const days = Math.floor((new Date() - new Date(oldest.parkedAt)) / (1000 * 60 * 60 * 24));
    document.getElementById('oldestIdea').textContent = days === 0 ? 'Today' : `${days}d`;
  } else {
    document.getElementById('oldestIdea').textContent = '-';
  }

  // Random snarky note
  const note = SNARKY_NOTES[Math.floor(Math.random() * SNARKY_NOTES.length)];
  document.getElementById('statsNote').textContent = note;
}

function escapeHtml(text) {
  const div = document.createElement('div');
  div.textContent = text;
  return div.innerHTML;
}

// Expose functions for onclick handlers
window.markActed = markActed;
window.archiveIdea = archiveIdea;
window.deleteIdea = deleteIdea;
window.restoreIdea = restoreIdea;
