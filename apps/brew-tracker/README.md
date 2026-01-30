# 🍺 Brew Tracker

A mobile-first homebrew tracking app for managing your cider, beer, wine, mead, and other fermented creations.

## Features

- **📊 Dashboard** - See active brews, stats, and upcoming reminders at a glance
- **🫧 Batch Tracking** - Track fermentation progress with gravity readings and status updates
- **📖 Recipe Library** - Save and reuse your favorite recipes
- **🧮 ABV Calculator** - Quick gravity-to-ABV calculations
- **🔔 Reminders** - Set reminders for racking, bottling, and tasting
- **🔒 PIN Protection** - Simple 4-digit PIN for privacy
- **📱 Mobile-First** - Designed for easy use on your phone

## Setup

### 1. Create a Supabase Project

1. Go to [supabase.com](https://supabase.com) and create a free account
2. Create a new project
3. Go to **Project Settings** → **API** and copy:
   - Project URL (e.g., `https://xxxxx.supabase.co`)
   - `anon` public key

### 2. Create Database Tables

Go to the **SQL Editor** in your Supabase dashboard and run this SQL:

```sql
-- Batches table
CREATE TABLE batches (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  brew_type TEXT NOT NULL CHECK (brew_type IN ('cider', 'beer', 'wine', 'mead', 'other')),
  status TEXT NOT NULL DEFAULT 'fermenting' CHECK (status IN ('fermenting', 'conditioning', 'bottled', 'ready', 'finished')),
  batch_size_value NUMERIC NOT NULL,
  batch_size_unit TEXT NOT NULL CHECK (batch_size_unit IN ('gallons', 'liters')),
  original_gravity NUMERIC,
  final_gravity NUMERIC,
  abv NUMERIC,
  start_date DATE NOT NULL,
  bottle_date DATE,
  ready_date DATE,
  total_cost NUMERIC,
  tasting_notes TEXT,
  rating INTEGER CHECK (rating >= 1 AND rating <= 5),
  photo_urls TEXT[],
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Ingredients table
CREATE TABLE ingredients (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  batch_id UUID NOT NULL REFERENCES batches(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  amount_value NUMERIC NOT NULL,
  amount_unit TEXT NOT NULL,
  cost NUMERIC,
  notes TEXT
);

-- Gravity readings table
CREATE TABLE gravity_readings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  batch_id UUID NOT NULL REFERENCES batches(id) ON DELETE CASCADE,
  reading_date DATE NOT NULL,
  gravity NUMERIC NOT NULL,
  temperature NUMERIC,
  notes TEXT
);

-- Recipes table
CREATE TABLE recipes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  brew_type TEXT NOT NULL CHECK (brew_type IN ('cider', 'beer', 'wine', 'mead', 'other')),
  description TEXT,
  default_ingredients JSONB DEFAULT '[]'::jsonb,
  target_og NUMERIC,
  target_fg NUMERIC,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Reminders table
CREATE TABLE reminders (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  batch_id UUID REFERENCES batches(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  due_date DATE NOT NULL,
  completed BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Settings table (for PIN storage)
CREATE TABLE settings (
  key TEXT PRIMARY KEY,
  value TEXT NOT NULL
);

-- Create indexes for common queries
CREATE INDEX idx_batches_status ON batches(status);
CREATE INDEX idx_batches_start_date ON batches(start_date DESC);
CREATE INDEX idx_ingredients_batch_id ON ingredients(batch_id);
CREATE INDEX idx_gravity_readings_batch_id ON gravity_readings(batch_id);
CREATE INDEX idx_reminders_due_date ON reminders(due_date);
CREATE INDEX idx_reminders_batch_id ON reminders(batch_id);

-- Enable Row Level Security (RLS)
ALTER TABLE batches ENABLE ROW LEVEL SECURITY;
ALTER TABLE ingredients ENABLE ROW LEVEL SECURITY;
ALTER TABLE gravity_readings ENABLE ROW LEVEL SECURITY;
ALTER TABLE recipes ENABLE ROW LEVEL SECURITY;
ALTER TABLE reminders ENABLE ROW LEVEL SECURITY;
ALTER TABLE settings ENABLE ROW LEVEL SECURITY;

-- Create policies for anonymous access (secured by PIN in app)
CREATE POLICY "Allow all for anon" ON batches FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow all for anon" ON ingredients FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow all for anon" ON gravity_readings FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow all for anon" ON recipes FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow all for anon" ON reminders FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow all for anon" ON settings FOR ALL USING (true) WITH CHECK (true);
```

### 3. Configure Environment Variables

Create a `.env` file in the project root:

```env
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key-here
```

### 4. Deploy to Netlify

1. Push this code to a Git repository
2. Connect the repo to Netlify
3. Add the environment variables in Netlify:
   - Go to **Site Settings** → **Environment Variables**
   - Add `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY`
4. Deploy!

The `netlify.toml` is already configured for SPA routing.

## Local Development

```bash
# Install dependencies
npm install

# Run dev server
npm run dev

# Build for production
npm run build
```

## Tech Stack

- **Frontend:** React 18 + TypeScript + Vite
- **Styling:** TailwindCSS 4 with custom brewing theme
- **Backend:** Supabase (PostgreSQL + instant API)
- **Charts:** Recharts for gravity readings visualization
- **Routing:** React Router 6

## Reminder System

The app stores reminders in Supabase. A separate cron job (via Clawdbot/Giterdone) checks for due reminders daily and sends Slack notifications.

## Color Palette

- **Amber:** #F59E0B (primary)
- **Copper:** #B45309 (secondary)
- **Dark Brown:** #451A03 (text)
- **Cream:** #FEF3C7 (background)

## Status Flow

```
🫧 Fermenting → ❄️ Conditioning → 🍾 Bottled → ✅ Ready → 🏁 Finished
```

---

Made with 🍺 for Tim's brewing adventures!
