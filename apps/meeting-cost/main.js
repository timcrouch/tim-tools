// Meeting Cost Calculator
// Because nothing kills a pointless meeting faster than watching money burn 💸

const STORAGE_KEY = 'meeting-cost-data';

// Snarky comments based on cost thresholds
const snarkComments = {
    idle: [
        "Add attendees to start calculating the damage.",
        "Empty room, zero cost. If only all meetings were this efficient.",
        "No one's here yet. Rare, but beautiful."
    ],
    low: [
        "Not too painful... yet.",
        "Still cheaper than a nice dinner.",
        "This could still be an email.",
        "Manageable. For now."
    ],
    medium: [
        "Hope someone's taking notes.",
        "That's a decent bottle of wine... burning away.",
        "Did we really need everyone in this room?",
        "The agenda better be worth this.",
        "Remember: decisions get more expensive by the minute."
    ],
    high: [
        "🔥 We could've hired a contractor for this.",
        "At this rate, we're funding someone's vacation.",
        "Is anyone even paying attention?",
        "The ROI of this meeting better be spectacular.",
        "This is approaching 'let's just decide' territory."
    ],
    extreme: [
        "🚨 ABORT MEETING. ABORT.",
        "This meeting costs more than some startups raise.",
        "Quick, someone make a decision. Any decision.",
        "We are literally burning money.",
        "Hope you got a good outcome because WOW.",
        "This better be solving world hunger."
    ]
};

// State
let state = {
    attendees: [],
    meetings: [],
    isRunning: false,
    isPaused: false,
    startTime: null,
    pausedTime: 0,
    elapsedSeconds: 0,
    currentCost: 0
};

let timerInterval = null;
let lastSnarkIndex = -1;

// DOM Elements
const costDisplay = document.getElementById('costDisplay');
const rateDisplay = document.getElementById('rateDisplay');
const timerDisplay = document.getElementById('timerDisplay');
const snarkDisplay = document.getElementById('snarkDisplay');
const startBtn = document.getElementById('startBtn');
const pauseBtn = document.getElementById('pauseBtn');
const endBtn = document.getElementById('endBtn');
const resetBtn = document.getElementById('resetBtn');
const addAttendeeBtn = document.getElementById('addAttendeeBtn');
const attendeesList = document.getElementById('attendeesList');
const emptyAttendees = document.getElementById('emptyAttendees');
const historyList = document.getElementById('historyList');
const emptyHistory = document.getElementById('emptyHistory');
const clearHistoryBtn = document.getElementById('clearHistoryBtn');
const meetingTopic = document.getElementById('meetingTopic');

// Modal elements
const attendeeModal = document.getElementById('attendeeModal');
const attendeeForm = document.getElementById('attendeeForm');
const attendeeName = document.getElementById('attendeeName');
const attendeeRate = document.getElementById('attendeeRate');
const cancelAttendee = document.getElementById('cancelAttendee');

// Stats elements
const totalMeetings = document.getElementById('totalMeetings');
const totalCost = document.getElementById('totalCost');
const totalTime = document.getElementById('totalTime');

// Initialize
function init() {
    loadState();
    renderAttendees();
    renderHistory();
    updateStats();
    updateRateDisplay();
    updateSnark('idle');
    
    // Restore running meeting if page was refreshed
    if (state.isRunning && state.startTime) {
        resumeTimer();
    }
}

// Local Storage
function loadState() {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
        const parsed = JSON.parse(saved);
        state = { ...state, ...parsed };
    }
}

function saveState() {
    localStorage.setItem(STORAGE_KEY, JSON.stringify({
        attendees: state.attendees,
        meetings: state.meetings,
        isRunning: state.isRunning,
        isPaused: state.isPaused,
        startTime: state.startTime,
        pausedTime: state.pausedTime
    }));
}

// Attendee Management
function addAttendee(name, rate) {
    const id = Date.now().toString(36) + Math.random().toString(36).substr(2);
    state.attendees.push({ id, name, rate: parseFloat(rate) });
    saveState();
    renderAttendees();
    updateRateDisplay();
    if (!state.isRunning) {
        updateSnark('idle');
    }
}

function removeAttendee(id) {
    state.attendees = state.attendees.filter(a => a.id !== id);
    saveState();
    renderAttendees();
    updateRateDisplay();
    if (!state.isRunning) {
        updateSnark('idle');
    }
}

function renderAttendees() {
    if (state.attendees.length === 0) {
        attendeesList.innerHTML = '';
        emptyAttendees.classList.add('visible');
        return;
    }
    
    emptyAttendees.classList.remove('visible');
    attendeesList.innerHTML = state.attendees.map(a => `
        <div class="attendee-card" data-id="${a.id}">
            <div class="attendee-info">
                <div class="attendee-avatar">${getInitials(a.name)}</div>
                <div>
                    <div class="attendee-name">${escapeHtml(a.name)}</div>
                    <div class="attendee-rate">€${a.rate.toFixed(0)}/h</div>
                </div>
            </div>
            <button class="attendee-remove" onclick="removeAttendee('${a.id}')" title="Remove">✕</button>
        </div>
    `).join('');
}

