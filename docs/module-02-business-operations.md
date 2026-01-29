# Module 2: AI for Business Operations

## Course: AI for Development Firm Executives
### Duration: 60-75 minutes
### Format: Interactive workshop with hands-on exercise

---

## Learning Objectives

By the end of this module, participants will be able to:

1. Use AI tools within Microsoft Excel for financial modeling and data analysis
2. Generate professional reports and presentations from raw data or notes
3. Accelerate contract and proposal review using AI
4. Draft client communications more efficiently
5. Create and maintain process documentation and SOPs with AI assistance
6. Complete a financial analysis exercise using Claude or Copilot in Excel

---

## Section 1: AI in Excel - Financial Modeling, Forecasting, and Analysis

### The New Excel Workflow

**Traditional approach:** Build formulas manually, copy patterns, debug errors, create charts one by one.

**AI-enhanced approach:** Describe what you want in natural language, let AI generate formulas and analysis, refine and verify.

### Microsoft 365 Copilot in Excel

**What it can do:**

1. **Analyze data and provide insights**
   - "What are the trends in this data?"
   - "Which projects were most profitable last quarter?"
   - "Show me anomalies in our billing data"

2. **Create formulas from descriptions**
   - "Calculate the running total of revenue by month"
   - "Show percentage change from previous period"
   - "Flag any expenses over $10,000"

3. **Generate visualizations**
   - "Create a chart showing revenue by client over time"
   - "Make a dashboard of key financial metrics"

4. **Build models**
   - "Create a 12-month cash flow projection based on this historical data"
   - "Build a what-if model for different staffing scenarios"

**Example conversation with Copilot in Excel:**

```
You: "Analyze this project profitability data and identify which project types 
have the best margins"

Copilot: [Analyzes data, creates summary table, highlights findings]

You: "Create a chart showing margin trends by project type over the last 4 quarters"

Copilot: [Generates visualization]

You: "Now add a forecast for the next 2 quarters based on these trends"

Copilot: [Extends analysis with projections]
```

### Using Claude or ChatGPT for Excel Work

**When you don't have Copilot, or for complex analysis:**

**Approach 1: Formula Generation**
```
Prompt: "I have an Excel spreadsheet with columns:
A: Project Name
B: Client
C: Start Date
D: End Date  
E: Budgeted Hours
F: Actual Hours
G: Hourly Rate
H: Total Billed

Create formulas for:
1. Column I: Project Duration (in days)
2. Column J: Utilization % (Actual vs Budgeted)
3. Column K: Revenue (Actual Hours × Rate)
4. Column L: Variance (Total Billed - Revenue)
5. A summary section showing totals and averages"
```

**Approach 2: Data Analysis**
```
Prompt: "I'm going to paste data from our project profitability spreadsheet. 
Analyze it and tell me:
1. Which clients are most profitable?
2. Which project types have the best margins?
3. Are there any concerning patterns?
4. What questions should I be asking about this data?

[Paste data]"
```

**Approach 3: Model Building**
```
Prompt: "Help me build a financial model for software development project pricing.

Variables:
- Developer hourly cost: $75 (junior), $100 (mid), $150 (senior)
- Desired margin: 35%
- Overhead multiplier: 1.2
- Risk contingency: 10-20% depending on project complexity

Create the formulas I need for a pricing calculator in Excel."
```

### Practical Financial Analysis Tasks

**1. Cash Flow Forecasting**
```
Prompt: "Create a 12-month cash flow forecast template for a software 
development firm. Include:
- Revenue recognition based on project milestones
- Recurring revenue (maintenance contracts)
- Payroll (monthly, with annual raises)
- Variable costs (contractors, cloud services)
- Fixed costs (rent, insurance, subscriptions)
- Tax payments (quarterly)
- Include scenarios: baseline, optimistic (+20%), pessimistic (-20%)"
```

**2. Utilization Analysis**
```
Prompt: "I need to analyze team utilization. My data includes:
- Employee name
- Department
- Available hours (varies by employee)
- Billable hours by week
- Project assignments

Help me create:
1. Individual utilization rates
2. Department averages
3. Trend analysis (is utilization improving or declining?)
4. Red flags (anyone consistently under or over utilized?)"
```

**3. Project Profitability**
```
Prompt: "Analyze project profitability with this data structure:
- Project revenue (fixed price or T&M)
- Labor costs (actual hours × cost rates)
- Direct expenses
- Allocated overhead

Show me:
1. Gross margin by project
2. Net margin after overhead
3. Comparison to estimates
4. Pattern analysis (which project types are most profitable?)"
```

