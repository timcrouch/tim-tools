# 🛠️ Tim's Tools

A collection of small apps and experiments built by Tim & Giterdone.

## Structure

```
tim-tools/
├── apps/                    # Individual mini-apps
│   └── example/            # Each app has its own folder
│       ├── index.html
│       ├── main.ts
│       └── style.css
├── shared/                  # Shared code
│   ├── components/
│   └── utils/
├── src/                     # Landing page source
├── index.html              # Landing page
└── vite.config.ts          # Build config
```

## Development

```bash
# Install dependencies
npm install

# Start dev server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

## Adding a New App

1. Create a folder in `apps/`:
   ```bash
   mkdir -p apps/my-app
   ```

2. Add `index.html`, `main.ts`, and optionally `style.css`

3. Register it in `src/main.ts`:
   ```ts
   const apps: App[] = [
     {
       id: 'my-app',
       name: 'My App',
       description: 'What it does',
       icon: '✨',
       path: '/apps/my-app/',
     },
   ];
   ```

4. Run `npm run dev` and it auto-discovers the new app

## Deployment

Build outputs to `dist/`. Deploy anywhere that serves static files:
- Netlify
- Vercel
- GitHub Pages
- Cloudflare Pages

---

*Built with Vite + TypeScript* 😉