function getInitials(name) {
    return name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);
}

// Rate Calculations
function getTotalHourlyRate() {
    return state.attendees.reduce((sum, a) => sum + a.rate, 0);
}

function getMinuteRate() {
    return getTotalHourlyRate() / 60;
}

function getSecondRate() {
    return getTotalHourlyRate() / 3600;
}

function updateRateDisplay() {
    const rate = getMinuteRate();
    const count = state.attendees.length;
    rateDisplay.textContent = `€${rate.toFixed(2)}/min with ${count} attendee${count !== 1 ? 's' : ''}`;
}

// Timer Functions
function startTimer() {
    if (state.attendees.length === 0) {
        snarkDisplay.textContent = "Can't start a meeting with no one in the room. 🤔";
        return;
    }
    
    state.isRunning = true;
    state.isPaused = false;
    state.startTime = Date.now();
    state.pausedTime = 0;
    
    startBtn.classList.add('hidden');
    pauseBtn.classList.remove('hidden');
    endBtn.classList.remove('hidden');
    
    costDisplay.classList.add('running');
    
    runTimer();
    saveState();
}

function resumeTimer() {
    startBtn.classList.add('hidden');
    pauseBtn.classList.remove('hidden');
    endBtn.classList.remove('hidden');
    
    if (!state.isPaused) {
        costDisplay.classList.add('running');
        runTimer();
    } else {
        pauseBtn.textContent = '▶ Resume';
    }
}

function runTimer() {
    timerInterval = setInterval(() => {
        updateTimer();
    }, 100); // Update frequently for smooth cost display
}

function updateTimer() {
    const now = Date.now();
    const elapsed = (now - state.startTime - state.pausedTime) / 1000;
    state.elapsedSeconds = elapsed;
    
    // Update time display
    const hours = Math.floor(elapsed / 3600);
    const minutes = Math.floor((elapsed % 3600) / 60);
    const seconds = Math.floor(elapsed % 60);
    timerDisplay.textContent = `${pad(hours)}:${pad(minutes)}:${pad(seconds)}`;
    
    // Update cost
    state.currentCost = elapsed * getSecondRate();
    costDisplay.textContent = `€${state.currentCost.toFixed(2)}`;
    
    // Update visual state based on cost
    updateCostVisuals();
    
    // Update snark periodically (every 30 seconds or so)
    if (Math.floor(elapsed) % 30 === 0 && Math.floor(elapsed) > 0) {
        updateSnark(getCostLevel());
    }
}

function getCostLevel() {
    const cost = state.currentCost;
    if (cost < 50) return 'low';
    if (cost < 200) return 'medium';
    if (cost < 500) return 'high';
    return 'extreme';
}

function updateCostVisuals() {
    const cost = state.currentCost;
    if (cost > 200) {
        costDisplay.classList.add('burning');
    } else {
        costDisplay.classList.remove('burning');
    }
}

function updateSnark(level) {
    const comments = snarkComments[level];
    if (!comments || comments.length === 0) return;
    
    // Avoid repeating the same comment
    let index;
    do {
        index = Math.floor(Math.random() * comments.length);
    } while (index === lastSnarkIndex && comments.length > 1);
    
    lastSnarkIndex = index;
    snarkDisplay.textContent = comments[index];
}

function pauseTimer() {
    if (state.isPaused) {
        // Resume
        state.isPaused = false;
        state.startTime = Date.now() - (state.elapsedSeconds * 1000);
        state.pausedTime = 0;
        pauseBtn.innerHTML = '<span class="btn-icon">⏸</span><span class="btn-text">Pause</span>';
        costDisplay.classList.add('running');
        runTimer();
    } else {
        // Pause
        state.isPaused = true;
        clearInterval(timerInterval);
        pauseBtn.innerHTML = '<span class="btn-icon">▶</span><span class="btn-text">Resume</span>';
        costDisplay.classList.remove('running');
        snarkDisplay.textContent = "Paused. The meter's not running... but time still is.";
    }
    saveState();
}

function endMeeting() {
    clearInterval(timerInterval);
    
    // Save meeting to history
    const meeting = {
        id: Date.now().toString(36),
        topic: meetingTopic.value || 'Untitled Meeting',
        attendees: state.attendees.map(a => ({ name: a.name, rate: a.rate })),
        attendeeCount: state.attendees.length,
        duration: state.elapsedSeconds,
        cost: state.currentCost,
        date: new Date().toISOString()
    };
    
    state.meetings.unshift(meeting);
    
    // Keep only last 50 meetings
    if (state.meetings.length > 50) {
        state.meetings = state.meetings.slice(0, 50);
    }
    
    // Reset timer state
    state.isRunning = false;
    state.isPaused = false;
    state.startTime = null;
    state.pausedTime = 0;
    
    saveState();
    
    // Update UI
    resetTimerUI();
    renderHistory();
    updateStats();
    
    // Final snark
    if (state.currentCost > 500) {
        snarkDisplay.textContent = `€${state.currentCost.toFixed(2)} burned. Hope it was worth it! 🔥`;
    } else if (state.currentCost > 100) {
        snarkDisplay.textContent = `Meeting ended at €${state.currentCost.toFixed(2)}. Could've been worse!`;
    } else {
        snarkDisplay.textContent = `€${state.currentCost.toFixed(2)} — quick and efficient. Well done! ✨`;
    }
    
    state.elapsedSeconds = 0;
    state.currentCost = 0;
}

