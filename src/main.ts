// App registry - add new apps here
interface App {
  id: string;
  name: string;
  description: string;
  icon: string;
  path: string;
  status: 'live' | 'beta' | 'coming-soon';
}

// Live apps - these are ready to use
const liveApps: App[] = [
  {
    id: 'ai-course',
    name: 'AI Developer Course',
    description: '4-day hands-on training for developers. Covers prompting, coding assistants, agents, and building AI-powered tools.',
    icon: '🎓',
    path: '/ai-course/',
    status: 'live',
  },
  {
    id: 'ai-executive-course',
    name: 'AI Executive Course',
    description: 'AI training for development firm executives. Covers productivity, operations, tool selection, budgeting, and governance.',
    icon: '🎯',
    path: '/ai-executive-course/',
    status: 'live',
  },
  {
    id: 'ai-survey',
    name: 'AI Course Pre-Assessment',
    description: 'Survey for gauging participant AI knowledge and goals before training sessions.',
    icon: '📋',
    path: '/apps/ai-survey/',
    status: 'live',
  },
  {
    id: 'clawdbot-migration',
    name: 'Clawdbot Migration Checklist',
    description: 'Step-by-step guide for moving Clawdbot to a new Mac Mini. Progress saved locally.',
    icon: '🚚',
    path: '/apps/clawdbot-migration/',
    status: 'live',
  },
  {
    id: 'task-manager',
    name: 'Task Manager',
    description: 'Simple task tracking with priorities, due dates, and categories. All data stored locally.',
    icon: '✅',
    path: '/apps/task-manager/',
    status: 'live',
  },
  {
    id: 'caffeine-tracker',
    name: 'Caffeine Half-Life',
    description: "Track your coffee intake and find out why you can't sleep. Spoiler: it's the 4pm espresso.",
    icon: '☕',
    path: '/apps/caffeine-tracker/',
    status: 'live',
  },
  {
    id: 'focus-timer',
    name: 'Focus Timer',
    description: 'Pomodoro-style focus sessions with stats tracking. Ship more, scroll less.',
    icon: '🎯',
    path: '/apps/focus-timer/',
    status: 'live',
  },
  {
    id: 'brew-tracker',
    name: 'Brew Tracker',
    description: 'Track your homebrew batches — cider, beer, wine, mead. Gravity readings, ABV calculations, and more.',
    icon: '🍺',
    path: '/apps/brew-tracker/',
    status: 'live',
  },
  {
    id: 'meeting-cost',
    name: 'Meeting Cost Calculator',
    description: 'Watch your meeting budget evaporate in real-time. Nothing kills scope creep like cold, hard numbers.',
    icon: '💸',
    path: '/apps/meeting-cost/',
    status: 'live',
  },
];

// Coming soon - ideas in the pipeline
const comingApps: App[] = [
  {
    id: 'decision-roulette',
    name: 'Decision Roulette',
    description: "Can't decide where to eat? Let chaos theory choose for you. Warning: may suggest the same place three times in a row.",
    icon: '🎰',
    path: '#',
    status: 'coming-soon',
  },
  {
    id: 'excuse-generator',
    name: 'Excuse Generator 3000',
    description: 'AI-powered excuses for why your code is late. Includes "blame the DNS" mode and Mercury retrograde detection.',
    icon: '🙈',
    path: '#',
    status: 'coming-soon',
  },
  {
    id: 'meeting-bingo',
    name: 'Meeting Bingo',
    description: '"Let\'s circle back," "synergy," "low-hanging fruit" — corporate buzzword bingo that makes standups bearable.',
    icon: '📋',
    path: '#',
    status: 'coming-soon',
  },
  {
    id: 'name-that-variable',
    name: 'Name That Variable',
    description: 'Finally, an AI that understands temp2_final_v3_FIXED is not a good variable name. Suggestions may include snark.',
    icon: '🏷️',
    path: '#',
    status: 'coming-soon',
  },
  {
    id: 'timezone-translator',
    name: 'Timezone Translator',
    description: "When someone says 'EOD' but you're in 5 different timezones. Converts corporate time to human time.",
    icon: '🌍',
    path: '#',
    status: 'coming-soon',
  },
];

function renderApps() {
  const liveGrid = document.getElementById('app-grid');
  const comingGrid = document.getElementById('coming-grid');

  // Render live apps
  if (liveGrid) {
    if (liveApps.length === 0) {
      liveGrid.innerHTML = `
        <div class="empty-state" style="grid-column: 1 / -1;">
          <div class="icon">🏗️</div>
          <h3>First app incoming...</h3>
          <p>We're putting the finishing touches on something cool. Check back soon!</p>
        </div>
      `;
    } else {
      liveGrid.innerHTML = liveApps
        .map((app) => renderAppCard(app))
        .join('');
    }
  }

  // Render coming soon apps
  if (comingGrid) {
    comingGrid.innerHTML = comingApps
      .map((app) => renderAppCard(app, true))
      .join('');
  }
}

function renderAppCard(app: App, isComingSoon = false): string {
  const cardClass = isComingSoon ? 'app-card coming-soon' : 'app-card';
  const badge = isComingSoon ? '<span class="status-badge">Coming Soon</span>' : '';
  
  const cardContent = `
    <div class="app-icon">${app.icon}</div>
    ${badge}
    <h2>${app.name}</h2>
    <p>${app.description}</p>
    ${!isComingSoon ? '<span class="arrow">→</span>' : ''}
  `;
  
  // Wrap live apps in a link, coming soon stays as div
  if (!isComingSoon) {
    return `<a href="${app.path}" class="${cardClass}">${cardContent}</a>`;
  }
  return `<div class="${cardClass}">${cardContent}</div>`;
}

// Initialize
document.addEventListener('DOMContentLoaded', renderApps);

// Add subtle mouse tracking for cards
document.addEventListener('mousemove', (e) => {
  const cards = document.querySelectorAll('.app-card:not(.coming-soon)');
  cards.forEach((card) => {
    const rect = (card as HTMLElement).getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    (card as HTMLElement).style.setProperty('--mouse-x', `${x}px`);
    (card as HTMLElement).style.setProperty('--mouse-y', `${y}px`);
  });
});
