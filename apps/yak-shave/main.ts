// Yak Shave Tracker - Track your rabbit holes
// "I just need to fix this one thing..."

interface Tangent {
  text: string;
  addedAt: number;
}

interface Shave {
  id: string;
  originalGoal: string;
  tangents: Tangent[];
  startedAt: number;
  closedAt: number | null;
  status: 'active' | 'completed' | 'abandoned';
}

interface State {
  shaves: Shave[];
}

const STORAGE_KEY = 'yak-shave-data';

// DOM Elements
const elements = {
  originalGoal: document.getElementById('original-goal') as HTMLInputElement,
  startShave: document.getElementById('start-shave') as HTMLButtonElement,
  activeShaves: document.getElementById('active-shaves') as HTMLDivElement,
  historyList: document.getElementById('history-list') as HTMLDivElement,
  noActive: document.getElementById('no-active') as HTMLDivElement,
  noHistory: document.getElementById('no-history') as HTMLDivElement,
  tangentModal: document.getElementById('tangent-modal') as HTMLDivElement,
  tangentInput: document.getElementById('tangent-input') as HTMLInputElement,
  cancelTangent: document.getElementById('cancel-tangent') as HTMLButtonElement,
  confirmTangent: document.getElementById('confirm-tangent') as HTMLButtonElement,
  completeModal: document.getElementById('complete-modal') as HTMLDivElement,
  markAbandoned: document.getElementById('mark-abandoned') as HTMLButtonElement,
  markCompleted: document.getElementById('mark-completed') as HTMLButtonElement,
  cancelComplete: document.getElementById('cancel-complete') as HTMLButtonElement,
  activeCount: document.getElementById('active-count') as HTMLSpanElement,
  totalCount: document.getElementById('total-count') as HTMLSpanElement,
  deepestShave: document.getElementById('deepest-shave') as HTMLSpanElement,
  avgDepth: document.getElementById('avg-depth') as HTMLSpanElement,
  filterBtns: document.querySelectorAll('.filter-btn') as NodeListOf<HTMLButtonElement>,
};

let state: State = { shaves: [] };
let currentShaveId: string | null = null;
let currentFilter: 'all' | 'completed' | 'abandoned' = 'all';

// Utilities
function generateId(): string {
  return Date.now().toString(36) + Math.random().toString(36).substr(2);
}

function formatDate(timestamp: number): string {
  const date = new Date(timestamp);
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffMins = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMs / 3600000);
  const diffDays = Math.floor(diffMs / 86400000);

  if (diffMins < 1) return 'just now';
  if (diffMins < 60) return `${diffMins}m ago`;
  if (diffHours < 24) return `${diffHours}h ago`;
  if (diffDays < 7) return `${diffDays}d ago`;
  
  return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
}

function formatDuration(startMs: number, endMs: number): string {
  const diffMs = endMs - startMs;
  const mins = Math.floor(diffMs / 60000);
  const hours = Math.floor(mins / 60);
  
  if (mins < 60) return `${mins}min`;
  return `${hours}h ${mins % 60}m`;
}

// Storage
function loadState(): void {
  try {
    const data = localStorage.getItem(STORAGE_KEY);
    if (data) {
      state = JSON.parse(data);
    }
  } catch (e) {
    console.error('Failed to load state:', e);
    state = { shaves: [] };
  }
}

function saveState(): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  } catch (e) {
    console.error('Failed to save state:', e);
  }
}

// Stats
function updateStats(): void {
  const active = state.shaves.filter(s => s.status === 'active');
  const closed = state.shaves.filter(s => s.status !== 'active');
  
  elements.activeCount.textContent = active.length.toString();
  elements.totalCount.textContent = state.shaves.length.toString();
  
  if (state.shaves.length > 0) {
    const depths = state.shaves.map(s => s.tangents.length + 1);
    const maxDepth = Math.max(...depths);
    const avgDepth = depths.reduce((a, b) => a + b, 0) / depths.length;
    
    elements.deepestShave.textContent = maxDepth.toString();
    elements.avgDepth.textContent = avgDepth.toFixed(1);
  } else {
    elements.deepestShave.textContent = '0';
    elements.avgDepth.textContent = '0';
  }
}

// Render
function getDepthClass(depth: number): string {
  if (depth >= 5) return 'danger';
  if (depth >= 3) return 'deep';
  return '';
}

function renderShaveCard(shave: Shave, isActive: boolean): string {
  const depth = shave.tangents.length + 1;
  const depthClass = getDepthClass(depth);
  const statusClass = shave.status !== 'active' ? shave.status : '';
  
  let tangentsHtml = '';
  if (shave.tangents.length > 0) {
    tangentsHtml = `
      <div class="tangent-chain">
        ${shave.tangents.map(t => `<div class="tangent-item">${escapeHtml(t.text)}</div>`).join('')}
      </div>
    `;
  }

  let actionsHtml = '';
  if (isActive) {
    actionsHtml = `
      <div class="shave-actions">
        <button class="btn-secondary btn-small" onclick="openTangentModal('${shave.id}')">+ Add Tangent</button>
        <button class="btn-secondary btn-small" onclick="openCompleteModal('${shave.id}')">Close Shave</button>
      </div>
    `;
  } else {
    const duration = shave.closedAt ? formatDuration(shave.startedAt, shave.closedAt) : '';
    const statusIcon = shave.status === 'completed' ? '✅' : '💀';
    actionsHtml = `
      <div class="shave-meta" style="margin-top: 0.75rem;">
        <span>${statusIcon} ${shave.status}</span>
        <span>⏱️ ${duration}</span>
      </div>
    `;
  }

  return `
    <div class="shave-card ${statusClass}" data-id="${shave.id}">
      <div class="shave-header">
        <span class="shave-goal">${escapeHtml(shave.originalGoal)}</span>
        <span class="depth-badge ${depthClass}">Depth: ${depth}</span>
      </div>
      <div class="shave-meta">
        <span>Started ${formatDate(shave.startedAt)}</span>
      </div>
      ${tangentsHtml}
      ${actionsHtml}
    </div>
  `;
}

