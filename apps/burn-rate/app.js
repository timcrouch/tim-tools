// Burn Rate - Subscription Tracker
const STORAGE_KEY = 'burnrate-subs';

const CATEGORY_META = {
    'dev-tools':     { icon: '🛠', label: 'Dev Tools',      color: '#8b5cf6' },
    'ai':            { icon: '🤖', label: 'AI & LLMs',      color: '#f97316' },
    'cloud':         { icon: '☁️', label: 'Cloud & Infra',   color: '#3b82f6' },
    'saas':          { icon: '📦', label: 'SaaS',            color: '#22c55e' },
    'media':         { icon: '🎬', label: 'Media',           color: '#ec4899' },
    'productivity':  { icon: '⚡', label: 'Productivity',    color: '#f59e0b' },
    'domains':       { icon: '🌐', label: 'Domains',         color: '#06b6d4' },
    'security':      { icon: '🔒', label: 'Security',        color: '#ef4444' },
    'other':         { icon: '📌', label: 'Other',           color: '#71717a' },
};

function loadSubs() {
    try {
        return JSON.parse(localStorage.getItem(STORAGE_KEY)) || [];
    } catch { return []; }
}

function saveSubs(subs) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(subs));
}

function toMonthly(cost, cycle) {
    switch (cycle) {
        case 'weekly': return cost * 52 / 12;
        case 'monthly': return cost;
        case 'quarterly': return cost / 3;
        case 'yearly': return cost / 12;
        default: return cost;
    }
}

function cycleName(c) {
    return { weekly: '/wk', monthly: '/mo', quarterly: '/qtr', yearly: '/yr' }[c] || '';
}

function formatCost(amount, currency) {
    return `${currency}${amount.toFixed(2)}`;
}

function daysUntil(dateStr) {
    if (!dateStr) return null;
    const d = new Date(dateStr);
    const now = new Date();
    now.setHours(0, 0, 0, 0);
    d.setHours(0, 0, 0, 0);
    return Math.ceil((d - now) / 86400000);
}

function render() {
    const subs = loadSubs();
    const filter = document.getElementById('filterCategory').value;
    const sort = document.getElementById('sortBy').value;

    let filtered = filter === 'all' ? [...subs] : subs.filter(s => s.category === filter);

    // Sort
    filtered.sort((a, b) => {
        switch (sort) {
            case 'cost-desc': return toMonthly(b.cost, b.cycle) - toMonthly(a.cost, a.cycle);
            case 'cost-asc': return toMonthly(a.cost, a.cycle) - toMonthly(b.cost, b.cycle);
            case 'name': return a.name.localeCompare(b.name);
            case 'renewal': return (a.renewal || '9999') < (b.renewal || '9999') ? -1 : 1;
            default: return 0;
        }
    });

    // Summary
    let totalMonthly = 0;
    let nearestRenewal = null;
    let nearestDays = Infinity;
    const primaryCurrency = subs.length > 0 ? subs[0].currency : '€';

    subs.forEach(s => {
        totalMonthly += toMonthly(s.cost, s.cycle);
        const d = daysUntil(s.renewal);
        if (d !== null && d >= 0 && d < nearestDays) {
            nearestDays = d;
            nearestRenewal = s;
        }
    });

    document.getElementById('monthlyBurn').textContent = `${primaryCurrency}${totalMonthly.toFixed(0)}`;
    document.getElementById('yearlyBurn').textContent = `${primaryCurrency}${(totalMonthly * 12).toFixed(0)}`;
    document.getElementById('subCount').textContent = subs.length;
    document.getElementById('nextRenewal').textContent = nearestRenewal
        ? `${nearestDays}d — ${nearestRenewal.name}`
        : '—';

    // Category bars
    const catTotals = {};
    subs.forEach(s => {
        const cat = s.category || 'other';
        catTotals[cat] = (catTotals[cat] || 0) + toMonthly(s.cost, s.cycle);
    });

    const maxCat = Math.max(...Object.values(catTotals), 1);
    const barsEl = document.getElementById('categoryBars');
    if (Object.keys(catTotals).length === 0) {
        barsEl.innerHTML = '<p class="empty-state">Add subscriptions to see breakdown</p>';
    } else {
        const sorted = Object.entries(catTotals).sort((a, b) => b[1] - a[1]);
        barsEl.innerHTML = sorted.map(([cat, total]) => {
            const meta = CATEGORY_META[cat] || CATEGORY_META.other;
            const pct = (total / maxCat * 100).toFixed(1);
            return `<div class="cat-row">
                <span class="cat-label">${meta.icon} ${meta.label}</span>
                <div class="cat-bar-wrap"><div class="cat-bar" style="width:${pct}%;background:${meta.color}"></div></div>
                <span class="cat-amount">${primaryCurrency}${total.toFixed(0)}/mo</span>
            </div>`;
        }).join('');
    }

    // Populate filter
    const filterEl = document.getElementById('filterCategory');
    const currentFilter = filterEl.value;
    const usedCats = [...new Set(subs.map(s => s.category))];
    filterEl.innerHTML = '<option value="all">All Categories</option>' +
        usedCats.map(c => {
            const meta = CATEGORY_META[c] || CATEGORY_META.other;
            return `<option value="${c}" ${c === currentFilter ? 'selected' : ''}>${meta.icon} ${meta.label}</option>`;
        }).join('');

    // List
    const listEl = document.getElementById('subList');
    if (filtered.length === 0) {
        listEl.innerHTML = '<p class="empty-state">No subscriptions yet. Add one above to start tracking your burn.</p>';
        return;
    }

    listEl.innerHTML = filtered.map(s => {
        const meta = CATEGORY_META[s.category] || CATEGORY_META.other;
        const monthly = toMonthly(s.cost, s.cycle);
        const d = daysUntil(s.renewal);
        let renewalClass = '';
        let renewalText = s.renewal ? new Date(s.renewal).toLocaleDateString() : 'No date';
        if (d !== null) {
            if (d < 0) { renewalClass = 'renewal-overdue'; renewalText += ' (overdue!)'; }
            else if (d <= 7) { renewalClass = 'renewal-soon'; renewalText += ` (${d}d)`; }
        }

        return `<div class="sub-item" data-id="${s.id}">
            <span class="sub-icon">${meta.icon}</span>
            <div class="sub-info">
                <div class="sub-name">${esc(s.name)}</div>
                <div class="sub-meta">
                    <span>${meta.label}</span>
                    <span class="${renewalClass}">📅 ${renewalText}</span>
                </div>
                ${s.notes ? `<div class="sub-notes">💡 ${esc(s.notes)}</div>` : ''}
            </div>
            <div class="sub-cost">
                <div class="sub-cost-value">${s.currency}${s.cost.toFixed(2)}</div>
                <div class="sub-cost-cycle">${cycleName(s.cycle)}</div>
                ${s.cycle !== 'monthly' ? `<div class="sub-cost-monthly">(${s.currency}${monthly.toFixed(2)}/mo)</div>` : ''}
            </div>
            <button class="sub-delete" onclick="deleteSub('${s.id}')" title="Remove">✕</button>
        </div>`;
    }).join('');
}

