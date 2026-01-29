# Module 6: AI Costs, Licensing, and Budget Management

## Course: AI for Development Firm Executives
### Duration: 60-75 minutes
### Format: Presentation with cost modeling exercise

---

## Learning Objectives

By the end of this module, participants will be able to:

1. Understand the different pricing models for AI tools (per-seat, usage-based, tiered)
2. Reference current pricing for major AI tools used by development firms
3. Manage licenses effectively as AI adoption scales
4. Build realistic budgets for AI tools across different team sizes
5. Identify and account for hidden costs in AI adoption
6. Make informed decisions about which pricing tiers to select

---

## Section 1: Understanding AI Pricing Models

### Per-Seat (Per-User) Pricing

**How it works:**
- Fixed monthly or annual cost per user
- All users get same features (within tier)
- Predictable costs, easy to budget
- Often includes volume discounts at scale

**Examples:**
- GitHub Copilot: $19/user/month (Business)
- Microsoft 365 Copilot: $30/user/month
- Claude Team: $25/user/month

**Pros:**
- Predictable costs
- Easy to budget
- Users can use as much as they want
- Simple license management

**Cons:**
- Paying for inactive users ("shelfware")
- Can be expensive for large teams with low adoption
- May be overkill for occasional users

**When it works best:**
- Tools used daily by most/all assigned users
- Organizations that value predictability
- When usage would be high enough that per-use would cost more

### Usage-Based (Consumption) Pricing

**How it works:**
- Pay per API call, token, or unit of work
- Cost varies with actual usage
- Often has free tier or credits to start
- Can be unpredictable at scale

**Examples:**
- OpenAI API: $5-15 per million tokens (GPT-4o)
- Claude API: $3-15 per million tokens (Sonnet)
- AWS AI services: Various per-request pricing

**Pros:**
- Pay only for what you use
- Low barrier to start
- Scales down to zero if not used
- Good for variable or uncertain usage

**Cons:**
- Unpredictable costs
- Can spike unexpectedly
- Requires monitoring
- Harder to budget

**When it works best:**
- Building AI into products (need per-transaction economics)
- Variable or uncertain usage patterns
- When you need flexibility to scale up/down
- Development and testing phases

### Tiered Pricing

**How it works:**
- Different feature sets at different price points
- Usually: Free → Pro → Team/Business → Enterprise
- Higher tiers include more features, security, support
- Some tiers are per-seat, some are flat

**Common tier structure:**

| Tier | Typical Features | Typical Price |
|------|------------------|---------------|
| Free | Basic features, rate limits | $0 |
| Pro/Plus | Full features, individual use | $20/month |
| Team/Business | Collaboration, admin controls | $25-40/user/month |
| Enterprise | SSO, security, SLAs, custom | Custom pricing |

**Navigating tier decisions:**

- **Free tier:** Good for evaluation, personal experimentation
- **Pro tier:** Individual power users not needing team features
- **Team tier:** When you need admin controls, billing consolidation
- **Enterprise tier:** When you need SSO, compliance, or dedicated support

### Hybrid Pricing Models

**Some tools combine models:**

**Base fee + usage:**
- Flat monthly fee for platform access
- Plus per-transaction or per-user costs
- Example: Some enterprise AI platforms

**Per-seat with usage caps:**
- Fixed per-user fee
- With soft or hard limits on usage
- Overages charged separately or throttled

**Commitment-based discounts:**
- Annual contracts for lower per-unit rates
- Volume commitments for API usage discounts
- Example: AWS, Azure AI services

---

## Section 2: Current Pricing Reference (2025)

### Coding Assistants

| Tool | Tier | Monthly Price | Annual Price | Key Features |
|------|------|---------------|--------------|--------------|
| **GitHub Copilot** | Individual | $10 | $100 | Completions, chat |
| | Business | $19/user | - | + Admin, policies |
| | Enterprise | $39/user | - | + Fine-tuning, IP indemnity |
| **Cursor** | Hobby | Free | - | Limited requests |
| | Pro | $20 | - | 500 fast, unlimited slow |
| | Business | $40/user | - | + Team features, privacy |
| **Amazon Q Developer** | Free | $0 | - | Suggestions, 50 chats/mo |
| | Pro | $19/user | - | Unlimited, admin console |

