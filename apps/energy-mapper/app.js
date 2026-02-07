// Energy Mapper - Track your energy levels throughout the day
// Built by Giterdone at 3am 😉

const STORAGE_KEY = 'energy-mapper-data';
const LEVELS = {
  1: { emoji: '😴', label: 'Drained' },
  2: { emoji: '😐', label: 'Low' },
  3: { emoji: '🙂', label: 'Okay' },
  4: { emoji: '😊', label: 'Good' },
  5: { emoji: '🔥', label: 'Peak' }
};

// State
let data = loadData();

function loadData() {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    return stored ? JSON.parse(stored) : { checkins: [] };
  } catch {
    return { checkins: [] };
  }
}

function saveData() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
}

function formatDate(date) {
  return date.toISOString().split('T')[0];
}

function formatTime(date) {
  return date.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' });
}

function formatHour(hour) {
  if (hour === 0) return '12a';
  if (hour === 12) return '12p';
  return hour > 12 ? `${hour - 12}p` : `${hour}a`;
}

function getToday() {
  return formatDate(new Date());
}

function getDayName(dateStr) {
  const date = new Date(dateStr + 'T12:00:00');
  return date.toLocaleDateString('en-US', { weekday: 'short' });
}

// Check-in
function handleCheckin(level) {
  const now = new Date();
  const checkin = {
    timestamp: now.toISOString(),
    date: formatDate(now),
    hour: now.getHours(),
    level: parseInt(level)
  };
  
  data.checkins.push(checkin);
  saveData();
  
  // Update UI
  updateLastCheckin();
  renderTodayChart();
  updateInsights();
  renderWeeklyHeatmap();
  renderHistory();
  
  // Show feedback
  showToast(`${LEVELS[level].emoji} Energy logged!`);
  
  // Animate button
  const btn = document.querySelector(`[data-level="${level}"]`);
  btn.classList.add('selected');
  setTimeout(() => btn.classList.remove('selected'), 300);
}

function updateLastCheckin() {
  const el = document.getElementById('lastCheckin');
  const todayCheckins = data.checkins.filter(c => c.date === getToday());
  
  if (todayCheckins.length === 0) {
    el.textContent = '';
    return;
  }
  
  const last = todayCheckins[todayCheckins.length - 1];
  const time = formatTime(new Date(last.timestamp));
  el.textContent = `Last check-in: ${LEVELS[last.level].emoji} ${LEVELS[last.level].label} at ${time}`;
}

// Today's Chart
function renderTodayChart() {
  const today = getToday();
  const todayCheckins = data.checkins.filter(c => c.date === today);
  
  const chartEmpty = document.getElementById('chartEmpty');
  const chart = document.getElementById('chart');
  const barsContainer = document.getElementById('chartBars');
  
  if (todayCheckins.length < 2) {
    chartEmpty.style.display = 'flex';
    chart.style.display = 'none';
    return;
  }
  
  chartEmpty.style.display = 'none';
  chart.style.display = 'flex';
  
  // Group by hour and take last value for each hour
  const hourlyData = {};
  todayCheckins.forEach(c => {
    hourlyData[c.hour] = c.level;
  });
  
  // Find min and max hours for range
  const hours = Object.keys(hourlyData).map(h => parseInt(h)).sort((a, b) => a - b);
  const minHour = Math.max(0, hours[0] - 1);
  const maxHour = Math.min(23, hours[hours.length - 1] + 1);
  
  let barsHtml = '';
  for (let h = minHour; h <= maxHour; h++) {
    const level = hourlyData[h] || 0;
    const height = level > 0 ? (level / 5) * 100 : 0;
    const dataLevel = level > 0 ? level : '';
    barsHtml += `
      <div class="chart-bar" 
           style="height: ${height}%" 
           data-level="${dataLevel}"
           data-time="${formatHour(h)}"
           title="${formatHour(h)}: ${level > 0 ? LEVELS[level].label : 'No data'}">
      </div>
    `;
  }
  
  barsContainer.innerHTML = barsHtml;
}

