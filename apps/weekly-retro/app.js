// Weekly Retro - Quick weekly retrospectives
const STORAGE_KEY = 'weekly-retro-data';

// State
let currentRetro = { good: [], bad: [], try: [], mood: null };
let allRetros = JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]');

// Week helpers
function getWeekStart(date = new Date()) {
  const d = new Date(date);
  const day = d.getDay();
  const diff = d.getDate() - day + (day === 0 ? -6 : 1);
  d.setDate(diff);
  d.setHours(0, 0, 0, 0);
  return d;
}

function getWeekKey(date = new Date()) {
  return getWeekStart(date).toISOString().split('T')[0];
}

function getWeekNumber(date = new Date()) {
  const d = new Date(Date.UTC(date.getFullYear(), date.getMonth(), date.getDate()));
  d.setUTCDate(d.getUTCDate() + 4 - (d.getUTCDay() || 7));
  const yearStart = new Date(Date.UTC(d.getUTCFullYear(), 0, 1));
  return Math.ceil((((d - yearStart) / 86400000) + 1) / 7);
}

function formatWeekLabel(dateStr) {
  const start = new Date(dateStr);
  const end = new Date(start);
  end.setDate(end.getDate() + 6);
  const fmt = (d) => d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  return `${fmt(start)} – ${fmt(end)}`;
}

// Initialize
function init() {
  const weekKey = getWeekKey();
  const existing = allRetros.find(r => r.weekKey === weekKey);
  if (existing) {
    currentRetro = { good: [...existing.good], bad: [...existing.bad], try: [...existing.try], mood: existing.mood };
  }

  document.getElementById('week-label').textContent = `Week of ${formatWeekLabel(weekKey)}`;
  document.getElementById('week-number').textContent = `W${getWeekNumber()}`;

  renderItems();
  renderMood();
  renderTrend();
  renderHistory();
  setupListeners();
}

function setupListeners() {
  // Enter key on inputs
  ['good', 'bad', 'try'].forEach(type => {
    document.getElementById(`${type}-input`).addEventListener('keydown', (e) => {
      if (e.key === 'Enter') { e.preventDefault(); addItem(type); }
    });
  });

  // Mood buttons
  document.querySelectorAll('.mood-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      currentRetro.mood = parseInt(btn.dataset.mood);
      renderMood();
    });
  });
}

// Items
function addItem(type) {
  const input = document.getElementById(`${type}-input`);
  const text = input.value.trim();
  if (!text) return;
  currentRetro[type].push(text);
  input.value = '';
  renderItems();
  input.focus();
}

function removeItem(type, index) {
  currentRetro[type].splice(index, 1);
  renderItems();
}

function renderItems() {
  ['good', 'bad', 'try'].forEach(type => {
    const container = document.getElementById(`${type}-items`);
    container.innerHTML = currentRetro[type].map((item, i) =>
      `<div class="retro-item">
        <span>${escapeHtml(item)}</span>
        <button class="delete-btn" onclick="removeItem('${type}', ${i})">✕</button>
      </div>`
    ).join('');
  });
}

function renderMood() {
  document.querySelectorAll('.mood-btn').forEach(btn => {
    btn.classList.toggle('selected', parseInt(btn.dataset.mood) === currentRetro.mood);
  });
}

// Save
function saveRetro() {
  const weekKey = getWeekKey();
  const entry = {
    weekKey,
    good: [...currentRetro.good],
    bad: [...currentRetro.bad],
    try: [...currentRetro.try],
    mood: currentRetro.mood,
    savedAt: new Date().toISOString()
  };

  const idx = allRetros.findIndex(r => r.weekKey === weekKey);
  if (idx >= 0) allRetros[idx] = entry;
  else allRetros.push(entry);

  allRetros.sort((a, b) => b.weekKey.localeCompare(a.weekKey));
  localStorage.setItem(STORAGE_KEY, JSON.stringify(allRetros));

  const btn = document.getElementById('save-btn');
  btn.textContent = 'Saved ✓';
  btn.classList.add('saved');
  setTimeout(() => { btn.textContent = 'Save Retro'; btn.classList.remove('saved'); }, 2000);

  renderTrend();
  renderHistory();
}

// Mood trend chart
function renderTrend() {
  const withMood = allRetros.filter(r => r.mood).slice(0, 12).reverse();
  const section = document.getElementById('trend-section');
  if (withMood.length < 2) { section.style.display = 'none'; return; }
  section.style.display = 'block';

  const chart = document.getElementById('mood-chart');
  const moodColors = ['', '#ef4444', '#f59e0b', '#8888a0', '#22c55e', '#6366f1'];
  const moodEmoji = ['', '😩', '😕', '😐', '😊', '🔥'];

  chart.innerHTML = withMood.map(r => {
    const pct = (r.mood / 5) * 100;
    return `<div class="mood-bar-wrapper">
      <div style="font-size:1.1rem;margin-bottom:4px">${moodEmoji[r.mood]}</div>
      <div class="mood-bar" style="height:${pct}%;background:${moodColors[r.mood]}"></div>
      <div class="mood-bar-label">W${getWeekNumber(new Date(r.weekKey))}</div>
    </div>`;
  }).join('');
}

// History
function renderHistory() {
  const past = allRetros.filter(r => r.weekKey !== getWeekKey());
  const section = document.getElementById('history-section');
  if (!past.length) { section.style.display = 'none'; return; }
  section.style.display = 'block';

  const moodEmoji = ['', '😩', '😕', '😐', '😊', '🔥'];
  const list = document.getElementById('history-list');

  list.innerHTML = past.map((r, i) => `
    <div class="history-entry" onclick="toggleHistory(${i})">
      <div class="history-header">
        <span class="history-week">${formatWeekLabel(r.weekKey)}</span>
        <span class="history-mood">${r.mood ? moodEmoji[r.mood] : '—'}</span>
      </div>
      <div class="history-summary">
        <span>✅ ${r.good.length}</span>
        <span>❌ ${r.bad.length}</span>
        <span>🧪 ${r.try.length}</span>
      </div>
      <div class="history-detail" id="history-detail-${i}">
        ${r.good.length ? `<div class="history-col good"><h4>What went well</h4><ul>${r.good.map(g => `<li>${escapeHtml(g)}</li>`).join('')}</ul></div>` : ''}
        ${r.bad.length ? `<div class="history-col bad"><h4>What didn't</h4><ul>${r.bad.map(b => `<li>${escapeHtml(b)}</li>`).join('')}</ul></div>` : ''}
        ${r.try.length ? `<div class="history-col try"><h4>Try next week</h4><ul>${r.try.map(t => `<li>${escapeHtml(t)}</li>`).join('')}</ul></div>` : ''}
      </div>
    </div>
  `).join('');
}

function toggleHistory(i) {
  const el = document.getElementById(`history-detail-${i}`);
  el.classList.toggle('open');
}

function escapeHtml(str) {
  const div = document.createElement('div');
  div.textContent = str;
  return div.innerHTML;
}

// Make addItem global
window.addItem = addItem;
window.removeItem = removeItem;
window.saveRetro = saveRetro;
window.toggleHistory = toggleHistory;

init();