### General-Purpose AI

| Tool | Tier | Monthly Price | Key Features |
|------|------|---------------|--------------|
| **Claude** | Free | $0 | Limited usage |
| | Pro | $20 | Full access, priority |
| | Team | $25/user (min 5) | Admin, workspaces |
| | Enterprise | Custom | SSO, security, support |
| **ChatGPT** | Free | $0 | GPT-3.5, limited 4 |
| | Plus | $20 | GPT-4, DALL-E, browse |
| | Team | $25/user (annual) | Admin, workspace |
| | Enterprise | Custom | Security, SSO, unlimited |
| **Microsoft 365 Copilot** | Copilot Pro | $20 | Personal Office integration |
| | M365 Copilot | $30/user* | Full enterprise integration |

*Requires M365 Business/Enterprise subscription

### API Pricing (for custom development)

**OpenAI API:**
| Model | Input | Output |
|-------|-------|--------|
| GPT-4 Turbo | $10/M tokens | $30/M tokens |
| GPT-4o | $5/M tokens | $15/M tokens |
| GPT-4o mini | $0.15/M tokens | $0.60/M tokens |
| GPT-3.5 Turbo | $0.50/M tokens | $1.50/M tokens |

**Anthropic (Claude) API:**
| Model | Input | Output |
|-------|-------|--------|
| Claude 3.5 Sonnet | $3/M tokens | $15/M tokens |
| Claude 3 Opus | $15/M tokens | $75/M tokens |
| Claude 3.5 Haiku | $0.25/M tokens | $1.25/M tokens |

**Token estimation:**
- 1 token ≈ 4 characters or ¾ of a word
- 1,000 tokens ≈ 750 words
- 1 million tokens ≈ 750,000 words ≈ 3,000 pages of text

### Specialized Tools

| Tool | Tier | Monthly Price | Notes |
|------|------|---------------|-------|
| **Otter.ai** | Free | $0 | 300 min/month |
| | Pro | $16.99 | 1200 min/month |
| | Business | $30/user | 6000 min/month, admin |
| **Notion AI** | Add-on | $8/member | On top of Notion plan |
| **Midjourney** | Basic | $10 | ~200 generations |
| | Standard | $30 | Unlimited relaxed |
| | Pro | $60 | Unlimited fast |
| **v0** | Free | $0 | Limited generations |
| | Premium | $20 | More generations, features |

---

## Section 3: License Management Considerations

### Common License Management Challenges

**1. Shelfware (Unused Licenses)**

*Problem:* You're paying for seats that aren't being used.

*Causes:*
- Over-optimistic initial purchase
- Employee turnover
- Low adoption rates
- "Nice to have" vs. actually used

*Solutions:*
- Regular usage audits (quarterly)
- Right-size licenses to actual users
- Consider usage-based alternatives for occasional users
- Set up automated alerts for inactive accounts

**2. Shadow AI (Ungoverned Tool Proliferation)**

*Problem:* Employees use personal subscriptions or unapproved tools.

*Causes:*
- Approved tools too limited or slow to provision
- Employees want specific features
- Lack of awareness about corporate tools

*Solutions:*
- Make approved tools easy to access
- Respond quickly to new tool requests
- Audit periodically for unauthorized usage
- Balance security with usability

**3. Scaling Costs**

*Problem:* Costs grow faster than expected as adoption increases.

*Causes:*
- Success! More people want to use the tools
- API usage exceeds projections
- Moving from pilot to production

*Solutions:*
- Plan for success scenarios in budgets
- Negotiate volume discounts early
- Set usage alerts and budgets on API access
- Consider annual commitments for predictable tools

### License Optimization Strategies

**Right-sizing by role:**

