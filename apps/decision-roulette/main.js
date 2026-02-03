// Decision Roulette - Let chaos decide
// Built by Giterdone 😉

const STORAGE_KEY = 'decision-roulette-data';
const COLORS = [
    '#6366f1', '#8b5cf6', '#a855f7', '#d946ef',
    '#ec4899', '#f43f5e', '#ef4444', '#f97316',
    '#f59e0b', '#eab308', '#84cc16', '#22c55e',
    '#10b981', '#14b8a6', '#06b6d4', '#0ea5e9',
    '#3b82f6', '#6366f1'
];

const PRESETS = {
    lunch: ['Pizza', 'Sushi', 'Burgers', 'Salad', 'Tacos', 'Sandwich'],
    dinner: ['Italian', 'Thai', 'Mexican', 'Indian', 'Chinese', 'Steakhouse'],
    activity: ['Netflix', 'Gaming', 'Read a book', 'Go for a walk', 'Work on a project', 'Take a nap'],
    movie: ['Action', 'Comedy', 'Sci-Fi', 'Horror', 'Drama', 'Documentary'],
    coin: ['Heads', 'Tails'],
    dice: ['1', '2', '3', '4', '5', '6']
};

let state = {
    options: [],
    history: [],
    isSpinning: false,
    currentRotation: 0
};

// DOM Elements
const wheelCanvas = document.getElementById('wheelCanvas');
const ctx = wheelCanvas.getContext('2d');
const spinBtn = document.getElementById('spinBtn');
const optionInput = document.getElementById('optionInput');
const addBtn = document.getElementById('addBtn');
const optionsList = document.getElementById('optionsList');
const emptyState = document.getElementById('emptyState');
const resultSection = document.getElementById('resultSection');
const resultValue = document.getElementById('resultValue');
const historyList = document.getElementById('historyList');
const clearHistoryBtn = document.getElementById('clearHistoryBtn');

// Initialize
function init() {
    loadState();
    renderOptions();
    renderHistory();
    drawWheel();
    setupEventListeners();
}

function loadState() {
    try {
        const saved = localStorage.getItem(STORAGE_KEY);
        if (saved) {
            const parsed = JSON.parse(saved);
            state.options = parsed.options || [];
            state.history = parsed.history || [];
        }
    } catch (e) {
        console.error('Failed to load state:', e);
    }
}

function saveState() {
    try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify({
            options: state.options,
            history: state.history
        }));
    } catch (e) {
        console.error('Failed to save state:', e);
    }
}

function setupEventListeners() {
    // Add option
    addBtn.addEventListener('click', addOption);
    optionInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') addOption();
    });

    // Spin wheel
    spinBtn.addEventListener('click', spinWheel);

    // Clear history
    clearHistoryBtn.addEventListener('click', () => {
        state.history = [];
        saveState();
        renderHistory();
    });

    // Presets
    document.querySelectorAll('.btn-preset').forEach(btn => {
        btn.addEventListener('click', () => {
            const preset = btn.dataset.preset;
            if (PRESETS[preset]) {
                state.options = [...PRESETS[preset]];
                saveState();
                renderOptions();
                drawWheel();
                resultSection.classList.add('hidden');
            }
        });
    });
}

function addOption() {
    const text = optionInput.value.trim();
    if (!text) return;
    if (state.options.length >= 20) {
        alert('Maximum 20 options allowed!');
        return;
    }
    if (state.options.includes(text)) {
        alert('This option already exists!');
        return;
    }

    state.options.push(text);
    saveState();
    renderOptions();
    drawWheel();
    optionInput.value = '';
    optionInput.focus();
}

function removeOption(index) {
    state.options.splice(index, 1);
    saveState();
    renderOptions();
    drawWheel();
}

function renderOptions() {
    const hasOptions = state.options.length > 0;
    
    emptyState.style.display = hasOptions ? 'none' : 'block';
    optionsList.style.display = hasOptions ? 'flex' : 'none';
    spinBtn.disabled = state.options.length < 2 || state.isSpinning;

    optionsList.innerHTML = state.options.map((opt, i) => `
        <div class="option-item">
            <span class="color-dot" style="background: ${COLORS[i % COLORS.length]}"></span>
            <span class="option-text">${escapeHtml(opt)}</span>
            <button class="btn-remove" onclick="removeOption(${i})">×</button>
        </div>
    `).join('');
}

