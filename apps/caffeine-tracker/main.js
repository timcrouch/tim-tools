// Caffeine Half-Life Tracker
// Built by Giterdone 😉

const STORAGE_KEY = 'caffeine-tracker';
const SETTINGS_KEY = 'caffeine-settings';

// Default settings
const defaultSettings = {
    halfLife: 5, // hours
    bedtime: '23:00',
    maxDaily: 400 // mg
};

// State
let entries = [];
let settings = { ...defaultSettings };

// DOM Elements
const currentCaffeineEl = document.getElementById('currentCaffeine');
const caffeineBarEl = document.getElementById('caffeineBar');
const caffeineStatusEl = document.getElementById('caffeineStatus');
const sleepIconEl = document.getElementById('sleepIcon');
const sleepForecastEl = document.getElementById('sleepForecast');
const dailyTotalEl = document.getElementById('dailyTotal');
const logListEl = document.getElementById('logList');
const emptyStateEl = document.getElementById('emptyState');
const customModal = document.getElementById('customModal');
const settingsModal = document.getElementById('settingsModal');

// Initialize
document.addEventListener('DOMContentLoaded', () => {
    loadData();
    loadSettings();
    setupEventListeners();
    render();
    
    // Update every minute
    setInterval(render, 60000);
});

function loadData() {
    const today = getToday();
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
        const data = JSON.parse(stored);
        // Filter to today's entries + entries from last 24h for decay calc
        const cutoff = Date.now() - (24 * 60 * 60 * 1000);
        entries = data.filter(e => e.timestamp > cutoff);
    }
}

function saveData() {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(entries));
}

function loadSettings() {
    const stored = localStorage.getItem(SETTINGS_KEY);
    if (stored) {
        settings = { ...defaultSettings, ...JSON.parse(stored) };
    }
    // Populate settings form
    document.getElementById('halfLife').value = settings.halfLife;
    document.getElementById('bedtime').value = settings.bedtime;
    document.getElementById('maxDaily').value = settings.maxDaily;
}

function saveSettings() {
    localStorage.setItem(SETTINGS_KEY, JSON.stringify(settings));
}

function getToday() {
    return new Date().toISOString().split('T')[0];
}

function getTodayEntries() {
    const todayStart = new Date();
    todayStart.setHours(0, 0, 0, 0);
    return entries.filter(e => e.timestamp >= todayStart.getTime());
}

// Calculate remaining caffeine from a single entry
function calculateRemaining(entry, atTime = Date.now()) {
    const hoursElapsed = (atTime - entry.timestamp) / (1000 * 60 * 60);
    const halfLives = hoursElapsed / settings.halfLife;
    return entry.mg * Math.pow(0.5, halfLives);
}

// Calculate total caffeine in system
function calculateTotalCaffeine(atTime = Date.now()) {
    return entries.reduce((total, entry) => {
        return total + calculateRemaining(entry, atTime);
    }, 0);
}

// Get caffeine level at bedtime
function getCaffeineAtBedtime() {
    const now = new Date();
    const [hours, mins] = settings.bedtime.split(':').map(Number);
    let bedtime = new Date();
    bedtime.setHours(hours, mins, 0, 0);
    
    // If bedtime has passed, use tomorrow
    if (bedtime < now) {
        bedtime.setDate(bedtime.getDate() + 1);
    }
    
    return calculateTotalCaffeine(bedtime.getTime());
}

function addEntry(name, mg) {
    entries.push({
        id: Date.now(),
        name,
        mg,
        timestamp: Date.now()
    });
    saveData();
    render();
}

function deleteEntry(id) {
    entries = entries.filter(e => e.id !== id);
    saveData();
    render();
}

function clearToday() {
    const todayStart = new Date();
    todayStart.setHours(0, 0, 0, 0);
    entries = entries.filter(e => e.timestamp < todayStart.getTime());
    saveData();
    render();
}

