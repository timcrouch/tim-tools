import { defineConfig } from 'vite';
import { resolve } from 'path';
import { readdirSync, existsSync } from 'fs';

// Auto-discover app entry points
function getAppEntries() {
  const appsDir = resolve(__dirname, 'apps');
  const entries: Record<string, string> = {
    main: resolve(__dirname, 'index.html'),
  };

  if (existsSync(appsDir)) {
    const apps = readdirSync(appsDir, { withFileTypes: true })
      .filter((d) => d.isDirectory())
      .map((d) => d.name);

    for (const app of apps) {
      const indexPath = resolve(appsDir, app, 'index.html');
      if (existsSync(indexPath)) {
        entries[app] = indexPath;
      }
    }
  }

  return entries;
}

export default defineConfig({
  build: {
    rollupOptions: {
      input: getAppEntries(),
    },
  },
  resolve: {
    alias: {
      '@': resolve(__dirname, 'src'),
      '@shared': resolve(__dirname, 'shared'),
    },
  },
});
