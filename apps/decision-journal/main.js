// Decision Journal - Track decisions, revisit outcomes, learn from experience
// Built by Giterdone 😉

const STORAGE_KEY = 'tim-tools-decision-journal';

// State
let decisions = [];
let currentFilter = 'all';
let searchQuery = '';
let currentDecisionId = null;

// DOM Elements
const totalDecisionsEl = document.getElementById('totalDecisions');
const pendingReviewsEl = document.getElementById('pendingReviews');
const reviewedDecisionsEl = document.getElementById('reviewedDecisions');
const decisionsListEl = document.getElementById('decisionsList');
const emptyStateEl = document.getElementById('emptyState');
const searchInputEl = document.getElementById('searchInput');

// Modals
const decisionModal = document.getElementById('decisionModal');
const reviewModal = document.getElementById('reviewModal');
const viewModal = document.getElementById('viewModal');

// Category labels
const categories = {
    business: '🏢 Business',
    technical: '💻 Technical',
    personal: '👤 Personal',
    financial: '💰 Financial',
    team: '👥 Team',
    other: '📌 Other'
};

// Outcome labels
const outcomes = {
    success: { label: '✅ Success', class: 'success' },
    partial: { label: '🔶 Partial', class: 'partial' },
    failure: { label: '❌ Failed', class: 'failure' },
    tbd: { label: '⏳ Too Early', class: 'tbd' }
};

// Initialize
document.addEventListener('DOMContentLoaded', () => {
    loadDecisions();
    renderDecisions();
    updateStats();
    setupEventListeners();
});

// Load from localStorage
function loadDecisions() {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
        try {
            decisions = JSON.parse(stored);
        } catch (e) {
            console.error('Failed to parse decisions:', e);
            decisions = [];
        }
    }
}

// Save to localStorage
function saveDecisions() {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(decisions));
}

// Update stats
function updateStats() {
    const total = decisions.length;
    const reviewed = decisions.filter(d => d.reviewed).length;
    const now = new Date();
    const pending = decisions.filter(d => {
        if (d.reviewed) return false;
        if (!d.reviewDate) return false;
        return new Date(d.reviewDate) <= now;
    }).length;
    
    totalDecisionsEl.textContent = total;
    pendingReviewsEl.textContent = pending;
    reviewedDecisionsEl.textContent = reviewed;
}