function setupEventListeners() {
    // Drink buttons
    document.querySelectorAll('.drink-btn:not(.custom)').forEach(btn => {
        btn.addEventListener('click', () => {
            const mg = parseInt(btn.dataset.mg);
            const name = btn.dataset.name;
            addEntry(name, mg);
            
            // Visual feedback
            btn.classList.add('added');
            setTimeout(() => btn.classList.remove('added'), 300);
        });
    });
    
    // Custom button
    document.getElementById('customBtn').addEventListener('click', () => {
        customModal.classList.add('open');
    });
    
    // Custom form
    document.getElementById('customForm').addEventListener('submit', (e) => {
        e.preventDefault();
        const name = document.getElementById('customName').value;
        const mg = parseInt(document.getElementById('customMg').value);
        addEntry(name, mg);
        customModal.classList.remove('open');
        e.target.reset();
    });
    
    document.getElementById('cancelCustom').addEventListener('click', () => {
        customModal.classList.remove('open');
    });
    
    // Settings
    document.getElementById('settingsBtn').addEventListener('click', () => {
        settingsModal.classList.add('open');
    });
    
    document.getElementById('settingsForm').addEventListener('submit', (e) => {
        e.preventDefault();
        settings.halfLife = parseFloat(document.getElementById('halfLife').value);
        settings.bedtime = document.getElementById('bedtime').value;
        settings.maxDaily = parseInt(document.getElementById('maxDaily').value);
        saveSettings();
        settingsModal.classList.remove('open');
        render();
    });
    
    document.getElementById('cancelSettings').addEventListener('click', () => {
        settingsModal.classList.remove('open');
        loadSettings(); // Reset form
    });
    
    // Clear today
    document.getElementById('clearToday').addEventListener('click', () => {
        if (confirm('Clear all caffeine logged today?')) {
            clearToday();
        }
    });
    
    // Close modals on backdrop click
    [customModal, settingsModal].forEach(modal => {
        modal.addEventListener('click', (e) => {
            if (e.target === modal) {
                modal.classList.remove('open');
            }
        });
    });
}

function render() {
    renderStatus();
    renderLog();
    renderChart();
}

function renderStatus() {
    const currentCaffeine = Math.round(calculateTotalCaffeine());
    const todayTotal = getTodayEntries().reduce((sum, e) => sum + e.mg, 0);
    const caffeineAtBedtime = Math.round(getCaffeineAtBedtime());
    
    // Current caffeine meter
    currentCaffeineEl.textContent = currentCaffeine;
    
    // Bar (max at 400mg for display)
    const barPercent = Math.min((currentCaffeine / 400) * 100, 100);
    caffeineBarEl.style.width = `${barPercent}%`;
    
    // Status text
    if (currentCaffeine === 0) {
        caffeineStatusEl.textContent = 'Caffeine-free! Time for coffee?';
    } else if (currentCaffeine < 50) {
        caffeineStatusEl.textContent = 'Just a hint of caffeine';
    } else if (currentCaffeine < 100) {
        caffeineStatusEl.textContent = 'Pleasantly alert';
    } else if (currentCaffeine < 200) {
        caffeineStatusEl.textContent = 'Nicely caffeinated';
    } else if (currentCaffeine < 300) {
        caffeineStatusEl.textContent = 'Feeling wired!';
    } else if (currentCaffeine < 400) {
        caffeineStatusEl.textContent = 'Maximum focus mode';
    } else {
        caffeineStatusEl.textContent = '⚠️ Easy there, tiger!';
    }
    
    // Sleep forecast
    if (entries.length === 0) {
        sleepIconEl.textContent = '😴';
        sleepForecastEl.textContent = 'Add some caffeine to find out';
        sleepForecastEl.className = 'forecast-value';
    } else if (caffeineAtBedtime < 25) {
        sleepIconEl.textContent = '😴';
        sleepForecastEl.textContent = `${caffeineAtBedtime}mg at bedtime — Sleep tight!`;
        sleepForecastEl.className = 'forecast-value success';
    } else if (caffeineAtBedtime < 50) {
        sleepIconEl.textContent = '🙂';
        sleepForecastEl.textContent = `${caffeineAtBedtime}mg at bedtime — Should be fine`;
        sleepForecastEl.className = 'forecast-value';
    } else if (caffeineAtBedtime < 100) {
        sleepIconEl.textContent = '😬';
        sleepForecastEl.textContent = `${caffeineAtBedtime}mg at bedtime — Might be restless`;
        sleepForecastEl.className = 'forecast-value warning';
    } else {
        sleepIconEl.textContent = '🦉';
        sleepForecastEl.textContent = `${caffeineAtBedtime}mg at bedtime — Owl mode activated`;
        sleepForecastEl.className = 'forecast-value danger';
    }
    
    // Daily total
    dailyTotalEl.textContent = todayTotal;
    const totalEl = dailyTotalEl.parentElement;
    totalEl.className = 'daily-total';
    if (todayTotal >= settings.maxDaily) {
        totalEl.classList.add('danger');
    } else if (todayTotal >= settings.maxDaily * 0.75) {
        totalEl.classList.add('warning');
    }
}

function renderLog() {
    const todayEntries = getTodayEntries().sort((a, b) => b.timestamp - a.timestamp);
    
    if (todayEntries.length === 0) {
        logListEl.innerHTML = '';
        emptyStateEl.classList.add('visible');
        return;
    }
    
    emptyStateEl.classList.remove('visible');
    
    logListEl.innerHTML = todayEntries.map(entry => {
        const time = new Date(entry.timestamp).toLocaleTimeString('en-US', { 
            hour: 'numeric', 
            minute: '2-digit',
            hour12: true 
        });
        const remaining = Math.round(calculateRemaining(entry));
        
        return `
            <div class="log-entry" data-id="${entry.id}">
                <span class="log-time">${time}</span>
                <span class="log-name">${entry.name}</span>
                <span class="log-mg">${entry.mg}mg</span>
                <span class="log-remaining">(${remaining}mg left)</span>
                <button class="log-delete" onclick="deleteEntry(${entry.id})">✕</button>
            </div>
        `;
    }).join('');
}

