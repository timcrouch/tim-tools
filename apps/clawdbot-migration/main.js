// Clawdbot Migration Checklist - Interactive Logic

const STORAGE_KEY = 'clawdbot-migration-checklist';

// Initialize on page load
document.addEventListener('DOMContentLoaded', () => {
    loadState();
    attachEventListeners();
    updateProgress();
});

// Load saved state from localStorage
function loadState() {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
        const state = JSON.parse(saved);
        Object.entries(state).forEach(([taskId, completed]) => {
            const checkbox = document.querySelector(`[data-id="${taskId}"] input`);
            if (checkbox) {
                checkbox.checked = completed;
                if (completed) {
                    checkbox.closest('.task').classList.add('completed');
                }
            }
        });
    }
}

// Save state to localStorage
function saveState() {
    const state = {};
    document.querySelectorAll('.task').forEach(task => {
        const taskId = task.dataset.id;
        const checkbox = task.querySelector('input');
        state[taskId] = checkbox.checked;
    });
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
}

// Attach event listeners
function attachEventListeners() {
    // Checkbox changes
    document.querySelectorAll('.task input').forEach(checkbox => {
        checkbox.addEventListener('change', (e) => {
            const task = e.target.closest('.task');
            task.classList.toggle('completed', e.target.checked);
            saveState();
            updateProgress();
            checkPhaseCompletion(task.closest('.phase'));
        });
    });

    // Reset button
    document.getElementById('resetBtn').addEventListener('click', () => {
        if (confirm('Reset all tasks? This cannot be undone.')) {
            localStorage.removeItem(STORAGE_KEY);
            document.querySelectorAll('.task input').forEach(cb => {
                cb.checked = false;
                cb.closest('.task').classList.remove('completed');
            });
            document.querySelectorAll('.phase').forEach(phase => {
                phase.classList.remove('completed');
            });
            updateProgress();
        }
    });
}

// Update progress bar
function updateProgress() {
    const total = document.querySelectorAll('.task').length;
    const completed = document.querySelectorAll('.task input:checked').length;
    const percentage = total > 0 ? (completed / total) * 100 : 0;

    document.getElementById('progressBar').style.width = `${percentage}%`;
    document.getElementById('completed').textContent = completed;
    document.getElementById('total').textContent = total;

    // Check all phases
    document.querySelectorAll('.phase').forEach(checkPhaseCompletion);
}

// Check if a phase is complete
function checkPhaseCompletion(phase) {
    const tasks = phase.querySelectorAll('.task input');
    const allComplete = Array.from(tasks).every(cb => cb.checked);
    phase.classList.toggle('completed', allComplete);
}

// Copy command to clipboard (could add this feature)
document.addEventListener('click', (e) => {
    if (e.target.tagName === 'CODE') {
        const text = e.target.textContent;
        navigator.clipboard.writeText(text).then(() => {
            // Visual feedback
            const original = e.target.textContent;
            e.target.textContent = '✓ Copied!';
            e.target.style.color = '#10b981';
            setTimeout(() => {
                e.target.textContent = original;
                e.target.style.color = '';
            }, 1500);
        });
    }
});
