// Task Manager - localStorage only
const STORAGE_KEY = 'tim-tools-tasks';

let tasks = [];
let currentFilter = 'all';
let currentSort = 'created';

// DOM Elements
const taskForm = document.getElementById('taskForm');
const taskList = document.getElementById('taskList');
const emptyState = document.getElementById('emptyState');
const progressBar = document.getElementById('progressBar');
const completedCount = document.getElementById('completed');
const totalCount = document.getElementById('total');
const editModal = document.getElementById('editModal');
const editForm = document.getElementById('editForm');

// Initialize
document.addEventListener('DOMContentLoaded', () => {
    loadTasks();
    renderTasks();
    setupEventListeners();
});

function setupEventListeners() {
    // Add task
    taskForm.addEventListener('submit', handleAddTask);
    
    // Filters
    document.querySelectorAll('.filter-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            currentFilter = btn.dataset.filter;
            renderTasks();
        });
    });
    
    // Sort
    document.getElementById('sortBy').addEventListener('change', (e) => {
        currentSort = e.target.value;
        renderTasks();
    });
    
    // Clear completed
    document.getElementById('clearCompleted').addEventListener('click', clearCompleted);
    
    // Export/Import
    document.getElementById('exportBtn').addEventListener('click', exportTasks);
    document.getElementById('importBtn').addEventListener('click', () => {
        document.getElementById('importFile').click();
    });
    document.getElementById('importFile').addEventListener('change', importTasks);
    
    // Edit modal
    document.getElementById('cancelEdit').addEventListener('click', closeEditModal);
    editForm.addEventListener('submit', handleEditTask);
    editModal.addEventListener('click', (e) => {
        if (e.target === editModal) closeEditModal();
    });
}

// Task CRUD
function handleAddTask(e) {
    e.preventDefault();
    
    const title = document.getElementById('taskTitle').value.trim();
    const due = document.getElementById('taskDue').value;
    const priority = document.getElementById('taskPriority').value;
    const category = document.getElementById('taskCategory').value;
    
    if (!title) return;
    
    const task = {
        id: Date.now().toString(),
        title,
        due: due || null,
        priority,
        category,
        completed: false,
        createdAt: new Date().toISOString()
    };
    
    tasks.unshift(task);
    saveTasks();
    renderTasks();
    
    // Reset form
    taskForm.reset();
    document.getElementById('taskPriority').value = 'medium';
}

function toggleTask(id) {
    const task = tasks.find(t => t.id === id);
    if (task) {
        task.completed = !task.completed;
        saveTasks();
        renderTasks();
    }
}

function deleteTask(id) {
    tasks = tasks.filter(t => t.id !== id);
    saveTasks();
    renderTasks();
}

function openEditModal(id) {
    const task = tasks.find(t => t.id === id);
    if (!task) return;
    
    document.getElementById('editId').value = task.id;
    document.getElementById('editTitle').value = task.title;
    document.getElementById('editDue').value = task.due || '';
    document.getElementById('editPriority').value = task.priority;
    document.getElementById('editCategory').value = task.category;
    
    editModal.classList.add('open');
}

function closeEditModal() {
    editModal.classList.remove('open');
}

function handleEditTask(e) {
    e.preventDefault();
    
    const id = document.getElementById('editId').value;
    const task = tasks.find(t => t.id === id);
    if (!task) return;
    
    task.title = document.getElementById('editTitle').value.trim();
    task.due = document.getElementById('editDue').value || null;
    task.priority = document.getElementById('editPriority').value;
    task.category = document.getElementById('editCategory').value;
    
    saveTasks();
    renderTasks();
    closeEditModal();
}

function clearCompleted() {
    tasks = tasks.filter(t => !t.completed);
    saveTasks();
    renderTasks();
}

// Storage
function loadTasks() {
    try {
        const stored = localStorage.getItem(STORAGE_KEY);
        tasks = stored ? JSON.parse(stored) : [];
    } catch (e) {
        console.error('Failed to load tasks:', e);
        tasks = [];
    }
}