---

## Section 2: Report and Presentation Generation

### From Data to Presentation

**The old way:** Export data, create slides manually, write talking points, format everything.

**The AI way:** Feed data and context to AI, generate draft slides, refine, and export.

### Using AI for Report Writing

**Monthly Business Review Example:**

```
Prompt: "Create a monthly business review report for a software development firm. 

Here's the data:
- Revenue: $485,000 (vs. $450,000 last month, vs. $420,000 same month last year)
- Active projects: 12 (3 new, 2 completed)
- Team utilization: 78% (target: 80%)
- New business pipeline: $1.2M
- Key wins: [describe]
- Challenges: [describe]

Format as an executive summary with:
1. Key metrics dashboard (suggest how to visualize)
2. Highlights and lowlights
3. Looking ahead
4. Items needing leadership attention"
```

### Presentation Creation Workflow

**Step 1: Outline Generation**
```
Prompt: "I'm presenting our Q2 results to the board. Create a presentation outline.

Key messages:
- Revenue up 15% YoY
- Won 3 significant new clients
- Expanded into healthcare vertical
- Challenges with senior developer retention
- Investing in AI tools for productivity

Audience: Board of directors (mix of technical and non-technical)
Duration: 20 minutes with 10 minutes Q&A"
```

**Step 2: Slide Content**
```
Prompt: "Write the content for slide 3: 'New Client Wins'

Clients won:
- HealthFirst (healthcare SaaS, $350K initial contract)
- RetailMax (inventory management, $180K)  
- GreenEnergy (utility analytics, $220K)

Make it concise with bullet points. Include a key insight or theme 
that ties these wins together."
```

**Step 3: Speaker Notes**
```
Prompt: "Write speaker notes for this slide. Include:
- Key talking points (2-3 minutes of content)
- One specific story or detail to share
- Anticipated question and prepared answer"
```

### PowerPoint with Copilot

**If using Microsoft 365 Copilot:**

1. Open PowerPoint, start with a blank presentation
2. Click "Copilot" in the ribbon
3. Prompt: "Create a presentation about [topic] with [X] slides"
4. Refine: "Add more detail to slide 3" or "Make slide 5 more visual"
5. Generate speaker notes: "Add speaker notes to all slides"

**Pro tip:** Start with a Word document outline, then use Copilot to "Create a presentation from this document"

---

## Section 3: Contract and Proposal Review

### AI-Assisted Contract Review

**Use case:** Quickly understand key terms, identify risks, and prepare questions.

**Important caveat:** AI is not legal advice. Always have contracts reviewed by qualified legal counsel for significant deals.

**Effective contract review prompt:**
```
Prompt: "Review this Master Services Agreement and provide:

1. **Plain English Summary** (2-3 paragraphs)
   - What we're agreeing to
   - Key obligations on each party
   
2. **Key Commercial Terms**
   - Payment terms
   - Term and renewal provisions
   - Pricing and rate escalation
   
3. **Risk Analysis**
   - Liability limitations (or lack thereof)
   - Indemnification requirements
   - IP ownership and assignment
   - Termination conditions
   - Non-compete or exclusivity clauses
   
4. **Red Flags**
   - Unusual or one-sided terms
   - Terms that differ from industry standard
   - Missing protections we typically require
   
5. **Questions to Ask**
   - Clarifications needed
   - Negotiation points to raise
   
6. **Comparison to Our Standard Terms**
   [If you have standard terms, paste them for comparison]

[Paste contract]"
```

### Proposal Review and Improvement

**For reviewing your own proposals:**
```
Prompt: "Review this proposal for [project type]. 

Act as a critical client evaluating vendors. Identify:
1. Strengths that would differentiate us
2. Weaknesses or gaps
3. Unclear or confusing sections
4. Missing information the client likely wants
5. Areas where competitors might outperform us

Then suggest specific improvements for each weakness.

[Paste proposal]"
```

**For analyzing competitor proposals (when available):**
```
Prompt: "Compare our proposal to this competitor proposal.

Our proposal: [paste]
Competitor proposal: [paste]

Analyze:
1. How do our prices compare?
2. Where is their approach stronger?
3. Where is our approach stronger?
4. What are they promising that we're not?
5. How can we differentiate more effectively?"
```

### RFP Response Acceleration

**Breaking down an RFP:**
```
Prompt: "Analyze this RFP and create a response checklist.

For each requirement, identify:
1. The specific requirement
2. Where we should address it in our response
3. Whether we have a strong, moderate, or weak position
4. Suggested approach or content

[Paste RFP]"
```