// Render decisions list
function renderDecisions() {
    let filtered = [...decisions];
    
    // Apply filter
    if (currentFilter === 'pending') {
        filtered = filtered.filter(d => !d.reviewed);
    } else if (currentFilter === 'reviewed') {
        filtered = filtered.filter(d => d.reviewed);
    }
    
    // Apply search
    if (searchQuery) {
        const query = searchQuery.toLowerCase();
        filtered = filtered.filter(d => 
            d.title.toLowerCase().includes(query) ||
            (d.context && d.context.toLowerCase().includes(query)) ||
            (d.expected && d.expected.toLowerCase().includes(query))
        );
    }
    
    // Sort by date (newest first)
    filtered.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    
    if (filtered.length === 0) {
        decisionsListEl.innerHTML = '';
        emptyStateEl.style.display = 'block';
        
        if (searchQuery) {
            emptyStateEl.querySelector('h3').textContent = 'No matches found';
            emptyStateEl.querySelector('p').textContent = 'Try a different search term.';
        } else if (currentFilter !== 'all') {
            emptyStateEl.querySelector('h3').textContent = `No ${currentFilter} decisions`;
            emptyStateEl.querySelector('p').textContent = currentFilter === 'pending' 
                ? 'All caught up! No decisions awaiting review.' 
                : 'Log and review some decisions first.';
        } else {
            emptyStateEl.querySelector('h3').textContent = 'No decisions logged yet';
            emptyStateEl.querySelector('p').textContent = 'Start capturing your important decisions — future you will appreciate the context.';
        }
        return;
    }
    
    emptyStateEl.style.display = 'none';
    
    decisionsListEl.innerHTML = filtered.map(decision => {
        const now = new Date();
        const reviewDate = decision.reviewDate ? new Date(decision.reviewDate) : null;
        const isOverdue = reviewDate && reviewDate < now && !decision.reviewed;
        const isPending = reviewDate && !decision.reviewed;
        
        let statusClass = '';
        let statusText = '';
        
        if (decision.reviewed) {
            statusClass = 'reviewed';
            statusText = 'Reviewed';
        } else if (isOverdue) {
            statusClass = 'overdue';
            statusText = 'Overdue';
        } else if (isPending) {
            statusClass = 'pending';
            statusText = 'Pending';
        }
        
        const outcomeHtml = decision.reviewed && decision.outcomeResult 
            ? `<span class="outcome-badge ${outcomes[decision.outcomeResult]?.class || ''}">${outcomes[decision.outcomeResult]?.label || ''}</span>`
            : '';
        
        return `
            <div class="decision-card" data-id="${decision.id}">
                <div class="decision-header">
                    <div class="decision-title">${escapeHtml(decision.title)}</div>
                    <div class="decision-meta">
                        <span class="decision-category">${categories[decision.category] || decision.category}</span>
                        ${statusText ? `<span class="decision-status ${statusClass}">${statusText}</span>` : ''}
                    </div>
                </div>
                ${decision.context ? `<div class="decision-context">${escapeHtml(decision.context)}</div>` : ''}
                <div class="decision-footer">
                    <span class="decision-date">📅 ${formatDate(decision.createdAt)}</span>
                    <span class="decision-confidence">
                        Confidence: 
                        <span class="confidence-bar">
                            <span class="confidence-fill" style="width: ${decision.confidence * 10}%"></span>
                        </span>
                        ${decision.confidence}/10
                    </span>
                </div>
                ${outcomeHtml ? `<div style="margin-top: 0.75rem;">${outcomeHtml}</div>` : ''}
                <div class="decision-actions">
                    <button class="btn-action btn-view" data-id="${decision.id}">View</button>
                    <button class="btn-action btn-edit-card" data-id="${decision.id}">Edit</button>
                    ${!decision.reviewed ? `<button class="btn-action btn-review" data-id="${decision.id}">Review</button>` : ''}
                </div>
            </div>
        `;
    }).join('');
    
    // Add click handlers
    document.querySelectorAll('.btn-view').forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.stopPropagation();
            openViewModal(btn.dataset.id);
        });
    });
    
    document.querySelectorAll('.btn-edit-card').forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.stopPropagation();
            openEditModal(btn.dataset.id);
        });
    });
    
    document.querySelectorAll('.btn-review').forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.stopPropagation();
            openReviewModal(btn.dataset.id);
        });
    });
    
    document.querySelectorAll('.decision-card').forEach(card => {
        card.addEventListener('click', () => {
            openViewModal(card.dataset.id);
        });
    });
}

// Setup event listeners
function setupEventListeners() {
    // New decision button
    document.getElementById('newDecisionBtn').addEventListener('click', () => {
        openNewDecisionModal();
    });
    
    // Filter tabs
    document.querySelectorAll('.filter-tab').forEach(tab => {
        tab.addEventListener('click', () => {
            document.querySelectorAll('.filter-tab').forEach(t => t.classList.remove('active'));
            tab.classList.add('active');
            currentFilter = tab.dataset.filter;
            renderDecisions();
        });
    });
    
    // Search
    searchInputEl.addEventListener('input', (e) => {
        searchQuery = e.target.value;
        renderDecisions();
    });
    
    // Decision form
    document.getElementById('decisionForm').addEventListener('submit', handleDecisionSubmit);
    document.getElementById('cancelDecision').addEventListener('click', closeDecisionModal);
    
    // Confidence slider
    document.getElementById('decisionConfidence').addEventListener('input', (e) => {
        document.getElementById('confidenceValue').textContent = e.target.value;
    });
    
    // Review form
    document.getElementById('reviewForm').addEventListener('submit', handleReviewSubmit);
    document.getElementById('cancelReview').addEventListener('click', closeReviewModal);
    
    // Outcome buttons
    document.querySelectorAll('.outcome-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            document.querySelectorAll('.outcome-btn').forEach(b => b.classList.remove('selected'));
            btn.classList.add('selected');
            document.getElementById('outcomeResult').value = btn.dataset.outcome;
        });
    });
    
    // View modal
    document.getElementById('closeView').addEventListener('click', closeViewModal);
    document.getElementById('editFromView').addEventListener('click', () => {
        closeViewModal();
        openEditModal(currentDecisionId);
    });
    document.getElementById('deleteFromView').addEventListener('click', handleDelete);
    
    // Export
    document.getElementById('exportBtn').addEventListener('click', exportDecisions);
    
    // Close modals on overlay click
    [decisionModal, reviewModal, viewModal].forEach(modal => {
        modal.addEventListener('click', (e) => {
            if (e.target === modal) {
                modal.classList.remove('active');
            }
        });
    });
    
    // Keyboard shortcuts
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') {
            decisionModal.classList.remove('active');
            reviewModal.classList.remove('active');
            viewModal.classList.remove('active');
        }
    });
}

