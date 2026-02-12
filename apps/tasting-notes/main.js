// Tasting Notes — localStorage-only flavor journal
const STORAGE_KEY = 'tasting-notes';
const FLAVORS = ['sweet', 'bitter', 'smoky', 'fruity', 'spicy', 'floral'];
const CAT_ICONS = { whiskey: '🥃', wine: '🍷', beer: '🍺', coffee: '☕', spirits: '🍸', other: '🧪' };

let tastings = JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]');
let activeFilter = 'all';
let editingId = null;

// --- Init ---
document.addEventListener('DOMContentLoaded', () => {
    render();
    bindEvents();
});

function bindEvents() {
    // Toggle form
    document.getElementById('toggle-form').addEventListener('click', () => {
        const form = document.getElementById('tasting-form');
        const icon = document.getElementById('toggle-icon');
        form.classList.toggle('hidden');
        icon.classList.toggle('open');
    });

    // Flavor sliders
    FLAVORS.forEach(f => {
        const slider = document.getElementById(`f-${f}`);
        const val = document.getElementById(`v-${f}`);
        slider.addEventListener('input', () => val.textContent = slider.value);
    });

    // Star rating
    const stars = document.querySelectorAll('.star');
    stars.forEach(star => {
        star.addEventListener('click', () => {
            const val = parseInt(star.dataset.val);
            document.getElementById('rating').value = val;
            stars.forEach(s => s.classList.toggle('active', parseInt(s.dataset.val) <= val));
        });
        star.addEventListener('mouseenter', () => {
            const val = parseInt(star.dataset.val);
            stars.forEach(s => s.classList.toggle('active', parseInt(s.dataset.val) <= val));
        });
    });
    document.getElementById('star-rating').addEventListener('mouseleave', () => {
        const current = parseInt(document.getElementById('rating').value);
        stars.forEach(s => s.classList.toggle('active', parseInt(s.dataset.val) <= current));
    });

    // Form submit
    document.getElementById('tasting-form').addEventListener('submit', e => {
        e.preventDefault();
        saveTasting();
    });

    // Cancel
    document.getElementById('cancel-btn').addEventListener('click', () => {
        resetForm();
        document.getElementById('tasting-form').classList.add('hidden');
        document.getElementById('toggle-icon').classList.remove('open');
    });

    // Filter pills
    document.getElementById('filter-pills').addEventListener('click', e => {
        if (e.target.classList.contains('pill')) {
            activeFilter = e.target.dataset.filter;
            document.querySelectorAll('.pill').forEach(p => p.classList.remove('active'));
            e.target.classList.add('active');
            render();
        }
    });

    // Sort
    document.getElementById('sort-by').addEventListener('change', render);
}

// --- Save ---
function saveTasting() {
    const flavors = {};
    FLAVORS.forEach(f => flavors[f] = parseInt(document.getElementById(`f-${f}`).value));

    const tasting = {
        id: editingId || Date.now().toString(36) + Math.random().toString(36).slice(2, 6),
        name: document.getElementById('name').value.trim(),
        category: document.getElementById('category').value,
        origin: document.getElementById('origin').value.trim(),
        price: document.getElementById('price').value.trim(),
        flavors,
        rating: parseInt(document.getElementById('rating').value) || 0,
        notes: document.getElementById('notes').value.trim(),
        date: editingId ? (tastings.find(t => t.id === editingId)?.date || new Date().toISOString()) : new Date().toISOString(),
        updated: new Date().toISOString(),
    };

    if (editingId) {
        const idx = tastings.findIndex(t => t.id === editingId);
        if (idx >= 0) tastings[idx] = tasting;
        editingId = null;
    } else {
        tastings.unshift(tasting);
    }

    persist();
    resetForm();
    document.getElementById('tasting-form').classList.add('hidden');
    document.getElementById('toggle-icon').classList.remove('open');
    document.getElementById('submit-btn').textContent = 'Save Tasting';
    render();
}

function persist() {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(tastings));
}