**Drafting response sections:**
```
Prompt: "Write a response to RFP Section 4.2: Technical Approach.

The requirement asks for: [paste requirement]

Our approach:
- Technology stack: React, Node.js, AWS
- Methodology: Agile with 2-week sprints
- Team composition: [describe]
- Key differentiators: [list]

Write a compelling response that addresses all requirements while 
emphasizing our strengths. Use professional but confident tone."
```

---

## Section 4: Client Communication Drafting

### The Communication Toolkit

**Difficult conversations:**
```
Prompt: "Draft a communication to [client] about [difficult topic].

Situation: [describe what happened]
Impact: [what it means for the client]
Our position: [what we're proposing/doing about it]
Desired outcome: [what we want the client to do/feel]

Tone: Professional, empathetic, takes responsibility where appropriate, 
focused on solutions rather than blame."
```

**Project status updates:**
```
Prompt: "Write a project status update email.

Project: [name]
Recipient: [client contact and their role]
Period: [week/month]

Completed: [bullet points]
In progress: [bullet points]
Upcoming: [bullet points]
Risks/Issues: [if any]
Decisions needed: [if any]

Tone: Professional, concise, proactive about issues."
```

**Proposals and SOWs:**
```
Prompt: "Draft a Statement of Work for [project].

Client: [name and context]
Project overview: [description]
Scope: [what's included, what's excluded]
Deliverables: [list]
Timeline: [milestones and dates]
Assumptions: [list]
Pricing: [approach and amount]
Terms: [payment terms, change process]

Use clear, professional language. Be specific enough to avoid 
scope disputes but flexible enough to accommodate reasonable changes."
```

### Templates and Snippets

**Build a library of AI-generated templates:**

| Communication Type | Use Case | Prompt Approach |
|-------------------|----------|-----------------|
| Project kickoff email | New project starts | Include welcome, next steps, key contacts |
| Weekly status update | Ongoing projects | Standard format, highlight risks early |
| Scope change request | Change management | Document change, impact, options |
| Issue escalation | Problems arise | Problem, impact, proposed solution |
| Project completion | Project ends | Summary, achievements, next steps |
| Invoice explanation | Billing questions | Clear breakdown, justification |

---

## Section 5: Process Documentation and SOPs

### Why This Matters for Development Firms

- **Scalability:** Documented processes allow you to grow without chaos
- **Consistency:** Same quality regardless of who does the work
- **Training:** New team members get up to speed faster
- **Compliance:** Audit trails and documented procedures

### AI-Assisted SOP Creation

**From tribal knowledge to documentation:**
```
Prompt: "Help me create a Standard Operating Procedure for [process].

What I know about the process:
- Who does it: [role]
- When it happens: [trigger/schedule]
- Steps involved: [rough list]
- Tools used: [systems/software]
- Common issues: [what goes wrong]

Create a detailed SOP including:
1. Purpose and scope
2. Roles and responsibilities
3. Step-by-step procedure with decision points
4. Quality checkpoints
5. Troubleshooting common issues
6. Related documents/templates
7. Version history section"
```

**Example: Client Onboarding SOP**
```
Prompt: "Create an SOP for client onboarding at a software development firm.

Process overview:
- Triggered when contract is signed
- Takes 1-2 weeks
- Involves: account manager, PM, technical lead, finance
- Systems: CRM, project management tool, communication platform

Key steps we do (roughly):
1. Internal kickoff meeting
2. Client welcome communication
3. Access provisioning (systems, repos, communication channels)
4. Kickoff meeting scheduling
5. Project setup in our systems
6. Requirements gathering initiation

Turn this into a complete SOP with checklists, templates, and responsible parties."
```

### Documentation Maintenance

**Keeping docs current:**
```
Prompt: "Review this existing SOP and suggest updates:

Original SOP: [paste]

Recent changes to our process:
- [change 1]
- [change 2]

Problems we've encountered:
- [issue 1]
- [issue 2]

Update the SOP to reflect these changes and address the issues."
```

---

## Hands-On Exercise: Financial Analysis with AI (25 minutes)

### Scenario

You're preparing for a quarterly business review. You have project profitability data and need to analyze it and prepare insights for your leadership team.

### Setup (provided by Tim)

**Sample dataset (participants can use their own data or this example):**