function drawWheel(highlightIndex = -1) {
    const centerX = wheelCanvas.width / 2;
    const centerY = wheelCanvas.height / 2;
    const radius = Math.min(centerX, centerY) - 10;

    ctx.clearRect(0, 0, wheelCanvas.width, wheelCanvas.height);

    if (state.options.length === 0) {
        // Empty state wheel
        ctx.beginPath();
        ctx.arc(centerX, centerY, radius, 0, 2 * Math.PI);
        ctx.fillStyle = '#1a1a25';
        ctx.fill();
        ctx.strokeStyle = '#2e2e3e';
        ctx.lineWidth = 2;
        ctx.stroke();

        ctx.fillStyle = '#64748b';
        ctx.font = '16px Inter, sans-serif';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText('Add options to spin!', centerX, centerY);
        return;
    }

    const sliceAngle = (2 * Math.PI) / state.options.length;

    // Save context for rotation
    ctx.save();
    ctx.translate(centerX, centerY);
    ctx.rotate(state.currentRotation * Math.PI / 180);
    ctx.translate(-centerX, -centerY);

    // Draw slices
    state.options.forEach((option, i) => {
        const startAngle = i * sliceAngle - Math.PI / 2;
        const endAngle = startAngle + sliceAngle;

        // Slice
        ctx.beginPath();
        ctx.moveTo(centerX, centerY);
        ctx.arc(centerX, centerY, radius, startAngle, endAngle);
        ctx.closePath();

        // Color with optional highlight
        let color = COLORS[i % COLORS.length];
        if (highlightIndex === i) {
            color = '#ffffff';
        }
        ctx.fillStyle = color;
        ctx.fill();

        // Border
        ctx.strokeStyle = '#0a0a0f';
        ctx.lineWidth = 2;
        ctx.stroke();

        // Text
        ctx.save();
        const textAngle = startAngle + sliceAngle / 2;
        const textRadius = radius * 0.65;
        const textX = centerX + Math.cos(textAngle) * textRadius;
        const textY = centerY + Math.sin(textAngle) * textRadius;

        ctx.translate(textX, textY);
        ctx.rotate(textAngle + Math.PI / 2);

        ctx.fillStyle = highlightIndex === i ? '#0a0a0f' : '#ffffff';
        ctx.font = 'bold 12px Inter, sans-serif';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';

        // Truncate long text
        let displayText = option;
        if (displayText.length > 12) {
            displayText = displayText.substring(0, 11) + '…';
        }
        ctx.fillText(displayText, 0, 0);

        ctx.restore();
    });

    // Center circle
    ctx.beginPath();
    ctx.arc(centerX, centerY, 20, 0, 2 * Math.PI);
    ctx.fillStyle = '#0a0a0f';
    ctx.fill();
    ctx.strokeStyle = '#6366f1';
    ctx.lineWidth = 3;
    ctx.stroke();

    ctx.restore();
}

function spinWheel() {
    if (state.isSpinning || state.options.length < 2) return;

    state.isSpinning = true;
    spinBtn.disabled = true;
    spinBtn.classList.add('spinning');
    resultSection.classList.add('hidden');

    // Random winner
    const winnerIndex = Math.floor(Math.random() * state.options.length);
    const winner = state.options[winnerIndex];

    // Calculate final rotation
    // We need the winner slice to be at the top (where the pointer is)
    const sliceAngle = 360 / state.options.length;
    const targetSliceAngle = winnerIndex * sliceAngle;
    
    // The pointer is at top (270 degrees in canvas terms, or -90)
    // We want the middle of the winner slice to end up there
    // Add extra spins for drama (5-8 full rotations)
    const extraSpins = (5 + Math.random() * 3) * 360;
    const finalRotation = extraSpins + (360 - targetSliceAngle - sliceAngle / 2);

    // Animate!
    const startRotation = state.currentRotation % 360;
    const totalRotation = finalRotation;
    const duration = 4000 + Math.random() * 1000; // 4-5 seconds
    const startTime = performance.now();

    function animate(currentTime) {
        const elapsed = currentTime - startTime;
        const progress = Math.min(elapsed / duration, 1);

        // Easing function (ease out cubic)
        const eased = 1 - Math.pow(1 - progress, 3);

        state.currentRotation = startRotation + totalRotation * eased;
        drawWheel();

        if (progress < 1) {
            requestAnimationFrame(animate);
        } else {
            // Done spinning
            state.isSpinning = false;
            spinBtn.disabled = false;
            spinBtn.classList.remove('spinning');

            // Show result
            showResult(winner);

            // Add to history
            state.history.unshift({
                result: winner,
                timestamp: Date.now()
            });
            // Keep only last 20
            if (state.history.length > 20) {
                state.history = state.history.slice(0, 20);
            }
            saveState();
            renderHistory();
        }
    }

    requestAnimationFrame(animate);
}

function showResult(winner) {
    resultValue.textContent = winner;
    resultSection.classList.remove('hidden');

    // Celebration effect
    resultSection.querySelector('.result-card').style.animation = 'none';
    setTimeout(() => {
        resultSection.querySelector('.result-card').style.animation = 'fadeIn 0.5s ease-out';
    }, 10);
}

function renderHistory() {
    if (state.history.length === 0) {
        historyList.innerHTML = '';
        return;
    }

    historyList.innerHTML = state.history.map(item => `
        <div class="history-item">
            <span class="history-result">${escapeHtml(item.result)}</span>
            <span class="history-time">${formatTime(item.timestamp)}</span>
        </div>
    `).join('');
}

function formatTime(timestamp) {
    const date = new Date(timestamp);
    const now = new Date();
    const diff = now - date;

    if (diff < 60000) return 'Just now';
    if (diff < 3600000) return `${Math.floor(diff / 60000)}m ago`;
    if (diff < 86400000) return `${Math.floor(diff / 3600000)}h ago`;
    return date.toLocaleDateString();
}

function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

// Make removeOption available globally for onclick handlers
window.removeOption = removeOption;

// Start!
init();
