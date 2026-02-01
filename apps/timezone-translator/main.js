// Timezone Translator - main.js
// Converts corporate time to human time across multiple timezones

const STORAGE_KEY = 'timezone-translator-zones';

// Popular timezones grouped by region
const TIMEZONE_OPTIONS = [
    { group: 'Americas', zones: [
        { id: 'America/New_York', label: 'New York (ET)' },
        { id: 'America/Chicago', label: 'Chicago (CT)' },
        { id: 'America/Denver', label: 'Denver (MT)' },
        { id: 'America/Los_Angeles', label: 'Los Angeles (PT)' },
        { id: 'America/Phoenix', label: 'Phoenix (AZ)' },
        { id: 'America/Toronto', label: 'Toronto' },
        { id: 'America/Vancouver', label: 'Vancouver' },
        { id: 'America/Mexico_City', label: 'Mexico City' },
        { id: 'America/Sao_Paulo', label: 'São Paulo' },
    ]},
    { group: 'Europe', zones: [
        { id: 'Europe/London', label: 'London (GMT/BST)' },
        { id: 'Europe/Paris', label: 'Paris (CET)' },
        { id: 'Europe/Berlin', label: 'Berlin (CET)' },
        { id: 'Europe/Amsterdam', label: 'Amsterdam' },
        { id: 'Europe/Zurich', label: 'Zurich' },
        { id: 'Europe/Madrid', label: 'Madrid' },
        { id: 'Europe/Rome', label: 'Rome' },
        { id: 'Europe/Stockholm', label: 'Stockholm' },
        { id: 'Europe/Warsaw', label: 'Warsaw' },
        { id: 'Europe/Riga', label: 'Riga (EET)' },
        { id: 'Europe/Helsinki', label: 'Helsinki' },
        { id: 'Europe/Moscow', label: 'Moscow' },
    ]},
    { group: 'Asia/Pacific', zones: [
        { id: 'Asia/Dubai', label: 'Dubai' },
        { id: 'Asia/Mumbai', label: 'Mumbai (IST)' },
        { id: 'Asia/Singapore', label: 'Singapore' },
        { id: 'Asia/Hong_Kong', label: 'Hong Kong' },
        { id: 'Asia/Shanghai', label: 'Shanghai' },
        { id: 'Asia/Tokyo', label: 'Tokyo (JST)' },
        { id: 'Asia/Seoul', label: 'Seoul' },
        { id: 'Australia/Sydney', label: 'Sydney (AEST)' },
        { id: 'Australia/Melbourne', label: 'Melbourne' },
        { id: 'Pacific/Auckland', label: 'Auckland (NZST)' },
    ]},
    { group: 'Other', zones: [
        { id: 'UTC', label: 'UTC' },
        { id: 'Africa/Lagos', label: 'Lagos' },
        { id: 'Africa/Cairo', label: 'Cairo' },
        { id: 'Africa/Johannesburg', label: 'Johannesburg' },
    ]},
];

// Corporate time definitions (in local business hours)
const CORPORATE_TIMES = [
    { term: 'EOD', hour: 17, minute: 0, desc: 'End of Day' },
    { term: 'COB', hour: 17, minute: 0, desc: 'Close of Business' },
    { term: 'EOB', hour: 17, minute: 0, desc: 'End of Business' },
    { term: 'Morning Standup', hour: 9, minute: 0, desc: '9:00 AM' },
    { term: 'Noon', hour: 12, minute: 0, desc: '12:00 PM' },
    { term: 'After lunch', hour: 13, minute: 0, desc: '1:00 PM' },
];

// Default zones for new users
const DEFAULT_ZONES = [
    { id: 'Europe/Riga', label: 'Riga' },
    { id: 'Europe/Berlin', label: 'Berlin' },
    { id: 'America/Chicago', label: 'Texas (CT)' },
];

// State
let userZones = [];
let clockInterval = null;

// Initialize
document.addEventListener('DOMContentLoaded', () => {
    loadZones();
    populateTimezoneSelects();
    renderClocks();
    renderCorporateTime();
    renderTimeline();
    renderOffsetTable();
    setupEventListeners();
    startClockUpdates();
});