function resetForm() {
    document.getElementById('tasting-form').reset();
    FLAVORS.forEach(f => document.getElementById(`v-${f}`).textContent = '0');
    document.getElementById('rating').value = '0';
    document.querySelectorAll('.star').forEach(s => s.classList.remove('active'));
    editingId = null;
    document.getElementById('submit-btn').textContent = 'Save Tasting';
}

// --- Render ---
function render() {
    const sortBy = document.getElementById('sort-by').value;
    let filtered = activeFilter === 'all' ? [...tastings] : tastings.filter(t => t.category === activeFilter);

    filtered.sort((a, b) => {
        switch (sortBy) {
            case 'date-desc': return new Date(b.date) - new Date(a.date);
            case 'date-asc': return new Date(a.date) - new Date(b.date);
            case 'rating-desc': return (b.rating || 0) - (a.rating || 0);
            case 'name-asc': return a.name.localeCompare(b.name);
            default: return 0;
        }
    });

    const list = document.getElementById('tastings-list');
    const empty = document.getElementById('empty-state');

    if (filtered.length === 0) {
        list.innerHTML = '';
        empty.classList.remove('hidden');
    } else {
        empty.classList.add('hidden');
        list.innerHTML = filtered.map(renderCard).join('');
        // Bind delete/edit
        list.querySelectorAll('[data-delete]').forEach(btn => {
            btn.addEventListener('click', () => {
                if (confirm('Delete this tasting?')) {
                    tastings = tastings.filter(t => t.id !== btn.dataset.delete);
                    persist();
                    render();
                }
            });
        });
        list.querySelectorAll('[data-edit]').forEach(btn => {
            btn.addEventListener('click', () => editTasting(btn.dataset.edit));
        });
    }

    renderStats();
}

function renderCard(t) {
    const icon = CAT_ICONS[t.category] || '🧪';
    const stars = renderStars(t.rating);
    const date = new Date(t.date).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' });
    const radar = renderRadarSVG(t.flavors);
    const hasProfile = FLAVORS.some(f => (t.flavors?.[f] || 0) > 0);

    return `
        <div class="tasting-card">
            <div class="tasting-header">
                <div class="tasting-title">
                    <span class="tasting-cat">${icon}</span>
                    <h3>${esc(t.name)}</h3>
                </div>
                <div class="tasting-stars">${stars}</div>
            </div>
            <div class="tasting-meta">
                <span>${date}</span>
                ${t.origin ? `<span>${esc(t.origin)}</span>` : ''}
                ${t.price ? `<span>${esc(t.price)}</span>` : ''}
            </div>
            ${hasProfile ? `<div class="radar-wrap">${radar}</div>` : ''}
            ${t.notes ? `<div class="tasting-notes">"${esc(t.notes)}"</div>` : ''}
            <div class="tasting-actions">
                <button class="btn btn-ghost btn-sm" data-edit="${t.id}">Edit</button>
                <button class="btn btn-ghost btn-sm" data-delete="${t.id}">Delete</button>
            </div>
        </div>
    `;
}

function renderStars(n) {
    let s = '';
    for (let i = 1; i <= 5; i++) s += i <= n ? '★' : '<span class="empty">★</span>';
    return s;
}