function esc(str) {
    const d = document.createElement('div');
    d.textContent = str;
    return d.innerHTML;
}

function deleteSub(id) {
    const subs = loadSubs().filter(s => s.id !== id);
    saveSubs(subs);
    render();
}

// Add form
document.getElementById('addForm').addEventListener('submit', e => {
    e.preventDefault();
    const subs = loadSubs();
    subs.push({
        id: Date.now().toString(36) + Math.random().toString(36).slice(2, 6),
        name: document.getElementById('subName').value.trim(),
        cost: parseFloat(document.getElementById('subCost').value),
        currency: document.getElementById('subCurrency').value,
        cycle: document.getElementById('subCycle').value,
        category: document.getElementById('subCategory').value,
        renewal: document.getElementById('subRenewal').value || null,
        notes: document.getElementById('subNotes').value.trim() || null,
        created: new Date().toISOString(),
    });
    saveSubs(subs);
    e.target.reset();
    render();
});

// Export
document.getElementById('exportBtn').addEventListener('click', () => {
    const subs = loadSubs();
    if (subs.length === 0) return;
    let totalMonthly = 0;
    const cur = subs[0].currency;
    const lines = subs.map(s => {
        const m = toMonthly(s.cost, s.cycle);
        totalMonthly += m;
        return `${s.name}: ${s.currency}${s.cost.toFixed(2)}${cycleName(s.cycle)} (${s.currency}${m.toFixed(2)}/mo)`;
    });
    const text = `🔥 Burn Rate Summary\n${'─'.repeat(30)}\n${lines.join('\n')}\n${'─'.repeat(30)}\nTotal: ${cur}${totalMonthly.toFixed(2)}/mo | ${cur}${(totalMonthly * 12).toFixed(2)}/yr`;
    navigator.clipboard.writeText(text).then(() => {
        const btn = document.getElementById('exportBtn');
        btn.textContent = '✅ Copied!';
        setTimeout(() => btn.textContent = '📋 Copy Summary', 2000);
    });
});

// Clear
document.getElementById('clearBtn').addEventListener('click', () => {
    if (confirm('Delete all subscriptions? This cannot be undone.')) {
        saveSubs([]);
        render();
    }
});

// Filter/sort listeners
document.getElementById('filterCategory').addEventListener('change', render);
document.getElementById('sortBy').addEventListener('change', render);

// Init
render();
