// Focus Timer - Pomodoro-style focus sessions
// Built by Giterdone 😉

const STORAGE_KEY = 'focus-timer-data';
const SETTINGS_KEY = 'focus-timer-settings';

// Default settings
const defaultSettings = {
    focusDuration: 25,
    shortBreak: 5,
    longBreak: 15,
    sessionsUntilLong: 4,
    autoStartBreaks: true,
    soundEnabled: true
};

// State
let state = {
    phase: 'ready', // ready, focus, break
    isRunning: false,
    timeRemaining: 0, // seconds
    totalTime: 0, // seconds
    currentSession: 0, // 0-indexed within cycle
    intervalId: null
};

let settings = { ...defaultSettings };
let history = [];

// DOM Elements
const timerDisplay = document.getElementById('timerDisplay');
const timerPhase = document.getElementById('timerPhase');
const timerRing = document.querySelector('.timer-ring');
const progressRing = document.getElementById('progressRing');
const startBtn = document.getElementById('startBtn');
const pauseBtn = document.getElementById('pauseBtn');
const resetBtn = document.getElementById('resetBtn');
const taskInput = document.getElementById('taskInput');
const sessionDots = document.getElementById('sessionDots');
const todaySessions = document.getElementById('todaySessions');
const todayMinutes = document.getElementById('todayMinutes');
const streakDays = document.getElementById('streakDays');
const weekChart = document.getElementById('weekChart');
const historyList = document.getElementById('historyList');
const emptyState = document.getElementById('emptyState');
const settingsBtn = document.getElementById('settingsBtn');
const settingsModal = document.getElementById('settingsModal');
const settingsForm = document.getElementById('settingsForm');
const cancelSettings = document.getElementById('cancelSettings');
const clearHistoryBtn = document.getElementById('clearHistoryBtn');

// Initialize
function init() {
    loadData();
    loadSettings();
    setupEventListeners();
    updateDisplay();
    updateStats();
    renderWeekChart();
    renderHistory();
    updateSessionDots();
    
    // Request notification permission
    if ('Notification' in window && Notification.permission === 'default') {
        Notification.requestPermission();
    }
}

// Data persistence
function loadData() {
    try {
        const data = localStorage.getItem(STORAGE_KEY);
        if (data) {
            history = JSON.parse(data);
        }
    } catch (e) {
        console.error('Error loading data:', e);
        history = [];
    }
}

function saveData() {
    try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(history));
    } catch (e) {
        console.error('Error saving data:', e);
    }
}

function loadSettings() {
    try {
        const data = localStorage.getItem(SETTINGS_KEY);
        if (data) {
            settings = { ...defaultSettings, ...JSON.parse(data) };
        }
    } catch (e) {
        console.error('Error loading settings:', e);
        settings = { ...defaultSettings };
    }
    
    // Initialize timer with focus duration
    state.timeRemaining = settings.focusDuration * 60;
    state.totalTime = settings.focusDuration * 60;
}

function saveSettings() {
    try {
        localStorage.setItem(SETTINGS_KEY, JSON.stringify(settings));
    } catch (e) {
        console.error('Error saving settings:', e);
    }
}

// Event listeners
function setupEventListeners() {
    startBtn.addEventListener('click', startTimer);
    pauseBtn.addEventListener('click', pauseTimer);
    resetBtn.addEventListener('click', resetTimer);
    settingsBtn.addEventListener('click', openSettings);
    cancelSettings.addEventListener('click', closeSettings);
    settingsForm.addEventListener('submit', handleSettingsSave);
    clearHistoryBtn.addEventListener('click', clearHistory);
    
    // Close modal on outside click
    settingsModal.addEventListener('click', (e) => {
        if (e.target === settingsModal) closeSettings();
    });
    
    // Keyboard shortcuts
    document.addEventListener('keydown', (e) => {
        if (e.target.tagName === 'INPUT') return;
        
        if (e.code === 'Space') {
            e.preventDefault();
            if (state.isRunning) {
                pauseTimer();
            } else {
                startTimer();
            }
        } else if (e.code === 'KeyR') {
            resetTimer();
        }
    });
}

