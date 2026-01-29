# Day 1 Exercises: AI Foundations & Productivity

## Exercise 1: Platform Comparison Challenge (20 min)

### Goal
Compare how different AI platforms handle the same prompt to understand their strengths.

### Instructions

1. Use this exact prompt in ChatGPT, Claude, and Gemini:

```
Explain microservices vs monolithic architecture for a technical audience.

Include:
1. A comparison table with pros and cons
2. When to choose each approach (with specific criteria)
3. A migration strategy from monolith to microservices
4. A real-world example of a company that made this transition

Format the response with clear headers and be specific.
```

2. For each response, evaluate:
   - **Accuracy**: Is the information correct?
   - **Depth**: How thorough is the explanation?
   - **Formatting**: Is it well-organized and readable?
   - **Usefulness**: Would you actually use this in work?

3. Document your findings:

| Criteria | ChatGPT | Claude | Gemini |
|----------|---------|--------|--------|
| Accuracy | /5 | /5 | /5 |
| Depth | /5 | /5 | /5 |
| Formatting | /5 | /5 | /5 |
| Usefulness | /5 | /5 | /5 |

4. Write a 2-3 sentence conclusion: Which would you use for this type of task and why?

---

## Exercise 2: Prompt Engineering Lab (30 min)

### Goal
Transform a vague prompt into an effective one using structured techniques.

### Part A: The Vague Prompt

Start with: `"Write me a good README"`

Send this to your preferred AI. Note the result.

### Part B: Apply RCTF Pattern

Transform using Role + Context + Task + Format:

```
[ROLE] You are a senior developer who writes excellent documentation.

[CONTEXT] 
Project: A REST API for task management built with Express.js and PostgreSQL.
Features: CRUD operations, user authentication, task filtering, due dates.
Target users: Developers who want to integrate or contribute.

[TASK]
Write a README.md that helps developers quickly understand and use this project.

[FORMAT]
Include these sections:
- Title with badges (use placeholder URLs)
- One-paragraph description (max 50 words)
- Features list (bullet points)
- Quick start (3 steps: clone, install, run)
- Environment variables table
- API endpoints table (method, path, description)
- Contributing section (brief)
- License

Use markdown formatting. Be concise.
```

### Part C: Add Few-Shot Example

Add this to your prompt:

```
Example of a good Quick Start section:

## Quick Start
```bash
git clone https://github.com/example/project.git
cd project
npm install && npm start
```
Server runs at http://localhost:3000

---

Now write the README following this style.
```

### Part D: Compare Results

1. Compare output from Part A vs Part C
2. Which is more useful? Why?
3. What other improvements could you make?

---

## Exercise 3: Build Your First AI Workflow (45 min)

### Goal
Create a reusable workflow for a task you do frequently.

### Step 1: Identify Your Task

Choose something you do regularly:
- [ ] Reviewing code for quality
- [ ] Writing status update emails
- [ ] Summarizing meeting notes
- [ ] Drafting technical documentation
- [ ] Creating user stories from requirements
- [ ] Other: _______________

### Step 2: Design Your Template

Create a prompt template with placeholders:

```
[Your template here]

Example:
---
As a [ROLE], review this code for [FOCUS AREAS].

Code:
```[LANGUAGE]
[CODE_HERE]
```

Provide:
1. Summary of what the code does
2. Issues found (severity: high/medium/low)
3. Specific fixes for each issue
4. One improvement suggestion
---
```

### Step 3: Test With Real Examples

Test your template with 3 real examples from your work:

| Example | Quality (1-5) | Time Saved | Notes |
|---------|---------------|------------|-------|
| 1 | | | |
| 2 | | | |
| 3 | | | |

### Step 4: Refine

Based on testing:
- What worked well?
- What needed manual editing?
- How would you improve the template?

Update your template and save for future use.

---

## Exercise 4: Claude Projects Setup (20 min)

### Goal
Create a Claude Project configured for your professional context.

### Step 1: Create New Project

1. Go to Claude.ai → Projects → New Project
2. Name it: "[Your Role] Assistant" (e.g., "Backend Dev Assistant")

### Step 2: Write Project Instructions

Add to custom instructions:

```
# Context
You are helping [YOUR NAME], a [YOUR ROLE] at [COMPANY/TYPE].

# My Stack
- Primary languages: [LANGUAGES]
- Frameworks: [FRAMEWORKS]
- Database: [DATABASE]
- Cloud: [CLOUD PROVIDER]

# My Preferences
- Response style: [concise/detailed/balanced]
- Code style: [conventions you follow]
- Communication: [formal/casual]

# Common Tasks
I often need help with:
1. [COMMON TASK 1]
2. [COMMON TASK 2]
3. [COMMON TASK 3]

# Guidelines
- When writing code, include [YOUR REQUIREMENTS]
- For explanations, assume I [EXPERIENCE LEVEL]
- Always [ANY SPECIAL INSTRUCTIONS]
```

### Step 3: Add Reference Files (Optional)

Upload helpful documents:
- Coding standards document
- API documentation you reference
- Project architecture overview
- Frequently used templates

### Step 4: Test Your Project

Try these tasks:
1. Ask a technical question in your domain
2. Request code in your preferred style
3. Ask for a document in your preferred format

Does it reflect your preferences? Adjust instructions as needed.

---

## Exercise 5: AI-Powered Meeting Prep (25 min)

### Goal
Use AI to prepare for an actual upcoming meeting.

### Select Your Meeting

Choose a real meeting in the next week:
- Meeting with: _______________
- Topic: _______________
- Your goal: _______________

### Research Phase

Prompt:
```
Help me prepare for a meeting about [TOPIC].

Context:
- Meeting with: [PERSON/TEAM]
- My role: [YOUR ROLE]  
- Duration: [LENGTH]
- My goal: [WHAT YOU WANT TO ACHIEVE]

Please provide:
1. Key questions I should ask
2. Points I should prepare to discuss
3. Potential concerns they might raise
4. Data or examples I should bring
5. Ideal outcome and next steps
```

### Agenda Draft

Prompt:
```
Based on our discussion, create a brief meeting agenda.

Format:
- Opening (5 min): [topic]
- Main discussion (X min): [topics]
- Next steps (5 min): [topic]

Keep it to one page max.
```

### Follow-up Template

Prompt:
```
Write a template for a follow-up email after this meeting.

Include:
- Thank you
- Summary of key points
- Agreed action items
- Next meeting date placeholder

Tone: Professional but friendly
Length: Under 200 words
```

### Deliverables Checklist

- [ ] Questions prepared
- [ ] Talking points ready
- [ ] Agenda drafted
- [ ] Follow-up email template saved

---

## Day 1 Completion Checklist

By end of day, ensure you have:

- [ ] Completed platform comparison with notes
- [ ] Created improved prompt using RCTF pattern
- [ ] Built and tested one reusable workflow template
- [ ] Set up Claude Project with your context
- [ ] Prepared for one real upcoming meeting

### Reflection Questions

1. Which AI platform felt most natural for your work style?
2. What type of prompt improvements made the biggest difference?
3. Where do you see AI fitting into your daily workflow?

---

*Keep these exercises and templates—you'll build on them throughout the course!*