// Open new decision modal
function openNewDecisionModal() {
    currentDecisionId = null;
    document.getElementById('modalTitle').textContent = 'Log New Decision';
    document.getElementById('decisionForm').reset();
    document.getElementById('decisionConfidence').value = 7;
    document.getElementById('confidenceValue').textContent = '7';
    
    // Set default review date to 30 days from now
    const defaultReview = new Date();
    defaultReview.setDate(defaultReview.getDate() + 30);
    document.getElementById('reviewDate').value = defaultReview.toISOString().split('T')[0];
    
    decisionModal.classList.add('active');
    document.getElementById('decisionTitle').focus();
}

// Open edit modal
function openEditModal(id) {
    const decision = decisions.find(d => d.id === id);
    if (!decision) return;
    
    currentDecisionId = id;
    document.getElementById('modalTitle').textContent = 'Edit Decision';
    document.getElementById('decisionId').value = id;
    document.getElementById('decisionTitle').value = decision.title;
    document.getElementById('decisionContext').value = decision.context || '';
    document.getElementById('decisionExpected').value = decision.expected || '';
    document.getElementById('decisionCategory').value = decision.category;
    document.getElementById('reviewDate').value = decision.reviewDate || '';
    document.getElementById('decisionConfidence').value = decision.confidence;
    document.getElementById('confidenceValue').textContent = decision.confidence;
    
    decisionModal.classList.add('active');
}

// Open review modal
function openReviewModal(id) {
    const decision = decisions.find(d => d.id === id);
    if (!decision) return;
    
    currentDecisionId = id;
    document.getElementById('reviewDecisionId').value = id;
    
    // Fill in original decision details
    document.getElementById('reviewCategory').textContent = categories[decision.category] || decision.category;
    document.getElementById('reviewDate2').textContent = formatDate(decision.createdAt);
    document.getElementById('reviewTitle').textContent = decision.title;
    document.getElementById('reviewContext').textContent = decision.context || 'No context provided';
    document.getElementById('reviewExpected').textContent = decision.expected || 'No expected outcome specified';
    document.getElementById('reviewConfidence').textContent = decision.confidence;
    
    // Reset form
    document.getElementById('actualOutcome').value = '';
    document.getElementById('lessonsLearned').value = '';
    document.getElementById('outcomeResult').value = '';
    document.querySelectorAll('.outcome-btn').forEach(b => b.classList.remove('selected'));
    
    reviewModal.classList.add('active');
}

// Open view modal
function openViewModal(id) {
    const decision = decisions.find(d => d.id === id);
    if (!decision) return;
    
    currentDecisionId = id;
    
    document.getElementById('viewCategory').textContent = categories[decision.category] || decision.category;
    document.getElementById('viewDate').textContent = formatDate(decision.createdAt);
    document.getElementById('viewTitle').textContent = decision.title;
    document.getElementById('viewContext').textContent = decision.context || 'No context provided';
    document.getElementById('viewExpected').textContent = decision.expected || 'No expected outcome specified';
    document.getElementById('viewConfidence').textContent = decision.confidence;
    
    const reviewSection = document.getElementById('viewReviewSection');
    if (decision.reviewed) {
        reviewSection.style.display = 'block';
        const outcomeInfo = outcomes[decision.outcomeResult] || { label: 'Unknown', class: '' };
        document.getElementById('viewOutcome').innerHTML = `<span class="outcome-badge ${outcomeInfo.class}">${outcomeInfo.label}</span>`;
        document.getElementById('viewActual').textContent = decision.actualOutcome || 'Not specified';
        document.getElementById('viewLessons').textContent = decision.lessonsLearned || 'None recorded';
        document.getElementById('viewReviewDate').textContent = formatDate(decision.reviewedAt);
    } else {
        reviewSection.style.display = 'none';
    }
    
    viewModal.classList.add('active');
}