function loadZones() {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
        userZones = JSON.parse(saved);
    } else {
        userZones = [...DEFAULT_ZONES];
        saveZones();
    }
}

function saveZones() {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(userZones));
}

function populateTimezoneSelects() {
    const selects = ['zoneSelect', 'sourceZone', 'targetZone'];
    
    selects.forEach(selectId => {
        const select = document.getElementById(selectId);
        if (!select) return;
        
        select.innerHTML = '';
        
        TIMEZONE_OPTIONS.forEach(group => {
            const optgroup = document.createElement('optgroup');
            optgroup.label = group.group;
            
            group.zones.forEach(zone => {
                const option = document.createElement('option');
                option.value = zone.id;
                option.textContent = zone.label;
                optgroup.appendChild(option);
            });
            
            select.appendChild(optgroup);
        });
    });
    
    // Set default source zone to local
    const sourceZone = document.getElementById('sourceZone');
    if (sourceZone && userZones.length > 0) {
        sourceZone.value = userZones[0].id;
    }
    
    // Set default target zone to second zone if available
    const targetZone = document.getElementById('targetZone');
    if (targetZone && userZones.length > 1) {
        targetZone.value = userZones[1].id;
    }
}

function formatTime(date, timezone) {
    return date.toLocaleTimeString('en-US', {
        timeZone: timezone,
        hour: '2-digit',
        minute: '2-digit',
        hour12: false
    });
}

function formatDate(date, timezone) {
    return date.toLocaleDateString('en-US', {
        timeZone: timezone,
        weekday: 'short',
        month: 'short',
        day: 'numeric'
    });
}

function getOffset(timezone) {
    const now = new Date();
    const localOffset = -now.getTimezoneOffset();
    
    // Get offset for target timezone
    const formatter = new Intl.DateTimeFormat('en-US', {
        timeZone: timezone,
        timeZoneName: 'shortOffset'
    });
    const parts = formatter.formatToParts(now);
    const offsetPart = parts.find(p => p.type === 'timeZoneName');
    
    if (!offsetPart) return 'UTC+0';
    
    return offsetPart.value;
}

function getOffsetMinutes(timezone) {
    const now = new Date();
    const utcDate = new Date(now.toLocaleString('en-US', { timeZone: 'UTC' }));
    const tzDate = new Date(now.toLocaleString('en-US', { timeZone: timezone }));
    return (tzDate - utcDate) / 60000;
}

function getLocalTimezone() {
    return Intl.DateTimeFormat().resolvedOptions().timeZone;
}

function renderClocks() {
    const grid = document.getElementById('clocksGrid');
    const localTz = getLocalTimezone();
    const now = new Date();
    
    grid.innerHTML = userZones.map((zone, index) => {
        const isLocal = zone.id === localTz;
        const offset = getOffset(zone.id);
        
        return `
            <div class="clock-card ${isLocal ? 'local' : ''}" data-zone="${zone.id}">
                <div class="clock-info">
                    <span class="clock-label">${zone.label}${isLocal ? ' (You)' : ''}</span>
                    <span class="clock-zone">${zone.id}</span>
                </div>
                <div class="clock-time-wrapper">
                    <div>
                        <span class="clock-time" id="clock-${index}">${formatTime(now, zone.id)}</span>
                        <div class="clock-date">${formatDate(now, zone.id)}</div>
                        <div class="clock-offset">${offset}</div>
                    </div>
                    ${userZones.length > 1 ? `<button class="clock-delete" data-index="${index}" title="Remove">×</button>` : ''}
                </div>
            </div>
        `;
    }).join('');
    
    // Add delete handlers
    grid.querySelectorAll('.clock-delete').forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.stopPropagation();
            const index = parseInt(btn.dataset.index);
            userZones.splice(index, 1);
            saveZones();
            renderClocks();
            renderCorporateTime();
            renderTimeline();
            renderOffsetTable();
        });
    });
}