| Role | Coding Assistant | General AI | Specialized |
|------|-----------------|------------|-------------|
| Developer | ✓ Full | Pro/Team | As needed |
| PM | Maybe | ✓ Team | ✓ Meeting tools |
| Executive | No | ✓ Pro/Team | ✓ Meeting tools |
| Sales | No | ✓ Pro/Team | ✓ Proposal tools |
| Support | Maybe | ✓ Pro/Team | ✓ Docs tools |

**Pooled vs. Named Licenses:**
- Some tools allow shared/pooled licenses
- Can reduce costs if usage is distributed
- Need to verify terms—many require named users

**Annual vs. Monthly:**
- Annual often 15-20% cheaper
- Trade-off: commitment vs. flexibility
- Consider annual for proven tools, monthly for new ones

---

## Section 4: Budgeting for AI as Adoption Scales

### Phased Budgeting Approach

**Phase 1: Pilot (3-6 months)**
- Small group of enthusiastic adopters
- Multiple tools for evaluation
- Budget: $500-2,000/month

**Phase 2: Controlled Expansion (6-12 months)**
- Expand to interested teams
- Standardize on winning tools
- Budget: $2,000-5,000/month

**Phase 3: Broad Adoption (12+ months)**
- Organization-wide rollout
- Enterprise agreements where beneficial
- Budget: $5,000-15,000+/month (depending on size)

### Budget Template: 50-Person Development Firm

**Conservative Scenario (Selective Adoption):**

| Category | Tool | Users | Monthly Cost |
|----------|------|-------|--------------|
| Coding | GitHub Copilot Business | 20 devs | $380 |
| General AI | Claude Team | 15 users | $375 |
| Meetings | Otter.ai Pro | 10 users | $170 |
| **Total** | | | **$925/month** |
| **Annual** | | | **$11,100** |

**Moderate Scenario (Broad Adoption):**

| Category | Tool | Users | Monthly Cost |
|----------|------|-------|--------------|
| Coding | GitHub Copilot Business | 30 devs | $570 |
| General AI | Claude Team | 30 users | $750 |
| Meetings | Otter.ai Business | 30 users | $900 |
| M365 Copilot | Microsoft | 15 users | $450 |
| Misc/Specialized | Various | - | $300 |
| **Total** | | | **$2,970/month** |
| **Annual** | | | **$35,640** |

**Aggressive Scenario (Full Enterprise):**

| Category | Tool | Users | Monthly Cost |
|----------|------|-------|--------------|
| Coding | GitHub Copilot Enterprise | 40 devs | $1,560 |
| General AI | Claude Enterprise | 50 users | Custom (~$1,500) |
| M365 Copilot | Microsoft | 50 users | $1,500 |
| Meetings | Otter.ai Business | 50 users | $1,500 |
| Specialized | Various | - | $500 |
| **Total** | | | **$6,560/month** |
| **Annual** | | | **~$79,000** |

### ROI Justification Framework

**Basic calculation:**

```
Hours saved per user per week × Users × Weeks × Hourly cost rate
= Productivity value

vs.

Annual AI tool cost
= Investment

ROI = (Productivity value - Investment) / Investment
```

**Example:**
- 30 users saving 2 hours/week
- 52 weeks
- $75/hour fully-loaded cost
- = 30 × 2 × 52 × $75 = $234,000 in productivity value

If AI tools cost $36,000/year:
- ROI = ($234,000 - $36,000) / $36,000 = 550% ROI
- Payback period: ~2 months

**More conservative estimate:**
Even if you assume only 1 hour/week savings:
- = $117,000 in productivity value
- ROI = 225%

---

## Section 5: Hidden Costs of AI Adoption

### Training and Onboarding

**Often overlooked costs:**

| Item | Typical Cost | Notes |
|------|--------------|-------|
| Initial training time | 2-4 hours/employee | Lost productivity during learning |
| Training materials | $0-2,000 | Depends on approach |
| External training | $200-500/person | If using courses/workshops |
| Ongoing learning | 1-2 hours/month | Keeping up with updates |

