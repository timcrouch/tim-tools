// App registry - add new apps here
interface App {
  id: string;
  name: string;
  description: string;
  icon: string;
  path: string;
  status?: 'live' | 'beta' | 'coming-soon';
}

const apps: App[] = [
  // Example entries (uncomment when you add apps):
  // {
  //   id: 'example',
  //   name: 'Example App',
  //   description: 'A simple example application to get started.',
  //   icon: '✨',
  //   path: '/apps/example/',
  //   status: 'live',
  // },
];

function renderApps() {
  const grid = document.getElementById('app-grid');
  if (!grid) return;

  if (apps.length === 0) {
    grid.innerHTML = `
      <div class="empty-state" style="grid-column: 1 / -1;">
        <div class="icon">🚀</div>
        <h3>Ready for liftoff</h3>
        <p>Your first app will appear here. Let's build something!</p>
      </div>
    `;
    return;
  }

  grid.innerHTML = apps
    .map(
      (app) => `
      <a href="${app.path}" class="app-card">
        <div class="app-icon">${app.icon}</div>
        <h2>${app.name}</h2>
        <p>${app.description}</p>
        <span class="arrow">→</span>
      </a>
    `
    )
    .join('');
}

// Initialize
document.addEventListener('DOMContentLoaded', renderApps);

// Add some subtle interactivity
document.addEventListener('mousemove', (e) => {
  const cards = document.querySelectorAll('.app-card');
  cards.forEach((card) => {
    const rect = (card as HTMLElement).getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    (card as HTMLElement).style.setProperty('--mouse-x', `${x}px`);
    (card as HTMLElement).style.setProperty('--mouse-y', `${y}px`);
  });
});