// Timer functions
function startTimer() {
    if (state.phase === 'ready') {
        state.phase = 'focus';
        state.timeRemaining = settings.focusDuration * 60;
        state.totalTime = settings.focusDuration * 60;
    }
    
    state.isRunning = true;
    startBtn.classList.add('hidden');
    pauseBtn.classList.remove('hidden');
    timerRing.classList.add('running');
    
    updatePhaseDisplay();
    
    state.intervalId = setInterval(() => {
        state.timeRemaining--;
        updateDisplay();
        
        if (state.timeRemaining <= 0) {
            completePhase();
        }
    }, 1000);
}

function pauseTimer() {
    state.isRunning = false;
    clearInterval(state.intervalId);
    pauseBtn.classList.add('hidden');
    startBtn.classList.remove('hidden');
    startBtn.querySelector('.btn-text').textContent = 'Resume';
    timerRing.classList.remove('running');
}

function resetTimer() {
    state.isRunning = false;
    clearInterval(state.intervalId);
    state.phase = 'ready';
    state.timeRemaining = settings.focusDuration * 60;
    state.totalTime = settings.focusDuration * 60;
    
    pauseBtn.classList.add('hidden');
    startBtn.classList.remove('hidden');
    startBtn.querySelector('.btn-text').textContent = 'Start Focus';
    timerRing.classList.remove('running', 'focus', 'break');
    timerPhase.classList.remove('focus', 'break');
    timerPhase.textContent = 'Ready to focus';
    
    updateDisplay();
}

function completePhase() {
    clearInterval(state.intervalId);
    state.isRunning = false;
    timerRing.classList.remove('running');
    
    playNotificationSound();
    
    if (state.phase === 'focus') {
        // Log completed focus session
        const session = {
            id: Date.now(),
            task: taskInput.value.trim() || 'Focus session',
            duration: settings.focusDuration,
            completedAt: new Date().toISOString()
        };
        history.unshift(session);
        saveData();
        
        // Update session counter
        state.currentSession = (state.currentSession + 1) % settings.sessionsUntilLong;
        
        // Determine break type
        const isLongBreak = state.currentSession === 0;
        const breakDuration = isLongBreak ? settings.longBreak : settings.shortBreak;
        
        state.phase = 'break';
        state.timeRemaining = breakDuration * 60;
        state.totalTime = breakDuration * 60;
        
        showNotification(
            'Focus Complete! 🎉',
            `Time for a ${isLongBreak ? 'long' : 'short'} break (${breakDuration} min)`
        );
        
        updateStats();
        renderWeekChart();
        renderHistory();
        updateSessionDots();
        
        if (settings.autoStartBreaks) {
            setTimeout(() => startTimer(), 1000);
        } else {
            pauseBtn.classList.add('hidden');
            startBtn.classList.remove('hidden');
            startBtn.querySelector('.btn-text').textContent = 'Start Break';
        }
    } else {
        // Break complete
        state.phase = 'focus';
        state.timeRemaining = settings.focusDuration * 60;
        state.totalTime = settings.focusDuration * 60;
        
        showNotification('Break Over! 💪', 'Ready for another focus session?');
        
        pauseBtn.classList.add('hidden');
        startBtn.classList.remove('hidden');
        startBtn.querySelector('.btn-text').textContent = 'Start Focus';
    }
    
    updatePhaseDisplay();
    updateDisplay();
}

