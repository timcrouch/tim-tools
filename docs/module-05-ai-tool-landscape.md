# Module 5: The AI Tool Landscape

## Course: AI for Development Firm Executives
### Duration: 60-75 minutes
### Format: Overview presentation with comparison tables

---

## Learning Objectives

By the end of this module, participants will be able to:

1. Understand the major categories of AI tools relevant to development firms
2. Differentiate between coding assistants, general-purpose AI, and specialized tools
3. Know what each major tool does and who benefits most from it
4. Make informed build vs. buy decisions for AI capabilities
5. Create a shortlist of tools to evaluate for their organization

---

## Section 1: Coding Assistants

### Overview

Coding assistants integrate directly into developer workflows to suggest, generate, and refine code. They're the most directly impactful AI tools for development teams.

### GitHub Copilot

**What it is:** AI pair programmer that suggests code completions and entire functions in real-time.

**How it works:**
- Integrates into VS Code, Visual Studio, JetBrains IDEs, Neovim
- Analyzes current file and project context
- Suggests completions as you type
- Can generate entire functions from comments

**Best for:**
- Developers writing code daily
- Reducing boilerplate typing
- Learning new languages or frameworks
- Autocomplete on steroids

**Pricing (as of 2025):**
| Plan | Price | Features |
|------|-------|----------|
| Individual | $10/month or $100/year | Code completions, chat |
| Business | $19/user/month | + Admin controls, security, policy management |
| Enterprise | $39/user/month | + Fine-tuning, IP indemnity, advanced security |

