// Where Was I? - Context Switching Saver
// Because "where was I?" is the most expensive question in software development.

const STORAGE_KEY = 'where-was-i-contexts';

// State
let contexts = [];
let currentFilter = 'active';

// DOM Elements
const saveForm = document.getElementById('save-form');
const contextsList = document.getElementById('contexts-list');
const emptyState = document.getElementById('empty-state');
const projectInput = document.getElementById('project');
const projectSuggestions = document.getElementById('project-suggestions');
const filterButtons = document.querySelectorAll('.filter-btn');

// Initialize
document.addEventListener('DOMContentLoaded', () => {
  loadContexts();
  renderContexts();
  updateStats();
  updateProjectSuggestions();
  setupEventListeners();
});

function setupEventListeners() {
  // Save form
  saveForm.addEventListener('submit', handleSave);

  // Filter buttons
  filterButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      filterButtons.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      currentFilter = btn.dataset.filter;
      renderContexts();
    });
  });
}

// Storage
function loadContexts() {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    contexts = stored ? JSON.parse(stored) : [];
  } catch (e) {
    console.error('Failed to load contexts:', e);
    contexts = [];
  }
}

function saveContexts() {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(contexts));
  } catch (e) {
    console.error('Failed to save contexts:', e);
  }
}

// Handle save
function handleSave(e) {
  e.preventDefault();

  const project = document.getElementById('project').value.trim();
  const doing = document.getElementById('doing').value.trim();
  const state = document.getElementById('state').value.trim();
  const next = document.getElementById('next').value.trim();
  const priority = document.getElementById('priority').value;

  if (!doing && !state && !next) {
    showToast('Add at least one detail about what you were doing!', 'warning');
    return;
  }

  const context = {
    id: generateId(),
    project: project || 'Unspecified',
    doing,
    state,
    next,
    priority,
    createdAt: new Date().toISOString(),
    status: 'active', // active, resumed, abandoned
    resumedAt: null,
  };

  contexts.unshift(context);
  saveContexts();
  renderContexts();
  updateStats();
  updateProjectSuggestions();

  // Reset form
  saveForm.reset();
  document.getElementById('priority').value = 'normal';

  showToast('Context saved! Now go handle that interruption. 🚀');
}

// Render contexts
function renderContexts() {
  const filtered = contexts.filter(ctx => {
    if (currentFilter === 'active') return ctx.status === 'active';
    if (currentFilter === 'resumed') return ctx.status === 'resumed';
    return true;
  });

  if (filtered.length === 0) {
    contextsList.innerHTML = '';
    emptyState.style.display = 'block';
    
    // Update empty state message based on filter
    const emptyH3 = emptyState.querySelector('h3');
    const emptyP = emptyState.querySelector('p');
    
    if (currentFilter === 'resumed') {
      emptyH3.textContent = 'No restored contexts';
      emptyP.textContent = 'Contexts you\'ve returned to will appear here.';
    } else if (currentFilter === 'active') {
      emptyH3.textContent = 'No active contexts';
      emptyP.textContent = 'Save your mental state above when you get interrupted.';
    } else {
      emptyH3.textContent = 'No saved contexts';
      emptyP.textContent = 'Next time you get interrupted, save your mental state above.';
    }
    return;
  }

  emptyState.style.display = 'none';
  contextsList.innerHTML = filtered.map(ctx => renderContextCard(ctx)).join('');

  // Attach event listeners to buttons
  contextsList.querySelectorAll('[data-action]').forEach(btn => {
    btn.addEventListener('click', handleContextAction);
  });
}

function renderContextCard(ctx) {
  const timeAgo = formatTimeAgo(ctx.createdAt);
  const priorityClass = ctx.priority === 'high' ? 'high-priority' : '';
  const resumedClass = ctx.status === 'resumed' ? 'resumed' : '';
  
  const priorityBadge = ctx.priority === 'high' 
    ? '<span class="priority-badge high">HIGH</span>'
    : ctx.priority === 'low' 
    ? '<span class="priority-badge low">LOW</span>'
    : '';

  const resumedInfo = ctx.status === 'resumed' && ctx.resumedAt
    ? `<span class="context-field-label"> • Resumed ${formatTimeAgo(ctx.resumedAt)}</span>`
    : '';

  return `
    <div class="context-card ${priorityClass} ${resumedClass}" data-id="${ctx.id}">
      <div class="context-header">
        <div>
          <span class="context-project">${escapeHtml(ctx.project)}</span>
          ${priorityBadge}
        </div>
        <span class="context-time">${timeAgo}${resumedInfo}</span>
      </div>
      <div class="context-body">
        ${ctx.doing ? `
          <div class="context-field">
            <div class="context-field-label">What I was doing</div>
            <div class="context-field-value">${escapeHtml(ctx.doing)}</div>
          </div>
        ` : ''}
        ${ctx.state ? `
          <div class="context-field">
            <div class="context-field-label">Where I was</div>
            <div class="context-field-value">${escapeHtml(ctx.state)}</div>
          </div>
        ` : ''}
        ${ctx.next ? `
          <div class="context-field">
            <div class="context-field-label">Next step</div>
            <div class="context-field-value">${escapeHtml(ctx.next)}</div>
          </div>
        ` : ''}
      </div>
      <div class="context-actions">
        ${ctx.status === 'active' ? `
          <button class="btn-action primary" data-action="resume" data-id="${ctx.id}">
            ✅ I'm Back
          </button>
          <button class="btn-action" data-action="copy" data-id="${ctx.id}">
            📋 Copy
          </button>
          <button class="btn-action danger" data-action="abandon" data-id="${ctx.id}">
            🗑️ Abandon
          </button>
        ` : `
          <button class="btn-action" data-action="reactivate" data-id="${ctx.id}">
            🔄 Reactivate
          </button>
          <button class="btn-action danger" data-action="delete" data-id="${ctx.id}">
            🗑️ Delete
          </button>
        `}
      </div>
    </div>
  `;
}

