// Sourdough Calculator - app.js

const STORAGE_KEY = 'sourdough-calc';

function load() {
    try {
        return JSON.parse(localStorage.getItem(STORAGE_KEY)) || { feedings: [], bakes: [], starterName: '' };
    } catch { return { feedings: [], bakes: [], starterName: '' }; }
}

function save(data) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
}

// --- Tabs ---
document.querySelectorAll('.tab').forEach(tab => {
    tab.addEventListener('click', () => {
        document.querySelectorAll('.tab').forEach(t => t.classList.remove('active'));
        document.querySelectorAll('.tab-content').forEach(tc => tc.classList.remove('active'));
        tab.classList.add('active');
        document.getElementById('tab-' + tab.dataset.tab).classList.add('active');
    });
});

// --- Recipe Calculator ---
function calcRecipe() {
    const total = parseFloat(document.getElementById('totalWeight').value) || 900;
    const hydration = parseFloat(document.getElementById('hydration').value) || 75;
    const starterPct = parseFloat(document.getElementById('starterPct').value) || 20;
    const saltPct = parseFloat(document.getElementById('saltPct').value) || 2;

    // Baker's math: starter is 100% hydration (equal flour + water)
    // flour_total = flour_added + starter_flour
    // water_total = water_added + starter_water
    // starter_flour = starter_water = starter / 2
    // hydration = water_total / flour_total
    // starter = starterPct/100 * flour_total
    // salt = saltPct/100 * flour_total
    // total = flour_added + water_added + starter + salt

    // Solve: flour_total = total / (1 + hydration/100 + saltPct/100)
    const flourTotal = total / (1 + hydration / 100 + saltPct / 100);
    const waterTotal = flourTotal * hydration / 100;
    const starter = flourTotal * starterPct / 100;
    const salt = flourTotal * saltPct / 100;
    const starterFlour = starter / 2;
    const starterWater = starter / 2;
    const flourAdded = flourTotal - starterFlour;
    const waterAdded = waterTotal - starterWater;

    const hint = document.getElementById('hydrationHint');
    if (hydration < 60) hint.textContent = 'Very stiff — bagels, pretzels';
    else if (hydration < 68) hint.textContent = 'Low — tight crumb, sandwich bread';
    else if (hydration < 76) hint.textContent = 'Good all-rounder';
    else if (hydration < 85) hint.textContent = 'High — open crumb, ciabatta territory';
    else hint.textContent = 'Very high — focaccia, pancake-adjacent 🫠';

    const out = document.getElementById('recipeOutput');
    out.innerHTML = `
        <div class="recipe-row"><span class="ingredient">🌾 Flour (added)</span><span class="amount">${Math.round(flourAdded)} g</span></div>
        <div class="recipe-row"><span class="ingredient">💧 Water (added)</span><span class="amount">${Math.round(waterAdded)} g</span></div>
        <div class="recipe-row"><span class="ingredient">🫧 Starter</span><span class="amount">${Math.round(starter)} g</span></div>
        <div class="recipe-row"><span class="ingredient">🧂 Salt</span><span class="amount">${Math.round(salt)} g</span></div>
        <div class="recipe-row"><span class="ingredient">📦 Total</span><span class="amount">${Math.round(flourAdded + waterAdded + starter + salt)} g</span></div>
    `;
}

['totalWeight', 'hydration', 'starterPct', 'saltPct'].forEach(id => {
    document.getElementById(id).addEventListener('input', calcRecipe);
});
calcRecipe();

// --- Rise Time Estimator ---
function calcRise() {
    let tempC = parseFloat(document.getElementById('roomTemp').value) || 22;
    const unit = document.getElementById('tempUnit').value;
    if (unit === 'F') tempC = (tempC - 32) * 5 / 9;

    const activity = document.getElementById('starterActivity').value;

    // Base bulk ferment at 24°C ≈ 4 hours
    // Roughly doubles every 8°C drop, halves every 8°C rise
    const baseBulk = 4; // hours at 24°C
    const tempFactor = Math.pow(2, (24 - tempC) / 8);

    let activityFactor = 1;
    if (activity === 'sluggish') activityFactor = 1.5;
    if (activity === 'peak') activityFactor = 0.75;

    const bulkHours = baseBulk * tempFactor * activityFactor;
    const proofHours = bulkHours * 0.5; // proof is roughly half of bulk

    // Cold retard: fridge at 4°C
    const coldRetardMin = 8;
    const coldRetardMax = 18;

    const now = new Date();
    const bulkEnd = new Date(now.getTime() + bulkHours * 3600000);
    const bakeReady = new Date(bulkEnd.getTime() + proofHours * 3600000);

    const fmt = d => d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

    const out = document.getElementById('riseOutput');
    out.innerHTML = `
        <div class="rise-card">
            <div class="rise-label">Bulk Ferment</div>
            <div class="rise-value">${bulkHours.toFixed(1)}h</div>
            <div class="rise-detail">Done ~${fmt(bulkEnd)}</div>
        </div>
        <div class="rise-card">
            <div class="rise-label">Final Proof</div>
            <div class="rise-value">${proofHours.toFixed(1)}h</div>
            <div class="rise-detail">Bake ~${fmt(bakeReady)}</div>
        </div>
        <div class="rise-card">
            <div class="rise-label">Cold Retard (fridge)</div>
            <div class="rise-value">${coldRetardMin}–${coldRetardMax}h</div>
            <div class="rise-detail">Shape → fridge → bake tomorrow</div>
        </div>
        <div class="rise-card">
            <div class="rise-label">Temp Effect</div>
            <div class="rise-value">${tempC.toFixed(0)}°C</div>
            <div class="rise-detail">${tempC < 18 ? '❄️ Slow & flavorful' : tempC < 26 ? '👌 Ideal range' : '🔥 Fast — watch it!'}</div>
        </div>
    `;
}