**Strengths:**
- Deeply integrated into popular editors
- Large training dataset (GitHub's code)
- Excellent for autocomplete-style assistance
- Chat feature for explaining code

**Limitations:**
- Suggestions based on patterns, not understanding
- Can suggest deprecated or insecure patterns
- Context limited to current file/project
- No guaranteed IP safety (except Enterprise)

### Cursor

**What it is:** AI-first code editor built from the ground up around AI assistance.

**How it works:**
- Fork of VS Code with AI deeply integrated
- "Composer" feature for multi-file edits
- Chat that understands your entire codebase
- Can reference files, documentation, and conversations

**Best for:**
- Developers who want AI-centric workflow
- Complex refactoring across multiple files
- Teams comfortable leaving traditional editors
- Rapid prototyping and exploration

**Pricing (as of 2025):**
| Plan | Price | Features |
|------|-------|----------|
| Hobby | Free | Limited requests |
| Pro | $20/month | 500 fast requests, unlimited slow |
| Business | $40/user/month | + Team features, privacy controls |

**Strengths:**
- Purpose-built for AI development
- Excellent multi-file understanding
- Composer feature for large changes
- Very actively developed

**Limitations:**
- Must switch from familiar editor
- Learning curve for new interaction patterns
- Newer product, less mature
- Business features still developing

### Claude Code (Anthropic)

**What it is:** Claude integrated directly into terminal/CLI for AI-assisted development.

**How it works:**
- Command-line interface for AI assistance
- Can read and modify files directly
- Agentic coding—can execute multi-step tasks
- Integrates with version control

**Best for:**
- Developers comfortable in terminal
- Complex, multi-step development tasks
- Backend and infrastructure work
- Those who prefer Claude's reasoning quality

**Pricing:**
- Requires Claude Pro ($20/month) or API usage
- API pricing: Input $3/million tokens, Output $15/million tokens (Sonnet)

**Strengths:**
- Claude's strong reasoning capabilities
- Can take autonomous actions
- Good for complex problem-solving
- Works well for scripting and automation

**Limitations:**
- Terminal-based (no GUI editor integration)
- Requires comfort with CLI
- API costs can add up for heavy usage
- Less mature than Copilot ecosystem

### Amazon CodeWhisperer (now Amazon Q Developer)

**What it is:** AWS's coding assistant, especially strong for AWS services.

**How it works:**
- IDE integration (VS Code, JetBrains, AWS Cloud9)
- Code suggestions and completions
- Security scanning built in
- Optimized for AWS service integration

**Best for:**
- Teams heavily invested in AWS
- Projects requiring AWS service integration
- Organizations with Amazon/AWS relationships
- Teams wanting included security scanning

**Pricing (as of 2025):**
| Plan | Price | Features |
|------|-------|----------|
| Free Tier | $0 | Code suggestions, security scans, 50 chats/month |
| Pro | $19/user/month | Unlimited, advanced features, admin console |

**Strengths:**
- Free tier is genuinely useful
- Excellent AWS knowledge
- Built-in security scanning
- Good for enterprise compliance

**Limitations:**
- AWS-centric (less broad than others)
- Smaller market share, less community support
- Integrated tools (Amazon Q) still maturing

### Comparison Summary: Coding Assistants

| Tool | Best For | Price Range | Key Differentiator |
|------|----------|-------------|-------------------|
| GitHub Copilot | General coding, autocomplete | $10-39/user/mo | Largest ecosystem, deep IDE integration |
| Cursor | AI-centric workflow, refactoring | $0-40/user/mo | Purpose-built AI editor |
| Claude Code | Terminal users, complex tasks | $20/mo + usage | Best reasoning, agentic capabilities |
| Amazon Q Developer | AWS-heavy projects | $0-19/user/mo | AWS integration, free tier |

---

## Section 2: General-Purpose AI Assistants

### Claude (Anthropic)

**What it is:** Anthropic's flagship AI assistant known for nuanced understanding and strong writing.

**Strengths:**
- Excellent at following complex instructions
- Strong reasoning and analysis
- Very large context window (200K tokens)
- Particularly good at writing and synthesis
- Honest about uncertainty

**Best use cases for development firms:**
- Document review and synthesis
- Writing proposals and SOWs
- Complex analysis and research
- Code review explanations
- Technical writing and documentation

**Pricing (as of 2025):**
| Plan | Price | Features |
|------|-------|----------|
| Free | $0 | Limited usage, Claude Sonnet |
| Pro | $20/month | Priority access, all models, longer conversations |
| Team | $25/user/month (min 5) | + Admin, billing, workspaces |
| Enterprise | Custom | + SSO, security, dedicated support |

**API pricing:**
| Model | Input | Output |
|-------|-------|--------|
| Claude 3.5 Sonnet | $3/million tokens | $15/million tokens |
| Claude 3 Opus | $15/million tokens | $75/million tokens |
| Claude 3.5 Haiku | $0.25/million tokens | $1.25/million tokens |

### ChatGPT (OpenAI)

**What it is:** OpenAI's conversational AI, the most widely known AI assistant.

**Strengths:**
- Largest user base and ecosystem
- GPT-4 strong reasoning capabilities
- Browse web for current information
- DALL-E image generation included
- Voice conversation mode
- Extensive plugin/GPT marketplace

**Best use cases for development firms:**
- Quick research and answers
- Brainstorming and ideation
- General writing assistance
- Image generation for mockups
- Building custom GPTs for specific tasks

**Pricing (as of 2025):**
| Plan | Price | Features |
|------|-------|----------|
| Free | $0 | GPT-3.5, limited GPT-4 |
| Plus | $20/month | GPT-4, DALL-E, web browse, advanced features |
| Team | $25/user/month (annual) | + Admin, workspace, higher limits |
| Enterprise | Custom | + SSO, security, unlimited, dedicated support |

**API pricing:**
| Model | Input | Output |
|-------|-------|--------|
| GPT-4 Turbo | $10/million tokens | $30/million tokens |
| GPT-4o | $5/million tokens | $15/million tokens |
| GPT-3.5 Turbo | $0.50/million tokens | $1.50/million tokens |

### Microsoft Copilot

**What it is:** Microsoft's AI assistant, integrated across Windows, Office, and Bing.

**Strengths:**
- Deep Microsoft 365 integration
- Works with existing enterprise data
- Enterprise security and compliance
- Familiar interface for Microsoft users
- Grounded in organizational data

**Best use cases for development firms:**
- Teams using Microsoft 365 heavily
- Excel analysis and automation
- PowerPoint creation
- Email and document drafting
- Enterprise environments needing compliance

**Pricing (as of 2025):**
| Plan | Price | Features |
|------|-------|----------|
| Copilot (free) | $0 | Basic assistance, web search |
| Copilot Pro | $20/month | Priority access, Office integration (personal) |
| Microsoft 365 Copilot | $30/user/month* | Full Microsoft 365 integration |

*Requires Microsoft 365 Business Standard/Premium or Enterprise E3/E5

### Google Gemini

**What it is:** Google's AI assistant (formerly Bard), with deep Google integration.

**Strengths:**
- Google Workspace integration
- Strong multimodal capabilities (text, images, video)
- Access to current information via Search
- Growing rapidly in capabilities
- Competitive pricing

**Best use cases:**
- Google Workspace environments
- Research and fact-finding
- Multimodal tasks (analyzing images, etc.)
- Gmail and Docs integration

**Pricing (as of 2025):**
| Plan | Price | Features |
|------|-------|----------|
| Free | $0 | Basic Gemini access |
| Gemini Advanced | $20/month (in Google One AI Premium) | Gemini Ultra, 2TB storage |
| Workspace | Varies | Business integration |

### Comparison Summary: General-Purpose AI

| Tool | Best For | Price | Key Differentiator |
|------|----------|-------|-------------------|
| Claude | Complex analysis, writing | $0-25/user/mo | Best instruction-following, huge context |
| ChatGPT | Broad capabilities, ecosystem | $0-25/user/mo | Largest ecosystem, web browsing, images |
| Microsoft Copilot | Microsoft 365 environments | $0-30/user/mo | Deep Office integration |
| Google Gemini | Google Workspace users | $0-20/mo | Google integration, multimodal |

---

## Section 3: Specialized Tools

### Design Tools

**Midjourney**
- AI image generation from text prompts
- Used for: Mockups, concept art, marketing visuals
- Pricing: $10-60/month
- Access: Discord-based (unique but limiting)

**DALL-E (via ChatGPT)**
- Integrated image generation
- Used for: Quick visuals, mockups, icons
- Pricing: Included with ChatGPT Plus
- Access: Web, API

**Figma AI**
- AI features within Figma design tool
- Used for: Design suggestions, auto-layout, content generation
- Pricing: Included in Figma plans
- Access: Within Figma

**v0 by Vercel**
- AI UI component generation
- Used for: Rapid UI prototyping, component creation
- Pricing: Free tier + usage-based
- Access: Web interface

### Documentation Tools

**Notion AI**
- AI writing and editing within Notion
- Used for: Drafting, summarizing, brainstorming
- Pricing: $8/member/month add-on
- Best for: Teams already using Notion

**Scribe**
- Automatic process documentation
- Used for: SOPs, how-to guides, training materials
- Pricing: Free tier, Pro $29/user/month
- Best for: Documenting workflows and processes

**GitBook AI**
- AI assistance for technical documentation
- Used for: API docs, wikis, technical guides
- Pricing: Included in GitBook plans
- Best for: Developer documentation

### Testing Tools

**Testim**
- AI-assisted test creation and maintenance
- Used for: UI testing, test generation
- Pricing: Contact for pricing
- Best for: QA teams, automated testing

**Mabl**
- AI-powered test automation
- Used for: Regression testing, test maintenance
- Pricing: Contact for pricing
- Best for: Enterprise QA workflows

**Codium AI / Qodo**
- AI test generation from code
- Used for: Unit test creation, coverage improvement
- Pricing: Free tier, Pro plans available
- Best for: Developers wanting better test coverage

### Meeting and Communication

**Otter.ai**
- AI meeting transcription and summaries
- Used for: Meeting notes, searchable transcripts
- Pricing: Free tier, Pro $16.99/month, Business $30/user/month
- Best for: Teams with many meetings

**Fireflies.ai**
- Meeting assistant with transcription
- Used for: Recording, transcription, action items
- Pricing: Free tier, Pro $18/month, Business $29/user/month
- Best for: Sales calls, client meetings

**Grain**
- Video highlight clips and summaries
- Used for: Extracting key moments, sharing insights
- Pricing: Free tier, Starter $19/user/month
- Best for: Customer research, sales enablement

**Read.ai**
- Meeting analytics and summaries
- Used for: Meeting insights, engagement metrics
- Pricing: Free tier, Pro $19.75/month
- Best for: Understanding meeting effectiveness

### Project Management

**Linear** (with AI features)
- AI-assisted issue creation and prioritization
- Best for: Engineering teams

**Notion AI** (for PM tasks)
- AI writing for specs, updates, documentation
- Best for: Teams using Notion for PM

**ClickUp AI**
- AI across ClickUp PM features
- Best for: Teams using ClickUp

---

## Section 4: Understanding What Each Tool Does and Who Benefits

### Quick Reference Matrix

| Category | Tool | Primary Beneficiary | Impact |
|----------|------|---------------------|--------|
| Coding | GitHub Copilot | All developers | High - daily workflow |
| Coding | Cursor | Power users, refactoring | High - for adopters |
| Coding | Claude Code | CLI developers | High - complex tasks |
| Coding | Amazon Q | AWS developers | Medium - AWS focus |
| General | Claude | Everyone | High - versatile |
| General | ChatGPT | Everyone | High - versatile |
| General | M365 Copilot | Office users | High - if in MS ecosystem |
| Design | Midjourney | Designers, marketers | Medium - specialized |
| Design | v0 | Frontend developers | Medium - prototyping |
| Docs | Notion AI | Notion users | Medium - within Notion |
| Docs | Scribe | Operations, training | Medium - specific use |
| Testing | Codium/Qodo | Developers | Medium - test coverage |
| Meetings | Otter.ai | Everyone in meetings | Medium - time savings |

### Adoption Recommendations by Role

**For Executives:**
1. Claude or ChatGPT (pick one to start)
2. Meeting transcription (Otter.ai or similar)
3. Microsoft Copilot (if using Office heavily)

**For Developers:**
1. GitHub Copilot (universal recommendation)
2. Claude or ChatGPT for complex problem-solving
3. Cursor for those wanting AI-first workflow

**For Project Managers:**
1. Claude or ChatGPT for writing and analysis
2. Meeting transcription tool
3. Documentation AI (Notion AI, etc.)

**For Designers:**
1. Figma AI (if using Figma)
2. Midjourney or DALL-E for concept generation
3. v0 for UI component prototyping

---

## Section 5: Build vs. Buy Considerations

### When to Use Off-the-Shelf Tools

**Buy (use existing tools) when:**

✅ The tool solves a common, well-defined problem
✅ You need to move fast and validate before investing
✅ The tool integrates with your existing workflows
✅ Cost is reasonable relative to alternative (building or hiring)
✅ You don't have unique requirements
✅ The vendor has staying power

**Examples:**
- Meeting transcription → Buy Otter.ai
- Code autocomplete → Buy GitHub Copilot
- General AI assistance → Use Claude/ChatGPT
- Document analysis → Use Claude

### When to Build Custom Solutions

**Build (or customize) when:**

✅ You have unique data that provides competitive advantage
✅ Off-the-shelf tools don't meet specific requirements
✅ You need deep integration with proprietary systems
✅ Security/compliance requires your own infrastructure
✅ You're building AI capabilities as a product or service
✅ Cost of licensing doesn't scale with your business

**Examples:**
- Custom client portals with AI features
- Proprietary analysis tools for your domain
- AI features in products you sell
- Integration with legacy systems

### The Hybrid Approach

**Most common pattern:**

1. **Start with off-the-shelf** - Use Claude, ChatGPT, Copilot for immediate value
2. **Identify gaps** - Where do existing tools fall short?
3. **Customize where needed** - Build custom solutions for unique needs
4. **Build on APIs** - Use AI provider APIs for custom integration

**Example hybrid approach:**
- General AI: ChatGPT/Claude subscriptions for team
- Coding: GitHub Copilot for all developers
- Custom: Fine-tuned model for your specific domain terminology
- Integration: Custom tool using Claude API for proposal generation with your templates

### Cost Comparison Framework

| Approach | Upfront Cost | Ongoing Cost | Time to Value | Flexibility |
|----------|--------------|--------------|---------------|-------------|
| Off-the-shelf | Low | Subscription | Days | Limited |
| Custom build | High | Maintenance | Months | High |
| Hybrid | Medium | Mixed | Weeks | Medium |

---

## Section 6: Creating Your AI Tool Stack

### Assessment Questions

**For each potential tool, ask:**

1. **Who will use it?** (Individuals, teams, whole company)
2. **What problem does it solve?** (Be specific)
3. **What does it cost?** (Per user, total, including adoption)
4. **What does it integrate with?** (Your existing tools)
5. **What's the security posture?** (Data handling, compliance)
6. **What's the switching cost?** (If it doesn't work out)