function handleContextAction(e) {
  const action = e.target.dataset.action;
  const id = e.target.dataset.id;
  const ctx = contexts.find(c => c.id === id);
  
  if (!ctx) return;

  switch (action) {
    case 'resume':
      ctx.status = 'resumed';
      ctx.resumedAt = new Date().toISOString();
      showToast('Welcome back! Context restored. 🧠');
      break;
    case 'abandon':
      ctx.status = 'abandoned';
      showToast('Context abandoned. It happens. 🤷');
      break;
    case 'reactivate':
      ctx.status = 'active';
      ctx.resumedAt = null;
      showToast('Context reactivated! 🔄');
      break;
    case 'delete':
      contexts = contexts.filter(c => c.id !== id);
      showToast('Context deleted.');
      break;
    case 'copy':
      const text = formatContextForCopy(ctx);
      navigator.clipboard.writeText(text).then(() => {
        showToast('Copied to clipboard! 📋');
      });
      return;
  }

  saveContexts();
  renderContexts();
  updateStats();
}

function formatContextForCopy(ctx) {
  let text = `Project: ${ctx.project}\n`;
  if (ctx.doing) text += `What I was doing: ${ctx.doing}\n`;
  if (ctx.state) text += `Where I was: ${ctx.state}\n`;
  if (ctx.next) text += `Next step: ${ctx.next}\n`;
  text += `Saved: ${new Date(ctx.createdAt).toLocaleString()}`;
  return text;
}

// Update stats
function updateStats() {
  const total = contexts.length;
  const resumed = contexts.filter(c => c.status === 'resumed').length;
  const abandoned = contexts.filter(c => c.status === 'abandoned').length;

  document.getElementById('stat-total').textContent = total;
  document.getElementById('stat-resumed').textContent = resumed;
  document.getElementById('stat-abandoned').textContent = abandoned;

  // Find most interrupted project
  const projectCounts = {};
  contexts.forEach(ctx => {
    const proj = ctx.project || 'Unspecified';
    projectCounts[proj] = (projectCounts[proj] || 0) + 1;
  });

  const topProject = Object.entries(projectCounts)
    .sort((a, b) => b[1] - a[1])[0];

  document.getElementById('stat-top-project').textContent = 
    topProject ? truncate(topProject[0], 12) : '-';
}

// Update project suggestions
function updateProjectSuggestions() {
  const projects = [...new Set(contexts.map(c => c.project).filter(Boolean))];
  projectSuggestions.innerHTML = projects
    .slice(0, 10)
    .map(p => `<option value="${escapeHtml(p)}">`)
    .join('');
}

// Utilities
function generateId() {
  return Date.now().toString(36) + Math.random().toString(36).substr(2);
}

function formatTimeAgo(dateStr) {
  const date = new Date(dateStr);
  const now = new Date();
  const diffMs = now - date;
  const diffMins = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMins / 60);
  const diffDays = Math.floor(diffHours / 24);

  if (diffMins < 1) return 'just now';
  if (diffMins < 60) return `${diffMins}m ago`;
  if (diffHours < 24) return `${diffHours}h ago`;
  if (diffDays === 1) return 'yesterday';
  if (diffDays < 7) return `${diffDays}d ago`;
  return date.toLocaleDateString();
}

function truncate(str, maxLen) {
  return str.length > maxLen ? str.slice(0, maxLen - 1) + '…' : str;
}

function escapeHtml(str) {
  if (!str) return '';
  const div = document.createElement('div');
  div.textContent = str;
  return div.innerHTML;
}

function showToast(message, type = 'success') {
  // Remove existing toast
  const existing = document.querySelector('.toast');
  if (existing) existing.remove();

  const toast = document.createElement('div');
  toast.className = 'toast';
  toast.textContent = message;
  
  if (type === 'warning') {
    toast.style.background = 'var(--warning)';
  }

  document.body.appendChild(toast);

  setTimeout(() => {
    toast.remove();
  }, 3000);
}

// Keyboard shortcut: Cmd/Ctrl + S to focus first field
document.addEventListener('keydown', (e) => {
  if ((e.metaKey || e.ctrlKey) && e.key === 's') {
    e.preventDefault();
    document.getElementById('project').focus();
    showToast('Quick save mode! Fill in your context.', 'warning');
  }
});