**Best practice:** Factor 5-10 hours of onboarding time per employee in first month.

### Integration and Setup

**Technical setup costs:**

| Item | Typical Cost | Notes |
|------|--------------|-------|
| IT configuration | 4-16 hours | SSO, security settings |
| Policy development | 8-20 hours | Creating use guidelines |
| Custom integration | Varies widely | API integration work |
| Security review | 8-40 hours | Vetting tools for compliance |

### Productivity Dip

**The adoption curve:**

```
Week 1-2: Productivity often DECREASES (learning new tools)
Week 3-4: Return to baseline (tools become familiar)
Week 5+: Productivity gains emerge
```

**Account for this in planning:** First month may be net-neutral or slight loss before gains appear.

### Opportunity Costs

**What are people NOT doing while using AI tools?**

- Time spent prompting = time not coding directly
- Learning tools = time not on billable work
- Evaluating tools = time not on projects

**Mitigation:** 
- Treat AI adoption as an investment with payback period
- Don't measure ROI too early
- Budget for learning time explicitly

### Management Overhead

**Ongoing management needs:**

| Task | Time Estimate | Frequency |
|------|---------------|-----------|
| License management | 2-4 hours | Monthly |
| Usage audits | 2-4 hours | Quarterly |
| Policy updates | 4-8 hours | Semi-annually |
| Vendor management | 2-4 hours | Monthly |
| Tool evaluation | 8-16 hours | Quarterly |

### Compliance and Security

**Often underestimated:**

- Security assessments for new tools
- Data classification updates
- Policy enforcement technology
- Audit trail maintenance
- Compliance documentation

**Estimate: Add 10-15% to tool costs for governance overhead**

---

## Section 6: Cost Optimization Strategies

### Negotiation Tactics

**1. Volume Discounts**
- Ask for discounts at 50, 100, 250+ seats
- Often not advertised but available
- Best timing: end of quarter/year for vendor

**2. Annual Commitments**
- Typical savings: 15-20% vs. monthly
- Trade-off: flexibility
- Consider for proven, strategic tools

**3. Multi-Product Bundles**
- Microsoft 365 bundle savings
- GitHub + Copilot + Azure discounts
- Ask about enterprise agreements

**4. Startup/Nonprofit Discounts**
- Many vendors offer reduced pricing
- Check for programs you qualify for

### Cost Containment Mechanisms

**Set spending limits:**
- Configure budget alerts in cloud portals
- Set API usage caps
- Monitor and review monthly

**Implement approval workflows:**
- New tool requests need approval
- Seats added by request (not automatically)
- Quarterly true-ups vs. self-service

**Right-size regularly:**
- Quarterly license reviews
- Remove inactive users
- Downgrade where appropriate

### Total Cost of Ownership Framework

**When evaluating tools, consider:**

| Cost Category | Questions to Ask |
|---------------|------------------|
| Direct costs | What's the sticker price? |
| Implementation | What does setup cost in time/effort? |
| Training | How long to get proficient? |
| Integration | Does it connect to our systems? |
| Maintenance | What ongoing effort is required? |
| Risk | What if vendor goes away or pivots? |

---

## Hands-On Exercise: Build Your AI Budget (15 minutes)

### Instructions

**Create a 12-month AI tool budget for your organization:**

1. **Inventory current state** (3 minutes)
   - What AI tools are you using now?
   - What are you paying?
   - What's working/not working?

2. **Plan Phase 1** (4 minutes)
   - What tools for which users?
   - What's the monthly cost?
   - What's the expected benefit?

3. **Project Phase 2** (4 minutes)
   - If Phase 1 succeeds, what expands?
   - What's the scaled cost?
   - What new capabilities?

4. **Calculate ROI** (4 minutes)
   - Estimated hours saved per week
   - Value of those hours
   - Payback period

### Budget Worksheet