function saveTasks() {
    try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(tasks));
    } catch (e) {
        console.error('Failed to save tasks:', e);
    }
}

// Export/Import
function exportTasks() {
    const data = JSON.stringify(tasks, null, 2);
    const blob = new Blob([data], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    
    const a = document.createElement('a');
    a.href = url;
    a.download = `tasks-${new Date().toISOString().split('T')[0]}.json`;
    a.click();
    
    URL.revokeObjectURL(url);
}

function importTasks(e) {
    const file = e.target.files[0];
    if (!file) return;
    
    const reader = new FileReader();
    reader.onload = (event) => {
        try {
            const imported = JSON.parse(event.target.result);
            if (Array.isArray(imported)) {
                tasks = [...imported, ...tasks];
                saveTasks();
                renderTasks();
                alert(`Imported ${imported.length} tasks!`);
            }
        } catch (err) {
            alert('Failed to import: Invalid JSON file');
        }
    };
    reader.readAsText(file);
    e.target.value = '';
}

// Render
function renderTasks() {
    let filtered = [...tasks];
    
    // Filter
    if (currentFilter === 'active') {
        filtered = filtered.filter(t => !t.completed);
    } else if (currentFilter === 'completed') {
        filtered = filtered.filter(t => t.completed);
    }
    
    // Sort
    filtered.sort((a, b) => {
        switch (currentSort) {
            case 'due':
                if (!a.due) return 1;
                if (!b.due) return -1;
                return new Date(a.due) - new Date(b.due);
            case 'priority':
                const order = { high: 0, medium: 1, low: 2 };
                return order[a.priority] - order[b.priority];
            default: // created
                return new Date(b.createdAt) - new Date(a.createdAt);
        }
    });
    
    // Render
    if (filtered.length === 0) {
        taskList.innerHTML = '';
        emptyState.classList.add('visible');
    } else {
        emptyState.classList.remove('visible');
        taskList.innerHTML = filtered.map(renderTaskItem).join('');
        
        // Attach event listeners
        taskList.querySelectorAll('.task-checkbox').forEach(checkbox => {
            checkbox.addEventListener('click', () => toggleTask(checkbox.dataset.id));
        });
        taskList.querySelectorAll('.edit-btn').forEach(btn => {
            btn.addEventListener('click', () => openEditModal(btn.dataset.id));
        });
        taskList.querySelectorAll('.delete-btn').forEach(btn => {
            btn.addEventListener('click', () => deleteTask(btn.dataset.id));
        });
    }
    
    updateProgress();
}

function renderTaskItem(task) {
    const isOverdue = task.due && !task.completed && new Date(task.due) < new Date();
    const dueText = task.due ? formatDate(task.due) : '';
    
    return `
        <div class="task-item ${task.completed ? 'completed' : ''}">
            <div class="task-checkbox ${task.completed ? 'checked' : ''}" data-id="${task.id}"></div>
            <span class="priority-indicator priority-${task.priority}"></span>
            <div class="task-content">
                <div class="task-title">${escapeHtml(task.title)}</div>
                <div class="task-meta">
                    ${dueText ? `<span class="${isOverdue ? 'overdue' : ''}">📅 ${dueText}</span>` : ''}
                    <span>📁 ${task.category}</span>
                </div>
            </div>
            <div class="task-actions">
                <button class="edit-btn" data-id="${task.id}" title="Edit">✏️</button>
                <button class="delete-btn" data-id="${task.id}" title="Delete">🗑️</button>
            </div>
        </div>
    `;
}

function updateProgress() {
    const total = tasks.length;
    const completed = tasks.filter(t => t.completed).length;
    const percent = total > 0 ? (completed / total) * 100 : 0;
    
    progressBar.style.width = `${percent}%`;
    completedCount.textContent = completed;
    totalCount.textContent = total;
}

// Helpers
function formatDate(dateStr) {
    const date = new Date(dateStr);
    const today = new Date();
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);
    
    if (date.toDateString() === today.toDateString()) return 'Today';
    if (date.toDateString() === tomorrow.toDateString()) return 'Tomorrow';
    
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
}

function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}