// --- Radar Chart (SVG) ---
function renderRadarSVG(flavors) {
    if (!flavors) return '';
    const cx = 80, cy = 80, r = 55;
    const labels = FLAVORS;
    const n = labels.length;
    const step = (Math.PI * 2) / n;
    const offset = -Math.PI / 2; // start from top

    // Grid rings
    let gridLines = '';
    [1, 2, 3, 4, 5].forEach(ring => {
        const rr = (ring / 5) * r;
        const pts = labels.map((_, i) => {
            const a = offset + i * step;
            return `${cx + rr * Math.cos(a)},${cy + rr * Math.sin(a)}`;
        }).join(' ');
        gridLines += `<polygon points="${pts}" class="radar-grid"/>`;
    });

    // Axis lines
    let axes = '';
    labels.forEach((_, i) => {
        const a = offset + i * step;
        axes += `<line x1="${cx}" y1="${cy}" x2="${cx + r * Math.cos(a)}" y2="${cy + r * Math.sin(a)}" class="radar-grid"/>`;
    });

    // Data shape
    const pts = labels.map((l, i) => {
        const val = (flavors[l] || 0) / 5;
        const a = offset + i * step;
        return `${cx + val * r * Math.cos(a)},${cy + val * r * Math.sin(a)}`;
    }).join(' ');

    // Labels
    let labelEls = '';
    labels.forEach((l, i) => {
        const a = offset + i * step;
        const lx = cx + (r + 14) * Math.cos(a);
        const ly = cy + (r + 14) * Math.sin(a);
        const anchor = Math.abs(Math.cos(a)) < 0.1 ? 'middle' : Math.cos(a) > 0 ? 'start' : 'end';
        labelEls += `<text x="${lx}" y="${ly}" text-anchor="${anchor}" dominant-baseline="central" class="radar-label">${l[0].toUpperCase() + l.slice(1)}</text>`;
    });

    return `<svg viewBox="0 0 160 160">${gridLines}${axes}<polygon points="${pts}" class="radar-shape"/>${labelEls}</svg>`;
}

// --- Stats ---
function renderStats() {
    const grid = document.getElementById('stats-grid');
    const section = document.getElementById('stats-section');
    if (tastings.length === 0) {
        section.classList.add('hidden');
        return;
    }
    section.classList.remove('hidden');

    const total = tastings.length;
    const avgRating = tastings.reduce((s, t) => s + (t.rating || 0), 0) / total;
    const topCat = mode(tastings.map(t => t.category));
    const topIcon = CAT_ICONS[topCat] || '🧪';

    // Favorite flavor (highest average)
    const flavorAvgs = {};
    FLAVORS.forEach(f => {
        const vals = tastings.map(t => t.flavors?.[f] || 0);
        flavorAvgs[f] = vals.reduce((a, b) => a + b, 0) / vals.length;
    });
    const topFlavor = Object.entries(flavorAvgs).sort((a, b) => b[1] - a[1])[0];

    grid.innerHTML = `
        <div class="stat-box"><div class="stat-val">${total}</div><div class="stat-label">Tastings</div></div>
        <div class="stat-box"><div class="stat-val">${avgRating.toFixed(1)}</div><div class="stat-label">Avg Rating</div></div>
        <div class="stat-box"><div class="stat-val">${topIcon}</div><div class="stat-label">Top Category</div></div>
        <div class="stat-box"><div class="stat-val">${topFlavor[0][0].toUpperCase() + topFlavor[0].slice(1)}</div><div class="stat-label">Dominant Flavor</div></div>
    `;
}

function mode(arr) {
    const freq = {};
    arr.forEach(v => freq[v] = (freq[v] || 0) + 1);
    return Object.entries(freq).sort((a, b) => b[1] - a[1])[0]?.[0] || '';
}

// --- Edit ---
function editTasting(id) {
    const t = tastings.find(x => x.id === id);
    if (!t) return;
    editingId = id;

    document.getElementById('name').value = t.name;
    document.getElementById('category').value = t.category;
    document.getElementById('origin').value = t.origin || '';
    document.getElementById('price').value = t.price || '';
    document.getElementById('notes').value = t.notes || '';
    document.getElementById('rating').value = t.rating || 0;

    FLAVORS.forEach(f => {
        document.getElementById(`f-${f}`).value = t.flavors?.[f] || 0;
        document.getElementById(`v-${f}`).textContent = t.flavors?.[f] || 0;
    });

    const stars = document.querySelectorAll('.star');
    stars.forEach(s => s.classList.toggle('active', parseInt(s.dataset.val) <= (t.rating || 0)));

    document.getElementById('tasting-form').classList.remove('hidden');
    document.getElementById('toggle-icon').classList.add('open');
    document.getElementById('submit-btn').textContent = 'Update Tasting';
    document.getElementById('add-section').scrollIntoView({ behavior: 'smooth' });
}

// --- Util ---
function esc(str) {
    const d = document.createElement('div');
    d.textContent = str;
    return d.innerHTML;
}