| Phase | Tool | Users | Monthly $ | Annual $ | Expected Benefit |
|-------|------|-------|-----------|----------|------------------|
| Phase 1 (Mo 1-3) | | | | | |
| Phase 1 (Mo 1-3) | | | | | |
| Phase 2 (Mo 4-6) | | | | | |
| Phase 2 (Mo 4-6) | | | | | |
| Phase 3 (Mo 7-12) | | | | | |
| **Total Year 1** | | | | | |

---

## Key Takeaways

1. **Understand your pricing model** - Per-seat vs. usage-based have different dynamics; choose based on your usage patterns

2. **Start small, scale thoughtfully** - Pilot before committing to large deployments; measure actual usage and value

3. **Hidden costs are real** - Training, integration, management overhead add 15-25% to direct costs

4. **Right-size actively** - Quarterly reviews prevent shelfware; don't pay for what you don't use

5. **Negotiate everything** - Volume discounts, annual commitments, and bundles are almost always available

6. **Budget for success** - Plan for what happens when pilots succeed; scaling costs should be expected, not surprises

---

## Reference: Quick Cost Calculator

### Per-User Monthly Costs (Team/Business Tiers)

| Tool | Cost | Usage Profile |
|------|------|---------------|
| GitHub Copilot Business | $19 | Daily developer tool |
| Claude Team | $25 | Daily assistant |
| ChatGPT Team | $25 | Daily assistant |
| Microsoft 365 Copilot | $30 | Daily Office user |
| Otter.ai Business | $30 | 1-2 meetings/day |
| Cursor Business | $40 | Daily dev tool |

### Quick Math for a Developer

| Tool | Monthly | Annual | Time Saved | Break-even |
|------|---------|--------|------------|------------|
| Copilot | $19 | $228 | 15 min/day | 3 hours/year to break even |
| Claude | $25 | $300 | 15 min/day | 4 hours/year to break even |
| Both | $44 | $528 | 30 min/day | 7 hours/year to break even |

At $100/hour effective cost, if a developer saves 30 minutes per day:
- Annual savings: 125 hours × $100 = $12,500
- Annual cost: $528
- **ROI: 2,268%**

Even if you assume just 15 minutes/day of real savings, ROI exceeds 1,000%.

---

## Facilitator Notes for Tim

### Timing
- Section 1 (Pricing Models): 10 minutes
- Section 2 (Current Pricing): 12 minutes
- Section 3 (License Management): 10 minutes
- Section 4 (Budgeting): 12 minutes
- Section 5 (Hidden Costs): 8 minutes
- Section 6 (Optimization): 8 minutes
- Exercise: 15 minutes

### Key Points to Emphasize

1. **Pricing changes frequently** - Verify numbers before presenting; these are as of early 2025

2. **Start conservative** - Better to under-budget and expand than over-commit early

3. **Measure actual usage** - Decisions should be based on data, not assumptions

4. **ROI is real but takes time** - Don't expect immediate payback; budget for learning curve

### Common Questions

**"What's the minimum budget to get started?"**
> $200-500/month gets you meaningful tools for a pilot group. Claude Pro ($20) + GitHub Copilot ($19) = $39/user/month for core capabilities.

**"How do I justify this to the CFO?"**
> Frame as productivity investment. If each user saves 1 hour/week at $75/hour, that's $3,900/year per person. Most tools cost $300-600/year. The math works.

**"What if people don't use the tools?"**
> Start with volunteers, not mandates. Measure usage early. Right-size before scaling.

### Warning: Pricing Volatility

AI tool pricing is in flux. OpenAI, Anthropic, Microsoft, and others adjust pricing frequently (usually downward as competition increases). Before presenting this module:

1. Verify GitHub Copilot pricing: https://github.com/features/copilot
2. Verify Claude pricing: https://claude.ai/pricing
3. Verify ChatGPT pricing: https://openai.com/chatgpt/pricing
4. Verify Microsoft Copilot pricing: https://www.microsoft.com/microsoft-365/copilot

---

*Module 6 of 8 | AI for Development Firm Executives*
*Version 1.0 | 2025*