function resetTimer() {
    clearInterval(timerInterval);
    
    state.isRunning = false;
    state.isPaused = false;
    state.startTime = null;
    state.pausedTime = 0;
    state.elapsedSeconds = 0;
    state.currentCost = 0;
    
    saveState();
    resetTimerUI();
    updateSnark('idle');
}

function resetTimerUI() {
    startBtn.classList.remove('hidden');
    pauseBtn.classList.add('hidden');
    endBtn.classList.add('hidden');
    pauseBtn.innerHTML = '<span class="btn-icon">⏸</span><span class="btn-text">Pause</span>';
    
    costDisplay.textContent = '€0.00';
    costDisplay.classList.remove('running', 'burning');
    timerDisplay.textContent = '00:00:00';
    meetingTopic.value = '';
}

// History
function renderHistory() {
    if (state.meetings.length === 0) {
        historyList.innerHTML = '';
        emptyHistory.classList.add('visible');
        return;
    }
    
    emptyHistory.classList.remove('visible');
    historyList.innerHTML = state.meetings.slice(0, 20).map(m => {
        const date = new Date(m.date);
        const duration = formatDuration(m.duration);
        return `
            <div class="history-entry">
                <div class="history-icon">📋</div>
                <div class="history-content">
                    <div class="history-topic">${escapeHtml(m.topic)}</div>
                    <div class="history-meta">
                        <span>${date.toLocaleDateString()} ${date.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}</span>
                        <span>${m.attendeeCount} attendee${m.attendeeCount !== 1 ? 's' : ''}</span>
                        <span>${duration}</span>
                        <span class="history-cost">€${m.cost.toFixed(2)}</span>
                    </div>
                </div>
            </div>
        `;
    }).join('');
}

function clearHistory() {
    if (confirm('Clear all meeting history? This cannot be undone.')) {
        state.meetings = [];
        saveState();
        renderHistory();
        updateStats();
    }
}

// Stats
function updateStats() {
    const meetings = state.meetings;
    const total = meetings.length;
    const cost = meetings.reduce((sum, m) => sum + m.cost, 0);
    const time = meetings.reduce((sum, m) => sum + m.duration, 0);
    
    totalMeetings.textContent = total;
    totalCost.textContent = `€${cost >= 1000 ? (cost/1000).toFixed(1) + 'k' : cost.toFixed(0)}`;
    totalTime.textContent = formatDuration(time);
}

// Utilities
function pad(n) {
    return n.toString().padStart(2, '0');
}

function formatDuration(seconds) {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    
    if (hours > 0) {
        return `${hours}h ${minutes}m`;
    }
    return `${minutes}m`;
}

function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

// Event Listeners
startBtn.addEventListener('click', startTimer);
pauseBtn.addEventListener('click', pauseTimer);
endBtn.addEventListener('click', endMeeting);
resetBtn.addEventListener('click', resetTimer);
clearHistoryBtn.addEventListener('click', clearHistory);

// Modal handlers
addAttendeeBtn.addEventListener('click', () => {
    attendeeName.value = '';
    attendeeRate.value = '';
    attendeeModal.classList.add('open');
    attendeeName.focus();
});

cancelAttendee.addEventListener('click', () => {
    attendeeModal.classList.remove('open');
});

attendeeForm.addEventListener('submit', (e) => {
    e.preventDefault();
    addAttendee(attendeeName.value, attendeeRate.value);
    attendeeModal.classList.remove('open');
});

attendeeModal.addEventListener('click', (e) => {
    if (e.target === attendeeModal) {
        attendeeModal.classList.remove('open');
    }
});

// Quick add preset buttons
document.querySelectorAll('.btn-preset').forEach(btn => {
    btn.addEventListener('click', () => {
        const role = btn.dataset.role;
        const rate = btn.dataset.rate;
        addAttendee(role, rate);
    });
});

// Keyboard shortcuts
document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
        attendeeModal.classList.remove('open');
    }
    
    // Don't trigger shortcuts when typing
    if (e.target.tagName === 'INPUT') return;
    
    if (e.key === ' ' || e.code === 'Space') {
        e.preventDefault();
        if (!state.isRunning) {
            startTimer();
        } else {
            pauseTimer();
        }
    }
});

// Make removeAttendee available globally for onclick
window.removeAttendee = removeAttendee;

// Initialize on load
document.addEventListener('DOMContentLoaded', init);
