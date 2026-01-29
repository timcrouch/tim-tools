# Day 2 Exercises: AI-Powered Development

## Exercise 1: Cursor Setup & First Build (30 min)

### Goal
Get Cursor configured and build something using Composer.

### Step 1: Setup Check

Verify you have:
- [ ] Cursor installed ([cursor.sh](https://cursor.sh))
- [ ] Logged in (free tier or subscription)
- [ ] Git installed and configured

### Step 2: Create Project Structure

```bash
mkdir ai-tasks-api && cd ai-tasks-api
git init
```

### Step 3: Create .cursorrules

Create `.cursorrules` in project root:

```
You are working on a Node.js REST API project.

Tech stack:
- Runtime: Node.js 20+
- Framework: Express.js
- Database: SQLite (for simplicity)
- Testing: Jest
- Language: JavaScript (ES modules)

Conventions:
- Use async/await, never callbacks
- All routes in src/routes/
- All database logic in src/db/
- Error handling with try/catch and proper HTTP status codes
- Use express.json() middleware
- Include input validation

When generating code:
- Include JSDoc comments for functions
- Add TODO comments for things to improve
- Follow REST conventions (plural nouns, proper verbs)
```

### Step 4: Use Composer

Open Composer (⌘I / Ctrl+I) and enter:

```
Create a simple REST API with Express that has CRUD operations for a 'tasks' resource.

Include:
- GET /tasks - list all tasks
- GET /tasks/:id - get single task
- POST /tasks - create task
- PUT /tasks/:id - update task
- DELETE /tasks/:id - delete task

Task should have: id, title, description, completed, createdAt

Use SQLite for storage. Create the database schema automatically.
Include basic error handling.
```

### Step 5: Let Agent Mode Work

1. Enable Agent mode if prompted
2. Let it create files and run commands
3. Review each change before accepting

### Step 6: Test It Works

```bash
npm install  # if not already done
npm start

# In another terminal:
curl http://localhost:3000/tasks
curl -X POST http://localhost:3000/tasks -H "Content-Type: application/json" -d '{"title":"Test task"}'
```

### Deliverable
Working REST API created primarily through AI assistance.

---

## Exercise 2: Vibe Coding Challenge (30 min)

### Goal
Build something functional in 30 minutes using only AI assistance.

### Rules
- Timer: Exactly 30 minutes
- Accept AI suggestions quickly
- Don't stop to perfect—iterate fast
- Focus on "working" over "perfect"

### Choose Your Project

Pick ONE:

**Option A: CLI Tool**
```
Create a command-line tool that:
- Accepts a URL as argument
- Fetches the page
- Extracts all links
- Outputs them as a numbered list
- Optionally saves to a file with --output flag
```

**Option B: Simple Web App**
```
Create a single-page web app that:
- Has an input field for a quote
- Has a "Save" button
- Stores quotes in localStorage
- Displays all saved quotes
- Has a "Random Quote" button
- Looks decent (basic CSS)
```

**Option C: URL Shortener API**
```
Create an API that:
- POST /shorten with { url: "..." } creates short code
- GET /:code redirects to original URL
- GET /stats/:code shows visit count
- Store data in memory (no database)
```

### Timer Starts Now!

1. Start your timer
2. Create project folder
3. Open in Cursor
4. Describe to Composer what you want
5. Accept, run, iterate
6. Stop at 30 minutes regardless of state

### Post-Exercise Reflection

| Question | Your Answer |
|----------|-------------|
| What % complete? | |
| Biggest time sink? | |
| What would you do differently? | |
| Estimated time without AI? | |

---

## Exercise 3: Claude Code Refactoring (25 min)

### Goal
Use Claude Code to improve existing code.

### Prerequisites
- API key for Anthropic (or use trial if available)
- Claude Code CLI installed

### Step 1: Use Your Code from Exercise 2

Navigate to your vibe coding project:

```bash
cd [your-project]
claude
```

### Step 2: Add TypeScript

```
Convert this project to TypeScript:
1. Add TypeScript configuration
2. Convert all .js files to .ts
3. Add proper type annotations
4. Make sure it still runs

Do this step by step.
```

### Step 3: Improve Error Handling

```
Review and improve error handling in this codebase:
1. Add try-catch where missing
2. Create custom error types
3. Add proper error responses
4. Log errors appropriately
```

### Step 4: Add Input Validation

```
Add input validation:
1. Use Zod or a similar library
2. Validate all user inputs
3. Return helpful error messages for invalid input
```

### Step 5: Review Changes

After Claude Code makes changes:

1. Run `git diff` to see all changes
2. Review each file
3. Run tests/try the app

### Reflection

- Did Claude Code make reasonable choices?
- What needed manual adjustment?
- How does this compare to doing it manually?

---

## Exercise 4: Test-First Development (35 min)

### Goal
Practice test-driven development with AI implementation.

### The Task: Password Validator

Requirements:
- Minimum 8 characters
- At least 1 uppercase letter
- At least 1 lowercase letter
- At least 1 number
- At least 1 special character (!@#$%^&*)
- Not in list of common passwords
- Returns object: { valid: boolean, errors: string[] }

### Step 1: Write Tests First (YOU write these)

Create `passwordValidator.test.js`:

```javascript
import { describe, it, expect } from 'vitest'; // or jest
import { validatePassword } from './passwordValidator';

describe('validatePassword', () => {
  // Valid passwords
  it('accepts a valid password', () => {
    const result = validatePassword('SecurePass1!');
    expect(result.valid).toBe(true);
    expect(result.errors).toHaveLength(0);
  });

  // Length validation
  it('rejects passwords shorter than 8 characters', () => {
    const result = validatePassword('Short1!');
    expect(result.valid).toBe(false);
    expect(result.errors).toContain('Password must be at least 8 characters');
  });

  // YOUR TURN: Add tests for...
  
  // Uppercase requirement
  it('rejects passwords without uppercase letters', () => {
    // TODO: Write this test
  });

  // Lowercase requirement
  it('rejects passwords without lowercase letters', () => {
    // TODO: Write this test
  });

  // Number requirement
  it('rejects passwords without numbers', () => {
    // TODO: Write this test
  });

  // Special character requirement
  it('rejects passwords without special characters', () => {
    // TODO: Write this test
  });

  // Common password check
  it('rejects common passwords', () => {
    // TODO: Write this test
  });

  // Multiple errors
  it('returns all errors for password with multiple issues', () => {
    // TODO: Write this test
  });

  // Edge cases
  it('handles empty string', () => {
    // TODO: Write this test
  });

  it('handles very long passwords', () => {
    // TODO: Write this test
  });
});
```

### Step 2: Ask AI to Implement

Once tests are written, prompt:

```
Implement the validatePassword function to make all these tests pass.

[Paste your tests]

Requirements:
- Return { valid: boolean, errors: string[] }
- Check all criteria
- Include these common passwords: ['password', '12345678', 'qwerty123', 'admin123']
- Collect ALL errors, not just first one
```

### Step 3: Review & Refine

1. Run tests: `npm test`
2. Check if all pass
3. If not, ask AI to fix specific failures
4. Review the implementation—do you understand it?

### Step 4: Add Edge Case Tests

Ask AI:
```
What edge cases am I missing in these tests? Suggest 3 more test cases I should add.
```

Add those tests, ensure implementation still passes.

### Deliverable

- [ ] Tests written (by you)
- [ ] Implementation generated (by AI)
- [ ] All tests passing
- [ ] Code reviewed and understood

---

## Exercise 5: Full-Stack Mini Project (60 min)

### Goal
Build a complete small application combining vibe coding and structured approaches.

### Choose Your Project

**Option A: Bookmark Manager**
- Save bookmarks with title, URL, tags
- List all bookmarks
- Filter by tag
- Simple web interface

**Option B: Note-Taking App**
- Create/edit/delete notes
- Markdown support
- Search notes
- Web interface

**Option C: Simple Dashboard**
- Display data from a mock API
- Show charts/graphs
- Filterable date range
- Responsive design

### Phase 1: Vibe Scaffold (15 min)

Use Cursor Composer:
```
Create the basic project structure for a [YOUR CHOICE] app.

Stack:
- Backend: [Express/FastAPI/your choice]
- Frontend: [React/Vue/vanilla/your choice]
- Database: [SQLite/in-memory/your choice]

Just scaffold—we'll refine later.
```

Accept quickly, get something working.

### Phase 2: Structured Core Logic (20 min)

Identify 2-3 core functions. Write tests first, then implement.

Example for Bookmark Manager:
- `validateBookmark(bookmark)` - validates input
- `searchBookmarks(query, bookmarks)` - filters bookmarks
- `parseUrl(url)` - extracts domain, title if possible

### Phase 3: Vibe UI (15 min)

Back to vibe coding for the UI:
```
Add a simple, clean UI for this app:
- [List requirements]
- Keep it minimal but usable
- Use [CSS framework of choice or vanilla]
```

### Phase 4: Structured Review (10 min)

Use AI for code review:
```
Review this codebase for:
1. Security issues
2. Error handling gaps
3. Code quality concerns

Provide specific fixes.
```

Implement the fixes.

### Reflection Document

Create `LEARNINGS.md`:

```markdown
# Project Learnings

## What I Built
[Description]

## Where Vibe Coding Helped
- [Example 1]
- [Example 2]

## Where Vibe Coding Hurt
- [Example 1]
- [Example 2]

## Where Structured Approach Was Necessary
- [Example 1]
- [Example 2]

## My Decision Framework Going Forward
When to vibe:
- ...

When to structure:
- ...

## Time Breakdown
- Scaffolding: X min
- Tests: X min
- Implementation: X min
- UI: X min
- Review/fixes: X min
```

---

## Day 2 Completion Checklist

- [ ] Cursor configured with .cursorrules
- [ ] 30-minute vibe project completed
- [ ] Claude Code refactoring done
- [ ] Test-first exercise complete (all tests passing)
- [ ] Full-stack mini project with LEARNINGS.md

### Key Takeaways

Document your personal answers:

1. When do you reach for vibe coding?
2. When do you switch to structured?
3. What's your "trust but verify" process for AI code?
4. What will you change in your daily workflow?

---

*Save your projects—you'll document them on Day 3!*