| Project | Client | Type | Revenue | Labor Cost | Direct Costs | Budgeted Hours | Actual Hours |
|---------|--------|------|---------|------------|--------------|----------------|--------------|
| Project A | Acme Corp | Fixed Price | $150,000 | $98,000 | $12,000 | 1,000 | 1,150 |
| Project B | TechStart | T&M | $80,000 | $52,000 | $5,000 | 500 | 520 |
| Project C | HealthCo | Fixed Price | $200,000 | $145,000 | $18,000 | 1,400 | 1,800 |
| Project D | RetailMax | T&M | $45,000 | $32,000 | $3,000 | 350 | 340 |
| Project E | GreenTech | Fixed Price | $175,000 | $105,000 | $15,000 | 1,100 | 1,050 |

### Exercise Steps

**Step 1: Create the spreadsheet (3 minutes)**
- Open Excel or Google Sheets
- Enter the sample data (or use your own)

**Step 2: Generate analysis formulas (5 minutes)**

Use Claude or ChatGPT:
```
Prompt: "I have this project data in Excel:
[Paste data]

Create formulas to calculate:
1. Gross profit per project
2. Gross margin percentage
3. Budget variance (hours)
4. Effective hourly rate
5. Summary totals and averages

Also suggest any additional metrics that would be valuable."
```

**Step 3: Generate insights (7 minutes)**
```
Prompt: "Analyze this project profitability data and tell me:
1. Which projects performed best and worst? Why?
2. What patterns do you see (Fixed Price vs T&M, etc.)?
3. What concerns should I raise with leadership?
4. What recommendations would you make?

[Paste data with calculated metrics]"
```

**Step 4: Create presentation points (5 minutes)**
```
Prompt: "Convert this analysis into 3 slides for a quarterly review:

Slide 1: Performance overview (key metrics)
Slide 2: Project-by-project breakdown with insights
Slide 3: Recommendations and action items

Make it executive-friendly with clear takeaways."
```

**Step 5: Share and discuss (5 minutes)**
- What insights did AI surface that you might have missed?
- How long would this analysis have taken without AI?
- What would you do differently?

---

## Key Takeaways

1. **AI transforms Excel from formula-writing to conversation** - Describe what you want in natural language

2. **First drafts of reports and presentations in minutes** - AI handles structure and content; you refine and approve

3. **Contract review becomes faster and more thorough** - AI catches issues you might miss while reading quickly

4. **Client communications become more consistent** - Build templates and let AI handle the drafting

5. **Process documentation is no longer a burden** - AI converts tribal knowledge into formal SOPs

6. **Always verify, especially for financial data** - AI can make calculation errors; double-check important numbers

---

## Discussion Questions

1. "Which business operation task takes the most time in your firm that AI could help with?"

2. "What's your biggest concern about using AI for financial analysis?"

3. "How could better documentation help your firm scale?"

4. "What client communications are hardest to write? Could AI help?"

---

## Resources

### Tools Mentioned
- Microsoft 365 Copilot: https://www.microsoft.com/microsoft-365/copilot
- Claude: https://claude.ai (excellent for long document analysis)
- ChatGPT: https://chat.openai.com

### Excel-Specific Resources
- Microsoft Copilot in Excel Guide: https://support.microsoft.com/copilot-excel
- Excel formula help: https://support.microsoft.com/excel

### Templates (suggest Tim create these)
- Standard SOW template
- Project status report template
- SOP template
- Contract review checklist

---

## Facilitator Notes for Tim

### Timing
- Introduction: 5 minutes
- Section 1 (Excel/Financial): 20 minutes
- Section 2 (Reports/Presentations): 10 minutes
- Section 3 (Contracts/Proposals): 10 minutes
- Section 4-5 (Communications/SOPs): 10 minutes
- Hands-on Exercise: 25 minutes

### Technical Setup
- Ensure participants have Excel or Google Sheets access
- Have sample data ready to distribute (can paste in chat or provide file)
- Participants need Claude or ChatGPT access (or Copilot if available)

### Common Issues
- **Copilot not available:** Most participants won't have Microsoft 365 Copilot. Emphasize Claude/ChatGPT as alternatives that work with copy/paste
- **Data sensitivity:** Remind participants about data sensitivity (covered in Module 7) - use anonymized or sample data for exercises
- **Formula errors:** AI-generated formulas sometimes have errors - emphasize verification

### Key Points to Emphasize
- AI is an accelerator, not a replacement for financial judgment
- Always verify calculations, especially for important decisions
- Build a library of prompts that work for your common tasks
- Start with lower-stakes work, build confidence, then apply to critical tasks

---

*Module 2 of 8 | AI for Development Firm Executives*
*Version 1.0 | 2025*