function escapeHtml(text: string): string {
  const div = document.createElement('div');
  div.textContent = text;
  return div.innerHTML;
}

function renderActiveShaves(): void {
  const active = state.shaves.filter(s => s.status === 'active');
  
  if (active.length === 0) {
    elements.activeShaves.innerHTML = '';
    elements.noActive.style.display = 'block';
    return;
  }

  elements.noActive.style.display = 'none';
  elements.activeShaves.innerHTML = active
    .sort((a, b) => b.startedAt - a.startedAt)
    .map(s => renderShaveCard(s, true))
    .join('');
}

function renderHistory(): void {
  let history = state.shaves.filter(s => s.status !== 'active');
  
  if (currentFilter !== 'all') {
    history = history.filter(s => s.status === currentFilter);
  }

  if (history.length === 0) {
    elements.historyList.innerHTML = '';
    elements.noHistory.style.display = 'block';
    return;
  }

  elements.noHistory.style.display = 'none';
  elements.historyList.innerHTML = history
    .sort((a, b) => (b.closedAt || 0) - (a.closedAt || 0))
    .map(s => renderShaveCard(s, false))
    .join('');
}

function render(): void {
  updateStats();
  renderActiveShaves();
  renderHistory();
}

// Actions
function startNewShave(): void {
  const goal = elements.originalGoal.value.trim();
  if (!goal) return;

  const shave: Shave = {
    id: generateId(),
    originalGoal: goal,
    tangents: [],
    startedAt: Date.now(),
    closedAt: null,
    status: 'active',
  };

  state.shaves.unshift(shave);
  saveState();
  render();
  elements.originalGoal.value = '';
}

function addTangent(shaveId: string, text: string): void {
  const shave = state.shaves.find(s => s.id === shaveId);
  if (!shave || !text) return;

  shave.tangents.push({
    text,
    addedAt: Date.now(),
  });

  saveState();
  render();
}

function closeShave(shaveId: string, status: 'completed' | 'abandoned'): void {
  const shave = state.shaves.find(s => s.id === shaveId);
  if (!shave) return;

  shave.status = status;
  shave.closedAt = Date.now();

  saveState();
  render();
}

// Modal Handlers
(window as any).openTangentModal = (shaveId: string) => {
  currentShaveId = shaveId;
  elements.tangentInput.value = '';
  elements.tangentModal.classList.add('open');
  elements.tangentInput.focus();
};

(window as any).openCompleteModal = (shaveId: string) => {
  currentShaveId = shaveId;
  elements.completeModal.classList.add('open');
};

function closeTangentModal(): void {
  elements.tangentModal.classList.remove('open');
  currentShaveId = null;
}

function closeCompleteModal(): void {
  elements.completeModal.classList.remove('open');
  currentShaveId = null;
}

// Event Listeners
elements.startShave.addEventListener('click', startNewShave);
elements.originalGoal.addEventListener('keypress', (e) => {
  if (e.key === 'Enter') startNewShave();
});

elements.cancelTangent.addEventListener('click', closeTangentModal);
elements.confirmTangent.addEventListener('click', () => {
  if (currentShaveId) {
    addTangent(currentShaveId, elements.tangentInput.value.trim());
  }
  closeTangentModal();
});
elements.tangentInput.addEventListener('keypress', (e) => {
  if (e.key === 'Enter' && currentShaveId) {
    addTangent(currentShaveId, elements.tangentInput.value.trim());
    closeTangentModal();
  }
});

elements.cancelComplete.addEventListener('click', closeCompleteModal);
elements.markCompleted.addEventListener('click', () => {
  if (currentShaveId) {
    closeShave(currentShaveId, 'completed');
  }
  closeCompleteModal();
});
elements.markAbandoned.addEventListener('click', () => {
  if (currentShaveId) {
    closeShave(currentShaveId, 'abandoned');
  }
  closeCompleteModal();
});

// Close modals on overlay click
elements.tangentModal.addEventListener('click', (e) => {
  if (e.target === elements.tangentModal) closeTangentModal();
});
elements.completeModal.addEventListener('click', (e) => {
  if (e.target === elements.completeModal) closeCompleteModal();
});

// Filter buttons
elements.filterBtns.forEach(btn => {
  btn.addEventListener('click', () => {
    elements.filterBtns.forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    currentFilter = btn.dataset.filter as typeof currentFilter;
    renderHistory();
  });
});

// Keyboard shortcuts
document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape') {
    closeTangentModal();
    closeCompleteModal();
  }
});

// Init
loadState();
render();

// Easter egg: Warn on deep dives
const deepestActive = state.shaves
  .filter(s => s.status === 'active')
  .reduce((max, s) => Math.max(max, s.tangents.length + 1), 0);

if (deepestActive >= 5) {
  console.log('🐃 DEEP YAK ALERT: You are', deepestActive, 'levels deep. Maybe finish something?');
}