['roomTemp', 'tempUnit', 'starterActivity'].forEach(id => {
    document.getElementById(id).addEventListener('input', calcRise);
    document.getElementById(id).addEventListener('change', calcRise);
});
calcRise();

// --- Feeding Schedule ---
function renderFeedings() {
    const data = load();
    const history = document.getElementById('feedingHistory');
    const nameInput = document.getElementById('starterName');

    if (data.starterName) nameInput.value = data.starterName;

    if (data.feedings.length === 0) {
        history.innerHTML = '<div class="empty-state">No feedings logged yet. Feed your starter!</div>';
    } else {
        const recent = data.feedings.slice(-10).reverse();
        history.innerHTML = recent.map((f, i) => {
            const d = new Date(f.time);
            return `<div class="feeding-entry">
                <span>${d.toLocaleDateString()} ${d.toLocaleTimeString([], {hour:'2-digit',minute:'2-digit'})}</span>
                <span class="feeding-time">${f.ratio || '1:5:5'}</span>
                <button class="btn btn-danger" onclick="deleteFeeding(${data.feedings.length - 1 - i})">✕</button>
            </div>`;
        }).join('');
    }

    // Health stats
    const totalEl = document.getElementById('totalFeedings');
    const lastFedEl = document.getElementById('lastFed');
    const hoursEl = document.getElementById('hoursAgo');
    const statusEl = document.getElementById('starterStatus');

    totalEl.textContent = data.feedings.length;

    if (data.feedings.length > 0) {
        const last = new Date(data.feedings[data.feedings.length - 1].time);
        const hoursAgo = (Date.now() - last.getTime()) / 3600000;
        lastFedEl.textContent = last.toLocaleDateString();
        hoursEl.textContent = hoursAgo.toFixed(1);

        if (hoursAgo < 8) {
            statusEl.textContent = '😊 Happy';
            statusEl.className = 'stat-value happy';
        } else if (hoursAgo < 24) {
            statusEl.textContent = '😐 Hungry';
            statusEl.className = 'stat-value hungry';
        } else {
            statusEl.textContent = '💀 Neglected';
            statusEl.className = 'stat-value dead';
        }
    }
}

document.getElementById('logFeeding').addEventListener('click', () => {
    const data = load();
    const ratio = `${document.getElementById('ratioS').value}:${document.getElementById('ratioF').value}:${document.getElementById('ratioW').value}`;
    data.starterName = document.getElementById('starterName').value;
    data.feedings.push({ time: new Date().toISOString(), ratio });
    save(data);
    renderFeedings();
});

document.getElementById('starterName').addEventListener('change', () => {
    const data = load();
    data.starterName = document.getElementById('starterName').value;
    save(data);
});

window.deleteFeeding = function(idx) {
    const data = load();
    data.feedings.splice(idx, 1);
    save(data);
    renderFeedings();
};

renderFeedings();

// --- Bake Log ---
let selectedRating = 0;

document.querySelectorAll('.star').forEach(star => {
    star.addEventListener('click', () => {
        selectedRating = parseInt(star.dataset.val);
        document.querySelectorAll('.star').forEach(s => {
            s.classList.toggle('active', parseInt(s.dataset.val) <= selectedRating);
        });
    });
});

// Default date to today
document.getElementById('bakeDate').valueAsDate = new Date();

document.getElementById('saveBake').addEventListener('click', () => {
    const name = document.getElementById('bakeName').value.trim();
    if (!name) return alert('Give your bake a name!');

    const data = load();
    data.bakes.push({
        id: Date.now(),
        date: document.getElementById('bakeDate').value,
        name,
        hydration: parseInt(document.getElementById('bakeHydration').value) || 75,
        bulkHours: parseFloat(document.getElementById('bakeBulk').value) || 4,
        rating: selectedRating,
        notes: document.getElementById('bakeNotes').value.trim()
    });
    save(data);

    // Reset form
    document.getElementById('bakeName').value = '';
    document.getElementById('bakeNotes').value = '';
    selectedRating = 0;
    document.querySelectorAll('.star').forEach(s => s.classList.remove('active'));

    renderBakes();
});

function renderBakes() {
    const data = load();
    const container = document.getElementById('bakeEntries');

    if (data.bakes.length === 0) {
        container.innerHTML = '<div class="empty-state">No bakes logged yet. Time to preheat the oven! 🔥</div>';
        return;
    }

    const sorted = [...data.bakes].reverse();
    container.innerHTML = sorted.map(b => `
        <div class="bake-entry">
            <div class="bake-header">
                <span class="bake-name">${b.name}</span>
                <span class="bake-date">${b.date}</span>
            </div>
            <div class="bake-meta">
                <span>💧 ${b.hydration}%</span>
                <span>⏱ ${b.bulkHours}h bulk</span>
            </div>
            <div class="bake-stars">${'★'.repeat(b.rating)}${'☆'.repeat(5 - b.rating)}</div>
            ${b.notes ? `<div class="bake-notes">"${b.notes}"</div>` : ''}
            <div class="bake-actions">
                <button class="btn btn-danger" onclick="deleteBake(${b.id})">Delete</button>
            </div>
        </div>
    `).join('');
}

window.deleteBake = function(id) {
    const data = load();
    data.bakes = data.bakes.filter(b => b.id !== id);
    save(data);
    renderBakes();
};

renderBakes();