function renderChart() {
    const canvas = document.getElementById('decayChart');
    const ctx = canvas.getContext('2d');
    
    // Set canvas size
    const rect = canvas.parentElement.getBoundingClientRect();
    canvas.width = rect.width * 2;
    canvas.height = 200 * 2;
    ctx.scale(2, 2);
    
    const width = rect.width;
    const height = 200;
    const padding = { top: 20, right: 20, bottom: 30, left: 50 };
    const chartWidth = width - padding.left - padding.right;
    const chartHeight = height - padding.top - padding.bottom;
    
    // Clear
    ctx.clearRect(0, 0, width, height);
    
    // Generate data points for next 24 hours
    const now = Date.now();
    const points = [];
    let maxCaffeine = 100; // Minimum scale
    
    for (let h = 0; h <= 24; h++) {
        const time = now + (h * 60 * 60 * 1000);
        const caffeine = calculateTotalCaffeine(time);
        points.push({ hour: h, caffeine });
        maxCaffeine = Math.max(maxCaffeine, caffeine);
    }
    
    // Round up max for nice scale
    maxCaffeine = Math.ceil(maxCaffeine / 50) * 50;
    
    // Draw grid
    ctx.strokeStyle = '#2a2a3a';
    ctx.lineWidth = 1;
    
    // Horizontal grid lines
    for (let i = 0; i <= 4; i++) {
        const y = padding.top + (chartHeight * i / 4);
        ctx.beginPath();
        ctx.moveTo(padding.left, y);
        ctx.lineTo(width - padding.right, y);
        ctx.stroke();
        
        // Labels
        const value = Math.round(maxCaffeine * (4 - i) / 4);
        ctx.fillStyle = '#71717a';
        ctx.font = '10px Inter, sans-serif';
        ctx.textAlign = 'right';
        ctx.fillText(`${value}`, padding.left - 8, y + 3);
    }
    
    // Time labels
    ctx.textAlign = 'center';
    for (let h = 0; h <= 24; h += 6) {
        const x = padding.left + (chartWidth * h / 24);
        const time = new Date(now + (h * 60 * 60 * 1000));
        const label = h === 0 ? 'Now' : time.toLocaleTimeString('en-US', { hour: 'numeric', hour12: true });
        ctx.fillText(label, x, height - 8);
    }
    
    // Draw bedtime line
    const [bedHour, bedMin] = settings.bedtime.split(':').map(Number);
    let bedtime = new Date();
    bedtime.setHours(bedHour, bedMin, 0, 0);
    if (bedtime < now) bedtime.setDate(bedtime.getDate() + 1);
    const hoursUntilBed = (bedtime.getTime() - now) / (1000 * 60 * 60);
    
    if (hoursUntilBed <= 24) {
        const bedX = padding.left + (chartWidth * hoursUntilBed / 24);
        ctx.strokeStyle = '#8b5cf6';
        ctx.setLineDash([5, 5]);
        ctx.beginPath();
        ctx.moveTo(bedX, padding.top);
        ctx.lineTo(bedX, height - padding.bottom);
        ctx.stroke();
        ctx.setLineDash([]);
        
        // Bedtime label
        ctx.fillStyle = '#8b5cf6';
        ctx.fillText('🛏️', bedX, padding.top - 5);
    }
    
    // Draw curve
    if (points.length > 0 && points[0].caffeine > 0) {
        ctx.beginPath();
        ctx.strokeStyle = '#d4a574';
        ctx.lineWidth = 2;
        
        points.forEach((point, i) => {
            const x = padding.left + (chartWidth * point.hour / 24);
            const y = padding.top + chartHeight - (chartHeight * point.caffeine / maxCaffeine);
            
            if (i === 0) {
                ctx.moveTo(x, y);
            } else {
                ctx.lineTo(x, y);
            }
        });
        
        ctx.stroke();
        
        // Fill under curve
        const lastPoint = points[points.length - 1];
        ctx.lineTo(padding.left + chartWidth, height - padding.bottom);
        ctx.lineTo(padding.left, height - padding.bottom);
        ctx.closePath();
        
        const gradient = ctx.createLinearGradient(0, padding.top, 0, height - padding.bottom);
        gradient.addColorStop(0, 'rgba(212, 165, 116, 0.3)');
        gradient.addColorStop(1, 'rgba(212, 165, 116, 0)');
        ctx.fillStyle = gradient;
        ctx.fill();
    }
}

// Make deleteEntry available globally
window.deleteEntry = deleteEntry;