### Recommended Starting Stack

**For a 50-person development firm:**

| Category | Tool | Users | Monthly Cost |
|----------|------|-------|--------------|
| General AI | Claude Team | 20 key users | $500 |
| Coding | GitHub Copilot Business | 25 developers | $475 |
| Meetings | Otter.ai Business | 30 people | $900 |
| **Total** | | | **~$1,875/month** |

**Estimated ROI:** If these tools save 1 hour/week per user, that's ~200 hours/month. At $75/hour average cost, that's $15,000 in recovered productivity—8x the cost.

### Scaling Considerations

**As you grow, consider:**
- Enterprise tiers for better security and admin controls
- API access for custom integrations
- Consolidated vendors where possible
- Training programs to drive adoption

---

## Hands-On Exercise: Tool Evaluation (15 minutes)

### Instructions

**Pick one category of tools from this module. Evaluate it for your organization:**

1. **Define the need** (3 minutes)
   - What problem are you trying to solve?
   - Who would benefit?
   - What does success look like?

2. **Compare options** (5 minutes)
   - List 2-3 tools that could work
   - Compare pricing for your team size
   - Note key differences

3. **Assess fit** (4 minutes)
   - Integration with existing tools?
   - Security/compliance requirements?
   - Buy-in from potential users?

4. **Make a recommendation** (3 minutes)
   - Which tool, if any?
   - What's the pilot plan?
   - How will you measure success?

