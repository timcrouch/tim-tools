// Streak Keeper - Habit Streak Tracker
// All data stored in localStorage

const STORAGE_KEY = 'streak-keeper-habits';

// State
let habits = [];

// DOM Elements
const addHabitForm = document.getElementById('addHabitForm');
const habitInput = document.getElementById('habitInput');
const habitsContainer = document.getElementById('habitsContainer');
const emptyState = document.getElementById('emptyState');
const statsPanel = document.getElementById('statsPanel');
const achievementsPanel = document.getElementById('achievementsPanel');
const celebration = document.getElementById('celebration');

// Initialize
document.addEventListener('DOMContentLoaded', () => {
  loadHabits();
  render();
});

// Event Listeners
addHabitForm.addEventListener('submit', (e) => {
  e.preventDefault();
  const name = habitInput.value.trim();
  if (name) {
    addHabit(name);
    habitInput.value = '';
  }
});

// Data Functions
function loadHabits() {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    habits = stored ? JSON.parse(stored) : [];
    // Migrate old data format if needed
    habits = habits.map(h => ({
      ...h,
      checkins: h.checkins || [],
      bestStreak: h.bestStreak || 0,
      created: h.created || new Date().toISOString()
    }));
  } catch (e) {
    console.error('Failed to load habits:', e);
    habits = [];
  }
}

function saveHabits() {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(habits));
  } catch (e) {
    console.error('Failed to save habits:', e);
  }
}

function addHabit(name) {
  const habit = {
    id: Date.now().toString(),
    name,
    checkins: [],
    bestStreak: 0,
    created: new Date().toISOString()
  };
  habits.push(habit);
  saveHabits();
  render();
}

function deleteHabit(id) {
  if (confirm('Delete this habit? This cannot be undone.')) {
    habits = habits.filter(h => h.id !== id);
    saveHabits();
    render();
  }
}

function checkIn(id) {
  const habit = habits.find(h => h.id === id);
  if (!habit) return;

  const today = getDateString(new Date());
  if (habit.checkins.includes(today)) return;

  habit.checkins.push(today);
  
  // Update best streak
  const currentStreak = calculateStreak(habit);
  if (currentStreak > habit.bestStreak) {
    habit.bestStreak = currentStreak;
  }

  saveHabits();
  render();
  
  // Celebrate milestones
  if (currentStreak === 7) {
    celebrate('🔥 One week streak!');
  } else if (currentStreak === 30) {
    celebrate('🏆 30 days! Incredible!');
  } else if (currentStreak === 100) {
    celebrate('💯 100 days! Legendary!');
  } else if (currentStreak > 0 && currentStreak % 50 === 0) {
    celebrate(`🎉 ${currentStreak} day streak!`);
  }
}

// Utility Functions
function getDateString(date) {
  return date.toISOString().split('T')[0];
}

function calculateStreak(habit) {
  if (habit.checkins.length === 0) return 0;

  const sortedDates = [...habit.checkins].sort().reverse();
  const today = getDateString(new Date());
  const yesterday = getDateString(new Date(Date.now() - 86400000));

  // Check if the streak is still active (checked today or yesterday)
  if (sortedDates[0] !== today && sortedDates[0] !== yesterday) {
    return 0;
  }

  let streak = 1;
  let currentDate = new Date(sortedDates[0]);

  for (let i = 1; i < sortedDates.length; i++) {
    const prevDate = new Date(currentDate.getTime() - 86400000);
    const prevDateStr = getDateString(prevDate);
    
    if (sortedDates[i] === prevDateStr) {
      streak++;
      currentDate = prevDate;
    } else {
      break;
    }
  }

  return streak;
}

function isCheckedToday(habit) {
  const today = getDateString(new Date());
  return habit.checkins.includes(today);
}

function getWeekDays() {
  const days = [];
  const today = new Date();
  const dayOfWeek = today.getDay();
  
  // Start from Monday
  const startOfWeek = new Date(today);
  startOfWeek.setDate(today.getDate() - (dayOfWeek === 0 ? 6 : dayOfWeek - 1));

  for (let i = 0; i < 7; i++) {
    const date = new Date(startOfWeek);
    date.setDate(startOfWeek.getDate() + i);
    days.push({
      date: getDateString(date),
      label: ['M', 'T', 'W', 'T', 'F', 'S', 'S'][i],
      isToday: getDateString(date) === getDateString(today),
      isFuture: date > today
    });
  }

  return days;
}

// Celebration
function celebrate(message) {
  // Create confetti
  const colors = ['#f97316', '#fbbf24', '#22c55e', '#6366f1', '#ef4444'];
  for (let i = 0; i < 50; i++) {
    const confetti = document.createElement('div');
    confetti.className = 'confetti';
    confetti.style.left = Math.random() * 100 + '%';
    confetti.style.background = colors[Math.floor(Math.random() * colors.length)];
    confetti.style.animationDelay = Math.random() * 0.5 + 's';
    confetti.style.borderRadius = Math.random() > 0.5 ? '50%' : '2px';
    celebration.appendChild(confetti);
    setTimeout(() => confetti.remove(), 2500);
  }

  // Show toast message (could enhance this)
  console.log(message);
}