function updateClocks() {
    const now = new Date();
    userZones.forEach((zone, index) => {
        const timeEl = document.getElementById(`clock-${index}`);
        if (timeEl) {
            timeEl.textContent = formatTime(now, zone.id);
        }
    });
    renderTimeline(); // Update "now" marker
}

function startClockUpdates() {
    updateClocks();
    clockInterval = setInterval(updateClocks, 1000);
}

function renderCorporateTime() {
    const grid = document.getElementById('corporateGrid');
    
    // Show top 3 corporate times
    const displayTerms = CORPORATE_TIMES.slice(0, 3);
    
    grid.innerHTML = displayTerms.map(term => {
        const times = userZones.map(zone => {
            // Create a date with the corporate time in the first zone
            const now = new Date();
            const baseDate = new Date(now.toLocaleString('en-US', { timeZone: userZones[0].id }));
            baseDate.setHours(term.hour, term.minute, 0, 0);
            
            // Convert to each zone
            const converted = baseDate.toLocaleTimeString('en-US', {
                timeZone: zone.id,
                hour: '2-digit',
                minute: '2-digit',
                hour12: true
            });
            
            return { label: zone.label, time: converted };
        });
        
        return `
            <div class="corporate-card">
                <div class="corporate-term">"${term.term}"</div>
                <div class="corporate-times">
                    ${times.map(t => `
                        <div class="corporate-time-row">
                            <span class="corporate-zone-label">${t.label}</span>
                            <span>${t.time}</span>
                        </div>
                    `).join('')}
                </div>
            </div>
        `;
    }).join('');
}

function renderTimeline() {
    const wrapper = document.getElementById('timelineWrapper');
    const now = new Date();
    
    let html = '';
    
    // Render each timezone's timeline
    userZones.forEach(zone => {
        const currentHour = parseInt(formatTime(now, zone.id).split(':')[0]);
        const currentMinute = parseInt(formatTime(now, zone.id).split(':')[1]);
        const nowPercent = ((currentHour * 60 + currentMinute) / 1440) * 100;
        
        // Calculate working hours position (9 AM to 5 PM = 9-17)
        const workStart = (9 / 24) * 100;
        const workEnd = (17 / 24) * 100;
        
        html += `
            <div class="timeline-row">
                <div class="timeline-label" title="${zone.id}">${zone.label}</div>
                <div class="timeline-bar">
                    <div class="timeline-working" style="left: ${workStart}%; width: ${workEnd - workStart}%;"></div>
                    <div class="timeline-now" style="left: ${nowPercent}%;"></div>
                </div>
            </div>
        `;
    });
    
    // Add hour labels
    html += `
        <div class="timeline-hours">
            ${Array.from({ length: 25 }, (_, i) => `<span>${i.toString().padStart(2, '0')}</span>`).join('')}
        </div>
    `;
    
    wrapper.innerHTML = html;
}

function renderOffsetTable() {
    const table = document.getElementById('offsetTable');
    const localTz = getLocalTimezone();
    const localOffset = getOffsetMinutes(localTz);
    
    table.innerHTML = userZones.map(zone => {
        const zoneOffset = getOffsetMinutes(zone.id);
        const diff = zoneOffset - localOffset;
        const hours = Math.floor(Math.abs(diff) / 60);
        const minutes = Math.abs(diff) % 60;
        
        let diffStr, className;
        if (diff === 0) {
            diffStr = 'Same';
            className = 'same';
        } else if (diff > 0) {
            diffStr = `+${hours}${minutes ? `:${minutes.toString().padStart(2, '0')}` : 'h'}`;
            className = 'positive';
        } else {
            diffStr = `-${hours}${minutes ? `:${minutes.toString().padStart(2, '0')}` : 'h'}`;
            className = 'negative';
        }
        
        return `
            <div class="offset-row">
                <span class="offset-zone">${zone.label}</span>
                <span class="offset-value ${className}">${diffStr}</span>
            </div>
        `;
    }).join('');
}