// Display updates
function updateDisplay() {
    const minutes = Math.floor(state.timeRemaining / 60);
    const seconds = state.timeRemaining % 60;
    timerDisplay.textContent = `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
    
    // Update progress ring
    const circumference = 2 * Math.PI * 90;
    const progress = state.timeRemaining / state.totalTime;
    const offset = circumference * (1 - progress);
    progressRing.style.strokeDashoffset = offset;
    
    // Update page title
    if (state.isRunning) {
        document.title = `${timerDisplay.textContent} - Focus Timer`;
    } else {
        document.title = 'Focus Timer | Tim\'s Tools';
    }
}

function updatePhaseDisplay() {
    timerRing.classList.remove('focus', 'break');
    timerPhase.classList.remove('focus', 'break');
    
    if (state.phase === 'focus') {
        timerRing.classList.add('focus');
        timerPhase.classList.add('focus');
        timerPhase.textContent = 'Focus time';
    } else if (state.phase === 'break') {
        timerRing.classList.add('break');
        timerPhase.classList.add('break');
        const isLongBreak = state.currentSession === 0 && history.length > 0;
        timerPhase.textContent = isLongBreak ? 'Long break' : 'Short break';
    }
}

function updateSessionDots() {
    const dots = sessionDots.querySelectorAll('.dot');
    dots.forEach((dot, i) => {
        dot.classList.remove('completed', 'current');
        if (i < state.currentSession) {
            dot.classList.add('completed');
        } else if (i === state.currentSession && state.phase === 'focus') {
            dot.classList.add('current');
        }
    });
    
    // Update number of dots to match settings
    while (dots.length < settings.sessionsUntilLong) {
        const dot = document.createElement('span');
        dot.className = 'dot';
        sessionDots.appendChild(dot);
    }
    while (sessionDots.children.length > settings.sessionsUntilLong) {
        sessionDots.removeChild(sessionDots.lastChild);
    }
}

function updateStats() {
    const today = new Date().toDateString();
    const todayHistory = history.filter(h => 
        new Date(h.completedAt).toDateString() === today
    );
    
    todaySessions.textContent = todayHistory.length;
    todayMinutes.textContent = todayHistory.reduce((sum, h) => sum + h.duration, 0);
    streakDays.textContent = calculateStreak();
}

function calculateStreak() {
    if (history.length === 0) return 0;
    
    const dates = [...new Set(history.map(h => 
        new Date(h.completedAt).toDateString()
    ))];
    
    let streak = 0;
    let checkDate = new Date();
    
    // Check if today has sessions
    const todayStr = checkDate.toDateString();
    if (!dates.includes(todayStr)) {
        // Check if yesterday had sessions (streak not broken yet today)
        checkDate.setDate(checkDate.getDate() - 1);
    }
    
    while (dates.includes(checkDate.toDateString())) {
        streak++;
        checkDate.setDate(checkDate.getDate() - 1);
    }
    
    return streak;
}

function renderWeekChart() {
    const days = [];
    const today = new Date();
    const dayOfWeek = (today.getDay() + 6) % 7; // Monday = 0
    
    // Get Monday of this week
    const monday = new Date(today);
    monday.setDate(today.getDate() - dayOfWeek);
    
    for (let i = 0; i < 7; i++) {
        const date = new Date(monday);
        date.setDate(monday.getDate() + i);
        const dateStr = date.toDateString();
        
        const sessions = history.filter(h => 
            new Date(h.completedAt).toDateString() === dateStr
        );
        
        days.push({
            date: dateStr,
            sessions: sessions.length,
            minutes: sessions.reduce((sum, h) => sum + h.duration, 0),
            isToday: dateStr === today.toDateString()
        });
    }
    
    const maxMinutes = Math.max(...days.map(d => d.minutes), 1);
    
    weekChart.innerHTML = days.map(day => {
        const height = Math.max((day.minutes / maxMinutes) * 100, 4);
        const classes = ['week-bar'];
        if (day.sessions > 0) classes.push('has-sessions');
        if (day.isToday) classes.push('today');
        
        return `
            <div class="${classes.join(' ')}" style="height: ${height}%">
                <div class="week-bar-tooltip">${day.sessions} sessions (${day.minutes}m)</div>
            </div>
        `;
    }).join('');
}

function renderHistory() {
    const recentHistory = history.slice(0, 10);
    
    if (recentHistory.length === 0) {
        historyList.innerHTML = '';
        emptyState.classList.add('visible');
        return;
    }
    
    emptyState.classList.remove('visible');
    
    historyList.innerHTML = recentHistory.map(entry => {
        const date = new Date(entry.completedAt);
        const timeStr = date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
        const dateStr = isToday(date) ? 'Today' : 
                       isYesterday(date) ? 'Yesterday' : 
                       date.toLocaleDateString([], { month: 'short', day: 'numeric' });
        
        return `
            <div class="history-entry">
                <div class="history-icon">✅</div>
                <div class="history-content">
                    <div class="history-task">${escapeHtml(entry.task)}</div>
                    <div class="history-meta">
                        <span class="history-duration">${entry.duration} min</span>
                        <span>${dateStr} at ${timeStr}</span>
                    </div>
                </div>
            </div>
        `;
    }).join('');
}

// Settings
function openSettings() {
    document.getElementById('focusDuration').value = settings.focusDuration;
    document.getElementById('shortBreak').value = settings.shortBreak;
    document.getElementById('longBreak').value = settings.longBreak;
    document.getElementById('sessionsUntilLong').value = settings.sessionsUntilLong;
    document.getElementById('autoStartBreaks').checked = settings.autoStartBreaks;
    document.getElementById('soundEnabled').checked = settings.soundEnabled;
    settingsModal.classList.add('open');
}

function closeSettings() {
    settingsModal.classList.remove('open');
}

function handleSettingsSave(e) {
    e.preventDefault();
    
    settings.focusDuration = parseInt(document.getElementById('focusDuration').value) || 25;
    settings.shortBreak = parseInt(document.getElementById('shortBreak').value) || 5;
    settings.longBreak = parseInt(document.getElementById('longBreak').value) || 15;
    settings.sessionsUntilLong = parseInt(document.getElementById('sessionsUntilLong').value) || 4;
    settings.autoStartBreaks = document.getElementById('autoStartBreaks').checked;
    settings.soundEnabled = document.getElementById('soundEnabled').checked;
    
    saveSettings();
    
    // Reset timer if not running
    if (!state.isRunning && state.phase === 'ready') {
        state.timeRemaining = settings.focusDuration * 60;
        state.totalTime = settings.focusDuration * 60;
        updateDisplay();
    }
    
    updateSessionDots();
    closeSettings();
}

function clearHistory() {
    if (confirm('Clear all session history? This cannot be undone.')) {
        history = [];
        saveData();
        state.currentSession = 0;
        updateStats();
        renderWeekChart();
        renderHistory();
        updateSessionDots();
    }
}

// Notifications
function showNotification(title, body) {
    if ('Notification' in window && Notification.permission === 'granted') {
        new Notification(title, { body, icon: '🎯' });
    }
}

function playNotificationSound() {
    if (!settings.soundEnabled) return;
    
    // Create a simple beep using Web Audio API
    try {
        const audioContext = new (window.AudioContext || window.webkitAudioContext)();
        const oscillator = audioContext.createOscillator();
        const gainNode = audioContext.createGain();
        
        oscillator.connect(gainNode);
        gainNode.connect(audioContext.destination);
        
        oscillator.frequency.value = 800;
        oscillator.type = 'sine';
        
        gainNode.gain.setValueAtTime(0.3, audioContext.currentTime);
        gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.5);
        
        oscillator.start(audioContext.currentTime);
        oscillator.stop(audioContext.currentTime + 0.5);
        
        // Second beep
        setTimeout(() => {
            const osc2 = audioContext.createOscillator();
            const gain2 = audioContext.createGain();
            osc2.connect(gain2);
            gain2.connect(audioContext.destination);
            osc2.frequency.value = 1000;
            osc2.type = 'sine';
            gain2.gain.setValueAtTime(0.3, audioContext.currentTime);
            gain2.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.5);
            osc2.start(audioContext.currentTime);
            osc2.stop(audioContext.currentTime + 0.5);
        }, 200);
    } catch (e) {
        console.log('Audio not supported');
    }
}

// Helpers
function isToday(date) {
    return date.toDateString() === new Date().toDateString();
}

function isYesterday(date) {
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    return date.toDateString() === yesterday.toDateString();
}

function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

// Start the app
init();