// Stats Calculation
function calculateStats() {
  const totalHabits = habits.length;
  const longestStreak = Math.max(0, ...habits.map(h => h.bestStreak));
  const totalCheckins = habits.reduce((sum, h) => sum + h.checkins.length, 0);
  
  const checkedToday = habits.filter(h => isCheckedToday(h)).length;
  const todayProgress = totalHabits > 0 
    ? Math.round((checkedToday / totalHabits) * 100) 
    : 0;

  return { totalHabits, longestStreak, todayProgress, totalCheckins };
}

// Achievements
function getAchievements() {
  const stats = calculateStats();
  const maxStreak = Math.max(0, ...habits.map(h => calculateStreak(h)));
  
  return [
    { 
      icon: '🌱', 
      name: 'First Step', 
      desc: 'Add your first habit',
      earned: habits.length > 0
    },
    { 
      icon: '🔥', 
      name: 'On Fire', 
      desc: '7-day streak',
      earned: habits.some(h => h.bestStreak >= 7)
    },
    { 
      icon: '💪', 
      name: 'Committed', 
      desc: '30-day streak',
      earned: habits.some(h => h.bestStreak >= 30)
    },
    { 
      icon: '💯', 
      name: 'Centurion', 
      desc: '100-day streak',
      earned: habits.some(h => h.bestStreak >= 100)
    },
    { 
      icon: '🎯', 
      name: 'Perfect Day', 
      desc: 'Complete all habits in a day',
      earned: habits.length > 0 && habits.every(h => isCheckedToday(h))
    },
    { 
      icon: '🏆', 
      name: 'Triple Threat', 
      desc: 'Track 3+ habits',
      earned: habits.length >= 3
    }
  ];
}

// Render Functions
function render() {
  renderHabits();
  renderStats();
  renderAchievements();
}

function renderHabits() {
  if (habits.length === 0) {
    habitsContainer.innerHTML = `
      <div class="empty-state">
        <div class="empty-icon">🔥</div>
        <h3>No habits yet</h3>
        <p>Add your first habit above and start building streaks.</p>
      </div>
    `;
    return;
  }

  const weekDays = getWeekDays();

  habitsContainer.innerHTML = habits.map(habit => {
    const streak = calculateStreak(habit);
    const checkedToday = isCheckedToday(habit);
    const isActive = streak > 0;

    return `
      <div class="habit-card ${checkedToday ? 'checked-today' : ''}">
        <div class="habit-header">
          <div class="habit-info">
            <div class="habit-name">${escapeHtml(habit.name)}</div>
            <div class="habit-meta">Started ${formatDate(habit.created)}</div>
          </div>
          <div class="habit-actions">
            <button class="delete-btn" onclick="deleteHabit('${habit.id}')" title="Delete habit">🗑️</button>
          </div>
        </div>

        <div class="streak-display">
          <div class="streak-fire ${isActive ? 'active' : ''}">
            <span class="streak-count">${streak}</span>
          </div>
          <span class="streak-label">day${streak !== 1 ? 's' : ''}</span>
          <div class="best-streak">
            Best: <strong>${habit.bestStreak}</strong>
          </div>
        </div>

        <div class="week-view">
          ${weekDays.map(day => {
            const completed = habit.checkins.includes(day.date);
            let classes = 'day-dot';
            if (completed) classes += ' completed';
            if (day.isToday) classes += ' today';
            if (day.isFuture) classes += ' future';
            return `
              <div class="day-cell">
                <span class="day-label">${day.label}</span>
                <div class="${classes}"></div>
              </div>
            `;
          }).join('')}
        </div>

        <button 
          class="checkin-btn ${checkedToday ? 'completed' : 'available'}"
          onclick="${checkedToday ? '' : `checkIn('${habit.id}')`}"
          ${checkedToday ? 'disabled' : ''}
        >
          ${checkedToday ? '✓ Done for today!' : '✓ Mark Complete'}
        </button>
      </div>
    `;
  }).join('');
}

function renderStats() {
  if (habits.length === 0) {
    statsPanel.style.display = 'none';
    return;
  }

  statsPanel.style.display = 'block';
  const stats = calculateStats();

  document.getElementById('totalHabits').textContent = stats.totalHabits;
  document.getElementById('longestStreak').textContent = stats.longestStreak;
  document.getElementById('todayProgress').textContent = stats.todayProgress + '%';
  document.getElementById('totalCheckins').textContent = stats.totalCheckins;
}

function renderAchievements() {
  if (habits.length === 0) {
    achievementsPanel.style.display = 'none';
    return;
  }

  achievementsPanel.style.display = 'block';
  const achievements = getAchievements();
  const achievementsList = document.getElementById('achievementsList');

  achievementsList.innerHTML = achievements.map(a => `
    <div class="achievement ${a.earned ? 'earned' : 'locked'}">
      <span class="achievement-icon">${a.icon}</span>
      <span>${a.name}</span>
    </div>
  `).join('');
}

// Helpers
function escapeHtml(text) {
  const div = document.createElement('div');
  div.textContent = text;
  return div.innerHTML;
}

function formatDate(isoString) {
  const date = new Date(isoString);
  const now = new Date();
  const diffDays = Math.floor((now - date) / 86400000);
  
  if (diffDays === 0) return 'today';
  if (diffDays === 1) return 'yesterday';
  if (diffDays < 7) return `${diffDays} days ago`;
  
  return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
}

// Expose functions globally for onclick handlers
window.deleteHabit = deleteHabit;
window.checkIn = checkIn;
