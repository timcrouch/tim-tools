import { Hono } from 'hono'
import { cors } from 'hono/cors'
import { Database } from 'bun:sqlite'

const app = new Hono()
const db = new Database('tasks.db')

// Initialize database
db.run(`
  CREATE TABLE IF NOT EXISTS tasks (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    title TEXT NOT NULL,
    completed INTEGER DEFAULT 0,
    due_date TEXT,
    created_at TEXT DEFAULT CURRENT_TIMESTAMP
  )
`)

app.use('/*', cors())

// Get all tasks
app.get('/api/tasks', (c) => {
  const tasks = db.query('SELECT * FROM tasks ORDER BY created_at DESC').all()
  return c.json(tasks)
})

// Create task
app.post('/api/tasks', async (c) => {
  const { title, due_date } = await c.req.json()
  if (!title) return c.json({ error: 'Title required' }, 400)
  
  const stmt = db.prepare('INSERT INTO tasks (title, due_date) VALUES (?, ?)')
  const result = stmt.run(title, due_date || null)
  
  const task = db.query('SELECT * FROM tasks WHERE id = ?').get(result.lastInsertRowid)
  return c.json(task, 201)
})

// Update task
app.patch('/api/tasks/:id', async (c) => {
  const id = c.req.param('id')
  const updates = await c.req.json()
  
  const fields: string[] = []
  const values: any[] = []
  
  if ('title' in updates) { fields.push('title = ?'); values.push(updates.title) }
  if ('completed' in updates) { fields.push('completed = ?'); values.push(updates.completed ? 1 : 0) }
  if ('due_date' in updates) { fields.push('due_date = ?'); values.push(updates.due_date) }
  
  if (fields.length === 0) return c.json({ error: 'No updates provided' }, 400)
  
  values.push(id)
  db.run(`UPDATE tasks SET ${fields.join(', ')} WHERE id = ?`, ...values)
  
  const task = db.query('SELECT * FROM tasks WHERE id = ?').get(id)
  return c.json(task)
})

// Delete task
app.delete('/api/tasks/:id', (c) => {
  const id = c.req.param('id')
  db.run('DELETE FROM tasks WHERE id = ?', id)
  return c.json({ success: true })
})

console.log('🚀 Backend running at http://localhost:3001')
export default { port: 3001, fetch: app.fetch }
