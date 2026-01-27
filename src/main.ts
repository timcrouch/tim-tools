// App registry - add new apps here
interface App {
  id: string;
  name: string;
  description: string;
  icon: string;
  path: string;
}

const apps: App[] = [
  // Example entry (uncomment when you add your first app):
  // {
  //   id: 'example',
  //   name: 'Example App',
  //   description: 'A simple example application',
  //   icon: '✨',
  //   path: '/apps/example/',
  // },
];

function renderApps() {
  const grid = document.getElementById('app-grid');
  if (!grid) return;

  if (apps.length === 0) {
    // Keep the placeholder
    return;
  }

  // Clear placeholder and render apps
  grid.innerHTML = apps
    .map(
      (app) => `
      <a href="${app.path}" class="app-card">
        <div class="app-icon">${app.icon}</div>
        <h2>${app.name}</h2>
        <p>${app.description}</p>
      </a>
    `
    )
    .join('');
}

document.addEventListener('DOMContentLoaded', renderApps);
