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
  {
    id: 'timezone-translator',
    name: 'Timezone Translator',
    description: "When someone says 'EOD' but you're in 5 different timezones. Converts corporate time to human time.",
    icon: '🌍',
    path: '/apps/timezone-translator/',
    status: 'live',
  },
  {
    id: 'decision-journal',
    name: 'Decision Journal',
    description: "Log decisions with context. Revisit to learn from outcomes. Because 'I forgot why we did that' is not a post-mortem.",
    icon: '📓',
    path: '/apps/decision-journal/',
    status: 'live',
  },
  {
    id: 'burn-rate',
    name: 'Burn Rate',
    description: "Track every subscription bleeding your wallet. Knowledge is power. Cancellation is savings.",
    icon: '🔥',
    path: '/apps/burn-rate/',
    status: 'live',
  },
  {
    id: 'decision-roulette',
    name: 'Decision Roulette',
    description: "Can't decide where to eat? Let chaos theory choose for you. Warning: may suggest the same place three times in a row.",
    icon: '🎰',
    path: '/apps/decision-roulette/',
    status: 'live',
  },
  {
    id: 'rubber-duck',
    name: 'Rubber Duck Debugger',
    description: "Explain your bug to a duck that judges you gently. 90% of problems solve themselves mid-explanation. The duck takes credit.",
    icon: '🦆',
    path: '/apps/rubber-duck/',
    status: 'live',
  },
  {
    id: 'idea-parking-lot',
    name: 'Idea Parking Lot',
    description: "Brain interrupt? Park it, tag it, get back to work. Review later. Because your best ideas always come at the worst times.",
    icon: '🅿️',
    path: '/apps/idea-parking-lot/',
    status: 'live',
  },
  {
    id: 'streak-keeper',
    name: 'Streak Keeper',
    description: "Build momentum. Track habits with visual streaks, milestones, and weekly views. Don't break the chain.",
    icon: '🔥',
    path: '/apps/streak-keeper/',
    status: 'live',
  },
  {
    id: 'energy-mapper',
    name: 'Energy Mapper',
    description: "Find your peak hours. Track energy levels throughout the day to discover when you're sharpest (and when to take a break).",
    icon: '⚡',
    path: '/apps/energy-mapper/',
    status: 'live',
  },
  {
    id: 'shortcut-shelf',
    name: 'Shortcut Shelf',
    description: "Store the shortcuts you always forget. Keyboard combos, CLI commands, snippets — search instantly, copy, and go.",
    icon: '⌨️',
    path: '/apps/shortcut-shelf/',
    status: 'live',
  },
  {
    id: 'yak-shave',
    name: 'Yak Shave Tracker',
    description: "Track the rabbit holes. Start with one task, end up 5 tangents deep. At least now you'll know how you got there.",
    icon: '🐃',
    path: '/apps/yak-shave/',
    status: 'live',
  },
  {
    id: 'where-was-i',
    name: 'Where Was I?',
    description: "Interrupted? Quick-save your mental state. Restore it when you're back. Because context-switching is expensive.",
    icon: '🧠',
    path: '/apps/where-was-i/',
    status: 'live',
  },
  {
    id: 'tasting-notes',
    name: 'Tasting Notes',
    description: "Your personal flavor journal. Rate spirits, wine, coffee, beer — with radar charts, star ratings, and tasting stats. Because 'it was good' isn't a tasting note.",
    icon: '🥃',
    path: '/apps/tasting-notes/',
    status: 'live',
  },
  {
    id: 'weekly-retro',
    name: 'Weekly Retro',
    description: "End-of-week retrospective in 60 seconds. What worked, what didn't, what to try next. Mood tracking and trends over time.",
    icon: '🔄',
    path: '/apps/weekly-retro/',
    status: 'live',
  },
  {
    id: 'ship-log',
    name: 'Ship Log',
    description: "Captain's log of what you shipped. Prep for standups, track wins, and never say 'what did I even do this week?' again.",
    icon: '🚢',
    path: '/apps/ship-log/',
    status: 'live',
  },
];

// Coming soon - ideas in the pipeline
const comingApps: App[] = [
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