---

## Key Takeaways

1. **Coding assistants are high-impact** - GitHub Copilot or Cursor for developers provides immediate, measurable value

2. **General-purpose AI is versatile** - Claude and ChatGPT overlap significantly; pick one and go deep

3. **Microsoft ecosystem has advantages** - If you're all-in on Microsoft, Copilot integration is powerful

4. **Specialized tools have their place** - Meeting transcription, documentation tools solve specific pain points

5. **Start simple, expand thoughtfully** - Don't adopt 10 tools at once. Start with 2-3, prove value, then expand

6. **Build vs. buy is usually "buy first"** - Use off-the-shelf until you outgrow it, then customize

---

## Quick Reference Card

### Essential Links

**Coding Assistants:**
- GitHub Copilot: https://github.com/features/copilot
- Cursor: https://cursor.sh
- Claude Code: https://docs.anthropic.com/claude-code
- Amazon Q: https://aws.amazon.com/q/developer/

**General AI:**
- Claude: https://claude.ai
- ChatGPT: https://chat.openai.com
- Microsoft Copilot: https://copilot.microsoft.com
- Google Gemini: https://gemini.google.com

**Specialized:**
- Otter.ai: https://otter.ai
- v0: https://v0.dev
- Notion AI: https://notion.so/product/ai
- Midjourney: https://midjourney.com

