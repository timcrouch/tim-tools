# Task App

A simple task management app built with:
- **Frontend:** React + Vite + Tailwind CSS
- **Backend:** Bun + Hono + SQLite

## Quick Start

### 1. Install dependencies

```bash
cd backend && bun install
cd ../frontend && bun install
```

### 2. Run the backend

```bash
cd backend && bun dev
```

### 3. Run the frontend (new terminal)

```bash
cd frontend && bun dev
```

### 4. Open in browser

Visit: http://localhost:3000

## Features

- ✅ Create tasks with optional due dates
- ✅ Mark tasks complete/incomplete
- ✅ Edit tasks inline
- ✅ Delete tasks
- ✅ Filter by all/active/completed
- ✅ Persistent SQLite storage

## API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | /api/tasks | List all tasks |
| POST | /api/tasks | Create a task |
| PATCH | /api/tasks/:id | Update a task |
| DELETE | /api/tasks/:id | Delete a task |