// Close modals
function closeDecisionModal() {
    decisionModal.classList.remove('active');
    currentDecisionId = null;
}

function closeReviewModal() {
    reviewModal.classList.remove('active');
    currentDecisionId = null;
}

function closeViewModal() {
    viewModal.classList.remove('active');
    currentDecisionId = null;
}

// Handle decision form submit
function handleDecisionSubmit(e) {
    e.preventDefault();
    
    const id = document.getElementById('decisionId').value;
    const title = document.getElementById('decisionTitle').value.trim();
    const context = document.getElementById('decisionContext').value.trim();
    const expected = document.getElementById('decisionExpected').value.trim();
    const category = document.getElementById('decisionCategory').value;
    const reviewDate = document.getElementById('reviewDate').value;
    const confidence = parseInt(document.getElementById('decisionConfidence').value);
    
    if (!title) return;
    
    if (id) {
        // Edit existing
        const decision = decisions.find(d => d.id === id);
        if (decision) {
            decision.title = title;
            decision.context = context;
            decision.expected = expected;
            decision.category = category;
            decision.reviewDate = reviewDate;
            decision.confidence = confidence;
            decision.updatedAt = new Date().toISOString();
        }
    } else {
        // Create new
        const newDecision = {
            id: generateId(),
            title,
            context,
            expected,
            category,
            reviewDate,
            confidence,
            reviewed: false,
            createdAt: new Date().toISOString()
        };
        decisions.push(newDecision);
    }
    
    saveDecisions();
    renderDecisions();
    updateStats();
    closeDecisionModal();
}

// Handle review form submit
function handleReviewSubmit(e) {
    e.preventDefault();
    
    const id = document.getElementById('reviewDecisionId').value;
    const actualOutcome = document.getElementById('actualOutcome').value.trim();
    const lessonsLearned = document.getElementById('lessonsLearned').value.trim();
    const outcomeResult = document.getElementById('outcomeResult').value;
    
    if (!actualOutcome || !outcomeResult) {
        alert('Please describe what happened and select an outcome.');
        return;
    }
    
    const decision = decisions.find(d => d.id === id);
    if (decision) {
        decision.reviewed = true;
        decision.actualOutcome = actualOutcome;
        decision.lessonsLearned = lessonsLearned;
        decision.outcomeResult = outcomeResult;
        decision.reviewedAt = new Date().toISOString();
    }
    
    saveDecisions();
    renderDecisions();
    updateStats();
    closeReviewModal();
}

// Handle delete
function handleDelete() {
    if (!currentDecisionId) return;
    
    if (confirm('Are you sure you want to delete this decision? This cannot be undone.')) {
        decisions = decisions.filter(d => d.id !== currentDecisionId);
        saveDecisions();
        renderDecisions();
        updateStats();
        closeViewModal();
    }
}

// Export decisions
function exportDecisions() {
    if (decisions.length === 0) {
        alert('No decisions to export.');
        return;
    }
    
    const data = JSON.stringify(decisions, null, 2);
    const blob = new Blob([data], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `decision-journal-${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
}

// Utility functions
function generateId() {
    return Date.now().toString(36) + Math.random().toString(36).substr(2);
}

function formatDate(dateString) {
    const date = new Date(dateString);
    const now = new Date();
    const diffDays = Math.floor((now - date) / (1000 * 60 * 60 * 24));
    
    if (diffDays === 0) return 'Today';
    if (diffDays === 1) return 'Yesterday';
    if (diffDays < 7) return `${diffDays} days ago`;
    
    return date.toLocaleDateString('en-US', { 
        month: 'short', 
        day: 'numeric',
        year: date.getFullYear() !== now.getFullYear() ? 'numeric' : undefined
    });
}

function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}