// Insights
function updateInsights() {
  const section = document.getElementById('insightsSection');
  
  if (data.checkins.length < 3) {
    section.style.display = 'none';
    return;
  }
  
  section.style.display = 'block';
  
  // Calculate insights from all data
  const hourlyAverages = {};
  const hourlyCounts = {};
  
  data.checkins.forEach(c => {
    if (!hourlyAverages[c.hour]) {
      hourlyAverages[c.hour] = 0;
      hourlyCounts[c.hour] = 0;
    }
    hourlyAverages[c.hour] += c.level;
    hourlyCounts[c.hour]++;
  });
  
  // Find peak and low hours
  let peakHour = null, lowHour = null;
  let peakAvg = 0, lowAvg = 6;
  
  Object.keys(hourlyAverages).forEach(hour => {
    const avg = hourlyAverages[hour] / hourlyCounts[hour];
    if (avg > peakAvg) {
      peakAvg = avg;
      peakHour = parseInt(hour);
    }
    if (avg < lowAvg) {
      lowAvg = avg;
      lowHour = parseInt(hour);
    }
  });
  
  // Overall average
  const totalSum = data.checkins.reduce((sum, c) => sum + c.level, 0);
  const avgEnergy = (totalSum / data.checkins.length).toFixed(1);
  
  // Update UI
  document.getElementById('peakHour').textContent = peakHour !== null ? formatHour(peakHour) : '--';
  document.getElementById('lowHour').textContent = lowHour !== null ? formatHour(lowHour) : '--';
  document.getElementById('avgEnergy').textContent = avgEnergy;
  document.getElementById('totalCheckins').textContent = data.checkins.length;
}

// Weekly Heatmap
function renderWeeklyHeatmap() {
  const section = document.getElementById('weeklySection');
  const container = document.getElementById('heatmap');
  
  if (data.checkins.length < 5) {
    section.style.display = 'none';
    return;
  }
  
  section.style.display = 'block';
  
  // Get last 7 days
  const days = [];
  for (let i = 6; i >= 0; i--) {
    const d = new Date();
    d.setDate(d.getDate() - i);
    days.push(formatDate(d));
  }
  
  // Build hourly averages per day
  const dayHourData = {};
  days.forEach(day => {
    dayHourData[day] = {};
    for (let h = 0; h < 24; h++) {
      dayHourData[day][h] = null;
    }
  });
  
  data.checkins.forEach(c => {
    if (dayHourData[c.date]) {
      dayHourData[c.date][c.hour] = c.level;
    }
  });
  
  // Generate heatmap HTML
  let html = '<div class="heatmap-row"><div class="heatmap-day"></div>';
  for (let h = 0; h < 24; h += 3) {
    html += `<div class="heatmap-header" style="grid-column: span 3;">${formatHour(h)}</div>`;
  }
  html += '</div>';
  
  days.forEach(day => {
    html += `<div class="heatmap-row"><div class="heatmap-day">${getDayName(day)}</div>`;
    for (let h = 0; h < 24; h++) {
      const level = dayHourData[day][h];
      html += `<div class="heatmap-cell" data-level="${level || ''}" 
                    title="${getDayName(day)} ${formatHour(h)}: ${level ? LEVELS[level].label : 'No data'}"></div>`;
    }
    html += '</div>';
  });
  
  container.innerHTML = html;
}

// History
function renderHistory() {
  const section = document.getElementById('historySection');
  const list = document.getElementById('historyList');
  
  if (data.checkins.length === 0) {
    section.style.display = 'none';
    return;
  }
  
  section.style.display = 'block';
  
  // Show last 10 check-ins
  const recent = [...data.checkins].reverse().slice(0, 10);
  
  list.innerHTML = recent.map(c => {
    const date = new Date(c.timestamp);
    const isToday = c.date === getToday();
    const dateStr = isToday ? 'Today' : getDayName(c.date);
    
    return `
      <div class="history-item">
        <span class="history-emoji">${LEVELS[c.level].emoji}</span>
        <span class="history-time">${dateStr} at ${formatTime(date)}</span>
        <span class="history-level" data-level="${c.level}">${LEVELS[c.level].label}</span>
      </div>
    `;
  }).join('');
}

// Clear data
function clearData() {
  if (confirm('Clear all energy data? This cannot be undone.')) {
    data = { checkins: [] };
    saveData();
    renderAll();
    showToast('Data cleared');
  }
}

// Toast
function showToast(message) {
  const toast = document.getElementById('toast');
  toast.textContent = message;
  toast.classList.add('show');
  setTimeout(() => toast.classList.remove('show'), 2000);
}

// Render all
function renderAll() {
  updateLastCheckin();
  renderTodayChart();
  updateInsights();
  renderWeeklyHeatmap();
  renderHistory();
}

// Initialize
document.addEventListener('DOMContentLoaded', () => {
  // Set up check-in buttons
  document.querySelectorAll('.energy-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      handleCheckin(btn.dataset.level);
    });
  });
  
  // Clear button
  document.getElementById('clearHistory').addEventListener('click', clearData);
  
  // Initial render
  renderAll();
});