---

## Facilitator Notes for Tim

### Timing
- Section 1 (Coding Assistants): 15 minutes
- Section 2 (General AI): 12 minutes
- Section 3 (Specialized Tools): 12 minutes
- Section 4 (Who Benefits): 8 minutes
- Section 5 (Build vs Buy): 8 minutes
- Section 6 (Tool Stack): 5 minutes
- Exercise: 15 minutes

### Key Points to Emphasize

1. **Don't overwhelm** - This module covers many tools. Emphasize starting with 2-3, not all at once.

2. **Pricing changes** - AI tool pricing is volatile. Verify current prices before presenting.

3. **Focus on use cases** - Tools are means to ends. Help participants think about problems to solve, not tools to buy.

4. **Security matters** - Preview Module 7's content on governance when discussing enterprise features.

### Likely Questions

**"Which one is best?"**
> Depends on your needs. For most development firms, GitHub Copilot + Claude or ChatGPT is a solid starting point. Add from there based on specific needs.

**"How do we get developers to actually use these?"**
> Start with enthusiastic early adopters. Let them demonstrate value. Make tools easy to access. Don't mandate—let success stories spread.

**"What about tool X that I heard about?"**
> The landscape changes constantly. The evaluation framework in Section 5 applies to any tool.

---

*Module 5 of 8 | AI for Development Firm Executives*
*Version 1.0 | 2025*