function convertTime() {
    const sourceTime = document.getElementById('sourceTime').value;
    const sourceZone = document.getElementById('sourceZone').value;
    const targetZone = document.getElementById('targetZone').value;
    const resultEl = document.getElementById('converterResult');
    
    if (!sourceTime) {
        resultEl.querySelector('.result-time').textContent = '--:--';
        resultEl.querySelector('.result-diff').textContent = '';
        return;
    }
    
    const [hours, minutes] = sourceTime.split(':').map(Number);
    
    // Create a date for today with the source time in source timezone
    const now = new Date();
    const sourceDate = new Date(now.toLocaleString('en-US', { timeZone: sourceZone }));
    sourceDate.setHours(hours, minutes, 0, 0);
    
    // Get the UTC time by adjusting for source timezone offset
    const sourceOffset = getOffsetMinutes(sourceZone);
    const utcTime = new Date(sourceDate.getTime() - sourceOffset * 60000);
    
    // Convert to target timezone
    const targetOffset = getOffsetMinutes(targetZone);
    const targetTime = new Date(utcTime.getTime() + targetOffset * 60000);
    
    // Format result
    const resultTime = targetTime.toLocaleTimeString('en-US', {
        hour: '2-digit',
        minute: '2-digit',
        hour12: false
    });
    
    // Check if it's the next/previous day
    const sourceDayStart = new Date(sourceDate);
    sourceDayStart.setHours(0, 0, 0, 0);
    const targetDayStart = new Date(targetTime);
    targetDayStart.setHours(0, 0, 0, 0);
    
    const dayDiff = Math.round((targetDayStart - sourceDayStart) / (24 * 60 * 60 * 1000));
    
    let diffText = '';
    let diffClass = '';
    if (dayDiff === 1) {
        diffText = '(next day)';
        diffClass = 'next-day';
    } else if (dayDiff === -1) {
        diffText = '(previous day)';
        diffClass = 'prev-day';
    } else if (dayDiff > 1) {
        diffText = `(+${dayDiff} days)`;
        diffClass = 'next-day';
    } else if (dayDiff < -1) {
        diffText = `(${dayDiff} days)`;
        diffClass = 'prev-day';
    }
    
    resultEl.querySelector('.result-time').textContent = resultTime;
    const diffEl = resultEl.querySelector('.result-diff');
    diffEl.textContent = diffText;
    diffEl.className = `result-diff ${diffClass}`;
}

function setupEventListeners() {
    // Add zone button
    document.getElementById('addZoneBtn').addEventListener('click', () => {
        document.getElementById('addZoneModal').classList.add('open');
        document.getElementById('zoneLabel').value = '';
    });
    
    // Cancel add zone
    document.getElementById('cancelZone').addEventListener('click', () => {
        document.getElementById('addZoneModal').classList.remove('open');
    });
    
    // Save new zone
    document.getElementById('saveZone').addEventListener('click', () => {
        const zoneId = document.getElementById('zoneSelect').value;
        let label = document.getElementById('zoneLabel').value.trim();
        
        // Check if already added
        if (userZones.some(z => z.id === zoneId)) {
            alert('This timezone is already added!');
            return;
        }
        
        // Find default label if not provided
        if (!label) {
            TIMEZONE_OPTIONS.forEach(group => {
                const found = group.zones.find(z => z.id === zoneId);
                if (found) label = found.label;
            });
        }
        
        userZones.push({ id: zoneId, label });
        saveZones();
        
        document.getElementById('addZoneModal').classList.remove('open');
        renderClocks();
        renderCorporateTime();
        renderTimeline();
        renderOffsetTable();
    });
    
    // Close modal on backdrop click
    document.getElementById('addZoneModal').addEventListener('click', (e) => {
        if (e.target.id === 'addZoneModal') {
            document.getElementById('addZoneModal').classList.remove('open');
        }
    });
    
    // Time converter inputs
    document.getElementById('sourceTime').addEventListener('input', convertTime);
    document.getElementById('sourceZone').addEventListener('change', convertTime);
    document.getElementById('targetZone').addEventListener('change', convertTime);
    
    // Initial conversion
    convertTime();
}
